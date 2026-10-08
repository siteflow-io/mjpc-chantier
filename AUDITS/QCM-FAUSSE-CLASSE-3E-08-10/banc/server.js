// Serveur du banc : faux hub en mémoire + pages locales + routes Playwright.
// Le vrai hub n'est JAMAIS joint : le SDK Firebase est remplacé, et toute
// requête vers *.firebasedatabase.app / *.firebaseio.com est servie ici.
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { WebSocketServer } = require("ws");

const ROOT = __dirname;
const APP_FILE = "/home/claude/QCM/evaluation-qcm.html";

function norm(p){ p = String(p == null ? "" : p); return p.replace(/\/+/g, "/").replace(/^\/|\/$/g, ""); }
function parts(p){ return p ? p.split("/") : []; }
function join(a, b){ a = norm(a); b = norm(b); return a ? (b ? a + "/" + b : a) : b; }
function clean(v){
  if(v === undefined || v === null) return null;
  if(typeof v === "object"){
    if(v[".sv"] === "timestamp") return Date.now();
    const out = {}; let n = 0;
    const ks = Array.isArray(v) ? v.map((_, i) => i) : Object.keys(v);
    for(const k of ks){ const c = clean(v[k]); if(c !== null){ out[String(k)] = c; n++; } }
    return n ? out : null;
  }
  return v;
}
function canon(v){
  if(v === null || typeof v !== "object") return JSON.stringify(v);
  return "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";
}

function makeStore(initial){
  let tree = clean(initial) || {};
  function get(p){
    let cur = tree;
    for(const k of parts(norm(p))){ if(cur == null || typeof cur !== "object") return null; cur = cur[k]; }
    return cur === undefined ? null : cur;
  }
  function setAt(p, v){
    const ps = parts(norm(p));
    if(!ps.length){ tree = v || {}; return; }
    let cur = tree; const chain = [];
    for(let i = 0; i < ps.length - 1; i++){
      if(cur[ps[i]] == null || typeof cur[ps[i]] !== "object"){ if(v === null) return; cur[ps[i]] = {}; }
      chain.push([cur, ps[i]]); cur = cur[ps[i]];
    }
    const last = ps[ps.length - 1];
    if(v === null) delete cur[last]; else cur[last] = v;
    for(let j = chain.length - 1; j >= 0; j--){
      const [o, k] = chain[j];
      if(o[k] && typeof o[k] === "object" && !Object.keys(o[k]).length) delete o[k]; else break;
    }
  }
  function apply(op){
    if(op.t === "set") setAt(op.p, op.v);
    else if(op.t === "update") for(const k of Object.keys(op.v || {})) setAt(join(op.p, k), op.v[k]);
  }
  return { get, apply, tree: () => tree, canon };
}

function empreinte(code, sel){
  return crypto.pbkdf2Sync(Buffer.from(String(code)), Buffer.from("mjpc-empreinte-v1|" + sel), 100000, 32, "sha256").toString("hex");
}

function startServer(initialTree, port, log){
  const store = makeStore(initialTree);
  const clients = new Set();
  const journal = [];          // toutes les écritures, horodatées
  const watchers = [];         // fonctions (op) appelées après chaque écriture
  function record(op, from){
    journal.push({ts: Date.now(), from, op});
    for(const w of watchers){ try{ w(op); }catch(e){ console.error(e); } }
  }
  function broadcast(op, except){
    const msg = JSON.stringify({t: "op", op});
    for(const c of clients) if(c !== except && c.readyState === 1) c.send(msg);
  }
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://localhost");
    if(u.pathname === "/evaluation-qcm.html"){
      res.writeHead(200, {"content-type": "text/html; charset=utf-8", "cache-control": "no-store"});
      res.end(fs.readFileSync(APP_FILE)); return;
    }
    res.writeHead(404); res.end("absent");
  });
  const wss = new WebSocketServer({ server, path: "/ws" });
  wss.on("connection", (ws) => {
    ws._od = [];
    clients.add(ws);
    ws.send(JSON.stringify({t: "init", tree: store.tree()}));
    ws.on("message", (data) => {
      const m = JSON.parse(String(data));
      if(m.t === "op"){
        store.apply(m.op); record(m.op, "ws"); broadcast(m.op, ws);
        ws.send(JSON.stringify({t: "ack", id: m.id}));
      } else if(m.t === "cas"){
        const ok = canon(store.get(m.p)) === m.expect;
        if(ok){ const op = {t: "set", p: m.p, v: m.v}; store.apply(op); record(op, "cas"); broadcast(op, ws); }
        ws.send(JSON.stringify({t: "ack", id: m.id, ok}));
      } else if(m.t === "od"){
        if(m.op.t === "odcancel") ws._od = ws._od.filter(o => o.p !== m.op.p);
        else ws._od.push(m.op);
        ws.send(JSON.stringify({t: "ack", id: m.id}));
      }
    });
    ws.on("close", () => {
      clients.delete(ws);
      for(const op0 of ws._od){
        const op = JSON.parse(JSON.stringify(op0));
        store.apply(op); record(op, "onDisconnect"); broadcast(op, null);
      }
    });
  });
  return new Promise((resolve) => server.listen(port, () => resolve({
    store, journal, watchers, broadcast, record, port,
    close: () => new Promise(r => { for(const c of clients) c.terminate(); wss.close(); server.close(() => r()); })
  })));
}

// Routes Playwright : tout ce qui sort est servi localement ou bloqué.
async function installRoutes(context, srv, log){
  const FAKE = fs.readFileSync(path.join(ROOT, "fakefb.js"));
  const REACT = fs.readFileSync(path.join(ROOT, "node_modules/react/umd/react.production.min.js"));
  const REACTDOM = fs.readFileSync(path.join(ROOT, "node_modules/react-dom/umd/react-dom.production.min.js"));
  await context.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    if(url.startsWith("http://localhost:" + srv.port + "/")) return route.continue();
    if(/www\.gstatic\.com\/firebasejs\/8\.10\.1\/firebase-app\.js/.test(url))
      return route.fulfill({status: 200, contentType: "application/javascript", body: FAKE});
    if(/www\.gstatic\.com\/firebasejs\/8\.10\.1\/firebase-database\.js/.test(url))
      return route.fulfill({status: 200, contentType: "application/javascript", body: "/* fakefb : rien */"});
    if(/unpkg\.com\/react@17\/umd\/react\.production\.min\.js/.test(url))
      return route.fulfill({status: 200, contentType: "application/javascript", body: REACT});
    if(/unpkg\.com\/react-dom@17\/umd\/react-dom\.production\.min\.js/.test(url))
      return route.fulfill({status: 200, contentType: "application/javascript", body: REACTDOM});
    const hub = url.match(/^https:\/\/[^\/]*(firebasedatabase\.app|firebaseio\.com)(\/[^?]*)?(\?.*)?$/);
    if(hub){
      let p = decodeURIComponent((hub[2] || "/").replace(/\.json$/, ""));
      const method = req.method();
      log && log("REST " + method + " " + p);
      if(method === "GET"){
        const q = hub[3] || "";
        let v = srv.store.get(p);
        if(/shallow=true/.test(q) && v && typeof v === "object"){ const o = {}; for(const k of Object.keys(v)) o[k] = true; v = o; }
        return route.fulfill({status: 200, contentType: "application/json", body: JSON.stringify(v), headers: {"access-control-allow-origin": "*"}});
      }
      if(method === "OPTIONS")
        return route.fulfill({status: 204, headers: {"access-control-allow-origin": "*", "access-control-allow-methods": "GET,PUT,PATCH,POST,DELETE", "access-control-allow-headers": "*"}});
      let body = null; try{ body = JSON.parse(req.postData() || "null"); }catch(e){}
      let op, resBody = body;
      if(method === "PUT") op = {t: "set", p, v: clean(body)};
      else if(method === "PATCH"){ const v = {}; for(const k of Object.keys(body || {})) v[norm(k)] = clean(body[k]); op = {t: "update", p, v}; }
      else if(method === "DELETE") op = {t: "set", p, v: null};
      else if(method === "POST"){ const k = "-rest" + Date.now(); op = {t: "set", p: join(p, k), v: clean(body)}; resBody = {name: k}; }
      if(op){ srv.store.apply(op); srv.record(op, "rest"); srv.broadcast(op, null); }
      return route.fulfill({status: 200, contentType: "application/json", body: JSON.stringify(resBody), headers: {"access-control-allow-origin": "*"}});
    }
    log && log("BLOQUÉ " + req.method() + " " + url);
    return route.abort();
  });
}

module.exports = { startServer, installRoutes, empreinte, clean, canon };

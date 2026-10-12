/* fakefb.js — faux Firebase 8 (base temps réel), partagé entre pages par un
   serveur local (WebSocket). Remplace firebase-app.js ; firebase-database.js
   est servi vide. Aucune connexion au vrai hub : tout vit dans le serveur du banc.
   Fidélités voulues : écoutes "value" seulement (seules utilisées par le QCM),
   off() sans argument retire TOUTES les écoutes de l'adresse, tableaux stockés
   comme objets à clés numériques (les cases vides disparaissent), relecture en
   tableau si plus de la moitié des indices sont pleins, ServerValue.TIMESTAMP,
   onDisconnect, transaction. */
(function(){
  var WS_URL = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws";
  var tree = null, ready = false;
  var buffered = [];            // écritures faites avant le premier état
  var waiters = [];             // once() en attente du premier état
  var listeners = [];           // {path, cb, ctx, last, pending}
  var ws = null, reqId = 0, acks = {};
  var outbox = [];

  function norm(p){ p = String(p == null ? "" : p); p = p.replace(/\/+/g, "/").replace(/^\/|\/$/g, ""); return p; }
  function parts(p){ return p ? p.split("/") : []; }
  function join(a, b){ a = norm(a); b = norm(b); return a ? (b ? a + "/" + b : a) : b; }
  function related(a, b){ return a === b || a === "" || b === "" || a.indexOf(b + "/") === 0 || b.indexOf(a + "/") === 0; }

  function getAt(t, p){
    if(p === ".info/connected") return true;
    if(p === ".info/serverTimeOffset") return 0;
    var ps = parts(p), cur = t;
    for(var i = 0; i < ps.length; i++){
      if(cur == null || typeof cur !== "object") return null;
      cur = cur[ps[i]];
    }
    return cur === undefined ? null : cur;
  }
  function clean(v){
    if(v === undefined || v === null) return null;
    if(typeof v === "object"){
      if(v[".sv"] === "timestamp") return Date.now();
      var out = {}, n = 0;
      var ks = Array.isArray(v) ? v.map(function(_, i){ return i; }) : Object.keys(v);
      for(var i = 0; i < ks.length; i++){
        var c = clean(v[ks[i]]);
        if(c !== null){ out[String(ks[i])] = c; n++; }
      }
      return n ? out : null;
    }
    if(typeof v === "number" && !isFinite(v)) throw new Error("fakefb: nombre invalide");
    if(typeof v === "function") throw new Error("fakefb: fonction");
    return v;
  }
  function setAtLocal(p, v){            // v déjà nettoyée
    var ps = parts(p);
    if(ps.length === 0){ tree = (v && typeof v === "object") ? v : (v === null ? {} : v); return; }
    if(tree == null || typeof tree !== "object") tree = {};
    var cur = tree, chain = [];
    for(var i = 0; i < ps.length - 1; i++){
      if(cur[ps[i]] == null || typeof cur[ps[i]] !== "object"){
        if(v === null) return;
        cur[ps[i]] = {};
      }
      chain.push([cur, ps[i]]);
      cur = cur[ps[i]];
    }
    var last = ps[ps.length - 1];
    if(v === null) delete cur[last]; else cur[last] = v;
    for(var j = chain.length - 1; j >= 0; j--){
      var o = chain[j][0], k = chain[j][1];
      if(o[k] && typeof o[k] === "object" && Object.keys(o[k]).length === 0) delete o[k]; else break;
    }
  }
  function applyOp(op){
    if(op.t === "set") setAtLocal(op.p, op.v);
    else if(op.t === "update"){
      Object.keys(op.v || {}).forEach(function(k){ setAtLocal(join(op.p, k), op.v[k]); });
    }
  }
  function opPaths(op){
    if(op.t === "update") return Object.keys(op.v || {}).map(function(k){ return join(op.p, k); });
    return [op.p];
  }
  function deep(v){ return v == null ? null : JSON.parse(JSON.stringify(v)); }
  function canon(v){
    if(v === null || typeof v !== "object") return JSON.stringify(v);
    var ks = Object.keys(v).sort();
    return "{" + ks.map(function(k){ return JSON.stringify(k) + ":" + canon(v[k]); }).join(",") + "}";
  }
  var INT_RE = /^(0|[1-9]\d{0,9})$/;
  function toVal(v){
    if(v === null || typeof v !== "object") return v;
    var ks = Object.keys(v), allInt = true, maxKey = 0, out = {};
    for(var i = 0; i < ks.length; i++){
      out[ks[i]] = toVal(v[ks[i]]);
      if(allInt && INT_RE.test(ks[i])){ var n = parseInt(ks[i], 10); if(n > maxKey) maxKey = n; }
      else allInt = false;
    }
    if(allInt && ks.length > 0 && maxKey < 2 * ks.length){
      var arr = [];
      ks.forEach(function(k){ arr[parseInt(k, 10)] = out[k]; });
      return arr;
    }
    return out;
  }
  function keyCmp(a, b){
    var ai = INT_RE.test(a), bi = INT_RE.test(b);
    if(ai && bi) return parseInt(a, 10) - parseInt(b, 10);
    if(ai) return -1; if(bi) return 1;
    return a < b ? -1 : (a > b ? 1 : 0);
  }

  function Snapshot(path, stored){
    this._p = norm(path); this._v = stored === undefined ? null : stored;
    var ps = parts(this._p);
    this.key = ps.length ? ps[ps.length - 1] : null;
    this.ref = new Reference(this._p);
  }
  Snapshot.prototype.val = function(){ return toVal(deep(this._v)); };
  Snapshot.prototype.exportVal = Snapshot.prototype.val;
  Snapshot.prototype.toJSON = Snapshot.prototype.val;
  Snapshot.prototype.exists = function(){ return this._v !== null; };
  Snapshot.prototype.child = function(p){ return new Snapshot(join(this._p, p), getAt(this._v, norm(p))); };
  Snapshot.prototype.hasChild = function(p){ return getAt(this._v, norm(p)) !== null; };
  Snapshot.prototype.hasChildren = function(){ return !!(this._v && typeof this._v === "object" && Object.keys(this._v).length); };
  Snapshot.prototype.numChildren = function(){ return (this._v && typeof this._v === "object") ? Object.keys(this._v).length : 0; };
  Snapshot.prototype.forEach = function(cb){
    if(!this._v || typeof this._v !== "object") return false;
    var ks = Object.keys(this._v).sort(keyCmp);
    for(var i = 0; i < ks.length; i++){ if(cb(this.child(ks[i])) === true) return true; }
    return false;
  };

  function fire(paths){
    var snapList = listeners.slice();
    snapList.forEach(function(l){
      if(l.pending || listeners.indexOf(l) < 0) return;
      var hit = false;
      for(var i = 0; i < paths.length; i++){ if(related(l.path, paths[i])){ hit = true; break; } }
      if(!hit) return;
      var cur = getAt(tree, l.path), c = canon(cur);
      if(c === l.last) return;
      l.last = c;
      try{ l.cb.call(l.ctx || null, new Snapshot(l.path, deep(cur))); }catch(e){ console.error("fakefb listener", e); }
    });
  }

  function send(msg){
    if(ws && ws.readyState === 1 && ready) ws.send(JSON.stringify(msg));
    else outbox.push(msg);
  }
  function writeOp(op, onComplete){
    return new Promise(function(resolve, reject){
      var id = ++reqId;
      acks[id] = function(err){
        if(onComplete){ try{ onComplete(err || null); }catch(e){ console.error(e); } }
        if(err) reject(err); else resolve();
      };
      if(!ready){ buffered.push({op:op, id:id}); return; }
      applyOp(op); fire(opPaths(op));
      send({t:"op", id:id, op:op});
    });
  }

  function pushId(){
    var CH = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    var now = Date.now(), ts = "";
    for(var i = 0; i < 8; i++){ ts = CH.charAt(now % 64) + ts; now = Math.floor(now / 64); }
    if(pushId._last === Date.now() && pushId._rand){
      var r = pushId._rand, k = 11; while(k >= 0 && r[k] === 63){ r[k] = 0; k--; } r[k]++;
    } else {
      pushId._rand = []; for(var j = 0; j < 12; j++) pushId._rand.push(Math.floor(Math.random() * 64));
    }
    pushId._last = Date.now();
    return ts + pushId._rand.map(function(x){ return CH.charAt(x); }).join("");
  }

  function Reference(path){
    this.path = norm(path);
    var ps = parts(this.path);
    this.key = ps.length ? ps[ps.length - 1] : null;
  }
  Reference.prototype.toString = function(){ return "fakefb://" + this.path; };
  Reference.prototype.child = function(p){ return new Reference(join(this.path, p)); };
  Object.defineProperty(Reference.prototype, "parent", {get:function(){ var ps = parts(this.path); if(!ps.length) return null; ps.pop(); return new Reference(ps.join("/")); }});
  Object.defineProperty(Reference.prototype, "root", {get:function(){ return new Reference(""); }});
  Reference.prototype.isEqual = function(o){ return o && o.path === this.path; };
  ["orderByChild","orderByKey","orderByValue","orderByPriority","limitToLast","limitToFirst","startAt","endAt","equalTo"].forEach(function(m){
    Reference.prototype[m] = function(){ console.warn("fakefb: requête " + m + " ignorée"); return this; };
  });
  Reference.prototype.set = function(v, cb){ return writeOp({t:"set", p:this.path, v:clean(v)}, cb); };
  Reference.prototype.update = function(obj, cb){
    var v = {}; Object.keys(obj || {}).forEach(function(k){ v[norm(k)] = clean(obj[k]); });
    return writeOp({t:"update", p:this.path, v:v}, cb);
  };
  Reference.prototype.remove = function(cb){ return writeOp({t:"set", p:this.path, v:null}, cb); };
  Reference.prototype.push = function(v, cb){
    var r = this.child(pushId());
    if(v === undefined){ var pr = Promise.resolve(r); r.then = pr.then.bind(pr); r.catch = pr.catch.bind(pr); return r; }
    var p = r.set(v, cb); r.then = p.then.bind(p); r.catch = p.catch.bind(p); return r;
  };
  Reference.prototype.once = function(ev, cb, errCb, ctx){
    var self = this;
    if(typeof errCb === "object" && errCb && !ctx){ ctx = errCb; errCb = null; }
    return new Promise(function(resolve){
      function go(){
        var s = new Snapshot(self.path, deep(getAt(tree, self.path)));
        if(cb){ try{ cb.call(ctx || null, s); }catch(e){ console.error("fakefb once", e); } }
        resolve(s);
      }
      if(ready) setTimeout(go, 0); else waiters.push(go);
    });
  };
  Reference.prototype.on = function(ev, cb, cancelCb, ctx){
    if(typeof cancelCb === "object" && cancelCb && !ctx){ ctx = cancelCb; }
    var l = {path:this.path, cb:cb, ctx:ctx, last:undefined, pending:true};
    listeners.push(l);
    function first(){
      if(listeners.indexOf(l) < 0) return;
      var cur = getAt(tree, l.path); l.last = canon(cur); l.pending = false;
      try{ cb.call(ctx || null, new Snapshot(l.path, deep(cur))); }catch(e){ console.error("fakefb on", e); }
    }
    if(ready) setTimeout(first, 0); else waiters.push(first);
    return cb;
  };
  Reference.prototype.off = function(ev, cb){
    var p = this.path;
    listeners = listeners.filter(function(l){
      if(l.path !== p) return true;
      if(cb) return l.cb !== cb;
      return false;      // off() / off("value") : TOUTES les écoutes de l'adresse
    });
  };
  Reference.prototype.transaction = function(fn, onComplete){
    var self = this, tries = 0;
    return new Promise(function(resolve){
      function attempt(){
        tries++;
        var curStored = getAt(tree, self.path);
        var nv = fn(toVal(deep(curStored)));
        if(nv === undefined){
          var s0 = new Snapshot(self.path, deep(curStored));
          if(onComplete) onComplete(null, false, s0);
          resolve({committed:false, snapshot:s0}); return;
        }
        var id = ++reqId, cleaned = clean(nv);
        acks[id] = function(err, ok){
          if(ok){
            setAtLocal(self.path, cleaned); fire([self.path]);
            var s = new Snapshot(self.path, deep(getAt(tree, self.path)));
            if(onComplete) onComplete(null, true, s);
            resolve({committed:true, snapshot:s});
          } else if(tries < 25) setTimeout(attempt, 20);
          else { var e = new Error("maxretry"); if(onComplete) onComplete(e, false, null); resolve({committed:false}); }
        };
        send({t:"cas", id:id, p:self.path, expect:canon(curStored), v:cleaned});
      }
      if(ready) attempt(); else waiters.push(attempt);
    });
  };
  Reference.prototype.onDisconnect = function(){
    var self = this;
    function reg(op, cb){ return new Promise(function(res){ var id = ++reqId; acks[id] = function(){ if(cb) cb(null); res(); }; send({t:"od", id:id, op:op}); }); }
    return {
      set:function(v, cb){ return reg({t:"set", p:self.path, v:clean(v)}, cb); },
      remove:function(cb){ return reg({t:"set", p:self.path, v:null}, cb); },
      update:function(obj, cb){ var v = {}; Object.keys(obj || {}).forEach(function(k){ v[norm(k)] = clean(obj[k]); }); return reg({t:"update", p:self.path, v:v}, cb); },
      cancel:function(cb){ return reg({t:"odcancel", p:self.path}, cb); }
    };
  };

  function Database(){ }
  Database.prototype.ref = function(p){ return new Reference(p); };
  Database.prototype.refFromURL = function(u){ return new Reference(String(u).replace(/^https?:\/\/[^\/]+/, "")); };
  Database.prototype.goOffline = function(){}; Database.prototype.goOnline = function(){};
  var theDb = new Database();

  function connect(){
    ws = new WebSocket(WS_URL);
    ws.onmessage = function(ev){
      var m = JSON.parse(ev.data);
      if(m.t === "init"){
        tree = m.tree || {}; ready = true;
        var b = buffered; buffered = [];
        var paths = [];
        b.forEach(function(x){ applyOp(x.op); paths = paths.concat(opPaths(x.op)); ws.send(JSON.stringify({t:"op", id:x.id, op:x.op})); });
        var o = outbox; outbox = []; o.forEach(function(x){ ws.send(JSON.stringify(x)); });
        var w = waiters; waiters = []; w.forEach(function(f){ setTimeout(f, 0); });
        if(paths.length) fire(paths);
      } else if(m.t === "op"){
        applyOp(m.op); fire(opPaths(m.op));
      } else if(m.t === "ack"){
        var a = acks[m.id]; delete acks[m.id]; if(a) a(m.err ? new Error(m.err) : null, m.ok);
      }
    };
    ws.onclose = function(){ console.warn("fakefb: serveur du banc déconnecté"); };
  }
  connect();

  var app = {name:"[DEFAULT]", options:{}};
  window.firebase = {
    apps:[],
    initializeApp:function(cfg){ app.options = cfg || {}; window.firebase.apps.push(app); return app; },
    app:function(){ return app; },
    database:function(){ return theDb; },
    SDK_VERSION:"8.10.1-fakefb"
  };
  window.firebase.database.ServerValue = {TIMESTAMP:{".sv":"timestamp"}};
  window.firebase.database.enableLogging = function(){};
  window.__fakefb = {tree:function(){ return tree; }, listeners:function(){ return listeners.length; }};
})();

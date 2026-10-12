// QCM-4 · BANC — l'app sur le faux hub, pour les relecteurs neufs (QCM-4-BANC.md, « De 05:30 à 06:30 », point 2).
// Un serveur qui reste ouvert : l'app assemblée, la base partagée par WebSocket, la classe 3 ESSAI (25 élèves, leurs codes),
// l'évaluation d'essai, la démo, les compétences du hub. Chaque relecteur ouvre ses pages avec Playwright, par le routage du faux hub
// (le SDK Firebase remplacé, rien ne sort vers le vrai hub).
//   APP_FILE=<app> node banc/serveur-relecteurs.js <port> <fichier où écrire l'adresse et les codes>
const fs = require("fs"), path = require("path");
const O = require("./outils");
const port = +(process.argv[2] || 8899), sortie = process.argv[3];
(async () => {
  const S = O.scenario();
  const {B, srv} = await (async () => {
    const r = await O.fauxHub(B => {
      B.tree.qcm.evaluations.essai.titre = S.EV_ESSAI.titre;
      B.tree.qcm.evaluations.demo = {titre: S.DEMO.titre, mode: "strict", demo: true, questions: S.DEMO.questions.map(q => ({enonce: q.enonce, choix: q.choix, bonnes: q.bonnes, niveau: q.niveau, reflexion: q.reflexion, reponse: q.reponse, competences: []}))};
    });
    return r;
  })();
  const info = {adresse: "http://localhost:" + srv.port + "/evaluation-qcm.html", port: srv.port,
    pages: {console: "?mode=prof", tablette: "?mode=eleve", telephone: "?mode=prof&view=phone", tableau: "?mode=prof&view=board"},
    routage: "chaque contexte Playwright doit passer par installRoutes(context, srv) du faux hub : require('" + path.join(O.FAUX, "server.js") + "') — voir banc/relecteur-outils.js",
    classe: "3 ESSAI", eleves: B.eleves.map(e => ({nom: e.nomComplet, code: e.code}))};
  // le hub en REST (ce que l'app lit hors du SDK, comme les codes) : servi par un second port, que relecteur-outils.js utilise
  const http = require("http");
  const rest = http.createServer((req, res) => {
    const u = new URL(req.url, "http://localhost"); const p = decodeURIComponent(u.pathname.replace(/^\/+/, "").replace(/\.json$/, ""));
    let corps = ""; req.on("data", c => corps += c); req.on("end", () => {
      let v = null; try { v = JSON.parse(corps || "null"); } catch(e){}
      let op = null, rep = v;
      if(req.method === "GET"){ let x = srv.store.get(p); if(/shallow=true/.test(u.search) && x && typeof x === "object"){ const o = {}; for(const k of Object.keys(x)) o[k] = true; x = o; } rep = x; }
      else if(req.method === "PUT") op = {t: "set", p, v};
      else if(req.method === "PATCH") op = {t: "update", p, v};
      else if(req.method === "DELETE") op = {t: "set", p, v: null};
      else if(req.method === "POST"){ const k = "-rest" + Date.now(); op = {t: "set", p: p + "/" + k, v}; rep = {name: k}; }
      if(op){ srv.store.apply(op); srv.record(op, "rest"); srv.broadcast(op, null); }
      res.writeHead(200, {"content-type": "application/json", "access-control-allow-origin": "*"}); res.end(JSON.stringify(rep));
    });
  });
  await new Promise(r => rest.listen(srv.port + 1000, r));
  info.rest = srv.port + 1000;
  info.routage = "require('" + path.join(__dirname, "relecteur-outils.js") + "').ouvrir(navigateur, info, '?mode=prof', 1536, 864)";
  if(sortie) fs.writeFileSync(sortie, JSON.stringify(info, null, 1));
  // un point d'entrée pour les relecteurs : /etat renvoie la base (lecture seule), pour qu'ils voient ce qui s'écrit
  console.log("prêt " + JSON.stringify({port: srv.port}));
})();

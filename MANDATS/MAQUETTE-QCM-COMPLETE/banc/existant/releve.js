// Le relevé de l'existant (complément 1, garde 1) : la 7.7.1 (evaluation-qcm.html de la production, md5 ecae6562…),
// jouée dans Chromium sur le faux hub du banc (banc/fauxhub : server.js, fakefb.js, la fausse classe « 3 ESSAI »).
// Chaque écran visité est relevé (boutons, infobulles, champs, cases ; phrases pour un écran d'élève) et inscrit,
// avec les scènes de la maquette qui en partent, dans banc/existant/qcm-<écran>.json.
//   node banc/existant/releve.js   (PROD=<clone de la production> ; par défaut /home/user/siteflow-io/monsieurjaipascompris)
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const PROD = process.env.PROD || "/home/user/siteflow-io/monsieurjaipascompris";
const APP = path.join(PROD, "evaluation-qcm.html");
process.env.APP_FILE = APP;
const FH = path.join(__dirname, "..", "fauxhub");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const { startServer, installRoutes } = require(path.join(FH, "server.js"));
const { buildTree } = require(path.join(FH, "tree.js"));
const { extraireEcran } = require("./extraction.js");
const MD5 = crypto.createHash("md5").update(fs.readFileSync(APP)).digest("hex");
const DEBUG = !!process.env.DEBUG;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const releves = {}, vides = [];
async function relever(page, id, scenes, opts){
  opts = opts || {};
  const e = await page.evaluate(([f, o]) => { eval("var extraireEcran = " + f); return extraireEcran(o); }, [extraireEcran.toString(), {racine:opts.racine || null, phrases:!!opts.phrases}]);
  if(!e){ console.log("✗ " + id + " : racine absente (" + opts.racine + ")"); return; }
  delete e.classes;   // la structure (les classes CSS) ne se compare que pour les écrans de MJPC, dont la maquette reprend le balisage (D1)
  releves[id] = Object.assign({ecran:id, source:"evaluation-qcm.html (7.7.1, md5 " + MD5 + "), jouée sur le faux hub", comment:opts.comment || "", scenes:scenes, eleve:!!opts.phrases}, e);
  console.log("✓ " + id + " : " + e.boutons.length + " boutons, " + e.champs.length + " champs, " + e.cases.length + " cases, " + e.titres.length + " infobulles hors boutons, " + e.phrases.length + " phrases");
  if(DEBUG) console.log("   " + (await page.locator(opts.racine || "body").innerText()).replace(/\n+/g, " ¶ ").slice(0, 900));
}
(async () => {
  const B = buildTree();
  const srv = await startServer(B.tree, 8781, () => {});
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const ctx = await nav.newContext({viewport: {width: 1536, height: 900}});
  await installRoutes(ctx, Object.assign({}, srv, {port: 8781}), null);
  const mk = async (q, w) => { const p = await ctx.newPage(); if(w) await p.setViewportSize(w);
    p.on("dialog", d => { if(DEBUG) console.log("   [boîte] " + d.message().slice(0, 120)); d.accept(); }); p.on("pageerror", e => console.log("   [erreur de page " + q + "] " + e.message)); p.on("console", m => { if(m.type() === "error") console.log("   [console " + q + "] " + m.text().slice(0, 200)); });
    await p.goto("http://localhost:8781/evaluation-qcm.html" + q); await sleep(1500); return p; };
  const btn = (p, t, i) => p.getByRole("button", {name: t}).nth(i || 0);
  const etape = async (nom, f) => { try { await f(); } catch(e){ console.log("✗ étape « " + nom + " » : " + e.message.split("\n")[0]); } };
  const ETAPES = require("./etapes.js");
  // Un écran qui reste vide dans la 7.7.1 est noté ; son inventaire vient alors du code (banc/existant/code-*.json).
  const vide = async (page, id) => { const n = (await page.locator("body").innerText()).trim().length; console.log((n ? "✓ " : "∅ ") + id + " : " + n + " caractères affichés" + (n ? "" : " (écran vide dans la 7.7.1 ; inventaire tiré du code)")); vides.push({ecran:id, caracteres:n}); };
  await ETAPES({mk, btn, sleep, relever, etape, vide, eleves: B.eleves});
  fs.writeFileSync(path.join(__dirname, "vides.json"), JSON.stringify(vides, null, 1));
  const out = __dirname;
  for(const id of Object.keys(releves)) fs.writeFileSync(path.join(out, "qcm-" + id + ".json"), JSON.stringify(releves[id], null, 1));
  console.log(Object.keys(releves).length + " écrans relevés");
  await nav.close(); await srv.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

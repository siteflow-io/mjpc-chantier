// QCM-1 · SOCLE — essai rapide : l'app sur le faux hub (la fausse classe 3 ESSAI, l'évaluation d'essai complète, la taxonomie),
// chaque appareil ouvert, ses erreurs de page, son texte. Usage : BANC=<faux hub avec node_modules> node ouvrir.js [adresse…]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC);
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const RAC = path.join(__dirname, "..", "..", "..", "..", "..");
process.env.APP_FILE = process.env.APP_FILE || path.join(__dirname, "..", "..", "..", "evaluation-qcm.staging.html");
const EV = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const TAXO = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "taxonomie-competences.json")));
const PORT = 8700 + Math.floor(Math.random() * 80);
const pause = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const B = buildTree();
  B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: EV});
  B.tree.taxonomie = {competences: TAXO};
  const srv = await startServer(B.tree, PORT, () => {});
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const adresses = process.argv.slice(2).length ? process.argv.slice(2) : ["?mode=prof", "?mode=eleve", "?mode=prof&view=board", "?mode=prof&view=phone", ""];
  for (const q of adresses) {
    const ctx = await nav.newContext({viewport: {width: /phone/.test(q) ? 390 : 1440, height: 900}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); const err = [];
    p.on("pageerror", e => err.push(e.message)); p.on("console", m => { if (m.type() === "error") err.push("console : " + m.text()); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await pause(2500);
    const t = (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 500);
    console.log("── " + (q || "(accueil)") + "\n   erreurs : " + (err.length ? err.slice(0, 5).join(" ‖ ") : "aucune") + "\n   texte : " + t);
    if (process.env.CAP) await p.screenshot({path: path.join(process.env.CAP, (q.replace(/[^a-z]+/g, "-") || "accueil") + ".png")});
  }
  await nav.close(); await srv.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

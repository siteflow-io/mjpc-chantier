// QCM-1 · SOCLE — le poids de l'historique : 80 séances passées (25 élèves, 20 questions, réponses et lectures) dans la base, puis une
// séance en cours ; on mesure, sur la console et sur une tablette, le temps de chaque redessin pendant que 24 élèves répondent.
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC);
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const RAC = path.join(__dirname, "..", "..", "..", "..", "..");
const EV = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const TAXO = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "taxonomie-competences.json")));
const PORT = 8300 + Math.floor(Math.random() * 90);
const pause = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const B = buildTree(); const slugs = B.eleves.map(e => B.sanMJPC(e.nomComplet));
  const ev20 = JSON.parse(JSON.stringify(EV)); while (ev20.questions.length < 20) ev20.questions.push(JSON.parse(JSON.stringify(EV.questions[ev20.questions.length % 3])));
  B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: EV, longue: ev20}); B.tree.taxonomie = {competences: TAXO};
  B.tree.qcm.sessions = {};
  for (let s = 0; s < 80; s++) { const rep = {}, lec = {};
    for (let q = 0; q < 20; q++) { rep[q] = {}; lec[q] = {}; for (const x of slugs) { rep[q][x] = {choix: [q % 4], ts: 1, ms: 1, tour: 1}; lec[q][x] = {choix: [q % 4], par: x, ms: 1}; } }
    B.tree.qcm.sessions["sess_17900000" + String(s).padStart(5, "0")] = {classeSlug: "3 ESSAI", evalId: "longue", date: 1790000000000 + s * 86400000, etat: "terminee", phase: "finie", reponses: rep, lectures: lec, revelees: [...Array(20).keys()], deroule: {ph: "fin"}, lancee: {mode: "tablettes"}}; }
  const srv = await startServer(B.tree, PORT, () => {});
  console.log("taille de qcm/sessions :", Math.round(JSON.stringify(B.tree.qcm.sessions).length / 1024) + " Ko");
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  async function ouvrir(q){ const ctx = await nav.newContext({viewport: {width: 1280, height: 800}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await p.waitForFunction(() => window.LIVE && LIVE.pret, null, {timeout: 30000}); await pause(500);
    // chaque rendu mesuré
    await p.evaluate(() => { window.__t = []; const r = window.rendre; LIVE.abonner(function(){}); const orig = ReactDOM.render; ReactDOM.render = function(){ const t0 = performance.now(); const x = orig.apply(this, arguments); window.__t.push(performance.now() - t0); return x; }; });
    return p; }
  const code = nom => B.eleves.find(e => e.nomComplet === nom).code;
  const prof = await ouvrir("?mode=prof");
  const sid = await prof.evaluate(() => ACT.lancerSeance("3 ESSAI", "essai", {})); await prof.evaluate(() => ACT.appelFini(["yvon_adam"]));
  const tab = await ouvrir("?mode=eleve");
  await tab.evaluate(() => ELV.combien(2)); await tab.evaluate(c => ELV.entrer("g", c, "julien", "abrial"), code("ABRIAL Julien")); await tab.evaluate(c => ELV.entrer("d", c, "léa", "baudry"), code("BAUDRY Léa"));
  const presents = await prof.evaluate(() => SCN.presents());
  await prof.evaluate(l => Promise.all(l.map(x => ELV.commencer(x, 1))), presents);
  await prof.evaluate(() => ACT.lancerQuestion(0)); await prof.evaluate(() => ACT.autoriserReponse()); await pause(3500);
  await prof.evaluate(() => { window.__t = []; }); await tab.evaluate(() => { window.__t = []; });
  const t0 = Date.now();
  for (const x of presents) { await prof.evaluate(x => ELV.repondre(0, [2], x), x); await pause(80); }
  await pause(1500);
  const stat = async p => p.evaluate(() => { const t = window.__t.slice().sort((a, b) => a - b); return {n: t.length, med: Math.round(t[Math.floor(t.length / 2)] || 0), max: Math.round(t[t.length - 1] || 0)}; });
  console.log("24 réponses en " + (Date.now() - t0) + " ms ; console :", JSON.stringify(await stat(prof)), "; tablette :", JSON.stringify(await stat(tab)));
  await nav.close(); await srv.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

// Banc court : la case « ✋ Réponse » réglée à 20 s, est-elle prise quand la
// réflexion finit d'elle-même ? Trois questions : Q1 et Q2 laissées au chrono,
// Q3 ouverte par « ✋ Autoriser la réponse », Q4 laissée au chrono.
const fs = require("fs");
const { chromium } = require("playwright");
const { startServer, installRoutes } = require("./server");
const { buildTree } = require("./tree");
const OUT = __dirname + "/out_chrono"; fs.mkdirSync(OUT, {recursive: true});
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const T0 = Date.now();
const lines = [];
function log(m){ const l = "[" + ((Date.now() - T0) / 1000).toFixed(1).padStart(6) + "s] " + m; lines.push(l); console.log(l); }
(async () => {
  const B = buildTree();
  const srv = await startServer(B.tree, 8766, () => {});
  const trans = [];
  srv.watchers.push(() => {
    const sa = srv.store.get("qcm/sessionActive/" + B.CLASSE_CLE); if(!sa) return;
    const s = srv.store.get("qcm/sessions/" + sa) || {};
    const k = s.qIdx + "|" + s.phase;
    if(!trans.length || trans[trans.length - 1].k !== k) trans.push({k, q: s.qIdx, phase: s.phase, t: Date.now(), chronoReponse: s.chronoReponse});
  });
  const browser = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const ctx = await browser.newContext({viewport: {width: 1440, height: 1000}});
  await installRoutes(ctx, { ...srv, port: 8766 }, null);
  const prof = await ctx.newPage();
  prof.on("dialog", d => d.accept());
  await prof.goto("http://localhost:8766/evaluation-qcm.html?mode=prof");
  await prof.getByText("Lancer une nouvelle session").waitFor();
  await prof.locator("select").nth(0).selectOption({label: B.CLASSE_NOM + " (25 élèves)"});
  await prof.locator("select").nth(1).selectOption({label: "3e- éval 1 Analyse logique - Construire une phrase complexe (11 questions)"});
  await prof.getByRole("button", {name: "🚀 Lancer la session"}).click();
  await prof.getByRole("button", {name: "Tout le monde présent"}).click();
  await prof.getByRole("button", {name: "🚀 Lancer la session"}).last().click();
  await sleep(1200);
  const caseRep = prof.locator('input[type="number"][min="3"][max="30"]');
  await caseRep.fill("20"); await caseRep.blur();
  log("case « ✋ Réponse » : " + await caseRep.inputValue() + " s");
  await prof.screenshot({path: OUT + "/case_reponse_20.png"});
  await prof.getByRole("button", {name: "▶️ Lancer Q1"}).click();
  const sess = () => srv.store.get("qcm/sessions/" + srv.store.get("qcm/sessionActive/" + B.CLASSE_CLE)) || {};
  async function attendre(c, max){ const t = Date.now(); while(!c()){ if(Date.now() - t > max) throw new Error("trop long"); await sleep(100); } }
  for(let q = 0; q < 4; q++){
    await attendre(() => sess().qIdx === q && sess().phase === "reflexion", 60000);
    if(q === 2){
      await sleep(3000);
      await prof.getByRole("button", {name: "✋ Autoriser la réponse"}).click();
      log("Q3 : « ✋ Autoriser la réponse » appuyé");
    }
    await attendre(() => sess().qIdx === q && sess().phase === "reponse", 60000);
    await attendre(() => sess().qIdx === q && sess().phase === "attente", 60000);
    if(q < 3) await prof.getByRole("button", {name: "Q suiv. →"}).click();
  }
  for(let i = 0; i < trans.length; i++){
    const a = trans[i];
    if(a.phase === "reponse"){
      const b = trans[i + 1];
      log("Q" + (a.q + 1) + " : la réponse a duré " + ((b.t - a.t) / 1000).toFixed(1) + " s (chronoReponse de la séance : " + a.chronoReponse + ")");
    }
  }
  fs.writeFileSync(OUT + "/chrono.log", lines.join("\n") + "\n");
  await browser.close(); await srv.close();
})().catch(e => { console.error(e); process.exit(1); });

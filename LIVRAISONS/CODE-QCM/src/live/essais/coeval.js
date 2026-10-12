// QCM-1 · SOCLE — la co-évaluation par le geste : la séance menée jusqu'à la co-évaluation par ACT et ELV, puis « ✅ » cliqué dans chaque moitié
// de la vraie tablette (les écrans de QCM-2) ; ce que la base reçoit, ce que la console permet.
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC);
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const RAC = path.join(__dirname, "..", "..", "..", "..", "..");
const EV = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const TAXO = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "taxonomie-competences.json")));
const PORT = 8400 + Math.floor(Math.random() * 90);
const pause = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const B = buildTree(); B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: EV}); B.tree.taxonomie = {competences: TAXO};
  const srv = await startServer(B.tree, PORT, () => {});
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const err = [];
  async function ouvrir(q, w, hh){ const ctx = await nav.newContext({viewport: {width: w || 1280, height: hh || 800}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); p.on("pageerror", e => err.push(q + " : " + e.message)); p.on("console", m => { if(m.type() === "error") err.push(q + " console : " + m.text().slice(0, 200)); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await p.waitForFunction(() => window.LIVE && LIVE.pret, null, {timeout: 15000}); await pause(300); return p; }
  const code = nom => B.eleves.find(e => e.nomComplet === nom).code;
  const prof = await ouvrir("?mode=prof", 1536, 864);
  const sid = await prof.evaluate(() => ACT.lancerSeance("3 ESSAI", "essai", {})); await prof.evaluate(() => ACT.appelFini(["yvon_adam"]));
  const tab = await ouvrir("?mode=eleve");
  await tab.evaluate(() => ELV.combien(2));
  await tab.evaluate(c => ELV.entrer("g", c, "julien", "abrial"), code("ABRIAL Julien")); await tab.evaluate(c => ELV.entrer("d", c, "léa", "baudry"), code("BAUDRY Léa"));
  for (const x of ["abrial_julien", "baudry_lea"]) await tab.evaluate(x => ELV.commencer(x, 1), x);
  for (const qi of [0, 1, 2]) { await prof.evaluate(q => ACT.lancerQuestion(q), qi); await prof.evaluate(() => ACT.autoriserReponse()); await pause(3600);
    await tab.evaluate(q => { const s = SCN.premierCote(q) === "g" ? "abrial_julien" : "baudry_lea"; return ELV.repondre(q, SCN.ev().questions[q].bonnes, s); }, qi);
    await prof.evaluate(() => ACT.tourSuivant()); await pause(200);
    await tab.evaluate(q => { const s = SCN.premierCote(q) === "g" ? "baudry_lea" : "abrial_julien"; return ELV.repondre(q, [q === 1 ? 1 : SCN.ev().questions[q].bonnes[0]], s); }, qi);
    await prof.evaluate(() => ACT.cloreQuestion()); await pause(200); }
  await prof.evaluate(() => ACT.lancerEstimation()); await prof.evaluate(() => ACT.lancerCorrection());
  for (const x of ["abrial_julien", "baudry_lea"]) await tab.evaluate(x => ELV.commencer(x, 2), x);
  await pause(1200);
  for (let i = 0; i < 3; i++) { const q = await prof.evaluate(() => SCN.etat().qi); await tab.evaluate(q => { ELV.lire(q, SCN.ev().questions[q].bonnes, "abrial_julien"); ELV.lire(q, SCN.ev().questions[q].bonnes, "baudry_lea"); }, q);
    await pause(200); await prof.evaluate(() => ACT.reveler()); await pause(200); await prof.evaluate(() => ACT.questionSuivante()); await pause(300); }
  console.log("phase :", JSON.stringify(await prof.evaluate(() => SCN.etat())));
  await pause(800);
  console.log("tablette :", (await tab.evaluate(() => document.body.innerText)).replace(/\s+/g, " ").slice(0, 500));
  const boutons = await tab.evaluate(() => [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.disabled ? "⊘" : "") + (b.getAttribute("data-local") ? "[L]" : "") + (b.getAttribute("data-h2") ? "[H2]" : "") + b.className.split(" ")[0] + ":" + b.textContent.trim().slice(0, 50)));
  console.log("boutons :", boutons.join(" | "));
  // « ✅ » dans chaque moitié, au vrai clic
  for (const i of [0, 1]) { const ok = await tab.evaluate(i => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
      const m = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[i]; if (!m) return "pas de moitié";
      const b = [...m.querySelectorAll("button")].filter(b => /^✅/.test(b.textContent.trim()))[0]; if (!b) return "pas de ✅"; b.setAttribute("data-co", "1"); return true; }, i);
    console.log("moitié " + i + " :", ok); if (ok === true) { await tab.click("[data-co='1']"); await tab.evaluate(() => document.querySelectorAll("[data-co]").forEach(x => x.removeAttribute("data-co"))); await pause(500); } }
  console.log("base coeval :", JSON.stringify(srv.store.get("qcm/sessions/" + sid + "/coeval")));
  console.log("compteurs :", JSON.stringify(await prof.evaluate(() => SCN.compteurs().coeval)));
  console.log("console :", (await prof.evaluate(() => [...document.querySelectorAll("button")].filter(b => /bilan/.test(b.textContent)).map(b => (b.disabled ? "⊘" : "") + b.textContent.trim()))).join(" | "));
  console.log("erreurs :", err.slice(0, 6).join(" ‖ "));
  await nav.close(); await srv.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

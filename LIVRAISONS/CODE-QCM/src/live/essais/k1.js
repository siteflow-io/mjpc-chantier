// QCM-1 · SOCLE — K1 pas à pas (le lancement par le geste, comme les contrôles de la conscience), avec les erreurs de la console.
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC);
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const RAC = path.join(__dirname, "..", "..", "..", "..", "..");
const EV = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const TAXO = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "taxonomie-competences.json")));
const PORT = 8500 + Math.floor(Math.random() * 90);
const pause = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const B = buildTree(); B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: EV}); B.tree.taxonomie = {competences: TAXO};
  const srv = await startServer(B.tree, PORT, () => {});
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const ctx = await nav.newContext({viewport: {width: 1536, height: 864}}); await installRoutes(ctx, {...srv, port: PORT}, null);
  const p = await ctx.newPage(); const err = [];
  p.on("pageerror", e => err.push("pageerror " + e.message)); p.on("console", m => { if (m.type() === "error" || m.type() === "warning") err.push(m.type() + " " + m.text().slice(0, 300)); });
  await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html?mode=prof"); await pause(2000);
  const txt = async () => (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, " ");
  console.log("1 ·", (await txt()).slice(0, 400));
  const boutons = await p.evaluate(() => [...document.querySelectorAll("button")].map(b => b.textContent.trim()).filter(Boolean).slice(0, 40));
  console.log("  boutons :", boutons.join(" | "));
  const sel = await p.evaluate(() => [...document.querySelectorAll("select")].map(s => [...s.options].map(o => o.value + "=" + o.textContent).join(" ; ")));
  console.log("  menus :", JSON.stringify(sel).slice(0, 600));
  await p.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].find(x => /3 ESSAI/.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); } } }); await pause(300);
  await p.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].find(x => /Évaluation d'essai/.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); } } }); await pause(300);
  // le clic des contrôles de la conscience (controles-app.js, cliquer) : le plus court des éléments visibles et ouverts ; un clic intercepté échoue en 3 s
  const clic = async re => { const ok = await p.evaluate(src => { const re = new RegExp(src); const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
      const b = [...document.querySelectorAll("button, a, [role=button], [data-va], option, label, .tc")].filter(b => vis(b) && !b.disabled && re.test((b.textContent || "").trim())).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!b) return false; b.setAttribute("data-k", "1"); return true; }, re.source);
    let fait = false; if (ok) fait = await p.click("[data-k='1']", {timeout: 3000}).then(() => true, () => "intercepté"); await p.evaluate(() => document.querySelectorAll("[data-k]").forEach(x => x.removeAttribute("data-k"))); return fait; };
  console.log("2 · Lancer la séance :", await clic(/Lancer la séance/)); await pause(1200);
  console.log("  ", (await txt()).slice(0, 300)); console.log("   base :", JSON.stringify(srv.store.get("qcm/sessionActive")));
  console.log("3 · Lancer la séance (appel) :", await clic(/Lancer la séance/)); await pause(1200);
  console.log("  ", (await txt()).slice(0, 300)); console.log("   base :", JSON.stringify(srv.store.get("qcm/sessionActive")), JSON.stringify((Object.values(srv.store.get("qcm/sessions") || {})[0] || {}).deroule));
  // (option ETAPES=1) la question 1 menue jusqu'à « close » par ACT, puis les boutons de la console à chaque phase
  if (process.env.ETAPES) {
    const bt = async () => (await p.evaluate(() => [...document.querySelectorAll("button")].filter(b => b.getBoundingClientRect().width > 0).map(b => (b.disabled ? "⊘" : "") + b.textContent.trim().slice(0, 40)))).join(" | ");
    await p.evaluate(() => ACT.lancerQuestion(0)); await pause(800); console.log("reflexion :", (await bt()).slice(0, 900));
    await p.evaluate(() => ACT.autoriserReponse()); await pause(3500); console.log("tour 1 :", (await bt()).slice(0, 900));
    await p.evaluate(() => ACT.tourSuivant()); await pause(9000); console.log("tour 2 :", (await bt()).slice(0, 900));
    await p.evaluate(() => ACT.cloreQuestion()); await pause(6000); console.log("close :", JSON.stringify(await p.evaluate(() => SCN.etat())), "\n  ", (await bt()).slice(0, 1200));
  }
  console.log("erreurs :\n  " + err.slice(0, 12).join("\n  "));
  await nav.close(); await srv.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

// Captures de la maquette « 📄 Lire les copies » (conscience n°12, 13/10) : le vrai code de l'app, sur le faux hub, après une séance jouée par le banc
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = process.env.BANC, CAP = process.env.CAP, APP = process.env.APP_FILE;
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const pause = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const B = buildTree();
  const qcm = JSON.parse(fs.readFileSync(process.env.BASE));
  B.tree.qcm = Object.assign({}, B.tree.qcm, qcm);
  B.tree.taxonomie = Object.assign({}, B.tree.taxonomie, {competences: JSON.parse(fs.readFileSync(process.env.TAXO))});
  const PORT = 8890 + Math.floor(Math.random() * 50);
  const srv = await startServer(B.tree, PORT, () => {});
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const ctx = await navig.newContext({viewport: {width: 1536, height: 864}}); await installRoutes(ctx, {...srv, port: PORT}, null);
  const p = await ctx.newPage(); const err = []; p.on("pageerror", e => err.push(e.message));
  await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html?mode=prof"); await pause(2500);
  const clic = async (re) => { const ok = await p.evaluate(([s, f]) => { const r = new RegExp(s, f); const b = [...document.querySelectorAll("button, a, [role=button], [data-va]")].filter(e => e.getBoundingClientRect().width > 0 && !e.disabled && r.test((e.textContent || "").trim())).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!b) return false; document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return true; }, [re.source, re.flags]); if (ok) { await p.click("[data-c='1']"); await pause(1200); } return ok; };
  console.log("Données", await clic(/^Données$/));
  console.log("Résultats", await clic(/Résultats/));
  await p.screenshot({path: CAP + "/0-donnees.png"});
  console.log("Ouvrir", await clic(/📊 Ouvrir/));
  await p.screenshot({path: CAP + "/1-tableau-seance.png"});
  console.log("Lire", await clic(/Lire les copies/));
  await p.screenshot({path: CAP + "/2-copie-1.png"});
  console.log("Autre chose", await clic(/Autre chose|Elle dit un choix|Je clique ce qu/));
  await p.screenshot({path: CAP + "/3-copie-1-autre-chose.png"});
  console.log("Annuler", await clic(/^Annuler$/));
  // répondre « Oui » à toutes les questions de la copie : la suivante vient seule
  for (let k = 0; k < 4; k++) { if (!(await clic(/^✅ Oui/))) break; }
  await p.screenshot({path: CAP + "/4-copie-2.png"});
  console.log("texte :", (await p.evaluate(() => (document.querySelector("[data-lire-copies]") || document.body).innerText)).replace(/\n/g, " ⏎ ").slice(0, 900));
  console.log("erreurs :", err.slice(0, 3));
  await navig.close(); await srv.close();
})();

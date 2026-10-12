// QCM-1 · SOCLE — l'app sur un instantané du hub (lecture seule, en local) : INSTANTANE=<fichier .json> ; chaque appareil ouvert, ses erreurs,
// et ce que SCN lit (classes, séances de la 7.7.1, leurs notes). N'écrit rien hors du faux hub ; ne garde aucun nom.
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC);
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const PORT = 8200 + Math.floor(Math.random() * 90);
const pause = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const tree = JSON.parse(fs.readFileSync(process.env.INSTANTANE, "utf8"));
  const srv = await startServer(tree, PORT, () => {});
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const q of ["?mode=prof", "?mode=eleve", "?mode=prof&view=board", "?mode=prof&view=phone"]) {
    const ctx = await nav.newContext({viewport: {width: 1440, height: 900}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); const err = []; p.on("pageerror", e => err.push(e.message)); p.on("console", m => { if (m.type() === "error") err.push(m.text().slice(0, 160)); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await pause(3000);
    const lu = await p.evaluate(() => { const s = Object.keys(LIVE.d.sessions || {}); return {classes: SCN.classes().length, seances: s.length, evals: SCN.evals().length,
      notes: s.filter(id => !/_test/.test(id)).map(id => { try { const el = SCN.eleves(id); const n = el.map(x => SCN.note(x, null, id)).filter(Boolean); return n.length + " notes, " + el.length + " élèves"; } catch(e){ return "ERREUR " + e.message; } }) }; });
    console.log(q, "· erreurs :", err.length ? err.slice(0, 3).join(" ‖ ") : "aucune", "·", JSON.stringify(lu));
  }
  await nav.close(); await srv.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

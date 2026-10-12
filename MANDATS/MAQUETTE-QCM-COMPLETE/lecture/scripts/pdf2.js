const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1536, height: 864}});
  await p.addInitScript(() => { window.__o = []; window.open = u => { window.__o.push(String(u)); return null; }; window.print = () => window.__o.push("print"); });
  await p.goto("file://" + V + "#scene=c-resultats-rendues"); await p.waitForTimeout(900);
  await p.locator("#root button:has-text('PDF notes')").first().click(); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({hash: location.hash, o: window.__o, t: (document.getElementById("root").innerText.match(/Évaluation :[^\n]*\n?[^\n]*/) || [""])[0], seance: (document.getElementById("root").innerText.match(/Séance :[^\n]*/) || [""])[0]}));
  const fr = await p.evaluate(() => { const f = document.querySelector("#root iframe"); if (!f) return null; const t = f.contentDocument.body.innerText; return (t.match(/Évaluation :[^\n]*/) || [""])[0] + " | " + (t.match(/Séance :[^\n]*/) || [""])[0] + " | " + (t.match(/Chapitre :[^\n]*/) || [""])[0] + " | " + (t.match(/ZELLER Lou[^\n]*/) || [""])[0]; });
  console.log(JSON.stringify(r), "\nIFRAME :", fr);
  await b.close();
})();

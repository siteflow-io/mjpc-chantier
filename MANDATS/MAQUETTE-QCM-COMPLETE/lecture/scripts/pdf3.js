const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const h of ["x632-pdf&seance=S08&m=SOIR%3Arendu", "x632-pdf&seance=S08"]) {
    const p = await b.newPage({viewport: {width: 1536, height: 864}});
    await p.goto("file://" + V + "#scene=" + h); await p.waitForTimeout(2500);
    const fr = await p.evaluate(() => { const f = document.querySelector("#root iframe"); const d = f ? f.contentDocument : document; const t = d.body.innerText; return ["Évaluation", "Séance", "Chapitre", "Copies"].map(k => (t.match(new RegExp(k + " :[^\\n]*")) || [""])[0]).join(" | ") + " || " + (t.match(/ZELLER Lou[^\n]*/) || [""])[0] + " || " + (t.match(/FOUCHER Hugo[^\n]*/) || [""])[0]; });
    console.log(h, "\n   ", fr);
    await p.close();
  }
  await b.close();
})();

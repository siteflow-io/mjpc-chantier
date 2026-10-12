const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
const L = ["c-appel&seance=CH1", "c-appel&seance=RATT", "c-corbeille&seance=CH1", "c-corbeille&seance=PAP", "c-corbeille&seance=S3E", "c-resultats&seance=CH1", "c-resultats&seance=JB", "c-rouvrir-seance&seance=PAP", "c-rouvrir-seance&seance=S3E", "c-rouvrir-seance&seance=JB"];
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const h of L) {
    const p = await b.newPage({viewport: {width: 1536, height: 864}});
    await p.goto("file://" + V + "#scene=" + h); await p.waitForTimeout(900);
    const r = await p.evaluate(() => { const m = document.querySelector("#root .modal, #root .checkin-modal, #root [class*=modal]"); const src = m || document.getElementById("root"); const t = src.innerText.replace(/ | /g, " ").split("\n").filter(l => l.trim()).slice(m ? 0 : 12, m ? 6 : 20).join(" | "); const th = document.querySelectorAll("#root table th").length; const styled = document.querySelector("#root table") ? getComputedStyle(document.querySelector("#root table td")).borderBottomWidth + "/" + document.querySelector("#root table").className : "-"; return t.slice(0, 330) + " || th=" + th + " table=" + styled; });
    console.log(h, "\n    ", r);
    await p.close();
  }
  await b.close();
})();

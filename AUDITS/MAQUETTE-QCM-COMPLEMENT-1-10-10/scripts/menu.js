const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1536,height:864}});
  const url = "file://" + process.argv[2] + "#scene=" + process.argv[3];
  await p.goto(url); await p.waitForTimeout(800);
  const r = await p.evaluate(() => [...document.querySelectorAll("button")].filter(e => /Tableau de bord|Classes|Profil test|Architecture|Corbeille|Atelier|Présence|Code professeur|Élèves|Taxonomie|Oublier/.test(e.textContent)).map(e => { const cs = getComputedStyle(e); return e.textContent.trim().slice(0,30) + " | disabled=" + e.disabled + " | aria-disabled=" + e.getAttribute("aria-disabled") + " | opacity=" + cs.opacity + " | color=" + cs.color + " | cursor=" + cs.cursor + " | title=" + (e.title||"").slice(0,90); }));
  console.log(r.join("\n"));
  await b.close();
})();

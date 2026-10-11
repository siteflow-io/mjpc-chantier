const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:800,height:260}, deviceScaleFactor:2});
  await p.goto("file://" + process.argv[2]); await p.waitForTimeout(300);
  const r = await p.evaluate(() => [...document.querySelectorAll(".el-row")].map(row => { const R = row.getBoundingClientRect(); const a = row.querySelector(".el-acts button").getBoundingClientRect(); const c = row.querySelector(".el-code").getBoundingClientRect(); return {carte_gauche: Math.round(R.left), carte_haut: Math.round(R.top), boutons_gauche: Math.round(a.left), boutons_haut: Math.round(a.top), code_haut: Math.round(c.top), colonnes: getComputedStyle(row).gridTemplateColumns}; }));
  console.log(JSON.stringify(r, null, 1));
  await p.screenshot({path: process.argv[3]});
  await b.close();
})();

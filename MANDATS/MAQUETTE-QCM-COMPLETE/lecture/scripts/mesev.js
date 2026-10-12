const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const id of ["t-demo-q", "t-binome", "t-q1-tour1"]) {
    const p = await b.newPage({viewport: {width: 1280, height: 800}});
    await p.goto("file://" + V + "#scene=" + id); await p.waitForTimeout(900);
    await p.locator("#root button:has-text('Mes évaluations')").first().click(); await p.waitForTimeout(500);
    const t = await p.evaluate(() => document.getElementById("root").innerText.split("\n").filter(l => l.trim()).slice(0, 40).join(" | "));
    console.log("=== " + id + "\n" + t.slice(0, 900));
    await p.screenshot({path: "mesev-" + id + ".png"});
    await p.close();
  }
  await b.close();
})();

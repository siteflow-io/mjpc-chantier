const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1536, height: 864}});
  await p.goto("file://" + V + "#scene=c-demo-lancer"); await p.waitForTimeout(900);
  const step = async (txt) => { const l = p.locator(`#root button:has-text("${txt}")`).first(); const va = await l.getAttribute("data-va"); await l.click(); await p.waitForTimeout(700);
    const t = await p.evaluate(() => document.getElementById("root").innerText.replace(/\s+/g, " "));
    const ev = (t.match(/(Démo — apprendre le déroulé|Évaluation d'essai — 3 questions)/g) || []).slice(0, 3).join(" / ");
    console.log("« " + txt + " » data-va=" + va + " → " + await p.evaluate(() => location.hash) + "\n    évaluation nommée : " + ev + "\n    " + (t.match(/(QUESTION|Question) \d \/ \d[^|]{0,60}/) || [""])[0]); };
  await step("Lancer la démo");
  await step("Lancer la séance").catch(e => console.log("pas de « Lancer la séance »"));
  await step("Lancer Q1").catch(e => console.log("pas de « Lancer Q1 »"));
  await b.close();
})();

const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1536,height:864}});
  await p.goto("file://" + V + "#scene=c-q1-tour1"); await p.waitForTimeout(700);
  const fin = () => p.evaluate(() => (document.querySelector("#root .fin-prevue") || {}).innerText);
  console.log("avant :", await fin());
  // le champ du temps de réflexion de Q3, dans « Toutes les questions »
  const champs = p.locator("#root .pilot-q-mini input");
  const n = await champs.count(); console.log("champs des questions :", n);
  await champs.nth(n - 2).fill("90"); await champs.nth(n - 2).press("Tab"); await p.waitForTimeout(300);
  console.log("après réflexion de Q3 à 90 s :", await fin(), "| valeur :", await champs.nth(n - 2).inputValue());
  await b.close();
})();

const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
const SC = JSON.parse(require("fs").readFileSync("/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/lecture/scenes.json"));
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1536, height: 864}});
  const g = {};
  for (const sc of SC) {
    await p.goto("about:blank"); await p.goto("file://" + V + "#scene=" + sc.id); await p.waitForTimeout(350);
    const r = await p.evaluate(() => [...document.querySelectorAll("#root .info-i")].map(i => { const tip = i.querySelector(".info-tip") || (i.nextElementSibling && i.nextElementSibling.classList.contains("info-tip") ? i.nextElementSibling : null); const par = i.parentElement; return {lib: (par.innerText || "").replace(/\s+/g, " ").trim().slice(0, 40), tip: tip ? tip.textContent.trim().slice(0, 60) : null}; }).filter(x => !x.tip));
    for (const x of r) { (g[x.lib] = g[x.lib] || []).push(sc.n); }
  }
  for (const k in g) console.log(JSON.stringify(k), g[k].length, g[k].slice(0, 10).join(","));
  await b.close();
})();

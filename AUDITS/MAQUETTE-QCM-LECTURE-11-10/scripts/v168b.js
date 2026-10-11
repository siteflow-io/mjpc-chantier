const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const [w,h] of [[1366,768],[1536,864],[1920,1080]]) {
    const p = await b.newPage({viewport:{width:w,height:h}});
    await p.goto("file://" + V + "#scene=x620-3-mode-test-en-grand");
    await p.waitForTimeout(800);
    const f = async () => p.evaluate(() => { const g = document.querySelector(".grand-fond"); const out = [];
      g.querySelectorAll("input, textarea, button, h3, h4, p, div").forEach(e => { if (e.children.length > 2) return; const t = (e.textContent || e.placeholder || "").trim().slice(0, 50); const r = e.getBoundingClientRect(); if (r.bottom > innerHeight - 1 && r.height > 0) out.push(e.tagName + " « " + t + " » y=" + Math.round(r.top) + "-" + Math.round(r.bottom)); });
      return out.slice(0, 12); });
    const avant = await f();
    await p.mouse.move(w/2, h/2); await p.mouse.wheel(0, 1500); await p.waitForTimeout(300);
    const apres = await f();
    console.log(w, h, "\nAVANT", avant.join("\n  "), "\nAPRÈS molette", apres.length, apres[0]);
    await p.screenshot({path: `v168-${w}.png`});
  }
  await b.close();
})();

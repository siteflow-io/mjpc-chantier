const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud4/v8.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const h of ["c-appel&seance=RATT", "c-appel&seance=CH1", "c-appel"]) {
    const p = await b.newPage({viewport: {width: 1536, height: 864}});
    await p.goto("file://" + V + "#scene=" + h); await p.waitForTimeout(900);
    const t = await p.evaluate(() => { const m = document.querySelector("#root .checkin-modal"); return m ? m.innerText.replace(/ | /g, " ").replace(/\n+/g, " | ").slice(0, 700) : "pas de fenêtre"; });
    console.log(h, "\n   ", t);
    await p.screenshot({path: "appel-" + h.replace(/[^a-z0-9]+/gi, "_") + ".png"});
    await p.close();
  }
  await b.close();
})();

const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud4/v8.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const m of ["PREP", "DEMO%3Aavant", "S08%3AQ1%3AT1", "S08%3Acorr%3AQ2%3AV", "S08%3Abilan", "SOIR%3Arendu", "PAP%3Acorr%3AQ2", "TEST%3AQ3%3AR"]) {
    const p = await b.newPage({viewport: {width: 1280, height: 800}});
    await p.goto("file://" + V + "#scene=b-reponse&m=" + m); await p.waitForTimeout(800);
    const t = await p.evaluate(() => document.getElementById("root").innerText.split("\n").filter(l => l.trim() && l.length > 2).slice(0, 8).join(" | "));
    console.log(decodeURIComponent(m).padEnd(18), t.slice(0, 260));
    await p.close();
  }
  await b.close();
})();

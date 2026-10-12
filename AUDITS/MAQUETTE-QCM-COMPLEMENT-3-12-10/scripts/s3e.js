const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud4/v8.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const h of ["c-resultats&seance=S3E", "c-resultats&seance=CH1", "c-resultats&seance=PAP"]) {
    const p = await b.newPage({viewport: {width: 1536, height: 864}});
    await p.addInitScript(() => { window.__o = []; window.open = u => { window.__o.push(String(u)); return null; }; });
    await p.goto("file://" + V + "#scene=" + h); await p.waitForTimeout(900);
    const t = await p.evaluate(() => { const t = document.getElementById("root").innerText; return (t.match(/📊 [^\n]*— 3 ESSAI/) || [""])[0] + " | " + (t.match(/\d\d\/\d\d\/2026 \d\d:\d\d · \d+ présents[^\n]*/) || [""])[0].slice(0, 90) + " | Lou: " + (t.match(/ZELLER Lou\t[^\n]*/) || ["—"])[0].slice(0, 40); });
    const pdf = p.locator("#root button:has-text('PDF notes')").first();
    let o = null; if (await pdf.count() && !(await pdf.isDisabled())) { await pdf.click(); await p.waitForTimeout(300); o = await p.evaluate(() => window.__o.map(decodeURIComponent)); }
    console.log(h, "\n   ", t, "\n    PDF →", JSON.stringify(o));
    await p.close();
  }
  await b.close();
})();

const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1366,height:768}});
  const url = "file://" + process.argv[2];
  await p.goto(url); await p.waitForTimeout(800);
  const ids = await p.evaluate(() => (window.LISTE_SCENES||[]).map(s => s.id || s));
  let tot = 0; const out = [];
  for (const id of ids) {
    await p.goto(url + "#scene=" + id); await p.reload(); await p.waitForTimeout(150);
    const r = await p.evaluate(() => {
      const docs = [document, ...[...document.querySelectorAll("iframe")].map(f => { try { return f.contentDocument; } catch(e){ return null; } }).filter(Boolean)];
      const res = [];
      for (const d of docs) for (const e of d.querySelectorAll(".prov")) { const cs = getComputedStyle(e); const dec = cs.textDecorationLine; const bb = e.getBoundingClientRect(); if (bb.width > 0 && dec !== "none") res.push(dec + " | " + cs.textDecorationColor + " | " + e.textContent.slice(0, 70)); }
      return res;
    });
    if (r.length) { tot += r.length; out.push(id + " : " + r.length + " — " + r[0]); }
  }
  console.log(ids.length + " scènes ; .prov soulignés visibles : " + tot);
  console.log(out.join("\n"));
  await b.close();
})();

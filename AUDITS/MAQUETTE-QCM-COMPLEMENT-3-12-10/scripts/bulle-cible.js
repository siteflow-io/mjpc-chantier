const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud4/v8.html";
const cas = [["c-reglages", "Le prompt de création"], ["c-rattrapage", "Durée estimée"], ["c-rattrapage", "Pas encore noté"], ["c-reprendre", "pas encore « QCM"], ["c-papier-correction", "Question 1 / 3"]];
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const [id, txt] of cas) {
    const p = await b.newPage({viewport: {width: 1366, height: 768}});
    await p.goto("file://" + V + "#scene=" + id); await p.waitForTimeout(800);
    const r = await p.evaluate(t => { const i = [...document.querySelectorAll("#root .info-i")].find(x => (x.parentElement.textContent || "").includes(t)); if (!i) return "pas trouvé";
      const modal = [...document.querySelectorAll("#root *")].filter(e => getComputedStyle(e).position === "fixed" && e.getBoundingClientRect().width > 400).map(e => e.className).slice(0, 3);
      const R = i.getBoundingClientRect(); return {modal, x: Math.round(R.left), y: Math.round(R.top), w: Math.round(R.width), vis: getComputedStyle(i).visibility}; }, txt);
    let tip = null;
    try { const loc = p.locator("#root .info-i").filter({has: p.locator(".info-tip")}); const all = await p.$$("#root .info-i");
      for (const el of all) { const par = await el.evaluate(x => x.parentElement.textContent); if (par.includes(txt)) { await el.scrollIntoViewIfNeeded(); await el.hover({force: true}); await p.waitForTimeout(150);
        tip = await el.evaluate(x => { const t = x.querySelector(".info-tip"); const R = t.getBoundingClientRect(); const c = document.elementFromPoint(R.left + R.width / 2, R.top + R.height / 2); return {disp: getComputedStyle(t).display, R: [R.left, R.top, R.right, R.bottom].map(Math.round), dessus: c ? c.className + " " + (c.textContent || "").slice(0, 30) : null}; }); break; } } } catch (e) { tip = String(e).slice(0, 100); }
    console.log(id, txt, JSON.stringify(r), JSON.stringify(tip));
    await p.close();
  }
  await b.close();
})();

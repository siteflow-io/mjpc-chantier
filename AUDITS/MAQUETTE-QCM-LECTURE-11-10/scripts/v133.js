const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const [w,h] of [[1366,768],[1536,864]]) for (const id of ["c-resultats","c-resultats-rendues","c-bilan"]) {
    const p = await b.newPage({viewport:{width:w,height:h}});
    await p.goto("file://" + V + "#scene=" + id); await p.waitForTimeout(600);
    const r = await p.evaluate(() => { const t = document.querySelector("#root table"); if (!t) return null; let a = t.parentElement; while (a && a.scrollWidth <= a.clientWidth + 1 && a.id !== "root") a = a.parentElement; return {table: Math.round(t.getBoundingClientRect().width), boite: a ? a.className + " " + a.clientWidth + " / " + a.scrollWidth + " ovX=" + getComputedStyle(a).overflowX : null}; });
    console.log(w, id, JSON.stringify(r)); await p.close();
  }
  await b.close();
})();

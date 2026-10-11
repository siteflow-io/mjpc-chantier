const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const V = process.argv[2];
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1366,height:768}});
  for (const id of ["m-emploi-du-temps", "m-emploi-du-temps-un", "m-emploi-du-temps-tous"]) {
    await p.goto("file://" + V + "#scene=" + id); await p.reload(); await p.waitForTimeout(600);
    const r = await p.evaluate(async () => {
      const modale = [...document.querySelectorAll("*")].filter(e => { const cs = getComputedStyle(e); return (cs.position === "fixed") && e.getBoundingClientRect().width > innerWidth * 0.5 && e.getBoundingClientRect().height > innerHeight * 0.5 && !e.classList.contains("tprof-overlay"); }).map(e => (e.className || e.tagName) + " : " + e.innerText.trim().slice(0, 160));
      const res = [];
      for (const e of document.querySelectorAll("button:disabled, [aria-disabled=true]")) {
        if (!e.getBoundingClientRect().width) continue;
        e.scrollIntoView({block: "center"}); await new Promise(r => setTimeout(r, 30));
        const r = e.getBoundingClientRect(); const el = document.elementFromPoint((r.left + r.right)/2, (r.top + r.bottom)/2);
        const c = el && el.closest("[title]"); res.push(e.textContent.trim().slice(0, 28) + " → " + (el && !el.disabled && c && c.title.trim() ? "« " + c.title.slice(0, 60) + " »" : "RIEN (" + (el ? (el.className || el.tagName) : "null") + ")"));
      }
      return {modale, res};
    });
    console.log("== " + id + "\n modale ouverte : " + JSON.stringify(r.modale) + "\n " + r.res.join("\n "));
  }
  await b.close();
})();

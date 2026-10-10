const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1536,height:864}});
  const base = "file://" + process.argv[2];
  await p.goto(base); await p.waitForTimeout(800);
  const ids = await p.evaluate(() => (window.LISTE_SCENES||[]).map(s => s.id || s));
  const hits = new Map(); let nbDis = 0;
  for (const id of ids) {
    await p.goto(base + "#scene=" + id); await p.reload(); await p.waitForTimeout(150);
    const r = await p.evaluate(() => {
      const docs = [document, ...[...document.querySelectorAll("iframe")].map(f => { try { return f.contentDocument; } catch(e){ return null; } }).filter(Boolean)];
      const out = []; let n = 0;
      for (const d of docs) for (const e of d.querySelectorAll("button:disabled, [aria-disabled=true]")) {
        const bb = e.getBoundingClientRect(); if (!bb.width) continue; n++;
        const cs = getComputedStyle(e);
        // opacité effective (avec les parents)
        let op = 1, x = e; while (x && x.nodeType === 1) { op *= +getComputedStyle(x).opacity; x = x.parentElement; }
        const filt = cs.filter;
        // comparer à un frère actif de même classe
        const sib = [...d.querySelectorAll("button:not(:disabled)")].find(s => s.className === e.className && s.getBoundingClientRect().width);
        let same = false;
        if (sib) { const c2 = getComputedStyle(sib); same = c2.color === cs.color && c2.backgroundColor === cs.backgroundColor && c2.opacity === cs.opacity && c2.borderColor === cs.borderColor; }
        if (op > 0.75 && filt === "none" && (same || !sib)) out.push((e.textContent||"").trim().slice(0,40) + " | op=" + op.toFixed(2) + " | cursor=" + cs.cursor + " | frère actif identique=" + (sib ? same : "pas de frère"));
      }
      return {out, n};
    });
    nbDis += r.n;
    for (const x of r.out) { if (!hits.has(x)) hits.set(x, []); hits.get(x).push(id); }
  }
  console.log(ids.length + " scènes ; boutons fermés visibles : " + nbDis);
  for (const [x, l] of hits) console.log(l.length + " scènes (" + l.slice(0, 3).join(", ") + ") : " + x);
  await b.close();
})();

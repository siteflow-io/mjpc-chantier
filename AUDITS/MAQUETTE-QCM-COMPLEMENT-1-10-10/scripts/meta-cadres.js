const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const RE = /\btour\s+\d+|\bpoints?\s+\d{2,3}\b|\(\d{2,3}\)|cadrag|mandat|maquette|conscience|exécutant|proposé|proposée|proposition|à valider|pas encore validé|C12/i;
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1366,height:768}});
  const base = "file://" + process.argv[2];
  await p.goto(base); await p.waitForTimeout(800);
  const ids = await p.evaluate(() => (window.LISTE_SCENES||[]).map(s => s.id || s));
  const hits = new Map();
  for (const id of ids) {
    await p.goto(base + "#scene=" + id); await p.reload(); await p.waitForTimeout(200);
    const r = await p.evaluate((src) => {
      const RE = new RegExp(src, "i");
      const docs = [document, ...[...document.querySelectorAll("iframe")].map(f => { try { return f.contentDocument; } catch(e){ return null; } }).filter(Boolean)];
      const out = [];
      for (const d of docs) {
        // textes visibles, hors sommaire ⚙
        const w = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
        let n; while ((n = w.nextNode())) { const el = n.parentElement; if (!el || el.closest("[data-sommaire], .sommaire, #sommaire")) continue; const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue; const t = n.textContent.trim(); if (t && RE.test(t)) out.push("TEXTE | " + t.slice(0, 160)); }
        for (const e of d.querySelectorAll("[title], [data-tip], [aria-label]")) { if (e.closest("[data-sommaire], .sommaire, #sommaire")) continue; for (const a of ["title", "data-tip", "aria-label"]) { const t = e.getAttribute(a); if (t && RE.test(t)) out.push("INFOBULLE | " + t.slice(0, 160)); } }
      }
      return out;
    }, RE.source);
    for (const x of r) { if (!hits.has(x)) hits.set(x, []); hits.get(x).push(id); }
  }
  for (const [x, l] of hits) console.log(l.length + " scènes (" + l.slice(0, 3).join(", ") + ") : " + x);
  await b.close();
})();

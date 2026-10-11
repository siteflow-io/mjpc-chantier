const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs");
(async () => {
  const V = process.argv[2];
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const out = [];
  const scenes = ["m-classe-exclusions","m-exclusion-refusee","m-fiche-eleve","m-taxonomie","m-taxonomie-editeur","m-taxonomie-domaine","m-taxonomie-notion","m-taxonomie-competences","m-taxonomie-competence","m-emploi-du-temps","m-emploi-du-temps-un","m-emploi-du-temps-tous"];
  for (const [w,h] of [[1366,768],[1536,864],[1920,1080]]) {
    const p = await b.newPage({viewport:{width:w,height:h}});
    for (const id of scenes) {
      await p.goto("file://" + V + "#scene=" + id); await p.reload(); await p.waitForTimeout(500);
      const r = await p.evaluate(() => {
        const box = document.querySelector(".tprof-box"); const R = box ? box.getBoundingClientRect() : null;
        const cont = document.querySelector(".tprof-content");
        const lignes = [...document.querySelectorAll(".el-row")].map(row => { const c = row.getBoundingClientRect(); const bs = [...row.querySelectorAll(".el-acts button")].map(x => x.getBoundingClientRect()); const n = row.querySelector(".el-name").getBoundingClientRect(); const dedans = bs.every(x => x.left >= c.left - 0.5 && x.right <= c.right + 0.5 && x.top >= c.top - 0.5 && x.bottom <= c.bottom + 0.5); const ctr = bs.length ? Math.abs((bs[0].top + bs[0].bottom)/2 - (n.top + n.bottom)/2) : -1; return dedans && ctr <= 4; });
        // boutons fermés : aspect et survol
        const fermes = [...document.querySelectorAll("button:disabled, [aria-disabled=true]")].filter(e => e.getBoundingClientRect().width).map(e => {
          let op = 1, x = e; while (x && x.nodeType === 1) { op *= +getComputedStyle(x).opacity; x = x.parentElement; }
          const r = e.getBoundingClientRect(); const el = document.elementFromPoint((r.left + r.right)/2, (r.top + r.bottom)/2);
          const cible = el && (el.closest("[title]")); const ok = el && !el.disabled && cible && cible.title.trim();
          return {t: e.textContent.trim().slice(0, 30), op: +op.toFixed(2), cur: getComputedStyle(e).cursor, survol: ok ? cible.title.slice(0, 50) : null};
        });
        // emploi du temps : boutons de plus de deux lignes
        const hauts = [...document.querySelectorAll("#edt-panneau button, .edt-btn")].filter(e => e.getBoundingClientRect().width).map(e => { const lh = parseFloat(getComputedStyle(e).lineHeight) || 18; const ph = parseFloat(getComputedStyle(e).paddingTop) + parseFloat(getComputedStyle(e).paddingBottom); const lignes = Math.round((e.getBoundingClientRect().height - ph) / lh); return {t: e.textContent.trim().slice(0, 40), lignes}; }).filter(x => x.lignes > 2);
        return {bords: R ? [Math.round(R.left), Math.round(R.top), Math.round(innerWidth - R.right), Math.round(innerHeight - R.bottom)] : null,
          defilH: document.documentElement.scrollWidth > innerWidth + 1 || (cont && cont.scrollWidth > cont.clientWidth + 1),
          lignes: lignes.length, lignesKo: lignes.filter(x => !x).length, fermes, hauts,
          etats: [...document.querySelectorAll(".edt-etats > *")].map(e => e.textContent.trim().slice(0, 140))};
      });
      const fermesKo = r.fermes.filter(f => !(f.op <= 0.6) || f.cur === "pointer" || !f.survol);
      out.push(`${w}x${h} ${id} | bords ${JSON.stringify(r.bords)} | défilement de côté ${r.defilH} | lignes élèves ${r.lignes} (hors carte ${r.lignesKo}) | fermés ${r.fermes.length} (mal faits ${fermesKo.length}${fermesKo.length ? " : " + JSON.stringify(fermesKo.slice(0,3)) : ""}) | boutons > 2 lignes ${r.hauts.length}${r.hauts.length ? " " + JSON.stringify(r.hauts.slice(0,3)) : ""}`);
      if (w === 1536 && id === "m-emploi-du-temps") out.push("   états : " + JSON.stringify(r.etats));
    }
    await p.close();
  }
  console.log(out.join("\n"));
  await b.close();
})();

const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1536,height:864}});
  const base = "file://" + process.argv[2];
  await p.goto(base); await p.waitForTimeout(800);
  const scenes = await p.evaluate(() => (window.LISTE_SCENES||[]).filter(s => ["console","telephone"].includes(s.vue)).map(s => s.id));
  let tot = {inter: 0, interSans: 0, indic: 0, indicSans: 0}; const exemples = new Map(); const parScene = [];
  for (const id of scenes) {
    await p.goto(base + "#scene=" + id); await p.reload(); await p.waitForTimeout(200);
    const r = await p.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 2 && r.height > 2 && cs.visibility !== "hidden" && cs.display !== "none"; };
      const titre = e => { const c = e.closest("[title]"); return c && c.title.trim() ? c : null; };
      const res = {inter: 0, interSans: 0, indic: 0, indicSans: 0, ex: []};
      const docs = [document, ...[...document.querySelectorAll("iframe")].map(f => { try { return f.contentDocument; } catch(e) { return null; } }).filter(Boolean)];
      for (const d of docs) {
        for (const e of d.querySelectorAll("button, input, select, textarea, a[href], [onclick], [role=button], label")) {
          if (!vis(e) || e.closest(".som-gear")) continue; res.inter++; if (!titre(e)) { res.interSans++; res.ex.push("geste · " + (e.innerText || e.value || e.placeholder || e.tagName).trim().slice(0, 40)); } }
        for (const e of d.querySelectorAll("[class*=badge], [class*=pill], [class*=pastille], [class*=chip], [class*=compteur], [class*=stat], [class*=tag], [class*=chrono], [class*=etat], [class*=statut], th")) {
          if (!vis(e) || e.closest("button") || e.closest(".som-gear")) continue; res.indic++; if (!titre(e)) { res.indicSans++; res.ex.push("affichage · " + (e.innerText || "").trim().slice(0, 40)); } }
      }
      return res; });
    for (const k of ["inter", "interSans", "indic", "indicSans"]) tot[k] += r[k];
    parScene.push(id + " : gestes " + r.inter + " (sans infobulle " + r.interSans + ") · affichages " + r.indic + " (sans " + r.indicSans + ")");
    for (const x of r.ex) { if (!exemples.has(x)) exemples.set(x, 0); exemples.set(x, exemples.get(x) + 1); }
  }
  console.log(scenes.length + " scènes de Paul (console, téléphone, MJPC)");
  console.log("gestes visibles : " + tot.inter + " ; sans infobulle au survol : " + tot.interSans);
  console.log("affichages (pastilles, compteurs, états, en-têtes) : " + tot.indic + " ; sans infobulle : " + tot.indicSans);
  console.log("--- les plus fréquents sans infobulle ---");
  console.log([...exemples].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, n]) => String(n).padStart(4) + " " + k).join("\n"));
  console.log("--- par scène ---\n" + parScene.join("\n"));
  await b.close();
})();

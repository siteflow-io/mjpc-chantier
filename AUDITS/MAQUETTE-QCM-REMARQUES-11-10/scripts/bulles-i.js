const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1366,height:768}});
  const base = "file://" + process.argv[2];
  await p.goto(base); await p.waitForTimeout(800);
  const scenes = await p.evaluate(() => (window.LISTE_SCENES||[]).map(s => s.id));
  let n = 0; const ko = new Map();
  for (const id of scenes) {
    await p.goto(base + "#scene=" + id); await p.reload(); await p.waitForTimeout(150);
    const nb = await p.evaluate(() => document.querySelectorAll(".info-i").length);
    for (let k = 0; k < nb; k++) {
      const loc = p.locator(".info-i").nth(k);
      if (!(await loc.isVisible().catch(() => false))) continue;
      try { await loc.scrollIntoViewIfNeeded({timeout: 1000}); await loc.hover({timeout: 1000, force: true}); } catch (e) { continue; }
      await p.waitForTimeout(60); n++;
      const r = await p.evaluate((k) => { const i = document.querySelectorAll(".info-i")[k]; const t = i.querySelector(".info-tip"); if (!t) return null; const R = t.getBoundingClientRect(); const cs = getComputedStyle(t);
        const modales = [...document.querySelectorAll(".modal-back, .at-modale, [class*=modale]")].filter(m => getComputedStyle(m).display !== "none" && m.getBoundingClientRect().width > 200);
        if (modales.length && !modales.some(m => m.contains(i))) return {sous_modale: true};
        const deborde = t.scrollWidth > t.clientWidth + 2; const horsEcran = (R.left < 0 || R.right > innerWidth + 1) ? "coupée sur le côté" : (R.bottom > innerHeight + 1 ? "coupée en bas" : "");
        let couvert = 0; for (const fy of [0.3, 0.7]) for (const fx of [0.15, 0.5, 0.85]) { const el = document.elementFromPoint(R.left + R.width * fx, R.top + R.height * fy); if (el && !t.contains(el)) couvert++; }
        return {ctx: (i.parentElement.textContent || "").trim().slice(0, 45), ws: cs.whiteSpace, deborde, horsEcran, couvert, disp: cs.display}; }, k);
      if (r && r.sous_modale) continue;
      if (r && (r.deborde || r.ws === "nowrap" || r.horsEcran || r.couvert > 0 || r.disp === "none")) { const cle = [r.ctx, r.deborde ? "déborde" : "", r.ws === "nowrap" ? "nowrap" : "", r.horsEcran || "", r.couvert ? "recouverte " + r.couvert + "/6" : "", r.disp === "none" ? "ne s'ouvre pas" : ""].filter(Boolean).join(" · "); if (!ko.has(cle)) ko.set(cle, []); ko.get(cle).push(id); }
    }
  }
  console.log(scenes.length + " scènes ; " + n + " « i » survolés ; " + [...ko.values()].reduce((a, l) => a + l.length, 0) + " en défaut :");
  for (const [k, l] of ko) console.log(String(l.length).padStart(3) + " · " + k + " · (" + [...new Set(l)].slice(0, 4).join(", ") + ")");
  await b.close();
})();

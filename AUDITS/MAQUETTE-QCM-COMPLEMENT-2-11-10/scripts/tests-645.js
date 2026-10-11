// Les quatre tests du tour 645, joués par le geste (clics, survol, taille de fenêtre), comme Paul les ferait.
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const OUT = process.argv[3];
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1536,height:864}});
  const log = [];
  const ok = (cond, quoi) => { log.push((cond ? "✔ " : "✖ ") + quoi); return cond; };
  const message = async () => p.evaluate(() => { const m = document.querySelector(".at-modale"); return m && getComputedStyle(m).display !== "none" ? m.innerText.trim() : null; });
  const ouvrirScene = async (n) => {
    await p.click("button.som-gear"); await p.waitForTimeout(400);
    const lien = p.locator(`text=/^\\s*${n}\\b/`).first();
    const nb = await lien.count();
    if (!nb) throw new Error("écran " + n + " introuvable dans le sommaire");
    await lien.click(); await p.waitForTimeout(700);
  };
  await p.goto("file://" + process.argv[2]); await p.waitForTimeout(1000);

  // Test 1
  await ouvrirScene(162);
  ok(await p.locator("text=Emploi du temps").first().isVisible(), "test 1 · l'écran 162 s'ouvre par le sommaire ⚙");
  const fermeAvant = await p.locator("button:has-text('Sortir les JSON cochés')").isDisabled();
  ok(fermeAvant, "test 1 · « ⤓ Sortir les JSON cochés » fermé tant que rien n'est coché");
  await p.locator("label:has-text('Calendrier de l’année — injecté'), label:has-text(\"Calendrier de l'année — injecté\")").first().click();
  await p.click("button:has-text('Sortir les JSON cochés')"); await p.waitForTimeout(400);
  let m = await message(); ok(m && /JSON de « calendrier » copié — 19717 caractères\./.test(m), "test 1 · message : " + m);
  await p.screenshot({path: OUT + "/test1-calendrier.png", fullPage: false});
  await p.click(".at-modale button"); await p.waitForTimeout(300);

  // Test 2
  await p.click("button:has-text('Tout cocher')"); await p.waitForTimeout(200);
  await p.click("button:has-text('Sortir les JSON cochés')"); await p.waitForTimeout(400);
  m = await message(); ok(m && /« calendrier », « grille », « creneaux », « periodes », « photos » et « reglages » copié — 33349 caractères\./.test(m), "test 2 · message : " + m);
  await p.screenshot({path: OUT + "/test2-tous.png"});
  await p.click(".at-modale button"); await p.waitForTimeout(300);

  // Test 3
  await ouvrirScene(153);
  const tdb = p.locator("button:has-text('Tableau de bord')").first();
  const bb = await tdb.boundingBox();
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(300);
  const s = await p.evaluate(({x, y}) => { const el = document.elementFromPoint(x, y); const btn = [...document.querySelectorAll("button")].find(e => /Tableau de bord/.test(e.textContent));
    let op = 1, z = btn; while (z && z.nodeType === 1) { op *= +getComputedStyle(z).opacity; z = z.parentElement; }
    const c = el && el.closest("[title]"); return {op: +op.toFixed(2), curseur: getComputedStyle(el).cursor, ferme: btn.disabled, raison: c ? c.title : null}; }, {x: bb.x + bb.width / 2, y: bb.y + bb.height / 2});
  ok(s.ferme && s.op <= 0.6, "test 3 · « Tableau de bord » fermé et estompé (opacité " + s.op + ")");
  ok(s.curseur === "not-allowed", "test 3 · sous la souris, le curseur est barré (" + s.curseur + ")");
  ok(s.raison === "Inchangé : cet écran reste celui d'aujourd'hui.", "test 3 · la raison au survol : « " + s.raison + " »");
  await p.screenshot({path: OUT + "/test3-survol.png", clip: {x: 0, y: 0, width: 760, height: 500}});

  // Test 4 : la fenêtre change de taille, sur le même écran, sans rechargement
  for (const [w, h] of [[1920, 1080], [1366, 768], [1280, 720], [1100, 700], [1536, 864]]) {
    await p.setViewportSize({width: w, height: h}); await p.waitForTimeout(350);
    const r = await p.evaluate(() => { const R = document.querySelector(".tprof-box").getBoundingClientRect();
      const lignes = [...document.querySelectorAll(".el-row")]; const ko = lignes.filter(row => { const c = row.getBoundingClientRect(); return [...row.querySelectorAll(".el-acts button")].some(x => { const a = x.getBoundingClientRect(); return a.left < c.left - 0.5 || a.right > c.right + 0.5 || a.top < c.top - 0.5 || a.bottom > c.bottom + 0.5; }); }).length;
      return {bords: [R.left, R.top, innerWidth - R.right, innerHeight - R.bottom].map(Math.round), lignes: lignes.length, ko, cote: document.documentElement.scrollWidth > innerWidth + 1}; });
    ok(r.bords.every(x => Math.abs(x) <= 1) && r.ko === 0 && !r.cote, `test 4 · ${w}×${h} : bords ${JSON.stringify(r.bords)}, ${r.lignes} lignes, ↻ ✕ hors carte ${r.ko}, défilement de côté ${r.cote}`);
    if (w === 1366) await p.screenshot({path: OUT + "/test4-1366.png"});
  }
  console.log(log.join("\n")); console.log(log.filter(x => x.startsWith("✖")).length + " échec(s) sur " + log.length);
  await b.close();
})();

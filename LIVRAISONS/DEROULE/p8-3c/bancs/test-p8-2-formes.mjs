// (p8-2) les formes du schéma, reprises de l'ancien moteur, lisibles par construction — par le geste : chaque forme créée dans l'atelier (« + bloc » → « Schéma… »),
// seule sur sa diapo, dévoilée au pilote par ▶ bulle par bulle, vérifiée au tableau (1280 × 720) ; les places de toutes les bulles identiques avant et après chaque ▶ (T2) ;
// aucune police sous 26 pt à aucun cran de « Texte au tableau » (T1) ; la mesure à 0 sur les formes qui tiennent, aux trois tailles d'écran, colonnes ouvertes et repliées ;
// la vraie carte « Les figures de style » (8 familles, 26 notions — 34 bulles à dévoiler) mesurée et capturée telle quelle. Les captures sont écrites avec leurs cinq chiffres (captures/MESURES.txt).
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
const MES = []; const cinq = m => `chevauchements ${m.chevauchements} · hors du cadre visible ${m.horsCadre} · traits à travers un mot ${m.traits} · libellés sur deux lignes ${m.deuxLignes} · polices sous 26 pt ${m.sousPlancher}`;
const mesurer = (pg, sel) => pg.evaluate(s => { const m = p8MesureLisible(document.querySelector(s)); return { chevauchements: m.chevauchements, horsCadre: m.horsCadre, traits: m.traits, deuxLignes: m.deuxLignes, sousPlancher: m.sousPlancher, total: m.total, details: m.details.slice(0, 8) }; }, sel);
const places = (pg, sel) => pg.evaluate(s => Array.from(document.querySelectorAll(s + ' .p8-dessin g.p8-n rect, ' + s + ' .p8-dessin .p8-l, ' + s + ' .p8-dessin .p8-grille tr')).map(x => x.tagName === 'TR' ? [x.offsetLeft, x.offsetTop, x.offsetWidth, x.offsetHeight].join(',') : x.tagName === 'rect' ? ['x', 'y', 'width', 'height'].map(a => x.getAttribute(a)).join(',') : (x.getAttribute('d') || ['x1', 'y1', 'x2', 'y2'].map(a => x.getAttribute(a)).join(','))).join(';'), sel);
const montrees = (pg, sel) => pg.evaluate(s => Array.from(document.querySelectorAll(s + ' .p8-dessin g.p8-n, ' + s + ' .p8-dessin .p8-grille tr')).filter(g => !g.classList.contains('p8-pas') && getComputedStyle(g).display !== 'none' && getComputedStyle(g).visibility !== 'hidden').length, sel);
const allerA = async eid => { const i = await ev(e => indexDe(e), eid); await page.click('#volet .at-chap .d[data-at-di="' + i + '"]'); await p(400); };
await page.goto(MAQUETTE); await p(600); await page.click('#edt-cases [data-atelier="1"]'); await p(500); await page.click('#at-aide .x'); await p(200);
// les cinq formes, plus la vraie carte — créées par le geste, chacune seule sur sa diapo (la consigne de la diapo insérée est supprimée au clic droit)
const VRAIE = ["Figures d'analogie : personnification, comparaison, métaphore, allégorie", "Figures d'opposition : antithèse, oxymore, antiphrase", "Figures de substitution : métonymie, synecdoque, périphrase, ironie", "Figures d'insistance : anaphore, répétition, pléonasme", "Figures d'amplification : hyperbole, accumulation, gradation", "Figures d'atténuation : euphémisme, litote", "Figures syntaxiques : parallélisme, chiasme, ellipse", "Procédés sonores : allitération, assonance, onomatopée, homophone"];
const FORMES = [
  { nom: 'carte', titre: 'Trois familles de figures', lignes: ["Figures d'analogie : comparaison, métaphore", "Figures d'opposition : antithèse, oxymore", "Figures d'insistance : anaphore, hyperbole"], n: 9, base: 1 },
  { nom: 'frise', titre: 'Le siècle des poètes', lignes: ['1820 = Lamartine', '1830 = Hernani', '1857 = Baudelaire', '1866 = Parnasse'], n: 4, base: 0 },
  { nom: 'arbre', titre: 'Classer les phrases', lignes: ['la phrase', '  simple', '  complexe', '    juxtaposée', '    subordonnée'], n: 5, base: 0 },
  { nom: 'cycle', titre: 'Écrire un poème', lignes: ['lire', 'noter', 'dire', 'écrire'], n: 4, base: 0 },
  { nom: 'tableau', titre: 'Deux mouvements', lignes: ['| Romantisme | Parnasse', 'le je | partout | effacé', 'la forme | libre | sculptée'], n: 3, base: 0 },
  { nom: 'vraie-carte', forme: 'carte', titre: 'Les figures de style', lignes: VRAIE, n: 34, base: 1, vraie: true }];
for (const f of FORMES) {
  await page.click('#volet .at-chap .d[data-at-di="6"]'); await p(300); await page.keyboard.press('Control+Enter'); await p(500);
  await page.click('#at-bloc'); await p(300); await page.click('.choix-obj .c[data-t="schema"]'); await p(300); await page.selectOption('#of-forme', f.forme || f.nom); await page.fill('#of-t', f.titre); await page.fill('#of-src', f.lignes.join('\n')); await page.click('#of-ok'); await p(500);
  await page.click('#mur [data-p="0.t"]', { button: 'right' }); await p(300); await page.click('#menu [data-a="b-supprimer"]'); await p(900);
  f.eid = await ev(() => ecran().eid);
  const s = await ev(() => { const e = ecran(); const b = e.blocs[0]; return { nb: e.blocs.length, t: b.t, forme: b.forme, dev: b.devoilerTout, n: elements(e).length, bulles: document.querySelectorAll('#mur .p8-dessin g.p8-n, #mur .p8-dessin .p8-grille tr').length, droite: document.getElementById('droite-atelier').textContent }; });
  ok(s.nb === 1 && s.t === 'schema' && s.forme === (f.forme || f.nom), f.nom + ' : le schéma n\'est pas seul sur sa diapo : ' + JSON.stringify(s).slice(0, 200));
  ok(s.dev === false, f.nom + ' : créé par « Schéma… », il ne part pas « Un à un » (décision 6 ter)');
  ok(s.n === f.n, f.nom + ' : ' + s.n + ' éléments à dévoiler au lieu de ' + f.n + ' (une bulle par ▶)');
  ok(s.bulles === f.n + f.base, f.nom + ' : ' + s.bulles + ' bulles dessinées au lieu de ' + (f.n + f.base));
  const m = await mesurer(page, '#mur'); f.mAtelier = m; ok(m.sousPlancher === 0, f.nom + ' : une police sous 26 pt dans l\'atelier');
  if (!f.vraie) { ok(m.total === 0, f.nom + ' : la mesure n\'est pas à 0 dans l\'atelier : ' + cinq(m) + ' — ' + m.details.join(' / ')); ok(!/ne tient pas lisible/.test(s.droite), f.nom + ' : « Sur la forme » dit « ne tient pas lisible » pour un schéma qui tient'); }
  else ok(m.total === 0 || /il ne tient pas lisible — coupe-le : clic droit sur une famille → Couper le schéma ici/.test(s.droite), 'la vraie carte ne tient pas, et « Sur la forme » ne le dit pas');
}
// la vraie carte dans l'atelier : la capture et la mesure disent si elle tient (ni la police ni rien d'autre n'est baissé)
const vraie = FORMES.find(f => f.vraie); await allerA(vraie.eid); await p(400);
await page.screenshot({ path: capture('p8-2-vraie-carte-atelier.png') }); await page.locator('#murcadre').screenshot({ path: capture('p8-2-vraie-carte-atelier-zoom.png') });
const mV = await mesurer(page, '#mur'); MES.push('p8-2-vraie-carte-atelier.png (et -zoom) · au pilote, dans l\'atelier, tout montré · ' + cinq(mV));
// le dévoilement, au pilote et au tableau : « ▶ Jouer en avance — répétition » sur chaque diapo, la fenêtre du tableau à 1280 × 720
let tab = null;
for (const f of FORMES) {
  await allerA(f.eid); await page.click('#at-jouer'); await p(500);
  if (!tab) { [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]); tab.on('pageerror', e => { errs.push('tableau : ' + e.message); }); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(600); }
  else { await page.click('#bvideoproj'); await p(500); }
  ok(await ev(eid => ecran().eid === eid && etatDiapo().nDev === 0, f.eid), f.nom + ' : la répétition ne s\'ouvre pas sur la diapo du schéma, rien dévoilé');
  ok(await montrees(page, '#mur') === f.base && await montrees(tab, '#mur2') === f.base, f.nom + ' : avant tout ▶, ce qui est montré n\'est pas ' + f.base + ' (pilote ' + await montrees(page, '#mur') + ', tableau ' + await montrees(tab, '#mur2') + ')');
  ok(await page.evaluate(() => document.querySelectorAll('#mur .p8-dessin .p8-pas').length > 0) && await tab.evaluate(() => Array.from(document.querySelectorAll('#mur2 .p8-dessin .p8-pas')).every(g => getComputedStyle(g).display === 'none' || getComputedStyle(g).visibility === 'hidden')), f.nom + ' : le non-dévoilé n\'est pas pâle au pilote ou pas absent au tableau');
  let P0 = await places(page, '#mur'), T0 = await places(tab, '#mur2'); let bougeP = 0, bougeT = 0, compte = 0;
  const moitie = Math.floor(f.n / 2);
  for (let i = 1; i <= f.n; i++) {
    await page.keyboard.press('ArrowRight'); await p(f.vraie ? 160 : 300);
    if ((await places(page, '#mur')) !== P0) bougeP++; if ((await places(tab, '#mur2')) !== T0) bougeT++;
    if ((await montrees(page, '#mur')) !== f.base + i || (await montrees(tab, '#mur2')) !== f.base + i) compte++;
    if (!f.vraie && (i === moitie || i === f.n)) { const q = i === f.n ? 'entier' : 'moitie';
      await page.screenshot({ path: capture(`p8-2-${f.nom}-pilote-${q}.png`) }); await page.locator('#murcadre').screenshot({ path: capture(`p8-2-${f.nom}-pilote-${q}-zoom.png`) }); await tab.screenshot({ path: capture(`p8-2-${f.nom}-tableau-${q}.png`) });
      const mp = await mesurer(page, '#mur'), mt = await mesurer(tab, '#mur2');
      MES.push(`p8-2-${f.nom}-pilote-${q}.png (et -zoom) · ${i} / ${f.n} dévoilé · au pilote : ${cinq(mp)}`); MES.push(`p8-2-${f.nom}-tableau-${q}.png · ${i} / ${f.n} dévoilé · au tableau 1280 × 720 : ${cinq(mt)}`);
      ok(mp.total === 0 && mt.total === 0, f.nom + ' (' + q + ') : la mesure n\'est pas à 0 — pilote : ' + cinq(mp) + ' ; tableau : ' + cinq(mt) + ' — ' + mp.details.concat(mt.details).join(' / ')); }
  }
  ok(bougeP === 0, f.nom + ' : au pilote, les places ont bougé à ' + bougeP + ' ▶ sur ' + f.n + ' (T2)'); ok(bougeT === 0, f.nom + ' : au tableau, les places ont bougé à ' + bougeT + ' ▶ sur ' + f.n + ' (T2)');
  ok(compte === 0, f.nom + ' : à ' + compte + ' ▶, il n\'y avait pas exactement une bulle de plus au pilote et au tableau');
  ok(await ev(eid => ecran().eid === eid && etatDiapo().nDev === elements(ecran()).length, f.eid), f.nom + ' : après ' + f.n + ' ▶, la diapo n\'est pas entièrement dévoilée (ou ▶ a quitté la diapo trop tôt)');
  if (f.vraie) { await tab.screenshot({ path: capture('p8-2-vraie-carte-tableau.png') }); const mt = await mesurer(tab, '#mur2'); MES.push('p8-2-vraie-carte-tableau.png · 34 / 34 dévoilé · au tableau 1280 × 720 : ' + cinq(mt)); vraie.mTableau = mt; }
  // T1 : aucun cran de « Texte au tableau » ne descend sous 26 pt (la réglette, au clavier)
  if (!f.vraie) { await page.click('#taille'); await page.keyboard.press('Home'); await p(300); const crans = [];
    for (let c = 0; c < 5; c++) { if (c) { await page.keyboard.press('ArrowRight'); await p(300); } const r = await ev(() => S.taille); const mp = await mesurer(page, '#mur'), mt = await mesurer(tab, '#mur2'); crans.push(r + ':' + mp.sousPlancher + '/' + mt.sousPlancher); ok(mp.sousPlancher === 0 && mt.sousPlancher === 0, f.nom + ' : au cran ' + r + ', une police sous 26 pt (pilote ' + mp.sousPlancher + ', tableau ' + mt.sousPlancher + ')'); }
    ok(crans.map(x => x.split(':')[0]).join(',') === '0,1,2,3,4', f.nom + ' : la réglette n\'a pas parcouru les cinq crans : ' + crans.join(' '));
    ok(await ev(eid => ecran().eid === eid, f.eid), f.nom + ' : la réglette a fait changer de diapo'); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight'); await p(200); }
  await page.click('#rep-stop'); await p(500);
}
// les tailles d'écran : la mesure à 0 sur les formes qui tiennent, aux trois tailles, colonnes ouvertes et repliées (double-clic sur les poignées)
for (const [w, h] of [[1366, 768], [1536, 864], [1920, 1080]]) for (const repli of [false, true]) {
  await page.setViewportSize({ width: w, height: h }); await p(500);
  for (const f of FORMES) { await allerA(f.eid); if (repli) { await page.dblclick('#pg'); await page.dblclick('#pd'); await p(500); }
    const m = await mesurer(page, '#mur'); const lib = `${w} × ${h}${repli ? ', colonnes repliées' : ''}`; MES.push(`(sans capture) ${f.nom} · ${lib} · dans l'atelier : ${cinq(m)}`);
    if (!f.vraie) ok(m.total === 0, f.nom + ' à ' + lib + ' : la mesure n\'est pas à 0 : ' + cinq(m) + ' — ' + m.details.join(' / '));
    ok(m.sousPlancher === 0, f.nom + ' à ' + lib + ' : une police sous 26 pt');
    if (repli) { await page.dblclick('#pg'); await page.dblclick('#pd'); await p(400); } }
}
fs.writeFileSync(capture('MESURES.txt'), MES.join('\n') + '\n\nLa vraie carte « Les figures de style » — atelier : ' + cinq(vraie.mAtelier) + (vraie.mAtelier.total ? ' · elle ne tient pas lisible' : ' · elle tient') + '\n');
console.log('la vraie carte : ' + (vraie.mAtelier.total ? 'ne tient pas — ' : 'tient — ') + cinq(vraie.mAtelier));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();

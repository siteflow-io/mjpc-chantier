// (p8-5g) la fenêtre du tableau reçoit les pages dès son ouverture — par la souris et le clavier, à 1280 × 800 (dette n°13 · 17 ; complément p8-5g, point 4) :
// la diapo 1 avec huit lignes tapées sous le dernier bloc (comme test-p8-5f), heure lancée ;
// O  « 🖥 Écran 2 » ouvert à 0 dévoilé, puis fermé et rouvert à 9 dévoilés, à 13, et à 9 avec la page 2 choisie à la molette → à chaque ouverture, dans la seconde,
//    le tableau a le même compteur et la même page que le pilote (les mêmes lignes dévoilées visibles, comparées par data-p), rien hors de son cadre ;
// P  puis un ▶ : toujours la même page des deux côtés ;
// R  la répétition : « 🖥 Écran 2 » ouvert en répétition sur une diapo en pages → la même page ;
// G  (garde d'un relecteur neuf) le gel : rouvert pendant le gel, le tableau montre ce qu'il montrait au gel, avec son compteur et sa police ; au dégel, il rejoint le pilote.
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const errs = []; const boites = []; const D = []; const MES = []; let N = 0; const ok = (c, m) => { N++; if (!c) D.push(m); };
const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } }); const pg = await ctx.newPage();
pg.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message); }); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); });
await pg.goto(MAQUETTE); await pg.waitForTimeout(700);
const p = ms => pg.waitForTimeout(ms);
// ce qu'un mur montre (lu, jamais modifié) : le compteur de page, les lignes visibles par data-p, celles qui sortent du cadre
const voir = (fen, sel) => fen.evaluate(sel => { const m = document.querySelector(sel); const R = m.getBoundingClientRect(); const c = m.querySelector('.corpsd'); if (!c) return { page: '', lignes: [], hors: [] };
  const vis = Array.from(c.querySelectorAll('[data-p]')).filter(e => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return b.height > 0 && b.width > 0 && !e.closest('.hors') && !e.classList.contains('pas') && cs.visibility !== 'hidden' && cs.opacity !== '0'; });
  const hors = vis.filter(e => { const b = e.getBoundingClientRect(); return b.top < R.top - 1 || b.bottom > R.bottom + 1; }).map(e => e.dataset.p);
  return { page: ((m.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), lignes: vis.map(e => e.dataset.p), hors, police: getComputedStyle(c).fontSize }; }, sel);
const pareil = (a, b) => a.page === b.page && JSON.stringify(a.lignes) === JSON.stringify(b.lignes);
// ouvrir « 🖥 Écran 2 » par son bouton ; attendre au plus une seconde que le tableau montre ce que montre le pilote
const ouvrirEcran2 = async () => { const [fen] = await Promise.all([pg.waitForEvent('popup'), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.setViewportSize({ width: 1280, height: 720 });
  const t0 = Date.now(); let pil, tab; do { await fen.waitForTimeout(100); pil = await voir(pg, '#mur'); tab = await voir(fen, '#mur2'); } while (!pareil(pil, tab) && Date.now() - t0 < 1000); return { fen, pil, tab, ms: Date.now() - t0 }; };
const devoile = () => pg.evaluate(() => etatDiapo().nDev);
const ligne = i => `Ligne ${i} tapée à 1280 px, assez longue pour prendre de la place dans la diapo.`;

// la diapo 1 avec huit lignes tapées sous le dernier bloc, dans l'atelier (comme test-p8-5f)
await pg.click('#edt-cases [data-atelier="1"]'); await p(500); if (await pg.$('#at-aide .x')) { await pg.click('#at-aide .x'); await p(200); }
await pg.click('#mur .p8-ecrire'); await p(100); for (let i = 1; i <= 8; i++) { await pg.keyboard.type(ligne(i), { delay: 2 }); if (i < 8) await pg.keyboard.press('Enter'); }
await pg.keyboard.press('Escape'); await p(400);
await pg.click('#ong-pilotage'); await p(300); await pg.click('[data-lancer="1"]'); await p(600);
const p0 = await voir(pg, '#mur'); ok(/^page 1 \/ 2$/.test(p0.page), `heure lancée : la diapo 1 est en pages (« ${p0.page} »)`);

// O — à chaque ouverture, dans la seconde, la même page que le pilote
const cas = [{ nom: '0 dévoilé', avance: 0 }, { nom: '9 dévoilés', avance: 9 }, { nom: '13 dévoilés', avance: 4 }, { nom: '9 dévoilés, page 2 à la molette', recule: 4, molette: true }];
for (const c of cas) {
  for (let i = 0; i < (c.avance || 0); i++) { await pg.click('#bdev'); await p(80); }
  for (let i = 0; i < (c.recule || 0); i++) { await pg.click('#bprec'); await p(80); }
  if (c.molette) { const r = await pg.evaluate(() => { const b = document.getElementById('murcadre').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); await pg.mouse.move(r.x, r.y); await pg.mouse.wheel(0, 200); }
  await p(400); const n = await devoile();
  const { fen, pil, tab, ms } = await ouvrirEcran2();
  ok(pil.page !== '' && pil.page === tab.page, `O · ouvert à ${c.nom} (${n}) : le tableau n'a pas le compteur du pilote (pilote « ${pil.page} », tableau « ${tab.page} »)`);
  ok(JSON.stringify(pil.lignes) === JSON.stringify(tab.lignes), `O · ouvert à ${c.nom} (${n}) : le tableau ne montre pas les lignes dévoilées du pilote (pilote ${pil.lignes.join(',')} ; tableau ${tab.lignes.join(',')})`);
  ok(ms <= 1000, `O · ouvert à ${c.nom} : pas pareil dans la seconde (${ms} ms)`);
  ok(!tab.hors.length && !pil.hors.length, `O · ouvert à ${c.nom} : hors du cadre — tableau ${tab.hors.join(',')} ; pilote ${pil.hors.join(',')}`);
  if (c.molette) ok(/^page 2/.test(pil.page) && n === 9, `O · la molette a choisi la page 2 à 9 dévoilés (« ${pil.page} », ${n})`);
  if (c.nom === '9 dévoilés') { await pg.screenshot({ path: capture('p8-5g-pilote-9-devoiles.png') }); await fen.screenshot({ path: capture('p8-5g-tableau-ouvert-a-9-devoiles.png') });
    // les deux écrans entiers, côte à côte, sur une seule image (le pilote à gauche, la fenêtre du tableau à droite)
    const img = n => 'data:image/png;base64,' + fs.readFileSync(capture(n)).toString('base64'); const cote = await ctx.newPage(); await cote.setViewportSize({ width: 2580, height: 820 });
    await cote.setContent(`<body style="margin:0;background:#333;display:flex;gap:20px;padding:10px"><img src="${img('p8-5g-pilote-9-devoiles.png')}"><img src="${img('p8-5g-tableau-ouvert-a-9-devoiles.png')}" style="align-self:flex-start"></body>`); await cote.waitForTimeout(200);
    await cote.screenshot({ path: capture('p8-5g-ouverture-a-9-devoiles-pilote-et-tableau.png') }); await cote.close(); }
  MES.push(`O · ouvert à ${c.nom} (${n} dévoilés) : pilote « ${pil.page} » ${pil.lignes.length} lignes · tableau « ${tab.page} » ${tab.lignes.length} lignes, police ${tab.police}, pareil en ${ms} ms, hors du cadre ${tab.hors.length}`);
  if (c.molette) { // P — puis un ▶ : toujours la même page des deux côtés
    await pg.click('#bdev'); await p(400); const a = await voir(pg, '#mur'), b = await voir(fen, '#mur2');
    ok(pareil(a, b) && !b.hors.length, `P · après un ▶ : pilote « ${a.page} » ${a.lignes.join(',')} ; tableau « ${b.page} » ${b.lignes.join(',')}`);
    MES.push(`P · puis un ▶ (${await devoile()} dévoilés) : pilote « ${a.page} », tableau « ${b.page} », mêmes lignes : ${pareil(a, b)}`);
  }
  await fen.close(); await p(300);
}

// G — le gel (garde d'un relecteur neuf) : le tableau gelé garde ce qu'il montrait ; rouvert pendant le gel, il montre la même chose, avec ses pages et son compteur
for (let i = 0; i < 3; i++) { await pg.click('#bprec'); await p(100); } await p(300);
{ const { fen, pil, tab } = await ouvrirEcran2(); const g0 = tab; ok(pareil(pil, tab), `G · avant le gel : pilote « ${pil.page} », tableau « ${tab.page} »`);
  await pg.click('#bgel'); await p(400); for (let i = 0; i < 4; i++) { await pg.click('#bdev'); await p(100); } await p(300);
  const g1 = await voir(fen, '#mur2'); ok(pareil(g0, g1), `G · gelé, le tableau ne bouge pas (« ${g0.page} » → « ${g1.page} »)`);
  await fen.close(); await p(300);
  const [fen2] = await Promise.all([pg.waitForEvent('popup'), pg.click('#bvideoproj')]); await fen2.waitForLoadState(); await fen2.setViewportSize({ width: 1280, height: 720 }); await fen2.waitForTimeout(500);
  const g2 = await voir(fen2, '#mur2'); const gp = await voir(pg, '#mur');
  ok(g0.page !== '' && pareil(g0, g2) && !g2.hors.length, `G · rouvert pendant le gel : le tableau montre ce qu'il montrait au gel (au gel « ${g0.page} » ${g0.lignes.join(',')} ; rouvert « ${g2.page} » ${g2.lignes.join(',')} ; police ${g0.police} / ${g2.police})`);
  ok(g0.police === g2.police, `G · rouvert pendant le gel : la même police (${g0.police} / ${g2.police})`);
  await fen2.screenshot({ path: capture('p8-5g-tableau-rouvert-pendant-le-gel.png') });
  await pg.click('#bgel'); await p(500); const g3 = await voir(pg, '#mur'), g4 = await voir(fen2, '#mur2');
  ok(pareil(g3, g4), `G · au dégel, le tableau rejoint le pilote (pilote « ${g3.page} », tableau « ${g4.page} »)`);
  MES.push(`G · gel à « ${g0.page} » (${g0.lignes.length} lignes) ; le pilote avance (« ${gp.page} ») ; rouvert pendant le gel : « ${g2.page} », ${g2.lignes.length} lignes, police ${g2.police} ; au dégel : pilote « ${g3.page} », tableau « ${g4.page} »`);
  await fen2.close(); await p(300); }

// R — la répétition : « 🖥 Écran 2 » ouvert en répétition sur une diapo en pages
await pg.click('[data-ong="atelier"], #ong-atelier').catch(() => {}); await p(400);
await pg.click('#volet .at-chap .d[data-at-di="0"]'); await p(300); await pg.click('#at-jouer'); await p(600);
const r0 = await voir(pg, '#mur'); const rn0 = await devoile(); ok(/^page [12] \/ 2$/.test(r0.page), `R · en répétition, la diapo 1 est en pages (« ${r0.page} », ${rn0} dévoilés)`);
// ▶ jusqu'à la page 2 de la diapo 1 (la répétition part de l'état du pilote : ce qui était déjà dévoilé l'est encore)
for (let i = 0; i < 20 && !/^page 2/.test((await voir(pg, '#mur')).page); i++) { await pg.click('#bdev'); await p(120); } await p(300);
ok(await pg.evaluate(() => S.di === 0), 'R · la répétition a quitté la diapo 1 avant sa page 2');
{ const { fen, pil, tab, ms } = await ouvrirEcran2();
  ok(/^page 2 \/ 2$/.test(pil.page) && pareil(pil, tab) && !tab.hors.length, `R · ouvert en répétition : pilote « ${pil.page} » ${pil.lignes.join(',')} ; tableau « ${tab.page} » ${tab.lignes.join(',')} (${ms} ms)`);
  MES.push(`R · ouvert en répétition (${await devoile()} dévoilés) : pilote « ${pil.page} », tableau « ${tab.page} », mêmes lignes : ${pareil(pil, tab)}, en ${ms} ms`);
  await fen.close(); }
await pg.click('#rep-stop'); await p(300);

ok(!errs.length, 'erreurs JS : ' + errs.join(' | ')); ok(!boites.length, 'boîtes système : ' + boites.join(' | '));
fs.writeFileSync(capture('MESURES-p8-5g.txt'), MES.join('\n') + '\n');
await nav.close();
console.log(MES.join('\n')); console.log(N + ' vérifications');
if (D.length) D.forEach(d => console.log('DÉFAUT : ' + d)); else console.log('aucun défaut');
console.log('--- fin : ' + D.length + ' défaut(s)');
process.exit(D.length ? 1 : 0);

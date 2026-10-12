import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve('../f/LIVRAISONS/DEROULE/p8-5f/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch();
const etat = pg => pg.evaluate(() => { const vs = Array.from(document.querySelectorAll('#volet [data-at-di], #volet .vig')); const E = seance().ecrans; return { vignettes: vs.length, diapos: E.length, di: S.di, heures: E.map(e => e.heure).join(''), derniere: E[E.length - 1] && (E[E.length - 1].act + ' h' + E[E.length - 1].heure + ' role=' + (E[E.length - 1].role || '-')), manquantes: E.map((e, i) => i).filter(i => !vs.some(v => +(v.dataset.atDi ?? v.dataset.i) === i)) }; });
const cas = [
  ['atelier · Insérer après la vignette 9 (cahier de textes de l\'heure 1)', async pg => { await pg.click('#volet [data-at-di="8"]', { button: 'right' }); await pg.waitForTimeout(300); const it = await pg.$('#menu .it:has-text("Insérer une diapo après")'); if (await it.isDisabled()) { const t = await it.getAttribute('title'); await pg.keyboard.press('Escape'); return 'désactivé (« ' + t + ' »)'; } await it.click(); }],
  ['atelier · Insérer après la dernière vignette de la séance', async pg => { const n = await pg.$$eval('#volet [data-at-di]', l => l.length); await pg.click(`#volet [data-at-di="${n - 1}"]`, { button: 'right' }); await pg.waitForTimeout(300); const it = await pg.$('#menu .it:has-text("Insérer une diapo après")'); if (it && !(await it.isDisabled())) await it.click(); else { await pg.keyboard.press('Escape'); return 'désactivé'; } }],
  ['atelier · « + bloc » → Schéma… sur la diapo 1 (p8-3 : crée la diapo suivante)', async pg => { await pg.click('#at-bloc'); await pg.waitForTimeout(300); const sch = await pg.$('text=Schéma…'); if (!sch) { await pg.keyboard.press('Escape'); return 'pas de Schéma…'; } await sch.click(); await pg.waitForTimeout(400); await pg.fill('#of-t', 'Les figures'); await pg.fill('#of-src', 'Comparaison : comme, tel\nMétaphore : sans outil'); await pg.click('#of-ok'); }],
  ['pilotage, heure lancée · ⚙ → « Insérer une diapo au milieu »', async pg => { await pg.click('#ong-pilotage'); await pg.waitForTimeout(300); await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(400); await pg.click('#bsimu'); await pg.waitForTimeout(200); await pg.click('#s-inserer'); }],
];
for (const [nom, geste] of cas) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const err = []; page.on('pageerror', e => err.push(e.message));
  await page.goto(file); await page.waitForTimeout(500); await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
  const e0 = await etat(page); const r = await geste(page); await page.waitForTimeout(800); const e1 = await etat(page);
  console.log(`${nom}\n   ${r || ''} diapos ${e0.diapos}→${e1.diapos} · vignettes ${e0.vignettes}→${e1.vignettes} · di ${e0.di}→${e1.di} · absentes du volet : [${e1.manquantes.join(',')}] · dernière : ${e1.derniere} · ${e1.diapos > e0.diapos ? (e1.manquantes.length ? 'LE VOLET NE MONTRE PAS LA NOUVELLE' : 'le volet suit') : '(rien créé)'} · erreurs ${err.length}${err.length ? ' : ' + err[0].slice(0, 100) : ''}`);
  if (e1.manquantes.length) await page.screenshot({ path: 'T55c-manquante.png' });
  await page.close();
}
await browser.close();

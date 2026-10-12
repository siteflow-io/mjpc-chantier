// Diapo 1 gardée à UN bloc : Entrée après « Étape 6 » et huit lignes ; atelier puis répétition + Écran 2
import { ouvrir, versAtelier, comparer, ouvrirEcran2, etat, pause, R2, LIGNES } from './commun.mjs';
const W = +(process.argv[2] || 1280), H = +(process.argv[3] || 800);
const { browser, ctx, page, erreurs } = await ouvrir(W, H);
await versAtelier(page);
const e6 = page.locator('#mur li', { hasText: 'Étape 6' }).first();
await e6.click(); await page.keyboard.press('End');
for (const l of LIGNES) { await page.keyboard.press('Enter'); await page.keyboard.type(l, { delay: 0 }); }
await pause(600);
const nb = await page.evaluate(() => document.querySelectorAll('#mur .corpsd .bloc').length);
const e = await etat(page);
const foc = await page.evaluate(() => { const a = document.activeElement; const r = getSelection().getRangeAt(0).getBoundingClientRect(); const m = document.querySelector('#mur').getBoundingClientRect(); return { t: a.textContent.slice(0, 20), caretTop: Math.round(r.top - m.top), caretBas: Math.round(r.bottom - m.top), murH: Math.round(m.height), hors: !!a.closest('.hors') }; });
console.log('atelier un bloc: blocs', nb, 'cpt', e.cpt, 'lignes', e.lignes.map(l => l.split(':')[0]).join(' '), 'hors', e.hors.length, 'focus', JSON.stringify(foc));
const txts = await page.$$eval('#mur .corpsd li', l => l.map(x => x.textContent));
const manque = LIGNES.filter(l => !txts.includes(l));
console.log(manque.length ? 'KO lignes manquantes/altérées: ' + JSON.stringify(manque) + '\n' + JSON.stringify(txts) : 'OK huit lignes intactes');
await page.screenshot({ path: R2 + `/s09-atelier-${W}.png` });
await page.mouse.click(600, 60); await pause(400);
await page.click('#at-jouer'); await pause(600);
let pop = await ouvrirEcran2(ctx, page);
await comparer(page, pop, 'rep ouverture 0');
for (let i = 0; i < 15; i++) { await page.click('#bdev'); await pause(150); await comparer(page, pop, `▶${i + 1}`); }
await pop.close(); pop = await ouvrirEcran2(ctx, page); await comparer(page, pop, 'réouverture');
await page.click('#rep-stop'); await pause(400);
console.log('erreurs', erreurs);
await browser.close();

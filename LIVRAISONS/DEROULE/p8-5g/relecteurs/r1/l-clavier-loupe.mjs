// clavier (→, ←, PageDown/PageUp), grille ⊞, loupe 🔍, lumière ✦ ; rouverture dans chaque état
import { demarrer, ouvrirEcran2, comparer, etatMur, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
let pop = await ouvrirEcran2(page, erreurs); await pause(500);
await page.mouse.click(600, 300); await pause(200); // focus sur la diapo
for (let i = 0; i < 8; i++) { await page.keyboard.press('ArrowRight'); await pause(150); }
await comparer(page, pop, '→ x8');
await page.keyboard.press('ArrowLeft'); await pause(300); await comparer(page, pop, '←');
await page.keyboard.press('PageDown'); await pause(400);
const g = await page.evaluate(() => document.querySelector('#garde')?.classList.contains('on')); if (g) { await page.click('#garde-devant'); await pause(400); }
await comparer(page, pop, 'PageDown (diapo 2)' + (g ? ' via garde' : ''));
await page.keyboard.press('PageUp'); await pause(400);
const g2 = await page.evaluate(() => document.querySelector('#garde')?.classList.contains('on')); if (g2) { await page.click('#garde-devant'); await pause(400); }
await comparer(page, pop, 'PageUp (retour diapo 1)' + (g2 ? ' via garde' : ''));
await pop.close(); await pause(300); pop = await ouvrirEcran2(page, erreurs); await pause(600);
await comparer(page, pop, 'rouverture après PageUp');
// grille ⊞
await page.click('#btoutes'); await pause(500);
const cases = await page.evaluate(() => Array.from(document.querySelectorAll('[data-i]')).filter(e => e.offsetParent && !e.closest('#volet')).map(e => e.className + ':' + e.dataset.i).slice(0, 12));
console.log('grille :', cases);
await page.keyboard.press('Escape'); await pause(300);
// loupe
await page.click('#bloupe'); await pause(300);
const m = await page.locator('#mur').boundingBox();
await page.mouse.move(m.x + 30, m.y + 50); await page.mouse.down(); await page.mouse.move(m.x + m.width / 2, m.y + m.height / 2, { steps: 6 }); await page.mouse.up(); await pause(600);
let t = await etatMur(pop, '#mur2'); console.log('loupe — tableau', t.compteur, t.vis.length, 'hors=', t.hors.length, ' loupe ?', await pop.evaluate(() => { const c = document.querySelector('#mur2 .corpsd'); return c && (c.style.transform || getComputedStyle(c).transform); }));
await pop.screenshot({ path: R1 + '/l-loupe.png' });
await pop.close(); await pause(300); pop = await ouvrirEcran2(page, erreurs); await pause(600);
const t2 = await etatMur(pop, '#mur2'); console.log('loupe — rouvert', t2.compteur, t2.vis.length, 'hors=', t2.hors.length, ' loupe ?', await pop.evaluate(() => { const c = document.querySelector('#mur2 .corpsd'); return c && (c.style.transform || getComputedStyle(c).transform); }));
await pop.screenshot({ path: R1 + '/l-loupe-rouv.png' });
await page.click('#bloupe'); await pause(500);
await comparer(page, pop, 'loupe retirée');
console.log('erreurs', erreurs);
await browser.close();

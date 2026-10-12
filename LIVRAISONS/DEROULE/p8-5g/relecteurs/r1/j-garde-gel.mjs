// garde « Geler, puis y aller » (Entrée) puis rouvrir Écran 2 ; touche G ; ouvertures rapides ; vue ⧉ Tableau
import { demarrer, ouvrirEcran2, comparer, etatMur, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
for (let i = 0; i < 9; i++) { await page.click('#bdev'); await pause(120); }
let pop = await ouvrirEcran2(page, erreurs); await pause(500);
const avant = await etatMur(pop, '#mur2');
console.log('tableau avant :', avant.compteur, avant.vis.length, avant.police);
// Paul saute à la diapo 4 par la vignette : garde → Entrée (Geler, puis y aller)
await page.click('#volet .vig[data-i="3"]'); await pause(300);
await page.keyboard.press('Enter'); await pause(500);
let t = await etatMur(pop, '#mur2'); console.log('gelé, Paul en diapo 4 — tableau :', t.compteur, t.vis.length, t.police);
// la fenêtre est fermée puis rouverte
await pop.close(); await pause(300);
pop = await ouvrirEcran2(page, erreurs); await pause(800);
t = await etatMur(pop, '#mur2'); console.log('rouverte pendant ce gel — tableau :', t.compteur, t.vis.length, t.police, (t.compteur === avant.compteur && t.police === avant.police) ? 'ok' : '<<< DIFFÉRENT du tableau gelé');
await pop.screenshot({ path: R1 + '/j-rouv-garde-gel.png' });
// vue ⧉ Tableau chez Paul
await page.click('#btableau'); await pause(500);
console.log('vue ⧉ Tableau chez Paul :', JSON.stringify(await page.evaluate(() => { const v = document.querySelector('.vue-tableau .page, #vdroite .page, .apercu .page'); return Array.from(document.querySelectorAll('.page')).map(p => p.textContent.trim()).filter(Boolean); })));
await page.click('#btableau'); await pause(300);
// dégel, revenir à la classe
await page.click('#bgel'); await pause(400); await page.keyboard.press('Enter'); await pause(600);
await comparer(page, pop, 'dégel (revenir à la classe)');
// touche G
await page.mouse.click(5, 300);
await page.keyboard.press('g'); await pause(300);
console.log('gel par G ?', await page.evaluate(() => !!S.gel));
await pop.close(); await pause(200);
pop = await ouvrirEcran2(page, erreurs); await pause(600);
t = await etatMur(pop, '#mur2'); console.log('rouverte après G — tableau :', t.compteur, t.vis.length, t.police);
await page.keyboard.press('g'); await pause(400);
await comparer(page, pop, 'dégel par G');
// ouvertures/fermetures rapides
for (let k = 0; k < 6; k++) {
  await pop.close(); await pause(50 + 40 * k);
  pop = await ouvrirEcran2(page, erreurs); await pause(100);
}
await pause(300);
await comparer(page, pop, 'après 6 fermetures/ouvertures rapides');
await page.click('#bdev'); await pause(300); await comparer(page, pop, '▶');
console.log('erreurs', erreurs);
await browser.close();

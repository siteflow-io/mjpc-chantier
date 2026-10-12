// ouvrir / fermer / rouvrir Écran 2 à 0, 9, 13, 9 + page 2 molette ; puis ▶ ; puis Maj+flèches
import { demarrer, ouvrirEcran2, comparer, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
const dev = async n => { for (let i = 0; i < n; i++) { await page.click('#bdev'); await pause(150); } };
const prec = async n => { for (let i = 0; i < n; i++) { await page.click('#bprec'); await pause(150); } };
async function ouvrirEtComparer(lbl) {
  const pop = await ouvrirEcran2(page, erreurs);
  await pause(150); await comparer(pop === null ? null : page, pop, lbl + ' (150 ms)');
  await pause(850); const r = await comparer(page, pop, lbl + ' (1 s)');
  return pop;
}
let pop = await ouvrirEtComparer('ouverture 0 dév');
await pop.close(); await pause(300);
await dev(9);
pop = await ouvrirEtComparer('rouverture 9 dév');
await pop.screenshot({ path: R1 + '/c-tab-9.png' });
await pop.close(); await pause(300);
await dev(4);
pop = await ouvrirEtComparer('rouverture 13 dév');
await pop.close(); await pause(300);
await prec(4);
// molette sur la diapo vers le bas -> page suivante
await page.hover('#murcadre'); await page.mouse.wheel(0, 300); await pause(400);
pop = await ouvrirEtComparer('rouverture 9 dév + page choisie molette');
await page.click('#bdev'); await pause(400); await comparer(page, pop, 'puis ▶ (10)');
await page.hover('#murcadre'); await page.mouse.wheel(0, -300); await pause(400); await comparer(page, pop, 'molette haut');
await page.keyboard.press('Shift+ArrowRight'); await pause(400); await comparer(page, pop, 'Maj+→');
await page.keyboard.press('Shift+ArrowRight'); await pause(400); await comparer(page, pop, 'Maj+→ encore');
await page.keyboard.press('Shift+ArrowLeft'); await pause(400); await comparer(page, pop, 'Maj+←');
await page.click('#bprec'); await pause(400); await comparer(page, pop, '◀');
// clic sur l'indicateur de page (‹ ›)
await page.click('#mur .page [data-p="1"]').catch(e => console.log('pas de › cliquable', e.message)); await pause(400); await comparer(page, pop, 'clic › compteur');
await page.click('#mur .page [data-p="-1"]').catch(e => console.log('pas de ‹', e.message)); await pause(400); await comparer(page, pop, 'clic ‹ compteur');
// ouvrir alors que déjà ouvert (focus)
await page.click('#bvideoproj'); await pause(400); await comparer(page, pop, 're-clic Écran 2 (déjà ouvert)');
console.log('erreurs', erreurs);
await browser.close();

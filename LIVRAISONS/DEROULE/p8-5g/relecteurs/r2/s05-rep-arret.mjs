// Répétition avec Écran 2 ouvert, 10 ▶, puis sortie : mode = arret | atelier | pilotage
import { ouvrir, versAtelier, taperHuit, comparer, ouvrirEcran2, etat, pause, R2 } from './commun.mjs';
const mode = process.argv[2] || 'arret';
const { browser, ctx, page, erreurs } = await ouvrir();
await versAtelier(page);
await taperHuit(page);
// référence : l'état de l'écran 2 avant toute répétition ? (bouton visible dans l'atelier ?)
console.log('bvideoproj visible dans atelier :', await page.locator('#bvideoproj').isVisible());
await page.click('#at-jouer'); await pause(600);
const pop = await ouvrirEcran2(ctx, page);
for (let i = 0; i < 10; i++) { await page.click('#bdev'); await pause(100); }
await pause(300);
await comparer(page, pop, 'rep 10 dévoilés');
if (mode === 'arret') await page.click('#rep-stop');
else if (mode === 'atelier') await page.click('#ong-atelier');
else if (mode === 'pilotage') await page.click('#ong-pilotage');
await pause(800);
console.log('mode', mode, '| répétition encore là ?', await page.locator('#rep-stop').isVisible(), '| haut', await page.evaluate(() => document.querySelector('.haut')?.className));
console.log('pilote', JSON.stringify(await etat(page)));
console.log('tableau', JSON.stringify(await etat(pop, '#mur2')));
await page.screenshot({ path: R2 + `/s05-pilote-${mode}.png` });
await pop.screenshot({ path: R2 + `/s05-pop-${mode}.png` });
// si on est au pilotage, regarder ce que dit le pilote
if (mode !== 'atelier') {
  await page.click('#ong-pilotage').catch(() => {}); await pause(500);
  console.log('pilotage ensuite', JSON.stringify(await etat(page)));
  console.log('tableau ensuite', JSON.stringify(await etat(pop, '#mur2')));
  await page.screenshot({ path: R2 + `/s05-pilotage-${mode}.png` });
}
console.log('erreurs', erreurs);
await browser.close();

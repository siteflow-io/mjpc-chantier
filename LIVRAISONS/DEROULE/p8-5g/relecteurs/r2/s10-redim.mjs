// Fenêtre du tableau redimensionnée (projecteur 4:3, plein écran 1920, petite fenêtre) en répétition, page 1 pleine
import { ouvrir, versAtelier, taperHuit, comparer, ouvrirEcran2, etat, pause, R2 } from './commun.mjs';
const { browser, ctx, page, erreurs } = await ouvrir(1280, 800);
await versAtelier(page);
await taperHuit(page);
await page.click('#at-jouer'); await pause(600);
const pop = await ouvrirEcran2(ctx, page);
for (let i = 0; i < 9; i++) { await page.click('#bdev'); await pause(100); }
await pause(300);
await comparer(page, pop, 'base 9');
for (const [w, h] of [[1920, 1080], [1024, 768], [800, 600], [640, 360], [1100, 900], [1600, 600]]) {
  await pop.setViewportSize({ width: w, height: h }); await pause(500);
  await comparer(page, pop, `tableau ${w}x${h}`);
  await pop.screenshot({ path: R2 + `/s10-pop-${w}x${h}.png` });
}
// et un ▶ après redimension
await page.click('#bdev'); await pause(400);
await comparer(page, pop, 'tableau 1600x600 puis ▶');
// heure lancée à 1920 de large, pilote plein
console.log('erreurs', erreurs);
await browser.close();

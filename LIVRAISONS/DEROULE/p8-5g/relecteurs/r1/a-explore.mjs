import { demarrer, ouvrirEcran2, etatMur, comparer, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
console.log(await page.evaluate(() => ({ di: S.di, n: document.querySelectorAll('#mur .corpsd li, #mur .corpsd .rep').length, cls: Array.from(document.querySelectorAll('#mur .corpsd li, #mur .corpsd .rep')).map(e => e.className).slice(0, 20), page: document.querySelector('#mur .page')?.textContent })));
await page.screenshot({ path: R1 + '/a-pilote-0.png' });
const pop = await ouvrirEcran2(page, erreurs);
await pause(800);
await comparer(page, pop, 'ouverture 0 dév');
await pop.screenshot({ path: R1 + '/a-tab-0.png' });
for (let i = 1; i <= 14; i++) {
  await page.click('#bdev'); await pause(250);
  await comparer(page, pop, '▶ x' + i);
}
await page.screenshot({ path: R1 + '/a-pilote-14.png' });
await pop.screenshot({ path: R1 + '/a-tab-14.png' });
console.log(erreurs);
await browser.close();

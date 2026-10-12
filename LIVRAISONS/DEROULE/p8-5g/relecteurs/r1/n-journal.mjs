// le journal (« ce que le tableau a montré ») ne doit rien écrire quand on rouvre Écran 2 — ni hors gel, ni pendant le gel (cadrage 1, 3.1)
import { demarrer, ouvrirEcran2, pause } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
const nJ = () => page.evaluate(() => J.length);
const derniers = (k) => page.evaluate(k => J.slice(-k).map(x => x.type + (x.p ? ' p' + x.p : '') + (x.k != null ? ' k' + x.k : '') + (x.nature ? ' ' + x.nature : '')), k);
for (let i = 0; i < 9; i++) { await page.click('#bdev'); await pause(120); }
let pop = await ouvrirEcran2(page, erreurs); await pause(500);
let a = await nJ(); await pop.close(); await pause(200); pop = await ouvrirEcran2(page, erreurs); await pause(600);
console.log('rouverture hors gel : +' + ((await nJ()) - a));
// page à la main puis rouverture
await page.hover('#murcadre'); await page.mouse.wheel(0, -300); await pause(400);
a = await nJ(); await pop.close(); await pause(200); pop = await ouvrirEcran2(page, erreurs); await pause(600);
console.log('rouverture après page à la main : +' + ((await nJ()) - a));
// gel, Paul avance, rouverture
await page.click('#bgel'); await pause(300);
for (let i = 0; i < 3; i++) { await page.click('#bdev'); await pause(150); }
a = await nJ(); await pop.close(); await pause(200); pop = await ouvrirEcran2(page, erreurs); await pause(600);
const d = (await nJ()) - a; console.log('rouverture pendant le gel : +' + d, d ? await derniers(d) : '');
// gel, Paul change de diapo, rouverture
await page.click('#volet .vig[data-i="2"]'); await pause(400);
const gd = await page.evaluate(() => document.querySelector('#garde')?.classList.contains('on')); if (gd) { await page.click('#garde-devant'); await pause(300); }
a = await nJ(); await pop.close(); await pause(200); pop = await ouvrirEcran2(page, erreurs); await pause(600);
const d2 = (await nJ()) - a; console.log('rouverture pendant le gel, Paul sur diapo 3 : +' + d2, d2 ? await derniers(d2) : '');
console.log('S.mur.di =', await page.evaluate(() => S.mur && S.mur.di), ' S.gel.di =', await page.evaluate(() => S.gel && S.gel.di));
console.log('erreurs', erreurs);
await browser.close();

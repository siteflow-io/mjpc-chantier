// DÉFAUT (variante) : page choisie à la main, ❄, Écran 2 fermé puis rouvert → lignes différentes de celles que la classe voyait
import { demarrer, ouvrirEcran2, etatMur, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
let pop = await ouvrirEcran2(page, erreurs); await pause(400);
for (const n of [9, 13, 14]) {
  let cur = await page.evaluate(() => +document.body.innerText.match(/(\d+) \/ \d+\s*dévoil/)[1]);
  while (cur < n) { await page.click('#bdev'); await pause(150); cur++; }
  await page.hover('#murcadre'); await page.mouse.wheel(0, -300); await pause(400); // page précédente, à la main
  const avant = await etatMur(pop, '#mur2');
  await page.click('#bgel'); await pause(300);
  await pop.close(); await pause(300);
  pop = await ouvrirEcran2(page, erreurs); await pause(800);
  const apres = await etatMur(pop, '#mur2');
  const memes = JSON.stringify(avant.vis) === JSON.stringify(apres.vis) && avant.compteur === apres.compteur;
  console.log(`${n} dév., page précédente à la main, ❄, rouverture : avant «${avant.compteur}» ${JSON.stringify(avant.vis.map(t => t.slice(0, 9)))} ${avant.police} | après «${apres.compteur}» ${JSON.stringify(apres.vis.map(t => t.slice(0, 9)))} ${apres.police} hors=${apres.hors.length} ${memes ? 'ok' : '<<< DIFFÉRENT'}`);
  if (!memes) await pop.screenshot({ path: `${R1}/m-gel-main-${n}.png` });
  await page.click('#bgel'); await pause(400);
  const garde = await page.evaluate(() => document.querySelector('#degel.on, .on #degel-ici'));
}
console.log('erreurs', erreurs);
await browser.close();

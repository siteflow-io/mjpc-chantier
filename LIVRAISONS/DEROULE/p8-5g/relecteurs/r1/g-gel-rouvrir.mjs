// DÉFAUT : rouvrir Écran 2 pendant le gel → le tableau ne montre pas la page / le compteur gelés
// pour chaque n dévoilés : ▶ x n, Écran 2 ouvert, ❄, fermer la fenêtre du tableau, la rouvrir, comparer à ce qu'elle montrait au gel
import { demarrer, ouvrirEcran2, etatMur, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
let n = 0;
let pop = await ouvrirEcran2(page, erreurs); await pause(500);
for (const cible of [0, 3, 7, 8, 9, 11, 13, 14]) {
  while (n < cible) { await page.click('#bdev'); await pause(150); n++; }
  await pause(300);
  const pil = await etatMur(page, '#mur');
  const avant = await etatMur(pop, '#mur2');
  await page.click('#bgel'); await pause(300);           // ❄ gel
  await pop.close(); await pause(300);                    // la fenêtre se ferme (Win+K décroche, ou Paul la ferme)
  pop = await ouvrirEcran2(page, erreurs); await pause(800); // 🖥 Écran 2
  const apres = await etatMur(pop, '#mur2');
  const memes = avant.compteur === apres.compteur && JSON.stringify(avant.vis) === JSON.stringify(apres.vis);
  console.log(`${cible} dév. — pilote «${pil.compteur}» | tableau au gel «${avant.compteur}» ${avant.vis.length} lignes ${avant.police} | rouvert gelé «${apres.compteur}» ${apres.vis.length} lignes ${apres.police} hors=${apres.hors.length} ${memes ? 'ok' : '<<< DIFFÉRENT ' + JSON.stringify(apres.vis.map(t => t.slice(0, 10)))}`);
  if (!memes) await pop.screenshot({ path: `${R1}/g-gel-${cible}.png` });
  console.log('   S.gel porte pages ?', await page.evaluate(() => S.gel && { pages: !!S.gel.pages, pagesP: !!S.gel.pagesP, ratio: S.gel.policeRatio, page: S.gel.page }));
  await page.click('#bgel'); await pause(400);            // dégel (sans écart : silencieux)
}
console.log('erreurs', erreurs);
await browser.close();

// changement de diapo par les vignettes, ouverture sur une autre diapo, gel / dégel
import { demarrer, ouvrirEcran2, comparer, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
const dev = async n => { for (let i = 0; i < n; i++) { await page.click('#bdev'); await pause(150); } };
const garde = async (rep) => { await pause(250); const on = await page.evaluate(() => document.querySelector('#garde')?.classList.contains('on')); if (on) { console.log('   (garde ouverte, réponse ' + rep + ')'); await page.click('#' + rep); await pause(400); } return on; };
const titreTab = pop => pop.evaluate(() => document.querySelector('#mur2 .act')?.textContent.trim().slice(0, 40));
const titrePil = () => page.evaluate(() => document.querySelector('#mur .act')?.textContent.trim().slice(0, 40));
const cmp = async (pop, l) => { const r = await comparer(page, pop, l); const a = await titrePil(), b = await titreTab(pop); if (a !== b) console.log('   <<< TITRE pilote=' + a + ' tableau=' + b); return r; };

await dev(9);
// aller à la diapo 3 par vignette, ouvrir Écran 2 là
await page.click('#volet .vig[data-i="2"]'); await garde('garde-devant');
let pop = await ouvrirEcran2(page, erreurs); await pause(600);
await cmp(pop, 'ouverture sur diapo 3');
// revenir à la diapo 1 par vignette, devant la classe
await page.click('#volet .vig[data-i="0"]'); await garde('garde-devant'); await pause(400);
await cmp(pop, 'vignette → diapo 1 (devant la classe)');
await pop.screenshot({ path: R1 + '/f-retour-d1.png' });
// fermer, rouvrir sur diapo 1 (retour)
await pop.close(); await pause(300);
pop = await ouvrirEcran2(page, erreurs); await pause(600);
await cmp(pop, 'rouverture sur diapo 1 après retour');
// gel par ❄ puis ▶▶ chez Paul : le tableau ne doit pas bouger
const avant = await comparer(page, pop, 'avant gel');
await page.click('#bgel'); await pause(300);
await dev(4);
let r = await comparer(page, pop, 'gelé, après 4 ▶ (tableau doit rester)');
console.log('   tableau inchangé ?', JSON.stringify(avant.b.vis) === JSON.stringify(r.b.vis) && avant.b.compteur === r.b.compteur);
// rouvrir pendant le gel
await pop.close(); await pause(300);
pop = await ouvrirEcran2(page, erreurs); await pause(600);
r = await comparer(page, pop, 'rouverture pendant le gel');
console.log('   tableau = état gelé ?', JSON.stringify(avant.b.vis) === JSON.stringify(r.b.vis) && avant.b.compteur === r.b.compteur, avant.b.compteur, r.b.compteur, r.b.vis.length);
await pop.screenshot({ path: R1 + '/f-rouv-gel.png' });
// molette pendant le gel
await page.hover('#murcadre'); await page.mouse.wheel(0, 300); await pause(400);
r = await comparer(page, pop, 'gelé, molette');
// dégel
await page.click('#bgel'); await pause(300); await garde('garde-devant');
await pause(400);
await comparer(page, pop, 'dégel');
await page.click('#bdev'); await pause(300); await comparer(page, pop, '▶ après dégel');
// gel puis changer de diapo chez Paul, ouvrir écran 2, dégel
await page.click('#bgel'); await pause(300);
await page.click('#volet .vig[data-i="1"]'); await garde('garde-devant'); await pause(300);
await pop.close(); await pause(300);
pop = await ouvrirEcran2(page, erreurs); await pause(600);
console.log('   gelé sur d1, Paul sur d2, tableau rouvert : titre tableau =', await titreTab(pop), ' compteur:', (await comparer(page, pop, 'rouvert gelé d1 / Paul d2')).b.compteur);
await page.click('#bgel'); await pause(400);
const g = await page.evaluate(() => document.querySelector('#degel, .garde.on, #garde.on')?.innerText?.slice(0, 200));
console.log('   garde au dégel:', g);
await page.keyboard.press('Enter'); await pause(600);
await cmp(pop, 'dégel → revenir là où est la classe (Entrée)');
console.log('erreurs', erreurs);
await browser.close();

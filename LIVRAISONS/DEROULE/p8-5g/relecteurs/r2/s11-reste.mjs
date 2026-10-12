// Après l'arrêt de la répétition, que reste-t-il ? variantes : ferme | gel | page | diapo
import { ouvrir, versAtelier, taperHuit, comparer, ouvrirEcran2, etat, pause, R2 } from './commun.mjs';
const v = process.argv[2] || 'ferme';
const { browser, ctx, page, erreurs } = await ouvrir();
await versAtelier(page);
await taperHuit(page);
await page.click('#at-jouer'); await pause(600);
let pop = await ouvrirEcran2(ctx, page);
for (let i = 0; i < 10; i++) { await page.click('#bdev'); await pause(100); }
await pause(300);
if (v === 'gel') { await page.click('#bgel'); await pause(400); for (let i = 0; i < 2; i++) { await page.click('#bdev'); await pause(150); } }
if (v === 'page') { await page.keyboard.press('Shift+ArrowLeft'); await pause(400); }
if (v === 'diapo') { for (let i = 0; i < 6; i++) { await page.click('#bdev'); await pause(150); } }
await comparer(page, pop, 'en répétition (' + v + ')');
await pop.close(); await pause(200);
await page.click('#rep-stop'); await pause(600);
console.log('atelier après arrêt :', await page.evaluate(() => document.body.innerText.match(/Atelier · Diapo \d+ sur \d+[^\n]{0,60}/)?.[0]));
console.log('après arrêt : onglet', await page.evaluate(() => document.querySelector('.on[id^=ong-], [id^=ong-].on, [id^=ong-][aria-selected=true]')?.id), JSON.stringify((await etat(page)).cpt));
await page.click('#ong-pilotage'); await pause(600);
const ep = await etat(page);
console.log('pilotage sans heure :', ep.cpt, 'dévoilés', ep.lignes.filter(l => !/pas/.test(l.split(':')[1])).length, 'titre', await page.evaluate(() => document.querySelector('#dtitre')?.textContent.slice(0, 60)));
console.log('bvideoproj visible sans heure ?', await page.locator('#bvideoproj').isVisible());
await page.click('[data-lancer="1"]'); await pause(800);
const el = await etat(page);
console.log('heure lancée :', el.cpt, 'dévoilés', el.lignes.filter(l => !/pas/.test(l.split(':')[1])).length, 'titre', await page.evaluate(() => document.querySelector('#dtitre')?.textContent.slice(0, 60)), 'gel?', await page.evaluate(() => document.querySelector('#bgel')?.className));
pop = await ouvrirEcran2(ctx, page);
await comparer(page, pop, 'Écran 2 rouvert heure lancée');
await pop.screenshot({ path: R2 + `/s11-${v}-pop-heure.png` });
await page.screenshot({ path: R2 + `/s11-${v}-pilote-heure.png` });
console.log('erreurs', erreurs);
await browser.close();

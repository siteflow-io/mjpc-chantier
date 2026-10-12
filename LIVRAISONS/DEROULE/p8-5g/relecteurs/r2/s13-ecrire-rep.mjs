// Écrire dans la diapo pendant la répétition, fenêtre du tableau ouverte ; puis arrêt : le texte tapé doit être oublié
import { ouvrir, versAtelier, taperHuit, comparer, ouvrirEcran2, etat, pause, R2 } from './commun.mjs';
const { browser, ctx, page, erreurs } = await ouvrir();
await versAtelier(page);
await taperHuit(page);
await page.click('#at-jouer'); await pause(600);
const pop = await ouvrirEcran2(ctx, page);
for (let i = 0; i < 9; i++) { await page.click('#bdev'); await pause(100); }
await pause(300);
await comparer(page, pop, 'rep 9');
console.log('zone écrire en rep ?', await page.locator('#mur .p8-ecrire').count(), '| li éditables', await page.$$eval('#mur li', l => l.filter(x => x.isContentEditable).length));
// cliquer à la fin de « Troisième » (dernier dévoilé, page 1) et taper long
const tr = page.locator('#mur li', { hasText: 'Troisième longue ligne' }).first();
await tr.click(); await page.keyboard.press('End');
const ajout = ' REPET texte tapé pendant la répétition qui s allonge assez pour passer à la ligne plusieurs fois et pousser la ligne sur la page suivante peut être';
await page.keyboard.type(ajout, { delay: 0 }); await pause(800);
const foc = await page.evaluate(() => ({ t: document.activeElement.textContent.slice(-30), tag: document.activeElement.tagName }));
console.log('focus', JSON.stringify(foc));
await comparer(page, pop, 'pendant frappe en rep');
console.log('tableau contient REPET ?', await pop.evaluate(() => document.querySelector('#mur2').textContent.includes('REPET')));
await page.mouse.click(600, 60); await pause(500);
await comparer(page, pop, 'après frappe, clic hors');
console.log('tableau contient REPET ?', await pop.evaluate(() => document.querySelector('#mur2').textContent.includes('REPET')));
await pop.screenshot({ path: R2 + '/s13-pop-frappe.png' }); await page.screenshot({ path: R2 + '/s13-pilote-frappe.png' });
await page.click('#rep-stop'); await pause(800);
console.log('atelier après arrêt contient REPET ?', await page.evaluate(() => document.querySelector('#mur').textContent.includes('REPET')));
console.log('tableau après arrêt contient REPET ?', await pop.evaluate(() => document.querySelector('#mur2').textContent.includes('REPET')));
await page.click('#ong-pilotage'); await pause(500);
console.log('pilotage après arrêt contient REPET ?', await page.evaluate(() => document.querySelector('#mur').textContent.includes('REPET')));
console.log('erreurs', erreurs);
await browser.close();

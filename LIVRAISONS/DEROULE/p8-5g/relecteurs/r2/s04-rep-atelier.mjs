// Écran 2 ouvert en répétition, puis passer à l'atelier, écrire ; puis arrêter
import { ouvrir, versAtelier, taperHuit, comparer, ouvrirEcran2, etat, pause, R2 } from './commun.mjs';
const { browser, ctx, page, erreurs } = await ouvrir();
await versAtelier(page);
await taperHuit(page);
await page.click('#at-jouer'); await pause(600);
const pop = await ouvrirEcran2(ctx, page);
for (let i = 0; i < 10; i++) { await page.click('#bdev'); await pause(100); }
await pause(300);
await comparer(page, pop, 'rep 10 dévoilés');
const ong = await page.$$eval('.ong, [id^=ong-], nav button, header button', l => l.map(e => (e.id || e.className) + '=' + e.textContent.trim().slice(0, 20)));
console.log('onglets', ong);
// est-ce qu'on peut écrire en répétition ?
console.log('ecrire en rep ?', await page.$$eval('#mur [contenteditable]', l => l.length));
// passer à l'atelier
await page.getByText('Atelier', { exact: true }).first().click(); await pause(600);
await page.screenshot({ path: R2 + '/s04-atelier-apres-rep.png' });
console.log('haut classes', await page.evaluate(() => document.querySelector('.haut')?.className), 'rep-stop visible?', await page.locator('#rep-stop').isVisible().catch(() => 'absent'));
console.log('pilote atelier', JSON.stringify(await etat(page)));
console.log('tableau', JSON.stringify(await etat(pop, '#mur2')));
await pop.screenshot({ path: R2 + '/s04-pop-apres-atelier.png' });
// écrire dans l'atelier
const ec = await page.$('#mur .p8-ecrire');
if (ec) {
  await ec.click(); await pause(200);
  await page.keyboard.type('Neuvième ligne tapée pendant que le tableau est ouvert', { delay: 5 });
  await pause(500);
  console.log('pendant frappe atelier', JSON.stringify(await etat(page)));
  console.log('tableau pendant frappe', JSON.stringify(await etat(pop, '#mur2')));
  console.log('focus', await page.evaluate(() => { const a = document.activeElement; return a.tagName + '.' + a.className + ' ' + a.textContent.slice(0, 60); }));
  await page.keyboard.press('Escape'); await pause(400);
}
await pop.screenshot({ path: R2 + '/s04-pop-apres-frappe.png' });
console.log('erreurs', erreurs);
await browser.close();

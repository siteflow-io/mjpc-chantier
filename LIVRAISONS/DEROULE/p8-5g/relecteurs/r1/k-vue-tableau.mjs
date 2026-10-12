// la vue « ⧉ Tableau » de la colonne de droite, comparée à la fenêtre du tableau, hors gel et pendant le gel
import { demarrer, ouvrirEcran2, etatMur, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
for (let i = 0; i < 9; i++) { await page.click('#bdev'); await pause(120); }
const pop = await ouvrirEcran2(page, erreurs); await pause(500);
await page.click('#btableau'); await pause(500);
const vue = () => page.evaluate(() => { const m = Array.from(document.querySelectorAll('.mur')).filter(x => x.id !== 'mur' && x.offsetParent && x.closest('#droite, .droite, aside, #vsuiv, .suiv') ); return m.map(x => ({ id: x.id, cls: x.className, lignes: Array.from(x.querySelectorAll('.corpsd li, .corpsd .rep')).filter(l => !l.classList.contains('hors') && getComputedStyle(l).display !== 'none' && l.offsetHeight).map(l => l.textContent.trim().slice(0, 12)), page: x.querySelector('.page')?.textContent })); });
console.log('vue ⧉ hors gel :', JSON.stringify(await vue()));
await page.screenshot({ path: R1 + '/k-vue-hors-gel.png' });
await page.click('#bgel'); await pause(300);
for (let i = 0; i < 3; i++) { await page.click('#bdev'); await pause(150); }
console.log('vue ⧉ gelé +3▶ :', JSON.stringify(await vue()));
console.log('fenêtre :', JSON.stringify((await etatMur(pop, '#mur2')).vis.map(t=>t.slice(0,12))), (await etatMur(pop, '#mur2')).compteur);
await page.screenshot({ path: R1 + '/k-vue-gel.png' });
await browser.close();

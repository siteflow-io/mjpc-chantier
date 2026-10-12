// Atelier : huit lignes, Échap, puis Maj+← : la page change-t-elle ?
import { ouvrir, versAtelier, taperHuit, etat, pause } from './commun.mjs';
const { browser, page } = await ouvrir();
await versAtelier(page);
await taperHuit(page); // finit par Échap
const f = () => page.evaluate(() => ({ focus: document.activeElement.tagName + ' ' + document.activeElement.textContent.slice(0, 20), sel: String(getSelection()) }));
console.log('après Échap', (await etat(page)).cpt, JSON.stringify(await f()));
await page.keyboard.press('Shift+ArrowLeft'); await pause(400);
console.log('Maj+←', (await etat(page)).cpt, JSON.stringify(await f()));
await page.keyboard.press('Escape'); await pause(200);
await page.keyboard.press('Shift+ArrowLeft'); await pause(400);
console.log('Échap encore + Maj+←', (await etat(page)).cpt, JSON.stringify(await f()));
await browser.close();

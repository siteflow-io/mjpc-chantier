// Paragraphe sans Entrée plus haut que la diapo, dans l'atelier : où est le curseur pendant la frappe ?
import { ouvrir, versAtelier, pause, R2 } from './commun.mjs';
const { browser, page, erreurs } = await ouvrir();
await versAtelier(page);
await page.click('#mur .p8-ecrire'); await pause(200);
for (let i = 1; i <= 24; i++) {
  await page.keyboard.type(`phrase ${i} d un paragraphe immense que Paul tape sans jamais appuyer sur Entrée `, { delay: 0 });
  if (i % 4 === 0) {
    const r = await page.evaluate(() => { const c = getSelection().getRangeAt(0).getBoundingClientRect(); const m = document.querySelector('#mur').getBoundingClientRect(); const z = document.querySelector('#mur .p8-ecrire')?.getBoundingClientRect(); return { caretBas: Math.round(c.bottom - m.top), murH: Math.round(m.height), visible: c.bottom <= m.bottom, zoneEcrireTop: z ? Math.round(z.top - m.top) : null }; });
    console.log(`après ${i} phrases :`, JSON.stringify(r));
  }
}
await page.screenshot({ path: R2 + '/s14-curseur.png' });
await browser.close();

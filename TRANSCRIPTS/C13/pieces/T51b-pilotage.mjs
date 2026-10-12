import { chromium } from 'playwright'; import path from 'path';
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('file://' + path.resolve('../../wt-p8-5e/LIVRAISONS/DEROULE/p8-5e/maquette-pilotage-ordi-v9c15p8-manipulable.html')); await page.waitForTimeout(500);
await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
await page.click('#mur .p8-ecrire'); await page.waitForTimeout(200);
for (let i = 1; i <= 8; i++) { await page.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 5 }); if (i < 8) await page.keyboard.press('Enter'); }
await page.keyboard.press('Escape'); await page.waitForTimeout(3600);
const m = pg => pg.evaluate(() => { const mur = document.getElementById('mur').getBoundingClientRect(); const c = document.querySelector('#mur .corpsd'); const els = Array.from(c.querySelectorAll('[data-p]')).filter(e => e.getBoundingClientRect().height > 0); const vis = els.filter(e => { const b = e.getBoundingClientRect(); return b.top >= mur.top - 1 && b.bottom <= mur.bottom + 1; }); return { police: getComputedStyle(c).fontSize, deborde: c.scrollHeight > c.clientHeight + 2, page: (document.querySelector('#mur .page') || {}).textContent || '', pages: (S.pagesCourantes || []).length, elementsRendus: els.length, dansLeCadre: vis.length, premierTop: Math.round(els[0].getBoundingClientRect().top - mur.top), compte: document.getElementById('compte').textContent }; });
// le texte « À régler » complet
const regler = await page.evaluate(() => alertesForme().filter(a => a.k === 'pleine').map(a => a.l + ' — ' + a.faire));
console.log('À régler (atelier), la ligne « pleine » :', regler);
await page.click('#ong-pilotage'); await page.waitForTimeout(300); await page.click('[data-lancer="1"]'); await page.waitForTimeout(500);
console.log('pilotage, diapo 1 trop pleine, 0 dévoilé :', await m(page));
for (let i = 0; i < 14; i++) { await page.click('#bdev'); await page.waitForTimeout(100); }
console.log('après 14 ▶ :', await m(page));
await page.screenshot({ path: 'T51b-pilotage.png' });
await browser.close();

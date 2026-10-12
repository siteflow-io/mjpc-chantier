import { chromium } from 'playwright'; import path from 'path';
const maq = { 'p8-5 (07/10)': '../LIVRAISONS/DEROULE/p8-5/', 'p8-5e': '../../wt-p8-5e/LIVRAISONS/DEROULE/p8-5e/' };
const browser = await chromium.launch();
const mesure = pg => pg.evaluate(() => { const mur = document.getElementById('mur').getBoundingClientRect(); const c = document.querySelector('#mur .corpsd'); const cb = c.getBoundingClientRect(); const els = Array.from(c.querySelectorAll('[data-p]')); const first = els[0] ? els[0].getBoundingClientRect() : null; const last = els[els.length - 1] ? els[els.length - 1].getBoundingClientRect() : null; return { police: getComputedStyle(c).fontSize, deborde: c.scrollHeight > c.clientHeight + 2, scrollH: c.scrollHeight, clientH: c.clientHeight, corpsTop: Math.round(cb.top - mur.top), premierTop: first ? Math.round(first.top - mur.top) : null, dernierBas: last ? Math.round(last.bottom - mur.top) : null, murH: Math.round(mur.height), page: (document.querySelector('#mur .page') || {}).textContent || '', pages: (S.pagesCourantes || []).length, aRegler: (document.getElementById('at-regler') || document.querySelector('[id*="regler"]') || {}).textContent || '', focus: document.activeElement ? document.activeElement.tagName + '.' + document.activeElement.className : '-' }; });
for (const [v, dir] of Object.entries(maq)) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('file://' + path.resolve(dir + 'maquette-pilotage-ordi-v9c15p8-manipulable.html')); await page.waitForTimeout(500);
  await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) { await page.click('#at-aide .x'); }
  console.log('=====', v, '· diapo 1, avant :', await mesure(page));
  // écrire sous le dernier bloc : « clique ici et écris »
  const zone = await page.$('#mur .ajout, #mur [data-ajout], #mur .p8-ecrire, #mur .ecrire-ici');
  const cible = zone || await page.$('text=clique ici et écris');
  await cible.click(); await page.waitForTimeout(200);
  for (let i = 1; i <= 8; i++) { await page.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 5 }); if (i < 8) await page.keyboard.press('Enter'); await page.waitForTimeout(80); }
  await page.waitForTimeout(300);
  console.log('pendant la frappe (8 lignes) :', await mesure(page));
  await page.screenshot({ path: `T51-${v.slice(0, 5).replace(/[^a-z0-9]/gi, '')}-pendant.png` });
  await page.keyboard.press('Escape'); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await page.waitForTimeout(3600);
  console.log('après avoir quitté le champ (3,6 s) :', await mesure(page));
  await page.screenshot({ path: `T51-${v.slice(0, 5).replace(/[^a-z0-9]/gi, '')}-apres.png` });
  await page.close();
}
await browser.close();

import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve('../f/LIVRAISONS/DEROULE/p8-5f/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch();
const lireT = fen => fen.evaluate(() => { const mur = document.querySelector('.mur'); const mb = mur.getBoundingClientRect(); const c = document.querySelector('.corpsd'); const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0'); const hors = els.filter(e => { const b = e.getBoundingClientRect(); return b.top < mb.top - 1 || b.bottom > mb.bottom + 1; }); return { page: (document.querySelector('.page') || {}).textContent || '', lignes: els.length, hors: hors.length, police: getComputedStyle(c).fontSize, scrollH: c.scrollHeight, clientH: c.clientHeight }; });
for (const nDev of [0, 9, 13, 14]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(file); await page.waitForTimeout(500);
  await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
  await page.click('#mur .p8-ecrire'); for (let i = 1; i <= 8; i++) { await page.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 2 }); if (i < 8) await page.keyboard.press('Enter'); }
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.click('#ong-pilotage'); await page.waitForTimeout(300); await page.click('[data-lancer="1"]'); await page.waitForTimeout(500);
  for (let i = 0; i < nDev; i++) { await page.click('#bdev'); await page.waitForTimeout(60); }
  await page.waitForTimeout(300);
  const pil = await page.evaluate(() => document.querySelector('#mur .page').textContent);
  const [fen] = await Promise.all([page.waitForEvent('popup'), page.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.waitForTimeout(1200);
  const t0 = await lireT(fen);
  await page.click('#bdev'); await page.waitForTimeout(400); const t1 = await lireT(fen);
  console.log(`ouverture à ${nDev} dévoilés — pilote ${pil} · tableau à l'ouverture : ${JSON.stringify(t0)} · après un ▶ : ${JSON.stringify(t1)}`);
  if (nDev === 13) await fen.screenshot({ path: 'T54c-tableau-ouverture-13.png' });
  await fen.close(); await page.close();
}
await browser.close();

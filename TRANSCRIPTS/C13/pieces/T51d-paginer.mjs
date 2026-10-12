import { chromium } from 'playwright'; import path from 'path';
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('file://' + path.resolve('../../wt-p8-5e/LIVRAISONS/DEROULE/p8-5e/maquette-pilotage-ordi-v9c15p8-manipulable.html')); await page.waitForTimeout(500);
await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
await page.click('#mur .p8-ecrire'); await page.waitForTimeout(100);
for (let i = 1; i <= 8; i++) { await page.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 3 }); if (i < 8) await page.keyboard.press('Enter'); }
await page.keyboard.press('Escape'); await page.waitForTimeout(3600);
await page.click('#ong-pilotage'); await page.waitForTimeout(300); await page.click('[data-lancer="1"]'); await page.waitForTimeout(500);
console.log(await page.evaluate(() => {
  const mur = document.getElementById('mur'); const corps = mur.querySelector('.corpsd');
  const H = corps.clientHeight; const els = Array.from(corps.querySelectorAll('li, .rep')); const base = corps.querySelector('.act') ? corps.querySelector('.act').offsetHeight + 8 : 0; const top0 = els.length ? els[0].offsetTop : 0;
  const bas = els.map(l => l.offsetTop + l.offsetHeight - top0);
  return { H, scrollH: corps.scrollHeight, base, top0, nEls: els.length, bas, hors: corps.querySelectorAll('.hors').length, pagesS: S.pagesCourantes, pageTxt: mur.querySelector('.page').textContent, fontSize: corps.style.fontSize, corpsStyle: corps.getAttribute('style'), corpsDisplay: getComputedStyle(corps).display, corpsOverflow: getComputedStyle(corps).overflow, justify: getComputedStyle(corps).justifyContent };
}));
await browser.close();

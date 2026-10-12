import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve('../f/LIVRAISONS/DEROULE/p8-5f/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(file); await page.waitForTimeout(500); await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
await page.click('#mur .p8-ecrire'); for (let i = 1; i <= 8; i++) { await page.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 2 }); if (i < 8) await page.keyboard.press('Enter'); }
await page.keyboard.press('Escape'); await page.waitForTimeout(600);
const v = await page.evaluate(() => { const vig = document.querySelector('#volet [data-at-di="0"]'); const mini = vig.querySelector('.mur') || vig; const c = mini.querySelector('.corpsd'); const lis = c ? Array.from(c.querySelectorAll('li')) : []; const vb = vig.getBoundingClientRect(); return { vignetteH: Math.round(vb.height), police: c ? getComputedStyle(c).fontSize : '-', lignesRendues: lis.length, lignesHors: lis.filter(l => l.classList.contains('hors')).length, deborde: c ? c.scrollHeight > c.clientHeight + 2 : null, compteurPage: (mini.querySelector('.page') || {}).textContent || '', nbVignettesDiapo1: document.querySelectorAll('#volet [data-at-di="0"]').length, pagesAuMur: (document.querySelector('#mur .page') || {}).textContent }; });
console.log('vignette de la diapo 1 dans la colonne, après 8 lignes :', v);
await page.click('#ong-pilotage'); await page.waitForTimeout(300); await page.click('[data-lancer="1"]'); await page.waitForTimeout(500);
const p = await page.evaluate(() => { const vig = document.querySelector('#volet .vig[data-i="0"]'); const mini = vig.querySelector('.mur'); const c = mini.querySelector('.corpsd'); const lis = Array.from(c.querySelectorAll('li')); return { police: getComputedStyle(c).fontSize, lignesRendues: lis.length, lignesHors: lis.filter(l => l.classList.contains('hors')).length, compteurPage: (mini.querySelector('.page') || {}).textContent || '', nbVignettesDiapo1: document.querySelectorAll('#volet .vig[data-i="0"]').length, pagesAuMur: document.querySelector('#mur .page').textContent }; });
console.log('en classe, la même vignette :', p);
await page.screenshot({ path: 'T56-vignette.png', clip: { x: 0, y: 40, width: 200, height: 220 } });
await browser.close();

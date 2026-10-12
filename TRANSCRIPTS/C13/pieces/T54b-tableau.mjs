import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve('../f/LIVRAISONS/DEROULE/p8-5f/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(file); await page.waitForTimeout(500);
await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
await page.click('#mur .p8-ecrire'); for (let i = 1; i <= 8; i++) { await page.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 3 }); if (i < 8) await page.keyboard.press('Enter'); }
await page.keyboard.press('Escape'); await page.waitForTimeout(400);
await page.click('#ong-pilotage'); await page.waitForTimeout(300); await page.click('[data-lancer="1"]'); await page.waitForTimeout(500);
const lireT = fen => fen.evaluate(() => { const c = document.querySelector('.corpsd'); const vis = c ? Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors')).map(l => l.textContent.slice(0, 14)) : []; return { page: (document.querySelector('.page') || {}).textContent || '', visibles: vis.length, premiere: vis[0], derniere: vis[vis.length - 1] }; });
const lireP = () => page.evaluate(() => ({ page: document.querySelector('#mur .page').textContent, nDev: etatDiapo().nDev, pageS: S.page, manuelle: !!S.pageManuelle }));
const [fen] = await Promise.all([page.waitForEvent('popup'), page.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.waitForTimeout(800);
console.log('ouverture, 0 dévoilé — pilote :', await lireP(), '· tableau :', await lireT(fen));
for (let i = 0; i < 10; i++) { await page.click('#bdev'); await page.waitForTimeout(80); }
await page.waitForTimeout(500); console.log('après 10 ▶ — pilote :', await lireP(), '· tableau :', await lireT(fen));
for (let i = 0; i < 3; i++) { await page.click('#bprec'); await page.waitForTimeout(80); }
await page.waitForTimeout(500); console.log('après 3 ◀ (7 dévoilés) — pilote :', await lireP(), '· tableau :', await lireT(fen));
const mr = await page.$eval('#mur', m => { const r = m.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
await page.mouse.move(mr.x, mr.y); await page.mouse.wheel(0, 300); await page.waitForTimeout(600); console.log('après molette (page manuelle) — pilote :', await lireP(), '· tableau :', await lireT(fen));
await page.mouse.wheel(0, -300); await page.waitForTimeout(600); console.log('après molette retour — pilote :', await lireP(), '· tableau :', await lireT(fen));
await fen.close(); await browser.close();

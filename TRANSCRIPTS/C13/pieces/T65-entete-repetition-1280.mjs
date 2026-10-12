import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve(process.argv[2]);
const nav = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage();
await page.goto(file); await page.waitForTimeout(600); await page.click('[data-lancer="1"]'); await page.waitForTimeout(500);
await page.click('#ong-atelier'); await page.waitForTimeout(300); if (await page.$('#at-aide .x')) { await page.click('#at-aide .x'); await page.waitForTimeout(200); }
await page.$$eval('body *', l => l.filter(x => getComputedStyle(x).position === 'fixed').length);
await page.click('#at-jouer'); await page.waitForTimeout(400);
const mesure = () => page.evaluate(() => { const h = document.querySelector('.haut'); const hb = h.getBoundingClientRect(); const enfants = Array.from(h.querySelectorAll('*')).filter(e => e.getBoundingClientRect().width > 0).map(e => ({ t: (e.textContent || '').trim().slice(0, 16), r: Math.round(e.getBoundingClientRect().right), cls: e.className })).filter(e => e.r > hb.right); return { scrollW: h.scrollWidth, clientW: h.clientWidth, right: Math.round(hb.right), depasse: enfants.slice(0, 6) }; });
for (let i = 0; i < 4; i++) { console.log(i * 300 + ' ms :', JSON.stringify(await mesure())); await page.waitForTimeout(300); }
await page.screenshot({ path: 'T67-haut2.png', clip: { x: 0, y: 0, width: 1280, height: 60 } });
await nav.close();

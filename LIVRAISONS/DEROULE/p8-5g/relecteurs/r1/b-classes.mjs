import { demarrer, pause } from './commun.mjs';
const { browser, page } = await demarrer();
for (let i = 0; i < 3; i++) { await page.click('#bdev'); await pause(200); }
console.log(await page.evaluate(() => Array.from(document.querySelectorAll('#mur .corpsd li, #mur .corpsd .rep')).map(e => e.className + ' op=' + getComputedStyle(e).opacity)));
console.log(await page.evaluate(() => document.body.innerText.match(/\d+ \/ \d+\s*dévoil\S*/)?.[0]));
await browser.close();

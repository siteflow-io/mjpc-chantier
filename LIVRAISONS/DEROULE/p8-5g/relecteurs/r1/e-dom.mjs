import { demarrer, pause } from './commun.mjs';
const { browser, page } = await demarrer();
console.log(await page.evaluate(() => document.querySelector('#volet').innerHTML.slice(0, 1500)));
console.log(await page.evaluate(() => Array.from(document.querySelectorAll('button')).filter(b=>b.offsetParent).map(b => (b.id||'')+':'+b.textContent.trim().slice(0,20)).join(' | ')));
await browser.close();

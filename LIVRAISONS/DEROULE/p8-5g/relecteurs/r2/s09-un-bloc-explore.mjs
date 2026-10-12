import { ouvrir, pause } from './commun.mjs';
const { browser, page } = await ouvrir();
console.log(await page.evaluate(() => DATA.seances[S.si].ecrans.map((e, i) => i + 1 + ' ' + (e.type || '') + ' blocs=' + (e.blocs || []).length + ' ' + (e.blocs || []).map(b => (b.type || b.t || '?') + ':' + (b.el || []).length).join(',') + ' | ' + (e.titre || e.act || '').slice(0, 30)).join('\n')));
await browser.close();

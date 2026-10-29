import { createRequire } from 'node:module'; const req = createRequire(import.meta.url);
let pw; for (const c of ['/opt/node22/lib/node_modules/playwright','playwright']) { try { pw = req(c); break; } catch (e) {} }
const d = process.argv[2]; const b = await pw.chromium.launch(); const pg = await b.newPage();
await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await pg.goto('file://' + d + '/local.html');
const svg = await pg.evaluate(() => window.__feuilleSVG(true));
await pg.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>@page{size:210mm 297mm;margin:0}html,body{margin:0;padding:0}svg{display:block}</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297">${svg}</svg></body></html>`);
await pg.pdf({ path: d + '/feuille-reperes.pdf', width: '210mm', height: '297mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await b.close(); console.log('pdf ok');

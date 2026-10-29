import { createRequire } from 'node:module'; const req = createRequire(import.meta.url);
let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const D = process.argv[2]; const b = await pw.chromium.launch(); const pg = await b.newPage();
await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await pg.goto('file://' + D + '/local.html');
await pg.setInputFiles('#fScan', D + '/main-reference.jpg'); await pg.waitForFunction(() => window.__reperes.scan);
const sans = [], avec = [];
for (let i = 0; i < 3; i++) {   // la même photo, sans puis avec référence : la différence est la comparaison
  await pg.evaluate(() => { window.__reperes.photo = null; });
  const t0 = Date.now(); await pg.setInputFiles('#fPhoto', D + '/main-photo.jpg'); await pg.waitForFunction(() => window.__reperes.photo, null, { timeout: 60000 }); avec.push(Date.now() - t0);
}
await pg.goto('file://' + D + '/local.html');
for (let i = 0; i < 3; i++) {
  await pg.evaluate(() => { window.__reperes.photo = null; });
  const t0 = Date.now(); await pg.setInputFiles('#fPhoto', D + '/main-photo.jpg'); await pg.waitForFunction(() => window.__reperes.photo, null, { timeout: 60000 }); sans.push(Date.now() - t0);
}
const med = a => a.sort((x, y) => x - y)[1];
console.log('photo seule', med(sans), 'ms ; photo + comparaison', med(avec), 'ms ; comparaison ≈', med(avec) - med(sans) - 30, 'ms'); await b.close();

import { createRequire } from 'node:module'; import path from 'node:path'; const req = createRequire(import.meta.url); let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const D = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const b = await pw.chromium.launch(); const pg = await (await b.newContext({ viewport: { width: 1536, height: 864 } })).newPage();
await pg.goto('file://' + path.join(D, 'T399-maquette-redaction-scans-v6.html')); await pg.waitForTimeout(1500); await pg.getByText('Rédaction 1', { exact: false }).first().click(); await pg.waitForTimeout(1800);
const cerne = sel => pg.evaluate(s => { const e = document.querySelector(s); e.style.outline = '4px solid #e0217a'; e.style.outlineOffset = '3px'; }, sel);
await cerne('#btnScan'); await pg.screenshot({ path: path.join(D, 'banc/captures/20-ou-1-corriger-sur-les-scans.png') });
await pg.click('#btnScan'); await pg.waitForTimeout(800); await cerne('#scanEcran label.sc-btn'); await pg.screenshot({ path: path.join(D, 'banc/captures/20-ou-2-charger-le-paquet.png') }); await b.close();

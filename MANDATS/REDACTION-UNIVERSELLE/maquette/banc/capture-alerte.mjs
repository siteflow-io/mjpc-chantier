// 1451 : l'alerte des lignes, construite : arrivée sur une copie, Entrée sans lignes tapées
import { createRequire } from 'node:module'; import path from 'node:path';
const req = createRequire(import.meta.url); let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const MAQ = path.join(DIR, process.argv[2]);
const b = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] }); const ctx = await b.newContext({ viewport: { width: 1536, height: 864 } }); await ctx.route(u => /firebasedatabase/.test(String(u)), r => r.abort());
const PDFJS = '/tmp/claude-0/-home-claude/fbedd388-7b0c-5f43-87ab-077e6ae1db43/scratchpad/reperes/node_modules/pdfjs-dist/build/';
await ctx.route(u => String(u).includes('cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/'), r => { const f = String(r.request().url()).split('/').pop(); r.fulfill({ path: PDFJS + f, contentType: 'application/javascript' }); });
const pg = await ctx.newPage(); const err = []; pg.on('pageerror', e => err.push(e.message)); const att = ms => pg.waitForTimeout(ms);
await pg.goto('file://' + MAQ); await att(1500); await pg.getByText('Rédaction 1', { exact: false }).first().click(); await att(1800); await pg.click('#btnScan'); await att(600);
await pg.setInputFiles('#scanEcran input[type=file]', path.join(DIR, 'paquet-essai.pdf')); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 8, null, { timeout: 60000 }); await att(800);
for (const ini of ['ec', 'la', 'mb', '', 'tb', 'gc', 'rb']) { await pg.keyboard.type(ini); await att(150); await pg.keyboard.press('Enter'); await att(250); }
await att(600); await pg.evaluate(() => document.activeElement.blur()); await pg.keyboard.press('ArrowRight'); await att(500);
await pg.screenshot({ path: path.join(DIR, 'banc', 'captures', '19-alerte-lignes.png') });
console.log('alerte : ' + await pg.evaluate(() => { const a = document.getElementById('scAlerte'), l = document.getElementById('scLigAlerte'); return (a && !a.hidden ? a.textContent : '-') + ' | ' + (l && !l.hidden ? l.textContent : '-') + ' | copie ' + SC.ic; }));
console.log('erreurs : ' + (err.join(' | ') || 'aucune')); await b.close();

// 1443 : le panneau d'une question, construit : passe de la langue, Lexique, la question en cours dit la case qu'elle décide, Oui / Non au bouton
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
await pg.keyboard.press('Enter'); await att(400); await pg.evaluate(() => { document.getElementById('scPanneau').scrollTop = 0; }); await att(200);
await pg.screenshot({ path: path.join(DIR, 'banc', 'captures', '15-question-1.png') });
await pg.click('.sc-q >> nth=2'); await att(300); await pg.screenshot({ path: path.join(DIR, 'banc', 'captures', '16-question-3.png') });
await pg.click('.sc-q.on >> text=Non · N'); await att(300); await pg.click('.sc-pts span >> nth=1').catch(() => {}); await pg.evaluate(() => { SC.ic = 0; SC.ip = 1; SC.iq = SC.passes[0].pts[1].questions[2].cle; scRendre(); }); await att(300);
await pg.screenshot({ path: path.join(DIR, 'banc', 'captures', '17-apres-non.png') });
console.log('erreurs : ' + (err.join(' | ') || 'aucune')); await b.close();

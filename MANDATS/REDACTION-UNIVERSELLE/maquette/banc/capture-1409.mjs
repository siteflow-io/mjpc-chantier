// 1409 construit : la copie à la largeur de l'écran, une faute posée d'un clic sur le mot, puis le zoom (Ctrl + molette) sous la souris.
// node capture-1409.mjs <maquette.html> <dossier de sortie> <préfixe> <fichier du paquet>... ; les clics : variable CLICS='[[x,y,"bonne forme"],…]' (fractions de la page 1)
import { createRequire } from 'node:module'; import path from 'node:path'; import fs from 'node:fs';
const req = createRequire(import.meta.url); let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const [maq, out, pre, ...paquet] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] }); const ctx = await b.newContext({ viewport: { width: 1536, height: 864 } });
await ctx.route(u => /firebasedatabase|firebaseio/.test(String(u)), r => r.abort());
const PDFJS = process.env.PDFJS || '/tmp/claude-0/-home-claude/fbedd388-7b0c-5f43-87ab-077e6ae1db43/scratchpad/reperes/node_modules/pdfjs-dist/build/';
await ctx.route(u => String(u).includes('cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/'), r => { const f = String(r.request().url()).split('/').pop(); r.fulfill({ path: PDFJS + f, contentType: 'application/javascript' }); });
const pg = await ctx.newPage(); const err = []; pg.on('pageerror', e => err.push(e.message)); const att = ms => pg.waitForTimeout(ms); const cap = n => pg.screenshot({ path: path.join(out, pre + n + '.png') });
await pg.goto('file://' + path.resolve(maq)); await att(1500); await pg.getByText('Rédaction 1', { exact: false }).first().click(); await att(1800); await pg.click('#btnScan'); await att(600);
await pg.setInputFiles('#scanEcran input[type=file]', paquet.map(f => path.resolve(f))); await pg.waitForFunction(n => Object.keys(SC.pages).length >= n, +(process.env.PAGES || paquet.length), { timeout: 60000 }); await att(800);
for (const ini of JSON.parse(process.env.INITIALES || '["ec"]')) { await pg.keyboard.type(ini); await att(200); await pg.keyboard.press('Enter'); await att(400); }
await pg.evaluate(() => { SC.zoom = 1; scDessinerPages(); scZoomAffiche(); }); await att(300);
const box = await pg.locator('.sc-page').first().boundingBox(); const clics = JSON.parse(process.env.CLICS || '[]');
for (const [x, y, bonne] of clics) { await pg.mouse.click(box.x + x * box.width, box.y + y * box.height); await att(300); if (bonne) { await pg.keyboard.type(bonne); await att(150); } await pg.keyboard.press('Enter'); await att(250); }
await pg.mouse.move(1300, 500); await att(200);
const t = await pg.evaluate(() => { const e = document.querySelector('.sc-page'), r = e.getBoundingClientRect(), p = SC.pages[e.dataset.p]; return Math.round(r.width) + ' × ' + Math.round(r.height) + ' points pour une page de ' + p.w + ' × ' + p.h + ' (' + Math.round(100 * r.width / p.w) + ' %)'; });
await cap('1-largeur');
const [zx, zy] = JSON.parse(process.env.ZOOM || '[0.45, 0.3]'); await pg.mouse.move(box.x + zx * box.width, box.y + zy * box.height); await pg.keyboard.down('Control'); for (let i = 0; i < 5; i++) { await pg.mouse.wheel(0, -100); await att(120); } await pg.keyboard.up('Control'); await att(400);
const z = await pg.evaluate(() => document.getElementById('scZoom').textContent); await cap('2-zoom');
console.log('1409 : ' + t + ' · zoom : ' + z + ' · marques : ' + await pg.evaluate(() => Object.values(scCopie(scK()).marques).map(m => m.forme + (m.bonne ? '(' + m.bonne + ')' : '') + ' ' + Math.round((m.x1 - m.x0) * 1000) / 10 + '%').join(', ')));
console.log('erreurs : ' + (err.join(' | ') || 'aucune')); await b.close();

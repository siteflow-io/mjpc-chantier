// C13 tour 416 (Paul, 12:59 : « montre moi une capture des stickers ») : les stickers, construits dans l'app (maquette STICKERS=1), au geste
import { createRequire } from 'node:module'; import path from 'node:path'; import fs from 'node:fs';
const req = createRequire(import.meta.url); let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const MAQ = path.join(DIR, process.argv[2]); const OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const b = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] }); const ctx = await b.newContext({ viewport: { width: 1536, height: 864 } }); await ctx.route(u => /firebasedatabase/.test(String(u)), r => r.abort());
const PDFJS = '/tmp/claude-0/-home-claude/fbedd388-7b0c-5f43-87ab-077e6ae1db43/scratchpad/reperes/node_modules/pdfjs-dist/build/';
await ctx.route(u => String(u).includes('cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/'), r => { const f = String(r.request().url()).split('/').pop(); r.fulfill({ path: PDFJS + f, contentType: 'application/javascript' }); });
const pg = await ctx.newPage(); const err = []; pg.on('pageerror', e => err.push(e.message)); const att = ms => pg.waitForTimeout(ms);
await pg.goto('file://' + MAQ); await att(1500); await pg.getByText('Rédaction 1', { exact: false }).first().click(); await att(1800); await pg.click('#btnScan'); await att(600);
await pg.setInputFiles('#scanEcran input[type=file]', path.join(DIR, 'paquet-essai.pdf')); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 8, null, { timeout: 60000 }); await att(800);
for (const ini of ['ec', 'la', 'mb', '', 'tb', 'gc', 'rb']) { await pg.keyboard.type(ini); await att(150); await pg.keyboard.press('Enter'); await att(250); }
await att(600); await pg.keyboard.type('24'); await pg.keyboard.press('Enter'); await att(400);
const boite = async () => pg.locator('.sc-page').first().boundingBox();
const clic = async (x, y) => { const r = await boite(); await pg.mouse.click(r.x + x * r.width, r.y + y * r.height); await att(300); };
const tire = async (x0, y0, x1, y1) => { const r = await boite(); await pg.mouse.move(r.x + x0 * r.width, r.y + y0 * r.height); await pg.mouse.down(); await pg.mouse.move(r.x + x1 * r.width, r.y + y1 * r.height, { steps: 6 }); await pg.mouse.up(); await att(300); };
const sticker = async t => { await pg.locator('.sc-st', { hasText: t }).first().click(); await att(200); };
// la langue : une faute avec sa bonne forme, puis les stickers
await clic(0.215, 0.162); await pg.keyboard.type('écris'); await pg.keyboard.press('Enter'); await att(300);
await sticker('Rép.'); await tire(0.232, 0.279, 0.28, 0.279);   // « boue », déjà deux lignes plus haut
await sticker('Rép.'); await tire(0.655, 0.362, 0.79, 0.362);   // « maintenant », déjà dans la phrase d'avant
await sticker('Rép.'); await tire(0.668, 0.2505, 0.714, 0.2505);   // « plus », déjà dans la ligne d'avant
await sticker('Mot ?'); await tire(0.54, 0.2505, 0.585, 0.2505);  // pour la capture seulement : la copie d'essai est bien écrite
await sticker('14-18'); await tire(0.381, 0.2505, 0.416, 0.2505);  // « obus »
const etat = await pg.evaluate(() => ({ st: Object.values(scCopie(scK()).marques).filter(m => m.forme === 'sticker').map(m => m.st + ':' + m.point + ':' + m.q), rep: JSON.stringify(scCopie(scK()).rep.lexique || {}), lex: (() => { const pt = scTousPoints().find(p => p.id === 'lexique'); const r = scCase(pt, scK()); return r ? r.c.niveau + ' ' + r.txt : null; })(), seuil: !!document.querySelector('.sc-st:disabled .sc-st-seuil') }));
console.log(JSON.stringify(etat));
await pg.evaluate(() => { SC.sel = null; scRendre(); }); await att(300); await pg.screenshot({ path: path.join(OUT, 'st-1-langue.png') });
// une autre passe : la construction des phrases, sa palette ; une litote en vert
await pg.click('.sc-passe >> nth=2'); await att(400); await pg.click('.sc-vig >> nth=0'); await att(400);
await sticker('Litote'); await tire(0.135, 0.414, 0.38, 0.414);
await pg.evaluate(() => { SC.sel = null; scRendre(); }); await att(300); await pg.screenshot({ path: path.join(OUT, 'st-2-construction.png') });
// le fichier de l'élève : l'étiquette sur sa copie ; un clic ouvre le point, « Par exemple, sur ta copie »
await pg.click('text=📨 Fichiers École Directe'); await att(500);
const popE = ctx.waitForEvent('page'); await pg.click('.sc-table tr >> nth=1 >> text=Tester comme l\'élève'); const el = await popE; await el.waitForLoadState(); await el.setViewportSize({ width: 1536, height: 864 }); await att(1200);
await el.locator('#passer').click(); await att(600);
await el.locator('#col .mk.st', { hasText: 'Rép.' }).first().click(); await att(500);
const bx = await el.locator('#col .mk.st', { hasText: 'Rép.' }).first().boundingBox(); await el.evaluate(y => window.scrollBy(0, y - 260), bx.y); await att(400);
await el.screenshot({ path: path.join(OUT, 'st-3-eleve.png') });
console.log('élève : ' + await el.evaluate(() => (document.querySelector('#pan') || {}).innerText.replace(/\s+/g, ' ').slice(0, 400)));
console.log('erreurs : ' + (err.join(' | ') || 'aucune')); await b.close();

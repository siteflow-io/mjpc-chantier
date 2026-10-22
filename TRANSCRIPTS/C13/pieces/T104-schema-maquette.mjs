// la même mesure sur la maquette validée p8-5g (62d9557a…) : la vraie carte « Les figures de style » (e-sim-vraie-carte), en classe, au tableau
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const FICHIER = path.resolve(process.argv[2]); const OUT = path.resolve(process.argv[3]); fs.mkdirSync(OUT, { recursive: true });
const req = createRequire(import.meta.url); const pw = req('/opt/node22/lib/node_modules/playwright');
const R = []; const dire = s => { R.push(s); console.log(s); };
const MESURE = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'mesure.js'), 'utf8');
const nav = await pw.chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); page.on('dialog', d => d.dismiss().catch(() => {}));
const pause = ms => new Promise(r => setTimeout(r, ms));
dire('schéma dans la maquette p8-5g · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex'));
await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1500);
const ok = await page.evaluate(() => { try { lancerHeure(2); const E = seance().ecrans; const i = E.findIndex(e => e.eid === 'e-sim-vraie-carte'); if (i < 0) return 'diapo absente'; S._parGardeCahier = true; aller(i, true); S._parGardeCahier = false; return 'diapo ' + i + ' / ' + E.length + ' · ' + E[i].act; } catch (e) { return 'erreur ' + e.message; } }); await pause(1500);
dire('pilote : ' + ok); await page.screenshot({ path: path.join(OUT, 'Q1-maquette-pilote.png') });
dire('PILOTE : ' + JSON.stringify(await page.evaluate(MESURE)));
await page.keyboard.press('Escape'); await pause(300); await page.evaluate(() => { const v = document.getElementById('ecran-edt'); if (v) v.classList.remove('on'); });
let fen = null; [fen] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), page.evaluate(() => document.getElementById('bvideoproj').click())]);
if (!fen) dire('TABLEAU : aucune fenêtre'); else { await pause(2000); dire('fenêtre : ' + fen.url().slice(0, 100));
  for (const [w, hh] of [[1366, 768], [1920, 1080]]) { await fen.setViewportSize({ width: w, height: hh }); await pause(1500); await fen.screenshot({ path: path.join(OUT, 'Q2-maquette-tableau-' + w + '.png') }); dire('TABLEAU ' + w + '×' + hh + ' : ' + JSON.stringify(await fen.evaluate(MESURE))); }
  await fen.close().catch(() => {}); }
dire('erreurs JS : ' + errs.length + (errs.length ? ' — ' + errs.slice(0, 3).join(' | ') : ''));
fs.writeFileSync(path.join(OUT, 'schema3.txt'), R.join('\n') + '\n'); await nav.close();

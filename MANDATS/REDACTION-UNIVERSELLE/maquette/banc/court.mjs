// Pendant le travail seulement (le banc complet reste la preuve) : le paquet, ses initiales, la grille validée, puis les épreuves de la 1.4.28.
import { eprouverStickersReglages } from "./stickers.mjs";
import { eprouverReprendre, eprouverBandeSuite } from "./reprendre.mjs";
import { eprouverPoints } from "./points.mjs";
import { eprouverTypes } from "./types.mjs";
import { eprouverDetail } from "./detail.mjs";
import { eprouverRetrouver } from "./retrouver.mjs";
import { eprouverLigature } from "./ligature.mjs";
import { createRequire } from 'node:module'; import path from 'node:path'; import fs from 'node:fs';
const req = createRequire(import.meta.url); let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const MAQ = path.join(DIR, process.argv[2]); const OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const b = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] }); const ctx = await b.newContext({ viewport: { width: 1536, height: 864 }, acceptDownloads: true });
const pg = await ctx.newPage(); const err = []; pg.on('pageerror', e => { err.push(e.message + ' | ' + String(e.stack || '').split('\n').slice(0, 6).join(' < ')); console.log('ERREUR PAGE', e.message, String(e.stack || '').split('\n').slice(0, 8).join(' < ')); }); pg.on('dialog', d => { err.push('boîte ' + d.message()); d.dismiss(); });
await ctx.route(u => /firebasedatabase|firebaseio/.test(String(u)), r => { err.push('RÉSEAU HUB ' + r.request().url()); r.abort(); });
const PDFJS = process.env.PDFJS; await ctx.route(u => String(u).includes('cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/'), r => { const f = String(r.request().url()).split('/').pop(); r.fulfill({ path: PDFJS + f, contentType: 'application/javascript' }); });
const verif = (n, c) => { console.log((c ? '✓ ' : '✗ ') + n); };
const att = ms => pg.waitForTimeout(ms); const cap = async (n, p) => { await (p || pg).screenshot({ path: path.join(OUT, n + '.png') }); };
try {
  await pg.goto('file://' + MAQ); await att(1500); await pg.getByText('Rédaction 1', { exact: false }).first().click(); await att(1800);
  await pg.click('#btnScan'); await att(600);
  await pg.setInputFiles('#scanEcran input[type=file]', path.join(DIR, 'paquet-essai.pdf')); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 8, null, { timeout: 60000 }); await att(800);
  for (const ini of ['ec', 'la', 'mb', '', 'tb', 'gc', 'rb']) { await pg.keyboard.type(ini); await att(150); await pg.keyboard.press('Enter'); await att(250); }
  await att(800); await pg.locator('button[onclick="scFermer()"]').click(); await att(800);
  await eprouverStickersReglages({ pg, verif, cap, att, dir: DIR });
  if (process.env.ECHO) { await pg.evaluate(() => { try { localStorage.setItem("mjpc_faux_hub_echo", "300"); } catch (e) {} }); await pg.reload(); await att(6000); }
  await eprouverReprendre({ pg, verif, cap, att }); await eprouverBandeSuite({ pg, verif, cap, att }); await eprouverPoints({ pg, verif, cap, att }); await eprouverTypes({ pg, verif, cap, att }); await eprouverDetail({ pg, verif, cap, att }); await eprouverLigature({ pg, verif, cap, att }); await eprouverRetrouver({ pg, verif, cap, att, DIR: OUT });
} catch (e) { console.log('ARRÊT : ' + String(e.message).split('\n')[0]); await cap('zz-arret'); }
console.log(err.length ? 'ERREURS\n' + err.join('\n') : 'aucune erreur'); await b.close();

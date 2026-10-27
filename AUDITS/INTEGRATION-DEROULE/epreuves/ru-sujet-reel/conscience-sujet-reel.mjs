// Contrôle de la conscience : un sujet de la forme 1.0.0-RU SANS classe et SANS copie (la forme exacte du sujet que Paul a créé au vrai hub à 17:43) — s'affiche-t-il à l'accueil 1.1 ?
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module';
import { hubDeDepart, installer, sessionProf } from './fauxhub.mjs';
const ICI = path.dirname(new URL(import.meta.url).pathname);
const F = path.resolve(process.argv[2]); const OUT = process.argv[3];
const pw = createRequire(import.meta.url)('/opt/node22/lib/node_modules/playwright');
const nav = await pw.chromium.launch({ args: ['--no-sandbox'] });
const hub = hubDeDepart({ avecDugain: false });
const lettre = JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'lettre-grande-guerre.json'), 'utf8'));
// la forme 1.0.0-RU : la config telle que « Créer » l'écrivait en 1.0 (id interne, nom court, dates), sans classe
hub.redactions = { sujet_mvqx0bld_6pj89w: { config: Object.assign({}, lettre, { idInterne: 'sujet_mvqx0bld_6pj89w', nomCourt: 'lettre-grande-guerre-3e', creeLe: '2026-10-27T16:43:45.457Z', modifieLe: '2026-10-27T16:43:45.457Z' }) } };
delete hub.redactions.sujet_mvqx0bld_6pj89w.config.id;
const ctx = await nav.newContext({ viewport: { width: 1707, height: 743 } }); await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => d.accept().catch(() => {}));
await pg.addInitScript(installer, hub); await pg.addInitScript(sessionProf);
await pg.goto('file://' + F + '?mode=prof'); await pg.waitForTimeout(2500);
const txt = await pg.evaluate(() => document.body.innerText);
await pg.screenshot({ path: path.join(OUT, 'accueil-sujet-reel-sans-copie.png') });
console.log('lettre visible à l\'accueil :', /Écrire une lettre de la Grande Guerre/.test(txt));
console.log(txt.slice(0, 900)); console.log('erreurs JS :', JSON.stringify(errs)); console.log('écritures :', JSON.stringify(await pg.evaluate(() => window.__ECR || [])));
await nav.close();

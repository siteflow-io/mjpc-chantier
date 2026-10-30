// Essai à la fumée du fichier à mettre en ligne : le vrai site lu (GET), aucune écriture n'y part (interceptées, comptées)
import { createRequire } from 'node:module'; import path from 'node:path';
const req = createRequire(import.meta.url); let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const [fichier, ...paquet] = process.argv.slice(2);
const b = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] }); const ctx = await b.newContext({ viewport: { width: 1536, height: 864 } });
await ctx.addInitScript(() => { try { if (!localStorage.getItem('mjpc_eleve')) localStorage.setItem('mjpc_eleve', JSON.stringify({ is_prof: true, display: 'Professeur', ts: Date.now() })); } catch (e) {} });
const ecrits = [], lus = []; await ctx.route(u => /firebasedatabase|firebaseio/.test(String(u)), r => { const q = r.request(); if (q.method() === 'GET') { lus.push(q.url().split('.app')[1].split('?')[0]); return r.continue(); } ecrits.push(q.method() + ' ' + q.url().split('.app')[1]); return r.fulfill({ status: 200, contentType: 'application/json', body: q.postData() || 'null' }); });
const PDFJS = process.env.PDFJS || '/tmp/claude-0/-home-claude/fbedd388-7b0c-5f43-87ab-077e6ae1db43/scratchpad/reperes/node_modules/pdfjs-dist/build/';   // le banc n'a pas internet : pdf.js servi d'une copie locale
await ctx.route(u => String(u).includes('cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/'), r => { const f = String(r.request().url()).split('/').pop(); r.fulfill({ path: PDFJS + f, contentType: 'application/javascript' }); });
const pg = await ctx.newPage(); const err = []; pg.on('pageerror', e => err.push(e.message)); pg.on('console', m => { if (m.type() === 'error') err.push('console: ' + m.text().slice(0, 160)); }); const att = ms => pg.waitForTimeout(ms);
await pg.goto('file://' + path.resolve(fichier)); await att(3000);
console.log('version : ' + await pg.evaluate(() => (typeof APP_VERSION !== 'undefined' ? APP_VERSION : '?') + ' · faux hub ' + !!window.__FAUX_HUB));
const titres = await pg.evaluate(() => Array.from(document.querySelectorAll('button, .carte, [onclick]')).map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(t => /Rédaction 1/.test(t)).slice(0, 4)); console.log('à l\'accueil : ' + JSON.stringify(titres));
await pg.getByText('Rédaction 1', { exact: false }).first().click(); await att(3000);
console.log('après le clic : ' + await pg.evaluate(() => 'RU.id ' + RU.id + ' · classe ' + RU.classe + ' · élèves ' + (state.classe || []).length + ' · btnScan ' + !!(document.getElementById('btnScan') && document.getElementById('btnScan').offsetParent)));
await pg.screenshot({ path: path.join(path.dirname(fichier), 'fumee-1-tableau.png') });
const avant = ecrits.length; await att(1500); if (!(await pg.evaluate(() => SC.ouvert))) await pg.click('#btnScan'); await att(2500); console.log('repris seul sur les scans : ' + await pg.evaluate(() => SC.ouvert + ' · pages au site ' + Object.keys(SC.pages).length + ' · manquantes dans ce navigateur ' + scManquantes().length));
console.log('écran des scans : ' + await pg.evaluate(() => 'ouvert ' + SC.ouvert + ' · passes ' + SC.passes.filter(p => p.id !== 'retours').map(p => p.nom + ':' + p.pts.length).join(' | ') + ' · questions ' + SC.grille.criteres.reduce((a, c) => a + c.points.reduce((b, p) => b + p.questions.length, 0), 0)));
await pg.screenshot({ path: path.join(path.dirname(fichier), 'fumee-2-scans.png') });
if (paquet.length) { await pg.setInputFiles('#scanEcran input[type=file]', paquet.map(f => path.resolve(f))); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 9, null, { timeout: 60000 }).catch(() => {}); await att(1500);
  console.log('paquet : ' + await pg.evaluate(() => Object.keys(SC.pages).length + ' pages lues · attribution ' + SC.attrib)); await pg.screenshot({ path: path.join(path.dirname(fichier), 'fumee-3-paquet.png') }); }
console.log('écritures interceptées (jamais envoyées) : ' + ecrits.length + ' dont ' + (ecrits.length - avant) + ' après l\'ouverture des scans');
console.log([...new Set(ecrits.map(e => e.replace(/\/pages\/page_[^/]+/, '/pages/<page>').replace(/copies\/([^/]+)\/[^/.]+/, 'copies/$1/<élève>')))].join('\n'));
console.log('lectures : ' + [...new Set(lus.map(l => l.replace(/\/pages\/page_[^/]+/, '/pages/<page>')))].slice(0, 30).join(' · '));
console.log('erreurs : ' + (err.join(' | ') || 'aucune')); await b.close();

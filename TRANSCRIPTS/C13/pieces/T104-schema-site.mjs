// LE PARCOURS FIXE DU DÉROULÉ DANS LE SITE — P0 → P12, par le geste, sur le faux hub, écran entier capturé à chaque pas.
// usage : node parcours.mjs <index.html> [dossier-de-sortie]       (env : MJPC_HUB = dossier du faux hub ; MJPC_MODE_TEST=1 ; MJPC_PLAYWRIGHT ; MJPC_CHROMIUM)
// Le même parcours que la conscience a joué le 20/10 sur la production (pièces T72-EX-00…12) : il doit passer sur le fichier intégré.
// Chaque pas essaie D'ABORD les noms du déroulé intégré (contrat §7), PUIS ceux de la production d'aujourd'hui, et dit lequel il a pris.
// Ce qui fait échouer (code 1) : une erreur JS ; une boîte système ; une écriture au hub hors des chemins permis (K15) ;
// une écriture au hub en mode test (K15-test) ; un pas qui a trouvé son entrée mais n'a pas abouti.
// Un pas dont l'entrée n'existe ni en neuf ni en ancien est « absent » : ce n'est pas un échec, c'est écrit (le territoire n'est pas encore livré).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname);
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties-parcours'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node parcours.mjs <index.html> [dossier-de-sortie]'); process.exit(2); }
const HUB = path.resolve(process.env.MJPC_HUB || path.join(ici, 'hub')); const MODE_TEST = process.env.MJPC_MODE_TEST === '1';
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', path.join(path.dirname(FICHIER), 'node_modules', 'playwright'), 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const store = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null,
  site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
try { store.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {}
const PERMIS = [/^\/site\/3e\/chapitres\/\d+\/seances\/\d+\/deroule(_joue)?(\/|$)/, /^\/site\/cours_actif$/, /^\/site\/edt\//, /^\/corbeille\//, /^\/classes\//];
const R = []; let echecs = 0; const dire = s => { R.push(s); console.log(s); };
const pas = (k, etat, quoi, detail) => { if (etat === 'ÉCHEC') echecs++; dire('  ' + (etat === 'ok' ? 'ok     ' : etat === 'absent' ? 'absent ' : 'ÉCHEC  ') + k + ' · ' + quoi + (detail ? ' — ' + detail : '')); };
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage(); await page.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00'));
const errs = [], boites = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); page.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
await page.addInitScript(s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; }, store);
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const cap = async n => { await nettoyer(); await page.screenshot({ path: path.join(OUT, n + '.png') }); };
const clicTexte = (sel, txt) => page.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const existe = sel => page.evaluate(s => { const e = document.querySelector(s); return !!(e && e.offsetParent !== null); }, sel);
const clic = sel => page.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);   // le clic par l'élément : une modale ouverte par-dessus ne bloque pas le pas suivant, elle se voit dans la capture
const ecrits = () => page.evaluate(() => window.__ECR.slice());
// en mode test, les écritures vont au magasin M8_TEST_STORE (jamais au hub) : c'est là qu'on vérifie ce que le lancement a écrit
// (v3, 15:13, mesure d'E2) : le magasin range AUSSI les lectures mises en cache (`secuLire`), donc une clé peut exister avant le lancement ;
// on compare les VALEURS avant/après, pas la présence des clés
const magasin = () => page.evaluate(() => { const m = window.M8_TEST_STORE || {}; const o = {}; Object.keys(m).forEach(k => { try { o[k] = JSON.stringify(m[k]); } catch (e) { o[k] = String(m[k]); } }); return o; });
let magasinAvant = {};
const traces = async () => { if (!MODE_TEST) return ecrits(); const m = await magasin(); return Object.keys(m).filter(k => magasinAvant[k] !== m[k]).map(k => 'MAGASIN ' + k); };
const cadreAncien = () => page.evaluate(() => !!document.getElementById('at-dr-iframe'));
const MESURE = `(() => { const svg = document.querySelector('#mur2 svg.p8-svg, .mur.tableau svg.p8-svg, svg.p8-svg'); if (!svg) return { svg: false };
 const r0 = svg.getBoundingClientRect(); const vb = svg.viewBox.baseVal; const sx = r0.width / vb.width, sy = r0.height / vb.height;
 const N = Array.from(svg.querySelectorAll('g.p8-n')).map(g => { const rs = g.querySelectorAll('rect'); const rc = rs[rs.length - 1]; const t = g.querySelector('text'); const x = +rc.getAttribute('x'), y = +rc.getAttribute('y'), w = +rc.getAttribute('width'), h = +rc.getAttribute('height'); const br = t.getBoundingClientRect(); const fs = +t.getAttribute('font-size'); return { k: g.dataset.k, t: (t.textContent || '').trim(), x, y, w, h, fs, fsEcranPx: +(fs * sy).toFixed(1), fsEcranPt: +(fs * sy * 0.75).toFixed(1), ecranH: Math.round(br.height), op: getComputedStyle(g).opacity, noyau: rc.getAttribute('stroke') === '#b01414', clair: rc.getAttribute('fill') === '#fff', bouge: g.classList.contains('p8-bouge') }; });
 const chev = []; for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) { const a = N[i], b = N[j]; const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); if (ix > 0.5 && iy > 0.5) chev.push(a.t + ' × ' + b.t + ' (' + Math.round(ix) + '×' + Math.round(iy) + ')'); }
 const hors = N.filter(n => n.x < 0 || n.y < 0 || n.x + n.w > vb.width + 0.5 || n.y + n.h > vb.height + 0.5).map(n => n.t);
 const vis = N.filter(n => +n.op > 0.5);
 return { svg: true, ecran: [Math.round(r0.width), Math.round(r0.height)], vb: [vb.width, vb.height], sx: +sx.toFixed(3), sy: +sy.toFixed(3), n: N.length, visibles: vis.length, fsMin: Math.min(...N.map(n => n.fs)), fsMax: Math.max(...N.map(n => n.fs)), ptEcranMin: Math.min(...N.map(n => n.fsEcranPt)), ptEcranMax: Math.max(...N.map(n => n.fsEcranPt)), chev, hors, noyau: N.filter(n => n.noyau).map(n => n.t), familles: N.filter(n => !n.noyau && !n.clair).map(n => n.t + ' ' + n.fs), notions: N.filter(n => n.clair).map(n => n.t + ' ' + n.fs), bouge: N.filter(n => n.bouge).length }; })()`;
const mesurer = p => p.evaluate(MESURE);
dire('schéma dans le site intégré (mesure 2) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex'));
await page.goto('file://' + FICHIER + '?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await page.click('#tprof-btn'); await pause(500);
await page.evaluate(() => atelierOuvrir()); await pause(1000); await clicTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800);
await clicTexte('button,[onclick]', 'Éditer dans l’atelier'); await pause(1500);
if (await existe('.at-onglet[data-vue="atelier"]')) await clic('.at-onglet[data-vue="atelier"]'); await pause(2500);
const okSeance = await page.evaluate(() => { const col = document.querySelector('#atSommaireNatif, .at-sommaire, .at-colonne, .at-col') || document.body; const els = Array.from(col.querySelectorAll('*')).filter(e => e.children.length <= 3 && /Albatros/.test(e.textContent || '') && e.getBoundingClientRect().left < 270 && (e.textContent || '').length < 120 && !/attendu|ed2-it\b/.test(e.className || '') && !/^Fiche/.test((e.textContent||'').trim())); const e = els.sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!e) return 'aucun'; e.scrollIntoView(); e.click(); return (e.tagName + ' ' + (e.className || '') + ' : ' + (e.textContent || '').trim()).slice(0, 90); }); await pause(2500);
dire('séance cliquée : ' + okSeance);
const okVig = await page.evaluate(() => { const els = Array.from(document.querySelectorAll('*')).filter(e => e.children.length <= 3 && /figures de style/i.test(e.textContent || '') && e.getBoundingClientRect().left < 270 && e.getBoundingClientRect().width > 0 && (e.textContent || '').length < 80 && !/attendu|ed2-it\b/.test(e.className || '') && !/^Fiche/.test((e.textContent||'').trim())); const e = els.sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!e) return 'aucune'; e.scrollIntoView(); e.click(); return (e.tagName + ' ' + (e.className || '') + ' : ' + (e.textContent || '').trim()).slice(0, 90); }); await pause(2500);
dire('vignette cliquée : ' + okVig);
await cap('M1-atelier-carte');
dire('ATELIER : ' + JSON.stringify(await mesurer(page)));
const al = await page.evaluate(() => { try { const A = alertesForme(); const d = A.filter(a => a.k === 'dense'); const b = Array.from(document.querySelectorAll('button')).find(x => /À régler/.test(x.innerText || '')); const vis = Array.from(document.querySelectorAll('.at-d, .at-note, i, div')).filter(x => x.offsetParent !== null && /ne tient pas lisible/.test(x.textContent || '')).length; return { total: A.length, bouton: b ? b.innerText : null, boutonVisible: !!(b && b.offsetParent !== null), dense: d.map(x => ({ di: x.di, ou: x.ou, l: x.l, faire: x.faire })), alerteVisibleDansLaDiapo: vis, di: S.di }; } catch (e) { return 'erreur ' + e.message; } });
dire('À RÉGLER : ' + JSON.stringify(al));
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(x => /À régler/.test(x.innerText || '')); if (b) b.click(); }); await pause(1200); await cap('M1b-a-regler');
const rep = await clicTexte('button', 'Jouer en avance'); await pause(1500); dire('répétition : ' + rep);
await cap('M2-repetition-carte');
dire('RÉPÉTITION (pilote) : ' + JSON.stringify(await mesurer(page)));
const dev = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(x => x.offsetParent !== null && /Dévoiler/.test(x.innerText)); return b ? (b.innerText + ' | ' + (b.parentElement.innerText || '')).replace(/\s+/g, ' ').slice(0, 80) : 'aucun bouton'; }); dire('bouton Dévoiler : ' + dev);
// la fenêtre du tableau
let fen = null; if (await existe('#bvideoproj')) { [fen] = await Promise.all([ctx.waitForEvent('page', { timeout: 5000 }).catch(() => null), page.click('#bvideoproj')]); }
if (!fen) dire('TABLEAU : aucune fenêtre (#bvideoproj ' + (await existe('#bvideoproj')) + ')');
else { await pause(2000); dire('fenêtre : ' + fen.url().slice(0, 100));
  for (const [w, hh] of [[1366, 768], [1920, 1080]]) { await fen.setViewportSize({ width: w, height: hh }); await pause(1500); await fen.screenshot({ path: path.join(OUT, 'M3-tableau-' + w + '.png') }); dire('TABLEAU ' + w + '×' + hh + ' : ' + JSON.stringify(await mesurer(fen))); }
  await fen.close().catch(() => {}); }
dire('erreurs JS : ' + errs.length + (errs.length ? ' — ' + errs.slice(0, 3).join(' | ') : ''));
fs.writeFileSync(path.join(OUT, 'schema2b.txt'), R.join('\n') + '\n'); await nav.close();

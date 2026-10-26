import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = process.argv[3] || 'mesure'; const TAILLES = String(process.argv[4] || '1366x768,1920x1080').split(',').map(t => t.split('x').map(Number));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node mesure.mjs <fichier.html> <sortie/> [1366x768,1920x1080]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const HUB = path.resolve(process.env.MJPC_HUB || 'AUDITS/INTEGRATION-DEROULE/hub'); const FONTS = process.env.MJPC_FONTS || null;
fs.mkdirSync(OUT, { recursive: true }); const URL0 = 'file://' + FICHIER;
const md5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {} return st; };
const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const p = (pg, ms) => pg.waitForTimeout(ms);
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansVoile = pg => pg.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); }).catch(() => {});
const police = async pg => { if (!FONTS) return; const css = [[400, 'normal'], [400, 'italic'], [500, 'normal'], [600, 'normal'], [700, 'normal'], [800, 'normal']].map(([w, st]) => `@font-face{font-family:'EB Garamond';font-weight:${w};font-style:${st};src:url('file://${path.join(FONTS, `eb-garamond-latin-${w}-${st}.woff2`)}') format('woff2'),url('file://${path.join(FONTS, `eb-garamond-latin-ext-${w}-${st}.woff2`)}') format('woff2');}`).join('\n'); await pg.addStyleTag({ content: css }).catch(() => {}); await pg.evaluate(() => document.fonts.ready).catch(() => {}); };

/* LES CAPTURES « SIMPLIFIER L'EXISTANT » — le même parcours deux fois, à 1707 × 743, l'horloge qui court : AVANT (le fichier intégré d'aujourd'hui) et APRÈS
   (le même fichier + maquette/simplifier.js). Chaque capture porte le nom de ce qu'elle montre. */
const MAQ = process.env.MJPC_MAQ ? fs.readFileSync(process.env.MJPC_MAQ, 'utf8') : null; const MODE = MAQ ? 'apres' : 'avant';
const W = 1707, H = 743; const nav = await pw.chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = [];
pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { errs.push('boîte : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
await pg.clock.install({ time: new Date('2026-09-14T08:50:00+02:00') }); await pg.addInitScript(fauxHub, hubStore()); if (MAQ) await pg.addInitScript(MAQ);
await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 2200); await police(pg);
const journal = [];
const cap = async (nom) => { await sansVoile(pg); await p(pg, 700); const f = path.join(OUT, MODE + '-' + nom + '.png'); await pg.screenshot({ path: f }); const n = await pg.evaluate(() => Array.from(document.querySelectorAll('button, select, input:not([type=hidden])')).filter(el => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight) return false; const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden') return false; const t = document.elementFromPoint(Math.min(innerWidth - 1, r.left + r.width / 2), Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2))); return t && (t === el || el.contains(t)); }).length); journal.push(MODE + '-' + nom + ' · ' + n + ' commandes à l\'écran'); console.log(journal[journal.length - 1]); };
const pas = async (f, t = 900) => { try { await f(); } catch (e) { journal.push('(geste pas abouti : ' + String(e.message).slice(0, 100) + ')'); } await p(pg, t); };
const clic = (sel, txt) => clicTexte(pg, sel, txt);
const avancer = async (jusqua) => { const cible = new Date(jusqua).getTime(); const now = await pg.evaluate(() => Date.now()); if (cible > now) await pg.clock.fastForward(Math.round(cible - now)); await p(pg, 2500); await pg.clock.fastForward(1500); await p(pg, 1500); };
const laCase = () => pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; c.click(); });
await pas(() => pg.evaluate(() => { try { loginAsProf(); } catch (e) {} }), 2500);
/* 1 · la répétition dans l'Atelier */
await pas(() => pg.evaluate(() => { const e = document.getElementById('edt-ecran'); if (e && e.style.display !== 'none') { const b = Array.from(document.querySelectorAll('button')).find(x => /Fermer l.emploi du temps/.test(x.innerText)); if (b) b.click(); } }), 900);
await pas(() => pg.evaluate(() => atelierOuvrir()), 1500); await pas(() => clic('button,[onclick]', "atOnglet('chapitres')"), 900);
await pas(() => clic('button,[onclick]', 'Éditer dans l’atelier'), 2500); await pas(() => pg.evaluate(() => document.querySelector('.at-onglet[data-vue="pilotage"]').click()), 2000);
await cap('5-la-repetition-dans-l-atelier');
await pas(() => pg.evaluate(() => { try { atelierFermer(); } catch (e) {} }), 1500);
await pas(() => pg.evaluate(() => { const o = document.querySelector('.tprof-overlay'); if (o && o.offsetParent) { const x = document.querySelector('.tprof-overlay .tprof-close, .tprof-overlay [onclick*=close]'); if (x) x.click(); } }), 600);
/* 2 · l'heure lancée par la case */
await avancer('2026-09-14T08:58:00+02:00');
await pas(() => pg.evaluate(() => { const e = document.getElementById('edt-ecran'); if (!(e && e.style.display !== 'none')) edtOuvrir(); }), 1500);
await pas(laCase, 900); await pas(() => clic('button', 'Ouvrir le pilotage et lancer'), 4000); await pas(() => pg.keyboard.press('Escape'), 400);
for (let i = 0; i < 3; i++) await pas(() => pg.click('#bdev'), 200);
await cap('4-l-heure-lancee-les-noms-des-boutons');
/* 3 · « Fin de l'heure » au milieu de l'heure */
await avancer('2026-09-14T09:20:00+02:00');
await pas(() => pg.click('#bfin'), 1500); await cap('3-fin-de-l-heure-ouverte-au-milieu-de-l-heure');
await pas(() => pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.pp-tete button')).find(x => /Reprendre le cours|Retour au cours/.test(x.innerText)); if (b) b.click(); }), 1200);
/* 4 · T-5 */
await avancer('2026-09-14T09:42:20+02:00'); await cap('1-a-T-5');
await pas(() => pg.evaluate(() => { const b = document.getElementById('f-suivante'); if (b && b.offsetParent) b.click(); }), 1200); await cap('2-etape-2-ce-qui-n-a-pas-ete-fait');
if (MODE === 'avant') { await pas(() => clic('#al-boite button, button', 'Préparer'), 1800); await cap('6-preparer-le-cahier'); await pas(() => clic('button', 'Revenir au cours'), 1200); }
else { await pas(() => clic('.pp-tete button', 'Préparer le cahier'), 2200); await cap('6-preparer-le-cahier'); await pas(() => clic('.pp-tete button', 'Retour au cours'), 1500); }
/* 5 · la case d'une heure en cours */
await pas(() => pg.evaluate(() => edtOuvrir()), 1500); await pas(laCase, 1000); await cap('7-la-case-d-une-heure-en-cours');
fs.writeFileSync(path.join(OUT, MODE + '-journal.txt'), journal.join('\n') + '\n\nerreurs JS : ' + (errs.join(' ; ') || 'aucune') + '\n');
await nav.close();

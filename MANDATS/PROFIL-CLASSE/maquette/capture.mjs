// Conscience n°13 · 26/10/2026 — LA MAQUETTE « LA CLASSE » JOUÉE PAR LE GESTE, sur le faux hub (le dispositif d'E3, banc-1226.mjs :
// faux hub brut moins la trace du 07/09, horloge figée au lundi 14/09/2026 09:00, entrée par le site jusqu'au Pilotage).
// Le geste : lancer l'heure 1 → 14 ▶ → clore à 09:47 (la réactivation de l'heure 2 est construite dans la copie) → l'EDT →
// la carte de classe → « la classe » (l'heure à venir choisie d'elle-même) → un badge → les stats → une heure jouée →
// retour à la semaine → la case du 15/09 → « ✎ Préparer » (atterrit dans la vue) → « ▶ Ouvrir le pilotage et lancer » (« Où en est la classe »).
// usage : MJPC_HUB=<hub> node capture.mjs <maquette.html> <captures/> [1366x768]
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const CAPT = process.argv[3] || 'captures'; const [W, H] = String(process.argv[4] || '1366x768').split('x').map(Number);
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node capture.mjs <maquette.html> <captures/> [1366x768]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const HUB = path.resolve(process.env.MJPC_HUB || 'AUDITS/INTEGRATION-DEROULE/hub'); const FONTS = process.env.MJPC_FONTS || null;
fs.mkdirSync(CAPT, { recursive: true }); const URL0 = 'file://' + FICHIER;
const R = []; const dire = s => { R.push(s); console.log(s); };
dire('maquette « la classe » · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex') + ' · ' + W + '×' + H);
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {} return st; };
const fauxHub = s => { let sv = null; try { sv = sessionStorage.getItem('__E3HUB'); } catch (e) {} window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = []; const garder = () => { try { sessionStorage.setItem('__E3HUB', JSON.stringify(window.__HUB)); } catch (e) {} }; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; garder(); };
  window.__hubLire = lire; window.__hubPoser = pos;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const p = (pg, ms) => pg.waitForTimeout(ms);
const sansVoile = pg => pg.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); }).catch(() => {});
const police = async pg => { if (!FONTS) return; const css = [[400, 'normal'], [400, 'italic'], [500, 'normal'], [600, 'normal'], [700, 'normal'], [800, 'normal']].map(([w, st]) => `@font-face{font-family:'EB Garamond';font-weight:${w};font-style:${st};src:url('file://${path.join(FONTS, `eb-garamond-latin-${w}-${st}.woff2`)}') format('woff2'),url('file://${path.join(FONTS, `eb-garamond-latin-ext-${w}-${st}.woff2`)}') format('woff2');}`).join('\n'); await pg.addStyleTag({ content: css }); await pg.evaluate(() => document.fonts.ready); };
let n = 0; const cap = async (pg, nom) => { n++; const f = path.join(CAPT, String(n).padStart(2, '0') + '-' + nom + '.png'); await pg.screenshot({ path: f }); dire('  capture ' + path.basename(f)); };

const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = [];
pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { errs.push('boîte : ' + d.message()); d.dismiss().catch(() => {}); });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, hubStore());
await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800);
await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await p(pg, 300);
await pg.click('#tprof-btn'); await p(pg, 500); await pg.evaluate(() => atelierOuvrir()); await p(pg, 1000);
await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 800);
if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(pg, 1500);
await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(pg, 2500); await sansVoile(pg); await police(pg);
/* l'heure 1 : lancer, 14 ▶, clore à 09:47 → la réactivation de l'heure 2 est construite dans la copie (§12.26-1) */
await pg.click('[data-lancer="1"]'); await p(pg, 2500); await sansVoile(pg); await pg.keyboard.press('Escape'); await p(pg, 200);
for (let i = 0; i < 14; i++) { await pg.click('#bdev'); await p(pg, 90); } await p(pg, 400);
await pg.clock.setFixedTime(new Date('2026-09-14T09:47:30+02:00')); await p(pg, 2500);
if (await pg.$('#al-aller:visible')) { await pg.click('#al-aller').catch(() => {}); await p(pg, 1500); }
if (await pg.$('#garde-cahier.on')) { const ya = pg.locator('#garde-cahier.on :is(button,[onclick])', { hasText: /Y aller/ }).first(); if (await ya.count()) { await ya.click().catch(() => {}); await p(pg, 1200); } }
for (let k = 1; k <= 7; k++) { const t = await pg.evaluate(() => (document.querySelector('.pp-tete') || {}).innerText || ''); if (/étape 7 sur 7/.test(t)) break; const b = await pg.$('#f-suivante:not([disabled])'); if (!b) break; await b.click().catch(() => {}); await p(pg, 700); }
await pg.locator('#f-clore:visible').first().click().catch(() => {}); await p(pg, 1200); if (await pg.$('#gclore-oui:visible')) { await pg.click('#gclore-oui'); await p(pg, 1500); } await p(pg, 1500);
dire('  heure 1 close : ' + await pg.evaluate(() => !!S.close) + ' · copie : ' + await pg.evaluate(() => { try { const C = dr_cheminC(); const E = window.__hubLire(C + '/ecrans') || []; const r = (Array.isArray(E) ? E : Object.values(E)).find(x => x && x.role === 'reactivation'); return C + ' · ' + E.length + ' écrans · réactivation ' + (r ? ('heure ' + r.heure + ' · ' + r.eid) : 'absente'); } catch (e) { return 'illisible : ' + e.message; } }));
/* l'EDT, la semaine du 14/09 : la carte de classe en bas */
await pg.evaluate(() => edtOuvrir()); await p(pg, 2000); await sansVoile(pg); await cap(pg, 'edt-semaine-la-carte');
/* T1 · la carte → « la classe » : l'heure à venir choisie d'elle-même (la prochaine de la file) */
const carte = await pg.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-carte')).find(x => /Charles/.test(x.innerText)); if (!c) return false; c.click(); return true; });
await p(pg, 1200); dire('  carte cliquée : ' + carte + ' · mode ' + await pg.evaluate(() => EDT_VUE.mode + ' · ' + (EDT_CL.classe || '') + ' · ' + (EDT_CL.cle || '') + ' · ' + (EDT_CL.lignes || []).length + ' heures'));
dire('  les heures : ' + await pg.evaluate(() => { const t = {}; (EDT_CL.lignes || []).forEach(c => { t[c.nature] = (t[c.nature] || 0) + 1; }); return JSON.stringify(t); }));
await cap(pg, 'la-classe-heure-a-venir');
/* T3/T6 · un badge sur la 2e diapo de l'heure : « pas pour cette classe » — une décision de la copie, écrite au hub */
const badge = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.edtcl-diapo')).slice(1, 2).map(d => d.querySelector('.edtcl-badge'))[0]; if (!b) return null; const titre = b.closest('.edtcl-diapo').querySelector('.edtcl-dtete b').innerText; b.click(); return titre; });
await p(pg, 900); dire('  badge posé sur « ' + badge + ' » · écritures : ' + await pg.evaluate(() => (window.__ECR || []).filter(x => /decisions/.test(x)).join(' ; ') || 'aucune'));
await cap(pg, 'la-classe-un-badge');
/* T5 · les stats, à côté */
await pg.evaluate(() => edtClVolet('stats')); await p(pg, 900); await cap(pg, 'la-classe-les-stats');
await pg.evaluate(() => { const z = document.querySelector('.edtcl-stats'); if (z) z.scrollTop = z.scrollHeight; }); await p(pg, 400); await cap(pg, 'la-classe-les-stats-suite');
/* T4 · une heure jouée : sa trace, « Relire cette heure », « Le chapitre » */
await pg.evaluate(() => { const c = (EDT_CL.lignes || []).find(x => x.nature === 'jouee'); if (c) edtClChoisir(c.__cle); }); await p(pg, 900); await cap(pg, 'la-classe-heure-jouee');
/* T1 · l'autre entrée : la case à venir de l'EDT → « ✎ Préparer » atterrit dans la vue, sur cette heure */
await pg.evaluate(() => edtVue('semaine')); await p(pg, 900);
const caseOk = await pg.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/.test(e.innerText) && (e.closest('.edt-case') || {}).dataset && e.closest('.edt-case').dataset.iso === '2026-09-15'); if (!c) return false; c.click(); return true; });
await p(pg, 900); dire('  case du 15/09 cliquée : ' + caseOk); await cap(pg, 'edt-la-case-du-15-09');
const prep = await clicTexte(pg, 'button', 'Préparer'); await p(pg, 1200); dire('  « ✎ Préparer » : ' + prep + ' · mode ' + await pg.evaluate(() => EDT_VUE.mode + ' · ' + (EDT_CL.cle || '')));
await cap(pg, 'preparer-atterrit-dans-la-vue');
/* « ▶ Ouvrir le pilotage et lancer » depuis la vue : l'heure 2 → « Où en est la classe » (rien n'est lancé) */
const lancer = await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(pg, 4000); await sansVoile(pg);
dire('  lancer : ' + lancer + ' · ouverture : ' + await pg.evaluate(() => { const f = document.getElementById('ecran-fin'); return !!(f && f.classList.contains('on') && f.classList.contains('ouverture')); }) + ' · lancée : ' + await pg.evaluate(() => !!(window.S && S.lance)));
await cap(pg, 'ou-en-est-la-classe');
dire('  erreurs JS : ' + (errs.length ? errs.join(' ; ') : 'aucune'));
fs.writeFileSync(path.join(CAPT, 'journal.txt'), R.join('\n') + '\n');
await nav.close();

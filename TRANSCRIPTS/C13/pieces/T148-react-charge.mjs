// E3 · LA RÉACTIVATION CONSTRUITE, MESURÉE SUR PIÈCE (§12.25, E4 c9c58e4c) : l'heure 2 lancée par le geste sur le faux hub brut (l'heure 1 du 07/09), « Ouvrir par la réactivation » oui, la fenêtre du tableau — police et pages de la diapo construite, à 1366 × 768 et 1920 × 1080. Scaffold : celui de banc.mjs (ouvrir / lancer / ouvrirTableau / lire). (contrat §9 ; mandat E3, « bancs par le geste »).
// usage : node banc.mjs <fichier.html> [sortie.txt] [dossier-captures]
//   MJPC_ENTREE=site : le fichier est index.html intégré (assemble/index.html), joué par l'entrée du site sur le faux hub, horloge au 14/09 09:00 ;
//   sans la variable : le fichier est la maquette p8-5g, jouée seule (les bancs écrits avant E1-a, qui passeront ensuite sur le site).
//   MJPC_HUB, MJPC_PLAYWRIGHT, MJPC_CHROMIUM comme les outils de la conscience. Code 1 si un seul cas échoue.
// Ce que chaque cas prouve est dit dans sa ligne ; un cas qui ne peut pas se jouer sur l'entrée choisie est « absent » (écrit, jamais compté vert).
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';

const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null; const CAPT = process.argv[4] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc.mjs <fichier.html> [sortie.txt] [captures/]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', path.join(path.dirname(FICHIER), 'node_modules', 'playwright'), 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const SITE = process.env.MJPC_ENTREE === 'site';
const ici = path.dirname(new URL(import.meta.url).pathname);
const HUB = path.resolve(process.env.MJPC_HUB || path.join(ici, '..', '..', '..', '..', 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const URL0 = 'file://' + FICHIER;

const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null ? ' — ' + detail : '')); return !!ok; };
const absent = (k, quoi, detail) => dire('  absent ' + k + ' · ' + quoi + (detail ? ' — ' + detail : ''));
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });

// ── le faux hub (le même dispositif que parcours.mjs et controles.mjs) ──
const hubStore0 = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); return { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } }; };
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } }; try { st.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {}
  /* comme les contrôles v2.2 de la conscience : on joue l'HEURE 1 d'une séance jamais jouée — l'heure du 07/09 que porte le faux hub ferait lancer l'heure 2 (F2, 13 · 26) */
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {} return st; };
const hubBrut = () => { const st = hubStore0(); return st; };
const fauxHub = s => { /* le hub survit au rechargement de l'onglet (sessionStorage), comme le vrai hub survit au rechargement du pilote */ let sv = null; try { sv = sessionStorage.getItem('__E3HUB'); } catch (e) {} window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = []; const garder = () => { try { sessionStorage.setItem('__E3HUB', JSON.stringify(window.__HUB)); } catch (e) {} }; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; garder(); };
  window.__hubLire = lire; window.__hubPoser = pos;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });

// ── l'entrée : la maquette seule, ou le site par ses gestes jusqu'au Pilotage ──
const ouvrir = async (w = 1366, h = 768, brut = false) => { const ctx = await nav.newContext({ viewport: { width: w, height: h }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = [], boites = [];
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); ctx.on('page', p => { if (p !== pg) p.on('pageerror', e => errs.push('[fenêtre du tableau] ' + String(e.message).slice(0, 160))); }); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
  if (!SITE) { await pg.goto(URL0); await pg.waitForTimeout(700); return { ctx, pg, errs, boites }; }
  await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
  await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, brut ? hubBrut() : hubStore());
  await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await pg.waitForTimeout(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await pg.waitForTimeout(300);
  await pg.click('#tprof-btn'); await pg.waitForTimeout(500); await pg.evaluate(() => atelierOuvrir()); await pg.waitForTimeout(1000);
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await pg.waitForTimeout(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l\u2019atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await pg.waitForTimeout(2500);
  await sansVoile(pg); return { ctx, pg, errs, boites }; };
// le voile « n fiches d'applications ne sont pas à jour » (#fi-overlay) recouvre le site sur le faux hub (audit E1 F15 : /manifestes manque) : il n'est pas du tableau, on le retire
const sansVoile = pg => pg.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); }).catch(() => {});
const lancer = async pg => { await sansVoile(pg); await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(SITE ? 2500 : 600); await sansVoile(pg); if (SITE) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(200); } };
const ouvrirTableau = async pg => { const [fen] = await Promise.all([pg.waitForEvent('popup'), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.waitForTimeout(SITE ? 1500 : 900); return fen; };
// ce que montre une diapo : au pilote, #mur ; dans la fenêtre, #mur2 (.mur.tableau) — la page tableau ne doit jamais contenir #mur (audit I3)
const lire = (ctx, quel) => ctx.evaluate(q => { const mur = q === 'pilote' ? document.getElementById('mur') : (document.getElementById('mur2') || document.querySelector('.mur.tableau')); if (!mur) return null; const mb = mur.getBoundingClientRect(); const c = mur.querySelector('.corpsd') || mur;
  const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0');
  const act = (mur.querySelector('.act') || {}).textContent || '';
  return { page: ((mur.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), act: act.trim().slice(0, 60), lignes: els.map(l => l.getAttribute('data-p') || l.textContent.trim().slice(0, 24)), hors: els.filter(e => { const b = e.getBoundingClientRect(); return b.top < mb.top - 1 || b.bottom > mb.bottom + 1; }).length, mur: !!document.getElementById('mur'), id: mur.id, cls: mur.className }; }, quel);
const pareil = (a, b) => !!a && !!b && a.page === b.page && a.act === b.act && JSON.stringify(a.lignes) === JSON.stringify(b.lignes);
const dev = async (pg, n) => { for (let i = 0; i < n; i++) { await pg.click('#bdev'); await pg.waitForTimeout(90); } };
const cap = async (ctx, n) => { if (CAPT) { try { await ctx.screenshot({ path: path.join(CAPT, n + '.png') }); } catch (e) {} } };
const fin = (k, o) => { verif(k, !o.errs.length, 'aucune erreur JS au pilote ni dans la fenêtre du tableau', o.errs.join(' ; ') || undefined); verif(k, !o.boites.length, 'aucune boîte système', o.boites.join(' ; ') || undefined); return o.ctx.close(); };
let PGC = null; const CAS = async (k, titre, f) => { dire(''); dire(k + ' — ' + titre); try { await f(); } catch (e) { verif(k, false, 'le cas n\'a pas pu aller au bout', String(e.message).split('\n')[0]); if (PGC) { try { await PGC.screenshot({ path: path.join(CAPT || '.', k + '-echec.png') }); dire('    capture de l\'échec : ' + k + '-echec.png · visibles : ' + JSON.stringify(await PGC.evaluate(() => ({ lancer: !!document.querySelector('[data-lancer="1"]'), bdev: !!(document.getElementById('bdev') && document.getElementById('bdev').offsetParent), olancer: !!(document.getElementById('o-lancer') && document.getElementById('o-lancer').offsetParent), gardes: Array.from(document.querySelectorAll('.garde.on, [id^=garde].on, .modale.on')).map(x => x.id || x.className).slice(0, 5) })))); } catch (e2) {} } } };


//      un dévoilement de plus → la fenêtre suit, sans rechargement.

const FONTS = process.env.MJPC_FONTS || path.join(ici, '..', 'outils', 'eb-garamond');
const police = async pg => { const css = [[400, 'normal'], [400, 'italic'], [500, 'normal'], [600, 'normal'], [700, 'normal'], [800, 'normal']].map(([w, st]) => `@font-face{font-family:'EB Garamond';font-weight:${w};font-style:${st};src:url('file://${path.join(FONTS, `eb-garamond-latin-${w}-${st}.woff2`)}') format('woff2'),url('file://${path.join(FONTS, `eb-garamond-latin-ext-${w}-${st}.woff2`)}') format('woff2');}`).join('\n'); await pg.addStyleTag({ content: css }); await pg.evaluate(() => document.fonts.ready); };

dire('C13 · la réactivation construite, le cas chargé (Paul 25/10 09:14 : titres longs, notions, travail long) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex'));
/* 1 · une heure réelle jouée et close sur le faux hub (le geste d'E4, RC10) : « Lancer », 14 ▶, la fin de l'heure (7 étapes), « Clore » → le paquet C/heures/<clé> ; puis le vrai constructeur d'E4 rend la diapo de l'heure 2 */
const p = (pg, ms) => pg.waitForTimeout(ms);
const clore = async (pg, quand) => { await pg.clock.setFixedTime(new Date(quand)); await p(pg, 2500); if (await pg.$('#al-aller:visible')) { await pg.click('#al-aller').catch(() => {}); await p(pg, 1500); } if (await pg.$('#garde-cahier.on')) { const ya = pg.locator('#garde-cahier.on :is(button,[onclick])', { hasText: /Y aller/ }).first(); if (await ya.count()) { await ya.click().catch(() => {}); await p(pg, 1200); } }
  for (let n = 1; n <= 7; n++) { const t = await pg.evaluate(() => (document.querySelector('.pp-tete') || {}).innerText || ''); if (/étape 7 sur 7/.test(t)) break; const b = await pg.$('#f-suivante:not([disabled])'); if (!b) break; await b.click().catch(() => {}); await p(pg, 700); }
  await pg.locator('#f-clore:visible').first().click().catch(() => {}); await p(pg, 1200); if (await pg.$('#gclore-oui:visible')) { await pg.click('#gclore-oui'); await p(pg, 1500); } return pg.evaluate(() => !!S.close); };
let ecran = null;
await CAS('R0', 'une heure jouée et close, puis la diapo construite par dr_reactivationConstruire(2)', async () => {
  const o = await ouvrir(1366, 768, false); const pg = o.pg; PGC = pg; await lancer(pg); await dev(pg, +(process.env.MJPC_DEV || 14)); await p(pg, 400);
  const close = await clore(pg, '2026-09-14T09:47:30+02:00'); verif('R0', close, 'l\'heure 1 est close (S.close)', String(close));
  const r = await pg.evaluate(() => new Promise(res => dr_reactivationPreparer(() => { let e = null; try { e = dr_reactivationConstruire(2); } catch (x) { e = { err: x.message }; } res({ e, raison: DR_REACT_RAISON }); })));
  ecran = r.e && r.e.blocs ? JSON.parse(JSON.stringify(r.e)) : null;
  verif('R0', !!ecran, 'la diapo construite existe (quatre blocs au plus)', ecran ? ecran.eid + ' · ' + ecran.blocs.map(b => '« ' + b.txt + ' » ' + b.el.length + ' l.').join(' · ') : JSON.stringify(r).slice(0, 200));
  if (ecran) ecran.blocs.forEach(b => b.el.forEach(l => dire('      ' + b.txt + ' : ' + l + ' (' + l.length + ' signes)')));
  await fin('R0', o); });
/* 2 · cette diapo, rendue par le même `rendre` dans #mur2 de la page tableau (= la fenêtre « Écran 2 », retour 12), à 1366 et 1920 */
if (ecran) for (const [w, h] of [[1366, 768], [1920, 1080]]) {
  await CAS('R-' + w, 'la diapo construite au tableau, ' + w + ' × ' + h, async () => {
    const ctx = await nav.newContext({ viewport: { width: w, height: h }, timezoneId: 'Europe/Paris' }); const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
    await ctx.route(u => !String(u).startsWith('file:'), r => r.abort()); await pg.addInitScript(fauxHub, hubStore()); await pg.goto(URL0 + '?vue=tableau&local=1&n=3e', { waitUntil: 'load' }); await police(pg); await pg.waitForFunction(() => !!document.getElementById('mur2'), null, { timeout: 15000 }); await p(pg, 600);
    const m = await pg.evaluate(e => { const att = document.getElementById('ses-tab-att'); if (att) att.style.display = 'none'; const mur = document.getElementById('mur2'); DR_TAB.si = 0; DR_TAB.ecrans = [e]; const ec = dr_seances()[0].ecrans[0]; mur._p8 = {}; const et = { si: 0, di: 0, nDev: elements(ec).length, lum: [], ecr: [], taille: 1, page: 0, reps: {}, tailles: {}, textes: {}, fsBloc: {}, pilote: false }; mur.classList.add('mur'); mur.classList.add('tableau'); rendre(mur, et); rendre(mur, et); const c = mur.querySelector('.corpsd'); const H = mur.clientHeight; const px = c ? parseFloat(c.style.fontSize) : null; return { mur: mur.clientWidth + '×' + H, policePt: px ? Math.round(px / (H * 0.056) * 32 * 10) / 10 : null, pages: et.pages ? et.pages.length : 1, lignes: c.querySelectorAll('li').length, titres: c.querySelectorAll('.bloc-t, .tt, b.t, .txt-t').length }; }, ecran);
    const nTot = await pg.evaluate(() => elements(dr_seances()[0].ecrans[0]).length);
    const capPrec = async (pg, w, k) => { const r = await pg.evaluate(k => { const mur = document.getElementById('mur2'); const ec = dr_seances()[0].ecrans[0]; const et = { si: 0, di: 0, nDev: k, lum: [], ecr: [], taille: 1, page: 0, reps: {}, tailles: {}, textes: {}, fsBloc: {}, pilote: false }; rendre(mur, et); rendre(mur, et); return (et.page || 0) + 1; }, k); await p(pg, 150); await cap(pg, 'R-' + w + '-dev' + k + '-page' + r + '-pleine'); dire('    page ' + r + ' pleine à ' + k + ' dévoilés (capture)'); };
    let dernierePage = 0; for (let k = 1; k <= nTot; k++) { const r = await pg.evaluate(k => { const mur = document.getElementById('mur2'); const ec = dr_seances()[0].ecrans[0]; const et = { si: 0, di: 0, nDev: k, lum: [], ecr: [], taille: 1, page: 0, reps: {}, tailles: {}, textes: {}, fsBloc: {}, pilote: false }; rendre(mur, et); rendre(mur, et); const c = mur.querySelector('.corpsd'); const vis = Array.from(c.querySelectorAll('li')).filter(l => l.getBoundingClientRect().height > 0 && getComputedStyle(l).opacity !== '0').length; return { page: (et.page || 0) + 1, pages: et.pages ? et.pages.length : 1, vis, compteur: ((mur.querySelector('.page') || {}).textContent || '').trim() }; }, k); await p(pg, 120); if (r.page !== dernierePage) { if (k > 1) await capPrec(pg, w, k - 1); dernierePage = r.page; await pg.evaluate(k => { const mur = document.getElementById('mur2'); const et = { si: 0, di: 0, nDev: k, lum: [], ecr: [], taille: 1, page: 0, reps: {}, tailles: {}, textes: {}, fsBloc: {}, pilote: false }; rendre(mur, et); rendre(mur, et); return (et.page || 0) + 1; }, k); await p(pg, 150); await cap(pg, 'R-' + w + '-dev' + k + '-page' + r.page + '-debut'); } if (k === nTot) await cap(pg, 'R-' + w + '-dev' + k + '-page' + r.page); if (k === nTot || r.page !== (k > 1 ? dernierePage : 0)) dire('    ' + k + ' dévoilés sur ' + nTot + ' : page ' + r.page + ' / ' + r.pages + ', ' + r.vis + ' lignes visibles' + (r.compteur ? ', compteur « ' + r.compteur + ' »' : '')); }
    const total = ecran.blocs.length + ecran.blocs.reduce((t, b) => t + b.el.length, 0);
    dire('    au tableau (' + m.mur + ') : ' + total + ' lignes titres compris (' + m.lignes + ' li) · police ' + m.policePt + ' pt · ' + m.pages + ' page(s)');
    dire('    verdict : ' + m.pages + ' page(s), police ' + m.policePt + ' pt (le site pagine, rien n\'est refusé)');
    verif('R-' + w, !errs.length, 'aucune erreur JS dans la page tableau', errs.join(' ; ') || undefined); await ctx.close(); });
}
await nav.close();
dire(''); dire('mesure sur pièce : ' + nb + ' vérifications, ' + echecs + ' échec(s)');
if (SORTIE) fs.writeFileSync(SORTIE, R.join('\n') + '\n');

// usage : MJPC_HUB=AUDITS/INTEGRATION-DEROULE/hub node banc-1228.mjs <assemble/index.html> [sortie.txt]
//   MJPC_TAILLES (défaut les quatre), MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres (1707 × 743 et 1920 × 1080). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1228.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..', '..');
const HUB = path.resolve(process.env.MJPC_HUB || path.join(RACINE, 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1707x743,1920x1080').split(',').map(t => t.split('x').map(Number));
const CAPT = process.env.MJPC_CAPT || null; const SUFF = process.env.MJPC_CAPT_SUFFIXE || 'apres'; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const AIDE = path.join(RACINE, 'MANDATS', 'CINQ-DETTES', 'AIDE-PAR-ECRAN.md');
const URL0 = 'file://' + FICHIER; const MD5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const HORLOGE = new Date('2026-09-14T09:00:00+02:00');
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && detail !== '' ? ' — ' + detail : '')); return !!ok; };
const info = (k, quoi) => dire('  info   ' + k + ' · ' + quoi);
const p = (pg, ms) => pg.waitForTimeout(ms);
/* MJPC_CAS=29,41 : ne jouer que ces cas (39, 41 — avec 40 et 43 —, 43, 46, 29, R, 42) */
const SEUL = process.env.MJPC_CAS ? process.env.MJPC_CAS.split(',') : null; const fait = k => !SEUL || SEUL.includes(k);

/* ── le faux hub (celui de banc-1227), plus la classe « 3 DYLAN Bob » appariée à ses six cases (mission 0, M1) ── */
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {}
  if (!st.classes['3 DYLAN Bob']) { st.classes['3 DYLAN Bob'] = { nom: '3 DYLAN Bob', niveau: '3e', archivee: false, eleves: JSON.parse(JSON.stringify((st.classes['CLASSE TEST'] || {}).eleves || [])) };
    ((st.site.edt.grille['2026-2027'] || {}).creneaux || []).forEach(x => { if (x.classe === '3 DYLAN Bob' && !x.classeMjpc) x.classeMjpc = '3 DYLAN Bob'; }); }
  st.classes['3_franklin_aretha'] = { nom: '3 FRANKLIN Aretha', niveau: '3e', annee: '2026-2027', archivee: false, eleves: JSON.parse(JSON.stringify((st.classes['CLASSE TEST'] || {}).eleves || [])) };
  ((st.site.edt.grille['2026-2027'] || {}).creneaux || []).forEach(x => { if (x.classe === '3 FRANKLIN Aretha') x.classeMjpc = ''; });
  return st; };
const fauxHub = s => { let sv = null; try { sv = localStorage.getItem('__E3HUB28'); } catch (e) {} window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = []; const garder = () => { try { localStorage.setItem('__E3HUB28', JSON.stringify(window.__HUB)); } catch (e) {} };
  /* le hub vit dans localStorage : deux onglets d'un même navigateur (un même contexte) lisent le même hub, comme le vrai */
  const lire = c => { try { const sv2 = localStorage.getItem('__E3HUB28'); if (sv2) window.__HUB = JSON.parse(sv2); } catch (e) {} const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { try { const sv2 = localStorage.getItem('__E3HUB28'); if (sv2) window.__HUB = JSON.parse(sv2); } catch (e) {} const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; garder(); };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrirCtx = async (W, H) => { const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort()); await ctx.addInitScript(fauxHub, hubStore());
  ctx.on('page', q => { q.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); q.on('dialog', d => { if (d.type() === 'beforeunload') { q.__beforeunload = (q.__beforeunload || 0) + 1; d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(HORLOGE); return { ctx, pg, errs, boites }; };
const entrerProf = async pg => { await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg); };
const edtOuvert = pg => pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0); });

const OUT = process.env.OUT;
const { ctx, pg, errs } = await ouvrirCtx(1707, 743);
await pg.clock.setFixedTime(new Date('2026-10-27T08:30:00+01:00'));
await entrerProf(pg);
console.log('mode test =', await pg.evaluate(() => m8TestOn()));
// 1 · relier « 3 FRANKLIN Aretha » par le menu du panneau prof (Emploi du temps)
await pg.evaluate(() => { try { openProfPanel(); } catch (e) {} try { showProfSection('edt'); } catch (e) {} }); await p(pg, 2500);
const sel = await pg.evaluate(() => { const s = Array.from(document.querySelectorAll('.edt-ap')).find(d => /3 FRANKLIN Aretha/.test(d.innerText)); if (!s) return 'menu introuvable'; const m = s.querySelector('select'); const opts = Array.from(m.options).map(o => o.value); m.value = '3 FRANKLIN Aretha'; m.dispatchEvent(new Event('change', { bubbles: true })); return opts; });
console.log('menu, valeurs :', JSON.stringify(sel)); await p(pg, 2500);
const relie = await pg.evaluate(() => new Promise(r => _siteGet('/site/edt/grille/2026-2027/creneaux', v => r((v || []).filter(c => c && c.classe === '3 FRANKLIN Aretha').map(c => c.classeMjpc)))));
console.log('relié à :', JSON.stringify(relie));
await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} try { goHome(); } catch (e) {} }); await p(pg, 800);
// 2 · publier « Poésie et peinture » pour la classe, page du niveau
for (let k = 0; k < 2; k++) { await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 2500); if (await pg.evaluate(() => document.getElementById('page-level').classList.contains('active'))) break; }
const pills = await pg.evaluate(() => Array.from(document.querySelectorAll('#page-level [onclick*="togglePublishChapterCls"]')).map(x => x.getAttribute('onclick').replace('event.stopPropagation();', '')));
console.log('pastilles :', JSON.stringify(pills));
const pub = await pg.evaluate(() => { const el = Array.from(document.querySelectorAll('#page-level [onclick*="togglePublishChapterCls"]')).find(x => /'0','3_franklin_aretha'/.test(x.getAttribute('onclick')) && x.offsetParent); if (!el) return 'introuvable'; el.click(); return 'cliquée'; }); await p(pg, 2500);
const publie = await pg.evaluate(() => new Promise(r => _siteGet('/site/3e/chapitres/0/published', v => r(v))));
console.log('publication :', pub, '→ au hub :', JSON.stringify(publie));
await pg.evaluate(() => { try { goHome(); } catch (e) {} }); await p(pg, 600);
// 3 · l'emploi du temps, semaine du 2/11
await pg.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pg, 1800); await pg.evaluate(() => { try { edtVue('semaine'); } catch (e) {} try { edtAller(1); } catch (e) {} }); await p(pg, 1500);
const r = await pg.evaluate(() => ({ cases: Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => /FRANKLIN|Charles/.test(e.innerText)).map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 100)), cartes: Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCarteClic"]')).map(e => e.innerText.replace(/\s+/g, ' ')), niveau: edtNiveauDe('3 FRANKLIN Aretha'), niveauParCle: edtNiveauDe('3_franklin_aretha'), pubPour: isPubFor((EDT_CHAP['3e'] || [])[0], '3 FRANKLIN Aretha') }));
console.log('EDT :', JSON.stringify(r, null, 1));
await pg.evaluate(() => { Array.from(document.querySelectorAll('body > *')).filter(e => /fiches d.applications ne sont pas à jour/.test(e.innerText || '') && !e.querySelector('#edt-ecran') && e.id !== 'edt-ecran').forEach(e => e.remove()); }); await p(pg, 400);
await pg.screenshot({ path: OUT + '/cle-edt.png' });
// 4 · la fenêtre de la case (les absents)
const ouvert = await pg.evaluate(() => { const e = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).find(e => /^\s*3 FRANKLIN Aretha/.test(e.innerText)); if (!e) return false; e.click(); return true; }); await p(pg, 1500);
const modale = await pg.evaluate(() => { const m = document.getElementById('edt-modale'); return m ? m.innerText.replace(/\s+/g, ' ').slice(0, 400) : null; });
console.log('case ouverte :', ouvert, '|', modale);
await pg.screenshot({ path: OUT + '/cle-case.png' });
console.log('erreurs', errs.length, errs.slice(0, 3));
await nav.close();

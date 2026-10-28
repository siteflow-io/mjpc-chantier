// E4 · LE BANC §12.46 PAR LE GESTE — le cahier de textes ne dit plus « par M. MENEY P. » (Paul 28/10 07:04, point 712).
// A97 : sur la diapo du cahier de textes, « Donné le … » sans « par M. MENEY P. » — dans l'Atelier, en répétition, en classe (l'heure lancée par la case) ;
//       rien d'autre ne change (la date reste, le travail reste) ; aucun « Meney » sur la diapo.
// usage : node banc-1246.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1246.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
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
/* MJPC_CAS=29,41 : ne jouer que ces cas (39, 41 — avec 40 et 43 —, 43, 46, 29, 30, R, 42, 51, 50, 49, 33, 32, 34, 35 ; 63 seulement s'il est nommé) */
const SEUL = process.env.MJPC_CAS ? process.env.MJPC_CAS.split(',') : null; const fait = k => !SEUL || SEUL.includes(k);

/* ── le faux hub (celui de banc-1227), plus la classe « 3 DYLAN Bob » appariée à ses six cases (mission 0, M1) ── */
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {}
  if (!st.classes['3 DYLAN Bob']) { st.classes['3 DYLAN Bob'] = { nom: '3 DYLAN Bob', niveau: '3e', archivee: false, eleves: JSON.parse(JSON.stringify((st.classes['CLASSE TEST'] || {}).eleves || [])) };
    ((st.site.edt.grille['2026-2027'] || {}).creneaux || []).forEach(x => { if (x.classe === '3 DYLAN Bob' && !x.classeMjpc) x.classeMjpc = '3 DYLAN Bob'; }); }
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
const ouvrirCtx = async (W, H, st, zoom) => { const z = zoom || 1; const ctx = await nav.newContext({ viewport: { width: Math.round(W / z), height: Math.round(H / z) }, deviceScaleFactor: z, timezoneId: 'Europe/Paris' });   /* zoom du navigateur z : la page voit W/z × H/z pixels CSS (comme Ctrl + / Ctrl -) */ const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort()); await ctx.addInitScript(fauxHub, st || hubStore());
  ctx.on('page', q => { q.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); q.on('dialog', d => { if (d.type() === 'beforeunload') { q.__beforeunload = (q.__beforeunload || 0) + 1; d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(HORLOGE);
  /* un second onglet lit le même hub : une page file:// neuve voit parfois un localStorage vide (3 fois sur 16 mesurées) — on lui donne le hub du premier à sa création */
  const np = ctx.newPage.bind(ctx); ctx.newPage = async () => { const q = await np(); const v = await pg.evaluate(() => localStorage.getItem('__E3HUB28')).catch(() => null); if (v) await q.addInitScript(x => { try { if (!localStorage.getItem('__E3HUB28')) localStorage.setItem('__E3HUB28', x); } catch (e) {} }, v); return q; };
  return { ctx, pg, errs, boites }; };
const entrerProf = async pg => { await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg); };
const edtOuvert = pg => pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0); });
/* lancer par la case de l'emploi du temps (la case des De Gaulle « heure 1/3 ») : « ▶ Ouvrir le pilotage et lancer » */
const lancerParLaCase = async pg => { if (!(await edtOuvert(pg))) { await pg.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pg, 1800); } await pg.evaluate(() => { try { edtVue('semaine'); } catch (e) {} }); await p(pg, 600);
  const ok = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => e.offsetParent && /Charles/.test(e.innerText)); const c = cs.find(e => /heure 1\//.test(e.innerText)) || cs[0]; if (!c) return false; c.click(); return true; }); await p(pg, 900);
  const l = ok && await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Ouvrir le pilotage et lancer/.test(b.innerText)); if (!b) return false; b.click(); return true; }); await p(pg, 3500); await sansVoiles(pg); await pg.keyboard.press('Escape'); await p(pg, 400);
  return !!l && await pg.evaluate(() => !!(window.S && S.lancee)); };
/* la répétition : depuis l'Atelier, « ▶ Jouer en avance » (§12.33 : la seule entrée) ; l'onglet « Pilotage » de l'Atelier, s'il existe encore (la ⑤) */
const entrerRepetition = async q => { await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(q, 1200);
  const j = await q.evaluate(() => { const b = document.getElementById('at-jouer'); if (!b || !b.offsetParent) return false; b.click(); return true; }); if (!j) await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(q, 1800); return q.evaluate(() => !!(window.S && S.repetition)); };
/* ouvrir le chapitre (le premier, ou celui dont le titre est donné) dans l'Atelier */
const ouvrirAtelier = async (q, titre) => { await q.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(q, 1200); await sansVoiles(q); if (await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await q.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(q, 900); await clicTexte(q, 'button', '← Mes chapitres'); await p(q, 900); }   /* l'Atelier rouvre le dernier chapitre : revenir à la liste */ await clicTexte(q, 'button,[onclick]', "atOnglet('chapitres')"); await p(q, 900);
  if (titre) { const ok = await q.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && Array.from(e.querySelectorAll('button,[onclick]')).some(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || ''))); const e = c[c.length - 1]; if (!e) return false; const b = Array.from(e.querySelectorAll('button,[onclick]')).find(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || '')); b.click(); return true; }, titre); if (!ok) return false; }
  else if (!(await clicTexte(q, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(q, 'button,[onclick]', 'Modifier');
  await p(q, 1800); await sansVoiles(q); await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(q, 1500); return q.evaluate(() => !!(window.S && S.atelier)); };
const dev = async (pg, n) => { for (let i = 0; i < n; i++) { await pg.click('#bdev').catch(() => {}); await p(pg, 120); } };
const OUT = SORTIE || '.'; fs.mkdirSync(OUT, { recursive: true });
/* la séance 1 du chapitre 3e : sa « Question-bilan » (heure 1, la dernière diapo avant le cahier de textes) déclarée de rôle bilan, comme Paul le fait dans « Ce que la diapo déclare » */
const stBilan = () => { const st = hubStore(); const ch = st.site['3e'].chapitres; const c0 = Array.isArray(ch) ? ch[0] : ch[Object.keys(ch)[0]]; const se = Array.isArray(c0.seances) ? c0.seances[0] : c0.seances['0']; const E = se.deroule.ecrans; const k = E.map(e => e.act).indexOf('Question-bilan'); E[k].role = 'bilan'; /* la classe proposée à 9 h (3 DYLAN Bob, §12.38 (1) pas encore codé) reçoit, dans ce banc, la liste d'une vraie classe — chez E3 elle porte celle de « CLASSE TEST », et le banc ne verrait rien */ if (st.classes['3 DYLAN Bob'] && st.classes['3E Charles de Gaulle']) st.classes['3 DYLAN Bob'].eleves = JSON.parse(JSON.stringify(st.classes['3E Charles de Gaulle'].eleves)); return st; };
const aller = async (q, titre) => { const ok = await q.evaluate(t => { const E = seance().ecrans; const i = E.findIndex(e => e.act === t || e.role === t); if (i < 0) return -1; const v = document.querySelector('#volet .vig[data-i="' + i + '"]') || document.querySelector('[data-at-di="' + i + '"]'); if (v && v.offsetParent) v.click(); else { S.di = i; dr_tout(); } return i; }, titre); await p(q, 700); await q.evaluate(() => { const g = document.getElementById('garde'); if (g && g.classList.contains('on')) document.getElementById('garde-devant').click(); }); await p(q, 500);
  await q.evaluate(() => { const d = etatDiapo(); const n = elements(ecran()).length; while (d.nDev < n) { const b = document.getElementById('bdev'); if (!b) break; const av = d.nDev; b.click(); if (etatDiapo().nDev === av) break; } }).catch(() => {}); await p(q, 500); return ok; };
const TEST = ['DURAND Alice', 'BERNARD Emma', 'PETIT Thomas', 'ROBERT Chloé'];
const VRAIS = (() => { const c = JSON.parse(fs.readFileSync(path.join(HUB, 'classes.json'), 'utf8')); const out = new Set(); Object.entries(c).forEach(([k, v]) => { if (k === 'CLASSE TEST') return; (v.eleves || []).forEach(e => { const n = typeof e === 'string' ? e : (e.nomComplet || ''); if (/^[A-ZÉÈ][A-ZÉÈ' -]+ [A-ZÉÈ][a-zéèëïîôç-]+/.test(n)) out.add(n); }); }); return [...out]; })();
const lireMur = async pg => { await pg.evaluate(() => { const o = document.querySelector('#mur [data-onglet="travail"]'); if (o) o.click(); }); await p(pg, 500); return lireMur0(pg); };
const lireMur0 = pg => pg.evaluate(() => { const m = document.getElementById('mur'); const t = (m && m.innerText) || ''; const d = document.querySelector('#mur .ed-donne'); return { fin: ecran().role === 'fin', donne: d ? d.innerText.replace(/\s+/g, ' ').trim() : null, meney: /meney/i.test(t), travail: /Travail à faire/.test(t) }; });
const devoiler = async pg => { for (let k = 0; k < 6; k++) { await pg.evaluate(() => { const d = etatDiapo(); const n = elements(ecran()).length; if (d.nDev < n) { const b = document.getElementById('bdev'); if (b) b.click(); } }); await p(pg, 300); } };
const allerFin = async pg => { const i = await pg.evaluate(() => seance().ecrans.findIndex(e => e.role === 'fin')); await pg.evaluate(i => { const d = document.querySelector('#at-arbre [data-at-di="' + i + '"]') || document.querySelector('#volet .vig[data-i="' + i + '"]'); if (d && d.offsetParent) d.click(); else { S.di = i; dr_tout(); } }, i); await p(pg, 900); await pg.evaluate(() => { const g = document.getElementById('garde'); if (g && g.classList.contains('on')) document.getElementById('garde-devant').click(); }); await p(pg, 400); return i; };
const juger = (k, ou, r) => verif('A97', r.fin && r.donne && /^Donné le \S/.test(r.donne) && !/par\b/.test(r.donne) && !r.meney && r.travail, ou + ' : « ' + (r.donne || '—') + ' » — la date sans « par M. MENEY P. », le travail à faire reste', JSON.stringify(r));
{ const { ctx, pg, errs } = await ouvrirCtx(1707, 743, stBilan()); await entrerProf(pg); await ouvrirAtelier(pg); await p(pg, 1200);
  await allerFin(pg); const a = await lireMur(pg); if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A97-1707-' + SUFF + '-atelier.png') }); juger('A97', 'dans l’Atelier', a);
  const rep = await entrerRepetition(pg); await p(pg, 900); await allerFin(pg); await devoiler(pg); const r = await lireMur(pg); if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A97-1707-' + SUFF + '-repetition.png') }); juger('A97', 'en répétition', Object.assign(r, { rep }));
  await pg.evaluate(() => { const b = document.getElementById('rep-stop'); if (b) b.click(); }); await p(pg, 600);
  verif('A97', errs.length === 0, 'zéro erreur JS (Atelier, répétition)', JSON.stringify(errs.slice(0, 3))); await ctx.close(); }
{ const { ctx, pg, errs } = await ouvrirCtx(1707, 743, stBilan()); await entrerProf(pg); const l = await lancerParLaCase(pg); await p(pg, 1200);
  await allerFin(pg); await devoiler(pg); const c = await lireMur(pg); if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A97-1707-' + SUFF + '-classe.png') }); juger('A97', 'en classe (l’heure lancée par la case)', Object.assign(c, { lancee: l }));
  verif('A97', errs.length === 0, 'zéro erreur JS (classe)', JSON.stringify(errs.slice(0, 3))); await ctx.close(); }
await nav.close();
dire(`— fin : ${nb} vérifications · ${echecs} échec(s) — ${echecs ? 'ROUGE' : 'VERT'} · ${path.basename(FICHIER)} md5 ${MD5}`);
fs.writeFileSync(path.join(OUT, 'banc-1246.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);

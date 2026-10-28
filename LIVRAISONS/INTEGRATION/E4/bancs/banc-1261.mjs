// E4 · LE BANC §12.61 (1) PAR LE GESTE — la suite de la phrase de fin d'heure, mot pour mot comme dans la ③ (A107). De Gaulle, mode test, le chapitre réaliste.
// T-5 par le geste « ⏩ aller à 5 minutes de la fin » : « Le cahier de textes attend — … » ; l'heure du cahier : « Va au cahier de textes : l'heure court (09:52). » ; la ligne ne se redessine pas au repos.
// usage : node banc-1261.mjs <assemble/index.html> [sortie] (MJPC_CAPT, MJPC_CAPT_SUFFIXE).
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1261.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
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
const JSONCH = JSON.parse(fs.readFileSync(path.join(ici, '..', 'prompt', 'chapitre-3e-au-contrat.json'), 'utf8'));
/* le JSON date du 22/10 ; la règle « À mettre dans le bilan » ≤ 45 signes (§12.34 (7), 27/10) refuse une ligne de 46 signes (séance 2) :
   pour ce banc seulement, les lignes trop longues sont coupées à leur deux-points (« le registre lyrique »). Rien d'autre ne change. */
JSONCH.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => { if (e.role === 'bilan' && e.blocs && e.blocs[1] && Array.isArray(e.blocs[1].el)) e.blocs[1].el = e.blocs[1].el.map(l => (typeof l === 'string' && Array.from(l).length > 45) ? l.split(' : ')[0] : l); }));
/* ce que le chapitre demande à l'atelier : (séance, item) — les entrées `aLier` vers l'atelier et les feuilles nommées par un bloc `fiche` */
const importer = async (pg, choix) => { await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && m.getBoundingClientRect().height > 0 && Array.from(m.querySelectorAll('button')).find(x => /Plus tard|Annuler|Fermer|OK/.test(x.textContent)); if (b) b.click(); try { edtFermer(); } catch (e) {} }); await p(pg, 600);
  await pg.evaluate(() => { try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1000); await sansVoiles(pg);
  await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.at-porte-ch')).find(x => x.offsetParent !== null); if (b) b.click(); }); await p(pg, 1500);
  if (!(await pg.evaluate(() => { const c = document.getElementById('ch-coller'); return !!(c && c.offsetParent); }))) return { cree: false, msg: '« Nouveau chapitre » ne s’ouvre pas' };
  await pg.fill('#ch-coller', JSON.stringify(JSONCH)); await p(pg, 300); await clicTexte(pg, 'button', 'Vérifier'); await p(pg, 1800);
  const boutons = await pg.evaluate(() => Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent && /Créer|double|Remplacer|Compléter/.test(b.innerText)).map(b => b.innerText.trim()));
  const e0 = await pg.evaluate(() => window.__ECR.length);
  const cree = await pg.evaluate(re => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && new RegExp(re).test(b.innerText)); if (!b) return false; b.click(); return true; }, choix); await p(pg, 1500);
  await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && m.getBoundingClientRect().height > 0 && Array.from(m.querySelectorAll('button')).filter(x => /Créer|double|Remplacer|Compléter/.test(x.textContent)).pop(); if (b) b.click(); }); 
  /* le compte rendu : dans « Nouveau chapitre », ou dans la fenêtre qui le garde si la liste a été redessinée ; « régénérer la feuille sommaire ? » : « Plus tard » */
  let msg = '', ou = '';
  for (let k = 0; k < 80 && !msg; k++) { await p(pg, 500);
    const r = await pg.evaluate(() => { const re = /Feuilles et liaisons|ne se relit pas/; const m = document.getElementById('ch-msg'); if (m && re.test(m.innerText || '')) return { msg: m.innerText.trim(), ou: 'ch-msg' };
      const md = document.getElementById('at-modale'); if (md && re.test(md.innerText || '')) { const t = md.innerText.trim(); const b = Array.from(md.querySelectorAll('button')).find(x => /Compris/.test(x.textContent)); if (b) b.click(); return { msg: t, ou: 'fenêtre' }; }
      if (md && /régénérer la feuille sommaire/.test(md.innerText || '')) { const b = Array.from(md.querySelectorAll('button')).find(x => /Plus tard/.test(x.textContent)); if (b) b.click(); } return null; });
    if (r) { msg = r.msg; ou = r.ou; } }
  await p(pg, 1500);
  if (!msg) info('A93', 'pas de compte rendu : ' + JSON.stringify(await pg.evaluate(() => ({ chmsg: (document.getElementById('ch-msg') || {}).innerText || null, modale: (document.getElementById('at-modale') || {}).innerText || null, ecr: window.__ECR.slice(-6) }))));
  const ecr = await pg.evaluate(n => window.__ECR.slice(n), e0);
  return { boutons, cree, msg, ecr, ou }; };

/* le chapitre réaliste, plus (pour la mesure seulement) un schéma, une fiche, une vidéo et une page posés sur des diapos de la séance 1, heure 1 */
{ const E = JSONCH.chapitre.seances[0].deroule.ecrans; const sch = JSONCH.chapitre.seances[1].deroule.ecrans[12].blocs.find(b => b.t === 'schema'); const fi = JSON.parse(JSON.stringify(JSONCH.chapitre.seances[1].deroule.ecrans[20].blocs.find(b => b.t === 'fiche'))); fi.feuille = 'fiche-methode-image';
  const nv = (act, bloc) => ({ act, dur: 2, comp: [], remob: [], heure: 1, actId: 'a2', blocs: [bloc] }); E.splice(2, 0, nv('Un schéma', JSON.parse(JSON.stringify(sch))), nv('Une fiche', fi), nv('Une vidéo', { t: 'video', txt: 'Le voyageur, filmé', fichier: 'voyageur.mp4', duree: 60, reperes: [{ t: 10, l: 'Le regard' }] }), nv('Une page', { t: 'page', txt: 'Une page web', src: 'https://exemple-de-page.fr/page.html' })); const hy = E.find(e => e.act === 'Les hypothèses de la classe'); if (hy) hy.dur -= 8; }

const capt = async (pg, n) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A107-' + SUFF + '-' + n + '.png') }).catch(() => {}); };
const allerDi = async (pg, di) => { await pg.evaluate(i => { S.di = i; S.page = null; dr_tout(); }, di); await p(pg, 400); await pg.evaluate(() => { const g = document.getElementById('garde'); if (g && g.classList.contains('on')) document.getElementById('garde-devant').click(); }); await pg.evaluate(() => { const d = etatDiapo(); d.nDev = elements(ecran()).length; dr_tout(); }); await p(pg, 500); };
const taper = (pg, sel, mot) => pg.evaluate(({ sel, mot }) => { const el = document.querySelector(sel); if (!el) return null; el.setAttribute('contenteditable', el.getAttribute('contenteditable') || 'plaintext-only'); if (!el.isContentEditable) return 'non éditable'; const av = el.textContent; el.focus(); const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand('insertText', false, mot); el.blur(); return av; }, { sel, mot });
const editable = (pg, sel) => pg.evaluate(sel => { const el = document.querySelector(sel); return el ? { ce: el.getAttribute('contenteditable'), titre: el.title || '' } : null; }, sel);
const clicDroit = async (pg, sel, centre) => { const r = await pg.evaluate(({ sel, centre }) => { const el = document.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect(); return centre ? [b.left + b.width / 2, b.top + b.height / 2] : [b.left + Math.min(20, b.width / 2), b.top + Math.min(12, b.height / 2)]; }, { sel, centre }); if (!r) return null; await pg.mouse.click(r[0], r[1], { button: 'right' }); await p(pg, 400); return pg.evaluate(() => Array.from(document.querySelectorAll('#menu.on button')).map(b => b.innerText.trim())); };
const choisir = async (pg, lib) => { const ok = await pg.evaluate(l => { const b = Array.from(document.querySelectorAll('#menu.on button')).find(x => x.innerText.trim().indexOf(l) === 0 && !x.disabled); if (!b) return false; b.click(); return true; }, lib); await p(pg, 700); return ok; };
const tabTexte = async tab => tab ? tab.evaluate(() => document.body.textContent).catch(() => '') : '';   /* textContent : l'étiquette est en capitales par le style */
const tabRetire = async (tab, sel) => tab ? tab.evaluate(sel => { const el = document.querySelector(sel); return el ? { cls: el.className, vis: getComputedStyle(el).visibility } : null; }, sel).catch(() => null) : null;
{ const { ctx, pg, errs } = await ouvrirCtx(1707, 743); await pg.clock.setFixedTime(new Date('2026-09-14T07:30:00+02:00').getTime()); await entrerProf(pg);
  const r = await importer(pg, 'Remplacer'); await pg.evaluate(() => { const m = document.getElementById('at-modale'); if (m) m.remove(); try { atelierFermer(true); } catch (e) {} });
  await pg.evaluate(() => { const b = document.getElementById('tprof-btn'); if (b) b.click(); }); await p(pg, 700); await pg.evaluate(() => { const b = document.getElementById('tprof-testpill'); if (b) b.click(); }); await p(pg, 400); await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} });
  const ecr0 = await pg.evaluate(() => (window.__ECR || []).length);
  const l = await lancerParLaCase(pg); await p(pg, 1200);
  verif('A107', l, 'l’heure 1 des De Gaulle lancée par sa case (mode test, chapitre réaliste)', JSON.stringify({ import: r.cree, lancee: l }));
  const ligne = () => pg.evaluate(() => { const L = Array.from(document.querySelectorAll('#dr-zone .dr-pp-act')).filter(x => !x.hidden && x.offsetParent); return L.map(x => x.textContent.trim()); });
  const avant = await ligne(); verif('A107', !avant.some(t => /cahier de textes/.test(t)), 'avant le T-5 : la phrase n’est pas dite', JSON.stringify(avant));
  /* le geste de §12.55 : « ⏩ aller à 5 minutes de la fin » */
  const g = await clicTexte(pg, 'button', '⏩ aller à 5 minutes de la fin'); await p(pg, 3500);
  const t5 = await ligne(); const PH5 = 'Le cahier de textes attend — le tableau ne bouge pas tant que tu n\'y vas pas.';
  verif('A107', g && t5.length > 0 && t5.every(t => t.endsWith(PH5)) && t5.every(t => /^L'activité en cours : .+\. Le cahier/.test(t)), 'au T-5 : « L’activité en cours : … » puis, mot pour mot, « ' + PH5 + ' »', JSON.stringify({ geste: g, palier: await pg.evaluate(() => S.palier), lignes: t5 }));
  await capt(pg, '1-t5');
  /* la règle du redessin : la ligne ne se redessine pas quand rien ne change */
  const red = await pg.evaluate(async () => { const n = document.querySelector('#dr-zone .dr-pp-act:not([hidden])'); if (!n) return null; let m = 0; const o = new MutationObserver(r => { m += r.length; }); o.observe(n, { childList: true, subtree: true, characterData: true, attributes: true }); await new Promise(r => setTimeout(r, 3200)); o.disconnect(); return { meme: n.isConnected, mutations: m }; });
  verif('A107', red && red.meme && red.mutations === 0, 'au repos 3 s : la ligne reste le même nœud, aucune réécriture', JSON.stringify(red));
  /* le temps de la case court jusqu'à l'heure du cahier */
  const fin = await pg.evaluate(() => { const x = dr_heureDe(S.heure) || {}; DR_HC.saut += 5 * 60000; return x.fin || null; }); await p(pg, 3500);
  const z = await ligne(); const PHZ = 'Va au cahier de textes : l\'heure court (' + fin + ').';
  verif('A107', fin === '09:52' && z.length > 0 && z.every(t => t.endsWith(PHZ)) && !z.some(t => /attend —/.test(t)), 'à l’heure du cahier : mot pour mot « ' + PHZ + ' » (l’heure de la case)', JSON.stringify({ palier: await pg.evaluate(() => S.palier), lignes: z }));
  await capt(pg, '2-heure-du-cahier');
  const ecr = await pg.evaluate(n => (window.__ECR || []).slice(n).filter(x => !/presence/.test(x)), ecr0);
  verif('A107', !ecr.length, 'mode test : aucune écriture au hub', ecr.slice(0, 4).join(' · '));
  verif('A107', errs.length === 0, 'zéro erreur JS', JSON.stringify(errs.slice(0, 3))); await ctx.close(); }
await nav.close();
dire(`— fin : ${nb} vérifications · ${echecs} échec(s) — ${echecs ? 'ROUGE' : 'VERT'} · ${path.basename(FICHIER)} md5 ${MD5}`);
fs.writeFileSync(path.join(OUT, 'banc-1261.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);

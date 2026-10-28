// E4 · LE BANC §12.42 PAR LE GESTE — l'import crée les feuilles et fait les liaisons (registre 13 · 66).
// A93 : le chapitre réaliste (`E4/prompt/chapitre-3e-au-contrat.json`, l'instance du chapitre 3e mise au contrat : ses fiches avec `feuille`, sa liste `aLier`)
//       collé dans « Nouveau chapitre », « Vérifier », « Créer ce chapitre » : chaque feuille vers l'atelier existe (une par clé d'item, son titre, le contenu
//       que le chapitre en écrit — fiche : définition + texte —, rattachée à sa séance), s'ouvre (« Éditer » dans l'éditeur du chapitre) et s'imprime (« Imprimer ») ;
//       chaque item vers l'atelier est lié (source/ref/kind « atelier », le dépôt posé), s'ouvre depuis l'arborescence ; le compte rendu dit chaque outil
//       non lié avec sa raison, « déjà liée » pour l'externe, « sans contenu : à écrire » ; réinjecter (« Compléter », puis « Remplacer ») ne double rien.
// usage : node banc-1242.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres). Code 1 si un échec.
//   MJPC_TAILLES (défaut les quatre), MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres (1707 × 743 et 1920 × 1080). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1242.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
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
const capt = async (pg, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A93-' + nom + '-' + SUFF + '.png') }).catch(() => {}); };
const JSONCH = JSON.parse(fs.readFileSync(path.join(ici, '..', 'prompt', 'chapitre-3e-au-contrat.json'), 'utf8'));
/* le JSON date du 22/10 ; la règle « À mettre dans le bilan » ≤ 45 signes (§12.34 (7), 27/10) refuse une ligne de 46 signes (séance 2) :
   pour ce banc seulement, les lignes trop longues sont coupées à leur deux-points (« le registre lyrique »). Rien d'autre ne change. */
JSONCH.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => { if (e.role === 'bilan' && e.blocs && e.blocs[1] && Array.isArray(e.blocs[1].el)) e.blocs[1].el = e.blocs[1].el.map(l => (typeof l === 'string' && Array.from(l).length > 45) ? l.split(' : ')[0] : l); }));
/* ce que le chapitre demande à l'atelier : (séance, item) — les entrées `aLier` vers l'atelier et les feuilles nommées par un bloc `fiche` */
const DEM = (() => { const vu = new Set(), out = []; const poser = (s, i, o) => { const k = s + '|' + i; if (vu.has(k)) return; vu.add(k); out.push({ s, i, o }); };
  JSONCH.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => (e.blocs || []).forEach(b => { if (b.t === 'fiche' && b.feuille) poser(se.cle, b.feuille, 'atelier'); })));
  JSONCH.aLier.forEach(a => poser(a.seance_cle, a.item, a.outil)); return out; })();
const AT_DEM = DEM.filter(d => d.o === 'atelier'); const AUTRES = DEM.filter(d => d.o !== 'atelier' && d.o !== 'externe'); const EXT = DEM.filter(d => d.o === 'externe');
const ITEMS = [...new Set(AT_DEM.map(d => d.i))];
const FICHES = {}; JSONCH.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => (e.blocs || []).forEach(b => { if (b.t === 'fiche' && b.feuille) (FICHES[b.feuille] = FICHES[b.feuille] || []).push(b); })));
info('A93', `le chapitre : ${DEM.length} demandes · ${AT_DEM.length} vers l'atelier (${ITEMS.length} feuilles, ${Object.keys(FICHES).length} avec un contenu écrit) · ${AUTRES.length} vers d'autres outils · ${EXT.length} externe`);
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
const etat = pg => pg.evaluate(() => { const docs = window.__hubLire('/site/atelier/documents') || {}; const c = window.__hubLire('/site/3e/chapitres') || {}; const L = (Array.isArray(c) ? c.map((x, i) => [String(i), x]) : Object.entries(c)).filter(x => x[1]);
  return { docs: Object.fromEntries(Object.entries(docs).filter(([k]) => k.indexOf('feuille_ch_') === 0)), chaps: L.map(([k, x]) => ({ k, title: x.title, uid: x.uid || '', seances: x.seances })) }; });
const seancesDe = ch => { const s = ch.seances || {}; return (Array.isArray(s) ? s.map((x, i) => [String(i), x]) : Object.entries(s)).filter(x => x[1]); };
const verifierLiaisons = (Z, et, chap) => { const ids = {}; let bons = 0; const faux = [];
  AT_DEM.forEach(d => { const se = seancesDe(chap).find(([, x]) => x.cle === d.s); const it = se && (se[1].items || {})[d.i]; const doc = it && et.docs[it.ref];
    if (it && it.source === 'atelier' && it.kind === 'atelier' && doc && (!ids[d.i] || ids[d.i] === it.ref)) { ids[d.i] = it.ref; bons++; } else faux.push(d.s + '/' + d.i + ' → ' + JSON.stringify(it ? { source: it.source, ref: it.ref, kind: it.kind } : null)); });
  return { bons, faux, ids }; };
const W = 1707, H = 743;
/* le faux hub a déjà ce chapitre, importé (« … (proposition) ») : il est renommé « Chapitre témoin » — l'injection est celle d'un chapitre neuf (relance 07:00 (1)) */
const stA93 = () => { const st = hubStore(); Object.values(st.site['3e'].chapitres).forEach(c => { if (c && c.title && c.title.indexOf(JSONCH.chapitre.title) === 0) c.title = 'Chapitre témoin'; }); return st; };
{ const { ctx, pg, errs, boites } = await ouvrirCtx(W, H, stA93()); await entrerProf(pg);
  const av = await etat(pg);
  /* ── 1. l'injection : « Créer ce chapitre » (aucun chapitre de ce titre) ── */
  const r1 = await importer(pg, 'Créer ce chapitre'); await pg.evaluate(() => { const m = document.getElementById('ch-msg'); if (m) m.scrollIntoView({ block: 'start' }); }); await p(pg, 300); await capt(pg, '1-compte-rendu');
  const e1 = await etat(pg); const chap = e1.chaps.find(c => c.title === JSONCH.chapitre.title);
  verif('A93', r1.cree && !!chap && e1.chaps.length === av.chaps.length + 1, 'l’injection : « Créer ce chapitre » écrit le chapitre (un de plus au hub)', JSON.stringify({ boutons: r1.boutons, chapitres: e1.chaps.map(c => c.title) }));
  const nDocs = Object.keys(e1.docs).length;
  verif('A93', nDocs === ITEMS.length, 'les feuilles existent : une par clé d’item vers l’atelier (' + ITEMS.length + '), aucune de plus', nDocs + ' feuille(s) d’import au hub');
  if (chap) {
    const L = verifierLiaisons('1', e1, chap);
    verif('A93', L.bons === AT_DEM.length && !L.faux.length, 'chaque item vers l’atelier est lié (source, ref, kind « atelier »), la même clé d’item à la même feuille (' + AT_DEM.length + ')', L.bons + '/' + AT_DEM.length + (L.faux.length ? ' · ' + L.faux.slice(0, 4).join(' ; ') : ''));
    const premiere = i => seancesDe(chap).filter(([, x]) => (x.items || {})[i] && AT_DEM.some(d => d.i === i && d.s === x.cle)).sort((a, b) => (a[1].ordre || 0) - (b[1].ordre || 0))[0];
    const titresOk = ITEMS.filter(i => { const d = e1.docs[L.ids[i]]; const se = premiere(i); return d && se && d.titre === se[1].items[i].title && d.valeurs && d.valeurs.titre && d.valeurs.titre.texte === d.titre; });
    verif('A93', titresOk.length === ITEMS.length, 'chaque feuille porte le titre de son item', titresOk.length + '/' + ITEMS.length);
    const contOk = ITEMS.filter(i => { const d = e1.docs[L.ids[i]]; if (!d) return false; const C = d.contenu || []; const f = FICHES[i] || [];
      if (!f.length) return C.length === 0; const defs = C.filter(b => b.id === 'definition'); const txt = C.filter(b => b.id === 'texte_libre');
      return d.cases.definition && d.cases.texte_libre && defs.length === f.length && f.every((b, k) => defs[k].valeurs.terme === b.titre && defs[k].valeurs.texte === b.def && txt[k] && txt[k].valeurs.texte.length > 20 && !/<[a-z]/i.test(txt[k].valeurs.texte)); });
    verif('A93', contOk.length === ITEMS.length, 'le contenu : ce que le chapitre écrit (fiche → définition + texte, sans balises), sinon rien d’inventé', contOk.length + '/' + ITEMS.length + ' · ' + Object.keys(FICHES).map(i => i + ' : ' + ((e1.docs[L.ids[i]] || {}).contenu || []).length + ' blocs').join(' · '));
    const rattOk = ITEMS.filter(i => { const d = e1.docs[L.ids[i]]; const r = d && d.rattachement; const dp = d && d.depot; return r && r.niveau === '3e' && String(r.chapitre) === chap.k && seancesDe(chap).some(([k, x]) => k === String(r.seance) && (x.items || {})[i]) && dp && dp.itemId === i; });
    if (rattOk.length !== ITEMS.length) info('A93', 'rattachement/dépôt : ' + JSON.stringify({ k: chap.k, r: (e1.docs[L.ids[ITEMS[0]]] || {}).rattachement, d: (e1.docs[L.ids[ITEMS[0]]] || {}).depot }));
    verif('A93', rattOk.length === ITEMS.length, 'chaque feuille est rattachée à sa séance (niveau, chapitre, séance) et porte son dépôt (la liaison)', rattOk.length + '/' + ITEMS.length);
    const m = r1.msg; const sansC = ITEMS.length - Object.keys(FICHES).length;
    const ditAutres = AUTRES.filter(d => { const se = seancesDe(chap).find(([, x]) => x.cle === d.s); const t = se && se[1].items[d.i] && se[1].items[d.i].title; return t && m.indexOf('« ' + t + ' » : non lié — ') >= 0; });
    verif('A93', ditAutres.length === AUTRES.length, 'le compte rendu dit chaque item d’un autre outil, non lié, avec sa raison (' + AUTRES.length + ')', ditAutres.length + '/' + AUTRES.length);
    verif('A93', (m.match(/sans contenu : à écrire/g) || []).length === sansC && (m.match(/avec le contenu du chapitre/g) || []).length === Object.keys(FICHES).length, 'le compte rendu : « sans contenu : à écrire » (' + sansC + '), « avec le contenu du chapitre » (' + Object.keys(FICHES).length + ')', (m.match(/sans contenu : à écrire/g) || []).length + ' · ' + (m.match(/avec le contenu du chapitre/g) || []).length);
    verif('A93', EXT.every(d => /déjà liée \(son adresse/.test(m)), 'le compte rendu : l’externe « déjà liée »', m.split('\n').filter(l => /Frise|frise/.test(l)).join(' | ').slice(0, 160));
    info('A93', 'le compte rendu : ' + m.replace(/\s+/g, ' ').slice(0, 700));
    /* ── 2. les feuilles s'ouvrent et s'impriment : « Éditer dans l'atelier » → « Éditer » sur l'item → l'éditeur de feuille, « 🖨 Imprimer » ── */
    for (const i of ['fiche-notion-propositions', 'fiche-methode-image']) { const d = e1.docs[L.ids[i]]; if (!d) { verif('A93', false, 'la feuille « ' + i + ' » s’ouvre', 'absente'); continue; }
      await pg.evaluate(() => { try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1200); await sansVoiles(pg); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900);
      const ok1 = await pg.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && (e.innerText || '').indexOf(t + ' (proposition)') < 0 && Array.from(e.querySelectorAll('button')).some(b => /Éditer dans l’atelier/.test(b.innerText))); const e = c[c.length - 1]; if (!e) return false; Array.from(e.querySelectorAll('button')).find(b => /Éditer dans l’atelier/.test(b.innerText)).click(); return true; }, JSONCH.chapitre.title); await p(pg, 1800); await sansVoiles(pg);
      await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); if (b && b.offsetParent) b.click(); }); await p(pg, 1000);
      const sk = seancesDe(chap).find(([, x]) => (x.items || {})[i])[0];
      const ok2 = await pg.evaluate(({ j, k }) => { const b = Array.from(document.querySelectorAll('button')).find(b => (b.getAttribute('onclick') || '') === "edEditerFeuille('" + j + "','" + k + "')"); if (!b) return false; b.scrollIntoView({ block: 'center' }); b.click(); return true; }, { j: sk, k: i }); await p(pg, 2200);
      const vu = await pg.evaluate(() => { const f = document.getElementById('at-apercu'); let t = ''; try { t = f.contentDocument.body.innerText; } catch (e) {} return { id: AT.docId, t: t.replace(/\s+/g, ' ').slice(0, 2000) }; });
      const attendu = [d.titre].concat((FICHES[i] || []).map(b => b.def));
      verif('A93', ok1 && ok2 && vu.id === L.ids[i] && attendu.every(x => vu.t.indexOf(x) >= 0), 'la feuille « ' + d.titre + ' » s’ouvre par le geste (« Éditer ») : son titre' + ((FICHES[i] || []).length ? ' et ses ' + FICHES[i].length + ' définitions' : '') + ' dans l’aperçu', JSON.stringify({ editeurChapitre: ok1, editer: ok2, doc: vu.id, apercu: vu.t.slice(0, 140) }));
      await capt(pg, '2-feuille-' + i);
      await pg.evaluate(() => { window.__IMP = 0; const f = document.getElementById('at-apercu'); const poser = () => { try { f.contentWindow.print = () => { window.__IMP++; }; } catch (e) {} }; poser(); const o = f.onload; f.addEventListener('load', poser); });
      const ok3 = await clicTexte(pg, 'button', '🖨 Imprimer'); await p(pg, 1500);
      const imp = await pg.evaluate(() => window.__IMP);
      verif('A93', ok3 && imp >= 1, 'la feuille « ' + d.titre + ' » s’imprime (« 🖨 Imprimer » : l’impression part)', JSON.stringify({ bouton: ok3, impressions: imp }));
    }
    /* ── 3. les items s'ouvrent : depuis l'arborescence du niveau, l'item lié ouvre sa feuille ── */
    { const i = 'fiche-versification'; const sks = seancesDe(chap).filter(([, x]) => (x.items || {})[i]).map(([k]) => k); const res = [];
      for (const sk of sks) { await pg.evaluate(() => { const v = document.getElementById('atdoc-viewer'); if (v) v.remove(); try { atelierFermer(true); } catch (e) {} }); await p(pg, 1200);
        await pg.evaluate(({ c, s, k }) => { try { openItem('3e', c, s, k); } catch (e) { window.__E4ERR = String(e); } }, { c: chap.k, s: sk, k: i }); await p(pg, 1500);
        res.push(await pg.evaluate(() => { const v = document.getElementById('atdoc-viewer'); return v ? (v.querySelector('.atdoc-viewer-titre') || {}).innerText || '?' : null; })); }
      const ts = sks.map(sk => seancesDe(chap).find(([k]) => k === sk)[1].items[i].title);
      verif('A93', sks.length === 2 && res.every((x, n) => x === ts[n]), 'l’item « ' + i + ' » (deux séances, une feuille) s’ouvre depuis chaque séance (openItem → la feuille)', JSON.stringify({ seances: sks, ouvert: res }));
      await capt(pg, '3-item-ouvert'); await pg.evaluate(() => { const v = document.getElementById('atdoc-viewer'); if (v) v.remove(); }); }
  }
  /* ── 4. réinjecter ne double rien : « Compléter », puis « Remplacer » ── */
  e1.docs = (await etat(pg)).docs;   /* l'état juste avant (l'ouverture dans l'éditeur a pu enregistrer la feuille) */
  for (const voie of ['Compléter', 'Remplacer']) {
    if (process.env.MJPC_SONDE) await pg.evaluate(() => { window.__S = []; const f = window.chFeuillesEtLiaisons; window.chFeuillesEtLiaisons = function (o, n, k, fin) { window.__S.push('appel ' + k); return f(o, n, k, function (cr) { window.__S.push('fin ' + cr.length); fin(cr); }); }; const g = window.chCompteRenduGarder; window.chCompteRenduGarder = function (t, ok) { window.__S.push('garder ' + !!document.getElementById('ch-msg') + ' ' + !!document.getElementById('at-modale')); return g(t, ok); }; const ci = window.chInjecterConfirme; window.chInjecterConfirme = function (v) { window.__S.push('confirme ' + v + ' ' + String(new Error().stack).split('\n').slice(2, 5).map(l => l.trim().slice(0, 50)).join(' | ')); return ci(v); }; const ai = window.atInfo; window.atInfo = function (m) { window.__S.push('atInfo ' + String(m).slice(0, 40)); return ai(m); }; });
    const r = await importer(pg, voie); if (process.env.MJPC_SONDE) info('SONDE', voie + ' ' + JSON.stringify(await pg.evaluate(() => window.__S))); const e2 = await etat(pg); await capt(pg, '4-reinjection-' + (voie === 'Compléter' ? 'completer' : 'remplacer'));
    const chap2 = e2.chaps.find(c => c.title === JSONCH.chapitre.title);
    const ecrDocs = (r.ecr || []).filter(x => / \/site\/atelier\/documents\/feuille_ch_[^/]+$/.test(x));
    const memes = Object.keys(e1.docs).every(k => e2.docs[k] && JSON.stringify(Object.assign({}, e2.docs[k], { depot: 0 })) === JSON.stringify(Object.assign({}, e1.docs[k], { depot: 0 })));
    if (!memes) info('A93', 'ce qui a changé dans les feuilles : ' + Object.keys(e1.docs).map(k => Object.keys(Object.assign({}, e1.docs[k], e2.docs[k] || {})).filter(c => c !== 'depot' && JSON.stringify((e1.docs[k] || {})[c]) !== JSON.stringify((e2.docs[k] || {})[c])).map(c => k.slice(-20) + '.' + c + ' : ' + JSON.stringify((e1.docs[k] || {})[c]).slice(0, 80) + ' → ' + JSON.stringify((e2.docs[k] || {})[c]).slice(0, 80))).flat().slice(0, 4).join(' ; '));
    verif('A93', r.cree && e2.chaps.length === e1.chaps.length && Object.keys(e2.docs).length === nDocs && !ecrDocs.length && memes, 'réinjecter (« ' + voie + ' ») ne double rien : ni chapitre, ni feuille ; aucune feuille réécrite', JSON.stringify({ boutons: r.boutons, chapitres: e2.chaps.length, feuilles: Object.keys(e2.docs).length, feuillesEcrites: ecrDocs.length, intactes: memes }));
    if (chap2) { const L2 = verifierLiaisons('2', e2, chap2); verif('A93', L2.bons === AT_DEM.length && Object.keys(L2.ids).every(i => L2.ids[i] === Object.keys(e1.docs).find(k => k.endsWith('_' + i.replace(/[^A-Za-z0-9_-]/g, '_')))), 'après « ' + voie + ' » : les items sont liés aux mêmes feuilles', L2.bons + '/' + AT_DEM.length + (L2.faux.length ? ' · ' + L2.faux.slice(0, 3).join(' ; ') : '')); }
    if (voie === 'Compléter') { const lier = (r.ecr || []).filter(x => /\/items\/[^/]+\/(ref|source|kind)$/.test(x)); verif('A93', !lier.length && /déjà là \(rien réécrit\)/.test(r.msg) && /déjà liée dans/.test(r.msg), 'après « Compléter » : aucune liaison reposée ; le compte rendu (' + r.ou + ') dit « déjà là », « déjà liée »', JSON.stringify({ liaisonsEcrites: lier.length, msg: r.msg.replace(/\s+/g, ' ').slice(0, 200) })); }
    e1.docs = e2.docs;
  }
  verif('A93', errs.length === 0 && !boites.length, 'zéro erreur JS, aucune boîte du navigateur', JSON.stringify({ errs: errs.slice(0, 3), boites: boites.slice(0, 3) }));
  await ctx.close(); }
await nav.close();
dire(`— fin : ${nb} vérifications · ${echecs} échec(s) — ${echecs ? 'ROUGE' : 'VERT'} · ${path.basename(FICHIER)} md5 ${MD5}`);
fs.writeFileSync(path.join(OUT, 'banc-1242.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);

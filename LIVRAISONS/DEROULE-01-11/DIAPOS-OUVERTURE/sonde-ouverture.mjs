// LA SONDE DES DIAPOS D'OUVERTURE AU CANON (C16, MANDATS/DEROULE-01-11/MANDAT-DIAPOS-OUVERTURE.md §6.1) — par le geste, sur le faux hub, horloge du 14/09.
// usage : node sonde-ouverture.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_CAPT=<dossier> : les captures, jamais poussées — le faux hub porte les initiales de la classe test)
// Les cas, chacun par le geste (clic, clavier) ; ce qui se lit est lu dans le DOM, au pilote ET dans la fenêtre du tableau (#mur2) :
//  A · mode test, 3E Charles de Gaulle, la case du 14/09 08:57 → l'heure 1 de la séance 1 : les cinq diapos dans l'ordre (C16 33) ; chaque ligne à la flèche,
//      ◀ revoile ; au pilote ce qui n'est pas dévoilé est pâle, au tableau absent ; la phrase d'élève (aucun intitulé officiel) ; les dates de la classe,
//      la séance du jour en or ; les couleurs du canon ; la mise en forme de Paul lisible sur le bleu nuit (contraste mesuré) ; le nom du rôle sous la vignette ;
//      aucune écriture au hub hors de /site/tableau_test — et ceci aux trois tailles (1366 × 768, 1536 × 864, 1920 × 1080), sans chevauchement ni texte coupé.
//  B · la séance 1 jouée par la classe : la case du 14/09 → la séance 2 : parcours, début de séance, problématique ; la séance 1 cochée, la 2 en or.
//  C · l'Atelier (le faux hub gardé d'un rechargement à l'autre) : la séance 2 (parcours, début, problématique) ; « selon la classe » ; le bilan du chapitre
//      à la dernière séance, juste avant son cahier de textes ; « À régler » : une ligne par champ manquant, qui ouvre la carte au bon champ ; la carte : l'objectif,
//      la majeure ★, « évaluée », l'image — la diapo, « À régler » et la feuille sommaire suivent ; « ta version » et « ↩ celle du chapitre » ; retirer, recharger.
//  D · un chapitre importé avec les nouveaux champs (« 📚 Nouveau chapitre » → Vérifier → Créer) : gardés au hub, montrés ; un champ faux refusé avec ses mots.
//  E · une copie de classe déjà jouée (écrite avant le canon) reprise : la diapo montrée ne change pas ; celle jamais montrée prend le canon.
// Code 1 si un échec. Aucune erreur JS, aucune boîte système, dans chaque cas.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture, MEDIAS } = await import(path.join(ici, 'hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-ouverture.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + (typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 600) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const TAX = JSON.parse(fs.readFileSync(path.join(RACINE, 'AUDITS', 'CONTROLES-QCM-APP', 'attendus', 'taxonomie-competences.json'), 'utf8'));
const OFFICIELS = [], ELEVES = []; ['francaisC4', 'transversales'].forEach(k => TAX[k].forEach(b => b.items.forEach(i => { OFFICIELS.push(i.libelle); ELEVES.push(i.libelleEleve); })));
const IMG = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png'), 'friedrich.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const CLASSE = '3E Charles de Gaulle';

/* ── le faux hub, en mémoire ; `garder` : il survit au rechargement (localStorage, comme sonde-1262) ── */
const fauxHub = ([s, garder]) => { let sv = null; if (garder) { try { sv = localStorage.getItem('__C16HUB'); } catch (e) {} } window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const sauver = () => { if (garder) { try { localStorage.setItem('__C16HUB', JSON.stringify(window.__HUB)); } catch (e) {} } };
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; sauver(); };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async ({ W = 1536, H = 864, store, garder = false, horloge = '2026-09-14T09:00:00+02:00' }) => {
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const m = /mjpc-medias\/.*\/([^/?]+)$/.exec(r.request().url()); if (m && IMG[m[1]]) return r.fulfill({ path: IMG[m[1]], contentType: 'image/png' }); return r.abort(); });
  await ctx.addInitScript(fauxHub, [store, garder]); await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(new Date(horloge));
  await pg.goto('file://' + FICHIER + '?n=3e', { waitUntil: 'load' }); await p(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await p(300);
  return { ctx, pg, errs, boites }; };
const capt = async (pg, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const fin = (k, o, quoi) => { verif(k, !o.errs.length, (quoi || '') + 'aucune erreur JS', o.errs.join(' ; ')); verif(k, !o.boites.length, (quoi || '') + 'aucune boîte système', o.boites.join(' ; ')); return o.ctx.close(); };

/* ── l'heure de la classe, par la case de l'emploi du temps, en mode test ; la fenêtre du tableau ── */
const lancerClasse = async (o, jour = '2026-09-14') => { const pg = o.pg; await pg.click('#tprof-btn'); await p(600); await pg.evaluate(() => { window.M8_TEST = true; }); await pg.evaluate(() => edtOuvrir()); await p(1500);
  const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!c) return false; c.click(); return true; }, jour); await p(800);
  const l = ok && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape'); await p(400); return !!l; };
const ouvrirTableau = async (o, W, H) => { const [fen] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), o.pg.click('#bvideoproj')]); await p(1500); if (fen) await fen.setViewportSize({ width: W, height: H }); await o.pg.bringToFront(); return fen; };
/* ce que le pilote montre : la diapo (son rôle en clair dans l'en-tête), ses lignes (pâles ou non) ; ce que le tableau montre (visibles ou absentes) */
const pilote = pg => pg.evaluate(() => { const m = document.getElementById('mur'); const o = m && m.querySelector(':scope > .ouv'); const t = ((document.getElementById('numero') || {}).textContent || '') + ' ' + ((document.getElementById('dtitre') || {}).textContent || '');
  if (!o) return { ouv: false, tete: t.replace(/\s+/g, ' ').trim() };
  return { ouv: true, tete: t.replace(/\s+/g, ' ').trim(), forme: (o.className.match(/ouv-(pres|comp|parc|debut|prob)/) || [])[1], texte: o.innerText.replace(/\s+/g, ' ').trim(),
    lignes: Array.from(o.querySelectorAll('li[data-k]')).map(l => ({ k: +l.dataset.k, pas: l.classList.contains('pas'), op: +getComputedStyle(l).opacity, txt: l.innerText.replace(/\s+/g, ' ').trim(), cls: l.className })) }; });
const tableau = fen => fen.evaluate(() => { const m = document.getElementById('mur2'); const o = m && m.querySelector(':scope > .ouv'); if (!o) return { ouv: false, texte: m ? m.innerText.replace(/\s+/g, ' ').slice(0, 120) : '' };
  return { ouv: true, forme: (o.className.match(/ouv-(pres|comp|parc|debut|prob)/) || [])[1], fond: getComputedStyle(o).backgroundColor,
    lignes: Array.from(o.querySelectorAll('li[data-k]')).map(l => ({ k: +l.dataset.k, vue: getComputedStyle(l).visibility !== 'hidden' && l.getClientRects().length > 0, txt: l.innerText.replace(/\s+/g, ' ').trim(), cls: l.className })) }; });
const FORMES = { 'présentation du chapitre': 'pres', 'compétences du chapitre': 'comp', 'parcours du chapitre': 'parc', 'début de séance': 'debut', 'problématique': 'prob' };
/* la mesure : rien ne déborde de sa place, aucun bloc n'en chevauche un autre, rien ne sort de la diapo ; l'image ne passe pas sous le texte */
const mesurer = (pg, sel) => pg.evaluate(sel => { const m = document.querySelector(sel); const o = m && m.querySelector(':scope > .ouv'); if (!o || !o.clientHeight) return null; const R = o.getBoundingClientRect();
  const zones = Array.from(o.querySelectorAll('.ouv-g, .ouv-rangs, .ouv-r, .ouv-doms, .ouv-cl')); const coupes = zones.filter(z => z.scrollHeight > z.clientHeight + 1 || z.scrollWidth > z.clientWidth + 1).map(z => z.className + ':' + (z.innerText || '').slice(0, 30));
  const blocs = Array.from(o.querySelectorAll(':scope > *, .ouv-g > *, .ouv-l > li, .ouv-rangs > li, .ouv-doms > li, .ouv-bande > *, .ouv-tab > *, .ouv-r > span, .ouv-cr > span')).filter(x => x.getClientRects().length && !x.matches('.ouv-fil, .ouv-point, .ouv-bande') && getComputedStyle(x).visibility !== 'hidden');
  const r = blocs.map(x => x.getBoundingClientRect()); const hors = blocs.filter((x, i) => r[i].left < R.left - 1 || r[i].right > R.right + 1 || r[i].top < R.top - 1 || r[i].bottom > R.bottom + 1).map(x => x.className);
  const chev = []; for (let i = 0; i < blocs.length; i++) for (let j = i + 1; j < blocs.length; j++) { if (blocs[i].contains(blocs[j]) || blocs[j].contains(blocs[i])) continue; const a = r[i], b = r[j]; const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (w > 1.5 && h > 1.5) chev.push(blocs[i].className + ' × ' + blocs[j].className); }
  return { coupes, hors, chev, z: getComputedStyle(o).getPropertyValue('--ouv-z') || '1', blocs: blocs.length }; }, sel);
const dans = (a, b) => a && b && a.indexOf(b) >= 0;
const sk0 = st => Object.keys(st.site['3e'].chapitres[0].seances).sort((a, b) => (+st.site['3e'].chapitres[0].seances[a].ordre || 0) - (+st.site['3e'].chapitres[0].seances[b].ordre || 0));

dire('C16 · sonde des diapos d’ouverture au canon · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex') + ' · ' + fs.statSync(FICHIER).size + ' o');

/* ═══ A · l'heure 1 de la séance 1, aux trois tailles ═══ */
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
for (const [W, H] of TAILLES) { const T = W + '×' + H; dire(''); dire('══ A · ' + T + ' · mode test, ' + CLASSE + ', la case du 14/09 08:57, heure 1 de la séance 1 ══');
  const st = storeOuverture(RACINE, { champs: true });
  /* la problématique de la séance 1, telle que Paul l'a mise en forme (le rouge, un surlignage, comme sur le vrai chapitre) : sa mise en forme reste lisible sur le bleu nuit */
  const ks = sk0(st); const PROB = st.site['3e'].chapitres[0].problematique; const se0 = st.site['3e'].chapitres[0].seances[ks[0]];
  se0.deroule.ecrans.unshift({ eid: 'inv-problematique-s' + ks[0], role: 'problematique', act: 'Notre problématique', dur: 0, forme: { coulTxt: [{ couleur: 'rouge', p: '0.0', txt: 'Du sonnet au poème en prose' }], surl: [{ couleur: 'jaune', p: '0.0', txt: 'règles classiques' }] }, blocs: [{ t: 'texte', id: 'binv-problematique-s' + ks[0], txt: '', el: [PROB] }] });
  const o = await ouvrir({ W, H, store: st }); const pg = o.pg;
  const lance = await lancerClasse(o); verif('A', lance, T + ' · l’heure se lance par la case de l’emploi du temps (« ▶ Ouvrir le pilotage et lancer »)');
  const fen = await ouvrirTableau(o, W, H); verif('A', !!fen, T + ' · « 🖥 Ouvrir le tableau » ouvre la fenêtre du tableau');
  await pg.click('#numero').catch(() => {});
  const vus = []; let n = 0, pil = await pilote(pg);
  while (pil.ouv && n < 60) { const forme = pil.forme; const N = pil.lignes.length; if (!vus.length || vus[vus.length - 1].forme !== forme) vus.push({ forme, tete: pil.tete, N });
    const tb0 = fen ? await tableau(fen) : null; const pi0 = pil;
    if (n === 0 || vus[vus.length - 1].verif !== true) { vus[vus.length - 1].verif = true;
      verif('A', pi0.lignes.every(l => l.pas && l.op < 0.6) && tb0 && tb0.ouv && tb0.forme === forme && tb0.lignes.every(l => !l.vue), T + ' · ' + forme + ' arrive à la flèche : son décor seul au tableau (aucune ligne), toutes ses lignes pâles au pilote', { pilote: pi0.lignes.map(l => l.op), tableau: tb0 && tb0.lignes.map(l => l.vue) });
      for (let k = 1; k <= N; k++) { await pg.keyboard.press('ArrowRight'); await p(380); }
      const pi1 = await pilote(pg), tb1 = fen ? await tableau(fen) : null;
      verif('A', pi1.forme === forme && pi1.lignes.every(l => !l.pas && l.op > 0.95) && tb1 && tb1.lignes.every(l => l.vue) && tb1.lignes.length === N, T + ' · ' + forme + ' : ' + N + ' ligne' + (N > 1 ? 's' : '') + ', une par flèche — toutes dévoilées, au pilote et au tableau', { tableau: tb1 && tb1.lignes.map(l => l.txt.slice(0, 40)) });
      await capt(pg, 'A-' + T + '-' + forme + '-pilote'); if (fen) await fen.screenshot({ path: CAPT ? path.join(CAPT, 'A-' + T + '-' + forme + '-tableau.png') : path.join(OUT, '_t.png') }).catch(() => {});
      if (N > 1) { await pg.keyboard.press('ArrowLeft'); await p(450); const pi2 = await pilote(pg), tb2 = fen ? await tableau(fen) : null; verif('A', pi2.lignes[N - 1].pas && tb2 && !tb2.lignes[N - 1].vue && tb2.lignes.slice(0, N - 1).every(l => l.vue), T + ' · ' + forme + ' : ◀ revoile la dernière ligne (pâle au pilote, absente au tableau), les autres restent', tb2 && tb2.lignes.map(l => l.vue)); await pg.keyboard.press('ArrowRight'); await p(380); }
      vus[vus.length - 1].pilote = pi1; vus[vus.length - 1].tableau = tb1;
      const mp = await mesurer(pg, '#mur'), mt = fen ? await mesurer(fen, '#mur2') : null;
      verif('A', mp && !mp.coupes.length && !mp.hors.length && !mp.chev.length && mt && !mt.coupes.length && !mt.hors.length && !mt.chev.length, T + ' · ' + forme + ' : rien de coupé, rien ne sort de la diapo, aucun chevauchement (mesuré au pilote et au tableau)', { pilote: mp, tableau: mt });
    }
    await pg.keyboard.press('ArrowRight'); await p(450); pil = await pilote(pg); n++; }
  verif('A', JSON.stringify(vus.map(v => v.forme)) === JSON.stringify(['pres', 'comp', 'parc', 'debut', 'prob']), T + ' · l’ordre de la séance 1 (C16 33) : la présentation du chapitre, les compétences du chapitre, le parcours, le début de séance, la problématique — puis la première diapo de la séance', vus.map(v => v.forme));
  const V = f => (vus.find(v => v.forme === f) || {}); const tx = f => ((V(f).tableau || {}).lignes || []).map(l => l.txt);
  const TI = st.site['3e'].chapitres[0].title; verif('A', dans(tx('pres')[0], TI) && dans(tx('pres')[1], 'Du sonnet') && /Poésie · du 14 septembre au \d+ \w+/.test(tx('pres')[2] || ''), T + ' · la présentation au tableau : le titre, la question, l’entrée et les dates de la classe (du premier au dernier jour du chapitre, son emploi du temps)', tx('pres'));
  const comps = tx('comp').join(' | '), debut = tx('debut').join(' | '); const off = OFFICIELS.filter(x => !ELEVES.includes(x) && (comps.indexOf(x) >= 0 || debut.indexOf(x) >= 0));
  const pc = await pg.evaluate(() => null); const ph = vus.length ? (V('comp').tableau || {}).lignes : [];
  verif('A', !off.length && /Lire des documents, des images et des pages numériques/.test(debut) && /LIRE/.test(comps), T + ' · les compétences par leur phrase d’élève, au tableau (compétences du chapitre, début de séance) : aucun intitulé officiel', off.slice(0, 3));
  const parc = V('parc').tableau || { lignes: [] }; const jour = parc.lignes.filter(l => /\bjour\b/.test(l.cls)); verif('A', jour.length === 1 && /^1 /.test(jour[0].txt) && /lun\. 14\/9/.test(jour[0].txt) && parc.lignes.length === ks.length && /mar\. 29\/9|lun\. 21\/9/.test(parc.lignes[1].txt), T + ' · le parcours dans la copie de la classe : la date de chaque séance pour la classe, la séance du jour entourée d’or (la 1, lun. 14/9)', parc.lignes.slice(0, 3).map(l => l.txt.slice(0, 50)));
  const or = fen ? await fen.evaluate(() => { const l = document.querySelector('#mur2 .ouv-r.jour'); return l ? getComputedStyle(l).outlineColor : null; }) : null; verif('A', or === 'rgb(201, 160, 74)', T + ' · l’or de la séance du jour (capture 7 du 29/10 : #c9a04a)', or);
  /* les couleurs du canon, lues au tableau */
  const coul = fen ? await fen.evaluate(() => { const r = {}; return r; }) : null;
  const ev = parc.lignes.filter(l => /\bev\b/.test(l.cls)).map(l => +l.txt.split(' ')[0]); verif('A', JSON.stringify(ev) === JSON.stringify([3, 4, 6, 9]), T + ' · les séances évaluées en bleu vif (celles que le chapitre marque « évaluée »)', ev);
  /* la mise en forme de Paul sur le bleu nuit : le contraste mesuré (≥ 4,5:1) */
  const contraste = fen ? await fen.evaluate(() => { const lum = c => { const m = c.match(/\d+(\.\d+)?/g).map(Number); const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); }; const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const o = document.querySelector('#mur2 > .ouv'); if (!o) return null; const fond = getComputedStyle(o).backgroundColor; const ct = o.querySelector('.p8-ct'), mk = o.querySelector('mark'), q = o.querySelector('.ouv-question');
    return { fond, rouge: ct ? +cr(getComputedStyle(ct).color, fond).toFixed(2) : null, surligne: mk ? +cr(getComputedStyle(mk).color, getComputedStyle(mk).backgroundColor).toFixed(2) : null, texte: q ? +cr(getComputedStyle(q).color, fond).toFixed(2) : null }; }) : null;
  verif('A', contraste && contraste.rouge >= 4.5 && contraste.surligne >= 4.5 && contraste.texte >= 4.5 && contraste.fond === 'rgb(31, 59, 77)', T + ' · la problématique au tableau, sur le bleu nuit du canon (#1f3b4d) : le rouge et le surligné de Paul restent lisibles (contraste ≥ 4,5:1), comme le texte', contraste);
  /* le nom du rôle sous chaque vignette, lisible en entier (dette relevée par la conscience) */
  const vig = await pg.evaluate(() => Array.from(document.querySelectorAll('#volet .vig')).filter(v => v.querySelector('.role') && v.querySelector('.mini')).map(v => { const r = v.querySelector('.role').getBoundingClientRect(), m = v.querySelector('.mini').getBoundingClientRect(), V = v.getBoundingClientRect(); const ro = v.querySelector('.role'); return { t: ro.textContent, sous: r.top >= m.bottom - 0.5, dedans: r.left >= V.left - 0.5 && r.right <= V.right + 0.5 && r.bottom <= V.bottom + 0.5, entier: ro.scrollWidth <= ro.clientWidth + 1 && r.height > 4 }; }));
  verif('A', vig.length >= 5 && vig.every(v => v.sous && v.dedans && v.entier), T + ' · au pilote, le nom de chaque diapo d’ouverture se lit en entier sous sa vignette, sans la recouvrir', vig.filter(v => !(v.sous && v.dedans && v.entier)).concat(vig.slice(0, 2)));
  const ecr = await pg.evaluate(() => window.__ECR.slice()); const horsT = ecr.filter(x => !/ \/site\/tableau_test(\/|$)/.test(x)); verif('A', !horsT.length, T + ' · mode test : aucune écriture au hub hors de /site/tableau_test (' + ecr.length + ' écritures)', horsT.slice(0, 4));
  await fin('A', o, T + ' · ');
}

/* ═══ B · la séance 1 jouée par la classe → la case du 14/09 ouvre la séance 2 ═══ */
{ dire(''); dire('══ B · la séance 1 jouée (deux heures closes, 07/09 et 08/09) : la case du 14/09 08:57 ouvre la séance 2 ══');
  const st = storeOuverture(RACINE, { champs: true }); const ks = sk0(st); const ch = st.site['3e'].chapitres[0]; const se0 = ch.seances[ks[0]];
  const somme = se0.deroule.ecrans.filter(e => e && e.role !== 'fin').reduce((t, e) => t + (+e.dur || 0), 0); const nH = Math.max(1, Math.ceil(somme / 50));
  const heures = {}; for (let h = 0; h < nH; h++) { const j = String(7 + h).padStart(2, '0'); heures['2026-09-' + j + '_08h57-09h52_3E_Charles_de_Gaulle'] = { classe: CLASSE, creneau: '08:57-09:52', clos: true, debutReel: 1788000000000 + h * 86400000, finReel: 1788003000000 + h * 86400000, fin: '09:52', lanceA: '08:57', minutesJouees: 50, tempsUtilePrevu: 50, heure: h + 1, sur: nH, activites: [] }; }
  se0.deroule_joue = { '3e_charles_de_gaulle': { classe: CLASSE, demarreLe: 1788000000000, heures } };
  const o = await ouvrir({ W: 1536, H: 864, store: st }); const pg = o.pg; const lance = await lancerClasse(o); const fen = await ouvrirTableau(o, 1536, 864); await pg.click('#numero').catch(() => {});
  const seq = []; let pil = await pilote(pg); let n = 0; while (pil.ouv && n < 40) { if (!seq.length || seq[seq.length - 1].forme !== pil.forme) { const N = pil.lignes.length; for (let k = 0; k < N; k++) { await pg.keyboard.press('ArrowRight'); await p(350); } const t = fen ? await tableau(fen) : null; seq.push({ forme: pil.forme, tete: pil.tete, tab: t }); await capt(pg, 'B-' + pil.forme + '-pilote'); }
    await pg.keyboard.press('ArrowRight'); await p(420); pil = await pilote(pg); n++; }
  verif('B', lance && JSON.stringify(seq.map(s => s.forme)) === JSON.stringify(['parc', 'debut', 'prob']), 'séance ' + ks.length + ' de la file : la séance 2 s’ouvre par le parcours, le début de séance, la problématique (ni présentation ni compétences du chapitre)', seq.map(s => s.forme + ' · ' + s.tete.slice(0, 60)));
  const parc = (seq.find(s => s.forme === 'parc') || {}).tab || { lignes: [] };
  verif('B', parc.lignes[0] && /\bfaite\b/.test(parc.lignes[0].cls) && /✓/.test(parc.lignes[0].txt) && /lun\. 7\/9/.test(parc.lignes[0].txt) && /\bjour\b/.test((parc.lignes[1] || {}).cls) && !/\bjour\b/.test(parc.lignes[0].cls), 'au tableau, le parcours de la classe : la séance 1 terminée, cochée (lun. 7/9) ; la séance 2 en or', parc.lignes.slice(0, 2).map(l => l.cls.replace(/ouv-r ?/, '') + ' · ' + l.txt.slice(0, 40)));
  const deb = (seq.find(s => s.forme === 'debut') || {}).tab || { lignes: [] }; const sn = await pg.evaluate(() => { const o = document.querySelector('#mur > .ouv'); return null; });
  verif('B', deb.lignes.length && dans(deb.lignes[0].txt, ch.seances[ks[1]].title) && /Lire « L’Albatros »/.test((deb.lignes[1] || {}).txt || ''), 'au tableau, le début de la séance 2 : son titre, puis « Objectif : » et sa phrase', deb.lignes.slice(0, 2).map(l => l.txt.slice(0, 60)));
  const carres = fen ? await fen.evaluate(() => Array.from(document.querySelectorAll('#mur2 .ouv-carres i')).map(i => i.classList.contains('on') ? 1 : 0)) : [];
  verif('B', carres.length === ks.length && carres[1] === 1 && carres.reduce((a, b) => a + b, 0) === 1, 'les ' + ks.length + ' carrés de la séance : le deuxième allumé (la séance du jour)', carres);
  await fin('B', o);
}

/* ═══ C · l'Atelier : la carte, « À régler », la feuille sommaire suivent ; retirer, recharger ═══ */
dire(''); dire('══ C · l’Atelier (le faux hub gardé d’un rechargement à l’autre) ══');
{ const st = storeOuverture(RACINE, { champs: true }); const ks = sk0(st); const ch = st.site['3e'].chapitres[0];
  /* la feuille sommaire du chapitre (séance de rang 0, celle que l'import crée) : elle doit suivre ce que la carte change */
  ch.seances['9'] = { title: 'Sommaire du chapitre', type: 'sommaire', ordre: 0, items: {}, resume: { titre: ch.title, plan: [] }, html: '<div class="ch-som">ancien</div>' };
  const o = await ouvrir({ W: 1707, H: 743, store: st, garder: true }); const pg = o.pg;
  const atelier = async () => { await pg.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(1200);
    if (await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await pg.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(900); await clicTexte(pg, 'button', '← Mes chapitres'); await p(900); }
    await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(900); await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'); await p(1800);
    await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(2500); };
  const seanceA = async cle => { for (let n = 0; n < 4; n++) { const ok = await pg.evaluate(c => String(ATVUES.snum) === c && !!document.querySelector('#volet [data-at-di]'), cle); if (ok) break; await pg.evaluate(c => { const d = document.querySelector('.ed2-sce[data-seance="' + c + '"]'); if (d) { d.scrollIntoView({ block: 'center' }); d.click(); } }, cle); await p(1500); } await p(600); };
  const colonne = () => pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ eid: d.dataset.eid, t: ((d.querySelector('.t') || {}).textContent || '').replace(/ · \d+ pages$/, '').trim() })));
  const clicLigne = async eid => { await pg.evaluate(e => { const d = document.querySelector('#volet [data-eid="' + e + '"]'); if (d) d.scrollIntoView({ block: 'center' }); }, eid); await p(200); await pg.click('#volet [data-eid="' + eid + '"] .t'); await p(900); };
  const regler = () => pg.evaluate(() => { try { return alertesChapitre().filter(a => a.k === 'ouverture').map(a => a.l); } catch (e) { return ['?' + e.message]; } });
  await pg.click('#tprof-btn'); await p(500); await atelier(); await seanceA(ks[1]); let col = await colonne();
  verif('C', JSON.stringify(col.slice(0, 3).map(c => c.eid)) === JSON.stringify(['inv-plan-s' + ks[1], 'inv-presentation-seance-s' + ks[1], 'inv-problematique-s' + ks[1]]) && col[1].t === 'Séance 2 · ' + ch.seances[ks[1]].title, 'Atelier, séance 2 : le parcours, le début de séance, la problématique, en tête', col.slice(0, 4).map(c => c.t));
  await seanceA(ks[0]); col = await colonne(); await clicLigne('inv-presentation-chapitre-s' + ks[0]); const pres = await pilote(pg);
  verif('C', pres.forme === 'pres' && /les dates selon la classe/.test(pres.texte) && !/septembre/.test(pres.texte), 'Atelier : la présentation du chapitre dit « les dates selon la classe » (pas de classe, pas de date)', pres.lignes.map(l => l.txt.slice(0, 50)));
  const der = ks[ks.length - 1]; await seanceA(der); col = await colonne(); const iB = col.findIndex(c => c.eid === 'inv-competences-bilan-s' + der); const apres = col[iB + 1];
  await clicLigne('inv-competences-bilan-s' + der); const bil = await pilote(pg); await capt(pg, 'C-bilan-du-chapitre');
  verif('C', iB > 0 && apres && /Cahier de textes/.test(apres.t) && bil.forme === 'comp', 'Atelier, dernière séance : « Les compétences du chapitre » reviennent, juste avant le cahier de textes de sa dernière heure (la séance n’a pas de bilan)', { place: iB, suivante: apres && apres.t });
  /* « À régler » : une ligne par champ qui manque — les séances 8 et 9 sans phrase, la 7 sans « évaluée » ; le chapitre a tout */
  let ar = await regler(); const attendu = ['La séance 8 n’a pas d’objectif (la phrase de la séance)', 'La séance 9 n’a pas d’objectif (la phrase de la séance)', 'La séance 7 ne dit pas si elle est évaluée'];
  verif('C', attendu.every(a => ar.includes(a)) && ar.length === 3, '« À régler » : une ligne par champ manquant — ' + ar.length + ' ligne(s)', ar);
  /* la ligne ouvre la carte au bon champ */
  await seanceA(ks[0]); await pg.click('#at-regler').catch(() => {}); await p(700);
  const ouvert = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.choix-obj .fe')).find(x => /séance 8 n’a pas d’objectif/.test(x.innerText)); const o = b && b.querySelector('[data-ouvrir]'); if (!o) return false; o.click(); return true; }); await p(1800);
  const vise = await pg.evaluate(() => { const v = document.querySelector('#droite-atelier .dr-ouv-vise'); const a = document.activeElement; return { vise: v ? v.id || v.className : null, focus: a && a.id, seance: String(ATVUES.snum) }; });
  verif('C', ouvert && vise.vise === 'dc-ouv-objectif' && vise.seance === ks[7], '« Ouvrir la diapo » sur cette ligne : la séance 8, son début de séance, la carte ouverte sur l’objectif', vise);
  await capt(pg, 'C-carte-au-champ');
  /* la carte : l'objectif écrit → la diapo, « À régler » suivent */
  await pg.click('#dc-ouv-objectif'); await pg.keyboard.type('Relire ses erreurs de dictée et de réécriture, puis s’entraîner sur sa notion la moins sûre.', { delay: 4 }); await pg.keyboard.press('Enter'); await p(1500);
  let deb = await pilote(pg); ar = await regler();
  verif('C', /Relire ses erreurs de dictée/.test(deb.texte) && !ar.some(a => /séance 8 n’a pas d’objectif/.test(a)) && ar.length === 2, 'carte : l’objectif écrit (Entrée) — la diapo le dit (« Objectif : … »), « À régler » perd sa ligne (' + ar.length + ' restantes)', { diapo: deb.lignes.map(l => l.txt.slice(0, 50)), regler: ar });
  const hubSe = (k, c) => pg.evaluate(([k, c]) => (window.__hubLire('/site/3e/chapitres/0/seances/' + k) || {})[c], [k, c]);
  verif('C', /^Relire ses erreurs/.test(await hubSe(ks[7], 'objectif') || ''), 'au hub : la phrase est écrite dans la séance (le chapitre, pour toutes les classes)', await hubSe(ks[7], 'objectif'));
  /* la majeure ★ : un clic sur une autre compétence */
  const avant = await hubSe(ks[7], 'competences'); const autre = avant[1];
  await pg.click('#droite-atelier [data-ouv-maj="' + autre + '"]'); await p(1500); const apresC = await hubSe(ks[7], 'competences'); deb = await pilote(pg);
  const premiere = deb.lignes.find(l => /ouv-comp/.test(l.cls)); const etoile = await pg.evaluate(() => (document.querySelector('#droite-atelier .dr-ouv-maj.on') || {}).textContent || '');
  verif('C', apresC[0] === autre && apresC.length === avant.length && premiere && /\bmaj\b/.test(premiere.cls) && ELEVES[OFFICIELS.length ? ELEVES.length : 0] !== null && /★/.test(etoile), 'carte : un clic fait la majeure (★) — elle passe en tête au hub, en gras et en premier sur la diapo', { avant: avant.slice(0, 2), apres: apresC.slice(0, 2), diapo: premiere && premiere.txt, carte: etoile.slice(0, 50) });
  /* « évaluée » : oui → le parcours la met en bleu vif */
  await pg.click('#droite-atelier [data-ouv-ev="1"]'); await p(1500); await clicLigne('inv-plan-s' + ks[7]); const pa = await pilote(pg); const ev8 = pa.lignes[7] && /\bev\b/.test(pa.lignes[7].cls);
  verif('C', (await hubSe(ks[7], 'evaluee')) === true && ev8, 'carte : « séance évaluée » oui — au hub, et la séance 8 en bleu vif sur le parcours', { hub: await hubSe(ks[7], 'evaluee') });
  /* l'image : « Changer… », une adresse dans mjpc-medias */
  await clicLigne('inv-presentation-seance-s' + ks[7]); await pg.click('#droite-atelier [data-ouv-image]'); await p(500); await pg.fill('#of-src', '3e/poesie-peinture-xixe/friedrich.png'); await pg.click('#of-ok'); await p(1800);
  const img = await pg.evaluate(() => { const i = document.querySelector('#mur > .ouv .ouv-img img'); return i ? { src: i.getAttribute('src'), w: i.naturalWidth, avec: document.querySelector('#mur > .ouv').classList.contains('ouv-avec-img') } : null; });
  const himg = await hubSe(ks[7], 'image'); verif('C', img && img.w > 0 && img.avec && himg && himg.ref === MEDIAS + '3e/poesie-peinture-xixe/friedrich.png', 'carte : l’image de la séance (« Changer… », une adresse dans mjpc-medias) — au hub, et à droite du début de séance', { hub: himg, diapo: img });
  await capt(pg, 'C-carte-apres');
  /* ta version : Paul écrit dans la diapo, puis « ↩ celle du chapitre » */
  await pg.click('#mur > .ouv li.ouv-titre'); await pg.keyboard.press('End'); await pg.keyboard.type(' (révisée)', { delay: 20 }); await pg.mouse.click(5, 400); await p(1500);
  const ta = await pg.evaluate(() => ({ ta: !!document.querySelector('#droite-atelier [data-ouv-rendre]'), titre: (document.querySelector('#mur > .ouv li.ouv-titre') || {}).textContent }));
  await pg.click('#droite-atelier [data-ouv-rendre]'); await p(1500); const re = await pg.evaluate(() => ({ ta: !!document.querySelector('#droite-atelier [data-ouv-rendre]'), titre: (document.querySelector('#mur > .ouv li.ouv-titre') || {}).textContent }));
  verif('C', ta.ta && /\(révisée\)$/.test(ta.titre) && !re.ta && !/révisée/.test(re.titre), 'écrire dans la diapo en fait « ta version » (la carte le dit, avec « ↩ celle du chapitre ») ; « ↩ » rend celle du chapitre', { avant: ta, apres: re });
  /* la feuille sommaire suit : sortir de l'éditeur → « régénérer la feuille sommaire ? » → Régénérer */
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); if (b) b.click(); }); await p(1200); await clicTexte(pg, 'button', '← Mes chapitres'); await p(1500);
  const mod = await pg.evaluate(() => { const m = document.getElementById('at-modale'); if (!m || !(m.getBoundingClientRect().height > 0)) return null; const t = m.innerText; const b = Array.from(m.querySelectorAll('button')).find(x => /^Régénérer$/.test(x.textContent.trim())); if (b) b.click(); return t.slice(0, 120); }); await p(2000);
  const som = await pg.evaluate(() => { const s = window.__hubLire('/site/3e/chapitres/0/seances/9') || {}; return { html: String(s.html || ''), resume: s.resume || null }; });
  verif('C', mod && /Relire ses erreurs de dictée/.test(som.html) && /évaluée/.test(som.html) && !/Élaborer une interprétation de textes littéraires/.test(som.html) && /Interpréter un texte littéraire/.test(som.html), 'la feuille sommaire suit (sortie de l’éditeur → « Régénérer ») : la phrase de la séance 8, « évaluée », les compétences par leur phrase d’élève (13 · 91)', { modale: mod, extrait: som.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300) });
  /* retirer une diapo d'ouverture, recharger : elle ne revient pas */
  await atelier(); await seanceA(ks[1]); await pg.click('#volet [data-eid="inv-problematique-s' + ks[1] + '"] .t', { button: 'right' }); await p(400);
  await pg.evaluate(() => { const b = document.querySelector('#menu.on [data-a="supprimer"]'); if (b) b.click(); }); await p(700); await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && Array.from(m.querySelectorAll('button')).find(x => /^Retirer$/.test(x.textContent.trim())); if (b) b.click(); }); await p(3200);
  const ret = await pg.evaluate(k => ((window.__hubLire('/site/3e/chapitres/0/seances/' + k + '/deroule') || {}).retraits || null), ks[1]);
  await pg.reload({ waitUntil: 'load' }); await p(2000); await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pg.click('#tprof-btn'); await p(500); await atelier(); await seanceA(ks[1]); col = await colonne();
  verif('C', Array.isArray(ret) && ret.includes('problematique') && !col.some(c => c.eid === 'inv-problematique-s' + ks[1]) && col[0].eid === 'inv-plan-s' + ks[1], 'clic droit → « Retirer » la problématique de la séance 2, recharger : elle ne revient pas (deroule/retraits au hub)', { retraits: ret, tete: col.slice(0, 3).map(c => c.t) });
  await fin('C', o);
}

/* ═══ D · un chapitre importé avec les nouveaux champs ═══ */
dire(''); dire('══ D · l’import (« 📚 Nouveau chapitre ») ══');
{ const st = storeOuverture(RACINE, { champs: false }); const o = await ouvrir({ W: 1707, H: 743, store: st, garder: true }); const pg = o.pg;
  const CHI = JSON.parse(fs.readFileSync(path.join(RACINE, 'LIVRAISONS', 'INTEGRATION', 'E4', 'prompt', 'chapitre-3e-au-contrat.json'), 'utf8'));
  CHI.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => { if (e && e.role === 'bilan') (e.blocs || []).forEach(b => { if (b && Array.isArray(b.el)) b.el = b.el.map(x => { x = String(x).replace(/\.$/, ''); return x.length > 45 ? x.split(' : ')[0].slice(0, 45) : x; }); }); }));
  CHI.chapitre.title = 'Poésie et peinture — l’import du canon'; CHI.chapitre.image = 'poesie-peinture-xixe/chapitre.png';
  CHI.chapitre.seances[0].objectif = 'Observer cinq tableaux du XIXe siècle et formuler avec la classe ce qu’ils ont en commun.'; CHI.chapitre.seances[0].evaluee = false; CHI.chapitre.seances[0].image = 'poesie-peinture-xixe/seance-1.png';
  CHI.chapitre.seances[1].objectif = 'Lire « L’Albatros » et comprendre ce que le poème dit du poète parmi les hommes.'; CHI.chapitre.seances[1].evaluee = true;
  const coller = async json => { await pg.evaluate(() => { try { atelierOuvrir(); } catch (e) {} }); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800); await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.at-porte-ch')).find(x => x.offsetParent !== null); if (b) b.click(); }); await p(1500); await pg.fill('#ch-coller', JSON.stringify(json)); await p(300); await clicTexte(pg, 'button', 'Vérifier'); await p(1800); return pg.evaluate(() => (document.getElementById('ch-msg') || document.body).innerText.replace(/\s+/g, ' ').slice(0, 900)); };
  await pg.click('#tprof-btn'); await p(500);
  const faux = JSON.parse(JSON.stringify(CHI)); faux.chapitre.seances[2].evaluee = 'oui'; faux.chapitre.seances[3].image = 'https://exemple.fr/a.png'; const msgF = await coller(faux);
  verif('D', /« evaluee » vaut true ou false/.test(msgF) && /relative dans mjpc-medias, jamais compl/.test(msgF), '« Vérifier » refuse un « evaluee » qui n’est pas vrai / faux et une image à l’adresse complète, avec leurs mots', msgF.match(/[^.]*evaluee[^.]*\.|[^.]*jamais compl[^.]*\./g));
  const msg = await coller(CHI); const cree = await clicTexte(pg, 'button', 'Créer ce chapitre'); await p(1500); await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && Array.from(m.querySelectorAll('button')).find(x => /Créer/.test(x.textContent)); if (b) b.click(); }); await p(4000);
  await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && Array.from(m.querySelectorAll('button')).find(x => /^(Compris|OK|Fermer)$/.test(x.textContent.trim())); if (b) b.click(); }); await p(500);
  const hub = await pg.evaluate(t => { const ch = window.__hubLire('/site/3e/chapitres') || {}; const k = Object.keys(ch).find(x => ch[x] && ch[x].title === t); if (k == null) return null; const c = ch[k]; const se = Array.isArray(c.seances) ? c.seances : Object.values(c.seances || {}); const s0 = se.find(s => s && s.ordre === 1) || se[0]; const s1 = se.find(s => s && s.ordre === 2) || se[1]; return { k, image: c.image, o0: s0 && s0.objectif, e0: s0 && s0.evaluee, i0: s0 && s0.image, o1: s1 && s1.objectif, e1: s1 && s1.evaluee, som: se.some(s => s && s.type === 'sommaire') }; }, CHI.chapitre.title);
  verif('D', cree && hub && hub.image && hub.image.ref === MEDIAS + 'poesie-peinture-xixe/chapitre.png' && /^Observer cinq tableaux/.test(hub.o0) && hub.e0 === false && hub.i0 && hub.i0.ref === MEDIAS + 'poesie-peinture-xixe/seance-1.png' && hub.e1 === true, '« Créer ce chapitre » : l’image du chapitre (adresse complète posée par l’import), la phrase, « évaluée » et l’image des séances — gardées au hub', hub);
  /* l'Atelier du chapitre importé : la phrase sur le début de séance, l'image du chapitre sur sa présentation */
  await pg.evaluate(() => { try { atelierOuvrir(); } catch (e) {} }); await p(900); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(900);
  await pg.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && Array.from(e.querySelectorAll('button,[onclick]')).some(b => /Éditer dans l’atelier/.test(b.innerText || ''))); const e = c.filter(x => (x.innerText || '').split('\n').some(l => l.trim() === t)).pop(); if (e) Array.from(e.querySelectorAll('button,[onclick]')).find(b => /Éditer dans l’atelier/.test(b.innerText || '')).click(); }, CHI.chapitre.title); await p(1800);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(2500);
  const lignes = await pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => d.dataset.eid)); const eD = lignes.find(x => /^inv-presentation-seance/.test(x)); const eP = lignes.find(x => /^inv-presentation-chapitre/.test(x));
  if (eD) { await pg.click('#volet [data-eid="' + eD + '"] .t'); await p(900); } const dd = await pilote(pg); if (eP) { await pg.click('#volet [data-eid="' + eP + '"] .t'); await p(1200); }
  const pimg = await pg.evaluate(() => { const i = document.querySelector('#mur > .ouv .ouv-img img'); return i ? i.naturalWidth : 0; }); await capt(pg, 'D-importe-presentation');
  verif('D', dd.forme === 'debut' && /Observer cinq tableaux/.test(dd.texte) && pimg > 0, 'dans l’Atelier du chapitre importé : la phrase de la séance sur son début de séance, l’image du chapitre sur sa présentation', { debut: (dd.lignes || []).slice(0, 2).map(l => l.txt.slice(0, 50)), image: pimg });
  await fin('D', o);
}

/* ═══ E · une copie de classe écrite avant le canon, déjà jouée, reprise ═══ */
dire(''); dire('══ E · la reprise d’une copie de classe écrite avant le canon ══');
{ const st = storeOuverture(RACINE, { champs: true }); const ks = sk0(st); const ch = st.site['3e'].chapitres[0]; const k0 = ks[0]; const se0 = ch.seances[k0];
  const TYPES = {}; const src = fs.readFileSync(path.join(RACINE, 'LIVRAISONS', 'INTEGRATION', 'index.html'), 'utf8'); const mT = /var CH_TYPES_SEANCE=\[([\s\S]*?)\];/.exec(src); (mT ? mT[1] : '').replace(/\{id:'([^']+)',libelle:'([^']+)'/g, (m, a, b) => { TYPES[a] = b.replace(/\\u([0-9a-f]{4})/gi, (x, h) => String.fromCharCode(parseInt(h, 16))); });
  /* l'ancienne forme, telle que la ⑩ la posait : la problématique (montrée à la classe), le plan du chapitre (jamais montré) */
  const vieuxProb = { eid: 'inv-problematique-s' + k0, role: 'problematique', act: 'Notre question', dur: 0, heure: 1, comp: [], blocs: [{ t: 'texte', id: 'binv-problematique-s' + k0, txt: '', el: [ch.problematique] }] };
  const vieuxPlan = { eid: 'inv-plan-s' + k0, role: 'plan', act: 'Le plan du chapitre', dur: 0, heure: 1, comp: [], blocs: [{ t: 'texte', id: 'binv-plan-s' + k0, txt: '', el: ks.map((k, n) => (n + 1) + '. ' + ch.seances[k].title + (TYPES[ch.seances[k].type] ? ' · ' + TYPES[ch.seances[k].type] : '')) }] };
  const trame = se0.deroule.ecrans.filter(e => e && !e.role).map((e, i) => Object.assign({ eid: e.eid || ('e' + i), heure: 1 }, e));
  const ecrans = [vieuxProb, vieuxPlan].concat(trame); const t0 = Date.parse('2026-09-14T08:58:00+02:00');
  const J = [{ t: t0, h: 1, type: 'lancement', heure: 1 }, { t: t0 + 1000, h: 1, type: 'diapo', eid: vieuxProb.eid, nature: 'début' }];
  se0.deroule_joue = { '3e_charles_de_gaulle': { classe: CLASSE, demarreLe: t0, ecrans, journal: J, etat: { S: { lancee: true, heure: 1, close: false, eidCourant: vieuxProb.eid, ordresEid: { 1: ecrans.map(e => e.eid) } }, parDiapo: {}, vuMax: {}, maj: t0 + 60000 },
    heures: { '2026-09-14_08h57-09h52_3e_charles_de_gaulle': { classe: CLASSE, creneau: '08:57-09:52', debutReel: t0, lanceA: '08:57', fin: '09:52' } } } };
  st.site.cours_actif = { niveau: '3e', chapitre: '0', seance: k0, classeSlug: '3e_charles_de_gaulle', classeNom: CLASSE, debut: '08:57', fin: '09:52', ts: t0 + 30000 };
  const o = await ouvrir({ W: 1536, H: 864, store: st, horloge: '2026-09-14T09:01:00+02:00' }); const pg = o.pg; await lancerClasse(o); await p(2500);
  const etat = await pg.evaluate(k => { const E = seance().ecrans; const pr = E.find(e => e.eid === 'inv-problematique-s' + k), pl = E.find(e => e.eid === 'inv-plan-s' + k); return { lancee: !!S.lancee, n: J.length, prob: pr && pr.blocs[0] && pr.blocs[0].t, plan: pl && pl.blocs[0] && pl.blocs[0].t, nouvelles: E.filter(e => /^inv-(presentation|competences)/.test(e.eid)).length }; }, k0);
  /* ce que montre la diapo montrée, par le geste : ◀ / ▶ jusqu'à elle */
  await pg.click('#numero').catch(() => {}); let vu = null; for (let n = 0; n < 6 && !vu; n++) { const t = await pg.evaluate(() => { const m = document.getElementById('mur'); return { ouv: !!(m && m.querySelector(':scope > .ouv')), texte: m ? m.innerText.replace(/\s+/g, ' ').slice(0, 160) : '', tete: ((document.getElementById('dtitre') || {}).textContent || '') }; }); if (/Notre question/.test(t.tete + t.texte)) vu = t; else { await pg.keyboard.press('ArrowLeft'); await p(400); } }
  await capt(pg, 'E-reprise-copie-ancienne');
  verif('E', etat.lancee && etat.prob === 'texte' && etat.plan === 'ouverture' && etat.nouvelles === 0, 'la reprise : la problématique déjà montrée à la classe garde son ancienne forme ; le plan jamais montré prend le canon (le parcours) ; rien n’est ajouté à la copie', etat);
  verif('E', vu && !vu.ouv, 'au pilote, la diapo montrée se revoit telle que la classe l’a vue', vu);
  await fin('E', o);
}

dire(''); dire('sonde des diapos d’ouverture · ' + nb + ' vérifications · ' + echecs + ' échec' + (echecs > 1 ? 's' : '') + ' · ' + (echecs ? 'ROUGE' : 'VERT'));
fs.writeFileSync(path.join(OUT, 'sonde-ouverture.txt'), R.join('\n') + '\n'); try { fs.unlinkSync(path.join(OUT, '_t.png')); } catch (e) {}
await nav.close(); process.exit(echecs ? 1 : 0);

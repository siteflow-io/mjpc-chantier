// LA SONDE DU FIL DE LA SÉANCE, DES FLÈCHES DE LA COLONNE ET DE LA MOLETTE (C16 62 à 66 ; MANDATS/DEROULE-01-11/MANDAT-FIL-NAVIGATION.md §6.1) — par le geste.
// usage : node sonde-fil.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_CAPT=<dossier> : les captures, jamais poussées ; MJPC_MEDIAS=<dossier> : les vrais
//         tableaux du chapitre, sinon l'image 16/9 du canon 1 sert de tableau — la plus large, la plus exigeante pour « l'image pleine largeur » ; MJPC_TAILLES)
// Faux hub : AUDITS/INTEGRATION-DEROULE/hub (jamais modifié), complété en mémoire par hub-ouverture.mjs (les phrases d'élève, la séance 1 jouable à son heure 1,
// les champs des diapos d'ouverture), puis par la séance de la sonde : dans l'heure 1 de la séance 1, « Tableau 2 » devient le tableau des cinq œuvres (un schéma
// « tableau »), « Tableau 3 » une question sur le Turner, « Les hypothèses de la classe » les notes des cinq groupes (deux pages au tableau) ; les durées ne bougent pas.
// Ce qui se lit est lu dans le DOM, au pilote (#mur) ET dans la fenêtre du tableau (#mur2) ; chaque geste est un geste (clavier, souris, molette), jamais un appel.
//  A · ×3 tailles (1366 × 768, 1536 × 864, 1920 × 1080), mode test, 3E Charles de Gaulle, la case du 14/09 08:57 → l'heure 1 de la séance 1, la fenêtre du tableau :
//      chaque diapo de l'heure, jusqu'au cahier de textes, à la flèche : un seul fil et son point, au pilote et au tableau ; le rang « k / n » de la diapo dans la
//      séance, le même des deux côtés ; le point tout en haut à la première, qui descend d'un cran à chaque diapo, inchangé par les dévoilements ; aucun
//      chevauchement fil / contenu (texte, image, cases, cadres), à l'arrivée et tout dévoilé, dont l'image pleine largeur, le tableau, la question avec deux
//      réponses d'élèves, les deux pages ; les couleurs (canon 4 sur le bleu nuit, le bleu nuit de la charte ailleurs) ; le point glisse (1536, relevé image par image) ; aucune écriture hors
//      de /site/tableau_test.
//  B · l'Atelier, la séance 1 (ses trois heures) : le fil de chaque ligne de la colonne, de 1 / n (en haut) à n / n (en bas), l'heure 2 qui repart après le cahier
//      de l'heure 1 ; un clic dans la colonne puis ↓ ↓ ↑ → ← ; Alt + ↓ / Alt + ↑ déplace la diapo ; la molette : un cran = une diapo, un geste continu (vingt petits
//      coups rapprochés) = une diapo, la diapo à deux pages (page 2, la diapo suivante, en remontant la dernière page de celle d'avant) ; Ctrl + molette = le zoom ;
//      sur le cahier de textes, la molette ne change pas de diapo.
//  C · (C16, les dernières dettes ⑱) en classe, les flèches de la colonne ne changent ni de diapo ni de page (↓ ↓ ↑ ↓ ↑ ↑ après un clic dans la colonne) ; → et
//      Espace dévoilent ; un clic sur une vignette → la garde : « Rester » ne change rien, « Y aller devant la classe » → le tableau suit, la garde acceptée ne
//      rouvre pas la colonne (↓ ↓ : rien) ; « ❄ Geler, puis y aller » → Paul va à la diapo, le tableau ne bouge pas.
//  D · (⑱) en classe, la molette ne change ni de diapo ni de page (six crans ; trois crans sur la diapo à deux pages), aucune garde.
// Aucune erreur JS, aucune boîte système, dans chaque cas. Code 1 si un échec.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-fil.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + (typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 700) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const CLASSE = '3E Charles de Gaulle';
/* MJPC_PARTIES : les parties jouées (par défaut toutes) — A, B1 (le fil dans l'Atelier), B2 (les flèches de la colonne), B3 (la molette), C, D, X (la coexistence avec la 8.77.1-⑩), E (le prompt du hub) */
const PARTIES = String(process.env.MJPC_PARTIES || 'A,B1,B2,B3,C,D,X,E').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');   /* 1600 × 900 : une image 16/9, qui prend toute la largeur de la diapo */
const MEDIAS = process.env.MJPC_MEDIAS || null;
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };   /* les images des diapos d'ouverture, comme sonde-ouverture.mjs */

/* ── la séance de la sonde (en mémoire) : réaliste, dans l'heure 1 de la séance 1 ── */
const store = () => { const st = storeOuverture(RACINE, { champs: true }); const ch = st.site['3e'].chapitres[0];
  const k0 = Object.keys(ch.seances).sort((a, b) => (+ch.seances[a].ordre || 0) - (+ch.seances[b].ordre || 0))[0]; const E = ch.seances[k0].deroule.ecrans;
  const par = t => E.find(e => e && e.act === t);
  const t2 = par('Tableau 2'); t2.act = 'Les cinq tableaux'; t2.blocs = [{ t: 'schema', forme: 'tableau', id: 'bsonde-tab', titre: 'Les cinq tableaux', src: 'Tableau | Peintre | Ce qu’on voit\nLe Radeau de la Méduse | Géricault | des naufragés\nLe lac | Bierstadt | des montagnes immenses\nPêcheurs en mer | Turner | une tempête la nuit\nLa ville au bord de l’eau | Schinkel | une cathédrale\nLe Voyageur | Friedrich | un homme de dos' }];
  const t3 = par('Tableau 3'); t3.act = 'Le tableau de Turner'; t3.blocs = [{ t: 'question', id: 'bsonde-q', q: 'Dans le tableau de Turner, qu’est-ce qui montre que l’homme est petit face à la nature ?', reps: [{ i: '', r: 'La barque est minuscule sous les vagues et le ciel noir : la tempête décide, pas les pêcheurs.', refo: false }] }];
  const h = par('Les hypothèses de la classe'); h.blocs[0].etapes = h.blocs[0].etapes.concat([
    'Groupe 1 — Géricault, Le Radeau de la Méduse : des corps entassés, un seul qui agite un tissu vers un bateau minuscule à l’horizon.',
    'Hypothèse du groupe 1 : le peintre ne montre pas un héros, il montre la peur et l’espoir de gens ordinaires.',
    'Groupe 2 — Bierstadt, le lac : les montagnes prennent toute la place, les hommes sont des points au bord de l’eau.',
    'Hypothèse du groupe 2 : la nature est plus grande et plus belle que tout ce que l’homme construit.',
    'Groupe 3 — Turner, les pêcheurs : on ne distingue presque plus la barque dans la nuit et les vagues.',
    'Hypothèse du groupe 3 : ce qui compte, c’est l’émotion de la tempête, pas le dessin précis.',
    'Groupe 4 — Schinkel, la ville : une cathédrale gothique au soleil couchant, un rêve du Moyen Âge.',
    'Hypothèse du groupe 4 : le peintre regrette un passé qu’il imagine plus grand que son présent.',
    'Groupe 5 — Friedrich, le voyageur : un homme de dos, seul, qui regarde une mer de nuages.',
    'Hypothèse du groupe 5 : on se met à la place du personnage ; on ressent ce qu’il ressent.']);
  const rg = par('Les règles héritées'); rg.blocs[0].etapes = rg.blocs[0].etapes.concat([   /* l'heure 2 : une diapo à plusieurs pages suivie d'une diapo ordinaire (« La frise du siècle ») */
    'Le quatrain : une strophe de quatre vers ; le sonnet en compte deux.',
    'Le tercet : une strophe de trois vers ; le sonnet en compte deux, après les quatrains.',
    'La césure : la pause au milieu de l’alexandrin, après la sixième syllabe.',
    'Le « e » muet se prononce devant une consonne : il compte pour une syllabe.',
    'Les rimes embrassées (ABBA) dans les quatrains, comme chez Ronsard.',
    'Les rimes croisées (ABAB) ou suivies (AABB) ailleurs.',
    'L’alternance des rimes masculines et féminines est obligatoire.',
    'Le sujet doit être noble : l’amour, la mort, le temps qui passe, les héros.',
    'Boileau, L’Art poétique (1674) : « Ce que l’on conçoit bien s’énonce clairement ».',
    'Au XIXe siècle, les romantiques veulent briser ces règles : c’est notre question.']);
  return st; };

/* ── le faux hub, en mémoire (celui de sonde-ouverture.mjs) ── */
const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); };
  /* la sonde lit les coups de molette reçus (leur heure), sans rien y faire */
  window.__WH = []; document.addEventListener('wheel', e => { window.__WH.push(Math.round(e.timeStamp)); }, { capture: true, passive: true }); };
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async ({ W = 1536, H = 864, st = null, fichier = FICHIER, test = true }) => {
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); const m = /mjpc-medias\/.*\/([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (m) { const f = MEDIAS && fs.existsSync(path.join(MEDIAS, m[1])) ? path.join(MEDIAS, m[1]) : (IMG_OUV[m[1]] || IMG_DEFAUT); return r.fulfill({ path: f, contentType: /webp$/i.test(f) ? 'image/webp' : 'image/png' }); } return r.abort(); });
  await ctx.addInitScript(fauxHub, st || store()); await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00'));
  await pg.goto('file://' + fichier + '?n=3e', { waitUntil: 'load' }); await p(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await p(300);
  await pg.click('#tprof-btn'); await p(600); if (test) await pg.evaluate(() => { window.M8_TEST = true; });   /* le mode test, comme le panneau prof le pose */
  return { ctx, pg, errs, boites }; };
const capt = async (pg, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const ecritsHorsTest = o => o.pg.evaluate(() => window.__ECR.filter(x => !/ \/site\/tableau_test(\/|$)/.test(x)));
const fin = async (k, o, quoi) => { const h = await ecritsHorsTest(o); const n = await o.pg.evaluate(() => window.__ECR.length); verif(k, !h.length, (quoi || '') + 'mode test : aucune écriture au hub hors de /site/tableau_test (' + n + ' écritures)', h.slice(0, 4)); verif(k, !o.errs.length, (quoi || '') + 'aucune erreur JS', o.errs.join(' ; ')); verif(k, !o.boites.length, (quoi || '') + 'aucune boîte système', o.boites.join(' ; ')); return o.ctx.close(); };
/* l'heure de la classe, par la case de l'emploi du temps ; la fenêtre du tableau */
const lancerClasse = async (o, jour = '2026-09-14') => { const pg = o.pg; await pg.evaluate(() => edtOuvrir()); await p(1500);
  const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!c) return false; c.click(); return true; }, jour); await p(800);
  const l = ok && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape'); await p(400); return !!l; };
const ouvrirTableau = async (o, W, H) => { const [fen] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), o.pg.click('#bvideoproj')]); await p(1500); if (fen) await fen.setViewportSize({ width: W, height: H }); await o.pg.bringToFront(); return fen; };
/* l'Atelier de la séance 1 (la porte de parcours.mjs, P3) */
const ouvrirAtelier = async o => { const pg = o.pg; await pg.evaluate(() => atelierOuvrir()); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(3000); };

/* ── ce que le DOM montre ── */
/* le fil d'un mur : combien, le rang « k / n », la hauteur du point sur le trait (0 en haut, 1 en bas, mesurée), ses couleurs ; et l'ancien fil du début de séance */
const filDe = (pg, sel) => pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return { mur: false }; const fs_ = m.querySelectorAll(':scope > .dr-fil'); const f = fs_[0];
  const vieux = m.querySelectorAll('.ouv-fil, .ouv-point').length; if (!f) return { mur: true, n: 0, vieux };
  const fr = f.getBoundingClientRect(), i = f.querySelector('i'), pr = i.getBoundingClientRect(), M = m.getBoundingClientRect(); const cs = getComputedStyle(f), ci = getComputedStyle(i);
  return { mur: true, n: fs_.length, vieux, rang: f.dataset.fil, y: Math.round(((pr.top + pr.height / 2) - fr.top) / fr.height * 1000) / 1000, top: Math.round(pr.top - M.top), sombre: f.classList.contains('dr-fil-sombre'),
    coul: cs.backgroundColor, point: ci.backgroundColor, bord: ci.borderTopColor, trans: ci.transitionProperty + ' ' + ci.transitionDuration, gauche: Math.round((fr.left - M.left) / M.width * 1000) / 10, droitePoint: Math.round((pr.right - M.left) / M.width * 1000) / 10 }; }, sel);
/* le chevauchement : le trait (élargi d'1 px) et le disque du point, contre tout ce qui se voit dans la diapo — chaque bout de texte, chaque image, chaque cadre,
   chaque case de couleur — sauf les fonds qui couvrent toute la diapo (ils sont la diapo) et les voiles posés par-dessus tout (la participation, le bandeau) */
const chevauche = (pg, sel) => pg.evaluate(sel => { const m = document.querySelector(sel); const f = m && m.querySelector(':scope > .dr-fil'); if (!f) return null;
  const fr = f.getBoundingClientRect(), pr = f.querySelector('i').getBoundingClientRect(); const Z = [{ l: fr.left - 1, r: fr.right + 1, t: fr.top, b: fr.bottom, n: 'trait' }, { l: pr.left, r: pr.right, t: pr.top, b: pr.bottom, n: 'point' }];
  const FONDS = '.ecran, .corpsd, .ouv, .f-tab, .doc, .oral-carte, .attente, .quiw, .bandeau, .scene, .murcadre'; const vis = el => { for (let x = el; x && x !== m; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return true; };
  const clip = (el, r) => { let a = { left: r.left, right: r.right, top: r.top, bottom: r.bottom }; for (let x = el; x && x !== m; x = x.parentElement) { const s = getComputedStyle(x); if (s.overflow !== 'visible' || s.overflowX !== 'visible' || s.overflowY !== 'visible') { const b = x.getBoundingClientRect(); a = { left: Math.max(a.left, b.left), right: Math.min(a.right, b.right), top: Math.max(a.top, b.top), bottom: Math.min(a.bottom, b.bottom) }; } } return a; };
  const out = []; let n = 0; const tester = (r, quoi) => { n++; for (const z of Z) { const w = Math.min(r.right, z.r) - Math.max(r.left, z.l), h = Math.min(r.bottom, z.b) - Math.max(r.top, z.t); if (w > 0.5 && h > 0.5) out.push(z.n + ' × ' + quoi); } };
  const tw = document.createTreeWalker(m, NodeFilter.SHOW_TEXT); let t; while ((t = tw.nextNode())) { if (!t.nodeValue.trim() || f.contains(t) || !vis(t.parentElement)) continue; const rg = document.createRange(); rg.selectNodeContents(t); Array.from(rg.getClientRects()).forEach(r => { if (r.width && r.height) tester(clip(t.parentElement, r), 'texte « ' + t.nodeValue.trim().slice(0, 30) + ' »'); }); }
  m.querySelectorAll('*').forEach(el => { if (f.contains(el) || el.matches(FONDS) || !el.getClientRects().length || !vis(el)) return; const s = getComputedStyle(el); const fond = !/rgba\(0, 0, 0, 0\)|transparent/.test(s.backgroundColor) || s.backgroundImage !== 'none'; const cadre = ['Top', 'Right', 'Bottom', 'Left'].some(c => parseFloat(s['border' + c + 'Width']) > 0 && !/rgba\(0, 0, 0, 0\)/.test(s['border' + c + 'Color']));
    if (fond || cadre || /^(IMG|SVG|VIDEO|CANVAS|IFRAME|TD|TH)$/i.test(el.tagName)) tester(clip(el.parentElement, el.getBoundingClientRect()), el.tagName.toLowerCase() + '.' + String(el.className && el.className.baseVal != null ? el.className.baseVal : el.className).split(' ').slice(0, 2).join('.')); });
  return { coupes: out.slice(0, 8), n }; }, sel);
/* en classe : la vignette courante (diapo, page), le compte des dévoilés ; dans l'Atelier : la ligne courante */
const ouSuisJe = pg => pg.evaluate(() => { const v = document.querySelector('#volet .vig.cour'); const d = document.querySelector('#volet .dr-d.on'); const c = document.getElementById('compte');
  return { vig: v ? v.dataset.i + (v.dataset.pg != null ? '/' + v.dataset.pg : '') : null, ligne: d ? +d.dataset.atDi : null, eid: d ? d.dataset.eid : null, compte: c ? c.textContent.trim() : '', garde: document.getElementById('garde').classList.contains('on'), page: ((document.querySelector('#mur .page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), numero: (document.getElementById('numero') || {}).textContent || '' }; });
const lignes = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ di: +d.dataset.atDi, eid: d.dataset.eid, t: (d.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) })));
const sk0 = st => { const S0 = st.site['3e'].chapitres[0].seances; return Object.keys(S0).filter(k => S0[k] && S0[k].type !== 'sommaire').sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); };
const rgb = h => { const x = parseInt(h.slice(1), 16); return 'rgb(' + (x >> 16) + ', ' + ((x >> 8) & 255) + ', ' + (x & 255) + ')'; };
const rep = async (pg, ini, txt) => { const l = await pg.$('#mur .rep.libre .ini'); if (!l) return false; await l.click(); await pg.keyboard.type(ini, { delay: 30 }); await p(200); const d = await pg.$('#mur .rep.libre .dit') || await pg.$('#mur .rep:last-of-type .dit'); await d.click(); await pg.keyboard.type(txt, { delay: 8 }); await p(200); await pg.keyboard.press('Enter'); await p(450); return true; };
const centreMur = async pg => { const r = await pg.$eval('#mur', m => { const b = m.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); await pg.mouse.move(r.x, r.y); return r; };

dire('C16 · sonde du fil de la séance, des flèches de la colonne et de la molette · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex') + ' · ' + fs.statSync(FICHIER).size + ' o' + (MEDIAS ? ' · tableaux : ' + MEDIAS : ' · tableaux : l’image 16/9 du canon 1'));
const CANON = { fil: rgb('#5d727f'), point: rgb('#3e7c79'), bord: rgb('#eaf0f3'), nuit: rgb('#1f3b4d') };

/* (C16, les dernières dettes ⑯) LE POINT GLISSE — relevé image par image, sans dépendre d'un instant choisi : dans la fenêtre du tableau, à chaque image
   (`requestAnimationFrame`), la hauteur du point, de la flèche jusqu'à 1,5 s après ; l'heure de la flèche lue au pilote (`keydown`, `timeStamp`), les deux sur la
   même horloge (`performance.timeOrigin`). Le glissement est vrai si : au moins une position est strictement entre le départ et l'arrivée (à plus d'un pixel de
   chacun : sous le pixel, c'est l'arrondi de la mise en page) ; l'arrivée est atteinte (la dernière position relevée, que le point garde) ; le premier mouvement
   vient au plus GLISSE_DELAI ms après la flèche. Avant (jusqu'à 1cc67a1) : une seule position, lue 90 ms après la flèche — au premier tiers de la courbe
   d'accélération du point (0,6 s, cubic-bezier(.4, 0, .2, 1)), la mesure tombait à un pixel de sa limite (153 → 153 ou 154 ; MANDAT-DERNIERES-DETTES §3.2). */
const GLISSE_DELAI = 350;   /* ms. Mesuré (DERNIERES-DETTES, partie D, seule sur la machine, dix fois à ce passage) : avant les quatre dettes (b9392b5), le premier mouvement au tableau de 186 à 291 ms ; avec elles (1cc67a1), de 351 à 480 ms — la colonne des vignettes, redessinée avant que la fenêtre du tableau puisse dessiner. 350 ms : le plus lent de b9392b5 et une marge de 60 ms ; 1cc67a1 y échoue dix fois sur dix. Une limite qui laisse passer le retard que le mandat cherche serait complaisante. (DERNIERES-DETTES/NOTE.md §3, point 2) */
const glissement = async (pg, fen) => { await fen.evaluate(() => { const m = document.querySelector('#mur2'); window.__GL = []; const t0 = performance.now(); const f = () => { const fl = m && m.querySelector(':scope > .dr-fil'); const i = fl && fl.querySelector('i'); if (i) window.__GL.push([performance.timeOrigin + performance.now(), i.getBoundingClientRect().top - m.getBoundingClientRect().top]); if (performance.now() - t0 < 1500) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  await pg.evaluate(() => { window.__KD = null; document.addEventListener('keydown', e => { if (e.key === 'ArrowRight' && window.__KD == null) window.__KD = performance.timeOrigin + e.timeStamp; }, { capture: true, once: true }); });
  await pg.keyboard.press('ArrowRight'); await p(1700); const kd = await pg.evaluate(() => window.__KD); const L = await fen.evaluate(() => window.__GL); if (!L || L.length < 2 || kd == null) return null;
  const a = L[0][1], z = L[L.length - 1][1]; const prem = L.find(x => Math.abs(x[1] - a) > 0.01); const entre = L.filter(x => Math.min(a, z) + 1 < x[1] && x[1] < Math.max(a, z) - 1); const arr = L.find(x => Math.abs(x[1] - z) < 0.01);
  const t1 = await filDe(fen, '#mur2'); return { avant: Math.round(a), apres: Math.round(z), images: L.length, entre: entre.length, premier: prem ? Math.round(prem[0] - kd) : null, fin: arr ? Math.round(arr[0] - kd) : null, arrivee: Math.abs(t1.top - z) <= 1 && Math.abs(z - a) > 1 }; };

/* ═══ A · l'heure 1 de la séance 1, aux trois tailles ═══ */
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
let rangsClasse = null;
for (const [W, H] of (joue('A') ? TAILLES : [])) { const T = W + '×' + H; dire(''); dire('══ A · ' + T + ' · mode test, ' + CLASSE + ', la case du 14/09 08:57, l’heure 1 de la séance 1 ══');
  const o = await ouvrir({ W, H }); const pg = o.pg;
  verif('A', await lancerClasse(o), T + ' · l’heure se lance par la case de l’emploi du temps (« ▶ Ouvrir le pilotage et lancer »)');
  const fen = await ouvrirTableau(o, W, H); verif('A', !!fen, T + ' · « Ouvrir le tableau » ouvre la fenêtre du tableau'); if (!fen) { await fin('A', o, T + ' · '); continue; }
  const vig = await pg.evaluate(() => Array.from(document.querySelectorAll('#volet .vig')).map(v => v.dataset.i + (v.dataset.pg != null ? '/' + v.dataset.pg : '')));
  const deuxPages = vig.filter(x => /\/1$/.test(x)).map(x => +x.split('/')[0]); verif('A', deuxPages.length >= 1, T + ' · la séance de la sonde a une diapo à deux pages au tableau (« Les hypothèses de la classe ») — sinon le cas n’est pas joué', vig.join(' '));
  await pg.click('#numero'); await p(300);
  const suite = []; let precedente = null, n = 0, gl = null; const hors = [];
  while (n < 160) { const ici = await ouSuisJe(pg); const di = ici.vig ? +ici.vig.split('/')[0] : null;
    const nouvelle = !suite.length || suite[suite.length - 1].di !== di; if (nouvelle) await p(700);   /* le point a fini de glisser */
    const fp = await filDe(pg, '#mur'), ft = await filDe(fen, '#mur2');
    if (nouvelle) { suite.push({ di, rangP: fp.rang, rangT: ft.rang, yP: fp.y, yT: ft.y, nP: fp.n, nT: ft.n, vieux: (fp.vieux || 0) + (ft.vieux || 0), ys: [fp.y], sombre: fp.sombre, coul: [fp.coul, fp.point, fp.bord], coulT: [ft.coul, ft.point, ft.bord], trans: fp.trans, titre: ici.numero.replace(/\s+/g, ' ').slice(0, 70) });
      const cp = await chevauche(pg, '#mur'), ct = await chevauche(fen, '#mur2'); if (!cp || cp.coupes.length || !ct || ct.coupes.length) hors.push({ di, quand: 'à l’arrivée', pilote: cp, tableau: ct });
      await capt(pg, 'A-' + T + '-d' + di + '-pilote'); await fen.screenshot({ path: CAPT ? path.join(CAPT, 'A-' + T + '-d' + di + '-tableau.png') : path.join(OUT, '_t.png') }).catch(() => {}); }
    else suite[suite.length - 1].ys.push(fp.y, ft.y);
    const e = await pg.evaluate(() => { const E = seance().ecrans; return { role: E[S.di].role || '', q: (E[S.di].blocs || []).some(b => b.t === 'question'), reps: document.querySelectorAll('#mur .rep:not(.libre)').length, libre: !!document.querySelector('#mur .rep.libre'), qVue: !!document.querySelector('#mur p.q:not(.pas)'), fini: /^(\d+) \/ \1 dévoilés/.test((document.getElementById('compte') || {}).textContent || '') }; });
    if (e.role === 'fin') break;
    if (e.q && e.qVue && e.libre && e.reps < 2) { await rep(pg, 'AE', 'La barque est toute petite, les vagues la cachent presque.'); await rep(pg, 'CJ', 'Le ciel noir prend presque tout le tableau.'); await pg.click('#numero'); await p(700);
      const cp = await chevauche(pg, '#mur'), ct = await chevauche(fen, '#mur2'); verif('A', cp && !cp.coupes.length && ct && !ct.coupes.length, T + ' · la question avec deux réponses d’élèves : aucun chevauchement du fil, au pilote et au tableau', { pilote: cp, tableau: ct });
      await capt(pg, 'A-' + T + '-question-pilote'); await fen.screenshot({ path: CAPT ? path.join(CAPT, 'A-' + T + '-question-tableau.png') : path.join(OUT, '_t.png') }).catch(() => {}); }
    if (e.fini) { const cp = await chevauche(pg, '#mur'), ct = await chevauche(fen, '#mur2'); if (!cp || cp.coupes.length || !ct || ct.coupes.length) hors.push({ di, quand: 'tout dévoilé', pilote: cp, tableau: ct }); }
    const glisse = W === 1536 && !gl && suite.length === 2 && e.fini;   /* au passage de la diapo 2 à la 3 : le point glisse */
    if (glisse) { gl = await glissement(pg, fen); }
    else { await pg.keyboard.press('ArrowRight'); await p(300); }
    n++; }
  const der = suite[suite.length - 1]; const N = +(String(der.rangP || '0/0').split('/')[1]);
  verif('A', suite.length >= 12 && suite.every(s => s.nP === 1 && s.nT === 1 && !s.vieux), T + ' · chaque diapo de l’heure, du début du chapitre au cahier de textes, porte UN fil et son point, au pilote et au tableau (' + suite.length + ' diapos ; l’ancien fil du début de séance n’existe plus)', suite.filter(s => !(s.nP === 1 && s.nT === 1 && !s.vieux)).map(s => s.titre + ' · ' + s.nP + '/' + s.nT + ' vieux ' + s.vieux));
  verif('A', suite.every((s, k) => s.rangP === (k + 1) + '/' + N && s.rangT === s.rangP), T + ' · le rang de la diapo dans la séance (1 / ' + N + ', 2 / ' + N + ', …), le même au pilote et au tableau', suite.map(s => s.rangP + '|' + s.rangT).join(' '));
  verif('A', N > suite.length && suite[0].yP === 0 && suite[0].yT === 0, T + ' · la séance compte toutes ses heures (' + N + ' diapos ; ' + suite.length + ' dans l’heure 1) ; à la première diapo, le point est tout en haut du trait, au pilote et au tableau', suite.slice(0, 2).map(s => s.yP + '|' + s.yT));
  verif('A', suite.every((s, k) => !k || s.yP > suite[k - 1].yP) && suite.every(s => Math.abs(s.yP - s.yT) <= 0.01) && suite.every((s, k) => Math.abs(s.yP - k / (N - 1)) <= 0.01), T + ' · le point descend d’un cran à chaque diapo (k / ' + (N - 1) + ' de la hauteur du trait), à la même hauteur au pilote et au tableau', suite.map(s => s.yP + '|' + s.yT).join(' '));
  verif('A', suite.every(s => s.ys.every(y => Math.abs(y - s.yP) <= 0.005)), T + ' · un dévoilement ne bouge pas le point (mesuré après chaque flèche, au pilote et au tableau)', suite.filter(s => !s.ys.every(y => Math.abs(y - s.yP) <= 0.005)).map(s => s.titre + ' ' + s.ys.join(',')));
  verif('A', !hors.length, T + ' · aucun chevauchement fil / contenu, à l’arrivée et tout dévoilé, sur les ' + suite.length + ' diapos (présentation, compétences, parcours, début de séance, question du chapitre, l’image pleine largeur, le tableau des cinq œuvres, la question, les deux pages, le cahier de textes), au pilote et au tableau', hors.slice(0, 3));
  const debut = suite.find(s => /début de séance/i.test(s.titre)), parc = suite.find(s => /parcours/i.test(s.titre)); const sombres = suite.filter(s => s.sombre).map(s => s.titre.replace(/^Diapo \d+ sur \d+ · heure \d+ · /, '')), claires = suite.filter(s => !s.sombre);
  verif('A', debut && debut.sombre && debut.coul[0] === CANON.fil && debut.coul[1] === CANON.point && debut.coul[2] === CANON.bord && JSON.stringify(debut.coulT) === JSON.stringify(debut.coul), T + ' · sur le bleu nuit (le début de séance), le fil a les couleurs du canon 4 (trait #5d727f, point #3e7c79 cerclé #eaf0f3), au pilote et au tableau', debut && { pilote: debut.coul, tableau: debut.coulT });
  verif('A', parc && JSON.stringify(sombres) === JSON.stringify(['présentation du chapitre', 'problématique', 'début de séance'])   /* C16 (micro 2) : la problématique suit la présentation du chapitre */ && suite.every(s => s.sombre ? (s.coul[0] === CANON.fil && s.coul[1] === CANON.point) : (s.coul[0] === CANON.nuit && s.coul[1] === CANON.nuit)) && suite.every(s => JSON.stringify(s.coulT) === JSON.stringify(s.coul)), T + ' · sur les ' + claires.length + ' diapos claires (compétences, parcours, les diapos de cours, le cahier de textes), le fil prend le bleu nuit de la charte (#1f3b4d) ; les couleurs du canon 4 sur les trois diapos au bleu nuit seulement ; les mêmes au tableau', { sombres, parcours: parc && parc.coul });
  if (W === 1536) verif('A', gl && gl.entre >= 1 && gl.arrivee && gl.premier != null && gl.premier <= GLISSE_DELAI && gl.apres > gl.avant && /top/.test(suite[0].trans), T + ' · le point glisse d’une diapo à la suivante, relevé image par image au tableau (de la flèche à la fin) : ' + (gl ? gl.entre + ' position(s) strictement entre le départ (' + gl.avant + ' px) et l’arrivée (' + gl.apres + ' px), l’arrivée atteinte ' + gl.fin + ' ms après la flèche, le premier mouvement ' + gl.premier + ' ms après (au plus ' + GLISSE_DELAI + ' ms)' : 'pas relevé') + ' ; la seule transition : « top »', { gl, transition: suite[0].trans });
  if (!rangsClasse) rangsClasse = suite.map(s => s.rangP);
  const mesure = await filDe(pg, '#mur'); verif('A', mesure.droitePoint < 4 && mesure.gauche > 2, T + ' · le fil est dans la marge de gauche (le trait à ' + mesure.gauche + ' % de la largeur, le bord droit du point à ' + mesure.droitePoint + ' %)', mesure);
  dire('      la suite de l’heure : ' + suite.map(s => s.rangP + ' ' + s.titre.replace(/^Diapo \d+ sur \d+ · heure \d+ · /, '')).join(' │ '));
  await fin('A', o, T + ' · '); }

/* ═══ B · l'Atelier : le fil des trois heures, les flèches de la colonne, Alt + flèche, la molette ═══ */
if (joue('B1') || joue('B2') || joue('B3')) { dire(''); dire('══ B · 1536×864 · l’Atelier, la séance 1 (ses trois heures) — ' + PARTIES.filter(x => /^B/.test(x)).join(', ') + ' ══'); const o = await ouvrir({ W: 1536, H: 864 }); const pg = o.pg; await ouvrirAtelier(o);
  const L = await lignes(pg); verif('B', L.length >= 20, 'la colonne de l’Atelier montre les diapos des trois heures de la séance 1 (' + L.length + ' lignes)', L.slice(0, 3));
  const N = L.length; const finH1 = L.findIndex(l => /Cahier de textes/.test(l.t)); const rangs = [];
  if (joue('B1')) { for (let k = 0; k < N; k++) { await (await pg.$('#volet [data-at-di="' + L[k].di + '"]')).click(); await p(k ? 260 : 500); rangs.push(await filDe(pg, '#mur')); }
  const ici = await ouSuisJe(pg); let fil0 = rangs[0];
  verif('B', ici.ligne === L[N - 1].di && rangs.every((f, k) => f.n === 1 && f.rang === (k + 1) + '/' + N), 'un clic sur chaque ligne de la colonne, de haut en bas : chaque diapo a son fil, de 1 / ' + N + ' à ' + N + ' / ' + N + ', dans l’ordre de la colonne', rangs.map(f => f.rang).join(' '));
  await p(800); const der = await filDe(pg, '#mur');
  verif('B', fil0.y === 0 && der.y === 1, 'le point est tout en haut à la première diapo de la séance, tout en bas à la dernière (le cahier de textes de l’heure 3)', { premiere: fil0.y, derniere: der.y });
  verif('B', finH1 > 0 && rangsClasse && rangsClasse[rangsClasse.length - 1] === rangs[finH1].rang && rangs[finH1 + 1].rang === (finH1 + 2) + '/' + N, 'l’heure 2 repart là où l’heure 1 s’arrête : son cahier de textes est ' + (rangs[finH1] || {}).rang + ' (le même qu’en classe), la première diapo de l’heure 2 ' + (rangs[finH1 + 1] || {}).rang, { classe: rangsClasse && rangsClasse[rangsClasse.length - 1] });
  await capt(pg, 'B-atelier-derniere'); }
  if (joue('B2')) {
  /* un clic dans la colonne, puis ↓ ↓ ↑ → ← */
  await (await pg.$('#volet [data-at-di="' + L[5].di + '"]')).click(); await p(400); const seq = []; for (const t of ['ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']) { await pg.keyboard.press(t); await p(300); seq.push((await ouSuisJe(pg)).ligne); }
  const att = [L[6].di, L[7].di, L[6].di, L[7].di, L[6].di]; verif('B', JSON.stringify(seq) === JSON.stringify(att), 'un clic sur la 6e ligne, puis ↓ ↓ ↑ → ← : la 7e, la 8e, la 7e, la 8e, la 7e (l’ordre de la colonne)', { lu: seq, attendu: att });
  const vis = await pg.evaluate(() => { const v = document.getElementById('volet'), c = v.querySelector('.dr-d.on'); const r = c.getBoundingClientRect(), R = v.getBoundingClientRect(); return { dedans: r.top >= R.top - 1 && r.bottom <= R.bottom + 1, main: v.classList.contains('dr-fil-main'), trait: getComputedStyle(c).outlineStyle + ' ' + getComputedStyle(c).outlineWidth }; });
  verif('B', vis.dedans && vis.main, 'la ligne courante se voit (dans la colonne, son trait d’or) et la colonne la garde visible', vis);
  /* Alt + ↓ déplace la diapo, la colonne ayant la main */
  const avant = (await lignes(pg)).map(l => l.eid); const eid = (await ouSuisJe(pg)).eid; await pg.keyboard.press('Alt+ArrowDown'); await p(700); const apres = (await lignes(pg)).map(l => l.eid); const ici2 = await ouSuisJe(pg);
  verif('B', avant.indexOf(eid) >= 0 && apres.indexOf(eid) === avant.indexOf(eid) + 1 && ici2.eid === eid, 'la colonne ayant la main, Alt + ↓ déplace la diapo d’un cran vers le bas (elle reste la courante)', { avant: avant.indexOf(eid), apres: apres.indexOf(eid) });
  await pg.keyboard.press('Alt+ArrowUp'); await p(700); verif('B', JSON.stringify((await lignes(pg)).map(l => l.eid)) === JSON.stringify(avant), 'Alt + ↑ la remet à sa place'); }
  if (joue('B3')) {
  /* la molette sur la vue centrale */
  await (await pg.$('#volet [data-at-di="' + L[5].di + '"]')).click(); await p(400); await centreMur(pg); await p(300);
  await pg.mouse.wheel(0, 100); await p(450); const m1 = await ouSuisJe(pg); await pg.mouse.wheel(0, -100); await p(450); const m2 = await ouSuisJe(pg);
  verif('B', m1.ligne === L[6].di && m2.ligne === L[5].di, 'la molette sur la diapo : un cran vers le bas = la diapo suivante, un cran vers le haut = la précédente', { bas: m1.ligne, haut: m2.ligne });
  await p(400); await pg.evaluate(() => { window.__WH = []; }); for (let k = 0; k < 20; k++) await pg.mouse.wheel(0, 6); await p(500); const m3 = await ouSuisJe(pg); const wh = await pg.evaluate(() => window.__WH.slice());
  verif('B', m3.ligne === L[6].di, 'un geste continu (vingt petits coups de 6 px rapprochés, comme un pavé tactile qui glisse) = une seule diapo', { ligne: m3.ligne, coups: wh.length, duree: wh.length ? wh[wh.length - 1] - wh[0] : 0 });
  await p(400); for (let k = 0; k < 2; k++) { await pg.mouse.wheel(0, 100); await p(330); } const m4 = await ouSuisJe(pg); verif('B', m4.ligne === L[8].di, 'deux crans espacés (330 ms) = deux diapos', m4.ligne);
  /* la diapo à deux pages */
  const hyp = (await lignes(pg)).find(l => /règles héritées/i.test(l.t)); const iH = L.findIndex(l => l.di === hyp.di);
  await (await pg.$('#volet [data-at-di="' + hyp.di + '"]')).click(); await p(600); await centreMur(pg); const h0 = await ouSuisJe(pg); const nP = +((/page 1 \/ (\d+)/.exec(h0.page) || [])[1] || 0); const pas = [h0];
  for (let k = 1; k < nP; k++) { await pg.mouse.wheel(0, 100); await p(500); pas.push(await ouSuisJe(pg)); } await pg.mouse.wheel(0, 100); await p(500); const hS = await ouSuisJe(pg); await pg.mouse.wheel(0, -100); await p(500); const hR = await ouSuisJe(pg);
  const remonte = []; for (let k = 1; k < nP; k++) { await pg.mouse.wheel(0, -100); await p(500); remonte.push(await ouSuisJe(pg)); }
  verif('B', nP >= 2 && pas.every((x, k) => x.ligne === hyp.di && x.page === 'page ' + (k + 1) + ' / ' + nP) && hS.ligne === L[iH + 1].di && hR.ligne === hyp.di && hR.page === 'page ' + nP + ' / ' + nP && remonte.every((x, k) => x.ligne === hyp.di && x.page === 'page ' + (nP - 1 - k) + ' / ' + nP), 'une diapo à ' + nP + ' pages (« Les règles héritées », heure 2, suivie de « La frise du siècle ») : la molette passe ses pages une à une, puis la diapo suivante ; en remontant, la dernière page de la diapo d’avant, puis ses pages jusqu’à la première', pas.concat([hS, hR], remonte).map(x => x.ligne + ' « ' + x.page + ' »'));
  await capt(pg, 'B-atelier-deux-pages');
  /* Ctrl + molette = le zoom */
  const z0 = await pg.$eval('#murcadre', m => Math.round(m.getBoundingClientRect().width)); const zl = (await ouSuisJe(pg)).ligne; await pg.keyboard.down('Control'); await pg.mouse.wheel(0, 100); await pg.keyboard.up('Control'); await p(500); const z1 = await pg.$eval('#murcadre', m => Math.round(m.getBoundingClientRect().width)); const zz = await ouSuisJe(pg);
  verif('B', z1 < z0 && zz.ligne === zl, 'Ctrl + molette : le zoom de la vue (la diapo rapetisse), sans changer de diapo', { avant: z0, apres: z1, ligne: zz.ligne });
  await pg.keyboard.down('Control'); await pg.mouse.wheel(0, -100); await pg.keyboard.up('Control'); await p(400);
  /* le cahier de textes : la molette ne change pas de diapo */
  await (await pg.$('#volet [data-at-di="' + L[finH1].di + '"]')).click(); await p(700); await centreMur(pg); const c0 = await ouSuisJe(pg); await pg.mouse.wheel(0, 100); await p(500); const c1 = await ouSuisJe(pg);
  verif('B', c0.ligne === L[finH1].di && c1.ligne === L[finH1].di, 'sur le cahier de textes, la molette fait défiler sa carte et ne change pas de diapo', c1.ligne); }
  verif('B', !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ')); verif('B', !o.boites.length, 'aucune boîte système', o.boites.join(' ; ')); await o.ctx.close(); }

/* ═══ C · en classe : les flèches de la colonne et la garde ═══ */
/* (C16, les dernières dettes ⑱ ; Paul 02/11 07:48 : « Dès qu'un diapo est lancé, la façon d'avancer c'est soit dévoiler, soit gel. pas de scroll ou autre ») —
   EN CLASSE, la colonne et la molette ne changent ni de diapo ni de page ; on va ailleurs par un clic sur une vignette et la garde (« Rester », « Y aller devant la
   classe », « ❄ Geler, puis y aller »), inchangée. Les parties C et D d'avant (le premier saut à la garde, puis les sauts suivants sans elle) sont remplacées. */
if (joue('C')) { dire(''); dire('══ C · 1536×864 · en classe : les flèches de la colonne ne changent pas de diapo ; la vignette et la garde ══'); const o = await ouvrir({ W: 1536, H: 864 }); const pg = o.pg;
  verif('C', await lancerClasse(o), 'l’heure lancée par la case de l’emploi du temps'); const fen = await ouvrirTableau(o, 1280, 720);
  await pg.click('#numero'); for (let k = 0; k < 30; k++) { const s = await ouSuisJe(pg); if (s.vig && +s.vig.split('/')[0] >= 2) break; await pg.keyboard.press('ArrowRight'); await p(260); }
  const s0 = await ouSuisJe(pg); const t0 = await filDe(fen, '#mur2'); const ordre = await pg.evaluate(() => Array.from(document.querySelectorAll('#volet .vig')).map(v => v.dataset.i + (v.dataset.pg != null ? '/' + v.dataset.pg : '')));
  const apresVig = v => ordre[ordre.indexOf(v) + 1];
  await (await pg.$('#volet .vig.cour')).click(); await p(400); const s1 = await ouSuisJe(pg); verif('C', s1.vig === s0.vig && !s1.garde, 'un clic sur la vignette courante : rien ne bouge', s1.vig);
  const fl = []; for (const t of ['ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowUp']) { await pg.keyboard.press(t); await p(400); const s = await ouSuisJe(pg), tt = await filDe(fen, '#mur2'); fl.push({ vig: s.vig, page: s.page, garde: s.garde, t: tt.rang }); }
  verif('C', fl.every(x => x.vig === s0.vig && x.page === s0.page && !x.garde && x.t === t0.rang), '↓ ↓ ↑ ↓ ↑ ↑ après un clic dans la colonne : ni diapo ni page ne changent, au pilote et au tableau, aucune garde', fl);
  const r0 = await ouSuisJe(pg); await pg.keyboard.press('ArrowRight'); await p(500); const r1 = await ouSuisJe(pg);
  verif('C', r1.vig === r0.vig && r1.compte !== r0.compte && !r1.garde, '→ dévoile toujours (même après un clic dans la colonne)', { avant: r0.compte, apres: r1.compte });
  const prochaine = async () => { const v = apresVig((await ouSuisJe(pg)).vig); const el = await pg.$('#volet .vig[data-i="' + String(v).split('/')[0] + '"]' + (String(v).indexOf('/') > 0 ? '[data-pg="' + String(v).split('/')[1] + '"]' : '')); if (el) { await el.scrollIntoViewIfNeeded().catch(() => {}); await el.click(); } await p(500); return v; };
  const cible = await prochaine(); const s2 = await ouSuisJe(pg); verif('C', s2.garde && s2.vig === s0.vig, 'un clic sur la vignette suivante → la garde « La classe te suivrait »', s2);
  await pg.click('#garde-non'); await p(400); const s3 = await ouSuisJe(pg), t3 = await filDe(fen, '#mur2'); verif('C', !s3.garde && s3.vig === s0.vig && t3.rang === t0.rang, '« Rester » ne change rien (le pilote et le tableau restent sur la diapo)', { pilote: s3.vig, tableau: t3.rang });
  await prochaine(); const s4 = await ouSuisJe(pg); verif('C', s4.garde, 'le clic suivant sur la vignette redemande la garde');
  await pg.click('#garde-devant'); await p(900); const s5 = await ouSuisJe(pg), t5 = await filDe(fen, '#mur2'), p5 = await filDe(pg, '#mur'); verif('C', !s5.garde && s5.vig === cible && t5.rang === p5.rang, '« Y aller devant la classe » → cette diapo, au pilote et au tableau', { vig: s5.vig, tableau: t5.rang, pilote: p5.rang });
  const apres = []; for (const t of ['ArrowDown', 'ArrowDown']) { await pg.keyboard.press(t); await p(600); const s = await ouSuisJe(pg), tt = await filDe(fen, '#mur2'); apres.push({ vig: s.vig, garde: s.garde, t: tt.rang }); }
  verif('C', apres.every(x => x.vig === s5.vig && !x.garde && x.t === t5.rang), '↓ ↓ ensuite (la garde acceptée) : toujours rien ne change — la garde acceptée ne rouvre pas la colonne', apres);
  const e0 = await ouSuisJe(pg); await pg.keyboard.press(' '); await p(500); const e1 = await ouSuisJe(pg); verif('C', e1.vig === e0.vig && e1.compte !== e0.compte, 'Espace dévoile', { avant: e0.compte, apres: e1.compte });
  const g0 = await filDe(fen, '#mur2'); const cg = await prochaine(); const g1a = await ouSuisJe(pg); await pg.click('#garde-gel'); await p(900); const g1 = await ouSuisJe(pg), tg1 = await filDe(fen, '#mur2'), pg1 = await filDe(pg, '#mur');
  verif('C', g1a.garde && g1.vig === cg && tg1.rang === g0.rang && pg1.rang !== g0.rang, '« ❄ Geler, puis y aller » (un clic sur une vignette) : Paul va à la diapo, la classe ne voit rien bouger (le tableau reste sur sa diapo)', { pilote: [g1.vig, pg1.rang], tableau: [g0.rang, tg1.rang] });
  await capt(pg, 'C-classe-gele'); await fin('C', o); }

/* ═══ D · en classe : la molette ne change ni de diapo ni de page (⑱) ═══ */
if (joue('D')) { dire(''); dire('══ D · 1536×864 · en classe : la molette ne change ni de diapo ni de page ══'); const o = await ouvrir({ W: 1536, H: 864 }); const pg = o.pg;
  verif('D', await lancerClasse(o), 'l’heure lancée par la case de l’emploi du temps'); const fen = await ouvrirTableau(o, 1280, 720); await pg.click('#numero'); await p(300);
  const d0 = await ouSuisJe(pg), t0 = await filDe(fen, '#mur2'); const crans = []; for (let k = 0; k < 6; k++) { await centreMur(pg); await pg.mouse.wheel(0, k < 4 ? 100 : -100); await p(450); const s = await ouSuisJe(pg), tt = await filDe(fen, '#mur2'); crans.push({ vig: s.vig, page: s.page, garde: s.garde, t: tt.rang }); }
  verif('D', crans.every(x => x.vig === d0.vig && x.page === d0.page && !x.garde && x.t === t0.rang), 'six crans de molette (quatre vers le bas, deux vers le haut) : ni diapo ni page ne changent, au pilote et au tableau, aucune garde', crans);
  /* la diapo à deux pages (« Les hypothèses de la classe ») : la molette ne passe pas les pages non plus */
  const L = await pg.evaluate(() => Array.from(document.querySelectorAll('#volet .vig')).map(v => ({ i: v.dataset.i, pg: v.dataset.pg }))); const deux = L.find(v => v.pg === '0');
  if (deux) { await (await pg.$('#volet .vig[data-i="' + deux.i + '"][data-pg="0"]')).click(); await p(500); if ((await ouSuisJe(pg)).garde) { await pg.click('#garde-devant'); await p(900); } await pg.click('#numero').catch(() => {}); await p(300);
    const h0 = await ouSuisJe(pg); for (let k = 0; k < 3; k++) { await centreMur(pg); await pg.mouse.wheel(0, 100); await p(450); } const h1 = await ouSuisJe(pg);
    verif('D', h1.vig === h0.vig && h1.page === h0.page && !h1.garde, 'sur une diapo à deux pages (' + h0.page + ') : trois crans, la même page', { avant: [h0.vig, h0.page], apres: [h1.vig, h1.page] }); }
  else verif('D', false, 'la diapo à deux pages de la séance de la sonde est introuvable');
  await fin('D', o); }

/* ═══ X · la coexistence avec la 8.77.1-⑩ (la conscience, 02/11 ; Paul : « garder un point de retour à portée immédiate ») : la 8.77.1-⑩ (assemblé de fc036e8 = la production,
   APP_VERSION à part ; MJPC_ANCIENNE=<fichier> sinon `git show`) écrit d'abord ce que Paul a fait sur le vrai chapitre (le début de séance et la problématique renommés) ;
   la nouvelle version écrit à son tour par des gestes ordinaires (Alt + ↓ / Alt + ↑, écrire dans deux diapos d'ouverture, « Retirer ») ; la 8.77.1-⑩ relit le même faux hub :
   les mêmes textes qu'avant, les mots de Paul, rien de vide, aucune erreur ; puis la nouvelle version relit : le canon ═══ */
if (joue('X')) { dire(''); dire('══ X · 1536×864 · la coexistence : la nouvelle version écrit, la 8.77.1-⑩ relit (point de retour), la nouvelle relit ══');
  let ANC = process.env.MJPC_ANCIENNE || null; if (!ANC) { try { const { execSync } = await import('child_process'); ANC = path.join(OUT, '_ancienne-8.77.1.html'); fs.writeFileSync(ANC, execSync('git -C "' + RACINE + '" show fc036e8:LIVRAISONS/INTEGRATION/assemble/index.html', { maxBuffer: 1e8 })); } catch (e) { ANC = null; } }
  verif('X', ANC && fs.existsSync(ANC), 'la 8.77.1-⑩ (l’assemblé de fc036e8, la production à APP_VERSION près) · md5 ' + (ANC && fs.existsSync(ANC) ? createHash('md5').update(fs.readFileSync(ANC)).digest('hex') : '—'));
  const atl = async o => { await ouvrirAtelier(o); };
  const hubDe = o => o.pg.evaluate(() => JSON.parse(JSON.stringify(window.__HUB)));
  const lignesX = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ di: +d.dataset.atDi, eid: d.dataset.eid, t: ((d.querySelector('.t') || d).textContent || '').replace(/\s+/g, ' ').trim() })));
  const lire = async (pg, eid) => { const d = await pg.$('#volet [data-eid="' + eid + '"] .t'); if (!d) return null; await d.click(); await p(900); return pg.evaluate(() => { const m = document.getElementById('mur'); return { texte: (m.innerText || '').replace(/\s+/g, ' ').trim(), ouv: (m.querySelector(':scope > .ouv') || { className: '' }).className.replace(/^ouv /, ''), illisible: /Objet non lisible/.test(m.innerText || ''), vide: !!m.querySelector('[data-vide], .p8-ecrire-vide') && !(m.innerText || '').replace(/clique ici et écris|✎/g, '').trim() }; }); };
  if (ANC && fs.existsSync(ANC)) {
    const st0 = store(); const k0 = sk0(st0)[0];
    /* X0 · la 8.77.1-⑩ : Paul renomme le début de séance et la problématique de la séance 1 (ce qu'il a fait sur le vrai chapitre) */
    let o = await ouvrir({ st: st0, fichier: ANC, test: false }); await atl(o); let L = await lignesX(o.pg);
    const ren = async (eid, nom) => { const d = await o.pg.$('#volet [data-eid="' + eid + '"] .t'); if (!d) return false; await d.dblclick(); await p(400); await o.pg.keyboard.press('Control+A'); await o.pg.keyboard.type(nom, { delay: 5 }); await o.pg.keyboard.press('Enter'); await p(1500); return true; };
    const eS = 'inv-presentation-seance-s' + k0, eQ = 'inv-problematique-s' + k0, eC = 'inv-presentation-chapitre-s' + k0, eK = 'inv-competences-chapitre-s' + k0, eP = 'inv-plan-s' + k0;
    const r1 = await ren(eS, 'S1: Poésie et peinture : le Romantisme en question'), r2 = await ren(eQ, 'Notre problématique'); await p(2500);
    const hub0 = await hubDe(o); const e0 = ((hub0.site['3e'].chapitres[0].seances[k0].deroule || {}).ecrans || []).filter(e => e && /^inv-/.test(e.eid));
    verif('X', r1 && r2 && e0.length === 2 && e0.every(e => (e.blocs || []).length && e.blocs[0].t === 'texte'), 'X0 · la 8.77.1-⑩ : Paul renomme le début de séance et la problématique ; elle les écrit au hub avec leurs blocs de texte (comme sur le vrai chapitre)', e0.map(e => e.eid + ' « ' + e.act + ' » ' + (e.blocs || []).map(b => b.t).join('+')));
    verif('X', !o.errs.length && !o.boites.length, 'X0 · la 8.77.1-⑩ : aucune erreur JS, aucune boîte système', o.errs.concat(o.boites).join(' ; ')); await o.ctx.close();
    /* X1 · la 8.77.1-⑩ relit ce hub : ce qu'elle montre aujourd'hui (la référence) */
    o = await ouvrir({ st: hub0, fichier: ANC, test: false }); await atl(o); const avantS = await lire(o.pg, eS), avantQ = await lire(o.pg, eQ); await capt(o.pg, 'X1-ancienne-avant'); await o.ctx.close();
    /* X2 · la nouvelle version : Alt + ↓ puis Alt + ↑ sur une diapo ordinaire, écrire dans la présentation du chapitre et dans les compétences du chapitre, « Retirer » le parcours */
    o = await ouvrir({ st: hub0, test: false }); await atl(o); L = await lignesX(o.pg); const ord = L.find(l => !/^inv-|^fin-/.test(l.eid));
    await (await o.pg.$('#volet [data-eid="' + ord.eid + '"] .t')).click(); await p(600); await o.pg.keyboard.press('Alt+ArrowDown'); await p(1500); await o.pg.keyboard.press('Alt+ArrowUp'); await p(2500);
    const hubA = await hubDe(o); const eA = ((hubA.site['3e'].chapitres[0].seances[k0].deroule || {}).ecrans || []).filter(e => e && /^inv-/.test(e.eid));
    verif('X', eA.length >= 2 && eA.every(e => (e.blocs || []).length && e.blocs.every(b => b.t === 'texte')), 'X2 · un geste ordinaire (Alt + ↓, Alt + ↑) : les deux diapos renommées s’écrivent au hub avec des blocs de texte (jamais sans blocs)', eA.map(e => e.eid + (e.suit ? ' suit' : '') + ' ' + (e.blocs || []).length + ' bloc(s) ' + (e.blocs || []).map(b => b.t).join('+')));
    await (await o.pg.$('#volet [data-eid="' + eC + '"] .t')).click(); await p(900); await o.pg.click('#mur > .ouv li.ouv-titre'); await o.pg.keyboard.press('End'); await o.pg.keyboard.type(' — notre chapitre', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(1800);
    await (await o.pg.$('#volet [data-eid="' + eK + '"] .t')).click(); await p(900); const cl = await o.pg.$('#mur > .ouv .ouv-cr .ouv-cl[data-p]'); let tapeK = false; if (cl) { await cl.click(); await o.pg.keyboard.press('End'); await o.pg.keyboard.type(' (à revoir)', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(1800); tapeK = true; }
    await o.pg.evaluate(s2 => { const d = document.querySelector(s2); if (d) d.scrollIntoView({ block: 'center' }); }, '#volet [data-eid="' + eP + '"]'); await p(300); await o.pg.click('#volet [data-eid="' + eP + '"] .t', { button: 'right' }); await p(400);
    await o.pg.evaluate(() => { const b = document.querySelector('#menu.on [data-a="supprimer"]'); if (b) b.click(); }); await p(700); await o.pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && Array.from(m.querySelectorAll('button')).find(x => /^Retirer$/.test(x.textContent.trim())); if (b) b.click(); }); await p(3200);
    const hub1 = await hubDe(o); const d1 = hub1.site['3e'].chapitres[0].seances[k0].deroule || {}; const e1 = (d1.ecrans || []).filter(e => e && /^inv-/.test(e.eid));
    const ecr = await o.pg.evaluate(() => window.__ECR.slice()); const horsPermis = ecr.filter(x => !/ \/site\/3e\/chapitres\/\d+\/seances\/\d+\/deroule(\/|$)/.test(x));
    verif('X', tapeK && e1.some(e => e.eid === eC && e.ouvCanon && e.blocs[0].t === 'texte' && /notre chapitre/.test(JSON.stringify(e.blocs))) && e1.some(e => e.eid === eK && e.ouvCanon && /à revoir/.test(JSON.stringify(e.blocs))) && (d1.retraits || []).includes('plan') && !e1.some(e => e.eid === eP), 'X2 · « ta version » (la présentation du chapitre, les compétences du chapitre) s’écrit en blocs de texte avec les mots de Paul, le canon sous « ouvCanon » ; le parcours retiré (retraits ' + JSON.stringify(d1.retraits) + ')', e1.map(e => e.eid + ' ' + (e.blocs || []).map(b => b.t).join('+') + (e.ouvCanon ? ' +ouvCanon' : '') + (e.suit ? ' suit' : '')));
    verif('X', !horsPermis.length && !o.errs.length && !o.boites.length, 'X2 · la nouvelle version n’écrit que le déroulé de la séance (' + ecr.length + ' écritures) ; aucune erreur JS, aucune boîte système', horsPermis.slice(0, 3).concat(o.errs, o.boites));
    await capt(o.pg, 'X2-nouvelle-ecrit'); await o.ctx.close();
    /* X3 · la 8.77.1-⑩ relit le même hub */
    o = await ouvrir({ st: hub1, fichier: ANC, test: false }); await atl(o); L = await lignesX(o.pg);
    const apS = await lire(o.pg, eS), apQ = await lire(o.pg, eQ); await capt(o.pg, 'X3-ancienne-problematique'); const apC = await lire(o.pg, eC); await capt(o.pg, 'X3-ancienne-presentation'); const apK = await lire(o.pg, eK); await capt(o.pg, 'X3-ancienne-competences');
    verif('X', apS && apQ && avantS && avantQ && apS.texte === avantS.texte && apQ.texte === avantQ.texte && !apS.vide && !apQ.vide, 'X3 · la 8.77.1-⑩ relit : le début de séance et la problématique montrent les mêmes textes qu’avant le passage de la nouvelle version', { debut: [avantS && avantS.texte.slice(0, 90), apS && apS.texte.slice(0, 90)], probleme: [avantQ && avantQ.texte.slice(0, 90), apQ && apQ.texte.slice(0, 90)] });
    verif('X', apC && /notre chapitre/.test(apC.texte) && !apC.illisible && apK && /à revoir/.test(apK.texte) && !apK.illisible && !L.some(l => l.eid === eP), 'X3 · la 8.77.1-⑩ montre les mots de Paul (la présentation, les compétences) en texte, rien d’illisible ; le parcours retiré n’y est pas', { presentation: apC && apC.texte.slice(0, 120), competences: apK && apK.texte.slice(0, 160) });
    verif('X', !o.errs.length && !o.boites.length, 'X3 · la 8.77.1-⑩ : aucune erreur JS, aucune boîte système', o.errs.concat(o.boites).join(' ; ')); await o.ctx.close();
    /* X4 · la nouvelle version relit : le canon */
    o = await ouvrir({ st: hub1, test: false }); await atl(o); L = await lignesX(o.pg);
    const nS = await lire(o.pg, eS), nQ = await lire(o.pg, eQ), nC = await lire(o.pg, eC), nK = await lire(o.pg, eK); await capt(o.pg, 'X4-nouvelle-relit');
    const nomS = (L.find(l => l.eid === eS) || {}).t;
    verif('X', nS && /ouv-debut/.test(nS.ouv) && nQ && /ouv-prob/.test(nQ.ouv) && nC && /ouv-pres/.test(nC.ouv) && /notre chapitre/.test(nC.texte) && nK && /ouv-comp/.test(nK.ouv) && /à revoir/.test(nK.texte) && !L.some(l => l.eid === eP) && /^S1: /.test(nomS || ''), 'X4 · la nouvelle version relit le même hub : le canon (début de séance, problématique, présentation et compétences avec les mots de Paul), le nom que Paul a donné, le parcours toujours retiré', { debut: nS && nS.ouv, prob: nQ && nQ.ouv, pres: nC && nC.texte.slice(0, 80), comp: nK && nK.ouv, nom: nomS });
    verif('X', !o.errs.length && !o.boites.length, 'X4 · aucune erreur JS, aucune boîte système', o.errs.concat(o.boites).join(' ; ')); await o.ctx.close();
    /* X5 · la copie de la classe (deroule_joue) : la nouvelle version joue le début de l'heure 1 (hors mode test : la copie s'écrit au faux hub) ; la 8.77.1-⑩ ouvre la Relecture.
       Une MESURE (dite dans la NOTE) : la copie s'écrit par un autre écrivain (dr-classe.js), que le tableau distant relit tel quel — elle n'est pas transformée ici */
    o = await ouvrir({ st: hub1, test: false }); const lanceX = await lancerClasse(o); await o.pg.click('#numero').catch(() => {}); for (let k = 0; k < 14; k++) { await o.pg.keyboard.press('ArrowRight'); await p(260); } await p(2500);
    const hub2 = await hubDe(o); const dj = ((hub2.site['3e'].chapitres[0].seances[k0] || {}).deroule_joue) || {}; const copie = Object.values(dj).map(c => c && c.ecrans).find(Array.isArray) || [];
    const ouvC = copie.filter(e => e && (e.blocs || []).some(b => b && b.t === 'ouverture')).map(e => e.role); await o.ctx.close();
    o = await ouvrir({ st: hub2, fichier: ANC, test: false }); await atl(o); await o.pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="relecture"]'); if (b) b.click(); }); await p(3000);
    const rel = await o.pg.evaluate(() => { const z = document.querySelector('#dr-zone') || document.body; return (z.innerText || '').replace(/\s+/g, ' '); }); await capt(o.pg, 'X5-ancienne-relecture');
    dire('      mesure X5 · la copie de la classe écrite par la nouvelle version : ' + copie.length + ' diapos, dont ' + ouvC.length + ' au canon (blocs « ouverture » : ' + ouvC.join(', ') + ') · la Relecture de la 8.77.1-⑩ : ' + (/non lisible/i.test(rel) ? 'dit « objet non lisible »' : 'ne dit rien d’illisible') + ' · extrait : ' + rel.slice(0, 260));
    verif('X', lanceX && !o.errs.length && !o.boites.length, 'X5 · la 8.77.1-⑩ ouvre la Relecture de l’heure jouée par la nouvelle version : aucune erreur JS, aucune boîte système (ce qu’elle montre : la mesure ci-dessus, dite dans la NOTE)', o.errs.concat(o.boites).join(' ; ')); await o.ctx.close();
    try { if (!process.env.MJPC_ANCIENNE) fs.unlinkSync(ANC); } catch (e) {} } }

/* ═══ E · le prompt du hub (la conscience, 02/11 ; règle de Paul : une nouvelle version met à jour les anciennes copies si c'est faisable) : au vrai hub, /site/atelier/prompts/chapitre
   vaut EXACTEMENT le seed de la 8.77.1-⑩ (seed-chapitre-8.77.1.txt, son empreinte vérifiée ici) ; « 📚 Nouveau chapitre » doit montrer le seed d'aujourd'hui ; un prompt que
   Paul a modifié reste le sien ; rien ne s'écrit au hub ═══ */
if (joue('E')) { dire(''); dire('══ E · 1536×864 · le prompt du hub (« 📚 Nouveau chapitre ») ══');
  const ANCIEN = fs.readFileSync(path.join(ici, 'seed-chapitre-8.77.1.txt'), 'utf8'); const emp = t => { let h = 2166136261 >>> 0; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return t.length + ':' + h.toString(16); };
  verif('E', emp(ANCIEN) === '7121:a53557ce', 'le seed « chapitre » de la 8.77.1-⑩ (le texte du vrai hub) : empreinte ' + emp(ANCIEN));
  const MOT_NEUF = 'LES DIAPOS D’OUVERTURE', MOT_PAUL = 'Paul : je veux toujours une séance de lecture cursive par chapitre.';
  const prompt = async val => { const st = store(); st.site.atelier = { prompts: { chapitre: val } }; const o = await ouvrir({ st, test: false }); const pg = o.pg;
    await pg.evaluate(() => atelierOuvrir()); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800); await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.at-porte-ch')).find(x => x.offsetParent !== null); if (b) b.click(); }); await p(2500);
    const v = await pg.evaluate(() => { const t = document.getElementById('at-ia-tpl-vue'); return t ? t.value : null; }); const ecr = await pg.evaluate(() => window.__ECR.filter(x => /\/site\/atelier\//.test(x))); await capt(pg, 'E-prompt-' + (val === ANCIEN ? 'ancien' : 'paul'));
    const r = { v, ecr, errs: o.errs.slice(), boites: o.boites.slice() }; await o.ctx.close(); return r; };
  const a = await prompt(ANCIEN); verif('E', a.v && a.v.indexOf(MOT_NEUF) >= 0 && a.v.indexOf('"objectif"') >= 0 && !a.ecr.length && !a.errs.length && !a.boites.length, 'au hub, l’ancien seed tel quel : « 📚 Nouveau chapitre » montre le prompt d’aujourd’hui (« ' + MOT_NEUF + ' », « objectif ») ; rien n’est écrit au hub ; aucune erreur', { trouve: a.v ? a.v.indexOf(MOT_NEUF) >= 0 : null, ecritures: a.ecr, erreurs: a.errs.concat(a.boites) });
  const b = await prompt(ANCIEN + '\n' + MOT_PAUL); verif('E', b.v && b.v.indexOf(MOT_PAUL) >= 0 && b.v.indexOf(MOT_NEUF) < 0 && !b.ecr.length && !b.errs.length && !b.boites.length, 'au hub, un prompt que Paul a modifié : il reste le sien, intact (sa phrase y est, le seed d’aujourd’hui ne le remplace pas) ; rien n’est écrit ; aucune erreur', { sienne: b.v ? b.v.indexOf(MOT_PAUL) >= 0 : null, ecritures: b.ecr, erreurs: b.errs.concat(b.boites) }); }

dire(''); dire('— fin : ' + nb + ' vérifications, ' + echecs + ' échec(s) · ' + (echecs ? 'ROUGE' : 'VERT'));
fs.writeFileSync(path.join(OUT, 'sonde-fil.txt'), R.join('\n') + '\n'); try { fs.unlinkSync(path.join(OUT, '_t.png')); } catch (e) {}
await nav.close(); process.exit(echecs ? 1 : 0);

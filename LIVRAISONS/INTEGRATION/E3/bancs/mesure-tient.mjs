// E3 · « CE QUI TIENT SUR UNE DIAPO » — chiffré forme par forme, par le moteur réel, sur la page tableau du fichier assemblé.
// usage : node mesure-tient.mjs <assemble/index.html> <dossier-de-sortie>
//   env : MJPC_HUB (le faux hub, par défaut AUDITS/INTEGRATION-DEROULE/hub) ; MJPC_FONTS (dossier des woff2 d'EB Garamond : la police
//   du tableau, que le sandbox n'a pas — sans elle, Chromium rend en DejaVu Serif, plus large, et la mesure est pessimiste) ;
//   MJPC_PLAYWRIGHT, MJPC_CHROMIUM comme les outils de la conscience.
// La mesure est CELLE DE « À régler » : `p8MesureLisible(mur)` (dr-socle.js), que `p8MesureDiapo` (dr-atelier.js) appelle sur une diapo
// rendue par `rendre` à la taille du mur du pilote. Ici la diapo est rendue par le même `rendre` dans `#mur2` de la page
// `?vue=tableau&local=1` (la fenêtre « Écran 2 »), à 1366 × 768 et 1920 × 1080 (le mur = tout l'écran, 16:9), et aussi au mur du pilote
// (1096 × 616, la taille que `p8MesureDiapo` voit) pour prouver que le verdict ne dépend pas de la taille (la mesure est en part de hauteur :
// ptDe(px) = px / (H × 0.056) × 32).
// « Tient » = total 0 : aucun chevauchement, rien hors du cadre, aucun trait à travers un mot, aucun libellé sur deux lignes, aucune police sous 26 pt.
// Une diapo de texte n'est pas mesurée par p8MesureLisible (elle n'a pas de .p8-sch) : pour elle on lit ce que `paginer` décide —
// la police (réduite de 32 vers le plancher 26 pt) et le nombre de pages.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname);
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties-mesure'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node mesure-tient.mjs <assemble/index.html> [dossier-de-sortie]'); process.exit(2); }
const HUB = path.resolve(process.env.MJPC_HUB || path.join(ici, '..', '..', '..', '..', 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const FONTS0 = process.env.MJPC_FONTS || path.join(ici, '..', 'outils', 'eb-garamond');   /* les woff2 d'EB Garamond (OFL), livrés dans E3/outils/ */
const FONTS = fs.existsSync(path.join(FONTS0, 'eb-garamond-latin-400-normal.woff2')) ? path.resolve(FONTS0) : null;
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
fs.mkdirSync(path.join(OUT, 'captures'), { recursive: true });
const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const store = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null,
  site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
const R = []; const dire = s => { R.push(s); console.log(s); };
const md5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
dire('E3 · ce qui tient sur une diapo · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + md5 + ' · ' + fs.statSync(FICHIER).size + ' o · faux hub ' + HUB + (FONTS ? ' · police EB Garamond chargée depuis ' + FONTS : ' · police : celle du sandbox (pas EB Garamond)'));

// ── les contenus d'essai (du vrai français de 3e, longueurs réalistes) ──
const FAMILLES = [
  ['Figures d\'analogie', ['comparaison', 'métaphore', 'personnification', 'allégorie', 'métaphore filée']],
  ['Figures d\'opposition', ['antithèse', 'oxymore', 'chiasme', 'antiphrase', 'paradoxe']],
  ['Figures d\'insistance', ['anaphore', 'hyperbole', 'gradation', 'répétition', 'pléonasme']],
  ['Figures d\'atténuation', ['litote', 'euphémisme', 'périphrase', 'prétérition', 'ellipse']],
  ['Figures de substitution', ['métonymie', 'synecdoque', 'antonomase', 'hypallage', 'périphrase']],
  ['Figures de construction', ['parallélisme', 'asyndète', 'polysyndète', 'inversion', 'anacoluthe']],
  ['Figures sonores', ['allitération', 'assonance', 'paronomase', 'homéotéleute', 'rime intérieure']],
  ['Figures de pensée', ['ironie', 'prosopopée', 'apostrophe', 'question rhétorique', 'épiphonème']]];
const REPERES = ['1802 : naissance de Victor Hugo', '1820 : les Méditations de Lamartine', '1827 : la préface de Cromwell', '1830 : la bataille d\'Hernani', '1831 : Notre-Dame de Paris', '1835 : la mort de Vigny', '1840 : le retour des cendres', '1843 : la mort de Léopoldine', '1848 : la révolution de Février', '1851 : le coup d\'État', '1853 : Les Châtiments', '1856 : Les Contemplations', '1857 : Les Fleurs du mal', '1862 : Les Misérables', '1870 : la chute de l\'Empire', '1874 : la première exposition impressionniste', '1885 : la mort de Victor Hugo', '1886 : le manifeste symboliste'];
const CYCLE = ['Lire le texte', 'Relever les indices', 'Formuler une hypothèse', 'Vérifier dans le texte', 'Rédiger la réponse', 'Relire', 'Corriger', 'Présenter à la classe', 'Écouter les remarques', 'Reprendre', 'Conclure', 'Garder une trace'];
const ARBRE_NOMS = ['Le vers', 'Le mètre', 'L\'alexandrin', 'L\'octosyllabe', 'La rime', 'La rime riche', 'La rime pauvre', 'Le rythme', 'La césure', 'L\'enjambement', 'Le rejet', 'La strophe', 'Le quatrain', 'Le tercet', 'Le sonnet', 'La ballade', 'Le sens', 'L\'image', 'Le thème', 'Le registre', 'Le lyrique', 'L\'épique', 'La forme', 'Le vers libre', 'La prose', 'Le poème en prose', 'La chanson', 'Le refrain', 'Le couplet', 'Le son', 'L\'allitération', 'L\'assonance', 'La voix', 'Le ton', 'Le silence', 'La pause', 'Le souffle', 'La diction', 'La lecture', 'L\'écoute'];
const CELL = ['Comparaison', 'fort comme un lion', 'Métaphore', 'un torrent de larmes', 'Personnification', 'le vent hurle', 'Hyperbole', 'mourir de rire', 'Litote', 'ce n\'est pas mal', 'Antithèse', 'le jour et la nuit', 'Oxymore', 'un silence assourdissant', 'Anaphore', 'Paris ! Paris outragé !', 'Métonymie', 'boire un verre', 'Allégorie', 'la Faucheuse', 'Gradation', 'va, cours, vole', 'Euphémisme', 'il nous a quittés'];
const ENTETES = ['Figure', 'Exemple', 'Effet', 'Famille', 'Auteur', 'Vers'];
const CONSIGNE = { t: 'consigne', txt: 'Observe le schéma et note ce qui te frappe.' };

const carte = (F, k) => FAMILLES.slice(0, F).map(f => f[0] + (k ? ' : ' + f[1].slice(0, k).join(', ') : '')).join('\n');
const frise = n => REPERES.slice(0, n).join('\n');
const cycle = n => CYCLE.slice(0, n).join('\n');
const grille = (r, c) => { const L = [ENTETES.slice(0, c).join(' | ')]; let i = 0; for (let y = 1; y < r; y++) { const cells = []; for (let x = 0; x < c; x++) cells.push(CELL[(i++) % CELL.length]); L.push(cells.join(' | ')); } return L.join('\n'); };
/* un arbre équilibré : profondeur p (racine = profondeur 1), b branches par nœud */
const arbre = (p, b) => { const L = []; let i = 0; const rec = (d) => { L.push('  '.repeat(d) + ARBRE_NOMS[(i++) % ARBRE_NOMS.length]); if (d + 1 < p) for (let j = 0; j < b; j++) rec(d + 1); }; rec(0); return L.join('\n'); };
const nbNoeuds = src => src.split('\n').length;

const ecranSchema = (forme, src, titre, avecConsigne, n) => ({ eid: 'm' + n, act: titre, dur: 5, heure: 1, blocs: [{ t: 'schema', forme, txt: titre, src, echelle: 'plein', devoilerTout: false }].concat(avecConsigne ? [CONSIGNE] : []) });

// ── le navigateur ──
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const TAILLES = [[1366, 768], [1920, 1080]];
const resultats = {};
let nCap = 0;
for (const [vw, vh] of TAILLES) {
  const ctx = await nav.newContext({ viewport: { width: vw, height: vh }, timezoneId: 'Europe/Paris' });
  await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
  const page = await ctx.newPage(); await page.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00'));
  const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
  await page.addInitScript(s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
    window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); window.__ECR.push(m + ' ' + c); return Promise.resolve(new Response('null', { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
    window.WebSocket = function () { throw new Error('websocket bloqué'); }; }, store);
  await page.goto('file://' + FICHIER + '?vue=tableau&local=1&n=3e', { waitUntil: 'load' });
  if (FONTS) { const css = [[400, 'normal'], [400, 'italic'], [500, 'normal'], [600, 'normal'], [700, 'normal'], [800, 'normal']].map(([w, st]) => `@font-face{font-family:'EB Garamond';font-weight:${w};font-style:${st};src:url('file://${path.join(FONTS, `eb-garamond-latin-${w}-${st}.woff2`)}') format('woff2'),url('file://${path.join(FONTS, `eb-garamond-latin-ext-${w}-${st}.woff2`)}') format('woff2');}`).join('\n'); await page.addStyleTag({ content: css }); }
  await page.waitForFunction(() => !!document.getElementById('mur2'), null, { timeout: 15000 }); await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => document.fonts.ready);
  const police = await page.evaluate(() => { const m = document.getElementById('mur2'); m.innerHTML = '<span class="corpsd" style="font-family:\'EB Garamond\',Georgia,serif;font-size:40px">Figures d\'analogie</span>'; const s = m.firstChild; const w = s.getBoundingClientRect().width; const ok = document.fonts.check('40px "EB Garamond"'); m.innerHTML = ''; return { ok, w: Math.round(w) }; });
  const taille = await page.evaluate(() => { const m = document.getElementById('mur2'); const r = m.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), ff: getComputedStyle(m).fontFamily }; });
  /* document.fonts.check répond vrai même sans @font-face (il cherche une police système) : la preuve est la largeur — EB Garamond ≈ 272 px, DejaVu Serif (le repli du sandbox) ≈ 293 px */
  dire(''); dire('── tableau ' + vw + ' × ' + vh + ' · #mur2 = ' + taille.w + ' × ' + taille.h + ' · police ' + (FONTS ? 'EB Garamond (chargée)' : 'de repli du sandbox (' + taille.ff + ')') + ' · largeur-test « Figures d\'analogie » à 40 px : ' + police.w + ' px');

  // la mesure, dans la page : la diapo au format du site → DR_TAB → dr_seances() → rendre(#mur2) → p8MesureLisible (schémas) / paginer (texte)
  await page.evaluate(() => { window.__mesurer = (ecran, murW, murH) => { const m = document.getElementById('mur2'); const att = document.getElementById('ses-tab-att'); if (att) att.style.display = 'none'; /* l'attente s'efface, comme dans dr_rendreMur */ if (murW) { m.style.width = murW + 'px'; m.style.height = murH + 'px'; m.style.aspectRatio = 'auto'; } else { m.style.width = ''; m.style.height = ''; m.style.aspectRatio = ''; }
    DR_TAB.si = 0; DR_TAB.ecrans = [ecran]; if (typeof DR_MEM !== 'undefined' && DR_MEM.blocs) { /* un objet neuf : relu */ }
    const e = dr_seances()[0].ecrans[0]; m._p8 = {}; const et = { si: 0, di: 0, nDev: elements(e).length, lum: [], ecr: [], taille: 1, page: 0, reps: {}, tailles: {}, textes: {}, fsBloc: {}, pilote: false };
    m.classList.add('mur'); m.classList.add('tableau'); rendre(m, et); rendre(m, et); /* deux passes : la première pose le cadre du dessin, la seconde le dessine dedans (comme p8MesureDiapo après p8Poser) */
    const r = p8MesureLisible(m); const corps = m.querySelector('.corpsd'); const H = m.clientHeight; const px = corps ? parseFloat(corps.style.fontSize) : null;
    const out = { total: r.total, chev: r.chevauchements, hors: r.horsCadre, traits: r.traits, deuxLignes: r.deuxLignes, sousPlancher: r.sousPlancher, bulles: (Object.values(r.blocs)[0] || {}).bulles || 0, details: r.details.slice(0, 6), mur: m.clientWidth + '×' + H, pages: et.pages ? et.pages.length : 1, policePt: px ? Math.round(px / (H * 0.056) * 32 * 10) / 10 : null, policeReduite: et.policeReduite || null };
    const z = m.querySelector('.p8-dessin'); if (z) { const q = z.getBoundingClientRect(); out.dessin = Math.round(q.width) + '×' + Math.round(q.height); const t = z.querySelector('text, th, td'); if (t) { const fs = t.getAttribute('font-size') || getComputedStyle(t).fontSize; out.fsDessinPt = Math.round(parseFloat(fs) / (H * 0.056) * 32 * 10) / 10; } }
    return out; }; });

  const cap = async nom => { await page.screenshot({ path: path.join(OUT, 'captures', nom + '.png') }); nCap++; };
  const mesurer = (ecran, murW, murH) => page.evaluate(([e, w, h]) => window.__mesurer(e, w, h), [ecran, murW || 0, murH || 0]);
  const cleT = vw + 'x' + vh; resultats[cleT] = {};
  const noter = (forme, cons, cle, r) => { resultats[cleT][forme + (cons ? '+consigne' : '')] = resultats[cleT][forme + (cons ? '+consigne' : '')] || {}; resultats[cleT][forme + (cons ? '+consigne' : '')][cle] = r; };
  const ligne = (cle, r) => '    ' + cle.padEnd(34) + (r.total === 0 ? 'TIENT ' : 'NON   ') + 'total ' + String(r.total).padStart(2) + ' · chev ' + r.chev + ' · hors ' + r.hors + ' · traits ' + r.traits + ' · 2 lignes ' + r.deuxLignes + ' · <26 pt ' + r.sousPlancher + ' · bulles ' + r.bulles + ' · dessin ' + (r.dessin || '-') + ' · police dessin ' + (r.fsDessinPt != null ? r.fsDessinPt + ' pt' : '-') + (r.details.length ? ' — ' + r.details.join(' ; ') : '');

  // 1 · LA CARTE : F familles × k notions, sans / avec consigne
  for (const cons of [false, true]) {
    dire(''); dire('  CARTE' + (cons ? ' + une consigne d\'une ligne' : ' seule (titre + carte)') + ' — F familles × k notions par famille');
    let maxF = {}; let dernierTient = null, premierNon = null;
    for (let k = 0; k <= 5; k++) for (let F = 1; F <= 8; F++) {
      const r = await mesurer(ecranSchema('carte', carte(F, k), 'Les figures de style', cons, 'c' + F + k + (cons ? 1 : 0))); const cle = 'carte F=' + F + ' k=' + k + ' (' + (F + F * k) + ' bulles)'; noter('carte', cons, 'F' + F + 'k' + k, r); dire(ligne(cle, r));
      if (r.total === 0) { maxF[k] = F; dernierTient = { F, k }; } else if (!premierNon || (premierNon.k === k && false)) { if (!premierNon) premierNon = { F, k }; }
      if (r.total === 0 && F === 8 && k === 0) await cap(cleT + '-carte' + (cons ? '-consigne' : '') + '-F8-k0-tient');
    }
    dire('    → la plus grande F qui tient, par k : ' + Object.keys(maxF).map(k => 'k=' + k + ' → F=' + maxF[k]).join(' ; ') + ' (k = 0 : familles seules)');
    for (let k = 0; k <= 5; k++) { const F = maxF[k] || 0; if (F) { await mesurer(ecranSchema('carte', carte(F, k), 'Les figures de style', cons, 'cap')); await cap(cleT + '-carte' + (cons ? '-consigne' : '') + '-k' + k + '-F' + F + '-tient'); } if (F < 8) { await mesurer(ecranSchema('carte', carte(F + 1, k), 'Les figures de style', cons, 'cap')); await cap(cleT + '-carte' + (cons ? '-consigne' : '') + '-k' + k + '-F' + (F + 1) + '-non'); } }
  }
  // 2 · LA FRISE : n repères
  for (const cons of [false, true]) {
    dire(''); dire('  FRISE' + (cons ? ' + une consigne d\'une ligne' : ' seule') + ' — n repères « 1830 : la bataille d\'Hernani »'); let max = 0, premierNon = 0;
    for (let n = 2; n <= 18; n++) { const r = await mesurer(ecranSchema('frise', frise(n), 'Le siècle de Victor Hugo', cons, 'f' + n)); noter('frise', cons, 'n' + n, r); dire(ligne('frise n=' + n, r)); if (r.total === 0) max = n; else if (!premierNon) premierNon = n; }
    dire('    → la frise tient jusqu\'à n = ' + max + ' repères' + (premierNon ? ' ; ne tient plus à partir de n = ' + premierNon : ''));
    if (max) { await mesurer(ecranSchema('frise', frise(max), 'Le siècle de Victor Hugo', cons, 'cap')); await cap(cleT + '-frise' + (cons ? '-consigne' : '') + '-n' + max + '-tient'); }
    if (premierNon) { await mesurer(ecranSchema('frise', frise(premierNon), 'Le siècle de Victor Hugo', cons, 'cap')); await cap(cleT + '-frise' + (cons ? '-consigne' : '') + '-n' + premierNon + '-non'); }
  }
  // 3 · L'ARBRE : profondeur p × b branches
  for (const cons of [false, true]) {
    dire(''); dire('  ARBRE' + (cons ? ' + une consigne d\'une ligne' : ' seul') + ' — profondeur p (racine = 1) × b branches par nœud → nœuds'); const tient = [];
    for (let b = 1; b <= 4; b++) for (let p = 2; p <= 6; p++) { const src = arbre(p, b); const N = nbNoeuds(src); if (N > 40) continue; const r = await mesurer(ecranSchema('arbre', src, 'La versification', cons, 'a' + p + b)); noter('arbre', cons, 'p' + p + 'b' + b, r); dire(ligne('arbre p=' + p + ' b=' + b + ' (' + N + ' nœuds)', r)); if (r.total === 0) tient.push({ p, b, N }); }
    const maxN = tient.reduce((m, t) => Math.max(m, t.N), 0), maxP = tient.reduce((m, t) => Math.max(m, t.p), 0);
    dire('    → tient : ' + tient.map(t => 'p' + t.p + '×b' + t.b + '=' + t.N).join(', ') + ' — au plus ' + maxN + ' nœuds, profondeur au plus ' + maxP);
    const gros = tient.filter(t => t.N === maxN)[0]; if (gros) { await mesurer(ecranSchema('arbre', arbre(gros.p, gros.b), 'La versification', cons, 'cap')); await cap(cleT + '-arbre' + (cons ? '-consigne' : '') + '-p' + gros.p + 'b' + gros.b + '-' + gros.N + 'noeuds-tient'); }
  }
  // 4 · LE CYCLE : n étapes
  for (const cons of [false, true]) {
    dire(''); dire('  CYCLE' + (cons ? ' + une consigne d\'une ligne' : ' seul') + ' — n étapes'); let max = 0, premierNon = 0;
    for (let n = 3; n <= 12; n++) { const r = await mesurer(ecranSchema('cycle', cycle(n), 'Répondre à une question sur un texte', cons, 'y' + n)); noter('cycle', cons, 'n' + n, r); dire(ligne('cycle n=' + n, r)); if (r.total === 0) max = n; else if (!premierNon) premierNon = n; }
    dire('    → le cycle tient jusqu\'à n = ' + max + ' étapes' + (premierNon ? ' ; ne tient plus à partir de n = ' + premierNon : ''));
    if (max) { await mesurer(ecranSchema('cycle', cycle(max), 'Répondre à une question sur un texte', cons, 'cap')); await cap(cleT + '-cycle' + (cons ? '-consigne' : '') + '-n' + max + '-tient'); }
    if (premierNon) { await mesurer(ecranSchema('cycle', cycle(premierNon), 'Répondre à une question sur un texte', cons, 'cap')); await cap(cleT + '-cycle' + (cons ? '-consigne' : '') + '-n' + premierNon + '-non'); }
  }
  // 5 · LE TABLEAU : r rangées (en-tête comprise) × c colonnes
  for (const cons of [false, true]) {
    dire(''); dire('  TABLEAU' + (cons ? ' + une consigne d\'une ligne' : ' seul') + ' — r rangées (en-tête comprise) × c colonnes, cellules d\'un à quatre mots'); const maxR = {};
    for (let c = 2; c <= 6; c++) for (let r0 = 2; r0 <= 12; r0++) { const r = await mesurer(ecranSchema('tableau', grille(r0, c), 'Les figures de style', cons, 't' + r0 + c)); noter('tableau', cons, 'r' + r0 + 'c' + c, r); dire(ligne('tableau r=' + r0 + ' c=' + c, r)); if (r.total === 0) maxR[c] = r0; }
    dire('    → la plus grande r qui tient, par c : ' + Object.keys(maxR).map(c => 'c=' + c + ' → r=' + maxR[c]).join(' ; '));
    for (const c of [2, 4, 6]) { const r0 = maxR[c]; if (r0) { await mesurer(ecranSchema('tableau', grille(r0, c), 'Les figures de style', cons, 'cap')); await cap(cleT + '-tableau' + (cons ? '-consigne' : '') + '-c' + c + '-r' + r0 + '-tient'); } }
  }
  // 6 · UNE DIAPO DE TEXTE : n lignes de L caractères → la police (32 → 26 pt) puis les pages
  dire(''); dire('  TEXTE — un bloc « texte » (titre + n lignes d\'environ L caractères) : la police descend de 32 pt vers le plancher 26 pt, puis les pages');
  const PHRASE = 'La photographie, née en 1839, change le regard des peintres sur le monde réel et sur la lumière du jour. ';
  const ligneDe = L => { let s = ''; while (s.length < L) s += PHRASE; return s.slice(0, L).replace(/\s+\S*$/, '') + '.'; };
  resultats[cleT].texte = {};
  for (const L of [40, 60, 80, 100]) {
    let max32 = 0, max1page = 0, premier2 = 0, dernier = null;
    for (let n = 1; n <= 24; n++) { const el = []; for (let i = 0; i < n; i++) el.push(ligneDe(L)); const ecran = { eid: 'x' + n, act: 'Le siècle des inventions', dur: 5, heure: 1, blocs: [{ t: 'texte', txt: 'Le siècle des inventions', el }] }; const r = await mesurer(ecran); resultats[cleT].texte['L' + L + 'n' + n] = { pages: r.pages, policePt: r.policePt }; if (r.pages === 1 && r.policePt >= 31.9) max32 = n; if (r.pages === 1) max1page = n; if (r.pages >= 2 && !premier2) premier2 = n; dernier = r; if (n <= 24 && (n % 4 === 0 || premier2 === n)) dire('    L=' + L + ' n=' + String(n).padStart(2) + ' → police ' + r.policePt + ' pt · ' + r.pages + ' page(s)'); }
    dire('    → L≈' + L + ' car. : à 32 pt sans réduction jusqu\'à ' + max32 + ' lignes (' + (max32 * L) + ' car.) ; une seule page (police ≥ 26 pt) jusqu\'à ' + max1page + ' lignes (' + (max1page * L) + ' car.) ; 2 pages à partir de ' + premier2 + ' lignes');
    { const el = []; for (let i = 0; i < max1page; i++) el.push(ligneDe(L)); await mesurer({ eid: 'cap', act: 'Le siècle des inventions', dur: 5, heure: 1, blocs: [{ t: 'texte', txt: 'Le siècle des inventions', el }] }); await cap(cleT + '-texte-L' + L + '-n' + max1page + '-une-page'); }
  }
  // 7 · la preuve que le verdict ne dépend pas de la taille : les mêmes cartes au mur du pilote (1096 × 616, ce que p8MesureDiapo voit)
  if (vw === 1366) { dire(''); dire('  LE MUR DU PILOTE (1096 × 616, la taille que « À régler » / p8MesureDiapo mesure) — les mêmes cartes, sans consigne, pour comparaison'); const diff = [];
    for (let k = 0; k <= 5; k++) for (let F = 1; F <= 8; F++) { const r = await mesurer(ecranSchema('carte', carte(F, k), 'Les figures de style', false, 'p' + F + k), 1096, 616); const r2 = resultats[cleT]['carte']['F' + F + 'k' + k]; if ((r.total === 0) !== (r2.total === 0)) diff.push('F' + F + ' k' + k + ' : pilote ' + r.total + ' / tableau ' + r2.total); }
    dire('    → verdict identique sur les 48 cartes : ' + (diff.length ? 'NON — ' + diff.join(' ; ') : 'oui (tient / ne tient pas, les mêmes)'));
    await mesurer({ eid: 'z', act: 'vide', dur: 1, heure: 1, blocs: [] }, 0, 0); }
  dire(''); dire('  erreurs JS dans la page tableau : ' + errs.length + (errs.length ? ' — ' + errs.slice(0, 3).join(' | ') : ''));
  await ctx.close();
}
await nav.close();
fs.writeFileSync(path.join(OUT, 'mesure-tient.txt'), R.join('\n') + '\n'); fs.writeFileSync(path.join(OUT, 'mesure-tient.json'), JSON.stringify(resultats, null, 1));
dire(''); dire('sortie : ' + path.join(OUT, 'mesure-tient.txt') + ' · ' + nCap + ' captures dans ' + path.join(OUT, 'captures'));

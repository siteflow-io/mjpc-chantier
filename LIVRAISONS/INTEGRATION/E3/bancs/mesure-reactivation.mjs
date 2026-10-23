// E3 · LA DIAPO DE RÉACTIVATION CONSTRUITE (§12.22 / §12.25) : ce qui tient — mesure anticipée sur la forme du contrat (quatre blocs texte), à confirmer sur la diapo réelle d'E2/E4 — dérivé de mesure-tient.mjs (même scaffold, même moteur), par le moteur réel, sur la page tableau du fichier assemblé.
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



  // LA RÉACTIVATION CONSTRUITE (§12.25 (8)) : quatre blocs « texte » — « La dernière fois » (activités faites), « À reprendre » (décisions), « Les notions », « Le travail »
  const ACT = ['Activité 1 — Analyse d\'images : la routine', 'Activité 2 — Les cinq tableaux', 'Activité 3 — Les hypothèses de la classe', 'Activité 4 — Le siècle des inventions', 'Activité 5 — La frise du siècle', 'Activité 6 — Les mouvements du siècle'];
  const REP = ['Activité 3 — Les hypothèses de la classe (à reprendre)', 'Activité 4 — Le siècle des inventions (glisse)', 'Activité 5 — La frise du siècle (à reprendre)', 'Activité 6 — Les mouvements du siècle (glisse)'];
  const NOT = ['la comparaison', 'la métaphore', 'le registre lyrique', 'le champ lexical', 'la personnification', 'le vers et la strophe', 'la rime', 'le Romantisme'];
  const TRA = ['Lis « L\'Albatros » deux fois.', 'Apprends la fiche sur les figures d\'analogie.', 'Relis la frise du siècle.'];
  const diapo = (a, r, n, t, k) => ({ eid: 'react-h2-s' + k, act: 'Où en sommes-nous ?', dur: 3, heure: 2, role: 'reactivation', blocs: [
    { t: 'texte', txt: 'La dernière fois', el: ACT.slice(0, a) }, { t: 'texte', txt: 'À reprendre', el: REP.slice(0, r) },
    { t: 'texte', txt: 'Les notions', el: NOT.slice(0, n) }, { t: 'texte', txt: 'Le travail', el: TRA.slice(0, t) }].filter(b => b.el.length) });
  resultats[cleT].reactivation = {};
  dire(''); dire('  RÉACTIVATION — quatre blocs texte (titre + lignes) : a activités, r à reprendre, n notions, t travail → lignes en tout (titres compris)');
  const CAS = [[1,0,1,1],[1,1,1,1],[2,1,2,1],[2,1,3,1],[3,1,3,1],[3,2,3,1],[3,2,4,1],[4,2,4,1],[4,2,5,1],[4,3,5,1],[5,3,5,2],[6,4,6,2],[6,4,8,3]];
  let max32 = null, max1 = null, premier2 = null;
  for (const [a, r, n, t] of CAS) { const d = diapo(a, r, n, t, a + '' + r + n + t); const total = d.blocs.length + a + r + n + t; const res = await mesurer(d);
    resultats[cleT].reactivation[a + '/' + r + '/' + n + '/' + t] = { total, pages: res.pages, policePt: res.policePt };
    dire('    a=' + a + ' r=' + r + ' n=' + n + ' t=' + t + ' → ' + String(total).padStart(2) + ' lignes · police ' + res.policePt + ' pt · ' + res.pages + ' page(s)');
    if (res.pages === 1 && res.policePt >= 31.9) max32 = total; if (res.pages === 1) max1 = total; if (res.pages >= 2 && premier2 == null) { premier2 = total; await cap(cleT + '-reactivation-' + total + 'lignes-2pages'); } if (res.pages === 1 && (total === 11 || total === 13)) await cap(cleT + '-reactivation-' + total + 'lignes-une-page'); }
  dire('    → à 32 pt sans réduction jusqu\'à ' + max32 + ' lignes (titres compris) ; une seule page (police ≥ 26 pt) jusqu\'à ' + max1 + ' lignes ; 2 pages à partir de ' + premier2);
  dire(''); dire('  erreurs JS dans la page tableau : ' + errs.length + (errs.length ? ' — ' + errs.slice(0, 3).join(' | ') : ''));
  await ctx.close();
}
await nav.close();
fs.writeFileSync(path.join(OUT, 'mesure-reactivation.txt'), R.join('\n') + '\n'); fs.writeFileSync(path.join(OUT, 'mesure-reactivation.json'), JSON.stringify(resultats, null, 1));
dire(''); dire('sortie : ' + path.join(OUT, 'mesure-reactivation.txt') + ' · ' + nCap + ' captures dans ' + path.join(OUT, 'captures'));

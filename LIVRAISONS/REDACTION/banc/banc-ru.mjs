// LE BANC RU — la Rédaction universelle, par le geste, sur le faux hub (jamais le vrai). Banc unique : il échoue (code 1) si un seul pas échoue.
// usage : node banc-ru.mjs [redaction.html] [redaction_dugain_v3.html de production] [dossier de sortie]
// Attendus : le mandat RU (MANDATS/REDACTION-UNIVERSELLE/MANDAT-RU.md) et le cadrage du 27/10, jamais la version jouée.
import path from 'node:path'; import fs from 'node:fs'; import { createHash } from 'node:crypto'; import { createRequire } from 'node:module';
import { hubDeDepart, installer, sessionProf } from './fauxhub.mjs'; import { COPIES, corriger, pageProd, pageRU } from './nonreg.mjs'; import { PLAN_DUGAIN, PLAN_LETTRE, corrigerSelon } from './captures.mjs';
const ICI = path.dirname(new URL(import.meta.url).pathname);
const F = path.resolve(process.argv[2] || path.join(ICI, '..', 'redaction.html'));
const PROD = path.resolve(process.argv[3] || '/home/claude/monsieurjaipascompris/redaction_dugain_v3.html');
const OUT = path.resolve(process.argv[4] || path.join(ICI, '..', 'sorties', new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-'))); fs.mkdirSync(OUT, { recursive: true });
const CAP = path.join(OUT, 'captures'); fs.mkdirSync(CAP, { recursive: true });
const pw = (() => { const r = createRequire(import.meta.url); for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { return r(c); } catch (e) {} } console.log('Playwright introuvable'); process.exit(2); })();
const L = []; let nOk = 0, nKo = 0; const dire = s => { L.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { if (ok) nOk++; else nKo++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (!ok && detail != null ? ' — ' + String(detail).slice(0, 500) : '')); return !!ok; };
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
dire(`banc RU · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · ${path.basename(F)} md5 ${md5(F)} · production ${path.basename(PROD)} md5 ${fs.existsSync(PROD) ? md5(PROD) : 'absente'}`);
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox'] });
const att = (pg, ms) => pg.waitForTimeout(ms);
async function contexte(w = 1707, h = 743, hub) {
  const ctx = await nav.newContext({ viewport: { width: w, height: h }, acceptDownloads: true }); await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
  ctx.__hub = hub || hubDeDepart();
  // le faux hub le plus récent, gardé côté banc : une page neuve le reçoit avant de démarrer (le stockage de Chrome se recopie entre onglets avec retard)
  await ctx.exposeBinding('__fauxGarder', (src, p) => { try { const v = JSON.parse(p).v; if (!ctx.__faux || v > ctx.__fauxV) { ctx.__faux = p; ctx.__fauxV = v; } } catch (e) {} });
  return ctx;
}
async function page(ctx, q, opts = {}) {
  const pg = await ctx.newPage(); pg.__errs = []; pg.__boites = []; pg.on('pageerror', e => pg.__errs.push(e.message));
  pg.on('dialog', d => { pg.__boites.push(d.message()); (opts.refuser ? d.dismiss() : d.accept()).catch(() => {}); });
  if (ctx.__faux) await pg.addInitScript(p => { try { const cur = JSON.parse(window.name || 'null'); if (!cur || !cur.__faux || cur.v < JSON.parse(p).v) window.name = p; } catch (e) { window.name = p; } }, ctx.__faux);
  await pg.addInitScript(installer, ctx.__hub); if (!opts.sansProf) await pg.addInitScript(sessionProf);
  await pg.addInitScript(() => { try { localStorage.setItem('redaction_dugain_autosave_on_validate', 'false'); } catch (e) {} });
  await pg.goto('file://' + F + q); await att(pg, 1200); return pg;
}
// prête : la classe ouverte (les copies lues au hub), ou l'écran demandé affiché — on attend l'état, jamais seulement le temps
const pret = (pg, quoi = 'classe') => pg.waitForFunction(q => { if (!window.RU) return false; const vis = id => { const e = document.getElementById(id); return e && !e.classList.contains('hidden'); };
  if (q === 'classe') return !!RU.classe && vis('ruApp') && Array.isArray(state.classe) && state.classe.length > 0 && RU.sigSuivi !== undefined && (RU.flux || RU.test);
  if (q === 'interro') return document.getElementById('interroOverlay').classList.contains('show') && !!interroState && !!state.current;
  return vis(q); }, quoi, { timeout: 12000 }).then(() => true, () => false);
// 13 · 57 : les mots de liaison d'un critère, dans l'ordre des paragraphes ; une répétition = deux paragraphes de suite qui ouvrent par le même
const CONN = ["De plus, ", "Par ailleurs, ", "D'ailleurs, ", "Qui plus est, ", "En revanche, ", "Toutefois, ", "Cependant, ", "Reste que ", "Néanmoins, ", "Plus problématique encore, ", "Plus inquiétant, ", "Surtout, ", "Pour finir, ", "En définitive, ", "Au total, ", "Au bilan, "];
const LISTES = [["De plus, ", "Par ailleurs, ", "D'ailleurs, ", "Qui plus est, "], ["En revanche, ", "Toutefois, ", "Cependant, ", "Reste que ", "Néanmoins, "], ["Plus problématique encore, ", "Plus inquiétant, ", "Surtout, ", "Pour finir, "], ["En définitive, ", "Au total, ", "Au bilan, "]];
const ouvreurs = bloc => [...bloc.matchAll(/<p class="comm-para">([^<]*?, |Reste que )/g)].map(m => m[1].replace(/&#39;/g, "'"));
const repetitions = html => html.split('<div class="critere">').slice(1).reduce((n, b) => { const o = ouvreurs(b).filter(x => CONN.includes(x)); return n + o.filter((x, i) => o.indexOf(x) !== i).length; }, 0);   // un mot qui a déjà servi dans le critère
// la règle appliquée à une fiche de la production (pour comparer « au mot de liaison près là où il se répétait »)
const sansRepetition = html => { let n = 0; const out = html.split('<div class="critere">').map((b, j) => { if (!j) return b; let prec = null;
  const servis = new Set(); return b.replace(/<p class="comm-para">([^<]*?, |Reste que )/g, (m, c) => { const cc = c.replace(/&#39;/g, "'"); if (!CONN.includes(cc)) return m; if (!servis.has(cc)) { servis.add(cc); return m; } const l = LISTES.find(L => L.includes(cc)); let j = l.indexOf(cc), t = 0; while (servis.has(l[j]) && t < l.length) { j = (j + 1) % l.length; t++; } const x = l[j]; servis.add(x); n++; return '<p class="comm-para">' + x; }); }).join('<div class="critere">'); return { html: out, n }; };
const cap = (pg, nom) => pg.screenshot({ path: path.join(CAP, nom + '.png') }).catch(() => {});
const ecr = pg => pg.evaluate(() => window.__ECR.slice());

// ═════ RU0 · la porte : sans session professeur, rien ne se lit ni ne s'écrit ═════
{ const ctx = await contexte(); const pg = await page(ctx, '?mode=prof&id=dugain', { sansProf: true });
  const v = await pg.evaluate(() => ({ porte: !document.getElementById('ruPorte').classList.contains('hidden'), app: !document.getElementById('ruApp').classList.contains('hidden') }));
  verif('RU0', v.porte && !v.app && (await ecr(pg)).length === 0, 'sans session professeur : la porte (clé ou code), aucune copie montrée, aucune écriture', JSON.stringify(v));
  await ctx.close(); }

// ═════ RU1 · « ➕ Nouveau sujet » : la grille Dugain créée par la porte ; la lettre passe « Vérifier » ═════
const HUB0 = hubDeDepart({ avecDugain: false });
const ctxA = await contexte(1707, 743, HUB0);
{ const pg = await page(ctxA, '?mode=prof'); await cap(pg, 'RU-1-liste-vide');
  const vide = await pg.textContent('#ruListe');
  verif('RU1', /vide pour l’instant/.test(vide) && !(await pg.$('#ruListe .rp-ligne')), 'sans id dans l\'adresse : « Mes rédactions » (vide au départ, le dit par niveau)', vide);
  await pg.click('text=＋ Nouvelle rédaction'); await att(pg, 200);
  await pg.click('#modalNouveau button:has-text("Vérifier")'); await att(pg, 200);
  verif('RU1', (await pg.textContent('#ruNvMsg')) === 'Colle d’abord la réponse de l’IA.', '« Vérifier » sans rien : « Colle d\'abord la réponse de l\'IA. »');
  const lettre = fs.readFileSync(path.join(ICI, '..', 'sujets', 'lettre-grande-guerre.json'), 'utf8');
  await pg.fill('#ruNvColler', lettre); await pg.click('#modalNouveau button:has-text("Vérifier")'); await att(pg, 700);
  const ml = await pg.innerText('#ruNvMsg');
  verif('RU1', /^Réponse comprise/.test(ml) && await pg.isEnabled('#ruNvCreer'), 'la lettre de la conscience (R10 bis) passe « Vérifier » : rien de refusé', ml);
  try { fs.writeFileSync(path.join(OUT, 'verifier-lettre.txt'), ml + '\n' + await pg.innerText('#ruNvInv') + '\n'); } catch (e) {}
  const casse = JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'dugain.json'), 'utf8')); casse.id = 'casse'; casse.published = true; const i0 = casse.variantes[0].criteres[0].indicateurs[0];
  i0.competences = ['c4-inconnu']; i0.descripteurs[1] = 'sans le prénom'; i0.sous[2].pop(); i0.sous[3][1].avec = 'sans citation'; casse.variantes[0].criteres[0].indicateurs[1].poids = 9;
  await pg.fill('#ruNvColler', JSON.stringify(casse)); await pg.click('#modalNouveau button:has-text("Vérifier")'); await att(pg, 700);
  const mc = await pg.innerText('#ruNvMsg');
  verif('RU1', /^Je ne peux pas utiliser cette réponse/.test(mc) && /published/.test(mc) && /c4-inconnu/.test(mc) && /\{prenom\}/.test(mc) && /sous-niveau manque/.test(mc) && /\{CIT\}/.test(mc) && /font 16 points/.test(mc) && !(await pg.isEnabled('#ruNvCreer')),
    'une réponse cassée exprès : refusée, une phrase par refus (published, compétence inconnue, {prenom}, sous-niveau, {CIT}, poids ≠ critère), « Créer » grisé', mc);
  await pg.fill('#ruNvColler', '{ "id": "x", '); await pg.click('#modalNouveau button:has-text("Vérifier")'); await att(pg, 300);
  verif('RU1', /incomplète ou mal fermée/.test(await pg.innerText('#ruNvMsg')), 'une réponse coupée : « elle est incomplète ou mal fermée »');
  await pg.fill('#ruNvColler', fs.readFileSync(path.join(ICI, '..', 'sujets', 'dugain.json'), 'utf8')); await pg.click('#modalNouveau button:has-text("Vérifier")'); await att(pg, 700);
  const md = await pg.innerText('#ruNvMsg'); await cap(pg, 'RU-1-verifier-dugain');
  verif('RU1', /^Réponse comprise/.test(md), 'la grille Dugain (sujets/dugain.json) passe « Vérifier »', md);
  await pg.waitForFunction(() => !document.getElementById('ruNvCreer').disabled, null, { timeout: 8000 }).catch(() => {});
  await pg.selectOption('#ruNvClasse', '3_franklin_aretha'); await pg.click('#ruNvCreer'); await pg.waitForURL(/vue=preparer/, { timeout: 10000 }).catch(() => {}); await att(pg, 1200);
  const cfg = await pg.evaluate(() => window.__SUJ('dugain') && window.__SUJ('dugain').config);
  const n = c => { let d = 0, s = 0, k = 0; c.variantes.forEach(v => v.criteres.forEach(cr => { k += (cr.consignes || []).length; cr.indicateurs.forEach(i => { d += i.descripteurs.length; i.sous.forEach(e => e.forEach(x => { s += 2; })); }); })); return { d, s, k }; };
  verif('RU1', cfg && JSON.stringify(n(cfg)) === JSON.stringify({ d: 80, s: 640, k: 24 }) && /vue=preparer/.test(pg.url()), '« Créer » : /redactions/dugain/config au hub, 80 niveaux, 640 sous-niveaux, 24 consignes (zéro phrase perdue) ; « Préparer le sujet » s\'ouvre', JSON.stringify({ n: cfg ? n(cfg) : null, url: pg.url().split('?')[1], ecr: await ecr(pg), boites: pg.__boites, msg: await pg.evaluate(() => (document.getElementById('ruNvMsg') || {}).textContent) }));
  verif('RU1', pg.__errs.length === 0, 'zéro erreur JS', JSON.stringify(pg.__errs)); await pg.close(); }

if (process.env.RU_SEUL === '1') { await nav.close(); dire(`— fin : ${nOk} ok · ${nKo} échec(s)`); process.exit(nKo ? 1 : 0); }
// ═════ RU2 · la classe du site (R5) : par sa clé simplifiée ou par son nom ; ses élèves ; le nom sur la fiche ═════
{ const pg = await page(ctxA, '?mode=prof&id=dugain&classe=' + encodeURIComponent('3 FRANKLIN Aretha')); await pret(pg);
  const v = await pg.evaluate(() => ({ cle: RU.classe, nom: RU.classeNom, eleves: document.querySelectorAll('#gridEleves .eleve-card, #gridEleves > div[onclick]').length, n: state.classe.length, titre: document.getElementById('ruDashTitre').textContent }));
  verif('RU2', v.cle === '3_franklin_aretha' && v.n === 12 && /3 FRANKLIN Aretha/.test(v.titre), 'classe=« 3 FRANKLIN Aretha » (le nom) → la clé 3_franklin_aretha ; ses 12 élèves du site ; « Élèves — 3 FRANKLIN Aretha »', JSON.stringify(v));
  await cap(pg, 'RU-3-tableau-de-bord');
  await pg.goto('file://' + F + '?mode=prof'); await att(pg, 1500); await pg.click('#ruListe .rp-ligne button[title^="Changer le titre"]'); await att(pg, 300);   // 13 · 60 : la classe d'une rédaction se change au crayon ✏️ de l'accueil
  const opts = await pg.$$eval('#ruCrClasse option', o => o.map(x => x.value));
  verif('RU2', opts.includes('3_franklin_aretha') && opts.includes('3E Charles de Gaulle') && !opts.some(o => o.startsWith('_')) && !opts.includes('6e_saint_michel'), '« ✏️ » de l\'accueil : les classes du site (sans les internes « _… », sans celles sans élèves), plus de liste à coller', JSON.stringify(opts));
  await pg.evaluate(() => fermerModale('modalCrayon')); await pg.close(); }
{ const pg = await page(ctxA, '?mode=prof&id=dugain&classe=3_franklin_aretha'); await pret(pg);
  verif('RU2', await pg.evaluate(() => RU.classe === '3_franklin_aretha'), 'classe=3_franklin_aretha (la clé) → la même classe'); await pg.close(); }

// ═════ RU3 · corriger une copie de bout en bout (mode interrogatif) + le mode classique ; au hub à chaque geste ═════
let pgC = await page(ctxA, '?mode=prof&id=dugain&classe=3_franklin_aretha'); await pret(pgC);
const cleA = await pgC.evaluate(() => eleveId('AUDEBERT Elise'));
const ficheA = await corriger(pgC, COPIES[0], cleA); await att(pgC, 1500);
await cap(pgC, 'RU-4-copie-interrogatif');
{ const h = await pgC.evaluate(k => window.__SUJ('dugain').copies && window.__SUJ('dugain').copies['3_franklin_aretha'][k], cleA);
  verif('RU3', h && h.sujet === 'imagination' && Object.keys(h.echelons).length === 10 && h.compteurOrthoGram === 25 && h.citationsPar && Object.keys(h.citationsPar).length === 3 && h.sousEditesPar && Object.keys(h.sousEditesPar).length === 1 && h.erreursCitation && JSON.stringify(h.erreursCitation.enonciation) === '[7]' && h.nom === 'AUDEBERT Elise',
    'une copie corrigée au clavier (1-4, C + citation, une faute marquée, + ×25, ✏️) : /redactions/dugain/copies/3_franklin_aretha/audebert_elise au hub, entière', JSON.stringify(h).slice(0, 300));
  verif('RU3', /3 FRANKLIN Aretha · Sujet d'imagination · Brevet blanc/.test(ficheA) && !/De Gaulle/.test(ficheA), 'la fiche porte le nom de la classe choisie (plus jamais « 3e De Gaulle »)'); }
{ const cleB = await pgC.evaluate(() => eleveId('BOIVIN Eden'));
  await pgC.evaluate(() => fermerInterrogatif && document.getElementById('interroOverlay').classList.contains('show') && fermerInterrogatif()); await att(pgC, 300);
  await pgC.evaluate(k => { ouvrirCopie(k); }, cleB); await att(pgC, 400);
  if (await pgC.evaluate(() => document.getElementById('interroOverlay').classList.contains('show'))) { await (await pgC.$$('.choix-sujet-btn'))[1].click(); await att(pgC, 300); await pgC.evaluate(() => basculerVersClassique()); await att(pgC, 400); }
  const avant = await pgC.evaluate(k => JSON.stringify(copieFor(k).echelons), cleB);
  const caseClassique = await pgC.$('#criteresContainer [onclick^="setEchelon"]'); if (caseClassique) { await caseClassique.click(); await att(pgC, 1300); }
  const apres = await pgC.evaluate(k => ({ e: copieFor(k).echelons, h: window.__SUJ('dugain').copies['3_franklin_aretha'][k] }), cleB);
  verif('RU3', !!caseClassique && JSON.stringify(apres.e) !== avant && apres.h && apres.h.sujet === 'reflexion' && JSON.stringify(apres.h.echelons) === JSON.stringify(apres.e), 'le mode classique : un clic sur un échelon s\'enregistre au hub', JSON.stringify(apres).slice(0, 200)); }

// ═════ RU4 · R4 bis : la fiche bloquée (des phrases pas lues), puis permise ═════
{ await pgC.evaluate(k => { if (document.getElementById('interroOverlay').classList.contains('show')) fermerInterrogatif(); ouvrirCopie(k); }, cleA); await att(pgC, 400);
  const nl = await pgC.evaluate(k => ruPhrasesNonLues(k), cleA);
  const lues = await pgC.evaluate(() => Object.keys(window.__SUJ('dugain').validations || {}).filter(k => /^[ds]~/.test(k)).length);
  verif('RU4', lues >= 10 && nl.some(x => /mots de liaison/.test(x)) && nl.some(x => /consignes/.test(x)) && !nl.some(x => /^« /.test(x)), 'R4 bis : les niveaux et sous-niveaux choisis en corrigeant sont lus (' + lues + ' au hub) ; restent les phrases jamais montrées (liaisons, phrases fixes, consignes, textes de la fiche)', JSON.stringify(nl));
  pgC.__boites.length = 0; let tel = null; pgC.once('download', d => { tel = d; });
  await pgC.evaluate(() => { state.current = state.current; exporterHTMLEleve(); }); await att(pgC, 600);
  verif('RU4', !tel && pgC.__boites.some(b => /ne sort pas encore/.test(b) && /mots de liaison/.test(b)), '« 🖨️ Exporter HTML » : la fiche ne sort pas, et la boîte dit lesquelles', JSON.stringify(pgC.__boites).slice(0, 300));
  await pgC.evaluate(() => ruOnglet('donnees', 'fiches')); await att(pgC, 300);
  const g = await pgC.evaluate(() => ({ cls: document.getElementById('ruBtnToutHTML').className, t: document.getElementById('ruBtnToutHTML').title }));
  verif('RU4', /ru-grise/.test(g.cls) && /ne sortent pas encore/.test(g.t), '« Exporter tous HTML » grisé, son infobulle dit ce qui manque', JSON.stringify(g));
  // Paul lit dans « Préparer le sujet » : les phrases communes, la fiche, les consignes des critères de la variante
  const pgP = await page(ctxA, '?mode=prof&id=dugain&vue=preparer'); await cap(pgP, 'RU-2-preparer-communes');
  for (let n = 0; n < 40; n++) { const e = await pgP.evaluate(() => { const E = ruPrepEcrans()[RU.prep.k]; return E ? E.type + (E.v ? ':' + E.v.id : '') : null; }); if (!e) break;
    if (/^(communes|fiche|consignes:imagination)/.test(e) && await pgP.isEnabled('#ruPrepValider')) { await pgP.click('#ruPrepValider'); await att(pgP, 250); continue; }
    if (await pgP.isDisabled('#ruPrepSuiv')) break; await pgP.click('#ruPrepSuiv'); await att(pgP, 120); }
  await pgP.evaluate(() => { RU.prep.k = ruPrepEcrans().findIndex(x => x.type === 'point'); ruPrepRendre(); }); await att(pgP, 300); await cap(pgP, 'RU-2-preparer-point');
  // corriger dans la case : enregistrée au hub, lue d'office ; « ✓ Je valide ce point » ; le compteur
  const c0 = await pgP.textContent('#ruPrepCompteur');
  await pgP.locator('.ru-case').nth(1).fill('Phrase réécrite par Paul dans la case.'); await pgP.mouse.click(800, 120); await att(pgP, 600);
  const casePath = await pgP.evaluate(() => { const v = window.__SUJ('dugain'); return { modifieLe: v.config.modifieLe, creeLe: v.config.creeLe, t: v.config.variantes[0].criteres[0].indicateurs[0].sous[0][0].sans, lue: v.validations && Object.keys(v.validations).filter(k => /case/.test(JSON.stringify(v.validations[k]))) }; });
  await pgP.click('#ruPrepValider'); await att(pgP, 400); const c1 = await pgP.textContent('#ruPrepCompteur');
  verif('RU15', casePath.modifieLe > casePath.creeLe, 'une phrase corrigée dans « Préparer le sujet » : le modifieLe du sujet avance (13 · 58)', JSON.stringify({ creeLe: casePath.creeLe, modifieLe: casePath.modifieLe }));
  verif('RU4', casePath.t === 'Phrase réécrite par Paul dans la case.' && casePath.lue.length >= 1 && /^0 point/.test(c0) && /^1 point validé sur 20/.test(c1), '« Préparer le sujet » : corriger dans la case l\'enregistre au hub et la compte lue ; « ✓ Je valide ce point » → « 1 point validé sur 20 »', JSON.stringify({ casePath, c0, c1 }));
  await pgP.close();
  await pgC.reload(); await pret(pgC); await att(pgC, 300);
  const nl2 = await pgC.evaluate(k => ruPhrasesNonLues(k), cleA);
  let tel2 = null; pgC.once('download', d => { tel2 = d; }); await pgC.evaluate(k => { state.current = k; exporterHTMLEleve(); }, cleA); await att(pgC, 800);
  verif('RU4', nl2.length === 0 && !!tel2, 'les phrases lues : la fiche d\'AUDEBERT Elise sort (téléchargée)', JSON.stringify(nl2));
  if (tel2) { const p = path.join(OUT, 'fiche-audebert_elise.html'); await tel2.saveAs(p); const pf = await ctxA.newPage(); await pf.goto('file://' + p); await att(pf, 300); await cap(pf, 'RU-5-fiche'); await pf.close(); } }

// ═════ RU5 · recharger → la reprise exacte ═════
{ const k2 = await pgC.evaluate(() => eleveId('CESBRON Lili'));
  await pgC.evaluate(k => { ouvrirCopie(k); }, k2); await att(pgC, 400);
  if (await pgC.evaluate(() => document.getElementById('interroOverlay').classList.contains('show'))) { await (await pgC.$$('.choix-sujet-btn'))[0].click(); await att(pgC, 300); }
  for (const t of ['4', '3', 'Enter', '3', '2', 'Enter', '2']) { await pgC.keyboard.press(t); await att(pgC, 350); }
  await att(pgC, 1300); const avant = await pgC.evaluate(() => ({ cur: state.current, etape: interroState && interroState.etape, k: interroState && interroState.k, e: JSON.stringify(copieFor(state.current).echelons) }));
  await pgC.reload(); await pret(pgC); await pret(pgC, 'interro'); await att(pgC, 300);
  const apres = await pgC.evaluate(() => ({ url: location.search, ecrans: ['ruPorte', 'ruSujets', 'ruApp', 'ruPrep'].filter(x => !document.getElementById(x).classList.contains('hidden')), cur: state.current, etape: interroState && interroState.etape, k: interroState && interroState.k, e: JSON.stringify(copieFor(state.current).echelons), ouvert: document.getElementById('interroOverlay').classList.contains('show') }));
  verif('RU5', apres.ouvert && apres.cur === avant.cur && apres.etape === avant.etape && apres.k === avant.k && apres.e === avant.e, 'recharger : la même copie, le mode interrogatif, le même point, la même étape, les mêmes choix (lus au hub)', JSON.stringify({ avant, apres }));
  verif('RU5', pgC.__errs.length === 0, 'zéro erreur JS (correction, préparation, rechargements)', JSON.stringify(pgC.__errs)); }

// ═════ RU6 · l'abonnement : un changement fait ailleurs se voit sans recharger ; le champ en cours n'est pas touché ═════
{ const pgB = await page(ctxA, '?mode=prof&id=dugain&classe=3_franklin_aretha'); await pret(pgB);
  const kD = await pgB.evaluate(() => eleveId('CHAN Aymeric'));
  await pgC.evaluate(() => { if (document.getElementById('interroOverlay').classList.contains('show')) fermerInterrogatif(); showDashboard(); }); await att(pgC, 500);
  const carte0 = await pgC.evaluate(() => document.getElementById('gridEleves').innerText);
  await pgB.evaluate(k => { ouvrirCopie(k); }, kD); await att(pgB, 400);
  if (await pgB.evaluate(() => document.getElementById('interroOverlay').classList.contains('show'))) { await (await pgB.$$('.choix-sujet-btn'))[1].click(); await att(pgB, 300); }
  await pgB.keyboard.press('3'); await att(pgB, 1800);
  const carte1 = await pgC.evaluate(() => document.getElementById('gridEleves').innerText);
  const vu = await pgC.evaluate(k => ({ s: copieFor(k).sujet, e: copieFor(k).echelons }), kD);
  verif('RU6', vu.s === 'reflexion' && Object.keys(vu.e).length === 1 && carte1 !== carte0, 'une autre page corrige la copie de CHAN Aymeric : ce tableau de bord la montre sans recharger', JSON.stringify(vu));
  // le champ en cours : une saisie dans « Sujet » (modale) n'est pas touchée par un redessin
  await pgC.evaluate(() => ouvrirSujet()); await att(pgC, 200); await pgC.click('#ruEnoncesVar .ru-enonce-var'); await pgC.keyboard.type(' ESSAI-SAISIE');
  await pgB.keyboard.press('2'); await att(pgB, 1800);
  const sa = await pgC.evaluate(() => ({ v: document.querySelector('#ruEnoncesVar .ru-enonce-var').value, focus: document.activeElement && document.activeElement.className }));
  verif('RU6', /ESSAI-SAISIE$/.test(sa.v) && sa.focus === 'ru-enonce-var', 'une saisie en cours n\'est pas touchée quand un changement arrive (le redessin attend la fin de la saisie)', JSON.stringify(sa));
  await pgC.evaluate(() => fermerModale('modalSujet'));
  await pgB.close(); }
await pgC.close();

// ═════ RU15 · 13 · 58 (Paul, 15:51-15:55) : la copie et le sujet sont des objets — l'id interne, les clés internes, l'horodatage ═════
{ const pg = await page(ctxA, '?mode=prof&id=dugain&classe=3_franklin_aretha'); await pret(pg);
  const lire = () => pg.evaluate(() => { const S = window.__SUJ('dugain'); const cles = Object.keys(window.__HUB.redactions); return { cle: cles.find(k => window.__HUB.redactions[k] === S), cfg: { idInterne: S.config.idInterne, nomCourt: S.config.nomCourt, creeLe: S.config.creeLe, modifieLe: S.config.modifieLe }, c: S.copies['3_franklin_aretha']['audebert_elise'] }; });
  const a = await lire();
  verif('RU15', a.cfg.idInterne && /^sujet_[0-9a-z]+_[0-9a-z]+$/.test(a.cfg.idInterne) && a.cle === a.cfg.idInterne && a.cfg.nomCourt === 'dugain' && a.cfg.creeLe && a.cfg.modifieLe && a.cfg.creeLe <= a.cfg.modifieLe,
    'le sujet créé : son id interne « sujet_… » (né à « Créer », sa place au hub), l\'id du JSON gardé comme nom court (« dugain », pour l\'adresse), creeLe ≤ modifieLe', JSON.stringify(a.cfg));
  verif('RU15', a.c && /^copie_[0-9a-z]+_[0-9a-z]+$/.test(a.c.id) && a.c.eleve === 'audebert_elise' && a.c.classe === '3_franklin_aretha' && a.c.sujetId === a.cfg.idInterne && a.c.creeLe && a.c.creeLe <= a.c.modifieLe,
    'la copie : son id interne « copie_… », l\'élève et la classe par leurs clés internes (jamais les noms), l\'id du sujet, creeLe ≤ modifieLe', JSON.stringify(a.c && { id: a.c.id, eleve: a.c.eleve, classe: a.c.classe, sujetId: a.c.sujetId, creeLe: a.c.creeLe, modifieLe: a.c.modifieLe }));
  await pg.waitForTimeout(1100);
  await pg.evaluate(() => { ouvrirCopie(eleveId('AUDEBERT Elise')); }); await att(pg, 400); await pg.evaluate(() => { if (!document.getElementById('interroOverlay').classList.contains('show')) ouvrirInterrogatif('indicateur_sous', 0); });
  await att(pg, 300); await pg.evaluate(() => { if (interroState.etape !== 'meilleure_citation') { interroState.etape = 'meilleure_citation'; renderInterro(); } }); await att(pg, 300);
  await pg.fill('#meilleureCitationInput', 'Je comptais les lits vides chaque matin'); await pg.dispatchEvent('#meilleureCitationInput', 'input'); await att(pg, 1600);
  const b = await lire();
  verif('RU15', b.c.id === a.c.id && b.c.creeLe === a.c.creeLe && b.c.modifieLe > a.c.modifieLe, 'une seconde correction de la même copie : le même id interne, creeLe inchangé, modifieLe avancé', JSON.stringify({ avant: a.c.modifieLe, apres: b.c.modifieLe }));
  const f = await pg.evaluate(() => genererHTMLEleve(eleveId('AUDEBERT Elise')));
  verif('RU15', !/copie_|sujet_|creeLe|modifieLe|sujetId/.test(f), 'rien de cela sur la fiche de l\'élève');
  // un nom corrigé au site : la copie n'a plus d'élève à sa clé — le tableau de bord la montre ; « Rattacher » la rend à l'élève, même id interne
  await pg.evaluate(() => { const S = window.__SUJ('dugain'); const c = JSON.parse(JSON.stringify(S.copies['3_franklin_aretha']['audebert_elise'])); c.nom = 'AUDEBERT Élise-Marie'; c.eleve = 'audebert_elise_marie'; window.__HUBPOSER('/redactions/' + c.sujetId + '/copies/3_franklin_aretha/audebert_elise_marie', c); window.__HUBPOSER('/redactions/' + c.sujetId + '/copies/3_franklin_aretha/audebert_elise', null); });
  await pg.reload(); await pret(pg); await att(pg, 500); await pg.evaluate(() => { if (document.getElementById('interroOverlay').classList.contains('show')) fermerInterrogatif(); showDashboard(); }); await att(pg, 400);
  const o = await pg.evaluate(() => ({ orph: RU.orphelines, zone: (document.getElementById('ruOrphelines') || {}).innerText || '' }));
  await cap(pg, 'RU-15-copie-a-rattacher');
  await pg.selectOption('#ruOrph_audebert_elise_marie', 'audebert_elise'); await pg.click('#ruOrphelines button:has-text("Rattacher")'); await att(pg, 1400);
  const c = await lire(); const vieux = await pg.evaluate(() => !!window.__SUJ('dugain').copies['3_franklin_aretha']['audebert_elise_marie']);
  verif('RU15', o.orph.includes('audebert_elise_marie') && /sans élève/.test(o.zone) && c.c && c.c.id === a.c.id && c.c.eleve === 'audebert_elise' && !vieux && pg.__boites.some(x => /Rattacher la copie/.test(x)),
    'une copie dont la clé d\'élève ne correspond plus (un nom corrigé) : le tableau de bord la montre ; « Rattacher » la rend à l\'élève, avec son id interne, et libère l\'ancienne place', JSON.stringify({ orph: o.orph, id: c.c && c.c.id, eleve: c.c && c.c.eleve, vieux }));
  verif('RU15', pg.__errs.length === 0, 'zéro erreur JS', JSON.stringify(pg.__errs)); await pg.close(); }

// ═════ RU10 · contrôle n°79 (A) : « {CIT} » ne sort jamais sur une fiche ═════
{ const pg = await page(ctxA, '?mode=prof&id=dugain&classe=3_franklin_aretha'); await pret(pg);
  const k = await pg.evaluate(() => eleveId('CHARRIER Line'));
  await pg.evaluate(k => ouvrirCopie(k), k); await att(pg, 400); await (await pg.$$('.choix-sujet-btn'))[0].click(); await att(pg, 400);
  await pg.keyboard.press('3'); await att(pg, 450); await pg.keyboard.press('2'); await att(pg, 300);
  await pg.click('.descripteur-case.selected .case-editer'); await att(pg, 200); await pg.fill('.descripteur-textarea', 'Tu écris juste : « {CIT} » le montre.'); await pg.mouse.click(5, 5); await att(pg, 1200);
  const nl = await pg.evaluate(k => ruPhrasesNonLues(k), k);
  pg.__boites.length = 0; let t1 = null; pg.once('download', d => { t1 = d; }); await pg.evaluate(() => { document.activeElement && document.activeElement.blur(); exporterHTMLEleve(); }); await att(pg, 600);
  verif('RU10', nl.some(x => /la phrase réécrite de « Orthographe et grammaire » attend une citation/.test(x)) && !t1 && pg.__boites.some(b => /attend une citation/.test(b)), 'une phrase réécrite au crayon qui garde « {CIT} », sans citation : la fiche ne sort pas, la boîte dit « la phrase réécrite de « … » attend une citation »', JSON.stringify({ nl, boites: pg.__boites }).slice(0, 400));
  await pg.evaluate(() => ruOnglet('donnees', 'fiches')); await att(pg, 300);
  const g = await pg.evaluate(() => document.getElementById('ruBtnToutHTML').title);
  verif('RU10', /attend une citation/.test(g), '« Exporter tous HTML » grisé le dit aussi', g);
  await pg.evaluate(k => ouvrirCopie(k), k); await att(pg, 500); if (!(await pg.evaluate(() => document.getElementById('interroOverlay').classList.contains('show')))) { await pg.evaluate(() => ouvrirInterrogatif('indicateur_sous', 0)); await att(pg, 400); }
  await pg.evaluate(() => { if (interroState.etape !== 'indicateur_sous' || interroState.k !== 0) ouvrirInterrogatif('indicateur_sous', 0); }); await att(pg, 300);
  await pg.keyboard.press('c'); await att(pg, 150); await pg.keyboard.type('les poilus attendait la lettre'); await pg.keyboard.press('Enter'); await att(pg, 1200);
  let t2 = null; pg.once('download', d => { t2 = d; }); await pg.evaluate(() => { document.activeElement && document.activeElement.blur(); exporterHTMLEleve(); }); await att(pg, 800);
  let fiche = ''; if (t2) { const p = path.join(OUT, 'fiche-charrier_line.html'); await t2.saveAs(p); fiche = fs.readFileSync(p, 'utf8'); }
  verif('RU10', !!t2 && fiche.indexOf('{CIT}') < 0 && /les poilus attendait la lettre/.test(fiche) && /Tu écris juste|tu écris juste/.test(fiche), 'la citation tapée : la fiche sort, la citation à la place de « {CIT} », plus aucun « {CIT} »', fiche ? (fiche.match(/[^.]*écris juste[^.]*\./i) || [''])[0] : 'pas de fiche');
  verif('RU10', pg.__errs.length === 0, 'zéro erreur JS', JSON.stringify(pg.__errs)); await pg.close(); }

// ═════ RU11 · contrôle n°79 (B) : l'énoncé de la fiche, entier — celui de la variante, mot pour mot ═════
{ const dg = JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'dugain.json'), 'utf8'));
  const enonceDe = h => { const m = h.match(/<div class="sujet-rappel"><strong>Sujet :<\/strong><br>([\s\S]*?)<\/div>/); return m ? m[1] : null; };
  const pg = await page(ctxA, '?mode=prof&id=dugain&classe=3_franklin_aretha'); await pret(pg);
  const esc = t => pg.evaluate(t => escapeHtml(t).replace(/\n/g, '<br>'), String(t));   // l'échappement de l'app elle-même
  const fi = await pg.evaluate(() => genererHTMLEleve(eleveId('AUDEBERT Elise'))), fr = await pg.evaluate(() => genererHTMLEleve(eleveId('BOIVIN Eden')));
  const ei = enonceDe(fi), er = enonceDe(fr);
  verif('RU11', ei === await esc(dg.variantes[0].enonce) && !/\sou\s*$/.test(ei), 'Dugain, imagination : l\'énoncé entier de la variante, mot pour mot, aucun « ou » pendant', ei);
  verif('RU11', er === await esc(dg.variantes[1].enonce) && !/\sou\s*$/.test(er), 'Dugain, réflexion : l\'énoncé entier de la variante, mot pour mot', er);
  fs.writeFileSync(path.join(OUT, 'fiche-dugain-audebert_elise.html'), fi); const enonceLettre = await esc(JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'lettre-grande-guerre.json'), 'utf8')).enonce.join('\n\n')); await pg.close();
  const ctxL = await contexte(1707, 743); const lettre = JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'lettre-grande-guerre.json'), 'utf8'));
  ctxL.__hub.redactions['lettre-grande-guerre-3e'] = { config: lettre };
  const pl = await page(ctxL, '?mode=prof&id=lettre-grande-guerre-3e&classe=3_franklin_aretha'); await pret(pl);
  await pl.evaluate(() => ouvrirCopie(eleveId('AUDEBERT Elise'))); await att(pl, 500);
  const choix = await pl.$$('.choix-sujet-btn');
  for (const t of ['3', '3', 'Enter', '4', '2', 'Enter', '2', '1']) { await pl.keyboard.press(t); await att(pl, 400); }
  await pl.evaluate(() => { document.activeElement && document.activeElement.blur(); }); await att(pl, 300);
  await cap(pl, 'RU-11-lettre-interrogatif');
  const fl = await pl.evaluate(() => genererHTMLEleve(eleveId('AUDEBERT Elise'))); const el = enonceDe(fl);
  verif('RU11', choix.length === 0 && el === enonceLettre && /Écrire une lettre de la Grande Guerre/.test(fl) && !/Brevet blanc|brevet blanc|De Gaulle/.test(fl) && fl.indexOf('{CIT}') < 0,
    'la lettre (une seule grille : pas d\'écran de choix) : l\'énoncé entier, ses quatre paragraphes ; le titre du sujet ; ni « Brevet blanc » ni « De Gaulle »', el ? el.slice(0, 200) : fl.slice(0, 300));
  const pL = path.join(OUT, 'fiche-lettre-audebert_elise.html'); fs.writeFileSync(pL, fl);
  const pf = await ctxL.newPage(); await pf.goto('file://' + pL); await att(pf, 300); await cap(pf, 'RU-5b-fiche-lettre'); await pf.close();
  const pd = await ctxL.newPage(); await pd.goto('file://' + path.join(OUT, 'fiche-dugain-audebert_elise.html')); await att(pd, 300); await cap(pd, 'RU-5a-fiche-dugain'); await pd.close();
  verif('RU11', pl.__errs.length === 0, 'zéro erreur JS (la lettre)', JSON.stringify(pl.__errs)); await ctxL.close(); }

// ═════ RU12 · contrôle n°80 (E) : les captures pour Paul — des corrections vraisemblables (niveaux cohérents, citations qui prouvent la phrase) ═════
for (const [nom, P, id] of [['dugain', PLAN_DUGAIN, 'dugain'], ['lettre', PLAN_LETTRE, 'lettre-grande-guerre-3e']]) {
  const ctx = await contexte(1707, 743); if (id !== 'dugain') ctx.__hub.redactions[id] = { config: JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'lettre-grande-guerre.json'), 'utf8')) };
  const pg = await page(ctx, '?mode=prof&id=' + id + '&classe=3_franklin_aretha'); await pret(pg);
  const { cle, fiche } = await corrigerSelon(pg, P); await att(pg, 300);
  await cap(pg, 'RU-12-' + nom + '-recapitulatif');
  const c = await pg.evaluate(k => ({ e: copieFor(k).echelons, s: copieFor(k).sousEchelons, cit: copieFor(k).citationsPar, n: copieFor(k).compteurOrthoGram, sugg: niveauOrthoSuggere(k) }), cle);
  const attendus = Object.keys(P.plan);
  const ok = attendus.every(i => c.e[i] === P.plan[i][0] && c.s[i] === P.plan[i][1] && ((c.cit[i] || '') === (P.plan[i][2] || '')));
  const cits = attendus.filter(i => P.plan[i][2]).every(i => fiche.indexOf(P.plan[i][2].replace(/'/g, '&#39;')) >= 0 || fiche.indexOf(P.plan[i][2]) >= 0);
  const compteurJuste = c.sugg === c.e[Object.keys(P.plan).find(i => /orthographe/.test(i))];
  verif('RU12', ok && cits && compteurJuste && fiche.indexOf('{CIT}') < 0, nom + ' : une copie corrigée selon un plan cohérent (tous les points au même niveau, chaque citation à la place que la phrase annonce, le compteur d\'accord avec le niveau d\'orthographe)', JSON.stringify({ ok, cits, compteurJuste, c }).slice(0, 400));
  verif('RU14', repetitions(fiche) === 0, nom + ' (la capture) : aucun mot de liaison deux fois dans un même critère (13 · 57)', fiche.split('<div class="critere">').slice(1).map(ouvreurs).map(o => o.join(' / ')).join(' || '));
  const p = path.join(OUT, 'fiche-capture-' + nom + '.html'); fs.writeFileSync(p, fiche);
  const pf = await ctx.newPage(); await pf.goto('file://' + p); await att(pf, 300); await cap(pf, 'RU-12-' + nom + '-fiche'); await pf.close();
  verif('RU12', pg.__errs.length === 0, nom + ' : zéro erreur JS', JSON.stringify(pg.__errs)); await ctx.close();
}

// ═════ RU13 · 13 · 54 (Paul, 14:12, point 561) : le compteur et le niveau d'orthographe — rien ne change en silence ═════
{ const ctx = await contexte(1707, 743); const pg = await page(ctx, '?mode=prof&id=dugain&classe=3_franklin_aretha'); await pret(pg);
  // une copie solide mais beaucoup trop courte : l'orthographe notée d'abord (9 erreurs → Satisfaisant, la longueur pas encore notée), puis la longueur à Insuffisant
  const scenario = async nom => { const k = await pg.evaluate(n => eleveId(n), nom); await pg.evaluate(k => ouvrirCopie(k), k); await att(pg, 400); await (await pg.$$('.choix-sujet-btn'))[0].click(); await att(pg, 400);
    for (let i = 0; i < 9; i++) { await pg.keyboard.press('+'); await att(pg, 15); }
    for (const [e, sb] of [[3, 1], [3, 2], [3, 2], [3, 1], [3, 1], [1, 1]]) { await pg.keyboard.press(String(e)); await att(pg, 420); await pg.keyboard.press(String(sb)); await att(pg, 200); await pg.keyboard.press('Enter'); await att(pg, 300); }
    await pg.evaluate(() => { fermerInterrogatif(); showDashboard(); }); await att(pg, 500); return k; };
  const k1 = await scenario('CHOLET Pierre');
  const d1 = await pg.evaluate(k => ({ d: ruDesaccordCompteur(k), nl: ruPhrasesNonLues(k), carte: ((document.querySelector('#gridEleves .ru-desaccord') || {}).innerText || '').replace(/\u00a0/g, ' ') }), k1);
  await cap(pg, 'RU-13-desaccord-carte');
  verif('RU13', d1.d && d1.d.choisi === 2 && d1.d.compteur === 1 && d1.d.n === 9 && /choisi « Satisfaisant », le compteur dit « Fragile » \(9 erreurs\)/.test(d1.carte) && d1.nl.some(x => /l’orthographe : tu as choisi « Satisfaisant », le compteur dit « Fragile »/.test(x)),
    'l\'orthographe à Satisfaisant avec 9 erreurs, puis la longueur à Insuffisant (seuils [2, 5, 10] → Fragile) : la carte de l\'élève le dit, la fiche ne sort pas et dit pourquoi', JSON.stringify(d1).slice(0, 400));
  await pg.click('#gridEleves .ru-desaccord button:has-text("Garder")'); await att(pg, 600);
  const g = await pg.evaluate(k => ({ d: ruDesaccordCompteur(k), e: copieFor(k).echelons.orthographe, f: genererHTMLEleve(k) }), k1);
  verif('RU13', !g.d && g.e === 2 && /Tu as fait 9 erreurs d'orthographe et de grammaire dans ta copie\.<\/span>/.test(g.f) && !/ce qui correspond au niveau/.test(g.f),
    '« Garder « Satisfaisant » » : le désaccord est tranché ; la fiche dit seulement « Tu as fait 9 erreurs d\'orthographe et de grammaire dans ta copie. » (« correspond » ne sort que s\'il est vrai)', (g.f.match(/Tu as fait[^<]*/) || [''])[0]);
  const k2 = await scenario('CHOUTEAU Baptistine');
  await pg.click('#gridEleves .ru-desaccord button:has-text("Prendre")'); await att(pg, 600);
  const p = await pg.evaluate(k => ({ d: ruDesaccordCompteur(k), e: copieFor(k).echelons.orthographe, f: genererHTMLEleve(k), lu: ruPhrasesNonLues(k).some(x => /Orthographe et grammaire/.test(x)) }), k2);
  verif('RU13', !p.d && p.e === 1 && /Tu as fait 9 erreurs d'orthographe et de grammaire dans ta copie, ce qui correspond au niveau fragile\./.test(p.f) && !p.lu && pg.__boites.some(b => /Prendre le niveau du compteur, « Fragile »/.test(b)),
    '« Prendre « Fragile » » (après la question, qui montre la phrase du niveau) : le niveau devient celui du compteur, la phrase dit « ce qui correspond au niveau fragile », et elle compte comme lue', JSON.stringify({ d: p.d, e: p.e, lu: p.lu, m: (p.f.match(/Tu as fait[^<]*/) || [''])[0] }));
  verif('RU13', pg.__errs.length === 0, 'zéro erreur JS', JSON.stringify(pg.__errs)); await ctx.close(); }

// ═════ RU7 · le mode test : rien ne part, et ça se voit ═════
{ const ctx = await contexte(); const pg = await page(ctx, '?mode=prof&id=dugain&classe=3_franklin_aretha&test=1'); await pret(pg);
  const n0 = (await ecr(pg)).length; const k = await pg.evaluate(() => eleveId('AUDEBERT Elise'));
  await pg.evaluate(k => ouvrirCopie(k), k); await att(pg, 300); await (await pg.$$('.choix-sujet-btn'))[0].click(); await att(pg, 300); await pg.keyboard.press('3'); await att(pg, 1500);
  const v = await pg.evaluate(() => ({ ecr: window.__ECR.slice(), bandeau: getComputedStyle(document.querySelector('.ru-bandeau-test')).display, temoin: document.getElementById('ruTemoin').textContent }));
  verif('RU7', n0 === 0 && v.ecr.length === 0 && v.bandeau !== 'none' && /Mode test/.test(v.temoin), 'mode test (?test=1) : une copie corrigée, zéro écriture au hub ; le bandeau violet et le témoin le disent', JSON.stringify(v));
  await pg.reload(); await pret(pg); await att(pg, 500);
  verif('RU7', (await pg.evaluate(() => window.__ECR.length)) === 0, 'mode test : recharger n\'écrit rien non plus (ce qui a été fait s\'efface avec la page)');
  await cap(pg, 'RU-7-mode-test'); await ctx.close(); }

// ═════ RU8 · la non-régression : trois copies, les mêmes gestes, la fiche mot pour mot celle de la production ═════
if (fs.existsSync(PROD)) { const ctx = await contexte(); const hub = ctx.__hub; const noms = hub.classes['3_franklin_aretha'].eleves;
  const a = await pageProd(ctx, PROD, noms); const b = await pageRU(ctx, F, hub);
  for (const cp of COPIES) {
    const fa = await corriger(a.pg, cp, await a.pg.evaluate(n => eleveId(n), cp.eleve)); let fb = await corriger(b.pg, cp, await b.pg.evaluate(n => eleveId(n), cp.eleve));
    const enoncePres = h => h.replace(/<div class="sujet-rappel">[\s\S]*?<\/div>/, '<div class="sujet-rappel">[l’énoncé]</div>');   // contrôle n°79 (B) : l'énoncé de la fiche est désormais celui de la variante, entier
    const sr = sansRepetition(enoncePres(fa.split('3e De Gaulle').join('3 FRANKLIN Aretha'))); const fa2 = sr.html; const fb0 = fb; fs.writeFileSync(path.join(OUT, 'nonreg-prod-' + cp.eleve.split(' ')[0] + '.html'), fa2); fs.writeFileSync(path.join(OUT, 'nonreg-ru-' + cp.eleve.split(' ')[0] + '.html'), fb0); fb = enoncePres(fb0);
    let diff = ''; if (fa2 !== fb) { let i = 0; while (fa2[i] === fb[i]) i++; diff = 'premier écart au signe ' + i + ' : « ' + fa2.slice(i - 40, i + 60) + ' » / « ' + fb.slice(i - 40, i + 60) + ' »'; }
    verif('RU8', fa2 === fb, cp.eleve + ' (' + (cp.variante ? 'réflexion' : 'imagination') + ') : la fiche, mot pour mot celle de redaction_dugain_v3 (au nom de classe près, à l\'énoncé près, et au mot de liaison près là où il avait déjà servi dans le critère : ' + sr.n + ')', diff);
    verif('RU14', repetitions(fb) === 0, cp.eleve + ' : aucun mot de liaison deux fois dans un même critère (13 · 57)', ouvreurs(fb).join(' | '));
  }
  verif('RU8', a.errs.length + b.errs.length === 0, 'zéro erreur JS des deux côtés', JSON.stringify(a.errs.concat(b.errs))); await ctx.close(); }
else verif('RU8', false, 'la non-régression', 'la production redaction_dugain_v3.html est introuvable : ' + PROD);

// ═════ RU9 · les tailles : 1366, 1536, 1707 × 743, 1920 — rien ne déborde en largeur ═════
for (const [w, h] of [[1366, 743], [1536, 743], [1707, 743], [1920, 1080]]) {
  const ctx = await contexte(w, h, JSON.parse(await (async () => { const c = await contexte(); const pg = await page(c, '?mode=prof'); const s = await pg.evaluate(() => JSON.stringify(window.__HUB)); await c.close(); return s; })()));
  ctx.__hub.redactions.dugain = { config: JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'dugain.json'), 'utf8')) };
  ctx.__hub.redactions['lettre-grande-guerre-3e'] = { config: JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'lettre-grande-guerre.json'), 'utf8')) };
  const res = [];
  for (const q of ['?mode=prof', '?mode=prof&id=dugain&classe=3_franklin_aretha', '?mode=prof&id=dugain&vue=preparer']) {
    const pg = await page(ctx, q); if (/vue=preparer/.test(q)) { await pg.evaluate(() => { RU.prep.k = ruPrepEcrans().findIndex(x => x.type === 'point'); ruPrepRendre(); }); await att(pg, 200); }
    if (/classe=/.test(q)) { await pg.evaluate(() => ouvrirCopie(eleveId('BOIVIN Eden'))); await att(pg, 300); const b = await pg.$$('.choix-sujet-btn'); if (b[1]) { await b[1].click(); await att(pg, 300); } await pg.keyboard.press('2'); await att(pg, 500); }
    res.push(await pg.evaluate(q => ({ q, sw: document.documentElement.scrollWidth, iw: window.innerWidth }), q)); await cap(pg, 'RU-9-' + w + 'x' + h + '-' + (q.includes('preparer') ? 'preparer' : q.includes('classe') ? 'interrogatif' : 'liste')); await pg.close();
  }
  verif('RU9', res.every(r => r.sw <= r.iw), w + ' × ' + h + ' : la liste, le mode interrogatif, « Préparer le sujet » tiennent en largeur (aucun défilement horizontal)', JSON.stringify(res));
  await ctx.close();
}

await nav.close();
dire(`— fin : ${nOk} ok · ${nKo} échec(s) — ${nKo ? 'ROUGE' : 'VERT'}`);
fs.writeFileSync(path.join(OUT, 'banc-ru.txt'), L.join('\n') + '\n');
process.exit(nKo ? 1 : 0);

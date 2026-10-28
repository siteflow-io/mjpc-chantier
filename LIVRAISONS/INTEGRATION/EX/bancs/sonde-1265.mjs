// EX · LA SONDE §12.65 PAR LE GESTE (A109) — la Structure garde la même ligne partout ; le ✕ dit ce qu'il fait ; la dictée reste une dictée ;
// le bandeau « Cette fiche a changé… » seulement sur un vrai changement (registre 13 · 85, 13 · 86, 13 · 87 ; Paul 28/10 15:49, 15:54, 15:58).
// Le faux hub reçoit le chapitre au contrat (E4/prompt/chapitre-3e-au-contrat.json) par « 📚 Nouveau chapitre » (l'import de Paul).
// 1 : (13 · 85) Structure → « ✨ Écrire avec une IA » sur un trou (« Récitation : « À une passante » ») → l'écran IA → « ← Retour au chapitre » :
//     la colonne de gauche, le milieu et le papier sur la MÊME ligne (avant : la gauche et le milieu sur la première feuille du chapitre, le papier
//     sur la feuille neuve) ; aucun curseur posé ; la feuille neuve porte son titre au papier (pas « Sans titre »).
//     Puis un clic sur « Dictée à trous : « Le port » » : les trois colonnes sur elle ; au milieu son bloc EN HAUT (aucun champ d'une autre feuille
//     au-dessus) ; un clic sur la 2e « Fiche méthode : lire et réciter… » (même clé en S5 et S7) : les trois colonnes sur celle de S7.
// 3 : (13 · 87) « Dictée 1 : « Le port » » (une dictée, outil Correction de dictée) : au papier, ce qu'elle attend et « Lier… » seul (ni « Écrire avec
//     une IA », ni « Prendre une feuille ») ; la garde : edIAdepuisTrou / edPrendreFeuille sur elle n'écrivent rien ; au hub elle reste kind « dictee », sans ref.
// 2 : (13 · 86) chaque bouton de la barre d'un élément et d'une séance porte son infobulle ; le ✕ d'un élément dit « Supprimer », la corbeille, « Restaurer ».
// 4 : (§12.65 (4)) premier envoi (« Envoyer les N feuilles jamais envoyées ») : chez l'élève, pas de bandeau ; réimport identique puis « Envoyer aux élèves » :
//     pas de bandeau ; une modification de Paul (un champ de la feuille au milieu de la Structure) puis « Envoyer aux élèves » : le bandeau, daté du jour.
// usage : node sonde-1265.mjs <assemble/index.html> [sortie.txt]   (MJPC_TAILLES, défaut 1707x743 ; MJPC_CAPT=<dossier>). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-1265.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..', '..');
const HUB = path.resolve(process.env.MJPC_HUB || path.join(RACINE, 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const TAILLES = String(process.env.MJPC_TAILLES || '1707x743').split(',').map(t => t.split('x').map(Number));
const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const URL0 = 'file://' + FICHIER; const MD5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const HORLOGE = new Date('2026-09-14T09:00:00+02:00');
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && detail !== '' ? ' — ' + detail : '')); return !!ok; };
const info = (k, quoi) => dire('  info   ' + k + ' · ' + quoi);
const p = (pg, ms) => pg.waitForTimeout(ms);

const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const hubStore = () => ({ classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } });
const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
/* « Compris » / « Fermer » d'une boîte d'information (atInfo) — le geste de Paul pour la fermer */
const compris = pg => pg.evaluate(() => { const m = document.getElementById('at-modale'); if (!m || !(m.getBoundingClientRect().height > 0)) return null; const t = m.innerText.replace(/\s+/g, ' ').trim().slice(0, 200); const b = Array.from(m.querySelectorAll('button')).find(x => /^(Compris|OK|Fermer)$/.test(x.textContent.trim())); if (b) b.click(); return t; });
const capt = async (pg, W, H, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, W + 'x' + H + '-' + nom + '.png') }).catch(() => {}); };

const CH = JSON.parse(fs.readFileSync(path.join(RACINE, 'LIVRAISONS', 'INTEGRATION', 'E4', 'prompt', 'chapitre-3e-au-contrat.json'), 'utf8'));
/* le fichier date du 22/10 : un mot-clé du bilan dépasse aujourd'hui les 45 signes — coupé à son « : » (comme banc-1228, cas 42i) ; rien d'autre ne change */
CH.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => { if (e && e.role === 'bilan') (e.blocs || []).forEach(b => { if (b && Array.isArray(b.el)) b.el = b.el.map(x => { x = String(x).replace(/\.$/, ''); return x.length > 45 ? x.split(' : ')[0].slice(0, 45) : x; }); }); }));
const TITRE = CH.chapitre.title;

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async (W, H) => { const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort()); await ctx.addInitScript(fauxHub, hubStore());
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => d.dismiss().catch(() => {})); await pg.clock.setFixedTime(HORLOGE);
  await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg);
  return { ctx, pg, errs }; };
/* « 📚 Nouveau chapitre » : le JSON collé, « Vérifier », « Créer ce chapitre » / « Remplacer », la confirmation */
const importer = async pg => { await pg.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1000); await sansVoiles(pg);
  if (await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await pg.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(pg, 900); await clicTexte(pg, 'button', '← Mes chapitres'); await p(pg, 900); }   /* l'Atelier rouvre le dernier chapitre : revenir à l'accueil de l'Atelier */
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 800);
  await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.at-porte-ch')).find(x => x.offsetParent !== null); if (b) b.click(); }); await p(pg, 1500);
  await pg.fill('#ch-coller', JSON.stringify(CH)); await p(pg, 400); await clicTexte(pg, 'button', 'Vérifier'); await p(pg, 1800);
  const bouton = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Créer ce chapitre|Remplacer|Mettre à jour/.test(b.innerText)); if (!b) return null; const t = b.innerText.trim(); b.click(); return t; }); await p(pg, 1500);
  await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && m.getBoundingClientRect().height > 0 && Array.from(m.querySelectorAll('button')).find(x => /Créer|Remplacer|Mettre à jour|Réinjecter|Continuer/.test(x.textContent)); if (b) b.click(); }); await p(pg, 3500);
  await compris(pg); return bouton; };
/* « Mes chapitres » → « Éditer dans l'atelier » du chapitre → l'onglet « Structure » */
const structure = async pg => { await pg.evaluate(() => { try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1000); await sansVoiles(pg);
  if (await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await pg.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(pg, 900); await clicTexte(pg, 'button', '← Mes chapitres'); await p(pg, 900); }
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900);
  await pg.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && Array.from(e.querySelectorAll('button,[onclick]')).some(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || ''))); const e = c[c.length - 1]; if (!e) return; Array.from(e.querySelectorAll('button,[onclick]')).find(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || '')).click(); }, TITRE); await p(pg, 2000); await sansVoiles(pg);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); if (b) b.click(); }); await p(pg, 1500); await sansVoiles(pg); await compris(pg);
  return pg.evaluate(() => !!document.getElementById('ed2-pan')); };
/* les trois colonnes : la ligne allumée à gauche, le bloc choisi au milieu (et celui qui est en haut du panneau), la ligne choisie au papier */
const colonnes = pg => pg.evaluate(() => {
  const som = document.querySelector('.ed2-som'), pan = document.getElementById('ed2-pan'), pap = document.querySelector('.ed2-papier'); if (!som || !pan || !pap) return null;
  const dans = (c, e) => { const a = c.getBoundingClientRect(), b = e.getBoundingClientRect(); return b.bottom > a.top + 4 && b.top < a.bottom - 4; };
  const g = Array.from(som.querySelectorAll('.ed2-it.ed2-ici')); const ps = Array.from(pan.querySelectorAll('.at-edch-it.ed2-sel')); const ds = Array.from(pap.querySelectorAll('.ed2-pdoc.ed2-sel, .ed2-trou.ed2-sel'));
  const rp = pan.getBoundingClientRect(); const haut = document.elementFromPoint(rp.left + rp.width / 2, rp.top + 16); const blocHaut = haut && haut.closest('.at-edch-it');
  const champHaut = haut && haut.closest('.at-edch-fz'); const champAutre = champHaut && blocHaut && ps[0] && blocHaut !== ps[0] ? (champHaut.innerText || '').replace(/\s+/g, ' ').slice(0, 60) : '';
  const d = ds[0]; const ae = document.activeElement; const bar = pap.querySelector('.ed2-pbarre'); const bb = bar ? bar.getBoundingClientRect().bottom : pap.getBoundingClientRect().top;
  const teteVue = d ? (d.getBoundingClientRect().top >= bb - 2 && d.getBoundingClientRect().top < pap.getBoundingClientRect().bottom - 60) : false;   /* le haut de la ligne au papier, sous sa barre collée */
  return { gauche: g.map(e => e.getAttribute('data-item')), gaucheVue: g[0] ? dans(som, g[0]) : false, gaucheTitre: g[0] ? g[0].innerText.trim() : '',
    milieu: ps.map(e => e.getAttribute('data-champ').replace(/^item-/, '')), milieuTitre: ps[0] ? ((ps[0].querySelector('input.at-edch-in') || {}).value || '') : '',
    milieuHaut: blocHaut ? blocHaut.getAttribute('data-champ').replace(/^item-/, '') : (haut ? '(' + (haut.className || haut.tagName) + ')' : null), champAutre,
    droite: ds.map(e => e.getAttribute('data-item')), droiteVue: teteVue, droiteTexte: d ? d.innerText.replace(/\s+/g, ' ').trim().slice(0, 160) : '',
    droiteSeance: d ? ((d.querySelector('.ed2-pref') || {}).textContent || '') : '', curseur: ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName) ? (ae.value || '').slice(0, 40) : null }; });
/* la même ligne : allumée seule à gauche (visible), choisie seule au milieu ET en haut du panneau, choisie seule au papier, son haut visible sous la barre */
const memeLigne = (c, id) => !!c && c.gauche.length === 1 && c.gauche[0] === id && c.gaucheVue && c.milieu.length === 1 && c.milieu[0] === id && c.milieuHaut === id && c.droite.length === 1 && c.droite[0] === id && c.droiteVue;
const dC = c => c ? JSON.stringify({ gauche: c.gauche, milieu: c.milieu, enHautDuMilieu: c.milieuHaut, champDUneAutre: c.champAutre || undefined, droite: c.droite, papier: c.droiteTexte.slice(0, 70) }) : 'colonnes absentes';
const idDe = (pg, seCle, item) => pg.evaluate(({ t, s, k }) => { const ec = AT.edChap; const ch = chapitresData[ec.level][ec.chnum]; const j = atSeances(ch).filter(x => x.se.cle === s).map(x => x.j)[0]; return typeof ed2IdDe === 'function' ? ed2IdDe(ed2Documents(ec.level, ec.chnum), j, k) : k; }   /* avant §12.65 : la clé seule */, { t: TITRE, s: seCle, k: item });
const clicGauche = async (pg, id) => { await pg.evaluate(id => { const l = document.querySelector('.ed2-som .ed2-it[data-item="' + id + '"]'); if (l) l.scrollIntoView({ block: 'center' }); }, id); await p(pg, 200); await pg.click('.ed2-som .ed2-it[data-item="' + id + '"]'); await p(pg, 1200); };
const hubItem = (pg, seCle, item) => pg.evaluate(({ t, s, k }) => { const L = window.__hubLire; const ch = L('/site/3e/chapitres') || {}; const cle = Object.keys(ch).find(x => ch[x] && ch[x].title === t); if (cle == null) return null; const ses = ch[cle].seances || {}; const j = Object.keys(ses).find(x => ses[x] && ses[x].cle === s); const it = j != null && ses[j].items ? ses[j].items[k] : null; return it ? { j, kind: it.kind, source: it.source, ref: it.ref || '' } : null; }, { t: TITRE, s: seCle, k: item });
/* l'élève ouvre la ligne : le clic de sa page (openItem → openAtelierItem, la version envoyée) ; le bandeau lu, puis la visionneuse fermée */
const ouvrirCommeEleve = async (pg, seCle, item) => { const ok = await pg.evaluate(({ t, s, k }) => { const ch = chapitresData['3e']; const cle = Object.keys(ch).find(x => ch[x] && ch[x].title === t); const j = atSeances(ch[cle]).filter(x => x.se.cle === s).map(x => x.j)[0]; if (j == null) return false; openItem('3e', cle, j, k); return true; }, { t: TITRE, s: seCle, k: item }); await p(pg, 1500);
  const r = await pg.evaluate(() => { const v = document.getElementById('atdoc-viewer'); if (!v) return { visionneuse: false }; const b = v.querySelector('.atdoc-bandeau'); const t = b ? b.textContent.trim() : null; v.remove(); return { visionneuse: true, bandeau: t }; }); r.ouvert = ok; return r; };
const envoi = (pg, ref) => pg.evaluate(r => { const e = window.__hubLire('/site/atelier/envois/' + r); return e ? { message: (e.meta || {}).message || '', change: (e.meta || {}).change || null, premier: (e.meta || {}).premier } : null; }, ref);
/* « Éditer » sur la ligne (sa barre au milieu) → l'éditeur de feuille → « 📤 Envoyer aux élèves » → la fenêtre lue → « Envoyer » → « ← Le chapitre » */
const envoyerDepuisLaFeuille = async (pg, id) => { await pg.evaluate(id => { const b = document.querySelector('#ed2-pan [data-champ="item-' + id + '"] .at-edch-actes button.at-btn-prim'); if (b) b.click(); }, id); await p(pg, 1800); await sansVoiles(pg);
  await clicTexte(pg, 'button', 'Envoyer aux élèves'); await p(pg, 1200);
  const fen = await pg.evaluate(() => { const m = document.getElementById('at-modale'); if (!m) return null; return { texte: m.innerText.replace(/\s+/g, ' ').trim().slice(0, 260), zone: (document.getElementById('at-envoi-msg') || {}).value || null }; });
  await pg.evaluate(() => { const b = document.getElementById('at-envoi-ok'); if (b) b.click(); }); await p(pg, 1500); await compris(pg);
  await clicTexte(pg, 'button', '← Le chapitre'); await p(pg, 1500); await compris(pg); return fen; };

dire('EX · sonde §12.65 par le geste (A109) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + MD5);
for (const [W, H] of TAILLES) { const T = W + '×' + H; dire(''); dire('══ ' + T + ' ══');
  const o = await ouvrir(W, H); const pg = o.pg;
  try {
    const b1 = await importer(pg); const vu = await structure(pg);
    verif('0', b1 && vu, T + ' · le chapitre au contrat s’importe (« ' + b1 + ' ») et sa Structure s’ouvre');
    /* ── 3 · la mesure d'abord : à quoi les dictées sont liées après l'import ── */
    const d1 = await hubItem(pg, 'dictee-reecriture', 'dictee-1'), d2 = await hubItem(pg, 'dictee-reecriture', 'dictee-a-trous');
    info('3', T + ' · après l’import : « Dictée 1 : « Le port » » ' + JSON.stringify(d1) + ' (aLier : correction_dictee) ; « Dictée à trous » ' + JSON.stringify(d2) + ' (aLier : atelier — sa feuille, créée par l’import)');
    /* ── 1 · le geste de Paul : « ✨ Écrire avec une IA » sur un trou, l'écran IA, « ← Retour au chapitre » ── */
    const idRec = await idDe(pg, 'recitation', 'recitation-passante');
    const ia = await pg.evaluate(id => { const t = document.querySelector('.ed2-trou[data-item="' + id + '"]'); if (!t) return 'pas de trou'; t.scrollIntoView({ block: 'center' }); const b = Array.from(t.querySelectorAll('button')).find(x => /Écrire avec une IA/.test(x.innerText)); if (!b) return 'pas de bouton'; b.click(); return 'ok'; }, idRec); await p(pg, 2500);
    const ecranIA = await pg.evaluate(() => !!Array.from(document.querySelectorAll('#at-zone h3')).find(h => /Écrire avec une IA/.test(h.innerText)));
    await capt(pg, W, H, '1-ecran-ia');
    await clicTexte(pg, 'button', 'Retour au chapitre'); await p(pg, 2000); await compris(pg); await p(pg, 300);
    const c1 = await colonnes(pg); await capt(pg, W, H, '1-retour-de-l-ia');
    verif('1', ia === 'ok' && ecranIA, T + ' · « ✨ Écrire avec une IA » sur le trou « Récitation : « À une passante » » ouvre la zone de prompt', ia);
    verif('1', memeLigne(c1, idRec), T + ' · 13 · 85 · « ← Retour au chapitre » : la gauche, le milieu (son bloc en haut) et le papier sur la même ligne, celle du trou', dC(c1));
    verif('1', c1 && c1.curseur === null, T + ' · au retour, aucun curseur posé (Paul n’a rien demandé à écrire)', c1 && c1.curseur);
    verif('1', c1 && /Récitation : « À une passante »/.test(c1.droiteTexte) && !/Sans titre/.test(c1.droiteTexte), T + ' · la feuille neuve porte son titre au papier (pas « Sans titre »)', c1 && c1.droiteTexte.slice(0, 120));
    /* puis Paul choisit un élément : « Dictée à trous : « Le port » » (sa feuille, liée par l'import) */
    const idTr = await idDe(pg, 'dictee-reecriture', 'dictee-a-trous'); await clicGauche(pg, idTr); const c2 = await colonnes(pg); await capt(pg, W, H, '1-la-dictee-a-trous');
    verif('1', memeLigne(c2, idTr) && /Le port/.test(c2.milieuTitre) && /Le port/.test(c2.droiteTexte), T + ' · un clic sur « Dictée à trous : « Le port » » : les trois colonnes sur elle', dC(c2));
    verif('1', c2 && !c2.champAutre, T + ' · au milieu, aucun champ d’une autre feuille au-dessus de son titre (le bloc est calé en haut)', c2 && c2.champAutre);
    /* la même clé dans deux séances : « Fiche méthode : lire et réciter… » en S5 et S7 */
    const idRe7 = await idDe(pg, 'recitation', 'fiche-methode-reciter'), idRe5 = await idDe(pg, 'atelier-paragraphe', 'fiche-methode-reciter');
    await clicGauche(pg, idRe7); const c3 = await colonnes(pg);
    const sce = await pg.evaluate(id => { const b = document.querySelector('#ed2-pan [data-champ="item-' + id + '"]'); const s = b && b.closest('.at-edch-se'); return s ? ((s.querySelector('.at-edch-set') || {}).firstChild || {}).textContent : null; }, idRe7);
    verif('1', idRe7 !== idRe5 && memeLigne(c3, idRe7) && /S\. 7/.test(c3.droiteSeance) && /Séance 7/.test(sce || ''), T + ' · la 2e « Fiche méthode : lire et réciter… » (même clé en S5 et S7) : les trois colonnes sur celle de la séance 7', dC(c3) + ' · papier « ' + (c3 && c3.droiteSeance) + ' » · milieu dans « ' + sce + ' »');
    /* ── 3 · « Dictée 1 : « Le port » » : une dictée, pas une feuille ── */
    const idD1 = await idDe(pg, 'dictee-reecriture', 'dictee-1'); await clicGauche(pg, idD1); const c4 = await colonnes(pg); await capt(pg, W, H, '3-la-dictee-1');
    const trou = await pg.evaluate(id => { const t = document.querySelector('.ed2-trou[data-item="' + id + '"]'); return t ? { texte: t.innerText.replace(/\s+/g, ' ').trim(), boutons: Array.from(t.querySelectorAll('button')).map(b => b.innerText.trim()) } : null; }, idD1);
    verif('3', memeLigne(c4, idD1), T + ' · un clic sur « Dictée 1 : « Le port » » (à lier) : les trois colonnes sur elle', dC(c4));
    verif('3', trou && /une dictée de l’application/.test(trou.texte) && /« Lier… »/.test(trou.texte) && trou.boutons.length === 1 && /^Lier/.test(trou.boutons[0]), T + ' · 13 · 87 · au papier, ce qu’elle attend et la marche à suivre, « Lier… » seul (ni IA, ni « Prendre une feuille »)', JSON.stringify(trou));
    const e0 = await pg.evaluate(() => window.__ECR.length);
    await pg.evaluate(id => { const ec = AT.edChap; const d = ed2Documents(ec.level, ec.chnum).find(x => (x.id || x.item) === id); edIAdepuisTrou(d.seance, d.item); }, idD1); await p(pg, 1500); const garde1 = await compris(pg);
    await pg.evaluate(id => { const ec = AT.edChap; const d = ed2Documents(ec.level, ec.chnum).find(x => (x.id || x.item) === id); edPrendreFeuille(d.seance, d.item); }, idD1); await p(pg, 1500); const garde2 = await compris(pg);
    const ecrG = await pg.evaluate(n => window.__ECR.slice(n).filter(x => !/ \/presence\//.test(x)), e0);   /* le battement de présence du prof n'est pas une donnée */ const d1b = await hubItem(pg, 'dictee-reecriture', 'dictee-1');
    verif('3', !ecrG.length && d1b && d1b.kind === 'dictee' && !d1b.ref && /attend une dictée/.test(garde1 || '') && /attend une dictée/.test(garde2 || ''), T + ' · la garde : « Écrire avec une IA » et « Prendre une feuille » sur la dictée n’écrivent rien et disent la marche à suivre ; au hub, elle reste kind « dictee », sans ref', JSON.stringify({ ecritures: ecrG.slice(0, 3), hub: d1b, dit: (garde1 || '').slice(0, 120) }));
    /* ── 2 · les infobulles des barres ── */
    const bulles = await pg.evaluate(() => { const r = { it: [], se: [], sansBulle: [] }; document.querySelectorAll('#ed2-pan .at-edch-it .at-edch-actes button').forEach(b => { const t = (b.getAttribute('title') || '').trim(); if (!t) r.sansBulle.push('élément « ' + b.innerText.trim() + ' »'); else r.it.push(b.innerText.trim()); });
      document.querySelectorAll('#ed2-pan .at-edch-se > .at-edch-set .at-edch-actes button').forEach(b => { const t = (b.getAttribute('title') || '').trim(); if (!t) r.sansBulle.push('séance « ' + b.innerText.trim() + ' »'); else r.se.push(b.innerText.trim()); });
      const x = document.querySelector('#ed2-pan .at-edch-it .at-edch-actes button.at-btn-danger'); r.croix = x ? x.getAttribute('title') : null; const xs = document.querySelector('#ed2-pan .at-edch-se > .at-edch-set .at-edch-actes button.at-btn-danger'); r.croixSe = xs ? xs.getAttribute('title') : null;
      const gr = Array.from(document.querySelectorAll('#ed2-pan .at-edch-actes button[disabled]')).map(b => b.getAttribute('title') || ''); r.grises = gr.length; r.grisesSansRaison = gr.filter(t => !/Déjà/.test(t)).length; r.lib = Array.from(new Set(r.it)).join(' · '); return r; });
    verif('2', bulles.sansBulle.length === 0 && bulles.it.length > 50 && bulles.se.length > 20, T + ' · 13 · 86 · chaque bouton de la barre d’un élément (' + bulles.it.length + ') et d’une séance (' + bulles.se.length + ') a son infobulle', bulles.sansBulle.slice(0, 5).join(', ') || bulles.lib);
    verif('2', /^Supprimer cet élément de la séance/.test(bulles.croix || '') && /corbeille/.test(bulles.croix) && /Restaurer/.test(bulles.croix) && /n’est pas supprimé/.test(bulles.croix), T + ' · le ✕ d’un élément : « ' + bulles.croix + ' »');
    verif('2', /^Supprimer cette séance/.test(bulles.croixSe || '') && /corbeille/.test(bulles.croixSe), T + ' · le ✕ d’une séance : « ' + bulles.croixSe + ' »');
    verif('2', bulles.grises > 0 && bulles.grisesSansRaison === 0, T + ' · chaque bouton grisé (' + bulles.grises + ') dit pourquoi');
    /* ── 4 · le bandeau de l'envoi ── */
    const refTr = (await hubItem(pg, 'dictee-reecriture', 'dictee-a-trous') || {}).ref;
    const tout = await clicTexte(pg, '#ed2-pan button', 'jamais envoyée'); await p(pg, 900); await clicTexte(pg, '#at-modale button', 'Tout envoyer'); await p(pg, 4000); await compris(pg); await p(pg, 600);
    const v1 = await envoi(pg, refTr); const el1 = await ouvrirCommeEleve(pg, 'dictee-reecriture', 'dictee-a-trous');
    verif('4', tout && v1 && v1.premier && !v1.message && !v1.change && el1.visionneuse && el1.bandeau === null, T + ' · premier envoi (« Envoyer les feuilles jamais envoyées ») : chez l’élève, la feuille s’ouvre sans bandeau', JSON.stringify({ envoi: v1, eleve: el1 }));
    const b2 = await importer(pg); await structure(pg); const refTr2 = (await hubItem(pg, 'dictee-reecriture', 'dictee-a-trous') || {}).ref;
    const idTr2 = await idDe(pg, 'dictee-reecriture', 'dictee-a-trous'); const f2 = await envoyerDepuisLaFeuille(pg, idTr2); const v2 = await envoi(pg, refTr2); const el2 = await ouvrirCommeEleve(pg, 'dictee-reecriture', 'dictee-a-trous');
    verif('4', refTr2 === refTr && v2 && !v2.message && !v2.change && el2.visionneuse && el2.bandeau === null && f2 && /Rien n’a changé/.test(f2.texte) && f2.zone === null, T + ' · réimport identique (« ' + b2 + ' ») puis « Envoyer aux élèves » : la fenêtre dit « rien n’a changé », chez l’élève pas de bandeau', JSON.stringify({ memeFeuille: refTr2 === refTr, fenetre: f2 && f2.texte.slice(0, 140), envoi: v2, eleve: el2 }));
    /* une modification de Paul : le titre de la feuille, au milieu de la Structure (son champ), puis « Envoyer aux élèves » */
    await clicGauche(pg, idTr2);
    const champ = await pg.evaluate(id => { const b = document.querySelector('#ed2-pan [data-champ="item-' + id + '"]'); const z = b && Array.from(b.querySelectorAll('.at-edch-fz')).find(f => /Afficher le titre de la feuille/.test(f.innerText)); const i = z && z.querySelector('input'); if (!i) return null; i.scrollIntoView({ block: 'center' }); i.setAttribute('data-sonde', '1'); return i.value; }, idTr2);
    if (champ != null) { await pg.click('input[data-sonde="1"]'); await pg.keyboard.press('End'); await pg.keyboard.type(' (version aménagée)'); await p(pg, 2200); }
    await pg.mouse.click(Math.round(W / 2), 8); await p(pg, 300);
    const f3 = await envoyerDepuisLaFeuille(pg, idTr2); const v3 = await envoi(pg, refTr2); const el3 = await ouvrirCommeEleve(pg, 'dictee-reecriture', 'dictee-a-trous'); await capt(pg, W, H, '4-apres-une-modification');
    verif('4', champ != null && v3 && v3.change && /^Cette fiche a changé le 14\/09\/2026 — reporte les changements sur ta fiche du cahier\.$/.test(v3.message) && el3.bandeau === v3.message && f3 && f3.zone === v3.message, T + ' · une modification de Paul puis « Envoyer aux élèves » : le bandeau chez l’élève, daté du jour', JSON.stringify({ fenetre: f3 && (f3.zone || f3.texte).slice(0, 120), eleve: el3.bandeau }));
    /* un envoi sans nouveau changement après lui : le bandeau du changement reste, avec SA date */
    const f4 = await envoyerDepuisLaFeuille(pg, idTr2); const v4 = await envoi(pg, refTr2); const el4 = await ouvrirCommeEleve(pg, 'dictee-reecriture', 'dictee-a-trous');
    verif('4', v4 && v4.change === v3.change && el4.bandeau === v3.message && f4 && /Rien n’a changé/.test(f4.texte), T + ' · renvoyée sans autre changement : pas de nouveau bandeau — celui de la modification reste, avec sa date', JSON.stringify({ envoi: v4, eleve: el4.bandeau }));
  } catch (e) { verif('Z', false, T + ' · la sonde n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
  verif('Z', !o.errs.length, T + ' · 0 erreur JS', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }
await nav.close();
dire(''); dire('BILAN : ' + (nb - echecs) + '/' + nb + ' ok' + (echecs ? ' · ' + echecs + ' ÉCHEC(S)' : '') + ' · ' + (echecs ? 'ROUGE' : 'VERT'));
if (SORTIE) fs.writeFileSync(SORTIE, R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);

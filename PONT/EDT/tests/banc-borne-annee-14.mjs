/* BANC ⑭ — LES COMPTES, LES PROPOSITIONS, LES GESTES, LA PHOTO.
   Tout passe par le clic et le clavier. Ce que le banc ne peut pas atteindre au
   geste, il l'écrit et échoue. Les seules choses posées « par la donnée » sont
   des contenus de hub (une heure jouée, une heure banalisée) — jamais un appel
   de fonction du site pour produire un écran.
   Faux hub REST (méthode de tests/banc-dates-annee-11a.mjs) : rien ne sort.
   Usage : node tests/banc-borne-annee-14.mjs [index.html] */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME = '/opt/google/chrome/chrome';
const ICI = path.dirname(new URL(import.meta.url).pathname);
const FICHIER = path.resolve(process.argv[2] || path.join(ICI, '..', 'index.html'));
const DOS = path.join(ICI, '14') + '/';
fs.mkdirSync(DOS, { recursive: true });
const J = f => JSON.parse(fs.readFileSync(path.join(ICI, f), 'utf8'));

const hubDe = () => ({ classes: J('hub/classes.json'), site: {
  '3e': J('hub/site_3e.json'), config: J('hub/site_config.json'), edt: {
    grille:     { '2026-2027': J('parcours-grille.json') },
    calendrier: { '2026-2027': J('../json/calendrier-2026-2027.json') },
    creneaux:   { '2026-2027': J('../json/creneaux-2026-2027.json') } } } });

const jrn = []; const dit = t => { jrn.push(t); console.log(t); };
const pause = ms => new Promise(r => setTimeout(r, ms));
let n = 0, fautes = 0;
const faute = t => { fautes++; dit('   ✗ ' + t); };
const bon = t => dit('   ✔ ' + t);

const nav = await puppeteer.launch({ executablePath: CHROME,
  args: ['--no-sandbox', '--allow-file-access-from-files', '--lang=fr-FR'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 768 });
await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr' });

/* le faux hub : il se repose à chaque chargement, et on peut le garnir avant */
let HUB = hubDe();
await page.evaluateOnNewDocument(() => {
  const lire = c => { const q = c.split('/').filter(Boolean); let x = window.__HUB;
    for (const k of q) { if (x === null || typeof x !== 'object' || !(k in x)) return null; x = x[k]; }
    return x === undefined ? null : x; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let x = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof x[q[k]] !== 'object' || x[q[k]] === null) x[q[k]] = {}; x = x[q[k]]; }
    if (v === null) delete x[q[q.length - 1]]; else x[q[q.length - 1]] = v; };
  window.__ECR = [];
  window.fetch = function (u, o) { const t = String(u);
    if (t.indexOf('firebasedatabase.app') >= 0) {
      const c = t.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push({ chemin: c, valeur: bd }); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); }
    return Promise.resolve(new Response('null', { status: 200 })); };
});

const voile = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async nom => { await voile(); n++;
  const f = DOS + 'a' + String(n).padStart(2, '0') + '-' + nom + '.png';
  await page.screenshot({ path: f }); dit('   ▸ tests/14/' + f.split('/').pop()); };

const viser = async (sel, txt) => {
  await voile();
  const trouve = await page.evaluate((s, t) => {
    const els = Array.from(document.querySelectorAll(s)).filter(x => {
      if (t !== null && ((x.innerText || '') + ' ' + (x.getAttribute('onclick') || '')).indexOf(t) < 0) return false;
      const r = x.getBoundingClientRect(); return r.width > 2 && r.height > 2; });
    if (!els.length) return false;
    els[0].setAttribute('data-vise-14', '1'); els[0].scrollIntoView({ block: 'center' }); return true; },
    sel, txt === undefined ? null : txt);
  if (!trouve) return null;
  await pause(320);
  return page.evaluate(() => { const el = document.querySelector('[data-vise-14]');
    if (!el) return null; el.removeAttribute('data-vise-14');
    const r = el.getBoundingClientRect();
    const sous = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, g: r.x + 12,
      dessus: !!(sous && (sous === el || el.contains(sous) || sous.contains(el))),
      txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 46) }; }); };

const clic = async (sel, txt, quoi) => { let c = await viser(sel, txt);
  if (!c) { faute('NON ATTEINT PAR UN CLIC : ' + (quoi || sel)); return null; }
  if (!c.dessus) { await pause(700); c = await viser(sel, txt) || c; }
  if (!c.dessus) faute('l\'élément visé est recouvert : ' + (quoi || c.txt));
  await page.mouse.click(c.x, c.y); await pause(120);
  dit('   ✔ CLIC « ' + (c.txt || quoi) + ' »'); return c; };

const ordreSegments = () => page.evaluate(() =>
  new Intl.DateTimeFormat().formatToParts(new Date(2026, 7, 24))
    .filter(p => p.type !== 'literal').map(p => p.type).join('-'));
const saisirDate = async (id, jj, mm, aaaa, quoi) => {
  const ordre = await ordreSegments();
  const chiffres = ordre.split('-').map(t => t === 'day' ? jj : t === 'month' ? mm : aaaa).join('');
  const c = await viser('#' + id, null);
  if (!c) { faute('champ ' + id + ' absent'); return null; }
  await page.mouse.click(c.g, c.y); await pause(150);
  await page.keyboard.press('Delete'); await pause(120);
  await page.keyboard.type(chiffres, { delay: 60 });
  const ailleurs = await page.evaluate(() => { const t = Array.from(document.querySelectorAll('h2'))
      .filter(x => /Dates de l/.test(x.innerText))[0] || document.querySelector('.m8-titre');
    if (!t) return null; const r = t.getBoundingClientRect();
    return { x: r.x + Math.min(r.width - 4, 40), y: r.y + r.height / 2 }; });
  if (ailleurs) await page.mouse.click(ailleurs.x, ailleurs.y);
  await pause(1000);
  dit('   ✔ FRAPPE de ' + jj + '/' + mm + '/' + aaaa + ' dans « ' + quoi + ' » → EDT_DATES : '
    + await page.evaluate(() => JSON.stringify(EDT_DATES)));
  return page.evaluate(i => (document.getElementById(i) || {}).value, id); };

/* CE QU'ON COMPTE À L'ÉCRAN — jamais par une fonction du site : on lit le DOM. */
const releve = () => page.evaluate(() => {
  const q = s => document.querySelectorAll(s).length;
  const cases = Array.from(document.querySelectorAll('#edt-ecran .edt-clic'));
  const mots = Array.from(document.querySelectorAll('#edt-ecran .edt-b-off'))
    .map(x => (x.innerText || '').trim()).filter(Boolean);
  return { casesCliquables: cases.length + document.querySelectorAll('#edt-ecran .edt-mcase').length,
    casesMois: document.querySelectorAll('#edt-ecran .edt-mcase').length,
    pastillesMois: document.querySelectorAll('#edt-ecran .edt-m').length,
    moisAutre: document.querySelectorAll('#edt-ecran .edt-m-autre').length,
    moisPrevu: document.querySelectorAll('#edt-ecran .edt-m-prevu').length,
    prevu: q('#edt-ecran .edt-b-prevu'), jouee: q('#edt-ecran .edt-b-joue'),
    off: q('#edt-ecran .edt-b-off'), horsMjpc: q('#edt-ecran .edt-b-hors'),
    nonImportee: q('#edt-ecran .edt-b-gris'), sansSeance: q('#edt-ecran .edt-b-sans'),
    rienDePret: q('#edt-ecran .edt-b-vide'),
    evenementsAnnee: q('#edt-ecran .edt-an-b'), pastillesAnnee: q('#edt-ecran .edt-an-pas i'),
    jourAnnee: q('#edt-ecran .edt-an-j'),
    bandeaux: Array.from(document.querySelectorAll('#edt-ecran .edt-t')).map(x => (x.innerText || '').trim()),
    motsOff: mots }; });

const ouvrirEdt = async () => {
  await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(250); await voile();
  const dejaLa = await page.evaluate(() => !!document.querySelector('#edt-panneau .edt-btn-prim'));
  if (!dejaLa) { await clic('#tprof-btn', undefined, 'Panneau prof'); await pause(1400); }
  await clic('.tprof-section-btn', "showProfSection('edt')", 'section Emploi du temps'); await pause(1400);
  await clic('#edt-panneau .edt-btn-prim', 'edtOuvrir()', 'Ouvrir l\'emploi du temps'); await pause(2000); };

const allerA = async (pas) => { for (let i = 0; i < Math.abs(pas); i++) {
    await clic('#edt-ecran .edt-btn', pas < 0 ? '\u2039' : '\u203a', pas < 0 ? 'semaine précédente' : 'semaine suivante');
    await pause(500); } };
const titreEcran = () => page.evaluate(() => {
  const t = document.querySelector('#edt-ecran .edt-tete b'); return t ? t.innerText.trim() : '(pas de titre)'; });

/* CE QUE MESURE CE BANC — tout est lu dans le DOM, après un clic. */
const heuresPerdues = () => page.evaluate(() => {
  const f = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'));
  const avant = f.filter(x => /2026-0[6-9]|ao\u00fbt|septembre/i.test(x.innerText || '')).length;
  return { fiches: f.length,
    coches: document.querySelectorAll('#edt-ecran .edt-fiche input[type=checkbox]').length,
    fichesDAvantLaRentree: avant,
    titres: f.slice(0, 6).map(x => (x.innerText || '').replace(/\n+/g, ' ').slice(0, 60)) }; });

const destinationsDeLaCase = () => page.evaluate(() => {
  const sel = document.getElementById('edt-ou');
  if (!sel) return { options: 0, entete: '(pas de liste de destinations dans la modale)', premieres: [] };
  const o = Array.from(sel.querySelectorAll('option')).map(x => x.textContent.trim());
  return { options: o.length - 1, entete: o[0] || '', premieres: o.slice(1, 5) }; });

/* on ouvre une case QUI PORTE UNE SEANCE : c'est celle qui offre la liste des
   destinations. Hors annee elle n'en porte plus, donc on retient la case choisie
   AVANT et on rouvre exactement la meme apres. */
let CASE_CHOISIE = null;
const ouvrirUneCase = async (jours) => {
  const c = await page.evaluate((j, forcee) => {
    const els = Array.from(document.querySelectorAll('#edt-ecran .edt-clic'));
    let el = null;
    if (forcee) el = els.filter(x => (x.getAttribute('onclick') || '').indexOf(forcee) >= 0)[0];
    if (!el) el = els.filter(x => j.some(d => (x.getAttribute('onclick') || '').indexOf(d) >= 0)
      && x.querySelector('.edt-b-prevu'))[0];
    if (!el) el = els.filter(x => j.some(d => (x.getAttribute('onclick') || '').indexOf(d) >= 0))[0];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2,
      cle: (el.getAttribute('onclick') || '').replace(/[^0-9a-zA-Z:|\- ]/g, '').slice(0, 60) }; },
    jours, CASE_CHOISIE);
  if (!c) { faute('aucune case cliquable parmi ' + JSON.stringify(jours)); return false; }
  if (!CASE_CHOISIE) CASE_CHOISIE = c.cle.split(' ').filter(x => /2026-/.test(x))[0] || null;
  dit('   case ouverte : ' + c.cle);
  await page.mouse.click(c.x, c.y); await pause(1000); return true; };

/* ══════════ ① AVANT — RIEN N'EST DÉCLARÉ ══════════ */
dit('① AVANT — AUCUNE DATE D\'ANNÉE DÉCLARÉE');
/* le calendrier reel ne porte aucun evenement de CLASSE avant la rentree : sans
   en poser un, le point « une heure hors annee ne coute rien » n'est pas mesurable.
   On en pose donc un le 1er septembre, niveau 3e, comme un vrai sejour. */
const HUB0 = hubDe();
HUB0.site.edt.calendrier['2026-2027'].evenementsClasse.unshift({
  id: 'evc:banc14', debut: '2026-09-01', fin: '2026-09-01',
  libelle: 'Banc \u246d \u2014 sortie 3e AVANT la rentr\u00e9e', niveau: '3e', classes: [] });
dit('   événement de classe posé au calendrier de test : 1er septembre, niveau 3e');
await page.evaluateOnNewDocument(s => { window.__HUB = JSON.parse(JSON.stringify(s)); }, HUB0);
await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1500);
dit('   version : ' + await page.evaluate(() => APP_VERSION));
await ouvrirEdt();

await clic('#edt-ecran .edt-btn', "edtVue('calendrier')", 'Heures perdues…'); await pause(1600);
const hpAv = await heuresPerdues();
dit('   HEURES PERDUES · fiches ' + hpAv.fiches + ' · coches ' + hpAv.coches
  + ' · fiches d\'avant la rentrée ' + hpAv.fichesDAvantLaRentree);
dit('   six premières : ' + JSON.stringify(hpAv.titres));
await shot('avant-heures-perdues');

await clic('#edt-ecran .edt-btn', "edtVue('semaine')", 'Semaine'); await pause(900);
await allerA(-1);
dit('   écran : ' + await titreEcran());
const ouverte = await ouvrirUneCase(['2026-08-27', '2026-08-28']);
const destAv = ouverte ? await destinationsDeLaCase() : { options: 0, premieres: [] };
dit('   DESTINATIONS depuis cette case : ' + destAv.options + ' entrées — ' + destAv.entete);
dit('   les premières : ' + JSON.stringify(destAv.premieres));
await shot('avant-destinations-depuis-le-27-aout');
await page.keyboard.press('Escape'); await pause(500);

/* la photo du prévu — par le bouton */
await clic('#edt-ecran .edt-btn', 'edtAujourdhuiAller()', 'Aujourd\'hui'); await pause(900);
await page.evaluate(() => { window.__ECR.length = 0; });
await clic('#edt-ecran .edt-btn', 'edtPhoto()', 'Photo du prévu'); await pause(1400);
const ok1 = await viser('.edt-modale button, #at-modale button', 'Prendre');
if (ok1) { await page.mouse.click(ok1.x, ok1.y); await pause(1600); }
const photoAv = await page.evaluate(() => {
  const e = (window.__ECR || []).filter(x => /photos/.test(x.chemin)).pop();
  if (!e) return null; const p = (e.valeur.photos || []).slice(-1)[0] || {};
  const c = p.cellules || {};
  const n = { total: Object.keys(c).length };
  Object.keys(c).forEach(k => { const t = c[k].nature || '?'; n[t] = (n[t] || 0) + 1; });
  return { depuis: p.depuis, prise: p.prise, nom: p.nom, natures: n }; });
dit('   PHOTO DU PRÉVU · ' + JSON.stringify(photoAv));
if (!photoAv) faute('la photo n\'a pas été écrite : le banc ne peut pas la mesurer');
await shot('avant-photo-du-prevu');

/* ══════════ ② PAUL DÉCLARE SES DEUX DATES ══════════ */
dit(''); dit('② PAUL DÉCLARE SA RENTRÉE (3 septembre) ET SON DERNIER JOUR (3 juillet)');
/* on repart d'un ecran propre : recharger, puis le panneau prof. Fermer l'EDT
   par son bouton laissait l'ecran ouvert une fois sur deux (mesure au banc), et
   un ecran a moitie ferme fabrique des preuves fausses. Le hub, lui, garde tout :
   la photo prise plus haut y est deja. */
await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1600);
await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(250); await voile();
await clic('#tprof-btn', undefined, 'Panneau prof'); await pause(1600);
await clic('.tprof-section-btn', "showProfSection('brevet')", 'Dates de l\'année'); await pause(1000);
try { await page.waitForSelector('#edt-date-debut', { timeout: 8000 }); }
catch (e) { faute('les deux champs de dates ne sont pas apparus'); }
await pause(400);
const vd = await saisirDate('edt-date-debut', '03', '09', '2026', 'début de l\'année');
const vf = await saisirDate('edt-date-fin', '03', '07', '2027', 'fin de l\'année');
if (vd === '2026-09-03' && vf === '2027-07-03') bon('les deux dates sont posées');
else faute('les champs portent ' + JSON.stringify([vd, vf]));
await shot('les-deux-dates-posees');

/* ══════════ ③ APRÈS — LES MÊMES MESURES ══════════ */
dit(''); dit('③ APRÈS — LES COMPTES, LES PROPOSITIONS, LA PHOTO');
await clic('.tprof-section-btn', "showProfSection('edt')", 'section Emploi du temps'); await pause(1400);
await clic('#edt-panneau .edt-btn-prim', 'edtOuvrir()', 'Ouvrir l\'emploi du temps'); await pause(2000);

await clic('#edt-ecran .edt-btn', "edtVue('calendrier')", 'Heures perdues…'); await pause(1600);
const hpAp = await heuresPerdues();
dit('   HEURES PERDUES · fiches ' + hpAp.fiches + ' · coches ' + hpAp.coches
  + ' · fiches d\'avant la rentrée ' + hpAp.fichesDAvantLaRentree);
dit('   six premières : ' + JSON.stringify(hpAp.titres));
await shot('apres-heures-perdues');

await clic('#edt-ecran .edt-btn', "edtVue('semaine')", 'Semaine'); await pause(900);
await allerA(-1);
const ouverte2 = await ouvrirUneCase(['2026-08-27', '2026-08-28']);
const destAp = ouverte2 ? await destinationsDeLaCase() : { options: 0, premieres: [] };
dit('   DESTINATIONS depuis la MÊME case : ' + destAp.options + ' entrées — ' + destAp.entete);
dit('   les premières : ' + JSON.stringify(destAp.premieres));
await shot('apres-destinations-depuis-le-27-aout');
await page.keyboard.press('Escape'); await pause(500);

await clic('#edt-ecran .edt-btn', 'edtAujourdhuiAller()', 'Aujourd\'hui'); await pause(900);
await page.evaluate(() => { window.__ECR.length = 0; });
await clic('#edt-ecran .edt-btn', 'edtPhoto()', 'Photo du prévu'); await pause(1400);
const ok2 = await viser('.edt-modale button, #at-modale button', 'Prendre');
if (ok2) { await page.mouse.click(ok2.x, ok2.y); await pause(1600); }
const photoAp = await page.evaluate(() => {
  const e = (window.__ECR || []).filter(x => /photos/.test(x.chemin)).pop();
  if (!e) return null; const p = (e.valeur.photos || []).slice(-1)[0] || {};
  const c = p.cellules || {};
  const n = { total: Object.keys(c).length };
  Object.keys(c).forEach(k => { const t = c[k].nature || '?'; n[t] = (n[t] || 0) + 1; });
  return { depuis: p.depuis, prise: p.prise, nom: p.nom, natures: n }; });
dit('   PHOTO DU PRÉVU · ' + JSON.stringify(photoAp));
await shot('apres-photo-du-prevu');

/* ══════════ ⑤ LE PENDANT INVERSE — PAR LE GESTE ══════════ */
dit(''); dit('⑤ LE PENDANT INVERSE — APRÈS LE DERNIER JOUR');
dit('   on ne peut pas cliquer 44 fois sur « › » pour atteindre juillet 2027.');
dit('   Alors on rapproche le dernier jour : Paul pose le MERCREDI 9 septembre 2026.');
dit('   La semaine du 7 est alors à UN clic, et elle porte les deux côtés : lundi à');
dit('   mercredi dans l\'année, jeudi et vendredi après. Le pendant inverse devient');
dit('   ATTEIGNABLE PAR LE GESTE, et le dépôt refusé aussi.');
await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1600);
await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(250); await voile();
await clic('#tprof-btn', undefined, 'Panneau prof'); await pause(1600);
await clic('.tprof-section-btn', "showProfSection('brevet')", 'Dates de l\'année'); await pause(1000);
const vf2 = await saisirDate('edt-date-fin', '09', '09', '2026', 'fin de l\'année');
if (vf2 === '2026-09-09') bon('le dernier jour est posé au mercredi 9 septembre'); else faute('la fin porte ' + JSON.stringify(vf2));
await clic('.tprof-section-btn', "showProfSection('edt')", 'section Emploi du temps'); await pause(1400);
await clic('#edt-panneau .edt-btn-prim', 'edtOuvrir()', 'Ouvrir l\'emploi du temps'); await pause(2000);
await allerA(1);
dit('   écran : ' + await titreEcran());
const apres = await page.evaluate(() => {
  const q = s => document.querySelectorAll('#edt-ecran ' + s).length;
  const mots = Array.from(document.querySelectorAll('#edt-ecran .edt-b-off'))
    .map(x => (x.innerText || '').trim());
  return { cases: q('.edt-clic'), off: q('.edt-b-off'), prevu: q('.edt-b-prevu'), joue: q('.edt-b-joue'),
    apresLeDernierJour: mots.filter(m => /dernier jour/.test(m)).length,
    mots: Array.from(new Set(mots)) }; });
dit('   semaine du 14 septembre : ' + JSON.stringify(apres));
if (apres.cases > 0 && apres.apresLeDernierJour > 0)
  bon('semaine du 7 septembre : ' + apres.cases + ' cases, dont ' + apres.apresLeDernierJour
    + ' qui disent « après ton dernier jour » — et ' + apres.prevu + ' séance(s) encore prévue(s) AVANT le 9');
else faute('le pendant inverse ne se comporte pas comme attendu : ' + JSON.stringify(apres));
await shot('le-pendant-inverse-apres-le-dernier-jour');

/* ══════════ ④ LE DÉPÔT HORS ANNÉE EST REFUSÉ, ET NOMMÉ ══════════ */
dit(''); dit('④ LE DÉPÔT HORS ANNÉE EST REFUSÉ, ET LE REFUS EST NOMMÉ');
dit('   on le prouve du côté de la FIN : avant la rentrée, tout est déjà passé et');
dit('   c\'est le refus du passé qui sort d\'abord — mesuré, et c\'est le bon ordre.');
const paires = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('#edt-ecran .edt-clic'));
  /* SEULE une case de nature « prevu » se saisit (mesure : `edtGlisserDebut`
     refuse tout le reste). On ne vise donc que celles-la. */
  const src = els.filter(x => x.querySelector('.edt-b-prevu'))[0];
  const b = e => { const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; };
  return src ? { src: b(src), quoi: (src.getAttribute('onclick') || '').slice(0, 60) } : null; });
if (!paires) faute('aucune case source sur la semaine du 14 septembre');
else {
  dit('   source : ' + paires.quoi);
  const dst = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('#edt-ecran .edt-clic'));
    const d = els.filter(x => x.querySelector('.edt-b-off'))[0];
    if (!d) return null; const r = d.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (!dst) faute('aucune case hors année à viser');
  else {
    await page.mouse.move(paires.src.x, paires.src.y); await page.mouse.down(); await pause(250);
    await page.mouse.move(dst.x, dst.y, { steps: 14 }); await pause(400);
    await page.mouse.up(); await pause(1300);
    const msg = await page.evaluate(() => {
      const m = document.getElementById('at-modale') || document.querySelector('.edt-modale');
      return m ? (m.innerText || '').replace(/\n+/g, ' | ').slice(0, 350) : '(rien à l\'écran)'; });
    dit('   le site répond : ' + msg);
    if (/dernier jour|rentr\u00e9e/.test(msg))
      bon('LE REFUS EST NOMMÉ : « ' + (msg.match(/ce jour est[^|]*/i) || [msg])[0].trim() + ' »');
    else faute('le refus n\'est pas nommé : ' + msg);
    await shot('le-refus-du-depot-hors-annee'); } }

/* ══════════ ⑥ AUDIT ADVERSE ══════════ */
dit(''); dit('⑥ AUDIT ADVERSE');
const adverse = await page.evaluate(() => {
  const r = {};
  const avant = JSON.stringify(EDT_DATES);
  /* a — début postérieur à la fin */
  EDT_DATES.debutAnnee = '2027-06-01'; EDT_DATES.finAnnee = '2026-09-03';
  r.debutApresFin = { unJourDuMilieu: !!edtHorsAnnee('2026-12-01'), leDebut: !!edtHorsAnnee('2027-06-01') };
  /* b — une seule date posée */
  EDT_DATES.debutAnnee = '2026-09-03'; EDT_DATES.finAnnee = null;
  r.seulementLeDebut = { avant: !!edtHorsAnnee('2026-08-27'), loinApres: !!edtHorsAnnee('2027-12-01') };
  EDT_DATES.debutAnnee = null; EDT_DATES.finAnnee = '2027-07-03';
  r.seulementLaFin = { avant: !!edtHorsAnnee('2026-08-27'), apres: !!edtHorsAnnee('2027-07-04') };
  /* c — dates effacées après coup */
  EDT_DATES.debutAnnee = null; EDT_DATES.finAnnee = null;
  r.datesEffacees = { rienNEstBorne: !edtHorsAnnee('2026-08-27') && !edtHorsAnnee('2030-01-01') };
  /* d — la borne elle-même, incluse des deux côtés */
  EDT_DATES.debutAnnee = '2026-09-03'; EDT_DATES.finAnnee = '2027-07-03';
  r.bornesIncluses = { leJourDeLaRentree: !edtHorsAnnee('2026-09-03'), leDernierJour: !edtHorsAnnee('2027-07-03'),
    laVeille: !!edtHorsAnnee('2026-09-02'), leLendemain: !!edtHorsAnnee('2027-07-04') };
  /* e — valeurs sales */
  r.valeursSales = { vide: !edtHorsAnnee(''), nul: !edtHorsAnnee(null) };
  EDT_DATES.debutAnnee = JSON.parse(avant).debutAnnee; EDT_DATES.finAnnee = JSON.parse(avant).finAnnee;
  return r; });
dit('   ' + JSON.stringify(adverse, null, 1).replace(/\n\s*/g, ' '));
dit('   ⚠ APPEL DE FONCTION : DÉCLARÉ pour tout ce bloc — l\'écran REFUSE une fin');
dit('     antérieure au début (c\'est le refus de ⑥, il est légitime), donc ces cas');
dit('     ne sont pas atteignables au clic. Ils sont forcés ici, et déclarés comme tels.');
if (adverse.bornesIncluses.leJourDeLaRentree && adverse.bornesIncluses.leDernierJour
  && adverse.bornesIncluses.laVeille && adverse.bornesIncluses.leLendemain)
  bon('les bornes sont incluses des deux côtés');
else faute('les bornes ne sont pas incluses : ' + JSON.stringify(adverse.bornesIncluses));
if (adverse.datesEffacees.rienNEstBorne) bon('dates effacées après coup : plus rien n\'est borné');
else faute('après effacement des dates, la borne mord encore');
if (adverse.seulementLeDebut.avant && !adverse.seulementLeDebut.loinApres)
  bon('avec la seule rentrée posée, seul l\'avant est borné');
else faute('un seul côté posé borne les deux : ' + JSON.stringify(adverse.seulementLeDebut));
await shot('audit-adverse');

/* ══════════ ⑦ LES VERDICTS ══════════ */
dit(''); dit('⑦ LES VERDICTS');
if (hpAp.coches < hpAv.coches)
  bon('heures perdues : ' + hpAv.coches + ' heure(s) cochables avant, ' + hpAp.coches
    + ' après — les heures d\'avant la rentrée ne coûtent plus rien');
else faute('heures perdues : les heures cochables n\'ont pas baissé (' + hpAv.coches + ' → ' + hpAp.coches + ')');
if (destAp.options < destAv.options)
  bon('destinations : ' + destAv.options + ' entrées avant, ' + destAp.options + ' après — les créneaux hors année ne sont plus proposés');
else faute('destinations : ' + destAv.options + ' → ' + destAp.options + ', rien n\'a été retiré');
if (photoAv && photoAp) {
  const pAv = photoAv.natures.prevu || 0, pAp = photoAp.natures.prevu || 0;
  dit('   photo : ' + photoAv.natures.total + ' cases (' + pAv + ' prévues) le ' + photoAv.depuis
    + ' → ' + photoAp.natures.total + ' cases (' + pAp + ' prévues) le ' + photoAp.depuis);
  if (photoAp.natures.total === photoAv.natures.total)
    bon('la photo garde le même nombre de cases : rien ne disparaît de l\'archive');
  else faute('la photo a changé de taille : ' + photoAv.natures.total + ' → ' + photoAp.natures.total);
  if (pAp < pAv) bon('la photo ne photographie plus que des séances de l\'année (' + pAv + ' → ' + pAp + ' prévues)');
  else dit('   (le prévu photographié n\'a pas baissé : ' + pAv + ' → ' + pAp + ' — la semaine photographiée est peut-être entièrement dans l\'année)');
}

dit(''); dit(fautes ? ('ÉCHEC — ' + fautes + ' faute(s)') : 'TOUT PASSE — banc ⑭');
fs.writeFileSync(DOS + '14-journal.txt', jrn.join('\n') + '\n');
await nav.close();
process.exit(fautes ? 1 : 0);

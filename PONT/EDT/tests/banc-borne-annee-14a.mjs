/* BANC ⑭a — LA BORNE DES DATES DE L'ANNÉE, PAR LE GESTE.
   Tout passe par le clic et le clavier. Ce que le banc ne peut pas atteindre au
   geste, il l'écrit et échoue. Les seules choses posées « par la donnée » sont
   des contenus de hub (une heure jouée, une heure banalisée) — jamais un appel
   de fonction du site pour produire un écran.
   Faux hub REST (méthode de tests/banc-dates-annee-11a.mjs) : rien ne sort.
   Usage : node tests/banc-borne-annee-14a.mjs [index.html] */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME = '/opt/google/chrome/chrome';
const ICI = path.dirname(new URL(import.meta.url).pathname);
const FICHIER = path.resolve(process.argv[2] || path.join(ICI, '..', 'index.html'));
const DOS = path.join(ICI, '14a') + '/';
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
  await page.screenshot({ path: f }); dit('   ▸ tests/14a/' + f.split('/').pop()); };

const viser = async (sel, txt) => {
  await voile();
  const trouve = await page.evaluate((s, t) => {
    const els = Array.from(document.querySelectorAll(s)).filter(x => {
      if (t !== null && ((x.innerText || '') + ' ' + (x.getAttribute('onclick') || '')).indexOf(t) < 0) return false;
      const r = x.getBoundingClientRect(); return r.width > 2 && r.height > 2; });
    if (!els.length) return false;
    els[0].setAttribute('data-vise-14a', '1'); els[0].scrollIntoView({ block: 'center' }); return true; },
    sel, txt === undefined ? null : txt);
  if (!trouve) return null;
  await pause(320);
  return page.evaluate(() => { const el = document.querySelector('[data-vise-14a]');
    if (!el) return null; el.removeAttribute('data-vise-14a');
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

/* ══════════ ① AVANT — AUCUNE DATE DÉCLARÉE ══════════ */
dit('① AVANT — AUCUNE DATE D\'ANNÉE DÉCLARÉE');
await page.evaluateOnNewDocument(s => { window.__HUB = JSON.parse(JSON.stringify(s)); }, HUB);
await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1500);
dit('   version : ' + await page.evaluate(() => APP_VERSION));
dit('   EDT_DATES au départ : ' + await page.evaluate(() => JSON.stringify(EDT_DATES)));
await ouvrirEdt();
await allerA(-1);                                   /* la semaine du 31/08 → celle du 24/08 */
dit('   écran : ' + await titreEcran());
const av24 = await releve();
dit('   SEMAINE DU 24/08 · ' + JSON.stringify(av24).slice(0, 300));
await shot('avant-semaine-du-24-aout');
await allerA(1);
const av31 = await releve();
dit('   SEMAINE DU 31/08 · ' + JSON.stringify(av31).slice(0, 300));
await shot('avant-semaine-du-31-aout');
await allerA(1);
const av07 = await releve();
dit('   SEMAINE DU 07/09 · ' + JSON.stringify(av07).slice(0, 300));
await clic('#edt-ecran .edt-btn', "edtVue('mois')", 'Mois'); await pause(1200);
const avMois = await releve();
dit('   VUE MOIS · ' + JSON.stringify(avMois).slice(0, 300));
await shot('avant-vue-mois');
await clic('#edt-ecran .edt-btn', "edtVue('annee')", 'Année'); await pause(1800);
const avAn = await releve();
dit('   VUE ANNÉE · événements ' + avAn.evenementsAnnee + ' · pastilles ' + avAn.pastillesAnnee
  + ' · jours ' + avAn.jourAnnee);
await shot('avant-vue-annee');

/* ══════════ ② ON POSE LE PASSÉ : UNE HEURE JOUÉE ET UNE HEURE BANALISÉE ══════════ */
dit(''); dit('② LE PASSÉ DE PAUL, POSÉ AVANT LA RENTRÉE (1er septembre)');
await clic('#edt-ecran .edt-btn', "edtVue('semaine')", 'Semaine'); await pause(900);
await clic('#edt-ecran .edt-btn', 'edtAujourdhuiAller()', 'Aujourd\'hui'); await pause(900);
const avant3 = await page.evaluate(() => {
  const c = (window.EDT_VUE && EDT_VUE.cellules) || {};
  const k = Object.keys(c).filter(x => /^2026-(08-31|09-01|09-02)/.test(x)
    && c[x].classeMjpc && /^3/i.test(c[x].classeMjpc));
  return k.slice(0, 4).map(x => ({ cle: x, iso: c[x].iso, creneau: c[x].creneau,
    classe: c[x].classeMjpc, nature: c[x].nature })); });
dit('   cases de 3e avant la rentrée : ' + JSON.stringify(avant3));
if (avant3.length < 2) faute('moins de deux cases de 3e avant la rentrée : le banc ne peut pas poser le passé');

if (avant3.length >= 2) {
  const cle = (x) => x.iso + '_' + String(x.creneau).replace(/:/g, 'h') + '_' + String(x.classe).replace(/\s/g, '_');
  const pourTrace = avant3[0], pourDecision = avant3[1];
  HUB = hubDe();
  const se = HUB.site['3e'].chapitres[0].seances[0];
  se.deroule_joue = se.deroule_joue || {};
  se.deroule_joue['banc14a'] = { classe: pourTrace.classe, heures: {} };
  se.deroule_joue['banc14a'].heures[cle(pourTrace)] = {
    activites: [{ titre: 'lecture', reel: 12 }, { titre: 'trace écrite', reel: 8 }], clos: true };
  dit('   HEURE JOUÉE posée au hub : ' + cle(pourTrace) + ' → 2 activités');
  HUB.site.edt.decisions = { '2026-2027': {} };
  HUB.site.edt.decisions['2026-2027'][pourDecision.classe] = { heures: {} };
  HUB.site.edt.decisions['2026-2027'][pourDecision.classe].heures[cle(pourDecision)] =
    { sansSeance: true, categorie: 'sortie scolaire' };
  dit('   HEURE BANALISÉE posée au hub : ' + cle(pourDecision) + ' → sortie scolaire');

  await page.evaluateOnNewDocument(s => { window.__HUB = JSON.parse(JSON.stringify(s)); }, HUB);
  await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1500);
  await ouvrirEdt();
  const avPasse = await releve();
  dit('   SEMAINE DU 31/08 avec le passé · jouée ' + avPasse.jouee + ' · banalisée ' + avPasse.sansSeance
    + ' · prévu ' + avPasse.prevu + ' · cases ' + avPasse.casesCliquables);
  if (avPasse.jouee < 1) faute('la trace posée n\'apparaît pas comme jouée AVANT la borne : le banc ne prouve rien');
  else bon('l\'heure jouée du ' + pourTrace.iso + ' est bien jouée avant la borne');
  if (avPasse.sansSeance < 1) faute('la décision posée n\'apparaît pas AVANT la borne');
  else bon('l\'heure banalisée du ' + pourDecision.iso + ' est bien banalisée avant la borne');
  await shot('avant-le-passe-est-la');
}

/* ══════════ ③ PAUL DÉCLARE SA RENTRÉE — PAR LE GESTE ══════════ */
dit(''); dit('③ PAUL DÉCLARE SA RENTRÉE AU 3 SEPTEMBRE');
await clic('#edt-ecran .edt-btn', 'edtFermer()', 'Fermer l\'emploi du temps'); await pause(900);
const auPanneau = await page.evaluate(() => !!document.querySelector('.tprof-section-btn'));
if (!auPanneau) { await clic('#tprof-btn', undefined, 'Panneau prof'); await pause(1400); }
await clic('.tprof-section-btn', "showProfSection('brevet')", 'Dates de l\'année');
try { await page.waitForSelector('#edt-date-debut', { timeout: 8000 }); } catch (e) { faute('le champ des dates n\'est pas apparu'); }
await pause(400);
const vd = await saisirDate('edt-date-debut', '03', '09', '2026', 'début de l\'année');
if (vd === '2026-09-03') bon('le champ porte le 3 septembre'); else faute('le champ porte ' + JSON.stringify(vd));
await shot('la-rentree-declaree-au-3-septembre');

/* ══════════ ④ APRÈS — CE QUE PAUL VOIT ══════════ */
dit(''); dit('④ APRÈS — LES TROIS VUES, COMPTÉES');
await clic('.tprof-section-btn', "showProfSection('edt')", 'section Emploi du temps'); await pause(1400);
await clic('#edt-panneau .edt-btn-prim', 'edtOuvrir()', 'Ouvrir l\'emploi du temps'); await pause(2000);
await allerA(-1);
dit('   écran : ' + await titreEcran());
const ap24 = await releve();
dit('   SEMAINE DU 24/08 · ' + JSON.stringify(ap24).slice(0, 300));
await shot('apres-semaine-du-24-aout');
await allerA(1);
const ap31 = await releve();
dit('   SEMAINE DU 31/08 · ' + JSON.stringify(ap31).slice(0, 300));
await shot('apres-semaine-du-31-aout');
await allerA(1);
const ap07 = await releve();
dit('   SEMAINE DU 07/09 · ' + JSON.stringify(ap07).slice(0, 300));
await shot('apres-semaine-du-07-septembre');
await clic('#edt-ecran .edt-btn', "edtVue('mois')", 'Mois'); await pause(1200);
const apMois = await releve();
dit('   VUE MOIS · ' + JSON.stringify(apMois).slice(0, 300));
await shot('apres-vue-mois');
await clic('#edt-ecran .edt-btn', "edtVue('annee')", 'Année'); await pause(1800);
const apAn = await releve();
dit('   VUE ANNÉE · événements ' + apAn.evenementsAnnee + ' · pastilles ' + apAn.pastillesAnnee
  + ' · jours ' + apAn.jourAnnee);
await shot('apres-vue-annee');

/* ══════════ ⑤ CE QUE LES CHIFFRES DOIVENT DIRE ══════════ */
dit(''); dit('⑤ LES VERDICTS');
const memeCases = (a, b, quoi) => { if (a.casesCliquables === b.casesCliquables)
    bon(quoi + ' : ' + a.casesCliquables + ' cases avant, ' + b.casesCliquables + ' après — AUCUNE CASE NE DISPARAÎT');
  else faute(quoi + ' : ' + a.casesCliquables + ' cases avant, ' + b.casesCliquables + ' après — DES CASES ONT DISPARU'); };
memeCases(av24, ap24, 'semaine du 24/08');
memeCases(av31, ap31, 'semaine du 31/08');
memeCases(av07, ap07, 'semaine du 07/09');
memeCases(avMois, apMois, 'vue mois');
if (avAn.jourAnnee === apAn.jourAnnee) bon('vue année : ' + apAn.jourAnnee + ' jours dessinés, inchangé');
else faute('vue année : ' + avAn.jourAnnee + ' jours avant, ' + apAn.jourAnnee + ' après');
if (avAn.evenementsAnnee === apAn.evenementsAnnee)
  bon('vue année : ' + apAn.evenementsAnnee + ' événements, inchangé — le calendrier n\'est pas touché');
else faute('vue année : ' + avAn.evenementsAnnee + ' événements avant, ' + apAn.evenementsAnnee + ' après');

if (ap31.prevu < av31.prevu) bon('semaine du 31/08 : le prévu tombe de ' + av31.prevu + ' à ' + ap31.prevu);
else faute('semaine du 31/08 : le prévu n\'a pas bougé (' + av31.prevu + ' → ' + ap31.prevu + ')');
if (ap24.prevu === 0) bon('semaine du 24/08 : plus aucune séance prévue');
else faute('semaine du 24/08 : ' + ap24.prevu + ' séance(s) encore prévue(s)');
if (ap07.prevu === av07.prevu) bon('semaine du 07/09 : le prévu est intact (' + ap07.prevu + ') — après la rentrée, rien ne bouge');
else faute('semaine du 07/09 : le prévu a bougé (' + av07.prevu + ' → ' + ap07.prevu + ')');

const mot = ap31.motsOff.filter(m => /avant ta rentr/.test(m));
if (mot.length) bon('le mot est à l\'écran, ' + mot.length + ' fois : « ' + mot[0] + ' »');
else faute('aucune case ne dit « avant ta rentrée » — mots vus : ' + JSON.stringify(ap31.motsOff.slice(0, 8)));

if (ap31.jouee >= 1) bon('L\'HEURE JOUÉE DU 1er SEPTEMBRE EST TOUJOURS JOUÉE (' + ap31.jouee + ') — le passé n\'est pas réécrit');
else faute('l\'heure jouée du 1er septembre a été effacée par la borne — ' + JSON.stringify(ap31));
if (ap31.sansSeance >= 1) bon('L\'HEURE BANALISÉE DU 2 SEPTEMBRE EST INTACTE (' + ap31.sansSeance + ')');
else faute('la décision du 2 septembre a été effacée par la borne');

const bandAv = av31.bandeaux.length, bandAp = ap31.bandeaux.length;
if (bandAv === bandAp) bon('semaine du 31/08 : ' + bandAp + ' étiquettes de calendrier, inchangé — ' + JSON.stringify(ap31.bandeaux));
else faute('les étiquettes du calendrier ont bougé : ' + bandAv + ' → ' + bandAp);

/* ══════════ ⑥ L'INFOBULLE ══════════ */
dit(''); dit('⑥ L\'INFOBULLE DE LA NATURE NOUVELLE');
await clic('#edt-ecran .edt-btn', "edtVue('semaine')", 'Semaine'); await pause(900);
await allerA(-1); await allerA(-1);
const bulle = await page.evaluate(() => { const x = document.querySelector('#edt-ecran .edt-b-off[title]');
  return x ? x.getAttribute('title') : null; });
if (bulle && /rentr/.test(bulle)) { bon('infobulle présente'); dit('   « ' + bulle + ' »'); }
else faute('pas d\'infobulle sur la case hors année : ' + JSON.stringify(bulle));
await shot('infobulle-de-la-case-hors-annee');

/* ══════════ ⑦ SANS DATE DÉCLARÉE, RIEN NE CHANGE ══════════ */
dit(''); dit('⑦ LE REPLI — SANS DATE DÉCLARÉE, RIEN NE CHANGE');
dit('   (mesuré au ① : la borne n\'a rien fait tant que Paul n\'avait rien posé)');
if (av31.prevu > 0) bon('avant toute déclaration, la semaine du 31/08 portait ' + av31.prevu + ' séance(s) prévue(s) : la borne ne s\'était pas déclenchée');
else faute('la semaine du 31/08 ne portait aucune séance avant déclaration : le repli borne tout seul');

dit(''); dit(fautes ? ('ÉCHEC — ' + fautes + ' faute(s)') : 'TOUT PASSE — banc ⑭a');
fs.writeFileSync(DOS + '14a-journal.txt', jrn.join('\n') + '\n');
await nav.close();
process.exit(fautes ? 1 : 0);

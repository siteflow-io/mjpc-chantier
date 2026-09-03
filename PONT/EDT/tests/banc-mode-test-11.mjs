/* BANC ⑪ — LE MODE TEST NE VIDE PLUS L'ÉCRAN.
   Un seul chargement de page du début à la fin : tout se joue par des clics.
   Le faux hub REST tient lieu de VRAI hub : toute écriture qui l'atteint est une
   écriture au vrai hub, et il ne doit y en avoir AUCUNE en mode test.
   Usage : node tests/banc-mode-test-11.mjs [index.html] */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME = '/opt/google/chrome/chrome';
const ICI = path.dirname(new URL(import.meta.url).pathname);
const FICHIER = path.resolve(process.argv[2] || path.join(ICI, '..', 'index.html'));
const DOS = path.join(ICI, '11') + '/';
fs.mkdirSync(DOS, { recursive: true });
const J = f => JSON.parse(fs.readFileSync(path.join(ICI, f), 'utf8'));
const hub = { classes: J('hub/classes.json'), site: {
  '3e': J('hub/site_3e.json'), config: J('hub/site_config.json'), edt: {
    grille:     { '2026-2027': J('parcours-grille.json') },
    calendrier: { '2026-2027': J('../json/calendrier-2026-2027.json') },
    creneaux:   { '2026-2027': J('../json/creneaux-2026-2027.json') } } } };

const jrn = []; const dit = t => { jrn.push(t); console.log(t); };
const pause = ms => new Promise(r => setTimeout(r, ms));
let n = 0, fautes = 0;
const faute = t => { fautes++; dit('   ✗ ' + t); };
const bon = t => dit('   ✔ ' + t);

const nav = await puppeteer.launch({ executablePath: CHROME,
  args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 768 });
await page.evaluateOnNewDocument(s => {
  window.__HUB = JSON.parse(JSON.stringify(s));
  window.__ECR = [];      /* les écritures qui atteignent le VRAI hub */
  window.__LU = [];       /* les lectures du VRAI hub */
  window.__PANNE = false; /* pour l'audit adverse : le hub injoignable */
  const lire = c => { const q = c.split('/').filter(Boolean); let x = window.__HUB;
    for (const k of q) { if (x === null || typeof x !== 'object' || !(k in x)) return null; x = x[k]; }
    return x === undefined ? null : x; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let x = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof x[q[k]] !== 'object' || x[q[k]] === null) x[q[k]] = {}; x = x[q[k]]; }
    if (v === null) delete x[q[q.length - 1]]; else x[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const t = String(u);
    if (t.indexOf('firebasedatabase.app') >= 0) {
      if (window.__PANNE) return Promise.reject(new Error('hub injoignable'));
      const c = t.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') { window.__LU.push(c);
        return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); }
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push({ chemin: c, methode: m }); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); }
    return Promise.resolve(new Response('null', { status: 200 })); };
}, hub);

const voile = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async nom => { await voile(); n++;
  const f = DOS + 'c' + String(n).padStart(2, '0') + '-' + nom + '.png';
  await page.screenshot({ path: f }); dit('   ▸ tests/11/' + f.split('/').pop()); };
const viser = async (sel, txt) => {
  await voile();
  const ok = await page.evaluate((s, t) => {
    const els = Array.from(document.querySelectorAll(s)).filter(x => {
      if (t !== null && ((x.innerText || '') + ' ' + (x.getAttribute('onclick') || '')).indexOf(t) < 0) return false;
      const r = x.getBoundingClientRect(); return r.width > 2 && r.height > 2; });
    if (!els.length) return false;
    els[0].setAttribute('data-vise-11', '1'); els[0].scrollIntoView({ block: 'center' }); return true; },
    sel, txt === undefined ? null : txt);
  if (!ok) return null;
  await pause(320);
  return page.evaluate(() => { const el = document.querySelector('[data-vise-11]');
    if (!el) return null; el.removeAttribute('data-vise-11');
    const r = el.getBoundingClientRect();
    const sous = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { x: r.x + r.width / 2, y: r.y + r.height / 2,
      dessus: !!(sous && (sous === el || el.contains(sous) || sous.contains(el))),
      txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 44) }; }); };
const clic = async (sel, txt, quoi) => { let c = await viser(sel, txt);
  if (!c) { faute('NON ATTEINT PAR UN CLIC : ' + (quoi || sel)); return null; }
  if (!c.dessus) { await pause(800); c = await viser(sel, txt) || c; }
  if (!c.dessus) faute('l\'élément visé est recouvert : ' + (quoi || c.txt));
  await page.mouse.click(c.x, c.y); await pause(90);
  dit('   ✔ CLIC « ' + (c.txt || quoi) + ' »'); return c; };
const fermerInfo = async () => { const c = await viser('#at-modale button', 'Compris');
  if (c) { await page.mouse.click(c.x, c.y); await pause(300); } };

/* ce que la grille MONTRE : des séances, ou des cases vides ? */
const grille = () => page.evaluate(() => {
  const c = {}; let avecTitre = 0;
  Object.values(EDT_VUE.cellules || {}).forEach(x => { c[x.nature] = (c[x.nature] || 0) + 1;
    if (x.titre) avecTitre++; });
  const cartes = Array.from(document.querySelectorAll('#edt-ecran .edt-carte, #edt-ecran .edt-cartes > *'))
    .map(x => (x.innerText || '').replace(/\n+/g, ' · ').slice(0, 60));
  return { cases: Object.keys(EDT_VUE.cellules || {}).length, natures: c, casesAvecSeance: avecTitre,
    modeTest: m8TestOn(), cartes: cartes.slice(0, 2),
    chapitresEnCache: (typeof EDT_CHAP === 'object' && EDT_CHAP) ? Object.keys(EDT_CHAP).map(k => k + ':' + (EDT_CHAP[k] || []).length).join(',') : '?' }; });
const empreinteHub = () => page.evaluate(() => JSON.stringify(window.__HUB).length + '|' +
  JSON.stringify(window.__HUB).split('').reduce((a, ch) => ((a * 31 + ch.charCodeAt(0)) >>> 0), 7).toString(16));
const ecritures = () => page.evaluate(() => JSON.parse(JSON.stringify(window.__ECR)));
const ouvrirEdt = async () => {
  await clic('.tprof-section-btn', "showProfSection('edt')", 'Emploi du temps'); await pause(1500);
  await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2300);
  await clic('#edt-ecran button', "edtVue('semaine')", 'Semaine'); await pause(1100); };
const fermerEdt = async () => { await clic('#edt-ecran [onclick*="edtFermer"]', 'Fermer l', 'Fermer l\'emploi du temps'); await pause(900); };

/* ══════════ ① HORS MODE TEST — la référence ══════════ */
dit('① HORS MODE TEST — ce que la grille montre normalement');
await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1600);
dit('   version : ' + await page.evaluate(() => APP_VERSION));
await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(300); await voile();
await clic('#tprof-btn', undefined, 'Panneau prof'); await pause(1600);
await ouvrirEdt();
const vrai = await grille();
dit('   ' + JSON.stringify(vrai));
await shot('hors-mode-test-la-grille-garnie');

/* ══════════ ② MODE TEST ALLUMÉ — la grille reste garnie ══════════ */
dit(''); dit('② MODE TEST ALLUMÉ — la grille garde ses séances et ses chapitres');
await fermerEdt();
const hubAvant = await empreinteHub();
await page.evaluate(() => { window.__ECR.length = 0; });
await clic('#tprof-testpill', undefined, 'pastille Mode test'); await pause(1500);
dit('   mode test : ' + await page.evaluate(() => m8TestOn()));
await ouvrirEdt();
const test = await grille();
dit('   ' + JSON.stringify(test));
if (test.modeTest === true) bon('le mode test est bien allumé');
else faute('le mode test ne s\'est pas allumé');
const essais = await page.evaluate(() => Object.values(EDT_VUE.cellules || {}).filter(x => x.essai).length);
if (test.casesAvecSeance === vrai.casesAvecSeance + essais && vrai.casesAvecSeance > 0)
  bon('les ' + vrai.casesAvecSeance + ' séances réelles sont là, plus les ' + essais
    + ' de la classe d\'essai (avant le correctif : 0 séance, tout à « aucune séance prête »)');
else faute('les séances ne suivent pas : ' + test.casesAvecSeance + ' en mode test contre '
  + vrai.casesAvecSeance + ' réelles + ' + essais + ' d\'essai');
if (test.chapitresEnCache === vrai.chapitresEnCache) bon('les chapitres sont lus pareil : ' + test.chapitresEnCache);
else faute('chapitres : ' + test.chapitresEnCache + ' contre ' + vrai.chapitresEnCache);
await shot('mode-test-allume-la-grille-reste-garnie');

/* ══════════ ③ AUCUNE ÉCRITURE AU VRAI HUB ══════════ */
dit(''); dit('③ EN MODE TEST, AUCUNE ÉCRITURE N\'ATTEINT LE VRAI HUB');
/* on fait exprès des gestes qui écrivent : ouvrir une case, la banaliser */
const k = await page.evaluate(() => Object.keys(EDT_VUE.cellules).filter(x => EDT_VUE.cellules[x].nature === 'prevu')[0] || null);
const b = k ? await page.evaluate(c => { const el = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]'))
    .filter(x => { const o = x.getAttribute('onclick') || '';
      return o.indexOf(c.split('|')[0]) >= 0 && o.indexOf(c.split('|')[1]) >= 0; })[0];
  if (!el) return null; const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, k) : null;
if (b) { await page.mouse.click(b.x, b.y); await pause(1000); bon('CLIC sur la case ' + k); }
else faute('aucune case à ouvrir en mode test');
await clic('#edt-modale button', 'Banaliser cette heure', 'Banaliser cette heure'); await pause(1200);
await fermerInfo();
const ecr = await ecritures();
const hubApres = await empreinteHub();
dit('   écritures qui ont atteint le vrai hub : ' + JSON.stringify(ecr));
dit('   empreinte du hub avant : ' + hubAvant + ' · après : ' + hubApres);
if (ecr.length === 0) bon('zéro écriture au vrai hub');
else faute(ecr.length + ' écriture(s) sont parties au vrai hub en mode test');
if (hubAvant === hubApres) bon('le contenu du vrai hub est identique, octet pour octet');
else faute('le contenu du vrai hub a changé');
await shot('mode-test-un-geste-qui-ecrit-rien-ne-sort');

/* ══════════ ④ EN SORTANT — les vraies données reviennent, sans rechargement ══════════ */
dit(''); dit('④ EN SORTANT DU MODE TEST — les vraies données reviennent, SANS rechargement');
const enTest = await grille();
dit('   pendant le test : ' + JSON.stringify(enTest.natures));
await fermerEdt();
await clic('#tprof-testpill', undefined, 'pastille Mode test'); await pause(1500);
dit('   mode test : ' + await page.evaluate(() => m8TestOn()));
await ouvrirEdt();
const apres = await grille();
dit('   après extinction : ' + JSON.stringify(apres));
if (JSON.stringify(apres.natures) === JSON.stringify(vrai.natures))
  bon('la grille est exactement celle d\'avant le mode test');
else faute('la grille ne revient pas à son état réel : ' + JSON.stringify(apres.natures) + ' contre ' + JSON.stringify(vrai.natures));
if (apres.casesAvecSeance === vrai.casesAvecSeance) bon('les séances réelles sont revenues : ' + apres.casesAvecSeance);
else faute('séances : ' + apres.casesAvecSeance + ' contre ' + vrai.casesAvecSeance);
dit('   la page n\'a pas été rechargée : ' + await page.evaluate(() => performance.getEntriesByType('navigation').length + ' navigation(s)'));
await shot('apres-extinction-les-vraies-donnees-sans-rechargement');

/* ══════════ ⑤ AUDIT ADVERSE ══════════ */
dit(''); dit('⑤ AUDIT ADVERSE');

dit('   ⓐ le vrai hub injoignable pendant le mode test');
await fermerEdt();
await clic('#tprof-testpill', undefined, 'pastille Mode test'); await pause(1200);
await page.evaluate(() => { window.__PANNE = true; window.__ECR.length = 0; });
await ouvrirEdt();
const panne = await grille();
dit('      ' + JSON.stringify(panne).slice(0, 200));
const erreurs = await page.evaluate(() => document.querySelectorAll('#edt-ecran').length);
if (erreurs === 1) bon('l\'écran tient debout, hub injoignable');
else faute('l\'écran a disparu quand le hub est tombé');
if ((await ecritures()).length === 0) bon('rien n\'a été écrit pendant la panne');
else faute('des écritures pendant la panne');
await shot('audit-hub-injoignable-en-mode-test');
await page.evaluate(() => { window.__PANNE = false; });

dit('   ⓑ la panne n\'est pas mise en cache : le hub revient, les données aussi');
await fermerEdt();
await ouvrirEdt();
const revenu = await grille();
dit('      ' + JSON.stringify(revenu.natures) + ' · séances : ' + revenu.casesAvecSeance);
/* on est en mode test : les séances réelles PLUS celles de la classe d'essai */
if (revenu.casesAvecSeance === vrai.casesAvecSeance + essais)
  bon('les séances sont revenues après la panne (' + vrai.casesAvecSeance + ' réelles + ' + essais
    + ' d\'essai) — ni le vide ni la panne n\'ont été mis en cache');
else faute('après la panne, la grille ne revient pas : ' + revenu.casesAvecSeance + ' séance(s) contre '
  + (vrai.casesAvecSeance + essais) + ' attendues');

dit('   ⓒ une injection pendant le mode test n\'atteint pas le vrai hub');
await fermerEdt();
await page.evaluate(() => { window.__ECR.length = 0; });
await clic('.tprof-section-btn', "showProfSection('edt')", 'Emploi du temps'); await pause(1400);
await clic('#edt-panneau [onclick]', "edtInjOuvrir('creneaux')", 'Injecter — Créneaux horaires'); await pause(1000);
const zone = await viser('#edt-inj-coller', null);
if (zone) {
  await page.mouse.click(zone.x, zone.y); await pause(200);
  await page.keyboard.type('{"annee":"2026-2027","creneaux":[{"debut":"08:00","fin":"08:55"}]}', { delay: 5 });
  await clic('#edt-panneau button', 'Vérifier', 'Vérifier'); await pause(1200);
  const inj = await viser('#edt-panneau button', 'Injecter');
  if (inj) { await page.mouse.click(inj.x, inj.y); await pause(1500); await fermerInfo(); dit('      ✔ CLIC « Injecter »'); }
  else dit('      (le site n\'a pas proposé « Injecter » : le texte n\'a pas été accepté)');
  const e2 = await ecritures();
  dit('      écritures au vrai hub : ' + JSON.stringify(e2));
  if (e2.length === 0) bon('une injection en mode test ne touche pas le vrai hub');
  else faute(e2.length + ' écriture(s) au vrai hub pendant une injection en mode test');
  await shot('audit-injection-en-mode-test');
} else faute('la zone de collage est absente');

dit('   ⓓ la classe d\'essai un jour sans cours (vacances, férié)');
await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2200);
await clic('#edt-ecran button', "edtVue('mois')", 'Mois'); await pause(1500);
let sauts = 0, trouve = false;
while (sauts < 4 && !trouve) {
  trouve = await page.evaluate(() => document.querySelectorAll('#edt-ecran .edt-mcase-off').length > 0);
  if (trouve) break;
  const f = await viser('#edt-ecran button, #edt-ecran [onclick]', 'edtAller(1)');
  if (!f) break; await page.mouse.click(f.x, f.y); await pause(900); sauts++; }
const jf = await page.evaluate(() => {
  const off = Array.from(document.querySelectorAll('#edt-ecran .edt-mcase-off'));
  return { mois: EDT_VUE.ancre, joursSansCours: off.length,
    essaiSurCesJours: off.reduce((a, d) => a + d.querySelectorAll('.edt-m-essai').length, 0),
    essaiAilleurs: document.querySelectorAll('#edt-ecran .edt-m-essai').length }; });
dit('      ' + sauts + ' clic(s) sur « › » → ' + JSON.stringify(jf));
if (jf.joursSansCours > 0 && jf.essaiSurCesJours === 0)
  bon(jf.joursSansCours + ' jour(s) sans cours atteints par les flèches : AUCUNE case d\'essai ne s\'y pose'
    + ' (et ' + jf.essaiAilleurs + ' ailleurs dans le mois)');
else if (jf.joursSansCours === 0) faute('aucun jour sans cours atteint : le point ⓓ n\'est pas prouvé');
else faute(jf.essaiSurCesJours + ' case(s) d\'essai posée(s) un jour sans cours');
await shot('audit-classe-essai-un-jour-sans-cours');

dit('   ⓔ une date d\'année saisie puis effacée, et une fin saisie avant tout début');
await clic('#edt-ecran [onclick*="edtFermer"]', 'Fermer l', 'Fermer l\'emploi du temps'); await pause(900);
await clic('#tprof-testpill', undefined, 'pastille Mode test'); await pause(1300);   /* on éteint : on parle du vrai hub */
await clic('.tprof-section-btn', "showProfSection('brevet')", 'Dates de l\'année');
try { await page.waitForSelector('#edt-date-fin', { timeout: 8000 }); } catch (e) {}
await pause(500);
const datesHub = () => page.evaluate(() => JSON.stringify((((window.__HUB.site || {}).config || {}).brevetDates) || {}));
dit('      au hub avant : ' + await datesHub());
const ordre = await page.evaluate(() => new Intl.DateTimeFormat().formatToParts(new Date(2026, 7, 24))
  .filter(p => p.type !== 'literal').map(p => p.type).join('-'));
const frapper = async (id, jj, mm, aaaa) => {
  const c = await viser('#' + id, null); if (!c) { faute('champ ' + id + ' absent'); return null; }
  const g = await page.evaluate(i => { const r = document.getElementById(i).getBoundingClientRect();
    return { x: r.x + 12, y: r.y + r.height / 2 }; }, id);
  await page.mouse.click(g.x, g.y); await pause(150);
  await page.keyboard.press('Delete'); await pause(100);
  await page.keyboard.type(ordre.split('-').map(t => t === 'day' ? jj : t === 'month' ? mm : aaaa).join(''), { delay: 60 });
  const t = await page.evaluate(() => { const h = Array.from(document.querySelectorAll('h2'))
      .filter(x => /Dates de l/.test(x.innerText))[0]; const r = h.getBoundingClientRect();
    return { x: r.x + 30, y: r.y + r.height / 2 }; });
  await page.mouse.click(t.x, t.y); await pause(900);
  return page.evaluate(i => (document.getElementById(i) || {}).value, id); };
/* la fin, saisie alors qu'aucun début n'est posé */
await page.evaluate(() => { window.__ECR.length = 0; });
const vFin = await frapper('edt-date-fin', '03', '07', '2027');
dit('      fin saisie sans début : le champ porte ' + JSON.stringify(vFin)
  + ' · écritures ' + JSON.stringify(await ecritures()) + ' · hub ' + await datesHub());
if (String(vFin) === '2027-07-03') bon('une fin peut se poser seule : `edtValiderDatesAnnee` ne compare rien tant qu\'il manque une date — comportement d\'origine, mesuré, non modifié');
else faute('la fin ne s\'est pas posée : ' + vFin);
/* puis on l'efface */
await page.evaluate(() => { window.__ECR.length = 0; });
const g2 = await page.evaluate(() => { const r = document.getElementById('edt-date-fin').getBoundingClientRect();
  return { x: r.x + 12, y: r.y + r.height / 2 }; });
await page.mouse.click(g2.x, g2.y); await pause(150);
for (let i = 0; i < 3; i++) { await page.keyboard.press('Delete'); await pause(120); }
const t2 = await page.evaluate(() => { const h = Array.from(document.querySelectorAll('h2'))
    .filter(x => /Dates de l/.test(x.innerText))[0]; const r = h.getBoundingClientRect();
  return { x: r.x + 30, y: r.y + r.height / 2 }; });
await page.mouse.click(t2.x, t2.y); await pause(900);
const apresEffacement = await page.evaluate(() => (document.getElementById('edt-date-fin') || {}).value);
dit('      après effacement : le champ porte ' + JSON.stringify(apresEffacement)
  + ' · écritures ' + JSON.stringify(await ecritures()) + ' · hub ' + await datesHub());
if ((await ecritures()).length === 0) bon('un champ vidé n\'écrit rien : le hub garde la dernière date entière');
else faute('un champ vidé a écrit au hub');
await shot('audit-date-saisie-puis-effacee');

dit('');
dit('lectures du vrai hub pendant toute la session : ' + await page.evaluate(() => window.__LU.length));
dit('écritures au vrai hub sur toute la session en mode test : ' + JSON.stringify(await ecritures()));
dit(fautes ? ('ROUGE — ' + fautes + ' faute(s)') : 'VERT — le mode test ne vide plus, et rien n\'en sort');
fs.writeFileSync(path.join(DOS, 'journal-11.txt'), jrn.join('\n') + '\n');
await nav.close();
process.exit(fautes ? 1 : 0);

/* BANC ⑪b — LA CLASSE D'ESSAI EN COULEUR, PAR LE GESTE.
   Mode test éteint, puis allumé, par des clics ; semaine, mois, année.
   Faux hub REST : rien ne sort. Le banc échoue si un geste n'est pas atteignable.
   Usage : node tests/banc-classe-essai-couleur-11b.mjs [index.html] */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME = '/opt/google/chrome/chrome';
const ICI = path.dirname(new URL(import.meta.url).pathname);
const FICHIER = path.resolve(process.argv[2] || path.join(ICI, '..', 'index.html'));
const DOS = path.join(ICI, '11b') + '/';
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
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let x = window.__HUB;
    for (const k of q) { if (x === null || typeof x !== 'object' || !(k in x)) return null; x = x[k]; }
    return x === undefined ? null : x; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let x = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof x[q[k]] !== 'object' || x[q[k]] === null) x[q[k]] = {}; x = x[q[k]]; }
    if (v === null) delete x[q[q.length - 1]]; else x[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const t = String(u);
    if (t.indexOf('firebasedatabase.app') >= 0) {
      const c = t.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push({ chemin: c, valeur: bd }); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); }
    return Promise.resolve(new Response('null', { status: 200 })); };
}, hub);

const voile = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async nom => { await voile(); n++;
  const f = DOS + 'b' + String(n).padStart(2, '0') + '-' + nom + '.png';
  await page.screenshot({ path: f }); dit('   ▸ tests/11b/' + f.split('/').pop()); };
const viser = async (sel, txt) => {
  await voile();
  const ok = await page.evaluate((s, t) => {
    const els = Array.from(document.querySelectorAll(s)).filter(x => {
      if (t !== null && ((x.innerText || '') + ' ' + (x.getAttribute('onclick') || '')).indexOf(t) < 0) return false;
      const r = x.getBoundingClientRect(); return r.width > 2 && r.height > 2; });
    if (!els.length) return false;
    els[0].setAttribute('data-vise-11b', '1'); els[0].scrollIntoView({ block: 'center' }); return true; },
    sel, txt === undefined ? null : txt);
  if (!ok) return null;
  await pause(350);
  return page.evaluate(() => { const el = document.querySelector('[data-vise-11b]');
    if (!el) return null; el.removeAttribute('data-vise-11b');
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
/* ce que l'écran montre VRAIMENT : la classe CSS posée, et la couleur calculée */
const couleurs = () => page.evaluate(() => {
  const semaine = Array.from(document.querySelectorAll('#edt-ecran .edt-b-essai'));
  const mois = Array.from(document.querySelectorAll('#edt-ecran .edt-m-essai'));
  const echantillon = (semaine[0] || mois[0]) ? getComputedStyle(semaine[0] || mois[0]) : null;
  return { casesEssaiSemaine: semaine.length, pastillesEssaiMois: mois.length,
    cellulesEssai: Object.values(EDT_VUE.cellules || {}).filter(x => x.essai).length,
    cases: Object.keys(EDT_VUE.cellules || {}).length,
    modeTest: (typeof m8TestOn === 'function') ? m8TestOn() : '?',
    bordure: echantillon ? echantillon.borderLeftColor : '(aucune case d\'essai)',
    fond: echantillon ? echantillon.backgroundColor : '',
    ou: semaine.length ? semaine.map(x => (x.innerText || '').replace(/\n/g, ' ').slice(0, 34)).slice(0, 4) : [] }; });

/* ══════════ ① MODE TEST ÉTEINT : AUCUNE COULEUR, AUCUNE CASE D'ESSAI ══════════ */
dit('① MODE TEST ÉTEINT — la classe d\'essai n\'est nulle part');
await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1500);
dit('   version : ' + await page.evaluate(() => APP_VERSION));
await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(300); await voile();
await clic('#tprof-btn', undefined, 'Panneau prof'); await pause(1600);
await clic('.tprof-section-btn', "showProfSection('edt')", 'Emploi du temps'); await pause(1600);
await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2200);
await clic('#edt-ecran button', "edtVue('semaine')", 'Semaine'); await pause(1000);
const eteint = await couleurs();
dit('   ' + JSON.stringify(eteint));
if (!eteint.modeTest && eteint.casesEssaiSemaine === 0 && eteint.cellulesEssai === 0)
  bon('hors mode test : aucune case d\'essai, aucune couleur');
else faute('des cases d\'essai apparaissent hors mode test : ' + JSON.stringify(eteint));
await shot('mode-test-eteint-aucune-couleur');
/* l'année, éteinte : on retient ce qu'elle montre, pour le comparer allumée */
await clic('#edt-ecran button', "edtVue('annee')", 'Année'); await pause(1800);
const anneeEteinte = await page.evaluate(() => ({
  bandeaux: document.querySelectorAll('#edt-ecran .edt-an-b').length,
  classes: document.querySelectorAll('#edt-ecran .edt-an-b.edt-an-classe').length }));
dit('   l\'année, mode test éteint : ' + JSON.stringify(anneeEteinte));
await shot('mode-test-eteint-annee');
await clic('#edt-ecran button', "edtVue('semaine')", 'Semaine'); await pause(900);

/* ══════════ ② MODE TEST ALLUMÉ : LA SEMAINE ══════════ */
dit(''); dit('② MODE TEST ALLUMÉ — la semaine');
await clic('#edt-ecran [onclick*="edtFermer"]', 'Fermer l', 'Fermer l\'emploi du temps'); await pause(900);
await clic('#tprof-testpill', undefined, 'pastille Mode test'); await pause(1400);
dit('   mode test : ' + await page.evaluate(() => m8TestOn()));
await clic('.tprof-section-btn', "showProfSection('edt')", 'Emploi du temps'); await pause(1500);
await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2200);
await clic('#edt-ecran button', "edtVue('semaine')", 'Semaine'); await pause(1200);
const semaine = await couleurs();
dit('   ' + JSON.stringify(semaine));
if (semaine.casesEssaiSemaine > 0) bon(semaine.casesEssaiSemaine + ' case(s) en couleur dans la semaine · bordure ' + semaine.bordure + ' · fond ' + semaine.fond);
else faute('aucune case en couleur dans la semaine alors que le mode test est allumé');
if (semaine.casesEssaiSemaine === semaine.cellulesEssai) bon('autant de cases colorées que de cases d\'essai : ' + semaine.cellulesEssai);
else faute('cases colorées ' + semaine.casesEssaiSemaine + ' ≠ cases d\'essai ' + semaine.cellulesEssai);
await shot('mode-test-allume-semaine-en-couleur');

/* ══════════ ③ LE MOIS ══════════ */
dit(''); dit('③ LE MOIS');
await clic('#edt-ecran button', "edtVue('mois')", 'Mois'); await pause(1600);
const mois = await couleurs();
dit('   ' + JSON.stringify(mois));
if (mois.pastillesEssaiMois > 0) bon(mois.pastillesEssaiMois + ' pastille(s) en couleur dans le mois');
else faute('aucune pastille en couleur dans le mois');
await shot('mode-test-allume-mois-en-couleur');

/* ══════════ ④ L'ANNÉE ══════════ */
dit(''); dit('④ L\'ANNÉE — ce qu\'elle montre des heures de classe');
await clic('#edt-ecran button', "edtVue('annee')", 'Année'); await pause(2000);
const annee = await page.evaluate(() => ({
  bandeaux: document.querySelectorAll('#edt-ecran .edt-an-b').length,
  classes: document.querySelectorAll('#edt-ecran .edt-an-b.edt-an-classe').length,
  essai: document.querySelectorAll('#edt-ecran .edt-b-essai, #edt-ecran .edt-m-essai').length }));
dit('   l\'année, mode test allumé : ' + JSON.stringify(annee));
if (annee.bandeaux === anneeEteinte.bandeaux)
  dit('   MESURE : l\'année montre AUTANT de bandeaux éteinte qu\'allumée (' + annee.bandeaux
    + ') — elle ne dessine pas les créneaux de cours, mais les événements et les jours de classe :'
    + ' il n\'y a rien à y colorer, et je le déclare plutôt que d\'y inventer une couleur.');
else faute('l\'année change avec le mode test (' + anneeEteinte.bandeaux + ' → ' + annee.bandeaux
    + ') : des heures d\'essai y apparaissent sans couleur');
await shot('mode-test-allume-annee');

/* ══════════ ⑤ ON ÉTEINT : LA COULEUR DISPARAÎT ══════════ */
dit(''); dit('⑤ MODE TEST RÉÉTEINT — la couleur disparaît avec la classe d\'essai');
await clic('#edt-ecran button', "edtVue('semaine')", 'Semaine'); await pause(900);
await clic('#edt-ecran [onclick*="edtFermer"]', 'Fermer l', 'Fermer l\'emploi du temps'); await pause(900);
await clic('#tprof-testpill', undefined, 'pastille Mode test'); await pause(1400);
dit('   mode test : ' + await page.evaluate(() => m8TestOn()));
await clic('.tprof-section-btn', "showProfSection('edt')", 'Emploi du temps'); await pause(1500);
await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2200);
await clic('#edt-ecran button', "edtVue('semaine')", 'Semaine'); await pause(1200);
const reteint = await couleurs();
dit('   ' + JSON.stringify(reteint));
if (reteint.casesEssaiSemaine === 0 && reteint.cellulesEssai === 0)
  bon('la couleur a disparu en même temps que la classe d\'essai');
else faute('la couleur reste après extinction : ' + JSON.stringify(reteint));
await shot('mode-test-reeteint-plus-de-couleur');

dit('');
dit('écritures parties vers le faux hub : ' + await page.evaluate(() => window.__ECR.length));
dit(fautes ? ('ROUGE — ' + fautes + ' faute(s)') : 'VERT — la classe d\'essai est en couleur, et seulement en mode test');
fs.writeFileSync(path.join(DOS, 'journal-11b.txt'), jrn.join('\n') + '\n');
await nav.close();
process.exit(fautes ? 1 : 0);

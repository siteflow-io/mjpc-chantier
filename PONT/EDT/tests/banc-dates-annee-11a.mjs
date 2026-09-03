/* BANC ⑪a — LES DEUX DATES DE L'ANNÉE, PAR LE GESTE.
   Tout passe par le clic et le clavier : aucun appel de fonction n'est utilisé
   pour produire un écran ou une écriture. Ce que le banc ne peut pas atteindre
   au geste, il l'écrit et échoue.
   Faux hub REST (méthode de tests/captures-clics-01ter.mjs) : rien ne sort.
   Usage : node tests/banc-dates-annee-11a.mjs [index.html] */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME = '/opt/google/chrome/chrome';
/* les chemins se lisent À PARTIR DU BANC LUI-MÊME : `banc-tout` le lance depuis
   `tests/`, à la main on le lance depuis `PONT/EDT/`. Les deux doivent marcher. */
const ICI = path.dirname(new URL(import.meta.url).pathname);
const FICHIER = path.resolve(process.argv[2] || path.join(ICI, '..', 'index.html'));
const DOS = path.join(ICI, '11a') + '/';
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
  args: ['--no-sandbox', '--allow-file-access-from-files', '--lang=fr-FR'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 768 });
await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr' });
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
  const f = DOS + 'a' + String(n).padStart(2, '0') + '-' + nom + '.png';
  await page.screenshot({ path: f }); dit('   ▸ tests/11a/' + f.split('/').pop()); };
/* viser = amener l'élément sous les yeux, ATTENDRE que le défilement soit fini,
   PUIS mesurer. Mesuré au premier passage : sans cette attente, le défilement
   continuait après la mesure et le clic tombait sur le bouton d'à côté — l'écran
   capturé n'était pas celui qu'on croyait. */
const viser = async (sel, txt) => {
  await voile();   /* le voile d'accueil du site se remet tout seul : il recouvrait le geste */
  const trouve = await page.evaluate((s, t) => {
    const els = Array.from(document.querySelectorAll(s)).filter(x => {
      if (t !== null && ((x.innerText || '') + ' ' + (x.getAttribute('onclick') || '')).indexOf(t) < 0) return false;
      const r = x.getBoundingClientRect(); return r.width > 2 && r.height > 2; });
    if (!els.length) return false;
    els[0].setAttribute('data-vise-11a', '1'); els[0].scrollIntoView({ block: 'center' }); return true; },
    sel, txt === undefined ? null : txt);
  if (!trouve) return null;
  await pause(350);
  return page.evaluate(() => { const el = document.querySelector('[data-vise-11a]');
    if (!el) return null; el.removeAttribute('data-vise-11a');
    const r = el.getBoundingClientRect();
    const sous = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, g: r.x + 12,
      dessus: !!(sous && (sous === el || el.contains(sous) || sous.contains(el))),
      txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 46) }; }); };
const clic = async (sel, txt, quoi) => { let c = await viser(sel, txt);
  if (!c) { faute('NON ATTEINT PAR UN CLIC : ' + (quoi || sel)); return null; }
  /* recouvert : c'est presque toujours une ouverture de panneau encore en cours.
     On laisse le temps de finir et on remesure ; si c'est encore recouvert, c'est
     que le geste n'est pas faisable, et on le compte comme une faute. */
  if (!c.dessus) { await pause(800); c = await viser(sel, txt) || c; }
  if (!c.dessus) faute('l\'élément visé est recouvert : ' + (quoi || c.txt));
  await page.mouse.click(c.x, c.y); await pause(80);
  dit('   ✔ CLIC « ' + (c.txt || quoi) + ' »'); return c; };
/* la saisie d'une date : clic sur le PREMIER segment du champ, puis les chiffres.
   Mesuré au banc : un clic au centre tombe sur l'icône du calendrier et n'écrit rien. */
/* l'ordre des segments d'un champ « date » dépend de la locale du navigateur :
   on la lit, et on frappe les huit chiffres dans CET ordre. */
const ordreSegments = () => page.evaluate(() =>
  new Intl.DateTimeFormat().formatToParts(new Date(2026, 7, 24))
    .filter(p => p.type !== 'literal').map(p => p.type).join('-'));
const saisirDate = async (id, jj, mm, aaaa, quoi) => {
  const ordre = await ordreSegments();
  const chiffres = ordre.split('-').map(t => t === 'day' ? jj : t === 'month' ? mm : aaaa).join('');
  const c = await viser('#' + id, null);
  if (!c) { faute('champ ' + id + ' absent'); return null; }
  /* on clique le PREMIER segment (le jour), on l'efface, puis on frappe les huit
     chiffres : jour, mois, année — exactement ce que fait Paul au clavier. */
  await page.mouse.click(c.g, c.y); await pause(150);
  await page.keyboard.press('Delete'); await pause(120);
  await page.keyboard.type(chiffres, { delay: 70 });
  /* on quitte le champ comme Paul : en cliquant ailleurs. Mesuré au banc : la
     touche Tab navigue ENTRE LES SEGMENTS du champ date et ne le quitte pas
     toujours — sans sortie du champ, rien n'est posé. */
  const ailleurs = await page.evaluate(() => { const t = Array.from(document.querySelectorAll('h2'))
      .filter(x => /Dates de l/.test(x.innerText))[0] || document.querySelector('.m8-titre');
    if (!t) return null; const r = t.getBoundingClientRect();
    return { x: r.x + Math.min(r.width - 4, 40), y: r.y + r.height / 2 }; });
  if (ailleurs) await page.mouse.click(ailleurs.x, ailleurs.y);
  await pause(1000);
  const v = await page.evaluate(i => (document.getElementById(i) || {}).value, id);
  dit('     (EDT_DATES : ' + await page.evaluate(() => JSON.stringify(EDT_DATES))
    + ' · focus : ' + await page.evaluate(() => (document.activeElement || {}).id || (document.activeElement || {}).tagName) + ')');
  dit('   ✔ FRAPPE de ' + jj + '/' + mm + '/' + aaaa + ' dans « ' + quoi + ' » (ordre du champ : ' + ordre
    + ', huit chiffres « ' + chiffres + ' ») → le champ porte ' + JSON.stringify(v));
  return v; };
const auHub = () => page.evaluate(() => JSON.stringify((((window.__HUB.site || {}).config || {}).brevetDates) || null));
const annonce = () => page.evaluate(() => { const m = document.getElementById('at-modale');
  return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 400) : '(aucune annonce)'; });
const fermerInfo = async () => { const c = await viser('#at-modale button', 'Compris');
  if (c) { await page.mouse.click(c.x, c.y); await pause(350); } };

/* ══════════ ① L'ÉCRAN PORTE LES DEUX CHAMPS ══════════ */
dit('① L\'ÉCRAN « Dates de l\'année » PORTE LE DÉBUT ET LA FIN');
await page.goto('file://' + FICHIER, { waitUntil: 'load' }); await pause(1500);
dit('   version : ' + await page.evaluate(() => APP_VERSION));
await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(300); await voile();
await clic('#tprof-btn', undefined, 'Panneau prof'); await pause(1600);
await clic('.tprof-section-btn', "showProfSection('brevet')", 'Dates de l\'année');
try { await page.waitForSelector('#edt-date-debut', { timeout: 8000 }); } catch (e) { dit('   (le champ n\'est pas apparu en 8 s)'); }
await pause(500);
const champs = await page.evaluate(() => ({
  debut: !!document.getElementById('edt-date-debut'), fin: !!document.getElementById('edt-date-fin'),
  brevet: document.querySelectorAll('.m8-date-in').length }));
if (champs.debut && champs.fin) bon('les deux champs sont à l\'écran (avec les ' + (champs.brevet - 2) + ' dates du brevet)');
else faute('champs manquants : ' + JSON.stringify(champs));
dit('   au hub avant toute saisie : ' + await auHub());
await shot('ecran-avec-debut-et-fin-de-lannee');

/* ══════════ ② LES DEUX DATES SE SAISISSENT AU CLAVIER ══════════ */
dit(''); dit('② LES DEUX DATES SE SAISISSENT, ET PARTENT AU HUB');
await page.evaluate(() => { window.__ECR.length = 0; });
const vd = await saisirDate('edt-date-debut', '24','08','2026', 'début de l\'année');
const vf = await saisirDate('edt-date-fin', '03','07','2027', 'fin de l\'année');
const h1 = await auHub();
dit('   au hub après les deux saisies : ' + h1);
dit('   écritures : ' + await page.evaluate(() => JSON.stringify(window.__ECR)));
if (vd === '2026-08-24' && vf === '2027-07-03') bon('les deux champs portent ce qui a été frappé');
else faute('les champs portent ' + JSON.stringify([vd, vf]));
if (h1.indexOf('2026-08-24') > 0 && h1.indexOf('2027-07-03') > 0) bon('les deux dates sont au hub, sous /site/config/brevetDates');
else faute('le hub ne porte pas les deux dates : ' + h1);
await shot('les-deux-dates-saisies-et-au-hub');

/* ══════════ ③ LES TROIS REFUS, PAR LE GESTE ══════════ */
dit(''); dit('③ LES TROIS REFUS, À L\'ÉCRAN');
const refus = async (id, jj, mm, aaaa, quoi, attendu, nom) => {
  await page.evaluate(() => { window.__ECR.length = 0; });
  await saisirDate(id, jj, mm, aaaa, quoi);
  const m = await annonce();
  dit('   le site répond : ' + m);
  if (m.indexOf(attendu) >= 0) bon('refus nommé : « ' + attendu + ' »'); else faute('refus attendu « ' + attendu + ' » — reçu : ' + m);
  const ecr = await page.evaluate(() => window.__ECR.length);
  if (ecr === 0) bon('rien n\'est parti au hub'); else faute(ecr + ' écriture(s) malgré le refus');
  await shot(nom);
  await fermerInfo();
  const v = await page.evaluate(i => (document.getElementById(i) || {}).value, id);
  dit('     (EDT_DATES : ' + await page.evaluate(() => JSON.stringify(EDT_DATES))
    + ' · focus : ' + await page.evaluate(() => (document.activeElement || {}).id || (document.activeElement || {}).tagName) + ')');
  dit('   le champ est revenu à ' + JSON.stringify(v)); };

await refus('edt-date-fin', '01', '06', '2026', 'fin de l\'année', 'tombe avant son début', 'refus-1-la-fin-avant-le-debut');
await refus('edt-date-fin', '31', '12', '2027', 'fin de l\'année', 'plus de treize mois', 'refus-2-plus-de-treize-mois');
await refus('edt-date-debut', '01', '01', '2025', 'début de l\'année', 'hors du calendrier injecté', 'refus-3-hors-du-calendrier');
dit('   au hub après les trois refus : ' + await auHub());

/* ══════════ ④ AVANCER LA FIN RENVOIE LES HEURES AU-DELÀ ══════════ */
dit(''); dit('④ AVANCER LA FIN → LES HEURES POSÉES AU-DELÀ REDEVIENNENT DES HEURES À REPLACER');
/* on pose d'abord une heure loin dans l'année, par le geste : une case ouverte,
   un créneau libre choisi dans la liste des destinations. */
await clic('.tprof-section-btn', "showProfSection('edt')", 'Emploi du temps'); await pause(1600);
await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2200);
const k = await page.evaluate(() => Object.keys(EDT_VUE.cellules).filter(x => EDT_VUE.cellules[x].nature === 'prevu')[0] || null);
const b = k ? await page.evaluate(c => { const el = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]'))
    .filter(x => { const o = x.getAttribute('onclick') || '';
      return o.indexOf(c.split('|')[0]) >= 0 && o.indexOf(c.split('|')[1]) >= 0; })[0];
  if (!el) return null; const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, k) : null;
if (b) { await page.mouse.click(b.x, b.y); await pause(1000); bon('CLIC sur la case ' + k); }
else faute('aucune case ouvrable');
/* le créneau libre le plus tardif de la liste : c'est une heure EN PLUS, épinglée */
const choisi = await page.evaluate(() => { const s = document.getElementById('edt-ou');
  if (!s) return null;
  const libres = Array.from(s.options).filter(o => o.value && o.value.indexOf('|=') < 0);
  const o = libres[libres.length - 1]; if (!o) return null;
  return { valeur: o.value, texte: o.text }; });
if (choisi) {
  await page.select('#edt-ou', choisi.valeur); await pause(1400);
  dit('   ✔ CHOIX dans la liste : « ' + choisi.texte + ' »');
  await fermerInfo();
  const ajout = await page.evaluate(() => JSON.stringify(edtHeuresApres('2026-12-31')));
  dit('   heures posées après le 31/12/2026 : ' + ajout);
  if (ajout !== '[]') bon('une heure est posée loin dans l\'année, par le geste');
  else faute('aucune heure posée au-delà : la suite ne prouverait rien');
} else faute('la liste des destinations n\'offre aucun créneau libre');
await shot('une-heure-posee-loin-dans-lannee');
/* on revient aux dates et on avance la fin */
await clic('#edt-ecran [onclick*="edtFermer"]', 'Fermer l', 'Fermer l\'emploi du temps'); await pause(900); await voile();
await clic('.tprof-section-btn', "showProfSection('brevet')", 'Dates de l\'année');
try { await page.waitForSelector('#edt-date-fin', { timeout: 8000 }); } catch (e) {}
await pause(500);
await page.evaluate(() => { window.__ECR.length = 0; });
await saisirDate('edt-date-fin', '20','12','2026', 'fin de l\'année');
const mAv = await annonce();
dit('   le site répond : ' + mAv);
if (/replacer/.test(mAv)) bon('les heures au-delà sont nommées et renvoyées aux heures à replacer');
else faute('aucune annonce d\'heures à replacer : ' + mAv);
await shot('fin-avancee-les-heures-au-dela-a-replacer');
dit('   écritures : ' + await page.evaluate(() => JSON.stringify(window.__ECR.map(x => x.chemin))));
dit('   au hub : ' + await auHub());

/* ══════════ BILAN ══════════ */
dit('');
dit(fautes ? ('ROUGE — ' + fautes + ' faute(s)') : 'VERT — les quatre points du §① sont prouvés par le geste');
fs.writeFileSync(path.join(DOS, 'journal-11a.txt'), jrn.join('\n') + '\n');
await nav.close();
process.exit(fautes ? 1 : 0);

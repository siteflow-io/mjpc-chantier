/* BANC ⑤a — L'ÉCRAN « HEURES PERDUES ».
   Faux hub REST, écran ouvert, clics réels sur les cases.
   Usage : node tests/banc-heures-perdues-05a.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';

const hub = () => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-appariee.json') },
    calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } });
const faux = s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; }
    return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; }
    if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) {
      const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      if (((o && o.method) || 'GET').toUpperCase() === 'GET')
        return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push(c); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 }));
    }
    return Promise.resolve(new Response('null', { status: 200 })); };
};
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 900 });
page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
await page.evaluateOnNewDocument(faux, hub());
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(900);
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1500);
await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
await pause(500);
console.log('version : ' + await page.evaluate(() => APP_VERSION));

console.log('\n══════ ⑧.1 · UNE FICHE PAR ÉVÉNEMENT ══════');
const ecran = await page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('#edt-ecran button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("edtVue('calendrier')") >= 0)[0];
  const libelle = b ? b.innerText.trim() : '(bouton absent)';
  if (b) b.click();
  const fiches = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'));
  return { bouton: libelle, fiches: fiches.length,
    stages: fiches.map(f => f.innerText.replace(/\n/g, ' | ')).filter(t => t.indexOf('Stages 3e') >= 0),
    tete: (document.querySelector('#edt-ecran .edt-cal-col') || {}).innerText || '' }; });
await pause(400);
console.log('   le bouton s\'appelle : « ' + ecran.bouton + ' »');
console.log('   fiches affichées : ' + ecran.fiches);
ecran.stages.forEach(t => console.log('   ── ' + t));

console.log('\n══════ ⑧.2 et ⑧.3 · CASES VIDES, ÉVÉNEMENT SANS COÛT ══════');
const vide = await page.evaluate(c => {
  const cases = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche input[type=checkbox]'));
  const cal = EDT.calendrier;
  const sansCout = (cal.evenementsClasse || []).filter(e => edtHeuresDeLEvenement(e).length === 0);
  const titres = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche')).map(f => f.innerText.split('\n')[0]);
  return { cases: cases.length, cochees: cases.filter(x => x.checked).length,
    heuresRetirees: edtHeuresJustifiees(c), totaux: edtTotauxPerdues(),
    evenementsSansCout: sansCout.length,
    aucuneFichePourEux: sansCout.every(e => !titres.some(t => t.indexOf(String(e.libelle).slice(0, 20)) >= 0)),
    conditionnel: (document.querySelector('#edt-ecran .edt-fiche') || {}).innerText.indexOf('perdraient') >= 0 }; }, CLASSE);
console.log('   ' + JSON.stringify(vide));

console.log('\n══════ ⑧.4 · JAMAIS UN NOM DE CLASSE ABSENT DE L\'ÉVÉNEMENT ══════');
const noms = await page.evaluate(() => {
  const classes = {}; edtCasesCourantes().forEach(c => { if (c.classeMjpc) classes[c.classeMjpc] = true; });
  const entetes = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche > div.edt-cal-l')).map(x => x.innerText);
  const lignes = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche label')).map(x => x.innerText);
  const dansEnTete = entetes.filter(t => Object.keys(classes).some(n => t.indexOf(n) >= 0));
  const horsGrille = lignes.filter(t => !Object.keys(classes).some(n => t.indexOf(n) >= 0));
  return { entetes: entetes.length, nomsDeClasseDansLesEntetes: dansEnTete.length,
    lignes: lignes.length, lignesAvecUnNomHorsGrille: horsGrille.length,
    exempleEntete: entetes[0] || '', exempleLigne: lignes[0] || '' }; });
console.log('   ' + JSON.stringify(noms));

console.log('\n══════ UNE COCHE, PUIS UNE DÉCOCHE — par clic réel ══════');
const coche = await page.evaluate(c => new Promise(res => {
  window.__ECR.length = 0;
  const l = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche label'))
    .filter(x => x.innerText.indexOf('Verdun') >= 0)[0]
    || Array.from(document.querySelectorAll('#edt-ecran .edt-fiche label'))[0];
  const f = l.closest('.edt-fiche');
  const b = f.querySelector('label input');
  b.click();
  setTimeout(() => {
    const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
    const k = Object.keys(dec.heures || {})[0];
    res({ ecritures: window.__ECR.slice(), decisions: Object.keys(dec.heures || {}).length,
      valeur: k ? dec.heures[k] : null, total: edtTotauxPerdues(), heures: edtHeuresJustifiees(c),
      tete: (document.querySelector('#edt-ecran .edt-cal-col') || {}).innerText.split('\n')[1] || '' });
  }, 900); }), CLASSE);
console.log('   après la coche : ' + JSON.stringify(coche));
const decoche = await page.evaluate(c => new Promise(res => {
  window.__ECR.length = 0;
  const b = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche input:checked'))[0];
  if (b) b.click();
  setTimeout(() => {
    const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
    res({ ecritures: window.__ECR.slice(), decisions: Object.keys(dec.heures || {}).length,
      heures: edtHeuresJustifiees(c), totaux: edtTotauxPerdues() }); }, 900); }), CLASSE);
console.log('   après la décoche : ' + JSON.stringify(decoche));
await nav.close();

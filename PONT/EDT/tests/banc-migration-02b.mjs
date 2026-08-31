/* BANC ②b — LA MIGRATION DES COCHES HÉRITÉES.
   Faux hub REST (fetch détourné) : aucune requête ne sort ; le banc journalise
   chaque écriture DANS L'ORDRE et peut refuser un nœud pour simuler une panne.
   Le site charge les classes AVANT l'EDT (edtChargerClasses puis edtCharger) —
   c'est ce que font edtSectionPanneau et edtOuvrir ; sans elles, aucun niveau
   n'est connu et la reprise attend (mesuré).
   Usage : node tests/banc-migration-02b.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';

const hub = cal => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-appariee.json') },
    calendrier: { '2026-2027': J(cal) },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } });

const faux = (s, refus) => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; window.__REFUS = refus;
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; }
    return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; }
    if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) {
      const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      if (window.__REFUS && c.indexOf(window.__REFUS) >= 0) {
        window.__ECR.push('REFUSÉ ' + c);
        return Promise.resolve(new Response('panne', { status: 503 })); }
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

async function ouvrir(cal, refus) {
  const page = await nav.newPage();
  page.on('pageerror', e => console.log('  ⚠ erreur de page : ' + String(e).slice(0, 110)));
  await page.evaluateOnNewDocument(faux, hub(cal), refus || null);
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(900);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  return page;
}
const charger = async (page, ms) => {
  await page.evaluate(() => { window.__ECR.length = 0; });
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(ms || 1600);
};
const etat = (page, titre) => page.evaluate(c => {
  const h = window.__HUB.site.edt;
  const cal = h.calendrier['2026-2027'] || {};
  const dec = (h.decisions || {})['2026-2027'] || {};
  let n = 0; Object.keys(dec).forEach(k => { n += Object.keys((dec[k] || {}).heures || {}).length; });
  return { ecritures: window.__ECR.filter(x => x.indexOf('/corbeille/') < 0),
    archives: window.__ECR.filter(x => x.indexOf('/corbeille/') >= 0).length,
    champ: (cal.evenementsClasse || []).filter(e => 'justifie' in e).length,
    coches: (cal.evenementsClasse || []).filter(e => e.justifie).length,
    decisions: n, journal: ((dec[c] || {}).journal || []).length,
    heures: edtHeuresJustifiees(c), dit: EDT.miseANiveauDit || [] }; }, CLASSE).then(r => {
      console.log('\n── ' + titre);
      console.log('   écritures (hors archives) : ' + JSON.stringify(r.ecritures) + ' · archives : ' + r.archives);
      console.log('   magasin : ' + r.decisions + ' décision(s), journal ' + r.journal + ' ligne(s) · heures justifiées : ' + r.heures);
      console.log('   champ « justifie » dans l\'objet : ' + r.champ + ' (cochés : ' + r.coches + ')');
      console.log('   le site dit : ' + JSON.stringify(r.dit));
      return r; });

console.log('\n══════ ⑥.3 · MIGRATION D\'UN CALENDRIER HÉRITÉ (6 événements 3e cochés) ══════');
let page = await ouvrir('calendrier-herite-coche.json');
await charger(page, 2200);
await etat(page, 'premier chargement');
console.log('\n══════ ⑥.5 · IDEMPOTENCE — on recharge sur l\'état obtenu ══════');
await charger(page, 1800);
await etat(page, 'second chargement');
await page.close();

console.log('\n══════ ⑥.4 · MIGRATION INTERROMPUE — le hub refuse le nœud calendrier ══════');
page = await ouvrir('calendrier-herite-coche.json', '/site/edt/calendrier');
await charger(page, 2200);
await etat(page, 'la seconde écriture tombe');
console.log('\n══════ ⑥.4 (suite) · LE CHARGEMENT SUIVANT REPREND ET ABOUTIT ══════');
await page.evaluate(() => { window.__REFUS = null; });
await charger(page, 2200);
await etat(page, 'chargement suivant, hub rétabli');
await page.close();

console.log('\n══════ ⑥.8 · LA PREUVE DU LOT — RÉINJECTER LE CALENDRIER ══════');
page = await ouvrir('calendrier-herite-coche.json');
await charger(page, 2200);
const c1 = await etat(page, 'après migration, avant réinjection');
const reinj = await page.evaluate((c, neuf) => new Promise(res => {
  window.__ECR.length = 0;
  EDT_INJ = { voie: 'calendrier', objet: JSON.parse(JSON.stringify(neuf)), messages: [] };
  edtInjInjecter('calendrier');                       /* le geste réel d'injection */
  setTimeout(() => {
    const h = window.__HUB.site.edt;
    const dec = (h.decisions || {})['2026-2027'] || {};
    res({ ecritures: window.__ECR.filter(x => x.indexOf('/corbeille/') < 0),
      heures: edtHeuresJustifiees(c),
      cles: Object.keys((dec[c] || {}).heures || {}),
      champ: ((h.calendrier['2026-2027'] || {}).evenementsClasse || []).filter(e => 'justifie' in e).length,
      evts: ((h.calendrier['2026-2027'] || {}).evenementsClasse || []).length });
  }, 1500); }), CLASSE, J('calendrier-2026-2027.json'));
console.log('\n── après réinjection du calendrier');
console.log('   écritures : ' + JSON.stringify(reinj.ecritures));
console.log('   heures justifiées : ' + c1.heures + ' → ' + reinj.heures);
console.log('   décisions encore au magasin : ' + reinj.cles.length);
console.log('   objet réinjecté : ' + reinj.evts + ' événements, ' + reinj.champ + ' portant le champ');
await page.close();
await nav.close();

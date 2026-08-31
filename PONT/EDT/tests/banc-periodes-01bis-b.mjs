/* BANC ①bis-b — l'identité des périodes à la réinjection de la grille.
   Faux hub = mode test natif (M8_TEST / M8_TEST_STORE). Aucune requête ne sort.
   Usage : node tests/banc-periodes-01bis-b.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const ANNEE = '2026-2027';
const CH = o => '/site/edt/' + o + '/' + ANNEE;

/* le hub de départ : trois périodes qui portent DÉJÀ un identifiant en service,
   volontairement différent de l'amorce que le contenu produirait aujourd'hui */
const HUB = () => ({
  annee: ANNEE,
  periodes: [
    { id: 'per:POSEE1', rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
    { id: 'per:POSEE2', rang: 2, nom: 'Trimestre 2', debut: '2026-12-01', fin: '2027-03-15' },
    { id: 'per:POSEE3', rang: 3, nom: 'Trimestre 3', debut: '2027-03-16', fin: '2027-07-04' }
  ]
});

const prep = `
  window.__J = [];
  window.M8_TEST = true;
  window.__vraiSiteGet = window._siteGet;
  window._siteGet = function(chemin, cb){                     /* clone : le hub ne bouge que par écriture */
    if (window.m8TestOn && window.m8TestOn()){
      var v = window.M8_TEST_STORE[chemin];
      cb(v === undefined ? null : JSON.parse(JSON.stringify(v))); return;
    }
    return window.__vraiSiteGet(chemin, cb);
  };
  window.__vraiEcrireRest = window.mjpcEcrireRest;
  window.mjpcEcrireRest = function(url, options, cb){
    if (options && options.method && options.method !== 'GET')
      window.__J.push(String(url).replace(/^https?:\\/\\/[^/]+/,'').replace(/\\.json.*$/,''));
    return window.__vraiEcrireRest(url, options, cb);
  };
`;

async function jouer(nav, titre, hub, geste) {
  const page = await nav.newPage();
  await page.setRequestInterception(true);
  page.on('request', r => (r.url().startsWith('file://') ? r.continue() : r.abort()));
  page.on('pageerror', () => {});
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await page.evaluate(prep);
  await page.evaluate(h => { window.M8_TEST_STORE = JSON.parse(JSON.stringify(h)); }, hub);
  await page.evaluate(() => new Promise(r => edtCharger(r)));
  await new Promise(r => setTimeout(r, 300));
  const avant = await page.evaluate(() => (window.M8_TEST_STORE['/site/edt/periodes/2026-2027'] || {}).periodes || []);
  await page.evaluate(geste);
  await new Promise(r => setTimeout(r, 400));
  const apres = await page.evaluate(() => (window.M8_TEST_STORE['/site/edt/periodes/2026-2027'] || {}).periodes || []);
  const journal = await page.evaluate(() => window.__J);
  await page.close();

  const fmt = l => l.map(p => (p ? (p.nom || '(sans nom)') + ' → ' + (p.id || 'PAS D\'ID') : '(null)')).join('  ·  ');
  console.log('\n══════ ' + titre + ' ══════');
  console.log('  AVANT : ' + fmt(avant));
  console.log('  APRÈS : ' + fmt(apres));
  const ids = new Set(apres.map(p => p && p.id).filter(Boolean));
  console.log('  identifiants distincts : ' + ids.size + ' / ' + apres.length + ' périodes · écritures : ' + journal.length);
  const conserves = apres.filter(p => p && p.id && avant.some(a => a && a.id === p.id)).length;
  console.log('  conservés depuis le hub : ' + conserves + ' / ' + avant.length);
  return { avant, apres };
}

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'],
  headless: true
});

/* A — réinjection à noms identiques, entrant SANS id (le cas de l'année : le JSON
   vient de la feuille du responsable EDT, il ne porte pas les identifiants) */
await jouer(nav, 'A · RÉINJECTION, entrant SANS id, mêmes noms → attendu : les 3 id d\'origine',
  { [CH('periodes')]: HUB() },
  () => edtInjecterAvecLaGrille({ annee: '2026-2027', periodes: [
    { rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
    { rang: 2, nom: 'Trimestre 2', debut: '2026-12-01', fin: '2027-03-15' },
    { rang: 3, nom: 'Trimestre 3', debut: '2027-03-16', fin: '2027-07-04' } ] }));

/* B — l'entrant porte les id : ils font foi */
await jouer(nav, 'B · RÉINJECTION, entrant AVEC id (noms retouchés) → attendu : les id de l\'entrant',
  { [CH('periodes')]: HUB() },
  () => edtInjecterAvecLaGrille({ annee: '2026-2027', periodes: [
    { id: 'per:POSEE1', rang: 1, nom: 'Premier trimestre', debut: '2026-09-01', fin: '2026-11-30' },
    { id: 'per:POSEE2', rang: 2, nom: 'Trimestre 2', debut: '2026-12-01', fin: '2027-03-15' },
    { id: 'per:POSEE3', rang: 3, nom: 'Trimestre 3', debut: '2027-03-16', fin: '2027-07-04' } ] }));

/* C — dates retouchées dans l'entrant, noms inchangés (le cas « une période bouge ») */
await jouer(nav, 'C · RÉINJECTION, dates déplacées, entrant SANS id → attendu : les 3 id d\'origine',
  { [CH('periodes')]: HUB() },
  () => edtInjecterAvecLaGrille({ annee: '2026-2027', periodes: [
    { rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-12-05' },
    { rang: 2, nom: 'Trimestre 2', debut: '2026-12-06', fin: '2027-03-20' },
    { rang: 3, nom: 'Trimestre 3', debut: '2027-03-21', fin: '2027-07-04' } ] }));

/* D — Paul renomme dans le site, puis le responsable EDT réinjecte avec le nouveau nom */
await jouer(nav, 'D · RENOMMÉE DANS LE SITE puis réinjectée → attendu : l\'id d\'origine survit aux deux gestes',
  { [CH('periodes')]: HUB() },
  () => { edtPeriodePoser('per:POSEE2', 'nom', 'Trimestre 2 (allongé)');
          setTimeout(function () { edtInjecterAvecLaGrille({ annee: '2026-2027', periodes: [
            { rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
            { rang: 2, nom: 'Trimestre 2 (allongé)', debut: '2026-12-01', fin: '2027-03-15' },
            { rang: 3, nom: 'Trimestre 3', debut: '2027-03-16', fin: '2027-07-04' } ] }); }, 120); });

/* E — une période ajoutée à la main naît-elle avec une identité ? */
await jouer(nav, 'E · PÉRIODE AJOUTÉE À LA MAIN → attendu : elle naît avec son id',
  { [CH('periodes')]: HUB() },
  () => edtPeriodeAjouter('Stage'));

/* F — adverse : deux périodes de même nom, une sans nom, un id en double dans l'entrant */
await jouer(nav, 'F · ADVERSE : homonymes, période sans nom, id en double dans l\'entrant',
  { [CH('periodes')]: HUB() },
  () => edtInjecterAvecLaGrille({ annee: '2026-2027', periodes: [
    { rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
    { rang: 2, nom: 'Trimestre 1', debut: '2026-12-01', fin: '2027-03-15' },
    { rang: 3, nom: '', debut: '2027-03-16', fin: '2027-07-04' },
    { id: 'per:POSEE3', rang: 4, nom: 'Rattrapage', debut: '2027-04-01', fin: '2027-04-30' },
    { id: 'per:POSEE3', rang: 5, nom: 'Doublon volontaire', debut: '2027-05-01', fin: '2027-05-30' } ] }));

/* G — première injection : le hub est vide (l'état réel du 31/08) */
await jouer(nav, 'G · PREMIÈRE INJECTION, hub vide → attendu : des id neufs, tous distincts',
  {},
  () => edtInjecterAvecLaGrille({ annee: '2026-2027', periodes: [
    { rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
    { rang: 2, nom: 'Trimestre 2', debut: '2026-12-01', fin: '2027-03-15' } ] }));

await nav.close();

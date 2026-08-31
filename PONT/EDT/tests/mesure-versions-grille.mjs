/* MESURE — l'identité des créneaux de grille à travers les VERSIONS DATÉES.
   Trou signalé au rapport ①bis, non ouvert (versions datées = §⑯ « ne doit pas bouger »,
   heure déplacée = livraison ⑥). Usage : node tests/mesure-versions-grille.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true
});
const page = await nav.newPage();
await page.setRequestInterception(true);
page.on('request', r => (r.url().startsWith('file://') ? r.continue() : r.abort()));
page.on('pageerror', () => {});
await page.goto('file://' + FICHIER, { waitUntil: 'load' });

const r = await page.evaluate(() => {
  window.M8_TEST = true;
  window.M8_TEST_STORE = { '/site/edt/grille/2026-2027': { annee: '2026-2027', creneaux: [
    { jour: 'lundi', creneau: '08:00-08:55', semaine: 'AB', classe: '3A', mjpc: true },
    { jour: 'mardi', creneau: '09:00-09:55', semaine: 'AB', classe: '4B', mjpc: true } ] } };
  return new Promise(res => edtCharger(() => {
    const g = EDT.grille;
    const idsPlats = (g.creneaux || []).map(c => c.id);
    edtVersionAjouter('2027-01-05', 'après les vacances');
    const o = EDT.grille;
    const tous = [];
    (o.versions || []).forEach(v => (v.creneaux || []).forEach(c => tous.push(c.id)));
    const compte = {};
    tous.forEach(i => { compte[i] = (compte[i] || 0) + 1; });
    res({
      idsPlats, versions: (o.versions || []).length, creneauxEnTout: tous.length,
      idsDistincts: Object.keys(compte).length,
      enDouble: Object.keys(compte).filter(k => compte[k] > 1),
      poseParLaCharge: edtPoserIdsObjet('grille', o)
    });
  }));
});
console.log('  identifiants posés à l\'injection (forme plate) :', r.idsPlats);
console.log('  après edtVersionAjouter : ' + r.versions + ' versions, ' + r.creneauxEnTout + ' créneaux, '
  + r.idsDistincts + ' identifiants distincts');
console.log('  identifiants portés par plus d\'un créneau :', r.enDouble);
console.log('  edtPoserIdsObjet(\'grille\', o) repose alors :', r.poseParLaCharge, 'identifiant(s)');
await nav.close();

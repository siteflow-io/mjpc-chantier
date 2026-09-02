/* BANC ⑥ — LES DATES DE L'ANNÉE. Même nœud, deux champs, trois refus, recalage.
   Usage : node tests/banc-dates-06.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const hub = () => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-deux-classes.json') },
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
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
page.on('pageerror', e => console.log('   ⚠ ' + String(e).slice(0, 100)));
await page.evaluateOnNewDocument(faux, hub());
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(900);
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1600);
console.log('version : ' + await page.evaluate(() => APP_VERSION));

console.log('\n══════ ⑦.11 · DEUX CHAMPS, AU MÊME NŒUD ══════');
const pose = await page.evaluate(() => new Promise(res => {
  const anneeAvant = EDT_ANNEE;
  window.__ECR.length = 0;
  edtPoserDateAnnee('debutAnnee', '2026-09-01');
  setTimeout(() => { edtPoserDateAnnee('finAnnee', '2027-06-26');
    setTimeout(() => res({ anneeAvant, anneeApres: EDT_ANNEE,
      auHub: window.__HUB.site.config.brevetDates,
      ecritures: window.__ECR.slice(),
      finUtilisee: edtFinAnnee(), debutUtilise: edtDebutAnnee() }), 900); }, 900); }));
console.log('   écritures : ' + JSON.stringify(pose.ecritures));
console.log('   au hub : ' + JSON.stringify(pose.auHub));
console.log('   EDT_ANNEE : ' + pose.anneeAvant + ' → ' + pose.anneeApres
  + ' · dates utilisées : ' + pose.debutUtilise + ' → ' + pose.finUtilisee);

console.log('\n══════ ⑦.11 · LES TROIS REFUS, NOMMÉS ET CHIFFRÉS ══════');
const refus = await page.evaluate(() => ({
  finAvantDebut: edtValiderDatesAnnee('2026-09-01', '2026-06-26'),
  tropLong: edtValiderDatesAnnee('2026-09-01', '2027-11-30'),
  horsCalendrier: edtValiderDatesAnnee('2024-09-01', '2025-06-26') }));
Object.keys(refus).forEach(k => console.log('   ' + k + ' : ' + JSON.stringify(refus[k])));

console.log('\n══════ ⑦.11 · LA LISTE S\'ARRÊTE À LA FIN DÉCLARÉE ══════');
console.log('   ' + JSON.stringify(await page.evaluate(() => {
  edtOuvrir();
  EDT_VUE.mode='semaine'; EDT_VUE.ancre='2026-11-16'; edtPeindre();
  const cel = EDT_VUE.cellules || {};
  const k = Object.keys(cel).filter(x => (cel[x] || {}).nature === 'prevu')[0] || Object.keys(cel)[0];
  const l = edtCreneauxOu(edtCellule(k), 400);
  return { destinations: l.length, derniere: (l[l.length - 1] || {}).lib || '(aucune)',
    finAnnee: edtFinAnnee() }; })));

console.log('\n══════ ⑦.11 · FIN AVANCÉE : les heures au-delà redeviennent à replacer ══════');
const avance = await page.evaluate(() => new Promise(res => {
  EDT_VUE.mode='semaine'; EDT_VUE.ancre='2026-11-16'; edtPeindre();
  const cel = EDT_VUE.cellules || {};
  const k = Object.keys(cel).filter(x => (cel[x] || {}).nature === 'prevu')[0] || Object.keys(cel)[0];
  const c = edtCellule(k);
  /* deux heures posées en juin, après la future nouvelle fin */
  edtEcrireDecisionsGroupe([
    { classe: c.classeMjpc, cle: edtCleHeure('2027-06-22', '08:00-08:55', c.classeMjpc),
      valeur: { ajoutee: true, epingle: true, pose: Date.now() } },
    { classe: c.classeMjpc, cle: edtCleHeure('2027-06-24', '08:00-08:55', c.classeMjpc),
      valeur: { ajoutee: true, epingle: true, pose: Date.now() } }], 'banc', 'banc');
  setTimeout(() => {
    const avant = edtHeuresApres('2027-06-15').length;
    window.__ECR.length = 0;
    edtPoserDateAnnee('finAnnee', '2027-06-15');       /* Paul avance la fin à la main */
    setTimeout(() => {
      const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c.classeMjpc] || {};
      const t = document.querySelector('.at-modale-m, .at-toast');
      res({ heuresAuDela: avant, message: t ? t.innerText.slice(0, 220) : null,
        aReplacer: edtHeuresAReplacer(null).map(u => u.classe + ' ' + u.iso + ' ' + u.creneau),
        disparues: Object.keys(dec.heures || {}).length, ecritures: window.__ECR.slice() }); }, 1300); }, 900); }));
console.log('   ' + JSON.stringify(avance));
await nav.close();

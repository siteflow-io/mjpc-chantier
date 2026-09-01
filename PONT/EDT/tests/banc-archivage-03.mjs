/* BANC ③ — L'ARCHIVAGE AVANT ÉCRASEMENT, GÉNÉRALISÉ.
   Faux hub REST : le banc journalise archives et écritures DANS L'ORDRE et sait
   refuser la corbeille pour simuler un archivage en panne.
   Usage : node tests/banc-archivage-03.mjs <index.html> */
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
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; window.__REFUS = null;
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
const page = await nav.newPage();
page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
await page.evaluateOnNewDocument(faux, hub());
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(900);
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1500);
await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
await pause(500);

const geste = async (titre, code, refus) => {
  const r = await page.evaluate((c, ref) => new Promise(res => {
    window.__ECR.length = 0; window.__REFUS = ref;
    eval('(' + c + ')()');
    setTimeout(() => {
      window.__REFUS = null;
      const t = document.querySelector('.at-modale-m, .at-toast');
      res({ journal: window.__ECR.slice(), dit: t ? t.innerText.slice(0, 120) : null });
    }, 1100); }), code.toString(), refus || null);
  const arch = r.journal.filter(x => x.indexOf('/corbeille/') >= 0 && x.indexOf('REFUSÉ') < 0).length;
  const refuses = r.journal.filter(x => x.indexOf('REFUSÉ') === 0).length;
  const ecr = r.journal.filter(x => x.indexOf('/corbeille/') < 0 && x.indexOf('REFUSÉ') < 0);
  console.log('\n■ ' + titre);
  console.log('   ordre : ' + JSON.stringify(r.journal.map(x => x.replace('/2026-2027', '').replace(/\/corbeille\/[^/]+\//, 'corbeille/'))));
  console.log('   archives : ' + arch + (refuses ? (' (refusées : ' + refuses + ')') : '') + ' · écritures : ' + ecr.length);
  if (r.dit) console.log('   le site dit : ' + JSON.stringify(r.dit));
  return { arch, ecr, refuses };
};

console.log('══════ ⑥.9 · TROIS ÉCRITURES, ARCHIVE PUIS ÉCRITURE ══════');
await geste('edtReglagePoser — un réglage changé', () => { edtReglagePoser('semaineA', 'B'); });
await geste('edtEcrireDecision — une heure sortie de la prévision',
  () => { const c = Object.keys(EDT_VUE.cellules || {})[0] || null;
    EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = '2026-11-16'; edtPeindre();
    const k = Object.keys(EDT_VUE.cellules || {}).filter(x => (EDT_VUE.cellules[x] || {}).nature === 'prevu')[0];
    if (k) edtSansSeance(k); });
await geste('edtPeriodesEcrire — une période ajoutée', () => { edtPeriodeAjouter('Stage'); });

console.log('\n══════ ⑥.9 (suite) · LES MÊMES GESTES UNE SECONDE FOIS — il y a désormais un état à remplacer ══════');
await geste('edtReglagePoser — second passage', () => { edtReglagePoser('semaineA', 'A'); });
await geste('edtPeriodesEcrire — second passage', () => { edtPeriodeAjouter('Stage bis'); });
await geste('edtEcrireDecisionsGroupe — un écart justifié coché',
  () => { const e = (EDT.calendrier.evenementsClasse || []).filter(x => (x.libelle || '').indexOf('Verdun') >= 0)[0];
    edtJustifier(e.id, true); });

console.log('\n══════ ⑥.9 (suite) · LES MÊMES, ARCHIVAGE EN PANNE ══════');
await geste('edtReglagePoser — la corbeille refuse', () => { edtReglagePoser('semaineA', 'A'); }, '/corbeille/');
await geste('edtPeriodesEcrire — la corbeille refuse', () => { edtPeriodeAjouter('Stage 2'); }, '/corbeille/');
await geste('edtEcrireDecisionsGroupe — la corbeille refuse',
  () => { const e = (EDT.calendrier.evenementsClasse || []).filter(x => (x.libelle || '').indexOf('Verdun') >= 0)[0];
    edtJustifier(e.id, true); }, '/corbeille/');

console.log('\n══════ état du hub après les pannes ══════');
console.log('   ' + JSON.stringify(await page.evaluate(() => {
  const e = window.__HUB.site.edt;
  return { reglages: (e.reglages || {})['2026-2027'] || null,
    periodes: (((e.periodes || {})['2026-2027'] || {}).periodes || []).map(p => p.nom),
    decisions: Object.keys((((e.decisions || {})['2026-2027'] || {})['3E Charles de Gaulle'] || {}).heures || {}).length }; })));
await nav.close();

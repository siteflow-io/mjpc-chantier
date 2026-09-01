/* BANC ⑤c — BANALISER, CLASSER, BASCULER, DÉPLACER.
   Faux hub REST, écran ouvert. Les gestes de la modale d'une case passent par
   appel de fonction — déclaré ; la coche d'une heure reste un clic réel.
   Usage : node tests/banc-banalisation-05c.mjs <index.html> */
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
async function ouvrir() {
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
  return page;
}
const page = await ouvrir();
console.log('version : ' + await page.evaluate(() => APP_VERSION));

console.log('\n══════ ⑧.6 · LES DIX CATÉGORIES, UNE PAR UNE ══════');
const dix = await page.evaluate(c => new Promise(res => {
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = '2026-11-16'; edtPeindre();
  const cles = Object.keys(EDT_VUE.cellules || {})
    .filter(k => (EDT_VUE.cellules[k] || {}).classeMjpc === c && (EDT_VUE.cellules[k] || {}).nature === 'prevu');
  const cle = cles[0];
  const out = []; let i = 0;
  const suivant = () => {
    if (i >= EDT_CATEGORIES.length) { res({ cle, out }); return; }
    const cat = EDT_CATEGORIES[i++];
    edtCaseClic(cle);                                  /* ouvre la modale de la case */
    const s = document.getElementById('edt-cat'); if (s) s.value = cat;
    edtSansSeance(cle);                                /* appel de fonction : déclaré */
    setTimeout(() => {
      const v = edtDecisionPour(c, cle.split('|')[0], cle.split('|')[1]) || {};
      out.push({ categorie: cat, tempsDeClasse: !!v.tempsDeClasse,
        justifiee: v.justifiee !== false, compte: edtHeuresJustifiees(c) });
      edtEcrireDecision(c, edtCleHeure(cle.split('|')[0], cle.split('|')[1], c), null, 'remise à zéro du banc');
      setTimeout(suivant, 250);
    }, 350); };
  suivant(); }), CLASSE);
dix.out.forEach(x => console.log('   ' + (x.tempsDeClasse ? 'temps de classe ' : 'heure perdue    ')
  + (x.tempsDeClasse ? '            ' : (x.justifiee ? '· justifiée   ' : '· NON justifiée'))
  + ' · compte ' + x.compte + ' · ' + x.categorie));

console.log('\n══════ ⑧.7 · LA BASCULE SURVIT AU RECHARGEMENT ══════');
const bascule = await page.evaluate((c, cle) => new Promise(res => {
  const s = document.getElementById('edt-cat');
  edtCaseClic(cle);
  const s2 = document.getElementById('edt-cat'); if (s2) s2.value = 'Temps libre choisi';
  edtSansSeance(cle);                                  /* perdue, NON justifiée par défaut */
  setTimeout(() => {
    const iso = cle.split('|')[0], cr = cle.split('|')[1];
    const avant = edtDecisionPour(c, iso, cr);
    edtBasculerStatut(cle);                            /* Paul dit : justifiée */
    setTimeout(() => {
      const apres = edtDecisionPour(c, iso, cr);
      edtCharger(() => {                                /* on recharge tout depuis le hub */
        const relu = edtDecisionPour(c, iso, cr);
        res({ parDefaut: { tempsDeClasse: !!avant.tempsDeClasse, justifiee: avant.justifiee },
          apresBascule: { justifiee: apres.justifiee },
          apresRechargement: { categorie: relu.categorie, justifiee: relu.justifiee,
            tempsDeClasse: !!relu.tempsDeClasse },
          compte: edtHeuresJustifiees(c) }); });
    }, 700); }, 700); }), CLASSE, dix.cle);
console.log('   ' + JSON.stringify(bascule));

console.log('\n══════ ⑧.7bis · TEMPS DE CLASSE : L\'HEURE SORT DU COMPTE ══════');
const tdc = await page.evaluate((c, cle) => new Promise(res => {
  const iso = cle.split('|')[0], cr = cle.split('|')[1];
  const avant = edtHeuresJustifiees(c);
  edtBasculerClassement(cle);                          /* Paul la classe temps de classe */
  setTimeout(() => {
    const v = edtDecisionPour(c, iso, cr);
    res({ compteAvant: avant, compteApres: edtHeuresJustifiees(c),
      tempsDeClasse: !!v.tempsDeClasse, totaux: edtTotauxPerdues() }); }, 700); }), CLASSE, dix.cle);
console.log('   ' + JSON.stringify(tdc));

console.log('\n══════ ⑧.8 · UNE HEURE DÉPLACÉE N\'EST PAS UNE HEURE PERDUE ══════');
const depl = await page.evaluate(c => new Promise(res => {
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = '2026-11-16'; edtPeindre();
  const cles = Object.keys(EDT_VUE.cellules || {})
    .filter(k => (EDT_VUE.cellules[k] || {}).classeMjpc === c && (EDT_VUE.cellules[k] || {}).nature === 'prevu');
  const cle = cles[0];
  const avant = edtHeuresJustifiees(c);
  edtDeplacerVers(cle, '2026-11-20|10:07-11:02');       /* appel de fonction : déclaré */
  setTimeout(() => {
    edtPeindre();
    const dep = edtCellule(cle) || {};
    const arr = Object.keys(EDT_VUE.cellules || {}).map(k => EDT_VUE.cellules[k])
      .filter(x => x.venantDe)[0] || null;
    res({ compteAvant: avant, compteApres: edtHeuresJustifiees(c),
      natureDepart: dep.nature, deplaceeVers: dep.deplaceeVers || null,
      arrivee: arr ? { venantDe: arr.venantDe, nature: arr.nature } : null,
      totaux: edtTotauxPerdues(), cle: cle }); }, 900); }), CLASSE);
console.log('   ' + JSON.stringify(depl));
const annul = await page.evaluate((c, cle) => new Promise(res => {
  edtAnnulerDecision(cle);                             /* appel de fonction : déclaré */
  setTimeout(() => {
    const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
    res({ clesRestantes: Object.keys(dec.heures || {}).length, compte: edtHeuresJustifiees(c) }); }, 900); }),
  CLASSE, depl.cle);
console.log('   ↶ Annuler, les deux côtés : ' + JSON.stringify(annul));

console.log('\n══════ LE MOT JUSTE ══════');
console.log('   ' + JSON.stringify(await page.evaluate(() => {
  /* une heure SANS décision : c'est là que le bloc « Banaliser » s'affiche */
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = '2026-12-07'; edtPeindre();
  const cle = Object.keys(EDT_VUE.cellules || {})
    .filter(k => (EDT_VUE.cellules[k] || {}).nature === 'prevu')[0];
  edtCaseClic(cle);
  const m = document.getElementById('edt-modale');
  const t = m ? m.innerText : '';
  return { banaliser: (t.match(/Banaliser cette heure/g) || []).length,
    ancienLibelle: (t.match(/ne plus compter/gi) || []).length,
    phrase: (t.split('\n').filter(x => x.indexOf('séance continue') >= 0)[0] || ''),
    bouton: (t.split('\n').filter(x => x.indexOf('Banaliser') >= 0)[0] || '') }; })));
await nav.close();

/* BANC ⑤b — UNE HEURE NE COMPTE JAMAIS DEUX FOIS.
   Faux hub REST, écran ouvert, clics réels. Les deux sens sont mesurés.
   Usage : node tests/banc-motifs-05b.mjs <index.html> */
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
const etat = (page, titre) => page.evaluate(c => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  const h = dec.heures || {}; const k = Object.keys(h)[0];
  return { cles: Object.keys(h).length, valeur: k ? h[k] : null,
    motif: k ? edtMotifDe(h[k]) : null, enClair: k ? edtMotifEnClair(h[k]) : null,
    basculable: k ? edtBasculable(h[k]) : null,
    totaux: edtTotauxPerdues(), heures: edtHeuresJustifiees(c),
    journal: (dec.journal || []).map(x => x.quoi) }; }, CLASSE)
  .then(r => { console.log('   ' + titre + ' : ' + JSON.stringify(r)); return r; });

/* ═══ ⑧.5 · COCHE PUIS BANALISATION ═════════════════════════════════════ */
console.log('══════ ⑧.5 · SENS 1 — coche d\'un événement, puis banalisation ══════');
let page = await ouvrir();
console.log('version : ' + await page.evaluate(() => APP_VERSION));
const cible = await page.evaluate(() => {
  edtVue('calendrier');
  const f = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'))
    .filter(x => x.innerText.indexOf('Verdun') >= 0)[0];
  const b = f.querySelector('label input');
  b.click();
  return { ligne: f.querySelector('label').innerText.trim() }; });
await pause(900);
console.log('   coche par clic : « ' + cible.ligne + ' »');
const a1 = await etat(page, 'après la coche');

const banal = await page.evaluate(c => new Promise(res => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  const k = Object.keys(dec.heures || {})[0];
  const m = k.match(/^(\d{4}-\d{2}-\d{2})_(\d{2}h\d{2}-\d{2}h\d{2})_/);
  const iso = m[1], creneau = m[2].replace(/h/g, ':');
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = iso; edtPeindre();
  const cle = Object.keys(EDT_VUE.cellules || {}).filter(x => x.indexOf(iso + '|' + creneau) === 0)[0];
  window.__ECR.length = 0;
  edtSansSeance(cle);                                   /* appel de fonction : déclaré */
  setTimeout(() => {
    const mo = document.getElementById('at-modale');
    res({ cle: cle, annonce: mo ? mo.innerText.replace(/\n+/g, ' | ') : null,
      ecrituresAvantReponse: window.__ECR.slice() }); }, 700); }), CLASSE);
console.log('\n   ANNONCE avant écriture : ' + JSON.stringify(banal.annonce));
console.log('   écritures avant la réponse : ' + JSON.stringify(banal.ecrituresAvantReponse));
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Remplacer/.test(x.textContent))[0]; if (b) b.click(); });
await pause(900);
const a2 = await etat(page, 'après « Remplacer le motif »');
console.log('   le total est passé de ' + JSON.stringify(a1.totaux) + ' à ' + JSON.stringify(a2.totaux));

/* ↶ Annuler rend le motif d'origine */
const annul = await page.evaluate((c, cle) => new Promise(res => {
  window.__ECR.length = 0;
  edtAnnulerDecision(cle);                              /* appel de fonction : déclaré */
  setTimeout(() => {
    const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
    const h = dec.heures || {}; const k = Object.keys(h)[0];
    res({ cles: Object.keys(h).length, motif: k ? edtMotifDe(h[k]) : null,
      valeur: k ? h[k] : null, heures: edtHeuresJustifiees(c),
      journal: (dec.journal || []).slice(-1).map(x => x.quoi) }); }, 900); }), CLASSE, banal.cle);
console.log('\n   ↶ ANNULER, relu au hub : ' + JSON.stringify(annul));

await page.close();

/* ═══ SENS INVERSE ══════════════════════════════════════════════════════ */
console.log('\n══════ ⑧.5 · SENS 2 — banalisation d\'abord, puis coche de l\'événement ══════');
page = await ouvrir();
const inv = await page.evaluate(c => new Promise(res => {
  edtVue('calendrier');
  const f = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'))
    .filter(x => x.innerText.indexOf('Verdun') >= 0)[0];
  const rang = Number((f.querySelector('label input').getAttribute('onchange') || '').match(/\d+/)[0]);
  const u = EDT_FICHES[rang];
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = u.iso; edtPeindre();
  const cle = Object.keys(EDT_VUE.cellules || {}).filter(x => x.indexOf(u.iso + '|' + u.creneau) === 0)[0];
  edtSansSeance(cle);                                   /* banalisée en premier */
  setTimeout(() => {
    edtVue('calendrier');
    const f2 = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'))
      .filter(x => x.innerText.indexOf('Verdun') >= 0)[0];
    const ligne = f2.querySelector('label').innerText.trim();
    window.__ECR.length = 0;
    f2.querySelector('label input').click();            /* clic réel sur la case */
    setTimeout(() => {
      const mo = document.getElementById('at-modale');
      res({ ligneAvant: ligne, annonce: mo ? mo.innerText.replace(/\n+/g, ' | ') : null,
        ecrituresAvantReponse: window.__ECR.slice(),
        heuresAvant: edtHeuresJustifiees(c) }); }, 700); }, 900); }), CLASSE);
console.log('   la fiche montrait : « ' + inv.ligneAvant + ' »');
console.log('   ANNONCE avant écriture : ' + JSON.stringify(inv.annonce));
console.log('   écritures avant la réponse : ' + JSON.stringify(inv.ecrituresAvantReponse)
  + ' · heures comptées avant : ' + inv.heuresAvant);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Remplacer/.test(x.textContent))[0]; if (b) b.click(); });
await pause(900);
await etat(page, 'après « Remplacer le motif »');

console.log('\n══════ LES QUATRE MOTIFS ET LEURS RÈGLES ══════');
console.log('   ' + JSON.stringify(await page.evaluate(() => Object.keys(EDT_MOTIFS).map(k =>
  ({ motif: k, libelle: EDT_MOTIFS[k].libelle, justifiee: EDT_MOTIFS[k].justifiee,
     basculable: EDT_MOTIFS[k].basculable })))));
await page.close();
await nav.close();

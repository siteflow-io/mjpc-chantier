/* BANC ② — CE QUE DEVIENT UNE COCHE QUAND LES CHOSES BOUGENT (§④).
   Faux hub REST, aucune requête ne sort. Les classes sont chargées avant l'EDT,
   comme le font edtSectionPanneau et edtOuvrir.
   Usage : node tests/banc-coches-bougent-02.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';
const EVT = 'Séjour Verdun 3e';

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
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
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

async function depart() {
  const page = await nav.newPage();
  page.on('pageerror', e => console.log('  ⚠ erreur de page : ' + String(e).slice(0, 110)));
  await page.evaluateOnNewDocument(faux, hub());
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(900);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1500);
  await page.evaluate(() => { edtOuvrir(); edtVue('calendrier'); });
  await pause(800);
  await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  /* on coche l'événement PAR CLIC sur sa case */
  const ok = await page.evaluate(lib => {
    const l = Array.from(document.querySelectorAll('#edt-ecran label.edt-cal-l'))
      .filter(x => (x.innerText || '').indexOf(lib) >= 0)[0];
    if (!l) return false; l.querySelector('input').click(); return true; }, EVT);
  await pause(900);
  return { page, ok };
}

const lire = (page, titre) => page.evaluate((c, lib) => {
  const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
  const e = (cal.evenementsClasse || []).filter(x => (x.libelle || '').indexOf(lib) >= 0)[0] || null;
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  const l = Array.from(document.querySelectorAll('#edt-ecran label.edt-cal-l'))
    .filter(x => (x.innerText || '').indexOf(lib) >= 0)[0];
  return { evenement: e ? { id: e.id, debut: e.debut, fin: e.fin } : null,
    caseCochee: l ? l.querySelector('input').checked : '(ligne absente)',
    ligne: l ? (l.innerText || '').replace(/\n/g, ' ').trim().slice(0, 120) : '(ligne absente)',
    decisions: Object.keys(dec.heures || {}),
    heuresJustifiees: edtHeuresJustifiees(c),
    deplacees: e ? edtCochesDeplacees(e).length : (typeof edtCochesDeLEvenement === 'function' ? -1 : -2) }; }, CLASSE, EVT)
  .then(r => { console.log('\n── ' + titre);
    console.log('   événement : ' + JSON.stringify(r.evenement));
    console.log('   case à l\'écran : ' + r.caseCochee + ' · coches hors de ses heures : ' + r.deplacees);
    console.log('   ligne affichée : « ' + r.ligne + ' »');
    console.log('   décisions au magasin : ' + r.decisions.length + ' ' + JSON.stringify(r.decisions));
    console.log('   heures justifiées : ' + r.heuresJustifiees);
    return r; });

const reinjecter = (page, muter) => page.evaluate((neuf, code) => new Promise(res => {
  const o = JSON.parse(JSON.stringify(neuf));
  eval('(' + code + ')(o)');
  window.__ECR.length = 0;
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  setTimeout(() => {
    const m = document.getElementById('at-modale');
    res({ modale: m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 300) : null,
      ecritures: window.__ECR.slice() }); }, 900);
}), J('calendrier-2026-2027.json'), muter.toString());

/* ═══ A · l'événement NE BOUGE PAS ═══════════════════════════════════════ */
console.log('\n══════ §④ A · L\'ÉVÉNEMENT NE BOUGE PAS — les coches restent, sans un mot ══════');
let { page } = await depart();
const a0 = await lire(page, 'après la coche (clic réel)');
await page.evaluate(id => { window.__ID_EVT = id; }, a0.evenement.id);
await reinjecter(page, o => {
  const e = (o.evenementsClasse || []).filter(x => (x.libelle || '').indexOf('Verdun') >= 0)[0];
  e.id = window.__ID_EVT; });
console.log('   (réinjection du même calendrier, événement identique)');
await page.evaluate(() => { edtVue('calendrier'); });
await pause(600);
await lire(page, 'après réinjection à l\'identique');
await page.close();

/* ═══ B · l'événement SE DÉPLACE ════════════════════════════════════════ */
console.log('\n══════ §④ B · L\'ÉVÉNEMENT SE DÉPLACE — cases vides, et le site le dit ══════');
({ page } = await depart());
const b0 = await lire(page, 'après la coche');
await page.evaluate(id => { window.__ID_EVT = id; }, b0.evenement.id);
await reinjecter(page, o => {
  const e = (o.evenementsClasse || []).filter(x => (x.libelle || '').indexOf('Verdun') >= 0)[0];
  e.id = window.__ID_EVT; e.debut = '2026-11-16'; e.fin = '2026-11-18';   /* le séjour change de dates */
});
await page.evaluate(() => { edtVue('calendrier'); });
await pause(700);
await lire(page, 'après déplacement de l\'événement');
await page.close();

/* ═══ C · la GRILLE change sous l'événement ═════════════════════════════ */
console.log('\n══════ §④ C · LA GRILLE CHANGE SOUS UN ÉVÉNEMENT COCHÉ — même règle ══════');
({ page } = await depart());
const c0 = await lire(page, 'après la coche');
await page.evaluate(() => new Promise(res => {
  const g = JSON.parse(JSON.stringify(EDT.grille));
  (g.creneaux || []).forEach(c => { if (c.classeMjpc === '3E Charles de Gaulle' && c.jour === 'mercredi') c.jour = 'jeudi'; });
  EDT_INJ = { voie: 'grille', objet: g, messages: [] };
  edtInjInjecter('grille');
  setTimeout(res, 1200); }));
await page.evaluate(() => new Promise(r => edtCharger(r)));
await pause(900);
await page.evaluate(() => { edtVue('calendrier'); });
await pause(600);
await lire(page, 'après changement de la grille');
await page.close();

/* ═══ D · l'événement DISPARAÎT ════════════════════════════════════════ */
console.log('\n══════ §④ D · L\'ÉVÉNEMENT DISPARAÎT — nommé avant le geste ══════');
({ page } = await depart());
await lire(page, 'après la coche');
const rd = await reinjecter(page, o => {
  o.evenementsClasse = (o.evenementsClasse || []).filter(x => (x.libelle || '').indexOf('Verdun') < 0); });
console.log('\n   modale AVANT le geste : ' + JSON.stringify(rd.modale));
console.log('   écritures avant réponse : ' + JSON.stringify(rd.ecritures));
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Injecter quand/.test(x.textContent))[0]; if (b) b.click(); });
await pause(1200);
await page.evaluate(() => { edtVue('calendrier'); });
await pause(500);
const d1 = await page.evaluate(c => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
  return { decisions: Object.keys(dec.heures || {}).length, heures: edtHeuresJustifiees(c),
    evenements: (cal.evenementsClasse || []).length,
    verdunEncore: (cal.evenementsClasse || []).filter(x => (x.libelle || '').indexOf('Verdun') >= 0).length }; }, CLASSE);
console.log('   après « Injecter quand même » : ' + JSON.stringify(d1));
await page.close();
await nav.close();

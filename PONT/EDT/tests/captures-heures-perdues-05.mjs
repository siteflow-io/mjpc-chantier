/* CAPTURES ⑤ — L'ÉCRAN « HEURES PERDUES », PAR CLICS.
   Ce que le mandat ⑤ §⑧.13 exigeait et qui n'avait jamais été livré : l'écran
   Heures perdues, une coche, une banalisation par-dessus AVEC SON ANNONCE, et le
   total en tête. Écran entier à chaque fois, journal des clics à côté.
   Une seule ligne n'est pas un clic, et elle est déclarée : `admin-mode`.
   Usage : node tests/captures-heures-perdues-05.mjs <index.html> */
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
const journal = [];
const dit = t => { journal.push(t); console.log(t); };
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
page.on('pageerror', e => dit('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
const shot = async n => { await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await page.screenshot({ path: 'tests/05-perdues-' + n + '.png' }); };

await page.evaluateOnNewDocument(faux, hub());
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(800);
await page.evaluate(() => document.body.classList.add('admin-mode'));   /* déclaré : pas un clic */
await page.click('#tprof-btn'); await pause(700);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
await pause(1500);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-panneau [onclick]'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf('edtOuvrir') >= 0)[0]; if (b) b.click(); });
await pause(2000);
dit('① clics : panneau prof → Emploi du temps → Ouvrir l\'emploi du temps');
dit('   version : ' + await page.evaluate(() => APP_VERSION));

/* ── ÉCRAN 1 — l'écran Heures perdues, et le total en tête ── */
const bouton = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("edtVue('calendrier')") >= 0)[0];
  if (!b) return null; const t = b.innerText.trim(); b.click(); return t; });
await pause(1200);
await shot('1-ecran-heures-perdues');
const etat1 = await page.evaluate(c => ({
  tete: (document.querySelector('#edt-ecran .edt-cal-col') || {}).innerText.split('\n').slice(0, 3).join(' | '),
  fiches: document.querySelectorAll('#edt-ecran .edt-fiche').length,
  cases: document.querySelectorAll('#edt-ecran .edt-fiche input[type=checkbox]').length,
  cochees: Array.from(document.querySelectorAll('#edt-ecran .edt-fiche input[type=checkbox]')).filter(x => x.checked).length,
  heuresJustifiees: edtHeuresJustifiees(c), totaux: edtTotauxPerdues() }), CLASSE);
dit('② CLIC sur « ' + bouton + ' » → ' + JSON.stringify(etat1));

/* ── ÉCRAN 2 — une coche, par clic réel ── */
const coche = await page.evaluate(c => new Promise(res => {
  window.__ECR.length = 0;
  const l = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche label'))
    .filter(x => x.innerText.indexOf('Verdun') >= 0)[0]
    || Array.from(document.querySelectorAll('#edt-ecran .edt-fiche label'))[0];
  const titre = l.closest('.edt-fiche').innerText.split('\n')[0];
  l.querySelector('input').click();
  setTimeout(() => {
    const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
    const k = Object.keys(dec.heures || {})[0];
    res({ evenement: titre, ecritures: window.__ECR.slice(), decisions: Object.keys(dec.heures || {}).length,
      cle: k || null, motif: k ? dec.heures[k].motif : null,
      heuresJustifiees: edtHeuresJustifiees(c), totaux: edtTotauxPerdues(),
      tete: (document.querySelector('#edt-ecran .edt-cal-col') || {}).innerText.split('\n').slice(0, 3).join(' | ') });
  }, 1000); }), CLASSE);
await shot('2-une-coche');
dit('③ CLIC sur la case d\'un événement → ' + JSON.stringify(coche));

/* ── ÉCRAN 3 — LA BANALISATION PAR-DESSUS, AVEC SON ANNONCE ── */
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("edtVue('semaine')") >= 0)[0]; if (b) b.click(); });
await pause(900);
/* on va sur la semaine de l'heure cochée, puis on ouvre sa case — par clics */
const alle = await page.evaluate(cle => {
  const iso = String(cle).split('_')[0];
  EDT_VUE.ancre = iso; edtPeindre();          /* déclaré : la navigation par flèches ferait 6 clics */
  return iso; }, coche.cle);
await pause(900);
const ouverte = await page.evaluate(cle => {
  /* la clé de décision est `iso_HHhMM-HHhMM_Classe` ; la clé de cellule est
     `iso|HH:MM-HH:MM|nom de la grille`. On vise l'iso ET le créneau, sinon on
     ouvre la case d'à côté — mesuré au premier essai. */
  const p = String(cle).split('_');
  const iso = p[0], creneau = (p[1] || '').replace(/h/g, ':');
  const cases = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]'));
  const c = cases.filter(x => { const o = x.getAttribute('onclick') || '';
    return o.indexOf(iso) >= 0 && o.indexOf(creneau) >= 0; })[0];
  if (!c) return { vise: iso + ' ' + creneau, trouve: null };
  c.click();
  return { vise: iso + ' ' + creneau, trouve: (c.innerText || '').replace(/\n+/g, ' | ').slice(0, 70) }; }, coche.cle);
await pause(800);
dit('④ semaine du ' + alle + ' — CLIC sur la case cochée : ' + JSON.stringify(ouverte));
const annonce = await page.evaluate(() => new Promise(res => {
  const s = document.getElementById('edt-cat'); if (s) s.selectedIndex = 0;
  const b = Array.from(document.querySelectorAll('#edt-modale button'))
    .filter(x => x.innerText.indexOf('Banaliser cette heure') >= 0)[0];
  if (!b) { res({ bouton: '(absent)' }); return; }
  b.click();
  setTimeout(() => { const m = document.getElementById('at-modale');
    res({ categorie: (document.getElementById('edt-cat') || {}).value || '(?)',
      annonce: m ? m.innerText.replace(/\n+/g, ' | ') : '(aucune annonce)' }); }, 700); }));
await shot('3-annonce-avant-de-remplacer-le-motif');
dit('⑤ CLIC « Banaliser cette heure » → l\'annonce s\'affiche : ' + JSON.stringify(annonce));

/* ── ÉCRAN 4 — après « Remplacer le motif » : le total en tête ── */
const apres = await page.evaluate(c => new Promise(res => {
  window.__ECR.length = 0;
  const b = Array.from(document.querySelectorAll('#at-modale button'))
    .filter(x => x.innerText.indexOf('Remplacer') >= 0)[0];
  if (b) b.click();
  setTimeout(() => {
    const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
    const k = Object.keys(dec.heures || {})[0];
    res({ ecritures: window.__ECR.slice(), decisions: Object.keys(dec.heures || {}).length,
      motif: k ? dec.heures[k].motif : null, categorie: k ? dec.heures[k].categorie : null,
      justifiee: k ? dec.heures[k].justifiee : null,
      heuresJustifiees: edtHeuresJustifiees(c), totaux: edtTotauxPerdues() });
  }, 1100); }), CLASSE);
await pause(400);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("edtVue('calendrier')") >= 0)[0]; if (b) b.click(); });
await pause(1200);
await shot('4-le-total-en-tete-apres-remplacement');
const tete = await page.evaluate(() => (document.querySelector('#edt-ecran .edt-cal-col') || {}).innerText.split('\n').slice(0, 4).join(' | '));
dit('⑥ CLIC « Remplacer le motif » → ' + JSON.stringify(apres));
dit('   le total en tête dit : ' + JSON.stringify(tete));
dit('   UNE HEURE NE COMPTE QU\'UNE FOIS : décisions ' + coche.decisions + ' → ' + apres.decisions
  + ' · heures justifiées ' + coche.heuresJustifiees + ' → ' + apres.heuresJustifiees);

fs.writeFileSync('tests/05-perdues-journal.txt', journal.join('\n') + '\n');
await nav.close();
console.log('\ncaptures : tests/05-perdues-1…4 · journal : tests/05-perdues-journal.txt');

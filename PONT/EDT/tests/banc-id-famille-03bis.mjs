/* BANC ③bis-b — L'IDENTIFIANT DIT SA FAMILLE, ET LE SITE LE VÉRIFIE.
   Faux hub REST, panneau prof ouvert par clic. Aucune requête ne sort.
   Usage : node tests/banc-id-famille-03bis.mjs <index.html> */
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
const page = await nav.newPage();
page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
await page.evaluateOnNewDocument(faux, hub());
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(900);
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1500);
await page.evaluate(() => { document.getElementById('tprof-btn').click(); });
await pause(700);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
await pause(1200);
await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });

console.log('version : ' + await page.evaluate(() => APP_VERSION));

/* on pose une coche sur l'événement qui recevra un identifiant menteur */
await page.evaluate(() => new Promise(res => {
  const e = (EDT.calendrier.evenementsClasse || []).filter(x => (x.libelle || '').indexOf('Verdun') >= 0)[0];
  edtJustifier(e.id, true); setTimeout(res, 900); }));
const prep = await page.evaluate(c => ({ heures: edtHeuresJustifiees(c),
  idVerdun: (EDT.calendrier.evenementsClasse || []).filter(x => (x.libelle || '').indexOf('Verdun') >= 0)[0].id }), CLASSE);
console.log('préparation : ' + JSON.stringify(prep));

console.log('\n══════ ⑤.5 · DEUX IDENTIFIANTS MENTEURS DANS UN CALENDRIER INJECTÉ ══════');
const r = await page.evaluate((neuf, idVrai) => {
  const o = JSON.parse(JSON.stringify(neuf));
  const cal = EDT.calendrier;
  /* tous les identifiants sont ceux du hub, sauf deux : un `per:` et un `crn:` */
  ['evenementsClasse', 'jalons', 'etablissement', 'feries', 'vacances'].forEach(f =>
    (o[f] || []).forEach((e, i) => { if ((cal[f] || [])[i]) e.id = cal[f][i].id; }));
  const a = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  a.id = 'per:MENSONGE';                          /* un identifiant de PÉRIODE sur un événement */
  const b = (o.jalons || [])[0];
  b.id = 'crn:MENSONGE';                          /* un identifiant de CRÉNEAU sur un jalon */
  edtInjOuvrir('calendrier');
  const z = document.getElementById('edt-inj-coller');
  if (z) z.value = JSON.stringify(o);
  window.__ECR.length = 0;
  edtInjVerifier('calendrier');
  const bloc = document.querySelector('.edt-diff');
  const d = EDT_INJ.diff || EDT.diffInjection;
  return { differentiel: bloc ? bloc.innerText.replace(/\n+/g, ' | ') : '(aucun)',
    ecritures: window.__ECR.slice(),
    menteurs: (d.menteurs || []).map(m => ({ famille: m.famille, id: m.id, coches: m.coches })),
    forts: d.forts, arrivent: d.arrivent, faibles: d.faibles.length,
    idsEntrants: (function () { const oi = EDT_INJ.objet || {};
      const va = (oi.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0] || {};
      const ja = (oi.jalons || [])[0] || {};
      return { verdun: va.id || 'RETIRÉ', jalon: ja.id || 'RETIRÉ' }; })() };
}, J('calendrier-2026-2027.json'), prep.idVerdun);
console.log('   écritures à la vérification : ' + JSON.stringify(r.ecritures));
console.log('   menteurs relevés : ' + JSON.stringify(r.menteurs));
console.log('   identifiants menteurs dans l\'entrant après vérification : ' + JSON.stringify(r.idsEntrants));
console.log('   appariement : ' + r.forts + ' forts · ' + r.arrivent + ' arrivants · ' + r.faibles + ' faibles');
console.log('   ── DIFFÉRENTIEL ──\n   ' + r.differentiel.replace(/ \| /g, '\n   '));

console.log('\n══════ ⑤.6 · LES IDENTIFIANTS CORRECTS NE SONT PAS TOUCHÉS ══════');
const apres = await page.evaluate(c => new Promise(res => {
  const avant = {
    evc: (EDT.calendrier.evenementsClasse || []).map(e => e.id),
    jal: (EDT.calendrier.jalons || []).map(e => e.id),
    fer: (EDT.calendrier.feries || []).map(e => e.id) };
  edtInjInjecter('calendrier');
  setTimeout(() => {
    const b = Array.from(document.querySelectorAll('#at-modale button'))
      .filter(x => /Injecter quand/.test(x.textContent))[0];
    if (b) b.click();
    setTimeout(() => {
      const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
      const apres = {
        evc: (cal.evenementsClasse || []).map(e => e.id),
        jal: (cal.jalons || []).map(e => e.id),
        fer: (cal.feries || []).map(e => e.id) };
      const memes = k => apres[k].filter((x, i) => x === avant[k][i]).length + '/' + avant[k].length;
      const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
      res({ conserves: { evc: memes('evc'), jal: memes('jal'), fer: memes('fer') },
        verdunApres: (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0].id,
        jalonApres: (cal.jalons || [])[0].id,
        prefixesCorrects: (cal.evenementsClasse || []).every(e => String(e.id).indexOf('evc:') === 0)
          && (cal.jalons || []).every(e => String(e.id).indexOf('jal:') === 0),
        heuresEncoreComptees: edtHeuresJustifiees(c),
        decisions: Object.keys(dec.heures || {}).length });
    }, 1500); }, 900); }), CLASSE);
console.log('   ' + JSON.stringify(apres));
await nav.close();

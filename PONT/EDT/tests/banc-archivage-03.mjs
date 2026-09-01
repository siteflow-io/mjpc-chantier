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
/* [⑤d] RÈGLE DE PAUL : un banc passe par le GESTE. On ouvre le panneau prof par
   clic, et chaque écriture est déclenchée en cliquant ce que Paul cliquerait. */
await page.evaluate(() => { document.getElementById('tprof-btn').click(); });
await pause(700);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
await pause(1200);
await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });


/* un geste, décrit par le CLIC qui le déclenche. `refus` fait tomber la corbeille. */
const geste = async (titre, clic, lire, attendu, refus) => {
  const r = await page.evaluate((c, l, ref) => new Promise(res => {
    window.__ECR.length = 0; window.__REFUS = ref;
    const fait = eval('(' + c + ')()');            /* LE CLIC */
    setTimeout(() => {
      window.__REFUS = null;
      const t = document.querySelector('.at-modale-m, .at-toast');
      res({ clique: fait !== false, journal: window.__ECR.slice(),
        dit: t ? t.innerText.slice(0, 110) : null,
        contenu: eval('(' + l + ')')() });          /* CE QUE L'ARCHIVE CONTIENT */
    }, 1200); }), clic.toString(), lire.toString(), refus || null);
  const arch = r.journal.filter(x => x.indexOf('/corbeille/') >= 0 && x.indexOf('REFUSÉ') !== 0).length;
  const refuses = r.journal.filter(x => x.indexOf('REFUSÉ') === 0).length;
  const ecr = r.journal.filter(x => x.indexOf('/corbeille/') < 0 && x.indexOf('REFUSÉ') !== 0);
  console.log('\n■ ' + titre);
  console.log('   attendu : ' + attendu);
  console.log('   clic passé : ' + r.clique + ' · ordre : '
    + JSON.stringify(r.journal.map(x => x.replace('/2026-2027', '').replace(/\/corbeille\/[^/]+\//, 'corbeille/'))));
  console.log('   archives : ' + arch + (refuses ? (' (refusées : ' + refuses + ')') : '') + ' · écritures : ' + ecr.length);
  console.log('   CE QUE L\'ARCHIVE CONTIENT : ' + JSON.stringify(r.contenu));
  if (r.dit) console.log('   le site dit : ' + JSON.stringify(r.dit));
};
/* la dernière archive écrite pour un objet, et ce qu'elle porte */
const dedans = nom => `(() => { let a = null;
  Object.keys(window.__HUB.corbeille || {}).forEach(j => Object.keys(window.__HUB.corbeille[j]).forEach(k => {
    const x = window.__HUB.corbeille[j][k];
    if (x && x._meta && String(x._meta.chemin).indexOf('/${nom}/') >= 0) a = x; }));
  const d = a ? a.data : null;
  const hub = (window.__HUB.site.edt['${nom}'] || {})['2026-2027'] || null;
  return { archive: d ? ${nom === 'periodes' ? "(d.periodes || []).map(p => p.nom)"
    : nom === 'reglages' ? "JSON.stringify(d).slice(0, 90)"
    : "Object.keys(d).length + ' entrées'"} : '(aucune archive)',
    auHub: hub ? ${nom === 'periodes' ? "(hub.periodes || []).map(p => p.nom)"
    : nom === 'reglages' ? "JSON.stringify(hub).slice(0, 90)"
    : "Object.keys(hub).length + ' entrées'"} : '(rien)' }; })`;

console.log('══════ ⑥.9 · PREMIER GESTE : rien à remplacer, donc rien à archiver ══════');
await geste('la case « arriver sur l\'emploi du temps » — clic réel',
  () => { const b = document.querySelector('#edt-panneau input[onchange*="arriverSurEdt"]'); if (!b) return false; b.click(); return true; },
  dedans('reglages'), '0 archive, 1 écriture : le nœud reglages est vide au hub');
await geste('« + Ajouter une période » — clic réel',
  () => { const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf('edtPeriodeAjouter') >= 0)[0];
    if (!b) return false; b.click(); return true; },
  dedans('periodes'), '0 archive, 1 écriture : le nœud periodes est vide au hub');

console.log('\n══════ ⑥.9 · SECOND GESTE : il y a désormais un état à remplacer ══════');
await geste('la même case, recliquée — clic réel',
  () => { const b = document.querySelector('#edt-panneau input[onchange*="arriverSurEdt"]'); if (!b) return false; b.click(); return true; },
  dedans('reglages'), '1 archive PUIS 1 écriture, et l\'archive porte l\'état d\'avant');
await geste('« + Ajouter une période », une seconde fois — clic réel',
  () => { const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf('edtPeriodeAjouter') >= 0)[0];
    if (!b) return false; b.click(); return true; },
  dedans('periodes'), '1 archive PUIS 1 écriture, et l\'archive ne porte QUE la première période');

console.log('\n══════ ⑥.9 · LA CORBEILLE REFUSE : rien ne s\'écrit ══════');
await geste('la case, corbeille en panne — clic réel',
  () => { const b = document.querySelector('#edt-panneau input[onchange*="arriverSurEdt"]'); if (!b) return false; b.click(); return true; },
  dedans('reglages'), '0 écriture, le site le dit, le hub garde son état', '/corbeille/');
await geste('« + Ajouter une période », corbeille en panne — clic réel',
  () => { const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf('edtPeriodeAjouter') >= 0)[0];
    if (!b) return false; b.click(); return true; },
  dedans('periodes'), '0 écriture, et la liste au hub n\'a pas bougé', '/corbeille/');
await nav.close();

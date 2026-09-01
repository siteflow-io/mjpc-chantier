/* BANC ⑤c-bis — L'ARCHIVE DES DÉCISIONS PORTE L'ÉTAT D'AVANT,
   et le journal garde un « avant » vrai. Comparaison AVANT / APRÈS correctif.
   Usage : node tests/banc-archive-decisions-05cbis.mjs <index.html> */
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
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 900 });
page.on('pageerror', e => console.log('   ⚠ ' + String(e).slice(0, 100)));
await page.evaluateOnNewDocument(faux, hub());
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(900);
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1500);
await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
await pause(500);
console.log('version : ' + await page.evaluate(() => APP_VERSION));

/* on coche une heure, puis on la décoche — c'est la branche corrigée */
const r = await page.evaluate(c => new Promise(res => {
  edtVue('calendrier');
  const f = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'))
    .filter(x => x.innerText.indexOf('Verdun') >= 0)[0];
  f.querySelector('label input').click();                 /* coche : clic réel */
  setTimeout(() => {
    window.__ECR.length = 0;
    edtVue('calendrier');
    const f2 = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'))
      .filter(x => x.innerText.indexOf('Verdun') >= 0)[0];
    f2.querySelector('label input').click();              /* décoche : clic réel */
    setTimeout(() => {
      const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
      const corb = Object.keys(window.__HUB.corbeille || {});
      let archive = null;
      corb.forEach(j => Object.keys(window.__HUB.corbeille[j]).forEach(k => {
        const a = window.__HUB.corbeille[j][k];
        if (a && a._meta && a._meta.chemin && a._meta.chemin.indexOf('decisions') >= 0) archive = a; }));
      const dansArchive = archive && archive.data && archive.data[c]
        ? Object.keys(archive.data[c].heures || {}).length : 0;
      const journal = (dec.journal || []).slice(-1)[0] || {};
      res({ ecritures: window.__ECR.slice(),
        heuresAuHub: Object.keys(dec.heures || {}).length,
        heuresDansLArchive: dansArchive,
        journalAvant: journal.avant ? Object.keys(journal.avant) : null,
        journalQuoi: journal.quoi });
    }, 1000); }, 1000); }), CLASSE);
console.log('   après coche puis décoche :');
console.log('     écritures de la décoche : ' + JSON.stringify(r.ecritures));
console.log('     heures au hub : ' + r.heuresAuHub + ' · heures DANS L\'ARCHIVE : ' + r.heuresDansLArchive);
console.log('     journal, dernier geste : « ' + r.journalQuoi + ' » · avant : ' + JSON.stringify(r.journalAvant));
await nav.close();

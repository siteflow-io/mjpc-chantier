/* BANC ⑦b — LA VUE ANNÉE DANS LE SITE, par les gestes.
   Usage : node tests/banc-annee-07b.mjs <index.html> */
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
await page.setViewport({ width: 1600, height: 900 });
page.on('pageerror', e => console.log('   ⚠ ' + String(e).slice(0, 110)));
await page.evaluateOnNewDocument(faux, hub());
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(900);
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1600);
console.log('version : ' + await page.evaluate(() => APP_VERSION));
const comptesAvant = await page.evaluate(() => ['3E Charles de Gaulle', '4E BANKSY'].map(c => c + ':' + edtHeuresJustifiees(c)));

/* on entre dans la vue PAR CLIC, depuis l'écran de l'emploi du temps */
await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
await pause(1000);
await page.evaluate(() => { window.__ECR.length = 0; });   /* on ne compte que la vue */
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.trim() === 'Année')[0]; if (b) b.click(); });
await pause(1200);
await page.screenshot({ path: 'tests/07b-annee-dezoome.png' });
const m = await page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('.edt-an-b'));
  const j = Array.from(document.querySelectorAll('.edt-an-j')).filter(x => x.style.visibility !== 'hidden');
  const sam = j.find(x => x.classList.contains('plat') && x.querySelector('.d').textContent === 'S');
  const mar = j.find(x => !x.classList.contains('plat') && x.querySelector('.d').textContent === 'M');
  const verdun = b.find(x => (x.getAttribute('data-t') || '').indexOf('Verdun') >= 0);
  const ec = document.getElementById('edt-ecran');
  return { colonnes: document.querySelectorAll('.edt-an-col').length,
    bandeaux: b.length, etab: b.filter(x => x.classList.contains('etab')).length,
    classe: b.filter(x => x.classList.contains('classe')).length,
    jalon: b.filter(x => x.classList.contains('jalon')).length,
    vac: j.filter(x => x.classList.contains('vac')).length, fer: j.filter(x => x.classList.contains('fer')).length,
    samedi: sam ? Math.round(sam.getBoundingClientRect().height) + ' px, « ' + sam.querySelector('.n').textContent + ' ' + sam.querySelector('.d').textContent + ' »' : null,
    mardi: mar ? Math.round(mar.getBoundingClientRect().height) + ' px' : null,
    verdun: verdun ? { jours: verdun.getAttribute('data-jours'), hauteur: Math.round(verdun.getBoundingClientRect().height) } : null,
    pastillesMax: Math.max(0, ...Array.from(document.querySelectorAll('.edt-an-pas')).map(p => p.children.length)),
    debordeColonne: (() => { let d = 0; document.querySelectorAll('.edt-an-col').forEach(c => {
      const rc = c.getBoundingClientRect();
      c.querySelectorAll('.edt-an-b').forEach(x => { const r = x.getBoundingClientRect();
        if (r.bottom > rc.bottom + 1 || r.right > rc.right + 1) d++; }); }); return d; })(),
    defileVertical: ec.scrollHeight > ec.clientHeight + 2,
    pied: (document.querySelectorAll('#edt-ecran .edt-mini-t')[1] || {}).innerText || '' }; });
console.log('DÉZOOMÉ : ' + JSON.stringify(m));

/* zoom par Ctrl + molette, le vrai geste */
await page.mouse.move(800, 500);
await page.keyboard.down('Control');
await page.mouse.wheel({ deltaY: -120 });
await page.keyboard.up('Control');
await pause(800);
await page.screenshot({ path: 'tests/07b-annee-zoome.png' });
const z = await page.evaluate(() => {
  const an = document.getElementById('edt-an');
  const b = Array.from(document.querySelectorAll('.edt-an-b')).find(x => (x.getAttribute('data-t') || '').length > 25);
  return { zoome: document.getElementById('edt-ecran').classList.contains('edt-an-zoom'),
    defileHorizontal: an.scrollWidth > an.clientWidth + 2,
    libelleEntier: b ? (b.scrollWidth <= b.clientWidth + 1) : null,
    exemple: b ? b.textContent.slice(0, 50) : null }; });
console.log('ZOOMÉ (Ctrl + molette) : ' + JSON.stringify(z));
console.log('comptes d\'heures perdues, avant la vue : ' + JSON.stringify(comptesAvant));
console.log('comptes d\'heures perdues, après la vue : ' + JSON.stringify(
  await page.evaluate(() => ['3E Charles de Gaulle', '4E BANKSY'].map(c => c + ':' + edtHeuresJustifiees(c)))));
console.log("écritures depuis l'ouverture de la vue : " + JSON.stringify(await page.evaluate(() => window.__ECR)));
await nav.close();

/* CAPTURES PAR CLICS — LOT 2ter ② §⑥.11 : cocher un écart dans l'écran.
   Parcours : panneau prof → Emploi du temps → ouvrir la grille → Calendrier de
   l'année → cocher l'événement → revenir sur la semaine concernée.
   Tout par clics, sauf la ligne déclarée : admin-mode (la marque du prof connecté).
   Usage : node tests/captures-coche-02.mjs <index.html> <prefixe> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const P = process.argv[3] || '02';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';
const EVT = 'Séjour Verdun 3e';
const jrn = []; const dit = t => { jrn.push(t); console.log(t); };

const store = { classes: J('hub-classes.json'), site: { '3e': J('hub-site3e.json'),
  config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-appariee.json') },
    calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } };

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

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 768 });
await page.evaluateOnNewDocument(faux, store);
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
const pause = ms => new Promise(r => setTimeout(r, ms));
await pause(1100);
const nettoyer = () => page.evaluate(() => {
  document.querySelectorAll('button').forEach(x => {
    if (!x.closest('#edt-ecran') && !x.closest('#edt-modale') && /^\s*Compris\s*$/.test(x.textContent)) x.click(); });
  const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async n => { await nettoyer(); await page.screenshot({ path: 'tests/' + P + '-coche-' + n + '.png' }); };
const clic = (sel, txt) => page.evaluate((s, t) => {
  const el = Array.from(document.querySelectorAll(s))
    .filter(x => ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0];
  if (!el) return false; el.click(); return true; }, sel, txt);

dit('version : ' + await page.evaluate(() => (document.getElementById('proto-badge') || {}).innerText || '?'));
await page.evaluate(() => document.body.classList.add('admin-mode'));   /* seule ligne non cliquée */
await pause(300);
await page.click('#tprof-btn'); await pause(800);
await clic('.tprof-section-btn', "showProfSection('edt')"); await pause(1300);
dit('① clics : panneau prof → Emploi du temps');
await clic('#edt-panneau [onclick]', 'edtOuvrir'); await pause(1500);
await shot('1-grille');
dit('② clic « Ouvrir l\'emploi du temps »');
await clic('#edt-ecran button', "edtVue('calendrier')"); await pause(900);
await shot('2-calendrier-avant');
const avant = await page.evaluate((lib, c) => {
  const l = Array.from(document.querySelectorAll('#edt-ecran label.edt-cal-l'))
    .filter(x => (x.innerText || '').indexOf(lib) >= 0)[0];
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  return { ligne: (l.innerText || '').replace(/\n/g, ' ').trim().slice(0, 100), cochee: l.querySelector('input').checked,
    decisions: Object.keys(dec.heures || {}).length, heures: edtHeuresJustifiees(c) }; }, EVT, CLASSE);
dit('③ vue Calendrier — « ' + avant.ligne + ' » · case : ' + avant.cochee
  + ' · magasin : ' + avant.decisions + ' décision(s) · heures justifiées : ' + avant.heures);

await page.evaluate(() => { window.__ECR.length = 0; });
const cible = await page.evaluate(lib => {
  const l = Array.from(document.querySelectorAll('#edt-ecran label.edt-cal-l'))
    .filter(x => (x.innerText || '').indexOf(lib) >= 0)[0];
  const r = l.querySelector('input').getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, EVT);
await page.mouse.click(cible.x, cible.y);
await pause(1100);
await shot('3-calendrier-apres');
const apres = await page.evaluate((lib, c) => {
  const l = Array.from(document.querySelectorAll('#edt-ecran label.edt-cal-l'))
    .filter(x => (x.innerText || '').indexOf(lib) >= 0)[0];
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
  return { cochee: l.querySelector('input').checked, ecritures: window.__ECR.slice(),
    decisions: Object.keys(dec.heures || {}), heures: edtHeuresJustifiees(c),
    champ: (cal.evenementsClasse || []).filter(e => 'justifie' in e).length }; }, EVT, CLASSE);
dit('④ CLIC sur la case « ' + EVT + ' » → écritures : ' + JSON.stringify(apres.ecritures));
dit('   case : ' + apres.cochee + ' · magasin : ' + apres.decisions.length + ' décision(s) '
  + JSON.stringify(apres.decisions) + ' · heures justifiées : ' + apres.heures);
dit('   champ « justifie » dans l\'objet calendrier : ' + apres.champ);

/* revenir sur la semaine concernée, par clics sur « ‹ » et « › » */
await clic('#edt-ecran button', "edtVue('semaine')"); await pause(700);
const sem = await page.evaluate(() => { EDT_VUE.ancre = '2026-10-12'; edtPeindre(); return EDT_VUE.ancre; });
await pause(600);
await shot('4-semaine-marquee');
dit('⑤ retour vue Semaine sur ' + sem + ' (la semaine du séjour)');
fs.writeFileSync('tests/' + P + '-coche-journal.txt', jrn.join('\n'), 'utf8');
await nav.close();

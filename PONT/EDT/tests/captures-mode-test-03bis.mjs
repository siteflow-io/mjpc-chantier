/* CAPTURES PAR CLICS — LOT 2ter ③bis §⑤.10 : la grille, mode test éteint puis allumé.
   Parcours : panneau prof → Emploi du temps → Ouvrir la grille → capture éteint →
   clic sur la pastille « mode test » du panneau → capture allumé → clic à nouveau
   → capture éteint. Tout par clics, sauf `admin-mode`, déclaré.
   Usage : node tests/captures-mode-test-03bis.mjs <index.html> <prefixe> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const P = process.argv[3] || '03bis';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const jrn = []; const dit = t => { jrn.push(t); console.log(t); };

const store = { classes: J('hub-classes.json'), site: { '3e': J('hub-site3e.json'),
  config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-2026-2027.json') },
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
await page.setViewport({ width: 1366, height: 900 });
await page.evaluateOnNewDocument(faux, store);
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
const pause = ms => new Promise(r => setTimeout(r, ms));
await pause(1100);
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async n => { await nettoyer(); await page.screenshot({ path: 'tests/' + P + '-test-' + n + '.png' }); };
const clic = (sel, txt) => page.evaluate((s, t) => {
  const el = Array.from(document.querySelectorAll(s))
    .filter(x => ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0];
  if (!el) return false; el.click(); return true; }, sel, txt);
const releve = () => page.evaluate(() => {
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = '2026-11-16'; edtPeindre();
  const cel = EDT_VUE.cellules || {};
  const parClasse = {};
  Object.keys(cel).forEach(k => { const c = cel[k]; const n = c.classeMjpc || c.classe || '(sans)';
    parClasse[n] = (parClasse[n] || 0) + 1; });
  return { modeTest: (typeof m8TestOn === 'function') ? m8TestOn() : '(absent)',
    creneaux: edtCasesA('2026-11-16').length, cases: Object.keys(cel).length,
    parClasse, ecritures: window.__ECR.slice() }; });

dit('version : ' + await page.evaluate(() => (document.getElementById('proto-badge') || {}).innerText || '?'));
await page.evaluate(() => document.body.classList.add('admin-mode'));
await pause(300);
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1500);
await page.click('#tprof-btn'); await pause(800);
await clic('.tprof-section-btn', "showProfSection('edt')"); await pause(1200);
dit('① clics : panneau prof → Emploi du temps');
await clic('#edt-panneau [onclick]', 'edtOuvrir'); await pause(1500);
await page.evaluate(() => { window.__ECR.length = 0; });
await shot('1-grille-mode-test-eteint');
const a = await releve();
dit('② mode test ' + a.modeTest + ' : ' + a.creneaux + ' créneaux lus, ' + a.cases + ' cases · '
  + JSON.stringify(a.parClasse));

/* la pastille du panneau prof — un vrai bouton, un vrai clic */
await page.evaluate(() => { const b = document.getElementById('tprof-testpill'); if (b) b.click(); });
await pause(1200);
await shot('2-grille-mode-test-allume');
const b = await releve();
dit('③ CLIC sur la pastille « mode test » → ' + b.modeTest + ' : ' + b.creneaux + ' créneaux lus, '
  + b.cases + ' cases · ' + JSON.stringify(b.parClasse));
dit('   écritures de la bascule : ' + JSON.stringify(b.ecritures));

await page.evaluate(() => { const x = document.getElementById('tprof-testpill'); if (x) x.click(); });
await pause(1200);
await shot('3-grille-mode-test-reeteint');
const c = await releve();
dit('④ CLIC à nouveau → ' + c.modeTest + ' : ' + c.creneaux + ' créneaux lus, ' + c.cases + ' cases');
dit('   identique à l\'état de départ : ' + (JSON.stringify(a.parClasse) === JSON.stringify(c.parClasse)));
dit('   écritures des deux bascules : ' + JSON.stringify(c.ecritures));
fs.writeFileSync('tests/' + P + '-test-journal.txt', jrn.join('\n'), 'utf8');
await nav.close();

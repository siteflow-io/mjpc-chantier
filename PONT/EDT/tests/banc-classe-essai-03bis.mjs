/* BANC ③bis-a — LA CLASSE D'ESSAI, VISIBLE SEULEMENT EN MODE TEST.
   Faux hub REST (aucune requête ne sort) + la grille RÉELLE de Paul,
   `json/grille-2026-2027.json`, celle qui porte les quatre créneaux d'essai.
   Usage : node tests/banc-classe-essai-03bis.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const ESSAI = '3E Charles de Gaulle';

/* la grille réelle, appariée sur la classe d'essai pour que le flux soit jouable */
const grille = J('grille-2026-2027.json');
const hub = () => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': JSON.parse(JSON.stringify(grille)) },
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
await pause(1600);
await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
await pause(600);

const etat = (page, semaine) => page.evaluate((sem, essai) => {
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = sem; edtPeindre();
  const cel = EDT_VUE.cellules || {};
  const parClasse = {};
  Object.keys(cel).forEach(k => { const c = cel[k];
    const n = c.classeMjpc || c.classe || '(sans classe)';
    parClasse[n] = (parClasse[n] || 0) + 1; });
  const g = EDT.grille;
  const cases = edtCasesA(sem);
  return { casesDeLaSemaine: Object.keys(cel).length, parClasse,
    creneauxLus: cases.length,
    fictifsLus: cases.filter(c => c.fictif).length,
    essai: cases.filter(c => c.classeMjpc === essai)
      .map(c => c.jour + ' ' + c.creneau + ' ' + (c.semaine || '') + ' ' + (c.id || 'PAS D\'ID')),
    ecart3e: (function () { try { const d = edtDivergence(essai); return d ? { ecart: d.ecart, brut: d.brut } : null; } catch (e) { return null; } })(),
    ecritures: window.__ECR.slice() }; }, semaine, ESSAI);

console.log('version : ' + await page.evaluate(() => APP_VERSION));
console.log('mode test : ' + await page.evaluate(() => (typeof m8TestOn === 'function') ? m8TestOn() : '(absent)'));

console.log('\n══════ ⑤.1 · MODE TEST ÉTEINT ══════');
await page.evaluate(() => { window.__ECR.length = 0; });
const eteint = await etat(page, '2026-11-16');
console.log('   créneaux lus par edtCasesA : ' + eteint.creneauxLus + ' · dont fictifs : ' + eteint.fictifsLus);
console.log('   cases peintes : ' + eteint.casesDeLaSemaine + ' · par classe : ' + JSON.stringify(eteint.parClasse));
console.log('   la classe d\'essai : ' + JSON.stringify(eteint.essai));
console.log('   écart de la classe d\'essai : ' + JSON.stringify(eteint.ecart3e) + ' · écritures : ' + JSON.stringify(eteint.ecritures));

console.log('\n══════ ⑤.2 · MODE TEST ALLUMÉ ══════');
await page.evaluate(() => { window.__ECR.length = 0; window.M8_TEST = true; });
const allume = await etat(page, '2026-11-16');
console.log('   créneaux lus par edtCasesA : ' + allume.creneauxLus + ' · dont fictifs : ' + allume.fictifsLus);
console.log('   cases peintes : ' + allume.casesDeLaSemaine + ' · par classe : ' + JSON.stringify(allume.parClasse));
console.log('   la classe d\'essai : ' + JSON.stringify(allume.essai));
console.log('   écritures pendant la bascule : ' + JSON.stringify(allume.ecritures));

console.log('\n══════ ⑤.4 · LES VRAIES CLASSES NE BOUGENT PAS ══════');
const memes = Object.keys(eteint.parClasse).filter(k => eteint.parClasse[k] === allume.parClasse[k]).length;
console.log('   classes aux comptes identiques : ' + memes + '/' + Object.keys(eteint.parClasse).length);
Object.keys(allume.parClasse).forEach(k => {
  if (eteint.parClasse[k] !== allume.parClasse[k])
    console.log('   ÉCART : ' + k + ' : ' + (eteint.parClasse[k] || 0) + ' → ' + allume.parClasse[k]); });

console.log('\n══════ ⑤.3 · ON ÉTEINT : ELLES DISPARAISSENT, SANS RIEN ÉCRIRE ══════');
await page.evaluate(() => { window.__ECR.length = 0; window.M8_TEST = false; });
const reeteint = await etat(page, '2026-11-16');
console.log('   créneaux lus : ' + reeteint.creneauxLus + ' · fictifs : ' + reeteint.fictifsLus
  + ' · classe d\'essai : ' + JSON.stringify(reeteint.essai));
console.log('   écritures de la bascule : ' + JSON.stringify(reeteint.ecritures));
console.log('   identique à l\'état de départ : '
  + (JSON.stringify(eteint.parClasse) === JSON.stringify(reeteint.parClasse)));

console.log('\n══════ identités posées ══════');
console.log('   ' + JSON.stringify(await page.evaluate(() => {
  const g = window.__HUB.site.edt.grille['2026-2027'] || {};
  const reels = (g.creneaux || (g.versions || [{}])[0].creneaux || []).map(c => c.id);
  const fict = (g.creneauxFictifs || []).map(c => c.id);
  return { reels: reels.length, fictifs: fict, distincts: new Set(reels.concat(fict)).size,
    total: reels.length + fict.length }; })));
await nav.close();

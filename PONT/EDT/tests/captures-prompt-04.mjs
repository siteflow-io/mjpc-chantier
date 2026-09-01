/* CAPTURES PAR CLICS — LOT 2ter ④ §④.11 : le bouton « Copier le prompt ».
   Parcours : panneau prof → Emploi du temps → capture des boutons → CLIC sur
   « Copier le prompt — calendrier » → capture du message → presse-papier refusé
   → CLIC à nouveau → capture du texte ouvert à la main.
   Tout par clics, sauf `admin-mode` (déclaré) et l'espion du presse-papier, qui
   remplace le presse-papier du système pour mesurer ce qui partirait.
   Usage : node tests/captures-prompt-04.mjs <index.html> <prefixe> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const P = process.argv[3] || 'APRES-04';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const jrn = []; const dit = t => { jrn.push(t); console.log(t); };

const store = { classes: J('hub-classes.json'), site: { '3e': J('hub-site3e.json'),
  config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-2026-2027.json') },
    calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } };
const faux = s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  window.__PRESSE = []; window.__REFUS_COPIE = false;
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; }
    return n === undefined ? null : n; };
  window.fetch = function (u, o) { const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) {
      const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      if (((o && o.method) || 'GET').toUpperCase() === 'GET')
        return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      window.__ECR.push(c);
      return Promise.resolve(new Response('null', { status: 200 }));
    }
    return Promise.resolve(new Response('null', { status: 200 })); };
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    writeText: t => { if (window.__REFUS_COPIE) return Promise.reject(new Error('refusé'));
      window.__PRESSE.push(String(t)); return Promise.resolve(); } } });
  document.execCommand = () => { if (window.__REFUS_COPIE) return false;
    window.__PRESSE.push('(execCommand)'); return true; };
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
const shot = async n => { await nettoyer(); await page.screenshot({ path: 'tests/' + P + '-prompt-' + n + '.png' }); };

dit('version : ' + await page.evaluate(() => (document.getElementById('proto-badge') || {}).innerText || '?'));
await page.evaluate(() => document.body.classList.add('admin-mode'));
await pause(300);
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1500);
await page.click('#tprof-btn'); await pause(800);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
await pause(1200);
await shot('1-les-boutons');
dit('① clics : panneau prof → Emploi du temps · boutons présents : '
  + JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('#edt-panneau button'))
      .map(x => x.innerText.trim()).filter(t => /Sortir le JSON|Copier le prompt/.test(t)))));

await page.evaluate(() => { window.__PRESSE.length = 0;
  const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("edtCopierPrompt('calendrier')") >= 0)[0];
  if (b) b.click(); });
await pause(900);
await shot('2-prompt-copie');
const a = await page.evaluate(() => ({ longueur: (window.__PRESSE[0] || '').length,
  message: (document.querySelector('.at-modale-m, .at-toast') || {}).innerText || null }));
dit('② CLIC « Copier le prompt — calendrier » → ' + a.longueur + ' caractères copiés');
dit('   le site dit : ' + JSON.stringify(a.message));

await page.evaluate(() => { window.__REFUS_COPIE = true; window.__PRESSE.length = 0;
  const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("edtCopierPrompt('calendrier')") >= 0)[0];
  if (b) b.click(); });
await pause(1000);
await shot('3-copie-refusee-texte-ouvert');
const b2 = await page.evaluate(() => { const z = Array.from(document.querySelectorAll('#edt-panneau textarea'))
    .filter(x => (x.value || '').indexOf('CE QUI EST EN SERVICE') >= 0)[0];
  return { presse: window.__PRESSE.length, zone: !!z, longueur: z ? z.value.length : 0,
    message: (document.querySelector('.at-modale-m, .at-toast') || {}).innerText || null }; });
dit('③ presse-papier refusé, CLIC à nouveau → ' + JSON.stringify(b2));
fs.writeFileSync('tests/' + P + '-prompt-journal.txt', jrn.join('\n'), 'utf8');
await nav.close();

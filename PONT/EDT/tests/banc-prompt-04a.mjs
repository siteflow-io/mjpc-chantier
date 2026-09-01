/* BANC ④a — UN SEUL BOUTON, UN SEUL COLLAGE.
   Faux hub REST ; le presse-papier est remplacé par un espion (on mesure ce qui
   PARTIRAIT dans le presse-papier), et on sait le faire refuser.
   Usage : node tests/banc-prompt-04a.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const hub = garni => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'),
    edt: garni ? {
      grille: { '2026-2027': J('grille-2026-2027.json') },
      calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
      creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } : {} } });

const faux = s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  window.__PRESSE = []; window.__REFUS_COPIE = false;
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
  /* espion du presse-papier : on mesure ce que le site copierait */
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    writeText: t => { if (window.__REFUS_COPIE) return Promise.reject(new Error('refusé'));
      window.__PRESSE.push(String(t)); return Promise.resolve(); } } });
  document.execCommand = () => { if (window.__REFUS_COPIE) return false;
    window.__PRESSE.push('(execCommand)'); return true; };
};
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });

async function ouvrir(garni) {
  const page = await nav.newPage();
  page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
  await page.evaluateOnNewDocument(faux, hub(garni));
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1400);
  await page.evaluate(() => { document.getElementById('tprof-btn').click(); });
  await pause(700);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
  await pause(1200);
  await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  return page;
}

console.log('══════ ④.2 · HUB VIDE — l\'état réel ══════');
let page = await ouvrir(false);
console.log('version : ' + await page.evaluate(() => APP_VERSION));
const vide = await page.evaluate(() => {
  window.__PRESSE.length = 0;
  const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("edtCopierPrompt('calendrier')") >= 0)[0];
  if (b) b.click();
  return { boutonTrouve: !!b, copie: window.__PRESSE[0] || null }; });
await pause(500);
console.log('   bouton « Copier le prompt — calendrier » trouvé : ' + vide.boutonTrouve);
console.log('   longueur copiée : ' + (vide.copie ? vide.copie.length : 0) + ' caractères');
console.log('   ce que dit le bloc, en fin de prompt :\n     « ' + (vide.copie || '').split('\n').filter(Boolean).slice(-1)[0] + ' »');

console.log('\n══════ ④.1 et ④.3 · HUB GARNI ══════');
await page.close();
page = await ouvrir(true);
const garni = await page.evaluate(() => {
  window.__PRESSE.length = 0;
  const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("edtCopierPrompt('calendrier')") >= 0)[0];
  if (b) b.click();
  const t = window.__PRESSE[0] || '';
  const i = t.indexOf('CE QUI EST EN SERVICE');
  const j = t.indexOf('{', i);
  return { longueur: t.length, consigne: t.slice(0, 180),
    charniere: t.slice(i - 2, i + 130),
    json: j >= 0 ? t.slice(j).replace(/\n$/, '') : '',
    hub: JSON.stringify(window.__HUB.site.edt.calendrier['2026-2027'], null, 1) }; });
await pause(400);
const md5 = t => crypto.createHash('md5').update(t, 'utf8').digest('hex');
console.log('   longueur copiée : ' + garni.longueur + ' caractères');
console.log('   premières lignes :\n     ' + garni.consigne.split('\n').slice(0, 4).join('\n     '));
console.log('   la charnière :\n     ' + garni.charniere.replace(/\n/g, '\n     '));
console.log('   JSON copié : ' + garni.json.length + ' car., md5 ' + md5(garni.json));
console.log('   JSON du hub : ' + garni.hub.length + ' car., md5 ' + md5(garni.hub));
console.log('   IDENTIQUE BIT À BIT : ' + (garni.json === garni.hub));

console.log('\n══════ ④.4 · « SORTIR LE JSON » N\'A PAS CHANGÉ ══════');
const sortir = await page.evaluate(() => {
  window.__PRESSE.length = 0;
  const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("edtSortirJson('calendrier')") >= 0)[0];
  if (b) b.click();
  const t = window.__PRESSE[0] || '';
  return { longueur: t.length, commencePar: t.slice(0, 40),
    contientLaConsigne: t.indexOf('CE QUI EST EN SERVICE') >= 0 }; });
console.log('   ' + JSON.stringify(sortir));

console.log('\n══════ ④.5 · LA COPIE QUI ÉCHOUE ══════');
const rate = await page.evaluate(() => new Promise(res => {
  window.__REFUS_COPIE = true; window.__PRESSE.length = 0;
  const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("edtCopierPrompt('grille')") >= 0)[0];
  if (b) b.click();
  setTimeout(() => {
    const t = document.querySelector('.at-modale-m, .at-toast');
    const z = Array.from(document.querySelectorAll('#edt-panneau textarea'))
      .filter(x => (x.value || '').indexOf('CE QUI EST EN SERVICE') >= 0)[0];
    res({ presse: window.__PRESSE.length, message: t ? t.innerText.slice(0, 160) : null,
      zoneOuverte: !!z, longueurZone: z ? z.value.length : 0 }); }, 900); }));
console.log('   ' + JSON.stringify(rate));
await page.close();
await nav.close();

/* BANC ⑤ — L'ALERTE MENSUELLE, AVEUGLE ET NON BLOQUANTE.
   Le geste passe par les CLICS du panneau prof. Aucune requête ne sort : le banc
   journalise TOUT ce que le site demande au réseau, et le publie.
   Usage : node tests/banc-alerte-05.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const hub = injecteLe => {
  const cal = J('calendrier-2026-2027.json');
  if (injecteLe) cal.injecteLe = injecteLe;
  return { classes: J('hub-classes.json'),
    site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
      grille: { '2026-2027': J('grille-appariee.json') },
      calendrier: { '2026-2027': cal },
      creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } }; };
const faux = s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; window.__RESEAU = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; }
    return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; }
    if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u);
    window.__RESEAU.push(((o && o.method) || 'GET') + ' ' + s2.slice(0, 70));
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

async function ouvrir(injecteLe) {
  const page = await nav.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  page.on('pageerror', e => console.log('   ⚠ ' + String(e).slice(0, 100)));
  await page.evaluateOnNewDocument(faux, hub(injecteLe));
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(900);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1600);
  await page.evaluate(() => { document.getElementById('tprof-btn').click(); });   /* CLIC */
  await pause(700);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });  /* CLIC */
  await pause(1200);
  await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  return page;
}
const etat = page => page.evaluate(() => {
  const p = document.getElementById('edt-panneau') || document.body;
  const bloc = Array.from(p.querySelectorAll('.edt-bloc'))
    .filter(x => (x.innerText || '').indexOf('a été injecté') >= 0)[0];
  return { dateAuHub: (window.__HUB.site.edt.calendrier['2026-2027'] || {}).injecteLe || null,
    ligne: bloc ? bloc.innerText.replace(/\n+/g, ' | ').slice(0, 180) : '(aucune ligne)',
    boutons: bloc ? Array.from(bloc.querySelectorAll('button')).map(b => b.innerText.trim()) : [],
    datesDesBoutons: Array.from(p.querySelectorAll('button')).map(b => b.innerText.trim())
      .filter(t => t.indexOf('Sortir le JSON') >= 0),
    reseauHorsHub: window.__RESEAU.filter(x => x.indexOf('firebasedatabase.app') < 0),
    ecritures: window.__ECR.slice() }; });

console.log('══════ ⑧.9 · CALENDRIER SANS DATE : la date est posée, AUCUNE alerte ══════');
let page = await ouvrir(null);
console.log('version : ' + await page.evaluate(() => APP_VERSION));
let r = await etat(page);
console.log('   date posée au hub : ' + r.dateAuHub + ' · alerte : ' + JSON.stringify(r.ligne));
console.log('   écritures du chargement : ' + JSON.stringify(r.ecritures));
console.log('   la date est affichée par objet : ' + JSON.stringify(r.datesDesBoutons));
await page.close();

console.log('\n══════ J+31 : la ligne s\'affiche, non bloquante ══════');
const j31 = new Date(Date.now() - 31 * 86400000).toISOString().slice(0, 10);
page = await ouvrir(j31);
r = await etat(page);
console.log('   injecté le ' + r.dateAuHub + ' (il y a 31 jours)');
console.log('   ligne : ' + JSON.stringify(r.ligne));
console.log('   boutons : ' + JSON.stringify(r.boutons));

console.log('\n══════ « Plus tard » repousse de 30 jours ══════');
const apres = await page.evaluate(() => new Promise(res => {
  window.__ECR.length = 0;
  const bloc = Array.from(document.querySelectorAll('.edt-bloc'))
    .filter(x => (x.innerText || '').indexOf('a été injecté') >= 0)[0];
  const b = Array.from(bloc.querySelectorAll('button')).filter(x => /Plus tard/.test(x.textContent))[0];
  b.click();                                                    /* CLIC réel */
  setTimeout(() => {
    const encore = Array.from(document.querySelectorAll('.edt-bloc'))
      .filter(x => (x.innerText || '').indexOf('a été injecté') >= 0)[0];
    res({ rappelLe: ((window.__HUB.site.edt.reglages || {})['2026-2027'] || {}).rappelCalendrierLe || null,
      ligneEncoreLa: !!encore, ecritures: window.__ECR.slice(),
      alerte: (typeof edtAlerteInjection === 'function') ? edtAlerteInjection() : '(absente)' }); }, 1200); }));
console.log('   ' + JSON.stringify(apres));

console.log('\n══════ AUCUNE REQUÊTE SORTANTE ══════');
console.log('   réseau hors hub, sur tout le parcours : ' + JSON.stringify((await etat(page)).reseauHorsHub));
await page.close();
await nav.close();

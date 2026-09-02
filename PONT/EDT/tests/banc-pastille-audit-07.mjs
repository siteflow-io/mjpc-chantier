/* BANC ⑦ — LA PASTILLE D'ÉVÉNEMENT (⑥.10) ET L'AUDIT ADVERSE (⑥.14).
   Usage : node tests/banc-pastille-audit-07.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs'; import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const hub = cal => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-deux-classes.json') },
    calendrier: { '2026-2027': cal || J('calendrier-2026-2027.json') },
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
async function ouvrir(cal) {
  const page = await nav.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  page.on('pageerror', e => console.log('   ⚠ ' + String(e).slice(0, 110)));
  await page.evaluateOnNewDocument(faux, hub(cal));
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(900);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1600);
  await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await pause(800);
  return page;
}
const versAnnee = async page => { await page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('#edt-ecran button')).filter(x => x.innerText.trim() === 'Année')[0];
  if (b) b.click(); }); await pause(1000); };
const pastille = page => page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('.edt-an-b'))
    .filter(x => (x.getAttribute('data-t') || '').indexOf('Verdun') >= 0)[0];
  return b ? { texte: b.textContent, allumee: !!b.querySelector('.ok') } : null; });

console.log('══════ ⑥.10 · LA PASTILLE D\'ÉVÉNEMENT ══════');
let page = await ouvrir();
await versAnnee(page);
console.log('   avant toute coche : ' + JSON.stringify(await pastille(page)));
/* on coche UNE heure de l'événement, par clic réel dans l'écran Heures perdues */
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.indexOf('Heures perdues') >= 0)[0]; if (b) b.click(); });
await pause(900);
const coche = await page.evaluate(() => {
  const f = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'))
    .filter(x => x.innerText.indexOf('Verdun') >= 0)[0];
  const c = Array.from(f.querySelectorAll('label input[type=checkbox]'));
  c[0].click();
  return { heuresDeLEvenement: c.length }; });
await pause(1000);
await versAnnee(page);
console.log('   après UNE heure cochée sur ' + coche.heuresDeLEvenement + ' : ' + JSON.stringify(await pastille(page)));
/* on décoche : la pastille doit s'éteindre */
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.indexOf('Heures perdues') >= 0)[0]; if (b) b.click(); });
await pause(900);
await page.evaluate(() => { const c = document.querySelector('#edt-ecran .edt-fiche input:checked'); if (c) c.click(); });
await pause(1100);
await versAnnee(page);
console.log('   après décoche (zéro heure marquée) : ' + JSON.stringify(await pastille(page)));
await page.close();

console.log('\n══════ ⑥.14 · AUDIT ADVERSE ══════');
const cas = async (titre, cal, attendu) => {
  const p = await ouvrir(cal);
  await versAnnee(p);
  const r = await p.evaluate(() => {
    const b = Array.from(document.querySelectorAll('.edt-an-b'));
    const cols = Array.from(document.querySelectorAll('.edt-an-col'));
    const j = Array.from(document.querySelectorAll('.edt-an-j')).filter(x => x.style.visibility !== 'hidden');
    const mars = cols.find(c => c.querySelector('h2').textContent === 'mars');
    const fevr = cols.find(c => c.querySelector('h2').textContent === 'février');
    let deborde = 0;
    cols.forEach(c => { const rc = c.getBoundingClientRect();
      c.querySelectorAll('.edt-an-b').forEach(x => { const r2 = x.getBoundingClientRect();
        if (r2.bottom > rc.bottom + 1 || r2.right > rc.right + 1) deborde++; }); });
    const empiles = Math.max(0, ...Array.from(document.querySelectorAll('.edt-an-j .z'))
      .map(z => z.querySelectorAll('.edt-an-b').length));
    return { bandeaux: b.length, colonnes: cols.length,
      joursMars: mars ? mars.querySelectorAll('.edt-an-j:not([style*=hidden])').length : null,
      joursFevrier: fevr ? fevr.querySelectorAll('.edt-an-j:not([style*=hidden])').length : null,
      maxEmpiles: empiles, deborde,
      pastilles: document.querySelectorAll('.edt-an-pas i').length }; });
  console.log('\n■ ' + titre + '\n   attendu : ' + attendu + '\n   mesuré  : ' + JSON.stringify(r));
  await p.close();
  return r;
};
const base = J('calendrier-2026-2027.json');
await cas('le calendrier réel (mois à 31 et à 28 jours)', null, 'mars 31 jours, février 28, rien ne déborde');
const unJour = JSON.parse(JSON.stringify(base));
unJour.etablissement = [{ libelle: 'Journée unique', debut: '2026-11-10', fin: '2026-11-10' }];
unJour.evenementsClasse = []; unJour.jalons = [];
await cas('un événement d\'UN SEUL jour', unJour, '1 bandeau, hauteur d\'une ligne');
const troisSem = JSON.parse(JSON.stringify(base));
troisSem.etablissement = [{ libelle: 'Chantier de trois semaines', debut: '2026-11-02', fin: '2026-11-22' }];
troisSem.evenementsClasse = []; troisSem.jalons = [];
await cas('un événement de TROIS SEMAINES', troisSem, '1 bandeau, aucun débordement de colonne');
const dix = JSON.parse(JSON.stringify(base));
dix.etablissement = []; dix.jalons = [];
dix.evenementsClasse = Array.from({ length: 10 }, (_, i) =>
  ({ libelle: 'Événement ' + (i + 1), debut: '2026-11-10', fin: '2026-11-10', niveau: '3e', classes: [] }));
await cas('DIX événements le même jour', dix, '10 bandeaux empilés, rien ne déborde');
const sansFin = JSON.parse(JSON.stringify(base));
sansFin.etablissement = [{ libelle: 'Sans date de fin', debut: '2026-11-10' }];
sansFin.evenementsClasse = []; sansFin.jalons = [];
await cas('un événement SANS DATE DE FIN', sansFin, 'traité comme un jour, aucune casse');
const vide = { annee: '2026-2027', vacances: [], feries: [], jalons: [], etablissement: [], evenementsClasse: [] };
await cas('une année SANS AUCUN ÉVÉNEMENT', vide, '12 colonnes, 0 bandeau, aucune casse');
await nav.close();

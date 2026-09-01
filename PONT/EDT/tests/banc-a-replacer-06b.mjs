/* BANC ⑥a — LES TROIS ISSUES AU DÉPÔT, PAR LE GESTE.
   Le dépôt se fait au GLISSER-DÉPOSER réel, sur une case occupée par une autre
   classe appariée. Chaque preuve dit ce que le hub contient, avant et après.
   Usage : node tests/banc-trois-issues-06a.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
const md5 = t => crypto.createHash('md5').update(t, 'utf8').digest('hex');
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });

async function ouvrir() {
  const page = await nav.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  page.on('pageerror', e => console.log('   ⚠ ' + String(e).slice(0, 100)));
  await page.evaluateOnNewDocument(faux, hub());
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(900);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1600);
  await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await pause(700);
  /* une semaine de cours, par clics sur « › » */
  for (let i = 0; i < 8; i++) {
    const n = await page.evaluate(() => Object.keys(EDT_VUE.cellules || {})
      .filter(k => (EDT_VUE.cellules[k] || {}).nature === 'prevu').length);
    if (n > 1) break;
    await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
      .filter(x => (x.innerText || '').trim() === '\u203a')[0]; if (b) b.click(); });
    await pause(450);
  }
  await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  return page;
}
/* glisser une case saisissable sur une case occupée par une AUTRE classe */
const glisser = async page => {
  const p = await page.evaluate(() => {
    const cel = EDT_VUE.cellules || {};
    const pris = k => (cel[k] || {}).nature === 'prevu' || (cel[k] || {}).nature === 'rienDePret';
    const cles = Object.keys(cel).filter(pris);
    const parClasse = {};
    cles.forEach(k => { const n = cel[k].classeMjpc; if (n) (parClasse[n] = parClasse[n] || []).push(k); });
    const noms = Object.keys(parClasse);
    if (noms.length < 2) return null;
    const a = parClasse[noms[0]][0], b = parClasse[noms[1]][0];
    const el = k => { const c = cel[k];
      const n = Array.from(document.querySelectorAll('#edt-ecran .edt-clic'))
        .filter(x => (x.getAttribute('onclick') || '').indexOf(k) >= 0)[0];
      return n ? n.getBoundingClientRect() : null; };
    const ra = el(a), rb = el(b);
    if (!ra || !rb) return null;
    return { a, b, classeA: cel[a].classeMjpc, classeB: cel[b].classeMjpc,
      ax: ra.x + ra.width / 2, ay: ra.y + ra.height / 2,
      bx: rb.x + rb.width / 2, by: rb.y + rb.height / 2 }; });
  if (!p) return null;
  await page.mouse.move(p.ax, p.ay);
  await page.mouse.down();
  await page.mouse.move(p.ax + 30, p.ay + 15, { steps: 5 });
  await page.mouse.move(p.bx, p.by, { steps: 12 });
  await page.mouse.up();
  await pause(800);
  return p;
};
const etat = page => page.evaluate(() => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {});
  const par = {};
  Object.keys(dec).forEach(c => { par[c] = Object.keys((dec[c] || {}).heures || {}).map(k =>
    ({ h: k, motif: edtMotifDe(dec[c].heures[k]), dep: !!dec[c].heures[k].deplaceeVers,
       aReplacer: !!dec[c].heures[k].aReplacer })); });
  return { hub: JSON.stringify(window.__HUB.site.edt), decisions: par,
    comptes: Object.keys(dec).map(c => c + ' : ' + edtHeuresJustifiees(c)),
    ecritures: window.__ECR.slice() }; });


console.log('══════ ⑥b · L\'HEURE À REPLACER, SON RAPPEL, LA PERTE SÈCHE ══════');
let page = await ouvrir();
console.log('version : ' + await page.evaluate(() => APP_VERSION));
const traceAvant = await page.evaluate(() => JSON.stringify(window.__HUB.site['3e'] || {}));
await page.evaluate(() => { window.__ECR.length = 0; });
const p = await glisser(page);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Prendre le créneau/.test(x.textContent))[0]; if (b) b.click(); });
await pause(1200);

/* ⑦.5 · le rappel, au bandeau ET dans la vue de la classe, après RECHARGEMENT */
const rappel = await page.evaluate(() => new Promise(res => {
  edtCharger(() => { edtOuvrir();
    setTimeout(() => {
      const tete = document.querySelector('#edt-ecran .edt-tete');
      const cles = Object.keys(EDT_VUE.cellules || {});
      const k = cles.filter(x => (EDT_VUE.cellules[x] || {}).classeMjpc === '4E BANKSY')[0] || cles[0];
      edtCaseClic(k);
      const m = document.getElementById('edt-modale');
      const bloc = m ? Array.from(m.querySelectorAll('.edt-rappel'))[0] : null;
      res({ bandeau: tete ? (tete.innerText.match(/\d+ heures? à replacer/) || ['(rien)'])[0] : '(pas de tête)',
        aReplacer: edtHeuresAReplacer(null).map(u => u.classe + ' ' + u.iso + ' ' + u.creneau + ' · prise par ' + u.prisePar),
        vueDeLaClasse: bloc ? bloc.innerText.replace(/\n+/g, ' | ').slice(0, 160) : '(aucun rappel)',
        boutons: bloc ? Array.from(bloc.querySelectorAll('button')).map(b => b.innerText.trim()) : [] });
    }, 1200); }); }));
console.log('   au bandeau : ' + JSON.stringify(rappel.bandeau));
console.log('   la liste : ' + JSON.stringify(rappel.aReplacer));
console.log('   dans la vue de la classe : ' + JSON.stringify(rappel.vueDeLaClasse));
console.log('   boutons offerts : ' + JSON.stringify(rappel.boutons));

/* ⑦.8 · aucune trace touchée */
const traceApres = await page.evaluate(() => JSON.stringify(window.__HUB.site['3e'] || {}));
console.log('\n   ⑦.8 · les contenus (séances, activités, traces) : ' + traceAvant.length + ' caractères avant, '
  + traceApres.length + ' après · identiques : ' + (traceAvant === traceApres));

/* ⑦.6 · perte sèche, par CLIC sur le bouton du rappel */
const perte = await page.evaluate(() => new Promise(res => {
  const avant = edtHeuresJustifiees('4E BANKSY');
  window.__ECR.length = 0;
  const m = document.getElementById('edt-modale');
  const b = Array.from(m.querySelectorAll('.edt-rappel button')).filter(x => /pas rendue/.test(x.textContent))[0];
  if (!b) { res({ erreur: 'bouton absent' }); return; }
  b.click();
  setTimeout(() => {
    const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})['4E BANKSY'] || {};
    const k = Object.keys(dec.heures || {})[0];
    res({ compteAvant: avant, compteApres: edtHeuresJustifiees('4E BANKSY'),
      valeur: k ? { motif: edtMotifDe(dec.heures[k]), justifiee: dec.heures[k].justifiee,
        basculable: edtBasculable(dec.heures[k]), aReplacer: !!dec.heures[k].aReplacer } : null,
      restantAReplacer: edtHeuresAReplacer(null).length, ecritures: window.__ECR.slice() }); }, 1100); }));
console.log('\n   ⑦.6 · perte sèche (clic) : ' + JSON.stringify(perte));
await page.close();

/* ⑦.7 · ce qui se déplace et ce qui ne se déplace pas */
console.log('\n══════ ⑦.7 · TRACE EXISTANTE, HEURE DU JOUR, TRACE VIDE ══════');
page = await ouvrir();
const t7 = await page.evaluate(() => {
  const cel = EDT_VUE.cellules || {};
  const parNature = {};
  Object.keys(cel).forEach(k => { const n = cel[k].nature; (parNature[n] = parNature[n] || []).push(k); });
  const saisissable = k => !!Array.from(document.querySelectorAll('#edt-ecran .edt-clic'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf(k) >= 0)
    .filter(x => { const c = edtCellule(k); return c && c.nature === 'prevu'; })[0];
  const jouee = (parNature['jouee'] || [])[0] || null;
  const prevu = (parNature['prevu'] || [])[0] || null;
  return { natures: Object.keys(parNature).map(n => n + ':' + parNature[n].length),
    heureJouee: jouee, jouéeDeplacable: jouee ? saisissable(jouee) : '(aucune heure jouée dans cette semaine)',
    heureDuJour: prevu, duJourDeplacable: prevu ? !!saisissable(prevu) : null }; });
console.log('   ' + JSON.stringify(t7));
await page.close();
await nav.close();

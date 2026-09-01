/* BANC ③b — LE DIFFÉRENTIEL NOMINATIF ET LA CLASSE RENOMMÉE.
   Faux hub REST, aucune requête ne sort. Session prof par admin-mode (déclaré).
   Usage : node tests/banc-differentiel-03b.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';

const hub = classes => ({ classes: classes || J('hub-classes.json'),
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

async function ouvrir(classes) {
  const page = await nav.newPage();
  page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
  await page.evaluateOnNewDocument(faux, hub(classes));
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1500);
  /* le PANNEAU prof (c'est lui qui porte l'écran d'injection), pas la grille */
  await page.evaluate(() => { document.getElementById('tprof-btn').click(); });
  await pause(700);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
  await pause(1200);
  await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  return page;
}

/* ═══ ⑥.8 · LE DIFFÉRENTIEL NOMINATIF, AVANT LE GESTE ════════════════════ */
console.log('\n══════ ⑥.8 · LE DIFFÉRENTIEL DANS L\'ÉCRAN DE VÉRIFICATION ══════');
let page = await ouvrir();
/* on coche d'abord deux événements : leurs coches doivent apparaître au différentiel */
await page.evaluate(() => new Promise(res => {
  const cal = EDT.calendrier;
  const a = (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  const b = (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Visite des lycées') >= 0)[0];
  edtJustifier(a.id, true);
  setTimeout(() => { edtJustifier(b.id, true); setTimeout(res, 900); }, 900); }));
const coches = await page.evaluate(c => ({ heures: edtHeuresJustifiees(c) }), CLASSE);
console.log('   préparation : ' + JSON.stringify(coches) + ' heure(s) cochée(s)');

const diff = await page.evaluate(neuf => {
  const o = JSON.parse(JSON.stringify(neuf));
  ['evenementsClasse', 'jalons', 'etablissement', 'feries', 'vacances'].forEach(f =>
    (o[f] || []).forEach(e => { delete e.id; }));
  const a = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  a.libelle = 'Séjour à Verdun 3e';                                  /* faible : libellé retouché */
  const b = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Stages 3e (uniquement') >= 0)[0];
  b.debut = '2026-11-17'; b.fin = '2026-11-17';                      /* faible : date déplacée */
  o.evenementsClasse = o.evenementsClasse.filter(e => (e.libelle || '').indexOf('Visite des lycées') < 0);  /* disparaît, coché */
  o.evenementsClasse.push({ debut: '2027-05-12', fin: '2027-05-12', libelle: 'Sortie théâtre 3e', niveau: '3e', classes: [] });
  /* on passe par le chemin réel : le texte est collé, puis vérifié */
  edtInjOuvrir('calendrier');
  const z2 = document.getElementById('edt-inj-coller');
  if (z2) z2.value = JSON.stringify(o);
  window.__ECR.length = 0;
  edtInjVerifier('calendrier');
  const bloc = document.querySelector('.edt-diff');
  return { texte: bloc ? bloc.innerText.replace(/\n+/g, ' | ') : '(pas de différentiel affiché)',
    ecrituresALaVerification: window.__ECR.slice(),
    boutonInjecter: !!Array.from(document.querySelectorAll('button')).filter(x => x.textContent === 'Injecter')[0] };
}, J('calendrier-2026-2027.json'));
console.log('   écritures à la vérification : ' + JSON.stringify(diff.ecrituresALaVerification)
  + ' · bouton « Injecter » présent : ' + diff.boutonInjecter);
console.log('   ── DIFFÉRENTIEL AFFICHÉ ──\n   ' + diff.texte.replace(/ \| /g, '\n   '));
await page.close();

/* ═══ ⑥.10 · LA CLASSE RENOMMÉE ════════════════════════════════════════ */
console.log('\n══════ ⑥.10 · LA CLASSE RENOMMÉE ══════');
page = await ouvrir();
await page.evaluate(() => new Promise(res => {
  const cal = EDT.calendrier;
  const a = (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  edtJustifier(a.id, true); setTimeout(res, 900); }));
const avantR = await page.evaluate(c => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {});
  return { sousAncien: Object.keys((dec[c] || {}).heures || {}).length, heures: edtHeuresJustifiees(c) }; }, CLASSE);
console.log('   avant renommage : ' + JSON.stringify(avantR));

/* la classe est renommée au hub : /classes et la grille portent le nouveau nom */
const r10 = await page.evaluate((ancien, nouveau) => new Promise(res => {
  const cls = window.__HUB.classes;
  cls[nouveau] = cls[ancien]; delete cls[ancien];
  const g = window.__HUB.site.edt.grille['2026-2027'];
  (g.creneaux || []).forEach(c => { if (c.classeMjpc === ancien) c.classeMjpc = nouveau; });
  edtChargerClasses(() => edtCharger(() => {
    edtPeindrePanneau();
    const bloc = Array.from(document.querySelectorAll('.edt-bloc'))
      .filter(x => (x.innerText || '').indexOf('nom de classe') >= 0)[0];
    res({ orphelines: edtDecisionsOrphelines(),
      encart: bloc ? bloc.innerText.replace(/\n+/g, ' | ').slice(0, 240) : '(aucun encart)',
      comptes: { ancien: edtHeuresJustifiees(ancien), nouveau: edtHeuresJustifiees(nouveau) } });
  })); }), CLASSE, '3E CHARLES DE GAULLE');
console.log('   orphelines détectées : ' + JSON.stringify(r10.orphelines.map(o => ({ ancien: o.ancien, heures: o.heures, candidates: o.candidates }))));
console.log('   encart affiché : ' + JSON.stringify(r10.encart));
console.log('   comptes : ' + JSON.stringify(r10.comptes));

/* refus */
const refus = await page.evaluate((a, n) => new Promise(res => {
  window.__ECR.length = 0;
  edtRattacherGeste(a, n);
  setTimeout(() => {
    const m = document.getElementById('at-modale');
    const texte = m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 200) : null;
    const b = m && Array.from(m.querySelectorAll('button')).filter(x => /Laisser/.test(x.textContent))[0];
    if (b) b.click();
    setTimeout(() => {
      const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {});
      res({ question: texte, ecritures: window.__ECR.slice(),
        sousAncien: Object.keys((dec[a] || {}).heures || {}).length,
        sousNouveau: Object.keys((dec[n] || {}).heures || {}).length,
        ditApres: (document.querySelector('.at-modale-m') || {}).innerText || null });
    }, 700); }, 700); }), CLASSE, '3E CHARLES DE GAULLE');
console.log('\n   ── PROPOSITION ──\n   ' + JSON.stringify(refus.question));
console.log('   après REFUS : ' + JSON.stringify({ ecritures: refus.ecritures, sousAncien: refus.sousAncien,
  sousNouveau: refus.sousNouveau, ditApres: refus.ditApres }));

/* acceptation */
const accept = await page.evaluate((a, n) => new Promise(res => {
  window.__ECR.length = 0;
  edtRattacherGeste(a, n);
  setTimeout(() => {
    const m = document.getElementById('at-modale');
    const b = m && Array.from(m.querySelectorAll('button')).filter(x => /Rattacher/.test(x.textContent))[0];
    if (b) b.click();
    setTimeout(() => {
      const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {});
      res({ ecritures: window.__ECR.slice(),
        sousAncien: Object.keys((dec[a] || {}).heures || {}).length,
        sousNouveau: Object.keys((dec[n] || {}).heures || {}).length,
        journal: ((dec[n] || {}).journal || []).map(x => x.quoi),
        comptes: { ancien: edtHeuresJustifiees(a), nouveau: edtHeuresJustifiees(n) },
        dit: (document.querySelector('.at-modale-m') || {}).innerText || null });
    }, 900); }, 700); }), CLASSE, '3E CHARLES DE GAULLE');
console.log('   après ACCEPTATION : ' + JSON.stringify(accept));
await page.close();
await nav.close();

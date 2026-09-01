/* BANC ②a — LA COCHE SORT DE L'OBJET INJECTÉ.
   Faux hub REST (evaluateOnNewDocument + fetch détourné) : aucune requête ne sort.
   Session prof : document.body.classList.add('admin-mode') — déclaré, comme dans
   tests/banc-2b.mjs. Le voile fi-overlay est retiré pour que les clics passent.
   Usage : node tests/banc-coche-02a.mjs <index.html> [calendrier.json] */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const CAL = process.argv[3] || 'calendrier-herite-justifie.json';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';
const EVT = 'Séjour Verdun 3e';

const store = { classes: J('hub-classes.json'), site: { '3e': J('hub-site3e.json'),
  config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-appariee.json') },
    calendrier: { '2026-2027': J(CAL) },
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
const erreurs = []; page.on('pageerror', e => erreurs.push(String(e).slice(0, 110)));
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 1100));
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });

await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtCharger(r)));
await page.evaluate(() => { edtOuvrir(); });
await pause(1200);
await nettoyer();

console.log('version : ' + await page.evaluate(() => APP_VERSION));

/* ─── état de départ ─────────────────────────────────────────────────────── */
const mesure = () => page.evaluate(c => {
  const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
  const dec = (window.__HUB.site.edt.decisions || {})['2026-2027'] || null;
  const h = dec && dec[c] ? Object.keys(dec[c].heures || {}) : [];
  const dv = edtDivergence(c);
  return { justifieDansCalendrier: (cal.evenementsClasse || []).filter(e => 'justifie' in e).length,
    cochesDansCalendrier: (cal.evenementsClasse || []).filter(e => e.justifie).length,
    heuresDansMagasin: h.length, clefs: h,
    heuresJustifiees: edtHeuresJustifiees(c),
    ecart: dv ? { ecart: dv.ecart, brut: dv.brut, justifieEcart: dv.justifieEcart } : null,
    ecritures: window.__ECR.slice() }; }, CLASSE);

const depart = await mesure();
console.log('\n══ DÉPART ══');
console.log('  calendrier : ' + depart.justifieDansCalendrier + ' événements portant le champ, '
  + depart.cochesDansCalendrier + ' cochés · magasin : ' + depart.heuresDansMagasin + ' heure(s)');
console.log('  heures justifiées de ' + CLASSE + ' : ' + depart.heuresJustifiees
  + ' · écart : ' + JSON.stringify(depart.ecart));

/* ─── ⑥.2 · cocher l'écart PAR CLIC dans la vue Calendrier ───────────────── */
await page.evaluate(() => { edtVue('calendrier'); });
await pause(700); await nettoyer();
await page.evaluate(() => { window.__ECR.length = 0; });
/* [⑤a] l'écran a changé : une case par HEURE, dans la fiche de l'événement.
   On coche donc toutes les heures de sa fiche — deux clics au lieu d'un. */
const cible = await page.evaluate(lib => {
  const f = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'))
    .filter(x => (x.innerText || '').indexOf(lib) >= 0)[0];
  if (!f) return null;
  const cases = Array.from(f.querySelectorAll('label input[type=checkbox]'));
  return { texte: (f.innerText || '').trim().replace(/\n/g, ' | ').slice(0, 90),
    coche: cases.every(b => b.checked), cases: cases.length,
    points: cases.map(b => { const r = b.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }) };
}, EVT);
console.log('\n══ ⑥.2 · COCHER « ' + EVT +' » (clic réel sur la case) ══');
console.log('  case trouvée : ' + JSON.stringify(cible));
if (cible) { for (const p of cible.points) { await page.mouse.click(p.x, p.y); await pause(700); } }

const apres = await mesure();
console.log('  écritures du geste : ' + JSON.stringify(apres.ecritures));
console.log('  décisions posées : ' + apres.heuresDansMagasin + ' → ' + JSON.stringify(apres.clefs));
console.log('  contenu d\'une décision : ' + JSON.stringify(await page.evaluate(c => {
  const dec = (window.__HUB.site.edt.decisions || {})['2026-2027'] || {};
  const h = (dec[c] || {}).heures || {}; const k = Object.keys(h)[0];
  return k ? { cle: k, valeur: h[k] } : null; }, CLASSE)));
console.log('  calendrier au hub : ' + apres.justifieDansCalendrier + ' champ, ' + apres.cochesDansCalendrier + ' coché(s)');
console.log('  case cochée à l\'écran après le clic : ' + await page.evaluate(lib => {
  const f = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche'))
    .filter(x => (x.innerText || '').indexOf(lib) >= 0)[0];
  if (!f) return '(fiche introuvable)';
  const c = Array.from(f.querySelectorAll('label input')); 
  return c.length ? c.every(b => b.checked) : '(aucune case)'; }, EVT));
console.log('  heures justifiées : ' + depart.heuresJustifiees + ' → ' + apres.heuresJustifiees
  + ' · écart : ' + JSON.stringify(apres.ecart));
console.log('  journal du magasin : ' + JSON.stringify(await page.evaluate(c => {
  const dec = (window.__HUB.site.edt.decisions || {})['2026-2027'] || {};
  return ((dec[c] || {}).journal || []).map(x => ({ quoi: x.quoi, heure: x.heure, avant: x.avant, apres: x.apres && Object.keys(x.apres) })); }, CLASSE)));

/* ─── ⑥.7 · une heure, une clé, un seul motif ────────────────────────────── */
console.log('\n══ ⑥.7 · DEUX MOTIFS SUR LA MÊME HEURE ══');
const r7 = await page.evaluate((c, ev) => {
  /* l'heure visée : la première heure que l'événement coché recouvre — mesurée
     de la même façon sur les deux versions, magasin ou pas. */
  const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
  const e = (cal.evenementsClasse || []).filter(x => (x.libelle || '').indexOf(ev) >= 0)[0];
  let iso = null, creneau = null;
  for (let d = e.debut; d <= (e.fin || e.debut) && !iso; d = edtPlusJour(d, 1))
    edtCasesDuJour(d).forEach(x => { if (!iso && x && x.classeMjpc === c) { iso = d; creneau = x.creneau; } });
  if (!iso) return { erreur: 'aucune heure de la classe sous cet événement' };
  const k = edtCleHeure(iso, creneau, c);
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = iso; edtPeindre();
  const cle = iso + '|' + creneau + '|' + Object.keys(EDT_VUE.cellules || {})
    .filter(x => x.indexOf(iso + '|' + creneau) === 0).map(x => x.split('|')[2])[0];
  window.__ECR.length = 0;
  edtSansSeance(cle);                       /* appel de fonction, pas un clic : déclaré */
  const mod = document.getElementById('at-modale');
  return { heure: k, cleCellule: cle, modale: mod ? mod.innerText.replace(/\n+/g, ' | ').slice(0, 220) : null,
    ecrituresAvantReponse: window.__ECR.slice() }; }, CLASSE, EVT);
console.log('  ' + JSON.stringify(r7));
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Remplacer/.test(x.textContent))[0]; if (b) b.click(); });
await pause(800);
const fin = await mesure();
console.log('  après « Remplacer le motif » : ' + JSON.stringify(await page.evaluate((c, k) => {
  const dec = (window.__HUB.site.edt.decisions || {})['2026-2027'] || {};
  return { valeur: ((dec[c] || {}).heures || {})[k],
    journal: ((dec[c] || {}).journal || []).slice(-1).map(x => ({ quoi: x.quoi,
      avant: x.avant && Object.keys(x.avant), apres: x.apres && Object.keys(x.apres) })) }; }, CLASSE, r7.heure)));
console.log('  heures justifiées : ' + apres.heuresJustifiees + ' → ' + fin.heuresJustifiees
  + '  (l\'heure ne compte qu\'une fois)');
console.log('  écritures du second geste : ' + JSON.stringify(fin.ecritures));

console.log('\nerreurs de page : ' + (erreurs.length ? JSON.stringify(erreurs) : 'aucune'));
await nav.close();

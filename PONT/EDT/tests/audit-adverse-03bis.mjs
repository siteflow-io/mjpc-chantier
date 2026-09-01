/* AUDIT ADVERSE — LOT 2ter ③bis §⑤.11. On cherche ce qui casse.
   Usage : node tests/audit-adverse-03bis.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const ESSAI = '3E Charles de Gaulle';

const hub = grille => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': grille || J('grille-2026-2027.json') },
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

async function cas(titre, code, attendu, grille) {
  const page = await nav.newPage();
  const erreurs = []; page.on('pageerror', e => erreurs.push(String(e).slice(0, 100)));
  await page.evaluateOnNewDocument(faux, hub(grille));
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1500);
  await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await pause(500);
  let r;
  try { r = await page.evaluate(c => new Promise(res => { window.__ECR.length = 0; eval('(' + c + ')(res)'); }), code.toString()); }
  catch (e) { r = { erreur: String(e).slice(0, 90) }; }
  console.log('\n■ ' + titre);
  console.log('   attendu : ' + attendu);
  console.log('   mesuré  : ' + JSON.stringify(r));
  if (erreurs.length) console.log('   ⚠ erreurs de page : ' + JSON.stringify(erreurs));
  await page.close();
}

await cas('MODE TEST ALLUMÉ PENDANT UNE INJECTION', fini => {
  window.M8_TEST = true;
  const o = JSON.parse(JSON.stringify(EDT.grille));
  delete o.creneauxFictifs;                       /* le JSON collé n'en parle pas */
  EDT_INJ = { voie: 'grille', objet: o, messages: [] };
  edtInjInjecter('grille');
  setTimeout(() => {
    const g = window.__HUB.site.edt.grille['2026-2027'] || {};
    fini({ fictifsAuHub: (g.creneauxFictifs || []).length,
      fictifsLus: edtCasesA('2026-11-16').filter(c => c.fictif).length,
      creneaux: (g.creneaux || []).length, ecritures: window.__ECR.slice() }); }, 1400);
}, 'la classe d\'essai suit le JSON injecté ; rien ne casse, rien ne se mélange aux vrais créneaux');

await cas('UN TROU FICTIF DEVENU OCCUPÉ PAR UNE VRAIE CLASSE', fini => {
  window.M8_TEST = true;
  const g = EDT.grille;
  (g.creneaux || []).push({ jour: 'lundi', creneau: '08:00-08:55', semaine: 'AB',
    classe: '4 HUGO', mjpc: true, classeMjpc: '4E BANKSY' });
  edtPeindre();
  const cases = edtCasesA('2026-11-16').filter(c => c.jour === 'lundi' && c.creneau === '08:00-08:55');
  fini({ surLeTrou: cases.map(c => (c.classeMjpc || c.classe) + (c.fictif ? ' (essai)' : '')),
    total: edtCasesA('2026-11-16').length });
}, 'les deux cohabitent, la vraie classe n\'est ni masquée ni écrasée');

await cas('DEUX CRÉNEAUX FICTIFS SUR LE MÊME TROU', fini => {
  window.M8_TEST = true;
  const g = EDT.grille;
  (g.creneauxFictifs || []).push(JSON.parse(JSON.stringify((g.creneauxFictifs || [])[0])));
  const n = edtPoserIdsObjet('grille', g);
  const f = (g.creneauxFictifs || []);
  fini({ posesSupplementaires: n, ids: f.map(c => c.id),
    distincts: new Set(f.map(c => c.id)).size, total: f.length,
    lus: edtCasesA('2026-11-16').filter(c => c.fictif).length });
}, 'le doublon reçoit son propre identifiant, aucune collision');

await cas('BASCULE DU MODE TEST PENDANT QU\'UNE MODALE EST OUVERTE', fini => {
  const cles = Object.keys(EDT_VUE.cellules || {});
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = '2026-11-16'; edtPeindre();
  const k = Object.keys(EDT_VUE.cellules || {})[0];
  if (k) edtCaseClic(k);
  const ouverte = !!document.getElementById('edt-modale');
  window.M8_TEST = true; edtPeindre();
  setTimeout(() => fini({ modaleAvant: ouverte, modaleApres: !!document.getElementById('edt-modale'),
    cases: Object.keys(EDT_VUE.cellules || {}).length, ecritures: window.__ECR.slice() }), 600);
}, 'aucune casse, aucune écriture');

await cas('UN id MENTEUR QUI EST AUSSI UN id EN SERVICE DANS SA VRAIE FAMILLE', fini => {
  const per = ((EDT.periodes || {}).periodes || [])[0];
  const idPeriode = per ? per.id : 'per:AUCUNE';
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  const a = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  a.id = idPeriode;                                /* un identifiant de PÉRIODE, bien vivant */
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  setTimeout(() => {
    const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
    const v = (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
    const p = (((window.__HUB.site.edt.periodes || {})['2026-2027'] || {}).periodes || [])[0];
    fini({ idPeriodeAvant: idPeriode, idEvenementApres: v ? v.id : null,
      idPeriodeApres: p ? p.id : '(pas de périodes au hub)',
      menteurs: ((EDT.diffInjection || {}).menteurs || []).map(m => m.id) }); }, 1400);
}, 'l\'identifiant de la période n\'est pas volé : l\'événement en reçoit un neuf, correct');

const dat = JSON.parse(JSON.stringify(J('grille-2026-2027.json')));
dat.versions = [{ debut: '2026-08-01', libelle: 'rentrée', creneaux: dat.creneaux }];
delete dat.creneaux;
await cas('LA GRILLE EN FORME DATÉE AVEC DES FICTIFS', fini => {
  window.M8_TEST = true;
  const g = EDT.grille;
  fini({ formeDatee: Array.isArray(g.versions), versions: (g.versions || []).length,
    fictifsAuHub: (g.creneauxFictifs || []).length,
    lus: edtCasesA('2026-11-16').length,
    fictifsLus: edtCasesA('2026-11-16').filter(c => c.fictif).length,
    idsFictifs: (g.creneauxFictifs || []).map(c => c.id) });
}, 'les fictifs restent lus : ils ne vivent pas dans les versions', dat);

await nav.close();

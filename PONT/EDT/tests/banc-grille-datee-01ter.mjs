/* BANC ①ter-a — L'IDENTITÉ DES CRÉNEAUX DANS LA GRILLE DATÉE.
   Méthode reprise de tests/banc-versions.mjs (LOT 2bis) : faux hub REST posé par
   evaluateOnNewDocument, `fetch` détourné — aucune requête ne sort, et le site
   travaille exactement comme en vrai (lectures ET écritures passent par le hub).
   Usage : node tests/banc-grille-datee-01ter.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const GRILLE = JSON.parse(fs.readFileSync('grille-appariee.json', 'utf8'));

const store = {};
const poser = (c, v) => { const p = c.split('/').filter(Boolean); let n = store;
  for (let k = 0; k < p.length - 1; k++) { if (typeof n[p[k]] !== 'object') n[p[k]] = {}; n = n[p[k]]; }
  n[p[p.length - 1]] = v; };
poser('site/edt/grille/2026-2027', JSON.parse(JSON.stringify(GRILLE)));

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true
});
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 768 });
await page.evaluateOnNewDocument(s => {
  window.__HUB = JSON.parse(JSON.stringify(s));
  window.__ECRITURES = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; }
    return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; }
    if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) {
    const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) {
      const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECRITURES.push(c); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 }));
    }
    return Promise.resolve(new Response('null', { status: 200 }));
  };
}, store);
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 900));
await page.evaluate(() => new Promise(r => edtCharger(r)));
/* l'écran de l'emploi du temps doit être OUVERT : c'est lui qui remplit
   EDT_VUE.cellules, d'où edtCellule tire les cases (méthode de tests/banc-versions.mjs). */
await page.evaluate(() => { document.body.classList.add('admin-mode'); edtOuvrir(); });
await new Promise(r => setTimeout(r, 1200));

const ids = v => v.map(c => c.id || 'PAS D\'ID');
const lireHub = () => page.evaluate(() => {
  const g = window.__HUB.site.edt.grille['2026-2027'];
  return { forme: Array.isArray(g.versions) ? 'datée' : 'simple',
    versions: (g.versions || []).map(v => ({ debut: v.debut, ids: (v.creneaux || []).map(c => c.id || null) })),
    racine: (g.creneaux || []).map(c => c.id || null) };
});

console.log('\n═══ ⑤.1 · POSE, forme simple puis forme datée ═══');
const t0 = await page.evaluate(() => {
  const o = EDT.grille;
  return { formeAuDepart: Array.isArray(o.versions) ? 'datée' : 'simple',
    creneaux: (o.creneaux || []).length,
    idsRacine: (o.creneaux || []).map(c => c.id || null),
    reposeEnSimple: edtPoserIdsObjet('grille', o) };
});
console.log('  forme au chargement : ' + t0.formeAuDepart + ' · ' + t0.creneaux + ' créneaux');
console.log('  identifiants posés au chargement : ' + t0.idsRacine.filter(Boolean).length + '/' + t0.creneaux
  + ' · une seconde pose repose : ' + t0.reposeEnSimple);
console.log('  cinq premiers : ' + t0.idsRacine.slice(0, 5).join(' · '));

const t1 = await page.evaluate(() => {
  edtVersionAjouter('2027-01-05', 'après les vacances de Noël');
  const o = EDT.grille;
  /* le cas réel du mandat : une grille DATÉE dont des créneaux n'ont pas d'identité
     (version arrivée d'ailleurs, créneau neuf). On retire trois id de chaque version. */
  o.versions.forEach(v => v.creneaux.slice(0, 3).forEach(c => { delete c.id; }));
  const manquantsAvantPose = o.versions.map(v => v.creneaux.filter(c => !c.id).length);
  const parVersion = o.versions.map(v => ({ debut: v.debut, n: v.creneaux.length,
    sansId: v.creneaux.filter(c => !c.id).length,
    ids: v.creneaux.map(c => c.id) }));
  const pose = edtPoserIdsObjet('grille', o);
  const apresPose = o.versions.map(v => ({ debut: v.debut, n: v.creneaux.length,
    sansId: v.creneaux.filter(c => !c.id).length, ids: v.creneaux.map(c => c.id) }));
  return { versions: o.versions.length, parVersion, manquantsAvantPose, reposeApres: pose,
    apresPose, racineEncore: Array.isArray(o.creneaux) };
});
console.log('\n  après edtVersionAjouter : ' + t1.versions + ' versions · racine `creneaux` encore là : ' + t1.racineEncore);
console.log('  créneaux privés de leur identifiant, par version : ' + JSON.stringify(t1.manquantsAvantPose));
console.log('  edtPoserIdsObjet(\'grille\') pose alors : ' + t1.reposeApres + ' identifiant(s)');
t1.apresPose.forEach(v => console.log('   version ' + v.debut + ' : ' + v.n + ' créneaux, '
  + v.sansId + ' sans identifiant, ' + new Set(v.ids.filter(Boolean)).size + ' identifiants distincts'));

console.log('\n═══ ⑤.2 · aucun identifiant en service touché, ⑤.3 · reconduction ═══');
const v1 = t1.apresPose[0].ids, v2 = t1.apresPose[1].ids;
const memes = v1.filter((x, i) => x === v2[i]).length;
console.log('  version 1 vs version 2, même rang : ' + memes + '/' + v1.length + ' identifiants identiques');
console.log('  identifiants suffixés #2 : ' + [...v1, ...v2].filter(x => /#\d/.test(x)).length);
const gardes = t0.idsRacine.filter((x, i) => v1[i] === x).length;
console.log('  identifiants de la version 1, identiques à la liste de départ : ' + gardes + '/' + t0.idsRacine.length
  + '  (les 27 non touchés + les 3 reposés, qui retombent sur la même amorce : le contenu n\'a pas changé)');

console.log('\n═══ ⑤.4 · unicité DANS une version ═══');
t1.apresPose.forEach(v => console.log('   version ' + v.debut + ' : ' + v.n + ' créneaux → '
  + new Set(v.ids.filter(Boolean)).size + ' identifiants distincts'));

console.log('\n═══ ⑤.4bis · MÊME identifiant deux fois DANS une version ═══');
const t15 = await page.evaluate(() => {
  const o = EDT.grille, v = o.versions[o.versions.length - 1];
  const vole = v.creneaux[0].id;
  v.creneaux[1].id = vole;                       /* deux créneaux différents, un seul identifiant */
  const avant = { partage: vole, portéPar: v.creneaux.filter(c => c.id === vole).length };
  const pose = edtPoserIdsObjet('grille', o);
  const v2 = EDT.grille.versions[EDT.grille.versions.length - 1];
  return { avant, pose, premier: v2.creneaux[0].id, second: v2.creneaux[1].id,
    distincts: new Set(v2.creneaux.map(c => c.id)).size, total: v2.creneaux.length,
    suffixes: v2.creneaux.filter(c => /#\d/.test(c.id || '')).length };
});
console.log('  ' + JSON.stringify(t15));

console.log('\n═══ ⑤.5 · créneau DÉPLACÉ : identifiant conservé ═══');
const t2 = await page.evaluate(() => {
  const o = EDT.grille, v = o.versions[o.versions.length - 1];
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = '2027-01-11'; edtPeindre();
  const cles = Object.keys(EDT_VUE.cellules || {});
  const src = k => { const x = EDT_VUE.cellules[k];
    return (v.creneaux || []).filter(y => y.jour === edtNomDuJour(x.iso) && y.creneau === x.creneau
      && (y.classeMjpc || y.classe) === (x.classeMjpc || x.classe))[0] || null; };
  /* une case dont le créneau PORTE un identifiant : c'est lui qui doit survivre au déplacement */
  const cle = cles.filter(k => { const y = src(k); return y && y.id; })[0] || cles[0];
  const c = edtCellule(cle);
  if (!c) return { erreur: 'aucune case peinte', cles: cles.slice(0, 5) };
  const source = src(cle) || {};
  const avant = { cle: cle, id: source.id || 'PAS D\'ID', jour: source.jour, creneau: source.creneau, classe: source.classe };
  edtChangerEmploiDuTemps(cle, '2027-01-14', '14:00-14:55', '2027-02-01');
  const o2 = EDT.grille, vf = o2.versions.filter(x => x.debut === '2027-02-01')[0];
  const trouve = (vf.creneaux || []).filter(x => x.jour === 'jeudi' && x.creneau === '14:00-14:55');
  return { avant, versions: o2.versions.length,
    apres: trouve.map(x => ({ id: x.id || 'PAS D\'ID', jour: x.jour, creneau: x.creneau, classe: x.classe })),
    sansId: (vf.creneaux || []).filter(x => !x.id).length,
    distincts: new Set((vf.creneaux || []).map(x => x.id)).size, total: (vf.creneaux || []).length };
});
console.log('  AVANT : ' + JSON.stringify(t2.avant));
console.log('  APRÈS : ' + JSON.stringify(t2.apres) + (t2.erreur ? ' · ' + t2.erreur : ''));
console.log('  version d\'arrivée : ' + t2.total + ' créneaux, ' + t2.sansId + ' sans identifiant, '
  + t2.distincts + ' distincts');

console.log('\n═══ ⑤.6 · créneau NEUF (source non retrouvée) ═══');
const t3 = await page.evaluate(() => {
  const o = EDT.grille, v = o.versions[o.versions.length - 1];
  /* on fabrique le cas : la cellule existe à l'écran, mais plus dans la version d'effet */
  EDT_VUE.mode = 'semaine'; EDT_VUE.ancre = '2027-01-11'; edtPeindre();
  const cles = Object.keys(EDT_VUE.cellules || {});
  const cle = cles.filter(k => (EDT_VUE.cellules[k] || {}).nature === 'prevu')[0] || cles[0];
  const c = edtCellule(cle);
  if (!c) return { erreur: 'aucune case peinte' };
  /* effet à une date où une version existe déjà SANS ce créneau */
  const eff = '2027-03-01';
  edtVersionAjouter(eff, 'version dépouillée');
  const vv = EDT.grille.versions.filter(x => x.debut === eff)[0];
  vv.creneaux = vv.creneaux.filter(x => !(x.jour === c.jour && x.creneau === c.creneau));
  const nAvant = vv.creneaux.length;
  edtChangerEmploiDuTemps(cle, '2027-03-04', '15:07-16:02', eff);
  const vf = EDT.grille.versions.filter(x => x.debut === eff)[0];
  const ne = (vf.creneaux || []).filter(x => x.jour === 'jeudi' && x.creneau === '15:07-16:02');
  return { nAvant, neuf: ne.map(x => ({ id: x.id || 'PAS D\'ID', classe: x.classe, jour: x.jour, creneau: x.creneau })),
    sansId: (vf.creneaux || []).filter(x => !x.id).length, total: (vf.creneaux || []).length,
    distincts: new Set((vf.creneaux || []).map(x => x.id)).size };
});
console.log('  ' + JSON.stringify(t3));

console.log('\n═══ écritures hub du banc ═══');
console.log('  ' + JSON.stringify(await page.evaluate(() => window.__ECRITURES)));
const fin = await lireHub();
console.log('  forme au hub : ' + fin.forme + ' · versions : '
  + fin.versions.map(v => v.debut + ' (' + v.ids.filter(Boolean).length + '/' + v.ids.length + ' avec id)').join(' · '));
await nav.close();

/* AUDIT ADVERSE — LOT 2ter ①ter §⑤.10.
   On ne cherche pas ce qui confirme : on cherche ce qui casse.
   Usage : node tests/audit-adverse-01ter.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setRequestInterception(true);
page.on('request', r => (r.url().startsWith('file://') ? r.continue() : r.abort()));
const erreurs = [];
page.on('pageerror', e => erreurs.push(String(e).slice(0, 120)));
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 700));

const c = (jour, creneau, classe) => ({ jour, creneau, semaine: 'AB', classe, mjpc: true });

const r = await page.evaluate(cs => {
  const bilan = [];
  const etat = o => (o.versions || (o.creneaux ? [{ debut: '(forme simple)', creneaux: o.creneaux }] : []))
    .map(v => { const l = (v && Array.isArray(v.creneaux)) ? v.creneaux.filter(x => x && typeof x === 'object') : [];
      return { debut: (v && v.debut) || '(version nulle)', n: l.length,
        sansId: l.filter(x => !x.id).length,
        distincts: new Set(l.map(x => x.id)).size,
        suffixes: l.filter(x => /#\d/.test(x.id || '')).length,
        ids: l.map(x => x.id) }; });
  const essai = (nom, o, attendu) => {
    let pose = null, boum = null;
    try { pose = edtPoserIdsObjet('grille', o); } catch (e) { boum = String(e).slice(0, 90); }
    bilan.push({ cas: nom, pose, casse: boum, etat: etat(o), attendu });
  };

  /* ① trois versions et plus, dont une reconduite à l'identique */
  const base = [cs.a, cs.b, cs.c];
  essai('trois versions, créneaux reconduits', { annee: '2026-2027', versions: [
    { debut: '2026-08-01', creneaux: JSON.parse(JSON.stringify(base)) },
    { debut: '2026-11-03', creneaux: JSON.parse(JSON.stringify(base)) },
    { debut: '2027-01-05', creneaux: JSON.parse(JSON.stringify(base)) }] },
    '3 posés par version, mêmes identifiants d\'une version à l\'autre, 0 suffixe');

  /* ② une version vide */
  essai('une version vide', { annee: '2026-2027', versions: [
    { debut: '2026-08-01', creneaux: JSON.parse(JSON.stringify(base)) },
    { debut: '2026-11-03', creneaux: [] }] }, 'aucune casse, 0 créneau dans la vide');

  /* ③ deux versions à la même date */
  essai('deux versions à la même date', { annee: '2026-2027', versions: [
    { debut: '2026-11-03', creneaux: JSON.parse(JSON.stringify(base)) },
    { debut: '2026-11-03', creneaux: JSON.parse(JSON.stringify(base)) }] },
    'chaque version traitée pour elle-même, identifiants identiques, 0 suffixe');

  /* ④ un créneau présent dans la version 1, absent de la 2 */
  essai('créneau retiré de la seconde version', { annee: '2026-2027', versions: [
    { debut: '2026-08-01', creneaux: JSON.parse(JSON.stringify(base)) },
    { debut: '2026-11-03', creneaux: JSON.parse(JSON.stringify([cs.a, cs.c])) }] },
    'les survivants gardent leur identifiant, aucun report du disparu');

  /* ⑤ le même identifiant deux fois DANS une version */
  const dbl = JSON.parse(JSON.stringify(base));
  dbl[0].id = 'crn:PARTAGE'; dbl[1].id = 'crn:PARTAGE';
  essai('même identifiant deux fois dans une version', { annee: '2026-2027', versions: [
    { debut: '2026-08-01', creneaux: dbl }] }, 'le premier garde, le second reçoit le sien');

  /* ⑥ grille encore en forme simple */
  essai('forme simple (pas de versions)', { annee: '2026-2027', creneaux: JSON.parse(JSON.stringify(base)) },
    'comportement d\'avant, 3 posés');

  /* ⑦ versions absurdes : null, sans creneaux, creneaux qui n'est pas un tableau */
  essai('versions absurdes', { annee: '2026-2027', versions: [
    null, { debut: '2026-09-01' }, { debut: '2026-10-01', creneaux: 'pas un tableau' },
    { debut: '2026-11-01', creneaux: [null, 42, { jour: 'lundi' }] }] }, 'aucune casse');

  /* ⑧ hub vide — l'état réel */
  essai('objet vide', {}, '0 posé, aucune casse');

  /* ⑨ un identifiant porté par un créneau ET par une période */
  const g = { annee: '2026-2027', versions: [{ debut: '2026-08-01', creneaux: JSON.parse(JSON.stringify(base)) }] };
  edtPoserIdsObjet('grille', g);
  const idCreneau = g.versions[0].creneaux[0].id;
  const p = { annee: '2026-2027', periodes: [{ id: idCreneau, rang: 1, nom: 'Trimestre 1' }, { rang: 2, nom: 'Trimestre 2' }] };
  const posesP = edtPoserIdsObjet('periodes', p);
  bilan.push({ cas: 'un identifiant de créneau donné à une période', pose: posesP, casse: null,
    etat: [{ creneau: idCreneau, periodes: p.periodes.map(x => x.id) }],
    attendu: 'familles distinctes : le site ne mélange pas, chaque objet garde le sien' });

  /* ⑩ deux poses de suite : rien ne bouge la seconde fois */
  const g2 = { annee: '2026-2027', versions: [{ debut: '2026-08-01', creneaux: JSON.parse(JSON.stringify(base)) }] };
  const p1 = edtPoserIdsObjet('grille', g2);
  const l1 = g2.versions[0].creneaux.map(x => x.id);
  const p2 = edtPoserIdsObjet('grille', g2);
  const l2 = g2.versions[0].creneaux.map(x => x.id);
  bilan.push({ cas: 'deux poses de suite', pose: p1 + ' puis ' + p2, casse: null,
    etat: [{ identiques: JSON.stringify(l1) === JSON.stringify(l2) }],
    attendu: 'la seconde pose ne pose rien et ne change rien' });

  return bilan;
}, { a: c('lundi', '08:57-09:52', '3 FRANKLIN'), b: c('mardi', '10:07-11:02', '4 HUGO'),
     c: c('jeudi', '14:00-14:55', '5 CURIE') });

r.forEach(x => {
  console.log('\n■ ' + x.cas);
  console.log('   attendu  : ' + x.attendu);
  console.log('   posés    : ' + x.pose + (x.casse ? '   ⚠ EXCEPTION : ' + x.casse : ''));
  console.log('   état     : ' + JSON.stringify(x.etat));
});
console.log('\nerreurs de page pendant l\'audit : ' + (erreurs.length ? JSON.stringify(erreurs) : 'aucune'));
await nav.close();

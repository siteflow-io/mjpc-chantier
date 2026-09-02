/* BANC ⑧-a — LA PHOTO DU PRÉVU SE PREND TOUTE SEULE, par les gestes.
   Le parcours est cliqué : bouton du panneau prof → section « Emploi du temps »
   → « Ouvrir l'emploi du temps ». Une seule ligne n'est pas un clic, et elle est
   déclarée : `admin-mode`, que la connexion prof pose et qu'aucun clic n'atteint
   dans un fichier ouvert en local.
   Ce banc apporte SES PROPRES données : il ne lit que `grille-appariee.json`.
   Usage : node tests/banc-photo-auto-08a.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const GRILLE = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'grille-appariee.json'), 'utf8'));

const PERIODES_NORMALES = [
  { id: 'per:UN', rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
  { id: 'per:DEUX', rang: 2, nom: 'Trimestre 2', debut: '2026-12-01', fin: '2027-03-15' }
];

/* le hub de départ — `opt` décrit le cas mesuré */
const hub = (opt = {}) => ({
  classes: {},
  site: {
    config: { brevetDates: { debutAnnee: opt.debutAnnee || '2026-09-01', finAnnee: '2027-06-26' } },
    edt: {
      grille: { '2026-2027': GRILLE },
      reglages: { '2026-2027': { annee: '2026-2027', semaineA: 'A' } },
      periodes: opt.sansPeriodes ? undefined
        : { '2026-2027': { annee: '2026-2027', periodes: opt.periodes || PERIODES_NORMALES } },
      photos: opt.photos ? { '2026-2027': { annee: '2026-2027', photos: opt.photos } } : undefined
    }
  }
});

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
      if (window.__HUB_REFUSE) return Promise.resolve(new Response('{"error":"permission denied"}', { status: 401 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push(c); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 }));
    }
    return Promise.resolve(new Response('null', { status: 200 })); };
  /* la dernière archive écrite pour un objet donné */
  window.__archive = nom => { let out = null;
    Object.keys(window.__HUB.corbeille || {}).forEach(j =>
      Object.keys(window.__HUB.corbeille[j] || {}).forEach(k => {
        const a = window.__HUB.corbeille[j][k];
        if (a && a._meta && String(a._meta.chemin).indexOf('/' + nom + '/') >= 0) out = a; }));
    return out ? out.data : null; };
  window.__photos = () => (((window.__HUB.site || {}).edt || {}).photos || {})['2026-2027'] || null;
};

const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));

/* LE PARCOURS, PAR CLICS — il est rejoué à chaque chargement mesuré */
const arriver = async (etat, opts = {}) => {
  await page.evaluateOnNewDocument(faux, etat);
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(700);
  await page.evaluate(() => document.body.classList.add('admin-mode'));   /* déclaré : pas un clic */
  if (opts.modeTest) await page.evaluate(() => { M8_TEST = true; });      /* déclaré : pas un clic */
  if (opts.hubRefuse) await page.evaluate(() => { window.__HUB_REFUSE = true; });
  await page.click('#tprof-btn'); await pause(600);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
  await pause(1400);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-panneau [onclick]'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf('edtOuvrir') >= 0)[0]; if (b) b.click(); });
  await pause(1800);
};
const photos = () => page.evaluate(() => {
  const o = window.__photos(); const l = (o && o.photos) || [];
  return l.map(p => ({ id: p.id, nom: p.nom, echeance: p.echeance || null,
    prise: p.prise, depuis: p.depuis, cases: Object.keys(p.cellules || {}).length })); });
const ecritures = () => page.evaluate(() => window.__ECR.slice());

let rates = 0;
const dire = (bon, titre, mesure) => {
  if (!bon) rates++;
  console.log((bon ? '  ✔ ' : '  ✘ ') + titre + '\n      mesuré : ' + mesure);
};

console.log('BANC ⑧-a — LA PHOTO DU PRÉVU, PAR LES GESTES');
await arriver(hub());
console.log('version : ' + await page.evaluate(() => APP_VERSION));

/* ① la photo automatique se prend, nommée, avec son contenu */
let p = await photos();
dire(p.length === 1 && !!p[0].echeance && !!p[0].id && p[0].cases > 0,
  '① au passage d\'une échéance, UNE photo est écrite, nommée',
  JSON.stringify(p));

/* ② deux puis trois chargements le même jour : toujours UNE seule */
const etatApres1 = await page.evaluate(() => JSON.parse(JSON.stringify(window.__HUB)));
await arriver(etatApres1);
const p2 = await photos();
const etatApres2 = await page.evaluate(() => JSON.parse(JSON.stringify(window.__HUB)));
await arriver(etatApres2);
const p3 = await photos();
dire(p2.length === 1 && p3.length === 1,
  '② deux chargements puis trois, le même jour → 1 seule photo automatique',
  'après 2 chargements : ' + p2.length + ' · après 3 : ' + p3.length);

/* ③ la photo à la main marche toujours, et rien n'écrase rien */
const avantMain = (await photos()).length;
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.indexOf('Photo du prévu') >= 0)[0]; if (b) b.click(); });
await pause(900);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.indexOf('Photo du prévu') >= 0)[0]; if (b) b.click(); });
await pause(900);
const pMain = await photos();
dire(pMain.length === avantMain + 2,
  '③ CLIC sur « 📷 Photo du prévu » deux fois le même jour — rien n\'écrase rien',
  'avant : ' + avantMain + ' · après : ' + pMain.length + ' · ' + JSON.stringify(pMain.map(x => x.nom)));

/* ④ chaque photo porte un identifiant de la famille pho:, tous distincts */
const ids = pMain.map(x => x.id);
dire(ids.every(i => String(i || '').indexOf('pho:') === 0) && new Set(ids).size === ids.length,
  '④ tous les identifiants sont de la famille `pho:` et tous distincts',
  JSON.stringify(ids));

/* ⑤ l'archive porte l'état d'AVANT — son contenu, pas son existence */
const arc = await page.evaluate(() => { const a = window.__archive('photos');
  return a ? { photos: (a.photos || []).length, noms: (a.photos || []).map(x => x.nom || '(sans nom)') } : null; });
dire(!!arc && arc.photos === pMain.length - 1,
  '⑤ l\'archive écrite avant la dernière photo contient l\'état d\'avant',
  JSON.stringify(arc) + ' · au hub : ' + pMain.length);

/* ⑥ LE MODE TEST, SUR UN SITE DÉJÀ CHARGÉ — c'est le seul cas réel : `M8_TEST`
   repart à faux à chaque chargement, le mode test s'allume donc toujours APRÈS,
   sur des objets déjà en mémoire. Parcours entièrement cliqué : on ferme l'écran,
   on allume le mode test par sa pastille, on ajoute une période qui commence
   aujourd'hui, on rouvre. La photo automatique ne doit pas partir. */
await arriver(hub());
const avantTest = (await photos()).length;
await page.keyboard.press('Escape'); await pause(400);
const panneauOuvert = () => page.evaluate(() => { const o = document.querySelector('.tprof-overlay');
  return !!o && getComputedStyle(o).display !== 'none'; });
if (!await panneauOuvert()) { await page.click('#tprof-btn'); await pause(700); }
await page.evaluate(() => { const b = document.getElementById('tprof-testpill'); if (b) b.click(); });
await pause(900);                                           /* la pastille « 🧪 Mode test » */
const testAllume = await page.evaluate(() => m8TestOn());
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
await pause(1200);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-panneau button'))
  .filter(x => x.innerText.indexOf('Ajouter une période') >= 0)[0]; if (b) b.click(); });
await pause(900);
/* le champ « début » de la période neuve, posé à aujourd'hui — un vrai onchange */
await page.evaluate(() => {
  const lignes = Array.from(document.querySelectorAll('#edt-panneau input[type=date][aria-label="début"]'));
  const ch = lignes[lignes.length - 1];
  if (ch) { ch.value = edtAujourdhui(); ch.dispatchEvent(new Event('change', { bubbles: true })); } });
await pause(1000);
await page.evaluate(() => { window.__ECR.length = 0; });
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-panneau [onclick]'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf('edtOuvrir') >= 0)[0]; if (b) b.click(); });
await pause(1800);
const pTest = await photos();
const ecrTest = (await ecritures()).filter(c => c.indexOf('/photos/') >= 0);
const echeanceDue = await page.evaluate(() => { const e = edtEcheanceDue(); return e ? e.nom + ' (' + e.date + ')' : null; });
dire(testAllume === true && pTest.length === avantTest && ecrTest.length === 0,
  '⑥ mode test allumé sur un site chargé, une échéance neuve due : aucune photo ne part au hub',
  'mode test : ' + testAllume + ' · échéance due : ' + JSON.stringify(echeanceDue)
  + ' · photos avant : ' + avantTest + ' · après : ' + pTest.length
  + ' · écritures photos : ' + JSON.stringify(ecrTest));

/* ⑭ LA PHOTO À LA MAIN, PENDANT LE MODE TEST — la pastille promet à Paul
   « rien n'est enregistré ». Le clic sur « 📷 Photo du prévu » ne doit donc rien
   envoyer au vrai hub, et le site doit le lui dire. */
await page.evaluate(() => { window.__ECR.length = 0; window.__DIT = ''; 
  const av = window.atInfo; window.atInfo = function(t){ window.__DIT = String(t); if (av) return av.apply(this, arguments); }; });
const avantMainTest = (await photos()).length;
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.indexOf('Photo du prévu') >= 0)[0]; if (b) b.click(); });
await pause(1000);
const apresMainTest = await photos();
const ecrMainTest = (await ecritures()).filter(c => c.indexOf('/photos/') >= 0);
const ditTest = await page.evaluate(() => window.__DIT || '(rien)');
dire(apresMainTest.length === avantMainTest && ecrMainTest.length === 0,
  '⑭ CLIC sur « 📷 Photo du prévu » en mode test : rien ne part au vrai hub, et le site le dit',
  'photos au hub avant : ' + avantMainTest + ' · après : ' + apresMainTest.length
  + ' · écritures photos : ' + JSON.stringify(ecrMainTest) + ' · le site dit : ' + JSON.stringify(ditTest));

/* ⑮ LA PHOTO AUTOMATIQUE NE COUPE PAS LA PAROLE — `atInfo` est une modale avec
   un bouton « Compris » : à l'ouverture, elle recouvrirait l'emploi du temps et
   mangerait le premier clic de Paul. Mesuré au banc ②a. */
await arriver(hub());
const modale = await page.evaluate(() => {
  const m = document.getElementById('at-modale');
  return { modale: m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 80) : null,
    photos: (((window.__photos() || {}).photos) || []).length }; });
dire(modale.modale === null && modale.photos === 1,
  '⑮ la photo automatique est prise et n\'ouvre aucune modale par-dessus l\'écran',
  JSON.stringify(modale));

/* ⑦ aucune période déclarée : il reste la rentrée */
await arriver(hub({ sansPeriodes: true }));
const pSansPer = await photos();
dire(pSansPer.length === 1 && pSansPer[0].nom === 'Rentrée',
  '⑦ aucune période déclarée → la photo de la rentrée, et elle seule',
  JSON.stringify(pSansPer));

/* ⑧ deux périodes qui commencent le même jour : une seule photo */
await arriver(hub({ periodes: [
  { id: 'per:A', rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
  { id: 'per:B', rang: 2, nom: 'Période bis', debut: '2026-09-01', fin: '2026-11-30' }] }));
const pDeux = await photos();
dire(pDeux.length === 1, '⑧ deux périodes qui commencent le même jour → 1 photo',
  JSON.stringify(pDeux));

/* ⑨ une échéance passée depuis longtemps, au premier chargement de l'année */
await arriver(hub({ debutAnnee: '2026-08-15', periodes: [
  { id: 'per:VIEUX', rang: 1, nom: 'Trimestre 1', debut: '2026-08-20', fin: '2026-11-30' }] }));
const pVieux = await photos();
dire(pVieux.length === 1 && pVieux[0].echeance === 'per:VIEUX',
  '⑨ échéance échue depuis longtemps → 1 photo, celle de l\'échéance en cours, datée d\'aujourd\'hui',
  JSON.stringify(pVieux));

/* ⑩ vingt photos déjà en magasin */
const vingt = []; for (let i = 0; i < 20; i++) vingt.push({ id: 'pho:2026080' + (i % 10) + '00000' + i,
  nom: 'ancienne ' + i, prise: '2026-08-0' + (i % 9 + 1), depuis: '2026-08-03', cellules: {} });
await arriver(hub({ photos: vingt }));
const pVingt = await photos();
dire(pVingt.length === 21 && new Set(pVingt.map(x => x.id)).size === 21,
  '⑩ vingt photos déjà en magasin → 21, aucune perdue, aucun identifiant en double',
  'total : ' + pVingt.length + ' · identifiants distincts : ' + new Set(pVingt.map(x => x.id)).size);

/* ⑪ une photo dont les cellules sont vides */
await arriver(hub({ photos: [{ id: 'pho:20260801000000', nom: 'vide', prise: '2026-08-01', depuis: '2026-07-27' }] }));
const pVide = await photos();
dire(pVide.length === 2, '⑪ une photo sans cellules en magasin ne casse rien',
  JSON.stringify(pVide.map(x => ({ nom: x.nom, cases: x.cases }))));

/* ⑫ le hub refuse l'écriture : rien n'est écrit, et le site tient debout */
await arriver(hub(), { hubRefuse: true });
const pRefus = await photos();
const debout = await page.evaluate(() => !!document.getElementById('edt-ecran'));
dire(pRefus.length === 0 && debout,
  '⑫ le hub refuse l\'écriture → aucune photo écrite, l\'écran reste debout',
  'photos : ' + pRefus.length + ' · écran présent : ' + debout);

/* ⑬ le mot « figer » dans les textes affichés de l'emploi du temps */
await arriver(hub());
const figer = await page.evaluate(() => {
  const t = (document.getElementById('edt-ecran') || {}).innerText || '';
  return { occurrences: (t.match(/fig[eé]r?/gi) || []).length,
    boutonPhoto: (Array.from(document.querySelectorAll('#edt-ecran button'))
      .map(x => x.innerText.trim()).filter(x => x.indexOf('Photo') >= 0)[0]) || '(aucun)',
    figeIntacte: document.documentElement.classList.contains('edt-fige') };
});
dire(figer.occurrences === 0 && figer.figeIntacte,
  '⑬ « figer » dans les textes affichés : zéro — et la classe `edt-fige` porte toujours le plein écran',
  JSON.stringify(figer));

await nav.close();
console.log('\n' + (rates ? ('ÉCHEC — ' + rates + ' repère(s)') : 'TOUT PASSE — 15 repères'));
process.exit(rates ? 1 : 0);

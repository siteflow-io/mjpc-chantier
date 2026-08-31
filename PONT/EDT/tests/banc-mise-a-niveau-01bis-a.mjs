/* BANC ①bis-a — la mise à niveau au chargement, mesurée écriture par écriture.
   Faux hub = le mode test NATIF du site (M8_TEST / M8_TEST_STORE), qui intercepte
   _siteGet, _sitePut et — depuis le correctif ③ — mjpcEcrireRest.
   Aucune requête ne sort : toute requête non file:// est avortée par le banc.
   Usage : node banc-mise-a-niveau-01bis-a.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const PREFIXE = process.argv[3] || '01bis-a';
const CAL = JSON.parse(fs.readFileSync('calendrier-2026-2027.json', 'utf8'));
const ANNEE = '2026-2027';
const CH = (o) => '/site/edt/' + o + '/' + ANNEE;

const prep = `
  window.__J = [];               /* journal des écritures, dans l'ordre */
  window.__DIT = [];             /* ce que le site dit à l'écran */
  window.M8_TEST = true;
  /* Le mode test natif rend la valeur du magasin PAR RÉFÉRENCE : les objets du
     faux hub et ceux de la mémoire seraient le même objet, et une pose d'id en
     mémoire se verrait au « hub » sans qu'aucune écriture ait eu lieu. Le banc
     clone à la lecture : ainsi le hub ne bouge QUE par une écriture réelle. */
  window.__vraiSiteGet = window._siteGet;
  window._siteGet = function(chemin, cb){
    if (window.m8TestOn && window.m8TestOn()){
      var v = window.M8_TEST_STORE[chemin];
      cb(v === undefined ? null : JSON.parse(JSON.stringify(v)));
      return;
    }
    return window.__vraiSiteGet(chemin, cb);
  };
  window.__vraiSitePut = window._sitePut;
  window._sitePut = function(chemin, valeur, cb){
    var estArchive = String(chemin).indexOf('/corbeille/') === 0;
    window.__J.push({type: estArchive ? 'archive' : 'sitePut', chemin: chemin, t: Date.now()});
    var vise = window.__ARCHIVAGE_ECHOUE === true ||
               (typeof window.__ARCHIVAGE_ECHOUE === 'string' && String(chemin).indexOf(window.__ARCHIVAGE_ECHOUE) >= 0);
    if (estArchive && vise){                              /* panne simulée du hub */
      if (cb) cb(false, {etat: 'panne', status: 0, url: chemin, quand: Date.now()});
      return;
    }
    return window.__vraiSitePut(chemin, valeur, cb);
  };
  window.__vraiEcrireRest = window.mjpcEcrireRest;
  window.mjpcEcrireRest = function(url, options, cb){
    if (options && options.method && options.method !== 'GET')
      window.__J.push({type: 'ecriture', chemin: String(url).replace(/^https?:\\/\\/[^/]+/,'').replace(/\\.json.*$/,''), t: Date.now()});
    return window.__vraiEcrireRest(url, options, cb);
  };
  window.__vraiAtInfo = window.atInfo;
  window.atInfo = function(m){ window.__DIT.push(String(m)); if (window.__vraiAtInfo) return window.__vraiAtInfo(m); };
`;

function idsDe(cal) {
  if (!cal) return 0;
  let n = 0;
  for (const k of ['evenementsClasse', 'jalons', 'etablissement', 'feries', 'vacances'])
    for (const x of (cal[k] || [])) if (x && x.id) n++;
  return n;
}

async function scenario(nav, nom, hub, opts = {}) {
  const page = await nav.newPage();
  await page.setRequestInterception(true);
  page.on('request', r => (r.url().startsWith('file://') ? r.continue() : r.abort()));
  page.on('pageerror', () => {});
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await page.evaluate(prep);
  await page.evaluate((hub, echoue) => {
    window.M8_TEST_STORE = JSON.parse(JSON.stringify(hub));
    window.__ARCHIVAGE_ECHOUE = echoue;
  }, hub, opts.archivageEchoue === undefined ? false : opts.archivageEchoue);

  await page.evaluate((concurrent) => {
    window.__fini = 0;
    edtCharger(function () { window.__fini++; });
    if (concurrent) edtCharger(function () { window.__fini++; });   /* deux chargements en même temps */
  }, !!opts.concurrent);
  await new Promise(r => setTimeout(r, 1200));

  const res = await page.evaluate(() => {
    const store = window.M8_TEST_STORE || {};
    const corbeille = Object.keys(store).filter(k => k.indexOf('/corbeille/') === 0);
    return {
      journal: window.__J,
      dit: window.__DIT,
      miseANiveauDit: (window.EDT && window.EDT.miseANiveauDit) || [],
      cles: Object.keys(store),
      corbeille: corbeille.map(k => ({ cle: k, data: store[k] && store[k].data })),
      calHub: store['/site/edt/calendrier/2026-2027'] || null,
      calMemoire: (window.EDT && window.EDT.calendrier) || null,
      fini: window.__fini,
      verrou: window.EDT ? !!window.EDT.miseANiveauEnCours : null
    };
  });
  if (opts.capture) await page.screenshot({ path: opts.capture, fullPage: false });
  await page.close();

  const ecritures = res.journal.filter(j => j.type === 'ecriture');
  const archives = res.journal.filter(j => j.type === 'archive');
  console.log('\n══════ ' + nom + ' ══════');
  console.log('  écritures hub : ' + ecritures.length + (ecritures.length ? ' → ' + ecritures.map(e => e.chemin).join(', ') : ''));
  console.log('  archives      : ' + archives.length + (archives.length ? ' → ' + archives.map(e => e.chemin).join(', ') : ''));
  console.log('  ordre         : ' + res.journal.map(j => j.type).join(' → ') || '(rien)');
  console.log('  le site dit   : ' + (res.dit.length ? JSON.stringify(res.dit) : '(rien)'));
  console.log('  la charge dit : ' + JSON.stringify(res.miseANiveauDit));
  console.log('  id au hub     : ' + idsDe(res.calHub) + '   id en mémoire : ' + idsDe(res.calMemoire));
  if (res.corbeille.length) {
    for (const a of res.corbeille)
      console.log('  ARCHIVE ' + a.cle + ' → id dans la donnée archivée : ' + idsDe(a.data));
  }
  console.log('  chargements finis : ' + res.fini + ' · verrou encore posé : ' + res.verrou);
  return { res, ecritures, archives };
}

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'],
  headless: true
});

const calSansId = JSON.parse(JSON.stringify(CAL));

/* ① hub vide — l'état réel mesuré le 31/08 */
await scenario(nav, '① HUB VIDE (état réel) → attendu 0 écriture', {});

/* ② hub avec un objet privé de son id */
const r2 = await scenario(nav, '② HUB SANS id → attendu 1 archive PUIS 1 écriture',
  { [CH('calendrier')]: calSansId }, { capture: 'tests/'+PREFIXE+'-2-hub-sans-id.png' });

/* ③ hub déjà complet — on reprend ce que ② a écrit */
const calAvecId = r2.res.calHub;
await scenario(nav, '③ HUB DÉJÀ COMPLET → attendu 0 écriture', { [CH('calendrier')]: calAvecId });

/* ④ archivage simulé en échec */
await scenario(nav, '④ ARCHIVAGE EN ÉCHEC → attendu 0 écriture + message',
  { [CH('calendrier')]: calSansId }, { archivageEchoue: true, capture: 'tests/'+PREFIXE+'-4-archivage-echoue.png' });

/* ⑤ deux chargements concurrents */
await scenario(nav, '⑤ DEUX CHARGEMENTS CONCURRENTS → attendu 1 seule mise à niveau',
  { [CH('calendrier')]: calSansId }, { concurrent: true });

/* ⑥ AUDIT ADVERSE — données absurdes au hub */
await scenario(nav, '⑥ DONNÉES ABSURDES (JSON tronqué, tableaux qui n\'en sont pas) → attendu : aucune casse',
  {
    [CH('calendrier')]: 'ceci n\'est pas un objet',
    [CH('grille')]: { creneaux: { pas: 'un tableau' } },
    [CH('periodes')]: { annee: ANNEE, periodes: [null, { nom: '' }, { nom: 'P1', debut: '2026-12-01', fin: '2026-09-01' }] },
    [CH('creneaux')]: { creneaux: [] }
  });

/* ⑦ plusieurs objets à mettre à niveau d'un coup */
const grille = JSON.parse(fs.readFileSync('grille-2026-2027.json', 'utf8'));
await scenario(nav, '⑦ TROIS OBJETS SANS id → attendu : une archive AVANT chaque écriture',
  { [CH('calendrier')]: calSansId, [CH('grille')]: grille,
    [CH('periodes')]: { annee: ANNEE, periodes: [{ rang: 1, nom: 'Période 1', debut: '2026-09-01', fin: '2026-10-17' }] } });

/* ⑧ AUDIT ADVERSE — l'archivage tombe au milieu, sur UN objet parmi trois */
await scenario(nav, '⑧ ARCHIVAGE QUI TOMBE SUR UN SEUL OBJET → attendu : rien d\'écrit, jamais en deux temps',
  { [CH('calendrier')]: calSansId, [CH('grille')]: grille,
    [CH('periodes')]: { annee: ANNEE, periodes: [{ rang: 1, nom: 'Période 1', debut: '2026-09-01', fin: '2026-10-17' }] } },
  { archivageEchoue: 'grille' });

await nav.close();

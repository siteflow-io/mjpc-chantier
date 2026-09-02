/* BANC ⑨ — LE VERROU PAR CLÉ, LA BASCULE DE FIN D'ANNÉE, LA PHOTO RETENTÉE.
   Usage : node tests/banc-verrou-bascule-09.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const hub = (opt = {}) => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'),
    config: { brevetDates: Object.assign({ debutAnnee: '2026-09-01' }, opt.dates || {}) },
    edt: {
      grille: { '2026-2027': J('grille-deux-classes.json') },
      calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
      creneaux: { '2026-2027': J('creneaux-2026-2027.json') },
      periodes: { '2026-2027': { annee: '2026-2027', periodes:
        [{ id: 'per:UN', rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' }] } },
      decisions: opt.decisions ? { '2026-2027': opt.decisions } : undefined } } });

const faux = (s, refuse) => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; window.__REFUSE = refuse;
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
      if (window.__REFUSE && c.indexOf(window.__REFUSE) >= 0)
        return Promise.resolve(new Response('{"error":"permission denied"}', { status: 401 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push(c); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 }));
    }
    return Promise.resolve(new Response('null', { status: 200 })); };
  window.__dec = () => ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {});
  window.__photos = () => ((((window.__HUB.site || {}).edt || {}).photos || {})['2026-2027'] || {}).photos || [];
  window.__archives = nom => { const out = [];
    Object.keys(window.__HUB.corbeille || {}).forEach(j => Object.keys(window.__HUB.corbeille[j] || {}).forEach(k => {
      const a = window.__HUB.corbeille[j][k];
      if (a && a._meta && String(a._meta.chemin).indexOf('/' + nom + '/') >= 0) out.push(a); }));
    return out; };
  window.__dit = '';
  const av = window.atInfo;
  window.atInfo = function (t) { window.__dit = String(t); if (av) return av.apply(this, arguments); };
};
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(), protocolTimeout: 600000,
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
let rates = 0;
const dire = (bon, titre, mesure) => { if (!bon) rates++;
  console.log((bon ? '  ✔ ' : '  ✘ ') + titre + '\n      mesuré : ' + mesure); };

const arriver = async (opt = {}, refuse = null) => {
  await page.evaluateOnNewDocument(faux, hub(opt), refuse);
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));   /* déclaré : pas un clic */
  await page.click('#tprof-btn'); await pause(600);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
  await pause(1400);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-panneau [onclick]'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf('edtOuvrir') >= 0)[0]; if (b) b.click(); });
  await pause(1900);
};

await arriver();
console.log('BANC ⑨ — version : ' + await page.evaluate(() => APP_VERSION));

/* ① LE VERROU PAR CLÉ — deux gestes sur la MÊME case */
const verrou = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const k = Object.keys(cel).filter(x => cel[x].classeMjpc)[0];
  const c = cel[k], cle = edtCleHeure(c.iso, c.creneau, c.classeMjpc);
  /* une PREMIÈRE décision est posée et enregistrée : c'est elle que l'archive
     devra porter. Sur une case vierge il n'y a rien à archiver, et le site a
     raison de n'archiver rien — mesuré au premier essai. */
  edtEcrireDecision(c.classeMjpc, cle, { sansSeance: true, motif: 'banalisee',
    categorie: 'Vie scolaire', pose: 1 }, 'décision de départ');
  setTimeout(() => {
  window.__ECR.length = 0;
  const modaleAvant = document.getElementById('at-modale');
  if (modaleAvant) modaleAvant.remove();
  edtEcrireDecision(c.classeMjpc, cle, { sansSeance: true, motif: 'banalisee',
    categorie: 'Gestion de classe', pose: Date.now() }, 'geste A');
  edtEcrireDecision(c.classeMjpc, cle, { sansSeance: true, motif: 'banalisee',
    categorie: 'Sortie, voyage, projet', pose: Date.now() }, 'geste B');
  setTimeout(() => { const d = window.__dec()[c.classeMjpc] || {};
    const m = document.getElementById('at-modale');
    res({ ecrituresDecisions: window.__ECR.filter(x => x.indexOf('/decisions/') >= 0).length,
      archives: window.__archives('decisions').length,
      journal: (d.journal || []).map(j => j.quoi),
      journalAvantDuPremier: (d.journal || []).length > 1
        ? ((d.journal[1].avant || {}).categorie || JSON.stringify(d.journal[1].avant)) : '(vide)',
      categorieRetenue: ((d.heures || {})[cle] || {}).categorie,
      leSecondLeDit: m ? m.innerText.replace(/\n+/g, ' ').slice(0, 120) : '(rien)' });
  }, 1500); }, 1200); }));
dire(verrou.ecrituresDecisions === 1 && verrou.archives >= 1
  && verrou.journal.length === 2 && verrou.journal[1] === 'geste A'
  && verrou.journalAvantDuPremier === 'Vie scolaire'
  && verrou.leSecondLeDit.indexOf('déjà en cours') >= 0,
  '① deux gestes sur la même case : UNE écriture, UNE archive, le journal porte le premier, et le second le dit',
  JSON.stringify(verrou));

/* ② DEUX GESTES SUR DEUX CASES DIFFÉRENTES — le verrou ne bloque pas le site */
const deuxCases = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const ks = Object.keys(cel).filter(x => cel[x].classeMjpc);
  const a = cel[ks[0]], b = cel[ks[1]];
  window.__ECR.length = 0; window.__dit = '';
  edtEcrireDecision(a.classeMjpc, edtCleHeure(a.iso, a.creneau, a.classeMjpc),
    { sansSeance: true, motif: 'banalisee', categorie: 'Gestion de classe', pose: Date.now() }, 'case 1');
  edtEcrireDecision(b.classeMjpc, edtCleHeure(b.iso, b.creneau, b.classeMjpc),
    { sansSeance: true, motif: 'banalisee', categorie: 'Gestion de classe', pose: Date.now() }, 'case 2');
  setTimeout(() => res({ ecritures: window.__ECR.filter(x => x.indexOf('/decisions/') >= 0).length,
    refusDit: window.__dit || '(rien — aucun refus)' }), 1500); }));
dire(deuxCases.ecritures === 2 && deuxCases.refusDit.indexOf('déjà en cours') < 0,
  '② deux gestes sur DEUX cases différentes partent tous les deux — le verrou porte sur la clé',
  JSON.stringify(deuxCases));

/* ③ LES DEUX LIBELLÉS — avant la fin de l'année */
const avantFin = await page.evaluate(() => {
  const v = { aReplacer: true, motif: 'aReplacer', justifiee: false, prisePar: 'X' };
  return { finAnnee: edtFinAnnee(), aujourdhui: edtAujourdhui(),
    enAttente: edtMotifEnClair(v),
    jamais: edtMotifEnClair(Object.assign({}, v, { jamaisReplacee: true })),
    motifsIntacts: EDT_MOTIFS.aReplacer.libelle }; });
dire(avantFin.enAttente.indexOf('en attente') >= 0
  && avantFin.jamais.indexOf('jamais replacée') >= 0
  && avantFin.motifsIntacts === 'heure à replacer jamais replacée',
  '③ deux états, deux libellés — et `EDT_MOTIFS` n\'a pas bougé',
  JSON.stringify(avantFin));

/* ④ LA BASCULE DE FIN D'ANNÉE — une année déjà finie */
const cleP = '2026-09-02_08h00-08h55_3E_Charles_de_Gaulle';
const decs = { '3E Charles de Gaulle': { heures: {
    [cleP]: { aReplacer: true, motif: 'aReplacer', justifiee: false, prisePar: '4E BANKSY', pose: 1 },
    '2026-09-03_08h00-08h55_3E_Charles_de_Gaulle': { sansSeance: true, motif: 'banalisee',
      categorie: 'Gestion de classe', justifiee: true, pose: 2 },
    '2026-09-04_08h00-08h55_3E_Charles_de_Gaulle': { aReplacer: true, motif: 'aReplacer',
      justifiee: true, basculeManuelle: true, pose: 3 } }, journal: [] } };
await arriver({ dates: { finAnnee: '2026-06-30' }, decisions: decs });
const bascule = await page.evaluate(cle => {
  const d = window.__dec()['3E Charles de Gaulle'].heures;
  return { finAnnee: edtFinAnnee(), aujourdhui: edtAujourdhui(),
    heurePriseParUneAutre: { jamaisReplacee: !!d[cle].jamaisReplacee, justifiee: d[cle].justifiee,
      enClair: edtMotifEnClair(d[cle]), basculable: edtBasculable(d[cle]) },
    heureBanaliseeDePaul: { motif: d['2026-09-03_08h00-08h55_3E_Charles_de_Gaulle'].motif,
      justifiee: d['2026-09-03_08h00-08h55_3E_Charles_de_Gaulle'].justifiee,
      touchee: !!d['2026-09-03_08h00-08h55_3E_Charles_de_Gaulle'].jamaisReplacee },
    heureDejaTrancheeParPaul: { justifiee: d['2026-09-04_08h00-08h55_3E_Charles_de_Gaulle'].justifiee,
      jamaisReplacee: !!d['2026-09-04_08h00-08h55_3E_Charles_de_Gaulle'].jamaisReplacee } };
}, cleP);
dire(bascule.heurePriseParUneAutre.jamaisReplacee === true
  && bascule.heurePriseParUneAutre.justifiee === false
  && bascule.heurePriseParUneAutre.basculable === true
  && bascule.heureBanaliseeDePaul.touchee === false
  && bascule.heureBanaliseeDePaul.justifiee === true,
  '④ passé la fin de l\'année : l\'heure jamais replacée bascule, celle que Paul avait tranchée ne bouge pas',
  JSON.stringify(bascule));

/* ⑤ LA PHOTO RETENTÉE — le hub refuse, l'échéance reste due */
await arriver({}, '/photos/');
const refus = await page.evaluate(() => ({
  photosAuHub: window.__photos().length,
  echeanceEncoreDue: (() => { const e = edtEcheanceDue(); return e ? e.cle : null; })(),
  drapeauFaite: EDT.photoAutoEmise || null, drapeauEnCours: EDT.photoAutoEnCours || null }));
await arriver({});
const reprise = await page.evaluate(() => ({
  photosAuHub: window.__photos().length,
  nom: (window.__photos()[0] || {}).nom || null,
  echeance: (window.__photos()[0] || {}).echeance || null,
  drapeauFaite: EDT.photoAutoEmise || null, drapeauEnCours: EDT.photoAutoEnCours || null }));
dire(refus.photosAuHub === 0 && refus.drapeauFaite === null && refus.echeanceEncoreDue === 'per:UN'
  && reprise.photosAuHub === 1 && reprise.drapeauFaite === 'per:UN',
  '⑤ le hub refuse la photo : l\'échéance reste due, et le chargement suivant la reprend',
  'refusé → ' + JSON.stringify(refus) + ' · chargement suivant → ' + JSON.stringify(reprise));

await nav.close();
console.log('\n' + (rates ? ('ÉCHEC — ' + rates + ' repère(s)') : 'TOUT PASSE — 5 repères'));
process.exit(rates ? 1 : 0);

/* AUDIT ADVERSE ⑥ — LES SEPT CAS DU §⑦.15, JAMAIS JOUÉS JUSQU'ICI.
   On cherche ce qui casse, pas ce qui marche. Chaque cas dit COMMENT il a été
   atteint : par un clic, ou par un appel de fonction — et dans ce dernier cas,
   si le geste est atteignable autrement.
   Usage : node tests/audit-adverse-06.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
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
  window.__dec = () => ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {});
  window.__heures = () => { const d = window.__dec(), out = [];
    Object.keys(d).forEach(c => Object.keys((d[c] || {}).heures || {}).forEach(k =>
      out.push({ classe: c, cle: k, v: d[c].heures[k] }))); return out; };
};
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
const erreurs = [];
page.on('pageerror', e => { erreurs.push(String(e).slice(0, 90)); console.log('   ⚠ erreur de page : ' + String(e).slice(0, 90)); });

const arriver = async () => {
  await page.evaluateOnNewDocument(faux, hub());
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
let n = 0;
const cas = (titre, comment, mesure) => { n++;
  console.log('\n■ ' + n + ' · ' + titre);
  console.log('   atteint : ' + comment);
  console.log('   mesuré  : ' + JSON.stringify(mesure)); };

console.log('AUDIT ADVERSE ⑥ — les sept cas du §⑦.15');
await arriver();
console.log('version : ' + await page.evaluate(() => APP_VERSION));

/* ① ÉCHANGE ENTRE DEUX CLASSES NON APPARIÉES */
const c1 = await page.evaluate(() => {
  const cel = EDT_VUE.cellules || {};
  const source = Object.keys(cel).filter(k => cel[k].classeMjpc)[0];
  const nonApp = Object.keys(cel).filter(k => cel[k].nature === 'nonImportee')[0];
  if (!source || !nonApp) return { impossible: 'aucune case non appariée dans la vue' };
  const d = cel[nonApp];
  window.__ECR.length = 0;
  const refus = edtRefusDepot(cel[source], { iso: d.iso, creneau: d.creneau });
  const occupant = edtOccupantDe(cel[source], { iso: d.iso, creneau: d.creneau });
  return { classeVisee: d.classe, refus: refus, troisIssuesOuvertes: !!occupant,
    ecritures: window.__ECR.slice() }; });
cas('échange avec une classe NON APPARIÉE', 'appel de fonction (le refus se lit avant tout clic) — le geste équivalent est le dépôt, atteignable',
  c1);

/* ② ÉCRASEMENT D'UNE HEURE DÉJÀ À REPLACER */
const c2 = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const paires = Object.keys(cel).filter(k => cel[k].classeMjpc);
  const a = paires[0], b = paires.filter(k => cel[k].classeMjpc !== cel[a].classeMjpc)[0];
  if (!b) { res({ impossible: 'une seule classe appariée' }); return; }
  edtEcraserHeure(a, { iso: cel[b].iso, creneau: cel[b].creneau });
  setTimeout(() => {
    const premiere = window.__heures().filter(h => h.v.aReplacer);
    /* on écrase une SECONDE fois la même case, déjà à replacer */
    edtEcraserHeure(a, { iso: cel[b].iso, creneau: cel[b].creneau });
    setTimeout(() => {
      const apres = window.__heures().filter(h => h.v.aReplacer);
      res({ aReplacerApresLePremier: premiere.length, aReplacerApresLeSecond: apres.length,
        motifs: apres.map(h => h.classe + ' ' + h.v.motif + ' justifiée=' + h.v.justifiee),
        telescopages: edtVerifierCoherence(edtAujourdhui(), 20).length });
    }, 900); }, 900); }));
cas('écrasement d\'une heure DÉJÀ à replacer', 'appel de fonction — le geste passe par le menu des destinations, atteignable', c2);

/* ③ HEURE REPLACÉE SUR SA PROPRE CASE DE DÉPART */
await arriver();
const c3 = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const a = Object.keys(cel).filter(k => cel[k].classeMjpc)[0];
  const b = Object.keys(cel).filter(k => cel[k].classeMjpc && cel[k].classeMjpc !== cel[a].classeMjpc)[0];
  if (!b) { res({ impossible: 'une seule classe appariée' }); return; }
  edtEcraserHeure(a, { iso: cel[b].iso, creneau: cel[b].creneau });
  setTimeout(() => {
    const h = window.__heures().filter(x => x.v.aReplacer)[0];
    if (!h) { res({ impossible: 'aucune heure à replacer' }); return; }
    const p = String(h.cle).split('_');
    const cible = p[0] + '|' + p[1].replace(/h/g, ':');     /* SA PROPRE case de départ */
    edtReplacerHeure(h.classe, h.cle, cible);
    setTimeout(() => {
      const m = document.getElementById('at-modale');
      const apres = window.__heures().filter(x => x.classe === h.classe);
      res({ cible: cible, question: m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 110) : '(aucune)',
        heuresDeLaClasse: apres.length,
        aLaFoisPartieEtArrivee: apres.filter(x => x.v.deplaceeVers && (x.v.epingle || x.v.ajoutee)).length,
        telescopages: edtVerifierCoherence(edtAujourdhui(), 20) });
    }, 1000); }, 900); }));
cas('heure replacée SUR SA PROPRE case de départ', 'appel de fonction — le geste passe par le menu du rappel, atteignable', c3);

/* ④ TROIS CLASSES QUI TOURNENT */
await arriver();
const c4 = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const classes = {}; Object.keys(cel).forEach(k => { const c = cel[k].classeMjpc;
    if (c) (classes[c] = classes[c] || []).push(k); });
  const noms = Object.keys(classes);
  if (noms.length < 2) { res({ impossible: 'moins de deux classes appariées' }); return; }
  const a = classes[noms[0]][0], b = classes[noms[1]][0];
  const c = classes[noms[0]][1] || classes[noms[1]][1];
  edtEcraserHeure(a, { iso: cel[b].iso, creneau: cel[b].creneau });
  setTimeout(() => { edtEcraserHeure(b, { iso: cel[c].iso, creneau: cel[c].creneau });
    setTimeout(() => { edtEcraserHeure(c, { iso: cel[a].iso, creneau: cel[a].creneau });
      setTimeout(() => res({ classes: noms.length, decisions: window.__heures().length,
        aReplacer: window.__heures().filter(h => h.v.aReplacer).length,
        telescopages: edtVerifierCoherence(edtAujourdhui(), 30),
        ecranDebout: !!document.getElementById('edt-ecran') }), 1000); }, 900); }, 900); }));
cas('trois classes qui tournent', 'appels de fonction enchaînés — chaque geste seul est atteignable', c4);

/* ⑤ finAnnee AVANCÉE AVEC DES HEURES AU-DELÀ */
await arriver();
const c5 = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const a = Object.keys(cel).filter(k => cel[k].classeMjpc)[0];
  const cl = cel[a].classeMjpc, q = Date.now(), lot = [];
  for (let i = 0; i < 10; i++) lot.push({ classe: cl,
    cle: edtCleHeure('2027-06-1' + i, '08:00-08:55', cl),
    valeur: { ajoutee: true, epingle: true, pose: q } });
  edtEcrireDecisionsGroupe(lot, 'dix heures posées en juin', 'Audit');
  setTimeout(() => {
    edtPoserDateAnnee('finAnnee', '2027-06-05');
    setTimeout(() => {
      const m = document.getElementById('at-modale');
      res({ heuresPoseesEnJuin: 10, finAnneeDemandee: '2027-06-05',
        finAnneeRetenue: EDT_DATES.finAnnee, ceQueLeSiteDit: m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 220) : '(rien)',
        aReplacer: window.__heures().filter(h => h.v.aReplacer).length });
    }, 1200); }, 1000); }));
cas('finAnnee avancée avec dix heures au-delà', 'appel de fonction — le geste est le champ « fin d\'année » du panneau, atteignable', c5);

/* ⑥ DEUX GESTES CONCURRENTS SUR LA MÊME CASE */
await arriver();
const c6 = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const k = Object.keys(cel).filter(x => cel[x].classeMjpc)[0];
  const c = cel[k];
  window.__ECR.length = 0;
  edtEcrireDecision(c.classeMjpc, edtCleHeure(c.iso, c.creneau, c.classeMjpc),
    { sansSeance: true, motif: 'banalisee', categorie: 'Gestion de classe', pose: Date.now() }, 'geste A');
  edtEcrireDecision(c.classeMjpc, edtCleHeure(c.iso, c.creneau, c.classeMjpc),
    { sansSeance: true, motif: 'banalisee', categorie: 'Sortie, voyage, projet', pose: Date.now() }, 'geste B');
  setTimeout(() => { const h = window.__heures().filter(x => x.classe === c.classeMjpc);
    res({ decisions: h.length, categorieRetenue: (h[0] || {}).v && h[0].v.categorie,
      ecritures: window.__ECR.filter(x => x.indexOf('/decisions/') >= 0).length,
      archives: window.__ECR.filter(x => x.indexOf('/corbeille/') >= 0).length,
      journal: (((window.__dec()[c.classeMjpc]) || {}).journal || []).map(j => j.quoi) }); }, 1400); }));
cas('deux gestes concurrents sur la même case', 'appels de fonction enchaînés sans attendre — c\'est le double-clic rapide de Paul', c6);

/* ⑦ UNE HEURE À REPLACER DONT LA CLASSE DISPARAÎT DE LA GRILLE */
await arriver();
const c7 = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const a = Object.keys(cel).filter(k => cel[k].classeMjpc)[0];
  const b = Object.keys(cel).filter(k => cel[k].classeMjpc && cel[k].classeMjpc !== cel[a].classeMjpc)[0];
  edtEcraserHeure(a, { iso: cel[b].iso, creneau: cel[b].creneau });
  setTimeout(() => {
    const perdante = window.__heures().filter(h => h.v.aReplacer)[0];
    /* la classe disparaît de la grille : toutes ses cases sont retirées */
    const g = EDT.grille;
    const liste = g.creneaux || (g.versions && g.versions[g.versions.length - 1].creneaux) || [];
    let retires = 0;
    for (let i = liste.length - 1; i >= 0; i--)
      if (liste[i].classeMjpc === perdante.classe) { liste.splice(i, 1); retires++; }
    edtPeindre();
    setTimeout(() => {
      let rappel = null, casse = null;
      try { rappel = edtRappelAReplacerHtml(perdante.classe); } catch (e) { casse = String(e).slice(0, 80); }
      let toutes = null;
      try { toutes = edtHeuresAReplacer(null).length; } catch (e) { casse = casse || String(e).slice(0, 80); }
      res({ classeDisparue: perdante.classe, casesRetirees: retires,
        heureToujoursAuMagasin: window.__heures().filter(h => h.v.aReplacer).length,
        rappelRendu: rappel === null ? '(exception)' : (rappel ? rappel.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 120) : '(vide)'),
        edtHeuresAReplacer: toutes, exception: casse, ecranDebout: !!document.getElementById('edt-ecran') });
    }, 900); }, 1000); }));
cas('une heure à replacer dont la CLASSE DISPARAÎT de la grille', 'appel de fonction (la réinjection ferait le même effet) — la suite est lue à l\'écran', c7);

console.log('\nerreurs de page pendant tout l\'audit : ' + (erreurs.length ? JSON.stringify(erreurs) : 'aucune'));
await nav.close();

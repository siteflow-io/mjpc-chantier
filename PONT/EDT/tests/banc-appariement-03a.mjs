/* BANC ③a — L'APPARIEMENT BRANCHÉ À LA RÉINJECTION.
   Faux hub REST, aucune requête ne sort. Les classes sont chargées avant l'EDT.
   Usage : node tests/banc-appariement-03a.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';

const hub = () => ({ classes: J('hub-classes.json'),
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

async function ouvrir() {
  const page = await nav.newPage();
  page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
  await page.evaluateOnNewDocument(faux, hub());
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1500);
  await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await pause(500);
  return page;
}
/* injecte un objet préparé par `muter`, sans répondre aux questions */
const injecter = (page, voie, source, muter) => page.evaluate((v, src, code) => new Promise(res => {
  const o = JSON.parse(JSON.stringify(src));
  eval('(' + code + ')(o)');
  window.__ECR.length = 0;
  EDT_INJ = { voie: v, objet: o, messages: [] };
  edtInjInjecter(v);
  setTimeout(() => {
    const m = document.getElementById('at-modale');
    const d = EDT_INJ.diff || EDT.diffInjection || null;
    res({ modale: m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 240) : null,
      ecrituresAvantReponse: window.__ECR.slice(),
      diff: d ? { forts: d.forts, arrivent: d.arrivent, disparaissent: d.disparaissent,
        faibles: d.faibles.length, ambigus: d.ambigus.map(a => ({ famille: a.famille, candidats: a.candidats, par: a.par })) } : null });
  }, 700); }), voie, source, muter.toString());

const repondre = async (page, quoi) => {
  for (let k = 0; k < 6; k++) {
    const fait = await page.evaluate(t => {
      const m = document.getElementById('at-modale'); if (!m) return false;
      const b = Array.from(m.querySelectorAll('button')).filter(x => x.textContent.indexOf(t) >= 0)[0];
      if (!b) return false; b.click(); return true; }, quoi);
    if (!fait) break;
    await pause(500);
  }
  await pause(900);
};
const idsCal = page => page.evaluate(() => {
  const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
  return { evc: (cal.evenementsClasse || []).map(e => e.id),
    fer: (cal.feries || []).map(e => e.id), n: (cal.evenementsClasse || []).length }; });

/* ═══ ⑥.2 · l'entrant porte des id connus : ils font foi ══════════════════ */
console.log('\n══════ ⑥.2 · ENTRANT AVEC id CONNUS, TOUS LES LIBELLÉS CHANGÉS ══════');
let page = await ouvrir();
const avant2 = await idsCal(page);
const r2 = await injecter(page, 'calendrier', J('calendrier-2026-2027.json'), o => {
  const cal = window.__HUB.site.edt.calendrier['2026-2027'];
  (o.evenementsClasse || []).forEach((e, i) => {
    e.id = (cal.evenementsClasse || [])[i].id; e.libelle = 'TOTALEMENT AUTRE CHOSE ' + i; });
});
await pause(600);
const apres2 = await idsCal(page);
console.log('   diff : ' + JSON.stringify(r2.diff) + ' · question posée : ' + (r2.modale ? 'OUI' : 'non'));
console.log('   identifiants conservés : ' + apres2.evc.filter((x, i) => x === avant2.evc[i]).length + '/' + avant2.evc.length);
await page.close();

/* ═══ ⑥.3 · appariement fort silencieux ═════════════════════════════════ */
console.log('\n══════ ⑥.3 · RÉINJECTION SANS AUCUN id, CONTENU IDENTIQUE ══════');
page = await ouvrir();
const avant3 = await idsCal(page);
const r3 = await injecter(page, 'calendrier', J('calendrier-2026-2027.json'), o => {
  ['evenementsClasse', 'jalons', 'etablissement', 'feries', 'vacances'].forEach(f =>
    (o[f] || []).forEach(e => { delete e.id; }));
});
await pause(600);
const apres3 = await idsCal(page);
console.log('   diff : ' + JSON.stringify(r3.diff) + ' · question posée : ' + (r3.modale ? 'OUI' : 'non'));
console.log('   identifiants inchangés : ' + apres3.evc.filter((x, i) => x === avant3.evc[i]).length + '/' + avant3.evc.length
  + ' · fériés : ' + apres3.fer.filter((x, i) => x === avant3.fer[i]).length + '/' + avant3.fer.length);
await page.close();

/* ═══ ⑥.4 · faible proposé, jamais appliqué seul ════════════════════════ */
console.log('\n══════ ⑥.4 · UN LIBELLÉ RETOUCHÉ ET UNE DATE DÉPLACÉE ══════');
page = await ouvrir();
const avant4 = await idsCal(page);
const r4 = await injecter(page, 'calendrier', J('calendrier-2026-2027.json'), o => {
  ['evenementsClasse', 'jalons', 'etablissement', 'feries', 'vacances'].forEach(f =>
    (o[f] || []).forEach(e => { delete e.id; }));
  const a = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  a.libelle = 'Séjour à Verdun 3e';                       /* libellé retouché */
  const b = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Stages 3e (uniquement') >= 0)[0];
  b.debut = '2026-11-17'; b.fin = '2026-11-17';           /* date déplacée */
});
console.log('   première question : ' + JSON.stringify(r4.modale));
console.log('   écritures AVANT réponse : ' + JSON.stringify(r4.ecrituresAvantReponse));
console.log('   diff : ' + JSON.stringify(r4.diff));
await repondre(page, 'Oui, c');
const apres4 = await idsCal(page);
console.log('   après « Oui » à toutes : identifiants conservés ' + apres4.evc.filter(x => avant4.evc.indexOf(x) >= 0).length
  + '/' + avant4.evc.length);
await page.close();

/* ═══ ⑥.5 · biunivocité et ambiguïté ═══════════════════════════════════ */
console.log('\n══════ ⑥.5 · QUATRE ÉVÉNEMENTS DE MÊME LIBELLÉ ET MÊME DATE ══════');
page = await ouvrir();
const prep = await page.evaluate(c => new Promise(res => {
  const cal = JSON.parse(JSON.stringify(EDT.calendrier));
  const modele = (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  cal.evenementsClasse = (cal.evenementsClasse || []).filter(e => e !== modele);
  for (let i = 0; i < 4; i++) {
    const e = JSON.parse(JSON.stringify(modele));
    e.libelle = 'Sortie jumelle 3e'; e.id = 'evc:JUM' + i;
    cal.evenementsClasse.push(e);
  }
  EDT_INJ = { voie: 'calendrier', objet: cal, messages: [], apparie: true };
  edtInjInjecter('calendrier');
  setTimeout(() => {
    /* deux des quatre reçoivent des coches */
    edtJustifier('evc:JUM0', true);
    setTimeout(() => { edtJustifier('evc:JUM2', true); setTimeout(() => {
      const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
      const h = dec.heures || {};
      res({ jumelles: (EDT.calendrier.evenementsClasse || []).filter(e => e.libelle === 'Sortie jumelle 3e').length,
        proprietaires: Object.keys(h).map(k => h[k].evenement) }); }, 900); }, 900);
  }, 900); }), CLASSE);
console.log('   préparation : ' + JSON.stringify(prep));
const r5 = await page.evaluate(() => new Promise(res => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  (o.evenementsClasse || []).forEach(e => { if (e.libelle === 'Sortie jumelle 3e') delete e.id; });
  window.__ECR.length = 0;
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  setTimeout(() => { const m = document.getElementById('at-modale');
    const d = EDT_INJ.diff || EDT.diffInjection || null;
    res({ modale: m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 160) : null,
      diff: d ? { forts: d.forts, arrivent: d.arrivent, disparaissent: d.disparaissent, faibles: d.faibles.length,
        ambigus: d.ambigus.map(a => ({ famille: a.famille, candidats: a.candidats, par: a.par })) } : null,
      ecritures: window.__ECR.slice() }); }, 800); }));
console.log('   diff : ' + JSON.stringify(r5.diff));
console.log('   question posée : ' + JSON.stringify(r5.modale));
const apres5 = await page.evaluate(c => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  const h = dec.heures || {};
  return { proprietaires: Object.keys(h).map(k => h[k].evenement),
    idsApres: (window.__HUB.site.edt.calendrier['2026-2027'].evenementsClasse || [])
      .filter(e => e.libelle === 'Sortie jumelle 3e').map(e => e.id) }; }, CLASSE);
console.log('   propriétaires des coches après réinjection : ' + JSON.stringify(apres5.proprietaires));
console.log('   identifiants des quatre jumelles après : ' + JSON.stringify(apres5.idsApres));
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Injecter quand/.test(x.textContent))[0]; if (b) b.click(); });
await pause(1400);
const fin5 = await page.evaluate(c => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  const h = dec.heures || {};
  const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
  return { proprietaires: Object.keys(h).map(k => h[k].evenement),
    ids: (cal.evenementsClasse || []).filter(e => e.libelle === 'Sortie jumelle 3e').map(e => e.id),
    heures: edtHeuresJustifiees(c) }; }, CLASSE);
console.log('   APRÈS « Injecter quand même » : ' + JSON.stringify(fin5));
await page.close();

/* ═══ ⑥.6 · familles à critère unique ══════════════════════════════════ */
console.log('\n══════ ⑥.6 · FÉRIÉ RENOMMÉ (critère unique : la date) ══════');
page = await ouvrir();
const r6 = await injecter(page, 'calendrier', J('calendrier-2026-2027.json'), o => {
  ['evenementsClasse', 'jalons', 'etablissement', 'feries', 'vacances'].forEach(f =>
    (o[f] || []).forEach(e => { delete e.id; }));
  const f = (o.feries || [])[0]; f.nom = 'Jour chômé (renommé)'; f.date = '2026-11-12';  /* date changée */
});
console.log('   diff : ' + JSON.stringify(r6.diff) + ' · question posée : ' + (r6.modale ? 'OUI' : 'non'));
await page.close();

/* ═══ ⑥.7 · créneaux horaires ═════════════════════════════════════════ */
console.log('\n══════ ⑥.7 · CRÉNEAUX HORAIRES : début-fin, jamais le rang ══════');
page = await ouvrir();
const avant7 = await page.evaluate(() => (EDT.creneaux.creneaux || []).map(c => ({ id: c.id, debut: c.debut, fin: c.fin })));
const r7 = await injecter(page, 'creneaux', J('creneaux-2026-2027.json'), o => {
  (o.creneaux || []).forEach(c => { delete c.id; });
  o.creneaux.splice(1, 0, { debut: '08:00', fin: '08:20', libelle: 'battement inséré' });  /* nombre changé */
});
await pause(600);
const apres7 = await page.evaluate(() => ((window.__HUB.site.edt.creneaux['2026-2027'] || {}).creneaux || [])
  .map(c => ({ id: c.id, debut: c.debut, fin: c.fin })));
console.log('   diff : ' + JSON.stringify(r7.diff) + ' · question posée : ' + (r7.modale ? 'OUI' : 'non'));
console.log('   AVANT : ' + JSON.stringify(avant7.slice(0, 4)));
console.log('   APRÈS : ' + JSON.stringify(apres7.slice(0, 4)));
const permutes = apres7.filter(c => { const m = avant7.filter(a => a.id === c.id)[0];
  return m && (m.debut !== c.debut || m.fin !== c.fin); }).length;
console.log('   identifiants ayant changé d\'horaire (permutations) : ' + permutes);
await page.close();
await nav.close();

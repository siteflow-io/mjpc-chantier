/* BANC ⑤c-ter — TOUTES LES ARCHIVES PORTENT L'ÉTAT D'AVANT.
   Pour chaque geste : on relit l'archive écrite à la corbeille et on regarde si
   elle contient l'état d'AVANT (attendu) ou celui d'APRÈS (le défaut).
   Usage : node tests/banc-archives-objets-05cter.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const hub = () => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-appariee.json') },
    calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') },
    reglages: { '2026-2027': { annee: '2026-2027', semaineA: 'A' } },
    photos: { '2026-2027': { annee: '2026-2027', photos: [{ prise: '2026-09-01', depuis: '2026-08-31', cellules: {} }] } },
    periodes: { '2026-2027': { annee: '2026-2027', periodes: [
      { id: 'per:UN', rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
      { id: 'per:DEUX', rang: 2, nom: 'Trimestre 2', debut: '2026-12-01', fin: '2027-03-15' }] } } } } });
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
  /* la dernière archive écrite, par objet */
  window.__archive = nom => { let out = null;
    Object.keys(window.__HUB.corbeille || {}).forEach(j =>
      Object.keys(window.__HUB.corbeille[j]).forEach(k => {
        const a = window.__HUB.corbeille[j][k];
        if (a && a._meta && String(a._meta.chemin).indexOf('/' + nom + '/') >= 0) out = a; }));
    return out ? out.data : null; };
};
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
page.on('pageerror', e => console.log('   ⚠ ' + String(e).slice(0, 100)));
await page.evaluateOnNewDocument(faux, hub());
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(900);
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1600);
await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
await pause(500);
console.log('version : ' + await page.evaluate(() => APP_VERSION));

const geste = async (titre, code, attendu) => {
  const r = await page.evaluate(c => new Promise(res => { window.__ECR.length = 0; eval('(' + c + ')(res)'); }), code.toString());
  console.log('\n■ ' + titre);
  console.log('   attendu : ' + attendu);
  console.log('   mesuré  : ' + JSON.stringify(r));
};

await geste('edtReglagePoser — semaineA : A → B', fini => {
  edtReglagePoser('semaineA', 'B');
  setTimeout(() => fini({ auHub: (window.__HUB.site.edt.reglages['2026-2027'] || {}).semaineA,
    dansLArchive: (window.__archive('reglages') || {}).semaineA }), 800);
}, "l'archive porte « A », le hub porte « B »");

await geste('edtCreneauPoser — un libellé d\'horaire changé', fini => {
  const c = (EDT.creneaux.creneaux || [])[0];
  const avant = c.libelle || '(vide)';
  edtCreneauPoser(c.id, 'libelle', 'HORAIRE RETOUCHÉ');
  setTimeout(() => {
    const arc = window.__archive('creneaux') || {};
    const h = ((window.__HUB.site.edt.creneaux['2026-2027'] || {}).creneaux || [])[0] || {};
    fini({ avantLeGeste: avant, auHub: h.libelle,
      dansLArchive: ((arc.creneaux || [])[0] || {}).libelle || '(vide)' }); }, 800);
}, "l'archive porte l'ancien libellé, le hub le nouveau");

await geste('edtApparierNom — une classe appariée', fini => {
  const avant = edtToutesLesCases().filter(x => x.classe === '3 DYLAN Bob')[0];
  const nomAvant = avant ? (avant.classeMjpc || '(vide)') : '(aucune)';
  edtApparierNom('3 DYLAN Bob', '4E BANKSY');
  setTimeout(() => {
    const arc = window.__archive('grille') || {};
    const dedans = (arc.creneaux || []).filter(x => x.classe === '3 DYLAN Bob')[0] || {};
    const auHub = ((window.__HUB.site.edt.grille['2026-2027'] || {}).creneaux || [])
      .filter(x => x.classe === '3 DYLAN Bob')[0] || {};
    fini({ avantLeGeste: nomAvant, auHub: auHub.classeMjpc || '(vide)',
      dansLArchive: dedans.classeMjpc || '(vide)' }); }, 900);
}, "l'archive porte l'ancien appariement (vide), le hub le nouveau");

await geste('edtPhoto — une seconde photo du prévu', fini => {
  const avant = ((EDT.photos || {}).photos || []).length;
  edtPhoto();
  setTimeout(() => {
    const arc = window.__archive('photos') || {};
    fini({ avantLeGeste: avant,
      auHub: ((window.__HUB.site.edt.photos['2026-2027'] || {}).photos || []).length,
      dansLArchive: (arc.photos || []).length }); }, 900);
}, "l'archive porte 1 photo, le hub 2");

await geste('edtVersionAjouter — une version datée de plus', fini => {
  const avant = (EDT.grille.versions || []).length;
  edtVersionAjouter('2027-01-05', 'après les vacances');
  setTimeout(() => {
    const arc = window.__archive('grille') || {};
    fini({ versionsAvant: avant || '(forme simple)',
      auHub: ((window.__HUB.site.edt.grille['2026-2027'] || {}).versions || []).length,
      dansLArchive: (arc.versions || []).length || '(forme simple : ' + (arc.creneaux || []).length + ' créneaux)' }); }, 900);
}, "l'archive porte la grille d'avant (forme simple), le hub la forme datée");

await geste('edtPeriodePoser — une période renommée', fini => {
  const avant = (EDT.periodes.periodes || [])[0].nom;
  edtPeriodePoser('per:UN', 'nom', 'Trimestre 1 (renommé)');
  setTimeout(() => {
    const arc = window.__archive('periodes') || {};
    fini({ avantLeGeste: avant,
      auHub: ((window.__HUB.site.edt.periodes['2026-2027'] || {}).periodes || [])[0].nom,
      dansLArchive: ((arc.periodes || [])[0] || {}).nom }); }, 900);
}, "l'archive porte l'ancien nom, le hub le nouveau");
await nav.close();

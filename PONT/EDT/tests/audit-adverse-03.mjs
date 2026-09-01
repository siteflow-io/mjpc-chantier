/* AUDIT ADVERSE — LOT 2ter ③ §⑥.14. On cherche ce qui casse.
   Usage : node tests/audit-adverse-03.mjs <index.html> */
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
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; window.__REFUS = null;
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
      if (window.__REFUS && c.indexOf(window.__REFUS) >= 0) { window.__ECR.push('REFUSÉ ' + c);
        return Promise.resolve(new Response('panne', { status: 503 })); }
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

async function cas(titre, code, attendu, refus) {
  const page = await nav.newPage();
  const erreurs = []; page.on('pageerror', e => erreurs.push(String(e).slice(0, 100)));
  await page.evaluateOnNewDocument(faux, hub());
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1400);
  let r;
  try {
    r = await page.evaluate((c, ref, cls) => new Promise(res => {
      window.__ECR.length = 0; window.__REFUS = ref;
      const fini = v => { window.__REFUS = null; res(v); };
      eval('(' + c + ')(fini)');
    }), code.toString(), refus || null, CLASSE);
  } catch (e) { r = { erreur: String(e).slice(0, 90) }; }
  console.log('\n■ ' + titre);
  console.log('   attendu : ' + attendu);
  console.log('   mesuré  : ' + JSON.stringify(r));
  if (erreurs.length) console.log('   ⚠ erreurs de page : ' + JSON.stringify(erreurs));
  await page.close();
}

const inj = (muter, fini, apres) => {};   /* documentation : chaque cas fait son injection */

await cas('ENTRANT VIDE (aucun événement)', fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  o.evenementsClasse = [];
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  setTimeout(() => { const d = EDT.diffInjection;
    fini({ forts: d.forts, arrivent: d.arrivent, disparaissent: d.disparaissent, faibles: d.faibles.length,
      modale: !!document.getElementById('at-modale') }); }, 700);
}, 'tout disparaît, rien n\'est deviné, aucune casse');

await cas('ENTRANT IDENTIQUE À L\'EXISTANT', fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  setTimeout(() => { const d = EDT.diffInjection;
    fini({ forts: d.forts, arrivent: d.arrivent, disparaissent: d.disparaissent, faibles: d.faibles.length }); }, 700);
}, 'tout fort, rien ne bouge, aucune question');

await cas('TOUS LES id INCONNUS (calendrier d\'une autre année)', fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  (o.evenementsClasse || []).forEach((e, i) => { e.id = 'evc:INCONNU' + i; });
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  setTimeout(() => { const d = EDT.diffInjection;
    fini({ forts: d.forts, arrivent: d.arrivent, disparaissent: d.disparaissent, faibles: d.faibles.length,
      idsGardes: (EDT_INJ.objet ? 1 : 0) }); }, 700);
}, 'l\'id inconnu ne fait pas foi : on retombe sur les critères, pas de casse');

await cas('DEUX ENTRANTS PORTANT LE MÊME id', fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  const a = (o.evenementsClasse || [])[0], b = (o.evenementsClasse || [])[1];
  b.id = a.id;
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  setTimeout(() => { const d = EDT.diffInjection;
    const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
    const ids = (cal.evenementsClasse || []).map(e => e.id);
    fini({ forts: d.forts, arrivent: d.arrivent, faibles: d.faibles.length,
      idsDistincts: new Set(ids).size, total: ids.length }); }, 900);
}, 'un existant ne s\'apparie qu\'à UN entrant : le second retombe sur les critères');

await cas('UN EXISTANT CANDIDAT DE DEUX ENTRANTS', fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  const a = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  const jumeau = JSON.parse(JSON.stringify(a)); delete jumeau.id; delete a.id;
  o.evenementsClasse.push(jumeau);
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  setTimeout(() => { const d = EDT.diffInjection;
    fini({ forts: d.forts, arrivent: d.arrivent, faibles: d.faibles.length,
      ambigus: d.ambigus.map(x => x.candidats) }); }, 700);
}, 'candidat non unique : ambiguïté NOMMÉE, aucun appariement');

await cas('ARCHIVAGE QUI TOMBE AU MILIEU D\'UNE INJECTION', fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  (o.evenementsClasse || []).forEach(e => { delete e.id; });
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [], apparie: true, diff: { faibles: [] } };
  edtInjInjecter('calendrier');
  setTimeout(() => {
    const t = document.querySelector('.at-modale-m, .at-toast');
    fini({ journal: window.__ECR.slice(), dit: t ? t.innerText.slice(0, 90) : null }); }, 900);
}, '0 écriture, le site le dit, le hub garde son état', '/corbeille/');

await cas('PAUL RÉPOND « NON » À TOUTES LES QUESTIONS', fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  (o.evenementsClasse || []).forEach(e => { delete e.id; });
  const a = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  a.libelle = 'Séjour à Verdun 3e';
  const avant = (EDT.calendrier.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0].id;
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [] };
  edtInjInjecter('calendrier');
  const repondre = () => { const m = document.getElementById('at-modale');
    const b = m && Array.from(m.querySelectorAll('button')).filter(x => /Non/.test(x.textContent))[0];
    if (b) { b.click(); setTimeout(repondre, 400); return; }
    setTimeout(() => {
      const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
      const neuf = (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
      fini({ idAvant: avant, idApres: neuf ? neuf.id : null,
        memeId: !!(neuf && neuf.id === avant) }); }, 800); };
  setTimeout(repondre, 700);
}, 'le refus est respecté : l\'entrant arrive comme neuf, l\'ancien identifiant n\'est pas repris');

await nav.close();

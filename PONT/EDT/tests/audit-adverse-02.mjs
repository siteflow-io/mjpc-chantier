/* AUDIT ADVERSE — LOT 2ter ② §⑥.12. On cherche ce qui casse.
   Usage : node tests/audit-adverse-02.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';

const hub = (cal, decisions, classes) => {
  const edt = { grille: { '2026-2027': J('grille-appariee.json') },
    calendrier: { '2026-2027': cal },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') } };
  if (decisions) edt.decisions = { '2026-2027': decisions };
  return { classes: classes || J('hub-classes.json'),
    site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt } };
};
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

async function cas(titre, etat, geste, attendu) {
  const page = await nav.newPage();
  const erreurs = []; page.on('pageerror', e => erreurs.push(String(e).slice(0, 100)));
  await page.evaluateOnNewDocument(faux, etat);
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1500);
  await page.evaluate(() => { edtOuvrir(); edtVue('calendrier');
    const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await pause(600);
  await page.evaluate(() => { window.__ECR.length = 0; });
  const r = geste ? await page.evaluate(geste, CLASSE) : await page.evaluate(c => {
    const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
    return { ecritures: window.__ECR.slice(), decisions: Object.keys(dec.heures || {}).length,
      heures: edtHeuresJustifiees(c), dit: EDT.miseANiveauDit || [] }; }, CLASSE);
  console.log('\n■ ' + titre);
  console.log('   attendu : ' + attendu);
  console.log('   mesuré  : ' + JSON.stringify(r));
  if (erreurs.length) console.log('   ⚠ erreurs de page : ' + JSON.stringify(erreurs));
  await page.close();
  return r;
}

const calNu = J('calendrier-2026-2027.json');

/* ① coche sur un événement dont aucune classe n'est appariée (niveau 4e) */
await cas('COCHE SUR UNE HEURE SANS CLASSE APPARIÉE (événement 4e)', hub(calNu), c => {
  const cal = window.__HUB.site.edt.calendrier['2026-2027'];
  const e = (cal.evenementsClasse || []).filter(x => x.niveau === '4e')[0];
  edtJustifier(e.id, true);
  const dec = (window.__HUB.site.edt.decisions || {})['2026-2027'] || {};
  return { evenement: e.libelle.slice(0, 30), heuresTrouvees: edtHeuresDeLEvenement(e).length,
    ecritures: window.__ECR.slice(), magasin: Object.keys(dec).length,
    toast: (document.querySelector('.at-modale-m, #at-info, .at-toast') || {}).innerText || null };
}, 'aucune heure : rien n\'est écrit, et le site le dit');

/* ② deux événements cochés qui couvrent la même heure */
await cas('DEUX ÉVÉNEMENTS SUR LA MÊME HEURE', hub(calNu), c => {
  const cal = window.__HUB.site.edt.calendrier['2026-2027'];
  const trois = (cal.evenementsClasse || []).filter(x => x.niveau === '3e');
  const a = trois.filter(x => (x.libelle || '').indexOf('Verdun') >= 0)[0];
  const jumeau = JSON.parse(JSON.stringify(a));
  jumeau.id = 'evc:JUMEAU'; jumeau.libelle = 'Autre sortie 3e';
  cal.evenementsClasse.push(jumeau); EDT.calendrier = cal;
  edtJustifier(a.id, true);
  return new Promise(res => setTimeout(() => {
    edtJustifier('evc:JUMEAU', true);
    setTimeout(() => {
      const m = document.getElementById('at-modale');
      const b = m && Array.from(m.querySelectorAll('button')).filter(x => /Remplacer/.test(x.textContent))[0];
      if (b) b.click();
      setTimeout(() => {
        const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
        const h = dec.heures || {};
        res({ modaleVue: !!m, texte: m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 130) : null,
          cles: Object.keys(h).length, proprietaires: Object.keys(h).map(k => h[k].evenement),
          heures: edtHeuresJustifiees(c), ecritures: window.__ECR.slice() });
      }, 700); }, 700); }, 700));
}, 'le site dit avant, le plus récent gagne, chaque heure compte une fois');

/* ③ calendrier à moitié migré : certains événements portent encore le champ */
const calMoitie = JSON.parse(JSON.stringify(J('calendrier-herite-coche.json')));
calMoitie.evenementsClasse.forEach((e, i) => { if (i % 2 === 0) delete e.justifie; });
await cas('CALENDRIER À MOITIÉ MIGRÉ', hub(calMoitie), null,
  'la reprise ne traite que ce qui reste, puis le champ disparaît');

/* ④ le magasin des décisions est absent */
await cas('MAGASIN « decisions » ABSENT (hub vide — l\'état réel)', hub(calNu), null,
  'aucune casse, aucune écriture inutile');

/* ⑤ une classe renommée entre deux chargements */
const classes2 = JSON.parse(JSON.stringify(J('hub-classes.json')));
classes2['3E CHARLES DE GAULLE'] = classes2[CLASSE]; delete classes2[CLASSE];
const dejaDecide = { [CLASSE]: { heures: {
  '2026-10-14_10h07-11h02_3E_Charles_de_Gaulle': { ecartJustifie: true, evenement: 'evc:dqzc47', libelle: 'Séjour Verdun 3e', pose: 1 } },
  journal: [] } };
await cas('CLASSE RENOMMÉE ENTRE DEUX CHARGEMENTS', hub(calNu, dejaDecide, classes2), c => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {});
  return { ecritures: window.__ECR.slice(),
    clesSousAncienNom: Object.keys((dec['3E Charles de Gaulle'] || {}).heures || {}).length,
    clesSousNouveauNom: Object.keys((dec['3E CHARLES DE GAULLE'] || {}).heures || {}).length,
    heuresAncien: edtHeuresJustifiees('3E Charles de Gaulle'),
    heuresNouveau: edtHeuresJustifiees('3E CHARLES DE GAULLE') };
}, 'rien n\'est perdu ni déplacé tout seul — à déclarer si le compte suit l\'ancien nom');

/* ⑥ décision dont l'événement n'existe plus */
const calSansVerdun = JSON.parse(JSON.stringify(calNu));
calSansVerdun.evenementsClasse = calSansVerdun.evenementsClasse.filter(x => (x.libelle || '').indexOf('Verdun') < 0);
await cas('DÉCISION DONT L\'ÉVÉNEMENT A DISPARU', hub(calSansVerdun, dejaDecide), c => {
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  return { decisions: Object.keys(dec.heures || {}).length, heures: edtHeuresJustifiees(c),
    orphelines: edtCochesDeLEvenement('evc:dqzc47').length, ecritures: window.__ECR.slice() };
}, 'la décision reste, l\'heure compte toujours, rien n\'est effacé');

await nav.close();

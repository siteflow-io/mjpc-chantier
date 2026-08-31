/* CAPTURES PAR CLICS — LOT 2ter ①ter §③.
   Parcours réel : panneau prof → Emploi du temps → nouvelle version datée →
   ouvrir la grille → déplacer une heure → revenir sur la grille.
   Tout se fait par CLICS (page.click / page.mouse), sauf la seule ligne déclarée :
   document.body.classList.add('admin-mode') — la marque du professeur connecté,
   méthode de tests/banc-2b.mjs et tests/banc-versions.mjs (LOT 2bis).
   Faux hub REST par evaluateOnNewDocument : aucune requête ne sort.
   Usage : node tests/captures-clics-01ter.mjs <index.html> <prefixe> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const P = process.argv[3] || '01ter';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const store = { classes: J('hub-classes.json'), site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
  grille: { '2026-2027': J('grille-appariee.json') },
  calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
  creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } };

const jrn = [];
const dit = t => { jrn.push(t); console.log(t); };

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 768 });
await page.evaluateOnNewDocument(s => {
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
}, store);

/* le voile du site (fi-overlay) recouvre l'écran et intercepte les pointeurs :
   il se retire comme dans tests/banc-2b.mjs et tests/banc-versions.mjs (LOT 2bis). */
const nettoyer = () => page.evaluate(() => {
  document.querySelectorAll('button').forEach(x => {
    if (!x.closest('#edt-ecran') && !x.closest('#edt-modale')
      && /^\s*Compris\s*$/.test(x.textContent)) x.click(); });   /* on ne clique JAMAIS « Annuler » : ce serait répondre à la place de Paul */
  const o = document.getElementById('fi-overlay'); if (o) o.remove();
});
const shot = async n => { await nettoyer(); await page.screenshot({ path: 'tests/' + P + '-clic-' + n + '.png' }); };
const pause = ms => new Promise(r => setTimeout(r, ms));
const cliquerTexte = async (sel, txt) => page.evaluate((s, t) => {
  const el = Array.from(document.querySelectorAll(s))
    .filter(x => ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0];
  if (!el) return false; el.click(); return true; }, sel, txt);
const etatGrille = () => page.evaluate(() => {
  const g = window.__HUB.site.edt.grille['2026-2027'];
  const v = g.versions || [{ debut: '(forme simple)', creneaux: g.creneaux || [] }];
  return v.map(x => ({ debut: x.debut, n: (x.creneaux || []).length,
    sansId: (x.creneaux || []).filter(c => !c.id).length,
    distincts: new Set((x.creneaux || []).map(c => c.id)).size })); });

await page.goto('file://' + FICHIER, { waitUntil: 'load' });
await pause(1100);
dit('version affichée : ' + await page.evaluate(() => (document.getElementById('proto-badge') || {}).innerText || '?'));

/* la seule ligne non cliquée, déclarée : la marque du professeur connecté */
await page.evaluate(() => document.body.classList.add('admin-mode'));
await pause(300);

/* ① CLIC — le panneau prof */
await page.click('#tprof-btn'); await pause(800);
await shot('1-panneau-prof');
dit('① clic « 🛠 Panneau prof » → panneau ouvert : '
  + await page.evaluate(() => document.querySelectorAll('.tprof-section-btn').length) + ' sections');

/* ② CLIC — la section Emploi du temps */
await cliquerTexte('.tprof-section-btn', "showProfSection('edt')"); await pause(1300);
await shot('2-section-edt');
dit('② clic « 📅 Emploi du temps » → état de la grille au hub : ' + JSON.stringify(await etatGrille()));

/* ③ CLIC — nouvelle version datée */
await cliquerTexte('#edt-panneau [onclick]', 'edtVersionAjouterGeste'); await pause(700);
await shot('3-nouvelle-version');
dit('③ clic « + Nouvelle version à partir d\'une date » → modale : '
  + JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('.at-modale button')).map(b => b.innerText.trim()))));

await cliquerTexte('.at-modale button', 'Créer'); await pause(1400);
await shot('4-version-creee');
dit('④ clic « Créer à partir d\'aujourd\'hui » → versions au hub : ' + JSON.stringify(await etatGrille()));

/* ⑤ CLIC — ouvrir l'emploi du temps */
await cliquerTexte('#edt-panneau [onclick]', 'edtOuvrir'); await pause(1600);
await shot('5-grille');
/* aller à une semaine de cours, PAR CLICS sur la flèche « › » de l'écran */
let sauts = 0;
while (sauts < 8) {
  const et = await page.evaluate(() => { const c = {};
    Object.values(EDT_VUE.cellules || {}).forEach(x => { c[x.nature] = (c[x.nature] || 0) + 1; });
    return { ancre: EDT_VUE.ancre, natures: c }; });
  dit('   semaine ' + et.ancre + ' : ' + JSON.stringify(et.natures));
  if ((et.natures.prevu || 0) > 0) break;
  const ok = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('#edt-ecran button, #edt-ecran [onclick]'))
      .filter(x => (x.innerText || '').trim() === '\u203a')[0];
    if (!b) return false; b.click(); return true; });
  if (!ok) break;
  sauts++; await pause(500);
}
dit('   natures présentes : ' + JSON.stringify(await page.evaluate(() => {
  const c = {}; Object.values(EDT_VUE.cellules || {}).forEach(x => { c[x.nature] = (c[x.nature] || 0) + 1; });
  return { natures: c, exemple: Object.keys(EDT_VUE.cellules || {}).slice(0, 3),
    classes: (typeof EDT_CLASSES === 'object' && EDT_CLASSES) ? Object.keys(EDT_CLASSES).length : 'non chargées' }; })));
dit('   navigation par clics sur « \u203a » : ' + sauts + ' semaine(s) avancée(s) — semaine affichée : '
  + await page.evaluate(() => EDT_VUE.ancre));

const cases = await page.evaluate(() => {
  const prevu = Object.keys(EDT_VUE.cellules || {}).filter(k => (EDT_VUE.cellules[k] || {}).nature === 'prevu');
  const clics = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).map(n => {
    const oc = n.getAttribute('onclick') || '';
    const cle = (oc.match(/edtCaseClic\((?:"|&quot;|')([^"']+)/) || [])[1] || '';
    const r = n.getBoundingClientRect();
    return { cle, prevu: prevu.indexOf(cle) >= 0, txt: (n.innerText || '').trim().slice(0, 30),
      x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height };
  }).filter(c => c.w > 5 && c.h > 5);
  const libres = Array.from(document.querySelectorAll('#edt-ecran [data-iso][data-creneau]'))
    .filter(n => !n.querySelector('.edt-clic'))
    .map(n => { const r = n.getBoundingClientRect();
      return { iso: n.getAttribute('data-iso'), creneau: n.getAttribute('data-creneau'),
        x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height }; })
    .filter(c => c.w > 5 && c.h > 5);
  return { clics, libres, prevu: prevu.length };
});
dit('⑤ clic « 📅 Ouvrir l\'emploi du temps » → ' + cases.clics.length + ' cases occupées à l\'écran, '
  + cases.prevu + ' de nature « prévu » (saisissables), ' + cases.libres.length + ' cases libres');

/* ⑥ GLISSER-DÉPOSER — une heure occupée vers une case libre */
const source = cases.clics.filter(c => c.prevu)[0];
const auj = '2026-08-31';
const cible = cases.libres.filter(c => c.iso >= auj)[0];
if (source && cible) {
  source.iso = source.cle.split('|')[0]; source.creneau = source.cle.split('|')[1];
  const idsAvant = await page.evaluate(s => {
    const g = window.__HUB.site.edt.grille['2026-2027'];
    const v = (g.versions || [])[(g.versions || []).length - 1] || { creneaux: g.creneaux || [] };
    return (v.creneaux || []).map(c => ({ id: c.id || 'PAS D\'ID', jour: c.jour, creneau: c.creneau, classe: c.classe }))
      .filter(c => c.creneau === s.creneau); }, source);
  dit('⑥ glisser : ' + source.iso + ' ' + source.creneau + ' (« ' + source.txt.replace(/\n/g, ' ')
    + ' ») → ' + cible.iso + ' ' + cible.creneau);
  dit('   créneaux de cet horaire AVANT : ' + JSON.stringify(idsAvant));
  await page.evaluate(() => { window.__DEPOT = []; const vrai = window.edtDepot;
    window.edtDepot = function (a, b) { window.__DEPOT.push({ src: a, dst: b,
      refus: (typeof edtRefusDepot === 'function' && edtCellule(a)) ? edtRefusDepot(edtCellule(a), b) : '?' });
      return vrai.apply(this, arguments); }; });
  dit('   sous le pointeur, source : ' + JSON.stringify(await page.evaluate(p => {
    const el = document.elementFromPoint(p.x, p.y);
    return el ? { tag: el.tagName, cls: (el.className || '').toString().slice(0, 40),
      clic: !!(el.closest && el.closest('.edt-clic')), onpd: !!(el.closest && el.closest('[onpointerdown]')) } : null; }, source)));
  dit('   sous le pointeur, cible : ' + JSON.stringify(await page.evaluate(p => {
    const el = document.elementFromPoint(p.x, p.y);
    return el ? { tag: el.tagName, cls: (el.className || '').toString().slice(0, 40),
      case: !!(el.closest && el.closest('[data-iso]')) } : null; }, cible)));
  await nettoyer();
  await page.mouse.move(source.x, source.y);
  await page.mouse.down();
  await page.mouse.move(source.x + 40, source.y + 20, { steps: 6 });
  await page.mouse.move(cible.x, cible.y, { steps: 14 });
  await page.mouse.up();
  await pause(900);
  await shot('6-question-du-depot');
  dit('   edtDepot appelée : ' + JSON.stringify(await page.evaluate(() => window.__DEPOT)));
  dit('   modales à l\'écran : ' + JSON.stringify(await page.evaluate(() =>
    Array.from(document.querySelectorAll('.at-modale, #edt-question, [id*=question]')).map(x => (x.innerText || '').slice(0, 160)))));
  dit('   question du dépôt : ' + JSON.stringify(await page.evaluate(() =>
    Array.from(document.querySelectorAll('.at-modale button, #edt-question button')).map(b => b.innerText.trim().slice(0, 40)))));

  /* le geste durable : changement d'emploi du temps */
  dit('   date d\'effet proposée : ' + await page.evaluate(() => (document.getElementById('edt-q-effet') || {}).value || '(aucune)')
    + ' · créneau visé : ' + await page.evaluate(() => (document.getElementById('edt-q-creneau') || {}).value || '(aucun)'));
  const ok = await cliquerTexte('#edt-question button', "edtValiderDepot('edt'");
  await pause(1500);
  await shot('7-heure-deplacee');
  dit('   clic sur le geste durable : ' + (ok ? 'fait' : 'bouton non trouvé'));
  const idsApres = await page.evaluate(s => {
    const g = window.__HUB.site.edt.grille['2026-2027'];
    return (g.versions || []).map(v => ({ debut: v.debut,
      creneaux: (v.creneaux || []).filter(c => c.creneau === s.creneau)
        .map(c => ({ id: c.id || 'PAS D\'ID', jour: c.jour, creneau: c.creneau, classe: c.classe })) })); }, source);
  dit('   créneaux de cet horaire APRÈS, version par version : ' + JSON.stringify(idsApres));
  const suivi = await page.evaluate(a => {
    const g = window.__HUB.site.edt.grille['2026-2027'];
    const cible = (a[0] || {}).id;
    return (g.versions || []).map(v => { const t = (v.creneaux || []).filter(c => c.id === cible)[0];
      return { version: v.debut, trouve: t ? { id: t.id, jour: t.jour, creneau: t.creneau, classe: t.classe } : null,
        sansId: (v.creneaux || []).filter(c => !c.id).length,
        distincts: new Set((v.creneaux || []).map(c => c.id)).size, n: (v.creneaux || []).length }; }); }, idsAvant);
  dit('   LE CRÉNEAU DÉPLACÉ, suivi par son identifiant : ' + JSON.stringify(suivi));
} else {
  dit('⑥ aucune paire source/cible utilisable — source: ' + JSON.stringify(source) + ' cible: ' + JSON.stringify(cible));
}

/* ⑦ retour sur la grille */
await pause(400);
await shot('8-retour-grille');
dit('⑦ état final de la grille au hub : ' + JSON.stringify(await etatGrille()));
dit('écritures hub du parcours : ' + JSON.stringify(await page.evaluate(() => window.__ECR)));
fs.writeFileSync('tests/' + P + '-clics-journal.txt', jrn.join('\n'), 'utf8');
await nav.close();

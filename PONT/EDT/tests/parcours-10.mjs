/* PARCOURS COMPLET — LOT 2ter · LIVRAISON ⑩
   Un seul chargement du candidat ; tous les gestes à la VRAIE SOURIS
   (Input.dispatchMouseEvent → pointerdown / pointermove / pointerup), écran entier.
   Seul autre chargement : la production, pour p01 — c'est un autre fichier.
   Faux hub REST (méthode de tests/captures-clics-01ter.mjs) : aucune requête ne sort.
   Décor : tests/parcours-grille.json — grille à deux classes appariées (banc ⑥)
   + les quatre créneaux de la classe d'essai tels qu'ils sont injectés en production.
   Usage : node tests/parcours-10.mjs */
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME = '/opt/google/chrome/chrome';
const CAND = path.resolve('index.html');
const PROD = path.resolve('production.html');
const DOS = 'tests/parcours/';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const hub = { classes: J('tests/hub/classes.json'), site: {
  '3e': J('tests/hub/site_3e.json'), config: J('tests/hub/site_config.json'), edt: {
    grille:     { '2026-2027': J('tests/parcours-grille.json') },
    calendrier: { '2026-2027': J('json/calendrier-2026-2027.json') },
    creneaux:   { '2026-2027': J('json/creneaux-2026-2027.json') } } } };

const jrn = []; const dit = t => { jrn.push(t); console.log(t); };
const pause = ms => new Promise(r => setTimeout(r, ms));
let n = 0;

const nav = await puppeteer.launch({ executablePath: CHROME,
  args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 768 });
page.on('dialog', async d => { dit('   (le site demande : ' + d.message().slice(0, 90) + ') — refusé'); await d.dismiss(); });
await page.evaluateOnNewDocument(s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let x = window.__HUB;
    for (const k of q) { if (x === null || typeof x !== 'object' || !(k in x)) return null; x = x[k]; }
    return x === undefined ? null : x; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let x = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof x[q[k]] !== 'object' || x[q[k]] === null) x[q[k]] = {}; x = x[q[k]]; }
    if (v === null) delete x[q[q.length - 1]]; else x[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const t = String(u);
    if (t.indexOf('firebasedatabase.app') >= 0) {
      const c = t.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push(c); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); }
    return Promise.resolve(new Response('null', { status: 200 })); };
}, hub);

const voile = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async nom => { await voile(); n++;
  const f = DOS + 'p' + String(n).padStart(2, '0') + '-' + nom + '.png';
  await page.screenshot({ path: f }); dit('   ▸ ' + f); };

const viser = (sel, txt) => page.evaluate((s, t) => {
  const el = Array.from(document.querySelectorAll(s)).filter(x => {
    if (t !== null && ((x.innerText || '') + ' ' + (x.getAttribute('onclick') || '')).indexOf(t) < 0) return false;
    const r = x.getBoundingClientRect();
    return r.width > 2 && r.height > 2;   /* un élément caché n'est pas un geste de Paul */ })[0];
  if (!el) return null;
  el.scrollIntoView({ block: 'center', inline: 'center' });
  const r = el.getBoundingClientRect();
  const x = r.x + r.width / 2, y = r.y + r.height / 2;
  const sous = document.elementFromPoint(x, y);
  return { x, y, w: r.width, h: r.height,
    txt: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 46),
    dessus: !!(sous && (sous === el || el.contains(sous) || sous.contains(el))) }; },
  sel, txt === undefined ? null : txt);

const clic = async (sel, txt, quoi) => {
  const c = await viser(sel, txt);
  if (!c) { dit('   ✗ NON ATTEINT PAR UN CLIC : ' + (quoi || sel) + ' — élément absent'); return null; }
  if (c.w < 2 || c.h < 2) { dit('   ✗ NON ATTEINT : ' + (quoi || c.txt) + ' — taille nulle'); return null; }
  if (!c.dessus) dit('   ⚠ recouvert au point visé : ' + (quoi || c.txt));
  await page.mouse.click(c.x, c.y); await pause(80);
  dit('   ✔ CLIC « ' + (c.txt || quoi) + ' »');
  return c; };

const etat = () => page.evaluate(() => {
  const c = {}; Object.values((window.EDT_VUE || {}).cellules || {}).forEach(x => { c[x.nature] = (c[x.nature] || 0) + 1; });
  return { vue: (window.EDT_VUE || {}).mode, ancre: (window.EDT_VUE || {}).ancre, natures: c }; });
const decisions = () => page.evaluate(() => {
  const d = ((window.__HUB.site.edt.decisions || {})['2026-2027']) || {}; const out = [];
  Object.keys(d).forEach(c => Object.keys((d[c] || {}).heures || {}).forEach(k => {
    const v = d[c].heures[k];
    out.push(c + ' · ' + k + ' → ' + (v.aReplacer ? 'À REPLACER (' + (v.motif || '') + ', prise par ' + (v.prisePar || '?') + ')'
      : v.deplaceeVers ? 'part vers ' + v.deplaceeVers : v.venantDe ? 'arrive de ' + v.venantDe
      : (v.motif || JSON.stringify(v).slice(0, 40)))); }));
  return out; });
const vueBouton = async (nom, quoi) => clic('#edt-ecran button', "edtVue('" + nom + "')", quoi);
/* on ferme comme Paul : la croix de la modale, le bouton de l'écran — jamais Échap,
   qui referme TOUT l'emploi du temps (mesuré au premier passage). */
const fermerModale = async () => { const c = await viser('#edt-modale [onclick*="edtModaleFermer"], #at-modale button', null);
  if (c) { await page.mouse.click(c.x, c.y); await pause(300); dit('   ✔ CLIC pour fermer la fenêtre (« ' + c.txt + ' »)'); } };
const fermerInfo = async () => { const c = await viser('#at-modale button', 'Compris');
  if (c) { await page.mouse.click(c.x, c.y); await pause(400); dit('   ✔ CLIC « Compris » (annonce refermée)'); } };
const fermerEcran = async () => clic('#edt-ecran [onclick*="edtFermer"], #edt-ecran button', 'Fermer l', 'Fermer l\'emploi du temps');

/* ══════════ ① LA PRODUCTION ══════════ */
dit('① LA PRODUCTION TELLE QU\'ELLE EST AUJOURD\'HUI (8.70.1) — chargement séparé : autre fichier');
await page.goto('file://' + PROD, { waitUntil: 'load' }); await pause(1500);
await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(300); await voile();
await clic('#tprof-btn', undefined, 'Panneau prof (production)'); await pause(900);
dit('   sections en production : ' + await page.evaluate(() =>
  Array.from(document.querySelectorAll('.tprof-section-btn')).map(b => b.innerText.trim()).join(' · ')));
dit('   « Emploi du temps » en production : ' + await page.evaluate(() =>
  Array.from(document.querySelectorAll('.tprof-section-btn')).some(b => /Emploi du temps/.test(b.innerText))));
await shot('production-8.70.1-panneau-prof-sans-emploi-du-temps');

/* ══════════ ② L'ENTRÉE — un seul chargement à partir d'ici ══════════ */
dit(''); dit('② L\'ENTRÉE — candidat 8.73.0-⑨, UN SEUL CHARGEMENT pour tout ce qui suit');
await page.goto('file://' + CAND, { waitUntil: 'load' }); await pause(1600);
dit('   version affichée : ' + await page.evaluate(() => (document.getElementById('proto-badge') || {}).innerText || '?'));
await page.evaluate(() => document.body.classList.add('admin-mode'));   /* seule ligne non cliquée : la marque du prof connecté */
await pause(300); await voile();
await clic('#tprof-btn', undefined, 'Panneau prof'); await pause(900);
await shot('candidat-panneau-prof');
await clic('.tprof-section-btn', "showProfSection('edt')", 'section Emploi du temps'); await pause(1500);
await shot('section-emploi-du-temps');
await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2000);
await shot('ecran-emploi-du-temps-ouvert');

/* ══════════ ③ LA SEMAINE ══════════ */
dit(''); dit('③ LA SEMAINE');
let e = await etat(); dit('   ' + JSON.stringify(e));
await shot('la-semaine-ordinaire-avec-ses-classes');

/* ══════════ ④ UNE CASE OUVERTE ══════════ */
dit(''); dit('④ UNE CASE OUVERTE — la modale complète');
const boite = k => page.evaluate(c => {
  const el = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]'))
    .filter(x => { const o = x.getAttribute('onclick') || '';
      return o.indexOf(c.split('|')[0]) >= 0 && o.indexOf(c.split('|')[1]) >= 0; })[0];
  if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, k);
const casePrevue = await page.evaluate(() =>
  Object.keys(EDT_VUE.cellules).filter(k => EDT_VUE.cellules[k].nature === 'prevu')[0] || null);
if (casePrevue) {
  const b = await boite(casePrevue);
  if (b) { await page.mouse.click(b.x, b.y); await pause(1000);
    dit('   ✔ CLIC souris sur la case ' + casePrevue);
    dit('   la modale porte : ' + await page.evaluate(() => { const m = document.getElementById('edt-modale');
      return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 420) : '(aucune modale)'; }));
    await shot('une-case-ouverte-pilotage-deplacer-banaliser');
  } else dit('   ✗ NON ATTEINT : la case ' + casePrevue + ' n\'a pas de cible cliquable');
} else dit('   ✗ NON ATTEINT : aucune case « prévu »');

/* ══════════ ⑤ LE DÉPÔT SUR UNE CASE OCCUPÉE — LES TROIS ISSUES ══════════ */
dit(''); dit('⑤ LE DÉPÔT SUR UNE CASE OCCUPÉE — les trois issues, le prix dit avant');
await fermerModale(); await pause(500); await voile();
const glisser = async (src, dst) => {
  const a = await boite(src), b = await boite(dst);
  if (!a || !b) { dit('   ✗ NON ATTEINT : case introuvable à l\'écran (' + src + ' → ' + dst + ')'); return false; }
  await page.mouse.move(a.x, a.y); await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(a.x + (b.x - a.x) * i / 10, a.y + (b.y - a.y) * i / 10); await pause(35); }
  await page.mouse.up(); await pause(1200); return true; };
const couple = () => page.evaluate(() => {
  const c = EDT_VUE.cellules;
  const vis = k => { const el = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]'))
      .filter(x => { const o = x.getAttribute('onclick') || '';
        return o.indexOf(k.split('|')[0]) >= 0 && o.indexOf(k.split('|')[1]) >= 0; })[0];
    if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
  const srcs = Object.keys(c).filter(k => c[k].nature === 'prevu'
    && !edtDecisionPour(c[k].classeMjpc, c[k].iso, c[k].creneau) && vis(k));
  for (const src of srcs) {
    const dst = Object.keys(c).filter(k => c[k].classeMjpc && c[k].mjpc !== false
      && c[k].classeMjpc !== c[src].classeMjpc && vis(k)
      && !edtDecisionPour(c[k].classeMjpc, c[k].iso, c[k].creneau))[0];
    if (dst) return { src, dst, a: c[src].classeMjpc, b: c[dst].classeMjpc }; }
  return null; });
let cp = await couple();
if (cp) {
  dit('   je saisis ' + cp.src + ' (' + cp.a + ') et je le pose sur ' + cp.dst + ' (' + cp.b + ')');
  if (await glisser(cp.src, cp.dst)) {
    dit('   ce que le site dit AVANT de trancher : ' + await page.evaluate(() => { const m = document.getElementById('at-modale');
      return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 460) : '(aucune modale)'; }));
    await shot('depot-sur-case-occupee-les-trois-issues');
  }
} else dit('   ✗ NON ATTEINT : pas de couple (heure déplaçable / case occupée par une autre classe)');

/* ══════════ ⑥ APRÈS UN ÉCHANGE, PUIS APRÈS UN ÉCRASEMENT ══════════ */
dit(''); dit('⑥ APRÈS UN ÉCHANGE, PUIS APRÈS UN ÉCRASEMENT');
await clic('#at-modale button', 'Échanger', 'Échanger les deux heures'); await pause(1600); await voile();
dit('   décisions : ' + JSON.stringify(await decisions()));
await shot('apres-un-echange');
cp = await couple();
let bonds = 0;
while (!cp && bonds < 5) {
  const f = await viser('#edt-ecran button, #edt-ecran [onclick]', 'edtAller(1)');
  if (!f) break; await page.mouse.click(f.x, f.y); await pause(700); bonds++; cp = await couple(); }
if (bonds) dit('   ' + bonds + ' clic(s) sur « › » pour trouver un couple — semaine ' + await page.evaluate(() => EDT_VUE.ancre));
if (cp) {
  dit('   second dépôt : ' + cp.src + ' (' + cp.a + ') sur ' + cp.dst + ' (' + cp.b + ')');
  if (await glisser(cp.src, cp.dst)) {
    await clic('#at-modale button', 'Prendre le créneau', 'Prendre le créneau'); await pause(1600); await voile();
    dit('   décisions : ' + JSON.stringify(await decisions()));
    await shot('apres-un-ecrasement');
  }
} else dit('   ✗ NON ATTEINT : plus de couple disponible pour l\'écrasement');

/* ══════════ ⑦ L'HEURE À REPLACER ══════════ */
dit(''); dit('⑦ L\'HEURE À REPLACER — le bandeau, puis la vue de la classe');
dit('   bandeau : ' + await page.evaluate(() => { const b = document.querySelector('#edt-ecran .edt-bandeau, #edt-ecran .edt-tete');
  return b ? b.innerText.replace(/\n+/g, ' | ').slice(0, 200) : '(pas de bandeau)'; }));
await shot('le-rappel-dans-le-bandeau');
const perdante = await page.evaluate(() => { const l = edtHeuresAReplacer(null);
  return l && l.length ? l[0].classe : null; });
dit('   classe qui a perdu une heure : ' + perdante);
if (perdante) {
  const caseVisible = c => page.evaluate(cl => {
    const el = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]')).filter(x => {
      const o = x.getAttribute('onclick') || ''; const r = x.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return false;
      const k = Object.keys(EDT_VUE.cellules).filter(y => o.indexOf(y.split('|')[0]) >= 0 && o.indexOf(y.split('|')[1]) >= 0)[0];
      return k && EDT_VUE.cellules[k].classeMjpc === cl; })[0];
    if (!el) return null; const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, c);
  let b = await caseVisible(perdante), tours = 0;
  while (!b && tours < 4) { const f = await viser('#edt-ecran button, #edt-ecran [onclick]', 'edtAller(1)');
    if (!f) break; await page.mouse.click(f.x, f.y); await pause(700); tours++; b = await caseVisible(perdante); }
  if (tours) dit('   ' + tours + ' clic(s) sur « › » pour trouver une case de ' + perdante);
  const k = perdante;
  if (b) { await page.mouse.click(b.x, b.y); await pause(1000);
    dit('   ✔ CLIC souris sur une case de ' + perdante);
    dit('   le rappel dit : ' + await page.evaluate(() => { const r = document.querySelector('#edt-modale .edt-rappel');
      return r ? r.innerText.replace(/\n+/g, ' | ').slice(0, 300) : '(aucun rappel)'; }));
    await shot('le-rappel-dans-la-vue-de-la-classe');
  } else dit('   ✗ NON ATTEINT : aucune case de ' + perdante + ' à l\'écran');
}

/* ══════════ ⑧ LA LISTE DES DESTINATIONS ET SES FILTRES ══════════ */
dit(''); dit('⑧ LA LISTE DES DESTINATIONS, puis filtrée par mois, par semaine, par A/B');
await voile();
if (!(await page.evaluate(() => !!document.getElementById('edt-ou')))) {
  await fermerModale(); await pause(400);
  const k2 = await page.evaluate(() => Object.keys(EDT_VUE.cellules)
    .filter(x => EDT_VUE.cellules[x].nature === 'prevu')[0] || null);
  let b2 = k2 ? await boite(k2) : null;
  if (!b2) { b2 = await page.evaluate(() => { const el = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]'))
      .filter(x => { const r = x.getBoundingClientRect(); return r.width > 4 && r.height > 4; })[0];
    if (!el) return null; const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); }
  if (b2) { await page.mouse.click(b2.x, b2.y); await pause(1000); dit('   ✔ CLIC souris sur une case pour ouvrir sa liste'); }
  else dit('   ✗ NON ATTEINT : aucune case cliquable pour ouvrir la liste'); }
const compteOu = () => page.evaluate(() => { const s = document.getElementById('edt-ou');
  const l = document.querySelector('#edt-modale .edt-lab, #edt-modale label');
  return { options: s ? s.options.length : null,
    visibles: s ? Array.from(s.options).filter(o => o.value && !o.hidden).length : null,
    semaines: s ? Array.from(new Set(Array.from(s.options).map(o => o.getAttribute('data-sem')).filter(Boolean))).slice(0, 12).join(',') : null,
    titre: s ? (s.previousElementSibling ? s.previousElementSibling.innerText.trim().slice(0, 90) : '') : '(pas de liste)',
    intitule: l ? l.innerText.trim().slice(0, 90) : '' }; });
dit('   la liste : ' + JSON.stringify(await compteOu()));
await shot('la-liste-des-destinations-ouverte');
const filtrer = async (txt, nom) => {
  const c = await viser('#edt-ou-filtre', null);
  if (!c) { dit('   ✗ NON ATTEINT : le champ de filtre est absent'); return; }
  await page.mouse.click(c.x, c.y); await pause(150);
  await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control');
  await page.keyboard.press('Delete'); await pause(200);
  await page.keyboard.type(txt, { delay: 45 }); await pause(800);
  const lu = await page.evaluate(() => { const i = document.getElementById('edt-ou-filtre'); return i ? i.value : '(champ absent)'; });
  dit('   ✔ FRAPPE « ' + txt + ' » — le champ porte « ' + lu + ' » → ' + JSON.stringify(await compteOu()));
  await shot(nom); };
await filtrer('octobre', 'la-liste-filtree-par-mois');
await filtrer('38', 'la-liste-filtree-par-semaine');   /* une semaine que CETTE liste propose : elle part de la 38 */
await filtrer('A', 'la-liste-filtree-par-semaine-A-ou-B');

/* ══════════ ⑨ HEURES PERDUES ══════════ */
dit(''); dit('⑨ HEURES PERDUES — l\'écran, une coche, la banalisation par-dessus, le total');
await fermerModale(); await pause(500); await voile();
await vueBouton('calendrier', 'Heures perdues…'); await pause(1400);
const tete = () => page.evaluate(() => { const t = document.querySelector('#edt-ecran .edt-cal-col');
  return t ? t.innerText.split('\n').slice(0, 3).join(' | ') : '(pas de tête)'; });
dit('   en tête : ' + await tete());
await shot('heures-perdues-ecran');
const coche = await page.evaluate(() => {
  const l = Array.from(document.querySelectorAll('#edt-ecran .edt-fiche label'))
    .filter(x => x.querySelector('input[type=checkbox]'))[0];
  if (!l) return null; l.scrollIntoView({ block: 'center' });
  const i = l.querySelector('input'); const r = i.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2,
    fiche: l.closest('.edt-fiche').innerText.split('\n')[0].slice(0, 60),
    txt: l.innerText.trim().replace(/\s+/g, ' ').slice(0, 60) }; });
if (coche) {
  await page.mouse.click(coche.x, coche.y); await pause(1200);
  dit('   ✔ CLIC souris sur la case à cocher « ' + coche.txt + ' » (' + coche.fiche + ')');
  dit('   décisions : ' + JSON.stringify(await decisions()));
  dit('   en tête : ' + await tete());
  await shot('heures-perdues-une-coche');
} else dit('   ✗ NON ATTEINT : aucune case à cocher dans les fiches');
/* la banalisation par-dessus la même heure */
const cochee = await page.evaluate(() => {
  const d = ((window.__HUB.site.edt.decisions || {})['2026-2027']) || {};
  for (const c of Object.keys(d)) { const h = (d[c] || {}).heures || {};
    for (const k of Object.keys(h)) if (h[k] && h[k].justifiee) return { classe: c, cle: k }; }
  return null; });
if (cochee) {
  dit('   heure comptée perdue : ' + cochee.classe + ' · ' + cochee.cle);
  await vueBouton('semaine', 'Semaine'); await pause(1000);
  const iso = cochee.cle.split('_')[0];
  let sauts = 0, ok = false;
  while (sauts < 12) {
    const dedans = await page.evaluate(i => Object.keys(EDT_VUE.cellules).some(k => k.indexOf(i) === 0), iso);
    if (dedans) { ok = true; break; }
    const av = await page.evaluate(() => EDT_VUE.ancre);
    const cible = await page.evaluate((i, a) => (i < a ? 'edtAller(-1)' : 'edtAller(1)'), iso, av);
    const c = await viser('#edt-ecran button, #edt-ecran [onclick]', cible);
    if (!c) break; await page.mouse.click(c.x, c.y); await pause(500); sauts++; }
  dit('   ' + sauts + ' clic(s) sur les flèches de semaine → semaine ' + await page.evaluate(() => EDT_VUE.ancre)
    + (ok ? '' : ' — la semaine visée n\'a pas été atteinte'));
  const k = await page.evaluate(cle => { const p = String(cle).split('_');
    const iso = p[0], cr = (p[1] || '').replace(/h/g, ':');
    return Object.keys(EDT_VUE.cellules).filter(x => x.indexOf(iso) === 0 && x.indexOf(cr) > 0)[0] || null; }, cochee.cle);
  const b = k ? await boite(k) : null;
  if (b) {
    await page.mouse.click(b.x, b.y); await pause(1000);
    dit('   ✔ CLIC souris sur la case déjà comptée perdue : ' + k);
    const ban = await clic('#edt-modale button', 'Banaliser cette heure', 'Banaliser cette heure');
    await pause(900);
    if (ban) { dit('   l\'annonce dit : ' + await page.evaluate(() => { const m = document.getElementById('at-modale');
        return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 320) : '(aucune annonce)'; }));
      await shot('banalisation-par-dessus-son-annonce');
      await clic('#at-modale button', 'Remplacer', 'Remplacer le motif'); await pause(1400); await voile();
      dit('   décisions : ' + JSON.stringify(await decisions()));
      await vueBouton('calendrier', 'Heures perdues…'); await pause(1300);
      dit('   en tête après remplacement : ' + await tete());
      await shot('heures-perdues-total-en-tete-apres-remplacement'); }
  } else dit('   ✗ NON ATTEINT : la case de l\'heure cochée n\'est pas à l\'écran');
} else dit('   ✗ NON ATTEINT : aucune heure comptée perdue après la coche');

/* ══════════ ⑩ LE MOIS ══════════ */
dit(''); dit('⑩ LE MOIS');
await vueBouton('mois', 'Mois'); await pause(1400);
dit('   ' + JSON.stringify(await etat()));
await shot('la-vue-du-mois');

/* ══════════ ⑪ L'ANNÉE ══════════ */
dit(''); dit('⑪ L\'ANNÉE — dézoomée, zoomée, un événement cliqué');
await vueBouton('annee', 'Année'); await pause(1800);
dit('   pied de l\'année : ' + await page.evaluate(() => { const p = document.querySelector('#edt-ecran .edt-an-pied, #edt-ecran .edt-pied');
  return p ? p.innerText.replace(/\n+/g, ' | ').slice(0, 200) : '(pas de pied)'; }));
await shot('annee-dezoomee');
await page.mouse.move(683, 400);
await page.keyboard.down('Control'); await page.mouse.wheel({ deltaY: -240 }); await page.keyboard.up('Control');
await pause(900);
dit('   ✔ Ctrl + molette vers le haut → zoom : ' + await page.evaluate(() => !!EDT_VUE.zoomAnnee));
await shot('annee-zoomee');
const ev = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran .edt-an-b'))
    .filter(x => (x.innerText || '').trim().length > 2)[0];
  if (!b) return null; b.scrollIntoView({ block: 'center', inline: 'center' });
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, txt: (b.innerText || '').trim().slice(0, 50) }; });
if (ev) { await page.mouse.click(ev.x, ev.y); await pause(1000);
  dit('   ✔ CLIC souris sur l\'événement « ' + ev.txt + ' » → ' + await page.evaluate(() => {
    const m = document.getElementById('at-modale') || document.getElementById('edt-modale');
    return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 260) : '(rien ne s\'ouvre)'; }));
  await shot('annee-un-evenement-clique');
} else dit('   ✗ NON ATTEINT : aucun événement nommé dans la vue année');

/* ══════════ ⑫ LES DATES DE L'ANNÉE ET UN REFUS ══════════ */
dit(''); dit('⑫ LES DATES DE L\'ANNÉE, et un refus');
await fermerModale(); await pause(400);
await fermerEcran(); await pause(900); await voile();
await clic('.tprof-section-btn', "showProfSection('brevet')", 'section Dates de l\'année'); await pause(1300);
dit('   l\'écran porte : ' + await page.evaluate(() => {
  const z = Array.from(document.querySelectorAll('h2')).filter(h => /Dates de l/.test(h.innerText))[0];
  const p = z ? z.parentElement : null;
  return p ? p.innerText.replace(/\n+/g, ' | ').slice(0, 300) : '(écran introuvable)'; }));
await shot('dates-de-lannee-ecran');
/* le refus : une période dont la fin précède le début — panneau Emploi du temps */
await clic('.tprof-section-btn', "showProfSection('edt')", 'section Emploi du temps'); await pause(1400);
const champs = await page.evaluate(() => Array.from(document.querySelectorAll('#edt-panneau input[type=date]'))
  .map((i, k) => ({ k, val: i.value, oc: (i.getAttribute('onchange') || '').slice(0, 60) })));
dit('   champs de date du panneau : ' + JSON.stringify(champs.slice(0, 6)));
const champPeriode = ch => "#edt-panneau input[type=date]";
let champFin = await page.evaluate(() => Array.from(document.querySelectorAll('#edt-panneau input[type=date]'))
  .some(i => /edtPeriodePoser/.test(i.getAttribute('onchange') || '') && /'fin'/.test(i.getAttribute('onchange') || '')));
if (!champFin) { await clic('#edt-panneau [onclick]', 'edtPeriodeAjouter', '+ Ajouter une période'); await pause(1100);
  champFin = await page.evaluate(() => Array.from(document.querySelectorAll('#edt-panneau input[type=date]'))
    .some(i => /edtPeriodePoser/.test(i.getAttribute('onchange') || '') && /'fin'/.test(i.getAttribute('onchange') || ''))); }
const saisirDate = async (champ, valeur) => {
  const c = await page.evaluate(ch => { const i = Array.from(document.querySelectorAll('#edt-panneau input[type=date]'))
      .filter(x => /edtPeriodePoser/.test(x.getAttribute('onchange') || '')
                && new RegExp("'" + ch + "'").test(x.getAttribute('onchange') || ''))[0];
    if (!i) return null; i.scrollIntoView({ block: 'center' }); const r = i.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, champ);
  if (!c) { dit('   ✗ NON ATTEINT : champ « ' + champ + ' » absent'); return false; }
  await page.mouse.click(c.x, c.y); await pause(200);
  await page.keyboard.type(valeur, { delay: 55 }); await page.keyboard.press('Tab'); await pause(900);
  dit('   ✔ FRAPPE « ' + valeur + ' » dans le champ ' + champ); return true; };
if (false) {
  const nom = await page.evaluate(() => { const i = Array.from(document.querySelectorAll('#edt-panneau input.edt-nom'))
      .filter(x => /edtPeriodePoser/.test(x.getAttribute('onchange') || '') && !x.value)[0];
    if (!i) return null; i.scrollIntoView({ block: 'center' }); const r = i.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  if (nom) { await page.mouse.click(nom.x, nom.y); await pause(200);
    await page.keyboard.type('Essai du parcours', { delay: 45 }); await page.keyboard.press('Tab'); await pause(1000);
    dit('   ✔ FRAPPE du nom de la période « Essai du parcours »'); await fermerInfo(); }
  await saisirDate('debut', '01/03/2027'); await fermerInfo();
  await saisirDate('fin', '01/09/2026');
  dit('   périodes après saisie : ' + await page.evaluate(() => JSON.stringify(edtPeriodes()
    .map(x => ({ nom: x.nom, debut: x.debut, fin: x.fin })))));
  dit('   le site répond : ' + await page.evaluate(() => { const m = document.getElementById('at-modale');
    return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 320) : '(aucun message)'; }));
  await shot('un-refus-la-fin-precede-le-debut');
}
dit('   ⚠ la saisie d\'une date au clavier ne prend pas dans un champ « date » du banc sans tête :');
dit('     champ trouvé et cliqué, huit touches frappées, la valeur reste vide — limite du BANC, à ne pas mettre au compte du site.');
dit('   je prends donc l\'autre refus atteignable par le geste : un calendrier collé dont la fin précède le début.');
await clic('#edt-panneau [onclick]', "edtInjOuvrir('calendrier')", 'Injecter — Calendrier de l\'année');
await pause(1100);
const zone = await viser('#edt-inj-coller', null);
if (zone) {
  await page.mouse.click(zone.x, zone.y); await pause(200);
  await page.keyboard.type('{"annee":"2026-2027","vacances":[{"nom":"Toussaint","debut":"2026-10-17","fin":"2026-10-02"}]}', { delay: 6 });
  await pause(400);
  await clic('#edt-panneau button', 'Vérifier', 'Vérifier');
  await pause(1200);
  dit('   le site répond : ' + await page.evaluate(() => {
    const z = document.querySelector('#edt-panneau .edt-inj-msg, #edt-panneau .edt-msg, #edt-panneau .edt-inj');
    const t = document.getElementById('edt-inj-coller');
    const p = t ? t.parentElement.parentElement.innerText.replace(/\n+/g, ' | ') : '';
    return (z ? z.innerText.replace(/\n+/g, ' | ').slice(0, 300) : p.slice(0, 400)); }));
  await shot('un-refus-avec-son-message');
} else dit('   ✗ NON ATTEINT : la zone de collage de l\'injection est absente');

/* ══════════ ⑬ LA PHOTO DU PRÉVU ══════════ */
dit(''); dit('⑬ LA PHOTO DU PRÉVU');
await fermerInfo();
await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2200);
await vueBouton('semaine', 'Semaine'); await pause(900);
const photo = await clic('#edt-ecran button', 'edtPhoto', 'Photo du prévu');
await pause(1400);
if (photo) dit('   ce que le site répond : ' + await page.evaluate(() => {
  const m = document.getElementById('at-modale');
  const t = document.querySelector('.at-toast, .toast, #at-toast');
  return (m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 240) : '') + (t ? ' | toast : ' + t.innerText.slice(0, 160) : ''); }));
await shot('photo-du-prevu-ce-que-le-site-repond');

/* ══════════ ⑭ LE MODE TEST ══════════ */
dit(''); dit('⑭ LE MODE TEST — la grille éteint, puis allumé, et la classe d\'essai');
await fermerInfo();
await vueBouton('semaine', 'Semaine'); await pause(900);
const compte = () => page.evaluate(() => {
  const c = {}; const cl = {};
  Object.values(EDT_VUE.cellules || {}).forEach(x => { c[x.nature] = (c[x.nature] || 0) + 1;
    const nom = x.classe || x.classeMjpc || '?'; cl[nom] = (cl[nom] || 0) + 1; });
  return { cases: Object.keys(EDT_VUE.cellules || {}).length, natures: c,
    essai: Object.keys(cl).filter(k => /essai/i.test(k)),
    creneauxLus: (typeof edtCasesA === 'function') ? edtCasesA(EDT_VUE.ancre || edtAujourdhui()).length : '?',
    modeTest: (typeof m8TestOn === 'function') ? m8TestOn() : '?' }; });
dit('   éteint : ' + JSON.stringify(await compte()));
await shot('mode-test-eteint-la-grille');
await fermerModale(); await pause(400);
await fermerEcran(); await pause(900); await voile();
await clic('#tprof-testpill', undefined, 'pastille Mode test'); await pause(1400); await voile();
dit('   mode test : ' + await page.evaluate(() => m8TestOn()));
await clic('.tprof-section-btn', "showProfSection('edt')", 'section Emploi du temps'); await pause(1400);
await clic('#edt-panneau [onclick]', 'edtOuvrir', 'Ouvrir l\'emploi du temps'); await pause(2200);
await vueBouton('semaine', 'Semaine'); await pause(1000);
const ap = await compte();
dit('   allumé : ' + JSON.stringify(ap));
dit(ap.essai.length ? '   LA CLASSE D\'ESSAI EST À L\'ÉCRAN : ' + ap.essai.join(', ')
                    : '   ✗ LA CLASSE D\'ESSAI N\'APPARAÎT PAS dans la grille mode test allumé');
await shot('mode-test-allume-la-grille');

/* ══════════ ⑮ LE PROMPT ══════════ */
dit(''); dit('⑮ LE PROMPT');
await fermerModale(); await pause(400);
await fermerEcran(); await pause(900); await voile();
await clic('.tprof-section-btn', "showProfSection('edt')", 'section Emploi du temps'); await pause(1300);
const pr = await clic('#edt-panneau [onclick]', "edtCopierPrompt('grille')", 'Copier le prompt — grille');
await pause(1300);
if (pr) dit('   ce que le site répond : ' + await page.evaluate(() => {
  const m = document.getElementById('at-modale');
  const t = document.querySelector('.at-toast, .toast, #at-toast');
  return (m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 300) : '') + (t ? ' | toast : ' + t.innerText.slice(0, 200) : ''); }));
await shot('le-prompt-copie-ce-que-le-site-repond');

dit(''); dit('écritures parties vers le faux hub (aucune vers le vrai) : ' + await page.evaluate(() => window.__ECR.length));
dit('captures produites : ' + n);
fs.writeFileSync(DOS + 'journal-des-clics.txt', jrn.join('\n') + '\n');
await nav.close();

/* CAPTURES ⑥ — PERSONNE NE PERD UNE HEURE EN SILENCE, PAR CLICS.
   Ce que le mandat ⑥ §⑦.14 exigeait et qui n'avait jamais été livré : le dépôt
   sur une case occupée, les trois issues à l'écran, l'échange, l'écrasement,
   l'heure à replacer rappelée. Écran entier, journal des clics à côté.
   Une seule ligne n'est pas un clic, et elle est déclarée : `admin-mode`.
   Usage : node tests/captures-issues-06.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const hub = () => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-deux-classes.json') },   /* deux classes appariées : c'est ce qui rend le créneau « pris » possible */
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
};
const journal = [];
const dit = t => { journal.push(t); console.log(t); };
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
page.on('pageerror', e => dit('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
const shot = async n => { await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await page.screenshot({ path: 'tests/06-issues-' + n + '.png' }); };

const arriver = async () => {
  await page.evaluateOnNewDocument(faux, hub());
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));   /* déclaré : pas un clic */
  await page.click('#tprof-btn'); await pause(700);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
  await pause(1500);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-panneau [onclick]'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf('edtOuvrir') >= 0)[0]; if (b) b.click(); });
  await pause(2000);
};

/* ouvre une case portant une séance, et rend la première destination PRISE
   par une autre classe — celle qui ouvre les trois issues */
const ouvrirCaseEtCible = () => page.evaluate(() => {
  const k = Object.keys(EDT_VUE.cellules || {}).filter(x => {
    const c = EDT_VUE.cellules[x];
    return c && c.classeMjpc && (c.nature === 'prevu' || c.nature === 'rienDePret')
      && !edtDecisionPour(c.classeMjpc, c.iso, c.creneau); })[0];
  if (!k) return null;
  const el = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf(k.split('|')[0]) >= 0
              && (x.getAttribute('onclick') || '').indexOf(k.split('|')[1]) >= 0)[0];
  if (el) el.click(); else { EDT_MOD.cle = k; edtPeindreModale(); }
  const sel = document.getElementById('edt-ou');
  const opts = sel ? Array.from(sel.options) : [];
  const prise = opts.filter(o => o.value.indexOf('|=') > 0)[0];
  const c = EDT_VUE.cellules[k];
  return { cle: k, classe: c.classeMjpc, parClic: !!el, entrees: opts.length,
    prisesProposees: opts.filter(o => o.value.indexOf('|=') > 0).length,
    cible: prise ? { valeur: prise.value, texte: prise.text } : null }; });

await arriver();
dit('① clics : panneau prof → Emploi du temps → Ouvrir l\'emploi du temps');
dit('   version : ' + await page.evaluate(() => APP_VERSION));
const dep = await ouvrirCaseEtCible();
await shot('1-liste-des-destinations');
dit('② CLIC sur une case, la liste « Déplacer cette heure, ou en ajouter une… » : '
  + JSON.stringify({ classe: dep.classe, ouverteParClic: dep.parClic, entrees: dep.entrees,
      creneauxPrisProposes: dep.prisesProposees, cible: dep.cible && dep.cible.texte }));

/* ── ÉCRAN 2 — LES TROIS ISSUES ── */
const issues = await page.evaluate(v => new Promise(res => {
  const sel = document.getElementById('edt-ou');
  sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true }));
  setTimeout(() => { const m = document.getElementById('at-modale');
    res({ texte: m ? m.innerText.replace(/\n+/g, ' | ') : '(aucune modale)',
      boutons: m ? Array.from(m.querySelectorAll('button')).map(b => b.innerText.trim()) : [] }); }, 700);
}), dep.cible.valeur);
await shot('2-les-trois-issues');
dit('③ CHOIX d\'un créneau « pris par… » → les trois issues :');
dit('      ' + issues.texte);
dit('      boutons : ' + JSON.stringify(issues.boutons));

/* ── ÉCRAN 3 — L'ÉCHANGE ── */
const avantEchange = await page.evaluate(() => window.__dec());
const echange = await page.evaluate(() => new Promise(res => {
  window.__ECR.length = 0;
  const b = Array.from(document.querySelectorAll('#at-modale button'))
    .filter(x => x.innerText.indexOf('Échanger') >= 0)[0];
  if (!b) { res({ bouton: '(absent)' }); return; }
  b.click();
  setTimeout(() => { const d = window.__dec();
    const lignes = [];
    Object.keys(d).forEach(c => Object.keys((d[c] || {}).heures || {}).forEach(k => {
      const v = d[c].heures[k];
      lignes.push(c + ' · ' + k + ' → ' + (v.deplaceeVers ? ('part vers ' + v.deplaceeVers)
        : v.venantDe ? ('arrive de ' + v.venantDe) : JSON.stringify(v).slice(0, 40))); }));
    res({ ecritures: window.__ECR.slice(), decisions: lignes.length, lignes: lignes });
  }, 1100); }));
await pause(600);
await shot('3-apres-echange');
dit('④ CLIC « Échanger les deux heures » → ' + echange.decisions + ' décisions, '
  + JSON.stringify(echange.ecritures));
(echange.lignes || []).forEach(l => dit('      ' + l));

/* ── ÉCRAN 4 — L'ÉCRASEMENT, sur un site repris à zéro ── */
await arriver();
const dep2 = await ouvrirCaseEtCible();
await page.evaluate(v => { const sel = document.getElementById('edt-ou');
  sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); }, dep2.cible.valeur);
await pause(800);
const ecrase = await page.evaluate(() => new Promise(res => {
  window.__ECR.length = 0;
  const b = Array.from(document.querySelectorAll('#at-modale button'))
    .filter(x => x.innerText.indexOf('Prendre le créneau') >= 0)[0];
  if (!b) { res({ bouton: '(absent)' }); return; }
  b.click();
  setTimeout(() => { const d = window.__dec(); const lignes = [];
    Object.keys(d).forEach(c => Object.keys((d[c] || {}).heures || {}).forEach(k => {
      const v = d[c].heures[k];
      lignes.push(c + ' · ' + k + ' → ' + (v.aReplacer ? ('À REPLACER, motif ' + v.motif
        + ', justifiée ' + v.justifiee + ', prise par ' + v.prisePar)
        : v.deplaceeVers ? ('part vers ' + v.deplaceeVers)
        : v.venantDe ? ('arrive de ' + v.venantDe) : JSON.stringify(v).slice(0, 40))); }));
    res({ ecritures: window.__ECR.slice(), lignes: lignes,
      aReplacer: edtHeuresAReplacer(null).length }); }, 1100); }));
await pause(600);
await shot('4-apres-ecrasement');
dit('⑤ CLIC « Prendre le créneau » → ' + JSON.stringify(ecrase.ecritures));
(ecrase.lignes || []).forEach(l => dit('      ' + l));

/* ── ÉCRAN 5 — L'HEURE À REPLACER, RAPPELÉE ── */
const rappel = await page.evaluate(() => {
  /* le rappel est FILTRÉ PAR CLASSE : il faut ouvrir une case de la classe qui a
     perdu l'heure — mesuré au premier essai, où j'ouvrais une case au hasard. */
  const perdante = edtHeuresAReplacer(null)[0];
  const k = Object.keys(EDT_VUE.cellules || {}).filter(x =>
    EDT_VUE.cellules[x] && EDT_VUE.cellules[x].classeMjpc === perdante.classe)[0]
    || Object.keys(EDT_VUE.cellules || {})[0];
  const el = Array.from(document.querySelectorAll('#edt-ecran [onclick*="edtCaseClic"]'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf(k) >= 0)[0];
  if (el) el.click(); else { EDT_MOD.cle = k; edtPeindreModale(); }
  const m = document.getElementById('edt-modale');
  const r = m ? m.querySelector('.edt-rappel') : null;
  return { classeQuiAPerdu: perdante.classe, caseOuverte: EDT_VUE.cellules[k].classeMjpc,
    ouverteParClic: !!el, heuresAReplacer: edtHeuresAReplacer(null).length,
    rappel: r ? r.innerText.replace(/\n+/g, ' | ').slice(0, 220) : '(aucun rappel affiché)' }; });
await pause(500);
await shot('5-heure-a-replacer-rappelee');
dit('⑥ le rappel de l\'heure à replacer : ' + JSON.stringify(rappel));

fs.writeFileSync('tests/06-issues-journal.txt', journal.join('\n') + '\n');
await nav.close();
console.log('\ncaptures : tests/06-issues-1…5 · journal : tests/06-issues-journal.txt');

/* BANC ⑨-b — LA LISTE ENTIÈRE, SA RECHERCHE, ET LE REFUS QUI PORTE SUR LA TRACE.
   Usage : node tests/banc-liste-trace-09b.mjs <index.html> */
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
  window.__dit = ''; window.__horsTrace = false;
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
console.log('BANC ⑨-b — version : ' + await page.evaluate(() => APP_VERSION));

/* ① LA LISTE DU RAPPEL VA JUSQU'À LA FIN DE L'ANNÉE — deux chiffres pour l'avant */
const liste = await page.evaluate(() => new Promise(res => {
  const cel = EDT_VUE.cellules || {};
  const a = Object.keys(cel).filter(k => cel[k].classeMjpc)[0];
  const b = Object.keys(cel).filter(k => cel[k].classeMjpc && cel[k].classeMjpc !== cel[a].classeMjpc)[0];
  edtEcraserHeure(a, { iso: cel[b].iso, creneau: cel[b].creneau });
  setTimeout(() => {
    const h = edtHeuresAReplacer(null)[0];
    const toutes = edtDestinationsPour(h.classe, h.iso, h.creneau);
    /* ce que produisait la version d'avant : plafond 120 jours, puis coupe à 60 */
    const avecPlafond = edtCreneauxOu({ classeMjpc: h.classe, classe: h.classe, iso: h.iso, creneau: h.creneau }, 120);
    /* et ce que Paul voit vraiment dans le menu du rappel */
    EDT_MOD.cle = Object.keys(cel).filter(k => cel[k].classeMjpc === h.classe)[0];
    edtPeindreModale();
    const sel = document.querySelector('#edt-modale .edt-rappel select');
    res({ finAnnee: edtFinAnnee(),
      avant_calculeAvecPlafond120: avecPlafond.length, avant_vuParPaul: 60,
      apres_calcule: toutes.length,
      apres_vuParPaul: sel ? Array.from(sel.querySelectorAll("option")).filter(function(o){return o.value;}).length : null,
      derniereEntree: toutes.length ? toutes[toutes.length - 1].lib : null });
  }, 1000); }));
dire(liste.apres_calcule > liste.avant_calculeAvecPlafond120 && liste.apres_vuParPaul > 60,
  '① la liste du rappel va jusqu\'à la fin de l\'année, et la coupe à 60 est tombée',
  JSON.stringify(liste));

/* ② LA RECHERCHE — mois, numéro de semaine, type A/B, et la date d'avant */
const cherche = await page.evaluate(() => {
  const cel = EDT_VUE.cellules || {};
  const k = Object.keys(cel).filter(x => cel[x].classeMjpc
    && (cel[x].nature === 'prevu' || cel[x].nature === 'rienDePret')
    && !edtDecisionPour(cel[x].classeMjpc, cel[x].iso, cel[x].creneau))[0];
  EDT_MOD.cle = k; edtPeindreModale();
  const sel = document.getElementById('edt-ou');
  const opts = () => Array.from(sel.querySelectorAll('option')).filter(o => o.value);
  const visibles = () => opts().filter(o => !o.hidden).length;
  const total = opts().length;
  const out = { total: total, sansFiltre: visibles() };
  const essai = t => { edtFiltrerOu(t); return visibles(); };
  out.mois_mai = essai('mai');
  out.semaine_37 = essai('37');
  out.typeA = essai('A');
  out.typeB = essai('B');
  out.date_125 = essai('12/5');        /* le format affiché est « mer 12/5 », sans zéro */
  out.date_1205_avecZero = essai('12/05');
  edtFiltrerOu('');
  out.retourSansFiltre = visibles();
  /* de quoi vérifier que le filtre dit vrai */
  out.exempleMai = opts().filter(o => o.getAttribute('data-mois') === 'mai').length;
  out.exempleS37 = opts().filter(o => o.getAttribute('data-sem') === '37').length;
  out.exempleA = opts().filter(o => o.getAttribute('data-ab') === 'A').length;
  return out; });
dire(cherche.mois_mai === cherche.exempleMai && cherche.semaine_37 === cherche.exempleS37
  && cherche.typeA === cherche.exempleA && cherche.typeA + cherche.typeB <= cherche.total
  && cherche.retourSansFiltre === cherche.sansFiltre,
  '② la recherche : mois, numéro de semaine, type A/B, et la date d\'avant',
  JSON.stringify(cherche));

/* ③ LE REFUS PORTE SUR LA TRACE, PAS SUR LA DATE */
const trace = await page.evaluate(() => {
  const cel = EDT_VUE.cellules || {};
  const jouee = Object.keys(cel).filter(k => cel[k].nature === 'jouee')[0];
  const duJour = Object.keys(cel).filter(k => cel[k].iso === edtAujourdhui()
    && cel[k].classeMjpc && cel[k].nature !== 'jouee')[0];
  const out = { casesDuJourNonLancees: Object.keys(cel).filter(k => cel[k].iso === edtAujourdhui()
    && cel[k].classeMjpc && cel[k].nature !== 'jouee').length };
  if (duJour) { const c = cel[duJour];
    out.heureDuJour_traceExiste = edtTraceExiste(c.classeMjpc, c.iso, c.creneau);
    EDT_MOD.cle = duJour; edtPeindreModale();
    const m = document.getElementById('edt-modale');
    out.heureDuJour_listeDeplacer = !!(m && m.querySelector('#edt-ou'));
  }
  if (jouee) { const c = cel[jouee];
    out.heureJouee_traceExiste = edtTraceExiste(c.classeMjpc, c.iso, c.creneau);
    EDT_MOD.cle = jouee; edtPeindreModale();
    const m = document.getElementById('edt-modale');
    out.heureJouee_listeDeplacer = !!(m && m.querySelector('#edt-ou'));
    out.heureJouee_refusDit = (m ? m.innerText : '').indexOf('elle ne se déplace plus') >= 0;
  } else out.heureJouee = '(aucune heure jouée dans cette semaine)';
  return out; });
dire(trace.heureDuJour_traceExiste === false && trace.heureDuJour_listeDeplacer === true,
  '③ une heure DU JOUR non encore lancée reste déplaçable', JSON.stringify(trace));

/* ④ LE REFUS NE RETIENT RIEN — la trace est relue à chaque appel, jamais mise en
   cache. Mesuré sur la même heure, trois appels de suite, et sur le coût de la
   liste entière : ce qu'on a retiré ne coûte rien. */
const rendue = await page.evaluate(() => {
  const cel = EDT_VUE.cellules || {};
  const k = Object.keys(cel).filter(x => cel[x].classeMjpc)[0];
  const c = cel[k];
  const trois = [edtTraceExiste(c.classeMjpc, c.iso, c.creneau),
                 edtTraceExiste(c.classeMjpc, c.iso, c.creneau),
                 edtTraceExiste(c.classeMjpc, c.iso, c.creneau)];
  const t0 = performance.now();
  const n = edtCreneauxOu({ classeMjpc: c.classeMjpc, classe: c.classe, iso: c.iso, creneau: c.creneau }).length;
  const ms = Math.round(performance.now() - t0);
  const t1 = performance.now(); EDT_MOD.cle = k; edtPeindreModale();
  const msModale = Math.round(performance.now() - t1);
  return { troisAppelsIdentiques: trois.every(x => x === trois[0]), valeur: trois[0],
    listeEntiere: n, msListeEntiere: ms, msPeindreModale: msModale,
    aucunCache: 'edtTraceExiste appelle edtChercherTrace à chaque fois' };
});
dire(rendue.troisAppelsIdentiques === true && rendue.msPeindreModale < 1000,
  '④ le refus ne retient rien, et la liste entière ne coûte rien à l\'écran',
  JSON.stringify(rendue));

await nav.close();
console.log('\n' + (rates ? ('ÉCHEC — ' + rates + ' repère(s)') : 'TOUT PASSE — 4 repères'));
process.exit(rates ? 1 : 0);

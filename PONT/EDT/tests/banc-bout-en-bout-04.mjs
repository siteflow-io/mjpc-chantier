/* BANC ④ — L'ÉPREUVE DE BOUT EN BOUT ET L'AUDIT ADVERSE.
   Le rôle de l'IA est tenu À LA MAIN par le banc : il applique les consignes du
   prompt au JSON du hub (reconduire les id, ne rien reformuler, ne rien inventer),
   puis réinjecte le résultat par le chemin réel. C'est déclaré comme tel.
   Usage : node tests/banc-bout-en-bout-04.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const hub = garni => ({ classes: J('hub-classes.json'),
  site: { '3e': J('hub-site3e.json'), config: J('hub-siteconfig.json'),
    edt: garni === false ? {} : {
      grille: { '2026-2027': J('grille-2026-2027.json') },
      calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
      creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } });
const faux = s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  window.__PRESSE = []; window.__REFUS_COPIE = false;
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
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    writeText: t => { if (window.__REFUS_COPIE) return Promise.reject(new Error('refusé'));
      window.__PRESSE.push(String(t)); return Promise.resolve(); } } });
  document.execCommand = () => { if (window.__REFUS_COPIE) return false;
    window.__PRESSE.push('(execCommand)'); return true; };
};
const pause = ms => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });

async function ouvrir(garni) {
  const page = await nav.newPage();
  page.on('pageerror', e => console.log('   ⚠ erreur de page : ' + String(e).slice(0, 110)));
  await page.evaluateOnNewDocument(faux, hub(garni));
  await page.goto('file://' + FICHIER, { waitUntil: 'load' });
  await pause(800);
  await page.evaluate(() => document.body.classList.add('admin-mode'));
  await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
  await pause(1400);
  await page.evaluate(() => { document.getElementById('tprof-btn').click(); });
  await pause(600);
  await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
  await pause(1100);
  await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  return page;
}
/* le rôle de l'IA, tenu à la main : `obeissante` suit les consignes du prompt */
const sortieIA = (obeissante) => `(function (prompt) {
  const h = prompt.indexOf('CE QUI EST EN SERVICE');   // la charnière posée par le site
  const i = prompt.indexOf('{', h);
  const o = JSON.parse(prompt.slice(i));            // l'IA lit l'existant qu'on lui a donné
  const a = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  if (a) { a.libelle = a.libelle + ' (Meuse)'; }     // un libellé retouché par l'établissement
  const b = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Stages 3e (uniquement') >= 0)[0];
  if (b) { b.debut = '2026-11-17'; b.fin = '2026-11-17'; }   // une date qui bouge
  o.evenementsClasse.push({ debut: '2027-05-12', fin: '2027-05-12',
    libelle: 'Sortie théâtre 3e', niveau: '3e', classes: [] });   // un vrai nouvel élément, SANS id
  ${obeissante ? '' : `['evenementsClasse','jalons','etablissement','feries','vacances']
    .forEach(f => (o[f] || []).forEach(e => { delete e.id; }));   // l'IA à l'aveugle : tout perdu`}
  return o;
})`;

console.log('══════ ④.8 · L\'ÉPREUVE DE BOUT EN BOUT ══════');
for (const [titre, ob] of [['IA QUI SUIT LE PROMPT (reçoit l\'existant, reconduit les id)', true],
                           ['IA À L\'AVEUGLE (ce qui se passait avant : pas d\'existant, pas d\'id)', false]]) {
  const page = await ouvrir(true);
  const r = await page.evaluate(code => {
    window.__PRESSE.length = 0;
    const b = Array.from(document.querySelectorAll('#edt-panneau button'))
      .filter(x => (x.getAttribute('onclick') || '').indexOf("edtCopierPrompt('calendrier')") >= 0)[0];
    b.click();                                        // Paul copie, un seul geste
    const prompt = window.__PRESSE[0] || '';
    const rendu = eval(code)(prompt);                 // l'IA rend son JSON
    edtInjOuvrir('calendrier');
    document.getElementById('edt-inj-coller').value = JSON.stringify(rendu);
    window.__ECR.length = 0;
    edtInjVerifier('calendrier');                     // Paul vérifie
    const d = EDT_INJ.diff || EDT.diffInjection || {};
    const bloc = document.querySelector('.edt-diff');
    return { promptLu: prompt.length, forts: d.forts, arrivent: d.arrivent,
      faibles: (d.faibles || []).length, ambigus: (d.ambigus || []).length,
      menteurs: (d.menteurs || []).length,
      differentiel: bloc ? bloc.innerText.replace(/\n+/g, ' | ').slice(0, 320) : '(aucun)',
      ecritures: window.__ECR.slice() }; }, sortieIA(ob));
  console.log('\n■ ' + titre);
  console.log('   prompt copié : ' + r.promptLu + ' caractères · écritures à la vérification : ' + JSON.stringify(r.ecritures));
  console.log('   appariement : ' + r.forts + ' forts · ' + r.arrivent + ' arrivant(s) · '
    + r.faibles + ' faible(s) · ' + r.ambigus + ' ambiguïté(s) · ' + r.menteurs + ' identifiant(s) menteur(s)');
  console.log('   différentiel : ' + r.differentiel);
  await page.close();
}

console.log('\n\n══════ ④.12 · AUDIT ADVERSE ══════');
async function cas(titre, garni, code, attendu) {
  const page = await ouvrir(garni);
  let r;
  try { r = await page.evaluate(c => new Promise(res => { window.__ECR.length = 0; eval('(' + c + ')(res)'); }), code.toString()); }
  catch (e) { r = { erreur: String(e).slice(0, 90) }; }
  console.log('\n■ ' + titre);
  console.log('   attendu : ' + attendu);
  console.log('   mesuré  : ' + JSON.stringify(r));
  await page.close();
}

await cas('HUB VIDE (l\'état réel)', false, fini => {
  window.__PRESSE.length = 0;
  const b = Array.from(document.querySelectorAll('#edt-panneau button'))
    .filter(x => (x.getAttribute('onclick') || '').indexOf('edtCopierPrompt') >= 0)[0];
  fini({ boutons: Array.from(document.querySelectorAll('#edt-panneau button'))
      .filter(x => (x.getAttribute('onclick') || '').indexOf('edtCopierPrompt') >= 0).length,
    copie: (b && (b.click(), window.__PRESSE[0] || '')).slice(-70) });
}, 'les deux boutons sont là, le bloc dit la première injection');

await cas('JSON ÉNORME (le calendrier répété 40 fois)', true, fini => {
  const g = EDT.calendrier;
  for (let i = 0; i < 40; i++) g.etablissement = (g.etablissement || []).concat(
    JSON.parse(JSON.stringify((EDT.calendrier.etablissement || []).slice(0, 59))));
  window.__PRESSE.length = 0;
  const t0 = Date.now();
  edtCopierPrompt('calendrier');
  fini({ elements: (EDT.calendrier.etablissement || []).length,
    longueur: (window.__PRESSE[0] || '').length, millisecondes: Date.now() - t0 });
}, 'aucune casse, la copie part quand même');

await cas('LE JSON CONTIENT DÉJÀ LA CONSIGNE (prompt recollé dans le hub)', true, fini => {
  EDT.calendrier.source = edtPromptComplet('calendrier').slice(0, 3000);
  window.__PRESSE.length = 0;
  edtCopierPrompt('calendrier');
  const t = window.__PRESSE[0] || '';
  fini({ longueur: t.length, charnieres: (t.match(/CE QUI EST EN SERVICE/g) || []).length,
    jsonRelisible: (function () { try {
      const h = t.lastIndexOf('CE QUI EST EN SERVICE');
      JSON.parse(t.slice(t.indexOf('{', h))); return true; } catch (e) { return false; } })() });
}, 'le JSON reste relisible, la charnière du site reste identifiable');

await cas('PRESSE-PAPIER REFUSÉ DEUX FOIS DE SUITE', true, fini => {
  window.__REFUS_COPIE = true; window.__PRESSE.length = 0;
  edtCopierPrompt('calendrier');
  setTimeout(() => { edtCopierPrompt('grille');
    setTimeout(() => {
      const z = Array.from(document.querySelectorAll('#edt-panneau textarea'))
        .filter(x => (x.value || '').indexOf('CE QUI EST EN SERVICE') >= 0);
      fini({ presse: window.__PRESSE.length, zones: z.length,
        derniere: z.length ? (z[z.length - 1].value.indexOf('GRILLE DE L') >= 0 ? 'grille' : 'calendrier') : null });
    }, 700); }, 700);
}, 'une seule zone, celle du dernier bouton, rien qui s\'empile');

await cas('UN OBJET SANS id MÊLÉ À DES OBJETS QUI EN ONT', true, fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  (o.evenementsClasse || []).forEach((e, i) => { if (i === 2) delete e.id; });
  edtInjOuvrir('calendrier');
  document.getElementById('edt-inj-coller').value = JSON.stringify(o);
  edtInjVerifier('calendrier');
  const d = EDT.diffInjection || {};
  fini({ forts: d.forts, arrivent: d.arrivent, faibles: (d.faibles || []).length });
}, 'celui-là s\'apparie par ses critères, les autres par leur id');

await cas('UNE IA QUI REND DES IDENTIFIANTS INVENTÉS', true, fini => {
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  (o.evenementsClasse || []).forEach((e, i) => { e.id = 'evc:INVENTE' + i; });
  edtInjOuvrir('calendrier');
  document.getElementById('edt-inj-coller').value = JSON.stringify(o);
  edtInjVerifier('calendrier');
  const d = EDT.diffInjection || {};
  fini({ forts: d.forts, arrivent: d.arrivent, faibles: (d.faibles || []).length,
    menteurs: (d.menteurs || []).length }); }
, 'l\'identifiant inconnu ne fait pas foi : on retombe sur les critères, rien n\'est volé');

await cas('LE PROMPT COPIÉ DEUX FOIS DE SUITE', true, fini => {
  window.__PRESSE.length = 0;
  edtCopierPrompt('calendrier');
  setTimeout(() => { edtCopierPrompt('calendrier');
    setTimeout(() => fini({ copies: window.__PRESSE.length,
      identiques: window.__PRESSE[0] === window.__PRESSE[1],
      longueur: (window.__PRESSE[0] || '').length }), 600); }, 600);
}, 'deux copies identiques, rien qui s\'accumule dans le texte');

await nav.close();

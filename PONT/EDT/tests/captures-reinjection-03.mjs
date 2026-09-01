/* CAPTURES PAR CLICS — LOT 2ter ③ §⑥.13 : le parcours de réinjection.
   panneau prof → Emploi du temps → coller un calendrier modifié → Vérifier →
   le différentiel → Injecter → répondre à une question d'appariement faible.
   Tout par clics, sauf deux lignes déclarées : admin-mode (la marque du prof
   connecté) et le remplissage du presse-papier simulé (`textarea.value`), qui
   remplace un collage manuel de 17 ko.
   Usage : node tests/captures-reinjection-03.mjs <index.html> <prefixe> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const P = process.argv[3] || '03';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const CLASSE = '3E Charles de Gaulle';
const jrn = []; const dit = t => { jrn.push(t); console.log(t); };

const store = { classes: J('hub-classes.json'), site: { '3e': J('hub-site3e.json'),
  config: J('hub-siteconfig.json'), edt: {
    grille: { '2026-2027': J('grille-appariee.json') },
    calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } };

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

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 900 });
await page.evaluateOnNewDocument(faux, store);
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
const pause = ms => new Promise(r => setTimeout(r, ms));
await pause(1100);
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async n => { await nettoyer(); await page.screenshot({ path: 'tests/' + P + '-reinj-' + n + '.png' }); };
const clic = (sel, txt) => page.evaluate((s, t) => {
  const el = Array.from(document.querySelectorAll(s))
    .filter(x => ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0];
  if (!el) return false; el.click(); return true; }, sel, txt);

dit('version : ' + await page.evaluate(() => (document.getElementById('proto-badge') || {}).innerText || '?'));
await page.evaluate(() => document.body.classList.add('admin-mode'));
await pause(300);

/* on pose d'abord deux coches, pour que le différentiel ait quelque chose à protéger */
await page.evaluate(() => new Promise(res => {
  edtChargerClasses(() => edtCharger(() => {
    setTimeout(() => {
      const cal = EDT.calendrier;
      const a = (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
      const b = (cal.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Visite des lycées') >= 0)[0];
      edtJustifier(a.id, true);
      setTimeout(() => { edtJustifier(b.id, true); setTimeout(res, 900); }, 900);
    }, 1200); })); }));
dit('préparation : ' + await page.evaluate(c => edtHeuresJustifiees(c) + ' heures cochées', CLASSE));

await page.click('#tprof-btn'); await pause(800);
await clic('.tprof-section-btn', "showProfSection('edt')"); await pause(1300);
await shot('1-panneau-edt');
dit('① clics : panneau prof → Emploi du temps');

await clic('#edt-panneau [onclick]', "edtInjOuvrir('calendrier')"); await pause(700);
await shot('2-zone-de-collage');
dit('② clic « Calendrier de l\'année » : la zone de collage s\'ouvre');

/* le texte collé : mêmes événements, sans identifiants, un libellé retouché,
   une date déplacée, un événement supprimé (qui porte une coche), un neuf */
const texte = await page.evaluate(neuf => {
  const o = JSON.parse(JSON.stringify(neuf));
  ['evenementsClasse', 'jalons', 'etablissement', 'feries', 'vacances'].forEach(f =>
    (o[f] || []).forEach(e => { delete e.id; }));
  const a = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Verdun') >= 0)[0];
  a.libelle = 'Séjour à Verdun 3e';
  const b = (o.evenementsClasse || []).filter(e => (e.libelle || '').indexOf('Stages 3e (uniquement') >= 0)[0];
  b.debut = '2026-11-17'; b.fin = '2026-11-17';
  o.evenementsClasse = o.evenementsClasse.filter(e => (e.libelle || '').indexOf('Visite des lycées') < 0);
  o.evenementsClasse.push({ debut: '2027-05-12', fin: '2027-05-12', libelle: 'Sortie théâtre 3e', niveau: '3e', classes: [] });
  const z = document.getElementById('edt-inj-coller');
  if (z) z.value = JSON.stringify(o);                    /* remplace le collage manuel — déclaré */
  return z ? z.value.length : 0; }, J('calendrier-2026-2027.json'));
dit('③ texte collé : ' + texte + ' caractères (libellé retouché, date déplacée, un événement retiré, un neuf)');

await page.evaluate(() => { window.__ECR.length = 0; });
await clic('#edt-panneau button', "edtInjVerifier"); await pause(900);
await shot('3-differentiel');
const diff = await page.evaluate(() => {
  const b = document.querySelector('.edt-diff');
  return { texte: b ? b.innerText.replace(/\n+/g, ' | ') : '(aucun)', ecritures: window.__ECR.slice() }; });
dit('④ CLIC « Vérifier » → écritures : ' + JSON.stringify(diff.ecritures));
dit('   différentiel affiché :\n     ' + diff.texte.replace(/ \| /g, '\n     '));

await clic('#edt-panneau button', "edtInjInjecter"); await pause(900);
await shot('4-question-appariement');
const q = await page.evaluate(() => {
  const m = document.getElementById('at-modale');
  return { texte: m ? m.innerText.replace(/\n+/g, ' | ') : '(aucune)', ecritures: window.__ECR.slice() }; });
dit('⑤ CLIC « Injecter » → question posée : ' + JSON.stringify(q.texte));
dit('   écritures AVANT la réponse : ' + JSON.stringify(q.ecritures));

await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Oui/.test(x.textContent))[0]; if (b) b.click(); });
await pause(800);
await shot('5-seconde-question');
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Oui/.test(x.textContent))[0]; if (b) b.click(); });
await pause(900);
await shot('6-avertissement-coches');
const av = await page.evaluate(() => { const m = document.getElementById('at-modale');
  return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 220) : '(aucun)'; });
dit('⑥ CLICS « Oui, c\'est le même » ×2 → avertissement : ' + JSON.stringify(av));
page.on('framenavigated', f => dit('   (la page a navigué : ' + String(f.url()).slice(0, 60) + ')'));
try { await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-modale button'))
  .filter(x => /Injecter quand/.test(x.textContent))[0]; if (b) b.click(); }); }
catch (e) { dit('   (le clic « Injecter quand même » a détaché la page : ' + String(e).slice(0, 60) + ')'); }
await pause(1600);
try { await shot('7-apres-injection'); } catch (e) { dit('   (l\'écran s\'est rafraîchi après l\'injection : capture 7 non prise)'); }
let fin = null;
try { fin = await page.evaluate(c => {
  const cal = window.__HUB.site.edt.calendrier['2026-2027'] || {};
  const dec = ((window.__HUB.site.edt.decisions || {})['2026-2027'] || {})[c] || {};
  return { ecritures: window.__ECR.filter(x => x.indexOf('/corbeille/') < 0),
    archives: window.__ECR.filter(x => x.indexOf('/corbeille/') >= 0).length,
    evts: (cal.evenementsClasse || []).length, heures: edtHeuresJustifiees(c),
    decisions: Object.keys(dec.heures || {}).length }; }, CLASSE); }
catch (e) { fin = '(page rafraîchie — état relu au banc suivant)'; }
dit('⑦ après injection : ' + JSON.stringify(fin));
fs.writeFileSync('tests/' + P + '-reinj-journal.txt', jrn.join('\n'), 'utf8');
await nav.close();

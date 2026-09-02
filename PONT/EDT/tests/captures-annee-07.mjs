/* CAPTURES PAR CLICS — ⑥.13, et les deux derniers cas adverses.
   Usage : node tests/captures-annee-07.mjs <index.html> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs'; import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const jrn = []; const dit = t => { jrn.push(t); console.log(t); };
const store = { classes: J('hub-classes.json'), site: { '3e': J('hub-site3e.json'),
  config: J('hub-siteconfig.json'), edt: { grille: { '2026-2027': J('grille-deux-classes.json') },
    calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } };
const faux = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
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
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); }
    return Promise.resolve(new Response('null', { status: 200 })); }; };
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
await page.evaluateOnNewDocument(faux, store);
await page.goto('file://' + FICHIER, { waitUntil: 'load' });
const pause = ms => new Promise(r => setTimeout(r, ms));
await pause(1000);
const shot = async n => { await page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
  await page.screenshot({ path: 'tests/07-annee-' + n + '.png' }); };
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await pause(1600);
await page.click('#tprof-btn'); await pause(700);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.tprof-section-btn'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf("'edt'") >= 0)[0]; if (b) b.click(); });
await pause(1100);
dit('① clics : panneau prof → Emploi du temps');
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-panneau [onclick]'))
  .filter(x => (x.getAttribute('onclick') || '').indexOf('edtOuvrir') >= 0)[0]; if (b) b.click(); });
await pause(1300);
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.trim() === 'Année')[0]; if (b) b.click(); });
await pause(1200);
await shot('1-vue-depuis-le-panneau');
dit('② clic « Ouvrir l\'emploi du temps » puis clic « Année » — ' + await page.evaluate(() =>
  document.querySelectorAll('.edt-an-b').length + ' bandeaux, ' + document.querySelectorAll('.edt-an-col').length + ' colonnes'));
dit('   le pied dit : ' + JSON.stringify(await page.evaluate(() =>
  Array.from(document.querySelectorAll('#edt-ecran .edt-mini-t')).map(x => x.innerText).filter(t => t.indexOf('jalons') >= 0)[0] || '')));
/* survol d'un bandeau */
const surv = await page.evaluate(() => { const b = Array.from(document.querySelectorAll('.edt-an-b'))
  .filter(x => (x.getAttribute('data-t') || '').indexOf('Verdun') >= 0)[0];
  const r = b.getBoundingClientRect(); return { titre: b.getAttribute('title'), x: r.x + r.width / 2, y: r.y + 5 }; });
await page.mouse.move(surv.x, surv.y); await pause(500);
await shot('2-survol');
dit('③ survol d\'un bandeau — infobulle : ' + JSON.stringify(surv.titre));
/* clic sur l'événement */
await page.mouse.click(surv.x, surv.y); await pause(700);
await shot('3-clic-evenement');
dit('④ CLIC sur le bandeau → ' + JSON.stringify(await page.evaluate(() => {
  const m = document.getElementById('at-modale'); return m ? m.innerText.replace(/\n+/g, ' | ').slice(0, 120) : '(aucune)'; })));
await page.evaluate(() => { const b = document.querySelector('#at-modale button'); if (b) b.click(); });
await pause(500);
/* zoom et dézoom par Ctrl + molette */
await page.mouse.move(800, 500);
await page.keyboard.down('Control'); await page.mouse.wheel({ deltaY: -120 }); await page.keyboard.up('Control');
await pause(800); await shot('4-zoome');
dit('⑤ Ctrl + molette (zoom) → ' + await page.evaluate(() => document.getElementById('edt-ecran').classList.contains('edt-an-zoom') ? 'zoomé' : 'non zoomé'));
await page.keyboard.down('Control'); await page.mouse.wheel({ deltaY: 120 }); await page.keyboard.up('Control');
await pause(800); await shot('5-dezoome');
dit('⑥ Ctrl + molette (dézoom) → ' + await page.evaluate(() => document.getElementById('edt-ecran').classList.contains('edt-an-zoom') ? 'zoomé' : 'dézoomé'));
/* dernier cas adverse : le calendrier réinjecté pendant que la vue est ouverte */
const reinj = await page.evaluate(() => new Promise(res => {
  const avant = document.querySelectorAll('.edt-an-b').length;
  const o = JSON.parse(JSON.stringify(EDT.calendrier));
  o.evenementsClasse = (o.evenementsClasse || []).slice(0, 5);
  EDT_INJ = { voie: 'calendrier', objet: o, messages: [], apparie: true, diff: { faibles: [] } };
  edtInjInjecter('calendrier');
  setTimeout(() => {
    const b = Array.from(document.querySelectorAll('#at-modale button')).filter(x => /Injecter quand/.test(x.textContent))[0];
    if (b) b.click();
    setTimeout(() => res({ avant, apres: document.querySelectorAll('.edt-an-b').length,
      vueEncoreLa: !!document.getElementById('edt-an') }), 1500); }, 800); }));
dit('⑦ calendrier réinjecté pendant que la vue est ouverte : ' + JSON.stringify(reinj));
fs.writeFileSync('tests/07-annee-journal.txt', jrn.join('\n'), 'utf8');
await nav.close();

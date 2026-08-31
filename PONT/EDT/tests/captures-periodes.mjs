/* CAPTURES — l'écran de l'emploi du temps, périodes avant et après une réinjection.
   L'écran est ouvert par APPEL DE FONCTION (edtOuvrir), pas par clics : le banc n'a
   pas de session professeur. Usage : node tests/captures-periodes.mjs <index.html> <prefixe> */
import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import path from 'path';

const chromium = chromiumMod.default || chromiumMod;
const FICHIER = path.resolve(process.argv[2] || 'index.html');
const PREFIXE = process.argv[3] || '01bis';

const HUB = { annee: '2026-2027', periodes: [
  { id: 'per:POSEE1', rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-11-30' },
  { id: 'per:POSEE2', rang: 2, nom: 'Trimestre 2', debut: '2026-12-01', fin: '2027-03-15' },
  { id: 'per:POSEE3', rang: 3, nom: 'Trimestre 3', debut: '2027-03-16', fin: '2027-07-04' } ] };

const nav = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true
});
const page = await nav.newPage();
await page.setViewport({ width: 1366, height: 768 });
await page.setRequestInterception(true);
page.on('request', r => (r.url().startsWith('file://') ? r.continue() : r.abort()));
page.on('pageerror', () => {});
await page.goto('file://' + FICHIER, { waitUntil: 'load' });

await page.evaluate(h => {
  window.M8_TEST = true;
  window.M8_TEST_STORE = { '/site/edt/periodes/2026-2027': JSON.parse(JSON.stringify(h)) };
  document.body.classList.add('admin-mode');
}, HUB);
await page.evaluate(() => new Promise(r => edtCharger(r)));
await page.evaluate(() => { try { showProfSection('edt'); } catch (e) {} try { edtOuvrir(); } catch (e) {} });
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: 'tests/' + PREFIXE + '-periodes-avant.png' });

await page.evaluate(() => edtInjecterAvecLaGrille({ annee: '2026-2027', periodes: [
  { rang: 1, nom: 'Trimestre 1', debut: '2026-09-01', fin: '2026-12-05' },
  { rang: 2, nom: 'Trimestre 2', debut: '2026-12-06', fin: '2027-03-20' },
  { rang: 3, nom: 'Trimestre 3', debut: '2027-03-21', fin: '2027-07-04' } ] }));
await new Promise(r => setTimeout(r, 700));
await page.evaluate(() => { try { edtPeindrePanneau(); } catch (e) {} });
await page.screenshot({ path: 'tests/' + PREFIXE + '-periodes-apres.png' });

const ids = await page.evaluate(() =>
  ((window.M8_TEST_STORE['/site/edt/periodes/2026-2027'] || {}).periodes || []).map(p => p.nom + ' → ' + p.id));
console.log(PREFIXE + ' · identifiants au hub après réinjection :', ids);
await nav.close();

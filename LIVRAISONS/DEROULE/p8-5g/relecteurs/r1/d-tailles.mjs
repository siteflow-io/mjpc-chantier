// la fenêtre du tableau à différentes tailles, à 9 dévoilés (page 2) puis 7 (fin page 1), ouverture puis redimension
import { demarrer, ouvrirEcran2, comparer, pause, R1 } from './commun.mjs';
const { browser, page, erreurs } = await demarrer();
const dev = async n => { for (let i = 0; i < n; i++) { await page.click('#bdev'); await pause(120); } };
await dev(7);
const pop = await ouvrirEcran2(page, erreurs);
await pause(500);
await comparer(page, pop, 'ouverture 1100x640 à 7');
const tailles = [[1920, 1080], [1280, 720], [1024, 768], [800, 600], [640, 360], [500, 700], [1366, 768], [1600, 1200], [320, 240], [2560, 1080], [1100, 640]];
for (const [w, h] of tailles) {
  await pop.setViewportSize({ width: w, height: h }); await pause(400);
  const r = await comparer(page, pop, `tableau ${w}x${h} à 7`);
  if (!r.ok) await pop.screenshot({ path: `${R1}/d-${w}x${h}-7.png` });
}
await dev(2);
for (const [w, h] of tailles) {
  await pop.setViewportSize({ width: w, height: h }); await pause(400);
  const r = await comparer(page, pop, `tableau ${w}x${h} à 9`);
  if (!r.ok) await pop.screenshot({ path: `${R1}/d-${w}x${h}-9.png` });
}
// ▶ à une taille non standard
await pop.setViewportSize({ width: 800, height: 600 }); await pause(300);
for (let i = 10; i <= 14; i++) { await page.click('#bdev'); await pause(300); await comparer(page, pop, `800x600 ▶ ${i}`); }
console.log('erreurs', erreurs);
await browser.close();

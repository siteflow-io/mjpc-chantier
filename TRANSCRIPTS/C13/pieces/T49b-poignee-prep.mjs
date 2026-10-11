import { chromium } from 'playwright'; import path from 'path';
const maq = { 'p8-5 (avant)': '../LIVRAISONS/DEROULE/p8-5/', 'p8-5d (livrée)': '../d/LIVRAISONS/DEROULE/p8-5d/' };
const browser = await chromium.launch();
for (const [v, dir] of Object.entries(maq)) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('file://' + path.resolve(dir + 'maquette-pilotage-ordi-v9c15p8-manipulable.html')); await page.waitForTimeout(400);
  await page.click('[data-lancer="1"]'); await page.waitForTimeout(300);
  await page.click('#bsimu'); await page.waitForTimeout(150); await page.click('#s-t5'); await page.waitForTimeout(500);
  const alerte = await page.$eval('#al-boite', b => getComputedStyle(b).display !== 'none');
  if (alerte) { await page.click('#al-preparer'); await page.waitForTimeout(400); }
  const r = await page.evaluate(() => { const p = document.getElementById('poignee-mur'); const b = p.getBoundingClientRect(); const n = document.querySelector('.notes'); return { prep: document.getElementById('corps').classList.contains('prep'), poigneeVisible: b.height > 0 && getComputedStyle(p).display !== 'none', y: Math.round(b.top), notesReduites: n.classList.contains('reduites'), notesH: Math.round(n.getBoundingClientRect().height) }; });
  // tirer la poignée vers le bas de 120 px
  if (r.poigneeVisible) { const b = await page.$eval('#poignee-mur', p => { const r = p.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); await page.mouse.move(b.x, b.y); await page.mouse.down(); await page.mouse.move(b.x, b.y + 120, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(200); }
  const apres = await page.evaluate(() => ({ murPart: S.murPart, murH: Math.round(document.getElementById('mur').getBoundingClientRect().height), notesH: Math.round(document.querySelector('.notes').getBoundingClientRect().height) }));
  console.log(v, '· T-5 → préparation :', r, '· après avoir tiré 120 px vers le bas :', apres);
  await page.screenshot({ path: `T49b-${v.slice(0, 5)}.png` });
  await page.close();
}
await browser.close();

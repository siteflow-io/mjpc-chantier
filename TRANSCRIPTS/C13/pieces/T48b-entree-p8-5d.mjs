import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve('../d/LIVRAISONS/DEROULE/p8-5d/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch();
for (const delai of [0, 30, 80, 150, 300]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(file); await page.waitForTimeout(400); await page.click('[data-atelier]'); await page.waitForTimeout(250);
  const res = [];
  for (let i = 0; i < 3; i++) {
    await page.click(`#mur li[data-k="${i}"]`); await page.waitForTimeout(80);
    const p = await page.$$('#notesd [contenteditable]'); await p[p.length - 1].click(); await page.keyboard.press('End');
    await page.keyboard.press('Enter'); if (delai) await page.waitForTimeout(delai);
    await page.keyboard.type('Xyz ' + i); await page.waitForTimeout(120);
    const d = await page.evaluate(() => (DATA.notes[cle()] || []).map(n => n.html.replace(/<[^>]+>/g, '')));
    res.push(d[d.length - 1]);
  }
  console.log(`délai ${String(delai).padStart(3)} ms après Entrée → ${JSON.stringify(res)}`);
  await page.close();
}
// Où va le focus juste après Entrée ?
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(file); await page.waitForTimeout(400); await page.click('[data-atelier]'); await page.waitForTimeout(250);
await page.click('#mur li[data-k="0"]'); const p = await page.$$('#notesd [contenteditable]'); await p[p.length - 1].click(); await page.keyboard.press('End');
await page.keyboard.press('Enter');
const f0 = await page.evaluate(() => { const a = document.activeElement; return a ? (a.id || a.className || a.tagName) + ' / notes:' + !!a.closest('#notesd') : 'aucun'; });
await page.waitForTimeout(50);
const f1 = await page.evaluate(() => { const a = document.activeElement; return a ? (a.id || a.className || a.tagName) + ' / notes:' + !!a.closest('#notesd') : 'aucun'; });
console.log('focus 0 ms après Entrée :', f0, '· 50 ms après :', f1);
await browser.close();

import { chromium } from 'playwright'; import path from 'path';
const maq = { 'p8-5d': '../d/LIVRAISONS/DEROULE/p8-5d/', 'p8-5c': '../LIVRAISONS/DEROULE/p8-5c/' };
const browser = await chromium.launch();
for (const [v, dir] of Object.entries(maq)) {
  const file = 'file://' + path.resolve(dir + 'maquette-pilotage-ordi-v9c15p8-manipulable.html');
  for (const mode of ['atelier', 'classe']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(file); await page.waitForTimeout(400);
    await page.click(mode === 'classe' ? '[data-lancer="1"]' : '[data-atelier]'); await page.waitForTimeout(300);
    const res = {};
    for (const [nom, geste] of [['au milieu (clic)', async () => {}], ['fin de ligne (End)', async () => page.keyboard.press('End')], ['fin du texte (Ctrl+End)', async () => page.keyboard.press('Control+End')], ['début (Ctrl+Home)', async () => page.keyboard.press('Control+Home')]]) {
      await page.click('#notesd .p8-mt'); await geste(); await page.keyboard.type('QQ', { delay: 30 }); await page.waitForTimeout(3600);
      const data = await page.evaluate(() => { const vv = DATA.notes[cle()]; return typeof vv === 'string' ? vv : vv.map(n => n.html.replace(/<[^>]+>/g, '')).join(''); });
      const dom = await page.evaluate(() => document.getElementById('notesd').textContent);
      res[nom] = (data.includes('QQ') ? 'donnée ✔' : 'donnée ✘') + ' · ' + (dom.includes('QQ') ? 'écran ✔' : 'écran ✘');
      await page.evaluate(() => { /* on retire QQ pour le geste suivant */ const vv = DATA.notes[cle()]; if (typeof vv === 'string') DATA.notes[cle()] = vv.replace(/QQ/g, ''); else vv.forEach(n => n.html = n.html.replace(/QQ/g, '')); tout(); });
      await page.waitForTimeout(200);
    }
    console.log(v, mode, res);
    await page.close();
  }
}
await browser.close();

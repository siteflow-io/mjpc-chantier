import { chromium } from 'playwright'; import path from 'path';
const maq = { 'p8-5 (avant)': '../LIVRAISONS/DEROULE/p8-5/', 'p8-5c': '../LIVRAISONS/DEROULE/p8-5c/', 'p8-5d (livrée)': '../d/LIVRAISONS/DEROULE/p8-5d/' };
const browser = await chromium.launch();
for (const [v, dir] of Object.entries(maq)) {
  const file = 'file://' + path.resolve(dir + 'maquette-pilotage-ordi-v9c15p8-manipulable.html');
  for (const mode of ['atelier', 'classe', 'répétition']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(file); await page.waitForTimeout(400);
    if (mode === 'classe') await page.click('[data-lancer="1"]'); else await page.click('[data-atelier]');
    await page.waitForTimeout(300);
    if (mode === 'répétition') { await page.click('#at-jouer'); await page.waitForTimeout(300); }
    const r = await page.evaluate(() => {
      const poignees = Array.from(document.querySelectorAll('[id*="poignee"], [class*="poignee"]')).map(p => { const b = p.getBoundingClientRect(); const cs = getComputedStyle(p); return { id: p.id || p.className, visible: b.width > 0 && b.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden', y: Math.round(b.top), h: Math.round(b.height), display: cs.display }; });
      const notes = document.querySelector('.notes'); const nb = notes ? notes.getBoundingClientRect() : null;
      return { poignees, notes: nb ? { top: Math.round(nb.top), h: Math.round(nb.height) } : null };
    });
    console.log(`${v.padEnd(16)} ${mode.padEnd(11)} notes top=${r.notes && r.notes.top} h=${r.notes && r.notes.h} · poignées : ${r.poignees.map(p => `${p.id}${p.visible ? '' : ' (CACHÉE)'} y=${p.y} h=${p.h}`).join(' | ')}`);
    await page.close();
  }
}
await browser.close();

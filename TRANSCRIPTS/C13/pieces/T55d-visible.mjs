import { chromium } from 'playwright'; import path from 'path';
const maq = { 'p7 (n°12)': '/home/claude/mjpc-chantier/TRANSCRIPTS/C12/pieces/T265-maquette-pilotage-ordi-v9c15p7-manipulable.html', 'p8-5f': path.resolve('../f/LIVRAISONS/DEROULE/p8-5f/maquette-pilotage-ordi-v9c15p8-manipulable.html') };
const browser = await chromium.launch();
const vis = (pg, i) => pg.evaluate(i => { const v = document.querySelector(`#volet [data-at-di="${i}"]`); const vol = document.getElementById('volet'); if (!v) return { existe: false }; const b = v.getBoundingClientRect(), c = vol.getBoundingClientRect(); return { existe: true, dansLeVolet: b.top >= c.top - 1 && b.bottom <= c.bottom + 1, top: Math.round(b.top), voletTop: Math.round(c.top), voletBottom: Math.round(c.bottom), scroll: vol.scrollTop, courante: /cour|on\b/.test(v.className), classe: v.className }; }, i);
for (const [v, p] of Object.entries(maq)) {
  for (const i of [14, 17]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('file://' + p); await page.waitForTimeout(500); await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
    // aller à la diapo i par la vignette (il faut la voir : on défile le volet d'abord, comme Paul)
    await page.evaluate(i => document.querySelector(`#volet [data-at-di="${i}"]`).scrollIntoView({ block: 'center' }), i); await page.waitForTimeout(200);
    await page.click(`#volet [data-at-di="${i}"]`); await page.waitForTimeout(400);
    const avant = await vis(page, i);
    await page.click(`#volet [data-at-di="${i}"]`, { button: 'right' }); await page.waitForTimeout(300); await page.click('#menu .it:has-text("Insérer une diapo après")'); await page.waitForTimeout(800);
    const apres = await vis(page, i + 1); const di = await page.evaluate(() => S.di);
    console.log(`${v.padEnd(10)} insérer après la ${i + 1} : la nouvelle (vignette ${i + 2}) existe ${apres.existe} · visible dans le volet ${apres.dansLeVolet} (top ${apres.top}, volet ${apres.voletTop}–${apres.voletBottom}, scroll ${apres.scroll}) · courante ${apres.courante} (classe « ${apres.classe} ») · di ${di}`);
    await page.screenshot({ path: `T55d-${v.replace(/[^a-z0-9]/gi, '')}-${i}.png` });
    await page.close();
  }
}
await browser.close();

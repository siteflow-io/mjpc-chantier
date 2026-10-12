// Une diapo nouvelle apparaît-elle dans la colonne de gauche ? atelier, diapo 11 (deux blocs), clic droit sur le 2e bloc → « Couper la diapo ici »
import { chromium } from 'playwright'; import path from 'path';
const maq = { 'p7 (n°12)': '/home/claude/mjpc-chantier/TRANSCRIPTS/C12/pieces/T265-maquette-pilotage-ordi-v9c15p7-manipulable.html', 'p8-5': path.resolve('../f/LIVRAISONS/DEROULE/p8-5/maquette-pilotage-ordi-v9c15p8-manipulable.html'), 'p8-5f': path.resolve('../f/LIVRAISONS/DEROULE/p8-5f/maquette-pilotage-ordi-v9c15p8-manipulable.html') };
const browser = await chromium.launch();
const volet = pg => pg.evaluate(() => { const vs = Array.from(document.querySelectorAll('#volet [data-at-di]')); return { vignettes: vs.length, diapos: seance().ecrans.length, di: S.di, titres: vs.slice(9, 14).map(v => v.textContent.replace(/\s+/g, ' ').trim().slice(0, 26)), courante: vs.findIndex(v => /cour|on|courante/.test(v.className)) }; });
for (const [v, p] of Object.entries(maq)) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const err = []; page.on('pageerror', e => err.push(e.message));
  await page.goto('file://' + p); await page.waitForTimeout(500);
  await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
  await page.click('#volet [data-at-di="6"]'); await page.waitForTimeout(400); /* diapo 7, comme test-p3-p7 : dupliquer le bloc 1 pour avoir deux blocs */
  await page.click('#mur .bloc[data-bi="0"] [data-p] >> visible=true', { button: 'right' }); await page.waitForTimeout(400);
  const dup = await page.$('#menu .it:has-text("Dupliquer le bloc")'); if (dup) { await dup.click(); await page.waitForTimeout(500); } else { await page.keyboard.press('Escape'); }
  const v0 = await volet(page);
  await page.click('#mur .bloc[data-bi="1"] [data-p] >> visible=true', { button: 'right' }); await page.waitForTimeout(400);
  const items = await page.$$eval('#menu .it', l => l.map(b => (b.disabled ? '[off] ' : '') + b.textContent.trim().slice(0, 40)));
  const it = await page.$('#menu .it:has-text("Couper la diapo ici")');
  let coupe = 'item absent'; if (it) { if (await it.isDisabled()) coupe = 'item désactivé'; else { await it.click(); await page.waitForTimeout(600); coupe = 'coupée'; } }
  const v1 = await volet(page);
  await page.waitForTimeout(1500); const v2 = await volet(page);
  console.log(`${v.padEnd(10)} diapo 7 (bloc dupliqué) : ${v0.diapos} diapos / ${v0.vignettes} vignettes → ${coupe} → ${v1.diapos} diapos / ${v1.vignettes} vignettes (di ${v0.di}→${v1.di}) ; 1,5 s plus tard : ${v2.vignettes} vignettes · ${v1.diapos === v0.diapos + 1 ? (v1.vignettes === v1.diapos ? 'LE VOLET SUIT' : 'LE VOLET NE SUIT PAS') : '(rien coupé)'} · erreurs ${err.length}`);
  console.log('   volet 10-14 :', v1.titres.join(' | '), '· menu :', items.filter(x => /Couper|Dupliquer/.test(x)).join(' | '));
  await page.screenshot({ path: `T55-${v.replace(/[^a-z0-9]/gi, '')}.png` });
  await page.close();
}
await browser.close();

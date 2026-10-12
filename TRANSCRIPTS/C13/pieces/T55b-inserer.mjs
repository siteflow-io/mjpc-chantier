// Clic droit sur une vignette de la colonne de gauche → « Insérer une diapo après » / « Dupliquer » : la nouvelle diapo apparaît-elle ?
import { chromium } from 'playwright'; import path from 'path';
const maq = { 'p7 (n°12)': '/home/claude/mjpc-chantier/TRANSCRIPTS/C12/pieces/T265-maquette-pilotage-ordi-v9c15p7-manipulable.html', 'p8-5': path.resolve('../f/LIVRAISONS/DEROULE/p8-5/maquette-pilotage-ordi-v9c15p8-manipulable.html'), 'p8-5f': path.resolve('../f/LIVRAISONS/DEROULE/p8-5f/maquette-pilotage-ordi-v9c15p8-manipulable.html') };
const browser = await chromium.launch();
const etat = pg => pg.evaluate(() => { const vs = Array.from(document.querySelectorAll('#volet [data-at-di]')); return { vignettes: vs.length, diapos: seance().ecrans.length, di: S.di, titreMur: (document.querySelector('#numero') || {}).textContent, t1a3: vs.slice(0, 3).map(v => v.textContent.replace(/\s+/g, ' ').trim().slice(0, 24)) }; });
for (const [v, p] of Object.entries(maq)) {
  for (const action of ['Insérer une diapo après', 'Dupliquer']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const err = []; page.on('pageerror', e => err.push(e.message));
    await page.goto('file://' + p); await page.waitForTimeout(500);
    await page.click('[data-atelier]'); await page.waitForTimeout(400); if (await page.$('#at-aide .x')) await page.click('#at-aide .x');
    const e0 = await etat(page);
    await page.click('#volet [data-at-di="0"]', { button: 'right' }); await page.waitForTimeout(400);
    const it = await page.$(`#menu .it:has-text("${action}")`);
    let fait = 'item absent'; if (it) { if (await it.isDisabled()) fait = 'désactivé'; else { await it.click(); await page.waitForTimeout(700); fait = 'fait'; } }
    const e1 = await etat(page); await page.waitForTimeout(1500); const e2 = await etat(page);
    const suit = e1.diapos === e0.diapos + 1 && e1.vignettes === e1.diapos;
    console.log(`${v.padEnd(10)} « ${action} » : ${fait} · diapos ${e0.diapos}→${e1.diapos} · vignettes ${e0.vignettes}→${e1.vignettes} (1,5 s : ${e2.vignettes}) · di ${e0.di}→${e1.di} · mur « ${e1.titreMur} » · ${fait === 'fait' ? (suit ? 'LE VOLET SUIT' : 'LE VOLET NE SUIT PAS') : ''} · erreurs ${err.length}${err.length ? ' : ' + err[0].slice(0, 120) : ''}`);
    console.log('   volet 1-3 :', e1.t1a3.join(' | '));
    if (!suit && fait === 'fait') await page.screenshot({ path: `T55b-${v.replace(/[^a-z0-9]/gi, '')}-${action.slice(0, 7)}.png` });
    await page.close();
  }
}
await browser.close();

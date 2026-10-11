// Le panneau suit la diapo — mesure refaite proprement (texte entier, garde gérée)
import { chromium } from 'playwright'; import path from 'path';
const file = 'file://' + path.resolve('../d/LIVRAISONS/DEROULE/p8-5d/maquette-pilotage-ordi-v9c15p8-manipulable.html');
const browser = await chromium.launch();
const noteDe = (pg, k) => pg.evaluate(k => { const v = DATA.notes[k]; return v == null ? '' : typeof v === 'string' ? v : v.map(n => n.html.replace(/<[^>]+>/g, '')).join(' ¶ '); }, k);
for (const [nom, attente] of [['frappe puis ▶ aussitôt (100 ms)', 100], ['frappe puis ▶ après 3,5 s', 3500]]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); const err = []; page.on('pageerror', e => err.push(e.message));
  await page.goto(file); await page.waitForTimeout(400); await page.click('[data-lancer="1"]'); await page.waitForTimeout(300);
  const cle1 = await page.evaluate(() => cle());
  await page.click('#notesd .p8-mt'); await page.keyboard.press('End'); await page.keyboard.type(' FIN-UN', { delay: 30 }); await page.waitForTimeout(attente);
  let n = 0; while ((await page.evaluate(() => cle())) === cle1 && n < 12) { await page.click('#bdev'); await page.waitForTimeout(120); n++; }
  const cle2 = await page.evaluate(() => cle());
  const panneau = await page.evaluate(() => ({ cles: [...new Set(Array.from(document.querySelectorAll('#notesd .p8-mt')).map(x => x.dataset.p8key))], focus: !!(document.activeElement && document.activeElement.closest('#notesd')), texte: document.getElementById('notesd').textContent }));
  const note1 = await noteDe(page, cle1);
  await page.click('#bprec'); await page.waitForTimeout(200);
  if (await page.$eval('#garde', g => g.classList.contains('on'))) { await page.click('#garde-devant'); await page.waitForTimeout(250); }
  const cleRetour = await page.evaluate(() => cle()); const texteRetour = await page.$eval('#notesd', d => d.textContent);
  const ok = cle2 !== cle1 && panneau.cles.every(k => k === cle2) && !panneau.focus && !panneau.texte.includes('FIN-UN') && note1.includes('FIN-UN') && cleRetour === cle1 && texteRetour.includes('FIN-UN') && !err.length;
  console.log(`${ok ? 'ça va      ' : 'ÇA NE VA PAS'} · ${nom} — ▶ ×${n} → le panneau rend la diapo 2 : ${panneau.cles.every(k => k === cle2)} · focus dans les notes : ${panneau.focus} · « FIN-UN » sur la diapo 2 : ${panneau.texte.includes('FIN-UN')} · gardé dans la note de la diapo 1 : ${note1.includes('FIN-UN')} · ◀ (garde « Y aller ») → diapo 1 : ${cleRetour === cle1}, texte visible : ${texteRetour.includes('FIN-UN')} · erreurs : ${err.length}`);
  await page.close();
}
await browser.close();

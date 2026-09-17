import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1536, height: 864 } }); page.on('pageerror', e => console.log('ERREUR', e.message)); const p = ms => page.waitForTimeout(ms); const ev = f => page.evaluate(f);
for (const [nom, f, edt] of [['v9b.6', 'T110-maquette-pilotage-ordi-v9b6-manipulable.html', false], ['v9c.5', 'maquette-v9c5-courante.html', true]]) {
  await page.goto('file:///home/claude/C12/' + f); await p(500); if (edt) { await page.click('#edt-cases [data-lancer="1"]'); await p(300); }
  await ev(() => { S.di = 7; S.page = null; tout(); }); await p(150); await page.keyboard.press('ArrowRight'); await p(100);
  await page.click('#mur .ajout .ini'); await page.keyboard.type('ga'); await page.keyboard.press('Enter'); await page.keyboard.type('Une première réponse.'); await page.keyboard.press('Enter'); await p(200);
  const apres1 = await ev(() => ({ reps: (etatDiapo().reps[0] || []).map(r => r.i + ':' + r.r), champ: document.querySelector('#mur .ajout .txt').textContent, actif: document.activeElement.className }));
  await page.keyboard.type('ea'); await page.keyboard.press('Enter'); await page.keyboard.type('Une seconde.'); await p(200);
  const apres2 = await ev(() => ({ reps: (etatDiapo().reps[0] || []).map(r => r.i + ':' + r.r), champ: document.querySelector('#mur .ajout .txt').textContent }));
  console.log(nom, '· après la 1re + Entrée :', JSON.stringify(apres1), '· en tapant la 2e :', JSON.stringify(apres2)); }
await nav.close();

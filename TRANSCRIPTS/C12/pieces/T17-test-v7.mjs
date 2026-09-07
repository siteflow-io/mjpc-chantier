import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1366, height: 768 } }); const errs=[]; page.on('pageerror', e => errs.push(String(e.message)));
await page.goto('file:///home/claude/C12/T17-maquette-pilotage-ordi-v7-manipulable.html'); await page.waitForTimeout(400);
const p = ms => page.waitForTimeout(ms);
// une petite heure : 3 dévoilements, une prise de parole, une note, gel, saut à la 8 en gel, retour, dégel (silencieux), puis « devant la classe » à la 4, retour à la 3 devant la classe, fin
for (let i=0;i<3;i++) { await page.keyboard.press('ArrowRight'); await p(300); }
await page.fill('#vif','ch'); await page.click('#cand span:nth-child(3)'); await page.click('.motifs [data-m="1"]');
await page.keyboard.press('Escape'); await page.keyboard.press('n'); await page.keyboard.type('Beaucoup de « c\'est moche » sur Friedrich.'); await page.keyboard.press('Enter'); await page.keyboard.press('Escape');
await page.click('#volet .vig[data-i="7"]'); await p(100); await page.keyboard.press('Enter'); await p(300);   // garde → geler puis y aller (diapo 8)
console.log('gelé, à la diapo 8 ; classe sur :', await page.evaluate(() => document.getElementById('temoin-txt').textContent));
await page.keyboard.press('g'); await p(100);   // dégel avec écart → garde 2
console.log('garde 2 :', await page.evaluate(() => document.getElementById('garde2').classList.contains('on')+' | '+document.getElementById('garde2-titre').textContent));
await page.screenshot({ path: 'C12/T17-v7-01-garde-au-degel.png' });
await page.keyboard.press('Enter'); await p(300);  // revenir là où est la classe, puis dégeler
console.log('après : diapo', await page.evaluate(() => document.getElementById('numero').textContent), '| gel', await page.evaluate(() => document.body.classList.contains('gel')));
for (let i=0;i<3;i++) { await page.keyboard.press('ArrowRight'); await p(200); }   // finit la diapo 1 → passe à la 2
await page.click('#volet .vig[data-i="3"]'); await p(100); await page.click('#garde-devant'); await p(400);   // saut devant la classe à la 4
await page.click('#volet .vig[data-i="2"]'); await p(100); await page.click('#garde-devant'); await p(400);   // retour devant la classe à la 3
await page.keyboard.press('r'); await p(300);
await page.screenshot({ path: 'C12/T17-v7-02-relecture-onglet.png' }); await page.keyboard.press('r'); await p(200); await page.screenshot({ path: 'C12/T17-v7-03-retour-pilotage.png' });
console.log('journal :', await page.evaluate(() => J.map(e => e.type + (e.di!=null?'#'+(e.di+1):'') + (e.nature?'('+e.nature+')':'')).join(' ')));
console.log('erreurs :', errs); await nav.close();

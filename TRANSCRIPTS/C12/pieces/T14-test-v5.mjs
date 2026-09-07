import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1366, height: 768 } }); const errs=[]; page.on('pageerror', e => errs.push(String(e.message)));
await page.goto('file:///home/claude/C12/T14-maquette-pilotage-ordi-v5-manipulable.html'); await page.waitForTimeout(500);
for (let i=0;i<3;i++) await page.keyboard.press('ArrowRight');
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(200);          // hors fil → la garde
await page.screenshot({ path: 'C12/T14-v5-01-garde-au-retour.png' });
console.log('garde ouverte :', await page.evaluate(() => document.getElementById('garde').classList.contains('on')), '|', await page.evaluate(() => document.getElementById('garde-titre').textContent));
await page.keyboard.press('Enter'); await page.waitForTimeout(200);              // Entrée = geler puis y aller
console.log('après Entrée : gel =', await page.evaluate(() => document.body.classList.contains('gel')), '| dévoilés =', await page.evaluate(() => document.getElementById('compte').textContent));
await page.keyboard.press('PageDown'); await page.keyboard.press('PageDown'); await page.waitForTimeout(150);   // gelé : plus de garde
console.log('gelé, deux sauts : garde ouverte ?', await page.evaluate(() => document.getElementById('garde').classList.contains('on')), '| diapo', await page.evaluate(() => document.getElementById('numero').textContent));
await page.screenshot({ path: 'C12/T14-v5-02-gele-circule-librement.png' });
await page.keyboard.press('g'); await page.waitForTimeout(150);
for (let i=0;i<7;i++) await page.keyboard.press('ArrowRight');                  // le fil normal : jamais de garde
console.log('fil normal (▶ ×7) : garde ouverte ?', await page.evaluate(() => document.getElementById('garde').classList.contains('on')), '| diapo', await page.evaluate(() => document.getElementById('numero').textContent));
console.log('éléments de la diapo courante :', await page.evaluate(() => document.getElementById('compte').textContent));
await page.click('#volet .vig[data-i="9"]'); await page.waitForTimeout(150);
console.log('clic vignette 10 (saut) : garde ouverte ?', await page.evaluate(() => document.getElementById('garde').classList.contains('on')), '|', await page.evaluate(() => document.getElementById('garde-titre').textContent));
await page.click('#garde-devant'); await page.waitForTimeout(150);
console.log('« devant la classe » : diapo', await page.evaluate(() => document.getElementById('numero').textContent), '| gel =', await page.evaluate(() => document.body.classList.contains('gel')));
console.log('erreurs :', errs); await nav.close();

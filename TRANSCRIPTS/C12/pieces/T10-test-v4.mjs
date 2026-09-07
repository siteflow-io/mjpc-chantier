import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 } });
const page = await ctx.newPage(); const errs=[]; page.on('pageerror', e => errs.push(String(e.message)));
await page.goto('file:///home/claude/C12/T10-maquette-pilotage-ordi-v4-manipulable.html'); await page.waitForTimeout(600);
await page.screenshot({ path: 'C12/T10-v4-01-ouverture.png' });
// dévoiler 3 fois, surligner l'étape 3, taille +3 (pagination), gel, notes N, loupe
for (let i=0;i<3;i++) await page.keyboard.press('ArrowRight');
await page.click('#blum'); await page.click('#mur li[data-k="2"]'); await page.click('#blum');
await page.screenshot({ path: 'C12/T10-v4-02-devoile-surligne.png' });
await page.evaluate(() => { const r=document.getElementById('taille'); r.value=3; r.dispatchEvent(new Event('input')); }); await page.waitForTimeout(200);
await page.screenshot({ path: 'C12/T10-v4-03-texte-plus3-pagine.png' });
console.log('page :', await page.evaluate(() => document.querySelector('#mur .page').textContent));
await page.keyboard.press('g'); await page.keyboard.press('PageDown'); await page.waitForTimeout(200);
await page.screenshot({ path: 'C12/T10-v4-04-gele-et-diapo-suivante.png' });
await page.keyboard.press('g'); await page.keyboard.press('PageUp');
await page.keyboard.press('n'); await page.keyboard.type('Line a proposé « le sublime » sans le mot.'); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
await page.screenshot({ path: 'C12/T10-v4-05-notes-fil.png' }); await page.keyboard.press('Escape');
// la fenêtre du tableau
const [murW] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]); await murW.waitForLoadState(); await murW.setViewportSize({width:960,height:540}); await page.waitForTimeout(500);
await murW.screenshot({ path: 'C12/T10-v4-06-fenetre-tableau.png' });
// loupe : tracer un cadre sur l'écran de contrôle, voir le mur
await page.keyboard.press('l'); const r = await page.locator('#mur').boundingBox();
await page.mouse.move(r.x+40, r.y+60); await page.mouse.down(); await page.mouse.move(r.x+400, r.y+230); await page.mouse.up(); await page.waitForTimeout(400);
await page.screenshot({ path: 'C12/T10-v4-07-loupe-controle.png' }); await murW.screenshot({ path: 'C12/T10-v4-08-loupe-au-tableau.png' });
// participation
await page.keyboard.press('l'); await page.fill('#vif', 'ch'); await page.waitForTimeout(100); await page.click('#cand span:nth-child(2)'); await page.click('.motifs [data-m="2"]');
console.log('participation :', await page.evaluate(() => document.getElementById('dern').textContent+' | '+document.getElementById('total').textContent));
console.log('erreurs :', errs);
await nav.close();

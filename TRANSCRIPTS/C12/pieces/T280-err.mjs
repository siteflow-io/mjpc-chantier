import { chromium } from '/home/claude/.npm-global/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1536, height: 864 } }); page.on('pageerror', e => console.log('ERREUR :', e.message, (e.stack||'').split('\n')[1]));
await page.goto('file:///home/claude/C12/' + process.argv[2]); await page.waitForTimeout(600); await page.click('#edt-cases [data-lancer="1"]'); await page.waitForTimeout(300);
console.log(await page.evaluate(() => 'vignettes : ' + document.querySelectorAll('#volet .vig').length + ' | numero : ' + document.getElementById('numero').textContent)); await nav.close();

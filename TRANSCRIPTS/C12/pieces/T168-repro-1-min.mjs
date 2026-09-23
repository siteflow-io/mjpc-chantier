import { chromium } from '/home/claude/.npm-global/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const page = await nav.newPage({ viewport: { width: 1536, height: 864 } }); page.on('pageerror', e => console.log('ERREUR', e.message)); const p = ms => page.waitForTimeout(ms); const ev = f => page.evaluate(f);
await page.goto('file:///home/claude/C12/maquette-v9c14c-courante.html'); await p(600); await page.click('#edt-cases [data-lancer="1"]'); await p(300);
const photo = async (lib) => console.log(lib, JSON.stringify(await ev(() => ({ di: S.di, act: ecran().act, garde: document.getElementById('garde-cahier').classList.contains('on'), nDev: etatDiapo().nDev, vus: Object.keys(vuMax).length, etats: Array.from(document.querySelectorAll('#durees .dur-e')).map(x => x.textContent), journal: J.slice(-4).map(x => x.type + (x.di != null ? '@' + x.di : '')), reste: Math.round((heureCahier() - now()) / 1000), paliers: S.paliers }))));
await page.click('#durees .dur-l:nth-child(1) .dur-in'); await page.keyboard.press('Control+a'); await page.keyboard.type('1'); await page.keyboard.press('Enter'); await p(500); await photo('t+0');
for (let s = 15; s <= 75; s += 15) { await p(15000); await photo('t+' + s + 's'); }
await nav.close();

import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 } }); const page = await ctx.newPage(); const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/C12/maquette-v9b-courante.html'); await p(400);
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(300);
// toutes les couches à la fois : diapo 10 (légende), commentaire (pastille), réserve en encart, chrono au tableau, pages
await page.click('#volet .vig[data-i="4"]', { button: 'right' }); await p(100); await page.locator('#menu .it', { hasText: 'en réserve' }).first().click(); await p(150);
await page.click('#volet .vig[data-i="9"]'); await p(100); await page.click('#garde-devant'); await p(200);
await page.click('#mur h2', { button: 'right' }); await p(100); await page.locator('#menu .it', { hasText: 'Commenter' }).first().click(); await page.keyboard.type('un commentaire'); await page.keyboard.press('Enter'); await page.keyboard.press('Escape'); await p(100);
await page.click('#bplus'); await page.click('#menuplus [data-a="reserve"]'); await p(100); await page.click('#freserve [data-enc]'); await page.click('#freserve-x'); await p(100);
await page.click('#bplus'); await page.click('#menuplus [data-a="chrono"]'); await p(300);
for (let k = 0; k < 3; k++) await page.keyboard.press('ArrowRight'); await p(300);
console.log('diapo :', await ev(() => ({ di: S.di, act: ecran().act, legende: ecran().legende, legsur: !!document.querySelector('#mur .legsur'), pastille: document.getElementById('pastille').style.display, comm: Object.keys(S.comm) })));
const mesure = () => { const sel = ['.etiq', '.pastille', '.legsur', '.encart', '.bandeau.on', '.page', '.legende', '.corpsd h2']; const els = []; sel.forEach(s => document.querySelectorAll('#mur ' + s + ', #mur2 ' + s + ', #murcadre > ' + s).forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.height) els.push({ s, r: { l: r.left, t: r.top, ri: r.right, b: r.bottom } }); })); const chev = []; for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) { const a = els[i].r, b = els[j].r; if (a.l < b.ri - 2 && b.l < a.ri - 2 && a.t < b.b - 2 && b.t < a.b - 2) chev.push(els[i].s + ' × ' + els[j].s); } return { couches: els.map(e => e.s), chev }; };
console.log('pilote :', JSON.stringify(await ev(mesure))); console.log('tableau :', JSON.stringify(await tab.evaluate(mesure)));
await page.screenshot({ path: 'vis/v9b-couches-pilote.png' }); await tab.screenshot({ path: 'vis/v9b-couches-mur.png' });
await nav.close();

import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message)); const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a); const out = [];
await page.goto('file:///home/claude/C12/maquette-v9c5-courante.html'); await p(500); await page.click('#edt-cases [data-lancer="1"]'); await p(300);
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]); await tab.waitForLoadState(); await p(400);
const etat = async (nom) => { const s = await ev(() => ({ di: S.di, nDev: etatDiapo().nDev, gel: !!S.gel, garde: document.getElementById('garde').classList.contains('on'), t: document.getElementById('garde-titre').textContent })); const t = await tab.evaluate(() => (window._et || {}).di); out.push(`${nom} → pilote d${s.di + 1} (${s.nDev}) · tableau d${t == null ? '?' : t + 1} · gel ${s.gel ? 'oui' : 'non'} · garde ${s.garde ? 'OUVERTE « ' + s.t + ' »' : 'non'}`); return s; };
const fermer = async () => { if (await ev(() => document.getElementById('garde').classList.contains('on'))) await page.click('#garde-non'); };
// a. depuis d1, clic sur la vignette 9 (« pas dans cette heure »)
await page.click('#volet .vig[data-i="8"]'); await p(200); await etat('a. d1 → clic vignette 9 (hors heure)'); await fermer();
// b. tout dévoiler d1, puis clic sur la vignette 2 en cliquant SUR la miniature (le contenu de la diapo réduite)
for (let k = 0; k < 6; k++) await page.keyboard.press('ArrowRight'); await p(100);
await page.click('#volet .vig[data-i="1"] .mini .mur'); await p(200); await etat('b. d1 finie → clic sur la miniature de la 2');
// c. depuis d2 (image, 0 élément), clic vignette 3 (la suivante) puis vignette 5
await page.click('#volet .vig[data-i="2"]'); await p(200); await etat('c1. d2 (image) → clic vignette 3'); await fermer();
await page.click('#volet .vig[data-i="4"]'); await p(200); await etat('c2. → clic vignette 5'); await fermer();
// d. ▶ depuis une image : passe à la suivante ? (fil)
await page.keyboard.press('ArrowRight'); await p(200); await etat('d. ▶ sur une image');
// e. clic droit → Y aller sur la vignette 6
await page.click('#volet .vig[data-i="5"]', { button: 'right' }); await p(120); const it = page.locator('#menu .it', { hasText: 'Y aller' }); if (await it.count()) await it.first().click(); await p(200); await etat('e. clic droit → Y aller (vignette 6)'); await fermer();
// f. T (toutes) → clic sur la 7
await page.keyboard.press('t'); await p(200); await page.click('#toutes .vig[data-i="6"]'); await p(200); await etat('f. Toutes → clic diapo 7'); await fermer();
// g. la fiche d'élève ouverte, puis clic sur une vignette
await page.click('#vif'); await page.keyboard.type('ze'); await p(500); await page.click('#volet .vig[data-i="6"]'); await p(200); await etat('g. fiche d\'élève ouverte → clic vignette 7'); await fermer();
// h. pendant le gel : clic vignette (pas de garde attendue)
await page.click('#bgel'); await p(150); await page.click('#volet .vig[data-i="7"]'); await p(200); await etat('h. gel → clic vignette 8'); await page.click('#bgel'); await p(150); if (await ev(() => document.getElementById('garde2').classList.contains('on'))) await page.click('#garde2-revenir'); await p(200); await etat('   dégel, revenu');
// i. PageDown / PageUp
await page.keyboard.press('PageDown'); await p(200); await etat('i1. PageDown'); await fermer(); await page.keyboard.press('PageUp'); await p(200); await etat('i2. PageUp'); await fermer();
// j. la dernière diapo de l'heure (d8) : ▶ au bout, puis PageDown
await page.click('#volet .vig[data-i="7"]'); await p(200); await fermer(); await ev(() => { S.di = 7; tout(); }); await p(100); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await p(200); await etat('j1. d8, ▶ au bout'); await page.keyboard.press('PageDown'); await p(200); await etat('j2. d8 → PageDown'); await fermer();
// k. en H2 : lancer, réactivation, puis PageDown et clic vignette « Tableau 1 » (glissée)
await page.click('#bfin'); await p(400); await page.click('#f-clore'); await p(400); await page.click('#edt-cases [data-lancer="2"]'); await p(400); await page.click('#o-lancer'); await p(400); const [tab2] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]).catch(() => [null]);
await etat('k0. H2 lancée'); await page.keyboard.press('ArrowRight'); await p(150); await etat('k1. ▶ sur la réactivation'); await page.keyboard.press('ArrowRight'); await p(200); await etat('k2. ▶ (fin de la réactivation)'); await page.keyboard.press('PageDown'); await p(200); await etat('k3. PageDown'); await fermer(); await page.click('#volet .vig[data-i="1"]'); await p(200); await etat('k4. clic vignette Tableau 1 (glissée)'); await fermer();
console.log(out.join('\n')); console.log('erreurs JS :', errs); await nav.close();

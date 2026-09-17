import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/C12/maquette-v9c6-courante.html'); await p(500); await page.click('#edt-cases [data-lancer="1"]'); await p(300);
const gardeOn = () => ev(() => document.getElementById('garde').classList.contains('on'));
// 1. la garde (a) : depuis d1 finie, la vignette suivante demande ; depuis une image, la suivante demande ; une vignette d'avant demande ; ▶ passe sans demander
for (let k = 0; k < 6; k++) await page.keyboard.press('ArrowRight'); await p(100);
await page.click('#volet .vig[data-i="1"]'); await p(200); ok(await gardeOn(), 'diapo finie → la vignette suivante ne demande pas (règle a)'); await page.click('#garde-devant'); await p(200);
await page.click('#volet .vig[data-i="2"]'); await p(200); ok(await gardeOn(), 'depuis une image → la vignette suivante ne demande pas'); await page.click('#garde-devant'); await p(200);
await page.click('#volet .vig[data-i="0"]'); await p(200); ok(await gardeOn() && /revenir à la diapo 1/.test(await ev(() => document.getElementById('garde-titre').textContent)), 'une vignette d\'avant ne demande pas'); await page.click('#garde-non'); await p(100);
await page.keyboard.press('ArrowRight'); await p(200); ok(!(await gardeOn()) && (await ev(() => S.di)) === 3, '▶ depuis une image ne passe pas à la suivante sans demander');
await page.keyboard.press('PageDown'); await p(200); ok(await gardeOn(), 'PageDown ne demande pas'); await page.click('#garde-non');
// 2. le double affichage : deux réponses de suite
await page.click('#volet .vig[data-i="7"]'); await p(150); await page.click('#garde-devant'); await p(200); await page.keyboard.press('ArrowRight'); await p(100);
await page.click('#mur .ajout .ini'); await page.keyboard.type('ga'); await page.keyboard.press('Enter'); await page.keyboard.type('Une première réponse.'); await page.keyboard.press('Enter'); await p(200);
ok((await ev(() => document.querySelector('#mur .ajout .txt').textContent)) === '', 'le champ de réponse n\'est pas vidé après Entrée');
await page.keyboard.type('ea'); await page.keyboard.press('Enter'); await page.keyboard.type('Une seconde.'); await page.keyboard.press('Enter'); await p(200);
const reps = await ev(() => (etatDiapo().reps[0] || []).map(r => r.i + ':' + r.r)); ok(reps.length === 2 && reps[1] === 'EA:Une seconde.', 'la seconde réponse est doublée : ' + reps.join(' | '));
// 3. une image montrée compte faite : elle ne glisse pas et n'est pas au T-5
await page.click('#bfin'); await p(400); const cartes = await ev(() => Array.from(document.querySelectorAll('#fin .carte')).map(c => c.querySelector('b').textContent + ' (' + c.querySelectorAll('.mini').length + ')')); console.log('T-5 :', cartes.join(' | '));
ok(!cartes.some(c => /Analyse d'images.*\(6\)/.test(c)), 'les images montrées (d2, d3) sont encore au T-5 comme restantes'); await page.click('#f-fermer'); await p(150);
// 4. la vue de droite : la diapo suivante en entier ; Tableau bascule vers ce que voit la classe (rien de non dévoilé) ; pendant le gel, la vue reste sur la classe
await page.click('#volet .vig[data-i="0"]'); await p(150); await page.click('#garde-devant'); await p(200);
ok(/Diapo suivante/.test(await ev(() => document.getElementById('vue-titre').textContent)) && /Tableau 1/.test(await ev(() => document.getElementById('suiv-titre').textContent)) && await ev(() => !!document.querySelector('#vue-mini .mur .act')), 'la diapo suivante n\'est pas rendue en entier');
await ev(() => { etatDiapo().nDev = 2; tout(); }); await p(100); await page.click('#btableau'); await p(200);
const vue = await ev(() => ({ titre: document.getElementById('vue-titre').textContent, visibles: Array.from(document.querySelectorAll('#vue-mini .mur li[data-k]')).filter(l => getComputedStyle(l).display !== 'none').length, gris: Array.from(document.querySelectorAll('#vue-mini .mur li.pas')).filter(l => getComputedStyle(l).display !== 'none').length }));
ok(/Le tableau, en ce moment/.test(vue.titre) && vue.visibles === 2 && vue.gris === 0, 'la vue Tableau ne montre pas exactement ce que voit la classe : ' + JSON.stringify(vue));
ok((await page.context().pages()).length === 1, 'le bouton Tableau a ouvert une fenêtre');
await page.click('#bgel'); await p(100); await page.keyboard.press('ArrowRight'); await p(150); ok((await ev(() => Array.from(document.querySelectorAll('#vue-mini .mur li[data-k]')).filter(l => getComputedStyle(l).display !== 'none').length)) === 2, 'pendant le gel, la vue Tableau a suivi le pilote'); await page.click('#bgel'); await p(100); if (await ev(() => document.getElementById('garde2').classList.contains('on'))) await page.click('#garde2-ici'); await p(150);
await page.click('#btableau'); await p(150); ok(/Diapo suivante/.test(await ev(() => document.getElementById('vue-titre').textContent)), 'le second clic ne revient pas à la diapo suivante');
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]); await tab.waitForLoadState(); await p(300); ok(!!tab, '« Écran 2 » n\'ouvre pas la fenêtre du vidéoprojecteur');
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await page.screenshot({ path: 'vis/v9c6-vue.png' }); await nav.close();

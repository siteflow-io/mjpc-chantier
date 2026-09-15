import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a); const D = []; const ok = (c, m) => { if (!c) D.push(m); };
await page.goto('file:///home/claude/C12/maquette-v9c2-courante.html'); await p(400);
// lundi : 4 étapes de l'activité 1 ; clore (elle glisse par défaut)
for (let k = 0; k < 4; k++) await page.keyboard.press('ArrowRight'); await p(100);
ok(/Activité 1 — Analyse d'images/.test(await ev(() => document.querySelector('#mur .etiq').textContent)), 'l\'étiquette ne porte pas le numéro d\'activité');
await page.click('#bfin'); await p(400); await page.click('#f-clore'); await p(400); await page.click('#o-lancer'); await p(400);
// mardi : réactivation, puis ▶ → l'activité 1 reprend à l'étape 5, les 4 premières fléchées
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await p(200);
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(400);
const etat = await ev(() => ({ act: ecran().act, deja: document.querySelectorAll('#mur li.deja').length, cahier: document.querySelector('#mur li.cahier') ? document.querySelector('#mur li.cahier').textContent : null, pas: document.querySelectorAll('#mur li.pas').length }));
console.log('mardi, activité 1 :', JSON.stringify(etat));
ok(etat.act === "Analyse d'images : la routine" && etat.deja === 4 && /retrouve cette partie dans ton cahier/.test(etat.cahier) && etat.pas === 2, 'la reprise n\'est pas fléchée (4 déjà vues, le cahier, 2 à venir)');
const mur = await tab.evaluate(() => ({ deja: document.querySelectorAll('#mur2 li.deja').length, cahier: !!document.querySelector('#mur2 li.cahier'), texte: (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 200) }));
ok(mur.deja === 4 && mur.cahier, 'le tableau ne montre pas le fléchage'); await tab.screenshot({ path: 'vis/v9c-04-reprise-mur.png' }); await page.screenshot({ path: 'vis/v9c-04-reprise-pilote.png' });
await page.keyboard.press('ArrowRight'); await p(150); ok((await ev(() => document.querySelectorAll('#mur li.pas').length)) === 1, '▶ ne dévoile pas l\'étape 5');
await page.keyboard.press('r'); await p(300); await page.click('#faces [data-f="recit"][data-h="2"]'); await p(300); const r2 = await ev(() => document.getElementById('rel').innerText);
ok(/Activité 1 — Analyse d'images/.test(r2), 'le récit de mardi ne porte pas le numéro'); ok(/on a repris l'activité 1 là où on s'était arrêté — la partie déjà faite est dans le cahier/.test(r2), 'le récit de mardi ne dit pas la reprise');
ok(!/on a observé les images en silence/.test(r2), 'le récit de mardi répète ce qui a été fait lundi'); ok(/hypothèse/.test(r2.split('Activité 1')[1] || ''), 'le récit de mardi n\'a pas l\'étape 5');
console.log('récit mardi (extrait) :', r2.replace(/\s+/g, ' ').slice(0, 420));
if (errs.length) D.push('erreurs : ' + errs.join(' | ')); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();

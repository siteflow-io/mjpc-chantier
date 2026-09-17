import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/C12/maquette-v9c8-courante.html'); await p(500); await page.click('#edt-cases [data-lancer="1"]'); await p(300);
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(400);
// deux réponses (GA, RD) et une prise de parole (LD) : « qui a participé » compte 3
await ev(() => { S.di = 7; S.page = null; tout(); }); await p(100); await page.keyboard.press('ArrowRight');
for (const [ini, txt] of [['ga', 'Une nature.'], ['rd', 'La solitude.']]) { await page.click('#mur .rep.libre .ini'); await page.keyboard.type(ini); await page.keyboard.press('Enter'); await page.keyboard.type(txt); await page.keyboard.press('Enter'); await p(150); }
await page.keyboard.press('Escape'); await page.click('#vif'); await page.keyboard.type('ld'); await p(250); await page.keyboard.press('1'); await p(200);
await page.click('#bplus'); await page.click('#menuplus [data-a="qui"]'); await p(300);
const q = await tab.evaluate(() => ({ t: (document.querySelector('#mur2 .quit') || {}).textContent, l: (document.querySelector('#mur2 .quil') || {}).textContent }));
ok(/3 élèves sur 29/.test(q.t) && /Gatien|Romain|Lucas/.test(q.l) && (q.l.match(/·/g) || []).length === 2, '« qui a participé » ne compte pas les réponses : ' + JSON.stringify(q));
await page.keyboard.press('Escape'); await p(150);
// à T-5 : le tableau passe sur la vue de fin d'heure — travail à faire et date à gauche, participation à droite ; le pilotage garde son écran
await page.click('#bsimu'); await page.click('#s-t5'); await p(500);
const f = await tab.evaluate(() => { const g = document.querySelector('#mur2 .finh-g'), d = document.querySelector('#mur2 .finh-d'); return g && d ? { gauche: g.innerText.replace(/\s+/g, ' ').slice(0, 120), droite: d.innerText.replace(/\s+/g, ' ').slice(0, 120) } : null; });
ok(f && /Travail à faire — pour/.test(f.gauche) && /3 élèves sur 29 ont participé/.test(f.droite), 'à T-5 le tableau ne montre pas la vue de fin d\'heure : ' + JSON.stringify(f));
ok(await ev(() => document.getElementById('ecran-fin').classList.contains('on') && !!document.getElementById('f-ed') && document.getElementById('f-ed').isContentEditable), 'le champ ED du pilotage n\'est pas modifiable');
// Paul écrit son propre texte ; l'échéance choisie ; le tableau le montre tel quel ; le journal le garde ; à la clôture, le récit le porte tel quel
await page.selectOption('#f-ech', '2026-09-09'); await p(100); await page.click('#f-ed'); await page.keyboard.press('Control+a'); await page.keyboard.type('Relire les cinq tableaux et retenir un titre et un peintre.'); await p(1100);
const f2 = await tab.evaluate(() => (document.querySelector('#mur2 .finh-g') || {}).innerText.replace(/\s+/g, ' '));
ok(/mercredi 9 septembre/.test(f2) && /Relire les cinq tableaux et retenir un titre et un peintre\./.test(f2), 'le tableau ne montre pas le texte de Paul avec sa date : ' + f2);
ok(await ev(() => J.some(x => x.type === 'travail-edite' && /Relire les cinq/.test(x.texte))), 'le texte de Paul n\'est pas au journal');
await page.click('#f-ok'); await p(200); await page.click('#bfin'); await p(400); ok(/Relire les cinq tableaux/.test(await ev(() => document.getElementById('f-ed').textContent)), 'le texte de Paul n\'est pas repris dans l\'écran de clôture'); await page.click('#f-clore'); await p(500); await page.click('#edt-cases [data-lancer="2"]'); await p(300); await page.click('#o-relecture'); await p(400);
const r = await ev(() => (document.querySelector('#rel .recit') || document.getElementById('rel')).innerText); ok(/Relire les cinq tableaux et retenir un titre et un peintre\./.test(r), 'le récit ne porte pas le texte de Paul tel quel');
ok(await ev(() => S.travailHeure[1] === 'Relire les cinq tableaux et retenir un titre et un peintre.'), 'l\'historique ne garde pas le texte tel quel');
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();

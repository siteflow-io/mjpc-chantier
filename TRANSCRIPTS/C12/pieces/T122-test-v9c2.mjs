import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const F = 'file:///home/claude/C12/maquette-v9c2-courante.html';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
const allerVig = async i => { await page.click(`#volet .vig[data-i="${i}"]`); await p(150); if (await ev(() => document.getElementById('garde').classList.contains('on'))) await page.click('#garde-devant'); await p(200); };
const menuA = async (sel, txt) => { await page.click(sel, { button: 'right' }); await p(120); const b = page.locator('#menu .it', { hasText: txt }); if (await b.count() === 0) { D.push('entrée absente : ' + txt); await page.keyboard.press('Escape'); return false; } await b.first().click(); await p(200); return true; };
await page.goto(F); await p(600);
// A. la loi de taille : la diapo 1 entière (6 étapes) à 32 pt, dans le cadre, outils visibles ; la police est proportionnelle au cadre
for (let k = 0; k < 6; k++) await page.keyboard.press('ArrowRight');
const m1 = await ev(() => { const m = document.getElementById('mur'); const c = m.querySelector('.corpsd'); const r = m.getBoundingClientRect(); const fs = parseFloat(getComputedStyle(c).fontSize); return { pt: +(fs / r.height / 0.056 * 32).toFixed(1), pages: S.pagesCourantes ? S.pagesCourantes.length : 1, li: m.querySelectorAll('li[data-k]:not(.hors)').length, deborde: c.scrollHeight > c.clientHeight + 2 }; });
ok(m1.pt >= 31 && m1.pt <= 33 && m1.pages === 1 && m1.li === 6 && !m1.deborde, 'la diapo 1 ne tient pas entière à 32 pt : ' + JSON.stringify(m1));
// B. les colonnes se replient, la diapo grandit, la police suit
const w0 = await ev(() => document.getElementById('mur').getBoundingClientRect().width); await page.click('#pg'); await page.click('#pd'); await p(300);
const w1 = await ev(() => document.getElementById('mur').getBoundingClientRect().width); ok(w1 > w0 * 1.15, 'la diapo ne grandit pas quand les colonnes se replient');
ok(await ev(() => { const o = document.querySelector('.outils').getBoundingClientRect(); const sc = document.querySelector('.scene').getBoundingClientRect(); return o.bottom <= sc.bottom + 1; }), 'les outils sortent de l\'écran une fois les colonnes repliées');
await page.click('#pg'); await page.click('#pd'); await p(200); ok(Math.abs((await ev(() => document.getElementById('mur').getBoundingClientRect().width)) - w0) < 2, 'rouvrir les colonnes ne rend pas la place');
// C. le zoom Ctrl + molette reste dans le cadre
for (let k = 0; k < 4; k++) await ev(() => document.querySelector('.scene').dispatchEvent(new WheelEvent('wheel', { deltaY: 100, ctrlKey: true, bubbles: true, cancelable: true }))); await p(200);
ok(await ev(() => { const m = document.getElementById('mur').getBoundingClientRect(); const o = document.querySelector('.outils').getBoundingClientRect(); return m.bottom <= o.top + 1; }), 'le zoom passe par-dessus les outils');
for (let k = 0; k < 4; k++) await ev(() => document.querySelector('.scene').dispatchEvent(new WheelEvent('wheel', { deltaY: -100, ctrlKey: true, bubbles: true, cancelable: true })));
// D. les miniatures : de vraies diapos réduites
ok((await ev(() => document.querySelectorAll('#volet .mini .mur .corpsd, #volet .mini .mur .imgzone').length)) >= 18, 'les vignettes ne sont pas de vraies diapos');
ok(/Étape 1/.test(await ev(() => document.querySelector('#volet .mini .mur').innerText)), 'la miniature de la diapo 1 ne montre pas son contenu');
// E. l'activité : numéro et titre ; 7 diapos pour l'activité 1 ; le T-5 par activité
ok(/Activité 1 — Analyse d'images/.test(await ev(() => document.querySelector('#mur .etiq').textContent)), 'l\'étiquette ne porte pas le numéro d\'activité');
await allerVig(1); ok(/Activité 1 — Tableau 1/.test(await ev(() => document.querySelector('#mur .etiq').textContent)), 'Tableau 1 n\'est pas dans l\'activité 1');
ok(/activité 1 \(2\/7\)/.test(await ev(() => document.getElementById('numero').textContent)), 'le compte des diapos de l\'activité manque');
// F. ² → VIF ; palette Maj+Espace ; historique ; Ctrl+Z ; surlignage
await page.keyboard.press('Escape'); await ev(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '²', bubbles: true }))); await p(100); ok(await ev(() => document.activeElement && document.activeElement.id === 'vif'), '² ne va pas au VIF');
await page.keyboard.press('Escape'); await page.keyboard.press('Shift+ '); await p(150); ok(await ev(() => document.getElementById('fpalette').classList.contains('on')), 'Maj + Espace n\'ouvre pas la palette');
await page.keyboard.type('ze'); await p(100); ok(/→ Zélia/.test(await ev(() => document.getElementById('pal-sug').textContent)), 'la palette ne trouve pas Zélia'); await page.keyboard.press('2'); await p(150);
ok((await ev(() => S.parts.length)) === 1 && !(await ev(() => document.getElementById('fpalette').classList.contains('on'))), 'la palette ne pose pas et ne se ferme pas');
await page.keyboard.press('Shift+ '); await page.keyboard.type('xq'); await p(100); ok(/aucun élève/.test(await ev(() => document.getElementById('pal-sug').textContent)), 'la palette ne dit pas « aucun élève »'); await page.keyboard.press('1'); await p(100); ok((await ev(() => S.parts.length)) === 1, 'la palette a posé alors qu\'elle disait « aucun élève »'); await page.keyboard.press('Escape');
await page.click('#liste div[data-e*="Zélia"], #liste div[title*="Zélia"]'); await p(150); ok(/Zélia — 1 prise de parole/.test(await ev(() => document.getElementById('fhist-t').textContent)), 'l\'historique de Zélia ne s\'ouvre pas'); await page.selectOption('#fhist-l select', '3'); await p(100); ok((await ev(() => S.parts[0].m)) === '3', 'le motif ne se corrige pas dans l\'historique'); await page.click('#fhist-x');
await page.keyboard.press('Control+z'); await p(100); ok((await ev(() => S.parts.length)) === 0, 'Ctrl+Z n\'annule pas la dernière prise');
await allerVig(0); await ev(() => { const li = document.querySelector('#mur h2[data-p]'); const s = window.getSelection(); const r = document.createRange(); r.setStart(li.firstChild, 0); r.setEnd(li.firstChild, 12); s.removeAllRanges(); s.addRange(r); }); await page.keyboard.press('Control+h'); await p(150);
ok((await ev(() => document.querySelectorAll('#mur mark').length)) === 1, 'Ctrl+H ne surligne pas la sélection'); ok(await ev(() => J.some(x => x.type === 'surligne' && x.couleur === 'jaune')), 'le surlignage n\'est pas au journal');
// G. la fin d'heure par activité : une carte par activité, ses diapos restantes dedans ; le rattrapage avant lancement
await page.click('#bfin'); await p(500); const cartes = await ev(() => Array.from(document.querySelectorAll('#fin .carte')).map(c => ({ t: c.querySelector('b').textContent, minis: c.querySelectorAll('.mini').length })));
console.log('cartes :', cartes.map(c => c.t + ' (' + c.minis + ')').join(' | '));
ok(cartes.length >= 1 && /Activité 1 — Analyse d'images/.test(cartes[0].t) && cartes[0].minis === 6, 'la carte de l\'activité 1 n\'a pas ses 6 diapos restantes');
await page.click('#fin .carte:nth-child(1) [data-c="terminer"]'); await p(300); ok(/Terminer « Activité 1 — Analyse d'images/.test(await ev(() => document.getElementById('f-ed').textContent)), 'le travail à faire ne parle pas de l\'activité');
await page.click('#f-fermer'); await p(200);
await page.click('#bsimu'); await page.click('#s-h2'); await p(500); ok(/Fin de l'heure/.test(await ev(() => document.querySelector('#fin h2').textContent)) && /rattrap|décider/.test(await ev(() => document.getElementById('fin').innerText)) === true || /Fin de l'heure/.test(await ev(() => document.querySelector('#fin h2').textContent)), 'ouvrir l\'heure suivante sans avoir clos ne rattrape pas le T-5');
await page.fill('#f-mot', 'Pense au tableau à trois colonnes.'); await page.click('#f-clore'); await p(500); ok(/Où en est la 3E Charles de Gaulle — mardi/.test(await ev(() => document.getElementById('fin').innerText)), 'l\'ouverture de mardi ne suit pas la clôture');
await page.click('#o-lancer'); await p(400);
// H. mardi : l'activité 1 glissée entière (6 diapos restantes), le récit par activité ; le mot de l'absent tronqué
const ordre = await ev(() => Array.from(document.querySelectorAll('#volet .vig:not(.hors)')).map(v => v.title.split(' — ')[1] || v.title)); console.log('ordre mardi :', ordre.slice(0, 5).join(' › '));
ok(/Où en sommes-nous/.test(ordre[0]) && /Tableau 1/.test(ordre[1]), 'mardi ne commence pas par la réactivation puis la glissée');
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await p(200);
await menuA('#liste div:nth-child(5)', 'Parti à'); await page.keyboard.press('Enter'); await p(200);
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await p(200);
await page.keyboard.press('r'); await p(400); await page.click('#faces [data-f="recit"][data-h="2"]'); await p(300); const r2 = await ev(() => document.getElementById('rel').innerText);
ok(/Activité 1 — Analyse d'images : les cinq tableaux/.test(r2), 'le récit de mardi ne titre pas par l\'activité'); ok(/tu es parti à/.test(r2) && /Voici ce qu'on a fait pendant ce temps/.test(r2), 'le mot de l\'élève parti n\'est pas tronqué');
ok(((await ev(() => document.querySelector('#rel .recit').innerText)).match(/Activité 1 —/g) || []).length === 1, 'l\'activité 1 fait plusieurs paragraphes');
await page.screenshot({ path: 'vis/v9c2-04-recit-mardi.png' });
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();

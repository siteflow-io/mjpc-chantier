import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const F = 'file:///home/claude/C12/T44-maquette-pilotage-ordi-v9a-manipulable.html';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1875, height: 868 } }); const page = await ctx.newPage(); const errs=[]; page.on('pageerror', e => { errs.push(String(e.message)); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); };
await page.goto(F); await p(400);
const compte = () => page.evaluate(() => document.getElementById('compte').textContent);
// 1. ◀ sur la même diapo : sans garde, journal 'retire'
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowLeft'); await p(150);
ok(!(await page.evaluate(() => document.getElementById('garde').classList.contains('on'))), '◀ sur la même diapo ouvre la garde');
ok((await compte()) === '1 / 6 dévoilés', '◀ n\'a pas revoilé : ' + await compte());
ok((await page.evaluate(() => J.filter(e => e.type === 'retire').length)) === 1, 'le retrait n\'est pas au journal');
await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft'); await p(150);   // nDev 0 → diapo précédente : garde (on est diapo 1 : rien)
// 2. la mise en commun : diapo 8 « Question-bilan » (question)
await page.click('#volet .vig[data-i="7"]'); await p(120); await page.click('#garde-devant'); await p(300);
const nAjout = await page.evaluate(() => document.querySelectorAll('#mur .ajout').length); ok(nAjout >= 1, 'pas de ligne d\'ajout sur une question : ' + nAjout);
await page.click('#mur .ajout .ini'); await page.keyboard.type('cj'); await p(100);
console.log('candidat :', await page.evaluate(() => document.querySelector('#mur .ajout .qui').textContent));
await page.keyboard.press('Enter'); await p(100);
await page.keyboard.type('Le voyageur est de dos, on voit ce qu\'il voit.', { delay: 5 }); await p(300);
const rep1 = await page.evaluate(() => Array.from(document.querySelectorAll('#mur ol.reps li')).map(l => l.textContent));
ok(rep1.length === 1 && /voyageur/.test(rep1[0]), 'la réponse n\'apparaît pas au fil de la frappe : ' + JSON.stringify(rep1));
ok(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('txt')), 'le curseur a quitté la réponse pendant la frappe');
await page.keyboard.press('Enter'); await p(200);   // réponse suivante
ok(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('ini')), 'Entrée n\'ouvre pas les initiales de la réponse suivante');
await page.keyboard.type('ze'); await page.keyboard.press('Enter'); await page.keyboard.type('La nature est plus grande que lui.', { delay: 5 }); await page.keyboard.press('Enter'); await p(200);
const nR = await page.evaluate(() => document.querySelectorAll('#mur ol.reps li').length); ok(nR === 2, 'deux réponses attendues : ' + nR);
ok((await page.evaluate(() => J.filter(e => e.type === 'reponse').length)) === 2, 'les réponses ne sont pas au journal');
console.log('participation :', await page.evaluate(() => document.getElementById('total').textContent));
// 3. tableau : la réponse y est ; gel : elle n'y va pas pendant, y va au dégel
const [mur] = await Promise.all([ctx.waitForEvent('page'), page.evaluate(() => document.getElementById('btableau').click())]); await mur.waitForLoadState(); await mur.setViewportSize({width:1280,height:720}); await p(500);
ok(/voyageur/.test(await mur.evaluate(() => document.getElementById('mur2').innerText)), 'la réponse n\'est pas au tableau');
await page.keyboard.press('Escape'); await page.click('#bgel'); await p(150); console.log('gelé :', await page.evaluate(() => !!S.gel)); await page.click('#mur .ajout .ini'); await page.keyboard.type('li'); await page.keyboard.press('Enter'); await page.keyboard.type('Réponse pendant le gel', { delay: 5 }); await p(300);
ok(!/pendant le gel/.test(await mur.evaluate(() => document.getElementById('mur2').innerText)), 'une réponse écrite pendant le gel est passée au tableau');
await page.keyboard.press('Escape'); await page.click('#bgel'); await p(300); console.log('dégelé :', await page.evaluate(() => !S.gel));
ok(/pendant le gel/.test(await mur.evaluate(() => document.getElementById('mur2').innerText)), 'au dégel la réponse n\'est pas arrivée au tableau');
// 4. le pavé : police réduite puis pages ; la page suit l'écriture ; la page à la main reste tant qu'on n'écrit pas
for (let i = 0; i < 20; i++) { await page.click('#mur .ajout .ini'); await page.keyboard.type('ab'); await page.keyboard.press('Enter'); await page.keyboard.type('Une réponse assez longue pour remplir la diapo, numéro ' + i + ', avec du texte en plus pour déborder franchement, et encore quelques mots pour être sûr.', { delay: 1 }); await page.keyboard.press('Enter'); await p(60); }
await p(300);
const et1 = await page.evaluate(() => ({ fs: document.querySelector('#mur .bloc[data-bi]') && [...document.querySelectorAll('#mur .bloc')].map(b => b.style.fontSize), page: document.querySelector('#mur .page').textContent, murPage: null }));
console.log('après 10 réponses : polices des blocs', JSON.stringify(et1.fs), '| indicateur :', et1.page);
ok(et1.fs.some(f => f && parseFloat(f) < 1), 'la police du bloc ne s\'est pas réduite');
const pagesMur = await mur.evaluate(() => document.querySelector('#mur2 .page').textContent); console.log('tableau :', pagesMur);
ok(pagesMur === et1.page, 'pilotage et tableau n\'ont pas la même page : ' + pagesMur + ' vs ' + et1.page);
if (/page \d+ \/ \d+/.test(et1.page)) {
  await page.click('#mur .page span[data-p="-1"]'); await p(200); const pg2 = await page.evaluate(() => document.querySelector('#mur .page').textContent); console.log('après ‹ :', pg2);
  ok(/page 1 \//.test(pg2) || pg2 !== et1.page, 'le clic sur ‹ n\'a pas changé de page');
  ok((await mur.evaluate(() => document.querySelector('#mur2 .page').textContent)) === pg2, 'le tableau n\'a pas suivi la page manuelle');
  await page.keyboard.press('Shift+ArrowRight'); await p(200); console.log('après Maj+→ :', await page.evaluate(() => document.querySelector('#mur .page').textContent));
  await page.click('#mur .page span[data-p="-1"]'); await p(150);
  await page.click('#mur .bloc h2'); await p(200); await page.keyboard.type('mm'); await page.keyboard.press('Enter'); await page.keyboard.type('encore', { delay: 5 }); await p(250);
  const pg3 = await page.evaluate(() => document.querySelector('#mur .page').textContent); console.log('en écrivant à nouveau :', pg3); ok(!/page 1 \//.test(pg3), 'la page ne suit pas l\'écriture après un changement manuel');
  ok(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains('txt')), 'le curseur perdu en écrivant après la pagination');
}
// 5. taille de bloc par clic droit ; monter/descendre
await page.keyboard.press('Escape'); await page.click('#mur .bloc', { button: 'right' }); await p(100); await page.click('#menub [data-t="grand"]'); await p(200);
ok(await page.evaluate(() => !!document.querySelector('#mur .bloc.t-grand')), 'la taille « grand » n\'est pas appliquée');
ok(await mur.evaluate(() => !!document.querySelector('#mur2 .bloc.t-grand')), 'la taille « grand » n\'est pas au tableau');
// 6. double-clic retouche un élément gris : reste gris
await page.click('#volet .vig[data-i="0"]'); await p(150); console.log('garde ouverte ?', await page.evaluate(() => document.getElementById('garde').classList.contains('on')), '| menub :', await page.evaluate(() => document.getElementById('menub').classList.contains('on'))); if (await page.evaluate(() => document.getElementById('garde').classList.contains('on'))) await page.click('#garde-devant'); await p(300);
const li4 = page.locator('#mur li[data-k="3"]'); await li4.dblclick(); await page.keyboard.type(' (modifié)'); await page.keyboard.press('Enter'); await p(250);
ok(await page.evaluate(() => { const l = document.querySelector('#mur li[data-k="3"]'); return l && l.classList.contains('pas') && /modifié/.test(l.textContent); }), 'un élément gris retouché ne reste pas gris avec sa modif');
ok(!/modifié/.test(await mur.evaluate(() => document.getElementById('mur2').innerText)), 'un élément gris retouché est passé au tableau');
// 7. Ctrl+molette : la vue change, pas le tableau
const murTxt = await mur.evaluate(() => document.getElementById('mur2').innerHTML);
await page.mouse.move(700, 300); await page.mouse.wheel(0, -100); // sans ctrl : page (pas de pages ici) ; avec ctrl :
await page.keyboard.down('Control'); await page.mouse.wheel(0, -100); await page.keyboard.up('Control'); await p(200);
console.log('zoom de vue :', await page.evaluate(() => document.getElementById('murcadre').style.transform));
ok((await mur.evaluate(() => document.getElementById('mur2').innerHTML)) === murTxt, 'Ctrl+molette a changé le tableau');
await page.screenshot({ path: 'C12/T44-v9a-01-mise-en-commun.png' }); await mur.screenshot({ path: 'C12/T44-v9a-02-tableau.png' });
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs));
console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();

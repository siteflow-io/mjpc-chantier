import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const F = 'file:///home/claude/C12/T18-maquette-pilotage-ordi-v8-manipulable.html';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1875, height: 868 } }); const page = await ctx.newPage(); const errs=[]; page.on('pageerror', e => errs.push(String(e.message)));
const D = []; const p = ms => page.waitForTimeout(ms);
await page.goto(F); await p(300);
await page.screenshot({ path: 'C12/T18-v8-01-ecran-de-paul-1875x868.png' });
// 1. gardes : Échap, Rester, Entrée ; puis la seconde garde
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowLeft'); if (!await page.evaluate(() => document.getElementById('garde').classList.contains('on'))) D.push('garde absente au ◀');
await page.keyboard.press('Escape'); if (await page.evaluate(() => document.getElementById('garde').classList.contains('on'))) D.push('Échap ne ferme pas la garde');
if ((await page.evaluate(() => document.getElementById('compte').textContent)) !== '1 / 6 dévoilés') D.push('Rester a quand même bougé : '+await page.evaluate(() => document.getElementById('compte').textContent));
// 2. le tableau en fenêtre : suit, gel, loupe sur une image
const [mur] = await Promise.all([ctx.waitForEvent('page'), page.click('#btableau')]); await mur.waitForLoadState(); await mur.setViewportSize({width:1280,height:720}); await p(400);
const murTexte = () => mur.evaluate(() => (document.getElementById('mur2').innerText||'').replace(/\s+/g,' ').slice(0,60));
await page.keyboard.press('ArrowRight'); await p(200); const t1 = await murTexte();
if (!/Étape 2/.test(await mur.evaluate(() => document.getElementById('mur2').innerText))) D.push('le tableau ne suit pas le dévoilement');
await page.keyboard.press('g'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await p(200);
if (/Étape 3/.test(await mur.evaluate(() => document.getElementById('mur2').innerText))) D.push('le tableau a bougé pendant le gel');
await page.keyboard.press('g'); await p(200); if (!/Étape 4/.test(await mur.evaluate(() => document.getElementById('mur2').innerText))) D.push('au dégel le tableau ne rattrape pas');
// 3. image : diapo 2, loupe
await page.click('#volet .vig[data-i="1"]'); await p(100); if (await page.evaluate(() => document.getElementById('garde').classList.contains('on'))) await page.click('#garde-devant'); await p(300);
const imgOk = await mur.evaluate(() => !!document.querySelector('#mur2 .imgzone')); if (!imgOk) D.push('la diapo image ne s\'affiche pas au tableau');
await page.keyboard.press('l'); const r = await page.locator('#mur').boundingBox(); await page.mouse.move(r.x+r.width*0.3, r.y+r.height*0.3); await page.mouse.down(); await page.mouse.move(r.x+r.width*0.7, r.y+r.height*0.6); await page.mouse.up(); await p(300);
const tr = await mur.evaluate(() => { const c=document.querySelector('#mur2 .imgzone'); return c? getComputedStyle(c).transform : 'none'; }); if (tr === 'none') D.push('la loupe ne grossit pas une image au tableau');
await mur.screenshot({ path: 'C12/T18-v8-02-loupe-sur-image-au-tableau.png' });
await page.keyboard.press('l'); await p(200); const tr2 = await mur.evaluate(() => { const c=document.querySelector('#mur2 .imgzone'); return c? getComputedStyle(c).transform : 'none'; }); if (tr2 !== 'none') D.push('la loupe ne se range pas au tableau : '+tr2);
// 4. taille +4 sur une diapo à beaucoup d'éléments : pagination au tableau aussi
await page.click('#volet .autre[data-s="1"]'); await p(200); await page.click('#volet .vig[data-i="2"]'); await p(100); if (await page.evaluate(() => document.getElementById('garde').classList.contains('on'))) await page.click('#garde-devant'); await p(200);
await page.evaluate(() => { const r=document.getElementById('taille'); r.value=4; r.dispatchEvent(new Event('input')); }); for (let k=0;k<3;k++) await page.keyboard.press('ArrowRight'); await p(300);
const pg = await page.evaluate(() => document.querySelector('#mur .page').textContent); const pg2 = await mur.evaluate(() => document.querySelector('#mur2 .page').textContent);
if (pg !== pg2) D.push(`pagination différente contrôle/tableau : « ${pg} » vs « ${pg2} »`);
const debord = await mur.evaluate(() => { const c=document.querySelector('#mur2 .corpsd'); return c ? c.scrollHeight - c.clientHeight : 0; }); if (debord > 4) D.push('au tableau, à +4, le texte déborde de '+debord+' px');
await mur.screenshot({ path: 'C12/T18-v8-03-tableau-texte-plus4-page.png' });
// 5. relecture puis retour, la scène est intacte
await page.keyboard.press('r'); await p(200); await page.keyboard.press('r'); await p(200);
const ok = await page.evaluate(() => { const m=document.getElementById('mur').getBoundingClientRect(); return m.top>=44 && m.bottom<=innerHeight; }); if (!ok) D.push('après relecture, la diapo sort de l\'écran');
// 6. appoint, chrono au tableau, qui a participé
page.on('dialog', d => d.accept('le sublime')); await page.click('#bplus'); await page.click('#menu [data-a="appoint"]'); await p(200);
if (!(await page.evaluate(() => DATA.seances[1].ecrans.some(e => /Appoint/.test(e.act))))) D.push('l\'appoint n\'est pas inséré');
await page.click('#bplus'); await page.click('#menu [data-a="chrono"]'); await p(200); if (!(await mur.evaluate(() => document.querySelector('#mur2 .bandeau.on')))) D.push('le chrono n\'apparaît pas au tableau');
if (errs.length) D.push('erreurs JS : '+JSON.stringify(errs));
console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)');
await nav.close();

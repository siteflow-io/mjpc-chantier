import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const F = process.argv[2] || 'file:///home/claude/C12/T17-maquette-pilotage-ordi-v7-manipulable.html';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const defauts = [];
for (const vp of [{w:1366,h:768},{w:1920,h:1080},{w:1536,h:864},{w:1280,h:720},{w:1875,h:868}]) {
  const page = await nav.newPage({ viewport: { width: vp.w, height: vp.h } }); const errs=[]; page.on('pageerror', e => errs.push(String(e.message)));
  await page.goto(F); await page.waitForTimeout(300);
  const etat = async (ou) => { const r = await page.evaluate(() => { const m=document.getElementById('mur').getBoundingClientRect(); const s=document.querySelector('.scene'); const n=document.querySelector('.notes').getBoundingClientRect();
      return { murTop:Math.round(m.top), murBottom:Math.round(m.bottom), murW:Math.round(m.width), bodyScroll:document.body.scrollTop||document.documentElement.scrollTop, sceneScroll:s.scrollTop, notesH:Math.round(n.height), notesBottom:Math.round(n.bottom), pilotageH:document.getElementById('pilotage').getBoundingClientRect().height, innerH:innerHeight }; });
    if (r.murTop < 44 || r.murBottom > r.innerH) defauts.push(`${vp.w}x${vp.h} ${ou} : la diapo sort de l'écran (top ${r.murTop}, bottom ${r.murBottom}, fenêtre ${r.innerH})`);
    if (r.bodyScroll || r.sceneScroll) defauts.push(`${vp.w}x${vp.h} ${ou} : défilement parasite (body ${r.bodyScroll}, scène ${r.sceneScroll})`);
    if (r.notesBottom > r.innerH + 1) defauts.push(`${vp.w}x${vp.h} ${ou} : les notes dépassent en bas (${r.notesBottom} > ${r.innerH})`);
    if (r.pilotageH > r.innerH + 1) defauts.push(`${vp.w}x${vp.h} ${ou} : l'écran est plus haut que la fenêtre (${Math.round(r.pilotageH)} > ${r.innerH})`);
    return r; };
  await etat('ouverture');
  // parcourir toutes les diapos de la séance 1 par la vignette (saut devant la classe), tout dévoiler, taille 4
  const n = await page.evaluate(() => DATA.seances[0].ecrans.length);
  for (let i = 1; i < n; i++) { await page.click(`#volet .vig[data-i="${i}"]`); await page.waitForTimeout(60); if (await page.evaluate(() => document.getElementById('garde').classList.contains('on'))) await page.click('#garde-devant'); await page.waitForTimeout(60);
    for (let k=0;k<8;k++) { const c = await page.evaluate(() => document.getElementById('compte').textContent); if (/(\d+) \/ \1 /.test(c) || /rien/.test(c)) break; await page.keyboard.press('ArrowRight'); }
    await etat('diapo '+(i+1)); }
  await page.evaluate(() => { const r=document.getElementById('taille'); r.value=4; r.dispatchEvent(new Event('input')); }); await page.waitForTimeout(100); await etat('taille +4');
  // participation puis focus : le body ne doit pas défiler
  await page.fill('#vif','ch'); await page.click('#cand span:nth-child(1)'); await page.click('.motifs [data-m="1"]'); await etat('après participation');
  await page.keyboard.press('Escape'); await page.keyboard.press('n'); await page.keyboard.type('note'); await page.keyboard.press('Enter'); await page.keyboard.press('Escape'); await etat('après note');
  // les autres séances
  const ns = await page.evaluate(() => DATA.seances.length);
  for (let s2 = 1; s2 < ns; s2++) { await page.click(`#volet .autre[data-s="${s2}"]`); await page.waitForTimeout(80); await etat('séance '+(s2+1)); }
  if (errs.length) defauts.push(`${vp.w}x${vp.h} : erreurs JS ${JSON.stringify(errs)}`);
  await page.close();
}
await nav.close();
console.log(defauts.length ? defauts.join('\n') : 'aucun défaut');
console.log('--- fin :', defauts.length, 'défaut(s)');

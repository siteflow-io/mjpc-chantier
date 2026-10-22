import { ouvrir, nav } from './entree2.mjs';
import fs from 'node:fs';
const W=+process.argv[2]||1366,H=+process.argv[3]||768;
const o = await ouvrir({largeur:W,hauteur:H,hub:JSON.parse(fs.readFileSync(`hub-apres-import-${W}.json`,'utf8'))}); const pg=o.pg;
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="structure"]'); if(b) b.click();}); await pg.waitForTimeout(1000);
await pg.locator('button:visible',{hasText:'Mes chapitres'}).first().click(); await pg.waitForTimeout(1500);
await pg.locator('[onclick="atEditerChapitre(\'3e\',\'1\')"]:visible').first().click(); await pg.waitForTimeout(2500);
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="atelier"]'); if(b) b.click();}); await pg.waitForTimeout(1500);
const n = await pg.evaluate(()=>document.querySelectorAll('.ed2-sce').length); let total = 0;
for (let k = 0; k < n; k++) {
  await pg.evaluate(k=>{ const el=document.querySelectorAll('.ed2-sce')[k]; el.click(); }, k); await pg.waitForTimeout(700);
  await pg.evaluate(k=>{ const sc=document.querySelectorAll('.ed2-sce')[k]; let x=sc.nextElementSibling; while (x && !x.classList.contains('ed2-sce')) { const it = x.classList.contains('ed2-it') ? x : x.querySelector && x.querySelector('.ed2-it'); if (it) { it.click(); return; } x = x.nextElementSibling; } }, k); await pg.waitForTimeout(1800);
  await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="atelier"]'); if(b) b.click();}); await pg.waitForTimeout(1200);
  const r = await pg.evaluate(()=>{ const t=(()=>{ try { return S.si + ' · ' + seance().titre; } catch(e){ return '?'; } })(); const x=Array.from(document.querySelectorAll('button,[onclick],span')).find(x=>x.offsetParent&&/^À régler \(\d+\)/.test((x.innerText||'').trim())); return { t, n: x ? +(x.innerText.match(/\((\d+)\)/)||[0,0])[1] : 0 }; });
  let lignes = [];
  if (r.n) { const b = pg.locator(':is(button,[onclick],span):visible', {hasText:/^À régler \(/}).first(); await b.click(); await pg.waitForTimeout(900);
    lignes = await pg.evaluate(()=>{ const z=Array.from(document.querySelectorAll('div')).filter(x=>x.offsetParent&&/^À RÉGLER/.test((x.innerText||'').trim())).sort((a,b)=>a.innerText.length-b.innerText.length)[0]; return z ? z.innerText.split('\n').filter(l=>/ — diapo \d+/.test(l)).map(l=>l.slice(0,170)) : []; });
    await pg.screenshot({path:`imp5-aregler-s${k+1}-${W}.png`}); await pg.keyboard.press('Escape'); await pg.waitForTimeout(300); }
  total += r.n; console.log(`S${k+1} ${r.t} : À régler (${r.n})`); lignes.forEach(l=>console.log('    · '+l));
}
console.log('TOTAL À RÉGLER', total, '| ERRS', JSON.stringify(o.errs), 'BOITES', JSON.stringify(o.boites)); await nav.close();

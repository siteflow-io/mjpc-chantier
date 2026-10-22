import { ouvrir, nav } from './entree2.mjs';
import fs from 'node:fs';
const W=+process.argv[2]||1366,H=+process.argv[3]||768;
const o = await ouvrir({largeur:W,hauteur:H,hub:JSON.parse(fs.readFileSync(`hub-apres-import-${W}.json`,'utf8'))}); const pg=o.pg;
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="structure"]'); if(b) b.click();}); await pg.waitForTimeout(1000);
await pg.locator('button:visible',{hasText:'Mes chapitres'}).first().click(); await pg.waitForTimeout(1500);
await pg.locator('[onclick="atEditerChapitre(\'3e\',\'1\')"]:visible').first().click(); await pg.waitForTimeout(2500);
for (const [nom, item] of [['Romantisme', null], ['Albatros', 'Fiche texte : « L\'Albatros »'], ['Récitation', null]]) {
  await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="atelier"]'); if(b) b.click();}); await pg.waitForTimeout(1200);
  await pg.evaluate(n=>{const el=Array.from(document.querySelectorAll('.ed2-sce')).filter(x=>x.offsetParent&&x.innerText.includes(n))[0]; if(el) el.click();}, nom); await pg.waitForTimeout(800);
  await pg.evaluate(n=>{ const sc=Array.from(document.querySelectorAll('.ed2-sce')).filter(x=>x.offsetParent&&x.innerText.includes(n))[0]; let x=sc&&sc.nextElementSibling; while (x && !x.classList.contains('ed2-sce')) { const it = x.classList.contains('ed2-it') ? x : x.querySelector && x.querySelector('.ed2-it'); if (it) { it.click(); return; } x = x.nextElementSibling; } }, nom); await pg.waitForTimeout(1800);
  await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="atelier"]'); if(b) b.click();}); await pg.waitForTimeout(1200);
  const si = await pg.evaluate(()=>S.si+' · '+seance().titre);
  await pg.locator('button:visible',{hasText:'Jouer en avance'}).first().click(); await pg.waitForTimeout(1800);
  const i = await pg.evaluate(()=>{ const E=seance().ecrans; const i=E.findIndex(e=>e.role==='bilan'); if (i>=0) aller(i); return i; }); await pg.waitForTimeout(1200);
  for (let n=0;n<14;n++){ if (await pg.$('.garde.on')) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(200); break; } const a=await pg.evaluate(()=>S.di); await pg.click('#bdev',{timeout:2000}).catch(()=>{}); await pg.waitForTimeout(250); if (await pg.evaluate(()=>S.di)!==a) { await pg.evaluate(i=>aller(i), i); await pg.waitForTimeout(500); break; } }
  const page = await pg.evaluate(()=>{ const t=((document.getElementById('mur')||{}).innerText||''); const m=t.match(/page (\d+) \/ (\d+)/); return m ? m[0] : 'une page'; });
  console.log(`BILAN[${process.env.K||5}] ${si} · diapo ${i+1} · ${page}`);
  await pg.screenshot({path:`bilan-${nom}-${W}.png`});
  await pg.locator('button:visible',{hasText:'Arrêter'}).first().click().catch(()=>{}); await pg.waitForTimeout(1200);
}
console.log('ERRS',o.errs,'BOITES',o.boites); await nav.close();

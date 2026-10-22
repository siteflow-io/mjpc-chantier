import { ouvrir, nav } from './entree2.mjs';
import fs from 'node:fs';
const W=+process.argv[2]||1366,H=+process.argv[3]||768;
const o = await ouvrir({largeur:W,hauteur:H,hub:JSON.parse(fs.readFileSync(`hub-apres-import-${W}.json`,'utf8'))}); const pg=o.pg;
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="structure"]'); if(b) b.click();}); await pg.waitForTimeout(1000);
await pg.locator('button:visible',{hasText:'Mes chapitres'}).first().click(); await pg.waitForTimeout(1500);
await pg.locator('[onclick="atEditerChapitre(\'3e\',\'1\')"]:visible').first().click(); await pg.waitForTimeout(2500);
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="atelier"]'); if(b) b.click();}); await pg.waitForTimeout(1500);
await pg.evaluate(()=>{const el=Array.from(document.querySelectorAll('.ed2-sce')).filter(x=>x.offsetParent&&x.innerText.includes('Albatros'))[0]; el.click();}); await pg.waitForTimeout(800);
await pg.locator('.ed2-it:visible', {hasText:'Fiche texte : « L\'Albatros »'}).first().click(); await pg.waitForTimeout(2000);
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="atelier"]'); if(b) b.click();}); await pg.waitForTimeout(1500);
const info = await pg.evaluate(()=>{ const E=seance().ecrans; const i=E.findIndex(e=>e.role==='bilan'); const e=E[i]||{}; let notes=null; try { notes = (dr_notes()||{})[S.si+'|'+e.eid] || null; } catch(x){} return { i, act:e.act, blocs:(e.blocs||[]).map(b=>b.t), notes: notes && JSON.stringify(notes).slice(0,500) }; });
console.log('BILAN', JSON.stringify(info));
await pg.locator('button:visible',{hasText:'Jouer en avance'}).first().click(); await pg.waitForTimeout(2000);
await pg.evaluate(i=>{ if (typeof aller==='function') aller(i); }, info.i); await pg.waitForTimeout(1200);
for (let n=0;n<12;n++){ const g=await pg.$('.garde.on'); if (g) { await pg.keyboard.press('Escape'); await pg.waitForTimeout(200); break; } const avant=await pg.evaluate(()=>S.di); await pg.click('#bdev',{timeout:2000}).catch(()=>{}); await pg.waitForTimeout(250); const apres=await pg.evaluate(()=>S.di); if (apres!==avant) { await pg.evaluate(i=>aller(i), info.i); await pg.waitForTimeout(500); break; } }
console.log('AU TABLEAU', JSON.stringify(await pg.evaluate(()=>({ di:S.di, act:ecran().act, mur:((document.getElementById('mur')||{}).innerText||'').replace(/\n+/g,' / ').slice(0,700) }))));
await pg.screenshot({path:`bilan-s2-p2-${W}.png`});
const fl = await pg.evaluate(()=>{ const w=document.createTreeWalker(document.getElementById('mur')||document.body, NodeFilter.SHOW_TEXT); let n; while(n=w.nextNode()){ if(/‹/.test(n.data)&&n.parentElement.offsetParent){ const r=document.createRange(); const k=n.data.indexOf('‹'); r.setStart(n,k); r.setEnd(n,k+1); const b=r.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,tag:n.parentElement.tagName}; } } return null; }); console.log('FLECHE', JSON.stringify(fl)); if (fl) { await pg.mouse.click(fl.x, fl.y); await pg.waitForTimeout(700); }
console.log('PAGE 1', JSON.stringify(await pg.evaluate(()=>((document.getElementById('mur')||{}).innerText||'').replace(/\n+/g,' / ').slice(0,700))));
await pg.screenshot({path:`bilan-s2-p1-${W}.png`});
console.log('ERRS',o.errs,'BOITES',o.boites); await nav.close();

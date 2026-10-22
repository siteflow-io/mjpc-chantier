import { ouvrir, nav } from './entree2.mjs';
import fs from 'node:fs';
const W=+process.argv[2]||1366,H=+process.argv[3]||768;
const o = await ouvrir({largeur:W,hauteur:H,hub:JSON.parse(fs.readFileSync(`hub-apres-import-${W}.json`,'utf8'))}); const pg=o.pg;
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="structure"]'); if(b) b.click();}); await pg.waitForTimeout(1000);
await pg.locator('button:visible',{hasText:'Mes chapitres'}).first().click(); await pg.waitForTimeout(1500);
await pg.locator('[onclick="atEditerChapitre(\'3e\',\'1\')"]:visible').first().click(); await pg.waitForTimeout(2500);
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="atelier"]'); if(b) b.click();}); await pg.waitForTimeout(1500);
const aReg = () => pg.evaluate(()=>{ const x=Array.from(document.querySelectorAll('button,[onclick],span')).find(x=>x.offsetParent&&/^À régler \(\d+\)/.test((x.innerText||'').trim())); return x? x.innerText.trim().slice(0,16):'(pas de compteur)'; });
console.log('séance 1 :', await aReg());
await pg.evaluate(()=>{const el=Array.from(document.querySelectorAll('.ed2-sce')).filter(x=>x.offsetParent&&x.innerText.includes('Albatros'))[0]; el.click();}); await pg.waitForTimeout(800);
await pg.locator('.ed2-it:visible', {hasText:'Fiche texte : « L\'Albatros »'}).first().click(); await pg.waitForTimeout(2000);
await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="atelier"]'); if(b) b.click();}); await pg.waitForTimeout(1500);
console.log('séance ouverte:', await pg.evaluate(()=>{ try { return S.si + ' · ' + seance().titre; } catch(e){ return String(e);} }), '|', await aReg());
const b = pg.locator(':is(button,[onclick],span):visible', {hasText:/^À régler \(/}).first(); if (await b.count()) { await b.click(); await pg.waitForTimeout(1000); }
console.log('LISTE S2:', await pg.evaluate(()=>{ const z=Array.from(document.querySelectorAll('div')).filter(x=>x.offsetParent&&/^À RÉGLER/.test((x.innerText||'').trim())).sort((a,b)=>a.innerText.length-b.innerText.length)[0]; return z? z.innerText.replace(/\n+/g,' / ').slice(0,4000):'(rien)'; }));
await pg.screenshot({path:`imp4-aregler-s2-${W}.png`});
await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
const rep = pg.locator('button:visible',{hasText:'Jouer en avance'}).first(); if (await rep.count()) { await rep.click(); await pg.waitForTimeout(2000); } else console.log('pas de « Jouer en avance »');
const tetes = []; for (let n=0; n<60; n++) { const t = await pg.evaluate(()=>((document.getElementById('numero')||{}).innerText||'').replace(/\n/g,' ').slice(0,140)); if (!tetes.includes(t)) tetes.push(t); const g = await pg.$('.garde.on'); if (g) { await pg.keyboard.press('Escape'); } await pg.click('#bdev', {timeout:2000}).catch(()=>{}); await pg.waitForTimeout(150); if (n===12) await pg.screenshot({path:`imp4-repetition-${W}.png`}); }
console.log('TÊTES:', tetes.length); tetes.forEach(t=>console.log('  ', t));
console.log('ERRS',o.errs,'BOITES',o.boites); await nav.close();

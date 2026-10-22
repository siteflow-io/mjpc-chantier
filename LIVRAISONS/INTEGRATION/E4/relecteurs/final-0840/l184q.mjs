import { ouvrir, nav } from './entree2.mjs';
const o = await ouvrir({largeur:1366,hauteur:768,frais:true}); const pg=o.pg;
await pg.locator('button:visible', {hasText:'Lancer avec'}).first().click(); await pg.waitForTimeout(2000);
for (let i=0;i<3;i++){ await pg.click('#bdev').catch(()=>{}); await pg.waitForTimeout(300); }
await pg.clock.setFixedTime(new Date('2026-09-14T09:02:00+02:00')); await pg.waitForTimeout(800);
const vis = async lab => console.log(lab, JSON.stringify(await pg.evaluate(()=>Array.from(document.querySelectorAll('button,[onclick]')).filter(x=>x.offsetParent&&/Lancer|lancer/.test((x.innerText||'')+(x.getAttribute('onclick')||''))).map(x=>'#'+x.id+' '+(x.innerText||'').replace(/\n/g,' ').slice(0,90)))));
await vis('classe:');
for (const v of ['pilotage','atelier']) { await pg.evaluate(v=>{const b=document.querySelector(`.at-onglet[data-vue="${v}"]`); if(b) b.click(); else if (typeof voir==='function') voir(v);}, v); await pg.waitForTimeout(1200); await vis(v+':'); }
await pg.evaluate(()=>edtOuvrir()); await pg.waitForTimeout(1500);
const cases = await pg.evaluate(()=>Array.from(document.querySelectorAll('[onclick*="edtCaseClic"]')).filter(x=>x.offsetParent).map(x=>x.getAttribute('onclick').slice(12,40)+' :: '+x.innerText.replace(/\n/g,' / ').slice(0,60)));
console.log('cases lundi:', JSON.stringify(cases.filter(c=>c.includes('2026-09-14'))));
const k = cases.find(c=>c.includes('2026-09-14|10:07')); if (k) { await pg.evaluate(c=>{const el=Array.from(document.querySelectorAll('[onclick*="edtCaseClic"]')).find(x=>x.getAttribute('onclick').includes(c)); el.click();}, '2026-09-14|10:07'); await pg.waitForTimeout(1000); await vis('modale 10:07:'); }
await nav.close();

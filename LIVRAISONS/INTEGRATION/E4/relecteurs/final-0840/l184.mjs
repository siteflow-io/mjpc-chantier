import { ouvrir, nav, garderHub } from './entree2.mjs';
const W=+process.argv[2],H=+process.argv[3];
const cadre = pg => pg.evaluate(()=>{ const t=((document.querySelector('#rel')||{}).innerText||'').replace(/ /g,' '); return (t.match(/Cette heure a commencé[^.]*\./)||['(pas de cadre)'])[0]; });
const etat = pg => pg.evaluate(()=>({lancee:S.lancee, close:S.close, heure:S.heure, finReel:S.finReel?hhmm(S.finReel):null, closes:JSON.stringify(S.closes||{}), hou:(document.getElementById('hou')||{}).textContent}));
const rel = async pg => { await pg.evaluate(()=>{const b=document.querySelector('.at-onglet[data-vue="relecture"]'); if(b) b.click(); else if (typeof voir==='function') voir('relecture');}); await pg.waitForTimeout(1500); };
const o = await ouvrir({largeur:W,hauteur:H,frais:true}); const pg=o.pg;
await pg.locator('button:visible', {hasText:'Lancer avec'}).first().click(); await pg.waitForTimeout(2000);
for (let i=0;i<3;i++){ await pg.click('#bdev').catch(()=>{}); await pg.waitForTimeout(300); }
await pg.clock.setFixedTime(new Date('2026-09-14T09:02:00+02:00')); await pg.waitForTimeout(1500);
garderHub(await pg.evaluate(()=>window.__HUB));
await pg.clock.setFixedTime(new Date('2026-09-14T09:58:00+02:00')); await pg.waitForTimeout(2500);
await rel(pg); console.log('MEME PAGE 09:58', JSON.stringify(await etat(pg)), '|', await cadre(pg)); await pg.screenshot({path:`l184-meme-${W}.png`});
await o.ctx.close();
const o2 = await ouvrir({largeur:W,hauteur:H,date:'2026-09-14T09:58:00+02:00'}); const pg2=o2.pg; await pg2.waitForTimeout(1500);
const fr = await pg2.evaluate(()=>{ const out=[]; const w=(o,p)=>{ if(!o||typeof o!=='object') return; for(const k in o){ if(k==='finReel'||k==='clos'||k==='closPar') out.push(p+'/'+k+'='+JSON.stringify(o[k])); else w(o[k],p+'/'+k);} }; w(window.__HUB.B||window.__HUB,''); return out.slice(0,8); });
console.log('HUB après réouverture:', JSON.stringify(fr));
console.log('REOUVERT', JSON.stringify(await etat(pg2)));
await rel(pg2); console.log('REOUVERT Relecture', JSON.stringify(await etat(pg2)), '|', await cadre(pg2)); await pg2.screenshot({path:`l184-reouvert-${W}.png`});
console.log('ERRS',o.errs.concat(o2.errs),'BOITES',o.boites.concat(o2.boites)); await nav.close();

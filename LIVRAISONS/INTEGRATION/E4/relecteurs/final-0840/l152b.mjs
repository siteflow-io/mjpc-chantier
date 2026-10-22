import { ouvrir, nav, garderHub } from './entree2.mjs';
const W=+process.argv[2]||1366,H=+process.argv[3]||768;
const o = await ouvrir({largeur:W,hauteur:H,frais:true}); const pg=o.pg; const P=s=>`la-${s}-${W}.png`;
const T = hm => pg.clock.setFixedTime(new Date(`2026-09-14T${hm}+02:00`));
const lancer=()=>pg.evaluate(()=>{const b=Array.from(document.querySelectorAll('button')).find(x=>x.offsetParent&&/Lancer/.test(x.innerText)); return b&&(b.innerText.replace(/\n/g,' ')+' | title: '+(b.title||''));});
const atelier = async (lab) => {
  await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="atelier"]').click()}); await pg.waitForTimeout(1500);
  const t=await pg.evaluate(()=>document.body.innerText);
  console.log('---',lab,'lancer:',await lancer());
  console.log(' entête:', (t.match(/[^\n]*Diapo \d+ sur[^\n]*/g)||[]).slice(0,2));
  console.log(' H:', (t.match(/^\s*H\d+ · [^\n]*/gm)||[]));
  console.log(' fn:', JSON.stringify(await pg.evaluate(()=>{try{return dr_heuresDeLaClasse().map(x=>x.n+'/'+x.sur+' '+x.iso+' '+x.creneau+(x.jouee?' J':'')+(x.clos?' C':''))}catch(e){return String(e)}})));
  await pg.screenshot({path:P(lab)});
  await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="pilotage"]').click()}); await pg.waitForTimeout(1200);
};
console.log('avant:', await lancer());
await pg.locator('button:visible', {hasText:'Lancer avec'}).first().click(); await pg.waitForTimeout(2000);
console.log('hou après lancer:', await pg.evaluate(()=>document.getElementById('hou').innerText));
await T('09:05:00'); await pg.waitForTimeout(800);
await atelier('pendant');
await T('09:47:30'); await pg.waitForTimeout(2500);
for (let n=1;n<=7;n++){ const t = await pg.evaluate(()=>(document.querySelector('.pp-tete')||{}).innerText||''); if (/étape 7 sur 7/.test(t)) break; const b = await pg.$('#f-suivante:not([disabled])'); if (!b) break; await b.click(); await pg.waitForTimeout(700); }
await pg.locator('#f-clore:visible').first().click().catch(e=>console.log('clore',e.message)); await pg.waitForTimeout(1200);
if (await pg.$('#gclore-oui:visible')) { await pg.click('#gclore-oui'); await pg.waitForTimeout(1500); }
await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="relecture"]').click()}); await pg.waitForTimeout(1500);
const t=await pg.evaluate(()=>((document.querySelector('#rel')||{}).innerText||'').replace(/ /g,' '));
console.log('clos à', await pg.evaluate(()=>S.finReel?hhmm(S.finReel):null), '| cadre:', (t.match(/Cette heure a commencé[^.]*\./)||[''])[0], '| hou:', await pg.evaluate(()=>document.getElementById('hou').innerText));
await pg.screenshot({path:`l152-relecture-${W}.png`});
garderHub(await pg.evaluate(()=>window.__HUB)); await o.ctx.close();
const o2 = await ouvrir({largeur:W,hauteur:H,date:'2026-09-14T10:30:00+02:00'}); const pg2=o2.pg; await pg2.waitForTimeout(1500);
await pg2.evaluate(()=>{document.querySelector('.at-onglet[data-vue="relecture"]').click()}); await pg2.waitForTimeout(1800);
const t2=await pg2.evaluate(()=>((document.querySelector('#rel')||{}).innerText||'').replace(/ /g,' '));
console.log('REOUVERT 10:30 | cadre:', (t2.match(/Cette heure a commencé[^.]*\./)||[''])[0]); await pg2.screenshot({path:`l152b-reouvert-${W}.png`});
console.log('ERRS2',o2.errs,'BOITES2',o2.boites); await nav.close();

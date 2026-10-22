import { ouvrir, nav } from './entree2.mjs';
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
console.log('hou après clore:', await pg.evaluate(()=>document.getElementById('hou').innerText));
await atelier('apres-clore');
await T('09:58:00'); await pg.waitForTimeout(2500);
await atelier('0958');
await T('10:30:00'); await pg.waitForTimeout(2500);
await atelier('1030');
console.log('donnees:', JSON.stringify(await pg.evaluate(()=>{const ec=AT.edChap; const sce=chapitresData[ec.level][ec.chnum].seances[ATVUES.snum]; const s=window.__HUB.site['3e'].chapitres; const c=Array.isArray(s)?s[0]:s['0']; const se=Array.isArray(c.seances)?c.seances[0]:c.seances['0']; const f=d=>Object.fromEntries(Object.entries(d||{}).map(([k,v])=>[k,Object.keys(v.heures||{})])); return {local:f(sce.deroule_joue), hub:f(se.deroule_joue)};})));
await pg.evaluate(()=>edtOuvrir()); await pg.waitForTimeout(2000);
console.log('EDT:', JSON.stringify(await pg.evaluate(()=>Array.from(document.querySelectorAll('[onclick*="edtCaseClic"]')).filter(x=>x.offsetParent && /Charles/i.test(x.innerText)).map(x=>x.getAttribute('onclick').slice(12,40)+' :: '+x.innerText.replace(/\n/g,' / ').slice(0,110))),null,1));
await pg.screenshot({path:P('edt')});
console.log('ERRS',o.errs,'BOITES',o.boites); await nav.close();

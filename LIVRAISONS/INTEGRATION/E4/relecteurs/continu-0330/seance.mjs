import { ouvrir, nav } from './entree2.mjs';
import fs from 'node:fs';
const W=+process.argv[2]||1366,H=+process.argv[3]||768, cas=process.argv[4]||'lun0900', cible=process.argv[5];
const D={lun0900:'2026-09-14T09:00:00+02:00', mer0830:'2026-09-16T08:30:00+02:00', mar1510:'2026-09-15T15:10:00+02:00'};
const opt={largeur:W,hauteur:H,date:D[cas]};
if (cas.startsWith('lun')) opt.frais=true; else opt.hub=JSON.parse(fs.readFileSync(`hub-apres-clore-${W}.json`,'utf8'));
const o=await ouvrir(opt); const pg=o.pg;
const lancer=()=>pg.evaluate(()=>{const b=Array.from(document.querySelectorAll('button')).find(x=>x.offsetParent&&/Lancer/.test(x.innerText)); return b&&(b.innerText.replace(/\n/g,' ')+' | title: '+(b.title||''));});
await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="atelier"]').click()}); await pg.waitForTimeout(1500);
const dump = async lab => { const t=await pg.evaluate(()=>document.body.innerText);
  console.log('---',lab,'lancer:',await lancer());
  console.log(' séance:', await pg.evaluate(()=>{try{const ec=AT.edChap; const s=chapitresData[ec.level][ec.chnum].seances[ATVUES.snum]; return ec.chnum+'/'+ATVUES.snum+' '+(s.title||s.titre)}catch(e){return String(e)}}));
  console.log(' entête:', (t.match(/[^\n]*Diapo \d+ sur[^\n]*/g)||[]).slice(0,2));
  console.log(' H:', (t.match(/^\s*H\d+ · [^\n]*/gm)||[]));
  console.log(' fn:', JSON.stringify(await pg.evaluate(()=>{try{return dr_heuresDeLaClasse().map(x=>x.n+'/'+x.sur+' '+x.iso+' '+x.creneau+(x.jouee?' J':''))}catch(e){return String(e)}})));
  await pg.screenshot({path:`se-${cas}-${lab}-${W}.png`}); };
await dump('depart');
if (!cible) { console.log(JSON.stringify(await pg.evaluate(()=>Array.from(document.querySelectorAll('button,[onclick],[role=tab]')).filter(x=>x.offsetParent).map(x=>x.tagName+'.'+x.className+' ['+(x.getAttribute('onclick')||'').slice(0,60)+'] '+(x.innerText||'').replace(/\n/g,' ').slice(0,60))),null,1)); }
else if (cible==='som') {
  await pg.evaluate(()=>{const el=Array.from(document.querySelectorAll('.ed2-sce')).filter(x=>x.offsetParent&&x.innerText.includes('Albatros'))[0]; el.click();}); await pg.waitForTimeout(800);
  const it = pg.locator('.ed2-it:visible', {hasText:'Fiche texte : « L\'Albatros »'}).first(); console.log('item', await it.count()); await it.click(); await pg.waitForTimeout(2000);
  await dump('albatros-som'); console.log('btn disabled?', await pg.evaluate(()=>{const b=Array.from(document.querySelectorAll('button')).find(x=>x.offsetParent&&/Lancer/.test(x.innerText)); return b&&[b.disabled,b.getAttribute('onclick'),b.className]}));
  await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="pilotage"]').click()}); await pg.waitForTimeout(1500); console.log('PILOTAGE après bascule:', await lancer(), '| hou:', await pg.evaluate(()=>document.getElementById('hou').innerText)); await pg.screenshot({path:`se-${cas}-pilotage-albatros-${W}.png`});
  await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="atelier"]').click()}); await pg.waitForTimeout(1500); await dump('albatros-retour');
}
else if (cible==='structure') { await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="structure"]').click()}); await pg.waitForTimeout(1200);
  const ok = await pg.evaluate(()=>{const el=Array.from(document.querySelectorAll('.ed2-sce')).filter(x=>x.offsetParent&&x.innerText.includes('Albatros'))[0]; if(!el) return false; el.click(); return true;}); console.log('clic albatros', ok); await pg.waitForTimeout(1500);
  await pg.screenshot({path:`se-${cas}-structure-${W}.png`});
  await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="atelier"]').click()}); await pg.waitForTimeout(1800); await dump('albatros');
  await pg.evaluate(()=>{document.querySelector('.at-onglet[data-vue="pilotage"]').click()}); await pg.waitForTimeout(1500); console.log('PILOTAGE après bascule:', await lancer(), '| hou:', await pg.evaluate(()=>document.getElementById('hou').innerText)); await pg.screenshot({path:`se-${cas}-pilotage-albatros-${W}.png`});
  await pg.evaluate(()=>edtOuvrir()); await pg.waitForTimeout(2000);
  console.log('EDT:', JSON.stringify(await pg.evaluate(()=>Array.from(document.querySelectorAll('[onclick*="edtCaseClic"]')).filter(x=>x.offsetParent && /Charles/i.test(x.innerText)).map(x=>x.getAttribute('onclick').slice(12,40)+' :: '+x.innerText.replace(/\n/g,' / ').slice(0,110)))));
}
else { const ok = await pg.evaluate(c=>{const el=Array.from(document.querySelectorAll('button,[onclick],[role=tab]')).filter(x=>x.offsetParent&&(x.innerText||'').includes(c))[0]; if(!el) return false; el.click(); return el.outerHTML.slice(0,200);}, cible); console.log('clic', ok); await pg.waitForTimeout(2000); await dump('apres'); }
console.log('ERRS',o.errs,'BOITES',o.boites); await nav.close();

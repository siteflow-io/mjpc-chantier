import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');
const R='/home/claude';
const store={}; const poser=(c,v)=>{const p=c.split('/').filter(Boolean);let n=store;for(let k=0;k<p.length-1;k++){if(typeof n[p[k]]!=='object')n[p[k]]={};n=n[p[k]];}n[p[p.length-1]]=v;};
poser('classes',JSON.parse(fs.readFileSync(R+'/tests/hub/classes.json','utf8')));
poser('site/3e',JSON.parse(fs.readFileSync(R+'/tests/hub/site_3e.json','utf8')));
poser('site/config',JSON.parse(fs.readFileSync(R+'/tests/hub/site_config.json','utf8')));
poser('site/edt/calendrier/2026-2027',JSON.parse(fs.readFileSync(R+'/calendrier-2026-2027.json','utf8')));
poser('site/edt/grille/2026-2027',JSON.parse(fs.readFileSync(R+'/tests/grille-appariee.json','utf8')));
poser('site/edt/creneaux/2026-2027',JSON.parse(fs.readFileSync(R+'/creneaux-2026-2027.json','utf8')));
const b=await puppeteer.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome',args:['--no-sandbox']});
const p=await b.newPage(); await p.setViewport({width:1366,height:768});
await p.evaluateOnNewDocument((s)=>{window.__HUB=JSON.parse(JSON.stringify(s));
 const lire=(c)=>{const q=c.split('/').filter(Boolean);let n=window.__HUB;for(const k of q){if(n===null||typeof n!=='object'||!(k in n))return null;n=n[k];}return n===undefined?null:n;};
 const pos=(c,v)=>{const q=c.split('/').filter(Boolean);let n=window.__HUB;for(let k=0;k<q.length-1;k++){if(typeof n[q[k]]!=='object'||n[q[k]]===null)n[q[k]]={};n=n[q[k]];}if(v===null)delete n[q[q.length-1]];else n[q[q.length-1]]=v;};
 window.fetch=function(u,o){const s2=String(u);
  if(s2.indexOf('firebasedatabase.app')>=0){const c=s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/,'');
   const m=((o&&o.method)||'GET').toUpperCase();
   if(m==='GET')return Promise.resolve(new Response(JSON.stringify(lire(c)),{status:200}));
   let bd=null;try{bd=JSON.parse((o&&o.body)||'null');}catch(e){} pos(c,bd);
   return Promise.resolve(new Response(JSON.stringify(bd),{status:200}));}
  return Promise.resolve(new Response('null',{status:200}));};},store);
await p.goto('file://'+R+'/candidat-8.71.0.html',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1500));
await p.evaluate(()=>{document.body.classList.add('admin-mode');edtOuvrir();});
await new Promise(r=>setTimeout(r,2200));
await p.evaluate(()=>{document.querySelectorAll('button').forEach(x=>{if(!x.closest('#edt-ecran')&&/^\s*(Compris|Annuler)\s*$/.test(x.textContent))x.click();});
  const o=document.getElementById('fi-overlay'); if(o)o.remove();});
/* deux classes appariées, pour que l'année ait de la matière */
await p.evaluate(()=>{EDT.grille.creneaux.forEach(c=>{if(c.classe==='3 DYLAN Bob')c.classeMjpc='CLASSE TEST';});});
await p.evaluate(()=>{EDT_VUE.mode='annee';edtPeindre();});
await new Promise(r=>setTimeout(r,900));
const m=await p.evaluate(()=>{window.scrollTo(0,4000);
 return {scrollY:window.scrollY, ecran:document.getElementById('edt-ecran').scrollHeight, fenetre:window.innerHeight,
  mois:Array.from(document.querySelectorAll('.edt-an-mois')).map(x=>x.textContent),
  pistes:document.querySelectorAll('.edt-an-piste').length,
  etiquettes:Array.from(document.querySelectorAll('.edt-an-etiq')).map(x=>x.innerText.replace(/\n/g,' | ')),
  barresReel:document.querySelectorAll('.edt-an-reel').length,
  barresPrevu:document.querySelectorAll('.edt-an-prevu').length,
  vacances:document.querySelectorAll('.edt-an-vac').length,
  jalons:document.querySelectorAll('.edt-an-jalon').length,
  legende:(document.querySelector('.edt-an-legende')||{}).innerText||''};});
console.log(JSON.stringify(m,null,1));
await p.screenshot({path:R+'/tests/5-2-annee.png'});
/* et l'année vide */
await p.evaluate(()=>{EDT.grille.creneaux.forEach(c=>{c.classeMjpc='';});edtPeindre();});
await new Promise(r=>setTimeout(r,600));
const v=await p.evaluate(()=>(document.querySelector('.edt-an-vide')||{}).innerText||'(rien)');
console.log('année vide →', JSON.stringify(v));
await p.screenshot({path:R+'/tests/5-2b-annee-vide.png'});
await b.close();

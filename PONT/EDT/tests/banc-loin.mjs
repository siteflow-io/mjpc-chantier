/* BANC — ⑦ l'heure ajoutée sur un trou · ⑧ le déplacement lointain. */
import fs from 'fs'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');
const R='/home/claude'; const J=(f)=>JSON.parse(fs.readFileSync(R+'/'+f,'utf8'));
const store={}; const poser=(c,v)=>{const p=c.split('/').filter(Boolean);let n=store;for(let k=0;k<p.length-1;k++){if(typeof n[p[k]]!=='object')n[p[k]]={};n=n[p[k]];}n[p[p.length-1]]=v;};
poser('classes',J('tests/hub/classes.json')); poser('site/3e',J('tests/hub/site_3e.json'));
poser('site/config',J('tests/hub/site_config.json'));
poser('site/edt/calendrier/2026-2027',J('calendrier-2026-2027.json'));
poser('site/edt/creneaux/2026-2027',J('creneaux-2026-2027.json'));
poser('site/edt/grille/2026-2027',J('tests/grille-appariee.json'));
const jrn=[];
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
await p.goto('file://'+R+'/candidat-8.72.0.html',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,1400));
await p.evaluate(()=>{document.body.classList.add('admin-mode');edtOuvrir();});
await new Promise(r=>setTimeout(r,2000));
await p.evaluate(()=>{document.querySelectorAll('button').forEach(x=>{
  if(!x.closest('#edt-ecran')&&!x.closest('#edt-modale')&&/^\s*(Compris|Annuler)\s*$/.test(x.textContent))x.click();});
  const o=document.getElementById('fi-overlay'); if(o)o.remove();
  EDT_VUE.ancre='2026-09-07'; edtPeindre();});
await new Promise(r=>setTimeout(r,700));

const SRC='2026-09-08|15:07-16:02|3 FRANKLIN Aretha';
await p.evaluate((s)=>edtCaseClic(s),SRC);
await new Promise(r=>setTimeout(r,700));
jrn.push('la liste des destinations : '+JSON.stringify(await p.evaluate(()=>{
  const sel=document.getElementById('edt-ou');
  const opts=Array.from(sel.querySelectorAll('option')).filter(o=>o.value);
  const mai=opts.filter(o=>o.textContent.indexOf('/5 ')>=0||/\b\d+\/5\b/.test(o.textContent));
  return {total:opts.length, semaines:sel.querySelectorAll('optgroup').length,
          premiere:opts[0].textContent.trim(), derniere:opts[opts.length-1].textContent.trim(),
          creneauxLibres:opts.filter(o=>o.value.endsWith('|+')).length,
          exemplesEnMai:mai.slice(0,2).map(o=>o.textContent.trim())};},null)));
await p.screenshot({path:R+'/tests/9-1-liste-jusqua-juillet.png'});

/* ⑧ un créneau de MAI, depuis une case de septembre */
const loin=await p.evaluate(()=>{
  const sel=document.getElementById('edt-ou');
  const o=Array.from(sel.querySelectorAll('option')).filter(x=>x.value.indexOf('2027-05-')===0&&!x.value.endsWith('|+'))[0];
  return o?o.value:null;});
jrn.push('⑧ créneau de mai retenu : '+loin);
await p.evaluate((v,s)=>edtChoisirOu(s,v),loin,SRC);
await new Promise(r=>setTimeout(r,1200));
jrn.push('   au hub après le déplacement lointain : '+JSON.stringify(await p.evaluate(()=>{
  const h=window.__HUB.site.edt.decisions['2026-2027']['3E Charles de Gaulle'].heures;
  return Object.keys(h).map(k=>k+' → '+JSON.stringify(h[k]).slice(0,90));})));

/* ⑦ une HEURE AJOUTÉE sur un trou */
await p.evaluate((s)=>{edtModaleFermer();edtCaseClic(s);},SRC);
await new Promise(r=>setTimeout(r,700));
const trou=await p.evaluate(()=>{
  const sel=document.getElementById('edt-ou');
  const o=Array.from(sel.querySelectorAll('option')).filter(x=>x.value.endsWith('|+')&&x.value.indexOf('2026-09-1')===0)[0];
  return o?{v:o.value,lib:o.textContent.trim()}:null;});
jrn.push('⑦ créneau libre proposé : '+JSON.stringify(trou));
await p.evaluate((v,s)=>edtChoisirOu(s,v),trou.v,SRC);
await new Promise(r=>setTimeout(r,1200));
const iso=trou.v.split('|')[0], k=trou.v.split('|')[1];
jrn.push('   décision écrite : '+JSON.stringify(await p.evaluate((i,c)=>{
  const h=window.__HUB.site.edt.decisions['2026-2027']['3E Charles de Gaulle'].heures;
  const cle=i+'_'+c.replace(/:/g,'h')+'_3E_Charles_de_Gaulle';
  return h[cle]||'introuvable';},iso,k)));
await p.evaluate((i)=>{edtModaleFermer();EDT_VUE.ancre=i;edtPeindre();},iso);
await new Promise(r=>setTimeout(r,900));
jrn.push('   la case apparaît dans la semaine : '+JSON.stringify(await p.evaluate((i,c)=>{
  const x=EDT_VUE.cellules[i+'|'+c+'|3E Charles de Gaulle'];
  return x?{nature:x.nature,ajoutee:!!x.ajoutee,titre:(x.titre||'').slice(0,30),heure:x.heure+'/'+x.sur}:'absente';},iso,k)));
jrn.push('   elle compte dans la prévision : '+JSON.stringify(await p.evaluate((i)=>{
  const c=edtProjeter(i,5);
  return Object.keys(c).filter(z=>z.indexOf('3 FRANKLIN')>=0||z.indexOf('3E Charles')>=0)
    .sort().map(z=>{const x=c[z];return x.iso+' '+x.creneau+' → '+x.nature+(x.ajoutee?' [AJOUTÉE]':'')+(x.titre?(' heure '+x.heure+'/'+x.sur):'');});},iso)));
await p.evaluate(()=>{document.querySelectorAll('button').forEach(x=>{
  if(!x.closest('#edt-ecran')&&!x.closest('#edt-modale')&&/^\s*(Compris|Annuler)\s*$/.test(x.textContent))x.click();});});
await p.screenshot({path:R+'/tests/9-2-heure-ajoutee.png'});
fs.writeFileSync(R+'/tests/9-journal.txt',jrn.join('\n\n'),'utf8');
console.log(jrn.join('\n\n'));
await b.close();

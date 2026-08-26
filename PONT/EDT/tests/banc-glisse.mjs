/* BANC — LE GLISSER-DÉPOSER ET LA QUESTION DU DÉPÔT.
   ④ « déplacer cette heure » par glissé == par la liste, champ à champ.
   ⑤ « changement d'emploi du temps » : une version, ZÉRO décision, zéro trace.
   ⑥ quatre refus nommés.  ⑨ tout reste faisable sans glissé. */
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
const ouvrir=async()=>{
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
 return p;};

const SRC='2026-09-08|15:07-16:02|3 FRANKLIN Aretha';   /* mardi 8/9, séance prévue */
const glisser=async(p,src,isoDst,creneauDst)=>p.evaluate((s,i,k)=>{
  const c=edtCellule(s);
  const dep=document.querySelector('[data-iso="'+c.iso+'"][data-creneau="'+c.creneau+'"] .edt-clic');
  const arr=document.querySelector('[data-iso="'+i+'"]'+(k?'[data-creneau="'+k+'"]':''));
  const a=dep.getBoundingClientRect(), z=arr.getBoundingClientRect();
  dep.dispatchEvent(new PointerEvent('pointerdown',{clientX:a.x+10,clientY:a.y+10,bubbles:true}));
  window.dispatchEvent(new PointerEvent('pointermove',{clientX:a.x+40,clientY:a.y+40,bubbles:true}));
  const marques={source:document.querySelectorAll('.edt-source').length,
                 possibles:document.querySelectorAll('.edt-cible-ok').length,
                 impossibles:document.querySelectorAll('.edt-cible-non').length};
  window.dispatchEvent(new PointerEvent('pointermove',{clientX:z.x+z.width/2,clientY:z.y+z.height/2,bubbles:true}));
  window.dispatchEvent(new PointerEvent('pointerup',{clientX:z.x+z.width/2,clientY:z.y+z.height/2,bubbles:true}));
  return marques;}, src, isoDst, creneauDst||'');

/* ── ④ glissé → « déplacer cette heure » ─────────────────────────────── */
let p=await ouvrir();
const marques=await glisser(p,SRC,'2026-09-09','10:07-11:02');
await new Promise(r=>setTimeout(r,500));
jrn.push('pendant le glissé : '+JSON.stringify(marques));
jrn.push('question posée : '+JSON.stringify(await p.evaluate(()=>{const q=document.getElementById('edt-question');
  return q?{ouverte:true,boutons:Array.from(q.querySelectorAll('button')).map(x=>x.textContent.trim())}:{ouverte:false};})));
await p.screenshot({path:R+'/tests/8-1-question-du-depot.png'});
await p.evaluate(()=>edtValiderDepot('heure',EDT_MOD.cle||'2026-09-08|15:07-16:02|3 FRANKLIN Aretha','2026-09-09'));
await new Promise(r=>setTimeout(r,1200));
const parGlisse=await p.evaluate(()=>({
  decisions:window.__HUB.site.edt.decisions['2026-2027']['3E Charles de Gaulle'].heures,
  versions:(window.__HUB.site.edt.grille['2026-2027'].versions||[]).length}));
jrn.push('④ après glissé « déplacer cette heure » :\n  décisions : '+JSON.stringify(parGlisse.decisions)
  +'\n  versions de grille écrites : '+parGlisse.versions);
await p.close();

/* le même geste par la LISTE, sur une page neuve */
p=await ouvrir();
await p.evaluate((s)=>{edtCaseClic(s);},SRC);
await new Promise(r=>setTimeout(r,400));
await p.evaluate(()=>{const sel=document.getElementById('edt-ou');
  /* la MÊME destination que par le glissé : mer 9/9 10:07, et non un créneau libre */
  for(let i=0;i<sel.options.length;i++){
    if(sel.options[i].value==='2026-09-09|10:07-11:02'){ sel.selectedIndex=i; break; } }
  sel.dispatchEvent(new Event('change'));});
await new Promise(r=>setTimeout(r,1200));
const parListe=await p.evaluate(()=>window.__HUB.site.edt.decisions['2026-2027']['3E Charles de Gaulle'].heures);
const memes=JSON.stringify(Object.keys(parGlisse.decisions).sort())===JSON.stringify(Object.keys(parListe).sort());
jrn.push('   le même geste par la liste :\n  '+JSON.stringify(parListe)
  +'\n  → mêmes clés écrites que par le glissé : '+memes);
await p.close();

/* ── ⑤ glissé → « changement d'emploi du temps » ─────────────────────── */
p=await ouvrir();
await glisser(p,SRC,'2026-09-09','10:07-11:02');
await new Promise(r=>setTimeout(r,500));
const diag=await p.evaluate(()=>{
  const q=document.getElementById('edt-question');
  if(!q)return {question:'ABSENTE'};
  document.getElementById('edt-q-effet').value='2026-09-14';
  const av=JSON.stringify(Object.keys(window.__HUB.site.edt.grille['2026-2027']));
  try{ edtValiderDepot('edt','2026-09-08|15:07-16:02|3 FRANKLIN Aretha','2026-09-09'); }
  catch(e){ return {question:'ouverte', erreur:String(e.message)}; }
  return {question:'ouverte', avant:av, cellule:!!edtCellule('2026-09-08|15:07-16:02|3 FRANKLIN Aretha')};});
jrn.push('   diagnostic du geste : '+JSON.stringify(diag));
await new Promise(r=>setTimeout(r,1400));
jrn.push('⑤ après glissé « changement d\u2019emploi du temps » (effet 14/09) : '+JSON.stringify(await p.evaluate(()=>{
  const g=window.__HUB.site.edt.grille['2026-2027'];
  const d=(window.__HUB.site.edt.decisions||{})['2026-2027'];
  const v=(g.versions||[]).filter(x=>x.debut==='2026-09-14')[0]||{creneaux:[]};
  return {formeAuHub:Object.keys(g), versions:(g.versions||[]).map(x=>x.debut),
          decisionsEcrites:d?Object.keys(d).length:0,
          journal:(g.journalEdt||[]).map(x=>x.quoi),
          mardiRetire:!(v.creneaux||[]).some(c=>c.jour==='mardi'&&c.creneau==='15:07-16:02'&&c.classeMjpc==='3E Charles de Gaulle'),
          mercrediAjoute:(v.creneaux||[]).some(c=>c.jour==='mercredi'&&c.creneau==='10:07-11:02'&&c.classeMjpc==='3E Charles de Gaulle')};})));
jrn.push('   la trace du 7 septembre : '+JSON.stringify(await p.evaluate(()=>{
  try{const t=window.__HUB.site['3e'].chapitres[0].seances[0].deroule_joue['3e_charles_de_gaulle']
    .heures['2026-09-07_08h57-09h52_3E_Charles_de_Gaulle'];
   return {creneau:t.creneau,clos:t.clos,activites:(t.activites||[]).length};}catch(e){return 'introuvable';}})));
await p.evaluate(()=>{EDT_VUE.ancre='2026-09-14';edtPeindre();});
await new Promise(r=>setTimeout(r,600));
await p.screenshot({path:R+'/tests/8-2-apres-changement-edt.png'});

/* ── ⑥ les refus nommés ──────────────────────────────────────────────── */
jrn.push('⑥ refus nommés : '+JSON.stringify(await p.evaluate(()=>{
  const c=edtCellule('2026-09-08|15:07-16:02|3 FRANKLIN Aretha')||{iso:'2026-09-08',creneau:'15:07-16:02',classeMjpc:'3E Charles de Gaulle',classe:'3 FRANKLIN Aretha'};
  return {passe:edtRefusDepot(c,{iso:'2026-08-20',creneau:'10:07-11:02'}),
          vacances:edtRefusDepot(c,{iso:'2026-10-20',creneau:'10:07-11:02'}),
          mercrediApresMidi:edtRefusDepot(c,{iso:'2026-09-09',creneau:'15:07-16:02'}),
          autreClasse:edtRefusDepot(c,{iso:'2026-09-11',creneau:'11:04-11:59'})};}),null,1));
await p.evaluate(()=>{EDT_VUE.ancre='2026-09-07';edtPeindre();
  edtDepot('2026-09-08|15:07-16:02|3 FRANKLIN Aretha',{iso:'2026-10-20',creneau:'10:07-11:02'});});
await new Promise(r=>setTimeout(r,500));
await p.screenshot({path:R+'/tests/8-3-refus-nomme.png'});
await p.close(); await b.close();
fs.writeFileSync(R+'/tests/8-journal.txt',jrn.join('\n\n'),'utf8');
console.log(jrn.join('\n\n'));

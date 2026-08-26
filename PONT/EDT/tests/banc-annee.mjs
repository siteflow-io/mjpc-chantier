/* BANC — LA VUE ANNÉE. Deux états : celui du hub d'aujourd'hui (une classe
   appariée, un chapitre) et un état rempli (quatre classes, deux chapitres).
   Mesure donnée : le pourcentage de la surface utile réellement occupé. */
import fs from 'fs'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/puppeteer');
const R='/home/claude';
const J=(f)=>JSON.parse(fs.readFileSync(R+'/'+f,'utf8'));
const store={}; const poser=(c,v)=>{const p=c.split('/').filter(Boolean);let n=store;for(let k=0;k<p.length-1;k++){if(typeof n[p[k]]!=='object')n[p[k]]={};n=n[p[k]];}n[p[p.length-1]]=v;};
poser('classes',J('tests/hub/classes.json'));
poser('site/3e',J('tests/hub/site_3e.json'));
poser('site/config',J('tests/hub/site_config.json'));
poser('site/edt/calendrier/2026-2027',J('calendrier-2026-2027.json'));
poser('site/edt/grille/2026-2027',J('tests/grille-appariee.json'));
poser('site/edt/creneaux/2026-2027',J('creneaux-2026-2027.json'));

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
const nettoyer=()=>p.evaluate(()=>{document.querySelectorAll('button').forEach(x=>{
  if(!x.closest('#edt-ecran')&&/^\s*(Compris|Annuler)\s*$/.test(x.textContent))x.click();});
  const o=document.getElementById('fi-overlay'); if(o)o.remove();});

/* la surface RÉELLEMENT porteuse : l'échelle, les pistes, la légende */
const surface=()=>p.evaluate(()=>{
  const e=document.getElementById('edt-ecran');
  const utile=e.clientHeight-e.querySelector('.edt-tete').getBoundingClientRect().height;
  let porte=0;
  e.querySelectorAll('.edt-an-echelle,.edt-an-piste,.edt-an-legende,.edt-an-vide').forEach(x=>{
    porte+=x.getBoundingClientRect().height; });
  return {utileEnPx:Math.round(utile), porteurEnPx:Math.round(porte),
          pourcent:Math.round(porte/utile*1000)/10,
          lignes:e.querySelectorAll('.edt-an-piste').length,
          motifsEcrits:Array.from(e.querySelectorAll('.edt-an-motif')).map(x=>x.textContent),
          mois:e.querySelectorAll('.edt-an-mois').length,
          vacancesNommees:Array.from(e.querySelectorAll('.edt-an-vac i')).map(x=>x.textContent),
          jalonsCliquables:e.querySelectorAll('.edt-an-jalon[onclick]').length,
          scrollY:(window.scrollTo(0,4000),window.scrollY)};});

await p.evaluate(()=>{EDT_VUE.mode='annee';edtPeindre();});
await new Promise(r=>setTimeout(r,700)); await nettoyer();
console.log('ÉTAT RÉEL DU HUB (1 classe appariée, 1 chapitre) :');
console.log(JSON.stringify(await surface(),null,1));
await p.screenshot({path:R+'/tests/5-2-annee.png'});

/* état rempli : quatre classes appariées, deux chapitres publiés */
await p.evaluate(()=>{
  const cl=['3E Charles de Gaulle','CLASSE TEST','4E BANKSY','4E PYTHAGORE'];
  const noms=['3 FRANKLIN Aretha','3 DYLAN Bob','4 HUGO','4 TURING'];
  EDT.grille.creneaux.forEach(c=>{const i=noms.indexOf(c.classe); if(i>=0)c.classeMjpc=cl[i];});
  const l=EDT_CHAP['3e']||[];
  if(l.length===1){
    const copie=JSON.parse(JSON.stringify(l[0]));
    copie.title='Le roman du XXe siècle'; copie.ordre=2; copie.__cle='1';
    copie.seances.forEach((s,i)=>{ s.__i=String(i); s.deroule_joue={}; });
    /* deux heures jouées en novembre, pour que sa barre réelle existe */
    copie.seances[0].deroule_joue={'3e_charles_de_gaulle':{classe:'3E Charles de Gaulle',heures:{
      '2026-11-09_08h57-09h52_3E_Charles_de_Gaulle':{creneau:'08:57-09:52',clos:true,activites:[]},
      '2026-12-04_10h07-11h02_3E_Charles_de_Gaulle':{creneau:'10:07-11:02',clos:true,activites:[]}}}};
    l.push(copie);
  }
  edtPeindre();});
await new Promise(r=>setTimeout(r,900)); await nettoyer();
console.log('\nÉTAT REMPLI (4 classes appariées, 2 chapitres) :');
console.log(JSON.stringify(await surface(),null,1));
await p.screenshot({path:R+'/tests/5-2c-annee-remplie.png'});

/* l'année vide */
await p.evaluate(()=>{EDT.grille.creneaux.forEach(c=>{c.classeMjpc='';});edtPeindre();});
await new Promise(r=>setTimeout(r,600)); await nettoyer();
const vide=await p.evaluate(()=>({motifs:Array.from(document.querySelectorAll('.edt-an-motif')).map(x=>x.textContent),
  lignes:document.querySelectorAll('.edt-an-piste').length}));
console.log('\nAUCUNE CLASSE APPARIÉE :', JSON.stringify(vide));
await p.screenshot({path:R+'/tests/5-2b-annee-vide.png'});
await b.close();

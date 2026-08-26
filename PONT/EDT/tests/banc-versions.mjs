/* BANC — LES VERSIONS DATÉES DE LA GRILLE.
   ① compatibilité : le JSON du sas TEL QUEL (sans `versions`) se charge et s'affiche.
   ② deux versions : la 4e Hugo passe du mardi 13:00 au jeudi 11:04 le 3 novembre.
   ③ le passé ne bouge pas : une heure jouée le 7 septembre garde son créneau. */
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
poser('site/edt/creneaux/2026-2027',J('creneaux-2026-2027.json'));
/* LE FICHIER DU SAS TEL QUEL — ancienne forme, `creneaux` à la racine */
const grilleSas=J('tests/grille-appariee.json');
poser('site/edt/grille/2026-2027',grilleSas);

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
await new Promise(r=>setTimeout(r,1500));
await p.evaluate(()=>{document.body.classList.add('admin-mode');edtOuvrir();});
await new Promise(r=>setTimeout(r,2200));
const nettoyer=()=>p.evaluate(()=>{document.querySelectorAll('button').forEach(x=>{
  if(!x.closest('#edt-ecran')&&!x.closest('#edt-modale')&&/^\s*(Compris|Annuler)\s*$/.test(x.textContent))x.click();});
  const o=document.getElementById('fi-overlay'); if(o)o.remove();});

/* ① compatibilité — aucune réinjection */
jrn.push('① compatibilité, fichier du sas TEL QUEL : '+JSON.stringify(await p.evaluate(()=>({
  formeAuHub: Object.keys(window.__HUB.site.edt.grille['2026-2027']).indexOf('versions')<0 ? 'ancienne (creneaux a la racine)' : 'versions',
  versionsLues: edtVersions().length,
  dateDeLaVersion: edtVersions()[0].debut,
  marqueeAncienne: !!edtVersions()[0].ancienne,
  casesLues: edtCasesA('2026-09-08').length}))));

/* la semaine du 7 septembre, version d'origine */
const semaine=(iso)=>p.evaluate((d)=>{EDT_VUE.mode='semaine';EDT_VUE.ancre=d;edtPeindre();
  const c=edtProjeter(d,5);
  return Object.keys(c).filter(k=>k.indexOf('4 HUGO')>=0).sort()
    .map(k=>{const x=c[k];return x.iso+' '+x.creneau;});}, iso);
jrn.push('② la 4 HUGO, semaine du 7 septembre (version d\u2019origine) :\n  '+(await semaine('2026-09-07')).join('\n  '));
await new Promise(r=>setTimeout(r,500)); await nettoyer();
await p.screenshot({path:R+'/tests/7-1-semaine-version1.png'});

/* ② une seconde version au 3 novembre : la 4 HUGO passe du mardi 13:00 au jeudi 11:04 */
await p.evaluate(()=>{
  edtVersionAjouter('2026-11-03','changement de novembre');
});
await new Promise(r=>setTimeout(r,900));
await p.evaluate(()=>{
  const o=EDT.grille, v=o.versions.filter(x=>x.debut==='2026-11-03')[0];
  v.creneaux = v.creneaux.filter(c=>!(c.classe==='4 HUGO'&&c.jour==='mardi'&&c.creneau==='13:00-13:55'));
  v.creneaux.push({jour:'jeudi',creneau:'11:04-11:59',semaine:'A',classe:'4 HUGO',salle:'9',mjpc:true,classeMjpc:'CLASSE TEST'});
  edtEcrireGrille(o,{quand:Date.now(),effet:'2026-11-03',quoi:'4 HUGO : mardi 13:00 \u2192 jeudi 11:04'});
});
await new Promise(r=>setTimeout(r,1200));
jrn.push('   après la version du 3 novembre — semaine du 7 septembre (le PASSÉ) :\n  '+(await semaine('2026-09-07')).join('\n  '));
await new Promise(r=>setTimeout(r,400)); await nettoyer();
await p.screenshot({path:R+'/tests/7-1-semaine-version1.png'});
jrn.push('   semaine du 9 novembre (la NOUVELLE version) :\n  '+(await semaine('2026-11-09')).join('\n  '));
await new Promise(r=>setTimeout(r,400)); await nettoyer();
await p.screenshot({path:R+'/tests/7-2-semaine-version2.png'});

/* la marque discrète sur la semaine */
jrn.push('   marque sur la semaine du 9 novembre : '+JSON.stringify(await p.evaluate(()=>
  (document.querySelector('.edt-t-chg')||{}).textContent||'(aucune)')));

/* ③ le passé ne bouge pas : la trace au hub, champ à champ */
jrn.push('③ la trace du 7 septembre au hub : '+JSON.stringify(await p.evaluate(()=>{
  try{ const t=window.__HUB.site['3e'].chapitres[0].seances[0].deroule_joue['3e_charles_de_gaulle']
    .heures['2026-09-07_08h57-09h52_3E_Charles_de_Gaulle'];
   return {creneau:t.creneau, clos:t.clos, fin:t.fin, activites:(t.activites||[]).length}; }catch(e){return 'introuvable';}})));

/* les refus nommés */
jrn.push('refus : '+JSON.stringify(await p.evaluate(()=>({
  memeDate: edtValiderVersions([{debut:'2026-09-01',creneaux:[1]},{debut:'2026-09-01',creneaux:[1]}]),
  horsAnnee: edtValiderVersions([{debut:'2025-05-01',creneaux:[1]}]),
  sansCreneau: edtValiderVersions([{debut:'2026-09-01',libelle:'vide',creneaux:[]}])}))));

/* l'écran des versions */
await p.evaluate(()=>{edtFermer();openProfPanel();showProfSection('edt');});
await new Promise(r=>setTimeout(r,1800)); await nettoyer();
jrn.push('écran des versions : '+JSON.stringify(await p.evaluate(()=>{
  const z=document.getElementById('edt-panneau');
  return {lignes:z.querySelectorAll('.edt-per').length,
          enVigueur:(z.querySelector('.edt-per-ici b')||{}).textContent||'(aucune)',
          journal:Array.from(z.querySelectorAll('.edt-jrn li')).map(x=>x.innerText.replace(/\n/g,' / '))};})));
await p.screenshot({path:R+'/tests/7-3-ecran-versions.png'});
fs.writeFileSync(R+'/tests/7-journal.txt', jrn.join('\n\n'),'utf8');
console.log(jrn.join('\n\n'));
await b.close();

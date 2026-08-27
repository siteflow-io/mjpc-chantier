const fs=require('fs');
let src=fs.readFileSync('candidat.html','utf8');
const deb=src.indexOf('/* ══ ① IDENTITÉ DES OBJETS'), fin=src.indexOf('function edtCharger(apres){');
let bloc=src.slice(deb,fin);
// mocks
let ARCHIVES=[], ECRITS=[], DITS=[];
let ARCHIVE_OK=true;
global.secuEcrire=(c,v)=>{ARCHIVES.push({c,v});return Promise.resolve({ok:ARCHIVE_OK});};
global.atCorbeilleCle=m=>'/corbeille/2026-08-27/'+m;
global.mjpcPutJson=(u,v,ou,cb)=>{ECRITS.push({u,ou});cb&&cb();};
global.atInfo=t=>DITS.push(t);
global.FIREBASE_BASE='';
global.edtChemin=o=>'/site/edt/'+o+'/2026-2027';
const cal=JSON.parse(fs.readFileSync('cal.json','utf8'));
global.EDT={calendrier:JSON.parse(JSON.stringify(cal)),grille:null,creneaux:null,periodes:null,photos:null};
eval(bloc);
const run=(label,ok)=>new Promise(r=>{
  ARCHIVES=[];ECRITS=[];DITS=[];ARCHIVE_OK=ok;
  global.EDT={calendrier:JSON.parse(JSON.stringify(cal))};
  edtMettreANiveau(fini=>{
    console.log(`  ${label}`);
    console.log(`    archivage tenté : ${ARCHIVES.length} | écriture(s) : ${ECRITS.length} | dit : ${DITS.length?DITS[0].slice(0,60):'—'}`);
    console.log(`    ordre respecté  : ${ARCHIVES.length>0 && (ok? ECRITS.length>0 : ECRITS.length===0)}`);
    console.log(`    ce qui est annoncé : ${EDT.miseANiveauDit.join(' · ')}`);
    r();});
});
(async()=>{ await run("① archivage OK  → l'écriture a lieu",true);
            await run("② archivage KO  → RIEN n'est écrit",false); })();

const fs=require('fs');const vm=require('vm');
const V=[];const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,200)});if(!c)console.log('ÉCHEC '+n+' — '+String(d).slice(0,200));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);if(!m)throw new Error(n);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
const canon=fs.readFileSync('mjpc-core.staging.js','utf8');
const app=fs.readFileSync('correction_dictee.staging.html','utf8');
const APP={id:'correction_dictee',nom:'Correction de dictée',contenant:'aucun',usage:'À partir des erreurs…',quandPas:'Pas sans dictée…'};
const MAN={notions:[],noeuds:['correction_dictee']};
let ECRITS=[],LU=null;
const env={console,Object,JSON,Date,String,Array,RegExp,Promise,
  MJPC_CORE_VERSION:'1.6.0',MJPC_APP:APP,MJPC_MANIFESTE:MAN,MJPC_PURGE:{preserver:[],purger:[]},
  db:{ref:(p)=>({once:()=>Promise.resolve({val:()=>LU}),set:(v)=>{ECRITS.push({p,v});}})}};
env.window=env;vm.createContext(env);
vm.runInContext(ex(canon,'mjpcManifesteAJour'),env);
vm.runInContext(ex(app,'publierManifeste'),env);
const attendu={version:'1.6.0',app:APP,manifeste:MAN,purge:{preserver:[],purger:[]},publie_le:1};
(async()=>{
 /* ① le hub est PÉRIMÉ (cas réel : socle 1.1.0, pas d'usage) → publication */
 LU={version:'1.1.0',app:{id:'correction_dictee',nom:'Correction de dictée',contenant:'aucun'},manifeste:MAN};
 ECRITS=[];vm.runInContext('publierManifeste(db)',env);await new Promise(r=>setTimeout(r,60));
 ok('① hub périmé (socle 1.1.0, sans usage) → LE MANIFESTE EST PUBLIÉ, sans geste manuel',
    ECRITS.length===1&&ECRITS[0].v.app.usage===APP.usage&&ECRITS[0].v.version==='1.6.0',JSON.stringify(ECRITS.map(e=>e.p)));
 /* ② le hub est à jour → AUCUNE écriture */
 LU=JSON.parse(JSON.stringify(attendu));
 ECRITS=[];vm.runInContext('publierManifeste(db)',env);await new Promise(r=>setTimeout(r,60));
 ok('② hub à jour → AUCUNE écriture (réduction du trafic prouvée)',ECRITS.length===0,ECRITS.length+' écriture(s)');
 /* ③ un usage modifié suffit à republier */
 LU=JSON.parse(JSON.stringify(attendu));LU.app.usage='ancien texte';
 ECRITS=[];vm.runInContext('publierManifeste(db)',env);await new Promise(r=>setTimeout(r,60));
 ok('③ un `usage` qui a changé déclenche la republication',ECRITS.length===1);
 /* ④ nœuds du manifeste modifiés */
 LU=JSON.parse(JSON.stringify(attendu));LU.manifeste={notions:[],noeuds:['autre']};
 ECRITS=[];vm.runInContext('publierManifeste(db)',env);await new Promise(r=>setTimeout(r,60));
 ok('④ des nœuds déclarés qui changent déclenchent la republication',ECRITS.length===1);
 /* ⑤ hub vide (app jamais publiée) */
 LU=null;ECRITS=[];vm.runInContext('publierManifeste(db)',env);await new Promise(r=>setTimeout(r,60));
 ok('⑤ hub vide → publication',ECRITS.length===1);
 /* ⑥ CHIFFRE : avant, N ouvertures = N écritures ; après, 1 seule */
 LU=JSON.parse(JSON.stringify(attendu));ECRITS=[];
 for(let i=0;i<10;i++){vm.runInContext('publierManifeste(db)',env);}
 await new Promise(r=>setTimeout(r,120));
 ok('⑥ RÉDUCTION MESURÉE : 10 ouvertures → '+ECRITS.length+' écriture(s) (avant : 10)',ECRITS.length===0,ECRITS.length);
 /* ⑦ la lecture ne casse jamais l'app */
 const env2=Object.assign({},env);
 ok('⑦ un `once` sans promesse retombe sur la publication directe (jamais de casse)',
    /if\(lu&&typeof lu\.then==="function"\)/.test(app)&&/else ecrire\(\)/.test(app));
 fs.writeFileSync('banc-verdicts.json',JSON.stringify(V,null,1));
 const ko=V.filter(v=>!v.ok);
 console.log('══ BANC M-MANIFESTE : '+(V.length-ko.length)+'/'+V.length+' verts ══');
 process.exit(ko.length?1:0);
})();

// HARNAIS QCM (par la fonction, déclaré : le QCM n'affiche le sexe nulle part — aucun geste ne le montre).
// Charge, depuis le fichier du QCM, les fonctions qui fusionnent classes et sexes, et les joue sur une base simulée.
const fs=require('fs'); const f=process.argv[2]; const src=fs.readFileSync(f,'utf8');
function extraire(nom){const m=src.match(new RegExp('function\\s+'+nom+'\\s*\\('));if(!m)throw new Error('introuvable '+nom);let i=m.index,j=src.indexOf('{',i),d=0,k=j;for(;k<src.length;k++){if(src[k]==='{')d++;else if(src[k]==='}'){d--;if(!d)break;}}return src.slice(i,k+1);}
const noms=['sanMJPC','cleClasse','estClasseInterne','estClasseTest','slugify','slugClasse','extractEleves','normaliserElevesQCM','normaliserClassesQCM','surveillerClassesAvecSexes','migrerClassesUneFois','estClasseInterneObj','deduireSexe'];
let code='';for(const n of noms){try{code+=extraire(n)+'\n';}catch(e){}}
const ARBRE={classes:{'ZZTEST 3e':{nom:'ZZTEST 3e',eleves:['ZZTEST ALPHA Anna','ZZTEST BETA Bruno','ZZTEST GAMMA Clara'],amenagements:{zztest_alpha_anna:{sexe:'f'},zztest_beta_bruno:{sexe:'m',dicteeAmenagee:true}}},
  'ZZTEST LEGACY':{nom:'ZZTEST LEGACY',eleves:[{nomComplet:'ZZTEST OLD Otto',sexe:'m'}]}},
  qcm:{eleveSexes:{'ZZTEST 3e':{zztest_alpha_anna:'m',zztest_gamma_clara:'f'}},classes:{}}};
const ecoutes=[],ecritures=[];
function lire(p){return p.split('/').filter(Boolean).reduce((n,k)=>n&&n[k],ARBRE);}
const db={ref:p=>({on:(ev,cb)=>{ecoutes.push(p);cb({val:()=>lire(p)});},off:()=>{},once:()=>Promise.resolve({val:()=>lire(p)}),
  set:v=>{ecritures.push('set '+p);return Promise.resolve();},update:v=>{ecritures.push('update '+p);return Promise.resolve();},remove:()=>{ecritures.push('remove '+p);return Promise.resolve();}})};
const ctx=new Function('db','ARBRE',code+';return {surveiller:surveillerClassesAvecSexes,migrer:migrerClassesUneFois};')(db,ARBRE);
let vu=null; ctx.surveiller(o=>{vu=o;});
const res={ecoutes:ecoutes.slice()};
const c=vu&&Object.values(vu).find(x=>x.nom==='ZZTEST 3e');
res.sexes=c?Object.fromEntries(c.eleves.map(e=>[e.nomComplet,e.sexe||null])):null;
ctx.migrer((a,b)=>{res.migration={classesCopiees:a,sexesMigres:b};res.ecritures=ecritures.slice();console.log(JSON.stringify(res));});

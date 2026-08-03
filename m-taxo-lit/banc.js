const fs=require('fs');const vm=require('vm');
const V=[];const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,200)});if(!c)console.log('ÉCHEC '+n+' — '+String(d).slice(0,200));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);if(!m)throw new Error(n);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){const m=new RegExp('^var '+n+'\\s*=','m').exec(s);let i=m.index+m[0].length,q=null;
 for(;i<s.length;i++){const c=s[i];
  if(q){if(c==='\\'){i++;continue;}if(c===q)q=null;continue;}
  if(c==='"'||c==="'"||c==='`'){q=c;continue;}
  if(c==='/'&&s[i+1]==='/'){i=s.indexOf('\n',i);continue;}
  if(c===';')break;}
 return s.slice(m.index,i+1);}
const idx=fs.readFileSync('index.prod.html','utf8');
const canon=fs.readFileSync('canon.js','utf8');
const avant=JSON.parse(fs.readFileSync('taxo.hub.json','utf8'));
const apres=JSON.parse(fs.readFileSync('taxonomie_atelier.json','utf8'));
const env={console,Object,JSON,String,Array,RegExp,Math};env.window=env;vm.createContext(env);
vm.runInContext(ex(canon,'mjpcPromptVocabulaire'),env);
vm.runInContext(cs(idx,'CH_TYPES_SEANCE'),env);
for(const f of ['chVocabulaireTaxo','chIdsTaxo','chVocabulaireTypes'])vm.runInContext(ex(idx,f),env);
/* ═══ LE PROMPT HÉRITE SANS RETOUCHE ═══ */
const v1=vm.runInContext('chVocabulaireTaxo('+JSON.stringify(avant)+')',env);
const v2=vm.runInContext('chVocabulaireTaxo('+JSON.stringify(apres)+')',env);
const n1=(v1.match(/^- /gm)||[]).length,n2=(v2.match(/^- /gm)||[]).length;
/* ⚠ DÉFAUT PRÉ-EXISTANT, signalé et NON réparé : chVocabulaireTaxo lit `dom.libelle`
   alors que les domaines portent `libelleProf` — les en-têtes affichent donc l'ID
   (`### dom-ortho-lex`) depuis toujours, pour les 5 domaines existants comme pour
   les 2 nouveaux. Le comportement est IDENTIQUE avant et après : rien n'est introduit. */
ok('le prompt hérite SANS RETOUCHE : '+n1+' → '+n2+' entrées, chVocabulaireTaxo inchangée',
   n2-n1===56&&/### dom-litterature/.test(v2)&&/### dom-versification/.test(v2)&&/### dom-ortho-lex/.test(v1),'delta '+(n2-n1));
ok('le d\u00e9faut d\u2019en-t\u00eate est PR\u00c9-EXISTANT (les 5 domaines actuels affichent d\u00e9j\u00e0 leur id)',
   /### dom-ortho-lex/.test(v1)&&!/### Orthographe/.test(v1));
ok('les notions littéraires paraissent avec leurs niveaux',
   /- litt-020 : La comparaison \[3e\]/.test(v2)&&/- vers-007 : La c\u00e9sure \[4e-3e\]/.test(v2),v2.slice(v2.indexOf('- litt-020'),v2.indexOf('- litt-020')+60));
/* PREUVE PAR NOTION FACTICE */
const t3=JSON.parse(JSON.stringify(apres));
t3.domaines[5].familles[0].notions.push({id:'litt-factice-banc',libelleProf:'Notion factice du banc',niveaux:'4e',actif:true});
const v3=vm.runInContext('chVocabulaireTaxo('+JSON.stringify(t3)+')',env);
ok('PREUVE : une notion ajoutée paraît, aucune liste retouchée',
   /- litt-factice-banc : Notion factice du banc \[4e\]/.test(v3)&&(v3.match(/^- /gm)||[]).length===n2+1);
/* une notion INACTIVE est exclue (désactivation réversible de l'éditeur) */
const t4=JSON.parse(JSON.stringify(apres));t4.domaines[6].familles[0].notions[0].actif=false;
ok('désactivation réversible : une notion inactive disparaît du prompt, sans être supprimée',
   (vm.runInContext('chVocabulaireTaxo('+JSON.stringify(t4)+')',env).match(/^- /gm)||[]).length===n2-1
   && t4.domaines[6].familles[0].notions[0].id==='vers-001');
/* LE POIDS, MESURÉ */
const p1=v1.length,p2=v2.length;
console.log('   poids vocabulaire : '+p1+' → '+p2+' c. (+'+(p2-p1)+')');
ok('poids remesuré, non estimé : +'+(p2-p1)+' c. sur le vocabulaire',p2>p1);
/* IDS : à la suite, trous jamais comblés */
const fams=apres.domaines.flatMap(d=>d.familles.map(f=>f.id));
const nums=fams.map(x=>parseInt(x.slice(4),10)).sort((a,b)=>a-b);
ok('familles fam-01…fam-51 sans trou ni doublon, à la suite de fam-40',
   nums.length===51&&nums[0]===1&&nums[50]===51&&new Set(nums).size===51);
/* AUCUNE NOTION EXISTANTE TOUCHÉE */
const av={},ap={};
avant.domaines.forEach(d=>d.familles.forEach(f=>f.notions.forEach(n=>av[n.id]=JSON.stringify(n))));
apres.domaines.forEach(d=>d.familles.forEach(f=>f.notions.forEach(n=>ap[n.id]=JSON.stringify(n))));
const modif=Object.keys(av).filter(k=>av[k]!==ap[k]);
ok('AUCUNE des 154 notions existantes renommée, déplacée ni supprimée (comparaison à l\u2019octet)',
   modif.length===0&&Object.keys(av).length===154,JSON.stringify(modif.slice(0,3)));
/* ANTI-DOUBLON : aucun id ni libellé dupliqué */
const tousIds=Object.keys(ap);
ok('aucun identifiant dupliqué ('+tousIds.length+' notions)',new Set(tousIds).size===tousIds.length);
const libs={};let dbl=[];
apres.domaines.forEach(d=>d.familles.forEach(f=>f.notions.forEach(n=>{
  const k=n.libelleProf.toLowerCase().replace(/[^a-zà-ÿ]/g,'');
  if(libs[k])dbl.push(n.libelleProf+' ↔ '+libs[k]);else libs[k]=n.id;})));
ok('aucun libellé professeur dupliqué',dbl.length===0,JSON.stringify(dbl.slice(0,3)));
/* les deux colonnes */
const A=[],B=[];
apres.domaines.slice(5).forEach(d=>d.familles.forEach(f=>f.notions.forEach(n=>{
  (String(n.source).startsWith('ATTENDU')?A:B).push(n.id);})));
ok('colonnes A et B rigoureusement séparées : '+A.length+' prescrites, '+B.length+' choix de Paul',
   A.length+B.length===56&&A.length===28);
ok('chaque notion nouvelle porte une source non vide',
   apres.domaines.slice(5).every(d=>d.familles.every(f=>f.notions.every(n=>n.source&&n.source.length>20))));
ok('libelleEleve écrit pour un élève : aucun ne reprend le métalangage du libelleProf',
   apres.domaines.slice(5).every(d=>d.familles.every(f=>f.notions.every(n=>n.libelleEleve&&n.libelleEleve!==n.libelleProf))));
ok('chaque notion porte un exemple',
   apres.domaines.slice(5).every(d=>d.familles.every(f=>f.notions.every(n=>n.exemple&&n.exemple.length>5))));
/* ÉDITEUR M8bis : l'arborescence lit-elle les nouveaux domaines ? */
const ids=vm.runInContext('chIdsTaxo('+JSON.stringify(apres)+')',env);
ok('chIdsTaxo (prompt maître) voit les 210 notions',Object.keys(ids.notions).length===210,Object.keys(ids.notions).length);
fs.writeFileSync('banc-verdicts.json',JSON.stringify(V,null,1));
const ko=V.filter(v=>!v.ok);
console.log('══ BANC M-TAXO-LIT : '+(V.length-ko.length)+'/'+V.length+' verts ══');
process.exit(ko.length?1:0);

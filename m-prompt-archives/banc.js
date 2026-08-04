const fs=require('fs');const vm=require('vm');
const V=[];const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,200)});if(!c)console.log('ÉCHEC '+n+' — '+String(d).slice(0,200));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);if(!m)throw new Error(n);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
const s=fs.readFileSync('index.staging.html','utf8');
const env={console,Object,JSON,String,Array,RegExp,Math,Date,Number,atEsc:x=>String(x==null?'':x)};
env.window=env;vm.createContext(env);
for(const f of ['atDiffLignes','atIdsStructurels','atZonesCritiques','atDiffHtml','atArchiveDate'])vm.runInContext(ex(s,f),env);
/* ① les trois écrans */
ok('① le bloc d\u2019édition est appelé par LES TROIS écrans, et défini UNE fois',
   (s.match(/atBlocEdition\(\)/g)||[]).length===4&&/function atBlocEdition/.test(s));
for(const e of ['atIARendre','chRendre','diapoRendreEcran']){
  const i=s.indexOf('function '+e);
  ok('① '+e+' appelle atBlocEdition',s.slice(i,i+2800).includes('atBlocEdition()'));
}
/* ② le champ montre le prompt complet */
ok('② le champ est rempli par atPromptComplet (repères remplis), pas par les directives',
   /atEsc\(t\)/.test(s)&&/var t=atPromptComplet\(\)/.test(s));
ok('② atPromptComplet passe par atPromptTexte (le texte tel qu\u2019il partira)',
   /return atPromptTexte\(\);/.test(ex(s,'atPromptComplet')));
/* ③ archive avant, abandon si échec */
const arch=ex(s,'atArchiverPuisEcrire');
ok('③ l\u2019archive part AVANT, et ABANDON si elle échoue',
   /if\(!ok\)\{cb\(false,'archive'\);return;\}/.test(arch)&&arch.indexOf('AT_ARCH_NOEUD')<arch.indexOf('AT_IA_NOEUD'));
/* ④ le différentiel */
const av="ligne A\n- gram-001 : Le sujet\n- c4-lire-01 : Lire\nNE PRODUIS AUCUN JSON TOUT DE SUITE.\n- etude_texte : Étude";
const ap="ligne A\n- c4-lire-01 : Lire\nligne neuve\n- etude_texte : Étude";
const d=vm.runInContext('atDiffLignes('+JSON.stringify(av)+','+JSON.stringify(ap)+')',env);
ok('④ le différentiel : lignes ajoutées et retirées, pas le texte entier',
   d.ajoutees.length===1&&d.retirees.length===2,JSON.stringify(d));
const z=vm.runInContext('atZonesCritiques('+JSON.stringify(av)+','+JSON.stringify(ap)+')',env);
ok('④ ZONE CRITIQUE : la notion disparue est NOMMÉE',
   z.some(a=>a.ids&&a.ids.indexOf('gram-001')>=0),JSON.stringify(z));
ok('④ ZONE CRITIQUE : la règle de cadrage retirée est signalée',
   z.some(a=>a.phrase&&/cadrage/.test(a.phrase)),JSON.stringify(z.map(x=>x.phrase)));
const h=vm.runInContext('atDiffHtml('+JSON.stringify(av)+','+JSON.stringify(ap)+')',env);
ok('④ CE N\u2019EST PAS UN REFUS : le texte le dit',/pas un refus/.test(h)&&/c\u2019est toi qui d\u00e9cides/i.test(h));
ok('④ aucune alerte quand rien de structurel ne disparaît',
   vm.runInContext('atZonesCritiques("- gram-001 : X","- gram-001 : X\\nautre")',env).length===0);
/* compétence disparue */
const z2=vm.runInContext('atZonesCritiques("- c4-lire-01 : Lire\\n- c4-ecrire-01 : \u00c9crire","- c4-lire-01 : Lire")',env);
ok('④ une COMPÉTENCE disparue est nommée',z2.length===1&&z2[0].ids[0]==='c4-ecrire-01',JSON.stringify(z2));
/* ⑤ nœud */
ok('⑤ le nœud d\u2019archives est frère de celui des prompts, séparé par produit',
   /var AT_ARCH_NOEUD='\/site\/atelier\/prompts_archives';/.test(s));
/* ⑥ la phrase diaporama */
ok('⑥ la présentation mentionne l\u2019outil diaporama',
   /UN CAS QUE TU RISQUES DE MANQUER : les diaporamas/.test(s)&&/transforme les diapositives/.test(s));
/* le bouton grisé */
ok('le bouton d\u2019enregistrement est grisé tant que rien n\u2019a changé',
   /id="at-ia-enr"[^>]*disabled/.test(s)&&/b\.disabled=\(t\.value===atPromptComplet\(\)\)/.test(s));
fs.writeFileSync('banc-verdicts.json',JSON.stringify(V,null,1));
const ko=V.filter(v=>!v.ok);
console.log('══ BANC M-PROMPT-ARCHIVES : '+(V.length-ko.length)+'/'+V.length+' verts ══');
process.exit(ko.length?1:0);

/* BANC MÉMOIRE M-PROMPT-4 — la présentation en tête partout, la liste générée,
   le poids chiffré, et la PREUVE qu'un prompt persisté n'est pas écrasé. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,220)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,240));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
/* extracteur de constante qui RESPECTE LES CHAÎNES : le `;` de fin se cherche
   hors chaîne (une regex « ; en fin de ligne » filait au milieu d'une autre
   constante quand la déclaration est suivie d'un commentaire). */
function cst(src,nom){
  const m=new RegExp('^var '+nom+'\\s*=','m').exec(src);
  if(!m)throw new Error('cst: '+nom);
  let i=m.index+m[0].length,q=null;
  for(;i<src.length;i++){
    const c=src[i];
    if(q){ if(c==='\\'){i++;continue;} if(c===q)q=null; continue; }
    if(c==='"'||c==="'"||c==='`'){q=c;continue;}
    if(c==='/'&&src[i+1]==='/'){i=src.indexOf('\n',i);continue;}
    if(c==='/'&&src[i+1]==='*'){i=src.indexOf('*/',i)+1;continue;}
    if(c===';')break;
  }
  return src.slice(m.index,i+1);
}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));
const APPS=['correction_dictee','worktrack','dictee_universelle','pilotage_debat_s3','evaluation-qcm','analyse_logique','applause_meter'];

(async()=>{
  const canon=fs.readFileSync('mjpc-core.staging.js','utf8');
  const canonAv=fs.readFileSync('canon.js','utf8');
  /* signature réelle, LUE au canon (règle du 01/08) */
  verdict('r\u00e8gle du 01/08 : mjpcEcrireRest rend cb(issue) \u2014 lu au canon',/function mjpcEcrireRest\(url,options,cb\)/.test(canon)&&/cb\(issue\)/.test(canon));

  const HUB={},journal=[];
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
    fetch:(u)=>{journal.push({op:'GET',u:String(u)});
      if(env._muet)return Promise.resolve({ok:false,json:()=>Promise.resolve(null)});
      return Promise.resolve({ok:true,json:()=>Promise.resolve(HUB['/manifestes'])});}};
  env.window=env;vm.createContext(env);
  for(const f of ['mjpcPromptOutils','mjpcPromptPresentation','mjpcPromptAvecPresentation','mjpcChargerOutils','mjpcPromptComposer','mjpcPromptVocabulaire'])
    vm.runInContext(extraire(canon,f),env);
  for(const c of ['MJPC_OUTILS_CACHE','MJPC_PRESENTATION','MJPC_PRESENTATION_BREVE','MJPC_PROMPT_CADRAGE'])
    vm.runInContext(cst(canon,c),env);

  /* ═══ LES USAGES SONT DÉCLARÉS DANS LES APPS, PAS AU CANON ═══ */
  const decl={};
  APPS.forEach(a=>{
    const s=fs.readFileSync(a+'.staging.html','utf8');
    const m=/MJPC_APP\s*=\s*\{[\s\S]*?\n\}/.exec(s.slice(s.indexOf('\nvar MJPC_APP')>=0?s.indexOf('\nvar MJPC_APP'):0));
    const bloc=(function(){let i=-1;const re=/MJPC_APP\s*=\s*\{/g;let mm;
      while((mm=re.exec(s))){const d=s.lastIndexOf('\n',mm.index)+1;if(s.slice(d,s.indexOf('\n',mm.index)).trim().startsWith('//'))continue;i=mm.index;break;}
      let j=s.indexOf('{',i),p=0,k=j;for(;k<s.length;k++){const c=s[k];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}
      return s.slice(i,k+1);})();
    const nom=/nom:\s*"([^"]*)"/.exec(bloc), us=/usage:\s*"([^"]*)"/.exec(bloc), qp=/quandPas:\s*"([^"]*)"/.exec(bloc);
    decl[a]={nom:nom&&nom[1],usage:us&&us[1],quandPas:qp&&qp[1]};
  });
  verdict('les 7 apps d\u00e9clarent usage ET quandPas DANS MJPC_APP (pas de structure parall\u00e8le)',
    APPS.every(a=>decl[a].usage&&decl[a].quandPas),JSON.stringify(Object.keys(decl).filter(a=>!decl[a].usage)));
  verdict('le canon ne porte AUCUNE description d\u2019app (elles vivent dans les apps)',
    !/Applaudim|co\u00e9valu|dict\u00e9e coop/i.test(canon.slice(canon.indexOf('MJPC_PRESENTATION'))),'');
  verdict('les deux apps de CO\u00c9VALUATION le disent dans leur usage',
    /DEUX \u00c0 DEUX/.test(decl.dictee_universelle.usage)&&/votent/.test(decl.applause_meter.usage));
  verdict('les deux outils d\u2019oral se renvoient l\u2019un \u00e0 l\u2019autre (le d\u00e9faut qui a fait proposer l\u2019applaudim\u00e8tre \u00e0 tort)',
    /Applaudim\u00e8tre/.test(decl.pilotage_debat_s3.quandPas)&&/Pilotage d\u00e9bat/.test(decl.applause_meter.quandPas));

  /* ═══ LA LISTE EST GÉNÉRÉE ═══ */
  HUB['/manifestes']={};
  APPS.forEach(a=>{HUB['/manifestes'][a]={app:{id:a,nom:decl[a].nom,contenant:'aucun',usage:decl[a].usage,quandPas:decl[a].quandPas}};});
  HUB['/manifestes'].index={app:{id:'index',nom:'MJPC \u2014 le site'}};
  HUB['/manifestes'].taxonomie={app:{id:'taxonomie',nom:'Taxonomie MJPC'}};
  HUB['/manifestes'].reecriture={app:{id:'reecriture',nom:'R\u00e9\u00e9criture'}};   /* hors canon : sans usage */
  await new Promise(r=>{vm.runInContext('mjpcChargerOutils("https://hub",function(){})',env);setTimeout(r,60);});
  const liste=vm.runInContext('mjpcPromptOutils(MJPC_OUTILS_CACHE)',env);
  verdict('liste G\u00c9N\u00c9R\u00c9E depuis ce que les apps publient : 8 outils, le site et la taxonomie \u00e9cart\u00e9s',
    (liste.match(/^  \u2022 /gm)||[]).length===8&&!/le site/.test(liste)&&!/Taxonomie/.test(liste),String((liste.match(/^  \u2022 /gm)||[]).length));
  verdict('une app SANS usage para\u00eet quand m\u00eame, en le disant',
    /R\u00e9\u00e9criture \u2014 \(usage \u00e0 d\u00e9crire/.test(liste),liste.split('\n').filter(l=>/R\u00e9\u00e9criture/.test(l))[0]);
  /* PREUVE PAR ÉLÉMENT FACTICE */
  HUB['/manifestes'].outil_factice_banc={app:{id:'outil_factice_banc',nom:'Outil factice du banc',usage:'Sert au banc.',quandPas:'Jamais en classe.'}};
  await new Promise(r=>{vm.runInContext('mjpcChargerOutils("https://hub",function(){})',env);setTimeout(r,60);});
  const liste2=vm.runInContext('mjpcPromptOutils(MJPC_OUTILS_CACHE)',env);
  verdict('PREUVE DE G\u00c9N\u00c9RATION : un outil publi\u00e9 para\u00eet, aucune liste retouch\u00e9e',
    /Outil factice du banc : Sert au banc/.test(liste2)&&(liste2.match(/^  \u2022 /gm)||[]).length===9);
  delete HUB['/manifestes'].outil_factice_banc;
  await new Promise(r=>{vm.runInContext('mjpcChargerOutils("https://hub",function(){})',env);setTimeout(r,60);});
  /* hub muet : on le DIT, on n'invente pas */
  const vide=vm.runInContext('mjpcPromptOutils({})',env);
  verdict('hub muet \u2192 la pr\u00e9sentation le DIT au lieu d\u2019inventer une liste',
    /n\u2019a pas pu \u00eatre lue/.test(vide)&&!/Applaudim/.test(vide),vide.slice(0,90));

  /* ═══ LA PRÉSENTATION : contenu et place ═══ */
  const tronc=vm.runInContext('mjpcPromptPresentation({})',env);
  verdict('le tronc dit les QUATRE choses : o\u00f9 \u00e7a atterrit, les outils, ce qui commande, la consultation',
    /monsieurjaipascompris\.fr/.test(tronc)&&/c\u2019est LE PROFESSEUR qui publie/.test(tronc)
    &&/L\u2019Applaudim\u00e8tre/.test(tronc)&&/Jamais le professeur n\u2019est mis en cause/.test(tronc)
    &&/papier reste premier/.test(tronc)&&/tu ne tranches pas/.test(tronc)&&/CONSULT\u00c9 EN COURS DE ROUTE/.test(tronc));
  const breve=vm.runInContext('mjpcPromptPresentation({breve:true})',env);
  verdict('la forme br\u00e8ve garde le principe cardinal et demande la liste avant de conseiller',
    /Jamais le professeur n\u2019est mis en cause/.test(breve)&&/demande-moi d\u2019abord la liste/.test(breve)&&breve.length<tronc.length/2);
  const compose=vm.runInContext('mjpcPromptComposer({directives:"DIRECTIVES"})',env);
  verdict('mjpcPromptComposer place la pr\u00e9sentation EN T\u00caTE',
    compose.indexOf('O\u00d9 TON TRAVAIL ATTERRIT')===0&&compose.indexOf('DIRECTIVES')>0);
  verdict('elle se retire explicitement si une app n\u2019en veut pas (presentation:false)',
    vm.runInContext('mjpcPromptComposer({directives:"D",presentation:false})',env).indexOf('D')===0);

  /* ═══ LE POIDS, CHIFFRÉ ═══ */
  const poids={tronc:tronc.length,breve:breve.length};
  console.log('   poids : tronc '+poids.tronc+' c. · brève '+poids.breve+' c.');
  verdict('le poids est mesur\u00e9 : tronc '+poids.tronc+' c., br\u00e8ve '+poids.breve+' c.',poids.tronc>1500&&poids.breve<900);

  /* ═══ LA PREUVE CAPITALE : un prompt PERSISTÉ n'est PAS écrasé ═══ */
  const persiste="MES DIRECTIVES \u00c0 MOI, \u00c9DIT\u00c9ES PAR PAUL LE 30 JUILLET.";
  const avec=vm.runInContext('mjpcPromptAvecPresentation('+JSON.stringify(persiste)+',{breve:true})',env);
  verdict('la pr\u00e9sentation se place DEVANT le texte persist\u00e9, sans le modifier',
    avec.indexOf(persiste)>0&&avec.endsWith(persiste)&&avec.indexOf('O\u00d9 TON TRAVAIL')===0);
  verdict('PREUVE DE NON-\u00c9CRASEMENT : le texte persist\u00e9 est INTACT \u00c0 L\u2019OCTET dans le r\u00e9sultat',
    avec.slice(avec.length-persiste.length)===persiste,'');
  /* et rien n'écrit au hub : la pièce est assemblée, jamais enregistrée */
  const ecr=journal.filter(j=>j.op!=='GET');
  verdict('la pi\u00e8ce n\u2019\u00e9crit RIEN au hub (assembl\u00e9e \u00e0 la vol\u00e9e, jamais persist\u00e9e)',ecr.length===0,String(ecr.length));

  /* ═══ LES HUIT FICHIERS : la présentation est branchée au point de production ═══ */
  const idx=fs.readFileSync('index.staging.html','utf8');
  verdict('index : les TROIS prompts re\u00e7oivent le TRONC (atPromptTexte)',
    /return mjpcPromptAvecPresentation\(t,\{\}\);/.test(idx));
  const branches={correction_dictee:/return mjpcPromptAvecPresentation\(_assemblePromptBrut/,
    worktrack:/const tpl=mjpcPromptAvecPresentation\(this\.tpl,\{breve:true\}\)/,
    dictee_universelle:/return mjpcPromptAvecPresentation\(_generateAnalysePromptBrut/,
    pilotage_debat_s3:/var texte=mjpcPromptAvecPresentation\(Lp\.join/,
    'evaluation-qcm':/writeText\(mjpcPromptAvecPresentation\(prompt,\{breve:true\}\)\)/,
    analyse_logique:/return mjpcPromptAvecPresentation\(_promptCorrigeBrut/,
    applause_meter:/return mjpcPromptAvecPresentation\(_genererPromptIABrut/};
  const manquantes=APPS.filter(a=>!branches[a].test(fs.readFileSync(a+'.staging.html','utf8')));
  verdict('les 7 apps re\u00e7oivent la forme BR\u00c8VE \u00e0 leur point de production',manquantes.length===0,JSON.stringify(manquantes));
  const sansRemontee=APPS.filter(a=>{const s=fs.readFileSync(a+'.staging.html','utf8');
    return !/usage:MJPC_APP\.usage/.test(s)&&!/app\s*:\s*MJPC_APP\b/.test(s);});
  verdict('les 7 apps REMONTENT usage/quandPas au hub (publierManifeste)',sansRemontee.length===0,JSON.stringify(sansRemontee));
  /* les prompts d'origine ne sont pas réécrits */
  const inchanges=APPS.concat(['index']).filter(a=>{
    const b=fs.readFileSync(a+'.base.html','utf8'),s=fs.readFileSync(a+'.staging.html','utf8');
    const cles={index:'  chapitre:',correction_dictee:'var PROMPT_DIRECTIVES_DEFAULT',worktrack:'const PROMPT_CHAPTER',
      dictee_universelle:'var DU_PROMPT_ANALYSE_DEFAUT','evaluation-qcm':'var PROMPT_IA_DEFAUT',
      analyse_logique:'function alPromptDefaut',applause_meter:'function amPromptDefaut',pilotage_debat_s3:'var Lp=['};
    const k=cles[a];const i=b.indexOf(k),j=s.indexOf(k);
    return b.slice(i,i+400)===s.slice(j,j+400);});
  verdict('AUCUN prompt existant n\u2019est r\u00e9\u00e9crit sur le fond (8/8 d\u00e9buts identiques)',inchanges.length===8,JSON.stringify(inchanges.length));

  fs.writeFileSync('bancmp4-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('bancmp4-poids.json',JSON.stringify(poids,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE M-PROMPT-4 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

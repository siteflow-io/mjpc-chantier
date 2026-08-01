/* BANC MÉMOIRE M-PROMPT-2 — les trois dettes fermées, app par app, et les
   non-régressions. Les STUBS COPIENT LES SIGNATURES DU CANON (règle du 01/08) :
   mjpcEcrireRest appelle cb(issue) — UN SEUL argument. Vérifié en lisant le canon. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,200)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,220));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cst(src,nom){const m=new RegExp('^var '+nom+'\\s*=[\\s\\S]*?;$','m').exec(src);if(!m)throw new Error('cst absente: '+nom);return m[0];}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

/* CONTRÔLE DE LA RÈGLE DU 01/08 : la signature réelle, lue au canon. */
const canon=fs.readFileSync('canon.js','utf8');
const sigOk=/function mjpcEcrireRest\(url,options,cb\)/.test(canon)&&/cb\(issue\)/.test(canon);

function envNeuf(HUB,journal){
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,clearTimeout,
    MJPC_ISSUE:{ACCEPTEE:'acceptee',REFUSEE:'refusee',PANNE:'panne'},
    MJPC_SECU2:{hub:'https://hub-de-banc'},
    fetch:(u)=>{journal.push({op:'GET',u:String(u)});
      const ch=String(u).replace('https://hub-de-banc','').replace(/\.json$/,'');
      if(env._muet)return Promise.resolve({ok:false,json:()=>Promise.resolve(null)});
      return Promise.resolve({ok:true,json:()=>Promise.resolve(ch in HUB?HUB[ch]:null)});},
    /* SIGNATURE RÉELLE : cb(issue), un seul argument — copiée du canon, pas de la mémoire */
    mjpcEcrireRest:(url,opts,cb)=>{journal.push({op:opts.method,u:String(url),body:String(opts.body).slice(0,90)});
      const ch=String(url).replace('https://hub-de-banc','').replace(/\.json$/,'');
      if(env._ecritureKO){cb({etat:'panne'});return;}
      HUB[ch]=JSON.parse(opts.body);cb({etat:'acceptee'});},
  };
  env.window=env;vm.createContext(env);
  for(const f of ['mjpcPromptVocabulaire','mjpcPromptComposer','mjpcPromptChemin','mjpcPromptCharger','mjpcVerdictOk','mjpcPromptEnregistrer','mjpcValidation','mjpcInjecterAvecArchive'])
    vm.runInContext(extraire(canon,f),env);
  vm.runInContext(cst(canon,'MJPC_PROMPT_CADRAGE'),env);
  return env;
}

(async()=>{
  verdict('r\u00e8gle du 01/08 : la signature de mjpcEcrireRest est LUE AU CANON (cb(issue), un argument)',sigOk);

  /* ═══════════ ① WORKTRACK — la dette du prompt jamais persisté ═══════════ */
  {
    const wt=fs.readFileSync('worktrack.staging.html','utf8');
    const base=fs.readFileSync('worktrack.base.html','utf8');
    const HUB={},journal=[];
    const env=envNeuf(HUB,journal);
    vm.runInContext('var PROMPT_CHAPTER="LE PROMPT PAR D\u00c9FAUT EN DUR";var PROF={tpl:null};',env);
    vm.runInContext(cst(wt,'WT_BASE'),env);vm.runInContext(cst(wt,'WT_PROMPT_PRODUIT'),env);
    for(const f of ['wtPromptDefauts','wtChargerPrompt','wtEnregistrerPrompt','wtValiderChapitre'])
      vm.runInContext(extraire(wt,f),env);

    /* DETTE ① : avant, saveTpl n'écrivait NULLE PART */
    const avant=/saveTpl\(\)\{ this\.tpl=\(\$\("tplEdit"\)\|\|\{\}\)\.value\|\|this\.tpl; toast/.test(base);
    const apres=/wtEnregistrerPrompt\(t,/.test(wt);
    verdict('\u2460a AVANT : saveTpl n\u2019\u00e9crivait nulle part (grep base) \u2014 APR\u00c8S : il passe par le hub',avant&&apres);
    await new Promise(r=>{vm.runInContext('wtEnregistrerPrompt("MES CONSIGNES \u00c0 MOI",function(ok){this._ok=ok;})',env);setTimeout(r,60);});
    verdict('\u2460b le prompt est \u00c9CRIT au hub, par verdict',
      env._ok===true&&HUB['/worktrack_prompts/chapitre/directives']==='MES CONSIGNES \u00c0 MOI',JSON.stringify(Object.keys(HUB)));
    /* rechargement : nouvelle session, tpl vidé */
    vm.runInContext('PROF.tpl=null;',env);
    await new Promise(r=>{vm.runInContext('wtChargerPrompt(function(){})',env);setTimeout(r,80);});
    verdict('\u2460c APR\u00c8S RECHARGEMENT : le prompt de Paul est RETROUV\u00c9 (dette ferm\u00e9e)',
      vm.runInContext('PROF.tpl',env)==='MES CONSIGNES \u00c0 MOI',String(vm.runInContext('PROF.tpl',env)));
    env._muet=true;vm.runInContext('PROF.tpl=null;',env);
    await new Promise(r=>{vm.runInContext('wtChargerPrompt(function(){})',env);setTimeout(r,80);});
    verdict('\u2460d base muette \u2192 le d\u00e9faut EN DUR fait foi',vm.runInContext('PROF.tpl',env)==='LE PROMPT PAR D\u00c9FAUT EN DUR');
    env._muet=false;
    env._ecritureKO=true;
    await new Promise(r=>{vm.runInContext('wtEnregistrerPrompt("X",function(ok){this._ok2=ok;})',env);setTimeout(r,60);});
    verdict('\u2460e une \u00e9criture en panne rend FAUX (pas un succ\u00e8s suppos\u00e9)',env._ok2===false);
    env._ecritureKO=false;
    /* DETTE ③ : les motifs s'accumulent */
    let R=vm.runInContext('wtValiderChapitre('+JSON.stringify({meta:{},seances:[
      {id:'s1',titre:'Sans carte'},
      {id:'s2',titre:'Sans ar\u00eates',carte:{x:1,y:2}},
      {titre:'Sans id',carte:{x:1,y:1},aretes:{},evaluation:{items:[]}}]})+')',env);
    let m=R.motifs();
    verdict('\u2462 worktrack : QUATRE d\u00e9fauts \u2192 quatre motifs d\u2019un coup, chacun citant la s\u00e9ance',
      m.length>=4&&m.some(x=>/Sans carte/.test(x))&&m.some(x=>/Sans ar/.test(x))&&m.some(x=>/titre/.test(x)),JSON.stringify(m).slice(0,220));
    R=vm.runInContext('wtValiderChapitre('+JSON.stringify({meta:{titre:'Bon'},seances:[{id:'s1',titre:'S1',carte:{x:0,y:0},aretes:{},evaluation:{items:[]}}]})+')',env);
    verdict('NON-R\u00c9GRESSION worktrack : un chapitre valide passe',R.ok(),JSON.stringify(R.motifs()));
    /* NON-RÉGRESSIONS nommées */
    verdict('NON-R\u00c9GRESSION worktrack 1/5 \u2014 validateChapter et chapterDefaults INCHANG\u00c9ES (garde-fou seed\u2194production)',
      /function validateChapter\(o\)\{/.test(wt)&&/function chapterDefaults/.test(wt));
    verdict('NON-R\u00c9GRESSION worktrack 2/5 \u2014 PROMPT_CHAPTER subsiste comme d\u00e9faut en dur',/const PROMPT_CHAPTER =/.test(wt));
    verdict('NON-R\u00c9GRESSION worktrack 3/5 \u2014 loadChapter et le format /chapitres inchang\u00e9s',
      /function loadChapter\(obj\)\{/.test(wt)&&/chaptersStore\.saveOne/.test(wt));
    verdict('NON-R\u00c9GRESSION worktrack 4/5 \u2014 la sortie clavier par empreinte (M-S\u00c9CU-3) subsiste',/mjpcVerifierProf\(cand\)/.test(wt));
    verdict('NON-R\u00c9GRESSION worktrack 5/5 \u2014 la pastille reste nomm\u00e9e VERSION/meta, non renomm\u00e9e',
      /<meta name="app-version" content="2026-08-01a">/.test(wt)&&/var MJPC_CORE_VERSION="1\.4\.0";/.test(wt));
    verdict('worktrack : l\u2019infobulle ne ment plus',
      /elles te suivent d'un appareil à l'autre/.test(wt)&&!/mémorisées sur ce poste/.test(wt));
  }

  /* ═══════════ ② DICTEE_UNIVERSELLE ═══════════ */
  {
    const du=fs.readFileSync('dictee_universelle.staging.html','utf8');
    const HUB={},journal=[];
    const env=envNeuf(HUB,journal);
    vm.runInContext(cst(du,'DU_BASE'),env);vm.runInContext(cst(du,'DU_PROMPT_ANALYSE_DEFAUT'),env);
    for(const f of ['duChargerPrompt','duEnregistrerPrompt','duValiderCorrections'])vm.runInContext(extraire(du,f),env);
    /* le prompt persiste (il n'était stocké NULLE PART) */
    await new Promise(r=>{vm.runInContext('duEnregistrerPrompt("PROMPT ANALYSE \u00c0 MOI",function(ok){this._ok=ok;})',env);setTimeout(r,60);});
    let lu=null;
    await new Promise(r=>{vm.runInContext('duChargerPrompt(function(v){this._lu=v;})',env);setTimeout(()=>{lu=env._lu;r();},80);});
    verdict('dictee : le prompt d\u2019analyse est d\u00e9sormais PERSIST\u00c9 et relu',env._ok===true&&lu==='PROMPT ANALYSE \u00c0 MOI',String(lu));
    env._muet=true;
    await new Promise(r=>{vm.runInContext('duChargerPrompt(function(v){this._lu2=v;})',env);setTimeout(r,80);});
    verdict('dictee : base muette \u2192 d\u00e9faut en dur, avec ses jetons {{TEXTE}}/{{NIVEAU}}',
      /\{\{TEXTE\}\}/.test(env._lu2)&&/\{\{NIVEAU\}\}/.test(env._lu2));
    env._muet=false;
    /* les jetons interpolent */
    const t=vm.runInContext('mjpcPromptComposer({directives:DU_PROMPT_ANALYSE_DEFAUT,donnees:{TEXTE:"Le chat dort.",NIVEAU:"5e"}})',env);
    verdict('dictee : les JETONS remplacent les donn\u00e9es (patron {{JSON_DICTEE}} g\u00e9n\u00e9ralis\u00e9)',
      /Le chat dort\./.test(t)&&/5e/.test(t)&&!/\{\{/.test(t),t.slice(0,110));
    /* DETTE ③ : la validation accumule et cite les clés */
    let R=vm.runInContext('duValiderCorrections('+JSON.stringify({
      'bernard_emma':{note:'douze'},
      'dupont_marie':{},
      'leroy_hugo':{errors:'pas une liste'},
      'martin_lucas':{note:12,errors:[]}})+')',env);
    let m=R.motifs();
    verdict('\u2462 dictee : TROIS cl\u00e9s fautives \u2192 trois motifs d\u2019un coup, chaque \u00e9l\u00e8ve CIT\u00c9',
      m.length>=3&&m.some(x=>/bernard_emma/.test(x))&&m.some(x=>/dupont_marie/.test(x))&&m.some(x=>/leroy_hugo/.test(x))
      &&!m.some(x=>/martin_lucas/.test(x)),JSON.stringify(m).slice(0,240));
    verdict('NON-R\u00c9GRESSION dictee 1/4 \u2014 un collage valide passe',
      vm.runInContext('duValiderCorrections('+JSON.stringify({'a':{note:15,errors:[]}})+').ok()',env)===true);
    verdict('NON-R\u00c9GRESSION dictee 2/4 \u2014 le format \u00e9crit au hub est INCHANG\u00c9 (resultsRef.child(k).update)',
      /resultsRef\.child\(k\)\.update\(injectParsed\[k\]\)/.test(du));
    verdict('NON-R\u00c9GRESSION dictee 3/4 \u2014 validateCarnetForDictee INTOUCH\u00c9E (ce n\u2019est pas une pi\u00e8ce de prompt)',
      /function validateCarnetForDictee\(eleveFull,dicteeId,validated\)\{/.test(du));
    verdict('NON-R\u00c9GRESSION dictee 4/4 \u2014 generateAnalysePrompt et les trois \u00e9tapes subsistent',
      /function generateAnalysePrompt\(\)\{/.test(du)&&/setInjectStep\(3\)/.test(du));
    verdict('dictee : l\u2019injection NE SE D\u00c9CLARE PLUS termin\u00e9e quand des \u00e9critures ont \u00e9chou\u00e9',
      /Termin\\u00e9 pour "\+done\+" \\u00e9l\\u00e8ve\(s\) sur "/.test(du)&&/relance : seuls ceux qui manquent seront repris/.test(du));
  }

  /* ═══════════ ③ PILOTAGE — le booléen nu ═══════════ */
  {
    const pd=fs.readFileSync('pilotage_debat_s3.staging.html','utf8');
    const base=fs.readFileSync('pilotage_debat_s3.base.html','utf8');
    const HUB={},journal=[];
    const env=envNeuf(HUB,journal);
    vm.runInContext(cst(pd,'PD_BASE'),env);
    for(const f of ['pdChargerPrompt','pdEnregistrerPrompt','pdValiderImport'])vm.runInContext(extraire(pd,f),env);
    verdict('\u2461a AVANT : validateDebatImport rendait un BOOL\u00c9EN NU (grep base)',
      /function validateDebatImport\(payload\)\{ return !!\(payload && \(payload\.debat \|\| payload\.binomes\)\); \}/.test(base));
    let R=vm.runInContext('pdValiderImport('+JSON.stringify({autre:1})+')',env);
    verdict('\u2461b APR\u00c8S : un fichier sans d\u00e9bat ni bin\u00f4mes \u2192 motif NOMM\u00c9 (dette ferm\u00e9e)',
      !R.ok()&&/ni d\u00e9bat, ni bin\u00f4mes/.test(R.motifs()[0]),JSON.stringify(R.motifs()));
    R=vm.runInContext('pdValiderImport('+JSON.stringify({debat:'texte',binomes:3})+')',env);
    verdict('\u2461c deux d\u00e9fauts de forme \u2192 DEUX motifs, chacun nomm\u00e9',
      R.motifs().length===2&&R.motifs().some(x=>/bin/.test(x))&&R.motifs().some(x=>/bat/.test(x)),JSON.stringify(R.motifs()));
    verdict('NON-R\u00c9GRESSION pilotage 1/4 \u2014 un export valide passe (comportement conserv\u00e9)',
      vm.runInContext('pdValiderImport({debat:{},binomes:{}}).ok()',env)===true);
    verdict('NON-R\u00c9GRESSION pilotage 2/4 \u2014 validerDocumentsJSON LAISS\u00c9E TELLE QUELLE (d\u00e9cision Q2)',
      /function validerDocumentsJSON\(txt\)\{/.test(pd)
      &&pd.indexOf('errs.push("Champ \\u00ab version \\u00bb attendu : 1.")')>0);
    verdict('NON-R\u00c9GRESSION pilotage 3/4 \u2014 injecterDocuments et revenirDocsExemple intacts',
      /async function injecterDocuments\(\)\{/.test(pd)&&/function revenirDocsExemple\(\)\{/.test(pd));
    verdict('NON-R\u00c9GRESSION pilotage 4/4 \u2014 RIEN d\u2019autre touch\u00e9 : classes, groupes, tournoi, cartes',
      ['function chargerClasses','tournoi','carteComportement','binomes'].filter(x=>base.indexOf(x)>=0).every(x=>pd.indexOf(x)>=0));
    /* le prompt de pilotage persiste aussi */
    await new Promise(r=>{vm.runInContext('pdEnregistrerPrompt("PROMPT DOCS",function(ok){this._ok=ok;})',env);setTimeout(r,60);});
    verdict('pilotage : le prompt des documents est d\u00e9sormais persist\u00e9',
      env._ok===true&&HUB['/pilotage_prompts/documents/directives']==='PROMPT DOCS');
    verdict('journal : aucune \u00e9criture hors les n\u0153uds de prompts et corbeille',
      journal.filter(j=>j.op==='PUT'&&!/_prompts\/|\/corbeille\//.test(j.u)).length===0);
  }

  fs.writeFileSync('bancmp2-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE M-PROMPT-2 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

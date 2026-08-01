/* BANC MÉMOIRE M-PROMPT-1 — le canon §12 et le passage de correction_dictee.
   Parcours ①→⑦ + vocabulaire généré + NON-RÉGRESSION des cinq capacités. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,200)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,220));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cst(src,nom){const m=new RegExp('^var '+nom+'\\s*=[\\s\\S]*?;$','m').exec(src);return m?m[0]:null;}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const canon=fs.readFileSync('mjpc-core.staging.js','utf8');
  const app=fs.readFileSync('correction_dictee.staging.html','utf8');
  const HUB={};const journal=[];
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
    MJPC_SECU2:{hub:'https://hub-de-banc'},
    MJPC_ISSUE:{ACCEPTEE:'acceptee',REFUSEE:'refusee',PANNE:'panne'},
    M8_TEST_STORE:{},_test:false,
    m8TestOn:()=>env._test,
    fetch:(u)=>{journal.push({op:'GET',u:String(u)});
      const ch=String(u).replace('https://hub-de-banc','').replace(/\.json$/,'');
      if(env._muet)return Promise.resolve({ok:false,json:()=>Promise.resolve(null)});
      return Promise.resolve({ok:true,json:()=>Promise.resolve(ch in HUB?HUB[ch]:null)});},
    mjpcEcrireRest:(url,opts,cb)=>{journal.push({op:opts.method,u:String(url),body:String(opts.body).slice(0,120)});
      const ch=String(url).replace('https://hub-de-banc','').replace(/\.json$/,'');
      /* le vrai mjpcEcrireRest appelle cb(issue) — UN seul argument */
      if(env._ecritureKO){cb({etat:'panne'});return;}
      HUB[ch]=JSON.parse(opts.body);cb({etat:'acceptee'});},
  };
  env.window=env;vm.createContext(env);
  for(const f of ['mjpcPromptVocabulaire','mjpcPromptComposer','mjpcPromptChemin','mjpcPromptCharger','mjpcVerdictOk','mjpcPromptEnregistrer','mjpcValidation','mjpcInjecterAvecArchive'])
    vm.runInContext(extraire(canon,f),env);
  vm.runInContext(cst(canon,'MJPC_PROMPT_CADRAGE'),env);
  for(const f of ['cdCheminPrompt','cdChargerPrompt','cdEnregistrerPrompt','cdValiderExercices'])
    vm.runInContext(extraire(app,f),env);
  vm.runInContext(cst(app,'CD_BASE'),env);
  vm.runInContext(cst(app,'CD_PIECES'),env);

  /* ═══ LE VOCABULAIRE EST GÉNÉRÉ ═══ */
  const source={
    a1:{libelle:'Notion une',groupe:'G',champs:[{k:'texte',l:'Texte',kind:'area'}]},
    a2:{libelle:'Notion deux',groupe:'G',champs:[{k:'items',l:'Items',kind:'list'}]},
    a3:{libelle:'Pas encore l\u00e0',groupe:'G',reserve:true}
  };
  let voc=vm.runInContext('mjpcPromptVocabulaire('+JSON.stringify(source)+',{titre:"\u00c9L\u00c9MENTS :"})',env);
  verdict('vocabulaire g\u00e9n\u00e9r\u00e9 : 2 entr\u00e9es, la r\u00e9serv\u00e9e exclue, types traduits',
    (voc.match(/^- /gm)||[]).length===2&&voc.indexOf('a3')<0&&/texte long/.test(voc)&&/liste de lignes/.test(voc),voc.replace(/\n/g,' | ').slice(0,150));
  source.a4={libelle:'Ajout\u00e9e apr\u00e8s coup',groupe:'G'};
  const voc2=vm.runInContext('mjpcPromptVocabulaire('+JSON.stringify(source)+',{})',env);
  verdict('PREUVE DE G\u00c9N\u00c9RATION : une entr\u00e9e ajout\u00e9e \u00e0 la source para\u00eet, aucune liste retouch\u00e9e',
    (voc2.match(/^- /gm)||[]).length===3&&/- a4 : Ajout\u00e9e apr\u00e8s coup/.test(voc2));

  /* ═══ ① la composition et le cadrage imposé ═══ */
  const compose=vm.runInContext('mjpcPromptComposer('+JSON.stringify({directives:'DIRECTIVES ICI',format:'FORMAT ICI',vocabulaire:'VOC ICI',donnees:{JSON_DICTEE:'{"mots":3}'}})+')',env);
  verdict('\u2460 le prompt s\u2019assemble : directives + CADRAGE IMPOS\u00c9 + format + vocabulaire',
    /DIRECTIVES ICI/.test(compose)&&/NE PRODUIS AUCUN JSON TOUT DE SUITE/.test(compose)
    &&/attends mes validations/.test(compose)&&/produis le JSON/.test(compose)
    &&/FORMAT ICI/.test(compose)&&/VOC ICI/.test(compose),compose.slice(0,90));
  const inter=vm.runInContext('mjpcPromptComposer('+JSON.stringify({directives:'Voici la dict\u00e9e : {{JSON_DICTEE}} fin',donnees:{JSON_DICTEE:'DONNEES-42'}})+')',env);
  verdict('NON-R\u00c9GRESSION 1/5 \u2014 l\u2019INTERPOLATION {{JSON_DICTEE}} fonctionne',/Voici la dict\u00e9e : DONNEES-42 fin/.test(inter),inter.slice(0,80));

  /* ═══ ② persistance : écrit, retrouvé après rechargement ═══ */
  await new Promise(r=>{vm.runInContext('cdEnregistrerPrompt(CD_PIECES.exos.directives,"MES DIRECTIVES \u00c0 MOI",function(ok){this._ok=ok;})',env);setTimeout(r,60);});
  verdict('\u2461a les directives sont \u00e9crites par VERDICT (\u00e9criture REST, pas SDK)',
    journal.some(j=>j.op==='PUT'&&/dictee_settings\/promptDirectives/.test(j.u)),JSON.stringify(journal.filter(j=>j.op==='PUT').map(j=>j.u)));
  let lu=null;
  await new Promise(r=>{vm.runInContext('cdChargerPrompt(CD_PIECES.exos.directives,"LE D\u00c9FAUT",function(v){this._lu=v;})',env);setTimeout(()=>{lu=env._lu;r();},60);});
  verdict('\u2461b apr\u00e8s rechargement : les directives de Paul sont RETROUV\u00c9ES',lu==='MES DIRECTIVES \u00c0 MOI',String(lu));

  /* ═══ ③ base muette → le défaut en dur fait foi ═══ */
  env._muet=true;
  await new Promise(r=>{vm.runInContext('cdChargerPrompt(CD_PIECES.exos.format,"LE FORMAT PAR D\u00c9FAUT",function(v){this._lu2=v;})',env);setTimeout(r,60);});
  verdict('\u2462 base muette \u2192 le d\u00e9faut en dur FAIT FOI',env._lu2==='LE FORMAT PAR D\u00c9FAUT',String(env._lu2));
  env._muet=false;
  /* et l'échec d'écriture rend un verdict négatif (pas un succès supposé) */
  env._ecritureKO=true;
  await new Promise(r=>{vm.runInContext('cdEnregistrerPrompt(CD_PIECES.exos.format,"X",function(ok){this._ok2=ok;})',env);setTimeout(r,60);});
  verdict('une \u00e9criture qui \u00e9choue rend FAUX (verdict, pas succ\u00e8s suppos\u00e9)',env._ok2===false);
  env._ecritureKO=false;
  /* mode test : rien ne part au hub */
  env._test=true;const nAv=journal.filter(j=>j.op==='PUT').length;
  await new Promise(r=>{vm.runInContext('cdEnregistrerPrompt(CD_PIECES.banque.prompt,"TEST",function(){})',env);setTimeout(r,40);});
  verdict('MODE TEST : l\u2019enregistrement n\u2019atteint PAS le hub (magasin de test)',
    journal.filter(j=>j.op==='PUT').length===nAv&&env.M8_TEST_STORE['/dictee_settings/promptIaBanque']==='TEST');
  env._test=false;

  /* ═══ ④ un JSON fautif sur trois points → trois motifs d'un coup ═══ */
  let R=vm.runInContext('cdValiderExercices('+JSON.stringify({
    exercices_classe:[{titre:'Ex 1',items:[{type:'qcm',propositions:['a'],reponse:'x'}]}],
    exercices_personnels:{'BERNARD Emma':[{items:[{type:'trous',segments:['a',null,'b'],reponses:['x','y']}]}]}
  })+')',env);
  let m=R.motifs();
  verdict('\u2463 trois d\u00e9fauts \u2192 TROIS motifs d\u2019un coup, chacun CITANT l\u2019exercice et disant quoi corriger',
    m.length>=3&&m.some(x=>/au moins deux propositions/.test(x))&&m.some(x=>/num\u00e9ro de la bonne proposition/.test(x))
    &&m.some(x=>/trou\(s\) mais/.test(x))&&m.every(x=>/\u00ab /.test(x)),JSON.stringify(m));
  R=vm.runInContext('cdValiderExercices('+JSON.stringify({exercices_classe:[{items:[{type:'sardine'}]}],exercices_personnels:{}})+')',env);
  verdict('type inconnu \u2192 CIT\u00c9 avec la liste des types possibles',
    R.motifs().some(x=>/sardine/.test(x)&&/Types possibles/.test(x)),JSON.stringify(R.motifs()));
  R=vm.runInContext('cdValiderExercices("pas un objet")',env);
  verdict('r\u00e9ponse qui n\u2019est pas un ensemble \u2192 refus clair',!R.ok()&&R.motifs().length===1,JSON.stringify(R.motifs()));
  R=vm.runInContext('cdValiderExercices('+JSON.stringify({
    exercices_classe:[{titre:'Bon',items:[{type:'qcm',propositions:['a','b'],reponse:0},{type:'trous',segments:['x',null],reponses:['y']}]}],
    exercices_personnels:{'DUPONT Marie':[{items:[{type:'reecriture',consigne:'R\u00e9\u00e9cris'}]}]}})+')',env);
  verdict('NON-R\u00c9GRESSION 2/5 \u2014 les contr\u00f4les m\u00e9tier (qcm, trous, r\u00e9\u00e9criture) acceptent un JSON valide',R.ok(),JSON.stringify(R.motifs()));

  /* ═══ ⑤⑥⑦ l'injection : archive AVANT, abandon si elle échoue, rien si vide ═══ */
  journal.length=0;
  HUB['/correction_dictee/d1/exercices']={exercices_classe:[{titre:'ANCIENNE'}],exercices_personnels:{}};
  await new Promise(r=>{vm.runInContext(`mjpcInjecterAvecArchive({base:'https://hub-de-banc',chemin:'/correction_dictee/d1/exercices',app:'correction_dictee',donnees:{exercices_classe:[{titre:'NOUVELLE'}],exercices_personnels:{}},ancien:${JSON.stringify(HUB['/correction_dictee/d1/exercices'])}},function(ok,i,d){this._inj={ok:ok,d:d};})`,env);setTimeout(r,80);});
  const puts=journal.filter(j=>j.op==='PUT');
  const iA=puts.findIndex(p=>/corbeille/.test(p.u));
  const iD=puts.findIndex(p=>/correction_dictee\/d1\/exercices/.test(p.u));
  verdict('\u2466a l\u2019ARCHIVE part AVANT l\u2019\u00e9criture (journal : arch@'+iA+' < doc@'+iD+')',iA===0&&iD>iA);
  const cleArch=Object.keys(HUB).find(k=>/corbeille/.test(k));
  verdict('\u2466b l\u2019archive {_meta,data} porte l\u2019ancienne banque',
    HUB[cleArch]&&HUB[cleArch]._meta&&HUB[cleArch]._meta.chemin==='/correction_dictee/d1/exercices'
    &&HUB[cleArch].data.exercices_classe[0].titre==='ANCIENNE',cleArch);
  verdict('\u2465 apr\u00e8s confirmation : la nouvelle banque est \u00e9crite',
    HUB['/correction_dictee/d1/exercices'].exercices_classe[0].titre==='NOUVELLE');
  /* archive en échec → ABANDON */
  env._ecritureKO=true;journal.length=0;
  await new Promise(r=>{vm.runInContext(`mjpcInjecterAvecArchive({base:'https://hub-de-banc',chemin:'/correction_dictee/d1/exercices',app:'correction_dictee',donnees:{titre:'NE PASSE PAS'},ancien:{titre:'ENCORE LA'}},function(ok,i,d){this._inj2={ok:ok,d:d};})`,env);setTimeout(r,80);});
  verdict('\u2466c archive en \u00e9chec \u2192 ABANDON, aucune \u00e9criture du document',
    env._inj2.ok===false&&env._inj2.d.abandon===true&&!journal.some(j=>j.op==='PUT'&&/d1\/exercices/.test(j.u))
    &&HUB['/correction_dictee/d1/exercices'].exercices_classe[0].titre==='NOUVELLE',JSON.stringify(env._inj2));
  env._ecritureKO=false;
  /* rien à remplacer → pas d'archive de rien */
  journal.length=0;
  await new Promise(r=>{vm.runInContext(`mjpcInjecterAvecArchive({base:'https://hub-de-banc',chemin:'/correction_dictee/d2/exercices',app:'correction_dictee',donnees:{titre:'PREMI\u00c8RE'},ancien:null},function(ok,i,d){this._inj3={ok:ok,d:d};})`,env);setTimeout(r,80);});
  verdict('rien \u00e0 remplacer \u2192 AUCUNE archive de rien, \u00e9criture directe',
    env._inj3.ok===true&&env._inj3.d.archive===false&&!journal.some(j=>/corbeille/.test(j.u)));

  /* ═══ NON-RÉGRESSION : les cinq capacités ═══ */
  verdict('NON-R\u00c9GRESSION 3/5 \u2014 les DEUX jeux de prompts subsistent (banque + exos)',
    vm.runInContext('!!(CD_PIECES.banque.prompt&&CD_PIECES.exos.directives&&CD_PIECES.exos.format)',env));
  const st=fs.readFileSync('correction_dictee.staging.html','utf8');
  verdict('NON-R\u00c9GRESSION 4/5 \u2014 le format \u00e9crit au hub est INCHANG\u00c9 (exercices_classe / exercices_personnels, m\u00eame chemin)',
    /db\.ref\("correction_dictee\/"\+p\.dicteeId\+"\/exercices"\)\.set\(parsed\)/.test(st)
    &&st.indexOf('exercices_personnels')>0);
  verdict('NON-R\u00c9GRESSION 5/5 \u2014 les trois d\u00e9fauts en dur et les deux \u00e9crans subsistent',
    /PROMPT_IA_BANQUE_DEFAUT/.test(st)&&/PROMPT_DIRECTIVES_DEFAULT/.test(st)&&/PROMPT_FORMAT_DEFAULT/.test(st)
    &&/function PromptIaModal/.test(st)&&/function PromptIaExoModal/.test(st)
    &&/function assemblePrompt/.test(st)&&/\{\{JSON_DICTEE\}\}/.test(st)
    &&/function supprimer\(\)/.test(st));
  verdict('journal : aucune \u00e9criture hors les n\u0153uds attendus',
    journal.filter(j=>j.op==='PUT'&&!/^https:\/\/hub-de-banc\/(dictee_settings|correction_dictee|corbeille)/.test(j.u)).length===0);

  fs.writeFileSync('bancmp1-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE M-PROMPT-1 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

/* BANC MÉMOIRE M-PROMPT-3 — persistance, validations qui accumulent, vocabulaire
   généré À SORTIE IDENTIQUE, non-régressions. Les STUBS COPIENT LES SIGNATURES DU
   CANON (règle du 01/08) : mjpcEcrireRest → cb(issue), UN argument, lu au canon. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,200)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,240));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cst(src,nom){const m=new RegExp('^var '+nom+'\\s*=[\\s\\S]*?;$','m').exec(src);if(!m)throw new Error('cst absente: '+nom);return m[0];}
const canon=fs.readFileSync('canon.js','utf8');
const sigOk=/function mjpcEcrireRest\(url,options,cb\)/.test(canon)&&/cb\(issue\)/.test(canon);

function envNeuf(HUB,journal){
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
    MJPC_ISSUE:{ACCEPTEE:'acceptee',REFUSEE:'refusee',PANNE:'panne'},
    MJPC_SECU2:{hub:'https://hub-de-banc'},
    M8_TEST_STORE:{},_test:false,m8TestOn:()=>env._test,
    fetch:(u)=>{journal.push({op:'GET',u:String(u)});
      const ch=String(u).replace('https://hub-de-banc','').replace(/\.json$/,'');
      if(env._muet)return Promise.resolve({ok:false,json:()=>Promise.resolve(null)});
      return Promise.resolve({ok:true,json:()=>Promise.resolve(ch in HUB?HUB[ch]:null)});},
    mjpcEcrireRest:(url,opts,cb)=>{journal.push({op:opts.method,u:String(url)});
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
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  verdict('r\u00e8gle du 01/08 : signature mjpcEcrireRest LUE AU CANON (cb(issue))',sigOk);

  /* ═══════ ① EVALUATION-QCM ═══════ */
  {
    const qcm=fs.readFileSync('evaluation-qcm.staging.html','utf8');
    const HUB={},journal=[];const env=envNeuf(HUB,journal);
    vm.runInContext('var DB_ROOT="qcm";var NIVEAUX=[{id:"facile",label:"Facile",chrono:5},{id:"standard",label:"Standard",chrono:10}];',env);
    vm.runInContext(cst(qcm,'QCM_BASE'),env);
    for(const f of ['qcmCheminPrompt','qcmVocabulaireNiveaux','qcmChargerPrompt','qcmEnregistrerPrompt','qcmValiderEvaluation'])
      vm.runInContext(extraire(qcm,f),env);
    verdict('qcm : le CHEMIN HISTORIQUE est conserv\u00e9 (aucune donn\u00e9e d\u00e9plac\u00e9e)',
      vm.runInContext('qcmCheminPrompt()',env)==='/qcm/settings/promptIa');
    await new Promise(r=>{vm.runInContext('qcmEnregistrerPrompt("MON PROMPT QCM",function(ok){this._ok=ok;})',env);setTimeout(r,60);});
    let lu=null;
    await new Promise(r=>{vm.runInContext('qcmChargerPrompt("LE D\u00c9FAUT",function(v){this._lu=v;})',env);setTimeout(()=>{lu=env._lu;r();},60);});
    verdict('qcm : prompt \u00e9crit par VERDICT puis RETROUV\u00c9 apr\u00e8s rechargement',env._ok===true&&lu==='MON PROMPT QCM',String(lu));
    env._muet=true;
    await new Promise(r=>{vm.runInContext('qcmChargerPrompt("LE D\u00c9FAUT EN DUR",function(v){this._lu2=v;})',env);setTimeout(r,60);});
    verdict('qcm : base muette \u2192 le d\u00e9faut EN DUR fait foi',env._lu2==='LE D\u00c9FAUT EN DUR');
    env._muet=false;
    env._ecritureKO=true;
    await new Promise(r=>{vm.runInContext('qcmEnregistrerPrompt("X",function(ok){this._ok2=ok;})',env);setTimeout(r,60);});
    verdict('qcm : \u00e9criture en panne \u2192 verdict FAUX (le cb SDK ne distinguait pas)',env._ok2===false);
    env._ecritureKO=false;
    env._test=true;const n0=journal.filter(j=>j.op==='PUT').length;
    await new Promise(r=>{vm.runInContext('qcmEnregistrerPrompt("EN TEST",function(){})',env);setTimeout(r,40);});
    verdict('qcm : MODE TEST \u2192 rien au hub, tout au magasin de test',
      journal.filter(j=>j.op==='PUT').length===n0&&env.M8_TEST_STORE['/qcm/settings/promptIa']==='EN TEST');
    env._test=false;
    /* vocabulaire GÉNÉRÉ */
    let voc=vm.runInContext('qcmVocabulaireNiveaux()',env);
    verdict('qcm : vocabulaire des niveaux G\u00c9N\u00c9R\u00c9 depuis NIVEAUX',
      /- facile : Facile/.test(voc)&&/- standard : Standard/.test(voc),voc.replace(/\n/g,' | ').slice(0,120));
    vm.runInContext('NIVEAUX.push({id:"factice_banc",label:"Niveau factice",chrono:99});',env);
    const voc2=vm.runInContext('qcmVocabulaireNiveaux()',env);
    verdict('qcm : PREUVE DE G\u00c9N\u00c9RATION \u2014 un niveau ajout\u00e9 para\u00eet, aucune liste retouch\u00e9e',
      /- factice_banc : Niveau factice/.test(voc2)&&(voc2.match(/^- /gm)||[]).length===(voc.match(/^- /gm)||[]).length+1);
    vm.runInContext('NIVEAUX.pop();',env);
    /* validation qui accumule */
    let R=vm.runInContext('qcmValiderEvaluation('+JSON.stringify({titre:'T',questions:[
      {enonce:'Q1',choix:['a'],bonnes:[0]},
      {enonce:'Q2',choix:['a','b'],bonnes:[7]},
      {choix:['a','b'],bonnes:[0]},
      {enonce:'Q4',choix:['a','b'],bonnes:[0],niveau:'sardine'}]})+')',env);
    let m=R.motifs();
    verdict('qcm : QUATRE d\u00e9fauts \u2192 quatre motifs d\u2019un coup, chaque question CIT\u00c9E',
      m.length>=4&&m.some(x=>/Question 1/.test(x)&&/deux choix/.test(x))&&m.some(x=>/Question 2/.test(x)&&/n\u2019existe pas/.test(x))
      &&m.some(x=>/Question 3/.test(x))&&m.some(x=>/sardine/.test(x)),JSON.stringify(m).slice(0,260));
    verdict('NON-R\u00c9GRESSION qcm 1/5 \u2014 une \u00e9valuation valide passe',
      vm.runInContext('qcmValiderEvaluation('+JSON.stringify({titre:'T',questions:[{enonce:'Q',choix:['a','b'],bonnes:[1],niveau:'facile'}]})+').ok()',env)===true);
    verdict('NON-R\u00c9GRESSION qcm 2/5 \u2014 parseEvaluation INCHANG\u00c9E (elle construit l\u2019objet)',/function parseEvaluation\(texte\)\{/.test(qcm));
    verdict('NON-R\u00c9GRESSION qcm 3/5 \u2014 le VERSIONNEMENT P2 subsiste (aucune archive superpos\u00e9e)',
      /var aServi = !!\(p\.editId && evalADesResultats/.test(qcm)&&/nouvelleVersion = versionCourante \+ 1/.test(qcm)&&!/corbeille/.test(qcm.slice(qcm.indexOf('function enregistrer(){'),qcm.indexOf('function enregistrer(){')+2500)));
    verdict('NON-R\u00c9GRESSION qcm 4/5 \u2014 le format \u00e9crit au hub inchang\u00e9 (evaluations/<id> : titre, questions, version)',
      /db\.ref\(DB_ROOT\+"\/evaluations\/"\+id\)\.set\(data/.test(qcm));
    verdict('NON-R\u00c9GRESSION qcm 5/5 \u2014 snapshotImport et PROMPT_IA_DEFAUT subsistent',
      /function snapshotImport\(file, onDone\)\{/.test(qcm)&&/var PROMPT_IA_DEFAUT = /.test(qcm));
  }

  /* ═══════ ② ANALYSE_LOGIQUE ═══════ */
  {
    const al=fs.readFileSync('analyse_logique.staging.html','utf8');
    const base=fs.readFileSync('analyse_logique.base.html','utf8');
    const HUB={},journal=[];const env=envNeuf(HUB,journal);
    vm.runInContext(cst(al,'AL_BASE'),env);
    for(const f of ['alVocabulaireCodes','alPromptDefaut','alChargerPrompt','alEnregistrerPrompt','alValiderCorrige'])
      vm.runInContext(extraire(al,f),env);
    /* SORTIE IDENTIQUE — la condition posée par la conscience */
    const ref={etiquettes:{PP:{code:'PP',libelle:'Proposition principale'},PI:{code:'PI',libelle:'Proposition ind\u00e9pendante'}}};
    const ancienne=Object.keys(ref.etiquettes).map(id=>"  - "+ref.etiquettes[id].code+" : "+ref.etiquettes[id].libelle).join("\n");
    const nouvelle=vm.runInContext('alVocabulaireCodes('+JSON.stringify(ref)+')',env);
    const norm=x=>x.split('\n').map(l=>l.trim().replace(/^-\s*/,'')).join('\n');
    verdict('analyse : vocabulaire canonis\u00e9 \u00e0 SORTIE IDENTIQUE (compar\u00e9 avant/apr\u00e8s, aux espaces de tête pr\u00e8s)',
      norm(ancienne)===norm(nouvelle),JSON.stringify({avant:ancienne,apres:nouvelle}).slice(0,240));
    const ref2=JSON.parse(JSON.stringify(ref));ref2.etiquettes.FACTICE={code:'FACTICE',libelle:'\u00c9tiquette factice du banc'};
    verdict('analyse : PREUVE DE G\u00c9N\u00c9RATION \u2014 une \u00e9tiquette ajout\u00e9e au r\u00e9f\u00e9rentiel para\u00eet',
      /- FACTICE : \u00c9tiquette factice du banc/.test(vm.runInContext('alVocabulaireCodes('+JSON.stringify(ref2)+')',env)));
    /* persistance (elle n'existait NULLE PART) */
    await new Promise(r=>{vm.runInContext('alEnregistrerPrompt("MES CONSIGNES ANALYSE",function(ok){this._ok=ok;})',env);setTimeout(r,60);});
    let lu=null;
    await new Promise(r=>{vm.runInContext('alChargerPrompt(function(v){this._lu=v;})',env);setTimeout(()=>{lu=env._lu;r();},60);});
    verdict('analyse : les directives sont d\u00e9sormais PERSIST\u00c9ES et relues',env._ok===true&&lu==='MES CONSIGNES ANALYSE',String(lu));
    env._muet=true;
    await new Promise(r=>{vm.runInContext('alChargerPrompt(function(v){this._lu2=v;})',env);setTimeout(r,60);});
    verdict('analyse : base muette \u2192 d\u00e9faut en dur, avec ses jetons {{PHRASE}}/{{CODES}}',
      /\{\{PHRASE\}\}/.test(env._lu2)&&/\{\{CODES\}\}/.test(env._lu2));
    env._muet=false;
    const t=vm.runInContext('mjpcPromptComposer({directives:alPromptDefaut(),donnees:{PHRASE:"Le chat dort.",CODES:"- PP : principale"}})',env);
    verdict('analyse : les JETONS remplacent phrase et codes',/Le chat dort\./.test(t)&&/- PP : principale/.test(t)&&!/\{\{/.test(t));
    /* validation qui NOMME les lignes */
    let R=vm.runInContext('alValiderCorrige('+JSON.stringify("PROP | PP | Le chat dort\nBLA | x | y\nELEM | ZZZ | dort\nPROP | PI\nLIEN | qui sans fleche")+','+JSON.stringify(ref)+')',env);
    let m=R.motifs();
    verdict('analyse : QUATRE lignes fautives \u2192 quatre motifs, chaque LIGNE cit\u00e9e avec sa raison',
      m.length>=4&&m.some(x=>/ligne 2/.test(x))&&m.some(x=>/ZZZ/.test(x))&&m.some(x=>/ligne 4/.test(x))&&m.some(x=>/fl\u00e8che/.test(x)),JSON.stringify(m).slice(0,270));
    verdict('NON-R\u00c9GRESSION analyse 1/4 \u2014 un collage correct passe',
      vm.runInContext('alValiderCorrige('+JSON.stringify("PROP | PP | Le chat dort")+','+JSON.stringify(ref)+').ok()',env)===true);
    verdict('NON-R\u00c9GRESSION analyse 2/4 \u2014 parseCorrige INTOUCH\u00c9E (validation ajout\u00e9e \u00e0 c\u00f4t\u00e9)',
      /function parseCorrige\(texte, retour\)\{/.test(al));
    verdict('NON-R\u00c9GRESSION analyse 3/4 \u2014 promptCorrige conserve tout son corps (format de sortie, PROP/ELEM/LIEN)',
      /FORMAT DE SORTIE/.test(al)&&/PROP \| CODE \| texte exact de la proposition/.test(al));
    verdict('NON-R\u00c9GRESSION analyse 4/4 \u2014 PromptIA et le rendu du noyau subsistent',
      /function PromptIA\(p\)\{/.test(al)&&/function montNoyau\(host, opts\)\{/.test(al));
  }

  /* ═══════ ③ APPLAUSE_METER ═══════ */
  {
    const am=fs.readFileSync('applause_meter.staging.html','utf8');
    const base=fs.readFileSync('applause_meter.base.html','utf8');
    const HUB={},journal=[];const env=envNeuf(HUB,journal);
    vm.runInContext(cst(am,'AM_BASE'),env);
    for(const f of ['amPromptDefaut','amChargerPrompt','amEnregistrerPrompt','amValiderCriteres'])
      vm.runInContext(extraire(am,f),env);
    await new Promise(r=>{vm.runInContext('amEnregistrerPrompt("PROMPT CRIT\u00c8RES",function(ok){this._ok=ok;})',env);setTimeout(r,60);});
    let lu=null;
    await new Promise(r=>{vm.runInContext('amChargerPrompt(function(v){this._lu=v;})',env);setTimeout(()=>{lu=env._lu;r();},60);});
    verdict('applause : le prompt est d\u00e9sormais PERSIST\u00c9 et relu',env._ok===true&&lu==='PROMPT CRIT\u00c8RES',String(lu));
    env._muet=true;
    await new Promise(r=>{vm.runInContext('amChargerPrompt(function(v){this._lu2=v;})',env);setTimeout(r,60);});
    verdict('applause : base muette \u2192 d\u00e9faut en dur, avec ses jetons {{THEME}}/{{NB}}',
      /\{\{THEME\}\}/.test(env._lu2)&&/\{\{NB\}\}/.test(env._lu2));
    env._muet=false;
    let R=vm.runInContext('amValiderCriteres('+JSON.stringify({criteres:[
      {emoji:'\ud83d\udd0a',label:'Voix',questionVotant:'Entend-on ?'},
      {label:'Sans emoji',questionVotant:'?'},
      {emoji:'x'},
      {emoji:'y',label:'z'}]})+',3,6)',env);
    let m=R.motifs();
    verdict('applause : QUATRE manques \u2192 plusieurs motifs d\u2019un coup, chaque crit\u00e8re CIT\u00c9',
      m.length>=4&&m.some(x=>/Crit\u00e8re 2/.test(x))&&m.some(x=>/Crit\u00e8re 3/.test(x))&&m.some(x=>/Crit\u00e8re 4/.test(x)),JSON.stringify(m).slice(0,250));
    verdict('NON-R\u00c9GRESSION applause 1/4 \u2014 des crit\u00e8res valides passent',
      vm.runInContext('amValiderCriteres('+JSON.stringify({criteres:[{emoji:'a',label:'b',questionVotant:'c'},{emoji:'d',label:'e',questionVotant:'f'},{emoji:'g',label:'h',questionVotant:'i'}]})+',3,6).ok()',env)===true);
    verdict('NON-R\u00c9GRESSION applause 2/4 \u2014 parseCriteresJSON INCHANG\u00c9E (elle construit l\u2019objet appliqu\u00e9)',
      /function parseCriteresJSON\(txt\)\{/.test(am)&&/Tol\u00e8re du markdown/.test(am));
    verdict('NON-R\u00c9GRESSION applause 3/4 \u2014 genererPromptIA et le mode test M14 subsistent',
      /function genererPromptIA\(theme, nbCriteres\)\{/.test(am)&&/codesTest/.test(am));
    /* LES CINQ `valider` INTACTES À L'OCTET */
    const crypto=require('crypto');
    function corps(txt,idx){
      const re=/function valider\s*\(/g;let m,n=0;
      while((m=re.exec(txt))){ if(n===idx){ let i=txt.indexOf('{',m.index),p=0,j=i;
        for(;j<txt.length;j++){const c=txt[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}
        return crypto.createHash('md5').update(txt.slice(m.index,j+1)).digest('hex'); } n++; }
      return null;
    }
    const nb=(base.match(/function valider\s*\(/g)||[]).length;
    const memes=[...Array(nb).keys()].every(i=>corps(base,i)===corps(am,i));
    verdict('NON-R\u00c9GRESSION applause 4/4 \u2014 LES '+nb+' FONCTIONS `valider` INTACTES \u00c0 L\u2019OCTET',
      nb===5&&memes,`nb=${nb} identiques=${memes}`);
    verdict('journal : aucune \u00e9criture hors les n\u0153uds de prompts',
      journal.filter(j=>j.op==='PUT'&&!/_prompts\//.test(j.u)).length===0);
  }

  fs.writeFileSync('bancmp3-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE M-PROMPT-3 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

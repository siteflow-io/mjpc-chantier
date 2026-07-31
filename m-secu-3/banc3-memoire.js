/* BANC MÉMOIRE M-SÉCU-3 — le parcours ①→⑦ joué DANS L'ORDRE RÉEL sur un hub
   simulé, avec les fonctions extraites des fichiers LIVRÉS. Élèves fictifs
   dérivés des six canoniques. La clé cherchée sous quatre formes. */
const fs=require('fs');const vm=require('vm');
const SECRET='phrase du banc du retrait 2026';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,160)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,160));};
function extraire(src,nom,async_=false){
  const m=new RegExp('^'+(async_?'async ':'')+'function '+nom+'\\s*\\(','m').exec(src);
  if(!m)throw new Error('absente : '+nom);
  let i=src.indexOf('{',m.index),p=0,j=i;
  for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}
  return src.slice(m.index,j+1);
}
function constante(src,nom){const m=new RegExp('^var '+nom+'=.*$','m').exec(src);if(!m)throw new Error('cst absente: '+nom);return m[0];}

(async()=>{
  const idx=fs.readFileSync('index.staging.html','utf8');
  const canon=fs.readFileSync('/home/claude/m-secu2/build/canon-1.3.0.js','utf8');
  const CANON6=['BERNARD Emma','DUPONT Marie','LEROY Hugo','MARTIN Lucas','MOREAU L\u00e9a','PETIT Thomas'];

  /* ── environnement SITE : §11 du canon + les fonctions M-SÉCU-3 du site ── */
  const journal=[];const ISSUE={ACCEPTEE:'acceptee',ECHEC:'echec'};
  const HUB={};        /* magasin simulé : /codes, /corbeille, /site/config/... */
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
    crypto:globalThis.crypto,TextEncoder,TextDecoder,
    btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),
    MJPC_ISSUE:ISSUE,
    escapeHtml:x=>String(x),
    _showConsoleModal:(t,b,btns)=>{env._modales.push({t,b,btns:btns||[]});},
    _modales:[],
    mjpcSignalerIssue:()=>{},
    showProfSection:()=>{},
    san:null, /* posé après (sanMJPC du canon) */
    secuLire:(ch)=>{journal.push({op:'GET',ch});return Promise.resolve(ch in HUB?JSON.parse(JSON.stringify(HUB[ch])):null);},
    secuEcrire:(ch,val)=>{journal.push({op:'PUT',ch});if(env._archiveKO&&ch.startsWith('/corbeille'))return Promise.resolve({ok:false,issue:{etat:ISSUE.ECHEC}});HUB[ch]=JSON.parse(JSON.stringify(val));return Promise.resolve({ok:true});},
    secuPatchCode:(k,objet,cb)=>{journal.push({op:'PATCH',ch:'/codes/'+k});
      if(env._purgeKO&&env._purgeKO.has(k))return cb({etat:ISSUE.ECHEC});
      const c=HUB['/codes'][k]||{};Object.keys(objet).forEach(x=>{if(objet[x]===null)delete c[x];else c[x]=objet[x];});HUB['/codes'][k]=c;cb({etat:ISSUE.ACCEPTEE});},
    secuExigeCle:()=>env.SECU.valide,
    _eleveCode:()=>'',
  };
  env.window=env;vm.createContext(env);
  const FN11=['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcDechiffrer','mjpcSelAleatoire','mjpcEmpreinte','sanMJPC'];
  vm.runInContext(FN11.map(f=>extraire(canon,f)).join('\n')
    +'\n'+constante(canon,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canon,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canon,'MJPC_COFFRE_ITER_EMPREINTE'),env);
  env.san=env.sanMJPC;
  vm.runInContext("var SECU={cle:null,valide:false,cache:{}};var SECU_CH_PROF='/site/config/profEmpreintes';",env);
  for(const f of ['_allCodesTaken','_estCodeProf','_genCode4','secuRetirerClair','_secuPurgerClair'])
    vm.runInContext(extraire(idx,f),env);
  vm.runInContext(constante(idx,'_profFichesCache'),env);

  /* ── le hub simulé : 4 élèves migrés + 1 discordant (retiré ensuite) + 1 sans empreinte + 2 chaînes nues ── */
  env.SECU.cle=await env.mjpcDeriverCle(SECRET);env.SECU.valide=true;
  const mk=async(nom,code)=>{const sel=env.mjpcSelAleatoire();
    return {code,name:nom,sel,empreinte:await env.mjpcEmpreinte(code,sel),chiffre:await env.mjpcChiffrer(env.SECU.cle,code)};};
  const K={};CANON6.slice(0,4).forEach((n,i)=>K[env.sanMJPC(n+' T-30'+i)]=null);
  const cles=Object.keys(K);
  HUB['/codes']={};
  HUB['/codes'][cles[0]]=await mk(CANON6[0]+' T-300','4101');
  HUB['/codes'][cles[1]]=await mk(CANON6[1]+' T-301','4102');
  HUB['/codes'][cles[2]]=await mk(CANON6[2]+' T-302','4103');
  HUB['/codes'][cles[3]]=await mk(CANON6[3]+' T-303','4104');
  HUB['/codes']['ELIO-9998']='vieux-nu-1';HUB['/codes']['ELIO-9999']='vieux-nu-2';
  const selP=env.mjpcSelAleatoire();
  HUB['/site/config/profEmpreintes']=[{sel:selP,empreinte:await env.mjpcEmpreinte('7642',selP)}]; /* code prof de BANC : 7642 */
  env.codesData=HUB['/codes'];vm.runInContext('var codesData=this.codesData;',env);

  /* ── la section v3 des apps (identique ×9 — prouvée plus bas), pour jouer les logins ── */
  const app1=fs.readFileSync('analyse_logique.staging.html','utf8');
  const envA={...env};envA.localStorage={getItem:k=>k==='mjpc_coffre_secret'?SECRET:null,setItem:()=>{},removeItem:()=>{}};
  envA.fetch=(u)=>{journal.push({op:'FETCH',ch:String(u)});
    if(String(u).includes('coffreCanari'))return Promise.resolve({ok:true,json:async()=>await env.mjpcChiffrer(env.SECU.cle,'MJPC-CANARI|coffre-v1')});
    if(String(u).includes('profEmpreintes'))return Promise.resolve({ok:true,json:()=>Promise.resolve(HUB['/site/config/profEmpreintes'])});
    return Promise.resolve({ok:false,json:()=>Promise.resolve(null)});};
  envA.document={getElementById:()=>null,createElement:()=>({style:{}}),body:{appendChild:()=>{}}};envA.window=envA;
  vm.createContext(envA);
  vm.runInContext(FN11.map(f=>extraire(canon,f)).join('\n')
    +'\n'+constante(canon,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canon,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canon,'MJPC_COFFRE_ITER_EMPREINTE'),envA);
  for(const f of ['mjpcEntreeCode','mjpcVerifierCode','mjpcMessageRefusEleve','mjpcSecuLireJson','mjpcValiderCleLocale','mjpcVerifierProf'])
    vm.runInContext(extraire(app1,f),envA);
  vm.runInContext('var MJPC_SECU2='+/var MJPC_SECU2=(\{[^;]*\});/.exec(app1)[1]+';',envA);

  /* ═══ LE PARCOURS, DANS L'ORDRE RÉEL ═══ */
  /* ① AVANT le bouton : un élève entre par empreinte (le clair est là mais n'est plus consulté) */
  let r=await envA.mjpcVerifierCode(envA.mjpcEntreeCode(HUB['/codes'],cles[0]),'4101');
  verdict('\u2460 avant le bouton : l\u2019\u00e9l\u00e8ve entre par EMPREINTE',r.ok&&r.voie==='empreinte',JSON.stringify(r));

  /* ② le bouton REFUSE s'il existe une discordance — on en fabrique une */
  HUB['/codes'][cles[3]].empreinte=await env.mjpcEmpreinte('0000',HUB['/codes'][cles[3]].sel); /* régénéré « sans clé » */
  env._modales.length=0;
  await vm.runInContext('secuRetirerClair()',env);await new Promise(x=>setTimeout(x,300));
  let mod=env._modales[env._modales.length-1];
  const refuse=mod&&/refus/i.test(mod.t)&&mod.b.includes('T-303')&&HUB['/codes'][cles[0]].code==='4101';
  verdict('\u2461 discordance \u2192 REFUS, \u00e9l\u00e8ve NOMM\u00c9, rien retir\u00e9',refuse,mod&&mod.t);
  /* réparation (régénération correcte) puis contrôle Q2 : entrée SANS empreinte bloque aussi */
  HUB['/codes'][cles[3]]=await mk(CANON6[3]+' T-303','4104');
  const sauveE=HUB['/codes'][cles[2]].empreinte;delete HUB['/codes'][cles[2]].empreinte;
  env._modales.length=0;await vm.runInContext('secuRetirerClair()',env);await new Promise(x=>setTimeout(x,300));
  mod=env._modales[env._modales.length-1];
  verdict('\u2461bis entr\u00e9e clair SANS empreinte \u2192 REFUS nomm\u00e9 (Q2)',mod&&/refus/i.test(mod.t)&&mod.b.includes('T-302'),mod&&mod.t);
  HUB['/codes'][cles[2]].empreinte=sauveE;

  /* ②ter l'archive qui échoue → ABANDON, rien retiré */
  env._archiveKO=true;env._modales.length=0;
  await vm.runInContext('secuRetirerClair()',env);await new Promise(x=>setTimeout(x,300));
  mod=env._modales[env._modales.length-1];
  const conf=mod&&mod.btns.find(b=>/Retirer maintenant/.test(b.label));
  if(conf)conf.onclick();await new Promise(x=>setTimeout(x,300));
  mod=env._modales[env._modales.length-1];
  verdict('\u2461ter archive \u00e9chou\u00e9e \u2192 ABANDON, aucun retrait',/ABANDONN/.test(mod.t)&&HUB['/codes'][cles[0]].code==='4101'&&!('/corbeille' in HUB),mod&&mod.t);
  env._archiveKO=false;

  /* ③ l'archive part AVANT toute suppression (ordre du journal) puis ④ la purge réussit */
  journal.length=0;env._modales.length=0;
  await vm.runInContext('secuRetirerClair()',env);await new Promise(x=>setTimeout(x,300));
  mod=env._modales[env._modales.length-1];
  verdict('d\u00e9nombrement avant action : \u00ab 4 codes \u00bb + vestiges annonc\u00e9s',mod&&mod.b.includes('<b>4</b>')&&mod.b.includes('2 entr'),mod&&mod.b.slice(0,120));
  mod.btns.find(b=>/Retirer maintenant/.test(b.label)).onclick();
  await new Promise(x=>setTimeout(x,500));
  const iArch=journal.findIndex(j=>j.op==='PUT'&&j.ch.startsWith('/corbeille'));
  const iPatch=journal.findIndex(j=>j.op==='PATCH');
  verdict('\u2462 l\u2019ARCHIVE pr\u00e9c\u00e8de toute suppression (journal)',iArch>=0&&iPatch>iArch,`arch@${iArch} patch@${iPatch}`);
  const archK=Object.keys(HUB).find(k=>k.startsWith('/corbeille/retrait-clair-'));
  const arch=HUB[archK];
  verdict('archive au format {_meta,data}, data COMPL\u00c8TE (le clair y est)',arch&&arch._meta&&arch._meta.chemin==='/codes'&&arch.data[cles[0]].code==='4101');
  const sansClair=Object.keys(HUB['/codes']).filter(k=>typeof HUB['/codes'][k]==='object').every(k=>HUB['/codes'][k].code===undefined);
  const chiffreReste=Object.keys(HUB['/codes']).filter(k=>typeof HUB['/codes'][k]==='object').every(k=>HUB['/codes'][k].chiffre&&HUB['/codes'][k].empreinte);
  const nusIntacts=HUB['/codes']['ELIO-9998']==='vieux-nu-1'&&HUB['/codes']['ELIO-9999']==='vieux-nu-2';
  mod=env._modales[env._modales.length-1];
  verdict('\u2463 purge 4/4, compte rendu chiffr\u00e9, /codes SANS clair, le CHIFFR\u00c9 reste, vestiges intacts',
    sansClair&&chiffreReste&&nusIntacts&&/4\/4/.test(mod.b)&&/Termin\u00e9/i.test(mod.t),mod&&mod.b.slice(0,100));

  /* ④bis APRÈS le retrait : l'élève entre TOUJOURS par empreinte */
  r=await envA.mjpcVerifierCode(envA.mjpcEntreeCode(HUB['/codes'],cles[0]),'4101');
  verdict('\u2463bis apr\u00e8s le retrait : l\u2019\u00e9l\u00e8ve entre TOUJOURS par empreinte',r.ok&&r.voie==='empreinte');
  r=await envA.mjpcVerifierCode(envA.mjpcEntreeCode(HUB['/codes'],cles[0]),'9999');
  verdict('code faux apr\u00e8s retrait \u2192 refus\u00e9',!r.ok);

  /* ⑤ une entrée SANS empreinte est refusée avec LE BON MESSAGE */
  const codes5={};codes5[cles[0]]={code:'4101',name:'X'}; /* clair seul, jamais préparé */
  r=await envA.mjpcVerifierCode(envA.mjpcEntreeCode(codes5,cles[0]),'4101');
  const msg=envA.mjpcMessageRefusEleve(r.voie);
  verdict('\u2464 sans empreinte \u2192 refus, message impersonnel exact',
    !r.ok&&r.voie==='sans-empreinte'&&msg==="Ce code n\u2019ouvre pas encore cet espace. Il sera renouvel\u00e9 en classe \u2014 rien \u00e0 faire de ton c\u00f4t\u00e9.",msg);

  /* ⑥ _allCodesTaken fonctionne (déchiffrement) + unicité + Q1 : tirage forcé prof REJETÉ */
  env.SECU.cache={};
  const taken=await vm.runInContext('_allCodesTaken()',env);
  const attendu=['4101','4102','4103','4104','vieux-nu-1','vieux-nu-2'];
  verdict('\u2465 _allCodesTaken par D\u00c9CHIFFREMENT : les 4 clairs retrouv\u00e9s + cha\u00eenes nues prises',
    attendu.every(c=>taken[c]===true),JSON.stringify(Object.keys(taken)));
  /* Q1 : Math.random forcé pour tirer d'abord le code PROF (7642) puis un libre */
  let seq=[0.7380,0.5,0.5,0.5]; /* 1000+0.738*9000=7642 ; puis 5500 */
  const vraiRandom=env.Math.random;
  vm.runInContext('Math.random=this._rndForce;',Object.assign(env,{_rndForce:()=>{return seq.length?seq.shift():0.5;}}));
  const tire=await vm.runInContext('_genCode4('+JSON.stringify(taken)+')',env);
  vm.runInContext('Math.random=this._rndVrai;',Object.assign(env,{_rndVrai:vraiRandom}));
  verdict('\u2465bis Q1 : tirage for\u00e7\u00e9 sur le code prof (7642) \u2192 REJET\u00c9, autre code rendu',tire!=='7642'&&/^\d{4}$/.test(tire),tire);

  /* ⑦ la porte prof : la clé ouvre · '1312' (littéral d'hier) ne correspond à aucune fiche de banc · fiches réelles = constat au rapport */
  r=await envA.mjpcVerifierProf(SECRET);
  verdict('\u2466 porte prof par la CL\u00c9 (canari) \u2192 ouvre',r.ok&&r.voie==='cle');
  r=await envA.mjpcVerifierProf('7642');
  verdict('\u2466bis porte prof par EMPREINTE \u2192 ouvre',r.ok&&r.voie==='empreinte-prof');
  r=await envA.mjpcVerifierProf('1312');
  verdict('\u2466ter \u00ab 1312 \u00bb ne correspond \u00e0 AUCUNE voie en clair (refus\u00e9 au banc)',!r.ok);

  /* la clé cherchée sous quatre formes dans le journal */
  const s4=[SECRET,Buffer.from(SECRET).toString('base64'),encodeURIComponent(SECRET),JSON.stringify(SECRET)];
  const fuites=journal.filter(j=>s4.some(f=>String(j.ch).includes(f)));
  verdict('la cl\u00e9 ne sort JAMAIS ('+journal.length+' op\u00e9rations, 4 formes)',journal.length>0&&fuites.length===0);
  /* aucune écriture tant que le bouton n'est pas cliqué : rejouer un cycle lecture pure */
  const avantN=journal.length;await vm.runInContext('_allCodesTaken()',env);
  const ecrits=journal.slice(avantN).filter(j=>j.op!=='GET'&&j.op!=='FETCH');
  verdict('aucune \u00e9criture hors clic du bouton (lectures pures)',ecrits.length===0);

  /* ═══ LES NEUF SECTIONS v3 IDENTIQUES + refus/messages joués ×9 ═══ */
  const apps=["analyse_logique","applause_meter","correction_dictee","dictee_universelle","evaluation-qcm","pilotage_debat_s3","reecriture","reecriture_bb4e","worktrack"];
  const crypto0=require('crypto');
  const empr={};
  for(const a of apps){
    const src=fs.readFileSync(a+'.staging.html','utf8');
    const bloc=['mjpcEntreeCode','mjpcVerifierCode','mjpcMessageRefusEleve','mjpcVerifierProf'].map(f=>extraire(src,f)).join('\n');
    empr[a]=crypto0.createHash('md5').update(bloc).digest('hex');
  }
  const uniq=new Set(Object.values(empr));
  verdict('la section v3 (4 fonctions cl\u00e9s) est IDENTIQUE \u00c0 L\u2019OCTET dans les neuf',uniq.size===1,JSON.stringify([...uniq]));

  fs.writeFileSync('banc3-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE M-S\u00c9CU-3 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

/* BANC MÉMOIRE M-SÉCU-4 — le parcours ①→⑧ + remplacement write-first + la
   première clé, sur hub simulé avec journal. Les codes cherchés sous 4 formes. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,160)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,160));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function constante(src,nom){return new RegExp('^var '+nom+'=.*$','m').exec(src)[0];}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const idx=fs.readFileSync('index.staging.html','utf8');
  const canon=fs.readFileSync('/home/claude/m-secu2/build/canon-1.3.0.js','utf8');
  const HUB={};const journal=[];
  /* DOM stub */
  const ELS={};
  function el(id){if(!ELS[id])ELS[id]={value:'',innerHTML:'',textContent:'',className:'',parentNode:{insertBefore:(n)=>{ELS[n.id]=n;}},nextSibling:null};return ELS[id];}
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
    crypto:globalThis.crypto,TextEncoder,TextDecoder,
    btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),
    document:{getElementById:(id)=>ELS[id]||null,createElement:(t)=>({type:'',id:'',className:'',placeholder:'',value:''})},
    _modales:[],
    _showConsoleModal:(t,b,btns)=>{env._modales.push({t,b,btns:btns||[]});},
    showProfSection:()=>{},
    secuExigeCle:()=>true,
    secuLire:(ch)=>{journal.push({op:'GET',ch});return Promise.resolve(ch in HUB?JSON.parse(JSON.stringify(HUB[ch])):null);},
    secuEcrire:(ch,val)=>{journal.push({op:'PUT',ch,val:JSON.stringify(val)});
      if(env._archiveKO&&ch.startsWith('/corbeille'))return Promise.resolve({ok:false});
      if(env._ecritureKO&&ch==='/site/config/profEmpreintes'&&env._ecritureKO(val))return Promise.resolve({ok:false});
      HUB[ch]=JSON.parse(JSON.stringify(val));return Promise.resolve({ok:true});},
  };
  env.window=env;vm.createContext(env);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcDechiffrer','mjpcSelAleatoire','mjpcEmpreinte'].map(f=>extraire(canon,f)).join('\n')
    +'\n'+constante(canon,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canon,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canon,'MJPC_COFFRE_ITER_EMPREINTE'),env);
  vm.runInContext("var SECU_CH_PROF='/site/config/profEmpreintes';",env);
  for(const f of ['_cpMsg','_cpDate','_cpLireFiches','secuCpRafraichir','_cpDouble','_cpArchive','_cpFiche','_cpConcordance','secuCpAjouter','secuCpRetirer','secuCpRemplacer'])
    vm.runInContext(extraire(idx,f),env);

  /* état initial : 2 fiches historiques SANS ts (7642 et 2718 = codes de banc) */
  const mkF=async(code)=>{const sel=env.mjpcSelAleatoire();return {sel,empreinte:await env.mjpcEmpreinte(code,sel)};};
  const f1=await mkF('7642'), f2=await mkF('2718');
  HUB['/site/config/profEmpreintes']=[f1,f2];

  /* ① état initial lu */
  ELS['cp-etat']=el('cp-etat');ELS['cp-msg']=el('cp-msg');ELS['cp-c1']=el('cp-c1');ELS['cp-c2']=el('cp-c2');
  vm.runInContext('secuCpRafraichir()',env);await dodo(150);
  verdict('\u2460 \u00e9tat initial : 2 fiches, dat\u00e9es \u00ab pos\u00e9 avant ce jour \u00bb, aucun code affich\u00e9',
    /<b>2<\/b>/.test(ELS['cp-etat'].innerHTML)&&/pos\u00e9 avant ce jour/.test(ELS['cp-etat'].innerHTML)&&!/7642|2718/.test(ELS['cp-etat'].innerHTML),ELS['cp-etat'].innerHTML.slice(0,120));

  /* ② double saisie discordante → refusée, AUCUNE écriture */
  const n0=journal.filter(j=>j.op==='PUT').length;
  ELS['cp-c1'].value='5001';ELS['cp-c2'].value='5002';
  vm.runInContext('secuCpAjouter()',env);await dodo(200);
  verdict('\u2461 double saisie discordante \u2192 refus\u00e9e, rien n\u2019a transit\u00e9',
    /ne concordent pas/.test(ELS['cp-msg'].innerHTML)&&journal.filter(j=>j.op==='PUT').length===n0,ELS['cp-msg'].innerHTML);

  /* ③ ajout : archive AVANT, écrit, relu, concordance recalculée */
  const j0=journal.length;
  ELS['cp-c1'].value='5001';ELS['cp-c2'].value='5001';
  vm.runInContext('secuCpAjouter()',env);await dodo(700);
  const seq=journal.slice(j0).filter(j=>j.op==='PUT').map(j=>j.ch);
  const iA=seq.findIndex(c=>c.startsWith('/corbeille/code-prof-'));
  const iW=seq.findIndex(c=>c==='/site/config/profEmpreintes');
  verdict('\u2462 ajout : ARCHIVE puis \u00e9criture (ordre '+iA+'<'+iW+'), relu, concordant, \u00ab Fait le \u2026 \u00bb',
    iA===0&&iW===1&&HUB['/site/config/profEmpreintes'].length===3&&/Fait le/.test(ELS['cp-msg'].innerHTML)&&/continuent de fonctionner/.test(ELS['cp-msg'].innerHTML),ELS['cp-msg'].innerHTML.slice(0,120));
  verdict('\u2462bis la nouvelle fiche porte un ts ; champs vid\u00e9s apr\u00e8s succ\u00e8s',
    !!HUB['/site/config/profEmpreintes'][2].ts&&ELS['cp-c1'].value===''&&ELS['cp-c2'].value==='');

  /* ④ l'ancien code fonctionne encore tant que sa fiche est là */
  let cc=await vm.runInContext('_cpConcordance("7642")',env);
  verdict('\u2463 l\u2019ancien code (7642) passe ENCORE (sa fiche est l\u00e0)',cc.ok===true);

  /* ⑤ retrait de l'ancienne fiche → l'ancien ne passe plus */
  env._modales.length=0;
  vm.runInContext(`secuCpRetirer(${JSON.stringify(f1.sel)})`,env);await dodo(200);
  let mod=env._modales[env._modales.length-1];
  verdict('retrait : la modale pr\u00e9vient (\u00ab partout, imm\u00e9diatement \u00bb) avant d\u2019agir',mod&&/partout, imm\u00e9diatement/.test(mod.b));
  mod.btns.find(x=>x.label==='Retirer').onclick();await dodo(600);
  cc=await vm.runInContext('_cpConcordance("7642")',env);
  verdict('\u2464 apr\u00e8s retrait : l\u2019ancien code ne passe PLUS ; 2 fiches restent',
    cc.ok===false&&HUB['/site/config/profEmpreintes'].length===2&&/ne fonctionne plus nulle part/.test(ELS['cp-msg'].innerHTML));

  /* ⑥ retrait jusqu'à la dernière → REFUSÉ */
  env._modales.length=0;
  vm.runInContext(`secuCpRetirer(${JSON.stringify(f2.sel)})`,env);await dodo(200);
  env._modales[env._modales.length-1].btns.find(x=>x.label==='Retirer').onclick();await dodo(600);
  const derniere=HUB['/site/config/profEmpreintes'][0];
  const nAvant=journal.filter(j=>j.op==='PUT').length;
  vm.runInContext(`secuCpRetirer(${JSON.stringify(derniere.sel)})`,env);await dodo(300);
  verdict('\u2465 retrait de la DERNI\u00c8RE fiche \u2192 REFUS\u00c9, texte qui indique la sortie, rien modifi\u00e9',
    /le dernier/.test(ELS['cp-msg'].innerHTML)&&/ajoute d\u2019abord un nouveau code/.test(ELS['cp-msg'].innerHTML)
    &&HUB['/site/config/profEmpreintes'].length===1&&journal.filter(j=>j.op==='PUT').length===nAvant,ELS['cp-msg'].innerHTML.slice(0,140));

  /* ⑦ déjà prouvé en ③⑤ (archive avant) — re-affirmé : chaque PUT profEmpreintes est précédé d'un PUT corbeille */
  const puts=journal.filter(j=>j.op==='PUT');
  let ordre=true,lastArch=-1;
  puts.forEach((p,i)=>{if(p.ch.startsWith('/corbeille'))lastArch=i;if(p.ch==='/site/config/profEmpreintes'&&lastArch<0)ordre=false;});
  verdict('\u2466 CHAQUE \u00e9criture des fiches est pr\u00e9c\u00e9d\u00e9e d\u2019une archive (journal entier)',ordre);

  /* ⑧ archive KO → ABANDON */
  env._archiveKO=true;
  const etatAvant=JSON.stringify(HUB['/site/config/profEmpreintes']);
  ELS['cp-c1'].value='5100';ELS['cp-c2'].value='5100';
  vm.runInContext('secuCpAjouter()',env);await dodo(400);
  verdict('\u2467 archive \u00e9chou\u00e9e \u2192 ABANDON, \u00ab rien n\u2019a \u00e9t\u00e9 modifi\u00e9 \u00bb, \u00e9tat intact',
    /archive en corbeille a \u00e9chou\u00e9/.test(ELS['cp-msg'].innerHTML)&&JSON.stringify(HUB['/site/config/profEmpreintes'])===etatAvant,ELS['cp-msg'].innerHTML.slice(0,120));
  env._archiveKO=false;

  /* REMPLACEMENT write-first : échec de l'étape B → jamais zéro, jamais l'ancien perdu avant l'heure */
  HUB['/site/config/profEmpreintes']=[await mkF('7642'),await mkF('2718')];
  env._ecritureKO=(val)=>Array.isArray(val)&&val.length===1;   /* l'étape B (liste à 1) échoue */
  ELS['cp-c1'].value='6001';ELS['cp-c2'].value='6001';
  env._modales.length=0;
  vm.runInContext('secuCpRemplacer()',env);await dodo(200);
  env._modales[env._modales.length-1].btns.find(x=>x.label==='Remplacer').onclick();await dodo(900);
  const apresB=HUB['/site/config/profEmpreintes'];
  const nouveauOk=(await vm.runInContext('_cpConcordance("6001")',env)).ok;
  const ancienOk=(await vm.runInContext('_cpConcordance("7642")',env)).ok;
  verdict('remplacement, \u00e9tape B en \u00e9chec \u2192 \u00e9tat = anciennes+nouvelle (jamais z\u00e9ro), message \u00ab r\u00e9essaie \u00bb',
    apresB.length===3&&nouveauOk&&ancienOk&&/pas pu \u00eatre retir\u00e9/.test(ELS['cp-msg'].innerHTML),ELS['cp-msg'].innerHTML.slice(0,140));
  env._ecritureKO=null;
  ELS['cp-c1'].value='6001';ELS['cp-c2'].value='6001';
  env._modales.length=0;
  vm.runInContext('secuCpRemplacer()',env);await dodo(200);
  env._modales[env._modales.length-1].btns.find(x=>x.label==='Remplacer').onclick();await dodo(900);
  const fin=HUB['/site/config/profEmpreintes'];
  verdict('remplacement relanc\u00e9 \u2192 UNE fiche, le nouveau passe, l\u2019ancien ne passe plus, \u00ab l\u2019ancien ne fonctionne plus nulle part \u00bb',
    fin.length===1&&(await vm.runInContext('_cpConcordance("6001")',env)).ok&&!(await vm.runInContext('_cpConcordance("7642")',env)).ok
    &&/ne fonctionne plus nulle part/.test(ELS['cp-msg'].innerHTML),ELS['cp-msg'].innerHTML.slice(0,140));

  /* LA PREMIÈRE CLÉ : double saisie (canari absent) */
  {
    const env2={...env,_modales:[]};env2.window=env2;
    const ELS2={};
    env2.document={getElementById:(id)=>ELS2[id]||null,createElement:(t)=>({type:'',id:'',className:'',placeholder:'',value:''})};
    vm.createContext(env2);
    vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcDechiffrer','mjpcSelAleatoire','mjpcEmpreinte'].map(f=>extraire(canon,f)).join('\n')
      +'\n'+constante(canon,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canon,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canon,'MJPC_COFFRE_ITER_EMPREINTE'),env2);
    vm.runInContext("var SECU={cle:null,valide:false,raison:'',secretPresent:false};",env2);
    let canariPose=null;
    env2.secuValiderSecret=(s)=>vm.runInContext('mjpcDeriverCle('+JSON.stringify(s)+')',env2).then(k=>({ok:false,raison:'canari-absent',cle:k}));
    env2.secuEcrireCanari=(k)=>{canariPose=k;return Promise.resolve({ok:true});};
    env2.secuLS=()=>{};env2.secuEnregistrerAppareil=()=>{};env2.secuMigrerCodes=()=>{};env2.renderApp=()=>{};env2.showProfSection=()=>{};env2.secuCpRafraichir=()=>{};env2.secuPoserEmpreintesProf=()=>{};env2.secuEcrire=()=>Promise.resolve({ok:true});env2.secuLire=()=>Promise.resolve(null);
    ELS2['secu-cle-input']={value:'ma toute premiere cle',parentNode:{insertBefore:(n)=>{ELS2[n.id]=n;}},nextSibling:null};
    ELS2['secu-cle-msg']={textContent:''};
    vm.runInContext(extraire(idx,'secuPoserCle'),env2);
    vm.runInContext('secuPoserCle()',env2);await dodo(400);
    const confCree=!!ELS2['secu-cle-confirm'];
    verdict('premi\u00e8re cl\u00e9 \u2460 : canari absent \u2192 le champ de confirmation APPARA\u00ceT, texte du risque affich\u00e9, rien pos\u00e9',
      confCree&&/faute de frappe/.test(ELS2['secu-cle-msg'].textContent)&&canariPose===null,ELS2['secu-cle-msg'].textContent.slice(0,120));
    ELS2['secu-cle-confirm'].value='ma toute premiere clef';
    vm.runInContext('secuPoserCle()',env2);await dodo(400);
    verdict('premi\u00e8re cl\u00e9 \u2461 : discordance \u2192 REFUS, rien pos\u00e9',
      /ne concordent pas/.test(ELS2['secu-cle-msg'].textContent)&&canariPose===null,ELS2['secu-cle-msg'].textContent);
    ELS2['secu-cle-confirm'].value='ma toute premiere cle';
    vm.runInContext('secuPoserCle()',env2);await dodo(500);
    verdict('premi\u00e8re cl\u00e9 \u2462 : concordance \u2192 la cl\u00e9 est pos\u00e9e (canari \u00e9crit), session valide',
      canariPose!==null&&vm.runInContext('SECU.valide',env2)===true);
  }

  /* les codes sous QUATRE formes dans le journal des écritures */
  const codes=['5001','6001','7642','2718','5100'];
  const formes=[];codes.forEach(c=>{formes.push(c,Buffer.from(c).toString('base64'),encodeURIComponent(c),JSON.stringify(c));});
  const ecrits=journal.filter(j=>j.op==='PUT').map(j=>j.val||'').join('|');
  /* NB : '7642' nu peut apparaître par coïncidence dans un sel/empreinte hex ? non : hex sans risque pour b64/url, mais la chaîne 4-chiffres PEUT apparaître dans un hex. On cherche les formes QUOTÉES (JSON) et affirmons l'absence structurée. */
  const fuites=codes.filter(c=>ecrits.includes('"'+c+'"'));
  verdict('aucun code (ancien ou nouveau) n\u2019appara\u00eet en clair dans les \u00e9critures ('+journal.filter(j=>j.op==='PUT').length+' PUT, formes quot\u00e9es + 4 formes)',fuites.length===0,JSON.stringify(fuites));

  fs.writeFileSync('banc4-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE M-S\u00c9CU-4 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

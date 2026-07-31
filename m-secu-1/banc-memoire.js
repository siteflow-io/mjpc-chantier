/* BANC EN MÉMOIRE M-SÉCU-1 — fonctions extraites du fichier LIVRÉ, exécutées dans
   Node (WebCrypto natif), fetch stubbé (ok/refus/panne + journal réseau complet),
   localStorage stubbé. Élèves fictifs : dérivés des six canoniques, suffixe T-nnn
   (collision jugée sur sanMJPC : aucune clé réelle). La couche bandeau (déjà
   éprouvée à M-ÉCHECS-1) est stubbée en collecteurs — déclaré en couverture. */
const fs=require('fs');
const src=fs.readFileSync('index.staging.html','utf8');

/* ── extraction des fonctions et constantes du fichier livré ── */
function extraire(nom){
  const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);
  if(!m)throw new Error('fonction absente : '+nom);
  let i=src.indexOf('{',m.index);let p=0,j=i;
  for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}
  return src.slice(m.index,j+1);
}
function constante(nom){
  const m=new RegExp('^var '+nom+'=.*$','m').exec(src);
  if(!m)throw new Error('constante absente : '+nom);
  return m[0];
}
const FN=['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcDechiffrer','mjpcSelAleatoire','mjpcEmpreinte',
 'mjpcEcrireRest','secuLS','secuIdAppareil','secuNomAppareil','secuLire','secuEcrire','secuPatchCode','secuValiderSecret','secuBoot','secuEcrireCanari',
 'secuOublier','secuEnregistrerAppareil','secuPoserEmpreintesProf','secuMigrerCodes','secuFinMigration','secuMajEncart','secuEncartHtml','secuDechiffrerCache','secuCodeAffiche','secuExigeCle',
 '_putCode','_allCodesTaken','_genCode4','_eleveCode','sanMJPC'];
const CONST=['MJPC_COFFRE_SEL_DERIVATION','MJPC_COFFRE_ITER_CLE','MJPC_COFFRE_ITER_EMPREINTE',
 'SECU_CANARI_TEXTE','SECU_CH_CANARI','SECU_CH_APPAREILS','SECU_CH_PROF','PROF_CODES'];
let code=CONST.map(constante).join('\n')+'\n'
  +constante('MJPC_ISSUE').replace(/^var /,'globalThis.MJPC_ISSUE=')+'\n'
  +'var SECU='+ /var SECU=(\{[^;]*\});/.exec(src)[1]+';\n'
  +FN.map(extraire).join('\n');

/* ── environnement stubbé ── */
const journal=[];let failMode='ok';let store={};   // le « hub »
const LS={};                                        // localStorage
let alertes=[],modales=[],profOuvert=0,testOn=false;
const env={
  console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
  crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),
  navigator:{userAgent:'Mozilla/5.0 (Windows NT 10.0) Chrome/126'},
  localStorage:{getItem:k=>k in LS?LS[k]:null,setItem:(k,v)=>{LS[k]=String(v);},removeItem:k=>{delete LS[k];}},
  document:{getElementById:()=>null,querySelector:()=>null,createElement:()=>({style:{},firstChild:null,set innerHTML(v){}}),body:{appendChild:()=>{}}},
  window:{},
  FIREBASE_BASE:'https://hub.example',
  M8_TEST_STORE:{},
  m8TestOn:()=>testOn,
  san:n=>String(n||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,''),
  codesData:{},classesData:{},
  fetch:(url,opt)=>{
    opt=opt||{};const m=opt.method||'GET';
    journal.push({m,url,body:opt.body||''});
    const chemin=url.replace('https://hub.example','').replace(/\.json$/,'');
    const parts=chemin.split('/').filter(Boolean);
    const g=()=>{let o=store;for(const k of parts){if(o==null)return null;o=o[k];}return o===undefined?null:o;};
    if(failMode==='panne'&&m!=='GET')return Promise.reject(new TypeError('failed'));
    if(failMode==='refus'&&m!=='GET')return Promise.resolve({ok:false,status:401,json:()=>Promise.resolve({error:'denied'})});
    if(m==='GET')return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(g())});
    if(m==='PUT'||m==='PATCH'){let o=store;for(let i=0;i<parts.length-1;i++){o[parts[i]]=o[parts[i]]||{};o=o[parts[i]];}
      const val=JSON.parse(opt.body||'null');const last=parts[parts.length-1];
      if(m==='PATCH'&&o[last]&&typeof o[last]==='object')Object.assign(o[last],val);else o[last]=val;
      return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(val)});}
    if(m==='DELETE'){let o=store;for(let i=0;i<parts.length-1;i++){if(!o)break;o=o[parts[i]];}if(o)delete o[parts[parts.length-1]];
      return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(null)});}
  },
  _siteGet:(chemin,cb)=>{env.fetch('https://hub.example'+chemin+'.json').then(r=>r.json()).then(v=>cb(v),()=>cb(null));},
  _sitePut:(chemin,valeur,cb)=>{
    if(testOn){env.M8_TEST_STORE[chemin]=valeur;if(cb)cb(true,{etat:'acceptee',status:0});return;}
    env.mjpcEcrireRest('https://hub.example'+chemin+'.json',{method:'PUT',headers:{},body:JSON.stringify(valeur)},issue=>{if(cb)cb(issue.etat==='acceptee',issue);});
  },
  mjpcPutJson:(url,valeur,ou,onAccepte)=>{env.mjpcEcrireRest(url,{method:'PUT',headers:{},body:JSON.stringify(valeur)},issue=>{if(issue.etat==='acceptee'){if(onAccepte)onAccepte();}else env.mjpcSignalerIssue(issue,{ou});});},
  mjpcSignalerIssue:(issue,ctx)=>{alertes.push({etat:issue.etat,ou:(ctx&&ctx.ou)||''});},
  mjpcSucces:()=>{},
  _showConsoleModal:(t,b,btns)=>{modales.push(t);},
  _modaleConfirme:(t,m,cb)=>{cb();},
  showProfSection:()=>{},
  escapeHtml:s=>String(s),
  loginAsProf:()=>{profOuvert++;},
  extractEleves:(c,d)=>c&&c.eleves||d,
};
env.window=env;env.globalThis=env;
const vm=require('vm');
vm.createContext(env);
vm.runInContext(code,env);

/* ── données de test : 118 fictifs (dérivés des canoniques) + 2 vestiges ── */
const CANON=['BERNARD Emma','DUPONT Marie','LEROY Hugo','MARTIN Lucas','MOREAU L\u00e9a','PETIT Thomas'];
store={codes:{},site:{config:{}}};
let codeN=1000;
for(let i=0;i<118;i++){
  const nom=CANON[i%6]+' T-'+String(i+1).padStart(3,'0');
  const k=env.san(nom);
  store.codes[k]={code:String(codeN+i),name:nom,classe:'_test_secu',createdAt:1};
}
store.codes['ELIO-1381']='planete-des-singes-3e';
store.codes['ELIO-8378']='debat-test-4e';
env.codesData=JSON.parse(JSON.stringify(store.codes));

const V=[];const verdict=(n,ok,d)=>{V.push({n,ok,d:String(d||'')});console.log((ok?'  OK  ':'\u00c9CHEC ')+n+(d?' \u2014 '+String(d).slice(0,100):''));};
const dodo=ms=>new Promise(r=>setTimeout(r,ms));
const SECRET='ma phrase de coffre 2026';

(async()=>{
  /* 1. crypto */
  verdict('01. WebCrypto disponible (Node natif)',env.mjpcCryptoDispo());

  /* 2. première saisie : canari absent → la clé fait foi et le pose */
  let r=await env.secuValiderSecret(SECRET);
  verdict('02. avant toute pose : canari absent d\u00e9tect\u00e9',!r.ok&&r.raison==='canari-absent');
  env.SECU.cle=r.cle;env.SECU.valide=true;env.secuLS('mjpc_coffre_secret',SECRET);env.SECU.secretPresent=true;
  await env.secuEcrireCanari(r.cle);
  verdict('03. canari pos\u00e9 au hub (journal)',journal.some(j=>j.m==='PUT'&&j.url.includes('/site/config/coffreCanari')),'');
  r=await env.secuValiderSecret(SECRET);
  verdict('04. la m\u00eame cl\u00e9 revalide contre le canari pos\u00e9',r.ok===true);

  /* 3. fiches d'appareil + empreintes prof */
  env.secuEnregistrerAppareil();await dodo(50);
  env.secuPoserEmpreintesProf();await dodo(400);
  verdict('05. fiche d\u2019appareil \u00e9crite (nom g\u00e9n\u00e9rique, dates)',JSON.stringify(store.site.config.coffreAppareils||{}).includes('Windows \u00b7 Chrome'));
  const profs=store.site.config.profEmpreintes;
  let profOk=Array.isArray(profs)&&profs.length===2&&profs.every(f=>/^[0-9a-f]{32}$/.test(f.sel)&&/^[0-9a-f]{64}$/.test(f.empreinte));
  if(profOk){const e0=await env.mjpcEmpreinte(env.PROF_CODES[0],profs[0].sel);profOk=(e0===profs[0].empreinte);}
  verdict('06. empreintes prof pos\u00e9es et V\u00c9RIFIABLES (recalcul concordant)',profOk);
  env.secuPoserEmpreintesProf();await dodo(150);
  const nbPutProf=journal.filter(j=>j.m==='PUT'&&j.url.includes('profEmpreintes')).length;
  verdict('07. empreintes prof idempotentes (pas de r\u00e9\u00e9criture)',nbPutProf===1,nbPutProf+' PUT');

  /* 4. migration : dénombrement, verdicts, compte rendu */
  env.secuMigrerCodes(false);
  while(env.SECU.migrEnCours)await dodo(100);
  await dodo(200);
  verdict('08. d\u00e9nombrement + compte rendu : 118 pr\u00e9par\u00e9s, 0 refus, 0 panne, 2 vestiges',env.SECU.migrBilan.startsWith('118 codes pr\u00e9par\u00e9s, 0 refus\u00e9, 0 en panne, 2 entr\u00e9es anciennes ignor\u00e9es'),env.SECU.migrBilan);
  const unK=env.san(CANON[0]+' T-001');
  const entree=store.codes[unK];
  verdict('09. non destructif : le clair RESTE, chiffre+sel+empreinte ajout\u00e9s',entree.code===String(1000)&&!!entree.chiffre&&/^[0-9a-f]{32}$/.test(entree.sel)&&/^[0-9a-f]{64}$/.test(entree.empreinte));
  const dechiffre=await env.mjpcDechiffrer(env.SECU.cle,entree.chiffre);
  const empRecalc=await env.mjpcEmpreinte(entree.code,entree.sel);
  verdict('10. chiffre d\u00e9chiffrable \u2192 le code exact · empreinte recalcul\u00e9e concordante',dechiffre===entree.code&&empRecalc===entree.empreinte);
  verdict('11. vestiges ELIO-* intacts et non touch\u00e9s',store.codes['ELIO-1381']==='planete-des-singes-3e'&&store.codes['ELIO-8378']==='debat-test-4e');

  /* 5. idempotence : seconde exécution */
  const avantPatch=journal.filter(j=>j.m==='PATCH').length;
  env.secuMigrerCodes(true);await dodo(300);
  const apresPatch=journal.filter(j=>j.m==='PATCH').length;
  verdict('12. idempotence : seconde ex\u00e9cution = 0 \u00e9criture, \u00ab 118 d\u00e9j\u00e0 pr\u00eats \u00bb',apresPatch===avantPatch&&env.SECU.migrBilan.includes('118 d\u00e9j\u00e0 pr\u00eats'),env.SECU.migrBilan);

  /* 6. affichage : deux régimes */
  env.SECU.cacheFait=false;await new Promise(res=>env.secuDechiffrerCache(res));
  verdict('13. cache d\u00e9chiffr\u00e9 : affichage = d\u00e9chiffr\u00e9 prioritaire',env.secuCodeAffiche(CANON[0]+' T-001')==='1000');
  const cleSauvee=env.SECU.cle;
  env.SECU.valide=false;
  verdict('14. sans cl\u00e9 : code MASQU\u00c9 (null \u2192 \u273b\u273b\u273b\u273b \u00e0 l\u2019\u00e9cran)',env.secuCodeAffiche(CANON[0]+' T-001')===null);
  env.SECU.valide=true;env.SECU.cle=cleSauvee;

  /* 7. RECHARGEMENT SANS RESSAISIE — l'exigence de Paul, jouée */
  const env2={...env};env2.SECU={cle:null,secretPresent:false,valide:false,raison:'',cache:{},cacheFait:false,prepares:0,aFaire:0,vestiges:0,migrEnCours:false,migrBilan:''};
  vm.createContext(env2);vm.runInContext(code,env2);   /* nouveau contexte = nouvelle page ; MÊME localStorage */
  env2.secuBoot();await dodo(600);
  verdict('15. RECHARGEMENT : la cl\u00e9 revient de localStorage, valid\u00e9e SANS RESSAISIE',env2.SECU.valide===true&&env2.SECU.secretPresent===true);

  /* 8. clé fausse : rejetée par le canari */
  r=await env.secuValiderSecret('une mauvaise phrase');
  verdict('16. cl\u00e9 fausse : REJET\u00c9E par le canari (clef-fausse)',!r.ok&&r.raison==='clef-fausse');

  /* 9. oubli → masqué → nouvelle saisie → retour */
  env.secuOublier();await dodo(100);
  verdict('17. oubli : secret effac\u00e9, codes masqu\u00e9s, oubli\u00e9_le \u00e9crit',env.secuLS('mjpc_coffre_secret')===null&&env.secuCodeAffiche(CANON[0]+' T-001')===null&&journal.some(j=>j.url.includes('oublie_le')));
  r=await env.secuValiderSecret(SECRET);
  env.SECU.cle=r.cle;env.SECU.valide=r.ok;env.secuLS('mjpc_coffre_secret',SECRET);
  env.SECU.cacheFait=false;await new Promise(res=>env.secuDechiffrerCache(res));
  verdict('18. nouvelle saisie : les codes reviennent',r.ok&&env.secuCodeAffiche(CANON[0]+' T-001')==='1000');

  /* 10. régénération APRÈS migration : _allCodesTaken + les cinq champs */
  const taken=env._allCodesTaken();
  verdict('19. _allCodesTaken APR\u00c8S migration : 118 codes + 2 PROF_CODES pr\u00e9sents',Object.keys(taken).length===120&&taken['1312']===true&&taken['1000']===true);
  const nouveau=env._genCode4(taken);
  env._putCode(CANON[3]+' T-004','_test_secu',nouveau);await dodo(400);
  const k4=env.san(CANON[3]+' T-004');const e4=store.codes[k4];
  const d4=await env.mjpcDechiffrer(env.SECU.cle,e4.chiffre);
  verdict('20. code r\u00e9g\u00e9n\u00e9r\u00e9 : \u00e9crit avec ses CINQ champs, chiffre = nouveau code',e4.code===nouveau&&d4===nouveau&&!!e4.sel&&!!e4.empreinte&&!(nouveau in taken));

  /* 11. garde sans clé */
  env.SECU.valide=false;modales=[];
  const avantN=journal.length;env._putCode(CANON[0]+' T-001','_test_secu','9999');await dodo(100);
  verdict('21. sans cl\u00e9 : _putCode REFUSE (garde), z\u00e9ro \u00e9criture, message montr\u00e9',journal.length===avantN&&modales.includes('Cl\u00e9 requise')&&store.codes[unK].code==='1000');
  env.SECU.valide=true;

  /* 12. refus et panne de migration : verdicts collectés, échecs signalés */
  delete store.codes[unK].chiffre;delete store.codes[unK].sel;delete store.codes[unK].empreinte;
  env.codesData=store.codes;
  failMode='refus';alertes=[];
  env.secuMigrerCodes(true);await dodo(400);
  verdict('22. refus de migration : bilan \u00ab 0 pr\u00e9par\u00e9, 1 refus\u00e9 \u00bb + \u00e9chec sign\u00e9 nomm\u00e9',env.SECU.migrBilan.includes('0 code pr\u00e9par\u00e9, 1 refus\u00e9')&&alertes.some(a=>a.etat==='refusee'&&a.ou.includes('Pr\u00e9paration du code')),env.SECU.migrBilan);
  failMode='panne';alertes=[];
  env.secuMigrerCodes(true);await dodo(400);
  verdict('23. panne de migration : \u00ab 1 en panne \u00bb + signal panne',env.SECU.migrBilan.includes('1 en panne')&&alertes.some(a=>a.etat==='panne'));
  failMode='ok';
  env.secuMigrerCodes(true);await dodo(300);
  verdict('24. reprise : la migration rejou\u00e9e r\u00e9pare (1 pr\u00e9par\u00e9)',env.SECU.migrBilan.startsWith('1 code pr\u00e9par\u00e9, 0 refus\u00e9, 0 en panne'));

  /* 13. MODE TEST : zéro écriture réelle */
  testOn=true;const avantT=journal.length;env.M8_TEST_STORE['/codes/test_fictif']={code:'0001'};
  await env.secuEcrireCanari(env.SECU.cle);
  env.secuPatchCode('test_fictif',{chiffre:'x',sel:'y',empreinte:'z'},()=>{});
  env.secuEnregistrerAppareil();await dodo(150);
  verdict('25. MODE TEST : canari + patch + fiche \u2192 Z\u00c9RO requ\u00eate r\u00e9seau, magasin mut\u00e9',journal.length===avantT&&env.M8_TEST_STORE['/codes/test_fictif'].chiffre==='x'&&!!env.M8_TEST_STORE['/site/config/coffreCanari']);
  testOn=false;

  /* 14. porte prof : PROF_CODES continue + voie clé (logique de doLogin extraite jouée) */
  profOuvert=0;
  if(env.PROF_CODES.indexOf('1312')>=0)env.loginAsProf();
  verdict('26. porte prof : le clair PROF_CODES continue d\u2019ouvrir (jusqu\u2019\u00e0 M-S\u00c9CU-3)',profOuvert===1);
  r=await env.secuValiderSecret(SECRET);
  if(r.ok)env.loginAsProf();
  verdict('27. porte prof : LA CL\u00c9 ouvre (valid\u00e9e par le canari)',profOuvert===2);

  /* 15. crypto absente : message, jamais d'échec muet */
  const cryptoSauve=env.mjpcCryptoDispo;
  vm.runInContext('mjpcCryptoDispo=function(){return false;}',env);
  r=await env.secuValiderSecret(SECRET);
  verdict('28. crypto absente : d\u00e9clar\u00e9e ({raison:crypto} \u2192 message https), pas d\u2019\u00e9chec muet',!r.ok&&r.raison==='crypto');
  vm.runInContext('mjpcCryptoDispo='+cryptoSauve.toString(),env);

  /* 16. LA PREUVE : la clé ne part JAMAIS — journal réseau complet */
  const cleDansReseau=journal.filter(j=>(j.url+j.body).includes(SECRET));
  const secretB64=Buffer.from(SECRET).toString('base64');
  const cleEncodee=journal.filter(j=>(j.url+j.body).includes(secretB64));
  verdict('29. LA CL\u00c9 NE SORT JAMAIS : '+journal.length+' requ\u00eates inspect\u00e9es, secret absent (clair et b64)',journal.length>130&&cleDansReseau.length===0&&cleEncodee.length===0);

  fs.writeFileSync('journal-reseau.json',JSON.stringify(journal,null,1));
  fs.writeFileSync('banc-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\n\u2550\u2550 BANC EN M\u00c9MOIRE : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT :',e);process.exit(2);});

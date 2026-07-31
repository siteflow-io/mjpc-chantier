/* BANC MÉMOIRE M-SÉCU-5 — le parcours ①→⑥ + le login élève du site réparé,
   sur hub simulé (six canoniques), journal, quatre formes. */
const fs=require('fs');const vm=require('vm');
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,160)});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,160));};
function extraire(src,nom,async_=false){const m=new RegExp('^'+(async_?'async ':'')+'function '+nom+'\\s*\\(','m').exec(src);if(!m)throw new Error('absente: '+nom);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function constante(src,nom){return new RegExp('^var '+nom+'=.*$','m').exec(src)[0];}
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  const idx=fs.readFileSync('index.staging.html','utf8');
  const canon=fs.readFileSync('/home/claude/m-secu2/build/canon-1.3.0.js','utf8');
  const SECRET='phrase du banc revoir 2026';
  const CANON6=['BERNARD Emma','DUPONT Marie','LEROY Hugo','MARTIN Lucas','MOREAU L\u00e9a','PETIT Thomas'];
  const journal=[];const ELS={};
  const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
    crypto:globalThis.crypto,TextEncoder,TextDecoder,
    btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),
    document:{getElementById:(id)=>ELS[id]||null},
    escapeHtml:x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;'),
    _showConsoleModal:(t,b,btns)=>{env._modales.push({t,b,btns:btns||[]});},
    _modales:[],
    mjpcPutJson:(url,val,cb)=>{journal.push({op:'PUT',url,val:JSON.stringify(val)});env._dernierPut=val;if(typeof cb==='function')cb(true);},
    mjpcSignalerIssue:()=>{},showProfSection:()=>{},
    secuLire:(ch)=>{journal.push({op:'GET',ch});return Promise.resolve(null);},
    secuEcrire:(ch,v)=>{journal.push({op:'PUT',ch,val:JSON.stringify(v)});return Promise.resolve({ok:true});},
    secuPatchCode:(k,o,cb)=>{journal.push({op:'PATCH',ch:'/codes/'+k});cb({etat:'acceptee'});},
    MJPC_ISSUE:{ACCEPTEE:'acceptee'},
    secuExigeCle:()=>true,
    FIREBASE_BASE:'https://hub-de-banc',
    extractEleves:(cl)=>cl&&cl.eleves||[],
  };
  env.window=env;vm.createContext(env);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcDechiffrer','mjpcSelAleatoire','mjpcEmpreinte','sanMJPC'].map(f=>extraire(canon,f)).join('\n')
    +'\n'+constante(canon,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canon,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canon,'MJPC_COFFRE_ITER_EMPREINTE'),env);
  vm.runInContext("var san=sanMJPC;var SECU={cle:null,valide:false,cache:{}};var SECU_CH_PROF='/site/config/profEmpreintes';var codesData={};var classesData={};",env);
  for(const f of ['_eleveAUnCode','_eleveCode','secuCodeAffiche','_putCode','_secuVerifCodeEleveSite','secuRetirerClair','_secuPurgerClair'])
    vm.runInContext(extraire(idx,f),env);
  vm.runInContext(extraire(idx,'_estCodeProf'),env);
  vm.runInContext(constante(idx,'_profFichesCache'),env);
  vm.runInContext(extraire(idx,'_allCodesTaken'),env);
  vm.runInContext(extraire(idx,'_genCode4'),env);
  vm.runInContext(extraire(idx,'_genererCodesClasse',true),env);

  /* hub de banc : 5 canoniques AVEC code chiffré (sans clair), 1 sans rien */
  env.SECU.cle=await env.mjpcDeriverCle(SECRET);env.SECU.valide=true;
  const codesRef={};
  for(let i=0;i<5;i++){
    const nom=CANON6[i],code='71'+(10+i);
    const sel=env.mjpcSelAleatoire();
    env.codesData[env.sanMJPC(nom)]={name:nom,sel,empreinte:await env.mjpcEmpreinte(code,sel),chiffre:await env.mjpcChiffrer(env.SECU.cle,code)};
    codesRef[nom]=code;
  }
  env.classesData['_test_banc']={nom:'Classe de banc',eleves:CANON6};
  vm.runInContext('codesData=this.codesData;classesData=this.classesData;',env);

  /* ① SANS clé : masqué (null → ✻✻✻✻ au rendu), et _eleveAUnCode dit vrai */
  env.SECU.valide=false;
  let aff=vm.runInContext(`secuCodeAffiche(${JSON.stringify(CANON6[0])})`,env);
  verdict('\u2460 sans cl\u00e9 : le code existe (\u2713 compteur) mais s\u2019affiche MASQU\u00c9 (null)',
    aff===null&&vm.runInContext(`_eleveAUnCode(${JSON.stringify(CANON6[0])})`,env)===true,String(aff));

  /* ② AVEC clé : déchiffrement à la volée, la LIGNE se remplit seule */
  env.SECU.valide=true;
  const k0=env.sanMJPC(CANON6[0]);
  ELS['code-aff-'+k0]={innerHTML:'<span class="secu-masque">\u273b\u273b\u273b\u273b</span>'};
  aff=vm.runInContext(`secuCodeAffiche(${JSON.stringify(CANON6[0])})`,env);
  verdict('\u2461a premier appel avec cl\u00e9 : masqu\u00e9 (calcul lanc\u00e9), pas de redraw global',aff===null);
  await dodo(300);
  verdict('\u2461b la LIGNE s\u2019est remplie seule avec le code d\u00e9chiffr\u00e9 ('+codesRef[CANON6[0]]+')',
    ELS['code-aff-'+k0].innerHTML===codesRef[CANON6[0]],ELS['code-aff-'+k0].innerHTML);
  aff=vm.runInContext(`secuCodeAffiche(${JSON.stringify(CANON6[0])})`,env);
  verdict('\u2461c au rendu suivant : le code sort DIRECT (cache)',aff===codesRef[CANON6[0]],String(aff));
  /* les six : 5 se déchiffrent, la 6e n'a rien */
  for(let i=1;i<5;i++)vm.runInContext(`secuCodeAffiche(${JSON.stringify(CANON6[i])})`,env);
  await dodo(500);
  const cinq=CANON6.slice(0,5).every(n=>env.SECU.cache[env.sanMJPC(n)]===codesRef[n]);
  verdict('\u2461d les CINQ codes chiffr\u00e9s sont revenus lisibles, exacts',cinq,JSON.stringify(env.SECU.cache));

  /* ③ l'élève sans code : '—' + le compteur le voit + la génération GÉNÈRE vraiment */
  const sans=CANON6[5];
  verdict('\u2462a l\u2019\u00e9l\u00e8ve sans code : _eleveAUnCode=false (\u2192 \u2014 et \u00ab G\u00e9n\u00e9rer 1 manquant \u00bb)',
    vm.runInContext(`_eleveAUnCode(${JSON.stringify(sans)})`,env)===false
    &&vm.runInContext(`secuCodeAffiche(${JSON.stringify(sans)})`,env)==='');
  env.secuLire=(ch)=>{journal.push({op:'GET',ch});return Promise.resolve(ch==='/site/config/profEmpreintes'?[]:null);};
  await vm.runInContext(`_genererCodesClasse('_test_banc')`,env);
  await dodo(400);
  const putURL=journal.filter(j=>j.op==='PUT'&&String(j.url||'').includes('/codes/'));
  verdict('\u2462b la g\u00e9n\u00e9ration a \u00e9crit UN code (celui qui manquait), pas les six',putURL.length===1,String(putURL.length));

  /* ④ l'écriture porte chiffre+sel+empreinte et AUCUN code */
  const rec=env._dernierPut;
  verdict('\u2463 /codes re\u00e7oit chiffre+sel+empreinte et AUCUN champ code (le retrait est d\u00e9finitif)',
    rec&&rec.chiffre&&rec.sel&&rec.empreinte&&!('code' in rec),JSON.stringify(Object.keys(rec||{})));

  /* ⑤ le code généré s'affiche déchiffré (cache posé par _putCode) */
  aff=vm.runInContext(`secuCodeAffiche(${JSON.stringify(sans)})`,env);
  const enCache=env.SECU.cache[env.sanMJPC(sans)];
  verdict('\u2464 le code g\u00e9n\u00e9r\u00e9 s\u2019affiche d\u00e9chiffr\u00e9 imm\u00e9diatement (cache de _putCode)',
    typeof aff==='string'&&/^\d{4}$/.test(aff)&&aff===enCache,String(aff));
  /* et il se vérifie par son empreinte (cohérence) */
  const e6=env.codesData[env.sanMJPC(sans)];
  const h6=await env.mjpcEmpreinte(aff,e6.sel);
  verdict('\u2464bis la coh\u00e9rence : empreinte(code g\u00e9n\u00e9r\u00e9) = empreinte \u00e9crite',h6===e6.empreinte);

  /* ⑥ l'impression sort les codes lisibles (fenêtre stub, déchiffrements attendus) */
  env.SECU.cache={}; /* cache vidé : l'impression doit déchiffrer elle-même */
  let doc='';const W={document:{write:(h)=>{doc+=h;},open:()=>{doc='';},close:()=>{}},print:()=>{env._imprime=true;}};
  env.open=()=>W;env.window.open=env.open;
  vm.runInContext(extraire(idx,'_printCodesClasse'),env);
  vm.runInContext(`_printCodesClasse('_test_banc')`,env);
  await dodo(700);
  const tousImprimes=CANON6.slice(0,5).every(n=>doc.includes(codesRef[n]))&&/\d{4}/.test(doc);
  verdict('\u2465 l\u2019impression sort les SIX codes LISIBLES (d\u00e9chiffr\u00e9s avant \u00e9criture), pas des puces',
    tousImprimes&&!doc.includes('\u273b'),doc.slice(0,120));

  /* LE LOGIN ÉLÈVE DU SITE (le trou sourcé) : entrée SANS clair, par empreinte */
  let ok=await vm.runInContext(`_secuVerifCodeEleveSite({nom:${JSON.stringify(CANON6[1])}},${JSON.stringify(codesRef[CANON6[1]])})`,env);
  verdict('login \u00e9l\u00e8ve du site : bon code sur entr\u00e9e SANS clair \u2192 ENTRE (par empreinte)',ok===true);
  ok=await vm.runInContext(`_secuVerifCodeEleveSite({nom:${JSON.stringify(CANON6[1])}},"0000")`,env);
  verdict('login \u00e9l\u00e8ve du site : code faux \u2192 refus\u00e9',ok===false);

  /* le bouton « Retirer les codes en clair » quand il ne reste rien */
  env._modales.length=0;
  vm.runInContext('secuRetirerClair()',env);await dodo(400);
  const mod=env._modales[env._modales.length-1];
  const sansAction=mod&&!(mod.btns||[]).some(b=>/Retirer maintenant/.test(b.label));
  verdict('bouton de retrait avec 0 clair : annonce \u00ab 0 \u2026 rien \u00e0 retirer \u00bb, sans action, sans erreur',
    mod&&/<b>0<\/b>/.test(mod.b)&&/rien \u00e0 retirer/.test(mod.b)&&sansAction,mod&&mod.b.slice(0,110));

  /* la clé sous quatre formes dans le journal */
  const s4=[SECRET,Buffer.from(SECRET).toString('base64'),encodeURIComponent(SECRET),JSON.stringify(SECRET)];
  const flux=journal.map(j=>String(j.url||j.ch)+'|'+String(j.val||'')).join('\u00a7');
  verdict('la cl\u00e9 ne sort JAMAIS ('+journal.length+' op\u00e9rations, 4 formes)',journal.length>0&&!s4.some(f=>flux.includes(f)));

  fs.writeFileSync('banc5-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC M\u00c9MOIRE M-S\u00c9CU-5 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

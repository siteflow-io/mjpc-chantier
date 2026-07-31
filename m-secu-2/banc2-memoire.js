/* BANC EN MÉMOIRE M-SÉCU-2 — les fonctions de la section et du socle §11 sont
   extraites de CHAQUE fichier livré et exécutées dans Node (WebCrypto natif),
   fetch stubbé + journal réseau. Les TROIS cas du login + tolérances + portes
   prof, joués NEUF fois. Élèves fictifs dérivés des six canoniques (T-nnn). */
const fs=require('fs');const vm=require('vm');
const APPS=["analyse_logique","applause_meter","correction_dictee","dictee_universelle","evaluation-qcm","pilotage_debat_s3","reecriture","reecriture_bb4e","worktrack"];
const FN=['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcDechiffrer','mjpcSelAleatoire','mjpcEmpreinte','sanMJPC',
 'mjpcEntreeCode','mjpcVerifierCode','mjpcSecuLireJson','mjpcValiderCleLocale','mjpcVerifierProf','mjpcProfDejaLa','mjpcOublierCleIci','mjpcRetirerBoutonProf'];
function extraire(src,nom){
  const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);
  if(!m)throw new Error('absente : '+nom);
  let i=src.indexOf('{',m.index),p=0,j=i;
  for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}
  return src.slice(m.index,j+1);
}
function constante(src,nom){
  const m=new RegExp('^var '+nom+'=.*$','m').exec(src);
  if(!m)throw new Error('constante absente : '+nom);return m[0];
}
const SECRET='phrase du banc des neuf 2026';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'')});if(!ok)console.log('ÉCHEC '+n+' — '+String(d).slice(0,140));};
const dodo=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
  /* le canari de référence, chiffré une fois avec la vraie §11 (celle du canon) */
  const canonSrc=fs.readFileSync('canon-1.3.0.js','utf8');
  const envRef={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),Promise,console};
  vm.createContext(envRef);
  vm.runInContext(FN.slice(0,10).map(f=>extraire(canonSrc,f)).join('\n')+'\n'+constante(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),envRef);
  const cleRef=await envRef.mjpcDeriverCle(SECRET);
  const CANARI=await envRef.mjpcChiffrer(cleRef,'MJPC-CANARI|coffre-v1');
  const selP=envRef.mjpcSelAleatoire();
  const PROF_FICHES=[{sel:selP,empreinte:await envRef.mjpcEmpreinte('3141',selP)}];
  /* données élèves : migrée / ancienne sans empreinte / chaîne nue / discordante */
  const CANON6=['BERNARD Emma','DUPONT Marie','LEROY Hugo','MARTIN Lucas','MOREAU L\u00e9a','PETIT Thomas'];
  const selA=envRef.mjpcSelAleatoire(), selD=envRef.mjpcSelAleatoire();

  for(const app of APPS){
    const src=fs.readFileSync(app+'.staging.html','utf8');
    const journal=[];
    const LS={'mjpc_coffre_secret':SECRET};
    const env={console,Promise,Object,JSON,Date,Math,String,Array,Error,RegExp,setTimeout,
      crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:envRef.btoa,atob:envRef.atob,
      localStorage:{getItem:k=>k in LS?LS[k]:null,setItem:(k,v)=>{LS[k]=String(v);},removeItem:k=>{delete LS[k];}},
      sessionStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},
      document:{getElementById:()=>null,createElement:()=>({style:{},set innerHTML(v){}}),body:{appendChild:()=>{}}},
      window:{},
      fetch:(url)=>{journal.push({url:String(url)});
        if(String(url).includes('coffreCanari'))return Promise.resolve({ok:true,json:()=>Promise.resolve(CANARI)});
        if(String(url).includes('profEmpreintes'))return Promise.resolve({ok:true,json:()=>Promise.resolve(PROF_FICHES)});
        return Promise.resolve({ok:false,json:()=>Promise.resolve(null)});},
    };
    env.window=env;vm.createContext(env);
    let code=FN.map(f=>extraire(src,f)).join('\n')
      +'\n'+constante(src,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(src,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(src,'MJPC_COFFRE_ITER_EMPREINTE')
      +'\nvar MJPC_SECU2='+/var MJPC_SECU2=(\{[^;]*\});/.exec(src)[1]+';';
    vm.runInContext(code,env);
    /* jeu de données par app (sanMJPC de l'app fait foi) */
    const k1=env.sanMJPC(CANON6[0]+' T-101'), k2=env.sanMJPC(CANON6[1]+' T-102'), k3=env.sanMJPC(CANON6[2]+' T-103');
    const codes={};
    codes[k1]={code:'1101',name:CANON6[0]+' T-101',sel:selA,empreinte:await envRef.mjpcEmpreinte('1101',selA),chiffre:'x'};
    codes[k2]={code:'1102',name:CANON6[1]+' T-102'};                       /* ancienne, sans empreinte */
    codes['ELIO-9999']='vieux-code-nu';                                    /* chaîne nue */
    codes[k3]={code:'1103',name:CANON6[2]+' T-103',sel:selD,empreinte:await envRef.mjpcEmpreinte('9999',selD)}; /* discordante */
    /* 1-3 : LES TROIS CAS DU LOGIN */
    let r=await env.mjpcVerifierCode(env.mjpcEntreeCode(codes,k1),'1101');
    verdict(app+' · 1. bon code (migr\u00e9) \u2192 ENTRE par EMPREINTE',r.ok&&r.voie==='empreinte',JSON.stringify(r));
    r=await env.mjpcVerifierCode(env.mjpcEntreeCode(codes,k1),'0000');
    verdict(app+' · 2. mauvais code \u2192 REFUS\u00c9',!r.ok,JSON.stringify(r));
    r=await env.mjpcVerifierCode(env.mjpcEntreeCode(codes,k2),'1102');
    verdict(app+' · 3. entr\u00e9e ancienne sans empreinte \u2192 REPLI CLAIR, entre',r.ok&&r.voie==='clair',JSON.stringify(r));
    /* 4 : chaîne nue */
    r=await env.mjpcVerifierCode(env.mjpcEntreeCode(codes,'ELIO-9999'),'vieux-code-nu');
    verdict(app+' · 4. cha\u00eene nue (vestige) \u2192 repli clair, entre',r.ok&&r.voie==='clair');
    /* 5 : discordance comptée */
    const avant=env.MJPC_SECU2.discordances;
    r=await env.mjpcVerifierCode(env.mjpcEntreeCode(codes,k3),'1103');
    verdict(app+' · 5. empreinte discordante + clair juste \u2192 entre, COMPT\u00c9',r.ok&&r.voie==='clair-discordant'&&env.MJPC_SECU2.discordances===avant+1);
    /* 6 : rattrapage sanMJPC par name (clé dégradée) */
    const codes2={};codes2['cle_degradee_x']={code:'1104',name:CANON6[3]+' T-104'};
    r=await env.mjpcVerifierCode(env.mjpcEntreeCode(codes2,env.sanMJPC(CANON6[3]+' T-104')),'1104');
    verdict(app+' · 6. tol\u00e9rance : cl\u00e9 ancienne rattrap\u00e9e par sanMJPC(name)',r.ok);
    /* 7-9 : porte prof */
    r=await env.mjpcVerifierProf('3141',['3141','1312']);
    verdict(app+' · 7. porte prof : code clair effectif \u2192 ouvre (voie code)',r.ok&&r.voie==='code');
    delete LS['mjpc_coffre_secret'];
    r=await env.mjpcVerifierProf(SECRET,['3141','1312']);
    verdict(app+' · 8. porte prof : la CL\u00c9 (canari) \u2192 ouvre + m\u00e9moris\u00e9e',r.ok&&r.voie==='cle'&&LS['mjpc_coffre_secret']===SECRET);
    r=await env.mjpcVerifierProf('une mauvaise phrase longue',[ '3141','1312']);
    verdict(app+' · 9. cl\u00e9 fausse \u2192 REFUS\u00c9E (ni canari ni empreinte)',!r.ok);
    /* 10 : empreinte prof du hub (saisie = code prof quand le clair aura disparu) */
    r=await env.mjpcVerifierProf('3141',[]);
    verdict(app+' · 10. porte prof par EMPREINTE hub (sans clair)',r.ok&&r.voie==='empreinte-prof');
    /* 11 : clé déjà là + oubli l'éteint */
    let la=await env.mjpcProfDejaLa();
    env.mjpcOublierCleIci();
    let plus=await env.mjpcProfDejaLa();
    verdict(app+' · 11. cl\u00e9 d\u00e9j\u00e0 l\u00e0 \u2192 vrai · apr\u00e8s OUBLI \u2192 faux',la===true&&plus===false);
    /* 12 : la clé ne sort JAMAIS */
    const s4=[SECRET,Buffer.from(SECRET).toString('base64'),encodeURIComponent(SECRET),JSON.stringify(SECRET)];
    const fuite=journal.filter(j=>s4.some(f=>j.url.includes(f)));
    verdict(app+' · 12. LA CL\u00c9 NE SORT JAMAIS ('+journal.length+' requ\u00eates, 4 formes cherch\u00e9es)',journal.length>0&&fuite.length===0);
    LS['mjpc_coffre_secret']=SECRET; /* remis pour l'app suivante (LS local de toute façon) */
  }
  /* applause : sa fonction propre, prolongée */
  {
    const src=fs.readFileSync('applause_meter.staging.html','utf8');
    const fx=extraire(src,'lireCodeEleveMJPC');
    const env={Promise,String,console};
    vm.createContext(env);vm.runInContext(fx,env);
    const rTest=await env.lireCodeEleveMJPC(null,'x',{x:'4242'});
    verdict('applause · 13. mode test : codesTest fait foi, /codes non consult\u00e9',rTest.etat==='trouve'&&rTest.code==='4242');
    const db={ref:p=>({once:()=>Promise.resolve({val:()=>({code:'1105',sel:'ab',empreinte:'cd'})})})};
    const r2=await env.lireCodeEleveMJPC(db,'k2',null);
    verdict('applause · 14. lecture par cl\u00e9 \u2192 ENTREE compl\u00e8te retourn\u00e9e (sel+empreinte)',r2.etat==='trouve'&&r2.entree&&r2.entree.sel==='ab'&&r2.entree.empreinte==='cd');
  }
  fs.writeFileSync('banc2-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC EN M\u00c9MOIRE \u00d79 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT :',e);process.exit(2);});

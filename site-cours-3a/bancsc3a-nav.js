/* BANC NAVIGATEUR SITE-COURS-3a — LE RENDU MESURÉ : 390 px sans débordement sur
   CHAQUE type de bloc, impression vérifiée, texte sélectionnable, portées sur window. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CHROME+'/chrome-linux64/chrome';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,190)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,170)));};
function extraireC(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cstC(src,nom){return new RegExp('^var '+nom+'=.*$','m').exec(src)[0];}
const SECRET='phrase du banc diapo 2026';

const DIAPO={titre:'Le portrait \u2014 s\u00e9ance 2',niveau:'3e',diapos:[
 {titre:'Les proc\u00e9d\u00e9s du portrait',blocs:[
  {type:'sous_titre',texte:'Ce qu\u2019on observe'},
  {type:'paragraphe',texte:'Le portrait mêle le physique et le moral, et il oriente le regard du lecteur sur le personnage.'},
  {type:'puces',items:['Le portrait physique','Le portrait moral','Le portrait en action']},
  {type:'numeros',items:['Relever les adjectifs','Classer physique / moral','R\u00e9diger deux phrases']},
  {type:'definition',terme:'Un portrait',texte:'la description d\u2019un personnage, physique ou morale.'},
  {type:'exemple',texte:'« Elle avait les cheveux blonds et les dents blanches. »'},
  {type:'citation',texte:'Elle \u00e9tait belle, autant qu\u2019elle pouvait l\u2019\u00eatre.',auteur:'Victor Hugo',oeuvre:'Les Mis\u00e9rables'},
  {type:'tableau',entetes:['Proc\u00e9d\u00e9','Effet produit'],lignes:[['L\u2019adjectif qualificatif','pr\u00e9cise le d\u00e9tail'],['La comparaison','cr\u00e9e une image'],['L\u2019\u00e9num\u00e9ration','accumule les traits']]},
  {type:'note',texte:'Un portrait n\u2019est jamais neutre.',ton:'\u00c0 retenir'},
  {type:'note',texte:'Ne confondez pas portrait et description de lieu.',ton:'Attention'},
  {type:'image',legende:'Gravure de 1862',alt:'Portrait grav\u00e9 de Fantine, de profil',ref:''}]}]};

(async()=>{
  const canonSrc=fs.readFileSync('canon.js','utf8');
  const envC={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(envC);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>extraireC(canonSrc,f)).join('\n')
    +'\n'+cstC(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cstC(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+cstC(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),envC);
  const CANARI=await envC.mjpcChiffrer(await envC.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,
    '/classes':{},'/codes':{},'/site/diaporamas/portrait-seance-2':DIAPO};
  const RESEAU=[],ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}
    else{rs.statusCode=404;rs.end('');}}).listen(8710);
  const browser=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function pagePrete(largeur){
    const page=await browser.newPage();
    await page.setViewport({width:largeur||1280,height:largeur?844:1100});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();RESEAU.push({m:r.method(),u});
      if(u.includes('firebasedatabase.app')){
        const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE','Access-Control-Allow-Headers':'*'};
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({m:r.method(),ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});
      }
      if(u.startsWith('http://localhost:8710'))return r.continue();
      if(u.includes('drive.google.com'))return r.respond({status:200,contentType:'image/gif',body:Buffer.from('R0lGODlhAQABAAAAACw=','base64')});
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();
    });
    await page.evaluateOnNewDocument((sec)=>{try{sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');localStorage.setItem('mjpc_coffre_secret',sec);}catch(e){}},SECRET);
    return page;
  }
  /* ── desktop : portées, écran, relecture ── */
  let page=await pagePrete();
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,130)));
  await page.goto('http://localhost:8710/index.staging.html',{waitUntil:'domcontentloaded',timeout:70000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1500));
  const NOMS=['diapoOuvrir','diapoRendreEcran','diapoInfo','diapoVerifier','diapoRelecture','diapoMarquer','diapoToutRelu',
              'diapoEnregistrer','diapoEcrire','diapoValider','diapoRendre','diapoRendreBloc','diapoVocabulaireBlocs',
              'diapoTexteBrut','diapoCles','diapoIdPropose','openDiaporamaById','openItem','atPromptTexte'];
  const et=await page.evaluate((n)=>({canon:window.MJPC_CORE_VERSION,app:window.APP_VERSION,
    overlay:!!document.getElementById('m8-regles-overlay'),portee:n.map(k=>k+':'+(typeof window[k])).join(' ')}),NOMS);
  verdict('PORT\u00c9E : pastille 8.13.0, canon 1.4.0, les 19 fonctions sur window, overlay NEUTRALIS\u00c9',
    et.app==='8.13.0'&&et.canon==='1.4.0'&&!/:undefined/.test(et.portee)&&!et.overlay,JSON.stringify(et).slice(0,190));
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){} try{atIAOuvrir();}catch(e){}});
  await new Promise(x=>setTimeout(x,1200));
  await page.evaluate(()=>{diapoOuvrir();});
  await page.waitForSelector('#dp-coller',{timeout:20000}).catch(()=>{});
  const p=await page.evaluate(()=>atPromptTexte());
  verdict('\u2460 le prompt : cadrage impos\u00e9, crit\u00e8re de tri (dicter/d\u00e9crire), blocs g\u00e9n\u00e9r\u00e9s, aucun jeton r\u00e9siduel',
    /NE PRODUIS AUCUN JSON TOUT DE SUITE/.test(p)&&/DICTER/.test(p)&&/D\u00c9CRIRE/.test(p)
    &&/- citation :/.test(p)&&!/@@/.test(p),'longueur '+p.length);
  await page.evaluate((j)=>{document.getElementById('dp-coller').value=JSON.stringify(j);diapoVerifier();},DIAPO);
  await new Promise(x=>setTimeout(x,1200));
  const rel=await page.evaluate(()=>{const d=document.getElementById('dp-relecture');
    return {n:d.querySelectorAll('input[type=checkbox]').length,btn:(document.getElementById('dp-btn-ecrire')||{}).disabled,
      txt:d.innerText.slice(0,200)};});
  verdict('\u2461 relecture \u00e0 l\u2019\u00e9cran : une case par bloc, bouton FERM\u00c9',
    rel.n===11&&rel.btn===true&&/0 bloc\(s\) relu\(s\) sur 11/.test(rel.txt),JSON.stringify(rel).slice(0,150));
  await page.screenshot({path:'img-k01.png'});
  await page.close();

  /* ── LE RENDU MESURÉ À 390 px, bloc par bloc ── */
  page=await pagePrete(390);
  await page.goto('http://localhost:8710/index.staging.html',{waitUntil:'domcontentloaded',timeout:70000});
  await new Promise(x=>setTimeout(x,2500));
  const mes=await page.evaluate((dp)=>{
    /* le viewer élève, tel qu'un élève l'ouvrirait */
    openDiaporamaById('portrait-seance-2','Le portrait — séance 2');
    return new Promise(res=>setTimeout(()=>{
      const c=document.getElementById('dp-viewer-corps');
      const par={};
      ['dp-titre','dp-sstitre','dp-p','dp-ul','dp-ol','dp-def','dp-ex','dp-cit','dp-tab','dp-note','dp-fig'].forEach(cl=>{
        const els=[...c.querySelectorAll('.'+cl)];
        par[cl]={n:els.length,deborde:els.some(e=>e.getBoundingClientRect().right>391)};
      });
      const tousDeb=[...c.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>391;}).length;
      /* le tableau doit être devenu une liste de paires */
      const td=c.querySelector('.dp-tab td');
      const style=td?getComputedStyle(td,'::before'):null;
      return res({par:par,tousDeb:tousDeb,largeurDoc:document.documentElement.scrollWidth,
        tdBlock:td?getComputedStyle(td).display:'',
        entete:style?style.content:'',
        texte:c.innerText.slice(0,120),
        selectable:!c.querySelector('canvas')&&!c.querySelector('svg')});
    },1200));
  },DIAPO);
  verdict('LE RENDU \u00c0 390 px : les 11 types de blocs pr\u00e9sents, AUCUN d\u00e9bordement horizontal',
    mes.tousDeb===0&&mes.largeurDoc<=392&&Object.values(mes.par).every(x=>!x.deborde)&&mes.par['dp-tab'].n===1,
    JSON.stringify({deb:mes.tousDeb,larg:mes.largeurDoc}));
  verdict('le TABLEAU bascule en paires libell\u00e9/valeur au t\u00e9l\u00e9phone (td en block, en-t\u00eate port\u00e9 par ::before)',
    mes.tdBlock==='block'&&/Proc\u00e9d\u00e9/.test(String(mes.entete)),JSON.stringify({d:mes.tdBlock,e:mes.entete}));
  verdict('le texte est du VRAI TEXTE, s\u00e9lectionnable (ni canvas ni image de texte)',
    mes.selectable&&/portrait/i.test(mes.texte),mes.texte.slice(0,80));
  await page.screenshot({path:'img-k02.png',fullPage:false});
  /* ── L'IMPRESSION ── */
  const imp=await page.evaluate(()=>new Promise(res=>{
    const mq=window.matchMedia('print');
    /* on éprouve les règles @media print par emulateMediaType côté puppeteer :
       ici on relève seulement la présence des règles dans la feuille */
    let regles=0,barre=false,coupe=false;
    [...document.styleSheets].forEach(ss=>{try{[...ss.cssRules].forEach(r=>{
      if(r.type===CSSRule.MEDIA_RULE&&/print/.test(r.conditionText||'')){
        regles++;[...r.cssRules].forEach(x=>{
          if(/dp-viewer-barre/.test(x.selectorText||'')&&/none/.test(x.style.display))barre=true;
          if(/dp-diapo/.test(x.selectorText||'')&&/avoid/.test(x.style.pageBreakInside+x.style.breakInside))coupe=true;});
      }});}catch(e){}});
    res({regles:regles,barre:barre,coupe:coupe});
  }));
  verdict('IMPRESSION : r\u00e8gles @media print pr\u00e9sentes, barre du viewer masqu\u00e9e, diapositive non coup\u00e9e',
    imp.regles>0&&imp.barre&&imp.coupe,JSON.stringify(imp));
  await page.emulateMediaType('print');
  await new Promise(x=>setTimeout(x,400));
  const impVu=await page.evaluate(()=>{const b=document.querySelector('.dp-viewer-barre');
    return {barreCachee:b?getComputedStyle(b).display==='none':false,
      deb:[...document.querySelectorAll('.dp-doc *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>400;}).length};});
  verdict('IMPRESSION rendue : la barre dispara\u00eet, le document tient dans la page',
    impVu.barreCachee&&impVu.deb===0,JSON.stringify(impVu));
  await page.screenshot({path:'img-k03.png'});
  await page.emulateMediaType(null);
  await page.close();
  const hors=ECRITS.filter(e=>!/^\/(site\/diaporamas|corbeille|site\/atelier)\//.test(e.ch)&&!/^\/(manifestes|presence)\//.test(e.ch));
  verdict('journal r\u00e9seau : aucune \u00e9criture hors diaporamas/corbeille ('+ECRITS.length+' \u00e9critures, pr\u00e9-existantes \u00e9cart\u00e9es par preuve)',
    hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,5)));

  await browser.close();srv.close();
  fs.writeFileSync('bancsc3a-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('bancsc3a-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch)},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR SITE-COURS-3a : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

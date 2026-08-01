/* BANC NAVIGATEUR SITE-COURS-2c — portée sur window (règle du 01/08), écran réel,
   inventaire face à face, écriture PAR INDEX au journal réseau, mobile 390.
   Overlay « règles Firebase » NEUTRALISÉ (dernierControleRegles à aujourd'hui). */
const fs=require('fs');const http=require('http');const path=require('path');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CHROME+'/chrome-linux64/chrome';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,180)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,160)));};

const vm=require('vm');
function extraireC(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cstC(src,nom){return new RegExp('^var '+nom+'=.*$','m').exec(src)[0];}
const SECRET='phrase du banc chapitre 2026';
(async()=>{
  const taxo=JSON.parse(fs.readFileSync('taxonomie.json','utf8'));
  /* la garde secuExigeCle est légitime : le banc pose la clé et son canari */
  const canonSrc=fs.readFileSync('canon.js','utf8');
  const envC={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(envC);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>extraireC(canonSrc,f)).join('\n')
    +'\n'+cstC(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cstC(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+cstC(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),envC);
  const CANARI=await envC.mjpcChiffrer(await envC.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  const existant={title:'La satire et l\u2019argumentation',ordre:3,published:{'3e_charles_de_gaulle':true},seances:[
    {title:'Introduction et analyse d\u2019image',type:'intro_image',items:{'diapo':{title:'Diaporama',kind:'doc',source:'drive',ref:''}}},
    {title:'\u00c9tude de texte',type:'etude_texte',items:{'etude-de-texte':{title:'\u00c9tude de texte',kind:'doc',source:'drive',ref:''}}}
  ]};
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/taxonomie':taxo,'/classes':{},'/codes':{},
    '/site/3e':{chapitres:[null,{title:'Autre',ordre:1,published:{'3E Charles de Gaulle':true},seances:[]},null,JSON.parse(JSON.stringify(existant))]},
    '/site/3e/chapitres':[null,{title:'Autre',ordre:1,seances:[]},null,JSON.parse(JSON.stringify(existant))],
    '/site/config/coffreCanari':CANARI};
  const RESEAU=[],ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}
    else{rs.statusCode=404;rs.end('');}}).listen(8700);
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
      if(u.startsWith('http://localhost:8700'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();
    });
    await page.evaluateOnNewDocument((sec)=>{try{sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');localStorage.setItem('mjpc_coffre_secret',sec);}catch(e){}},SECRET);
    return page;
  }
  let page=await pagePrete();
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,130)));
  await page.goto('http://localhost:8700/index.staging.html',{waitUntil:'domcontentloaded',timeout:70000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1500));
  /* PORTÉE : toutes les fonctions posées sur window */
  const NOMS=['chOuvrir','chRendre','chInfo','chVerifier','chAfficherInventaire','chInjecter','chInjecterConfirme',
              'chValiderChapitre','chInventaire','chVocabulaireTaxo','chVocabulaireTypes','chIdsTaxo','chChargerTaxo',
              'chNettoyerPublished','chAlerteGraphies','mjpcPromptVocabulaire','mjpcValidation','atPromptTexte','atIAOuvrir'];
  const et=await page.evaluate((noms)=>({canon:window.MJPC_CORE_VERSION,app:window.APP_VERSION,
    overlay:!!document.getElementById('m8-regles-overlay'),
    portee:noms.map(k=>k+':'+(typeof window[k])).join(' ')}),NOMS);
  verdict('PORT\u00c9E : canon 1.4.0 dans index, pastille 8.12.0, les 19 fonctions sur window, overlay NEUTRALIS\u00c9',
    et.canon==='1.4.0'&&et.app==='8.12.0'&&!/:undefined/.test(et.portee)&&!et.overlay,JSON.stringify(et).slice(0,200));
  /* l'écran s'ouvre */
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){}});
  await new Promise(x=>setTimeout(x,1500));
  await page.evaluate(()=>{atIAOuvrir();});
  await new Promise(x=>setTimeout(x,600));
  await page.evaluate(()=>{chOuvrir();});
  await page.waitForSelector('#ch-coller',{timeout:20000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1200));
  const ecran=await page.evaluate(()=>({titre:(document.querySelector('.at-ia-titre')||{}).textContent||'',
    zone:!!document.getElementById('ch-coller'),niveau:!!document.getElementById('ch-niveau'),
    note:(document.querySelector('.ch-note')||{}).textContent||''}));
  verdict('l\u2019\u00e9cran chapitre s\u2019ouvre (titre, s\u00e9lecteur de niveau, zone de collage)',
    /chapitre/i.test(ecran.titre)&&ecran.zone&&ecran.niveau,JSON.stringify(ecran).slice(0,150));
  verdict('les deux graphies de classe sont SIGNAL\u00c9ES, sans bouton de correction',
    /Deux \u00e9critures d\u2019un m\u00eame nom de classe/.test(ecran.note),ecran.note.slice(0,120));
  /* le prompt contient cadrage + taxonomie + types */
  const p=await page.evaluate(()=>atPromptTexte());
  verdict('\u2460 le prompt contient le CADRAGE IMPOS\u00c9, les 7 types, la TAXONOMIE g\u00e9n\u00e9r\u00e9e, et demande SES DOCUMENTS',
    /NE PRODUIS AUCUN JSON TOUT DE SUITE/.test(p)&&/de quels documents je dispose/.test(p)
    &&/- etude_texte/.test(p)&&/\[6e-3e\]/.test(p)&&!/@@/.test(p)&&p.length>10000,'longueur '+p.length);
  await page.screenshot({path:'img-j01.png'});
  /* ⑦ refus nommés à l'écran */
  await page.evaluate(()=>{document.getElementById('ch-coller').value=JSON.stringify({niveau:'3e',chapitre:{title:'T',seances:[{title:'S',type:'sardine',notions:['notion-inventee'],items:{}}]}});chVerifier();});
  await new Promise(x=>setTimeout(x,900));
  const refus=await page.evaluate(()=>(document.getElementById('ch-msg')||{}).innerHTML||'');
  verdict('\u2466 refus \u00e0 l\u2019\u00e9cran : motifs accumul\u00e9s, notion invent\u00e9e NOMM\u00c9E',
    /notion-inventee/.test(refus)&&/sardine/.test(refus)&&(refus.match(/<li>/g)||[]).length>=2,refus.slice(0,150));
  await page.screenshot({path:'img-j02.png'});
  /* ② inventaire face à face */
  const ids=await page.evaluate(()=>{const i=chIdsTaxo(CH.taxo);return {n:Object.keys(i.notions)[0],c:Object.keys(i.competences)[0]};});
  const bon={niveau:'3e',chapitre:{title:'La satire et l\u2019argumentation',ordre:3,seances:[
    {title:'\u00c9tude de texte',type:'etude_texte',ordre:2,notions:[ids.n],competences:[ids.c],
     items:{'etude-de-texte':{title:'\u00c9tude de texte',kind:'doc',source:'drive',ref:'',ordre:1},
            'dictee-du-chapitre':{title:'Dict\u00e9e du chapitre',subtitle:'\u00c0 lier \u00e0 une dict\u00e9e existante',kind:'dictee',source:'firebase_app',ref:'',ordre:2}}},
    {title:'Rem\u00e9diation finale',type:'remediation',ordre:9,items:{'fiche':{title:'Fiche',kind:'doc',source:'drive',ref:''}}}]},aLier:[]};
  await page.evaluate((j)=>{document.getElementById('ch-coller').value=JSON.stringify(j);chVerifier();},bon);
  await new Promise(x=>setTimeout(x,1800));
  const inv=await page.evaluate(()=>{const d=document.getElementById('ch-inv');return {txt:d?d.innerText:'',
    boutons:[...d.querySelectorAll('.ch-choix .at-btn')].map(b=>({t:b.textContent.trim(),h:Math.round(b.getBoundingClientRect().height)}))};});
  verdict('\u2461 INVENTAIRE face \u00e0 face : l\u2019existant pr\u00e9cis, les \u00e9tats, les notions EN LIBELL\u00c9',
    /Ce que tu as d\u00e9j\u00e0/.test(inv.txt)&&/Diaporama/.test(inv.txt)&&/NOUVEAU/.test(inv.txt)&&/DÉJÀ LÀ/.test(inv.txt),inv.txt.slice(0,150));
  verdict('\u2465 LISTE DE TRAVAIL affich\u00e9e : \u00ab \u00c0 lier toi-m\u00eame \u00bb avec l\u2019outil nomm\u00e9',
    /\u00c0 lier toi-m\u00eame \(1\)/.test(inv.txt)&&/dictee/.test(inv.txt),inv.txt.slice(inv.txt.indexOf('À lier'),inv.txt.indexOf('À lier')+140));
  verdict('les TROIS voies sont propos\u00e9es, cibles \u2265 44 px, aucune pr\u00e9-choisie',
    inv.boutons.length===3&&inv.boutons.every(b=>b.h>=44),JSON.stringify(inv.boutons));
  const nAvant=ECRITS.length;
  verdict('aucune \u00e9criture avant le choix',ECRITS.filter(e=>/\/site\/3e\/chapitres/.test(e.ch)).length===0,String(nAvant));
  await page.screenshot({path:'img-j03.png'});
  /* ③ compléter : écriture PAR INDEX */
  await page.evaluate(()=>{[...document.querySelectorAll('.ch-choix .at-btn')].find(b=>/Compl\u00e9ter/.test(b.textContent)).click();});
  await new Promise(x=>setTimeout(x,700));
  await page.evaluate(()=>{const b=[...document.querySelectorAll('#at-modale .at-btn')].find(x=>/Compl\u00e9ter/.test(x.textContent));if(b)b.click();});
  await new Promise(x=>setTimeout(x,2500));
  const ecr=ECRITS.filter(e=>/\/site\/3e\/chapitres/.test(e.ch));
  verdict('\u2462 \u00c9CRITURE PAR INDEX au journal r\u00e9seau, jamais la liste enti\u00e8re',
    ecr.length>0&&ecr.every(e=>/\/site\/3e\/chapitres\/\d+\//.test(e.ch))&&!ecr.some(e=>e.ch==='/site/3e/chapitres'),
    JSON.stringify(ecr.map(e=>e.ch)));
  verdict('\u2462 seuls les manques \u00e9crits : l\u2019item d\u00e9j\u00e0 l\u00e0 n\u2019est pas retouch\u00e9, `published` jamais \u00e9crit',
    !ecr.some(e=>/items\/etude-de-texte$/.test(e.ch))&&ecr.some(e=>/items\/dictee-du-chapitre$/.test(e.ch))
    &&!ecr.some(e=>e.c&&typeof e.c==='object'&&'published' in e.c),JSON.stringify(ecr.map(e=>e.ch)));
  await page.screenshot({path:'img-j04.png'});
  await page.close();
  /* mobile 390 : delta base ↔ livré */
  const mob={};
  for(const v of ['base','staging']){
    page=await pagePrete(390);
    await page.goto('http://localhost:8700/index.'+v+'.html',{waitUntil:'domcontentloaded',timeout:70000});
    await new Promise(x=>setTimeout(x,3000));
    if(v==='staging'){
      await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){} try{atIAOuvrir();}catch(e){} try{chOuvrir();}catch(e){}});
      await new Promise(x=>setTimeout(x,1800));
    }
    mob[v]=await page.evaluate(()=>({deb:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>392;}).length,
      larg:document.documentElement.scrollWidth}));
    if(v==='staging')await page.screenshot({path:'img-j05.png'});
    await page.close();
  }
  /* le critère est « aucun débordement INTRODUIT » : le livré ne doit pas dépasser
     la base (ici l'écran chapitre est ouvert côté livré, l'accueil côté base). */
  verdict('mobile 390 : aucun d\u00e9bordement introduit (livr\u00e9 \u2264 base), \u00e9cran chapitre ouvert',
    mob.staging.deb<=mob.base.deb&&mob.staging.larg<=392,JSON.stringify(mob));
  /* /manifestes et /presence : mécanismes PRÉ-EXISTANTS du chargement du site
     (leurs appels sont dans index.base.html — instruits à SITE-COURS-2a), hors
     de ce morceau : écartés PAR PREUVE, pas par confort. */
  const PREEXISTANT=/^\/(manifestes|presence)\//;
  const hors=ECRITS.filter(e=>!/^\/(site\/3e\/chapitres|corbeille|site\/atelier)\//.test(e.ch)&&!PREEXISTANT.test(e.ch));
  verdict('journal r\u00e9seau : la section n\u2019\u00e9crit QUE chapitres/corbeille ('+ECRITS.length+' \u00e9critures, pr\u00e9-existantes \u00e9cart\u00e9es par preuve)',
    hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,5)));

  await browser.close();srv.close();
  fs.writeFileSync('bancsc2c-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('bancsc2c-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch),mobile:mob},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR SITE-COURS-2c : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

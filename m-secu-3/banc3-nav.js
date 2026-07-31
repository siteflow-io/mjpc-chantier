/* BANC NAVIGATEUR M-SÉCU-3 — serveur local + hub intercepté (REST). Le bouton
   réel est cliqué, la purge part en PATCH interceptés, les modales se lisent,
   le refus élève « sans empreinte » s'affiche avec le texte exact. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CHROME+'/chrome-linux64/chrome';
const SECRET='phrase du banc du retrait 2026';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,150)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,130)));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function constante(src,nom){return new RegExp('^var '+nom+'=.*$','m').exec(src)[0];}

(async()=>{
  /* le hub de banc, préparé avec la vraie §11 */
  const canon=fs.readFileSync('/home/claude/m-secu2/build/canon-1.3.0.js','utf8');
  const env={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),Promise};
  vm.createContext(env);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcSelAleatoire','mjpcEmpreinte','sanMJPC'].map(f=>extraire(canon,f)).join('\n')
    +'\n'+constante(canon,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canon,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canon,'MJPC_COFFRE_ITER_EMPREINTE'),env);
  const cle=await env.mjpcDeriverCle(SECRET);
  const CANARI=await env.mjpcChiffrer(cle,'MJPC-CANARI|coffre-v1');
  const NOMS=['BERNARD Emma T-401','DUPONT Marie T-402','LEROY Hugo T-403','MARTIN Lucas T-404'];
  const HUB={'/site/config/coffreCanari':CANARI,'/site/config/profEmpreintes':[],'/classes':{}};
  const selP=env.mjpcSelAleatoire();
  HUB['/site/config/profEmpreintes']=[{sel:selP,empreinte:await env.mjpcEmpreinte('7642',selP)}];
  const codes={};
  for(let i=0;i<4;i++){const sel=env.mjpcSelAleatoire();const c='42'+(i+1)+'0';
    codes[env.sanMJPC(NOMS[i])]={code:c,name:NOMS[i],sel,empreinte:await env.mjpcEmpreinte(c,sel),chiffre:await env.mjpcChiffrer(cle,c)};}
  codes['ELIO-9998']='vieux-nu';
  /* + une entrée SANS empreinte pour le refus élève (apps) — mise dans un hub SÉPARÉ pour ne pas bloquer le bouton du site */
  const codesApps=JSON.parse(JSON.stringify(codes));
  codesApps[env.sanMJPC('MOREAUT405 L\u00e9a')]={code:'4550',name:'MOREAUT405 L\u00e9a'};
  HUB['/codes']=codes;
  /* classes pour les portails des apps */
  HUB['/classes']={'_test_banc':{eleves:NOMS.concat(['MOREAUT405 L\u00e9a'])}};

  const RESEAU=[];const PATCHS=[];
  const srv=http.createServer((rq,rs)=>{
    const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}
    else{rs.statusCode=404;rs.end('');}
  }).listen(8645);

  const browser=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  function hubGet(u,apps_){
    const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
    if(ch==='/codes')return apps_?codesApps:HUB['/codes'];
    return ch in HUB?HUB[ch]:null;
  }
  async function pagePrete(largeur,apps_){
    const page=await browser.newPage();
    await page.setViewport({width:largeur||1280,height:largeur?844:900});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();RESEAU.push({m:r.method(),u});
      if(u.includes('firebasedatabase.app')){
        const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE','Access-Control-Allow-Headers':'*'};
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(hubGet(u,apps_))});
        if(r.method()==='PUT'||r.method()==='PATCH'){
          const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
          let corps=null;try{corps=JSON.parse(r.postData()||'null');}catch(e){}
          PATCHS.push({m:r.method(),ch,corps});
          if(r.method()==='PATCH'&&ch.startsWith('/codes/')){const k=ch.split('/')[2];const c=HUB['/codes'][k];if(c&&corps&&corps.code===null)delete c.code;}
          if(r.method()==='PUT')HUB[ch]=corps;
          return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(corps)});
        }
        return r.abort();
      }
      if(u.includes('unpkg.com/react@18/umd/react.production'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@18'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-app'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbapp.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-database'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbdb.js')});
      if(u.startsWith('http://localhost:8645'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();
    });
    await page.evaluateOnNewDocument(s=>{try{localStorage.setItem('mjpc_coffre_secret',s);}catch(e){}},SECRET);
    return page;
  }

  /* ═══ LE SITE : le bouton, la modale, la purge ═══ */
  let page=await pagePrete();
  page.on('pageerror',e=>console.log('PAGEERR:',String(e).slice(0,120)));
  await page.goto('http://localhost:8645/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(x=>setTimeout(x,4500)); /* secuInit : dérivation + canari */
  const etat=await page.evaluate(()=>({valide:window.SECU&&SECU.valide,codes:Object.keys(window.codesData||{}).length}));
  verdict('site : la cl\u00e9 m\u00e9moris\u00e9e est valid\u00e9e au chargement (canari)',etat.valide===true,JSON.stringify(etat));
  await page.evaluate(()=>{loginAsProf();showProfSection('eleves');});
  await new Promise(x=>setTimeout(x,1200));
  const btn=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Retirer les codes en clair/.test(x.textContent));if(!b)return null;b.scrollIntoView();const r=b.getBoundingClientRect();return {h:Math.round(r.height)};});
  verdict('site : le bouton \u00ab Retirer les codes en clair \u00bb est rendu dans l\u2019encart',!!btn,JSON.stringify(btn));
  await page.screenshot({path:'img-c01.png'});
  await page.evaluate(()=>{[...document.querySelectorAll('button')].find(x=>/Retirer les codes en clair/.test(x.textContent)).click();});
  await new Promise(x=>setTimeout(x,2500));
  const modale1=await page.evaluate(()=>{const m=document.querySelector('.cm-body,.console-modal,.cm-sub');return m?document.body.innerText.slice(0,2000):null;});
  verdict('site : la modale d\u00e9nombre (4 codes, vestige annonc\u00e9) AVANT toute action',
    modale1&&/4/.test(modale1)&&/corbeille/i.test(modale1),String(modale1).slice(0,120));
  await page.screenshot({path:'img-c02.png'});
  const nbPatchAvant=PATCHS.length;
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Retirer maintenant/.test(x.textContent));if(b)b.click();});
  await new Promise(x=>setTimeout(x,3500));
  const arch=PATCHS.find(p=>p.m==='PUT'&&p.ch.startsWith('/corbeille/retrait-clair-'));
  const patchs=PATCHS.filter(p=>p.m==='PATCH'&&p.ch.startsWith('/codes/'));
  const ordreOK=arch&&patchs.length===4&&PATCHS.indexOf(arch)<PATCHS.indexOf(patchs[0]);
  verdict('site : ARCHIVE en corbeille PUIS 4 PATCH {code:null} \u2014 l\u2019ordre r\u00e9el du r\u00e9seau',ordreOK,`arch=${!!arch} patchs=${patchs.length}`);
  const archComplete=arch&&arch.corps&&arch.corps._meta&&arch.corps.data&&Object.values(arch.corps.data).some(v=>v&&v.code);
  verdict('site : l\u2019archive {_meta,data} porte le clair (restauration possible)',!!archComplete);
  const sansClair=Object.values(HUB['/codes']).filter(v=>typeof v==='object').every(v=>v.code===undefined);
  const chiffreReste=Object.values(HUB['/codes']).filter(v=>typeof v==='object').every(v=>v.chiffre);
  verdict('site : apr\u00e8s le geste, /codes du hub de banc SANS clair, le chiffr\u00e9 RESTE, vestige intact',
    sansClair&&chiffreReste&&HUB['/codes']['ELIO-9998']==='vieux-nu');
  await page.screenshot({path:'img-c03.png'});
  await page.close();

  /* ═══ UNE APP : refus « sans empreinte » avec le texte exact + bandeau ═══ */
  page=await pagePrete(undefined,true);
  page.on('pageerror',e=>console.log('APP-ERR:',String(e).slice(0,140)));
  await page.evaluateOnNewDocument(()=>{try{sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');}catch(e){}});
  await page.goto('http://localhost:8645/analyse_logique.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#mjpc-secu2-profbtn',{timeout:30000}).catch(()=>{});
  verdict('app : le bandeau \u00ab cl\u00e9 m\u00e9moris\u00e9e \u00bb est toujours l\u00e0 (M-S\u00c9CU-2 conserv\u00e9)',!!(await page.$('#mjpc-secu2-profbtn')));
  await page.waitForFunction('document.querySelectorAll("input").length>=3',{timeout:30000}).catch(()=>{});
  /* le SDK (websocket) est aborté au banc : les données s'injectent APRÈS l'init de l'app ; l'UI reste la vraie */
  await page.evaluate((cd,cl)=>{window.codesData=cd;window.classesData=cl;},codesApps,HUB['/classes']);
  const login=await page.evaluate(async(nom)=>{
    const ins=[...document.querySelectorAll('input')].filter(i=>i.type!=='checkbox');
    if(ins.length<3)return 'pas de portail ('+document.querySelectorAll('input').length+' inputs)';
    const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};
    /* le portail d'analyse_logique présente : code, nom, prénom */
    set(ins[0],'4550');set(ins[1],'MOREAUT405');set(ins[2],'L\u00e9a');
    const b=[...document.querySelectorAll('button')].find(x=>/entrer|connexion|valider|go/i.test(x.textContent))||document.querySelector('button');
    b.click();
    await new Promise(r=>setTimeout(r,2500));
    return document.body.innerText;
  });
  verdict('app : entr\u00e9e SANS empreinte \u2192 le message impersonnel EXACT s\u2019affiche',
    /Ce code n\u2019ouvre pas encore cet espace\. Il sera renouvel\u00e9 en classe/.test(login),String(login).slice(-350));
  await page.screenshot({path:'img-c04.png'});
  await page.close();

  /* mobile 390 : le bandeau + le bouton du site */
  page=await pagePrete(390);
  await page.goto('http://localhost:8645/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:30000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,800));
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} showProfSection('eleves');});
  await new Promise(x=>setTimeout(x,1200));
  const mes=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Retirer les codes en clair/.test(x.textContent));if(!b)return null;
    let ch=[],e=b;while(e&&e!==document.body){const cs=getComputedStyle(e);if(cs.display==='none')ch.push((e.id||e.className||e.tagName)+':none');e=e.parentElement;}
    if(ch.length)return {caches:ch};
    b.scrollIntoView();const r=b.getBoundingClientRect();return {h:Math.round(r.height),w:Math.round(r.width),deborde:r.right>391||r.left<-1};});
  verdict('mobile 390 : le bouton mesur\u00e9 (\u2265 40 px, z\u00e9ro d\u00e9bordement)',mes&&mes.h>=40&&!mes.deborde,JSON.stringify(mes));
  await page.screenshot({path:'img-c05.png'});
  await page.close();

  /* la clé sous quatre formes dans le réseau entier */
  const s4=[SECRET,Buffer.from(SECRET).toString('base64'),encodeURIComponent(SECRET),JSON.stringify(SECRET)];
  const fuites=RESEAU.filter(x=>s4.some(f=>x.u.includes(f)))
    .concat(PATCHS.filter(p=>s4.some(f=>JSON.stringify(p.corps||'').includes(f))));
  verdict('la cl\u00e9 ne sort JAMAIS ('+RESEAU.length+' requ\u00eates + '+PATCHS.length+' \u00e9critures, 4 formes)',RESEAU.length>0&&fuites.length===0);

  await browser.close();srv.close();
  fs.writeFileSync('banc3-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('banc3-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:PATCHS.map(p=>({m:p.m,ch:p.ch}))},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR M-S\u00c9CU-3 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

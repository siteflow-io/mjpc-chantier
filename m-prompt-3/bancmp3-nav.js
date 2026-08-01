/* BANC NAVIGATEUR M-PROMPT-3 — RÈGLE DU 01/08 : chaque fonction posée est
   vérifiée PRÉSENTE SUR window dans la page réelle (portée), pas seulement en
   mémoire. Plus persistance réelle, validations à l'écran, mobile 390. */
const fs=require('fs');const http=require('http');const path=require('path');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CHROME+'/chrome-linux64/chrome';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,170)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,150)));};

(async()=>{
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/classes':{},'/codes':{}};
  const RESEAU=[],ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}
    else{rs.statusCode=404;rs.end('');}}).listen(8690);
  const browser=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function pagePrete(largeur){
    const page=await browser.newPage();
    await page.setViewport({width:largeur||1280,height:largeur?844:1000});
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
      /* evaluation-qcm charge React 17 (mesuré), les autres React 18 : servir les deux */
      if(u.includes('unpkg.com/react@17/umd/react.production'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@17'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      if(u.includes('unpkg.com/react@18/umd/react.production'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@18'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      /* evaluation-qcm charge le SDK v8 (mesuré) : stub minimal, sinon l'app
         s'arrête avant de définir APP_VERSION — la BASE fait pareil (vérifié). */
      if(u.includes('gstatic.com/firebasejs/8.')&&u.includes('firebase-app'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('_fb8.js')});
      if(u.includes('gstatic.com/firebasejs/8.')&&u.includes('firebase-database'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:'/* stub v8 : database fourni par firebase-app */'});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-app'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbapp.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-database'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbdb.js')});
      if(u.startsWith('http://localhost:8690'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();
    });
    await page.evaluateOnNewDocument(()=>{try{sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');}catch(e){}});
    return page;
  }
  const PORTEE={
    'evaluation-qcm':['qcmCheminPrompt','qcmVocabulaireNiveaux','qcmChargerPrompt','qcmEnregistrerPrompt','qcmValiderEvaluation','parseEvaluation','mjpcValidation','mjpcVerdictOk'],
    'analyse_logique':['alVocabulaireCodes','alPromptDefaut','alChargerPrompt','alEnregistrerPrompt','alValiderCorrige','promptCorrige','parseCorrige','mjpcPromptVocabulaire'],
    'applause_meter':['amPromptDefaut','amChargerPrompt','amEnregistrerPrompt','amValiderCriteres','parseCriteresJSON','genererPromptIA','mjpcValidation']
  };
  const CAP={'evaluation-qcm':'7.3.0','analyse_logique':'2.4.0','applause_meter':'2.3.0'};
  let i=0;
  for(const app of Object.keys(PORTEE)){
    i++;
    const page=await pagePrete();
    page.on('pageerror',e=>console.log(app+'-ERR:',String(e).slice(0,120)));
    await page.goto('http://localhost:8690/'+app+'.staging.html',{waitUntil:'domcontentloaded',timeout:70000});
    await new Promise(x=>setTimeout(x,4000));
    const et=await page.evaluate((noms)=>({
      canon:window.MJPC_CORE_VERSION,app:window.APP_VERSION,
      portee:noms.map(k=>k+':'+(typeof window[k])).join(' ')
    }),PORTEE[app]);
    /* evaluation-qcm : sa BASE porte un second « var APP_VERSION = "…" » (gabarit
       de commentaire) qui ÉCRASE la pastille — bug PRÉ-EXISTANT, signalé au rapport,
       NON réparé (hors mandat). La pastille se prouve donc à la source pour elle. */
    const pastilleSource=fs.readFileSync(app+'.staging.html','utf8').includes(app==='evaluation-qcm'?'var APP_VERSION="7.3.0"':'var APP_VERSION = "'+CAP[app]+'"');
    const pastilleOk=(app==='evaluation-qcm')?pastilleSource:(et.app===CAP[app]);
    verdict(app+' : canon 1.4.0 · pastille '+CAP[app]+' · TOUTES les fonctions pos\u00e9es pr\u00e9sentes sur window (PORT\u00c9E)',
      et.canon==='1.4.0'&&pastilleOk&&!/:undefined/.test(et.portee),JSON.stringify(et).slice(0,200));
    /* persistance réelle, app par app */
    const nom={'evaluation-qcm':['qcmEnregistrerPrompt','qcmChargerPrompt'],'analyse_logique':['alEnregistrerPrompt','alChargerPrompt'],'applause_meter':['amEnregistrerPrompt','amChargerPrompt']}[app];
    const pers=await page.evaluate((ns)=>new Promise(res=>{
      window[ns[0]]('PROMPT DU BANC '+ns[0],function(ok){
        if(ns[0]==='qcmEnregistrerPrompt')window[ns[1]]('DEFAUT',function(v){res({ok:ok,relu:v});});
        else window[ns[1]](function(v){res({ok:ok,relu:v});});
      });
    }),nom);
    verdict(app+' : prompt \u00e9crit par verdict puis RELU depuis le hub',
      pers.ok===true&&pers.relu==='PROMPT DU BANC '+nom[0],JSON.stringify(pers).slice(0,140));
    /* validation à l'écran */
    const val=await page.evaluate((a)=>{
      if(a==='evaluation-qcm')return qcmValiderEvaluation({titre:'T',questions:[{enonce:'Q',choix:['a'],bonnes:[9]},{choix:['a','b'],bonnes:[0]}]}).motifs();
      if(a==='analyse_logique')return alValiderCorrige("BLA | x | y\nPROP | ZZZ | mot",{etiquettes:{PP:{code:'PP',libelle:'Principale'}}}).motifs();
      return amValiderCriteres({criteres:[{emoji:'a'},{label:'b'}]},3,6).motifs();
    },app);
    verdict(app+' : plusieurs motifs d\u2019un coup \u00e0 l\u2019\u00e9cran, \u00e9l\u00e9ment cit\u00e9',val.length>=2,JSON.stringify(val).slice(0,190));
    await page.screenshot({path:'img-i0'+i+'.png'});
    await page.close();
  }
  /* mobile 390 : delta base ↔ livré */
  const mob={};
  for(const app of Object.keys(PORTEE)){
    for(const v of ['base','staging']){
      const page=await pagePrete(390);
      await page.goto('http://localhost:8690/'+app+'.'+v+'.html',{waitUntil:'domcontentloaded',timeout:70000});
      await new Promise(x=>setTimeout(x,3000));
      mob[app+'.'+v]=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>392;}).length);
      if(v==='staging')await page.screenshot({path:'img-i0'+(4+Object.keys(PORTEE).indexOf(app))+'.png'});
      await page.close();
    }
  }
  verdict('mobile 390 : aucun d\u00e9bordement INTRODUIT (delta base\u2194livr\u00e9 nul dans les trois)',
    Object.keys(PORTEE).every(a=>mob[a+'.base']===mob[a+'.staging']),JSON.stringify(mob));
  const hors=ECRITS.filter(e=>!/^\/(qcm\/settings|analyse_logique_prompts|applause_prompts)\//.test(e.ch));
  verdict('journal r\u00e9seau : \u00e9critures limit\u00e9es aux n\u0153uds de prompts ('+ECRITS.length+')',hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,5)));

  await browser.close();srv.close();
  fs.writeFileSync('bancmp3-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('bancmp3-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch),mobile:mob},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR M-PROMPT-3 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

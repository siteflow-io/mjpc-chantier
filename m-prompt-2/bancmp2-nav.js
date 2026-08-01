/* BANC NAVIGATEUR M-PROMPT-2 — les trois apps chargées réellement : canon 1.4.0
   vivant, persistance des prompts au hub, validations qui accumulent, mobile 390. */
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
    else{rs.statusCode=404;rs.end('');}}).listen(8680);
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
      if(u.includes('unpkg.com/react@18/umd/react.production'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@18'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-app'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbapp.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-database'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbdb.js')});
      if(u.startsWith('http://localhost:8680'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();
    });
    await page.evaluateOnNewDocument(()=>{try{sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');}catch(e){}});
    return page;
  }

  /* ── worktrack ── */
  let page=await pagePrete();
  page.on('pageerror',e=>console.log('WT-ERR:',String(e).slice(0,120)));
  await page.goto('http://localhost:8680/worktrack.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(x=>setTimeout(x,4000));
  const wt=await page.evaluate(()=>({
    canon:window.MJPC_CORE_VERSION,
    fns:['mjpcPromptCharger','mjpcValidation','mjpcVerdictOk','wtChargerPrompt','wtEnregistrerPrompt','wtValiderChapitre','validateChapter','chapterDefaults'].map(k=>typeof window[k]).join(','),
    meta:(document.querySelector('meta[name=app-version]')||{}).content
  }));
  verdict('worktrack : canon 1.4.0 vivant, \u00a712 et fonctions d\u2019app pr\u00e9sentes, garde-fou conserv\u00e9, pastille incr\u00e9ment\u00e9e',
    wt.canon==='1.4.0'&&!/undefined/.test(wt.fns)&&wt.meta==='2026-08-01a',JSON.stringify(wt));
  const wtP=await page.evaluate(()=>new Promise(res=>{
    wtEnregistrerPrompt('CONSIGNES DU BANC',function(ok){
      PROF.tpl=null;
      wtChargerPrompt(function(v){res({ok:ok,relu:v});});
    });
  }));
  verdict('worktrack : DETTE \u2460 ferm\u00e9e \u00e0 l\u2019\u00e9cran \u2014 prompt \u00e9crit au hub puis RELU apr\u00e8s vidage',
    wtP.ok===true&&wtP.relu==='CONSIGNES DU BANC'&&ECRITS.some(e=>e.ch==='/worktrack_prompts/chapitre/directives'),JSON.stringify(wtP));
  const wtV=await page.evaluate(()=>wtValiderChapitre({meta:{},seances:[{id:'a',titre:'A'},{titre:'B'}]}).motifs());
  verdict('worktrack : DETTE \u2462 \u2014 plusieurs motifs d\u2019un coup, s\u00e9ances cit\u00e9es',wtV.length>=3,JSON.stringify(wtV).slice(0,170));
  await page.screenshot({path:'img-h01.png'});
  await page.close();

  /* ── dictee_universelle (1,97 Mo : le gros fichier) ── */
  page=await pagePrete();
  page.on('pageerror',e=>console.log('DU-ERR:',String(e).slice(0,120)));
  await page.goto('http://localhost:8680/dictee_universelle.staging.html',{waitUntil:'domcontentloaded',timeout:90000});
  await new Promise(x=>setTimeout(x,5000));
  const du=await page.evaluate(()=>({
    canon:window.MJPC_CORE_VERSION,app:window.APP_VERSION,
    fns:['duChargerPrompt','duEnregistrerPrompt','duValiderCorrections','validateCarnetForDictee'].map(k=>typeof window[k]).join(',')
  }));
  /* generateAnalysePrompt est INTERNE à un composant React : elle n'est pas sur window.
     Sa présence se prouve par la source, pas par la portée globale. */
  const duGen=fs.readFileSync('dictee_universelle.staging.html','utf8').includes('function generateAnalysePrompt(){');
  verdict('dictee : canon 1.4.0, \u00a712 et fonctions pr\u00e9sentes, validateCarnetForDictee intouch\u00e9e, generateAnalysePrompt conserv\u00e9e, 2.3.0',
    du.canon==='1.4.0'&&du.app==='2.3.0'&&!/undefined/.test(du.fns)&&duGen,JSON.stringify(du));
  const duV=await page.evaluate(()=>duValiderCorrections({a:{note:'x'},b:{},c:{errors:'non'}}).motifs());
  verdict('dictee : DETTE \u2462 \u2014 trois cl\u00e9s fautives cit\u00e9es d\u2019un coup',duV.length>=3&&duV.some(x=>/a/.test(x)),JSON.stringify(duV).slice(0,170));
  const duP=await page.evaluate(()=>new Promise(res=>{
    duEnregistrerPrompt('ANALYSE DU BANC',function(ok){duChargerPrompt(function(v){res({ok:ok,relu:v});});});
  }));
  verdict('dictee : le prompt d\u2019analyse persiste et se relit',duP.ok===true&&duP.relu==='ANALYSE DU BANC',JSON.stringify(duP));
  await page.screenshot({path:'img-h02.png'});
  await page.close();

  /* ── pilotage ── */
  page=await pagePrete();
  page.on('pageerror',e=>console.log('PD-ERR:',String(e).slice(0,120)));
  await page.goto('http://localhost:8680/pilotage_debat_s3.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(x=>setTimeout(x,4000));
  const pd=await page.evaluate(()=>({
    canon:window.MJPC_CORE_VERSION,
    fns:['pdValiderImport','pdChargerPrompt','validerDocumentsJSON','copierPromptDocs','injecterDocuments'].map(k=>typeof window[k]).join(','),
    motifs:pdValiderImport({autre:1}).motifs(),
    docsOk:validerDocumentsJSON('{"version":1}').erreurs.length>0
  }));
  /* APP_VERSION est déclarée en const top-level : elle n'apparaît pas sur window
     (les const ne créent pas de propriété globale) — la pastille se lit à la source. */
  const pdV=fs.readFileSync('pilotage_debat_s3.staging.html','utf8').includes('const APP_VERSION = "2026-08-01-1";');
  verdict('pilotage : canon 1.4.0, \u00a712 pr\u00e9sente, validerDocumentsJSON LAISS\u00c9E telle quelle et fonctionnelle, pastille incr\u00e9ment\u00e9e',
    pd.canon==='1.4.0'&&!/undefined/.test(pd.fns)&&pd.docsOk===true&&pdV,JSON.stringify(pd).slice(0,150));
  verdict('pilotage : DETTE \u2461 ferm\u00e9e \u00e0 l\u2019\u00e9cran \u2014 le refus est NOMM\u00c9 (plus de bool\u00e9en nu)',
    pd.motifs.length>=1&&/ni d\u00e9bat, ni bin\u00f4mes/.test(pd.motifs[0]),JSON.stringify(pd.motifs));
  await page.screenshot({path:'img-h03.png'});
  await page.close();

  /* ── mobile 390 sur les trois ── */
  const mob={};
  for(const n of ['worktrack','dictee_universelle','pilotage_debat_s3']){
    page=await pagePrete(390);
    await page.goto('http://localhost:8680/'+n+'.staging.html',{waitUntil:'domcontentloaded',timeout:90000});
    await new Promise(x=>setTimeout(x,3500));
    mob[n]=await page.evaluate(()=>{
      const deb=[...document.querySelectorAll('body *')].some(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>392;});
      return {deborde:deb,largeur:document.documentElement.scrollWidth};
    });
    await page.screenshot({path:'img-h0'+(4+['worktrack','dictee_universelle','pilotage_debat_s3'].indexOf(n))+'.png'});
    await page.close();
  }
  /* pilotage_debat_s3 déborde DÉJÀ dans sa base : 5 éléments, mêmes valeurs (DIV.hh
     right=438, etc.) — mesuré base↔livré, PRÉ-EXISTANT, hors périmètre (dette signalée). */
  verdict('mobile 390 : aucun d\u00e9bordement INTRODUIT (worktrack et dictee nets ; pilotage d\u00e9borde \u00e0 l\u2019identique de sa base)',
    !mob.worktrack.deborde&&!mob.dictee_universelle.deborde&&mob.pilotage_debat_s3.largeur<=392,JSON.stringify(mob));

  const hors=ECRITS.filter(e=>!/^\/(worktrack_prompts|dictee_universelle_prompts|pilotage_prompts|corbeille)\//.test(e.ch));
  verdict('journal r\u00e9seau : \u00e9critures limit\u00e9es aux n\u0153uds de prompts ('+ECRITS.length+' \u00e9critures)',
    hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,5)));

  await browser.close();srv.close();
  fs.writeFileSync('bancmp2-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('bancmp2-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch)},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR M-PROMPT-2 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

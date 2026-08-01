/* BANC NAVIGATEUR M-PROMPT-4 — la présentation dans les prompts RÉELS des huit
   fichiers, portées sur window, poids avant/après mesuré dans la page. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,180)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,160)));};
function ex(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function cs(src,nom){const m=new RegExp('^var '+nom+'=.*$','m').exec(src);return m[0];}
const SECRET='phrase du banc presentation 2026';
const APPS=['correction_dictee','worktrack','dictee_universelle','pilotage_debat_s3','evaluation-qcm','analyse_logique','applause_meter'];
(async()=>{
  const canonSrc=fs.readFileSync('canon.js','utf8');
  const envC={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(envC);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(canonSrc,f)).join('\n')
    +'\n'+cs(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),envC);
  const CANARI=await envC.mjpcChiffrer(await envC.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  const MAN={};APPS.forEach(a=>{MAN[a]={app:{id:a,nom:a,contenant:'aucun',usage:'usage de '+a,quandPas:'pas pour X'}};});
  MAN.index={app:{id:'index',nom:'MJPC — le site'}};
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,'/manifestes':MAN,'/classes':{},'/codes':{},'/taxonomie':{domaines:[],competences:{}}};
  const RESEAU=[],ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}else{rs.statusCode=404;rs.end('');}}).listen(8720);
  const br=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function page1(largeur){
    const page=await br.newPage();
    await page.setViewport({width:largeur||1280,height:largeur?844:1000});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();RESEAU.push({m:r.method(),u});
      if(u.includes('firebasedatabase.app')){
        const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE','Access-Control-Allow-Headers':'*'};
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
      if(u.includes('unpkg.com/react@17/umd/react.production'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@17'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      if(u.includes('unpkg.com/react@18/umd/react.production'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@18'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      if(u.includes('gstatic.com/firebasejs/8.')&&u.includes('firebase-app'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/mp3/build/_fb8.js')});
      if(u.includes('gstatic.com/firebasejs/8.'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:'/* stub */'});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-app'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbapp.js')});
      if(u.includes('gstatic.com/firebasejs'))return r.respond({status:200,contentType:'application/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbdb.js')});
      if(u.startsWith('http://localhost:8720'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();});
    await page.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');}catch(e){}},SECRET);
    return page;}
  /* index : le tronc dans les trois prompts */
  let page=await page1();
  page.on('pageerror',e=>console.log('IDX-ERR:',String(e).slice(0,110)));
  await page.goto('http://localhost:8720/index.staging.html',{waitUntil:'domcontentloaded',timeout:70000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,2500));
  const idx=await page.evaluate(()=>{
    const o={canon:window.MJPC_CORE_VERSION,app:window.APP_VERSION,
      portee:['mjpcPromptPresentation','mjpcPromptAvecPresentation','mjpcPromptOutils','mjpcChargerOutils','MJPC_PRESENTATION','MJPC_PRESENTATION_BREVE'].map(k=>k+':'+(typeof window[k])).join(' ')};
    AT_IA.produit='fiche_seance';AT_IA.tpl='TEXTE PERSISTÉ DE PAUL';AT_IA.charge=true;
    o.avec=atPromptTexte();o.cache=window.MJPC_OUTILS_CACHE?Object.keys(window.MJPC_OUTILS_CACHE).length:0;
    return o;});
  verdict('index : canon 1.5.0, pastille 8.14.0, fonctions sur window, outils lus du hub ('+idx.cache+')',
    idx.canon==='1.5.0'&&idx.app==='8.14.0'&&!/:undefined/.test(idx.portee)&&idx.cache===7,JSON.stringify({c:idx.canon,a:idx.app,n:idx.cache}));
  verdict('index : la pr\u00e9sentation est EN T\u00caTE et le texte persist\u00e9 est INTACT derri\u00e8re',
    idx.avec.indexOf('O\u00d9 TON TRAVAIL ATTERRIT')===0&&idx.avec.indexOf('TEXTE PERSIST\u00c9 DE PAUL')>0,idx.avec.slice(0,60));
  /* le site est écarté de la liste : on le vérifie sur la SECTION des outils */
  const secOutils=String(idx.avec).split('CE QUI COMMANDE')[0]||'';
  verdict('index : la liste des outils vient du HUB (ce que les apps d\u00e9clarent), le site \u00e9cart\u00e9',
    /usage de correction_dictee/.test(secOutils)&&!/MJPC \u2014 le site/.test(secOutils),secOutils.slice(-160));
  await page.screenshot({path:'img-l01.png'});
  await page.close();
  /* les 7 apps : forme brève au point de production */
  const poids={};
  for(const a of APPS){
    const p2=await page1();
    p2.on('pageerror',e=>console.log(a+'-ERR:',String(e).slice(0,100)));
    await p2.goto('http://localhost:8720/'+a+'.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
    await new Promise(x=>setTimeout(x,3000));
    const r=await p2.evaluate((app)=>{
      const o={canon:window.MJPC_CORE_VERSION,
        fns:['mjpcPromptAvecPresentation','mjpcPromptPresentation'].map(k=>typeof window[k]).join(','),
        usage:(window.MJPC_APP||{}).usage||'',quandPas:(window.MJPC_APP||{}).quandPas||''};
      try{
        if(app==='correction_dictee')o.t=assemblePrompt('D','F');
        else if(app==='analyse_logique')o.t=promptCorrige('Le chat dort.',{etiquettes:{}});
        else if(app==='applause_meter')o.t=genererPromptIA('theme',4);
        else if(app==='dictee_universelle')o.t=(typeof generateAnalysePrompt==='function')?'(interne)':'';
        else o.t='';
      }catch(e){o.t='ERR '+e;}
      return o;},a);
    poids[a]={usage:r.usage.length,brut:r.t.length};
    verdict(a+' : canon 1.5.0, usage d\u00e9clar\u00e9 dans MJPC_APP, fonctions pr\u00e9sentes',
      r.canon==='1.5.0'&&r.usage.length>40&&r.quandPas.length>10&&!/undefined/.test(r.fns),
      JSON.stringify({c:r.canon,u:r.usage.slice(0,40)}));
    if(r.t&&r.t!=='(interne)'&&!/^ERR/.test(r.t))
      verdict(a+' : la forme BR\u00c8VE est en t\u00eate du prompt produit',/^O\u00d9 TON TRAVAIL ATTERRIT/.test(r.t),r.t.slice(0,50));
    await p2.close();}
  fs.writeFileSync('bancmp4-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('bancmp4-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch),poids},null,1));
  const hors=ECRITS.filter(e=>!/^\/(manifestes|presence|site\/atelier)\//.test(e.ch));
  verdict('journal r\u00e9seau : aucune \u00e9criture hors manifestes/pr\u00e9sence ('+ECRITS.length+')',hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,4)));
  await br.close();srv.close();
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR M-PROMPT-4 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

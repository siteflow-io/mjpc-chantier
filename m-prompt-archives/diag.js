const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const pup=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){return new RegExp('^var '+n+'=.*$','m').exec(s)[0];}
const S='diag 2026';
(async()=>{
  const src=fs.readFileSync('index.staging.html','utf8');
  const e0={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(e0);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(src,f)).join('\n')
    +'\n'+cs(src,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(src,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(src,'MJPC_COFFRE_ITER_EMPREINTE'),e0);
  const CANARI=await e0.mjpcChiffrer(await e0.mjpcDeriverCle(S),'MJPC-CANARI|coffre-v1');
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,
    '/manifestes':{},'/classes':{},'/codes':{},'/taxonomie':{domaines:[],competences:{}}};
  const srv=http.createServer((rq,rs)=>{const f=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(f)&&fs.statSync(f).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(f));}else{rs.statusCode=404;rs.end('');}}).listen(8795);
  const br=await pup.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  const pg=await br.newPage();await pg.setViewport({width:1300,height:1000});
  await pg.setRequestInterception(true);
  pg.on('request',r=>{const u=r.url();const H={'Access-Control-Allow-Origin':'*'};
    if(u.includes('firebasedatabase.app')){const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
      if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
      return r.respond({status:200,contentType:'application/json',headers:H,body:'null'});}
    if(u.startsWith('http://localhost:8795'))return r.continue();
    return r.abort();});
  await pg.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);}catch(e){}},S);
  pg.on('pageerror',e=>console.log('ERR:',String(e).slice(0,140)));
  await pg.goto('http://localhost:8795/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:30000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1500));
  await pg.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){}});
  await new Promise(x=>setTimeout(x,1200));
  const r=await pg.evaluate(()=>{
    const o={produitAvant:AT_IA.produit,tplAvant:AT_IA.tpl===null?'null':String(AT_IA.tpl).length,charge:AT_IA.charge};
    try{o.seed=Object.keys(ATELIER_PROMPT_SEED);}catch(e){o.seed='ERR '+e.message;}
    try{o.texte=atPromptTexte().length;}catch(e){o.texte='ERR '+e.message;}
    try{o.complet=atPromptComplet().length;}catch(e){o.complet='ERR '+e.message;}
    atIAOuvrir();
    return o;});
  console.log('AVANT atIAOuvrir :',JSON.stringify(r));
  await new Promise(x=>setTimeout(x,2500));
  const r2=await pg.evaluate(()=>{
    const t=document.getElementById('at-ia-tpl-vue');
    let c='?';try{c=atPromptComplet().length;}catch(e){c='ERR '+e.message;}
    return {produit:AT_IA.produit,tpl:AT_IA.tpl===null?'null':String(AT_IA.tpl).length,
      champ:t?t.value.length:'ABSENT',complet:c};});
  console.log('APRÈS atIAOuvrir :',JSON.stringify(r2));
  await br.close();srv.close();process.exit(0);
})().catch(e=>{console.error(e);process.exit(2);});

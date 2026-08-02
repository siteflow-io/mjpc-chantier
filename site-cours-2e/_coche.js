/* recherche ciblée : le sommaire COCHÉ (cas nominal) s'écrit-il vraiment ? */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){return new RegExp('^var '+n+'=.*$','m').exec(s)[0];}
const SECRET='phrase du banc 2e 2026';
(async()=>{
  const canonSrc=fs.readFileSync('canon.js','utf8');
  const e0={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(e0);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(canonSrc,f)).join('\n')
    +'\n'+cs(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),e0);
  const CANARI=await e0.mjpcChiffrer(await e0.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  const taxo=JSON.parse(fs.readFileSync('taxo.json','utf8'));
  const existant={title:'La satire',ordre:3,published:{'3e_x':true},seances:[
    {title:'\u00c9tude de texte',type:'etude_texte',items:{'etude':{title:'\u00c9tude',kind:'doc',source:'drive',ref:''}}}]};
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,'/taxonomie':taxo,'/classes':{},'/codes':{},
    '/site/3e':{chapitres:[null,JSON.parse(JSON.stringify(existant))]},
    '/site/3e/chapitres':[null,JSON.parse(JSON.stringify(existant))]};
  const ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}else{rs.statusCode=404;rs.end('');}}).listen(8741);
  const br=await puppeteer.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await br.newPage();
  await page.setViewport({width:1280,height:1100});
  await page.setRequestInterception(true);
  page.on('request',r=>{const u=r.url();
    if(u.includes('firebasedatabase.app')){
      const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH','Access-Control-Allow-Headers':'*'};
      const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
      if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
      if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
      let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
      ECRITS.push({ch,c});if(r.method()==='PUT')HUB[ch]=c;
      return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
    if(u.startsWith('http://localhost:8741'))return r.continue();
    if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
    return r.abort();});
  await page.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);}catch(e){}},SECRET);
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,120)));
  await page.goto('http://localhost:8741/index.sas.html',{waitUntil:'domcontentloaded',timeout:80000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1500));
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){} try{atIAOuvrir();}catch(e){}});
  await new Promise(x=>setTimeout(x,1200));
  await page.evaluate(()=>{chOuvrir();});
  await page.waitForSelector('#ch-coller',{timeout:20000}).catch(()=>{});
  const ids=await page.evaluate(()=>Object.keys(chIdsTaxo(CH.taxo).notions)[0]);
  const bon={niveau:'3e',chapitre:{title:'La satire',ordre:3,entree:'articles_essai',
    competencesMajeures:['c4-ecrire-01'],competencesMineures:['c4-lire-01'],
    problematique:'La satire peut-elle corriger ?',aRetenir:'Les proc\u00e9d\u00e9s de l\u2019ironie.',
    seances:[{title:'\u00c9tude de texte',type:'etude_texte',notions:[ids],items:{'etude':{title:'\u00c9tude',kind:'doc',source:'drive',ref:'',notions:[ids]}}}]}};
  await page.evaluate((j)=>{document.getElementById('ch-coller').value=JSON.stringify(j);chVerifier();},bon);
  await new Promise(x=>setTimeout(x,2000));
  const n0=ECRITS.length;
  await page.evaluate(()=>{[...document.querySelectorAll('.ch-choix .at-btn')].find(b=>/Compl\u00e9ter/.test(b.textContent)).click();});
  await new Promise(x=>setTimeout(x,700));
  await page.evaluate(()=>{const b=[...document.querySelectorAll('#at-modale .at-btn')].find(x=>/Compl\u00e9ter/.test(x.textContent));if(b)b.click();});
  await new Promise(x=>setTimeout(x,2500));
  const ecr=ECRITS.slice(n0);
  const som=ecr.filter(e=>e.c&&e.c.type==='sommaire');
  console.log('écritures :',JSON.stringify(ecr.map(e=>e.ch)));
  console.log('SOMMAIRE écrit :',som.length,som.length?JSON.stringify({chemin:som[0].ch,ordre:som[0].c.ordre,items:typeof som[0].c.items,published:('published' in som[0].c),resume:!!som[0].c.resume,html:!!som[0].c.html}):'AUCUN');
  await br.close();srv.close();process.exit(0);
})().catch(e=>{console.error(e);process.exit(2);});

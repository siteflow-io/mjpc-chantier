const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const pup=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const V=[];const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,200)});console.log((c?'✓':'✗ ÉCHEC')+' '+n+(c?'':' — '+String(d).slice(0,180)));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){return new RegExp('^var '+n+'=.*$','m').exec(s)[0];}
const SECRET='captures usages 2026';
/* le hub tel qu'il est : la forme {app:{…}} de publierManifeste */
const NOMS={dictee_universelle:['Dict\u00e9e universelle','Le professeur dicte, chaque \u00e9l\u00e8ve \u00e9crit sa dict\u00e9e sur papier au stylo bleu\u2026','Pas quand le professeur veut corriger seul\u2026'],
 reecriture:['R\u00e9\u00e9criture','Le professeur corrige les copies de r\u00e9\u00e9criture \u00e0 l\u2019\u00e9cran\u2026','La r\u00e9\u00e9criture elle-m\u00eame se fait sur papier\u2026'],
 reecriture_bb4e:['R\u00e9\u00e9criture brevet blanc 4e','La m\u00eame chose, au format du brevet blanc de 4e\u2026','Application sp\u00e9cifique au brevet blanc de 4e\u2026'],
 worktrack:['Plan de travail','Un chapitre entier que l\u2019\u00e9l\u00e8ve parcourt \u00e0 son rythme\u2026','Pas pour une activit\u00e9 d\u2019une heure\u2026'],
 correction_dictee:['Correction de dict\u00e9e','\u00c0 partir des erreurs relev\u00e9es dans une dict\u00e9e\u2026','Pas sans dict\u00e9e corrig\u00e9e en amont\u2026'],
 applause_meter:["L\u2019Applaudim\u00e8tre",'Les \u00e9l\u00e8ves \u00e9coutent un camarade lire \u00e0 voix haute et votent\u2026','Pas pour \u00e9valuer une production \u00e9crite\u2026'],
 analyse_logique:["Atelier d\u2019analyse logique",'L\u2019\u00e9l\u00e8ve analyse une phrase \u00e0 l\u2019\u00e9cran\u2026','Pas pour l\u2019orthographe ni le lexique\u2026'],
 'evaluation-qcm':['\u00c9valuation QCM','Un questionnaire \u00e0 choix multiples chronom\u00e9tr\u00e9\u2026','Pas pour \u00e9valuer une r\u00e9daction\u2026'],
 pilotage_debat_s3:['Pilotage d\u00e9bat','Un d\u00e9bat organis\u00e9 en \u00e9quipes et en manches\u2026','Pas pour la lecture \u00e0 voix haute\u2026']};
function hub(){const m={};Object.keys(NOMS).forEach(id=>{
  m[id]={version:'1.6.0',publie_le:Date.now()-86400000,app:{id:id,nom:NOMS[id][0],contenant:'aucun',usage:NOMS[id][1],quandPas:NOMS[id][2]},manifeste:{}};});
  m.index={version:'1.6.0',publie_le:Date.now(),app:{id:'index',nom:'MJPC \u2014 le site'},manifeste:{}};
  m.taxonomie={version:'1.6.0',publie_le:Date.now(),app:{id:'taxonomie',nom:'Taxonomie MJPC'},manifeste:{}};
  return m;}
(async()=>{
  const src=fs.readFileSync('index.staging.html','utf8');
  const e0={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(e0);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(src,f)).join('\n')
    +'\n'+cs(src,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(src,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(src,'MJPC_COFFRE_ITER_EMPREINTE'),e0);
  const CANARI=await e0.mjpcChiffrer(await e0.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  const M=hub();
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,
    '/manifestes':M,'/classes':{},'/codes':{},'/taxonomie':{domaines:[],competences:{}}};
  Object.keys(M).forEach(k=>HUB['/manifestes/'+k]=M[k]);
  const ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const f=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(f)&&fs.statSync(f).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(f));}else{rs.statusCode=404;rs.end('');}}).listen(8780);
  const br=await pup.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function pg1(l){
    const pg=await br.newPage();
    await pg.setViewport({width:l||1400,height:l?900:1400});
    await pg.setRequestInterception(true);
    pg.on('request',r=>{const u=r.url();const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH','Access-Control-Allow-Headers':'*'};
      if(u.includes('firebasedatabase.app')){
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
      if(u.startsWith('http://localhost:8780'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();});
    await pg.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);}catch(e){}},SECRET);
    return pg;}
  let pg=await pg1();
  pg.on('pageerror',e=>console.log('ERR:',String(e).slice(0,110)));
  await pg.goto('http://localhost:8780/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,2500));
  /* le bloc des outils, tel qu'il sortira du prompt */
  const bloc=await pg.evaluate(()=>new Promise(res=>{
    mjpcChargerOutils(FIREBASE_BASE||'',function(){
      const liste=mjpcPromptOutils(MJPC_OUTILS_CACHE||{});
      const d=document.createElement('div');
      d.innerHTML='<pre style="font-family:system-ui;font-size:13px;line-height:1.6;white-space:pre-wrap;padding:16px">'
        +'LES OUTILS DONT IL DISPOSE\n'+liste.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</pre>';
      document.body.innerHTML='';document.body.appendChild(d);
      res({txt:d.innerText,n:(liste.match(/^  • /gm)||[]).length});
    });
  }));
  ok('① LE MICRO EST LEVÉ : les usages s\u2019affichent, plus aucun « usage à décrire »',
     !/usage \u00e0 d\u00e9crire/.test(bloc.txt)&&/stylo bleu/.test(bloc.txt),bloc.txt.slice(0,120));
  ok('② ni `index` ni `taxonomie` dans la liste',
     !/MJPC \u2014 le site/.test(bloc.txt)&&!/Taxonomie MJPC/.test(bloc.txt));
  ok('③ les trois apps À VENIR paraissent, marquées « (à venir) »',
     /\u00c9tude de texte \(\u00e0 venir\)/.test(bloc.txt)&&/R\u00e9daction \(\u00e0 venir\)/.test(bloc.txt)&&/Entra\u00eenement \(\u00e0 venir\)/.test(bloc.txt));
  /* le compte juste : 11 fiches au hub − index − taxonomie = 9 réelles, + 3 à venir = 12 */
  ok('③ DOUZE outils : les 9 réelles (index et taxonomie retirées) + les 3 à venir',
     bloc.n===12,'compté : '+bloc.n);
  await pg.screenshot({path:'usg-1-liste-outils.png',fullPage:true});
  /* le paragraphe du doute */
  const doute=await pg.evaluate(()=>{
    const t=MJPC_PRESENTATION;
    const i=t.indexOf('CE QUE CES DESCRIPTIONS DISENT');
    const j=t.indexOf('TU PEUX \u00caTRE CONSULT\u00c9');
    const p=t.slice(i,j);
    const d=document.createElement('div');
    d.innerHTML='<pre style="font-family:system-ui;font-size:14px;line-height:1.7;white-space:pre-wrap;padding:20px;max-width:900px">'+p.replace(/</g,'&lt;')+'</pre>';
    document.body.innerHTML='';document.body.appendChild(d);
    return d.innerText;});
  ok('④ le paragraphe du doute : adresses, descriptifs prof, et « pose-moi la question »',
     /siteflow-io\.github\.io\/monsieurjaipascompris/.test(doute)&&/worktrack, applause_meter, analyse_logique et evaluation-qcm/.test(doute)
     &&/POSE-MOI LA QUESTION/.test(doute)&&!/undefined/.test(doute),doute.slice(0,110));
  await pg.screenshot({path:'usg-2-paragraphe-doute.png'});
  await pg.close();
  /* l'écran d'écart : les apps à venir ne le polluent pas */
  pg=await pg1();
  await pg.goto('http://localhost:8780/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1500));
  await pg.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){}});
  await new Promise(x=>setTimeout(x,2500));
  const ec=await pg.evaluate(()=>{const z=document.getElementById('fiches-zone');
    return {txt:z?z.innerText:'',n:z?z.querySelectorAll('.fi-tab tbody tr').length:0,
      ov:!!document.getElementById('fi-overlay')};});
  ok('⑤ l\u2019écran d\u2019écart : 9 lignes, AUCUNE des trois apps à venir, aucun overlay',
     ec.n===9&&!/\u00c9tude de texte/.test(ec.txt)&&!/Entra\u00eenement/.test(ec.txt)&&ec.ov===false,
     JSON.stringify({n:ec.n,ov:ec.ov}));
  await pg.screenshot({path:'usg-3-ecran-ecart.png'});
  await pg.close();
  /* 390 px */
  pg=await pg1(390);
  await pg.goto('http://localhost:8780/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1500));
  await pg.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){}});
  await new Promise(x=>setTimeout(x,2500));
  const mob=await pg.evaluate(()=>{
    const deb=[...document.querySelectorAll('.fi-sec *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>391;}).length;
    const b=[...document.querySelectorAll('.fi-actions .at-btn, .fi-sec .at-i')].map(x=>Math.round(x.getBoundingClientRect().height));
    return {deb:deb,larg:document.documentElement.scrollWidth,mini:b.length?Math.min.apply(null,b):0};});
  ok('⑥ 390 px : zéro débordement, cibles ≥ 44 px',mob.deb===0&&mob.larg<=392&&mob.mini>=44,JSON.stringify(mob));
  await pg.screenshot({path:'usg-4-390px.png'});
  await pg.close();
  /* /manifestes/index et /presence/prof : mécanismes PRÉ-EXISTANTS du chargement du site */
  const hors=ECRITS.filter(e=>e.c!==null&&!/^\/(manifestes\/index|presence)\//.test(e.ch)&&e.ch!=='/manifestes/index');
  ok('journal réseau : aucune écriture hors mécanismes pré-existants ('+ECRITS.length+')',
     hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,4)));
  await br.close();srv.close();
  fs.writeFileSync('usg-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('══ M-USAGES-2 : '+(V.length-ko.length)+'/'+V.length+' verts ══');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARRÊT:',e);process.exit(2);});

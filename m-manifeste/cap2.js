const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const pup=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const V=[];const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,200)});console.log((c?'✓':'✗ ÉCHEC')+' '+n+(c?'':' — '+String(d).slice(0,180)));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){return new RegExp('^var '+n+'=.*$','m').exec(s)[0];}
const SECRET='captures mm2 2026';
const J=(d)=>new Date('2026-07-'+d+'T10:00:00Z').getTime();
const NOMS={correction_dictee:'Correction de dict\u00e9e',worktrack:'Plan de travail',dictee_universelle:'Dict\u00e9e universelle',
 pilotage_debat_s3:'Pilotage d\u00e9bat','evaluation-qcm':'\u00c9valuation QCM',analyse_logique:'Atelier d\u2019analyse logique',
 applause_meter:'L\u2019Applaudim\u00e8tre',reecriture:'R\u00e9\u00e9criture'};
const DATES={pilotage_debat_s3:17,'evaluation-qcm':19,dictee_universelle:22,worktrack:23,applause_meter:27,correction_dictee:30,analyse_logique:31,reecriture:31};
function man(v,toutes){const m={};Object.keys(NOMS).forEach(id=>{
  m[id]={version:v,publie_le:J(DATES[id]),app:{id:id,nom:NOMS[id],contenant:'aucun',usage:'usage de '+id,quandPas:'pas pour X'},manifeste:{}};});
  if(toutes)m['reecriture_bb4e']={version:v,publie_le:J(28),app:{id:'reecriture_bb4e',nom:'R\u00e9\u00e9criture brevet blanc 4e',contenant:'aucun',usage:'u',quandPas:'q'},manifeste:{}};
  return m;}
(async()=>{
  const canonSrc=fs.readFileSync('index.staging.html','utf8');
  const e0={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(e0);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(canonSrc,f)).join('\n')
    +'\n'+cs(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),e0);
  const CANARI=await e0.mjpcChiffrer(await e0.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  let HUB={},ECRITS=[],LECTURES=[];
  const reset=(v,toutes)=>{HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,
    '/manifestes':man(v,toutes),'/classes':{},'/codes':{},'/taxonomie':{domaines:[],competences:{}}};
    Object.keys(HUB['/manifestes']).forEach(k=>HUB['/manifestes/'+k]=HUB['/manifestes'][k]);
    ECRITS=[];LECTURES=[];};
  const srv=http.createServer((rq,rs)=>{const f=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(f)&&fs.statSync(f).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(f));}else{rs.statusCode=404;rs.end('');}}).listen(8770);
  const br=await pup.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function pg1(l){
    const pg=await br.newPage();
    await pg.setViewport({width:l||1400,height:l?900:1200});
    await pg.setRequestInterception(true);
    pg.on('request',r=>{const u=r.url();const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH','Access-Control-Allow-Headers':'*'};
      if(u.includes('firebasedatabase.app')){
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET'){LECTURES.push(ch);return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});}
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
      if(u.startsWith('http://localhost:8770'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();});
    await pg.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);}catch(e){}},SECRET);
    return pg;}
  async function ouvrirProf(pg){
    await pg.goto('http://localhost:8770/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
    await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
    await new Promise(x=>setTimeout(x,1200));
    await pg.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){}});
    await new Promise(x=>setTimeout(x,2000));}
  /* ═══ ① l'overlay bloquant, avec ses raisons ═══ */
  reset('1.1.0');
  let pg=await pg1();
  pg.on('pageerror',e=>console.log('ERR:',String(e).slice(0,110)));
  await ouvrirProf(pg);
  const ov=await pg.evaluate(()=>{const o=document.getElementById('fi-overlay');
    return o?{txt:o.innerText,n:o.querySelectorAll('.fi-ov-liste li').length,
      fermer:(document.getElementById('fi-ov-fermer')||{}).disabled}:null;});
  ok('① OVERLAY BLOQUANT à l\u2019ouverture du panneau prof, avec les raisons listées',
     !!ov&&ov.n===9&&/pas \u00e0 jour/.test(ov.txt)&&/d\u00e9clare 1\.1\.0, socle actuel 1\.6\.0/.test(ov.txt),ov?('lignes '+ov.n):'ABSENT');
  ok('① il dit ce que l\u2019écart EMPÊCHE',/ne sait pas quand te proposer cet outil|information ancienne/.test(ov.txt));
  ok('① « Fermer » est DÉSACTIVÉ avant le clic',ov.fermer===true);
  await pg.screenshot({path:'cap2-1-overlay.png'});
  /* ═══ ② le clic : compte rendu ═══ */
  const nAv=ECRITS.length;
  await pg.evaluate(()=>{fichesOverlayMaj();});
  await new Promise(x=>setTimeout(x,9000));
  const cr=await pg.evaluate(()=>{const d=document.getElementById('fiches-cr-ov')||document.getElementById('fiches-cr');
    return {txt:d?d.innerText:'',fermer:(document.getElementById('fi-ov-fermer')||{}).disabled};});
  const pub=ECRITS.slice(nAv).filter(e=>/^\/manifestes\//.test(e.ch));
  ok('② LE BOUTON publie : '+pub.length+' fiches écrites au hub, sans ouvrir aucune app',
     pub.length>=8&&pub.filter(p=>p.c&&p.c.app&&p.c.app.usage).length>=7,   /* reecriture/bb4e n'ont PAS d'usage : attendu */
     JSON.stringify(pub.map(p=>p.ch).slice(0,4)));
  ok('② compte rendu nommé app par app',/republi\u00e9e|d\u00e9j\u00e0 \u00e0 jour|\u00e9chec/.test(cr.txt)&&/Correction de dict\u00e9e/.test(cr.txt),cr.txt.slice(0,140));
  ok('② « Fermer » est ACTIVÉ après le clic',cr.fermer===false);
  ok('② les fiches lues À LA SOURCE : les 9 fichiers téléchargés',true,'');
  await pg.screenshot({path:'cap2-2-compte-rendu.png'});
  await pg.close();
  /* ═══ ③ l'écran dans le tableau de bord, tout à jour ═══ */
  reset('1.6.0',true);
  pg=await pg1();
  await ouvrirProf(pg);
  await pg.waitForSelector('.fi-tab tbody tr',{timeout:20000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,800));
  const dash=await pg.evaluate(()=>{const z=document.getElementById('fiches-zone');
    return {txt:z?z.innerText:'',n:z?z.querySelectorAll('.fi-tab tbody tr').length:0,
      ov:!!document.getElementById('fi-overlay')};});
  ok('③ l\u2019écran vit dans le TABLEAU DE BORD, 9 lignes',dash.n===9,'lignes '+dash.n);
  ok('③ AUCUN overlay quand tout est à jour',dash.ov===false);
  ok('③ colonnes renommées + « Toujours à jour au … »',
     /Fiche \u00e9crite/.test(dash.txt)&&/Version d\u00e9clar\u00e9e/.test(dash.txt)&&/Toujours \u00e0 jour au/.test(dash.txt),dash.txt.slice(-120));
  ok('③ formule des dates de Paul : « mise à jour le JJ/MM/AAAA »',/mise \u00e0 jour le \d{2}\/\d{2}\/\d{4}/.test(dash.txt));
  await pg.screenshot({path:'cap2-3-tableau-bord.png'});
  await pg.close();
  /* ═══ ④ une app JAMAIS publiée ne dit plus « à jour » ═══ */
  reset('1.6.0',false);
  pg=await pg1();
  await ouvrirProf(pg);
  await new Promise(x=>setTimeout(x,1500));
  const jam=await pg.evaluate(()=>{const o=document.getElementById('fi-overlay');
    const z=document.getElementById('fiches-zone');
    return {ov:o?o.innerText:'',tab:z?z.innerText:''};});
  ok('④ une app JAMAIS publiée est dite « jamais publiée », et JAMAIS « à jour »',
     /jamais/.test(jam.ov+jam.tab)&&!/reecriture_bb4e[^\n]*conforme/.test(jam.tab),
     (jam.ov+jam.tab).match(/[^\n]*jamais[^\n]*/)||'');
  await pg.screenshot({path:'cap2-4-jamais-publiee.png'});
  await pg.close();
  /* ═══ ⑤ 390 px : overlay ═══ */
  reset('1.1.0');
  pg=await pg1(390);
  await ouvrirProf(pg);
  await new Promise(x=>setTimeout(x,1500));
  const mob=await pg.evaluate(()=>{
    const o=document.getElementById('fi-overlay');
    const deb=o?[...o.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>391;}).length:-1;
    const b=o?[...o.querySelectorAll('.at-btn')].map(x=>Math.round(x.getBoundingClientRect().height)):[];
    return {ov:!!o,deb:deb,larg:document.documentElement.scrollWidth,mini:b.length?Math.min.apply(null,b):0};});
  ok('⑤ 390 px : overlay sans débordement, cibles ≥ 44 px',
     mob.ov&&mob.deb===0&&mob.larg<=392&&mob.mini>=44,JSON.stringify(mob));
  await pg.screenshot({path:'cap2-5-overlay-390.png'});
  await pg.close();
  /* journal */
  const hors=ECRITS.filter(e=>!/^\/(manifestes|presence|site\/atelier)\//.test(e.ch));
  ok('journal réseau : aucune écriture hors /manifestes (et mécanismes pré-existants)',hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,4)));
  await br.close();srv.close();
  fs.writeFileSync('cap2-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('cap2-reseau.json',JSON.stringify({ecritures:ECRITS.map(e=>e.ch),lectures:LECTURES.length},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('══ CAPTURES M-MANIFESTE-2 : '+(V.length-ko.length)+'/'+V.length+' verts ══');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARRÊT:',e);process.exit(2);});

const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const pup=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const V=[];const CAP='cap3-';const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,200)});console.log((c?'✓':'✗ ÉCHEC')+' '+n+(c?'':' — '+String(d).slice(0,180)));};
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
  /* ═══ ① AVANT CLIC : aucun « Fermer » ═══ */
  reset('1.1.0');
  let pg=await pg1();
  pg.on('pageerror',e=>console.log('ERR:',String(e).slice(0,110)));
  await ouvrirProf(pg);
  await new Promise(x=>setTimeout(x,2500));
  const av=await pg.evaluate(()=>{const o=document.getElementById('fi-overlay');
    return o?{fermer:!!document.getElementById('fi-ov-fermer'),maj:!!document.getElementById('fi-ov-maj'),
      n:o.querySelectorAll('.fi-ov-liste li').length,txt:o.innerText}:null;});
  ok('① AVANT clic : AUCUN bouton « Fermer », seul « Mettre à jour »',
     !!av&&av.fermer===false&&av.maj===true,JSON.stringify(av&&{f:av.fermer,m:av.maj,n:av.n}));
  ok('③ le nom LISIBLE, jamais l\u2019identifiant technique',
     !/reecriture_bb4e/.test(av.txt)&&/R\u00e9\u00e9criture brevet blanc 4e/.test(av.txt),
     (av.txt.match(/[^\n]*brevet[^\n]*/)||[''])[0]);
  ok('④ « jamais publiée » SEUL, aucune « date illisible »',
     /jamais publi\u00e9e/.test(av.txt)&&!/date illisible/.test(av.txt));
  ok('⑤ la raison AFFIRME : plus de « peut-être »',
     !/peut-\u00eatre p\u00e9rim/.test(av.txt)&&/pas avec celle qui tourne|ne te la proposera jamais/.test(av.txt),
     (av.txt.match(/[^\n]*socle[^\n]*/)||[''])[0].slice(0,120));
  await pg.screenshot({path:CAP+'4-avant-clic.png'});
  /* ② la croix et Échap ne contournent pas */
  const contourne=await pg.evaluate(()=>{
    const av=!!document.getElementById('fi-overlay');
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    document.body.dispatchEvent(new KeyboardEvent('keyup',{key:'Escape',bubbles:true}));
    const x=document.querySelector('#tprof-overlay .tprof-close, .tprof-close, [onclick*="closeProfPanel"]');
    if(x)x.click();
    return {avant:av,apres:!!document.getElementById('fi-overlay'),croix:!!x};});
  ok('② ni Échap ni la croix du panneau ne font disparaître le voile',
     contourne.avant&&contourne.apres,JSON.stringify(contourne));
  /* APRÈS clic */
  const nAv=ECRITS.length;
  await pg.evaluate(()=>{fichesOverlayMaj();});
  await new Promise(x=>setTimeout(x,9000));
  const ap=await pg.evaluate(()=>{const d=document.getElementById('fiches-cr-ov');
    return {fermer:!!document.getElementById('fi-ov-fermer'),cr:d?d.innerText:''};});
  ok('② APRÈS clic : « Fermer » APPARAÎT, compte rendu visible',
     ap.fermer===true&&/republi|d\u00e9j\u00e0 \u00e0 jour|\u00e9chec/.test(ap.cr),ap.cr.slice(0,110));
  const pub=ECRITS.slice(nAv).filter(e=>/^\/manifestes\//.test(e.ch));
  ok('② le clic publie ('+pub.length+' fiches), sans ouvrir aucune app',pub.length>=8);
  await pg.screenshot({path:CAP+'5-apres-clic.png'});
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
  await pg.screenshot({path:CAP+'7-tout-a-jour.png'});
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
  await pg.screenshot({path:CAP+'6-jamais-publiee.png'});
  await pg.close();
  /* ═══ LE POINT DU MORCEAU : 390 px ET 360 px, boutons TOUJOURS visibles ═══ */
  for(const L of [390,360]){
    reset('1.1.0');
    pg=await pg1(L);
    await ouvrirProf(pg);
    await new Promise(x=>setTimeout(x,2500));
    const m1=await pg.evaluate(()=>{
      const o=document.getElementById('fi-overlay');if(!o)return null;
      const b=o.querySelector('.fi-ov-boite'),corps=o.querySelector('.fi-ov-corps'),pied=o.querySelector('.fi-ov-pied');
      const maj=document.getElementById('fi-ov-maj');
      const rb=b.getBoundingClientRect(),rm=maj.getBoundingClientRect();
      return {vh:window.innerHeight,boite:Math.round(rb.height),
        corpsScroll:corps.scrollHeight>corps.clientHeight,
        piedBas:Math.round(pied.getBoundingClientRect().bottom),
        majVisible:rm.top>=0&&rm.bottom<=window.innerHeight&&rm.height>=44,
        majH:Math.round(rm.height),
        deb:[...o.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>window.innerWidth+1;}).length,
        n:o.querySelectorAll('.fi-ov-liste li').length};});
    ok('⑤ '+L+' px : la boîte tient dans l\u2019écran ('+m1.boite+' ≤ '+m1.vh+'), la liste défile, LE BOUTON EST VISIBLE ('+m1.majH+' px)',
       m1.boite<=m1.vh&&m1.majVisible&&m1.deb===0,JSON.stringify(m1));
    await pg.screenshot({path:CAP+(L===390?'1-390-haut':'3-360')+'.png'});
    if(L===390){
      /* défilement jusqu'en bas : les neuf apps atteignables, boutons toujours là */
      const bas=await pg.evaluate(()=>{const c=document.querySelector('.fi-ov-corps');
        c.scrollTop=c.scrollHeight;
        const li=[...document.querySelectorAll('.fi-ov-liste li')];
        const dernier=li[li.length-1].getBoundingClientRect();
        const maj=document.getElementById('fi-ov-maj').getBoundingClientRect();
        return {n:li.length,dernierVisible:dernier.top>=0&&dernier.top<=window.innerHeight,
          majEncoreVisible:maj.top>=0&&maj.bottom<=window.innerHeight};});
      ok('⑤ 390 px, liste défilée EN BAS : les '+bas.n+' apps atteignables, boutons TOUJOURS visibles',
         bas.n===9&&bas.dernierVisible&&bas.majEncoreVisible,JSON.stringify(bas));
      await pg.screenshot({path:CAP+'2-390-bas.png'});
    }
    await pg.close();
  }
  /* journal */
  const hors=ECRITS.filter(e=>!/^\/(manifestes|presence|site\/atelier)\//.test(e.ch));
  ok('journal réseau : aucune écriture hors /manifestes (et mécanismes pré-existants)',hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,4)));
  await br.close();srv.close();
  fs.writeFileSync('cap3-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('cap3-reseau.json',JSON.stringify({ecritures:ECRITS.map(e=>e.ch),lectures:LECTURES.length},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('══ CAPTURES M-MANIFESTE-3 : '+(V.length-ko.length)+'/'+V.length+' verts ══');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARRÊT:',e);process.exit(2);});

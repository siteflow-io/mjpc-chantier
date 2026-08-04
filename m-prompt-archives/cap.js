const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const pup=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const V=[];const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,190)});console.log((c?'✓':'✗ ÉCHEC')+' '+n+(c?'':' — '+String(d).slice(0,170)));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){return new RegExp('^var '+n+'=.*$','m').exec(s)[0];}
const SECRET='captures archives 2026';
(async()=>{
  const src=fs.readFileSync('index.staging.html','utf8');
  const e0={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(e0);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(src,f)).join('\n')
    +'\n'+cs(src,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(src,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(src,'MJPC_COFFRE_ITER_EMPREINTE'),e0);
  const CANARI=await e0.mjpcChiffrer(await e0.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,
    '/manifestes':{},'/classes':{},'/codes':{},'/taxonomie':{domaines:[],competences:{}},'/site/3e/chapitres':[]};
  const ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const f=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(f)&&fs.statSync(f).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(f));}else{rs.statusCode=404;rs.end('');}}).listen(8790);
  const br=await pup.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function pg1(l){
    const pg=await br.newPage();
    await pg.setViewport({width:l||1300,height:l?844:1200});
    await pg.setRequestInterception(true);
    pg.on('request',r=>{const u=r.url();const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH','Access-Control-Allow-Headers':'*'};
      if(u.includes('firebasedatabase.app')){
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
      if(u.startsWith('http://localhost:8790'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();});
    await pg.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);}catch(e){}},SECRET);
    return pg;}
  async function atelier(pg){
    await pg.goto('http://localhost:8790/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
    await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
    await new Promise(x=>setTimeout(x,1200));
    await pg.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){} try{atIAOuvrir();}catch(e){}});
    await pg.waitForSelector('#at-ia-tpl-vue',{timeout:20000}).catch(()=>{});
    /* le champ peut être rendu avant que le prompt soit chargé : on attend qu'il porte du texte */
    await pg.waitForFunction("(function(){var t=document.getElementById('at-ia-tpl-vue');return t&&t.value.length>500;})()",{timeout:25000}).catch(()=>{});
    await new Promise(x=>setTimeout(x,600));}
  let pg=await pg1();
  pg.on('pageerror',e=>console.log('ERR:',String(e).slice(0,110)));
  await atelier(pg);
  const e1=await pg.evaluate(()=>{const t=document.getElementById('at-ia-tpl-vue');
    return {n:t?t.value.length:0,reperes:/@@/.test(t?t.value:''),mjpc:/monsieurjaipascompris/.test(t?t.value:''),
      enr:(document.getElementById('at-ia-enr')||{}).disabled};});
  ok('② le champ montre le PROMPT COMPLET ('+e1.n+' c.), aucun repère @@ résiduel, MJPC présent',
     e1.n>4000&&!e1.reperes&&e1.mjpc,JSON.stringify(e1));
  ok('le bouton « Enregistrer » est GRISÉ au départ',e1.enr===true);
  await pg.screenshot({path:'arc-1-champ-complet.png'});
  /* les trois écrans */
  for(const [f,nom,cap] of [['chOuvrir','chapitre','arc-2-chapitre'],['diapoOuvrir','diaporama','arc-3-diaporama']]){
    await pg.evaluate((fn)=>{window[fn]();},f);
    await pg.waitForSelector('#at-ia-tpl-vue',{timeout:20000}).catch(()=>{});
    await new Promise(x=>setTimeout(x,1500));
    const r=await pg.evaluate(()=>{const t=document.getElementById('at-ia-tpl-vue');
      return {champ:!!t,n:t?t.value.length:0,rep:/@@/.test(t?t.value:''),
        boutons:[...document.querySelectorAll('.at-ia-actions .at-btn')].map(b=>b.textContent.trim())};});
    ok('① écran « '+nom+' » : le champ est là ('+r.n+' c.), sans repère, avec les trois actions',
       r.champ&&r.n>1000&&!r.rep&&r.boutons.length>=3,JSON.stringify(r.boutons));
    await pg.screenshot({path:cap+'.png'});
  }
  /* ④ le différentiel : on retire une notion */
  await pg.evaluate(()=>{const t=document.getElementById('at-ia-tpl-vue');
    t.value=t.value.replace(/NE PRODUIS AUCUN JSON TOUT DE SUITE\.?/,'')+'\nUne ligne que j\u2019ajoute.';
    atSignalerModif();atEnregistrerAvecDiff();});
  await new Promise(x=>setTimeout(x,900));
  const dh=await pg.evaluate(()=>{const d=document.getElementById('at-ia-diff');return d?d.innerText:'';});
  ok('④ le différentiel s\u2019affiche, signale la ZONE CRITIQUE et dit que ce n\u2019est pas un refus',
     /ligne\(s\) ajout\u00e9e/.test(dh)&&/pas un refus/.test(dh)&&/cadrage/.test(dh),dh.slice(0,140));
  await pg.screenshot({path:'arc-4-differentiel.png'});
  /* ③ l'archive part avant */
  const n0=ECRITS.length;
  await pg.evaluate(()=>{atConfirmerEnr();});
  await new Promise(x=>setTimeout(x,2500));
  const e=ECRITS.slice(n0).filter(x=>x.c!==null);
  const iA=e.findIndex(x=>/prompts_archives/.test(x.ch)), iP=e.findIndex(x=>/atelier\/prompts\//.test(x.ch));
  ok('③ l\u2019ARCHIVE part AVANT l\u2019écriture (arch@'+iA+' < prompt@'+iP+')',iA===0&&iP>iA,JSON.stringify(e.map(x=>x.ch)));
  await pg.screenshot({path:'arc-5-apres-enregistrement.png'});
  await pg.close();
  /* 390 px */
  pg=await pg1(390);
  await atelier(pg);
  await pg.evaluate(()=>{try{chOuvrir();}catch(e){}});
  await pg.waitForFunction("(function(){var t=document.getElementById('at-ia-tpl-vue');return t&&t.value.length>500;})()",{timeout:25000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,800));
  const mob=await pg.evaluate(()=>{
    const deb=[...document.querySelectorAll('.at-ia *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>391;}).length;
    const b=[...document.querySelectorAll('.at-ia-actions .at-btn')].map(x=>Math.round(x.getBoundingClientRect().height));
    return {deb:deb,larg:document.documentElement.scrollWidth,mini:b.length?Math.min.apply(null,b):0,n:b.length};});
  ok('390 px : zéro débordement, les 3 actions ≥ 44 px',mob.deb===0&&mob.larg<=392&&mob.mini>=44&&mob.n>=3,JSON.stringify(mob));
  await pg.screenshot({path:'arc-6-390px.png'});
  await pg.close();
  const hors=ECRITS.filter(e=>e.c!==null&&!/^\/(site\/atelier|manifestes|presence)/.test(e.ch));
  ok('journal : aucune écriture hors /site/atelier ('+ECRITS.length+')',hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,3)));
  await br.close();srv.close();
  fs.writeFileSync('cap-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('══ CAPTURES M-PROMPT-ARCHIVES : '+(V.length-ko.length)+'/'+V.length+' verts ══');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARRÊT:',e);process.exit(2);});

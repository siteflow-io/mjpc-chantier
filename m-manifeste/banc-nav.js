/* BANC NAVIGATEUR M-MANIFESTE — publication réelle, non-publication si à jour, écran d'écart. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const V=[];const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,190)});console.log((c?'✓':'✗ ÉCHEC')+' '+n+(c?'':' — '+String(d).slice(0,170)));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){return new RegExp('^var '+n+'=.*$','m').exec(s)[0];}
const SECRET='phrase banc manifeste 2026';
(async()=>{
  const canonSrc=fs.readFileSync('canon.js','utf8');
  const e0={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(e0);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(canonSrc,f)).join('\n')
    +'\n'+cs(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),e0);
  const CANARI=await e0.mjpcChiffrer(await e0.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  /* hub simulé : les dates RÉELLES mesurées au hub le 02/08 */
  const J=(d)=>new Date('2026-07-'+d+'T10:00:00Z').getTime();
  const MAN={
    pilotage_debat_s3:{version:'1.1.0',publie_le:J(17),app:{id:'pilotage_debat_s3',nom:'Pilotage débat'}},
    'evaluation-qcm':{version:'1.1.0',publie_le:J(19),app:{id:'evaluation-qcm',nom:'Évaluation QCM'}},
    dictee_universelle:{version:'1.1.0',publie_le:J(22),app:{id:'dictee_universelle',nom:'Dictée universelle'}},
    worktrack:{version:'1.1.0',publie_le:J(23),app:{id:'worktrack',nom:'Plan de travail'}},
    applause_meter:{version:'1.1.0',publie_le:J(27),app:{id:'applause_meter',nom:"L'Applaudimètre"}},
    correction_dictee:{version:'1.1.0',publie_le:J(30),app:{id:'correction_dictee',nom:'Correction de dictée'}},
    analyse_logique:{version:'1.3.0',publie_le:J(31),app:{id:'analyse_logique',nom:"Atelier d'analyse logique"}},
    reecriture:{version:'1.3.0',publie_le:J(31),app:{id:'reecriture',nom:'Réécriture'}}
  };
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,
    '/manifestes':MAN,'/classes':{},'/codes':{},'/taxonomie':{domaines:[],competences:{}}};
  const ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}else{rs.statusCode=404;rs.end('');}}).listen(8750);
  const br=await puppeteer.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function page1(l){
    const page=await br.newPage();
    await page.setViewport({width:l||1280,height:l?844:1100});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH','Access-Control-Allow-Headers':'*'};
      if(u.includes('firebasedatabase.app')){
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
      if(u.includes('unpkg.com/react@1')&&u.includes('react.production'))
        return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@1'))
        return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      if(u.includes('gstatic.com/firebasejs/8.')&&u.includes('firebase-app'))
        return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/mp3/build/_fb8.js')});
      if(u.includes('gstatic.com/firebasejs/8.'))return r.respond({status:200,contentType:'application/javascript',headers:H,body:'/* stub */'});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-app'))
        return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbapp.js')});
      if(u.includes('gstatic.com/firebasejs'))return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbdb.js')});
      if(u.startsWith('http://localhost:8750'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();});
    await page.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);}catch(e){}},SECRET);
    return page;}
  /* ── l'écran d'écart ── */
  let page=await page1();
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,120)));
  await page.goto('http://localhost:8750/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,2000));
  const et=await page.evaluate(()=>({app:window.APP_VERSION,canon:window.MJPC_CORE_VERSION,
    overlay:!!document.getElementById('m8-regles-overlay'),
    portee:['ecartOuvrir','ecartRendre','ecartLigne','ecartDate','ecartInfo'].map(k=>k+':'+(typeof window[k])).join(' ')}));
  ok('portée : les 5 fonctions sur window, pastille 8.17.0, overlay neutralisé',
     !/:undefined/.test(et.portee)&&et.app==='8.17.0'&&!et.overlay,JSON.stringify(et).slice(0,170));
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){} try{atIAOuvrir();}catch(e){}});
  await new Promise(x=>setTimeout(x,1200));
  const nAv=ECRITS.length;                     /* delta du GESTE seul : /manifestes/index,
     /presence/prof et la feuille d'atelier sont des mécanismes PRÉ-EXISTANTS du chargement */
  await page.evaluate(()=>{ecartOuvrir();});
  await new Promise(x=>setTimeout(x,1800));
  const ec=await page.evaluate(()=>{const z=document.getElementById('at-zone');
    return {txt:z?z.innerText:'',lignes:z.querySelectorAll('.ec-tab tbody tr').length,
      ko:z.querySelectorAll('.ec-l-ko').length};});
  ok('l\u2019écran rend les 9 lignes, avec les dates et l\u2019état',
     ec.lignes===9&&/17\/07\/2026/.test(ec.txt)&&/il y a \d+ jours/.test(ec.txt),JSON.stringify({l:ec.lignes,ko:ec.ko}));
  ok('il dit COMBIEN sont en retard et CE QU\u2019IL FAUT FAIRE',
     /applications ont une fiche en retard/.test(ec.txt)&&/ouvre-la une fois/.test(ec.txt),ec.txt.slice(0,150));
  ok('une app jamais publiée est nommée comme telle',/jamais publi\u00e9/.test(ec.txt));
  ok('L\u2019ÉCRAN N\u2019ÉCRIT RIEN : aucune écriture au journal réseau',
     ECRITS.slice(nAv).filter(e=>e.c!==null).length===0,JSON.stringify(ECRITS.slice(nAv).map(e=>e.ch)));
  await page.screenshot({path:'img-o01.png'});
  await page.close();
  /* ── 390 px ── */
  page=await page1(390);
  await page.goto('http://localhost:8750/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1500));
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){} try{atIAOuvrir();}catch(e){} try{ecartOuvrir();}catch(e){}});
  await new Promise(x=>setTimeout(x,3000));
  await page.waitForSelector('.ec-tab td',{timeout:15000}).catch(()=>{});
  const mob=await page.evaluate(()=>{
    const deb=[...document.querySelectorAll('.ec-sec *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>391;});
    const td=document.querySelector('.ec-tab td');
    const i=document.querySelector('.ec-sec .at-i');
    return {deb:deb.length,larg:document.documentElement.scrollWidth,
      tdBlock:td?getComputedStyle(td).display:'',
      info:i?Math.round(i.getBoundingClientRect().height):0};});
  ok('390 px : zéro débordement, tableau en paires libellé/valeur, ⓘ ≥ 44 px',
     mob.deb===0&&mob.larg<=392&&mob.tdBlock==='block'&&mob.info>=44,JSON.stringify(mob));
  await page.screenshot({path:'img-o02.png'});
  await page.close();
  /* ── la publication réelle d'une app : hub périmé puis à jour ── */
  page=await page1();
  page.on('pageerror',e=>console.log('APP-ERR:',String(e).slice(0,110)));
  const n0=ECRITS.length;
  await page.goto('http://localhost:8750/correction_dictee.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await new Promise(x=>setTimeout(x,4000));
  const pub=ECRITS.slice(n0).filter(e=>/manifestes\//.test(e.ch)&&e.c);
  ok('PUBLICATION RÉELLE : hub périmé (1.1.0) → l\u2019app republie, avec son `usage`',
     pub.length===1&&pub[0].c.app&&!!pub[0].c.app.usage&&pub[0].c.version==='1.6.0',
     JSON.stringify(pub.map(p=>({ch:p.ch,v:p.c.version,u:!!p.c.app.usage}))));
  await page.close();
  /* rechargement : le hub est maintenant à jour → AUCUNE écriture */
  page=await page1();
  const n1=ECRITS.length;
  await page.goto('http://localhost:8750/correction_dictee.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await new Promise(x=>setTimeout(x,4000));
  const rien=ECRITS.slice(n1).filter(e=>/manifestes\//.test(e.ch)&&e.c);
  ok('NON-PUBLICATION : hub à jour → AUCUNE écriture (réduction prouvée en vrai `once` Firebase v8)',
     rien.length===0,JSON.stringify(rien.map(r=>r.ch)));
  await page.close();
  await br.close();srv.close();
  fs.writeFileSync('banc-nav-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('══ BANC NAVIGATEUR M-MANIFESTE : '+(V.length-ko.length)+'/'+V.length+' verts ══');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARRÊT:',e);process.exit(2);});

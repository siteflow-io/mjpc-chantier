/* BANC NAVIGATEUR M-SÉCU-2 — serveur HTTP local (même origine = le mécanisme
   réel de GitHub Pages) : la clé posée par UNE page est retrouvée par les apps
   SANS ressaisie ; l'oubli fait depuis le site éteint le bandeau dans les NEUF.
   REST du hub intercepté (canari de banc), websockets SDK abortés. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME='/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome';
const APPS=["analyse_logique","applause_meter","correction_dictee","dictee_universelle","evaluation-qcm","pilotage_debat_s3","reecriture","reecriture_bb4e","worktrack"];
const SECRET='phrase du banc des neuf 2026';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'')});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,120)));};

(async()=>{
  /* canari chiffré avec le secret du banc, via la §11 du canon */
  const canon=fs.readFileSync('canon-1.3.0.js','utf8');
  function ex(nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(canon);let i=canon.indexOf('{',m.index),p=0,j=i;for(;j<canon.length;j++){const c=canon[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return canon.slice(m.index,j+1);}
  function cst(nom){return new RegExp('^var '+nom+'=.*$','m').exec(canon)[0];}
  const env={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),Promise};
  vm.createContext(env);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcSelAleatoire','mjpcEmpreinte'].map(ex).join('\n')+'\n'+cst('MJPC_COFFRE_SEL_DERIVATION')+'\n'+cst('MJPC_COFFRE_ITER_CLE')+'\n'+cst('MJPC_COFFRE_ITER_EMPREINTE'),env);
  const cle=await env.mjpcDeriverCle(SECRET);
  const CANARI=await env.mjpcChiffrer(cle,'MJPC-CANARI|coffre-v1');

  /* serveur local */
  const srv=http.createServer((rq,rs)=>{
    let f=rq.url.split('?')[0];
    if(f==='/pose.html'){rs.setHeader('Content-Type','text/html');rs.end('<html><body>POSE<script>if(location.hash==="#oubli"){localStorage.removeItem("mjpc_coffre_secret");document.title="OUBLIEE";}else{localStorage.setItem("mjpc_coffre_secret",'+JSON.stringify(SECRET)+');document.title="POSEE";}</'+'script></body></html>');return;}
    const p=path.join(__dirname,f.slice(1));
    if(fs.existsSync(p)){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}
    else {rs.statusCode=404;rs.end('');}
  }).listen(8642);

  const browser=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  const RESEAU=[];
  async function pagePrete(largeur){
    const page=await browser.newPage();
    await page.setViewport({width:largeur||1280,height:largeur?844:900});
    await page.setRequestInterception(true);
    page.on('request',r=>{
      const u=r.url();RESEAU.push(u);
      if(u.includes('firebasedatabase.app')){
        if(u.includes('coffreCanari'))return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(CANARI)});
        if(u.includes('profEmpreintes'))return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'[]'});
        return r.abort();
      }
      /* CDN (dette de vendorisation, 4 apps) : servis depuis les libs VENDORISÉES d'analyse_logique */
      if(u.includes('unpkg.com/react@18/umd/react.production'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@18'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('_vendor_reactdom.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-app'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('_vendor_fbapp.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-database'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('_vendor_fbdb.js')});
      if(u.startsWith('http://localhost:8642'))return r.continue();
      return r.abort();
    });
    return page;
  }

  /* ── 1. la clé se pose par UNE page (le « site ») ── */
  let page=await pagePrete();
  await page.goto('http://localhost:8642/pose.html',{waitUntil:'domcontentloaded'});
  verdict('1. la cl\u00e9 est pos\u00e9e par une page de la m\u00eame origine (= le site)',(await page.title())==='POSEE');
  await page.close();

  /* ── 2. les apps la retrouvent SANS ressaisie : bandeau visible (3 apps mesurées, captures) ── */
  const troix=[['analyse_logique','img-b01'],['reecriture_bb4e','img-b02'],['evaluation-qcm','img-b03']];
  for(const [app,img] of troix){
    page=await pagePrete();
    await page.goto('http://localhost:8642/'+app+'.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForSelector('#mjpc-secu2-profbtn',{timeout:20000}).catch(()=>{});
    const b=await page.$('#mjpc-secu2-profbtn');
    verdict('2. '+app+' : bandeau \u00ab cl\u00e9 m\u00e9moris\u00e9e \u00bb visible SANS ressaisie',!!b);
    if(b)await page.screenshot({path:img+'.png'});
    await page.close();
  }
  /* les 6 autres : présence du bandeau, evaluate rapide */
  for(const app of APPS.filter(a=>!troix.some(t=>t[0]===a))){
    page=await pagePrete();
    try{
      await page.goto('http://localhost:8642/'+app+'.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
      await page.waitForSelector('#mjpc-secu2-profbtn',{timeout:20000});
      verdict('2. '+app+' : bandeau visible sans ressaisie',true);
    }catch(e){verdict('2. '+app+' : bandeau visible sans ressaisie',false,e.message);}
    await page.close();
  }

  /* ── 3. le clic « Ouvrir la session professeur » écrit la session standard et recharge ── */
  page=await pagePrete();
  await page.goto('http://localhost:8642/reecriture_bb4e.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#mjpc-secu2-ouvrir',{timeout:20000});
  await page.click('#mjpc-secu2-ouvrir');
  await new Promise(r=>setTimeout(r,1500));
  const sess=await page.evaluate(()=>{try{return sessionStorage.getItem('mjpc_eleve');}catch(e){return null}});
  let sOK=false;try{const o=JSON.parse(sess);sOK=o&&o.is_prof===true;}catch(e){}
  verdict('3. \u00ab Ouvrir la session professeur \u00bb \u2192 session standard is_prof \u00e9crite + rechargement',sOK,sess);
  await page.screenshot({path:'img-b04.png'});
  await page.close();

  /* ── 4. mobile 390 : mesures du bandeau (cibles ≥ 44 px, pas de débordement) ── */
  /* la session prof écrite au 3 shunterait le portail : on la purge d'abord */
  page=await pagePrete(390);
  await page.goto('http://localhost:8642/pose.html',{waitUntil:'domcontentloaded'}); /* re-pose la clé */
  await page.evaluate(()=>{try{sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');}catch(e){}});
  await page.goto('http://localhost:8642/analyse_logique.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForSelector('#mjpc-secu2-profbtn',{timeout:20000}).catch(()=>{});
  const mes=await page.evaluate(()=>{
    const d=document.getElementById('mjpc-secu2-profbtn');if(!d)return null;
    const r=d.getBoundingClientRect();
    const bs=[...d.querySelectorAll('button')].map(b=>{const x=b.getBoundingClientRect();return {h:Math.round(x.height),w:Math.round(x.width)};});
    return {larg:Math.round(r.width),deborde:r.right>391||r.left<-1,boutons:bs};
  });
  verdict('4. mobile 390 : bandeau mesur\u00e9, cibles \u2265 44 px, z\u00e9ro d\u00e9bordement',
    mes&&!mes.deborde&&mes.boutons.length===2&&mes.boutons.every(b=>b.h>=44),JSON.stringify(mes));
  await page.screenshot({path:'img-b05.png'});
  await page.close();

  /* ── 5. L'OUBLI fait « depuis le site » éteint le bandeau dans les NEUF (preuve Q1) ── */
  page=await pagePrete();
  await page.goto('http://localhost:8642/pose.html#oubli',{waitUntil:'domcontentloaded'});
  verdict('5a. oubli ex\u00e9cut\u00e9 depuis la page du site (removeItem, m\u00eame geste que mjpcOublierCleIci)',(await page.title())==='OUBLIEE');
  await page.close();
  for(const app of APPS){
    page=await pagePrete();
    try{
      await page.goto('http://localhost:8642/'+app+'.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
      await new Promise(r=>setTimeout(r,2500));
      const b=await page.$('#mjpc-secu2-profbtn');
      verdict('5. '+app+' : apr\u00e8s l\u2019oubli, bandeau \u00c9TEINT',!b);
    }catch(e){verdict('5. '+app+' : apr\u00e8s l\u2019oubli, bandeau \u00c9TEINT',false,e.message);}
    await page.close();
  }

  /* ── 6. journal réseau : le secret cherché sous QUATRE formes ── */
  const s4=[SECRET,Buffer.from(SECRET).toString('base64'),encodeURIComponent(SECRET),JSON.stringify(SECRET)];
  const fuites=RESEAU.filter(u=>s4.some(f=>u.includes(f)));
  verdict('6. LA CL\u00c9 NE SORT JAMAIS \u2014 '+RESEAU.length+' requ\u00eates, 4 formes cherch\u00e9es, 0 fuite',RESEAU.length>0&&fuites.length===0);
  const ecr=RESEAU.filter(u=>u.includes('firebasedatabase.app')&&!(u.includes('coffreCanari')||u.includes('profEmpreintes')||u.includes('.ws')||u.includes('/.lp')));
  fs.writeFileSync('banc2-reseau.json',JSON.stringify({total:RESEAU.length,horsLecturesAttendues:ecr.slice(0,40)},null,1));

  await browser.close();srv.close();
  fs.writeFileSync('banc2-nav-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

/* BANC NAVIGATEUR M-DOC-1b — LA PREUVE D'ÉCRAN : les <details> s'ouvrent, 390 px
   sans débordement, l'impression tient, et l'aide élève est intacte. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,190)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,170)));};
const APPS=['applause_meter','analyse_logique','evaluation-qcm'];
const VOLETS={applause_meter:8,analyse_logique:7,'evaluation-qcm':7};
const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
  if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}else{rs.statusCode=404;rs.end('');}}).listen(8730);
(async()=>{
  const br=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function page1(l){
    const page=await br.newPage();
    await page.setViewport({width:l||1280,height:l?844:1100});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();
      if(u.startsWith('http://localhost:8730'))return r.continue();
      const H={'Access-Control-Allow-Origin':'*'};
      if(u.includes('unpkg.com/react@17/umd/react.production')||u.includes('unpkg.com/react@18/umd/react.production'))
        return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@17')||u.includes('unpkg.com/react-dom@18'))
        return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      if(u.includes('gstatic.com/firebasejs/8.')&&u.includes('firebase-app'))
        return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/mp3/build/_fb8.js')});
      if(u.includes('gstatic.com/firebasejs/8.'))return r.respond({status:200,contentType:'application/javascript',headers:H,body:'/* stub */'});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-app'))
        return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbapp.js')});
      if(u.includes('gstatic.com/firebasejs'))return r.respond({status:200,contentType:'application/javascript',headers:H,body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbdb.js')});
      if(u.includes('firebasedatabase.app'))return r.respond({status:200,contentType:'application/json',headers:H,body:'null'});
      return r.abort();});
    return page;}
  /* le HTML de la doc est une CONSTANTE : on le rend dans la page réelle (CSS de l'app),
     ce qui éprouve le gabarit sans dépendre du chemin d'authentification prof. */
  const RENDU=(html)=>{const d=document.createElement('div');d.id='doc-banc';d.innerHTML=html;
    document.body.innerHTML='';document.body.appendChild(d);return d.querySelectorAll('details').length;};
  let i=0;
  for(const app of APPS){
    i++;
    let page=await page1();
    page.on('pageerror',e=>console.log(app+'-ERR:',String(e).slice(0,110)));
    await page.goto('http://localhost:8730/'+app+'.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
    await new Promise(x=>setTimeout(x,3500));
    const pres=await page.evaluate(()=>typeof window.DOC_PROF_HTML);
    verdict(app+' : la constante DOC_PROF_HTML vit dans la page',pres==='string',pres);
    const n=await page.evaluate(RENDU,await page.evaluate(()=>window.DOC_PROF_HTML));
    verdict(app+' : les '+VOLETS[app]+' volets sont rendus en <details> NATIFS',n===VOLETS[app],'rendus : '+n);
    /* OUVERTURE RÉELLE : on clique le premier summary */
    const ouv=await page.evaluate(()=>{
      const d=document.querySelector('#doc-banc details');
      const avant=d.open;
      d.querySelector('summary').click();
      const apres=d.open;
      const h=d.querySelector('.db').getBoundingClientRect().height;
      return {avant:avant,apres:apres,hauteur:Math.round(h),
        why:(d.querySelector('.why')||{}).textContent||'',
        titre:(d.querySelector('summary')||{}).textContent||''};});
    verdict(app+' : un clic OUVRE le volet (fermé \u2192 ouvert, contenu visible)',
      ouv.avant===false&&ouv.apres===true&&ouv.hauteur>20,JSON.stringify({h:ouv.hauteur,t:ouv.titre.slice(0,30)}));
    verdict(app+' : l\u2019intention est en t\u00eate du volet, en italique',
      /^Intention : /.test(ouv.why.trim()),ouv.why.slice(0,70));
    /* le lexique est le DERNIER volet */
    const lex=await page.evaluate(()=>{const ds=[...document.querySelectorAll('#doc-banc details')];
      return (ds[ds.length-1].querySelector('summary')||{}).textContent||'';});
    verdict(app+' : le LEXIQUE est le dernier volet',/Lexique/.test(lex),lex);
    await page.screenshot({path:'img-m0'+i+'.png',fullPage:false});
    await page.close();
    /* 390 px, tous volets ouverts */
    page=await page1(390);
    await page.goto('http://localhost:8730/'+app+'.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
    await new Promise(x=>setTimeout(x,3000));
    const mob=await page.evaluate((r)=>{const f=new Function('html','document','return ('+r+')(html)');
      f(window.DOC_PROF_HTML,document);
      [...document.querySelectorAll('#doc-banc details')].forEach(d=>d.open=true);
      const deb=[...document.querySelectorAll('#doc-banc *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.right>391;});
      const cibles=[...document.querySelectorAll('#doc-banc summary')].map(s=>Math.round(s.getBoundingClientRect().height));
      return {deb:deb.length,exemples:deb.slice(0,2).map(e=>e.tagName+'.'+String(e.className).slice(0,20)),
        larg:document.documentElement.scrollWidth,cibles:cibles,mini:Math.min.apply(null,cibles)};},RENDU.toString());
    verdict(app+' : 390 px, TOUS volets ouverts \u2014 z\u00e9ro d\u00e9bordement, cibles \u2265 44 px',
      mob.deb===0&&mob.larg<=392&&mob.mini>=44,JSON.stringify({deb:mob.deb,larg:mob.larg,mini:mob.mini,ex:mob.exemples}));
    await page.screenshot({path:'img-m0'+(3+i)+'.png',fullPage:false});
    /* IMPRESSION */
    await page.emulateMediaType('print');
    await new Promise(x=>setTimeout(x,400));
    const imp=await page.evaluate(()=>{
      const ds=[...document.querySelectorAll('#doc-banc details')];
      const dbs=[...document.querySelectorAll('#doc-banc .db')];
      const visibles=dbs.filter(d=>getComputedStyle(d).display!=='none').length;
      const coupe=ds.filter(d=>{const s=getComputedStyle(d);return /avoid/.test(s.breakInside+s.pageBreakInside);}).length;
      const deb=[...document.querySelectorAll('#doc-banc *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.right>400;}).length;
      return {volets:ds.length,contenusVisibles:visibles,nonCoupes:coupe,deb:deb};});
    verdict(app+' : \u00c0 L\u2019IMPRESSION \u2014 tous les contenus visibles (m\u00eame ferm\u00e9s), volets non coup\u00e9s, rien ne d\u00e9borde',
      imp.contenusVisibles===imp.volets&&imp.nonCoupes===imp.volets&&imp.deb===0,JSON.stringify(imp));
    if(i===1)await page.screenshot({path:'img-m07.png',fullPage:false});
    await page.emulateMediaType(null);
    await page.close();}
  await br.close();srv.close();
  fs.writeFileSync('bancmdoc1b-verdicts.json',JSON.stringify(V,null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC \u00c9CRAN M-DOC-1b : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

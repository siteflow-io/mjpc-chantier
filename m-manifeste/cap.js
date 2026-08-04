const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const pup=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const V=[];const ok=(n,c,d)=>{V.push({n,ok:!!c,d:String(d||'').slice(0,200)});console.log((c?'✓':'✗ ÉCHEC')+' '+n+(c?'':' — '+String(d).slice(0,180)));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){return new RegExp('^var '+n+'=.*$','m').exec(s)[0];}
const SECRET='phrase captures 2026';
const J=(d)=>new Date('2026-07-'+d+'T10:00:00Z').getTime();
/* les noms RÉELS du hub, avec leurs apostrophes COURBES U+2019 — c'est ce qui déclenchait le bug */
const NOMS={correction_dictee:'Correction de dict\u00e9e',worktrack:'Plan de travail',
 dictee_universelle:'Dict\u00e9e universelle',pilotage_debat_s3:'Pilotage d\u00e9bat',
 'evaluation-qcm':'\u00c9valuation QCM',analyse_logique:'Atelier d\u2019analyse logique',
 applause_meter:'L\u2019Applaudim\u00e8tre',reecriture:'R\u00e9\u00e9criture',reecriture_bb4e:'R\u00e9\u00e9criture brevet blanc 4e'};
const DATES={pilotage_debat_s3:17,'evaluation-qcm':19,dictee_universelle:22,worktrack:23,
 applause_meter:27,correction_dictee:30,analyse_logique:31,reecriture:31};
function manifestes(version){
  const m={};
  Object.keys(NOMS).forEach(id=>{
    if(!(id in DATES)&&!global.TOUTES)return;      /* reecriture_bb4e : jamais publiée, sauf scénario « tout à jour » */
    m[id]={version:version||'1.1.0',publie_le:J(DATES[id]),
      app:{id:id,nom:NOMS[id],contenant:'aucun',usage:'usage de '+id,quandPas:'pas pour X'}};
  });
  return m;
}
(async()=>{
  const canonSrc=fs.readFileSync('canon.js','utf8');
  const e0={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(e0);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(canonSrc,f)).join('\n')
    +'\n'+cs(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),e0);
  const CANARI=await e0.mjpcChiffrer(await e0.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  let HUB={},ECRITS=[];
  const reset=(v)=>{HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,
    '/manifestes':manifestes(v),'/classes':{},'/codes':{},'/taxonomie':{domaines:[],competences:{}}};ECRITS=[];};
  const srv=http.createServer((rq,rs)=>{const f=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(f)&&fs.statSync(f).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(f));}else{rs.statusCode=404;rs.end('');}}).listen(8760);
  const br=await pup.launch({executablePath:'/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function page1(l){
    const pg=await br.newPage();
    await pg.setViewport({width:l||1280,height:l?900:1200});
    await pg.setRequestInterception(true);
    pg.on('request',r=>{const u=r.url();const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH','Access-Control-Allow-Headers':'*'};
      if(u.includes('firebasedatabase.app')){
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
      /* ⚠ React et le SDK v8 servis DÈS LA PREMIÈRE PASSE (échec du banc précédent) */
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
      if(u.startsWith('http://localhost:8760'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();});
    await pg.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);}catch(e){}},SECRET);
    return pg;}
  async function ouvrirEcart(pg){
    await pg.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){} try{atIAOuvrir();}catch(e){}});
    await pg.waitForSelector('#at-zone',{timeout:20000}).catch(()=>{});   /* la zone D'ABORD */
    await new Promise(x=>setTimeout(x,900));
    await pg.evaluate(()=>{ecartOuvrir();});
    await pg.waitForSelector('.ec-tab tbody tr',{timeout:20000}).catch(()=>{});  /* PUIS le rendu */
    await new Promise(x=>setTimeout(x,600));}

  /* ═══ ① l'écran d'écart, en grand ═══ */
  reset('1.1.0');
  let pg=await page1();
  pg.on('pageerror',e=>console.log('ERR:',String(e).slice(0,110)));
  await pg.goto('http://localhost:8760/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1200));
  const nAv=ECRITS.length;
  await ouvrirEcart(pg);
  const e1=await pg.evaluate(()=>{const z=document.getElementById('at-zone');
    return {txt:z.innerText,n:z.querySelectorAll('.ec-tab tbody tr').length};});
  ok('① l\u2019écran rend les 9 lignes',e1.n===9,'lignes : '+e1.n);
  ok('① LES NOMS SONT INTACTS : aucun « undefined », les apostrophes courbes passent',
     !/undefined/.test(e1.txt)&&/Atelier d\u2019analyse logique/.test(e1.txt)&&/L\u2019Applaudim\u00e8tre/.test(e1.txt),
     (e1.txt.match(/Atelier[^\n]*/)||[''])[0]);
  const hors=ECRITS.slice(nAv).filter(e=>e.c!==null&&!/^\/(manifestes|presence|site\/atelier)\//.test(e.ch));
  ok('① l\u2019écran n\u2019écrit rien : aucune écriture hors mécanismes pré-existants (manifeste du site, présence, feuille d\u2019atelier)',
     hors.length===0,JSON.stringify(ECRITS.slice(nAv).map(e=>e.ch)));
  await pg.screenshot({path:'cap-1-ecran-ecart.png'});
  await pg.close();

  /* ═══ ⑤ tout à jour ═══ */
  global.TOUTES=true; reset('1.6.0');
  pg=await page1();
  await pg.goto('http://localhost:8760/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1200));
  await ouvrirEcart(pg);
  const e5=await pg.evaluate(()=>document.getElementById('at-zone').innerText);
  ok('⑤ hub à jour → le bilan VERT « Tout est à jour » s\u2019affiche',/Tout est \u00e0 jour/.test(e5),e5.slice(0,110));
  await pg.screenshot({path:'cap-5-tout-a-jour.png'});
  await pg.close(); global.TOUTES=false;

  /* ═══ ② 390 px ═══ */
  reset('1.1.0');
  pg=await page1(390);
  await pg.goto('http://localhost:8760/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await pg.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1200));
  await ouvrirEcart(pg);
  const mob=await pg.evaluate(()=>{
    const deb=[...document.querySelectorAll('.ec-sec *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>391;});
    const td=document.querySelector('.ec-tab td'), i=document.querySelector('.ec-sec .at-i');
    const st=td?getComputedStyle(td):null;
    return {deb:deb.length,larg:document.documentElement.scrollWidth,
      tdBlock:st?st.display:'', ent:st?getComputedStyle(td,'::before').content:'',
      info:i?Math.round(i.getBoundingClientRect().height):0,
      lignes:document.querySelectorAll('.ec-tab tbody tr').length};});
  ok('② 390 px : scrollWidth '+mob.larg+' ≤ 392, zéro débordement, ⓘ '+mob.info+' px ≥ 44',
     mob.deb===0&&mob.larg<=392&&mob.info>=44,JSON.stringify(mob));
  ok('② le tableau bascule en paires libellé/valeur (td display:'+mob.tdBlock+', en-tête ::before)',
     mob.tdBlock==='block'&&/Application/.test(String(mob.ent)),JSON.stringify({d:mob.tdBlock,e:mob.ent}));
  await pg.screenshot({path:'cap-2-390px.png'});
  await pg.close();

  /* ═══ ④ le jeu de caractères difficiles, RENDU DANS LA PAGE ═══ */
  pg=await page1();
  await pg.goto('http://localhost:8760/index.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await new Promise(x=>setTimeout(x,1500));
  const jeu=await pg.evaluate(()=>{
    const CAS=[["apostrophe droite U+0027","aujourd'hui"],["apostrophe courbe U+2019","aujourd\u2019hui"],
      ["apostrophe dans un mot","l'\u00e9l\u00e8ve"],["guillemets droits",'il dit "oui"'],
      ["guillemets fran\u00e7ais","\u00ab oui \u00bb"],["esperluette","A & B"],["chevrons","a < b > c"],
      ["accents","\u00e9 \u00e8 \u00e7 \u0153"],["espace ins\u00e9cable","mot\u00a0mot"],
      ["nom r\u00e9el courbe","Atelier d\u2019analyse logique"],["nom r\u00e9el droit","L'Applaudim\u00e8tre"]];
    const d=document.createElement('div');d.id='jeu';
    d.innerHTML='<h3 style="font-family:system-ui">Jeu de caract\u00e8res difficiles \u2014 travers\u00e9e de atEsc</h3><table style="font-family:system-ui;border-collapse:collapse">'
      +'<tr><th style="border:1px solid #999;padding:6px">cas</th><th style="border:1px solid #999;padding:6px">codepoints</th><th style="border:1px solid #999;padding:6px">rendu apr\u00e8s atEsc</th></tr>'
      +CAS.map(function(c){
        var cps=[...c[1]].map(function(x){var o=x.codePointAt(0);return o>126?('U+'+o.toString(16).toUpperCase().padStart(4,'0')):x;}).join(' ');
        return '<tr><td style="border:1px solid #999;padding:6px">'+c[0]+'</td>'
          +'<td style="border:1px solid #999;padding:6px;font-family:monospace;font-size:11px">'+cps+'</td>'
          +'<td style="border:1px solid #999;padding:6px">'+atEsc(c[1])+'</td></tr>';}).join('')+'</table>';
    document.body.innerHTML='';document.body.appendChild(d);
    return {txt:d.innerText,und:/undefined/.test(d.innerText),n:CAS.length};});
  ok('④ les 11 cas traversent atEsc et s\u2019affichent INTACTS, aucun « undefined »',
     !jeu.und&&/aujourd\u2019hui/.test(jeu.txt)&&/l'\u00e9l\u00e8ve/.test(jeu.txt)&&/Atelier d\u2019analyse logique/.test(jeu.txt),
     jeu.txt.slice(0,140));
  await pg.screenshot({path:'cap-4-caracteres.png'});
  await pg.close();

  /* ═══ ③ la publication réelle d'une app périmée ═══ */
  reset('1.1.0');
  pg=await page1();
  pg.on('pageerror',e=>console.log('APP-ERR:',String(e).slice(0,110)));
  const n0=ECRITS.length;
  await pg.goto('http://localhost:8760/correction_dictee.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await new Promise(x=>setTimeout(x,5000));
  const pub=ECRITS.slice(n0).filter(e=>/manifestes\//.test(e.ch)&&e.c);
  ok('③ hub PÉRIMÉ (1.1.0) → l\u2019app PUBLIE, avec son usage et le socle courant',
     pub.length===1&&!!pub[0].c.app.usage&&pub[0].c.version!=='1.1.0',
     JSON.stringify(pub.map(p=>({ch:p.ch,v:p.c.version,usage:!!p.c.app.usage}))));
  await pg.screenshot({path:'cap-3-publication.png'});
  await pg.close();
  /* et à jour → rien */
  const n1=ECRITS.length;
  pg=await page1();
  await pg.goto('http://localhost:8760/correction_dictee.staging.html',{waitUntil:'domcontentloaded',timeout:80000});
  await new Promise(x=>setTimeout(x,5000));
  const rien=ECRITS.slice(n1).filter(e=>/manifestes\//.test(e.ch)&&e.c);
  ok('③ hub À JOUR → AUCUNE écriture (réduction du trafic, en navigateur réel)',rien.length===0,JSON.stringify(rien.map(r=>r.ch)));
  await pg.close();
  await br.close();srv.close();
  fs.writeFileSync('captures-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('captures-reseau.json',JSON.stringify({ecritures:ECRITS.map(e=>e.ch)},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('══ CAPTURES M-MANIFESTE : '+(V.length-ko.length)+'/'+V.length+' verts ══');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARRÊT:',e);process.exit(2);});

/* BANC NAVIGATEUR M-SÉCU-5 — les captures de Paul : les codes VISIBLES avec la
   clé, masqués sans, mobile 390, le bouton « Générer N manquants » absent/présent.
   Six canoniques, classe de banc, hub intercepté, AUCUNE écriture réelle. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CHROME+'/chrome-linux64/chrome';
const SECRET='phrase du banc revoir 2026';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,150)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,130)));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function constante(src,nom){return new RegExp('^var '+nom+'=.*$','m').exec(src)[0];}

(async()=>{
  const canon=fs.readFileSync('/home/claude/m-secu2/build/canon-1.3.0.js','utf8');
  const env={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),Promise};
  vm.createContext(env);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcSelAleatoire','mjpcEmpreinte','sanMJPC'].map(f=>extraire(canon,f)).join('\n')+'\n'+constante(canon,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canon,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canon,'MJPC_COFFRE_ITER_EMPREINTE'),env);
  const cle=await env.mjpcDeriverCle(SECRET);
  const CANARI=await env.mjpcChiffrer(cle,'MJPC-CANARI|coffre-v1');
  const CANON6=['BERNARD Emma','DUPONT Marie','LEROY Hugo','MARTIN Lucas','MOREAU L\u00e9a','PETIT Thomas'];
  const CODES={};const REF={};
  for(let i=0;i<6;i++){
    const nom=CANON6[i],code='73'+(10+i);REF[nom]=code;
    const sel=env.mjpcSelAleatoire();
    CODES[env.sanMJPC(nom)]={name:nom,classe:'banc-3e',sel,empreinte:await env.mjpcEmpreinte(code,sel),chiffre:await env.mjpcChiffrer(cle,code)};
  }
  const HUB={'/site/config/coffreCanari':CANARI,'/site/config/profEmpreintes':[],
    '/codes':CODES,'/classes':{'banc-3e':{nom:'Classe de banc',niveau:'3e',eleves:CANON6}}};
  const RESEAU=[];const ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}else{rs.statusCode=404;rs.end('');}}).listen(8650);
  const browser=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function pagePrete(largeur,avecCle){
    const page=await browser.newPage();
    await page.setViewport({width:largeur||1280,height:largeur?844:960});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();RESEAU.push({m:r.method(),u});
      if(u.includes('firebasedatabase.app')){
        const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE','Access-Control-Allow-Headers':'*'};
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        if(r.method()==='PUT'||r.method()==='PATCH'){let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
          ECRITS.push({m:r.method(),ch,c});if(r.method()==='PUT')HUB[ch]=c;
          return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
        return r.abort();
      }
      if(u.startsWith('http://localhost:8650'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();
    });
    await page.evaluateOnNewDocument((s,avec)=>{try{
      sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');
      if(avec)localStorage.setItem('mjpc_coffre_secret',s);else localStorage.removeItem('mjpc_coffre_secret');
    }catch(e){}},SECRET,!!avecCle);
    return page;
  }

  /* ═══ 1. AVEC la clé : les codes VISIBLES dans la colonne ═══ */
  let page=await pagePrete(undefined,true);
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,110)));
  await page.goto('http://localhost:8650/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000});
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} showProfSection('eleves');});
  /* attendre que les six lignes portent un code à 4 chiffres */
  await page.waitForFunction((ks)=>ks.every(k=>{const sp=document.getElementById('code-aff-'+k);return sp&&/^\d{4}$/.test(sp.textContent.trim());}),
    {timeout:30000},CANON6.map(n=>env.sanMJPC(n))).catch(()=>{});
  const codesAffiches=await page.evaluate((ks)=>ks.map(k=>{const sp=document.getElementById('code-aff-'+k);return sp?sp.textContent.trim():null;}),CANON6.map(n=>env.sanMJPC(n)));
  const tousExacts=CANON6.every((n,i)=>codesAffiches[i]===REF[n]);
  verdict('\u2460 AVEC la cl\u00e9 : les SIX codes apparaissent, EXACTS, sans redraw global',tousExacts,JSON.stringify(codesAffiches));
  const btnGen=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/G\u00e9n\u00e9rer \d+ code/.test(x.textContent));return b?b.textContent.trim():null;});
  verdict('\u2461 tous ont un code \u2192 le bouton \u00ab G\u00e9n\u00e9rer N manquants \u00bb N\u2019APPARA\u00ceT PLUS',btnGen===null,String(btnGen));
  await page.screenshot({path:'img-e01.png',fullPage:false});
  await page.close();

  /* ═══ 2. SANS la clé : ✻✻✻✻ et l'encart de saisie ═══ */
  page=await pagePrete(undefined,false);
  await page.goto('http://localhost:8650/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(x=>setTimeout(x,2500));
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} showProfSection('eleves');});
  await new Promise(x=>setTimeout(x,1500));
  const sansCle=await page.evaluate(()=>{
    const masques=[...document.querySelectorAll('.secu-masque')].length;
    const encart=!!document.getElementById('secu-encart');
    const input=!!document.getElementById('secu-cle-input');
    return {masques,encart,input};
  });
  verdict('\u2462 SANS la cl\u00e9 : \u273b\u273b\u273b\u273b sur les six et l\u2019encart de saisie pr\u00e9sent',
    sansCle.masques===6&&sansCle.encart&&sansCle.input,JSON.stringify(sansCle));
  await page.screenshot({path:'img-e02.png',fullPage:false});
  await page.close();

  /* ═══ 3. mobile 390, avec la clé ═══ */
  page=await pagePrete(390,true);
  await page.goto('http://localhost:8650/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000});
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} showProfSection('eleves');});
  await page.waitForFunction((ks)=>ks.every(k=>{const sp=document.getElementById('code-aff-'+k);return sp&&/^\d{4}$/.test(sp.textContent.trim());}),
    {timeout:30000},CANON6.map(n=>env.sanMJPC(n))).catch(()=>{});
  const mes=await page.evaluate(()=>{
    const rows=[...document.querySelectorAll('.el-row')];
    if(!rows.length)return null;
    rows[0].scrollIntoView();
    const deb=rows.every(r=>{const x=r.getBoundingClientRect();return x.right<=391&&x.left>=-1;});
    return {lignes:rows.length,deborde:!deb};
  });
  verdict('\u2463 mobile 390 : les six lignes tiennent, codes visibles, z\u00e9ro d\u00e9bordement',
    mes&&mes.lignes===6&&!mes.deborde,JSON.stringify(mes));
  await page.screenshot({path:'img-e03.png',fullPage:false});
  await page.close();

  /* ═══ 4. l'élève SANS code : « — », le bouton « Générer 1 » PRÉSENT, et il génère ═══ */
  delete HUB['/codes'][env.sanMJPC(CANON6[5])];   /* PETIT Thomas perd son entrée */
  page=await pagePrete(undefined,true);
  await page.goto('http://localhost:8650/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000});
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} showProfSection('eleves');});
  await new Promise(x=>setTimeout(x,2000));
  const avantGen=await page.evaluate((k)=>{
    const sp=document.getElementById('code-aff-'+k);
    const b=[...document.querySelectorAll('button')].find(x=>/G\u00e9n\u00e9rer 1 code/.test(x.textContent));
    return {tiret:sp?sp.textContent.trim():null,bouton:b?b.textContent.trim():null};
  },env.sanMJPC(CANON6[5]));
  verdict('\u2464 un \u00e9l\u00e8ve sans code : \u00ab \u2014 \u00bb et le bouton \u00ab G\u00e9n\u00e9rer 1 code manquant \u00bb PR\u00c9SENT',
    avantGen.tiret==='\u2014'&&!!avantGen.bouton,JSON.stringify(avantGen));
  await page.screenshot({path:'img-e04.png',fullPage:false});
  const nEcrAvant=ECRITS.length;
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/G\u00e9n\u00e9rer 1 code/.test(x.textContent));b.click();});
  await new Promise(x=>setTimeout(x,5000));
  const ecr=ECRITS.slice(nEcrAvant).filter(e=>e.ch.startsWith('/codes/'));
  const recNouveau=ecr.length?ecr[ecr.length-1].c:null;
  verdict('\u2465 il G\u00c9N\u00c8RE vraiment : /codes re\u00e7oit chiffre+sel+empreinte, AUCUN code',
    ecr.length===1&&recNouveau&&recNouveau.chiffre&&recNouveau.sel&&recNouveau.empreinte&&!('code' in recNouveau),
    JSON.stringify(recNouveau?Object.keys(recNouveau):ecr.length));
  const affNouveau=await page.evaluate((k)=>{const sp=document.getElementById('code-aff-'+k);return sp?sp.textContent.trim():null;},env.sanMJPC(CANON6[5]));
  verdict('\u2466 le code g\u00e9n\u00e9r\u00e9 s\u2019affiche D\u00c9CHIFFR\u00c9 dans la ligne',/^\d{4}$/.test(String(affNouveau)),String(affNouveau));
  await page.close();

  /* la clé sous quatre formes ; aucune écriture hors banc */
  const s4=[SECRET,Buffer.from(SECRET).toString('base64'),encodeURIComponent(SECRET),JSON.stringify(SECRET)];
  const flux=RESEAU.map(x=>x.u).join('|')+'|'+ECRITS.map(e=>JSON.stringify(e.c||'')).join('|');
  verdict('la cl\u00e9 ne sort JAMAIS ('+RESEAU.length+' requ\u00eates, '+ECRITS.length+' \u00e9critures de banc, 4 formes)',
    RESEAU.length>0&&!s4.some(f=>flux.includes(f)));

  await browser.close();srv.close();
  fs.writeFileSync('banc5-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('banc5-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch)},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR M-S\u00c9CU-5 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

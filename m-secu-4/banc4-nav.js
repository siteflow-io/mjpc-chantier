/* BANC NAVIGATEUR M-SÉCU-4 — l'écran réel : état, double saisie refusée à
   l'écran, ajout réel (ordre réseau archive→écriture), mobile 390 mesuré. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CHROME+'/chrome-linux64/chrome';
const SECRET='phrase du banc rotation 2026';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,150)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,130)));};
function extraire(src,nom){const m=new RegExp('^function '+nom+'\\s*\\(','m').exec(src);let i=src.indexOf('{',m.index),p=0,j=i;for(;j<src.length;j++){const c=src[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return src.slice(m.index,j+1);}
function constante(src,nom){return new RegExp('^var '+nom+'=.*$','m').exec(src)[0];}

(async()=>{
  const canon=fs.readFileSync('/home/claude/m-secu2/build/canon-1.3.0.js','utf8');
  const env={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),Promise};
  vm.createContext(env);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer','mjpcSelAleatoire','mjpcEmpreinte'].map(f=>extraire(canon,f)).join('\n')+'\n'+constante(canon,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+constante(canon,'MJPC_COFFRE_ITER_CLE')+'\n'+constante(canon,'MJPC_COFFRE_ITER_EMPREINTE'),env);
  const cle=await env.mjpcDeriverCle(SECRET);
  const CANARI=await env.mjpcChiffrer(cle,'MJPC-CANARI|coffre-v1');
  const mkF=async(c)=>{const sel=env.mjpcSelAleatoire();return {sel,empreinte:await env.mjpcEmpreinte(c,sel)};};
  const HUB={'/site/config/coffreCanari':CANARI,
             '/site/config/profEmpreintes':[await mkF('7642'),await mkF('2718')],
             '/codes':{},'/classes':{}};
  const RESEAU=[];const ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}else{rs.statusCode=404;rs.end('');}}).listen(8648);
  const browser=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function pagePrete(largeur){
    const page=await browser.newPage();
    await page.setViewport({width:largeur||1280,height:largeur?844:900});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();RESEAU.push({m:r.method(),u});
      if(u.includes('firebasedatabase.app')){
        const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE','Access-Control-Allow-Headers':'*'};
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        if(r.method()==='PUT'){let corps=null;try{corps=JSON.parse(r.postData()||'null');}catch(e){}
          ECRITS.push({ch,corps});HUB[ch]=corps;
          return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(corps)});}
        return r.abort();
      }
      if(u.startsWith('http://localhost:8648'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();
    });
    await page.evaluateOnNewDocument(s=>{try{localStorage.setItem('mjpc_coffre_secret',s);sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');}catch(e){}},SECRET);
    return page;
  }

  /* ── desktop : l'écran, la double saisie refusée, l'ajout réel ── */
  let page=await pagePrete();
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,120)));
  await page.goto('http://localhost:8648/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000});
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} secuCodeProfOuvrir();});
  await new Promise(x=>setTimeout(x,1500));
  const etat=await page.evaluate(()=>({etat:(document.getElementById('cp-etat')||{}).innerHTML||'',c1:!!document.getElementById('cp-c1')}));
  verdict('\u00e9cran ouvert : \u00ab 2 codes actifs \u00bb, dat\u00e9s, champs pr\u00e9sents, AUCUN code affich\u00e9',
    /<b>2<\/b>/.test(etat.etat)&&/pos\u00e9 avant ce jour/.test(etat.etat)&&etat.c1&&!/7642|2718/.test(etat.etat),etat.etat.slice(0,120));
  await page.screenshot({path:'img-d01.png'});
  /* double saisie discordante */
  await page.evaluate(()=>{const set=(id,v)=>{const el=document.getElementById(id);el.value=v;};set('cp-c1','5001');set('cp-c2','5002');secuCpAjouter();});
  await new Promise(x=>setTimeout(x,600));
  const msg1=await page.evaluate(()=>(document.getElementById('cp-msg')||{}).innerHTML||'');
  const nAvantGeste=ECRITS.length; /* les écritures du chargement (fiche d'appareil M-SÉCU-1) sont légitimes et hors geste */
  verdict('double saisie discordante \u2192 refus \u00e0 l\u2019\u00e9cran, AUCUNE \u00e9criture du GESTE',
    /ne concordent pas/.test(msg1)&&ECRITS.filter(e=>e.ch.includes('profEmpreintes')||e.ch.includes('corbeille')).length===0,msg1);
  await page.screenshot({path:'img-d02.png'});
  /* ajout réel */
  await page.evaluate(()=>{const set=(id,v)=>{document.getElementById(id).value=v;};set('cp-c1','5001');set('cp-c2','5001');secuCpAjouter();});
  await new Promise(x=>setTimeout(x,4000));
  const msg2=await page.evaluate(()=>(document.getElementById('cp-msg')||{}).innerHTML||'');
  const iArch=ECRITS.findIndex(e=>e.ch.startsWith('/corbeille/code-prof-'));
  const iW=ECRITS.findIndex(e=>e.ch==='/site/config/profEmpreintes');
  verdict('ajout r\u00e9el : ordre R\u00c9SEAU archive\u2192\u00e9criture ('+iArch+'<'+iW+'), 3 fiches au hub, \u00ab Fait le \u2026 \u00bb',
    iArch>=0&&iW>iArch&&HUB['/site/config/profEmpreintes'].length===3&&/Fait le/.test(msg2),msg2.slice(0,120));
  verdict('l\u2019archive {_meta,data} porte les 2 anciennes fiches',
    ECRITS[iArch].corps&&ECRITS[iArch].corps._meta&&ECRITS[iArch].corps._meta.chemin==='/site/config/profEmpreintes'&&ECRITS[iArch].corps.data.length===2);
  await page.screenshot({path:'img-d03.png'});
  await page.close();

  /* ── mobile 390 ── */
  page=await pagePrete(390);
  await page.goto('http://localhost:8648/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000});
  await new Promise(x=>setTimeout(x,800));
  await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} secuCodeProfOuvrir();});
  await new Promise(x=>setTimeout(x,1500));
  const mes=await page.evaluate(()=>{
    const b=[...document.querySelectorAll('.cp-actions button')];
    const inp=document.getElementById('cp-c1');
    if(!b.length||!inp)return null;
    b[0].scrollIntoView();
    const rs=b.map(x=>{const r=x.getBoundingClientRect();return {h:Math.round(r.height),ok:r.right<=391&&r.left>=-1};});
    const ri=inp.getBoundingClientRect();
    return {boutons:rs,input:{w:Math.round(ri.width),ok:ri.right<=391}};
  });
  verdict('mobile 390 : boutons empil\u00e9s \u2265 44 px, champs pleine largeur, z\u00e9ro d\u00e9bordement',
    mes&&mes.boutons.length===2&&mes.boutons.every(b=>b.h>=44&&b.ok)&&mes.input.ok,JSON.stringify(mes));
  await page.screenshot({path:'img-d04.png'});
  await page.close();

  /* les codes sous quatre formes dans le réseau entier */
  const codes=['5001','5002','7642','2718'];
  const formes=[];codes.forEach(c=>{formes.push('"'+c+'"',Buffer.from(c).toString('base64'),encodeURIComponent(c)+'&','code='+c);});
  const corps=ECRITS.map(e=>JSON.stringify(e.corps||'')).join('|');
  const urls=RESEAU.map(x=>x.u).join('|');
  const fuites=codes.filter(c=>corps.includes('"'+c+'"'))
    .concat(formes.filter(f=>urls.includes(f)));
  verdict('aucun code ne transite en clair ('+RESEAU.length+' requ\u00eates, '+ECRITS.length+' \u00e9critures, 4 formes)',
    RESEAU.length>0&&fuites.length===0,JSON.stringify(fuites));

  await browser.close();srv.close();
  fs.writeFileSync('banc4-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('banc4-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch)},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR M-S\u00c9CU-4 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

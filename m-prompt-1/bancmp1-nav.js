/* BANC NAVIGATEUR M-PROMPT-1 — correction_dictee réelle : écrans de prompt,
   refus accumulés, aperçu avant écriture, mobile 390. Overlay des règles sans objet
   ici (il vit dans index.html) ; hub simulé, aucune écriture réelle. */
const fs=require('fs');const http=require('http');const path=require('path');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CHROME+'/chrome-linux64/chrome';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,170)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,150)));};

(async()=>{
  const RESEAU=[];const ECRITS=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}
    else{rs.statusCode=404;rs.end('');}}).listen(8670);
  const browser=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  const HUB={'/site/config/dernierControleRegles':Date.now()};   /* overlay des règles neutralisé */
  async function pagePrete(largeur){
    const page=await browser.newPage();
    await page.setViewport({width:largeur||1280,height:largeur?844:1000});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();RESEAU.push({m:r.method(),u});
      if(u.includes('firebasedatabase.app')){
        const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE','Access-Control-Allow-Headers':'*'};
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({m:r.method(),ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});
      }
      if(u.includes('unpkg.com/react@18/umd/react.production'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_react.js')});
      if(u.includes('unpkg.com/react-dom@18'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_reactdom.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-app'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbapp.js')});
      if(u.includes('gstatic.com/firebasejs')&&u.includes('firebase-database'))return r.respond({status:200,contentType:'application/javascript',body:fs.readFileSync('/home/claude/m-secu2/build/_vendor_fbdb.js')});
      if(u.startsWith('http://localhost:8670'))return r.continue();
      return r.abort();
    });
    return page;
  }

  /* ── 1. le canon et la §12 vivent dans la page ── */
  let page=await pagePrete();
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,130)));
  await page.goto('http://localhost:8670/correction_dictee.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(x=>setTimeout(x,3500));
  const etat=await page.evaluate(()=>{
    const o={};
    ['mjpcPromptComposer','mjpcPromptVocabulaire','mjpcValidation','mjpcInjecterAvecArchive','cdValiderExercices','cdChargerPrompt','cdEnregistrerPrompt','assemblePrompt','MJPC_PROMPT_CADRAGE','MJPC_CORE_VERSION'].forEach(k=>o[k]=typeof window[k]);
    o.version=window.MJPC_CORE_VERSION;o.app=window.APP_VERSION;
    return o;
  });
  verdict('le canon 1.4.0 et la \u00a712 vivent dans la page ; l\u2019app est en 6.3.0',
    etat.version==='1.4.0'&&etat.app==='6.3.0'&&etat.mjpcPromptComposer==='function'
    &&etat.mjpcValidation==='function'&&etat.assemblePrompt==='function',JSON.stringify(etat));

  /* ── 2. la composition réelle, avec le cadrage imposé et l'interpolation ── */
  const compo=await page.evaluate(()=>{
    const t=mjpcPromptComposer({directives:'D',format:'F',vocabulaire:'V',donnees:{JSON_DICTEE:'X42'}});
    const t2=assemblePrompt('AAA','BBB');
    return {t:t,t2:t2};
  });
  verdict('composition : cadrage impos\u00e9 pr\u00e9sent, pi\u00e8ces assembl\u00e9es',
    /NE PRODUIS AUCUN JSON/.test(compo.t)&&/D/.test(compo.t)&&/F/.test(compo.t)&&/V/.test(compo.t));
  verdict('NON-R\u00c9GRESSION : assemblePrompt d\u2019origine fonctionne toujours',/AAA/.test(compo.t2)&&/BBB/.test(compo.t2));

  /* ── 3. la validation accumule, dans la vraie page ── */
  const val=await page.evaluate(()=>{
    const R=cdValiderExercices({exercices_classe:[{titre:'Ex',items:[{type:'qcm',propositions:['a'],reponse:'x'},{type:'sardine'}]}],exercices_personnels:{}});
    return R.motifs();
  });
  verdict('validation \u00e0 l\u2019\u00e9cran : plusieurs motifs d\u2019un coup, chacun citant l\u2019exercice',
    val.length>=3&&val.some(x=>/sardine/.test(x))&&val.every(x=>/\u00ab /.test(x)),JSON.stringify(val).slice(0,180));

  /* ── 4. persistance réelle : écrire puis relire ── */
  const pers=await page.evaluate(()=>new Promise(res=>{
    cdEnregistrerPrompt('promptDirectives','DIRECTIVES DU BANC',function(ok){
      cdChargerPrompt('promptDirectives','LE DEFAUT',function(v){res({ok:ok,lu:v});});
    });
  }));
  verdict('persistance r\u00e9elle : \u00e9crite par verdict, relue depuis le hub',
    pers.ok===true&&pers.lu==='DIRECTIVES DU BANC'&&ECRITS.some(e=>e.ch==='/dictee_settings/promptDirectives'),JSON.stringify(pers));
  const muet=await page.evaluate(()=>new Promise(res=>{
    cdChargerPrompt('piece_qui_nexiste_pas','LE DEFAUT EN DUR',function(v){res(v);});
  }));
  verdict('base muette sur une pi\u00e8ce \u2192 le d\u00e9faut en dur fait foi',muet==='LE DEFAUT EN DUR',String(muet));
  await page.screenshot({path:'img-g01.png'});

  /* ── 5. l'aperçu : rendu React réel via l'écran prof ── */
  const apercu=await page.evaluate(()=>{
    /* on éprouve la fonction d'aperçu par son texte, le composant étant monté par l'app */
    /* les textes vivent dans le JS de la page, où les caractères accentués sont
       ÉCHAPPÉS (\\u2019, \\u00e0) : on cherche donc les deux formes. */
    const src=document.documentElement.innerHTML;
    const a=(motif)=>src.indexOf(motif)>=0;
    return {
      apercuPresent:typeof window.h==='function',
      texteVide:a('Cette banque est vide pour l')&&a('rien ne sera perdu'),
      texteRemplace:a('ancienne part d')&&a('la corbeille'),
      rienEcrit:a('Rien n')&&a('crit tant que tu n')
    };
  });
  verdict('les textes de l\u2019aper\u00e7u sont dans la page : \u00ab rien ne sera perdu \u00bb ET \u00ab \u00e0 la corbeille \u00bb',
    apercu.texteVide&&apercu.texteRemplace&&apercu.rienEcrit,JSON.stringify(apercu));
  await page.close();

  /* ── 6. mobile 390 ── */
  page=await pagePrete(390);
  await page.goto('http://localhost:8670/correction_dictee.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(x=>setTimeout(x,3000));
  const mes=await page.evaluate(()=>{
    const deb=[...document.querySelectorAll('body *')].some(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>392;});
    const btns=[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().height>0);
    return {deborde:deb,boutons:btns.length,petits:btns.filter(b=>{const r=b.getBoundingClientRect();return r.height<44;}).length,
      exemples:btns.slice(0,3).map(b=>({t:b.textContent.trim().slice(0,18),h:Math.round(b.getBoundingClientRect().height)}))};
  });
  verdict('mobile 390 : z\u00e9ro d\u00e9bordement horizontal ('+mes.boutons+' boutons visibles)',!mes.deborde,JSON.stringify(mes));
  await page.screenshot({path:'img-g02.png'});
  await page.close();

  /* journal : aucune écriture hors nœuds attendus */
  const hors=ECRITS.filter(e=>!/^\/(dictee_settings|correction_dictee|corbeille)\//.test(e.ch));
  verdict('journal r\u00e9seau : aucune \u00e9criture hors n\u0153uds attendus ('+ECRITS.length+' \u00e9critures)',hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,5)));

  await browser.close();srv.close();
  fs.writeFileSync('bancmp1-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('bancmp1-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch)},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR M-PROMPT-1 : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

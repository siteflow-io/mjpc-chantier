/* BANC NAVIGATEUR SITE-COURS-2a — la zone réelle : prompt, refus nommé, aperçu,
   choix de remplacement, mobile 390. Overlay « règles Firebase » NEUTRALISÉ
   (dernierControleRegles à aujourd'hui). Hub simulé, aucune écriture réelle. */
const fs=require('fs');const http=require('http');const path=require('path');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CHROME=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CHROME+'/chrome-linux64/chrome';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,160)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,140)));};

(async()=>{
  const HUB={
    '/site/config/dernierControleRegles':Date.now(),      /* NEUTRALISE l'overlay des règles */
    '/site/atelier/documents':{},'/classes':{},'/codes':{},
  };
  const ECRITS=[];const RESEAU=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}else{rs.statusCode=404;rs.end('');}}).listen(8660);
  const browser=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
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
      if(u.startsWith('http://localhost:8660'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();
    });
    await page.evaluateOnNewDocument(()=>{try{sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');}catch(e){}});
    return page;
  }
  const JSON_BON={produit:'fiche_seance',titre:'Le portrait de Fantine',
    cases:{titre:true,objectif:true,criteres_reussite:true},
    valeurs:{titre:{texte:'Le portrait de Fantine'},objectif:{texte:'Rep\u00e9rer les proc\u00e9d\u00e9s du portrait'},
      criteres_reussite:{items:["J\u2019ai relev\u00e9 trois adjectifs","J\u2019ai cit\u00e9 le texte"]}},
    blocs:[{id:'consigne',valeurs:{texte:'Rel\u00e8ve les adjectifs du portrait.'}}]};

  async function ouvrirZone(page){
    await page.goto('http://localhost:8660/index.staging.html',{waitUntil:'domcontentloaded',timeout:60000});
    await new Promise(x=>setTimeout(x,2500));
    await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){}});
    await new Promise(x=>setTimeout(x,1800));
    await page.evaluate(()=>{atIAOuvrir();});
    await page.waitForSelector('#at-ia-coller',{timeout:20000}).catch(()=>{});
    await new Promise(x=>setTimeout(x,600));
  }

  /* ── 1. la zone prompt (capture) + overlay neutralisé ── */
  let page=await pagePrete();
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,120)));
  await ouvrirZone(page);
  const z=await page.evaluate(()=>({
    titre:!!document.querySelector('.at-ia-titre'),
    zone:!!document.getElementById('at-ia-coller'),
    overlay:!!document.getElementById('m8-regles-overlay'),
    boutons:[...document.querySelectorAll('.at-ia-actions .at-btn')].map(b=>b.textContent.trim())
  }));
  verdict('la zone \u00ab \u00c9crire avec une IA \u00bb s\u2019ouvre ; overlay des r\u00e8gles NEUTRALIS\u00c9',
    z.titre&&z.zone&&!z.overlay&&z.boutons.length>=3,JSON.stringify(z));
  await page.screenshot({path:'img-f01.png'});

  /* ── 2. le refus nommé (capture) ── */
  await page.evaluate(()=>{document.getElementById('at-ia-coller').value='{"cases":{"objectif":true,"machin_invente":true,"qr_code":true}}';atIAVerifier();});
  await new Promise(x=>setTimeout(x,700));
  const refus=await page.evaluate(()=>(document.getElementById('at-ia-msg')||{}).innerHTML||'');
  verdict('refus NOMM\u00c9 \u00e0 l\u2019\u00e9cran : l\u2019identifiant invent\u00e9 ET la r\u00e9serv\u00e9e, cit\u00e9s',
    /machin_invente/.test(refus)&&/qr_code/.test(refus)&&(refus.match(/<li>/g)||[]).length>=2,refus.slice(0,140));
  await page.screenshot({path:'img-f02.png'});

  /* ── 3. l'aperçu avant injection (capture) ── */
  await page.evaluate((j)=>{document.getElementById('at-ia-coller').value=JSON.stringify(j);atIAVerifier();},JSON_BON);
  await new Promise(x=>setTimeout(x,800));
  const ap=await page.evaluate(()=>{
    const a=document.getElementById('at-ia-apercu');
    const bs=[...a.querySelectorAll('.at-ia-choix .at-btn')];
    return {html:a.innerHTML.slice(0,400),
      boutons:bs.map(b=>({t:b.textContent.trim(),h:Math.round(b.getBoundingClientRect().height),cls:b.className})),
      texte:a.innerText.slice(0,300)};
  });
  verdict('APER\u00c7U : ce qui sera \u00e9crit, en fran\u00e7ais, avant toute \u00e9criture',
    /Rien n\u2019est enregistr\u00e9/.test(ap.texte)&&/Afficher l\u2019objectif/.test(ap.texte),ap.texte.slice(0,120));
  verdict('CHOIX : deux boutons, m\u00eame classe, aucun pr\u00e9-choisi',
    ap.boutons.length===2&&ap.boutons[0].cls===ap.boutons[1].cls&&ap.boutons.every(b=>b.h>=44),JSON.stringify(ap.boutons));
  /* Les écritures antérieures sont étrangères au geste : /manifestes et /presence
     (mécanismes pré-existants du site, prouvés par grep dans index.base.html) et
     la feuille vide qu'ouvre le banc lui-même via atNouvelleFeuille(). On mesure
     donc le DELTA du geste : entre la vérification et le choix, RIEN ne s'écrit. */
  const ecrAvant=ECRITS.length;
  await new Promise(x=>setTimeout(x,1200));
  verdict('aucune \u00e9criture entre la v\u00e9rification et le choix (delta du geste)',ECRITS.length===ecrAvant,String(ECRITS.length-ecrAvant));
  await page.screenshot({path:'img-f03.png'});

  /* ── 4. nouvelle feuille ── */
  await page.evaluate(()=>{[...document.querySelectorAll('.at-ia-choix .at-btn')].find(b=>/Cr\u00e9er une nouvelle/.test(b.textContent)).click();});
  await new Promise(x=>setTimeout(x,2500));
  const doc=await page.evaluate(()=>({titre:AT.doc&&AT.doc.titre,cases:Object.keys((AT.doc||{}).cases||{}).length,blocs:((AT.doc||{}).contenu||[]).length,id:AT.docId}));
  verdict('NOUVELLE FEUILLE cr\u00e9\u00e9e et remplie, l\u2019\u00e9diteur revient',
    doc.titre==='Le portrait de Fantine'&&doc.blocs===1&&doc.cases>3,JSON.stringify(doc));

  /* ── 5. le remplacement explicite (capture de la confirmation) ── */
  await page.evaluate((j)=>{atIAOuvrir();setTimeout(()=>{document.getElementById('at-ia-coller').value=JSON.stringify(Object.assign({},j,{titre:'Version remplac\u00e9e'}));atIAVerifier();},400);},JSON_BON);
  await new Promise(x=>setTimeout(x,1600));
  await page.evaluate(()=>{[...document.querySelectorAll('.at-ia-choix .at-btn')].find(b=>/Remplacer/.test(b.textContent)).click();});
  await new Promise(x=>setTimeout(x,600));
  const conf=await page.evaluate(()=>{const m=document.getElementById('at-modale');return m?m.innerText.slice(0,300):null;});
  verdict('la confirmation de remplacement CHIFFRE ce qui sera perdu et annonce la corbeille',
    conf&&/Tu perdras \d+ case/.test(conf)&&/corbeille/.test(conf),String(conf).slice(0,140));
  await page.screenshot({path:'img-f04.png'});
  const nEcr=ECRITS.length;
  await page.evaluate(()=>{[...document.querySelectorAll('#at-modale .at-btn')].find(b=>/Mettre \u00e0 la corbeille/.test(b.textContent)).click();});
  await new Promise(x=>setTimeout(x,2500));
  const suite=ECRITS.slice(nEcr);
  const iA=suite.findIndex(e=>e.ch.indexOf('/corbeille/')===0);
  const iD=suite.findIndex(e=>e.ch.indexOf('/site/atelier/documents/')===0);
  verdict('ordre R\u00c9SEAU : archive corbeille PUIS remplacement ('+iA+'<'+iD+')',iA===0&&iD>iA,JSON.stringify(suite.map(e=>e.ch)));
  const titre=await page.evaluate(()=>AT.doc&&AT.doc.titre);
  verdict('la feuille ouverte porte la nouvelle version',titre==='Version remplac\u00e9e',String(titre));
  await page.close();

  /* ── 6. mobile 390 ── */
  page=await pagePrete(390);
  await ouvrirZone(page);
  const mes=await page.evaluate(()=>{
    const bs=[...document.querySelectorAll('.at-ia-actions .at-btn')];
    const ta=document.getElementById('at-ia-coller');
    const i=document.querySelector('.at-i');
    if(!bs.length||!ta)return null;
    const deb=[...document.querySelectorAll('.at-ia *')].some(e=>e.getBoundingClientRect().right>391);
    return {boutons:bs.map(b=>{const r=b.getBoundingClientRect();return {h:Math.round(r.height),w:Math.round(r.width)};}),
      zone:Math.round(ta.getBoundingClientRect().width),
      info:i?{h:Math.round(i.getBoundingClientRect().height),w:Math.round(i.getBoundingClientRect().width)}:null,
      deborde:deb};
  });
  verdict('mobile 390 : cibles \u2265 44 px en hauteur ET largeur, \u24d8 comprise, z\u00e9ro d\u00e9bordement',
    mes&&mes.boutons.every(b=>b.h>=44&&b.w>=44)&&mes.info&&mes.info.h>=44&&mes.info.w>=44&&!mes.deborde&&mes.zone<=390,
    JSON.stringify(mes));
  await page.screenshot({path:'img-f05.png'});
  await page.close();

  /* journal : aucune écriture hors nœuds attendus */
  /* /manifestes/index et /presence/prof : mécanismes PRÉ-EXISTANTS du site au
     chargement (présents dans index.base.html, hors de ce morceau) — écartés PAR PREUVE. */
  const PREEXISTANT=/^\/(manifestes|presence)\//;
  const hors=ECRITS.filter(e=>!/^\/(site\/atelier|corbeille)\//.test(e.ch)&&!PREEXISTANT.test(e.ch));
  verdict('journal r\u00e9seau : la section n\u2019\u00e9crit QUE /site/atelier et /corbeille ('+ECRITS.length+' \u00e9critures, pr\u00e9-existantes \u00e9cart\u00e9es par preuve)',hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,4)));

  await browser.close();srv.close();
  fs.writeFileSync('banc2a-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('banc2a-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch)},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC NAVIGATEUR SITE-COURS-2a : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

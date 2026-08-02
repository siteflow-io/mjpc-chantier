/* BANC ÉCRAN SITE-COURS-2e — joué comme une RECHERCHE, pas une confirmation. */
const fs=require('fs');const http=require('http');const path=require('path');const vm=require('vm');
const puppeteer=require('/home/claude/.chromium/node_modules/puppeteer-core');
const CH=fs.readdirSync('/home/claude/.cache/puppeteer/chrome')[0];
const EXE='/home/claude/.cache/puppeteer/chrome/'+CH+'/chrome-linux64/chrome';
const V=[];const verdict=(n,ok,d)=>{V.push({n,ok:!!ok,d:String(d||'').slice(0,200)});console.log((ok?'\u2713':'\u2717 \u00c9CHEC')+' '+n+(ok?'':' \u2014 '+String(d).slice(0,180)));};
function ex(s,n){const m=new RegExp('^function '+n+'\\s*\\(','m').exec(s);let i=s.indexOf('{',m.index),p=0,j=i;for(;j<s.length;j++){const c=s[j];if(c==='{')p++;else if(c==='}'){p--;if(p===0)break;}}return s.slice(m.index,j+1);}
function cs(s,n){return new RegExp('^var '+n+'=.*$','m').exec(s)[0];}
const SECRET='phrase du banc 2e 2026';
const FONCTIONS=['chEntreesDuNiveau','chCompetencesC4','chVocabulaireCompetences','chVocabulaireEntrees',
 'chEtatAnnee','chSommaire','chSommaireSeance','chSommaireObjet','chSommaireSuffisant','chValiderDeclaration','chChargerEtatAnnee'];
(async()=>{
  const canonSrc=fs.readFileSync('canon.js','utf8');
  const e0={crypto:globalThis.crypto,TextEncoder,TextDecoder,btoa:x=>Buffer.from(x,'binary').toString('base64'),atob:x=>Buffer.from(x,'base64').toString('binary'),Promise};
  vm.createContext(e0);
  vm.runInContext(['mjpcCryptoDispo','_mjpcTxt','_mjpcB64','_mjpcDeB64','_mjpcHex','mjpcDeriverCle','mjpcChiffrer'].map(f=>ex(canonSrc,f)).join('\n')
    +'\n'+cs(canonSrc,'MJPC_COFFRE_SEL_DERIVATION')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_CLE')+'\n'+cs(canonSrc,'MJPC_COFFRE_ITER_EMPREINTE'),e0);
  const CANARI=await e0.mjpcChiffrer(await e0.mjpcDeriverCle(SECRET),'MJPC-CANARI|coffre-v1');
  const taxo=JSON.parse(fs.readFileSync('taxo.json','utf8'));
  const existant={title:'La satire',ordre:3,published:{'3e_x':true},seances:[
    {title:'\u00c9tude de texte',type:'etude_texte',items:{'etude':{title:'\u00c9tude',kind:'doc',source:'drive',ref:''}}}]};
  const HUB={'/site/config/dernierControleRegles':Date.now(),'/site/config/coffreCanari':CANARI,
    '/taxonomie':taxo,'/classes':{},'/codes':{},
    '/site/3e':{chapitres:[null,JSON.parse(JSON.stringify(existant)),{title:'Chap 2',ordre:2,entree:'recit',competencesMajeures:['c4-ecrire-01']}]},
    '/site/3e/chapitres':[null,JSON.parse(JSON.stringify(existant)),{title:'Chap 2',ordre:2,entree:'recit',competencesMajeures:['c4-ecrire-01']}],
    '/site/6e/chapitres':[]};
  const ECRITS=[],RESEAU=[];
  const srv=http.createServer((rq,rs)=>{const p=path.join(__dirname,rq.url.split('?')[0].slice(1));
    if(fs.existsSync(p)&&fs.statSync(p).isFile()){rs.setHeader('Content-Type','text/html; charset=utf-8');rs.end(fs.readFileSync(p));}else{rs.statusCode=404;rs.end('');}}).listen(8740);
  const br=await puppeteer.launch({executablePath:EXE,headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
  async function page1(l){
    const page=await br.newPage();
    await page.setViewport({width:l||1280,height:l?844:1100});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();RESEAU.push(u);
      if(u.includes('firebasedatabase.app')){
        const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE','Access-Control-Allow-Headers':'*'};
        const ch=decodeURIComponent(new URL(u).pathname.replace(/\.json$/,''));
        if(r.method()==='OPTIONS')return r.respond({status:200,headers:H,body:''});
        if(r.method()==='GET')return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(ch in HUB?HUB[ch]:null)});
        let c=null;try{c=JSON.parse(r.postData()||'null');}catch(e){}
        ECRITS.push({ch,c});if(r.method()==='PUT')HUB[ch]=c;
        return r.respond({status:200,contentType:'application/json',headers:H,body:JSON.stringify(c)});}
      if(u.startsWith('http://localhost:8740'))return r.continue();
      if(u.includes('ntfy.sh'))return r.respond({status:200,body:'{}'});
      return r.abort();});
    await page.evaluateOnNewDocument((s)=>{try{localStorage.setItem('mjpc_coffre_secret',s);sessionStorage.removeItem('mjpc_eleve');localStorage.removeItem('mjpc_eleve');}catch(e){}},SECRET);
    return page;}
  async function ouvrirChapitre(page){
    await page.evaluate(()=>{try{loginAsProf();}catch(e){} try{openProfPanel();}catch(e){} try{atelierOuvrir();}catch(e){} try{atNouvelleFeuille();}catch(e){} try{atIAOuvrir();}catch(e){}});
    await new Promise(x=>setTimeout(x,1200));
    await page.evaluate(()=>{chOuvrir();});
    await page.waitForSelector('#ch-coller',{timeout:20000}).catch(()=>{});
    await new Promise(x=>setTimeout(x,1200));}
  let page=await page1();
  page.on('pageerror',e=>console.log('ERR:',String(e).slice(0,130)));
  await page.goto('http://localhost:8740/index.sas.html',{waitUntil:'domcontentloaded',timeout:80000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1500));
  const et=await page.evaluate((n)=>({app:window.APP_VERSION,canon:window.MJPC_CORE_VERSION,
    overlay:!!document.getElementById('m8-regles-overlay'),portee:n.map(k=>k+':'+(typeof window[k])).join(' ')}),FONCTIONS);
  verdict('PORT\u00c9E : les 11 fonctions sur window, pastille 8.15.0, canon 1.5.0, overlay NEUTRALIS\u00c9',
    !/:undefined/.test(et.portee)&&et.app==='8.15.0'&&et.canon==='1.5.0'&&!et.overlay,JSON.stringify(et).slice(0,190));
  await ouvrirChapitre(page);
  /* l'ÉTAT DE L'ANNÉE dans le prompt */
  const p=await page.evaluate(()=>atPromptTexte());
  verdict('le prompt porte la D\u00c9CLARATION, les entr\u00e9es, les comp\u00e9tences C4 et L\u2019\u00c9TAT DE L\u2019ANN\u00c9E',
    /CE QUE LE CHAPITRE D\u00c9CLARE/.test(p)&&/- articles_essai/.test(p)&&/- c4-ecrire-01/.test(p)
    &&/L\u2019\u00c9TAT DE L\u2019ANN\u00c9E/.test(p)&&/Chapitre 2/.test(p)&&!/@@/.test(p),'longueur '+p.length);
  verdict('le prompt DEMANDE le d\u00e9compte des \u0153uvres au lieu de le deviner',
    /DEMANDE-MOI le d\u00e9compte, ne le devine pas/.test(p));
  /* LES REFUS ACCUMULÉS */
  await page.evaluate(()=>{document.getElementById('ch-coller').value=JSON.stringify({niveau:'3e',chapitre:{
    title:'T',entree:'bande_dessinee',competencesMajeures:['c4-ecrire-01','c4-inventee-99'],competencesMineures:['c4-ecrire-01'],
    seances:[{title:'S',type:'etude_texte',items:{}}]}});chVerifier();});
  await new Promise(x=>setTimeout(x,900));
  const refus=await page.evaluate(()=>(document.getElementById('ch-msg')||{}).innerHTML||'');
  const nMotifs=(refus.match(/<li>/g)||[]).length;
  verdict('REFUS \u00e0 l\u2019\u00e9cran : les TROIS motifs d\u2019un coup, chacun nomm\u00e9',
    nMotifs>=3&&/bande_dessinee/.test(refus)&&/c4-inventee-99/.test(refus)&&/majeure et mineure/.test(refus),
    nMotifs+' motifs · '+refus.replace(/<[^>]+>/g,' ').slice(0,150));
  await page.screenshot({path:'img-n01.png'});
  /* L'APERÇU DU SOMMAIRE */
  const ids=await page.evaluate(()=>{const i=chIdsTaxo(CH.taxo);return Object.keys(i.notions)[0];});
  const bon={niveau:'3e',chapitre:{title:'La satire',ordre:3,entree:'articles_essai',
    competencesMajeures:['c4-ecrire-01'],competencesMineures:['c4-lire-01'],
    problematique:'La satire peut-elle corriger ?',aRetenir:'Les proc\u00e9d\u00e9s de l\u2019ironie.',
    seances:[{title:'\u00c9tude de texte',type:'etude_texte',notions:[ids],
      items:{'etude':{title:'\u00c9tude',kind:'doc',source:'drive',ref:'',notions:[ids]}}}]}};
  await page.evaluate((j)=>{document.getElementById('ch-coller').value=JSON.stringify(j);chVerifier();},bon);
  await new Promise(x=>setTimeout(x,1800));
  const ap=await page.evaluate(()=>{const d=document.getElementById('ch-inv');
    const cb=document.getElementById('ch-som-oui');
    return {txt:d?d.innerText:'',coche:cb?cb.checked:null,som:!!d.querySelector('.ch-som'),
      hauteurCase:cb?Math.round(cb.closest('label').getBoundingClientRect().height):0};});
  verdict('APER\u00c7U du sommaire AVANT \u00e9criture, case COCH\u00c9E par d\u00e9faut, cible \u2265 44 px',
    ap.som&&ap.coche===true&&ap.hauteurCase>=44&&/Cr\u00e9er la feuille sommaire/.test(ap.txt),JSON.stringify({c:ap.coche,h:ap.hauteurCase}));
  verdict('le sommaire rendu porte entr\u00e9e, comp\u00e9tences EN LIBELL\u00c9, plan, notions, probl\u00e9matique',
    /Articles et essai/.test(ap.txt)&&/Notre question/.test(ap.txt)&&/plan du chapitre/i.test(ap.txt)
    &&!/c4-ecrire-01/.test(ap.txt),ap.txt.slice(ap.txt.indexOf('Ce que nous'),ap.txt.indexOf('Ce que nous')+150));
  verdict('il dit qu\u2019il SE SUFFIT \u00e0 lui-m\u00eame',/se suffit \u00e0 lui-m\u00eame/.test(ap.txt));
  await page.screenshot({path:'img-n02.png'});
  /* le message « il manque » : sommaire pauvre */
  await page.evaluate(()=>{document.getElementById('ch-coller').value=JSON.stringify({niveau:'3e',chapitre:{
    title:'Chapitre nu',seances:[{title:'S1',type:'etude_texte',items:{}}]}});chVerifier();});
  await new Promise(x=>setTimeout(x,1500));
  const pauvre=await page.evaluate(()=>(document.getElementById('ch-inv')||{}).innerText||'');
  verdict('SOMMAIRE INCOMPLET : l\u2019\u00e9cran NOMME ce qui manque',
    /Il manque \u00e0 ce sommaire/.test(pauvre)&&/entr\u00e9e du programme/.test(pauvre),
    pauvre.slice(pauvre.indexOf('Il manque'),pauvre.indexOf('Il manque')+140));
  await page.screenshot({path:'img-n03.png'});
  /* DÉCOCHÉE : rien ne s'écrit */
  await page.evaluate((j)=>{document.getElementById('ch-coller').value=JSON.stringify(j);chVerifier();},bon);
  await new Promise(x=>setTimeout(x,1500));
  const avant=ECRITS.length;
  await page.evaluate(()=>{document.getElementById('ch-som-oui').checked=false;
    [...document.querySelectorAll('.ch-choix .at-btn')].find(b=>/Compl\u00e9ter/.test(b.textContent)).click();});
  await new Promise(x=>setTimeout(x,700));
  await page.evaluate(()=>{const b=[...document.querySelectorAll('#at-modale .at-btn')].find(x=>/Compl\u00e9ter/.test(x.textContent));if(b)b.click();});
  await new Promise(x=>setTimeout(x,2500));
  const ecr=ECRITS.slice(avant);
  verdict('D\u00c9COCH\u00c9E : aucune feuille sommaire \u00e9crite',
    !ecr.some(e=>e.c&&e.c.type==='sommaire'),JSON.stringify(ecr.map(e=>e.ch)));
  verdict('\u2460 la R\u00c9PARATION \u00e0 l\u2019\u00e9cran : les notions de l\u2019item EXISTANT sont \u00e9crites',
    ecr.some(e=>/\/items\/etude\/notions$/.test(e.ch)),JSON.stringify(ecr.map(e=>e.ch)));
  verdict('la D\u00c9CLARATION est \u00e9crite, et `published` JAMAIS',
    ecr.some(e=>/\/entree$/.test(e.ch))&&ecr.some(e=>/competencesMajeures$/.test(e.ch))
    &&!ecr.some(e=>e.c&&typeof e.c==='object'&&'published' in e.c));
  await page.close();
  /* 6e : la liste OUVERTE */
  page=await page1();
  await page.goto('http://localhost:8740/index.sas.html',{waitUntil:'domcontentloaded',timeout:80000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1200));
  await ouvrirChapitre(page);
  const p6=await page.evaluate(()=>{CH.niveau='6e';return new Promise(r=>chChargerEtatAnnee(function(){r(atPromptTexte());}));});
  verdict('6e : la liste des entr\u00e9es est OUVERTE, avec son message (pas un refus)',
    /pas encore arr\u00eat\u00e9e/.test(p6)&&/propose ce qui te semble juste/.test(p6),
    p6.slice(p6.indexOf('pas encore arr'),p6.indexOf('pas encore arr')+120));
  await page.close();
  /* 390 px + IMPRESSION */
  page=await page1(390);
  await page.goto('http://localhost:8740/index.sas.html',{waitUntil:'domcontentloaded',timeout:80000});
  await page.waitForFunction('window.SECU&&SECU.valide===true',{timeout:40000}).catch(()=>{});
  await new Promise(x=>setTimeout(x,1200));
  await ouvrirChapitre(page);
  await page.evaluate((j)=>{document.getElementById('ch-coller').value=JSON.stringify(j);chVerifier();},bon);
  await new Promise(x=>setTimeout(x,2000));
  const mob=await page.evaluate(()=>{
    const deb=[...document.querySelectorAll('.at-ia *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>391;});
    const cibles=[...document.querySelectorAll('.ch-choix .at-btn, .ch-som-case')].map(b=>Math.round(b.getBoundingClientRect().height));
    return {deb:deb.length,ex:deb.slice(0,2).map(e=>e.tagName+'.'+String(e.className).slice(0,22)),
      larg:document.documentElement.scrollWidth,mini:cibles.length?Math.min.apply(null,cibles):0,n:cibles.length};});
  verdict('390 px : \u00e9cran de d\u00e9claration + sommaire, z\u00e9ro d\u00e9bordement, cibles \u2265 44 px',
    mob.deb===0&&mob.larg<=392&&mob.mini>=44,JSON.stringify(mob));
  await page.screenshot({path:'img-n04.png'});
  await page.emulateMediaType('print');
  await new Promise(x=>setTimeout(x,500));
  const imp=await page.evaluate(()=>{
    const s=document.querySelector('.ch-som');
    const cb=document.getElementById('ch-som-oui');
    const st=s?getComputedStyle(s):null;
    return {present:!!s,coupe:st?/avoid/.test(st.breakInside+st.pageBreakInside):false,
      caseMasquee:cb?getComputedStyle(cb).display==='none':null,
      deb:[...document.querySelectorAll('.ch-som *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>400;}).length};});
  verdict('IMPRESSION : le sommaire n\u2019est pas coup\u00e9, la case est masqu\u00e9e, rien ne d\u00e9borde',
    imp.present&&imp.coupe&&imp.caseMasquee===true&&imp.deb===0,JSON.stringify(imp));
  await page.screenshot({path:'img-n05.png'});
  await page.emulateMediaType(null);
  await page.close();
  const hors=ECRITS.filter(e=>!/^\/(site\/3e\/chapitres|corbeille|site\/atelier|manifestes|presence)/.test(e.ch));
  verdict('journal r\u00e9seau : aucune \u00e9criture hors n\u0153uds attendus ('+ECRITS.length+')',hors.length===0,JSON.stringify(hors.map(h=>h.ch).slice(0,4)));
  await br.close();srv.close();
  fs.writeFileSync('bancsc2e-nav-verdicts.json',JSON.stringify(V,null,1));
  fs.writeFileSync('bancsc2e-reseau.json',JSON.stringify({requetes:RESEAU.length,ecritures:ECRITS.map(e=>e.ch)},null,1));
  const ko=V.filter(v=>!v.ok);
  console.log('\u2550\u2550 BANC \u00c9CRAN SITE-COURS-2e : '+(V.length-ko.length)+'/'+V.length+' verts \u2550\u2550');
  process.exit(ko.length?1:0);
})().catch(e=>{console.error('ARR\u00caT:',e);process.exit(2);});

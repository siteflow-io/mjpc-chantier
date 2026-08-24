// BANC LOT C1 — l'heure interrompue et les deux heures. Hub SIMULÉ en mémoire :
// les GET sont servis, les PUT rangés localement (JAMAIS transmis au hub réel) et comptés.
const CIBLE=process.argv[2]||'/home/claude/c1.html';
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
const TR=JSON.parse(fs.readFileSync('/home/claude/trame_demo.json','utf8'));
const STORE={'/classes':{c3a:{nom:'3e Aretha Franklin',niveau:'3e',eleves:['GARCIA Amel','LEMOINE Marc']},
  c4h:{nom:'4e Hugo',niveau:'3e',eleves:['DUPONT Zoe']}},
 '/site/3e/chapitres':{'1':{title:'P',published:true,seances:{'2':{title:'S2',ordre:1,published:true,deroule:{maj:1,ecrans:TR}}}}},
 '/site/4e/chapitres':{},'/site/5e/chapitres':{},'/site/6e/chapitres':{}};
function chemin(u){const m=u.match(/firebasedatabase\.app(\/.*)\.json/);return m?m[1]:null;}
function lit(p){
  for(const k of Object.keys(STORE)){ if(p===k)return STORE[k];
    if(p.startsWith(k+'/')){let n=STORE[k];for(const q of p.slice(k.length+1).split('/'))n=(n||{})[q];return n===undefined?null:n;} }
  let out=null;
  for(const k of Object.keys(STORE)){ if(k.startsWith(p+'/')){ out=out||{};
    const r=k.slice(p.length+1).split('/'); let n=out;
    for(let j=0;j<r.length-1;j++){ if(!n[r[j]])n[r[j]]={}; n=n[r[j]]; }
    n[r[r.length-1]]=STORE[k]; } }
  return out;}
function ecrit(p,v){let root=null;
  for(const k of Object.keys(STORE)){ if(p===k||p.startsWith(k+'/')){ if(!root||k.length>root.length)root=k; } }
  if(!root){root='/'+p.split('/').filter(Boolean)[0]; if(!(root in STORE))STORE[root]={};}
  if(p===root){STORE[root]=v;return;}
  const r=p.slice(root.length+1).split('/').filter(Boolean); let n=STORE[root];
  for(let k=0;k<r.length-1;k++){ if(typeof n[r[k]]!=='object'||!n[r[k]])n[r[k]]={}; n=n[r[k]]; }
  if(v===null)delete n[r[r.length-1]]; else n[r[r.length-1]]=v;}
const R={cible:CIBLE,putSimules:0,nonGETautres:0};
(async()=>{
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:90000,defaultViewport:{width:1500,height:960}});
  const ouvrir=async()=>{
    const page=await browser.newPage();
    const err=[]; page.on('pageerror',e=>err.push(String(e).slice(0,110)));
    page.on('dialog',async d=>{await d.dismiss();});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url(),m=r.method();
      if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
      const p=chemin(u);
      if(p!==null){ if(m==='GET')return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(lit(p))});
        R.putSimules++; let b=null; try{b=r.postData()?JSON.parse(r.postData()):null;}catch(e){}
        ecrit(p,b); return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'null'}); }
      if(m!=='GET')R.nonGETautres++;
      return r.abort();});
    await page.goto('file://'+CIBLE,{waitUntil:'load'}); await new Promise(x=>setTimeout(x,1400));
    // parcours réel, par les gestes du site
    await page.evaluate(()=>{document.body.classList.add('admin-mode');TRACK.eleve={is_prof:true};
      var v=document.getElementById('page-validation'); if(v)v.style.display='none';});
    await page.evaluate(()=>new Promise(res=>{currentLevel='3e';loadPublished('3e');
      loadClasses(function(){atChargerChapitres('3e',function(){
        atelierOuvrir(); atEditerChapitre('3e','1');
        setTimeout(function(){atVuesAller('deroule');
          setTimeout(function(){ATVUES.snum='2';atVuesAller('deroule');setTimeout(res,700);},500);},400);});});}));
    return {page,err,fermer:async()=>{await page.close();}};
  };
  const lancer=async(page,creneau)=>await page.evaluate((cr)=>{
    /* le créneau se choisit AVANT le lancement, par le sélecteur du site : c'est lui
       qui donne debut/fin à AT_DR_COURS, donc la clé de l'heure. */
    const sc=document.getElementById('at-dr-creneau');
    if(sc){ for(let k=0;k<sc.options.length;k++){ if(sc.options[k].value===cr){ sc.selectedIndex=k; break; } } }
    const s=document.getElementById('at-dr-classe'); s.value='c3a';
    window.atT5Veille=function(){};
    atDrMaintenant();
    atDrJouerClic();
    return {classe:AT_DR_COURS&&AT_DR_COURS.classeNom, debut:AT_DR_COURS&&AT_DR_COURS.debut,
      fin:AT_DR_COURS&&AT_DR_COURS.fin, creneauChoisi:sc?sc.value:null,
      cle:(typeof _drCleHeure==='function')?_drCleHeure():'(absente)'};
  },creneau);
  const jouer=async(page)=>{ await page.evaluate(()=>new Promise(res=>{
      atVecuEntrer(0); setTimeout(()=>{ atVecuEntrer(1); setTimeout(()=>{ atVecuEntrer(2);
        AT_T5_CHOIX[3]='maison'; if(typeof atT5Choix==='function'){ try{atT5Choix(4,'reporter');}catch(e){AT_T5_CHOIX[4]='reporter';} }
        setTimeout(res,1500); },1200); },1200); }));
  };
  const traces=()=>{ const out=[];
    ['c3a','c4h'].forEach(function(cl){
      const h=lit('/site/3e/chapitres/1/seances/2/deroule_joue/'+cl+'/heures');
      if(h)Object.keys(h).forEach(k=>out.push({classe:cl,cle:k,creneau:h[k].creneau,min:h[k].minutesJouees,
        act:(h[k].activites||[]).length,dec:Object.keys(h[k].decisions||{}).length,clos:!!h[k].clos,
        decParEcran:Object.keys(h[k].decisionsParEcran||{}).length}));
    });
    return out.length?out:null;};

  // ENCHAÎNEMENT À DEUX MINUTES : 3e jusqu'à 11:02, 4e à 11:04, SANS clore la première.
  let A=await ouvrir();
  R.h1=await A.page.evaluate(()=>{
    const sc=document.getElementById('at-dr-creneau');
    for(let k=0;k<sc.options.length;k++){ if(sc.options[k].value==='10:07-11:02'){ sc.selectedIndex=k; break; } }
    document.getElementById('at-dr-classe').value='c3a';
    window.atT5Veille=function(){}; atDrMaintenant(); atDrJouerClic();
    return {classe:AT_DR_COURS.classeNom, cle:(typeof _drCleHeure==='function')?_drCleHeure():'(absente)'};
  });
  await A.page.evaluate(()=>new Promise(res=>{ atVecuEntrer(0); setTimeout(()=>{ atVecuEntrer(1);
    AT_T5_CHOIX[2]='maison'; setTimeout(res,1300); },1300); }));
  await new Promise(r=>setTimeout(r,1600));
  R.apresH1=traces();
  await A.fermer(); A=await ouvrir();     /* le cas RÉEL : Paul ferme la page entre deux classes */
  R.coursActifAvantH2=lit('/site/cours_actif');
  R.h2=await A.page.evaluate(()=>{
    const sc=document.getElementById('at-dr-creneau');
    for(let k=0;k<sc.options.length;k++){ if(sc.options[k].value==='11:04-11:59'){ sc.selectedIndex=k; break; } }
    document.getElementById('at-dr-classe').value='c4h';
    atDrMaintenant(); atDrJouerClic();
    return {classe:AT_DR_COURS.classeNom, cle:(typeof _drCleHeure==='function')?_drCleHeure():'(absente)'};
  });
  await A.page.evaluate(()=>new Promise(res=>{ atVecuEntrer(4); setTimeout(res,1300); }));
  await new Promise(r=>setTimeout(r,1800));
  R.apresH2=traces();
  R.h1Close=(function(){const t=(traces()||[]).filter(x=>x.classe==='c3a'); return t.length?t[0].clos:null;})();
  R.h2Vierge=(function(){const t=(traces()||[]).filter(x=>x.classe==='c4h');
    return t.length?{cle:t[0].cle,creneau:t[0].creneau,activites:t[0].act,decisions:t[0].dec}:null;})();
  await A.page.screenshot({path:'c2-'+(CIBLE.indexOf('c2')>=0?'apres':'avant')+'-enchainement.png'});
  R.err=A.err.slice(0,4);
  console.log(JSON.stringify(R,null,1));
  await A.fermer(); await browser.close();
})();

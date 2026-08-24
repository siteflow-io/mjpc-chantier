// BANC SESSION — trois pages simultanées : pilote-ordi · téléphone 390×844 · vue-tableau.
// Hub SIMULÉ en mémoire Node (STORE) : GET servis, PUT/DELETE acceptés SAUF depuis la
// vue (comptés + refusés). Latences mesurées en ms réelles.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
const STORE={
 '/classes':{ c3a:{nom:'3e Aretha Franklin',niveau:'3e',eleves:['GARCIA Amel','LEMOINE Marc','DUPONT Zo\u00e9']} },
 '/site/3e/chapitres':{ '1':{title:'Po\u00e9sie',published:true,seances:{'2':{title:'S2 \u2014 R\u00e9citation',ordre:1,published:true,
   deroule:{maj:1,ecrans:JSON.parse(require('fs').readFileSync('/home/claude/trame_demo.json','utf8'))}
 }}}},
 '/site/4e/chapitres':{},'/site/5e/chapitres':{},'/site/6e/chapitres':{},
 '/site/config':{}, '/eleves_index':{}
};
function chemin(u){ const m=u.match(/firebasedatabase\.app(\/.*)\.json/); return m?m[1]:null; }
function lit(p){ // navigation dans STORE par chemin
  const parts=p.split('/').filter(Boolean); let n=STORE['/'+parts[0]];
  if(n===undefined){ // chemins composés stockés à plat
    for(const k of Object.keys(STORE)){ if(p===k)return STORE[k];
      if(p.startsWith(k+'/')){ let nn=STORE[k]; for(const q of p.slice(k.length+1).split('/')){ nn=(nn||{})[q]; } return nn; } }
    return null; }
  for(const q of parts.slice(1)){ n=(n||{})[q]; }
  return n===undefined?null:n;
}
function ecrit(p,val,method){
  if(method==='DELETE'){ val=null; }
  const parts=p.split('/').filter(Boolean);
  // racine connue ou création
  let rootKey='/'+parts[0];
  if(!(rootKey in STORE))STORE[rootKey]={};
  let n=STORE[rootKey];
  if(parts.length===1){ STORE[rootKey]=val; return; }
  for(let k=1;k<parts.length-1;k++){ if(typeof n[parts[k]]!=='object'||n[parts[k]]===null)n[parts[k]]={}; n=n[parts[k]]; }
  if(val===null)delete n[parts[parts.length-1]]; else n[parts[parts.length-1]]=val;
}
async function boot(query,vp,role,compte){
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:90000,defaultViewport:vp});
  const page=await browser.newPage();
  page.on('dialog',async d=>{await d.dismiss();});
  const err=[]; page.on('pageerror',e=>err.push(String(e).slice(0,140)));
  await page.setRequestInterception(true);
  page.on('request',async r=>{
    const u=r.url(),m=r.method();
    if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
    const p=chemin(u);
    if(p!==null){
      if(m==='GET'){ const v=lit(p); return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(v===undefined?null:v)}); }
      if(role==='vue'){ compte.ecritures++; return r.abort(); }
      let body=null; try{ body=r.postData()?JSON.parse(r.postData()):null; }catch(e){}
      ecrit(p,body,m); compte.puts=(compte.puts||0)+1;
      (compte.journal=compte.journal||[]).push({role:role,m:m,p:p,taille:JSON.stringify(body||null).length,
        acts:(function(){ try{ return Array.isArray(body)?body.map(x=>x&&x.act):null; }catch(e){ return null; } })()});
      return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'null'});
    }
    if(m!=='GET'&&role==='vue'){ compte.ecritures++; return r.abort(); }
    return r.abort();   // tout autre réseau (fonts, qrserver…) : coupé
  });
  await page.goto('file:///home/claude/s95.html'+query,{waitUntil:'load',timeout:40000});
  await new Promise(r=>setTimeout(r,1200));
  return {browser,page,err};
}
(async()=>{
  const R={}; const cA={};
  const A=await boot('',{width:1600,height:1000},'pilote',cA);
  await A.page.evaluate(()=>new Promise(res=>{
    currentLevel='3e';TRACK.eleve={is_prof:true,nom:'M',prenom:'P',niveau:'3e'};
    document.body.classList.add('admin-mode');
    loadClasses(function(){ atChargerChapitres('3e',function(){
      atelierOuvrir(); atEditerChapitre('3e','1');
      setTimeout(function(){ atVuesAller('deroule');
        setTimeout(function(){ ATVUES.snum='2'; atVuesAller('deroule'); setTimeout(res,900); },500); },400);
    });});
  }));
  const marqueurs=async()=>await A.page.evaluate(()=>{
    const W=drWin(), D=W.document;
    const vgOn=D.querySelector('.vgw.on'), etIci=D.querySelector('#etat .ici');
    const lab=vgOn?vgOn.querySelector('.lab').textContent:null;
    const num=(D.getElementById('num')||{}).textContent||null;
    return {i:W.i, actCourant:(W.ECRANS[W.i]||{}).act, vignetteOn:lab,
      vignetteIndex:vgOn?vgOn.dataset.ec:null, etatIci:etIci?etIci.textContent.replace(/\d+\/\d+/,'').trim():null,
      contenuActAffiche:(D.getElementById('contenu').innerHTML.match(/data-p="act"[^>]*>([^<]*)</)||[])[1]||null,
      indicateur:num, nbEcrans:W.ECRANS.length};
  });
  R.e0_apresOuverture=await marqueurs();
  // aller à l'écran 7 par la colonne (va)
  await A.page.evaluate(()=>drWin().va(6));
  await new Promise(r=>setTimeout(r,600));
  R.e1_apresVa6=await marqueurs();
  // avancer d'un écran
  await A.page.evaluate(()=>drWin().pas(1));
  await new Promise(r=>setTimeout(r,600));
  R.e2_apresPas1=await marqueurs();
  // INSÉRER un écran AVANT l'écran courant (le geste qui décale les index)
  R.e3_insertion=await A.page.evaluate(()=>{
    const W=drWin();
    const noms=['insere','insereEcran','nouvelEcran','ajouteEcran','ecranNeuf','insEcran'];
    const dispo=noms.filter(n=>typeof W[n]==='function');
    if(!dispo.length)return {fonctionsDispo:Object.keys(W).filter(k=>/^ins|ecran|Ecran/.test(k)).slice(0,12)};
    W[dispo[0]](W.i);
    return {utilisee:dispo[0]};
  });
  await new Promise(r=>setTimeout(r,700));
  R.e4_apresInsertion=await marqueurs();
  // supprimer un écran avant le courant
  R.e5_suppression=await A.page.evaluate(()=>{
    const W=drWin();
    const dispo=['supprEcran','suppEcran','retireEcran','effaceEcran'].filter(n=>typeof W[n]==='function');
    if(!dispo.length)return {aucune:true};
    W[dispo[0]](0); return {utilisee:dispo[0]};
  });
  await new Promise(r=>setTimeout(r,700));
  R.e6_apresSuppression=await marqueurs();
  await A.page.screenshot({path:'rep-E-pilotage.png'});
  R.pageerrors=A.err.slice(0,5);
  console.log(JSON.stringify(R,null,1));
  await A.browser.close();
})();
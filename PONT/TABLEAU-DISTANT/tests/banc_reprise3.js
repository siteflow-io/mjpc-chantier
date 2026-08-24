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
  const R={}; const cA={},cT={},cV={ecritures:0};
  const A=await boot('',{width:1440,height:940},'pilote',cA);
  await A.page.evaluate(()=>new Promise(res=>{
    currentLevel='3e';TRACK.eleve={is_prof:true,nom:'M',prenom:'P',niveau:'3e'};
    document.body.classList.add('admin-mode');
    loadClasses(function(){ atChargerChapitres('3e',function(){
      atelierOuvrir(); atEditerChapitre('3e','1');
      setTimeout(function(){ atVuesAller('deroule');
        setTimeout(function(){ ATVUES.snum='2'; atVuesAller('deroule'); setTimeout(res,700); },500); },400);
    });});
  }));
  // ═══ B1 · l'audit AVANT tout lancement / juste après, SANS RIEN TOUCHER ═══
  await A.page.evaluate(()=>{ var s=document.getElementById('at-dr-classe'); s.value='c3a';
    window.atT5Veille=function(){}; atDrMaintenant(); atDrJouerClic(); });
  await new Promise(r=>setTimeout(r,2500));
  R.b1_auditSansRienToucher=await A.page.evaluate(()=>{
    const m=atDrModifsDeLaSeance();
    return {nb:m.length, detail:JSON.stringify(m).slice(0,700)};
  });
  R.b1_comparaison=await A.page.evaluate(()=>{
    const ec=AT.edChap, sk=ATVUES.snum;
    const sce=chapitresData[ec.level][ec.chnum].seances[sk];
    const prep=(sce.deroule||{}).ecrans||[];
    const vus=DR.dr_exporterTrame()||[];
    return {nbPrep:prep.length, nbVus:vus.length,
      actsPrep:prep.map(e=>e.act).slice(0,4), actsVus:vus.map(e=>e.act).slice(0,4),
      empreintesDivergentes:prep.map((p,n)=>({n:n, act:p.act, egal:_drEmpreinte(p)===_drEmpreinte(vus[n]||{})})).filter(x=>!x.egal)};
  });
  // ═══ B2 · l'audit après un SEUL dévoilement (aucune frappe) ═══
  await A.page.evaluate(()=>{ drWin().devoile(); drWin().devoile(); });
  await new Promise(r=>setTimeout(r,1500));
  R.b2_auditApresDevoilement=await A.page.evaluate(()=>{
    const m=atDrModifsDeLaSeance();
    return {nb:m.length, detail:JSON.stringify(m).slice(0,700)};
  });
  // ═══ B3 · l'audit après un TEL connecté qui ne fait QUE se connecter ═══
  const T=await boot('?vue=tel&qr=nB',{width:390,height:844},'tel',cT);
  await new Promise(r=>setTimeout(r,6000));
  R.b3_auditTelConnecte=await A.page.evaluate(()=>{
    const m=atDrModifsDeLaSeance();
    return {nb:m.length, detail:JSON.stringify(m).slice(0,900)};
  });
  R.b3_journalTel=(cT.journal||[]).map(x=>x.m+' '+x.p+' '+x.taille+'o');
  // ═══ B4 · l'audit après un geste DU TÉLÉPHONE (dévoiler seulement) ═══
  await T.page.evaluate(()=>sesTelGeste('devoile'));
  await new Promise(r=>setTimeout(r,2500));
  R.b4_auditApresGesteTel=await A.page.evaluate(()=>{
    const m=atDrModifsDeLaSeance();
    return {nb:m.length, detail:JSON.stringify(m).slice(0,900)};
  });
  // ═══ C · la vue tableau à la clôture ═══
  const V=await boot('?vue=tableau',{width:1360,height:800},'vue',cV);
  await new Promise(r=>setTimeout(r,5000));
  R.c_vueAvantCloture=await V.page.evaluate(()=>({
    attente:(document.getElementById('ses-tab-att')||{}).style.display,
    contenu:(function(){try{return document.getElementById('ses-tab-toile').contentDocument.getElementById('t').innerHTML.length;}catch(e){return 'EXC';}})(),
    ctx:!!SES.ctx}));
  await A.page.evaluate(()=>{ sesCoursFermer(); });        /* la clôture, côté session */
  R.c_coursActifApres=lit('/site/cours_actif');
  R.c_sceneApres=(function(){const s=lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/scene');return s?{ts:s.ts,ecran:s.ecran}:null;})();
  await new Promise(r=>setTimeout(r,6000));
  R.c_vueApresCloture=await V.page.evaluate(()=>({
    attente:(document.getElementById('ses-tab-att')||{}).style.display,
    perdu:document.getElementById('ses-tab-perdu').className,
    perduTexte:document.getElementById('ses-tab-perdu').textContent,
    contenu:(function(){try{return document.getElementById('ses-tab-toile').contentDocument.getElementById('t').innerHTML.length;}catch(e){return 'EXC';}})(),
    ctxTjs:!!SES.ctx}));
  await V.page.screenshot({path:'rep-vue-apres-cloture.png'});
  R.c_ecrituresVue=cV.ecritures;
  R.pageerrors={pilote:A.err.slice(0,4),tel:T.err.slice(0,4),vue:V.err.slice(0,4)};
  console.log(JSON.stringify(R,null,1));
  await A.browser.close(); await T.browser.close(); await V.browser.close();
})();
// BANC SESSION — trois pages simultanées : pilote-ordi · téléphone 390×844 · vue-tableau.
// Hub SIMULÉ en mémoire Node (STORE) : GET servis, PUT/DELETE acceptés SAUF depuis la
// vue (comptés + refusés). Latences mesurées en ms réelles.
const CIBLE=process.argv[2]||'/home/claude/lotB.html';
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
  await page.goto('file://'+CIBLE+query,{waitUntil:'load',timeout:40000});
  await new Promise(r=>setTimeout(r,1200));
  return {browser,page,err};
}
(async()=>{
  const R={cible:CIBLE}; const cA={},cT={},cV={ecritures:0};
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
  await A.page.evaluate(()=>{ var s=document.getElementById('at-dr-classe'); s.value='c3a';
    window.atT5Veille=function(){}; atDrMaintenant(); atDrJouerClic(); });
  await new Promise(r=>setTimeout(r,2200));
  R.identites=await A.page.evaluate(()=>{ const W=drWin();
    const t=W.ECRANS||[];
    return {ecrans:t.length, avecEid:t.filter(e=>e.eid).length,
      opaques:t.filter(e=>e.eid&&/^e[a-z0-9]+$/.test(e.eid)).length,
      exemple:(t[0]||{}).eid||null, doublons:(function(){const v={},d=[];t.forEach(e=>{if(e.eid){if(v[e.eid])d.push(e.eid);v[e.eid]=1;}});return d;})()};
  });
  // ═══ MODIFICATIONS FANTÔMES : jouer, ZOOMER (donc scinder), clore SANS RIEN MODIFIER ═══
  await A.page.evaluate(()=>{ const W=drWin();
    const et=[]; for(let k=1;k<=24;k++)et.push('Étape '+k+' — une consigne assez longue pour occuper toute la largeur de la ligne.');
    W.ECRANS[0].blocs=[{t:'consigne',pic:'📕',txt:'Consigne longue de banc',etapes:et,vues:24}];
    W.ECRANS[0].rev=3; W.i=0; W.sauve(); W.rendre(); });
  await new Promise(r=>setTimeout(r,1800));
  // on aligne la préparation sur ce contenu : Paul n'a « rien modifié » ensuite
  await A.page.evaluate(()=>{ const W=drWin(), ec=AT.edChap, sce=chapitresData[ec.level][ec.chnum].seances[ATVUES.snum];
    sce.deroule.ecrans=JSON.parse(JSON.stringify(DR.dr_exporterTrame())); });
  R.avantZoomModifs=await A.page.evaluate(()=>atDrModifsDeLaSeance().length);
  const V=await boot('?vue=tableau',{width:1360,height:800},'vue',cV);
  await new Promise(r=>setTimeout(r,4500));
  const T=await boot('?vue=tel&qr=nC2',{width:390,height:844},'tel',cT);
  await new Promise(r=>setTimeout(r,5500));
  const compte=async()=>({
    pilote:await A.page.evaluate(()=>({n:(drWin().ECRANS||[]).length,i:drWin().i,
      eid:(typeof _drEidDuRang==='function')?_drEidDuRang(drWin().i,drWin().ECRANS):null})),
    tel:await T.page.evaluate(()=>({n:(drWin().ECRANS||[]).length,i:drWin().i,
      eid:(typeof _drEidDuRang==='function')?_drEidDuRang(drWin().i,drWin().ECRANS):null})),
    vue:await V.page.evaluate(()=>({n:(drWin().ECRANS||[]).length,i:drWin().i,
      eid:(typeof _drEidDuRang==='function')?_drEidDuRang(drWin().i,drWin().ECRANS):null}))});
  R.avantZoom=await compte();
  await A.page.evaluate(()=>{ const W=drWin(); const rz=W.document.getElementById('rz'); rz.value=rz.max||'64'; W.zoom(); });
  await new Promise(r=>setTimeout(r,3000));
  R.apresZoom=await compte();
  R.memeEcran = !!(R.apresZoom.pilote.eid && R.apresZoom.pilote.eid===R.apresZoom.tel.eid && R.apresZoom.pilote.eid===R.apresZoom.vue.eid);
  R.scissionOpere = R.apresZoom.pilote.n>R.avantZoom.pilote.n;
  R.filsSansIdentite=await A.page.evaluate(()=>{ const t=drWin().ECRANS||[];
    return {fils:t.filter(e=>e.suite).length, filsAvecEid:t.filter(e=>e.suite&&e.eid).length}; });
  await A.page.evaluate(()=>{ const W=drWin(); const rz=W.document.getElementById('rz'); rz.value=rz.min||'16'; W.zoom(); });
  await new Promise(r=>setTimeout(r,2500));
  R.apresDezoom=await compte();
  // ═══ LA VRAIE CAUSE DES FANTÔMES : un écran INSÉRÉ pendant le cours fait glisser
  //     tous les rangs suivants. Paul n'a modifié aucun des écrans qui suivent.
  await A.page.evaluate(()=>{ const W=drWin(); W.i=1; W.nouvelEcran();
    W.ECRANS[W.i].act='Appoint improvisé'; W.sauve(); W.rendre(); });
  await new Promise(r=>setTimeout(r,1800));
  R.fantomes=await A.page.evaluate(()=>{ const m=atDrModifsDeLaSeance();
    return {nb:m.length, neufs:m.filter(x=>x.neuf).length,
      titresTouches:m.filter(x=>!x.neuf).map(x=>x.activite).slice(0,6)}; });
  // la clôture : y a-t-il une modification fantôme ?
  R.modifsApresZoom=await A.page.evaluate(()=>{ const m=atDrModifsDeLaSeance();
    return {nb:m.length, detail:JSON.stringify(m).slice(0,220)}; });
  await A.page.screenshot({path:'c2-'+(CIBLE.indexOf('c2')>=0?'apres':'avant')+'-cloture.png'});
  R.ecritsVue=cV.ecritures;
  R.err={pilote:A.err.slice(0,3),tel:T.err.slice(0,3),vue:V.err.slice(0,3)};
  console.log(JSON.stringify(R,null,1));
  await A.browser.close(); await T.browser.close(); await V.browser.close();
})();
// BANC SESSION — trois pages simultanées : pilote-ordi · téléphone 390×844 · vue-tableau.
// Hub SIMULÉ en mémoire Node (STORE) : GET servis, PUT/DELETE acceptés SAUF depuis la
// vue (comptés + refusés). Latences mesurées en ms réelles.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
const STORE={
 '/classes':{ c3a:{nom:'3e Aretha Franklin',niveau:'3e',eleves:['GARCIA Amel','LEMOINE Marc','DUPONT Zo\u00e9']} },
 '/site/3e/chapitres':{ '1':{title:'Po\u00e9sie',published:true,seances:{'2':{title:'S2 \u2014 R\u00e9citation',ordre:1,published:true,
   deroule:{maj:1,ecrans:(function(){var t=JSON.parse(require('fs').readFileSync('/home/claude/trame_demo.json','utf8'));
     var out=[];for(var k=0;k<15;k++){var e=JSON.parse(JSON.stringify(t[k%t.length]));e.act='S0-écran '+k;out.push(e);}return out;})()}
 },
 '4':{title:'S4 — Atelier',ordre:2,published:true,
   deroule:{maj:1,ecrans:(function(){var t=JSON.parse(require('fs').readFileSync('/home/claude/trame_demo.json','utf8'));
     var out=[];for(var k=0;k<13;k++){var e=JSON.parse(JSON.stringify(t[k%t.length]));e.act='S4-écran '+k;out.push(e);}return out;})()}
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
  const A=await boot('',{width:1440,height:940},'pilote',cA);
  const etat=async(t)=>({etape:t, ...await A.page.evaluate(()=>{ const W=drWin();
    return {nbEcransMoteur:(W&&W.ECRANS||[]).length, act0:(W&&W.ECRANS&&W.ECRANS[0]||{}).act,
      jeton:(window.DR||{}).__charge||null, regime:AT_DR_REGIME,
      indicateur:(function(){try{return drWin().document.body.innerHTML.match(/écran\s*\d+\s*\/\s*\d+/)[0];}catch(e){return null;}})()}; })});
  await A.page.evaluate(()=>new Promise(res=>{
    currentLevel='3e';TRACK.eleve={is_prof:true};document.body.classList.add('admin-mode');
    loadClasses(function(){ atChargerChapitres('3e',function(){
      atelierOuvrir(); atEditerChapitre('3e','1');
      setTimeout(function(){ ATVUES.snum='2'; atVuesAller('deroule'); setTimeout(res,900); },400); });});
  }));
  await A.page.evaluate(()=>{ var s=document.getElementById('at-dr-classe'); s.value='c3a';
    window.atT5Veille=function(){}; atDrMaintenant(); atDrJouerClic(); });
  await new Promise(r=>setTimeout(r,2200));
  R.a_lancee=await etat('S2 lancée (15 écrans)');
  // la trame change AILLEURS (autre appareil / éditeur) : 15 → 13 au hub ET en mémoire
  await A.page.evaluate(()=>{
    const sce=chapitresData['3e']['1'].seances['2'];
    sce.deroule_joue['c3a'].ecrans=sce.deroule_joue['c3a'].ecrans.slice(0,13)
      .map(function(e,n){ e=JSON.parse(JSON.stringify(e)); e.act='NEUF-'+n; return e; });
  });
  // le professeur revient sur l'onglet Déroulé : MÊME jeton
  await A.page.evaluate(()=>{ atVuesAller('structure'); });
  await new Promise(r=>setTimeout(r,900));
  await A.page.evaluate(()=>{ atVuesAller('deroule'); });
  await new Promise(r=>setTimeout(r,1800));
  R.b_retourMemeJeton=await etat('retour Déroulé, même jeton, trame changée');
  R.b_verite=await A.page.evaluate(()=>({
    nbEnMemoire:chapitresData['3e']['1'].seances['2'].deroule_joue['c3a'].ecrans.length,
    act0EnMemoire:chapitresData['3e']['1'].seances['2'].deroule_joue['c3a'].ecrans[0].act}));
  // et si le jeton change (autre séance puis retour) ?
  await A.page.evaluate(()=>{ ATVUES.snum='4'; atVuesAller('deroule'); });
  await new Promise(r=>setTimeout(r,1500));
  await A.page.evaluate(()=>{ ATVUES.snum='2'; atVuesAller('deroule'); });
  await new Promise(r=>setTimeout(r,1800));
  R.c_apresChangementDeJeton=await etat('aller-retour S4 → S2');
  R.pageerrors=A.err.slice(0,3);
  console.log(JSON.stringify(R,null,1));
  await A.browser.close();
})();
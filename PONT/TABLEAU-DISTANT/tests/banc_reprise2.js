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
  const R={}; const cA={},cT={};
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
  R.trameJouee=await A.page.evaluate(()=>({n:drWin().ECRANS.length, acts:drWin().ECRANS.map(e=>e.act).slice(0,4)}));
  R.actsHubApresLancement=(function(){const e=lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/ecrans');return e?e.map(x=>x&&x.act):null;})();

  // ═══ T1 · TEL sur trame RICHE, gestes nus (exception non avalée) ═══
  const T=await boot('?vue=tel&qr=n1',{width:390,height:844},'tel',cT);
  await new Promise(r=>setTimeout(r,6000));
  R.t1_montage=await T.page.evaluate(()=>{
    const W=drWin(); if(!W)return{W:false};
    let dom='';try{dom=W.document.getElementById('contenu').innerHTML;}catch(e){dom='EXC';}
    return {i:W.i,nbEcrans:(W.ECRANS||[]).length,act0:(W.ECRANS[0]||{}).act,
      domActAffiche:(dom.match(/data-p="act"[^>]*>([^<]*)</)||[])[1]||null,
      domLongueur:dom.length, cartes:document.querySelectorAll('.ses-carte').length,
      titre:document.getElementById('ses-tel-titre').textContent};
  });
  R.t1_gestes=await T.page.evaluate(()=>{
    const W=drWin(); const out={};
    const essai=(n,f)=>{ const av=JSON.stringify([W.i,(W.ECRANS[W.i]||{}).rev]); 
      try{ f(); out[n]='OK '+av+'→'+JSON.stringify([W.i,(W.ECRANS[W.i]||{}).rev]); }
      catch(e){ out[n]='EXC '+String(e.message).slice(0,90); } };
    essai('devoile',()=>W.devoile()); essai('devoile2',()=>W.devoile());
    essai('pas+1',()=>W.pas(1)); essai('replie',()=>W.replie());
    essai('gel',()=>W.gel()); essai('chrono',()=>W.chrono()); essai('stylo',()=>W.stylo());
    return out;
  });
  R.t1_actsApres=await T.page.evaluate(()=>drWin().ECRANS.map(e=>e.act));
  R.t1_actsPilote=await A.page.evaluate(()=>drWin().ECRANS.map(e=>e.act));
  // clics réels sur écran à question (aller à l'écran 3 « Interro de cours »)
  await T.page.evaluate(()=>{ const W=drWin(); W.i=3; W.ECRANS[3].rev=W.ECRANS[3].blocs.length+1; W.ECRANS[3].blocs.forEach(b=>b.vues=99); W.rendre(); sesTelPeindre(); });
  await new Promise(r=>setTimeout(r,600));
  R.t1_ecranQuestion=await T.page.evaluate(()=>({cartes:document.querySelectorAll('.ses-carte').length,
    champsReponse:document.querySelectorAll('[data-ses-r]').length, act:drWin().ECRANS[3].act}));
  const champ=await T.page.$('[data-ses-r]');
  if(champ){ await champ.click(); await T.page.keyboard.type('Réponse tapée au doigt'); await T.page.evaluate(()=>document.activeElement.blur());
    await new Promise(r=>setTimeout(r,1500));
    R.t1_saisie={ trameTel:await T.page.evaluate(()=>{const W=drWin();const b=W.ECRANS[3].blocs.find(x=>x.t==='question');return b&&JSON.stringify(b.reps).slice(0,200);}),
      trameHub:(function(){const e=lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/ecrans');const b=e&&e[3]&&e[3].blocs.find(x=>x&&x.t==='question');return b&&JSON.stringify(b.reps).slice(0,200);})(),
      trameP:await A.page.evaluate(()=>{const W=drWin();const b=W.ECRANS[3]&&W.ECRANS[3].blocs.find(x=>x.t==='question');return b&&JSON.stringify(b.reps).slice(0,200);})};
  } else R.t1_saisie={champTrouve:false};
  await T.page.screenshot({path:'rep-t1-tel.png'});
  await T.browser.close();

  // ═══ T2 · TEL monté SANS scène au hub (le GET scene revient null) ═══
  ecrit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/scene',null,'DELETE');
  const T2=await boot('?vue=tel&qr=n2',{width:390,height:844},'tel',{});
  await new Promise(r=>setTimeout(r,6000));
  R.t2_sansScene=await T2.page.evaluate(()=>{
    const W=drWin(); let dom='';try{dom=W.document.getElementById('contenu').innerHTML;}catch(e){}
    return {i:W.i, act0:(W.ECRANS[0]||{}).act, nb:(W.ECRANS||[]).length,
      domActAffiche:(dom.match(/data-p="act"[^>]*>([^<]*)</)||[])[1]||null,
      cartes:document.querySelectorAll('.ses-carte').length};
  });
  R.t2_apresDevoile=await T2.page.evaluate(()=>{ const W=drWin();
    let exc=null; try{ W.devoile(); }catch(e){ exc=e.message.slice(0,90); }
    return {exc:exc, i:W.i, rev:(W.ECRANS[W.i]||{}).rev, acts:W.ECRANS.map(e=>e.act).slice(0,4)}; });
  R.t2_ecransHubApres=(function(){const e=lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/ecrans');return e?e.map(x=>x&&x.act).slice(0,4):null;})();
  await T2.page.screenshot({path:'rep-t2-tel.png'});
  R.journalTel=(cT.journal||[]).map(x=>x.m+' '+x.p+' '+x.taille+'o'+(x.acts?' acts='+JSON.stringify(x.acts.slice(0,3)):''));
  R.pageerrors={pilote:A.err.slice(0,4),tel2:T2.err.slice(0,4)};
  console.log(JSON.stringify(R,null,1));
  await A.browser.close(); await T2.browser.close();
})();
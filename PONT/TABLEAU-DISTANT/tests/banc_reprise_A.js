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
        setTimeout(function(){ ATVUES.snum='2'; atVuesAller('deroule'); setTimeout(res,800); },500); },400);
    });});
  }));
  await A.page.evaluate(()=>{ var s=document.getElementById('at-dr-classe'); s.value='c3a';
    window.atT5Veille=function(){}; atDrMaintenant(); atDrJouerClic(); });
  await new Promise(r=>setTimeout(r,2200));
  const T=await boot('?vue=tel&qr=nA',{width:390,height:844},'tel',cT);
  await new Promise(r=>setTimeout(r,6000));
  // ═══ A4 · le chrono : le compte tourne-t-il, et le TEL le montre-t-il ? ═══
  R.a4_chrono=await T.page.evaluate(()=>new Promise(res=>{
    const W=drWin(), D=W.document;
    const lire=()=>({t:W.t, bchr:(D.getElementById('bchr')||{}).textContent,
      bmonOn:D.getElementById('bmon').classList.contains('on'),
      afficheMoteur:(D.getElementById('cmin')||{}).value+':'+(D.getElementById('csec')||{}).value,
      afficheTel:document.getElementById('ses-tel-chr').textContent});
    const avant=lire();
    sesTelGeste('chrono');
    setTimeout(()=>{ const pendant=lire();
      sesTelGeste('chrono');
      res({avant, pendant, apresArret:lire()}); },2500);
  }));
  // ═══ A1/A2 · la classe .ses-saisie colle-t-elle ? quels boutons disparaissent ? ═══
  R.a12_saisieMasque=await T.page.evaluate(()=>{
    const z=document.getElementById('ses-tel');
    const visibles=()=>[].slice.call(document.querySelectorAll('#ses-tel-pal button'))
      .map(b=>({t:(b.textContent||'').replace(/\s+/g,' ').trim().slice(0,14), vu:b.offsetParent!==null}));
    const avant=visibles();
    z.classList.add('ses-saisie');
    const pendant=visibles();
    z.classList.remove('ses-saisie');
    return {avant:avant.filter(x=>x.vu).length, pendantVisibles:pendant.filter(x=>x.vu).map(x=>x.t),
      pendantMasques:pendant.filter(x=>!x.vu).map(x=>x.t)};
  });
  // ═══ A3 · saisie dans une réponse VIDE + propagation ═══
  await T.page.evaluate(()=>{ const W=drWin(); W.i=3; const e=W.ECRANS[3];
    e.rev=e.blocs.length+1; e.blocs.forEach(b=>{b.vues=99;}); W.rendre(); sesTelPeindre(); });
  await new Promise(r=>setTimeout(r,800));
  R.a3_champs=await T.page.evaluate(()=>{
    const q=drWin().ECRANS[3].blocs.find(b=>b.t==='question');
    return {reps:q?q.reps.length:0, champsR:document.querySelectorAll('[data-ses-r]').length,
      vides:[].slice.call(document.querySelectorAll('.ses-rep-vide')).length,
      sentinelle:!!document.querySelector('.ses-rep-invite'),
      repsAvant:q?JSON.stringify(q.reps.map(r=>[r.i,(r.r||'').slice(0,18)])):null};
  });
  // frapper dans le DERNIER champ (le vide s'il existe)
  const champs=await T.page.$$('[data-ses-r]');
  if(champs.length){
    await champs[champs.length-1].click();
    await T.page.keyboard.type('MARC dit oui');
    await T.page.evaluate(()=>document.activeElement.blur());
    const t0=Date.now(); let latP=null;
    for(let k=0;k<25;k++){ await new Promise(r=>setTimeout(r,300));
      const ok=await A.page.evaluate(()=>{const b=drWin().ECRANS[3].blocs.find(x=>x.t==='question');
        return b?/MARC dit oui/.test(JSON.stringify(b.reps)):false;});
      if(ok){latP=Date.now()-t0;break;} }
    R.a3_saisie={latencePiloteMs:latP,
      repsApresTel:await T.page.evaluate(()=>{const b=drWin().ECRANS[3].blocs.find(x=>x.t==='question');
        return JSON.stringify(b.reps.map(r=>[r.i,(r.r||'').slice(0,26)]));}),
      classeSaisieRestee:await T.page.evaluate(()=>document.getElementById('ses-tel').classList.contains('ses-saisie'))};
  }
  // ═══ A6 · la liste de participation à 3 puis à 30 élèves ═══
  R.a6=await T.page.evaluate(()=>{
    const W=drWin();
    const noms={}; for(let k=0;k<30;k++){ noms['E'+k]='Prénom'+k; }
    W.PRENOMS=noms; W.ELEVES=Object.keys(noms);
    sesTelPart();
    const l=document.querySelector('.ses-part-liste'), n=document.querySelectorAll('.ses-part-nom');
    const r=n[0]?n[0].getBoundingClientRect():null;
    const out={noms:n.length, colonnes:l?getComputedStyle(l).gridTemplateColumns:null,
      hauteurCarte:r?Math.round(r.height):null, hauteurTotale:l?Math.round(l.scrollHeight):null,
      ecran:window.innerHeight, defilements:l?+(l.scrollHeight/window.innerHeight).toFixed(1):null};
    return out;
  });
  await T.page.screenshot({path:'rep-A-part30.png'});
  await T.page.evaluate(()=>{const p=document.getElementById('ses-part');if(p)p.remove();});
  await T.page.screenshot({path:'rep-A-tel-question.png'});
  R.pageerrors={pilote:A.err.slice(0,3),tel:T.err.slice(0,3)};
  console.log(JSON.stringify(R,null,1));
  await A.browser.close(); await T.browser.close();
})();
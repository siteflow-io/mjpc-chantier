// BANC SESSION — trois pages simultanées : pilote-ordi · téléphone 390×844 · vue-tableau.
// Hub SIMULÉ en mémoire Node (STORE) : GET servis, PUT/DELETE acceptés SAUF depuis la
// vue (comptés + refusés). Latences mesurées en ms réelles.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
const STORE={
 '/classes':{ c3a:{nom:'3e Aretha Franklin',niveau:'3e',eleves:['GARCIA Amel','LEMOINE Marc','DUPONT Zo\u00e9']} },
 '/site/3e/chapitres':{ '1':{title:'Po\u00e9sie',published:true,seances:{'2':{title:'S2 \u2014 R\u00e9citation',ordre:1,published:true,
   deroule:{maj:1,ecrans:[
     {act:'\u00c0 une passante \u2014 dire de m\u00e9moire',h:'10:07',dur:10,blocs:[
       {t:'consigne',pic:'\ud83d\udcdd',txt:'Chaque \u00e9l\u00e8ve dit le sonnet de m\u00e9moire.',etapes:[]},
       {t:'question',q:'Question 1 \u2014 Quel effet produit l\u2019enjambement ?',vues:1,reps:[{i:'AG',r:'\u00c7a met en valeur la fugitive.'},{i:'',r:''}]}]},
     {act:'Passages 1 \u00e0 8',h:'10:17',dur:15,blocs:[{t:'consigne',pic:'\ud83c\udfb2',txt:'Ordre tir\u00e9 au sort.',etapes:[]}]}
   ]}}}}},
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
  const R={}; const cptVue={ecritures:0}, cptA={}, cptTel={};
  // ═══ 1. LE PILOTE-ORDI lance le cours (flux réel) ═══
  const A=await boot('',{width:1440,height:940},'pilote',cptA);
  await A.page.evaluate(()=>new Promise(res=>{
    currentLevel='3e';TRACK.eleve={is_prof:true,nom:'M',prenom:'P',niveau:'3e'};
    document.body.classList.add('admin-mode');
    loadClasses(function(){ atChargerChapitres('3e',function(){
      atelierOuvrir(); atEditerChapitre('3e','1');
      setTimeout(function(){ atVuesAller('deroule');
        setTimeout(function(){ ATVUES.snum='2'; atVuesAller('deroule');
          setTimeout(res,700); },500); },400);
    });});
  }));
  R.lance=await A.page.evaluate(()=>new Promise(res=>{
    var s=document.getElementById('at-dr-classe');
    if(!s)return res({selecteur:false});
    s.value='c3a';
    var d=document.getElementById('at-dr-debut'); if(d)d.value='10:07';
    atDrJouerClic();
    setTimeout(function(){ res({selecteur:true, regime:AT_DR_REGIME, sesActif:SES.actif,
      cours:AT_DR_COURS&&AT_DR_COURS.classeNom, bandeau:!!document.getElementById('ses-etat'),
      btnQR:!!document.querySelector('.ses-qr-btn')}); },1600);
  }));
  // ═══ 2. LA VUE TABLEAU se branche ═══
  const V=await boot('?vue=tableau',{width:1360,height:800},'vue',cptVue);
  await new Promise(r=>setTimeout(r,4500));
  R.vue=await V.page.evaluate(()=>({
    monte:!!document.getElementById('ses-tab'),
    attenteMasquee:(document.getElementById('ses-tab-att')||{}).style.display==='none',
    toile:!!document.getElementById('ses-tab-toile').contentDocument.getElementById('t')
  }));
  // ═══ 3. LE TÉLÉPHONE rejoint par QR ═══
  const T=await boot('?vue=tel&qr=nonce123',{width:390,height:844},'tel',cptTel);
  await new Promise(r=>setTimeout(r,5200));
  R.tel=await T.page.evaluate(()=>({
    titre:document.getElementById('ses-tel-titre').textContent,
    prompteur:!!document.querySelector('.ses-carte'),
    cartes:document.querySelectorAll('.ses-carte').length,
    suivant:document.getElementById('ses-tel-suiv').textContent
  }));
  R.qrHandshake=lit('/qrScans/nonce123')!==null&&lit('/qrScans/nonce123')!==undefined;
  // ═══ 4. dévoilement au pilote → vue + tel (< 2 s) ═══
  const t0=Date.now();
  await A.page.evaluate(()=>{ var W=drWin(); W.devoile(); W.devoile(); W.devoile(); });
  let latV=null,latT=null;
  for(let k=0;k<30;k++){
    await new Promise(r=>setTimeout(r,200));
    if(latV===null){ const ok=await V.page.evaluate(()=>{ try{ var D=document.getElementById('ses-tab-toile').contentDocument;
        return /sonnet de m\u00e9moire/.test(D.getElementById('t').innerHTML); }catch(e){return false;} });
      if(ok)latV=Date.now()-t0; }
    if(latT===null){ const ok2=await T.page.evaluate(()=>{ var W=drWin(); return W&&W.ECRANS[0]&&(W.ECRANS[0].rev|0)>=2; });
      if(ok2)latT=Date.now()-t0; }
    if(latV!==null&&latT!==null)break;
  }
  R.devoilement={latenceVueMs:latV,latenceTelMs:latT};
  // ═══ 5. le grisé ABSENT de la vue ═══
  R.griseVue=await V.page.evaluate(()=>{ var D=document.getElementById('ses-tab-toile').contentDocument;
    return {apres:D.querySelectorAll('.apres').length, aecrireGrise:D.getElementById('t').innerHTML.indexOf('apres')>=0}; });
  // ═══ 6. navigation depuis le TEL → pilote + vue suivent ═══
  const t1=Date.now();
  await T.page.evaluate(()=>{ sesTelGeste('suiv'); });
  let latP=null,latV2=null;
  for(let k=0;k<30;k++){
    await new Promise(r=>setTimeout(r,200));
    if(latP===null){ const ok=await A.page.evaluate(()=>{ var W=drWin(); return W&&W.i===1; }); if(ok)latP=Date.now()-t1; }
    if(latV2===null){ const ok2=await V.page.evaluate(()=>{ try{ var D=document.getElementById('ses-tab-toile').contentDocument;
        return !/sonnet de m\u00e9moire/.test(D.getElementById('t').innerHTML); }catch(e){return false;} }); if(ok2)latV2=Date.now()-t1; }
    if(latP!==null&&latV2!==null)break;
  }
  R.navTel={piloteMs:latP,vueMs:latV2};
  // retour écran 1 pour la suite
  await A.page.evaluate(()=>{ var W=drWin(); W.va(0); });
  for(let k=0;k<20;k++){ await new Promise(r=>setTimeout(r,220));
    const telA0=await T.page.evaluate(()=>{ var W=drWin(); return W&&W.i===0; });
    if(telA0)break; }
  // ═══ 7. une réponse tapée AU TEL apparaît au tableau et au pilote ═══
  const t2=Date.now();
  await T.page.evaluate(()=>{
    var W=drWin(); var b=W.ECRANS[0].blocs[1];
    b.reps[1].i='ML'; b.reps[1].r='On dirait que le regard continue comme la phrase.';
    if((b.vues|0)<2)b.vues=2;
    W.sauve(); W.rendre();
  });
  let latRp=null,latRv=null;
  for(let k=0;k<35;k++){
    await new Promise(r=>setTimeout(r,200));
    if(latRp===null){ const ok=await A.page.evaluate(()=>{ var W=drWin(); var b=W.ECRANS[0].blocs[1];
      return b&&b.reps[1]&&/regard continue/.test(b.reps[1].r||''); }); if(ok)latRp=Date.now()-t2; }
    if(latRv===null){ const ok2=await V.page.evaluate(()=>{ try{ var D=document.getElementById('ses-tab-toile').contentDocument;
      return /regard continue/.test(D.getElementById('t').innerHTML); }catch(e){return false;} }); if(ok2)latRv=Date.now()-t2; }
    if(latRp!==null&&latRv!==null)break;
  }
  R.reponseTel={piloteMs:latRp,vueMs:latRv};
  if(latRp===null||latRv===null){
    R.diag7={
      sceneStore:lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/scene'),
      ecransStoreRep:(function(){var e=lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/ecrans');
        return e&&e[0]&&e[0].blocs&&e[0].blocs[1]&&e[0].blocs[1].reps;})(),
      tel:await T.page.evaluate(()=>{var W=drWin();return {i:W&&W.i,ts:SES.ts,trameMaj:SES.trameMaj,actif:SES.actif,applique:SES.applique,rep:W&&W.ECRANS[0].blocs[1].reps[1]};}),
      pilote:await A.page.evaluate(()=>{var W=drWin();return {i:W&&W.i,ts:SES.ts,trameMaj:SES.trameMaj,rep:W&&W.ECRANS[0].blocs[1].reps[1]};}),
      vue:await V.page.evaluate(()=>({tabTs:SES._tabTs,tabTrame:SES._tabTrame}))
    };
  }
  // ═══ 8. LE GEL : la vue fige, les pilotes naviguent ═══
  await A.page.evaluate(()=>{ var W=drWin(); W.gel(); });
  await new Promise(r=>setTimeout(r,2000));
  const photoAvant=await V.page.evaluate(()=>document.getElementById('ses-tab-toile').contentDocument.getElementById('t').innerHTML.length);
  await A.page.evaluate(()=>{ var W=drWin(); W.pas(1); W.devoile(); });
  await new Promise(r=>setTimeout(r,2600));
  const photoPendant=await V.page.evaluate(()=>document.getElementById('ses-tab-toile').contentDocument.getElementById('t').innerHTML.length);
  const piloteLibre=await A.page.evaluate(()=>{ var W=drWin(); return W.i===1; });
  await A.page.evaluate(()=>{ var W=drWin(); W.gel(); });   // dégel
  let rattrape=false;
  for(let k=0;k<20;k++){ await new Promise(r=>setTimeout(r,220));
    rattrape=await V.page.evaluate(()=>{ try{ var D=document.getElementById('ses-tab-toile').contentDocument;
      return /Ordre tir\u00e9 au sort|Passages/.test(D.getElementById('t').innerHTML); }catch(e){return false;} });
    if(rattrape)break; }
  R.gel={vueFigee:photoAvant===photoPendant, piloteLibre:piloteLibre, vueRattrapeAuDegel:rattrape};
  // ═══ 9. « qui a participé » : prénoms côté vue SEULEMENT si activé ═══
  R.quiAvant=await V.page.evaluate(()=>{ var D=document.getElementById('ses-tab-toile').contentDocument;
    var q=D.getElementById('qui'); return {modaleOuverte:!!(q&&q.classList.contains('on')), prenomPresent:/Amel|Marc|Zo\u00e9/.test((q&&q.innerHTML)||'')}; });
  await T.page.evaluate(()=>{ sesTelPlus1('AG'); });   // +1 depuis le tel
  await new Promise(r=>setTimeout(r,1500));
  await A.page.evaluate(()=>{ var W=drWin(); W.quiParle(); });   // le pilote ACTIVE
  let quiOk=null;
  for(let k=0;k<20;k++){ await new Promise(r=>setTimeout(r,220));
    quiOk=await V.page.evaluate(()=>{ var D=document.getElementById('ses-tab-toile').contentDocument;
      var q=D.getElementById('qui'); return (q&&q.classList.contains('on')&&/Amel/.test(q.innerHTML))?true:null; });
    if(quiOk)break; }
  const partAuPilote=await A.page.evaluate(()=>{ var W=drWin(); return ((W.PARTICIPATION||{}).AG||[]).length; });
  R.qui={avantActivation:R.quiAvant, apresActivation:!!quiOk, plus1DuTelVuAuPilote:partAuPilote>=1};
  if(!quiOk){
    R.diagQui={ sceneQui:(lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/scene')||{}),
      piloteEtat:await A.page.evaluate(()=>{ var W=drWin(); return {quiOn:W.quiOn,eleves:W.ELEVES,prenoms:W.PRENOMS,histGA:(W.histoire('GA')||[]).length,applique:SES.applique,actif:SES.actif}; }),
      vueQuiHTML:await V.page.evaluate(()=>{ var D=document.getElementById('ses-tab-toile').contentDocument; var q=D.getElementById('qui'); return q?{on:q.classList.contains('on'),html:q.innerHTML.slice(0,200)}:null; }) };
  }
  await A.page.evaluate(()=>{ var W=drWin(); W.quiParle(); });   // referme
  // ═══ 10. REPRISE : le pilote fermé-rouvert retrouve l'état ═══
  await new Promise(r=>setTimeout(r,900));   /* la dernière émission part (débounce 250) avant la fermeture */
  const etatRef=await A.page.evaluate(()=>{ var W=drWin(); return {i:W.i,rev:W.ECRANS[W.i].rev|0}; });
  R.sceneAvantClose=lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/scene');
  await A.browser.close();
  const A2=await boot('',{width:1440,height:940},'pilote',{});
  await A2.page.evaluate(()=>{ TRACK.eleve={is_prof:true}; document.body.classList.add('admin-mode'); });
  let bandeauReprise=false;
  for(let k=0;k<10;k++){ await new Promise(r=>setTimeout(r,900));
    bandeauReprise=await A2.page.evaluate(()=>!!document.getElementById('ses-reprise'));
    if(bandeauReprise)break; }
  let repriseEtat=null;
  if(bandeauReprise){
    await A2.page.evaluate(()=>{ sesReprendre(); });
    for(let k=0;k<25;k++){ await new Promise(r=>setTimeout(r,400));
      repriseEtat=await A2.page.evaluate(()=>{ var W=drWin(); return (W&&W.__pontCharge&&typeof W.i==='number')?{i:W.i,rev:(W.ECRANS[W.i]||{}).rev|0,actif:SES.actif}:null; });
      if(repriseEtat&&repriseEtat.actif)break; }
  }
  R.reprise={bandeau:bandeauReprise, etatReference:etatRef, etatRetrouve:repriseEtat,
             sceneApresReprise:lit('/site/3e/chapitres/1/seances/2/deroule_joue/c3a/scene'),
             a2:await A2.page.evaluate(()=>({ts:SES.ts,trameMaj:SES.trameMaj,ctx:!!SES.ctx,actif:SES.actif}))};
  // ═══ 11. les compteurs ═══
  R.ecrituresDepuisLaVue=cptVue.ecritures;
  R.ecrituresVueInterne=await V.page.evaluate(()=>SES.ecrituresBloquees||0);
  R.pageerrors={pilote:A2.err.slice(0,3),vue:V.err.slice(0,3),tel:T.err.slice(0,3)};
  console.log(JSON.stringify(R,null,1));
  await V.browser.close(); await T.browser.close(); await A2.browser.close();
})();

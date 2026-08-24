// BANC TÉLÉPHONE 390×844 — les cinq défauts, avant/après
const CIBLE=process.argv[2]||'/home/claude/lotB.html';
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
const TR=JSON.parse(fs.readFileSync('/home/claude/trame_demo.json','utf8'));
const STORE={'/classes':{c3a:{nom:'3e Aretha Franklin',niveau:'3e',eleves:[]}},
 '/site/3e/chapitres':{'1':{title:'P',published:true,seances:{'2':{title:'S2',ordre:1,published:true,deroule:{maj:1,ecrans:TR}}}}},
 '/site/4e/chapitres':{},'/site/5e/chapitres':{},'/site/6e/chapitres':{}};
for(let k=0;k<30;k++)STORE['/classes'].c3a.eleves.push('NOM'+k+' Prenom'+k);
function chemin(u){const m=u.match(/firebasedatabase\.app(\/.*)\.json/);return m?m[1]:null;}
function lit(p){for(const k of Object.keys(STORE)){if(p===k)return STORE[k];
  if(p.startsWith(k+'/')){let n=STORE[k];for(const q of p.slice(k.length+1).split('/'))n=(n||{})[q];return n===undefined?null:n;}}return null;}
function ecrit(p,v){
  /* la clé racine la PLUS LONGUE qui préfixe le chemin — sinon les écritures se rangent
     ailleurs que là où lit() les cherche (artefact de hub à plat, corrigé ici). */
  let root=null;
  for(const k of Object.keys(STORE)){ if(p===k||p.startsWith(k+'/')){ if(!root||k.length>root.length)root=k; } }
  if(!root){ root='/'+p.split('/').filter(Boolean)[0]; if(!(root in STORE))STORE[root]={}; }
  if(p===root){ STORE[root]=v; return; }
  const reste=p.slice(root.length+1).split('/').filter(Boolean);
  let n=STORE[root];
  for(let k=0;k<reste.length-1;k++){ if(typeof n[reste[k]]!=='object'||!n[reste[k]])n[reste[k]]={}; n=n[reste[k]]; }
  if(v===null)delete n[reste[reste.length-1]]; else n[reste[reste.length-1]]=v;}
(async()=>{
  const R={cible:CIBLE,nonGET:0};
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:90000});
  const boot=async(q,vp)=>{
    const page=await browser.newPage(); await page.setViewport(vp);
    const err=[];page.on('pageerror',e=>err.push(String(e).slice(0,110)));
    page.on('dialog',async d=>{await d.dismiss();});
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url(),m=r.method();
      if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
      const p=chemin(u);
      if(p!==null){ if(m==='GET')return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(lit(p))});
        let b=null;try{b=r.postData()?JSON.parse(r.postData()):null;}catch(e){}
        ecrit(p,b); return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'null'}); }
      if(m!=='GET')R.nonGET++; return r.abort();});
    await page.goto('file://'+CIBLE+q,{waitUntil:'load'}); await new Promise(x=>setTimeout(x,1200));
    return {page,err};
  };
  const A=await boot('',{width:1440,height:940});
  await A.page.evaluate(()=>new Promise(res=>{
    currentLevel='3e';TRACK.eleve={is_prof:true};document.body.classList.add('admin-mode');
    loadClasses(function(){atChargerChapitres('3e',function(){atelierOuvrir();atEditerChapitre('3e','1');
      setTimeout(function(){atVuesAller('deroule');setTimeout(function(){ATVUES.snum='2';atVuesAller('deroule');setTimeout(res,700);},500);},400);});});}));
  await A.page.evaluate(()=>{const s=document.getElementById('at-dr-classe');s.value='c3a';window.atT5Veille=function(){};atDrMaintenant();atDrJouerClic();});
  await new Promise(r=>setTimeout(r,2200));
  const T=await boot('?vue=tel&qr=nT',{width:390,height:844});
  await new Promise(r=>setTimeout(r,6000));
  // aller sur l'écran à question
  for(let k=0;k<20;k++){ await new Promise(r=>setTimeout(r,400));
    const pret=await T.page.evaluate(()=>{const W=drWin();return !!(W&&W.ECRANS&&W.ECRANS.length>3);});
    if(pret)break; }
  R.telPret=await T.page.evaluate(()=>({n:(drWin().ECRANS||[]).length,titre:document.getElementById('ses-tel-titre').textContent}));
  await A.page.evaluate(()=>{const W=drWin();
    W.i=3;const e=W.ECRANS[3];
    const q=e.blocs.find(b=>b.t==='question'); if(q){ q.reps=(q.reps||[]).filter(r=>r.i||r.r); q.reps.push({i:'',r:''}); }
    e.rev=e.blocs.length+1;e.blocs.forEach(b=>b.vues=99);W.sauve();W.rendre();});
  for(let k=0;k<25;k++){ await new Promise(r=>setTimeout(r,400));
    const ok=await T.page.evaluate(()=>!!document.querySelector('.ses-rep-vide')||(drWin()&&drWin().i===3));
    if(ok)break; }
  await T.page.evaluate(()=>{ try{ sesTelPeindre(); }catch(e){} });
  await new Promise(r=>setTimeout(r,500));
  await new Promise(r=>setTimeout(r,700));
  // ═══ A-3 : appui sur la réponse vide → où va le focus ? puis frappe ═══
  R.diagTel=await T.page.evaluate(()=>{const W=drWin();
    return {i:W&&W.i, n:(W&&W.ECRANS||[]).length,
      reps:W&&W.ECRANS[3]?JSON.stringify((W.ECRANS[3].blocs.find(b=>b.t==='question')||{}).reps||[]).slice(0,160):null,
      cartes:document.querySelectorAll('.ses-carte').length,
      vides:document.querySelectorAll('.ses-rep-vide').length,
      champsR:document.querySelectorAll('[data-ses-r]').length,
      html:document.getElementById('ses-tel-pr').textContent.slice(0,80)};});
  const vide=await T.page.$('.ses-rep-vide');
  if(vide){ await vide.click(); await new Promise(r=>setTimeout(r,300));
    R.a3_focus=await T.page.evaluate(()=>{const a=document.activeElement;
      return {surInitiales:!!(a&&a.dataset&&a.dataset.sesI!==undefined),surReponse:!!(a&&a.dataset&&a.dataset.sesR!==undefined)};});
    await T.page.keyboard.type('ZO');
    await T.page.evaluate(()=>document.activeElement.blur());
    await new Promise(r=>setTimeout(r,1400));            /* le repeint recrée les nœuds : on les reprend après */
    const rep=await T.page.$$('.ses-rep-vide [data-ses-r], [data-ses-r]');
    await rep[rep.length-1].click(); await new Promise(r=>setTimeout(r,250));
    await T.page.keyboard.type('Réponse au doigt');
    await T.page.evaluate(()=>document.activeElement.blur());
    await new Promise(r=>setTimeout(r,1400));
    R.a3_resultat=await T.page.evaluate(()=>{const b=drWin().ECRANS[3].blocs.find(x=>x.t==='question');
      return b?JSON.stringify(b.reps.slice(-2)):null;});
  } else R.a3_focus={champVide:false};
  // ═══ A-0 : la classe .ses-saisie a-t-elle collé ? quels boutons restent ? ═══
  await new Promise(r=>setTimeout(r,1200));
  R.a0=await T.page.evaluate(()=>({
    saisieCollee:document.getElementById('ses-tel').classList.contains('ses-saisie'),
    boutonsVisibles:[].slice.call(document.querySelectorAll('#ses-tel-pal button')).filter(b=>b.offsetParent!==null).length,
    boutonsTotal:document.querySelectorAll('#ses-tel-pal button').length}));
  // ═══ A-4 : le chrono ═══
  R.a4=await T.page.evaluate(()=>new Promise(res=>{
    sesTelGeste('chrono');
    setTimeout(()=>{ const W=drWin();
      const pendant={afficheTel:document.getElementById('ses-tel-chr').textContent,
        compteTourne:!!W.run, moteur:W.document.getElementById('cmin').value+':'+W.document.getElementById('csec').value};
      if(typeof sesTelGeste==='function'&&document.getElementById('ses-pb-chrtab'))sesTelGeste('chronoTableau');
      setTimeout(()=>{ res({pendant, apresTableau:{afficheTel:document.getElementById('ses-tel-chr').textContent,
        auTableau:W.document.getElementById('bmon').classList.contains('on')}}); },700);
    },2200);
  }));
  // ═══ A-5 : « à écrire » ═══
  R.a5=await T.page.evaluate(()=>{
    const W=drWin(); const av=JSON.stringify(W.ECRANS[W.i].ecrire||[]);
    if(document.getElementById('ses-pb-ecrire')){ sesTelGeste('marquer'); }
    else if(document.getElementById('ses-pb-stylo')){ sesTelGeste('stylo'); }
    return {bouton:(document.getElementById('ses-pb-ecrire')||document.getElementById('ses-pb-stylo')||{}).textContent,
      ecrireAvant:av, ecrireApres:JSON.stringify(W.ECRANS[W.i].ecrire||[])};
  });
  // ═══ A-6 : la liste ═══
  await T.page.evaluate(()=>{const p=document.getElementById('ses-part');if(p)p.remove();sesTelPart();});
  await new Promise(r=>setTimeout(r,600));
  R.a6=await T.page.evaluate(()=>{
    const l=document.querySelector('.ses-part-liste');
    const n=document.querySelectorAll('.ses-pl,.ses-part-nom');
    const r0=n[0]?n[0].getBoundingClientRect():null;
    return {noms:n.length, hauteurLigne:r0?Math.round(r0.height):null,
      hauteurTotale:l?Math.round(l.scrollHeight):null, ecran:window.innerHeight,
      tientSansDefiler:l?l.scrollHeight<=l.clientHeight+2:null,
      motifsDisponibles:typeof sesPartMotifs==='function'};
  });
  await T.page.screenshot({path:'lotB-tel-'+(CIBLE.indexOf('lotB')>=0?'apres':'avant')+'-part.png'});
  await T.page.evaluate(()=>{const p=document.getElementById('ses-part');if(p)p.remove();});
  await T.page.screenshot({path:'lotB-tel-'+(CIBLE.indexOf('lotB')>=0?'apres':'avant')+'.png'});
  R.err={pilote:A.err.slice(0,3),tel:T.err.slice(0,3)};
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();

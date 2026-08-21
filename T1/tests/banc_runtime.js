// BANC RUNTIME (exigence conscience) :
//  A. Object.keys(window) 8.57.1 SEULE vs livraison → diff exact, nominatif.
//  B. Fuite du BLOC SCELLÉ isolée : +DR exactement.
//  C. CLIC RÉEL (DOM, gestionnaire inline DR.gel) IMMÉDIATEMENT après rendu du Déroulé.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
const CH={ '10': { title:'Poésie et peinture au XIXe', published:true, seances:{
  '1':{title:'S1 — Cours suivi', published:true, ordre:1, items:{'a':{kind:'doc',ref:'d1',title:'Fiche Baudelaire',source:'firebase_app',published:true,ordre:1}}},
  '2':{title:'S2 — L\u2019Albatros', published:true, ordre:2, items:{}},
  '3':{title:'S3 — Grammaire', published:true, ordre:3, items:{}}}}};
async function boot(f){const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1500,height:950}});
  const page=await browser.newPage(); const err=[];
  page.on('pageerror',e=>err.push(String(e).slice(0,160)));
  page.on('dialog',async d=>{await d.dismiss();});
  await page.setRequestInterception(true);
  page.on('request',r=>{const u=r.url(); if(u.startsWith('file://')||u.startsWith('data:'))return r.continue(); r.abort();});
  await page.goto('file:///home/claude/'+f,{waitUntil:'load',timeout:30000}); await new Promise(r=>setTimeout(r,1200));
  return {browser,page,err};}
(async()=>{
  // ── A. les deux trousseaux ──
  const p1=await boot('prod8571.html');
  const keysProd=await p1.page.evaluate(()=>Object.keys(window));
  await p1.browser.close();
  const p2=await boot('t1.html');
  const keysT1=await p2.page.evaluate(()=>Object.keys(window));
  const plus=keysT1.filter(k=>!keysProd.includes(k));
  const moins=keysProd.filter(k=>!keysT1.includes(k));
  // ── C. montage du Déroulé puis CLIC RÉEL immédiat sur #dr-bgel (onclick="DR.gel()") ──
  await p2.page.evaluate((ch)=>{currentLevel='3e';TRACK.eleve={is_prof:true,nom:'T',prenom:'B',niveau:'3e'};
    document.body.classList.add('admin-mode');chapitresData['3e']=ch;atelierOuvrir();atEditerChapitre('3e','10');},CH);
  await new Promise(r=>setTimeout(r,500));
  await p2.page.evaluate(()=>atVuesAller('deroule'));
  // AUCUNE attente : le clic part au premier rendu
  await p2.page.click('#dr-bgel');
  const gelOn=await p2.page.evaluate(()=>document.getElementById('dr-bgel').classList.contains('dr-on'));
  await p2.page.click('#dr-bgel');
  const gelOff=await p2.page.evaluate(()=>!document.getElementById('dr-bgel').classList.contains('dr-on'));
  // clic réel sur la barre d'onglets MJPC aussi (gestionnaire inline atVuesAller)
  await p2.page.click('.at-onglet[data-vue="structure"]');
  const retour=await p2.page.evaluate(()=>!!document.querySelector('.at-edch'));
  console.log(JSON.stringify({
    A_diff:{plus:plus, moins:moins, verdict:(moins.length===0 && plus.includes('DR'))?'+DR present, rien de MJPC perdu':'ANOMALIE'},
    C_clicReel:{gelOn,gelOff,retourStructureParClic:retour},
    pageerrors:p2.err
  },null,1));
  await p2.browser.close();
})();

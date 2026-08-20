// Captures finales : Structure côte à côte + Déroulé + arbre.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
async function boot(f){const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1500,height:950}});
  const page=await browser.newPage(); page.on('dialog',async d=>{await d.dismiss();});
  await page.setRequestInterception(true);
  page.on('request',r=>{const u=r.url(); if(u.startsWith('file://')||u.startsWith('data:'))return r.continue(); r.abort();});
  await page.goto('file:///home/claude/'+f,{waitUntil:'load',timeout:30000}); await new Promise(r=>setTimeout(r,1200)); return {browser,page};}
const CH={ '10': { title:'Poésie et peinture au XIXe', published:true, seances:{
  '1':{title:'S1 — Cours suivi', published:true, ordre:1, items:{
    'a':{kind:'doc',ref:'d1',title:'Fiche Baudelaire',source:'firebase_app',published:true,ordre:1},
    'b':{kind:'atelier',ref:'f1',title:'Feuille — L\u2019Albatros',source:'atelier',published:true,ordre:2}}},
  '2':{title:'S2 — L\u2019Albatros', published:true, ordre:2, items:{'c':{kind:'doc',ref:'d2',title:'Le texte annoté',source:'firebase_app',published:true,ordre:1}}},
  '3':{title:'S3 — Grammaire', published:true, ordre:3, items:{}}}}};
(async()=>{
  for(const [f,tag] of [['prod8571.html','8571'],['t1.html','t1']]){
    const {browser,page}=await boot(f);
    await page.evaluate((ch)=>{currentLevel='3e';TRACK.eleve={is_prof:true,nom:'T',prenom:'B',niveau:'3e'};
      document.body.classList.add('admin-mode');chapitresData['3e']=ch;atelierOuvrir();atEditerChapitre('3e','10');},CH);
    await new Promise(r=>setTimeout(r,800));
    await page.screenshot({path:`t1-structure-${tag}.png`});
    if(tag==='t1'){
      await page.evaluate(()=>atVuesAller('deroule')); await new Promise(r=>setTimeout(r,600));
      await page.screenshot({path:'t1-deroule-rendu.png'});
      await page.evaluate(()=>{DR.gel();}); await new Promise(r=>setTimeout(r,300));
      await page.screenshot({path:'t1-deroule-gel.png'});
      await page.evaluate(()=>{DR.gel();atVuesAller('structure');atArbreDeplier('2');}); await new Promise(r=>setTimeout(r,400));
      await page.screenshot({path:'t1-arbre-s2.png'});
    }
    await browser.close();
  }
  // côte à côte Structure
  console.log('captures faites');
})();

// POINT ⑥ — création de chapitre. Les PUT ne PARTENT PAS : ils sont interceptés et
// une réponse 200 est simulée (le hub n'est jamais touché ; les tentatives sont comptées).
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
(async()=>{
  const R={putSimules:0};
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:90000,defaultViewport:{width:1500,height:980}});
  for(const [nom,fichier] of [['avant','/home/claude/base860.html'],['apres','/home/claude/lotA.html']]){
    const page=await browser.newPage();
    const err=[]; page.on('pageerror',e=>err.push(String(e).slice(0,110)));
    await page.setRequestInterception(true);
    page.on('request',r=>{
      const u=r.url(), m=r.method();
      if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
      if(u.indexOf('mjpc-hub-default-rtdb')>=0){
        if(m==='GET')return r.continue();
        R.putSimules++;    /* jamais transmis au hub */
        return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'{}'});
      }
      return r.abort();
    });
    await page.goto('file://'+fichier,{waitUntil:'load',timeout:40000});
    await new Promise(r=>setTimeout(r,1500));
    await page.evaluate(()=>{ document.body.classList.add('admin-mode');
      TRACK.eleve={is_prof:true}; var v=document.getElementById('page-validation'); if(v)v.style.display='none'; });
    await page.evaluate(()=>new Promise(res=>{ currentLevel='3e'; loadPublished('3e');
      loadClasses(function(){ atChargerChapitres('3e',function(){ res(); }); }); }));
    await page.evaluate(()=>{ atelierOuvrir(); });
    await new Promise(r=>setTimeout(r,700));
    await page.evaluate(()=>{ atOnglet('chapitres'); });
    await new Promise(r=>setTimeout(r,800));
    const avant=await page.evaluate(()=>({cartes:document.querySelectorAll('.at-carte').length,
      nbChapitres:Object.keys(chapitresData['3e']||{}).length}));
    // le geste réel : addChapter → la modale → Valider
    const res=await page.evaluate(()=>new Promise(res=>{
      addChapter('3e');
      setTimeout(()=>{
        const modale=document.getElementById('console-modal');
        const champ=document.getElementById('cm-prompt-input');
        const modaleVisible=modale?getComputedStyle(modale).display!=='none':false;
        if(champ)champ.value='Chapitre de banc — LOT A';
        const boutons=[].slice.call(document.querySelectorAll('#console-modal button'));
        const valider=boutons.filter(b=>/Valider/.test(b.textContent))[0];
        if(valider)valider.click();
        setTimeout(()=>{
          const m2=document.getElementById('console-modal');
          res({modaleAvant:modaleVisible,
            modaleApres:m2?getComputedStyle(m2).display!=='none':false,
            cartes:document.querySelectorAll('.at-carte').length,
            nbChapitres:Object.keys(chapitresData['3e']||{}).length,
            titrePresentDansListe:/Chapitre de banc/.test(document.getElementById('at-zone').textContent),
            info:(document.querySelector('.at-info')||{}).textContent||null});
        },2500);
      },700);
    }));
    R[nom]={avant,...res,pageerrors:err.slice(0,3)};
    await page.screenshot({path:'lotA-chapitre-'+nom+'.png'});
    await page.close();
  }
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();

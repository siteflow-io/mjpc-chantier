// POINT ⑦ — les deux libellés, en régime CLASSE, côté site (capture ciblée)
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
(async()=>{
  const R={nonGET:0};
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:90000,defaultViewport:{width:1500,height:960}});
  for(const [nom,fichier] of [['avant','/home/claude/base860.html'],['apres','/home/claude/lotA.html']]){
    const page=await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url(),m=r.method();
      if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
      if(u.indexOf('mjpc-hub-default-rtdb')>=0&&m==='GET')return r.continue();
      if(m!=='GET')R.nonGET++; return r.abort();});
    await page.goto('file://'+fichier,{waitUntil:'load'});
    await new Promise(r=>setTimeout(r,1400));
    await page.evaluate(()=>{document.body.classList.add('admin-mode');TRACK.eleve={is_prof:true};
      var v=document.getElementById('page-validation'); if(v)v.style.display='none';});
    await page.evaluate(()=>new Promise(res=>{currentLevel='3e';loadPublished('3e');
      loadClasses(function(){atChargerChapitres('3e',function(){res();});});}));
    await page.evaluate(()=>{atelierOuvrir();atEditerChapitre('3e','0');});
    await new Promise(r=>setTimeout(r,1500));
    await page.evaluate(()=>{ATVUES.snum='0';atVuesAller('deroule');});
    await new Promise(r=>setTimeout(r,2500));
    R[nom]=await page.evaluate(()=>new Promise(res=>{
      const sel=document.getElementById('at-dr-classe');
      AT_DR_COURS={debut:'10:07',fin:'11:02',classeSlug:sel.value,classeNom:sel.options[sel.selectedIndex].text};
      AT_DR_REGIME='classe'; window.atT5Veille=function(){};
      _drPoserContexteMoteur();
      setTimeout(()=>{const D=drWin().document;
        res({colonne:(D.querySelector('.vgt')||{}).textContent,
             participation:(D.getElementById('h3part')||{}).textContent});},800);
    }));
    // capture : le cadre en grand, colonne + panneau visibles
    await page.evaluate(()=>{const f=document.getElementById('at-dr-iframe');
      if(f){f.style.position='fixed';f.style.inset='0';f.style.width='100%';f.style.height='100%';f.style.zIndex=99999;f.style.display='block';}});
    await new Promise(r=>setTimeout(r,700));
    await page.screenshot({path:'lotA-libelles-'+nom+'.png'});
    await page.close();
  }
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();

// « envoie() est-il ATTEINT ? » — preuve directe : on compte ses appels réels
// (enveloppe posée AVANT les gestes). Aucun stub de fenêtre : rien à fausser.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
const TRAME=JSON.parse(fs.readFileSync('/home/claude/trame_paul.json','utf8'));
(async()=>{
  const R={ecrituresNonGET:0};
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:60000,defaultViewport:{width:1400,height:900}});
  for(const [nom,fichier] of [['avant','/home/claude/base860.html'],['apres','/home/claude/lotA.html']]){
    const page=await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request',r=>{const u=r.url();if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();if(r.method()!=='GET')R.ecrituresNonGET++;r.abort();});
    await page.goto('file://'+fichier,{waitUntil:'load'});
    await new Promise(r=>setTimeout(r,1100));
    R[nom]=await page.evaluate((TRAME)=>new Promise(res=>{
      _drAssurerCadre();
      _drQuandPret(()=>{
        const W=drWin();
        try{ DR.dr_chargerTrame(JSON.parse(JSON.stringify(TRAME))); }catch(e){}
        let nEnvoie=0, nMajVues=0, nPeintQui=0;
        const vE=W.envoie;   W.envoie  =function(){ nEnvoie++;  return vE.apply(W,arguments); };
        const vM=W.majVues;  W.majVues =function(){ nMajVues++; return vM.apply(W,arguments); };
        const vQ=W.peintQui; W.peintQui=function(){ nPeintQui++;return vQ.apply(W,arguments); };
        let exc=null;
        for(let k=0;k<3;k++){ try{ W.devoile(); }catch(e){ exc=String(e.message).slice(0,90); } }
        res({exceptionDevoile:exc, appelsEnvoie:nEnvoie, appelsMajVues:nMajVues, appelsPeintQui:nPeintQui,
          vignettes:W.document.querySelectorAll('.vgw').length,
          etatLignes:W.document.querySelectorAll('#etat > div').length,
          revAtteint:(W.ECRANS[W.i]||{}).rev});
      });
    }),TRAME);
    await page.close();
  }
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();

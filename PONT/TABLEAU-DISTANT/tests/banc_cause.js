// REPRODUCTION DE LA CAUSE : un bloc consigne SANS `etapes` (état réel du chapitre de Paul)
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
(async()=>{
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:60000,defaultViewport:{width:1400,height:900}});
  const page=await browser.newPage();
  const err=[]; page.on('pageerror',e=>err.push(String(e).slice(0,120)));
  await page.setRequestInterception(true);
  page.on('request',r=>{const u=r.url();if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();r.abort();});
  await page.goto('file:///home/claude/s95.html',{waitUntil:'load'});
  await new Promise(r=>setTimeout(r,1200));
  const R=await page.evaluate(()=>{
    return new Promise(res=>{
      _drAssurerCadre();
      _drQuandPret(()=>{
        const W=drWin();
        // trame SAINE de 3 écrans, puis rendu → tout est peint
        const saine=[0,1,2].map(n=>({act:'Activité '+n,h:'10:0'+n,dur:5,blocs:[{t:'consigne',pic:'📕',txt:'Texte '+n,etapes:[],vues:0}]}));
        W.ECRANS=JSON.parse(JSON.stringify(saine)); W.__pontCharge=true; W.i=0; W.rendre();
        const apresSain={vignettes:W.document.querySelectorAll('.vgw').length,
          vignette0:(W.document.querySelector('.vgw .lab')||{}).textContent,
          etat:(W.document.getElementById('etat')||{}).textContent.slice(0,40),
          contenu:(W.document.getElementById('contenu')||{}).innerHTML.length};
        // la trame RÉELLE de Paul : l'écran 2 porte une consigne SANS `etapes`
        const malade=JSON.parse(JSON.stringify(saine));
        malade[2].act='Les hypothèses de la classe';
        delete malade[2].blocs[0].etapes;                 // exactement ce que porte le hub
        W.ECRANS=malade; W.i=0;
        let exc=null;
        try{ W.rendre(); }catch(e){ exc=String(e.message).slice(0,120); }
        const apresMalade={exception:exc,
          vignettes:W.document.querySelectorAll('.vgw').length,
          vignette0:(W.document.querySelector('.vgw .lab')||{}).textContent,
          etat:(W.document.getElementById('etat')||{}).textContent.slice(0,40),
          contenuAJour:/Texte 0/.test(W.document.getElementById('contenu').innerHTML),
          actsAvantGeste:W.ECRANS.map(e=>e.act)};
        // un geste : lire() s'exécute AVANT le throw et écrit le DOM dans ECRANS[i]
        W.i=2;
        let exc2=null; try{ W.devoile(); }catch(e){ exc2=String(e.message).slice(0,120); }
        const apresGeste={exception:exc2, actsApresGeste:W.ECRANS.map(e=>e.act),
          actEcrase:W.ECRANS[2].act!=='Les hypothèses de la classe'};
        res({apresSain,apresMalade,apresGeste});
      });
    });
  });
  R.pageerrors=err.slice(0,4);
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();

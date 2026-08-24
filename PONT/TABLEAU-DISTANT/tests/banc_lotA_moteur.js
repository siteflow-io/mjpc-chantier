// BANC MOTEUR — la trame RÉELLE de Paul (GET /site/3e/chapitres/0/seances/0/deroule/ecrans),
// avant et après normalisation. Harnais LECTURE SEULE STRICTE : compteur non-GET affiché.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
const TRAME=JSON.parse(fs.readFileSync('/home/claude/trame_paul.json','utf8'));
(async()=>{
  const R={ecritures:0};
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:60000,defaultViewport:{width:1500,height:950}});
  for(const [nom,fichier] of [['avant','/home/claude/base860.html'],['apres','/home/claude/lotA.html']]){
    const page=await browser.newPage();
    const err=[]; page.on('pageerror',e=>err.push(String(e).slice(0,110)));
    await page.setRequestInterception(true);
    page.on('request',r=>{ const u=r.url();
      if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
      if(r.method()!=='GET')R.ecritures++;
      r.abort(); });
    await page.goto('file://'+fichier,{waitUntil:'load'});
    await new Promise(r=>setTimeout(r,1200));
    const m=await page.evaluate((TRAME)=>new Promise(res=>{
      _drAssurerCadre();
      _drQuandPret(()=>{
        const W=drWin();
        let exc=null;
        try{ DR.dr_chargerTrame(JSON.parse(JSON.stringify(TRAME))); }catch(e){ exc=String(e.message).slice(0,110); }
        const D=W.document;
        res({exceptionAuChargement:exc,
          nbEcransMoteur:(W.ECRANS||[]).length,
          badge:(D.body.innerHTML.match(/écran\s*\d+\s*\/\s*\d+/)||[])[0]||null,
          vignettes:D.querySelectorAll('.vgw').length,
          titresVignettes:[].slice.call(D.querySelectorAll('.vgw .lab')).map(x=>x.textContent).slice(0,4),
          etatLignes:D.querySelectorAll('#etat > div').length,
          dureesLignes:D.querySelectorAll('#durees .dur').length,
          contenuAJour:/Titre et objectif/.test(D.getElementById('contenu').innerHTML),
          etapesManquantes:(W.ECRANS||[]).reduce((n,e)=>n+(e.blocs||[]).filter(b=>b.t==='consigne'&&!Array.isArray(b.etapes)).length,0),
          picManquants:(W.ECRANS||[]).reduce((n,e)=>n+(e.blocs||[]).filter(b=>b.t==='consigne'&&typeof b.pic!=='string').length,0),
          imgSansSrc:(W.ECRANS||[]).reduce((n,e)=>n+(e.blocs||[]).filter(b=>b.t==='image'&&typeof b.src!=='string').length,0)});
      });
    }),TRAME);
    // envoie() atteint ? on ouvre le tableau par un stub et on regarde s'il est peint
    const envoie=await page.evaluate(()=>{
      const W=drWin(); let peint=null;
      const faux={closed:false,focus:function(){},innerHeight:800,
        document:{write:function(){},close:function(){},
          getElementById:function(id){ return {classList:{add(){},remove(){},toggle(){},contains(){return false;}},style:{},
            set innerHTML(v){ peint=(v||'').length; }, get innerHTML(){ return ''; }, querySelectorAll:function(){return [];}, appendChild:function(){}}; },
          querySelectorAll:function(){return [];}, body:{appendChild:function(){}}}};
      W.open=function(){ return faux; };
      let exc=null;
      try{ W.tableau(); W.envoie(); }catch(e){ exc=String(e.message).slice(0,90); }
      return {exceptionEnvoie:exc, tableauPeint:peint!==null&&peint>0, octetsPeints:peint};
    });
    R[nom]={...m,...envoie,pageerrors:err.slice(0,3)};
    await page.evaluate(()=>{ const f=document.getElementById('at-dr-iframe'); if(f){f.style.display='block';f.style.position='fixed';f.style.inset='0';f.style.width='100%';f.style.height='100%';f.style.zIndex=99999;} });
    await new Promise(r=>setTimeout(r,600));
    await page.screenshot({path:'lotA-moteur-'+nom+'.png'});
    await page.close();
  }
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();

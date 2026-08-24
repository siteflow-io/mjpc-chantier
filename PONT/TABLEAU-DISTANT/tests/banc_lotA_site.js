// BANC SITE — parcours RÉEL par CLICS, sur le hub RÉEL en LECTURE SEULE STRICTE :
// les GET passent, toute requête non-GET est comptée et bloquée (le compteur doit rester à 0).
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
(async()=>{
  const R={ecrituresNonGET:0, bloquees:[]};
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:90000,defaultViewport:{width:1600,height:1000}});
  const ouvre=async(fichier,tag)=>{
    const page=await browser.newPage();
    const err=[]; page.on('pageerror',e=>err.push(String(e).slice(0,110)));
    page.on('dialog',async d=>{await d.dismiss();});
    await page.setRequestInterception(true);
    page.on('request',r=>{
      const u=r.url(), m=r.method();
      if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
      if(u.indexOf('mjpc-hub-default-rtdb')>=0){
        if(m==='GET')return r.continue();
        R.ecrituresNonGET++; (R.parChemin=R.parChemin||{}); 
        var cle=tag+' '+m+' '+u.replace(/^https:\/\/[^/]+/,'').split('?')[0];
        R.parChemin[cle]=(R.parChemin[cle]||0)+1; return r.abort();
      }
      if(m!=='GET'){R.ecrituresNonGET++;}
      return r.abort();
    });
    await page.goto('file://'+fichier,{waitUntil:'load',timeout:40000});
    await new Promise(r=>setTimeout(r,1500));
    await page.evaluate(()=>{
      document.body.classList.add('admin-mode');
      TRACK.eleve={is_prof:true,nom:'M',prenom:'P',niveau:'3e'};
      var v=document.getElementById('page-validation'); if(v)v.style.display='none';
    });
    return {page,err};
  };
  for(const [nom,fichier] of [['avant','/home/claude/base860.html'],['apres','/home/claude/lotA.html']]){
    const {page,err}=await ouvre(fichier,nom);
    // parcours : niveau 3e, atelier, mes chapitres, éditer le chapitre 0, vue Déroulé
    await page.evaluate(()=>new Promise(res=>{
      currentLevel='3e';
      loadPublished('3e');
      loadClasses(function(){ atChargerChapitres('3e',function(){ res(); }); });
    }));
    await page.evaluate(()=>{ atelierOuvrir(); });
    await new Promise(r=>setTimeout(r,700));
    await page.evaluate(()=>{ atOnglet('chapitres'); });
    await new Promise(r=>setTimeout(r,700));
    const cible=await page.evaluate(()=>{
      const ch=chapitresData['3e']||{};
      const k=Object.keys(ch).sort()[0];
      return {chnum:k, titre:(ch[k]||{}).title, seances:Object.keys((ch[k]||{}).seances||{}).sort()};
    });
    await page.evaluate((k)=>{ atEditerChapitre('3e',k); },cible.chnum);
    await new Promise(r=>setTimeout(r,1400));
    await page.evaluate((s)=>{ ATVUES.snum=s; atVuesAller('deroule'); },cible.seances[0]);
    await new Promise(r=>setTimeout(r,2500));
    // ═══ point ⑤ : le défilement de la colonne au REPEINT ═══
    const scroll=await page.evaluate(()=>new Promise(res=>{
      const som=document.querySelector('#at-arbre .ed2-som')||document.querySelector('.ed2-som');
      if(!som)return res({colonne:false});
      som.scrollTop=900;
      const avant=som.scrollTop, h=som.clientHeight, contenu=som.scrollHeight;
      atEditerChapitreRendre();                       /* le repeint complet */
      setTimeout(()=>{
        const som2=document.querySelector('#at-arbre .ed2-som')||document.querySelector('.ed2-som');
        res({colonne:true, avant:avant, apres:som2?som2.scrollTop:null,
          hauteur:h, contenuAvant:contenu, contenuApres:som2?som2.scrollHeight:null});
      },700);
    }));
    // ═══ points ①/⑦ : la colonne des vignettes et les deux libellés ═══
    const moteur=await page.evaluate(()=>{
      const W=drWin(); if(!W)return {moteur:false};
      const D=W.document;
      return {moteur:true, nbEcrans:(W.ECRANS||[]).length,
        vignettes:D.querySelectorAll('.vgw').length,
        etatLignes:D.querySelectorAll('#etat > div').length,
        libelleColonne:(D.querySelector('.vgt')||{}).textContent,
        libelleParticipation:(D.getElementById('h3part')||{}).textContent,
        badge:(D.body.innerHTML.match(/écran\s*\d+\s*\/\s*\d+/)||[])[0]||null};
    });
    // ═══ point ⑦ en régime CLASSE (le libellé doit nommer la classe) ═══
    const classe=await page.evaluate(()=>new Promise(res=>{
      const sel=document.getElementById('at-dr-classe');
      if(!sel||!sel.options.length)return res({selecteur:false});
      sel.value=sel.options[0].value;
      window.atT5Veille=function(){};
      const nom=sel.options[0].text;
      AT_DR_COURS={debut:'10:07',fin:'11:02',classeSlug:sel.value,classeNom:nom};
      AT_DR_REGIME='classe';
      _drPoserContexteMoteur();
      setTimeout(()=>{ const W=drWin(), D=W.document;
        res({selecteur:true, classeChoisie:nom, metaClasse:W.META&&W.META.classe,
          libelleParticipation:(D.getElementById('h3part')||{}).textContent,
          libelleColonne:(D.querySelector('.vgt')||{}).textContent}); },600);
    }));
    R[nom]={cible, scroll, moteur, classe, pageerrors:err.slice(0,4)};
    // captures
    await page.screenshot({path:'lotA-site-'+nom+'.png'});
    await page.evaluate(()=>{ const f=document.getElementById('at-dr-iframe');
      if(f){f.style.position='fixed';f.style.inset='0';f.style.width='100%';f.style.height='100%';f.style.zIndex=99999;f.style.display='block';} });
    await new Promise(r=>setTimeout(r,600));
    await page.screenshot({path:'lotA-vignettes-'+nom+'.png'});
    await page.close();
  }
  console.log(JSON.stringify({ecrituresNonGET:R.ecrituresNonGET,parChemin:R.parChemin,
    avant:{scroll:R.avant.scroll,moteur:R.avant.moteur,classe:R.avant.classe,err:R.avant.pageerrors},
    apres:{scroll:R.apres.scroll,moteur:R.apres.moteur,classe:R.apres.classe,err:R.apres.pageerrors}},null,1));
  await browser.close();
})();

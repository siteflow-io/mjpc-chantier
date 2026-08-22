const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
(async()=>{
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1440,height:950}});
  const page=await browser.newPage();
  const R={err:[]};
  page.on('pageerror',e=>R.err.push(String(e).slice(0,150)));
  await page.setRequestInterception(true);
  page.on('request',r=>{const u=r.url();if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();r.abort();});
  await page.goto('file:///home/claude/staging.html',{waitUntil:'load'});await new Promise(r=>setTimeout(r,1000));
  await page.evaluate(()=>{
    currentLevel='3e';TRACK.eleve={is_prof:true,nom:'T',prenom:'B',niveau:'3e'};
    document.body.classList.add('admin-mode');
    window._EXPORTS=[];window._downloadBlob=function(t,f){window._EXPORTS.push({f,t});};window.showSaveFilePicker=undefined;
    chapitresData['3e']={'1':{title:'Po\u00e9sie et peinture',published:true,seances:{'2':{title:'L\u2019Albatros',ordre:2,items:{'a':{kind:'atelier',source:'atelier',ref:'feuille_x',title:'Fiche',published:true,ordre:1}}}}}};
    chapitresData['4e']={'1':{title:'La ville',published:true,seances:{'1':{title:'Entrer en ville',ordre:1,items:{'b':{kind:'atelier',source:'atelier',ref:'feuille_x',title:'Fiche',published:true,ordre:1}}}}}};
    AT_CHAP_ETAT['3e']='charge';AT_CHAP_ETAT['4e']='charge';AT_CHAP_ETAT['5e']='erreur';AT_CHAP_ETAT['6e']='charge';chapitresData['6e']={};
    AT.liste={'feuille_x':{titre:'L\u2019Albatros \u2014 lecture',produit:'fiche_seance',
      cases:{titre:true,niveau:true,chapitre:true,seance:true,objectif:true,consigne:true},
      valeurs:{titre:{texte:'L\u2019Albatros \u2014 lecture'},objectif:{texte:'Lire un po\u00e8me'},chapitre:{texte:'Chapitre 9 \u2014 FAUX GRAV\u00c9'},seance:{texte:'S\u00e9ance 9 \u2014 FAUX GRAV\u00c9'}},
      contenu:[{id:'consigne',valeurs:{texte:'Souligne les comparaisons.'},reformulations:{}}],
      rattachement:{niveau:'3e',classe:'3e Aretha Franklin',chapitre:'1',seance:'2'},
      dates:{modifieLe:Date.now()}}};
  });
  R.roundTrip=await page.evaluate(()=>{
    atExporterDoc('feuille_x');
    var o=JSON.parse(window._EXPORTS[window._EXPORTS.length-1].t);
    var errs=atIAValider(o);
    var doc2=atIAAppliquer(atDocNeuf(),o);
    AT.liste['rt']=doc2;atExporterDoc('rt');
    var re=JSON.parse(window._EXPORTS[window._EXPORTS.length-1].t);
    delete AT.liste['rt'];
    return {errs:errs,identique:JSON.stringify(o)===JSON.stringify(re),
            casesExport:Object.keys(o.cases).sort().map(function(k){return k+':'+o.cases[k];}).join(' ')};
  });
  R.entete=await page.evaluate(()=>{
    var d=AT.liste['feuille_x'];
    var vue4=atelierDocumentHTML(d,null,{ctxVue:{niveau:'4e',chapitre:'1',seance:'1',classeNom:''}});
    var nue=atelierDocumentHTML(d,null,{});
    return {chap4e:(vue4.match(/Chapitre 1 — La ville/)||[])[0]||'ABSENT',
            sce4e:(vue4.match(/Séance 1 — Entrer en ville/)||[])[0]||'ABSENT',
            fauxGraveDans4e:/FAUX GRAVÉ/.test(vue4),
            niveau4e:/>\s*4e\s*</.test(vue4),
            nueRepliChap:(nue.match(/Chapitre 1 — Poésie et peinture/)||[])[0]||(nue.match(/FAUX GRAVÉ/)||[])[0]||'?'};
  });
  R.carte=await page.evaluate(()=>atStatutFeuille(AT.liste['feuille_x'],'feuille_x').txt);
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();

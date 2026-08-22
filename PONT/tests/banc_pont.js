// BANC PONT — LECTURE SEULE STRICTE : toute requête non-GET est bloquée ET listée.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
(async()=>{
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1440,height:950}});
  const page=await browser.newPage();
  const R={ecrituresBloquees:[],pageerrors:[],console:[]};
  page.on('pageerror',e=>R.pageerrors.push(String(e).slice(0,180)));
  page.on('console',m=>{const t=m.text();if(t.includes('[atelier]'))R.console.push(t.slice(0,180));});
  await page.setRequestInterception(true);
  page.on('request',r=>{
    const u=r.url(), m=r.method();
    if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
    if(m!=='GET'){R.ecrituresBloquees.push(m+' '+u.slice(0,90));return r.abort();}
    return r.abort();  // GET réseau aussi : banc hors ligne, données injectées
  });
  await page.goto('file:///home/claude/staging.html',{waitUntil:'load',timeout:30000});
  await new Promise(r=>setTimeout(r,1200));
  // ── mise en condition : prof + données injectées (aucun réseau) ──
  await page.evaluate(()=>{
    currentLevel='3e';TRACK.eleve={is_prof:true,nom:'T',prenom:'B',niveau:'3e'};
    document.body.classList.add('admin-mode');
    window._EXPORTS=[];
    window._downloadBlob=function(text,filename){window._EXPORTS.push({filename,text});};
    window.showSaveFilePicker=undefined;
    // deux niveaux chargés, la même feuille déposée en 3e ET en 4e
    chapitresData['3e']={'1':{title:'Po\u00e9sie et peinture',published:true,seances:{'2':{title:'S2 — L\u2019Albatros',ordre:2,items:{'a':{kind:'atelier',source:'atelier',ref:'feuille_x',title:'Fiche Albatros',published:true,ordre:1}}}}}};
    chapitresData['4e']={'1':{title:'La ville',published:true,seances:{'1':{title:'S1 — Entrer en ville',ordre:1,items:{'b':{kind:'atelier',source:'atelier',ref:'feuille_x',title:'Fiche Albatros',published:true,ordre:1}}}}}};
    AT_CHAP_ETAT['3e']='charge';AT_CHAP_ETAT['4e']='charge';AT_CHAP_ETAT['5e']='erreur';AT_CHAP_ETAT['6e']='charge';
    chapitresData['6e']={};
    AT.liste={'feuille_x':{titre:'L\u2019Albatros — lecture',produit:'fiche_seance',
      cases:{titre:true,niveau:true,objectif:true,consigne:true},
      valeurs:{titre:{texte:'L\u2019Albatros — lecture'},objectif:{texte:'Lire un po\u00e8me'}},
      contenu:[{id:'consigne',valeurs:{texte:'Souligne les comparaisons.'},reformulations:{}}],
      rattachement:{niveau:'3e',classe:'3e Aretha Franklin',chapitre:'1',seance:'2'},
      depot:{niveau:'3e',chapitre:'9',seance:'9'},   /* la NOTE MENT exprès : la carte ne doit plus la lire */
      dates:{modifieLe:Date.now()}}};
  });
  // ═══ 1. C — LA CARTE : vérité des dépôts (les DEUX lieux, la note menteuse ignorée) ═══
  R.carte=await page.evaluate(()=>{
    var st=atStatutFeuille(AT.liste['feuille_x'],'feuille_x');
    return st;
  });
  // suppression d'un lieu → l'autre reste
  R.carteApresRetrait=await page.evaluate(()=>{
    delete chapitresData['4e']['1'].seances['1'].items['b'];
    var st=atStatutFeuille(AT.liste['feuille_x'],'feuille_x');
    chapitresData['4e']['1'].seances['1'].items['b']={kind:'atelier',source:'atelier',ref:'feuille_x',title:'Fiche Albatros',published:true,ordre:1};
    return st.txt;
  });
  // ═══ 2. B — EXPORT FEUILLE + ROUND-TRIP ═══
  R.exportFeuille=await page.evaluate(()=>{
    atExporterDoc('feuille_x');
    var e=window._EXPORTS[window._EXPORTS.length-1];
    var o=JSON.parse(e.text);
    var cles=Object.keys(o).sort();
    var interdits=['rattachement','depot','dates','niveau','envoi'].filter(function(k){return o[k]!==undefined;});
    // round-trip : validé puis appliqué sur une feuille neuve, ré-exporté, comparé
    var errs=atIAValider(o);
    var doc2=atIAAppliquer(atDocNeuf(),o);
    AT.liste['feuille_rt']=doc2;
    atExporterDoc('feuille_rt');
    var e2=JSON.parse(window._EXPORTS[window._EXPORTS.length-1].text);
    delete AT.liste['feuille_rt'];
    return {filename:e.filename,cles:cles,interdits:interdits,errsValidation:errs,
            roundTripIdentique:JSON.stringify(o)===JSON.stringify(e2),
            o:o,re:e2};
  });
  // ═══ 3. E — LA GARDE : JSON avec niveau → refus visible + journalisé ═══
  R.garde=await page.evaluate(()=>{
    var errs1=atIAValider({niveau:'3e',cases:{titre:true},titre:'x'});
    var errs2=atIAValider({rattachement:{niveau:'4e'},cases:{titre:true},titre:'x'});
    return {avecNiveau:errs1,avecRattachement:errs2};
  });
  // ═══ 4. D — EN-TÊTE CONTEXTUEL : même feuille vue de 3e puis de 4e → le NIVEAU suit ═══
  R.entete=await page.evaluate(()=>{
    var d=AT.liste['feuille_x'];
    function niveauDans(html){var m=html.match(/data-c="niveau"[^>]*>([^<]*)</);if(m)return m[1];
      var m2=html.match(/Niveau[^<]*<\/b>[^<]*/);return m2?m2[0]:'(zone niveau non trouvée)';}
    var vue3=atelierDocumentHTML(d,null,{ctxVue:{niveau:'3e',chapitre:'1',seance:'2',classeNom:''}});
    var vue4=atelierDocumentHTML(d,null,{ctxVue:{niveau:'4e',chapitre:'1',seance:'1',classeNom:''}});
    var nue=atelierDocumentHTML(d,null,{});
    return {de3e:(vue3.match(/>([^<]*3e[^<]*)</)||[])[1]||'3e absent',
            de4e:(vue4.match(/>([^<]*4e[^<]*)</)||[])[1]||'4e ABSENT — DÉFAUT',
            de4eContient3e:/3e/.test(vue4.replace(/Aretha[^<]*/,'')),
            nueRepli:(nue.match(/>([^<]*3e[^<]*)</)||[])[1]||'repli absent',
            chap4e:(vue4.match(/Chapitre 1 — La ville/)||[])[0]||'(libellé chapitre 4e absent)',
            sce4e:(vue4.match(/Séance 1 — S1 — Entrer en ville/)||[])[0]||'(libellé séance 4e absent)'};
  });
  // ═══ 5. A — EXPORT CHAPITRE ═══
  R.exportChapitre=await page.evaluate(()=>{
    AT.edChap={level:'3e',chnum:'1'};
    atChExporter();
    AT.edChap=null;
    var e=window._EXPORTS[window._EXPORTS.length-1];
    var o=JSON.parse(e.text);
    return {filename:e.filename,niveau:o.niveau,numero:o.numero,
            titre:o.chapitre&&o.chapitre.title,
            seancesCompletes:!!(o.chapitre&&o.chapitre.seances&&o.chapitre.seances['2']&&o.chapitre.seances['2'].items)};
  });
  // ═══ 6. F — IMPRESSION GROUPÉE : sélection, tout cocher, document.title ═══
  R.impression=await page.evaluate(()=>{
    return new Promise(function(res){
      AT.liste['feuille_y']={titre:'Deuxi\u00e8me fiche',produit:'fiche_seance',cases:{titre:true},valeurs:{titre:{texte:'Deuxi\u00e8me fiche'}},contenu:[],dates:{modifieLe:Date.now()}};
      var HTML=null;
      window.open=function(){return {document:{write:function(h){HTML=h;},close:function(){}},focus:function(){},print:function(){}};};
      var avant=document.title;
      atImpToutCocher(true);
      var barre=document.getElementById('at-imp-btn')?document.getElementById('at-imp-btn').textContent:'(barre absente)';
      atImprimerSelection();
      var pendantTot=null;
      setTimeout(function(){pendantTot=document.title;},700);
      setTimeout(function(){
        var apres=document.title;
        // impression UNIQUE : une seule cochée
        atImpToutCocher(false);atImpCocher('feuille_x',true);
        var HTML1=null;
        window.open=function(){return {document:{write:function(h){HTML1=h;},close:function(){}},focus:function(){},print:function(){}};};
        atImprimerSelection();
        setTimeout(function(){
          var pendant1=document.title;
          setTimeout(function(){
            res({barreToutCocher:barre,
                 titreGroupe:(HTML.match(/<title>([^<]*)<\/title>/)||[])[1],
                 deuxFeuillesDansLaLiasse:/Deuxi\u00e8me fiche/.test(HTML)&&/Albatros/.test(HTML),
                 docTitlePendantGroupe:pendantTot,
                 docTitleRestaure:document.title===avant||apres===avant,
                 titreUnique:(HTML1.match(/<title>([^<]*)<\/title>/)||[])[1],
                 docTitlePendantUnique:pendant1});
          },1400);
        },700);
      },2200);
    });
  });
  R.pageerrorsFin=R.pageerrors;
  console.log(JSON.stringify(R,null,1));
  await browser.close();
})();

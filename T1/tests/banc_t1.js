// BANC T1 — écrans RENDUS, preuve de fuite runtime, deux couches, captures.
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core'); const fs=require('fs');
async function boot(fichier){
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1500,height:950}});
  const page=await browser.newPage();
  const journal={erreurs:[],dialogues:[],reseau:[]};
  page.on('pageerror',e=>journal.erreurs.push(String(e).slice(0,200)));
  page.on('dialog',async d=>{journal.dialogues.push(d.type()+': '+d.message());await d.dismiss();});
  await page.setRequestInterception(true);
  page.on('request',r=>{const u=r.url(); if(u.startsWith('file://')||u.startsWith('data:'))return r.continue(); journal.reseau.push(u); r.abort();});
  await page.goto('file:///home/claude/'+fichier,{waitUntil:'load',timeout:30000});
  await new Promise(r=>setTimeout(r,1200));
  return {browser,page,journal};
}
function chapitreDeBanc(){
  return { '10': { title:'Poésie et peinture au XIXe', published:true, seances:{
    '1':{title:'S1 — Cours suivi', published:true, ordre:1, items:{
      'a':{kind:'doc',ref:'d1',title:'Fiche Baudelaire',source:'firebase_app',published:true,ordre:1},
      'b':{kind:'atelier',ref:'f1',title:'Feuille — L\u2019Albatros',source:'atelier',published:true,ordre:2}}},
    '2':{title:'S2 — L\u2019Albatros', published:true, ordre:2, items:{
      'c':{kind:'doc',ref:'d2',title:'Le texte annoté',source:'firebase_app',published:true,ordre:1}}},
    '3':{title:'S3 — Grammaire', published:true, ordre:3, items:{}}
  }}};
}
(async()=>{
  const res={};
  // ═══ 0. RÉFÉRENCE 8.57.1 : globales window + capture Structure (éditeur actuel) ═══
  {
    const {browser,page,journal}=await boot('prod8571.html');
    res.keysProd=await page.evaluate(()=>Object.keys(window).length);
    res.globalesProd=await page.evaluate(()=>Object.keys(window));
    await page.evaluate((ch)=>{
      currentLevel='3e'; TRACK.eleve={is_prof:true,nom:'T',prenom:'B',niveau:'3e'};
      document.body.classList.add('admin-mode');
      chapitresData['3e']=ch;
      atelierOuvrir(); atEditerChapitre('3e','10');
    },chapitreDeBanc());
    await new Promise(r=>setTimeout(r,700));
    await page.screenshot({path:'t1-structure-8571.png'});
    res.prodErr=journal.erreurs; res.prodDial=journal.dialogues;
    await browser.close();
  }
  // ═══ 1. T1 : préambule + preuve de fuite ═══
  const {browser,page,journal}=await boot('t1.html');
  const keysT1=await page.evaluate(()=>Object.keys(window));
  res.fuite={ nouveaux:keysT1.filter(k=>!res.globalesProd.includes(k)) };
  delete res.globalesProd;
  // mise en condition identique
  await page.evaluate((ch)=>{
    currentLevel='3e'; TRACK.eleve={is_prof:true,nom:'T',prenom:'B',niveau:'3e'};
    document.body.classList.add('admin-mode');
    chapitresData['3e']=ch;
    atelierOuvrir(); atEditerChapitre('3e','10');
  },chapitreDeBanc());
  await new Promise(r=>setTimeout(r,700));
  // ═══ 2. STRUCTURE rendue (identique à l'éditeur + emballage) ═══
  res.structure=await page.evaluate(()=>({
    barre:[...document.querySelectorAll('.at-vues-barre .at-onglet')].map(b=>b.dataset.vue),
    arbreSe:[...document.querySelectorAll('.at-arbre-se')].map(e=>e.textContent.trim().slice(0,26)),
    arbreItemsActive:[...document.querySelectorAll('.at-arbre-item')].map(e=>e.textContent.trim().slice(0,30)),
    editeurPresent:!!document.querySelector('.at-edch'),
    nbChampsEditeur:document.querySelectorAll('.at-edch-in,.at-edch-ta').length,
  }));
  await page.screenshot({path:'t1-structure-t1.png'});
  // ═══ 3. DÉPLIAGE : séance 2 se déplie, la 1 se replie ═══
  res.depliage=await page.evaluate(()=>{
    atArbreDeplier('2');
    const o=[...document.querySelectorAll('.at-arbre-se-o')].map(e=>e.textContent.trim());
    return {ouvertes:o, items:[...document.querySelectorAll('.at-arbre-item')].map(e=>e.textContent.trim().slice(0,28))};
  });
  await page.screenshot({path:'t1-arbre-depliage.png'});
  // ═══ 4. DÉROULÉ rendu : bloc scellé, écran projeté, gel, chrono ═══
  res.deroule=await page.evaluate(()=>{
    atVuesAller('deroule');
    const out={};
    out.blocMonte=!!document.querySelector('#at-dr-hote-zone #dr-racine');
    out.ecranVisible=!!document.querySelector('#dr-racine .dr-ecran');
    out.premierEcranTexte=(document.querySelector('#dr-contenu')||{}).textContent?.slice(0,60)||'';
    DR.gel(); out.gelOn=document.getElementById('dr-bgel').classList.contains('dr-on');
    DR.gel(); out.gelOff=!document.getElementById('dr-bgel').classList.contains('dr-on');
    DR.chrono(); out.chronoLance=document.getElementById('dr-bchr').textContent==='Pause';
    DR.chrono();
    return out;
  });
  await new Promise(r=>setTimeout(r,400));
  await page.screenshot({path:'t1-deroule.png'});
  // ═══ 5. ARBRE côté Déroulé + bascule 4 onglets ═══
  res.bascule=await page.evaluate(()=>{
    const out={};
    out.arbreDeroule=[...document.querySelectorAll('.at-arbre-item')].map(e=>e.textContent.trim().slice(0,36));
    atVuesAller('relecture'); out.relecture=(document.querySelector('.at-vues-zone .at-vide')||{}).textContent||'';
    atVuesAller('papier'); out.papier=(document.querySelector('.at-vues-zone .at-vide')||{}).textContent||'';
    atVuesAller('structure'); out.retourStructure=!!document.querySelector('.at-edch');
    out.ongletRetenu=sessionStorage.getItem('atvues');
    return out;
  });
  await page.screenshot({path:'t1-vue-papier-avenir.png'}).catch(()=>{});
  // ═══ 6. DEUX COUCHES : classe A puis B → deux copies ; modif trame n'écrase pas ═══
  res.couches=await page.evaluate(()=>{
    classesData={ 'a3fra':{nom:'3e Aretha Franklin'}, 'b3dyl':{nom:'3e Bob Dylan'} };
    atVuesAller('deroule');
    // trame : 1 écran par défaut ; l'enregistrer en mémoire
    const ec=AT.edChap, sk=ATVUES.snum;
    const tr=atDrTrame(sk); tr.ecrans=DR.dr_exporterTrame();
    const cA=atDrJouer('a3fra','3e Aretha Franklin');
    const cB=atDrJouer('b3dyl','3e Bob Dylan');
    // modif de trame APRÈS
    tr.ecrans[0].act='TRAME MODIFIÉE APRÈS COUP';
    const sce=chapitresData[ec.level][ec.chnum].seances[sk];
    return {
      deuxCopies: !!(sce.deroule_joue['a3fra'] && sce.deroule_joue['b3dyl']),
      copiesDistinctes: sce.deroule_joue['a3fra'].ecrans!==sce.deroule_joue['b3dyl'].ecrans,
      classeRetenueA: sce.deroule_joue['a3fra'].classe,
      horodatee: typeof sce.deroule_joue['a3fra'].demarreLe==='number',
      trameModifiee: tr.ecrans[0].act,
      copieAIntacte: sce.deroule_joue['a3fra'].ecrans[0].act,
      copieBIntacte: sce.deroule_joue['b3dyl'].ecrans[0].act,
    };
  });
  // ═══ 7. CROCHET compétences ═══
  res.crochet=await page.evaluate(()=>{
    atDrCompChange('vers et strophes, la comparaison');
    return {comp:DR.dr_getComp(DR.dr_ecranCourant())};
  });
  // ═══ 8. FUITE FINALE après toutes manips ═══
  const keysFin=await page.evaluate(()=>Object.keys(window));
  res.fuiteFinale=keysFin.filter(k=>!keysT1.includes(k));
  res.pageerrors=journal.erreurs; res.dialogues=journal.dialogues;
  console.log(JSON.stringify(res,null,1));
  await browser.close();
})();

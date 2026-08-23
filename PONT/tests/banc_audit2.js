// BANC AUDIT 8.59.3 — un scénario par lancement (argv[2]) ; harnais LECTURE SEULE
// STRICTE : toute requête non-GET est comptée et bloquée (attendu : 0).
const c=require('@sparticuz/chromium'); const chromium=c.default||c;
const puppeteer=require('puppeteer-core');
const SC=process.argv[2];
(async()=>{
  const browser=await puppeteer.launch({args:[...chromium.args,'--disable-web-security'],executablePath:await chromium.executablePath(),headless:'shell',protocolTimeout:60000,defaultViewport:{width:1360,height:900}});
  const page=await browser.newPage();
  const R={nonGET:0,dialogues:[],pageerrors:[],console:[]};
  page.on('dialog',async d=>{R.dialogues.push(d.message().slice(0,120));await d.dismiss();});
  page.on('pageerror',e=>R.pageerrors.push(String(e).slice(0,150)));
  page.on('console',m=>{const t=m.text();if(t.includes('[liasse]')||t.includes('[atelier]'))R.console.push(t.slice(0,130));});
  const modeHub=(SC==='c')?'muet':(SC==='cbis'?'panne':'ok');
  await page.setRequestInterception(true);
  page.on('request',r=>{
    const u=r.url(),m=r.method();
    if(u.startsWith('file://')||u.startsWith('data:'))return r.continue();
    if(m!=='GET'){R.nonGET++;return r.abort();}
    if(u.includes('/site/atelier/prompts/')){
      if(modeHub==='ok')return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify("PROMPT V3 DU HUB — directives de test.")});
      if(modeHub==='muet')return;             // la requête PEND
      return r.abort();
    }
    return r.abort();
  });
  await page.goto('file:///home/claude/cand8593.html',{waitUntil:'load',timeout:30000});
  await new Promise(r=>setTimeout(r,900));
  await page.evaluate(()=>{
    currentLevel='3e';TRACK.eleve={is_prof:true,nom:'T',prenom:'B',niveau:'3e'};
    document.body.classList.add('admin-mode');
    var z=document.getElementById('at-zone');document.body.appendChild(z);
    z.style.cssText='position:fixed;inset:0;background:#141210;z-index:99999;overflow:auto;padding:16px;display:block';
  });
  let out;
  if(SC==='a'||SC==='b'){
    out=await page.evaluate((sc)=>new Promise(function(res){
      setTimeout(function(){res({TIMEOUT:true});},15000);
      var COPIE=null;
      navigator.clipboard.writeText=function(t){COPIE=t;return Promise.resolve();};
      AT.docId='f1';AT.doc=atDocNeuf();
      AT_IA.produit='fiche_seance';AT_IA.tpl=null;AT_IA.charge=false;AT_IA.chap=null;
      atIAChargerPrompt(function(){
        atIARendre();
        setTimeout(function(){
          var vue=document.getElementById('at-ia-tpl-vue');
          if(sc==='b')vue.value=vue.value+'\nLIGNE AJOUTEE PAR PAUL';
          var champ=vue?vue.value:null;
          atIACopier();
          setTimeout(function(){
            res({champPresent:!!vue,
                 copieIdentiqueAuChamp:COPIE===champ,
                 occurrencesPreambule:(COPIE&&COPIE.match(/TON TRAVAIL ATTERRIT/g)||[]).length,
                 v3ChargeDuHub:COPIE?/PROMPT V3 DU HUB/.test(COPIE):null,
                 finDuCopie:sc==='b'?COPIE.slice(-22):undefined,
                 flash:(document.getElementById('at-ia-copie')||{}).textContent});
          },250);
        },250);
      });
    }),SC);
  }else if(SC==='c'){
    out=await page.evaluate(()=>new Promise(function(res){
      AT.docId='f1';AT.doc=atDocNeuf();
      AT_IA.produit='fiche_seance';AT_IA.tpl=null;AT_IA.charge=false;AT_IA.chap=null;
      var rendu=false;
      atIAChargerPrompt(function(){rendu=true;});
      setTimeout(function(){
        var bloc=atBlocEdition();
        res({chargeAboutiPendantLeMutisme:rendu,
             ecranRenduPendantAttente:!!document.getElementById('at-ia-tpl-vue'),
             blocDitChargement:/se charge depuis le hub/.test(bloc),
             blocSansVieuxTexte:bloc.indexOf('Tu vas m')<0});
      },1800);
    }));
  }else if(SC==='cbis'){
    out=await page.evaluate(()=>new Promise(function(res){
      setTimeout(function(){res({TIMEOUT:true});},12000);
      AT.docId='f1';AT.doc=atDocNeuf();
      AT_IA.produit='fiche_seance';AT_IA.tpl=null;AT_IA.charge=false;AT_IA.chap=null;
      atIAChargerPrompt(function(){
        atIARendre();
        setTimeout(function(){
          var vue=document.getElementById('at-ia-tpl-vue');
          res({ecranRendu:!!vue,seedV3EnRepli:vue?/FEUILLE DE COURS/.test(vue.value):false,
               occurrencesPreambule:vue?(vue.value.match(/TON TRAVAIL ATTERRIT/g)||[]).length:0});
        },250);
      });
    }));
  }else if(SC==='def'){
    out=await page.evaluate(()=>new Promise(function(res){
      setTimeout(function(){res({TIMEOUT:true});},16000);
      M8_TEST=true;   // hub SIMULÉ en mémoire (M8_TEST_STORE) — aucune requête, aucune écriture
      var F={titre:'Fiche VERSION HUB',produit:'fiche_seance',cases:{titre:true},valeurs:{titre:{texte:'Fiche VERSION HUB'}},contenu:[],dates:{modifieLe:2}};
      M8_TEST_STORE[AT_NOEUD+'/f1']=F;
      AT.liste={'f1':{titre:'Fiche ANCIENNE VERSION',cases:{titre:true},valeurs:{titre:{texte:'Fiche ANCIENNE VERSION'}},contenu:[],dates:{modifieLe:1}},
                'f2':{titre:'Fiche FANTOME',cases:{titre:true},valeurs:{titre:{texte:'Fiche FANTOME'}},contenu:[],dates:{modifieLe:1}}};
      AT_IMP_SEL={'f1':true,'f2':true};
      var HTML=null,titrePendant=null;var avant=document.title;
      window.open=function(){return {document:{write:function(h){HTML=h;},close:function(){}},focus:function(){},print:function(){}};};
      atImprimerSelection();
      setTimeout(function(){titrePendant=document.title;},800);
      setTimeout(function(){
        var d={d_liasseComposee:!!HTML,
               d_versionHubPresente:HTML?/VERSION HUB/.test(HTML):null,
               d_ancienneVersionPresente:HTML?/ANCIENNE VERSION/.test(HTML):null,
               d_fantomePresente:HTML?/FANTOME/.test(HTML):null,
               d_titrePendant:titrePendant,d_restaure:document.title===avant};
        M8_TEST=false;    // e. hub injoignable (toutes requêtes abortées par le harnais)
        var HTML2=null;window.open=function(){return {document:{write:function(h){HTML2=h;},close:function(){}},focus:function(){},print:function(){}};};
        var note=document.createElement('div');note.id='at-imp-note';document.body.appendChild(note);
        atImprimerSelection();
        setTimeout(function(){
          d.e_liassePartie=!!HTML2;
          d.e_messageVisible=note.textContent;
          M8_TEST=true;AT_IMP_SEL={'f1':true};   // f. impression unique
          var HTML3=null;window.open=function(){return {document:{write:function(h){HTML3=h;},close:function(){}},focus:function(){},print:function(){}};};
          var avant3=document.title,pendant3=null;
          atImprimerSelection();
          setTimeout(function(){pendant3=document.title;},800);
          setTimeout(function(){
            d.f_titreDuPDF=HTML3?(HTML3.match(/<title>([^<]*)<\/title>/)||[])[1]:null;
            d.f_docTitlePendant=pendant3;
            d.f_restaure=document.title===avant3;
            res(d);
          },2100);
        },700);
      },2200);
    }));
  }
  out.nonGET=R.nonGET;out.pageerrors=R.pageerrors;if(R.console.length)out.console=R.console;
  console.log(JSON.stringify({[SC]:out},null,1));
  await browser.close();
})();

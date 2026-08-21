/* ═══ BANC É2b — les 9 fonctions jamais traversées, exercées une à une ═══ */
const c=require('@sparticuz/chromium');const chromium=c.default||c;
const puppeteer=require('puppeteer-core');const path=require('path');
const OK=[],PB=[],J={err:[]};const t=(n,v)=>(v?OK:PB).push(n);
(async()=>{
 const b=await puppeteer.launch({args:[...chromium.args],executablePath:await chromium.executablePath(),headless:'shell',defaultViewport:{width:1500,height:980}});
 const p=await b.newPage();
 p.on('pageerror',e=>J.err.push(String(e).slice(0,160)));
 p.on('dialog',d=>d.dismiss());
 await p.setRequestInterception(true);
 p.on('request',r=>{const u=r.url();
  if(u.startsWith('file://')||u.startsWith('data:')||u.startsWith('about:'))return r.continue();
  if(u.includes('firebasedatabase.app'))return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'null'});
  r.abort();});
 await p.goto('file://'+path.resolve('livraison-E2.html')+'?n=3e',{waitUntil:'load'});
 await new Promise(r=>setTimeout(r,1300));
 await p.evaluate(()=>{chapitresData['3e']=chapitresData['3e']||{};
  chapitresData['3e']['10']={title:'Poésie',seances:{s1:{title:'S1',ordre:1},s2:{title:'S2',ordre:2},s3:{title:'S3',ordre:3}}};
  classesData=window.classesData||{};classesData['_test_deroule']={niveau:'3e',nom:'3e Banc'};
  window.__poserDecor&&__poserDecor();AT=window.AT||{};AT.flux='chapitre';
  atEditerChapitre('3e','10');
  var n=document.getElementById('at-zone');
  while(n&&n.style){n.style.display='block';n.style.opacity='1';n.style.visibility='visible';n=n.parentElement;}
  atVuesAller('deroule');});
 await p.waitForFunction(()=>window.AT_PONT&&AT_PONT.pret===true,{timeout:20000});
 await new Promise(r=>setTimeout(r,800));
 const frame=async()=>await (await p.$('#at-dr-iframe')).contentFrame();

 /* ① atVuesRappeler — l'onglet retenu se relit */
 const rap=await p.evaluate(()=>{sessionStorage.setItem('atvues','papier');ATVUES.vue='structure';atVuesRappeler();return ATVUES.vue;});
 t('atVuesRappeler: onglet retenu relu ('+rap+')',rap==='papier');
 await p.evaluate(()=>{ATVUES.vue='deroule';atVuesRetenir();});

 /* ② atDrSynchroDebut + ③ atDrMaintenant */
 const syn=await p.evaluate(()=>{document.getElementById('at-dr-creneau').value='13:00-13:55';atDrSynchroDebut();
   return document.getElementById('at-dr-debut').value;});
 const attendu=await p.evaluate(()=>atDebutPropose());
 t('atDrSynchroDebut: début proposé = atDebutPropose ('+syn+') — maintenant si on est dans le créneau (comportement voulu)',syn===attendu);
 const now=await p.evaluate(()=>{atDrMaintenant();var v=document.getElementById('at-dr-debut').value;
   var n=new Date();return {v:v,h:String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')};});
 t('atDrMaintenant: heure système saisie ('+now.v+')',now.v===now.h);

 /* ④ atSomPlier — pliage INDÉPENDANT (S2 s'ouvre, S1 reste ouverte) */
 const pli=await p.evaluate(()=>{atSomPlier('s2');
   return {s1:atSomOuverte('s1'),s2:atSomOuverte('s2'),minisS2:document.querySelectorAll('#at-arbre .ed2-sce[data-seance="s2"] .at-ecr').length};});
 t('atSomPlier: S2 dépliée SANS refermer S1 (s1='+pli.s1+', s2='+pli.s2+')',pli.s1===true&&pli.s2===true);
 const minisTot=await p.evaluate(()=>document.querySelectorAll('#at-arbre .at-ecr').length);
 t('minis des DEUX séances rendues ('+minisTot+' = 6+5) — placement hors du nœud sce: dette n°7 déjà consignée',minisTot===11);

 /* ⑤ atSomAllerEcran — clic miniature : navigation + halo + CHANGEMENT DE SÉANCE */
 const aller=await p.evaluate(async()=>{atSomAllerEcran(2,'s1');
   return {snum:ATVUES.snum};});
 await new Promise(r=>setTimeout(r,300));
 const f1=await frame();
 const ec1=await f1.evaluate(()=>i);
 t('atSomAllerEcran(2,s1): le jeu va à l\'écran 2 (i='+ec1+')',ec1===2);
 await p.evaluate(()=>atSomAllerEcran(0,'s2'));           /* changer de séance par la colonne */
 await new Promise(r=>setTimeout(r,700));
 const f2=await frame();
 const ec2=await f2.evaluate(()=>({i:i,prem:ECRANS[0].act,nb:ECRANS.length}));
 const sn=await p.evaluate(()=>ATVUES.snum);
 t('atSomAllerEcran(0,s2): bascule de séance jouée (snum='+sn+', trame S2: '+ec2.nb+' écrans, «'+ec2.prem+'»)',
   sn==='s2'&&/Albatros|Entrée dans le poème/.test(ec2.prem));

 /* ⑥ atDrCompChange — l'écran déclare ses notions, l'autosave suit */
 const comp=await p.evaluate(async()=>{atDrCompChange('c4-lire-04, c4-oral-02');
   await new Promise(r=>setTimeout(r,1300));
   return {comp:DR.dr_exporterTrame()[DR.dr_ecranCourant()].comp,
           etat:(document.getElementById('at-dr-etat')||{}).textContent||''};});
 t('atDrCompChange: comp=['+comp.comp+'] + autosave («'+comp.etat+'»)',
   comp.comp.length===2&&comp.comp[0]==='c4-lire-04'&&/enregistr/i.test(comp.etat));

 /* ⑦ atT5Choix — un choix se consigne, finit dans le vécu écrit ; ⑧ atDrReprendre */
 await p.evaluate(()=>{document.getElementById('at-dr-classe').value='_test_deroule';atDrJouerClic();});
 await new Promise(r=>setTimeout(r,700));
 await p.evaluate(()=>{var n=new Date();var f=new Date(n.getTime()+3*60000);
   AT_DR_COURS.fin=String(f.getHours()).padStart(2,'0')+':'+String(f.getMinutes()).padStart(2,'0');
   AT_T5_VU=false;atT5Appliquer();});
 await new Promise(r=>setTimeout(r,400));
 const ch=await p.evaluate(()=>{var b=[...document.querySelectorAll('button')].find(x=>/reporter à la prochaine/.test(x.textContent));
   if(b)b.click();return {choix:JSON.stringify(AT_T5_CHOIX)};});
 await new Promise(r=>setTimeout(r,300));
 t('atT5Choix: décision consignée '+ch.choix,/report/.test(ch.choix));
 /* la modale T-5 se re-rend (choix suivant) : la FERMER par son bouton réel, pas par remove */
 await new Promise(r=>setTimeout(r,200));
 await p.evaluate(()=>{var ok=[...document.querySelectorAll('button')].find(x=>/Oui, continuer|Annuler/.test(x.textContent));if(ok)ok.click();});
 await new Promise(r=>setTimeout(r,300));
 await p.evaluate(()=>{AT_T5_VU=true;clearInterval(AT_T5_TIMER);});   /* plus de réouverture pendant la clôture */
 /* modifier puis clore en COCHANT → atDrReprendre écrit la trame */
 const f3=await frame();
 /* geste RÉEL : éditer le champ à l'écran puis lire() — modifier la donnée sous
    l'écran courant serait écrasé par la resynchronisation DOM→données du moteur */
 await f3.evaluate(()=>{var el=document.querySelector('#contenu [data-p="0.txt"]');
   el.innerHTML='Repris dans la préparation (banc).'; lire();});
 await p.evaluate(()=>atDrClore());
 await new Promise(r=>setTimeout(r,500));
 await p.evaluate(()=>{var c=document.querySelector('.at-repr input');if(c)c.checked=true;
   var ok=[...document.querySelectorAll('button')].find(x=>/Oui, continuer/.test(x.textContent));if(ok)ok.click();});
 await new Promise(r=>setTimeout(r,900));
 const rep=await p.evaluate(()=>({
   trame:(chapitresData['3e']['10'].seances.s2.deroule.ecrans[0].blocs[0].txt||''),
   vecu:JSON.stringify((chapitresData['3e']['10'].seances.s2.deroule_joue._test_deroule.vecu||{}).decisions||{}),
   confirme:(document.getElementById('at-dr-etat')||{}).textContent||'',
   bandeau:(document.getElementById('bac-bandeau')||{}).textContent||''}));
 t('atDrReprendre: la trame porte le texte repris («'+rep.trame.slice(0,40)+'…»)',/Repris dans la préparation/.test(rep.trame));
 t('atVecuEcrire: la décision T-5 est DANS le vécu écrit ('+rep.vecu+')',/report/.test(rep.vecu));
 t('atDrEnrConfirme: confirmation datée («'+rep.confirme.slice(0,30)+'»)',/Enregistré à|Trame enregistrée/i.test(rep.confirme));
 t('coiffe: toutes ces écritures bloquées («'+rep.bandeau.slice(12,50)+'»)',/écriture\(s\) bloquée/.test(rep.bandeau));

 console.log(JSON.stringify({VERTS:OK,PROBLEMES:PB,erreursJS:J.err},null,1));
 await b.close();process.exit(PB.length||J.err.length?1:0);
})().catch(e=>{console.error('KO:',e.message);process.exit(2)});

/* ═══════════════════════════════════════════════════════════════════════════
   COUTURES MJPC POUR LE DÉROULÉ — code écrit et ÉPROUVÉ AU BANC par la conscience n°7
   (21/08/2026), extrait du clone avant abandon de la voie « préfixage ».

   CES FONCTIONS SURVIVENT AU PASSAGE AU PONT : elles n'appartiennent pas à la maquette,
   elles sont le CADRE MJPC (onglets, sommaire, régimes, temps, T-5, reprise, vécu).
   Seul le dialogue avec le moteur change : là où l'on appelait DR.x(...) directement,
   il faudra passer par les CINQ MESSAGES du pont.

   POINTS D'ATTENTION HÉRITÉS (chacun corrige une faute réelle) :
   · le routage d'onglet se fait par data-vue, JAMAIS par le libellé (accent de « Déroulé ») ;
   · la colonne gauche est le SOMMAIRE NATIF (ed2Documents+ed2Sommaire), qui porte la
     corrélation à trois colonnes — ne jamais lui substituer un arbre parallèle ;
   · le pliage est INDÉPENDANT par séance (AT_SOM_ETAT), il ne referme pas les autres ;
   · [LOT1-①] un clic déplace le halo, ne reconstruit RIEN (atSomSuivreCourant) ;
   · atDrModifsDeLaSeance compare une EMPREINTE SIGNIFIANTE (titre + textes), jamais le JSON
     brut : les ids, compteurs et horaires recalculés créeraient de faux « changements » ;
   · le T-5 ne vit PAS dans la scène (il l'écrase) : appel discret + modale qui NOMME les notions ;
   · le vécu se mesure à part : h est calculé depuis le PRÉVU et ne dit rien du réel ;
   · le professeur n'est JAMAIS bloqué : on avertit, on lance quand même.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── état ── */
var AT_DR_SUIVI=['où on en est','participation','temps par activité'];
var AT_T5_VU=false;
var AT_DR_ENR_T=null;
var AT_DR_COURS=null;
var AT_SOM_INIT = false;
var AT_SOM_ETAT = {};
var AT_T5_CHOIX={}, AT_T5_TIMER=null;
var AT_EDT=['08:00-08:55','08:57-09:52','10:07-11:02','11:04-11:59','13:00-13:55','13:57-14:52','15:07-16:02','16:04-16:59'];
var AT_DR_REGIME='prep';
var AT_DR_VECU=null;
var ATVUES={vue:'structure', snum:null};

/* ── fonctions ── */

function atVuesRetenir(){ try{ sessionStorage.setItem('atvues', ATVUES.vue); }catch(e){} }


function atVuesRappeler(){ try{ var v=sessionStorage.getItem('atvues'); if(v)ATVUES.vue=v; }catch(e){} }


function atVuesBarreHtml(){
  var defs=[['structure','Structure'],['deroule','D\u00e9roul\u00e9'],['relecture','Relecture'],['papier','Papier']];
  return '<div class="at-vues-barre">'+defs.map(function(d){
    return '<button class="at-onglet'+(ATVUES.vue===d[0]?' at-onglet-actif':'')+'" data-vue="'+d[0]+'" onclick="atVuesAller(this.dataset.vue)">'+d[1]+'</button>';
  }).join('')+'</div>';
}


function atVuesMonter(){
  if(!AT.edChap) return;
  var z=document.getElementById('at-zone'); if(!z) return;
  if(ATVUES.snum===null) ATVUES.snum=atArbrePremiereSeance();
  if(ATVUES.vue==='structure'){
    /* le rendu de l'\u00e9diteur vient d'\u00eatre pos\u00e9 dans at-zone : on l'enveloppe sans le re-rendre */
    if(z.firstChild && z.firstChild.classList && z.firstChild.classList.contains('at-vues-cadre')) return;
    var cadre=document.createElement('div'); cadre.className='at-vues-cadre';
    cadre.innerHTML=atVuesBarreHtml()
      +'<div class="at-vues-corps"><div class="at-vues-zone at-vues-zone-large" id="at-vues-zone"></div></div>';
    var zone=cadre.querySelector('#at-vues-zone');
    while(z.firstChild){ zone.appendChild(z.firstChild); }
    z.appendChild(cadre);
  } else {
    atVuesPoser(ATVUES.vue);
  }
}


function atVuesAller(v){
  ATVUES.vue=v; atVuesRetenir();
  if(v==='structure'){ if(window.DR)DR.dr_fermer(); atEditerChapitreRendre(); return; }
  atVuesPoser(v);
}


function atVuesPoser(v){
  var z=document.getElementById('at-zone'); if(!z) return;
  var h=atVuesBarreHtml()
    +'<div class="at-vues-corps">'+atSommaireNatifHtml()
    +'<div class="at-vues-zone" id="at-vues-zone">';
  if(v==='relecture')h+='<div class="at-vide">Relecture \u2014 \u00e0 venir (le r\u00e9cit horodat\u00e9 arrive au Temps 3).</div>';
  if(v==='papier')h+='<div class="at-vide">Papier \u2014 \u00e0 venir (le chapitre entier avec ses trous d\u00e9clar\u00e9s, au Temps 3).</div>';
  if(v==='deroule')h+='<div class="at-dr-tete" id="at-dr-tete"></div><div id="at-dr-hote-zone"></div><div id="at-dr-t5"></div>';
  h+='</div></div>';
  z.innerHTML='<div class="at-vues-cadre">'+h+'</div>';
  if(v==='deroule') atDrMonter();
}


function atSommaireNatifHtml(){
  var ec=AT.edChap||AT_FIL; if(!ec) return '<div class="at-vues-arbre" id="at-arbre"></div>';
  try{
    var docs=ed2Documents(ec.level,ec.chnum);
    var h=ed2Sommaire(ec.level,ec.chnum,docs);
    if(ATVUES.vue==='deroule') h=atSomInjecterEcrans(h);
    return '<div class="at-vues-arbre" id="at-arbre">'+h+'</div>';
  }catch(e){ return '<div class="at-vues-arbre" id="at-arbre"></div>'; }
}


function atSomEcransDe(seance){
  var ec=AT.edChap||AT_FIL; if(!ec) return [];
  if(window.DR && String(seance)===String(ATVUES.snum)){
    try{ var v=DR.dr_exporterTrame(); if(v&&v.length) return v; }catch(e){}
  }
  try{
    var ch=(chapitresData[ec.level]||{})[ec.chnum]||{};
    var sce=(ch.seances||{})[seance]||{};
    return ((sce.deroule||{}).ecrans)||[];
  }catch(e){ return []; }
}


function atSomEcransHtml(seance){
  var ecr=atSomEcransDe(seance);
  if(!ecr.length) return '';
  var active=(String(seance)===String(ATVUES.snum));
  var cour=-1; if(active){ try{ cour=(DR.dr_ecranCourant&&DR.dr_ecranCourant())||0; }catch(e){ cour=0; } }
  var h='<div class="at-som-ecrans">';
  ecr.forEach(function(e,n){
    var hh=(e&&e.h)||'', act=(e&&(e.act||e.titre))||('Écran '+(n+1));
    h+='<div class="at-ecr'+(n===cour?' at-ecr-sel':'')+'" onclick="atSomAllerEcran('+n+',\''+atEsc(String(seance))+'\')">'
      +'<span class="at-ecr-mini"><i class="at-ecr-t"></i><i></i><i></i><i></i></span>'
      +'<span class="at-ecr-txt">'+(hh?'<span class="at-ecr-h">'+atEsc(hh)+'</span><br>':'')
      +'<span class="at-ecr-n">'+atEsc(act)+'</span></span></div>';
  });
  return h+'</div>';
}


function atSomInjecterEcrans(html){
  var parts=html.split('<div class="ed2-sce');
  if(parts.length<2) return html;
  var out=parts[0];
  for(var k=1;k<parts.length;k++){
    var seg='<div class="ed2-sce'+parts[k];
    var m=seg.match(/data-seance="([^"]*)"/);
    /* une séance repliée ne montre pas ses écrans (comme elle ne montre pas ses documents) */
    var bloc=(m && atSomOuverte(m[1])) ? atSomEcransHtml(m[1]) : '';
    if(bloc){
      var pos=seg.lastIndexOf('<button class="ed2-inserer"');
      if(pos<0) pos=seg.lastIndexOf('</div>');
      seg = (pos<0) ? seg+bloc : seg.slice(0,pos)+bloc+seg.slice(pos);
    }
    out+=seg;
  }
  return out;
}


function atSomAllerEcran(n,seance){
  if(seance!==undefined && String(seance)!==String(ATVUES.snum)){
    ATVUES.snum=String(seance); AT_SOM_ETAT[String(seance)]=true;   /* on change de séance jouée */
    if(ATVUES.vue==='deroule'){ atVuesPoser('deroule'); return; }
  }
  try{ if(window.DR&&DR.va) DR.va(n); }catch(e){}
  /* [LOT1-①] SÉLECTION SEULE — on déplace le halo, on ne reconstruit RIEN :
     la colonne garde sa position, son défilement et l'objet en cours. */
  var col=document.getElementById('at-arbre'); if(!col) return;
  var lst=col.querySelectorAll('.at-ecr');
  for(var k=0;k<lst.length;k++){ lst[k].classList.remove('at-ecr-sel'); }
  if(lst[n]) lst[n].classList.add('at-ecr-sel');
}


function atSomOuverte(seance){
  var k=String(seance);
  if(AT_SOM_ETAT[k]===undefined){
    if(!AT_SOM_INIT){ AT_SOM_ETAT[k]=true; AT_SOM_INIT=true; }   /* la première s'ouvre */
    else AT_SOM_ETAT[k]=false;
  }
  return !!AT_SOM_ETAT[k];
}


function atSomPlier(seance){
  var k=String(seance);
  AT_SOM_ETAT[k]=!atSomOuverte(k);
  atSomRafraichir();
}


function atSomRafraichir(){
  var z=document.getElementById('at-arbre');
  if(z){
    var pos=z.scrollTop;                       /* [LOT1-①] le défilement ne se perd pas */
    z.outerHTML = atSommaireNatifHtml();
    var n=document.getElementById('at-arbre'); if(n) n.scrollTop=pos;
    return;
  }
  if(typeof atEditerChapitreRendre==='function' && (AT.edChap||AT_FIL)) atEditerChapitreRendre();
}


function atSomSuivreCourant(){
  var col=document.getElementById('at-arbre'); if(!col||!window.DR) return;
  var n=0; try{ n=(DR.dr_ecranCourant&&DR.dr_ecranCourant())||0; }catch(e){ return; }
  var lst=col.querySelectorAll('.at-ecr');
  for(var k=0;k<lst.length;k++){ lst[k].classList.toggle('at-ecr-sel', k===n); }
}


function atMn(s){ var p=String(s).split(':'); return (+p[0])*60+(+p[1]); }


function atHhmm(m){ m=((m%1440)+1440)%1440; return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'); }


function atCreneauSel(){ var s=document.getElementById('at-dr-creneau'); return (s&&s.value)||AT_EDT[2]; }


function atDebutPropose(){ var c=atCreneauSel(), d=atMn(c.split('-')[0]), f=atMn(c.split('-')[1]);
  var n=new Date(), m=n.getHours()*60+n.getMinutes(); return atHhmm(m>d&&m<f? m : d); }


function atTempsUtile(){ if(!AT_DR_COURS) return 0; return atMn(AT_DR_COURS.fin)-atMn(AT_DR_COURS.debut)-5; }


function atDrMaintenant(){ var el=document.getElementById('at-dr-debut'); if(!el) return;
  var n=new Date(); el.value=atHhmm(n.getHours()*60+n.getMinutes()); atDrMajUtile(); }


function atDrSynchroDebut(){ var el=document.getElementById('at-dr-debut'); if(el){ el.value=atDebutPropose(); atDrMajUtile(); } }


function atDrMajUtile(){ var el=document.getElementById('at-dr-debut'), u=document.getElementById('at-dr-utile');
  if(!el||!u) return; var c=atCreneauSel(), t=atMn(c.split('-')[1])-atMn(el.value||'00:00')-5;
  u.innerHTML=(t>0)?'<b>'+t+' min utiles</b> <span class="at-dr-lib">(fin '+c.split('-')[1]+' \u2212 5 min d\u2019agenda)</span>'
                   :'<b style="color:#f87171">cr\u00e9neau d\u00e9pass\u00e9</b>'; }


function atDrSuiviAppliquer(){
  var enPrep=(AT_DR_REGIME==='prep');
  /* les commandes de SUIVI n'ont pas de sens en préparation (et cassent si on les clique) :
     « Qui a participé » relève de la séance jouée avec une classe. */
  var bq=document.getElementById('dr-bqui'); if(bq) bq.style.display=enPrep?'none':'';
  var pil=document.querySelector('#dr-racine .dr-pilote'); if(!pil) return;
  var h3s=pil.querySelectorAll('h3');
  for(var k=0;k<h3s.length;k++){
    var t=(h3s[k].textContent||'').toLowerCase();
    var cible=AT_DR_SUIVI.some(function(x){return t.indexOf(x)===0;});
    if(!cible) continue;
    h3s[k].style.display=enPrep?'none':'';
    var n=h3s[k].nextElementSibling;
    while(n && n.tagName!=='H3'){ n.style.display=enPrep?'none':''; n=n.nextElementSibling; }
  }
  var note=pil.querySelector('.at-dr-suivi-note');
  if(enPrep){
    if(!note){ note=document.createElement('p'); note.className='dr-note at-dr-suivi-note';
      note.innerHTML='<b>Pr\u00e9paration.</b> Le suivi (participation, temps, r\u00e9cit) n\u2019existe qu\u2019en classe : lance la s\u00e9ance pour le voir para\u00eetre.';
      pil.insertBefore(note, pil.firstChild); }
    note.style.display='';
  } else if(note){ note.style.display='none'; }
}


function atVecuAfficher(){
  if(AT_DR_REGIME!=='classe'||!AT_DR_VECU) return;
  var z=document.getElementById('dr-durees'); if(!z) return;
  var lignes=z.querySelectorAll('.dr-dur');
  for(var k=0;k<lignes.length;k++){
    var r=atVecuMinutes(k);
    var m=lignes[k].querySelector('.at-vecu');
    if(!r){ if(m) m.remove(); continue; }
    if(!m){ m=document.createElement('span'); m.className='at-vecu'; lignes[k].appendChild(m); }
    var prevu=+(lignes[k].querySelector('input')||{}).value||0;
    m.textContent=' \u00b7 r\u00e9el '+r+' min';
    m.className='at-vecu'+((prevu&&r>prevu)?' at-vecu-plus':'');
  }
}


function atDrClore(){
  if(typeof _modaleConfirme!=='function'){ atDrCloreFin(); return; }
  atDrClotureModale();
}


function atDrCloreFin(){
  try{ atVecuEcrire(); }catch(e){}
  AT_DR_REGIME='prep'; AT_DR_VECU=null; AT_DR_COURS=null; AT_T5_CHOIX={}; atT5Veille(false); atDrMonter();
}


function atT5Reste(){
  if(AT_DR_REGIME!=='classe'||!AT_DR_COURS) return null;
  var n=new Date(), m=n.getHours()*60+n.getMinutes();
  return (atMn(AT_DR_COURS.fin)-5)-m;          /* minutes avant le début de l'agenda */
}


function atT5Etat(){
  var r=atT5Reste(); if(r===null) return null;
  var u=atTempsUtile(), ecoule=u-r;
  if(r<0) return {t:'tu d\u00e9passes', c:'#f87171', r:r};
  if(r<=5) return {t:'les cinq derni\u00e8res minutes', c:'#ffb86c', r:r};
  if(u>0 && ecoule>=u*0.8) return {t:'il te reste peu de temps', c:'#ffb86c', r:r};
  return {t:'dans les temps', c:'#34d399', r:r};
}


function atT5Zone(){
  /* canon §5 : « dans la zone libre SOUS LES COMMANDES de l'écran de pilotage ».
     On la loge à la fin de la colonne centrale du déroulé, pas sous tout le bloc. */
  var z=document.getElementById('at-dr-t5');
  var scene=document.querySelector('#dr-racine .dr-scene');
  if(scene && z && z.parentElement!==scene){ scene.appendChild(z); }
  return z;
}


function atT5Appliquer(){
  /* [C1-CONSCIENCE] le T-5 n'occupe plus la scène (il l'écrasait) : il vit dans le bandeau
     sous forme d'un appel discret, et le détail s'ouvre dans une MODALE. */
  var z=atT5Zone(); if(z) z.innerHTML='';
  var e=atT5Etat(); if(!e) return;
  var appel=document.getElementById('at-dr-t5-appel');
  if(e.r>5){ if(appel) appel.remove(); AT_T5_VU=false; return; }
  atT5Appel(e);
  if(!AT_T5_VU){ AT_T5_VU=true; atT5Modale(); }   /* elle s'ouvre UNE fois, jamais en boucle */
}


function atT5Appel(e){
  var tete=document.getElementById('at-dr-tete'); if(!tete) return;
  var b=document.getElementById('at-dr-t5-appel');
  var reste=atT5Restantes().length;
  var txt=(e.r>=0)
    ? ('\u23f1 fin dans '+e.r+' min'+(reste?(' \u00b7 '+reste+' activit\u00e9'+(reste>1?'s':'')+' non jou\u00e9e'+(reste>1?'s':'')):''))
    : ('\u23f1 cours termin\u00e9 depuis '+Math.abs(e.r)+' min'+(reste?(' \u00b7 '+reste+' non jou\u00e9e'+(reste>1?'s':'')):''));
  if(!b){ b=document.createElement('button'); b.id='at-dr-t5-appel'; b.className='at-btn at-t5-appel';
    b.onclick=function(){ atT5Modale(); }; tete.appendChild(b); }
  b.textContent=txt+' \u2014 d\u00e9cider';
}


function atT5Restantes(){
  var ecr=[]; try{ ecr=window.DR?DR.dr_exporterTrame():[]; }catch(x){ return []; }
  var cour=0; try{ cour=(DR.dr_ecranCourant&&DR.dr_ecranCourant())||0; }catch(x){}
  var out=[];
  for(var n=cour+1;n<ecr.length;n++){ if(!AT_T5_CHOIX[n]) out.push({n:n, e:ecr[n]}); }
  return out;
}


function atT5Modale(){
  if(typeof _modaleConfirme!=='function') return;
  var e=atT5Etat(); if(!e) return;
  var rest=atT5Restantes();
  var fin=AT_DR_COURS?AT_DR_COURS.fin:'';
  var h='<div class="cm-sub">';
  h+= (e.r>=0)
    ? ('Ton cours finit \u00e0 <b>'+fin+'</b>. Les <b>cinq derni\u00e8res minutes</b> servent \u00e0 l\u2019agenda : il te reste <b>'+e.r+' minute'+(e.r>1?'s':'')+'</b> de classe.')
    : ('Ton cours devait finir \u00e0 <b>'+fin+'</b>. Tu es all\u00e9 <b>'+Math.abs(e.r)+' minute'+(Math.abs(e.r)>1?'s':'')+'</b> au-del\u00e0 du temps d\u2019agenda.');
  if(!rest.length){ h+=' Tout est jou\u00e9 : tu peux clore la s\u00e9ance.</div>'; _modaleConfirme('Fin de l\u2019heure', h, function(){}); return; }
  h+=' <b>'+rest.length+' activit\u00e9'+(rest.length>1?'s ne sont':' n\u2019est')+' pas jou\u00e9e'+(rest.length>1?'s':'')+'</b> \u2014 d\u00e9cide de leur sort.</div><div class="at-t5-m">';
  rest.forEach(function(r){
    var ec=r.e||{}, nom=escapeHtml(ec.act||ec.h||('\u00c9cran '+(r.n+1)));
    var extrait=escapeHtml(_drCoupe((ec.blocs||[]).map(_drTexteBloc).filter(Boolean).join(' \u00b7 '),120));
    var comp=(Array.isArray(ec.comp)?ec.comp:[]).filter(Boolean);
    h+='<div class="at-t5-c"><div class="at-t5-t">'+nom+'</div>'
      +(extrait?'<div class="at-t5-x">'+extrait+'</div>':'')
      +(comp.length
        ? '<div class="at-t5-k">Si tu la passes, ces notions ne seront pas travaill\u00e9es aujourd\u2019hui : <b>'+escapeHtml(comp.join(' \u00b7 '))+'</b></div>'
        : '<div class="at-t5-k">Aucune notion d\u00e9clar\u00e9e sur cet \u00e9cran.</div>')
      +'<div class="at-t5-b">'
      +'<button class="at-btn" onclick="atT5Choix('+r.n+',\'report\u00e9e \u00e0 la s\u00e9ance suivante\')">reporter \u00e0 la prochaine s\u00e9ance</button>'
      +'<button class="at-btn" onclick="atT5Choix('+r.n+',\'donn\u00e9e \u00e0 la maison\')">donner \u00e0 la maison</button>'
      +'<button class="at-btn" onclick="atT5Choix('+r.n+',\'annul\u00e9e\')">annuler cette activit\u00e9</button>'
      +'<button class="at-btn" onclick="atT5Choix('+r.n+',\'laiss\u00e9e sans suite\')">ne rien donner</button>'
      +'</div></div>';
  });
  h+='</div>';
  var faits=Object.keys(AT_T5_CHOIX);
  if(faits.length){ h+='<div class="at-t5-f">D\u00e9j\u00e0 d\u00e9cid\u00e9 : '+faits.map(function(k){
    var ecr=[]; try{ ecr=DR.dr_exporterTrame(); }catch(x){}
    return escapeHtml(((ecr[k]||{}).act||('\u00e9cran '+(+k+1)))+' \u2192 '+AT_T5_CHOIX[k]); }).join(' \u00b7 ')+'</div>'; }
  _modaleConfirme('Fin de l\u2019heure \u2014 '+escapeHtml(AT_DR_COURS?AT_DR_COURS.classeNom:''), h, function(){});
}


function atT5Choix(n,quoi){
  AT_T5_CHOIX[n]=quoi;
  var f=document.querySelector('.cm-fond, .cm-modale, #cm-fond'); if(f&&f.remove) f.remove();
  var e=atT5Etat(); if(e) atT5Appel(e);
  setTimeout(atT5Modale,60);
}


function atT5Veille(on){
  clearInterval(AT_T5_TIMER);
  if(on){ atT5Appliquer(); atVecuAfficher(); AT_T5_TIMER=setInterval(function(){ atT5Appliquer(); atVecuAfficher(); }, 20000); }
  else { var z=document.getElementById('at-dr-t5'); if(z) z.innerHTML=''; }
}


function _drTexteBloc(bl){
  if(!bl) return '';
  var t=bl.txt||bl.texte||bl.q||bl.titre||'';
  if(!t && Array.isArray(bl.etapes)) t=bl.etapes.map(function(e){return e&&(e.txt||e.t)||'';}).join(' ');
  return String(t).replace(/<[^>]*>/g,'').trim();
}


function _drEmpreinte(ecran){
  if(!ecran) return '';
  var blocs=(ecran.blocs||[]).map(function(bl){ return (bl&&bl.t||'')+'|'+_drTexteBloc(bl); });
  return (ecran.act||'')+'||'+blocs.join('||');
}


function _drCoupe(t,n){ t=String(t||''); return t.length>n? t.slice(0,n)+'\u2026' : t; }


function atDrModifsDeLaSeance(){
  var ec=AT.edChap, sk=ATVUES.snum; if(!ec||!sk||!AT_DR_COURS) return [];
  var ch=chapitresData[ec.level][ec.chnum], sce=ch.seances[sk];
  var joue=(sce.deroule_joue||{})[AT_DR_COURS.classeSlug]; if(!joue) return [];
  var prep=(sce.deroule||{}).ecrans||[];
  var vus=[]; try{ vus=DR.dr_exporterTrame()||[]; }catch(x){ vus=joue.ecrans||[]; }
  var out=[];
  vus.forEach(function(e,n){
    var av=prep[n]||null;
    if(!av){ out.push({n:n, activite:(e&&(e.act||e.h))||('\u00c9cran '+(n+1)), quoi:'\u00e9cran ajout\u00e9 pendant le cours',
      detail:_drCoupe((e.blocs||[]).map(_drTexteBloc).filter(Boolean).join(' \u00b7 '),110), neuf:true}); return; }
    /* [C1-CONSCIENCE] on compare le CONTENU SIGNIFIANT (titre + textes des blocs).
       Ni l'horaire (recalculé au lancement), ni les identifiants et compteurs que le moteur
       ajoute, ne sont des modifications du professeur. */
    if(_drEmpreinte(av)===_drEmpreinte(e)) return;
    var lignes=[];
    if((av.act||'')!==(e.act||'')) lignes.push({quoi:'titre de l\u2019activit\u00e9', avant:av.act||'\u2014', apres:e.act||'\u2014'});
    /* l'horaire est RECALCULÉ par le moteur au lancement : ce n'est pas une modification
       du professeur, on ne la propose donc jamais à la reprise. */
    var ba=av.blocs||[], be=e.blocs||[];
    var max=Math.max(ba.length,be.length);
    for(var k=0;k<max;k++){
      var ta=_drTexteBloc(ba[k]), te=_drTexteBloc(be[k]);
      if(ta===te) continue;
      if(!ba[k])      lignes.push({quoi:'bloc ajout\u00e9', avant:'\u2014', apres:_drCoupe(te,90)});
      else if(!be[k]) lignes.push({quoi:'bloc supprim\u00e9', avant:_drCoupe(ta,90), apres:'\u2014'});
      else            lignes.push({quoi:(be[k].t||'texte'), avant:_drCoupe(ta,90), apres:_drCoupe(te,90)});
    }
    if(!lignes.length) lignes.push({quoi:'contenu de l\u2019\u00e9cran', avant:'', apres:'modifi\u00e9 pendant le cours'});
    out.push({n:n, activite:(e&&(e.act||e.h))||('\u00c9cran '+(n+1)), lignes:lignes, neuf:false});
  });
  return out;
}


function atDrClotureModale(){
  var mods=atDrModifsDeLaSeance();
  var cls=escapeHtml(AT_DR_COURS?AT_DR_COURS.classeNom:'');
  if(!mods.length){
    _modaleConfirme('Clore la s\u00e9ance',
      '<div class="cm-sub">La s\u00e9ance de <b>'+cls+'</b> se ferme. Tu n\u2019as rien modifi\u00e9 pendant le cours : ta pr\u00e9paration reste telle quelle.</div>',
      atDrCloreFin);
    return;
  }
  var h='<div class="cm-sub">Tu as modifi\u00e9 <b>'+mods.length+'</b> chose'+(mods.length>1?'s':'')+' pendant le cours avec <b>'+cls+'</b>. '
    +'Ces modifications <b>restent attach\u00e9es \u00e0 cette classe</b> \u2014 elles ne partent nulle part ailleurs.<br>'
    +'Tu peux, si tu le veux, en <b>reprendre certaines dans ta pr\u00e9paration</b>, pour tes autres classes et l\u2019an prochain. Rien n\u2019est repris si tu ne coches rien.</div>'
    +'<div class="at-repr">';
  mods.forEach(function(m){
    var d='';
    if(m.neuf){ d='<div class="at-repr-d"><i>\u00e9cran ajout\u00e9 pendant le cours</i>'+(m.detail?' \u2014 '+escapeHtml(m.detail):'')+'</div>'; }
    else { d=(m.lignes||[]).map(function(l){
      return '<div class="at-repr-d"><b>'+escapeHtml(l.quoi)+'</b>'
        +(l.avant?' <span class="at-repr-av">'+escapeHtml(l.avant)+'</span> \u2192 ':' : ')
        +'<span class="at-repr-ap">'+escapeHtml(l.apres)+'</span></div>';
    }).join(''); }
    h+='<label class="at-repr-l"><input type="checkbox" data-n="'+m.n+'">'
      +'<span><b>'+escapeHtml(m.activite)+'</b>'+d+'</span></label>';
  });
  h+='</div>';
  _modaleConfirme('Clore la s\u00e9ance \u2014 '+cls, h, function(){
    var pris=[];
    document.querySelectorAll('.at-repr input:checked').forEach(function(i){ pris.push(+i.dataset.n); });
    if(pris.length) atDrReprendre(pris);
    atDrCloreFin();
  });
}


function atDrReprendre(indices){
  var ec=AT.edChap, sk=ATVUES.snum; if(!ec||!sk) return;
  var tr=atDrTrame(sk); if(!tr) return;
  var vus=[]; try{ vus=DR.dr_exporterTrame()||[]; }catch(x){ return; }
  indices.forEach(function(n){ if(vus[n]) tr.ecrans[n]=JSON.parse(JSON.stringify(vus[n])); });
  tr.maj=Date.now();
  mjpcPutJson(FIREBASE_BASE+'/site/'+ec.level+'/chapitres/'+ec.chnum+'/seances/'+sk+'/deroule.json', tr,
    'Reprise dans la pr\u00e9paration \u2014 s\u00e9ance '+sk, function(){ atDrEnrConfirme(true); });
  atInfo(indices.length+' \u00e9l\u00e9ment'+(indices.length>1?'s repris':' repris')+' dans ta pr\u00e9paration.');
}


function atVecuDemarrer(){
  AT_DR_VECU={ debutReel:Date.now(), finReel:null, activites:{}, decisions:{}, courant:null };
  atVecuEntrer(0);
}


function atVecuEntrer(n){
  if(!AT_DR_VECU) return;
  atVecuSortir();
  AT_DR_VECU.courant={n:n, depuis:Date.now()};
}


function atVecuSortir(){
  if(!AT_DR_VECU||!AT_DR_VECU.courant) return;
  var c=AT_DR_VECU.courant, ms=Date.now()-c.depuis;
  var a=AT_DR_VECU.activites[c.n]||(AT_DR_VECU.activites[c.n]={ms:0, passages:0});
  a.ms+=ms; a.passages++;
  AT_DR_VECU.courant=null;
}


function atVecuMinutes(n){
  if(!AT_DR_VECU) return 0;
  var ms=(AT_DR_VECU.activites[n]||{}).ms||0;
  if(AT_DR_VECU.courant && AT_DR_VECU.courant.n===n) ms+=Date.now()-AT_DR_VECU.courant.depuis;
  return Math.round(ms/60000);
}


function atVecuEcrire(){
  if(!AT_DR_VECU||!AT_DR_COURS) return;
  atVecuSortir();
  AT_DR_VECU.finReel=Date.now();
  AT_DR_VECU.decisions=JSON.parse(JSON.stringify(AT_T5_CHOIX||{}));
  var ec=AT.edChap, sk=ATVUES.snum; if(!ec||!sk) return;
  var ecr=[]; try{ ecr=DR.dr_exporterTrame()||[]; }catch(e){}
  var lignes=Object.keys(AT_DR_VECU.activites).map(function(k){
    var e=ecr[k]||{};
    return { n:+k, act:e.act||('\u00e9cran '+(+k+1)), prevu:+(e.dur||0),
             reel:Math.round(AT_DR_VECU.activites[k].ms/60000), passages:AT_DR_VECU.activites[k].passages,
             comp:Array.isArray(e.comp)?e.comp:[] };
  });
  var paquet={
    classe:AT_DR_COURS.classeNom, creneau:AT_DR_COURS.debut+'-'+AT_DR_COURS.fin,
    debutReel:AT_DR_VECU.debutReel, finReel:AT_DR_VECU.finReel,
    tempsUtilePrevu:atTempsUtile(),
    minutesJouees:Math.round((AT_DR_VECU.finReel-AT_DR_VECU.debutReel)/60000),
    activites:lignes, decisions:AT_DR_VECU.decisions
  };
  var ch=chapitresData[ec.level][ec.chnum], sce=ch.seances[sk];
  if(sce.deroule_joue && sce.deroule_joue[AT_DR_COURS.classeSlug]){
    sce.deroule_joue[AT_DR_COURS.classeSlug].vecu=paquet;
  }
  mjpcPutJson(FIREBASE_BASE+'/site/'+ec.level+'/chapitres/'+ec.chnum+'/seances/'+sk
    +'/deroule_joue/'+AT_DR_COURS.classeSlug+'/vecu.json', paquet,
    'V\u00e9cu de la s\u00e9ance \u2014 '+AT_DR_COURS.classeNom, function(){});
}


function atDrEnrAuto(){
  if(AT_DR_REGIME!=='prep') return;            /* en classe, rien ne remonte à la préparation */
  clearTimeout(AT_DR_ENR_T);
  AT_DR_ENR_T=setTimeout(function(){ atDrTrameEnregistrer(true); }, 900);
}


function atDrEnrConfirme(ok){
  var t=document.getElementById('at-dr-etat'); if(!t) return;
  if(ok){ var d=new Date();
    t.className='at-dr-etat at-dr-enr-ok';
    t.textContent='Enregistr\u00e9 \u00e0 '+d.toLocaleDateString('fr-FR')+' '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  } else { t.className='at-dr-etat at-dr-enr-ko'; t.textContent='\u26a0 Pas enregistr\u00e9 \u2014 v\u00e9rifie la liaison.'; }
}


function atDrTrame(snum){
  var ec=AT.edChap; if(!ec)return null;
  var ch=chapitresData[ec.level]&&chapitresData[ec.level][ec.chnum]; if(!ch)return null;
  var sce=ch.seances&&ch.seances[snum]; if(!sce)return null;
  if(!sce.deroule) sce.deroule={ecrans:[], maj:0};
  return sce.deroule;
}


function atDrTrameEnregistrer(){
  var ec=AT.edChap, sk=ATVUES.snum; if(!ec||!sk||!window.DR)return;
  var tr=atDrTrame(sk); if(!tr)return;
  tr.ecrans=DR.dr_exporterTrame(); tr.maj=Date.now();
  mjpcPutJson(FIREBASE_BASE+'/site/'+ec.level+'/chapitres/'+ec.chnum+'/seances/'+sk+'/deroule.json',
    tr,'Trame du d\u00e9roul\u00e9 \u2014 s\u00e9ance '+sk,function(){
      var t=document.getElementById('at-dr-etat'); if(t)t.textContent='Trame enregistr\u00e9e.';
    });
  atSomRafraichir();
}


function atDrJouer(classeSlug, classeNom){
  /* la copie horodat\u00e9e AU D\u00c9MARRAGE : une par classe ; une trame modifi\u00e9e ensuite
     ne touche JAMAIS une s\u00e9ance d\u00e9j\u00e0 jou\u00e9e. [T1] la copie existe, rien ne s'y \u00e9crit encore. */
  var ec=AT.edChap, sk=ATVUES.snum; if(!ec||!sk)return null;
  var ch=chapitresData[ec.level][ec.chnum], sce=ch.seances[sk];
  if(!sce.deroule_joue) sce.deroule_joue={};
  if(!sce.deroule_joue[classeSlug]){
    var tr=atDrTrame(sk);
    sce.deroule_joue[classeSlug]={ classe:classeNom||classeSlug,      /* [T1-crochet] la s\u00e9ance jou\u00e9e retient sa classe */
      demarreLe:Date.now(), ecrans:JSON.parse(JSON.stringify(tr.ecrans)) };
    mjpcPutJson(FIREBASE_BASE+'/site/'+ec.level+'/chapitres/'+ec.chnum+'/seances/'+sk+'/deroule_joue/'+classeSlug+'.json',
      sce.deroule_joue[classeSlug],'D\u00e9marrage du d\u00e9roul\u00e9 avec '+(classeNom||classeSlug),null);
  }
  return sce.deroule_joue[classeSlug];
}


function atDrBrancherSuivi(){
  if(!window.DR || DR.__suiviBranche) return;
  var vrai=DR.va;
  if(typeof vrai!=='function') return;
  DR.va=function(){ var r=vrai.apply(this,arguments);
    try{ atSomSuivreCourant(); }catch(e){}
    try{ if(AT_DR_REGIME==='classe'&&DR.dr_ecranCourant) atVecuEntrer(DR.dr_ecranCourant()); }catch(e){}
    return r; };
  DR.__suiviBranche=true;
}


function atDrMonter(){
  var ec=AT.edChap, sk=ATVUES.snum; if(!ec||!sk||!window.DR)return;
  var tete=document.getElementById('at-dr-tete');
  if(tete){
    var cls=_lvlClasses(ec.level)||[];
    var _comp='<label class="at-dr-lib" for="at-dr-comp">Comp\u00e9tences de l\u2019\u00e9cran courant :</label>'
      +'<input id="at-dr-comp" class="at-edch-in at-dr-comp" list="at-dr-taxo" placeholder="notions, s\u00e9par\u00e9es par des virgules" onchange="atDrCompChange(this.value)">'
      +'<datalist id="at-dr-taxo">'+atDrTaxoOptions()+'</datalist>'
      +'<span id="at-dr-etat" class="at-dr-etat"></span>';
    if(AT_DR_REGIME==='prep'){
      tete.className='at-dr-tete at-dr-prep';
      tete.innerHTML='<span class="at-dr-pastille" style="background:#6b8fb5"></span>'
        +'<span class="at-dr-lib"><b>PR\u00c9PARATION</b> \u2014 mon cours pr\u00e9par\u00e9, niveau '+escapeHtml(ec.level)+' \u00b7 s\u00e9ance '+escapeHtml(sk)+' \u00b7 aucune classe, rien n\u2019est projet\u00e9</span>'
        +'<span class="at-dr-sep"></span>'
        +'<select id="at-dr-classe" class="at-edch-in at-dr-sel">'+cls.map(function(c){return '<option value="'+escapeHtml(c.slug)+'">'+escapeHtml(c.nom||c.slug)+'</option>';}).join('')+'</select>'
        +'<select id="at-dr-creneau" class="at-edch-in at-dr-sel" onchange="atDrSynchroDebut()">'+AT_EDT.map(function(x,n){return '<option'+(n===2?' selected':'')+'>'+x+'</option>';}).join('')+'</select>'
        +'<span class="at-dr-lib">d\u00e9but</span>'
        +'<input type="time" id="at-dr-debut" class="at-edch-in at-dr-heure" onchange="atDrMajUtile()">'
        +'<button class="at-btn" onclick="atDrMaintenant()">maintenant</button>'
        +'<span id="at-dr-utile" class="at-dr-lib"></span>'
        +'<button class="at-btn at-dr-lancer" onclick="atDrJouerClic()">\u25b6 Lancer la s\u00e9ance</button>'
        +_comp;
    } else {
      var _u=atTempsUtile();
      tete.className='at-dr-tete at-dr-classe';
      tete.innerHTML='<span class="at-dr-pastille" style="background:#34d399"></span>'
        +'<span class="at-dr-lib"><b>EN CLASSE</b> \u2014 '+escapeHtml(AT_DR_COURS.classeNom)+' \u00b7 lanc\u00e9e '+AT_DR_COURS.debut+' \u00b7 fin '+AT_DR_COURS.fin
        +' \u00b7 <b>'+_u+' min utiles</b> \u00b7 copie de ma pr\u00e9paration</span>'
        +'<span class="at-dr-sep"></span>'
        +'<button class="at-btn at-dr-clore" onclick="atDrClore()">\u25a0 Clore la s\u00e9ance</button>'
        +_comp;
    }
  }
  document.body.classList.toggle('at-dr-prep-actif', AT_DR_REGIME==='prep');
  if(AT_DR_REGIME==='prep'){ var _d=document.getElementById('at-dr-debut'); if(_d&&!_d.value){ _d.value=atDebutPropose(); } atDrMajUtile(); }
  if(AT_DR_REGIME==='classe'){ setTimeout(function(){ atDrSuiviAppliquer(); atT5Veille(true); atSomRafraichir(); atDrBrancherSuivi(); },0); return; }   /* la copie est déjà ouverte par atDrJouerClic */
  var tr=atDrTrame(sk);
  DR.dr_ouvrir('at-dr-hote-zone', JSON.parse(JSON.stringify(tr.ecrans)), {level:ec.level,chnum:ec.chnum,snum:sk});
  setTimeout(function(){ atDrSuiviAppliquer(); atT5Veille(false); atSomRafraichir(); atDrBrancherSuivi(); },0);
}


function atDrJouerClic(){
  var sel=document.getElementById('at-dr-classe'); if(!sel)return;
  var slug=sel.value, nom=sel.options[sel.selectedIndex]?sel.options[sel.selectedIndex].text:slug;
  var _c=atCreneauSel(), _e=document.getElementById('at-dr-debut');
  var _deb=(_e&&_e.value)||_c.split('-')[0], _fin=_c.split('-')[1];
  /* [C1-CONSCIENCE] le professeur a TOUS les droits : on avertit, on ne bloque JAMAIS. */
  if(atMn(_fin)-atMn(_deb)-5<=0){ atInfo('Attention : ce d\u00e9but ne laisse aucun temps utile avant '+_fin+' \u2014 la s\u00e9ance se lance quand m\u00eame.'); }
  var copie=atDrJouer(slug,nom); if(!copie)return;
  AT_DR_COURS={debut:_deb, fin:_fin, classeSlug:slug, classeNom:nom};   /* l'objet partagé, écrit au lancement */
  AT_DR_REGIME='classe';
  atVecuDemarrer();
  atDrMonter();
  var ec=AT.edChap, sk=ATVUES.snum;
  DR.dr_ouvrir('at-dr-hote-zone', copie.ecrans, {level:ec.level,chnum:ec.chnum,snum:sk,classe:slug,joue:true});
  setTimeout(function(){ atDrSuiviAppliquer(); atSomRafraichir(); },0);
  var t=document.getElementById('at-dr-etat'); if(t)t.textContent='S\u00e9ance jou\u00e9e avec '+nom+' (copie du '+new Date(copie.demarreLe).toLocaleTimeString()+').';
}


function atDrCompChange(v){   /* [T1-crochet] l'\u00e9cran d\u00e9clare ses notions/comp\u00e9tences */
  if(!window.DR)return;
  var liste=String(v||'').split(',').map(function(x){return x.trim();}).filter(Boolean);
  DR.dr_setComp(DR.dr_ecranCourant(), liste);
}


function atDrTaxoOptions(){   /* la taxo Atelier alimente le champ si elle est charg\u00e9e (TAXO_CACHE) */
  try{
    if(TAXO_CACHE&&typeof TAXO_CACHE==='object'){
      var out=[];
      Object.keys(TAXO_CACHE).forEach(function(k){
        var f=TAXO_CACHE[k];
        if(f&&f.notions)Object.keys(f.notions).forEach(function(nk){
          var n=f.notions[nk]; out.push('<option value="'+escapeHtml((n&&(n.libelleProf||n.libelle))||nk)+'">');
        });
      });
      return out.join('');
    }
  }catch(e){}
  return '';
}


function atArbrePremiereSeance(){
  var ec=AT.edChap; if(!ec)return null;
  var ch=chapitresData[ec.level]&&chapitresData[ec.level][ec.chnum]; if(!ch)return null;
  var ks=Object.keys(ch.seances||{}).filter(function(k){return ch.seances[k]&&typeof ch.seances[k]==='object';})
        .sort(function(a,b){return (ch.seances[a].ordre||0)-(ch.seances[b].ordre||0);});
  return ks[0]||null;
}

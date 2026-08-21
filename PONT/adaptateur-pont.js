/* ═══════════ [PONT-É2] L'ADAPTATEUR DR — la prise du cadre, branchée sur le pont ═══════════
   Le cadre MJPC (couture-mjpc.js, conscience n°7) appelle DR.x(...). Ici, DR n'est plus le
   bloc transformé (jeté) : c'est un ADAPTATEUR de sept fonctions qui emballe les cinq
   messages du pont. deroule86.html reste intact, bit pour bit, dans son cadre isolé.
   Rien d'autre que les cinq messages ne traverse. */

var AT_PONT={pret:false, ecart:null};

/* la fenêtre du jeu — seul point d'accès */
function drWin(){ var f=document.getElementById('at-dr-iframe'); return f&&f.contentWindow; }
function drDoc(){ var W=drWin(); try{ return W&&W.document; }catch(e){ return null; } }

/* le cadre : créé UNE fois dans BODY, jamais détruit, jamais re-parenté (le re-parenter
   rechargerait le document : le jeu mourrait devant la classe). Il SUIT la zone
   #at-dr-hote-zone à l'écran, par-dessus. */
var _drZoneSuivie=null, _drRaf=null, _drFileAttente=[];
function _drAssurerCadre(){
  if(document.getElementById('at-dr-iframe'))return;
  var brut, texte;
  try{ brut=atob(AT_DR_B64); texte=decodeURIComponent(escape(brut)); }
  catch(e){ AT_PONT.ecart='lecture impossible — '+String(e).slice(0,60); AT_PONT.pret=true; return; }
  var f=document.createElement('iframe'); f.id='at-dr-iframe'; f.className='at-dr-cadre';
  f.style.display='none';
  /* le premier événement load vient du document vide initial : on n'accepte que
     celui du déroulé lui-même (sa fonction rendre existe) */
  f.addEventListener('load',function(){
    try{ if(!f.contentWindow || typeof f.contentWindow.rendre!=='function') return; }catch(e){ return; }
    _drVerifier(brut);
  });
  f.srcdoc=texte;
  document.body.appendChild(f);
}
/* intégrité au boot : le texte chargé EST deroule86.html, prouvé par empreinte */
function _drVerifier(texte){
  var fin=function(ok,det){ AT_PONT.ecart=ok?null:det; AT_PONT.pret=true; _drPontEtat();
    _drEnvelopper(); var q=_drFileAttente.splice(0); q.forEach(function(fn){ try{fn();}catch(e){} }); };
  /* l'empreinte se prend sur les OCTETS du fichier (brut), pas sur la chaîne décodée */
  if(texte.length!==AT_DR_LONGUEUR)return fin(false,'longueur '+texte.length+' \u2260 '+AT_DR_LONGUEUR);
  if(!(window.crypto&&crypto.subtle))return fin(true,null);
  var oct=new Uint8Array(texte.length); for(var k=0;k<texte.length;k++)oct[k]=texte.charCodeAt(k);
  crypto.subtle.digest('SHA-256',oct).then(function(d){
    var hx=Array.prototype.map.call(new Uint8Array(d),function(o){return('0'+o.toString(16)).slice(-2);}).join('');
    fin(hx===AT_DR_SHA256,'empreinte '+hx.slice(0,12)+'\u2026 \u2260 attendue');
  }).catch(function(){ fin(true,null); });
}
function _drQuandPret(fn){ if(AT_PONT.pret)fn(); else _drFileAttente.push(fn); }
/* [É3] dans le CADRE, la barre du haut et la colonne vignettes du moteur font DOUBLON
   avec la barre MJPC et le sommaire natif : masquées AU RUNTIME (le fichier moteur reste
   entier — ouvert nu, il garde tout). La scène récupère leur place. */
function _drHabiller(){
  var D=drDoc(); if(!D||D.getElementById('pont-css-cadre'))return;
  var s=D.createElement('style'); s.id='pont-css-cadre';
  /* [retour sur É3, ordre de Paul 21/08] la colonne vignettes du moteur EST le système
     des groupes (cadre pointillé, vraies miniatures, « suite n », gestes) : elle RESTE.
     Seule la barre du haut (doublon d'onglets avec la barre MJPC) est masquée ;
     la scène garde le gain de hauteur. */
  s.textContent='.top{display:none!important}'
    +'.cols{height:100vh!important}';
  D.head.appendChild(s);
}
function _drPontEtat(){
  var t=document.getElementById('at-dr-tete'); if(!t)return;
  var a=t.querySelector('.at-dr-integ'); if(a)a.remove();
  t.insertAdjacentHTML('beforeend','<span class="at-dr-integ'+(AT_PONT.ecart?' at-dr-integ-ko':'')+'">'
    +(AT_PONT.ecart?('\u26a0 d\u00e9roul\u00e9 alt\u00e9r\u00e9 \u2014 '+AT_PONT.ecart):'d\u00e9roul\u00e9 int\u00e8gre \u00b7 bit pour bit')+'</span>');
}
/* le suiveur : l'iframe (fixe, dans body) épouse la zone at-dr-hote-zone */
function _drAfficher(on){
  var f=document.getElementById('at-dr-iframe'); if(!f)return;
  cancelAnimationFrame(_drRaf);
  if(!on){
    /* [PONT] jamais 0 px : un cadre à zéro fait « déborder » tout écran aux yeux du
       moteur, qui scinde. Caché = invisible HORS écran, taille conservée. */
    f.style.visibility='hidden'; f.style.left='-99999px'; return; }
  f.style.visibility='visible'; f.style.display='block';
  var suit=function(){
    var z=document.getElementById('at-dr-hote-zone');
    if(!z){ f.style.display='none'; return; }
    var r=z.getBoundingClientRect();
    f.style.position='fixed';
    f.style.left=r.left+'px'; f.style.top=r.top+'px';
    f.style.width=r.width+'px'; f.style.height=r.height+'px';
    _drRaf=requestAnimationFrame(suit);
  };
  suit();
}
/* les enveloppes runtime (le fichier du jeu n'est jamais modifié) :
   · rendre() → suivi de l'écran courant (colonne, vécu) — couvre va, pas, annuler, vignettes ;
   · sauve() → enregistrement automatique de la trame (tout geste d'édition commence par lui). */
function _drEnvelopper(){
  var W=drWin(); if(!W||W.__pontEnv)return;
  var _lastI=null;
  var vraiRendre=W.rendre;
  W.rendre=function(){ var r=vraiRendre.apply(W,arguments);
    try{ if(W.i!==_lastI){ _lastI=W.i;
      atSomSuivreCourant();
      if(AT_DR_REGIME==='classe') atVecuEntrer(W.i);
    } }catch(e){}
    return r; };
  var vraiSauve=W.sauve;
  W.sauve=function(){ try{ atDrEnrAuto(); }catch(e){} return vraiSauve.apply(W,arguments); };
  W.__pontEnv=true;
}

/* ═══ L'ADAPTATEUR — les sept prises du cadre, emballant les cinq messages ═══ */
var DR={
  /* message ④ — va à l'écran n (atDrBrancherSuivi l'enveloppera : DR est mutable, voulu) */
  va:function(n){ var W=drWin(); if(W&&W.va)W.va(n); },
  dr_ecranCourant:function(){ var W=drWin(); return (W&&typeof W.i==='number')?W.i:0; },
  /* message ③ — voilà mes écrans (export COMPLET : empreinte, T-5 et trame en dépendent).
     lire() d'abord : les champs en cours d'édition rejoignent les données. */
  dr_exporterTrame:function(){ var W=drWin(); if(!W||!W.ECRANS)return [];
    try{ W.lire(); }catch(e){}
    return JSON.parse(JSON.stringify(W.ECRANS)); },
  /* message ① — voici la trame à jouer */
  dr_chargerTrame:function(ecrans){ var W=drWin(); if(!W)return;
    var t=JSON.parse(JSON.stringify(ecrans||[]));
    /* une séance jamais préparée arrive VIDE : le moteur ne survit pas à zéro écran
       (lecture de ECRANS[i] au rendu). Le message ① garantit un état jouable, avec
       LA forme d'écran neuf du moteur lui-même (celle de nouvelEcran). */
    if(!t.length)t=[{act:"Nouvelle activité",h:"—",dur:0,blocs:[]}];
    W.ECRANS=t;
    W.i=0; W.ficheOuverte=null; W.rendre(); },
  /* ouverture : le cadre paraît sur la zone, la trame n'est rechargée QUE si elle change
     (retour d'onglet = reprise, jamais réinitialisation) */
  dr_ouvrir:function(zoneId,ecrans,ctx){
    _drAssurerCadre(); _drAfficher(true);
    var jeton=[ctx&&ctx.level,ctx&&ctx.chnum,ctx&&ctx.snum,(ctx&&ctx.classe)||'',(ctx&&ctx.joue)?'j':''].join('|');
    _drQuandPret(function(){
      if(DR.__charge&&DR.__charge!==jeton)_drFlushTrame(DR.__charge);   /* l'édition des 900 dernières ms part vers SA séance */
      if(DR.__charge!==jeton){ DR.__charge=jeton; DR.dr_chargerTrame(ecrans); }
      _drTitrerColonne(ctx);                     /* la colonne dit LA séance ouverte, pas « séance 3 » */
      _drHabiller();
      _drPontEtat();
      try{ atDrSuiviAppliquer(); }catch(e){}   /* le cadre était passé avant que le jeu soit prêt */
      try{ atSomRafraichir(); }catch(e){}
    });
  },
  dr_fermer:function(){ _drAfficher(false); },
  /* la trame s'édite par le cadre (crochet taxo) — c'est le message ① incrémental */
  dr_setComp:function(n,liste){ var W=drWin(); if(!W||!W.ECRANS||!W.ECRANS[n])return;
    W.ECRANS[n].comp=liste; atDrEnrAuto(); }
};

/* [flush de bascule] un enregistrement automatique en attente (debounce 900 ms) au moment
   de changer de séance serait détourné vers la NOUVELLE (perte silencieuse de la dernière
   édition — prouvé au banc É4ter). On l'écrit ici, vers l'ANCIENNE séance, tant que sa
   trame est encore dans le jeu. En classe, rien ne remonte (règle inchangée). */
function _drFlushTrame(ancienJeton){
  try{
    if(!AT_DR_ENR_T)return;
    clearTimeout(AT_DR_ENR_T); AT_DR_ENR_T=null;
    if(AT_DR_REGIME!=='prep')return;
    var pj=String(ancienJeton||'').split('|'), lv=pj[0], ch=pj[1], sk=pj[2];
    if(!lv||!ch||!sk||pj[4]==='j')return;
    var chp=chapitresData[lv]&&chapitresData[lv][ch]; var sce=chp&&chp.seances&&chp.seances[sk]; if(!sce)return;
    if(!sce.deroule)sce.deroule={ecrans:[],maj:0};
    sce.deroule.ecrans=DR.dr_exporterTrame();      /* la trame encore à bord : l'ancienne */
    sce.deroule.maj=Date.now();
    mjpcPutJson(FIREBASE_BASE+'/site/'+lv+'/chapitres/'+ch+'/seances/'+sk+'/deroule.json',
      sce.deroule,'Trame (flush de bascule) — séance '+sk,function(){ try{atDrEnrConfirme(true);}catch(e){} });
  }catch(e){}
}

/* [contextualisation] la maquette était MONO-séance : « Écrans · séance 3 » est en dur
   dans son HTML. Le moteur reste agnostique ; le PONT écrit le vrai libellé à chaque
   ouverture. Ouvert nu, le moteur garde son texte d'origine. */
function _drTitrerColonne(ctx){
  try{
    var D=drDoc(); var v=D&&D.querySelector('.vgt'); if(!v)return;
    var lv=ctx&&ctx.level, ch=ctx&&ctx.chnum, sk=ctx&&ctx.snum;
    var sce=lv&&ch&&sk&&chapitresData[lv]&&chapitresData[lv][ch]&&chapitresData[lv][ch].seances&&chapitresData[lv][ch].seances[sk];
    var titre=(sce&&(sce.title||sce.titre))||sk||'';
    v.textContent='Écrans · '+titre;
  }catch(e){}
}

/* le boot du montage : rappeler l'onglet retenu */
atVuesRappeler();
/* ═══════════ fin [PONT-É2] ═══════════ */

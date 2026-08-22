var _drSainTic=0;
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
  var fin=function(ok,det){ AT_PONT.ecart=ok?null:det; try{ var Wv=drWin();
    if(Wv && !Wv.__pontCharge){ Wv.ECRANS=[{act:"Nouvelle activité",h:"—",dur:0,blocs:[]}]; Wv.i=0; Wv.rendre(); }
  }catch(e){}                                        /* [garde] la démo embarquée ne s'affiche jamais dans le cadre */
  AT_PONT.pret=true; _drPontEtat();
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
/* [garde] la santé du cadre : le jeu répond et la scène existe. Une iframe détachée
   puis rattachée par n'importe quel code du site PERD son contenu (écran noir vu par
   Paul au retour dans l'atelier en pleine séance) : on ne devine pas la route, on répare. */
function _drSain(){
  try{ var f=document.getElementById('at-dr-iframe'); if(!f)return false;
    var W=f.contentWindow; return !!(W && typeof W.rendre==='function' && W.document && W.document.getElementById('contenu')); }
  catch(e){ return false; }
}
function _drReconstruire(){
  try{ var f=document.getElementById('at-dr-iframe'); if(f)f.remove(); }catch(e){}
  AT_PONT.pret=false; AT_PONT.ecart=null;
  try{ DR.__charge=null; }catch(e){}
}
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
    if((_drSainTic=((_drSainTic||0)+1))%40===0)_drCalerStructure();   /* [fluidité] les 3 colonnes tiennent dans l'écran */
    if(_drSainTic%150===0 && document.getElementById('at-dr-hote-zone') && !_drSain() && AT_PONT.pret){
      _drReconstruire(); try{ atVuesPoser&&atVuesPoser(ATVUES.vue); }catch(e){}   /* [garde] cadre mort en cours de route */
    }
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
    try{ if(DR.__charge){ AT_PONT.dernierJeton=DR.__charge; AT_PONT.dernierEcran=W.i; } }catch(e){}   /* la position, pour la reconstruction */
    try{ clearTimeout(AT_PONT._syT); AT_PONT._syT=setTimeout(function(){ try{atSomRafraichir();}catch(e){} },300); }catch(e){}   /* [resync] la colonne chapitre suit chaque rendu, sans retard */
    return r; };
  var vraiSauve=W.sauve;
  W.sauve=function(){ try{ atDrEnrAuto(); }catch(e){} return vraiSauve.apply(W,arguments); };
  var vraiTableau=W.tableau;
  W.tableau=function(){ var r=vraiTableau.apply(W,arguments);
    setTimeout(function(){ try{
      var win=W.win; if(!win||win.closed)return;
      var c=win.document.querySelector('#att .c'); if(!c)return;
      var x=(window.AT_PONT&&AT_PONT.ctx)||{}, lv=x.level, ch=x.chnum, sk=x.snum;
      var chp=lv&&ch&&chapitresData[lv]&&chapitresData[lv][ch];
      var sce=chp&&chp.seances&&chp.seances[sk];
      var m=[];
      if(AT_DR_REGIME==='classe'&&AT_DR_COURS&&AT_DR_COURS.classe&&classesData[AT_DR_COURS.classe])
        m.push(classesData[AT_DR_COURS.classe].nom||AT_DR_COURS.classe);
      if(chp&&chp.title)m.push(chp.title);
      if(sce&&(sce.title||sce.titre))m.push(sce.title||sce.titre);
      if(m.length)c.textContent=m.join(' · ');    /* le moteur nu garde son texte d'origine */
    }catch(e){} },200);
    return r; };
  /* [molette] l'iframe avale la roulette : quand rien ne défile à l'intérieur,
     le geste passe à la page — un défileur interne encore capable d'absorber garde la main. */
  W.document.addEventListener('wheel',function(ev){
    var n=ev.target;
    while(n&&n!==W.document.body&&n!==W.document.documentElement){
      if(n.scrollHeight>n.clientHeight+2){
        var haut=n.scrollTop>0, bas=n.scrollTop+n.clientHeight<n.scrollHeight-1;
        if((ev.deltaY<0&&haut)||(ev.deltaY>0&&bas))return;
      }
      n=n.parentElement;
    }
    try{
      var hd=parent.document, cible=null, c2=hd.elementFromPoint?null:null;
      var cand=[hd.getElementById('atelier-ecran'), hd.scrollingElement, hd.body];
      for(var k=0;k<cand.length;k++){ var c=cand[k];
        if(c&&c.scrollHeight>c.clientHeight+2){ cible=c; break; } }
      if(cible)cible.scrollBy({top:ev.deltaY}); else parent.scrollBy({top:ev.deltaY});
    }catch(e){}
  },{passive:true});
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
  dr_vue:function(v){ var W=drWin(); if(W&&W.ong)try{W.ong(v);}catch(e){} },
  dr_chargerTrame:function(ecrans){ var W=drWin(); if(!W)return;
    var t=JSON.parse(JSON.stringify(ecrans||[]));
    /* une séance jamais préparée arrive VIDE : le moteur ne survit pas à zéro écran
       (lecture de ECRANS[i] au rendu). Le message ① garantit un état jouable, avec
       LA forme d'écran neuf du moteur lui-même (celle de nouvelEcran). */
    if(!t.length)t=[{act:"Nouvelle activité",h:"—",dur:0,blocs:[]}];
    W.ECRANS=t;
    W.__pontCharge=true;                       /* le marqueur de trame : tout reboot l'efface */
    W.i=0; W.ficheOuverte=null; W.rendre(); },
  /* ouverture : le cadre paraît sur la zone, la trame n'est rechargée QUE si elle change
     (retour d'onglet = reprise, jamais réinitialisation) */
  dr_ouvrir:function(zoneId,ecrans,ctx){
    /* [garde] cadre mort OU rebooté (la démo embarquée a repris la main : marqueur absent) :
       reconstruction complète AVANT la file — pret retombe, le chargement rejouera après le
       load propre, jamais à chaud pendant le boot (course prouvée au banc). */
    if(!_drSain() || (AT_PONT.pret && !((drWin()||{}).__pontCharge))){ _drReconstruire(); }
    _drAssurerCadre(); _drAfficher(true);
    var jeton=[ctx&&ctx.level,ctx&&ctx.chnum,ctx&&ctx.snum,(ctx&&ctx.classe)||'',(ctx&&ctx.joue)?'j':''].join('|');
    _drQuandPret(function(){
      if(DR.__charge&&DR.__charge!==jeton)_drFlushTrame(DR.__charge);   /* l'édition des 900 dernières ms part vers SA séance */
      if(DR.__charge!==jeton){
        var posMem=(AT_PONT.dernierJeton===jeton)?(AT_PONT.dernierEcran||0):0;   /* AVANT le chargement : son rendre écrase la mémoire */
        DR.__charge=jeton; DR.dr_chargerTrame(ecrans);
        if(posMem>0){   /* reconstruction : on revient où l'on était */
          try{ var Wp=drWin(); if(Wp&&Wp.ECRANS&&posMem<Wp.ECRANS.length){ Wp.i=posMem; Wp.rendre(); } }catch(e){}
        } }
      AT_PONT.ctx=ctx||AT_PONT.ctx;
      try{ var Wm=drWin(); if(Wm&&Wm.META){                     /* [n°90] le contexte réel sur les feuilles et fiches */
        var xm=AT_PONT.ctx||{}, chpm=xm.level&&chapitresData[xm.level]&&chapitresData[xm.level][xm.chnum];
        var scem=chpm&&chpm.seances&&chpm.seances[xm.snum];
        var J=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],
            M=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
            dj=new Date();
        Wm.META.classe=(AT_DR_REGIME==='classe'&&AT_DR_COURS&&AT_DR_COURS.classe&&classesData[AT_DR_COURS.classe])?(classesData[AT_DR_COURS.classe].nom||''):'';
        Wm.META.chapitre=(chpm&&chpm.title)||''; Wm.META.chapitreCourt=(chpm&&chpm.title)||'';
        Wm.META.seance=(scem&&(scem.title||scem.titre))||String(xm.snum||'');
        Wm.META.seanceCourt=Wm.META.seance;
        Wm.META.date=J[dj.getDay()]+' '+dj.getDate()+' '+M[dj.getMonth()];
        var h3=Wm.document.getElementById('h3part'); if(h3)h3.textContent='Participation · '+(Wm.META.classe||'—');
      } }catch(e){}
      try{ var W0=drWin(); if(W0&&W0.ong)W0.ong('deroule'); }catch(e){}   /* la vue interne suit l'onglet MJPC */
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

/* ═══ [OBJETS-DIAPO, ordre de Paul 21/08] les diapos se manipulent comme les documents :
   MÊME mécanisme de menu contextuel (table ctxSommaireCible + ctxOuvrir du site, étendus
   par ENVELOPPES — la base reste intacte), opérations conformes à la matrice actions×état :
   déplacer → tout conservé · copier → identifiant neuf, dévoilement à zéro, fragment effacé.
   En PRÉPARATION seulement : une séance jouée ne se manipule pas d'ici. ═══ */
function _drTrameDe(sk){
  var x=AT_PONT.ctx||{}; var chp=x.level&&x.chnum&&chapitresData[x.level]&&chapitresData[x.level][x.chnum];
  var sce=chp&&chp.seances&&chp.seances[sk]; if(!sce)return null;
  if(!sce.deroule)sce.deroule={ecrans:[],maj:0};
  if(!sce.deroule.ecrans)sce.deroule.ecrans=[];
  return sce.deroule;
}
function _drEcrireTrame(sk,motif){
  var x=AT_PONT.ctx||{}; var t=_drTrameDe(sk); if(!t)return;
  t.maj=Date.now();
  mjpcPutJson(FIREBASE_BASE+'/site/'+x.level+'/chapitres/'+x.chnum+'/seances/'+sk+'/deroule.json',t,motif,function(){});
}
function _drRechargerSi(sk){
  var x=AT_PONT.ctx||{};
  if(String(x.snum)===String(sk)&&AT_DR_REGIME==='prep'){ DR.__charge=null; atVuesPoser&&atVuesPoser(); }
  atSomRafraichir&&atSomRafraichir();
}
function atEcranEnvoyer(skSrc,n,skDst,posDst){
  if(AT_DR_REGIME!=='prep')return;
  var x=AT_PONT.ctx||{};
  if(String(x.snum)===String(skSrc))try{atDrTrameEnregistrer(true);}catch(e){}
  var A=_drTrameDe(skSrc), B=_drTrameDe(skDst); if(!A||!B||!A.ecrans[n])return;
  var e=A.ecrans.splice(n,1)[0];
  delete e.grp; delete e.suite;                     /* un écran envoyé seul quitte son groupe */
  (e.blocs||[]).forEach(function(b){ delete b.frag; });
  if(typeof posDst==='number'&&posDst>=0&&posDst<=B.ecrans.length)B.ecrans.splice(posDst,0,e); else B.ecrans.push(e);
  _drEcrireTrame(skSrc,'Écran envoyé (départ) — séance '+skSrc);
  _drEcrireTrame(skDst,'Écran reçu — séance '+skDst);
  _drRechargerSi(skSrc); _drRechargerSi(skDst);
}
function atEcranDupliquer(sk,n){
  if(AT_DR_REGIME!=='prep')return;
  var T=_drTrameDe(sk); if(!T||!T.ecrans[n])return;
  var e=JSON.parse(JSON.stringify(T.ecrans[n]));
  delete e.grp; delete e.suite; e.rev=0;            /* copie : dévoilement à zéro */
  (e.blocs||[]).forEach(function(b){ b.id='x'+Math.random().toString(36).slice(2,9);   /* identifiant NEUF */
    delete b.frag; b.vues=0; });
  T.ecrans.splice(n+1,0,e);
  _drEcrireTrame(sk,'Écran dupliqué — séance '+sk);
  _drRechargerSi(sk);
}
function atEcranSupprimer(sk,n){
  if(AT_DR_REGIME!=='prep')return;
  var T=_drTrameDe(sk); if(!T||!T.ecrans[n])return;
  T.ecrans.splice(n,1);
  _drEcrireTrame(sk,'Écran supprimé — séance '+sk);
  _drRechargerSi(sk);
}
function _drEntreesEcran(sk,n){
  var x=AT_PONT.ctx||{}; var chp=x.level&&chapitresData[x.level]&&chapitresData[x.level][x.chnum];
  var e=(_drTrameDe(sk)||{ecrans:[]}).ecrans[n]||{};
  var entrees=[
    {lib:'Ouvrir', faire:function(){ atSomAllerEcran(n,sk); }},
    {lib:'Dupliquer ici', faire:function(){ atEcranDupliquer(sk,n); }}
  ];
  if(chp&&chp.seances){
    Object.keys(chp.seances).sort(function(a,b){return (chp.seances[a].ordre||0)-(chp.seances[b].ordre||0);})
      .forEach(function(k){ if(String(k)===String(sk))return;
        entrees.push({lib:'Envoyer vers « '+(chp.seances[k].title||k)+' »',
          faire:function(){ atEcranEnvoyer(sk,n,k); }}); });
  }
  entrees.push({lib:'Supprimer', danger:true, faire:function(){
    var titreE=(e.act||('Écran '+(n+1)));
    if(typeof _modaleConfirme==='function'){
      _modaleConfirme('Supprimer cet écran',
        '<div class="cm-sub">« '+((typeof escapeHtml==='function')?escapeHtml(titreE):titreE)+' » sera retiré de la séance. Les séances déjà jouées n’y perdent rien.</div>',
        function(){ atEcranSupprimer(sk,n); });
    } else { atEcranSupprimer(sk,n); }
  }});
  return entrees;
}
/* [drag inter-séances, décision de Paul] les minis du sommaire se GLISSENT d'une séance
   à l'autre — même opération que « Envoyer vers » (atEcranEnvoyer), geste souris en plus.
   Tout se passe dans la page hôte : aucune traversée du cadre. */
var AT_DRAG_ECR=null;
document.addEventListener('dragstart',function(ev){
  var m=ev.target&&ev.target.closest&&ev.target.closest('.at-ecr[data-ecr]');
  if(!m||AT_DR_REGIME==='classe')return;
  AT_DRAG_ECR={sk:m.getAttribute('data-ese'), n:parseInt(m.getAttribute('data-ecr'),10)};
  try{ ev.dataTransfer.setData('text/plain','atecran'); ev.dataTransfer.effectAllowed='move'; }catch(e){}
});
document.addEventListener('dragover',function(ev){
  if(!AT_DRAG_ECR)return;
  var cible=ev.target&&ev.target.closest&&(ev.target.closest('.at-ecr[data-ecr]')||ev.target.closest('.ed2-sce[data-seance]'));
  if(cible){ ev.preventDefault(); try{ev.dataTransfer.dropEffect='move';}catch(e){} }
});
document.addEventListener('drop',function(ev){
  if(!AT_DRAG_ECR)return;
  var d=AT_DRAG_ECR; AT_DRAG_ECR=null;
  var mini=ev.target&&ev.target.closest&&ev.target.closest('.at-ecr[data-ecr]');
  var sce=ev.target&&ev.target.closest&&ev.target.closest('.ed2-sce[data-seance]');
  var skDst=mini?mini.getAttribute('data-ese'):(sce?sce.getAttribute('data-seance'):null);
  if(!skDst)return; ev.preventDefault();
  if(String(skDst)===String(d.sk))return;                     /* dans la même séance : le moteur a déjà son drag */
  var pos=mini?parseInt(mini.getAttribute('data-ecr'),10):undefined;
  atEcranEnvoyer(d.sk,d.n,skDst,pos);
});
document.addEventListener('dragend',function(){ AT_DRAG_ECR=null; });

(function(){
  /* extension de la TABLE et du ROUTEUR par enveloppes — le principe du site, pas un menu maison */
  if(typeof ctxSommaireCible==='function'&&!window.__ctxEcranEtendu){
    window.__ctxEcranEtendu=true;
    var vraiCible=ctxSommaireCible;
    ctxSommaireCible=function(t){
      if(t&&t.closest){ var m=t.closest('.at-ecr[data-ecr]');
        if(m&&AT_DR_REGIME!=='classe')return {type:'atecran', id:m.getAttribute('data-ese')+'|'+m.getAttribute('data-ecr')}; }
      return vraiCible(t);
    };
    var vraiOuvrirCtx=ctxSommaireOuvrir;
    ctxSommaireOuvrir=function(x,y,cible){
      if(cible&&cible.type==='atecran'){
        var p=cible.id.split('|'), sk=p[0], n=parseInt(p[1],10);
        var e=(_drTrameDe(sk)||{ecrans:[]}).ecrans[n]||{};
        ctxOuvrir(x,y,(e.act||('Écran '+(n+1))),_drEntreesEcran(sk,n));
        return;
      }
      return vraiOuvrirCtx(x,y,cible);
    };
  }
  /* navigation : en vue DÉROULÉ, cliquer un TITRE de séance ouvre sa trame (même vierge) */
  if(typeof ed2SelectionnerSeance==='function'&&!window.__selSeanceEtendu){
    window.__selSeanceEtendu=true;
    var vraiSel=ed2SelectionnerSeance;
    ed2SelectionnerSeance=function(j,depuis){
      var r=vraiSel.apply(this,arguments);
      try{ if(window.ATVUES&&ATVUES.vue==='deroule'&&AT_DR_REGIME!=='classe')atSomAllerEcran(0,j); }catch(e){}
      return r;
    };
  }
})();

/* [A7] Relecture et Papier : les vues DÉJÀ CONSTRUITES du moteur (récit, pages A4),
   rendues par le pont — plus d'écriteaux « à venir ». */
function atDrVueInterne(v){
  _drQuandPret(function(){ DR.dr_vue(v); try{_drHabiller();}catch(e){} });
}

/* [fluidité Structure, ordre de Paul 22/08] les trois colonnes se calent à la hauteur
   réellement disponible (plus de débord de page) et contiennent leur défilement
   (plus de saut de page à la butée). Doux, réactif au redimensionnement, réversible. */
setInterval(function(){ try{_drCalerStructure();}catch(e){} },600);
/* [fluidité · le pointeur désigne] la molette défile LA colonne survolée, immédiatement —
   sans clic d'activation, sans verrouillage du navigateur sur la colonne précédente.
   La correspondance des clics entre colonnes n'est pas touchée. */
document.addEventListener('wheel',function(ev){
  try{
    var a=document.getElementById('atelier-ecran'); if(!a||!a.getClientRects().length)return;
    var t=ev.target;
    if(t&&t.closest&&t.closest('textarea,select,[contenteditable="true"]'))return;
    var col=t&&t.closest&&t.closest('.ed2-som,.ed2-pan,.ed2-papier'); if(!col)return;
    ev.preventDefault();
    col.scrollTop+=ev.deltaY;
  }catch(e){}
},{passive:false});   /* battement propre : Structure se cale même sans cadre */
function _drCalerStructure(){
  try{
    var g=document.querySelector('#atelier-ecran .ed2-grille'); if(!g||!g.offsetParent)return;
    var a=document.getElementById('atelier-ecran'); if(!a)return;
    var topRel=Math.round(g.getBoundingClientRect().top - a.getBoundingClientRect().top) + a.scrollTop;
    var pb=(parseInt(getComputedStyle(a).paddingBottom,10)||0);
    var dispo=Math.max(300, a.clientHeight - topRel - pb - 4);   /* le bas utile, mesuré — pas deviné */
    /* [barre d'impression] extraite du flux : calée dans la zone noire au-dessus de SA colonne
       (demande de Paul — les trois colonnes deviennent égalitaires en hauteur). */
    try{
      var pap=document.querySelector('#atelier-ecran .ed2-papier');
      var barre=pap&&pap.querySelector('.ed2-pbarre');
      if(barre){
        var rp=pap.getBoundingClientRect();
        barre.style.position='fixed';
        barre.style.left=Math.round(rp.left)+'px';
        barre.style.width=Math.round(rp.width)+'px';
        barre.style.top=Math.max(54, Math.round(g.getBoundingClientRect().top)-barre.offsetHeight-8)+'px';
        barre.style.zIndex='7500'; barre.style.margin='0';
      }
    }catch(e){}
    for(var it=0;it<2;it++){
      for(var q=0;q<g.children.length;q++)g.children[q].style.maxHeight=dispo+'px';
      var reste=a.scrollHeight-a.clientHeight;
      if(reste<=2)break;
      dispo=Math.max(300,dispo-reste);   /* le résidu sous la grille, retranché dans la même passe */
    }
    for(var k=0;k<g.children.length;k++){ var c=g.children[k];
      if(c.style.maxHeight!==dispo+'px')c.style.maxHeight=dispo+'px';
      if(c.style.overscrollBehaviorY!=='contain')c.style.overscrollBehaviorY='contain';
      if(getComputedStyle(c).overflowY==='visible')c.style.overflowY='auto';
    }
  }catch(e){}
}

/* le boot du montage : rappeler l'onglet retenu */
atVuesRappeler();
/* ═══════════ fin [PONT-É2] ═══════════ */

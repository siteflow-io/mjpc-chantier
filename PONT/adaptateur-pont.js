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
  W.sauve=function(){ try{ atDrEnrAuto(); }catch(e){} try{ _drCopieAuto(); }catch(e){} return vraiSauve.apply(W,arguments); };
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
    return _drRefusionner(JSON.parse(JSON.stringify(W.ECRANS))); },
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
      try{ setTimeout(_drPoserContexteMoteur,60); }catch(e){}
    try{ setTimeout(_drVifInstaller,140); }catch(e){}
    try{ if(!window.__vifBat){ window.__vifBat=setInterval(function(){ try{
      _drVifInstaller();
      var W2=drWin(), z2=W2&&W2.document.getElementById('vif');
      if(z2){
        var enClasse=(AT_DR_REGIME==='classe');
        z2.style.display=enClasse?'':'none';
        if(enClasse&&!window.__vifFocusFait){ window.__vifFocusFait=true; try{z2.focus();}catch(e){} }
        if(!enClasse)window.__vifFocusFait=false;
      }
    }catch(e){} },700); } }catch(e){}
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

/* ══════════ P2 · LE CHAPITRE PORTE SES DÉROULÉS (chantier PROMPTS) ══════════
   Le JSON de chapitre accepte seances[].cle (clé de rapprochement, arbitrage b)
   et seances[].deroule.ecrans (trames au format du moteur, arbitrage a).
   Validation ADDITIVE par enveloppe (la base n'est pas touchée) ; application
   par normalisation aux défauts exacts du moteur ; politique : COMPLÉTER par
   défaut, REMPLACER seulement sur demande — jamais d'écrasement silencieux. */
var AT_P2_TYPES={consigne:1,fiche:1,question:1,schema:1,image:1};
function atP2Uid(){return 'b'+Math.random().toString(36).slice(2,9);}
function atP2NormaliserBloc(b){
  var t=b&&b.t;
  if(t==='consigne')return {id:atP2Uid(),t:'consigne',pic:String(b.pic||'•'),txt:String(b.txt||''),etapes:Array.isArray(b.etapes)?b.etapes.map(String):[],vues:0};
  if(t==='fiche')return {id:atP2Uid(),t:'fiche',tt:String(b.tt||'Fiche'),titre:String(b.titre||''),def:String(b.def||''),corps:String(b.corps||'<p>—</p>'),vues:0};
  if(t==='question')return {id:atP2Uid(),t:'question',q:String(b.q||''),reps:(Array.isArray(b.reps)&&b.reps.length?b.reps:[{i:'',r:''}]).map(function(r){return {i:String((r&&r.i)||''),r:String((r&&r.r)||''),refo:false};}),vues:0};
  if(t==='schema')return {id:atP2Uid(),t:'schema',forme:String(b.forme||'carte'),titre:String(b.titre||''),z:1,pos:{},src:String(b.src||''),vues:0};
  if(t==='image')return {id:atP2Uid(),t:'image',support:true,ref:String(b.ref||''),src:'',legende:String(b.legende||''),marques:[],devoilerTout:true,vues:0};
  return null;
}
function atP2ValiderDeroule(o,V){
  var ses=(o&&o.chapitre&&o.chapitre.seances)||[]; if(!Array.isArray(ses))return;
  var cles={};
  ses.forEach(function(se,ix){
    var ref=(se&&se.title)||('séance n° '+(ix+1));
    if(se&&se.cle!==undefined){
      if(!/^[a-z0-9][a-z0-9-]{1,23}$/.test(String(se.cle)))V.cite(ref,'a une clé invalide (« '+se.cle+' ») : minuscules, chiffres, tirets, 2 à 24 signes.');
      else if(cles[se.cle])V.cite(ref,'réutilise la clé « '+se.cle+' » déjà prise — chaque séance a la sienne.');
      cles[String(se.cle)]=1;
    }
    var dr=se&&se.deroule;
    if(dr===undefined)return;
    if(!dr||!Array.isArray(dr.ecrans)||!dr.ecrans.length){V.cite(ref,'déclare un déroulé sans écrans (deroule.ecrans doit être une liste non vide).');return;}
    dr.ecrans.forEach(function(e,n){
      var r2=ref+' · écran '+(n+1);
      if(!e||!String(e.act||'').trim())V.cite(r2,'n’a pas de titre (« act »).');
      if(!(+(e&&e.dur)>0))V.cite(r2,'n’a pas de durée en minutes (« dur »).');
      (e&&Array.isArray(e.blocs)?e.blocs:[]).forEach(function(b,k){
        if(!b||!AT_P2_TYPES[b.t]){V.cite(r2,'bloc '+(k+1)+' : type inconnu (« '+((b&&b.t)||'')+' »). Types : consigne, fiche, question, schema, image.');return;}
        if(b.t==='question'&&!String(b.q||'').trim())V.cite(r2,'bloc '+(k+1)+' : la question est vide (« q »).');
        if(b.t==='image'&&!String(b.ref||'').trim())V.cite(r2,'bloc '+(k+1)+' : l’image n’a pas d’adresse (« ref »).');
      });
    });
  });
  (Array.isArray(o&&o.aLier)?o.aLier:[]).forEach(function(l,ix){
    if(l&&l.seance_cle!==undefined&&!cles[String(l.seance_cle)])
      V.cite('aLier n° '+(ix+1),'vise une clé de séance inconnue (« '+l.seance_cle+' »).');
  });
}
if(typeof chValiderChapitre==='function'&&!window.__p2ValPose){
  window.__p2ValPose=true;
  var _chValiderOrig=chValiderChapitre;
  chValiderChapitre=function(o,taxo){
    var V=_chValiderOrig(o,taxo);
    try{atP2ValiderDeroule(o,V);}catch(e){}
    return V;
  };
}
/* L'application : rapprocher les séances (par clé d'abord, par titre sinon) et écrire
   les trames normalisées. politique='completer' (défaut) ajoute à la suite ;
   'remplacer' substitue. Retourne le compte-rendu — la garde d'atterrissage le montre. */
function atP2AppliquerDeroules(level,chnum,json,politique){
  var cr=[], ch=chapitresData[level]&&chapitresData[level][chnum];
  if(!ch)return [{err:'chapitre introuvable'}];
  var ses=(json&&json.chapitre&&json.chapitre.seances)||[];
  ses.forEach(function(se){
    if(!se||!se.deroule||!Array.isArray(se.deroule.ecrans)||!se.deroule.ecrans.length)return;
    var sk=null,reels=ch.seances||{};
    Object.keys(reels).forEach(function(k){
      if(sk)return;
      if(se.cle&&reels[k]&&String(reels[k].cle||'')===String(se.cle))sk=k;
    });
    if(!sk)Object.keys(reels).forEach(function(k){
      if(sk)return;
      if(reels[k]&&String(reels[k].title||'').trim()===String(se.title||'').trim())sk=k;
    });
    if(!sk){cr.push({seance:se.title||se.cle,etat:'introuvable — rien écrit'});return;}
    var ecr=se.deroule.ecrans.map(function(e){
      return {id:atP2Uid(),act:String(e.act||''),dur:+e.dur||5,h:'',
        blocs:(Array.isArray(e.blocs)?e.blocs:[]).map(atP2NormaliserBloc).filter(Boolean),vues:0,rev:0};
    });
    var dst=reels[sk];
    var avait=dst.deroule&&Array.isArray(dst.deroule.ecrans)?dst.deroule.ecrans.length:0;
    if(avait&&politique!=='remplacer'){ dst.deroule.ecrans=dst.deroule.ecrans.concat(ecr); }
    else { dst.deroule={ecrans:ecr}; }
    if(se.cle&&!dst.cle)dst.cle=String(se.cle);
    try{ mjpcPutJson(FB+'/chapitres/'+level+'/'+chnum+'/seances/'+sk+'/deroule.json',dst.deroule,'P2 · trames injectées'); }catch(e){}
    cr.push({seance:dst.title||sk,etat:(avait?(politique==='remplacer'?'remplacé ('+avait+'→'+ecr.length+' écrans)':'complété ('+avait+'+'+ecr.length+' écrans)'):('créé ('+ecr.length+' écrans)'))});
  });
  return cr;
}

/* [P2-fin] Le branchement au cérémonial réel de l'injection — par enveloppes, base intacte.
   ① la garde d'atterrissage montre AUSSI les trames de déroulé avant le oui ;
   ② après confirmation, les trames s'appliquent (rapprochement clé puis titre),
      avec reprise à retardement si les données locales n'ont pas encore suivi. */
if(typeof chInjecter==='function'&&!window.__p2GardePose){
  window.__p2GardePose=true;
  var _p2GardeOrig=chInjecter;
  chInjecter=function(voie){
    _p2GardeOrig(voie);
    try{
      var json=window.CH&&CH.json; if(!json)return;
      var ses=((json.chapitre||{}).seances||[]).filter(function(s){return s&&s.deroule&&s.deroule.ecrans&&s.deroule.ecrans.length;});
      if(!ses.length)return;
      var n=0,iv=setInterval(function(){
        n++;
        var z=document.querySelector('.ch-atterrissage');
        if(z&&!z.__p2){ z.__p2=true; clearInterval(iv);
          z.innerHTML+='<br><b>Trames de déroulé</b> : '
            +ses.map(function(s){return '« '+atEsc(String(s.title||s.cle||''))+' » ('+s.deroule.ecrans.length+' écran'+(s.deroule.ecrans.length>1?'s':'')+')';}).join(' · ')
            +' — '+(voie==='remplacer'?'elles remplaceront l’existant.':'elles s’ajouteront à la suite si la séance en a déjà.');
        }
        if(n>25)clearInterval(iv);
      },200);
    }catch(e){}
  };
}
if(typeof chInjecterConfirme==='function'&&!window.__p2InjPose){
  window.__p2InjPose=true;
  var _p2InjOrig=chInjecterConfirme;
  chInjecterConfirme=function(voie){
    var json=window.CH&&CH.json, niveau=window.CH&&CH.niveau, idx=window.CH?CH.chapIdx:null;
    _p2InjOrig(voie);
    try{
      if(!json||!niveau)return;
      var aTrames=((json.chapitre||{}).seances||[]).some(function(s){return s&&s.deroule&&s.deroule.ecrans&&s.deroule.ecrans.length;});
      if(!aTrames)return;
      var titreVise=String((json.chapitre||{}).title||'')+(voie==='jumeau'?' (proposition)':'');
      var passe=function(essai){
        var t=chapitresData[niveau]||{}; var chnum=null;
        Object.keys(t).forEach(function(k){ if(chnum===null&&t[k]&&String(t[k].title||'')===titreVise)chnum=k; });
        if(chnum===null&&voie!=='jumeau'&&idx!=null&&t[idx])chnum=idx;
        if(chnum===null){ if(essai<4)setTimeout(function(){passe(essai+1);},3000); return; }
        var cr=atP2AppliquerDeroules(niveau,chnum,json,(voie==='remplacer'||voie==='jumeau')?'remplacer':'completer');   /* jumeau : la copie brute a deja pose des trames NON normalisees - remplacees par les propres */
        var manque=cr.some(function(x){return /introuvable/.test(String(x.etat||''));});
        try{
          var msg=document.getElementById('ch-msg');
          if(msg&&cr.length&&!msg.__p2fait){ msg.__p2fait=true;
            msg.innerHTML+='<br>Trames de déroulé : '+cr.map(function(x){return '« '+atEsc(String(x.seance||''))+' » '+atEsc(String(x.etat||''));}).join(' · ');
          }
        }catch(e){}
        if(manque&&essai<4)setTimeout(function(){passe(essai+1);},3000);
      };
      setTimeout(function(){passe(1);},2200);
    }catch(e){}
  };
}

/* [classe · copie au fil de l'eau] atDrEnrAuto protège la préparation (« en classe,
   rien ne remonte ») — mais LA COPIE de la classe doit, elle, suivre chaque geste :
   les réponses écrites en cours appartiennent au vécu de cette classe. Sans cela,
   la relecture après clôture et la future vue vécue seraient vides. */
function _drCopieAuto(){
  if(AT_DR_REGIME!=='classe'||!AT_DR_COURS)return;
  clearTimeout(AT_PONT._copT);
  AT_PONT._copT=setTimeout(function(){
    try{
      var ec=AT.edChap, sk=ATVUES.snum; if(!ec||!sk)return;
      var ch=chapitresData[ec.level][ec.chnum], sce=ch&&ch.seances&&ch.seances[sk];
      var cop=sce&&sce.deroule_joue&&sce.deroule_joue[AT_DR_COURS.classeSlug]; if(!cop)return;
      cop.ecrans=DR.dr_exporterTrame();
      mjpcPutJson(FIREBASE_BASE+'/site/'+ec.level+'/chapitres/'+ec.chnum+'/seances/'+sk
        +'/deroule_joue/'+AT_DR_COURS.classeSlug+'/ecrans.json', cop.ecrans,
        'Séance en classe — copie au fil de l’eau ('+AT_DR_COURS.classeNom+')');
    }catch(e){}
  },900);
}

/* [refusion à l'export] scinde() coupe pour la PROJECTION (« rien n'est jamais
   refusé ») : écran-fragment grp+suite, dur:0, blocs frag. L'artifice ne doit pas
   fuir dans la donnée : à l'export, les groupes se RECOLLENT — étapes concaténées,
   réponses recombinées (y compris un texte coupé, suiteRep), fiches réunies,
   durées rendues au père. La colonne, la copie et le récit voient l'écran ENTIER. */
function _drRefusionner(t){
  var out=[];
  for(var k=0;k<t.length;k++){
    var e=t[k];
    if(e&&e.suite&&out.length){
      var p=out[out.length-1];
      if(p.grp&&p.grp===e.grp){
        (e.blocs||[]).forEach(function(b){
          var d=p.blocs[p.blocs.length-1];
          if(d&&b&&d.frag&&d.frag===b.frag&&d.t===b.t){
            if(b.t==='consigne'){
              if(b.etapes&&b.etapes.length){ d.etapes=(d.etapes||[]).concat(b.etapes); }
              else if(b.txt&&b.txt!==d.txt){ d.txt=(d.txt||'')+' '+b.txt; }
              d.vues=(d.vues||0)+(b.vues||0);
            } else if(b.t==='question'){
              if(b.reps&&b.reps.length&&b.reps[0].suiteRep&&d.reps&&d.reps.length){
                var dr=d.reps[d.reps.length-1]; dr.r=(dr.r||'')+(b.reps[0].r||'');
                d.reps=d.reps.concat(b.reps.slice(1));
              } else {
                var pleines=(d.reps||[]).filter(function(r){return r&&(r.i||r.r);});
                d.reps=pleines.concat(b.reps||[]);
              }
              d.vues=(d.vues||0)+(b.vues||0);
            } else if(b.t==='fiche'){ d.corps=(d.corps||'')+(b.corps||''); d.vues=Math.max(d.vues||0,b.vues||0); }
            else { d.txt=((d.txt||'')+' '+(b.txt||b.q||'')).trim(); }
          } else p.blocs.push(b);
        });
        p.dur=(+p.dur||0)+(+e.dur||0);
        continue;
      }
    }
    out.push(e);
  }
  out.forEach(function(e){ delete e.grp; delete e.suite;
    (e.blocs||[]).forEach(function(b){ delete b.frag; delete b.suiteRep; }); });
  return out;
}

/* [relecture par classe] changer la classe dans la tête recharge Relecture/Papier
   sur LA COPIE DE CETTE CLASSE — les vues ne restent plus figées. */
document.addEventListener('change',function(ev){
  try{
    if(ev.target&&ev.target.id==='at-dr-classe'&&(ATVUES.vue==='relecture'||ATVUES.vue==='papier')){
      AT_PONT.classeVue=ev.target.value;                       /* la reconstruction recrée le sélecteur : la valeur survit ici */
      try{DR.__charge=null;}catch(e){} window.__pontRelec=false; atVuesPoser(ATVUES.vue);
      var s2=document.getElementById('at-dr-classe'); if(s2&&AT_PONT.classeVue)s2.value=AT_PONT.classeVue;
    }
  }catch(e){}
});

/* [reléve-en-dur · les trois branchements] la maquette n'a plus le dernier mot :
   PRENOMS viennent de LA CLASSE (initiales dérivées, collisions suffixées),
   DEBUT vient du créneau réel (tête en préparation, cours en classe),
   RELIRE vient du prochain créneau à venir. Posés à chaque chargement de trame
   et au changement du champ de début. Les défauts maquette restent le repli. */
function _drInitialesDe(nom){
  var p=String(nom||'').trim().split(/\s+/).filter(Boolean);
  if(!p.length)return '';
  if(p.length===1)return p[0].slice(0,2).toUpperCase();
  return (p[p.length-1][0]+p[0][0]).toUpperCase();   /* NOM Prénom → P+N ? non : prénom d'abord au moteur */
}
function _drPrenomsDeLaClasse(slug){
  try{
    var cl=classesData&&classesData[slug]; if(!cl)return null;
    var noms=(typeof extractEleves==='function')?extractEleves(cl):[];
    if(!noms||!noms.length)return null;
    var map={},pris={};
    noms.forEach(function(n){
      var s=String(n).trim(); if(!s)return;
      var mots=s.split(/\s+/);
      var prenom=mots.length>1?mots[mots.length-1]:mots[0];   /* « NOM Prénom » */
      var nomFam=mots.length>1?mots[0]:'';
      var ini=((prenom[0]||'')+(nomFam[0]||prenom[1]||'')).toUpperCase();
      var base=ini,k=2;
      while(pris[ini]){ ini=base+String(k++); }
      pris[ini]=1; map[ini]=prenom;
    });
    return Object.keys(map).length?map:null;
  }catch(e){return null;}
}
function _drProchainCreneau(){
  try{
    var s=document.getElementById('at-dr-creneau');
    var jours={0:'dimanche',1:'lundi',2:'mardi',3:'mercredi',4:'jeudi',5:'vendredi',6:'samedi'};
    var mois=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    var d=new Date(); d.setDate(d.getDate()+1);
    while(d.getDay()===0||d.getDay()===6)d.setDate(d.getDate()+1);   /* le prochain jour ouvré, à défaut d'EDT hebdo */
    return jours[d.getDay()]+' '+d.getDate()+' '+mois[d.getMonth()];
  }catch(e){return '';}
}
function _drPoserContexteMoteur(){
  try{
    var W=drWin(); if(!W)return;
    var slug=(AT_DR_COURS&&AT_DR_COURS.classeSlug)||(AT_PONT.classeVue)||((document.getElementById('at-dr-classe')||{}).value)||'';
    var chg=false;
    if(slug){
      var pren=_drPrenomsDeLaClasse(slug);
      /* une classe CHOISIE sans élèves extraits → panneau VIDE (honnête),
         jamais le trombinoscope de maquette pour une classe réelle */
      var neuf=pren||{};
      if(JSON.stringify(W.PRENOMS||{})!==JSON.stringify(neuf)){
        W.PRENOMS=neuf;
        W.ELEVES=Object.keys(neuf);   /* la PARTICIPATION lit son propre tableau ELEVES (en dur lui aussi) */
        chg=true;
      }
    }
    var deb=(AT_DR_COURS&&AT_DR_COURS.debut)||((document.getElementById('at-dr-debut')||{}).value)||'';
    if(/^\d\d:\d\d$/.test(deb)&&W.DEBUT!==deb){ W.DEBUT=deb; chg=true; try{W.horaires();}catch(e){} }
    var rel=_drProchainCreneau(); if(rel&&W.RELIRE!==rel){ W.RELIRE=rel; chg=true; }
    if(chg){ try{W.rendre();}catch(e){} try{W.majVues();}catch(e){} }   /* le pilote se re-rend : les boutons suivent */
  }catch(e){}
}
document.addEventListener('change',function(ev){
  try{ if(ev.target&&ev.target.id==='at-dr-debut')_drPoserContexteMoteur(); }catch(e){}
});

/* [participation au vif] la décharge cognitive du direct : un champ de frappe
   en tête du panneau — taper les initiales (ou le début du prénom) ouvre la
   fiche de l'élève ; les chiffres choisissent le motif ; la note se tape si le
   temps le permet ; Entrée pose ; le champ revient, vidé, prêt pour le suivant.
   La touche / (hors saisie) amène au champ. Tout à la souris reste possible. */
function _drVifInstaller(){
  try{
    var W=drWin(); if(!W||W.__vifPose)return;
    var part=W.document.getElementById('part'); if(!part)return;
    W.__vifPose=true;
    if(!W.__partPrecis&&typeof W.partAjoute==='function'){
      W.__partPrecis=true;
      var _pa=W.partAjoute;
      W.partAjoute=function(ini,type,note){
        var r=_pa.apply(W,arguments);
        try{
          var e=W.ECRANS[W.i], rv=(e.rev===undefined?0:e.rev);
          var b=e.blocs[Math.max(0,Math.min(e.blocs.length-1,rv-2))];
          var precis=b?(b.t==='question'?('question \u00ab '+String(b.q||'').slice(0,40)+' \u00bb')
                      :b.t==='fiche'?('fiche \u00ab '+String(b.titre||'').slice(0,40)+' \u00bb')
                      :b.t):null;
          var l=(W.PARTICIPATION[ini]||[]); var d=l[l.length-1];
          if(d&&precis&&d.ou&&d.ou.indexOf(String((b&&(b.q||b.titre))||'\u2400').slice(0,25))<0)d.ou=d.ou+' \u00b7 '+precis;   /* pas de doublon si l'endroit porte deja l'element */
          var v=W.document.getElementById('vif');
          if(v&&d){
            var t=W.document.getElementById('vif-dernier');
            if(!t){ t=W.document.createElement('div'); t.id='vif-dernier';
              t.setAttribute('style','margin:4px 0 6px;font-size:12px;color:#9c8b76;display:flex;gap:6px;align-items:center');
              v.parentNode.insertBefore(t,v.nextSibling); }
            t.innerHTML='pos\u00e9 : <b>'+ini+'</b> <span id="vif-x" style="cursor:pointer;color:#e8484c">\u2715 (Ctrl+Z)</span>';
            var did=d.id;
            var annule=function(){ try{ W.partRetire(ini,did); W.rendre(); t.innerHTML='annul\u00e9.'; setTimeout(function(){t.innerHTML='';},1500); W.__vifAnnule=null; }catch(e){} };
            W.document.getElementById('vif-x').onclick=annule;
            W.__vifAnnule=annule;
            clearTimeout(W.__vifDT); W.__vifDT=setTimeout(function(){ t.innerHTML=''; W.__vifAnnule=null; },6000);
          }
        }catch(e){}
        return r;
      };
    }
    var z=W.document.createElement('input');
    z.id='vif'; z.placeholder='⌨ initiales — puis 1/2/3, note, Entrée';
    z.setAttribute('style','width:100%;box-sizing:border-box;margin:0 0 6px;padding:4px 8px;'
      +'border:1px solid #4a3f33;border-radius:8px;background:#171310;color:#e8ddcf;font:inherit;font-size:13px');
    part.parentNode.insertBefore(z,part);
    sug=W.document.createElement('div'); sug.id='vif-sug';
    sug.setAttribute('style','margin:2px 0 6px;font-size:12px;color:#9c8b76;min-height:14px');
    part.parentNode.insertBefore(sug,part);
    /* la r\u00e9solution CANON (redaction_dugain_v3) : comparaison d'initiales SANS
       tenir compte de l'ordre des lettres \u2014 \u00ab TM \u00bb trouve \u00ab MT \u00bb. */
    function _trier(s){return String(s).toUpperCase().replace(/[^A-Z]/g,'').split('').sort().join('');}
    function candidats(t){
      t=String(t||'').trim(); if(t.length<2)return [];
      var E=W.ELEVES||[], P=W.PRENOMS||{}, tt=_trier(t), tu=t.toUpperCase();
      var meme=E.filter(function(x){return _trier(x)===tt;});
      if(meme.length)return meme;
      return E.filter(function(x){return x.indexOf(tu)===0
        ||String(P[x]||'').toUpperCase().indexOf(tu)===0;});
    }
    var sug;
    z.addEventListener('input',function(){
      var c=candidats(z.value);
      [].slice.call(W.document.querySelectorAll('#part span')).forEach(function(s){
        var ini=(s.textContent||'').replace(/\d+$/,'');
        s.style.outline=(c.indexOf(ini)>=0&&z.value)?'2px solid #c99a4e':'';
      });
      var P=W.PRENOMS||{};
      if(!z.value.trim()||z.value.trim().length<2){ sug.innerHTML=''; }
      else if(!c.length){ sug.innerHTML='<em style="color:#a23a3a">Aucun \u00e9l\u00e8ve avec ces initiales.</em>'; }
      else if(c.length===1){
        sug.innerHTML='\u2192 <b>'+(P[c[0]]||c[0])+'</b> (Entr\u00e9e)';
        W.ouvrirPart(c[0]); setTimeout(function(){var n2=W.document.getElementById('pnote');if(n2)n2.focus();},60);
      } else {
        sug.innerHTML='Plusieurs : '+c.map(function(x){
          return '<a href="#" data-vif-c="'+x+'" style="color:#c99a4e;margin-right:8px">'+(P[x]||x)+'</a>';}).join('');
        [].slice.call(sug.querySelectorAll('a')).forEach(function(a){
          a.onclick=function(ev){ ev.preventDefault(); W.ouvrirPart(a.getAttribute('data-vif-c'));
            setTimeout(function(){var n2=W.document.getElementById('pnote');if(n2)n2.focus();},60); };});
      }
    });
    z.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'){ var c=candidats(z.value);
        if(c.length){ W.ouvrirPart(c[0]); setTimeout(function(){var n2=W.document.getElementById('pnote');if(n2)n2.focus();},60); }
        ev.preventDefault(); }
      if(ev.key==='Escape'){ z.value=''; z.blur(); }
      if((ev.ctrlKey||ev.metaKey)&&String(ev.key).toLowerCase()==='z'){ if(W.__vifAnnule){W.__vifAnnule();ev.preventDefault();} }
    });
    if(!W.__vifTri){ W.__vifTri=setInterval(function(){ try{
      if(AT_DR_REGIME!=='classe')return;
      var pt=W.document.getElementById('part'); if(!pt||!pt.children.length)return;
      var sp=[].slice.call(pt.children);
      var muets=sp.filter(function(s){return !s.querySelector('.pastoral');});
      var voulu=muets.concat(sp.filter(function(s){return s.querySelector('.pastoral');}));
      var change=voulu.some(function(s,k){return pt.children[k]!==s;});
      if(change)voulu.forEach(function(s){pt.appendChild(s);});
      sp.forEach(function(s){ s.style.color=s.querySelector('.pastoral')?'':'#e0a84e'; });
    }catch(e){} },900); }
    /* dans la fiche ouverte : 1..9 = motif ; Entrée dans la note = motif défaut (le 1er) avec la note */
    W.document.addEventListener('keydown',function(ev){
      var pop=W.document.getElementById('ppop');
      if(!pop||!pop.classList.contains('on'))return;   /* aucun raccourci d'accès au champ : la touche sera CELLE DE PAUL (/, ² et F2 retirés, 22/08) */
      var bts=[].slice.call(pop.querySelectorAll('button.m'));
      if(/^[1-9]$/.test(ev.key)){
        var dansNote=(ev.target&&ev.target.id==='pnote');
        var horsSaisie=!/input|textarea/i.test((ev.target&&ev.target.tagName)||'');
        /* dans la note VIDE, les chiffres choisissent le motif ; d\u00e8s qu'un texte est
           commenc\u00e9, ils redeviennent des caract\u00e8res (\u00ab 2 propositions \u00bb reste \u00e9crivable) */
        if(horsSaisie||(dansNote&&!ev.target.value)){
          var b=bts[+ev.key-1]; if(b){ b.click(); z.value=''; setTimeout(function(){z.focus();},60); ev.preventDefault(); } return;
        }
      }
      if(ev.key==='Enter'&&ev.target&&ev.target.id==='pnote'){
        var b1=bts[0]; if(b1){ b1.click(); z.value=''; setTimeout(function(){z.focus();},60); ev.preventDefault(); }
      }
      if(ev.key==='Escape'){ pop.classList.remove('on'); z.value=''; z.focus(); }
    },true);
  }catch(e){}
}

/* [vif · accès d'un seul appui] ² ou F2, DEPUIS N'IMPORTE OÙ (page ou cadre),
   amène le curseur dans le champ des initiales — zéro clic, zéro visée. */
function _drVifAller(ev){
  try{
    if(AT_DR_REGIME!=='classe')return;
    var W=drWin(), z=W&&W.document.getElementById('vif');
    if(!z||z.style.display==='none')return;
    z.focus(); z.select();
    if(ev)ev.preventDefault();
  }catch(e){}
}
document.addEventListener('keydown',function(ev){
  if(ev.key==='²'||ev.key==='F2')_drVifAller(ev);
},true);

/* le boot du montage : rappeler l'onglet retenu */
atVuesRappeler();
/* ═══════════ fin [PONT-É2] ═══════════ */

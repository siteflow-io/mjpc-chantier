# ── Harnais d'INVARIANTS : ce qui doit être vrai après CHAQUE action, quoi qu'on fasse ──
INV = r"""
window.__inv=function(){
  var pb=[];
  var A='apres aecrire fige sel spot-on cible glisse suite'.split(' ');
  // 1 · aucune classe d'AFFICHAGE ni repère technique enregistré dans les DONNÉES
  var s=JSON.stringify(ECRANS)+JSON.stringify(ANNOT||{});
  A.forEach(function(c){ if(new RegExp('class=\\\\"[^\\"]*\\\\b'+c+'\\\\b').test(s)) pb.push('classe « '+c+' » enregistrée dans les données'); });
  ['data-s','data-bloc','data-sous','data-p','contenteditable','data-fk'].forEach(function(a){
    if(s.indexOf(a)>=0) pb.push('repère technique « '+a+' » enregistré dans les données'); });
  // 2 · le mot « suite » n'existe pas dans les contenus
  if(/\(suite\)/.test(s)) pb.push('« (suite) » resté dans les contenus');
  // 3 · compteurs de dévoilement cohérents
  ECRANS.forEach(function(e,n){
    if(e.rev!==undefined && (e.rev<0 || e.rev>e.blocs.length+1)) pb.push('écran '+n+' : rev hors bornes ('+e.rev+')');
    e.blocs.forEach(function(b,j){ var m=elems(b);
      if((b.vues||0)>m && m>0) pb.push('écran '+n+' bloc '+j+' : vues('+b.vues+') > éléments('+m+')'); });
  });
  // 4 · toute suite appartient à un groupe, et suit un écran du même groupe
  ECRANS.forEach(function(e,n){
    if(e.suite){ if(!e.grp) pb.push('écran '+n+' : suite sans groupe');
      else { var p=n-1; while(p>=0&&ECRANS[p].grp!==e.grp)p--;
             if(p<0) pb.push('écran '+n+' : suite orpheline'); } }
  });
  // 5 · concordance PILOTAGE / TABLEAU : ce qui est grisé chez le prof est absent chez l'élève
  var ficheOuv=!!(ficheOuverte&&ficheOuverte[0]===i);
  if(win&&!win.closed&&!gele){
    var t=win.document.getElementById('t');
    if(t){
      var pil=[].slice.call(document.querySelectorAll('#contenu [data-s]'));
      pil.forEach(function(el){
        if(el.classList.contains('f-page'))return;            /* conteneur de fiche : pas un objet d'écran */
        if(ficheOuv && el.dataset.s.split('.').length<3)return; /* fiche ouverte : le tableau montre la fiche */
        if(el.dataset.s.split('.')[0]!==String(i))return;        /* seul l'écran courant est comparable */
        var cle=el.dataset.s, gris=el.classList.contains('apres');
        var chez=t.querySelector('[data-s="'+cle+'"]');
        var vu=!!chez && chez.style.visibility!=='hidden' && chez.style.display!=='none';
        if(gris && vu) pb.push('« '+cle+' » grisé chez le prof mais VISIBLE au tableau');
        if(!gris && !vu && !el.classList.contains('fige') && el.offsetParent!==null)
          pb.push('« '+cle+' » net chez le prof mais ABSENT du tableau');
      });
    }
  }
  // 6 · aucune réponse perdue : les initiales restent des lettres
  ECRANS.forEach(function(e,n){ e.blocs.forEach(function(b,j){ (b.reps||[]).forEach(function(r,k){
    if(r.i && !/^[A-ZÀ-Þ'-]{1,4}$/.test(r.i)) pb.push('écran '+n+' réponse '+k+' : initiales douteuses « '+r.i+' »'); }); }); });
  // 7 · la vignette de l'écran courant reflète l'écran du milieu
  var mini=document.getElementById('mini'+i), mil=document.getElementById('contenu');
  if(mini&&mil&&!(ficheOuverte&&ficheOuverte[0]===i)){
    var a=mini.innerText.replace(/\s+/g,' ').trim().slice(0,80);
    var c=mil.innerText.replace(/\s+/g,' ').trim().slice(0,80);
    if(a!==c) pb.push('vignette désynchronisée\n      vignette: '+a+'\n      milieu  : '+c);
  }
  return pb;
};
"""

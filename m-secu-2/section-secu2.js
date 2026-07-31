/* ═══════════════════════════════════════════════════════════════════════════
   M-SÉCU-2 — LA VÉRIFICATION PAR EMPREINTE (section commune aux neuf apps)
   Le login élève vérifie l'EMPREINTE posée par le site (M-SÉCU-1) au lieu du
   clair. PENDANT CE MORCEAU le clair reste un REPLI : entrée non migrée, crypto
   absente (http local), ou empreinte discordante (code régénéré sans clé —
   compté : c'est la liste de ce qui doit être régénéré avant le 3e temps).
   AUCUN ÉLÈVE DEHORS. La porte professeur accepte : le code (clair effectif de
   l'app, dur + surcharge, INCHANGÉ jusqu'au 3e temps) · la CLÉ de chiffrement
   (validée par le canari du coffre) · l'empreinte prof posée au hub.
   La clé est LUE depuis le localStorage commun (même origine que le site) et
   n'est JAMAIS envoyée. Lecture seule ici : cette section n'écrit rien au hub.
   ═══════════════════════════════════════════════════════════════════════════ */
var MJPC_SECU2={hub:"https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app",discordances:0,voies:{empreinte:0,clair:0}};
window.MJPC_SECU2_DIAG=MJPC_SECU2; /* consultable en console : voies empruntées, discordances à régénérer */

/* L'ENTRÉE de /codes pour une clé sanMJPC — les QUATRE tolérances historiques de
   codeAttendu, prolongées : on retourne l'entrée entière (code/chiffre/sel/empreinte),
   plus seulement le clair. Chaîne nue (vestiges ELIO-*) → {code:chaîne}. */
function mjpcEntreeCode(codesData,cle){
  if(!codesData)return null;
  var e=codesData[cle];
  if(typeof e==="string")return {code:String(e)};
  if(e&&e.code!==undefined&&e.code!==null)return e;
  if(e&&(e.empreinte||e.chiffre))return e; /* préfiguration du 3e temps : entrée sans clair */
  var ks=Object.keys(codesData);
  for(var i=0;i<ks.length;i++){
    var v=codesData[ks[i]];
    if(v&&v.name&&sanMJPC(v.name)===cle)return (typeof v==="string")?{code:String(v)}:v;
    if(sanMJPC(ks[i])===cle)return (typeof v==="string")?{code:String(v)}:v;
  }
  return null;
}
/* La vérification : empreinte prioritaire, repli clair. → Promise {ok, voie} */
function mjpcVerifierCode(entree,saisie){
  if(!entree)return Promise.resolve({ok:false,voie:"absent"});
  var clairOk=(entree.code!==undefined&&entree.code!==null)&&String(entree.code)===String(saisie);
  if(entree.empreinte&&entree.sel&&mjpcCryptoDispo()){
    return mjpcEmpreinte(String(saisie),entree.sel).then(function(h){
      if(h===entree.empreinte){MJPC_SECU2.voies.empreinte++;return {ok:true,voie:"empreinte"};}
      if(clairOk){
        MJPC_SECU2.discordances++;MJPC_SECU2.voies.clair++;
        try{console.warn("MJPC-SECU2 : empreinte discordante pour une entr\u00e9e \u2014 repli clair accept\u00e9. Ce code doit \u00eatre r\u00e9g\u00e9n\u00e9r\u00e9 AVEC la cl\u00e9 avant le retrait du clair (3e temps).");}catch(e){}
        return {ok:true,voie:"clair-discordant"};
      }
      return {ok:false,voie:"empreinte"};
    },function(){ /* échec local du calcul : repli clair — jamais un élève dehors sur une panne locale */
      if(clairOk){MJPC_SECU2.voies.clair++;}
      return {ok:clairOk,voie:"clair"};
    });
  }
  if(clairOk){MJPC_SECU2.voies.clair++;return Promise.resolve({ok:true,voie:"clair"});}
  return Promise.resolve({ok:false,voie:"clair"});
}
/* Lectures REST (le hub est le même pour toutes ; LECTURE SEULE) */
function mjpcSecuLireJson(chemin){
  return fetch(MJPC_SECU2.hub+chemin+".json").then(function(r){return r.ok?r.json():null;},function(){return null;});
}
/* La clé locale, validée contre le canari du coffre (AES-GCM authentifié) */
function mjpcValiderCleLocale(secret){
  if(!secret||!mjpcCryptoDispo())return Promise.resolve(false);
  var cle;
  return mjpcDeriverCle(secret).then(function(k){cle=k;return mjpcSecuLireJson("/site/config/coffreCanari");})
    .then(function(canari){
      if(!canari)return false;
      return mjpcDechiffrer(cle,canari).then(function(t){return t==="MJPC-CANARI|coffre-v1";},function(){return false;});
    });
}
/* La porte professeur à trois voies. profCodes = les codes EFFECTIFS de l'app
   (dur + surcharge éventuelle) — leur régime ne change pas à ce morceau. */
function mjpcVerifierProf(saisie,profCodes){
  if((profCodes||[]).map(String).indexOf(String(saisie))>=0)return Promise.resolve({ok:true,voie:"code"});
  var s=String(saisie||"");
  var parCle=(s.length>=8&&mjpcCryptoDispo())
    ? mjpcValiderCleLocale(s).then(function(ok){
        if(ok){try{localStorage.setItem("mjpc_coffre_secret",s);}catch(e){}return {ok:true,voie:"cle"};}
        return null;})
    : Promise.resolve(null);
  return parCle.then(function(r){
    if(r)return r;
    if(!mjpcCryptoDispo())return {ok:false,voie:"code"};
    return mjpcSecuLireJson("/site/config/profEmpreintes").then(function(fiches){
      if(!fiches||!fiches.length)return {ok:false,voie:"code"};
      return Promise.all(fiches.map(function(f){
        return mjpcEmpreinte(String(saisie),f.sel).then(function(h){return h===f.empreinte;},function(){return false;});
      })).then(function(rs){return {ok:rs.indexOf(true)>=0,voie:"empreinte-prof"};});
    });
  });
}
/* La clé est-elle déjà mémorisée ET valide sur cet appareil ? */
function mjpcProfDejaLa(){
  var sec=null;try{sec=localStorage.getItem("mjpc_coffre_secret");}catch(e){}
  if(!sec)return Promise.resolve(false);
  return mjpcValiderCleLocale(sec);
}
/* Oubli local : le même geste que sur le site, atteignable depuis l'app */
function mjpcOublierCleIci(){
  try{localStorage.removeItem("mjpc_coffre_secret");}catch(e){}
  var b=document.getElementById("mjpc-secu2-profbtn");if(b)b.remove();
}
/* Le bandeau du portail : visible SEULEMENT si la clé mémorisée est valide.
   Libellé sans ambiguïté (ce n'est pas une connexion automatique) + l'oubli
   atteignable ICI — un poste de salle laissé avec la clé est une porte ouverte. */
/* Par défaut, ouvrir = émettre la session professeur STANDARD (celle que le
   shunt §8 de chaque app sait lire) puis recharger — la clé validée par le
   canari est l'autorité ; la session émise est identique à celle du site. */
function mjpcOuvrirSessionProfParDefaut(){
  var s={is_prof:true,display:"Professeur",ts:Date.now()};
  try{sessionStorage.setItem("mjpc_eleve",JSON.stringify(s));}catch(e){}
  try{localStorage.setItem("mjpc_eleve",JSON.stringify(s));}catch(e){}
  location.reload();
}
function mjpcMonterBoutonProf(ouvrirSessionProf){
  if(!ouvrirSessionProf)ouvrirSessionProf=mjpcOuvrirSessionProfParDefaut;
  mjpcProfDejaLa().then(function(ok){
    if(!ok||document.getElementById("mjpc-secu2-profbtn"))return;
    var d=document.createElement("div");d.id="mjpc-secu2-profbtn";
    d.innerHTML='<span class="mjpc-secu2-txt">La cl\u00e9 de chiffrement est m\u00e9moris\u00e9e sur cet appareil.</span>'
      +'<button type="button" class="mjpc-secu2-b" id="mjpc-secu2-ouvrir">Ouvrir la session professeur</button>'
      +'<button type="button" class="mjpc-secu2-b sec" id="mjpc-secu2-oublier">Oublier la cl\u00e9 sur cet appareil</button>';
    document.body.appendChild(d);
    document.getElementById("mjpc-secu2-ouvrir").onclick=function(){
      var b=document.getElementById("mjpc-secu2-profbtn");if(b)b.remove();
      ouvrirSessionProf();
    };
    document.getElementById("mjpc-secu2-oublier").onclick=mjpcOublierCleIci;
  });
}
function mjpcRetirerBoutonProf(){var b=document.getElementById("mjpc-secu2-profbtn");if(b)b.remove();}
/* Auto-montage : au chargement, si aucune session MJPC n'est en cours (le
   portail est donc à l'écran) et que la clé mémorisée est valide, le bandeau
   paraît. Identique dans les neuf : aucune dépendance au DOM de l'app. */
if(typeof window!=="undefined"&&window.addEventListener){
  window.addEventListener("DOMContentLoaded",function(){
    var s=null;try{s=lireSessionMJPC();}catch(e){}
    if(s)return;
    mjpcMonterBoutonProf();
  });
}
/* ═══ fin M-SÉCU-2 ═══ */

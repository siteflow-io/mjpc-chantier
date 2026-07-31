#!/usr/bin/env python3
# ══ M-SÉCU-5 — index.html : lire ce qui a été retiré (affichage, compteur,
#    génération, impression, ET le login élève du site — même trou, sourcé) ══
import re
s=open("index.base.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    s=s.replace(a,n)

# ── 1. _eleveCode (valeur connue : clair OU cache) + _eleveAUnCode (booléen : clair OU chiffré) ──
sub("""function _eleveCode(nom){var k=san(nom);return (codesData[k]&&codesData[k].code)||'';}""",
"""/* M-SÉCU-5 : après le retrait du clair, deux questions distinctes.
   _eleveAUnCode : « cet élève a-t-il un code ? » — clair OU chiffré (répare le
   compteur, la colonne et le bouton « Générer N manquants »).
   _eleveCode : « quel est ce code, si on le CONNAÎT ici ? » — clair résiduel ou
   cache des déchiffrements ; '' sinon (l'impression et la fiche le consomment). */
function _eleveAUnCode(nom){var k=san(nom);var e=codesData[k];return !!(e&&(e.code||e.chiffre));}
function _eleveCode(nom){
  var k=san(nom);var e=codesData[k];if(!e)return '';
  if(e.code!==undefined&&e.code!==null&&e.code!=='')return String(e.code);
  if(SECU.cache&&SECU.cache[k])return String(SECU.cache[k]);
  return '';
}""")

# ── 2. le compteur ──
sub("""var sansCode=names.filter(function(n){return !_eleveCode(n);}).length;""",
"""var sansCode=names.filter(function(n){return !_eleveAUnCode(n);}).length;""")

# ── 3. le rendu de la ligne : booléen + conteneur à id pour le remplissage PAR LIGNE ──
sub("""names.forEach(function(nom,i){var code=_eleveCode(nom);var aff=secuCodeAffiche(nom);
    var codeHtml=code?(aff===null?'<span class="secu-masque">\\u273b\\u273b\\u273b\\u273b</span>':escapeHtml(aff)):'<span class="el-nocode">\\u2014</span>';
    html+='<div class="el-row"><span class="el-num">'+(i+1)+'</span><span class="el-name">'+escapeHtml(nom)+'</span><span class="el-code">'+codeHtml+'</span>""",
"""names.forEach(function(nom,i){var code=_eleveAUnCode(nom);var aff=secuCodeAffiche(nom);
    var codeHtml=code?(aff===null?'<span class="secu-masque">\\u273b\\u273b\\u273b\\u273b</span>':escapeHtml(aff)):'<span class="el-nocode">\\u2014</span>';
    html+='<div class="el-row"><span class="el-num">'+(i+1)+'</span><span class="el-name">'+escapeHtml(nom)+'</span><span class="el-code" id="code-aff-'+san(nom)+'">'+codeHtml+'</span>""")

# ── 4. la boucle « Générer N manquants » ──
sub("""if(!_eleveCode(nom)&&!(SECU.cache&&SECU.cache[san(nom)])&&!(codesData[san(nom)]&&codesData[san(nom)].chiffre))""",
"""if(!_eleveAUnCode(nom))""")

# ── 5. secuCodeAffiche : reconnaît le chiffré, DÉCHIFFRE À LA VOLÉE, remplit LA LIGNE seule.
#      (Mieux que le redraw différé : pas de redessin de section, pas de bataille
#       avec une saisie, et si l'écran a changé le remplissage tombe dans le vide.) ──
sub("""function secuCodeAffiche(nom){
  var k=san(nom);var e=codesData[k];
  if(!e||!e.code)return '';
  if(!SECU.valide)return null; /* null = masqué (l'appelant affiche ✻✻✻✻) */
  if(e.chiffre&&SECU.cache[k])return SECU.cache[k];
  return e.code;
}""",
"""function secuCodeAffiche(nom){
  /* M-SÉCU-5 : un code existe s'il a un clair (résiduel) OU un chiffré. Avec la
     clé : cache d'abord, clair résiduel ensuite, sinon DÉCHIFFREMENT À LA VOLÉE
     qui remplit la ligne seule (id code-aff-<k>) quand il aboutit — jamais de
     redessin de section, jamais de perte de saisie. Sans la clé : masqué. */
  var k=san(nom);var e=codesData[k];
  if(!e||(!e.code&&!e.chiffre))return '';
  if(!SECU.valide)return null; /* null = masqué (l'appelant affiche ✻✻✻✻) */
  if(SECU.cache[k])return SECU.cache[k];
  if(e.code!==undefined&&e.code!==null&&e.code!==''){SECU.cache[k]=String(e.code);return SECU.cache[k];}
  SECU._enCours=SECU._enCours||{};
  if(e.chiffre&&!SECU._enCours[k]&&SECU.cle){
    SECU._enCours[k]=true;
    mjpcDechiffrer(SECU.cle,e.chiffre).then(function(clair){
      SECU.cache[k]=String(clair);delete SECU._enCours[k];
      var sp=document.getElementById('code-aff-'+k);
      if(sp)sp.innerHTML=escapeHtml(SECU.cache[k]);
    },function(){
      delete SECU._enCours[k];
      var sp=document.getElementById('code-aff-'+k);
      if(sp)sp.innerHTML='<span class="el-nocode" title="Illisible avec cette cl\\u00e9">?</span>';
    });
  }
  return null; /* masqué le temps du calcul ; la ligne se remplit seule */
}""")

# ── 6. _putCode : le clair ne s'écrit PLUS ──
sub("""    var rec={code:code,name:nom,classe:slug,createdAt:Date.now(),chiffre:res[0],sel:sel,empreinte:res[1]};""",
"""    /* M-SÉCU-5 : le champ code (clair) ne s'écrit PLUS — le retrait de M-SÉCU-3
       est définitif. Le cache local garde le clair pour l'affichage immédiat. */
    var rec={name:nom,classe:slug,createdAt:Date.now(),chiffre:res[0],sel:sel,empreinte:res[1]};""")

# ── 7. LE LOGIN ÉLÈVE DU SITE : par EMPREINTE (même trou que l'affichage, sourcé au rapport) ──
sub("""    if(!found.code||found.code!==code){status.textContent='';err.textContent='Ce code ne correspond pas. V\\u00e9rifie-le, ou vois avec moi en classe.';setTimeout(function(){err.textContent='';},4000);return;}
    _loginEleveFound(found,status);""",
"""    /* M-SÉCU-5 : le code se vérifie par EMPREINTE (comme dans les neuf apps) —
       la comparaison au clair ne pouvait plus jamais réussir après le retrait. */
    _secuVerifCodeEleveSite(found,code).then(function(ok){
      if(!ok){status.textContent='';err.textContent='Ce code ne correspond pas. V\\u00e9rifie-le, ou vois avec moi en classe.';setTimeout(function(){err.textContent='';},4000);return;}
      _loginEleveFound(found,status);
    });""")
ANCRE_LOGIN="function loginAsProf(){"
VERIF_ELEVE="""/* M-SÉCU-5 : la vérification du code élève au portail du site — empreinte
   prioritaire (aucune clé requise), clair résiduel puis cache en replis. */
function _secuVerifCodeEleveSite(found,saisie){
  var k=san(found.nom);var e=codesData[k];
  if(!e)return Promise.resolve(false);
  if(e.empreinte&&e.sel&&typeof mjpcCryptoDispo==='function'&&mjpcCryptoDispo()){
    return mjpcEmpreinte(String(saisie),e.sel).then(function(h){
      if(h===e.empreinte)return true;
      return (e.code!==undefined&&e.code!==null&&String(e.code)===String(saisie));
    },function(){return (e.code!==undefined&&e.code!==null&&String(e.code)===String(saisie));});
  }
  if(e.code!==undefined&&e.code!==null)return Promise.resolve(String(e.code)===String(saisie));
  if(SECU.cache&&SECU.cache[k])return Promise.resolve(String(SECU.cache[k])===String(saisie));
  return Promise.resolve(false);
}
function loginAsProf(){"""
sub(ANCRE_LOGIN,VERIF_ELEVE,1)

# ── 8. l'impression : la fenêtre s'ouvre DANS le geste, les codes se déchiffrent, puis la page s'écrit ──
sub("""function _printCodesClasse(slug){if(!secuExigeCle())return;/* M-SÉCU-1 : l'impression suit l'écran (Q6) */var names=extractEleves(classesData[slug],[]);var cl=classesData[slug]||{};var rows=names.map(function(nom){return '<tr><td>'+escapeHtml(nom)+'</td><td class="c">'+(_eleveCode(nom)||'\\u2014')+'</td></tr>';}).join('');var w=window.open('','_blank');if(!w)return;""",
"""function _printCodesClasse(slug){if(!secuExigeCle())return;/* M-SÉCU-1 : l'impression suit l'écran (Q6).
  M-SÉCU-5 : la fenêtre s'ouvre DANS le geste (le bloqueur de fenêtres exige le clic),
  les codes chiffrés se déchiffrent d'abord, la page s'écrit ensuite — jamais de puces. */
  var names=extractEleves(classesData[slug],[]);var cl=classesData[slug]||{};
  var w=window.open('','_blank');if(!w)return;
  w.document.write('<html><body style="font-family:sans-serif;padding:24px">Pr\\u00e9paration des codes\\u2026</body></html>');
  var prep=names.map(function(nom){
    var k=san(nom);var e=codesData[k];
    if(!e||!e.chiffre||SECU.cache[k]||(e.code!==undefined&&e.code!==null&&e.code!==''))return Promise.resolve();
    return mjpcDechiffrer(SECU.cle,e.chiffre).then(function(clair){SECU.cache[k]=String(clair);},function(){});
  });
  Promise.all(prep).then(function(){
  var rows=names.map(function(nom){return '<tr><td>'+escapeHtml(nom)+'</td><td class="c">'+(escapeHtml(_eleveCode(nom))||'\\u2014')+'</td></tr>';}).join('');
  w.document.open();""")
# refermer le then : la fin réelle de la fonction est `catch(e){}},300);}`
i=s.index("Promise.all(prep).then(function(){")
FIN="catch(e){}},300);}"
j=s.index(FIN,i)
s=s[:j]+"catch(e){}},300);});}"+s[j+len(FIN):]

# ── 9. le bouton « Retirer les codes en clair » quand il ne reste rien : annonce, sans action ──
sub("""    var res=[
      '<div class="cm-sub"><b>'+aTraiter.length+'</b> codes portent encore leur clair \\u2014 tous v\\u00e9rifi\\u00e9s conformes (chiffr\\u00e9s et v\\u00e9rifiables).',""",
"""    if(!aTraiter.length){
      _showConsoleModal('Retirer les codes en clair',
        '<div class="cm-sub"><b>0</b> code ne porte encore son clair \\u2014 il n\\u2019y a rien \\u00e0 retirer.'
        +(dejaFaits?('<br>'+dejaFaits+' d\\u00e9j\\u00e0 sans clair.'):'')
        +(vestiges.length?('<br>'+vestiges.length+' entr\\u00e9e(s) ancienne(s) (hors \\u00e9l\\u00e8ves) laiss\\u00e9e(s) telles quelles.'):'')
        +'</div>',
        [{label:'Fermer',cls:'primary'}]);
      return;
    }
    var res=[
      '<div class="cm-sub"><b>'+aTraiter.length+'</b> codes portent encore leur clair \\u2014 tous v\\u00e9rifi\\u00e9s conformes (chiffr\\u00e9s et v\\u00e9rifiables).',""")

# ── 10. pastille ──
sub('var APP_VERSION="8.10.0"','var APP_VERSION="8.10.1"')

open("index.staging.html","w",encoding='utf-8').write(s)
print(f"index.staging.html écrit ({len(s)} car.)")

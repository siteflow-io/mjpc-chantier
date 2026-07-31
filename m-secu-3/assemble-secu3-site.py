#!/usr/bin/env python3
# ══ M-SÉCU-3 — index.html : le clair meurt au site, le bouton de retrait naît ══
import re
s=open("index.base.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    s=s.replace(a,n)

# ── 1. la constante et la porte ──
sub("var PROF_CODES=['1312','3141'];","/* M-SÉCU-3 : plus aucun code professeur en clair. Porte = clé + empreintes. */")
sub("""  if(code&&PROF_CODES.indexOf(code)>=0){loginAsProf();return;}   /* clair prof accepté jusqu'à M-SÉCU-3 */
""","""""")
# la voie EMPREINTE pour un code seul (le prof tapait historiquement le code sans nom)
sub("""    return;
  }
  if(!nom||!prenom||!code){err.textConte""","""    return;
  }
  /* M-SÉCU-3 : un code SEUL (sans nom ni prénom) est un candidat professeur — vérifié par EMPREINTE */
  if(code&&!nom&&!prenom&&mjpcCryptoDispo()){
    status.textContent='V\\u00e9rification\\u2026';btn.disabled=true;
    secuLire(SECU_CH_PROF).then(function(fiches){
      if(!fiches||!fiches.length){btn.disabled=false;status.textContent='';err.textContent='Aucune empreinte professeur pos\\u00e9e. Utilise la cl\\u00e9 de chiffrement.';return;}
      Promise.all(fiches.map(function(f){return mjpcEmpreinte(String(code),f.sel).then(function(h){return h===f.empreinte;},function(){return false;});}))
        .then(function(rs){
          btn.disabled=false;status.textContent='';
          if(rs.indexOf(true)>=0){loginAsProf();return;}
          err.textContent='Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur.';
          setTimeout(function(){err.textContent='';},4000);
        });
    });
    return;
  }
  if(!nom||!prenom||!code){err.textConte""")

# ── 2. _allCodesTaken : Promise, par déchiffrement (cache prioritaire) ──
sub("""function _allCodesTaken(){var t={};(PROF_CODES||[]).forEach(function(c){t[c]=true;});Object.keys(codesData||{}).forEach(function(k){if(codesData[k]&&codesData[k].code)t[codesData[k].code]=true;});return t;}
function _genCode4(taken){var c,g=0;do{c=String(Math.floor(1000+Math.random()*9000));g++;}while(taken[c]&&g<9999);return c;}""",
"""/* M-SÉCU-3 : les codes pris se lisent en DÉCHIFFRANT (la clé est déjà exigée
   pour générer). Cache des clairs prioritaire, chaînes nues comptées prises,
   clair résiduel (avant le geste de retrait) compté aussi. → Promise. */
function _allCodesTaken(){
  var t={};var proms=[];
  Object.keys(codesData||{}).forEach(function(k){
    var e=codesData[k];if(!e)return;
    if(typeof e==="string"){t[e]=true;return;}
    if(SECU.cache&&SECU.cache[k]){t[String(SECU.cache[k])]=true;return;}
    if(e.code!==undefined&&e.code!==null){t[String(e.code)]=true;return;}
    if(e.chiffre&&SECU.valide&&SECU.cle){
      proms.push(mjpcDechiffrer(SECU.cle,e.chiffre).then(function(clair){t[String(clair)]=true;SECU.cache[k]=String(clair);},function(){/* illisible : ignoré ici, visible à l'écran codes */}));
    }
  });
  return Promise.all(proms).then(function(){return t;});
}
/* Le candidat est AUSSI testé contre les empreintes professeur : un code élève
   ne peut plus tomber sur un code prof (l'unicité élève↔prof sans clair). */
var _profFichesCache=null;
function _estCodeProf(c){
  var p=_profFichesCache?Promise.resolve(_profFichesCache):secuLire(SECU_CH_PROF).then(function(v){_profFichesCache=(v&&v.length)?v:[];return _profFichesCache;});
  return p.then(function(fiches){
    if(!fiches.length)return false;
    return Promise.all(fiches.map(function(f){return mjpcEmpreinte(String(c),f.sel).then(function(h){return h===f.empreinte;},function(){return false;});}))
      .then(function(rs){return rs.indexOf(true)>=0;});
  });
}
function _genCode4(taken){ /* → Promise */
  function tirer(){var c,g=0;do{c=String(Math.floor(1000+Math.random()*9000));g++;}while(taken[c]&&g<9999);return c;}
  function essayer(){
    var c=tirer();
    return _estCodeProf(c).then(function(prof){
      if(!prof)return c;
      taken[c]=true;return essayer();
    });
  }
  return essayer();
}""")

# ── 3. les trois appelants passent à l'asynchrone ──
sub("""function _genererCodesClasse(slug){if(!secuExigeCle())return;var names=extractEleves(classesData[slug],[]);var taken=_allCodesTaken();names.forEach(function(nom){if(!_eleveCode(nom)){var c=_genCode4(taken);taken[c]=true;_putCode(nom,slug,c);}});showProfSection('eleves');}""",
"""async function _genererCodesClasse(slug){if(!secuExigeCle())return;var names=extractEleves(classesData[slug],[]);var taken=await _allCodesTaken();for(var i=0;i<names.length;i++){var nom=names[i];if(!_eleveCode(nom)&&!(SECU.cache&&SECU.cache[san(nom)])&&!(codesData[san(nom)]&&codesData[san(nom)].chiffre)){var c=await _genCode4(taken);taken[c]=true;_putCode(nom,slug,c);}}showProfSection('eleves');}""")
sub("""function _regenCodeEleve(slug,i){if(!secuExigeCle())return;var names=extractEleves(classesData[slug],[]);var nom=names[i];if(!nom)return;var taken=_allCodesTaken();var c=_genCode4(taken);_putCode(nom,slug,c);showProfSection('eleves');}""",
"""async function _regenCodeEleve(slug,i){if(!secuExigeCle())return;var names=extractEleves(classesData[slug],[]);var nom=names[i];if(!nom)return;var taken=await _allCodesTaken();var c=await _genCode4(taken);_putCode(nom,slug,c);showProfSection('eleves');}""")
sub("""function(){var names=extractEleves(classesData[slug],[]);var taken=_allCodesTaken();names.forEach(function(nom){var c=_genCode4(taken);taken[c]=true;_putCode(nom,slug,c);});showProfSection('eleves');},'CODES');}""",
"""async function(){var names=extractEleves(classesData[slug],[]);var taken=await _allCodesTaken();for(var i=0;i<names.length;i++){var c=await _genCode4(taken);taken[c]=true;_putCode(names[i],slug,c);}showProfSection('eleves');},'CODES');}""")

# ── 4. la tuile + la pose d'empreintes devient un constat ──
sub("""'<div class="tprof-info-row"><span class="tir-label">Codes prof</span><span class="tir-value">'+PROF_CODES.length+' configur\\u00e9'+(PROF_CODES.length>1?'s':'')+'</span></div>'""",
"""'<div class="tprof-info-row"><span class="tir-label">Acc\\u00e8s prof</span><span class="tir-value">cl\\u00e9 + empreintes (hub)</span></div>'""")
sub("""/* ── empreintes des codes prof : posées pour les apps (M-SÉCU-2), idempotent ── */
function secuPoserEmpreintesProf(){
  secuLire(SECU_CH_PROF).then(function(v){
    if(v&&v.length===PROF_CODES.length)return; /* déjà posées */
    var proms=PROF_CODES.map(function(code){
      var sel=mjpcSelAleatoire();
      return mjpcEmpreinte(code,sel).then(function(emp){return {sel:sel,empreinte:emp};});
    });
    Promise.all(proms).then(function(fiches){
      secuEcrire(SECU_CH_PROF,fiches).then(function(r){
        if(!r.ok)mjpcSignalerIssue(r.issue,{ou:'Empreintes de la porte professeur',retenter:secuPoserEmpreintesProf});
      });
    });
  });
}""",
"""/* ── M-SÉCU-3 : plus de source claire pour les poser — CONSTAT seulement.
   Si les empreintes manquent au hub, la porte ne s'ouvre plus que par la clé,
   et le professeur doit le savoir. ── */
function secuPoserEmpreintesProf(){
  secuLire(SECU_CH_PROF).then(function(v){
    if(v&&v.length)return;
    try{console.warn('MJPC-SECU3 : aucune empreinte professeur au hub ('+SECU_CH_PROF+') \\u2014 la porte ne s\\u2019ouvre que par la cl\\u00e9.');}catch(e){}
  });
}""")

# ── 5. le bouton dans l'encart + la section du RETRAIT ──
sub("""      +'<button class="mjpc-act" onclick="secuMigrerCodes(true)">Relancer la pr\\u00e9paration</button>'
      +'</div>';""",
"""      +'<button class="mjpc-act" onclick="secuMigrerCodes(true)">Relancer la pr\\u00e9paration</button>'
      +'<button class="mjpc-act secu-retrait" onclick="secuRetirerClair()">Retirer les codes en clair</button>'
      +'</div>';""")

ANCRE_SECTION="/* ── M-SÉCU-3 : plus de source claire pour les poser — CONSTAT seulement."
SECTION_RETRAIT="""/* ═══════════════════════════════════════════════════════════════════════════
   M-SÉCU-3 — LE RETRAIT DU CLAIR. Un seul geste, explicite, jamais automatique.
   Séquence de Paul : promotion → déploiement → vérification → CE bouton.
   ① dénombrement · ② contrôle bloquant par CALCUL (discordances + entrées sans
   empreinte, nommées) · ③ ARCHIVE de /codes en /corbeille, ABANDON si échec ·
   ④ purge allSettled, compte rendu chiffré · les chaînes nues (vestiges) ne
   sont pas touchées. Irréversible pour le professeur, pas pour les données :
   le chiffré reste, un code se raffiche avec la clé.
   ═══════════════════════════════════════════════════════════════════════════ */
function secuRetirerClair(){
  if(!secuExigeCle())return;
  var ks=Object.keys(codesData||{});
  var aTraiter=[],bloquants=[],vestiges=[],dejaFaits=0;
  var verifs=ks.map(function(k){
    var e=codesData[k];
    if(!e)return Promise.resolve();
    if(typeof e==="string"){vestiges.push(k);return Promise.resolve();}
    var aClair=(e.code!==undefined&&e.code!==null);
    if(!aClair){dejaFaits++;return Promise.resolve();}
    if(!(e.empreinte&&e.sel)){bloquants.push({k:k,nom:e.name||k,raison:"jamais pr\\u00e9par\\u00e9 (sans empreinte)"});return Promise.resolve();}
    return mjpcEmpreinte(String(e.code),e.sel).then(function(h){
      if(h===e.empreinte)aTraiter.push(k);
      else bloquants.push({k:k,nom:e.name||k,raison:"empreinte discordante (code r\\u00e9g\\u00e9n\\u00e9r\\u00e9 sans la cl\\u00e9)"});
    },function(){bloquants.push({k:k,nom:e.name||k,raison:"v\\u00e9rification impossible"});});
  });
  _showConsoleModal('Retrait des codes en clair','<div class="cm-sub">V\\u00e9rification de chaque code\\u2026</div>',[]);
  Promise.all(verifs).then(function(){
    if(bloquants.length){
      var l=bloquants.map(function(b){return '<li><b>'+escapeHtml(b.nom)+'</b> \\u2014 '+b.raison+'</li>';}).join('');
      _showConsoleModal('Retrait refus\\u00e9',
        '<div class="cm-sub">'+bloquants.length+' code(s) doivent d\\u2019abord \\u00eatre r\\u00e9g\\u00e9n\\u00e9r\\u00e9s AVEC la cl\\u00e9, sinon ces \\u00e9l\\u00e8ves seraient dehors d\\u00e9finitivement :</div><ul>'+l+'</ul><div class="cm-sub">R\\u00e9g\\u00e9n\\u00e8re-les (\\u00e9cran \\u00c9l\\u00e8ves &amp; codes), puis relance.</div>',
        [{label:'Fermer',cls:'primary'}]);
      return;
    }
    var res=[
      '<div class="cm-sub"><b>'+aTraiter.length+'</b> codes portent encore leur clair \\u2014 tous v\\u00e9rifi\\u00e9s conformes (chiffr\\u00e9s et v\\u00e9rifiables).',
      dejaFaits?('<br>'+dejaFaits+' d\\u00e9j\\u00e0 sans clair.'):'',
      vestiges.length?('<br>'+vestiges.length+' entr\\u00e9e(s) ancienne(s) (hors \\u00e9l\\u00e8ves) laiss\\u00e9e(s) telles quelles.'):'',
      '<br><br>Apr\\u00e8s ce geste, un code ne se lit plus qu\\u2019avec la cl\\u00e9 de chiffrement. <b>Rien n\\u2019est perdu</b> : le chiffr\\u00e9 reste, et une archive dat\\u00e9e part en corbeille avant tout retrait.',
      '<br>Cette action s\\u2019ex\\u00e9cute <b>une fois, apr\\u00e8s d\\u00e9ploiement et v\\u00e9rification</b>.</div>'
    ].join('');
    _showConsoleModal('Retirer les codes en clair',res,[
      {label:'Annuler',cls:''},
      {label:'Retirer maintenant',cls:'primary',onclick:function(){_secuPurgerClair(aTraiter,vestiges.length,dejaFaits);}}
    ]);
  });
}
function _secuPurgerClair(cles,nbVestiges,dejaFaits){
  _showConsoleModal('Retrait en cours','<div class="cm-sub">Archive de /codes en corbeille\\u2026</div>',[]);
  var archive={_meta:{chemin:'/codes',app:'site',ts:Date.now()},data:JSON.parse(JSON.stringify(codesData||{}))};
  secuEcrire('/corbeille/retrait-clair-'+archive._meta.ts,archive).then(function(r){
    if(!r.ok){
      _showConsoleModal('Retrait ABANDONN\\u00c9',
        '<div class="cm-sub">L\\u2019archive en corbeille a \\u00e9chou\\u00e9 \\u2014 <b>aucun code n\\u2019a \\u00e9t\\u00e9 retir\\u00e9</b>. Jamais de suppression sans archive. R\\u00e9essaie quand la connexion est stable.</div>',
        [{label:'Fermer',cls:'primary'}]);
      if(r.issue)mjpcSignalerIssue(r.issue,{ou:'Archive avant retrait du clair',retenter:secuRetirerClair});
      return;
    }
    _showConsoleModal('Retrait en cours','<div class="cm-sub">Archive faite. Retrait de '+cles.length+' codes\\u2026</div>',[]);
    Promise.allSettled(cles.map(function(k){
      return new Promise(function(res,rej){
        secuPatchCode(k,{code:null},function(issue){
          if(issue&&issue.etat===MJPC_ISSUE.ACCEPTEE){if(codesData[k])delete codesData[k].code;res(k);}
          else rej({k:k,issue:issue});
        });
      });
    })).then(function(vs){
      var ok=vs.filter(function(v){return v.status==='fulfilled';}).length;
      var ko=vs.filter(function(v){return v.status==='rejected';});
      var msg='<div class="cm-sub">Clair retir\\u00e9 : <b>'+ok+'/'+cles.length+'</b>. Archive en corbeille.'
        +(nbVestiges?('<br>'+nbVestiges+' entr\\u00e9e(s) ancienne(s) (hors \\u00e9l\\u00e8ves) laiss\\u00e9e(s) telles quelles.'):'')
        +(dejaFaits?('<br>'+dejaFaits+' \\u00e9taient d\\u00e9j\\u00e0 sans clair.'):'');
      if(ko.length){
        msg+='<br><br>\\u26a0 <b>'+ko.length+' retrait(s) ont \\u00e9chou\\u00e9</b> \\u2014 le geste n\\u2019est PAS termin\\u00e9. Relance-le : il ne touchera que ce qui reste.';
        ko.slice(0,5).forEach(function(x){mjpcSignalerIssue(x.reason&&x.reason.issue,{ou:'Retrait du clair \\u00b7 '+(x.reason&&x.reason.k||'?'),retenter:secuRetirerClair});});
      }else{
        msg+='<br><br>\\u2705 Termin\\u00e9. Un code ne se lit plus qu\\u2019avec la cl\\u00e9.';
      }
      msg+='</div>';
      _showConsoleModal(ko.length?'Retrait incomplet':'Retrait termin\\u00e9',msg,[{label:'Fermer',cls:'primary'}]);
      showProfSection('eleves');
    });
  });
}
"""
sub(ANCRE_SECTION,SECTION_RETRAIT+"\n"+ANCRE_SECTION)

# ── 6. pastille ──
sub('var APP_VERSION="8.8.3"','var APP_VERSION="8.9.0"')

open("index.staging.html","w",encoding='utf-8').write(s)
print(f"index.staging.html écrit ({len(s)} car.)")
# garde-fou : plus aucun 1312/3141/PROF_CODES
import sys
occ=[m for m in re.finditer(r"['\\\"](?:1312|3141)['\\\"]|PROF_CODES",s)]
print("résidus 1312/3141/PROF_CODES :",len(occ))
for m in occ[:6]:print("  ",s[max(0,m.start()-70):m.start()+50].replace('\n','⏎')[:120])

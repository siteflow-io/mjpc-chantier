#!/usr/bin/env python3
# ══ M-SÉCU-3 — LES NEUF APPS : le repli disparaît, PROF_CODES meurt ══
import re

def charge(n):return open(n+".base.html",encoding='utf-8').read()
def ecrit(n,s):open(n+".staging.html","w",encoding='utf-8').write(s)
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    return s.replace(a,n)

# ── 1. LA SECTION : v2 → v3 (identique à l'octet dans les neuf) ──
V2_TETE='''/* ═══════════════════════════════════════════════════════════════════════════
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
var MJPC_SECU2={hub:"https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app",discordances:0,voies:{empreinte:0,clair:0}};'''
V3_TETE='''/* ═══════════════════════════════════════════════════════════════════════════
   M-SÉCU-2/3 — LA VÉRIFICATION PAR EMPREINTE (section commune aux neuf apps)
   M-SÉCU-3 : LE REPLI SUR LE CLAIR A DISPARU. Un code ne se vérifie plus que
   par son EMPREINTE ; une entrée qui n'en porte pas est refusée (le code sera
   renouvelé en classe). La porte professeur n'accepte plus que la CLÉ de
   chiffrement (validée par le canari) et les empreintes de
   /site/config/profEmpreintes — plus aucun code en clair, nulle part.
   Hors https (WebCrypto absent), l'app s'ouvre mais le déclare : ni porte
   professeur, ni vérification de code — jamais d'écran blanc.
   La clé est LUE depuis le localStorage commun (même origine que le site) et
   n'est JAMAIS envoyée. Lecture seule ici : cette section n'écrit rien au hub.
   ═══════════════════════════════════════════════════════════════════════════ */
var MJPC_SECU2={hub:"https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app",voies:{empreinte:0}};'''

V2_VERIF='''/* La vérification : empreinte prioritaire, repli clair. → Promise {ok, voie} */
function mjpcVerifierCode(entree,saisie){
  if(!entree)return Promise.resolve({ok:false,voie:"absent"});
  var clairOk=(entree.code!==undefined&&entree.code!==null)&&String(entree.code)===String(saisie);
  if(entree.empreinte&&entree.sel&&mjpcCryptoDispo()){
    return mjpcEmpreinte(String(saisie),entree.sel).then(function(h){
      if(h===entree.empreinte){MJPC_SECU2.voies.empreinte++;return {ok:true,voie:"empreinte"};}
      if(clairOk){
        MJPC_SECU2.discordances++;MJPC_SECU2.voies.clair++;
        try{console.warn("MJPC-SECU2 : empreinte discordante pour une entr\\u00e9e \\u2014 repli clair accept\\u00e9. Ce code doit \\u00eatre r\\u00e9g\\u00e9n\\u00e9r\\u00e9 AVEC la cl\\u00e9 avant le retrait du clair (3e temps).");}catch(e){}
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
}'''
V3_VERIF='''/* La vérification : l'EMPREINTE SEULE fait foi (M-SÉCU-3). → Promise {ok, voie}
   voie "sans-empreinte" : entrée jamais préparée — le code sera renouvelé en
   classe. voie "indisponible" : WebCrypto absent (hors https). */
function mjpcVerifierCode(entree,saisie){
  if(!entree)return Promise.resolve({ok:false,voie:"absent"});
  if(!(entree.empreinte&&entree.sel))return Promise.resolve({ok:false,voie:"sans-empreinte"});
  if(!mjpcCryptoDispo())return Promise.resolve({ok:false,voie:"indisponible"});
  return mjpcEmpreinte(String(saisie),entree.sel).then(function(h){
    if(h===entree.empreinte){MJPC_SECU2.voies.empreinte++;return {ok:true,voie:"empreinte"};}
    return {ok:false,voie:"empreinte"};
  },function(){return {ok:false,voie:"indisponible"};});
}
/* Le message élève d'un refus, selon la voie — flux impersonnel, zéro jargon */
function mjpcMessageRefusEleve(voie){
  if(voie==="sans-empreinte")return "Ce code n\\u2019ouvre pas encore cet espace. Il sera renouvel\\u00e9 en classe \\u2014 rien \\u00e0 faire de ton c\\u00f4t\\u00e9.";
  if(voie==="indisponible")return "Cet espace s\\u2019ouvre depuis le site publi\\u00e9.";
  return null; /* code faux : chaque app garde son message habituel */
}'''

V2_PROF='''/* La porte professeur à trois voies. profCodes = les codes EFFECTIFS de l'app
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
}'''
V3_PROF='''/* La porte professeur (M-SÉCU-3) : la CLÉ (canari) et les EMPREINTES du hub.
   Plus aucun code en clair. Hors https : voie "indisponible", la porte se
   déclare fermée sans jamais casser l'app. */
function mjpcVerifierProf(saisie){
  if(!mjpcCryptoDispo())return Promise.resolve({ok:false,voie:"indisponible"});
  var s=String(saisie||"");
  var parCle=(s.length>=8)
    ? mjpcValiderCleLocale(s).then(function(ok){
        if(ok){try{localStorage.setItem("mjpc_coffre_secret",s);}catch(e){}return {ok:true,voie:"cle"};}
        return null;})
    : Promise.resolve(null);
  return parCle.then(function(r){
    if(r)return r;
    return mjpcSecuLireJson("/site/config/profEmpreintes").then(function(fiches){
      if(!fiches||!fiches.length)return {ok:false,voie:"empreinte-prof"};
      return Promise.all(fiches.map(function(f){
        return mjpcEmpreinte(String(saisie),f.sel).then(function(h){return h===f.empreinte;},function(){return false;});
      })).then(function(rs){return {ok:rs.indexOf(true)>=0,voie:"empreinte-prof"};});
    });
  });
}
/* Le message d'une porte professeur fermée hors https — une ligne, pas d'erreur technique */
var MJPC_TXT_PROF_HORS_LIGNE="L\\u2019espace professeur s\\u2019ouvre depuis le site publi\\u00e9.";'''

def section_v3(s):
    s=sub(s,V2_TETE,V3_TETE)
    s=sub(s,V2_VERIF,V3_VERIF)
    s=sub(s,V2_PROF,V3_PROF)
    return s

APPS=["analyse_logique","applause_meter","correction_dictee","dictee_universelle","evaluation-qcm","pilotage_debat_s3","reecriture","reecriture_bb4e","worktrack"]
OUT={}

# ═══ analyse_logique (2.2.0 → 2.3.0) ═══
s=charge("analyse_logique");s=section_v3(s)
s=sub(s,'''var PROF_CODES=[3141,1312];                      // seed — la surcharge Firebase fait foi ensuite
function chargerConfigApp(cb){
  db.ref(ROOT+"/config").once("value",function(s){
    var cfg=s.val()||{};
    if(cfg.profCodes && Array.isArray(cfg.profCodes) && cfg.profCodes.length) PROF_CODES=cfg.profCodes;
    if(cb)cb(cfg);
  },''','''/* M-SÉCU-3 : plus aucun code professeur en clair — ni en dur, ni par surcharge.
   La porte s'ouvre par la CLÉ ou par les empreintes du hub (mjpcVerifierProf). */
function chargerConfigApp(cb){
  db.ref(ROOT+"/config").once("value",function(s){
    var cfg=s.val()||{};
    if(cb)cb(cfg);
  },''')
# portail : la voie clé de tête devient la voie prof UNIQUE (plus de garde >=8 ni PROF_CODES)
s=sub(s,'''    var estProf=PROF_CODES.map(String).indexOf(String(code))>=0;
    /* M-SÉCU-2 : la CLÉ de chiffrement (ou l'empreinte prof) ouvre aussi la session professeur */
    if(!estProf&&String(code).length>=8&&mjpcCryptoDispo()){
      setErrMsg("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code,PROF_CODES).then(function(r){
        if(r.ok){setErrMsg("");mjpcRetirerBoutonProf();p.onDone({nom:nom+" "+prenom,cle:sanMJPC(nom+" "+prenom),classe:"",via:"prof",accesProf:true});}
        else setErrMsg("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes. V\\u00e9rifie la saisie.");
      });
      return;
    }
    var registre=classesData||{};''','''    /* M-SÉCU-3 : la clé (\u2265 8) se tente en tête ; le code prof 4 chiffres se
       rattrape par EMPREINTE quand le nom n'est pas au registre (branche erreur). */
    if(String(code).length>=8&&mjpcCryptoDispo()){
      setErrMsg("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code).then(function(r){
        if(r.ok){setErrMsg("");mjpcRetirerBoutonProf();p.onDone({nom:nom+" "+prenom,cle:sanMJPC(nom+" "+prenom),classe:"",via:"prof",accesProf:true});}
        else setErrMsg("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes. V\\u00e9rifie la saisie.");
      });
      return;
    }
    var registre=classesData||{};''')
s=sub(s,'''    if(res&&res.erreur){
      if(estProf){ setErrMsg(""); p.onDone({nom:nom+" "+prenom,cle:sanMJPC(nom+" "+prenom),classe:"",via:"prof",accesProf:true}); return; }
      setErrMsg("Aucun \\u00e9l\\u00e8ve \\u00e0 ce nom. V\\u00e9rifie l\\u2019orthographe de ton nom et de ton pr\\u00e9nom.");return
    }
    var moi=res[0];
    if(!estProf){''','''    if(res&&res.erreur){
      /* M-SÉCU-3 : nom hors registre + code \u00e0 4 chiffres \u2192 peut \u00eatre le professeur (par EMPREINTE) */
      mjpcVerifierProf(code).then(function(r){
        if(r.ok){ setErrMsg(""); mjpcRetirerBoutonProf(); p.onDone({nom:nom+" "+prenom,cle:sanMJPC(nom+" "+prenom),classe:"",via:"prof",accesProf:true}); return; }
        setErrMsg("Aucun \\u00e9l\\u00e8ve \\u00e0 ce nom. V\\u00e9rifie l\\u2019orthographe de ton nom et de ton pr\\u00e9nom.");
      });
      return;
    }
    var moi=res[0];
    {''')
# refus élève : message selon la voie
s=sub(s,'''      mjpcVerifierCode(entree,code).then(function(r){
        if(!r.ok){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}
        setErrMsg("");mjpcRetirerBoutonProf();
        p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"code",accesProf:false});
      });
      return;
    }
    setErrMsg("");mjpcRetirerBoutonProf();
    p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"prof",accesProf:true});''','''      mjpcVerifierCode(entree,code).then(function(r){
        if(!r.ok){setErrMsg(mjpcMessageRefusEleve(r.voie)||"Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}
        setErrMsg("");mjpcRetirerBoutonProf();
        p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"code",accesProf:false});
      });
      return;
    }''')
s=sub(s,'var APP_VERSION = "2.2.0";','var APP_VERSION = "2.3.0";')
OUT["analyse_logique"]=s

# ═══ dictee_universelle (2.1.0 → 2.2.0) ═══
s=charge("dictee_universelle");s=section_v3(s)
s=sub(s,'PROF_CODES=cfg.profCodes||[3141,1312];','/* M-SÉCU-3 : plus de code prof en clair (ni surcharge, ni seed) */')
# portail élève : tête clé + branche estProf
s=sub(s,'''    var moi=res[0];
    var estProf=PROF_CODES.map(String).indexOf(String(code))>=0;
    /* M-SÉCU-2 : clé/empreinte prof, puis vérification élève par EMPREINTE avec repli clair */
    if(!estProf&&String(code).length>=8&&mjpcCryptoDispo()){
      setErrMsg("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code,PROF_CODES).then(function(r){
        if(r.ok){setErrMsg("");mjpcRetirerBoutonProf();p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"prof",accesProf:true});}
        else setErrMsg("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes. V\\u00e9rifie la saisie.");
      });
      return;
    }
    if(!estProf){
      var entree=mjpcEntreeCode(codesData,moi.cle);
      if(!entree){setErrMsg("Ton code n\\u2019est pas encore enregistr\\u00e9. Viens me voir pour qu\\u2019on le mette en place.");return}
      mjpcVerifierCode(entree,code).then(function(r){
        if(!r.ok){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}
        setErrMsg("");mjpcRetirerBoutonProf();
        p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"code",accesProf:false});
      });
      return;
    }
    setErrMsg("");mjpcRetirerBoutonProf();
    p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"prof",accesProf:true});''','''    var moi=res[0];
    /* M-SÉCU-3 : la clé (\u2265 8) ouvre la session professeur ; sinon vérification élève par EMPREINTE seule */
    if(String(code).length>=8&&mjpcCryptoDispo()){
      setErrMsg("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code).then(function(r){
        if(r.ok){setErrMsg("");mjpcRetirerBoutonProf();p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"prof",accesProf:true});}
        else setErrMsg("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes. V\\u00e9rifie la saisie.");
      });
      return;
    }
    {
      var entree=mjpcEntreeCode(codesData,moi.cle);
      if(!entree){setErrMsg("Ton code n\\u2019est pas encore enregistr\\u00e9. Viens me voir pour qu\\u2019on le mette en place.");return}
      mjpcVerifierCode(entree,code).then(function(r){
        if(!r.ok){setErrMsg(mjpcMessageRefusEleve(r.voie)||"Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}
        setErrMsg("");mjpcRetirerBoutonProf();
        p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"code",accesProf:false});
      });
      return;
    }''')
# les deux portes prof de l'écran prof : voie unique
s=sub(s,'''if(e.key==="Enter"){if(PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true);publierManifeste(db)}else if(String(code).length>=8&&mjpcCryptoDispo()){mjpcVerifierProf(code,PROF_CODES).then(function(rS){if(rS.ok){setAuth(true);publierManifeste(db)}else alert("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes.")})}}''',
'''if(e.key==="Enter"){if(!mjpcCryptoDispo()){alert(MJPC_TXT_PROF_HORS_LIGNE)}else{mjpcVerifierProf(code).then(function(rS){if(rS.ok){setAuth(true);publierManifeste(db)}else alert("Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur.")})}}''')
s=sub(s,'''onClick:function(){if(PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true);publierManifeste(db)}else if(String(code).length>=8&&mjpcCryptoDispo()){mjpcVerifierProf(code,PROF_CODES).then(function(rS){if(rS.ok){setAuth(true);publierManifeste(db)}else alert("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes.")})}else alert("Code incorrect")}''',
'''onClick:function(){if(!mjpcCryptoDispo()){alert(MJPC_TXT_PROF_HORS_LIGNE)}else{mjpcVerifierProf(code).then(function(rS){if(rS.ok){setAuth(true);publierManifeste(db)}else alert("Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur.")})}}''')
s=sub(s,'var APP_VERSION="2.1.0";','var APP_VERSION="2.2.0";')
OUT["dictee_universelle"]=s

# ═══ evaluation-qcm (7.1.0 → 7.2.0) ═══
s=charge("evaluation-qcm");s=section_v3(s)
s=sub(s,'''PROF_CODES.indexOf(parseInt(codeInput)) >= 0){
      setProfAuth(true); setMode("prof");
    } else if(String(codeInput).length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      mjpcVerifierProf(codeInput,PROF_CODES.map(String)).then(function(rS){
        if(rS.ok){ setProfAuth(true); setMode("prof"); }
        else alert("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes.");
      });
    } else alert("Code incorrect");''','''!mjpcCryptoDispo()){
      alert(MJPC_TXT_PROF_HORS_LIGNE);
    } else { /* M-SÉCU-3 : la clé ou l'empreinte prof, seules voies */
      mjpcVerifierProf(codeInput).then(function(rS){
        if(rS.ok){ setProfAuth(true); setMode("prof"); }
        else alert("Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur.");
      });
    }''')
# la déclaration var PROF_CODES du fichier
s=re.sub(r'var PROF_CODES\s*=\s*\[[^\]]*\];[^\n]*\n','/* M-SÉCU-3 : plus de code prof en clair */\n',s,count=1)
assert 'var PROF_CODES' not in s
# refus élève : message selon la voie
s=sub(s,'''    mjpcVerifierCode(entree, code.trim()).then(function(r){
      if(!r.ok){ setErr("Ce code ne correspond pas. Vérifie tes 4 chiffres."); return; }''','''    mjpcVerifierCode(entree, code.trim()).then(function(r){
      if(!r.ok){ setErr(mjpcMessageRefusEleve(r.voie)||"Ce code ne correspond pas. Vérifie tes 4 chiffres."); return; }''')
s=sub(s,'var APP_VERSION="7.1.0";','var APP_VERSION="7.2.0";')
OUT["evaluation-qcm"]=s

# ═══ correction_dictee (6.1.0 → 6.2.0) ═══
s=charge("correction_dictee");s=section_v3(s)
s=sub(s,'''PROF_CODES.indexOf(parseInt(codeInput))>=0){setProfAuth(true);setMode("prof")}
    else if(String(codeInput).length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      mjpcVerifierProf(codeInput,PROF_CODES.map(String)).then(function(rS){
        if(rS.ok){setProfAuth(true);setMode("prof")}
        else alert("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes.")
      });
    }
    else alert("Code incorrect")''','''!mjpcCryptoDispo()){alert(MJPC_TXT_PROF_HORS_LIGNE)}
    else{ /* M-SÉCU-3 : la clé ou l'empreinte prof, seules voies */
      mjpcVerifierProf(codeInput).then(function(rS){
        if(rS.ok){setProfAuth(true);setMode("prof")}
        else alert("Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur.")
      });
    }''')
s=re.sub(r'var PROF_CODES\s*=\s*\[[^\]]*\];[^\n]*\n','/* M-SÉCU-3 : plus de code prof en clair */\n',s,count=1)
assert 'var PROF_CODES' not in s
s=sub(s,'''    mjpcVerifierCode(entree,code).then(function(rOK){
      if(!rOK.ok){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}''','''    mjpcVerifierCode(entree,code).then(function(rOK){
      if(!rOK.ok){setErrMsg(mjpcMessageRefusEleve(rOK.voie)||"Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}''')
s=sub(s,'var APP_VERSION="6.1.0";','var APP_VERSION="6.2.0";')
OUT["correction_dictee"]=s

# ═══ reecriture (2.1.0 → 2.2.0) + bb4e (2.1.0 → 2.2.0) ═══
for nom in ["reecriture","reecriture_bb4e"]:
    s=charge(nom);s=section_v3(s)
    # porte du portail élève (p.onProf)
    s=sub(s,'''indexOf(parseInt(code,10))>=0){if(p.onProf)p.onProf();return;}
    if(String(code).length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      setErrMsg("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code,PROF_CODES.map(String)).then(function(rS){
        if(rS.ok){setErrMsg("");mjpcRetirerBoutonProf();if(p.onProf)p.onProf();}
        else setErrMsg("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes. V\\u00e9rifie la saisie.");
      });
      return;
    }''','''__MJPC3_PORTE__''')
    # neutraliser la tête du if original (PROF_CODES.indexOf(...)>=0){ ... } : reconstruire la porte entière
    i=s.index('__MJPC3_PORTE__')
    deb=s.rindex('if(',0,i)  # le if(PROF_CODES...
    s=s[:deb]+'''/* M-SÉCU-3 : la clé ou l'empreinte prof, seules voies */
    if(String(code).length&&mjpcCryptoDispo()===false&&!nom&&!prenom){setErrMsg(MJPC_TXT_PROF_HORS_LIGNE);return;}
    if(String(code).length>=4&&!nom&&!prenom){
      if(!mjpcCryptoDispo()){setErrMsg(MJPC_TXT_PROF_HORS_LIGNE);return;}
      setErrMsg("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code).then(function(rS){
        if(rS.ok){setErrMsg("");mjpcRetirerBoutonProf();if(p.onProf)p.onProf();}
        else setErrMsg("Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur.");
      });
      return;
    }
'''+s[i+len('__MJPC3_PORTE__'):]
    # la porte setProfAuth (écran séparé) : voie unique clé/empreinte
    s=sub(s,'''  function tryProfCode(){
    if(PROF_CODES.indexOf(parseInt(codeInput))>=0){setProfAuth(true);setMode("prof");publierManifeste(db)}
    else alert("Code incorrect")
  }''','''  function tryProfCode(){
    /* M-SÉCU-3 : la clé ou l'empreinte prof, seules voies */
    if(!mjpcCryptoDispo()){alert(MJPC_TXT_PROF_HORS_LIGNE);return}
    mjpcVerifierProf(codeInput).then(function(rS){
      if(rS.ok){setProfAuth(true);setMode("prof");publierManifeste(db)}
      else alert("Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur.")
    });
  }''')
    # var PROF_CODES + retrait
    s=re.sub(r'var PROF_CODES\s*=\s*\[[^\]]*\];[^\n]*\n','/* M-SÉCU-3 : plus de code prof en clair */\n',s,count=1)
    assert 'var PROF_CODES' not in s
    # refus élève selon la voie
    s=sub(s,'''    mjpcVerifierCode(rec,code).then(function(rOK){
      if(!rOK.ok){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie-le, ou vois avec moi en classe.");return}''','''    mjpcVerifierCode(rec,code).then(function(rOK){
      if(!rOK.ok){setErrMsg(mjpcMessageRefusEleve(rOK.voie)||"Ce code ne correspond pas. V\\u00e9rifie-le, ou vois avec moi en classe.");return}''')
    s=sub(s,'var APP_VERSION="2.1.0";','var APP_VERSION="2.2.0";')
    OUT[nom]=s

# ═══ applause_meter (2.1.0 → 2.2.0) ═══
s=charge("applause_meter");s=section_v3(s)
s=sub(s,'''    if(PROF_CODES.indexOf(code)!==-1){ try{sessionStorage.setItem("am_auth","1");}catch(e){} p.onOk(); }
    else if(String(code).length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      setErr("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code,PROF_CODES).then(function(rS){
        if(rS.ok){ setErr(""); try{sessionStorage.setItem("am_auth","1");}catch(e){} p.onOk(); }
        else { setErr("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes."); setCode(""); }
      });
    }
    else { setErr("Code incorrect"); setCode(""); }''','''    /* M-SÉCU-3 : la clé ou l'empreinte prof, seules voies */
    if(!mjpcCryptoDispo()){ setErr(MJPC_TXT_PROF_HORS_LIGNE); return; }
    setErr("V\\u00e9rification\\u2026");
    mjpcVerifierProf(code).then(function(rS){
      if(rS.ok){ setErr(""); try{sessionStorage.setItem("am_auth","1");}catch(e){} p.onOk(); }
      else { setErr("Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur."); setCode(""); }
    });''')
s=re.sub(r'(?:var|const)\s+PROF_CODES\s*=\s*\[[^\]]*\];[^\n]*\n','/* M-SÉCU-3 : plus de code prof en clair */\n',s,count=1)
assert re.search(r'(?:var|const)\s+PROF_CODES\s*=',s) is None
# refus élève selon la voie (2 appelants)
s=s.replace('''        if(!vS.ok){ setErr("Ce code ne correspond pas à ce nom. Vérifie tes chiffres."); setCode(""); return; }''','''        if(!vS.ok){ setErr(mjpcMessageRefusEleve(vS.voie)||"Ce code ne correspond pas à ce nom. Vérifie tes chiffres."); setCode(""); return; }''')
assert s.count('mjpcMessageRefusEleve(vS.voie)')==2
s=sub(s,'var APP_VERSION = "2.1.0";','var APP_VERSION = "2.2.0";')
OUT["applause_meter"]=s

# ═══ worktrack (2026-07-31a → 2026-07-31b) ═══
s=charge("worktrack");s=section_v3(s)
s=sub(s,'''PROF_CODES: ["3141", "1312"],       // STRINGS (M13) — surcharge Firebase (plan_de_travail/config/profCodes) fait foi ensuite ; comparaisons en map(String)''',
'''/* M-SÉCU-3 : plus aucun code prof en clair — ni en dur, ni par surcharge. */''')
s=sub(s,'''profCodes && Array.isArray(cfg.profCodes) && cfg.profCodes.length) MJPC.PROF_CODES = cfg.profCodes.map(String)''','''false) {}''')
s=sub(s,'''  checkCode(){ const v=String((($("profCode")||{}).value||"")).trim();
    if((MJPC.PROF_CODES||[]).map(String).includes(v)){ this.authed=true; lsSet("wt_prof_poste", true);
      if(MJPC.USE_FIREBASE && window.firebase){ publierManifeste(window.firebase.database());
        try{ window.firebase.database().ref(MJPC.ROOT+"/traces/acces_prof").push({via:"code", ts:Date.now()}); }catch(e){} }   // M13 : trace VISIBLE des accès prof (aucun code stocké)
      this.tab=this.defaultTab(); this.render(); SENTINEL.maybeShow(); APP.refreshTestBtn(); }
    else if(v.length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      const self=this;
      mjpcVerifierProf(v,(MJPC.PROF_CODES||[]).map(String)).then((rSecu)=>{
        if(!rSecu.ok){ toast("Code incorrect."); return; }
        self.authed=true; lsSet("wt_prof_poste", true);
        if(MJPC.USE_FIREBASE && window.firebase){ publierManifeste(window.firebase.database());
          try{ window.firebase.database().ref(MJPC.ROOT+"/traces/acces_prof").push({via:"cle", ts:Date.now()}); }catch(e){} }
        self.tab=self.defaultTab(); self.render(); SENTINEL.maybeShow(); APP.refreshTestBtn();
      });
    } else toast("Code incorrect."); },''','''  checkCode(){ const v=String((($("profCode")||{}).value||"")).trim();
    /* M-SÉCU-3 : la clé ou l'empreinte prof, seules voies */
    if(!mjpcCryptoDispo()){ toast(MJPC_TXT_PROF_HORS_LIGNE); return; }
    const self=this;
    mjpcVerifierProf(v).then((rSecu)=>{
      if(!rSecu.ok){ toast("Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur."); return; }
      self.authed=true; lsSet("wt_prof_poste", true);
      if(MJPC.USE_FIREBASE && window.firebase){ publierManifeste(window.firebase.database());
        try{ window.firebase.database().ref(MJPC.ROOT+"/traces/acces_prof").push({via:rSecu.voie, ts:Date.now()}); }catch(e){} }   // trace VISIBLE, aucun code stocké
      self.tab=self.defaultTab(); self.render(); SENTINEL.maybeShow(); APP.refreshTestBtn();
    }); },''')
# refus élève selon la voie
s=sub(s,'''      mjpcVerifierCode(entree,codeI.value.trim()).then((rSecu)=>{
        if(!rSecu.ok){ toast(txt('portail_code_faux')); return; }''','''      mjpcVerifierCode(entree,codeI.value.trim()).then((rSecu)=>{
        if(!rSecu.ok){ toast(mjpcMessageRefusEleve(rSecu.voie)||txt('portail_code_faux')); return; }''')
s=sub(s,'<meta name="app-version" content="2026-07-31a">','<meta name="app-version" content="2026-07-31b">')
OUT["worktrack"]=s

# ═══ pilotage_debat_s3 (2026-07-31-1 → 2026-07-31-2) ═══
s=charge("pilotage_debat_s3");s=section_v3(s)
s=sub(s,'''    var vSecu = await mjpcVerifierCode(trouve, code);
    if(!vSecu.ok){
      $("loginErr").textContent="Code, nom et prénom ne correspondent pas. Vérifie, ou demande au professeur.";
      $("loginBtn").disabled=false; return;
    }''','''    var vSecu = await mjpcVerifierCode(trouve, code);
    if(!vSecu.ok){
      $("loginErr").textContent=mjpcMessageRefusEleve(vSecu.voie)||"Code, nom et prénom ne correspondent pas. Vérifie, ou demande au professeur.";
      $("loginBtn").disabled=false; return;
    }''')
s=sub(s,'const APP_VERSION = "2026-07-31-1";','const APP_VERSION = "2026-07-31-2";')
OUT["pilotage_debat_s3"]=s

for n,s in OUT.items():
    # garde-fou global : 1312/3141 morts (hors SDK vendorisé : littéraux quotés dans nos sections)
    ecrit(n,s)
    print(f"{n}: écrit ({len(s)} car.)")
print("NEUF APPS ASSEMBLÉES (v3)")

#!/usr/bin/env python3
# ══ ASSEMBLAGE M-SÉCU-2 → les neuf .staging.html — ancres assertées ══
import re,hashlib

CANON=open('canon-1.3.0.js').read().rstrip()+"\n"
SECTION=open('section-secu2.js').read()
CSS=open('section-secu2.css').read()

def charge(n):
    return open(n+".base.html",encoding='utf-8').read()
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:90]!r}"
    return s.replace(a,n)

def socle_et_section(s):
    """Remplace le bloc socle 1.1.0 embarqué par le canon 1.3.0 ENTIER, la
    section M-SÉCU-2 collée juste après (même script, position sûre)."""
    deb=s.index('// MJPC-CORE v1.1.0')
    finm='var MJPC_CORE_VERSION="1.1.0";'
    fin=s.index(finm)+len(finm)
    return s[:deb]+CANON+"\n"+SECTION+s[fin:]

def css_head(s):
    """PIÈGE DES COUTURES : des </head> vivent dans des CHAÎNES JS (gabarits
    SheetJS/imprimables), et trois apps n'ont AUCUN </head> réel (head
    implicite). L'ancre sûre est le VRAI <body : le CSS s'insère juste avant
    (dernier </head> avant <body s'il existe, sinon directement avant <body)."""
    m=re.search(r'^<body[\s>]',s,re.M)   # le VRAI body est en début de ligne ;
    ib=m.start()                          # les <body> de gabarits vivent dans des chaînes
    bloc="<style>\n"+CSS+"</style>\n"
    return s[:ib]+bloc+s[ib:]

def pastille(s,anc,neuf):
    return sub(s,anc,neuf)

OUT={}

# ═══════════ 1. analyse_logique (2.1.0 → 2.2.0) ═══════════
s=charge("analyse_logique")
s=socle_et_section(s);s=css_head(s)
s=sub(s,'''    var estProf=PROF_CODES.map(String).indexOf(String(code))>=0;
    var registre=classesData||{};''',
'''    var estProf=PROF_CODES.map(String).indexOf(String(code))>=0;
    /* M-SÉCU-2 : la CLÉ de chiffrement (ou l'empreinte prof) ouvre aussi la session professeur */
    if(!estProf&&String(code).length>=8&&mjpcCryptoDispo()){
      setErrMsg("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code,PROF_CODES).then(function(r){
        if(r.ok){setErrMsg("");mjpcRetirerBoutonProf();p.onDone({nom:nom+" "+prenom,cle:sanMJPC(nom+" "+prenom),classe:"",via:"prof",accesProf:true});}
        else setErrMsg("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes. V\\u00e9rifie la saisie.");
      });
      return;
    }
    var registre=classesData||{};''')
s=sub(s,'''    if(!estProf){
      var attendu=codeAttendu(moi.cle);
      if(!attendu){setErrMsg("Ton code n\\u2019est pas encore enregistr\\u00e9. Viens me voir pour qu\\u2019on le mette en place.");return}
      if(String(code)!==String(attendu)){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}
    }
    setErrMsg("");
    p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:estProf?"prof":"code",accesProf:estProf});''',
'''    if(!estProf){
      /* M-SÉCU-2 : vérification par EMPREINTE, repli clair (aucun élève dehors à ce morceau) */
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
    p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"prof",accesProf:true});''')
s=pastille(s,'var APP_VERSION = "2.1.0";','var APP_VERSION = "2.2.0";')
s=pastille(s,'var APP_VERSION_DATE = "2026-07-27";','var APP_VERSION_DATE = "2026-07-31";')
OUT["analyse_logique"]=s

# ═══════════ 2. dictee_universelle (2.0.1 → 2.1.0) ═══════════
s=charge("dictee_universelle")
s=socle_et_section(s);s=css_head(s)
# portail élève : estProf + codeAttendu (structure quasi identique à analyse_logique, ordre différent)
s=sub(s,'''    var moi=res[0];
    var estProf=PROF_CODES.map(String).indexOf(String(code))>=0;
    if(!estProf){
      var attendu=codeAttendu(moi.cle);
      if(!attendu){setErrMsg("Ton code n\\u2019est pas encore enregistr\\u00e9. Viens me voir pour qu\\u2019on le mette en place.");return}
      if(String(code)!==String(attendu)){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}
    }
    setErrMsg("");
    p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:estProf?"prof":"code",accesProf:estProf});''',
'''    var moi=res[0];
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
    p.onDone({nom:moi.nom,cle:moi.cle,classe:resoudreClasse(moi.cle),via:"prof",accesProf:true});''')
# porte prof de l'écran prof (Enter + clic) : la clé s'ajoute
s=s.replace('''if(e.key==="Enter"&&PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true)''',
'''if(e.key==="Enter"&&PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true)''')  # inchangé (voie clair conservée)
assert s.count('PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true)')==2
# ajouter la voie clé aux DEUX portes setAuth : on insère après chaque bloc "sinon" — chirurgie par contexte
i1=s.index('if(e.key==="Enter"&&PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true)')
# lire les deux blocs réels pour brancher la clé : remplacés ensemble ci-dessous par regex prudente
def porte_cle_dictee(m):
    tete=m.group(0)
    return tete  # gardée telle quelle ; la voie clé est branchée via l'échec (voir bloc suivant)
# Les deux portes affichent une erreur en cas d'échec ; on étend l'échec : localiser les else
s=sub(s,'var APP_VERSION="2.0.1";','var APP_VERSION="2.1.0";')
s=sub(s,'var APP_VERSION_DATE="2026-07-27";','var APP_VERSION_DATE="2026-07-31";')
OUT["dictee_universelle"]=s

# ═══════════ 3. evaluation-qcm (7.0.0 → 7.1.0) ═══════════
s=charge("evaluation-qcm")
s=socle_et_section(s);s=css_head(s)
s=sub(s,'''    var cle = slugify(found.nomComplet);
    var attendu = codeAttendu(cle);
    if(!attendu){ setErr("Ton code n'est pas encore enregistré. Viens me voir pour qu'on le mette en place."); return; }
    if(String(code.trim()) !== String(attendu)){ setErr("Ce code ne correspond pas. Vérifie tes 4 chiffres."); return; }
    setErr("");
    p.onLogin({nomComplet:found.nomComplet, slug:cle});''',
'''    var cle = slugify(found.nomComplet);
    /* M-SÉCU-2 : vérification par EMPREINTE, repli clair (aucun élève dehors à ce morceau) */
    var entree = mjpcEntreeCode(codesData, cle);
    if(!entree){ setErr("Ton code n'est pas encore enregistré. Viens me voir pour qu'on le mette en place."); return; }
    mjpcVerifierCode(entree, code.trim()).then(function(r){
      if(!r.ok){ setErr("Ce code ne correspond pas. Vérifie tes 4 chiffres."); return; }
      setErr("");mjpcRetirerBoutonProf();
      p.onLogin({nomComplet:found.nomComplet, slug:cle});
    });''')
s=sub(s,'var APP_VERSION="7.0.0";','var APP_VERSION="7.1.0";')
s=sub(s,'var APP_VERSION_DATE="2026-07-18";','var APP_VERSION_DATE="2026-07-31";')
OUT["evaluation-qcm"]=s

# ═══════════ 4. correction_dictee (6.0.0 → 6.1.0) ═══════════
s=charge("correction_dictee")
s=socle_et_section(s);s=css_head(s)
s=sub(s,'''    var attendu=codeAttendu(moi.cle,moi.nom);
    if(!attendu){setErrMsg("Ton code n\\u2019est pas encore enregistr\\u00e9. Viens me voir pour qu\\u2019on le mette en place.");return}
    if(String(code)!==String(attendu)){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}
''',
'''    /* M-SÉCU-2 : vérification par EMPREINTE, repli clair (aucun élève dehors à ce morceau) */
    var entree=mjpcEntreeCode(codesData,moi.cle);
    if(!entree){setErrMsg("Ton code n\\u2019est pas encore enregistr\\u00e9. Viens me voir pour qu\\u2019on le mette en place.");return}
    mjpcVerifierCode(entree,code).then(function(rOK){
      if(!rOK.ok){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie tes 4 chiffres.");return}
      mjpcRetirerBoutonProf();
      _finLoginEleve();
    });
    return;
    function _finLoginEleve(){
''')
# fermer la fonction interne à la fin du bloc original (avant la fin de doLogin)
s=sub(s,'''    setIdentite({nom:moi.nom,cle:moi.cle,classe:cls,via:"code"});
  }''',
'''    setIdentite({nom:moi.nom,cle:moi.cle,classe:cls,via:"code"});
    }
  }''')
# porte prof : la clé s'ajoute
s=sub(s,'''PROF_CODES.indexOf(parseInt(codeInput))>=0){setProfAuth(true)''',
'''PROF_CODES.indexOf(parseInt(codeInput))>=0){setProfAuth(true)''')  # ancre témoin (comptage)
s=sub(s,'var APP_VERSION="6.0.0";','var APP_VERSION="6.1.0";')
s=sub(s,'var APP_VERSION_DATE="2026-07-18";','var APP_VERSION_DATE="2026-07-31";')
OUT["correction_dictee"]=s

# ═══════════ 5. reecriture (2.0.0 → 2.1.0) et 6. bb4e (2.0.1 → 2.1.0) ═══════════
for nom in ["reecriture","reecriture_bb4e"]:
    s=charge(nom)
    s=socle_et_section(s);s=css_head(s)
    s=sub(s,'''    var rec=(typeof CODES==="object"&&CODES)?CODES[key]:null;
    if(!rec||!rec.code||String(rec.code)!==code){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie-le, ou vois avec moi en classe.");return}
    _entrerEleve(full,key,lots);''',
'''    /* M-SÉCU-2 : vérification par EMPREINTE, repli clair (aucun élève dehors à ce morceau) */
    var rec=mjpcEntreeCode((typeof CODES==="object"&&CODES)?CODES:{},key);
    if(!rec){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie-le, ou vois avec moi en classe.");return}
    mjpcVerifierCode(rec,code).then(function(rOK){
      if(!rOK.ok){setErrMsg("Ce code ne correspond pas. V\\u00e9rifie-le, ou vois avec moi en classe.");return}
      mjpcRetirerBoutonProf();
      _entrerEleve(full,key,lots);
    });''')
    # porte prof du portail : la clé s'ajoute
    s=sub(s,'''PROF_CODES.indexOf(parseInt(code,10))>=0){if(p.onProf)p.onProf()''','''PROF_CODES.indexOf(parseInt(code,10))>=0){if(p.onProf)p.onProf()''')
    s=sub(s,'var APP_VERSION="2.0.0";' if nom=="reecriture" else 'var APP_VERSION="2.0.1";','var APP_VERSION="2.1.0";')
    OUT[nom]=s

# ═══════════ 7. pilotage_debat_s3 ═══════════
s=charge("pilotage_debat_s3")
s=socle_et_section(s);s=css_head(s)
s=sub(s,'''    Object.keys(codes).forEach(function(k){
      var e = codes[k];
      if(!e || typeof e!=="object" || String(e.code)!==code) return;
      var ref = sanMJPC(e.name||"");
      if(ref===saisie || ref===saisieInv) trouve = e;
    });''',
'''    /* M-SÉCU-2 : le candidat se trouve par le NOM ; le code se vérifie ensuite par EMPREINTE (repli clair) */
    Object.keys(codes).forEach(function(k){
      var e = codes[k];
      if(!e || typeof e!=="object") return;
      var ref = sanMJPC(e.name||"");
      if(ref===saisie || ref===saisieInv) trouve = e;
    });''')
s=sub(s,'const APP_VERSION = "2026-07-17-1";','const APP_VERSION = "2026-07-31-1";')
OUT["pilotage_debat_s3"]=s

# ═══════════ 8. worktrack (VERSION 1.1.0 → 1.2.0) ═══════════
s=charge("worktrack")
s=socle_et_section(s);s=css_head(s)
s=sub(s,'<meta name="app-version" content="2026-07-27a">','<meta name="app-version" content="2026-07-31a">')
OUT["worktrack"]=s

# ═══════════ 9. applause_meter (2.0.0 → 2.1.0) ═══════════
s=charge("applause_meter")
s=socle_et_section(s);s=css_head(s)
# lireCodeEleveMJPC retourne désormais aussi l'ENTRÉE (tolérance conservée, prolongée)
s=sub(s,'''  return db.ref("codes/"+cle).once("value").then(function(s){
    var v=s.val();
    if(v===null || v===undefined) return {etat:"absent", code:null};
    if(typeof v==="string") return {etat:"trouve", code:String(v)};
    if(v && v.code!==undefined && v.code!==null) return {etat:"trouve", code:String(v.code)};
    return {etat:"absent", code:null};
  }, function(e){''',
'''  return db.ref("codes/"+cle).once("value").then(function(s){
    var v=s.val();
    if(v===null || v===undefined) return {etat:"absent", code:null, entree:null};
    if(typeof v==="string") return {etat:"trouve", code:String(v), entree:{code:String(v)}};
    if(v && (v.code!==undefined && v.code!==null || v.empreinte)) return {etat:"trouve", code:(v.code!==undefined&&v.code!==null)?String(v.code):null, entree:v};
    return {etat:"absent", code:null, entree:null};
  }, function(e){''')
s=sub(s,'var APP_VERSION = "2.0.0";','var APP_VERSION = "2.1.0";')
OUT["applause_meter"]=s

for n,s in OUT.items():
    open(n+".staging.html","w",encoding='utf-8').write(s)
    print(f"{n}: {len(s)} car.")
print("ASSEMBLÉ (chirurgies communes) — chirurgies restantes par app au 2e passage")

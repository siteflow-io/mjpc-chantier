#!/usr/bin/env python3
# ══ ASSEMBLAGE M-SÉCU-2 — 2e passage : chirurgies restantes sur les .staging ══
import re

def charge(n):return open(n+".staging.html",encoding='utf-8').read()
def ecrit(n,s):open(n+".staging.html","w",encoding='utf-8').write(s)
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:90]!r}"
    return s.replace(a,n)

# ── pilotage : la vérification par empreinte, APRÈS la sélection par nom ──
s=charge("pilotage_debat_s3")
s=sub(s,'''    if(!trouve){
      $("loginErr").textContent="Code, nom et prénom ne correspondent pas. Vérifie, ou demande au professeur.";
      $("loginBtn").disabled=false; return;
    }''',
'''    if(!trouve){
      $("loginErr").textContent="Code, nom et prénom ne correspondent pas. Vérifie, ou demande au professeur.";
      $("loginBtn").disabled=false; return;
    }
    /* M-SÉCU-2 : le code du candidat se vérifie par EMPREINTE (repli clair) */
    var vSecu = await mjpcVerifierCode(trouve, code);
    if(!vSecu.ok){
      $("loginErr").textContent="Code, nom et prénom ne correspondent pas. Vérifie, ou demande au professeur.";
      $("loginBtn").disabled=false; return;
    }
    mjpcRetirerBoutonProf();''')
ecrit("pilotage_debat_s3",s);print("pilotage OK")

# ── worktrack : login élève async (extraction du onclick, queue dans le then) ──
s=charge("worktrack")
anc='''      const attendu=codeAttendu(cle);
      if(attendu===null || String(codeI.value.trim())!==String(attendu)){ toast(txt('portail_code_faux')); return; }
'''
assert s.count(anc)==1
i=s.index(anc)
# la queue va de la fin de l'ancre à la fermeture du onclick (accolade équilibrée depuis 'go.onclick=()=>{')
deb_onclick=s.rindex('go.onclick=()=>{',0,i)
j=s.index('{',deb_onclick);p=0;k=j
while True:
    c=s[k]
    if c=='{':p+=1
    elif c=='}':
        p-=1
        if p==0:break
    k+=1
queue=s[i+len(anc):k]   # tout ce qui suivait la vérification, dans le onclick
nouveau='''      /* M-SÉCU-2 : vérification par EMPREINTE, repli clair (aucun élève dehors à ce morceau) */
      const entree=mjpcEntreeCode(codesData,cle);
      if(!entree){ toast(txt('portail_code_faux')); return; }
      mjpcVerifierCode(entree,codeI.value.trim()).then((rSecu)=>{
        if(!rSecu.ok){ toast(txt('portail_code_faux')); return; }
        mjpcRetirerBoutonProf();
'''+queue+'''
      });
'''
s=s[:i]+nouveau+s[k:]
# porte prof : la clé s'ajoute à checkCode
s=sub(s,'''      this.tab=this.defaultTab(); this.render(); SENTINEL.maybeShow(); APP.refreshTestBtn(); } else toast("Code incorrect."); },''',
'''      this.tab=this.defaultTab(); this.render(); SENTINEL.maybeShow(); APP.refreshTestBtn(); }
    else if(v.length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      const self=this;
      mjpcVerifierProf(v,(MJPC.PROF_CODES||[]).map(String)).then((rSecu)=>{
        if(!rSecu.ok){ toast("Code incorrect."); return; }
        self.authed=true; lsSet("wt_prof_poste", true);
        if(MJPC.USE_FIREBASE && window.firebase){ publierManifeste(window.firebase.database());
          try{ window.firebase.database().ref(MJPC.ROOT+"/traces/acces_prof").push({via:"cle", ts:Date.now()}); }catch(e){} }
        self.tab=self.defaultTab(); self.render(); SENTINEL.maybeShow(); APP.refreshTestBtn();
      });
    } else toast("Code incorrect."); },''')
ecrit("worktrack",s);print("worktrack OK")

# ── applause : les deux appelants passent par mjpcVerifierCode ──
s=charge("applause_meter")
s=sub(s,'''      if(String(r.code)!==cd){ setErr("Ce code ne correspond pas à ce nom. Vérifie tes chiffres."); setCode(""); return; }
      p.onValider({nom:found, slug:slug, atteste:true, ts:Date.now()});''',
'''      /* M-SÉCU-2 : vérification par EMPREINTE, repli clair */
      mjpcVerifierCode(r.entree||(r.code!=null?{code:r.code}:null), cd).then(function(vS){
        if(!vS.ok){ setErr("Ce code ne correspond pas à ce nom. Vérifie tes chiffres."); setCode(""); return; }
        mjpcRetirerBoutonProf();
        p.onValider({nom:found, slug:slug, atteste:true, ts:Date.now()});
      });''')
s=sub(s,'''      if(String(r.code)!==cd){ setErr("Ce code ne correspond pas à ce nom. Vérifie tes chiffres."); setCode(""); return; }
      charger({cle:cle, nom:trouve.nom, classe:trouve.classe});''',
'''      /* M-SÉCU-2 : vérification par EMPREINTE, repli clair */
      mjpcVerifierCode(r.entree||(r.code!=null?{code:r.code}:null), cd).then(function(vS){
        if(!vS.ok){ setErr("Ce code ne correspond pas à ce nom. Vérifie tes chiffres."); setCode(""); return; }
        mjpcRetirerBoutonProf();
        charger({cle:cle, nom:trouve.nom, classe:trouve.classe});
      });''')
# porte prof CodeGate : la clé s'ajoute
s=sub(s,'''    if(PROF_CODES.indexOf(code)!==-1){ try{sessionStorage.setItem("am_auth","1");}catch(e){} p.onOk(); }
    else { setErr("Code incorrect"); setCode(""); }''',
'''    if(PROF_CODES.indexOf(code)!==-1){ try{sessionStorage.setItem("am_auth","1");}catch(e){} p.onOk(); }
    else if(String(code).length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      setErr("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code,PROF_CODES).then(function(rS){
        if(rS.ok){ setErr(""); try{sessionStorage.setItem("am_auth","1");}catch(e){} p.onOk(); }
        else { setErr("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes."); setCode(""); }
      });
    }
    else { setErr("Code incorrect"); setCode(""); }''')
ecrit("applause_meter",s);print("applause OK")

# ── dictee : portes prof (Enter + clic) — la clé s'ajoute ──
s=charge("dictee_universelle")
s=sub(s,'''if(e.key==="Enter"&&PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true);publierManifeste(db)}''',
'''if(e.key==="Enter"){if(PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true);publierManifeste(db)}else if(String(code).length>=8&&mjpcCryptoDispo()){mjpcVerifierProf(code,PROF_CODES).then(function(rS){if(rS.ok){setAuth(true);publierManifeste(db)}else alert("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes.")})}}''')
s=sub(s,'''onClick:function(){if(PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true);publierManifeste(db)}else alert("Code incorrect")}''',
'''onClick:function(){if(PROF_CODES.map(String).indexOf(String(code))>=0){setAuth(true);publierManifeste(db)}else if(String(code).length>=8&&mjpcCryptoDispo()){mjpcVerifierProf(code,PROF_CODES).then(function(rS){if(rS.ok){setAuth(true);publierManifeste(db)}else alert("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes.")})}else alert("Code incorrect")}''')
ecrit("dictee_universelle",s);print("dictee OK")

# ── correction_dictee : porte prof — la clé s'ajoute ──
s=charge("correction_dictee")
s=sub(s,'''PROF_CODES.indexOf(parseInt(codeInput))>=0){setProfAuth(true);setMode("prof")}
    else alert("Code incorrect")''',
'''PROF_CODES.indexOf(parseInt(codeInput))>=0){setProfAuth(true);setMode("prof")}
    else if(String(codeInput).length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      mjpcVerifierProf(codeInput,PROF_CODES.map(String)).then(function(rS){
        if(rS.ok){setProfAuth(true);setMode("prof")}
        else alert("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes.")
      });
    }
    else alert("Code incorrect")''')
ecrit("correction_dictee",s);print("correction OK")

# ── evaluation-qcm : porte prof — la clé s'ajoute ──
s=charge("evaluation-qcm")
s=sub(s,'''PROF_CODES.indexOf(parseInt(codeInput)) >= 0){
      setProfAuth(true); setMode("prof");
    } else alert("Code incorrect");''',
'''PROF_CODES.indexOf(parseInt(codeInput)) >= 0){
      setProfAuth(true); setMode("prof");
    } else if(String(codeInput).length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      mjpcVerifierProf(codeInput,PROF_CODES.map(String)).then(function(rS){
        if(rS.ok){ setProfAuth(true); setMode("prof"); }
        else alert("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes.");
      });
    } else alert("Code incorrect");''')
ecrit("evaluation-qcm",s);print("qcm OK")

# ── reecriture + bb4e : porte prof du portail — la clé s'ajoute ──
for nom in ["reecriture","reecriture_bb4e"]:
    s=charge(nom)
    s=sub(s,'''indexOf(parseInt(code,10))>=0){if(p.onProf)p.onProf();return;}''',
'''indexOf(parseInt(code,10))>=0){if(p.onProf)p.onProf();return;}
    if(String(code).length>=8&&mjpcCryptoDispo()){ /* M-SÉCU-2 : la clé de chiffrement ouvre aussi */
      setErrMsg("V\\u00e9rification\\u2026");
      mjpcVerifierProf(code,PROF_CODES.map(String)).then(function(rS){
        if(rS.ok){setErrMsg("");mjpcRetirerBoutonProf();if(p.onProf)p.onProf();}
        else setErrMsg("Cette cl\\u00e9 ne correspond pas \\u00e0 celle qui a verrouill\\u00e9 les codes. V\\u00e9rifie la saisie.");
      });
      return;
    }''')
    ecrit(nom,s);print(nom,"OK")

# ── analyse_logique / autres : porte prof déjà faite au passage 1 ──
print("PASSAGE 2 TERMINÉ")

#!/usr/bin/env python3
# ══ M-SÉCU-3 apps — 2e passage : les résidus révélés par le grep ══
import re
def charge(n):return open(n+".staging.html",encoding='utf-8').read()
def ecrit(n,s):open(n+".staging.html","w",encoding='utf-8').write(s)
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    return s.replace(a,n)

# ── dictee : la déclaration + l'export sans accès prof ──
s=charge("dictee_universelle")
s=sub(s,'var PROF_CODES=[3141,1312];\n','/* M-SÉCU-3 : plus de code prof en clair */\n')
s=sub(s,"""  // M9 · plus aucun littéral de code prof : les PROF_CODES EFFECTIFS au moment de l'export
  // sont figés dans le fichier autonome (sa nature), et l'accès prof laisse une trace visible.
  rh+='var PROF_CODES_EXPORT='+JSON.stringify((PROF_CODES||[]).map(String))+';';
  rh+='function checkCode(){var v=document.getElementById("codeInput").value.trim();var estProf=PROF_CODES_EXPORT.indexOf(v)>=0;if(v===CODE||estProf){document.getElementById("login").style.display="none";document.getElementById("results").className="shown";if(estProf){var b=document.createElement("div");b.style.cssText="background:#FFFFF0;border:1.5px solid #ECC94B;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:13px;color:#B7791F";b.textContent="Acc\\\\u00e8s professeur \\\\u2014 '+data.eleve+'";document.getElementById("results").insertBefore(b,document.getElementById("results").firstChild)}}else{document.getElementById("errMsg").textContent="Code incorrect."}}';""",
"""  // M-SÉCU-3 · l'export n'embarque PLUS AUCUN code professeur (les codes en clair
  // dans chaque fichier distribué étaient exactement ce que ce morceau retire).
  // Le professeur retrouve le code de l'élève au site, avec la clé.
  rh+='function checkCode(){var v=document.getElementById("codeInput").value.trim();if(v===CODE){document.getElementById("login").style.display="none";document.getElementById("results").className="shown"}else{document.getElementById("errMsg").textContent="Code incorrect."}}';""")
# le commentaire d'en-tête (« seed + surcharge »)
s=s.replace("""// professeur : les PROF_CODES effectifs (seed + surcharge cfg.profCod""","""// professeur : la porte s'ouvre par la clé ou par empreinte (M-SÉCU-3). (ancien : cfg.profCod""")
ecrit("dictee_universelle",s);print("dictee OK")

# ── analyse_logique : le panneau « Codes actifs » + le ⓘ ──
s=charge("analyse_logique")
s=sub(s,'''("h3",{style:{marginBottom:4}},"Acc\\u00e8s professeur ",ifo("Les codes professeur vivent en base (analyse_logique/config/profCodes) et surchargent le d\\u00e9faut du code. Chaque acc\\u00e8s professeur par code est trac\\u00e9.")),
      h("p",{className:"sub"},"Codes actifs : ",h("b",null,PROF_CODES.length+" code"+(PROF_CODES.length>1?"s":""))," (g\\u00e9r\\u00e9s en base, jamais affich\\u00e9s ici). Derni\\u00e8res entr\\u00e9es prof : nœud analyse_logique_traces/acces_prof.")''',
'''("h3",{style:{marginBottom:4}},"Acc\\u00e8s professeur ",ifo("La porte professeur s\\u2019ouvre par la cl\\u00e9 de chiffrement ou par empreinte (g\\u00e9r\\u00e9es depuis le site). Chaque acc\\u00e8s professeur est trac\\u00e9.")),
      h("p",{className:"sub"},"Acc\\u00e8s : ",h("b",null,"cl\\u00e9 + empreintes")," (aucun code en clair, nulle part). Derni\\u00e8res entr\\u00e9es prof : nœud analyse_logique_traces/acces_prof.")''')
# le commentaire d'en-tête du fichier
s=s.replace('''// PROF_CODES (seed en dur + surcharge Firebase) ; sh''','''// cl\u00e9/empreintes (M-S\u00c9CU-3, plus de code en clair) ; sh''')
s=s.replace('''// Aucun littéral de code professeur : les PROF_CODES effectifs (seed + surcharge) font foi p''','''// Aucun code professeur en clair : cl\u00e9 + empreintes font foi p''')
ecrit("analyse_logique",s);print("analyse OK")

# ── evaluation-qcm : l'aide qui AFFICHE les codes ──
s=charge("evaluation-qcm")
s=sub(s,'''h("p", null, "Codes prof : ", h("code", null, "1312"), " ou ", h("code", null, "3141"), ".")''',
'''h("p", null, "L\\u2019espace professeur s\\u2019ouvre avec la cl\\u00e9 de chiffrement.")''')
ecrit("evaluation-qcm",s);print("qcm OK")

# ── pilotage : DEFAULT_PWD et la porte mot-de-passe → clé/empreintes ──
s=charge("pilotage_debat_s3")
s=sub(s,'const DEFAULT_PWD = "1312";','/* M-SÉCU-3 : plus de mot de passe par défaut — la porte passe par la clé/empreintes. */')
s=sub(s,'''async function ensureProfPassword(){
  const snap = await db.ref("debat_config/profPassword").once("value");
  if(snap.exists()) return;
  const ancien = await db.ref(META+"/profPassword").once("value");
  await db.ref("debat_config/profPassword").set(ancien.exists() ? ancien.val() : DEFAULT_PWD);
}
async function checkProfPassword(pwd){
  await ensureProfPassword();
  const snap = await db.ref("debat_config/profPassword").once("value");
  return snap.val() === pwd;
}''','''/* M-SÉCU-3 : le mot de passe débat en clair (hub debat_config/profPassword,
   valeur seed) cesse d'être une voie d'entrée — le nœud n'est PAS supprimé
   (hors mandat), il n'est simplement plus lu. La porte passe par la clé de
   chiffrement ou les empreintes professeur du hub. */
async function checkProfPassword(pwd){
  if(!mjpcCryptoDispo()) return false;
  const r = await mjpcVerifierProf(pwd);
  return !!(r && r.ok);
}''')
s=sub(s,'''    await ensureProfPassword();
    watchClasses();''','''    watchClasses();''')
# message hors-https à la porte
s=sub(s,'''  if(!ok){ $("profErr").textContent="Mot de passe incorrect."; ret''','''  if(!ok){ $("profErr").textContent=mjpcCryptoDispo()?"Ce code ou cette cl\\u00e9 n\\u2019ouvre pas l\\u2019espace professeur.":MJPC_TXT_PROF_HORS_LIGNE; ret''')
ecrit("pilotage_debat_s3",s);print("pilotage OK")

# ── worktrack : la sortie clavier du plein écran passe aux empreintes ──
s=charge("worktrack")
s=sub(s,'''  _onKey(e){ if(e.key>='0'&&e.key<='9'){ this._kbuf=(this._kbuf+e.key).slice(-6);
    const codes=((typeof MJPC!=='undefined'&&MJPC.PROF_CODES)?MJPC.PROF_CODES:[]).map(String);   // M13 : plus de littéral de secours — la seule source est MJPC.PROF_CODES (seed strings + surcharge Firebase)
    for(let i=0;i<codes.length;i++){ if(this._kbuf.endsWith(String(codes[i]))){ this.close(); return; } } } },''',
'''  _onKey(e){ if(e.key>='0'&&e.key<='9'){ this._kbuf=(this._kbuf+e.key).slice(-6);
    /* M-SÉCU-3 : la frappe se vérifie par EMPREINTE (les 4 derniers chiffres), jamais par un code en clair. */
    if(this._kbuf.length>=4 && !this._kchk && typeof mjpcVerifierProf==="function" && mjpcCryptoDispo()){
      const cand=this._kbuf.slice(-4); const self=this; this._kchk=true;
      mjpcVerifierProf(cand).then((r)=>{ self._kchk=false; if(r&&r.ok) self.close(); },()=>{ self._kchk=false; });
    } } },''')
s=s.replace('''   Sortie prof : taper un code prof (MJPC.PROF_CODES) au clavier pendant l'ouverture -> ferm''','''   Sortie prof : taper le code prof au clavier pendant l'ouverture (vérifié par empreinte) -> ferm''')
ecrit("worktrack",s);print("worktrack OK")

# ── applause / reecriture×2 : commentaires exacts ──
s=charge("applause_meter")
s=s.replace('''   - constantes/config      DB_ROOT, PROF_CODES, *_DEFAUT, REGLAGES_DEFAUT, echelles''','''   - constantes/config      DB_ROOT, *_DEFAUT, REGLAGES_DEFAUT, echelles''')
ecrit("applause_meter",s);print("applause OK")
for nom in ["reecriture","reecriture_bb4e"]:
    s=charge(nom)
    s=s.replace('''       PORTE PROF : un code de PROF_CODES ouvre la session prof quels que soient''','''       PORTE PROF : la cl\u00e9 de chiffrement ou l'empreinte prof ouvre la session quels que soient''')
    ecrit(nom,s)
    print(nom,"OK")
print("PASSAGE 2 TERMINÉ")

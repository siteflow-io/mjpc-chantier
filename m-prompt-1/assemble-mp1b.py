#!/usr/bin/env python3
# ══ M-PROMPT-1 — passage 2 : archive AVANT, aperçu, état React, pastille ══
import re
s=open("correction_dictee.staging.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    s=s.replace(a,n)

# ── 1. l'écriture : archive AVANT si une banque existe, ABANDON si elle échoue ──
sub("""    // OK, on enregistre
    db.ref("correction_dictee/"+p.dicteeId+"/exercices").set(parsed).then(function(){
      setMsg("\\u2705 Exercices inject\\u00e9s avec succ\\u00e8s");
      setJsonInput("");setShowInject(false);
      setTimeout(function(){setMsg("")},3000);
    }).catch(function(e){setErrMsg("Erreur Firebase : "+e.message)});
  }""",
"""    /* M-PROMPT-1 : l'archive part AVANT — mais seulement s'il y a quelque chose à
       perdre. ABANDON si elle échoue : jamais d'écrasement sec. */
    function ecrire(){
      db.ref("correction_dictee/"+p.dicteeId+"/exercices").set(parsed).then(function(){
        setMsg("\\u2705 Exercices inject\\u00e9s"+(ancien?" \\u2014 la version pr\\u00e9c\\u00e9dente est \\u00e0 la corbeille.":"."));
        setJsonInput("");setShowInject(false);
        setTimeout(function(){setMsg("")},4000);
      }).catch(function(e){setErrMsg("L\\u2019enregistrement n\\u2019a pas abouti : "+e.message+". Rien n\\u2019a \\u00e9t\\u00e9 perdu.")});
    }
    if(!ancien){ ecrire(); return; }
    var ts=Date.now();
    var chemin="correction_dictee/"+p.dicteeId+"/exercices";
    var payload={_meta:{motif:"dictee-exercices",chemin:chemin,app:"correction_dictee",ts:ts},data:ancien};
    db.ref("corbeille/"+new Date(ts).toISOString().slice(0,10)+"/dictee-exercices_"+ts).set(payload).then(function(){
      ecrire();
    }).catch(function(e){
      setErrMsg("La mise \\u00e0 la corbeille a \\u00e9chou\\u00e9 \\u2014 rien n\\u2019a \\u00e9t\\u00e9 remplac\\u00e9. R\\u00e9essaie quand la connexion est stable.");
    });
  }""")

# ── 2. l'état React de l'aperçu ──
sub("""  // Hook DOIT être avant tout return early (règle des hooks React)
  var sQe = useState(""), exQuery = sQe[0], setExQuery = sQe[1];""",
"""  // Hook DOIT être avant tout return early (règle des hooks React)
  var sQe = useState(""), exQuery = sQe[0], setExQuery = sQe[1];
  /* M-PROMPT-1 : l'aperçu avant écriture — rien ne s'écrit tant qu'il est ouvert */
  var sAp = useState(null), apercu = sAp[0], setApercu = sAp[1];""")

# ── 3. le rendu de l'aperçu, greffé au retour du composant ──
sub("""  return h("div",{className:"fade-up"},
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}},
      h("h2",{style:{margin:0,fontSize:"1.4rem"}},"\\ud83c\\udfaf Banque d'exercices personnalis\\u00e9s"),""",
"""  /* M-PROMPT-1 : l'aperçu — ce qui sera écrit, et ce qui sera perdu (ou rien) */
  function apercuHtml(){
    if(!apercu)return null;
    var nbC=(apercu.exercices_classe||[]).length;
    var perso=apercu.exercices_personnels||{};
    var nbP=Object.keys(perso).length;
    var ancienne=exercices||null;
    var nbAncC=ancienne?toArr(ancienne.exercices_classe||[]).length:0;
    var nbAncP=ancienne?Object.keys(ancienne.exercices_personnels||{}).length:0;
    return h("div",{className:"modal-overlay",style:{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"1rem"}},
      h("div",{className:"card",style:{maxWidth:560,width:"100%",maxHeight:"86vh",overflow:"auto"}},
        h("h3",{style:{marginTop:0}},"Voici ce qui sera enregistr\\u00e9"),
        h("p",{style:{margin:"6px 0"}},nbC+" exercice(s) pour toute la classe, et des exercices personnels pour "+nbP+" \\u00e9l\\u00e8ve(s)."),
        h("p",{style:{margin:"6px 0",fontWeight:600}},
          ancienne
            ? ("Cette banque remplacera la pr\\u00e9c\\u00e9dente ("+nbAncC+" exercice(s) de classe, "+nbAncP+" \\u00e9l\\u00e8ve(s)). L\\u2019ancienne part d\\u2019abord \\u00e0 la corbeille, tu pourras la retrouver.")
            : "Cette banque est vide pour l\\u2019instant : rien ne sera perdu."),
        h("p",{style:{margin:"6px 0",opacity:.8,fontSize:".9rem"}},"Rien n\\u2019est \\u00e9crit tant que tu n\\u2019as pas confirm\\u00e9."),
        h("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginTop:14}},
          h("button",{className:"btn-sm btn-ghost",style:{minHeight:44,minWidth:44},onClick:function(){setApercu(null)}},"Annuler"),
          h("button",{className:"btn-sm",style:{minHeight:44,minWidth:44},onClick:function(){injecterConfirme(apercu)}},"Enregistrer ces exercices"))));
  }
  return h("div",{className:"fade-up"},
    apercuHtml(),
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}},
      h("h2",{style:{margin:0,fontSize:"1.4rem"}},"\\ud83c\\udfaf Banque d'exercices personnalis\\u00e9s"),""")

# ── 4. pastille ──
sub('var APP_VERSION="6.2.0";','var APP_VERSION="6.3.0";')
sub('var APP_VERSION_DATE="2026-07-31";','var APP_VERSION_DATE="2026-08-01";')

open("correction_dictee.staging.html","w",encoding='utf-8').write(s)
print(f"passage 2 OK ({len(s)} car.)")

/* Tour 628 : côté élève, les compétences par leur libellé élève. Tour 627 — le bilan général de l'élève, cloné de la correction de dictée (« Bilan général », generateBilan), personnalisé par les questions :
   dans sa fiche (capture 42), pré-rempli, modifiable, « ↻ Regénérer », « ✓ Valider le bilan » ; puis à la fin de son bilan, quand sa copie lui est rendue. */
function Pz628(t){ return h("span", {className:"prov"}, t); }
var LIB_ELEVE = {"c4-oral-01": "Comprendre et interpréter ce qu'on entend", "c4-oral-02": "Parler devant les autres de façon claire", "c4-oral-03": "Prendre part à une discussion", "c4-oral-04": "Jouer avec sa voix : lire, réciter, mettre en scène", "c4-lire-01": "Vérifier que l'on a bien compris ce qu'on lit", "c4-lire-02": "Lire des documents, des images et des pages numériques", "c4-lire-03": "Lire des œuvres et découvrir des œuvres d'art", "c4-lire-04": "Interpréter un texte littéraire", "c4-ecrire-01": "Écrire pour réfléchir, garder une trace, communiquer", "c4-ecrire-02": "Préparer, écrire et relire son texte", "c4-ecrire-03": "Se servir de ses lectures pour mieux écrire", "c4-ecrire-04": "Défendre une idée avec des arguments", "c4-langue-01": "Écrire les mots et les accords sans fautes", "c4-langue-02": "Distinguer ce qui se dit et ce qui s'écrit", "c4-langue-03": "Enrichir son vocabulaire", "c4-langue-04": "Connaître la grammaire pour analyser et construire des phrases", "c4-culture-01": "Se servir de sa culture pour comprendre les textes et les œuvres", "c4-culture-02": "Relier des œuvres d'époques et de cultures différentes", "tr-langages-01": "Comprendre une information écrite", "tr-langages-02": "Comprendre une information orale", "tr-langages-03": "Écrire pour se faire comprendre", "tr-langages-04": "Parler pour se faire comprendre", "tr-methodes-01": "Apprendre et retenir", "tr-methodes-02": "S'investir dans son travail, en classe et à la maison", "tr-methodes-03": "Travailler avec soin et précision", "tr-personne-01": "Respecter les autres", "tr-personne-02": "Travailler avec les autres et partager", "tr-personne-03": "Travailler seul et de façon responsable"};   // tour 628 : proposés, à valider
function BilanLouEleve628(){
  var lignes = [
    {q:0, txt:"juste", pts:1, cls:"j"},
    {q:1, txt:"faux", pts:0, cls:"f"},
    {q:2, txt:"faux", pts:0, cls:"f", corr:true}
  ];
  var m = maitriseDe(20 / 3);
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card", style:{maxWidth:"760px"}},
      h("button", {className:"btn btn-ghost btn-sm"}, "← Mes évaluations"),
      h("h1", {style:{marginTop:".5rem"}}, EV.titre),
      h("p", {style:{opacity:.75}}, "08/10/2026"),
      h("div", {className:"bilan-score fourchette-" + m.k},
        h("div", {className:"bilan-score-emoji"}, m.em),
        h("div", {className:"bilan-score-num"}, "Ta note : 1 / 3"),
        h("div", {className:"note20"}, "6,7 / 20"),
        h("div", {className:"bilan-score-pct"}, m.lib)),
      h("div", {className:"bilan-bloc"}, h("h3", null, "Question par question"),
        h("div", {className:"recap"}, lignes.map(function(l){
          return h("div", {key:l.q, className:"recap-l " + l.cls},
            h("span", null, "Question " + (l.q+1) + " · " + l.txt, l.corr && h("span", {className:"corrige"}, "Corrigé d'après ta feuille."),
              h("span", {className:"recap-comp"}, Pz628(EV.questions[l.q].competences.map(function(c){ return LIB_ELEVE[c]; }).join(" · ")))),
            h("span", {className:"pt"}, "→ " + l.pts + " point"));
        }))),
      h("div", {className:"bilan-bloc"}, h("h3", null, "Tes compétences"),
        COMPS.map(function(c){ return h("div", {key:c, className:"comp-l"},
          h("span", null, Pz628(LIB_ELEVE[c]), h("span", {className:"comp-q"}, "Q1 ✓ · Q2 ✗ · Q3 ✗ → 1/3")),
          h("span", {className:"mt"}, m.em + " " + m.lib)); })),
      h("div", {className:"bilan-calibration bilan-calib-sur"},
        h("h3", null, "🎯 Ton estimation", InfoI()),
        h("div", {className:"bilan-calib-msg"}, "⚠️ Tu pensais avoir mieux fait"),
        h("div", {className:"bilan-calib-detail"}, "Tu pensais avoir 2 bonnes réponses 🔵 mais tu en as eu 1 sur 3 (1 bonne réponse 🟠). Tu as un peu surestimé ce que tu avais réussi."))));
}


var COMP_LONG = {
  "c4-culture-01":"Mobiliser des références culturelles pour interpréter les textes et les créations artistiques et littéraires et pour enrichir son expression personnelle",
  "c4-lire-01":"Contrôler sa compréhension, devenir un lecteur autonome"
};
var VERIF_M = ["nommer la capitale de l'Italie", "reconnaître des capitales européennes", "dire combien de pattes a une araignée"];   // pour l'exemple
function phrasesDe628(p){
  var r = calc(p), m = maitriseDe(r.sur20), idx = ["rouge","orange","bleu","vert"], est = ESTIM[p];
  if(p === "Lou"){   // le bilan de Lou de la capture 66 : 1 / 3 (Q3 corrigée d'après sa feuille), elle pensait 2 bonnes réponses
    r = {pts:[1, 0, 0], sur20:20/3}; m = maitriseDe(r.sur20); est = "bleu";
  }
  var iE = idx.indexOf(est), iR = idx.indexOf(m.k);
  return commentaireQCM({niveau: m.k, autonomieRetiree: false, autonomieLibs: [LIB_ELEVE["tr-personne-03"], LIB_ELEVE["tr-methodes-02"]],
    questions: EV.questions.map(function(q, i){ return {n: i + 1, verifie: VERIF_M[i], pts: r.pts[i], niveau: q.niveau, taux: tauxQ(i)}; }),
    estimation: est ? (iE === iR ? "ok" : iE > iR ? "sur" : "sous") : null, ecart: Math.abs(iE - iR)});
}
function texte628(ph){ return ph.map(function(x, i){ return x.p ? h("span", {key:i, className:"prov"}, x.t) : x.t; }); }
function CarteBilan628(p){
  return h("div", {className:"card bilan628"},
    h("h3", null, "📝 Bilan général", InfoI("Texte pré-rempli automatiquement à partir de ses résultats : sa note, les questions qu'il a ratées et les questions difficiles qu'il a réussies (avec ce que chacune vérifie), son point d'autonomie, son estimation. Modifie-le si tu veux, puis valide. C'est ce texte qui finit son bilan quand sa copie lui est rendue, et qui va dans la ligne « Commentaire » du PDF « notes et compétences ».")),
    h("div", {className:"ta628"}, texte628(phrasesDe628(p))),
    h("div", {className:"pied628"},
      h("span", {className:"st628"}, "⚠ Modifications non validées"),
      h("div", {style:{display:"flex", gap:6}},
        h("button", {className:"btn btn-ghost btn-sm"}, "↻ Regénérer"),
        h("button", {className:"btn btn-primary btn-sm"}, "✓ Valider le bilan"))));
}
function BilanLou628(){
  var el = BilanLouEleve628(), carte = el.props.children[1];
  var bloc = h("div", {key:"b628", className:"bilan-bloc bilan628-eleve"}, h("h3", null, "📝 Bilan"), h("p", null, texte628(phrasesDe628("Lou"))));
  return React.cloneElement(el, null, el.props.children[0], React.cloneElement(carte, null, [].concat(carte.props.children, [bloc])));
}
function Resultats628(fiche, modale, sansTableau){
  var lignes = Object.keys(RF).map(function(p){ return {p:p, nom:nomDe(p), r:calc(p)}; }).sort(function(a, b){ return a.nom.localeCompare(b.nom, "fr"); });
  var nbLire = aLire(2).length;
  var tableau = h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet"},
    h("thead", null, h("tr", null,
      h("th", {className:"eleve-col"}, "Élève", h("span", {className:"sort-arrow"}, "↕")),
      EV.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i+1)); }),
      h("th", null, "Note", h("span", {className:"sort-arrow"}, "↕")), h("th", null, "Sur 20"), h("th", null, "Maîtrise de la note"),
      COMPS.map(EnteteComp),
      h("th", null, "À lire sur la feuille", h("span", {className:"sort-arrow"}, "↕")))),
    h("tbody", null, lignes.map(function(l){
      var m = maitriseDe(l.r.sur20);
      return h("tr", {key:l.p},
        h("td", {className:"eleve-cell"}, l.nom),
        l.r.st.map(function(s, i){
          return s === "j" ? h("td", {key:i, className:"cell-juste"}, "✓") : s === "t" ? h("td", {key:i, className:"cell-trouvee"}, "＋") : s === "pasdit" ? h("td", {key:i, className:"cell-vide"}, "?") : h("td", {key:i, className:"cell-faux"}, "✗");
        }),
        h("td", {className:"score-cell"}, l.r.complet ? l.r.n + "/3" : "—"),
        h("td", {className:"score-cell"}, l.r.complet ? fr1(l.r.sur20) : "—"),
        h("td", null, l.r.complet ? h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib) : "à fixer"),
        COMPS.map(function(c){ return h("td", {key:c, className:"comp-cell"}, PillComp(l.r, c)); }),
        h("td", {className:"alire-cell" + (l.r.flags.length ? "" : " vide")}, l.r.flags.map(function(f){ return "Q" + (f.q+1) + " : " + f.txt; }).join(" · ")));
    }))));
  var r = calc("Michel");
  var ficheEl = fiche && h("div", {className:"student-report"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}},
      h("h3", null, "👤 DUVERNAY Michel — 1 / 3 · 6,7 / 20 · 🟠 Maîtrise fragile", InfoI()),
      h("button", {className:"btn btn-ghost btn-sm"}, "✕ Fermer")),
    h("div", {className:"fiche-head"}, h("span", null, ""), h("span", null, "Question"), h("span", null, "Sa feuille (recopiée)"), h("span", null, "Sa tablette"), h("span", null, "Bonne réponse"), h("span", null, "Points"), h("span", null, "")),
    EV.questions.map(function(q, qi){
      var f = FEUI.M[qi], t = TABL.M[qi], s = r.st[qi], fl = r.flags.filter(function(x){ return x.q === qi; })[0];
      function txt(a){ return a === "aucun" ? "aucun de ces choix" : a.map(function(i){ return q.choix[i]; }).join(", "); }
      var tJ = JSON.stringify(t.slice().sort()) === JSON.stringify(q.bonnes.slice().sort());
      return h("div", {key:qi, className:"fiche-q"},
        h("span", {className:"num"}, "Q" + (qi+1)),
        h("span", null, q.enonce, h("div", {className:"fiche-comp"}, "🧩 " + q.competences.join(" · ")), fl && h("div", null, h("span", {className:"flag"}, fl.txt))),
        h("span", {className:"val " + (s === "j" ? "j" : "f")}, txt(f)),
        h("span", {className:"val " + (tJ ? "j" : "f")}, txt(t)),
        h("span", {className:"val"}, txt(q.bonnes)),
        h("span", {className:"pts"}, r.pts[qi] + " pt"),
        h("button", {className:"btn btn-ghost btn-sm"}, "La feuille dit autre chose"));
    }),
    h("div", {className:"fiche-comps"}, h("div", {className:"tt"}, "🧩 Ses compétences"),
      COMPS.map(function(c){ var m = niveauComp(r, c), x = r.comp[c];
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, COMP[c]), h("span", {className:"d"}, detailComp(r, c) + " → " + x.n + "/" + x.max), h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib)); })));
  ficheEl = fiche && h(F, null, ficheEl, CarteBilan628("Michel"));
  var mod = modale && h("div", {className:"checkin-overlay"},
    h("div", {className:"checkin-modal", style:{maxWidth:"460px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "Que dit la feuille ?"), h("div", {className:"checkin-sub"}, "DUVERNAY Michel — Q3 · " + EV.questions[2].enonce)),
      h("div", {style:{padding:".6rem 1.2rem 0", fontSize:".85rem", color:"var(--gris)"}}, "Michel a recopié « Ma feuille ne dit aucun de ces choix ». Clique sur ce que dit sa feuille."),
      h("div", {className:"qdf-choix"},
        EV.questions[2].choix.map(function(c, i){ return h("div", {key:i, className:"qdf-c"}, h("span", null, c), h("span", {className:"tg"}, EV.questions[2].bonnes.indexOf(i) >= 0 ? "bonne réponse" : "")); }),
        h("div", {className:"qdf-c aucun sel"}, h("span", null, "Aucun des choix"), h("span", {className:"tg"}, "sa recopie"))),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost"}, "Annuler"), h("button", {className:"btn btn-primary"}, "Valider"))));
  return Console("donnees", "results", h(F, null, h("div", {className:"card"},
    TitreCarte("📊 " + EV.titre + " — " + CLASSE, [
      h("button", {key:0, className:"btn btn-primary btn-sm"}, "📄 PDF notes et compétences"),
      h("button", {key:1, className:"btn btn-or btn-sm"}, "📥 Export CSV"),
      h("button", {key:2, className:"btn btn-ghost btn-sm"}, "← Retour")]),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, "08/10/2026 10:02 · 24 présents, 1 absent (YVON Adam) · ", h("strong", {style:{color:"#9A3412"}}, nbLire + " feuilles à lire")),
    !sansTableau && tableau, ficheEl), mod), false);
}


var VERIF_INTERRO = {1:"reconnaître le romantisme", 2:"dire de quoi un sonnet classique est composé"};   // pour l'exemple ; Q10 n'en a pas encore
INTERRO.forEach(function(q){ q.verifie = VERIF_INTERRO[q.n] || ""; });
function QuestionEditee628(q){
  var multi = q.bonnes.length > 1;
  function temps(lbl, v, unite){
    return h("label", {className:"ed-temps" + (v == null ? " manque" : "")}, lbl, h("input", {readOnly:true, value:v == null ? "" : v, placeholder:"—"}), unite);
  }
  return h("div", {className:"preview-q editable" + (q.bonus ? " ed-bonus-q" : "")},
    h("div", {className:"preview-q-header"},
      h("div", {className:"preview-q-titre-row"},
        h("span", {className:"preview-q-num"}, "Q" + q.n, multi && h("span", {className:"multi-tag"}, "RÉPONSES MULTIPLES"), q.bonus && h("span", {className:"multi-tag bonus-tag"}, "BONUS")),
        h("div", {className:"preview-q-actions"}, h("button", {className:"btn-mini"}, "↑"), h("button", {className:"btn-mini"}, "↓"), h("button", {className:"btn-mini btn-mini-supp"}, "🗑"))),
      h("div", {className:"preview-q-niveau-row"},
        h("span", {className:"ed-lbl"}, "Difficulté :"),
        ["facile","standard","approfondi","expert"].map(function(n){ return h("button", {key:n, className:"niv-pastille niv-" + n + (q.niveau === n ? "" : " inactif")}, NIV[n].label); }))),
    h("textarea", {className:"preview-q-enonce-input", readOnly:true, value:q.enonce}),
    h("div", {className:"ed-verif" + (q.verifie ? "" : " manque")},
      h("span", {className:"ed-lbl"}, "🎯 Ce qu'elle vérifie, pour le bilan de l'élève :", InfoI("Une courte phrase à l'infinitif, dans les mots de l'élève. Le bilan général s'en sert : « À revoir en priorité : … » quand l'élève rate la question, « Bravo, tu sais … » quand il réussit une question difficile. L'instance la remplit avec le prompt ; tu la corriges ici.")),
      h("input", {readOnly:true, value:q.verifie || "", placeholder:"par exemple : trouver l'antécédent d'un pronom relatif"})),
    h("div", {className:"ed-ligne"},
      temps("🧠 Réflexion", q.ref, "s"),
      temps("✋ Réponse", q.rep, "s par tour"),
      h("span", {className:"ed-comps"}, h("span", {className:"ed-lbl"}, "🧩 Compétences (1 ou 2) :"),
        q.comps.length ? q.comps.map(function(c){ return h("span", {key:c, className:"comp-chip"}, c, h("span", {className:"x"}, "✕")); }) : h("span", {className:"comp-chip manque"}, "aucune"),
        h("button", {className:"btn btn-ghost btn-sm"}, "+ ajouter ▾"))),
    h("label", {className:"ed-bonus"}, h("span", {className:"ck" + (q.bonus ? " on" : "")}, q.bonus ? "✓" : ""), "Question bonus : elle compte dans les points gagnés, pas dans le total"),
    h("div", {className:"preview-q-choix-edit"},
      q.choix.map(function(c, j){ var bon = q.bonnes.indexOf(j) >= 0;
        return h("div", {key:j, className:"preview-choix-edit" + (bon ? " bon" : "")},
          h("span", {className:"ck" + (bon ? " on" : "")}, bon ? "✓" : ""),
          h("input", {className:"preview-choix-input", readOnly:true, value:c}),
          h("button", {className:"btn-mini btn-mini-supp"}, "✕")); }),
      h("button", {className:"btn btn-ghost btn-sm", style:{marginTop:".4rem", alignSelf:"flex-start"}}, "➕ Ajouter un choix")),
    h("div", {className:"preview-q-explication-zone"},
      h("label", {className:"preview-q-explication-label"}, "💡 Explication (affichée aux élèves lors de la correction)", InfoI()),
      h("textarea", {className:"preview-q-explication-input", readOnly:true, value:q.expl})));
}
function Editeur628(){
  var comps = [
    ["c4-lire-04", "majeure", "Q3, Q6, Q7, Q9", 4],
    ["c4-langue-04", "mineure", "Q2, Q4, Q5, Q8", 4],
    ["c4-culture-01", "mineure", "Q1, Q3, Q7", 3]
  ];
  var modal = h("div", {className:"modal-back"},
    h("div", {className:"modal", style:{maxWidth:"980px"}},
      h("button", {className:"modal-close"}, "✕"),
      h("h2", null, "✏️ Compléter l'évaluation"),
      h("div", {className:"preview"},
        h("div", {className:"preview-titre-row"},
          h("input", {className:"preview-titre-input", readOnly:true, value:"3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)"}),
          h("span", {className:"preview-titre-meta"}, "10 questions · 9 points + 1 bonus")),
        h("div", {className:"ed-chap"}, h("span", {className:"ed-lbl"}, "📚 Chapitre", InfoI()),
          h("select", {value:"c", readOnly:true}, h("option", {value:"c"}, "3e · Chapitre 1 — Poésie et peinture au XIXe siècle"))),
        h("div", {className:"preview-mode-row", style:{marginBottom:".8rem", padding:".7rem .9rem", background:"#FFF9E6", border:"2px solid #FFD23F", borderRadius:"10px"}},
          h("div", {style:{fontWeight:900, fontSize:".9rem", color:"#8B6914", marginBottom:".4rem"}}, "📊 Mode de scoring",
            InfoI()),
          h("div", {style:{display:"flex", gap:".5rem", flexWrap:"wrap"}},
            h("label", {className:"mode-choix on"}, h("span", {className:"rond on"}), h("span", null, "🎯 Tout ou rien", h("div", {className:"sous"}, "1 point si la réponse est exacte ; sinon 0"))),
            h("label", {className:"mode-choix"}, h("span", {className:"rond"}), h("span", null, "✨ Partiel", h("div", {className:"sous"}, "Une part du point par bonne case ; autant de retiré par mauvaise (plancher 0)"))))),
        h("div", {className:"ed-comp-box"},
          h("div", {className:"tt"}, "🧩 Les compétences de cette évaluation — chacune porte sur au moins 3 questions", InfoI()),
          comps.map(function(c){ return h("div", {key:c[0], className:"ed-comp-l"},
            h("span", {className:"c"}, c[0]), h("span", {className:"t"}, c[1]), h("span", null, COMP_LIB[c[0]]), h("span", {className:"q"}, c[2]), h("span", {className:"ok"}, "✅ " + c[3] + " questions")); }),
          h("div", {className:"ed-comp-autres"}, "Les autres compétences du chapitre, pas évaluées ici : " + CHAP1_AUTRES.join(" · "))),
        h("p", {style:{fontSize:".85rem", color:"var(--gris)", margin:".6rem 0 .8rem"}}, "Édite directement chaque champ. Coche les bonnes réponses. Le niveau dit la difficulté ; les deux temps se règlent pour chaque question."),
        QuestionEditee628(INTERRO[0]),
        QuestionEditee628(INTERRO[1]),
        h("div", {className:"ed-replie"}, "Q3 à Q9 : complètes (repliées pour la capture)"),
        QuestionEditee628(INTERRO[2])),
      h("div", {className:"row", style:{marginTop:"1rem", alignItems:"center"}},
        h("button", {className:"btn btn-primary ferme"}, "💾 Enregistrer l'évaluation"),
        h("span", {className:"ed-reste"}, "⚠️ Il reste à compléter : Q10, les deux temps, au moins une compétence et ce qu'elle vérifie."))));
  return Evaluations(modal);
}


var SCENES_628 = [
  {id:"x628-1-eleve-bilan", vue:"eleve", render:BilanLou628}
];
SCENES = SCENES.concat(SCENES_628);
window.LISTE_SCENES = SCENES.map(function(s){ return {id:s.id, vue:s.vue, vh:s.vh || null}; });
rendre();

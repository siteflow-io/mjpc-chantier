/* ═══════════════ Tour 603 : les écrans qui manquent (414) et le téléphone (418) ═══════════════
   Même méthode que maquette.js : React 17 UMD, sans JSX, sur le CSS de l'app 7.7.1.
   Les mots vus par l'élève viennent tous de Paul (393 à 400) ou de l'app d'aujourd'hui. */

/* ── Les évaluations du hub (titres réels, lus le 08/10) ── */
var CHAP1 = "3e · Ch. 1 — Poésie et peinture au XIXe siècle";
var LISTE_EVALS = [
  {titre:EV.titre, chap:CHAP1, mode:"strict", nq:3, comp:"2 compétences", cree:"08/10/2026", pret:true, servi:"passée par 3 ESSAI le 08/10"},
  {titre:"3e- éval 1 Analyse logique - Construire une phrase complexe", nq:11, cree:"07/10/2026"},
  {titre:"4e- Chapitre 1 - Paris à la barre et analyse logique ·", nq:21, cree:"07/10/2026"},
  {titre:"3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)", nq:10, cree:"05/08/2026"},
  {titre:"Les Misérables — évaluation 2", nq:13, cree:"18/06/2026"},
  {titre:"Les Misérables — évaluation d'entraînement", nq:13, cree:"17/06/2026"},
  {titre:"Évaluation — Les pronoms relatifs : la liste (5e)", nq:10, cree:"28/05/2026"},
  {titre:"QCM — Le jambon-beurre", nq:10, cree:"08/05/2026"}
];
function CarteEvaluations(){
  return h("div", {className:"card"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem"}},
      h("h2", {style:{margin:0}}, "📝 Évaluations", InfoI()),
      h("div", {className:"row"},
        h("button", {className:"btn btn-or btn-sm"}, "🤖 Prompt IA", InfoI()),
        h("button", {className:"btn btn-primary btn-sm"}, "➕ Nouvelle évaluation"))),
    h("p", {style:{opacity:.8, margin:".4rem 0 0"}}, "Prépare ici tes évaluations : rédaction, relecture, impression. Le lancement en classe se fait dans « Pilotage classe »."),
    h("div", {style:{marginTop:".6rem"}}, LISTE_EVALS.map(function(e, i){
      return h("div", {key:i, className:"eval-row"},
        h("div", null,
          h("div", {className:"eval-titre"}, e.titre),
          h("div", {className:"eval-meta"},
            h("span", null, "📚 " + (e.chap || "chapitre : —")),
            h("span", null, e.mode === "partiel" ? "✨ Partiel" : "🎯 Tout ou rien"),
            h("span", null, e.nq + " questions"),
            e.comp && h("span", null, "🧩 " + e.comp),
            h("span", null, "Créée le " + e.cree)),
          e.pret ? h("div", {className:"eval-etat ok"}, "✅ Prête à lancer · " + e.servi)
                 : h("div", {className:"eval-etat manque"}, "⚠️ À compléter avant de la lancer : le chapitre, les deux temps de chaque question, les compétences")),
        h("div", {className:"eval-actions"},
          e.pret ? h("button", {className:"btn btn-sm btn-ghost"}, "✏️ Modifier") : h("button", {className:"btn btn-sm btn-primary"}, "✏️ Compléter"),
          h("button", {className:"btn btn-sm btn-ghost"}, "🖨️ Imprimer"),
          h("button", {className:"btn btn-sm btn-ghost"}, "📋 Dupliquer"),
          h("button", {className:"btn btn-sm btn-rouge"}, "🗑️")));
    })));
}
function Evaluations(modale){ return Console("pilotage", "evals", h(F, null, CarteEvaluations(), modale || null), false); }

/* ── Le collage du JSON et ses messages (201, 317, 390, 315) ── */
var JSON_EX = '{\n  "titre": "3e — Poésie et peinture : le sonnet et ses règles",\n  "chapitre": "3e-ch1",\n  "mode": "strict",\n  "questions": [\n    {\n      "enonce": "De quoi un sonnet classique est-il composé ?",\n      "choix": ["Deux quatrains", "Deux tercets", "Trois quintils", "D\'alexandrins"],\n      "bonnes": [0, 1, 3],\n      "niveau": "standard",\n      "reflexion": 30,\n      "reponse": 20,\n      "competences": ["c4-langue-04"],\n      "explication": "Deux quatrains, puis deux tercets, en alexandrins."\n    },\n    {\n      "enonce": "Quel registre exprime les sentiments personnels du poète ?",\n      "choix": ["Le registre tragique", "Le registre lyrique", "Le registre comique"],\n      "bonnes": [1],\n      "niveau": "facile",\n      "reflexion": 20,\n      "reponse": 15,\n      "competences": ["c4-culture-01", "c4-lire-04"],\n      "explication": "Lyrique vient de « lyre », l\'instrument de la poésie chantée."\n    },\n    …';
function Collage(){
  var modal = h("div", {className:"modal-back"},
    h("div", {className:"modal"},
      h("button", {className:"modal-close"}, "✕"),
      h("h2", null, "➕ Nouvelle évaluation"),
      h("div", {className:"field"},
        h("label", null, "Coller le JSON de l'évaluation", InfoI()),
        h("textarea", {className:"json", readOnly:true, value:JSON_EX, style:{minHeight:"330px"}})),
      h("div", {className:"row"},
        h("button", {className:"btn btn-ghost"}, "🔍 Vérifier le format"),
        h("button", {className:"btn btn-ghost"}, "✨ Démarrer à blanc")),
      h("div", {className:"preview-error"},
        h("div", {style:{marginBottom:".35rem"}}, "❌ Rien n'est enregistré : 4 choses à corriger dans le JSON."),
        h("ol", {className:"msg-liste"},
          h("li", null, "Question 4 : il manque le temps de réponse (« reponse »)."),
          h("li", null, "Question 7 : la compétence « c4-oral-01 » n'est pas une compétence du chapitre (" + CHAP1 + ")."),
          h("li", null, "Question 9 : 3 compétences ; une question en a une ou deux."),
          h("li", null, "La compétence « c4-culture-02 » n'est évaluée que par 2 questions (Q3, Q8) : il en faut au moins 3."))),
      h("div", {className:"preview-ok"}, "✅ Le reste est bon : chapitre « " + CHAP1 + " », mode tout ou rien, 12 questions, 4 compétences du chapitre."),
      h("div", {className:"row", style:{marginTop:"1rem"}}, h("button", {className:"btn btn-primary ferme"}, "💾 Enregistrer l'évaluation"))));
  return Evaluations(modal);
}

/* ── L'éditeur : compléter une évaluation du hub (410), sans lettres (334), avec les temps (327), les compétences (305-315, 390), « bonus » (328) ── */
var COMP_LIB = {"c4-lire-04":"Élaborer une interprétation de textes littéraires", "c4-langue-04":"Construire les notions permettant l'analyse et l'élaboration des textes", "c4-culture-01":"Mobiliser des références culturelles pour interpréter les textes…"};
var CHAP1_AUTRES = ["c4-lire-01", "c4-lire-02", "c4-lire-03", "c4-culture-02", "c4-langue-01", "c4-ecrire-02", "c4-ecrire-03", "c4-oral-02", "c4-oral-04"];
var INTERRO = [
  {n:1, enonce:"Quel mouvement du XIXe siècle met en avant les sentiments personnels et la nature sauvage ?", choix:["Le romantisme","Le classicisme","Le Parnasse","Le symbolisme"], bonnes:[0], niveau:"facile", ref:20, rep:15, comps:["c4-culture-01"], expl:"Le romantisme met en avant les sentiments du poète et les paysages qui les reflètent."},
  {n:2, enonce:"De quoi un sonnet classique est-il composé ?", choix:["Deux quatrains","Deux tercets","Trois quintils","D'alexandrins","De vers libres"], bonnes:[0,1,3], niveau:"standard", ref:30, rep:20, comps:["c4-langue-04"], expl:"Le sonnet classique compte deux quatrains puis deux tercets, écrits en alexandrins (vers de 12 syllabes)."},
  {n:10, enonce:"BONUS — Un poème de Baudelaire ne comporte ni vers ni rimes. Quel est le type de ce poème, et que montre-t-il sur les règles de la poésie ?", choix:["C'est un sonnet irrégulier","C'est un poème en prose","Ce texte n'est pas de la poésie","La poésie peut exister sans les règles de la versification"], bonnes:[1,3], niveau:"expert", ref:null, rep:null, comps:[], bonus:true, expl:"Sans vers ni rimes, la poésie reste possible : rythme, images et sonorités suffisent. C'est le poème en prose."}
];
function QuestionEditee(q){
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
function Editeur(){
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
        QuestionEditee(INTERRO[0]),
        QuestionEditee(INTERRO[1]),
        h("div", {className:"ed-replie"}, "Q3 à Q9 : complètes (repliées pour la capture)"),
        QuestionEditee(INTERRO[2])),
      h("div", {className:"row", style:{marginTop:"1rem", alignItems:"center"}},
        h("button", {className:"btn btn-primary ferme"}, "💾 Enregistrer l'évaluation"),
        h("span", {className:"ed-reste"}, "⚠️ Il reste à compléter : Q10, les deux temps et au moins une compétence."))));
  return Evaluations(modal);
}

/* ── La feuille imprimée : les énoncés seuls, avec les points, sur une page (119, 120, 334) ── */
var INTERRO_ENONCES = [
  "Quel mouvement du XIXe siècle met en avant les sentiments personnels et la nature sauvage ?",
  "De quoi un sonnet classique est-il composé ?",
  "Quel registre exprime les sentiments personnels du poète au moyen de rythmes et d'images ?",
  "Dans le vers « Souvent, pour s'amuser, les hommes d'équipage », quelle figure sonore entend-on ?",
  "Dans le vers « Le navire glissant sur les gouffres amers », le e final de « navire » se prononce-t-il, et pourquoi ?",
  "« La mer, ce grand miroir, brille de mille feux » : quelle figure de style rapproche ici la mer et le miroir ?",
  "Pourquoi dit-on que Baudelaire est un poète inclassable ?",
  "Quelles sont les dispositions régulières des rimes dans la poésie classique ?",
  "Dans les vers « Laissent piteusement leurs grandes ailes blanches / Comme des avirons traîner à côté d'eux », la phrase continue d'un vers à l'autre. Comment appelle-t-on ce procédé ?",
  "BONUS — Un poème de Baudelaire ne comporte ni vers ni rimes. Quel est le type de ce poème, et que montre-t-il sur les règles de la poésie ?"
];
function Feuille(){
  return h("div", {className:"feuille-fond"},
    h("button", {className:"btn-fermer-impression"}, "✕ Fermer"),
    h("div", {className:"feuille-a4"},
      h("div", {className:"feuille-impression visible", style:{padding:0}},
        h("div", {className:"feuille-header"},
          h("h1", null, "3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)"),
          h("div", {className:"ligne-info"},
            h("div", {className:"champ"}, h("strong", null, "Nom :"), h("div", {className:"blanc"})),
            h("div", {className:"champ"}, h("strong", null, "Classe :"), h("div", {className:"blanc"})),
            h("div", {className:"champ"}, h("strong", null, "Date :"), h("div", {className:"blanc"})))),
        INTERRO_ENONCES.map(function(e, i){
          return h("div", {key:i, className:"feuille-q-seul"},
            h("span", {className:"n"}, "Question " + (i+1)), h("span", {className:"pt"}, i === 9 ? "bonus" : "1 pt"),
            h("div", {className:"e"}, e));
        }))),
    h("div", {className:"feuille-legende"}, "A4, à l'échelle : toute l'évaluation tient sur cette page."));
}

/* ── Rouvrir pour un élève (331, 411) : Théo n'a pas répondu à la question 2 ── */
var THEO = {cle:"T", nom:"CHEVALLIER Théo", prenom:"Théo"};
function etatQ2SansTheo(p){ if(p === "Théo") return {cls:"m-pasrep", st:"⏳ pas de réponse"}; return couleur(p, 1, false); }
function RouvrirUn(){
  var fond = Pilot({phase:"attente", qi:1, stats:statsQ("24/24", "23/24", "9/23", "2/3"), passees:[0, 1], etat:etatQ2SansTheo,
    legende:LEG_Q.slice(0, 4).concat([["#fff","pas de réponse","2px dashed #EF4444"]])});
  var modal = h("div", {className:"checkin-overlay", "data-echap":"c-q2-close"},
    h("div", {className:"checkin-modal", style:{maxWidth:"560px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "🔓 Rouvrir pour un élève — Q2", InfoI()), h("div", {className:"checkin-sub"}, "Seuls les élèves sans réponse à la question 2 sont listés.")),
      h("div", {className:"rouvrir-l"},
        h("div", null, h("div", {style:{fontWeight:900}}, "CHEVALLIER Théo"), h("div", {style:{fontSize:".8rem", color:"var(--gris)"}}, "tablette 12, moitié de gauche · avec ZELLER Lou")),
        h("button", {className:"btn btn-primary btn-sm", "data-va":"t-rouvrir-un"}, "🔓 Rouvrir pour Théo")),
      h("div", {style:{padding:".2rem 1.2rem .8rem", fontSize:".84rem", lineHeight:1.5, color:"var(--noir)"}},
        "Une seule fois par question. Il a le temps de réponse de la question (20 s). Pendant son tour, ZELLER Lou porte le voile, comme d'habitude."),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost", "data-va":"c-q2-close", title:"Ferme la fenêtre sans rien rouvrir."}, "Annuler"))));
  return h(F, null, fond, modal);
}
var LOU_T = {cle:"L", nom:"ZELLER Lou", prenom:"Lou", sexe:"F"}; THEO.sexe = "M"; THEO.voisin = LOU_T;
function TabletteTheo(){ return Tablette(EcrReponse(THEO, 1, ORD[1].J, [], 14), Voile(THEO, false, LOU_T)); }

/* ── La séance interrompue et sa reprise (337) ── */
function Interrompue(){
  var modal = h("div", {className:"checkin-overlay"},
    h("div", {className:"checkin-modal", style:{maxWidth:"620px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "⚠️ Session interrompue détectée", InfoI()), h("div", {className:"checkin-sub"}, CLASSE + " — " + EV.titre)),
      h("div", {style:{padding:"1rem 1.2rem", fontSize:".9rem", color:"var(--noir)"}},
        h("div", {style:{marginBottom:".4rem"}}, "📅 Démarrée le 08/10/2026 à 10:02"),
        h("div", {style:{marginBottom:".4rem"}}, "🔌 Dernière déconnexion : 08/10/2026 à 10:09"),
        h("div", {style:{marginBottom:".8rem"}}, "📝 État : question 2, 2e tour (moitiés de gauche) ; 35 réponses enregistrées"),
        h("div", {style:{padding:".7rem", background:"#FEF3C7", borderRadius:"8px", fontSize:".85rem", color:"#78350F", marginTop:".5rem"}},
          h("strong", null, "🔄 Reprendre"), " : le tour en cours recommence au début, voile compris : les moitiés de gauche repassent la question 2, avec tout leur temps. Une réponse déjà donnée reste."),
        h("div", {style:{padding:".7rem", background:"#FEE2E2", borderRadius:"8px", fontSize:".85rem", color:"#7F1D1D", marginTop:".5rem"}},
          h("strong", null, "🛑 Terminer définitivement"), " : la séance est close, et l'archive s'écrit avec les notes telles qu'elles sont. Les questions pas encore corrigées n'ont pas de recopie : tu fixes ces notes d'après les feuilles, dans Données → Résultats.")),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-rouge btn-sm"}, "🛑 Terminer définitivement"), h("button", {className:"btn btn-primary"}, "🔄 Reprendre la session"))));
  return h(F, null, Lancement(false), modal);
}

/* ── Le rattrapage (335) ── */
function Rattrapage(){
  var carte = h("div", {className:"card"},
    h("h2", null, "🎯 Lancer une nouvelle session", InfoI()),
    h("div", {className:"lancer-grid"},
      h("div", null,
        h("div", {className:"field"}, h("label", null, "Classe", InfoI()), h("select", {value:"c", readOnly:true}, h("option", {value:"c"}, CLASSE + " (25 élèves)"))),
        h("div", {className:"field"}, h("label", null, "Évaluation", InfoI()), h("select", {value:"e", readOnly:true}, h("option", {value:"e"}, "🔁 " + EV.titre + " (3 questions)"))),
        h("div", {className:"rattrapage-box"}, h("strong", null, "🔁 Rattrapage."), " " + CLASSE + " a déjà passé cette évaluation le 08/10. Cette séance ne servira jamais de « QCM précédent » pour les binômes. Un élève déjà noté garde la note de sa première séance."),
        h("div", {className:"duree-box"}, "⏱️ ", h("strong", null, "Durée estimée : 11 min"), " — ✅ Ça tient dans les 45 minutes utiles."),
        h("button", {className:"btn btn-primary"}, "🚀 Lancer le rattrapage")),
      h("div", {className:"binomes-box"},
        h("div", {className:"tt"}, "📱 Binômes — rattrapage : placement libre"),
        h("div", {className:"ss"}, "Pas de proposition pour un rattrapage : les élèves s'assoient où tu leur dis. À l'appel, tu coches qui est là."),
        h("div", {className:"ratt-liste"}, "Pas encore noté à cette évaluation : ", h("strong", null, "YVON Adam"), " (absent le 08/10)."))));
  return Console("pilotage", "pilot", h(F, null, carte, SessionsPrecedentesRatt()), false);
}
function SessionsPrecedentesRatt(){
  return h("div", {className:"card"},
    h("h2", null, "📚 Sessions précédentes — " + CLASSE, InfoI()),
    h("div", {className:"results-eval-list"},
      h("div", {className:"results-eval-row"},
        h("div", null, h("div", {className:"titre"}, EV.titre), h("div", {className:"meta"}, "08/10/2026 10:02 · ✅ terminée · 24 présents, 1 absent · " + aLire(2).length + " feuilles à lire"),
          h("div", {className:"meta", style:{color:"var(--violet)", fontWeight:700}}, "↳ c'est le QCM précédent : il sert aux binômes")),
        h("button", {className:"btn btn-ghost btn-sm"}, "📊 Résultats")),
      h("div", {className:"results-eval-row"},
        h("div", null, h("div", {className:"titre"}, "3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)"), h("div", {className:"meta"}, "24/09/2026 10:04 · ✅ terminée · 23 présents · 2 feuilles à lire")),
        h("button", {className:"btn btn-ghost btn-sm"}, "📊 Résultats"))));
}

/* ── La fenêtre des sessions en cours (337) ── */
function SessionsEnCours(){
  var fond = Pilot({phase:"reponse", qi:0, tour:1, chrono:9, stats:statsQ("24/24", "10/12", "10/10", "1/3"), etat:etatQuestion({qi:0, tour:1, nonRep:["Jade", "Anna"]})});
  var menu = h("div", {className:"sessions-menu-overlay"},
    h("div", {className:"sessions-menu"},
      h("div", {className:"sessions-menu-header"}, h("h3", null, "🔴 Sessions actuellement en cours"), h("button", {className:"sessions-menu-close"}, "✕")),
      h("p", {className:"sessions-menu-intro"}, "Voici toutes les sessions qui sont actuellement actives quelque part. Tu peux aller au pilotage de chacune ou la terminer si elle n'a plus de raison d'être active."),
      h("div", {className:"sessions-menu-liste"},
        h("div", {className:"session-menu-row"},
          h("div", {className:"session-menu-info"}, h("div", {className:"session-menu-nom"}, CLASSE),
            h("div", {className:"session-menu-meta"}, "Phase : ", h("strong", null, "réponse"), " · Q 1 · 1er tour · fin de l'heure 10:57")),
          h("div", {className:"session-menu-actions"},
            h("button", {className:"btn btn-sm btn-primary"}, "🎯 Aller au pilotage"),
            h("button", {className:"btn btn-sm btn-rouge"}, "🛑 Terminer"))),
        h("div", {className:"sessions-note"}, "🛑 Terminer : la séance est close, et l'archive s'écrit avec les notes telles qu'elles sont, quelle que soit la phase. Les élèves voient l'écran de fin."))));
  return h(F, null, fond, menu);
}

/* ── Données → Résultats : la liste des séances, et la corbeille (206) ── */
function ListeSeances(modale){
  var nbLire = aLire(2).length;
  var lignes = [
    [EV.titre, CLASSE, "08/10/2026 10:02", "✅ terminée", "24 présents, 1 absent", nbLire + " feuilles à lire"],
    ["3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)", CLASSE, "24/09/2026 10:04", "✅ terminée", "23 présents", "2 feuilles à lire"],
    ["QCM — Le jambon-beurre", CLASSE, "15/09/2026 10:03", "✅ terminée", "25 présents", null]
  ];
  var carte = h("div", {className:"card"},
    h("h2", null, "📊 Résultats", InfoI()),
    h("p", {style:{color:"var(--gris)", fontSize:".9rem", margin:".2rem 0 .8rem"}}, "Toutes les séances, classes confondues. Un clic sur une ligne ouvre son tableau."),
    h("div", {className:"results-eval-list"}, lignes.map(function(l, i){
      return h("div", {key:i, className:"results-eval-row"},
        h("div", null, h("div", {className:"titre"}, l[0]),
          h("div", {className:"meta"}, l[1] + " — " + l[2] + " · " + l[3] + " · " + l[4], l[5] && h("span", {className:"meta-lire"}, " · 📌 " + l[5]))),
        h("div", {className:"row"}, h("button", {className:"btn btn-ghost btn-sm"}, "📊 Ouvrir"), h("button", {className:"btn btn-rouge btn-sm"}, "🗑️")));
    })));
  return Console("donnees", "results", h(F, null, carte, modale || null), false);
}
function Corbeille(){
  var modal = h("div", {className:"checkin-overlay"},
    h("div", {className:"checkin-modal", style:{maxWidth:"560px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "🗑️ Mettre cette séance à la corbeille ?"), h("div", {className:"checkin-sub"}, EV.titre + " — " + CLASSE + " — 08/10/2026 10:02")),
      h("div", {style:{padding:"1rem 1.2rem", fontSize:".9rem", lineHeight:1.5}},
        "Elle part dans la corbeille du site, gardée un an, avec ses réponses, ses recopies et ses notes. Elle sort de cette liste. Rien n'est effacé : tu la restaures depuis ",
        h("strong", null, "💾 Sauvegarde → 🗑️ Corbeille"), "."),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost"}, "Annuler"), h("button", {className:"btn btn-rouge"}, "🗑️ Mettre à la corbeille"))));
  return ListeSeances(modal);
}

/* ── Données → Sauvegarde : sans la pondération, sans les boutons qui ne servent plus, avec la corbeille ── */
function Sauvegarde(){
  return Console("donnees", "snapshot", h("div", {className:"card"},
    h("h2", null, "💾 Sauvegarde", InfoI()),
    h("p", {style:{marginBottom:".8rem", color:"var(--gris)", fontSize:".9rem"}}, "Exporte ou importe l'ensemble de la base QCM (évaluations, sessions, réponses), avec les classes."),
    h("div", {className:"snapshot-row"},
      h("button", {className:"btn btn-primary"}, "📥 Exporter snapshot"),
      h("button", {className:"btn btn-ghost"}, "📤 Importer snapshot")),
    h("p", {style:{fontSize:".82rem", color:"var(--gris)", margin:".4rem 0 0", fontStyle:"italic"}}, "Avant d'importer, le QCM d'aujourd'hui part à la corbeille : rien n'est perdu."),
    h("div", {className:"sauv-zone"},
      h("h3", {className:"sauv-h"}, "🗑️ Corbeille", InfoI()),
      h("p", {className:"sauv-p"}, "Ce que tu supprimes dans le QCM part ici, gardé un an. ↩️ le remet à sa place."),
      [["Séance", EV.titre + " — " + CLASSE + " — 08/10/2026 10:02", "mise à la corbeille le 08/10 à 18:40"],
       ["Évaluation", "Brouillon — Les figures de style (6 questions)", "mise à la corbeille le 05/10 à 21:12"]].map(function(c, i){
        return h("div", {key:i, className:"corb-l"}, h("span", {className:"k"}, c[0]), h("span", null, h("strong", null, c[1]), h("div", {className:"d"}, c[2])), h("button", {className:"btn btn-ghost btn-sm"}, "↩️ Restaurer"));
      })),
    h("div", {className:"sauv-zone"},
      h("h3", {className:"sauv-h"}, "🧹 Maintenance", InfoI()),
      h("p", {className:"sauv-p"}, "Si la vue tableau ou le pilotage te montrent des sessions fantômes (anciennes évaluations qui n'auraient pas dû rester actives), utilise le nettoyage ci-dessous."),
      h("button", {className:"btn btn-ghost btn-sm"}, "🧹 Nettoyer les sessions zombies", InfoI())),
    h("div", {className:"sauv-zone dashed"},
      h("h3", {className:"sauv-h rouge"}, "🗑️ Zone dangereuse", InfoI()),
      h("p", {className:"sauv-p"}, "Tout part d'abord à la corbeille, gardé un an. Pense quand même à exporter un snapshot."),
      h("div", {className:"row", style:{flexWrap:"wrap", gap:".5rem"}},
        h("button", {className:"btn btn-rouge btn-sm"}, "🗑️ Purger les évaluations"),
        h("button", {className:"btn btn-rouge btn-sm"}, "🗑️ Tout purger")))), false);
}

/* ── Le mode test, sur le nouveau flux ── */
var TEST_PAIRES = [["Test Élève Un","Test Élève Deux"],["Test Élève Trois","Test Élève Quatre"],["Test Élève Cinq","Test Élève Six"]];
function TabSim(a, b, sel){
  var ea = {nom:a, prenom:a}, eb = {nom:b, prenom:b};
  return h("div", {className:"sim-cadre"},
    h("div", {className:"sim-titre"}, "📱 " + a + " · " + b),
    h("div", {className:"sim"}, h("div", {className:"sim-in"}, Tablette(EcrReponse(ea, 0, [0, 1, 2, 3], sel, 9), Voile(ea, false)))));
}
function ModeTest(){
  return h("div", {className:"prof-wrap cons"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"prof full"},
      h("div", {className:"prof-header"},
        h("h1", null, "🧪 Évaluation QCM", h("span", {className:"badge", style:{background:"var(--rose)", color:"#fff"}}, "MODE TEST")),
        h("div", {className:"row"},
          h("button", {className:"btn btn-ghost btn-sm"}, "📥 Exporter snapshot test"),
          h("button", {className:"btn btn-ghost btn-sm"}, "📱 QR pilotage"),
          h("button", {className:"btn btn-rouge btn-sm"}, "🗑️ Sortir et purger"))),
      h("div", {className:"test-info", style:{marginTop:".8rem"}}, h("strong", null, "🎓 Entrer comme un élève"),
        h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, "Ouvre l'application élève telle qu'elle est : « Combien êtes-vous ? », puis code, prénom et nom. Exemple — Test Élève Un · code ", h("strong", null, "1001")),
        h("button", {className:"btn btn-ghost btn-sm"}, "👋 Ouvrir le portail élève")),
      h("div", {className:"test-info"}, h("strong", null, "Environnement de test isolé. "), "Classe fictive (6 élèves simulés, 3 tablettes), éval test (capitales). Pilote en haut, vois les tablettes répondre en bas. À la sortie, tout est purgé automatiquement."),
      h("div", {className:"test-prof-zone"},
        h("h2", {className:"test-section-title"}, "🎯 Panneau prof", InfoI()),
        h("div", {className:"test-pilot"},
          h("div", null,
            h("div", {className:"pilot-status reponse"}, "✋ Phase RÉPONSE — 1er tour", h("span", {className:"tour-chip"}, "moitiés de gauche")),
            ChronoCards(EV.questions[0], "reponse", 9, 1),
            h("div", {className:"pilot-actions"}, h("button", {className:"btn btn-vert"}, "⏭️ Tour suivant"), h("button", {className:"btn btn-or"}, "⏸️ Pause"), h("button", {className:"btn btn-ghost"}, "🔄 Relancer chrono")),
            h("div", {className:"row", style:{marginTop:".4rem", justifyContent:"center", gap:".3rem"}}, h("button", {className:"btn btn-ghost btn-sm"}, "+5s"), h("button", {className:"btn btn-ghost btn-sm"}, "+10s"), h("button", {className:"btn btn-ghost btn-sm"}, "+30s"))),
          h("div", null,
            h("h3", {style:{margin:"0 0 .2rem"}}, "📱 Tablettes"),
            h("div", {className:"tabs-grid", style:{gridTemplateColumns:"repeat(3,1fr)"}}, TEST_PAIRES.map(function(p, i){
              return TabMini(i+1, p[0], p[1], function(n, cote){ return cote === "d" ? {cls:"m-voile", st:"🙈 attend son tour"} : (i === 2 ? {cls:"m-repond", st:"✋ répond…"} : {cls:"m-juste", st:"juste"}); });
            })),
            Legende(LEG_Q)))),
      h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem", marginTop:".8rem"}},
        h("h2", {className:"test-section-title", style:{margin:0}}, "👥 Tablettes simulées", InfoI()),
        h("button", {className:"btn btn-primary btn-sm"}, "🎲 Toutes les moitiés répondent")),
      h("div", {className:"sims"}, TEST_PAIRES.map(function(p, i){ return h("div", {key:i}, TabSim(p[0], p[1], i === 2 ? [] : [2])); }))));
}

/* ── Côté élève, après : « Mes évaluations » (409, 324) et la phrase de 398 ── */
var LOU = {nom:"ZELLER Lou", prenom:"Lou"};
function MesEvaluations(){
  var items = [
    [EV.titre, "08/10/2026 · 1 / 3 · 6,7 / 20 · 🟠 Maîtrise fragile"],
    ["3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)", "24/09/2026 · 7 / 9 · 15,6 / 20 · 🟢 Très bonne maîtrise"],
    ["QCM — Le jambon-beurre", "15/09/2026 · 6 / 10 · 12 / 20 · 🔵 Maîtrise satisfaisante"]
  ];
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card", style:{maxWidth:"700px"}},
      h("h1", null, "📊 Mes évaluations"),
      h("p", {style:{opacity:.8}}, LOU.nom),
      h("div", {className:"eleves-grid", style:{gridTemplateColumns:"1fr"}}, items.map(function(x, i){
        return h("button", {key:i, className:"eleve-btn", style:{textAlign:"left"}}, h("div", {style:{fontWeight:700}}, x[0]), h("div", {style:{fontSize:".86rem", opacity:.9, marginTop:".2rem"}}, x[1]));
      })),
      h("div", {style:{marginTop:"1.5rem"}}, h("button", {className:"btn btn-ghost btn-sm"}, "← Retour"))));
}
function BilanLou(){
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
              h("span", {className:"recap-comp"}, EV.questions[l.q].competences.map(function(c){ return COMP_COURT[c]; }).join(" · "))),
            h("span", {className:"pt"}, "→ " + l.pts + " point"));
        }))),
      h("div", {className:"bilan-bloc"}, h("h3", null, "Tes compétences"),
        COMPS.map(function(c){ return h("div", {key:c, className:"comp-l"},
          h("span", null, COMP[c], h("span", {className:"comp-q"}, "Q1 ✓ · Q2 ✗ · Q3 ✗ → 1/3")),
          h("span", {className:"mt"}, m.em + " " + m.lib)); })),
      h("div", {className:"bilan-calibration bilan-calib-sur"},
        h("h3", null, "🎯 Ton estimation", InfoI()),
        h("div", {className:"bilan-calib-msg"}, "⚠️ Tu pensais avoir mieux fait"),
        h("div", {className:"bilan-calib-detail"}, "Tu pensais avoir 2 bonnes réponses 🔵 mais tu en as eu 1 sur 3 (1 bonne réponse 🟠). Tu as un peu surestimé ce que tu avais réussi."))));
}

/* ════════════════════════ LE TÉLÉPHONE (418) ════════════════════════ */
function telPastille(p, qi, mode){
  // mode : "q" (pendant la question), "voile", "rep" (répond), "recopie", "pasrecopie", "corr" (après la révélation)
  if(mode === "voile") return {t:"🙈", cls:"tp-voile"};
  if(mode === "rep") return {t:"⏳", cls:"tp-attente"};
  if(mode === "pasrep") return {t:"⏳", cls:"tp-rouge"};
  if(mode === "recopie") return {t:"✍️", cls:"tp-recopie"};
  if(mode === "pasrecopie") return {t:"⏳", cls:"tp-rouge"};
  if(mode === "corr"){
    var s = calc(p).st[qi];
    return s === "j" ? {t:"✓", cls:"tp-juste"} : s === "t" ? {t:"＋", cls:"tp-trouvee"} : {t:"✗", cls:"tp-faux"};
  }
  var c = RT[p][qi];
  return c === "J" ? {t:"✓", cls:"tp-juste"} : c === "Y" ? {t:"✓+", cls:"tp-jaune"} : c === "O" ? {t:"½", cls:"tp-orange"} : {t:"✗", cls:"tp-faux"};
}
function TelListe(titre, modeDe, flagDe){
  return h("div", {className:"tel-liste"},
    h("div", {className:"tel-liste-h"}, titre),
    PAIRES.map(function(pa, i){
      return h("div", {key:i, className:"tel-tab"},
        h("span", {className:"tel-tab-n"}, "T" + (i+1)),
        pa.map(function(n, k){
          var p = pre(n), md = modeDe(p, k === 0 ? "g" : "d"), ps = telPastille(p, md.qi, md.mode), fl = flagDe ? flagDe(p) : null;
          var nom = n.length > 15 ? n.slice(0, 14) + "…" : n;
          return h("span", {key:k, className:"tel-el" + (md.mode === "pasrep" || md.mode === "pasrecopie" ? " rouge" : "")},
            h("span", {className:"nm"}, nom, fl && h("span", {className:"tel-flag"}, fl)),
            h("span", {className:"tel-past " + ps.cls}, ps.t));
        }));
    }));
}
function TelCadre(enfants){ return h("div", {className:"tel"}, enfants); }
function TelBandeau(phase, droite){
  return h("div", {className:"tel-bandeau"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}, h("div", {style:{fontWeight:900, fontSize:".95rem"}}, CLASSE), h("div", {style:{fontSize:".72rem", opacity:.9}}, "🕙 Fin 10:57")),
    h("div", {style:{fontSize:".75rem", opacity:.85}}, EV.titre),
    h("div", {style:{marginTop:".3rem", fontSize:".8rem", fontWeight:"bold"}}, phase, droite && h("span", {className:"tel-tour"}, droite)));
}
function TelQ(qi, bonnes){
  var q = EV.questions[qi];
  return h("div", {className:"tel-q"},
    h("div", {className:"n"}, "Q" + (qi+1) + " · " + NIV[q.niveau].label + " · réflexion " + q.reflexion + " s · réponse " + q.reponse + " s par tour"),
    h("div", {className:"e"}, q.enonce),
    bonnes !== false && h("div", {className:"b"}, h("span", {style:{fontWeight:900}}, "✓ Bonne" + (q.bonnes.length > 1 ? "s" : "") + " réponse" + (q.bonnes.length > 1 ? "s" : "") + " : "), q.bonnes.map(function(i){ return q.choix[i]; }).join(" / ")));
}
function TelBtn(txt, variant, taille, ferme){ return h("button", {className:"tel-btn tb-" + variant + (taille ? " tb-" + taille : "") + (ferme ? " ferme" : "")}, txt); }
function TelStats(courante, connues){
  // connues : les questions déjà closes, dont le taux est connu ; la question courante dit « en cours » tant qu'elle n'est pas close
  var tx = [88, 38, 58];
  return h("div", {className:"tel-stats"}, EV.questions.map(function(q, i){
    var connu = connues.indexOf(i) >= 0;
    var c = i === courante ? "cur" : !connu ? "vide" : tx[i] >= 75 ? "v" : tx[i] >= 50 ? "b" : tx[i] >= 25 ? "o" : "r";
    return h("div", {key:i, className:"tel-st " + c}, h("div", null, "Q" + (i+1)), h("div", {style:{fontSize:".62rem", opacity:.9}}, connu ? tx[i] + "%" : (i === courante ? "en cours" : "—")));
  }));
}
function TelLegende(items){ return h("div", {className:"tel-leg"}, items.join(" · ")); }

function TelReponse(){
  var modeDe = function(p, cote){ var premier = cote === (PREMIER[0] === "J" ? "g" : "d"); if(!premier) return {mode:"voile"}; if(p === "Jade" || p === "Anna") return {mode:"rep"}; return {qi:0, mode:"q"}; };
  return TelCadre([
    TelBandeau("Phase : réponse — Q 1/3", "1er tour : moitiés de gauche"),
    h("div", {key:"c", className:"tel-chrono"}, "9s"),
    h("div", {key:"q"}, TelQ(0)),
    h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q2 : "), EV.questions[1].enonce),
    h("div", {key:"a", className:"tel-actions"},
      TelBtn("⏭️ Tour suivant", "vert", "large"),
      h("div", {className:"g2"}, TelBtn("⏸️ Pause", "ghost", "small"), TelBtn("🔄 Chrono", "ghost", "small")),
      h("div", {className:"g3"}, TelBtn("+5s", "jaune", "small"), TelBtn("+10s", "jaune", "small"), TelBtn("+30s", "jaune", "small"))),
    h("div", {key:"st"}, TelStats(0, [])),
    h("div", {key:"l"}, TelListe("TABLETTES — 10 / 12 ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "✓+ une en trop", "½ une sur deux", "✗ faux", "🙈 attend son tour", "⏳ répond"])),
    h("div", {key:"t"}, TelBtn("🛑 Terminer la session", "rouge", "small"))]);
}
function TelCorrAvant(){
  var nonDit = ["Michel", "Tom", "Hugo", "Sacha", "Rayan", "Théo"];
  var modeDe = function(p){ return nonDit.indexOf(p) >= 0 ? {mode:"pasrecopie"} : {mode:"recopie"}; };
  return TelCadre([
    TelBandeau("Phase : correction — Q2 (1re sur 3)", "recopie de la feuille"),
    h("div", {key:"c", className:"tel-chrono orange"}, h("div", {className:"lb"}, "✍️ Temps pour recopier sa feuille"), "7s"),
    h("div", {key:"q"}, TelQ(1)),
    h("div", {key:"a", className:"tel-actions"},
      TelBtn("🔒 Révéler — il en manque 6", "or", "large", true),
      TelBtn("← Question précédente", "ghost", "small", true)),
    h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Pas encore recopié : "), nonDit.map(function(p){ return nomDe(p); }).join(" · "),
      h("div", {className:"ss"}, "Une tablette en panne : un clic sur le nom, puis « 🚫 Marquer comme parti »."),),
    h("div", {key:"l"}, TelListe("TABLETTES — 18 / 24 ont recopié leur feuille", modeDe)),
    h("div", {key:"lg"}, TelLegende(["✍️ a recopié", "⏳ pas encore recopié"])),
    h("div", {key:"t"}, TelBtn("🛑 Terminer la session", "rouge", "small"))]);
}
function TelCorrApres(){
  var q = EV.questions[1];
  var lire = aLire(0);
  var flagDe = function(p){ var f = null; calc(p).flags.forEach(function(x){ if(x.q === 1) f = x.txt === "recopie juste, tablette fausse" ? "≠ tablette" : "aucun"; }); return f; };
  var res = Object.keys(RF).map(function(p){ return calc(p).st[1]; });
  return TelCadre([
    TelBandeau("Phase : correction — Q2 (1re sur 3)", "révélée"),
    h("div", {key:"q"}, TelQ(1)),
    h("div", {key:"a", className:"tel-actions"},
      TelBtn("Question suivante →", "primary", "large"),
      TelBtn("← Question précédente", "ghost", "small", true)),
    h("div", {key:"x", className:"tel-expl"}, h("div", {className:"t"}, "💡 EXPLICATION"), q.explication),
    h("div", {key:"su", className:"tel-suivi"}, "D'après la feuille : ", h("strong", null, res.filter(function(s){ return s === "j"; }).length + " / 24 justes"), " · ＋ Trouvées : ", h("strong", null, res.filter(function(s){ return s === "t"; }).length)),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + lire.length + ") : "), lire.map(function(x){ return nomDe(x.p) + " — Q" + (x.q+1) + " : " + x.txt; }).join(" · ")),
    h("div", {key:"st"}, TelStats(1, [0, 1, 2])),
    h("div", {key:"l"}, TelListe("TABLETTES — d'après la feuille", function(){ return {qi:1, mode:"corr"}; }, flagDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "＋ Trouvée au dernier moment", "✗ faux", "≠ tablette : recopie juste, tablette fausse"])),
    h("div", {key:"t"}, TelBtn("🛑 Terminer la session", "rouge", "small"))]);
}
function TelEleve(){
  var modeDe = function(p){ return p === "Théo" ? {mode:"pasrep"} : {qi:1, mode:"q"}; };
  var fond = TelCadre([
    TelBandeau("Phase : question close — Q 2/3", null),
    h("div", {key:"q"}, TelQ(1)),
    h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q3 : "), EV.questions[2].enonce),
    h("div", {key:"a", className:"tel-actions"},
      h("button", {className:"tel-btn tb-primary tb-large", "data-va":"t-q3-tour1"}, "🚀 Lancer Q3"),
      h("button", {className:"tel-btn tb-ghost tb-small", "data-va":"c-rouvrir-tous"}, "🔓 Rouvrir Q2 pour tous")),
    h("div", {key:"st"}, TelStats(1, [0, 1])),
    h("div", {key:"l"}, TelListe("TABLETTES — 23 / 24 ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"t"}, h("button", {className:"tel-btn tb-rouge tb-small", "data-va":"c-terminer"}, "🛑 Terminer la session"))]);
  var feuille = h("div", {className:"tel-sheet-fond", "data-echap":"c-q2-close"},
    h("div", {className:"tel-sheet"},
      h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".5rem"}}, h("strong", {style:{fontSize:"1rem"}}, "CHEVALLIER Théo"), h("button", {className:"tel-x", "data-va":"c-q2-close", title:"Ferme la fiche de l'élève sans rien changer."}, "✕")),
      h("div", {style:{fontSize:".78rem", opacity:.85, marginBottom:".6rem"}}, "Tablette 12, moitié de gauche · avec ZELLER Lou"),
      h("button", {className:"tel-btn tb-turq", "data-va":"t-rouvrir-un"}, "🔁 Rouvrir Q2 pour cet élève uniquement (une seule fois)"),
      h("button", {className:"tel-btn tb-rouge", "data-va":"c-parti"}, "🚫 Marquer comme parti en cours de séance"),
      h("div", {className:"tel-etat"}, "État actuel : n'a pas encore répondu. Pendant son tour, Lou porte le voile.")));
  return h(F, null, fond, feuille);
}

/* ════════════════════════ LE TABLEAU (vue projetée) ════════════════════════ */
function BoardAside(mode){
  var noms = [].concat.apply([], PAIRES).filter(Boolean).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  return h("aside", {className:"board-aside-eleves"},
    h("div", {className:"board-aside-titre"}, "👥 Classe (25)"),
    h("div", {className:"board-aside-liste"}, noms.concat(["YVON Adam"]).sort(function(a, b){ return a.localeCompare(b, "fr"); }).map(function(n){
      var p = pre(n), cls = "board-aside-eleve ";
      if(n === "YVON Adam") cls += "absent";
      else if(mode === "reponse") cls += (["Jade", "Anna"].indexOf(p) >= 0 || !PAIRES.some(function(pa){ return pa[PREMIER[0] === "J" ? 0 : 1] === n; })) ? "enattente" : "repondu";
      else if(mode === "recopie") cls += ["Michel", "Tom", "Hugo", "Sacha", "Rayan", "Théo"].indexOf(p) >= 0 ? "enattente" : "repondu";
      else cls += "repondu";
      var mots = n.split(" ");
      return h("div", {key:n, className:cls}, h("span", {className:"prenom"}, mots[mots.length - 1]), h("span", {className:"nom"}, mots.slice(0, -1).join(" ")));
    })));
}
function Cercle(reste, total, couleur, petit){
  return h("div", {className:petit ? "board-chrono-mini" : "board-chrono-cercle"},
    h("svg", {viewBox:"0 0 100 100", className:petit ? "board-chrono-svg-petit" : "board-chrono-svg"},
      h("circle", {cx:50, cy:50, r:46, fill:"none", stroke:"#1E293B", strokeWidth:"6"}),
      h("circle", {cx:50, cy:50, r:46, fill:"none", stroke:couleur, strokeWidth:"6", strokeDasharray:"289", strokeDashoffset:289 * (1 - reste / total), transform:"rotate(-90 50 50)"})),
    h("div", {className:petit ? "board-chrono-texte-petit" : "board-chrono-texte"}, reste + "s"));
}
function Board(mode){
  var qi = mode === "reponse" ? 0 : 1, q = EV.questions[qi];
  var bandeau = h("div", {className:"board-bandeau-haut"},
    h("span", {className:"board-classe-mini"}, CLASSE),
    h("span", {className:"board-niveau-pastille", style:{background:NIV[q.niveau].color}}, NIV[q.niveau].label),
    h("span", {className:"board-q-count"}, mode === "reponse" ? "Question 1 / 3" : "Correction — Q2 / 3"),
    mode !== "correction" && h("span", {className:"board-progress"}, mode === "reponse" ? "✋ 10 / 24 ont répondu" : "✍️ 18 / 24 ont répondu"));
  var corps;
  if(mode === "reponse"){
    corps = h("div", {className:"board-active board-reflexion"}, bandeau,
      h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
      h("div", {className:"board-chrono-zone"},
        h("div", {className:"board-chrono-label"}, "📕 POSE TON STYLO."),
        Cercle(9, q.reponse, "#EC4899"),
        h("div", {className:"board-chrono-sub"}, "Temps de réponse")));
  } else if(mode === "recopie"){
    corps = h("div", {className:"board-active board-reflexion recopie"}, bandeau,
      h("div", {style:{textAlign:"center", paddingTop:".6rem"}}, h("span", {className:"board-correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe")),
      h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
      h("div", {className:"board-chrono-zone"},
        h("div", {className:"board-chrono-label"}, "✍️ Qu'as-tu écrit sur ta feuille ?"),
        Cercle(7, q.reponse, "#EA580C"),
        h("div", {className:"board-chrono-sub"}, "Temps de réponse")));
  } else {
    corps = h("div", {className:"board-active board-correction"}, bandeau,
      h("div", {style:{textAlign:"center"}}, h("span", {className:"board-correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe")),
      h("div", {className:"board-reponse-enonce"}, q.enonce),
      h("div", {className:"board-choix-grille"}, q.choix.map(function(c, i){
        var bon = q.bonnes.indexOf(i) >= 0;
        return h("div", {key:i, className:"board-choix-item " + (bon ? "choix-bon" : "choix-mauvais")}, h("span", {className:"board-choix-texte"}, c), bon && h("span", {className:"board-choix-coche"}, "✓"));
      })),
      h("div", {className:"board-correction-bas"}, "✅ Bonnes réponses : " + q.bonnes.map(function(i){ return q.choix[i]; }).join(", ")),
      h("div", {className:"board-explication", style:{margin:"0 2rem 1.2rem"}}, h("div", {className:"board-explication-titre"}, "💡 Explication"), h("div", {className:"board-explication-texte"}, q.explication)));
  }
  return h("div", {className:"board-with-aside"}, h("div", {className:"board-main"}, corps), BoardAside(mode));
}

/* ════════════════════════ LES SCÈNES DU TOUR 603 ════════════════════════ */
SCENES = SCENES.concat([
  // Préparer
  {id:"c-evals", vue:"console", render:function(){ return Evaluations(null); }},
  {id:"c-collage", vue:"console", vh:1060, render:Collage},
  {id:"c-editeur", vue:"console", vh:2540, render:Editeur},
  {id:"c-feuille", vue:"console", render:Feuille},
  // Les gestes rares de la séance
  {id:"c-rouvrir-un", vue:"console", vh:920, render:RouvrirUn},
  {id:"t-rouvrir-un", vue:"tablette", render:TabletteTheo},
  {id:"c-interrompue", vue:"console", vh:1000, render:Interrompue},
  {id:"c-rattrapage", vue:"console", render:Rattrapage},
  {id:"c-sessions", vue:"console", vh:920, render:SessionsEnCours},
  // Le téléphone
  {id:"p-reponse", vue:"telephone", render:TelReponse},
  {id:"p-eleve", vue:"telephone", render:TelEleve},
  {id:"p-corr-avant", vue:"telephone", render:TelCorrAvant},
  {id:"p-corr-apres", vue:"telephone", render:TelCorrApres},
  // Le tableau
  {id:"b-reponse", vue:"tableau", render:function(){ return Board("reponse"); }},
  {id:"b-recopie", vue:"tableau", render:function(){ return Board("recopie"); }},
  {id:"b-correction", vue:"tableau", render:function(){ return Board("correction"); }},
  // Données
  {id:"c-seances", vue:"console", render:function(){ return ListeSeances(null); }},
  {id:"c-corbeille", vue:"console", vh:900, render:Corbeille},
  {id:"c-sauvegarde", vue:"console", render:Sauvegarde},
  // Le mode test
  {id:"c-test", vue:"console", render:ModeTest},
  // Côté élève, après
  {id:"e-mes-evals", vue:"eleve", render:MesEvaluations},
  {id:"e-bilan-lou", vue:"eleve", render:BilanLou}
]);

window.LISTE_SCENES = SCENES.map(function(s){ return {id:s.id, vue:s.vue, vh:s.vh || null}; });
function lireScene(){ var m = /scene=([^&]+)/.exec(location.hash || ""); return m ? m[1] : SCENES[0].id; }
function rendre(){
  var id = lireScene(), sc = SCENES.filter(function(s){ return s.id === id; })[0] || SCENES[0];
  document.body.className = "vue-" + sc.vue;
  ReactDOM.render(sc.render(), document.getElementById("root"));
  window.SCENE_PRETE = id;
}
window.addEventListener("hashchange", rendre);
rendre();

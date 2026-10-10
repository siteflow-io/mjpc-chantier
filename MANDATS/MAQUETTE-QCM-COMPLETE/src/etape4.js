/* ═══════════════ Étape 4 — le soir, les réglages, MJPC ═══════════════
   Ce qui change, point par point (PLAN-ETAPES-2-4.md, section « Étape 4 ») : les listes rangées et triées (465), la démo permanente (552 à 554),
   le collage et « Copier les erreurs pour l'instance de création d'éval » (466, 481), la garde de longueur (464), « 🎯 Ce qu'elle vérifie » (631),
   publier et rendre les copies, comme dans la correction de dictée (471), le PDF fermé tant que les copies ne sont pas rendues (609),
   la fiche avec « ⛔ Retirer le point d'autonomie » et « 📝 Bilan général » (436, 621 à 633), « Mes évaluations » (471), le bilan de l'élève
   qui finit par « 📝 Bilan » (623, 639), la sauvegarde et la corbeille (206, 552), le mode test (571 à 576), et dans MJPC les exclusions
   (585, 590) et les libellés élève des compétences (637). */
var LIB_OFF = {"c4-oral-01": "Comprendre et interpréter des messages et des discours oraux complexes", "c4-oral-02": "S'exprimer de façon maîtrisée en s'adressant à un auditoire", "c4-oral-03": "Participer de façon constructive à des échanges oraux", "c4-oral-04": "Exploiter les ressources expressives et créatives de la parole", "c4-lire-01": "Contrôler sa compréhension, devenir un lecteur autonome", "c4-lire-02": "Lire des textes non littéraires, des images et des documents composites (y compris numériques)", "c4-lire-03": "Lire des œuvres littéraires et fréquenter des œuvres d'art", "c4-lire-04": "Élaborer une interprétation de textes littéraires", "c4-ecrire-01": "Exploiter les principales fonctions de l'écrit", "c4-ecrire-02": "Adopter des stratégies et des procédures d'écriture efficaces", "c4-ecrire-03": "Exploiter des lectures pour enrichir son écrit", "c4-ecrire-04": "Passer du recours intuitif à l'argumentation à un usage plus maîtrisé", "c4-langue-01": "Consolider l'orthographe lexicale et grammaticale", "c4-langue-02": "Connaître les différences entre l'oral et l'écrit", "c4-langue-03": "Enrichir et structurer le lexique", "c4-langue-04": "Construire les notions permettant l'analyse et l'élaboration des textes et des discours", "c4-culture-01": "Mobiliser des références culturelles pour interpréter les textes et les créations artistiques et littéraires et pour enrichir son expression personnelle", "c4-culture-02": "Établir des liens entre des créations littéraires et artistiques issues de cultures et d'époques diverses", "tr-langages-01": "Comprendre les informations à l'écrit", "tr-langages-02": "Comprendre les informations à l'oral", "tr-langages-03": "S'exprimer pour se faire comprendre à l'écrit", "tr-langages-04": "S'exprimer pour se faire comprendre à l'oral", "tr-methodes-01": "Mémoriser", "tr-methodes-02": "S'impliquer dans les activités en classe et dans son travail personnel", "tr-methodes-03": "Réaliser un travail avec rigueur et soin", "tr-personne-01": "Adopter une attitude respectueuse", "tr-personne-02": "Coopérer et mutualiser", "tr-personne-03": "Être autonome et responsable"};

/* ════════ 📝 Évaluations : rangées par niveau (le niveau vient du chapitre, 317), un tri ; la démo en tête, permanente ════════ */
var NIVEAU_EV = {};   // le niveau de chaque évaluation, d'après son chapitre ; sans chapitre : à compléter
LISTE_EVALS.forEach(function(e){ NIVEAU_EV[e.titre] = e.chap ? e.chap.split(" ")[0] : null; });
function CarteEvaluations(){
  var s1 = useState("date"), tri = s1[0], setTri = s1[1];
  var s2 = useState({}), replies = s2[0], setReplies = s2[1];
  var s3 = useState([]), copies = s3[0], setCopies = s3[1];
  var liste = copies.concat(LISTE_EVALS);
  function cle(e){ return tri === "titre" ? e.titre : tri === "chapitre" ? (e.chap || "~") : e.cree.split("/").reverse().join(""); }
  var groupes = {}; liste.forEach(function(e){ var n = NIVEAU_EV[e.titre] === undefined ? (e.chap ? e.chap.split(" ")[0] : null) : NIVEAU_EV[e.titre]; var g = n || "Sans chapitre"; (groupes[g] = groupes[g] || []).push(e); });
  var ordreG = Object.keys(groupes).sort(function(a, b){ return a === "Sans chapitre" ? 1 : b === "Sans chapitre" ? -1 : a.localeCompare(b); });
  function ligne(e, i){
    return h("div", {key:e.titre + i, className:"eval-row"},
      h("div", null,
        h("div", {className:"eval-titre"}, e.titre),
        h("div", {className:"eval-meta"},
          h("span", null, "📚 " + (e.chap || "chapitre : —")),
          h("span", null, e.mode === "partiel" ? "✨ Partiel" : "🎯 Tout ou rien"),
          h("span", null, e.nq + " questions"),
          e.comp && h("span", null, "🧩 " + e.comp),
          h("span", null, "Créée le " + e.cree)),
        e.pret ? h("div", {className:"eval-etat ok"}, "✅ Prête à lancer · " + e.servi)
               : h("div", {className:"eval-etat manque"}, "⚠️ À compléter avant de la lancer : le chapitre, les deux temps de chaque question, les compétences, ce que chaque question vérifie")),
      h("div", {className:"eval-actions"},
        h("button", {className:"btn btn-sm " + (e.pret ? "btn-ghost" : "btn-primary"), "data-va":"x627-3-editeur", title:e.pret ? "Ouvre l'éditeur : énoncés, choix, temps, compétences, ce que chaque question vérifie. Une évaluation déjà passée garde ses notes." : "Ouvre l'éditeur pour compléter ce qui manque avant de pouvoir la lancer."}, e.pret ? "✏️ Modifier" : "✏️ Compléter"),
        h("button", {className:"btn btn-sm btn-ghost", "data-va":"c-feuille", title:"Montre la feuille des énoncés seuls, avec les points, à imprimer pour la classe."}, "🖨️ Imprimer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-local":"1", title:"Fait une copie de cette évaluation, modifiable et supprimable, en tête de sa liste.", onClick:function(){ setCopies([Object.assign({}, e, {titre:e.titre + " (copie)", cree:"10/10/2026", pret:false, servi:null})].concat(copies)); }}, "📋 Dupliquer"),
        h("button", {className:"btn btn-sm btn-rouge", "data-va":"c-eval-corbeille", title:"Met l'évaluation à la corbeille, après une confirmation : gardée un an, restaurable depuis 💾 Sauvegarde."}, "🗑️")));
  }
  return h("div", {className:"card"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem"}},
      h("h2", {style:{margin:0}}, "📝 Évaluations", InfoI("Tes évaluations, rangées par niveau (celui de leur chapitre), puis triées. La démo est en tête, pour tous les niveaux : elle est permanente.")),
      h("div", {className:"row"},
        h("label", {className:"tri-l"}, "Trier par ", h("select", {value:tri, title:"Trie chaque niveau par date de création, par titre ou par chapitre.", onChange:function(ev){ setTri(ev.target.value); }},
          h("option", {value:"date"}, "date"), h("option", {value:"titre"}, "titre"), h("option", {value:"chapitre"}, "chapitre"))),
        h("button", {className:"btn btn-or btn-sm", "data-va":"c-reglages-prompt", title:"Ouvre le prompt de création d'éval, à copier dans l'instance qui écrit le JSON."}, "🤖 Prompt IA"),
        h("button", {className:"btn btn-primary btn-sm", "data-va":"c-collage", title:"Colle le JSON d'une nouvelle évaluation : l'app le vérifie avant de l'enregistrer."}, "➕ Nouvelle évaluation"))),
    h("p", {style:{opacity:.8, margin:".4rem 0 0"}}, "Prépare ici tes évaluations : rédaction, relecture, impression. Le lancement en classe se fait dans « Pilotage classe »."),
    h("div", {className:"eval-row demo-eval"},
      h("div", null,
        h("div", {className:"eval-titre"}, "🎓 Démo — apprendre le déroulé", h("span", {className:"perm-chip"}, "🔒 Permanente")),
        h("div", {className:"eval-meta"}, h("span", null, "📚 tous les niveaux"), h("span", null, "🎯 Tout ou rien"), h("span", null, "3 questions"), h("span", null, "11 minutes")),
        h("div", {className:"eval-etat ok"}, "✅ Prête à lancer · rien ne compte : ni note, ni compétence · revient d'elle-même après toute purge")),
      h("div", {className:"eval-actions"},
        h("button", {className:"btn btn-sm btn-ghost", "data-va":"c-feuille", title:"Montre la feuille des énoncés de la démo, à imprimer."}, "🖨️ Imprimer"),
        h("button", {className:"btn btn-sm btn-ghost", "data-local":"1", title:"Fait de la démo une évaluation ordinaire, modifiable et supprimable : la démo elle-même ne change jamais.", onClick:function(){ setCopies([{titre:"🎓 Démo — apprendre le déroulé (copie)", nq:3, cree:"10/10/2026"}].concat(copies)); }}, "📋 Dupliquer"))),
    ordreG.map(function(g){
      var l = groupes[g].slice().sort(function(a, b){ var x = cle(a), y = cle(b); return tri === "date" ? y.localeCompare(x) : x.localeCompare(y); });
      var rep = !!replies[g];
      return h("div", {key:g, className:"niv-groupe"},
        h("button", {className:"niv-titre", "data-local":"1", "aria-expanded":!rep, title:rep ? "Déplie les évaluations de ce niveau." : "Replie les évaluations de ce niveau.", onClick:function(){ var o = Object.assign({}, replies); o[g] = !rep; setReplies(o); }},
          (rep ? "▸ " : "▾ ") + g + " · " + l.length + " évaluation" + (l.length > 1 ? "s" : "")),
        !rep && l.map(ligne));
    }));
}
function Evaluations(modale){ return Console("pilotage", "evals", h(F, null, h(CarteEvaluations), modale || null), false); }
function ScEvalCorbeille(){
  return Fenetre(Evaluations(null), "🗑️ Mettre cette évaluation à la corbeille ?", "Les Misérables — évaluation d'entraînement · 13 questions",
    h("p", null, "Elle part dans la corbeille du site, gardée un an, avec ses questions. Ses séances passées gardent leurs notes. Tu la restaures depuis 💾 Sauvegarde → 🗑️ Corbeille. La démo, elle, n'a pas de corbeille : elle est permanente."),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-evals", title:"Ne met rien à la corbeille."}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-sauvegarde", title:"Met l'évaluation à la corbeille, restaurable un an."}, "🗑️ Mettre à la corbeille")], "c-evals");
}

/* ════════ Le collage du JSON : les messages, la garde de longueur, « ce qu'elle vérifie », la durée ; copier les erreurs ════════ */
var ERREURS_COLLAGE = [
  "Question 4 : il manque le temps de réponse (« reponse »).",
  "Question 5 : il manque ce qu'elle vérifie (« verifie »), la courte phrase à l'infinitif du bilan de l'élève.",
  "Question 7 : 60 px de trop sur une demi-tablette. Raccourcis l'énoncé ou les choix, ou dis-moi que j'assume la longueur.",
  "Question 7 : la compétence « c4-oral-01 » n'est pas une compétence du chapitre (" + CHAP1 + ").",
  "Question 9 : 3 compétences ; une question en a une ou deux.",
  "La compétence « c4-culture-02 » n'est évaluée que par 2 questions (Q3, Q8) : il en faut au moins 3.",
  "La séance durerait 49 min : 4 min de plus que les 45 minutes utiles."
];
function CopierErreurs(){
  var s = useState(false), copie = s[0], setCopie = s[1];
  var texte = "Corrige ton JSON : " + ERREURS_COLLAGE.map(function(e, i){ return (i + 1) + ". " + e; }).join(" ") + " Renvoie le JSON complet.";
  return h("div", {className:"copier-z"},
    h("button", {className:"btn btn-or", "data-local":"1", title:"Copie les messages, numérotés, prêts à coller dans l'instance de création d'éval : « Corrige ton JSON : 1. … Renvoie le JSON complet. »", onClick:function(){ setCopie(true); }}, "📋 Copier les erreurs pour l'instance de création d'éval"),
    copie && h("div", {className:"copie-ok"}, h("strong", null, "✅ Copié. "), "À coller dans l'instance de création d'éval : ", h("span", {className:"copie-t"}, texte)));
}
// L'indication du champ JSON de la 7.7.1 (l. 6594), mot pour mot
var JSON_INDICATION = '{\n  "titre": "Mon évaluation",\n  "questions": [\n    {"enonce":"...","choix":[...],"bonnes":[0],"niveau":"standard"}\n  ]\n}';
function CollageQCM(){
  var s = useState(false), refait = s[0], setRefait = s[1];
  return h("div", {className:"modal"},
    h("button", {className:"modal-close", "data-va":"c-evals", title:"Ferme sans rien enregistrer."}, "✕"),
    h("h2", null, "➕ Nouvelle évaluation"),
    h("div", {className:"field"},
      h("label", null, "Coller le JSON de l'évaluation", InfoI("Le JSON que l'instance de création d'éval t'a rendu. L'app le vérifie : le format, le chapitre et ses compétences, chaque question sur une demi-tablette, ce qu'elle vérifie, la durée de la séance.")),
      h("textarea", {className:"json", readOnly:true, value:JSON_EX, placeholder:JSON_INDICATION, style:{minHeight:"260px"}})),
    h("div", {className:"row"},
      h("button", {className:"btn btn-ghost", "data-local":"1", title:"Revérifie le JSON collé.", onClick:function(){ setRefait(true); }}, "🔍 Vérifier le format"),
      h("button", {className:"btn btn-ghost", "data-va":"x627-3-editeur", title:"Ouvre l'éditeur sur une évaluation vide, sans JSON."}, "✨ Démarrer à blanc")),
    refait && h("div", {className:"fen-note"}, "🔍 Vérification refaite : les mêmes " + ERREURS_COLLAGE.length + " points."),
    h("div", {className:"preview-error"},
      h("div", {style:{marginBottom:".35rem"}}, "❌ Rien n'est enregistré : " + ERREURS_COLLAGE.length + " choses à corriger dans le JSON."),
      h("ol", {className:"msg-liste"}, ERREURS_COLLAGE.map(function(e, i){ return h("li", {key:i}, e); }))),
    h(CopierErreurs),
    h("div", {className:"preview-ok"}, "✅ Le reste est bon : chapitre « " + CHAP1 + " », mode tout ou rien, 12 questions, 4 compétences du chapitre ; la question 11 porte « longueur assumée » : elle passe, et sa moitié défilera seule."),
    h("div", {className:"row", style:{marginTop:"1rem"}}, h("button", {className:"btn btn-primary ferme", disabled:true, title:"S'ouvre quand le JSON n'a plus rien à corriger."}, "💾 Enregistrer l'évaluation")));
}
function Collage(){ return Evaluations(h("div", {className:"modal-back", "data-echap":"c-evals"}, h(CollageQCM))); }

/* ════════ L'éditeur : « 🎯 Ce qu'elle vérifie » (631), « longueur assumée » (464) ; chaque geste marque l'évaluation modifiée ════════ */
function QuestionEditeeQCM(q, marquer){
  var multi = q.bonnes.length > 1;
  var B = function(cls, txt, ti){ return h("button", {className:cls, "data-local":"1", title:ti, onClick:marquer}, txt); };
  function temps(lbl, v, unite, ti){ return h("label", {className:"ed-temps" + (v == null ? " manque" : "")}, lbl, h("input", {defaultValue:v == null ? "" : v, placeholder:"—", title:ti, onChange:marquer}), unite); }
  return h("div", {className:"preview-q editable" + (q.bonus ? " ed-bonus-q" : "")},
    h("div", {className:"preview-q-header"},
      h("div", {className:"preview-q-titre-row"},
        h("span", {className:"preview-q-num"}, "Q" + q.n, multi && h("span", {className:"multi-tag"}, "RÉPONSES MULTIPLES"), q.bonus && h("span", {className:"multi-tag bonus-tag"}, "BONUS"), q.assumee && h("span", {className:"multi-tag assumee-tag"}, "📏 LONGUEUR ASSUMÉE")),
        h("div", {className:"preview-q-actions"}, B("btn-mini", "↑", "Monte la question d'un rang."), B("btn-mini", "↓", "Descend la question d'un rang."), B("btn-mini btn-mini-supp", "🗑", "Retire la question de l'évaluation."))),
      h("div", {className:"preview-q-niveau-row"},
        h("span", {className:"ed-lbl"}, "Difficulté :"),
        ["facile","standard","approfondi","expert"].map(function(n){ return h("button", {key:n, className:"niv-pastille niv-" + n + (q.niveau === n ? "" : " inactif"), "data-local":"1", "aria-pressed":q.niveau === n, title:"Met la question en difficulté « " + NIV[n].label + " ».", onClick:marquer}, NIV[n].label); }))),
    h("textarea", {className:"preview-q-enonce-input", defaultValue:q.enonce, placeholder:"Énoncé de la question (autonome : l'élève doit pouvoir répondre sans voir les choix)", title:"L'énoncé, tel que l'élève le lit.", onChange:marquer}),
    h("div", {className:"ed-verif" + (q.verifie ? "" : " manque")},
      h("span", {className:"ed-lbl"}, "🎯 Ce qu'elle vérifie, pour le bilan de l'élève :", InfoI("Une courte phrase à l'infinitif, dans les mots de l'élève. Le bilan général s'en sert : « À revoir en priorité : … » quand l'élève rate la question, « Bravo, tu sais … » quand il réussit une question difficile. L'instance la remplit avec le prompt ; tu la corriges ici.")),
      h("input", {defaultValue:q.verifie || "", placeholder:"par exemple : trouver l'antécédent d'un pronom relatif", title:"Ce que vérifie la question, à l'infinitif.", onChange:marquer})),
    q.assumee && h("div", {className:"assumee-note"}, "📏 Longueur assumée : 60 px de trop sur une demi-tablette ; tu l'as dit à l'instance JSON. Sa moitié défilera seule, la page ne bouge pas."),
    h("div", {className:"ed-ligne"},
      temps("🧠 Réflexion", q.ref, "s", "Le temps de réflexion de cette question, en secondes."),
      temps("✋ Réponse", q.rep, "s par tour", "Le temps de réponse de cette question, pour chaque tour, en secondes."),
      h("span", {className:"ed-comps"}, h("span", {className:"ed-lbl"}, "🧩 Compétences (1 ou 2) :"),
        q.comps.length ? q.comps.map(function(c){ return h("span", {key:c, className:"comp-chip"}, c, h("button", {className:"x", "data-local":"1", title:"Retire cette compétence de la question.", onClick:marquer}, "✕")); }) : h("span", {className:"comp-chip manque"}, "aucune"),
        B("btn btn-ghost btn-sm", "+ ajouter ▾", "Ajoute une compétence du chapitre à la question."))),
    h("label", {className:"ed-bonus"}, h("button", {className:"ck" + (q.bonus ? " on" : ""), "data-local":"1", title:"Coche pour faire de cette question une question bonus.", onClick:marquer}, q.bonus ? "✓" : ""), "Question bonus : elle compte dans les points gagnés, pas dans le total"),
    h("div", {className:"preview-q-choix-edit"},
      q.choix.map(function(c, j){ var bon = q.bonnes.indexOf(j) >= 0;
        return h("div", {key:j, className:"preview-choix-edit" + (bon ? " bon" : "")},
          h("input", {type:"checkbox", className:"preview-choix-check", defaultChecked:bon, title:bon ? "Bonne réponse : un clic la décoche." : "Coche si c'est une bonne réponse.", onChange:marquer}),   // la case de la 7.7.1
          h("input", {className:"preview-choix-input", defaultValue:c, placeholder:"Texte du choix", title:"Le choix, tel que l'élève le lit.", onChange:marquer}),
          B("btn-mini btn-mini-supp", "✕", "Supprimer ce choix (minimum 2 choix par question).")); }),
      h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", style:{marginTop:".4rem", alignSelf:"flex-start"}, title:"Ajoute un choix à la question.", onClick:marquer}, "➕ Ajouter un choix")),
    h("div", {className:"preview-q-explication-zone"},
      h("label", {className:"preview-q-explication-label"}, "💡 Explication (affichée aux élèves lors de la correction)", InfoI("L'explication que l'élève lit après la révélation, sous la bonne réponse.")),
      h("textarea", {className:"preview-q-explication-input", defaultValue:q.expl, placeholder:"Explication de la bonne réponse (1-3 phrases)", title:"L'explication de la correction.", onChange:marquer})));
}
var Q_ASSUMEE = {n:11, enonce:"Quelle est l'architecture de « La lettre que ma mère m'a écrite, et que j'ai relue tous les soirs, me rappelle la maison où j'ai grandi » ?", choix:["P.P + PSR + PSR coordonnées, dans la P.P","Deux P.I juxtaposées","P.P + une seule PSR","P.P + PSR, puis une P.I"], bonnes:[0], niveau:"approfondi", ref:30, rep:25, comps:["c4-langue-04"], verifie:"trouver l'architecture d'une phrase complexe", assumee:true, expl:"Les deux relatives, coordonnées par « et », complètent « La lettre », dans la proposition principale."};
function EditeurQCM(){
  var s = useState(0), modifs = s[0], setModifs = s[1];
  function marquer(){ setModifs(modifs + 1); }
  var comps = [["c4-lire-04", "majeure", "Q3, Q6, Q7, Q9", 4], ["c4-langue-04", "mineure", "Q2, Q4, Q5, Q8, Q11", 5], ["c4-culture-01", "mineure", "Q1, Q3, Q7", 3]];
  return h("div", {className:"modal", style:{maxWidth:"980px"}},
    h("button", {className:"modal-close", "data-va":"c-evals", title:"Ferme l'éditeur ; ce qui n'est pas enregistré est perdu."}, "✕"),
    h("h2", null, "✏️ Compléter l'évaluation"),
    // le JSON, puis « 🔍 Vérifier le format », au-dessus de l'éditeur visuel, comme dans la 7.7.1 (l. 6594 à 6597)
    h("div", {className:"field"}, h("label", null, "JSON de l'évaluation"),
      h("textarea", {className:"json", placeholder:JSON_INDICATION, title:"Colle ici un JSON corrigé : « 🔍 Vérifier le format » le recharge dans l'éditeur.", style:{minHeight:"70px"}, onChange:marquer})),
    h("div", {className:"row"}, h("button", {className:"btn btn-ghost", "data-local":"1", onClick:marquer}, "🔍 Vérifier le format")),
    h("div", {className:"preview"},
      h("div", {className:"preview-titre-row"},
        h("input", {className:"preview-titre-input", defaultValue:"3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)", placeholder:"Titre de l'évaluation", title:"Le titre de l'évaluation.", onChange:marquer}),
        h("span", {className:"preview-titre-meta"}, "11 questions · 10 points + 1 bonus")),
      h("div", {className:"ed-chap"}, h("span", {className:"ed-lbl"}, "📚 Chapitre", InfoI("Le chapitre donne le niveau et les compétences permises : une compétence hors du chapitre est refusée.")),
        h("select", {defaultValue:"c", title:"Le chapitre de l'évaluation.", onChange:marquer}, h("option", {value:"c"}, "3e · Chapitre 1 — Poésie et peinture au XIXe siècle"))),
      h("div", {className:"preview-mode-row", style:{marginBottom:".8rem", padding:".7rem .9rem", background:"#FFF9E6", border:"2px solid #FFD23F", borderRadius:"10px"}},
        h("div", {style:{fontWeight:900, fontSize:".9rem", color:"#8B6914", marginBottom:".4rem"}}, "📊 Mode de scoring", InfoI("Tout ou rien : 1 point si la réponse est exacte. Partiel : une part du point par bonne case, autant de retiré par mauvaise, plancher 0.")),
        h("div", {style:{display:"flex", gap:".5rem", flexWrap:"wrap"}},
          h("button", {className:"mode-choix on", "data-local":"1", "aria-pressed":true, title:"Le mode tout ou rien."}, h("span", {className:"rond on"}), h("span", null, "🎯 Tout ou rien", h("div", {className:"sous"}, "1 point si la réponse est exacte ; sinon 0"))),
          h("button", {className:"mode-choix", "data-local":"1", title:"Passe l'évaluation en mode partiel.", onClick:marquer}, h("span", {className:"rond"}), h("span", null, "✨ Partiel", h("div", {className:"sous"}, "Une part du point par bonne case ; autant de retiré par mauvaise (plancher 0)"))))),
      h("div", {className:"ed-comp-box"},
        h("div", {className:"tt"}, "🧩 Les compétences de cette évaluation — chacune porte sur au moins 3 questions", InfoI("Chaque compétence doit porter sur au moins 3 questions, pour que les quatre niveaux de maîtrise soient possibles.")),
        comps.map(function(c){ return h("div", {key:c[0], className:"ed-comp-l"},
          h("span", {className:"c"}, c[0]), h("span", {className:"t"}, c[1]), h("span", null, LIB_OFF[c[0]]), h("span", {className:"q"}, c[2]), h("span", {className:"ok"}, "✅ " + c[3] + " questions")); }),
        h("div", {className:"ed-comp-autres"}, "Les autres compétences du chapitre, pas évaluées ici : " + CHAP1_AUTRES.join(" · "))),
      modifs > 0 && h("div", {className:"ed-modif"}, "⚠ Modifications non enregistrées (" + modifs + ")"),
      h("p", {style:{fontSize:".85rem", color:"var(--gris)", margin:".6rem 0 .8rem"}}, "Édite directement chaque champ. Coche les bonnes réponses. Le niveau dit la difficulté ; les deux temps se règlent pour chaque question."),
      QuestionEditeeQCM(INTERRO[0], marquer),
      QuestionEditeeQCM(INTERRO[1], marquer),
      h("div", {className:"ed-replie"}, "Q3 à Q9 : complètes (repliées pour la capture)"),
      QuestionEditeeQCM(INTERRO[2], marquer),
      QuestionEditeeQCM(Q_ASSUMEE, marquer),
      h("button", {className:"btn btn-ghost", "data-local":"1", style:{marginTop:".6rem"}, onClick:marquer}, "➕ Ajouter une question")),
    h("div", {className:"row", style:{marginTop:"1rem", alignItems:"center"}},
      h("button", {className:"btn btn-primary ferme", disabled:true, title:"S'ouvre quand il ne reste rien à compléter."}, "💾 Enregistrer l'évaluation"),
      h("span", {className:"ed-reste"}, "⚠️ Il reste à compléter : Q10, les deux temps, au moins une compétence et ce qu'elle vérifie.")));
}
function Editeur(){ return Evaluations(h("div", {className:"modal-back", "data-echap":"c-evals"}, h(EditeurQCM))); }
function Feuille(){
  return h("div", {className:"feuille-fond"},
    h("button", {className:"btn-fermer-impression", "data-va":"c-evals", title:"Ferme l'aperçu et revient à la liste des évaluations."}, "✕ Fermer"),
    h("div", {className:"feuille-a4"},
      h("div", {className:"feuille-impression visible", style:{padding:0}},
        h("div", {className:"feuille-header"},
          h("h1", null, "3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)"),
          h("div", {className:"ligne-info"},
            h("div", {className:"champ"}, h("strong", null, "Nom :"), h("div", {className:"blanc"})),
            h("div", {className:"champ"}, h("strong", null, "Classe :"), h("div", {className:"blanc"})),
            h("div", {className:"champ"}, h("strong", null, "Date :"), h("div", {className:"blanc"})))),
        INTERRO_ENONCES.map(function(e, i){
          return h("div", {key:i, className:"feuille-q-seul"}, h("span", {className:"n"}, "Question " + (i+1)), h("span", {className:"pt"}, i === 9 ? "bonus" : "1 pt"), h("div", {className:"e"}, e));
        }))),
    h("div", {className:"feuille-legende"}, "A4, à l'échelle : toute l'évaluation tient sur cette page."));
}

/* ════════ Données → Résultats : les séances, rangées par classe et par date, un tri ; publier et rendre les copies (471) ════════ */
var SEANCES = [
  {titre:EV.titre, classe:CLASSE, date:"08/10/2026 10:02", tri:"20261008", pres:"24 présents, 1 absent", lire:LIRE_SOIR.length},
  {titre:"3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)", classe:CLASSE, date:"24/09/2026 10:04", tri:"20260924", pres:"23 présents", rendues:"26/09"},
  {titre:"QCM — Le jambon-beurre", classe:CLASSE, date:"15/09/2026 10:03", tri:"20260915", pres:"25 présents", rendues:"17/09"}
];
function StatutCopies(p){   // p : etat ("lire" | "pret" | "rendues"), date, lire
  if(p.etat === "rendues") return h("button", {className:"statut-l15c rendues", "data-va":"c-resultats-rendues", title:"Les copies sont rendues aux élèves. Clic : le tableau de la séance."}, "copies rendues le " + p.date);
  if(p.etat === "pret") return h("button", {className:"statut-l15c rendre pulse-l15c", "data-va":"c-rendre", title:"Toutes les feuilles à lire sont lues. Clic : la garde de « Rendre les copies », puis un second clic les rend aux élèves."}, "rendre les copies ▸");
  return h("span", {className:"statut-l15c non-rendues", title:"Il reste des feuilles à lire : « rendre les copies ▸ » paraît quand toutes sont lues."}, "copies non rendues");
}
function CochePubliee(p){
  var s = useState(p.on !== false), on = s[0], setOn = s[1];
  return h("button", {className:"coche-publiee" + (on ? " on" : ""), "data-local":"1", title:"Décocher retire la séance de « Mes évaluations » des élèves tout de suite ; cocher la publie.", onClick:function(){ setOn(!on); }}, h("span", {className:"ck"}, on ? "✓" : ""), on ? "publiée" : "non publiée");
}
function ListeSeancesQCM(p){
  var s = useState("date"), tri = s[0], setTri = s[1];
  var l = SEANCES.slice().sort(function(a, b){ return tri === "evaluation" ? a.titre.localeCompare(b.titre) : tri === "classe" ? a.classe.localeCompare(b.classe) || b.tri.localeCompare(a.tri) : b.tri.localeCompare(a.tri); });
  return h("div", {className:"card"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem"}},
      h("h2", {style:{margin:0}}, "📊 Résultats", InfoI("Toutes les séances, rangées par classe, puis triées. Chacune a sa coche « publiée » et l'état de ses copies, comme dans la correction de dictée. La démo n'y paraît jamais.")),
      h("label", {className:"tri-l"}, "Trier par ", h("select", {value:tri, title:"Trie les séances par classe, par date ou par évaluation.", onChange:function(ev){ setTri(ev.target.value); }},
        h("option", {value:"classe"}, "classe"), h("option", {value:"date"}, "date"), h("option", {value:"evaluation"}, "évaluation")))),
    h("p", {style:{color:"var(--gris)", fontSize:".9rem", margin:".2rem 0 .8rem"}}, "Un clic sur « 📊 Ouvrir » ouvre le tableau de la séance."),
    h("div", {className:"niv-titre statique"}, "▾ " + CLASSE + " · " + l.length + " séances"),
    h("div", {className:"results-eval-list"}, l.map(function(x, i){
      var etat = x.rendues ? "rendues" : (x.titre === EV.titre ? p.etatEV : "lire");
      return h("div", {key:i, className:"results-eval-row"},
        h("div", null, h("div", {className:"titre"}, x.titre),
          h("div", {className:"meta"}, x.classe + " — " + x.date + " · ✅ terminée · " + x.pres,
            x.lire && etat === "lire" ? h("span", {className:"meta-lire"}, " · 📌 " + x.lire + " feuilles à lire") : x.lire ? h("span", {className:"meta-lus"}, " · ✔ " + x.lire + " feuilles lues") : null),
          h("div", {className:"seance-statuts"}, h(StatutCopies, {etat:etat, date:x.rendues || p.dateEV, lire:x.lire}), h(CochePubliee, {key:"p" + i}),
            etat === "rendues" && x.titre === EV.titre && h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-seances-lues", title:"Masque les copies : les élèves ne voient plus leur note ni leur bilan, jusqu'au prochain « Rendre les copies »."}, "🙈 Masquer les copies"))),
        h("div", {className:"row"},
          h("button", {className:"btn btn-ghost btn-sm", "data-va":etat === "rendues" ? "c-resultats-rendues" : "c-resultats", title:"Ouvre le tableau de la séance : les notes, les compétences, les feuilles à lire."}, "📊 Ouvrir"),
          h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-corbeille", title:"Met la séance à la corbeille, après une confirmation : gardée un an, restaurable."}, "🗑️")));
    })));
}
function ListeSeances(modale, etatEV, dateEV){ return Console("donnees", "results", h(F, null, h(ListeSeancesQCM, {etatEV:etatEV || "lire", dateEV:dateEV}), modale || null), false); }
function ScRendre(){
  return Fenetre(ListeSeances(null, "pret"), "📤 Rendre les copies ?", EV.titre + " — " + CLASSE + " — 08/10/2026 10:02",
    h(F, null,
      h("p", null, "✔ Les " + LIRE_SOIR.length + " feuilles à lire sont lues. ✔ Aucun présent sans lecture de sa feuille."),
      h("p", null, "Chaque élève voit, dans « Mes évaluations », sa note définitive, son bilan et le « 📝 Bilan » de sa fiche (validé, sinon celui de l'app). Le PDF « notes et compétences » s'ouvre."),
      h("p", {className:"fen-note"}, "« 🙈 Masquer les copies » les retire ensuite, jusqu'au prochain « Rendre les copies ».")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-seances-lues", title:"Ne rend rien."}, "Annuler"), h("button", {key:2, className:"btn btn-primary", "data-va":"c-copies-rendues", title:"Rend les copies aux élèves, tout de suite."}, "📤 Rendre les copies")], "c-seances-lues");
}
function Corbeille(){
  return Fenetre(ListeSeances(null), "🗑️ Mettre cette séance à la corbeille ?", EV.titre + " — " + CLASSE + " — 08/10/2026 10:02",
    h("p", null, "Elle part dans la corbeille du site, gardée un an, avec ses réponses, ses lectures et ses notes. Elle sort de cette liste. Rien n'est effacé : tu la restaures depuis ", h("strong", null, "💾 Sauvegarde → 🗑️ Corbeille"), "."),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-seances", title:"Ne met rien à la corbeille."}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-sauvegarde", title:"Met la séance à la corbeille, restaurable un an."}, "🗑️ Mettre à la corbeille")], "c-seances");
}

/* ════════ Le tableau d'une séance (442, 609), la fiche de l'élève (436, 621 à 633) ════════ */
var MARQUE_RES = {j:["cell-juste", "✓"], t:["cell-trouvee", "⛔"], a:["cell-faux", "∅"], f:["cell-faux", "✗"], pasdit:["cell-vide", "?"]};
function ResultatsQCM(p){
  var lignes = Object.keys(RF).map(function(x){ return {p:x, nom:nomDe(x), r:calc(x)}; }).sort(function(a, b){ return a.nom.localeCompare(b.nom, "fr"); });
  var s = useState(false), exporte = s[0], setExporte = s[1];
  var lire = function(x){ return LIRE_SOIR.filter(function(l){ return pre(l[0]) === x; }); };
  return h("div", {className:"card"},
    TitreCarte("📊 " + EV.titre + " — " + CLASSE, [
      h("button", {key:0, className:"btn btn-primary btn-sm", disabled:!p.rendues, "data-va":p.rendues ? "x632-pdf" : null, title:p.rendues ? "Ouvre l'impression du navigateur, « Enregistrer au format PDF » : une ligne par élève, la note, le niveau de chaque compétence, le commentaire." : "Fermé tant que les copies ne sont pas rendues : les notes ne sont définitives qu'à ce moment-là."}, "📄 PDF notes et compétences"),
      h("button", {key:1, className:"btn btn-or btn-sm", "data-local":"1", title:"Télécharge le tableau en CSV, pour un tableur.", onClick:function(){ setExporte(true); }}, "📥 Export CSV"),
      h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":p.rendues ? "c-copies-rendues" : "c-seances", title:"Revient à la liste des séances."}, "← Retour")]),
    exporte && h("div", {className:"fen-note"}, "📥 resultats-3-ESSAI-08-10-2026.csv téléchargé."),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, "08/10/2026 10:02 · 24 présents, 1 absent (YVON Adam) · questions écartées ou annulées : aucune · ",
      p.rendues ? h("strong", {style:{color:"#15803D"}}, "copies rendues le 10/10") : h("strong", {style:{color:"#9A3412"}}, LIRE_SOIR.length + " feuilles à lire")),
    h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet"},
      h("thead", null, h("tr", null,
        h("th", {className:"eleve-col", title:"Cliquer pour trier par nom (asc/desc). Cliquer sur un nom d'élève dans le tableau ouvre son Student Report (drill-down)."}, "Élève"),   // la 7.7.1, l. 8403
        EV.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i+1)); }),
        h("th", null, "Note"), h("th", null, "Sur 20"), h("th", null, "Maîtrise de la note"),
        COMPS.map(EnteteComp),
        h("th", null, "🤝 Autonomie"),
        h("th", null, "À lire sur la feuille"))),
      h("tbody", null, lignes.map(function(l){
        var m = maitriseDe(l.r.sur20), fl = lire(l.p);
        return h("tr", {key:l.p},
          h("td", {className:"eleve-cell"}, l.p === "Michel" ? h("button", {className:"nom-fiche", "data-va":"c-fiche", title:"Ouvre la fiche de Michel : sa feuille lue, sa tablette, ce qu'il a dit, son point d'autonomie, son bilan général."}, l.nom) : l.nom),
          l.r.st.map(function(x, i){ var c = MARQUE_RES[x]; return h("td", {key:i, className:c[0]}, c[1]); }),
          h("td", {className:"score-cell"}, l.r.complet ? l.r.n + "/3" : "—"),
          h("td", {className:"score-cell"}, l.r.complet ? fr1(l.r.sur20) : "—"),
          h("td", null, h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib)),
          COMPS.map(function(c){ return h("td", {key:c, className:"comp-cell"}, PillComp(l.r, c)); }),
          h("td", {className:"comp-cell"}, h("span", {className:"maitrise-pill mt-vert"}, "🟢 Très bonne maîtrise")),
          h("td", {className:"alire-cell" + (fl.length ? "" : " vide")}, fl.map(function(x){ return "Q" + (x[1]+1) + " : " + x[2] + (p.rendues || p.lues ? " · ✔ lue" : ""); }).join(" · ")));
      })))),
    h("div", {className:"legende-res"}, "✓ juste d'après la feuille · ⛔ Trouvée au dernier moment · ✗ faux · ∅ « aucun de ces choix » · ⚠️ Annulée ou ❌ Écartée : la question garde sa marque en tête de colonne"));
}
function Resultats(fiche, modale){ return Console("donnees", "results", h(F, null, h(ResultatsQCM, {}), modale || null), false); }
var DIT_M = ["Non, autre chose", "Oui, la même chose", "Non, autre chose"];
function entreeBilan(p){   // ce que l'app donne à com632.js pour le bilan général d'un élève (626 à 632)
  var r = calc(p), m = maitriseDe(r.sur20), idx = ["rouge","orange","bleu","vert"], est = ESTIM[p];
  var pts = r.pts;
  if(p === "Lou"){ pts = [1, 0, 0]; m = maitriseDe(20 / 3); est = "bleu"; }   // le bilan de Lou : sa question 3 corrigée d'après sa feuille
  var iE = idx.indexOf(est), iR = idx.indexOf(m.k);
  return {niveau:m.k, mode:"strict", autonomieRetiree:false, autonomieLibs:[LIB_ELEVE["tr-personne-03"], LIB_ELEVE["tr-methodes-02"]],
    questions:EV.questions.map(function(q, i){ return {n:i + 1, verifie:VERIF_M[i], pts:pts[i] || 0, niveau:q.niveau, taux:tauxQ(i)}; }),
    estimation:est ? (iE === iR ? "ok" : iE > iR ? "sur" : "sous") : null, ecart:Math.abs(iE - iR)};
}
function texteBilan(entree){ return commentaireQCM(entree).map(function(x){ return x.t; }).join(""); }
function CarteBilanGeneral(p){
  var entree = entreeBilan(p.eleve), base = texteBilan(entree);
  var s1 = useState(base), texte = s1[0], setTexte = s1[1];
  var s2 = useState(false), valide = s2[0], setValide = s2[1];
  return h("div", {className:"card bilan628"},
    h("h3", null, "📝 Bilan général", InfoI("Texte pré-rempli automatiquement à partir de ses résultats : sa note, les questions qu'il a ratées et les questions difficiles qu'il a réussies (avec ce que chacune vérifie), son point d'autonomie, son estimation. Modifie-le si tu veux, puis valide. C'est ce texte qui finit son bilan quand sa copie lui est rendue, et qui va dans la ligne « Commentaire » du PDF « notes et compétences ».")),
    h("textarea", {className:"ta628 ta-bilan", value:texte, "data-com":texte === base ? JSON.stringify(entree) : null, title:"Le bilan général de l'élève : modifie-le si tu veux.", onChange:function(ev){ setTexte(ev.target.value); setValide(false); }}),
    h("div", {className:"pied628"},
      h("span", {className:"st628"}, valide ? "✅ Bilan validé le 10/10" : texte === base ? "Pré-rempli par l'app" : "⚠ Modifications non validées"),
      h("div", {style:{display:"flex", gap:6}},
        h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:texte === base, title:texte === base ? "Le texte est déjà celui de l'app." : "Remet le texte calculé par l'app, d'après ses résultats.", onClick:function(){ setTexte(base); setValide(false); }}, "↻ Regénérer"),
        h("button", {className:"btn btn-primary btn-sm", "data-local":"1", disabled:valide, title:valide ? "Le bilan est déjà validé." : "Valide ce texte : c'est lui qui ira sur sa copie et dans le PDF.", onClick:function(){ setValide(true); }}, "✓ Valider le bilan"))));
}
function LueBouton(){
  var s = useState(false), lue = s[0], setLue = s[1];
  return h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:lue, title:lue ? "Feuille lue : le signalement est passé à « lu »." : "Tu as lu sa feuille et elle dit bien ce qui est compté : le signalement passe à « lu ».", onClick:function(){ setLue(true); }}, lue ? "✔ lue" : "✔ Marquer lue");
}
function FicheMichel(retire){
  var r = calc("Michel");
  return h("div", {className:"student-report"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}},
      h("h3", null, "👤 DUVERNAY Michel — 1 / 3 · 6,7 / 20 · 🟠 Maîtrise fragile", InfoI("Pour chaque question : ce que Julien a lu sur sa feuille à la correction, ce qu'il a cliqué sur la tablette, ce qu'il a dit à la fin de son temps (B). « La feuille dit autre chose » corrige une question d'après sa feuille.")),
      h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats", title:"Ferme la fiche et revient au tableau de la séance."}, "✕ Fermer")),
    h("div", {className:"fiche-head fiche-head-b"}, h("span", null, ""), h("span", null, "Question"), h("span", null, "Sa feuille, lue par Julien"), h("span", null, "Sa tablette"), h("span", null, "Ce qu'il a dit (B)"), h("span", null, "Bonne réponse"), h("span", null, "Points"), h("span", null, "")),
    EV.questions.map(function(q, qi){
      var f = qi === 0 ? [2] : LU.M[qi], t = TABL.M[qi], s = r.st[qi];
      function txt(a){ return a === "aucun" ? "aucun de ces choix" : a.map(function(i){ return q.choix[i]; }).join(", "); }
      var tJ = JSON.stringify(t.slice().sort()) === JSON.stringify(q.bonnes.slice().sort());
      var fl = LIRE_SOIR.filter(function(l){ return l[0] === "DUVERNAY Michel" && l[1] === qi; })[0];
      return h("div", {key:qi, className:"fiche-q fiche-q-b"},
        h("span", {className:"num"}, "Q" + (qi+1)),
        h("span", null, q.enonce, h("div", {className:"fiche-comp"}, "🧩 " + q.competences.join(" · ")),
          qi === 0 && h("div", null, h("span", {className:"flag ok"}, "corrigée en classe : raison donnée à Michel (Rome)")),
          fl && h("div", null, h("span", {className:"flag"}, "⚠️ " + fl[2]))),
        h("span", {className:"val " + (s === "j" ? "j" : "f")}, txt(f)),
        h("span", {className:"val " + (tJ ? "j" : "f")}, txt(t)),
        h("span", {className:"val"}, DIT_M[qi]),
        h("span", {className:"val"}, txt(q.bonnes)),
        h("span", {className:"pts"}, r.pts[qi] + " pt"),
        h("span", {className:"fiche-acts"},
          fl && h(LueBouton),
          h("button", {className:"btn btn-ghost btn-sm", "data-va":qi === 2 ? "c-que-dit-la-feuille" : "c-que-dit-la-feuille", title:"Ouvre les choix de la question : tu cliques ce que dit sa feuille, et sa note se recalcule (« Corrigé d'après ta feuille » dans son bilan)."}, "La feuille dit autre chose")));
    }),
    h("div", {className:"fiche-comps"}, h("div", {className:"tt"}, "🧩 Ses compétences"),
      COMPS.map(function(c){ var m = niveauComp(r, c), x = r.comp[c];
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, LIB_OFF[c]), h("span", {className:"d"}, detailComp(r, c) + " → " + x.n + "/" + x.max), h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib)); }),
      ["tr-personne-03", "tr-methodes-02"].map(function(c){
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, LIB_OFF[c]), h("span", {className:"d"}, "le point d'autonomie"),
          h("span", {className:"maitrise-pill " + (retire ? "mt-rouge" : "mt-vert")}, retire ? "🔴 Maîtrise insuffisante" : "🟢 Très bonne maîtrise"));
      }),
      h("div", {className:"fiche-auto"}, retire
        ? h(F, null, h("span", null, "🔴 Point d'autonomie retiré le 10/10 à 19:12."), h("button", {className:"btn btn-vert btn-sm", "data-va":"c-fiche", title:"Rend son point d'autonomie à Michel : ses deux compétences d'autonomie repassent en Très bonne maîtrise."}, "↩️ Rendre"))
        : h(F, null, h("span", null, "Il a gardé son point d'autonomie."), h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-fiche-garde", title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. La note ne bouge pas. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")))));
}
function ScFiche(retire){
  return Console("donnees", "results", h(F, null, h("div", {className:"card"}, FicheMichel(retire), h(CarteBilanGeneral, {eleve:"Michel"}))), false);
}
function ScFicheGarde(){
  return Fenetre(ScFiche(false), "⛔ Retirer le point d'autonomie à DUVERNAY Michel ?", "Le soir, d'après ta lecture de ses feuilles",
    h(F, null, h("p", null, "Ses deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». La note ne bouge pas."),
      h("p", {className:"fen-note"}, "Son bilan général le dira, et son bilan quand sa copie lui sera rendue : « " + AUTO[0] + " » et « " + AUTO[1] + " » non atteintes.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-fiche", title:"Ne retire rien."}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-fiche-retire", title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")], "c-fiche");
}
function ScQueDitLaFeuille(){
  var q = EV.questions[2];
  return h(F, null, ScFiche(false), h("div", {className:"checkin-overlay", "data-echap":"c-fiche"},
    h("div", {className:"checkin-modal", style:{maxWidth:"460px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "Que dit la feuille ?"), h("div", {className:"checkin-sub"}, "DUVERNAY Michel — Q3 · " + q.enonce)),
      h("div", {style:{padding:".6rem 1.2rem 0", fontSize:".85rem", color:"var(--gris)"}}, "Julien a lu « Sa feuille ne dit aucun de ces choix ». Clique sur ce que dit sa feuille."),
      h("div", {className:"qdf-choix"},
        q.choix.map(function(c, i){ return h("div", {key:i, className:"qdf-c", title:"Clique si la feuille de Michel dit « " + c + " »."}, h("span", null, c), h("span", {className:"tg"}, q.bonnes.indexOf(i) >= 0 ? "bonne réponse" : "")); }),
        h("div", {className:"qdf-c aucun sel", title:"Garde « aucun des choix » : la question reste à 0, et le signalement passe à « lu »."}, h("span", null, "Aucun des choix"), h("span", {className:"tg"}, "lu par Julien"))),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost", "data-va":"c-fiche", title:"Ferme sans rien changer."}, "Annuler"), h("button", {className:"btn btn-primary", "data-va":"c-fiche", title:"Applique ce que dit la feuille : la question se recalcule, et le signalement passe à « lu »."}, "Valider")))));
}

/* ════════ Côté élève : « Mes évaluations » (471), le bilan rendu qui finit par « 📝 Bilan » (623, 639) ════════ */
var LOU = {nom:"ZELLER Lou", prenom:"Lou", sexe:"F"};
function MesEvaluations(rendue){
  var items = [
    {titre:EV.titre, l:rendue ? "08/10/2026 · 1 / 3 · 6,7 / 20 · 🟠 Maîtrise fragile" : null, etat:rendue ? "bilan" : "relecture"},
    {titre:"3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)", etat:"absente"},
    {titre:"QCM — Le jambon-beurre", l:"15/09/2026 · 6 / 10 · 12 / 20 · 🔵 Maîtrise satisfaisante", etat:"bilan2"}
  ];
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card", style:{maxWidth:"700px"}},
      h("h1", null, "📊 Mes évaluations"),
      h("p", {style:{opacity:.8}}, LOU.nom),
      h("div", {className:"eleves-grid", style:{gridTemplateColumns:"1fr"}}, items.map(function(x, i){
        var actif = x.etat === "bilan";
        if(x.etat === "bilan2") return h("div", {key:i, className:"eleve-btn mes-ev"}, h("div", {style:{fontWeight:700}}, x.titre), h("div", {style:{fontSize:".86rem", opacity:.9, marginTop:".2rem"}}, x.l));
        return h("button", {key:i, className:"eleve-btn mes-ev " + x.etat, disabled:!actif, "data-va":actif ? "e-bilan-lou" : null,
          title:actif ? "Ouvre ton bilan." : x.etat === "relecture" ? "Ta copie n'est pas encore rendue." : "Tu n'as pas passé cette évaluation."},
          h("div", {style:{fontWeight:700}}, x.titre),
          h("div", {style:{fontSize:".86rem", opacity:.9, marginTop:".2rem"}},
            x.etat === "relecture" ? "En relecture : ta note sera visible quand ta copie te sera rendue" : x.etat === "absente" ? "Tu étais absente" : x.l));
      })),
      h("div", {style:{marginTop:"1.5rem"}}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-accueil"}, "← Retour"))));
}
function BilanLou(){
  var lignes = [{q:0, txt:"juste", pts:1, cls:"j"}, {q:1, txt:"faux", pts:0, cls:"f"}, {q:2, txt:"faux", pts:0, cls:"f", corr:true}];
  var m = maitriseDe(20 / 3), entree = entreeBilan("Lou");
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card", style:{maxWidth:"760px"}},
      h("button", {className:"btn btn-ghost btn-sm", "data-va":"e-mes-evals-rendue"}, "← Mes évaluations"),
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
              h("span", {className:"recap-comp"}, EV.questions[l.q].competences.map(function(c){ return LIB_ELEVE[c]; }).join(" · "))),
            h("span", {className:"pt"}, "→ " + l.pts + " point"));
        }))),
      h("div", {className:"bilan-bloc"}, h("h3", null, "Tes compétences"),
        COMPS.map(function(c){ return h("div", {key:c, className:"comp-l"},
          h("span", null, LIB_ELEVE[c], h("span", {className:"comp-q"}, "Q1 ✓ · Q2 ✗ · Q3 ✗ → 1/3")),
          h("span", {className:"mt"}, m.em + " " + m.lib)); }),
        AUTO.map(function(l){ return h("div", {key:l, className:"comp-l"}, h("span", null, l), h("span", {className:"mt"}, "✅ ", "atteinte")); })),
      h("div", {className:"bilan-calibration bilan-calib-sur"},
        h("h3", null, "🎯 Ton estimation"),
        h("div", {className:"bilan-calib-msg"}, "⚠️ Tu pensais avoir mieux fait"),
        h("div", {className:"bilan-calib-detail"}, "Tu pensais avoir 2 bonnes réponses 🔵 mais tu en as eu 1 sur 3 (1 bonne réponse 🟠). " + degreSurestime(1))),   // un niveau d'écart
      h("div", {className:"bilan-bloc bilan628-eleve"}, h("h3", null, "📝 Bilan"), h("p", {"data-com":JSON.stringify(entree)}, texteBilan(entree)))));
}

/* ════════ 💾 Sauvegarde, la corbeille (206), les purges (552 : la démo revient toujours) ════════ */
function Restaurer(){
  var s = useState(false), fait = s[0], setFait = s[1];
  return h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:fait, title:fait ? "Restaurée : elle a retrouvé sa place." : "Remet cet élément à sa place, tel qu'il était.", onClick:function(){ setFait(true); }}, fait ? "✔ restaurée" : "↩️ Restaurer");
}
function SauvegardeQCM(){
  var s1 = useState(false), exp = s1[0], setExp = s1[1];
  var s2 = useState(false), net = s2[0], setNet = s2[1];
  return h("div", {className:"card"},
    h("h2", null, "💾 Sauvegarde", InfoI("Exporter ou importer tout le QCM, avec les classes ; la corbeille ; la maintenance ; les purges. La démo est permanente : aucune purge ne l'efface.")),
    h("p", {style:{marginBottom:".8rem", color:"var(--gris)", fontSize:".9rem"}}, "Exporte ou importe l'ensemble de la base QCM (évaluations, sessions, réponses), avec les classes."),
    h("div", {className:"snapshot-row"},
      h("button", {className:"btn btn-primary", "data-local":"1", title:"Télécharge tout le QCM dans un fichier, à garder.", onClick:function(){ setExp(true); }}, "📥 Exporter snapshot"),
      h("button", {className:"btn btn-ghost", "data-va":"c-importer", title:"Remplace tout le QCM par un fichier exporté, après une confirmation : le QCM d'aujourd'hui part d'abord à la corbeille."}, "📤 Importer snapshot")),
    exp && h("div", {className:"fen-note"}, "📥 qcm-snapshot-2026-10-10.json téléchargé."),
    h("p", {style:{fontSize:".82rem", color:"var(--gris)", margin:".4rem 0 0", fontStyle:"italic"}}, "Avant d'importer, le QCM d'aujourd'hui part à la corbeille : rien n'est perdu."),
    h("div", {className:"sauv-zone"},
      h("h3", {className:"sauv-h"}, "🗑️ Corbeille", InfoI("Ce qui est supprimé dans le QCM, gardé un an. La démo n'y va jamais.")),
      h("p", {className:"sauv-p"}, "Ce que tu supprimes dans le QCM part ici, gardé un an. ↩️ le remet à sa place."),
      [["Séance", EV.titre + " — " + CLASSE + " — 08/10/2026 10:02", "mise à la corbeille le 08/10 à 18:40"],
       ["Évaluation", "Brouillon — Les figures de style (6 questions)", "mise à la corbeille le 05/10 à 21:12"]].map(function(c, i){
        return h("div", {key:i, className:"corb-l"}, h("span", {className:"k"}, c[0]), h("span", null, h("strong", null, c[1]), h("div", {className:"d"}, c[2])), h(Restaurer));
      })),
    h("div", {className:"sauv-zone"},
      h("h3", {className:"sauv-h"}, "🧹 Maintenance", InfoI("Pour les sessions restées ouvertes par erreur.")),
      h("p", {className:"sauv-p"}, "Si la vue tableau ou le pilotage te montrent des sessions fantômes (anciennes évaluations qui n'auraient pas dû rester actives), utilise le nettoyage ci-dessous."),
      h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", title:"Ferme les sessions restées actives par erreur ; une séance en cours n'est pas touchée.", onClick:function(){ setNet(true); }}, "🧹 Nettoyer les sessions zombies"),
      net && h("div", {className:"fen-note"}, "🧹 Aucune session zombie : rien à fermer.")),
    h("div", {className:"sauv-zone dashed"},
      h("h3", {className:"sauv-h rouge"}, "🗑️ Zone dangereuse", InfoI("Tout part d'abord à la corbeille, gardé un an. La démo revient à l'ouverture suivante, quelle que soit la purge.")),
      h("p", {className:"sauv-p"}, "Tout part d'abord à la corbeille, gardé un an. Pense quand même à exporter un snapshot."),
      h("div", {className:"row", style:{flexWrap:"wrap", gap:".5rem"}},
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-purger", title:"Met toutes les évaluations à la corbeille, après une confirmation. La démo reste."}, "🗑️ Purger les évaluations"),
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-purger", title:"Met tout le QCM à la corbeille, après une confirmation. La démo reste."}, "🗑️ Tout purger"))));
}
function Sauvegarde(){ return Console("donnees", "snapshot", h(SauvegardeQCM), false); }
function ScImporter(){
  return Fenetre(Sauvegarde(), "📤 Importer un snapshot ?", "Il remplace tout le QCM : évaluations, séances, réponses.",
    h(F, null, h("p", null, "Le QCM d'aujourd'hui part d'abord à la corbeille, gardé un an : rien n'est perdu. La démo revient d'elle-même à l'ouverture suivante.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-sauvegarde", title:"N'importe rien."}, "Annuler"), h("button", {key:2, className:"btn btn-primary", "data-va":"c-sauvegarde", title:"Choisis le fichier, puis il remplace le QCM ; l'ancien part à la corbeille."}, "📤 Choisir le fichier et importer")], "c-sauvegarde");
}
function ScPurger(){
  return Fenetre(Sauvegarde(), "🗑️ Purger les évaluations ?", "Toutes les évaluations partent à la corbeille, gardées un an.",
    h(F, null, h("p", null, "Leurs séances gardent leurs notes. La démo « 🎓 Démo — apprendre le déroulé » n'est pas touchée : elle est écrite dans l'app, et revient d'elle-même si elle manque."),
      h("p", {className:"fen-note"}, "Pense à exporter un snapshot avant.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-sauvegarde", title:"Ne purge rien."}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-sauvegarde", title:"Met toutes les évaluations à la corbeille, sauf la démo."}, "🗑️ Purger")], "c-sauvegarde");
}

/* ════════ Le mode test (571 à 576) : les gestes de la 7.7.1, et les six ajouts ════════ */
function MessageTest(p){   // les boutons 🔬 et 🎬 : chacun dit, sous lui, ce qu'il a fait
  var s = useState(null), msg = s[0], setMsg = s[1];
  return h("div", null,
    h("div", null, p.boutons.map(function(b, i){
      return h("button", {key:i, className:"btn btn-ghost btn-sm", "data-local":"1", style:{marginRight:".4rem", marginBottom:".4rem"}, title:b[1], onClick:function(){ setMsg(b[2]); }}, b[0]);
    })),
    msg && h("div", {className:"fen-note test-msg"}, msg));
}
var BOUTONS_EPROUVER = [
  ["🔒 Clôturer (chemin réel)", "Clôt la séance de test par la vraie fonction de l'app.", "🔒 Séance de test close par le chemin réel ; l'archive est écrite."],
  ["✏️ Modifier l'éval après coup", "Modifie l'évaluation de test après la séance, comme le ferait l'éditeur.", "✏️ Évaluation modifiée : les notes de la séance ne bougent pas."],
  ["⚖️ Vérifier que les notes n'ont pas bougé", "Compare les notes archivées à celles d'avant la modification.", "⚖️ Les 30 notes sont identiques."],
  ["⏱️ Faire expirer le chrono", "Fait expirer le temps en cours, quel qu'il soit : réflexion, réponse, « Oui / Non », lecture du voisin.", "⏱️ Le temps en cours a expiré."],
  ["🔄 Relire l'état", "Relit l'état de la séance de test au hub.", "🔄 État relu : question 3, réflexion."]
];
var BOUTONS_CAS = ["Le cas ambigu", "Un faux « Oui »", "Rien de dit à la fin du temps", "Un lecteur qui clique « aucun » partout", "Deux élèves d'accord pour mentir", "Trouvée au dernier moment", "Une tablette en panne", "Un départ en cours de séance"].map(function(t){
  return ["🎬 " + t, "Remplit les tablettes, les feuilles et les clics de ce cas, sur la démo, jusqu'à son moment ; tu joues la suite.", "🎬 Cas préparé : « " + t + " ». À toi de jouer la suite."];
});
function HautModeTest(phase){
  return h(F, null,
    h("div", {className:"prof-header"},
      h("h1", null, "🧪 Évaluation QCM", h("span", {className:"badge", style:{background:"var(--rose)", color:"#fff"}}, "MODE TEST")),
      h("div", {className:"row"},
        h(BoutonLocal, {cls:"btn btn-ghost btn-sm", txt:"📥 Exporter snapshot test", titre:"Télécharge l'état du mode test dans un fichier.", fait:"📥 Exporté"}),
        h("button", {className:"btn btn-primary btn-sm", "data-va":"c-qr", title:"Montre le QR de ton téléphone : il pilote le mode test comme une vraie séance."}, "📱 QR pilotage"),
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-evals", title:"Sort du mode test : la classe de test, ses séances et ses codes sont effacés ; la démo reste."}, "🗑️ Sortir et purger"))),
    h("div", {className:"test-info", style:{marginTop:".8rem"}},
      h("strong", null, "🔬 Éprouver les mécanismes livrés"),
      h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, "Ces boutons appellent les fonctions réelles de l'application, pas des copies."),
      h(MessageTest, {boutons:BOUTONS_EPROUVER}),
      h("div", {style:{fontSize:".85rem"}}, "Session : ", h("strong", null, phase === "avant" ? "pas encore lancée" : "en_cours"), " · énoncé ", h("strong", null, "non conservé"))),
    h("div", {className:"test-info"},
      h("strong", null, "🎬 Préparer un cas"),
      h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, "Remplit les tablettes, les feuilles et les clics d'un cas connu, sur la démo, jusqu'au moment du cas ; tu joues la suite. Il écrit au hub ce qu'écriraient les clics."),
      h(MessageTest, {boutons:BOUTONS_CAS})),
    h("div", {className:"test-info"},
      h("strong", null, "🎓 Entrer comme un élève"),
      h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, "Ouvre l'application élève telle qu'elle est : « Combien êtes-vous sur cette tablette ? », puis code, prénom et nom, puis le code du binôme. Exemple — ", h("strong", null, "AUDEBERT Élise"), " · code ", h("strong", null, "1000")),
      h("button", {className:"btn btn-ghost btn-sm", "data-va":"t-combien", title:"Ouvre le vrai portail élève, sur la classe de test."}, "👋 Ouvrir le portail élève"),
      h("div", {style:{fontSize:".85rem", marginTop:".4rem"}}, "▸ Voir tous les codes du bac à sable")),
    h("div", {className:"test-info"},
      h("strong", null, "Environnement de test isolé. "),
      "Classe fictive (30 élèves simulés, 15 tablettes), la démo par défaut. Tu pilotes en haut comme en classe, et tu joues les tablettes en bas. À la sortie, tout est purgé automatiquement, sauf la démo."));
}
function BoutonLocal(p){
  var s = useState(false), fait = s[0], setFait = s[1];
  return h("button", {className:p.cls, "data-local":"1", disabled:fait, title:fait ? p.fait : p.titre, onClick:function(){ setFait(true); }}, fait ? p.fait : p.txt);
}
function TabSimT(num, a, b, contenu, feuilles){
  return h("div", {key:num, className:"sim-cadre simt"},
    h("div", {className:"sim-titre simt-titre"}, h("span", null, "📱 Tablette " + num + " · " + a + (b ? " · " + b : "")),
      h("button", {className:"btn btn-ghost btn-sm simt-grand", "data-va":"x620-3-mode-test-en-grand", title:"Ouvre cette tablette à la taille d'une vraie, avec ses deux feuilles dessous : en grand, on joue."}, "🔍 Jouer en grand")),
    h("div", {className:"sim"}, h("div", {className:"sim-in"}, contenu)),
    feuilles && h("div", {className:"simt-feuilles"}, feuilles));
}
function ChampFeuille(nom, texte){
  return h("label", {className:"simt-f"},
    h("span", {className:"simt-fl"}, "📝 Feuille de " + pre(nom)),
    h("input", {className:"simt-fi" + (texte ? "" : " vide"), defaultValue:texte || "", placeholder:"vide : sa feuille dira ce qu'" + (TEST_F[pre(nom)] ? "elle" : "il") + " clique", title:"Ce que " + pre(nom) + " écrit sur sa feuille, avec ses mots : tu le tapes ici."}));
}
function TablettesSimulees(etape){
  var feuillesQ3 = {"AUDEBERT Élise":"parce qu'elle a 6 pattes", "AUGEREAU Gatien":"elle a 8 pattes", "BOIVIN Eden":"l'araignée a huit pattes, l'insecte six", "CALDEIRA Tiago":"8 pattes", "CESBRON Lili":"car elle a 8 pates"};
  return h(F, null,
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem", marginTop:".8rem"}},
      h("h2", {className:"test-section-title", style:{margin:0}}, "👥 Tablettes simulées", InfoI("Les 15 tablettes de la classe de test, chacune la vraie tablette en deux moitiés, en petit pour regarder ; « 🔍 Jouer en grand » pour jouer.")),
      h(BoutonLocal, {cls:"btn btn-primary btn-sm", txt:"🎲 Tous les élèves répondent", titre:"Fait répondre les 30 élèves au hasard, à l'étape en cours : les clics, le « Oui / Non », la lecture du voisin, la co-évaluation.", fait:"🎲 Les 30 élèves ont répondu"})),
    etape === "reflexion" && h("div", {className:"simt-aide"}, "Pendant la réflexion, tu tapes sous chaque tablette ce que chaque élève écrit sur sa feuille. La feuille est posée à côté de la tablette, comme en classe."),
    h("div", {className:"sims"}, TEST_PAIRES30.map(function(p, i){
      var a = eleveT(p[0], "J"), b = eleveT(p[1], "M");
      var contenu = etape === "avant" ? EcrCombien() : Tablette(EcrReflexion(a, 2, 18), EcrReflexion(b, 2, 18));
      var feuilles = etape === "reflexion" ? [h(F, {key:"a"}, ChampFeuille(p[0], feuillesQ3[p[0]])), h(F, {key:"b"}, ChampFeuille(p[1], feuillesQ3[p[1]]))] : null;
      return TabSimT(i+1, p[0], p[1], contenu, feuilles);
    })));
}
function ModeTestOuverture(){
  return avecTest(function(){
    var carte = h("div", {className:"card"},
      h("h2", null, "🎯 Lancer une nouvelle session", InfoI("Ta vraie console d'avant l'heure, sur la classe de test et la démo.")),
      h("div", {className:"lancer-grid"},
        h("div", null,
          h("div", {className:"field"}, h("label", null, "Classe", InfoI("La classe de test : 30 élèves fictifs, effacés à la sortie.")), h("select", {value:"c", readOnly:true, title:"La classe de test."}, h("option", {value:"c"}, "🧪 " + CLASSE_TEST + " (30 élèves)"))),
          h("div", {className:"field"}, h("label", null, "Évaluation", InfoI("La démo par défaut, ou n'importe quelle évaluation de ta liste.")), h("select", {value:"e", readOnly:true, title:"L'évaluation jouée en test."}, h("option", {value:"e"}, DEMO.titre + " (3 questions)"))),
          h("div", {className:"duree-box"}, DUREE_TXT),
          h("button", {className:"btn btn-primary", "data-va":"x620-2-mode-test-reflexion", title:"Ouvre l'appel de la classe de test, puis la séance, comme en classe."}, "🚀 Lancer la session")),
        h("div", {className:"binomes-box"},
          h("div", {className:"tt"}, "📱 Binômes proposés — dans l'ordre de la liste : la classe de test n'a pas de QCM précédent"),
          h("div", {className:"ss"}, "Glisse un nom sur un autre pour échanger deux élèves, ou sur une moitié vide pour l'y déplacer. Tu peux le faire jusqu'au bout de l'heure."),
          GrilleTablettes(TEST_PAIRES30, null, {grip:true, coin:" "}))));
    return h("div", {className:"prof-wrap cons"},
      DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
      h("div", {className:"prof full"},
        HautModeTest("avant"),
        h("div", {className:"test-prof-zone"},
          h("h2", {className:"test-section-title"}, "🎯 Panneau prof", InfoI("Le même panneau qu'en classe.")),
          h("div", {className:"simt-note"}, "Le même panneau qu'en classe, avant l'heure : choix de l'évaluation, binômes, puis l'appel au lancement."),
          carte),
        TablettesSimulees("avant")));
  });
}
function ModeTestSeance(st, etape){
  return avecTest(function(){
    var pilot = Pilot(st);
    var carte = pilot.props.children[1].props.children[2];
    return h("div", {className:"prof-wrap cons"},
      DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
      h("div", {className:"prof full"},
        HautModeTest("seance"),
        h("div", {className:"test-prof-zone"}, h("h2", {className:"test-section-title"}, "🎯 Panneau prof", InfoI("Ta vraie console de séance, sur la classe de test.")), carte),
        TablettesSimulees(etape)));
  });
}
function EcrDeclareDemo(e, qi, ordre, sel, chrono){
  var q = DEMO.questions[qi];
  return Page(CLASSE_TEST + " · " + e.nom, DEMO.titre, h("div", {className:"eleve-q-zone"},
    QHead(qi), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"fige"}, "⏱️ Temps fini : ton clic est enregistré."),
    h("div", {className:"eleve-choix long fige-choix"}, ordre.map(function(i){
      var moi = sel.indexOf(i) >= 0;
      return h("button", {key:i, className:"eleve-choix-btn" + (moi ? " selected" : ""), disabled:true, title:moi ? "Ton clic, figé : le temps de réponse est fini." : "Le temps de réponse est fini : ton clic ne change plus."}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"decl-b-titre"}, e.prenom + ", regarde ta feuille : dit-elle la même chose que ton clic ?"),
    h("div", {className:"decl-b-btns"}, h("button", {className:"decl-b-btn", title:"Élise dit que sa feuille dit la même chose que son clic."}, "Oui, la même chose"), h("button", {className:"decl-b-btn", title:"Élise dit que sa feuille dit autre chose que son clic."}, "Non, autre chose")),
    h("div", {className:"decl-b-chrono"}, "⏱️ " + chrono + " s")));
}
function ModeTestGrand(){
  var a = eleveT(TEST_NOMS[0], "J"), b = eleveT(TEST_NOMS[1], "M");
  var fond = ModeTestSeance({phase:"reponse", qi:2, tour:1, chrono:0, stats:statsQ("30/30", "14/15", "—", "3/3"), passees:[],
    etat:function(p, cote){ if(cote === "d") return {cls:"m-voile", st:"🙈 attend son tour"}; return p === "Élise" ? {cls:"m-repond", st:"✋ dit si sa feuille…"} : {cls:"m-dit", st:"a répondu"}; }}, "reflexion");
  var tab = avecTest(function(){ return Tablette(EcrDeclareDemo(a, 2, [2, 0, 3, 1], [1], 3), VoileN(b, a)); });
  return h(F, null, fond,
    h("div", {className:"grand-fond", "data-echap":"x620-2-mode-test-reflexion"},
      h("div", {className:"grand-boite"},
        h("div", {className:"grand-h"}, h("strong", null, "📱 Tablette 1 · " + a.nom + " · " + b.nom), h("span", {className:"grand-p"}, "en grand, à la taille d'une vraie tablette"),
          h("button", {className:"btn btn-rouge btn-sm", "data-va":"x620-2-mode-test-reflexion", title:"Referme la tablette et revient aux 15 tablettes en petit."}, "✕ Revenir aux 15 tablettes")),
        h("div", {className:"grand-tab"}, tab),
        h("div", {className:"simt-feuilles grand-f"}, ChampFeuille(a.nom, "parce qu'elle a 6 pattes"), ChampFeuille(b.nom, "elle a 8 pattes")),
        h("div", {className:"grand-note"}, "Élise a écrit « 6 pattes » et cliqué « huit pattes » au dernier moment : si elle répond « Oui », c'est un faux « Oui » ; ta console le relèvera à la correction."))));
}

/* ════════ MJPC : la fiche de la classe avec les exclusions (585, 590), l'éditeur de taxonomie avec les compétences (637) ════════ */
var NOMS_ESSAI = [].concat.apply([], PAIRES_AVANT).filter(Boolean).sort(function(a, b){ return a.localeCompare(b, "fr"); });
function exclusionsDe(n){ return EXCLUSIONS.filter(function(x){ return x[0] === n || x[1] === n; }).map(function(x){ return x[0] === n ? x[1] : x[0]; }); }
function PanneauProf(section, contenu){
  var lien = function(id, ic, txt, va){ return va ? h("button", {key:id, className:"tprof-section-btn" + (section === id ? " active" : ""), "data-va":va, "aria-pressed":section === id, title:"Ouvre la section « " + txt + " » du panneau prof."}, h("span", {className:"tps-icon"}, ic), txt)
                                                  : h("div", {key:id, className:"tprof-section-l"}, h("span", {className:"tps-icon"}, ic), txt); };
  return h("div", {className:"mjpc-page"},
    h("div", {className:"tprof-box"},
      h("div", {className:"tprof-header"}, h("div", {className:"tprof-header-title"}, "🛠 Panneau prof ", h("span", {className:"tprof-header-sub"}, "— configuration du site")),
        h("button", {className:"tprof-close", "data-va":"c-reglages", title:"Ferme le panneau prof de MJPC et revient aux Réglages du QCM."}, "✕")),
      h("div", {className:"tprof-body"},
        h("div", {className:"tprof-sidebar"},
          h("div", {className:"tprof-sidebar-label"}, "Vue d'ensemble"), lien("dashboard", "🏠", "Tableau de bord"),
          h("div", {className:"tprof-sidebar-label"}, "Personnes"), lien("classes", "🏫", "Classes"), lien("eleves", "👥", "Élèves & codes", "m-classe-exclusions"), lien("profil-test", "🧪", "Profil test"),
          h("div", {className:"tprof-sidebar-label"}, "Contenu"), lien("archi", "📂", "Architecture"), lien("archives", "📦", "Archives"), lien("corbeille", "🗑", "Corbeille"), lien("annonces", "📢", "Annonces aux élèves"), lien("brevet", "🎓", "Dates de l'année"), lien("taxo", "📚", "Taxonomie", "m-taxonomie-competences"), lien("edt", "📅", "Emploi du temps"),
          h("div", {className:"tprof-sidebar-label"}, "Système"), lien("config", "⚙", "Configuration & Firebase"), lien("presence", "📡", "Présence live")),
        h("div", {className:"tprof-content"}, contenu))));
}
function ListeExclusions(p){
  var s1 = useState(p.ouvert), ouvert = s1[0], setOuvert = s1[1];
  var init = {}; NOMS_ESSAI.forEach(function(n){ init[n] = exclusionsDe(n); });
  if(p.trois){ init[p.ouvert] = ["CARRÉ Tom", "OLLIVIER Sacha", "QUINTON Enzo"]; ["OLLIVIER Sacha", "QUINTON Enzo"].forEach(function(x){ init[x] = init[x].concat([p.ouvert]); }); }
  var s2 = useState(init), ex = s2[0], setEx = s2[1];
  var s3 = useState(p.refus || null), refus = s3[0], setRefus = s3[1];
  function basculer(a, b){
    var la = ex[a] || [], lb = ex[b] || [];
    if(refus && refus[1] === b){ setRefus(null); return; }
    if(la.indexOf(b) >= 0){ var o = Object.assign({}, ex); o[a] = la.filter(function(x){ return x !== b; }); o[b] = lb.filter(function(x){ return x !== a; }); setEx(o); setRefus(null); return; }
    if(la.length >= 3){ setRefus([a, b, a]); return; }
    if(lb.length >= 3){ setRefus([a, b, b]); return; }
    var o2 = Object.assign({}, ex); o2[a] = la.concat([b]); o2[b] = lb.concat([a]); setEx(o2); setRefus(null);
  }
  return h("div", {className:"el-list"}, NOMS_ESSAI.map(function(n, i){
    var l = ex[n] || [], ouv = ouvert === n;
    return h("div", {key:n, className:"el-bloc"},
      h("div", {className:"el-row el-row-ex"},
        h("span", {className:"el-num"}, i + 1),
        h("span", {className:"el-name"}, n),
        h("span", {className:"el-code"}, h("span", {className:"secu-masque"}, "✻✻✻✻")),
        h("button", {className:"ex-btn" + (l.length ? " a" : "") + (ouv ? " ouv" : ""), "data-local":"1", "aria-expanded":ouv, title:"Les camarades avec qui " + pre(n) + " n'est jamais sur une tablette : au plus 3. Un clic " + (ouv ? "replie la liste." : "ouvre la liste à cocher."), onClick:function(){ setOuvert(ouv ? null : n); setRefus(null); }},
          "🚫 Jamais avec…" + (l.length ? " (" + l.length + ")" : ""))),
      ouv && h("div", {className:"ex-panneau"},
        h("div", {className:"ex-t"}, "🚫 " + n + " n'est jamais sur une tablette avec… ", h("span", {className:"ex-c"}, l.length + " / 3")),
        h("div", {className:"ex-grille"}, NOMS_ESSAI.filter(function(x){ return x !== n; }).map(function(x){
          var on = l.indexOf(x) >= 0;
          return h("button", {key:x, className:"ex-case" + (on ? " on" : ""), "data-local":"1", title:on ? "Retire l'exclusion entre " + pre(n) + " et " + pre(x) + ", dans les deux sens. Un clic l'enregistre aussitôt." : "Exclut " + pre(n) + " et " + pre(x) + " : jamais ensemble sur une tablette, dans les deux sens, pour toutes les apps. Un clic l'enregistre aussitôt.", onClick:function(){ basculer(n, x); }}, h("span", {className:"ck"}, on ? "✓" : ""), x);
        })),
        refus && h("div", {className:"ex-refus"}, h("strong", null, "🚫 Refusé : "), "pas d'exclusion entre " + pre(refus[0]) + " et " + pre(refus[1]) + " : " + refus[2] + " a déjà 3 exclusions, le plus que permet MJPC. Avec 3 au plus, il existe toujours des binômes possibles, absents compris, dès 8 présents. Retire d'abord une exclusion de " + refus[2] + "."),
        h("div", {className:"ex-note"}, "Elle vaut dans les deux sens, et pour toutes les apps qui partagent une tablette (le QCM, la correction de dictée…). Aucun écran d'élève ne la montre.")));
  }));
}
function ScExclusions(trois){
  var contenu = h(F, null,
    h("h2", null, "Élèves & codes"),
    h("div", {className:"tprof-section-sub"}, "Choisis une classe, colle ta liste (un élève par ligne, NOM Prénom), puis génère les codes. Liste partagée avec tes apps (dictée, etc.) ; code à 4 chiffres mutualisé (login rapide). Régénérable élève par élève."),
    h("div", {className:"lens-bar"}, h("span", {className:"lens-pill on", style:{background:"#a78bfa"}}, h("span", {className:"lpd", style:{background:"#10071a66"}}), CLASSE)),
    h("div", {className:"ex-entete"}, "🚫 Les exclusions de la classe : deux élèves exclus ne sont jamais sur la même tablette. Elles passent avant toute règle de binômes, dans chaque app. ", h("strong", null, (trois ? 4 : EXCLUSIONS.length) + " exclusions"), " dans " + CLASSE + "."),
    h(ListeExclusions, {ouvert:trois ? "ESNAULT Inès" : "ESNAULT Inès", trois:trois, refus:trois ? ["ESNAULT Inès", "PERRAUD Jade", "ESNAULT Inès"] : null}));
  return PanneauProf("eleves", contenu);
}
var DOMAINES_COMP = [
  ["Français · cycle 4", ["c4-oral-01","c4-oral-02","c4-oral-03","c4-oral-04","c4-lire-01","c4-lire-02","c4-lire-03","c4-lire-04","c4-ecrire-01","c4-ecrire-02","c4-ecrire-03","c4-ecrire-04","c4-langue-01","c4-langue-02","c4-langue-03","c4-langue-04","c4-culture-01","c4-culture-02"]],
  ["Compétences transversales", ["tr-langages-01","tr-langages-02","tr-langages-03","tr-langages-04","tr-methodes-01","tr-methodes-02","tr-methodes-03","tr-personne-01","tr-personne-02","tr-personne-03"]]
];
function EditeurCompetences(){
  var s1 = useState("tr-personne-03"), edit = s1[0], setEdit = s1[1];
  var s2 = useState({0:true, 1:true}), dep = s2[0], setDep = s2[1];
  var s3 = useState({}), libs = s3[0], setLibs = s3[1];
  return h("div", {className:"m8-bloc"},
    h("div", {className:"m8-titre"}, "🧩 Les compétences — leur libellé élève"),
    h("p", {className:"m8-p"}, "Les 28 compétences du référentiel. Le libellé officiel reste pour École Directe et le PDF « notes et compétences » ; tout ce que voit l'élève prend le libellé élève. L'identifiant ne change jamais."),
    DOMAINES_COMP.map(function(d, di){
      var ouvert = !!dep[di];
      return h("div", {key:di, className:"m8tx-dom"},
        h("button", {className:"m8tx-dom-titre", "data-local":"1", "aria-expanded":ouvert, title:ouvert ? "Replie ce domaine." : "Déplie ce domaine.", onClick:function(){ var o = Object.assign({}, dep); o[di] = !ouvert; setDep(o); }},
          h("span", {className:"m8tx-fleche"}, ouvert ? "▼" : "▶"), " " + d[0] + " ", h("span", {className:"m8tx-compte"}, d[1].length + " compétences")),
        ouvert && d[1].map(function(c){
          var lib = libs[c] || LIB_ELEVE[c];
          return h("div", {key:c, className:"m8tx-notion"},
            h("div", {className:"m8tx-n-l1"}, h("span", {className:"m8tx-id"}, c), h("span", {className:"m8tx-prof"}, LIB_OFF[c])),
            h("div", {className:"m8tx-n-l2"}, "Élève : " + lib),
            edit === c ? h("div", {className:"m8tx-form"},
                h("div", {className:"m8tx-champ"}, h("label", {className:"m8tx-lab"}, "Libellé officiel — École Directe, PDF"), h("input", {className:"m8-input", readOnly:true, value:LIB_OFF[c], title:"Le libellé officiel ne se modifie pas ici."})),
                h("div", {className:"m8tx-champ"}, h("label", {className:"m8tx-lab"}, "Libellé élève"), h("input", {className:"m8-input", defaultValue:lib, placeholder:"Ce que liront les élèves", title:"Ce que liront les élèves, partout où une compétence paraît : bilans, attestations, « Mes évaluations »."})),
                h("div", {className:"m8tx-actions"},
                  h("button", {className:"m8-btn m8-btn-min", "data-local":"1", title:"Enregistre le libellé élève au référentiel, pour toutes les apps.", onClick:function(ev){ var v = ev.target.closest(".m8tx-form").querySelectorAll("input")[1].value; var o = Object.assign({}, libs); o[c] = v; setLibs(o); setEdit(null); }}, "Enregistrer"),
                  h("button", {className:"m8-btn m8-btn-min", "data-local":"1", title:"Ferme le formulaire sans rien changer.", onClick:function(){ setEdit(null); }}, "Annuler")),
                h("p", {className:"m8tx-note"}, "L'identifiant ", h("code", null, c), " ne change jamais : c'est lui qui étiquette le travail des élèves."))
              : h("div", {className:"m8tx-n-actions"}, h("button", {className:"m8-btn m8-btn-min", "data-local":"1", title:"Ouvre le formulaire : corriger le libellé élève de cette compétence.", onClick:function(){ setEdit(c); }}, "✏️ Modifier")));
        }));
    }));
}
function ScTaxonomie(){
  var contenu = h(F, null,
    h("div", {className:"m8-bloc"}, h("div", {className:"m8-titre"}, "📚 Taxonomie — le référentiel des notions"),
      h("p", {className:"m8-p"}, "L'arbre Domaine › Famille › Notion que lisent les applications. Ici tu peux créer une notion, corriger ses libellés, ses niveaux et son exemple, ou la désactiver."),
      h("div", {className:"m8tx-etat"}, "Version 3.2 · 10/10/2026 · 5 domaines · 142 notions"),
      h("p", {className:"m8tx-regle"}, "Une notion ne se supprime jamais et son identifiant ne change jamais : le travail des élèves est étiqueté par ces identifiants, une étiquette qui disparaît ou change de numéro décrocherait des années de travail. Une notion qui ne sert plus se ", h("strong", null, "désactive"), " — elle sort des choix des applications, l'historique reste lisible.")),
    h(EditeurCompetences));
  return PanneauProf("taxo", contenu);
}

/* ════════ Les gestes de l'étape 4 ════════ */
BULLES["👤 1 élève"] = "Sur la tablette simulée : un seul élève sur cette tablette.";
BULLES["👥 2 élèves"] = "Sur la tablette simulée : deux élèves, une moitié chacun.";

/* ════════ Les scènes de l'étape 4 ════════ */
SCENES = SCENES.concat([
  {id:"c-eval-corbeille", vue:"console", vh:900, render:ScEvalCorbeille},
  {id:"c-seances-lues", vue:"console", render:function(){ return ListeSeances(null, "pret"); }},
  {id:"c-rendre", vue:"console", vh:900, render:ScRendre},
  {id:"c-copies-rendues", vue:"console", render:function(){ return ListeSeances(null, "rendues", "10/10"); }},
  {id:"c-resultats-rendues", vue:"console", render:function(){ return Console("donnees", "results", h(ResultatsQCM, {rendues:true}), false); }},
  {id:"c-fiche-garde", vue:"console", vh:1100, render:ScFicheGarde},
  {id:"c-fiche-retire", vue:"console", render:function(){ return ScFiche(true); }},
  {id:"e-mes-evals-rendue", vue:"eleve", render:function(){ return MesEvaluations(true); }},
  {id:"c-importer", vue:"console", vh:900, render:ScImporter},
  {id:"c-purger", vue:"console", vh:900, render:ScPurger},
  {id:"m-classe-exclusions", vue:"console", vh:1300, render:function(){ return ScExclusions(false); }},
  {id:"m-exclusion-refusee", vue:"console", vh:1300, render:function(){ return ScExclusions(true); }},
  {id:"m-taxonomie-competences", vue:"console", vh:1500, render:ScTaxonomie}
]);
refaire("c-fiche", function(){ return ScFiche(false); });
refaire("c-que-dit-la-feuille", ScQueDitLaFeuille);
refaire("c-resultats", function(){ return Resultats(false, false); });
refaire("e-mes-evals", function(){ return MesEvaluations(false); });
refaire("x627-3-editeur", Editeur);
SCENES.filter(function(s){ return s.id === "c-fiche"; })[0].vh = 1300;
SCENES.filter(function(s){ return s.id === "c-que-dit-la-feuille"; })[0].vh = 1300;
SCENES.filter(function(s){ return s.id === "x627-3-editeur"; })[0].vh = 3250;

/* Tours 610 à 613 — « ceinture et bretelles » contre le réflexe du clic (475).
   B : à la fin de son temps de réponse, l'élève dit si sa feuille dit la même chose que son clic (495).
   A : à la correction, c'est le voisin qui fait le rapprochement, dans la moitié du propriétaire (496).
   Puis la co-évaluation de la lecture, à la fin de la correction (511 à 517, et la précision de Paul au tour 613).
   Tour 613 : les textes validés par Paul (« ok pour tout », tours 611 à 613) ne sont plus soulignés ;
   seuls les textes nouveaux vus par l'élève, proposés à ce tour, sont soulignés en pointillés orange. */
function Pz(t){ return h("span", {className:"prov"}, t); }
function il(e){ return e.sexe === "F" ? "elle" : "il"; }
J.sexe = "M"; M.sexe = "M";

/* Le voile, avec la phrase retenue au tour 604 (on nomme toujours l'élève) */
function VoileN(moi, autre){
  return h("div", {className:"voile"},
    h("div", {className:"vic"}, "🙈"),
    h("div", {className:"phr"}, moi.prenom + ", laisse la tablette à " + autre.prenom + " pour qu'" + il(autre) + " réponde sans que tu regardes."));
}

/* B — à la fin de son temps de réponse : son clic est figé, il dit si sa feuille dit la même chose (495, acquis) */
function EcrDeclare(e, qi, chrono){
  var q = EV.questions[qi], ordre = ORD[qi][e.cle], sel = TABL[e.cle][qi];
  return Page(badgeDe(e), EV.titre, h("div", {className:"eleve-q-zone"},
    QHead(qi), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"fige"}, "⏱️ Temps fini : ton clic est enregistré."),
    h("div", {className:"eleve-choix fige-choix"}, ordre.map(function(i){
      var moi = sel.indexOf(i) >= 0;
      return h("button", {key:i, className:"eleve-choix-btn" + (moi ? " selected" : ""), disabled:!moi}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"decl-b-titre"}, e.prenom + ", regarde ta feuille : dit-elle la même chose que ton clic ?"),
    h("div", {className:"decl-b-btns"},
      h("button", {className:"decl-b-btn"}, "Oui, la même chose"),
      h("button", {className:"decl-b-btn"}, "Non, autre chose")),
    h("div", {className:"decl-b-chrono"}, "⏱️ " + chrono + " s")));
}

/* A — à la correction : chacun garde sa feuille et sa moitié ; c'est le voisin qui clique le rapprochement.
   Tour 611 : plus de « Je ne suis pas sûr » (502) ; « les mots ne sont pas forcément les mêmes » sur cet écran (506) ; 450 réduit (508). */
function EcrCorrA(e, qi, dit, chrono){
  var q = EV.questions[qi], ordre = ORD[qi][e.cle], decl = FEUI[e.cle][qi], v = autreDe(e);
  var declArr = decl === "aucun" ? [] : decl;
  var pos = ORDRE_CORR.indexOf(qi), pa = pastillesDe(e, pos);
  var nbJ = pa.filter(function(x){ return x.cls === "juste" || x.cls === "trouvee-p"; }).length;
  return Page(badgeDe(e), "📝 Correction", h(F, null,
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    h("div", {className:"correction-compteur"},
      h("div", {className:"correction-compteur-score"},
        h("span", {className:"correction-compteur-num"}, nbJ), h("span", {className:"correction-compteur-lbl"}, nbJ > 1 ? " bonnes réponses" : " bonne réponse"),
        h("span", {className:"correction-compteur-sep-text"}, " sur "), h("span", {className:"correction-compteur-tot"}, pos),
        h("span", {className:"correction-compteur-lbl"}, pos > 1 ? " questions déjà corrigées" : " question déjà corrigée"), InfoI()),
      h("div", {className:"correction-compteur-pastilles"}, pa.map(function(x, i){ return h("span", {key:i, className:"correction-compteur-pastille " + x.cls}, x.t); }))),
    h("div", {className:"eleve-q-zone"}, QHead(qi, true), h("div", {className:"eleve-q-enonce"}, q.enonce),
      h("div", {className:"montre"}, "📄 " + e.prenom + ", montre ta feuille à " + v.prenom + "."),
      h("div", {className:"decl-titre"}, v.prenom + ", lis la feuille de " + e.prenom + " : qu'a-t-" + il(e) + " écrit ?"),
      h("div", {className:"decl-consigne"}, "Clique sur le ou les choix qui disent la même chose que sa feuille. Les mots ne sont pas forcément les mêmes."),
      h("div", {className:"soin"}, "Lis avec soin : c'est ton point d'autonomie."),
      ChronoSaisie(chrono, q.reponse),
      h("div", {className:"eleve-choix"},
        ordre.map(function(i){ return h("button", {key:i, className:"eleve-choix-btn" + (dit && declArr.indexOf(i) >= 0 ? " selected" : "")}, h("span", null, q.choix[i])); }),
        h("button", {className:"eleve-choix-btn aucun" + (dit && decl === "aucun" ? " selected" : "")}, "Sa feuille ne dit aucun de ces choix")),
      dit && h("div", {className:"eleve-feedback valide"}, "✅ Réponse enregistrée — tu peux encore la changer"),
      h("div", {className:"correction-resultat non-rep", style:{background:"rgba(106,76,224,.08)", color:"var(--violet)", borderColor:"var(--violet)", fontSize:"1rem"}}, "👀 Écoute le prof — la correction sera révélée."))));
}

/* Les deux attestations, version A + B : textes de Paul (506, 507 avec 510) */
function EcrAttest1AB(e, coche){
  var v = autreDe(e);
  var L = [
    "Pour chaque question, écris ta réponse sur ta feuille, avec les mots du cours. Plusieurs réponses : une par ligne.",
    "Écris lisiblement : " + v.prenom + " lira ta feuille à la correction.",
    "Si tu sais ton cours, tu retrouveras ta réponse parmi les choix.",
    "Quand « POSE TON STYLO » s'affiche, pose ton stylo et clique ta réponse. Quand c'est le tour de " + v.prenom + ", ne regarde pas.",
    "À la fin du temps, dis si ta feuille dit la même chose que ton clic.",
    "Ta note, c'est ta feuille. Chaque question vaut 1 point.",
    "Une fois par évaluation, si ta feuille est fausse mais que ton clic est juste, la question compte quand même.",
    "Je ramasse les feuilles à la fin."
  ];
  return Page(badgeDe(e), EV.titre, h("div", {className:"attest"},
    h("div", {className:"tt"}, "Avant de commencer, " + e.prenom),
    L.map(function(l, i){ return h("div", {key:i, className:"li"}, "• ", l); }),
    h("div", {className:"coche"}, h("span", {className:"case" + (coche ? " on" : "")}, coche ? "✓" : ""), "J'ai lu et compris"),
    h("button", {className:"btn btn-primary", style:{opacity:coche ? 1 : .45}}, "Je commence")));
}
function EcrAttest2AB(e, coche){
  var v = autreDe(e);
  var L = [
    "Maintenant, la correction. Montre ta feuille à " + v.prenom + ".",
    "Pour chaque question, " + v.prenom + " clique ce que dit ta feuille. Toi, tu cliques ce que dit la feuille de " + v.prenom + ".",
    "Lis avec soin, et clique ce que tu lis.",
    "À la fin, " + v.prenom + " dira si tu as bien lu sa feuille.",
    "Deux compétences sont évaluées : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». Tu gardes ton point d'autonomie si tu as dit la vérité pendant les questions, et si tu lis avec soin la feuille de " + v.prenom + ". Sinon, ces deux compétences ne sont pas atteintes."
  ];
  return Page(badgeDe(e), "📝 Correction", h("div", {className:"attest"},
    h("div", {className:"tt"}, "Avant la correction, " + e.prenom),
    L.map(function(l, i){ return h("div", {key:i, className:"li"}, "• ", l); }),
    h("div", {className:"coche"}, h("span", {className:"case" + (coche ? " on" : "")}, coche ? "✓" : ""), "J'ai lu et compris"),
    h("button", {className:"btn btn-primary", style:{opacity:coche ? 1 : .45}}, "Je commence la correction")));
}

/* ── La co-évaluation de la lecture (511 à 517 ; tour 613 : une question cliquée, les autres disparaissent) ── */
// Ce que le voisin a cliqué pour la feuille de chacun. Pour la scène, Julien a mal lu la question 1 de Michel :
// la feuille de Michel dit Rome, Julien a lu Venise (le clic de Michel sur la tablette, qu'il n'a jamais vu).
var LU = {J:[[2],[0],[0]], M:[[3],[0,1,2],"aucun"]};
function luTexte(qi, x){ var q = EV.questions[qi]; return x === "aucun" ? "aucun de ces choix" : x.map(function(i){ return q.choix[i]; }).join(", "); }
// Tour 614 : en suppositions, à la première personne, avec le prénom du voisin ; plus de « Envoyer » :
// le choix est enregistré dès le clic, comme partout dans l'app, et se change jusqu'au bilan.
function txtCo(k, v, qi){
  if(k === "ok") return "Je pense que " + v.prenom + " a bien lu ma feuille";
  var peut = k === "peut" ? "peut-être " : "";
  return "Je pense que " + v.prenom + " a " + peut + "mal lu ma feuille" + (qi == null ? ", à une question" : " à la question " + (qi+1));
}
var EM_CO = {ok:"✅", peut:"🤔", mal:"❌"};
function BtnCo(k, v, on, qi){
  var t = txtCo(k, v, qi);
  return h("button", {key:k, className:"co-btn " + k + (on ? " on" : "")}, EM_CO[k] + " ", k === "mal" ? t : Pz(t));
}
var REGLE_CO = "Un désaccord, c'est sérieux : tu n'en signales qu'un, celui dont tu es le plus sûr. Il se vérifie sur ta feuille.";
var ENREG = "✅ Réponse enregistrée — tu peux encore la changer";
// etape : "choix" (rien cliqué) | "question" (❌ ou 🤔 cliqué : il clique la question) | "une" (question cliquée : les autres ont disparu) | "okfait" (✅ cliqué)
function EcrCoeval(e, etape, k, qChoisie){
  var v = autreDe(e);
  var lignes = EV.questions.map(function(q, qi){ return {qi:qi, txt:"Question " + (qi+1) + " · " + v.prenom + " a lu : " + luTexte(qi, LU[e.cle][qi])}; });
  var zone = [];
  zone.push(h("div", {key:"t", className:"decl-titre co-titre"}, e.prenom + ", " + v.prenom + " a-t-" + il(v) + " bien lu ta feuille ?"));
  if(etape === "une"){
    zone.push(h("div", {key:"b"}, BtnCo(k, v, true, qChoisie)));
    zone.push(h("div", {key:"l", className:"co-liste"}, h("div", {className:"co-l choisie"}, lignes[qChoisie].txt)));
    zone.push(h("div", {key:"seule", className:"co-seule"}, "☝️ C'est ta seule question de désaccord."));
    zone.push(h("div", {key:"r", className:"co-regle"}, REGLE_CO));
    zone.push(h("div", {key:"f", className:"eleve-feedback valide"}, ENREG));
    zone.push(h("div", {key:"a", className:"co-actions"}, h("button", {className:"btn btn-ghost"}, "↩️ Changer")));
    zone.push(h("div", {key:"w", className:"co-attente"}, "⏳ Attends ton bilan..."));
  } else {
    var cliquable = etape === "question";
    if(cliquable) zone.push(h("div", {key:"b"}, BtnCo(k, v, true)));
    if(cliquable) zone.push(h("div", {key:"p", className:"co-prompt"}, "👇 ", Pz("Clique la question où tu penses que " + v.prenom + " a " + (k === "peut" ? "peut-être " : "") + "mal lu ta feuille.")));
    zone.push(h("div", {key:"l", className:"co-liste" + (cliquable ? " cliquable" : "")}, lignes.map(function(l){ return h("div", {key:l.qi, className:"co-l"}, l.txt); })));
    zone.push(h("div", {key:"r", className:"co-regle"}, "☝️ " + REGLE_CO));
    if(!cliquable) zone.push(h("div", {key:"bs", className:"co-btns"}, ["ok", "peut", "mal"].map(function(x){ return BtnCo(x, v, etape === "okfait" && x === "ok"); })));
    if(etape === "okfait") zone.push(h("div", {key:"f", className:"eleve-feedback valide"}, ENREG));
    if(etape === "okfait") zone.push(h("div", {key:"w", className:"co-attente"}, "⏳ Attends ton bilan..."));
    if(cliquable) zone.push(h("div", {key:"a", className:"co-actions"}, h("button", {className:"btn btn-ghost"}, "↩️ Changer")));
  }
  return Page(badgeDe(e), "📝 Correction", h("div", {className:"eleve-q-zone"}, zone));
}

/* ── Ta console pendant la co-évaluation : l'alerte, le suivi, le bilan qui attend (515 à 517) ── */
var CO = {Julien:"ok", Michel:"mal1", "Léa":"ok", Tom:"att", "Inès":"ok", Hugo:"ok", Manon:"ok", Nathan:"ok", "Chloé":"ok", Louis:"ok", Emma:"ok", Noah:"peut3",
  "Zoé":"ok", Sacha:"att", Jade:"peut2", Enzo:"ok", Lina:"ok", Malo:"ok", Anna:"ok", Rayan:"att", Clara:"ok", Camille:"ok", "Théo":"ok", Lou:"att"};
function etatCo(p){
  var c = CO[p];
  if(c === "att") return {cls:"m-pasdit", st:"⏳ pas encore répondu"};
  if(c === "ok") return {cls:"m-juste", st:"✅ bien lu"};
  if(c.indexOf("mal") === 0) return {cls:"m-faux m-co", st:"❌ mal lu Q" + c.slice(3), flag:"alerte : à trancher"};
  return {cls:"m-coq", st:"🤔 peut-être Q" + c.slice(4), flag:"à relire ce soir"};
}
var LIRE_CO = [
  ["PERRAUD Jade", "Q2 : 🤔 pense qu'Enzo a peut-être mal lu sa feuille"],
  ["MAILLARD Noah", "Q3 : 🤔 pense qu'Emma a peut-être mal lu sa feuille"],
  ["DUVERNAY Michel", "Q3 : aucun de ces choix"],
  ["QUINTON Enzo", "Q1 : aucun de ces choix"],
  ["TESSIER Anna", "Q2 : a dit que sa feuille disait son clic, Madrid ; Rayan y a lu Madrid et Genève"],
  ["CARRÉ Tom", "Q1 : n'a pas dit si sa feuille disait son clic"]
];
var ATT_CO = ["CARRÉ Tom", "OLLIVIER Sacha", "VALLÉE Rayan", "ZELLER Lou"];
function AlerteCo(tel){
  var q = EV.questions[0];
  var corps = [
    h("div", {key:"t", className:"al-t"}, "❌ DUVERNAY Michel pense qu'ABRIAL Julien a mal lu sa feuille à la question 1"),
    h("div", {key:"q", className:"al-l"}, "Q1 · " + q.enonce + " — bonne réponse : Rome"),
    h("div", {key:"b", className:"al-l"}, "Pendant la question, Michel a cliqué ", h("strong", null, "Venise"), ", puis il a dit que sa feuille ne disait pas Venise."),
    h("div", {key:"a", className:"al-l"}, "À la correction, Julien a lu ", h("strong", null, "Venise"), " sur la feuille de Michel."),
    h("div", {key:"x", className:"al-l al-b"}, "⚠️ Les deux ne peuvent pas être vrais : la feuille de Michel tranche."),
    h("div", {key:"c", className:"al-l al-c"}, "Appelle-les à la fin de l'heure, la feuille de Michel en main.")
  ];
  if(tel) return h("div", {className:"tel-alerte"}, corps,
    TelBtn("Donner raison à Michel", "vert"), TelBtn("Donner raison à Julien", "turq"), TelBtn("📌 Je relis ce soir la question 1", "or"),
    h("div", {className:"g2"}, TelBtn("⛔ Point d'autonomie — Michel", "ghost", "small"), TelBtn("⛔ Point d'autonomie — Julien", "ghost", "small")));
  return h("div", {className:"alerte-co"}, h("div", {className:"al-corps"}, corps),
    h("div", {className:"al-actions"},
      h("button", {className:"btn btn-vert"}, "Donner raison à Michel"),
      h("button", {className:"btn btn-turquoise"}, "Donner raison à Julien"),
      h("button", {className:"btn btn-or"}, "📌 Je relis ce soir la question 1"),
      h("div", {className:"al-auto"},
        h("button", {className:"btn btn-ghost btn-sm"}, "⛔ Retirer le point d'autonomie — Michel"),
        h("button", {className:"btn btn-ghost btn-sm"}, "⛔ Retirer le point d'autonomie — Julien")),
      h("div", {className:"al-note"}, "L'alerte est apparue au clic de Michel ; elle disparaît s'il change d'avis avant le bilan. « Donner raison à Michel » : tu cliques ce que dit sa feuille, comme le soir (capture 43), et sa note se recalcule. « Donner raison à Julien » : rien ne change.")));
}
function PilotCoeval(){
  return Console("pilotage", "pilot", h("div", {className:"card"},
    AlerteCo(false),
    TitreCarte(h(F, null, "🤝 Co-évaluation de la lecture — " + EV.titre + " — " + CLASSE, InfoI()),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status correction"}, "Fin de la correction — chacun dit ce qu'il pense de la lecture de sa feuille · 20 / 24 ont répondu"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, h("button", {className:"btn btn-or ferme", disabled:true}, "🔒 🏁 Afficher leur bilan aux élèves")),
        h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les 24 présents ont répondu. Il en manque " + ATT_CO.length + " :"),
          h("div", {className:"noms"}, ATT_CO.join(" · "))),
        h("div", {className:"co-compte"}, h("div", null, "✅ ", h("strong", null, String(Object.keys(CO).filter(function(p){ return CO[p] === "ok"; }).length)), " pensent : bien lu"), h("div", null, "🤔 ", h("strong", null, "2"), " pensent : peut-être mal lu (à relire ce soir)"), h("div", null, "❌ ", h("strong", null, "1"), " pense : mal lu (alerte, en haut)")),
        h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + LIRE_CO.length + ")"),
          LIRE_CO.map(function(x, i){ return h("div", {key:i}, x[0] + " — " + x[1]); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, "🤝 Ce que chacun pense de la lecture de sa feuille", InfoI()),
        h("div", {className:"ss"}, "Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin."),
        GrilleTablettes(PAIRES, etatCo),
        Legende([["#22C55E","✅ bien lu"],["#FDE68A","🤔 peut-être mal lu : à relire ce soir"],["#EF4444","❌ mal lu : alerte"],["#FEE2E2","⏳ pas encore répondu","1px solid #EF4444"]])))), true);
}
/* Ton téléphone, au même moment */
function TelCoeval(){
  var modeDe = function(p){ return {mode:"co"}; };
  var lignes = PAIRES.map(function(pa, i){
    return h("div", {key:i, className:"tel-tab"}, h("span", {className:"tel-tab-n"}, "T" + (i+1)),
      pa.map(function(n, k){
        var p = pre(n), c = CO[p], ps = c === "att" ? {t:"⏳", cls:"tp-rouge"} : c === "ok" ? {t:"✅", cls:"tp-juste"} : c.indexOf("mal") === 0 ? {t:"❌ Q" + c.slice(3), cls:"tp-mal"} : {t:"🤔 Q" + c.slice(4), cls:"tp-coq"};
        var nom = n.length > 15 ? n.slice(0, 14) + "…" : n;
        return h("span", {key:k, className:"tel-el" + (c === "att" ? " rouge" : "")}, h("span", {className:"nm"}, nom), h("span", {className:"tel-past " + ps.cls}, ps.t));
      }));
  });
  return TelCadre([
    TelBandeau("Phase : co-évaluation de la lecture", "20 / 24 ont répondu"),
    h("div", {key:"al"}, AlerteCo(true)),
    h("div", {key:"a", className:"tel-actions"}, TelBtn("🔒 🏁 Afficher leur bilan — il en manque 4", "or", "large", true)),
    h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Pas encore répondu : "), ATT_CO.join(" · ")),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + LIRE_CO.length + ") : "), LIRE_CO.map(function(x){ return x[0] + " — " + x[1]; }).join(" · ")),
    h("div", {key:"l", className:"tel-liste"}, h("div", {className:"tel-liste-h"}, "TABLETTES — ce que chacun pense de la lecture de sa feuille"), lignes),
    h("div", {key:"lg"}, TelLegende(["✅ bien lu", "🤔 peut-être mal lu : ce soir", "❌ mal lu : alerte", "⏳ pas encore"])),
    h("div", {key:"t"}, TelBtn("🛑 Terminer la session", "rouge", "small"))]);
}

/* ════════ Tour 616 : la vraie évaluation de 3e (analyse logique), question 3, et le cas ambigu ════════
   La question 3 : « Comment trouves-tu l'antécédent d'un Pronom Relatif… ? » ; 6 choix, 3 bons (B, C, E), en tout ou rien.
   Les lettres sont celles du tableau projeté (ordre de l'évaluation) ; chaque élève voit les choix dans son ordre à lui.
   Le scénario : la feuille de Michel dit « Je pose la question sur la relative. La réponse est avant le pronom relatif :
   la flèche va vers la gauche. » C'est C (sans « avec son Verbe Conjugué ») et E. Pendant la question, il clique C et E
   et dit « Oui, la même chose ». À la correction, Julien ne lit que E (« il n'a pas écrit le Verbe Conjugué »).
   Après la correction, Michel conteste la question 3 et dit avoir écrit B, C et E (B, il ne l'a pas écrit).
   Chacun a à moitié raison : C est bien sur la feuille (Michel), B n'y est pas (Julien). */
var QI3 = 2, LET = "ABCDEF";
var ORD3 = {J:[4,1,0,5,2,3], M:[2,5,4,0,3,1]};
var S3 = {
  J:{tab:[1,2,4], feuille:[1,2,4], lu:[1,2,4]},
  M:{tab:[2,4], feuille:[2,4], lu:[4], rechoix:[1,2,4]}
};
function lettres(a){ return a.map(function(i){ return LET[i]; }).join(", "); }
function pts3(a){ var b = EV3.questions[QI3].bonnes; return (a.length === b.length && a.every(function(i){ return b.indexOf(i) >= 0; })) ? 1 : 0; }
function QHead3(qi, sansTotal){
  var q = EV3.questions[qi];
  return h("div", {className:"eleve-q-header"},
    h("span", {className:"eleve-q-num"}, "Question " + (qi+1) + (sansTotal ? "" : " / " + EV3.questions.length)),
    h("span", {className:"eleve-q-pastille", style:{background:NIV[q.niveau].color, color:q.niveau === "facile" ? "#5C4500" : "#fff"}}, NIV[q.niveau].label),
    !sansTotal && h("span", {className:"eleve-q-points-badge"}, "1 pt"));
}
/* B, sur la question 3 */
function EcrDeclare3(e, chrono){
  var q = EV3.questions[QI3], sel = S3[e.cle].tab;
  return Page(badgeDe(e), EV3.titre, h("div", {className:"eleve-q-zone"},
    QHead3(QI3), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"fige"}, "⏱️ Temps fini : ton clic est enregistré."),
    h("div", {className:"eleve-choix long fige-choix"}, ORD3[e.cle].map(function(i){
      var moi = sel.indexOf(i) >= 0;
      return h("button", {key:i, className:"eleve-choix-btn" + (moi ? " selected" : ""), disabled:!moi}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"decl-b-titre"}, e.prenom + ", regarde ta feuille : dit-elle la même chose que ton clic ?"),
    h("div", {className:"decl-b-btns"}, h("button", {className:"decl-b-btn"}, "Oui, la même chose"), h("button", {className:"decl-b-btn"}, "Non, autre chose")),
    h("div", {className:"decl-b-chrono"}, "⏱️ " + chrono + " s")));
}
/* A, la lecture à la correction, sur la question 3 (la première corrigée : la plus ratée) */
function Compteur3(){
  return h("div", {className:"correction-compteur"},
    h("div", {className:"correction-compteur-score"},
      h("span", {className:"correction-compteur-num"}, 0), h("span", {className:"correction-compteur-lbl"}, " bonne réponse"),
      h("span", {className:"correction-compteur-sep-text"}, " sur "), h("span", {className:"correction-compteur-tot"}, 0),
      h("span", {className:"correction-compteur-lbl"}, " question déjà corrigée"), InfoI()),
    h("div", {className:"correction-compteur-pastilles"}, EV3.questions.map(function(q, i){ return h("span", {key:i, className:"correction-compteur-pastille vide"}, String(i+1)); })));
}
function EcrCorrA3(e, dit){
  var q = EV3.questions[QI3], v = autreDe(e), lu = S3[e.cle].lu;
  return Page(badgeDe(e), "📝 Correction", h(F, null,
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    Compteur3(),
    h("div", {className:"eleve-q-zone"}, QHead3(QI3, true), h("div", {className:"eleve-q-enonce"}, q.enonce),
      h("div", {className:"montre"}, "📄 " + e.prenom + ", montre ta feuille à " + v.prenom + "."),
      h("div", {className:"decl-titre"}, v.prenom + ", lis la feuille de " + e.prenom + " : qu'a-t-" + il(e) + " écrit ?"),
      h("div", {className:"decl-consigne"}, "Clique sur le ou les choix qui disent la même chose que sa feuille. Les mots ne sont pas forcément les mêmes."),
      h("div", {className:"soin"}, "Lis avec soin : c'est ton point d'autonomie."),
      ChronoSaisie(9, 20),
      h("div", {className:"eleve-choix long"},
        ORD3[e.cle].map(function(i){ return h("button", {key:i, className:"eleve-choix-btn" + (dit && lu.indexOf(i) >= 0 ? " selected" : "")}, h("span", null, q.choix[i])); }),
        h("button", {className:"eleve-choix-btn aucun"}, "Sa feuille ne dit aucun de ces choix")),
      dit && h("div", {className:"eleve-feedback valide"}, ENREG),
      h("div", {className:"correction-resultat non-rep", style:{background:"rgba(106,76,224,.08)", color:"var(--violet)", borderColor:"var(--violet)", fontSize:"1rem"}}, "👀 Écoute le prof — la correction sera révélée."))));
}
/* La co-évaluation, sur l'évaluation de 3e. Tours 615 et 616 : d'abord les trois choix, sans liste ;
   puis « … c'est laquelle ? » et les questions ; puis « Qu'avais-tu écrit sur ta feuille ? » et les choix de la question. */
function tronque(t, n){ return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t; }
function EcrCoeval3(e, etape, k){
  var v = autreDe(e), zone = [];
  if(etape === "choix" || etape === "okfait"){
    zone.push(h("div", {key:"t", className:"decl-titre co-titre"}, e.prenom + ", " + v.prenom + " a-t-" + il(v) + " bien lu ta feuille ?"));
    zone.push(h("div", {key:"r", className:"co-regle"}, "☝️ " + REGLE_CO));
    zone.push(h("div", {key:"bs", className:"co-btns"}, ["ok", "peut", "mal"].map(function(x){ return BtnCo(x, v, etape === "okfait" && x === "ok"); })));
    if(etape === "okfait"){
      zone.push(h("div", {key:"f", className:"eleve-feedback valide"}, ENREG));
      zone.push(h("div", {key:"w", className:"co-attente"}, "⏳ Attends ton bilan..."));
    }
  } else if(etape === "laquelle"){
    zone.push(h("div", {key:"t", className:"decl-titre co-titre co-" + k}, EM_CO[k] + " " + e.prenom + ", tu penses que " + v.prenom + " a " + (k === "peut" ? "peut-être " : "") + "mal lu ta feuille pour une question : c'est laquelle ?"));
    zone.push(h("div", {key:"l", className:"co-liste cliquable serree"}, EV3.questions.map(function(q, qi){
      return h("div", {key:qi, className:"co-l"}, h("strong", null, "Question " + (qi+1)), " · " + tronque(q.enonce.replace(/^Sur ta copie, /, ""), 58));
    })));
    zone.push(h("div", {key:"r", className:"co-regle"}, "☝️ " + REGLE_CO));
    zone.push(h("div", {key:"a", className:"co-actions"}, h("button", {className:"btn btn-ghost"}, "↩️ Changer")));
  } else { // "ecrit" : la question 3, les autres ont disparu ; il clique ce qu'il avait écrit
    var q = EV3.questions[QI3], S = S3[e.cle];
    zone.push(h("div", {key:"q", className:"co-l choisie"}, EM_CO[k] + " Question 3 · " + tronque(q.enonce, 70)));
    zone.push(h("div", {key:"seule", className:"co-seule"}, "☝️ C'est ta seule question de désaccord."));
    zone.push(h("div", {key:"t", className:"decl-titre"}, "Qu'avais-tu écrit sur ta feuille ?"));
    zone.push(h("div", {key:"c", className:"eleve-choix long"},
      ORD3[e.cle].map(function(i){
        return h("button", {key:i, className:"eleve-choix-btn" + (S.rechoix.indexOf(i) >= 0 ? " selected" : "")},
          h("span", null, q.choix[i], S.lu.indexOf(i) >= 0 && h("span", {className:"tag-lu"}, Pz(v.prenom + " a lu"))));
      }),
      h("button", {className:"eleve-choix-btn aucun"}, "Ma feuille ne dit aucun de ces choix")));
    zone.push(h("div", {key:"r", className:"co-regle"}, REGLE_CO));
    zone.push(h("div", {key:"f", className:"eleve-feedback valide"}, ENREG));
    zone.push(h("div", {key:"a", className:"co-actions"}, h("button", {className:"btn btn-ghost"}, "↩️ Changer"), h("span", {className:"co-attente", style:{margin:0, alignSelf:"center"}}, "⏳ Attends ton bilan...")));
  }
  return Page(badgeDe(e), "📝 Correction", h("div", {className:"eleve-q-zone"}, zone));
}
/* Ta console et ton téléphone : l'alerte du cas ambigu */
var CO3 = {Julien:"ok", Michel:"mal3", "Léa":"ok", Tom:"att", "Inès":"ok", Hugo:"ok", Manon:"ok", Nathan:"ok", "Chloé":"ok", Louis:"ok", Emma:"ok", Noah:"peut10",
  "Zoé":"ok", Sacha:"att", Jade:"peut9", Enzo:"ok", Lina:"ok", Malo:"ok", Anna:"ok", Rayan:"att", Clara:"ok", Camille:"ok", "Théo":"ok", Lou:"att"};
function etatCo3(p){
  var c = CO3[p];
  if(c === "att") return {cls:"m-pasdit", st:"⏳ pas encore répondu"};
  if(c === "ok") return {cls:"m-juste", st:"✅ bien lu"};
  if(c.indexOf("mal") === 0) return {cls:"m-faux m-co", st:"❌ mal lu Q" + c.slice(3), flag:"alerte : à trancher"};
  return {cls:"m-coq", st:"🤔 peut-être Q" + c.slice(4), flag:"à relire ce soir"};
}
var LIRE_CO3 = [
  ["PERRAUD Jade", "Q9 : 🤔 pense qu'Enzo a peut-être mal lu sa feuille ; elle dit avoir écrit : un point-virgule"],
  ["MAILLARD Noah", "Q10 : 🤔 pense qu'Emma a peut-être mal lu sa feuille ; il dit avoir écrit : trois"],
  ["QUINTON Enzo", "Q1 : aucun de ces choix"],
  ["TESSIER Anna", "Q2 : a dit que sa feuille disait son clic, un nom et un pronom ; Rayan y a lu : un nom"],
  ["CARRÉ Tom", "Q7 : n'a pas dit si sa feuille disait son clic"]
];
function ChoixLettres(tel){
  var q = EV3.questions[QI3];
  return h("div", {className:"al-choix" + (tel ? " tel" : "")}, q.choix.map(function(c, i){
    var bon = q.bonnes.indexOf(i) >= 0;
    return h("div", {key:i, className:"al-ch" + (bon ? " bon" : "")}, h("strong", null, LET[i] + (bon ? " ✓" : "")), " " + (tel ? tronque(c, 48) : c));
  }));
}
function AlerteCo3(tel){
  var q = EV3.questions[QI3], M3 = S3.M;
  var lignes = [
    ["Michel, pendant la question, avant la réponse : il a cliqué " + lettres(M3.tab) + " et dit « Oui, la même chose »", M3.feuille],
    ["Julien, à la correction, avant la réponse", M3.lu],
    ["Michel, après la correction : il connaissait la réponse", M3.rechoix]
  ];
  var tableau = h("table", {className:"al-tab"},
    h("thead", null, h("tr", null, h("th", null, "Qui, et quand"), h("th", null, "La feuille de Michel dit"), h("th", null, "Point"))),
    h("tbody", null,
      lignes.map(function(l, i){ return h("tr", {key:i, className:i === 2 ? "apres" : ""}, h("td", null, l[0]), h("td", {className:"lt"}, lettres(l[1])), h("td", {className:"pt"}, String(pts3(l[1])))); }),
      h("tr", {className:"bonne"}, h("td", null, "Bonne réponse"), h("td", {className:"lt"}, lettres(q.bonnes)), h("td", {className:"pt"}, ""))));
  var corps = [
    h("div", {key:"t", className:"al-t"}, "❌ DUVERNAY Michel pense qu'ABRIAL Julien a mal lu sa feuille à la question 3"),
    h("div", {key:"q", className:"al-l"}, "Q3 · " + q.enonce),
    h("div", {key:"c"}, ChoixLettres(tel)),
    h("div", {key:"tb"}, tableau),
    h("div", {key:"x", className:"al-l al-b"}, "⚠️ Les deux ne peuvent pas être vrais : regarde la feuille de Michel."),
    h("div", {key:"y", className:"al-l al-y"}, "👉 Avant de connaître la réponse, Michel disait C, E : ni ce que Julien a lu, ni ce que Michel dit maintenant. Seule la lecture faite après la réponse donne le point."),
    h("div", {key:"z", className:"al-l al-c"}, "Appelle-les à la fin de l'heure, la feuille de Michel en main.")
  ];
  if(tel) return h("div", {className:"tel-alerte"}, corps,
    TelBtn("Donner raison à Michel : B, C, E → 1 point", "vert"), TelBtn("Donner raison à Julien : E → 0 point", "turq"),
    TelBtn("La feuille dit autre chose : je clique ce qu'elle dit", "primary"), TelBtn("📌 Je relis ce soir la question 3", "or"),
    h("div", {className:"g3"}, TelBtn("⛔ Michel", "ghost", "small"), TelBtn("⛔ Julien", "ghost", "small"), TelBtn("⛔ Aux deux", "rougeclair", "small")),
    h("div", {className:"tel-al-note"}, "⛔ : retirer le point d'autonomie."));
  return h("div", {className:"alerte-co al3"}, h("div", {className:"al-corps"}, corps),
    h("div", {className:"al-actions"},
      h("button", {className:"btn btn-vert"}, "Donner raison à Michel : B, C, E → 1 point"),
      h("button", {className:"btn btn-turquoise"}, "Donner raison à Julien : E → 0 point"),
      h("button", {className:"btn btn-primary"}, "La feuille dit autre chose : je clique ce qu'elle dit"),
      h("button", {className:"btn btn-or"}, "📌 Je relis ce soir la question 3"),
      h("div", {className:"al-auto-t"}, "⛔ Retirer le point d'autonomie :"),
      h("div", {className:"al-auto"},
        h("button", {className:"btn btn-ghost btn-sm"}, "⛔ à Michel"),
        h("button", {className:"btn btn-ghost btn-sm"}, "⛔ à Julien"),
        h("button", {className:"btn btn-sm btn-aux-deux"}, "⛔ aux deux")),
      h("div", {className:"al-note"}, "L'alerte est apparue quand Michel a cliqué ce qu'il avait écrit ; elle disparaît s'il change d'avis avant le bilan. Chaque bouton a sa confirmation et son retour.")));
}
function PilotCoeval3(){
  var nOk = Object.keys(CO3).filter(function(p){ return CO3[p] === "ok"; }).length;
  return Console("pilotage", "pilot", h("div", {className:"card"},
    AlerteCo3(false),
    TitreCarte(h(F, null, "🤝 Co-évaluation de la lecture — " + EV3.titre + " — " + CLASSE, InfoI()),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status correction"}, "Fin de la correction — chacun dit ce qu'il pense de la lecture de sa feuille · 20 / 24 ont répondu"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, h("button", {className:"btn btn-or ferme", disabled:true}, "🔒 🏁 Afficher leur bilan aux élèves")),
        h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les 24 présents ont répondu. Il en manque " + ATT_CO.length + " :"),
          h("div", {className:"noms"}, ATT_CO.join(" · "))),
        h("div", {className:"co-compte"}, h("div", null, "✅ ", h("strong", null, String(nOk)), " pensent : bien lu"), h("div", null, "🤔 ", h("strong", null, "2"), " pensent : peut-être mal lu (à relire ce soir)"), h("div", null, "❌ ", h("strong", null, "1"), " pense : mal lu (alerte, en haut)")),
        h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + LIRE_CO3.length + ")"),
          LIRE_CO3.map(function(x, i){ return h("div", {key:i}, x[0] + " — " + x[1]); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, "🤝 Ce que chacun pense de la lecture de sa feuille", InfoI()),
        h("div", {className:"ss"}, "Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin."),
        GrilleTablettes(PAIRES, etatCo3),
        Legende([["#22C55E","✅ bien lu"],["#FDE68A","🤔 peut-être mal lu : à relire ce soir"],["#EF4444","❌ mal lu : alerte"],["#FEE2E2","⏳ pas encore répondu","1px solid #EF4444"]])))), true);
}
function TelCoeval3(){
  var lignes = PAIRES.map(function(pa, i){
    return h("div", {key:i, className:"tel-tab"}, h("span", {className:"tel-tab-n"}, "T" + (i+1)),
      pa.map(function(n, k){
        var p = pre(n), c = CO3[p], ps = c === "att" ? {t:"⏳", cls:"tp-rouge"} : c === "ok" ? {t:"✅", cls:"tp-juste"} : c.indexOf("mal") === 0 ? {t:"❌ Q" + c.slice(3), cls:"tp-mal"} : {t:"🤔 Q" + c.slice(4), cls:"tp-coq"};
        var nom = n.length > 15 ? n.slice(0, 14) + "…" : n;
        return h("span", {key:k, className:"tel-el" + (c === "att" ? " rouge" : "")}, h("span", {className:"nm"}, nom), h("span", {className:"tel-past " + ps.cls}, ps.t));
      }));
  });
  return TelCadre([
    h("div", {key:"b", className:"tel-bandeau"},
      h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}, h("div", {style:{fontWeight:900, fontSize:".95rem"}}, CLASSE), h("div", {style:{fontSize:".72rem", opacity:.9}}, "🕙 Fin 10:57")),
      h("div", {style:{fontSize:".75rem", opacity:.85}}, EV3.titre),
      h("div", {style:{marginTop:".3rem", fontSize:".8rem", fontWeight:"bold"}}, "Phase : co-évaluation de la lecture", h("span", {className:"tel-tour"}, "20 / 24 ont répondu"))),
    h("div", {key:"al"}, AlerteCo3(true)),
    h("div", {key:"a", className:"tel-actions"}, TelBtn("🔒 🏁 Afficher leur bilan — il en manque 4", "or", "large", true)),
    h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Pas encore répondu : "), ATT_CO.join(" · ")),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + LIRE_CO3.length + ") : "), LIRE_CO3.map(function(x){ return x[0] + " — " + x[1]; }).join(" · ")),
    h("div", {key:"l", className:"tel-liste"}, h("div", {className:"tel-liste-h"}, "TABLETTES — ce que chacun pense de la lecture de sa feuille"), lignes),
    h("div", {key:"lg"}, TelLegende(["✅ bien lu", "🤔 peut-être mal lu : ce soir", "❌ mal lu : alerte", "⏳ pas encore"])),
    h("div", {key:"t"}, TelBtn("🛑 Terminer la session", "rouge", "small"))]);
}

var SCENES_610 = [
  // B, question 3 de l'évaluation de 3e : Julien a cliqué B, C, E ; son temps est fini ; Michel est encore sous le voile
  {id:"x610-1-b-julien", vue:"tablette", render:function(){ return Tablette(EcrDeclare3(J, 4), VoileN(M, J)); }},
  // B, second tour : Michel a cliqué C et E, ce que dit sa feuille : il va dire « Oui »
  {id:"x610-2-b-michel", vue:"tablette", render:function(){ return Tablette(VoileN(J, M), EcrDeclare3(M, 4)); }},
  // A, correction de la question 3 : Michel a lu B, C, E sur la feuille de Julien ; Julien n'a lu que E sur celle de Michel
  {id:"x610-3-a-correction", vue:"tablette", vh:1060, render:function(){ return Tablette(EcrCorrA3(J, true), EcrCorrA3(M, true)); }},
  // Les deux attestations, version A + B
  {id:"x610-4-attestation-1", vue:"tablette", render:function(){ return Tablette(EcrAttest1AB(J, true), EcrAttest1AB(M, false)); }},
  {id:"x610-5-attestation-2", vue:"tablette", render:function(){ return Tablette(EcrAttest2AB(J, true), EcrAttest2AB(M, false)); }},
  // La co-évaluation : Julien n'a encore rien cliqué ; Michel a cliqué « ❌ » : « c'est laquelle ? »
  {id:"x610-6-coeval-laquelle", vue:"tablette", render:function(){ return Tablette(EcrCoeval3(J, "choix"), EcrCoeval3(M, "laquelle", "mal")); }},
  // Julien a cliqué « ✅ » ; Michel a cliqué la question 3, les autres ont disparu : « Qu'avais-tu écrit sur ta feuille ? »
  {id:"x610-7-coeval-ecrit", vue:"tablette", render:function(){ return Tablette(EcrCoeval3(J, "okfait"), EcrCoeval3(M, "ecrit", "mal")); }},
  // Ta console et ton téléphone : l'alerte du cas ambigu
  {id:"x610-8-console-alerte", vue:"console", render:PilotCoeval3},
  {id:"x610-9-telephone-alerte", vue:"telephone", render:TelCoeval3}
];
SCENES = SCENES.concat(SCENES_610);
window.LISTE_SCENES = SCENES.map(function(s){ return {id:s.id, vue:s.vue, vh:s.vh || null}; });
rendre();

/* Tour 610 — « ceinture et bretelles » contre le réflexe du clic (475) : B (l'élève dit si sa feuille dit la même chose,
   à la fin de son temps de réponse) et A (à la correction, c'est le voisin qui fait le rapprochement, dans la moitié du propriétaire).
   Les textes nouveaux vus par l'élève sont des propositions : soulignés en pointillés orange. Les textes déjà donnés par Paul ne le sont pas. */
function Pz(t){ return h("span", {className:"prov"}, t); }
function il(e){ return e.sexe === "F" ? "elle" : "il"; }
J.sexe = "M"; M.sexe = "M";
function autreDe(e){ return e.cle === "J" ? M : J; }

/* Le voile, avec la phrase retenue au tour 604 (on nomme toujours l'élève) */
function VoileN(moi, autre){
  return h("div", {className:"voile"},
    h("div", {className:"vic"}, "🙈"),
    h("div", {className:"phr"}, moi.prenom + ", laisse la tablette à " + autre.prenom + " pour qu'" + il(autre) + " réponde sans que tu regardes."));
}

/* B — à la fin de son temps de réponse : son clic est figé, il dit si sa feuille dit la même chose */
function EcrDeclare(e, qi, chrono){
  var q = EV.questions[qi], ordre = ORD[qi][e.cle], sel = TABL[e.cle][qi];
  return Page(badgeDe(e), EV.titre, h("div", {className:"eleve-q-zone"},
    QHead(qi), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"fige"}, "⏱️ ", Pz("Temps fini : ton clic est enregistré.")),
    h("div", {className:"eleve-choix fige-choix"}, ordre.map(function(i){
      var moi = sel.indexOf(i) >= 0;
      return h("button", {key:i, className:"eleve-choix-btn" + (moi ? " selected" : ""), disabled:!moi}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"decl-b-titre"}, Pz(e.prenom + ", regarde ta feuille : dit-elle la même chose que ton clic ?")),
    h("div", {className:"decl-b-btns"},
      h("button", {className:"decl-b-btn"}, Pz("Oui, la même chose")),
      h("button", {className:"decl-b-btn"}, Pz("Non, autre chose"))),
    h("div", {className:"decl-b-chrono"}, "⏱️ " + chrono + " s")));
}

/* A — à la correction : chacun garde sa feuille et sa moitié ; c'est le voisin qui clique le rapprochement */
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
      h("div", {className:"montre"}, "📄 ", Pz(e.prenom + ", montre ta feuille à " + v.prenom + ".")),
      h("div", {className:"decl-titre"}, Pz(v.prenom + ", lis la feuille de " + e.prenom + " : qu'a-t-" + il(e) + " écrit ?")),
      h("div", {className:"decl-consigne"}, Pz("Clique sur le ou les choix qui disent la même chose que sa feuille. Si vous n'êtes pas d'accord, ou si tu hésites, clique « Je ne suis pas sûr ».")),
      ChronoSaisie(chrono, q.reponse),
      h("div", {className:"eleve-choix"},
        ordre.map(function(i){ return h("button", {key:i, className:"eleve-choix-btn" + (dit && declArr.indexOf(i) >= 0 ? " selected" : "")}, h("span", null, q.choix[i])); }),
        h("button", {className:"eleve-choix-btn aucun duo" + (dit && decl === "aucun" ? " selected" : "")}, Pz("Sa feuille ne dit aucun de ces choix")),
        h("button", {className:"eleve-choix-btn aucun duo pas-sur"}, "🤔 ", Pz("Je ne suis pas sûr"))),
      dit && h("div", {className:"eleve-feedback valide"}, "✅ Réponse enregistrée — tu peux encore la changer"),
      h("div", {className:"correction-resultat non-rep", style:{background:"rgba(106,76,224,.08)", color:"var(--violet)", borderColor:"var(--violet)", fontSize:"1rem"}}, "👀 Écoute le prof — la correction sera révélée."))));
}

/* Les deux attestations, version A + B. Ce qui change est souligné. */
function EcrAttest1AB(e, coche){
  var v = autreDe(e);
  var L = [
    ["Pour chaque question, tu écris d'abord ta réponse en entier sur ta feuille, sans voir les choix. Écris ta réponse avec les mots du cours, en quelques mots. S'il y a plusieurs réponses, écris-en une par ligne. Si on te demande une phrase, écris d'abord la réponse courte. ", Pz("Écris lisiblement : à la correction, c'est " + v.prenom + " qui lira ta feuille.")],
    ["Quand « POSE TON STYLO » s'affiche, tu poses ton stylo. Chacun votre tour, vous cliquez sur votre réponse ; l'autre ne regarde pas. ", Pz("Quand ton temps est fini, tu dis si ta feuille dit la même chose que ton clic.")],
    ["C'est ce que tu as écrit qui fait foi. À la correction, avant de voir la réponse, ", Pz(v.prenom + " clique sur le ou les choix qui disent la même chose que ta feuille, et toi pour la sienne. Les mots ne sont pas forcément les mêmes : c'est à celui qui lit de faire le rapprochement."), " Si c'est faux à l'écrit, le point ne t'est pas compté."],
    ["Chaque question vaut 1 point."],
    ["Les choix t'aident, par rapport à une question sans choix : on te laisse une chance. Une fois par évaluation, si ta feuille dit d'autres choix que la bonne réponse, mais que tu as cliqué sur exactement la bonne réponse, la question compte quand même : elle est « Trouvée au dernier moment »."],
    ["Je ramasse les feuilles à la fin."]
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
    ["Maintenant, la correction. Pour chaque question, avant de voir la réponse, ", Pz(v.prenom + " lit ta feuille et clique sur le ou les choix qui disent la même chose. Toi, tu fais de même avec la feuille de " + v.prenom + ".")],
    [Pz("Tu es garant de ce que tu cliques pour " + v.prenom + " : lis sa feuille avec soin. Si tu hésites, clique « Je ne suis pas sûr » : une hésitation n'est jamais comptée contre toi.")],
    ["Tu verras ta note à la fin de la correction. ", Pz("Plus la correction est faite avec soin, plus cette note sera proche de ta note définitive. Si elle est mal faite, attends-toi à une note définitive très différente.")],
    ["Pendant la correction, deux compétences sont évaluées : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». Pour les atteindre, tu dois garder ton point d'autonomie : ", Pz("tes « Oui » et tes « Non » pendant les questions doivent être vrais, et ce que tu cliques pour " + v.prenom + " doit dire la même chose que sa feuille."), " Sinon, ces deux compétences ne sont pas atteintes."],
    ["Si tu sais ton cours et que tu es sûr de toi, ta feuille dira toujours la même chose que l'un des choix."]
  ];
  return Page(badgeDe(e), "📝 Correction", h("div", {className:"attest"},
    h("div", {className:"tt"}, "Avant la correction, " + e.prenom),
    L.map(function(l, i){ return h("div", {key:i, className:"li"}, "• ", l); }),
    h("div", {className:"coche"}, h("span", {className:"case" + (coche ? " on" : "")}, coche ? "✓" : ""), "J'ai lu et compris"),
    h("button", {className:"btn btn-primary", style:{opacity:coche ? 1 : .45}}, "Je commence la correction")));
}

var SCENES_610 = [
  // B, premier tour de la question 1 : Julien a cliqué Rome ; son temps est fini ; Michel est encore sous le voile
  {id:"x610-1-b-julien", vue:"tablette", render:function(){ return Tablette(EcrDeclare(J, 0, 4), VoileN(M, J)); }},
  // B, second tour : Michel a cliqué Venise, sa feuille dit Rome : il doit dire « Non » ; Julien reste sous le voile
  {id:"x610-2-b-michel", vue:"tablette", render:function(){ return Tablette(VoileN(J, M), EcrDeclare(M, 0, 4)); }},
  // A, correction de la question 2 : Michel a déjà cliqué pour Julien (Madrid) ; Julien n'a pas encore cliqué pour Michel
  {id:"x610-3-a-correction", vue:"tablette", render:function(){ return Tablette(EcrCorrA(J, 1, true, 9), EcrCorrA(M, 1, false, 9)); }},
  // Les deux attestations, version A + B
  {id:"x610-4-attestation-1", vue:"tablette", vh:960, render:function(){ return Tablette(EcrAttest1AB(J, true), EcrAttest1AB(M, false)); }},
  {id:"x610-5-attestation-2", vue:"tablette", vh:900, render:function(){ return Tablette(EcrAttest2AB(J, true), EcrAttest2AB(M, false)); }}
];
SCENES = SCENES.concat(SCENES_610);
window.LISTE_SCENES = SCENES.map(function(s){ return {id:s.id, vue:s.vue, vh:s.vh || null}; });
rendre();

/* ═══════════════ Étape 3 — la correction et la fin de l'heure ═══════════════
   Ce qui change par rapport aux scènes existantes, point par point (PLAN-ETAPES-2-4.md, section « Étape 3 »).
   Sur l'évaluation d'essai : A (le voisin lit la feuille, 496), B (« Oui » / « Non » à la fin du temps, 495), la co-évaluation
   (511 à 539), le point d'autonomie (436, 449, 541), la note provisoire (474), « ⏸️ Finir à une autre heure » (469), le papier seul (467, 491, 492). */
var AUTO = [LIB_ELEVE["tr-personne-03"], LIB_ELEVE["tr-methodes-02"]];   // les deux compétences du point d'autonomie, par leur libellé élève (638, 640)

/* ── Ce que chacun a lu sur la feuille de l'autre (A, 496) : LU (maquette610) — Michel lit juste la feuille de Julien ;
      Julien lit « Venise » à la question 1 de Michel (son clic, que Julien n'a jamais vu), et « aucun » à la question 3.
      Ce que chacun a dit à la fin de son temps (B, 495). ── */
var DIT_B = {J:["oui", "non", "oui"], M:["non", "oui", "non"]};
// Avant que Paul tranche l'alerte de Michel, sa question 1 vaut 0 (Venise) ; après « Donner raison à Michel », Rome : 1 point (538)
function stDe(e, tranche){
  if(e.cle === "M") return tranche ? ["j", "f", "a"] : ["f", "f", "a"];
  return calc(e.prenom).st;
}
function marque(s){ return s === "j" ? "✓" : s === "t" ? "⛔" : s === "a" ? "∅" : "✗"; }   // console : « ⛔ Dernier moment » (439, 484)

/* ════════ La seconde attestation (507, 510, 549, 640) : une coche par ligne, les deux compétences par leur libellé élève ════════ */
function LignesAttest2(e, v){
  return [
    "Maintenant, la correction. Montre ta feuille à " + v.prenom + ".",
    "Pour chaque question, " + v.prenom + " clique ce que dit ta feuille. Toi, tu cliques ce que dit la feuille de " + v.prenom + ".",
    "Lis avec soin, et clique ce que tu lis.",
    "À la fin, " + v.prenom + " dira si tu as bien lu sa feuille.",
    "Deux compétences sont évaluées : « " + AUTO[0] + " » et « " + AUTO[1] + " ». Tu gardes ton point d'autonomie si tu as dit la vérité pendant les questions, et si tu lis avec soin la feuille de " + v.prenom + ". Sinon, ces deux compétences ne sont pas atteintes."
  ];
}
function Attest2(e, n){ var v = autreDe(e); return h(AttestCoches, {e:e, lignes:LignesAttest2(e, v), n0:n, titre:"Avant la correction, " + e.prenom, bouton:"Je commence la correction", va:"t-attest-corr-fait", titrePage:"📝 Correction"}); }
// Sur papier (492, 494) : pas de lecture du voisin ; l'élève corrige sa propre feuille au stylo, et c'est ce soin qui porte l'autonomie.
// Chaque ligne est une phrase déjà validée (507, 447, et la consigne de correction de la 7.7.1).
function LignesAttest2Papier(){
  return [
    "Maintenant, la correction.",
    [h("strong", {key:"b"}, "✅ Bravo ! "), "Sur ta feuille, mets simplement un V vert dans la marge à côté de ta réponse."],
    [h("strong", {key:"f"}, "❌ Tu avais faux. "), "Barre ta réponse en rouge et écris la bonne réponse en entier en vert à côté."],
    "Pendant la correction, deux compétences sont évaluées : « " + AUTO[0] + " » et « " + AUTO[1] + " ».",
    ["Tu les atteins si tu fais ce travail avec soin", ". ", "Sinon, ces deux compétences ne sont pas atteintes."]   // 447, mot pour mot
  ];
}
function Attest2Papier(e, n){ return h(AttestCoches, {e:e, lignes:LignesAttest2Papier(), n0:n, titre:"Avant la correction, " + e.prenom, bouton:"Je commence la correction", va:"t-papier-correction", titrePage:"📝 Correction"}); }
function EcrAttenteCorr(e){ return Page(badgeDe(e), "📝 Correction", h("div", {className:"etat-attente"}, "⏳ ", "La correction s'ouvrira dans un instant.")); }

/* ════════ La lecture du voisin, avant la révélation (496, 503, 508) ════════
   Chacun garde sa feuille et sa moitié : dans la moitié de Julien, c'est Michel qui clique ce que dit la feuille de Julien. */
function Compteur(pa, nbRev){
  var nbJ = pa.filter(function(x){ return x.cls === "juste" || x.cls === "trouvee-p"; }).length;
  return h("div", {className:"correction-compteur"},
    h("div", {className:"correction-compteur-score"},
      h("span", {className:"correction-compteur-num"}, nbJ), h("span", {className:"correction-compteur-lbl"}, nbJ > 1 ? " bonnes réponses" : " bonne réponse"),
      h("span", {className:"correction-compteur-sep-text"}, " sur "), h("span", {className:"correction-compteur-tot"}, nbRev),
      h("span", {className:"correction-compteur-lbl"}, nbRev > 1 ? " questions déjà corrigées" : " question déjà corrigée")),
    h("div", {className:"correction-compteur-pastilles"}, pa.map(function(x, i){ return h("span", {key:i, className:"correction-compteur-pastille " + x.cls}, x.t); })));
}
function pastilles3(e, nbRev){
  var st = stDe(e);
  return EV.questions.map(function(q, i){
    if(ORDRE_CORR.indexOf(i) >= nbRev) return {cls:"vide", t:String(i+1)};
    var s = st[i];
    return s === "j" ? {cls:"juste", t:"✅"} : s === "t" ? {cls:"trouvee-p", t:"✓"} : s === "pasdit" ? {cls:"nonrep", t:"⚪"} : {cls:"faux", t:"❌"};   // le ✓ orange (484)
  });
}
function EcrLecture(e, qi, dit, chrono){
  var q = EV.questions[qi], ordre = ORD[qi][e.cle], lu = LU[e.cle][qi], v = autreDe(e);
  var luArr = lu === "aucun" ? [] : lu, pos = ORDRE_CORR.indexOf(qi);
  var long = q.choix.some(function(c){ return c.length > 40; });   // comme l'écran de réponse : les choix longs, un par ligne
  return Page(badgeDe(e), "📝 Correction", h("div", {className:"serre-3e"},
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    Compteur(pastilles3(e, pos), pos),
    h("div", {className:"eleve-q-zone"}, QHead(qi, true), h("div", {className:"eleve-q-enonce"}, q.enonce),
      h("div", {className:"montre"}, "📄 " + e.prenom + ", montre ta feuille à " + v.prenom + "."),
      h("div", {className:"decl-titre"}, v.prenom + ", lis la feuille de " + e.prenom + " : qu'a-t-" + il(e) + " écrit ?"),
      h("div", {className:"decl-consigne"}, "Clique sur le ou les choix qui disent la même chose que sa feuille. Les mots ne sont pas forcément les mêmes."),
      h("div", {className:"lecture-l"}, h("div", {className:"soin"}, "Lis avec soin : c'est ton point d'autonomie."), chrono != null && ChronoSaisie(chrono, q.reponse)),
      h("div", {className:"eleve-choix" + (long ? " long" : "")},
        ordre.map(function(i){ return h("button", {key:i, className:"eleve-choix-btn" + (dit && luArr.indexOf(i) >= 0 ? " selected" : "")}, h("span", null, q.choix[i])); }),
        h("button", {className:"eleve-choix-btn aucun" + (dit && lu === "aucun" ? " selected" : "")}, "Sa feuille ne dit aucun de ces choix")),
      dit && h("div", {className:"eleve-feedback valide"}, "✅ Réponse enregistrée — tu peux encore la changer"))));
}
/* La même, sur la question 3 de l'évaluation de 3e (610-3) : elle tient dans la demi-tablette (464 : seule une question
   « longueur assumée » défile) — le compteur des 11 questions et la consigne sont resserrés, rien n'est retiré. */
function EcrCorrA3(e, dit){
  var q = EV3.questions[QI3], v = autreDe(e), lu = S3[e.cle].lu;
  return Page(badgeDe(e), "📝 Correction", h("div", {className:"serre-3e"},
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    h("div", {className:"correction-compteur"},
      h("div", {className:"correction-compteur-score"},
        h("span", {className:"correction-compteur-num"}, 0), h("span", {className:"correction-compteur-lbl"}, " bonne réponse"),
        h("span", {className:"correction-compteur-sep-text"}, " sur "), h("span", {className:"correction-compteur-tot"}, 0),
        h("span", {className:"correction-compteur-lbl"}, " question déjà corrigée")),
      h("div", {className:"correction-compteur-pastilles"}, EV3.questions.map(function(x, i){ return h("span", {key:i, className:"correction-compteur-pastille vide"}, String(i+1)); }))),
    h("div", {className:"eleve-q-zone"}, QHead3(QI3, true), h("div", {className:"eleve-q-enonce"}, q.enonce),
      h("div", {className:"montre"}, "📄 " + e.prenom + ", montre ta feuille à " + v.prenom + "."),
      h("div", {className:"decl-titre"}, v.prenom + ", lis la feuille de " + e.prenom + " : qu'a-t-" + il(e) + " écrit ?"),
      h("div", {className:"decl-consigne"}, "Clique sur le ou les choix qui disent la même chose que sa feuille. Les mots ne sont pas forcément les mêmes."),
      h("div", {className:"lecture-l"}, h("div", {className:"soin"}, "Lis avec soin : c'est ton point d'autonomie."), ChronoSaisie(9, 20)),
      h("div", {className:"eleve-choix long"},
        ORD3[e.cle].map(function(i){ return h("button", {key:i, className:"eleve-choix-btn" + (dit && lu.indexOf(i) >= 0 ? " selected" : "")}, h("span", null, q.choix[i])); }),
        h("button", {className:"eleve-choix-btn aucun"}, "Sa feuille ne dit aucun de ces choix")),
      dit && h("div", {className:"eleve-feedback valide"}, ENREG))));
}

/* L'élève seul sur sa tablette (500) : pas de voisin pour lire sa feuille ; il la lit lui-même, avec les mots du tour 603 */
var ADAM = {cle:"A", nom:"YVON Adam", prenom:"Adam", sexe:"M"};
function EcrLectureSeul(){
  var q = EV.questions[1], ordre = ORD[1].J;
  return Page(badgeDe(ADAM), "📝 Correction", h("div", {className:"seul-c"},
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    Compteur(EV.questions.map(function(x, i){ return {cls:"vide", t:String(i+1)}; }), 0),
    h("div", {className:"eleve-q-zone"}, QHead(1, true), h("div", {className:"eleve-q-enonce"}, q.enonce),
      h("div", {className:"decl-titre"}, "Qu'as-tu écrit sur ta feuille ?"),
      h("div", {className:"decl-consigne"}, "Clique sur le ou les choix qui disent la même chose que ta feuille. Les mots ne sont pas forcément les mêmes : c'est à toi de faire le rapprochement."),
      ChronoSaisie(12, q.reponse),
      h("div", {className:"eleve-choix"},
        ordre.map(function(i){ return h("button", {key:i, className:"eleve-choix-btn" + (i === 0 || i === 2 ? " selected" : "")}, h("span", null, q.choix[i])); }),
        h("button", {className:"eleve-choix-btn aucun"}, "Ma feuille ne dit aucun de ces choix")),
      h("div", {className:"eleve-feedback valide"}, "✅ Réponse enregistrée — tu peux encore la changer"))));
}

/* ════════ Après la révélation (439, 484) : le ✓ orange, le bandeau orange à liseré rouge ; plus d'infobulle ════════ */
function EcrRevele(e, qi, opts){
  opts = opts || {};
  var q = EV.questions[qi], ordre = ORD[qi][e.cle], tab = TABL[e.cle][qi];
  var lu = opts.papier ? FEUI[e.cle][qi] : LU[e.cle][qi], luArr = lu === "aucun" ? [] : lu;
  var st = opts.papier ? (FEUI[e.cle][qi] === "aucun" ? "a" : calc(e.prenom).st[qi] === "t" ? "f" : calc(e.prenom).st[qi]) : stDe(e)[qi];
  var pos = ORDRE_CORR.indexOf(qi), juste = st === "j", trouvee = st === "t";
  var pa = opts.papier ? EV.questions.map(function(x, i){ var p = ORDRE_CORR.indexOf(i); if(p > pos) return {cls:"vide", t:String(i+1)}; var s = i === qi ? st : (calc(e.prenom).st[i] === "j" ? "j" : "f"); return s === "j" ? {cls:"juste", t:"✅"} : {cls:"faux", t:"❌"}; }) : pastilles3(e, pos + 1);
  return Page(badgeDe(e), "📝 Correction", h(F, null,
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    Compteur(pa, pos + 1),
    h("div", {className:"eleve-q-zone"}, QHead(qi, true), h("div", {className:"eleve-q-enonce"}, q.enonce),
      trouvee ? h("div", {className:"trouvee"}, h("span", {className:"plus"}, "✓"),
          h("span", null, "Trouvée au dernier moment", h("span", {className:"sous"}, "Ta feuille disait autre chose, mais tu as cliqué sur la bonne réponse : la question compte. Cela n'arrive qu'une fois par évaluation.")))
        : h("div", {className:"correction-resultat " + (juste ? "juste" : "faux")}, juste ? "✅ Tu avais juste !" : "❌ Tu avais faux."),
      h("div", {className:"correction-choix"}, ordre.map(function(i){
        var bon = q.bonnes.indexOf(i) >= 0, moi = luArr.indexOf(i) >= 0;
        var cls = "correction-choix-item" + (bon ? " bonne" : (moi ? " eleve-faux" : ""));
        if(moi && bon) cls = "correction-choix-item eleve-juste";
        return h("div", {key:i, className:cls}, h("span", null, q.choix[i],
          bon && h("span", {className:"correction-tag tag-bonne"}, "Bonne réponse"),
          moi && h("span", {className:"correction-tag tag-tienne"}, "Ta réponse")));
      })),
      lu === "aucun" && h("div", {className:"tablette-ligne"}, "Ta réponse : ", "Ma feuille ne dit aucun de ces choix"),
      trouvee && h("div", {className:"tablette-ligne"}, "Sur la tablette, tu avais cliqué sur : " + tab.map(function(i){ return q.choix[i]; }).join(", ")),
      h("div", {className:"correction-consigne " + (juste ? "juste" : "faux")}, juste
        ? h(F, null, h("strong", null, "✅ Bravo ! "), "Sur ta feuille, mets simplement un ", h("span", {className:"stylo-vert"}, "V vert"), " dans la marge à côté de ta réponse.")
        : h(F, null, !trouvee && h("strong", null, "❌ Tu avais faux. "), h("span", {className:"stylo-rouge"}, "Barre ta réponse en rouge"), " et écris la bonne réponse en entier en ", h("span", {className:"stylo-vert"}, "vert"), " à côté.")),
      h("div", {className:"correction-explication"}, h("div", {className:"correction-explication-titre"}, "💡 Explication"), h("div", {className:"correction-explication-texte"}, q.explication)))));
}

/* ════════ La console pendant la correction (378, 381, 388, 439, 484, 496, 497) ════════ */
var PAS_LU = ["Michel", "Tom", "Hugo", "Sacha", "Rayan", "Théo"];   // n'ont pas encore lu la feuille de leur voisin (à la question 2)
var LIRE_SOIR = [   // B (497, 530) : les feuilles à relire, en faits
  ["DUVERNAY Michel", 0, "a dit que sa feuille ne disait pas son clic, Venise ; Julien y a lu Venise"],
  ["CARRÉ Tom", 0, "n'a pas dit si sa feuille disait son clic"],
  ["QUINTON Enzo", 0, "aucun de ces choix"],
  ["TESSIER Anna", 1, "a dit que sa feuille disait son clic, Madrid ; Rayan y a lu Madrid et Genève"],
  ["DUVERNAY Michel", 2, "aucun de ces choix"]
];
function lireJusqua(pos){ return LIRE_SOIR.filter(function(x){ return ORDRE_CORR.indexOf(x[1]) <= pos; }); }
function etatCorr3(qi, revele, pasLu, retire){
  return function(p){
    var e = p === "Julien" ? J : p === "Michel" ? M : null;
    var s = e ? stDe(e)[qi] : calc(p).st[qi];
    var lire = LIRE_SOIR.filter(function(x){ return pre(x[0]) === p && x[1] === qi; })[0];
    var r = {va:"c-autonomie", titre:"Clique sur le nom : « ⛔ Retirer le point d'autonomie », ou « 🚫 Marquer comme parti »."};
    if(retire && retire.indexOf(p) >= 0) r.flag = "🔴 point d'autonomie retiré";
    if(!revele){ r.cls = pasLu.indexOf(p) >= 0 ? "m-pasdit" : "m-dit"; r.st = pasLu.indexOf(p) >= 0 ? "⏳ sa feuille pas encore lue" : "📄 feuille lue"; return r; }
    if(s === "j"){ r.cls = "m-juste"; r.st = "✓ 1 pt"; }
    else if(s === "t"){ r.cls = "m-trouvee"; r.st = "⛔ Dernier moment"; }
    else if(s === "a"){ r.cls = "m-faux"; r.st = "∅ aucun · 0"; }
    else { r.cls = "m-faux"; r.st = "✗ 0"; }
    if(lire && !r.flag) r.flag = "⚠️ À relire";
    return r;
  };
}
function TabMini(num, a, b, etat, opts){   // un clic sur un nom agit sur l'élève (436, 449)
  opts = opts || {};
  function moitie(n, cote){
    if(!n) return h("div", {className:"tab-mini-m vide"}, h("div", {className:"nm"}, "1 élève"));
    var e = etat ? etat(pre(n), cote) : {};
    return h("div", {className:"tab-mini-m " + (e.cls || "")},
      e.va ? h("button", {className:"nm tab-nom", "data-va":e.va, title:e.titre || "Agit sur cet élève."}, n) : h("div", {className:"nm"}, opts.grip && h("span", {className:"grip"}, "⠿"), n),
      e.st && h("span", {className:"st"}, e.st),
      e.flag && h("span", {className:"flag"}, e.flag));
  }
  return h("div", {key:num, className:"tab-mini" + (!b ? " seul" : "")},
    h("div", {className:"tab-mini-h"}, h("span", null, "📱 Tablette " + num), !b ? h("span", null, "seul") : opts.coin === " " ? h("span", null, " ") : h("button", {className:"tab-oeil", title:"Montre les deux moitiés de la tablette " + num + " en direct, en grand. Ne change rien."}, "👁")),
    h("div", {className:"tab-mini-b"}, moitie(a, "g"), moitie(b, "d")));
}
var LEG_CORR_AV = [["#EDE9FE","📄 sa feuille est lue"],["#FEE2E2","⏳ pas encore lue","1px solid #EF4444"]];
var LEG_CORR_AP = [["#22C55E","✓ juste d'après la feuille"],["#EF4444","✗ faux d'après la feuille"],["#F97316","⛔ Dernier moment"],["#FFEDD5","⚠️ À relire sur la feuille, ce soir","1px solid #FDBA74"]];
var NOMS_SUIV = {1:"t-corr-q3-lecture", 2:"t-corr-q1-lecture"};
function PilotCorrection(qi, revele, opts){
  opts = opts || {};
  var q = EV.questions[qi], pos = ORDRE_CORR.indexOf(qi), derniere = pos === 2;
  var pasLu = revele || opts.toutLu ? [] : PAS_LU;
  var tabJ = Object.keys(RT).filter(function(p){ return RT[p][qi] === "J"; }).length;
  var res = Object.keys(RF).map(function(p){ return p === "Michel" ? stDe(M)[qi] : calc(p).st[qi]; });
  var nbF = res.filter(function(s){ return s === "j"; }).length, nbT = res.filter(function(s){ return s === "t"; }).length;
  var lire = lireJusqua(revele ? pos : pos - 1);
  var suivant = derniere
    ? h("button", {className:"btn btn-primary", disabled:!revele, "data-va":revele ? "c-coeval-attente" : null, title:revele ? "Ouvre d'abord, sur chaque tablette, la co-évaluation de la lecture ; le bilan s'affiche quand tous les présents y ont répondu." : "S'ouvre quand la dernière question est révélée."}, "🏁 Afficher leur bilan aux élèves")
    : h("button", {className:"btn btn-primary", disabled:!revele, "data-va":revele ? NOMS_SUIV[qi] : null, title:revele ? "Passe à la question suivante : chacun lit d'abord la feuille de son voisin." : "S'ouvre quand cette question est révélée."}, "Question suivante →");
  var reveler = revele ? h("button", {className:"btn btn-ghost", disabled:true, title:"Cette question est déjà révélée sur toutes les tablettes."}, "💡 Révélée")
    : pasLu.length ? h("button", {className:"btn btn-or ferme", disabled:true, title:"« 💡 Révéler » s'ouvre quand les " + 24 + " présents ont lu la feuille de leur voisin. Il en manque " + pasLu.length + "."}, "🔒 Révéler")
    : h("button", {className:"btn btn-or", "data-va":opts.revelerVers || "t-corr-q2-apres", title:"Montre la bonne réponse et l'explication sur toutes les tablettes et au tableau. Commente la question après, jamais avant."}, "💡 Révéler");
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📝 Correction — " + EV.titre + " — " + CLASSE, InfoI("Pour chaque question, chacun lit d'abord la feuille de son voisin et clique ce qu'elle dit, dans la moitié du voisin. « 💡 Révéler » s'ouvre quand tous les présents l'ont fait. Tu commentes la question après la révélation, jamais avant : sinon, ils cliqueraient ce que tu dis. Les questions vont de la plus ratée à la mieux réussie. Un clic sur un nom agit sur l'élève.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:5, className:"btn btn-ghost btn-sm"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status correction"}, "Question " + (pos+1) + " / 3 — Q" + (qi+1) + (revele ? " · révélée" : " · lecture de la feuille du voisin")),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"pilot-q-current"},
          h("div", {className:"num"}, "Question " + (qi+1)),
          h("div", {className:"enonce"}, q.enonce),
          h("div", {className:"pilot-q-bonne"}, h("span", {style:{fontWeight:900}}, "✓ Bonne" + (q.bonnes.length > 1 ? "s" : "") + " réponse" + (q.bonnes.length > 1 ? "s" : "") + " : "), q.bonnes.map(function(i){ return q.choix[i]; }).join("  /  ")),
          h("div", {className:"niv-row"}, h("span", {className:"niv-bulle"}, "Difficulté : " + NIV[q.niveau].label), h("span", {className:"niv-bulle"}, tabJ + " / 24 justes sur la tablette (" + Math.round(tabJ * 100 / 24) + "%)"))),
        !revele && h("div", {className:"pilot-chrono-card actif saisie-carte"},
          h("div", {className:"label actif"}, "📄 Temps pour lire la feuille du voisin"),
          h("div", {className:"v"}, opts.toutLu ? "3s" : "7s"),
          h("div", {className:"desc"}, "sur " + q.reponse + " s, le temps de réponse de la question · orange à la moitié, rouge les 5 dernières secondes")),
        h("div", {className:"row", style:{marginTop:".8rem"}},
          h("button", {className:"btn btn-ghost", disabled:pos <= 0, "data-va":pos > 0 ? "t-corr-q2-apres" : null, title:pos <= 0 ? "C'est la première question corrigée : il n'y a pas de question précédente." : "Revient à la question corrigée juste avant, telle qu'elle a été révélée."}, "← Question précédente"),
          reveler, suivant),
        !revele && pasLu.length > 0 && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 💡 Révéler » s'ouvre quand les 24 présents ont lu la feuille de leur voisin. Il en manque " + pasLu.length + " :"),
          h("div", {className:"noms"}, pasLu.map(function(p){ return nomDe(p); }).join(" · ")),
          h("div", {className:"ss"}, "Le nom est celui dont la feuille n'est pas encore lue. Une tablette en panne : « 🚫 Départ d'un élève », en haut ; il ne bloque plus, ses questions sortent du total et tu fixes sa note d'après sa feuille.")),
        lire.length > 0 && h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, x[0] + " — Q" + (x[1]+1) + " : " + x[2]); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, revele ? "📄 Leur feuille, d'après la lecture du voisin" : "📄 La lecture de leur feuille", InfoI(revele ? "Chaque moitié : la question d'après sa feuille, lue par le voisin. « ⛔ Dernier moment » : feuille fausse, tablette entièrement juste, une fois par évaluation. « ⚠️ À relire » : la lecture du voisin ne colle pas avec ce que l'élève a dit à la fin de son temps (« Oui » ou « Non »), ou il n'a rien dit." : "Chaque moitié : la feuille de cet élève est-elle déjà lue par son voisin ? Le voisin clique dans la moitié de l'élève.")),
        h("div", {className:"ss"}, revele ? ("Feuilles justes : " + nbF + " / 24 · ⛔ Dernier moment : " + nbT) : ((24 - pasLu.length) + " / 24 feuilles lues — " + pasLu.length + " pas encore")),
        GrilleTablettes(PAIRES, etatCorr3(qi, revele, pasLu, opts.retire)),
        Legende(revele ? LEG_CORR_AP : LEG_CORR_AV)))), true);
}

/* ── La seconde attestation, côté console : elle attend que tous les présents l'aient cochée (438, 549) ── */
function PilotAttest2(){
  var enCours = {Tom:"3/5", Sacha:"4/5", Lou:"2/5", "Théo":"4/5"};
  var etat = function(p){ return enCours[p] ? {cls:"m-attest", st:"attestation " + enCours[p]} : {cls:"m-pret", st:"✓ prêt · 10:3" + (p.length % 5 + 1)}; };
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📝 Correction — " + EV.titre + " — " + CLASSE, InfoI("Avant la correction, chaque moitié montre la seconde attestation, une coche par ligne. La correction commence quand tous les présents l'ont cochée en entier, comme au début.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:5, className:"btn btn-ghost btn-sm"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status correction"}, "✍️ Seconde attestation — 20 / 24 prêts"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, h("button", {className:"btn btn-primary ferme", disabled:true, title:"S'ouvre quand les 24 présents ont coché toutes les lignes de la seconde attestation. Il en manque 4."}, "🔒 ▶️ Commencer la correction")),
        h("div", {className:"manquent"},
          h("div", {className:"tt"}, "La correction commence quand les 24 présents ont coché la seconde attestation. Il en manque 4 :"),
          h("div", {className:"noms"}, ["CARRÉ Tom", "OLLIVIER Sacha", "CHEVALLIER Théo", "ZELLER Lou"].join(" · "))),
        h("div", {className:"pilot-eleve-help"}, "La correction commence par Q2, la plus ratée sur les tablettes (" + Object.keys(RT).filter(function(p){ return RT[p][1] === "J"; }).length + " / 24 justes).")),
      h("div", {className:"suivi-box"},
        h("h3", null, "✍️ La seconde attestation", InfoI("Où en est chacun : les lignes cochées sur 5, et l'heure de la dernière coche, gardée comme au début.")),
        h("div", {className:"ss"}, "20 / 24 prêts"),
        GrilleTablettes(PAIRES, etat),
        Legende([["#E8F5E9","✓ prêt : les 5 lignes cochées"],["#FEF3C7","attestation en cours : lignes cochées sur 5"]])))), true);
}

/* ── L'estimation, côté console (444) ── */
function PilotEstimation(){
  var distrib = [["vert", 6], ["bleu", 9], ["orange", 5], ["rouge", 2]];
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📊 Autoévaluation — " + EV.titre + " — " + CLASSE, InfoI("Chaque élève dit combien de bonnes réponses il pense avoir. Cette estimation sert à savoir s'il se surévalue, se sous-évalue ou s'évalue correctement ; son bilan la compare à sa note.")),
      [h("button", {key:5, className:"btn btn-ghost btn-sm"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status autoeval"}, "Phase autoévaluation — 22 / 24 élèves"),
    h("p", {style:{margin:".8rem 0", color:"var(--gris)"}}, "Les élèves choisissent dans quelle fourchette ils estiment avoir réussi. Clique sur ", h("strong", null, "📝 Lancer la correction"), " quand tu es prêt."),
    h("div", {className:"autoeval-prof-distrib"}, distrib.map(function(d){ var m = MAITRISE.filter(function(x){ return x.k === d[0]; })[0];
      return h("div", {key:d[0], className:"autoeval-prof-cell fourchette-" + d[0]}, h("span", null, m.em + " " + m.lib), h("strong", null, d[1])); })),
    h("div", {style:{fontSize:".85rem", color:"var(--gris)"}}, "Pas encore : PERRAUD Jade, QUINTON Enzo."),
    h("div", {className:"row", style:{marginTop:"1rem"}}, h("button", {className:"btn btn-or", "data-va":"c-attest2", title:"Ferme l'estimation et ouvre, sur chaque moitié, la seconde attestation, avant la première question à corriger."}, "📝 Lancer la correction"))), true);
}

/* ════════ Le point d'autonomie (436, 449, 541) : un clic sur un nom, « ⛔ Retirer le point d'autonomie », la garde, « ↩️ Rendre » ════════ */
function FondCorr(){ return PilotCorrection(1, true); }
function ScAutonomie(retire){
  return Fenetre(retire ? PilotCorrection(1, true, {retire:["Hugo"]}) : FondCorr(), "👤 FOUCHER Hugo", "Tablette 3, moitié de droite · avec ESNAULT Inès",
    h(F, null,
      h("p", null, retire ? h(F, null, h("strong", null, "🔴 Point d'autonomie retiré"), " à 10:41. Ses deux compétences d'autonomie sont en Maîtrise insuffisante ; sa note ne bouge pas.")
        : "Il commence l'évaluation avec son point d'autonomie : ses deux compétences d'autonomie sont en Très bonne maîtrise. Le retirer les met en Maîtrise insuffisante ; sa note ne bouge pas, puisque la note, c'est la feuille."),
      h("p", {className:"fen-note"}, "Il ne le voit pas en direct : son voisin regarde la tablette. Il le lit dans son bilan et dans « Mes évaluations », en compétences atteintes ou non atteintes.")),
    retire ? [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-corr-q2-apres", title:"Ferme la fiche ; le point reste retiré."}, "✕ Fermer"), h("button", {key:2, className:"btn btn-vert", "data-va":"c-corr-q2-apres", title:"Rend son point d'autonomie à Hugo : ses deux compétences d'autonomie repassent en Très bonne maîtrise."}, "↩️ Rendre")]
      : [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-corr-q2-apres", title:"Ferme la fiche sans rien changer."}, "✕ Fermer"), h("button", {key:3, className:"btn btn-ghost", "data-va":"c-depart", title:"Marque Hugo comme parti : il ne bloque plus la classe, ses questions manquées sortent de son total."}, "🚫 Marquer comme parti"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-autonomie-garde", title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")],
    "c-corr-q2-apres");
}
function ScAutonomieGarde(qui, retour){
  var noms = qui || ["FOUCHER Hugo"];
  return Fenetre(retour === "c-coeval-attente" ? PilotCoevalE(false) : FondCorr(), "⛔ Retirer le point d'autonomie " + (noms.length > 1 ? "aux deux" : "à " + noms[0]) + " ?", noms.join(" et "),
    h(F, null,
      h("p", null, (noms.length > 1 ? "Leurs deux compétences d'autonomie passent" : "Ses deux compétences d'autonomie passent") + " en Maîtrise insuffisante, pour cette évaluation : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». La note ne bouge pas."),
      h("p", {className:"fen-note"}, "Côté élève, son bilan dira : « " + AUTO[0] + " » et « " + AUTO[1] + " » non atteintes. « ↩️ Rendre » le défait, en direct ou le soir, dans sa fiche.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":retour || "c-autonomie", title:"Ne retire rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-va":retour === "c-coeval-attente" ? "c-coeval-retire-" + (noms.length > 1 ? "deux" : pre(noms[0]).toLowerCase()) : "c-autonomie-retiree", title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")], retour || "c-autonomie");
}
/* Le téléphone : un clic sur un nom, le même geste (436) */
function TelAutonomie(){
  var fond = TelCorrApres();
  var feuille = h("div", {className:"tel-sheet-fond", "data-echap":"p-corr-apres"},
    h("div", {className:"tel-sheet"},
      h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".5rem"}}, h("strong", {style:{fontSize:"1rem"}}, "FOUCHER Hugo"), h("button", {className:"tel-x", "data-va":"p-corr-apres", title:"Ferme la fiche de l'élève sans rien changer."}, "✕")),
      h("div", {style:{fontSize:".78rem", opacity:.85, marginBottom:".6rem"}}, "Tablette 3, moitié de droite · avec ESNAULT Inès"),
      h("button", {className:"tel-btn tb-rouge", "data-va":"c-autonomie-garde", title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie"),
      h("button", {className:"tel-btn tb-ghost", "data-va":"c-depart", title:"Marque Hugo comme parti : il ne bloque plus la classe."}, "🚫 Marquer comme parti en cours de séance"),
      h("div", {className:"tel-etat"}, "État actuel : Q2 juste d'après sa feuille · point d'autonomie gardé.")));
  return h(F, null, fond, feuille);
}

/* ── Le téléphone pendant la correction (421) : la lecture, les noms qui manquent ; puis le suivi, « ⛔ Dernier moment », « ⚠️ À relire » ── */
function TelCorrAvant(){
  var modeDe = function(p){ return PAS_LU.indexOf(p) >= 0 ? {mode:"pasrecopie"} : {mode:"recopie"}; };
  return TelCadre([
    TelBandeau("Phase : correction — Q2 (1re sur 3)", "lecture de la feuille du voisin"),
    h("div", {key:"c", className:"tel-chrono orange"}, h("div", {className:"lb"}, "📄 Temps pour lire la feuille du voisin"), "7s"),
    h("div", {key:"q"}, TelQ(1)),
    h("div", {key:"a", className:"tel-actions"},
      h("button", {className:"tel-btn tb-or tb-large ferme", disabled:true, title:"« 💡 Révéler » s'ouvre quand les 24 présents ont lu la feuille de leur voisin. Il en manque 6."}, "🔒 Révéler — il en manque 6"),
      h("button", {className:"tel-btn tb-ghost tb-small ferme", disabled:true, title:"C'est la première question corrigée : il n'y a pas de question précédente."}, "← Question précédente")),
    h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Feuille pas encore lue : "), PAS_LU.map(function(p){ return nomDe(p); }).join(" · "),
      h("div", {className:"ss"}, "Une tablette en panne : un clic sur le nom, puis « 🚫 Marquer comme parti ».")),
    h("div", {key:"l"}, TelListe("TABLETTES — 18 / 24 feuilles lues · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["📄 feuille lue", "⏳ pas encore lue"])),
    h("div", {key:"t"}, h("button", {className:"tel-btn tb-rouge tb-small", "data-va":"c-terminer"}, "🛑 Terminer la session"))]);
}
function telPastille(p, qi, mode){
  if(mode === "voile") return {t:"🙈", cls:"tp-voile"};
  if(mode === "rep") return {t:"⏳", cls:"tp-attente"};
  if(mode === "pasrep") return {t:"⏳", cls:"tp-rouge"};
  if(mode === "recopie") return {t:"📄", cls:"tp-recopie"};
  if(mode === "pasrecopie") return {t:"⏳", cls:"tp-rouge"};
  if(mode === "corr"){
    var s = p === "Michel" ? stDe(M)[qi] : calc(p).st[qi];
    return s === "j" ? {t:"✓", cls:"tp-juste"} : s === "t" ? {t:"⛔", cls:"tp-trouvee"} : {t:"✗", cls:"tp-faux"};
  }
  var c = RT[p][qi];
  return c === "J" ? {t:"✓", cls:"tp-juste"} : c === "Y" ? {t:"✓+", cls:"tp-jaune"} : c === "O" ? {t:"½", cls:"tp-orange"} : {t:"✗", cls:"tp-faux"};
}
function TelCorrApres(){
  var q = EV.questions[1], lire = lireJusqua(0);
  var flagDe = function(p){ return LIRE_SOIR.some(function(x){ return pre(x[0]) === p && x[1] === 1; }) ? "⚠️" : null; };
  var res = Object.keys(RF).map(function(p){ return p === "Michel" ? stDe(M)[1] : calc(p).st[1]; });
  return TelCadre([
    TelBandeau("Phase : correction — Q2 (1re sur 3)", "révélée"),
    h("div", {key:"q"}, TelQ(1)),
    h("div", {key:"a", className:"tel-actions"},
      h("button", {className:"tel-btn tb-primary tb-large", "data-va":"t-corr-q3-lecture", title:"Passe à la question suivante de la correction : chacun lit d'abord la feuille de son voisin."}, "Question suivante →"),
      h("button", {className:"tel-btn tb-ghost tb-small ferme", disabled:true, title:"C'est la première question corrigée : il n'y a pas de question précédente."}, "← Question précédente")),
    h("div", {key:"x", className:"tel-expl"}, h("div", {className:"t"}, "💡 EXPLICATION"), q.explication),
    h("div", {key:"su", className:"tel-suivi"}, "D'après la feuille : ", h("strong", null, res.filter(function(s){ return s === "j"; }).length + " / 24 justes"), " · ⛔ Dernier moment : ", h("strong", null, res.filter(function(s){ return s === "t"; }).length)),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + lire.length + ") : "), lire.map(function(x){ return x[0] + " — Q" + (x[1]+1) + " : " + x[2]; }).join(" · ")),
    h("div", {key:"st"}, TelStats(1, [0, 1, 2])),
    h("div", {key:"l"}, TelListe("TABLETTES — d'après la feuille · clic sur un nom pour agir", function(){ return {qi:1, mode:"corr"}; }, flagDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "⛔ Dernier moment", "✗ faux", "⚠️ À relire ce soir"])),
    h("div", {key:"t"}, h("button", {className:"tel-btn tb-rouge tb-small", "data-va":"c-terminer"}, "🛑 Terminer la session"))]);
}

/* ── Le tableau pendant la lecture (422, 496) : l'énoncé, sans les choix ── */
function Board(mode){
  var qi = mode === "reponse" ? 0 : 1, q = EV.questions[qi];
  var bandeau = h("div", {className:"board-bandeau-haut"},
    h("span", {className:"board-classe-mini"}, CLASSE),
    h("span", {className:"board-niveau-pastille", style:{background:NIV[q.niveau].color}}, NIV[q.niveau].label),
    h("span", {className:"board-q-count"}, mode === "reponse" ? "Question 1 / 3" : "Correction — Q2 / 3"),
    mode !== "correction" && h("span", {className:"board-progress"}, mode === "reponse" ? "✋ 10 / 12 ont répondu" : "✍️ 18 / 24 ont répondu"));
  var corps;
  if(mode === "reponse"){
    corps = h("div", {className:"board-active board-reflexion"}, bandeau,
      h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
      h("div", {className:"board-chrono-zone"},
        h("div", {className:"board-chrono-label"}, "🖊️ ", "POSE TON STYLO."),
        h("div", {className:"board-tour-l"}, Cercle(9, q.reponse, "#EC4899"), h("span", {className:"board-tour"}, "1er tour")),
        h("div", {className:"board-chrono-sub"}, "Temps de réponse")));
  } else if(mode === "recopie"){
    corps = h("div", {className:"board-active board-reflexion recopie"}, bandeau,
      h("div", {style:{textAlign:"center", paddingTop:".6rem"}}, h("span", {className:"board-correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe")),
      h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
      h("div", {className:"board-chrono-zone"},
        h("div", {className:"board-chrono-label"}, "📄 ", "Lis avec soin : c'est ton point d'autonomie."),
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

/* ════════ La co-évaluation de la lecture, sur l'évaluation d'essai (511 à 539, 547) ════════
   Chaque moitié a son état : d'abord les trois choix ; « ❌ » ou « 🤔 » : « … c'est laquelle ? » et les questions ;
   la question cliquée, les autres disparaissent : « Qu'avais-tu écrit sur ta feuille ? » ; s'il clique ce que l'autre avait lu : « vous êtes d'accord » (539). */
var RECHOIX = {M:[[2], null, null], J:[null, null, null]};   // Michel dit avoir écrit Rome à la question 1
function Coeval(p){
  var e = p.e, v = autreDe(e), EVx = p.ev || EV;
  var ordreDe = p.ordre || function(qc){ return ORD[qc][e.cle]; }, luDe = p.lu || function(qc){ return LU[e.cle][qc]; };
  var s = useState(p.k || null), k = s[0], setK = s[1];
  var s2 = useState(p.q == null ? null : p.q), qc = s2[0], setQ = s2[1];
  var s3 = useState(p.ecrit || null), ecrit = s3[0], setEcrit = s3[1];
  var s4 = useState(!!p.daccord), daccord = s4[0], setDaccord = s4[1];
  function choisir(x){ setDaccord(false); setK(x); setQ(null); setEcrit(null); }
  function ecrire(i){
    var n = i === "aucun" ? "aucun" : (ecrit && ecrit !== "aucun" ? (ecrit.indexOf(i) >= 0 ? ecrit.filter(function(y){ return y !== i; }) : ecrit.concat([i])) : [i]);
    var lu = luDe(qc);
    var meme = n === "aucun" ? lu === "aucun" : (lu !== "aucun" && n.length === lu.length && n.every(function(y){ return lu.indexOf(y) >= 0; }));
    if(meme){ setDaccord(true); setK(null); setQ(null); setEcrit(null); return; }
    setEcrit(n);
  }
  var zone = [];
  var btn = function(x){ return h("button", {key:x, className:"co-btn " + x + (k === x ? " on" : ""), "data-local":"1", "aria-pressed":k === x, onClick:function(){ choisir(x); }}, EM_CO[x] + " ", txtCo(x, v)); };
  if(!k || k === "ok"){
    zone.push(h("div", {key:"t", className:"decl-titre co-titre"}, e.prenom + ", " + v.prenom + " a-t-" + il(v) + " bien lu ta feuille ?"));
    if(daccord) zone.push(h("div", {key:"d", className:"eleve-feedback valide"}, "Tu as cliqué ce que " + v.prenom + " avait lu : vous êtes d'accord."));
    zone.push(h("div", {key:"r", className:"co-regle"}, "☝️ " + REGLE_CO));
    zone.push(h("div", {key:"bs", className:"co-btns"}, ["ok", "peut", "mal"].map(btn)));
    if(k === "ok"){ zone.push(h("div", {key:"f", className:"eleve-feedback valide"}, ENREG)); zone.push(h("div", {key:"w", className:"co-attente"}, "⏳ Attends ton bilan...")); }
  } else if(qc == null){
    zone.push(h("div", {key:"t", className:"decl-titre co-titre co-" + k}, EM_CO[k] + " " + e.prenom + ", tu penses que " + v.prenom + " a " + (k === "peut" ? "peut-être " : "") + "mal lu ta feuille pour une question : c'est laquelle ?"));
    zone.push(h("div", {key:"l", className:"co-liste cliquable" + (EVx.questions.length > 5 ? " serree" : "")}, EVx.questions.map(function(q, i){
      return h("button", {key:i, className:"co-l co-lb", "data-local":"1", onClick:function(){ setQ(i); setEcrit(null); }}, h("strong", null, "Question " + (i+1)), " · ", p.liste ? p.liste(q) : q.enonce);
    })));
    zone.push(h("div", {key:"r", className:"co-regle"}, "☝️ " + REGLE_CO));
    zone.push(h("div", {key:"a", className:"co-actions"}, h("button", {className:"btn btn-ghost", "data-local":"1", onClick:function(){ setK(null); }}, "↩️ Changer")));
  } else {
    var q = EVx.questions[qc], lu = luDe(qc);
    zone.push(h("div", {key:"q", className:"co-l choisie"}, EM_CO[k] + " " + txtCo(k, v, qc)));
    zone.push(h("div", {key:"seule", className:"co-seule"}, "☝️ C'est ta seule question de désaccord."));
    zone.push(h("div", {key:"t", className:"decl-titre"}, "Qu'avais-tu écrit sur ta feuille ?"));
    zone.push(h("div", {key:"c", className:"eleve-choix" + (p.long ? " long" : "")},
      ordreDe(qc).map(function(i){
        var on = ecrit && ecrit !== "aucun" && ecrit.indexOf(i) >= 0;
        return h("button", {key:i, className:"eleve-choix-btn" + (on ? " selected" : ""), "data-local":"1", onClick:function(){ ecrire(i); }},
          h("span", null, q.choix[i], lu !== "aucun" && lu.indexOf(i) >= 0 && h("span", {className:"tag-lu"}, v.prenom + " a lu")));
      }),
      h("button", {className:"eleve-choix-btn aucun" + (ecrit === "aucun" ? " selected" : ""), "data-local":"1", onClick:function(){ ecrire("aucun"); }}, "Ma feuille ne dit aucun de ces choix")));
    zone.push(h("div", {key:"r", className:"co-regle"}, REGLE_CO));
    if(ecrit) zone.push(h("div", {key:"f", className:"eleve-feedback valide"}, ENREG));
    zone.push(h("div", {key:"a", className:"co-actions"}, h("button", {className:"btn btn-ghost", "data-local":"1", onClick:function(){ setQ(null); setEcrit(null); }}, "↩️ Changer"),
      ecrit && h("span", {className:"co-attente", style:{margin:0, alignSelf:"center"}}, "⏳ Attends ton bilan...")));
  }
  return Page(badgeDe(e), "📝 Correction", h("div", {className:"eleve-q-zone"}, zone));
}
function CoevalE(e, o){ o = o || {}; return h(Coeval, {key:e.cle + JSON.stringify(o), e:e, k:o.k, q:o.q, ecrit:o.ecrit, daccord:o.daccord}); }
function Coeval3(e, o){   // sur l'évaluation de 3e : la liste montre le début de chaque énoncé (546) ; seule la question 3 a ses choix dans la maquette
  o = o || {};
  return h(Coeval, {key:"3" + e.cle + JSON.stringify(o), e:e, k:o.k, q:o.q, ecrit:o.ecrit, ev:EV3, long:true,
    liste:function(q){ return tronque(q.enonce.replace(/^Sur ta copie, /, ""), 58); },
    ordre:function(qc){ return qc === QI3 ? ORD3[e.cle] : []; }, lu:function(qc){ return qc === QI3 ? S3[e.cle].lu : []; }});
}

/* ── Ta console pendant la co-évaluation : l'alerte, dans l'ordre de 535 à 538, les ⛔ de 541, le quatrième bouton de 545 ── */
function AlerteCoE(tel){
  var q = EV.questions[0];
  var corps = [
    h("div", {key:"t", className:"al-t"}, "❌ DUVERNAY Michel pense qu'ABRIAL Julien a mal lu sa feuille à la question 1"),
    h("div", {key:"q", className:"al-l"}, "Q1 · " + q.enonce + " — bonne réponse : Rome"),
    h("div", {key:"a", className:"al-l"}, "À la correction, Julien a lu ", h("strong", null, "Venise"), " sur la feuille de Michel."),
    h("div", {key:"r", className:"al-l"}, "Après la correction, Michel dit avoir écrit ", h("strong", null, "Rome"), ". Il connaissait alors la bonne réponse."),
    h("div", {key:"x", className:"al-l al-b"}, "⚠️ Les deux ne peuvent pas être vrais : regarde la feuille de Michel."),
    h("div", {key:"y", className:"al-l al-y"}, "👉 Pendant la question, avant de connaître la réponse, Michel avait cliqué Venise et dit que sa feuille ne disait pas Venise : ça va dans son sens."),
    h("div", {key:"e", className:"al-l"}, "Si Michel a raison, sa question 1 passe de 0 à 1 point."),
    h("div", {key:"z", className:"al-l al-c"}, "Appelle-les à la fin de l'heure, la feuille de Michel en main.")
  ];
  var B = tel ? function(t, v, va, ti){ return h("button", {key:t, className:"tel-btn tb-" + v, "data-va":va, title:ti}, t); }
              : function(t, v, va, ti){ return h("button", {key:t, className:"btn btn-" + v, "data-va":va, title:ti}, t); };
  var boutons = [
    B("Donner raison à Michel : Rome → 1 point", tel ? "vert" : "vert", "c-coeval-tranche", "Applique ce que Michel dit avoir écrit, Rome : sa question 1 passe à 1 point, et sa note se recalcule. L'alerte se ferme ; « ↩️ Défaire » la rouvre."),
    B("Donner raison à Julien : Venise → 0 point", tel ? "turq" : "turquoise", "c-coeval-tranche", "Garde la lecture de Julien, Venise : rien ne change. L'alerte se ferme."),
    B("La feuille dit autre chose : je clique ce qu'elle dit", "primary", "c-coeval-feuille", "Ouvre les choix de la question 1 : tu cliques ce que dit la feuille de Michel, et sa note se recalcule."),
    B("📌 Je relis ce soir la question 1", tel ? "or" : "or", "c-coeval-tranche", "La question 1 de Michel passe « ⚠️ À relire » : elle t'attend ce soir dans Résultats. L'alerte se ferme.")
  ];
  var auto = tel
    ? h("div", {key:"au", className:"g3"}, h("button", {className:"tel-btn tb-ghost tb-small", "data-va":"c-autonomie-michel", title:"Retire le point d'autonomie à Michel, après une confirmation."}, "⛔ Michel"), h("button", {className:"tel-btn tb-ghost tb-small", "data-va":"c-autonomie-julien", title:"Retire le point d'autonomie à Julien, après une confirmation."}, "⛔ Julien"), h("button", {className:"tel-btn tb-rougeclair tb-small", "data-va":"c-autonomie-deux", title:"Retire le point d'autonomie aux deux, après une confirmation."}, "⛔ Aux deux"))
    : h(F, {key:"au"}, h("div", {className:"al-auto-t"}, "⛔ Retirer le point d'autonomie :"),
        h("div", {className:"al-auto"},
          h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-autonomie-michel", title:"Retire le point d'autonomie à Michel, après une confirmation. « ↩️ Rendre » le défait."}, "⛔ à Michel"),
          h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-autonomie-julien", title:"Retire le point d'autonomie à Julien, après une confirmation. « ↩️ Rendre » le défait."}, "⛔ à Julien"),
          h("button", {className:"btn btn-sm btn-aux-deux", "data-va":"c-autonomie-deux", title:"Retire le point d'autonomie aux deux, après une confirmation : par exemple si aucun n'a joué le jeu. « ↩️ Rendre » le défait."}, "⛔ aux deux")));
  if(tel) return h("div", {className:"tel-alerte"}, corps, boutons, auto, h("div", {className:"tel-al-note"}, "⛔ : retirer le point d'autonomie."));
  return h("div", {className:"alerte-co"}, h("div", {className:"al-corps"}, corps),
    h("div", {className:"al-actions"}, boutons, auto,
      h("div", {className:"al-note"}, "L'alerte est apparue quand Michel a cliqué ce qu'il avait écrit ; elle disparaît s'il change d'avis avant le bilan. Aucun point d'autonomie n'est retiré tout seul : c'est toi qui décides.")));
}
function PilotCoevalE(tranche, retire){
  retire = retire || [];
  var att = tranche ? [] : ATT_CO;
  var co = Object.assign({}, CO); if(tranche) Object.keys(co).forEach(function(p){ if(co[p] === "att") co[p] = "ok"; });
  var nOk = Object.keys(co).filter(function(p){ return co[p] === "ok"; }).length;
  var etat = function(p){
    var c = co[p];
    if(c === "att") return {cls:"m-pasdit", st:"⏳ pas encore répondu"};
    if(c === "ok") return {cls:"m-juste", st:"✅ bien lu"};
    if(c.indexOf("mal") === 0) return tranche ? {cls:"m-juste", st:"❌ Q" + c.slice(3) + " · tranché"} : {cls:"m-faux m-co", st:"❌ mal lu Q" + c.slice(3), flag:"alerte : à trancher"};
    return {cls:"m-coq", st:"🤔 peut-être Q" + c.slice(4), flag:"à relire ce soir"};
  };
  var lire = LIRE_SOIR.concat([["PERRAUD Jade", 1, "🤔 pense qu'Enzo a peut-être mal lu sa feuille"], ["MAILLARD Noah", 2, "🤔 pense qu'Emma a peut-être mal lu sa feuille"]]);
  return Console("pilotage", "pilot", h("div", {className:"card"},
    tranche ? h("div", {className:"alerte-co tranchee"}, h("div", {className:"al-corps"}, h("div", {className:"al-t"}, "✅ Alerte tranchée : raison donnée à Michel"), h("div", {className:"al-l"}, "La question 1 de DUVERNAY Michel passe à 1 point, « Corrigé d'après ta feuille » dans son bilan : sa note provisoire passe à 1 / 3.")),
      h("div", {className:"al-actions"}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-coeval-attente", title:"Rouvre l'alerte, telle qu'elle était : rien n'est appliqué."}, "↩️ Défaire")))
      : AlerteCoE(false),
    TitreCarte(h(F, null, "🤝 Co-évaluation de la lecture — " + EV.titre + " — " + CLASSE, InfoI("À la fin de la correction, chacun dit, dans sa moitié, s'il pense que son voisin a bien lu sa feuille. Un « ❌ » t'alerte aussitôt, en haut ; un « 🤔 » passe la question « ⚠️ À relire » ce soir. Le bilan s'affiche quand tous les présents ont répondu.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:5, className:"btn btn-ghost btn-sm"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status correction"}, "Fin de la correction — chacun dit ce qu'il pense de la lecture de sa feuille · " + (24 - att.length) + " / 24 ont répondu"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, tranche
          ? h("button", {className:"btn btn-or", "data-va":"t-bilan", title:"Affiche sur chaque moitié le bilan de l'élève : sa note provisoire, question par question, ses compétences, son estimation."}, "🏁 Afficher leur bilan aux élèves")
          : h("button", {className:"btn btn-or ferme", disabled:true, title:"« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les 24 présents ont répondu. Il en manque " + att.length + "."}, "🔒 🏁 Afficher leur bilan aux élèves")),
        att.length > 0 && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les 24 présents ont répondu. Il en manque " + att.length + " :"),
          h("div", {className:"noms"}, att.join(" · "))),
        h("div", {className:"co-compte"}, h("div", null, "✅ ", h("strong", null, String(nOk)), " pensent : bien lu"), h("div", null, "🤔 ", h("strong", null, "2"), " pensent : peut-être mal lu (à relire ce soir)"), h("div", null, "❌ ", h("strong", null, "1"), tranche ? " pense : mal lu (tranché)" : " pense : mal lu (alerte, en haut)")),
        h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, x[0] + " — Q" + (x[1]+1) + " : " + x[2]); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, "🤝 Ce que chacun pense de la lecture de sa feuille", InfoI("Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin. Un clic sur un nom agit sur l'élève, par exemple « ⛔ Retirer le point d'autonomie ».")),
        h("div", {className:"ss"}, "Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin."),
        GrilleTablettes(PAIRES, function(p){ var r = etat(p); if(retire.indexOf(p) >= 0) r.flag = "🔴 point d'autonomie retiré"; r.va = "c-autonomie"; r.titre = "Clique sur le nom : « ⛔ Retirer le point d'autonomie », ou « 🚫 Marquer comme parti »."; return r; }),
        Legende([["#22C55E","✅ bien lu"],["#FDE68A","🤔 peut-être mal lu : à relire ce soir"],["#EF4444","❌ mal lu : alerte"],["#FEE2E2","⏳ pas encore répondu","1px solid #EF4444"]])))), true);
}
function ScCoevalFeuille(){   // « La feuille dit autre chose : je clique ce qu'elle dit » (545), comme le soir (capture 43)
  var q = EV.questions[0];
  return h(F, null, PilotCoevalE(false), h("div", {className:"checkin-overlay", "data-echap":"c-coeval-attente"},
    h("div", {className:"checkin-modal", style:{maxWidth:"460px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "Que dit la feuille ?"), h("div", {className:"checkin-sub"}, "DUVERNAY Michel — Q1 · " + q.enonce)),
      h("div", {style:{padding:".6rem 1.2rem 0", fontSize:".85rem", color:"var(--gris)"}}, "Julien y a lu Venise ; Michel dit avoir écrit Rome. Clique sur ce que dit sa feuille."),
      h("div", {className:"qdf-choix"},
        q.choix.map(function(c, i){ return h("div", {key:i, className:"qdf-c" + (i === 3 ? " sel" : ""), title:"Clique si la feuille de Michel dit « " + c + " »."}, h("span", null, c), h("span", {className:"tg"}, i === 2 ? "bonne réponse · Michel" : i === 3 ? "lu par Julien" : "")); }),
        h("div", {className:"qdf-c aucun", title:"Clique si la feuille de Michel ne dit aucun de ces choix."}, h("span", null, "Aucun des choix"), h("span", {className:"tg"}, ""))),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost", "data-va":"c-coeval-attente", title:"Ferme sans rien changer : l'alerte reste ouverte."}, "Annuler"), h("button", {className:"btn btn-primary", "data-va":"c-coeval-tranche", title:"Applique ce que dit la feuille : la question 1 de Michel se recalcule, et l'alerte se ferme."}, "Valider")))));
}

/* ════════ La fin : le bilan de l'élève (442, 456, 474, 484, 639) ════════ */
function EcrBilan(e, opts){
  opts = opts || {};
  var st = stDe(e, true), pts = st.map(function(s){ return s === "j" || s === "t" ? 1 : 0; });
  var an = opts.annulee == null ? -1 : opts.annulee, tot = an >= 0 ? 2 : 3;   // une question annulée sort du total (442)
  if(an >= 0) pts[an] = 0;
  var n = pts.reduce(function(a, b){ return a + b; }, 0), sur20 = n * 20 / tot, m = maitriseDe(sur20);
  var est = ESTIM[e.prenom], idxE = ["rouge","orange","bleu","vert"].indexOf(est), idxR = ["rouge","orange","bleu","vert"].indexOf(m.k);
  var nE = FOURCH.filter(function(f){ return f.k === est; })[0].n, emE = MAITRISE.filter(function(x){ return x.k === est; })[0].em;
  var calib = idxE === idxR
    ? {type:"ok", msg:"✅ Tu te connais bien !", detail:"Tu pensais avoir " + libFourchette(nE).replace(" sur 3", "") + " " + emE + " et tu en as effectivement obtenu " + n + " sur " + tot + ". Ton estimation correspond à ton vrai résultat."}
    : (idxE > idxR ? {type:"sur", msg:"⚠️ Tu pensais avoir mieux fait", detail:"Tu pensais avoir " + libFourchette(nE).replace(" sur 3", "") + " " + emE + " mais tu en as eu " + n + " sur 3 (" + libFourchette(n).replace(" sur 3", "") + " " + m.em + "). Tu as un peu surestimé ce que tu avais réussi."}
                  : {type:"sous", msg:"🌟 Tu te sous-estimais !", detail:""});
  var corrige = e.cle === "M" ? 0 : -1;   // la question 1 de Michel, tranchée en sa faveur (538)
  var compQ = function(c){ return compQuestions(c).filter(function(i){ return i !== an; }).map(function(i, k){ return h(F, {key:i}, k ? " · " : "", "Q" + (i+1) + " ", st[i] === "t" ? h("span", {className:"v-orange"}, "✓") : st[i] === "j" ? "✓" : "✗"); }); };
  var autoOk = !opts.autonomieRetiree;
  return Page(badgeDe(e), "🎯 Bilan personnel", h("div", {className:"bilan-c"},
    !opts.imprime && h("button", {className:"bilan-export-btn", "data-va":"t-bilan-imprime"}, "📄 Imprimer / Exporter mon bilan"),
    h("div", {className:"bilan-score fourchette-" + m.k},
      h("div", {className:"bilan-score-emoji"}, m.em),
      h("div", {className:"bilan-score-num"}, "Ta note provisoire : " + n + " / " + tot),
      h("div", {className:"note20"}, fr1(sur20) + " / 20"),
      h("div", {className:"bilan-score-pct"}, m.lib)),
    h("p", {className:"bilan-provisoire"}, "Elle peut encore changer, jusqu'à ce que ta copie te soit rendue : ta feuille, tes clics pendant les questions et tes clics à la correction sont comparés. Quelle que soit ta correction, c'est ce que tu as écrit lors de l'évaluation qui correspondra à ta note définitive."),
    h("div", {className:"bilan-bloc"}, h("h3", null, "Question par question"),
      h("div", {className:"recap"}, EV.questions.map(function(q, i){
        var s = st[i];
        if(i === an) return h("div", {key:i, className:"recap-l annulee"}, h("span", null, "Question " + (i+1) + " · annulée : elle ne compte pas."));
        return h("div", {key:i, className:"recap-l " + (s === "j" || s === "t" ? "j" : "f")},
          h("span", null, "Question " + (i+1) + " · ",
            s === "t" ? h(F, null, h("span", {className:"v-orange"}, "✓"), " Trouvée au dernier moment") : s === "a" ? "ta feuille ne dit aucun de ces choix" : s === "j" ? "juste" : "faux",
            i === corrige && h("span", {className:"corrige"}, "Corrigé d'après ta feuille."),
            h("span", {className:"recap-comp"}, q.competences.map(function(c){ return LIB_ELEVE[c]; }).join(" · "))),
          h("span", {className:"pt"}, "→ " + pts[i] + " point"));
      }))),
    h("div", {className:"bilan-bloc"}, h("h3", null, "Tes compétences"),
      COMPS.map(function(c){
        var x = pts.filter(function(p, i){ return EV.questions[i].competences.indexOf(c) >= 0; }).reduce(function(a, b){ return a + b; }, 0), mx = compQuestions(c).filter(function(i){ return i !== an; }).length, mm = maitriseDe(x * 20 / mx);
        return h("div", {key:c, className:"comp-l"},
          h("span", null, LIB_ELEVE[c], h("span", {className:"comp-q"}, compQ(c), " → " + x + "/" + mx)),
          h("span", {className:"mt"}, mm.em + " ", mm.lib));
      }),
      AUTO.map(function(l){ return h("div", {key:l, className:"comp-l"}, h("span", null, l), h("span", {className:"mt"}, autoOk ? "✅ " : "❌ ", autoOk ? "atteinte" : "non atteinte")); })),
    h("div", {className:"bilan-calibration bilan-calib-" + calib.type},
      h("h3", null, "🎯 Ton estimation"),
      h("div", {className:"bilan-calib-msg"}, calib.msg),
      an < 0 && h("div", {className:"bilan-calib-detail"}, calib.detail))));
}
function BilanImprime(){ return h("div", {className:"bilan-imprime"}, h("div", {className:"bilan-imprime-page"}, EcrBilan(J, {imprime:true}))); }

/* ── Le bilan de la classe, côté console (383, 442) : les infobulles écrites pour toi ── */
function BilanClasse(){
  var lignes = Object.keys(RF).map(function(p){ var r = calc(p); return {p:p, nom:nomDe(p), r:r}; });
  var notes = lignes.filter(function(l){ return l.r.complet; }).map(function(l){ return l.r.n; }).sort(function(a, b){ return a - b; });
  var moy = notes.reduce(function(a, b){ return a + b; }, 0) / notes.length, med = notes[Math.floor(notes.length / 2)];
  var dist = {vert:0, bleu:0, orange:0, rouge:0};
  lignes.forEach(function(l){ if(l.r.complet) dist[maitriseDe(l.r.sur20).k]++; });
  lignes.sort(function(a, b){ return (b.r.complet ? b.r.n : -1) - (a.r.complet ? a.r.n : -1) || a.nom.localeCompare(b.nom, "fr"); });
  var lire = LIRE_SOIR.concat([["PERRAUD Jade", 1, "🤔 pense qu'Enzo a peut-être mal lu sa feuille"], ["MAILLARD Noah", 2, "🤔 pense qu'Emma a peut-être mal lu sa feuille"]]);
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "🏁 Bilan classe — " + EV.titre + " — " + CLASSE, InfoI("Les notes provisoires de la classe, d'après la lecture des feuilles à la correction. Elles deviennent définitives quand tu rends les copies, après ta lecture du soir.")), [h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"bilan-classe-synthese"},
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Moyenne"), h("div", {className:"bilan-classe-stat-num"}, fr1(moy) + " / 3"), h("div", {style:{opacity:.9}}, fr1(moy * 20 / 3) + " / 20")),
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Médiane"), h("div", {className:"bilan-classe-stat-num"}, med + " / 3")),
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Plage"), h("div", {className:"bilan-classe-stat-num"}, notes[0] + "—" + notes[notes.length - 1]))),
    h("div", {style:{display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:"1rem"}},
      h("div", null,
        h("h3", {style:{marginTop:".4rem"}}, "📊 Distribution", InfoI("Combien d'élèves dans chaque niveau de maîtrise de la note (Réglages : les tranches).")),
        h("div", {className:"bilan-classe-distrib"}, MAITRISE.map(function(m){ return h("div", {key:m.k, className:"bilan-classe-distrib-cell fourchette-" + m.k}, h("strong", null, dist[m.k]), h("span", null, m.em + " " + m.lib)); })),
        h("h3", null, "🧩 Par compétence", InfoI("Pour chaque compétence de l'évaluation : combien d'élèves dans chaque niveau, sur ses questions.")),
        COMPS.map(function(c){
          var d = {vert:0, bleu:0, orange:0, rouge:0};
          lignes.forEach(function(l){ d[niveauComp(l.r, c).k]++; });
          return h("div", {key:c, className:"par-comp"},
            h("div", {className:"pc-t"}, c + " · " + COMP_COURT[c] + " · " + compQuestions(c).map(function(i){ return "Q" + (i+1); }).join(", ")),
            h("div", {className:"bilan-classe-distrib pc-d"}, MAITRISE.map(function(m){ return h("div", {key:m.k, className:"bilan-classe-distrib-cell fourchette-" + m.k}, h("strong", null, d[m.k]), h("span", null, m.em + " " + m.lib)); })));
        }),
        h("div", {className:"par-comp"}, h("div", {className:"pc-t"}, "🤝 Le point d'autonomie · Être autonome et responsable · S'impliquer dans les activités en classe et dans son travail personnel"),
          h("div", {className:"pc-auto"}, "24 / 24 l'ont gardé : Très bonne maîtrise · 0 retiré")),
        h("h3", null, "🎯 Calibration de l'autoévaluation", InfoI("L'estimation de chacun comparée à sa note : bien évalué, sous-évalué, sur-évalué.")),
        h("div", {className:"bilan-classe-calib"},
          h("div", {className:"bilan-classe-calib-cell calib-ok"}, h("strong", null, 11), h("span", null, "✅ Bien évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-sous"}, h("strong", null, 4), h("span", null, "🌟 Sous-évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-sur"}, h("strong", null, 7), h("span", null, "⚠️ Sur-évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-none"}, h("strong", null, 2), h("span", null, "— Pas d'autoeval"))),
        h("h3", null, "💡 Questions remarquables", InfoI("La question la plus ratée et la mieux réussie, d'après la feuille : à reprendre en classe.")),
        h("div", {className:"bilan-classe-insights"},
          h("div", {className:"bilan-classe-insight insight-attention"}, h("div", {className:"bilan-classe-insight-titre"}, "🔴 La plus ratée — Q2 (" + tauxQ(1) + "% de réussite)"), h("div", {className:"bilan-classe-insight-enonce"}, EV.questions[1].enonce)),
          h("div", {className:"bilan-classe-insight insight-felicitations"}, h("div", {className:"bilan-classe-insight-titre"}, "🟢 La mieux réussie — Q1 (" + tauxQ(0) + "% de réussite)"), h("div", {className:"bilan-classe-insight-enonce"}, EV.questions[0].enonce)))),
      h("div", null,
        h("div", {className:"alire", style:{marginTop:".4rem"}}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, x[0] + " — Q" + (x[1]+1) + " : " + x[2]); })))),
    h("h3", null, "👥 Détail par élève (trié par note)", InfoI("Chaque élève, sa note provisoire et ses niveaux par compétence. « ⛔ » : Trouvée au dernier moment.")),
    h("div", {className:"bilan-classe-table-wrap"}, h("table", {className:"bilan-classe-table"},
      h("thead", null, h("tr", null, ["Élève", "Note", "Sur 20", "Maîtrise de la note"].map(function(t){ return h("th", {key:t}, t); }), COMPS.map(EnteteComp))),
      h("tbody", null, lignes.map(function(l){ var m = maitriseDe(l.r.sur20);
        return h("tr", {key:l.p}, h("td", null, l.nom), h("td", null, l.r.n + " / 3"), h("td", null, fr1(l.r.sur20)),
          h("td", null, h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib)),
          COMPS.map(function(c){ return h("td", {key:c}, PillComp(l.r, c)); })); }))))), true);
}

/* ════════ « ⏸️ Finir à une autre heure » et la reprise (469) ════════ */
function ScFinirAutreHeure(){
  return Fenetre(Pilot(ST_Q1T1()), "⏸️ Finir à une autre heure ?", CLASSE + " — " + EV.titre + " · question 1, 1er tour",
    h(F, null,
      h("p", null, "La séance garde son état exact : la question, le tour, les lectures, les notes provisoires. Les tablettes oublient leurs élèves à la fin de l'heure, comme d'habitude."),
      h("p", null, "À l'heure suivante, « 🎯 Pilotage classe » propose « ▶️ Reprendre la séance du 09/10 — question 1, 1er tour » : l'appel, les mêmes binômes (un absent se remplace comme au début), les élèves entrent, et le tour en cours recommence au début, voile compris."),
      h("p", {className:"fen-note"}, "Tant qu'elle n'est pas terminée, cette séance ne compte pas comme « QCM précédent » pour les binômes.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1", title:"Ne change rien : la séance continue."}, "Annuler"), h("button", {key:2, className:"btn btn-or", "data-va":"c-reprendre", title:"Met la séance en pause, telle qu'elle est, jusqu'à une heure suivante."}, "⏸️ Finir à une autre heure")], "c-q1-tour1");
}
function CarteReprise(papier){
  return h("div", {className:"card reprise-carte"},
    h("h2", null, "⏸️ Séance à reprendre — " + CLASSE, InfoI("Une séance finie à une autre heure garde son état exact. La reprendre ouvre l'appel, avec les mêmes binômes.")),
    h("div", {className:"results-eval-row"},
      h("div", null, h("div", {className:"titre"}, papier ? "📄 " + EV.titre + " — sur papier" : EV.titre),
        h("div", {className:"meta"}, papier ? "09/10/2026 10:02 · feuilles ramassées · ta grille est remplie : 24 feuilles saisies" : "09/10/2026 10:02 · en pause à la question 1, 1er tour · 24 présents"),
        h("div", {className:"meta", style:{color:"var(--violet)", fontWeight:700}}, "↳ pas encore « QCM précédent » : elle ne sert pas aux binômes tant qu'elle n'est pas terminée")),
      h("button", {className:"btn btn-primary", "data-va":papier ? "t-papier-estim" : "c-appel", title:papier ? "Reprend la séance pour la correction : l'appel, les binômes reprennent les tablettes, l'estimation, la seconde attestation, puis toutes les questions à la suite." : "Reprend la séance là où elle s'était arrêtée : l'appel, les mêmes binômes, puis le tour en cours recommence au début, voile compris."},
        papier ? "▶️ Reprendre la séance du 09/10 — correction" : "▶️ Reprendre la séance du 09/10 — question 1, 1er tour")));
}
function ScReprendre(papier){ return Lancement(false, {reprise:papier ? "papier" : "tablettes"}); }
function ScRouvrirSeance(){
  return Fenetre(Lancement(false), "🔓 Rouvrir la séance du 24/09 ?", "3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)",
    h(F, null, h("p", null, "Elle reprend exactement là où elle s'était terminée. Ses copies étaient rendues : elles sont masquées aux élèves jusqu'au prochain « Rendre les copies »."),
      h("p", {className:"fen-note"}, "Tant qu'elle est rouverte, elle ne compte plus comme « QCM précédent » pour les binômes.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-lancer", title:"Ne rouvre rien."}, "Annuler"), h("button", {key:2, className:"btn btn-primary", "data-va":"c-appel", title:"Rouvre la séance : l'appel, les mêmes binômes, puis elle reprend là où elle s'était terminée."}, "🔓 Rouvrir la séance")], "c-lancer");
}
function Interrompue(){
  var modal = h("div", {className:"checkin-overlay", "data-echap":"c-lancer"},
    h("div", {className:"checkin-modal", style:{maxWidth:"620px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "⚠️ Session interrompue détectée", InfoI("La console a perdu la séance en cours (page fermée, panne). Elle se reprend là où elle était, ou se termine.")), h("div", {className:"checkin-sub"}, CLASSE + " — " + EV.titre)),
      h("div", {style:{padding:"1rem 1.2rem", fontSize:".9rem", color:"var(--noir)"}},
        h("div", {style:{marginBottom:".4rem"}}, "📅 Démarrée le 08/10/2026 à 10:02"),
        h("div", {style:{marginBottom:".4rem"}}, "🔌 Dernière déconnexion : 08/10/2026 à 10:09"),
        h("div", {style:{marginBottom:".8rem"}}, "📝 État : question 2, 2e tour (moitiés de gauche) ; 35 réponses enregistrées"),
        h("div", {style:{padding:".7rem", background:"#FEF3C7", borderRadius:"8px", fontSize:".85rem", color:"#78350F", marginTop:".5rem"}},
          h("strong", null, "🔄 Reprendre"), " : le tour en cours recommence au début, voile compris : les moitiés de gauche repassent la question 2, avec tout leur temps. Une réponse déjà donnée reste."),
        h("div", {style:{padding:".7rem", background:"#FEE2E2", borderRadius:"8px", fontSize:".85rem", color:"#7F1D1D", marginTop:".5rem"}},
          h("strong", null, "🛑 Terminer définitivement"), " : la séance est close, et l'archive s'écrit avec les notes telles qu'elles sont. Les questions pas encore corrigées n'ont pas de lecture : tu fixes ces notes d'après les feuilles, dans Données → Résultats."),
        h("div", {style:{padding:".7rem", background:"#EDE9FE", borderRadius:"8px", fontSize:".85rem", color:"#4C1D95", marginTop:".5rem"}},
          h("strong", null, "⏸️ Finir à une autre heure"), " : la séance garde son état exact et se reprend à une heure suivante, depuis « 🎯 Pilotage classe ».")),
      h("div", {className:"checkin-actions"},
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-terminer", title:"Clôt la séance, après une confirmation : l'archive s'écrit avec les notes telles qu'elles sont."}, "🛑 Terminer définitivement"),
        h("button", {className:"btn btn-ghost", "data-va":"c-reprendre", title:"Met la séance en pause, telle qu'elle est, pour la reprendre à une heure suivante."}, "⏸️ Finir à une autre heure"),
        h("button", {className:"btn btn-primary", "data-va":"c-q2-tour2", title:"Reprend tout de suite : le tour en cours recommence au début, voile compris."}, "🔄 Reprendre la session"))));
  return h(F, null, Lancement(false), modal);
}

/* ════════ Le flux papier seul (467, 491, 492) ════════ */
function PapierLancer(){ return Lancement(false, {papier:true}); }
function PapierSeance(){
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📄 Séance sur papier — " + EV.titre + " — " + CLASSE, InfoI("Sur papier, chacun répond seul sur sa feuille, avec les énoncés imprimés : pas de tablette, pas d'estimation. Tu ramasses les feuilles ; la séance se met en pause sans être finie. Le soir, tu remplis la grille ; à l'heure suivante, la correction se fait sur les tablettes.")),
      [h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status reflexion"}, "📄 Séance sur papier en cours — 24 présents, 1 absent (YVON Adam)"),
    h("div", {className:"papier-grid"},
      h("div", null,
        h("p", null, "Les élèves ont les énoncés seuls, sans les choix, et répondent sur leur feuille, seuls."),
        h("div", {className:"row"},
          h("button", {className:"btn btn-ghost", "data-va":"e-papier-enonces", title:"Montre la page des énoncés seuls, avec les points de chaque question, à imprimer pour la classe."}, "🖨️ Les énoncés à imprimer"),
          h("button", {className:"btn btn-or", "data-va":"c-papier-grille", title:"Tu as ramassé les feuilles : la séance se met en pause sans être finie. Le soir, tu remplis la grille d'après les feuilles."}, "⏸️ Feuilles ramassées : finir à une autre heure"))),
      h("div", {className:"pilot-overview"}, h("h3", null, "📋 Toutes les questions", InfoI("Les questions de l'évaluation, avec leurs bonnes réponses : sur papier, elles ne se posent pas une à une.")),
        EV.questions.map(function(q, qi){ return h("div", {key:qi, className:"pilot-q-mini"}, h("div", {className:"pilot-q-mini-head"}, h("span", {className:"pilot-q-mini-num"}, "Q" + (qi+1)), h("span", {className:"pilot-q-mini-niv niv-" + q.niveau}, NIV[q.niveau].label)), h("div", {className:"pilot-q-mini-enonce"}, q.enonce), h("div", {className:"pilot-q-mini-bonnes"}, ChoixTexte(q))); })))), true);
}
function PapierEnonces(){
  return h("div", {className:"bilan-imprime"}, h("div", {className:"bilan-imprime-page enonces-p"},
    h("h2", null, EV.titre), h("div", {className:"enonces-classe"}, CLASSE + " · 09/10/2026"),
    EV.questions.map(function(q, i){ return h("div", {key:i, className:"enonce-p"}, h("strong", null, "Question " + (i+1) + " · 1 pt"), h("div", null, q.enonce)); })));
}
function GrillePapier(){   // un élève par ligne, une question par case, un clic pour ✓ ou ✗ (467)
  var eleves = [].concat.apply([], PAIRES).filter(Boolean).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  var init = {}; eleves.forEach(function(n){ var p = pre(n); init[p] = RF[p].split("").map(function(c){ return c === "J" ? "j" : "f"; }); });
  var s = useState(init), g = s[0], setG = s[1];
  function basculer(p, i){ var o = Object.assign({}, g); o[p] = g[p].slice(); o[p][i] = g[p][i] === "j" ? "f" : "j"; setG(o); }
  return h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet papier-grille"},
    h("thead", null, h("tr", null, h("th", {className:"eleve-col"}, "Élève"), EV.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i+1)); }), h("th", null, "Note"), h("th", null, "Sur 20"))),
    h("tbody", null, eleves.map(function(n){
      var p = pre(n), l = g[p], note = l.filter(function(x){ return x === "j"; }).length;
      return h("tr", {key:n}, h("td", {className:"eleve-cell"}, n),
        l.map(function(x, i){ return h("td", {key:i, className:x === "j" ? "cell-juste" : "cell-faux"}, h("button", {className:"case-grille", "data-local":"1", title:"La feuille de " + p + ", question " + (i+1) + " : un clic bascule entre ✓ (juste) et ✗ (faux).", onClick:function(){ basculer(p, i); }}, x === "j" ? "✓" : "✗")); }),
        h("td", {className:"score-cell"}, note + "/3"), h("td", {className:"score-cell"}, fr1(note * 20 / 3)));
    }))));
}
function PapierGrille(){
  return Console("donnees", "results", h("div", {className:"card"},
    TitreCarte("📄 " + EV.titre + " — " + CLASSE + " — sur papier", [
      h("button", {key:0, className:"btn btn-primary btn-sm", "data-va":"c-papier-reprendre", title:"Ta grille est remplie : la séance se reprend à l'heure suivante, pour la correction sur les tablettes."}, "💾 Grille remplie"),
      h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":"c-seances", title:"Revient à la liste des séances ; la grille est gardée telle quelle."}, "← Retour")]),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, "09/10/2026 10:02 · sur papier · 24 présents, 1 absent (YVON Adam) · ta grille, d'après les feuilles : c'est elle qui fait la note. Un clic sur une case bascule ✓ / ✗."),
    h(GrillePapier)), false);
}
function PilotCorrPapier(){
  var q = EV.questions[1];
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📝 Correction sur papier — " + EV.titre + " — " + CLASSE, InfoI("Sur papier, il n'y a pas de lecture du voisin : chaque moitié montre ce que ta grille a retenu de la feuille, puis la réponse quand tu révèles. Jamais « Trouvée au dernier moment ». Le point d'autonomie ne se retire qu'en direct, d'un clic sur le nom.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status correction"}, "Question 1 / 3 — Q2 · toutes les corrections à la suite, dans l'ordre des erreurs de ta grille"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"pilot-q-current"}, h("div", {className:"num"}, "Question 2"), h("div", {className:"enonce"}, q.enonce),
          h("div", {className:"pilot-q-bonne"}, h("span", {style:{fontWeight:900}}, "✓ Bonnes réponses : "), q.bonnes.map(function(i){ return q.choix[i]; }).join("  /  "))),
        h("div", {className:"row", style:{marginTop:".8rem"}},
          h("button", {className:"btn btn-ghost", disabled:true, title:"C'est la première question corrigée : il n'y a pas de question précédente."}, "← Question précédente"),
          h("button", {className:"btn btn-or", "data-va":"t-papier-correction", title:"Sur papier, « Révéler » s'ouvre tout de suite : il n'y a pas de lecture du voisin."}, "💡 Révéler"),
          h("button", {className:"btn btn-primary", disabled:true, title:"S'ouvre quand cette question est révélée."}, "Question suivante →"))),
      h("div", {className:"suivi-box"}, h("h3", null, "📄 D'après ta grille", InfoI("Chaque moitié : la question d'après ta grille du soir. Un clic sur un nom agit sur l'élève.")),
        GrilleTablettes(PAIRES, function(p){ var s = RF[p][1]; return {cls:s === "J" ? "m-juste" : "m-faux", st:s === "J" ? "✓ 1 pt" : "✗ 0", va:"c-autonomie", titre:"Clique sur le nom : « ⛔ Retirer le point d'autonomie »."}; }),
        Legende([["#22C55E","✓ juste d'après ta grille"],["#EF4444","✗ faux d'après ta grille"]])))), true);
}

/* ════════ Le rattrapage (335, 595) : les binômes par les exclusions, puis par la règle du QCM ════════ */
function Rattrapage(){
  var carte = h("div", {className:"card"},
    h("h2", null, "🎯 Lancer une nouvelle session", InfoI("Un rattrapage se lance comme une séance : la classe, la même évaluation ; seuls ceux qui ne sont pas encore notés la passent.")),
    h("div", {className:"lancer-grid"},
      h("div", null,
        h("div", {className:"field"}, h("label", null, "Classe", InfoI("Les classes de la console MJPC.")), h("select", {value:"c", readOnly:true, title:"La classe de la séance."}, h("option", {value:"c"}, CLASSE + " (25 élèves)"))),
        h("div", {className:"field"}, h("label", null, "Évaluation", InfoI("L'évaluation déjà passée par la classe : « 🔁 » la marque comme rattrapage.")), h("select", {value:"e", readOnly:true, title:"L'évaluation de la séance."}, h("option", {value:"e"}, "🔁 " + EV.titre + " (3 questions)"))),
        h("div", {className:"rattrapage-box"}, h("strong", null, "🔁 Rattrapage."), " " + CLASSE + " a déjà passé cette évaluation le 08/10. Cette séance ne servira jamais de « QCM précédent » pour les binômes. Un élève déjà noté garde la note de sa première séance."),
        h("div", {className:"duree-box"}, DUREE_TXT),
        h("button", {className:"btn btn-primary", "data-va":"c-appel", title:"Ouvre l'appel du rattrapage : seuls les élèves pas encore notés sont proposés."}, "🚀 Lancer le rattrapage")),
      h("div", {className:"binomes-box"},
        h("div", {className:"tt"}, "📱 Binômes proposés — d'après les exclusions, puis le QCM précédent", InfoI("Comme pour une séance : d'abord les exclusions de MJPC, puis la règle du QCM. Plus de placement libre.")),
        h("div", {className:"ss"}, "Pas encore noté à cette évaluation : YVON Adam (absent le 08/10). Seul, il fait lui-même la lecture de sa feuille à la correction ; il n'a pas de co-évaluation."),
        h(GrilleBinomes, {paires:[["YVON Adam", null]]}))));
  return Console("pilotage", "pilot", h(F, null, carte, SessionsPrecedentesRatt()), false);
}
function SessionsPrecedentesRatt(){
  return h("div", {className:"card"},
    h("h2", null, "📚 Sessions précédentes — " + CLASSE, InfoI("Les séances passées de la classe : chacune ouvre ses résultats.")),
    h("div", {className:"results-eval-list"},
      h("div", {className:"results-eval-row"},
        h("div", null, h("div", {className:"titre"}, EV.titre), h("div", {className:"meta"}, "08/10/2026 10:02 · ✅ terminée · 24 présents, 1 absent · " + LIRE_SOIR.length + " feuilles à lire"),
          h("div", {className:"meta", style:{color:"var(--violet)", fontWeight:700}}, "↳ c'est le QCM précédent : il sert aux binômes")),
        h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats", title:"Ouvre les résultats de cette séance passée."}, "📊 Résultats")),
      h("div", {className:"results-eval-row"},
        h("div", null, h("div", {className:"titre"}, "3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)"), h("div", {className:"meta"}, "24/09/2026 10:04 · ✅ terminée · 23 présents · 2 feuilles à lire")),
        h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats", title:"Ouvre les résultats de cette séance passée."}, "📊 Résultats"))));
}

/* ════════ Les scènes de l'étape 3 ════════ */
SCENES = SCENES.concat([
  {id:"t-attest-corr-fait", vue:"tablette", render:function(){ return Tablette(EcrAttenteCorr(J), Attest2(M, 4)); }},
  {id:"c-attest2", vue:"console", render:PilotAttest2},
  {id:"t-corr-q2-lecture", vue:"tablette", render:function(){ return Tablette(EcrLecture(J, 1, true, 7), EcrLecture(M, 1, false, 7)); }},
  {id:"c-corr-q2-lu", vue:"console", render:function(){ return PilotCorrection(1, false, {toutLu:true, revelerVers:"t-corr-q2-apres"}); }},
  {id:"t-corr-q3-lecture", vue:"tablette", render:function(){ return Tablette(EcrLecture(J, 2, true, 11), EcrLecture(M, 2, true, 11)); }},
  {id:"t-corr-q1-lecture", vue:"tablette", render:function(){ return Tablette(EcrLecture(J, 0, true, 6), EcrLecture(M, 0, true, 6)); }},
  {id:"c-autonomie", vue:"console", vh:900, render:function(){ return ScAutonomie(false); }},
  {id:"c-autonomie-garde", vue:"console", vh:900, render:function(){ return ScAutonomieGarde(null, null); }},
  {id:"c-autonomie-retiree", vue:"console", vh:900, render:function(){ return ScAutonomie(true); }},
  {id:"p-autonomie", vue:"telephone", render:TelAutonomie},
  {id:"t-coeval", vue:"tablette", render:function(){ return Tablette(CoevalE(J), CoevalE(M, {k:"mal"})); }},
  {id:"t-coeval-ecrit", vue:"tablette", render:function(){ return Tablette(CoevalE(J, {k:"ok"}), CoevalE(M, {k:"mal", q:0, ecrit:[2]})); }},
  {id:"t-coeval-daccord", vue:"tablette", render:function(){ return Tablette(CoevalE(J, {k:"ok"}), CoevalE(M, {daccord:true})); }},
  {id:"c-coeval-attente", vue:"console", vh:1250, render:function(){ return PilotCoevalE(false); }},
  {id:"c-coeval-feuille", vue:"console", vh:1250, render:ScCoevalFeuille},
  {id:"c-autonomie-michel", vue:"console", vh:1250, render:function(){ return ScAutonomieGarde(["DUVERNAY Michel"], "c-coeval-attente"); }},
  {id:"c-autonomie-julien", vue:"console", vh:1250, render:function(){ return ScAutonomieGarde(["ABRIAL Julien"], "c-coeval-attente"); }},
  {id:"c-autonomie-deux", vue:"console", vh:1250, render:function(){ return ScAutonomieGarde(["DUVERNAY Michel", "ABRIAL Julien"], "c-coeval-attente"); }},
  {id:"c-coeval-retire-michel", vue:"console", vh:1250, render:function(){ return PilotCoevalE(false, ["Michel"]); }},
  {id:"c-coeval-retire-julien", vue:"console", vh:1250, render:function(){ return PilotCoevalE(false, ["Julien"]); }},
  {id:"c-coeval-retire-deux", vue:"console", vh:1250, render:function(){ return PilotCoevalE(false, ["Michel", "Julien"]); }},
  {id:"c-coeval-tranche", vue:"console", render:function(){ return PilotCoevalE(true); }},
  {id:"t-bilan-imprime", vue:"eleve", render:BilanImprime},
  {id:"t-bilan-annulee", vue:"tablette", render:function(){ return Tablette(EcrBilan(J, {annulee:1}), EcrBilan(M, {annulee:1})); }},
  {id:"t-bilan-non-atteinte", vue:"tablette", render:function(){ return Tablette(EcrBilan(J, {autonomieRetiree:true}), EcrBilan(M, {autonomieRetiree:true})); }},
  {id:"t-corr-seul", vue:"tablette", render:EcrLectureSeul},
  {id:"c-finir-autre-heure", vue:"console", vh:900, render:ScFinirAutreHeure},
  {id:"c-reprendre", vue:"console", render:function(){ return ScReprendre(false); }},
  {id:"c-rouvrir-seance", vue:"console", vh:900, render:ScRouvrirSeance},
  {id:"c-papier-lancer", vue:"console", render:PapierLancer},
  {id:"c-papier-seance", vue:"console", render:PapierSeance},
  {id:"e-papier-enonces", vue:"eleve", render:PapierEnonces},
  {id:"c-papier-grille", vue:"console", vh:1100, render:PapierGrille},
  {id:"c-papier-reprendre", vue:"console", render:function(){ return ScReprendre(true); }},
  {id:"t-papier-estim", vue:"tablette", render:function(){ return Tablette(EcrEstim(J, null), EcrEstim(M, "orange")); }},
  {id:"t-papier-attest", vue:"tablette", render:function(){ return Tablette(Attest2Papier(J, 5), Attest2Papier(M, 2)); }},
  {id:"c-papier-correction", vue:"console", render:PilotCorrPapier},
  {id:"t-papier-correction", vue:"tablette", render:function(){ return Tablette(EcrRevele(J, 1, {papier:true}), EcrRevele(M, 1, {papier:true})); }}
]);
/* Les scènes existantes refaites à l'étape 3 */
refaire("x610-5-attestation-2", function(){ return Tablette(Attest2(J, 1), Attest2(M, 0)); });
refaire("c-corr-q2-avant", function(){ return PilotCorrection(1, false); });
refaire("c-corr-q2-apres", function(){ return PilotCorrection(1, true); });
refaire("c-corr-q3-apres", function(){ return PilotCorrection(2, true); });
refaire("c-corr-q1-apres", function(){ return PilotCorrection(0, true); });
refaire("t-corr-q2-apres", function(){ return Tablette(EcrRevele(J, 1), EcrRevele(M, 1)); });
refaire("t-corr-q3-apres", function(){ return Tablette(EcrRevele(J, 2), EcrRevele(M, 2)); });
refaire("t-corr-q1-apres", function(){ return Tablette(EcrRevele(J, 0), EcrRevele(M, 0)); });
refaire("t-bilan", function(){ return Tablette(EcrBilan(J), EcrBilan(M)); });
refaire("x610-3-a-correction", function(){ return Tablette(EcrCorrA3(J, true), EcrCorrA3(M, true)); });
SCENES.filter(function(s){ return s.id === "x610-3-a-correction"; })[0].vh = null;

/* B sur la question 3 de l'évaluation de 3e (610-1, 610-2) : le clic figé, tous les choix grisés, avec la raison */
function EcrDeclare3(e, chrono){
  var q = EV3.questions[QI3], sel = S3[e.cle].tab;
  return Page(badgeDe(e), EV3.titre, h("div", {className:"eleve-q-zone"},
    QHead3(QI3), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"fige"}, "⏱️ Temps fini : ton clic est enregistré."),
    h("div", {className:"eleve-choix long fige-choix"}, ORD3[e.cle].map(function(i){
      var moi = sel.indexOf(i) >= 0;
      return h("button", {key:i, className:"eleve-choix-btn" + (moi ? " selected" : ""), disabled:true, title:moi ? "Ton clic, figé : le temps de réponse est fini." : "Le temps de réponse est fini : ton clic ne change plus."}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"decl-b-titre"}, e.prenom + ", regarde ta feuille : dit-elle la même chose que ton clic ?"),
    h("div", {className:"decl-b-btns"}, h("button", {className:"decl-b-btn"}, "Oui, la même chose"), h("button", {className:"decl-b-btn"}, "Non, autre chose")),
    h("div", {className:"decl-b-chrono"}, "⏱️ " + chrono + " s")));
}
/* Le chrono du téléphone : « 🔄 Chrono » le relance (418) */
function TelChrono(p){
  var s = useState(p.reste), v = s[0], setV = s[1];
  useEffect(function(){ function f(){ setV(p.total); } document.addEventListener("maquette-relancer", f); return function(){ document.removeEventListener("maquette-relancer", f); }; });
  return h("div", {className:"tel-chrono"}, v + "s");
}

/* ── Les gestes de l'étape 3 : où mène chaque bouton, et son infobulle pour Paul ── */
BULLES["⏸️ Finir à une autre heure"] = "Met la séance en pause, avec son état exact, pour la reprendre à une heure suivante : « ▶️ Reprendre » dans « 🎯 Pilotage classe ». Demande une confirmation.";
ALLER["*"]["⏸️ Finir à une autre heure"] = "c-finir-autre-heure";
BULLES["Question suivante →"] = "Passe à la question suivante de la correction : chacun lit d'abord la feuille de son voisin.";
// Le cas ambigu, sur l'évaluation de 3e (541 à 545)
var GESTES_610 = {
  "Donner raison à Michel : B, C, E → 1 point": ["x610-tranche", "Applique ce que Michel dit avoir écrit, B, C, E : sa question 3 passe à 1 point, et sa note se recalcule. L'alerte se ferme ; « ↩️ Défaire » la rouvre."],
  "Donner raison à Julien : E → 0 point": ["x610-tranche", "Garde la lecture de Julien, E : rien ne change. L'alerte se ferme."],
  "La feuille dit autre chose : je clique ce qu'elle dit": ["x610-feuille", "Ouvre les choix de la question 3 : tu cliques ce que dit la feuille de Michel, et sa note se recalcule."],
  "📌 Je relis ce soir la question 3": ["x610-tranche", "La question 3 de Michel passe « ⚠️ À relire » : elle t'attend ce soir dans Résultats. L'alerte se ferme."],
  "⛔ à Michel": ["x610-autonomie-michel", "Retire le point d'autonomie à Michel, après une confirmation. « ↩️ Rendre » le défait."],
  "⛔ Michel": ["x610-autonomie-michel", "Retire le point d'autonomie à Michel, après une confirmation. « ↩️ Rendre » le défait."],
  "⛔ à Julien": ["x610-autonomie-julien", "Retire le point d'autonomie à Julien, après une confirmation. « ↩️ Rendre » le défait."],
  "⛔ Julien": ["x610-autonomie-julien", "Retire le point d'autonomie à Julien, après une confirmation. « ↩️ Rendre » le défait."],
  "⛔ aux deux": ["x610-autonomie-deux", "Retire le point d'autonomie aux deux, après une confirmation : ici, aucun n'a joué le jeu. « ↩️ Rendre » le défait."],
  "⛔ Aux deux": ["x610-autonomie-deux", "Retire le point d'autonomie aux deux, après une confirmation : ici, aucun n'a joué le jeu. « ↩️ Rendre » le défait."]
};
["x610-8-console-alerte", "x610-9-telephone-alerte"].forEach(function(sc){ ALLER[sc] = {}; Object.keys(GESTES_610).forEach(function(l){ ALLER[sc][l] = GESTES_610[l][0]; }); });
Object.keys(GESTES_610).forEach(function(l){ BULLES[l] = GESTES_610[l][1]; });
BULLES["🔒 🏁 Afficher leur bilan aux élèves"] = "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les 24 présents ont répondu à la co-évaluation. Il en manque 4.";
BULLES["🔒 🏁 Afficher leur bilan — il en manque 4"] = "S'ouvre quand les 24 présents ont répondu à la co-évaluation. Il en manque 4.";
function ScFeuille3(){
  var q = EV3.questions[QI3];
  return h(F, null, PilotCoeval3(), h("div", {className:"checkin-overlay", "data-echap":"x610-8-console-alerte"},
    h("div", {className:"checkin-modal", style:{maxWidth:"620px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "Que dit la feuille ?"), h("div", {className:"checkin-sub"}, "DUVERNAY Michel — Q3 · " + q.enonce)),
      h("div", {style:{padding:".6rem 1.2rem 0", fontSize:".85rem", color:"var(--gris)"}}, "Julien y a lu E ; Michel dit avoir écrit B, C, E. Clique sur ce que dit sa feuille : ici, C et E."),
      h("div", {className:"qdf-choix"},
        q.choix.map(function(c, i){ return h("div", {key:i, className:"qdf-c" + (i === 2 || i === 4 ? " sel" : ""), title:"Clique si la feuille de Michel dit « " + c + " »."}, h("span", null, LET[i] + " · " + c), h("span", {className:"tg"}, q.bonnes.indexOf(i) >= 0 ? "bonne réponse" : "")); }),
        h("div", {className:"qdf-c aucun", title:"Clique si la feuille de Michel ne dit aucun de ces choix."}, h("span", null, "Aucun des choix"), h("span", {className:"tg"}, ""))),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost", "data-va":"x610-8-console-alerte", title:"Ferme sans rien changer : l'alerte reste ouverte."}, "Annuler"), h("button", {className:"btn btn-primary", "data-va":"x610-tranche", title:"Applique ce que dit la feuille, C et E : la question 3 de Michel reste à 0, et l'alerte se ferme."}, "Valider")))));
}
function ScGarde3(noms){
  return Fenetre(PilotCoeval3(), "⛔ Retirer le point d'autonomie " + (noms.length > 1 ? "aux deux" : "à " + noms[0]) + " ?", noms.join(" et "),
    h(F, null,
      h("p", null, (noms.length > 1 ? "Leurs deux compétences d'autonomie passent" : "Ses deux compétences d'autonomie passent") + " en Maîtrise insuffisante, pour cette évaluation : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». La note ne bouge pas."),
      h("p", {className:"fen-note"}, "Un litige est légitime ; « aux deux » est pour le cas où aucun n'a joué le jeu, par exemple chacun à moitié de bonne foi. « ↩️ Rendre » le défait, en direct ou le soir.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"x610-8-console-alerte", title:"Ne retire rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-va":"x610-tranche", title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")], "x610-8-console-alerte");
}
SCENES = SCENES.concat([
  {id:"x610-feuille", vue:"console", vh:1300, render:ScFeuille3},
  {id:"x610-autonomie-michel", vue:"console", vh:1300, render:function(){ return ScGarde3(["DUVERNAY Michel"]); }},
  {id:"x610-autonomie-julien", vue:"console", vh:1300, render:function(){ return ScGarde3(["ABRIAL Julien"]); }},
  {id:"x610-autonomie-deux", vue:"console", vh:1300, render:function(){ return ScGarde3(["DUVERNAY Michel", "ABRIAL Julien"]); }},
  {id:"x610-tranche", vue:"console", render:function(){ return PilotCoeval3(true); }}
]);
refaire("x610-6-coeval-laquelle", function(){ return Tablette(Coeval3(J), Coeval3(M, {k:"mal"})); });
refaire("x610-7-coeval-ecrit", function(){ return Tablette(Coeval3(J, {k:"ok"}), Coeval3(M, {k:"mal", q:QI3, ecrit:[1, 2, 4]})); });
/* La console du cas ambigu (610-8) : l'alerte, ou, une fois tranchée, ce que tu as décidé */
function PilotCoeval3(tranche){
  var nOk = Object.keys(CO3).filter(function(p){ return CO3[p] === "ok"; }).length + (tranche ? 4 : 0), att = tranche ? [] : ATT_CO;
  var etat = function(p){ var c = CO3[p]; if(tranche && c === "att") c = "ok";
    var r = c === "att" ? {cls:"m-pasdit", st:"⏳ pas encore répondu"} : c === "ok" ? {cls:"m-juste", st:"✅ bien lu"} : c.indexOf("mal") === 0 ? (tranche ? {cls:"m-juste", st:"❌ Q" + c.slice(3) + " · tranché"} : {cls:"m-faux m-co", st:"❌ mal lu Q" + c.slice(3), flag:"alerte : à trancher"}) : {cls:"m-coq", st:"🤔 peut-être Q" + c.slice(4), flag:"à relire ce soir"};
    r.va = "c-autonomie"; r.titre = "Clique sur le nom : « ⛔ Retirer le point d'autonomie », ou « 🚫 Marquer comme parti »."; return r; };
  return Console("pilotage", "pilot", h("div", {className:"card"},
    tranche ? h("div", {className:"alerte-co tranchee"}, h("div", {className:"al-corps"}, h("div", {className:"al-t"}, "✅ Alerte tranchée : la question 3 de DUVERNAY Michel"), h("div", {className:"al-l"}, "Ce que tu as décidé est appliqué ; sa note se recalcule, et son bilan le dira.")),
      h("div", {className:"al-actions"}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"x610-8-console-alerte", title:"Rouvre l'alerte, telle qu'elle était : rien n'est appliqué."}, "↩️ Défaire")))
      : AlerteCo3(false),
    TitreCarte(h(F, null, "🤝 Co-évaluation de la lecture — " + EV3.titre + " — " + CLASSE, InfoI("À la fin de la correction, chacun dit, dans sa moitié, s'il pense que son voisin a bien lu sa feuille. Un « ❌ » t'alerte aussitôt, en haut ; un « 🤔 » passe la question « ⚠️ À relire » ce soir. Le bilan s'affiche quand tous les présents ont répondu.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:5, className:"btn btn-ghost btn-sm"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status correction"}, "Fin de la correction — chacun dit ce qu'il pense de la lecture de sa feuille · " + (24 - att.length) + " / 24 ont répondu"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, tranche
          ? h("button", {className:"btn btn-or", "data-va":"t-bilan", title:"Affiche sur chaque moitié le bilan de l'élève : sa note provisoire, question par question, ses compétences, son estimation."}, "🏁 Afficher leur bilan aux élèves")
          : h("button", {className:"btn btn-or ferme", disabled:true}, "🔒 🏁 Afficher leur bilan aux élèves")),
        att.length > 0 && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les 24 présents ont répondu. Il en manque " + att.length + " :"),
          h("div", {className:"noms"}, att.join(" · "))),
        h("div", {className:"co-compte"}, h("div", null, "✅ ", h("strong", null, String(nOk)), " pensent : bien lu"), h("div", null, "🤔 ", h("strong", null, "2"), " pensent : peut-être mal lu (à relire ce soir)"), h("div", null, "❌ ", h("strong", null, "1"), tranche ? " pense : mal lu (tranché)" : " pense : mal lu (alerte, en haut)")),
        h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + LIRE_CO3.length + ")"),
          LIRE_CO3.map(function(x, i){ return h("div", {key:i}, x[0] + " — " + x[1]); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, "🤝 Ce que chacun pense de la lecture de sa feuille", InfoI("Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin. Un clic sur un nom agit sur l'élève.")),
        h("div", {className:"ss"}, "Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin."),
        GrilleTablettes(PAIRES, etat),
        Legende([["#22C55E","✅ bien lu"],["#FDE68A","🤔 peut-être mal lu : à relire ce soir"],["#EF4444","❌ mal lu : alerte"],["#FEE2E2","⏳ pas encore répondu","1px solid #EF4444"]])))), true);
}

/* Les boutons du téléphone : un bouton fermé (🔒) est grisé, avec sa raison dans l'infobulle */
function TelBtn(txt, variant, taille, ferme){ return h("button", {className:"tel-btn tb-" + variant + (taille ? " tb-" + taille : "") + (ferme ? " ferme" : ""), disabled:!!ferme}, txt); }

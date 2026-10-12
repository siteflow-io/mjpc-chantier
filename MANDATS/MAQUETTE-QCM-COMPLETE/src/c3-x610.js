/* (complément 4, correction 9 — la lecture) MAILLARD Noah est parti après la question 7 de la séance de 3e (son PDF validé : « parti après
   la question 7 ») : à la co-évaluation, il n'est plus là. Il ne dit rien de la lecture de sa feuille, et sa ligne « 🤔 Q10 » n'est pas
   à lire ce soir ; les présents de la co-évaluation sont 23. */
CO3.Noah = "parti";
LIRE_CO3 = LIRE_CO3.filter(function(x){ return x[0] !== "MAILLARD Noah"; });
var PRESENTS_CO3 = 24 - Object.keys(CO3).filter(function(p){ return CO3[p] === "parti"; }).length;
/* ═══════════════ Complément 3 — le cas ambigu de la 3e (x610) : chaque décision dit ce qu'elle a fait (changements 4, 5.10, 7) ═══════════════
   « &dec= » : la décision prise (michel, julien, feuille, soir) ; « &retire= » : les points d'autonomie retirés (Michel, Julien, deux).
   Sur le téléphone, la décision se prend sur le téléphone. */
var DEC_610 = {
  michel:["✅ Alerte tranchée : raison donnée à Michel", "La question 3 de DUVERNAY Michel passe à 1 point (B, C, E) : sa note se recalcule, et son bilan dit « Corrigé d'après ta feuille »."],
  julien:["✅ Alerte tranchée : raison donnée à Julien", "La lecture de Julien, E, est gardée : la question 3 de DUVERNAY Michel reste à 0 point."],
  feuille:["✅ Alerte tranchée : la feuille de Michel dit C, E", "La question 3 de DUVERNAY Michel reste à 0 point : sa feuille dit C et E, sans B."],
  soir:["📌 La question 3 de DUVERNAY Michel est à relire ce soir", "L'alerte se ferme : la question t'attend ce soir dans Résultats, « ⚠️ À relire »."]
};
// « Valider » de « Que dit la feuille ? » (« &lu= ») : la phrase dit ce que la feuille dit, et le point qui en sort
function dec610(dec){
  var luV = dec === "feuille" ? luParam() : null, q = EV3.questions[QI3];
  if(!luV) return DEC_610[dec];
  var juste = memesChoix(luV, q.bonnes);
  return ["✅ Alerte tranchée : la feuille de Michel dit " + (luV === "aucun" ? "aucun de ces choix" : lettres(luV)),
    "La question 3 de DUVERNAY Michel " + (juste ? "passe à 1 point" : "reste à 0 point") + " : sa feuille dit " + feuilleDit(q, luV, true) + "."];
}
function retires610(){ var r = paramHash("retire"); return r === "deux" ? ["Michel", "Julien"] : r ? [r] : []; }
var BOUTONS_610 = [
  ["Donner raison à Michel : B, C, E → 1 point", "btn btn-vert", "michel", "vert"], ["Donner raison à Julien : E → 0 point", "btn btn-turquoise", "julien", "turq"],
  ["La feuille dit autre chose : je clique ce qu'elle dit", "btn btn-primary", null, "primary"], ["📌 Je relis ce soir la question 3", "btn btn-or", "soir", "or"]];
function AlerteCo3(tel){
  var q = EV3.questions[QI3], M3 = S3.M, ret = retires610();
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
    h("div", {key:"y", className:"al-l al-y"}, "👉 Avant de connaître la réponse, Michel disait C, E : ni ce que Julien a lu, ni ce que Michel dit maintenant."),
    h("div", {key:"z", className:"al-l al-c"}, "Appelle-les à la fin de l'heure, la feuille de Michel en main.")
  ];
  if(tel) return h(AlerteTel3, {corps:corps});
  var retireBouton = function(qui, lib, cls, va){ var fait = qui === "deux" ? ret.length === 2 : ret.indexOf(qui) >= 0;
    return fait ? h("button", {key:lib, className:"btn btn-sm " + cls, disabled:true, title:"Son point d'autonomie est déjà retiré : « ↩️ Rendre », ci-dessous, le défait."}, lib)
      : h("button", {key:lib, className:"btn btn-sm " + cls, "data-va":va}, lib); };
  return h("div", {className:"alerte-co al3"}, h("div", {className:"al-corps"}, corps),
    h("div", {className:"al-actions"},
      BOUTONS_610.map(function(b){ return h("button", {key:b[0], className:b[1], "data-va":b[2] ? "x610-tranche&dec=" + b[2] + (ret.length ? "&retire=" + paramHash("retire") : "") : "x610-feuille", "data-moment":b[2] ? "S3E:coeval:T" : null}, b[0]); }),
      h("div", {className:"al-auto-t"}, "⛔ Retirer le point d'autonomie :"),
      h("div", {className:"al-auto"},
        retireBouton("Michel", "⛔ à Michel", "btn-ghost", "x610-autonomie-michel"), retireBouton("Julien", "⛔ à Julien", "btn-ghost", "x610-autonomie-julien"), retireBouton("deux", "⛔ aux deux", "btn-aux-deux", "x610-autonomie-deux")),
      ret.length > 0 && h("button", {className:"btn btn-vert btn-sm", "data-va":"x610-8-console-alerte", "data-moment":"S3E:coeval", title:"Rend le point d'autonomie retiré : les compétences d'autonomie repassent en Très bonne maîtrise."}, "↩️ Rendre"),
      InfoIB("❌ Alerte", "L'alerte est apparue quand Michel a cliqué ce qu'il avait écrit ; elle disparaît s'il change d'avis avant le bilan. Chaque bouton a sa confirmation et son retour.")));
}
// sur le téléphone : la décision se prend là, et ce qu'elle a fait s'y lit
function AlerteTel3(p){
  var s = useState(null), dec = s[0], setDec = s[1];
  if(dec) return h("div", {className:"tel-alerte"}, h("div", {className:"al-t"}, dec610(dec)[0]), h("div", {className:"al-l"}, dec610(dec)[1]),
    h("button", {className:"tel-btn tb-ghost tb-small", "data-local":"1", title:"Rouvre l'alerte, telle qu'elle était : rien n'est appliqué.", onClick:function(){ setDec(null); }}, "↩️ Défaire"));
  return h("div", {className:"tel-alerte"}, p.corps,
    BOUTONS_610.map(function(b){ return h("button", {key:b[0], className:"tel-btn tb-" + b[3], "data-local":"1", title:BULLES[b[0]], onClick:function(){ setDec(b[2] || "feuille"); }}, b[0]); }),
    h("div", {className:"g3"},
      h(TelGeste, {lib:"⛔ à Michel", cls:"tb-ghost tb-small", titre:BULLES["⛔ à Michel"] || BULLES["⛔ Michel"], question:"⛔ Retirer le point d'autonomie à DUVERNAY Michel ?", corps:"Ses deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation. La note ne bouge pas.", oui:"⛔ Retirer le point d'autonomie", fait:"⛔ Point d'autonomie retiré à Michel."}),
      h(TelGeste, {lib:"⛔ à Julien", cls:"tb-ghost tb-small", titre:BULLES["⛔ à Julien"] || BULLES["⛔ Julien"], question:"⛔ Retirer le point d'autonomie à ABRIAL Julien ?", corps:"Ses deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation. La note ne bouge pas.", oui:"⛔ Retirer le point d'autonomie", fait:"⛔ Point d'autonomie retiré à Julien."}),
      h(TelGeste, {lib:"⛔ aux deux", cls:"tb-rougeclair tb-small", titre:BULLES["⛔ aux deux"] || BULLES["⛔ Aux deux"], question:"⛔ Retirer le point d'autonomie aux deux ?", corps:"Leurs deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation. La note ne bouge pas.", oui:"⛔ Retirer le point d'autonomie", fait:"⛔ Point d'autonomie retiré aux deux."})),
    h("div", {className:"tel-al-note"}, "⛔ : retirer le point d'autonomie."));
}
// les gardes du point d'autonomie : le point retiré se voit ensuite, et l'alerte reste à trancher (relecteur n°177)
function ScGarde3(noms){
  var cle = noms.length > 1 ? "deux" : pre(noms[0]);
  return Fenetre(PilotCoeval3(), "⛔ Retirer le point d'autonomie " + (noms.length > 1 ? "aux deux" : "à " + noms[0]) + " ?", noms.join(" et "),
    h(F, null, h("p", null, (noms.length > 1 ? "Leurs deux compétences d'autonomie passent" : "Ses deux compétences d'autonomie passent") + " en Maîtrise insuffisante, pour cette évaluation : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». La note ne bouge pas.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"x610-8-console-alerte", title:"Ne retire rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-va":"x610-8-console-alerte&retire=" + cle, title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")], "x610-8-console-alerte");
}
// la console du cas ambigu : l'alerte, ou ce que tu as décidé (« &dec= »), et les points retirés (« &retire= »)
function PilotCoeval3(tranche){
  var dec = paramHash("dec") || (tranche ? "feuille" : null), ret = retires610(), k = MO();
  var nbAtt = dec ? 0 : ATT_CO.length, presents = PRESENTS_CO3;
  var att = dec ? [] : ATT_CO, lire = LIRE_CO3.slice();
  if(dec === "soir") lire = lire.concat([["DUVERNAY Michel", "Q3 : pense qu'ABRIAL Julien a mal lu sa feuille ; à relire"]]);
  var compte = function(t){ return Object.keys(CO3).filter(function(p){ var c = CO3[p]; if(c === "parti") return false; if(dec && c === "att") c = "ok"; return t(c); }).length; };
  var nOk = compte(function(c){ return c === "ok"; }), nPeut = compte(function(c){ return c.indexOf("peut") === 0; }), nMal = compte(function(c){ return c.indexOf("mal") === 0; });
  var etat = function(p){ var c = CO3[p]; if(c === "parti") return {cls:"m-parti", st:"🚪 parti après la question 7", va:"c-autonomie", titre:"Clique sur le nom : « ⛔ Retirer le point d'autonomie », ou « 🚫 Marquer comme parti »."}; if(dec && c === "att") c = "ok";
    var r = c === "att" ? {cls:"m-pasdit", st:"⏳ pas encore répondu"} : c === "ok" ? {cls:"m-juste", st:"✅ bien lu"} : c.indexOf("mal") === 0 ? (dec && dec !== "soir" ? {cls:"m-juste", st:"❌ Q" + c.slice(3) + " · tranché"} : {cls:"m-faux m-co", st:"❌ mal lu Q" + c.slice(3), flag:dec === "soir" ? "à relire ce soir" : "alerte : à trancher"}) : {cls:"m-coq", st:"🤔 peut-être Q" + c.slice(4), flag:"à relire ce soir"};
    if(ret.indexOf(p) >= 0) r.flag = r.flag === "alerte : à trancher" ? r.flag + " · " + FLAG_RETIRE : FLAG_RETIRE;
    r.va = "c-autonomie"; r.titre = "Clique sur le nom : « ⛔ Retirer le point d'autonomie », ou « 🚫 Marquer comme parti »."; return r; };
  return Console("pilotage", "pilot", h("div", {className:"card"},
    dec ? h("div", {className:"alerte-co tranchee"}, h("div", {className:"al-corps"}, h("div", {className:"al-t"}, dec610(dec)[0]), h("div", {className:"al-l"}, dec610(dec)[1])),
        h("div", {className:"al-actions"}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"x610-8-console-alerte" + (ret.length ? "&retire=" + paramHash("retire") : ""), "data-moment":"S3E:coeval", title:"Rouvre l'alerte, telle qu'elle était : rien n'est appliqué."}, "↩️ Défaire")))
      : AlerteCo3(false),
    TitreCarte(h(F, null, "🤝 Co-évaluation de la lecture — " + EV3.titre + " — " + CLASSE, InfoI("À la fin de la correction, chacun dit, dans sa moitié, s'il pense que son voisin a bien lu sa feuille. Un « ❌ » t'alerte aussitôt, en haut ; un « 🤔 » passe la question « ⚠️ À relire » ce soir. Le bilan s'affiche quand tous les présents ont répondu.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm", "data-va":"c-depart"}, "🚫 Départ d'un élève"), h("button", {key:5, className:"btn btn-ghost btn-sm", "data-va":"c-finir-autre-heure"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm", "data-va":"c-terminer"}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status correction"}, "Fin de la correction — chacun dit ce qu'il pense de la lecture de sa feuille · " + (presents - nbAtt) + " / " + presents + " ont répondu"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, dec && dec !== "soir" || (dec === "soir")
          ? h("button", {className:"btn btn-or", "data-va":"t-bilan", title:"Affiche sur chaque moitié le bilan de l'élève : sa note provisoire, question par question, ses compétences, son estimation."}, "🏁 Afficher leur bilan aux élèves")
          : h("button", {className:"btn btn-or ferme", disabled:true, title:"« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les " + presents + " présents ont répondu et que l'alerte est tranchée. Il en manque " + att.length + "."}, "🔒 🏁 Afficher leur bilan aux élèves")),
        att.length > 0 && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les " + presents + " présents ont répondu. Il en manque " + att.length + " :"),
          h("div", {className:"noms"}, att.join(" · "))),
        h("div", {className:"co-compte"}, h("div", null, "✅ ", h("strong", null, String(nOk)), " pensent : bien lu"), h("div", null, "🤔 ", h("strong", null, String(nPeut)), nPeut === 1 ? " pense : peut-être mal lu (à relire ce soir)" : " pensent : peut-être mal lu (à relire ce soir)"), h("div", null, "❌ ", h("strong", null, String(nMal)), dec && dec !== "soir" ? " pense : mal lu (tranché)" : " pense : mal lu (alerte, en haut)")),
        h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, x[0] + " — " + x[1]); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, "🤝 Ce que chacun pense de la lecture de sa feuille", InfoI("Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin. Un clic sur un nom agit sur l'élève.")),
        GrilleTablettes(PAIRES, etat),
        Legende([["#22C55E","✅ bien lu"],["#FDE68A","🤔 peut-être mal lu : à relire ce soir"],["#EF4444","❌ mal lu : alerte"],["#FEE2E2","⏳ pas encore répondu","1px solid #EF4444"]])))), true);
}
// les gestes du cas ambigu ont leur destination dans leur écran (AlerteCo3) : plus de table par libellé
delete ALLER["x610-8-console-alerte"]; delete ALLER["x610-9-telephone-alerte"];
// le téléphone du cas ambigu : l'heure de fin de cette séance (15:07 + 55 min), un nom ouvre sa fiche, « 🛑 Terminer » demande confirmation
function TelCoeval3(){
  var lignes = PAIRES.map(function(pa, i){
    return h("div", {key:i, className:"tel-tab"}, h("span", {className:"tel-tab-n"}, "T" + (i+1)),
      pa.map(function(n, k){
        if(!n) return null;
        var p = pre(n), c = CO3[p], ps = c === "parti" ? {t:"🚪", cls:"tp-voile"} : c === "att" ? {t:"⏳", cls:"tp-rouge"} : c === "ok" ? {t:"✅", cls:"tp-juste"} : c.indexOf("mal") === 0 ? {t:"❌ Q" + c.slice(3), cls:"tp-mal"} : {t:"🤔 Q" + c.slice(4), cls:"tp-coq"};
        var nom = n.length > 15 ? n.slice(0, 14) + "…" : n;
        return h("button", {key:k, type:"button", className:"tel-el" + (c === "att" ? " rouge" : ""), "data-va":"p-autonomie&eleve=" + encodeURIComponent(p), title:"Ouvre la fiche " + deNom(n) + "."}, h("span", {className:"nm"}, nom), h("span", {className:"tel-past " + ps.cls}, ps.t));
      }));
  });
  return TelCadre([
    h("div", {key:"b", className:"tel-bandeau"},
      h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}, h("div", {style:{fontWeight:900, fontSize:".95rem"}}, CLASSE), h("div", {style:{fontSize:".72rem", opacity:.9}}, "🕙 Fin " + SCN.finHeure(MO()))),
      h("div", {style:{fontSize:".75rem", opacity:.85}}, EV3.titre),
      h("div", {style:{marginTop:".3rem", fontSize:".8rem", fontWeight:"bold"}}, "Phase : co-évaluation de la lecture", h("span", {className:"tel-tour"}, (PRESENTS_CO3 - ATT_CO.length) + " / " + PRESENTS_CO3 + " ont répondu"))),
    h("div", {key:"al"}, AlerteCo3(true)),
    h("div", {key:"a", className:"tel-actions"}, h("button", {className:"tel-btn tb-or tb-large ferme", disabled:true, title:"S'ouvre quand les " + PRESENTS_CO3 + " présents ont répondu à la co-évaluation et que l'alerte est tranchée. Il en manque " + ATT_CO.length + "."}, "🔒 🏁 Afficher leur bilan — il en manque " + ATT_CO.length)),
    h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Pas encore répondu : "), ATT_CO.join(" · ")),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + LIRE_CO3.length + ") : "), LIRE_CO3.map(function(x){ return x[0] + " — " + x[1]; }).join(" · ")),
    h("div", {key:"l", className:"tel-liste"}, h("div", {className:"tel-liste-h"}, "TABLETTES — ce que chacun pense de la lecture de sa feuille"), lignes),
    h("div", {key:"lg"}, TelLegende(["✅ bien lu", "🤔 peut-être mal lu : ce soir", "❌ mal lu : alerte", "⏳ pas encore"])),
    h("div", {key:"t"}, h(TelTerminer))]);
}

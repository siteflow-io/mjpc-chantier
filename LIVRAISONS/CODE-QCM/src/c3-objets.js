/* ═══════════════ Complément 3 — l'objet cliqué (changement 4) ═══════════════
   Chaque geste porte son objet dans l'adresse : l'élève (« &eleve= », un prénom), la tablette (« &tab= »), la question (« &q= »),
   la séance (« &seance= »), l'évaluation (« &eval= »). La scène où il mène s'ouvre sur cet objet, au moment du geste. */
function paramEleve(defaut){ return paramHash("eleve") || defaut; }
function paramQ(defaut){ return (+paramHash("q") || defaut) - 1; }
function avecObjet(va, cle, v){ return !va || va.indexOf(cle + "=") >= 0 ? va : va + "&" + cle + "=" + encodeURIComponent(v); }
// la moitié d'un élève : sa tablette, son côté, son voisin
function placeDe(p){ var t = SCN.tabletteDe(p) || {n:"?", cote:"g"}, v = SCN.voisinDe(p); return "Tablette " + t.n + ", moitié de " + (t.cote === "g" ? "gauche" : "droite") + (v ? " · avec " + nomDe(v) : " · seul" + (SCN.SEXE[p] === "F" ? "e" : "")); }

/* ── Les tablettes de la console : un nom ouvre la fiche de cet élève, « 👁 » montre cette tablette ; « seul » suit la tablette ── */
function TabMini(num, a, b, etat, opts){
  opts = opts || {};
  function moitie(n, cote){
    if(!n) return h("div", {className:"tab-mini-m vide"}, h("div", {className:"nm"}, "moitié libre"));
    var e = etat ? etat(pre(n), cote) : {};
    return h("div", {className:"tab-mini-m " + (e.cls || "")},
      e.va ? h("button", {className:"nm tab-nom", "data-va":avecObjet(e.va, "eleve", pre(n)), title:e.titre || "Agit sur " + n + "."}, n) : h("div", {className:"nm"}, opts.grip && h("span", {className:"grip"}, "⠿"), n),
      e.st && h("span", {className:"st"}, e.st),
      e.flag && h("span", {className:"flag"}, e.flag));
  }
  var seul = !!a !== !!b;
  return h("div", {key:num, className:"tab-mini" + (seul ? " seul" : "")},
    h("div", {className:"tab-mini-h"}, h("span", null, "📱 Tablette " + num), seul ? h("span", null, "seul") : opts.coin === " " || (!a && !b) ? h("span", null, " ")
      : h("button", {className:"tab-oeil", "data-va":"c-voir-tablette&tab=" + num, title:"Montre les deux moitiés de la tablette " + num + " en direct, en grand. Ne change rien."}, "👁")),
    h("div", {className:"tab-mini-b"}, moitie(a, "g"), moitie(b, "d")));
}

/* ── « 👁 » : la tablette cliquée, telle qu'elle est maintenant ; rien ne s'y clique ── */
function eleveObjet(nom, cle){ var p = pre(nom); return {cle:cle, nom:nom, prenom:p, sexe:SCN.SEXE[p] || "M"}; }
function tabletteN(n){
  var pa = PAIRES[n - 1]; if(n === 1 || !pa || !pa[1]) return tabletteDuMoment();
  var sv = {J:J, M:M, E:E, TABL:TABL};
  var a = eleveObjet(pa[0], "J"), b = eleveObjet(pa[1], "M");
  J = a; M = b; E = {J:a, M:b}; var choix = function(p){ return String(SCN.RT[p] || "").split("").map(function(x, qi){ return SCN.choixDe(x, qi); }); };
  TABL = {J:choix(a.prenom), M:choix(b.prenom)};
  try { return tabletteDuMoment(); } finally { J = sv.J; M = sv.M; E = sv.E; TABL = sv.TABL; }
}
function ScVoirTablette(){
  var m = MOM(), n = +paramHash("tab") || 1, pa = PAIRES[n - 1] || PAIRES[0];
  return Fenetre(Pilot(etatPilot()), "📱 Tablette " + n + " · " + pa[0] + (pa[1] ? " · " + pa[1] : "") + " — en direct", "Ce que montrent ses deux moitiés, maintenant : " + ouEnEst(m) + ".",
    h("div", {className:"voir-tab fige-choix"}, h("div", {className:"voir-tab-in"}, tabletteN(n))),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1"}, "✕ Fermer")], "c-q1-tour1", 900);
}

/* ── Le fond d'une fenêtre d'élève : l'écran du moment ── */
// le pilotage tel qu'il est au moment de la scène : un moment qui a sa propre scène de console la montre (bilan, papier, mode test)
var FOND_SCENE = {"S08:bilan":"c-bilan", "PAP:avant":"c-papier-lancer", "PAP:seance":"c-papier-seance", "PAP:grille":"c-papier-grille", "PAP:reprise":"c-papier-reprendre",
  "PAP:estim":"c-estim", "PAP:att2":"c-attest2", "TEST:avant":"x620-1-mode-test-ouverture", "TEST:Q3:R":"x620-2-mode-test-reflexion", "TEST:Q3:B1":"x620-2-mode-test-reflexion"};
var FOND_EN_COURS = false;
function fondDuMoment(){
  var m = MOM(), k = MO(), id = FOND_SCENE[k] || (m.ph === "bilan" && m.seance === "S08" ? "c-bilan" : null), sc = id && id !== window.SCENE_COURANTE ? sceneParId(id) : null;
  if(sc && !FOND_EN_COURS){ FOND_EN_COURS = true; try { return sc.render(); } finally { FOND_EN_COURS = false; } }
  if(m.seance === "PAP") return PilotCorrPapier();
  if(m.seance === "S3E") return PilotCoeval3();
  if(m.ph === "coeval" || m.ph === "bilan") return PilotCoevalE();
  if(m.ph === "lecture" || m.ph === "revele") return PilotCorrection();
  if(m.ph === "soir") return ScFiche(false);
  return Pilot(etatPilot());
}
/* ── La fiche d'un élève pendant la séance (« &eleve= ») : son point d'autonomie, son départ ── */
// un geste montré sur un autre élève que celui du scénario (« &retire= », « &parti= ») : la scène le montre fait
function autonomieDe(p, k){ return paramHash("retire") === p ? {retire:true, quand:"à " + hhmm(MOM().heure)} : SCN.autonomie(p, k); }
function BoutonRendre(p){
  var s = useState(false), fait = s[0], set = s[1];
  return h("button", {className:"btn btn-vert", "data-local":"1", disabled:fait, title:fait ? "Le point d'autonomie de " + p.p + " est rendu." : "Rend son point d'autonomie à " + p.p + " : ses deux compétences d'autonomie repassent en Très bonne maîtrise.",
    onClick:function(){ set(true); }}, fait ? "✅ Point rendu" : "↩️ Rendre");
}
function ScAutonomie(){
  var k = MO(), p = paramEleve("Hugo"), au = autonomieDe(p, k), e = "&eleve=" + encodeURIComponent(p), il = SCN.SEXE[p] === "F" ? "Elle" : "Il";
  return Fenetre(fondDuMoment(), "👤 " + nomDe(p), placeDe(p),
    h(F, null, h("p", null, au.retire ? h(F, null, h("strong", null, "⛔ Point d'autonomie retiré"), " " + au.quand + ". Ses deux compétences d'autonomie sont en Maîtrise insuffisante ; sa note ne bouge pas.")
      : il + " a son point d'autonomie : ses deux compétences d'autonomie sont en Très bonne maîtrise.")),
    au.retire ? [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-corr-q2-apres"}, "✕ Fermer"), h(BoutonRendre, {key:2, p:p})]
      : [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-corr-q2-apres"}, "✕ Fermer"),
         h("button", {key:3, className:"btn btn-ghost", "data-va":"c-parti&parti=" + encodeURIComponent(p), title:"Marque " + p + " comme parti" + (il === "Elle" ? "e" : "") + " : " + il.toLowerCase() + " ne bloque plus la classe, ses questions manquées sortent de son total."}, "🚫 Marquer comme parti"),
         h("button", {key:2, className:"btn btn-rouge", "data-va":"c-autonomie-garde" + e, title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante."}, "⛔ Retirer le point d'autonomie")],
    "c-corr-q2-apres");
}

function ScAutonomieGarde(qui, retour){
  var p = paramEleve(null), noms = qui || (p ? [nomDe(p)] : ["FOUCHER Hugo"]), pr = noms.map(pre);
  var fond = retour === "c-coeval-attente" ? PilotCoevalE() : fondDuMoment();
  var suite = retour === "c-coeval-attente" ? "c-coeval-retire-" + (noms.length > 1 ? "deux" : pr[0].toLowerCase()) : "c-autonomie-retiree&eleve=" + encodeURIComponent(pr[0]) + (pr[0] === "Hugo" ? "" : "&retire=" + encodeURIComponent(pr[0]));
  return Fenetre(fond, "⛔ Retirer le point d'autonomie " + (noms.length > 1 ? "aux deux" : "à " + noms[0]) + " ?", noms.join(" et "),
    h(F, null, h("p", null, (noms.length > 1 ? "Leurs deux compétences d'autonomie passent" : "Ses deux compétences d'autonomie passent") + " en Maîtrise insuffisante, pour cette évaluation : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». La note ne bouge pas.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":retour || "c-autonomie", title:"Ne retire rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-va":suite, "data-moment":momentDefaut(suite.split("&")[0]), title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")], retour || "c-corr-q2-apres");
}
function ScParti(){ return fondDuMoment(); }

/* ── « ❌ Écarter » et « ⚠️ Annuler » : la question cliquée (« &q= ») ── */
function alerteCompSans(qi){
  var q = EV.questions[qi], comps = q.competences || [];
  var faibles = comps.filter(function(c){ return EV.questions.filter(function(x, i){ return i !== qi && (x.competences || []).indexOf(c) >= 0; }).length < 3; });
  if(!faibles.length) return null;
  var n = EV.questions.length - 1;
  return "⚠️ " + listeFr(faibles) + (faibles.length > 1 ? " ne sont plus évaluées" : " n'est plus évaluée") + " que par " + n + " questions : " + (faibles.length > 1 ? "leurs niveaux seront moins fins" : "son niveau sera moins fin") + " (il en faut 3).";
}
function ScEcartee(){
  var st = etatPilot(), qi = paramQ(3); st.remettre = "c-q1-close";
  if(paramHash("q")){ st.ecartees = {}; st.ecartees[qi] = true; }
  st.alerteComp = alerteCompSans(qi);
  return Pilot(st);
}
function ScAnnuler(){
  var qi = paramQ(2), q = EV.questions[qi], b = bilanQ(qi, MO());
  return Fenetre(Pilot(etatPilot()), "⚠️ Annuler la question " + (qi + 1) + " ?", q.enonce + " — posée, " + b.repondu + " réponses",
    h(F, null, h("p", null, "Elle a été posée, mais elle ne comptera pas : elle sort du total de la note et des compétences. Ses réponses restent gardées.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q2-close"}, "Fermer"),   // (changement 8.3, relecteur n°107) deux boutons côte à côte, deux mots
     h("button", {key:2, className:"btn btn-rouge", "data-va":"c-annulee&q=" + (qi + 1), "data-moment":momentDefaut("c-annulee")}, "⚠️ Annuler la question " + (qi + 1))], "c-q2-close");
}
function ScAnnulee(){ var st = etatPilot(), qi = paramQ(2); st.remettre = "c-q2-close"; if(paramHash("q")){ st.annulees = {}; st.annulees[qi] = true; } return Pilot(st); }

/* ── Le soir : la garde du point d'autonomie et « Que dit la feuille ? », pour l'élève et la question cliqués ── */
function ScFicheGarde(){
  var p = paramEleve("Michel"), e = "&eleve=" + encodeURIComponent(p);
  return Fenetre(ScFiche(false), "⛔ Retirer le point d'autonomie à " + nomDe(p) + " ?", "Le soir, d'après ta lecture de ses feuilles",
    h(F, null, h("p", null, "Ses deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». La note ne bouge pas.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-fiche" + e, title:"Ne retire rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-va":"c-fiche-retire" + e + (p === "Michel" ? "" : "&retire=" + encodeURIComponent(p)), "data-moment":momentDefaut("c-fiche-retire"), title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")], "c-fiche" + e);
}
function ScQueDitLaFeuille(){
  var p = paramEleve("Michel"), qi = paramQ(3), q = EV.questions[qi], v = SCN.voisinDe(p), e = "&eleve=" + encodeURIComponent(p);
  var cle = p === "Julien" ? "J" : p === "Michel" ? "M" : null, lu = cle ? SCN.LU_JM[cle][qi] : SCN.choixDe(SCN.LU[p][qi], qi);
  return h(F, null, ScFiche(false), h("div", {className:"checkin-overlay", "data-echap":"c-fiche" + e},
    h("div", {className:"checkin-modal", style:{maxWidth:"460px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "Que dit la feuille ?"), h("div", {className:"checkin-sub"}, nomDe(p) + " — Q" + (qi + 1) + " · " + q.enonce)),
      h("div", {style:{padding:".6rem 1.2rem 0", fontSize:".85rem", color:"var(--gris)"}}, (v ? v + " a lu « " + choixTexte(q, lu) + " »." : "") + " Clique sur ce que dit sa feuille."),
      h("div", {className:"qdf-choix"},
        q.choix.map(function(c, i){ var sel = lu !== "aucun" && lu.indexOf(i) >= 0; return h("div", {key:i, className:"qdf-c" + (sel ? " sel" : ""), title:"Clique si la feuille " + deNom(p) + " dit « " + c + " »."}, h("span", null, c), h("span", {className:"tg"}, q.bonnes.indexOf(i) >= 0 ? "bonne réponse" : "")); }),
        h("div", {className:"qdf-c aucun" + (lu === "aucun" ? " sel" : ""), title:"Garde « aucun des choix » : la question reste à 0, et le signalement passe à « lu »."}, h("span", null, "Aucun des choix"), h("span", {className:"tg"}, lu === "aucun" && v ? "lu par " + v : ""))),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost", "data-va":"c-fiche" + e, title:"Ferme sans rien changer."}, "Annuler"),
        h("button", {className:"btn btn-primary", "data-va":"c-fiche" + e, title:"Applique ce que dit la feuille : la question " + (qi + 1) + " se recalcule, « Corrigé d'après ta feuille » dans son bilan."}, "Valider")))));
}

/* ── Le tableau d'une autre séance (« &seance= ») : ses questions, ses notes, d'après le scénario (S.R_JB, S.R_CH1, S.R_3E) ── */
function ResultatsAutre(id){
  var se = SCN.seance(id), ev = evalDeSeance(se), R = id === "JB" ? SCN.R_JB : id === "CH1" ? SCN.R_CH1 : SCN.R_3E, noms = Object.keys(R || {}).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  var rendue = rendueAu(se, MO());
  return h("div", {className:"card", "data-seance":id},
    TitreCarte("📊 " + ev.titre + " — " + se.classe, [h("button", {key:0, className:"btn btn-ghost btn-sm", "data-va":"c-seances", title:"Revient à la liste des séances."}, "← Retour")]),
    h("p", {className:"res-meta"}, se.date + " " + se.heure + " · " + presentsTexte(se) + (rendue ? " · copies rendues le " + jjmm(se.rendues) : "")),
    h("div", {className:"res-tab-wrap"}, h("table", {className:"res-tab"},
      h("thead", null, h("tr", null, h("th", null, "Élève"), ev.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i + 1)); }), h("th", null, "Note"), h("th", null, "Sur 20"), h("th", null, "Maîtrise"))),
      h("tbody", null, noms.map(function(n){
        var r = R[n], nt = SCN.noteSeance(id, n), mt = nt ? MAITRISE.filter(function(y){ return y.k === (nt.maitrise && nt.maitrise.k ? nt.maitrise.k : SCN.maitriseDe(nt.sur20)); })[0] : null;
        if(!r) return h("tr", {key:n}, h("td", {className:"eleve-cell"}, n), h("td", {colSpan:ev.questions.length + 3, className:"cell-vide"}, "absent" + (SCN.SEXE[pre(n)] === "F" ? "e" : "")));
        return h("tr", {key:n}, h("td", {className:"eleve-cell"}, n), r.split("").map(function(c, i){ return h("td", {key:i, className:c === "J" || c === "T" ? "cell-juste" : c === "-" ? "cell-vide" : "cell-faux"}, c === "J" || c === "T" ? "✓" : c === "-" ? "·" : "✗"); }),
          h("td", null, nt ? nt.n + "/" + nt.total : "—"), h("td", null, nt ? fr1(nt.sur20) : "—"), h("td", null, mt ? mt.em + " " + mt.lib : "—"));
      })))));
}
refaire("c-resultats", function(){ var id = paramHash("seance"); return Console("donnees", "results", id && id !== "S08" ? ResultatsAutre(id) : h(ResultatsQCM), false); });
refaire("c-resultats-rendues", function(){ var id = paramHash("seance"); return Console("donnees", "results", id && id !== "S08" ? ResultatsAutre(id) : h(ResultatsQCM, {rendues:true}), false); });

// « 🗑️ Purger les évaluations » et « 🗑️ Tout purger » : chacun sa garde (relecteur n°244)
function ScPurger(){
  var tout = !!paramHash("tout");
  return Fenetre(Sauvegarde(), tout ? "🗑️ Tout purger ?" : "🗑️ Purger les évaluations ?", tout ? "Tout le QCM part à la corbeille : évaluations, séances, réponses, gardés un an." : "Toutes les évaluations partent à la corbeille, gardées un an.",
    h(F, null, h("p", null, tout ? "Rien n'est effacé : tout se restaure depuis 💾 Sauvegarde → 🗑️ Corbeille, pendant un an." : "Leurs séances gardent leurs notes."),
      h("p", {className:"fen-note"}, "Pense à exporter un snapshot avant.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-sauvegarde", title:"Ne purge rien."}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-sauvegarde", title:tout ? "Met tout le QCM à la corbeille, sauf la démo." : "Met toutes les évaluations à la corbeille, sauf la démo."}, tout ? "🗑️ Tout purger" : "🗑️ Purger")], "c-sauvegarde");
}

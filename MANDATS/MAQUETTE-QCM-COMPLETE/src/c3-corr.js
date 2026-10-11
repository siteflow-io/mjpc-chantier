/* ═══════════════ Complément 3 — la correction, la co-évaluation, le bilan, au moment de la scène ═══════════════
   La console, les tablettes, le tableau et le téléphone lisent le scénario : qui a lu, qui a juste d'après la feuille,
   qui a trouvé au dernier moment, à qui le point d'autonomie est retiré, ce qui reste à lire ce soir. */

// « À lire sur les feuilles » au moment de la scène : [nom, question, texte] comme dans les couches précédentes
function lireSoir(k){ return SCN.aLire(k || MO()).map(function(x){ return [x.nom, x.q, x.txt, x]; }); }
function retiresAu(k){ k = k || MO(); return SCN.presents(k).filter(function(p){ return SCN.autonomie(p, k).retire; }); }
var FLAG_RETIRE = "⛔ point d'autonomie retiré";

/* ── Une moitié pendant la correction : lue ou pas ; puis juste, faux, trouvée au dernier moment ; le point retiré ── */
function etatCorr3(qi){
  var k = MO(), m = MOM(), revele = m.ph === "revele" || SCN.corrigeesAu(k).indexOf(qi) >= 0, pasLu = m.pasLu || [];
  var lire = SCN.aLire(k);
  return function(p){
    var s = calc(p).st[qi];
    var r = {va:"c-autonomie", titre:"Clique sur le nom : « ⛔ Retirer le point d'autonomie », ou « 🚫 Marquer comme parti »."};
    // (relecteur n°179) le point retiré ne cache pas l'alerte encore ouverte : la tuile dit les deux
    if(SCN.autonomie(p, k).retire) r.flag = r.flag === "alerte : à trancher" ? r.flag + " · " + FLAG_RETIRE : FLAG_RETIRE;
    if(!revele){ r.cls = pasLu.indexOf(p) >= 0 ? "m-pasdit" : "m-dit"; r.st = pasLu.indexOf(p) >= 0 ? "⏳ sa feuille pas encore lue" : "📄 feuille lue"; return r; }
    if(s === "j"){ r.cls = "m-juste"; r.st = "✓ 1 pt"; }
    else if(s === "t"){ r.cls = "m-trouvee"; r.st = "✓ Trouvée au dernier moment"; }
    else if(s === "a"){ r.cls = "m-faux"; r.st = "∅ aucun · 0"; }
    else { r.cls = "m-faux"; r.st = "✗ 0"; }
    if(!r.flag && lire.some(function(x){ return x.p === p && x.q === qi; })) r.flag = "⚠️ À relire";
    return r;
  };
}
var LEG_CORR_AP = [["#22C55E","✓ juste d'après la feuille"],["#EF4444","✗ faux d'après la feuille"],["#F97316","✓ Trouvée au dernier moment"],["#FFEDD5","⚠️ À relire sur la feuille, ce soir","1px solid #FDBA74"]];

/* ════════ La console pendant la correction ════════ */
function PilotCorrection(){
  var k = MO(), m = MOM(), qi = m.qi, q = EV.questions[qi], pos = SCN.ORDRE_CORR.indexOf(qi), derniere = pos === 2;
  var revele = m.ph === "revele", pasLu = m.pasLu || [], c = SCN.compteurs(k), pres = c.presents;
  var b = bilanQ(qi, k);
  var res = SCN.presents(k).map(function(p){ return calc(p).st[qi]; });
  var nbF = res.filter(function(s){ return s === "j"; }).length, nbT = res.filter(function(s){ return s === "t"; }).length;
  var lire = lireSoir(k);
  var suivant = derniere
    ? h("button", {className:"btn btn-primary", disabled:!revele, "data-va":revele ? "c-coeval-attente" : null, title:revele ? "Ouvre d'abord, sur chaque tablette, la co-évaluation de la lecture ; le bilan s'affiche quand tous les présents y ont répondu." : "S'ouvre quand la dernière question est révélée."}, revele ? "🤝 Ouvrir la co-évaluation, puis leur bilan" : "🏁 Afficher leur bilan aux élèves")
    : revele ? h("button", {className:"btn btn-primary", "data-va":qi === 1 ? "t-corr-q3-lecture" : "t-corr-q1-lecture", title:"Passer à la question suivante dans l'ordre trié par taux d'erreur."}, "Question suivante →")
    : fermeEnv("« Question suivante → » s'ouvre quand cette question est révélée.", hBase("button", {className:"btn btn-primary", disabled:true, title:"Passer à la question suivante dans l'ordre trié par taux d'erreur."}, "Question suivante →"));
  var reveler = revele ? h("button", {className:"btn btn-ghost", disabled:true, title:"Cette question est déjà révélée sur toutes les tablettes."}, "💡 Révélée")
    : pasLu.length ? h("button", {className:"btn btn-or ferme", disabled:true, title:"« 💡 Révéler » s'ouvre quand les " + pres + " présents ont lu la feuille de leur voisin. Il en manque " + pasLu.length + "."}, "🔒 Révéler")
    : h("button", {className:"btn btn-or", "data-va":qi === 1 ? "t-corr-q2-apres" : qi === 2 ? "t-corr-q3-apres" : "t-corr-q1-apres", title:"Montre la bonne réponse et l'explication sur toutes les tablettes et au tableau. Commente la question après, jamais avant."}, "💡 Révéler");
  var prec = pos > 0 ? SCN.ORDRE_CORR[pos - 1] : null;
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📝 Correction — " + EV.titre + " — " + CLASSE, InfoI("Pour chaque question, chacun lit d'abord la feuille de son voisin et clique ce qu'elle dit, dans la moitié du voisin. « 💡 Révéler » s'ouvre quand tous les présents l'ont fait. Tu commentes la question après la révélation, jamais avant : sinon, ils cliqueraient ce que tu dis. Les questions vont de la plus ratée à la mieux réussie. Un clic sur un nom agit sur l'élève.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm", "data-va":"c-depart"}, "🚫 Départ d'un élève"), h("button", {key:5, className:"btn btn-ghost btn-sm", "data-va":"c-finir-autre-heure"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm", "data-va":"c-terminer"}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status correction", title:"Position dans l'ordre de correction (trié par taux d'erreur décroissant). Q" + (qi+1) + " est la " + (pos === 0 ? "1re" : (pos+1) + "e") + " question révélée."}, "Question " + (pos+1) + " / 3 — Q" + (qi+1) + (revele ? " · révélée" : " · lecture de la feuille du voisin")),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"pilot-q-current"},
          h("div", {className:"num"}, "Question " + (qi+1)),
          h("div", {className:"enonce"}, q.enonce),
          h("div", {className:"pilot-q-bonne"}, h("span", {style:{fontWeight:900}}, "✓ Bonne" + (q.bonnes.length > 1 ? "s" : "") + " réponse" + (q.bonnes.length > 1 ? "s" : "") + " : "), q.bonnes.map(function(i){ return q.choix[i]; }).join("  /  ")),
          h("div", {className:"niv-row"}, h("span", {className:"niv-bulle", title:"Niveau de la question (info indicative pendant la correction)."}, "Difficulté : " + NIV[q.niveau].label), h("span", {className:"niv-bulle", title:"Taux de réussite de la classe sur cette question. Sert au tri par difficulté."}, b.justes + " / " + b.repondu + " justes sur la tablette (" + Math.round(b.justes * 100 / b.repondu) + " %)"))),
        !revele && h("div", {className:"pilot-chrono-card actif saisie-carte"},
          h("div", {className:"label actif"}, "📄 Temps pour lire la feuille du voisin"),
          h("div", {className:"v"}, (m.reste || 0) + "s"),
          h("div", {className:"desc"}, "sur " + tempsDe(qi).reponse + " s")),
        h("div", {className:"row", style:{marginTop:".8rem"}},
          prec == null ? fermeEnv("C'est la première question de la correction : il n'y a pas de question précédente.", hBase("button", {className:"btn btn-ghost", disabled:true, title:PREC_771}, "← Question précédente"))
            : h("button", {className:"btn btn-ghost", "data-va":prec === 1 ? "c-corr-q2-apres" : "c-corr-q3-apres", title:PREC_771}, "← Question précédente"),
          reveler, suivant),
        !revele && pasLu.length > 0 && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 💡 Révéler » s'ouvre quand les " + pres + " présents ont lu la feuille de leur voisin. Il en manque " + pasLu.length + " :"),
          h("div", {className:"noms"}, pasLu.map(nomDe).join(" · "), InfoIB("Il en manque", "Le nom est celui dont la feuille n'est pas encore lue."))),
        lire.length > 0 && h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, x[0] + " — Q" + (x[1]+1) + " : " + x[2]); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, revele ? "📄 Leur feuille, d'après la lecture du voisin" : "📄 La lecture de leur feuille", InfoI(revele ? "Chaque moitié : la question d'après sa feuille, lue par le voisin. « ✓ Trouvée au dernier moment » (orange) : feuille fausse, tablette entièrement juste, une fois par évaluation. « ⚠️ À relire » : la lecture du voisin ne colle pas avec ce que l'élève a dit à la fin de son temps (« Oui » ou « Non »), ou il n'a rien dit." : "Chaque moitié : la feuille de cet élève est-elle déjà lue par son voisin ? Le voisin clique dans la moitié de l'élève.")),
        h("div", {className:"ss"}, revele ? ("Feuilles justes : " + nbF + " / " + pres + " · ✓ Trouvées au dernier moment : " + nbT) : ((pres - pasLu.length) + " / " + pres + " feuilles lues — " + pasLu.length + " pas encore")),
        GrilleTablettes(PAIRES, etatCorr3(qi)),
        Legende(revele ? LEG_CORR_AP : LEG_CORR_AV)))), true);
}
// la fenêtre de la fiche d'un élève pendant la correction, sur le pilotage du moment
function FondCorr(){ return PilotCorrection(); }
function ScAutonomie(){
  var k = MO(), au = SCN.autonomie("Hugo", k);
  return Fenetre(PilotCorrection(), "👤 FOUCHER Hugo", "Tablette 3, moitié de droite · avec ESNAULT Inès",
    h(F, null,
      h("p", null, au.retire ? h(F, null, h("strong", null, "⛔ Point d'autonomie retiré"), " " + au.quand + ". Ses deux compétences d'autonomie sont en Maîtrise insuffisante ; sa note ne bouge pas.")
        : "Il a son point d'autonomie : ses deux compétences d'autonomie sont en Très bonne maîtrise.")),
    au.retire ? [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-corr-q2-apres", title:"Ferme la fiche ; le point reste retiré."}, "✕ Fermer"), h("button", {key:2, className:"btn btn-vert", "data-va":"c-corr-q2-apres", title:"Rend son point d'autonomie à Hugo : ses deux compétences d'autonomie repassent en Très bonne maîtrise."}, "↩️ Rendre")]
      : [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-corr-q2-apres", title:"Ferme la fiche sans rien changer."}, "✕ Fermer"), h("button", {key:3, className:"btn btn-ghost", "data-va":"c-depart", title:"Marque Hugo comme parti : il ne bloque plus la classe, ses questions manquées sortent de son total."}, "🚫 Marquer comme parti"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-autonomie-garde", title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")],
    "c-corr-q2-apres");
}

// (complément 3) l'infobulle de la 7.7.1 reste sur le bouton ; un bouton fermé dit sa raison sur son enveloppe (complément 2)
var PREC_771 = "Revenir à la question précédente dans l'ordre de correction (utile si tu veux retraiter une question avec la classe).";
function fermeEnv(raison, bouton){ return hBase("span", {className:"ferme-env", title:raison}, bouton); }

/* ════════ La co-évaluation, côté console ════════ */
function PilotCoevalE(){
  var k = MO(), m = MOM(), c = SCN.compteurs(k), pres = c.presents;
  var tranche = !!m.tranche || SCN.rang(k) > SCN.rang("S08:coeval:T");
  var att = c.manquent || [];
  var co = Object.assign({}, SCN.CO); if(!att.length) Object.keys(co).forEach(function(p){ if(co[p] === "att") co[p] = "ok"; });
  var nOk = Object.keys(co).filter(function(p){ return co[p] === "ok"; }).length;
  var nPeut = Object.keys(co).filter(function(p){ return co[p].indexOf("peut") === 0; }).length, nMal = Object.keys(co).filter(function(p){ return co[p].indexOf("mal") === 0; }).length;
  var etat = function(p){
    var x = co[p], r;
    if(x === "att") r = {cls:"m-pasdit", st:"⏳ pas encore répondu"};
    else if(x === "ok") r = {cls:"m-juste", st:"✅ bien lu"};
    else if(x.indexOf("mal") === 0) r = tranche ? {cls:"m-juste", st:"❌ Q" + x.slice(3) + " · tranché"} : {cls:"m-faux m-co", st:"❌ mal lu Q" + x.slice(3), flag:"alerte : à trancher"};
    else r = {cls:"m-coq", st:"🤔 peut-être Q" + x.slice(4), flag:"à relire ce soir"};
    // (relecteur n°179) le point retiré ne cache pas l'alerte encore ouverte : la tuile dit les deux
    if(SCN.autonomie(p, k).retire) r.flag = r.flag === "alerte : à trancher" ? r.flag + " · " + FLAG_RETIRE : FLAG_RETIRE;
    r.va = "c-autonomie"; r.titre = "Clique sur le nom : « ⛔ Retirer le point d'autonomie », ou « 🚫 Marquer comme parti »."; return r;
  };
  var dec = paramHash("dec") || "michel", lire = lireSoir(tranche && dec === "soir" ? "S08:coeval" : k), nM = calc("Michel"), n0 = SCN.note("Michel", "S08:coeval");
  // (changement 5.10, relecteur n°175) ce que dit la phrase d'état : la décision prise, et la note qui en sort
  function decTexte(){
    if(dec === "julien") return ["✅ Alerte tranchée : raison donnée à Julien", "La lecture de Julien, Venise, est gardée : la question 1 de DUVERNAY Michel reste à 0 ; sa note provisoire reste à " + n0.n + " / " + n0.total + "."];
    if(dec === "soir") return ["📌 La question 1 de DUVERNAY Michel est à relire ce soir", "L'alerte se ferme : la question t'attend ce soir dans Résultats, « ⚠️ À relire » ; sa note provisoire reste à " + n0.n + " / " + n0.total + "."];
    var luV = luParam();
    if(dec === "feuille" && luV && !memesChoix(luV, EV.questions[0].bonnes)) return ["✅ Alerte tranchée : la feuille de Michel dit " + feuilleDit(EV.questions[0], luV, false), "La question 1 de DUVERNAY Michel reste à 0 ; sa note provisoire reste à " + n0.n + " / " + n0.total + "."];
    if(dec === "feuille") return ["✅ Alerte tranchée : la feuille de Michel dit Rome", "La question 1 de DUVERNAY Michel passe à 1 point, « Corrigé d'après ta feuille » dans son bilan : sa note provisoire passe à " + nM.n + " / " + nM.total + "."];
    return ["✅ Alerte tranchée : raison donnée à Michel", "La question 1 de DUVERNAY Michel passe à 1 point, « Corrigé d'après ta feuille » dans son bilan : sa note provisoire passe à " + nM.n + " / " + nM.total + "."];
  }
  return Console("pilotage", "pilot", h("div", {className:"card"},
    tranche ? h("div", {className:"alerte-co tranchee"}, h("div", {className:"al-corps"}, h("div", {className:"al-t"}, decTexte()[0]), h("div", {className:"al-l"}, decTexte()[1])),
      h("div", {className:"al-actions"}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-coeval-attente", title:"Rouvre l'alerte, telle qu'elle était : rien n'est appliqué."}, "↩️ Défaire")))
      : AlerteCoE(false),
    TitreCarte(h(F, null, "🤝 Co-évaluation de la lecture — " + EV.titre + " — " + CLASSE, InfoI("À la fin de la correction, chacun dit, dans sa moitié, s'il pense que son voisin a bien lu sa feuille. Un « ❌ » t'alerte aussitôt, en haut ; un « 🤔 » passe la question « ⚠️ À relire » ce soir. Le bilan s'affiche quand tous les présents ont répondu.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm", "data-va":"c-depart"}, "🚫 Départ d'un élève"), h("button", {key:5, className:"btn btn-ghost btn-sm", "data-va":"c-finir-autre-heure"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm", "data-va":"c-terminer"}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status correction"}, "Fin de la correction — chacun dit ce qu'il pense de la lecture de sa feuille · " + c.coeval[0] + " / " + c.coeval[1] + " ont répondu"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, !att.length && tranche
          ? h("button", {className:"btn btn-or", "data-va":"t-bilan", title:"Affiche sur chaque moitié le bilan de l'élève : sa note provisoire, question par question, ses compétences, son estimation."}, "🏁 Afficher leur bilan aux élèves")
          : h("button", {className:"btn btn-or ferme", disabled:true, title:att.length ? "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les " + pres + " présents ont répondu. Il en manque " + att.length + "." : "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand l'alerte est tranchée."}, "🔒 🏁 Afficher leur bilan aux élèves")),
        att.length > 0 && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 🏁 Afficher leur bilan aux élèves » s'ouvre quand les " + pres + " présents ont répondu. Il en manque " + att.length + " :"),
          h("div", {className:"noms"}, att.join(" · "))),
        h("div", {className:"co-compte"}, h("div", null, "✅ ", h("strong", null, String(nOk)), " pensent : bien lu"), h("div", null, "🤔 ", h("strong", null, String(nPeut)), " pensent : peut-être mal lu (à relire ce soir)"), h("div", null, "❌ ", h("strong", null, String(nMal)), tranche ? " pense : mal lu (tranché)" : " pense : mal lu (alerte, en haut)")),
        h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, x[0] + " — Q" + (x[1]+1) + " : " + x[2]); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, "🤝 Ce que chacun pense de la lecture de sa feuille", InfoI("Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin. Un clic sur un nom agit sur l'élève, par exemple « ⛔ Retirer le point d'autonomie ».")),
        GrilleTablettes(PAIRES, etat),
        Legende([["#22C55E","✅ bien lu"],["#FDE68A","🤔 peut-être mal lu : à relire ce soir"],["#EF4444","❌ mal lu : alerte"],["#FEE2E2","⏳ pas encore répondu","1px solid #EF4444"]])))), true);
}
function ScAutonomieGarde(qui, retour){
  var noms = qui || ["FOUCHER Hugo"];
  return Fenetre(retour === "c-coeval-attente" ? PilotCoevalE() : PilotCorrection(), "⛔ Retirer le point d'autonomie " + (noms.length > 1 ? "aux deux" : "à " + noms[0]) + " ?", noms.join(" et "),
    h(F, null,
      h("p", null, (noms.length > 1 ? "Leurs deux compétences d'autonomie passent" : "Ses deux compétences d'autonomie passent") + " en Maîtrise insuffisante, pour cette évaluation : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». La note ne bouge pas.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":retour || "c-autonomie", title:"Ne retire rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-va":retour === "c-coeval-attente" ? "c-coeval-retire-" + (noms.length > 1 ? "deux" : pre(noms[0]).toLowerCase()) : "c-autonomie-retiree", title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")], retour || "c-autonomie");
}

/* ════════ Le bilan de la classe, à la fin de l'heure ════════ */
function tauxQ(qi){ var k = MO(), ok = 0, n = 0; SCN.presents(k).forEach(function(p){ var x = calc(p).pts[qi]; if(x != null){ n++; ok += x; } }); return n ? Math.round(ok * 100 / n) : 0; }
function BilanClasse(){
  var k = MO(), pres = SCN.presents(k);
  var lignes = pres.map(function(p){ return {p:p, nom:nomDe(p), r:calc(p)}; });
  var total = lignes[0].r.total;
  var notes = lignes.filter(function(l){ return l.r.complet; }).map(function(l){ return l.r.n; }).sort(function(a, b){ return a - b; });
  var moy = notes.reduce(function(a, b){ return a + b; }, 0) / notes.length, med = notes[Math.floor(notes.length / 2)];
  var dist = {vert:0, bleu:0, orange:0, rouge:0};
  lignes.forEach(function(l){ if(l.r.complet) dist[maitriseDe(l.r.sur20).k]++; });
  lignes.sort(function(a, b){ return (b.r.complet ? b.r.n : -1) - (a.r.complet ? a.r.n : -1) || a.nom.localeCompare(b.nom, "fr"); });
  var cal = {ok:0, sous:0, sur:0, none:0}; pres.forEach(function(p){ var e = SCN.estimation(p, k); cal[e ? e.type : "none"]++; });
  var ret = retiresAu(k), gard = pres.length - ret.length;
  var taux = [0, 1, 2].map(tauxQ), rate = taux.indexOf(Math.min.apply(null, taux)), reussie = taux.indexOf(Math.max.apply(null, taux));
  var lire = lireSoir(k);
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "🏁 Bilan classe — " + EV.titre + " — " + CLASSE, InfoI("Les notes provisoires de la classe, d'après la lecture des feuilles à la correction. Elles deviennent définitives quand tu rends les copies, après ta lecture du soir.")), [h("button", {key:1, className:"btn btn-rouge btn-sm", "data-va":"c-terminer"}, "🛑 Terminer la séance")]),
    h("div", {className:"bilan-classe-synthese"},
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Moyenne"), h("div", {className:"bilan-classe-stat-num"}, fr1(moy) + " / " + total), h("div", {style:{opacity:.9}}, fr1(moy * 20 / total) + " / 20")),
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Médiane"), h("div", {className:"bilan-classe-stat-num"}, med + " / " + total)),
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Plage"), h("div", {className:"bilan-classe-stat-num"}, "de " + notes[0] + " à " + notes[notes.length - 1]))),
    h("div", {style:{display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:"1rem"}},
      h("div", null,
        h("h3", {style:{marginTop:".4rem"}}, "📊 Distribution", InfoI("Combien d'élèves dans chaque niveau de maîtrise de la note (Réglages : les tranches).")),
        h("div", {className:"bilan-classe-distrib"}, MAITRISE.map(function(mt){ return h("div", {key:mt.k, className:"bilan-classe-distrib-cell fourchette-" + mt.k}, h("strong", null, dist[mt.k]), h("span", null, mt.em + " " + mt.lib)); })),
        h("h3", null, "🧩 Par compétence", InfoI("Pour chaque compétence de l'évaluation : combien d'élèves dans chaque niveau, sur ses questions.")),
        COMPS.map(function(cp){
          var d = {vert:0, bleu:0, orange:0, rouge:0};
          lignes.forEach(function(l){ d[niveauComp(l.r, cp).k]++; });
          return h("div", {key:cp, className:"par-comp"},
            // (relecteur n°216) le libellé entier, sans le code, qui reste au survol
            h("div", {className:"pc-t", title:"La compétence " + cp + " du référentiel : " + LIB_OFF[cp] + "."}, LIB_OFF[cp] + " · " + compQuestions(cp).map(function(i){ return "Q" + (i+1); }).join(", ")),
            h("div", {className:"bilan-classe-distrib pc-d"}, MAITRISE.map(function(mt){ return h("div", {key:mt.k, className:"bilan-classe-distrib-cell fourchette-" + mt.k}, h("strong", null, d[mt.k]), h("span", null, mt.em + " " + mt.lib)); })));
        }),
        h("div", {className:"par-comp"}, h("div", {className:"pc-t"}, "🤝 Le point d'autonomie · Être autonome et responsable · S'impliquer dans les activités en classe et dans son travail personnel"),
          h("div", {className:"pc-auto"}, gard + " / " + pres.length + " l'ont gardé : Très bonne maîtrise · " + ret.length + " retiré" + (ret.length > 1 ? "s" : "") + (ret.length ? " (" + ret.map(nomDe).join(", ") + ") : Maîtrise insuffisante" : ""))),
        h("h3", null, "🎯 Calibration de l'autoévaluation", InfoI("L'estimation de chacun comparée à sa note : bien évalué, sous-évalué, sur-évalué.")),
        h("div", {className:"bilan-classe-calib"},
          h("div", {className:"bilan-classe-calib-cell calib-ok"}, h("strong", null, cal.ok), h("span", null, "✅ Bien évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-sous"}, h("strong", null, cal.sous), h("span", null, "🌟 Sous-évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-sur"}, h("strong", null, cal.sur), h("span", null, "⚠️ Sur-évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-none"}, h("strong", null, cal.none), h("span", null, "— Pas d'autoeval"))),
        h("h3", null, "💡 Questions remarquables", InfoI("La question la plus ratée et la mieux réussie, d'après la feuille : à reprendre en classe.")),
        h("div", {className:"bilan-classe-insights"},
          h("div", {className:"bilan-classe-insight insight-attention"}, h("div", {className:"bilan-classe-insight-titre"}, "🔴 La plus ratée — Q" + (rate + 1) + " (" + taux[rate] + " % de réussite)"), h("div", {className:"bilan-classe-insight-enonce"}, EV.questions[rate].enonce)),
          h("div", {className:"bilan-classe-insight insight-felicitations"}, h("div", {className:"bilan-classe-insight-titre"}, "🟢 La mieux réussie — Q" + (reussie + 1) + " (" + taux[reussie] + " % de réussite)"), h("div", {className:"bilan-classe-insight-enonce"}, EV.questions[reussie].enonce)))),
      h("div", null,
        h("div", {className:"alire", style:{marginTop:".4rem"}}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, x[0] + " — Q" + (x[1]+1) + " : " + x[2]); })))),
    h("h3", null, "👥 Détail par élève (trié par note)", InfoI("Chaque élève, sa note provisoire et ses niveaux par compétence. Le ✓ orange : Trouvée au dernier moment.")),
    h("div", {className:"bilan-classe-table-wrap"}, h("table", {className:"bilan-classe-table"},
      h("thead", null, h("tr", null, ["Élève", "Note", "Sur 20", "Maîtrise de la note"].map(function(t){ return h("th", {key:t}, t); }), COMPS.map(EnteteComp), h("th", null, "🤝 Autonomie"))),
      h("tbody", null, lignes.map(function(l){ var mt = maitriseDe(l.r.sur20), au = SCN.autonomie(l.p, k);
        return h("tr", {key:l.p}, h("td", null, l.nom), h("td", null, l.r.n + " / " + l.r.total), h("td", null, fr1(l.r.sur20)),
          h("td", null, h("span", {className:"maitrise-pill " + mt.cls}, mt.em + " " + mt.lib)),
          COMPS.map(function(cp){ return h("td", {key:cp}, PillComp(l.r, cp)); }),
          h("td", null, au.retire ? h("span", {className:"maitrise-pill mt-rouge"}, "⛔ retiré " + au.quand) : h("span", {className:"maitrise-pill mt-vert"}, "🟢 Très bonne maîtrise"))); }))))), true);
}

/* ════════ Le bilan de l'élève, sur sa moitié (442, 456, 474, 484, 639) ════════ */
function EcrBilan(e, opts){
  opts = opts || {};
  var k = MO(), r = calc(e.prenom), st = r.st, pts = r.pts.map(function(x){ return x || 0; });
  var an = (r.annulees || [])[0] == null ? -1 : r.annulees[0], tot = r.total, n = r.n, sur20 = r.sur20, mt = maitriseDe(sur20);
  var es = SCN.estimation(e.prenom, k);
  var est = SCN.ESTIM[e.prenom];
  var calib = null;
  if(es){
    var nE = FOURCH.filter(function(f){ return f.k === est; })[0].n, emE = MAITRISE.filter(function(x){ return x.k === est; })[0].em;
    calib = es.type === "ok" ? {type:"ok", msg:"✅ Tu te connais bien !", detail:"Tu pensais avoir " + libFourchette(nE).replace(" sur 3", "") + " " + emE + " et tu en as effectivement obtenu " + n + " sur " + tot + ". Ton estimation correspond à ton vrai résultat."}
      : es.type === "sur" ? {type:"sur", msg:"⚠️ Tu pensais avoir mieux fait", detail:"Tu pensais avoir " + libFourchette(nE).replace(" sur 3", "") + " " + emE + " mais tu en as eu " + n + " sur " + tot + " (" + libFourchette(n).replace(" sur 3", "") + " " + mt.em + ").", degre:degreSurestime(es.ecart)}
      : {type:"sous", msg:"🌟 Tu te sous-estimais !", detail:""};
  }
  var corrigees = r.corrigees || [];
  var compQ = function(cp){ return compQuestions(cp).filter(function(i){ return i !== an; }).map(function(i, j){ return h(F, {key:i}, j ? " · " : "", "Q" + (i+1) + " ", st[i] === "t" ? h("span", {className:"v-orange"}, "✓") : st[i] === "j" ? "✓" : "✗"); }); };
  var autoOk = !SCN.autonomie(e.prenom, k).retire;
  return Page(badgeDe(e), "🎯 Bilan personnel", h("div", {className:"bilan-c"},
    // la version imprimable de son bilan s'ouvre à part, pour l'élève de cette moitié (l'infobulle de la 7.7.1 : « Ouvre une version imprimable… »)
    !opts.imprime && h("button", {className:"bilan-export-btn", "data-local":"1", onClick:function(){ window.open(location.pathname + "#scene=t-bilan-imprime&m=" + encodeURIComponent(MO()) + "&eleve=" + encodeURIComponent(e.prenom), "bilan-" + e.prenom); }}, "📄 Imprimer / Exporter mon bilan"),
    // (relecteur n°204) le bilan imprimé dit de quelle évaluation il s'agit, et sa date : deux données
    opts.imprime && h("div", {className:"bilan-imprime-eval"}, h("span", null, EV.titre), " · ", h("span", null, SCN.seance(MOM().seance || "S08").date)),
    h("div", {className:"bilan-score fourchette-" + mt.k},
      h("div", {className:"bilan-score-emoji"}, mt.em),
      h("div", {className:"bilan-score-num"}, "Ta note provisoire : " + n + " / " + tot),
      h("div", {className:"note20"}, fr1(sur20) + " / 20"),
      h("div", {className:"bilan-score-pct"}, mt.lib)),
    h("p", {className:"bilan-provisoire"}, "Elle peut encore changer, jusqu'à ce que ta copie te soit rendue : ta feuille, tes clics pendant les questions et tes clics à la correction sont comparés. Quelle que soit ta correction, c'est ce que tu as écrit lors de l'évaluation qui correspondra à ta note définitive."),
    h("div", {className:"bilan-bloc"}, h("h3", null, "Question par question"),
      h("div", {className:"recap"}, EV.questions.map(function(q, i){
        var s = st[i];
        if(i === an) return h("div", {key:i, className:"recap-l annulee"}, h("span", null, "Question " + (i+1) + " · annulée : elle ne compte pas."));
        return h("div", {key:i, className:"recap-l " + (s === "j" || s === "t" ? "j" : "f")},
          h("span", null, "Question " + (i+1) + " · ",
            s === "t" ? h(F, null, h("span", {className:"v-orange"}, "✓"), " Trouvée au dernier moment") : s === "a" ? "ta feuille ne dit aucun de ces choix" : s === "j" ? "juste" : "faux",
            corrigees.indexOf(i) >= 0 && h("span", {className:"corrige"}, "Corrigé d'après ta feuille."),
            h("span", {className:"recap-comp"}, q.competences.map(function(cp){ return LIB_ELEVE[cp]; }).join(" · "))),
          h("span", {className:"pt"}, "→ " + pts[i] + " point"));
      }))),
    h("div", {className:"bilan-bloc"}, h("h3", null, "Tes compétences"),
      COMPS.map(function(cp){
        var x = r.comp[cp] || {n:0, max:0}, mm = maitriseDe(x.max ? x.n * 20 / x.max : 0);
        return h("div", {key:cp, className:"comp-l"},
          h("span", null, LIB_ELEVE[cp], h("span", {className:"comp-q"}, compQ(cp), " → " + x.n + "/" + x.max)),
          h("span", {className:"mt"}, mm.em + " ", mm.lib));
      }),
      AUTO.map(function(l){ return h("div", {key:l, className:"comp-l"}, h("span", null, l), h("span", {className:"mt"}, autoOk ? "✅ " : "❌ ", autoOk ? "atteinte" : "non atteinte")); })),
    calib && h("div", {className:"bilan-calibration bilan-calib-" + calib.type},
      h("h3", null, "🎯 Ton estimation"),
      h("div", {className:"bilan-calib-msg"}, calib.msg),
      an < 0 && h("div", {className:"bilan-calib-detail"}, calib.detail, calib.degre && " ", calib.degre))));
}

// le bilan imprimable de l'élève demandé (« &eleve= »)
function BilanImprime(){ var p = paramHash("eleve"), e = p ? (p === "Julien" ? J : p === "Michel" ? M : eleveObjet(nomDe(p))) : J; return h("div", {className:"bilan-imprime"}, h("div", {className:"bilan-imprime-page"}, EcrBilan(e, {imprime:true}))); }

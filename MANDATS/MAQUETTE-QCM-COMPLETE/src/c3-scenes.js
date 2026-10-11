/* ═══════════════ Complément 3 — chaque scène, rendue au moment que le scénario lui donne ═══════════════
   Les fenêtres posées sur le pilotage le prennent au même moment ; les chronos, les comptes, les dates et les noms
   viennent du scénario. Aucune scène n'écrit un chiffre à la main. */

// les états du pilotage des couches précédentes : désormais, le pilotage au moment de la scène
function ST_Q1T1(){ return etatPilot(); }
function ST_Q1CL(){ return etatPilot(); }
function ST_Q2CL(){ return etatPilot(); }
var DUREE_TXT = texteDuree(SCN.EV_ESSAI);
function phaseTexte(m){ return m.ph === "reflexion" ? "réflexion" : m.ph === "reponse" || m.ph === "b" || m.ph === "passage" ? "réponse" : m.ph === "close" ? "question close" : m.ph; }
function ouEnEst(m){ return m.qi == null ? "avant la question 1" : "question " + (m.qi + 1) + (m.tour ? ", " + (m.tour === 1 ? "1er" : "2e") + " tour" : ""); }

/* ── Les fenêtres du pilotage ── */
// « ❌ Écarter » : la garde de la question cliquée (« &q= »), en une phrase ; le reste est dans l'infobulle du bouton
function ScEcarter(){
  var qi = (+paramHash("q") || 3) - 1, q = EV.questions[qi], comps = q.competences || [];
  var restent = comps.map(function(c){ return EV.questions.filter(function(x, i){ return i !== qi && (x.competences || []).indexOf(c) >= 0; }).length; });
  return Fenetre(Pilot(etatPilot()), "❌ Écarter la question " + (qi + 1) + " ?", q.enonce,
    h(F, null,
      h("p", null, "Elle ne sera ni posée ni corrigée, et sort du total de la note et des compétences."),
      restent.some(function(n){ return n < 3; }) && h("p", {className:"fen-alerte"}, "⚠️ " + (comps.length > 1 ? "Les compétences " + listeFr(comps) + " ne seront plus évaluées" : "La compétence " + comps[0] + " ne sera plus évaluée") + " que par " + Math.min.apply(null, restent) + " questions : il en faut 3 pour que les quatre niveaux soient possibles."),
      q.bonus && h("p", null, "C'est une question bonus : l'écarter ne change rien à la note.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-close"}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-ecartee"}, "❌ Écarter la question " + (qi + 1))], "c-q1-close");
}
function ScEcartee(){
  var st = etatPilot(); st.remettre = "c-q1-close";
  st.alerteComp = "⚠️ c4-culture-01 et c4-lire-01 ne sont plus évaluées que par 2 questions : leurs niveaux seront moins fins (il en faut 3).";
  return Pilot(st);
}
function ScAnnulee(){ var st = etatPilot(); st.remettre = "c-q2-close"; return Pilot(st); }
function ScFinPrevue(){ return Pilot(etatPilot()); }
function ScParti(){ return Pilot(etatPilot()); }
function ScDepart(){
  var noms = SCN.presents(MO()).map(nomDe).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  return Fenetre(Pilot(etatPilot()), "🚫 Départ d'un élève", "Qui part en cours de séance ? (infirmerie, tablette en panne…)",
    h(F, null, h("div", {className:"depart-grille"}, noms.map(function(n){ return h("div", {key:n, className:"depart-l"}, h("span", null, n), h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-parti"}, "🚫 Parti")); }))),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1"}, "Annuler")], "c-q1-tour1", 760);
}
function ScRetour(){
  var m = MOM(), partis = m.partis || {};
  return Fenetre(Pilot(etatPilot()), "↩️ Retour d'un élève", "Les élèves partis pendant cette séance",
    Object.keys(partis).map(function(p){ var t = SCN.tabletteDe(p);
      return h("div", {key:p, className:"depart-l"}, h("span", null, nomDe(p) + " — parti à " + partis[p] + " · tablette " + t.n + ", avec " + nomDe(SCN.voisinDe(p))), h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-q1-tour1"}, "↩️ Revenu")); }),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-parti"}, "Annuler")], "c-parti");
}
function ScTerminer(){
  var m = MOM();
  return Fenetre(Pilot(etatPilot()), "🛑 Terminer la séance ?", CLASSE + " — " + EV.titre + " · " + ouEnEst(m),
    h(F, null, h("p", null, "La séance est close, et l'archive s'écrit avec les notes telles qu'elles sont, quelle que soit la phase."),
      h("p", null, "Les tablettes oublient leurs élèves et reviennent à « Combien êtes-vous sur cette tablette ? ».")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1"}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"t-fin"}, "🛑 Terminer la séance")], "c-q1-tour1");
}
function ScVoirTablette(){
  var m = MOM(), n = 1, pa = PAIRES[n - 1];
  return Fenetre(Pilot(etatPilot()), "📱 Tablette " + n + " · " + pa[0] + " · " + pa[1] + " — en direct", "Ce que montrent ses deux moitiés, maintenant : " + ouEnEst(m) + ".",
    h("div", {className:"voir-tab"}, h("div", {className:"voir-tab-in"}, tabletteDuMoment())),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1"}, "✕ Fermer")], "c-q1-tour1", 900);
}
function ScDeplacer(){
  var st = etatPilot(), m = MOM(), base = st.etat, d = m.deplaces || [];
  var tA = SCN.tabletteDe(d[0]), tB = SCN.tabletteDe(d[1]);
  st.paires = PAIRES.map(function(x){ return x.map(function(n){ return n === nomDe(d[0]) ? nomDe(d[1]) : n === nomDe(d[1]) ? nomDe(d[0]) : n; }); });
  st.etat = function(p, c){ return p === d[1] ? {cls:"m-deplace", st:"↔️ va sur la tablette " + tA.n + " : retape son code"} : p === d[0] ? {cls:"m-deplace", st:"↔️ va sur la tablette " + tB.n + " : retape son code"} : base(p, c); };
  st.sousTitre = nomDe(d[0]) + " et " + nomDe(d[1]) + " échangés : leurs réponses déjà données les suivent";
  return Pilot(st);
}
function SessionsEnCours(){
  var m = MOM();
  var menu = h("div", {className:"sessions-menu-overlay", "data-echap":"c-q1-tour1"},
    h("div", {className:"sessions-menu"},
      h("div", {className:"sessions-menu-header"}, h("h3", null, "🔴 Séances actuellement en cours"), h("button", {className:"sessions-menu-close", "data-va":"c-q1-tour1", title:"Ferme la liste ; rien ne change."}, "✕")),
      h("p", {className:"sessions-menu-intro"}, "Voici toutes les séances qui sont actuellement actives quelque part. Tu peux aller au pilotage de chacune ou la terminer si elle n'a plus de raison d'être active."),
      h("div", {className:"sessions-menu-liste"},
        h("div", {className:"session-menu-row"},
          h("div", {className:"session-menu-info"}, h("div", {className:"session-menu-nom"}, CLASSE),
            h("div", {className:"session-menu-meta"}, "Phase : ", h("strong", null, phaseTexte(m)), " · Q " + (m.qi + 1) + (m.tour ? " · " + (m.tour === 1 ? "1er" : "2e") + " tour" : "") + " · fin de l'heure " + SCN.finHeure(MO()))),
          h("div", {className:"session-menu-actions"},
            h("button", {className:"btn btn-sm btn-primary", "data-va":"c-q1-tour1", title:"Ouvre le pilotage de cette séance, là où elle en est."}, "🎯 Aller au pilotage"),
            h("button", {className:"btn btn-sm btn-rouge", "data-va":"c-terminer", title:"Termine cette séance, après une confirmation : l'archive s'écrit avec les notes telles qu'elles sont."}, "🛑 Terminer"))))));
  return h(F, null, Pilot(etatPilot()), menu);
}
function ScFinirAutreHeure(){
  var m = MOM(), lendemain = SCN.moment("S08:finir");
  return Fenetre(Pilot(etatPilot()), "⏸️ Finir à une autre heure ?", CLASSE + " — " + EV.titre + " · " + ouEnEst(m),
    h(F, null,
      h("p", null, "La séance garde son état exact : la question, le tour, les lectures, les notes provisoires."),
      h("p", null, "À l'heure suivante, « 🎯 Pilotage classe » propose « ▶️ Reprendre la séance du " + jjmm(SCN.seance(m.seance).date) + " — " + ouEnEst(m) + " ».")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1", title:"Ne change rien : la séance continue."}, "Annuler"), h("button", {key:2, className:"btn btn-or", "data-va":"c-reprendre", title:"Met la séance en pause, telle qu'elle est, jusqu'à une heure suivante."}, "⏸️ Finir à une autre heure")], "c-q1-tour1");
}
function ScRouvrirSeance(){
  var k = MO(), se = SCN.qcmPrecedent(k), ev = evalDeSeance(se), rendue = SCN.rendueAu(se.id, k);
  return Fenetre(Lancement(false), "🔓 Rouvrir la séance du " + jjmm(se.date) + " ?", ev.titre,
    rendue ? h("p", null, "Ses copies, rendues le " + jjmm(se.rendues) + ", seront masquées aux élèves jusqu'au prochain « Rendre les copies ».") : null,
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-lancer", title:"Ne rouvre rien."}, "Annuler"), h("button", {key:2, className:"btn btn-primary", "data-va":"c-appel", title:"Rouvre la séance : l'appel, les mêmes binômes, puis elle reprend là où elle s'était terminée."}, "🔓 Rouvrir la séance")], "c-lancer");
}
function Interrompue(){
  var k = MO(), m = MOM(), se = SCN.seance(m.seance), c = SCN.compteurs(k), cote = PREMIER[m.qi] === "J" ? "gauche" : "droite";
  var modal = h("div", {className:"checkin-overlay", "data-echap":"c-lancer"},
    h("div", {className:"checkin-modal", style:{maxWidth:"620px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "⚠️ Séance interrompue détectée", InfoI("La console a perdu la séance en cours (page fermée, panne). Elle se reprend là où elle était, ou se termine.")), h("div", {className:"checkin-sub"}, CLASSE + " — " + EV.titre)),
      h("div", {style:{padding:"1rem 1.2rem", fontSize:".9rem", color:"var(--noir)"}},
        h("div", {style:{marginBottom:".4rem"}}, "📅 Démarrée le " + se.date + " à " + se.heure),
        h("div", {style:{marginBottom:".4rem"}}, "🔌 Dernière déconnexion : " + m.date + " à " + m.deconnexion),
        h("div", {style:{marginBottom:".8rem"}}, "📝 État : question " + (m.qi + 1) + ", " + (m.tour === 1 ? "1er" : "2e") + " tour (moitiés de " + cote + ") ; " + c.reponses + " réponses enregistrées")),
      h("div", {className:"checkin-actions"},
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-terminer", title:"Clôt la séance, après une confirmation : l'archive s'écrit avec les notes telles qu'elles sont."}, "🛑 Terminer définitivement"),
        h("button", {className:"btn btn-ghost", "data-va":"c-reprendre", title:"Met la séance en pause, telle qu'elle est, pour la reprendre à une heure suivante."}, "⏸️ Finir à une autre heure"),
        h("button", {className:"btn btn-primary", "data-va":"c-q2-tour2", title:"Reprend tout de suite : le tour en cours recommence au début, voile compris."}, "🔄 Reprendre la séance"))));
  return h(F, null, Lancement(false), modal);
}

/* ── L'élève seul (rattrapage), le papier ── */
function EcrLectureSeul(){
  var m = MOM(), qi = m.qi, q = EV.questions[qi], ordre = ORD[qi].J, adam = {cle:"A", nom:"YVON Adam", prenom:"Adam", sexe:"M"}, sel = SCN.choixDe(SCN.feuilleVraie("Adam" in SCN.RT ? "Adam" : "Julien")[qi], qi);
  return Page(badgeDe(adam), "📝 Correction", h("div", {className:"seul-c"},
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    Compteur(EV.questions.map(function(x, i){ return {cls:"vide", t:String(i+1)}; }), 0),
    h("div", {className:"eleve-q-zone"}, QHead(qi, true), h("div", {className:"eleve-q-enonce"}, q.enonce),
      h("div", {className:"decl-titre"}, "Qu'as-tu écrit sur ta feuille ?"),
      h("div", {className:"decl-consigne"}, "Clique sur le ou les choix qui disent la même chose que ta feuille. Les mots ne sont pas forcément les mêmes : c'est à toi de faire le rapprochement."),
      ChronoSaisie(m.reste, tempsDe(qi).reponse),
      h("div", {className:"eleve-choix"},
        ordre.map(function(i){ return h("button", {key:i, className:"eleve-choix-btn" + (q.bonnes.indexOf(i) >= 0 ? " selected" : "")}, h("span", null, q.choix[i])); }),
        h("button", {className:"eleve-choix-btn aucun"}, "Ma feuille ne dit aucun de ces choix")),
      h("div", {className:"eleve-feedback valide"}, "✅ Réponse enregistrée — tu peux encore la changer"),
      EcouteProf())));
}
function PapierSeance(){
  var k = MO(), se = SCN.seance("PAP");
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📄 Séance sur papier — " + EV.titre + " — " + CLASSE, InfoI("Sur papier, chacun répond seul sur sa feuille, avec les énoncés imprimés, sans tablette. Tu ramasses les feuilles ; la séance se met en pause sans être finie. Le soir, tu remplis la grille ; à l'heure suivante, l'estimation, la seconde attestation et la correction se font sur les tablettes.")),
      [h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status reflexion"}, "📄 Séance sur papier en cours — " + presentsTexte(se), InfoIB("📄 Séance sur papier en cours", "Les élèves ont les énoncés seuls, sans les choix, et répondent sur leur feuille, seuls.")),
    h("div", {className:"papier-grid"},
      h("div", null,
        h("div", {className:"row"},
          h("button", {className:"btn btn-ghost", "data-va":"e-papier-enonces", title:"Montre la page des énoncés seuls, avec les points de chaque question, à imprimer pour la classe."}, "🖨️ Les énoncés à imprimer"),
          h("button", {className:"btn btn-or", "data-va":"c-papier-grille", title:"Tu as ramassé les feuilles : la séance se met en pause sans être finie. Le soir, tu remplis la grille d'après les feuilles."}, "⏸️ Feuilles ramassées : finir à une autre heure"))),
      h("div", {className:"pilot-overview"}, h("h3", null, "📋 Toutes les questions", InfoI("Les questions de l'évaluation, avec leurs bonnes réponses : sur papier, elles ne se posent pas une à une.")),
        EV.questions.map(function(q, qi){ return h("div", {key:qi, className:"pilot-q-mini"}, h("div", {className:"pilot-q-mini-head"}, h("span", {className:"pilot-q-mini-num"}, "Q" + (qi+1)), h("span", {className:"pilot-q-mini-niv niv-" + q.niveau}, NIV[q.niveau].label)), h("div", {className:"pilot-q-mini-enonce"}, q.enonce), h("div", {className:"pilot-q-mini-bonnes"}, ChoixTexte(q))); })))), true);
}
function PapierEnonces(){
  var se = SCN.seance("PAP");
  return h("div", {className:"bilan-imprime"}, h("div", {className:"bilan-imprime-page enonces-p"},
    h("h2", null, EV.titre), h("div", {className:"enonces-classe"}, CLASSE + " · " + se.date),
    EV.questions.map(function(q, i){ return h("div", {key:i, className:"enonce-p"}, h("strong", null, "Question " + (i+1) + " · 1 pt"), h("div", null, q.enonce)); })));
}
function GrillePapier(){   // un élève par ligne, une question par case, un clic pour ✓ ou ✗ (467) : la grille, d'après les feuilles
  var k = MO(), eleves = SCN.presents(k).map(nomDe).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  var init = {}; eleves.forEach(function(n){ var p = pre(n); init[p] = calc(p).st.map(function(c){ return c === "j" ? "j" : "f"; }); });
  var s = useState(init), g = s[0], setG = s[1];
  function basculer(p, i){ var o = Object.assign({}, g); o[p] = g[p].slice(); o[p][i] = g[p][i] === "j" ? "f" : "j"; setG(o); }
  return h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet papier-grille"},
    h("thead", null, h("tr", null, h("th", {className:"eleve-col"}, "Élève"), EV.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i+1)); }), h("th", null, "Note"), h("th", null, "Sur 20"))),
    h("tbody", null, eleves.map(function(n){
      var p = pre(n), l = g[p], note = l.filter(function(x){ return x === "j"; }).length;
      return h("tr", {key:n, "data-eleve":p}, h("td", {className:"eleve-cell"}, n),
        l.map(function(x, i){ return h("td", {key:i, className:x === "j" ? "cell-juste" : "cell-faux"}, h("button", {className:"case-grille", "data-local":"1", title:"La feuille " + deNom(p) + ", question " + (i+1) + " : un clic bascule entre ✓ (juste) et ✗ (faux).", onClick:function(){ basculer(p, i); }}, x === "j" ? "✓" : "✗")); }),
        h("td", {className:"score-cell"}, note + "/3"), h("td", {className:"score-cell"}, fr1(note * 20 / 3)));
    }))));
}
function PapierGrille(){
  var se = SCN.seance("PAP");
  return Console("donnees", "results", h("div", {className:"card"},
    TitreCarte("📄 " + EV.titre + " — " + CLASSE + " — sur papier", [
      h("button", {key:0, className:"btn btn-primary btn-sm", "data-va":"c-papier-reprendre", title:"Ta grille est remplie : la séance se reprend à l'heure suivante, pour la correction sur les tablettes."}, "💾 Grille remplie"),
      h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":"c-seances", title:"Revient à la liste des séances ; la grille est gardée telle quelle."}, "← Retour")]),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, se.date + " " + se.heure + " · sur papier · " + presentsTexte(se)),
    h(GrillePapier)), false);
}
function PilotCorrPapier(){
  var k = MO(), m = MOM(), qi = m.qi, q = EV.questions[qi];
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📝 Correction sur papier — " + EV.titre + " — " + CLASSE, InfoI("Sur papier, il n'y a pas de lecture du voisin : chaque moitié montre ce que ta grille a retenu de la feuille, puis la réponse quand tu révèles. Jamais « Trouvée au dernier moment ». Le point d'autonomie se retire d'un clic sur le nom.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status correction"}, "Question " + (SCN.ORDRE_CORR.indexOf(qi) + 1) + " / 3 — Q" + (qi + 1), InfoIB("Question " + (SCN.ORDRE_CORR.indexOf(qi) + 1) + " / 3", "Toutes les corrections se font à la suite, dans l'ordre des erreurs de ta grille.")),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"pilot-q-current"}, h("div", {className:"num"}, "Question " + (qi + 1)), h("div", {className:"enonce"}, q.enonce),
          h("div", {className:"pilot-q-bonne"}, h("span", {style:{fontWeight:900}}, "✓ Bonne" + (q.bonnes.length > 1 ? "s" : "") + " réponse" + (q.bonnes.length > 1 ? "s" : "") + " : "), q.bonnes.map(function(i){ return q.choix[i]; }).join("  /  "))),
        h("div", {className:"row", style:{marginTop:".8rem"}},
          h("button", {className:"btn btn-ghost", disabled:true, title:"C'est la première question de la correction : il n'y a pas de question précédente."}, "← Question précédente"),
          h("button", {className:"btn btn-or", "data-va":"t-papier-correction", title:"Sur papier, « Révéler » s'ouvre tout de suite : il n'y a pas de lecture du voisin."}, "💡 Révéler"),
          h("button", {className:"btn btn-primary", disabled:true, title:"S'ouvre quand cette question est révélée."}, "Question suivante →"))),
      h("div", {className:"suivi-box"}, h("h3", null, "📄 D'après ta grille", InfoI("Chaque moitié : la question d'après ta grille du soir. Un clic sur un nom agit sur l'élève.")),
        GrilleTablettes(PAIRES, function(p){ var s = calc(p).st[qi]; return {cls:s === "j" ? "m-juste" : "m-faux", st:s === "j" ? "✓ 1 pt" : "✗ 0", va:"c-autonomie", titre:"Clique sur le nom : « ⛔ Retirer le point d'autonomie »."}; }),
        Legende([["#22C55E","✓ juste d'après ta grille"],["#EF4444","✗ faux d'après ta grille"]])))), true);
}
function Rattrapage(){
  var k = MO(), se = SCN.seance("S08"), seuls = SCN.seance("RATT").eleves;
  var carte = h("div", {className:"card"},
    h("h2", null, "🎯 Lancer une nouvelle séance", InfoI("Un rattrapage se lance comme une séance : la classe, la même évaluation ; seuls ceux qui ne sont pas encore notés la passent.")),
    h("div", {className:"lancer-grid"},
      h("div", null,
        h("div", {className:"field"}, h("label", null, "Classe", InfoI("Les classes de la console MJPC.")), h("select", {value:"c", readOnly:true, title:"La classe de la séance."}, h("option", {value:"c"}, CLASSE + " (25 élèves)"))),
        h("div", {className:"field"}, h("label", null, "Évaluation", InfoI("L'évaluation déjà passée par la classe : « 🔁 » la marque comme rattrapage.")), h("select", {value:"e", readOnly:true, title:"L'évaluation de la séance."}, h("option", {value:"e"}, "🔁 " + EV.titre))),
        h("div", {className:"rattrapage-box"}, h("strong", null, "🔁 Rattrapage."), " " + CLASSE + " a déjà passé cette évaluation le " + jjmm(se.date) + ".", InfoIB("🔁 Rattrapage", "Cette séance ne servira jamais de « QCM précédent » pour les binômes. Un élève déjà noté garde la note de sa première séance.")),
        h("div", {className:"duree-box"}, texteDuree(EV, true)),
        h("button", {className:"btn btn-primary", "data-va":"c-appel", title:"Ouvre l'appel du rattrapage : seuls les élèves pas encore notés sont proposés."}, "🚀 Lancer le rattrapage")),
      h("div", {className:"binomes-box"},
        h("div", {className:"tt"}, "📱 Binômes proposés — d'après les exclusions, puis le QCM précédent", InfoI("Comme pour une séance : d'abord les exclusions de MJPC, puis la règle du QCM. Plus de placement libre.")),
        h("div", {className:"ss"}, "Pas encore noté à cette évaluation : " + seuls.join(", ") + " (absent le " + jjmm(se.date) + ").", InfoIB(seuls[0], "Seul, il fait lui-même la lecture de sa feuille à la correction ; il n'a pas de co-évaluation.")),
        h(GrilleBinomes, {paires:seuls.map(function(n){ return [n, null]; })}))));
  return Console("pilotage", "pilot", h(F, null, carte, SessionsPrecedentes()), false);
}
/* ── Réglages : les durées de la séance, celles du scénario ── */
function DureesSeance(){
  var D = SCN.DUREES;
  var lignes = [["Installation et consignes", D.installation / 60, "min"], ["Estimation et seconde attestation", D.estimAttest / 60, "min"], ["Correction, par question", D.correctionParQ / 60, "min"], ["Co-évaluation et bilan", D.coevalBilan / 60, "min"], ["Passage de la tablette, avant chaque tour", D.decompte, "s"], ["« Ta feuille dit-elle la même chose que ton clic ? »", D.b, "s"], ["Entre deux questions", D.entre, "s"]];
  return h("div", {className:"reg-grille"}, lignes.map(function(l, i){ return h("label", {key:i, className:"reg-l"}, h("span", null, l[0]), h("input", {type:"number", defaultValue:l[1], min:0, title:"Tape la durée ; elle vaut pour toutes les séances à venir."}), h("span", null, l[2])); }),
    h(BoutonLocal, {cls:"btn btn-primary btn-sm", txt:"💾 Enregistrer", titre:"Enregistre les durées : elles valent pour le prompt, la garde au collage et au lancement, et la fin prévue.", fait:"✅ Enregistré"}));
}
function jetonDurees(){
  var D = SCN.DUREES;
  return "Pour chaque question : la réflexion, puis deux tours, chacun fait de " + D.decompte + " secondes de décompte, du temps de réponse et de " + D.b + " secondes où l'élève dit si sa feuille dit la même chose que son clic ; puis " + D.entre + " secondes avant la question suivante.\nPour la séance : " + D.installation / 60 + " minutes d'installation et de consignes, " + D.estimAttest / 60 + " minutes pour l'estimation et la seconde attestation, " + D.correctionParQ / 60 + " minute de correction par question, " + D.coevalBilan / 60 + " minutes pour la co-évaluation et le bilan.";
}
function promptRempli(){
  var comps = CHAPITRE_3E.majeures.map(function(c){ return [c, "majeure"]; }).concat(CHAPITRE_3E.mineures.map(function(c){ return [c, "mineure"]; }));
  var jetons = {
    CHAPITRE: CHAPITRE_PROMPT.libelle + " (identifiant : " + CHAPITRE_PROMPT.id + ")",
    COMPETENCES_CHAPITRE: comps.map(function(x){ return "- " + x[0] + " (" + x[1] + ") : " + libelleOfficiel(x[0]) + " — pour l'élève : " + LIBELLES_ELEVE[x[0]]; }).join("\n"),
    NIVEAUX: ["facile", "standard", "approfondi", "expert"].map(function(k){ return "- \"" + k + "\" (" + NIV[k].label + ")"; }).join("\n"),
    DUREES: jetonDurees(),
    LIMITES: LIMITES_TEXTE
  };
  return PROMPT_TEXTE.replace(/\{\{([A-Z_]+)\}\}/g, function(t, k){ return jetons[k] != null ? jetons[k] : t; });
}

/* ════════ Les scènes ════════ */
["c-q1-reflexion", "c-q1-tour1", "c-q1-tour2", "c-q1-close", "c-q2-tour2", "c-q2-close", "c-q3-close"].forEach(function(id){ refaire(id, function(){ return Pilot(etatPilot()); }); });
refaire("c-pret", PilotPret);
refaire("c-estim", PilotEstimation);
refaire("c-attest2", PilotAttest2);
["c-corr-q2-avant", "c-corr-q2-lu", "c-corr-q2-apres", "c-corr-q3-apres", "c-corr-q1-apres"].forEach(function(id){ refaire(id, PilotCorrection); });
["c-coeval-attente", "c-coeval-retire-michel", "c-coeval-retire-julien", "c-coeval-retire-deux", "c-coeval-tranche"].forEach(function(id){ refaire(id, PilotCoevalE); });
refaire("c-bilan", BilanClasse);
refaire("c-reprendre", function(){ return Lancement(false, {reprise:"tablettes"}); });
refaire("c-papier-reprendre", function(){ return Lancement(false, {reprise:"papier"}); });
// les tablettes : la bonne question, au bon tour, avec le chrono du moment
["t-q1-reflexion", "t-q1-passage1", "t-q1-tour1", "t-q1-passage2", "t-q1-tour2", "t-q2-reflexion", "t-q2-tour1", "t-q2-tour2", "t-q3-tour1", "t-q3-tour2"].forEach(function(id){ refaire(id, tabletteDuMoment); });
refaire("t-q1-b-michel", function(){ return Tablette(Voile(M, false, J), EcrDeclareFlux(M, MOM().qi, TABL.M[MOM().qi], MOM().reste)); });
refaire("t-q2-ecartee", function(){ var sv = EV; EV = {titre:sv.titre, mode:sv.mode, questions:sv.questions.filter(function(q, i){ return (MOM().ecartees || []).indexOf(i) < 0; })}; try { return Tablette(EcrReflexion(J, MOM().qi, MOM().reste), EcrReflexion(M, MOM().qi, MOM().reste)); } finally { EV = sv; } });
refaire("t-rouvrir-un", function(){ var m = MOM(), th = {cle:"T", nom:nomDe(m.pour), prenom:m.pour, sexe:SCN.SEXE[m.pour] || "M"}, v = SCN.voisinDe(m.pour), lou = {cle:"L", nom:nomDe(v), prenom:v, sexe:SCN.SEXE[v] || "M"};
  return Tablette(EcrReponse(th, m.qi, ORD[m.qi].J, [], m.reste), Voile(th, false, lou)); });
refaire("t-corr-q2-lecture", function(){ var m = MOM(); return Tablette(EcrLecture(J, m.qi, (m.pasLu || []).indexOf("Michel") >= 0 ? true : true, m.reste), EcrLecture(M, m.qi, (m.pasLu || []).indexOf("Michel") < 0, m.reste)); });
refaire("t-corr-q3-lecture", function(){ var m = MOM(); return Tablette(EcrLecture(J, m.qi, true, m.reste), EcrLecture(M, m.qi, true, m.reste)); });
refaire("t-corr-q1-lecture", function(){ var m = MOM(); return Tablette(EcrLecture(J, m.qi, true, m.reste), EcrLecture(M, m.qi, true, m.reste)); });
refaire("t-corr-q2-apres", function(){ return Tablette(EcrRevele(J, MOM().qi), EcrRevele(M, MOM().qi)); });
refaire("t-corr-q3-apres", function(){ return Tablette(EcrRevele(J, MOM().qi), EcrRevele(M, MOM().qi)); });
refaire("t-corr-q1-apres", function(){ return Tablette(EcrRevele(J, MOM().qi), EcrRevele(M, MOM().qi)); });
refaire("t-estim", function(){ return Tablette(EcrEstim(J, SCN.ESTIM.Julien), EcrEstim(M, null)); });
refaire("t-attest-corr-fait", function(){ var e = MOM().enCours || {}; return Tablette(EcrAttenteCorr(J), Attest2(M, e.Michel || 4)); });
refaire("t-papier-correction", function(){ return Tablette(EcrRevele(J, MOM().qi, {papier:true}), EcrRevele(M, MOM().qi, {papier:true})); });

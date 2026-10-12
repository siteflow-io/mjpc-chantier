/* ═══════════════ Complément 3 — le tableau, le téléphone et les tablettes, au moment de la scène ═══════════════
   Un seul rendu par appareil, rempli d'après le moment : le tableau montre la question en cours et sa phase, la lecture,
   la correction ; le téléphone, ce que montre la console ; les tablettes, la bonne question au bon tour. */

/* ════════ Le tableau (vue projetée) : les phases de la 7.7.1 (VueBoard), avec les choix de Paul (33, 93) ════════ */
function BoardAside(){
  var k = MO(), m = momH(), qi = m.qi, inscrits = [].concat.apply([], PAIRES_AVANT).filter(Boolean).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  var absents = SCN.SEANCES.filter(function(s){ return s.id === m.seance; }).map(function(s){ return s.absents; })[0] || [];
  // (QCM-2) en direct : les élèves de la séance, ses absents (et ses partis), par leur « NOM Prénom »
  if(enDirect()){ inscrits = SCN.eleves().map(SCN.nomDe); absents = SCN.absents().concat(Object.keys(m.partis || {})).map(SCN.nomDe); }
  var rep = qi != null ? SCN.repondu(qi, k) : [];
  // pendant la lecture, c'est le voisin qui agit : en attente, ceux qui n'ont pas encore lu la feuille de leur voisin
  var lecteurs = (m.pasLu || []).map(function(p){ return SCN.voisinDe(p); });
  // deux colonnes quand la liste ne tiendrait pas dans la hauteur : personne ne fait défiler le tableau
  return h("aside", {className:"board-aside-eleves"},
    h("div", {className:"board-aside-titre"}, "👥 Classe (" + inscrits.length + ")"),
    h("div", {className:"board-aside-liste deux-col"}, inscrits.map(function(n){
      var p = cleH(n), cls = "board-aside-eleve ";
      if(absents.indexOf(n) >= 0) cls += "absent";
      else if(m.ph === "lecture") cls += lecteurs.indexOf(p) >= 0 ? "enattente" : "repondu";
      else if(m.ph === "reponse" || m.ph === "b" || m.ph === "passage") cls += rep.indexOf(p) >= 0 ? "repondu" : "enattente";
      else cls += "repondu";
      var mots = n.split(" "), prenom = enDirect() ? SCN.pre(p) : mots[mots.length - 1], nom = enDirect() ? SCN.nom(p) : mots.slice(0, -1).join(" ");
      return h("div", {key:n, className:cls}, h("span", {className:"prenom"}, prenom), h("span", {className:"nom"}, nom));
    })));
}
function EcranTableau(){ return h(TableauC); }
function TableauC(){ chargerHeure(); var m = momH(); useSeconde(!!PHASES_CHRONO[m.ph]); return Board(); }
function Board(){
  var k = MO(), m = momH(), c = SCN.compteurs(k), ev = SCN.evalDu(k);
  // (QCM-2) en pause, le tableau reste sur le temps gelé
  if(m.ph === "pause" && m.pause) m = Object.assign({}, m, {ph:m.pause.ph});
  var enSeance = m.seance && m.seance !== "TEST" && m.ph !== "hors" && m.ph !== "soir" && m.ph !== "fin" && m.ph !== "grille";
  if(!enSeance) return h("div", {className:"board-attente"},
    h("div", {className:"board-titre"}, "📺 Vue tableau"),
    h("div", {className:"board-msg"}, "L'évaluation n'a pas encore commencé. Elle s'ouvrira quand nous la lancerons ensemble."),
    h("div", {className:"board-sub"}, "Cette vue se met à jour automatiquement dès qu'une séance est lancée depuis le pilotage."));
  var qi = m.qi;
  // (QCM-2) après les questions (l'estimation, la seconde attestation, la co-évaluation, le bilan) : la classe et l'évaluation, sans « la première question va arriver »
  if(enDirect() && ["estim", "att2", "coeval", "bilan"].indexOf(m.ph) >= 0) return h("div", {className:"board-with-aside"}, h("div", {className:"board-main"}, h("div", {className:"board-active board-idle"},
    h("div", {className:"board-classe"}, CLASSE), h("div", {className:"board-titre-eval"}, ev.titre))), BoardAside());
  if(qi == null) return h("div", {className:"board-active board-idle"},
    h("div", {className:"board-classe"}, CLASSE), h("div", {className:"board-titre-eval"}, ev.titre),
    h("div", {className:"board-attente-msg"}, "📋 Préparation… La première question va arriver."));
  var q = ev.questions[qi], t = SCN.tempsDe(qi, k), correction = m.ph === "lecture" || m.ph === "revele";
  var pos = ORDRE_CORR.indexOf(qi);
  var bandeau = h("div", {className:"board-bandeau-haut"},
    h("span", {className:"board-classe-mini"}, CLASSE),
    h("span", {className:"board-niveau-pastille", style:{background:NIV[q.niveau].color}}, NIV[q.niveau].label),
    h("span", {className:"board-q-count"}, correction ? "Correction — Q" + (qi + 1) + " / " + c.nbQ : "Question " + c.question[0] + " / " + c.question[1]),
    (m.ph === "reponse" || m.ph === "b" || m.ph === "passage") && h("span", {className:"board-progress"}, "✋ " + c.repondu[0] + " / " + c.repondu[1] + " ont répondu"),
    m.ph === "lecture" && h("span", {className:"board-progress"}, "✍️ " + c.lus[0] + " / " + c.lus[1] + " ont répondu"),
    m.ph === "close" && h("span", {className:"board-progress"}, "📋 " + c.repondu[0] + " / " + c.repondu[1] + " réponses"));
  var corps;
  if(m.ph === "reflexion") corps = h("div", {className:"board-active board-reflexion"}, bandeau,
    h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
    h("div", {className:"board-chrono-zone"},
      h("div", {className:"board-chrono-label"}, h("span", {className:"board-main-anim"}, "✍️"), " RÉDIGE TA RÉPONSE EN ENTIER SUR TA FEUILLE"),
      Cercle(m.reste, t.reflexion, NIV[q.niveau].color),
      h("div", {className:"board-chrono-sub"}, "Les choix de réponse n'apparaîtront qu'après la réflexion. Note ta réponse en toutes lettres sur ta copie.")));
  // (complément 4, correction 9 — garde 18) une question rouverte pour un élève, ou une séance dont la console s'est perdue, est en réponse :
  // le tableau la montre comme telle (la 7.7.1 rouvre une question en phase « reponse »)
  else if(m.ph === "reponse" || m.ph === "b" || m.ph === "passage" || m.ph === "rouvert" || m.ph === "panne") corps = h("div", {className:"board-active board-reflexion"}, bandeau,
    h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
    h("div", {className:"board-chrono-zone"},
      h("div", {className:"board-chrono-label"}, "🖊️ ", "POSE TON STYLO."),
      h("div", {className:"board-tour-l"}, Cercle(m.reste || 0, t.reponse, "#EC4899"), h("span", {className:"board-tour"}, m.tour === 2 ? "2e tour" : "1er tour")),
      h("div", {className:"board-chrono-sub"}, "Temps de réponse")));
  else if(m.ph === "close") corps = h("div", {className:"board-active board-attente-anim"}, bandeau,
    h("div", {className:"board-zone-anim"}, h("div", {className:"board-orbe-wrap"}, h("div", {className:"board-orbe board-orbe-1"}))),
    h("div", {className:"board-attente-bas"}, h("div", {className:"board-attente-titre"}, "📋 Question close"), h("div", {className:"board-attente-sub"}, "Les réponses sont enregistrées — la suite arrive.")));
  else if(m.ph === "lecture") corps = h("div", {className:"board-active board-reflexion recopie"}, bandeau,
    h("div", {style:{textAlign:"center", paddingTop:".6rem"}}, h("span", {className:"board-correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe")),
    h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
    h("div", {className:"board-chrono-zone"},
      h("div", {className:"board-chrono-label"}, "📄 ", "Lis avec soin : c'est ton point d'autonomie."),
      Cercle(m.reste || 0, t.reponse, "#EA580C"),
      h("div", {className:"board-chrono-sub"}, "📄 Temps pour lire la feuille du voisin")));
  else if(m.ph === "revele") corps = h("div", {className:"board-active board-correction"}, bandeau,
    h("div", {style:{textAlign:"center"}}, h("span", {className:"board-correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe")),
    h("div", {className:"board-reponse-enonce"}, q.enonce),
    h("div", {className:"board-choix-grille"}, q.choix.map(function(ch, i){
      var bon = q.bonnes.indexOf(i) >= 0;
      return h("div", {key:i, className:"board-choix-item " + (bon ? "choix-bon" : "choix-mauvais")}, h("span", {className:"board-choix-texte"}, ch), bon && h("span", {className:"board-choix-coche"}, "✓"));
    })),
    h("div", {className:"board-correction-bas"}, "✅ Bonnes réponses : " + q.bonnes.map(function(i){ return q.choix[i]; }).join(", ")),
    h("div", {className:"board-explication", style:{margin:"0 2rem 1.2rem"}}, h("div", {className:"board-explication-titre"}, "💡 Explication"), h("div", {className:"board-explication-texte"}, q.explication)));
  else corps = h("div", {className:"board-active board-idle"}, h("div", {className:"board-classe"}, CLASSE), h("div", {className:"board-titre-eval"}, ev.titre),
    h("div", {className:"board-attente-msg"}, "📋 Préparation… La première question va arriver."));
  return h("div", {className:"board-with-aside"}, h("div", {className:"board-main"}, corps), BoardAside());
}

/* ════════ Le téléphone, ta télécommande (418) : ce que montre la console, au même moment ════════ */
function TelBandeau(phase, droite){
  return h("div", {className:"tel-bandeau"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}, h("div", {style:{fontWeight:900, fontSize:".95rem"}}, CLASSE), h("div", {style:{fontSize:".72rem", opacity:.9}}, "🕙 Fin " + SCN.finHeure(MO()))),
    h("div", {style:{fontSize:".75rem", opacity:.85}}, EV.titre),
    h("div", {style:{marginTop:".3rem", fontSize:".8rem", fontWeight:"bold"}}, phase, droite && h("span", {className:"tel-tour"}, droite)));
}
// la bande des questions (la 7.7.1, l. 5672 et 5680) : le taux de chaque question close, d'après la tablette
function TelStats(courante, connues){
  var k = MO();
  return h("div", {className:"tel-stats", title:"Aperçu de la classe par question. Vert = >75% bonnes, Bleu = >50%, Orange = >25%, Rouge = <25%. Les rouges sortiront en premier à la correction."}, EV.questions.map(function(q, i){
    var connu = connues.indexOf(i) >= 0, b = bilanQ(i, k), tx = b.repondu ? Math.round(b.justes * 100 / b.repondu) : 0;
    var c = i === courante && !connu ? "cur" : !connu ? "vide" : tx >= 75 ? "v" : tx >= 50 ? "b" : tx >= 25 ? "o" : "r";
    return h("div", {key:i, className:"tel-st " + c, title:"Q" + (i+1) + (connu || b.repondu ? " — " + b.justes + "/" + b.repondu + " bonnes (" + tx + "%)" : " — pas de réponse")}, h("div", null, "Q" + (i+1)), h("div", {style:{fontSize:".62rem", opacity:.9}}, connu ? tx + " %" : (i === courante ? "en cours" : "—")));
  }));
}
function TelTemps(p){
  useTemps();
  var t = tempsDe(p.qi), m = momH(), f = SCN.finPrevue(MO(), TEMPS.surcharges), finiRef = m.ph !== "reflexion";
  function ligne(lbl, champ, k, ferme){
    var v = t[champ];
    return h("div", {className:"tel-temps-l"}, h("span", null, lbl + " " + v + " s"),
      [5, 10, 30].map(function(n){ return h("button", {key:n, className:"tel-btn tb-jaune tb-small", "data-local":"1", disabled:!!ferme, title:ferme || ("Ajoute " + n + " s au temps de " + (champ === "reflexion" ? "réflexion" : "réponse") + " de cette question. La fin prévue suit."),
        onClick:function(){ tempsAjouter(p.qi, champ, n, champ === "reflexion" ? m.ph === "reflexion" : m.ph === "reponse"); }}, "+" + n); }));
  }
  var deb = f ? Math.round(f.deborde / 60) : 0;
  return h("div", {className:"tel-temps"}, ligne("🧠 Réflexion", "reflexion", 1, finiRef ? "La réflexion de cette question est finie : son temps ne se change plus." : null), ligne("✋ Réponse", "reponse", 2, null),
    f && h("div", {className:"tel-fin" + (deb > 0 ? " deborde" : ""), "data-fin-prevue":"1"}, deb > 0 ? "🏁 Fin prévue " + f.hm + ", " + deb + " min après la fin de l'heure" : "🏁 Fin prévue " + f.hm));
}
function TelReponse(){
  var k = MO(), m = MOM(), qi = m.qi, c = SCN.compteurs(k), rep = SCN.repondu(qi, k);
  var pc = SCN.premierCote(qi);
  var modeDe = function(p, cote){ if(m.tour === 1 && cote !== pc) return {mode:"voile"}; if(rep.indexOf(p) < 0) return {mode:"rep"}; return {qi:qi, mode:"q"}; };
  var suiv = qi + 1 < 3 ? qi + 1 : null;
  return TelCadre([
    TelBandeau("Phase : réponse — Q " + c.question[0] + "/" + c.question[1], (m.tour === 1 ? "1er" : "2e") + " tour : moitiés de " + (coteDuTour(qi, m.tour) === "g" ? "gauche" : "droite")),
    h(TelChrono, {key:"c", reste:m.reste, total:tempsDe(qi).reponse}),
    h("div", {key:"tt"}, h(TelTemps, {qi:qi})),
    h("div", {key:"q"}, TelQ(qi)),
    suiv != null && h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q" + (suiv + 1) + " : "), h("span", {className:"tel-suiv-e"}, EV.questions[suiv].enonce),
      h("button", {className:"tel-mini-b", "data-va":"c-ecarter", title:BULLES["❌ Écarter"]}, "❌ Écarter")),
    h("div", {key:"a", className:"tel-actions"},
      h("button", {className:"tel-btn tb-vert tb-large", "data-va":"t-q1-passage2"}, m.tour === 1 ? "⏭️ Tour suivant" : "🔒 Clore la question"),
      h("div", {className:"g2"}, h(BoutonPauseTel), h("button", {className:"tel-btn tb-ghost tb-small", "data-local":"1", title:BULLES["🔄 Chrono"], onClick:function(){ document.dispatchEvent(new Event("maquette-relancer")); }}, "🔄 Chrono"))),
    h("div", {key:"st"}, TelStats(qi, [0, 1, 2].filter(function(x){ return x < qi; }))),
    h("div", {key:"l"}, TelListe("TABLETTES — " + c.repondu[0] + " / " + c.repondu[1] + " ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "✓+ une en trop", "½ une sur deux", "✗ faux", "🙈 attend son tour", "⏳ répond"])),
    h("div", {key:"t"}, h("button", {className:"tel-btn tb-rouge tb-small", "data-va":"c-terminer"}, "🛑 Terminer la séance"))]);
}
function TelEleve(){
  var k = MO(), m = MOM(), qi = m.qi, c = SCN.compteurs(k), sans = m.sansRep || [];
  var modeDe = function(p){ return sans.indexOf(p) >= 0 ? {mode:"pasrep"} : {qi:qi, mode:"q"}; };
  var theo = sans[0] || "Théo", voisin = SCN.voisinDe(theo), tab = SCN.tabletteDe(theo);
  var fond = TelCadre([
    TelBandeau("Phase : question close — Q " + c.question[0] + "/" + c.question[1], null),
    h("div", {key:"q"}, TelQ(qi)),
    h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q" + (qi + 2) + " : "), h("span", {className:"tel-suiv-e"}, EV.questions[qi + 1].enonce)),
    h("div", {key:"a", className:"tel-actions"},
      h("button", {className:"tel-btn tb-primary tb-large", "data-va":"t-q3-tour1"}, "🚀 Lancer Q" + (qi + 2)),
      h("button", {className:"tel-btn tb-ghost tb-small", "data-va":"c-rouvrir-tous"}, "🔓 Rouvrir Q" + (qi + 1))),   // le libellé de la 7.7.1 (l. 5616)
    h("div", {key:"st"}, TelStats(qi, [0, 1].filter(function(x){ return x <= qi; }))),
    h("div", {key:"l"}, TelListe("TABLETTES — " + c.repondu[0] + " / " + c.repondu[1] + " ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"t"}, h("button", {className:"tel-btn tb-rouge tb-small", "data-va":"c-terminer"}, "🛑 Terminer la séance"))]);
  var feuille = h("div", {className:"tel-sheet-fond", "data-echap":"c-q2-close"},
    h("div", {className:"tel-sheet"},
      h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".5rem"}}, h("strong", {style:{fontSize:"1rem"}}, nomDe(theo)), h("button", {className:"tel-x", "data-va":"c-q2-close", title:"Ferme la fiche de l'élève sans rien changer."}, "✕")),
      h("div", {style:{fontSize:".78rem", opacity:.85, marginBottom:".6rem"}}, "Tablette " + tab.n + ", moitié de " + (tab.cote === "g" ? "gauche" : "droite") + " · avec " + nomDe(voisin)),
      h("button", {className:"tel-btn tb-turq", "data-va":"t-rouvrir-un"}, "🔁 Rouvrir Q" + (qi + 1) + " pour cet élève uniquement (une seule fois)"),
      h("button", {className:"tel-btn tb-rouge", "data-va":"c-parti"}, "🚫 Marquer comme parti en cours de séance"),
      h("div", {className:"tel-etat"}, "État actuel : n'a pas encore répondu. Pendant son tour, " + voisin + " porte le voile.")));
  return h(F, null, fond, feuille);
}
function telPastille(p, qi, mode){
  if(mode === "voile") return {t:"🙈", cls:"tp-voile"};
  if(mode === "rep") return {t:"⏳", cls:"tp-attente"};
  if(mode === "pasrep") return {t:"⏳", cls:"tp-rouge"};
  if(mode === "recopie") return {t:"📄", cls:"tp-recopie"};
  if(mode === "pasrecopie") return {t:"⏳", cls:"tp-rouge"};
  if(mode === "corr"){
    var s = calc(p).st[qi];
    return s === "j" ? {t:"✓", cls:"tp-juste"} : s === "t" ? {t:"✓", cls:"tp-trouvee"} : {t:"✗", cls:"tp-faux"};
  }
  var c = (RT[p] || "")[qi];
  return c === "J" ? {t:"✓", cls:"tp-juste"} : c === "Y" ? {t:"✓+", cls:"tp-jaune"} : c === "O" ? {t:"½", cls:"tp-orange"} : {t:"✗", cls:"tp-faux"};
}
function TelCorrAvant(){
  var k = MO(), m = MOM(), qi = m.qi, c = SCN.compteurs(k), pasLu = m.pasLu || [], pos = ORDRE_CORR.indexOf(qi);
  var modeDe = function(p){ return pasLu.indexOf(p) >= 0 ? {mode:"pasrecopie"} : {mode:"recopie"}; };
  return TelCadre([
    TelBandeau("Phase : correction — Q" + (qi + 1) + " (" + (pos === 0 ? "1re" : (pos + 1) + "e") + " sur 3)", "lecture de la feuille du voisin"),
    h("div", {key:"c", className:"tel-chrono orange"}, h("div", {className:"lb"}, "📄 Temps pour lire la feuille du voisin"), (m.reste || 0) + "s"),
    h("div", {key:"q"}, TelQ(qi)),
    h("div", {key:"a", className:"tel-actions"},
      h("button", {className:"tel-btn tb-or tb-large ferme", disabled:pasLu.length > 0, title:"« 💡 Révéler » s'ouvre quand les " + c.presents + " présents ont lu la feuille de leur voisin. Il en manque " + pasLu.length + "."}, "🔒 Révéler — il en manque " + pasLu.length),
      h("button", {className:"tel-btn tb-ghost tb-small ferme", disabled:pos === 0, title:pos === 0 ? "C'est la première question corrigée : il n'y a pas de question précédente." : "Revient à la question précédente de la correction."}, "← Question précédente")),
    h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Feuille pas encore lue : "), pasLu.map(nomDe).join(" · "), InfoIB("Feuille pas encore lue", "Une tablette en panne : un clic sur le nom, puis « 🚫 Marquer comme parti en cours de séance ».")),
    // la bande des questions, comme dans la 7.7.1 à la correction (l. 5672) ; elle compte les tablettes, pas les feuilles (relecteur n°173)
    h("div", {key:"st"}, h("div", {className:"tel-st-l"}, "📱 Sur les tablettes, avant la correction :"), TelStats(qi, [0, 1, 2])),
    h("div", {key:"l"}, TelListe("TABLETTES — " + c.lus[0] + " / " + c.lus[1] + " feuilles lues · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["📄 feuille lue", "⏳ pas encore lue"])),
    h("div", {key:"t"}, h("button", {className:"tel-btn tb-rouge tb-small", "data-va":"c-terminer"}, "🛑 Terminer la séance"))]);
}
function TelCorrApres(){
  var k = MO(), m = MOM(), qi = m.qi, q = EV.questions[qi], lire = lireSoir(k), pos = ORDRE_CORR.indexOf(qi), c = SCN.compteurs(k);
  var flagDe = function(p){ return SCN.autonomie(p, k).retire ? "⛔" : lire.some(function(x){ return x[3].p === p && x[1] === qi; }) ? "⚠️" : null; };
  var res = SCN.presents(k).map(function(p){ return calc(p).st[qi]; });
  return TelCadre([
    TelBandeau("Phase : correction — Q" + (qi + 1) + " (" + (pos === 0 ? "1re" : (pos + 1) + "e") + " sur 3)", "révélée"),
    h("div", {key:"q"}, TelQ(qi)),
    h("div", {key:"a", className:"tel-actions"},
      h("button", {className:"tel-btn tb-primary tb-large", "data-va":"t-corr-q3-lecture", title:"Passe à la question suivante de la correction : chacun lit d'abord la feuille de son voisin."}, "Question suivante →"),
      h("button", {className:"tel-btn tb-ghost tb-small ferme", disabled:pos === 0, title:pos === 0 ? "C'est la première question corrigée : il n'y a pas de question précédente." : "Revient à la question précédente de la correction."}, "← Question précédente")),
    h("div", {key:"x", className:"tel-expl"}, h("div", {className:"t"}, "💡 EXPLICATION"), q.explication),
    h("div", {key:"su", className:"tel-suivi"}, "D'après la feuille : ", h("strong", null, res.filter(function(s){ return s === "j"; }).length + " / " + c.presents + " justes"), " · ✓ Trouvées au dernier moment : ", h("strong", null, res.filter(function(s){ return s === "t"; }).length)),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + lire.length + ") : "), lire.map(function(x){ return x[0] + " — Q" + (x[1]+1) + " : " + x[2]; }).join(" · ")),
    h("div", {key:"st"}, h("div", {className:"tel-st-l"}, "📱 Sur les tablettes, avant la correction :"), TelStats(qi, [0, 1, 2])),
    h("div", {key:"l"}, TelListe("TABLETTES — d'après la feuille · clic sur un nom pour agir", function(){ return {qi:qi, mode:"corr"}; }, flagDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "✓ orange : Trouvée au dernier moment", "✗ faux", "⚠️ À relire ce soir", "⛔ point d'autonomie retiré"])),
    h("div", {key:"t"}, h("button", {className:"tel-btn tb-rouge tb-small", "data-va":"c-terminer"}, "🛑 Terminer la séance"))]);
}
function TelAutonomie(){
  var k = MO(), p = "Hugo", tab = SCN.tabletteDe(p), au = SCN.autonomie(p, k), s = calc(p).st[MOM().qi];
  var feuille = h("div", {className:"tel-sheet-fond", "data-echap":"p-corr-apres"},
    h("div", {className:"tel-sheet"},
      h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".5rem"}}, h("strong", {style:{fontSize:"1rem"}}, nomDe(p)), h("button", {className:"tel-x", "data-va":"p-corr-apres", title:"Ferme la fiche de l'élève sans rien changer."}, "✕")),
      h("div", {style:{fontSize:".78rem", opacity:.85, marginBottom:".6rem"}}, "Tablette " + tab.n + ", moitié de " + (tab.cote === "g" ? "gauche" : "droite") + " · avec " + nomDe(SCN.voisinDe(p))),
      h("button", {className:"tel-btn tb-rouge", "data-va":"c-autonomie-garde", title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie"),
      h("button", {className:"tel-btn tb-ghost", "data-va":"c-depart", title:"Marque Hugo comme parti : il ne bloque plus la classe."}, "🚫 Marquer comme parti en cours de séance"),
      h("div", {className:"tel-etat"}, "État actuel : Q" + (MOM().qi + 1) + " " + (s === "j" ? "juste" : s === "t" ? "trouvée au dernier moment" : "fausse") + " d'après sa feuille · point d'autonomie " + (au.retire ? "retiré " + au.quand : "gardé") + ".")));
  return h(F, null, TelCorrApres(), feuille);
}

/* ════════ Les tablettes : la bonne question au bon tour, le chrono du moment ════════ */
function EcrPret(e){
  var m = MOM(), se = SCN.seance(m.seance) || SCN.seance("S08");
  return Page(badgeDe(e), EV.titre, h(F, null,
    h("div", {className:"etat-attente"}, "⏳ En attente du démarrage…"),
    h("div", {style:{fontSize:".8rem", color:"var(--gris)", marginTop:12}}, "Tu as lu et compris les consignes le " + se.date + " à " + heureAttestH(cleE(e), 1) + ".")));
}
function tabletteDuMoment(){
  var m = MOM(), qi = m.qi, reste = m.reste || 0;
  if(m.ph === "reflexion") return Tablette(EcrReflexion(J, qi, reste), EcrReflexion(M, qi, reste));
  if(m.ph === "passage") return passageScene(qi, m.tour);
  if(m.ph === "reponse"){ var p = PREMIER[qi]; return tourScene(qi, m.tour, reste, TABL[p][qi], m.tour === 2 ? TABL[p === "J" ? "M" : "J"][qi] : []); }
  return Tablette(EcrAttente(J), EcrAttente(M));
}

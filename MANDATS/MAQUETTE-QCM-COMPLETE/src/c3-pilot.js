/* ═══════════════ Complément 3 — le pilotage, au moment de la scène ═══════════════
   La console pendant les questions : un seul rendu (Pilot), rempli d'après le moment. L'état, les compteurs, les tablettes,
   la question en cours, celles à venir et la fin prévue se calculent du scénario. */

/* ── L'état du pilotage à un moment ── */
function etatPilot(k){
  k = k || MO();
  var m = SCN.moment(k) || {}, c = SCN.compteurs(k);
  var phase = ({pret:"idle", avant:"idle", appel:"idle", entree:"idle", reflexion:"reflexion", passage:"reponse", reponse:"reponse", b:"reponse", close:"attente", rouvert:"attente", panne:"reponse"})[m.ph] || "idle";
  var qi = m.qi == null ? null : m.qi;
  var passees = [0, 1, 2].filter(function(q){ return qi != null && (q < qi || (q === qi && phase === "attente")); });
  var obj = function(l){ var o = {}; (l || []).forEach(function(x){ o[x] = true; }); return o; };
  var leg = LEG_Q.slice();
  if((m.sansRep || []).length) leg = LEG_Q.slice(0, 4).concat([["#fff", "pas de réponse", "2px dashed #EF4444"]]);
  if(m.partis) leg = leg.concat([["#E2E8F0", "🚪 parti : ne bloque plus"]]);
  return {k:k, phase:phase, qi:qi, tour:m.tour, chrono:m.reste, stats:statsQ(), passees:passees, ecartees:obj(m.ecartees), annulees:obj(m.annulees),
    etat:etatQuestion({qi:qi, tour:m.tour, fini:phase === "attente", reflexion:phase === "reflexion"}), legende:leg, nbQ:c.nbQ};
}
// les réponses et les justes d'une question déjà posée, sur la tablette, au moment k
function bilanQ(qi, k){ var m = SCN.moment(k) || {}; if(m.seance === "TEST"){ var t = SCN.TEST.passees[qi] || {repondu:0, justes:0}; return {repondu:t.repondu, justes:t.justes, presents:SCN.TEST.presents}; }
  var rep = SCN.repondu(qi, k); return {repondu:rep.length, justes:rep.filter(function(p){ return RT[p][qi] === "J"; }).length, presents:SCN.presents(k).length}; }
function bonnesRep(n){ return n + (n > 1 ? " bonnes réponses" : " bonne réponse"); }

/* ── La question en cours ── */
function QCourante(qi){
  var q = EV.questions[qi], m = MOM(), ec = m.ecartees || [], nbQ = EV.questions.length - ec.length;
  var rang = qi + 1 - ec.filter(function(x){ return x < qi; }).length;
  return h("div", {className:"pilot-q-current"},
    h("div", {className:"num"}, "Question " + rang + " / " + nbQ + " — " + bonnesRep(q.bonnes.length)),
    h("div", {className:"enonce"}, q.enonce),
    h("div", {className:"pilot-q-bonne"}, h("span", {style:{fontWeight:900}}, "✓ Bonne" + (q.bonnes.length > 1 ? "s" : "") + " réponse" + (q.bonnes.length > 1 ? "s" : "") + " : "), q.bonnes.map(function(i){ return q.choix[i]; }).join("  /  ")),
    h("div", {className:"niv-row"},
      h("span", {className:"niv-bulle"}, "Difficulté : " + NIV[q.niveau].label),
      (q.competences || []).map(function(c){ return h("span", {key:c, className:"niv-bulle"}, c); })));
}

/* ── « 📋 Toutes les questions » : les comptes au moment de la scène ── */
function Overview(qCur, passees, opts){
  opts = opts || {};
  var k = MO(), m = MOM(), ec = opts.ecartees || {}, an = opts.annulees || {}, c = SCN.compteurs(k);
  return h("div", {className:"pilot-overview"},
    h("h3", null, h("span", null, "📋 Toutes les questions", InfoI("Les temps des questions à venir se tapent ici, pour cette séance seulement. « ❌ Écarter » retire une question pas encore posée ; « ⚠️ Annuler » retire une question déjà posée. Les deux se défont par « ↩️ Remettre »."))),
    EV.questions.map(function(q, qi){
      // la 7.7.1 (l. 8114) : la question du moment reste « en cours », même close, jusqu'au lancement de la suivante
      var current = qi === qCur, passee = !current && passees.indexOf(qi) >= 0, avenir = !current && !passee;
      var b = bilanQ(qi, k);
      var marque = ec[qi] ? h("div", {className:"q-marque ecartee"}, "❌ Écartée — pas posée") : an[qi] ? h("div", {className:"q-marque annulee"}, "⚠️ Annulée — posée, puis annulée") : null;
      var titre = current ? "Question en cours — " + (c.justes && c.justes[1] ? c.justes[0] + "/" + c.justes[1] : "0/" + c.presents) + " justes pour le moment"
        : passee ? "Question passée — " + b.justes + "/" + b.repondu + " justes" : null;   // la 7.7.1, l. 8114
      var t = tempsDe(qi);
      var taux = b.repondu ? b.justes / b.repondu : 0;
      return h("div", {key:qi, className:"pilot-q-mini" + (current ? " current" : "") + (passee ? " passee" : "") + (ec[qi] || an[qi] ? " retiree" : ""), title:titre},
        h("div", {className:"pilot-q-mini-head"}, h("span", {className:"pilot-q-mini-num"}, "Q" + (qi+1)), h("span", {className:"pilot-q-mini-niv niv-" + q.niveau}, NIV[q.niveau].label)),
        h("div", {className:"pilot-q-mini-enonce"}, q.enonce),
        h("div", {className:"pilot-q-mini-bonnes"}, ChoixTexte(q)),
        marque,
        avenir && !ec[qi] ? h(TempsMini, {qi:qi}) : h("div", {className:"pilot-q-mini-status"}, "Réflexion " + t.reflexion + " s · Réponse " + t.reponse + " s par tour",
          (passee || (current && opts.phase === "attente")) && !an[qi] && h("span", null, " — ", h("span", {className:"score-pct " + (taux >= .7 ? "score-vert" : taux >= .5 ? "score-orange" : "score-rouge")}, b.justes + "/" + b.repondu + " justes"))),
        h("div", {className:"q-gestes"},
          ec[qi] || an[qi] ? h("button", {className:"btn btn-ghost btn-sm", "data-va":opts.remettre || "c-q1-close"}, "↩️ Remettre")
            : avenir ? h("button", {className:"btn btn-ghost btn-sm btn-ecarter", "data-va":"c-ecarter", title:"Écarte la question " + (qi + 1) + ", après une confirmation : elle ne sera ni posée ni corrigée, et sort du total, comme une question manquée par un absent ; les tablettes et le tableau comptent sans elle. « ↩️ Remettre » la défait, tant que son tour n'est pas passé."}, "❌ Écarter")
            : passee || (current && opts.phase === "attente") ? h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-annuler"}, "⚠️ Annuler") : null));
    }),
    opts.alerteComp && h("div", {className:"q-alerte"}, opts.alerteComp));
}

/* ════════ Le pilotage pendant les questions ════════ */
function nonRepondus(){ return (MOM().sansRep || []).length; }
function Pilot(s){
  s = s || etatPilot();
  var m = MOM(), k = MO();
  var ec = s.ecartees || {}, nbQ = EV.questions.length - Object.keys(ec).length;
  var restantes = [0, 1, 2].filter(function(q){ return !ec[q] && (s.qi == null || q > s.qi); });
  var derniere = s.qi != null && restantes.length === 0;
  var suivante = restantes.length ? restantes[0] : null;
  var st, statusCls = s.phase;
  if(s.phase === "idle") st = "⏳ En attente — clique sur « ▶️ Lancer Q1 »";
  else if(s.phase === "reflexion") st = "🧠 Phase RÉFLEXION en cours";
  else if(s.phase === "reponse") st = h(F, null, "✋ Phase RÉPONSE — " + (s.tour === 1 ? "1er" : "2e") + " tour", h("span", {className:"tour-chip"}, (((PREMIER[s.qi] === "J") === (s.tour === 1)) ? "moitiés de gauche" : "moitiés de droite")));
  else st = derniere ? "✅ Dernière question close — lance l'autoévaluation" : "⏸️ Question close — passe à la suivante";
  var actions;
  if(s.phase === "idle") actions = [h("button", {key:1, className:"btn btn-primary", "data-va":"c-q1-reflexion"}, "▶️ Lancer Q1")];
  else if(s.phase === "reflexion") actions = [h("button", {key:1, className:"btn btn-vert", "data-va":"c-q1-tour1"}, "✋ Autoriser la réponse"), h(BoutonPause, {key:2}), h(BoutonRelancer, {key:3})];
  else if(s.phase === "reponse") actions = [s.tour === 1 ? h("button", {key:1, className:"btn btn-vert", "data-va":"c-q1-tour2"}, "⏭️ Tour suivant") : h("button", {key:1, className:"btn btn-or", "data-va":s.qi === 2 ? "c-q3-close" : s.qi === 1 ? "c-q2-close" : "c-q1-close"}, "🔒 Clore la question"), h(BoutonPause, {key:2}), h(BoutonRelancer, {key:3})];
  else {
    var nr = nonRepondus();
    var rouvrir = nr ? h("button", {key:2, className:"btn btn-ghost", "data-va":"c-rouvrir-tous"}, "🔓 Rouvrir pour tous")
                     : h("button", {key:2, className:"btn btn-ghost", disabled:true, title:"Tous les présents ont répondu à cette question : il n'y a personne à rouvrir. Une réponse donnée est définitive."}, "🔓 Rouvrir pour tous");
    actions = !derniere ? [h("button", {key:1, className:"btn btn-primary", "data-va":suivante === 1 ? "t-q2-reflexion" : "t-q3-tour1"}, "▶️ Lancer Q" + (suivante + 1)), rouvrir]
                        : [h("button", {key:1, className:"btn btn-or", "data-va":"c-estim"}, "📊 Lancer l'autoévaluation"), rouvrir];
  }
  var enCours = s.phase === "reflexion" || s.phase === "reponse";
  var qn = suivante == null ? null : EV.questions[suivante], tn = suivante == null ? null : tempsDe(suivante);
  var rangSuiv = suivante == null ? null : suivante + 1 - Object.keys(ec).filter(function(x){ return +x < suivante; }).length;
  var colG = h("div", null,
    h("div", {className:"pilot-status " + statusCls, title:TITRES_STATUT[s.phase]}, st),
    h(ColonneTemps, {key:"t" + s.qi + s.phase + (s.tour || ""), qi:s.qi == null ? 0 : s.qi, phase:enCours ? s.phase : null, tour:s.tour, reste:s.chrono || 0, close:s.phase === "attente", qiPosee:s.qi != null}),
    s.qi != null && QCourante(s.qi),
    h("div", {className:"pilot-actions"}, actions),
    qn && h("div", {className:"pilot-q-next-detail"},
      h("div", {className:"label"}, "🔮 À venir — Q " + rangSuiv + " / " + nbQ, InfoI("La question suivante, avec ses deux temps : ils se changent dans « 📋 Toutes les questions », à droite.")),
      h("div", {className:"enonce-next"}, qn.enonce),
      h("div", {style:{fontSize:".72rem", color:"var(--gris)", fontStyle:"italic"}}, "Difficulté " + NIV[qn.niveau].label + " · réflexion " + tn.reflexion + " s · réponse " + tn.reponse + " s par tour · " + bonnesRep(qn.bonnes.length))));
  var colM = h("div", null,
    h("h3", {style:{margin:"0 0 .2rem"}}, "📱 Tablettes", InfoI("Chaque tablette, ses deux moitiés : qui est assis où, et où en est chacun. « 👁 » montre les deux moitiés en direct. Glisse un nom sur un autre pour échanger deux élèves : pendant la séance, ils changent de tablette et retapent leur code ; leurs réponses les suivent."), h("span", {style:{fontWeight:400, fontSize:".8rem", color:"var(--gris)", marginLeft:".5rem"}}, s.sousTitre || "")),
    GrilleTablettes(s.paires || PAIRES, s.etat),
    Legende(s.legende || LEG_Q));
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte("🎯 " + EV.titre + " — " + CLASSE, [
      h("span", {key:0, style:{fontSize:".8rem", color:"var(--gris)", fontWeight:700}}, "🕙 Fin de l'heure : " + SCN.finHeure(k)),
      h("button", {key:1, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"),
      // (relecteurs n°62, 100, 101) un geste qui n'a personne sur qui agir est fermé, et dit pourquoi
      Object.keys(m.partis || {}).length ? h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":"c-retour"}, "↩️ Retour d'un élève")
        : h("button", {key:2, className:"btn btn-ghost btn-sm", disabled:true, title:"Personne n'est parti pendant cette séance : il n'y a personne à faire revenir."}, "↩️ Retour d'un élève"),
      s.phase === "attente" && nonRepondus() > 0 ? h("button", {key:4, className:"btn btn-ghost btn-sm", "data-va":"c-rouvrir-un"}, "🔓 Rouvrir pour un élève")
        : h("button", {key:4, className:"btn btn-ghost btn-sm", disabled:true, title:enCours ? "La question en cours n'est pas close : « 🔓 Rouvrir pour un élève » s'ouvre une fois close, pour ceux qui n'ont pas répondu." : s.phase === "attente" ? "Tous les présents ont répondu à cette question : il n'y a personne à rouvrir." : "Aucune question n'est encore close : il n'y a rien à rouvrir."}, "🔓 Rouvrir pour un élève"),
      h("button", {key:5, className:"btn btn-ghost btn-sm", "data-va":"c-finir-autre-heure"}, "⏸️ Finir à une autre heure"),
      h("button", {key:3, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-stats"}, s.stats.map(function(x, i){ return h("div", {key:i, className:"pilot-stat", title:TITRES_STATS[x[1]]}, h("div", {className:"v"}, x[0]), h("div", {className:"l"}, x[1])); })),
    h("div", {className:"pilot-grid v2"}, colG, colM, Overview(s.qi, s.passees || [], s))), true);
}

/* ── Avant la question 1 : qui est entré, où en est chaque attestation ── */
function PilotPret(){
  var m = MOM(), c = SCN.compteurs(MO());
  var pe = m.pasEntres || [], ae = m.attestEnCours || {};
  return Pilot({phase:"idle", qi:null, stats:[[fr2(c.connectes), "connectés"], [fr2(c.attestations), "attestations"], [fr2(c.repondu), "ont répondu"], ["—", "justes"], ["—", "question"]],
    sousTitre:"qui est assis où, et où en est son attestation",
    legende:[["#E8F5E9","✓ prêt : toutes les lignes cochées"],["#FEF3C7","attestation en cours : lignes cochées sur 8"],["#F1F5F9","pas encore entré"]],
    etat:function(p){ return ae[p] ? {cls:"m-attest", st:"attestation " + ae[p] + "/8"} : pe.indexOf(p) >= 0 ? {cls:"m-connexion", st:"pas encore " + (SCN.SEXE[p] === "F" ? "entrée" : "entré")} : {cls:"m-pret", st:"✓ prêt · " + SCN.heureAttest(p, 1)}; }});
}

/* ── La seconde attestation, côté console ── */
function PilotAttest2(){
  var k = MO(), m = MOM(), c = SCN.compteurs(k), enCours = m.enCours || {};
  var manquent = Object.keys(enCours).map(nomDe);
  var etat = function(p){ return enCours[p] ? {cls:"m-attest", st:"attestation " + enCours[p] + "/5"} : {cls:"m-pret", st:"✓ prêt · " + SCN.heureAttest(p, 2)}; };
  var q2 = SCN.ORDRE_CORR[0], b = bilanQ(q2, k);
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📝 Correction — " + EV.titre + " — " + CLASSE, InfoI("Avant la correction, chaque moitié montre la seconde attestation, une coche par ligne. La correction commence quand tous les présents l'ont cochée en entier, comme au début.")),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:5, className:"btn btn-ghost btn-sm"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status correction"}, "✍️ Seconde attestation — " + c.prets[0] + " / " + c.prets[1] + " prêts"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, h("button", {className:"btn btn-primary ferme", disabled:manquent.length > 0, title:"S'ouvre quand les " + c.presents + " présents ont coché toutes les lignes de la seconde attestation. Il en manque " + manquent.length + "."}, "🔒 ▶️ Commencer la correction")),
        manquent.length > 0 && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "La correction commence quand les " + c.presents + " présents ont coché la seconde attestation. Il en manque " + manquent.length + " :"),
          h("div", {className:"noms"}, manquent.join(" · "))),
        h("div", {className:"pilot-eleve-help"}, "La correction commence par Q" + (q2 + 1) + ", la plus ratée sur les tablettes (" + b.justes + " / " + b.repondu + " justes).")),
      h("div", {className:"suivi-box"},
        h("h3", null, "✍️ La seconde attestation", InfoI("Où en est chacun : les lignes cochées sur 5, et l'heure de la dernière coche, gardée comme au début.")),
        h("div", {className:"ss"}, c.prets[0] + " / " + c.prets[1] + " prêts"),
        GrilleTablettes(PAIRES, etat),
        Legende([["#E8F5E9","✓ prêt : les 5 lignes cochées"],["#FEF3C7","attestation en cours : lignes cochées sur 5"]])))), true);
}

/* ── L'estimation, côté console (444) : la répartition des estimations déjà faites ── */
function PilotEstimation(){
  var k = MO(), m = MOM(), c = SCN.compteurs(k), pas = m.pasEstime || [];
  var dist = {vert:0, bleu:0, orange:0, rouge:0};
  SCN.presents(k).forEach(function(p){ if(pas.indexOf(p) < 0 && SCN.ESTIM[p]) dist[SCN.ESTIM[p]]++; });
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📊 Autoévaluation — " + EV.titre + " — " + CLASSE, InfoI("Chaque élève dit combien de bonnes réponses il pense avoir. Cette estimation sert à savoir s'il se surévalue, se sous-évalue ou s'évalue correctement ; son bilan la compare à sa note.")),
      [h("button", {key:5, className:"btn btn-ghost btn-sm"}, "⏸️ Finir à une autre heure"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status autoeval"}, "Phase autoévaluation — " + c.estime[0] + " / " + c.estime[1] + " élèves", InfoIB("Phase autoévaluation", "Les élèves choisissent dans quelle fourchette ils estiment avoir réussi.")),
    h("div", {className:"autoeval-prof-distrib"}, MAITRISE.map(function(mt){
      return h("div", {key:mt.k, className:"autoeval-prof-cell fourchette-" + mt.k}, h("span", null, mt.em + " " + mt.lib), h("strong", null, dist[mt.k])); })),
    pas.length > 0 && h("div", {style:{fontSize:".85rem", color:"var(--gris)"}}, "Pas encore : " + pas.map(nomDe).join(", ") + "."),
    h("div", {className:"row", style:{marginTop:"1rem"}}, h("button", {className:"btn btn-or", "data-va":"c-attest2", title:"Ferme l'estimation et ouvre, sur chaque moitié, la seconde attestation, avant la première question à corriger."}, "📝 Lancer la correction"))), true);
}

/* ═══════════════ Complément 3 — le téléphone reste le téléphone (changement 4) ═══════════════
   Un geste du téléphone agit sur le téléphone : sa fenêtre s'ouvre sur place (une feuille du bas, remplie de l'objet cliqué),
   et ce qu'il fait s'y voit. Un nom ouvre la fiche de cet élève ; « ⏭️ Tour suivant » et « Question suivante → » montrent le
   téléphone au moment suivant. Seuls « ▶️ Lancer Qn » (« 🚀 » sur le téléphone) changent d'appareil, et le déclarent. */

/* ── Une feuille du bas, sur place : Échap, « ✕ » et « Annuler » la referment ── */
function useEchapLocal(ouvert, fermer){
  useEffect(function(){ if(!ouvert) return; function f(e){ if(e.key === "Escape"){ e.stopImmediatePropagation(); fermer(); } } window.addEventListener("keydown", f, true); return function(){ window.removeEventListener("keydown", f, true); }; });
}
function TelFeuille(p){   // p : titre, sous, enfants, fermer
  return h("div", {className:"tel-sheet-fond"}, h("div", {className:"tel-sheet"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".5rem"}}, h("strong", {style:{fontSize:"1rem"}}, p.titre),
      h("button", Object.assign({className:"tel-x", title:"Ferme sans rien changer."}, clic("TF:x:" + p.titre, p.fermer)), "✕")),
    p.sous && h("div", {style:{fontSize:".78rem", opacity:.85, marginBottom:".6rem"}}, p.sous),
    p.enfants));
}
// un geste qui demande une confirmation : le bouton, sa feuille, puis ce qui est fait
function TelGeste(p){   // p : lib, cls, titre, question, corps, oui, fait ; en direct, agir : le geste du « oui »
  var s = useState(0), etat = s[0], set = s[1];
  useEchapLocal(etat === 1, function(){ set(0); });
  if(etat === 2) return h("div", {className:"tel-fait"}, p.fait);
  var cle = "TG:" + p.lib + ":";
  return h(F, null,
    h("button", Object.assign({className:"tel-btn " + p.cls, title:p.titre}, clic(cle + "ouvrir", function(){ set(1); })), p.lib),
    etat === 1 && h(TelFeuille, {titre:p.question, fermer:function(){ set(0); }, enfants:h(F, null,
      p.corps && h("div", {className:"tel-etat"}, p.corps),
      h("button", Object.assign({className:"tel-btn " + p.cls, title:p.titre}, clic(cle + "oui", function(){ set(2); if(enDirect() && p.agir) p.agir(); })), p.oui),
      h("button", Object.assign({className:"tel-btn tb-ghost", title:"Ne fait rien."}, clic(cle + "non", function(){ set(0); })), "Annuler"))}));
}
function TelTerminer(){ return h(TelGeste, {lib:"🛑 Terminer la séance", cls:"tb-rouge tb-small", titre:"Termine la séance, après une confirmation : l'archive s'écrit avec les notes telles qu'elles sont.",
  question:"🛑 Terminer la séance ?", corps:"La séance est close, et l'archive s'écrit avec les notes telles qu'elles sont, quelle que soit la phase.", oui:"🛑 Terminer la séance",
  fait:"🛑 Séance terminée : les tablettes reviennent à « Combien êtes-vous sur cette tablette ? ».", agir:function(){ agir("terminer"); }}); }

/* ── Les noms du téléphone : chacun ouvre la fiche de son élève, au même moment ── */
function TelListe(titre, modeDe, flagDe){
  var ph = momH().ph, fiche = ["lecture", "revele", "coeval", "bilan"].indexOf(ph) >= 0 ? "p-autonomie" : "p-eleve";
  return h("div", {className:"tel-liste"},
    h("div", {className:"tel-liste-h"}, titre),
    PAIRES.map(function(pa, i){
      return h("div", {key:i, className:"tel-tab"},
        h("span", {className:"tel-tab-n"}, "T" + (i+1)),
        pa.map(function(n, k){
          if(!n) return null;
          var p = cleH(n), md = modeDe(p, k === 0 ? "g" : "d"), ps = telPastille(p, md.qi, md.mode), fl = flagDe ? flagDe(p) : null;
          var nm0 = affH(n), nom = nm0.length > 15 ? nm0.slice(0, 14) + "…" : nm0;
          return h("button", {key:k, type:"button", className:"tel-el" + (md.mode === "pasrep" || md.mode === "pasrecopie" ? " rouge" : ""), "data-va":fiche + "&eleve=" + encodeURIComponent(p), title:"Ouvre la fiche " + deNom(nm0) + "."},
            h("span", {className:"nm"}, nom, fl && h("span", {className:"tel-flag"}, fl)),
            h("span", {className:"tel-past " + ps.cls}, ps.t));
        }));
    }));
}

/* ── Le téléphone du moment : la question en cours, close, ou la correction ── */
function momentSiExiste(k){ return SCN.moment(k) ? k : null; }
function TelClose(){
  var k = MO(), m = momH(), qi = m.qi, c = SCN.compteurs(k), sans = m.sansRep || [], suiv = enDirect() ? suivanteQ(qi) : qi + 1 < 3 ? qi + 1 : null;
  if(suiv === undefined) suiv = null;
  var modeDe = function(p){ return qi == null ? {mode:"rep"} : sans.indexOf(p) >= 0 ? {mode:"pasrep"} : {qi:qi, mode:"q"}; };
  var vaSuiv = suiv === 1 ? "t-q2-reflexion" : "t-q3-tour1";
  return TelCadre([
    TelBandeau(qi == null ? "Phase : en attente" : "Phase : question close — Q " + (c.question ? c.question[0] + "/" + c.question[1] : (qi + 1) + "/" + c.nbQ), null),
    qi != null && h("div", {key:"q"}, TelQ(qi)),
    suiv != null && h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q" + (suiv + 1) + " : "), h("span", {className:"tel-suiv-e"}, EV.questions[suiv].enonce)),
    h("div", {key:"a", className:"tel-actions"},
      suiv != null ? h("button", Object.assign({className:"tel-btn tb-primary tb-large"}, enDirect() ? geste(null, "lancerQuestion", suiv) : {"data-va":vaSuiv, "data-moment":momentDefaut(vaSuiv), "data-appareil":"tablette"}), "🚀 Lancer Q" + (suiv + 1))
        : qi != null ? h("button", Object.assign({className:"tel-btn tb-or tb-large"}, geste("c-estim", "lancerEstimation")), "📊 Lancer l'autoévaluation") : null,
      qi == null ? null : sans.length ? h(TelGeste, {lib:"🔓 Rouvrir Q" + (qi + 1), cls:"tb-ghost tb-small", titre:"Rouvre la question " + (qi + 1) + " pour ceux qui n'ont pas répondu, après une confirmation. Une seule fois.",
          question:"🔓 Rouvrir la question " + (qi + 1) + " pour tous ?", corps:"Seuls ceux qui n'ont pas répondu la retrouvent, une seule fois : ici, " + sans.map(nomDe).join(", ") + ".", oui:"🔓 Rouvrir pour ceux qui n'ont pas répondu",
          fait:"🔓 Question " + (qi + 1) + " rouverte pour " + sans.map(nomDe).join(", ") + ".", agir:function(){ agir("rouvrirTous", [qi]); }})
        : h("button", {className:"tel-btn tb-ghost tb-small", disabled:true, title:"Tous les présents ont répondu à cette question : il n'y a personne à rouvrir."}, "🔓 Rouvrir Q" + (qi + 1))),
    h("div", {key:"st"}, TelStats(qi, toutesQ().filter(function(x){ return qi != null && x <= qi; }))),
    h("div", {key:"l"}, TelListe("TABLETTES — " + (c.repondu ? c.repondu[0] + " / " + c.repondu[1] : "0 / " + c.presents) + " ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"t"}, h(TelTerminer))]);
}
function telDuMoment(){
  var m = momH(), ph = m.ph === "pause" && m.pause ? m.pause.ph : m.ph;
  if(m.seance === "S3E") return TelCoeval3();
  // (c-rouvrir-un) une question rouverte pour un seul élève : la classe reste à la question close (rien n'est annoncé)
  if(enDirect() && m.pour && m.pour !== "tous" && ["rouvert", "b", "passage", "reponse"].indexOf(ph) >= 0) return TelClose();
  if(ph === "reponse" || ph === "passage" || ph === "b" || ph === "reflexion" || ph === "rouvert") return TelReponse();
  if(ph === "lecture") return TelCorrAvant();
  if(enDirect() && ph === "coeval") return TelCoevalH();
  if(enDirect() && (ph === "estim" || ph === "att2")) return TelEtapeH();
  if(ph === "revele" || ph === "coeval" || ph === "bilan") return TelCorrApres();
  return TelClose();
}
/* ── (QCM-2) en direct : le téléphone de l'appareil, et ses écrans hors des questions (l'estimation, la seconde attestation, la co-évaluation) ── */
function EcranTelephone(){ return h(TelephoneC); }
// un écran neuf à chaque phase (une clé) : l'infobulle d'un bouton de la phase d'avant ne reste pas (le téléphone n'a pas de champ à garder)
function TelephoneC(){ chargerHeure(); var m = momH(); useSeconde(!!PHASES_CHRONO[m.ph]); return h(F, {key:[m.ph, m.qi, m.tour].join("|")}, telDuMoment()); }
function TelEtapeH(){
  var k = MO(), m = momH(), c = SCN.compteurs(k), estim = m.ph === "estim", manquent = (estim ? m.pasEstime : Object.keys(m.enCours || {})) || [], compte = estim ? c.estime : c.prets;
  return TelCadre([
    TelBandeau(estim ? "Phase autoévaluation — " + (compte ? compte[0] + " / " + compte[1] : "") + " élèves" : "✍️ Seconde attestation — " + (compte ? compte[0] + " / " + compte[1] : "") + " prêts", null),
    h("div", {key:"a", className:"tel-actions"}, estim ? h("button", Object.assign({className:"tel-btn tb-or tb-large", title:"Ferme l'estimation et ouvre, sur chaque moitié, la seconde attestation, avant la première question à corriger."}, geste(null, "lancerCorrection")), "📝 Lancer la correction")
      // (décision de Paul, 13/10) la correction commence à son clic : fermé tant qu'il en manque, ouvert ensuite
      : manquent.length > 0 || !enDirect() ? h("button", {className:"tel-btn tb-primary tb-large ferme", disabled:true, title:"S'ouvre quand les " + c.presents + " présents ont coché toutes les lignes de la seconde attestation. Il en manque " + manquent.length + "."}, "🔒 ▶️ Commencer la correction")
      : h("button", Object.assign({className:"tel-btn tb-primary tb-large", title:"Commence la correction, par la question la plus ratée sur les tablettes."}, geste(null, "lancerCorrection")), "▶️ Commencer la correction")),
    manquent.length > 0 && h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Pas encore : "), manquent.map(nomDe).join(" · ")),
    h("div", {key:"st"}, TelStats(null, toutesQ())),
    h("div", {key:"t"}, h(TelTerminer))]);
}
function TelCoevalH(){
  var k = MO(), c = SCN.compteurs(k), alertes = alertesH(), ouvertes = alertes.filter(function(a){ return !decisionDe(a); });
  var act = actifsH(k), avecVoisin = act.filter(function(p){ var v = SCN.voisinDe(p); return !!v && act.indexOf(v) >= 0; }), att = avecVoisin.filter(function(p){ return CO[p] === "att"; }), lire = lireSoir(k);
  var ouvert = !att.length && !ouvertes.length;
  var pastille = function(p){ var x = CO[p]; return !x || x === "att" ? {t:"⏳", cls:"tp-rouge"} : x === "ok" ? {t:"✅", cls:"tp-juste"} : x.indexOf("mal") === 0 ? {t:"❌ Q" + x.slice(3), cls:"tp-mal"} : {t:"🤔 Q" + x.slice(4), cls:"tp-coq"}; };
  return TelCadre([
    TelBandeau("Phase : co-évaluation de la lecture", (avecVoisin.length - att.length) + " / " + avecVoisin.length + " ont répondu"),
    h("div", {key:"al"}, alertes.map(function(a){ return decisionDe(a) ? AlerteTrancheeH(a) : AlerteCoH(a); })),
    h("div", {key:"a", className:"tel-actions"}, ouvert ? h("button", Object.assign({className:"tel-btn tb-or tb-large", title:"Affiche sur chaque moitié le bilan de l'élève : sa note provisoire, question par question, ses compétences, son estimation."}, geste(null, "afficherBilan")), "🏁 Afficher leur bilan aux élèves")
      : h("button", {className:"tel-btn tb-or tb-large ferme", disabled:true, title:"S'ouvre quand les " + avecVoisin.length + " présents ont répondu à la co-évaluation et que l'alerte est tranchée. Il en manque " + att.length + "."}, "🔒 🏁 Afficher leur bilan — il en manque " + att.length)),
    att.length > 0 && h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Pas encore répondu : "), att.map(nomDe).join(" · ")),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + lire.length + ") : "), lire.map(function(x){ return x[0] + " — Q" + (x[1]+1) + " : " + x[2]; }).join(" · ")),
    h("div", {key:"l", className:"tel-liste"}, h("div", {className:"tel-liste-h"}, "TABLETTES — ce que chacun pense de la lecture de sa feuille"),
      PAIRES.map(function(pa, i){ return h("div", {key:i, className:"tel-tab"}, h("span", {className:"tel-tab-n"}, "T" + (i+1)),
        pa.map(function(n, j){ if(!n) return null; var p = cleH(n), ps = pastille(p), nm0 = affH(n), nom = nm0.length > 15 ? nm0.slice(0, 14) + "…" : nm0;
          return h("button", {key:j, type:"button", className:"tel-el" + (CO[p] === "att" ? " rouge" : ""), "data-va":"p-autonomie&eleve=" + encodeURIComponent(p), title:"Ouvre la fiche " + deNom(nm0) + "."}, h("span", {className:"nm"}, nom), h("span", {className:"tel-past " + ps.cls}, ps.t)); })); })),
    h("div", {key:"lg"}, TelLegende(["✅ bien lu", "🤔 peut-être mal lu : ce soir", "❌ mal lu : alerte", "⏳ pas encore"])),
    h("div", {key:"t"}, h(TelTerminer))]);
}

/* ── La fiche d'un élève sur le téléphone (« &eleve= ») : ce qu'on peut faire pour lui maintenant ── */
function TelFicheEleve(p){
  var k = MO(), m = momH(), qi = m.qi, el = p.eleve, sans = m.sansRep || [], au = autonomieDe(el, k);
  var s = useState(p.ouvert), ouvert = s[0], setOuvert = s[1], s2 = useState(null), fait = s2[0], setFait = s2[1], s3 = useState(false), garde = s3[0], setGarde = s3[1];
  // fermer la fiche : revenir à l'écran d'où un geste l'a ouverte ; sinon, la refermer sur place (en direct : NAV, src/live/pages.js)
  function fermer(){ if(enDirect() && typeof navFermer === "function" && typeof NAV !== "undefined" && NAV.ecran) return navFermer(); if(vientDUnGeste()) history.back(); else setOuvert(false); }
  // (QCM-2) en direct, le geste s'écrit dans la séance, puis la fiche se ferme ; dans la maquette, ce qu'il fait se lit dans la fiche
  function faire(txt, nom, args){ if(enDirect()){ agir(nom, args); fermer(); } else setFait(txt); }
  useEchapLocal(ouvert, fermer);
  if(!ouvert) return null;
  var il = sexeH(el) === "F" ? "elle" : "il", correction = ["lecture", "revele", "coeval", "bilan"].indexOf(m.ph) >= 0, pr = prenomH(el);
  var st = qi != null ? calc(el).st[qi] : null;
  var etat = fait || (correction ? "État actuel : Q" + (qi + 1) + " " + (st === "j" ? "juste" : st === "t" ? "trouvée au dernier moment" : "fausse") + " d'après sa feuille · point d'autonomie " + (au.retire ? "retiré " + au.quand : "gardé") + "."
    : "État actuel : " + (sans.indexOf(el) >= 0 ? "n'a pas encore répondu." : "a répondu à la question " + (qi + 1) + "."));
  var boutons = garde ? [
      h("div", {key:"g", className:"tel-etat"}, "Ses deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation. La note ne bouge pas."),
      h("button", Object.assign({key:"o", className:"tel-btn tb-rouge"}, clic("TFE:retirer:" + el, function(){ setGarde(false); faire("⛔ Point d'autonomie retiré à " + hhmm(m.heure) + ".", "retirerAutonomie", [el, "heure"]); })), "⛔ Retirer le point d'autonomie"),
      h("button", Object.assign({key:"n", className:"tel-btn tb-ghost"}, clic("TFE:annuler:" + el, function(){ setGarde(false); })), "Annuler")]
    : correction ? [
      h("button", Object.assign({key:"a", className:"tel-btn tb-rouge", disabled:au.retire || !!fait, title:au.retire || fait ? "Son point d'autonomie est déjà retiré." : "Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante."}, clic("TFE:garde:" + el, function(){ setGarde(true); })), "⛔ Retirer le point d'autonomie"),
      au.retire && enDirect() ? h("button", Object.assign({key:"r", className:"tel-btn tb-vert", title:"Rend son point d'autonomie à " + pr + " : ses deux compétences d'autonomie repassent en Très bonne maîtrise."}, clic("TFE:rendre:" + el, function(){ faire("", "rendreAutonomie", [el]); })), "↩️ Rendre") : null,
      h("button", Object.assign({key:"p", className:"tel-btn tb-ghost", disabled:!!fait, title:"Marque " + pr + " comme parti" + (il === "elle" ? "e" : "") + " : " + il + " ne bloque plus la classe."}, clic("TFE:parti:" + el, function(){ faire("🚪 " + nomDe(el) + " est parti" + (il === "elle" ? "e" : "") + " à " + hhmm(m.heure) + " : " + il + " ne bloque plus la classe.", "depart", [el]); })), "🚫 Marquer comme parti en cours de séance")]
    : [
      // (QCM-2) avant la première question, rien à rouvrir : la fiche garde « Marquer comme parti »
      qi != null && h("button", Object.assign({key:"r", className:"tel-btn tb-turq", disabled:sans.indexOf(el) < 0 || !!fait || m.ph !== "close" || !!((SCN.sess() || {}).rouverts || {})[qi], title:sans.indexOf(el) < 0 ? pr + " a répondu à cette question : il n'y a rien à rouvrir." : "Rouvre la question pour " + pr + " seul" + (il === "elle" ? "e" : "") + ", une seule fois."},
        clic("TFE:rouvrir:" + el, function(){ faire("🔁 Question " + (qi + 1) + " rouverte pour " + nomDe(el) + ", une seule fois.", "rouvrirPour", [qi, el]); })), "🔁 Rouvrir Q" + (qi + 1) + " pour cet élève uniquement (une seule fois)"),
      h("button", Object.assign({key:"p", className:"tel-btn tb-rouge", disabled:!!fait, title:"Marque " + pr + " comme parti" + (il === "elle" ? "e" : "") + " : " + il + " ne bloque plus la classe."}, clic("TFE:parti:" + el, function(){ faire("🚪 " + nomDe(el) + " est parti" + (il === "elle" ? "e" : "") + " à " + hhmm(m.heure) + " : " + il + " ne bloque plus la classe.", "depart", [el]); })), "🚫 Marquer comme parti en cours de séance")];
  return h(TelFeuille, {titre:nomDe(el), sous:placeDe(el), fermer:fermer, enfants:h(F, null, boutons, (qi != null || fait) && h("div", {className:"tel-etat"}, etat))});
}
function TelEleve(){ if(enDirect()) chargerHeure(); var m = momH(), el = paramEleve((m.sansRep || [])[0] || "Théo"); if(enDirect()) el = slugH(el); return h(F, null, telDuMoment(), paramHash("fiche") === "0" ? null : h(TelFicheEleve, {key:el, eleve:el, ouvert:true})); }
function TelAutonomie(){ if(enDirect()) chargerHeure(); var el = paramEleve("Hugo"); if(enDirect()) el = slugH(el); return h(F, null, telDuMoment(), h(TelFicheEleve, {key:el, eleve:el, ouvert:true})); }

/* ── La question en cours sur le téléphone : ses gestes restent sur le téléphone ── */
function TelReponse(){
  var k = MO(), m = momH(), qi = m.qi, c = SCN.compteurs(k), rep = SCN.repondu(qi, k);
  if(m.ph === "pause" && m.pause) m = Object.assign({}, m, {ph:m.pause.ph});
  var pc = SCN.premierCote(qi);
  var modeDe = function(p, cote){ if(m.ph === "reflexion") return {mode:"rep"}; if(m.tour === 1 && cote !== pc) return {mode:"voile"}; if(rep.indexOf(p) < 0) return {mode:"rep"}; return {qi:qi, mode:"q"}; };
  var suiv = enDirect() ? (suivanteQ(qi) == null ? null : suivanteQ(qi)) : qi + 1 < 3 ? qi + 1 : null, n = qi + 1;
  var apres = enDirect() ? true : m.ph === "reflexion" ? momentSiExiste("S08:Q" + n + ":T1") : m.tour === 1 ? momentSiExiste("S08:Q" + n + ":T2") : momentSiExiste("S08:Q" + n + ":C");
  var lib = m.ph === "reflexion" ? "✋ Autoriser la réponse" : m.tour === 1 ? "⏭️ Tour suivant" : "🔒 Clore la question";
  var act = m.ph === "reflexion" ? "autoriserReponse" : m.tour === 1 ? "tourSuivant" : "cloreQuestion";
  return TelCadre([
    TelBandeau(m.ph === "reflexion" ? "Phase : réflexion — Q " + c.question[0] + "/" + c.question[1] : "Phase : réponse — Q " + c.question[0] + "/" + c.question[1], m.ph === "reflexion" ? null : (m.tour === 1 ? "1er" : "2e") + " tour : moitiés de " + (coteDuTour(qi, m.tour) === "g" ? "gauche" : "droite")),
    h(TelChrono, {key:"c", reste:m.reste, total:m.ph === "reflexion" ? tempsDe(qi).reflexion : tempsDe(qi).reponse}),
    h("div", {key:"tt"}, h(TelTemps, {qi:qi})),
    h("div", {key:"q"}, TelQ(qi)),
    suiv != null && h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q" + (suiv + 1) + " : "), h("span", {className:"tel-suiv-e"}, EV.questions[suiv].enonce),
      h(TelGeste, {lib:"❌ Écarter", cls:"tel-mini-b", titre:"Écarte la question " + (suiv + 1) + ", après une confirmation : elle ne sera ni posée ni corrigée, et sort du total.",
        question:"❌ Écarter la question " + (suiv + 1) + " ?", corps:"Elle ne sera ni posée ni corrigée, et sort du total de la note et des compétences.", oui:"❌ Écarter la question " + (suiv + 1), fait:"❌ Question " + (suiv + 1) + " écartée — pas posée.", agir:function(){ agir("ecarter", [suiv]); }})),
    h("div", {key:"a", className:"tel-actions"},
      apres ? h("button", Object.assign({className:"tel-btn tb-vert tb-large"}, enDirect() ? geste(null, act) : {"data-va":m.tour === 2 ? "p-eleve&fiche=0" : "p-reponse", "data-moment":apres}), lib)
        : h("button", {className:"tel-btn tb-vert tb-large", disabled:true, title:"Le scénario de la maquette ne joue pas la suite de cette question sur le téléphone."}, lib),
      h("div", {className:"g2"}, h(BoutonPauseH, {tel:true}), h("button", Object.assign({className:"tel-btn tb-ghost tb-small", title:BULLES["🔄 Chrono"]}, clic("TEL:chrono", relancerChrono)), "🔄 Chrono"))),
    h("div", {key:"st"}, TelStats(qi, toutesQ().filter(function(x){ return x < qi; }))),
    h("div", {key:"l"}, TelListe("TABLETTES — " + (c.repondu ? c.repondu[0] + " / " + c.repondu[1] : "0 / " + c.presents) + " ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "✓+ une en trop", "½ une sur deux", "✗ faux", "🙈 attend son tour", "⏳ répond"])),
    h("div", {key:"t"}, h(TelTerminer))]);
}
/* ── La correction sur le téléphone : la question suivante et la précédente, sur le téléphone ── */
function suiteCorr(qi, sens){
  var pos = ORDRE_CORR.indexOf(qi), q2 = ORDRE_CORR[pos + sens];
  if(enDirect()) return q2 == null ? null : q2;
  return q2 == null ? null : momentSiExiste("S08:corr:Q" + (q2 + 1) + (sens > 0 ? ":L" : ":V"));
}
function boutonsCorrTel(qi, revele, pasLu, c){
  var pos = ORDRE_CORR.indexOf(qi), suiv = suiteCorr(qi, 1), prec = suiteCorr(qi, -1), derniere = pos === ORDRE_CORR.length - 1;
  var L = enDirect();
  var reveler = revele ? null : pasLu.length ? h("button", {className:"tel-btn tb-or tb-large ferme", disabled:true, title:"« 💡 Révéler » s'ouvre quand les " + c.presents + " présents ont lu la feuille de leur voisin. Il en manque " + pasLu.length + "."}, "🔒 Révéler — il en manque " + pasLu.length)
    : h("button", Object.assign({className:"tel-btn tb-or tb-large"}, L ? geste(null, "reveler") : {"data-va":"p-corr-apres", "data-moment":momentSiExiste("S08:corr:Q" + (qi + 1) + ":V")}), "💡 Révéler");
  var suivant = !revele ? null : derniere ? h("button", Object.assign({className:"tel-btn tb-primary tb-large", title:"Ouvre d'abord, sur chaque tablette, la co-évaluation de la lecture ; le bilan s'affiche quand tous les présents y ont répondu."}, L ? geste(null, "ouvrirCoeval") : {"data-va":"p-corr-apres", "data-moment":"S08:coeval"}), "🤝 Ouvrir la co-évaluation, puis leur bilan")
    : h("button", Object.assign({className:"tel-btn tb-primary tb-large", title:"Passe à la question suivante de la correction : chacun lit d'abord la feuille de son voisin."}, L ? geste(null, "questionSuivante") : {"data-va":"p-corr-avant", "data-moment":suiv}), "Question suivante →");
  var precedente = prec != null ? h("button", Object.assign({className:"tel-btn tb-ghost tb-small", title:"Revient à la question précédente de la correction, révélée."}, L ? geste(null, "questionPrecedente") : {"data-va":"p-corr-apres", "data-moment":prec}), "← Question précédente")
    : h("button", {className:"tel-btn tb-ghost tb-small ferme", disabled:true, title:"C'est la première question corrigée : il n'y a pas de question précédente."}, "← Question précédente");
  return h("div", {key:"a", className:"tel-actions"}, reveler, suivant, precedente);
}
function TelCorrAvant(){
  var k = MO(), m = momH(), qi = m.qi, c = SCN.compteurs(k), pasLu = m.pasLu || [], pos = ORDRE_CORR.indexOf(qi);
  var modeDe = function(p){ return pasLu.indexOf(p) >= 0 ? {mode:"pasrecopie"} : {mode:"recopie"}; };
  return TelCadre([
    TelBandeau("Phase : correction — Q" + (qi + 1) + " (" + (pos === 0 ? "1re" : (pos + 1) + "e") + " sur " + ORDRE_CORR.length + ")", "lecture de la feuille du voisin"),
    h("div", {key:"c", className:"tel-chrono orange"}, h("div", {className:"lb"}, "📄 Temps pour lire la feuille du voisin"), (m.reste || 0) + "s"),
    h("div", {key:"q"}, TelQ(qi)),
    boutonsCorrTel(qi, false, pasLu, c),
    pasLu.length > 0 && h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Feuille pas encore lue : "), pasLu.map(nomDe).join(" · "), InfoIB("Feuille pas encore lue", "Une tablette en panne : un clic sur le nom, puis « 🚫 Marquer comme parti en cours de séance ».")),
    h("div", {key:"st"}, h("div", {className:"tel-st-l"}, "📱 Sur les tablettes, avant la correction :"), TelStats(qi, toutesQ())),
    h("div", {key:"l"}, TelListe("TABLETTES — " + (c.lus ? c.lus[0] + " / " + c.lus[1] : "") + " feuilles lues · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["📄 feuille lue", "⏳ pas encore lue"])),
    h("div", {key:"t"}, h(TelTerminer))]);
}
function TelCorrApres(){
  var k = MO(), m = momH(), qi = m.qi == null ? ORDRE_CORR[ORDRE_CORR.length - 1] : m.qi, q = EV.questions[qi], lire = lireSoir(k), pos = ORDRE_CORR.indexOf(qi), c = SCN.compteurs(k);
  var flagDe = function(p){ return autonomieDe(p, k).retire ? "⛔" : lire.some(function(x){ return x[3].p === p && x[1] === qi; }) ? "⚠️" : null; };
  var res = SCN.presents(k).map(function(p){ return calc(p).st[qi]; });
  return TelCadre([
    TelBandeau(m.ph === "coeval" ? "Phase : co-évaluation de la lecture" : "Phase : correction — Q" + (qi + 1) + " (" + (pos === 0 ? "1re" : (pos + 1) + "e") + " sur " + ORDRE_CORR.length + ")", m.ph === "coeval" || m.ph === "bilan" ? null : "révélée"),
    h("div", {key:"q"}, TelQ(qi)),
    m.ph === "coeval" || m.ph === "bilan" ? null : boutonsCorrTel(qi, true, [], c),
    h("div", {key:"x", className:"tel-expl"}, h("div", {className:"t"}, "💡 EXPLICATION"), q.explication),
    h("div", {key:"su", className:"tel-suivi"}, "D'après la feuille : ", h("strong", null, res.filter(function(s){ return s === "j"; }).length + " / " + c.presents + " justes"), " · ✓ Trouvées au dernier moment : ", h("strong", null, res.filter(function(s){ return s === "t"; }).length)),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + lire.length + ") : "), lire.map(function(x){ return x[0] + " — Q" + (x[1]+1) + " : " + x[2]; }).join(" · ")),
    h("div", {key:"st"}, h("div", {className:"tel-st-l"}, "📱 Sur les tablettes, avant la correction :"), TelStats(qi, toutesQ())),
    h("div", {key:"l"}, TelListe("TABLETTES — d'après la feuille · clic sur un nom pour agir", function(){ return {qi:qi, mode:"corr"}; }, flagDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "✓ orange : Trouvée au dernier moment", "✗ faux", "⚠️ À relire ce soir", "⛔ point d'autonomie retiré"])),
    h("div", {key:"t"}, h(TelTerminer))]);
}

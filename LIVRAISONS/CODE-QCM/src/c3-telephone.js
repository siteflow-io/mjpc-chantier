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
      h("button", {className:"tel-x", "data-local":"1", title:"Ferme sans rien changer.", onClick:p.fermer}, "✕")),
    p.sous && h("div", {style:{fontSize:".78rem", opacity:.85, marginBottom:".6rem"}}, p.sous),
    p.enfants));
}
// un geste qui demande une confirmation : le bouton, sa feuille, puis ce qui est fait
function TelGeste(p){   // p : lib, cls, titre, question, corps, oui, fait
  var s = useState(0), etat = s[0], set = s[1];
  useEchapLocal(etat === 1, function(){ set(0); });
  if(etat === 2) return h("div", {className:"tel-fait"}, p.fait);
  return h(F, null,
    h("button", {className:"tel-btn " + p.cls, "data-local":"1", title:p.titre, onClick:function(){ set(1); }}, p.lib),
    etat === 1 && h(TelFeuille, {titre:p.question, fermer:function(){ set(0); }, enfants:h(F, null,
      p.corps && h("div", {className:"tel-etat"}, p.corps),
      h("button", {className:"tel-btn " + p.cls, "data-local":"1", title:p.titre, onClick:function(){ set(2); }}, p.oui),
      h("button", {className:"tel-btn tb-ghost", "data-local":"1", title:"Ne fait rien.", onClick:function(){ set(0); }}, "Annuler"))}));
}
function TelTerminer(){ return h(TelGeste, {lib:"🛑 Terminer la séance", cls:"tb-rouge tb-small", titre:"Termine la séance, après une confirmation : l'archive s'écrit avec les notes telles qu'elles sont.",
  question:"🛑 Terminer la séance ?", corps:"La séance est close, et l'archive s'écrit avec les notes telles qu'elles sont, quelle que soit la phase.", oui:"🛑 Terminer la séance",
  fait:"🛑 Séance terminée : les tablettes reviennent à « Combien êtes-vous sur cette tablette ? »."}); }

/* ── Les noms du téléphone : chacun ouvre la fiche de son élève, au même moment ── */
function TelListe(titre, modeDe, flagDe){
  var ph = MOM().ph, fiche = ["lecture", "revele", "coeval", "bilan"].indexOf(ph) >= 0 ? "p-autonomie" : "p-eleve";
  return h("div", {className:"tel-liste"},
    h("div", {className:"tel-liste-h"}, titre),
    PAIRES.map(function(pa, i){
      return h("div", {key:i, className:"tel-tab"},
        h("span", {className:"tel-tab-n"}, "T" + (i+1)),
        pa.map(function(n, k){
          if(!n) return null;
          var p = pre(n), md = modeDe(p, k === 0 ? "g" : "d"), ps = telPastille(p, md.qi, md.mode), fl = flagDe ? flagDe(p) : null;
          var nom = n.length > 15 ? n.slice(0, 14) + "…" : n;
          return h("button", {key:k, type:"button", className:"tel-el" + (md.mode === "pasrep" || md.mode === "pasrecopie" ? " rouge" : ""), "data-va":fiche + "&eleve=" + encodeURIComponent(p), title:"Ouvre la fiche " + deNom(n) + "."},
            h("span", {className:"nm"}, nom, fl && h("span", {className:"tel-flag"}, fl)),
            h("span", {className:"tel-past " + ps.cls}, ps.t));
        }));
    }));
}

/* ── Le téléphone du moment : la question en cours, close, ou la correction ── */
function momentSiExiste(k){ return SCN.moment(k) ? k : null; }
function TelClose(){
  var k = MO(), m = MOM(), qi = m.qi, c = SCN.compteurs(k), sans = m.sansRep || [], suiv = qi + 1 < 3 ? qi + 1 : null;
  var modeDe = function(p){ return sans.indexOf(p) >= 0 ? {mode:"pasrep"} : {qi:qi, mode:"q"}; };
  return TelCadre([
    TelBandeau("Phase : question close — Q " + c.question[0] + "/" + c.question[1], null),
    h("div", {key:"q"}, TelQ(qi)),
    suiv != null && h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q" + (suiv + 1) + " : "), h("span", {className:"tel-suiv-e"}, EV.questions[suiv].enonce)),
    h("div", {key:"a", className:"tel-actions"},
      suiv != null ? h("button", {className:"tel-btn tb-primary tb-large", "data-va":suiv === 1 ? "t-q2-reflexion" : "t-q3-tour1", "data-moment":momentDefaut(suiv === 1 ? "t-q2-reflexion" : "t-q3-tour1"), "data-appareil":"tablette"}, "🚀 Lancer Q" + (suiv + 1)) : null,
      sans.length ? h(TelGeste, {lib:"🔓 Rouvrir Q" + (qi + 1), cls:"tb-ghost tb-small", titre:"Rouvre la question " + (qi + 1) + " pour ceux qui n'ont pas répondu, après une confirmation. Une seule fois.",
          question:"🔓 Rouvrir la question " + (qi + 1) + " pour tous ?", corps:"Seuls ceux qui n'ont pas répondu la retrouvent, une seule fois : ici, " + sans.map(nomDe).join(", ") + ".", oui:"🔓 Rouvrir pour ceux qui n'ont pas répondu",
          fait:"🔓 Question " + (qi + 1) + " rouverte pour " + sans.map(nomDe).join(", ") + "."})
        : h("button", {className:"tel-btn tb-ghost tb-small", disabled:true, title:"Tous les présents ont répondu à cette question : il n'y a personne à rouvrir."}, "🔓 Rouvrir Q" + (qi + 1))),
    h("div", {key:"st"}, TelStats(qi, [0, 1, 2].filter(function(x){ return x <= qi; }))),
    h("div", {key:"l"}, TelListe("TABLETTES — " + c.repondu[0] + " / " + c.repondu[1] + " ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"t"}, h(TelTerminer))]);
}
function telDuMoment(){
  var ph = MOM().ph;
  if(MOM().seance === "S3E") return TelCoeval3();
  if(ph === "reponse" || ph === "passage" || ph === "b" || ph === "reflexion") return TelReponse();
  if(ph === "lecture") return TelCorrAvant();
  if(ph === "revele" || ph === "coeval" || ph === "bilan") return TelCorrApres();
  return TelClose();
}

/* ── La fiche d'un élève sur le téléphone (« &eleve= ») : ce qu'on peut faire pour lui maintenant ── */
function TelFicheEleve(p){
  var k = MO(), m = MOM(), qi = m.qi, el = p.eleve, sans = m.sansRep || [], au = autonomieDe(el, k);
  var s = useState(p.ouvert), ouvert = s[0], setOuvert = s[1], s2 = useState(null), fait = s2[0], setFait = s2[1], s3 = useState(false), garde = s3[0], setGarde = s3[1];
  // fermer la fiche : revenir à l'écran d'où un geste l'a ouverte ; sinon, la refermer sur place
  function fermer(){ if(vientDUnGeste()) history.back(); else setOuvert(false); }
  useEchapLocal(ouvert, fermer);
  if(!ouvert) return null;
  var il = SCN.SEXE[el] === "F" ? "elle" : "il", correction = ["lecture", "revele", "coeval", "bilan"].indexOf(m.ph) >= 0;
  var st = qi != null ? calc(el).st[qi] : null;
  var etat = fait || (correction ? "État actuel : Q" + (qi + 1) + " " + (st === "j" ? "juste" : st === "t" ? "trouvée au dernier moment" : "fausse") + " d'après sa feuille · point d'autonomie " + (au.retire ? "retiré " + au.quand : "gardé") + "."
    : "État actuel : " + (sans.indexOf(el) >= 0 ? "n'a pas encore répondu." : "a répondu à la question " + (qi + 1) + "."));
  var boutons = garde ? [
      h("div", {key:"g", className:"tel-etat"}, "Ses deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation. La note ne bouge pas."),
      h("button", {key:"o", className:"tel-btn tb-rouge", "data-local":"1", onClick:function(){ setGarde(false); setFait("⛔ Point d'autonomie retiré à " + hhmm(m.heure) + "."); }}, "⛔ Retirer le point d'autonomie"),
      h("button", {key:"n", className:"tel-btn tb-ghost", "data-local":"1", onClick:function(){ setGarde(false); }}, "Annuler")]
    : correction ? [
      h("button", {key:"a", className:"tel-btn tb-rouge", "data-local":"1", disabled:au.retire || !!fait, title:au.retire || fait ? "Son point d'autonomie est déjà retiré." : "Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante.", onClick:function(){ setGarde(true); }}, "⛔ Retirer le point d'autonomie"),
      h("button", {key:"p", className:"tel-btn tb-ghost", "data-local":"1", disabled:!!fait, title:"Marque " + el + " comme parti" + (il === "elle" ? "e" : "") + " : " + il + " ne bloque plus la classe.", onClick:function(){ setFait("🚪 " + nomDe(el) + " est parti" + (il === "elle" ? "e" : "") + " à " + hhmm(m.heure) + " : " + il + " ne bloque plus la classe."); }}, "🚫 Marquer comme parti en cours de séance")]
    : [
      h("button", {key:"r", className:"tel-btn tb-turq", "data-local":"1", disabled:sans.indexOf(el) < 0 || !!fait, title:sans.indexOf(el) < 0 ? el + " a répondu à cette question : il n'y a rien à rouvrir." : "Rouvre la question pour " + el + " seul" + (il === "elle" ? "e" : "") + ", une seule fois.",
        onClick:function(){ setFait("🔁 Question " + (qi + 1) + " rouverte pour " + nomDe(el) + ", une seule fois."); }}, "🔁 Rouvrir Q" + (qi + 1) + " pour cet élève uniquement (une seule fois)"),
      h("button", {key:"p", className:"tel-btn tb-rouge", "data-local":"1", disabled:!!fait, title:"Marque " + el + " comme parti" + (il === "elle" ? "e" : "") + " : " + il + " ne bloque plus la classe.", onClick:function(){ setFait("🚪 " + nomDe(el) + " est parti" + (il === "elle" ? "e" : "") + " à " + hhmm(m.heure) + " : " + il + " ne bloque plus la classe."); }}, "🚫 Marquer comme parti en cours de séance")];
  return h(TelFeuille, {titre:nomDe(el), sous:placeDe(el), fermer:fermer, enfants:h(F, null, boutons, h("div", {className:"tel-etat"}, etat))});
}
function TelEleve(){ var m = MOM(), el = paramEleve((m.sansRep || [])[0] || "Théo"); return h(F, null, telDuMoment(), paramHash("fiche") === "0" ? null : h(TelFicheEleve, {key:el, eleve:el, ouvert:true})); }
function TelAutonomie(){ var el = paramEleve("Hugo"); return h(F, null, telDuMoment(), h(TelFicheEleve, {key:el, eleve:el, ouvert:true})); }

/* ── La question en cours sur le téléphone : ses gestes restent sur le téléphone ── */
function TelReponse(){
  var k = MO(), m = MOM(), qi = m.qi, c = SCN.compteurs(k), rep = SCN.repondu(qi, k);
  var pc = SCN.premierCote(qi);
  var modeDe = function(p, cote){ if(m.ph === "reflexion") return {mode:"rep"}; if(m.tour === 1 && cote !== pc) return {mode:"voile"}; if(rep.indexOf(p) < 0) return {mode:"rep"}; return {qi:qi, mode:"q"}; };
  var suiv = qi + 1 < 3 ? qi + 1 : null, n = qi + 1;
  var apres = m.ph === "reflexion" ? momentSiExiste("S08:Q" + n + ":T1") : m.tour === 1 ? momentSiExiste("S08:Q" + n + ":T2") : momentSiExiste("S08:Q" + n + ":C");
  var lib = m.ph === "reflexion" ? "✋ Autoriser la réponse" : m.tour === 1 ? "⏭️ Tour suivant" : "🔒 Clore la question";
  return TelCadre([
    TelBandeau(m.ph === "reflexion" ? "Phase : réflexion — Q " + c.question[0] + "/" + c.question[1] : "Phase : réponse — Q " + c.question[0] + "/" + c.question[1], m.ph === "reflexion" ? null : (m.tour === 1 ? "1er" : "2e") + " tour : moitiés de " + (coteDuTour(qi, m.tour) === "g" ? "gauche" : "droite")),
    h(TelChrono, {key:"c", reste:m.reste, total:m.ph === "reflexion" ? tempsDe(qi).reflexion : tempsDe(qi).reponse}),
    h("div", {key:"tt"}, h(TelTemps, {qi:qi})),
    h("div", {key:"q"}, TelQ(qi)),
    suiv != null && h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q" + (suiv + 1) + " : "), h("span", {className:"tel-suiv-e"}, EV.questions[suiv].enonce),
      h(TelGeste, {lib:"❌ Écarter", cls:"tel-mini-b", titre:"Écarte la question " + (suiv + 1) + ", après une confirmation : elle ne sera ni posée ni corrigée, et sort du total.",
        question:"❌ Écarter la question " + (suiv + 1) + " ?", corps:"Elle ne sera ni posée ni corrigée, et sort du total de la note et des compétences.", oui:"❌ Écarter la question " + (suiv + 1), fait:"❌ Question " + (suiv + 1) + " écartée — pas posée."})),
    h("div", {key:"a", className:"tel-actions"},
      apres ? h("button", {className:"tel-btn tb-vert tb-large", "data-va":m.tour === 2 ? "p-eleve&fiche=0" : "p-reponse", "data-moment":apres}, lib)
        : h("button", {className:"tel-btn tb-vert tb-large", disabled:true, title:"Le scénario de la maquette ne joue pas la suite de cette question sur le téléphone."}, lib),
      h("div", {className:"g2"}, h(BoutonPauseTel), h("button", {className:"tel-btn tb-ghost tb-small", "data-local":"1", title:BULLES["🔄 Chrono"], onClick:function(){ document.dispatchEvent(new Event("maquette-relancer")); }}, "🔄 Chrono"))),
    h("div", {key:"st"}, TelStats(qi, [0, 1, 2].filter(function(x){ return x < qi; }))),
    h("div", {key:"l"}, TelListe("TABLETTES — " + (c.repondu ? c.repondu[0] + " / " + c.repondu[1] : "0 / " + c.presents) + " ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "✓+ une en trop", "½ une sur deux", "✗ faux", "🙈 attend son tour", "⏳ répond"])),
    h("div", {key:"t"}, h(TelTerminer))]);
}
/* ── La correction sur le téléphone : la question suivante et la précédente, sur le téléphone ── */
function suiteCorr(qi, sens){
  var pos = SCN.ORDRE_CORR.indexOf(qi), q2 = SCN.ORDRE_CORR[pos + sens];
  return q2 == null ? null : momentSiExiste("S08:corr:Q" + (q2 + 1) + (sens > 0 ? ":L" : ":V"));
}
function boutonsCorrTel(qi, revele, pasLu, c){
  var pos = SCN.ORDRE_CORR.indexOf(qi), suiv = suiteCorr(qi, 1), prec = suiteCorr(qi, -1), derniere = pos === 2;
  var reveler = revele ? null : pasLu.length ? h("button", {className:"tel-btn tb-or tb-large ferme", disabled:true, title:"« 💡 Révéler » s'ouvre quand les " + c.presents + " présents ont lu la feuille de leur voisin. Il en manque " + pasLu.length + "."}, "🔒 Révéler — il en manque " + pasLu.length)
    : h("button", {className:"tel-btn tb-or tb-large", "data-va":"p-corr-apres", "data-moment":momentSiExiste("S08:corr:Q" + (qi + 1) + ":V")}, "💡 Révéler");
  var suivant = !revele ? null : derniere ? h("button", {className:"tel-btn tb-primary tb-large", "data-va":"p-corr-apres", "data-moment":"S08:coeval", title:"Ouvre d'abord, sur chaque tablette, la co-évaluation de la lecture ; le bilan s'affiche quand tous les présents y ont répondu."}, "🤝 Ouvrir la co-évaluation, puis leur bilan")
    : h("button", {className:"tel-btn tb-primary tb-large", "data-va":"p-corr-avant", "data-moment":suiv, title:"Passe à la question suivante de la correction : chacun lit d'abord la feuille de son voisin."}, "Question suivante →");
  var precedente = prec ? h("button", {className:"tel-btn tb-ghost tb-small", "data-va":"p-corr-apres", "data-moment":prec, title:"Revient à la question précédente de la correction, révélée."}, "← Question précédente")
    : h("button", {className:"tel-btn tb-ghost tb-small ferme", disabled:true, title:"C'est la première question corrigée : il n'y a pas de question précédente."}, "← Question précédente");
  return h("div", {key:"a", className:"tel-actions"}, reveler, suivant, precedente);
}
function TelCorrAvant(){
  var k = MO(), m = MOM(), qi = m.qi, c = SCN.compteurs(k), pasLu = m.pasLu || [], pos = SCN.ORDRE_CORR.indexOf(qi);
  var modeDe = function(p){ return pasLu.indexOf(p) >= 0 ? {mode:"pasrecopie"} : {mode:"recopie"}; };
  return TelCadre([
    TelBandeau("Phase : correction — Q" + (qi + 1) + " (" + (pos === 0 ? "1re" : (pos + 1) + "e") + " sur 3)", "lecture de la feuille du voisin"),
    h("div", {key:"c", className:"tel-chrono orange"}, h("div", {className:"lb"}, "📄 Temps pour lire la feuille du voisin"), (m.reste || 0) + "s"),
    h("div", {key:"q"}, TelQ(qi)),
    boutonsCorrTel(qi, false, pasLu, c),
    pasLu.length > 0 && h("div", {key:"m", className:"tel-manquent"}, h("strong", null, "Feuille pas encore lue : "), pasLu.map(nomDe).join(" · "), InfoIB("Feuille pas encore lue", "Une tablette en panne : un clic sur le nom, puis « 🚫 Marquer comme parti en cours de séance ».")),
    h("div", {key:"st"}, h("div", {className:"tel-st-l"}, "📱 Sur les tablettes, avant la correction :"), TelStats(qi, [0, 1, 2])),
    h("div", {key:"l"}, TelListe("TABLETTES — " + c.lus[0] + " / " + c.lus[1] + " feuilles lues · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["📄 feuille lue", "⏳ pas encore lue"])),
    h("div", {key:"t"}, h(TelTerminer))]);
}
function TelCorrApres(){
  var k = MO(), m = MOM(), qi = m.qi == null ? SCN.ORDRE_CORR[2] : m.qi, q = EV.questions[qi], lire = lireSoir(k), pos = SCN.ORDRE_CORR.indexOf(qi), c = SCN.compteurs(k);
  var flagDe = function(p){ return autonomieDe(p, k).retire ? "⛔" : lire.some(function(x){ return x[3].p === p && x[1] === qi; }) ? "⚠️" : null; };
  var res = SCN.presents(k).map(function(p){ return calc(p).st[qi]; });
  return TelCadre([
    TelBandeau(m.ph === "coeval" ? "Phase : co-évaluation de la lecture" : "Phase : correction — Q" + (qi + 1) + " (" + (pos === 0 ? "1re" : (pos + 1) + "e") + " sur 3)", m.ph === "coeval" ? null : "révélée"),
    h("div", {key:"q"}, TelQ(qi)),
    m.ph === "coeval" ? null : boutonsCorrTel(qi, true, [], c),
    h("div", {key:"x", className:"tel-expl"}, h("div", {className:"t"}, "💡 EXPLICATION"), q.explication),
    h("div", {key:"su", className:"tel-suivi"}, "D'après la feuille : ", h("strong", null, res.filter(function(s){ return s === "j"; }).length + " / " + c.presents + " justes"), " · ✓ Trouvées au dernier moment : ", h("strong", null, res.filter(function(s){ return s === "t"; }).length)),
    h("div", {key:"lr", className:"tel-lire"}, h("strong", null, "📌 À lire ce soir (" + lire.length + ") : "), lire.map(function(x){ return x[0] + " — Q" + (x[1]+1) + " : " + x[2]; }).join(" · ")),
    h("div", {key:"st"}, h("div", {className:"tel-st-l"}, "📱 Sur les tablettes, avant la correction :"), TelStats(qi, [0, 1, 2])),
    h("div", {key:"l"}, TelListe("TABLETTES — d'après la feuille · clic sur un nom pour agir", function(){ return {qi:qi, mode:"corr"}; }, flagDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "✓ orange : Trouvée au dernier moment", "✗ faux", "⚠️ À relire ce soir", "⛔ point d'autonomie retiré"])),
    h("div", {key:"t"}, h(TelTerminer))]);
}

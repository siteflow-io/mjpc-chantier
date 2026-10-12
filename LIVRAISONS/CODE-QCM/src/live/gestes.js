/* ═══════════════ QCM-1 · SOCLE — le routeur des gestes ═══════════════
   Dans la maquette, un clic sautait à la scène suivante (data-va, versScene). Dans l'app, il fait ce que la scène suivante montrait :
   l'action dans la base (ACT pour Paul, ELV pour l'élève), ou l'ouverture sur place de la fenêtre, de l'onglet ou de la fiche (NAV).
   La table d'équivalence (écran de départ, geste, action) est écrite pour QCM-2 et QCM-3 dans src/live/gestes.json ; elle se lit ici :
   GESTES.ACTIONS (par libellé), GESTES.FENETRES (les écrans qui s'ouvrent sur place), GESTES.ONGLETS, et les gestes de l'élève. */
var LANCEMENT = {classe:null, evalId:null, mode:null};   // la classe et l'évaluation choisies au lancement (les menus de « 🎯 Pilotage classe »)
var APPEL = {absents:null};                    // les absents cochés à l'appel (ListeAppel)
var GESTES = (function(){
  var G = {};
  function qDe(el){ var a = el && el.closest ? el.closest("[data-q]") : null; if(a) return Number(a.getAttribute("data-q")) - 1; if(NAV.params.q) return Number(NAV.params.q) - 1; var m = MOM(); return m.qi; }
  function slugDuNom(t){ t = String(t || "").trim(); if(!t) return null; var l = SCN.eleves(), s = sanMJPC(t); if(l.indexOf(t) >= 0) return t; if(l.indexOf(s) >= 0) return s;
    return l.filter(function(x){ return SCN.pre(x) === t || SCN.nomDe(x) === t; })[0] || l.filter(function(x){ return t.indexOf(SCN.nomDe(x)) >= 0; })[0] || null; }
  G.slugDuNom = slugDuNom;
  function paramDe(el, n){ var va = el && el.getAttribute && el.getAttribute("data-va"); if(va){ var m = new RegExp("[&]" + n + "=([^&]+)").exec(va); if(m) return decodeURIComponent(m[1]); } return NAV.params[n] != null ? String(NAV.params[n]) : null; }
  function eleveDuGeste(el){ return slugDuNom(paramDe(el, "eleve") || paramDe(el, "parti") || paramDe(el, "retire") || (el.closest(".depart-l, [data-eleve]") ? (el.closest("[data-eleve]") ? el.closest("[data-eleve]").getAttribute("data-eleve") : el.closest(".depart-l").textContent.split(" — ")[0]) : null)); }
  function dansFenetre(el){ return !!(el.closest && el.closest(".checkin-overlay, .modal-back, .fen-fond, .sessions-menu-overlay, .tel-sheet-fond")); }
  function seance(el){ return paramDe(el, "seance") || SCN.sid(); }
  function apres(p){ return Promise.resolve(p).then(function(){ navRemettre(); }, function(e){ console.error(e); navRemettre(); }); }
  // le lancement : la classe et l'évaluation des menus ; à défaut, la classe de la séance pilotée et la première évaluation prête
  function choixLancement(){
    var cl = LIVE.d.classes || {}, classe = LANCEMENT.classe && cl[LANCEMENT.classe] ? LANCEMENT.classe : null, ev = LANCEMENT.evalId;
    if(!classe){ var l = SCN.classes(); classe = LIVE.classeSlug && cl[LIVE.classeSlug] ? LIVE.classeSlug : l[0]; }
    if(!ev || !SCN.evalParId(ev)){ var pretes = SCN.evals().filter(function(e){ return !SCN.manques(e).length; }); ev = pretes[0] ? pretes[0].id : null; }
    return {classe:classe, evalId:ev};
  }
  G.choixLancement = choixLancement;
  /* ── Les gestes de Paul, par libellé : [motif, quand (fenêtre ou non), action] ── */
  G.ACTIONS = [
    // la séance sur papier : depuis « 📄 Séance sur papier » (c-papier-lancer), le lancement porte {mode : "papier"}
    [/^🚀 Lancer la séance\s*$|^📄 Lancer la séance sur papier$/, "hors-appel", function(el){ var c = choixLancement(); if(!c.classe || !c.evalId) return; LIVE.classeSlug = c.classe;
      var papier = NAV.ecran === "c-papier-lancer" || /sur papier/.test(etiquetteDe(el)) || LANCEMENT.mode === "papier";
      return ACT.lancerSeance(c.classe, c.evalId, papier ? {mode:"papier"} : {}).then(function(){ navRemettre(); }); }],
    // l'heure de fin tapée à l'appel (« 🕙 Fin de l'heure ») part avec l'appel
    [/^🚀 Lancer la séance\s*$/, "appel", function(el){ var f = null, zone = el.closest(".checkin-overlay") || document;
      Array.prototype.forEach.call(zone.querySelectorAll("input"), function(i){ if(/^\d{1,2}[:h]\d{2}$/.test((i.value || "").trim())) f = i.value.trim().replace("h", ":"); });
      return apres(ACT.appelFini(APPEL.absents || SCN.absents(), f)); }],
    [/^🎓 Lancer la démo$/, null, function(){ var c = choixLancement(); if(!c.classe) return; return ACT.lancerSeance(c.classe, "demo", {}).then(function(){ navRemettre(); }); }],
    [/^🚀 Lancer le rattrapage$/, null, function(){ var c = choixLancement(); var notes = SCN.seances(c.classe).filter(function(s){ return s.eval === c.evalId && s.fin; }), deja = {};
      notes.forEach(function(s){ SCN.eleves(s.id).forEach(function(x){ if(SCN.absents(s.id).indexOf(x) < 0) deja[x] = 1; }); });
      var seuls = SCN.roster(c.classe).map(sanMJPC).filter(function(x){ return !deja[x]; });
      return ACT.lancerSeance(c.classe, c.evalId, {rattrapage:true, eleves:seuls, paires:seuls.map(function(x){ return [x, null]; })}).then(function(){ navRemettre(); }); }],
    [/^▶️ Lancer Q(\d+)$|^🚀 Lancer Q(\d+)$/, null, function(el, m){ return apres(ACT.lancerQuestion(Number(m[1] || m[2]) - 1)); }],
    [/Autoriser la réponse/, null, function(){ return ACT.autoriserReponse(); }],
    [/Tour suivant/, null, function(){ return ACT.tourSuivant(); }],
    [/Clore la question/, null, function(){ return apres(ACT.cloreQuestion()); }],
    [/^⏸️ Pause$/, null, function(){ return ACT.pause(); }],
    [/^▶️ Reprendre$/, null, function(){ return ACT.reprendre(); }],
    [/Relancer chrono|^🔄 Chrono$/, null, function(){ return ACT.relancerChrono(); }],
    [/Lancer l'autoévaluation|Lancer l’autoévaluation/, null, function(){ return apres(ACT.lancerEstimation()); }],
    [/Lancer la correction/, null, function(){ return apres(ACT.lancerCorrection()); }],
    [/^💡 Révéler/, null, function(){ return apres(ACT.reveler()); }],
    [/^Question suivante/, null, function(){ return apres(ACT.questionSuivante()); }],
    [/co-évaluation/i, "bouton-console", function(){ return apres(ACT.ouvrirCoeval()); }],
    [/Afficher leur bilan aux élèves/, null, function(){ return apres(ACT.afficherBilan()); }],
    [/^❌ Écarter la question (\d+)$/, null, function(el, m){ return apres(ACT.ecarter(Number(m[1]) - 1)); }],
    [/^⚠️ Annuler la question (\d+)$/, null, function(el, m){ return apres(ACT.annuler(Number(m[1]) - 1)); }],
    [/^↩️ Remettre$/, null, function(el){ return apres(ACT.remettre(qDe(el))); }],
    [/^🔓 Rouvrir pour tous$/, "fenetre", function(el){ return apres(ACT.rouvrirTous(qDe(el))); }],
    [/^🔓 Rouvrir pour (.+)$|^🔁 Rouvrir Q\d+ pour cet élève/, "fenetre-ou-tel", function(el, m){ var x = eleveDuGeste(el) || slugDuNom(m[1]); var q = MOM().qi; return apres(ACT.rouvrirPour(q, x)); }],
    [/^🚫 Parti$|^🚫 Marquer comme parti/, null, function(el){ var x = eleveDuGeste(el); return x ? apres(ACT.depart(x)) : null; }],
    [/^↩️ Revenu$/, null, function(el){ var x = eleveDuGeste(el); return x ? apres(ACT.retour(x)) : null; }],
    [/^🛑 Terminer la séance$/, "fenetre", function(el){ return ACT.terminer(paramDe(el, "seance") || null).then(function(){ navRemettre(); }); }],
    [/^🛑 Terminer$/, "fenetre", function(el){ return ACT.terminer(paramDe(el, "seance") || null).then(function(){ navRemettre(); }); }],
    [/^⏸️ Finir à une autre heure$/, "fenetre", function(){ return apres(ACT.finirAutreHeure()); }],
    [/^🔓 Rouvrir la séance$/, "fenetre", function(el){ return apres(ACT.rouvrirSeance(paramDe(el, "seance"))); }],
    [/^🔄 Reprendre la séance$/, "fenetre", function(){ return apres(ACT.reprendre()); }],
    [/^▶️ Reprendre la séance du/, null, function(el){ var id = paramDe(el, "seance") || (SCN.seancesAvant().filter(function(s){ return s.enPause; })[0] || {}).id; return id ? apres(ACT.lancerSeance(null, null, {reprise:id})) : null; }],
    [/^⛔ Retirer le point d'autonomie$/, "fenetre", function(el){ var x = eleveDuGeste(el); return x ? apres(ACT.retirerAutonomie(x, SCN.etat() && ["fin"].indexOf(SCN.etat().ph) < 0 && SCN.sid() === seance(el) ? "heure" : "soir", seance(el))) : null; }],
    [/^↩️ Rendre$/, null, function(el){ var x = eleveDuGeste(el); return x ? ACT.rendreAutonomie(x, seance(el)) : null; }],
    [/^📤 Rendre les copies$|^Rendre les copies$|^✅ Rendre les copies$/, "fenetre", function(el){ return apres(ACT.rendreCopies(seance(el))); }],
    [/Masquer les copies/, null, function(el){ return ACT.masquerCopies(seance(el)); }]
  ];
  G.action = function(el){
    var lib = typeof etiquetteDe === "function" ? etiquetteDe(el) : (el.textContent || "").trim(), app = LIVE.appareil();
    if(app !== "console" && app !== "telephone") return null;
    for(var i = 0; i < G.ACTIONS.length; i++){
      var a = G.ACTIONS[i], m = a[0].exec(lib); if(!m) continue;
      var quand = a[1], fen = dansFenetre(el), ph = (SCN.etat() || {}).ph;
      if(quand === "fenetre" && !fen) continue;
      if(quand === "fenetre-ou-tel" && !fen && app !== "telephone") continue;
      if(quand === "appel" && !(ph === "appel" && SCN.sid())) continue;
      if(quand === "hors-appel" && ph === "appel" && SCN.sid()) continue;
      if(quand === "bouton-console" && (fen || !/^(👥|🔎|📋|🤝|▶️|🚀|✅|🏁)?\s*(Lancer|Ouvrir)/.test(lib))) continue;
      return {m:m, f:a[2], lib:lib};
    }
    return null;
  };
  /* ── Où mène un geste qui ne fait rien dans la base : un onglet, une fenêtre sur place, ou le retour à l'écran du moment ── */
  G.ONGLETS = ["c-evals", "c-seances", "c-sauvegarde", "c-reglages", "c-mode-emploi", "c-corbeille", "c-importer", "c-purger", "c-reglages-prompt", "c-reglages-prompt-modifier",
    "c-collage", "x627-3-editeur", "c-feuille", "c-eval-corbeille", "c-resultats", "c-resultats-rendues", "c-fiche", "c-que-dit-la-feuille", "c-seances-lues", "c-copies-rendues", "x632-pdf",
    "c-papier-grille", "c-rattrapage", "x620-1-mode-test-ouverture", "e-mes-evals", "e-bilan-lou"];
  G.MOMENT = ["c-lancer", "c-q1-reflexion", "c-q1-tour1", "c-q1-tour2", "c-q1-close", "c-q2-tour2", "c-q2-close", "c-q3-close", "c-ecartee", "c-annulee", "c-parti", "c-fin-prevue",
    "c-deplacer", "c-pret", "c-estim", "c-attest2", "c-corr-q2-avant", "c-corr-q2-lu", "c-corr-q2-apres", "c-corr-q3-apres", "c-corr-q1-apres", "c-coeval-attente", "c-coeval-tranche",
    "c-coeval-retire-michel", "c-coeval-retire-julien", "c-coeval-retire-deux", "c-bilan", "c-autonomie-retiree", "c-reprendre", "c-papier-reprendre", "p-reponse", "p-corr-avant", "p-corr-apres",
    "c-appel", "c-demo-lancer", "c-demo-faite", "c-interrompue"];
  G.aller = function(id){
    var p = String(id).split("&"), sc = p[0], params = {};
    p.slice(1).forEach(function(x){ var i = x.indexOf("="); if(i > 0 && !/^(m|de|cap)$/.test(x.slice(0, i))) params[x.slice(0, i)] = decodeURIComponent(x.slice(i + 1)); });
    var app = LIVE.appareil();
    if(app === "tablette" || /^t-|^x610-[0-9]/.test(sc)) return;            // la tablette suit la séance : ses écrans ne se choisissent pas
    if(app === "accueil"){ if(sc === "t-combien"){ G.modeEleve(); } return; }
    if(sc === "c-accueil"){ if(NAV.ecran || NAV.pile.length) navRemettre(); else { LIVE.modeChoisi = null; location.hash = ""; LIVE.changer(); } return; }
    if(sc === "b-reponse"){ window.open(location.pathname + "#mode=prof&view=board", "BoardWindow"); return; }
    if(G.MOMENT.indexOf(sc) >= 0 && !(sc === "c-appel" && !SCN.sid())){ if(Object.keys(params).length && sc !== "c-lancer"){ NAV.params = params; } navRemettre(); return; }
    if(G.ONGLETS.indexOf(sc) >= 0){ NAV.pile = []; NAV.ecran = sc; NAV.params = params; LIVE.changer(); return; }
    navOuvrir(sc, params);   // une fenêtre, une fiche : sur place, par-dessus l'écran du moment
  };
  G.modeEleve = function(){ LIVE.modeChoisi = "tablette"; try { history.replaceState(null, "", location.pathname + "#mode=eleve"); } catch(e){ location.hash = "#mode=eleve"; } LIVE.changer(); };
  G.modeProf = function(){ LIVE.modeChoisi = "console"; try { history.replaceState(null, "", location.pathname + "#mode=prof"); } catch(e){ location.hash = "#mode=prof"; } NAV.ecran = "c-evals"; LIVE.changer(); };

  /* ── Les gestes de l'élève, dans sa moitié : chaque clic s'écrit dans la base ── */
  function moitieDe(el){ var m = el.closest(".moitie"); if(!m) return ELV.cotes.g ? "g" : null; return m.classList.contains("d") ? "d" : "g"; }
  function indexChoix(el, qi){ var ev = SCN.ev(); if(!ev || qi == null) return -1; var t = (el.textContent || "").replace(/\s+/g, " ").trim(); return ev.questions[qi].choix.map(function(c){ return String(c).replace(/\s+/g, " ").trim(); }).indexOf(t); }
  G.eleve = function(el){
    if(LIVE.appareil() !== "tablette") return false;
    var cote = moitieDe(el); if(!cote) return false; var x = ELV.cotes[cote]; if(!x) return false; ELV.moitie(cote);
    var m = MOM(), ph = m.ph, qi = m.qi, zone = el.closest(".moitie") || document;
    if(el.classList.contains("eleve-choix-btn") && !el.closest(".fige-choix")){
      if(ph === "reponse" || ph === "rouvert"){
        var r = SCN.reponse(x, qi), sel = r ? r.choix.slice() : [], i = indexChoix(el, qi); if(i < 0) return true;
        sel = sel.indexOf(i) >= 0 ? sel.filter(function(y){ return y !== i; }) : sel.concat([i]); ELV.repondre(qi, sel, x); return false;
      }
      if(ph === "lecture"){
        var l = SCN.lecture(x, qi), cur = l && l.choix !== "aucun" ? l.choix.slice() : [];
        if(el.classList.contains("aucun")){ ELV.lire(qi, l && l.choix === "aucun" ? [] : "aucun", x); return false; }
        var j = indexChoix(el, qi); if(j < 0) return true;
        cur = cur.indexOf(j) >= 0 ? cur.filter(function(y){ return y !== j; }) : cur.concat([j]); ELV.lire(qi, cur.length ? cur : [], x); return false;
      }
      if(ph === "coeval"){ var cv = zone.querySelector(".co-btn.on"), k = cv ? (cv.classList.contains("mal") ? "mal" : cv.classList.contains("peut") ? "peut" : "ok") : "mal";
        var qc = G.coevalQ[x], idx = indexChoix(el, qc), prev = (SCN.coevalDe(x) || {}).ecrit, ec = el.classList.contains("aucun") ? "aucun" : (Array.isArray(prev) ? prev.slice() : []);
        if(ec !== "aucun" && idx >= 0) ec = ec.indexOf(idx) >= 0 ? ec.filter(function(y){ return y !== idx; }) : ec.concat([idx]);
        if(qc != null) ELV.coeval(k, qc, ec, x); return false; }
      return false;
    }
    if(el.classList.contains("decl-b-btn")){ ELV.direB(qi, /^Oui/.test((el.textContent || "").trim()) ? "oui" : "non", x); return false; }
    if(el.classList.contains("autoeval-fourchette")){ var f = /fourchette-(vert|bleu|orange|rouge)/.exec(el.className); if(f) ELV.estimer(f[1], x); return false; }
    if(el.classList.contains("case-b")){ var cases = Array.prototype.slice.call(zone.querySelectorAll(".case-b")), n = cases.indexOf(el) + 1; ELV.cocher(ph === "att2" ? 2 : 1, n, x); return false; }
    if(el.classList.contains("attest-go")){ ELV.commencer(x, ph === "att2" ? 2 : 1); return false; }
    if(el.classList.contains("co-btn")){ var s = el.classList.contains("ok") ? "ok" : el.classList.contains("peut") ? "peut" : "mal"; if(s === "ok") ELV.coeval("ok", null, null, x); return false; }
    if(el.classList.contains("co-lb")){ var t = /Question (\d+)/.exec(el.textContent || ""); if(t){ G.coevalQ[x] = Number(t[1]) - 1; var cv2 = zone.querySelector(".co-btn.on"); var k2 = cv2 && cv2.classList.contains("peut") ? "peut" : "mal"; ELV.coeval(k2, G.coevalQ[x], null, x); } return false; }
    return false;
  };
  G.coevalQ = {};
  return G;
})();

/* versScene : dans l'app, un geste n'ouvre plus de scène ; il passe par le routeur */
versScene = function(id){ GESTES.aller(id); };
fermerVers = function(defaut){ if(NAV.ecran || NAV.pile.length) navFermer(); else GESTES.aller(defaut); };
vientDUnGeste = function(){ return !!NAV.pile.length; };

/* Les clics, avant ceux de la maquette : une action de Paul l'emporte sur la scène où le bouton menait */
window.addEventListener("click", function(ev){
  var b = ev.target && ev.target.closest ? ev.target.closest("#root button, #root .tel-el, #root .qdf-c, #root [data-va]") : null;
  if(!b || b.disabled) return;
  // un bouton « data-local » est tenu par son composant (qui appelle ACT ou ELV lui-même) : le routeur n'y ajoute rien
  if(b.hasAttribute("data-local")) return;
  if(LIVE.appareil() === "tablette"){ if(typeof EcranTablette !== "function") GESTES.eleve(b); return; }
  var a = GESTES.action(b);
  if(a){ ev.stopImmediatePropagation(); ev.preventDefault(); LIVE.log("geste", a.lib); try { var r = a.f(b, a.m); if(r && r.catch) r.catch(function(e){ console.error(e); }); } catch(e){ console.error(e); } return; }
  // une fenêtre ouverte sur place se ferme par son bouton qui ferme (✕, Annuler, Fermer), en revenant à l'écran d'où elle s'est ouverte
  var lib = typeof etiquetteDe === "function" ? etiquetteDe(b) : "";
  if(NAV.pile.length && typeof FERMER_C3 !== "undefined" && FERMER_C3.test(lib) && b.closest("[data-echap], .modal-back, .checkin-overlay, .sessions-menu-overlay")){
    // l'appel annulé : la séance n'est pas lancée
    ev.stopImmediatePropagation(); ev.preventDefault(); navFermer(); return; }
  if(lib === "Annuler" && (SCN.etat() || {}).ph === "appel" && b.closest(".checkin-overlay")){ ev.stopImmediatePropagation(); ev.preventDefault(); ACT.abandonner().then(navRemettre); return; }
}, true);
// Échap ferme la fenêtre ouverte sur place
window.addEventListener("keydown", function(ev){ if(ev.key === "Escape" && NAV.pile.length && LIVE.appareil() !== "tablette"){ ev.stopImmediatePropagation(); navFermer(); } }, true);
// les menus du lancement : la classe et l'évaluation choisies (une valeur qui est une classe, ou une évaluation)
document.addEventListener("change", function(ev){
  var s = ev.target; if(!s || s.tagName !== "SELECT") return;
  var v = s.value, o = s.options[s.selectedIndex], t = o ? o.textContent : "";
  var cl = LIVE.d.classes || {};
  if(cl[v]) LANCEMENT.classe = v; else { var c = Object.keys(cl).filter(function(k){ return t.indexOf(k) === 0 || (cl[k].libelle && t.indexOf(cl[k].libelle) === 0); })[0]; if(c && !SCN.evalParId(v)) LANCEMENT.classe = c; }
  if(SCN.evalParId(v)) LANCEMENT.evalId = v; else { var e = SCN.evals().filter(function(x){ return x.titre === t || t.indexOf(x.titre) >= 0; })[0]; if(e && !cl[v]) LANCEMENT.evalId = e.id; }
  LIVE.changer();
}, true);

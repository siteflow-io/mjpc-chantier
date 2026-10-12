/* ═══════════════ Complément 3 — chaque geste mène au bon endroit (changement 4) ═══════════════
   Un geste garde le moment de la scène : la scène où il mène s'ouvre au même moment (« &m= »), sauf s'il déclare en changer
   (data-moment : le geste fait avancer la séance). Il garde aussi l'objet cliqué, dans l'adresse (« &q= », « &eleve= », « &eval= »,
   « &seance= », « &tab= »). Une fenêtre ouverte par un geste (« &de=1 ») se ferme sur l'écran d'où on l'a ouverte : Échap,
   « ✕ », « Annuler », « Fermer » reviennent en arrière. Un geste ne change d'appareil que s'il le déclare (data-appareil). */
var GESTE_CLIQUE = null;
window.addEventListener("click", function(ev){ GESTE_CLIQUE = ev.target && ev.target.closest ? ev.target.closest("#root button,#root [data-va]") : null; }, true);
function sceneParId(id){ return SCENES.filter(function(s){ return s.id === id; })[0] || null; }
function momentDefaut(id){ var sc = sceneParId(id); return (sc && sc.moment) || SCN.MOMENT_DE[id] || null; }
function vientDUnGeste(){ return /[#&]de=1(&|$)/.test(location.hash || ""); }
function versScene(id){
  var el = GESTE_CLIQUE; GESTE_CLIQUE = null;
  var p = String(id).split("&"), sc = p[0], params = p.slice(1).filter(function(x){ return x && !/^(m|de|cap)=/.test(x); });
  var mDit = p.slice(1).filter(function(x){ return /^m=/.test(x); })[0];
  var decl = el && el.closest ? el.closest("[data-moment]") : null;
  var m = mDit ? decodeURIComponent(mDit.slice(2)) : decl ? decl.getAttribute("data-moment") : window.MOMENT_COURANT;
  if(m && m !== momentDefaut(sc)) params.push("m=" + encodeURIComponent(m));
  if(el) params.push("de=1");
  if(/[#&]cap=1/.test(location.hash)) params.push("cap=1");
  location.hash = "#scene=" + sc + (params.length ? "&" + params.join("&") : "");
}
// fermer une fenêtre : revenir à l'écran d'où un geste l'a ouverte ; sinon, à l'écran que la fenêtre nomme
function fermerVers(defaut){ if(vientDUnGeste()) history.back(); else versScene(defaut); }
var FERMER_C3 = /^(✕|×|Annuler|Fermer|✕ Fermer|OK|Compris|✓ J'ai compris|J'ai compris|← Retour à la liste)$/;
window.addEventListener("click", function(ev){
  var b = ev.target && ev.target.closest ? ev.target.closest("#root button") : null;
  if(!b || b.disabled || b.hasAttribute("data-local") || !vientDUnGeste()) return;
  var couche = b.closest("[data-echap]"); if(!couche) return;
  var va = b.getAttribute("data-va");
  if(va === couche.getAttribute("data-echap") || (!va && FERMER_C3.test(etiquetteDe(b))) || (va && FERMER_C3.test(etiquetteDe(b)) && va.split("&")[0] === couche.getAttribute("data-echap").split("&")[0])){
    ev.stopImmediatePropagation(); ev.preventDefault(); history.back();
  }
}, true);
// (changement 7.7) Échap ferme chaque fenêtre : une fenêtre ouverte sur place (sans adresse) se ferme par son bouton qui ferme
var COUCHES_C3 = ".modal-back,.checkin-overlay,.sessions-menu-overlay,.tel-sheet-fond,.grand-fond,.fen-fond,.at-modale,.feuille-fond";
window.addEventListener("keydown", function(ev){
  if(ev.key !== "Escape" || window.SOMMAIRE_OUVERT) return;
  var cs = Array.prototype.filter.call(document.querySelectorAll("#root " + COUCHES_C3.split(",").join(",#root ")), function(c){ return c.getBoundingClientRect().width > 1; });
  var c = cs[cs.length - 1]; if(!c || c.hasAttribute("data-echap") || c.closest("[data-echap]")) return;
  var b = Array.prototype.filter.call(c.querySelectorAll("button"), function(x){ return !x.disabled && !x.closest(".preview") && FERMER_C3.test(etiquetteDe(x)); })[0];
  if(b){ ev.stopImmediatePropagation(); ev.preventDefault(); b.click(); }
}, true);
window.addEventListener("keydown", function(ev){
  if(ev.key !== "Escape" || window.SOMMAIRE_OUVERT || !vientDUnGeste()) return;
  if(document.querySelector("#root .modal .preview")) return;              // l'éditeur a sa garde (c3-evals.js)
  if(!document.querySelector("#root [data-echap]")) return;
  ev.stopImmediatePropagation(); ev.preventDefault(); history.back();
}, true);

/* ── L'en-tête de la console : chaque geste nomme sa destination, au moment de la scène (12.4 : plus de table par libellé seul) ── */
function seanceEnCours(){ var m = MOM(); return !!m.seance && ["avant", "hors", "soir", "fin", "grille"].indexOf(m.ph) < 0 && m.seance !== "TEST"; }
// (QCM-1) la vue tableau de la 7.7.1 (l. 6022) : la même adresse, dans sa fenêtre
function ouvrirTableau(){ window.open(location.pathname + "#mode=prof&view=board", "BoardWindow", "width=1280,height=800"); }
function Console(groupe, tab, contenu, séance){
  var groupes = [["pilotage","Pilotage","c-lancer"],["donnees","Données","c-seances"],["reglages","Réglages","c-reglages"]];
  var sous = {pilotage:[["evals","📝 Évaluations","c-evals"],["pilot","🎯 Pilotage classe","c-lancer"]], donnees:[["results","📊 Résultats","c-seances"],["snapshot","💾 Sauvegarde","c-sauvegarde"]], reglages:[]};
  var enCours = seanceEnCours();
  return h("div", {className:"prof-wrap cons"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"prof full"},
      h("div", {className:"prof-header"},
        h("h1", null, "📝 Évaluation QCM", h("span", {className:"badge"}, "Mode prof")),
        h("div", {className:"row"},
          // (QCM-1) les séances actives de la base, toutes classes : « 🔴 1 séance en cours », « 🔴 2 séances en cours »
          (function(){ var n = typeof SCN.seancesActives === "function" ? SCN.seancesActives().length : (séance ? 1 : 0); return n > 0 && h("button", {className:"badge-session-actives", "data-va":"c-sessions"}, h("span", {className:"badge-session-dot"}, "🔴"), n + (n > 1 ? " séances en cours" : " séance en cours")); })(),
          h("button", {className:"btn-help", "data-va":"c-mode-emploi"}, "📖 Mode d'emploi"),
          // le tableau tel qu'il est maintenant ; hors séance, son écran d'attente
          h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", onClick:ouvrirTableau}, "📺 Ouvrir vue tableau"),
          h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-qr"}, "📱 QR pilotage"),
          h("button", {className:"btn-test", "data-va":"x620-1-mode-test-ouverture", "data-moment":"TEST:avant"}, "🧪 Mode test", InfoI("Le mode test : une classe de test de 30 élèves et ses 15 tablettes simulées, pour éprouver le déroulé sans toucher tes vraies classes. À la sortie, tout est effacé, sauf la démo.")),
          // « ← Retour » revient à l'écran précédent de la console, comme son infobulle le dit ; ouvert tout seul, à l'accueil de l'app
          h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", onClick:function(){ if(vientDUnGeste()) history.back(); else versScene("c-accueil"); }}, "← Retour"))),
      h("div", {className:"tabs"}, h("div", {className:"nav2"},
        h("div", {className:"nav2-groupes"}, groupes.map(function(g){ return h("button", {key:g[0], className:"nav2-groupe" + (g[0] === groupe ? " actif" : ""), "data-va":g[2]}, g[1]); }), h("button", {className:"nav2-aide", "data-va":"c-mode-emploi"}, "?")),
        // (relecteur n°297) un groupe sans sous-onglets n'a pas de rangée vide
        sous[groupe].length > 0 && h("div", {className:"nav2-sous"}, sous[groupe].map(function(t){ return h("button", {key:t[0], className:"tab " + (t[0] === tab ? "actif" : ""), "data-va":t[2]}, t[1]); })))),
      contenu));
}
// les gestes qui menaient par libellé seul ont désormais leur destination dans leur écran ; ALLER["*"] ne garde que les onglets
(function(){ var garder = ["Pilotage", "🎯 Pilotage classe", "📝 Évaluations", "Données", "📊 Résultats", "💾 Sauvegarde", "Réglages", "?"];
  Object.keys(ALLER["*"]).forEach(function(k){ if(garder.indexOf(k) < 0) delete ALLER["*"][k]; }); })();
// « 🎯 Pilotage classe » pendant une séance : le pilotage de cette séance, là où elle en est (relecteur n°15)
refaire("c-lancer", function(){ return seanceEnCours() ? fondDuMoment() : Lancement(false); });
// l'appel de la démo : « 🎓 Lancer la démo » y mène, comme pour une vraie séance (relecteur n°41)
refaire("c-appel", function(){ return Lancement(true, {demo:MOM().seance === "DEMO", seance:paramHash("seance")}); });

// l'accueil de l'app s'ouvre sur l'ordinateur de Paul quand il y revient de la console (« ← Retour ») : le même appareil
(function(){ var a = sceneParId("c-accueil"); if(a) a.appareil = "console"; })();

/* ── « Évaluation » du lancement : la démo en tête, puis les évaluations prêtes ; le choix s'applique (changement 7.5, relecteur n°34) ── */
function ChoixEvaluation(p){
  var se = p.seance ? SCN.seance(p.seance) : null;
  var pretes = SCN.evals().filter(function(e){ return !manquesDe(e).length; });
  if(se && pretes.every(function(e){ return e.id !== se.eval; })) pretes = [evalDeSeance(se)].concat(pretes);
  var v = p.demo ? "demo" : se ? se.eval : (pretes[0] || {}).id;
  return h("select", {value:v, title:"L'évaluation de la séance : la démo, ou une évaluation prête à lancer.", onChange:function(e){ versScene(e.target.value === "demo" ? "c-demo-lancer" : "c-lancer"); }},
    h("option", {value:"demo"}, "🎓 Démo — apprendre le déroulé (" + SCN.DEMO.questions.length + " questions)"),
    pretes.map(function(e){ return h("option", {key:e.id, value:e.id}, e.titre); }));
}
// le message de l'emploi du temps se ferme aussi à Échap, comme les autres fenêtres (changement 7.7, relecteur n°313)
function AtInfo(p){
  var fermer = function(){ if(vientDUnGeste()) history.back(); else p.fermer(); };
  useEchapLocal(true, fermer);
  return h("div", {className: "at-modale", id: "at-modale"},
    h("div", {className: "at-modale-c"}, h("div", {className: "at-modale-m"}, p.msg),
      h("div", {className: "at-modale-b"}, h("button", {className: "at-btn at-btn-prim", "data-local": "1", title: "Ferme le message.", onClick: fermer}, "Compris"))));
}
// « Accès professeur » : le champ du code, comme dans la 7.7.1 (l. 2495 à 2499) ; « → » ouvre la console (relecteur n°32)
function Accueil(){ return h(AccueilC); }
function AccueilC(){
  var s = useState(false), login = s[0], setLogin = s[1], s2 = useState(""), code = s2[0], setCode = s2[1], s3 = useState(false), refus = s3[0], setRefus = s3[1];
  // la boîte « alert » de la 7.7.1 (l. 2483), dessinée : son texte exact et « OK » ; aucune infobulle à l'accueil (changement 2)
  // (QCM-1) la porte professeur de la 7.7.1 (l. 2477 à 2486) : la clé de chiffrement ou l'empreinte du hub ; hors https, son message
  function essayer(){
    if(typeof mjpcCryptoDispo === "function" && !mjpcCryptoDispo()){ setRefus(MJPC_TXT_PROF_HORS_LIGNE); return; }
    if(typeof mjpcVerifierProf !== "function"){ setRefus(true); return; }
    mjpcVerifierProf(code).then(function(r){ if(r.ok) GESTES.modeProf(); else setRefus(true); });
  }
  useEchapLocal(refus, function(){ setRefus(false); });
  return h("div", {className:"accueil"},
    ["⭐","🎯","✨","💡","🎲","🔥"].map(function(em, i){ return h("span", {key:i, className:"deco"}, em); }),
    h("h1", null, "📝 Évaluation QCM"),
    h("p", {className:"sous"}, "Outil d'évaluation pour la classe."),
    h("button", {className:"btn-accueil", "data-va":"t-combien"}, "🎓 Mode élève"),
    !login ? h("button", {className:"lien-prof", "data-local":"1", onClick:function(){ setLogin(true); }}, "Accès professeur")
      : h("div", {className:"code-input"},
          h("input", {type:"password", value:code, placeholder:"Code", onChange:function(e){ setCode(e.target.value); }, onKeyDown:function(e){ if(e.key === "Enter") essayer(); }}),
          h("button", {"data-local":"1", onClick:essayer}, "→")),
    refus && h("div", {className:"fen-fond alerte-native"}, h("div", {className:"alerte-boite"},
      h("div", {className:"alerte-texte"}, typeof refus === "string" ? refus : "Ce code ou cette clé n’ouvre pas l’espace professeur."),
      h("div", {className:"alerte-pied"}, h("button", {className:"alerte-ok", "data-local":"1", onClick:function(){ setRefus(false); }}, "OK")))));
}
// (changement 7.2) un choix déjà allumé, cliqué, s'éteint : chaque clic se voit
window.addEventListener("click", function(ev){
  var b = ev.target && ev.target.closest ? ev.target.closest("#root .decl-b-btns > button, #root .co-btns > button, #root .qdf-choix > *, #root .autoeval-fourchettes > button") : null;
  if(!b || b.disabled || b.hasAttribute("data-local") || b.closest(".fige-choix,.qdf-etat")) return;
  if(b.classList.contains("on") || b.classList.contains("sel") || b.classList.contains("choisi")){ b.classList.remove("on", "sel", "choisi"); ev.stopImmediatePropagation(); }
}, true);

/* ── « ✏️ Modifier le prompt » : une fermeture qui perdrait des modifications passe par une garde (changement 7.1, garde 15.5) ── */
function ReglagesPromptModifier(){
  var s = useState(""), msg = s[0], setMsg = s[1];
  var s2 = useState(PROMPT_TEXTE), brouillon = s2[0], setBrouillon = s2[1];
  var s3 = useState(false), confirme = s3[0], setConfirme = s3[1];
  var s4 = useState(PROMPT_TEXTE), garde = s4[0], setGardeTxt = s4[1];
  var s5 = useState(false), gardeOuverte = s5[0], setGarde = s5[1];
  var modifie = brouillon !== garde;
  function fermer(){ if(modifie) setGarde(true); else fermerVers("c-reglages"); }
  useEffect(function(){
    function f(e){ if(e.key === "Escape" && !window.SOMMAIRE_OUVERT && !confirme && !gardeOuverte){ e.stopImmediatePropagation(); fermer(); } }
    window.addEventListener("keydown", f, true); return function(){ window.removeEventListener("keydown", f, true); };
  });
  return h(F, null, Reglages(), h("div", {className:"modal-back"},
    h("div", {className:"modal", style:{maxWidth:"900px"}},
      h("button", {className:"modal-close", "data-local":"1", title:modifie ? "Ferme la fenêtre : une garde te demande d'abord si tu perds tes modifications." : "Ferme la fenêtre ; rien n'a changé.", onClick:fermer}, "✕"),
      h("h2", null, "🤖 Le prompt de création d'éval", InfoI("Ce prompt guide l'instance de création d'éval, pour qu'elle t'aide à écrire l'évaluation puis te rende le JSON à coller dans « ➕ Nouvelle évaluation ». Tu peux le modifier (« ✏️ Modifier le prompt ») : tes modifications te suivent d'un appareil à l'autre, et l'app y remet ton chapitre à chaque copie.")),
      h("textarea", {value:brouillon, onChange:function(e){ setBrouillon(e.target.value); }, title:"Le prompt enregistré, jetons compris : modifie-le librement, rien n'est gardé avant « 💾 Enregistrer ».", style:{width:"100%", minHeight:"420px", fontFamily:"ui-monospace,monospace", fontSize:".8rem", padding:".7rem", border:"2px solid var(--violet)", borderRadius:"8px", boxSizing:"border-box"}}),
      h("div", {className:"row", style:{gap:".5rem", flexWrap:"wrap", marginTop:".7rem"}},
        h("button", {className:"btn btn-primary", "data-local":"1", onClick:function(){ setGardeTxt(brouillon); setMsg("✅ Consignes enregistrées — elles te suivent d'un appareil à l'autre."); }}, "💾 Enregistrer"),
        h("button", {className:"btn btn-ghost", "data-va":"c-reglages-prompt"}, "↩️ Annuler"),
        h("button", {className:"btn btn-ghost", "data-local":"1", onClick:function(){ setConfirme(true); }}, "🔄 Restaurer le prompt par défaut")),
      h(MessagePrompt, {msg:msg}))),
    confirme && h(BoiteConfirmeNative, {texte:"Restaurer le prompt par défaut ? Tes modifications actuelles seront perdues (le prompt enregistré dans Firebase sera écrasé après ton clic sur « Enregistrer »).",
      oui:function(){ setBrouillon(PROMPT_TEXTE); setConfirme(false); }, non:function(){ setConfirme(false); }}),
    gardeOuverte && h("div", {className:"fen-fond alerte-native"}, h("div", {className:"alerte-boite"},
      h("div", {className:"alerte-texte"}, "Fermer sans enregistrer ? Tes modifications du prompt seront perdues."),
      h("div", {className:"alerte-pied"},
        h("button", {className:"alerte-non", "data-local":"1", title:"Revient au prompt, tel que tu l'as modifié.", onClick:function(){ setGarde(false); }}, "Continuer à modifier"),
        h("button", {className:"alerte-ok", "data-local":"1", title:"Ferme la fenêtre : tes modifications sont perdues.", onClick:function(){ setGarde(false); fermerVers("c-reglages"); }}, "Fermer sans enregistrer")))));
}
// un choix déjà fait, recliqué : il le montre (un éclair autour), au lieu de ne rien faire
window.addEventListener("click", function(ev){
  var b = ev.target && ev.target.closest ? ev.target.closest("#root button[aria-pressed=true], #root button.elf-segb.on") : null;
  if(!b || b.disabled) return;
  b.classList.add("deja-choisi"); setTimeout(function(){ b.classList.remove("deja-choisi"); }, 900);
}, true);

// la reprise d'une séance en pause (« &reprise=q-tour ») : après l'appel, le tour en cours recommence au début, voile compris
function repriseMoment(){ var r = paramHash("reprise"); if(!r) return null; var p = r.split("-"); return momentSiExiste("S08:Q" + p[0] + ":T" + p[1]); }
function repriseVa(){ return repriseMoment() ? "c-q1-tour1" : null; }
// (changement 4.3 et 4.7) le mode test reste dans le mode test : sa séance d'essai ne se met pas en pause pour une autre heure,
// elle se termine par « 🗑️ Sortir et purger » ; « ⏸️ Finir à une autre heure » y est fermé, avec sa raison
var hAvantTest = h;
h = function(type, props){
  if(type === "button" && props && props["data-va"] === "c-finir-autre-heure" && /^TEST(:|$)/.test(MO())){
    var args = Array.prototype.slice.call(arguments), p = Object.assign({}, props);
    delete p["data-va"]; p.disabled = true; p.title = "Fermé en mode test : la séance d'essai ne se reprend pas à une autre heure ; « 🗑️ Sortir et purger » la termine.";
    args[1] = p; return hAvantTest.apply(null, args);
  }
  return hAvantTest.apply(null, arguments);
};
/* La fenêtre de la console (etape2.js) : une rangée de trois boutons ou plus reste une rangée (changement 6.8, relecteur n°225),
   et le nom déjà dit par le titre ne se répète pas dessous (relecteur n°187) */
function Fenetre(fond, titre, sous, corps, actions, retour, large){
  var n = Array.isArray(actions) ? actions.filter(Boolean).length : 0;
  if(typeof sous === "string" && typeof titre === "string" && sous && titre.indexOf(sous) >= 0) sous = null;
  return h(F, null, fond, h("div", {className:"checkin-overlay", "data-echap":retour},
    h("div", {className:"checkin-modal", style:{maxWidth:Math.max(large || 560, n >= 3 ? 720 : 0) + "px"}},
      h("div", {className:"checkin-header"}, h("h3", null, titre), sous && h("div", {className:"checkin-sub"}, sous)),
      h("div", {className:"fen-corps"}, corps),
      h("div", {className:"checkin-actions" + (n >= 3 ? " rangee-une" : "")}, actions))));
}
// (relecteur n°67) le 🛑 rouge d'un bouton rouge se voit : il prend un liseré blanc (le libellé ne change pas)
var hAvantStop = h;
h = function(type, props){
  var args = Array.prototype.slice.call(arguments);
  if(type === "button" && props && /btn-rouge/.test(props.className || "") && typeof args[2] === "string" && args[2].indexOf("🛑 ") === 0)
    args.splice(2, 1, hAvantStop("span", {key:"e", className:"emo-liseret"}, "🛑"), args[2].slice(2));
  return hAvantStop.apply(null, args);
};
// (relecteur n°67) chaque carré de la légende se voit, même pâle : il prend un liseré
function Legende(items){
  return h("div", {className:"legende-tab"}, items.map(function(it, i){ return h("span", {key:i}, h("span", {className:"c", style:{background:it[0], border:it[2] || "1px solid #64748B"}}), it[1]); }));
}
/* (relecteur n°40) l'appel : le message des tablettes suit les absences cochées. Un élève dont le binôme est absent, et l'élève seul
   de la classe, sont mis ensemble, sur la tablette du premier ; un élève qui reste seul le reste sur sa tablette. */
function messageAppel(abs, paires){
  var seuls = [];
  (paires || PAIRES_AVANT).forEach(function(pa, i){
    var a = pa[0] && !abs[pa[0]], b = pa[1] && !abs[pa[1]];
    if(a && !b) seuls.push({nom:pa[0], t:i + 1, de:pa[1]}); else if(b && !a) seuls.push({nom:pa[1], t:i + 1, de:pa[0]});
  });
  var qui = function(s, reste){ var f = SCN.SEXE[pre(s.nom)] === "F"; return [h("strong", {key:"n"}, s.nom), s.de ? " (binôme " + deNom(pre(s.de)) + ")" : reste ? "" : " (seul" + (f ? "e" : "") + ")"]; };
  var lignes = [];
  for(var i = 0; i + 1 < seuls.length; i += 2) lignes.push(h("div", {key:i}, "📱 ", qui(seuls[i]), " et ", qui(seuls[i + 1]), " sont mis ensemble : tablette " + seuls[i].t + "."));
  if(seuls.length % 2) { var s = seuls[seuls.length - 1]; lignes.push(h("div", {key:"r"}, "📱 ", qui(s, true), " reste seul" + (SCN.SEXE[pre(s.nom)] === "F" ? "e" : "") + " : tablette " + s.t + ".")); }
  return lignes;
}
function ListeAppel(p){   // l'appel : un clic sur un nom le marque absent ; « Tout le monde présent » les décoche
  // (complément 4, correction 3) les absents de la séance, au moment de l'appel : ceux du scénario
  // (QCM-1) les absents de la séance réelle ; chaque coche est gardée pour « 🚀 Lancer la séance » (APPEL, src/live/gestes.js)
  var s = useState(function(){ var o = {}; (p.absents || SCN.absents().map(SCN.nomDe)).forEach(function(n){ o[n] = true; }); return o; }), abs = s[0], setAbs = s[1];
  var n = Object.keys(abs).filter(function(k){ return abs[k]; }).length;
  if(typeof APPEL !== "undefined") APPEL.absents = Object.keys(abs).filter(function(k){ return abs[k]; }).map(function(k){ return sanMJPC(k); });
  return h(F, null,
    h("div", {className:"checkin-list", style:{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", columnGap:".4rem"}}, p.classe.map(function(nom){
      var a = !!abs[nom];
      return h("button", {key:nom, className:"checkin-item appel-b" + (a ? " coche" : ""), "data-local":"1", title:a ? "Marqué absent : clique pour le remettre présent." : "Clique pour le marquer absent aujourd'hui.",
        onClick:function(){ var o = Object.assign({}, abs); o[nom] = !a; setAbs(o); }},
        h("span", {className:"checkin-checkbox"}, a ? "🚫" : "✓"), h("span", {className:"checkin-nom"}, nom));
    })),
    h("div", {className:"checkin-summary"}, "🚫 " + n + " absent" + (n > 1 ? "s" : "") + " sur " + p.classe.length,
      h("button", {className:"btn btn-ghost btn-sm", style:{marginLeft:".8rem"}, "data-local":"1", title:BULLES["Tout le monde présent"], onClick:function(){ setAbs({}); }}, "Tout le monde présent")),
    p.message !== false && h("div", {className:"appel-tablettes", style:{padding:".55rem 1.2rem 0", fontSize:".86rem", lineHeight:1.5}}, messageAppel(abs, p.paires)));
}
/* (QCM-1) pendant l'appel, la carte de lancement reste derrière sa fenêtre : son « 🚀 Lancer la séance » est fermé, celui de la fenêtre lance */
var hAvantAppel = h;
h = function(type, props){
  if(type === "button" && props && props["data-va"] === "c-appel" && typeof SCN !== "undefined" && SCN.sid && SCN.sid() && (SCN.etat() || {}).ph === "appel"){
    var args = Array.prototype.slice.call(arguments), p = Object.assign({}, props);
    delete p["data-va"]; p.disabled = true; p.title = "L'appel est ouvert : la séance se lance depuis sa fenêtre.";
    args[1] = p; return hAvantAppel.apply(null, args);
  }
  return hAvantAppel.apply(null, arguments);
};

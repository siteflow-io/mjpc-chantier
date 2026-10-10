/* ═══════════════ Étape 2 — avant et pendant les questions ═══════════════
   Ce qui change par rapport aux scènes existantes, point par point (PLAN-ETAPES-2-4.md). Les composants à état
   (useState de React 17) font agir les boutons sur place : temps, attestation, binômes. */
var useState = React.useState, useEffect = React.useEffect;
function hm(min){ var hh = Math.floor(min / 60), mm = Math.round(min % 60); return hh + ":" + (mm < 10 ? "0" : "") + mm; }
var FIN_HEURE = 10 * 60 + 57;   // 10:57 : lancement 10:02 + 55 min (64)

/* ── Les exclusions de MJPC (585, 587, 590) : deux élèves exclus ne sont jamais ensemble ; aucun élève n'en voit rien ── */
var EXCLUSIONS = [["ESNAULT Inès", "CARRÉ Tom"], ["OLLIVIER Sacha", "QUINTON Enzo"]];
function exclus(a, b){ return EXCLUSIONS.some(function(x){ return (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a); }); }

/* ════════ Les temps en direct (427, 428) : deux valeurs à taper, « +5 », « +10 », « +30 » à côté, la fin prévue ════════ */
function TempsCarte(p){   // p : lbl, total, reste (si en cours), actif, onAjout, sous
  return h("div", {className:"pilot-chrono-card" + (p.actif ? " actif" : "")},
    h("div", {className:"label" + (p.actif ? " actif" : "")}, p.lbl),
    h("div", {className:"v"}, p.actif ? p.reste + "s" : p.total + "s"),
    h("div", {className:"desc"}, p.sous),
    h("div", {className:"inline-edit t-edit"},
      h("input", {type:"number", min:1, value:p.total, "aria-label":"Temps " + p.lbl, title:"Tape le temps de cette question, en secondes : il vaut pour les deux tours et pour la lecture à la correction. La fin prévue suit.",
        onChange:function(e){ var v = parseInt(e.target.value, 10); if(v > 0) p.onAjout(v - p.total); }}),
      h("span", {className:"t-s"}, "s"),
      [5, 10, 30].map(function(n){ return h("button", {key:n, className:"btn btn-ghost btn-sm t-plus", "data-local":"1", onClick:function(){ p.onAjout(n); }}, "+" + n); })));
}
function FinPrevue(p){   // p.min : la fin prévue, en minutes depuis minuit
  var deb = p.min - FIN_HEURE;
  return h("div", {className:"fin-prevue" + (deb > 0 ? " deborde" : ""), title:"La fin prévue de la séance, recalculée à chaque temps changé ou question écartée : les questions qui restent, leurs deux tours, puis la correction, la co-évaluation et le bilan (durées de Réglages)."},
    deb > 0 ? "🏁 Fin prévue " + hm(p.min) + ", " + Math.round(deb) + " min après la fin de l'heure" : "🏁 Fin prévue " + hm(p.min) + " · fin de l'heure " + hm(FIN_HEURE));
}
function ColonneTemps(p){   // la réflexion et la réponse de la question en cours, et la fin prévue
  var q = (p.ev || EV).questions[p.qi];
  var s1 = useState(q.reflexion), ref = s1[0], setRef = s1[1];
  var s2 = useState(q.reponse), rep = s2[0], setRep = s2[1];
  var s3 = useState(p.reste), reste = s3[0], setReste = s3[1];
  var s4 = useState(p.finMin), fin = s4[0], setFin = s4[1];
  useEffect(function(){
    function relance(){ setReste(p.phase === "reflexion" ? ref : rep); }
    document.addEventListener("maquette-relancer", relance);
    return function(){ document.removeEventListener("maquette-relancer", relance); };
  });
  function ajoutRef(n){ setRef(ref + n); if(p.phase === "reflexion") setReste(Math.max(0, reste + n)); setFin(fin + n / 60); }
  function ajoutRep(n){ setRep(rep + n); if(p.phase === "reponse") setReste(Math.max(0, reste + n)); setFin(fin + 2 * n / 60); }
  return h(F, null,
    h("div", {className:"pilot-chronos-info"},
      h(TempsCarte, {lbl:"🧠 Réflexion", total:ref, reste:reste, actif:p.phase === "reflexion", onAjout:ajoutRef, sous:p.phase === "reflexion" ? "EN COURS" : "pour cette question"}),
      h(TempsCarte, {lbl:"✋ Réponse", total:rep, reste:reste, actif:p.phase === "reponse", onAjout:ajoutRep,
        sous:p.phase === "reponse" ? (p.tour === 1 ? "1er tour" : "2e tour") + " · EN COURS" : "par tour, et pour la lecture à la correction"})),
    h(FinPrevue, {min:fin}));
}
function BoutonPause(){
  var s = useState(false), pause = s[0], setPause = s[1];
  return h("button", {className:"btn btn-or", "data-local":"1", title:pause ? BULLES["▶️ Reprendre"] : BULLES["⏸️ Pause"], onClick:function(){ setPause(!pause); }}, pause ? "▶️ Reprendre" : "⏸️ Pause");
}
function BoutonRelancer(){
  return h("button", {className:"btn btn-ghost", "data-local":"1", title:BULLES["🔄 Relancer chrono"], onClick:function(){ document.dispatchEvent(new Event("maquette-relancer")); }}, "🔄 Relancer chrono");
}

/* ── « 📋 Toutes les questions » : les questions à venir se modifient, s'écartent ; les posées s'annulent (427, 429, 441, 442) ── */
function TempsMini(p){
  var s1 = useState(p.q.reflexion), r = s1[0], setR = s1[1];
  var s2 = useState(p.q.reponse), rp = s2[0], setRp = s2[1];
  function champ(v, set, lbl){ return h("label", {className:"tm-l"}, lbl, h("input", {type:"number", min:1, value:v, title:"Le temps de " + lbl.toLowerCase().replace(/[^a-zéè]/g, "") + " de cette question, pour cette séance : l'évaluation elle-même ne change pas.", onChange:function(e){ var x = parseInt(e.target.value, 10); if(x > 0) set(x); }}), "s"); }
  return h("div", {className:"tm"}, champ(r, setR, "🧠 "), champ(rp, setRp, "✋ "));
}
function Overview(qCur, passees, opts){
  opts = opts || {};
  var ec = opts.ecartees || {}, an = opts.annulees || {};
  return h("div", {className:"pilot-overview"},
    h("h3", null, h("span", null, "📋 Toutes les questions", InfoI("Les temps des questions à venir se tapent ici, pour cette séance seulement. « ❌ Écarter » retire une question pas encore posée ; « ⚠️ Annuler » retire une question déjà posée. Les deux se défont par « ↩️ Remettre »."))),
    EV.questions.map(function(q, qi){
      var current = qi === qCur, passee = passees.indexOf(qi) >= 0, avenir = !current && !passee;
      var nb = Object.keys(RT).filter(function(p){ return RT[p][qi] === "J"; }).length;
      var marque = ec[qi] ? h("div", {className:"q-marque ecartee"}, "❌ Écartée — pas posée") : an[qi] ? h("div", {className:"q-marque annulee"}, "⚠️ Annulée — posée, puis annulée") : null;
      return h("div", {key:qi, className:"pilot-q-mini" + (current ? " current" : "") + (passee ? " passee" : "") + (ec[qi] || an[qi] ? " retiree" : "")},
        h("div", {className:"pilot-q-mini-head"}, h("span", {className:"pilot-q-mini-num"}, "Q" + (qi+1)), h("span", {className:"pilot-q-mini-niv niv-" + q.niveau}, NIV[q.niveau].label)),
        h("div", {className:"pilot-q-mini-enonce"}, q.enonce),
        h("div", {className:"pilot-q-mini-bonnes"}, ChoixTexte(q)),
        marque,
        avenir && !ec[qi] ? h(TempsMini, {q:q}) : h("div", {className:"pilot-q-mini-status"}, "Réflexion " + q.reflexion + " s · Réponse " + q.reponse + " s par tour",
          passee && !an[qi] && h("span", null, " — ", h("span", {className:"score-pct " + (nb/24 >= .7 ? "score-vert" : nb/24 >= .5 ? "score-orange" : "score-rouge")}, nb + "/24 justes"))),
        h("div", {className:"q-gestes"},
          ec[qi] || an[qi] ? h("button", {className:"btn btn-ghost btn-sm", "data-va":opts.remettre || "c-q1-close"}, "↩️ Remettre")
            : avenir ? h("button", {className:"btn btn-ghost btn-sm btn-ecarter", "data-va":"c-ecarter"}, "❌ Écarter")
            : passee ? h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-annuler"}, "⚠️ Annuler") : null));
    }),
    opts.alerteComp && h("div", {className:"q-alerte"}, opts.alerteComp));
}

/* ════════ Le pilotage pendant les questions (refait sur l'existant, avec 427 à 442) ════════ */
function nonRepondus(s){ return s.qi === 1 ? 1 : 0; }   // à la question 2, Théo n'a pas répondu (capture 49)
function Pilot(s){
  var q = s.qi != null ? EV.questions[s.qi] : EV.questions[0];
  var nbQ = EV.questions.length - Object.keys(s.ecartees || {}).length;
  var derniere = s.qi === 2 || (s.qi === 1 && (s.ecartees || {})[2]);
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
    var nr = nonRepondus(s);
    var rouvrir = nr ? h("button", {key:2, className:"btn btn-ghost", "data-va":"c-rouvrir-tous"}, "🔓 Rouvrir pour tous")
                     : h("button", {key:2, className:"btn btn-ghost", disabled:true, title:"Tous les présents ont répondu à cette question : il n'y a personne à rouvrir. Une réponse donnée est définitive."}, "🔓 Rouvrir pour tous");
    actions = !derniere ? [h("button", {key:1, className:"btn btn-primary", "data-va":s.qi === 0 ? "t-q2-reflexion" : "t-q3-tour1"}, "▶️ Lancer Q" + (s.qi + 2)), rouvrir]
                        : [h("button", {key:1, className:"btn btn-or", "data-va":"c-estim"}, "📊 Lancer l'autoévaluation"), rouvrir];
  }
  var enCours = s.phase === "reflexion" || s.phase === "reponse";
  var colG = h("div", null,
    h("div", {className:"pilot-status " + statusCls}, st),
    h(ColonneTemps, {key:"t" + s.qi + s.phase + (s.tour || ""), qi:s.qi == null ? 0 : s.qi, phase:enCours ? s.phase : null, tour:s.tour, reste:s.chrono, finMin:s.finMin || (10 * 60 + 39)}),
    s.qi != null && QCourante(s.qi),
    h("div", {className:"pilot-actions"}, actions),
    s.phase === "attente" && nonRepondus(s) > 0 && h("div", {className:"pilot-eleve-help"}, "« Rouvrir pour tous » ne rouvre que pour ceux qui n'ont pas répondu, une fois par question."),
    (s.qi == null || !derniere) && h("div", {className:"pilot-q-next-detail"},
      h("div", {className:"label"}, "🔮 À venir — Q " + ((s.qi == null ? -1 : s.qi) + 2) + " / " + nbQ, InfoI("La question suivante, avec ses deux temps : ils se changent dans « 📋 Toutes les questions », à droite.")),
      h("div", {className:"enonce-next"}, EV.questions[s.qi == null ? 0 : s.qi + 1].enonce),
      h("div", {style:{fontSize:".72rem", color:"var(--gris)", fontStyle:"italic"}}, (function(){ var n = EV.questions[s.qi == null ? 0 : s.qi + 1]; return "Difficulté " + NIV[n.niveau].label + " · réflexion " + n.reflexion + " s · réponse " + n.reponse + " s par tour · " + n.bonnes.length + " bonne(s) réponse(s)"; })())));
  var colM = h("div", null,
    h("h3", {style:{margin:"0 0 .2rem"}}, "📱 Tablettes", InfoI("Chaque tablette, ses deux moitiés : qui est assis où, et où en est chacun. « 👁 » montre les deux moitiés en direct. Glisse un nom sur un autre pour échanger deux élèves : pendant la séance, ils changent de tablette et retapent leur code ; leurs réponses les suivent."), h("span", {style:{fontWeight:400, fontSize:".8rem", color:"var(--gris)", marginLeft:".5rem"}}, s.sousTitre || "")),
    GrilleTablettes(s.paires || PAIRES, s.etat),
    Legende(s.legende || LEG_Q));
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte("🎯 " + EV.titre + " — " + CLASSE, [
      h("span", {key:0, style:{fontSize:".8rem", color:"var(--gris)", fontWeight:700}}, "🕙 Fin de l'heure : 10:57"),
      h("button", {key:1, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"),
      h("button", {key:2, className:"btn btn-ghost btn-sm"}, "↩️ Retour d'un élève"),
      h("button", {key:4, className:"btn btn-ghost btn-sm"}, "🔓 Rouvrir pour un élève"),
      h("button", {key:5, className:"btn btn-ghost btn-sm", "data-va":"c-finir-autre-heure", title:"Met la séance en pause, avec son état exact, pour la reprendre à une heure suivante : « ▶️ Reprendre » dans « 🎯 Pilotage classe ». Demande une confirmation."}, "⏸️ Finir à une autre heure"),
      h("button", {key:3, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-stats"}, s.stats.map(function(x, i){ return h("div", {key:i, className:"pilot-stat"}, h("div", {className:"v"}, x[0]), h("div", {className:"l"}, x[1])); })),
    h("div", {className:"pilot-grid v2"}, colG, colM, Overview(s.qi, s.passees || [], s))), true);
}
/* Les tablettes de la console : « 👁 » devient un bouton (16 : un clic montre les deux moitiés en direct) */
function TabMini(num, a, b, etat, opts){
  opts = opts || {};
  function moitie(n, cote){
    if(!n) return h("div", {className:"tab-mini-m vide"}, h("div", {className:"nm"}, "1 élève"));
    var e = etat ? etat(pre(n), cote) : {};
    return h("div", {className:"tab-mini-m " + (e.cls || "")},
      h("div", {className:"nm"}, opts.grip && h("span", {className:"grip"}, "⠿"), n),
      e.st && h("span", {className:"st"}, e.st),
      e.flag && h("span", {className:"flag"}, e.flag));
  }
  return h("div", {key:num, className:"tab-mini" + (!b ? " seul" : "")},
    h("div", {className:"tab-mini-h"}, h("span", null, "📱 Tablette " + num), !b ? h("span", null, "seul") : opts.coin === " " ? h("span", null, " ") : h("button", {className:"tab-oeil", title:"Montre les deux moitiés de la tablette " + num + " en direct, en grand. Ne change rien."}, "👁")),
    h("div", {className:"tab-mini-b"}, moitie(a, "g"), moitie(b, "d")));
}

/* ════════ Avant l'heure : les binômes par les exclusions, puis par la règle du QCM (587, 594) ; la durée (649) ════════ */
var DUREE_TXT = h(F, null, "⏱️ ", h("strong", null, "Durée estimée : 15 min"), " — installation et consignes 5 min ; questions 4 min 30 (pour chacune : la réflexion, puis deux tours de 3 s de décompte, de réponse et de 5 s où l'élève dit si sa feuille dit la même chose, puis 15 s) ; correction 3 min (1 min par question) ; co-évaluation et bilan 2 min.", h("br"), "✅ Ça tient dans les 45 minutes utiles.");
function GrilleBinomes(p){   // glisser un nom sur un autre : les deux s'échangent ; une paire exclue est refusée, pour Paul seul (589)
  var s = useState(p.paires.map(function(x){ return x.slice(); })), paires = s[0], setPaires = s[1];
  var s2 = useState(p.refus || null), refus = s2[0], setRefus = s2[1];
  var s3 = useState(null), tenu = s3[0], setTenu = s3[1];
  function poser(ti, ci){
    if(!tenu) return;
    var np = paires.map(function(x){ return x.slice(); });
    var a = np[tenu[0]][tenu[1]], b = np[ti][ci];
    np[tenu[0]][tenu[1]] = b; np[ti][ci] = a;
    var mauvais = np.filter(function(x){ return x[0] && x[1] && exclus(x[0], x[1]); })[0];
    setTenu(null);
    if(mauvais){ setRefus(mauvais); return; }
    setPaires(np);
  }
  return h("div", null,
    h("div", {className:"tabs-grid"}, paires.map(function(x, ti){
      return h("div", {key:ti, className:"tab-mini" + (!x[1] ? " seul" : "")},
        h("div", {className:"tab-mini-h"}, h("span", null, "📱 Tablette " + (ti + 1)), !x[1] ? h("span", null, "seul") : h("span", null, " ")),
        h("div", {className:"tab-mini-b"}, [0, 1].map(function(ci){
          var n = x[ci];
          return h("div", {key:ci, className:"tab-mini-m" + (n ? "" : " vide") + (tenu && tenu[0] === ti && tenu[1] === ci ? " tenu" : ""), draggable:!!n,
            onDragStart:function(){ setTenu([ti, ci]); }, onDragOver:function(e){ e.preventDefault(); }, onDrop:function(e){ e.preventDefault(); poser(ti, ci); }},
            h("div", {className:"nm"}, n ? h(F, null, h("span", {className:"grip"}, "⠿"), n) : "1 élève"));
        })));
    })),
    refus && h("div", {className:"refus-excl"},
      h("strong", null, "🚫 Échange refusé. "), refus[0] + " et " + refus[1] + " ne sont jamais ensemble (exclusion MJPC). Pour les remettre ensemble, retire l'exclusion dans MJPC.",
      h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", title:"Ferme ce message ; la grille reste comme avant l'échange.", onClick:function(){ setRefus(null); }}, "✕ Fermer")));
}
function Lancement(appel, opts){
  opts = opts || {};
  var demo = opts.demo;
  var classe = [].concat.apply([], PAIRES_AVANT).filter(Boolean).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  var carte = h("div", {className:"card"},
    h("h2", null, "🎯 Lancer une nouvelle session", InfoI("Choisis la classe et l'évaluation : la durée se compte tout de suite, et les binômes sont proposés. « 🚀 Lancer la session » ouvre l'appel.")),
    h("div", {className:"lancer-grid"},
      h("div", null,
        h("div", {className:"field"}, h("label", null, "Classe", InfoI("Les classes de la console MJPC.")), h("select", {value:"c", readOnly:true, title:"La classe de la séance."}, h("option", {value:"c"}, CLASSE + " (25 élèves)"))),
        h("div", {className:"field"}, h("label", null, "Évaluation", InfoI("Seules les évaluations prêtes à lancer sont proposées ; la démo est toujours en tête.")), h("select", {value:"e", readOnly:true, title:"L'évaluation de la séance."}, h("option", {value:"e"}, demo ? "🎓 Démo — apprendre le déroulé (3 questions)" : EV.titre + " (3 questions)"))),
        !demo && h("div", {className:"field"}, h("label", null, "Mode", InfoI("Sur tablettes : deux élèves par tablette, le déroulé complet. Sur papier : chacun répond seul sur sa feuille, avec les énoncés imprimés ; le soir, tu remplis la grille ; la correction se fait à l'heure suivante, sur les tablettes.")),
          h("div", {className:"mode-seance"},
            h("button", {className:"btn btn-sm " + (opts.papier ? "btn-ghost" : "btn-primary"), "data-va":"c-lancer", "aria-pressed":!opts.papier, title:"La séance sur tablettes, deux élèves par tablette."}, "📱 Sur tablettes"),
            h("button", {className:"btn btn-sm " + (opts.papier ? "btn-primary" : "btn-ghost"), "data-va":"c-papier-lancer", "aria-pressed":!!opts.papier, title:"La séance sur papier : chacun répond seul sur sa feuille, sans tablette ni estimation."}, "📄 Séance sur papier"))),
        opts.papier ? h("div", {className:"duree-box"}, "📄 ", h("strong", null, "Sur papier"), " : les énoncés seuls, imprimés ; chacun répond seul sur sa feuille, sans tablette ni estimation. Tu ramasses les feuilles : la séance se met en pause. Le soir, tu remplis la grille ; à l'heure suivante, « ▶️ Reprendre » : l'estimation, la seconde attestation, puis toutes les corrections à la suite, sur les tablettes, avec ces binômes.")
        : demo ? h("div", {className:"demo-box"}, h("strong", null, "🎓 La démo : rien ne compte. "), "Tu la joues avec la classe, sur les tablettes, comme une vraie : l'identification avec les vrais codes, l'appel, les binômes, les attestations, les questions, la correction, la co-évaluation. Pas de note, pas de compétence, pas de point d'autonomie, rien vers MJPC ; jamais dans « Mes évaluations », ni dans tes Résultats, ni dans le PDF ; jamais « le QCM précédent ». La séance s'efface à « Terminer » ; il reste une ligne dans les séances précédentes.")
             : h("div", {className:"duree-box"}, DUREE_TXT),
        h("button", {className:"btn btn-primary", "data-va":opts.papier ? "c-papier-seance" : demo ? "t-demo-q" : "c-appel", title:opts.papier ? "Ouvre l'appel, puis la séance sur papier : les énoncés à imprimer, et « ⏸️ Feuilles ramassées »." : null}, opts.papier ? "📄 Lancer la séance sur papier" : demo ? "🎓 Lancer la démo" : "🚀 Lancer la session")),
      h("div", {className:"binomes-box"},
        h("div", {className:"tt"}, "📱 Binômes proposés — d'après les exclusions, puis le QCM précédent", InfoI("D'abord les exclusions de MJPC : deux élèves exclus ne sont jamais ensemble. Puis la règle du QCM : le classement de la note du QCM précédent, puis 1-2, 3-4… Aucun élève ne voit rien des exclusions.")),
        h("div", {className:"ss"}, "Classement du QCM précédent, puis 1-2, 3-4… Glisse un nom sur un autre pour échanger deux élèves, ou sur une moitié vide pour l'y déplacer. Tu peux le faire jusqu'au bout de l'heure."),
        h("div", {className:"excl-note"}, "🚫 2 exclusions de MJPC respectées : le classement mettait CARRÉ Tom avec ESNAULT Inès, et QUINTON Enzo avec OLLIVIER Sacha ; chacun a été échangé avec le binôme le plus proche."),
        h(GrilleBinomes, {paires:PAIRES_AVANT, refus:opts.refus}))));
  var modale = appel && h("div", {className:"checkin-overlay", "data-echap":"c-lancer"},
    h("div", {className:"checkin-modal", style:{maxWidth:"640px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "📋 Check-in : qui est absent aujourd'hui ?", InfoI("Clique un nom pour le marquer absent. Son binôme est mis avec un élève resté seul, sans jamais créer de paire exclue.")), h("div", {className:"checkin-sub"}, CLASSE + " — 25 élèves")),
      h(ListeAppel, {classe:classe}),
      h("div", {style:{padding:".55rem 1.2rem", borderTop:"1px solid var(--bordure)", fontSize:".86rem", lineHeight:1.5}},
        h("div", null, "📱 ", h("strong", null, "CHEVALLIER Théo"), " (binôme d'Adam) et ", h("strong", null, "ZELLER Lou"), " (seule) sont mis ensemble : tablette 12."),
        h("div", {style:{display:"flex", alignItems:"center", gap:".5rem", marginTop:".35rem"}}, h("span", {style:{whiteSpace:"nowrap"}}, "🕙 Fin de l'heure :"),
          h("input", {defaultValue:"10:57", title:"L'heure de fin de la séance : lancement + 55 min. Les tablettes oublient leurs élèves à « Terminer », ou 10 min après cette heure.", style:{width:"70px", padding:".2rem .4rem", border:"2px solid var(--bordure)", borderRadius:"6px", fontWeight:900, textAlign:"center", fontFamily:"inherit"}}),
          h("span", {style:{color:"var(--gris)"}}, "lancement + 55 min ; les tablettes oublient leurs élèves à « Terminer », ou 10 min après."))),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost", "data-va":"c-lancer"}, "Annuler"), h("button", {className:"btn btn-primary", "data-va":"c-pret"}, "🚀 Lancer la session"))));
  var precedentes = SessionsPrecedentes(opts.demoFaite);
  return Console("pilotage", "pilot", h(F, null, opts.reprise && CarteReprise(opts.reprise === "papier"), carte, precedentes, modale), false);
}
function ListeAppel(p){   // l'appel : un clic sur un nom le marque absent ; « Tout le monde présent » les décoche
  var s = useState({"YVON Adam":true}), abs = s[0], setAbs = s[1];
  var n = Object.keys(abs).filter(function(k){ return abs[k]; }).length;
  return h(F, null,
    h("div", {className:"checkin-list", style:{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", columnGap:".4rem"}}, p.classe.map(function(nom){
      var a = !!abs[nom];
      return h("button", {key:nom, className:"checkin-item appel-b" + (a ? " coche" : ""), "data-local":"1", title:a ? "Marqué absent : clique pour le remettre présent." : "Clique pour le marquer absent aujourd'hui.",
        onClick:function(){ var o = Object.assign({}, abs); o[nom] = !a; setAbs(o); }},
        h("span", {className:"checkin-checkbox"}, a ? "🚫" : "✓"), h("span", {className:"checkin-nom"}, nom));
    })),
    h("div", {className:"checkin-summary"}, "🚫 " + n + " absent" + (n > 1 ? "s" : "") + " sur 25",
      h("button", {className:"btn btn-ghost btn-sm", style:{marginLeft:".8rem"}, "data-local":"1", title:BULLES["Tout le monde présent"], onClick:function(){ setAbs({}); }}, "Tout le monde présent")));
}
function SessionsPrecedentes(demoFaite){
  var lignes = [
    ["3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)", "24/09/2026 10:04", "✅ terminée", "23 présents · 2 feuilles à lire", "↳ c'est le QCM précédent : il sert aux binômes"],
    ["QCM — Le jambon-beurre", "15/09/2026 10:03", "✅ terminée", "25 présents", null]
  ];
  return h("div", {className:"card"},
    h("h2", null, "📚 Sessions précédentes — " + CLASSE, InfoI("Les séances passées de la classe : chacune ouvre ses résultats. Celle qui sert de « QCM précédent » aux binômes est marquée. La démo ne laisse qu'une ligne.")),
    h("div", {className:"results-eval-list"},
      demoFaite && h("div", {className:"results-eval-row demo-ligne"}, h("div", null, h("div", {className:"titre"}, "🎓 Démo faite le 10/10 · " + CLASSE + " · 24 présents"), h("div", {className:"meta"}, "rien ne compte : ni note, ni compétence ; elle ne sert jamais aux binômes"))),
      lignes.map(function(l, i){
        return h("div", {key:i, className:"results-eval-row"},
          h("div", null, h("div", {className:"titre"}, l[0]),
            h("div", {className:"meta"}, l[1] + " · " + l[2] + " · " + l[3]),
            l[4] && h("div", {className:"meta", style:{color:"var(--violet)", fontWeight:700}}, l[4])),
          h("div", {className:"row"}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-rouvrir-seance", title:"Rouvre cette séance terminée, là où elle s'était terminée, après une confirmation. Ses copies rendues sont masquées jusqu'au prochain « Rendre les copies »."}, "🔓 Rouvrir"),
            h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats", title:"Ouvre les résultats de cette séance passée : les notes d'après la feuille, les compétences, les feuilles à lire."}, "📊 Résultats")));
      })));
}

/* ════════ L'entrée ════════ */
/* L'attestation (506, 549) : une coche par ligne ; chaque ligne n'apparaît qu'une fois la précédente cochée ; « Je commence » s'ouvre à la dernière */
function LignesAttest(e, v){
  return [
    "Pour chaque question, écris ta réponse sur ta feuille, avec les mots du cours. Plusieurs réponses : une par ligne.",
    "Écris lisiblement : " + v.prenom + " lira ta feuille à la correction.",
    "Si tu sais ton cours, tu retrouveras ta réponse parmi les choix.",
    "Quand « POSE TON STYLO » s'affiche, pose ton stylo et clique ta réponse. Quand c'est le tour de " + v.prenom + ", ne regarde pas.",
    "À la fin du temps, dis si ta feuille dit la même chose que ton clic.",
    "Ta note, c'est ta feuille. Chaque question vaut 1 point.",
    "Une fois par évaluation, si ta feuille est fausse mais que ton clic est juste, la question compte quand même.",
    "Je ramasse les feuilles à la fin."
  ];
}
function AttestCoches(p){   // p : e, lignes, n0, titre, bouton, va, titrePage
  var s = useState(p.n0), n = s[0], setN = s[1];
  var tout = n >= p.lignes.length;
  return Page(badgeDe(p.e), p.titrePage, h("div", {className:"attest attest-c"},
    h("div", {className:"tt"}, p.titre),
    p.lignes.slice(0, Math.min(n + 1, p.lignes.length)).map(function(l, i){
      var on = i < n;
      return h("div", {key:i, className:"li-c" + (on ? " on" : "")},
        h("button", {className:"case-b" + (on ? " on" : ""), "data-local":"1", disabled:on || i !== n, title:on ? "Cette ligne est déjà cochée." : "Coche cette ligne quand tu l'as lue.", onClick:function(){ setN(n + 1); }}, on ? "✓" : ""),
        h("span", null, l));
    }),
    h("button", {className:"btn btn-primary attest-go", disabled:!tout, "data-va":tout ? p.va : null,
      title:tout ? "C'est parti." : "« " + p.bouton + " » ne s'ouvre que quand toutes sont cochées."}, p.bouton)));
}
function Attest1(e, n){ var v = autreDe(e); return h(AttestCoches, {e:e, lignes:LignesAttest(e, v), n0:n, titre:"Avant de commencer, " + e.prenom, bouton:"Je commence", va:"t-pret", titrePage:EV.titre}); }
function EcrLoginInconnu(){
  return Page(null, "👋 Identifie-toi", h("div", {className:"eleve-form"},
    h("input", {readOnly:true, value:"7319", style:{textAlign:"center", letterSpacing:".3em", fontWeight:700}}),
    h("input", {readOnly:true, value:"Julien"}), h("input", {readOnly:true, value:"ABRIAL"}),
    h("div", {className:"eleve-erreur"}, "Ton code n'est pas encore enregistré : lève la main."),
    Clavier(true),
    h("button", {className:"btn-accueil", "data-va":"t-binome"}, "Entrer →")));
}
function EcrTuEsBien(){   // « 1 élève » : le raccourci MJPC demande d'abord « Tu es bien Julien ? » (333)
  return h("div", {className:"eleve-page"}, DECO.map(function(x, i){ return h("span", {key:i, className:"deco"}, x); }),
    h("div", {className:"eleve-card"}, h("h1", null, "Tu es bien Julien ?"),
      h("div", {className:"combien"}, h("button", {className:"btn btn-primary", "data-va":"t-attest-1"}, "Oui"), h("button", {className:"btn btn-ghost", "data-va":"t-login"}, "Non"))));
}
function EcrRejoins(e, avec, emoji){   // binômes imposés (15) : l'élève à la mauvaise tablette
  return Page(null, null, h("div", {className:"rejoins"}, h("div", {className:"rej-em"}, emoji), h("div", {className:"rej-t"}, "Tu es avec " + avec.prenom + " : laisse cette tablette à quelqu'un d'autre et rejoins " + avec.prenom + ".")));
}
function EcrDeplace(e, chez){   // déplacé pendant la séance (72) : il retape son code sur sa nouvelle moitié
  return Page(badgeDe(e), EV.titre, h("div", {className:"etat-attente deplace"}, e.prenom + ", va sur la tablette de " + chez));
}

/* ════════ Pendant les questions ════════ */
function EcrDemoReflexion(e, qi){   // la démo (550, 551) : le bandeau, du début à la fin
  var sv = EV; EV = DEMO_EV;
  try { var r = EcrReflexion(e, qi, 18); } finally { EV = sv; }
  return React.cloneElement(r, null, r.props.children[0], React.cloneElement(r.props.children[1], null,
    h("div", {key:"bd", className:"demo-bandeau"}, "🎓 Évaluation d'entraînement : elle ne compte pas."), r.props.children[1].props.children));
}
var DEMO_EV = {titre:"🎓 Démo — apprendre le déroulé", mode:"strict", questions:[
  {enonce:"Quelle est la capitale de l'Italie ?", choix:["Milan","Naples","Rome","Venise"], bonnes:[2], niveau:"facile", reflexion:20, reponse:15, competences:[]},
  {enonce:"Lesquelles sont des capitales européennes ?", choix:["Madrid","Genève","Berlin","Sydney"], bonnes:[0,2], niveau:"standard", reflexion:30, reponse:20, competences:[]},
  {enonce:"Pourquoi l'araignée n'est-elle pas un insecte ?", choix:["Parce qu'elle a six pattes","Parce qu'elle a huit pattes","Parce qu'elle tisse une toile","Parce qu'elle est trop grande"], bonnes:[1], niveau:"standard", reflexion:30, reponse:20, competences:[]}]};
/* B, dans le flux (495) : Michel a cliqué Venise ; sa feuille dit Rome : il répond « Non » */
function EcrDeclareFlux(e, qi, sel, chrono){
  var q = EV.questions[qi], ordre = ORD[qi][e.cle];
  return Page(badgeDe(e), EV.titre, h("div", {className:"eleve-q-zone"},
    QHead(qi), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"fige"}, "⏱️ Temps fini : ton clic est enregistré."),
    h("div", {className:"eleve-choix fige-choix"}, ordre.map(function(i){
      var moi = sel.indexOf(i) >= 0;
      return h("button", {key:i, className:"eleve-choix-btn" + (moi ? " selected" : ""), disabled:true, title:moi ? "Ton clic, figé : le temps de réponse est fini." : "Le temps de réponse est fini : ton clic ne change plus."}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"decl-b-titre"}, e.prenom + ", regarde ta feuille : dit-elle la même chose que ton clic ?"),
    h("div", {className:"decl-b-btns"}, h("button", {className:"decl-b-btn"}, "Oui, la même chose"), h("button", {className:"decl-b-btn"}, "Non, autre chose")),
    h("div", {className:"decl-b-chrono"}, "⏱️ " + chrono + " s")));
}

/* ════════ Les fenêtres du pilotage ════════ */
function Fenetre(fond, titre, sous, corps, actions, retour, large){
  return h(F, null, fond, h("div", {className:"checkin-overlay", "data-echap":retour},
    h("div", {className:"checkin-modal", style:{maxWidth:(large || 560) + "px"}},
      h("div", {className:"checkin-header"}, h("h3", null, titre), sous && h("div", {className:"checkin-sub"}, sous)),
      h("div", {className:"fen-corps"}, corps),
      h("div", {className:"checkin-actions"}, actions))));
}
var ST_Q1T1 = function(){ return {phase:"reponse", qi:0, tour:1, chrono:9, stats:statsQ("24/24", "10/12", "10/10", "1/3"), etat:etatQuestion({qi:0, tour:1, nonRep:["Jade", "Anna"]})}; };
var ST_Q1CL = function(){ return {phase:"attente", qi:0, stats:statsQ("24/24", "24/24", "21/24", "1/3"), passees:[0], etat:etatQuestion({qi:0, fini:true})}; };
var ST_Q2CL = function(){ return {phase:"attente", qi:1, stats:statsQ("24/24", "23/24", "9/23", "2/3"), passees:[0, 1], etat:etatQ2SansTheo, legende:LEG_Q.slice(0, 4).concat([["#fff","pas de réponse","2px dashed #EF4444"]]), remettre:"c-q2-close"}; };
function ScEcarter(){
  return Fenetre(Pilot(ST_Q1CL()), "❌ Écarter la question 3 ?", "Combien de pattes a une araignée ?",
    h(F, null,
      h("p", null, "Elle ne sera ni posée ni corrigée. Elle sort du total de la note et des compétences, comme une question manquée par un absent : les tablettes et le tableau comptent sans elle (« Question 2 / 2 »)."),
      h("p", {className:"fen-alerte"}, "⚠️ Les compétences c4-culture-01 et c4-lire-01 ne seront plus évaluées que par 2 questions : il en faut 3 pour que les quatre niveaux soient possibles."),
      h("p", {className:"fen-note"}, "« ↩️ Remettre » la défait, tant que son tour n'est pas passé. Une question bonus écartée ne change rien à la note : c'est ton fusible.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-close"}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-ecartee"}, "❌ Écarter la question 3")], "c-q1-close");
}
function ScEcartee(){
  var st = ST_Q1CL(); st.ecartees = {2:true}; st.stats = statsQ("24/24", "24/24", "21/24", "1/2"); st.remettre = "c-q1-close";
  st.alerteComp = "⚠️ c4-culture-01 et c4-lire-01 ne sont plus évaluées que par 2 questions : leurs niveaux seront moins fins (il en faut 3).";
  st.finMin = 10 * 60 + 37;
  return Pilot(st);
}
function ScAnnuler(){
  return Fenetre(Pilot(ST_Q2CL()), "⚠️ Annuler la question 2 ?", "Lesquelles sont des capitales européennes ? — posée, 23 réponses",
    h(F, null,
      h("p", null, "Elle a été posée, mais elle ne comptera pas : elle sort du total de la note et des compétences. Ses réponses restent gardées."),
      h("p", null, "Dans leur bilan, les élèves liront : « Question 2 · annulée : elle ne compte pas. »"),
      h("p", {className:"fen-note"}, "Dans ta console et tes résultats, elle garde sa marque « ⚠️ Annulée — posée, puis annulée », pour que tu voies toujours la raison. « ↩️ Remettre » la défait.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q2-close"}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-annulee"}, "⚠️ Annuler la question 2")], "c-q2-close");
}
function ScAnnulee(){ var st = ST_Q2CL(); st.annulees = {1:true}; st.stats = statsQ("24/24", "23/24", "—", "2/3"); return Pilot(st); }
function ScFinPrevue(){ var st = ST_Q1T1(); st.finMin = 11 * 60 + 2; return Pilot(st); }
function ScRouvrirTous(){
  return Fenetre(Pilot(ST_Q2CL()), "🔓 Rouvrir la question 2 pour tous ?", "Seuls ceux qui n'ont pas répondu la retrouvent, une seule fois.",
    h(F, null, h("p", null, "Ici : ", h("strong", null, "CHEVALLIER Théo"), " (tablette 12). Les deux tours reprennent pour lui seul, avec le temps de réponse de la question ; ZELLER Lou porte le voile ordinaire. Une réponse donnée est définitive : les 23 autres ne changent rien.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q2-close"}, "Annuler"), h("button", {key:2, className:"btn btn-primary", "data-va":"t-rouvrir-un", title:"Rouvre la question 2 pour ceux qui n'ont pas répondu : ici, Théo. Une seule fois."}, "🔓 Rouvrir pour ceux qui n'ont pas répondu")], "c-q2-close");
}
function ScDepart(){
  var noms = [].concat.apply([], PAIRES).filter(Boolean).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  return Fenetre(Pilot(ST_Q1T1()), "🚫 Départ d'un élève", "Qui part en cours de séance ? (infirmerie, tablette en panne…)",
    h(F, null, h("p", {className:"fen-note"}, "Il ne bloque plus la classe : son binôme continue seul ; ses questions manquées sortent de son total (« noté sur 7 questions sur 11 »), et tu fixes sa note d'après sa feuille."),
      h("div", {className:"depart-grille"}, noms.map(function(n){ return h("div", {key:n, className:"depart-l"}, h("span", null, n), h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-parti"}, "🚫 Parti")); }))),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1"}, "Annuler")], "c-q1-tour1", 760);
}
function ScParti(){
  var st = ST_Q1T1(); var base = st.etat;
  st.etat = function(p, c){ return p === "Noah" ? {cls:"m-parti", st:"🚪 parti à 10:14"} : base(p, c); };
  st.stats = statsQ("23/23", "10/12", "10/10", "1/3");
  st.legende = LEG_Q.concat([["#E2E8F0","🚪 parti : ne bloque plus"]]);
  return Pilot(st);
}
function ScRetour(){
  return Fenetre(ScParti(), "↩️ Retour d'un élève", "Les élèves partis pendant cette séance",
    h("div", {className:"depart-l"}, h("span", null, "MAILLARD Noah — parti à 10:14 · tablette 6, avec LACOMBE Emma"), h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-q1-tour1"}, "↩️ Revenu")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-parti"}, "Annuler")], "c-parti");
}
function ScTerminer(){
  return Fenetre(Pilot(ST_Q1T1()), "🛑 Terminer la session ?", CLASSE + " — " + EV.titre + " · question 1, 1er tour",
    h(F, null, h("p", null, "La séance est close, et l'archive s'écrit avec les notes telles qu'elles sont, quelle que soit la phase. Les questions pas encore corrigées n'ont pas de recopie : tu fixes ces notes d'après les feuilles, dans Données → Résultats."),
      h("p", null, "Les tablettes oublient leurs élèves et reviennent à « Combien êtes-vous sur cette tablette ? ».")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1"}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"t-fin"}, "🛑 Terminer la séance")], "c-q1-tour1");
}
function ScVoirTablette(){
  var tab = tourScene(0, 1, 9, [2], []);
  return Fenetre(Pilot(ST_Q1T1()), "📱 Tablette 1 · ABRIAL Julien · DUVERNAY Michel — en direct", "Ce que montrent ses deux moitiés, maintenant : 1er tour de la question 1.",
    h("div", {className:"voir-tab"}, h("div", {className:"voir-tab-in"}, tab)),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-q1-tour1"}, "✕ Fermer")], "c-q1-tour1", 900);
}
function ScDeplacer(){
  var st = ST_Q1CL();
  st.paires = [["CHEVALLIER Théo","DUVERNAY Michel"]].concat(PAIRES.slice(1, 11), [["ABRIAL Julien","ZELLER Lou"]]);
  var base = st.etat;
  st.etat = function(p, c){ return p === "Théo" ? {cls:"m-deplace", st:"↔️ va sur la tablette 1 : retape son code"} : p === "Julien" ? {cls:"m-deplace", st:"↔️ va sur la tablette 12 : retape son code"} : base(p, c); };
  st.sousTitre = "ABRIAL Julien et CHEVALLIER Théo échangés : leurs réponses déjà données les suivent";
  return Pilot(st);
}
function ScQR(){
  var fond = Pilot(ST_Q1T1());
  var cases = []; for(var i = 0; i < 29 * 29; i++){ var x = i % 29, y = Math.floor(i / 29); var coin = (x < 7 && y < 7) || (x > 21 && y < 7) || (x < 7 && y > 21);
    var on = coin ? ((x % 22 === 0 || x % 22 === 6 || y % 22 === 0 || y % 22 === 6) || (x % 22 >= 2 && x % 22 <= 4 && y % 22 >= 2 && y % 22 <= 4)) : ((x * 7 + y * 13 + x * y) % 3 === 0); cases.push(on ? 1 : 0); }
  return h(F, null, fond, h("div", {className:"modal-back", "data-echap":"c-q1-tour1"},
    h("div", {className:"modal", style:{maxWidth:"420px", textAlign:"center"}},
      h("button", {className:"modal-close", "data-va":"c-q1-tour1"}, "✕"),
      h("h2", null, "📱 Pilotage mobile"),
      h("p", {style:{marginBottom:"1rem", fontSize:".9rem", color:"var(--gris)"}}, "Scanne avec ton téléphone. La fenêtre se ferme automatiquement."),
      h("div", {className:"qr-dessin"}, cases.map(function(c, i){ return h("span", {key:i, className:c ? "on" : ""}); })),
      h("button", {className:"btn btn-ghost btn-sm", style:{marginTop:".8rem"}, "data-va":"p-reponse", title:"Montre ce que ton téléphone affiche une fois le QR scanné : ta télécommande."}, "📱 Voir le téléphone"))));
}

/* ── Le téléphone, ta télécommande (418) : les temps en direct, la fin prévue, « ❌ Écarter » ── */
function TelTemps(p){
  var q = EV.questions[p.qi];
  var s1 = useState(q.reflexion), r = s1[0], setR = s1[1];
  var s2 = useState(q.reponse), rp = s2[0], setRp = s2[1];
  var s3 = useState(10 * 60 + 39), fin = s3[0], setFin = s3[1];
  function ligne(lbl, v, set, k){
    return h("div", {className:"tel-temps-l"}, h("span", null, lbl + " " + v + " s"),
      [5, 10, 30].map(function(n){ return h("button", {key:n, className:"tel-btn tb-jaune tb-small", "data-local":"1", title:BULLES["+" + n], onClick:function(){ set(v + n); setFin(fin + k * n / 60); }}, "+" + n); }));
  }
  var deb = fin - FIN_HEURE;
  return h("div", {className:"tel-temps"}, ligne("🧠 Réflexion", r, setR, 1), ligne("✋ Réponse", rp, setRp, 2),
    h("div", {className:"tel-fin" + (deb > 0 ? " deborde" : "")}, deb > 0 ? "🏁 Fin prévue " + hm(fin) + ", " + Math.round(deb) + " min après la fin de l'heure" : "🏁 Fin prévue " + hm(fin) + " · fin de l'heure 10:57"));
}
function TelReponse(){
  var modeDe = function(p, cote){ var premier = cote === (PREMIER[0] === "J" ? "g" : "d"); if(!premier) return {mode:"voile"}; if(p === "Jade" || p === "Anna") return {mode:"rep"}; return {qi:0, mode:"q"}; };
  return TelCadre([
    TelBandeau("Phase : réponse — Q 1/3", "1er tour : moitiés de gauche"),
    h(TelChrono, {key:"c", reste:9, total:EV.questions[0].reponse}),
    h("div", {key:"tt"}, h(TelTemps, {qi:0})),
    h("div", {key:"q"}, TelQ(0)),
    h("div", {key:"s", className:"tel-suiv"}, h("span", {style:{fontWeight:900, color:"var(--violet)"}}, "Suiv. Q2 : "), EV.questions[1].enonce,
      h("button", {className:"tel-mini-b", "data-va":"c-ecarter", title:BULLES["❌ Écarter"]}, "❌ Écarter")),
    h("div", {key:"a", className:"tel-actions"},
      h("button", {className:"tel-btn tb-vert tb-large", "data-va":"t-q1-passage2"}, "⏭️ Tour suivant"),
      h("div", {className:"g2"}, h(BoutonPauseTel), h("button", {className:"tel-btn tb-ghost tb-small", "data-local":"1", title:BULLES["🔄 Chrono"], onClick:function(){ document.dispatchEvent(new Event("maquette-relancer")); }}, "🔄 Chrono"))),
    h("div", {key:"st"}, TelStats(0, [])),
    h("div", {key:"l"}, TelListe("TABLETTES — 10 / 12 ont répondu · clic sur un nom pour agir", modeDe)),
    h("div", {key:"lg"}, TelLegende(["✓ juste", "✓+ une en trop", "½ une sur deux", "✗ faux", "🙈 attend son tour", "⏳ répond"])),
    h("div", {key:"t"}, h("button", {className:"tel-btn tb-rouge tb-small", "data-va":"c-terminer"}, "🛑 Terminer la session"))]);
}
function BoutonPauseTel(){
  var s = useState(false), pause = s[0], setPause = s[1];
  return h("button", {className:"tel-btn tb-ghost tb-small", "data-local":"1", title:pause ? BULLES["▶️ Reprendre"] : BULLES["⏸️ Pause"], onClick:function(){ setPause(!pause); }}, pause ? "▶️ Reprendre" : "⏸️ Pause");
}

/* ── Le tableau (33, 93) : « 1er tour » ou « 2e tour » à côté du chrono, jamais les choix ; le stylo ── */
function Board(mode){
  var qi = mode === "reponse" ? 0 : 1, q = EV.questions[qi];
  var bandeau = h("div", {className:"board-bandeau-haut"},
    h("span", {className:"board-classe-mini"}, CLASSE),
    h("span", {className:"board-niveau-pastille", style:{background:NIV[q.niveau].color}}, NIV[q.niveau].label),
    h("span", {className:"board-q-count"}, mode === "reponse" ? "Question 1 / 3" : "Correction — Q2 / 3"),
    mode !== "correction" && h("span", {className:"board-progress"}, mode === "reponse" ? "✋ 10 / 12 ont répondu" : "✍️ 18 / 24 ont répondu"));
  var corps;
  if(mode === "reponse"){
    corps = h("div", {className:"board-active board-reflexion"}, bandeau,
      h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
      h("div", {className:"board-chrono-zone"},
        h("div", {className:"board-chrono-label"}, "🖊️ ", "POSE TON STYLO."),
        h("div", {className:"board-tour-l"}, Cercle(9, q.reponse, "#EC4899"), h("span", {className:"board-tour"}, "1er tour")),
        h("div", {className:"board-chrono-sub"}, "Temps de réponse")));
  } else if(mode === "recopie"){
    corps = h("div", {className:"board-active board-reflexion recopie"}, bandeau,
      h("div", {style:{textAlign:"center", paddingTop:".6rem"}}, h("span", {className:"board-correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe")),
      h("div", {className:"board-enonce-bloc"}, h("div", {className:"board-enonce"}, q.enonce)),
      h("div", {className:"board-chrono-zone"},
        h("div", {className:"board-chrono-label"}, "✍️ Qu'as-tu écrit sur ta feuille ?"),
        Cercle(7, q.reponse, "#EA580C"),
        h("div", {className:"board-chrono-sub"}, "Temps de réponse")));
  } else {
    corps = h("div", {className:"board-active board-correction"}, bandeau,
      h("div", {style:{textAlign:"center"}}, h("span", {className:"board-correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe")),
      h("div", {className:"board-reponse-enonce"}, q.enonce),
      h("div", {className:"board-choix-grille"}, q.choix.map(function(c, i){
        var bon = q.bonnes.indexOf(i) >= 0;
        return h("div", {key:i, className:"board-choix-item " + (bon ? "choix-bon" : "choix-mauvais")}, h("span", {className:"board-choix-texte"}, c), bon && h("span", {className:"board-choix-coche"}, "✓"));
      })),
      h("div", {className:"board-correction-bas"}, "✅ Bonnes réponses : " + q.bonnes.map(function(i){ return q.choix[i]; }).join(", ")),
      h("div", {className:"board-explication", style:{margin:"0 2rem 1.2rem"}}, h("div", {className:"board-explication-titre"}, "💡 Explication"), h("div", {className:"board-explication-texte"}, q.explication)));
  }
  return h("div", {className:"board-with-aside"}, h("div", {className:"board-main"}, corps), BoardAside(mode));
}

/* ════════ L'accueil, le mode d'emploi, Réglages ════════ */
function Accueil(){
  return h("div", {className:"accueil"},
    ["⭐","🎯","✨","💡","🎲","🔥"].map(function(em, i){ return h("span", {key:i, className:"deco"}, em); }),
    h("h1", null, "📝 Évaluation QCM"),
    h("p", {className:"sous"}, "Outil d'évaluation pour la classe."),
    h("button", {className:"btn-accueil", "data-va":"t-combien"}, "🎓 Mode élève"),
    h("button", {className:"lien-prof", "data-va":"c-evals", title:"Ouvre la console avec ton code ou ta clé."}, "Accès professeur"));
}
var MODE_EMPLOI = [
  ["La séance, en classe", "Deux élèves par tablette, une moitié chacun. Tu lances depuis « 🎯 Pilotage classe » : la classe, l'évaluation, la durée comptée, les binômes proposés (d'abord les exclusions de MJPC, puis le classement du QCM précédent) ; l'appel ; l'heure de fin. Chaque élève s'identifie avec son code, coche son attestation ligne par ligne."],
  ["Une question", "Réflexion : l'énoncé sans les choix, chacun écrit sa réponse en entier sur sa feuille. Puis « POSE TON STYLO » : au 1er tour, l'un répond pendant que l'autre, voilé, lui laisse la tablette ; au 2e tour, l'inverse, choix mélangés. À la fin de son temps, chacun dit si sa feuille dit la même chose que son clic (5 s). On alterne qui commence. Les temps se tapent en direct, avec « +5 », « +10 », « +30 » ; la fin prévue suit. « ❌ Écarter » retire une question pas encore posée, « ⚠️ Annuler » une question déjà posée."],
  ["La correction", "Après l'estimation et la seconde attestation, chaque question, de la plus ratée à la mieux réussie : chacun lit la feuille de son voisin et clique ce qu'elle dit, avant la révélation (« 🔒 Révéler » attend tous les présents). Tu commentes après la révélation, jamais avant. Puis la co-évaluation : chacun dit s'il pense que son voisin a bien lu sa feuille ; un désaccord t'alerte aussitôt."],
  ["La note", "La note, c'est la feuille. Une question vaut au plus 1 point : en tout ou rien, 1 ou 0 ; en partiel, une part du point par bonne case, autant de retiré par mauvaise, sans descendre sous 0. Une fois par évaluation, une question dont la feuille est fausse et la tablette entièrement juste compte comme juste : « Trouvée au dernier moment ». « Ma feuille ne dit aucun de ces choix » vaut 0. La note est provisoire jusqu'à ce que tu rendes les copies."],
  ["Le soir", "Données → Résultats : les notes, les compétences, les feuilles à lire (lecture contestée, « aucun de ces choix », « Non » au clic). « Que dit la feuille ? » corrige une question ou fixe une note. Le bilan général de chaque élève est pré-rempli : modifie-le, valide-le. Puis « rendre les copies », et le PDF « notes et compétences » pour École Directe."],
  ["Le point d'autonomie", "Chaque élève commence avec son point : « Travailler seul et de façon responsable » et « S'investir dans son travail, en classe et à la maison », côté élève (les intitulés officiels dans le PDF). « ⛔ Retirer le point d'autonomie », en direct ou le soir, met les deux compétences en Maîtrise insuffisante ; la note ne bouge pas. « ↩️ Rendre » le défait."]
];
function ModeEmploi(){
  return h(F, null, Lancement(false), h("div", {className:"modal-back", "data-echap":"c-lancer"},
    h("div", {className:"modal", style:{maxWidth:"760px"}},
      h("button", {className:"modal-close", "data-va":"c-lancer"}, "✕"),
      h("h2", null, "📖 Mode d'emploi"),
      MODE_EMPLOI.map(function(x, i){ return h("div", {key:i, className:"me-bloc"}, h("h3", null, x[0]), h("p", null, x[1])); }))));
}
var NIVEAUX_MAITRISE = [["🟢", "Très bonne maîtrise", "15", "20"], ["🔵", "Maîtrise satisfaisante", "10", "15"], ["🟠", "Maîtrise fragile", "5", "10"], ["🔴", "Maîtrise insuffisante", "0", "5"]];
function Reglages(){
  function carte(titre, aide, enfants){ return h("div", {className:"card"}, h("h2", null, titre, InfoI(aide)), enfants); }
  return Console("reglages", null, h(F, null,
    carte("👥 Classes et élèves", "Les classes sont communes à toutes les applications MJPC : elles se gèrent une seule fois, depuis la console MJPC. Les exclusions aussi (« 🚫 Jamais avec… », sur la fiche de la classe).",
      h(F, null, h("p", {style:{opacity:.85}}, "Les listes d'élèves, leurs codes, leurs aménagements et leurs exclusions appartiennent au site MJPC, qui les partage avec toutes les applications."),
        h("button", {className:"btn", "data-va":"m-classe-exclusions"}, "Ouvrir la console MJPC →"))),
    carte("🤖 Le prompt de création d'éval", "Le texte à coller dans l'instance de création d'éval. À la copie, l'app y met ton chapitre, ses compétences avec leur libellé élève, les quatre difficultés et les limites de longueur mesurées sur une demi-tablette.",
      h(F, null, h("p", {style:{opacity:.85}}, "Le prompt du cadrage (tour 630). Il ne devine jamais un temps : il te demande chaque temps, te dit « ça ne rentre pas », et ne produit le JSON qu'à ton « produis le JSON »."),
        h("div", {className:"row"}, h("button", {className:"btn btn-or", "data-va":"c-reglages-prompt"}, "📋 Copier le prompt"), h("button", {className:"btn btn-ghost", "data-va":"c-reglages-prompt"}, "✏️ Modifier le prompt"), h("button", {className:"btn btn-ghost", "data-va":"c-reglages-prompt"}, "🔄 Restaurer le prompt par défaut")))),
    carte("⏱️ Les durées de la séance", "Les mêmes pour le prompt et pour la garde de l'app : elles comptent la durée d'une évaluation au collage, au lancement et pendant la séance (la fin prévue). L'app note tes vraies durées pour les corriger.",
      h(DureesSeance)),
    carte("🎚️ Les niveaux de maîtrise et la note", "Les bornes portent sur la note, quelle que soit son échelle ; une compétence se met sur la même échelle, puis passe dans les mêmes tranches. L'app refuse un réglage qui laisse un trou ou fait se chevaucher deux paliers.",
      h(NiveauxMaitrise)),
    h(EditeurTextesQCM),
    carte("ℹ️ Version", "La version de l'app, et le socle qu'elle embarque.",
      h("p", {style:{opacity:.85}}, "Évaluations QCM — version de la livraison · socle MJPC-CORE"))), false);
}
function DureesSeance(){
  var lignes = [["Installation et consignes", 5, "min"], ["Correction, par question", 1, "min"], ["Co-évaluation et bilan", 2, "min"], ["Passage de la tablette, avant chaque tour", 3, "s"], ["« Ta feuille dit-elle la même chose que ton clic ? »", 5, "s"], ["Entre deux questions", 15, "s"]];
  return h("div", {className:"reg-grille"}, lignes.map(function(l, i){ return h("label", {key:i, className:"reg-l"}, h("span", null, l[0]), h("input", {type:"number", defaultValue:l[1], min:0, title:"Tape la durée ; elle vaut pour toutes les séances à venir."}), h("span", null, l[2])); }),
    h("button", {className:"btn btn-primary btn-sm", "data-va":"c-reglages"}, "💾 Enregistrer"));
}
function NiveauxMaitrise(){
  return h("div", null,
    h("label", {className:"reg-l"}, h("span", null, "Note sur :"), h("input", {type:"number", defaultValue:20, title:"L'échelle de la note : la note est le nombre de points sur le nombre de questions, ramené sur cette échelle, au dixième."})),
    NIVEAUX_MAITRISE.map(function(n, i){ return h("div", {key:i, className:"reg-niv"}, h("span", null, n[0] + " "), h("input", {defaultValue:n[1], title:"Le nom du niveau, tel qu'il s'affiche partout."}), h("span", null, " de "), h("input", {type:"number", defaultValue:n[2], title:"La borne basse du niveau, comprise."}), h("span", null, i === 0 ? " à " : " à moins de "), h("input", {type:"number", defaultValue:n[3], title:"La borne haute : elle appartient au niveau du dessus."})); }),
    h("p", {className:"reg-p"}, "Les tranches s'écrivent « de 5 à moins de 6 » : aucune note ne tombe entre deux (340)."),
    h("button", {className:"btn btn-primary btn-sm", "data-va":"c-reglages"}, "💾 Enregistrer"));
}
var TEXTES_ELEVE = [
  ["Avant le lancement de l'évaluation", "L'évaluation n'a pas encore commencé. Elle s'ouvrira quand nous la lancerons ensemble.", "Vu par l'élève qui ouvre l'application alors qu'aucune évaluation n'est lancée pour sa classe."],
  ["Avant la correction", "La correction s'ouvrira dans un instant.", "Vu quand la phase de réponse est close et que la correction n'est pas encore lancée."],
  ["À la fin de l'évaluation", "C'est terminé. Tes réponses sont enregistrées.", "Vu quand tu as terminé la session. Ce texte s'affiche quel que soit le résultat : il parle du travail fait, jamais de la réussite."]];
function EditeurTextesQCM(){
  return h("div", {className:"card"},
    h("h2", null, "💬 Ce que lisent les élèves", InfoI("Les messages qui CONSTATENT un état ne sont pas modifiables : ils sont vrais dans tous les cas. Seuls les messages qui ANNONCENT quelque chose sont ici, parce qu'eux dépendent de ton organisation.")),
    h("p", {style:{opacity:.85}}, h("strong", null, "Éditeur des messages élève."), " Ces phrases s'affichent sur les tablettes de tes élèves. Modifie-les librement : un champ laissé vide revient au texte d'origine."),
    TEXTES_ELEVE.map(function(c, i){ return h("div", {key:i, style:{marginBottom:"1rem"}},
      h("label", {style:{display:"block", fontWeight:600, marginBottom:".25rem"}}, c[0]),
      h("textarea", {rows:2, defaultValue:c[1], title:"Modifie le texte ; il s'enregistre quand tu quittes le champ.", style:{width:"100%", fontFamily:"inherit", fontSize:".9rem", padding:".5rem", borderRadius:"8px"}}),
      h("p", {style:{fontSize:".78rem", opacity:.7, margin:".2rem 0 0"}}, c[2])); }));
}
function ReglagesPrompt(){
  var lignes = (typeof PROMPT_TEXTE === "string" ? PROMPT_TEXTE : "").split("\n");
  return h(F, null, Reglages(), h("div", {className:"modal-back", "data-echap":"c-reglages"},
    h("div", {className:"modal", style:{maxWidth:"900px"}},
      h("button", {className:"modal-close", "data-va":"c-reglages"}, "✕"),
      h("h2", null, "🤖 Le prompt de création d'éval"),
      h("p", {style:{fontSize:".85rem", color:"var(--gris)"}}, "Chapitre choisi : 3e · Chapitre 1 — Poésie et peinture au XIXe siècle. Les jetons {{…}} sont remplis à la copie."),
      h("textarea", {className:"json", readOnly:true, value:lignes.join("\n"), style:{minHeight:"420px", fontSize:".78rem"}}),
      h("div", {className:"row", style:{marginTop:".6rem"}}, h("button", {className:"btn btn-or", "data-va":"c-reglages"}, "📋 Copier le prompt"), h("button", {className:"btn btn-ghost", "data-va":"c-reglages"}, "💾 Enregistrer"), h("button", {className:"btn btn-ghost", "data-va":"c-reglages"}, "Annuler")))));
}

/* ════════ Les scènes de l'étape 2 ════════ */
SCENES = SCENES.concat([
  {id:"c-accueil", vue:"eleve", render:Accueil},
  {id:"c-echange-refuse", vue:"console", render:function(){ return Lancement(false, {refus:["CARRÉ Tom", "ESNAULT Inès"]}); }},
  {id:"c-demo-lancer", vue:"console", render:function(){ return Lancement(false, {demo:true}); }},
  {id:"t-demo-q", vue:"tablette", render:function(){ return Tablette(EcrDemoReflexion(J, 2), EcrDemoReflexion(M, 2)); }},
  {id:"c-demo-faite", vue:"console", render:function(){ return Lancement(false, {demoFaite:true}); }},
  {id:"t-un-eleve", vue:"tablette", render:EcrTuEsBien},
  {id:"t-login-inconnu", vue:"tablette", render:function(){ return Tablette(EcrLoginInconnu(), EcrLogin({champ:"code"})); }},
  {id:"t-rejoins", vue:"tablette", render:function(){ return Tablette(EcrBinome({nom:"CARRÉ Tom", prenom:"Tom"}, ""), EcrRejoins(M, J, "👬")); }},
  {id:"t-attest-1", vue:"tablette", render:function(){ return Tablette(Attest1(J, 3), Attest1(M, 0)); }},
  {id:"t-attest-2", vue:"tablette", render:function(){ return Tablette(Attest1(J, 8), Attest1(M, 5)); }},
  {id:"t-q1-b-michel", vue:"tablette", render:function(){ return Tablette(Voile(M, false, J), EcrDeclareFlux(M, 0, [3], 4)); }},
  {id:"t-deplace", vue:"tablette", render:function(){ return Tablette(EcrDeplace(J, "Lou"), EcrAttente(M)); }},
  {id:"c-q2-close", vue:"console", render:function(){ return Pilot(ST_Q2CL()); }},
  {id:"c-ecarter", vue:"console", vh:900, render:ScEcarter},
  {id:"c-ecartee", vue:"console", render:ScEcartee},
  {id:"t-q2-ecartee", vue:"tablette", render:function(){ var r = EcrReflexion(J, 1, 22), r2 = EcrReflexion(M, 1, 22); return Tablette(r, r2); }},
  {id:"c-annuler", vue:"console", vh:900, render:ScAnnuler},
  {id:"c-annulee", vue:"console", render:ScAnnulee},
  {id:"c-fin-prevue", vue:"console", render:ScFinPrevue},
  {id:"c-rouvrir-tous", vue:"console", vh:900, render:ScRouvrirTous},
  {id:"c-depart", vue:"console", vh:1000, render:ScDepart},
  {id:"c-parti", vue:"console", render:ScParti},
  {id:"c-retour", vue:"console", vh:900, render:ScRetour},
  {id:"c-terminer", vue:"console", vh:900, render:ScTerminer},
  {id:"c-voir-tablette", vue:"console", vh:1000, render:ScVoirTablette},
  {id:"c-deplacer", vue:"console", render:ScDeplacer},
  {id:"c-qr", vue:"console", vh:900, render:ScQR},
  {id:"c-mode-emploi", vue:"console", vh:1100, render:ModeEmploi},
  {id:"c-reglages", vue:"console", render:Reglages},
  {id:"c-reglages-prompt", vue:"console", vh:1000, render:ReglagesPrompt}
]);
/* la question 2 posée sur deux questions (la 3 écartée) : « Question 2 / 2 » */
(function(){ var sc = SCENES.filter(function(s){ return s.id === "t-q2-ecartee"; })[0];
  sc.render = function(){ var sv = EV; EV = {titre:sv.titre, mode:sv.mode, questions:sv.questions.slice(0, 2)}; try { return Tablette(EcrReflexion(J, 1, 22), EcrReflexion(M, 1, 22)); } finally { EV = sv; } }; })();
/* Les scènes existantes refaites à l'étape 2 */
function refaire(id, fn){ var sc = SCENES.filter(function(s){ return s.id === id; })[0]; if(!sc) throw new Error("refaire : " + id); sc.render = fn; }
var LEA = {cle:"Le", nom:"BAUDRY Léa", prenom:"Léa", sexe:"F", voisin:{prenom:"Tom", sexe:"M"}};
refaire("t-rejoins", function(){ return Tablette(Attest1(LEA, 2), EcrRejoins(M, J, "👬")); });
refaire("t-binome", function(){ return Tablette(Attest1(J, 0), EcrBinome(M, "48")); });
refaire("c-lancer", function(){ return Lancement(false); });
refaire("c-appel", function(){ return Lancement(true); });
SCENES.filter(function(s){ return s.id === "c-appel"; })[0].vh = 900;
refaire("c-pret", function(){ return Pilot({phase:"idle", qi:null, stats:[["23/24", "connectés"], ["22/24", "attestations"], ["0/3", "questions"]],
  sousTitre:"qui est assis où, et où en est son attestation",
  legende:[["#E8F5E9","✓ prêt : toutes les lignes cochées"],["#FEF3C7","attestation en cours : lignes cochées sur 8"],["#F1F5F9","pas encore entré"]],
  etat:function(p){ return p === "Enzo" ? {cls:"m-attest", st:"attestation 5/8"} : p === "Lou" ? {cls:"m-connexion", st:"pas encore entrée"} : {cls:"m-pret", st:"✓ prêt · 10:0" + ((p === "Julien" || p === "Michel") ? 4 : (p.length % 5 + 3))}; }}); });
refaire("c-q1-close", function(){ return Pilot(ST_Q1CL()); });
refaire("c-rouvrir-un", function(){ return RouvrirUn(); });

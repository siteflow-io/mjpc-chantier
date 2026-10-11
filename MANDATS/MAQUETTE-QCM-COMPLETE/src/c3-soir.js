/* ═══════════════ Complément 3 — avant l'heure, le soir et l'élève, au moment de la scène ═══════════════
   Les séances passées et leurs dates, la liste des résultats, le tableau d'une séance, la fiche d'un élève, la corbeille,
   « Mes évaluations » et le bilan rendu : tout vient du scénario et du calendrier (src/scenario.js). */

function evalDeSeance(se){ return se.eval === "essai" ? SCN.EV_ESSAI : se.eval === "demo" ? SCN.DEMO : SCN.evalParId(se.eval); }
function presentsTexte(se){ var n = se.eleves ? se.eleves.length : 25 - se.absents.length; return n + " présent" + (n > 1 ? "s" : "") + (se.absents.length ? ", " + se.absents.length + " absent" + (se.absents.length > 1 ? "s" : "") + (se.absents.length === 1 ? " (" + se.absents[0] + ")" : "") : ""); }
// les feuilles encore à lire d'une séance, au moment k : une séance rendue n'en a plus (rendre suppose toutes les feuilles lues)
function lireDeSeance(se, k){ if(se.id === "S08") return SCN.aLire(k).filter(function(x){ return !x.lue; }).length; return SCN.rendueAu(se.id, k) ? 0 : (se.aLire || 0); }
function rendueAu(se, k){ return SCN.rendueAu(se.id, k) ? se.rendues : null; }

/* ════════ Avant l'heure : les séances précédentes de la classe ════════ */
function SessionsPrecedentes(){
  var k = MO(), av = SCN.seancesAvant(k), prec = SCN.qcmPrecedent(k);
  var demo = av.filter(function(s){ return s.demo; })[0];
  var lignes = av.filter(function(s){ return !s.demo && !s.rattrapage; });
  return h("div", {className:"card"},
    h("h2", null, "📚 Séances précédentes — " + CLASSE, InfoI("Les séances passées de la classe : chacune ouvre ses résultats. Celle qui sert de « QCM précédent » aux binômes est marquée. La démo ne laisse qu'une ligne.")),
    h("div", {className:"results-eval-list"},
      demo && h("div", {className:"results-eval-row demo-ligne"}, h("div", null, h("div", {className:"titre"}, "🎓 Démo faite le " + jjmm(demo.date) + " · " + CLASSE + " · " + presentsTexte(demo).split(",")[0]), InfoIB("🎓 Démo faite", "Rien ne compte : ni note, ni compétence ; elle ne sert jamais aux binômes."))),
      lignes.map(function(se, i){
        var ev = evalDeSeance(se), lire = lireDeSeance(se, k), rendue = rendueAu(se, k);
        return h("div", {key:se.id, className:"results-eval-row", "data-seance":se.id},
          h("div", null, h("div", {className:"titre"}, ev.titre),
            h("div", {className:"meta"}, se.date + " " + se.heure + " · ✅ terminée · " + presentsTexte(se) + (lire ? " · " + lire + " feuille" + (lire > 1 ? "s" : "") + " à lire" : "") + (rendue ? " · copies rendues le " + jjmm(rendue) : "")),
            prec && prec.id === se.id && h("div", {className:"meta", style:{color:"var(--violet)", fontWeight:700}}, "↳ c'est le QCM précédent : il sert aux binômes")),
          h("div", {className:"row"}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-rouvrir-seance&seance=" + se.id, title:"Rouvre la séance du " + jjmm(se.date) + ", là où elle s'était terminée, après une confirmation." + (rendue ? " Ses copies rendues sont masquées jusqu'au prochain « Rendre les copies »." : "")}, "🔓 Rouvrir"),
            h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats&seance=" + se.id, title:"Ouvre les résultats de la séance du " + jjmm(se.date) + " : les notes d'après la feuille, les compétences, les feuilles à lire."}, "📊 Résultats")));
      })));
}
function SessionsPrecedentesRatt(){ return SessionsPrecedentes(); }

/* ── La durée estimée, au lancement : la somme des temps de Réglages et de ceux des questions ── */
function texteDuree(ev, seul){
  var d = SCN.dureeEstimee(ev, seul), D = SCN.DUREES, mn = function(s){ var m = Math.floor(s / 60), r = Math.round(s % 60); return m + " min" + (r ? " " + r + " s" : ""); };
  return h(F, null, "⏱️ ", h("strong", null, "Durée estimée : " + d.min + " min"), InfoIB("⏱️ Durée estimée", "Installation et consignes " + mn(D.installation) + " ; questions " + mn(d.questions) + " (pour chacune : la réflexion, puis " + (seul ? "un tour de " : "deux tours de ") + D.decompte + " s de décompte, de réponse et de " + D.b + " s où l'élève dit si sa feuille dit la même chose que son clic, puis " + D.entre + " s) ; estimation et seconde attestation " + mn(D.estimAttest) + " ; correction " + mn(d.correction) + " (" + mn(D.correctionParQ) + " par question)" + (seul ? "" : " ; co-évaluation et bilan " + mn(D.coevalBilan)) + "."), h("br"), d.min <= 45 ? "✅ Ça tient dans les 45 minutes utiles." : "⚠️ " + (d.min - 45) + " min de plus que les 45 minutes utiles.");
}

/* ── La carte de la séance à reprendre (« ⏸️ Finir à une autre heure », la séance sur papier) ── */
function CarteReprise(papier){
  var k = MO(), m = MOM(), se = SCN.seance(m.seance) || SCN.seance("S08"), pause = m.pause || {qi:m.qi || 0, tour:m.tour || 1};
  var etat = papier ? "feuilles ramassées · ta grille est remplie : " + SCN.presents(k).length + " feuilles saisies" : "en pause à la question " + (pause.qi + 1) + ", " + (pause.tour === 1 ? "1er" : "2e") + " tour · " + SCN.presents(k).length + " présents";
  var ou = papier ? "correction" : "question " + (pause.qi + 1) + ", " + (pause.tour === 1 ? "1er" : "2e") + " tour";
  return h("div", {className:"card reprise-carte"},
    h("h2", null, "⏸️ Séance à reprendre — " + CLASSE, InfoI("Une séance finie à une autre heure garde son état exact. La reprendre ouvre l'appel, avec les mêmes binômes.")),
    h("div", {className:"results-eval-row"},
      h("div", null, h("div", {className:"titre"}, papier ? "📄 " + EV.titre + " — sur papier" : EV.titre),
        h("div", {className:"meta"}, se.date + " " + se.heure + " · " + etat),
        h("div", {className:"meta", style:{color:"var(--violet)", fontWeight:700}}, "↳ pas encore « QCM précédent »", InfoIB("↳ pas encore « QCM précédent »", "Elle ne sert pas aux binômes tant qu'elle n'est pas terminée."))),
      h("button", {className:"btn btn-primary", "data-va":papier ? "c-estim" : "c-appel&reprise=" + (pause.qi + 1) + "-" + pause.tour, "data-moment":papier ? "PAP:estim" : null, title:papier ? "Reprend la séance pour la correction : l'appel, les binômes reprennent les tablettes, l'estimation, la seconde attestation, puis toutes les questions à la suite." : "Reprend la séance là où elle s'était arrêtée : l'appel, les mêmes binômes, puis le tour en cours recommence au début, voile compris."},
        "▶️ Reprendre la séance du " + jjmm(se.date) + " — " + ou)));
}

/* ════════ Données → Résultats : les séances, rangées par classe, triées ════════ */
function ListeSeancesQCM(){
  var k = MO(), s = useState("classe"), tri = s[0], setTri = s[1];
  var s2 = useState({}), replies = s2[0], setReplies = s2[1];
  var s3 = useState({}), masquees = s3[0], setMasquees = s3[1];
  var l = SCN.seancesAvant(k).filter(function(se){ return !se.demo; }).map(function(se){ return {se:se, ev:evalDeSeance(se), tri:SCN.cle(se.date, se.heure)}; });
  function trie(x){ return x.slice().sort(function(a, b){ return tri === "evaluation" ? a.ev.titre.localeCompare(b.ev.titre) || b.tri.localeCompare(a.tri) : b.tri.localeCompare(a.tri); }); }
  function ligne(x){
    var se = x.se, lire = lireDeSeance(se, k), rendue = rendueAu(se, k), masquee = !!masquees[se.id];
    var tout = se.id === "S08" ? SCN.aLire(k).length : 0;
    var etat = masquee ? "masquees" : rendue ? "rendues" : (se.id === "S08" && !lire && SCN.apres(k, "SOIR:lu")) ? "pret" : "lire";
    function bascule(){ var o = Object.assign({}, masquees); o[se.id] = !masquee; setMasquees(o); }
    return h("div", {key:se.id, className:"results-eval-row", "data-seance":se.id},
      h("div", null, h("div", {className:"titre"}, x.ev.titre),
        h("div", {className:"meta"}, se.classe + " — " + se.date + " " + se.heure + " · ✅ terminée · " + presentsTexte(se) + (se.mode === "papier" ? " · sur papier" : ""),
          lire ? h("span", {className:"meta-lire"}, " · 📌 " + lire + " feuille" + (lire > 1 ? "s" : "") + " à lire") : tout ? h("span", {className:"meta-lus"}, " · ✔ " + tout + " feuilles lues") : null),
        h("div", {className:"seance-statuts"}, h(StatutCopies, {etat:etat, date:rendue ? jjmm(se.rendues) : null, seance:se.id}), h(CochePubliee, {key:"p" + se.id}),
          etat === "rendues" && h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", onClick:bascule, title:"Masque les copies de la séance du " + jjmm(se.date) + " : les élèves ne voient plus leur note ni leur bilan, jusqu'au prochain « Rendre les copies »."}, "🙈 Masquer les copies"),
          etat === "masquees" && h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", onClick:bascule, title:"Rend de nouveau les copies de la séance du " + jjmm(se.date) + " : chaque élève revoit sa note et son bilan."}, "📤 Rendre les copies"))),
      h("div", {className:"row"},
        h("button", {className:"btn btn-ghost btn-sm", "data-va":(rendue && se.id === "S08" ? "c-resultats-rendues" : "c-resultats") + "&seance=" + se.id, title:"Ouvre le tableau de la séance du " + jjmm(se.date) + " : les notes, les compétences, les feuilles à lire."}, "📊 Ouvrir"),
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-corbeille&seance=" + se.id, title:"Met la séance du " + jjmm(se.date) + " à la corbeille, après une confirmation : gardée un an, restaurable."}, "🗑️")));
  }
  function groupe(n){
    var x = l.filter(function(y){ return niveauDeClasse(y.se.classe) === n; }), rep = replies[n] === undefined ? !x.length : replies[n];
    var classes = []; x.forEach(function(y){ if(classes.indexOf(y.se.classe) < 0) classes.push(y.se.classe); }); classes.sort();
    var corps = tri === "classe" ? classes.map(function(c){
        var d = trie(x.filter(function(y){ return y.se.classe === c; }));
        return h("div", {key:c, className:"classe-groupe", "data-classe":c}, h("div", {className:"classe-titre", "data-classe":c}, "👥 " + c + " · " + d.length + " séance" + (d.length > 1 ? "s" : "")), d.map(ligne)); })
      : trie(x).map(ligne);
    return h("div", {key:n, className:"niv-groupe", "data-niveau-groupe":n},
      h("button", {className:"niv-titre", "data-niveau":n, "data-local":"1", "aria-expanded":!rep, title:rep ? "Déplier ce niveau" : "Replier ce niveau", onClick:function(){ var o = Object.assign({}, replies); o[n] = !rep; setReplies(o); }},
        (rep ? "▸ " : "▾ ") + n + " · " + (x.length ? x.length + " séance" + (x.length > 1 ? "s" : "") : "vide pour l'instant")),
      !rep && (x.length ? corps : h("div", {className:"niv-vide"}, "vide pour l'instant")));
  }
  return h("div", {className:"card"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem"}},
      h("h2", {style:{margin:0}}, "📊 Résultats", InfoI("Toutes les séances, rangées par niveau puis par classe, comme « Mes dictées », puis triées. Chacune a sa coche « publiée » et l'état de ses copies, comme dans la correction de dictée. La démo n'y paraît jamais.")),
      h("label", {className:"tri-l"}, "Trier par ", h("select", {value:tri, "data-tri":"seances", title:"Range les séances de chaque niveau par classe, ou les trie par date ou par évaluation.", onChange:function(ev){ setTri(ev.target.value); }},
        h("option", {value:"classe"}, "classe"), h("option", {value:"date"}, "date"), h("option", {value:"evaluation"}, "évaluation")))),
    h("div", {className:"results-eval-list"}, NIVEAUX_EV.map(groupe)));
}
function niveauDeClasse(c){ var m = /^(\d)/.exec(c || ""); return m ? m[1] + "e" : "3e"; }
function ListeSeances(modale){ return Console("donnees", "results", h(F, null, h(ListeSeancesQCM), modale || null), false); }
function StatutCopies(p){
  if(p.etat === "masquees") return h("span", {className:"statut-l15c non-rendues", title:"Les copies sont masquées aux élèves, jusqu'au prochain « Rendre les copies »."}, "copies masquées");
  if(p.etat === "rendues") return h("button", {className:"statut-l15c rendues", "data-va":(p.seance === "S08" ? "c-resultats-rendues" : "c-resultats") + "&seance=" + p.seance, title:"Les copies sont rendues aux élèves. Clic : le tableau de la séance."}, "copies rendues le " + p.date);
  if(p.etat === "pret") return h("button", {className:"statut-l15c rendre pulse-l15c", "data-va":"c-rendre", title:"Toutes les feuilles à lire sont lues. Clic : la garde de « Rendre les copies », puis un second clic les rend aux élèves."}, "rendre les copies ▸");
  // (relecteur n°273) la pastille s'ouvre comme les autres : le tableau de la séance, ses feuilles à lire
  return h("button", {className:"statut-l15c non-rendues", "data-va":"c-resultats&seance=" + (p.seance || "S08"), title:"Il reste des feuilles à lire : « rendre les copies ▸ » paraît quand toutes sont lues. Clic : le tableau de la séance."}, "copies non rendues");
}
function ScRendre(){
  var k = MO(), n = SCN.aLire(k).length;
  return Fenetre(ListeSeances(null), "📤 Rendre les copies ?", EV.titre + " — " + CLASSE + " — " + SCN.seance("S08").date + " " + SCN.seance("S08").heure,
    h(F, null,
      h("p", null, "✔ Les " + n + " feuilles à lire sont lues, et chaque présent a eu la lecture de sa feuille."),
      h("p", null, "Chaque élève voit, dans « Mes évaluations », sa note définitive, son bilan et le « 📝 Bilan » de sa fiche (validé, sinon celui de l'app) ; le PDF « notes et compétences » s'ouvre.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-seances-lues", title:"Ne rend rien."}, "Annuler"), h("button", {key:2, className:"btn btn-primary", "data-va":"c-copies-rendues", title:"Rend les copies aux élèves, tout de suite."}, "📤 Rendre les copies")], "c-seances-lues");
}
// la corbeille au moment de la scène : celle du scénario, et ce qu'un geste vient d'y mettre (« &jete= », relecteur n°17)
function corbeilleDuMoment(){
  var j = paramHash("jete"), m = MOM(), l = SCN.CORBEILLE.slice();
  if(j){ var p = j.split(":"), quand = m.date + " " + hhmm(m.heure);
    if(p[0] === "seance"){ var se = SCN.seance(p[1]); if(se) l.unshift({sorte:"Séance", titre:evalDeSeance(se).titre + " — " + se.classe + " — " + se.date + " " + se.heure, quand:quand}); }
    else { var e = SCN.evalParId(p[1]); if(e) l.unshift({sorte:"Évaluation", titre:e.titre + " (" + e.questions.length + " questions)", quand:quand}); } }
  return l;
}
function Corbeille(){
  var se = SCN.seance(paramHash("seance") || "S08"), ev = evalDeSeance(se);
  return Fenetre(ListeSeances(null), "🗑️ Mettre cette séance à la corbeille ?", ev.titre + " — " + se.classe + " — " + se.date + " " + se.heure + " · " + presentsTexte(se),
    h("p", null, "Elle part dans la corbeille du site, gardée un an, avec ses réponses, ses lectures et ses notes, et sort de cette liste. Rien n'est effacé : tu la restaures depuis ", h("strong", null, "💾 Sauvegarde → 🗑️ Corbeille"), "."),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-seances", title:"Ne met rien à la corbeille."}, "Annuler"), h("button", {key:2, className:"btn btn-rouge", "data-va":"c-sauvegarde&jete=seance:" + se.id, title:"Met la séance à la corbeille, restaurable un an."}, "🗑️ Mettre à la corbeille")], "c-seances");
}

/* ════════ Le tableau d'une séance (442, 609) ════════ */
var MARQUE_RES = {j:["cell-juste", "✓"], t:["cell-trouvee", "✓"], a:["cell-faux", "∅"], f:["cell-faux", "✗"], pasdit:["cell-vide", "?"]};
function ResultatsQCM(){
  var k = MO(), m = MOM(), se = SCN.seance("S08");
  var rendues = SCN.apres(k, "SOIR:rendu"), lues = SCN.apres(k, "SOIR:lu");
  var lignes = SCN.presents(k).map(function(x){ return {p:x, nom:nomDe(x), r:calc(x)}; }).sort(function(a, b){ return a.nom.localeCompare(b.nom, "fr"); });
  var s = useState(false), exporte = s[0], setExporte = s[1];
  // (relecteur n°238) « Élève » trie par nom, dans un sens puis dans l'autre, comme son infobulle le dit
  var s2 = useState(1), sens = s2[0], setSens = s2[1];
  lignes.sort(function(a, b){ return sens * a.nom.localeCompare(b.nom, "fr"); });
  var lire = SCN.aLire(k), restent = lire.filter(function(x){ return !x.lue; }).length;
  return h("div", {className:"card"},
    TitreCarte("📊 " + EV.titre + " — " + CLASSE, [
      h("button", {key:0, className:"btn btn-primary btn-sm", disabled:!rendues, "data-local":rendues ? "1" : null, onClick:rendues ? function(){ window.open(location.pathname + "#scene=x632-pdf&m=" + encodeURIComponent(MO()), "pdf-qcm"); } : null, title:rendues ? "Ouvre l'impression du navigateur, « Enregistrer au format PDF » : une ligne par élève, la note, le niveau de chaque compétence, le commentaire." : "Fermé tant que les copies ne sont pas rendues : les notes ne sont définitives qu'à ce moment-là."}, "📄 PDF notes et compétences"),
      h("button", {key:1, className:"btn btn-or btn-sm", "data-local":"1", title:"Télécharge le tableau en CSV, pour un tableur.", onClick:function(){ setExporte(true); }}, "📥 Export CSV"),
      h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":rendues ? "c-copies-rendues" : "c-seances", title:"Revient à la liste des séances."}, "← Retour")]),
    exporte && h("div", {className:"fen-note"}, "📥 resultats-3-ESSAI-" + se.date.replace(/\//g, "-") + ".csv téléchargé."),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, se.date + " " + se.heure + " · " + presentsTexte(se) + " · questions écartées ou annulées : aucune · ",
      rendues ? h("strong", {style:{color:"#15803D"}}, "copies rendues le " + jjmm(se.rendues)) : restent ? h("strong", {style:{color:"#9A3412"}}, restent + " feuille" + (restent > 1 ? "s" : "") + " à lire") : h("strong", {style:{color:"#15803D"}}, "✔ " + lire.length + " feuilles lues")),
    h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet"},
      h("thead", null, h("tr", null,
        h("th", {className:"eleve-col trie", title:"Cliquer pour trier par nom (asc/desc). Cliquer sur un nom d'élève dans le tableau ouvre son Student Report (drill-down).", onClick:function(){ setSens(-sens); }}, "Élève" + (sens > 0 ? " ▴" : " ▾")),   // la 7.7.1, l. 8403
        EV.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i+1)); }),
        h("th", null, "Note"), h("th", null, "Sur 20"), h("th", null, "Maîtrise de la note"),
        COMPS.map(EnteteComp),
        h("th", null, "🤝 Autonomie"),
        h("th", null, "À lire sur la feuille"))),
      h("tbody", null, lignes.map(function(l){
        var mt = maitriseDe(l.r.sur20), fl = lire.filter(function(x){ return x.p === l.p; }), au = SCN.autonomie(l.p, k);
        return h("tr", {key:l.p, "data-eleve":l.p},
          h("td", {className:"eleve-cell"}, h("button", {className:"nom-fiche", "data-va":"c-fiche&eleve=" + encodeURIComponent(l.p), title:"Ouvre la fiche " + deNom(l.p) + " : sa feuille lue, sa tablette, ce qu'" + (SCN.SEXE[l.p] === "F" ? "elle" : "il") + " a dit, son point d'autonomie, son bilan général."}, l.nom)),
          l.r.st.map(function(x, i){ var c = MARQUE_RES[x]; return h("td", {key:i, className:c[0] + ((l.r.corrigees || []).indexOf(i) >= 0 ? " cell-corrigee" : "")}, c[1]); }),
          h("td", {className:"score-cell"}, l.r.complet ? l.r.n + "/" + l.r.total : "—"),
          h("td", {className:"score-cell"}, l.r.complet ? fr1(l.r.sur20) : "—"),
          h("td", null, h("span", {className:"maitrise-pill " + mt.cls}, mt.em + " " + mt.lib)),
          COMPS.map(function(c){ return h("td", {key:c, className:"comp-cell"}, PillComp(l.r, c)); }),
          h("td", {className:"comp-cell"}, au.retire ? h("span", {className:"maitrise-pill mt-rouge"}, "⛔ retiré " + au.quand) : h("span", {className:"maitrise-pill mt-vert"}, "🟢 Très bonne maîtrise")),
          h("td", {className:"alire-cell" + (fl.length ? "" : " vide")}, fl.map(function(x){ return "Q" + (x.q+1) + " : " + x.txt + (x.corrigee ? " · Corrigé d'après sa feuille" : "") + (x.lue ? " · ✔ lue" : ""); }).join(" · ")));
      })))),
    h("div", {className:"legende-res"}, "✓ juste d'après la feuille · ✓ orange : Trouvée au dernier moment · ✗ faux · ∅ « aucun de ces choix » · ⛔ : point d'autonomie retiré · ⚠️ Annulée ou ❌ Écartée : la question garde sa marque en tête de colonne"));
}
function Resultats(){ return Console("donnees", "results", h(ResultatsQCM), false); }

/* ════════ La fiche d'un élève, le soir : sa feuille lue, sa tablette, ce qu'il a dit, son autonomie, son bilan général ════════ */
function choixTexte(q, a){ return a === "aucun" ? "aucun de ces choix" : a.map(function(i){ return q.choix[i]; }).join(", "); }
function FicheSeance(p){
  var k = MO(), r = calc(p), mt = maitriseDe(r.sur20), nom = nomDe(p), voisin = SCN.voisinDe(p), au = autonomieDe(p, k), cle = p === "Julien" ? "J" : p === "Michel" ? "M" : null;
  var lire = SCN.aLire(k).filter(function(x){ return x.p === p; });
  return h("div", {className:"student-report", "data-eleve":p},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}},
      h("h3", null, "👤 " + nom + " — " + r.n + " / " + r.total + " · " + fr1(r.sur20) + " / 20 · " + mt.em + " " + mt.lib, InfoI("Pour chaque question : ce que " + voisin + " a lu sur sa feuille à la correction, ce qu'" + (SCN.SEXE[p] === "F" ? "elle" : "il") + " a cliqué sur la tablette, ce qu'" + (SCN.SEXE[p] === "F" ? "elle" : "il") + " a dit à la fin de son temps (B). « La feuille dit autre chose » corrige une question d'après sa feuille.")),
      h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats", title:"Ferme la fiche et revient au tableau de la séance."}, "✕ Fermer")),
    h("div", {className:"fiche-head fiche-head-b"}, h("span", null, ""), h("span", null, "Question"), h("span", null, "Sa feuille, lue par " + voisin), h("span", null, "Sa tablette"), h("span", null, "Ce qu'" + (SCN.SEXE[p] === "F" ? "elle" : "il") + " a dit (B)"), h("span", null, "Bonne réponse"), h("span", null, "Points"), h("span", null, "")),
    EV.questions.map(function(q, qi){
      var lu = cle ? SCN.LU_JM[cle][qi] : SCN.choixDe(SCN.LU[p][qi], qi), t = cle ? SCN.TABL[cle][qi] : SCN.choixDe(SCN.RT[p][qi], qi), s = r.st[qi];
      // (relecteur n°240) la colonne dit ce que le voisin a lu ; la correction de Paul se lit dans la pastille de la question
      var luJ = lu !== "aucun" && JSON.stringify([].concat(lu).sort()) === JSON.stringify(q.bonnes.slice().sort());
      var tJ = t !== "aucun" && JSON.stringify(t.slice().sort()) === JSON.stringify(q.bonnes.slice().sort());
      var fl = lire.filter(function(x){ return x.q === qi; })[0], dit = SCN.ditB(p, qi);
      return h("div", {key:qi, className:"fiche-q fiche-q-b"},
        h("span", {className:"num"}, "Q" + (qi+1)),
        h("span", null, q.enonce, h("div", {className:"fiche-comp"}, "🧩 " + q.competences.join(" · ")),
          (r.corrigees || []).indexOf(qi) >= 0 && h("div", null, h("span", {className:"flag ok"}, p === "Michel" && qi === 0 ? "corrigée en classe : raison donnée à Michel (Rome)" : "Corrigé d'après sa feuille")),
          fl && h(FlagLecture, {fl:fl, cle:p + qi})),
        h("span", {className:"val " + (luJ ? "j" : "f")}, choixTexte(q, lu)),
        h("span", {className:"val " + (tJ ? "j" : "f")}, choixTexte(q, t)),
        h("span", {className:"val"}, dit === "oui" ? "Oui, la même chose" : dit === "non" ? "Non, autre chose" : "rien dit"),
        h("span", {className:"val"}, choixTexte(q, q.bonnes)),
        h("span", {className:"pts"}, (r.pts[qi] || 0) + " pt"),
        h("span", {className:"fiche-acts"},
          fl && !fl.lue && h(LueBoutonC, {cle:p + qi}),
          h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-que-dit-la-feuille&eleve=" + encodeURIComponent(p) + "&q=" + (qi + 1), title:"Ouvre les choix de la question " + (qi + 1) + " : tu cliques ce que dit sa feuille, et sa note se recalcule (« Corrigé d'après ta feuille » dans son bilan)."}, "La feuille dit autre chose")));
    }),
    h("div", {className:"fiche-comps"}, h("div", {className:"tt"}, "🧩 Ses compétences"),
      COMPS.map(function(c){ var n = niveauComp(r, c), x = r.comp[c] || {n:0, max:0};
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, LIB_OFF[c]), h("span", {className:"d"}, detailComp(r, c) + " → " + x.n + "/" + x.max), h("span", {className:"maitrise-pill " + n.cls}, n.em + " " + n.lib)); }),
      ["tr-personne-03", "tr-methodes-02"].map(function(c){
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, LIB_OFF[c]), h("span", {className:"d"}, "le point d'autonomie"),
          h("span", {className:"maitrise-pill " + (au.retire ? "mt-rouge" : "mt-vert")}, au.retire ? "🔴 Maîtrise insuffisante" : "🟢 Très bonne maîtrise"));
      }),
      h("div", {className:"fiche-auto"}, au.retire
        ? h(F, null, h("span", null, "⛔ Point d'autonomie retiré " + au.quand + "."), h("button", {className:"btn btn-vert btn-sm", "data-va":"c-fiche&eleve=" + encodeURIComponent(p), title:"Rend son point d'autonomie à " + p + " : ses deux compétences d'autonomie repassent en Très bonne maîtrise."}, "↩️ Rendre"))
        : h(F, null, h("span", null, (SCN.SEXE[p] === "F" ? "Elle" : "Il") + " a gardé son point d'autonomie."), h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-fiche-garde&eleve=" + encodeURIComponent(p), title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. La note ne bouge pas. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")))));
}
function FicheMichel(){ return FicheSeance("Michel"); }
// la fiche de l'élève cliqué (« &eleve= »), le soir
function ScFiche(){ var p = paramEleve("Michel"); return Console("donnees", "results", h(F, null, h("div", {className:"card"}, FicheSeance(p), h(CarteBilanGeneral, {key:p, eleve:p}))), false); }

/* ── Le bilan général pré-rempli : ce que l'app donne à com632.js, d'après la note au moment de la scène ── */
function entreeBilan(p){
  var k = MO(), r = calc(p), mt = maitriseDe(r.sur20), es = SCN.estimation(p, k);
  return {niveau:mt.k, mode:"strict", autonomieRetiree:SCN.autonomie(p, k).retire, autonomieLibs:[LIB_ELEVE["tr-personne-03"], LIB_ELEVE["tr-methodes-02"]],
    questions:EV.questions.map(function(q, i){ return {n:i + 1, verifie:VERIF_M[i], pts:r.pts[i] || 0, niveau:q.niveau, taux:tauxQ(i)}; }),
    estimation:es ? es.type : null, ecart:es ? es.ecart : 0};
}

/* ════════ Côté élève : « Mes évaluations », le bilan rendu ════════ */
function MesEvaluations(){
  var k = MO(), p = paramHash("eleve") || "Lou", nom = nomDe(p), items = SCN.mesEvaluations(p, k);
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card", style:{maxWidth:"700px"}},
      h("h1", null, "📊 Mes évaluations"),
      h("p", {style:{opacity:.8}}, nom),
      h("div", {className:"eleves-grid", style:{gridTemplateColumns:"1fr"}}, items.map(function(x, i){
        var n = x.note, mt = n ? MAITRISE.filter(function(y){ return y.k === (n.maitrise && n.maitrise.k ? n.maitrise.k : SCN.maitriseDe(n.sur20)); })[0] : null;
        var ligne = n ? x.date + " · " + n.n + " / " + n.total + " · " + fr1(n.sur20) + " / 20 · " + mt.em + " " + mt.lib : null;
        var actif = x.etat === "bilan" && x.seance === "S08";
        if(x.etat === "bilan" && !actif) return h("div", {key:i, className:"eleve-btn mes-ev"}, h("div", {style:{fontWeight:700}}, x.titre), h("div", {style:{fontSize:".86rem", opacity:.9, marginTop:".2rem"}}, ligne));
        // une évaluation qui ne s'ouvre pas encore n'est pas un bouton : sa ligne dit pourquoi
        return h(actif ? "button" : "div", {key:i, className:"eleve-btn mes-ev " + x.etat, "data-va":actif ? "e-bilan-lou" : null},
          h("div", {style:{fontWeight:700}}, x.titre),
          h("div", {style:{fontSize:".86rem", opacity:.9, marginTop:".2rem"}},
            x.etat === "relecture" ? "En relecture : ta note sera visible quand ta copie te sera rendue" : x.etat === "absente" ? (SCN.SEXE[p] === "F" ? "Tu étais absente" : "Tu étais absent") : ligne));
      })),
      h("div", {style:{marginTop:"1.5rem"}}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-accueil"}, "← Retour"))));
}
function BilanLou(){ return BilanRendu(paramHash("eleve") || "Lou"); }
function BilanRendu(p){
  var k = MO(), r = calc(p), mt = maitriseDe(r.sur20), e = {nom:nomDe(p), prenom:p}, es = SCN.estimation(p, k), entree = entreeBilan(p), au = SCN.autonomie(p, k);
  var est = SCN.ESTIM[p], nE = est ? FOURCH.filter(function(f){ return f.k === est; })[0].n : null, emE = est ? MAITRISE.filter(function(x){ return x.k === est; })[0].em : null;
  var se = SCN.seance("S08");
  return h("div", {className:"eleve-page"},
    DECO.map(function(x, i){ return h("span", {key:i, className:"deco"}, x); }),
    h("div", {className:"eleve-card", style:{maxWidth:"760px"}},
      h("button", {className:"btn btn-ghost btn-sm", "data-va":"e-mes-evals-rendue"}, "← Mes évaluations"),
      h("h1", {style:{marginTop:".5rem"}}, EV.titre),
      h("p", {style:{opacity:.75}}, se.date),
      h("div", {className:"bilan-score fourchette-" + mt.k},
        h("div", {className:"bilan-score-emoji"}, mt.em),
        h("div", {className:"bilan-score-num"}, "Ta note : " + r.n + " / " + r.total),
        h("div", {className:"note20"}, fr1(r.sur20) + " / 20"),
        h("div", {className:"bilan-score-pct"}, mt.lib)),
      h("div", {className:"bilan-bloc"}, h("h3", null, "Question par question"),
        h("div", {className:"recap"}, EV.questions.map(function(q, i){
          var s = r.st[i];
          return h("div", {key:i, className:"recap-l " + (s === "j" || s === "t" ? "j" : "f")},
            h("span", null, s === "t" ? h(F, null, "Question " + (i+1) + " · ", h("span", {className:"v-orange"}, "✓"), " Trouvée au dernier moment") : "Question " + (i+1) + " · " + (s === "a" ? "ta feuille ne dit aucun de ces choix" : s === "j" ? "juste" : "faux"),
              (r.corrigees || []).indexOf(i) >= 0 && h("span", {className:"corrige"}, "Corrigé d'après ta feuille."),
              h("span", {className:"recap-comp"}, q.competences.map(function(c){ return LIB_ELEVE[c]; }).join(" · "))),
            h("span", {className:"pt"}, "→ " + (r.pts[i] || 0) + " point"));
        }))),
      h("div", {className:"bilan-bloc"}, h("h3", null, "Tes compétences"),
        COMPS.map(function(c){ var x = r.comp[c] || {n:0, max:0}, mm = maitriseDe(x.max ? x.n * 20 / x.max : 0);
          return h("div", {key:c, className:"comp-l"},
            h("span", null, LIB_ELEVE[c], h("span", {className:"comp-q"}, compQuestions(c).map(function(i){ return "Q" + (i+1) + " " + (r.st[i] === "j" || r.st[i] === "t" ? "✓" : "✗"); }).join(" · ") + " → " + x.n + "/" + x.max)),
            h("span", {className:"mt"}, mm.em + " " + mm.lib)); }),
        AUTO.map(function(l){ return h("div", {key:l, className:"comp-l"}, h("span", null, l), h("span", {className:"mt"}, au.retire ? "❌ " : "✅ ", au.retire ? "non atteinte" : "atteinte")); })),
      es && h("div", {className:"bilan-calibration bilan-calib-" + es.type},
        h("h3", null, "🎯 Ton estimation"),
        h("div", {className:"bilan-calib-msg"}, es.type === "ok" ? "✅ Tu te connais bien !" : es.type === "sur" ? "⚠️ Tu pensais avoir mieux fait" : "🌟 Tu te sous-estimais !"),
        es.type !== "sous" && h("div", {className:"bilan-calib-detail"}, es.type === "ok"
          ? "Tu pensais avoir " + libFourchette(nE).replace(" sur 3", "") + " " + emE + " et tu en as effectivement obtenu " + r.n + " sur " + r.total + ". Ton estimation correspond à ton vrai résultat."
          : "Tu pensais avoir " + libFourchette(nE).replace(" sur 3", "") + " " + emE + " mais tu en as eu " + r.n + " sur " + r.total + " (" + libFourchette(r.n).replace(" sur 3", "") + " " + mt.em + "). " + degreSurestime(es.ecart))),
      h("div", {className:"bilan-bloc bilan628-eleve"}, h("h3", null, "📝 Bilan"), h("p", {"data-com":JSON.stringify(entree)}, texteBilan(entree)))));
}

/* ════════ 💾 Sauvegarde : la corbeille du scénario ════════ */
function SauvegardeQCM(){
  var s1 = useState(false), exp = s1[0], setExp = s1[1];
  var s2 = useState(false), net = s2[0], setNet = s2[1];
  var m = MOM();
  return h("div", {className:"card"},
    h("h2", null, "💾 Sauvegarde", InfoI("Exporter ou importer tout le QCM, avec les classes ; la corbeille ; la maintenance ; les purges. La démo est permanente : aucune purge ne l'efface.")),
    h("p", {style:{marginBottom:".8rem", color:"var(--gris)", fontSize:".9rem"}}, "Exporte ou importe l'ensemble de la base QCM (évaluations, séances, réponses), avec les classes."),
    h("div", {className:"snapshot-row"},
      h("button", {className:"btn btn-primary", "data-local":"1", title:"Télécharge tout le QCM dans un fichier, à garder.", onClick:function(){ setExp(true); }}, "📥 Exporter snapshot"),
      h("button", {className:"btn btn-ghost", "data-va":"c-importer", title:"Remplace tout le QCM par un fichier exporté, après une confirmation : le QCM d'aujourd'hui part d'abord à la corbeille."}, "📤 Importer snapshot")),
    exp && h("div", {className:"fen-note"}, "📥 qcm-snapshot-" + m.date.split("/").reverse().join("-") + ".json téléchargé."),
    h("div", {className:"sauv-zone"},
      h("h3", {className:"sauv-h"}, "🗑️ Corbeille", InfoI("Ce qui est supprimé dans le QCM, gardé un an. La démo n'y va jamais.")),
      corbeilleDuMoment().map(function(c, i){
        return h("div", {key:i, className:"corb-l"}, h("span", {className:"k"}, c.sorte), h("span", null, h("strong", null, c.titre), h("div", {className:"d"}, (c.sorte === "Séance" ? "mise" : "mise") + " à la corbeille le " + jjmm(c.quand) + " à " + c.quand.slice(11, 16))), h(Restaurer));
      })),
    h("div", {className:"sauv-zone"},
      h("h3", {className:"sauv-h"}, "🧹 Maintenance", InfoI("Pour les séances restées ouvertes par erreur.")),
      h("p", {className:"sauv-p"}, "Si la vue tableau ou le pilotage te montrent des séances fantômes (anciennes évaluations qui n'auraient pas dû rester actives), utilise le nettoyage ci-dessous."),
      h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", title:"Ferme les séances restées actives par erreur ; une séance en cours n'est pas touchée.", onClick:function(){ setNet(true); }}, "🧹 Nettoyer les séances zombies"),
      net && h("div", {className:"fen-note"}, "🧹 Aucune séance zombie : rien à fermer.")),
    h("div", {className:"sauv-zone dashed"},
      h("h3", {className:"sauv-h rouge"}, "🗑️ Zone dangereuse", InfoI("Tout part d'abord à la corbeille, gardé un an. La démo revient à l'ouverture suivante, quelle que soit la purge.")),
      h("div", {className:"row", style:{flexWrap:"wrap", gap:".5rem"}},
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-purger", title:"Met toutes les évaluations à la corbeille, après une confirmation. La démo reste."}, "🗑️ Purger les évaluations"),
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-purger&tout=1", title:"Met tout le QCM à la corbeille, après une confirmation. La démo reste."}, "🗑️ Tout purger"))));
}

// l'en-tête de la fiche et la ligne de « Mes évaluations », calculés (les couches précédentes les écrivaient à la main)
function enteteFiche(p){ var r = calc(p), mt = maitriseDe(r.sur20); return "👤 " + nomDe(p) + " — " + r.n + " / " + r.total + " · " + fr1(r.sur20) + " / 20 · " + mt.em + " " + mt.lib; }
function ligneNote(p){ var r = calc(p), mt = maitriseDe(r.sur20); return SCN.seance("S08").date + " · " + r.n + " / " + r.total + " · " + fr1(r.sur20) + " / 20 · " + mt.em + " " + mt.lib; }

/* ── « ✔ Marquer lue » : le bouton et la pastille de la feuille changent ensemble (changement 7.6, relecteur n°282) ── */
var LUES = {lues:{}, abonnes:[]};
// une scène rendue à neuf repart de son état : ce qui a été marqué lu sur place ne survit pas au changement de scène
var rendreAvantLues = rendre;
rendre = function(){ LUES.lues = {}; return rendreAvantLues.apply(this, arguments); };
function useLues(){ var s = useState(0), set = s[1]; useEffect(function(){ var f = function(){ set(function(x){ return x + 1; }); }; LUES.abonnes.push(f); return function(){ LUES.abonnes = LUES.abonnes.filter(function(g){ return g !== f; }); }; }, []); }
function marquerLue(cle){ LUES.lues = Object.assign({}, LUES.lues); LUES.lues[cle] = true; LUES.abonnes.slice().forEach(function(f){ f(); }); }
function FlagLecture(p){ useLues(); var lue = p.fl.lue || LUES.lues[p.cle]; return h("div", null, h("span", {className:"flag" + (lue ? " ok" : "")}, (lue ? "✔ lue · " : "⚠️ ") + p.fl.txt)); }
function LueBoutonC(p){ useLues(); var lue = !!LUES.lues[p.cle];
  return h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:lue, title:lue ? "Feuille lue : le signalement est passé à « lu »." : "Tu as lu sa feuille et elle dit bien ce qui est compté : le signalement passe à « lu ».", onClick:function(){ marquerLue(p.cle); }}, lue ? "✔ lue" : "✔ Marquer lue"); }

/* ═══════════════ Complément 4 — les résultats, la fiche et le PDF de chaque séance (corrections 1 et 2) ═══════════════
   Un seul tableau des résultats, celui de « c-resultats », sert à toutes les séances : rempli depuis le scénario pour la séance
   cliquée (« &seance= »), au moment de la scène (SCN.resultat, SCN.aLireSeance, SCN.retiresSeance). Le PDF « notes et compétences »
   se construit pour la séance d'où on l'ouvre, avec la mise en page du PDF figé de la v8 (gen632.js), son modèle : pour la séance
   de 3e, il est le PDF figé, au caractère près (garde 17). */

function seanceDeLaPage(){ return paramHash("seance") || (SCN.seance(MOM().seance) ? MOM().seance : "S08"); }
function sqDe(id){ return id && id !== "S08" ? "&seance=" + id : ""; }
MARQUE_RES.x = ["cell-vide", "·"];   // une question qui n'a pas été posée à l'élève (parti avant) : ni juste ni fausse
// les libellés courts des compétences de l'évaluation de 3e, comme ceux de l'évaluation d'essai : le début du libellé officiel
COMP_COURT["c4-langue-04"] = "Construire les notions…"; COMP_COURT["c4-ecrire-02"] = "Adopter des stratégies…";
function compsDe(ev){ var o = []; ev.questions.forEach(function(q){ (q.competences || []).forEach(function(c){ if(o.indexOf(c) < 0) o.push(c); }); }); return o; }
function compQuestionsEv(c, ev){ var l = []; ev.questions.forEach(function(q, i){ if((q.competences || []).indexOf(c) >= 0) l.push(i); }); return l; }
function EnteteCompEv(c, ev){ return h("th", {key:c, className:"comp-col", title:"La compétence " + c + " : " + LIB_OFF[c] + ". Ses questions : " + compQuestionsEv(c, ev).map(function(i){ return "Q" + (i+1); }).join(", ") + "."}, "🧩 " + c, h("div", {className:"thq"}, COMP_COURT[c] + " · " + compQuestionsEv(c, ev).map(function(i){ return "Q" + (i+1); }).join(", "))); }
function PillCompEv(r, c, ev){ var m = niveauComp(r, c); return h("span", null, h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib), h("div", {className:"comp-det"}, compQuestionsEv(c, ev).map(function(i){ return "Q" + (i+1) + " " + marque(r.st[i]); }).join(" · "))); }
// le résultat d'un élève, comme le tableau le lit : à la séance du 08/10, celui de la console (calc) ; ailleurs, celui du scénario
function resultatDe(id, p, k){ if(id === "S08") return calc(p); var r = SCN.resultat(id, p, k); if(!r) return null; return Object.assign({}, r, {st:r.st.map(function(s){ return s === "n" ? "pasdit" : s; })}); }
function autonomieSeance(id, p, k){
  if(id === "S08") return SCN.autonomie(p, k);
  if(paramHash("retire") === p) return {retire:true, quand:"à " + hhmm(MOM().heure)};
  var m = SCN.moment("S3E:coeval:T");
  return SCN.retiresSeance(id, k).indexOf(p) >= 0 ? {retire:true, quand:"le " + jjmm(m.date) + " à " + hhmm(m.heure)} : {retire:false};
}

/* ════════ Le tableau d'une séance (442, 609), pour toutes les séances ════════ */
function ResultatsSeance(){
  var k = MO(), id = paramHash("seance") || "S08", se = SCN.seance(id) || SCN.seance("S08"), ev = SCN.evalDeSeance(se.id, k), comps = compsDe(ev);
  var rendues = SCN.rendueAu(se.id, k);
  var eleves = se.id === "S08" ? SCN.presents(k) : (se.eleves || SCN.NOMS).filter(function(n){ return (se.absents || []).indexOf(n) < 0; }).map(pre);
  var lignes = eleves.map(function(x){ return {p:x, nom:nomDe(x), r:resultatDe(se.id, x, k)}; }).filter(function(l){ return l.r; });
  var s = useState(false), exporte = s[0], setExporte = s[1];
  // (relecteur n°238) « Élève » trie par nom, dans un sens puis dans l'autre, comme son infobulle le dit
  var s2 = useState(1), sens = s2[0], setSens = s2[1];
  lignes.sort(function(a, b){ return sens * a.nom.localeCompare(b.nom, "fr"); });
  var lire = SCN.aLireSeance(se.id, k), restent = lire.filter(function(x){ return !x.lue; }).length;
  return h("div", {className:"card", "data-seance":se.id},
    TitreCarte("📊 " + ev.titre + " — " + CLASSE, [
      h("button", {key:0, className:"btn btn-primary btn-sm", disabled:!rendues, "data-local":rendues ? "1" : null, onClick:rendues ? function(){ window.open(location.pathname + "#scene=x632-pdf&m=" + encodeURIComponent(MO()) + "&seance=" + se.id, "pdf-qcm"); } : null, title:rendues ? "Ouvre l'impression du navigateur, « Enregistrer au format PDF » : une ligne par élève, la note, le niveau de chaque compétence, le commentaire." : "Fermé tant que les copies ne sont pas rendues : les notes ne sont définitives qu'à ce moment-là."}, "📄 PDF notes et compétences"),
      h("button", {key:1, className:"btn btn-or btn-sm", "data-local":"1", title:"Télécharge le tableau en CSV, pour un tableur.", onClick:function(){ setExporte(true); }}, "📥 Export CSV"),
      h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":rendues && se.id === "S08" ? "c-copies-rendues" : "c-seances", title:"Revient à la liste des séances."}, "← Retour")]),
    exporte && h("div", {className:"fen-note"}, "📥 resultats-3-ESSAI-" + se.date.replace(/\//g, "-") + ".csv téléchargé."),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, se.date + " " + se.heure + " · " + presentsTexte(se) + (se.mode === "papier" ? " · sur papier" : "") + " · questions écartées ou annulées : aucune · ",
      rendues ? h("strong", {style:{color:"#15803D"}}, "copies rendues le " + jjmm(se.rendues)) : !lire.length && se.id !== "S08" ? h("strong", {style:{color:"#9A3412"}}, "copies non rendues") : restent ? h("strong", {style:{color:"#9A3412"}}, restent + " feuille" + (restent > 1 ? "s" : "") + " à lire") : h("strong", {style:{color:"#15803D"}}, "✔ " + lire.length + " feuilles lues")),
    h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet", "data-longue":ev.questions.length > 6 ? "1" : null},
      h("thead", null, h("tr", null,
        h("th", {className:"eleve-col trie", title:"Cliquer pour trier par nom (asc/desc). Cliquer sur un nom d'élève dans le tableau ouvre son Student Report (drill-down).", onClick:function(){ setSens(-sens); }}, "Élève" + (sens > 0 ? " ▴" : " ▾")),   // la 7.7.1, l. 8403
        ev.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i+1)); }),
        h("th", null, "Note"), h("th", null, "Sur 20"), h("th", {className:"res-col-l"}, "Maîtrise de la note"),
        comps.map(function(c){ return EnteteCompEv(c, ev); }),
        // une évaluation sans compétences (au hub, celles de septembre) garde la colonne, vide : le même tableau pour toutes les séances
        !comps.length && h("th", {key:"sans", className:"comp-col", title:"Cette évaluation n'a pas de compétences : elle n'en a pas au hub."}, "🧩 —"),
        h("th", {className:"res-col-l"}, "🤝 Autonomie"),
        h("th", {className:"res-col-alire"}, "À lire sur la feuille"))),
      h("tbody", null, lignes.map(function(l){
        var mt = maitriseDe(l.r.sur20), fl = lire.filter(function(x){ return x.p === l.p; }), au = autonomieSeance(se.id, l.p, k);
        return h("tr", {key:l.p, "data-eleve":l.p},
          h("td", {className:"eleve-cell"}, h("button", {className:"nom-fiche", "data-va":"c-fiche&eleve=" + encodeURIComponent(l.p) + sqDe(se.id), title:"Ouvre la fiche " + deNom(l.p) + " : sa feuille lue, sa tablette, ce qu'" + (SCN.SEXE[l.p] === "F" ? "elle" : "il") + " a dit, son point d'autonomie, son bilan général."}, l.nom)),
          l.r.st.map(function(x, i){ var c = MARQUE_RES[x]; return h("td", {key:i, className:c[0] + ((l.r.corrigees || []).indexOf(i) >= 0 ? " cell-corrigee" : "")}, c[1]); }),
          h("td", {className:"score-cell"}, l.r.complet ? l.r.n + "/" + l.r.total : "—"),
          h("td", {className:"score-cell"}, l.r.complet ? fr1(l.r.sur20) : "—"),
          h("td", null, h("span", {className:"maitrise-pill " + mt.cls}, mt.em + " " + mt.lib)),
          comps.map(function(c){ return h("td", {key:c, className:"comp-cell"}, PillCompEv(l.r, c, ev)); }),
          !comps.length && h("td", {key:"sans", className:"comp-cell"}, "—"),
          h("td", {className:"comp-cell"}, au.retire ? h("span", {className:"maitrise-pill mt-rouge"}, "⛔ retiré " + au.quand) : h("span", {className:"maitrise-pill mt-vert"}, "🟢 Très bonne maîtrise")),
          h("td", {className:"alire-cell" + (fl.length ? "" : " vide")}, fl.map(function(x){ return "Q" + (x.q+1) + " : " + x.txt + (x.corrigee ? " · Corrigé d'après sa feuille" : "") + (x.lue ? " · ✔ lue" : ""); }).join(" · ")));
      })))),
    h("div", {className:"legende-res"}, "✓ juste d'après la feuille · ✓ orange : Trouvée au dernier moment · ✗ faux · ∅ « aucun de ces choix » · ⛔ : point d'autonomie retiré · ⚠️ Annulée ou ❌ Écartée : la question garde sa marque en tête de colonne"));
}
ResultatsQCM = ResultatsSeance;
refaire("c-resultats", function(){ return Console("donnees", "results", h(ResultatsSeance, {key:paramHash("seance") || "S08"}), false); });
refaire("c-resultats-rendues", function(){ return Console("donnees", "results", h(ResultatsSeance, {key:paramHash("seance") || "S08"}), false); });

/* ════════ La fiche d'un élève à une autre séance : ce que le scénario en sait (sa note par question, ses compétences, son autonomie) ════════ */
function FicheAutre(p, id){
  var k = MO(), se = SCN.seance(id), ev = SCN.evalDeSeance(id, k), r = resultatDe(id, p, k), nom = nomDe(p), comps = compsDe(ev), au = autonomieSeance(id, p, k);
  var e = "&eleve=" + encodeURIComponent(p) + sqDe(id), lire = SCN.aLireSeance(id, k).filter(function(x){ return x.p === p; });
  if(!r) return h("div", {className:"student-report", "data-eleve":p}, h("h3", null, "👤 " + nom));
  var mt = maitriseDe(r.sur20);
  return h("div", {className:"student-report", "data-eleve":p, "data-seance":id},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}},
      h("h3", null, "👤 " + nom + " — " + r.n + " / " + r.total + " · " + fr1(r.sur20) + " / 20 · " + mt.em + " " + mt.lib),
      h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats" + sqDe(id), title:"Ferme la fiche et revient au tableau de la séance."}, "✕ Fermer")),
    h("div", {className:"fiche-head fiche-head-c"}, h("span", null, ""), h("span", null, "Question"), h("span", null, "Bonne réponse"), h("span", null, "Points")),
    ev.questions.map(function(q, qi){
      var fl = lire.filter(function(x){ return x.q === qi; })[0];
      return h("div", {key:qi, className:"fiche-q fiche-q-c"},
        h("span", {className:"num"}, "Q" + (qi+1)),
        h("span", null, q.enonce, (q.competences || []).length > 0 && h("div", {className:"fiche-comp"}, "🧩 " + q.competences.join(" · ")), fl && h(FlagLecture, {fl:fl, cle:p + qi})),
        h("span", {className:"val"}, choixTexte(q, q.bonnes)),
        h("span", {className:"pts"}, r.st[qi] === "x" ? "—" : (r.pts[qi] || 0) + " pt"));
    }),
    h("div", {className:"fiche-comps"}, h("div", {className:"tt"}, "🧩 Ses compétences"),
      comps.map(function(c){ var n = niveauComp(r, c), x = r.comp[c] || {n:0, max:0};
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, LIB_OFF[c]), h("span", {className:"d"}, compQuestionsEv(c, ev).map(function(i){ return "Q" + (i+1) + " " + marque(r.st[i]); }).join(" · ") + " → " + x.n + "/" + x.max), h("span", {className:"maitrise-pill " + n.cls}, n.em + " " + n.lib)); }),
      ["tr-personne-03", "tr-methodes-02"].map(function(c){
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, LIB_OFF[c]), h("span", {className:"d"}, "le point d'autonomie"),
          h("span", {className:"maitrise-pill " + (au.retire ? "mt-rouge" : "mt-vert")}, au.retire ? "🔴 Maîtrise insuffisante" : "🟢 Très bonne maîtrise"));
      }),
      h("div", {className:"fiche-auto"}, au.retire
        ? h(F, null, h("span", null, "⛔ Point d'autonomie retiré " + au.quand + "."), h("button", {className:"btn btn-vert btn-sm", "data-va":"c-fiche" + e, title:"Rend son point d'autonomie à " + p + " : ses deux compétences d'autonomie repassent en Très bonne maîtrise."}, "↩️ Rendre"))
        : h(F, null, h("span", null, (SCN.SEXE[p] === "F" ? "Elle" : "Il") + " a gardé son point d'autonomie."), h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-fiche-garde" + e, title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. La note ne bouge pas. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")))));
}
// la fiche de l'élève cliqué, à la séance du tableau d'où on l'ouvre (« &seance= ») ; son bilan général, quand l'app sait l'écrire
var ScFicheAvantC4 = ScFiche;
ScFiche = function(retire){
  var id = paramHash("seance");
  if(!id || id === "S08") return ScFicheAvantC4(retire);
  var p = paramEleve("Michel"), entree = entreeSeance(id, p, MO());
  return Console("donnees", "results", h(F, null, h("div", {className:"card"}, FicheAutre(p, id), entree && h(CarteBilanGeneral, {key:p + id, eleve:p, entree:entree}))), false);
};
refaire("c-fiche", function(){ return ScFiche(false); });
refaire("c-fiche-retire", function(){ return ScFiche(true); });
// le bilan général pré-rempli : l'entrée de com632.js pour cet élève, à cette séance (celle de la séance du 08/10 : entreeBilan)
var CarteBilanGeneralAvantC4 = CarteBilanGeneral;
var entreeBilanAvantC4 = entreeBilan;
CarteBilanGeneral = function(p){ if(!p.entree) return CarteBilanGeneralAvantC4(p); var sv = entreeBilan; entreeBilan = function(){ return p.entree; }; try { return CarteBilanGeneralAvantC4(p); } finally { entreeBilan = sv; } };
// la fourchette estimée contre celle du résultat, selon la 7.7.1 (fourchetteDuScore : plus de 75 %, de 50 %, de 25 %), comme gen632.js
function typeEstim7(est, n, total){ if(!est) return null; var I = {rouge:1, orange:2, bleu:3, vert:4}, pc = n / total * 100, f = pc > 75 ? "vert" : pc > 50 ? "bleu" : pc > 25 ? "orange" : "rouge";
  return {type:I[est] === I[f] ? "ok" : I[est] > I[f] ? "sur" : "sous", ecart:Math.abs(I[est] - I[f])}; }
function entreeSeance(id, p, k){
  var ev = SCN.evalDeSeance(id, k), r = SCN.resultat(id, p, k);
  if(!r || !r.complet || ev.questions.some(function(q, i){ return !(q.verifie || (id === "S08" || id === "PAP" ? VERIF_M[i] : null)); })) return null;
  if(id === "S08") return entreeBilanAvantC4(p);
  var nomsS = (SCN.seance(id).eleves || SCN.NOMS).filter(function(n){ return SCN.resultat(id, pre(n), k); });
  var taux = ev.questions.map(function(q, qi){ var l = nomsS.map(function(n){ return SCN.resultat(id, pre(n), k); }).filter(function(x){ return x.st[qi] !== "x"; }); return l.filter(function(x){ return x.pts[qi] === 1; }).length / l.length * 100; });
  var la = r.st.map(function(s, i){ return s === "x" ? -1 : i; }).filter(function(i){ return i >= 0; });
  var te = id === "S3E" && la.length === ev.questions.length ? typeEstim7(SCN.ESTIM_3E[nomDe(p)], r.n, ev.questions.length) : null;
  return {niveau:SCN.maitriseDe(Math.round(r.sur20 * 10) / 10), autonomieRetiree:autonomieSeance(id, p, k).retire, autonomieLibs:[LIB_ELEVE["tr-personne-03"], LIB_ELEVE["tr-methodes-02"]],
    questions:la.map(function(i){ return {n:i + 1, verifie:ev.questions[i].verifie || VERIF_M[i], pts:r.pts[i], niveau:ev.questions[i].niveau, taux:taux[i]}; }),
    estimation:te && te.type, ecart:te ? te.ecart : 0};
}
// la garde du soir et sa suite gardent la séance de la fiche
var ScFicheGardeAvantC4 = ScFicheGarde;
ScFicheGarde = function(){
  var id = paramHash("seance"); if(!id || id === "S08") return ScFicheGardeAvantC4();
  var p = paramEleve("Michel"), e = "&eleve=" + encodeURIComponent(p) + sqDe(id);
  return Fenetre(ScFiche(false), "⛔ Retirer le point d'autonomie à " + nomDe(p) + " ?", "Le soir, d'après ta lecture de ses feuilles",
    h(F, null, h("p", null, "Ses deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation : « Être autonome et responsable » et « S'impliquer dans les activités en classe et dans son travail personnel ». La note ne bouge pas.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-fiche" + e, title:"Ne retire rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-va":"c-fiche-retire" + e + "&retire=" + encodeURIComponent(p), "data-moment":momentDefaut("c-fiche-retire"), title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")], "c-fiche" + e);
};
refaire("c-fiche-garde", function(){ return ScFicheGarde(); });

/* ════════ Le PDF « notes et compétences » de la séance d'où on l'ouvre (correction 2) ════════
   La mise en page est celle du PDF figé de la v8 (gen632.js, validé par Paul) : son en-tête et sa feuille de style tels quels ;
   le reste se construit depuis le scénario, au moment du geste. */
var PDF_TETE = (window.PDF632_HTML || "").slice(0, (window.PDF632_HTML || "").indexOf('<div class="haut">'));
function escPdf(s){ return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
function chapPdf(c){ var m = /^(\d)e · Ch\. (\d+) — (.*)$/.exec(c || ""); return m ? m[1] + "e, chapitre " + m[2] + " — " + m[3] : c ? c : "—"; }
var NIV_PDF = [{min:15, lib:"Très bonne maîtrise", cls:"vert"}, {min:10, lib:"Maîtrise satisfaisante", cls:"bleu"}, {min:5, lib:"Maîtrise fragile", cls:"orange"}, {min:0, lib:"Maîtrise insuffisante", cls:"rouge"}];
function nivPdf(sur20){ var r = Math.round(sur20 * 10) / 10; return NIV_PDF.filter(function(n){ return r >= n.min; })[0]; }
function pdfSeance(id, k){
  var se = SCN.seance(id), ev = SCN.evalDeSeance(id, k), comps = compsDe(ev), auto = [["tr-personne-03", LIB_OFF["tr-personne-03"]], ["tr-methodes-02", LIB_OFF["tr-methodes-02"]]];
  var eleves = (se.eleves || SCN.NOMS).slice().sort(function(a, b){ return a.localeCompare(b, "fr"); }), nc = comps.length + 4;
  var nNotes = 0, nAbs = 0, nCom = 0, asavoir = [];
  var lignes = eleves.map(function(nom){
    var p = pre(nom), r = SCN.resultat(id, p, k);
    if(!r){ nAbs++; asavoir.push("<b>" + escPdf(nom) + "</b> : absent, pas encore de rattrapage.");
      return '<tbody class="un"><tr class="abs"><td class="el">' + escPdf(nom) + '</td><td class="note">Absent</td>' + new Array(nc - 1).join("<td>—</td>") + '</tr><tr class="comrow"><td colspan="' + nc + '"><span class="lab">Commentaire :</span> —</td></tr></tbody>'; }
    nNotes++;
    var la = r.st.map(function(s, i){ return s === "x" ? -1 : i; }).filter(function(i){ return i >= 0; });
    var cells = comps.map(function(c){ var qs = compQuestionsEv(c, ev).filter(function(i){ return la.indexOf(i) >= 0; }), n = qs.reduce(function(a, i){ return a + r.pts[i]; }, 0), v = nivPdf(n * 20 / qs.length);
      return '<td class="niv ' + v.cls + '">' + v.lib + '<span class="pts">' + n + "/" + qs.length + "</span></td>"; });
    var a = autonomieSeance(id, p, k).retire ? NIV_PDF[3] : NIV_PDF[0];
    auto.forEach(function(){ cells.push('<td class="niv ' + a.cls + '">' + a.lib + "</td>"); });
    if(la.length < ev.questions.length) asavoir.push("<b>" + escPdf(nom) + "</b> : parti après la question " + la.length + " ; sa note et ses compétences portent sur les " + la.length + " questions où il était là, et il n'a pas fait son estimation.");
    var entree = entreeSeance(id, p, k), com = "—";
    if(entree){ nCom++; com = commentaireQCM(entree).map(function(x){ return x.p ? "<span>" + escPdf(x.t) + "</span>" : escPdf(x.t); }).join(""); }
    return '<tr><td class="el">' + escPdf(nom) + '</td><td class="note">' + fr1(r.sur20) + "</td>" + cells.join("") + '</tr><tr class="comrow"><td colspan="' + nc + '"><span class="lab">Commentaire :</span> ' + com + "</td></tr></tbody>";
  });
  var qs = function(c){ var l = compQuestionsEv(c, ev); return l; };
  return PDF_TETE +
    '<div class="haut"><h1>Notes et compétences</h1><div class="classe">Classe : ' + escPdf(se.classe) + "</div></div>\n" +
    '<div class="infos">\n' +
    "<div><b>Évaluation :</b> " + escPdf(ev.titre) + "</div>\n" +
    "<div><b>Chapitre :</b> " + escPdf(chapPdf(ev.chap)) + "</div>\n" +
    "<div><b>Séance :</b> " + se.date + " · " + ev.questions.length + " questions · " + (ev.mode === "partiel" ? "partiel" : "tout ou rien") + "</div>\n" +
    "<div><b>Copies :</b> rendues le " + se.rendues.slice(0, 10) + " — les notes sont définitives</div>\n" +
    "<div><b>Note :</b> sur 20, arrondie au dixième</div>\n" +
    "<div><b>Questions :</b> aucune écartée, aucune annulée</div>\n" +
    "</div>\n" +
    '<div class="mode"><b>Pour École Directe.</b> Une ligne par élève, dans l\'ordre alphabétique. « Note » : la note sur 20 du devoir.\n' +
    "Chaque colonne de compétence : le niveau de maîtrise de l'élève, en toutes lettres, parmi quatre : Très bonne maîtrise, Maîtrise satisfaisante, Maîtrise fragile, Maîtrise insuffisante.\n" +
    "« Commentaire », sur la ligne sous l'élève : son commentaire pour ce devoir, à entrer tel quel dans la zone commentaire ; « — » : pas de commentaire. « Absent » : ni note, ni niveau, ni commentaire.\n" +
    "Le cadre « À savoir », sous le tableau, ne s'entre pas.</div>\n" +
    "<table>\n" +
    '<colgroup><col style="width:50mm"><col style="width:17mm">' + comps.map(function(){ return '<col style="width:58mm">'; }).join("") + '<col style="width:48mm"><col style="width:48mm"></colgroup>\n' +
    "<thead>\n" +
    '<tr class="g"><th rowspan="2" style="text-align:left">Élève</th><th rowspan="2" style="text-align:center">Note<br>sur 20</th>' + (comps.length ? '<th colspan="' + comps.length + '">Compétences de l\'évaluation</th>' : "") + '<th colspan="2">Point d\'autonomie</th></tr>\n' +
    "<tr>" + comps.map(function(c){ var l = qs(c); return '<th><span class="c">' + c + '</span><span class="l">Q' + (l[0] + 1) + " à Q" + (l[l.length - 1] + 1) + "</span></th>"; }).join("") + auto.map(function(x){ return '<th><span class="c">' + x[0] + '</span><span class="l">' + escPdf(x[1]) + "</span></th>"; }).join("") + "</tr>\n" +
    "</thead>\n" +
    lignes.join("\n") + "\n" +
    "</table>\n" +
    '<div class="ctrl">Contrôle : ' + eleves.length + " élèves · " + nNotes + " notes · " + nAbs + " absent" + (nAbs > 1 ? "s" : "") + " · " + nCom + " commentaires.</div>\n" +
    '<div class="asavoir"><b>À savoir — ne s\'entre pas dans École Directe.</b><br>' + asavoir.join("<br>") + "</div>\n" +
    '<div class="bas">\n' +
    "<div><b>Les compétences</b><br>\n" +
    comps.map(function(c){ return "<b>" + c + "</b> — " + escPdf(LIB_OFF[c]) + " (questions " + qs(c).map(function(i){ return "Q" + (i + 1); }).join(", ") + ")."; }).join("<br>") + (comps.length ? "<br>\n" : "") +
    auto.map(function(x){ return "<b>" + x[0] + "</b> — " + escPdf(x[1]) + "."; }).join("<br>") + "</div>\n" +
    "<div><b>Comment le niveau se calcule</b><br>\n" +
    "Pour chaque compétence, la part des points de l'élève sur ses questions, ramenée sur 20 (« 8/11 » : 8 points sur 11 questions) :\n" +
    "Très bonne maîtrise de 15 à 20 ; Maîtrise satisfaisante de 10 à moins de 15 ; Maîtrise fragile de 5 à moins de 10 ; Maîtrise insuffisante de 0 à moins de 5.\n" +
    "Point d'autonomie : Très bonne maîtrise, ou Maîtrise insuffisante s'il a été retiré.<br>\n" +
    "<b>Le commentaire</b> : le bilan général de l'élève, rempli par l'app à partir de ses questions, comme en correction de dictée, puis modifié et validé, ou non, dans sa fiche.</div>\n" +
    "</div>\n" +
    "</body></html>";
}
PdfApercu = function(){
  var id = seanceDeLaPage(), html = SCN.rendueAu(id, MO()) ? pdfSeance(id, MO()) : "";
  return h("div", {className:"pdf-fond"},
    h("div", {className:"pdf-barre"}, "🖨️ Aperçu avant impression · Destination : Enregistrer au format PDF"),
    h("iframe", {className:"pdf-page", title:"Notes et compétences", srcDoc:html,
      onLoad:function(ev){ var f = ev.target, d = f.contentDocument; f.style.height = (d.documentElement.scrollHeight + 4) + "px"; window.SCENE_PRETE = "x632-pdf"; }}));
};
// (la scène x632-pdf est posée par socle.js, après ce fichier : elle prend ce PdfApercu)

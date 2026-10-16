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
function PillCompEv(r, c, ev){ var x = r.comp && r.comp[c], m = maitriseV(x && x.max ? x.n * 20 / x.max : 0); return h("span", null, h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib), h("div", {className:"comp-det"}, compQuestionsEv(c, ev).map(function(i){ return "Q" + (i+1) + " " + marque(r.st[i]); }).join(" · "))); }
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

/* ═══════════════ [QCM-3 · SOIR] Les séances de la base, et le soir ═══════════════
   Une séance se lit telle qu'elle est dans qcm/sessions/<sid> (COMMUN §3.1) : celles de l'app comme celles de la 7.7.1, avec ce qu'elles ont
   (une séance de la 7.7.1 n'a ni lecture ni « Trouvée au dernier moment » : sa note vient de sa feuille saisie, sinon de la tablette).
   Le soir écrit dans la séance elle-même : le point d'autonomie, les feuilles lues, les copies, le bilan validé. */
/* Un geste de mes écrans agit lui-même (la base, puis l'écran d'arrivée) : son clic est pris ici, avant le routeur des gestes, qui le
   reconnaîtrait à son libellé et agirait sur la séance pilotée, pas sur celle de l'écran (src/live/gestes.js). */
function surClic(fn, props){ return Object.assign({"data-local":"1", "data-soir":"1", ref:function(el){ if(el) el.__soir = fn; }}, props || {}); }
window.addEventListener("click", function(ev){
  var b = ev.target && ev.target.closest ? ev.target.closest("#root [data-soir]") : null;
  if(!b || b.disabled || typeof b.__soir !== "function") return;
  ev.stopImmediatePropagation(); ev.preventDefault();
  try { var r = b.__soir(); if(r && r.catch) r.catch(function(e){ console.error(e); }); } catch(e){ console.error(e); }
}, true);
function memesChoixV(a, b){ return JSON.stringify((a || []).map(Number).slice().sort()) === JSON.stringify((b || []).map(Number).slice().sort()); }
function v3Eleves(classeNom, classeSlug){
  // la classe d'une séance : par son nom (l'app écrit la clé de /classes) ou par son slug (la 7.7.1)
  var C = v3Classes(), cle = classeNom && C[classeNom] ? classeNom : classeSlug && C[classeSlug] ? classeSlug : Object.keys(C).filter(function(k){ return v3Slug(k) === v3Slug(classeSlug) || (C[k] && v3Slug(C[k].nom) === v3Slug(classeSlug)); })[0];
  var c = cle ? C[cle] : null, brut = c ? (Array.isArray(c) ? c : c.eleves || c.liste || []) : [];
  var l = v3Liste(brut).map(function(e){ var n = typeof e === "string" ? e : e && (e.nomComplet || (e.nom && e.prenom ? String(e.nom).toUpperCase() + " " + e.prenom : e.nom)); return n ? {nom:n, slug:v3Slug(n)} : null; }).filter(Boolean);
  return {cle:cle || classeNom || "", libelle:nomClasseV(cle || (c && c.nom) || classeNom || ""), niveau:(c && c.niveau) || null, eleves:l, amen:(c && c.amenagements) || {}};
}
function prenomDeNom(n){ var p = String(n || "").split(" "); var i = 0; while(i < p.length - 1 && p[i] === p[i].toUpperCase() && /[A-ZÀ-Ý]/.test(p[i])) i++; return p.slice(i).join(" ") || n; }
function sexeV(se, slug){ try { if(typeof SCN.sexe === "function" && SCN.LIVE){ var s = SCN.sexe(slug); if(s) return String(s).toUpperCase().charAt(0); } } catch(e){}
  var a = se && se.amen && se.amen[slug]; return a && a.sexe ? String(a.sexe).toUpperCase().charAt(0) : "M"; }
function ilElle(se, slug){ return sexeV(se, slug) === "F" ? "elle" : "il"; }
// l'état d'une séance : « etat » garde la chaîne de la 7.7.1 (« en_cours », « terminee ») ; le déroulé de l'app est « deroule » (CONTRAT-CHANGEMENTS, C1)
function deroule(S){ return S && (S.deroule || (S.etat && typeof S.etat === "object" ? S.etat : null)) || null; }
function seanceNouvelle(S){ return !!S && (!!deroule(S) || !!S.lancee || !!S.lectures || !!S.revelees || !!S.places); }
function seanceTerminee(S){ if(!S) return false; var d = deroule(S); return S.etat === "terminee" || S.etat === "finie" || S.phase === "finie" || !!(d && d.ph === "fin"); }
function seanceEnPause(S){ var d = deroule(S); return !!d && d.ph === "pause" && !!d.autreHeure && !seanceTerminee(S); }
function msDeSeance(S){ return S.date || (S.lancee && S.lancee.date) || S.createdAt || 0; }
function msFinSeance(S){ return S.finLe || S.fin || msDeSeance(S); }
function seanceDemo(S){ return !!S && (S.evalId === "demo" || !!S.demo || !!(S.lancee && S.lancee.demo)); }
function seanceTest(S){ var c = String(S && (S.classeSlug || S.classe) || ""); return !!S && (!!S.test || /^_|test/i.test(c)); }
// l'évaluation telle que la séance l'a servie (evalSnapshot : titre, mode, questions) ; ce que l'instantané ne garde pas (le chapitre…) vient de l'évaluation
function evalDeSeanceV(S){ if(!S) return null; if(S.evalSnapshot) return evalVue(S.evalId, Object.assign({}, v3Evals()[S.evalId] || {}, S.evalSnapshot)); return evalV(S.evalId); }
function listeSlugs(x, eleves){   // une liste d'élèves (slugs ou noms), en slugs
  return v3Liste(x).map(function(a){ var s = String(a); var e = (eleves || []).filter(function(y){ return y.slug === s || y.nom === s; })[0]; return e ? e.slug : v3Slug(s); }); }

// la séance sid, lue de la base : sa classe, ses élèves, son évaluation, ses dates, ses états
function seanceV(sid){
  var S = v3Sessions()[sid]; if(!S) return null;
  var cl = v3Eleves(S.classe, S.classeSlug), ev = evalDeSeanceV(S);
  if(!ev || !ev.questions) return null;   // son évaluation n'est pas (encore) lue
  var absents = listeSlugs(S.absents, cl.eleves), nouv = seanceNouvelle(S);
  var dans = {}, propresL = S.lancee && S.lancee.eleves ? v3Liste(S.lancee.eleves) : null;
  cl.eleves.forEach(function(e){ if(!propresL || propresL.indexOf(e.slug) >= 0) dans[e.slug] = e.nom; });
  // ceux qui ont une place, une réponse ou une lecture, même hors de la liste de la classe (le rattrapage)
  var vus = {}; Object.keys(S.places || {}).forEach(function(n){ var t = S.places[n] || {}; ["g", "d"].forEach(function(c){ if(t[c]) vus[t[c]] = 1; }); });
  ["reponses", "lectures"].forEach(function(cle){ Object.keys(S[cle] || {}).forEach(function(qi){ Object.keys(S[cle][qi] || {}).forEach(function(s){ vus[s] = 1; }); }); });
  Object.keys(vus).forEach(function(s){ if(!dans[s]) dans[s] = (v3("codes/" + s) || {}).name || s; });
  var tous = Object.keys(dans).map(function(s){ return {slug:s, nom:dans[s]}; }).sort(function(a, b){ return a.nom.localeCompare(b.nom, "fr"); });
  // une séance qui a ses propres élèves (le rattrapage) : ses présents sont ceux qui y ont une place
  var propres = nouv && S.places && Object.keys(vus).length && (S.rattrapage || (S.lancee && S.lancee.rattrapage));
  var presents = tous.filter(function(e){ return absents.indexOf(e.slug) < 0 && (!propres || vus[e.slug]); });
  var cop = S.copies || null, ms = msDeSeance(S);
  var rendue = cop ? !!(cop.rendues && !cop.masquees) : (!nouv && seanceTerminee(S));
  return {id:sid, S:S, ev:ev, classe:cl.libelle || S.classe || S.classeSlug || "", classeCle:cl.cle, classeSlug:S.classeSlug || v3Slug(cl.cle), niveau:cl.niveau, amen:cl.amen,
    eleves:tous, presents:presents, absents:tous.filter(function(e){ return absents.indexOf(e.slug) >= 0; }), nouvelle:nouv,
    date:dateFr(ms), heure:heureFr(ms), ms:ms, terminee:seanceTerminee(S), pause:seanceEnPause(S), demo:seanceDemo(S), test:seanceTest(S),
    papier:S.mode === "papier" || !!S.surPapier || !!(S.lancee && S.lancee.mode === "papier"), rattrapage:!!S.rattrapage || !!(S.lancee && S.lancee.rattrapage),
    rendue:rendue, rendueMs:cop && cop.rendues ? cop.rendues : (!cop && rendue ? msFinSeance(S) : null), masquee:!!(cop && cop.masquees), publiee:S.publiee !== false,
    ecartees:v3Liste(S.ecartees).map(Number), annulees:v3Liste(S.annulees).map(Number)};
}
function seancesV(){ return memo3("seances", function(){ var X = v3Sessions(); return Object.keys(X).map(seanceV).filter(function(se){ return se && se.ev; }); }); }
function nomEleveV(se, slug){ var e = se.eleves.filter(function(x){ return x.slug === slug; })[0]; return e ? e.nom : (v3("codes/" + slug) || {}).name || slug; }
function prenomEleveV(se, slug){ return prenomDeNom(nomEleveV(se, slug)); }

/* ── La note d'un élève à une séance : la feuille fait foi (288 à 293) ; « Trouvée au dernier moment » une fois (trouvee/<slug>) ;
      les questions annulées ou écartées sortent du total ; st : j juste, t trouvée, f faux, a aucun de ces choix, x pas posée, n pas encore corrigée ── */
function ptsQuestionV(choix, q, mode){
  if(choix === "aucun" || !choix) return 0;
  if(mode === "partiel"){ var b = q.bonnes, bon = 0, mau = 0; choix.forEach(function(c){ if(b.indexOf(+c) >= 0) bon++; else mau++; }); return b.length ? Math.max(0, (bon - mau) / b.length) : 0; }
  return memesChoixV(choix, q.bonnes) ? 1 : 0;
}
function lectureV(se, qi, slug){ var l = ((se.S.lectures || {})[qi] || {})[slug]; if(!l) return null; return {choix:l.choix === "aucun" ? "aucun" : v3Liste(l.choix).map(Number), par:l.par || null, ms:l.ms || null}; }
function tabletteV(se, qi, slug){ var r = ((se.S.reponses || {})[qi] || {})[slug]; return r ? {choix:v3Liste(r.choix).map(Number), tour:r.tour || null, ms:r.ms || r.ts || null} : null; }
// la feuille saisie : celle de la 7.7.1 (papier/<slug>/choix/<qi> : les choix), ou la grille du soir de l'app (papier/<slug>/<qi> : « j » ou « f »)
function feuillePapierV(se, qi, slug){ var p = (se.S.papier || {})[slug]; if(!p) return null;
  if(!p.choix){ var g = p[qi]; if(g == null) return null; var q = se.ev.questions[qi]; return g === "j" || g === true || g === 1 ? q.bonnes.slice() : g === "a" ? "aucun" : [q.choix.map(function(c, i){ return i; }).filter(function(i){ return q.bonnes.indexOf(i) < 0; })[0]]; }
  var c = p.choix[qi] != null ? p.choix[qi] : (Array.isArray(p.choix) ? null : p.choix[String(qi)]); return c == null ? null : (c === "aucun" ? "aucun" : v3Liste(c).map(Number)); }
/* reprise 7, point 8 (Paul, 13/10 16:19, 16:42) : une ligne « à lire » dit ce que l'élève a fait ; la phrase, puis ses réponses dessous,
   en entier, chacune sur sa ligne (SCN.aLireSeance : txt, lignes) */
function ligneALireH(x, avant, apres){ return h("div", {className:"alire-x", "data-alire":x.id || ""}, h("div", {className:"alire-p"}, (avant || "") + x.txt + (apres || "")),
  (x.lignes || []).map(function(l, i){ return h("div", {key:i, className:"alire-l"}, l); })); }
function texteALireV(x){ return x.txt + ((x.lignes || []).length ? " — " + x.lignes.join(" ; ") : ""); }
function aLireV(se){
  // les lignes « à lire » se calculent de ce que chacun a dit et de ce que le voisin a lu (SCN.aLireSeance) ; aLire/<id> n'en garde que l'état
  if(SCN.LIVE && typeof SCN.aLireSeance === "function"){ try { var L = SCN.aLireSeance(se.id);
    // une feuille que Paul a lue lui-même (« Que dit la feuille ? », par:"prof") est tranchée : les lignes d'avant sa lecture restent
    // (lues, « Corrigé d'après sa feuille ») ; celles que sa lecture ferait naître (« … ; <voisin> y a lu <ce que Paul a lu> ») n'existent pas
    if(Array.isArray(L)){ var St = se.S.aLire || {}, Lc = se.S.lectures || {}; L = L.filter(function(x){ var p = x.p || x.eleveSlug, q = x.q != null ? x.q : x.qi, l = (Lc[q] || {})[p]; return !(l && l.par === "prof" && !St[x.id]); }); }
    if(Array.isArray(L) && (L.length || se.nouvelle)) return L.map(function(x){ return {id:x.id, p:x.p || x.eleveSlug, q:+(x.q != null ? x.q : x.qi), sorte:x.sorte, txt:x.txt || "", lignes:v3Liste(x.lignes).map(String), lue:!!x.lue, corrigee:!!(x.corrigee || x.corrige), nom:x.nom || nomEleveV(se, x.p || x.eleveSlug), brut:x}; }); } catch(e){} }
  var A = se.S.aLire || {}; return Object.keys(A).map(function(id){ var x = A[id] || {}; return {id:id, p:x.eleveSlug, q:+x.qi, sorte:x.sorte || "b", txt:x.txt || "", lignes:v3Liste(x.lignes).map(String), lue:!!x.lue, corrigee:!!x.corrige, nom:nomEleveV(se, x.eleveSlug), brut:x}; })
  .filter(function(x){ return x.p != null && !isNaN(x.q); }).sort(function(a, b){ return a.q - b.q || a.nom.localeCompare(b.nom, "fr"); }); }
function resultatLocalV(se, slug){
  var ev = se.ev, S = se.S, mode = ev.mode, revelees = v3Liste(S.revelees).map(Number), partiAt = (S.partis || {})[slug];
  if(se.absents.some(function(e){ return e.slug === slug; })) return null;
  var trouvee = S.trouvee && S.trouvee[slug] != null ? +S.trouvee[slug] : null, st = [], pts = [];
  // « Trouvée au dernier moment », une fois : la première question, dans l'ordre de la correction, dont la feuille est fausse et la tablette juste
  if(trouvee == null && se.nouvelle){ var ordre = v3Liste(S.revelees).map(Number); (ordre.length ? ordre : v3Liste(S.ordreCorr).map(Number)).some(function(qi){
    var q = ev.questions[qi], l = q && lectureV(se, qi, slug), tb = q && tabletteV(se, qi, slug);
    if(l && l.choix !== "aucun" && ptsQuestionV(l.choix, q, "strict") !== 1 && tb && memesChoixV(tb.choix, q.bonnes)){ trouvee = qi; return true; } return false; }); }
  ev.questions.forEach(function(q, qi){
    if(se.ecartees.indexOf(qi) >= 0){ st.push("x"); pts.push(null); return; }
    if(se.nouvelle){
      if(se.papier){ var fp = feuillePapierV(se, qi, slug) || lectureV(se, qi, slug) && lectureV(se, qi, slug).choix; if(!fp){ st.push("n"); pts.push(null); return; } var pp = ptsQuestionV(fp, q, mode); st.push(fp === "aucun" ? "a" : pp === 1 ? "j" : "f"); pts.push(pp); return; }
      if(revelees.indexOf(qi) < 0 && !se.terminee){ st.push("n"); pts.push(null); return; }
      var l = lectureV(se, qi, slug);
      // une feuille non lue ne note pas
      if(!l){ var tb = tabletteV(se, qi, slug); if(!tb && partiAt){ st.push("x"); pts.push(null); return; } st.push("n"); pts.push(null); return; }
      var p = ptsQuestionV(l.choix, q, mode);
      if(l.choix === "aucun"){ st.push("a"); pts.push(0); }
      else if(p === 1){ st.push("j"); pts.push(1); }
      else if(trouvee === qi){ st.push("t"); pts.push(1); }
      else { st.push("f"); pts.push(p); }
      return;
    }
    // une séance de la 7.7.1 : sa feuille saisie (papier/<slug>), sinon la tablette
    var lp = lectureV(se, qi, slug), f = feuillePapierV(se, qi, slug), t = tabletteV(se, qi, slug), c = lp && lp.par === "prof" ? lp.choix : f || (t ? t.choix : null);
    var p2 = ptsQuestionV(c, q, mode); st.push(c === "aucun" ? "a" : p2 === 1 ? "j" : "f"); pts.push(c ? p2 : 0);
  });
  var compte = ev.questions.map(function(q, i){ return i; }).filter(function(i){ return st[i] !== "x" && se.annulees.indexOf(i) < 0; });
  var dansTotal = compte.filter(function(i){ return !ev.questions[i].bonus; });
  var n = compte.reduce(function(a, i){ return a + (pts[i] || 0); }, 0), total = dansTotal.length;
  var complet = compte.every(function(i){ return pts[i] !== null; }), sur20 = total ? Math.min(20, n * 20 / total) : 0, comp = {};
  ev.questions.forEach(function(q, qi){ if(compte.indexOf(qi) < 0) return; q.competences.forEach(function(c){ comp[c] = comp[c] || {n:0, max:0}; if(!q.bonus) comp[c].max++; comp[c].n += (pts[qi] || 0); }); });
  var corrigees = aLireV(se).filter(function(x){ return x.p === slug && x.corrigee; }).map(function(x){ return x.q; });
  Object.keys(S.lectures || {}).forEach(function(qi){ var l = (S.lectures[qi] || {})[slug]; if(l && l.par === "prof" && corrigees.indexOf(+qi) < 0) corrigees.push(+qi); });
  return {p:slug, st:st, pts:pts, n:Math.round(n * 100) / 100, total:total, complet:complet, sur20:sur20, maitrise:maitriseV(sur20).k, comp:comp, corrigees:corrigees, annulees:se.annulees, ecartees:se.ecartees};
}
// un même rendu demande cent fois la note des mêmes élèves (le taux de chaque question pour chaque bilan) : elle se garde le temps du rendu
var MEMO3 = {v:{}, prevu:false};
function memo3(cle, f){ if(!MEMO3.prevu){ MEMO3.prevu = true; setTimeout(function(){ MEMO3.v = {}; MEMO3.prevu = false; }, 0); } if(!(cle in MEMO3.v)) MEMO3.v[cle] = f(); return MEMO3.v[cle]; }
function resultatV(se, slug){ return memo3("r|" + se.id + "|" + slug, function(){ return resultatV0(se, slug); }); }
function resultatV0(se, slug){
  // une séance de la 7.7.1 se note ici : sa feuille recopiée, sinon la tablette, et les corrections du soir (« Que dit la feuille ? »)
  if(SCN.LIVE && typeof SCN.resultat === "function" && se.nouvelle){ try { var r = SCN.resultat(se.id, slug); if(r && r.st && !r.ancienne) return avecCorrigeesV(se, slug, r); } catch(e){} }
  return resultatLocalV(se, slug);
}
// « corrigé d'après sa feuille » : toute question dont la lecture est celle de Paul (« Que dit la feuille ? » le soir, une alerte tranchée en classe)
function avecCorrigeesV(se, slug, r){
  var c = (r.corrigees || []).map(Number);
  Object.keys(se.S.lectures || {}).forEach(function(qi){ var l = (se.S.lectures[qi] || {})[slug]; if(l && l.par === "prof" && c.indexOf(+qi) < 0) c.push(+qi); });
  // une question écartée n'a pas été posée : sa case est « · », pas « ? » (pas encore corrigée)
  var ec = (se.ecartees || []).map(Number), st = r.st.map(function(s, i){ return ec.indexOf(i) >= 0 && (s === "n" || s == null) ? "x" : s; });
  return c.length === (r.corrigees || []).length && st.join() === r.st.join() ? r : Object.assign({}, r, {corrigees:c, st:st});
}
// ce que la marque d'une case montre : « n » (pas encore corrigée) se lit « ? » comme dans la maquette
function stVue(r){ return Object.assign({}, r, {st:r.st.map(function(s){ return s === "n" ? "pasdit" : s; })}); }
function autonomieV(se, slug){ var a = (se.S.autonomie || {})[slug]; if(!a || !a.retire) return {retire:false};
  return {retire:true, ms:a.ms, quand:"le " + dateFr(a.ms).slice(0, 5) + " à " + heureFr(a.ms), soir:a.quand === "soir"}; }
function estimationV(se, slug){ var e = (se.S.autoevals || {})[slug]; if(e && typeof e === "object") e = e.niveau || e.fourchette || e.k || e.key; return ["vert", "bleu", "orange", "rouge"].indexOf(e) >= 0 ? e : null; }
function voisinV(se, slug){
  var P = se.S.places || {}, v = null;
  Object.keys(P).forEach(function(n){ var t = P[n] || {}; if(t.g === slug) v = t.d || null; if(t.d === slug) v = t.g || null; });
  return v; }
function tauxV(se, qi){ return memo3("t|" + se.id + "|" + qi, function(){ return tauxV0(se, qi); }); }
function tauxV0(se, qi){ var ok = 0, n = 0; se.presents.forEach(function(e){ var r = resultatV(se, e.slug); if(r && r.pts[qi] != null){ n++; ok += r.pts[qi]; } }); return n ? Math.round(ok * 100 / n) : 0; }
function bilanValideV(se, slug){ var b = (se.S.bilans || {})[slug]; return b && b.texte ? b : null; }
// l'entrée du bilan général (com632.js) pour un élève à une séance ; null tant que sa note n'est pas complète ou qu'une question n'a pas ce qu'elle vérifie
function entreeV(se, slug){
  var r = resultatV(se, slug), ev = se.ev; if(!r || !r.complet) return null;
  var la = r.st.map(function(s, i){ return s === "x" || se.annulees.indexOf(i) >= 0 ? -1 : i; }).filter(function(i){ return i >= 0; });
  if(la.some(function(i){ return !ev.questions[i].verifie; })) return null;
  var es = estimationV(se, slug), te = es && la.length === ev.questions.length ? typeEstim7(es, r.n, r.total || 1) : null;
  return {niveau:maitriseV(r.sur20).k, mode:ev.mode === "partiel" ? "partiel" : "strict", autonomieRetiree:autonomieV(se, slug).retire, autonomieLibs:[libEleve("tr-personne-03"), libEleve("tr-methodes-02")],
    questions:la.map(function(i){ return {n:i + 1, verifie:ev.questions[i].verifie, pts:r.pts[i], niveau:ev.questions[i].niveau, taux:tauxV(se, i)}; }),
    estimation:te && te.type, ecart:te ? te.ecart : 0};
}
function texteBilanV(se, slug){ var b = bilanValideV(se, slug); if(b) return b.texte; var e = entreeV(se, slug); return e ? commentaireQCM(e).map(function(x){ return x.t; }).join("") : ""; }
function presentsTexteV(se){ var n = se.presents.length, a = se.absents; return n + " présent" + (n > 1 ? "s" : "") + (a.length ? ", " + a.length + " absent" + (a.length > 1 ? "s" : "") + (a.length === 1 ? " (" + a[0].nom + ")" : "") : ""); }
function ecartTexteV(se){ var e = se.ecartees, a = se.annulees; if(!e.length && !a.length) return "aucune";
  return [].concat(e.map(function(q){ return "Q" + (q + 1) + " écartée"; }), a.map(function(q){ return "Q" + (q + 1) + " annulée"; })).join(", "); }
function compsDeV(ev){ var o = []; ev.questions.forEach(function(q){ (q.competences || []).forEach(function(c){ if(o.indexOf(c) < 0) o.push(c); }); }); return o; }
function compCourt(c){ var l = libOff(c); return (typeof COMP_COURT !== "undefined" && COMP_COURT[c]) || (l.split(" ").slice(0, 3).join(" ") + "…"); }

/* ════════ Données → Résultats : les séances de la base, rangées par niveau puis par classe, triées ════════ */
function seanceParam(){ return paramHash("seance"); }
// les feuilles qu'aucune lecture n'a corrigées (un présent parti avant la correction, un voisin qui n'a pas lu) : la question reste « ? »
// et l'élève sans note ; elles restent à lire, et « Rendre les copies » attend (« chaque présent a eu la lecture de sa feuille »)
function sansLectureV(se){ var l = [], hors = se.ecartees.concat(se.annulees), S = se.S, papier = !S || (S.lancee || {}).mode === "papier";
  // une question jamais posée (séance terminée avant elle : ni lancée, ni une réponse) n'a pas de feuille à lire (relecteur neuf R6)
  var posee = function(i){ return papier || (S.questionsLancees || {})[i] != null || (S.reponses || {})[i] != null; };
  se.presents.forEach(function(e){ var r = resultatV(se, e.slug); if(r) r.st.forEach(function(s, i){ if(s === "n" && hors.indexOf(i) < 0 && posee(i)) l.push({p:e.slug, q:i}); }); });
  return l; }
function restentV(se){ var nl = aLireV(se).filter(function(x){ return !x.lue; }), deja = {}; nl.forEach(function(x){ deja[x.p + "|" + x.q] = 1; });
  return nl.length + sansLectureV(se).filter(function(x){ return !deja[x.p + "|" + x.q]; }).length; }
function etatCopiesV(se){ var lire = restentV(se);
  return se.masquee ? "masquees" : se.rendue ? "rendues" : lire ? "lire" : "pret"; }
function StatutCopiesV(p){
  var se = p.se, sq = "&seance=" + encodeURIComponent(se.id), e = etatCopiesV(se);
  if(e === "masquees") return h("span", {className:"statut-l15c non-rendues", title:"Les copies sont masquées aux élèves, jusqu'au prochain « Rendre les copies »."}, "copies masquées");
  if(e === "rendues") return h("button", {className:"statut-l15c rendues", "data-va":"c-resultats" + sq, title:"Les copies sont rendues aux élèves. Clic : le tableau de la séance."}, "copies rendues le " + dateFr(se.rendueMs).slice(0, 5));
  if(e === "pret") return h("button", {className:"statut-l15c rendre pulse-l15c", "data-va":"c-rendre" + sq, title:"Toutes les feuilles à lire sont lues. Clic : la garde de « Rendre les copies », puis un second clic les rend aux élèves."}, "rendre les copies ▸");
  return h("button", {className:"statut-l15c non-rendues", "data-va":"c-resultats" + sq, title:"Il reste des feuilles à lire : « rendre les copies ▸ » paraît quand toutes sont lues. Clic : le tableau de la séance."}, "copies non rendues");
}
function CochePublieeV(p){
  var on = p.se.publiee;
  return h("button", {className:"coche-publiee" + (on ? " on" : ""), "data-local":"1", title:"Décocher retire la séance de « Mes évaluations » des élèves tout de suite ; cocher la publie.", onClick:function(){ v3Set(v3Q("sessions/" + p.se.id + "/publiee"), on ? false : null); }}, h("span", {className:"ck"}, on ? "✓" : ""), on ? "publiée" : "non publiée");
}
function rendreCopiesV(sid){ if(typeof ACT !== "undefined" && ACT && typeof ACT.rendreCopies === "function" && SCN.LIVE) return Promise.resolve(ACT.rendreCopies(sid)); return v3Set(v3Q("sessions/" + sid + "/copies"), {rendues:Date.now(), masquees:false}); }
function masquerCopiesV(sid){ if(typeof ACT !== "undefined" && ACT && typeof ACT.masquerCopies === "function" && SCN.LIVE) return Promise.resolve(ACT.masquerCopies(sid)); return v3Set(v3Q("sessions/" + sid + "/copies/masquees"), true); }
function niveauDeSeanceV(se){ return (se.ev && se.ev.niveau) || (/^(\d)/.exec(se.niveau || "") || [])[1] && se.niveau.charAt(0) + "e" || niveauDeClasse(se.classe); }
function ListeSeancesV(){
  useV3();
  var s = useState("classe"), tri = s[0], setTri = s[1], s2 = useState({}), replies = s2[0], setReplies = s2[1];
  var l = seancesV().filter(function(se){ return se.terminee && !se.demo && !se.test; }).map(function(se){ return {se:se, ev:se.ev, tri:se.ms}; });
  function trie(x){ return x.slice().sort(function(a, b){ return tri === "evaluation" ? a.ev.titre.localeCompare(b.ev.titre) || b.tri - a.tri : b.tri - a.tri; }); }
  function ligne(x){
    var se = x.se, lire = aLireV(se), restent = restentV(se), e = etatCopiesV(se), sq = "&seance=" + encodeURIComponent(se.id);
    return h("div", {key:se.id, className:"results-eval-row", "data-seance":se.id},
      h("div", null, h("div", {className:"titre"}, x.ev.titre),
        h("div", {className:"meta"}, se.classe + " — " + se.date + " " + se.heure + " · ✅ terminée · " + presentsTexteV(se) + (se.papier ? " · sur papier" : ""),
          restent ? h("span", {className:"meta-lire"}, " · 📌 " + restent + " feuille" + (restent > 1 ? "s" : "") + " à lire") : lire.length ? h("span", {className:"meta-lus"}, " · ✔ " + lire.length + " feuille" + (lire.length > 1 ? "s" : "") + " lue" + (lire.length > 1 ? "s" : "")) : null),
        h("div", {className:"seance-statuts"}, h(StatutCopiesV, {se:se}), h(CochePublieeV, {se:se}),
          e === "rendues" && h("button", surClic(function(){ return masquerCopiesV(se.id); }, {className:"btn btn-ghost btn-sm", title:"Masque les copies de la séance du " + se.date.slice(0, 5) + " : les élèves ne voient plus leur note ni leur bilan, jusqu'au prochain « Rendre les copies »."}), "🙈 Masquer les copies"),
          e === "masquees" && h("button", surClic(function(){ return rendreCopiesV(se.id); }, {className:"btn btn-ghost btn-sm", title:"Rend de nouveau les copies de la séance du " + se.date.slice(0, 5) + " : chaque élève revoit sa note et son bilan."}), "📤 Rendre les copies"))),
      h("div", {className:"row"},
        h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats" + sq, title:"Ouvre le tableau de la séance du " + se.date.slice(0, 5) + " : les notes, les compétences, les feuilles à lire."}, "📊 Ouvrir"),
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-corbeille" + sq, title:"Met la séance du " + se.date.slice(0, 5) + " à la corbeille, après une confirmation : gardée un an, restaurable."}, "🗑️")));
  }
  function groupe(n){
    var x = l.filter(function(y){ return niveauDeSeanceV(y.se) === n; }), rep = replies[n] === undefined ? !x.length : replies[n];
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
function ListeSeancesVue(modale){ return Console("donnees", "results", h(F, null, h(ListeSeancesV), modale || null), false); }

/* ── « Rendre les copies » : la garde ── */
function ScRendreV(){ return h(ScRendreC); }
function ScRendreC(){
  useV3();
  // la garde ne s'ouvre que de « rendre les copies ▸ » : toutes les feuilles à lire lues (sinon, la liste)
  var se = seanceV(seanceParam()); if(!se || etatCopiesV(se) !== "pret") return ListeSeancesVue(null);
  var n = aLireV(se).length, sq = "&seance=" + encodeURIComponent(se.id);
  return Fenetre(ListeSeancesVue(null), "📤 Rendre les copies ?", se.ev.titre + " — " + se.classe + " — " + se.date + " " + se.heure,
    h(F, null,
      h("p", null, n ? "✔ Les " + n + " feuilles à lire sont lues, et chaque présent a eu la lecture de sa feuille." : "✔ Chaque présent a eu la lecture de sa feuille."),
      h("p", null, "Chaque élève voit, dans « Mes évaluations », sa note définitive, son bilan et le « 📝 Bilan » de sa fiche (validé, sinon celui de l'app) ; le PDF « notes et compétences » s'ouvre.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-seances", title:"Ne rend rien."}, "Annuler"),
     h("button", surClic(function(){ return rendreCopiesV(se.id).then(function(){ versScene("c-seances"); }); }, {key:2, className:"btn btn-primary", title:"Rend les copies aux élèves, tout de suite."}), "📤 Rendre les copies")], "c-seances");
}
/* ── Mettre une séance à la corbeille ── */
function CorbeilleSeanceV(){ return h(CorbeilleSeanceC); }
function CorbeilleSeanceC(){
  useV3();
  var se = seanceV(seanceParam()); if(!se) return ListeSeancesVue(null);
  var titre = se.ev.titre + " — " + se.classe + " — " + se.date + " " + se.heure;
  return Fenetre(ListeSeancesVue(null), "🗑️ Mettre cette séance à la corbeille ?", titre + " · " + presentsTexteV(se),
    h("p", null, "Elle part dans la corbeille du site, gardée un an, avec ses réponses, ses lectures et ses notes, et sort de cette liste. Rien n'est effacé : tu la restaures depuis ", h("strong", null, "💾 Sauvegarde → 🗑️ Corbeille"), "."),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-seances", title:"Ne met rien à la corbeille."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-local":"1", title:"Met la séance à la corbeille, restaurable un an.", onClick:function(){ mettreACorbeille("Séance", v3Q("sessions/" + se.id), se.S, titre).then(function(){ versScene("c-sauvegarde"); }); }}, "🗑️ Mettre à la corbeille")], "c-seances");
}

/* ════════ Le tableau d'une séance (442, 609) : toutes les séances, d'après la base ════════ */
MARQUE_RES.x = ["cell-vide", "·"];
function csvV(se, lignes, comps){
  var t = [["Élève"].concat(se.ev.questions.map(function(q, i){ return "Q" + (i + 1); }), ["Note", "Sur 20", "Maîtrise de la note"], comps, ["Autonomie", "À lire sur la feuille"])];
  var lire = aLireV(se);
  lignes.forEach(function(l){ var r = l.r, mt = maitriseV(r.sur20);
    t.push([l.nom].concat(r.st.map(function(x){ return (MARQUE_RES[x] || ["", ""])[1]; }), [r.complet ? r.n + "/" + r.total : "—", r.complet ? fr1(r.sur20) : "—", mt.lib],
      comps.map(function(c){ return niveauComp(r, c).lib; }), [autonomieV(se, l.p).retire ? "retiré" : "Très bonne maîtrise", lire.filter(function(x){ return x.p === l.p; }).map(function(x){ return "Q" + (x.q + 1) + " : " + texteALireV(x); }).join(" · ")])); });
  var csv = "﻿" + t.map(function(r){ return r.map(function(c){ c = String(c == null ? "" : c); return /[;"\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(";"); }).join("\n");
  var nom = "resultats-" + String(se.classe).replace(/\s+/g, "-") + "-" + se.date.replace(/\//g, "-") + ".csv";
  try { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"})); a.download = nom; document.body.appendChild(a); a.click(); a.remove(); } catch(e){}
  return nom;
}
function ResultatsV(){ return h(ResultatsC, {key:seanceParam() || "-"}); }
function ResultatsC(){
  useV3();
  var s = useState(null), exporte = s[0], setExporte = s[1], s2 = useState(1), sens = s2[0], setSens = s2[1];
  var se = seanceV(seanceParam());
  if(!se) return h("div", {className:"card"}, TitreCarte("📊 Résultats", [h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":"c-seances", title:"Revient à la liste des séances."}, "← Retour")]), h("p", null, v3Pret([v3Q("sessions"), v3Q("evaluations")]) ? "Cette séance n'existe plus : elle est peut-être à la corbeille." : "Chargement…"));
  var ev = se.ev, comps = compsDeV(ev), sq = "&seance=" + encodeURIComponent(se.id);
  var lignes = se.presents.map(function(e){ var r = resultatV(se, e.slug); return r ? {p:e.slug, nom:e.nom, r:stVue(r)} : null; }).filter(Boolean);
  lignes.sort(function(a, b){ return sens * a.nom.localeCompare(b.nom, "fr"); });
  var lire = aLireV(se), restent = restentV(se), rendues = se.rendue;
  return h("div", {className:"card", "data-seance":se.id},
    TitreCarte("📊 " + ev.titre + " — " + se.classe, [
      h("button", {key:0, className:"btn btn-primary btn-sm", disabled:!rendues, "data-local":rendues ? "1" : null, onClick:rendues ? function(){ ouvrirPdfV(se.id); } : null, title:rendues ? "Ouvre l'impression du navigateur, « Enregistrer au format PDF » : une ligne par élève, la note, le niveau de chaque compétence, le commentaire." : "Fermé tant que les copies ne sont pas rendues : les notes ne sont définitives qu'à ce moment-là."}, "📄 PDF notes et compétences"),
      h("button", {key:1, className:"btn btn-or btn-sm", "data-local":"1", title:"Télécharge le tableau en CSV, pour un tableur.", onClick:function(){ setExporte(csvV(se, lignes, comps)); }}, "📥 Export CSV"),
      (function(){ var nc = {}; lire.forEach(function(x){ if(!x.lue) nc[x.p] = 1; }); var n = Object.keys(nc).length; return n ? h("button", {key:3, className:"btn btn-primary btn-sm", "data-va":"c-lire-copies" + sq, title:"Ouvre les copies à lire, dans l'ordre de ton tas : tu tapes les initiales de chaque copie ; pour chaque question à lire, l'app te demande ce que dit la copie, et tu réponds oui ou non."}, "📄 Lire les copies (" + n + ")") : null; })(),
      h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":"c-seances", title:"Revient à la liste des séances."}, "← Retour")]),
    exporte && h("div", {className:"fen-note"}, "📥 " + exporte + " téléchargé."),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, se.date + " " + se.heure + " · " + presentsTexteV(se) + (se.papier ? " · sur papier" : "") + " · questions écartées ou annulées : " + ecartTexteV(se) + " · ",
      rendues ? h("strong", {style:{color:"#15803D"}}, "copies rendues le " + dateFr(se.rendueMs).slice(0, 5)) : restent ? h("strong", {style:{color:"#9A3412"}}, restent + " feuille" + (restent > 1 ? "s" : "") + " à lire") : lire.length ? h("strong", {style:{color:"#15803D"}}, "✔ " + lire.length + " feuille" + (lire.length > 1 ? "s" : "") + " lue" + (lire.length > 1 ? "s" : "")) : h("strong", {style:{color:"#9A3412"}}, "copies non rendues")),
    h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet", "data-longue":ev.questions.length > 6 ? "1" : null},
      h("thead", null, h("tr", null,
        h("th", {className:"eleve-col trie", title:"Cliquer pour trier par nom (asc/desc). Cliquer sur un nom d'élève dans le tableau ouvre son Student Report (drill-down).", onClick:function(){ setSens(-sens); }}, "Élève" + (sens > 0 ? " ▴" : " ▾")),
        ev.questions.map(function(q, i){ var ec = se.ecartees.indexOf(i) >= 0, an = se.annulees.indexOf(i) >= 0;
          return h("th", {key:i, title:q.enonce + (ec ? " — ❌ Écartée — pas posée" : an ? " — ⚠️ Annulée — posée, puis annulée" : "")}, (ec ? "❌ " : an ? "⚠️ " : "") + "Q" + (i+1)); }),
        h("th", null, "Note"), h("th", null, "Sur 20"), h("th", {className:"res-col-l"}, "Maîtrise de la note"),
        comps.map(function(c){ var qs = compQuestionsEv(c, ev); return h("th", {key:c, className:"comp-col", title:"La compétence " + c + " : " + libOff(c) + ". Ses questions : " + qs.map(function(i){ return "Q" + (i+1); }).join(", ") + "."}, "🧩 " + c, h("div", {className:"thq"}, compCourt(c) + " · " + qs.map(function(i){ return "Q" + (i+1); }).join(", "))); }),
        !comps.length && h("th", {key:"sans", className:"comp-col", title:"Cette évaluation n'a pas de compétences : elle n'en a pas au hub."}, "🧩 —"),
        h("th", {className:"res-col-l"}, "🤝 Autonomie"),
        h("th", {className:"res-col-alire"}, "À lire sur la feuille"))),
      h("tbody", null, lignes.map(function(l){
        var mt = maitriseV(l.r.sur20), fl = lire.filter(function(x){ return x.p === l.p; }), au = autonomieV(se, l.p);
        return h("tr", {key:l.p, "data-eleve":l.p},
          h("td", {className:"eleve-cell"}, h("button", {className:"nom-fiche", "data-va":"c-fiche&eleve=" + encodeURIComponent(l.p) + sq, title:"Ouvre la fiche " + deNom(prenomDeNom(l.nom)) + " : sa feuille lue, sa tablette, ce qu'" + ilElle(se, l.p) + " a dit, son point d'autonomie, son bilan général."}, l.nom)),
          l.r.st.map(function(x, i){ var c = MARQUE_RES[x] || MARQUE_RES.f; return h("td", {key:i, className:c[0] + ((l.r.corrigees || []).indexOf(i) >= 0 ? " cell-corrigee" : "")}, c[1]); }),
          h("td", {className:"score-cell"}, l.r.complet ? fr1(l.r.n) + "/" + l.r.total : "—"),
          h("td", {className:"score-cell"}, l.r.complet ? fr1(l.r.sur20) : "—"),
          h("td", null, h("span", {className:"maitrise-pill " + mt.cls}, mt.em + " " + mt.lib)),
          comps.map(function(c){ return h("td", {key:c, className:"comp-cell"}, PillCompEv(l.r, c, ev)); }),
          !comps.length && h("td", {key:"sans", className:"comp-cell"}, "—"),
          h("td", {className:"comp-cell"}, au.retire ? h("span", {className:"maitrise-pill mt-rouge"}, "⛔ retiré " + au.quand) : h("span", {className:"maitrise-pill mt-vert"}, maitriseV(20).em + " " + maitriseV(20).lib)),
          h("td", {className:"alire-cell" + (fl.length ? "" : " vide")}, fl.map(function(x, i){ return h("div", {key:i}, ligneALireH(x, "Q" + (x.q+1) + " : ", (x.corrigee ? " · Corrigé d'après sa feuille" : "") + (x.lue ? " · ✔ lue" : ""))); })));
      })))),
    h("div", {className:"legende-res"}, "✓ juste d'après la feuille · ✓ orange : Trouvée au dernier moment · ✗ faux · ∅ « aucun de ces choix » · ⛔ : point d'autonomie retiré · ⚠️ Annulée ou ❌ Écartée : la question garde sa marque en tête de colonne"));
}
function ResultatsVue(){ return Console("donnees", "results", h(ResultatsV), false); }

/* ════════ La fiche d'un élève, le soir : sa feuille lue par son voisin, sa tablette, ce qu'il a dit, son autonomie, son bilan général ════════ */
function eleveParam(){ return paramHash("eleve"); }
function choixTexteV(q, a){ return a === "aucun" ? "aucun de ces choix" : !a || !a.length ? "—" : a.map(function(i){ return q.choix[i]; }).join(", "); }
function retirerAutonomieSoirV(se, slug){ return v3Set(v3Q("sessions/" + se.id + "/autonomie/" + slug), {retire:true, ms:Date.now(), quand:"soir"}); }
function rendreAutonomieV(se, slug){ return v3Set(v3Q("sessions/" + se.id + "/autonomie/" + slug), null); }
function marquerLueV(se, id){ var x = aLireV(se).filter(function(y){ return y.id === id; })[0], u = {}; u["aLire/" + id + "/lue"] = true;
  if(x){ u["aLire/" + id + "/eleveSlug"] = x.p; u["aLire/" + id + "/qi"] = x.q; u["aLire/" + id + "/sorte"] = x.sorte || "b"; } return v3Update(v3Q("sessions/" + se.id), u); }
// l'alerte de la co-évaluation tranchée pour cette question de cet élève (c3-corr.js : « auteur », « lecteur », « feuille », « soir »)
function trancheeV(se, slug, qi){ var A = se.S.alertes || {}, r = null;
  Object.keys(A).forEach(function(k){ var a = A[k]; if(a && +a.qi === qi && v3Liste(a.eleves)[0] === slug && a.tranche){ var d = typeof a.tranche === "string" ? {decision:a.tranche} : a.tranche; r = {decision:d.decision, choix:d.choix || null, lu:a.lu || null}; } });
  return r; }
// « Que dit la feuille ? », validé : la lecture devient celle de Paul, la question se recalcule ; le signalement de cette question passe à « lu »
function feuilleDitV(se, slug, qi, sel){
  var u = {}, A = aLireV(se).filter(function(x){ return x.p === slug && x.q === qi; }), l0 = ((se.S.lectures || {})[qi] || {})[slug];
  // la lecture du voisin est gardée (« avant ») : la fiche la montre toujours, la correction se lit dans sa pastille
  u["lectures/" + qi + "/" + slug] = v3Sans({choix:sel === "aucun" ? "aucun" : sel, par:"prof", ms:Date.now(), avant:l0 ? (l0.avant || {choix:l0.choix, par:l0.par || null}) : null});
  A.forEach(function(x){ u["aLire/" + x.id + "/lue"] = true; u["aLire/" + x.id + "/corrige"] = true; u["aLire/" + x.id + "/eleveSlug"] = slug; u["aLire/" + x.id + "/qi"] = qi; u["aLire/" + x.id + "/sorte"] = x.sorte || "b"; });
  if(!A.length){ var id = "soir-" + qi + "-" + slug; u["aLire/" + id] = {eleveSlug:slug, qi:qi, sorte:"soir", txt:"", lue:true, corrige:true}; }
  return v3Update(v3Q("sessions/" + se.id), u);
}
function FicheV(p){
  var se = p.se, slug = p.slug, r0 = resultatV(se, slug), ev = se.ev, sq = "&seance=" + encodeURIComponent(se.id), e = "&eleve=" + encodeURIComponent(slug) + sq;
  var nom = nomEleveV(se, slug), pre = prenomDeNom(nom), voisin = voisinV(se, slug), vPre = voisin ? prenomEleveV(se, voisin) : null, il = ilElle(se, slug);
  if(!r0) return h("div", {className:"student-report", "data-eleve":slug}, h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}}, h("h3", null, "👤 " + nom), h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats" + sq, title:"Ferme la fiche et revient au tableau de la séance."}, "✕ Fermer")));
  var r = stVue(r0), mt = maitriseV(r.sur20), au = autonomieV(se, slug), comps = compsDeV(ev), lire = aLireV(se).filter(function(x){ return x.p === slug; });
  var b = (se.S.b || {});
  // une séance de la 7.7.1 n'a ni lecture du voisin ni « Oui / Non » : sa fiche est celle des autres séances de la maquette (FicheAutre)
  if(!se.nouvelle) return FicheAncienneV(se, slug, r, mt, au, comps, e, sq, nom, il, pre);
  return h("div", {className:"student-report", "data-eleve":slug, "data-seance":se.id},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}},
      h("h3", null, "👤 " + nom + " — " + fr1(r.n) + " / " + r.total + " · " + fr1(r.sur20) + " / 20 · " + mt.em + " " + mt.lib, InfoI("Pour chaque question : ce que " + (vPre || "son voisin") + " a lu sur sa feuille à la correction, ce qu'" + il + " a cliqué sur la tablette, ce qu'" + il + " a dit à la fin de son temps de réponse, « Oui, la même chose » ou « Non, autre chose ». « La feuille dit autre chose » corrige une question d'après sa feuille.")),
      h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats" + sq, title:"Ferme la fiche et revient au tableau de la séance."}, "✕ Fermer")),
    h("div", {className:"fiche-head fiche-head-b"}, h("span", null, ""), h("span", null, "Question"), h("span", null, se.nouvelle ? "Sa feuille, lue par " + (vPre || pre) : "Sa feuille"), h("span", null, "Sa tablette"), h("span", null, "Ce qu'" + il + " a dit"), h("span", null, "Bonne réponse"), h("span", null, "Points"), h("span", null, "")),
    ev.questions.map(function(q, qi){
      var l = lectureV(se, qi, slug), brute = ((se.S.lectures || {})[qi] || {})[slug] || {}, tr = trancheeV(se, slug, qi);
      // la colonne dit ce que le voisin a lu ; une correction (en classe ou le soir) se lit dans la pastille de la question
      var luV = brute.avant ? (brute.avant.choix === "aucun" ? "aucun" : v3Liste(brute.avant.choix).map(Number)) : tr && tr.lu && l && l.par === "prof" ? (tr.lu === "aucun" ? "aucun" : v3Liste(tr.lu).map(Number)) : null;
      var lu = luV || (l ? l.choix : (se.nouvelle ? null : feuillePapierV(se, qi, slug))), t = tabletteV(se, qi, slug), tc = t ? t.choix : null;
      var luJ = lu && lu !== "aucun" && memesChoixV(lu, q.bonnes), tJ = tc && memesChoixV(tc, q.bonnes);
      var fls = lire.filter(function(x){ return x.q === qi; }), fl = fls[0], dit = (b[qi] || {})[slug];
      var corr = (r.corrigees || []).indexOf(qi) >= 0;
      return h("div", {key:qi, className:"fiche-q fiche-q-b"},
        h("span", {className:"num"}, "Q" + (qi+1)),
        h("span", null, q.enonce, (q.competences || []).length > 0 && h("div", {className:"fiche-comp"}, "🧩 " + q.competences.join(" · ")),
          tr && tr.decision === "auteur" ? h("div", null, h("span", {className:"flag ok"}, "corrigée en classe : raison donnée à " + pre + " (" + choixTexteV(q, l ? l.choix : tr.choix) + ")"))
            : corr && h("div", null, h("span", {className:"flag ok"}, l && l.par === "prof" ? "Corrigé d'après sa feuille : " + choixTexteV(q, l.choix) : "Corrigé d'après sa feuille")),
          // toutes les lignes « à lire » de la question, chacune avec ses réponses dessous (une question en a parfois deux)
          fls.filter(function(x){ return x.txt; }).map(function(x, k){ return h("div", {key:"al" + k}, h("span", {className:"flag" + (x.lue ? " ok" : "")}, (x.lue ? "✔ lue · " : "⚠️ ") + x.txt), (x.lignes || []).map(function(l, i){ return h("div", {key:i, className:"alire-l"}, l); })); })),
        h("span", {className:"val " + (luJ ? "j" : "f")}, lu ? choixTexteV(q, lu) : "—"),
        h("span", {className:"val " + (tJ ? "j" : "f")}, tc ? choixTexteV(q, tc) : "—"),
        h("span", {className:"val"}, dit === "oui" ? "Oui, la même chose" : dit === "non" ? "Non, autre chose" : "rien dit"),
        h("span", {className:"val"}, choixTexteV(q, q.bonnes)),
        h("span", {className:"pts"}, r.st[qi] === "x" ? "—" : fr1(r.pts[qi] || 0) + " pt"),
        h("span", {className:"fiche-acts"},
          fl && !fl.lue && h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", title:"Tu as lu sa feuille et elle dit bien ce qui est compté : le signalement passe à « lu ».", onClick:function(){ marquerLueV(se, fl.id); }}, "✔ Marquer lue"),
          fl && fl.lue && h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:true, title:"Feuille lue : le signalement est passé à « lu »."}, "✔ lue"),
          h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-que-dit-la-feuille" + e + "&q=" + (qi + 1), title:"Ouvre les choix de la question " + (qi + 1) + " : tu cliques ce que dit sa feuille, et sa note se recalcule (« Corrigé d'après ta feuille » dans son bilan)."}, "La feuille dit autre chose")));
    }),
    h("div", {className:"fiche-comps"}, h("div", {className:"tt"}, "🧩 Ses compétences"),
      comps.map(function(c){ var n = niveauComp(r, c), x = r.comp[c] || {n:0, max:0};
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, libOff(c)), h("span", {className:"d"}, compQuestionsEv(c, ev).map(function(i){ return "Q" + (i+1) + " " + marque(r.st[i]); }).join(" · ") + " → " + fr1(x.n) + "/" + x.max), h("span", {className:"maitrise-pill " + n.cls}, n.em + " " + n.lib)); }),
      ["tr-personne-03", "tr-methodes-02"].map(function(c){
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, libOff(c)), h("span", {className:"d"}, "le point d'autonomie"),
          h("span", {className:"maitrise-pill " + (au.retire ? "mt-rouge" : "mt-vert")}, au.retire ? maitriseV(0).em + " " + maitriseV(0).lib : maitriseV(20).em + " " + maitriseV(20).lib));
      }),
      h("div", {className:"fiche-auto"}, au.retire
        ? h(F, null, h("span", null, "⛔ Point d'autonomie retiré " + au.quand + "."), h("button", surClic(function(){ return rendreAutonomieV(se, slug); }, {className:"btn btn-vert btn-sm", title:"Rend son point d'autonomie à " + pre + " : ses deux compétences d'autonomie repassent en Très bonne maîtrise."}), "↩️ Rendre"))
        : h(F, null, h("span", null, (il === "elle" ? "Elle" : "Il") + " a gardé son point d'autonomie."), h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-fiche-garde" + e, title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. La note ne bouge pas. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")))));
}
/* ── « 📝 Bilan général » : pré-rempli par l'app (com632.js), modifiable, validé dans la séance (bilans/<slug>) ── */
function CarteBilanV(p){
  var se = p.se, slug = p.slug, entree = entreeV(se, slug), base = entree ? commentaireQCM(entree).map(function(x){ return x.t; }).join("") : "", v = bilanValideV(se, slug);
  var s1 = useState(null), texte = s1[0], setTexte = s1[1];
  var t = texte == null ? (v ? v.texte : base) : texte, valide = !!v && t === v.texte;
  return h("div", {className:"card bilan628"},
    h("h3", null, "📝 Bilan général", InfoI("Texte pré-rempli automatiquement à partir de ses résultats : sa note, les questions qu'il a ratées et les questions difficiles qu'il a réussies (avec ce que chacune vérifie), son point d'autonomie, son estimation. Modifie-le si tu veux, puis valide. C'est ce texte qui finit son bilan quand sa copie lui est rendue, et qui va dans la ligne « Commentaire » du PDF « notes et compétences ».")),
    h("textarea", {className:"ta628 ta-bilan", value:t, "data-com":t === base && entree ? JSON.stringify(entree) : null, title:"Le bilan général de l'élève : modifie-le si tu veux.", onChange:function(ev){ setTexte(ev.target.value); }}),
    h("div", {className:"pied628"},
      h("span", {className:"st628"}, valide ? "✅ Bilan validé le " + dateFr(v.valide).slice(0, 5) : t === base ? "Pré-rempli par l'app" : "⚠ Modifications non validées"),
      h("div", {style:{display:"flex", gap:6}},
        h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:t === base, title:t === base ? "Le texte est déjà celui de l'app." : "Remet le texte calculé par l'app, d'après ses résultats.", onClick:function(){ setTexte(base); if(v) v3Set(v3Q("sessions/" + se.id + "/bilans/" + slug), null); }}, "↻ Regénérer"),
        h("button", {className:"btn btn-primary btn-sm", "data-local":"1", disabled:valide || !t, title:valide ? "Le bilan est déjà validé." : "Valide ce texte : c'est lui qui ira sur sa copie et dans le PDF.", onClick:function(){ v3Set(v3Q("sessions/" + se.id + "/bilans/" + slug), {texte:t, valide:Date.now()}).then(function(){ setTexte(null); }); }}, "✓ Valider le bilan"))));
}
function ScFicheV(){ return Console("donnees", "results", h(ScFicheC, {key:(seanceParam() || "") + ":" + (eleveParam() || "")}), false); }
function ScFicheC(){
  useV3();
  var se = seanceV(seanceParam()), slug = eleveParam();
  if(!se || !slug) return h("div", {className:"card"}, h("p", null, v3Pret([v3Q("sessions"), v3Q("evaluations")]) ? "Cette fiche n'existe plus." : "Chargement…"));
  return h(F, null, h("div", {className:"card"}, FicheV({se:se, slug:slug}), h(CarteBilanV, {key:slug + se.id, se:se, slug:slug})));
}
/* ── La garde du soir : « ⛔ Retirer le point d'autonomie » ── */
function ScFicheGardeV(){ return h(ScFicheGardeC); }
function ScFicheGardeC(){
  useV3();
  var se = seanceV(seanceParam()), slug = eleveParam(); if(!se || !slug) return ScFicheV();
  var e = "&eleve=" + encodeURIComponent(slug) + "&seance=" + encodeURIComponent(se.id);
  return Fenetre(ScFicheV(), "⛔ Retirer le point d'autonomie à " + nomEleveV(se, slug) + " ?", "Le soir, d'après ta lecture de ses feuilles",
    h(F, null, h("p", null, "Ses deux compétences d'autonomie passent en Maîtrise insuffisante, pour cette évaluation : « " + libOff("tr-personne-03") + " » et « " + libOff("tr-methodes-02") + " ». La note ne bouge pas.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-fiche" + e, title:"Ne retire rien."}, "Annuler"),
     h("button", surClic(function(){ return retirerAutonomieSoirV(se, slug).then(function(){ versScene("c-fiche" + e); }); }, {key:2, className:"btn btn-rouge", title:"Retire le point d'autonomie, tout de suite. « ↩️ Rendre » le défait."}), "⛔ Retirer le point d'autonomie")], "c-fiche" + e);
}
/* ── « Que dit la feuille ? », depuis la fiche ── */
function ScQueDitV(){ return h(ScQueDitC); }
function ScQueDitC(){
  useV3();
  var se = seanceV(seanceParam()), slug = eleveParam(), qi = (+paramHash("q") || 1) - 1; if(!se || !slug || !se.ev.questions[qi]) return ScFicheV();
  var q = se.ev.questions[qi], v = voisinV(se, slug), vPre = v ? prenomEleveV(se, v) : null, l = lectureV(se, qi, slug), lu = l ? l.choix : feuillePapierV(se, qi, slug);
  var e = "&eleve=" + encodeURIComponent(slug) + "&seance=" + encodeURIComponent(se.id);
  return QdfFenetre({fond:ScFicheV(), p:prenomEleveV(se, slug), nom:nomEleveV(se, slug), voisin:vPre || "", qi:qi, q:q, lu:lu || null, ecrit:null,
    texte:(vPre && lu ? vPre + " a lu « " + choixTexteV(q, lu) + " »." : "") + " Clique sur ce que dit sa feuille.", fermer:"c-fiche" + e,
    valider:function(){ return "c-fiche" + e; }, surValider:function(sel){ feuilleDitV(se, slug, qi, sel).then(function(){ versScene("c-fiche" + e); }); }});
}

/* ════════ Le PDF « notes et compétences » d'une séance de la base : la mise en page du PDF figé (gen632.js), construite pour elle ════════ */
function pdfSeanceV(se){
  var ev = se.ev, comps = compsDeV(ev), auto = [["tr-personne-03", libOff("tr-personne-03")], ["tr-methodes-02", libOff("tr-methodes-02")]];
  var eleves = se.eleves.slice(), nc = comps.length + 4, nNotes = 0, nAbs = 0, nCom = 0, asavoir = [];
  var lignes = eleves.map(function(e){
    var r = resultatV(se, e.slug), nom = e.nom;
    if(!r){ nAbs++; asavoir.push("<b>" + escPdf(nom) + "</b> : absent, pas encore de rattrapage.");
      return '<tbody class="un"><tr class="abs"><td class="el">' + escPdf(nom) + '</td><td class="note">Absent</td>' + new Array(nc - 1).join("<td>—</td>") + '</tr><tr class="comrow"><td colspan="' + nc + '"><span class="lab">Commentaire :</span> —</td></tr></tbody>'; }
    nNotes++;
    var la = r.st.map(function(s, i){ return s === "x" || se.annulees.indexOf(i) >= 0 ? -1 : i; }).filter(function(i){ return i >= 0; });
    // une question bonus compte dans les points gagnés, pas dans le total (comme la note, et le bilan de l'élève)
    var cells = comps.map(function(c){ var tout = compQuestionsEv(c, ev).filter(function(i){ return la.indexOf(i) >= 0; }), qs = tout.filter(function(i){ return !ev.questions[i].bonus; }), n = tout.reduce(function(a, i){ return a + (r.pts[i] || 0); }, 0), d = qs.length || tout.length, m = maitriseV(d ? Math.min(20, n * 20 / d) : 0), v = {lib:m.lib, cls:m.k};
      return '<td class="niv ' + v.cls + '">' + v.lib + '<span class="pts">' + fr1(n) + "/" + d + "</span></td>"; });
    var a0 = maitriseV(autonomieV(se, e.slug).retire ? 0 : 20), a = {lib:a0.lib, cls:a0.k};
    auto.forEach(function(){ cells.push('<td class="niv ' + a.cls + '">' + a.lib + "</td>"); });
    var poses = ev.questions.filter(function(q, i){ return se.ecartees.indexOf(i) < 0; }).length;
    if(la.length < poses - se.annulees.length) asavoir.push("<b>" + escPdf(nom) + "</b> : parti après la question " + la.length + " ; sa note et ses compétences portent sur les " + la.length + " questions où il était là, et il n'a pas fait son estimation.");
    var com = texteBilanV(se, e.slug);
    if(com){ nCom++; com = escPdf(com); } else com = "—";
    return '<tr><td class="el">' + escPdf(nom) + '</td><td class="note">' + fr1(r.sur20) + "</td>" + cells.join("") + '</tr><tr class="comrow"><td colspan="' + nc + '"><span class="lab">Commentaire :</span> ' + com + "</td></tr></tbody>";
  });
  var qs = function(c){ return compQuestionsEv(c, ev); };
  var ch = chapitreVue(ev.chapitre), nEc = se.ecartees.length, nAn = se.annulees.length;
  return PDF_TETE +
    '<div class="haut"><h1>Notes et compétences</h1><div class="classe">Classe : ' + escPdf(se.classe) + "</div></div>\n" +
    '<div class="infos">\n' +
    "<div><b>Évaluation :</b> " + escPdf(ev.titre) + "</div>\n" +
    "<div><b>Chapitre :</b> " + escPdf(ch ? ch.niveau + ", chapitre " + ch.numero + (ch.titre ? " — " + ch.titre : "") : "—") + "</div>\n" +
    "<div><b>Séance :</b> " + se.date + " · " + ev.questions.length + " questions · " + (ev.mode === "partiel" ? "partiel" : "tout ou rien") + "</div>\n" +
    "<div><b>Copies :</b> rendues le " + dateFr(se.rendueMs) + " — les notes sont définitives</div>\n" +
    "<div><b>Note :</b> sur 20, arrondie au dixième</div>\n" +
    "<div><b>Questions :</b> " + (nEc ? se.ecartees.map(function(q){ return "Q" + (q + 1); }).join(", ") + " écartée" + (nEc > 1 ? "s" : "") : "aucune écartée") + ", " + (nAn ? se.annulees.map(function(q){ return "Q" + (q + 1); }).join(", ") + " annulée" + (nAn > 1 ? "s" : "") : "aucune annulée") + "</div>\n" +
    "</div>\n" +
    '<div class="mode"><b>Pour École Directe.</b> Une ligne par élève, dans l\'ordre alphabétique. « Note » : la note sur 20 du devoir.\n' +
    "Chaque colonne de compétence : le niveau de maîtrise de l'élève, en toutes lettres, parmi quatre : Très bonne maîtrise, Maîtrise satisfaisante, Maîtrise fragile, Maîtrise insuffisante.\n" +
    "« Commentaire », sur la ligne sous l'élève : son commentaire pour ce devoir, à entrer tel quel dans la zone commentaire ; « — » : pas de commentaire. « Absent » : ni note, ni niveau, ni commentaire.\n" +
    "Le cadre « À savoir », sous le tableau, ne s'entre pas.</div>\n" +
    "<table>\n" +
    '<colgroup><col style="width:50mm"><col style="width:17mm">' + comps.map(function(){ return '<col style="width:58mm">'; }).join("") + '<col style="width:48mm"><col style="width:48mm"></colgroup>\n' +
    "<thead>\n" +
    '<tr class="g"><th rowspan="2" style="text-align:left">Élève</th><th rowspan="2" style="text-align:center">Note<br>sur 20</th>' + (comps.length ? '<th colspan="' + comps.length + '">Compétences de l\'évaluation</th>' : "") + '<th colspan="2">Point d\'autonomie</th></tr>\n' +
    "<tr>" + comps.map(function(c){ var l = qs(c); return '<th><span class="c">' + c + '</span><span class="l">' + (l.length > 1 ? "Q" + (l[0] + 1) + " à Q" + (l[l.length - 1] + 1) : "Q" + (l[0] + 1)) + "</span></th>"; }).join("") + auto.map(function(x){ return '<th><span class="c">' + x[0] + '</span><span class="l">' + escPdf(x[1]) + "</span></th>"; }).join("") + "</tr>\n" +
    "</thead>\n" +
    lignes.join("\n") + "\n" +
    "</table>\n" +
    '<div class="ctrl">Contrôle : ' + eleves.length + " élèves · " + nNotes + " notes · " + nAbs + " absent" + (nAbs > 1 ? "s" : "") + " · " + nCom + " commentaires.</div>\n" +
    (asavoir.length ? '<div class="asavoir"><b>À savoir — ne s\'entre pas dans École Directe.</b><br>' + asavoir.join("<br>") + "</div>\n" : "") +
    '<div class="bas">\n' +
    "<div><b>Les compétences</b><br>\n" +
    comps.map(function(c){ return "<b>" + c + "</b> — " + escPdf(libOff(c)) + " (questions " + qs(c).map(function(i){ return "Q" + (i + 1); }).join(", ") + ")."; }).join("<br>") + (comps.length ? "<br>\n" : "") +
    auto.map(function(x){ return "<b>" + x[0] + "</b> — " + escPdf(x[1]) + "."; }).join("<br>") + "</div>\n" +
    "<div><b>Comment le niveau se calcule</b><br>\n" +
    "Pour chaque compétence, la part des points de l'élève sur ses questions, ramenée sur 20 (« 8/11 » : 8 points sur 11 questions) :\n" +
    "Très bonne maîtrise de 15 à 20 ; Maîtrise satisfaisante de 10 à moins de 15 ; Maîtrise fragile de 5 à moins de 10 ; Maîtrise insuffisante de 0 à moins de 5.\n" +
    "Point d'autonomie : Très bonne maîtrise, ou Maîtrise insuffisante s'il a été retiré.<br>\n" +
    "<b>Le commentaire</b> : le bilan général de l'élève, rempli par l'app à partir de ses questions, comme en correction de dictée, puis modifié et validé, ou non, dans sa fiche.</div>\n" +
    "</div>\n" +
    "</body></html>";
}
// « 📄 PDF notes et compétences » : la page du PDF dans une nouvelle fenêtre, puis l'impression du navigateur (« Enregistrer au format PDF »)
function ouvrirPdfV(sid){
  var se = seanceV(sid); if(!se || !se.rendue) return;
  var html = pdfSeanceV(se), w = window.open("", "pdf-qcm");
  if(!w){ location.hash = "#scene=x632-pdf&seance=" + encodeURIComponent(sid); return; }
  w.document.open(); w.document.write(html); w.document.close();
  setTimeout(function(){ try { w.focus(); w.print(); } catch(e){} }, 400);
}
function PdfApercuV(){ return h(PdfApercuC); }
function PdfApercuC(){
  useV3();
  var se = seanceV(seanceParam()), html = se && se.rendue ? pdfSeanceV(se) : "";
  return h("div", {className:"pdf-fond"},
    h("div", {className:"pdf-barre"}, "🖨️ Aperçu avant impression · Destination : Enregistrer au format PDF"),
    h("iframe", {className:"pdf-page", title:"Notes et compétences", srcDoc:html,
      onLoad:function(ev){ var f = ev.target, d = f.contentDocument; if(d && d.documentElement) f.style.height = (d.documentElement.scrollHeight + 4) + "px"; window.SCENE_PRETE = "x632-pdf"; }}));
}

/* ════════ Côté élève : « 📊 Mes évaluations », d'après la base ; le bilan d'une séance dont la copie est rendue ════════ */
// l'élève de cette page : celui de l'adresse (« &eleve=<slug>&classe=<classeSlug> »), sinon celui que le socle a fait entrer
function eleveIciV(){
  var s = paramHash("eleve"), c = paramHash("classe");
  if(!s && typeof window.ELEVE_COURANT === "object" && window.ELEVE_COURANT){ s = window.ELEVE_COURANT.slug || window.ELEVE_COURANT.eleveSlug; c = c || window.ELEVE_COURANT.classeSlug; }
  if(!s && typeof ELV !== "undefined" && ELV.ici){ var ic = ELV.ici(); s = (ELV.courant && ic[ELV.courant]) || ic.g || ic.d; c = c || ic.classe; }
  return s ? {slug:s, classeSlug:c || null} : null;
}
function mesEvaluationsV(slug, classeSlug){
  return seancesV().filter(function(se){ return se.terminee && !se.demo && !se.test && se.publiee && (classeSlug ? memeClasse(se, classeSlug) : true) && se.eleves.some(function(e){ return e.slug === slug; }); })
    .sort(function(a, b){ return b.ms - a.ms; })
    .map(function(se){ var abs = se.absents.some(function(e){ return e.slug === slug; }) || !se.presents.some(function(e){ return e.slug === slug; });
      var r = abs ? null : resultatV(se, slug);
      return {se:se, titre:se.ev.titre, date:se.date, etat:abs ? "absente" : se.rendue && r && r.complet ? "bilan" : "relecture", note:se.rendue && r && r.complet ? r : null}; });
}
function ListeMesEvalsV(slug, classeSlug, onOuvrir){
  var items = mesEvaluationsV(slug, classeSlug), se0 = items[0] && items[0].se;
  if(!items.length) return h("p", {style:{opacity:.8}}, "Tu n'as pas encore d'évaluation ici. Celles de ta classe apparaîtront après la correction.");
  return h("div", {className:"eleves-grid", style:{gridTemplateColumns:"1fr"}}, items.map(function(x, i){
    var n = x.note, mt = n ? maitriseV(n.sur20) : null;
    var ligne = n ? x.date + " · " + fr1(n.n) + " / " + n.total + " · " + fr1(n.sur20) + " / 20 · " + mt.em + " " + mt.lib : null;
    var actif = x.etat === "bilan";
    return h(actif ? "button" : "div", {key:x.se.id, className:"eleve-btn mes-ev " + x.etat, "data-seance":x.se.id, "data-local":actif && onOuvrir ? "1" : null, onClick:actif && onOuvrir ? function(){ onOuvrir(x.se.id); } : null,
      "data-va":actif && !onOuvrir ? "e-bilan-lou&eleve=" + encodeURIComponent(slug) + "&seance=" + encodeURIComponent(x.se.id) + (classeSlug ? "&classe=" + encodeURIComponent(classeSlug) : "") : null},
      h("div", {style:{fontWeight:700}}, x.titre),
      h("div", {style:{fontSize:".86rem", opacity:.9, marginTop:".2rem"}},
        x.etat === "relecture" ? "En relecture : ta note sera visible quand ta copie te sera rendue" : x.etat === "absente" ? (sexeV(x.se, slug) === "F" ? "Tu étais absente" : "Tu étais absent") : ligne));
  }));
}
function MesEvaluationsV(){ return h(MesEvaluationsVC); }
function MesEvaluationsVC(){
  useV3();
  var ici = eleveIciV(), s = useState(false), retour = s[0], setRetour = s[1];
  if(retour && typeof AccueilC === "function") return h(AccueilC);
  var nom = ici ? ((v3("codes/" + ici.slug) || {}).name || (seancesV().map(function(se){ return se.eleves.filter(function(e){ return e.slug === ici.slug; })[0]; }).filter(Boolean)[0] || {}).nom || ici.slug) : "";
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card", style:{maxWidth:"700px"}},
      h("h1", null, "📊 Mes évaluations"),
      h("p", {style:{opacity:.8}}, nom),
      ici ? h(MesEvalsBlocV, {slug:ici.slug, classe:ici.classeSlug}) : null,
      h("div", {style:{marginTop:"1.5rem"}}, h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", onClick:function(){ if(vientDUnGeste()) history.back(); else setRetour(true); }}, "← Retour"))));
}
// la fourchette d'une estimation, en bonnes réponses, sur le total de la séance (bornesFourchette et libelleFourchette de la 7.7.1)
function libFourchetteV(k, total, mode){
  var b = k === "vert" ? {inf:Math.ceil(total * 0.76), sup:total} : k === "bleu" ? {inf:Math.ceil(total * 0.51), sup:Math.floor(total * 0.75)} : k === "orange" ? {inf:Math.ceil(total * 0.26), sup:Math.floor(total * 0.50)} : {inf:0, sup:Math.floor(total * 0.25)};
  if(b.inf > b.sup) b.inf = b.sup; if(b.inf < 0) b.inf = 0; if(b.sup > total) b.sup = total;
  var partiel = mode === "partiel", unit = partiel ? "point" : "bonne", suf = partiel ? "" : " réponse";
  if(b.inf === b.sup) return b.inf + " " + unit + (b.inf > 1 ? "s" : "") + suf + (b.inf > 1 && !partiel ? "s" : "");
  return "entre " + b.inf + " et " + b.sup + " " + unit + "s" + suf + (partiel ? "" : "s");
}
function fourchetteDeNote(n, total){ var pc = total ? n / total * 100 : 0; return pc > 75 ? "vert" : pc > 50 ? "bleu" : pc > 25 ? "orange" : "rouge"; }
function BilanRenduV(){ return h(BilanRenduVC); }
function BilanRenduVC(){
  useV3();
  var ici = eleveIciV(), se = seanceV(seanceParam()); if(!ici || !se) return MesEvaluationsV();
  var slug = ici.slug, r0 = resultatV(se, slug); if(!se.rendue || !r0) return MesEvaluationsV();
  var retour = "e-mes-evals&eleve=" + encodeURIComponent(slug) + (ici.classeSlug ? "&classe=" + encodeURIComponent(ici.classeSlug) : "");
  return h("div", {className:"eleve-page"},
    DECO.map(function(x, i){ return h("span", {key:i, className:"deco"}, x); }),
    h("div", {className:"eleve-card", style:{maxWidth:"760px"}}, BilanContenuV(se, slug, h("button", {className:"btn btn-ghost btn-sm", "data-va":retour}, "← Mes évaluations"))));
}
// le bilan d'une séance rendue, pour un élève : sa note définitive, question par question, ses compétences, son estimation, « 📝 Bilan »
function BilanContenuV(se, slug, boutonRetour){
  var r0 = resultatV(se, slug); if(!r0) return null;
  var r = stVue(r0), ev = se.ev, mt = maitriseV(r.sur20), au = autonomieV(se, slug), comps = compsDeV(ev), est = estimationV(se, slug);
  var es = est ? typeEstim7(est, r.n, r.total || 1) : null, emE = est ? MAITRISE.filter(function(x){ return x.k === est; })[0].em : null, fR = fourchetteDeNote(r.n, r.total), emR = MAITRISE.filter(function(x){ return x.k === fR; })[0].em;
  var bilan = texteBilanV(se, slug), entree = entreeV(se, slug);
  return h(F, null,
      boutonRetour,
      h("h1", {style:{marginTop:".5rem"}}, ev.titre),
      h("p", {style:{opacity:.75}}, se.date),
      h("div", {className:"bilan-score fourchette-" + mt.k},
        h("div", {className:"bilan-score-emoji"}, mt.em),
        h("div", {className:"bilan-score-num"}, "Ta note : " + fr1(r.n) + " / " + r.total),
        h("div", {className:"note20"}, fr1(r.sur20) + " / 20"),
        h("div", {className:"bilan-score-pct"}, mt.lib)),
      h("div", {className:"bilan-bloc"}, h("h3", null, "Question par question"),
        h("div", {className:"recap"}, ev.questions.map(function(q, i){
          var s = r.st[i];
          if(se.ecartees.indexOf(i) >= 0) return null;
          if(se.annulees.indexOf(i) >= 0) return h("div", {key:i, className:"recap-l"}, h("span", null, "Question " + (i+1) + " · annulée : elle ne compte pas."), h("span", {className:"pt"}, ""));
          if(s === "x") return null;
          return h("div", {key:i, className:"recap-l " + (s === "j" || s === "t" ? "j" : "f")},
            h("span", null, s === "t" ? h(F, null, "Question " + (i+1) + " · ", h("span", {className:"v-orange"}, "✓"), " Trouvée au dernier moment") : "Question " + (i+1) + " · " + (s === "a" ? "ta feuille ne dit aucun de ces choix" : s === "j" ? "juste" : "faux"),
              (r.corrigees || []).indexOf(i) >= 0 && h("span", {className:"corrige"}, "Corrigé d'après ta feuille."),
              h("span", {className:"recap-comp"}, (q.competences || []).map(libEleve).join(" · "))),
            h("span", {className:"pt"}, "→ " + fr1(r.pts[i] || 0) + " point"));
        }))),
      h("div", {className:"bilan-bloc"}, h("h3", null, "Tes compétences"),
        comps.map(function(c){ var x = r.comp[c] || {n:0, max:0}, mm = maitriseV(x.max ? x.n * 20 / x.max : 0);
          return h("div", {key:c, className:"comp-l"},
            h("span", null, libEleve(c), h("span", {className:"comp-q"}, compQuestionsEv(c, ev).filter(function(i){ return r.st[i] !== "x" && se.annulees.indexOf(i) < 0; }).map(function(i){ return "Q" + (i+1) + " " + (r.st[i] === "j" || r.st[i] === "t" ? "✓" : "✗"); }).join(" · ") + " → " + fr1(x.n) + "/" + x.max)),
            h("span", {className:"mt"}, mm.em + " " + mm.lib)); }),
        [libEleve("tr-personne-03"), libEleve("tr-methodes-02")].map(function(l){ return h("div", {key:l, className:"comp-l"}, h("span", null, l), h("span", {className:"mt"}, au.retire ? "❌ " : "✅ ", au.retire ? "non atteinte" : "atteinte")); })),
      es && h("div", {className:"bilan-calibration bilan-calib-" + es.type},
        h("h3", null, "🎯 Ton estimation"),
        h("div", {className:"bilan-calib-msg"}, es.type === "ok" ? "✅ Tu te connais bien !" : es.type === "sur" ? "⚠️ Tu pensais avoir mieux fait" : "🌟 Tu te sous-estimais !"),
        es.type !== "sous" && h("div", {className:"bilan-calib-detail"}, es.type === "ok"
          ? "Tu pensais avoir " + libFourchetteV(est, r.total, ev.mode) + " " + emE + " et tu en as effectivement obtenu " + fr1(r.n) + " sur " + r.total + ". Ton estimation correspond à ton vrai résultat."
          : "Tu pensais avoir " + libFourchetteV(est, r.total, ev.mode) + " " + emE + " mais tu en as eu " + fr1(r.n) + " sur " + r.total + " (" + libFourchetteV(fR, r.total, ev.mode) + " " + emR + "). " + degreSurestime(es.ecart))),
      bilan && h("div", {className:"bilan-bloc bilan628-eleve"}, h("h3", null, "📝 Bilan"), h("p", {"data-com":entree && !bilanValideV(se, slug) ? JSON.stringify(entree) : null}, bilan)));
}
/* « 📊 Mes évaluations » sur une moitié de tablette (ou chez l'élève) : la liste, et le bilan d'une séance rendue ouvert sur place */
function MesEvalsBlocV(p){ return h(MesEvalsBlocC, p); }
function MesEvalsBlocC(p){
  useV3();
  var s = useState(null), ouverte = s[0], setOuverte = s[1], se = ouverte ? seanceV(ouverte) : null;
  if(se && se.rendue) return h("div", {className:"mes-evals-bilan"}, BilanContenuV(se, p.slug, h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", onClick:function(){ setOuverte(null); }}, "← Mes évaluations")));
  // sous « 📊 Mes évaluations », le nom de l'élève (e-mes-evals) ; masqué (qcm3.css) quand la page l'écrit déjà au-dessus
  var nom = (v3("codes/" + p.slug) || {}).name || (seancesV().map(function(x){ return x.eleves.filter(function(e){ return e.slug === p.slug; })[0]; }).filter(Boolean)[0] || {}).nom || "";
  return h("div", {className:"mes-evals-liste"}, nom && h("p", {className:"mes-evals-nom", style:{opacity:.8}}, nom), ListeMesEvalsV(p.slug, p.classe, setOuverte));
}
// la moitié de tablette (c3-tablettes.js, PageMoitie) appelle ListeMesEvals(prénom) : avec la base, c'est la liste de l'élève de cette moitié
(function(){ if(typeof ListeMesEvals !== "function") return; var avant = ListeMesEvals;
  ListeMesEvals = function(p){ if(!v3db()) return avant(p);
    // l'élève de la moitié : celui que la tablette connaît (ELV du socle, ou l'état de la tablette de QCM-2), trouvé par son prénom
    var ic = typeof ELV !== "undefined" && ELV.ici ? ELV.ici() : {}, il = typeof ICI_L !== "undefined" && ICI_L ? ICI_L : {};
    var cand = [ic.g, ic.d, il.g, il.d].filter(Boolean), slug = cand.filter(function(x){ return x === p || (SCN.pre && SCN.pre(x) === p); })[0] || (cand.length === 1 ? cand[0] : p);
    return h(MesEvalsBlocV, {slug:slug, classe:ic.classe || il.classe || (typeof LIVE !== "undefined" ? LIVE.classeSlug : null) || null}); }; })();

/* ════════ 💾 Sauvegarde : le snapshot, la corbeille du site, la maintenance, les purges (la démo reste toujours) ════════ */
function lireTout(chemin){ var db = v3db(); if(!db) return Promise.resolve(null); return db.ref(chemin).once("value").then(function(s){ return s.val(); }); }
function telecharger(nom, texte, type){ try { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([texte], {type:type || "application/json"})); a.download = nom; document.body.appendChild(a); a.click(); a.remove(); } catch(e){} }
function nomSnapshot(){ var d = new Date(); return "qcm-snapshot-" + d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + ".json"; }
function exporterSnapshot(){
  return Promise.all([lireTout(v3Racine()), lireTout("classes")]).then(function(x){
    var nom = nomSnapshot();
    telecharger(nom, JSON.stringify({_meta:{source:v3Racine(), exportedAt:new Date().toISOString(), version:2, app:"evaluation-qcm"}, data:x[0] || {}, classes:x[1] || {}}, null, 2));
    return nom; });
}
// importer : le QCM d'aujourd'hui part d'abord à la corbeille ; les listes d'élèves des classes du fichier remplacent les leurs, rien d'autre des classes ne change
function importerSnapshot(texte){
  var p = JSON.parse(texte), data = p.data || p, classes = p.classes || null;
  return lireTout(v3Racine()).then(function(avant){
    var ts = Date.now();
    return v3Set("corbeille/qcm-tout-" + ts, v3Sans({_meta:{motif:"import-snapshot", chemin:"/" + v3Racine(), app:"evaluation-qcm", ts:ts, sorte:"Tout", titre:"Le QCM d'avant l'import du " + dateFr(ts)}, data:avant || {}}));
  }).then(function(){
    var demo = (data.evaluations || {}).demo ? null : (v3Evals().demo || demoBrute());
    if(demo){ data.evaluations = data.evaluations || {}; data.evaluations.demo = demo; }
    var l = [v3Set(v3Racine(), v3Sans(data))];
    if(classes) Object.keys(classes).forEach(function(c){ var e = classes[c] && (Array.isArray(classes[c]) ? classes[c] : classes[c].eleves); if(e) l.push(v3Set("classes/" + c + "/eleves", e)); });
    return Promise.all(l);
  });
}
function purgerEvaluations(){
  var E = v3Evals(), ids = Object.keys(E).filter(function(k){ return k !== "demo" && E[k] && !E[k].demo; });
  return ids.reduce(function(p, id){ return p.then(function(){ return mettreACorbeille("Évaluation", v3Q("evaluations/" + id), E[id], (E[id].titre || id) + " (" + v3Liste(E[id].questions).length + " questions)"); }); }, Promise.resolve());
}
function purgerTout(){
  return lireTout(v3Racine()).then(function(tout){
    tout = tout || {}; var demo = (tout.evaluations || {}).demo || demoBrute(), ts = Date.now();
    var garde = Object.assign({}, tout); if(garde.evaluations){ garde.evaluations = Object.assign({}, garde.evaluations); delete garde.evaluations.demo; }
    return v3Set("corbeille/qcm-tout-" + ts, v3Sans({_meta:{motif:"purge", chemin:"/" + v3Racine(), app:"evaluation-qcm", ts:ts, sorte:"Tout", titre:"Tout le QCM, purgé le " + dateFr(ts)}, data:garde}))
      .then(function(){ return v3Set(v3Racine(), {evaluations:{demo:demo}}); });
  });
}
// les séances restées actives par erreur : sessionActive qui montre une séance terminée ou disparue ; une séance en cours n'est pas touchée
function nettoyerZombies(){
  return Promise.all([lireTout(v3Q("sessionActive")), lireTout(v3Q("sessions"))]).then(function(x){
    var A = x[0] || {}, S = x[1] || {}, z = Object.keys(A).filter(function(c){ var s = S[A[c]]; return !s || seanceTerminee(s); });
    return Promise.all(z.map(function(c){ return v3Set(v3Q("sessionActive/" + c), null); })).then(function(){ return z.length; });
  });
}
function SauvegardeV(){ return Console("donnees", "snapshot", h(SauvegardeVC), false); }
function SauvegardeVC(){
  useV3();
  var s1 = useState(null), exp = s1[0], setExp = s1[1], s2 = useState(null), net = s2[0], setNet = s2[1], s3 = useState({}), faits = s3[0], setFaits = s3[1];
  useEffect(function(){ remettreDemo(); });
  var corb = corbeilleV();
  return h("div", {className:"card"},
    h("h2", null, "💾 Sauvegarde", InfoI("Exporter ou importer tout le QCM, avec les classes ; la corbeille ; la maintenance ; les purges. La démo est permanente : aucune purge ne l'efface.")),
    h("p", {style:{marginBottom:".8rem", color:"var(--gris)", fontSize:".9rem"}}, "Exporte ou importe l'ensemble de la base QCM (évaluations, séances, réponses), avec les classes."),
    h("div", {className:"snapshot-row"},
      h("button", {className:"btn btn-primary", "data-local":"1", title:"Télécharge tout le QCM dans un fichier, à garder.", onClick:function(){ exporterSnapshot().then(setExp); }}, "📥 Exporter snapshot"),
      h("button", {className:"btn btn-ghost", "data-va":"c-importer", title:"Remplace tout le QCM par un fichier exporté, après une confirmation : le QCM d'aujourd'hui part d'abord à la corbeille."}, "📤 Importer snapshot")),
    exp && h("div", {className:"fen-note"}, "📥 " + exp + " téléchargé."),
    h("div", {className:"sauv-zone"},
      h("h3", {className:"sauv-h"}, "🗑️ Corbeille", InfoI("Ce qui est supprimé dans le QCM, gardé un an. La démo n'y va jamais.")),
      corb.length ? corb.map(function(c){
        return h("div", {key:c.cle, className:"corb-l"}, h("span", {className:"k"}, c.sorte), h("span", null, h("strong", null, c.titre), h("div", {className:"d"}, "mise à la corbeille le " + c.quand.slice(0, 5) + " à " + c.quand.slice(11, 16))),
          h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:!!faits[c.cle], title:faits[c.cle] ? "Restaurée : elle a retrouvé sa place." : "Remet cet élément à sa place, tel qu'il était.", onClick:function(){ var o = Object.assign({}, faits); o[c.cle] = 1; setFaits(o); restaurerDeCorbeille(c); }}, faits[c.cle] ? "✔ restaurée" : "↩️ Restaurer"));
      }) : h("p", {className:"sauv-p"}, "Ce que tu supprimes dans le QCM part ici, gardé un an. ↩️ le remet à sa place.")),
    h("div", {className:"sauv-zone"},
      h("h3", {className:"sauv-h"}, "🧹 Maintenance", InfoI("Pour les séances restées ouvertes par erreur.")),
      h("p", {className:"sauv-p"}, "Si la vue tableau ou le pilotage te montrent des séances fantômes (anciennes évaluations qui n'auraient pas dû rester actives), utilise le nettoyage ci-dessous."),
      h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", title:"Ferme les séances restées actives par erreur ; une séance en cours n'est pas touchée.", onClick:function(){ nettoyerZombies().then(setNet); }}, "🧹 Nettoyer les séances zombies"),
      net != null && h("div", {className:"fen-note"}, net ? "🧹 " + net + " séance" + (net > 1 ? "s" : "") + " zombie" + (net > 1 ? "s" : "") + " fermée" + (net > 1 ? "s" : "") + "." : "🧹 Aucune séance zombie : rien à fermer.")),
    h("div", {className:"sauv-zone dashed"},
      h("h3", {className:"sauv-h rouge"}, "🗑️ Zone dangereuse", InfoI("Tout part d'abord à la corbeille, gardé un an. La démo revient à l'ouverture suivante, quelle que soit la purge.")),
      h("div", {className:"row", style:{flexWrap:"wrap", gap:".5rem"}},
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-purger", title:"Met toutes les évaluations à la corbeille, après une confirmation. La démo reste."}, "🗑️ Purger les évaluations"),
        h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-purger&tout=1", title:"Met tout le QCM à la corbeille, après une confirmation. La démo reste."}, "🗑️ Tout purger"))));
}
function ScImporterV(){ return h(ScImporterVC); }
function ScImporterVC(){
  var s = useState(null), err = s[0], setErr = s[1], ref = React.useRef(null);
  return Fenetre(SauvegardeV(), "📤 Importer un snapshot ?", "Il remplace tout le QCM : évaluations, séances, réponses.",
    h(F, null, h("p", null, "Le QCM d'aujourd'hui part d'abord à la corbeille, gardé un an : rien n'est perdu."),
      h("input", {type:"file", accept:".json,application/json", ref:ref, style:{display:"none"}, onChange:function(e){ var f = e.target.files && e.target.files[0]; if(!f) return;
        var rd = new FileReader(); rd.onload = function(x){ try { importerSnapshot(String(x.target.result)).then(function(){ versScene("c-sauvegarde"); }, function(er){ setErr(String(er && er.message || er)); }); } catch(ex){ setErr(ex.message); } }; rd.readAsText(f); }}),
      err && h("p", {className:"fen-alerte"}, "❌ Fichier invalide : " + err)),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-sauvegarde", title:"N'importe rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-primary", "data-local":"1", title:"Choisis le fichier, puis il remplace le QCM ; l'ancien part à la corbeille.", onClick:function(){ if(ref.current) ref.current.click(); }}, "📤 Choisir le fichier et importer")], "c-sauvegarde");
}
function ScPurgerV(){
  var tout = paramHash("tout") === "1";
  return Fenetre(SauvegardeV(), tout ? "🗑️ Tout purger ?" : "🗑️ Purger les évaluations ?", tout ? "Tout le QCM part à la corbeille, gardé un an : évaluations, séances, réponses." : "Toutes les évaluations partent à la corbeille, gardées un an.",
    h(F, null, h("p", null, tout ? "La démo reste." : "Leurs séances gardent leurs notes."),
      h("p", {className:"fen-note"}, "Pense à exporter un snapshot avant.")),
    [h("button", {key:1, className:"btn btn-ghost", "data-va":"c-sauvegarde", title:"Ne purge rien."}, "Annuler"),
     h("button", {key:2, className:"btn btn-rouge", "data-local":"1", title:tout ? "Met tout le QCM à la corbeille, sauf la démo." : "Met toutes les évaluations à la corbeille, sauf la démo.", onClick:function(){ (tout ? purgerTout() : purgerEvaluations()).then(function(){ versScene("c-sauvegarde"); }); }}, "🗑️ Purger")], "c-sauvegarde");
}

/* ════════ [QCM-3] Mes écrans, branchés : avec la base, ils la lisent ; sans base (l'assemblage de la maquette), ils restent ceux de la maquette ════════ */
// une erreur dans un de mes écrans ne fait pas tomber la page : l'écran se redessine au prochain changement de la base
function GardeV(p){ React.Component.call(this, p); this.state = {err:null}; }
GardeV.prototype = Object.create(React.Component.prototype); GardeV.prototype.constructor = GardeV;
GardeV.getDerivedStateFromError = function(e){ return {err:e}; };
GardeV.prototype.componentDidCatch = function(e){ var self = this; if(window.console) console.warn("[QCM-3]", e && e.message); var f = function(){ V3S.abonnes = V3S.abonnes.filter(function(g){ return g !== f; }); self.setState({err:null}); }; V3S.abonnes.push(f); };
GardeV.prototype.render = function(){ return this.state.err ? h("div", {className:"card"}, h("p", null, "Chargement…")) : this.props.children; };
function vivantOu(vivant, maquette){ return function(){ return v3db() ? h(GardeV, {key:location.hash}, vivant.apply(null, arguments)) : maquette.apply(null, arguments); }; }
var ECRANS_SOIR_V = {
  "c-seances":function(){ return ListeSeancesVue(null); }, "c-seances-lues":function(){ return ListeSeancesVue(null); }, "c-copies-rendues":function(){ return ListeSeancesVue(null); },
  "c-resultats":ResultatsVue, "c-resultats-rendues":ResultatsVue, "c-fiche":ScFicheV, "c-fiche-retire":ScFicheV, "c-fiche-garde":ScFicheGardeV, "c-que-dit-la-feuille":ScQueDitV,
  "c-rendre":ScRendreV, "c-corbeille":CorbeilleSeanceV, "c-sauvegarde":SauvegardeV, "c-importer":ScImporterV, "c-purger":ScPurgerV, "x632-pdf":PdfApercuV,
  "e-mes-evals":MesEvaluationsV, "e-mes-evals-rendue":MesEvaluationsV, "e-bilan-lou":BilanRenduV
};
Object.keys(ECRANS_EVALS_V).forEach(function(id){ ECRANS_SOIR_V[id] = ECRANS_EVALS_V[id]; });
Object.keys(ECRANS_SOIR_V).forEach(function(id){ var sc = sceneParId(id); if(sc) refaire(id, vivantOu(ECRANS_SOIR_V[id], sc.render)); });
var ECRANS_SOIR = Object.keys(ECRANS_SOIR_V);
PdfApercu = vivantOu(PdfApercuV, PdfApercu);
// les points d'entrée, pour les pages du socle (DEMANDES.md, QCM-3 → QCM-1)
function EcranConsoleSoir(id){ var f = ECRANS_SOIR_V[id]; return f ? h(GardeV, {key:location.hash}, f()) : null; }
function EcranMesEvaluations(){ return paramHash("seance") ? BilanRenduV() : MesEvaluationsV(); }

/* ════════ [QCM-3] La séance sur papier : les énoncés, « Feuilles ramassées », la grille du soir (papier/<slug>/<qi> : « j » ou « f ») ════════ */
function seancePapierV(){ var id = seanceParam() || (SCN.LIVE && SCN.sid && SCN.sid()); var se = id ? seanceV(id) : null; if(se && se.papier) return se;
  return seancesV().filter(function(x){ return x.papier && !x.terminee; }).sort(function(a, b){ return b.ms - a.ms; })[0] || null; }
function PapierSeanceV(){ return Console("pilotage", "pilot", h(PapierSeanceVC), true); }
function PapierSeanceVC(){
  useV3();
  var se = seancePapierV(); if(!se) return h("div", {className:"card"}, h("p", null, "Chargement…"));
  var ev = se.ev, sq = "&seance=" + encodeURIComponent(se.id);
  return h("div", {className:"card"},
    TitreCarte(h(F, null, "📄 Séance sur papier — " + ev.titre + " — " + se.classe, InfoI("Sur papier, chacun répond seul sur sa feuille, avec les énoncés imprimés, sans tablette. Tu ramasses les feuilles ; la séance se met en pause sans être finie. Le soir, tu remplis la grille ; à l'heure suivante, l'estimation, la seconde attestation et la correction se font sur les tablettes.")),
      [h("button", {key:1, className:"btn btn-rouge btn-sm", "data-va":"c-terminer" + sq}, "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status reflexion"}, "📄 Séance sur papier en cours — " + presentsTexteV(se), InfoIB("📄 Séance sur papier en cours", "Les élèves ont les énoncés seuls, sans les choix, et répondent sur leur feuille, seuls.")),
    h("div", {className:"papier-grid"},
      h("div", null,
        h("div", {className:"row"},
          h("button", {className:"btn btn-ghost", "data-local":"1", onClick:function(){ imprimerEnonces(se); }, title:"Montre la page des énoncés seuls, avec les points de chaque question, à imprimer pour la classe."}, "🖨️ Les énoncés à imprimer"),
          h("button", surClic(function(){ var p = SCN.LIVE && typeof ACT !== "undefined" && ACT.finirAutreHeure ? Promise.resolve(ACT.finirAutreHeure()) : Promise.resolve(); return p.then(function(){ versScene("c-papier-grille" + sq); }); },
            {className:"btn btn-or", title:"Tu as ramassé les feuilles : la séance se met en pause sans être finie. Le soir, tu remplis la grille d'après les feuilles."}), "⏸️ Feuilles ramassées : finir à une autre heure"))),
      h("div", {className:"pilot-overview"}, h("h3", null, "📋 Toutes les questions", InfoI("Les questions de l'évaluation, avec leurs bonnes réponses : sur papier, elles ne se posent pas une à une.")),
        ev.questions.map(function(q, qi){ return h("div", {key:qi, className:"pilot-q-mini"}, h("div", {className:"pilot-q-mini-head"}, h("span", {className:"pilot-q-mini-num"}, "Q" + (qi+1)), h("span", {className:"pilot-q-mini-niv niv-" + q.niveau}, NIV[q.niveau].label)), h("div", {className:"pilot-q-mini-enonce"}, q.enonce), h("div", {className:"pilot-q-mini-bonnes"}, ChoixTexte(q))); }))));
}
// la page des énoncés seuls, avec les points, dans une fenêtre à imprimer
function imprimerEnonces(se){
  var ev = se.ev, w = window.open("", "enonces-qcm"); if(!w) return;
  var html = "<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'><title>" + escPdf(ev.titre) + "</title>" + Array.prototype.map.call(document.querySelectorAll("style"), function(s){ return s.outerHTML; }).join("") + "</head><body class='vue-eleve'>" +
    "<div class='bilan-imprime'><div class='bilan-imprime-page enonces-p'><h2>" + escPdf(ev.titre) + "</h2><div class='enonces-classe'>" + escPdf(se.classe) + " · " + se.date + "</div>" +
    ev.questions.map(function(q, i){ return "<div class='enonce-p'><strong>Question " + (i + 1) + " · " + (q.bonus ? "bonus" : "1 pt") + "</strong><div>" + escPdf(q.enonce) + "</div></div>"; }).join("") + "</div></div></body></html>";
  w.document.open(); w.document.write(html); w.document.close(); setTimeout(function(){ try { w.focus(); w.print(); } catch(e){} }, 400);
}
function caseGrille(se, slug, qi){ var g = ((se.S.papier || {})[slug] || {})[qi]; return g == null ? null : g === "j" || g === true || g === 1 ? "j" : "f"; }
function ecrireCase(se, slug, qi, v){ if(SCN.LIVE && typeof ACT !== "undefined" && ACT.grillePapier) return Promise.resolve(ACT.grillePapier(slug, qi, v, se.id)); return v3Set(v3Q("sessions/" + se.id + "/papier/" + slug + "/" + qi), v); }
function GrillePapierV(p){
  var se = p.se, ev = se.ev, eleves = se.presents;
  return h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet papier-grille"},
    h("thead", null, h("tr", null, h("th", {className:"eleve-col"}, "Élève"), ev.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i+1)); }), h("th", null, "Note"), h("th", null, "Sur 20"))),
    h("tbody", null, eleves.map(function(e){
      var l = ev.questions.map(function(q, i){ return caseGrille(se, e.slug, i) || "f"; }), note = l.filter(function(x){ return x === "j"; }).length, total = ev.questions.filter(function(q){ return !q.bonus; }).length;
      return h("tr", {key:e.slug, "data-eleve":e.slug}, h("td", {className:"eleve-cell"}, e.nom),
        l.map(function(x, i){ return h("td", {key:i, className:x === "j" ? "cell-juste" : "cell-faux"}, h("button", {className:"case-grille", "data-local":"1", title:"La feuille " + deNom(prenomDeNom(e.nom)) + ", question " + (i+1) + " : un clic bascule entre ✓ (juste) et ✗ (faux).", onClick:function(){ ecrireCase(se, e.slug, i, x === "j" ? "f" : "j"); }}, x === "j" ? "✓" : "✗")); }),
        h("td", {className:"score-cell"}, note + "/" + total), h("td", {className:"score-cell"}, fr1(total ? Math.min(20, note * 20 / total) : 0)));
    }))));
}
function PapierGrilleV(){ return Console("donnees", "results", h(PapierGrilleVC), false); }
function PapierGrilleVC(){
  useV3();
  var se = seancePapierV();
  // une case jamais cliquée vaut ✗ : la grille s'écrit entière dès qu'elle s'ouvre, pour que la note de chacun existe
  useEffect(function(){ if(!se) return; var u = {}; se.presents.forEach(function(e){ se.ev.questions.forEach(function(q, i){ if(caseGrille(se, e.slug, i) == null) u["papier/" + e.slug + "/" + i] = "f"; }); }); if(Object.keys(u).length) v3Update(v3Q("sessions/" + se.id), u); }, [se ? se.id : null]);
  if(!se) return h("div", {className:"card"}, h("p", null, "Chargement…"));
  return h("div", {className:"card"},
    TitreCarte("📄 " + se.ev.titre + " — " + se.classe + " — sur papier", [
      h("button", {key:0, className:"btn btn-primary btn-sm", "data-va":"c-lancer", title:"Ta grille est remplie : la séance se reprend à l'heure suivante, pour la correction sur les tablettes."}, "💾 Grille remplie"),
      h("button", {key:2, className:"btn btn-ghost btn-sm", "data-va":"c-seances", title:"Revient à la liste des séances ; la grille est gardée telle quelle."}, "← Retour")]),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, se.date + " " + se.heure + " · sur papier · " + presentsTexteV(se)),
    h(GrillePapierV, {se:se}));
}

/* ════════ [QCM-3] Le rattrapage : la classe et l'évaluation du lancement ; seuls ceux qui ne sont pas encore notés la passent ════════ */
function RattrapageV(){ return Console("pilotage", "pilot", h(F, null, h(RattrapageVC), SessionsPrecedentes()), false); }
function RattrapageVC(){
  useV3();
  var c = classeDuLancement(), evId = typeof LANCEMENT !== "undefined" ? LANCEMENT.evalId : null, ev = evalV(evId);
  var passees = seancesV().filter(function(se){ return memeClasse(se, c) && se.ev && se.ev.id === evId && se.terminee && !se.demo; }).sort(function(a, b){ return a.ms - b.ms; });
  var notes = {}; passees.forEach(function(se){ se.presents.forEach(function(e){ notes[e.slug] = 1; }); });
  var cl = v3Eleves(c, c), seuls = cl.eleves.filter(function(e){ return !notes[e.slug]; }), se0 = passees[0];
  if(!ev || !se0) return h("div", {className:"card"}, h("p", null, "Chargement…"));
  return h("div", {className:"card"},
    h("h2", null, "🎯 Lancer une nouvelle séance", InfoI("Un rattrapage se lance comme une séance : la classe, la même évaluation ; seuls ceux qui ne sont pas encore notés la passent.")),
    h("div", {className:"lancer-grid"},
      h("div", null,
        h("div", {className:"field"}, h("label", null, "Classe", InfoI("Les classes de la console MJPC.")), h("select", {value:"c", readOnly:true, title:"La classe de la séance."}, h("option", {value:"c"}, cl.libelle + " (" + cl.eleves.length + " élèves)"))),
        h("div", {className:"field"}, h("label", null, "Évaluation", InfoI("L'évaluation déjà passée par la classe : « 🔁 » la marque comme rattrapage.")), h("select", {value:"e", readOnly:true, title:"L'évaluation de la séance."}, h("option", {value:"e"}, "🔁 " + ev.titre))),
        h("div", {className:"rattrapage-box"}, h("strong", null, "🔁 Rattrapage."), " " + cl.libelle + " a déjà passé cette évaluation le " + se0.date.slice(0, 5) + ".", InfoIB("🔁 Rattrapage", "Cette séance ne servira jamais de « QCM précédent » pour les binômes. Un élève déjà noté garde la note de sa première séance.")),
        h("div", {className:"duree-box"}, texteDureeV(ev, true)),
        h("button", {className:"btn btn-primary", disabled:!seuls.length, title:seuls.length ? "Ouvre l'appel du rattrapage : seuls les élèves pas encore notés sont proposés." : "Tous les élèves de la classe sont déjà notés à cette évaluation."}, "🚀 Lancer le rattrapage")),
      h("div", {className:"binomes-box"},
        h("div", {className:"tt"}, "📱 Binômes proposés — d'après les exclusions, puis le QCM précédent", InfoI("Comme pour une séance : d'abord les exclusions de MJPC, puis la règle du QCM. Plus de placement libre.")),
        h("div", {className:"ss"}, "Pas encore noté à cette évaluation : " + (seuls.map(function(e){ return e.nom; }).join(", ") || "personne") + (seuls.length ? " (absent le " + se0.date.slice(0, 5) + ")." : "."), seuls[0] && InfoIB(seuls[0].nom, "Seul, il fait lui-même la lecture de sa feuille à la correction ; il n'a pas de co-évaluation.")),
        h(GrilleBinomes, {paires:seuls.map(function(e){ return [e.nom, null]; })}))));
}
function texteDureeV(ev, seul){
  var d = dureeEstimeeV(ev, seul), D = dureesV(), mn = function(s){ var m = Math.floor(s / 60), r = Math.round(s % 60); return m + " min" + (r ? " " + r + " s" : ""); };
  return h(F, null, "⏱️ ", h("strong", null, "Durée estimée : " + d.min + " min"), InfoIB("⏱️ Durée estimée", "Installation et consignes " + mn(D.installation) + " ; questions " + mn(d.questions) + " (pour chacune : la réflexion, puis " + (seul ? "un tour de " : "deux tours de ") + D.decompte + " s de décompte, de réponse et de " + D.b + " s où l'élève dit si sa feuille dit la même chose que son clic, puis " + D.entre + " s) ; estimation et seconde attestation " + mn(D.estimAttest) + " ; correction " + mn(d.correction) + " (" + mn(D.correctionParQ) + " par question)" + (seul ? "" : " ; co-évaluation et bilan " + mn(D.coevalBilan)) + "."), h("br"), h(TientV, {d:d.min}));
}
ECRANS_SOIR_V["c-papier-grille"] = PapierGrilleV; ECRANS_SOIR_V["c-papier-seance"] = PapierSeanceV; ECRANS_SOIR_V["c-rattrapage"] = RattrapageV;
["c-papier-grille", "c-papier-seance", "c-rattrapage"].forEach(function(id){ var sc = sceneParId(id); if(sc) refaire(id, vivantOu(ECRANS_SOIR_V[id], sc.render)); if(ECRANS_SOIR.indexOf(id) < 0) ECRANS_SOIR.push(id); });
Rattrapage = vivantOu(RattrapageV, Rattrapage);

// le mode test (maquette620.js) : ses trois scènes sont un seul écran, la vraie séance de la classe de test
["x620-1-mode-test-ouverture", "x620-2-mode-test-reflexion", "x620-3-mode-test-en-grand"].forEach(function(id){ ECRANS_SOIR_V[id] = ModeTestV; var sc = sceneParId(id); if(sc) refaire(id, vivantOu(ModeTestV, sc.render)); if(ECRANS_SOIR.indexOf(id) < 0) ECRANS_SOIR.push(id); });
// hors séance, une tablette dessine ses moitiés par la page du socle (TabletteLive) : « 📊 Mes évaluations » y paraît comme pendant la séance,
// la moitié se reconnaissant tablette par APPAREIL_H (c3-tablettes.js, Page) ; l'élève chez lui y retrouve ses évaluations
(function(){ var v; try { Object.defineProperty(window, "APPAREIL_H", {configurable:true, set:function(x){ v = x; },
  get:function(){ if(v) return v; try { return typeof LIVE !== "undefined" && LIVE.appareil && LIVE.appareil() === "tablette" ? "tablette" : undefined; } catch(e){ return undefined; } }}); } catch(e){} })();

function FicheAncienneV(se, slug, r, mt, au, comps, e, sq, nom, il, pre){
  var ev = se.ev;
  return h("div", {className:"student-report", "data-eleve":slug, "data-seance":se.id},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}},
      h("h3", null, "👤 " + nom + " — " + fr1(r.n) + " / " + r.total + " · " + fr1(r.sur20) + " / 20 · " + mt.em + " " + mt.lib),
      h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-resultats" + sq, title:"Ferme la fiche et revient au tableau de la séance."}, "✕ Fermer")),
    h("div", {className:"fiche-head fiche-head-c"}, h("span", null, ""), h("span", null, "Question"), h("span", null, "Bonne réponse"), h("span", null, "Points")),
    ev.questions.map(function(q, qi){
      var corr = (r.corrigees || []).indexOf(qi) >= 0, l = lectureV(se, qi, slug);
      return h("div", {key:qi, className:"fiche-q fiche-q-c"},
        h("span", {className:"num"}, "Q" + (qi+1)),
        h("span", null, q.enonce, (q.competences || []).length > 0 && h("div", {className:"fiche-comp"}, "🧩 " + q.competences.join(" · ")),
          corr && h("div", null, h("span", {className:"flag ok"}, l && l.par === "prof" ? "Corrigé d'après sa feuille : " + choixTexteV(q, l.choix) : "Corrigé d'après sa feuille")),
          h("div", null, h("button", {className:"btn btn-ghost btn-sm", "data-va":"c-que-dit-la-feuille" + e + "&q=" + (qi + 1), title:"Ouvre les choix de la question " + (qi + 1) + " : tu cliques ce que dit sa feuille, et sa note se recalcule (« Corrigé d'après ta feuille » dans son bilan)."}, "La feuille dit autre chose"))),
        h("span", {className:"val"}, choixTexteV(q, q.bonnes)),
        h("span", {className:"pts"}, r.st[qi] === "x" ? "—" : fr1(r.pts[qi] || 0) + " pt"));
    }),
    h("div", {className:"fiche-comps"}, h("div", {className:"tt"}, "🧩 Ses compétences"),
      comps.map(function(c){ var n = niveauComp(r, c), x = r.comp[c] || {n:0, max:0};
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, libOff(c)), h("span", {className:"d"}, compQuestionsEv(c, ev).map(function(i){ return "Q" + (i+1) + " " + marque(r.st[i]); }).join(" · ") + " → " + fr1(x.n) + "/" + x.max), h("span", {className:"maitrise-pill " + n.cls}, n.em + " " + n.lib)); }),
      ["tr-personne-03", "tr-methodes-02"].map(function(c){
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, libOff(c)), h("span", {className:"d"}, "le point d'autonomie"),
          h("span", {className:"maitrise-pill " + (au.retire ? "mt-rouge" : "mt-vert")}, au.retire ? maitriseV(0).em + " " + maitriseV(0).lib : maitriseV(20).em + " " + maitriseV(20).lib));
      }),
      h("div", {className:"fiche-auto"}, au.retire
        ? h(F, null, h("span", null, "⛔ Point d'autonomie retiré " + au.quand + "."), h("button", surClic(function(){ return rendreAutonomieV(se, slug); }, {className:"btn btn-vert btn-sm", title:"Rend son point d'autonomie à " + pre + " : ses deux compétences d'autonomie repassent en Très bonne maîtrise."}), "↩️ Rendre"))
        : h(F, null, h("span", null, (il === "elle" ? "Elle" : "Il") + " a gardé son point d'autonomie."), h("button", {className:"btn btn-rouge btn-sm", "data-va":"c-fiche-garde" + e, title:"Demande une confirmation, puis retire son point d'autonomie : ses deux compétences d'autonomie passent en Maîtrise insuffisante. La note ne bouge pas. « ↩️ Rendre » le défait."}, "⛔ Retirer le point d'autonomie")))));
}

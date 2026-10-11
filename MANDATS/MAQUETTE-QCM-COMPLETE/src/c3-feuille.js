/* ═══════════════ Complément 3 — « Que dit la feuille ? », une seule fenêtre pour les trois cas (changements 4.4, 7, 8.3) ═══════════════
   La co-évaluation de l'évaluation d'essai (c-coeval-feuille), le cas ambigu de la 3e (x610-feuille) et la fiche du soir (c-que-dit-la-feuille) :
   rien n'est coché d'avance (la fenêtre ne dit pas à Paul ce que dit la feuille, relecteur n°181) ; chaque choix porte ce qu'on en sait
   (« bonne réponse », « lu par Julien », « Michel », relecteur n°182) ; plusieurs choix se cochent quand la question en a plusieurs ;
   la dernière case s'appelle « Sa feuille ne dit aucun de ces choix », comme ailleurs (relecteurs n°220, 283) ;
   « Valider » applique ce qui est coché, et l'écran d'arrivée le dit (« &lu= »). */
function luParam(){ var v = paramHash("lu"); return v == null || v === "" ? null : v === "aucun" ? "aucun" : v.split("-").map(Number); }
function memesChoix(a, b){ return a !== "aucun" && b !== "aucun" && JSON.stringify([].concat(a).sort()) === JSON.stringify([].concat(b).sort()); }
function listeEt(t){ return t.length > 1 ? t.slice(0, -1).join(", ") + " et " + t[t.length - 1] : t.join(""); }
function QdfFenetre(o){ return h(QdfFenetreC, o); }
function QdfFenetreC(o){
  var s = useState([]), sel = s[0], set = s[1], q = o.q, plusieurs = q.bonnes.length > 1;
  function basculer(i){
    if(i === "aucun"){ set(sel === "aucun" ? [] : "aucun"); return; }
    var a = sel === "aucun" ? [] : sel.slice(), k = a.indexOf(i);
    if(k >= 0) a.splice(k, 1); else if(plusieurs) a.push(i); else a = [i];
    set(a.sort(function(x, y){ return x - y; }));
  }
  var rien = sel !== "aucun" && !sel.length, code = sel === "aucun" ? "aucun" : sel.join("-");
  var nomCourt = o.p, lettre = o.lettres ? function(i){ return LET[i] + " · "; } : function(){ return ""; };
  return h(F, null, o.fond, h("div", {className:"checkin-overlay", "data-echap":o.fermer},
    h("div", {className:"checkin-modal", style:{maxWidth:o.lettres ? "620px" : "460px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "Que dit la feuille ?"), h("div", {className:"checkin-sub"}, o.nom + " — Q" + (o.qi + 1) + " · " + q.enonce)),
      h("div", {style:{padding:".6rem 1.2rem 0", fontSize:".85rem", color:"var(--gris)"}}, o.texte),
      h("div", {className:"qdf-choix qdf-etat"},
        q.choix.map(function(c, i){
          var tg = [q.bonnes.indexOf(i) >= 0 ? "bonne réponse" : null, o.lu !== "aucun" && o.lu && o.lu.indexOf(i) >= 0 ? "lu par " + o.voisin : null,
            o.ecrit && o.ecrit.indexOf(i) >= 0 ? nomCourt : null].filter(Boolean).join(" · ");
          var on = sel !== "aucun" && sel.indexOf(i) >= 0;
          return h("div", {key:i, className:"qdf-c" + (on ? " sel" : ""), role:"button", tabIndex:0, "aria-pressed":on,
            title:on ? "Coché : la feuille " + deNom(o.p) + " dit « " + c + " ». Un second clic le décoche." : "Coche-le si la feuille " + deNom(o.p) + " dit « " + c + " »" + (plusieurs ? ", avec les autres choix qu'elle dit." : "."),
            onClick:function(){ basculer(i); }}, h("span", null, lettre(i) + c), h("span", {className:"tg"}, tg));
        }),
        h("div", {className:"qdf-c aucun" + (sel === "aucun" ? " sel" : ""), role:"button", tabIndex:0, "aria-pressed":sel === "aucun",
          title:sel === "aucun" ? "Coché : sa feuille ne dit aucun de ces choix. Un second clic le décoche." : "Coche-le si la feuille " + deNom(o.p) + " ne dit aucun de ces choix.",
          onClick:function(){ basculer("aucun"); }}, h("span", null, "Sa feuille ne dit aucun de ces choix"), h("span", {className:"tg"}, o.lu === "aucun" ? "lu par " + o.voisin : ""))),
      h("div", {className:"checkin-actions"},
        h("button", {className:"btn btn-ghost", "data-va":o.fermer, title:"Ferme sans rien changer" + (o.alerte ? " : l'alerte reste ouverte." : ".")}, "Annuler"),
        h("button", {className:"btn btn-primary", disabled:rien, "data-va":rien ? null : o.valider(code),
          title:rien ? "Fermé tant que rien n'est coché : coche d'abord ce que dit la feuille " + deNom(o.p) + "." : "Applique ce que tu as coché : la question " + (o.qi + 1) + " " + deNom(o.p) + " se recalcule d'après sa feuille" + (o.alerte ? ", et l'alerte se ferme." : ".")}, "Valider")))));
}
// la co-évaluation de l'évaluation d'essai : Michel, question 1
function ScCoevalFeuille(){
  var q = EV.questions[0];
  return QdfFenetre({fond:PilotCoevalE(false), p:"Michel", nom:"DUVERNAY Michel", voisin:"Julien", qi:0, q:q, lu:SCN.LU_JM.M[0], ecrit:[2], alerte:true,
    texte:"Julien y a lu Venise ; Michel dit avoir écrit Rome. Clique sur ce que dit sa feuille.", fermer:"c-coeval-attente",
    valider:function(code){ return "c-coeval-tranche&dec=feuille&lu=" + code; }});
}
// le cas ambigu de la 3e : Michel, question 3
function ScFeuille3(){
  var q = EV3.questions[QI3], M3 = S3.M;
  return QdfFenetre({fond:PilotCoeval3(), p:"Michel", nom:"DUVERNAY Michel", voisin:"Julien", qi:QI3, q:q, lu:M3.lu, ecrit:M3.rechoix, alerte:true, lettres:true,
    texte:"Julien y a lu " + lettres(M3.lu) + " ; Michel dit avoir écrit " + lettres(M3.rechoix) + ". Clique sur ce que dit sa feuille.", fermer:"x610-8-console-alerte",
    valider:function(code){ return "x610-tranche&dec=feuille&lu=" + code; }});
}
// le soir, depuis la fiche de l'élève cliqué
function ScQueDitLaFeuille(){
  var p = paramEleve("Michel"), qi = paramQ(3), q = EV.questions[qi], v = SCN.voisinDe(p), e = "&eleve=" + encodeURIComponent(p);
  var cle = p === "Julien" ? "J" : p === "Michel" ? "M" : null, lu = cle ? SCN.LU_JM[cle][qi] : SCN.choixDe(SCN.LU[p][qi], qi);
  return QdfFenetre({fond:ScFiche(false), p:p, nom:nomDe(p), voisin:v, qi:qi, q:q, lu:lu, ecrit:null,
    texte:(v ? v + " a lu « " + choixTexte(q, lu) + " »." : "") + " Clique sur ce que dit sa feuille.", fermer:"c-fiche" + e,
    valider:function(code){ return "c-fiche" + e + "&q=" + (qi + 1) + "&lu=" + code; }});
}
// ce que dit la feuille, en lettres (la 3e) ou en mots (l'évaluation d'essai)
function feuilleDit(q, lu, enLettres){ return lu === "aucun" ? "aucun de ces choix" : listeEt(lu.map(function(i){ return enLettres ? LET[i] : q.choix[i]; })); }

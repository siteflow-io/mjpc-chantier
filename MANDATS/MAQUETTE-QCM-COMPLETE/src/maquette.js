/* Maquette du flux binôme — QCM (tour 598). React 17 UMD, sans JSX, comme l'app.
   Données inventées : une évaluation de 3 questions, la classe « 3 ESSAI » de la fausse classe. */
var h = React.createElement, F = React.Fragment;
var DECO = ["⭐","🎯","✨","💡","🎲","🔥"];
function P(t){ return t; }          // tour 603 : tous les textes vus par l'élève sont donnés par Paul (393 à 400) ; plus de souligné provisoire
function InfoI(texte, ouvert){ return h("span", {className:"info-i" + (ouvert ? " ouvert" : "")}, "i", texte ? h("span", {className:"info-tip"}, texte) : null); }

var CLASSE = "3 ESSAI";
var EV = {titre:"Évaluation d'essai — 3 questions", mode:"strict", questions:[
  {enonce:"Quelle est la capitale de l'Italie ?", choix:["Milan","Naples","Rome","Venise"], bonnes:[2], niveau:"facile", reflexion:20, reponse:15,
   competences:["c4-culture-01","c4-lire-01"], explication:"Rome est la capitale de l'Italie depuis 1871."},
  {enonce:"Lesquelles sont des capitales européennes ?", choix:["Madrid","Genève","Berlin","Sydney"], bonnes:[0,2], niveau:"standard", reflexion:30, reponse:20,
   competences:["c4-culture-01","c4-lire-01"], explication:"Madrid (Espagne) et Berlin (Allemagne) sont des capitales. Genève n'est pas la capitale de la Suisse (c'est Berne), et Sydney est en Australie."},
  {enonce:"Combien de pattes a une araignée ?", choix:["6","8","10","4"], bonnes:[1], niveau:"facile", reflexion:20, reponse:15,
   competences:["c4-culture-01","c4-lire-01"], explication:"Une araignée a 8 pattes : ce n'est pas un insecte (les insectes en ont 6)."}
]};
var NIV = {facile:{label:"Facile",color:"#FFE066"}, standard:{label:"Standard",color:"#FF9933"}, approfondi:{label:"Approfondi",color:"#E63946"}, expert:{label:"Expert",color:"#6B0F1A"}};
var COMP = {
  "c4-culture-01":"Mobiliser des références culturelles pour interpréter les textes…",
  "c4-lire-01":"Contrôler sa compréhension, devenir un lecteur autonome"
};
var COMP_COURT = {"c4-culture-01":"Mobiliser des références culturelles…", "c4-lire-01":"Contrôler sa compréhension…"};
function compQuestions(c){ var l = []; EV.questions.forEach(function(q, i){ if(q.competences.indexOf(c) >= 0) l.push(i); }); return l; }
var COMPS = ["c4-culture-01", "c4-lire-01"];
function niveauComp(r, c){ var x = r.comp[c]; return maitriseDe(x.n * 20 / x.max); }
function detailComp(r, c){ return compQuestions(c).map(function(i){ return "Q" + (i+1) + " " + marque(r.st[i]); }).join(" · "); }
function PillComp(r, c){ var m = niveauComp(r, c); return h("span", null, h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib), h("div", {className:"comp-det"}, detailComp(r, c))); }
function EnteteComp(c){ return h("th", {key:c, className:"comp-col"}, "🧩 " + c, h("div", {className:"thq"}, COMP_COURT[c] + " · " + compQuestions(c).map(function(i){ return "Q" + (i+1); }).join(", "))); }
function marque(s){ return s === "j" ? "✓" : s === "t" ? "＋" : "✗"; }
var MAITRISE = [
  {k:"vert", em:"🟢", lib:"Très bonne maîtrise", cls:"mt-vert"},
  {k:"bleu", em:"🔵", lib:"Maîtrise satisfaisante", cls:"mt-bleu"},
  {k:"orange", em:"🟠", lib:"Maîtrise fragile", cls:"mt-orange"},
  {k:"rouge", em:"🔴", lib:"Maîtrise insuffisante", cls:"mt-rouge"}
];
function maitriseDe(sur20){ return sur20 >= 15 ? MAITRISE[0] : sur20 >= 10 ? MAITRISE[1] : sur20 >= 5 ? MAITRISE[2] : MAITRISE[3]; }
function fr1(x){ return (Math.round(x*10)/10).toFixed(1).replace(".", ",").replace(",0", ""); }

/* ── Le binôme suivi ── */
var J = {cle:"J", nom:"ABRIAL Julien", prenom:"Julien", sexe:"M"};
var M = {cle:"M", nom:"DUVERNAY Michel", prenom:"Michel", sexe:"M"};
var ORD = [ {J:[0,1,2,3], M:[3,2,0,1]}, {M:[0,1,2,3], J:[1,0,3,2]}, {J:[0,1,2,3], M:[3,2,1,0]} ];   // ordre vu par chacun (74, 329)
var PREMIER = ["J","M","J"];                                                                   // alternance (25)
var TABL = {J:[[2],[0,2],[0]], M:[[3],[0,1,2],[2]]};                                           // ce sur quoi ils cliquent sur la tablette
var FEUI = {J:[[2],[0],[0]], M:[[2],[0,1,2],"aucun"]};                                         // ce que dit leur feuille

/* ── La classe (24 présents, Adam absent) ── */
var PAIRES_AVANT = [["ABRIAL Julien","DUVERNAY Michel"],["BAUDRY Léa","CARRÉ Tom"],["ESNAULT Inès","FOUCHER Hugo"],["GALLOIS Manon","HÉBRARD Nathan"],
  ["ISAMBERT Chloé","JOUBERT Louis"],["LACOMBE Emma","MAILLARD Noah"],["NOGARET Zoé","OLLIVIER Sacha"],["PERRAUD Jade","QUINTON Enzo"],
  ["RAMBAUD Lina","SABATIER Malo"],["TESSIER Anna","VALLÉE Rayan"],["WEBER Clara","BRUNEAU Camille"],["CHEVALLIER Théo","YVON Adam"],["ZELLER Lou",null]];
var PAIRES = PAIRES_AVANT.slice(0, 11).concat([["CHEVALLIER Théo","ZELLER Lou"]]);
function pre(n){ return n ? n.split(" ").slice(1).join(" ") : ""; }
// tablette : J juste, F faux (aucune bonne), Y toutes les bonnes + une en trop, O une bonne sur deux
var RT = {Julien:"JJF", Michel:"FYF", "Léa":"JJJ", Tom:"FOJ", "Inès":"JJJ", Hugo:"JYJ", Manon:"JJF", Nathan:"JOJ", "Chloé":"JJJ", Louis:"JOJ", Emma:"JJJ", Noah:"JFF",
  "Zoé":"JJJ", Sacha:"FOF", Jade:"JYJ", Enzo:"JOF", Lina:"JJJ", Malo:"JFJ", Anna:"JOF", Rayan:"JYF", Clara:"JJJ", Camille:"JOF", "Théo":"JOJ", Lou:"JYF"};
// feuille, dite à la correction : J juste, F faux, A « aucun de ces choix », - rien dit avant la révélation
var RF = {Julien:"JFF", Michel:"JFA", "Léa":"JJJ", Tom:"FFJ", "Inès":"JJJ", Hugo:"JFJ", Manon:"JJF", Nathan:"JFJ", "Chloé":"JJJ", Louis:"JFJ", Emma:"JJJ", Noah:"JFF",
  "Zoé":"JFJ", Sacha:"FFF", Jade:"JFJ", Enzo:"AFF", Lina:"JJJ", Malo:"JFJ", Anna:"JFF", Rayan:"JFF", Clara:"JJJ", Camille:"JJF", "Théo":"JFF", Lou:"JFJ"};
var ESTIM = {Julien:"bleu", Michel:"vert"};
var ORDRE_CORR = [1, 2, 0];   // la correction commence par la question la plus ratée sur les tablettes (l'app d'aujourd'hui)

/* La règle de note (288 à 293, 303, 332) */
function calc(p){
  var t = RT[p], f = RF[p], used = false, pts = [], st = [], flags = [];
  for(var q = 0; q < 3; q++){
    var fc = f[q], tc = t[q];
    if(fc === "-"){ pts.push(null); st.push("pasdit"); flags.push({q:q, txt:"pas de recopie"}); continue; }
    if(fc === "J"){ pts.push(1); st.push("j"); if(tc !== "J") flags.push({q:q, txt:"recopie juste, tablette fausse"}); continue; }
    if(fc === "A"){ flags.push({q:q, txt:"aucun de ces choix"}); pts.push(0); st.push("a"); continue; }   // « aucun de ces choix » vaut toujours 0 (477, 490)
    if(tc === "J" && !used){ used = true; pts.push(1); st.push("t"); continue; }
    pts.push(0); st.push(fc === "A" ? "a" : "f");
  }
  var complet = pts.indexOf(null) < 0;
  var n = pts.reduce(function(a, b){ return a + (b || 0); }, 0);
  var comp = {};
  EV.questions.forEach(function(q, qi){ q.competences.forEach(function(c){ comp[c] = comp[c] || {n:0, max:0}; comp[c].max++; comp[c].n += (pts[qi] || 0); }); });
  return {pts:pts, st:st, flags:flags, n:n, complet:complet, sur20:n*20/3, comp:comp};
}

/* ════════════════════════ TABLETTE ════════════════════════ */
function Page(badge, titre, enfants){
  // (complément 1) « 📊 Mes évaluations » de la 7.7.1 (l. 2601 à 2603), sur chaque moitié où un élève est entré ; à côté de son nom,
  // et pas sous la séance comme dans la 7.7.1 : sur une demi-tablette, la place sous la carte est celle des choix (464)
  var mesEvals = badge && /^t-/.test(window.SCENE_COURANTE || "");
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card"},
      badge && (mesEvals ? h("div", {className:"eleve-tete"}, h("div", {className:"eleve-classe-badge"}, badge), h("button", {className:"btn btn-ghost btn-sm mes-evals"}, "📊 Mes évaluations"))
                         : h("div", {className:"eleve-classe-badge"}, badge)),
      titre && h("h1", null, titre),
      enfants));
}
function badgeDe(e){ return CLASSE + " · " + e.nom; }
function Tablette(g, d){ return h("div", {className:"tablette"}, h("div", {className:"moitie g"}, g), h("div", {className:"moitie d"}, d)); }
/* Le voile (431) : on nomme toujours l'élève ; « qu'il » ou « qu'elle », d'après le sexe déclaré dans MJPC (443).
   Au passage de la tablette (stylo), la moitié voilée dit d'abord « Michel, pose ton stylo. » */
function Voile(autre, stylo, moi){
  moi = moi || autreDe(autre);
  return h("div", {className:"voile"},
    stylo && h("div", {className:"eleve-pose-stylo"}, h("span", {className:"ic"}, "🖊️"), h("span", null, moi.prenom + ", pose ton stylo.")),
    h("div", {className:"vic"}, "🙈"),
    h("div", {className:"phr"}, moi.prenom + ", laisse la tablette à " + autre.prenom + " pour qu'" + (autre.sexe === "F" ? "elle" : "il") + " réponde sans que tu regardes."));
}
function autreDe(e){ return e.cle === "J" ? M : e.cle === "M" ? J : (e.voisin || M); }
function QHead(qi, sansPts){
  var q = EV.questions[qi];
  return h("div", {className:"eleve-q-header"},
    h("span", {className:"eleve-q-num"}, "Question " + (qi+1) + (sansPts ? "" : " / " + EV.questions.length)),
    h("span", {className:"eleve-q-pastille", style:{background:NIV[q.niveau].color, color:q.niveau === "facile" ? "#5C4500" : "#fff"}}, NIV[q.niveau].label),
    !sansPts && h("span", {className:"eleve-q-points-badge", title:"Nombre de points que vaut cette question"}, "1 pt"));
}
function Clavier(chiffres){
  function t(c, cls, w){ return h("span", {key:c + (cls||""), className:"tc" + (cls ? " " + cls : ""), style:w ? {minWidth:w} : null}, c); }
  function rg(a){ return h("div", {className:"rg"}, a); }
  if(chiffres) return h("div", {className:"clv", style:{maxWidth:250, margin:"6px auto 0"}},
    rg(["1","2","3"].map(function(c){ return t(c, null, 62); })), rg(["4","5","6"].map(function(c){ return t(c, null, 62); })),
    rg(["7","8","9"].map(function(c){ return t(c, null, 62); })), rg([t("⌫", null, 62), t("0", null, 62), t("✓", "ok", 62)]));
  return h("div", {className:"clv"},
    rg("azertyuiop".split("").map(function(c){ return t(c); })),
    rg("qsdfghjklm".split("").map(function(c){ return t(c); })),
    rg([t("⇧", null, 50)].concat("wxcvbn".split("").map(function(c){ return t(c); }), [t("’"), t("-"), t("⌫", null, 50)])),
    rg(["é","è","ê","ë","à","â","ç","ù","û","î","ô","œ"].map(function(c){ return t(c, "ac"); })),
    rg([t(","), t("."), t("?"), t("!"), t("espace", null, 180)]));
}
function EcrCombien(){
  return Page(null, "Combien êtes-vous sur cette tablette ?",
    h("div", {className:"combien"},
      h("button", {className:"btn btn-ghost"}, "👤 1 élève"),
      h("button", {className:"btn btn-primary"}, "👥 2 élèves")));
}
function EcrLogin(s){
  return Page(null, "👋 Identifie-toi", h("div", {className:"eleve-form"},
    h("input", {readOnly:true, value:s.code || "", placeholder:"Mon code (4 chiffres)", className:s.champ === "code" ? "focus" : "", style:{textAlign:"center", letterSpacing:".3em", fontWeight:700}}),
    h("input", {readOnly:true, value:s.prenom || "", placeholder:"Prénom", className:s.champ === "prenom" ? "focus" : ""}),
    h("input", {readOnly:true, value:s.nom || "", placeholder:"Nom", className:s.champ === "nom" ? "focus" : ""}),
    Clavier(s.champ === "code"),
    h("button", {className:"btn-accueil"}, "Entrer →")));
}
function EcrBinome(e, code){
  return Page(null, null, h("div", {style:{textAlign:"left"}},
    h("div", {style:{fontWeight:900, fontSize:"1.25rem", margin:"6px 0 10px", color:"var(--violet)"}}, "Ton binôme : " + e.nom),
    h("div", {style:{fontWeight:700}}, e.prenom + ", tape ton code à 4 chiffres :"),
    h("div", {className:"codebox"}, code.replace(/./g, "•")),
    Clavier(true),
    h("div", {style:{textAlign:"center"}}, h("button", {className:"btn-accueil"}, "Entrer")),
    h("div", {style:{marginTop:10, textAlign:"center"}}, h("button", {className:"btn btn-ghost btn-sm"}, "Pas là ? Choisir un autre élève"))));
}
var ATTEST = [
  "Pour chaque question, tu écris d'abord ta réponse en entier sur ta feuille, sans voir les choix.",
  "Quand « POSE TON STYLO » s'affiche, tu poses ton stylo. Chacun votre tour, vous cliquez sur votre réponse ; l'autre ne regarde pas.",
  "C'est ce que tu as écrit qui fait foi. À la correction, avant de voir la réponse, tu cliques sur le ou les choix qui disent la même chose que ta feuille. Les mots ne sont pas forcément les mêmes : c'est à toi de faire le rapprochement. Si c'est faux à l'écrit, le point ne t'est pas compté.",
  "Chaque question vaut 1 point.",
  "Les choix t'aident, par rapport à une question sans choix : on te laisse une chance. Une fois par évaluation, si ta feuille est fausse mais que tu as cliqué sur exactement la bonne réponse, la question compte quand même : elle est « Trouvée au dernier moment ».",
  "Je ramasse les feuilles à la fin."
];
function EcrAttest(e, coche){
  return Page(badgeDe(e), EV.titre, h("div", {className:"attest"},
    h("div", {className:"tt"}, "Avant de commencer, " + e.prenom),
    ATTEST.map(function(l, i){ return h("div", {key:i, className:"li"}, "• ", P(l)); }),
    h("div", {className:"coche"}, h("span", {className:"case" + (coche ? " on" : "")}, coche ? "✓" : ""), "J'ai lu et compris"),
    h("button", {className:"btn btn-primary", style:{opacity:coche ? 1 : .45}}, P("Je commence"))));
}
function EcrPret(e){
  return Page(badgeDe(e), EV.titre, h(F, null,
    h("div", {className:"etat-attente"}, "⏳ En attente du démarrage..."),
    h("div", {style:{fontSize:".8rem", color:"var(--gris)", marginTop:12}}, "Tu as lu et compris les consignes le 08/10/2026 à 10:04.")));
}
function EcrReflexion(e, qi, chrono){
  var q = EV.questions[qi];
  return Page(badgeDe(e), EV.titre, h("div", {className:"eleve-q-zone"},
    QHead(qi), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"eleve-q-consigne"}, "✍️ RÉDIGE TA RÉPONSE EN ENTIER SUR TA FEUILLE"),
    h("div", {className:"eleve-chrono"}, h("div", {className:"label"}, "Temps de réflexion"), h("div", {className:"v"}, chrono))));
}
/* Le passage (431) : « Pose ton stylo, Julien. Tu es prêt ? À toi dans 3 secondes », et le chiffre descend */
function EcrPassage(e, qi, sec){
  return Page(badgeDe(e), EV.titre, h("div", {className:"eleve-q-zone"},
    QHead(qi), h("div", {className:"eleve-q-enonce"}, EV.questions[qi].enonce),
    h("div", {className:"eleve-pose-stylo"}, h("span", {className:"ic"}, "🖊️"), h("span", null, "Pose ton stylo, " + e.prenom + ".")),
    h("div", {className:"passage"}, h("div", {className:"v"}, "Tu es prêt ? À toi dans " + (sec || 3) + " secondes"))));
}
function EcrReponse(e, qi, ordre, sel, chrono, ev){
  var q = (ev || EV).questions[qi];
  var long = q.choix.some(function(c){ return c.length > 40; });
  return Page(badgeDe(e), (ev || EV).titre, h("div", {className:"eleve-q-zone"},
    h("div", {className:"eleve-q-header"},
      h("span", {className:"eleve-q-num"}, "Question " + (qi+1) + " / " + (ev || EV).questions.length),
      h("span", {className:"eleve-q-pastille", style:{background:NIV[q.niveau].color, color:q.niveau === "facile" ? "#5C4500" : "#fff"}}, NIV[q.niveau].label),
      h("span", {className:"eleve-q-points-badge", title:"Nombre de points que vaut cette question"}, "1 pt")),
    h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"eleve-pose-stylo"}, h("span", {className:"ic"}, "🖊️"), h("span", null, e.prenom + ", pose ton stylo. Sélectionne maintenant ta réponse.")),
    h("div", {className:"eleve-chrono" + (chrono <= 2 ? " urgent" : "")}, h("div", {className:"label"}, "Temps de réponse"), h("div", {className:"v"}, chrono)),
    h("div", {className:"eleve-choix" + (long ? " long" : "")}, ordre.map(function(i){
      return h("button", {key:i, className:"eleve-choix-btn" + (sel.indexOf(i) >= 0 ? " selected" : "")}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"eleve-feedback" + (sel.length ? " valide" : "")}, sel.length ? "✅ Réponse enregistrée — tu peux encore la changer" : "💡 Clique sur le ou les choix qui correspondent à ta réponse.")));
}
function EcrAttente(e){ return Page(badgeDe(e), EV.titre, h("div", {className:"etat-attente"}, "⏳ Attends la prochaine question...")); }

function libFourchette(n){ return n + " bonne" + (n > 1 ? "s" : "") + " réponse" + (n > 1 ? "s" : "") + " sur 3"; }
var FOURCH = [{k:"vert", n:3}, {k:"bleu", n:2}, {k:"orange", n:1}, {k:"rouge", n:0}];
function EcrEstim(e, choix){
  var mt = function(k){ return MAITRISE.filter(function(m){ return m.k === k; })[0]; };
  var sel = choix && FOURCH.filter(function(f){ return f.k === choix; })[0];
  return Page(badgeDe(e), "🎯 Ton estimation", h(F, null,
    h("p", {className:"autoeval-intro"}, "Combien de bonnes réponses penses-tu avoir ? Clique sur ta réponse. Cette estimation sert à savoir si tu te surévalues, si tu te sous-évalues ou si tu t'évalues correctement."),
    !sel ? h("div", {className:"autoeval-fourchettes"}, FOURCH.map(function(f){
      return h("button", {key:f.k, className:"autoeval-fourchette fourchette-" + f.k},
        h("div", {className:"autoeval-fourchette-emoji"}, mt(f.k).em),
        h("div", {className:"autoeval-fourchette-bornes-big"}, libFourchette(f.n)),
        h("div", {style:{fontSize:".8rem", opacity:.95}}, P(mt(f.k).lib)));
    })) : h("div", {className:"autoeval-confirme"},
      h("div", {className:"autoeval-confirme-titre"}, "Ton estimation est enregistrée"),
      h("div", {className:"autoeval-confirme-choix fourchette-" + sel.k}, h("span", {style:{fontSize:"2rem"}}, mt(sel.k).em), h("span", null, libFourchette(sel.n))),
      h("div", {style:{marginTop:".5rem", fontWeight:700}}, P(mt(sel.k).lib)),
      h("div", {className:"autoeval-confirme-attente"}, "La correction s'ouvrira dans un instant."))));
}

/* La correction, question par question, avec la déclaration de la feuille avant la révélation (proposition 360) */
function pastillesDe(e, nbRev){
  var p = calc(e.prenom);
  return EV.questions.map(function(q, i){
    var pos = ORDRE_CORR.indexOf(i);
    if(pos >= nbRev) return {cls:"vide", t:String(i+1)};
    var s = p.st[i];
    return s === "j" ? {cls:"juste", t:"✅"} : s === "t" ? {cls:"trouvee-p", t:"✓"} : s === "pasdit" ? {cls:"nonrep", t:"⚪"} : {cls:"faux", t:"❌"};   // le ✓ orange (484)
  });
}
function ChronoSaisie(v, total){
  var c = v <= 5 ? "rouge" : v <= total / 2 ? "orange" : "vert";
  return h("div", {className:"eleve-chrono saisie saisie-" + c}, h("div", {className:"label"}, "Temps de réponse"), h("div", {className:"v"}, v));
}
function EcrCorr(e, qi, etape, chrono){   // etape : "vide" | "dit" | "revele"
  var q = EV.questions[qi], ordre = ORD[qi][e.cle], decl = FEUI[e.cle][qi], tab = TABL[e.cle][qi];
  var pos = ORDRE_CORR.indexOf(qi);
  var nbRev = pos + (etape === "revele" ? 1 : 0);
  var pa = pastillesDe(e, nbRev);
  var nbJ = pa.filter(function(x){ return x.cls === "juste" || x.cls === "trouvee-p"; }).length;
  var r = calc(e.prenom), st = r.st[qi];
  var declArr = decl === "aucun" ? [] : decl;
  var zone;
  if(etape !== "revele"){
    var dit = etape === "dit";
    zone = h(F, null,
      h("div", {className:"decl-titre"}, P("Qu'as-tu écrit sur ta feuille ?")),
      h("div", {className:"decl-consigne"}, P("Clique sur le ou les choix qui disent la même chose que ta feuille. Les mots ne sont pas forcément les mêmes : c'est à toi de faire le rapprochement.")),
      chrono != null && ChronoSaisie(chrono, q.reponse),
      h("div", {className:"eleve-choix"},
        ordre.map(function(i){ return h("button", {key:i, className:"eleve-choix-btn" + (dit && declArr.indexOf(i) >= 0 ? " selected" : "")}, h("span", null, q.choix[i])); }),
        h("button", {className:"eleve-choix-btn aucun" + (dit && decl === "aucun" ? " selected" : "")}, P("Ma feuille ne dit aucun de ces choix"))),
      dit && h("div", {className:"eleve-feedback valide"}, "✅ Réponse enregistrée — tu peux encore la changer"),
      h("div", {className:"correction-resultat non-rep", style:{background:"rgba(106,76,224,.08)", color:"var(--violet)", borderColor:"var(--violet)", fontSize:"1rem"}}, "👀 Écoute le prof — la correction sera révélée."));
  } else {
    var juste = st === "j", trouvee = st === "t";
    zone = h(F, null,
      trouvee ? h("div", {className:"trouvee"}, h("span", {className:"plus"}, "✓"),
          h("span", null, "Trouvée au dernier moment", h("span", {className:"sous"}, P("Ta feuille disait autre chose, mais tu as cliqué sur la bonne réponse : la question compte. Cela n'arrive qu'une fois par évaluation."))))
        : h("div", {className:"correction-resultat " + (juste ? "juste" : "faux")}, juste ? "✅ Tu avais juste !" : "❌ Tu avais faux."),
      h("div", {className:"correction-choix"}, ordre.map(function(i){
        var bon = q.bonnes.indexOf(i) >= 0, moi = declArr.indexOf(i) >= 0;
        var cls = "correction-choix-item" + (bon ? " bonne" : (moi ? " eleve-faux" : ""));
        if(moi && bon) cls = "correction-choix-item eleve-juste";
        return h("div", {key:i, className:cls}, h("span", null, q.choix[i],
          bon && h("span", {className:"correction-tag tag-bonne"}, "Bonne réponse"),
          moi && h("span", {className:"correction-tag tag-tienne"}, "Ta réponse")));
      })),
      decl === "aucun" && h("div", {className:"tablette-ligne"}, "Ta réponse : ", P("Ma feuille ne dit aucun de ces choix")),
      trouvee && h("div", {className:"tablette-ligne"}, P("Sur la tablette, tu avais cliqué sur : " + tab.map(function(i){ return q.choix[i]; }).join(", "))),
      h("div", {className:"correction-consigne " + (juste ? "juste" : "faux")}, juste
        ? h(F, null, h("strong", null, "✅ Bravo ! "), "Sur ta feuille, mets simplement un ", h("span", {className:"stylo-vert"}, "V vert"), " dans la marge à côté de ta réponse.")
        : h(F, null, !trouvee && h("strong", null, "❌ Tu avais faux. "), h("span", {className:"stylo-rouge"}, "Barre ta réponse en rouge"), " et écris la bonne réponse en entier en ", h("span", {className:"stylo-vert"}, "vert"), " à côté.")),
      h("div", {className:"correction-explication"}, h("div", {className:"correction-explication-titre"}, "💡 Explication"), h("div", {className:"correction-explication-texte"}, q.explication)));
  }
  return Page(badgeDe(e), "📝 Correction", h(F, null,
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    h("div", {className:"correction-compteur"},
      h("div", {className:"correction-compteur-score"},
        h("span", {className:"correction-compteur-num"}, nbJ), h("span", {className:"correction-compteur-lbl"}, nbJ > 1 ? " bonnes réponses" : " bonne réponse"),
        h("span", {className:"correction-compteur-sep-text"}, " sur "), h("span", {className:"correction-compteur-tot"}, nbRev),
        h("span", {className:"correction-compteur-lbl"}, nbRev > 1 ? " questions déjà corrigées" : " question déjà corrigée")),
      h("div", {className:"correction-compteur-pastilles"}, pa.map(function(x, i){ return h("span", {key:i, className:"correction-compteur-pastille " + x.cls}, x.t); }))),
    h("div", {className:"eleve-q-zone"}, QHead(qi, true), h("div", {className:"eleve-q-enonce"}, q.enonce), zone)));
}

function EcrBilan(e){
  var r = calc(e.prenom), m = maitriseDe(r.sur20);
  var est = ESTIM[e.prenom], idxE = ["rouge","orange","bleu","vert"].indexOf(est), idxR = ["rouge","orange","bleu","vert"].indexOf(m.k);
  var nE = FOURCH.filter(function(f){ return f.k === est; })[0].n;
  var emE = MAITRISE.filter(function(x){ return x.k === est; })[0].em;
  var calib = idxE === idxR
    ? {type:"ok", msg:"✅ Tu te connais bien !", detail:"Tu pensais avoir " + libFourchette(nE).replace(" sur 3", "") + " " + emE + " et tu en as effectivement obtenu " + r.n + " sur 3. Ton estimation correspond à ton vrai résultat."}
    : (idxE > idxR ? {type:"sur", msg:"⚠️ Tu pensais avoir mieux fait", detail:"Tu pensais avoir " + libFourchette(nE).replace(" sur 3", "") + " " + emE + " mais tu en as eu " + r.n + " sur 3 (" + libFourchette(r.n).replace(" sur 3", "") + " " + m.em + "). Tu as un peu surestimé ce que tu avais réussi."}
                  : {type:"sous", msg:"🌟 Tu te sous-estimais !", detail:""});
  return Page(badgeDe(e), "🎯 Bilan personnel", h(F, null,
    h("button", {className:"bilan-export-btn"}, "📄 Imprimer / Exporter mon bilan"),
    h("div", {className:"bilan-score fourchette-" + m.k},
      h("div", {className:"bilan-score-emoji"}, m.em),
      h("div", {className:"bilan-score-num"}, P("Ta note : "), r.n + " / 3"),
      h("div", {className:"note20"}, fr1(r.sur20) + " / 20"),
      h("div", {className:"bilan-score-pct"}, P(m.lib))),
    h("div", {className:"bilan-bloc"}, h("h3", null, P("Question par question")),
      h("div", {className:"recap"}, EV.questions.map(function(q, i){
        var s = r.st[i];
        var txt = s === "j" ? "juste" : s === "t" ? null : s === "a" ? "ta feuille ne dit aucun de ces choix" : "faux";
        return h("div", {key:i, className:"recap-l " + (s === "j" || s === "t" ? "j" : "f")},
          h("span", null, "Question " + (i+1) + " · ", s === "t" ? h("span", {className:"plus"}, "＋ Trouvée au dernier moment") : P(txt),
            h("span", {className:"recap-comp"}, q.competences.map(function(c){ return COMP_COURT[c]; }).join(" · "))),
          h("span", {className:"pt"}, P("→ " + r.pts[i] + " point")));
      }))),
    h("div", {className:"bilan-bloc"}, h("h3", null, P("Tes compétences")),
      Object.keys(r.comp).map(function(c){
        var x = r.comp[c], s20 = x.n * 20 / x.max, mm = maitriseDe(s20);
        return h("div", {key:c, className:"comp-l"},
          h("span", null, COMP[c], h("span", {className:"comp-q"}, compQuestions(c).map(function(i){ return "Q" + (i+1) + " " + marque(r.st[i]); }).join(" · ") + " → " + x.n + "/" + x.max)),
          h("span", {className:"mt"}, mm.em + " ", P(mm.lib)));
      })),
    h("div", {className:"bilan-calibration bilan-calib-" + calib.type},
      h("h3", null, "🎯 Ton estimation", InfoI()),
      h("div", {className:"bilan-calib-msg"}, calib.msg),
      h("div", {className:"bilan-calib-detail"}, calib.detail))));
}

/* Annexe (364) : la vraie question 3 de l'évaluation de 3e du 09/10, 6 choix longs, sur une demi-tablette */
var EV3E = {titre:"3e- éval 1 Analyse logique - Construire une phrase complexe", questions:[null, null, {
  enonce:"Comment trouves-tu l'antécédent d'un Pronom Relatif, et dans quel sens va la flèche à l'étape 4?", niveau:"approfondi",
  choix:["Je pose la question sur la Proposition Principale","Ma question dépend du Pronom Relatif employé","Je pose la question sur la relative, avec son Verbe Conjugué",
    "Je prends toujours le nom le plus proche du Pronom Relatif","La réponse est l'antécédent, toujours écrit avant le Pronom Relatif, et la flèche va de droite à gauche, du Pronom Relatif à l'antécédent",
    "La réponse est toujours écrite après le Pronom Relatif"], bonnes:[1,2,4]}].concat(new Array(8).fill(null))};

/* ════════════════════════ CONSOLE ════════════════════════ */
function Console(groupe, tab, contenu, session){
  var groupes = [["pilotage","Pilotage"],["donnees","Données"],["reglages","Réglages"]];
  var sous = {pilotage:[["evals","📝 Évaluations"],["pilot","🎯 Pilotage classe"]], donnees:[["results","📊 Résultats"],["snapshot","💾 Sauvegarde"]], reglages:[]};
  return h("div", {className:"prof-wrap cons"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"prof full"},
      h("div", {className:"prof-header"},
        h("h1", null, "📝 Évaluation QCM", h("span", {className:"badge"}, "Mode prof")),
        h("div", {className:"row"},
          session && h("button", {className:"badge-session-actives"}, h("span", {className:"badge-session-dot"}, "🔴"), "1 session en cours"),
          h("button", {className:"btn-help"}, "📖 Mode d'emploi"),
          h("button", {className:"btn btn-ghost btn-sm"}, "📺 Ouvrir vue tableau"),
          h("button", {className:"btn btn-ghost btn-sm"}, "📱 QR pilotage"),
          h("button", {className:"btn-test"}, "🧪 Mode test", InfoI()),
          h("button", {className:"btn btn-ghost btn-sm"}, "← Retour"))),
      h("div", {className:"tabs"}, h("div", {className:"nav2"},
        h("div", {className:"nav2-groupes"}, groupes.map(function(g){ return h("button", {key:g[0], className:"nav2-groupe" + (g[0] === groupe ? " actif" : "")}, g[1]); }), h("button", {className:"nav2-aide"}, "?")),
        h("div", {className:"nav2-sous"}, sous[groupe].map(function(t){ return h("button", {key:t[0], className:"tab " + (t[0] === tab ? "actif" : "")}, t[1]); })))),
      contenu));
}
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
    h("div", {className:"tab-mini-h"}, h("span", null, "📱 Tablette " + num), !b ? h("span", null, "seul") : h("span", null, opts.coin || "👁")),
    h("div", {className:"tab-mini-b"}, moitie(a, "g"), moitie(b, "d")));
}
function GrilleTablettes(paires, etat, opts){
  return h("div", {className:"tabs-grid"}, paires.map(function(p, i){ return TabMini(i+1, p[0], p[1], etat, opts); }));
}
function Legende(items){
  return h("div", {className:"legende-tab"}, items.map(function(it, i){ return h("span", {key:i}, h("span", {className:"c", style:{background:it[0], border:it[2] || "none"}}), it[1]); }));
}
function TitreCarte(titre, boutons){
  return h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem", marginBottom:".5rem"}},
    h("h2", {style:{margin:0, fontSize:"1.05rem"}}, titre), h("div", {className:"row"}, boutons));
}
function ChoixTexte(q){ return q.choix.map(function(c, ci){ var bon = q.bonnes.indexOf(ci) >= 0; return h("span", {key:ci, className:"pilot-q-mini-choix" + (bon ? " bon" : "")}, c + (bon ? " ✓" : "")); }); }
function Overview(qCur, passees){
  return h("div", {className:"pilot-overview"},
    h("h3", null, h("span", null, "📋 Toutes les questions", InfoI())),
    EV.questions.map(function(q, qi){
      var current = qi === qCur, passee = passees.indexOf(qi) >= 0;
      var nb = RT ? Object.keys(RT).filter(function(p){ return RT[p][qi] === "J"; }).length : 0;
      return h("div", {key:qi, className:"pilot-q-mini" + (current ? " current" : "") + (passee ? " passee" : "")},
        h("div", {className:"pilot-q-mini-head"}, h("span", {className:"pilot-q-mini-num"}, "Q" + (qi+1)), h("span", {className:"pilot-q-mini-niv niv-" + q.niveau}, NIV[q.niveau].label)),
        h("div", {className:"pilot-q-mini-enonce"}, q.enonce),
        h("div", {className:"pilot-q-mini-bonnes"}, ChoixTexte(q)),
        h("div", {className:"pilot-q-mini-status"}, "Réflexion " + q.reflexion + " s · Réponse " + q.reponse + " s par tour",
          passee && h("span", null, " — ", h("span", {className:"score-pct " + (nb/24 >= .7 ? "score-vert" : nb/24 >= .5 ? "score-orange" : "score-rouge")}, nb + "/24 justes"))));
    }));
}
var LEG_Q = [["#22C55E","juste"],["#FACC15","toutes les bonnes + une en trop"],["#F97316","une bonne sur deux"],["#EF4444","faux"],["#3a3f4b","voilé : attend son tour"],["#fff","répond (cadre vert)","2px solid #22C55E"]];

/* état des moitiés pendant les questions : s = {qi, tour (1|2), fini (bool), nonRep:[prénoms]} */
function etatQuestion(s){
  return function(p, cote){
    if(s.reflexion) return {cls:"m-ecrit", st:"✍️ écrit sur sa feuille"};
    if(s.fini) return couleur(p, s.qi, false);
    var estPremier = cote === (PREMIER[s.qi] === "J" ? "g" : "d");
    if(s.tour === 1 && !estPremier) return {cls:"m-voile", st:"🙈 attend son tour"};
    if(s.tour === 2 && estPremier) return couleur(p, s.qi, true);
    if((s.nonRep || []).indexOf(p) >= 0) return {cls:"m-repond", st:"✋ répond…"};
    return couleur(p, s.qi, false);
  };
}
function couleur(p, qi, voile){
  var c = RT[p][qi];
  var base = c === "J" ? {cls:"m-juste", st:"juste"} : c === "Y" ? {cls:"m-jaune", st:"une en trop"} : c === "O" ? {cls:"m-orange", st:"une sur deux"} : {cls:"m-faux", st:"faux"};
  if(voile) base.st += " · 🙈";
  return base;
}
function ChronoCards(q, phase, chrono, tour){
  return h("div", {className:"pilot-chronos-info"},
    h("div", {className:"pilot-chrono-card" + (phase === "reflexion" ? " actif" : "")},
      h("div", {className:"label" + (phase === "reflexion" ? " actif" : "")}, "🧠 Réflexion"),
      h("div", {className:"v"}, phase === "reflexion" ? chrono + "s" : q.reflexion + "s"),
      h("div", {className:"desc"}, phase === "reflexion" ? "EN COURS" : "réglée dans la question")),
    h("div", {className:"pilot-chrono-card" + (phase === "reponse" ? " actif" : "")},
      h("div", {className:"label" + (phase === "reponse" ? " actif" : "")}, "✋ Réponse"),
      h("div", {className:"v"}, phase === "reponse" ? chrono + "s" : q.reponse + "s"),
      h("div", {className:"desc"}, phase === "reponse" ? (tour === 1 ? "1er tour" : "2e tour") + " · EN COURS" : "par tour · réglée dans la question")));
}
function QCourante(qi){
  var q = EV.questions[qi];
  return h("div", {className:"pilot-q-current"},
    h("div", {className:"num"}, "Question " + (qi+1) + " / 3 — " + q.bonnes.length + " bonne(s) rép."),
    h("div", {className:"enonce"}, q.enonce),
    h("div", {className:"pilot-q-bonne"}, h("span", {style:{fontWeight:900}}, "✓ Bonne" + (q.bonnes.length > 1 ? "s" : "") + " réponse" + (q.bonnes.length > 1 ? "s" : "") + " : "), q.bonnes.map(function(i){ return q.choix[i]; }).join("  /  ")),
    h("div", {className:"niv-row"},
      h("span", {className:"niv-bulle"}, "Difficulté : " + NIV[q.niveau].label),
      q.competences.map(function(c){ return h("span", {key:c, className:"niv-bulle"}, c); })));
}
function Pilot(s){
  var q = s.qi != null ? EV.questions[s.qi] : EV.questions[0];
  var st, statusCls = s.phase;
  if(s.phase === "idle") st = "⏳ En attente — clique sur « ▶️ Lancer Q1 »";
  else if(s.phase === "reflexion") st = "🧠 Phase RÉFLEXION en cours";
  else if(s.phase === "reponse") st = h(F, null, "✋ Phase RÉPONSE — " + (s.tour === 1 ? "1er" : "2e") + " tour", h("span", {className:"tour-chip"}, (((PREMIER[s.qi] === "J") === (s.tour === 1)) ? "moitiés de gauche" : "moitiés de droite")));
  else st = "⏸️ Question close — passe à la suivante";
  var actions;
  if(s.phase === "idle") actions = [h("button", {key:1, className:"btn btn-primary"}, "▶️ Lancer Q1")];
  else if(s.phase === "reflexion") actions = [h("button", {key:1, className:"btn btn-vert"}, "✋ Autoriser la réponse"), h("button", {key:2, className:"btn btn-or"}, "⏸️ Pause"), h("button", {key:3, className:"btn btn-ghost"}, "🔄 Relancer chrono")];
  else if(s.phase === "reponse") actions = [s.tour === 1 ? h("button", {key:1, className:"btn btn-vert"}, "⏭️ Tour suivant") : h("button", {key:1, className:"btn btn-or"}, "🔒 Clore la question"), h("button", {key:2, className:"btn btn-or"}, "⏸️ Pause"), h("button", {key:3, className:"btn btn-ghost"}, "🔄 Relancer chrono")];
  else actions = s.qi < 2 ? [h("button", {key:1, className:"btn btn-primary"}, "▶️ Lancer Q" + (s.qi + 2)), h("button", {key:2, className:"btn btn-ghost"}, "🔓 Rouvrir pour tous")]
                          : [h("button", {key:1, className:"btn btn-or"}, "📊 Lancer l'autoévaluation"), h("button", {key:2, className:"btn btn-ghost"}, "🔓 Rouvrir pour tous")];
  var colG = h("div", null,
    h("div", {className:"pilot-status " + statusCls}, st),
    ChronoCards(q, s.phase, s.chrono, s.tour),
    s.qi != null && QCourante(s.qi),
    h("div", {className:"pilot-actions"}, actions),
    (s.phase === "reflexion" || s.phase === "reponse") && h("div", {className:"row", style:{marginTop:".4rem", justifyContent:"center", gap:".3rem"}},
      h("button", {className:"btn btn-ghost btn-sm"}, "+5s"), h("button", {className:"btn btn-ghost btn-sm"}, "+10s"), h("button", {className:"btn btn-ghost btn-sm"}, "+30s"),
      h("span", {style:{fontSize:".75rem", color:"var(--gris)"}}, s.phase === "reponse" ? "pour le tour en cours" : "")),
    s.phase === "attente" && s.qi < 2 && h("div", {className:"pilot-eleve-help"}, "« Rouvrir pour tous » ne rouvre que pour ceux qui n'ont pas répondu, une fois par question."),
    (s.qi == null || s.qi < 2) && h("div", {className:"pilot-q-next-detail"},
      h("div", {className:"label"}, "🔮 À venir — Q " + ((s.qi == null ? -1 : s.qi) + 2) + " / 3", InfoI()),
      h("div", {className:"enonce-next"}, EV.questions[s.qi == null ? 0 : s.qi + 1].enonce),
      h("div", {style:{fontSize:".72rem", color:"var(--gris)", fontStyle:"italic"}}, (function(){ var n = EV.questions[s.qi == null ? 0 : s.qi + 1]; return "Difficulté " + NIV[n.niveau].label + " · réflexion " + n.reflexion + " s · réponse " + n.reponse + " s par tour · " + n.bonnes.length + " bonne(s) réponse(s)"; })())));
  var colM = h("div", null,
    h("h3", {style:{margin:"0 0 .2rem"}}, "📱 Tablettes", InfoI(), h("span", {style:{fontWeight:400, fontSize:".8rem", color:"var(--gris)", marginLeft:".5rem"}}, s.sousTitre || "")),
    GrilleTablettes(PAIRES, s.etat),
    Legende(s.legende || LEG_Q));
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte("🎯 " + EV.titre + " — " + CLASSE, [
      h("span", {key:0, style:{fontSize:".8rem", color:"var(--gris)", fontWeight:700}}, "🕙 Fin de l'heure : 10:57"),
      h("button", {key:1, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"),
      h("button", {key:2, className:"btn btn-ghost btn-sm"}, "↩️ Retour d'un élève"),
      h("button", {key:4, className:"btn btn-ghost btn-sm"}, "🔓 Rouvrir pour un élève"),
      h("button", {key:3, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-stats"}, s.stats.map(function(x, i){ return h("div", {key:i, className:"pilot-stat"}, h("div", {className:"v"}, x[0]), h("div", {className:"l"}, x[1])); })),
    h("div", {className:"pilot-grid v2"}, colG, colM, Overview(s.qi, s.passees || []))), true);
}

/* Avant l'heure : choix, durée, binômes ; puis l'appel */
function Lancement(appel){
  var classe = [].concat.apply([], PAIRES_AVANT).filter(Boolean).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  var carte = h("div", {className:"card"},
    h("h2", null, "🎯 Lancer une nouvelle session", InfoI()),
    h("div", {className:"lancer-grid"},
      h("div", null,
        h("div", {className:"field"}, h("label", null, "Classe", InfoI()), h("select", {value:"c", readOnly:true}, h("option", {value:"c"}, CLASSE + " (25 élèves)"))),
        h("div", {className:"field"}, h("label", null, "Évaluation", InfoI()), h("select", {value:"e", readOnly:true}, h("option", {value:"e"}, EV.titre + " (3 questions)"))),
        h("div", {className:"duree-box"}, "⏱️ ", h("strong", null, "Durée estimée : 11 min"), " — entrée 3 min, questions 4 min (deux tours par question), estimation 1 min, correction 3 min.", h("br"), "✅ Ça tient dans les 45 minutes utiles."),
        h("button", {className:"btn btn-primary"}, "🚀 Lancer la session")),
      h("div", {className:"binomes-box"},
        h("div", {className:"tt"}, "📱 Binômes proposés — d'après le QCM précédent"),
        h("div", {className:"ss"}, "Classement du QCM précédent, puis 1-2, 3-4… Glisse un nom sur un autre pour échanger deux élèves, ou sur une moitié vide pour l'y déplacer. Tu peux le faire jusqu'au bout de l'heure."),
        GrilleTablettes(PAIRES_AVANT, null, {grip:true, coin:" "}))));
  var modale = appel && h("div", {className:"checkin-overlay"},
    h("div", {className:"checkin-modal", style:{maxWidth:"640px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "📋 Check-in : qui est absent aujourd'hui ?", InfoI()), h("div", {className:"checkin-sub"}, CLASSE + " — 25 élèves")),
      h("div", {className:"checkin-list", style:{display:"grid", gridTemplateColumns:"1fr 1fr", columnGap:".4rem"}}, classe.map(function(n){
        var abs = n === "YVON Adam";
        return h("div", {key:n, className:"checkin-item" + (abs ? " coche" : "")}, h("span", {className:"checkin-checkbox"}, abs ? "🚫" : "✓"), h("span", {className:"checkin-nom"}, n));
      })),
      h("div", {style:{padding:".55rem 1.2rem", borderTop:"1px solid var(--bordure)", fontSize:".86rem", lineHeight:1.5}},
        h("div", null, "📱 ", h("strong", null, "CHEVALLIER Théo"), " (binôme d'Adam) et ", h("strong", null, "ZELLER Lou"), " (seule) sont mis ensemble : tablette 12."),
        h("div", {style:{display:"flex", alignItems:"center", gap:".5rem", marginTop:".35rem"}}, h("span", {style:{whiteSpace:"nowrap"}}, "🕙 Fin de l'heure :"),
          h("input", {readOnly:true, value:"10:57", style:{width:"70px", padding:".2rem .4rem", border:"2px solid var(--bordure)", borderRadius:"6px", fontWeight:900, textAlign:"center", fontFamily:"inherit"}}),
          h("span", {style:{color:"var(--gris)"}}, "lancement + 55 min ; les tablettes oublient leurs élèves à « Terminer », ou 10 min après."))),
      h("div", {className:"checkin-summary"}, "🚫 1 absent sur 25"),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost"}, "Annuler"), h("button", {className:"btn btn-ghost"}, "Tout le monde présent"), h("button", {className:"btn btn-primary"}, "🚀 Lancer la session"))));
  var precedentes = SessionsPrecedentes();
  return Console("pilotage", "pilot", h(F, null, carte, precedentes, modale), false);
}
/* 413 (retenu au tour 603) : chaque séance passée de la classe ouvre ses résultats */
function SessionsPrecedentes(){
  var lignes = [
    ["3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3)", "24/09/2026 10:04", "✅ terminée", "23 présents · 2 feuilles à lire", "↳ c'est le QCM précédent : il sert aux binômes"],
    ["QCM — Le jambon-beurre", "15/09/2026 10:03", "✅ terminée", "25 présents", null]
  ];
  return h("div", {className:"card"},
    h("h2", null, "📚 Sessions précédentes — " + CLASSE, InfoI()),
    h("div", {className:"results-eval-list"}, lignes.map(function(l, i){
      return h("div", {key:i, className:"results-eval-row"},
        h("div", null, h("div", {className:"titre"}, l[0]),
          h("div", {className:"meta"}, l[1] + " · " + l[2] + " · " + l[3]),
          l[4] && h("div", {className:"meta", style:{color:"var(--violet)", fontWeight:700}}, l[4])),
        h("button", {className:"btn btn-ghost btn-sm"}, "📊 Résultats"));
    })));
}

function PilotEstimation(){
  var distrib = [["vert", 6], ["bleu", 9], ["orange", 5], ["rouge", 2]];
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📊 Autoévaluation — " + EV.titre + " — " + CLASSE, InfoI()), [h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status autoeval"}, "Phase autoévaluation — 22 / 24 élèves"),
    h("p", {style:{margin:".8rem 0", color:"var(--gris)"}}, "Les élèves choisissent dans quelle fourchette ils estiment avoir réussi. Clique sur ", h("strong", null, "📝 Lancer la correction"), " quand tu es prêt."),
    h("div", {className:"autoeval-prof-distrib"}, distrib.map(function(d){ var m = MAITRISE.filter(function(x){ return x.k === d[0]; })[0];
      return h("div", {key:d[0], className:"autoeval-prof-cell fourchette-" + d[0]}, h("span", null, m.em + " " + m.lib), h("strong", null, d[1])); })),
    h("div", {style:{fontSize:".85rem", color:"var(--gris)"}}, "Pas encore : PERRAUD Jade, QUINTON Enzo."),
    h("div", {className:"row", style:{marginTop:"1rem"}}, h("button", {className:"btn btn-or"}, "📝 Lancer la correction"))), true);
}

/* La correction, côté console : le Suivi de la déclaration, puis le résultat d'après la feuille */
function etatCorrection(qi, revele, nonDit){
  return function(p){
    var r = calc(p), s = r.st[qi], flag = null;
    r.flags.forEach(function(f){ if(f.q === qi) flag = f.txt; });
    if(!revele) return (nonDit.indexOf(p) >= 0) ? {cls:"m-pasdit", st:"⏳ pas encore recopié"} : {cls:"m-dit", st:"✍️ a recopié"};
    if(s === "pasdit") return {cls:"m-pasdit", st:"rien recopié", flag:"pas de recopie"};
    if(s === "j") return {cls:"m-juste", st:"✓ 1 pt", flag:flag};
    if(s === "t") return {cls:"m-trouvee", st:"＋ Trouvée", flag:flag};
    return {cls:"m-faux", st:"✗ 0", flag:flag};
  };
}
function aLire(jusqua){
  var l = [];
  Object.keys(RF).forEach(function(p){ calc(p).flags.forEach(function(f){ if(ORDRE_CORR.indexOf(f.q) <= jusqua) l.push({p:p, q:f.q, txt:f.txt}); }); });
  return l;
}
function nomDe(p){ var n = null; PAIRES.forEach(function(pp){ pp.forEach(function(x){ if(x && pre(x) === p) n = x; }); }); return n; }
function PilotCorrection(qi, revele){
  var q = EV.questions[qi], pos = ORDRE_CORR.indexOf(qi);
  var nonDit = revele ? [] : ["Michel", "Tom", "Hugo", "Sacha", "Rayan", "Théo"];
  var nbDit = 24 - nonDit.length;
  var tabJ = Object.keys(RT).filter(function(p){ return RT[p][qi] === "J"; }).length;
  var res = Object.keys(RF).map(function(p){ return calc(p).st[qi]; });
  var nbF = res.filter(function(s){ return s === "j"; }).length, nbT = res.filter(function(s){ return s === "t"; }).length;
  var lire = revele ? aLire(pos) : aLire(pos - 1);
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📝 Correction — " + EV.titre + " — " + CLASSE, InfoI("Pour chaque question, les élèves recopient d'abord leur feuille : un clic sur ce qu'elle dit. « 💡 Révéler » s'ouvre quand tous les présents l'ont fait. Tu commentes la question après la révélation, jamais avant : sinon, ils cliqueraient ce que tu dis. Les questions sont triées de la plus ratée à la mieux réussie.", !revele && qi === 1)),
      [h("button", {key:0, className:"btn btn-ghost btn-sm"}, "🚫 Départ d'un élève"), h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"pilot-status correction"}, "Question " + (pos+1) + " / 3 — Q" + (qi+1)),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"pilot-q-current"},
          h("div", {className:"num"}, "Question " + (qi+1)),
          h("div", {className:"enonce"}, q.enonce),
          h("div", {className:"pilot-q-bonne"}, h("span", {style:{fontWeight:900}}, "✓ Bonne" + (q.bonnes.length > 1 ? "s" : "") + " réponse" + (q.bonnes.length > 1 ? "s" : "") + " : "), q.bonnes.map(function(i){ return q.choix[i]; }).join("  /  ")),
          h("div", {className:"niv-row"}, h("span", {className:"niv-bulle"}, "Difficulté : " + NIV[q.niveau].label), h("span", {className:"niv-bulle"}, tabJ + " / 24 justes sur la tablette (" + Math.round(tabJ * 100 / 24) + "%)"))),
        !revele && h("div", {className:"pilot-chrono-card actif saisie-carte"},
          h("div", {className:"label actif"}, "✍️ Temps pour recopier sa feuille"),
          h("div", {className:"v"}, "7s"),
          h("div", {className:"desc"}, "sur " + q.reponse + " s, le temps de réponse de la question · orange à la moitié, rouge les 5 dernières secondes")),
        h("div", {className:"row", style:{marginTop:".8rem"}},
          h("button", {className:"btn btn-ghost", disabled:pos <= 0}, "← Question précédente"),
          h("button", {className:"btn " + (revele ? "btn-ghost" : "btn-or ferme"), disabled:!revele ? true : false}, revele ? "💡 Révélée" : "🔒 Révéler"),
          h("button", {className:"btn btn-primary"}, "Question suivante →")),
        !revele && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "« 💡 Révéler » s'ouvre quand les 24 présents ont recopié leur feuille. Il en manque " + nonDit.length + " :"),
          h("div", {className:"noms"}, nonDit.map(function(p){ return nomDe(p); }).join(" · ")),
          h("div", {className:"ss"}, "Une tablette en panne : « 🚫 Départ d'un élève », en haut ; il ne bloque plus, ses questions sortent du total et tu fixes sa note d'après sa feuille.")),
        lire.length > 0 && h("div", {className:"alire"}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, nomDe(x.p) + " — Q" + (x.q+1) + " : " + x.txt); }))),
      h("div", {className:"suivi-box"},
        h("h3", null, revele ? "✍️ Leur feuille, d'après leur recopie" : "✍️ La recopie de leur feuille", InfoI()),
        h("div", {className:"ss"}, revele ? ("Feuilles justes : " + nbF + " / 24 · Trouvées au dernier moment : " + nbT) : (nbDit + " / 24 ont recopié leur feuille — " + (24 - nbDit) + " pas encore")),
        GrilleTablettes(PAIRES, etatCorrection(qi, revele, nonDit)),
        Legende(revele ? [["#22C55E","juste d'après la feuille"],["#EF4444","faux d'après la feuille"],["#16A34A","＋ Trouvée au dernier moment"],["#FFEDD5","à lire sur la feuille","1px solid #FDBA74"]]
                       : [["#EDE9FE","a recopié"],["#FEE2E2","pas encore recopié","1px solid #EF4444"]])))), true);
}

function tauxQ(qi){ var ok = 0, n = 0; Object.keys(RF).forEach(function(p){ var x = calc(p).pts[qi]; if(x != null){ n++; ok += x; } }); return Math.round(ok * 100 / n); }
function BilanClasse(){
  var lignes = Object.keys(RF).map(function(p){ var r = calc(p); return {p:p, nom:nomDe(p), r:r}; });
  var notes = lignes.filter(function(l){ return l.r.complet; }).map(function(l){ return l.r.n; }).sort(function(a, b){ return a - b; });
  var moy = notes.reduce(function(a, b){ return a + b; }, 0) / notes.length, med = notes[Math.floor(notes.length / 2)];
  var dist = {vert:0, bleu:0, orange:0, rouge:0};
  lignes.forEach(function(l){ if(l.r.complet) dist[maitriseDe(l.r.sur20).k]++; });
  lignes.sort(function(a, b){ return (b.r.complet ? b.r.n : -1) - (a.r.complet ? a.r.n : -1) || a.nom.localeCompare(b.nom, "fr"); });
  var lire = aLire(2);
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "🏁 Bilan classe — " + EV.titre + " — " + CLASSE, InfoI()), [h("button", {key:1, className:"btn btn-rouge btn-sm"}, "🛑 Terminer la session")]),
    h("div", {className:"bilan-classe-synthese"},
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Moyenne"), h("div", {className:"bilan-classe-stat-num"}, fr1(moy) + " / 3"), h("div", {style:{opacity:.9}}, fr1(moy * 20 / 3) + " / 20")),
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Médiane"), h("div", {className:"bilan-classe-stat-num"}, med + " / 3")),
      h("div", {className:"bilan-classe-stat"}, h("div", {className:"bilan-classe-stat-label"}, "Plage"), h("div", {className:"bilan-classe-stat-num"}, notes[0] + "—" + notes[notes.length - 1]))),
    h("div", {style:{display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:"1rem"}},
      h("div", null,
        h("h3", {style:{marginTop:".4rem"}}, "📊 Distribution", InfoI()),
        h("div", {className:"bilan-classe-distrib"}, MAITRISE.map(function(m){ return h("div", {key:m.k, className:"bilan-classe-distrib-cell fourchette-" + m.k}, h("strong", null, dist[m.k]), h("span", null, m.em + " " + m.lib)); })),
        h("h3", null, "🧩 Par compétence", InfoI()),
        COMPS.map(function(c){
          var d = {vert:0, bleu:0, orange:0, rouge:0};
          lignes.forEach(function(l){ d[niveauComp(l.r, c).k]++; });
          return h("div", {key:c, className:"par-comp"},
            h("div", {className:"pc-t"}, c + " · " + COMP_COURT[c] + " · " + compQuestions(c).map(function(i){ return "Q" + (i+1); }).join(", ")),
            h("div", {className:"bilan-classe-distrib pc-d"}, MAITRISE.map(function(m){ return h("div", {key:m.k, className:"bilan-classe-distrib-cell fourchette-" + m.k}, h("strong", null, d[m.k]), h("span", null, m.em + " " + m.lib)); })));
        }),
        h("h3", null, "🎯 Calibration de l'autoévaluation", InfoI()),
        h("div", {className:"bilan-classe-calib"},
          h("div", {className:"bilan-classe-calib-cell calib-ok"}, h("strong", null, 11), h("span", null, "✅ Bien évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-sous"}, h("strong", null, 4), h("span", null, "🌟 Sous-évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-sur"}, h("strong", null, 7), h("span", null, "⚠️ Sur-évalués")),
          h("div", {className:"bilan-classe-calib-cell calib-none"}, h("strong", null, 2), h("span", null, "— Pas d'autoeval"))),
        h("h3", null, "💡 Questions remarquables", InfoI()),
        h("div", {className:"bilan-classe-insights"},
          h("div", {className:"bilan-classe-insight insight-attention"}, h("div", {className:"bilan-classe-insight-titre"}, "🔴 La plus ratée — Q2 (" + tauxQ(1) + "% de réussite)"), h("div", {className:"bilan-classe-insight-enonce"}, EV.questions[1].enonce)),
          h("div", {className:"bilan-classe-insight insight-felicitations"}, h("div", {className:"bilan-classe-insight-titre"}, "🟢 La mieux réussie — Q1 (" + tauxQ(0) + "% de réussite)"), h("div", {className:"bilan-classe-insight-enonce"}, EV.questions[0].enonce)))),
      h("div", null,
        h("div", {className:"alire", style:{marginTop:".4rem"}}, h("div", {className:"tt"}, "📌 À lire sur les feuilles, ce soir (" + lire.length + ")"),
          lire.map(function(x, i){ return h("div", {key:i}, nomDe(x.p) + " — Q" + (x.q+1) + " : " + x.txt); })))),
    h("h3", null, "👥 Détail par élève (trié par note)", InfoI()),
    h("div", {className:"bilan-classe-table-wrap"}, h("table", {className:"bilan-classe-table"},
      h("thead", null, h("tr", null, ["Élève", "Note", "Sur 20", "Maîtrise de la note"].map(function(t){ return h("th", {key:t}, t); }), COMPS.map(EnteteComp))),
      h("tbody", null, lignes.map(function(l){ var m = maitriseDe(l.r.sur20);
        return h("tr", {key:l.p}, h("td", null, l.nom), h("td", null, l.r.n + " / 3"), h("td", null, fr1(l.r.sur20)),
          h("td", null, h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib)),
          COMPS.map(function(c){ return h("td", {key:c}, PillComp(l.r, c)); })); }))))), true);
}

/* Le soir : Données → Résultats → la séance */
function Resultats(fiche, modale, sansTableau){
  var lignes = Object.keys(RF).map(function(p){ return {p:p, nom:nomDe(p), r:calc(p)}; }).sort(function(a, b){ return a.nom.localeCompare(b.nom, "fr"); });
  var nbLire = aLire(2).length;
  var tableau = h("div", {className:"scoresheet-wrap"}, h("table", {className:"scoresheet"},
    h("thead", null, h("tr", null,
      h("th", {className:"eleve-col"}, "Élève", h("span", {className:"sort-arrow"}, "↕")),
      EV.questions.map(function(q, i){ return h("th", {key:i, title:q.enonce}, "Q" + (i+1)); }),
      h("th", null, "Note", h("span", {className:"sort-arrow"}, "↕")), h("th", null, "Sur 20"), h("th", null, "Maîtrise de la note"),
      COMPS.map(EnteteComp),
      h("th", null, "À lire sur la feuille", h("span", {className:"sort-arrow"}, "↕")))),
    h("tbody", null, lignes.map(function(l){
      var m = maitriseDe(l.r.sur20);
      return h("tr", {key:l.p},
        h("td", {className:"eleve-cell"}, l.nom),
        l.r.st.map(function(s, i){
          return s === "j" ? h("td", {key:i, className:"cell-juste"}, "✓") : s === "t" ? h("td", {key:i, className:"cell-trouvee"}, "＋") : s === "pasdit" ? h("td", {key:i, className:"cell-vide"}, "?") : h("td", {key:i, className:"cell-faux"}, "✗");
        }),
        h("td", {className:"score-cell"}, l.r.complet ? l.r.n + "/3" : "—"),
        h("td", {className:"score-cell"}, l.r.complet ? fr1(l.r.sur20) : "—"),
        h("td", null, l.r.complet ? h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib) : "à fixer"),
        COMPS.map(function(c){ return h("td", {key:c, className:"comp-cell"}, PillComp(l.r, c)); }),
        h("td", {className:"alire-cell" + (l.r.flags.length ? "" : " vide")}, l.r.flags.map(function(f){ return "Q" + (f.q+1) + " : " + f.txt; }).join(" · ")));
    }))));
  var r = calc("Michel");
  var ficheEl = fiche && h("div", {className:"student-report"},
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap"}},
      h("h3", null, "👤 DUVERNAY Michel — 1 / 3 · 6,7 / 20 · 🟠 Maîtrise fragile", InfoI()),
      h("button", {className:"btn btn-ghost btn-sm"}, "✕ Fermer")),
    h("div", {className:"fiche-head"}, h("span", null, ""), h("span", null, "Question"), h("span", null, "Sa feuille (recopiée)"), h("span", null, "Sa tablette"), h("span", null, "Bonne réponse"), h("span", null, "Points"), h("span", null, "")),
    EV.questions.map(function(q, qi){
      var f = FEUI.M[qi], t = TABL.M[qi], s = r.st[qi], fl = r.flags.filter(function(x){ return x.q === qi; })[0];
      function txt(a){ return a === "aucun" ? "aucun de ces choix" : a.map(function(i){ return q.choix[i]; }).join(", "); }
      var tJ = JSON.stringify(t.slice().sort()) === JSON.stringify(q.bonnes.slice().sort());
      return h("div", {key:qi, className:"fiche-q"},
        h("span", {className:"num"}, "Q" + (qi+1)),
        h("span", null, q.enonce, h("div", {className:"fiche-comp"}, "🧩 " + q.competences.join(" · ")), fl && h("div", null, h("span", {className:"flag"}, fl.txt))),
        h("span", {className:"val " + (s === "j" ? "j" : "f")}, txt(f)),
        h("span", {className:"val " + (tJ ? "j" : "f")}, txt(t)),
        h("span", {className:"val"}, txt(q.bonnes)),
        h("span", {className:"pts"}, r.pts[qi] + " pt"),
        h("button", {className:"btn btn-ghost btn-sm"}, "La feuille dit autre chose"));
    }),
    h("div", {className:"fiche-comps"}, h("div", {className:"tt"}, "🧩 Ses compétences"),
      COMPS.map(function(c){ var m = niveauComp(r, c), x = r.comp[c];
        return h("div", {key:c, className:"fiche-comp-l"}, h("span", {className:"c"}, c), h("span", null, COMP[c]), h("span", {className:"d"}, detailComp(r, c) + " → " + x.n + "/" + x.max), h("span", {className:"maitrise-pill " + m.cls}, m.em + " " + m.lib)); })));
  var mod = modale && h("div", {className:"checkin-overlay"},
    h("div", {className:"checkin-modal", style:{maxWidth:"460px"}},
      h("div", {className:"checkin-header"}, h("h3", null, "Que dit la feuille ?"), h("div", {className:"checkin-sub"}, "DUVERNAY Michel — Q3 · " + EV.questions[2].enonce)),
      h("div", {style:{padding:".6rem 1.2rem 0", fontSize:".85rem", color:"var(--gris)"}}, "Michel a recopié « Ma feuille ne dit aucun de ces choix ». Clique sur ce que dit sa feuille."),
      h("div", {className:"qdf-choix"},
        EV.questions[2].choix.map(function(c, i){ return h("div", {key:i, className:"qdf-c"}, h("span", null, c), h("span", {className:"tg"}, EV.questions[2].bonnes.indexOf(i) >= 0 ? "bonne réponse" : "")); }),
        h("div", {className:"qdf-c aucun sel"}, h("span", null, "Aucun des choix"), h("span", {className:"tg"}, "sa recopie"))),
      h("div", {className:"checkin-actions"}, h("button", {className:"btn btn-ghost"}, "Annuler"), h("button", {className:"btn btn-primary"}, "Valider"))));
  return Console("donnees", "results", h(F, null, h("div", {className:"card"},
    TitreCarte("📊 " + EV.titre + " — " + CLASSE, [
      h("button", {key:0, className:"btn btn-primary btn-sm"}, "📄 PDF notes et compétences"),
      h("button", {key:1, className:"btn btn-or btn-sm"}, "📥 Export CSV"),
      h("button", {key:2, className:"btn btn-ghost btn-sm"}, "← Retour")]),
    h("p", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:".2rem"}}, "08/10/2026 10:02 · 24 présents, 1 absent (YVON Adam) · ", h("strong", {style:{color:"#9A3412"}}, nbLire + " feuilles à lire")),
    !sansTableau && tableau, ficheEl), mod), false);
}

/* ════════════════════════ LES SCÈNES, DANS L'ORDRE DU FLUX ════════════════════════ */
var E = {J:J, M:M};
function autre(c){ return c === "J" ? M : J; }
function tourScene(qi, tour, chrono, selPremier, selSecond){
  var p = PREMIER[qi], s = p === "J" ? "M" : "J";
  var qui = tour === 1 ? p : s;
  var ecran = EcrReponse(E[qui], qi, ORD[qi][qui], tour === 1 ? selPremier : selSecond, chrono);
  var voile = Voile(E[qui], false, E[qui === "J" ? "M" : "J"]);
  return qui === "J" ? Tablette(ecran, voile) : Tablette(voile, ecran);
}
function passageScene(qi, tour){
  var p = PREMIER[qi], s = p === "J" ? "M" : "J", qui = tour === 1 ? p : s;
  var ecran = EcrPassage(E[qui], qi), voile = Voile(E[qui], true, E[qui === "J" ? "M" : "J"]);
  return qui === "J" ? Tablette(ecran, voile) : Tablette(voile, ecran);
}
function statsQ(c, r, j, q){ return [[c, "connectés"], [r, "ont répondu"], [j, "justes"], [q, "question"]]; }

var SCENES = [
  {id:"c-lancer", vue:"console", render:function(){ return Lancement(false); }},
  {id:"c-appel", vue:"console", render:function(){ return Lancement(true); }},
  {id:"t-combien", vue:"tablette", render:function(){ return EcrCombien(); }},
  {id:"t-login", vue:"tablette", render:function(){ return Tablette(EcrLogin({code:"4821", prenom:"Julien", nom:"ABR", champ:"nom"}), EcrLogin({champ:"code"})); }},
  {id:"t-binome", vue:"tablette", render:function(){ return Tablette(EcrAttest(J, false), EcrBinome(M, "48")); }},
  {id:"t-attest", vue:"tablette", render:function(){ return Tablette(EcrAttest(J, true), EcrAttest(M, false)); }},
  {id:"t-pret", vue:"tablette", render:function(){ return Tablette(EcrPret(J), EcrPret(M)); }},
  {id:"c-pret", vue:"console", render:function(){ return Pilot({phase:"idle", qi:null, stats:[["23/24", "connectés"], ["22/24", "attestations"], ["0/3", "questions"]],
      sousTitre:"qui est assis où, et qui a coché son attestation",
      legende:[["#E8F5E9","✓ prêt"],["#FEF3C7","attestation pas encore cochée"],["#F1F5F9","pas encore entré"]],
      etat:function(p){ return p === "Enzo" ? {cls:"m-attest", st:"attestation…"} : p === "Lou" ? {cls:"m-connexion", st:"pas encore entrée"} : {cls:"m-pret", st:"✓ prêt · 10:0" + ((p === "Julien" || p === "Michel") ? 4 : (p.length % 5 + 3))}; }}); }},
  // Question 1 — Julien commence
  {id:"t-q1-reflexion", vue:"tablette", render:function(){ return Tablette(EcrReflexion(J, 0, 14), EcrReflexion(M, 0, 14)); }},
  {id:"c-q1-reflexion", vue:"console", render:function(){ return Pilot({phase:"reflexion", qi:0, chrono:14, stats:statsQ("24/24", "0/24", "—", "1/3"), etat:etatQuestion({qi:0, reflexion:true})}); }},
  {id:"t-q1-passage1", vue:"tablette", render:function(){ return passageScene(0, 1); }},
  {id:"t-q1-tour1", vue:"tablette", render:function(){ return tourScene(0, 1, 9, [2], []); }},
  {id:"c-q1-tour1", vue:"console", render:function(){ return Pilot({phase:"reponse", qi:0, tour:1, chrono:9, stats:statsQ("24/24", "10/12", "10/10", "1/3"), etat:etatQuestion({qi:0, tour:1, nonRep:["Jade", "Anna"]})}); }},
  {id:"t-q1-passage2", vue:"tablette", render:function(){ return passageScene(0, 2); }},
  {id:"t-q1-tour2", vue:"tablette", render:function(){ return tourScene(0, 2, 6, [2], [3]); }},
  {id:"c-q1-tour2", vue:"console", render:function(){ return Pilot({phase:"reponse", qi:0, tour:2, chrono:6, stats:statsQ("24/24", "23/24", "20/23", "1/3"), etat:etatQuestion({qi:0, tour:2, nonRep:["Lou"]})}); }},
  {id:"t-q1-attente", vue:"tablette", render:function(){ return Tablette(EcrAttente(J), EcrAttente(M)); }},
  {id:"c-q1-close", vue:"console", render:function(){ return Pilot({phase:"attente", qi:0, stats:statsQ("24/24", "24/24", "21/24", "1/3"), passees:[0], etat:etatQuestion({qi:0, fini:true})}); }},
  // Question 2 — Michel commence
  {id:"t-q2-reflexion", vue:"tablette", render:function(){ return Tablette(EcrReflexion(J, 1, 22), EcrReflexion(M, 1, 22)); }},
  {id:"t-q2-tour1", vue:"tablette", render:function(){ return tourScene(1, 1, 12, [0, 1, 2], []); }},
  {id:"t-q2-tour2", vue:"tablette", render:function(){ return tourScene(1, 2, 4, [0, 1, 2], [0, 2]); }},
  {id:"c-q2-tour2", vue:"console", render:function(){ return Pilot({phase:"reponse", qi:1, tour:2, chrono:4, stats:statsQ("24/24", "23/24", "9/23", "2/3"), passees:[0], etat:etatQuestion({qi:1, tour:2, nonRep:["Théo"]})}); }},
  // Question 3 — Julien commence
  {id:"t-q3-tour1", vue:"tablette", render:function(){ return tourScene(2, 1, 8, [0], []); }},
  {id:"t-q3-tour2", vue:"tablette", render:function(){ return tourScene(2, 2, 5, [0], [2]); }},
  {id:"c-q3-close", vue:"console", render:function(){ return Pilot({phase:"attente", qi:2, stats:statsQ("24/24", "24/24", "14/24", "3/3"), passees:[0, 1, 2], etat:etatQuestion({qi:2, fini:true})}); }},
  // Estimation
  {id:"t-estim", vue:"tablette", render:function(){ return Tablette(EcrEstim(J, "bleu"), EcrEstim(M, null)); }},
  {id:"c-estim", vue:"console", render:function(){ return PilotEstimation(); }},
  // Correction : Q2, puis Q3, puis Q1 (de la plus ratée à la mieux réussie)
  {id:"c-corr-q2-avant", vue:"console", render:function(){ return PilotCorrection(1, false); }},
  {id:"t-corr-q2-decl", vue:"tablette", render:function(){ return Tablette(EcrCorr(J, 1, "dit", 7), EcrCorr(M, 1, "vide", 7)); }},
  {id:"t-corr-q2-attente", vue:"tablette", render:function(){ return Tablette(EcrCorr(J, 1, "dit", 3), EcrCorr(M, 1, "dit", 3)); }},
  {id:"c-corr-q2-apres", vue:"console", render:function(){ return PilotCorrection(1, true); }},
  {id:"t-corr-q2-apres", vue:"tablette", render:function(){ return Tablette(EcrCorr(J, 1, "revele"), EcrCorr(M, 1, "revele")); }},
  {id:"t-corr-q3-decl", vue:"tablette", render:function(){ return Tablette(EcrCorr(J, 2, "dit", 11), EcrCorr(M, 2, "dit", 11)); }},
  {id:"c-corr-q3-apres", vue:"console", render:function(){ return PilotCorrection(2, true); }},
  {id:"t-corr-q3-apres", vue:"tablette", render:function(){ return Tablette(EcrCorr(J, 2, "revele"), EcrCorr(M, 2, "revele")); }},
  {id:"t-corr-q1-apres", vue:"tablette", render:function(){ return Tablette(EcrCorr(J, 0, "revele"), EcrCorr(M, 0, "revele")); }},
  {id:"c-corr-q1-apres", vue:"console", render:function(){ return PilotCorrection(0, true); }},
  // Fin
  {id:"t-bilan", vue:"tablette", render:function(){ return Tablette(EcrBilan(J), EcrBilan(M)); }},
  {id:"c-bilan", vue:"console", render:function(){ return BilanClasse(); }},
  {id:"t-fin", vue:"tablette", render:function(){ return EcrCombien(); }},
  // Le soir
  {id:"c-resultats", vue:"console", render:function(){ return Resultats(false, false); }},
  {id:"c-fiche", vue:"console", render:function(){ return Resultats(true, false, true); }},
  {id:"c-que-dit-la-feuille", vue:"console", render:function(){ return Resultats(true, true, true); }},
  // Annexe (364)
  {id:"t-annexe", vue:"tablette", render:function(){ return Tablette(EcrReponse(J, 2, [0, 1, 2, 3, 4, 5], [1, 2, 4], 18, EV3E), Voile(J, false)); }}
];
/* la liste des scènes et le rendu sont à la fin de maquette2.js (tour 603) */

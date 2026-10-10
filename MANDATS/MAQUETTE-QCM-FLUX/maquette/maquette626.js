/* Tour 626 — le bilan général de l'élève, cloné de la correction de dictée (« Bilan général », generateBilan) :
   dans sa fiche (capture 42), pré-rempli, modifiable, « ↻ Regénérer », « ✓ Valider le bilan » ; puis à la fin de son bilan, quand sa copie lui est rendue. */
function Pz626(t){ return h("span", {className:"prov"}, t); }
var COMP_LONG = {
  "c4-culture-01":"Mobiliser des références culturelles pour interpréter les textes et les créations artistiques et littéraires et pour enrichir son expression personnelle",
  "c4-lire-01":"Contrôler sa compréhension, devenir un lecteur autonome"
};
function phrasesDe626(p){
  var r = calc(p), m = maitriseDe(r.sur20), idx = ["rouge","orange","bleu","vert"];
  var est = ESTIM[p];
  if(p === "Lou"){   // le bilan de Lou de la capture 66 : 1 / 3 (Q3 corrigée d'après sa feuille), elle pensait 2 bonnes réponses
    r = {pts:[1, 0, 0], sur20:20/3, comp:{"c4-culture-01":{n:1, max:3}, "c4-lire-01":{n:1, max:3}}}; m = maitriseDe(r.sur20); est = "bleu";
  }
  var iE = idx.indexOf(est), iR = idx.indexOf(m.k);
  return commentaireQCM({
    niveau: m.k,
    comps: COMPS.map(function(c){ return {lib: COMP_LONG[c], niveau: niveauComp(r, c).k}; }),
    autonomieRetiree: false,
    facilesRatees: EV.questions.filter(function(q, i){ return !r.pts[i] && (q.niveau === "facile" || tauxQ(i) >= 50); }).length,
    difficilesReussies: EV.questions.filter(function(q, i){ return r.pts[i] && (q.niveau === "approfondi" || q.niveau === "expert"); }).length,
    estimation: est ? (iE === iR ? "ok" : iE > iR ? "sur" : "sous") : null, ecart: Math.abs(iE - iR)});
}
function texte626(ph){ var out = []; ph.forEach(function(x, i){ if(i) out.push(" "); out.push(x.p ? Pz626(x.t) : x.t); }); return out; }
function CarteBilan626(p){
  return h("div", {className:"card bilan626"},
    h("h3", null, "📝 Bilan général", InfoI("Texte pré-rempli automatiquement à partir de ses résultats : sa note, ses compétences, son point d'autonomie, ses questions ratées ou réussies, son estimation. Modifie-le si tu veux, puis valide. C'est ce texte qui finit son bilan quand sa copie lui est rendue, et qui va dans la ligne « Commentaire » du PDF « notes et compétences ».")),
    h("div", {className:"ta626"}, texte626(phrasesDe626(p))),
    h("div", {className:"pied626"},
      h("span", {className:"st626"}, "⚠ Modifications non validées"),
      h("div", {style:{display:"flex", gap:6}},
        h("button", {className:"btn btn-ghost btn-sm"}, "↻ Regénérer"),
        h("button", {className:"btn btn-primary btn-sm"}, "✓ Valider le bilan"))));
}
function BilanLou626(){
  var el = BilanLou(), carte = el.props.children[1];
  var bloc = h("div", {key:"b626", className:"bilan-bloc bilan626-eleve"}, h("h3", null, "📝 Bilan"), h("p", null, texte626(phrasesDe626("Lou"))));
  return React.cloneElement(el, null, el.props.children[0], React.cloneElement(carte, null, [].concat(carte.props.children, [bloc])));
}
function Resultats626(fiche, modale, sansTableau){
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
  ficheEl = fiche && h(F, null, ficheEl, CarteBilan626("Michel"));
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


var SCENES_626 = [
  {id:"x626-1-fiche-bilan", vue:"console", render:function(){ return Resultats626(true, false, true); }},
  {id:"x626-2-eleve-bilan", vue:"eleve", render:BilanLou626}
];
SCENES = SCENES.concat(SCENES_626);
window.LISTE_SCENES = SCENES.map(function(s){ return {id:s.id, vue:s.vue, vh:s.vh || null}; });
rendre();

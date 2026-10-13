/* ════════ Maquette de la conscience n°12, 13/10/2026 (Paul, 15:55 : « du séquentiel effectivement, et 1077, oui, l'app pose des questions, auxquelles je réponds par oui ou non ») ════════
   « 📄 Lire les copies » : le soir, une copie après l'autre, dans l'ordre alphabétique de la pile ; pour chaque ligne à lire de cette copie,
   une question à laquelle Paul répond « Oui » ou « Autre chose ». Écrit dans le code réel de l'app (PROTOCOLE-MAQUETTE §00), sur ses
   lectures et ses gestes d'aujourd'hui : « ✅ Oui » = « ✔ Marquer lue » (marquerLueV) ; « ✏️ Autre chose » = « Que dit la feuille ? » (feuilleDitV). */
function LireCopiesVue(){ return Console("donnees", "results", h(LireCopiesV), false); }
function LireCopiesV(){ return h(LireCopiesC, {key:seanceParam() || "-"}); }
// la question que l'app pose à Paul pour une ligne à lire : ce que le voisin a lu, à vérifier sur la copie
function questionDuSoirV(se, x){
  var q = se.ev.questions[x.q], l = lectureV(se, x.q, x.p), lu = l ? l.choix : null, t = tabletteV(se, x.q, x.p), clic = t ? t.choix : null;
  var lec = l && l.par && l.par !== "prof" ? l.par : voisinV(se, x.p), lecP = lec ? prenomEleveV(se, lec) : null, dit = ((se.S.b || {})[x.q] || {})[x.p];
  var aide = [x.sorte === "co" ? prenomEleveV(se, x.p) + " " + String(x.txt || "").replace(/^🤔 /, "") : null, lecP ? "lu par " + lecP : null, clic ? "tablette : " + choixTexteV(q, clic) : "pas de clic sur la tablette",
    dit === "oui" ? "a dit : la même chose" : dit === "non" ? "a dit : autre chose" : "n'a rien dit"].filter(Boolean).join(" · ");
  if(lu === "aucun") return {texte:"La copie ne dit-elle aucun des choix ?", oui:"✅ Oui, aucun", non:"✏️ Elle dit un choix", aide:aide};
  if(lu && lu.length) return {texte:"La copie dit-elle « " + choixTexteV(q, lu) + " » ?", oui:"✅ Oui", non:"✏️ Autre chose", aide:aide};
  return {texte:"Que dit la copie ?", oui:null, non:"✏️ Je clique ce qu'elle dit", aide:aide};
}
function LireCopiesC(){
  useV3();
  var s1 = useState(null), cur = s1[0], setCur = s1[1], s2 = useState(null), ouvert = s2[0], setOuvert = s2[1], s3 = useState([]), sel = s3[0], setSel = s3[1];
  var se = seanceV(seanceParam());
  if(!se) return h("div", {className:"card"}, h("p", null, "Chargement…"));
  var sq = "&seance=" + encodeURIComponent(se.id), lire = aLireV(se);
  // les copies qui ont une ligne à lire, dans l'ordre alphabétique de la pile
  var parCopie = {}; lire.forEach(function(x){ (parCopie[x.p] = parCopie[x.p] || []).push(x); });
  var copies = Object.keys(parCopie).map(function(p){ return {p:p, nom:nomEleveV(se, p), lignes:parCopie[p].slice().sort(function(a, b){ return a.q - b.q; })}; })
    .sort(function(a, b){ return a.nom.localeCompare(b.nom, "fr"); });
  var restantes = copies.filter(function(c){ return c.lignes.some(function(x){ return !x.lue; }); });
  var i = cur != null ? copies.map(function(c){ return c.p; }).indexOf(cur) : -1;
  if(i < 0) i = restantes.length ? copies.indexOf(restantes[0]) : -1;
  var c = i >= 0 ? copies[i] : null;
  function aller(j){ setCur(copies[j] ? copies[j].p : null); setOuvert(null); setSel([]); }
  function suivanteApres(p){ var j = copies.map(function(x){ return x.p; }).indexOf(p), n = copies.length;
    for(var k = 1; k <= n; k++){ var cc = copies[(j + k) % n]; if(cc.p !== p && cc.lignes.some(function(x){ return !x.lue; })) return cc.p; } return null; }
  // la copie finie : la suivante qui a encore une question
  function apres(x){ var reste = c.lignes.filter(function(y){ return !y.lue && y.id !== x.id; }).length; setOuvert(null); setSel([]); if(!reste) setCur(suivanteApres(c.p)); }
  var titre = TitreCarte("📄 Lire les copies — " + se.ev.titre + " — " + se.classe, [h("button", {key:1, className:"btn btn-ghost btn-sm", "data-va":"c-resultats" + sq, title:"Revient au tableau de la séance. Ce que tu as déjà répondu reste enregistré."}, "← Tableau de la séance")]);
  if(!restantes.length) return h("div", {className:"card"}, titre,
    h("div", {style:{textAlign:"center", padding:"2rem 1rem"}}, h("div", {style:{fontSize:"1.4rem", fontWeight:900, color:"#15803D"}}, "✅ Les " + copies.length + " copies sont lues."),
      h("p", {style:{color:"var(--gris)"}}, "Les notes tiennent compte de ce que tu as répondu."),
      h("button", {className:"btn btn-primary", "data-va":"c-rendre" + sq, title:"Ouvre la garde de « Rendre les copies » : les élèves voient alors leur bilan définitif."}, "📤 Rendre les copies")));
  var faites = copies.length - restantes.length, q = null;
  return h("div", {className:"card", "data-lire-copies":se.id}, titre,
    h("div", {style:{display:"flex", alignItems:"center", gap:".8rem", margin:".3rem 0 1rem"}},
      h("div", {style:{flex:1, height:"10px", background:"#EEE8FF", borderRadius:"6px", overflow:"hidden"}}, h("div", {style:{width:Math.round(100 * faites / copies.length) + "%", height:"100%", background:"var(--violet)"}})),
      h("span", {style:{fontWeight:800, whiteSpace:"nowrap"}}, "Copie " + (i + 1) + " sur " + copies.length + " · encore " + restantes.length + " à lire")),
    h("div", {style:{border:"3px solid var(--violet)", borderRadius:"14px", padding:"1rem 1.2rem", background:"#FBFAFF"}},
      h("div", {style:{fontSize:"1.6rem", fontWeight:900, marginBottom:".8rem"}}, "📄 " + c.nom),
      c.lignes.map(function(x){
        var qq = se.ev.questions[x.q], qs = questionDuSoirV(se, x), ici = ouvert === x.id;
        return h("div", {key:x.id, "data-ligne":x.id, style:{padding:".8rem 0", borderTop:"1px solid #E5E0F5", opacity:x.lue && !ici ? .55 : 1}},
          h("div", {style:{fontSize:".9rem", color:"var(--gris)", marginBottom:".2rem"}}, h("strong", null, "Question " + (x.q + 1)), " · " + qq.enonce),
          x.lue && !ici ? h("div", {style:{fontWeight:800, color:"#15803D"}}, "✔ " + (x.corrigee ? "corrigée d'après la copie" : "lue"))
          : h(F, null,
            h("div", {style:{fontSize:"1.25rem", fontWeight:900, margin:".2rem 0 .5rem"}}, qs.texte),
            !ici && h("div", {style:{display:"flex", gap:".6rem", flexWrap:"wrap"}},
              qs.oui && h("button", {className:"btn btn-primary", "data-local":"1", title:"La copie dit bien cela : la ligne est lue, la note ne change pas.", onClick:function(){ marquerLueV(se, x.id).then(function(){ apres(x); }); }}, qs.oui),
              h("button", {className:"btn btn-ghost", "data-local":"1", title:"La copie dit autre chose : tu cliques ce qu'elle dit, et la note se recalcule (« Corrigé d'après ta feuille » dans son bilan).", onClick:function(){ setOuvert(x.id); setSel([]); }}, qs.non)),
            ici && h("div", null,
              h("div", {style:{fontWeight:800, margin:".2rem 0 .4rem"}}, "Que dit la copie ?"),
              h("div", {className:"eleve-choix"}, qq.choix.map(function(t, k){ var on = sel !== "aucun" && sel.indexOf(k) >= 0;
                return h("button", {key:k, className:"eleve-choix-btn" + (on ? " selected" : ""), "data-local":"1", title:"Ce choix est sur la copie.", onClick:function(){ var a = sel === "aucun" ? [] : sel; setSel(on ? a.filter(function(y){ return y !== k; }) : a.concat([k])); }}, h("span", null, t)); }),
                h("button", {className:"eleve-choix-btn aucun" + (sel === "aucun" ? " selected" : ""), "data-local":"1", title:"La copie ne dit aucun des choix.", onClick:function(){ setSel(sel === "aucun" ? [] : "aucun"); }}, "Aucun de ces choix")),
              h("div", {style:{display:"flex", gap:".6rem", marginTop:".6rem"}},
                h("button", {className:"btn btn-primary", "data-local":"1", disabled:sel !== "aucun" && !sel.length, title:"Enregistre ce que dit la copie : la note se recalcule.", onClick:function(){ feuilleDitV(se, x.p, x.q, sel).then(function(){ apres(x); }); }}, "✔ Valider"),
                h("button", {className:"btn btn-ghost", "data-local":"1", title:"Revient à la question, sans rien changer.", onClick:function(){ setOuvert(null); setSel([]); }}, "Annuler"))),
            h("div", {style:{fontSize:".8rem", color:"var(--gris)", marginTop:".4rem"}}, qs.aide)));
      })),
    h("div", {style:{display:"flex", justifyContent:"space-between", marginTop:".8rem"}},
      h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:i <= 0, title:"La copie d'avant dans la pile.", onClick:function(){ aller(i - 1); }}, "← Copie précédente"),
      h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", disabled:i >= copies.length - 1, title:"La copie suivante dans la pile ; celle-ci reste à lire.", onClick:function(){ aller(i + 1); }}, "Copie suivante →")));
}
ECRANS_SOIR_V["c-lire-copies"] = LireCopiesVue; if(ECRANS_SOIR.indexOf("c-lire-copies") < 0) ECRANS_SOIR.push("c-lire-copies");

/* ════════ Maquette de la conscience n°12, 13/10/2026, version 2 (Paul, 15:55 et 16:08) ════════
   « 📄 Lire les copies » : le soir, Paul prend les copies dans l'ordre de son tas, tape les initiales de chacune (comme la fin de copie
   de correction_dictee, « DM pour Dupont Marie »), et l'app ne lui pose que les questions qui ont besoin de sa lecture, une par une,
   « Oui » ou « Autre chose » ; après chaque réponse, elle lui dit ce qu'il écrit sur la copie. Écrit dans le code réel de l'app
   (PROTOCOLE-MAQUETTE §00), sur ses lectures et ses gestes : « ✅ Oui » = « ✔ Marquer lue » (marquerLueV) ;
   « ✏️ Autre chose » puis « ✔ Valider » = « Que dit la feuille ? » (feuilleDitV). */
function LireCopiesVue(){ return Console("donnees", "results", h(LireCopiesV), false); }
function LireCopiesV(){ return h(LireCopiesC, {key:seanceParam() || "-"}); }
function sansAccentL(s){ return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase(); }
// les initiales, comme correction_dictee (matchEleveInitials) : NP ou PN, puis le début ou un morceau du nom ou du prénom ; « ze » trouve Zélia
function initialesL(nomComplet, q){
  q = sansAccentL(q).replace(/\s+/g, ""); if(!q) return false;
  var p = String(nomComplet || "").split(" "), i = 0; while(i < p.length - 1 && p[i] === p[i].toUpperCase() && /[A-ZÀ-Ý]/.test(p[i])) i++;
  var nom = sansAccentL(p.slice(0, i).join(" ")), pre = sansAccentL(p.slice(i).join(" ")), n1 = nom.charAt(0), p1 = pre.charAt(0);
  if(q.length === 2 && (n1 + p1 === q || p1 + n1 === q)) return true;
  return nom.indexOf(q) === 0 || pre.indexOf(q) === 0 || nom.indexOf(q) >= 0 || pre.indexOf(q) >= 0;
}
// la question que l'app pose à Paul : ce que le voisin a lu, à vérifier sur la copie
function questionDuSoirV(se, x){
  var q = se.ev.questions[x.q], l = lectureV(se, x.q, x.p), lu = l ? l.choix : null, t = tabletteV(se, x.q, x.p), clic = t ? t.choix : null;
  var lec = l && l.par && l.par !== "prof" ? l.par : voisinV(se, x.p), lecP = lec ? prenomEleveV(se, lec) : null, dit = ((se.S.b || {})[x.q] || {})[x.p];
  var aide = [x.sorte === "co" ? prenomEleveV(se, x.p) + " " + String(x.txt || "").replace(/^🤔 /, "") : null, lecP ? "lu par " + lecP : null,
    clic ? "tablette : " + choixTexteV(q, clic) : "pas de clic sur la tablette", dit === "oui" ? "a dit : la même chose" : dit === "non" ? "a dit : autre chose" : "n'a rien dit"].filter(Boolean).join(" · ");
  var luJ = lu && lu !== "aucun" && memesChoixV(lu, q.bonnes);
  if(lu === "aucun") return {texte:"La copie ne dit-elle aucun des choix ?", oui:"✅ Oui, aucun", non:"✏️ Elle dit un choix", aide:aide, luJ:false};
  if(lu && lu.length) return {texte:"La copie dit-elle « " + choixTexteV(q, lu) + " » ?", oui:"✅ Oui", non:"✏️ Autre chose", aide:aide, luJ:luJ};
  return {texte:"Que dit la copie ?", oui:null, non:"✏️ Je clique ce qu'elle dit", aide:aide, luJ:false};
}
// ce que Paul écrit sur la copie : la marque de la correction en classe suivait la lecture du voisin (V vert, ou barré en rouge et la bonne réponse en vert)
function aEcrireL(q, avantJ, apresJ){
  if(avantJ === apresJ) return "✍️ Sur la copie : rien à changer.";
  if(avantJ && !apresJ) return "✍️ Sur la copie : barre le V vert, et écris en vert la bonne réponse : « " + choixTexteV(q, q.bonnes) + " ».";
  return "✍️ Sur la copie : barre la correction en rouge, et mets un V vert.";
}
function LireCopiesC(){
  useV3();
  var s1 = useState(null), cur = s1[0], setCur = s1[1], s2 = useState(null), ouvert = s2[0], setOuvert = s2[1], s3 = useState([]), sel = s3[0], setSel = s3[1];
  var s4 = useState(""), rech = s4[0], setRech = s4[1], s5 = useState({}), faits = s5[0], setFaits = s5[1];
  var se = seanceV(seanceParam());
  if(!se) return h("div", {className:"card"}, h("p", null, "Chargement…"));
  var sq = "&seance=" + encodeURIComponent(se.id), lire = aLireV(se), ev = se.ev;
  var parCopie = {}; lire.forEach(function(x){ (parCopie[x.p] = parCopie[x.p] || []).push(x); });
  var eleves = se.presents.map(function(e){ return {p:e.slug, nom:e.nom, lignes:(parCopie[e.slug] || []).slice().sort(function(a, b){ return a.q - b.q; })}; });
  var aLireN = eleves.filter(function(c){ return c.lignes.some(function(x){ return !x.lue; }); }).length, nQ = lire.filter(function(x){ return !x.lue; }).length;
  var c = cur ? eleves.filter(function(e){ return e.p === cur; })[0] : null;
  var props = rech.trim() ? eleves.filter(function(e){ return e.p !== cur && initialesL(e.nom, rech); }).slice(0, 6) : [];
  function ouvrir(e){ setCur(e.p); setRech(""); setOuvert(null); setSel([]); }
  function noteDe(p){ var r = resultatV(se, p); return r ? fr1(r.n) + " / " + r.total : "—"; }
  function repondu(x, avantJ, apresJ, avantNote){ var o = Object.assign({}, faits); o[x.id] = {ecrire:aEcrireL(ev.questions[x.q], avantJ, apresJ), avantNote:avantNote}; setFaits(o); setOuvert(null); setSel([]); }
  var titre = TitreCarte("📄 Lire les copies — " + ev.titre + " — " + se.classe, [h("button", {key:1, className:"btn btn-ghost btn-sm", "data-va":"c-resultats" + sq, title:"Revient au tableau de la séance. Ce que tu as déjà répondu reste enregistré."}, "← Tableau de la séance")]);
  var compte = h("div", {style:{fontWeight:800, margin:".2rem 0 1rem"}}, aLireN ? "📌 Encore " + aLireN + " copie" + (aLireN > 1 ? "s" : "") + " à lire, " + nQ + " question" + (nQ > 1 ? "s" : "") + " en tout · les autres copies n'ont rien à lire" : "✅ Toutes les copies sont lues.");
  // le champ des initiales : au début, et à la fin de chaque copie
  var champ = h("div", {style:{maxWidth:420, marginTop:c ? "1rem" : 0}},
    h("div", {style:{fontSize:".9rem", color:"var(--gris)", marginBottom:4}}, c ? "Copie suivante de ton tas — tape ses initiales (DM pour Dupont Marie), puis Entrée :" : "Prends la première copie de ton tas et tape ses initiales (DM pour Dupont Marie), puis Entrée :"),
    h("input", {type:"text", value:rech, autoFocus:true, "data-initiales":"1", placeholder:"DM…", title:"Les initiales de l'élève dont tu tiens la copie (nom puis prénom, ou prénom puis nom). Entrée ouvre le premier proposé.",
      onChange:function(e){ setRech(e.target.value); }, onKeyDown:function(e){ if(e.key === "Enter"){ e.preventDefault(); if(props.length) ouvrir(props[0]); } else if(e.key === "Escape") setRech(""); },
      style:{width:"100%", padding:"8px 10px", border:"2px solid var(--violet)", borderRadius:8, fontSize:"1.05rem", boxSizing:"border-box"}}),
    props.map(function(e, ii){ var n = e.lignes.filter(function(x){ return !x.lue; }).length;
      return h("div", {key:e.p, className:"lire-prop", "data-local":"1", onClick:function(){ ouvrir(e); }, title:"Ouvre cette copie.",
        style:{padding:"5px 10px", marginTop:3, borderRadius:6, cursor:"pointer", background:ii === 0 ? "#EEE8FF" : "transparent", fontWeight:ii === 0 ? 800 : 500, display:"flex", justifyContent:"space-between", gap:8}},
        h("span", null, e.nom), h("span", {style:{fontSize:".8rem", color:n ? "#9A3412" : "var(--gris)"}}, n ? n + " question" + (n > 1 ? "s" : "") + " à lire" : e.lignes.length ? "✔ lue" : "rien à lire")); }),
    rech.trim() && !props.length && h("div", {style:{fontSize:".85rem", color:"var(--gris)", marginTop:4}}, "Aucun élève ne correspond."));
  if(!c) return h("div", {className:"card", "data-lire-copies":se.id}, titre, compte, champ);
  var restent = c.lignes.filter(function(x){ return !x.lue; }).length;
  return h("div", {className:"card", "data-lire-copies":se.id}, titre, compte,
    h("div", {style:{border:"3px solid var(--violet)", borderRadius:"14px", padding:"1rem 1.2rem", background:"#FBFAFF"}},
      h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:".8rem", flexWrap:"wrap"}},
        h("div", {style:{fontSize:"1.6rem", fontWeight:900}}, "📄 " + c.nom), h("div", {style:{fontWeight:800}}, "Note : " + noteDe(c.p))),
      !c.lignes.length ? h("div", {style:{fontSize:"1.15rem", fontWeight:800, color:"#15803D", marginTop:".6rem"}}, "Rien à lire sur cette copie : mets-la de côté.")
      : c.lignes.map(function(x){
        var qq = ev.questions[x.q], qs = questionDuSoirV(se, x), ici = ouvert === x.id, f = faits[x.id];
        return h("div", {key:x.id, "data-ligne":x.id, style:{padding:".8rem 0", borderTop:"1px solid #E5E0F5"}},
          h("div", {style:{fontSize:".9rem", color:"var(--gris)", marginBottom:".2rem"}}, h("strong", null, "Question " + (x.q + 1)), " · " + qq.enonce),
          x.lue ? h("div", null, h("div", {style:{fontWeight:800, color:"#15803D"}}, "✔ " + (x.corrigee ? "corrigée d'après la copie" : "lue")),
              f && h("div", {style:{fontSize:"1.1rem", fontWeight:900, marginTop:".3rem"}}, f.ecrire),
              f && f.avantNote !== noteDe(c.p) && h("div", {style:{fontWeight:800, marginTop:".2rem"}}, "✍️ Et la note : " + f.avantNote + " → " + noteDe(c.p) + "."))
          : h(F, null,
            h("div", {style:{fontSize:"1.25rem", fontWeight:900, margin:".2rem 0 .5rem"}}, qs.texte),
            !ici && h("div", {style:{display:"flex", gap:".6rem", flexWrap:"wrap"}},
              qs.oui && h("button", {className:"btn btn-primary", "data-local":"1", title:"La copie dit bien cela : la ligne est lue, la note ne change pas.", onClick:function(){ var n0 = noteDe(c.p); marquerLueV(se, x.id).then(function(){ repondu(x, qs.luJ, qs.luJ, n0); }); }}, qs.oui),
              h("button", {className:"btn btn-ghost", "data-local":"1", title:"La copie dit autre chose : tu cliques ce qu'elle dit, et la note se recalcule (« Corrigé d'après ta feuille » dans son bilan).", onClick:function(){ setOuvert(x.id); setSel([]); }}, qs.non)),
            ici && h("div", null,
              h("div", {style:{fontWeight:800, margin:".2rem 0 .4rem"}}, "Que dit la copie ?"),
              h("div", {className:"eleve-choix"}, qq.choix.map(function(t, k){ var on = sel !== "aucun" && sel.indexOf(k) >= 0;
                return h("button", {key:k, className:"eleve-choix-btn" + (on ? " selected" : ""), "data-local":"1", title:"Ce choix est sur la copie.", onClick:function(){ var a = sel === "aucun" ? [] : sel; setSel(on ? a.filter(function(y){ return y !== k; }) : a.concat([k])); }}, h("span", null, t)); }),
                h("button", {className:"eleve-choix-btn aucun" + (sel === "aucun" ? " selected" : ""), "data-local":"1", title:"La copie ne dit aucun des choix.", onClick:function(){ setSel(sel === "aucun" ? [] : "aucun"); }}, "Aucun de ces choix")),
              h("div", {style:{display:"flex", gap:".6rem", marginTop:".6rem"}},
                h("button", {className:"btn btn-primary", "data-local":"1", disabled:sel !== "aucun" && !sel.length, title:"Enregistre ce que dit la copie : la note se recalcule.", onClick:function(){ var n0 = noteDe(c.p), apJ = sel !== "aucun" && memesChoixV(sel, qq.bonnes); feuilleDitV(se, x.p, x.q, sel).then(function(){ repondu(x, qs.luJ, apJ, n0); }); }}, "✔ Valider"),
                h("button", {className:"btn btn-ghost", "data-local":"1", title:"Revient à la question, sans rien changer.", onClick:function(){ setOuvert(null); setSel([]); }}, "Annuler"))),
            h("div", {style:{fontSize:".8rem", color:"var(--gris)", marginTop:".4rem"}}, qs.aide)));
      }),
      (!restent || !c.lignes.length) && champ));
}
ECRANS_SOIR_V["c-lire-copies"] = LireCopiesVue; if(ECRANS_SOIR.indexOf("c-lire-copies") < 0) ECRANS_SOIR.push("c-lire-copies");

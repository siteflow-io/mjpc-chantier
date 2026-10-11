/* ═══════════════ Complément 3 — côté élève, chaque clic se voit (changement 7) ═══════════════
   Le clavier de l'app tape : ses touches sont des boutons, chacune écrit dans le champ en cours, « ⌫ » efface, « ✓ » fait comme
   « Entrer → ». « Entrer » vérifie les champs, avec les messages de la 7.7.1 (l. 2729 à 2750). « 📊 Mes évaluations » s'ouvre
   sur la moitié de l'élève qui l'a cliqué, et n'est pas là pendant un tour chronométré. */

/* ── Le clavier de l'app ── */
function Clavier(chiffres, surTouche, maj){
  function t(c, cls, w){ return h("button", {key:c + (cls || ""), type:"button", className:"tc" + (cls ? " " + cls : "") + (c === "⇧" && maj ? " on" : ""), style:w ? {minWidth:w} : null, "data-local":"1",
    onMouseDown:function(e){ e.preventDefault(); }, onClick:function(){ if(surTouche) surTouche(c); }}, c); }
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
// une touche dans un champ : « ⌫ » efface la dernière lettre, « espace » met une espace, « ⇧ » met la suivante en majuscule
function taper(v, c, maj){ return c === "⌫" ? v.slice(0, -1) : c === "espace" ? v + " " : c === "⇧" ? v : v + (maj ? c.toUpperCase() : c); }

/* ── « 👋 Identifie-toi » : les trois champs, le clavier, « Entrer → » qui vérifie ── */
function codeDe(nom){ return (typeof CODES_ESSAI !== "undefined" && CODES_ESSAI[nom]) || null; }
function eleveDeNom(prenom, nom){
  var p = String(prenom).trim().toLowerCase(), n = String(nom).trim().toLowerCase();
  return NOMS_ESSAI.filter(function(x){ var i = x.indexOf(" "); return x.slice(i + 1).toLowerCase() === p && x.slice(0, i).toLowerCase() === n; })[0] || null;
}
function LoginMoitie(p){
  var s = useState({code:p.code || "", prenom:p.prenom || "", nom:p.nom || "", champ:p.champ || "code", err:p.err || "", maj:false}), st = s[0], set = s[1];
  function maj(o){ set(Object.assign({}, st, o)); }
  function entrer(){
    if(!st.prenom.trim() || !st.nom.trim()) return maj({err:"Renseigne ton prénom et ton nom."});
    if(!st.code.trim()) return maj({err:"Entre ton code personnel (4 chiffres)."});
    var qui = eleveDeNom(st.prenom, st.nom);
    if(!qui) return maj({err:"Élève introuvable dans la classe. Vérifie l'orthographe."});
    if(!codeDe(qui)) return maj({err:"Ton code n'est pas encore enregistré : lève la main."});
    if(codeDe(qui) !== st.code) return maj({err:"Ce code ne correspond pas. Vérifie tes 4 chiffres."});
    versScene(p.suite);
  }
  function touche(c){
    if(c === "✓") return entrer();
    if(c === "⇧") return maj({maj:!st.maj});
    var o = {err:"", maj:false}; o[st.champ] = st.champ === "code" ? taper(st.code, c).replace(/\D/g, "").slice(0, 4) : taper(st[st.champ], c, st.maj); maj(o);
  }
  // le champ se tape au clavier de l'app ; le clavier de l'ordinateur y écrit aussi (inputMode none : la tablette n'ouvre pas le sien)
  function champ(c, ph, extra){ return h("input", Object.assign({inputMode:"none", value:st[c], placeholder:ph, className:st.champ === c ? "focus" : "", "data-champ":c, onFocus:function(){ if(st.champ !== c) maj({champ:c}); }, onClick:function(){ maj({champ:c}); },
    onChange:function(e){ var o = {err:"", champ:c}; o[c] = c === "code" ? e.target.value.replace(/\D/g, "").slice(0, 4) : e.target.value; maj(o); }}, extra || {})); }
  return Page(null, "👋 Identifie-toi", h("div", {className:"eleve-form"},
    champ("code", "Mon code (4 chiffres)", {style:{textAlign:"center", letterSpacing:".3em", fontWeight:700}}),
    champ("prenom", "Prénom"), champ("nom", "Nom"),
    st.err && h("div", {className:"eleve-erreur"}, st.err),
    Clavier(st.champ === "code", touche, st.maj),
    h("button", {className:"btn-accueil", "data-local":"1", onClick:entrer}, "Entrer →")));
}
function EcrLogin(s){ return h(LoginMoitie, Object.assign({suite:"t-binome"}, s)); }
function EcrLoginInconnu(){ return h(LoginMoitie, {code:"7319", prenom:"Julien", nom:"ABRIAL", champ:"nom", err:"Ton code n'est pas encore enregistré : lève la main.", suite:"t-binome"}); }
refaire("t-login-inconnu", function(){ return Tablette(EcrLoginInconnu(), EcrLogin({code:(codeDe("DUVERNAY Michel") || "").slice(0, 2), champ:"code"})); });

/* ── Le code du binôme : les quatre chiffres, masqués ; « Entrer » vérifie ── */
function BinomeMoitie(p){
  var e = p.e, s = useState({code:p.code || "", err:""}), st = s[0], set = s[1];
  function entrer(){
    if(st.code.length < 4) return set({code:st.code, err:"Entre ton code personnel (4 chiffres)."});
    if(codeDe(e.nom) !== st.code) return set({code:st.code, err:"Ce code ne correspond pas. Vérifie tes 4 chiffres."});
    versScene(p.suite || "t-attest-1");
  }
  function touche(c){ if(c === "✓") return entrer(); set({code:taper(st.code, c).replace(/\D/g, "").slice(0, 4), err:""}); }
  return Page(null, null, h("div", {style:{textAlign:"left"}},
    h("div", {style:{fontWeight:900, fontSize:"1.25rem", margin:"6px 0 10px", color:"var(--violet)"}}, "Ton binôme : " + e.nom),
    h("div", {style:{fontWeight:700}}, e.prenom + ", tape ton code à 4 chiffres :"),
    h("div", {className:"codebox", "data-champ":"code"}, st.code.replace(/./g, "•")),
    st.err && h("div", {className:"eleve-erreur"}, st.err),
    Clavier(true, touche),
    h("div", {style:{textAlign:"center"}}, h("button", {className:"btn-accueil", "data-local":"1", onClick:entrer}, "Entrer")),
    h("div", {style:{marginTop:10, textAlign:"center"}}, h("button", {className:"btn btn-ghost btn-sm", "data-va":"t-login"}, "Pas là ? Choisir un autre élève"))));
}
function EcrBinome(e, code){ return h(BinomeMoitie, {e:e, code:code}); }
function EcrCombien(){
  return Page(null, "Combien êtes-vous sur cette tablette ?",
    h("div", {className:"combien"},
      h("button", {className:"btn btn-ghost", "data-va":"t-un-eleve"}, "👤 1 élève"),
      h("button", {className:"btn btn-primary", "data-va":"t-login"}, "👥 2 élèves")));
}
refaire("t-login", function(){ return Tablette(EcrLogin({code:codeDe("ABRIAL Julien"), prenom:"Julien", nom:"ABR", champ:"nom"}), EcrLogin({code:(codeDe("DUVERNAY Michel") || "").slice(0, 2), champ:"code"})); });

/* ── « 📊 Mes évaluations », sur la moitié de l'élève ; jamais pendant un tour chronométré ── */
function ListeMesEvals(p){
  var k = MO(), items = SCN.mesEvaluations(p, k);
  return h("div", {className:"eleves-grid", style:{gridTemplateColumns:"1fr"}}, items.map(function(x, i){
    var n = x.note, mt = n ? MAITRISE.filter(function(y){ return y.k === (n.maitrise && n.maitrise.k ? n.maitrise.k : SCN.maitriseDe(n.sur20)); })[0] : null;
    var ligne = n ? x.date + " · " + n.n + " / " + n.total + " · " + fr1(n.sur20) + " / 20 · " + mt.em + " " + mt.lib : null;
    var actif = x.etat === "bilan" && x.seance === "S08";
    if(x.etat === "bilan" && !actif) return h("div", {key:i, className:"eleve-btn mes-ev"}, h("div", {style:{fontWeight:700}}, x.titre), h("div", {style:{fontSize:".86rem", opacity:.9, marginTop:".2rem"}}, ligne));
    return h(actif ? "button" : "div", {key:i, className:"eleve-btn mes-ev " + x.etat, "data-va":actif ? "e-bilan-lou&eleve=" + encodeURIComponent(p) : null},
      h("div", {style:{fontWeight:700}}, x.titre),
      h("div", {style:{fontSize:".86rem", opacity:.9, marginTop:".2rem"}},
        x.etat === "relecture" ? "En relecture : ta note sera visible quand ta copie te sera rendue" : x.etat === "absente" ? (SCN.SEXE[p] === "F" ? "Tu étais absente" : "Tu étais absent") : ligne));
  }));
}
function MesEvaluations(){ return h(MesEvaluationsC); }
// « ← Retour » : chez elle, l'élève revient à l'accueil de l'app, sur le même appareil (garde 12)
function MesEvaluationsC(){
  var p = paramHash("eleve") || "Lou", s = useState(false), retour = s[0], setRetour = s[1];
  if(retour) return h(AccueilC);
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card", style:{maxWidth:"700px"}},
      h("h1", null, "📊 Mes évaluations"), h("p", {style:{opacity:.8}}, nomDe(p)), ListeMesEvals(p),
      h("div", {style:{marginTop:"1.5rem"}}, h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", onClick:function(){ if(vientDUnGeste()) history.back(); else setRetour(true); }}, "← Retour"))));
}
var TOUR_CHRONO = {reponse:1, passage:1, b:1, lecture:1};
function PageMoitie(p){
  var s = useState(false), ouvert = s[0], set = s[1];
  var prenom = (/· ([^·]+)$/.exec(p.badge || "") || [, ""])[1].trim().split(" ").slice(1).join(" ");
  var chrono = TOUR_CHRONO[MOM().ph];
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card"},
      h("div", {className:"eleve-tete"}, h("div", {className:"eleve-classe-badge"}, p.badge),
        prenom && h("button", {className:"btn btn-ghost btn-sm mes-evals", "data-local":"1", onClick:function(){ set(!ouvert); }}, ouvert ? "← Retour" : "📊 Mes évaluations")),
      ouvert ? h(F, null, h("h1", null, "📊 Mes évaluations"), ListeMesEvals(prenom)) : h(F, null, p.titre && h("h1", null, p.titre), p.enfants)));
}
function Page(badge, titre, enfants){
  var surTablette = badge && /^t-/.test(window.SCENE_COURANTE || "");
  if(surTablette) return h(PageMoitie, {badge:badge, titre:titre, enfants:enfants});
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card"}, badge && h("div", {className:"eleve-classe-badge"}, badge), titre && h("h1", null, titre), enfants));
}

/* ── L'attestation : « Je commence » met cette moitié en attente, seule ; l'autre moitié en est où elle en est (relecteurs n°82, 147, 148) ── */
function AttestCoches(p){   // p : e, lignes, n0, titre, bouton, va, titrePage, pret
  var s = useState(p.n0), n = s[0], setN = s[1], s2 = useState(false), fini = s2[0], setFini = s2[1];
  var tout = n >= p.lignes.length;
  if(fini && p.pret) return p.pret();
  return Page(badgeDe(p.e), p.titrePage, h("div", {className:"attest attest-c"},
    h("div", {className:"tt"}, p.titre),
    p.lignes.slice(0, Math.min(n + 1, p.lignes.length)).map(function(l, i){
      var on = i < n;
      return h("div", {key:i, className:"li-c" + (on ? " on" : "")},
        h("button", {className:"case-b" + (on ? " on" : ""), "data-local":"1", disabled:on || i !== n, title:on ? "Cette ligne est déjà cochée." : "Coche cette ligne quand tu l'as lue.", onClick:function(){ setN(n + 1); }}, on ? "✓" : ""),
        h.apply(null, ["span", null].concat(l)));
    }),
    p.pret ? h("button", {className:"btn btn-primary attest-go", disabled:!tout, "data-local":"1", onClick:function(){ setFini(true); },
        title:tout ? "C'est parti." : "« " + p.bouton + " » ne s'ouvre que quand toutes sont cochées."}, p.bouton)
      : h("button", {className:"btn btn-primary attest-go", disabled:!tout, "data-va":tout ? p.va : null, "data-moment":tout && p.va ? momentDefaut(p.va.split("&")[0]) : null,
        title:tout ? "C'est parti." : "« " + p.bouton + " » ne s'ouvre que quand toutes sont cochées."}, p.bouton)));
}
function Attest1(e, n){ var v = autreDe(e); return h(AttestCoches, {e:e, lignes:LignesAttest(e, v), n0:n, titre:"Avant de commencer, " + e.prenom, bouton:"Je commence", titrePage:EV.titre, pret:function(){ return EcrPret(e); }}); }
function Attest2(e, n){ var v = autreDe(e); return h(AttestCoches, {e:e, lignes:LignesAttest2(e, v), n0:n, titre:"Avant la correction, " + e.prenom, bouton:"Je commence la correction", titrePage:"📝 Correction", pret:function(){ return EcrAttenteCorr(e); }}); }
/* « 👤 1 élève » : « Tu es bien Julien ? » ; « Oui » ouvre son attestation, seule sur la tablette (relecteur n°42) */
function EcrTuEsBien(){
  return h("div", {className:"eleve-page"}, DECO.map(function(x, i){ return h("span", {key:i, className:"deco"}, x); }),
    h("div", {className:"eleve-card"}, h("h1", null, "Tu es bien Julien ?"),
      h("div", {className:"combien"}, h("button", {className:"btn btn-primary", "data-va":"t-attest-1&seul=1"}, "Oui"), h("button", {className:"btn btn-ghost", "data-va":"t-login"}, "Non"))));
}
refaire("t-attest-1", function(){ return paramHash("seul") ? h("div", {className:"tablette seule"}, h("div", {className:"moitie g"}, Attest1(J, 0))) : Tablette(Attest1(J, 3), Attest1(M, 0)); });
refaire("t-binome", function(){ return Tablette(Attest1(J, 0), EcrBinome(M, (codeDe(M.nom) || "").slice(0, 2))); });
// la démo : le bandeau, en tête de la moitié (la page d'une moitié est désormais un composant : PageMoitie)
function EcrDemoReflexion(e, qi){
  var sv = EV; EV = DEMO_EV;
  try { var r = EcrReflexion(e, qi, 18); } finally { EV = sv; }
  var bandeau = h("div", {key:"bd", className:"demo-bandeau"}, "🎓 Évaluation d'entraînement : elle ne compte pas.");
  if(r.type === PageMoitie) return React.cloneElement(r, {enfants:h(F, null, bandeau, r.props.enfants)});
  return React.cloneElement(r, null, r.props.children[0], React.cloneElement(r.props.children[1], null, bandeau, r.props.children[1].props.children));
}

/* ── Le mode test : les tablettes en petit se regardent ; on joue « 🔍 en grand » la tablette cliquée (« &tab= »), au même moment ── */
function FigerZone(p){
  var ref = React.useRef(null);
  useEffect(function(){ if(!ref.current) return; Array.prototype.forEach.call(ref.current.querySelectorAll("button,input,textarea"), function(b){ b.disabled = true; b.setAttribute("tabindex", "-1"); if(b.tagName === "BUTTON") b.setAttribute("title", "En petit, la tablette se regarde : « 🔍 Jouer en grand » pour y jouer."); }); });
  return h("div", {ref:ref, className:"sim-fige"}, p.children);
}
function TabSimT(num, a, b, contenu, feuilles){
  return h("div", {key:num, className:"sim-cadre simt"},
    h("div", {className:"sim-titre simt-titre"}, h("span", null, "📱 Tablette " + num + " · " + a + (b ? " · " + b : "")),
      h("button", {className:"btn btn-ghost btn-sm simt-grand", "data-va":"x620-3-mode-test-en-grand&tab=" + num, title:"Ouvre cette tablette à la taille d'une vraie, avec ses deux feuilles dessous : en grand, on joue."}, "🔍 Jouer en grand")),
    h("div", {className:"sim"}, h("div", {className:"sim-in"}, h(FigerZone, null, contenu))),
    feuilles && h("div", {className:"simt-feuilles"}, feuilles));
}
var FEUILLES_Q3_TEST = {"AUDEBERT Élise":"parce qu'elle a 6 pattes", "AUGEREAU Gatien":"elle a 8 pattes", "BOIVIN Eden":"l'araignée a huit pattes, l'insecte six", "CALDEIRA Tiago":"8 pattes", "CESBRON Lili":"car elle a 8 pates"};
function ModeTestGrand(){
  var n = +paramHash("tab") || 1, pa = TEST_PAIRES30[n - 1] || TEST_PAIRES30[0], a = eleveT(pa[0], "J"), b = eleveT(pa[1], "M"), m = MOM(), refl = m.ph === "reflexion";
  var fond = refl ? ModeTestReflexion() : ModeTestSeance({phase:"reponse", qi:2, tour:1, chrono:0, stats:statsQ(), passees:[0, 1],
    etat:function(p, cote){ if(cote === "d") return {cls:"m-voile", st:"🙈 attend son tour"}; return p === a.prenom ? {cls:"m-repond", st:"✋ dit si sa feuille…"} : {cls:"m-dit", st:"a répondu"}; }}, "reflexion");
  var tab = avecTest(function(){ return refl ? Tablette(EcrReflexion(a, 2, m.reste || 0), EcrReflexion(b, 2, m.reste || 0)) : Tablette(EcrDeclareDemo(a, 2, [2, 0, 3, 1], [1], m.reste || 0), VoileN(b, a)); });
  return h(F, null, fond,
    h("div", {className:"grand-fond", "data-echap":"x620-2-mode-test-reflexion"},
      h("div", {className:"grand-boite"},
        h("div", {className:"grand-h"}, h("strong", null, "📱 Tablette " + n + " · " + a.nom + " · " + b.nom), h("span", {className:"grand-p"}, "en grand, à la taille d'une vraie tablette"),
          h("button", {className:"btn btn-rouge btn-sm", "data-va":"x620-2-mode-test-reflexion", title:"Referme la tablette et revient aux 15 tablettes en petit."}, "✕ Revenir aux 15 tablettes")),
        h("div", {className:"grand-tab"}, tab),
        h("div", {className:"simt-feuilles grand-f"}, ChampFeuille(a.nom, FEUILLES_Q3_TEST[a.nom] || ""), ChampFeuille(b.nom, FEUILLES_Q3_TEST[b.nom] || "")),
        n === 1 && !refl && h("div", {className:"grand-note"}, "Élise a écrit « 6 pattes » et cliqué « huit pattes » au dernier moment : si elle répond « Oui », c'est un faux « Oui » ; ta console le relèvera à la correction."))));
}

/* ── Les choix de l'élève : chaque clic s'allume ; « ✅ Réponse enregistrée » ne reste que si un choix est allumé (relecteurs n°54, 85, 109) ── */
function ChoixReponse(p){
  var s = useState(p.sel || []), sel = s[0], set = s[1];
  function basculer(i){ set(sel.indexOf(i) >= 0 ? sel.filter(function(x){ return x !== i; }) : sel.concat([i])); }
  return h(F, null,
    h("div", {className:"eleve-choix" + (p.long ? " long" : "")}, p.ordre.map(function(i){
      return h("button", {key:i, className:"eleve-choix-btn" + (sel.indexOf(i) >= 0 ? " selected" : ""), "data-local":"1", onClick:function(){ basculer(i); }}, h("span", null, p.q.choix[i]));
    })),
    h("div", {className:"eleve-feedback" + (sel.length ? " valide" : "")}, sel.length ? "✅ Réponse enregistrée — tu peux encore la changer" : "💡 Clique sur le ou les choix qui correspondent à ta réponse."));
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
    h(ChoixReponse, {key:e.cle + qi, q:q, ordre:ordre, sel:sel, long:long})));
}

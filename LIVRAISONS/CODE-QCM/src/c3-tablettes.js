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
    // (QCM-2) en direct, le code est vérifié contre son empreinte au hub (ELV.entrer, QCM-1) ; ses messages sont ceux de la 7.7.1
    if(enDirect()) return entrerH(p.cote || "g", st.code, st.prenom.trim(), st.nom.trim(), function(err){ maj({err:err}); });
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
    if(enDirect()){ var i = e.nom.indexOf(" " + e.prenom); return entrerH(p.cote || "d", st.code, e.prenom, i > 0 ? e.nom.slice(0, i) : e.nom, function(err){ set({code:st.code, err:err}); }); }
    if(codeDe(e.nom) !== st.code) return set({code:st.code, err:"Ce code ne correspond pas. Vérifie tes 4 chiffres."});
    versScene(p.suite || "t-attest-1");
  }
  function touche(c){ if(c === "✓") return entrer(); set({code:taper(st.code, c).replace(/\D/g, "").slice(0, 4), err:""}); }
  return Page(null, null, h("div", {style:{textAlign:"left"}},
    h("div", {style:{fontWeight:900, fontSize:"1.25rem", margin:"6px 0 10px", color:"var(--violet)"}}, "Ton binôme : " + e.nom),
    h("div", {style:{fontWeight:700}}, e.prenom + ", tape ton code à 4 chiffres :"),
    enDirect() ? h("input", {type:"password", inputMode:"none", className:"codebox codebox-h", "data-champ":"code", placeholder:"Ton code (4 chiffres)", value:st.code, autoComplete:"off",
        onChange:function(ev){ set({code:ev.target.value.replace(/\D/g, "").slice(0, 4), err:""}); }})
      : h("div", {className:"codebox", "data-champ":"code"}, st.code.replace(/./g, "•")),
    st.err && h("div", {className:"eleve-erreur"}, st.err),
    Clavier(true, touche),
    h("div", {style:{textAlign:"center"}}, h("button", {className:"btn-accueil", "data-local":"1", onClick:entrer}, "Entrer")),
    h("div", {style:{marginTop:10, textAlign:"center"}}, h("button", Object.assign({className:"btn btn-ghost btn-sm"}, enDirect() ? {"data-local":"1", onClick:function(){ if(p.autre) p.autre(); }} : {"data-va":"t-login"}), "Pas là ? Choisir un autre élève"))));
}
function EcrBinome(e, code){ return h(BinomeMoitie, {e:e, code:code}); }
function EcrCombien(){
  return Page(null, "Combien êtes-vous sur cette tablette ?",
    h("div", {className:"combien"},
      h("button", Object.assign({className:"btn btn-ghost"}, enDirect() ? {"data-local":"1", onClick:function(){ combienH(1); }} : {"data-va":"t-un-eleve"}), "👤 1 élève"),
      h("button", Object.assign({className:"btn btn-primary"}, enDirect() ? {"data-local":"1", onClick:function(){ combienH(2); }} : {"data-va":"t-login"}), "👥 2 élèves")));
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
  // (QCM-2) en direct, l'élève de la moitié est son eleveSlug : celui dont le nom est sur le badge
  // (hors séance aussi : les élèves de cet appareil, puis ceux de la classe)
  if(enDirect()){ var nomB = (/· ([^·]+)$/.exec(p.badge || "") || [, ""])[1].trim(), ic = iciH() || {};
    prenom = [ic.g, ic.d].concat(HEURE.eleves, SCN.eleves()).filter(function(x){ return x && nomH(x) === nomB; })[0] || null; }
  var chrono = TOUR_CHRONO[MOM().ph];
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card"},
      h("div", {className:"eleve-tete"}, h("div", {className:"eleve-classe-badge"}, p.badge),
        prenom && h("button", {className:"btn btn-ghost btn-sm mes-evals", "data-local":"1", onClick:function(){ set(!ouvert); }}, ouvert ? "← Retour" : "📊 Mes évaluations")),
      ouvert ? h(F, null, h("h1", null, "📊 Mes évaluations"), ListeMesEvals(prenom)) : h(F, null, p.titre && h("h1", null, p.titre), p.enfants)));
}
function Page(badge, titre, enfants){
  // (relecteurs n°117, 199) toute moitié de tablette porte « 📊 Mes évaluations », celles de la 3e (x610) comprises
  var ici = sceneParId(window.SCENE_COURANTE || ""), surTablette = badge && ((ici && ici.vue === "tablette") || window.APPAREIL_H === "tablette");
  if(surTablette) return h(PageMoitie, {badge:badge, titre:titre, enfants:enfants});
  return h("div", {className:"eleve-page"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card"}, badge && h("div", {className:"eleve-classe-badge"}, badge), titre && h("h1", null, titre), enfants));
}

/* ── L'attestation : « Je commence » met cette moitié en attente, seule ; l'autre moitié en est où elle en est (relecteurs n°82, 147, 148) ── */
function AttestCoches(p){   // p : e, lignes, n0, titre, bouton, va, titrePage, pret ; en direct : attest (1 ou 2), fini
  var s = useState(p.n0), n0 = s[0], setN0 = s[1], s2 = useState(false), fini0 = s2[0], setFini = s2[1];
  // (QCM-2) en direct, la coche se voit tout de suite, et la séance garde le compte (la plus avancée des deux l'emporte)
  var n = enDirect() ? Math.max(n0, p.n0 || 0) : n0, fini = fini0 || (enDirect() && !!p.fini);
  function setN(x){ setN0(x); if(enDirect()) agirE("cocher", p.attest, x, cleE(p.e)); }
  var tout = n >= p.lignes.length;
  if(fini && p.pret) return p.pret();
  return Page(badgeDe(p.e), p.titrePage, h("div", {className:"attest attest-c"},
    h("div", {className:"tt"}, p.titre),
    p.lignes.slice(0, Math.min(n + 1, p.lignes.length)).map(function(l, i){
      var on = i < n;
      return h("div", {key:i, className:"li-c" + (on ? " on" : "")},
        h("button", Object.assign({className:"case-b" + (on ? " on" : ""), role:"checkbox", "aria-checked":on, disabled:on || i !== n}, clic("CASE:" + p.attest + ":" + cleE(p.e) + ":" + i, function(){ setN(n + 1); })), on ? "✓" : ""),
        h.apply(null, ["span", null].concat(l)));
    }),
    p.pret ? h("button", Object.assign({className:"btn btn-primary attest-go", disabled:!tout}, clic("GO:" + p.attest + ":" + cleE(p.e), function(){ setFini(true); if(enDirect()) agirE("commencer", cleE(p.e), p.attest); }), {
        "data-sans-bulle":"1"}), p.bouton)
      : h("button", {className:"btn btn-primary attest-go", disabled:!tout, "data-va":tout ? p.va : null, "data-moment":tout && p.va ? momentDefaut(p.va.split("&")[0]) : null,
        "data-sans-bulle":"1"}, p.bouton)));
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
function EcrDemoReflexion(e, qi, reste){
  var sv = EV; EV = DEMO_EV;
  try { var r = EcrReflexion(e, qi, reste == null ? 18 : reste); } finally { EV = sv; }
  var bandeau = h("div", {key:"bd", className:"demo-bandeau"}, "🎓 Évaluation d'entraînement : elle ne compte pas.");
  if(r.type === PageMoitie) return React.cloneElement(r, {enfants:h(F, null, bandeau, r.props.enfants)});
  return React.cloneElement(r, null, r.props.children[0], React.cloneElement(r.props.children[1], null, bandeau, r.props.children[1].props.children));
}

// (complément 4, correction 4) la démo, sur les tablettes, au moment que la scène déclare (« DEMO · Q1 · réflexion ») : la question
// et le temps qui reste viennent du scénario, comme la console du même moment ; la démo commence à sa question 1
refaire("t-demo-q", function(){ var m = MOM(); return Tablette(EcrDemoReflexion(J, m.qi, m.reste), EcrDemoReflexion(M, m.qi, m.reste)); });

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
  // (QCM-2) en direct, chaque clic enregistre la réponse de l'élève de la moitié (p.onChange : ELV.repondre)
  function basculer(i){ var n = sel.indexOf(i) >= 0 ? sel.filter(function(x){ return x !== i; }) : sel.concat([i]); set(n); if(p.onChange) p.onChange(n); }
  return h(F, null,
    h("div", {className:"eleve-choix" + (p.long ? " long" : "")}, p.ordre.map(function(i){
      return h("button", Object.assign({key:i, className:"eleve-choix-btn" + (sel.indexOf(i) >= 0 ? " selected" : "")}, clic("REP:" + (p.cle || "") + ":" + i, function(){ basculer(i); })), h("span", null, p.q.choix[i]));
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
    h(ChoixReponse, {key:e.cle + qi, cle:e.cle + ":" + qi, q:q, ordre:ordre, sel:sel, long:long, onChange:enDirect() && !ev ? function(n){ agirE("repondre", qi, n, cleE(e)); } : null})));
}

/* ═══════════════ QCM-2 · HEURE — la tablette partagée, en direct ═══════════════
   La tablette de cet appareil : « Combien êtes-vous ? », puis une moitié par élève, chacune à l'écran de la phase de la séance,
   au tour de sa moitié. Qui est assis sur cet appareil : ELV.ici() (QCM-1), sinon ce que la tablette a retenu (localStorage). */
var ICI_L = (function(){ try { return JSON.parse(localStorage.getItem("qcm2-ici") || "null"); } catch(e){ return null; } })() || {combien:null, g:null, d:null, sid:null};
var ICI_AB = [];
function iciH(){ var x = (typeof ELV !== "undefined" && typeof ELV.ici === "function") ? ELV.ici() : null; return x || ICI_L; }
function iciMaj(o){ Object.assign(ICI_L, o); try { localStorage.setItem("qcm2-ici", JSON.stringify(ICI_L)); } catch(e){} ICI_AB.slice().forEach(function(f){ f(); }); }
function combienH(n){ iciMaj({combien:n, g:null, d:null}); agirE("combien", n); }
// l'entrée d'une moitié : ELV.entrer rend {ok, eleve} ou {ok:false, err} (ou une promesse) ; la moitié retient son élève
function entrerH(cote, code, prenom, nom, surErreur){
  var fin = function(r){ if(r && r.ok === false) return surErreur(r.err || "Ce code ne correspond pas. Vérifie tes 4 chiffres.");
    var o = {}; o[cote] = (r && (r.eleve || r.slug)) || null; if(o[cote]) iciMaj(o); else ICI_AB.slice().forEach(function(f){ f(); }); };
  try { var r = agirE("entrer", cote, code, prenom, nom); if(r && typeof r.then === "function") r.then(fin, function(e){ surErreur(String(e && e.message || e)); }); else fin(r); }
  catch(e){ surErreur(String(e && e.message || e)); }
}
// la séance terminée (ou une autre séance) : la tablette oublie ses élèves, et revient à « Combien êtes-vous sur cette tablette ? »
function oublierSiFini(m){
  if(!enDirect() || (typeof ELV !== "undefined" && typeof ELV.ici === "function")) return;
  var finie = !m.seance || m.ph === "fin" || m.ph === "avant";
  if((finie || (ICI_L.sid && ICI_L.sid !== m.seance)) && (ICI_L.combien || ICI_L.g || ICI_L.d)) iciMaj({combien:null, g:null, d:null, sid:m.seance || null});
  else if(m.seance && !ICI_L.sid) ICI_L.sid = m.seance;
}
function EcranTablette(){ return h(TabletteC); }
function TabletteC(){
  var s = useState(0), set = s[1];
  useEffect(function(){ var f = function(){ set(function(x){ return x + 1; }); }; ICI_AB.push(f); return function(){ ICI_AB = ICI_AB.filter(function(g){ return g !== f; }); }; }, []);
  chargerHeure();
  var m = momH();
  useSeconde(!!PHASES_CHRONO[m.ph]);
  oublierSiFini(m);
  window.APPAREIL_H = "tablette";
  var ici = iciH();
  if(!ici.combien) return EcrCombien();
  if(ici.combien === 1){
    var p = ici.g || ici.d;
    if(!p) return h("div", {className:"tablette seule seule-login"}, h("div", {className:"moitie g"}, h(UnEleveH, {key:"lg"})));
    return h("div", {className:"tablette seule"}, h("div", {className:"moitie g"}, MoitieH(p, "g", null)));
  }
  return TabletteVue(ici.g, ici.d, true);
}
// « 👤 1 élève » : le raccourci MJPC de la 7.7.1 (t-un-eleve) : « Tu es bien … ? » ; « Oui » l'entre sans code, « Non » (ou personne de connecté) : le code
function UnEleveH(){
  var s = useState(false), non = s[0], setNon = s[1];
  var m = !non && typeof ELV.sessionMJPC === "function" ? ELV.sessionMJPC() : null;
  if(!m) return typeof LoginLive === "function" ? h(LoginLive, {key:"l1", cote:"g"}) : h(LoginMoitie, {key:"l1", cote:"g"});
  function oui(){ var r = ELV.entrerSansCode("g", m.slug), fin = function(x){ if(x && x.ok === false){ setNon(true); return; } var o = {g:(x && (x.eleve || x.slug)) || m.slug}; iciMaj(o); };
    if(r && typeof r.then === "function") r.then(fin, function(){ setNon(true); }); else fin(r); }
  return h("div", {className:"eleve-page"}, DECO.map(function(x, i){ return h("span", {key:i, className:"deco"}, x); }),
    h("div", {className:"eleve-card"}, h("h1", null, "Tu es bien " + m.prenom + " ?"),
      h("div", {className:"combien"}, h("button", Object.assign({className:"btn btn-primary"}, marqueH("UN:oui:" + m.slug, oui)), "Oui"),
        h("button", Object.assign({className:"btn btn-ghost"}, marqueH("UN:non:" + m.slug, function(){ setNon(true); })), "Non"))));
}
// une tablette, ses deux moitiés : l'élève de chacune à l'écran de la phase (interactif : la tablette elle-même ; sinon « 👁 » de la console)
function TabletteVue(g, d, interactif){
  function moitie(p, cote, autre){
    if(p) return MoitieH(p, cote, autre);
    if(!interactif) return Page(null, null, h("div", {className:"etat-attente"}, "moitié libre"));
    return h(EntreeMoitie, {key:"e" + cote, cote:cote, autre:autre});
  }
  return Tablette(moitie(g, "g", d), moitie(d, "d", g));
}
// une moitié sans élève : « 👋 Identifie-toi » ; si l'autre moitié est entrée et a un binôme, « Ton binôme : … » (« Pas là ? » revient au formulaire)
function EntreeMoitie(p){
  var s = useState(false), libre = s[0], setLibre = s[1];
  var v = p.autre ? SCN.voisinDe(p.autre) : null, ici = iciH();
  if(v && !libre && v !== ici.g && v !== ici.d) return h(BinomeMoitie, {key:"b" + v, e:eleveH(v, p.cote), cote:p.cote, autre:function(){ setLibre(true); }});
  // le formulaire de l'entrée : celui de QCM-1 (LoginLive : le code, et « rejoins … » quand ce n'est pas la bonne tablette), sinon celui de la maquette
  return typeof LoginLive === "function" ? h(LoginLive, {key:"l" + p.cote, cote:p.cote}) : h(LoginMoitie, {key:"l" + p.cote, cote:p.cote});
}
// l'écran d'une moitié, à la phase de la séance
function MoitieH(p, cote, autreP){
  var m = momH(), qi = m.qi, reste = m.reste || 0;
  var vSlug = autreP || SCN.voisinDe(p), v = vSlug ? eleveH(vSlug, cote === "g" ? "d" : "g") : null;
  var e = eleveH(p, cote, v || eleveH(p, cote));
  if(v) v.voisin = e;
  var ph = m.ph === "pause" ? ((m.pause && m.pause.ph) || (m.tour ? "reponse" : "reflexion")) : m.ph;
  var actif = qi != null ? (m.cote || coteDuTour(qi, m.tour || 1)) : null;   // la moitié qui répond à ce tour
  // seul sur sa tablette (pas de voisin présent) : il a la main aux deux tours, rien à voiler (SCN.seul, SCN.aLaMain)
  var seul = typeof SCN.seul === "function" ? SCN.seul(p) : !v, main = typeof SCN.aLaMain === "function" ? SCN.aLaMain(p) : cote === actif;
  var voile = function(){ return v && !seul ? Voile(v, false, e) : EcrAttente(e); };
  if(!ph || ph === "avant" || ph === "appel" || ph === "entree" || ph === "pret"){
    var a1 = attestH(p, 1);
    return a1.fini ? EcrPret(e) : h(AttestCoches, {key:"a1" + p, e:e, lignes:LignesAttest(e, e.voisin), n0:a1.lignes, attest:1, fini:a1.fini, titre:"Avant de commencer, " + e.prenom, bouton:"Je commence", titrePage:EV.titre, pret:function(){ return EcrPret(e); }});
  }
  if(ph === "reflexion") return EcrReflexion(e, qi, reste);
  // (contrat C6) le geste de Paul a coupé l'attente : la moitié qui vient de répondre dit B pendant que la suite commence
  if(typeof SCN.doitDireB === "function" && SCN.doitDireB(p)){ var bp = m.bPour || {}; return EcrDeclareH(e, bp.qi != null ? bp.qi : qi, bp.reste != null ? bp.reste : reste); }
  if(ph === "passage") return cote === actif ? EcrPassage(e, qi, reste) : (v && !seul ? Voile(v, true, e) : EcrAttente(e));
  if(ph === "reponse") return main ? EcrReponse(e, qi, ORD[qi][p], TABL[p][qi], reste) : voile();
  if(ph === "b") return cote === actif || seul ? EcrDeclareH(e, qi, reste) : voile();
  if(ph === "rouvert") return m.pour === p ? EcrReponse(e, qi, ORD[qi][p], TABL[p][qi], reste) : m.pour && m.pour === vSlug && !seul ? Voile(v, false, e) : EcrAttente(e);
  if(ph === "estim") return EcrEstim(e, ESTIM[p] || null);
  if(ph === "att2"){
    var a2 = attestH(p, 2);
    return a2.fini ? EcrAttenteCorr(e) : h(AttestCoches, {key:"a2" + p, e:e, lignes:LignesAttest2(e, e.voisin), n0:a2.lignes, attest:2, fini:a2.fini, titre:"Avant la correction, " + e.prenom, bouton:"Je commence la correction", titrePage:"📝 Correction", pret:function(){ return EcrAttenteCorr(e); }});
  }
  if(ph === "lecture") return v ? EcrLecture(e, qi, !!SCN.lecture(p, qi), reste) : EcrLectureSeulH(e, qi, reste);
  if(ph === "revele") return EcrRevele(e, qi);
  if(ph === "coeval") return v ? CoevalH(e) : Page(badgeDe(e), "📝 Correction", h("div", {className:"co-attente"}, "⏳ Attends ton bilan…"));
  if(ph === "bilan") return EcrBilan(e);
  return EcrAttente(e);
}
// l'attestation d'un élève (1 ou 2) : les lignes cochées, et si elle est finie (« Je commence »)
function attestH(p, n){
  var a = typeof SCN.attestDe === "function" ? SCN.attestDe(n, p) : null, m = momH();
  if(a) return {lignes:a.lignes || 0, fini:!!a.fini};
  var enCours = (n === 1 ? m.attestEnCours : m.enCours) || {};
  if(enCours[p] != null) return {lignes:enCours[p], fini:false};
  // sans le détail (SCN.attest) : celui qui est entré et n'est plus « en cours » l'a finie
  return {lignes:0, fini:n === 1 ? (m.pasEntres || []).indexOf(p) < 0 : true};
}
// B (495) : à la fin de son temps, son clic figé ; « Oui, la même chose » ou « Non, autre chose », enregistré pour lui
function EcrDeclareH(e, qi, chrono){
  var q = EV.questions[qi], p = cleE(e), ordre = ORD[qi][p], sel = TABL[p][qi] || [], dit = (DIT_B[p] || [])[qi];
  var b = function(v, lib){ return h("button", Object.assign({className:"decl-b-btn" + (dit === v ? " on" : ""), "aria-pressed":dit === v}, clic("B:" + p + ":" + qi + ":" + v, function(){ agirE("direB", qi, v, p); })), lib); };
  return Page(badgeDe(e), EV.titre, h("div", {className:"eleve-q-zone"},
    QHead(qi), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"fige"}, "⏱️ Temps fini : ton clic est enregistré."),
    h("div", {className:"eleve-choix fige-choix"}, ordre.map(function(i){
      var moi = sel.indexOf(i) >= 0;
      return h("button", {key:i, className:"eleve-choix-btn" + (moi ? " selected" : ""), disabled:true}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"decl-b-titre"}, e.prenom + ", regarde ta feuille : dit-elle la même chose que ton clic ?"),
    h("div", {className:"decl-b-btns"}, b("oui", "Oui, la même chose"), b("non", "Non, autre chose")),
    h("div", {className:"decl-b-chrono"}, "⏱️ " + chrono + " s")));
}
// la lecture d'une feuille : le voisin clique, dans la moitié du propriétaire, ce que dit sa feuille ; chaque clic s'enregistre
function ChoixLuH(p){   // p : eleve (le propriétaire de la feuille), qi, ordre, q, long, aucunTxt
  var lu = (LU[p.eleve] || [])[p.qi], init = lu === "aucun" ? "aucun" : (lu || []).slice();
  var s = useState(init), sel = s[0], set = s[1];
  function changer(n){ set(n); agirE("lire", p.qi, n === "aucun" || n.length ? n : null, p.eleve); }
  function basculer(i){ var a = sel === "aucun" ? [] : sel; changer(a.indexOf(i) >= 0 ? a.filter(function(x){ return x !== i; }) : a.concat([i])); }
  var dit = sel === "aucun" || sel.length > 0;
  return h(F, null,
    h("div", {className:"eleve-choix" + (p.long ? " long" : "")},
      p.ordre.map(function(i){ return h("button", Object.assign({key:i, className:"eleve-choix-btn" + (sel !== "aucun" && sel.indexOf(i) >= 0 ? " selected" : "")}, clic("LU:" + p.eleve + ":" + p.qi + ":" + i, function(){ basculer(i); })), h("span", null, p.q.choix[i])); }),
      h("button", Object.assign({className:"eleve-choix-btn aucun" + (sel === "aucun" ? " selected" : "")}, clic("LU:" + p.eleve + ":" + p.qi + ":aucun", function(){ changer(sel === "aucun" ? [] : "aucun"); })), p.aucunTxt)),
    dit && h("div", {className:"eleve-feedback valide"}, "✅ Réponse enregistrée — tu peux encore la changer"));
}
// l'élève seul sur sa tablette (500) : il lit lui-même sa feuille, avec les mots de la maquette (c3-scenes.js, EcrLectureSeul)
function EcrLectureSeulH(e, qi, reste){
  var q = EV.questions[qi], p = cleE(e), pos = ORDRE_CORR.indexOf(qi);
  return Page(badgeDe(e), "📝 Correction", h("div", {className:"seul-c"},
    h("div", {className:"correction-banner-peda"}, "💡 On corrige d'abord les questions les plus ratées par la classe."),
    Compteur(pastilles3(e, pos), pos),
    h("div", {className:"eleve-q-zone"}, QHead(qi, true), h("div", {className:"eleve-q-enonce"}, q.enonce),
      h("div", {className:"decl-titre"}, "Qu'as-tu écrit sur ta feuille ?"),
      h("div", {className:"decl-consigne"}, "Clique sur le ou les choix qui disent la même chose que ta feuille. Les mots ne sont pas forcément les mêmes : c'est à toi de faire le rapprochement."),
      ChronoSaisie(reste, tempsDe(qi).reponse, true),
      h(ChoixLuH, {key:"lu" + p + qi, eleve:p, qi:qi, ordre:ORD[qi][p], q:q, aucunTxt:"Ma feuille ne dit aucun de ces choix"}),
      EcouteProf())));
}
// la co-évaluation de la moitié : ce que l'élève a déjà dit, et chaque choix enregistré
function CoevalH(e){
  var p = cleE(e), co = SCN.coevalDe(p) || null;
  var k = co ? co.statut : null, q = co && co.qi != null ? co.qi : null, ecrit = co && co.ecrit != null ? co.ecrit : null;
  return h(Coeval, {key:"co" + p, e:e, k:k, q:q, ecrit:ecrit, onCo:function(statut, qi, ec){ agirE("coeval", statut, qi == null ? null : qi, ec == null ? null : ec, p); }});
}

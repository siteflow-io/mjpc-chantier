/* ═══════════════ QCM-2 · HEURE — la séance réelle sous les écrans de l'heure ═══════════════
   En direct (la couche de QCM-1 est là : SCN.eleves existe), chaque table que la maquette écrivait pour son scénario
   (RT, ORD, TABL, LU, PREMIER, ORDRE_CORR, ESTIM, CO, PAIRES…) se recalcule de la séance à chaque rendu (chargerHeure),
   pour n'importe quelle classe et n'importe quel nombre de questions ; un élève y est son eleveSlug. Chaque geste de l'heure
   appelle l'action de ACT ou ELV (geste, gesteE) ; une fenêtre de la console s'ouvre sur place (ouvrirFen).
   Sans cette couche (l'assemblage de la maquette), tout retombe sur le scénario : rien ne change. */
function enDirect(){ return typeof SCN !== "undefined" && typeof SCN.eleves === "function"; }
function nomH(p){ return enDirect() ? SCN.nomDe(p) : nomDe(p); }
function prenomH(p){ return enDirect() ? SCN.pre(p) : p; }
function sexeH(p){ return enDirect() ? (SCN.sexe(p) === "F" ? "F" : "M") : (SCN.SEXE[p] === "F" ? "F" : "M"); }
// une case de tablette (un nom complet dans la maquette, un eleveSlug en direct) : la clé de l'élève, et le nom affiché
function cleH(n){ return !n ? null : enDirect() ? slugH(n) : pre(n); }
// en direct, un élève nommé par son « NOM Prénom » (SCN.paires) ou par son slug : son slug (sanMJPC du nom, la convention de la base)
function slugH(n){ if(!n) return null; if(SCN.nomDe(n) !== n) return n; return typeof sanMJPC === "function" ? sanMJPC(n) : n; }
function affH(n){ return !n ? "" : enDirect() ? SCN.nomDe(n) : n; }
// la clé d'un objet élève (J, M, ou un élève de la séance) : son prénom dans la maquette, son eleveSlug en direct
function cleE(e){ return enDirect() ? (e.slug || e.cle) : e.prenom; }
function eleveH(p, cote, voisin){ return {cle:p, slug:p, nom:nomH(p), prenom:prenomH(p), sexe:sexeH(p), cote:cote || null, voisin:voisin || null}; }
// les tablettes du moment, [[gauche, droite], …] dans l'ordre des numéros ; une moitié vide est null
function tablettesH(){
  if(!enDirect()) return pairesDuMoment();
  // SCN.places() : [{n, g, d, seul}, …] (QCM-1), ou {n: {g, d}} ; une tablette sans numéro reste à sa place
  var pl = SCN.places() || [], par = {};
  if(Array.isArray(pl)) pl.forEach(function(t){ par[t.n] = t; }); else par = pl;
  var ns = Object.keys(par).map(Number).filter(function(n){ return n > 0; }), max = Math.max.apply(null, ns.concat([0])), l = [];
  for(var n = 1; n <= max; n++){ var x = par[n] || {}; l.push([x.g || null, x.d || null]); }
  return l;
}
function nbQH(){ return EV.questions.length; }
// les élèves qui comptent dans les attentes de la séance : les présents entrés sur une tablette (SCN.actifs, QCM-1) ; dans la maquette, les présents
function actifsH(k){ k = k || MO();
  // (reprise 7, point 1) une séance de la 8.x (« lancee ») sans « entres » : personne n'est encore entré (SCN.actifs y rend tous les présents, pour la 7.7.1)
  if(enDirect()){ var s = (typeof SCN.sess === "function" && SCN.sess()) || {}; if(s.lancee && !s.entres) return []; }
  return enDirect() && typeof SCN.actifs === "function" ? SCN.actifs(k) : SCN.presents(k); }
// l'élève est-il entré sur sa moitié ? (hors direct, ou une séance de la 7.7.1 : oui)
function entreH(p){ if(!enDirect() || !p) return true; var s = (typeof SCN.sess === "function" && SCN.sess()) || {}; return !s.lancee || !!(s.entres || {})[p]; }
// (reprise 4, point 4) en direct, une question écartée n'est plus nulle part : ni au bilan, ni à la co-évaluation, ni au téléphone, ni dans les pastilles
function horsQH(i){ if(!enDirect()) return false; var m = momH(); return (m.ecartees || []).map(Number).indexOf(Number(i)) >= 0; }
// (reprise 5, c-q1-tour1, p-reponse, b-reponse) pendant le 1er tour (au 2e, c-q1-tour2 : le cumul sur les présents), « ont répondu » compte sur les moitiés qui ont la main ; sinon sur les présents
function reponduTourH(c){ var m = momH(), r = c.repondu || [0, 0]; if(!enDirect() || ["reponse", "passage"].indexOf(m.ph) < 0 || (m.tour || 1) !== 1 || m.pour || typeof SCN.aLaMain !== "function") return r;
  var main = SCN.presents().filter(function(p){ return SCN.aLaMain(p); }); return main.length ? [main.filter(function(p){ return SCN.reponse(p, m.qi); }).length, main.length] : r; }
function toutesQ(){ return EV.questions.map(function(q, i){ return i; }); }
function memesChoixH(a, b){ if(a === "aucun" || b === "aucun") return a === b; a = (a || []).slice().sort(); b = (b || []).slice().sort(); return a.length === b.length && a.every(function(x, i){ return x === b[i]; }); }
// la réponse d'un élève (SCN.reponse) ou sa lecture (SCN.lecture) : la liste de ses choix, « aucun », ou null
function choixDeH(r){ if(r == null) return null; if(r === "aucun" || r.choix === "aucun") return "aucun"; if(Array.isArray(r)) return r; if(Array.isArray(r.choix)) return r.choix; return null; }
// le code de la maquette d'une réponse sur la tablette : J juste, Y toutes les bonnes et une en trop, O une partie des bonnes, F faux
function codeChoix(c, q){
  if(!c || c === "aucun" || !c.length) return "F";
  var bons = c.filter(function(i){ return q.bonnes.indexOf(i) >= 0; }).length;
  if(bons === q.bonnes.length) return c.length === bons ? "J" : "Y";
  return bons ? "O" : "F";
}
/* ── Recharger les tables de l'heure depuis la séance (en direct seulement) ── */
var HEURE = {sid:null, eleves:[]};
function chargerHeure(){
  if(!enDirect()) return;
  var k = MO(), m = MOM() || {}, se = (m.seance && SCN.seance(m.seance)) || null, ev = SCN.evalDu(k);
  if(ev && ev.questions) EV = ev;
  if(se && se.classe) CLASSE = nomClasseV(se.classe);   /* (16/10) le nom à l'écran, pas la clé */
  PAIRES = tablettesH();
  var eleves = [].concat.apply([], PAIRES).filter(Boolean);
  HEURE = {sid:m.seance, eleves:eleves};
  var n = EV.questions.length;
  RT = {}; TABL = {}; LU = {}; ESTIM = {}; CO = {}; DIT_B = {}; ORD = [];
  for(var qi = 0; qi < n; qi++) ORD.push({});
  eleves.forEach(function(p){
    var rt = "", tb = [], lu = [], db = [];
    EV.questions.forEach(function(q, qi){
      var c = choixDeH(SCN.reponse(p, qi)); rt += c ? codeChoix(c, q) : "-"; tb.push(c && c !== "aucun" ? c : []);
      var l = choixDeH(SCN.lecture(p, qi)); lu.push(l == null ? [] : l);
      db.push(SCN.ditB(p, qi) || null);
      ORD[qi][p] = SCN.ordreChoix(p, qi) || q.choix.map(function(x, i){ return i; });
    });
    RT[p] = rt; TABL[p] = tb; LU[p] = lu; DIT_B[p] = db;
    var es = SCN.estimationDe(p); if(es) ESTIM[p] = es.niveau || es.k || es;
    var co = SCN.coevalDe(p); CO[p] = !co ? "att" : co.statut === "ok" ? "ok" : (co.statut === "mal" ? "mal" : "peut") + ((co.qi == null ? 0 : co.qi) + 1);
  });
  // les compétences de l'évaluation, dans l'ordre de leurs questions (le bilan, le bilan de classe)
  COMPS = []; EV.questions.forEach(function(q){ (q.competences || []).forEach(function(c){ if(COMPS.indexOf(c) < 0) COMPS.push(c); }); });
  // le libellé court d'une compétence (l'en-tête des tableaux) : ses premiers mots, comme dans la maquette
  COMPS.forEach(function(c){ if(!COMP_COURT[c] && LIB_OFF[c]){ var w = LIB_OFF[c].split(" "); COMP_COURT[c] = w.length > 4 ? w.slice(0, 4).join(" ").replace(/[,;:]$/, "") + "…" : LIB_OFF[c]; } });
  PREMIER = EV.questions.map(function(q, qi){ return SCN.premierCote(qi) === "d" ? "M" : "J"; });
  ORDRE_CORR = (SCN.ordreCorr() || []).length ? SCN.ordreCorr().slice() : ordreCorrCalcule();
}
// l'ordre de la correction, avant qu'il soit fixé : de la plus ratée à la mieux réussie, sur les tablettes
function ordreCorrCalcule(){
  var k = MO(), ec = momH().ecartees || [];
  return toutesQ().filter(function(qi){ return ec.indexOf(qi) < 0; }).map(function(qi){ var b = bilanQ(qi, k); return {qi:qi, t:b.repondu ? b.justes / b.repondu : 1}; })
    .sort(function(a, b){ return a.t - b.t || a.qi - b.qi; }).map(function(x){ return x.qi; });
}
// le moment, complété en direct de ce que la séance permet de calculer (les champs que QCM-1 ne donnerait pas)
function momH(){
  var m = MOM() || {};
  if(!enDirect()) return m;
  m = Object.assign({}, m);
  var k = MO(), pres = SCN.presents(k), qi = m.qi;
  if(m.depuis && m.duree) m.reste = Math.max(0, Math.ceil(m.duree - (Date.now() - m.depuis) / 1000));
  if(qi != null && (m.ph === "reponse" || m.ph === "b" || m.ph === "passage") && m.nonRep == null){
    var cote = m.cote || coteDuTour(qi, m.tour || 1), rep = SCN.repondu(qi, k);
    m.nonRep = pres.filter(function(p){ return SCN.cote(p) === cote && rep.indexOf(p) < 0; });
  }
  if(qi != null && m.ph === "close" && m.sansRep == null){ var r2 = SCN.repondu(qi, k); m.sansRep = pres.filter(function(p){ return r2.indexOf(p) < 0; }); }
  if(qi != null && m.ph === "lecture" && m.pasLu == null) m.pasLu = pres.filter(function(p){ return !SCN.lecture(p, qi); });
  if(m.ph === "estim" && m.pasEstime == null) m.pasEstime = pres.filter(function(p){ return !SCN.estimationDe(p); });
  return m;
}

/* ── Les gestes de l'heure, en direct : chaque bouton porte sa clé (data-h2) et son geste, enregistré à chaque rendu ; un clic sur lui
      est traité ici, avant le routeur par libellé (src/live/gestes.js), qui n'a donc rien à deviner (l'élève, la question, la fenêtre) ── */
var H2_FN = {};
// (t-q2-ecartee) le rang d'une question sur les tablettes : une question écartée ne compte pas (« Question 2 / 2 ») ; dans la maquette, son rang
function numQH(qi, ev){ var tot = (ev || EV).questions.length; if(!enDirect() || (ev && ev !== EV)) return {n:qi + 1, N:tot};
  var ec = (momH().ecartees || []).map(Number); return {n:qi + 1 - ec.filter(function(x){ return x < qi; }).length, N:tot - ec.length}; }
// (QCM-3, « 💬 Ce que lisent les élèves ») en direct, le texte réglé par Paul (texteEleveV) ; sinon celui de la maquette
function texteH(cle, defaut){ if(enDirect() && typeof texteEleveV === "function"){ try { return texteEleveV(cle) || defaut; } catch(x){} } return defaut; }
// la séance en cours est-elle sur papier ? (la phase papier, puis sa correction à l'heure suivante)
function papierH(){ if(!enDirect()) return false; var m = momH(); if(m.papier) return true; var s = SCN.sess() || {}; return ((s.lancee || {}).mode === "papier"); }
function marqueH(cle, fn){ H2_FN[cle] = fn; return {"data-local":"1", "data-h2":cle}; }
// un bouton qui agit sur place : en direct, par sa clé ; dans la maquette, son onClick (composant à état)
function clic(cle, fn){ return enDirect() ? marqueH(cle, fn) : {"data-local":"1", onClick:fn}; }
window.addEventListener("click", function(ev){
  var b = ev.target && ev.target.closest ? ev.target.closest("[data-h2]") : null;
  if(!b || b.disabled || !enDirect()) return;
  var f = H2_FN[b.getAttribute("data-h2")]; if(!f) return;
  ev.stopImmediatePropagation(); ev.preventDefault();
  try { f(ev); } catch(e){ console.error("[QCM-2] geste " + b.getAttribute("data-h2"), e); }
}, true);
/* ── Les gestes : en direct, l'action de ACT ; dans la maquette, la scène qu'il montrait ── */
function geste(va, nom){
  var args = Array.prototype.slice.call(arguments, 2);
  if(!enDirect() || !nom) return va ? {"data-va":va} : {};
  return Object.assign({"data-act":nom}, marqueH("ACT:" + nom + ":" + JSON.stringify(args), function(){ agir(nom, args); }));
}
function agir(nom, args){
  try { var f = typeof ACT !== "undefined" && ACT[nom]; if(!f){ console.warn("[QCM-2] ACT." + nom + " manque"); return; } return f.apply(ACT, args || []); }
  catch(e){ console.error("[QCM-2] ACT." + nom, e); }
}
// un geste de l'élève, sur sa moitié : l'eleveSlug de la moitié en dernier argument (DEMANDES.md, 12/10 17:40)
function agirE(nom){
  var args = Array.prototype.slice.call(arguments, 1);
  try { var f = typeof ELV !== "undefined" && ELV[nom]; if(!f){ console.warn("[QCM-2] ELV." + nom + " manque"); return; } return f.apply(ELV, args); }
  catch(e){ console.error("[QCM-2] ELV." + nom, e); }
}
/* ── Les fenêtres de la console, en direct : elles s'ouvrent sur place, au-dessus de l'écran du moment ── */
var FEN_H = {f:null, arg:null, ab:[], cle:null};
// une fenêtre ouverte se ferme d'elle-même quand la séance change de phase ou de question (un geste fait ailleurs, le téléphone, le moteur)
function cleFen(){ var m = MOM() || {}; return [m.seance, m.ph, m.qi, m.tour].join("|"); }
function ouvrirFen(nom, arg){ FEN_H.depuis = FEN_H.f; FEN_H.f = nom; FEN_H.arg = arg == null ? null : arg; FEN_H.cle = nom ? cleFen() : null; FEN_H.ab.slice().forEach(function(f){ f(); }); }
function fermerFen(){ ouvrirFen(null); }
// un bouton qui ouvrait une fenêtre (une scène de la maquette) : en direct, la fenêtre sur place
function fen(va, nom, arg){ if(!enDirect()) return va ? {"data-va":va} : {}; return marqueH("FEN:" + nom + ":" + JSON.stringify(arg == null ? null : arg), function(){ ouvrirFen(nom, arg); }); }
function useFen(){ var s = useState(0), set = s[1]; useEffect(function(){ var f = function(){ set(function(x){ return x + 1; }); }; FEN_H.ab.push(f); return function(){ FEN_H.ab = FEN_H.ab.filter(function(g){ return g !== f; }); }; }, []); return FEN_H; }
// les chronos : chaque appareil se redessine chaque seconde pendant un temps qui court
function useSeconde(actif){ var s = useState(0), set = s[1]; useEffect(function(){ if(!actif) return; var t = setInterval(function(){ set(function(x){ return x + 1; }); }, 1000); return function(){ clearInterval(t); }; }, [actif]); }
var PHASES_CHRONO = {reflexion:1, passage:1, reponse:1, b:1, rouvert:1, lecture:1};

/* ═══════════════ Complément 3 — le pilotage, au moment de la scène ═══════════════
   La console pendant les questions : un seul rendu (Pilot), rempli d'après le moment. L'état, les compteurs, les tablettes,
   la question en cours, celles à venir et la fin prévue se calculent du scénario. */

/* ── L'état du pilotage à un moment ── */
function etatPilot(k){
  k = k || MO();
  var m = k === MO() ? momH() : (SCN.moment(k) || {}), c = SCN.compteurs(k);
  // (QCM-2) en direct, une séance en pause reste sur son temps : la réflexion, ou le tour de réponse
  var ph = m.ph === "pause" ? ((m.pause && m.pause.ph) || (m.tour ? "reponse" : "reflexion")) : m.ph;
  // (c-rouvrir-un) une question rouverte pour un seul élève : la console reste à la question close
  if(enDirect() && m.pour && m.pour !== "tous" && ["rouvert", "b", "passage", "reponse"].indexOf(ph) >= 0) ph = "close";
  var phase = ({pret:"idle", avant:"idle", appel:"idle", entree:"idle", reflexion:"reflexion", passage:"reponse", reponse:"reponse", b:"reponse", close:"attente", rouvert:"attente", panne:"reponse"})[ph] || "idle";
  var qi = m.qi == null ? null : m.qi;
  // (21/10, Paul, point 15) une question déjà posée de la séance (une séance rouverte) est faite : jamais « à venir »
  var pose = poseesH();
  var passees = toutesQ().filter(function(q){ return (qi != null && (q < qi || (q === qi && phase === "attente"))) || (pose[q] && q !== qi); });
  var obj = function(l){ var o = {}; (l || []).forEach(function(x){ o[x] = true; }); return o; };
  var leg = LEG_Q.slice();
  if((m.sansRep || []).length) leg = LEG_Q.slice(0, 4).concat([["#fff", "pas de réponse", "2px dashed #EF4444"]]);
  if(m.partis && Object.keys(m.partis).length) leg = leg.concat([["#E2E8F0", "🚪 parti : ne bloque plus"]]);
  // (relecteur n°68) pendant la réflexion, la tuile dit « ✍️ écrit » ; la légende dit le reste
  if(phase === "reflexion") leg = [["#E0F2FE", "✍️ écrit : la réponse, sur sa feuille, pendant la réflexion"]];
  // (QCM-2) en direct, « connectés » : les présents entrés sur une tablette (SCN.compteurs().connectes), pas tous les présents
  var stats = statsQ();
  if(enDirect() && c.connectes) stats = [[fr2(c.connectes), "connectés"]].concat(stats.slice(1));
  // (reprise 6, c-q1-tour1) « ONT RÉPONDU » pendant un tour : sur ceux qui ont la main ; la question close : sur les présents
  if(enDirect() && stats[1] && /ont répondu/.test(stats[1][1])){ var rt = reponduTourH(c); stats = stats.slice(); stats[1] = [rt[0] + "/" + rt[1], stats[1][1]]; }
  // (reprise 4, point 6) pendant le passage (« Tu es prêt ? À toi dans 3 secondes »), le tour n'a pas commencé : le chrono de la réponse compte le passage et le tour entier
  var chrono = enDirect() && ph === "passage" && qi != null ? (m.reste || 0) + SCN.tempsDe(qi).reponse : m.reste;
  // (reprise 4, point 8, c-deplacer) deux élèves échangés pendant la séance, pas encore sur leur nouvelle moitié : le sous-titre des tablettes le dit
  var dep = enDirect() ? actifsH(k).filter(aDeplacerH) : [];
  var sousT = dep.length === 2 ? nomDe(dep[0]) + " et " + nomDe(dep[1]) + " échangés : leurs réponses déjà données les suivent" : undefined;
  return {k:k, phase:phase, qi:qi, tour:m.tour, chrono:chrono, sousTitre:sousT, stats:stats, passees:passees, ecartees:obj(m.ecartees), annulees:obj(m.annulees), pause:m.ph === "pause" || !!m.paused,
    etat:etatQuestionH({qi:qi, tour:m.tour, fini:phase === "attente", reflexion:phase === "reflexion"}), legende:leg, nbQ:c.nbQ};
}
// (déplacer, 72) l'élève échangé ou déplacé pendant la séance, entré avant et pas encore sur sa nouvelle moitié : il retape son code
function aDeplacerH(p){ if(!enDirect()) return false; var s = SCN.sess() || {}, d = (s.deplaces || {})[p], en = (s.entres || {})[p]; return !!(d && en && en <= d); }
function deplaceH(p){ if(!aDeplacerH(p)) return null; var t = SCN.tabletteDe(p); return t ? {cls:"m-deplace", st:"↔️ va sur la tablette " + t.n + " : retape son code"} : null; }
// la moitié d'un élève pendant une question (c3-base.js, etatQuestion), d'après le moment complété : en direct, ceux qui répondent encore
function etatQuestionH(s){
  var m = momH(), nonRep = s.nonRep || m.nonRep || [], sansRep = m.sansRep || [], partis = m.partis || {};
  var act = enDirect() ? actifsH() : null;   // les présents entrés sur une tablette
  return function(p, cote){
    if(partis[p]) return {cls:"m-parti", st:"🚪 parti à " + partis[p]};
    // un présent jamais entré sur sa moitié : ni « répond », ni « attend son tour » (c-pret : « pas encore entré »)
    if(act && act.indexOf(p) < 0) return {cls:"m-connexion", st:"pas encore " + (sexeH(p) === "F" ? "entrée" : "entré")};
    var dp = deplaceH(p); if(dp) return dp;
    if(s.reflexion) return {cls:"m-ecrit", st:"✍️ écrit"};
    if(s.fini) return sansRep.indexOf(p) >= 0 ? {cls:"m-pasrep", st:"⏳ pas de réponse"} : couleur(p, s.qi, false);
    var estPremier = cote === coteDuTour(s.qi, 1);
    if(s.tour === 1 && !estPremier) return {cls:"m-voile", st:"🙈 attend son tour"};
    if(s.tour === 2 && estPremier) return couleur(p, s.qi, true);
    if(nonRep.indexOf(p) >= 0) return {cls:"m-repond", st:"✋ répond…"};
    return couleur(p, s.qi, false);
  };
}
// les réponses et les justes d'une question déjà posée, sur la tablette, au moment k
function bilanQ(qi, k){ var m = SCN.moment(k) || {}; if(m.seance === "TEST" && SCN.TEST){ var t = SCN.TEST.passees[qi] || {repondu:0, justes:0}; return {repondu:t.repondu, justes:t.justes, presents:SCN.TEST.presents}; }
  var rep = SCN.repondu(qi, k); return {repondu:rep.length, justes:rep.filter(function(p){ return (RT[p] || "")[qi] === "J"; }).length, presents:SCN.presents(k).length}; }
function bonnesRep(n){ return n + (n > 1 ? " bonnes réponses" : " bonne réponse"); }

/* ── La question en cours ── */
function QCourante(qi){
  var q = EV.questions[qi], m = momH(), ec = m.ecartees || [], nbQ = EV.questions.length - ec.length;
  var rang = qi + 1 - ec.filter(function(x){ return x < qi; }).length;
  return h("div", {className:"pilot-q-current"},
    h("div", {className:"num"}, "Question " + rang + " / " + nbQ + " — " + bonnesRep(q.bonnes.length)),
    h("div", {className:"enonce"}, q.enonce),
    h("div", {className:"pilot-q-bonne"}, h("span", {style:{fontWeight:900}}, "✓ Bonne" + (q.bonnes.length > 1 ? "s" : "") + " réponse" + (q.bonnes.length > 1 ? "s" : "") + " : "), q.bonnes.map(function(i){ return q.choix[i]; }).join("  /  ")),
    h("div", {className:"niv-row"},
      h("span", {className:"niv-bulle"}, "Difficulté : " + NIV[q.niveau].label),
      (q.competences || []).map(function(c){ return h("span", {key:c, className:"niv-bulle"}, c); })));
}

/* ── « 📋 Toutes les questions » : les comptes au moment de la scène ── */
function Overview(qCur, passees, opts){
  opts = opts || {};
  var k = MO(), m = momH(), ec = opts.ecartees || {}, an = opts.annulees || {}, c = SCN.compteurs(k);
  return h("div", {className:"pilot-overview"},
    h("h3", null, h("span", null, "📋 Toutes les questions", InfoI("Les temps des questions à venir se tapent ici, pour cette séance seulement. « ❌ Écarter » retire une question pas encore posée ; « ⚠️ Annuler » retire une question déjà posée. Les deux se défont par « ↩️ Remettre »."))),
    EV.questions.map(function(q, qi){
      // la 7.7.1 (l. 8114) : la question du moment reste « en cours », même close, jusqu'au lancement de la suivante
      var current = qi === qCur, passee = !current && passees.indexOf(qi) >= 0, avenir = !current && !passee;
      var b = bilanQ(qi, k);
      var marque = ec[qi] ? h("div", {className:"q-marque ecartee"}, "❌ Écartée — pas posée") : an[qi] ? h("div", {className:"q-marque annulee"}, "⚠️ Annulée — posée, puis annulée") : null;
      // (relecteur n°105) la question du moment, close, ne dit plus « en cours »
      var close = current && (opts.phase === "attente" || m.ph === "close");
      var titre = close ? "Question close — " + b.justes + "/" + b.repondu + " justes."
        : current ? "Question en cours — " + (c.justes && c.justes[1] ? c.justes[0] + "/" + c.justes[1] : "0/" + c.presents) + " justes pour le moment"
        : passee ? "Question passée — " + b.justes + "/" + b.repondu + " justes" : null;   // la 7.7.1, l. 8114
      var t = tempsDe(qi);
      var taux = b.repondu ? b.justes / b.repondu : 0;
      // (QCM-2) en direct, « ↩️ Remettre », « ❌ Écarter » et « ⚠️ Annuler » agissent sur la question de leur ligne
      var remettre = enDirect() ? geste(null, "remettre", qi) : {"data-va":opts.remettre || "c-q1-close", "data-moment":momentDefaut(opts.remettre || "c-q1-close")};
      return h("div", {key:qi, className:"pilot-q-mini" + (current ? " current" : "") + (passee ? " passee" : "") + (ec[qi] || an[qi] ? " retiree" : ""), title:titre, "data-q":enDirect() ? qi + 1 : undefined},
        h("div", {className:"pilot-q-mini-head"}, h("span", {className:"pilot-q-mini-num"}, "Q" + (qi+1)), h("span", {className:"pilot-q-mini-niv niv-" + q.niveau}, NIV[q.niveau].label)),
        h("div", {className:"pilot-q-mini-enonce"}, q.enonce),
        h("div", {className:"pilot-q-mini-bonnes"}, ChoixTexte(q)),
        marque,
        avenir && !ec[qi] ? h(TempsMiniH, {qi:qi}) : h("div", {className:"pilot-q-mini-status"}, "Réflexion " + t.reflexion + " s · Réponse " + t.reponse + " s par tour",
          (passee || (current && opts.phase === "attente")) && !an[qi] && h("span", null, " — ", h("span", {className:"score-pct " + (taux >= .7 ? "score-vert" : taux >= .5 ? "score-orange" : "score-rouge")}, b.justes + "/" + b.repondu + " justes"))),
        h("div", {className:"q-gestes"},
          ec[qi] || an[qi] ? h("button", Object.assign({key:"rem", className:"btn btn-ghost btn-sm", title:enDirect() ? (ec[qi] ? "Remet la question " + (qi + 1) + " dans la séance : elle n'a pas été posée, elle redevient à poser, et compte de nouveau dans le total. « ▶️ Lancer Q" + (qi + 1) + " » la propose quand son tour vient." : "Remet la question " + (qi + 1) + " dans la note : elle compte de nouveau, comme avant « ⚠️ Annuler ».") : undefined}, remettre), "↩️ Remettre")
            : avenir ? h("button", Object.assign({key:"ec", className:"btn btn-ghost btn-sm btn-ecarter", title:"Écarte la question " + (qi + 1) + ", après une confirmation : elle ne sera ni posée ni corrigée, et sort du total, comme une question manquée par un absent ; les tablettes et le tableau comptent sans elle. « ↩️ Remettre » la défait, tant que son tour n'est pas passé."}, fen("c-ecarter&q=" + (qi + 1), "ecarter", qi)), "❌ Écarter")
            : passee || (current && opts.phase === "attente") ? h("button", Object.assign({key:"an", className:"btn btn-ghost btn-sm"}, fen("c-annuler&q=" + (qi + 1), "annuler", qi)), "⚠️ Annuler") : null));
    }),
    opts.alerteComp && h("div", {className:"q-alerte"}, opts.alerteComp));
}

/* ── Les temps tapés pendant la séance (c3-base.js : TempsCarte, ColonneTemps, TempsMini) : en direct, ils s'écrivent dans la séance ── */
// ajouter n secondes à un temps d'une question : en direct ACT.ajouterTemps(sorte, s, qi) ; dans la maquette, les temps tapés de la page
function tempsAjouter(qi, champ, n, actif){
  if(!n) return;
  if(enDirect()) return agir("ajouterTemps", [champ, n, qi]);
  tempsChanger(qi, champ, tempsDe(qi)[champ] + n, actif ? n : 0);
}
// un champ qu'on tape garde ce qu'on y tape tant qu'il a le curseur ; la séance reçoit chaque valeur entière (règle du 04/10)
function ChampTemps(p){   // p : v, qi, champ, actif, attrs
  var s = useState(null), brouillon = s[0], setB = s[1], envoye = React.useRef(null);
  var aff = brouillon != null ? brouillon : String(p.v), a = Object.assign({}, p.attrs);
  // (QCM-1, K6) un champ qui se ferme pendant qu'on y tape garde le curseur et sa valeur : il passe en lecture seule, et se ferme au départ du curseur
  var ferme = !!a.disabled;
  if(ferme && brouillon != null){ a.disabled = false; a.readOnly = true; }
  /* (19/10, Paul, point 28) ce que Paul tape ne part qu'à Entrée, ou quand il quitte le champ : pendant la frappe, rien n'est écrit
     et le chrono continue ; un champ vide ou à 0 reprend sa valeur ; Entrée puis la sortie du champ n'envoient qu'une fois */
  function envoyer(val){ if(ferme) return; var x = parseInt(val, 10); if(!(x > 0) || x === p.v || x === envoye.current) return; envoye.current = x; tempsAjouter(p.qi, p.champ, x - p.v, p.actif); }
  return h("input", Object.assign({type:"number", min:1, value:aff,
    onFocus:function(){ envoye.current = null; setB(String(p.v)); },
    onBlur:function(e){ envoyer(e.target.value); setB(null); envoye.current = null; },
    onKeyDown:function(e){ if(e.key === "Enter"){ e.preventDefault(); envoyer(e.target.value); var x = parseInt(e.target.value, 10); setB(x > 0 ? String(x) : String(p.v)); } },
    onChange:function(e){ if(ferme) return; setB(e.target.value); }}, a));
}
function TempsCarteH(p){   // p : lbl, champ, qi, reste, actif, fini, sous
  useTemps();
  var t = tempsDe(p.qi), total = t[p.champ];
  var reste = p.reste + (p.actif && !enDirect() ? (TEMPS.surcharges.reste || 0) : 0);
  if(p.actif) TEMPS.actif = {qi:p.qi, champ:p.champ, total:total, reste:reste};
  var ferme = p.fini ? (p.champ === "reflexion" ? "La réflexion de cette question est finie : son temps ne se change plus." : "Les deux tours de cette question sont finis : son temps de réponse ne se change plus.") : null;
  return h("div", {className:"pilot-chrono-card" + (p.actif ? " actif" : "")},
    h("div", {className:"label" + (p.actif ? " actif" : "")}, p.lbl),
    h("div", {className:"v"}, p.actif ? reste + "s" : total + "s"),
    h("div", {className:"desc"}, p.sous),
    h("div", {className:"inline-edit t-edit"},
      h(ChampTemps, {v:total, qi:p.qi, champ:p.champ, actif:p.actif, attrs:{disabled:!!ferme, "data-q":p.qi + 1, "data-temps":p.champ, "aria-label":"Temps " + p.lbl,
        title:ferme || (p.champ === "reflexion" ? "Tape le temps de réflexion de cette question, en secondes, puis Entrée (ou quitte le champ) : il part alors, tout de suite au chrono en cours ; pendant la frappe, le chrono continue. La fin prévue suit." : "Tape le temps de réponse de cette question, en secondes, puis Entrée (ou quitte le champ) : il part alors, tout de suite au chrono en cours ; pendant la frappe, le chrono continue. Il vaut pour chaque tour et pour la lecture à la correction. La fin prévue suit.")}}),
      h("span", {className:"t-s"}, "s"),
      [5, 10, 30].map(function(n){ return h("button", {key:n, className:"btn btn-ghost btn-sm t-plus", "data-local":"1", disabled:!!ferme,
        title:ferme || ("Ajoute " + n + " s au temps de " + (p.champ === "reflexion" ? "réflexion" : "réponse") + " de cette question" + (p.actif ? ", tout de suite au chrono en cours" : "") + ". La fin prévue suit."), onClick:function(){ tempsAjouter(p.qi, p.champ, n, p.actif); }}, "+" + n); })));
}
function ColonneTempsH(p){   // la réflexion et la réponse de la question en cours, et la fin prévue
  var qi = p.qi;
  var finiRef = p.phase !== "reflexion", finiRep = p.phase === null && p.close;
  return h(F, null,
    h("div", {className:"pilot-chronos-info"},
      h(TempsCarteH, {lbl:"🧠 Réflexion", champ:"reflexion", qi:qi, reste:p.reste, actif:p.phase === "reflexion", fini:finiRef && p.qiPosee, sous:p.phase === "reflexion" ? "EN COURS" : "pour cette question"}),
      h(TempsCarteH, {lbl:"✋ Réponse", champ:"reponse", qi:qi, reste:p.reste, actif:p.phase === "reponse", fini:finiRep, sous:p.phase === "reponse" ? (p.tour === 1 ? "1er tour" : "2e tour") + " · EN COURS" : "par tour"})),
    h(FinPrevueC));
}
function TempsMiniH(p){
  useTemps();
  var t = tempsDe(p.qi);
  function champ(c, lbl, nom){ return h("label", {className:"tm-l"}, lbl, h(ChampTemps, {v:t[c], qi:p.qi, champ:c, actif:false, attrs:{"data-q":p.qi + 1, "data-temps":c,
    title:"Le temps de " + nom + " de la question " + (p.qi + 1) + ", pour cette séance : tape-le, puis Entrée (ou quitte le champ). L'évaluation elle-même ne change pas. La fin prévue suit."}}), "s"); }
  return h("div", {className:"tm"}, champ("reflexion", "🧠 ", "réflexion"), champ("reponse", "✋ ", "réponse"));
}
// « ⏸️ Pause » / « ▶️ Reprendre » et « 🔄 Relancer chrono » : en direct, la séance elle-même (etape2.js garde ceux de la maquette)
function BoutonPauseH(p){
  if(!enDirect()) return h(p && p.tel ? BoutonPauseTel : BoutonPause);
  var enPause = momH().ph === "pause" || !!momH().paused;
  return h("button", Object.assign({className:p && p.tel ? "tel-btn tb-ghost tb-small" : "btn btn-or", title:enPause ? BULLES["▶️ Reprendre"] : BULLES["⏸️ Pause"]},
    marqueH("ACT:pause" + (p && p.tel ? ":tel" : ""), function(){ agir(enPause ? "reprendre" : "pause"); })), enPause ? "▶️ Reprendre" : "⏸️ Pause");
}
function relancerChrono(){ if(enDirect()) agir("relancerChrono"); else document.dispatchEvent(new Event("maquette-relancer")); }
function BoutonRelancerH(){
  if(!enDirect()) return h(BoutonRelancer);
  return h("button", Object.assign({className:"btn btn-ghost", title:BULLES["🔄 Relancer chrono"]}, marqueH("ACT:relancerChrono", relancerChrono)), "🔄 Relancer chrono");
}

/* ════════ Le pilotage pendant les questions ════════ */
function nonRepondus(){ return (momH().sansRep || []).length; }
// (21/10, Paul, point 15) en direct, les questions déjà posées de la séance (lancées, ou avec une réponse) : une séance rouverte part de ce qui a été fait
function poseesH(){ var o = {}; if(!enDirect()) return o; var s = SCN.sess() || {}, l = (typeof SCN.lancees === "function" ? SCN.lancees() : s.questionsLancees) || {}, r = s.reponses || {};
  Object.keys(l).forEach(function(q){ if(l[q] != null) o[+q] = true; }); Object.keys(r).forEach(function(q){ if(r[q]) o[+q] = true; }); return o; }
// la première question ni écartée ni déjà posée après qi (ou la première de l'évaluation)
function suivanteQ(qi){ var ec = (momH().ecartees || []).map(Number), pose = poseesH();
  return toutesQ().filter(function(q){ return ec.indexOf(q) < 0 && !pose[q] && (qi == null || q > qi); })[0]; }
// (point 15) plus rien à poser : les questions posées pas encore corrigées (ni écartées, ni annulées), que la correction lira. Corrigée : révélée en
// classe, ou chaque feuille de la question (un élève qui y a répondu, ou dont la feuille a été lue) lue par Paul le soir (la note ne la dit plus « pas encore lue »)
function aCorrigerH(){ var pose = poseesH(), m = momH(), ec = (m.ecartees || []).map(Number), an = (m.annulees || []).map(Number), rv = SCN.corrigeesAu(), s = SCN.sess() || {}, notes = {};
  function st(x){ if(!(x in notes)) notes[x] = SCN.note(x) || {st:[]}; return notes[x].st || []; }
  return Object.keys(pose).map(Number).filter(function(q){ if(rv.indexOf(q) >= 0 || ec.indexOf(q) >= 0 || an.indexOf(q) >= 0) return false;
    var qui = Object.keys(Object.assign({}, (s.reponses || {})[q] || {}, (s.lectures || {})[q] || {}));
    return !qui.length || qui.some(function(x){ return st(x)[q] === "n"; }); }); }
function Pilot(s){
  s = s || etatPilot();
  // (point 15) en direct, avant la première question (« prêt », la séance rouverte) : les questions écartées, annulées et déjà posées de la séance
  if(enDirect() && !s.ecartees){ var e0 = etatPilot(); s = Object.assign({}, s, {ecartees:e0.ecartees, annulees:e0.annulees, passees:e0.passees}); }
  var m = momH(), k = MO(), pose = poseesH();
  var ec = s.ecartees || {}, nbQ = EV.questions.length - Object.keys(ec).length;
  var restantes = toutesQ().filter(function(q){ return !ec[q] && !pose[q] && (s.qi == null || q > s.qi); });
  var derniere = s.qi != null && restantes.length === 0;
  var suivante = restantes.length ? restantes[0] : null;
  // (point 15) une séance rouverte où il ne reste rien à poser : la correction de ce qui n'a pas été révélé, sinon la fin
  var plusRien = enDirect() && s.phase === "idle" && suivante == null, aCorr = plusRien ? aCorrigerH() : [];
  var st, statusCls = s.phase;
  if(s.phase === "idle") st = plusRien ? (aCorr.length ? "✅ Plus de question à poser — lance l'autoévaluation, puis la correction" : "✅ Plus de question à poser — termine la séance")
    : "⏳ En attente — clique sur « ▶️ Lancer Q" + (enDirect() && suivante != null ? suivante + 1 : 1) + " »";
  else if(s.phase === "reflexion") st = "🧠 Phase RÉFLEXION en cours";
  else if(s.phase === "reponse") st = h(F, null, "✋ Phase RÉPONSE — " + (s.tour === 1 ? "1er" : "2e") + " tour", h("span", {className:"tour-chip"}, (coteDuTour(s.qi, s.tour) === "g" ? "moitiés de gauche" : "moitiés de droite")));
  else st = derniere ? "✅ Dernière question close — lance l'autoévaluation" : "⏸️ Question close — passe à la suivante";
  var actions;
  // (QCM-2) en direct, chaque bouton fait avancer la séance (ACT) ; dans la maquette, il mène à la scène qui le montre
  var vaLancer = suivante === 1 ? (Object.keys(s.ecartees || {}).length ? "t-q2-ecartee" : "t-q2-reflexion") : "t-q3-tour1";
  var q0 = suivanteQ(null); if(q0 == null) q0 = 0;
  // (QCM-2) une séance reprise à une autre heure : après l'appel et l'entrée, « ▶️ Reprendre » fait recommencer le moment gelé au début (ACT.reprendre)
  var rep = enDirect() ? momH().reprise : null;
  if(s.phase === "idle" && rep && rep.ph && ["avant", "appel", "entree", "pret"].indexOf(rep.ph) < 0) actions = [h("button", Object.assign({key:1, className:"btn btn-primary", title:BULLES["▶️ Reprendre"]}, geste("c-pret", "reprendre")), "▶️ Reprendre")];
  else if(plusRien) actions = [aCorr.length
      ? h("button", Object.assign({key:1, className:"btn btn-or", title:"Toutes les questions de la séance sont posées ; " + (aCorr.length > 1 ? "Q" + aCorr.map(function(q){ return q + 1; }).join(", Q") + " n'ont" : "Q" + (aCorr[0] + 1) + " n'a") + " pas encore été " + (aCorr.length > 1 ? "corrigées" : "corrigée") + " (ni révélée en classe, ni lue par toi dans « Lire les copies »). Ouvre l'estimation sur les deux moitiés, puis la correction de ce qui reste."}, geste("c-estim", "lancerEstimation")), "📊 Lancer l'autoévaluation")
      : h("button", Object.assign({key:1, className:"btn btn-rouge", title:"Toutes les questions de la séance sont posées et corrigées : il n'y a plus rien à lancer. Termine la séance, après une confirmation ; une question écartée revient d'abord par « ↩️ Remettre », dans « 📋 Toutes les questions »."}, fen("c-terminer", "terminer")), "🛑 Terminer la séance")];
  else if(s.phase === "idle") actions = [h("button", Object.assign({key:1, className:"btn btn-primary"}, geste("c-q1-reflexion", "lancerQuestion", q0)), "▶️ Lancer Q" + (q0 + 1))];
  else if(s.phase === "reflexion") actions = [h("button", Object.assign({key:1, className:"btn btn-vert"}, geste("c-q1-tour1", "autoriserReponse")), "✋ Autoriser la réponse"), h(BoutonPauseH, {key:2}), h(BoutonRelancerH, {key:3})];
  else if(s.phase === "reponse") actions = [s.tour === 1 ? h("button", Object.assign({key:1, className:"btn btn-vert"}, geste("c-q1-tour2", "tourSuivant")), "⏭️ Tour suivant") : h("button", Object.assign({key:1, className:"btn btn-or"}, geste(s.qi === 2 ? "c-q3-close" : s.qi === 1 ? "c-q2-close" : "c-q1-close", "cloreQuestion")), "🔒 Clore la question"), h(BoutonPauseH, {key:2}), h(BoutonRelancerH, {key:3})];
  else {
    var nr = nonRepondus();
    var rouvrir = nr ? h("button", Object.assign({key:2, className:"btn btn-ghost"}, fen("c-rouvrir-tous", "rouvrirTous", s.qi)), "🔓 Rouvrir pour tous")
                     : h("button", {key:2, className:"btn btn-ghost", disabled:true, title:"Tous les présents ont répondu à cette question : il n'y a personne à rouvrir. Une réponse donnée est définitive."}, "🔓 Rouvrir pour tous");
    actions = !derniere ? [h("button", Object.assign({key:1, className:"btn btn-primary"}, geste(vaLancer, "lancerQuestion", suivante)), "▶️ Lancer Q" + (suivante + 1)), rouvrir]   // (relecteur n°64) après l'écart de Q3, la suite compte sans elle
                        : [h("button", Object.assign({key:1, className:"btn btn-or"}, geste("c-estim", "lancerEstimation")), "📊 Lancer l'autoévaluation"), rouvrir];
  }
  // (QCM-2) un bouton neuf par libellé : l'infobulle posée sur « ▶️ Lancer Q1 » ne reste pas sur « ⏭️ Tour suivant » (React garderait le même bouton)
  actions = actions.map(function(el){ return el && el.type === "button" && typeof el.props.children === "string" ? React.cloneElement(el, {key:"a:" + el.props.children}) : el; });
  var enCours = s.phase === "reflexion" || s.phase === "reponse";
  var qn = suivante == null ? null : EV.questions[suivante], tn = suivante == null ? null : tempsDe(suivante);
  var rangSuiv = suivante == null ? null : suivante + 1 - Object.keys(ec).filter(function(x){ return +x < suivante; }).length;
  var colG = h("div", null,
    h("div", {className:"pilot-status " + statusCls, title:TITRES_STATUT[s.phase]}, st),
    // (K6) la même colonne d'une phase à l'autre de la question : le champ qu'on tape garde son curseur
    !plusRien && h(ColonneTempsH, {key:"t" + s.qi, qi:s.qi == null ? (suivante == null ? 0 : suivante) : s.qi, phase:enCours ? s.phase : null, tour:s.tour, reste:s.chrono || 0, close:s.phase === "attente", qiPosee:s.qi != null}),
    s.qi != null && QCourante(s.qi),
    h("div", {className:"pilot-actions"}, actions),
    qn && h("div", {className:"pilot-q-next-detail"},
      h("div", {className:"label"}, "🔮 À venir — Q " + rangSuiv + " / " + nbQ, InfoI("La question suivante, avec ses deux temps : ils se changent dans « 📋 Toutes les questions », à droite.")),
      h("div", {className:"enonce-next"}, qn.enonce),
      h("div", {style:{fontSize:".72rem", color:"var(--gris)", fontStyle:"italic"}}, "Difficulté " + NIV[qn.niveau].label + " · réflexion " + tn.reflexion + " s · réponse " + tn.reponse + " s par tour · " + bonnesRep(qn.bonnes.length))));
  var colM = h("div", null,
    h("h3", {style:{margin:"0 0 .2rem"}}, "📱 Tablettes", InfoI("Chaque tablette, ses deux moitiés : qui est assis où, et où en est chacun. « 👁 » montre les deux moitiés en direct. Glisse un nom sur un autre pour échanger deux élèves : pendant la séance, ils changent de tablette et retapent leur code ; leurs réponses les suivent."), h("span", {style:{fontWeight:400, display:"block", fontSize:".8rem", color:"#475569", margin:".1rem 0 0"}}, s.sousTitre || "")),
    GrilleTablettes(s.paires || pairesDuMoment(), s.etat, enDirect() ? {deplacer:true} : null),
    Legende(s.legende || LEG_Q));
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte("🎯 " + EV.titre + " — " + CLASSE, [
      h("span", {key:0, style:{fontSize:".8rem", color:"var(--gris)", fontWeight:700}}, "🕙 Fin de l'heure : " + SCN.finHeure(k)),
      h("button", Object.assign({key:1, className:"btn btn-ghost btn-sm"}, fen("c-depart", "depart")), "🚫 Départ d'un élève"),
      // (relecteurs n°62, 100, 101) un geste qui n'a personne sur qui agir est fermé, et dit pourquoi
      Object.keys(m.partis || {}).length || absentsRevenusH().length ? h("button", Object.assign({key:2, className:"btn btn-ghost btn-sm"}, fen("c-retour", "retour")), "↩️ Retour d'un élève")
        : h("button", {key:2, className:"btn btn-ghost btn-sm", disabled:true, title:"Personne n'est parti pendant cette séance : il n'y a personne à faire revenir."}, "↩️ Retour d'un élève"),
      s.phase === "attente" && nonRepondus() > 0 ? h("button", Object.assign({key:4, className:"btn btn-ghost btn-sm"}, fen("c-rouvrir-un", "rouvrirUn", s.qi)), "🔓 Rouvrir pour un élève")
        : h("button", {key:4, className:"btn btn-ghost btn-sm", disabled:true, title:enCours ? "La question en cours n'est pas close : « 🔓 Rouvrir pour un élève » s'ouvre une fois close, pour ceux qui n'ont pas répondu." : s.phase === "attente" ? "Tous les présents ont répondu à cette question : il n'y a personne à rouvrir." : "Aucune question n'est encore close : il n'y a rien à rouvrir."}, "🔓 Rouvrir pour un élève"),
      h("button", Object.assign({key:5, className:"btn btn-ghost btn-sm"}, fen("c-finir-autre-heure", "finir")), "⏸️ Finir à une autre heure"),
      h("button", Object.assign({key:3, className:"btn btn-rouge btn-sm"}, fen("c-terminer", "terminer")), "🛑 Terminer la séance")]),
    h("div", {className:"pilot-stats"}, s.stats.map(function(x, i){ return h("div", {key:i, className:"pilot-stat", title:TITRES_STATS[x[1]]}, h("div", {className:"v"}, x[0]), h("div", {className:"l"}, x[1])); })),
    h("div", {className:"pilot-grid v2"}, colG, colM, Overview(s.qi, s.passees || [], s))), true);
}

/* ── Avant la question 1 : qui est entré, où en est chaque attestation ── */
// l'heure de la dernière coche d'une attestation (1 ou 2) : en direct, celle de la séance ; dans la maquette, celle du scénario
function heureAttestH(p, n){ return SCN.heureAttest(p, n) || ""; }
function PilotPret(){
  var m = momH(), c = SCN.compteurs(MO());
  var pe = m.pasEntres || [], ae = m.attestEnCours || {};
  return Pilot({phase:"idle", qi:null, stats:[[fr2(c.connectes), "connectés"], [fr2(c.attestations), "attestations"], [fr2(c.repondu), "ont répondu"], ["—", "justes"], ["—", "question"]],
    // (changement 1) « qui est assis où… » est dit par le « i » des tablettes : plus de sous-titre qui l'explique
    legende:[["#E8F5E9","✓ prêt : toutes les lignes cochées"],["#FEF3C7","attestation en cours : lignes cochées sur 8"],["#F1F5F9","pas encore entré"]],
    etat:function(p){ var hA = heureAttestH(p, 1); return deplaceH(p) ? deplaceH(p) : ae[p] != null ? {cls:"m-attest", st:"attestation " + ae[p] + "/8"} : pe.indexOf(p) >= 0 ? {cls:"m-connexion", st:"pas encore " + (sexeH(p) === "F" ? "entrée" : "entré")} : {cls:"m-pret", st:"✓ prêt" + (hA ? " · " + hA : "")}; }});
}

/* ── La seconde attestation, côté console ── */
function PilotAttest2(){
  var k = MO(), m = momH(), c = SCN.compteurs(k), enCours = m.enCours || {};
  var manquent = Object.keys(enCours).map(nomDe);
  var etat = function(p){ var hA = heureAttestH(p, 2); return deplaceH(p) ? deplaceH(p) : enCours[p] != null ? {cls:"m-attest", st:"attestation " + enCours[p] + "/5"} : {cls:"m-pret", st:"✓ prêt" + (hA ? " · " + hA : "")}; };
  var q2 = ORDRE_CORR[0], b = bilanQ(q2, k), prets = c.prets || [c.presents - manquent.length, c.presents];
  c = Object.assign({}, c, {presents:prets[1]});
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📝 Correction — " + EV.titre + " — " + CLASSE, InfoI("Avant la correction, chaque moitié montre la seconde attestation, une coche par ligne. La correction commence quand tous les présents l'ont cochée en entier, comme au début.")),
      [h("button", Object.assign({key:0, className:"btn btn-ghost btn-sm"}, fen("c-depart", "depart")), "🚫 Départ d'un élève"), h("button", Object.assign({key:5, className:"btn btn-ghost btn-sm"}, fen("c-finir-autre-heure", "finir")), "⏸️ Finir à une autre heure"), h("button", Object.assign({key:1, className:"btn btn-rouge btn-sm"}, fen("c-terminer", "terminer")), "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status correction"}, "✍️ Seconde attestation — " + prets[0] + " / " + prets[1] + " prêts"),
    h("div", {className:"corr-grid"},
      h("div", null,
        h("div", {className:"row", style:{marginTop:".2rem"}}, manquent.length > 0 || !enDirect()
          ? h("button", {className:"btn btn-primary ferme", disabled:manquent.length > 0, title:"S'ouvre quand les " + c.presents + " présents ont coché toutes les lignes de la seconde attestation. Il en manque " + manquent.length + "."}, "🔒 ▶️ Commencer la correction")
          : h("button", Object.assign({className:"btn btn-primary", title:"Commence la correction, par la question la plus ratée sur les tablettes."}, geste(null, "lancerCorrection")), "▶️ Commencer la correction")),
        manquent.length > 0 && h("div", {className:"manquent"},
          h("div", {className:"tt"}, "La correction commence quand les " + c.presents + " présents ont coché la seconde attestation. Il en manque " + manquent.length + " :"),
          h("div", {className:"noms"}, manquent.join(" · "))),
        q2 != null && h("div", {className:"pilot-eleve-help"}, "La correction commence par Q" + (q2 + 1) + ", la plus ratée sur les tablettes (" + b.justes + " / " + b.repondu + " justes).")),
      h("div", {className:"suivi-box"},
        h("h3", null, "✍️ La seconde attestation", InfoI("Où en est chacun : les lignes cochées sur 5, et l'heure de la dernière coche, gardée comme au début.")),
        h("div", {className:"ss"}, prets[0] + " / " + prets[1] + " prêts"),
        GrilleTablettes(PAIRES, etat),
        Legende([["#E8F5E9","✓ prêt : les 5 lignes cochées"],["#FEF3C7","attestation en cours : lignes cochées sur 5"]])))), true);
}

/* ── L'estimation, côté console (444) : la répartition des estimations déjà faites ── */
function PilotEstimation(){
  var k = MO(), m = momH(), c = SCN.compteurs(k), pas = m.pasEstime || [];
  var dist = {vert:0, bleu:0, orange:0, rouge:0};
  SCN.presents(k).forEach(function(p){ var e = enDirect() ? ESTIM[p] : SCN.ESTIM[p]; if(pas.indexOf(p) < 0 && e && dist[e] != null) dist[e]++; });
  var estime = c.estime || [c.presents - pas.length, c.presents];
  return Console("pilotage", "pilot", h("div", {className:"card"},
    TitreCarte(h(F, null, "📊 Autoévaluation — " + EV.titre + " — " + CLASSE, InfoI("Chaque élève dit combien de bonnes réponses il pense avoir. Cette estimation sert à savoir s'il se surévalue, se sous-évalue ou s'évalue correctement ; son bilan la compare à sa note.")),
      [h("button", Object.assign({key:5, className:"btn btn-ghost btn-sm"}, fen("c-finir-autre-heure", "finir")), "⏸️ Finir à une autre heure"), h("button", Object.assign({key:1, className:"btn btn-rouge btn-sm"}, fen("c-terminer", "terminer")), "🛑 Terminer la séance")]),
    h("div", {className:"pilot-status autoeval"}, "Phase autoévaluation — " + estime[0] + " / " + estime[1] + " élèves", InfoIB("Phase autoévaluation", "Les élèves choisissent dans quelle fourchette ils estiment avoir réussi.")),
    h("div", {className:"autoeval-prof-distrib"}, MAITRISE.map(function(mt){
      return h("div", {key:mt.k, className:"autoeval-prof-cell fourchette-" + mt.k}, h("span", null, mt.em + " " + mt.lib), h("strong", null, dist[mt.k])); })),
    pas.length > 0 && h("div", {style:{fontSize:".85rem", color:"var(--gris)"}}, "Pas encore : " + pas.map(nomDe).join(", ") + "."),
    h("div", {className:"row", style:{marginTop:"1rem"}}, h("button", Object.assign({className:"btn btn-or", title:"Ferme l'estimation et ouvre, sur chaque moitié, la seconde attestation, avant la première question à corriger."}, geste("c-attest2", "lancerCorrection")), "📝 Lancer la correction"))), true);
}

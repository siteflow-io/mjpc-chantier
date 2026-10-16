/* ═══════════════ Complément 3 — le scénario dans les écrans (changement 5) ═══════════════
   Chaque scène a son moment (src/scenario.js, SCN.MOMENT_DE ; « &m= » dans l'adresse quand un geste y mène à un autre moment).
   Tout ce qu'une scène montre se calcule du scénario à ce moment : les comptes, les notes, les états, les listes, les dates.
   Les fonctions de ce fichier remplacent celles des couches précédentes (la dernière déclaration l'emporte). */

/* ── Le moment de la scène ── */
// (QCM-1) le moment de l'app est toujours « LIVE » : la séance réelle, à son état présent (src/live/base.js, SCN.moment)
function MO(){ return window.MOMENT_COURANT || "LIVE"; }
function MOM(){ return SCN.moment(MO()) || {}; }
// (QCM-1) l'objet d'une fenêtre ouverte sur place (« &q= », « &eleve= »…) : celui que le geste a passé (src/live/gestes.js, NAV), sinon l'adresse
function paramHash(n){ if(typeof NAV !== "undefined" && NAV.params && NAV.params[n] != null) return String(NAV.params[n]); var m = new RegExp("[#&]" + n + "=([^&]+)").exec(location.hash || ""); return m ? decodeURIComponent(m[1]) : null; }
// une date du scénario, écrite courte (« 08/10 ») ; une heure (« 10:23 »)
function jjmm(d){ return String(d || "").slice(0, 5); }
function hhmm(t){ return String(t || "").slice(0, 5); }

/* (16/10, micro de la conscience n°12 ; Paul, 07:15 : « l'affichage du nom des classes (il y avait eu le même problème sur correction dictée, le nom des
   classes s'affichait en brut) ») LE NOM D'UNE CLASSE, À L'ÉCRAN : la règle de correction_dictee (nomClasseLisibleL15c). Le nom du registre MJPC s'il a
   des minuscules (« 3E Charles de Gaulle ») ; sinon ce nom, ou la clé, rendu lisible : « 3_dylan_bob » et « 3 DYLAN BOB » → « 3e Dylan Bob ». Une classe
   interne (« _test_… ») reste telle quelle. Pour l'écran seulement : la clé reste l'identifiant de la classe partout ailleurs (la base, les gestes, les tris). */
function nomClasseV(x){
  var s = String(x == null ? "" : x).trim(); if(!s || s.charAt(0) === "_") return s;
  var C = (typeof LIVE !== "undefined" && LIVE && LIVE.d && LIVE.d.classes) || (typeof v3Classes === "function" ? v3Classes() : null) || {};
  function san(t){ return String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }
  var k = C[s] ? s : Object.keys(C).filter(function(c){ return san(c) === san(s) || (C[c] && C[c].nom && san(C[c].nom) === san(s)); })[0];
  var base = (k && C[k] && C[k].nom ? String(C[k].nom) : "") || k || s;
  if(/[a-z]/.test(base) && base.indexOf("_") < 0) return base;   // écrit à la main, avec ses minuscules (« 3E Charles de Gaulle »), ou déjà lisible : tel quel
  var src = base.replace(/_/g, " ").replace(/\s+/g, " ").trim().toLowerCase(); if(!src) return s;
  src = src.replace(/(^|\s)([a-z\u00e0-\u00ff])/g, function(m, a, b){ return a + b.toUpperCase(); });
  return src.replace(/^(\d)\s/, "$1e ").replace(/^(\d)E\s/, "$1e ");
}
/* (16/10, Paul, 10:54 : « autant les notes ne s'affichent pas côté élève, si je t'ai bien compris, autant moi dans mon pilotage je dois les voir ! » ;
   11:02 : « Voilà. ») LES QUESTIONS PAS ENCORE LUES d'une note : ni écartées, ni annulées, ni pas posées, et sans points. La console montre la note
   telle qu'elle est, et ce nombre tant qu'il n'est pas nul ; la maîtrise et les compétences attendent la note complète. */
function nonLuesV(r, ecartees){ if(!r || !r.pts) return 0; var an = (r.annulees || []).map(Number), ec = (ecartees || r.ecartees || []).map(Number);
  return r.pts.filter(function(p, i){ var s = r.st && r.st[i]; return p == null && s !== "e" && s !== "x" && an.indexOf(i) < 0 && ec.indexOf(i) < 0; }).length; }
function NonLuesV(p){ var n = nonLuesV(p.r, p.ecartees); return n ? h("div", {className:"non-lues", style:{fontSize:".75rem", fontWeight:600, color:"#92400E", marginTop:".15rem"}, title:"Les questions de cette copie que la lecture n'a pas encore données : la note ne compte encore que celles qui sont lues. La maîtrise et les compétences attendent la note complète."}, n + " question" + (n > 1 ? "s" : "") + " pas encore lue" + (n > 1 ? "s" : "")) : null; }
/* ── (QCM-1) Les données de la séance réelle, rebranchées avant chaque rendu (brancherGlobales, appelée par src/socle.js) ── */
// les tables du scénario ne sont plus : chaque écran lit SCN (src/live/base.js) ; ces globales restent pour les écrans qui les nomment encore
RT = SCN.RT; ESTIM = SCN.ESTIM; ORD = SCN.ORD; TABL = SCN.TABL; FEUI = SCN.FEUI; LU = SCN.LU_JM; CO = SCN.CO; DIT_B = SCN.DIT_B;
ORDRE_CORR = []; PREMIER = []; PAIRES_AVANT = []; PAIRES = []; RF = {};
function brancherGlobales(){
  var ev = SCN.ev(), cl = SCN.classe();
  // hors séance (le lancement) : la classe et l'évaluation choisies dans les menus, et les binômes proposés pour cette classe
  if(!SCN.sid() && typeof GESTES !== "undefined"){ var c = GESTES.choixLancement(); if(c.classe) cl = c.classe; if(c.evalId) ev = SCN.evalParId(c.evalId); }
  if(ev) EV = ev; if(cl) CLASSE = nomClasseV(cl);   /* (16/10) le nom à l'écran, pas la clé */
  PAIRES = SCN.sid() ? SCN.paires() : (cl ? SCN.binomesProposes(cl).map(function(p){ return [p[0] ? SCN.nomDe(p[0]) : null, p[1] ? SCN.nomDe(p[1]) : null]; }) : []);
  PAIRES_AVANT = PAIRES;
  ORDRE_CORR = SCN.ordreCorr();
  PREMIER = ev ? ev.questions.map(function(q, i){ return SCN.premierCote(i) === "g" ? "J" : "M"; }) : [];
  RF = {}; SCN.presents().forEach(function(x){ RF[x] = ""; });
}
function nomDe(p){ return SCN.nomDe(p); }
// les tablettes de la séance : les places réelles (un élève seul a une moitié vide)
function pairesDuMoment(){ return SCN.paires(); }
// le côté qui répond à un tour : au 1er tour, celui qui commence la question ; au 2e, l'autre
function coteDuTour(qi, tour){ return SCN.coteDuTour(qi, tour); }
// l'élision devant un nom (changement 8) : « de Inès » s'écrit « d'Inès », « que Émile », « qu'Émile »
function voyelle(n){ n = String(n || ""); return /^[AEIOUYÉÈÊÀÂÎÔÛaeiouyéèêàâîôû]/.test(n) || /^[Hh]/.test(n) && !/^(Hugo|haut|hors|huit|hasard|héros|hâte)/i.test(n); }
function deNom(n){ return (voyelle(n) ? "d'" : "de ") + n; }
function queNom(n){ return (voyelle(n) ? "qu'" : "que ") + n; }


/* ── La note d'un élève, au moment de la scène (288 à 293, 303, 332) ── */
function calc(p){
  var k = MO(), n = SCN.note(p, k);
  var st = n.st.map(function(s){ return s === "n" ? "pasdit" : s; });
  var flags = SCN.aLire(k).filter(function(x){ return x.p === p; }).map(function(x){ return {q:x.q, txt:x.txt}; });
  return {pts:n.pts, st:st, flags:flags, n:n.n, total:n.total, complet:n.complet, sur20:n.sur20, comp:n.comp, corrigees:n.corrigees, annulees:n.annulees, ecartees:n.ecartees};
}
function stDe(e){ return calc(e.prenom).st; }
// « Trouvée au dernier moment » : le ✓ orange chez Paul comme chez l'élève (point 777) ; « ⛔ » ne dit que le point d'autonomie
function marque(s){ return s === "j" ? "✓" : s === "t" ? "✓" : s === "a" ? "∅" : s === "pasdit" ? "·" : "✗"; }
function detailComp(r, c){ return compQuestions(c).map(function(i){ return "Q" + (i+1) + " " + marque(r.st[i]); }).join(" · "); }
function niveauComp(r, c){ var x = r.comp[c]; return x ? maitriseDe(x.n * 20 / x.max) : maitriseDe(0); }

/* ── Les compteurs de la console (« connectés », « ont répondu », « justes », « question ») ── */
function fr2(a){ return a ? a[0] + "/" + a[1] : "—"; }
function statsQ(){
  var c = SCN.compteurs(MO());
  return [[c.connectes ? fr2(c.connectes) : c.presents + "/" + c.presents, "connectés"], [c.repondu ? fr2(c.repondu) : "0/" + c.presents, "ont répondu"],
    [c.justes && c.justes[1] ? fr2(c.justes) : "—", "justes"], [c.question ? fr2(c.question) : "—", "question"]];
}
// la moitié d'un élève pendant une question, au moment de la scène
function etatQuestion(s){
  var m = MOM(), nonRep = s.nonRep || m.nonRep || [], sansRep = m.sansRep || [], partis = m.partis || {};
  return function(p, cote){
    if(partis[p]) return {cls:"m-parti", st:"🚪 parti à " + partis[p]};
    if(s.reflexion) return {cls:"m-ecrit", st:"✍️ écrit"};
    if(s.fini) return sansRep.indexOf(p) >= 0 ? {cls:"m-pasrep", st:"⏳ pas de réponse"} : couleur(p, s.qi, false);
    var estPremier = cote === coteDuTour(s.qi, 1);
    if(s.tour === 1 && !estPremier) return {cls:"m-voile", st:"🙈 attend son tour"};
    if(s.tour === 2 && estPremier) return couleur(p, s.qi, true);
    if(nonRep.indexOf(p) >= 0) return {cls:"m-repond", st:"✋ répond…"};
    return couleur(p, s.qi, false);
  };
}

/* ── Les temps tapés pendant la séance : un seul endroit, que la fin prévue lit (changement 5.9) ── */
var TEMPS = {surcharges:{}, abonnes:[], actif:null};
function tempsRemettre(){ TEMPS.surcharges = {}; TEMPS.actif = null; }
// « 🔄 Relancer chrono » : le temps en cours repart de sa durée pleine ; la fin prévue suit
document.addEventListener("maquette-relancer", function(){ var a = TEMPS.actif; if(a && a.reste !== a.total) tempsChanger(a.qi, a.champ, a.total, a.total - a.reste); });
function tempsChanger(qi, champ, v, resteDelta){
  var o = Object.assign({}, TEMPS.surcharges); o[qi] = Object.assign({}, o[qi]); o[qi][champ] = v;
  if(resteDelta) o.reste = (o.reste || 0) + resteDelta;
  TEMPS.surcharges = o; TEMPS.abonnes.slice().forEach(function(f){ f(); });
}
function tempsDe(qi){ return SCN.tempsDe(qi, MO(), TEMPS.surcharges); }
function useTemps(){
  var s = useState(0), set = s[1];
  useEffect(function(){ var f = function(){ set(function(x){ return x + 1; }); }; TEMPS.abonnes.push(f); return function(){ TEMPS.abonnes = TEMPS.abonnes.filter(function(g){ return g !== f; }); }; }, []);
}
// la fin prévue : la somme des temps qui restent (scénario, Réglages, temps tapés) ; elle suit chaque temps changé
function FinPrevueC(p){
  useTemps();
  var f = SCN.finPrevue(MO(), TEMPS.surcharges), fh = SCN.finHeure(MO());
  if(!f) return null;
  var deb = Math.round(f.deborde / 60);
  return h("div", {className:"fin-prevue" + (deb > 0 ? " deborde" : ""), "data-fin-prevue":"1", title:"La fin prévue de la séance, recalculée à chaque temps changé ou question écartée : les questions qui restent, leurs deux tours, puis l'estimation, la correction, la co-évaluation et le bilan (durées de Réglages)."},
    deb > 0 ? "🏁 Fin prévue " + f.hm + ", " + deb + " min après la fin de l'heure" : "🏁 Fin prévue " + f.hm);
}
function FinPrevue(){ return h(FinPrevueC); }

/* ── La carte d'un temps de la question en cours : la valeur à taper, « +5 », « +10 », « +30 » ── */
function TempsCarte(p){   // p : lbl, champ, qi, reste, actif, fini, sous
  useTemps();
  var t = tempsDe(p.qi), total = t[p.champ];
  var reste = p.reste + (p.actif ? (TEMPS.surcharges.reste || 0) : 0);
  if(p.actif) TEMPS.actif = {qi:p.qi, champ:p.champ, total:total, reste:reste};
  var ferme = p.fini ? (p.champ === "reflexion" ? "La réflexion de cette question est finie : son temps ne se change plus." : "Les deux tours de cette question sont finis : son temps de réponse ne se change plus.") : null;
  function ajout(n){ tempsChanger(p.qi, p.champ, total + n, p.actif ? n : 0); }
  return h("div", {className:"pilot-chrono-card" + (p.actif ? " actif" : "")},
    h("div", {className:"label" + (p.actif ? " actif" : "")}, p.lbl),
    h("div", {className:"v"}, p.actif ? reste + "s" : total + "s"),
    h("div", {className:"desc"}, p.sous),
    h("div", {className:"inline-edit t-edit"},
      h("input", {type:"number", min:1, value:total, disabled:!!ferme, "data-q":p.qi + 1, "data-temps":p.champ, "aria-label":"Temps " + p.lbl,
        title:ferme || (p.champ === "reflexion" ? "Tape le temps de réflexion de cette question, en secondes. La fin prévue suit." : "Tape le temps de réponse de cette question, en secondes : il vaut pour chaque tour et pour la lecture à la correction. La fin prévue suit."),
        onChange:function(e){ var v = parseInt(e.target.value, 10); if(v > 0) tempsChanger(p.qi, p.champ, v, p.actif ? v - total : 0); }}),
      h("span", {className:"t-s"}, "s"),
      [5, 10, 30].map(function(n){ return h("button", {key:n, className:"btn btn-ghost btn-sm t-plus", "data-local":"1", disabled:!!ferme,
        title:ferme || ("Ajoute " + n + " s au temps de " + (p.champ === "reflexion" ? "réflexion" : "réponse") + " de cette question" + (p.actif ? ", tout de suite au chrono en cours" : "") + ". La fin prévue suit."), onClick:function(){ ajout(n); }}, "+" + n); })));
}
function ColonneTemps(p){   // la réflexion et la réponse de la question en cours, et la fin prévue
  var qi = p.qi;
  var finiRef = p.phase !== "reflexion", finiRep = p.phase === null && p.close;
  return h(F, null,
    h("div", {className:"pilot-chronos-info"},
      h(TempsCarte, {lbl:"🧠 Réflexion", champ:"reflexion", qi:qi, reste:p.reste, actif:p.phase === "reflexion", fini:finiRef && p.qiPosee, sous:p.phase === "reflexion" ? "EN COURS" : "pour cette question"}),
      h(TempsCarte, {lbl:"✋ Réponse", champ:"reponse", qi:qi, reste:p.reste, actif:p.phase === "reponse", fini:finiRep, sous:p.phase === "reponse" ? (p.tour === 1 ? "1er tour" : "2e tour") + " · EN COURS" : "par tour"})),
    h(FinPrevueC));
}
/* ── « 📋 Toutes les questions » : les temps des questions à venir se tapent ici ── */
function TempsMini(p){
  useTemps();
  var t = tempsDe(p.qi);
  function champ(c, lbl, nom){ return h("label", {className:"tm-l"}, lbl, h("input", {type:"number", min:1, value:t[c], "data-q":p.qi + 1, "data-temps":c,
    title:"Le temps de " + nom + " de la question " + (p.qi + 1) + ", pour cette séance : l'évaluation elle-même ne change pas. La fin prévue suit.",
    onChange:function(e){ var x = parseInt(e.target.value, 10); if(x > 0) tempsChanger(p.qi, c, x); }}), "s"); }
  return h("div", {className:"tm"}, champ("reflexion", "🧠 ", "réflexion"), champ("reponse", "✋ ", "réponse"));
}

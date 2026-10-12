/* ═══════════════ Complément 3 — le scénario dans les écrans (changement 5) ═══════════════
   Chaque scène a son moment (src/scenario.js, SCN.MOMENT_DE ; « &m= » dans l'adresse quand un geste y mène à un autre moment).
   Tout ce qu'une scène montre se calcule du scénario à ce moment : les comptes, les notes, les états, les listes, les dates.
   Les fonctions de ce fichier remplacent celles des couches précédentes (la dernière déclaration l'emporte). */

/* ── Le moment de la scène ── */
function MO(){ return window.MOMENT_COURANT || "PREP"; }
function MOM(){ var m = SCN.moment(MO()) || {}, pt = paramHash("parti");
  // (complément 3, changement 4) le départ montré est celui de l'élève cliqué (« &parti= »)
  if(pt){ var o = {}; o[pt] = m.partis ? Object.values(m.partis)[0] : hhmm(m.heure); m = Object.assign({}, m, {partis:o}); }
  return m; }
function paramHash(n){ var m = new RegExp("[#&]" + n + "=([^&]+)").exec(location.hash || ""); return m ? decodeURIComponent(m[1]) : null; }
// une date du scénario, écrite courte (« 08/10 ») ; une heure (« 10:23 »)
function jjmm(d){ return String(d || "").slice(0, 5); }
function hhmm(t){ return String(t || "").slice(0, 5); }

/* ── Les données de la séance du 08/10, celles du scénario ── */
RT = SCN.RT; ESTIM = SCN.ESTIM; ORDRE_CORR = SCN.ORDRE_CORR; ORD = SCN.ORD; PREMIER = SCN.PREMIER; TABL = SCN.TABL; FEUI = SCN.FEUI; LU = SCN.LU_JM;
PAIRES_AVANT = SCN.PAIRES_AVANT; PAIRES = SCN.PAIRES; CO = SCN.CO; DIT_B = SCN.DIT_B;
// les élèves présents, sans les valeurs d'hier : la liste des prénoms vient des binômes
RF = {}; SCN.presents("S08:Q1:R").forEach(function(p){ RF[p] = ""; });
function nomDe(p){ return SCN.nomDe(p); }
// (complément 4, correction 3) les tablettes d'une séance qui a ses propres élèves (le rattrapage) : chacun seul sur la sienne
function pairesDuMoment(){ var se = SCN.seance(MOM().seance); return se && se.eleves ? se.eleves.map(function(n){ return [n, null]; }) : PAIRES; }
// (complément 4, correction 5) le côté qui répond à un tour : au 1er tour, celui qui commence la question (PREMIER) ; au 2e, l'autre
function coteDuTour(qi, tour){ return (PREMIER[qi] === "J") === (tour === 1) ? "g" : "d"; }
// l'élision devant un nom (changement 8) : « de Inès » s'écrit « d'Inès », « que Émile », « qu'Émile »
function voyelle(n){ n = String(n || ""); return /^[AEIOUYÉÈÊÀÂÎÔÛaeiouyéèêàâîôû]/.test(n) || /^[Hh]/.test(n) && !/^(Hugo|haut|hors|huit|hasard|héros|hâte)/i.test(n); }
function deNom(n){ return (voyelle(n) ? "d'" : "de ") + n; }
function queNom(n){ return (voyelle(n) ? "qu'" : "que ") + n; }

/* ── (relecteur n°303) les codes de la classe : YVON Adam n'en a pas encore ; les bilans de la clé comptent ceux qui existent ── */
SECU_BILAN_AUTO = SECU_BILAN_AUTO.replace(/^25 /, Object.keys(CODES_ESSAI).length + " ");
SECU_BILAN_RELANCE = SECU_BILAN_RELANCE.replace(/ 25 déjà/, " " + Object.keys(CODES_ESSAI).length + " déjà");

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
  return [[c.presents + "/" + c.presents, "connectés"], [c.repondu ? fr2(c.repondu) : "0/" + c.presents, "ont répondu"],
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

/* Tour 620 — le mode test refait à partir de celui de la 7.7.1 (audit https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/QCM-MODE-TEST-09-10/README.md),
   pour qu'il soit la même chose que le réel (Paul, 10/10, 07:00). Tout ce que la 7.7.1 a est gardé, au même endroit, avec ses mots :
   l'en-tête, « 🔬 Éprouver les mécanismes livrés » et ses cinq boutons, « 🎓 Entrer comme un élève », l'encadré, le panneau prof,
   les 30 élèves fictifs (leurs vrais noms de la 7.7.1), « 🎲 Tous les élèves répondent ». Ce qui change est souligné en orange. */
var TEST_NOMS = ["AUDEBERT Élise","AUGEREAU Gatien","BOIVIN Eden","BOURREAU Céleste","BRESSIN Titouan","CALDEIRA Tiago","CESBRON Lili","CHALUMEAU Jules",
  "CHAN Aymeric","CHARRIER Line","CHOLET Pierre","CHOUTEAU Baptistine","DELACROIX Romain","DESBOIS Auriane","DESLIN Lucas","DITTIERE Romane",
  "HEINRICH Clovis","JAMIN Noé","JUIN Angèle","KOCK Elisa","LAURY Maël","PAGEOT Elie","PINET Charlotte","POULAIN Zélia","REVET Lucas",
  "ROLLAND Gabriel","ROULLEAU Candice","TENNEGUIN Arthur","XAVIER Capucine","VINET Émile"];
var TEST_F = {"Élise":1,"Céleste":1,"Lili":1,"Line":1,"Baptistine":1,"Auriane":1,"Romane":1,"Angèle":1,"Elisa":1,"Charlotte":1,"Zélia":1,"Candice":1,"Capucine":1};
var TEST_PAIRES30 = []; for(var ti = 0; ti < 30; ti += 2) TEST_PAIRES30.push([TEST_NOMS[ti], TEST_NOMS[ti+1]]);
var CLASSE_TEST = "_test_evaluation-qcm";
var DEMO = {titre:"🎓 Démo — apprendre le déroulé", mode:"strict", questions:[
  {enonce:"Quelle est la capitale de l'Italie ?", choix:["Milan","Naples","Rome","Venise"], bonnes:[2], niveau:"facile", reflexion:20, reponse:15, competences:[]},
  {enonce:"Lesquelles sont des capitales européennes ?", choix:["Madrid","Genève","Berlin","Sydney"], bonnes:[0,2], niveau:"standard", reflexion:30, reponse:20, competences:[]},
  {enonce:"Pourquoi l'araignée n'est-elle pas un insecte ?", choix:["Parce qu'elle a six pattes","Parce qu'elle a huit pattes","Parce qu'elle tisse une toile","Parce qu'elle est trop grande"], bonnes:[1], niveau:"standard", reflexion:30, reponse:20, competences:[]}
]};
function eleveT(nom, cle){ return {cle:cle, nom:nom, prenom:pre(nom), sexe:TEST_F[pre(nom)] ? "F" : "M"}; }
function avecTest(f){ // la scène se dessine avec la classe et l'évaluation du mode test
  var sv = {EV:EV, CLASSE:CLASSE, PAIRES:PAIRES, PAIRES_AVANT:PAIRES_AVANT};
  EV = DEMO; CLASSE = CLASSE_TEST; PAIRES = TEST_PAIRES30; PAIRES_AVANT = TEST_PAIRES30;
  try { return f(); } finally { EV = sv.EV; CLASSE = sv.CLASSE; PAIRES = sv.PAIRES; PAIRES_AVANT = sv.PAIRES_AVANT; }
}

/* ── Le haut de la page : celui de la 7.7.1, plus « 🎬 Préparer un cas » ── */
function HautModeTest(phase){
  return h(F, null,
    h("div", {className:"prof-header"},
      h("h1", null, "🧪 Évaluation QCM", h("span", {className:"badge", style:{background:"var(--rose)", color:"#fff"}}, "MODE TEST")),
      h("div", {className:"row"},
        h("button", {className:"btn btn-ghost btn-sm"}, "📥 Exporter snapshot test"),
        h("button", {className:"btn btn-primary btn-sm"}, "📱 QR pilotage"),
        h("button", {className:"btn btn-rouge btn-sm"}, "🗑️ Sortir et purger"))),
    h("div", {className:"test-info", style:{marginTop:".8rem"}},
      h("strong", null, "🔬 Éprouver les mécanismes livrés"),
      h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, "Ces boutons appellent les fonctions réelles de l'application, pas des copies."),
      h("div", null, ["🔒 Clôturer (chemin réel)", "✏️ Modifier l'éval après coup", "⚖️ Vérifier que les notes n'ont pas bougé", "⏱️ Faire expirer le chrono", "🔄 Relire l'état"].map(function(t, i){
        return h("button", {key:i, className:"btn btn-ghost btn-sm", style:{marginRight:".4rem", marginBottom:".4rem"}}, t); })),
      h("div", {style:{fontSize:".85rem"}}, "Séance : ", h("strong", null, phase === "avant" ? "pas encore lancée" : "en_cours"), " · énoncé ", h("strong", null, "non conservé")),
      h("div", {style:{fontSize:".82rem", marginTop:".3rem"}}, Pz("« ⏱️ Faire expirer le chrono » fait expirer le temps en cours, quel qu'il soit : réflexion, réponse, « Oui / Non », lecture du voisin."))),
    h("div", {className:"test-info"},
      h("strong", null, "🎬 ", Pz("Préparer un cas")),
      h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, Pz("Remplit les tablettes, les feuilles et les clics d'un cas connu, sur la démo, jusqu'au moment du cas ; tu joues la suite. Il écrit au hub ce qu'écriraient les clics.")),
      h("div", null, ["Le cas ambigu", "Un faux « Oui »", "Rien de dit à la fin du temps", "Un lecteur qui clique « aucun » partout", "Deux élèves d'accord pour mentir", "Trouvée au dernier moment", "Une tablette en panne", "Un départ en cours de séance"].map(function(t, i){
        return h("button", {key:i, className:"btn btn-ghost btn-sm", style:{marginRight:".4rem", marginBottom:".4rem"}}, Pz(t)); }))),
    h("div", {className:"test-info"},
      h("strong", null, "🎓 Entrer comme un élève"),
      h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, "Ouvre l'application élève telle qu'elle est : ", Pz("« Combien êtes-vous sur cette tablette ? », puis code, prénom et nom, puis le code du binôme"), ". Exemple — ", h("strong", null, "AUDEBERT Élise"), " · code ", h("strong", null, "1000")),
      h("button", {className:"btn btn-ghost btn-sm"}, "👋 Ouvrir le portail élève"),
      h("div", {style:{fontSize:".85rem", marginTop:".4rem"}}, "▸ Voir tous les codes du bac à sable")),
    h("div", {className:"test-info"},
      h("strong", null, "Environnement de test isolé. "),
      Pz("Classe fictive (30 élèves simulés, 15 tablettes), la démo par défaut. Tu pilotes en haut comme en classe, et tu joues les tablettes en bas. À la sortie, tout est purgé automatiquement, sauf la démo.")));
}

/* ── Les tablettes simulées : 15, chacune la vraie tablette en deux moitiés, en petit ; « 🔍 Jouer en grand » ── */
function TabSimT(num, a, b, contenu, feuilles){
  return h("div", {key:num, className:"sim-cadre simt"},
    h("div", {className:"sim-titre simt-titre"}, h("span", null, "📱 Tablette " + num + " · " + a + (b ? " · " + b : "")), h("button", {className:"btn btn-ghost btn-sm simt-grand"}, "🔍 ", Pz("Jouer en grand"))),
    h("div", {className:"sim"}, h("div", {className:"sim-in"}, contenu)),
    feuilles && h("div", {className:"simt-feuilles"}, feuilles));
}
function ChampFeuille(nom, texte){
  return h("div", {className:"simt-f"},
    h("span", {className:"simt-fl"}, "📝 ", Pz("Feuille " + deNom(pre(nom)))),
    h("span", {className:"simt-fi" + (texte ? "" : " vide")}, texte || Pz("vide : sa feuille dira ce qu'" + (TEST_F[pre(nom)] ? "elle" : "il") + " clique")));
}
function TablettesSimulees(etape){
  var feuillesQ3 = {"AUDEBERT Élise":"parce qu'elle a 6 pattes", "AUGEREAU Gatien":"elle a 8 pattes", "BOIVIN Eden":"l'araignée a huit pattes, l'insecte six", "CALDEIRA Tiago":"8 pattes", "CESBRON Lili":"car elle a 8 pates"};
  return h(F, null,
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem", marginTop:".8rem"}},
      h("h2", {className:"test-section-title", style:{margin:0}}, "👥 ", Pz("Tablettes simulées"), InfoI()),
      h("button", {className:"btn btn-primary btn-sm"}, "🎲 Tous les élèves répondent")),
    etape === "reflexion" && h("div", {className:"simt-aide"}, Pz("Pendant la réflexion, tu tapes sous chaque tablette ce que chaque élève écrit sur sa feuille. La feuille est posée à côté de la tablette, comme en classe.")),
    h("div", {className:"sims"}, TEST_PAIRES30.map(function(p, i){
      var a = eleveT(p[0], "J"), b = eleveT(p[1], "M");
      var contenu = etape === "avant" ? EcrCombien() : Tablette(EcrReflexion(a, 2, 18), EcrReflexion(b, 2, 18));
      var feuilles = etape === "reflexion" ? [ChampFeuille(p[0], feuillesQ3[p[0]]), ChampFeuille(p[1], feuillesQ3[p[1]])] : null;
      return TabSimT(i+1, p[0], p[1], contenu, feuilles);
    })));
}

/* ── 620-1 : à l'ouverture ; le panneau prof est la vraie console d'avant l'heure (appel, binômes) ── */
function ModeTestOuverture(){
  return avecTest(function(){
    var carte = h("div", {className:"card"},
      h("h2", null, "🎯 Lancer une nouvelle séance", InfoI()),
      h("div", {className:"lancer-grid"},
        h("div", null,
          h("div", {className:"field"}, h("label", null, "Classe", InfoI()), h("select", {value:"c", readOnly:true}, h("option", {value:"c"}, "🧪 " + CLASSE_TEST + " (30 élèves)"))),
          h("div", {className:"field"}, h("label", null, "Évaluation", InfoI()), h("select", {value:"e", readOnly:true}, h("option", {value:"e"}, DEMO.titre + " (3 questions)"))),
          h("div", {className:"duree-box"}, "⏱️ ", h("strong", null, "Durée estimée : 11 min"), " — entrée 3 min, questions 4 min (deux tours par question), estimation 1 min, correction 3 min.", h("br"), "✅ Ça tient dans les 45 minutes utiles."),
          h("button", {className:"btn btn-primary"}, "🚀 Lancer la séance")),
        h("div", {className:"binomes-box"},
          h("div", {className:"tt"}, "📱 Binômes proposés — ", Pz("dans l'ordre de la liste : la classe de test n'a pas de QCM précédent")),
          h("div", {className:"ss"}, "Glisse un nom sur un autre pour échanger deux élèves, ou sur une moitié vide pour l'y déplacer. Tu peux le faire jusqu'au bout de l'heure."),
          GrilleTablettes(TEST_PAIRES30, null, {grip:true, coin:" "}))));
    return h("div", {className:"prof-wrap cons"},
      DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
      h("div", {className:"prof full"},
        HautModeTest("avant"),
        h("div", {className:"test-prof-zone"},
          h("h2", {className:"test-section-title"}, "🎯 Panneau prof", InfoI()),
          h("div", {className:"simt-note"}, Pz("Le même panneau qu'en classe, avant l'heure : choix de l'évaluation, binômes, puis l'appel au lancement.")),
          carte),
        TablettesSimulees("avant")));
  });
}
/* ── 620-2 : pendant la réflexion de la question 3 ; le panneau prof est la vraie console de séance ── */
function ModeTestSeance(st, etape){
  return avecTest(function(){
    var pilot = Pilot(st);   // la vraie console de séance (même composant qu'en classe)
    var carte = pilot.props.children[1].props.children[2];   // sa carte, sans l'en-tête de la console
    return h("div", {className:"prof-wrap cons"},
      DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
      h("div", {className:"prof full"},
        HautModeTest("seance"),
        h("div", {className:"test-prof-zone"}, h("h2", {className:"test-section-title"}, "🎯 Panneau prof", InfoI()), carte),
        TablettesSimulees(etape)));
  });
}
function ModeTestReflexion(){
  return ModeTestSeance({phase:"reflexion", qi:2, chrono:18, stats:statsQ(), passees:[0, 1], etat:etatQuestion({qi:2, reflexion:true})}, "reflexion");
}
/* ── 620-3 : « 🔍 Jouer en grand » la tablette 1, au « Oui / Non » de la question 3 ── */
function EcrDeclareDemo(e, qi, ordre, sel, chrono){
  var q = DEMO.questions[qi];
  return Page(CLASSE_TEST + " · " + e.nom, DEMO.titre, h("div", {className:"eleve-q-zone"},
    QHead(qi), h("div", {className:"eleve-q-enonce"}, q.enonce),
    h("div", {className:"fige"}, "⏱️ Temps fini : ton clic est enregistré."),
    h("div", {className:"eleve-choix long fige-choix"}, ordre.map(function(i){
      var moi = sel.indexOf(i) >= 0;
      return h("button", {key:i, className:"eleve-choix-btn" + (moi ? " selected" : ""), disabled:!moi}, h("span", null, q.choix[i]));
    })),
    h("div", {className:"decl-b-titre"}, e.prenom + ", regarde ta feuille : dit-elle la même chose que ton clic ?"),
    h("div", {className:"decl-b-btns"}, h("button", {className:"decl-b-btn"}, "Oui, la même chose"), h("button", {className:"decl-b-btn"}, "Non, autre chose")),
    h("div", {className:"decl-b-chrono"}, "⏱️ " + chrono + " s")));
}
function ModeTestGrand(){
  var a = eleveT(TEST_NOMS[0], "J"), b = eleveT(TEST_NOMS[1], "M");
  var fond = ModeTestSeance({phase:"reponse", qi:2, tour:1, chrono:0, stats:statsQ(), passees:[0, 1],
    etat:function(p, cote){ if(cote === "d") return {cls:"m-voile", st:"🙈 attend son tour"}; return p === "Élise" ? {cls:"m-repond", st:"✋ dit si sa feuille…"} : {cls:"m-dit", st:"a répondu"}; }}, "reflexion");
  var tab = avecTest(function(){ return Tablette(EcrDeclareDemo(a, 2, [2, 0, 3, 1], [1], 3), VoileN(b, a)); });
  return h(F, null, fond,
    h("div", {className:"grand-fond"},
      h("div", {className:"grand-boite"},
        h("div", {className:"grand-h"}, h("strong", null, "📱 Tablette 1 · " + a.nom + " · " + b.nom), h("span", {className:"grand-p"}, Pz("en grand, à la taille d'une vraie tablette")), h("button", {className:"btn btn-rouge btn-sm"}, "✕ ", Pz("Revenir aux 15 tablettes"))),
        h("div", {className:"grand-tab"}, tab),
        h("div", {className:"simt-feuilles grand-f"},
          ChampFeuille(a.nom, "parce qu'elle a 6 pattes"),
          ChampFeuille(b.nom, "elle a 8 pattes")),
        h("div", {className:"grand-note"}, Pz("Élise a écrit « 6 pattes » et cliqué « huit pattes » au dernier moment : si elle répond « Oui », c'est un faux « Oui » ; ta console le relèvera à la correction.")))));
}

SCENES = SCENES.concat([
  {id:"x620-1-mode-test-ouverture", vue:"console", render:ModeTestOuverture},
  {id:"x620-2-mode-test-reflexion", vue:"console", render:ModeTestReflexion},
  {id:"x620-3-mode-test-en-grand", vue:"console", vh:1150, render:ModeTestGrand}
]);
window.LISTE_SCENES = SCENES.map(function(s){ return {id:s.id, vue:s.vue, vh:s.vh || null}; });
rendre();


/* ═══════════════ [QCM-3 · SOIR] Le mode test, la même chose que le réel sur la classe de test ═══════════════
   Une vraie classe (classes/_test_evaluation-qcm, les 30 élèves fictifs de la 7.7.1, leurs codes au hub), une copie de la démo qui compte
   (qcm/evaluations/_test_evaluation-qcm), une vraie séance : le panneau prof est la vraie console, chaque tablette simulée montre les deux
   vraies moitiés et ses clics passent par les vrais gestes de l'élève (ELV). « 🗑️ Sortir et purger » efface tout cela ; la démo reste. */
var TEST_EVAL = "_test_evaluation-qcm";
var MODE_TEST = {prepare:false, entres:{}, msgs:{}, grand:null, notes:null};
function testSlugs(){ return TEST_NOMS.map(v3Slug); }
function testCode(i){ return String(1000 + ((i * 137) % 9000)); }
function testSid(){ var a = v3(v3Q("sessionActive")) || {}, s = a[CLASSE_TEST]; return s && v3Sessions()[s] ? s : null; }
function testSession(){ var sid = testSid(); return sid ? seanceV(sid) : null; }
function testDeroule(){ var se = testSession(); return se ? deroule(se.S) || {} : {}; }
// la classe, ses codes (l'empreinte du hub, comme les vrais), l'évaluation de test : écrits une fois, à l'entrée dans le mode test
function preparerModeTest(){
  if(MODE_TEST.prepare || MODE_TEST.sortie || !v3db()) return; MODE_TEST.prepare = true;
  // la séance pilotée avant le mode test (une vraie classe, peut-être en pleine heure) : elle se retrouve en sortant du mode test
  if(typeof LIVE !== "undefined"){ if(LIVE.classeSlug !== CLASSE_TEST) MODE_TEST.avant = {classeSlug:LIVE.classeSlug || null, sid:LIVE.sid || null, lancement:typeof LANCEMENT !== "undefined" ? {classe:LANCEMENT.classe, evalId:LANCEMENT.evalId} : null}; LIVE.classeSlug = CLASSE_TEST; LIVE.sid = null; }
  if(typeof LANCEMENT !== "undefined"){ LANCEMENT.classe = CLASSE_TEST; LANCEMENT.evalId = TEST_EVAL; }
  var db = v3db(), amen = {};
  TEST_NOMS.forEach(function(n){ amen[v3Slug(n)] = {sexe:TEST_F[pre(n)] ? "f" : "m"}; });
  db.ref("classes/" + CLASSE_TEST).once("value").then(function(s){ if(!s.val()) return v3Set("classes/" + CLASSE_TEST, {nom:CLASSE_TEST, niveau:"3e", archivee:false, eleves:TEST_NOMS.slice(), amenagements:amen}); });
  db.ref(v3Q("evaluations/" + TEST_EVAL)).once("value").then(function(s){ if(!s.val()){ var d = demoBrute(); d.demo = null; d.test = true; d.chapitre = "3e-ch1";
    d.questions = d.questions.map(function(q){ return Object.assign({}, q, {competences:["c4-lire-01"], verifie:"retrouver la réponse du cours"}); });
    return v3Set(v3Q("evaluations/" + TEST_EVAL), v3Sans(d)); } });
  if(typeof mjpcEmpreinte === "function" && typeof mjpcSelAleatoire === "function")
    db.ref("codes/" + v3Slug(TEST_NOMS[0])).once("value").then(function(s){ if(s.val()) return;
      TEST_NOMS.reduce(function(p, n, i){ return p.then(function(){ var sel = mjpcSelAleatoire(); return Promise.resolve(mjpcEmpreinte(testCode(i), sel)).then(function(emp){ return v3Set("codes/" + v3Slug(n), {name:n, classe:CLASSE_TEST, createdAt:Date.now(), sel:sel, empreinte:emp, chiffre:"test"}); }); }); }, Promise.resolve()); });
}
function purgerModeTest(){
  var db = v3db(); if(!db) return Promise.resolve();
  // pendant la sortie, un rendu du mode test ne recrée rien (la classe, l'évaluation, les codes) : la sortie finit hors du mode test
  MODE_TEST.sortie = true;
  return db.ref(v3Q("sessions")).once("value").then(function(s){
    var X = s.val() || {}, l = [];
    Object.keys(X).forEach(function(sid){ if(X[sid] && (X[sid].classeSlug === CLASSE_TEST || X[sid].evalId === TEST_EVAL)) l.push(v3Set(v3Q("sessions/" + sid), null)); });
    l.push(v3Set(v3Q("sessionActive/" + CLASSE_TEST), null), v3Set("classes/" + CLASSE_TEST, null), v3Set(v3Q("evaluations/" + TEST_EVAL), null), v3Set(v3Q("presence/" + CLASSE_TEST), null));
    testSlugs().forEach(function(k){ l.push(v3Set("codes/" + k, null)); });
    return Promise.all(l);
  }).then(function(){ MODE_TEST.prepare = false; MODE_TEST.entres = {}; MODE_TEST.notes = null; quitterModeTest(); if(typeof LANCEMENT !== "undefined"){ LANCEMENT.classe = null; LANCEMENT.evalId = null; } });
}
// quitter le mode test (un onglet, « Sortir et purger ») : la console revient à la séance qu'elle pilotait avant
function quitterModeTest(){
  MODE_TEST.actif = false; MODE_TEST.prepare = false; MODE_TEST.paires = null;
  if(typeof LIVE !== "undefined" && LIVE.classeSlug === CLASSE_TEST){ var a = MODE_TEST.avant || {}; LIVE.classeSlug = a.classeSlug || null; LIVE.sid = a.sid || null;
    if(typeof LANCEMENT !== "undefined" && LANCEMENT.classe === CLASSE_TEST){ LANCEMENT.classe = a.lancement ? a.lancement.classe : null; LANCEMENT.evalId = a.lancement ? a.lancement.evalId : null; } }
  MODE_TEST.avant = null;
}
// les notes de la séance de test, pour « ⚖️ Vérifier que les notes n'ont pas bougé »
function notesTest(se){ var o = {}; se.presents.forEach(function(e){ var r = resultatV(se, e.slug); o[e.slug] = r ? r.n + "/" + r.total : null; }); return o; }
function hasard(l){ return l[Math.floor(Math.random() * l.length)]; }
// « 🎲 Tous les élèves répondent » : chacun fait, par les vrais gestes de l'élève, ce que le moment lui demande
function tousRepondent(){
  var se = testSession(); if(!se) return Promise.resolve();
  var d = deroule(se.S) || {}, ph = d.ph, qi = d.qi, ev = se.ev, l = [], pres = se.presents.map(function(e){ return e.slug; });
  var qb = d.bPour && d.bPour.qi != null ? +d.bPour.qi : qi;
  pres.forEach(function(x){
    // B : la moitié qui vient de répondre le dit, même pendant le tour suivant ou la question close (contrat C6 : SCN.doitDireB, deroule.bPour)
    if(ph !== "b" && qb != null && typeof SCN.doitDireB === "function" && SCN.doitDireB(x) && !SCN.ditB(x, qb)) l.push(ELV.direB(qb, Math.random() < 0.85 ? "oui" : "non", x));
    var q = qi != null ? ev.questions[qi] : null, juste = Math.random() < 0.7, faux = q ? q.choix.map(function(c, i){ return i; }).filter(function(i){ return q.bonnes.indexOf(i) < 0; }) : [];
    if(ph === "entree" || ph === "pret" || ph === "appel"){ l.push(ELV.cocher(1, 8, x)); l.push(ELV.commencer(x, 1)); }
    else if((ph === "reponse" || ph === "rouvert") && (ph === "rouvert" ? d.pour === x || d.rouvert === "tous" : SCN.cote(x) === d.cote) && !SCN.reponse(x, qi)) l.push(ELV.repondre(qi, juste ? q.bonnes : [hasard(faux)], x));
    else if(ph === "b" && SCN.cote(x) === d.cote && !SCN.ditB(x, qi)) l.push(ELV.direB(qi, Math.random() < 0.85 ? "oui" : "non", x));
    else if(ph === "estim" && !SCN.estimationDe(x)) l.push(ELV.estimer(hasard(["vert", "bleu", "orange", "rouge"]), x));
    else if(ph === "att2"){ l.push(ELV.cocher(2, 5, x)); l.push(ELV.commencer(x, 2)); }
    else if(ph === "lecture" && !SCN.lecture(x, qi)){ var r = SCN.reponse(x, qi); l.push(ELV.lire(qi, r ? r.choix : "aucun", x)); }
    else if(ph === "coeval" && !(SCN.coevalDe && SCN.coevalDe(x))) l.push(ELV.coeval("ok", null, null, x));
  });
  return Promise.all(l);
}
// à l'entrée (après l'appel), chaque élève présent est entré sur sa tablette simulée, comme s'il avait tapé son code
function entrerTous(se){
  var u = {}, n = 0; se.presents.forEach(function(e){ if(!(se.S.entres || {})[e.slug] && !MODE_TEST.entres[se.id + e.slug]){ MODE_TEST.entres[se.id + e.slug] = 1; u["entres/" + e.slug] = Date.now(); n++; } });
  if(n) v3Update(v3Q("sessions/" + se.id), u);
}
var CAS_TEST = {
  "Le cas ambigu":function(se, d){ if(d.ph !== "coeval") return false; var x = se.presents[0].slug, q = v3Liste(se.S.revelees).map(Number)[0]; if(q == null) return false; var Q = se.ev.questions[q];
    return ELV.coeval("mal", q, [Q.choix.map(function(c, i){ return i; }).filter(function(i){ return Q.bonnes.indexOf(i) < 0; })[0]], x); },
  // B se dit dans la phase b, ou pendant que la suite commence (contrat C6 : deroule.bPour, la moitié qui vient de répondre)
  "Un faux « Oui »":function(se, d){ var bp = d.bPour, enB = d.ph === "b" || !!bp, cote = bp ? bp.cote : d.cote, qi = bp ? +bp.qi : d.qi;
    if(!enB && d.ph !== "reponse") return false; var x = se.presents.filter(function(e){ return SCN.cote(e.slug) === cote && (!enB || SCN.reponse(e.slug, qi)); })[0]; if(!x) return false; var Q = se.ev.questions[qi];
    return Promise.all([enB ? null : ELV.repondre(qi, Q.bonnes, x.slug), v3Set(v3Q("sessions/" + se.id + "/feuillesTest/" + x.slug), "autre chose que son clic"), enB ? ELV.direB(qi, "oui", x.slug) : null]); },
  "Rien de dit à la fin du temps":function(se, d){ var bp = d.bPour; if(d.ph !== "b" && !bp) return false; var cote = bp ? bp.cote : d.cote, qi = bp ? +bp.qi : d.qi;
    var x = se.presents.filter(function(e){ return SCN.cote(e.slug) === cote; })[0]; return x ? v3Set(v3Q("sessions/" + se.id + "/b/" + qi + "/" + x.slug), null) : false; },
  "Un lecteur qui clique « aucun » partout":function(se, d){ if(d.ph !== "lecture") return false; var x = se.presents[0].slug, v = SCN.voisinDe(x); return v ? ELV.lire(d.qi, "aucun", v) : false; },
  "Deux élèves d'accord pour mentir":function(se, d){ if(d.ph !== "lecture") return false; var x = se.presents[0].slug, v = SCN.voisinDe(x), Q = se.ev.questions[d.qi]; return v ? Promise.all([ELV.lire(d.qi, Q.bonnes, x), ELV.lire(d.qi, Q.bonnes, v)]) : false; },
  "Trouvée au dernier moment":function(se, d){ if(d.ph !== "lecture") return false; var x = se.presents.filter(function(e){ var r = SCN.reponse(e.slug, d.qi); return r && memesChoixV(r.choix, se.ev.questions[d.qi].bonnes); })[0]; if(!x) return false;
    var Q = se.ev.questions[d.qi]; return ELV.lire(d.qi, [Q.choix.map(function(c, i){ return i; }).filter(function(i){ return Q.bonnes.indexOf(i) < 0; })[0]], x.slug); },
  "Une tablette en panne":function(se, d){ var t = SCN.places()[0]; if(!t || !ACT.depart) return false; return Promise.all([t.g ? ACT.depart(t.g) : null, t.d ? ACT.depart(t.d) : null]); },
  "Un départ en cours de séance":function(se, d){ var x = se.presents[se.presents.length - 1]; return x && ACT.depart ? ACT.depart(x.slug) : false; }
};
function MessageTestV(p){
  var s = useState(null), msg = s[0], setMsg = s[1];
  return h("div", null,
    h("div", null, p.boutons.map(function(b, i){
      return h("button", surClic(function(){ var r = p.agir(b, i); return Promise.resolve(r).then(function(m){ setMsg(m === false ? "Ce cas se prépare à son moment de la séance de test : lance-la, puis avance jusqu'à lui." : typeof m === "string" ? m : b[2]); }); },
        {key:i, className:"btn btn-ghost btn-sm", style:{marginRight:".4rem", marginBottom:".4rem"}, title:b[1]}), b[0]); })),
    msg && h("div", {className:"fen-note test-msg"}, msg));
}
function eprouver(b, i){
  var se = testSession(), sid = testSid();
  if(i === 0){ if(!sid) return "Séance : pas encore lancée."; return Promise.resolve(ACT.terminer(sid)).then(function(){ return b[2]; }); }
  if(i === 1){ var ses = seancesV().filter(function(x){ return x.classeCle === CLASSE_TEST || x.classeSlug === CLASSE_TEST; }).sort(function(a, c){ return c.ms - a.ms; })[0]; if(!ses) return "Séance : pas encore lancée.";
    MODE_TEST.notes = {sid:ses.id, notes:notesTest(ses)}; var e = v3Evals()[TEST_EVAL]; if(!e) return false; var q0 = (e.questions || [])[0] || {};
    var ch = (q0.choix || []).map(function(c, j){ return j; }).filter(function(j){ return (q0.bonnes || []).indexOf(j) < 0; })[0];
    return v3Set(v3Q("evaluations/" + TEST_EVAL + "/questions/0/bonnes"), [ch == null ? 0 : ch]).then(function(){ return b[2]; }); }
  if(i === 2){ if(!MODE_TEST.notes) return "⚖️ Rien à comparer : « ✏️ Modifier l'éval après coup » d'abord."; var se2 = seanceV(MODE_TEST.notes.sid); if(!se2) return false;
    var avant = MODE_TEST.notes.notes, apres = notesTest(se2), k = Object.keys(avant), diff = k.filter(function(x){ return avant[x] !== apres[x]; });
    return diff.length ? "⚖️ " + diff.length + " note" + (diff.length > 1 ? "s ont" : " a") + " bougé : " + diff.map(function(x){ return nomEleveV(se2, x) + " " + avant[x] + " → " + apres[x]; }).join(", ") + "." : "⚖️ Les " + k.length + " notes sont identiques."; }
  if(i === 3){ var d = testDeroule(); if(!sid || !d.duree) return "⏱️ Aucun temps en cours."; return v3Set(v3Q("sessions/" + sid + "/deroule/depuis"), Date.now() - d.duree * 1000 - 500).then(function(){ return b[2]; }); }
  if(i === 4){ if(!sid) return "🔄 État relu : séance pas encore lancée."; return v3db().ref(v3Q("sessions/" + sid + "/deroule")).once("value").then(function(s){ var d = s.val() || {};
    var lib = {appel:"l'appel", entree:"l'entrée", pret:"prêts", reflexion:"réflexion", passage:"passage", reponse:"réponse", b:"« Oui / Non »", close:"question close", rouvert:"question rouverte", estim:"l'estimation", att2:"la seconde attestation", lecture:"lecture du voisin", revele:"révélée", coeval:"co-évaluation", bilan:"le bilan", fin:"terminée", pause:"pause"}[d.ph] || d.ph;
    return "🔄 État relu : " + (d.qi != null ? "question " + (d.qi + 1) + ", " : "") + lib + "."; }); }
}
function HautModeTestV(){
  var se = testSession(), sid = testSid();
  return h(F, null,
    h("div", {className:"prof-header"},
      h("h1", null, "🧪 Évaluation QCM", h("span", {className:"badge", style:{background:"var(--rose)", color:"#fff"}}, "MODE TEST")),
      h("div", {className:"row"},
        h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", title:"Télécharge l'état du mode test dans un fichier.", onClick:function(){ var S = v3Sessions(), o = {}; Object.keys(S).forEach(function(k){ if(S[k] && S[k].classeSlug === CLASSE_TEST) o[k] = S[k]; });
          telecharger("qcm-test-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify({classe:v3Classes()[CLASSE_TEST] || null, evaluation:v3Evals()[TEST_EVAL] || null, sessions:o}, null, 2)); }}, "📥 Exporter snapshot test"),
        h("button", {className:"btn btn-primary btn-sm", "data-va":"c-qr", title:"Montre le QR de ton téléphone : il pilote le mode test comme une vraie séance."}, "📱 QR pilotage"),
        h("button", surClic(function(){ return purgerModeTest().then(function(){ versScene("c-evals"); setTimeout(function(){ MODE_TEST.sortie = false; }, 1500); }); }, {className:"btn btn-rouge btn-sm", title:"Sort du mode test : la classe de test, ses séances et ses codes sont effacés ; la démo reste."}), "🗑️ Sortir et purger"))),
    h("div", {className:"test-info", style:{marginTop:".8rem"}},
      h("strong", null, "🔬 Éprouver les mécanismes livrés"),
      h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, "Ces boutons appellent les fonctions réelles de l'application, pas des copies."),
      h(MessageTestV, {boutons:BOUTONS_EPROUVER, agir:eprouver}),
      h("div", {style:{fontSize:".85rem"}}, "Séance : ", h("strong", null, sid ? "en_cours" : "pas encore lancée"), " · énoncé ", h("strong", null, se && se.S.evalSnapshot ? "conservé" : "non conservé"))),
    h("div", {className:"test-info"},
      h("strong", null, "🎬 Préparer un cas"),
      h(MessageTestV, {boutons:BOUTONS_CAS, agir:function(b){ var nom = b[0].replace(/^🎬 /, ""), s2 = testSession(); if(!s2) return false; var r = CAS_TEST[nom] ? CAS_TEST[nom](s2, deroule(s2.S) || {}) : false; return r === false ? false : Promise.resolve(r).then(function(){ return b[2]; }); }})),
    h("div", {className:"test-info"},
      h("strong", null, "🎓 Entrer comme un élève"),
      h("p", {style:{margin:".4rem 0", fontSize:".88rem"}}, "Exemple — ", h("strong", null, TEST_NOMS[0]), " · code ", h("strong", null, testCode(0))),
      h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", title:"Ouvre le vrai portail élève, sur la classe de test.", onClick:function(){ window.open(location.pathname + "#mode=eleve", "tablette-test"); }}, "👋 Ouvrir le portail élève"),
      h(CodesTest)),
    h("div", {className:"test-info"},
      h("strong", null, "Environnement de test isolé.")));
}
function CodesTest(){ var s = useState(false), o = s[0], set = s[1];
  return h("div", {style:{fontSize:".85rem", marginTop:".4rem"}}, h("div", {style:{cursor:"pointer"}, onClick:function(){ set(!o); }}, (o ? "▾" : "▸") + " Voir tous les codes du bac à sable"),
    o && h("div", {className:"codes-test"}, TEST_NOMS.map(function(n, i){ return h("div", {key:n}, n + " · " + testCode(i)); }))); }
// une tablette simulée : ses deux vraies moitiés ; ses clics passent par ELV, pour l'élève de la moitié
function contenuTablette(se, t){
  if(!se || !t) return EcrCombien();
  var d = deroule(se.S) || {};
  if(d.ph === "appel" || !d.ph) return EcrCombien();
  var g = t.g ? MOITIES.ecran(eleveDe(t.g), "g") : null, dd = t.d ? MOITIES.ecran(eleveDe(t.d), "d") : null;
  return t.d ? Tablette(g, dd) : h("div", {className:"tablette seule"}, h("div", {className:"moitie g"}, g));
}
function FeuilleTest(p){
  var se = p.se, x = p.x, v = se ? ((se.S.feuillesTest || {})[x] || "") : "";
  return h("div", {className:"simt-f"},
    h("span", {className:"simt-fl"}, "📝 Feuille " + deNom(prenomDeNom(p.nom))),
    h("input", {key:x + ":" + v, className:"simt-fi" + (v ? "" : " vide"), defaultValue:v, placeholder:"vide : sa feuille dira ce qu'" + (TEST_F[prenomDeNom(p.nom)] ? "elle" : "il") + " clique", disabled:!se,
      title:"Ce que l'élève écrit sur sa feuille, posée à côté de la tablette.", onBlur:function(e){ if(se) v3Set(v3Q("sessions/" + se.id + "/feuillesTest/" + x), e.target.value.trim() || null); }}));
}
function TablettesSimuleesV(){
  var se = testSession(), d = se ? deroule(se.S) || {} : {}, places = se && SCN.places ? SCN.places() : [];
  if(!places.length) places = TEST_PAIRES30.map(function(p, i){ return {n:i + 1, g:v3Slug(p[0]), d:v3Slug(p[1])}; });
  function nom(x){ var i = testSlugs().indexOf(x); return i >= 0 ? TEST_NOMS[i] : x; }
  return h(F, null,
    h("div", {style:{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:".5rem", marginTop:".8rem"}},
      h("h2", {className:"test-section-title", style:{margin:0}}, "👥 Tablettes simulées", InfoI("Les 15 tablettes de la classe de test, chacune la vraie tablette en deux moitiés, en petit pour regarder ; « 🔍 Jouer en grand » pour jouer.")),
      h("button", surClic(function(){ return tousRepondent(); }, {className:"btn btn-primary btn-sm"}), "🎲 Tous les élèves répondent")),
    d.ph === "reflexion" && h("div", {className:"simt-aide"}, "Pendant la réflexion, tu tapes sous chaque tablette ce que chaque élève écrit sur sa feuille. La feuille est posée à côté de la tablette, comme en classe."),
    h("div", {className:"sims"}, places.map(function(t){
      return h("div", {key:t.n, "data-sim-tab":t.n, "data-g":t.g || "", "data-d":t.d || ""},
        h("div", {className:"sim-cadre simt"},
          h("div", {className:"sim-titre simt-titre"}, h("span", null, "📱 Tablette " + t.n + " · " + nom(t.g) + (t.d ? " · " + nom(t.d) : "")),
            h("button", {className:"btn btn-ghost btn-sm simt-grand", "data-local":"1", title:"Ouvre cette tablette à la taille d'une vraie, avec ses deux feuilles dessous : en grand, on joue.", onClick:function(){ MODE_TEST.grand = t.n; v3Avertir(); }}, "🔍 Jouer en grand")),
          h("div", {className:"sim"}, h("div", {className:"sim-in"}, h(FigerZone, null, contenuTablette(se, se ? t : null)))),
          d.ph === "reflexion" && h("div", {className:"simt-feuilles"}, t.g && h(FeuilleTest, {se:se, x:t.g, nom:nom(t.g)}), t.d && h(FeuilleTest, {se:se, x:t.d, nom:nom(t.d)}))));
    })));
}
function GrandTest(){
  var se = testSession(), n = MODE_TEST.grand, t = se && SCN.places ? SCN.places().filter(function(x){ return x.n === n; })[0] : null;
  if(!t && n && TEST_PAIRES30[n - 1]) t = {n:n, g:v3Slug(TEST_PAIRES30[n - 1][0]), d:v3Slug(TEST_PAIRES30[n - 1][1])};
  if(!t) return null;
  function nom(x){ var i = testSlugs().indexOf(x); return i >= 0 ? TEST_NOMS[i] : x; }
  return h("div", {className:"grand-fond"},
    h("div", {className:"grand-boite", "data-sim-tab":t.n, "data-g":t.g || "", "data-d":t.d || ""},
      h("div", {className:"grand-h"}, h("strong", null, "📱 Tablette " + t.n + " · " + nom(t.g) + (t.d ? " · " + nom(t.d) : "")), h("span", {className:"grand-p"}, "en grand, à la taille d'une vraie tablette"),
        h("button", {className:"btn btn-rouge btn-sm", "data-local":"1", onClick:function(){ MODE_TEST.grand = null; v3Avertir(); }}, "✕ ", "Revenir aux 15 tablettes")),
      h("div", {className:"grand-tab"}, se ? contenuTablette(se, t) : h(FigerZone, null, contenuTablette(null, null))),
      h("div", {className:"simt-feuilles grand-f"}, t.g && h(FeuilleTest, {se:se, x:t.g, nom:nom(t.g)}), t.d && h(FeuilleTest, {se:se, x:t.d, nom:nom(t.d)}))));
}
function ModeTestV(){ if(!MODE_TEST.sortie) MODE_TEST.actif = true; return h(ModeTestVC); }
/* Avant l'heure, la carte de lancement du mode test (620-1) : la classe de test et sa copie de la démo, fixées (le lancement de la console
   ne propose pas les classes et évaluations « _ ») ; les binômes de la classe de test, à glisser ; « 🚀 Lancer la séance » ouvre l'appel */
function LancementTestV(){
  useV3();
  var ev = evalV(TEST_EVAL) || demoV(), cl = (typeof LIVE !== "undefined" && LIVE.d && LIVE.d.classes || {})[CLASSE_TEST];
  if(!ev || !cl) return h("div", {className:"card"}, h("p", null, "Chargement…"));
  // dans l'ordre de la liste (la classe de test n'a pas de QCM précédent)
  if(!MODE_TEST.paires) MODE_TEST.paires = TEST_PAIRES30.map(function(p){ return [v3Slug(p[0]), p[1] ? v3Slug(p[1]) : null]; });
  return h("div", {className:"card"},
    h("h2", null, "🎯 Lancer une nouvelle séance", InfoI("Ta vraie console d'avant l'heure, sur la classe de test et la démo.")),
    h("div", {className:"lancer-grid"},
      h("div", null,
        h("div", {className:"field"}, h("label", null, "Classe", InfoI("La classe de test : 30 élèves fictifs, effacés à la sortie.")), h("select", {value:"c", readOnly:true, title:"La classe de test."}, h("option", {value:"c"}, "🧪 " + CLASSE_TEST + " (" + SCN.roster(CLASSE_TEST).length + " élèves)"))),
        h("div", {className:"field"}, h("label", null, "Évaluation", InfoI("La démo par défaut, ou n'importe quelle évaluation de ta liste.")), h("select", {value:"e", readOnly:true, title:"L'évaluation jouée en test."}, h("option", {value:"e"}, ev.titre + " (" + ev.questions.length + " questions)"))),
        h("div", {className:"duree-box"}, texteDureeV(ev, false)),
        h("button", surClic(function(){ LIVE.classeSlug = CLASSE_TEST; return Promise.resolve(ACT.lancerSeance(CLASSE_TEST, TEST_EVAL, {paires:MODE_TEST.paires})).then(function(){ MODE_TEST.paires = null; }); },
          {className:"btn btn-primary", title:"Ouvre l'appel de la classe de test, puis la séance, comme en classe."}), "🚀 Lancer la séance")),
      h("div", {className:"binomes-box"},
        h("div", {className:"tt"}, "📱 Binômes proposés — dans l'ordre de la liste : la classe de test n'a pas de QCM précédent", InfoIB("📱 Binômes proposés", "Glisse un nom sur un autre pour échanger deux élèves, ou sur une moitié vide pour l'y déplacer, jusqu'au bout de l'heure.")),
        h(GrilleBinomes, {paires:MODE_TEST.paires, classe:CLASSE_TEST, surChange:function(np){ MODE_TEST.paires = np; }}))));
}
/* Le mode test reste ouvert pendant que sa séance avance : chaque geste de la console revient à « l'écran du moment » (src/live/pages.js) ;
   tant que le mode test est actif, l'écran du moment de la console est le mode test. Un onglet ouvert (Données, Réglages…) le quitte. */
setTimeout(function(){
  if(typeof PAGES === "undefined" || PAGES.__modeTest) return; PAGES.__modeTest = true; var avant = PAGES.ecran;
  PAGES.ecran = function(){
    var c = avant.apply(this, arguments);
    if(MODE_TEST.actif && typeof LIVE !== "undefined" && LIVE.appareil() === "console" && typeof NAV !== "undefined"){
      if(NAV.ecran && !/^x620-/.test(NAV.ecran) && !NAV.pile.length) quitterModeTest();
      else if(!NAV.ecran || /^x620-/.test(NAV.ecran)) return {id:"x620-1-mode-test-ouverture", vue:"console", render:function(){ return h(GardeV, {key:"mode-test"}, ModeTestV()); }, cle:"mode-test"};
    }
    return c;
  };
  if(typeof rendre === "function") rendre();
}, 0);
function ModeTestVC(){
  useV3();
  useEffect(function(){ preparerModeTest(); remettreDemo(); });
  var se = testSession(), d = se ? deroule(se.S) || {} : {};
  useEffect(function(){ if(se && d.ph && ["appel"].indexOf(d.ph) < 0) entrerTous(se); });
  if(typeof LIVE !== "undefined" && LIVE.classeSlug !== CLASSE_TEST){ if(!MODE_TEST.avant) MODE_TEST.avant = {classeSlug:LIVE.classeSlug || null, sid:LIVE.sid || null, lancement:typeof LANCEMENT !== "undefined" ? {classe:LANCEMENT.classe, evalId:LANCEMENT.evalId} : null}; LIVE.classeSlug = CLASSE_TEST; LIVE.sid = null; }
  if(typeof LANCEMENT !== "undefined" && LANCEMENT.classe !== CLASSE_TEST){ LANCEMENT.classe = CLASSE_TEST; LANCEMENT.evalId = TEST_EVAL; }
  var panneau;
  if(se && typeof EcranConsoleHeure === "function") panneau = h("div", {className:"test-console"}, EcranConsoleHeure());
  else panneau = h("div", {className:"test-console"}, h(LancementTestV));
  return h("div", {className:"prof-wrap cons mode-test"},
    DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"prof full"},
      HautModeTestV(),
      h("div", {className:"test-prof-zone"},
        h("h2", {className:"test-section-title"}, "🎯 Panneau prof", InfoI(se ? "Ta vraie console de séance, sur la classe de test." : "Le même panneau qu'en classe.")),
        panneau),
      TablettesSimuleesV()),
    MODE_TEST.grand && h(GrandTest));
}
// les clics dans une tablette simulée : ceux de l'élève de la moitié (les mêmes gestes que GESTES.eleve sur une vraie tablette)
window.addEventListener("click", function(ev){
  var el = ev.target && ev.target.closest ? ev.target.closest("[data-sim-tab] .moitie button, [data-sim-tab] .moitie .eleve-choix-btn, [data-sim-tab] .moitie .case-b, [data-sim-tab] .moitie .co-lb") : null;
  if(!el || el.disabled || typeof ELV === "undefined") return;
  var cadre = el.closest("[data-sim-tab]"), m = el.closest(".moitie"), x = cadre.getAttribute(m.classList.contains("d") ? "data-d" : "data-g"); if(!x) return;
  var d = testDeroule(), ph = d.ph, qi = d.qi, zone = m;
  function indexChoix(){ var ev2 = testSession() && testSession().ev; if(!ev2 || qi == null) return -1; var t = (el.textContent || "").replace(/\s+/g, " ").trim(); return ev2.questions[qi].choix.map(function(c){ return String(c).replace(/\s+/g, " ").trim(); }).indexOf(t); }
  if(el.classList.contains("eleve-choix-btn") && !el.closest(".fige-choix")){
    if(ph === "reponse" || ph === "rouvert"){ var r = SCN.reponse(x, qi), sel = r ? r.choix.slice() : [], i = indexChoix(); if(i >= 0){ sel = sel.indexOf(i) >= 0 ? sel.filter(function(y){ return y !== i; }) : sel.concat([i]); ELV.repondre(qi, sel, x); } }
    else if(ph === "lecture"){ var l = SCN.lecture(x, qi), cur = l && l.choix !== "aucun" ? l.choix.slice() : [];
      if(el.classList.contains("aucun")) ELV.lire(qi, l && l.choix === "aucun" ? [] : "aucun", x); else { var j = indexChoix(); if(j >= 0){ cur = cur.indexOf(j) >= 0 ? cur.filter(function(y){ return y !== j; }) : cur.concat([j]); ELV.lire(qi, cur, x); } } }
  }
  else if(el.classList.contains("decl-b-btn")) ELV.direB(qi, /^Oui/.test((el.textContent || "").trim()) ? "oui" : "non", x);
  else if(el.classList.contains("autoeval-fourchette")){ var f = /fourchette-(vert|bleu|orange|rouge)/.exec(el.className); if(f) ELV.estimer(f[1], x); }
  else if(el.classList.contains("case-b")){ var cases = Array.prototype.slice.call(zone.querySelectorAll(".case-b")); ELV.cocher(ph === "att2" ? 2 : 1, cases.indexOf(el) + 1, x); }
  else if(el.classList.contains("attest-go")) ELV.commencer(x, ph === "att2" ? 2 : 1);
  else if(el.classList.contains("co-btn")){ if(el.classList.contains("ok")) ELV.coeval("ok", null, null, x); }
  else if(el.classList.contains("co-lb")){ var tq = /Question (\d+)/.exec(el.textContent || ""); if(tq){ var cv = zone.querySelector(".co-btn.on"); ELV.coeval(cv && cv.classList.contains("peut") ? "peut" : "mal", Number(tq[1]) - 1, null, x); } }
}, true);

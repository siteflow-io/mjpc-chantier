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
      h("div", {style:{fontSize:".85rem"}}, "Session : ", h("strong", null, phase === "avant" ? "pas encore lancée" : "en_cours"), " · énoncé ", h("strong", null, "non conservé")),
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
    h("span", {className:"simt-fl"}, "📝 ", Pz("Feuille de " + pre(nom))),
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
      h("h2", null, "🎯 Lancer une nouvelle session", InfoI()),
      h("div", {className:"lancer-grid"},
        h("div", null,
          h("div", {className:"field"}, h("label", null, "Classe", InfoI()), h("select", {value:"c", readOnly:true}, h("option", {value:"c"}, "🧪 " + CLASSE_TEST + " (30 élèves)"))),
          h("div", {className:"field"}, h("label", null, "Évaluation", InfoI()), h("select", {value:"e", readOnly:true}, h("option", {value:"e"}, DEMO.titre + " (3 questions)"))),
          h("div", {className:"duree-box"}, "⏱️ ", h("strong", null, "Durée estimée : 11 min"), " — entrée 3 min, questions 4 min (deux tours par question), estimation 1 min, correction 3 min.", h("br"), "✅ Ça tient dans les 45 minutes utiles."),
          h("button", {className:"btn btn-primary"}, "🚀 Lancer la session")),
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
  return ModeTestSeance({phase:"reflexion", qi:2, chrono:18, stats:statsQ("30/30", "0/30", "—", "3/3"), passees:[], etat:etatQuestion({qi:2, reflexion:true})}, "reflexion");
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
  var fond = ModeTestSeance({phase:"reponse", qi:2, tour:1, chrono:0, stats:statsQ("30/30", "14/15", "—", "3/3"), passees:[],
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

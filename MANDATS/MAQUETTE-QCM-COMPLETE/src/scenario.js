/* ═══════════════ Le scénario, un seul (complément 3, changement 5) ═══════════════
   Tout ce que montrent les scènes se calcule d'ici, au moment de la scène : la classe, ses binômes, les réponses de chaque élève
   à chaque question et à chaque tour, ses « Oui / Non » de B, la lecture du voisin, la co-évaluation, chaque geste de Paul
   avec son heure et sa date, et le calendrier. Aucune scène n'écrit un chiffre à la main, aucune ne force un résultat.
   Le même fichier sert au banc (garde 13), qui le charge hors de la page : il n'utilise que HUB_EVALS et EV3, donnés par l'appelant. */
var SCN = (function(){
  var S = {};
  function pre(n){ return n ? n.split(" ").slice(1).join(" ") : ""; }
  function nomDe(p){ for(var i = 0; i < S.NOMS.length; i++) if(pre(S.NOMS[i]) === p) return S.NOMS[i]; return p; }
  S.pre = pre; S.nomDe = nomDe;

  /* ── La classe ── */
  S.CLASSE = "3 ESSAI"; S.NIVEAU_CLASSE = "3e";
  S.PAIRES_AVANT = [["ABRIAL Julien","DUVERNAY Michel"],["BAUDRY Léa","CARRÉ Tom"],["ESNAULT Inès","FOUCHER Hugo"],["GALLOIS Manon","HÉBRARD Nathan"],
    ["ISAMBERT Chloé","JOUBERT Louis"],["LACOMBE Emma","MAILLARD Noah"],["NOGARET Zoé","OLLIVIER Sacha"],["PERRAUD Jade","QUINTON Enzo"],
    ["RAMBAUD Lina","SABATIER Malo"],["TESSIER Anna","VALLÉE Rayan"],["WEBER Clara","BRUNEAU Camille"],["CHEVALLIER Théo","YVON Adam"],["ZELLER Lou",null]];
  // Adam absent : son binôme Théo et Lou, seule, sont mis ensemble (tablette 12)
  S.PAIRES = S.PAIRES_AVANT.slice(0, 11).concat([["CHEVALLIER Théo","ZELLER Lou"]]);
  S.NOMS = [].concat.apply([], S.PAIRES_AVANT).filter(Boolean).sort(function(a, b){ return a.localeCompare(b, "fr"); });
  S.SEXE = {"Léa":"F","Inès":"F","Manon":"F","Chloé":"F","Emma":"F","Zoé":"F","Jade":"F","Lina":"F","Anna":"F","Clara":"F","Camille":"F","Lou":"F"};
  S.voisinDe = function(p, paires){ var v = null; (paires || S.PAIRES).forEach(function(x){ if(x[0] && pre(x[0]) === p) v = x[1] && pre(x[1]); if(x[1] && pre(x[1]) === p) v = pre(x[0]); }); return v; };
  S.tabletteDe = function(p, paires){ var t = null; (paires || S.PAIRES).forEach(function(x, i){ if((x[0] && pre(x[0]) === p) || (x[1] && pre(x[1]) === p)) t = {n: i + 1, cote: x[0] && pre(x[0]) === p ? "g" : "d"}; }); return t; };

  /* ── Les évaluations : celles du hub (HUB_EVALS, tels quels), l'évaluation d'essai, la démo ── */
  S.EV_ESSAI = {id:"essai", titre:"Évaluation d'essai — 3 questions", mode:"strict", chap:"3e · Ch. 1 — Poésie et peinture au XIXe siècle", niveau:"3e", cree:"06/10/2026",
    competences:["c4-culture-01", "c4-lire-01"], questions:[
    {enonce:"Quelle est la capitale de l'Italie ?", choix:["Milan","Naples","Rome","Venise"], bonnes:[2], niveau:"facile", reflexion:20, reponse:15,
     competences:["c4-culture-01","c4-lire-01"], verifie:"nommer la capitale de l'Italie", explication:"Rome est la capitale de l'Italie depuis 1871."},
    {enonce:"Lesquelles sont des capitales européennes ?", choix:["Madrid","Genève","Berlin","Sydney"], bonnes:[0,2], niveau:"standard", reflexion:30, reponse:20,
     competences:["c4-culture-01","c4-lire-01"], verifie:"reconnaître des capitales européennes", explication:"Madrid (Espagne) et Berlin (Allemagne) sont des capitales. Genève n'est pas la capitale de la Suisse (c'est Berne), et Sydney est en Australie."},
    {enonce:"Combien de pattes a une araignée ?", choix:["6","8","10","4"], bonnes:[1], niveau:"facile", reflexion:20, reponse:15,
     competences:["c4-culture-01","c4-lire-01"], verifie:"dire combien de pattes a une araignée", explication:"Une araignée a 8 pattes : ce n'est pas un insecte (les insectes en ont 6)."}]};
  S.DEMO = {id:"demo", titre:"🎓 Démo — apprendre le déroulé", mode:"strict", demo:true, niveau:null, questions:[
    {enonce:"Quelle est la capitale de l'Italie ?", choix:["Milan","Naples","Rome","Venise"], bonnes:[2], niveau:"facile", reflexion:20, reponse:15, competences:[]},
    {enonce:"Lesquelles sont des capitales européennes ?", choix:["Madrid","Genève","Berlin","Sydney"], bonnes:[0,2], niveau:"standard", reflexion:30, reponse:20, competences:[]},
    {enonce:"Pourquoi l'araignée n'est-elle pas un insecte ?", choix:["Parce qu'elle a six pattes","Parce qu'elle a huit pattes","Parce qu'elle tisse une toile","Parce qu'elle est trop grande"], bonnes:[1], niveau:"standard", reflexion:30, reponse:20, competences:[]}]};
  // les évaluations du hub, lues le 08/10 (src/donnees/evaluations_hub.json) : sans chapitre, donc « Sans chapitre », à compléter
  var CREE = {eval_1791393134857:"07/10/2026", eval_1791380799497:"07/10/2026", eval_1785934338415:"05/08/2026", eval_1781760503989:"18/06/2026",
    eval_1781670681003:"17/06/2026", eval_1779946950077:"28/05/2026", eval_1778247436064:"08/05/2026"};
  S.evals = function(){
    var l = [S.EV_ESSAI];
    Object.keys(HUB_EVALS).sort(function(a, b){ return HUB_EVALS[b].createdAt - HUB_EVALS[a].createdAt; }).forEach(function(k){
      var e = HUB_EVALS[k];
      l.push({id:k, titre:e.titre, mode:null, chap:null, niveau:null, cree:CREE[k], competences:[], questions:e.questions.map(function(q){ return Object.assign({reflexion:null, reponse:null, competences:[]}, q); })});
    });
    return l;
  };
  S.evalParId = function(id){ if(id === "demo") return S.DEMO; return S.evals().filter(function(e){ return e.id === id; })[0] || null; };
  S.ID_CH1 = "eval_1785934338415"; S.ID_JB = "eval_1778247436064"; S.ID_3E = "eval_1791393134857";

  /* ── La séance du 08/10 : ce que chacun a cliqué, écrit, dit, lu ── */
  // sur la tablette : J juste, F faux (aucune bonne), Y toutes les bonnes et une en trop, O une bonne sur deux
  S.RT = {Julien:"JJF", Michel:"FYF", "Léa":"JJJ", Tom:"FOJ", "Inès":"JJJ", Hugo:"JYJ", Manon:"JJF", Nathan:"JOJ", "Chloé":"JJJ", Louis:"JOJ", Emma:"JJJ", Noah:"JFF",
    "Zoé":"JJJ", Sacha:"FOF", Jade:"JYJ", Enzo:"JOF", Lina:"JJJ", Malo:"JFJ", Anna:"JOF", Rayan:"JYF", Clara:"JJJ", Camille:"JOF", "Théo":"JOJ", Lou:"JYF"};
  // la feuille, lue par le voisin à la correction : J juste, F faux, A « aucun de ces choix »
  S.LU = {Julien:"JFF", Michel:"FFA", "Léa":"JJJ", Tom:"FFJ", "Inès":"JJJ", Hugo:"JFJ", Manon:"JJF", Nathan:"JFJ", "Chloé":"JJJ", Louis:"JFJ", Emma:"JJJ", Noah:"JFF",
    "Zoé":"JFJ", Sacha:"FFF", Jade:"JFJ", Enzo:"AFF", Lina:"JJJ", Malo:"JFJ", Anna:"JFF", Rayan:"JFF", Clara:"JJJ", Camille:"JJF", "Théo":"JFF", Lou:"JFJ"};
  // le binôme suivi, en détail : l'ordre des choix de chacun, ses clics, sa feuille, la lecture de son voisin, son B
  S.ORD = [{J:[0,1,2,3], M:[3,2,0,1]}, {M:[0,1,2,3], J:[1,0,3,2]}, {J:[0,1,2,3], M:[3,2,1,0]}];
  S.PREMIER = ["J","M","J"];                                       // qui commence : les moitiés de gauche (J) ou de droite (M)
  S.TABL = {J:[[2],[0,2],[0]], M:[[3],[0,1,2],[2]]};
  S.FEUI = {J:[[2],[0],[0]], M:[[2],[0,1,2],"aucun"]};
  S.LU_JM = {J:[[2],[0],[0]], M:[[3],[0,1,2],"aucun"]};             // ce que le voisin a lu : Julien a lu Venise sur la feuille de Michel
  S.DIT_B = {J:["oui","non","oui"], M:["non","oui","non"]};
  S.ORDRE_CORR = [1, 2, 0];                                         // de la plus ratée à la mieux réussie, sur les tablettes
  // l'estimation de chacun (444) ; Jade et Enzo ne l'ont pas faite
  S.ESTIM = {Julien:"bleu", Michel:"vert", "Léa":"vert", Tom:"orange", "Inès":"vert", Hugo:"bleu", Manon:"vert", Nathan:"bleu", "Chloé":"bleu", Louis:"bleu", Emma:"vert", Noah:"orange",
    "Zoé":"bleu", Sacha:"orange", Lina:"vert", Malo:"orange", Anna:"rouge", Rayan:"bleu", Clara:"vert", Camille:"bleu", "Théo":"bleu", Lou:"bleu"};
  // les lignes « à lire sur la feuille » : B contre la lecture, « aucun de ces choix », rien de dit (497, 530)
  S.A_LIRE = [
    {p:"Michel", q:0, txt:"a dit que sa feuille ne disait pas son clic, Venise ; Julien y a lu Venise", sorte:"b"},
    {p:"Tom", q:0, txt:"n'a pas dit si sa feuille disait son clic", sorte:"b"},
    {p:"Enzo", q:0, txt:"aucun de ces choix", sorte:"aucun"},
    {p:"Anna", q:1, txt:"a dit que sa feuille disait son clic, Madrid ; Rayan y a lu Madrid et Genève", sorte:"b"},
    {p:"Michel", q:2, txt:"aucun de ces choix", sorte:"aucun"},
    {p:"Lou", q:2, txt:"a dit que sa feuille disait son clic, 6 ; Théo y a lu 8", sorte:"b"}];
  // la co-évaluation : chacun dit si son voisin a bien lu sa feuille ; « att » : pas encore répondu à l'alerte
  S.CO = {Julien:"ok", Michel:"mal1", "Léa":"ok", Tom:"att", "Inès":"ok", Hugo:"ok", Manon:"ok", Nathan:"ok", "Chloé":"ok", Louis:"ok", Emma:"ok", Noah:"peut3",
    "Zoé":"ok", Sacha:"att", Jade:"peut2", Enzo:"ok", Lina:"ok", Malo:"ok", Anna:"ok", Rayan:"att", Clara:"ok", Camille:"ok", "Théo":"ok", Lou:"att"};
  S.CO_LIRE = [{p:"Jade", q:1, txt:"🤔 pense qu'Enzo a peut-être mal lu sa feuille", sorte:"co"}, {p:"Noah", q:2, txt:"🤔 pense qu'Emma a peut-être mal lu sa feuille", sorte:"co"}];
  // ce que dit vraiment la feuille, lue le soir : Lou avait écrit 6 à la question 3
  S.FEUILLE_SOIR = {Lou:{2:"F"}};

  // l'heure à laquelle chacun a fini de cocher son attestation : la première pendant l'entrée (10:03 à 10:07), la seconde avant la correction (10:20 ou 10:21)
  S.heureAttest = function(p, n){ return n === 2 ? "10:2" + (p.length % 2) : "10:0" + ((p === "Julien" || p === "Michel") ? 4 : p.length % 5 + 3); };

  // ce que dit vraiment la feuille de chacun : la lecture du voisin, sauf où elle s'est trompée (Michel, question 1 : Rome ; Lou, question 3 : 6)
  S.feuilleVraie = function(p){ var f = S.LU[p].split(""); if(p === "Michel") f[0] = "J"; if(p === "Lou") f[2] = "F"; return f.join(""); };
  // ce que chacun a dit à la fin de son temps (B) : « Oui » si sa feuille dit son clic, « Non » sinon ; sauf les faits relevés (497, 530)
  S.DIT_EXCEPTIONS = {"Michel:0":"non", "Tom:0":"rien", "Anna:1":"oui", "Lou:2":"oui"};
  S.ditB = function(p, q){
    if(p === "Julien" || p === "Michel") return S.DIT_B[p === "Julien" ? "J" : "M"][q];
    var x = S.DIT_EXCEPTIONS[p + ":" + q]; if(x) return x;
    var f = S.feuilleVraie(p)[q], t = S.RT[p][q];
    return f === t ? "oui" : "non";
  };
  // les choix d'un code (J juste, F faux, Y toutes les bonnes et une en trop, O une bonne sur deux, A aucun) sur une question
  S.choixDe = function(code, q, ev){
    var Q = (ev || S.EV_ESSAI).questions[q], faux = [0, 1, 2, 3].filter(function(i){ return Q.bonnes.indexOf(i) < 0; });
    if(code === "J") return Q.bonnes.slice(); if(code === "Y") return Q.bonnes.concat([faux[0]]).sort(); if(code === "O") return [Q.bonnes[0]];
    if(code === "A") return "aucun"; return [faux[faux.length - 1]];
  };

  /* ── Le calendrier ── */
  S.SEANCES = [
    {id:"JB", eval:S.ID_JB, classe:"3 ESSAI", date:"15/09/2026", heure:"10:03", mode:"tablettes", absents:[], fin:"15/09/2026 10:58", rendues:"17/09/2026 18:05", aLire:0},
    {id:"CH1", eval:S.ID_CH1, classe:"3 ESSAI", date:"24/09/2026", heure:"10:04", mode:"tablettes", absents:["ZELLER Lou", "YVON Adam"], fin:"24/09/2026 10:59", rendues:"26/09/2026 17:40", aLire:2},
    {id:"DEMO", eval:"demo", classe:"3 ESSAI", date:"07/10/2026", heure:"10:02", mode:"tablettes", absents:["YVON Adam"], fin:"07/10/2026 10:41", demo:true},
    {id:"S08", eval:"essai", classe:"3 ESSAI", date:"08/10/2026", heure:"10:02", mode:"tablettes", absents:["YVON Adam"], fin:"08/10/2026 10:30", rendues:"10/10/2026 19:22"},
    {id:"PAP", eval:"essai", classe:"3 ESSAI", date:"09/10/2026", heure:"10:02", mode:"papier", absents:["YVON Adam"], fin:"10/10/2026 10:22", reprise:"10/10/2026 10:02"},
    {id:"S3E", eval:S.ID_3E, classe:"3 ESSAI", date:"09/10/2026", heure:"15:07", mode:"tablettes", absents:["YVON Adam"], fin:"09/10/2026 15:58", rendues:"10/10/2026 19:18", aLire:5},
    {id:"RATT", eval:"essai", classe:"3 ESSAI", date:"12/10/2026", heure:"10:02", mode:"tablettes", eleves:["YVON Adam"], rattrapage:true}
  ];
  S.seance = function(id){ return S.SEANCES.filter(function(x){ return x.id === id; })[0]; };
  // la corbeille, avant tout geste : un brouillon d'évaluation
  S.CORBEILLE = [{sorte:"Évaluation", titre:"Brouillon — Les figures de style (6 questions)", quand:"05/10/2026 21:12"}];

  /* ── Les moments : chaque scène en a un ; les branches gardent leur racine ── */
  // t : la date et l'heure ; ph : la phase ; qi, tour, reste (secondes du temps en cours)
  var M = {};
  function mom(k, seance, date, heure, o){ M[k] = Object.assign({k:k, seance:seance, date:date, heure:heure}, o || {}); }
  mom("PREP", null, "07/10/2026", "20:30", {ph:"hors", etape:"préparation"});
  mom("DEMO:avant", "DEMO", "07/10/2026", "10:01", {ph:"avant", etape:"avant l'heure"});
  mom("DEMO:Q1:R", "DEMO", "07/10/2026", "10:08", {ph:"reflexion", qi:0, reste:18, etape:"Q1 · réflexion"});
  mom("S08:avant", "S08", "08/10/2026", "10:01", {ph:"avant", etape:"avant l'heure"});
  mom("S08:appel", "S08", "08/10/2026", "10:02", {ph:"appel", etape:"l'appel"});
  mom("S08:entree", "S08", "08/10/2026", "10:03", {ph:"entree", etape:"l'entrée"});
  mom("S08:pret", "S08", "08/10/2026", "10:13", {ph:"pret", pasEntres:["Lou"], attestEnCours:{Enzo:5}, etape:"avant la question 1"});
  // les questions : Q1 commence à 10:13:34 ; les temps suivent ceux de l'évaluation et des réglages
  mom("S08:Q1:R", "S08", "08/10/2026", "10:13:40", {ph:"reflexion", qi:0, reste:14, etape:"Q1 · réflexion"});
  mom("S08:Q1:P1", "S08", "08/10/2026", "10:13:55", {ph:"passage", qi:0, tour:1, reste:3, etape:"Q1 · passage au 1er tour"});
  mom("S08:Q1:T1", "S08", "08/10/2026", "10:14:03", {ph:"reponse", qi:0, tour:1, reste:9, nonRep:["Jade", "Anna"], etape:"Q1 · 1er tour"});
  mom("S08:Q1:P2", "S08", "08/10/2026", "10:14:18", {ph:"passage", qi:0, tour:2, reste:2, etape:"Q1 · passage au 2e tour"});
  mom("S08:Q1:T2", "S08", "08/10/2026", "10:14:29", {ph:"reponse", qi:0, tour:2, reste:6, nonRep:["Lou"], etape:"Q1 · 2e tour"});
  mom("S08:Q1:B2", "S08", "08/10/2026", "10:14:36", {ph:"b", qi:0, tour:2, reste:4, etape:"Q1 · 2e tour, B"});
  mom("S08:Q1:C", "S08", "08/10/2026", "10:14:45", {ph:"close", qi:0, etape:"Q1 · close"});
  mom("S08:Q2:R", "S08", "08/10/2026", "10:15:03", {ph:"reflexion", qi:1, reste:22, etape:"Q2 · réflexion"});
  mom("S08:Q2:T1", "S08", "08/10/2026", "10:15:36", {ph:"reponse", qi:1, tour:1, reste:12, nonRep:["Michel"], etape:"Q2 · 1er tour"});
  mom("S08:Q2:T2", "S08", "08/10/2026", "10:16:12", {ph:"reponse", qi:1, tour:2, reste:4, nonRep:["Théo"], etape:"Q2 · 2e tour"});
  mom("S08:Q2:C", "S08", "08/10/2026", "10:16:30", {ph:"close", qi:1, sansRep:["Théo"], etape:"Q2 · close"});
  mom("S08:Q2:R1", "S08", "08/10/2026", "10:16:50", {ph:"rouvert", qi:1, tour:1, reste:14, pour:"Théo", etape:"Q2 · rouverte pour Théo"});
  mom("S08:Q3:T1", "S08", "08/10/2026", "10:17:50", {ph:"reponse", qi:2, tour:1, reste:8, nonRep:[], etape:"Q3 · 1er tour"});
  mom("S08:Q3:B1", "S08", "08/10/2026", "10:18:00", {ph:"b", qi:2, tour:1, reste:3, etape:"Q3 · 1er tour, B"});
  mom("S08:Q3:T2", "S08", "08/10/2026", "10:18:16", {ph:"reponse", qi:2, tour:2, reste:5, nonRep:[], etape:"Q3 · 2e tour"});
  mom("S08:Q3:B2", "S08", "08/10/2026", "10:18:24", {ph:"b", qi:2, tour:2, reste:3, etape:"Q3 · 2e tour, B"});
  mom("S08:Q3:C", "S08", "08/10/2026", "10:18:30", {ph:"close", qi:2, etape:"Q3 · close"});
  mom("S08:estim", "S08", "08/10/2026", "10:19:10", {ph:"estim", pasEstime:["Jade", "Enzo"], etape:"l'estimation"});
  mom("S08:att2:0", "S08", "08/10/2026", "10:20:30", {ph:"att2", enCours:(function(){ var o = {}; [].concat.apply([], S.PAIRES).filter(Boolean).forEach(function(n){ o[pre(n)] = n === "DUVERNAY Michel" ? 0 : 1; }); return o; })(), etape:"la seconde attestation, au début"});
  mom("S08:att2", "S08", "08/10/2026", "10:21", {ph:"att2", enCours:{Michel:4, Tom:3, Sacha:4, Lou:2, "Théo":4}, etape:"la seconde attestation"});
  mom("S08:corr:Q2:L", "S08", "08/10/2026", "10:22:13", {ph:"lecture", qi:1, reste:7, pasLu:["Michel", "Tom", "Hugo", "Sacha", "Rayan", "Théo"], etape:"correction · Q2 · lecture"});
  mom("S08:corr:Q2:LU", "S08", "08/10/2026", "10:22:17", {ph:"lecture", qi:1, reste:3, pasLu:[], etape:"correction · Q2 · tout lu"});
  mom("S08:corr:Q2:V", "S08", "08/10/2026", "10:22:30", {ph:"revele", qi:1, etape:"correction · Q2 · révélée"});
  mom("S08:corr:Q2:V+", "S08", "08/10/2026", "10:23", {ph:"revele", qi:1, etape:"correction · Q2 · révélée, point de Hugo retiré"});
  mom("S08:corr:Q3:L", "S08", "08/10/2026", "10:23:30", {ph:"lecture", qi:2, reste:11, pasLu:[], etape:"correction · Q3 · lecture"});
  mom("S08:corr:Q3:V", "S08", "08/10/2026", "10:23:45", {ph:"revele", qi:2, etape:"correction · Q3 · révélée"});
  mom("S08:corr:Q1:L", "S08", "08/10/2026", "10:24:30", {ph:"lecture", qi:0, reste:6, pasLu:[], etape:"correction · Q1 · lecture"});
  mom("S08:corr:Q1:V", "S08", "08/10/2026", "10:24:45", {ph:"revele", qi:0, etape:"correction · Q1 · révélée"});
  mom("S08:coeval", "S08", "08/10/2026", "10:26", {ph:"coeval", etape:"co-évaluation"});
  mom("S08:coeval:T", "S08", "08/10/2026", "10:27:30", {ph:"coeval", tranche:"michel", etape:"co-évaluation · alerte tranchée"});
  mom("S08:bilan", "S08", "08/10/2026", "10:28", {ph:"bilan", etape:"le bilan"});
  mom("S08:fin", "S08", "08/10/2026", "10:30", {ph:"fin", etape:"terminée"});
  // le soir du 10/10 : Résultats, la fiche, les feuilles, les copies
  mom("SOIR", "S08", "10/10/2026", "18:30", {ph:"soir", etape:"le soir, avant les feuilles"});
  mom("SOIR:michel", "S08", "10/10/2026", "19:12", {ph:"soir", retireSoir:true, etape:"le soir, point de Michel retiré"});
  mom("SOIR:lu", "S08", "10/10/2026", "19:20", {ph:"soir", retireSoir:true, lu:true, etape:"le soir, feuilles lues"});
  mom("SOIR:rendu", "S08", "10/10/2026", "19:22", {ph:"soir", retireSoir:true, lu:true, rendu:true, etape:"le soir, copies rendues"});
  // l'autre séance du soir : la 3e (copies rendues le 10/10), le papier, le rattrapage, le mode test
  mom("S3E:Q3:B1", "S3E", "09/10/2026", "15:21", {ph:"b", qi:2, tour:1, etape:"Q3 · 1er tour, B"});
  mom("S3E:Q3:B2", "S3E", "09/10/2026", "15:22", {ph:"b", qi:2, tour:2, etape:"Q3 · 2e tour, B"});
  mom("S3E:corr:Q3:L", "S3E", "09/10/2026", "15:40", {ph:"lecture", qi:2, etape:"correction · Q3 · lecture"});
  mom("S3E:coeval", "S3E", "09/10/2026", "15:52", {ph:"coeval", etape:"co-évaluation"});
  mom("S3E:coeval:T", "S3E", "09/10/2026", "15:56", {ph:"coeval", tranche:"feuille", auxDeux:true, etape:"co-évaluation · alerte tranchée"});
  mom("S3E:rendu", "S3E", "10/10/2026", "19:18", {ph:"soir", rendu:true, etape:"le soir, copies rendues"});
  mom("PAP:avant", "PAP", "09/10/2026", "10:01", {ph:"avant", etape:"avant l'heure"});
  mom("PAP:seance", "PAP", "09/10/2026", "10:05", {ph:"papier", etape:"sur papier, en cours"});
  mom("PAP:grille", "PAP", "09/10/2026", "20:00", {ph:"grille", etape:"le soir, la grille"});
  mom("PAP:reprise", "PAP", "10/10/2026", "10:01", {ph:"avant", reprise:true, etape:"l'heure suivante, avant la reprise"});
  mom("PAP:estim", "PAP", "10/10/2026", "10:05", {ph:"estim", etape:"l'estimation"});
  mom("PAP:att2", "PAP", "10/10/2026", "10:07", {ph:"att2", etape:"la seconde attestation"});
  mom("PAP:corr:Q2", "PAP", "10/10/2026", "10:09", {ph:"revele", qi:1, etape:"correction · Q2"});
  mom("RATT:avant", "RATT", "12/10/2026", "10:01", {ph:"avant", etape:"avant l'heure"});
  mom("RATT:corr:Q2:L", "RATT", "12/10/2026", "10:12", {ph:"lecture", qi:1, reste:12, etape:"correction · Q2 · lecture"});
  mom("TEST:avant", "TEST", "10/10/2026", "17:00", {ph:"avant", etape:"avant l'heure"});
  mom("TEST:Q3:R", "TEST", "10/10/2026", "17:10", {ph:"reflexion", qi:2, reste:18, etape:"Q3 · réflexion"});
  mom("TEST:Q3:B1", "TEST", "10/10/2026", "17:11", {ph:"b", qi:2, tour:1, reste:3, etape:"Q3 · 1er tour, B"});
  // les branches de la séance du 08/10
  mom("S08:Q1:C/ecart3", "S08", "08/10/2026", "10:14:50", {ph:"close", qi:0, ecartees:[2], branche:"écarter Q3", etape:"Q1 · close, Q3 écartée"});
  mom("S08:Q2:R/ecart3", "S08", "08/10/2026", "10:15:03", {ph:"reflexion", qi:1, reste:22, ecartees:[2], branche:"écarter Q3", etape:"Q2 · réflexion, Q3 écartée"});
  mom("S08:Q2:C/annul2", "S08", "08/10/2026", "10:16:40", {ph:"close", qi:1, sansRep:["Théo"], annulees:[1], branche:"annuler Q2", etape:"Q2 · close, Q2 annulée"});
  mom("S08:bilan/annul2", "S08", "08/10/2026", "10:28", {ph:"bilan", annulees:[1], branche:"annuler Q2", etape:"le bilan, Q2 annulée"});
  mom("S08:Q1:T1/temps", "S08", "08/10/2026", "10:14:03", {ph:"reponse", qi:0, tour:1, reste:9, nonRep:["Jade", "Anna"], temps:{1:{reflexion:1800}, 2:{reflexion:420}}, branche:"du temps ajouté", etape:"Q1 · 1er tour, du temps ajouté"});
  mom("S08:Q1:T1/depart", "S08", "08/10/2026", "10:14:03", {ph:"reponse", qi:0, tour:1, reste:9, nonRep:["Jade", "Anna"], partis:{Noah:"10:14"}, branche:"départ de Noah", etape:"Q1 · 1er tour, Noah parti"});
  mom("S08:Q1:C/deplace", "S08", "08/10/2026", "10:14:50", {ph:"close", qi:0, deplaces:["Julien", "Théo"], branche:"Julien et Théo échangés", etape:"Q1 · close, deux élèves échangés"});
  mom("S08:coeval/michel", "S08", "08/10/2026", "10:26:30", {ph:"coeval", retires:["Michel"], branche:"⛔ à Michel", etape:"co-évaluation, point de Michel retiré"});
  mom("S08:coeval/julien", "S08", "08/10/2026", "10:26:30", {ph:"coeval", retires:["Julien"], branche:"⛔ à Julien", etape:"co-évaluation, point de Julien retiré"});
  mom("S08:coeval/deux", "S08", "08/10/2026", "10:26:30", {ph:"coeval", retires:["Michel", "Julien"], branche:"⛔ aux deux", etape:"co-évaluation, points retirés aux deux"});
  mom("S08:bilan/deux", "S08", "08/10/2026", "10:28", {ph:"bilan", retires:["Michel", "Julien"], branche:"⛔ aux deux", etape:"le bilan, points retirés aux deux"});
  mom("S08:finir", "S08", "09/10/2026", "10:01", {ph:"avant", pause:{qi:0, tour:1}, branche:"finir à une autre heure", etape:"l'heure suivante, la séance en pause"});
  mom("S08:panne", "S08", "08/10/2026", "10:16:40", {ph:"panne", qi:1, tour:2, deconnexion:"10:16", branche:"la console perdue", etape:"Q2 · 2e tour, la console perdue"});
  S.MOMENTS = M;
  S.moment = function(k){ return M[k] || null; };

  /* ── Les moments des scènes ── */
  S.MOMENT_DE = {
    "c-evals":"PREP", "c-eval-corbeille":"PREP", "c-collage":"PREP", "x627-3-editeur":"PREP", "c-feuille":"PREP",
    "c-accueil":"S08:avant", "c-lancer":"S08:avant", "c-echange-refuse":"S08:avant", "c-appel":"S08:appel", "c-demo-lancer":"DEMO:avant", "c-demo-faite":"S08:avant",
    "t-combien":"S08:entree", "t-un-eleve":"S08:entree", "t-login":"S08:entree", "t-login-inconnu":"S08:entree", "t-binome":"S08:entree", "t-rejoins":"S08:entree",
    "t-attest-1":"S08:entree", "t-attest-2":"S08:entree", "t-pret":"S08:pret", "c-pret":"S08:pret", "t-demo-q":"DEMO:Q1:R",
    "t-q1-reflexion":"S08:Q1:R", "c-q1-reflexion":"S08:Q1:R", "t-q1-passage1":"S08:Q1:P1", "t-q1-tour1":"S08:Q1:T1", "c-q1-tour1":"S08:Q1:T1", "c-voir-tablette":"S08:Q1:T1",
    "p-reponse":"S08:Q1:T1", "c-qr":"S08:Q1:T1", "b-reponse":"S08:Q1:T1", "c-fin-prevue":"S08:Q1:T1/temps", "t-q1-passage2":"S08:Q1:P2", "t-q1-tour2":"S08:Q1:T2",
    "t-q1-b-michel":"S08:Q1:B2", "c-q1-tour2":"S08:Q1:T2", "t-q1-attente":"S08:Q1:C", "c-q1-close":"S08:Q1:C", "c-ecarter":"S08:Q1:C", "c-ecartee":"S08:Q1:C/ecart3",
    "t-q2-ecartee":"S08:Q2:R/ecart3", "t-q2-reflexion":"S08:Q2:R", "t-q2-tour1":"S08:Q2:T1", "t-q2-tour2":"S08:Q2:T2", "c-q2-tour2":"S08:Q2:T2", "c-q2-close":"S08:Q2:C",
    "c-annuler":"S08:Q2:C", "c-annulee":"S08:Q2:C/annul2", "c-rouvrir-tous":"S08:Q2:C", "c-rouvrir-un":"S08:Q2:C", "t-rouvrir-un":"S08:Q2:R1", "p-eleve":"S08:Q2:C",
    "t-q3-tour1":"S08:Q3:T1", "x610-1-b-julien":"S3E:Q3:B1", "t-q3-tour2":"S08:Q3:T2", "x610-2-b-michel":"S3E:Q3:B2", "c-q3-close":"S08:Q3:C",
    "c-depart":"S08:Q1:T1", "c-parti":"S08:Q1:T1/depart", "c-retour":"S08:Q1:T1/depart", "c-deplacer":"S08:Q1:C/deplace", "t-deplace":"S08:Q1:C/deplace", "c-terminer":"S08:Q1:T1",
    "c-mode-emploi":"S08:avant", "c-finir-autre-heure":"S08:Q1:T1", "c-reprendre":"S08:finir", "c-rouvrir-seance":"S08:avant", "c-sessions":"S08:Q1:T1", "c-interrompue":"S08:panne",
    "t-estim":"S08:estim", "c-estim":"S08:estim", "x610-5-attestation-2":"S08:att2:0", "t-attest-corr-fait":"S08:att2", "c-attest2":"S08:att2",
    "t-corr-q2-lecture":"S08:corr:Q2:L", "c-corr-q2-avant":"S08:corr:Q2:L", "p-corr-avant":"S08:corr:Q2:L", "b-recopie":"S08:corr:Q2:L", "c-corr-q2-lu":"S08:corr:Q2:LU",
    "c-corr-q2-apres":"S08:corr:Q2:V", "p-corr-apres":"S08:corr:Q2:V", "b-correction":"S08:corr:Q2:V", "t-corr-q2-apres":"S08:corr:Q2:V", "t-corr-q3-lecture":"S08:corr:Q3:L",
    "c-corr-q3-apres":"S08:corr:Q3:V", "t-corr-q3-apres":"S08:corr:Q3:V", "t-corr-q1-lecture":"S08:corr:Q1:L", "t-corr-q1-apres":"S08:corr:Q1:V", "c-corr-q1-apres":"S08:corr:Q1:V",
    "x610-3-a-correction":"S3E:corr:Q3:L", "t-corr-seul":"RATT:corr:Q2:L",
    "c-autonomie":"S08:corr:Q2:V", "c-autonomie-garde":"S08:corr:Q2:V", "c-autonomie-retiree":"S08:corr:Q2:V+", "p-autonomie":"S08:corr:Q2:V",
    "t-coeval":"S08:coeval", "t-coeval-ecrit":"S08:coeval", "t-coeval-daccord":"S08:coeval", "c-coeval-attente":"S08:coeval", "c-coeval-feuille":"S08:coeval",
    "c-autonomie-michel":"S08:coeval", "c-autonomie-julien":"S08:coeval", "c-autonomie-deux":"S08:coeval", "c-coeval-retire-michel":"S08:coeval/michel",
    "c-coeval-retire-julien":"S08:coeval/julien", "c-coeval-retire-deux":"S08:coeval/deux", "c-coeval-tranche":"S08:coeval:T",
    "x610-6-coeval-laquelle":"S3E:coeval", "x610-7-coeval-ecrit":"S3E:coeval", "x610-8-console-alerte":"S3E:coeval", "x610-feuille":"S3E:coeval",
    "x610-autonomie-michel":"S3E:coeval", "x610-autonomie-julien":"S3E:coeval", "x610-autonomie-deux":"S3E:coeval", "x610-tranche":"S3E:coeval:T", "x610-9-telephone-alerte":"S3E:coeval",
    "t-bilan":"S08:bilan", "t-bilan-imprime":"S08:bilan", "t-bilan-annulee":"S08:bilan/annul2", "t-bilan-non-atteinte":"S08:bilan/deux", "c-bilan":"S08:bilan", "t-fin":"S08:fin",
    "c-papier-lancer":"PAP:avant", "c-papier-seance":"PAP:seance", "e-papier-enonces":"PAP:seance", "c-papier-grille":"PAP:grille", "c-papier-reprendre":"PAP:reprise",
    "t-papier-estim":"PAP:estim", "t-papier-attest":"PAP:att2", "c-papier-correction":"PAP:corr:Q2", "t-papier-correction":"PAP:corr:Q2",
    "c-seances":"SOIR", "c-resultats":"SOIR", "c-fiche":"SOIR", "c-fiche-garde":"SOIR", "c-fiche-retire":"SOIR:michel", "c-que-dit-la-feuille":"SOIR:michel",
    "c-seances-lues":"SOIR:lu", "c-rendre":"SOIR:lu", "c-copies-rendues":"SOIR:rendu", "c-resultats-rendues":"SOIR:rendu", "x632-pdf":"S3E:rendu", "c-corbeille":"SOIR:rendu",
    "c-sauvegarde":"SOIR:rendu", "c-importer":"SOIR:rendu", "c-purger":"SOIR:rendu", "e-mes-evals":"SOIR", "e-mes-evals-rendue":"SOIR:rendu", "e-bilan-lou":"SOIR:rendu",
    "c-reglages":"PREP", "c-reglages-prompt":"PREP", "c-reglages-prompt-modifier":"PREP",
    "m-classe-exclusions":"PREP", "m-exclusion-refusee":"PREP", "m-fiche-eleve":"PREP", "m-taxonomie":"PREP", "m-taxonomie-editeur":"PREP", "m-taxonomie-domaine":"PREP",
    "m-taxonomie-notion":"PREP", "m-taxonomie-competences":"PREP", "m-taxonomie-competence":"PREP", "m-emploi-du-temps":"PREP", "m-emploi-du-temps-un":"PREP", "m-emploi-du-temps-tous":"PREP",
    "c-rattrapage":"RATT:avant", "x620-1-mode-test-ouverture":"TEST:avant", "x620-2-mode-test-reflexion":"TEST:Q3:R", "x620-3-mode-test-en-grand":"TEST:Q3:B1", "t-annexe":"S3E:Q3:B1"
  };
  // l'appareil de chaque scène : sa vue, sauf MJPC et le mode test, qui sont les leurs
  S.appareilDe = function(id, vue){ return /^m-/.test(id) ? "mjpc" : /^x620/.test(id) ? "test" : vue; };

  /* ── L'ordre des moments d'une séance, pour savoir ce qui est déjà arrivé ── */
  var ORDRE_S08 = ["S08:avant", "S08:appel", "S08:entree", "S08:pret", "S08:Q1:R", "S08:Q1:P1", "S08:Q1:T1", "S08:Q1:P2", "S08:Q1:T2", "S08:Q1:B2", "S08:Q1:C",
    "S08:Q2:R", "S08:Q2:T1", "S08:Q2:T2", "S08:Q2:C", "S08:Q2:R1", "S08:Q3:T1", "S08:Q3:B1", "S08:Q3:T2", "S08:Q3:B2", "S08:Q3:C", "S08:estim", "S08:att2:0", "S08:att2",
    "S08:corr:Q2:L", "S08:corr:Q2:LU", "S08:corr:Q2:V", "S08:corr:Q2:V+", "S08:corr:Q3:L", "S08:corr:Q3:V", "S08:corr:Q1:L", "S08:corr:Q1:V",
    "S08:coeval", "S08:coeval:T", "S08:bilan", "S08:fin", "SOIR", "SOIR:michel", "SOIR:lu", "SOIR:rendu"];
  function racine(k){ var m = M[k]; if(!m) return k; var r = k.split("/")[0]; return r; }
  S.rang = function(k){ return ORDRE_S08.indexOf(racine(k)); };
  S.apres = function(k, repere){ var a = S.rang(k), b = S.rang(repere); return a >= 0 && b >= 0 && a >= b; };
  S.ORDRE_S08 = ORDRE_S08;

  /* ── Les notes : la règle (288 à 293, 303, 332), à un moment donné ── */
  var IDX = ["rouge","orange","bleu","vert"];
  S.maitriseDe = function(sur20){ return sur20 >= 15 ? "vert" : sur20 >= 10 ? "bleu" : sur20 >= 5 ? "orange" : "rouge"; };
  S.LIB_MAITRISE = {vert:"Très bonne maîtrise", bleu:"Maîtrise satisfaisante", orange:"Maîtrise fragile", rouge:"Maîtrise insuffisante"};
  S.EM_MAITRISE = {vert:"🟢", bleu:"🔵", orange:"🟠", rouge:"🔴"};
  // ce que la lecture du voisin donne pour p, question qi, au moment k (avant la correction de la question : rien)
  function lectureAu(p, qi, k){
    var m = M[k] || {};
    var lu = S.LU[p][qi];
    // Michel, question 1 : Julien a lu Venise ; l'alerte tranchée en faveur de Michel (538) la passe à Rome
    if(p === "Michel" && qi === 0 && (m.tranche === "michel" || S.apres(k, "S08:coeval:T"))) lu = "J";
    // Lou, question 3 : Théo a lu 8 ; sa feuille, lue le soir, dit 6
    if(S.FEUILLE_SOIR[p] && S.FEUILLE_SOIR[p][qi] && S.apres(k, "SOIR:lu")) lu = S.FEUILLE_SOIR[p][qi];
    return lu;
  }
  S.corrigeesAu = function(k){   // les questions déjà corrigées (révélées) au moment k, dans l'ordre de correction
    var m = M[k] || {}, r = S.rang(k);
    if(r < 0) return [];
    if(r >= S.rang("S08:coeval")) return S.ORDRE_CORR.slice();
    var n = 0;
    if(r >= S.rang("S08:corr:Q2:V")) n = 1;
    if(r >= S.rang("S08:corr:Q3:V")) n = 2;
    if(r >= S.rang("S08:corr:Q1:V")) n = 3;
    return S.ORDRE_CORR.slice(0, n);
  };
  // la note de p au moment k : pts et st par question (st : j juste, t trouvée au dernier moment, f faux, a aucun, n pas encore corrigée)
  S.note = function(p, k){
    var m = M[k] || {}, an = m.annulees || [], ec = m.ecartees || [];
    if(m.seance === "PAP") return S.notePapier(p, k);
    var corr = S.corrigeesAu(k), tab = S.RT[p], used = false, st = [], pts = [];
    for(var q = 0; q < 3; q++){
      if(corr.indexOf(q) < 0){ st.push("n"); pts.push(null); continue; }
      var lu = lectureAu(p, q, k), t = tab[q];
      if(lu === "J"){ st.push("j"); pts.push(1); }
      else if(lu === "A"){ st.push("a"); pts.push(0); }
      else if(t === "J" && !used){ used = true; st.push("t"); pts.push(1); }
      else { st.push("f"); pts.push(0); }
    }
    var compte = [0,1,2].filter(function(q){ return an.indexOf(q) < 0 && ec.indexOf(q) < 0; });
    var n = compte.reduce(function(a, q){ return a + (pts[q] || 0); }, 0), total = compte.length;
    var complet = compte.every(function(q){ return pts[q] !== null; });
    var sur20 = total ? n * 20 / total : 0;
    var comp = {};
    S.EV_ESSAI.questions.forEach(function(qq, qi){ if(compte.indexOf(qi) < 0) return; qq.competences.forEach(function(c){ comp[c] = comp[c] || {n:0, max:0}; comp[c].max++; comp[c].n += (pts[qi] || 0); }); });
    var corrigee = (S.FEUILLE_SOIR[p] && S.apres(k, "SOIR:lu")) ? Object.keys(S.FEUILLE_SOIR[p]).map(Number) : [];
    if(p === "Michel" && (m.tranche === "michel" || S.apres(k, "S08:coeval:T"))) corrigee = [0].concat(corrigee);
    return {p:p, st:st, pts:pts, n:n, total:total, complet:complet, sur20:sur20, maitrise:S.maitriseDe(sur20), comp:comp, corrigees:corrigee, annulees:an, ecartees:ec};
  };
  // sur papier (467) : la note, c'est ta grille, d'après la feuille ; jamais « Trouvée au dernier moment » ; la grille se remplit le soir
  S.notePapier = function(p, k){
    var connue = ["PAP:grille", "PAP:reprise", "PAP:estim", "PAP:att2", "PAP:corr:Q2"].indexOf(k) >= 0, f = S.feuilleVraie(p);
    var st = [0, 1, 2].map(function(q){ return !connue ? "n" : f[q] === "J" ? "j" : f[q] === "A" ? "a" : "f"; });
    var pts = st.map(function(x){ return x === "n" ? null : x === "j" ? 1 : 0; }), n = pts.reduce(function(a, b){ return a + (b || 0); }, 0);
    var comp = {}; S.EV_ESSAI.questions.forEach(function(qq, qi){ qq.competences.forEach(function(c){ comp[c] = comp[c] || {n:0, max:0}; comp[c].max++; comp[c].n += (pts[qi] || 0); }); });
    return {p:p, st:st, pts:pts, n:n, total:3, complet:connue, sur20:n * 20 / 3, maitrise:S.maitriseDe(n * 20 / 3), comp:comp, corrigees:[], annulees:[], ecartees:[]};
  };
  S.provisoire = function(k){ return !S.apres(k, "SOIR:rendu"); };
  // le point d'autonomie : Hugo, retiré à 10:23 pendant la correction de Q2 ; Michel, le soir, à 19:12
  S.RETRAITS = [{p:"Hugo", apres:"S08:corr:Q2:V+", quand:"le 08/10 à 10:23", heure:"10:23"}, {p:"Michel", apres:"SOIR:michel", quand:"le 10/10 à 19:12", heure:"19:12"}];
  S.autonomie = function(p, k){
    var m = M[k] || {};
    if((m.retires || []).indexOf(p) >= 0) return {retire:true, quand:"à " + m.heure.slice(0, 5)};
    var r = S.RETRAITS.filter(function(x){ return x.p === p && S.apres(k, x.apres); })[0];
    return r ? {retire:true, quand:r.quand, heure:r.heure} : {retire:false};
  };
  S.estimation = function(p, k){
    var e = S.ESTIM[p]; if(!e) return null;
    var nt = S.note(p, k), iE = IDX.indexOf(e), iR = IDX.indexOf(nt.maitrise);
    return {k:e, type:iE === iR ? "ok" : iE > iR ? "sur" : "sous", ecart:Math.abs(iE - iR)};
  };

  /* ── « À lire sur les feuilles » : les lignes, au moment k ── */
  S.aLire = function(k){
    var m = M[k] || {}, corr = S.corrigeesAu(k), r = S.rang(k);
    var l = [];
    S.A_LIRE.forEach(function(x){ if(corr.indexOf(x.q) >= 0) l.push(Object.assign({}, x)); });
    if(r >= S.rang("S08:coeval")) S.CO_LIRE.forEach(function(x){ l.push(Object.assign({}, x)); });
    // l'alerte tranchée la feuille en main ferme la ligne de Michel, question 1
    if(m.tranche === "michel" || S.apres(k, "S08:coeval:T")) l = l.filter(function(x){ return !(x.p === "Michel" && x.q === 0); });
    // le soir, chaque feuille lue ferme sa ligne : elle reste dite « ✔ lue »
    var lues = S.apres(k, "SOIR:lu");
    l.forEach(function(x){ x.nom = nomDe(x.p); x.lue = lues; x.corrigee = lues && S.FEUILLE_SOIR[x.p] && S.FEUILLE_SOIR[x.p][x.q] ? true : false; });
    return l;
  };

  /* ── Les comptes de la console, au moment k ── */
  S.presents = function(k){ var m = M[k] || {}; var p = [].concat.apply([], S.PAIRES).filter(Boolean).map(pre); return p.filter(function(x){ return !(m.partis && m.partis[x]); }); };
  S.cote = function(p){ var t = S.tabletteDe(p); return t ? t.cote : null; };
  S.premierCote = function(qi){ return S.PREMIER[qi] === "J" ? "g" : "d"; };
  // ceux qui ont répondu à la question qi au moment k
  S.repondu = function(qi, k){
    var m = M[k] || {}, pres = S.presents(k);
    if(m.qi === qi && m.ph === "reflexion") return [];
    var pc = S.premierCote(qi);
    return pres.filter(function(p){
      if(m.qi === qi && m.ph === "reponse"){
        if(m.tour === 1 && S.cote(p) !== pc) return false;
        return (m.nonRep || []).indexOf(p) < 0;
      }
      if(m.qi === qi && (m.ph === "close" || m.ph === "panne") && (m.sansRep || []).indexOf(p) >= 0) return false;
      if(qi === 1 && p === "Théo" && S.rang(k) >= 0 && S.rang(k) < S.rang("S08:Q2:R1")) return false;
      return true;
    });
  };
  S.justeTablette = function(p, qi){ return S.RT[p][qi] === "J"; };
  S.compteurs = function(k){
    var m = M[k] || {}, pres = S.presents(k), qi = m.qi;
    if(m.seance === "TEST") return S.compteursTest(k);
    var ec = m.ecartees || [], nbQ = 3 - ec.length;
    var o = {presents:pres.length, absents:1, inscrits:25, nbQ:nbQ};
    if(qi != null && ["reflexion", "reponse", "close", "b", "passage", "rouvert"].indexOf(m.ph) >= 0){
      var rep = S.repondu(qi, k), pc = S.premierCote(qi);
      var attendu = (m.ph === "reponse" && m.tour === 1) ? pres.filter(function(p){ return S.cote(p) === pc; }).length : pres.length;
      o.repondu = [rep.length, attendu];
      o.justes = [rep.filter(function(p){ return S.justeTablette(p, qi); }).length, rep.length];
      o.question = [qi + 1 - ec.filter(function(x){ return x < qi; }).length, nbQ];
    }
    if(m.ph === "pret"){ var pe = m.pasEntres || [], ae = Object.keys(m.attestEnCours || {});
      o.connectes = [pres.length - pe.length, pres.length]; o.attestations = [pres.length - pe.length - ae.length, pres.length]; o.repondu = [0, pres.length]; }
    if(m.ph === "panne"){ o.reponses = S.repondu(0, k).length + pres.filter(function(p){ return S.cote(p) === S.premierCote(1); }).length; o.question = [2, nbQ]; }
    if(m.ph === "lecture"){ o.lus = [pres.length - (m.pasLu || []).length, pres.length]; o.manquent = (m.pasLu || []).map(nomDe); }
    if(m.ph === "coeval"){ var att = (m.tranche || S.rang(k) > S.rang("S08:coeval:T")) ? [] : Object.keys(S.CO).filter(function(p){ return S.CO[p] === "att"; });
      o.coeval = [pres.length - att.length, pres.length]; o.manquent = att.map(nomDe); }
    if(m.ph === "estim"){ var pe = m.pasEstime || []; o.estime = [pres.length - pe.length, pres.length]; o.manquent = pe.map(nomDe); }
    if(m.ph === "att2"){ var ec2 = Object.keys(m.enCours || {}); o.prets = [pres.length - ec2.length, pres.length]; o.manquent = ec2.map(nomDe); }
    return o;
  };

  /* ── Le mode test : sa classe de 30 élèves, ses 15 tablettes, la démo (src/maquette620.js) ── */
  // Q1 et Q2 déjà jouées par « 🎲 Tous les élèves répondent » : leurs justes, sur les 30 (relecteurs n°258, 260)
  S.TEST = {presents:30, tablettes:15, passees:{0:{repondu:30, justes:24}, 1:{repondu:30, justes:17}}};
  S.compteursTest = function(k){
    var m = M[k] || {}, n = S.TEST.presents, o = {presents:n, absents:0, inscrits:n, nbQ:3};
    if(m.qi != null){ o.question = [m.qi + 1, 3]; o.repondu = m.ph === "reflexion" ? [0, n] : m.tour === 1 ? [n / 2, n / 2] : [n, n]; o.justes = null; }
    return o;
  };
  // l'évaluation jouée à un moment : la démo pour la démo et le mode test, l'évaluation d'essai sinon
  S.evalDu = function(k){ var m = M[k] || {}; return m.seance === "TEST" || m.seance === "DEMO" ? S.DEMO : S.EV_ESSAI; };
  // la fin de l'heure d'une séance : son lancement + 55 min
  S.finHeure = function(k){ var m = M[k] || {}, se = m.seance && S.seance(m.seance); var h0 = se ? se.heure : (m.seance === "TEST" ? "17:00" : "10:02"); return S.hm(S.sec(h0) + 55 * 60); };

  /* ── La fin prévue : l'heure du moment, plus les temps qui restent (Réglages : 3 s de décompte, 5 s de B, 15 s entre deux questions ;
        3 min d'estimation et de seconde attestation ; 1 min de correction par question ; 2 min de co-évaluation et de bilan) ── */
  S.DUREES = {installation:5 * 60, estimAttest:3 * 60, correctionParQ:60, coevalBilan:2 * 60, decompte:3, b:5, entre:15};
  // la durée estimée d'une séance, au lancement : la somme des mêmes temps (Réglages et temps des questions)
  S.dureeEstimee = function(ev, seul){
    // un élève seul (rattrapage) n'a qu'un tour par question, et pas de co-évaluation (relecteur n°314)
    var D = S.DUREES, q = 0, tours = seul ? 1 : 2; ev.questions.forEach(function(x){ q += (x.reflexion || 0) + tours * (D.decompte + (x.reponse || 0) + D.b) + D.entre; });
    var c = ev.questions.length * D.correctionParQ, total = D.installation + q + D.estimAttest + c + (seul ? 0 : D.coevalBilan);
    return {questions:q, correction:c, total:total, min:Math.round(total / 60)};
  };
  S.FIN_HEURE = "10:57";
  function sec(h){ var p = h.split(":").map(Number); return p[0] * 3600 + p[1] * 60 + (p[2] || 0); }
  function hm(s){ s = Math.round(s / 60) * 60; var h = Math.floor(s / 3600), mn = Math.floor((s % 3600) / 60); return h + ":" + (mn < 10 ? "0" : "") + mn; }
  S.sec = sec; S.hm = hm;
  S.tempsDe = function(qi, k, surcharges){   // les deux temps d'une question au moment k : ceux de l'évaluation, ou ceux que Paul a tapés
    var m = M[k] || {}, q = S.evalDu(k).questions[qi], t = Object.assign({reflexion:q.reflexion, reponse:q.reponse}, (m.temps || {})[qi] || {}, (surcharges || {})[qi] || {});
    return t;
  };
  S.finPrevue = function(k, surcharges){
    var m = M[k] || {}, D = S.DUREES, ec = m.ecartees || [], qi = m.qi, reste = 0;
    function tour(t){ return D.decompte + t.reponse + D.b; }
    var corrRestantes = 3 - ec.length;
    if(["reflexion", "reponse", "passage", "b", "close", "pret", "rouvert"].indexOf(m.ph) >= 0){
      var debut = qi == null ? 0 : qi;
      if(qi != null){
        var t = S.tempsDe(qi, k, surcharges), r = (m.reste || 0) + ((surcharges || {}).reste || 0);
        if(m.ph === "reflexion") reste += r + 2 * tour(t);
        else if(m.ph === "passage") reste += r + t.reponse + D.b + (m.tour === 1 ? tour(t) : 0);
        else if(m.ph === "reponse") reste += r + D.b + (m.tour === 1 ? tour(t) : 0);
        else if(m.ph === "b") reste += r + (m.tour === 1 ? tour(t) : 0);
        debut = qi + 1;
      }
      for(var j = debut; j < 3; j++){ if(ec.indexOf(j) >= 0) continue; var tj = S.tempsDe(j, k, surcharges); reste += D.entre + tj.reflexion + 2 * tour(tj); }
      reste += D.estimAttest;
    } else if(m.ph === "estim"){ reste += D.estimAttest;
    } else if(m.ph === "att2"){ reste += D.estimAttest / 2;
    } else if(m.ph === "lecture" || m.ph === "revele"){
      corrRestantes = 3 - S.corrigeesAu(k).length;
    } else if(m.ph === "coeval") corrRestantes = 0;
    else return null;
    var fin = sec(m.heure) + reste + corrRestantes * D.correctionParQ + (m.ph === "coeval" ? D.coevalBilan / 2 : D.coevalBilan);
    return {sec:fin, hm:hm(fin), deborde:fin - sec(S.finHeure(k))};
  };

  /* ── Les séances passées, à un moment : celles de la classe terminées avant lui ── */
  function cle(d, h){ var p = d.split("/"); return p[2] + p[1] + p[0] + " " + (h || "00:00"); }
  S.cle = cle;
  S.seancesAvant = function(k){
    var m = M[k] || {}; var t = cle(m.date, m.heure);
    // la séance du moment n'y est que le soir, une fois terminée (une branche en pause ne l'a pas finie)
    var finie = m.ph === "soir" || m.ph === "fin";
    return S.SEANCES.filter(function(s){ return s.fin && cle(s.fin.split(" ")[0], s.fin.split(" ")[1]) <= t && (s.id !== m.seance || finie); })
      .sort(function(a, b){ return cle(b.date, b.heure).localeCompare(cle(a.date, a.heure)); });
  };
  // les copies d'une séance sont-elles rendues au moment k ?
  S.rendueAu = function(id, k){ var se = S.seance(id), m = M[k] || {}; if(!se || !se.rendues) return false; var r = se.rendues.split(" ");
    return cle(r[0], r[1] || "00:00") <= cle(m.date, m.heure); };
  S.qcmPrecedent = function(k){ return S.seancesAvant(k).filter(function(s){ return !s.demo && !s.rattrapage; })[0] || null; };
  S.passees = function(evalId, k){   // les séances terminées d'une évaluation, au moment k : la classe et la date
    return S.seancesAvant(k).filter(function(s){ return s.eval === evalId && !s.demo; }).map(function(s){ return {classe:s.classe, date:s.date.slice(0, 5)}; });
  };

  /* ── Les séances de la 3e (09/10) : les notes du PDF (gen632.js, tel quel), Michel et Julien au cas ambigu ── */
  S.R_3E = {"ABRIAL Julien":"JFJFJJFFJJF", "BAUDRY Léa":"JJJJJJFJJJJ", "BRUNEAU Camille":"JFFFJFFFJJF", "CARRÉ Tom":"FFJFFFFFJJF",
    "CHEVALLIER Théo":"JJFJFFFJJJF", "DUVERNAY Michel":"JFFJJFJFJJF", "ESNAULT Inès":"JJJJJJJJJJJ", "FOUCHER Hugo":"JJFJJJFJJJF",
    "GALLOIS Manon":"JJJTJJFJJJF", "HÉBRARD Nathan":"JFFFFFFFJJF", "ISAMBERT Chloé":"JJJJJFJJJJJ", "JOUBERT Louis":"FFFFJFFFFJF",
    "LACOMBE Emma":"JJJJJJJJJJF", "MAILLARD Noah":"JFFJFFF----", "NOGARET Zoé":"JJFJJJFJJJJ", "OLLIVIER Sacha":"FFFFFFFFJFF",
    "PERRAUD Jade":"JJJJJJFFJJF", "QUINTON Enzo":"JFFFJFFFJJF", "RAMBAUD Lina":"JJJJJJJJTJJ", "SABATIER Malo":"JFJFJFFFJJF",
    "TESSIER Anna":"JFFFFFFFJJF", "VALLÉE Rayan":"JJFFJFFJJJF", "WEBER Clara":"JJJJJJJJJJF", "YVON Adam":null, "ZELLER Lou":"JJFFJJFFJJF"};
  // les deux séances de septembre, rendues : les réponses de chacun, juste ou faux (J ou F), d'après sa feuille
  S.R_JB = {"ABRIAL Julien":"JFJJJJJFFJ", "BAUDRY Léa":"FJJJJFFFFF", "BRUNEAU Camille":"JFJFJFFJJF", "CARRÉ Tom":"JJJJFJJJJJ", "CHEVALLIER Théo":"JFFJFJJFJJ", "DUVERNAY Michel":"JJFJJJJFJF", "ESNAULT Inès":"JJFJJJFJJF", "FOUCHER Hugo":"FJJJJJJFJF", "GALLOIS Manon":"JFFJJFFJFF", "HÉBRARD Nathan":"FJJFJFJFJJ", "ISAMBERT Chloé":"JJFJJJJJFF", "JOUBERT Louis":"JJJJFFJFFJ", "LACOMBE Emma":"JFJJJFJFFF", "MAILLARD Noah":"FJFFJFFJFF", "NOGARET Zoé":"JJFJJJFFFJ", "OLLIVIER Sacha":"FJFJJFJJFF", "PERRAUD Jade":"JFJJJFFJFF", "QUINTON Enzo":"JJJJJJFFJJ", "RAMBAUD Lina":"JJJJJJJJJJ", "SABATIER Malo":"JJFJFJFFFJ", "TESSIER Anna":"JJJJJJJJFF", "VALLÉE Rayan":"JJJJFFFJJF", "WEBER Clara":"JFJJJFJFFF", "YVON Adam":"FJFFJJJJJJ", "ZELLER Lou":"JJFJFJFJFJ"};
  S.R_CH1 = {"ABRIAL Julien":"JJFFJFFFJJ", "BAUDRY Léa":"FFFJFFFFJJ", "BRUNEAU Camille":"JFJJFFJJJF", "CARRÉ Tom":"JJJJJJFFJF", "CHEVALLIER Théo":"JJFJFJJFJF", "DUVERNAY Michel":"FJJJJFJJJJ", "ESNAULT Inès":"JJJJJJJJJJ", "FOUCHER Hugo":"JJJJJFJJJF", "GALLOIS Manon":"JJJJJJJFFJ", "HÉBRARD Nathan":"FJFFJJJFJJ", "ISAMBERT Chloé":"JJJJJJJJFJ", "JOUBERT Louis":"JJFJFFJFJJ", "LACOMBE Emma":"FFJJJJJFJJ", "MAILLARD Noah":"JJFFJJFFFJ", "NOGARET Zoé":"FJFFJJJJFJ", "OLLIVIER Sacha":"FFFFFJJFJF", "PERRAUD Jade":"JJJJJJJFJJ", "QUINTON Enzo":"JJFFJJJJFJ", "RAMBAUD Lina":"JJJJJJJJJJ", "SABATIER Malo":"JFJFFJJFJJ", "TESSIER Anna":"JJJJJJJJJJ", "VALLÉE Rayan":"JFJJJJJJFF", "WEBER Clara":"FFJFFFFJFF", "YVON Adam":null, "ZELLER Lou":null};
  function noteDe(s){ if(!s) return null; var la = s.split("").filter(function(c){ return c !== "-"; });
    var n = la.filter(function(c){ return c === "J" || c === "T"; }).length, sur20 = n * 20 / la.length; return {n:n, total:la.length, sur20:sur20, maitrise:S.maitriseDe(Math.round(sur20 * 10) / 10)}; }
  S.note3e = function(nom){ return noteDe(S.R_3E[nom]); };
  S.noteSeance = function(id, nom){ return noteDe((id === "JB" ? S.R_JB : id === "CH1" ? S.R_CH1 : id === "S3E" ? S.R_3E : {})[nom]); };

  /* ── Ce qu'une élève voit dans « Mes évaluations », au moment k ── */
  S.mesEvaluations = function(p, k){
    var nom = nomDe(p), l = [];
    var rendueS08 = S.rendueAu("S08", k), r = S.note(p, k);
    l.push({titre:S.EV_ESSAI.titre, date:"08/10/2026", etat:rendueS08 ? "bilan" : "relecture", note:rendueS08 ? r : null, seance:"S08"});
    var r3 = S.note3e(nom), rendue3 = S.rendueAu("S3E", k);
    l.push({titre:HUB_EVALS[S.ID_3E].titre, date:"09/10/2026", etat:rendue3 && r3 ? "bilan" : "relecture", note:rendue3 ? r3 : null, seance:"S3E"});
    var absCh1 = S.seance("CH1").absents.indexOf(nom) >= 0;
    l.push({titre:HUB_EVALS[S.ID_CH1].titre, date:"24/09/2026", etat:absCh1 ? "absente" : "bilan", note:absCh1 ? null : S.noteSeance("CH1", nom), seance:"CH1"});
    l.push({titre:HUB_EVALS[S.ID_JB].titre, date:"15/09/2026", etat:"bilan", note:S.noteSeance("JB", nom), seance:"JB"});
    return l;
  };

  /* ── L'aide : écrire une note, une date ── */
  S.fr1 = function(x){ return (Math.round(x * 10) / 10).toFixed(1).replace(".", ",").replace(",0", ""); };
  return S;
})();
if(typeof module !== "undefined") module.exports = SCN;

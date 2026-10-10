/* ═══════════════ Maquette complète du QCM — le socle (étape 1) ═══════════════
   Toutes les scènes des maquettes existantes, dans l'ordre de la séance, chacune ouvrable par #scene=ID,
   et le sommaire derrière le bouton ⚙ « Scènes de la maquette » (seul écran de simulation, protocole §2).
   ORDRE : la séance, section par section ; « etape » : l'étape du mandat qui relit et finit la scène. */
var ORDRE = [
  // A. Préparer l'évaluation, avant le jour
  ["Préparer l'évaluation", [
    ["c-evals", 4, "Pilotage → 📝 Évaluations : la liste, avec le chapitre, le mode, les compétences, l'état."],
    ["c-collage", 4, "« ➕ Nouvelle évaluation » : le JSON collé, et les messages de la vérification."],
    ["c-editeur", 4, "« ✏️ Compléter » une évaluation du hub : chapitre, mode, compétences, temps, bonus."],
    ["x627-3-editeur", 4, "L'éditeur avec « 🎯 Ce qu'elle vérifie, pour le bilan de l'élève »."],
    ["c-feuille", 4, "« 🖨️ Imprimer » : les énoncés seuls, sur une page."]]],
  // B. Avant l'heure
  ["Avant l'heure, sur ta console", [
    ["c-lancer", 2, "« Pilotage classe » : la classe, l'évaluation, la durée, les binômes proposés."],
    ["c-appel", 2, "L'appel : l'absent sort, son binôme est réapparié ; l'heure de fin."]]],
  // C. L'entrée
  ["L'entrée", [
    ["t-combien", 2, "« Combien êtes-vous sur cette tablette ? »"],
    ["t-login", 2, "Le code, le prénom et le nom, au clavier de l'app, sur chaque moitié."],
    ["t-binome", 2, "Julien est entré ; l'autre moitié nomme son binôme."],
    ["t-attest", 2, "L'attestation (version du tour 603)."],
    ["x610-4-attestation-1", 2, "La première attestation, texte de Paul (506)."],
    ["t-pret", 2, "Les deux ont coché : ils attendent le départ."],
    ["c-pret", 2, "Ta console avant la question 1 : les 12 tablettes, qui a coché."]]],
  // D. Question 1
  ["Question 1 — Julien commence", [
    ["t-q1-reflexion", 2, "Réflexion : l'énoncé sans les choix, le chrono."],
    ["c-q1-reflexion", 2, "Ta console pendant la réflexion."],
    ["t-q1-passage1", 2, "Fin de la réflexion : « POSE TON STYLO », 3 s pour passer la tablette."],
    ["t-q1-tour1", 2, "1er tour : Julien répond ; Michel est voilé."],
    ["c-q1-tour1", 2, "Ta console au 1er tour."],
    ["p-reponse", 2, "Ton téléphone au 1er tour."],
    ["b-reponse", 2, "Le tableau en réponse : l'énoncé et le chrono, jamais les choix."],
    ["t-q1-passage2", 2, "Le passage, dans l'autre sens."],
    ["t-q1-tour2", 2, "2e tour : Michel répond, choix mélangés ; il clique Venise."],
    ["c-q1-tour2", 2, "Ta console au 2e tour : « 🔒 Clore la question »."],
    ["t-q1-attente", 2, "Les deux tours sont finis : « Attends la prochaine question »."],
    ["c-q1-close", 2, "Question close : « ▶️ Lancer Q2 », « 🔓 Rouvrir pour tous »."]]],
  // E. Question 2
  ["Question 2 — Michel commence", [
    ["t-q2-reflexion", 2, "Question 2 : deux bonnes réponses, en tout ou rien."],
    ["t-q2-tour1", 2, "Michel répond le premier."],
    ["t-q2-tour2", 2, "Julien répond en second, dans un autre ordre."],
    ["c-q2-tour2", 2, "Ta console au 2e tour de la question 2."],
    ["c-rouvrir-un", 2, "« 🔓 Rouvrir pour un élève » : Théo n'a pas répondu."],
    ["t-rouvrir-un", 2, "La tablette de Théo, rouverte ; Lou porte le voile."],
    ["p-eleve", 2, "Ton téléphone : un clic sur Théo ouvre sa fiche."]]],
  // F. Question 3
  ["Question 3 — Julien commence", [
    ["t-q3-tour1", 2, "Julien clique sur 6."],
    ["x610-1-b-julien", 2, "B : son temps est fini, il dit si sa feuille dit la même chose que son clic (évaluation de 3e)."],
    ["t-q3-tour2", 2, "Michel clique sur 10 ; sa feuille dit « 16 pattes »."],
    ["x610-2-b-michel", 2, "B, second tour : Michel (évaluation de 3e)."],
    ["c-q3-close", 2, "Dernière question close : « 📊 Lancer l'autoévaluation »."]]],
  // G. Les gestes rares
  ["Les gestes rares de la séance", [
    ["c-sessions", 3, "« 🔴 1 session en cours » : aller au pilotage, ou terminer."],
    ["c-interrompue", 3, "La séance interrompue : reprendre, ou terminer définitivement."]]],
  // H. L'estimation
  ["L'estimation", [
    ["t-estim", 3, "L'estimation, sur les deux moitiés en même temps."],
    ["c-estim", 3, "Ta console pendant l'estimation."]]],
  // I. La correction
  ["La correction", [
    ["x610-5-attestation-2", 3, "La seconde attestation, avant la correction (507, 510)."],
    ["c-corr-q2-avant", 3, "La correction commence par la question la plus ratée ; « 🔒 Révéler » fermé."],
    ["p-corr-avant", 3, "Ton téléphone, avant la révélation."],
    ["b-recopie", 3, "Le tableau pendant la recopie."],
    ["t-corr-q2-decl", 3, "« Qu'as-tu écrit sur ta feuille ? » (version du tour 603)."],
    ["t-corr-q2-attente", 3, "Les deux ont cliqué ; le chrono est rouge."],
    ["x610-3-a-correction", 3, "A : chacun lit la feuille de l'autre (évaluation de 3e)."],
    ["c-corr-q2-apres", 3, "Ta console après la révélation : le suivi de la feuille."],
    ["p-corr-apres", 3, "Ton téléphone après la révélation."],
    ["b-correction", 3, "Le tableau après la révélation : les choix sans lettres, les bonnes en vert."],
    ["t-corr-q2-apres", 3, "La tablette corrige d'après la feuille : « Trouvée au dernier moment »."],
    ["t-corr-q3-decl", 3, "Question 3 : « Ma feuille ne dit aucun de ces choix »."],
    ["c-corr-q3-apres", 3, "Ta console après la révélation de la question 3."],
    ["t-corr-q3-apres", 3, "Julien et Michel ont faux."],
    ["t-corr-q1-apres", 3, "Question 1 : juste pour les deux, d'après leur feuille."],
    ["c-corr-q1-apres", 3, "Dernière question corrigée."]]],
  // J. La co-évaluation
  ["La co-évaluation de la lecture", [
    ["x610-6-coeval-laquelle", 3, "Julien n'a rien cliqué ; Michel a cliqué « ❌ » : « c'est laquelle ? »."],
    ["x610-7-coeval-ecrit", 3, "Michel a cliqué la question 3 : « Qu'avais-tu écrit sur ta feuille ? »."],
    ["x610-8-console-alerte", 3, "Ta console : l'alerte du cas ambigu."],
    ["x610-9-telephone-alerte", 3, "Ton téléphone, au même moment."]]],
  // K. La fin
  ["La fin de l'heure", [
    ["t-bilan", 3, "Le bilan de chacun."],
    ["c-bilan", 3, "Ton bilan de classe."],
    ["t-fin", 3, "Tu as terminé : la tablette revient à « Combien êtes-vous ? »."]]],
  // L. Le soir
  ["Le soir, sur ta console", [
    ["c-seances", 4, "Données → Résultats : la liste des séances."],
    ["c-resultats", 4, "Le tableau d'une séance : ✓, ✗ ou ＋, la note, une colonne par compétence."],
    ["c-fiche", 4, "La fiche de Michel."],
    ["x626-1-fiche-bilan", 4, "La fiche de Michel avec « 📝 Bilan général » (tour 626)."],
    ["x627-1-fiche-bilan", 4, "La fiche de Michel avec « 📝 Bilan général » (tour 627)."],
    ["c-que-dit-la-feuille", 4, "« Que dit la feuille ? »."],
    ["c-corbeille", 4, "Mettre une séance à la corbeille."],
    ["c-sauvegarde", 4, "Sauvegarde, avec la corbeille."],
    ["x632-pdf", 4, "Le PDF « notes et compétences » (tour 632)."]]],
  // M. L'élève, après
  ["Côté élève, après la séance", [
    ["e-mes-evals", 4, "« 📊 Mes évaluations », chez elle."],
    ["e-bilan-lou", 4, "Le bilan de Lou, corrigé d'après sa feuille."],
    ["x626-2-eleve-bilan", 4, "Le bilan de Lou, qui finit par « 📝 Bilan » (tour 626)."],
    ["x627-2-eleve-bilan", 4, "Le bilan de Lou (tour 627)."],
    ["x628-1-eleve-bilan", 4, "Le bilan de Lou, avec les libellés élève (tour 628)."]]],
  // N. Une autre séance
  ["Une autre séance", [
    ["c-rattrapage", 3, "Le rattrapage."]]],
  // O. Le mode test
  ["Le mode test", [
    ["c-test", 4, "Le mode test (capture 64, à retirer)."],
    ["x620-1-mode-test-ouverture", 4, "Le mode test, à l'ouverture."],
    ["x620-2-mode-test-reflexion", 4, "Le mode test, pendant la réflexion."],
    ["x620-3-mode-test-en-grand", 4, "« 🔍 Jouer en grand »."]]],
  // P. Annexe
  ["Annexe : la demi-tablette", [
    ["t-annexe", 5, "La vraie question 3 de l'évaluation de 3e, sur une demi-tablette."]]]
];

/* Le PDF « notes et compétences » de gen632.js, tel quel, dans l'aperçu d'impression du navigateur */
function PdfApercu(){
  return h("div", {className:"pdf-fond"},
    h("div", {className:"pdf-barre"}, "🖨️ Aperçu avant impression · Destination : Enregistrer au format PDF"),
    h("iframe", {className:"pdf-page", title:"Notes et compétences", srcDoc:window.PDF632_HTML || "",
      onLoad:function(ev){ var f = ev.target, d = f.contentDocument; f.style.height = (d.documentElement.scrollHeight + 4) + "px"; window.SCENE_PRETE = "x632-pdf"; }}));
}
SCENES.push({id:"x632-pdf", vue:"console", attendre:true, render:PdfApercu});

/* La liste, dans l'ordre de la séance */
(function(){
  var parId = {}; SCENES.forEach(function(s){ parId[s.id] = s; });
  var liste = [];
  ORDRE.forEach(function(sec){ sec[1].forEach(function(x){
    var s = parId[x[0]];
    if(!s) throw new Error("Scène absente : " + x[0]);
    liste.push({id:s.id, vue:s.vue, vh:s.vh || null, attendre:!!s.attendre, render:s.render, section:sec[0], etape:x[1], titre:x[2]});
  }); });
  SCENES = liste;
})();
window.LISTE_SCENES = SCENES.map(function(s, i){ return {n:i + 1, id:s.id, vue:s.vue, vh:s.vh, section:s.section, etape:s.etape, titre:s.titre}; });

/* ── Le sommaire ⚙ « Scènes de la maquette » : le seul écran de simulation ── */
function Sommaire(courante){
  var n = 0;
  return h("div", {className:"som-fond", id:"sommaire"},
    h("div", {className:"som-boite"},
      h("div", {className:"som-h"}, h("strong", null, "⚙ Scènes de la maquette"),
        h("button", {className:"btn btn-ghost btn-sm som-x", title:"Fermer le sommaire (Échap)"}, "✕")),
      h("p", {className:"som-p"}, "Écran de simulation : il n'existera pas dans l'app. Chaque scène est l'écran entier, dans l'ordre de la séance."),
      ORDRE.map(function(sec, i){
        return h("div", {key:i, className:"som-sec"}, h("div", {className:"som-st"}, sec[0]),
          sec[1].map(function(x){ n++;
            return h("a", {key:x[0], href:"#scene=" + x[0], className:"som-l" + (x[0] === courante ? " cur" : "")},
              h("span", {className:"som-n"}, n), h("span", {className:"som-id"}, x[0]), h("span", null, x[2]));
          }));
      })));
}
function lireScene(){ var m = /scene=([^&]+)/.exec(location.hash || ""); return m ? decodeURIComponent(m[1]) : SCENES[0].id; }
function rendre(){
  var id = lireScene(), sc = SCENES.filter(function(s){ return s.id === id; })[0] || SCENES[0];
  document.body.className = "vue-" + sc.vue + (/[#&]cap=1/.test(location.hash) ? " capture" : "");
  var racine = document.getElementById("root");
  ReactDOM.unmountComponentAtNode(racine);
  ReactDOM.render(sc.render(), racine);
  var g = document.getElementById("som-racine");
  ReactDOM.render(h(F, null,
    h("button", {className:"som-gear", title:"⚙ Scènes de la maquette : le sommaire de toutes les scènes (simulation)"}, "⚙"),
    window.SOMMAIRE_OUVERT ? Sommaire(sc.id) : null), g);
  if(!sc.attendre) window.SCENE_PRETE = sc.id; else window.SCENE_PRETE = null;
}
document.addEventListener("click", function(ev){
  var t = ev.target.closest ? ev.target.closest(".som-gear, .som-x, .som-l") : null;
  if(!t) return;
  if(t.classList.contains("som-gear")){ window.SOMMAIRE_OUVERT = !window.SOMMAIRE_OUVERT; rendre(); }
  else if(t.classList.contains("som-x")){ window.SOMMAIRE_OUVERT = false; rendre(); }
  else if(t.classList.contains("som-l")){ window.SOMMAIRE_OUVERT = false; }
});
document.addEventListener("keydown", function(ev){ if(ev.key === "Escape" && window.SOMMAIRE_OUVERT){ window.SOMMAIRE_OUVERT = false; rendre(); } });
window.addEventListener("hashchange", rendre);
rendre();

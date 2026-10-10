/* ═══════════════ Maquette complète du QCM — le socle (étape 1) ═══════════════
   Toutes les scènes des maquettes existantes, dans l'ordre de la séance, chacune ouvrable par #scene=ID,
   et le sommaire derrière le bouton ⚙ « Scènes de la maquette » (seul écran de simulation, protocole §2).
   ORDRE : la séance, section par section ; « etape » : l'étape du mandat qui relit et finit la scène. */
var ORDRE = [
  // A. Préparer l'évaluation, avant le jour
  ["Préparer l'évaluation", [
    ["c-evals", 4, "Pilotage → 📝 Évaluations : rangées par niveau, un tri ; la démo en tête, « 🔒 Permanente »."],
    ["c-eval-corbeille", 4, "« 🗑️ » une évaluation : la corbeille, gardée un an."],
    ["c-collage", 4, "« ➕ Nouvelle évaluation » : les messages, la garde de longueur, « ce qu'elle vérifie », la durée ; « Copier les erreurs pour l'instance de création d'éval »."],
    ["x627-3-editeur", 4, "L'éditeur : « 🎯 Ce qu'elle vérifie », « 📏 longueur assumée » ; chaque geste marque l'évaluation modifiée."],
    ["c-feuille", 4, "« 🖨️ Imprimer » : les énoncés seuls, sur une page."]]],
  // B. Avant l'heure
  ["Avant l'heure, sur ta console", [
    ["c-accueil", 2, "L'accueil de l'app : « 🎓 Mode élève » ou « Accès professeur »."],
    ["c-lancer", 2, "« Pilotage classe » : la classe, l'évaluation, la durée, les binômes formés par les exclusions, puis par le QCM précédent."],
    ["c-echange-refuse", 2, "Un échange qui mettrait ensemble deux élèves exclus : refusé, avec la raison, pour toi seul."],
    ["c-appel", 2, "L'appel : l'absent sort, son binôme est réapparié ; l'heure de fin."],
    ["c-demo-lancer", 2, "La démo, lancée avec la classe : rien ne compte."],
    ["c-demo-faite", 2, "La démo faite : il n'en reste qu'une ligne."]]],
  // C. L'entrée
  ["L'entrée", [
    ["t-combien", 2, "« Combien êtes-vous sur cette tablette ? »"],
    ["t-un-eleve", 2, "« 1 élève » : le raccourci MJPC demande d'abord « Tu es bien Julien ? »."],
    ["t-login", 2, "Le code, le prénom et le nom, au clavier de l'app, sur chaque moitié."],
    ["t-login-inconnu", 2, "Un code pas encore enregistré : « lève la main »."],
    ["t-binome", 2, "Julien est entré ; l'autre moitié nomme son binôme."],
    ["t-rejoins", 2, "Michel s'est assis à la mauvaise tablette : « Tu es avec Julien… rejoins Julien. »"],
    ["t-attest-1", 2, "L'attestation, une coche par ligne : chaque ligne n'apparaît qu'après la précédente."],
    ["t-attest-2", 2, "Julien a tout coché : « Je commence » s'ouvre ; Michel en est à 5 lignes sur 8."],
    ["t-pret", 2, "Les deux ont coché : ils attendent le départ."],
    ["c-pret", 2, "Ta console avant la question 1 : les 12 tablettes, qui est assis où, où en est chaque attestation."]]],
  ["La démo, sur les tablettes", [
    ["t-demo-q", 2, "La démo : le bandeau « 🎓 Évaluation d'entraînement : elle ne compte pas. », du début à la fin."]]],
  // D. Question 1
  ["Question 1 — Julien commence", [
    ["t-q1-reflexion", 2, "Réflexion : l'énoncé sans les choix, le chrono."],
    ["c-q1-reflexion", 2, "Ta console pendant la réflexion : les deux temps à taper, la fin prévue, « ❌ Écarter »."],
    ["t-q1-passage1", 2, "Fin de la réflexion : « Pose ton stylo, Julien. Tu es prêt ? À toi dans 3 secondes » ; Michel est voilé, nommé."],
    ["t-q1-tour1", 2, "1er tour : Julien répond ; Michel est voilé."],
    ["c-q1-tour1", 2, "Ta console au 1er tour."],
    ["c-voir-tablette", 2, "« 👁 » : les deux moitiés d'une tablette, en direct."],
    ["p-reponse", 2, "Ton téléphone au 1er tour : les temps en direct, la fin prévue."],
    ["c-qr", 2, "« 📱 QR pilotage »."],
    ["b-reponse", 2, "Le tableau en réponse : l'énoncé, le chrono, « 1er tour », jamais les choix."],
    ["c-fin-prevue", 2, "Du temps ajouté : la fin prévue déborde, en rouge."],
    ["t-q1-passage2", 2, "Le passage, dans l'autre sens."],
    ["t-q1-tour2", 2, "2e tour : Michel répond, choix mélangés ; il clique Venise."],
    ["t-q1-b-michel", 2, "Son temps fini, Michel dit si sa feuille dit la même chose que son clic : sa feuille dit Rome."],
    ["c-q1-tour2", 2, "Ta console au 2e tour : « 🔒 Clore la question »."],
    ["t-q1-attente", 2, "Les deux tours sont finis : « Attends la prochaine question »."],
    ["c-q1-close", 2, "Question close : « ▶️ Lancer Q2 »."],
    ["c-ecarter", 2, "« ❌ Écarter » la question 3 : la garde."],
    ["c-ecartee", 2, "La question 3 écartée : « ❌ Écartée — pas posée », « ↩️ Remettre »."],
    ["t-q2-ecartee", 2, "Les tablettes comptent sans elle : « Question 2 / 2 »."]]],
  // E. Question 2
  ["Question 2 — Michel commence", [
    ["t-q2-reflexion", 2, "Question 2 : deux bonnes réponses, en tout ou rien."],
    ["t-q2-tour1", 2, "Michel répond le premier."],
    ["t-q2-tour2", 2, "Julien répond en second, dans un autre ordre."],
    ["c-q2-tour2", 2, "Ta console au 2e tour de la question 2."],
    ["c-q2-close", 2, "Question 2 close : Théo n'a pas répondu."],
    ["c-annuler", 2, "« ⚠️ Annuler » une question déjà posée : la garde."],
    ["c-annulee", 2, "La question 2 annulée : « ⚠️ Annulée — posée, puis annulée »."],
    ["c-rouvrir-tous", 2, "« 🔓 Rouvrir pour tous » : seulement ceux qui n'ont pas répondu."],
    ["c-rouvrir-un", 2, "« 🔓 Rouvrir pour un élève » : Théo."],
    ["t-rouvrir-un", 2, "La tablette de Théo, rouverte ; Lou porte le voile."],
    ["p-eleve", 2, "Ton téléphone : un clic sur Théo ouvre sa fiche."]]],
  // F. Question 3
  ["Question 3 — Julien commence", [
    ["t-q3-tour1", 2, "Julien clique sur 6."],
    ["x610-1-b-julien", 2, "B sur la vraie question 3 de l'évaluation de 3e : Julien dit si sa feuille dit la même chose que son clic."],
    ["t-q3-tour2", 2, "Michel clique sur 10 ; sa feuille dit « 16 pattes »."],
    ["x610-2-b-michel", 2, "B, second tour, sur l'évaluation de 3e : Michel."],
    ["c-q3-close", 2, "Dernière question close : « ✅ Dernière question close — lance l'autoévaluation »."]]],
  // G. Les gestes rares
  ["Les gestes rares de la séance", [
    ["c-depart", 2, "« 🚫 Départ d'un élève »."],
    ["c-parti", 2, "Noah est parti : il ne bloque plus ; son binôme continue seul."],
    ["c-retour", 2, "« ↩️ Retour d'un élève »."],
    ["c-deplacer", 2, "Deux élèves échangés pendant la séance : leurs réponses les suivent."],
    ["t-deplace", 2, "La moitié de l'élève déplacé : « Julien, va sur la tablette de Lou »."],
    ["c-terminer", 2, "« 🛑 Terminer la session » : la garde."],
    ["c-mode-emploi", 2, "« 📖 Mode d'emploi », réécrit d'après le cadrage."],
    ["c-finir-autre-heure", 3, "« ⏸️ Finir à une autre heure » : la séance garde son état exact."],
    ["c-reprendre", 3, "À l'heure suivante : « ▶️ Reprendre la séance du 09/10 — question 1, 1er tour »."],
    ["c-rouvrir-seance", 3, "« 🔓 Rouvrir » une séance terminée : la garde."],
    ["c-sessions", 3, "« 🔴 1 session en cours » : aller au pilotage, ou terminer."],
    ["c-interrompue", 3, "La séance interrompue : reprendre, finir à une autre heure, ou terminer définitivement."]]],
  // H. L'estimation
  ["L'estimation", [
    ["t-estim", 3, "L'estimation : « Combien de bonnes réponses penses-tu avoir ? … », sans infobulle."],
    ["c-estim", 3, "Ta console pendant l'estimation : « 📝 Lancer la correction »."]]],
  // I. La correction
  ["La correction", [
    ["x610-5-attestation-2", 3, "La seconde attestation, une coche par ligne, les compétences par leur libellé élève."],
    ["t-attest-corr-fait", 3, "Julien a tout coché : il attend ; Michel en est à 4 lignes sur 5."],
    ["c-attest2", 3, "Ta console attend que tous les présents aient coché la seconde attestation."],
    ["t-corr-q2-lecture", 3, "A : Michel lit la feuille de Julien et clique, dans la moitié de Julien ; Julien n'a pas encore lu celle de Michel."],
    ["c-corr-q2-avant", 3, "La correction commence par la question la plus ratée ; « 🔒 Révéler » attend que toutes les feuilles soient lues."],
    ["p-corr-avant", 3, "Ton téléphone, avant la révélation : les feuilles pas encore lues."],
    ["b-recopie", 3, "Le tableau pendant la lecture : l'énoncé, sans les choix."],
    ["c-corr-q2-lu", 3, "Toutes les feuilles sont lues : « 💡 Révéler » s'ouvre."],
    ["c-corr-q2-apres", 3, "Après la révélation : « ⛔ Dernier moment » en orange, « ⚠️ À relire » d'après B ; un clic sur un nom agit sur l'élève."],
    ["p-corr-apres", 3, "Ton téléphone après la révélation."],
    ["b-correction", 3, "Le tableau après la révélation : les choix, les bonnes en vert."],
    ["t-corr-q2-apres", 3, "La tablette corrige d'après la lecture du voisin : Julien, « Trouvée au dernier moment », le ✓ orange."],
    ["t-corr-q3-lecture", 3, "Question 3 : Julien lit « aucun de ces choix » sur la feuille de Michel."],
    ["c-corr-q3-apres", 3, "Ta console après la révélation de la question 3."],
    ["t-corr-q3-apres", 3, "Julien et Michel ont faux."],
    ["t-corr-q1-lecture", 3, "Question 1 : Julien lit Venise sur la feuille de Michel, qui dit Rome."],
    ["t-corr-q1-apres", 3, "Question 1 révélée : Michel a faux, d'après la lecture de Julien."],
    ["c-corr-q1-apres", 3, "Dernière question révélée : « 🏁 Afficher leur bilan aux élèves »."],
    ["x610-3-a-correction", 3, "A sur la vraie question 3 de l'évaluation de 3e : la moitié tient dans l'écran."],
    ["t-corr-seul", 3, "Un élève seul sur sa tablette (rattrapage) : il lit lui-même sa feuille ; pas de co-évaluation."]]],
  ["Le point d'autonomie", [
    ["c-autonomie", 3, "Un clic sur un nom : « ⛔ Retirer le point d'autonomie »."],
    ["c-autonomie-garde", 3, "La garde : ses deux compétences d'autonomie passent en Maîtrise insuffisante ; la note ne bouge pas."],
    ["c-autonomie-retiree", 3, "Le point retiré : « ↩️ Rendre » le défait."],
    ["p-autonomie", 3, "Le même geste, sur ton téléphone."]]],
  // J. La co-évaluation
  ["La co-évaluation de la lecture", [
    ["t-coeval", 3, "Julien n'a rien cliqué ; Michel a cliqué « ❌ » : « c'est laquelle ? »."],
    ["t-coeval-ecrit", 3, "Michel a cliqué la question 1 : « Qu'avais-tu écrit sur ta feuille ? » ; Julien a répondu « ✅ »."],
    ["t-coeval-daccord", 3, "Michel a cliqué ce que Julien avait lu : « vous êtes d'accord », retour aux trois choix."],
    ["c-coeval-attente", 3, "Ta console : l'alerte, dans l'ordre des faits ; « 🏁 » attend les 4 derniers."],
    ["c-coeval-feuille", 3, "« La feuille dit autre chose : je clique ce qu'elle dit »."],
    ["c-autonomie-michel", 3, "« ⛔ à Michel » : la garde."],
    ["c-autonomie-julien", 3, "« ⛔ à Julien » : la garde."],
    ["c-autonomie-deux", 3, "« ⛔ aux deux » : la garde."],
    ["c-coeval-retire-michel", 3, "Le point d'autonomie retiré à Michel : l'alerte reste à trancher."],
    ["c-coeval-retire-julien", 3, "Le point d'autonomie retiré à Julien : l'alerte reste à trancher."],
    ["c-coeval-retire-deux", 3, "« ⛔ aux deux » : les deux points retirés ; l'alerte reste à trancher."],
    ["c-coeval-tranche", 3, "L'alerte tranchée, tous ont répondu : « 🏁 Afficher leur bilan aux élèves » s'ouvre."],
    ["x610-6-coeval-laquelle", 3, "Le cas ambigu, sur l'évaluation de 3e : Michel a cliqué « ❌ » : « c'est laquelle ? »."],
    ["x610-7-coeval-ecrit", 3, "Michel a cliqué la question 3 : « Qu'avais-tu écrit sur ta feuille ? »."],
    ["x610-8-console-alerte", 3, "Ta console : l'alerte du cas ambigu, les trois lectures de la feuille."],
    ["x610-feuille", 3, "Le cas ambigu : « La feuille dit autre chose : je clique ce qu'elle dit » — C et E."],
    ["x610-autonomie-michel", 3, "« ⛔ à Michel » : la garde."],
    ["x610-autonomie-julien", 3, "« ⛔ à Julien » : la garde."],
    ["x610-autonomie-deux", 3, "« ⛔ aux deux », pour le cas où aucun n'a joué le jeu : la garde."],
    ["x610-tranche", 3, "Le cas ambigu tranché : « 🏁 Afficher leur bilan aux élèves » s'ouvre."],
    ["x610-9-telephone-alerte", 3, "Ton téléphone, au même moment."]]],
  // K. La fin
  ["La fin de l'heure", [
    ["t-bilan", 3, "Le bilan de chacun : « Ta note provisoire », les libellés élève, le ✓ orange, l'autonomie atteinte."],
    ["t-bilan-imprime", 3, "« 📄 Imprimer / Exporter mon bilan » : le bilan, tel qu'il s'imprime."],
    ["t-bilan-annulee", 3, "Si la question 2 avait été annulée : « Question 2 · annulée : elle ne compte pas. », la note sur 2."],
    ["t-bilan-non-atteinte", 3, "Après « ⛔ aux deux » : les deux compétences d'autonomie « non atteinte »."],
    ["c-bilan", 3, "Ton bilan de classe."],
    ["t-fin", 3, "Tu as terminé : la tablette revient à « Combien êtes-vous ? »."]]],
  // K2. Le papier seul
  ["La séance sur papier", [
    ["c-papier-lancer", 3, "« 📄 Séance sur papier » au lancement."],
    ["c-papier-seance", 3, "La séance sur papier : les énoncés imprimés, puis « ⏸️ Feuilles ramassées »."],
    ["e-papier-enonces", 3, "Les énoncés seuls, sur une page, avec les points."],
    ["c-papier-grille", 3, "Le soir : la grille, un élève par ligne, un clic pour ✓ ou ✗."],
    ["c-papier-reprendre", 3, "L'heure suivante : « ▶️ Reprendre la séance du 09/10 — correction »."],
    ["t-papier-estim", 3, "Les binômes reprennent les tablettes : l'estimation."],
    ["t-papier-attest", 3, "La seconde attestation, variante papier : chacun corrige sa feuille au stylo."],
    ["c-papier-correction", 3, "Ta console : « 💡 Révéler » tout de suite, d'après ta grille."],
    ["t-papier-correction", 3, "Chaque moitié montre ce que ta grille a retenu de la feuille, puis la réponse."]]],
  // L. Le soir
  ["Le soir, sur ta console", [
    ["c-seances", 4, "Données → Résultats : les séances rangées par classe, un tri ; « publiée », « copies non rendues »."],
    ["c-resultats", 4, "Le tableau d'une séance : ✓, ✗, ⛔ ou ∅, la note, les compétences, l'autonomie, les feuilles à lire ; le PDF fermé."],
    ["c-fiche", 4, "La fiche de Michel : sa feuille lue par Julien, sa tablette, ce qu'il a dit ; « ⛔ Retirer le point d'autonomie » ; « 📝 Bilan général »."],
    ["c-fiche-garde", 4, "« ⛔ Retirer le point d'autonomie », le soir : la garde."],
    ["c-fiche-retire", 4, "Le point retiré, dans la fiche : « ↩️ Rendre »."],
    ["c-que-dit-la-feuille", 4, "« Que dit la feuille ? »."],
    ["c-seances-lues", 4, "Toutes les feuilles lues : « rendre les copies ▸ »."],
    ["c-rendre", 4, "« Rendre les copies » : la garde."],
    ["c-copies-rendues", 4, "« copies rendues le 10/10 », « 🙈 Masquer les copies »."],
    ["c-resultats-rendues", 4, "Les copies rendues : le PDF s'ouvre."],
    ["x632-pdf", 4, "Le PDF « notes et compétences » (gen632.js)."],
    ["c-corbeille", 4, "Mettre une séance à la corbeille."],
    ["c-sauvegarde", 4, "Sauvegarde, avec la corbeille et les purges."],
    ["c-importer", 4, "« 📤 Importer snapshot » : la garde."],
    ["c-purger", 4, "« Purger les évaluations » : la démo reste."]]],
  // M. L'élève, après
  ["Côté élève, après la séance", [
    ["e-mes-evals", 4, "« 📊 Mes évaluations », chez elle : « En relecture », « Tu étais absente »."],
    ["e-mes-evals-rendue", 4, "Sa copie rendue : la note définitive."],
    ["e-bilan-lou", 4, "Le bilan de Lou, corrigé d'après sa feuille, qui finit par « 📝 Bilan »."]]],
  // N. Réglages, MJPC
  ["Réglages, et MJPC", [
    ["c-reglages", 4, "Réglages, en cartes : la classe, le prompt, les durées de la séance, les niveaux de maîtrise, les textes."],
    ["c-reglages-prompt", 4, "Le prompt de création d'éval."],
    ["m-classe-exclusions", 4, "MJPC, Élèves & codes, comme dans le site : la clé saisie, l'import, chaque élève avec « 🚫 Jamais avec… » après le ◆."],
    ["m-exclusion-refusee", 4, "Une quatrième exclusion : refusée, avec la raison."],
    ["m-fiche-eleve", 4, "Un clic sur un nom : la fiche de l'élève, telle qu'elle est dans le site (sexe, dispositif, cases PAP)."],
    ["m-taxonomie", 4, "MJPC, Taxonomie : le référentiel, l'éditeur fermé."],
    ["m-taxonomie-editeur", 4, "« Ouvrir l'éditeur » : la vraie taxonomie, version 1.4.0, ses 7 domaines ; puis « Les compétences »."],
    ["m-taxonomie-domaine", 4, "Un domaine ouvert, une famille ouverte : ses notions, « ✏️ Modifier », « Désactiver », « + Nouvelle notion »."],
    ["m-taxonomie-notion", 4, "« ✏️ Modifier » une notion : ses libellés, ses niveaux, son exemple."],
    ["m-taxonomie-competences", 4, "« Les compétences » : les 28, sous leurs groupes, avec leur libellé élève."],
    ["m-taxonomie-competence", 4, "« ✏️ Modifier » une compétence : le même formulaire, avec son libellé élève."]]],
  // O. Une autre séance
  ["Une autre séance", [
    ["c-rattrapage", 3, "Le rattrapage."]]],
  // P. Le mode test
  ["Le mode test", [
    ["x620-1-mode-test-ouverture", 4, "Le mode test, à l'ouverture : ta vraie console d'avant l'heure, 15 tablettes."],
    ["x620-2-mode-test-reflexion", 4, "Le mode test, pendant la réflexion."],
    ["x620-3-mode-test-en-grand", 4, "« 🔍 Jouer en grand »."]]],
  // Q. Annexe
  ["Annexe : la demi-tablette", [
    ["t-annexe", 5, "L'étalon des mesures : la vraie question 3 de l'évaluation de 3e (6 choix longs), sur une demi-tablette : 67 px de reste."]]]
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
  window.SCENE_COURANTE = sc.id;
  ReactDOM.unmountComponentAtNode(racine);
  ReactDOM.render(sc.render(), racine);
  poserGestes(); surveiller();
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

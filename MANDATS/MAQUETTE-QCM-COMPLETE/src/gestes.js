/* ═══════════════ Les gestes de la maquette (étape 2) ═══════════════
   Protocole §2 : aucun bouton inerte, chaque geste de la console porte son infobulle, écrite pour Paul :
   ce que le geste fait et ce qu'il coûte. Un bouton mène à la scène qui montre ce qu'il fait (ALLER),
   ou agit sur place (les composants à état : temps, attestation, choix), ou il est grisé avec la raison.
   Les infobulles (BULLES) se posent sur les boutons après chaque rendu ; une infobulle déjà écrite dans la scène est gardée. */
function etiquetteDe(b){
  var c = b.cloneNode(true);
  Array.prototype.forEach.call(c.querySelectorAll(".info-i,.info-tip"), function(x){ x.remove(); });
  return (c.textContent || "").replace(/\s+/g, " ").trim();
}

/* ── Les infobulles, pour Paul ── */
var BULLES = {
  // L'en-tête et les onglets de la console
  "🔴1 session en cours": "Les séances encore ouvertes, ici ou ailleurs : tu vas au pilotage de chacune, ou tu la termines. Ne coûte rien.",
  "📖 Mode d'emploi": "Ouvre le mode d'emploi du QCM, réécrit d'après le cadrage : le déroulé d'une séance, la note, la correction. Ne change rien.",
  "📺 Ouvrir vue tableau": "Ouvre la vue tableau, à glisser sur le vidéoprojecteur : l'énoncé et le chrono, jamais les choix. Ne change rien à la séance.",
  "📱 QR pilotage": "Montre le QR de ton téléphone : il devient ta télécommande, avec tous les boutons de la séance. Ne change rien.",
  "🧪 Mode test": "Ouvre le mode test : la même chose que le réel, sur la classe de test et la démo ; tout est effacé à la sortie, sauf la démo. Ne touche à aucune vraie classe.",
  "← Retour": "Revient à l'écran précédent. Une séance en cours continue : elle se retrouve par « 🔴 sessions en cours ».",
  "Pilotage": "Le pilotage : préparer les évaluations et piloter la classe.",
  "Données": "Les données : les résultats des séances, la sauvegarde et la corbeille.",
  "Réglages": "Les réglages, en cartes, comme dans la correction de dictée : le prompt, les durées de la séance, les niveaux de maîtrise, les textes.",
  "?": "Le mode d'emploi, comme « 📖 Mode d'emploi ».",
  "📝 Évaluations": "La liste de tes évaluations : créer, compléter, imprimer, dupliquer, mettre à la corbeille.",
  "🎯 Pilotage classe": "Lancer une séance, puis la piloter : la classe, l'évaluation, les binômes, l'appel.",
  "📊 Résultats": "Les résultats des séances : les notes d'après la feuille, les compétences, les feuilles à lire.",
  "💾 Sauvegarde": "Exporter ou importer tout le QCM, et la corbeille.",
  // Avant l'heure
  "🚀 Lancer la session": "Ouvre l'appel : tu coches les absents, l'heure de fin se règle, puis la séance s'ouvre et les tablettes passent à l'attestation. Les binômes restent ceux de la grille.",
  "🚀 Lancer la session ": "Ouvre la séance avec cette liste d'absents et cette heure de fin : les tablettes passent à l'attestation. Les binômes restés seuls sont réappariés.",
  "Annuler": "Ferme sans rien changer.",
  "Tout le monde présent": "Décoche tous les absents d'un coup. La séance n'est pas encore lancée.",
  "📊 Résultats ": "Ouvre les résultats de cette séance passée.",
  "🎓 Lancer la démo": "Lance la démo avec la classe, comme une vraie séance : appel, binômes, attestations, questions, correction. Rien ne compte : ni note, ni compétence, ni point d'autonomie.",
  // Le pilotage
  "🚫 Départ d'un élève": "Marque un élève parti : il ne bloque plus la classe, son binôme continue seul, ses questions manquées sortent de son total. Il revient par « ↩️ Retour d'un élève ».",
  "↩️ Retour d'un élève": "Un élève parti revient : il reprend sa moitié ; les questions qu'il a manquées restent hors de son total.",
  "🔓 Rouvrir pour un élève": "Rouvre la question close pour un élève qui n'a pas répondu, une seule fois par question, avec le temps de réponse de la question. Son voisin porte le voile ordinaire.",
  "🛑 Terminer la session": "Termine la séance : l'archive s'écrit avec les notes telles qu'elles sont, quelle que soit la phase ; les tablettes oublient leurs élèves. Une confirmation d'abord.",
  "▶️ Lancer Q1": "Lance la question 1 : la réflexion commence sur toutes les tablettes, l'énoncé sans les choix.",
  "✋ Autoriser la réponse": "Coupe la réflexion : « POSE TON STYLO » sur les deux moitiés, puis le 1er tour. Sert quand tous ont fini d'écrire avant la fin du temps.",
  "⏭️ Tour suivant": "Coupe le 1er tour : les premiers sont figés et disent si leur feuille dit la même chose que leur clic, puis le 2e tour commence.",
  "🔒 Clore la question": "Coupe le 2e tour : les seconds sont figés et disent si leur feuille dit la même chose que leur clic ; la question est close.",
  "⏸️ Pause": "Gèle le tour en cours, voile compris. « ▶️ Reprendre » le relance là où il en était.",
  "▶️ Reprendre": "Relance le tour gelé, là où il en était.",
  "🔄 Relancer chrono": "Repart du début du temps en cours (réflexion ou tour de réponse). Les réponses déjà données restent.",
  "+5": "Ajoute 5 secondes à ce temps, pour toute la question : les deux tours ont le même temps, et la lecture à la correction aussi. La fin prévue recule d'autant.",
  "+10": "Ajoute 10 secondes à ce temps, pour toute la question (les deux tours, la lecture à la correction). La fin prévue recule d'autant.",
  "+30": "Ajoute 30 secondes à ce temps, pour toute la question (les deux tours, la lecture à la correction). La fin prévue recule d'autant.",
  "🔓 Rouvrir pour tous": "Rouvre la question close pour ceux qui n'ont pas répondu, une seule fois par question : les deux tours reprennent pour eux seuls. Une réponse donnée est définitive.",
  "📊 Lancer l'autoévaluation": "Ouvre l'estimation sur les deux moitiés en même temps : chacun dit combien de bonnes réponses il pense avoir.",
  "❌ Écarter": "Écarte cette question du déroulé, avant qu'elle soit posée : elle ne se pose pas, ne se corrige pas, et sort du total de la note et des compétences. Une confirmation d'abord ; « ↩️ Remettre » la défait.",
  "⚠️ Annuler": "Annule cette question déjà posée (mal formulée, par exemple) : ses réponses restent gardées, mais elle sort du total de la note et des compétences. Une confirmation d'abord ; « ↩️ Remettre » la défait.",
  "↩️ Remettre": "Remet la question dans le déroulé, comme avant ton geste.",
  "👁": "Montre les deux moitiés de cette tablette en direct, en grand. Ne change rien.",
  "✕": "Ferme cette fenêtre sans rien changer (Échap).",
  "✕ Fermer": "Ferme sans rien changer (Échap).",
  // Les gardes
  "❌ Écarter la question 3": "Écarte la question 3 : elle ne sera ni posée ni corrigée ; la note et la compétence comptent sans elle. Se défait par « ↩️ Remettre ».",
  "⚠️ Annuler la question 2": "Annule la question 2 : ses réponses restent gardées, mais elle sort du total de la note et des compétences ; les élèves liront qu'elle ne compte pas. Se défait par « ↩️ Remettre ».",
  "🛑 Terminer la séance": "Termine maintenant : l'archive s'écrit avec les notes telles qu'elles sont ; les tablettes oublient leurs élèves et reviennent à « Combien êtes-vous ? ».",
  "🚫 Parti": "Marque cet élève parti : son binôme continue seul ; ses questions manquées sortent de son total.",
  "↩️ Revenu": "Cet élève revient : il reprend sa moitié.",
  "🔓 Rouvrir pour Théo": "Rouvre la question 2 pour Théo seul, avec son temps de réponse ; Lou porte le voile pendant son tour. Une seule fois.",
  "🎯 Aller au pilotage": "Ouvre le pilotage de cette séance.",
  "🛑 Terminer": "Termine cette séance : l'archive s'écrit avec les notes telles qu'elles sont. Une confirmation d'abord.",
  // Le téléphone
  "🔁 Rouvrir Q2 pour cet élève uniquement (une seule fois)": "Rouvre la question 2 pour cet élève seul : il n'avait pas répondu ; une seule fois ; son voisin porte le voile.",
  "🚫 Marquer comme parti en cours de séance": "Marque l'élève parti : il ne bloque plus la classe ; ses questions manquées sortent de son total.",
  "🔄 Chrono": "Repart du début du temps en cours.",
  "🚀 Lancer Q3": "Lance la question 3 sur toutes les tablettes.",
  "🔓 Rouvrir Q2 pour tous": "Rouvre la question 2 pour ceux qui n'ont pas répondu, une seule fois.",
  // Réglages, mode d'emploi, QR, accueil
  "📋 Copier le prompt": "Copie le prompt, avec ton chapitre, ses compétences et les limites de longueur, pour le coller dans l'instance de création d'éval. Ne change rien ici.",
  "✏️ Modifier le prompt": "Ouvre le prompt pour le modifier. Rien n'est gardé avant « 💾 Enregistrer ».",
  "🔄 Restaurer le prompt par défaut": "Remet le prompt du cadrage (tour 630) à la place du tien. Une confirmation d'abord ; le tien part à la corbeille.",
  "💾 Enregistrer": "Garde ces réglages pour toutes les séances ; une séance déjà lancée garde les siens.",
  "Ouvrir la console MJPC →": "Ouvre la console MJPC : les classes, les élèves, leurs codes, les aménagements et les exclusions.",
  "👩‍🏫 Accès professeur": "Ouvre la console avec ton code ou ta clé.",
  "🎓 Mode élève": "Ouvre l'écran des élèves : « Combien êtes-vous sur cette tablette ? ».",
  "Ouvrir la session professeur": "Ouvre la console avec la clé gardée sur cet appareil.",
  "Fermer": "Ferme sans rien changer (Échap)."
};
/* Les infobulles des boutons dont le libellé porte un nombre ou un nom */
var BULLES_RE = [
  [/^▶️ Lancer Q(\d+)$/, function(m){ return "Lance la question " + m[1] + " : la réflexion commence sur toutes les tablettes, l'énoncé sans les choix."; }],
  [/^🔒 Révéler/, function(){ return "Fermé tant qu'un élève présent n'a pas lu la feuille de son voisin : les noms qui manquent sont en rouge."; }],
  [/^(🎓 )?Démo/, function(){ return "La démo : rien ne compte."; }]
];
function bulleDe(lib, b){
  if(BULLES[lib]) return BULLES[lib];
  for(var i = 0; i < BULLES_RE.length; i++){ var m = BULLES_RE[i][0].exec(lib); if(m) return BULLES_RE[i][1](m, b); }
  return null;
}

/* ── Où mène chaque bouton : ALLER[scène][libellé], puis ALLER["*"][libellé] ── */
var ALLER = {"*": {
  "🔴1 session en cours": "c-sessions", "📖 Mode d'emploi": "c-mode-emploi", "?": "c-mode-emploi", "📺 Ouvrir vue tableau": "b-reponse",
  "📱 QR pilotage": "c-qr", "🧪 Mode test": "x620-1-mode-test-ouverture", "← Retour": "c-accueil",
  "Pilotage": "c-lancer", "🎯 Pilotage classe": "c-lancer", "📝 Évaluations": "c-evals", "Données": "c-seances", "📊 Résultats": "c-seances",
  "💾 Sauvegarde": "c-sauvegarde", "Réglages": "c-reglages", "🚫 Départ d'un élève": "c-depart", "↩️ Retour d'un élève": "c-retour",
  "🔓 Rouvrir pour un élève": "c-rouvrir-un", "🛑 Terminer la session": "c-terminer", "👁": "c-voir-tablette",
  "👤 1 élève": "t-un-eleve", "👥 2 élèves": "t-login", "Entrer →": "t-binome", "Entrer": "t-attest-1", "Pas là ? Choisir un autre élève": "t-login"
}};
function allerDe(scene, lib){
  var a = ALLER[scene]; if(a && a[lib] !== undefined) return a[lib];
  return ALLER["*"][lib];
}
function versScene(id){ location.hash = "#scene=" + id + (/[#&]cap=1/.test(location.hash) ? "&cap=1" : ""); }

/* ── Poser les gestes après chaque rendu ── */
function poserGestes(){
  var racine = document.getElementById("root"); if(!racine) return;
  var scene = window.SCENE_COURANTE;
  Array.prototype.forEach.call(racine.querySelectorAll("button"), function(b){
    var lib = etiquetteDe(b);
    if(!b.getAttribute("title")){ var t = bulleDe(lib, b); if(t) b.setAttribute("title", t); }
    if(!b.hasAttribute("data-va") && !b.hasAttribute("data-local")){ var v = allerDe(scene, lib); if(v) b.setAttribute("data-va", v); }
  });
}
var GARDIEN = null;
function surveiller(){
  if(GARDIEN) GARDIEN.disconnect();
  GARDIEN = new MutationObserver(function(){ GARDIEN.disconnect(); poserGestes(); GARDIEN.observe(document.getElementById("root"), {childList:true, subtree:true}); });
  GARDIEN.observe(document.getElementById("root"), {childList:true, subtree:true});
}

/* ── Les clics : aller à une scène, ou cocher sur place (les choix de l'élève, ses réponses) ── */
document.addEventListener("click", function(ev){
  var b = ev.target.closest ? ev.target.closest("#root button, #root .tel-el, #root .qdf-c") : null;
  if(!b || b.disabled) return;
  if(b.hasAttribute("data-va")){ ev.preventDefault(); versScene(b.getAttribute("data-va")); return; }
  if(b.hasAttribute("data-local")) return;                                   // un composant à état s'en occupe
  if(b.classList.contains("tel-el")){ versScene("p-eleve"); return; }
  if(b.classList.contains("eleve-choix-btn") && !b.closest(".fige-choix")){
    if(b.classList.contains("aucun")) Array.prototype.forEach.call(b.parentNode.querySelectorAll(".eleve-choix-btn"), function(x){ if(x !== b) x.classList.remove("selected"); });
    else { var a = b.parentNode.querySelector(".eleve-choix-btn.aucun"); if(a) a.classList.remove("selected"); }
    b.classList.toggle("selected"); return;
  }
  var groupe = b.closest(".decl-b-btns, .co-btns, .qdf-choix, .autoeval-fourchettes");
  if(groupe){ Array.prototype.forEach.call(groupe.children, function(x){ x.classList.remove("on", "sel", "choisi"); }); b.classList.add(b.classList.contains("qdf-c") ? "sel" : "on"); return; }
});
document.addEventListener("keydown", function(ev){
  if(ev.key !== "Escape" || window.SOMMAIRE_OUVERT) return;
  var f = document.querySelector("#root [data-echap]");                     // Échap ferme une fenêtre à la fois
  if(f){ versScene(f.getAttribute("data-echap")); }
});

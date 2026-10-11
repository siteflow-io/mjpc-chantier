/* ═══════════════ Complément 1 : les défauts 2, 4, 5, 6 et ce que les gardes ont trouvé ═══════════════
   Défaut 2 : l'infobulle d'un geste qui existe déjà est celle de la 7.7.1, mot pour mot ; seul ce que le cadrage change
   s'écrit autrement (banc/existant/retraits.json cite alors le point). Ces infobulles remplacent celles que la scène portait.
   Elles valent pour les scènes du QCM, pas pour celles de MJPC (« m-… »), qui ont les leurs (index.html). */
var TOUT_QCM = /^(?!m-)/;
var TITRES_771 = [
  // L'en-tête de la console (l. 5868, 6016 à 6030)
  [TOUT_QCM, {
    "📖 Mode d'emploi": "Ouvre le mode d'emploi avec toutes les explications de l'app.",
    "?": "Aide et nouveautés",
    "📺 Ouvrir vue tableau": "Ouvre la vue tableau dans une NOUVELLE FENÊTRE (pas un onglet) que tu peux glisser sur l'écran qui projette. Utilise W+P en mode \"Étendre\" sur Windows pour avoir un bureau virtuel sur le vidéoprojecteur, puis F11 pour plein écran. Cette vue n'affiche QUE la question (sans contrôles), garantissant que le pilotage ne peut jamais être projeté par erreur.",
    "📱 QR pilotage": "Affiche un QR code à scanner avec ton téléphone pour piloter la classe à distance (depuis le fond de la salle par exemple). La fenêtre se ferme automatiquement dès que le scan est détecté.",
    // Le pilotage (l. 7749, 7928 à 7934)
    "🚫 Départ d'un élève": "Marque un élève comme parti en cours de session. Ses réponses déjà données restent enregistrées (sa note sera calculée au prorata des questions auxquelles il a participé). L'absence est tracée pour le suivi longitudinal MJPC.",
    "▶️ Lancer Q1": "Démarre la session : la question 1 s'affiche côté élève en phase réflexion.",
    "⏸️ Pause": "Fige tous les chronos immédiatement (utile en cas d'interruption en classe). Les élèves voient un bandeau de pause.",
    "🔄 Relancer chrono": "Remet le chrono à zéro pour la phase en cours (durée pleine ré-injectée).",
    "📊 Lancer l'autoévaluation": "Lance la phase d'autoévaluation : les élèves estiment leur score avant la correction.",
    // L'élève, son bilan (l. 4176)
    "📄 Imprimer / Exporter mon bilan": "Ouvre une version imprimable de ton bilan (format copie corrigée), que tu peux imprimer ou montrer à tes parents.",
    // Le prompt, l. 6491 à 6499
    "📋 Copier le prompt": "Copie le prompt actuel dans le presse-papiers.",
    "✏️ Modifier le prompt": "Ouvre l'éditeur pour modifier le prompt. Les modifications sont enregistrées dans Firebase et réutilisées la prochaine fois.",
    "🔄 Restaurer le prompt par défaut": "Remplace le brouillon par le prompt fourni par défaut avec l'app. Tu pourras ensuite cliquer sur « Enregistrer » pour le rendre actif."
  }],
  [/^x620/, {"📱 QR pilotage": "Affiche un QR code à scanner avec ton téléphone pour piloter la session de test à distance. Pour vérifier que la VuePhone fonctionne en mode test."}],
  [/^c-reglages-prompt-modifier$/, {
    "💾 Enregistrer": "Enregistre ce prompt dans Firebase. Il sera réutilisé à chaque ouverture du modal, sur tous les appareils.",
    "↩️ Annuler": "Annule les modifications et revient au prompt enregistré."
  }],
  // L'appel (l. 7090, 7091)
  [/^c-appel$/, {"Tout le monde présent": "Décocher tout : aucun absent", "🚀 Lancer la session": "Démarrer la session avec les absents marqués"}],
  // Les évaluations (l. 6390 à 6413)
  [/^c-eval/, {
    "✏️ Modifier": "Modifier le titre, les questions, les choix ou le niveau de difficulté.",
    "➕ Nouvelle évaluation": "Créer une nouvelle évaluation. Tu colles un JSON (généré par l'IA via le bouton Prompt IA) et l'app parse automatiquement les questions, choix, bonnes réponses et niveaux.",
    "📋 Dupliquer": "Créer une copie modifiable. Pratique pour adapter une éval à un autre niveau ou faire des variantes."
  }],
  // Le collage et l'éditeur (l. 6597 à 6764)
  [/^(c-collage|x627-3-editeur)$/, {
    "✨ Démarrer à blanc": "Crée une évaluation vide pour la construire directement dans l'éditeur visuel ci-dessous (sans passer par l'IA).",
    "🔍 Vérifier le format": "Parse le JSON ci-dessus et l'affiche en mode éditable ci-dessous.",
    "↑": "Monter cette question d'un cran.",
    "↓": "Descendre cette question d'un cran.",
    "🗑": "Supprimer cette question.",
    "➕ Ajouter un choix": "Ajouter un nouveau choix à cette question.",
    "➕ Ajouter une question": "Ajouter une nouvelle question vide à la fin de l'évaluation."
  }],
  // Les résultats d'une séance (l. 8393)
  [/^c-resultats/, {"← Retour": "Retour à la liste des sessions."}],
  // Sauvegarde (l. 8750, 8766)
  [/^c-(sauvegarde|importer|purger|corbeille)$/, {
    "📥 Exporter snapshot": "Télécharge un fichier JSON contenant l'intégralité des données. À garder précieusement.",
    "🧹 Nettoyer les sessions zombies": "Détecte et nettoie les sessions « zombies » : entrées sessionActive qui pointent vers une session inexistante, classe disparue, ou session encore marquée « en_cours » alors qu'elle date de plus de 24h. Un rapport détaillé te sera affiché AVANT exécution, et tu pourras annuler. Les données des sessions (réponses, scans) sont préservées : seul l'état « en_cours » est corrigé en « termine »."
  }],
  // Les outils du mode test (l. 4540 à 4790) : tout le haut de la 7.7.1 est gardé, avec ses mots (573)
  [/^x620/, {
    "⏱️ Faire expirer le chrono": "Repousse le départ du chrono dans le passé : peutRepondre refuse immédiatement, sans attendre.",
    "⚖️ Vérifier que les notes n'ont pas bougé": "Recompte les notes de la classe telles qu'elles étaient le jour de l'évaluation, puis telles qu'elles seraient avec l'énoncé actuel.",
    "✏️ Modifier l'éval après coup": "Change la bonne réponse de la question 1 après coup : le geste qui causait le recalcul rétroactif.",
    "🎲 Tous les élèves répondent": "Simule les réponses de TOUS les élèves restants (qui n'ont pas encore répondu ou voté) avec un délai aléatoire entre chaque (200-1500ms), pour reproduire une vraie situation de classe. Fonctionne en phase « réponse » (vote aléatoire parmi les choix de la question) ET en phase « autoeval » (vote aléatoire parmi les 4 fourchettes).",
    "👋 Ouvrir le portail élève": "Monte le VRAI composant élève (AppEleve → EleveLogin), pas une simulation.",
    "📥 Exporter snapshot test": "Exporte un snapshot complet de la base de données (incluant la session de test) au format JSON. Utile pour partager l'état exact en cas de bug à investiguer.",
    "🔒 Clôturer (chemin réel)": "Appelle cloturerSession() — le chemin exact du bouton « Terminer la session ».",
    "🗑️ Sortir et purger": "Termine le mode test : supprime la classe _TEST, l'éval test et toutes les sessions associées. Aucune donnée réelle n'est affectée."
  }]
];
function titre771(scene, lib){
  var t = null;
  TITRES_771.forEach(function(x){ if(x[0].test(scene) && x[1][lib] !== undefined) t = x[1][lib]; });
  return t;
}
// Les BULLES qui le disaient autrement suivent aussi la 7.7.1 (elles servent aux boutons dont le titre se lit dans BULLES)
Object.keys(TITRES_771[0][1]).forEach(function(l){ BULLES[l] = TITRES_771[0][1][l]; });

/* ── Les gestes des scènes ajoutées ── */
BULLES["🤖 Prompt IA"] = "Ouvre le prompt de création d'éval, à copier dans l'instance qui écrit le JSON.";
BULLES["✓ J'ai compris"] = "Ferme le mode d'emploi.";
BULLES["📊 Mes évaluations"] = "Ouvre « Mes évaluations » : tes évaluations passées et leur bilan.";
ALLER["*"]["📊 Mes évaluations"] = "e-mes-evals";

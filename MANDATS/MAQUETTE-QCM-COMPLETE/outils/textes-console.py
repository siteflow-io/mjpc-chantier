# Le classement des textes de la maquette (complément 3, changement 1) : banc/existant/textes-console.json.
# Chaque texte que la maquette a écrit elle-même, vu dans les vues de Paul (relevé par banc/releve-textes.js), reçoit sa catégorie :
#   donnée (un énoncé, un nom, une note, un titre, une date, un compte, une légende, une étiquette),
#   état (ce qui est vrai maintenant, dans cette séance), alerte (ce qui demande à Paul d'agir, une erreur, ce qu'un geste coûte),
#   explication (comment une règle marche en général) : elle quitte l'écran, pour l'infobulle d'un élément ou le mode d'emploi ;
#   « place » est le texte qu'elle y prend, mot pour mot ou resserré.
# Un texte du site d'aujourd'hui (index.html, evaluation-qcm.html) que le relevé ne reconnaît pas, parce que le site l'assemble
# morceau par morceau, est marqué « existant » avec sa ligne : il reste tel quel (§1.4).
#   python3 outils/textes-console.py <relevé.json> [<relevé2.json> …]   (les relevés s'ajoutent ; le classement garde ses entrées)
import json, re, sys, os
D = os.path.dirname(os.path.abspath(__file__))
SORTIE = os.path.join(D, "..", "banc", "existant", "textes-console.json")

def E(infobulle=None, scene=None, mode=None, place=None):
    d = {}
    if infobulle: d["infobulle"] = infobulle; d["scene"] = scene
    if mode: d["mode_emploi"] = mode
    d["place"] = place
    return ("explication", d)

# Les explications : (le début du texte, sa destination)
EXPLICATIONS = [
  ("✅ Prête à lancer · rien ne compte : ni note, ni compétence · revient d'elle-même", E("🔒 Permanente", "c-evals", place="La démo ne compte jamais : ni note, ni compétence. Elle revient d'elle-même après toute purge.")),
  ("Elle part dans la corbeille du site, gardée un an, avec ses questions.", E("🗑️", "c-evals", place="Ses séances passées gardent leurs notes.")),
  ("Édite directement chaque champ.", E(mode="Préparer une évaluation", place="Dans l'éditeur, chaque champ s'édite directement : coche les bonnes réponses ; la difficulté et les deux temps se règlent question par question.")),
  ("📏 Longueur assumée : 60 px de trop", E(mode="Préparer une évaluation", place="Une question « 📏 longueur assumée » dépasse la demi-tablette : sa moitié défilera seule, la page ne bouge pas.")),
  ("⏱️ Durée estimée : 15 min — installation", E("⏱️ Durée estimée", "c-lancer", place="pour chacune : la réflexion, puis deux tours de 3 s de décompte, de réponse et de 5 s où l'élève dit si sa feuille dit la même chose, puis 15 s")),
  ("Classement du QCM précédent, puis 1-2, 3-4…", E("📱 Binômes proposés", "c-lancer", place="Glisse un nom sur un autre pour échanger deux élèves, ou sur une moitié vide pour l'y déplacer, jusqu'au bout de l'heure.")),
  ("lancement + 55 min ; les tablettes oublient leurs élèves", E("🕙 Fin de l'heure", "c-appel", place="Les tablettes oublient leurs élèves à « Terminer », ou 10 min après cette heure.")),
  ("🎓 La démo : rien ne compte. Tu la joues avec la classe", E(mode="La démo", place="Pas de note, pas de compétence, pas de point d'autonomie, rien vers MJPC ; jamais dans « Mes évaluations », ni dans tes Résultats, ni dans le PDF ; jamais « le QCM précédent ».")),
  ("rien ne compte : ni note, ni compétence ; elle ne sert jamais aux binômes", E("🎓 Démo faite", "c-demo-faite", place="Rien ne compte : ni note, ni compétence ; elle ne sert jamais aux binômes.")),
  ("par tour, et pour la lecture à la correction", E("✋ Réponse", "c-q1-reflexion", place="Il vaut pour chaque tour, et pour la lecture à la correction.")),
  ("pour cette question", E("🧠 Réflexion", "c-q1-tour1", place="Le temps de réflexion de cette question.")),
  ("« ↩️ Remettre » la défait, tant que son tour n'est pas passé.", E("❌ Écarter", "c-q1-close", place="« ↩️ Remettre » la défait, tant que son tour n'est pas passé.")),
  ("« Rouvrir pour tous » ne rouvre que pour ceux", E("🔓 Rouvrir pour tous", "c-q2-close", place="Il ne rouvre que pour ceux qui n'ont pas répondu, une fois par question.")),
  ("Dans leur bilan, les élèves liront", E("⚠️ Annuler", "c-q2-close", place="les élèves liront : « Question 2 · annulée : elle ne compte pas. »")),
  ("Dans ta console et tes résultats, elle garde sa marque", E("⚠️ Annuler", "c-q2-close", place="Dans ta console et tes résultats, elle garde sa marque « ⚠️ Annulée — posée, puis annulée ».")),
  ("Ici : CHEVALLIER Théo (tablette 12). Les deux tours reprennent", E("🔓 Rouvrir pour ceux qui n'ont pas répondu", "c-rouvrir-tous", place="Une réponse donnée est définitive : les autres ne changent rien.")),
  ("Une seule fois par question. Il a le temps de réponse", E("🔓 Rouvrir pour Théo", "c-rouvrir-un", place="Une seule fois par question, avec le temps de réponse de la question.")),
  ("Il ne bloque plus la classe : son binôme continue seul", E("🚫 Parti", "c-depart", place="Il ne bloque plus la classe : son binôme continue seul ; ses questions manquées sortent de son total, et tu fixes sa note d'après sa feuille.")),
  ("La séance est close, et l'archive s'écrit avec les notes telles qu'elles sont, quelle que soit la phase. Les questions", E("🛑 Terminer la séance", "c-terminer", place="Les questions pas encore corrigées n'ont pas de lecture : tu fixes ces notes d'après les feuilles, dans Données → Résultats.")),
  ("La séance garde son état exact : la question, le tour", E("⏸️ Finir à une autre heure", "c-finir-autre-heure", place="Les tablettes oublient leurs élèves à la fin de l'heure, comme d'habitude.")),
  ("À l'heure suivante, « 🎯 Pilotage classe » propose", E("⏸️ Finir à une autre heure", "c-finir-autre-heure", place="À l'heure suivante, « 🎯 Pilotage classe » propose de la reprendre : l'appel, les mêmes binômes, puis le tour en cours recommence au début, voile compris.")),
  ("Tant qu'elle n'est pas terminée, cette séance ne compte pas comme « QCM précédent »", E("⏸️ Finir à une autre heure", "c-finir-autre-heure", place="Tant qu'elle n'est pas terminée, cette séance ne compte pas comme « QCM précédent » pour les binômes.")),
  ("↳ pas encore « QCM précédent » : elle ne sert pas aux binômes", E("↳ pas encore « QCM précédent »", "c-reprendre", place="Elle ne sert pas aux binômes tant qu'elle n'est pas terminée.")),
  ("Elle reprend exactement là où elle s'était terminée.", E("🔓 Rouvrir la séance", "c-rouvrir-seance", place="Ses copies rendues sont masquées aux élèves jusqu'au prochain « Rendre les copies ».")),
  ("Tant qu'elle est rouverte, elle ne compte plus comme « QCM précédent »", E("🔓 Rouvrir la séance", "c-rouvrir-seance", place="Tant qu'elle est rouverte, elle ne compte plus comme « QCM précédent » pour les binômes.")),
  ("🛑 Terminer : la séance est close", E("🛑 Terminer", "c-sessions", place="La séance est close, et l'archive s'écrit avec les notes telles qu'elles sont, quelle que soit la phase.")),
  ("🔄 Reprendre : le tour en cours recommence", E("🔄 Reprendre la séance", "c-interrompue", place="Le tour en cours recommence au début, voile compris. Une réponse déjà donnée reste.")),
  ("🛑 Terminer définitivement : la séance est close", E("🛑 Terminer définitivement", "c-interrompue", place="Les questions pas encore corrigées n'ont pas de lecture : tu fixes ces notes d'après les feuilles, dans Données → Résultats.")),
  ("⏸️ Finir à une autre heure : la séance garde son état exact", E("⏸️ Finir à une autre heure", "c-interrompue", place="La séance garde son état exact et se reprend à une heure suivante, depuis « 🎯 Pilotage classe ».")),
  ("Les élèves choisissent dans quelle fourchette", E("Phase autoévaluation", "c-estim", place="Les élèves choisissent dans quelle fourchette ils estiment avoir réussi.")),
  ("sur 20 s, le temps de réponse de la question", E("📄 Temps pour lire la feuille du voisin", "c-corr-q2-avant", place="orange à la moitié, rouge les 5 dernières secondes")),
  ("Le nom est celui dont la feuille n'est pas encore lue.", E("Il en manque", "c-corr-q2-avant", place="Le nom est celui dont la feuille n'est pas encore lue.")),
  ("Une tablette en panne : un clic sur le nom, puis", E("Feuille pas encore lue", "p-corr-avant", place="Une tablette en panne : un clic sur le nom, puis « 🚫 Marquer comme parti en cours de séance ».")),
  ("Il commence l'évaluation avec son point d'autonomie", E("⛔ Retirer le point d'autonomie", "c-autonomie", place="Le retirer met ses deux compétences d'autonomie en Maîtrise insuffisante ; sa note ne bouge pas, puisque la note, c'est la feuille.")),
  ("Il ne le voit pas en direct : son voisin regarde la tablette.", E("⛔ Retirer le point d'autonomie", "c-autonomie", place="Il ne le voit pas en direct : il le lit dans son bilan et dans « Mes évaluations ».")),
  ("🔴 Point d'autonomie retiré à 10:41.", ("état", None)),
  ("Côté élève, son bilan dira", E("⛔ Retirer le point d'autonomie", "c-autonomie-garde", place="« ↩️ Rendre » le défait, en direct ou le soir, dans sa fiche.")),
  ("L'alerte est apparue quand Michel a cliqué ce qu'il avait écrit ; elle disparaît s'il change d'avis avant le bilan. Aucun", E("❌ Alerte", "c-coeval-attente", place="Aucun point d'autonomie n'est retiré tout seul : c'est toi qui décides.")),
  ("L'alerte est apparue quand Michel a cliqué ce qu'il avait écrit ; elle disparaît s'il change d'avis avant le bilan. Chaque", E("❌ Alerte", "x610-8-console-alerte", place="L'alerte est apparue quand Michel a cliqué ce qu'il avait écrit ; elle disparaît s'il change d'avis avant le bilan.")),
  ("Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin.", E("🤝 Ce que chacun pense de la lecture de sa feuille", "c-coeval-attente", place="Chaque moitié dit ce que cet élève pense de la lecture de sa feuille par son voisin.")),
  ("👉 Avant de connaître la réponse, Michel disait C, E", E("Point", "x610-8-console-alerte", place="Seule la lecture faite après la réponse donne le point.")),
  ("Un litige est légitime", E("⛔ aux deux", "x610-8-console-alerte", place="« Aux deux » est pour le cas où aucun n'a joué le jeu, par exemple chacun à moitié de bonne foi.")),
  ("📄 Sur papier : les énoncés seuls, imprimés", E("📄 Séance sur papier", "c-papier-lancer", place="Chacun répond seul sur sa feuille, avec les énoncés imprimés. Tu ramasses les feuilles : la séance se met en pause. Le soir, tu remplis la grille ; à l'heure suivante, « ▶️ Reprendre » : l'estimation, la seconde attestation, puis toutes les corrections à la suite, sur les tablettes.")),
  ("Les élèves ont les énoncés seuls, sans les choix", E("📄 Séance sur papier en cours", "c-papier-seance", place="Les élèves ont les énoncés seuls, sans les choix, et répondent sur leur feuille, seuls.")),
  ("09/10/2026 10:02 · sur papier · 24 présents, 1 absent (YVON Adam) · ta grille", E("Élève", "c-papier-grille", place="Ta grille, d'après les feuilles, fait la note. Un clic sur une case bascule ✓ / ✗.")),
  ("Question 1 / 3 — Q2 · toutes les corrections à la suite", E("Question 1 / 3", "c-papier-correction", place="Toutes les corrections se font à la suite, dans l'ordre des erreurs de ta grille.")),
  ("Un clic sur « 📊 Ouvrir » ouvre le tableau de la séance.", E("📊 Ouvrir", "c-seances", place="Ouvre le tableau de la séance")),
  ("Son bilan général le dira, et son bilan quand sa copie lui sera rendue", E("⛔ Retirer le point d'autonomie", "c-fiche-garde", place="Son bilan général le dira, et son bilan quand sa copie lui sera rendue.")),
  ("« 🙈 Masquer les copies » les retire ensuite", E("📤 Rendre les copies", "c-rendre", place="« 🙈 Masquer les copies » les retire ensuite, jusqu'au prochain « Rendre les copies ».")),
  ("Exporte ou importe l'ensemble de la base QCM (évaluations, sessions, réponses), avec les classes.", ("donnée", None)),
  ("Avant d'importer, le QCM d'aujourd'hui part à la corbeille", E("📤 Importer snapshot", "c-sauvegarde", place="Avant d'importer, le QCM d'aujourd'hui part à la corbeille : rien n'est perdu.")),
  ("Ce que tu supprimes dans le QCM part ici, gardé un an.", E("🗑️ Corbeille", "c-sauvegarde", place="Ce que tu supprimes dans le QCM part ici, gardé un an. ↩️ le remet à sa place.")),
  ("Tout part d'abord à la corbeille, gardé un an. Pense quand même", E("🗑️ Zone dangereuse", "c-sauvegarde", place="Tout part d'abord à la corbeille, gardé un an. Pense quand même à exporter un snapshot.")),
  ("Le QCM d'aujourd'hui part d'abord à la corbeille, gardé un an : rien n'est perdu. La démo", E("📤 Choisir le fichier et importer", "c-importer", place="La démo revient d'elle-même à l'ouverture suivante.")),
  ("Leurs séances gardent leurs notes. La démo", E("🗑️ Purger", "c-purger", place="La démo n'est pas touchée : elle est écrite dans l'app, et revient d'elle-même si elle manque.")),
  ("Les listes d'élèves, leurs codes, leurs aménagements et leurs exclusions appartiennent", E("👥 Classes et élèves", "c-reglages", place="Les listes d'élèves, leurs codes, leurs aménagements et leurs exclusions appartiennent au site MJPC, qui les partage avec toutes les applications.")),
  ("Il ne devine jamais un temps", E("🤖 Le prompt de création d'éval", "c-reglages", place="Il ne devine jamais un temps : il te demande chaque temps, te dit « ça ne rentre pas », et ne produit le JSON qu'à ton « produis le JSON ».")),
  ("Les tranches s'écrivent « de 5 à moins de 6 »", E("🎚️ Les niveaux de maîtrise et la note", "c-reglages", place="Les tranches s'écrivent « de 5 à moins de 10 » : aucune note ne tombe entre deux.")),
  ("Éditeur des messages élève.", E("💬 Ce que lisent les élèves", "c-reglages", place="Ces phrases s'affichent sur les tablettes de tes élèves. Un champ laissé vide revient au texte d'origine.")),
  ("Chapitre choisi : 3e · Chapitre 1 — Poésie et peinture au XIXe siècle. Copie ce prompt", E("🤖 Le prompt de création d'éval", "c-reglages-prompt", place="Copie ce prompt et colle-le dans l'instance de création d'éval : elle te posera ses questions, puis te rendra le JSON.")),
  ("Les jetons entre doubles accolades", E("🤖 Le prompt de création d'éval", "c-reglages-prompt-modifier", place="Les jetons entre doubles accolades sont remplis par l'app à chaque copie : le chapitre, ses compétences, les difficultés, les durées et les limites de longueur.")),
  ("🚫 Les exclusions de la classe : deux élèves exclus", E("exclusions", "m-classe-exclusions", place="Deux élèves exclus ne sont jamais sur la même tablette. Elles passent avant toute règle de binômes, dans chaque app.")),
  ("Elle vaut dans les deux sens, et pour toutes les apps", E("🚫 Jamais avec…", "m-classe-exclusions", place="Elle vaut dans les deux sens, et pour toutes les apps qui partagent une tablette (le QCM, la correction de dictée…). Aucun écran d'élève ne la montre.")),
  ("🚫 Refusé : pas d'exclusion entre Inès et Jade", E("3 / 3", "m-exclusion-refusee", place="Avec 3 au plus, il existe toujours des binômes possibles, absents compris, dès 8 présents.")),
  ("Les 28 compétences du référentiel.", E("🧩 Les compétences", "m-taxonomie-editeur", place="Le libellé officiel reste pour École Directe et le PDF « notes et compétences » ; tout ce que voit l'élève prend le libellé élève. L'identifiant ne change jamais.")),
  ("🔁 Rattrapage. 3 ESSAI a déjà passé cette évaluation", E("🔁 Rattrapage", "c-rattrapage", place="Cette séance ne servira jamais de « QCM précédent » pour les binômes. Un élève déjà noté garde la note de sa première séance.")),
  ("Pas encore noté à cette évaluation : YVON Adam", E("YVON Adam", "c-rattrapage", place="Seul, il fait lui-même la lecture de sa feuille à la correction ; il n'a pas de co-évaluation.")),
  ("Remplit les tablettes, les feuilles et les clics d'un cas connu", E("🎬 Préparer un cas", "x620-1-mode-test-ouverture", place="Il écrit au hub ce qu'écriraient les clics.")),
  ("Ouvre l'application élève telle qu'elle est : « Combien êtes-vous", E("🎓 Entrer comme un élève", "x620-1-mode-test-ouverture", place="Ouvre l'application élève telle qu'elle est : « Combien êtes-vous sur cette tablette ? », puis code, prénom et nom, puis le code du binôme.")),
  ("Environnement de test isolé. Classe fictive (30 élèves", E("Environnement de test isolé.", "x620-1-mode-test-ouverture", place="Classe fictive (30 élèves simulés, 15 tablettes), la démo par défaut. Tu pilotes en haut comme en classe, et tu joues les tablettes en bas. À la sortie, tout est purgé automatiquement, sauf la démo.")),
  ("Le même panneau qu'en classe, avant l'heure", E("🎯 Panneau prof", "x620-1-mode-test-ouverture", place="Le même panneau qu'en classe, avant l'heure : choix de l'évaluation, binômes, puis l'appel au lancement.")),
  ("Glisse un nom sur un autre pour échanger deux élèves, ou sur une moitié vide pour l'y déplacer. Tu peux le faire", E("📱 Binômes proposés", "x620-1-mode-test-ouverture", place="Glisse un nom sur un autre pour échanger deux élèves, ou sur une moitié vide pour l'y déplacer, jusqu'au bout de l'heure.")),
  ("Pendant la réflexion, tu tapes sous chaque tablette", E("👥 Tablettes simulées", "x620-2-mode-test-reflexion", place="Pendant la réflexion, tu tapes sous chaque tablette ce que chaque élève écrit sur sa feuille. La feuille est posée à côté de la tablette, comme en classe.")),
  ("Ces boutons appellent les fonctions réelles", ("donnée", None)),
]
# Les textes du site d'aujourd'hui que le site assemble morceau par morceau : ils restent tels quels (§1.4)
EXISTANTS = [
  ("25 codes préparés, 0 refusé", "index.html, secuMigrerCodes (l. 14660) : le bilan de la préparation"),
  ("Fiche élève · ", "index.html, elfFicheHtml (l. 5936)"),
  ("Ce que les apps liront :", "index.html, elfFicheHtml (l. 5960)"),
  ("Élève : ", "index.html, _taxoLigneNotion (l. 2519) : les libellés de la taxonomie, ses niveaux, son exemple"),
  ("L’identifiant ", "index.html, _taxoFormEdition (l. 2496)"),
  ("Année 2026-2027.", "index.html, edtPeindrePanneau (l. 19800)"),
  ("Calendrier de l’année — ", "index.html, edtPeindrePanneau (l. 19803) : l'état du calendrier"),
  ("Grille de l’emploi du temps — ", "index.html, edtPeindrePanneau (l. 19804)"),
  ("Créneaux horaires — ", "index.html, edtPeindrePanneau (l. 19805)"),
  ("Le calendrier de l’année a été injecté", "index.html, edtAlerteInjection (l. 19821)"),
  ("JSON de « ", "index.html, edtSortirJson (l. 20792) : le message de la copie"),
  ("Session : ", "evaluation-qcm.html, l'état de la séance de test (l. 4560)"),
  ("▸ Voir tous les codes du bac à sable", "evaluation-qcm.html (l. 4610)"),
  ("🚫 ESNAULT Inès n'est jamais sur une tablette avec…", None),
]
ALERTES = re.compile(r"^(⚠️ (Les deux|À compléter|Il reste|Les compétences|c4-)|❌ Rien n'est|🚫 (Échange refusé|Refusé)|Question \d+ : |La compétence « |La séance durerait|Appelle-les|Pense à exporter|« 💡 Révéler » s'ouvre|« 🏁 Afficher|La correction commence quand|CARRÉ Tom et ESNAULT Inès ne sont jamais)")
# Les corrections à la lecture : (le début du texte, la catégorie)
MANUEL = [
  ("Elle a été posée, mais elle ne comptera pas", "alerte"), ("Elle ne sera ni posée ni corrigée.", "alerte"), ("Ses deux compétences d'autonomie passent", "alerte"),
  ("Leurs deux compétences d'autonomie passent", "alerte"), ("Elle part dans la corbeille du site, gardée un an, avec ses réponses", "alerte"),
  ("Chaque élève voit, dans « Mes évaluations »", "alerte"), ("✔ Les 5 feuilles à lire sont lues.", "état"), ("Les tablettes oublient leurs élèves et reviennent", "alerte"),
  ("Toutes les évaluations partent à la corbeille", "alerte"), ("Il remplace tout le QCM", "alerte"), ("Que dit la feuille ?", "donnée"),
  ("Seuls ceux qui n'ont pas répondu la retrouvent", "état"), ("Seuls les élèves sans réponse", "état"),
  ("Q3 à Q9 : complètes (repliées pour la capture)", "état"),
  # (complément 3, étape B) les textes calculés du scénario, relus
  ("Choisis d'abord le chapitre : il donne les compétences permises.", "alerte"), ("Elle ne sera ni posée ni corrigée, et sort du total", "alerte"),
  ("La séance est close, et l'archive s'écrit avec les notes", "alerte"), ("La séance garde son état exact", "état"), ("À l'heure suivante, « 🎯 Pilotage classe » propose", "état"),
  ("Ses copies, rendues le", "alerte"), ("✔ Les ", "état"), ("Chaque élève voit, dans « Mes évaluations »", "alerte"), ("Elle part dans la corbeille du site", "alerte"),
  ("Le QCM d'aujourd'hui part d'abord à la corbeille", "alerte"), ("Leurs séances gardent leurs notes.", "alerte"), ("✓ juste", "donnée"), ("{", "donnée"),
  ("Tu vas m'aider à écrire une évaluation QCM", "donnée"), ("Préparer une évaluation", "donnée"), ("La démo", "donnée"), ("Évaluation fragile.", "donnée"),
  ("Il a son point d'autonomie", "état"), ("⛔ Point d'autonomie retiré", "état"), ("🚫 Refusé : pas d'exclusion", "alerte"),
  ("Les 28 compétences du référentiel.", "donnée"), ("🔁 Rattrapage.", "état"), ("Pas encore noté à cette évaluation", "état"),
  ("👉 Avant de connaître la réponse", "état"), ("Ce que montrent ses deux moitiés", "état"), ("État actuel :", "état")]
# Le mode d'emploi : chaque texte de sa section (il y est à sa place)
MODE = [("Dans l'éditeur, chaque champ s'édite directement", "Préparer une évaluation"), ("La démo : rien ne compte.", "La démo"),
  ("Deux élèves par tablette, une moitié chacun.", "La séance, en classe"), ("Réflexion : l'énoncé sans les choix", "Une question"),
  ("Après l'estimation et la seconde attestation", "La correction"), ("La note, c'est la feuille.", "La note"), ("Données → Résultats : les notes", "Le soir"),
  ("Chaque élève commence avec son point", "Le point d'autonomie")]
def defaut(t):
    if ALERTES.match(t): return "alerte"
    lettres = len(re.findall(r"[^\W\d_]", t))
    verbe = re.search(r"\b(est|sont|a|ont|passe|dit|disait|reste|restent|ouvre|attend|peut|va|commence|part|garde|voit|lit|ne|n'|s'ouvre|répond|écrit|corrige|sera|sont)\b", t)
    if lettres < 40 and not verbe: return "donnée"
    return "état"

def classer(t):
    for debut, sec in MODE:
        if t.startswith(debut): return {"categorie": "explication", "destination": {"mode_emploi": sec, "place": t[:120]}}
    for debut, cat in MANUEL:
        if t.startswith(debut): return {"categorie": cat}
    for debut, (cat, dest) in EXPLICATIONS:
        if t.startswith(debut) or (len(debut) > 25 and debut in t):
            return {"categorie": cat, **({"destination": dest} if dest else {})}
    for debut, ou in EXISTANTS:
        if t.startswith(debut):
            return {"categorie": "état" if "—" in t or ":" in t else "donnée", "existant": ou or "texte de la section, gardé tel quel"}
    return {"categorie": defaut(t)}

ancien = json.load(open(SORTIE, encoding="utf-8")) if os.path.exists(SORTIE) else {"textes": [], "motifs": []}
parTexte = {x["texte"]: x for x in ancien.get("textes", [])}
for f in sys.argv[1:]:
    for x in json.load(open(f, encoding="utf-8")):
        t = x["texte"]
        e = parTexte.get(t) or {"texte": t}
        e["scenes"] = sorted(set(e.get("scenes", []) + x["scenes"]))
        if "categorie" not in e or e.get("auto", True):
            c = classer(t); e.update(c); e["auto"] = True
        parTexte[t] = e
motifs = ancien.get("motifs") or [
  {"motif": "^[A-ZÉÈÀÇ][A-ZÉÈÀÇ' -]+ [A-ZÉ][a-zéèêëàâîïôöûç-]+ — Q\\d+ : ", "categorie": "donnée", "pourquoi": "une ligne « à lire sur la feuille » : l'élève, la question, la raison"},
  {"motif": "^Q\\d+ (✓|✗|⛔|∅|＋)( · Q\\d+ (✓|✗|⛔|∅|＋))*( → \\d+/\\d+)?$", "categorie": "donnée", "pourquoi": "le détail d'une compétence, question par question"},
  {"motif": "^(✓ prêt · \\d\\d:\\d\\d|attestation \\d/\\d|🚪 parti à \\d\\d:\\d\\d)$", "categorie": "état", "pourquoi": "l'état d'une moitié de tablette"}]
out = {"pourquoi": "Le classement des textes que la maquette a écrits elle-même, dans les vues de Paul (complément 3, changement 1). Catégories : donnée, état, alerte, explication ; une explication a sa destination (l'infobulle d'un élément, ou une section du mode d'emploi) et « place », le texte qu'elle y prend. « existant » : un texte du site d'aujourd'hui que le site assemble morceau par morceau, gardé tel quel. « auto » : la catégorie donnée par les règles de outils/textes-console.py, relue.",
  "textes": sorted(parTexte.values(), key=lambda x: (x["scenes"][0] if x.get("scenes") else "", x["texte"])), "motifs": motifs}
json.dump(out, open(SORTIE, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out["textes"]), "textes", Counter(x["categorie"] for x in out["textes"]))

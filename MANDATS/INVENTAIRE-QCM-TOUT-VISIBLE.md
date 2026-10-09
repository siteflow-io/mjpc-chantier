# Inventaire « tout visible » du QCM (point 148)

*Conscience n°12, 08/10/2026, tour 602. Ta règle (08/10, 10:38) : « la première chose c'est de le faire apparaître vraiment dans la console. Comme tout. Une fonctionnalité = un visuel, un bouton, un champ, etc. Tout visible. » Ma proposition 148, retenue : « Pour chaque fonction, je relève où elle se voit dans ta console et par quel bouton ou quel champ. […] Rien ne part au mandat sans sa place visible. »*

**Ce qui a été lu.** `evaluation-qcm.html` 7.7.1 (la production), écran par écran ; les 165 gestes du côté professeur (boutons, champs, cases), avec leur infobulle ; le hub, le 08/10 à 22:50, en lecture seule (`qcm/evaluations`, `qcm/settings`, `qcm/textes`). Les captures sont celles de la maquette : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/MAQUETTE-QCM-FLUX/README.md

**Comment lire.** Une ligne par fonction. « Aujourd'hui » : où elle se voit dans 7.7.1 et par quel geste, avec les lignes du fichier. « Après le cadrage » : où elle se verra, avec le numéro de la capture de la maquette, ou « pas de capture ». Le verdict : **Garder** (rien ne change) ; **Changer** (le cadrage la change, avec le numéro du point) ; **Retirer** ; **Nouveau** ; **Proposé** (le cadrage n'en dit rien : c'est ma proposition, à trancher). *Tour 603 : Paul, « ok pour toutes tes propositions » ; elles sont marquées « Retenu (Paul, 603) ».*

**Le compte.** 95 fonctions : 21 gardées, 46 changées par le cadrage, 7 nouvelles, 6 retirées, et 15 propositions à trancher. Cinq trouvailles sont inscrites au registre (partie 16), et une sixième au tour 603 (210). Quatorze écrans n'ont pas encore de capture (partie 17).

---

## 1. L'accueil et l'en-tête de ta console

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Entrer comme professeur | Accueil : « Accès professeur », puis le code ou la clé (l. 2477-2499) ; ou le bandeau « Ouvrir la session professeur » quand la clé est gardée sur l'appareil (l. 1856-1871) | Pareil. Pas de capture | Garder |
| Entrer par l'adresse | `#mode=prof` dans l'adresse ouvre la console, sans code ni clé (l. 2457) | Pareil (Paul, 603 : « le qr code et le téléphone on laisse exactement ainsi ») | Garder (dette 208 close) |
| Les sessions en cours | Pastille « 🔴 n sessions en cours », puis une fenêtre : « 🎯 Aller au pilotage » ou « 🛑 Terminer » (l. 6008-6015, 6044-6090) | Pareil ; « Terminer » écrit l'archive (337). Pas de capture | Changer (337) |
| Le mode d'emploi | « 📖 Mode d'emploi » et « ? » ouvrent la même fenêtre (l. 6016, 5868) | Voir la partie 13 | Changer |
| La vue tableau | « 📺 Ouvrir vue tableau » : une fenêtre à part, à glisser sur le vidéoprojecteur (l. 6017-6024) | Pareil ; ce qu'elle montre : partie 8 | Garder |
| Le pilotage au téléphone | « 📱 QR pilotage » (l. 6025) | Pareil ; ce qu'il montre : partie 7 | Garder |
| Le mode test | « 🧪 Mode test » (l. 6026) | Partie 12 | Changer |
| Les onglets | Pilotage (📄 Préparation, 📝 Évaluations, 🎯 Pilotage classe), Données (📊 Résultats, 💾 Sauvegarde), Réglages (l. 5842-5846). « 📄 Préparation » et « 📝 Évaluations » montrent la même liste : Préparation, c'est une phrase, puis « Évaluations » en entier (l. 5881-5891, 6035-6036) | Un seul onglet. Pas de capture | Retenu (Paul, 603) (dette 209) |

## 2. Préparation : les évaluations

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| La liste | Titre, « version n », nombre de questions, date de création (l. 6385-6420) | En plus : le chapitre (317) et le mode. Pas de capture | Changer (317) |
| Créer | « ➕ Nouvelle évaluation » : coller le JSON, « 🔍 Vérifier le format », l'éditeur, « 💾 Enregistrer l'évaluation » (l. 6390, 6587-6606) | Pareil ; le collage garde et vérifie les deux temps, les compétences (au moins trois par compétence), le chapitre et « bonus », avec un message qui cite la question fautive (201 ; 317, 327, 328, 390). Pas de capture | Changer |
| Strict ou partiel | Un choix dans l'éditeur (l. 6672, 6696-6700), **jamais enregistré** : « Enregistrer » écrit le titre, les questions, la version et les dates, pas le mode (l. 6571-6579). Au hub, aucune des 7 évaluations n'a de mode : toutes sont comptées en tout ou rien | Le mode s'enregistre, et se voit dans la liste | Changer (dette 205) |
| Modifier | « ✏️ Modifier » ; une évaluation qui a servi devient « version n+1 » (l. 6411, 6559-6570) | Pareil | Garder |
| Dupliquer | « 📋 Dupliquer » (l. 6413) | Pareil | Garder |
| Supprimer | « 🗑️ » : une confirmation, puis l'effacement définitif (l. 6340-6343, 6414) | En corbeille d'abord | Changer (dette 206) |
| Éditer une question | Énoncé, choix, case des bonnes réponses, ↑ ↓ 🗑, « ➕ Ajouter un choix », « 💡 Explication », « ➕ Ajouter une question » (l. 6693-6764) | Pareil, sans lettres (334) ; en plus, les deux temps (327), les compétences (305-315) et « bonus » (328). Pas de capture | Changer |
| Le niveau d'une question | Des pastilles de couleur, chacune avec son temps (éditeur, l. 6613-6769 ; l. 6536) | Le niveau reste (304), sans temps (327) | Changer (327) |
| Le prompt | « 🤖 Prompt IA » : « 📋 Copier le prompt », « ✏️ Modifier le prompt », « 💾 Enregistrer », « ↩️ Annuler », « 🔄 Restaurer le prompt par défaut » (l. 6483-6499). Au hub, jamais modifié (`qcm/settings/promptIa` vide) | Il s'écrit en dernier, avec toi (62, 123) | Changer |
| La feuille imprimée | « 🖨️ Imprimer » : énoncés, cadres de rédaction, lettres (l. 6412, 6770-6827) ; 7 pages par élève pour la 4e du 09/10 (dette 190) | Les énoncés seuls (119), sans lettres (334) ; le nombre de pages reste à trancher (96). Pas de capture | Changer |

## 3. Pilotage classe, avant la séance

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Choisir la classe et l'évaluation | Deux listes, puis « 🚀 Lancer la session » (l. 7023-7050) | Pareil, avec la durée comptée et les binômes proposés (capture 1 ; 58) | Changer |
| Les binômes | Rien | Proposés d'après le QCM précédent ; tu glisses un nom sur un autre pour échanger (capture 1 ; 323, 72) | Nouveau |
| L'appel | « 📋 Check-in : qui est absent aujourd'hui ? » : « Tout le monde présent », « Annuler », « 🚀 Lancer la session » (l. 7089-7091) | Pareil ; l'absent laisse son binôme à un autre seul (42, 109) ; l'heure de fin s'y règle (capture 2 ; 64) | Changer |
| Le rattrapage | Une évaluation déjà passée est marquée 🔁 et demande une confirmation (l. 7042, 6920) | Pareil, en « rattrapage » ; il ne sert jamais de QCM précédent (335). Pas de capture | Changer (335) |
| Une séance interrompue | « ⚠️ Session interrompue détectée » : « 🔄 Reprendre la session » ou « 🛑 Terminer définitivement » (l. 7007-7008) | Pareil ; à la reprise, le tour recommence au début, voile compris ; « Terminer » écrit l'archive (337). Pas de capture | Changer (337) |
| Les séances passées de la classe | « 📚 Sessions précédentes » : titre, date, état. L'infobulle promet « relancer » et « consulter le bilan classe », mais aucune ligne n'a de bouton (l. 7097-7117) | Chaque ligne ouvre ses résultats. Pas de capture | Retenu (Paul, 603) (dette 207) |

## 4. Pendant la séance, sur ton poste

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Voir les élèves | Une bulle par élève, en couleur ; « 🔍 Légende des couleurs » (l. 8050-8061) | Les 12 tablettes : qui est assis où, qui a coché (captures 8, 13, 16 ; 14, 16) | Changer |
| Le gros bouton | Les boutons d'action côte à côte (l. 7928-7935) | Un gros bouton pour l'action suivante : « ▶️ Lancer Q1 », « ▶️ Lancer Q2 », « 📊 Lancer l'autoévaluation » (captures 8, 18, 25) | Changer |
| La réflexion | Chrono donné par le niveau ; « ✋ Autoriser la réponse » (l. 7862, 7929) | Le temps vient de la question ; « ✋ Autoriser la réponse » coupe la réflexion (capture 10 ; 327) | Changer (327) |
| Les deux tours | Rien (un élève par tablette) | « ⏭️ Tour suivant » coupe le tour 1 ; « 🔒 Clore la question » coupe le tour 2 (captures 13, 16 ; 25, 327) | Nouveau |
| Ajouter du temps | « +5s », « +10s », « +30s » (l. 7940-7942) | Pareil, pour le tour en cours (capture 13 ; 327) | Changer |
| Pause, relancer le chrono | « ⏸️ Pause », « 🔄 Relancer chrono » (l. 7931-7932) | Pareil (captures 10, 13, 16) | Garder |
| La question à venir | « 🔮 À venir » : son énoncé et sa difficulté | Pareil, avec ses deux temps (captures 8 à 18) | Changer (327) |
| Le temps de réponse | La case « ✋ Réponse » (dette 199) | Retirée : il vient de la question (327) | Retirer |
| Les durées des niveaux | « ⚙️ Durées des niveaux », replié sous le pilotage (l. 7131-7217, 7841) | Retirées (327) | Retirer |
| Changer le niveau en direct | Des pastilles sous la question en cours et sous la suivante (l. 7575, 7919, 7957) | Retiré (327) | Retirer |
| Rouvrir pour tous | « 🔓 Rouvrir pour tous » (l. 7933) | Ne rouvre que pour ceux qui n'ont pas répondu, une fois par question (captures 18, 25 ; 331) | Changer (331) |
| Rouvrir pour un seul élève | Un clic sur sa bulle, sans bouton ni indication (l. 7612-7630 ; 147) | **Pas de place sur la maquette.** Un bouton « 🔓 Rouvrir pour un élève », en haut, à côté de « 🚫 Départ d'un élève », qui ne liste que ceux qui n'ont pas répondu (331). Pas de capture | Retenu (Paul, 603) |
| Revenir à une question, en sauter une | « ← Q préc. » relance la question précédente en réflexion, pour toute la classe ; « Q suiv. → » saute à la suivante (l. 7559-7573, 7969-7970) | Absents de la maquette. Revenir rouvre une question à laquelle on a répondu, ce que 331 interdit ; sauter laisse une question sans réponse pour tous | Retenu (Paul, 603) : retirer |
| Départ, retour d'un élève | « 🚫 Départ d'un élève », « ↩️ Retour d'un élève » (l. 7749-7750), absents de la correction (l. 7697-7741) | En haut, pendant toute la séance, correction comprise ; ses questions manquées sortent du total (captures 8 à 37 ; 336, 388) | Changer |
| Terminer | « 🛑 Terminer la session » (l. 7671, 7703, 7751) | Pareil, en haut ; écrit toujours l'archive (337) | Changer (337) |
| L'estimation | « 📊 Lancer l'autoévaluation », puis « 📝 Lancer la correction » (l. 7934-7935, 7686) | Pareil, avec les mots du socle (captures 25 à 27 ; 313, 339) | Changer (313) |

## 5. La correction

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| L'ordre des questions | De la plus ratée à la mieux réussie (l. 7738) | Pareil (capture 28) | Garder |
| La recopie | Rien en classe ; à la maison, « 📝 Saisis tes réponses papier » (l. 3052-3145) | Avant chaque révélation, avec son chrono : vert, orange à la moitié, rouge les 5 dernières secondes (captures 28 à 30 ; 360, 378) | Changer (360) |
| Révéler | « 💡 Révéler la bonne réponse » (l. 7737) | « 🔒 Révéler » reste fermé tant qu'il manque un présent, les noms qui manquent en rouge ; puis « 💡 Révéler » (captures 28, 31 ; 378) | Changer (378) |
| Le Suivi de la feuille | Rien | Après la révélation : « ＋ Trouvée », « recopie juste, tablette fausse », « aucun de ces choix » (captures 31, 34 ; 180, 351) | Nouveau |
| Les feuilles à lire le soir | Rien | « À lire sur les feuilles, ce soir » (captures 31, 34, 39 ; 351, 362) | Nouveau |
| Question suivante, précédente | « Question suivante → », « ← Question précédente » (l. 7736, 7738) | Pareil ; la dernière mène au bilan (capture 37) | Garder |

## 6. La fin de la séance

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Le bilan de la classe | « 🏁 Bilan classe » : « 📊 Distribution », « 🎯 Calibration de l'autoévaluation », « 💡 Questions remarquables », « 👥 Détail par élève », d'après la tablette ; « 🛑 Terminer la session » (l. 7219-7369, 7295) | La répartition de la note, puis par compétence, les feuilles à lire, un tableau par élève (capture 39 ; 383) | Changer |
| La fin de l'heure | Il n'y en a pas : une séance ne finit que par « Terminer la session » (64) | Lancement + 55 min, réglable à l'appel ; à « Terminer », ou 10 min après l'heure de fin, la tablette oublie ses deux élèves et revient à « Combien êtes-vous ? » (captures 2, 40 ; 64) | Nouveau (64) |

## 7. Le téléphone

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Entrer | Le QR de « 📱 QR pilotage » (l. 5338-5367). Son image est fabriquée par un site extérieur, api.qrserver.com, qui reçoit l'adresse ; cette adresse contient `#mode=prof` et ouvre la console sans clé (l. 5342-5343, 2457) | Pareil (Paul, 603) | Garder (dette 208 close) |
| Piloter | Les mêmes gestes qu'au poste, en petit : « 🚀 Lancer Q », « ✋ Autoriser la réponse », « ⏸️ Pause », « 🛑 Clore », « 🔄 Chrono », « +5s / +10s / +30s », « 🔒 Clore la question », « 🔓 Rouvrir », « ← Q préc. », « 📊 Lancer l'autoévaluation », « 📝 Lancer la correction », « 💡 Révéler la bonne réponse », « Question suivante → », « 🛑 Terminer la session » (35 gestes, l. 5574-5737) | Ta télécommande, avec toutes les infos (Paul, 603). Il garde tout ce qu'il montre, et reçoit ce que le nouveau flux ajoute : le tour en cours et les moitiés qui répondent, « ⏭️ Tour suivant », l'heure de fin ; à la correction, le chrono de la recopie, les noms qui n'ont pas recopié en rouge, « 🔒 Révéler » fermé, puis le Suivi de la feuille ; sans « ← Q préc. » (412). Le lancement et les résultats restent sur l'ordinateur (418). Pas de capture | Changer |
| La liste des élèves | Chaque nom, avec la lettre qu'il a cochée (l. 5700-5735). **Dès qu'un élève a répondu, le téléphone devient un écran vide** (l. 5698 ; dette 210) | Sans lettres (334), par tablette. Pas de capture | Changer (334) |
| La fiche d'un élève | Un clic sur son nom : « 🔁 Rouvrir Qn pour cet élève uniquement », même s'il a répondu, sans limite (dette 204) ; « 🚫 Marquer comme parti en cours de séance », dans toutes les phases ; « ↩️ Marquer comme revenu » (l. 5743-5760) | 331 ; le départ, comme au poste (336). Pas de capture | Changer (331) |

## 8. Le tableau (la vue projetée)

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| La question | L'énoncé en grand, le chrono, « n / N ont répondu » (l. 4984-5337) | Pareil | Garder |
| Les choix | Montrés en réponse avec leurs lettres ; en correction, « ✅ Bonne réponse : B, D » (dette 191) | Jamais en réponse ; en correction, après la révélation, sans lettres, les bonnes en vert, et l'explication (93 à 95, 334). Pas de capture | Changer |
| La liste de la classe | Chaque prénom : a répondu, en attente, absent (l. 4946-4982) | Pareil. Pas de capture | Garder |

## 9. Données → Résultats

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| La liste des séances | Toutes les séances, classes confondues ; un clic ouvre le tableau (l. 8141-8259) | Pareil. Pas de capture | Garder |
| Le tableau d'une séance | Lettres de la tablette et lettres « papier », « Score app », « Score papier », « Écart », tri (l. 8260-8456) ; en partiel, il compte en tout ou rien (dette 203) | ✓, ✗ ou ＋ par question, la note et sa maîtrise, une colonne par compétence, « À lire sur la feuille » (capture 41 ; 334, 383) | Changer |
| L'export CSV | « 📥 Export CSV » : lettres, scores, écart (l. 8392) | Le bouton reste (capture 41) ; ce qu'il contient n'est pas cadré. Les colonnes du tableau de la capture 41 | Retenu (Paul, 603) |
| Le PDF notes et compétences | Rien | « 📄 PDF notes et compétences » (capture 41 ; 310, 318) ; sa forme est à te proposer | Nouveau |
| La fiche d'un élève | Ses lettres de la tablette et « papier », la bonne réponse, le scan (l. 8457-8537) | Pour chaque question : ses compétences, sa feuille, sa tablette, la bonne réponse, les points ; ses compétences en bas (capture 42) | Changer |
| Corriger une feuille, fixer une note | Rien | « Que dit la feuille ? » (capture 43 ; 168, 338) | Nouveau |
| Le scan des copies | Dans la fiche : déposer une image de 2 Mo au plus, « 🗑️ Supprimer » (l. 8483, 8522-8527) ; jamais servi | Retiré (115) | Retirer |
| Effacer une séance | « 🗑️ » sur sa ligne : un fichier de sauvegarde se télécharge sur ton poste, puis la séance est effacée (l. 8160-8215, 8246) | En corbeille d'abord | Changer (dette 206) |

## 10. Données → Sauvegarde

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Exporter | « 📥 Exporter snapshot » : un fichier de tout le QCM et des classes (l. 2359-2383, 8750) | Pareil | Garder |
| Importer | « 📤 Importer snapshot » : remplace tout le QCM par le fichier (l. 2403, 8751) | Le QCM d'avant part d'abord en corbeille | Changer (dette 206) |
| Les sessions zombies | « 🧹 Nettoyer les sessions zombies » : un rapport, puis seuls les marqueurs « en cours » sont nettoyés (l. 8620-8726, 8766) | Pareil | Garder |
| L'ancien carnet de classes | « 🧹 Ranger l'ancien carnet de classes » : en corbeille, puis effacé (l. 8728-8740, 8769) ; au hub, `qcm/classes` n'existe plus : il est déjà rangé | Le bouton ne sert plus | Retenu (Paul, 603) : retirer |
| La pondération des niveaux | « ⚖️ Pondération des niveaux » : quatre cases, 1, 2, 3, 4 par défaut (l. 8538-8590, 8776-8780) ; au hub, jamais modifiée | Retirée, l'archive gardée (273 ; dette 192) | Retirer |
| Purger les classes | Renvoie à la console MJPC (l. 8594-8600) ; son infobulle dit « Supprime DÉFINITIVEMENT toutes les classes » (l. 8789) | Le bouton ne fait rien ici | Retenu (Paul, 603) : retirer (dette 207) |
| Purger les évaluations | Deux confirmations, puis l'effacement définitif (l. 8601-8609, 8790) | En corbeille d'abord | Changer (dette 206) |
| Tout purger | Deux confirmations, puis l'effacement définitif de tout le QCM ; l'infobulle dit « (classes, … » alors que les classes restent (l. 8610-8618, 8791) | En corbeille d'abord | Changer (dettes 206, 207) |

## 11. Réglages

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Classes et élèves | « Ouvrir la console MJPC → » (l. 5900-5908) | Pareil | Garder |
| Ce que lisent les élèves | Trois textes modifiables : avant le lancement, avant la correction, à la fin (l. 5772-5836) ; au hub, jamais modifiés (`qcm/textes` vide) | Pareil. Les textes de 393 à 400 restent fixes : ils disent la règle, et le critère de l'éditeur est « ce qui constate reste en dur » (l. 5768) | Garder |
| La version | « ℹ️ Version » : 7.7.1, le socle, « VERSION À COMPLÉTER » (l. 5910-5913) | La version de la livraison | Garder |
| L'aide « Comment l'app fonctionne » | Sept volets (l. 5896, 5914) : 5, 10, 15 et 20 s ; « rien n'enchaîne tout seul » (dette 200) ; le partiel « autant de points qu'elle a de bonnes cases » (vrai aujourd'hui, faux après 273) ; « En mode test, tout va dans un magasin de test » (faux pour 🧪 : partie 12) | Réécrite d'après le cadrage | Changer (dettes 200, 207) |

## 12. Le mode test

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| L'ouvrir | « 🧪 Mode test » : une classe de test, une évaluation « Capitales » avec des lettres et des niveaux, un panneau par élève simulé sous ton pilotage (l. 4599-4822) | Sur le nouveau flux : des tablettes à deux moitiés, l'attestation, la recopie. Pas de capture | Retenu (Paul, 603) |
| Où il écrit | Au hub, sous des noms de test : une classe dans `/classes` (commune à toutes les apps pendant le test), des codes dans `/codes`, l'évaluation et les séances dans `qcm/` ; tout est effacé à la sortie (l. 4615-4680). Rien de réel n'est touché | Pareil | Garder |
| « 🎲 Tous les élèves répondent » | Des réponses au hasard (l. 4697-4760) | Pour les deux moitiés, et pour la recopie | Retenu (Paul, 603) |
| « 📥 Exporter snapshot test », « 📱 QR pilotage », « 🗑️ Sortir et purger » | En haut du mode test (l. 4768-4785) | Pareil | Garder |
| « 👋 Ouvrir le portail élève » | Le vrai écran de connexion de l'élève, avec les codes de test (l. 4567-4597) | Pareil, sans « Choisis ta classe » (333) | Changer (333) |
| Les outils P2 | Clôturer la séance de test, modifier l'évaluation de test, comparer les notes : les vérifications d'un ancien chantier (l. 4423-4566) | Ils ne servent plus | Retenu (Paul, 603) : retirer |

## 13. Le mode d'emploi

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Le mode d'emploi | Neuf volets (l. 6123-6287), presque tous contraires au cadrage : « remplace Plickers » ; « Suivi à la maison : l'élève saisit ses réponses papier […] retrouve son scan » ; le bonus « pour 1-2 questions isolées » ; la feuille avec « lettres des choix » ; les niveaux à 5, 10, 15 et 20 s ; « clique sur son nom pour rouvrir » ; « Score app », « Score papier », « Score officiel » ; « Scan + saisie β maison ». Le volet « Le réseau coupe » parle d'une sauvegarde sur chaque poste : je ne l'ai pas mesurée | Réécrit d'après le cadrage. C'est un texte pour toi seul, sans geste | Changer (dette 207) |

## 14. Côté élève, hors de la séance

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| L'accueil | « 🎓 Mode élève » (l. 2493) | Pareil, puis « Combien êtes-vous ? » (capture 3) | Garder |
| Choisir sa classe | « 🎓 Choisis ta classe » (l. 2576) | Retiré : son code, son prénom et son nom (capture 4 ; 333) | Retirer (333) |
| Le code non enregistré | « Ton code n'est pas encore enregistré. Viens me voir pour qu'on le mette en place. » (l. 2748) | Ta phrase de 400 | Changer (dette 202) |
| « 📊 Mes évaluations » | Un bouton sous l'écran d'attente (l. 2603) : ses évaluations archivées, avec un pourcentage ; un clic ouvre le bilan gardé, calculé sur la tablette (l. 2615-2682) | Le bilan de la capture 38, d'après la feuille, sans pourcentage (324) | Changer (324) |
| « 📊 Tes évaluations passées » | Dans l'écran d'attente : les séances terminées, avec « 📝 Saisie papier à faire » ou « ✅ Saisie papier faite » (l. 2774-2899) | La recopie se fait en classe (360) : il ne reste que « Mes évaluations » | Retenu (Paul, 603) : retirer |
| La saisie papier à la maison | « 📝 Saisis tes réponses papier » : les lettres seules, puis « ✅ Saisie envoyée ! » et un rechargement (l. 3052-3145 ; dette 193) | Remplacée par la recopie en classe (360) | Retenu (Paul, 603) : retirer |
| La page de résultats | « Score officiel », « Score papier », « Score app », « 📷 Ta copie scannée », « 📋 Détail des questions » (l. 2900-3051) | « Mes évaluations » montre le bilan (capture 38) | Retenu (Paul, 603) : retirer |

## 15. Ce qui marche sans geste

| Fonction | Aujourd'hui | Après le cadrage | Verdict |
|---|---|---|---|
| Les versions d'une évaluation | Une évaluation qui a servi devient « version n+1 », visible dans la liste (l. 1994-1995, 6400-6404) | Pareil | Garder |
| L'énoncé figé de chaque séance | À la clôture, la séance garde l'énoncé du jour (l. 2007-2044) | Pareil | Garder |
| L'archive de l'élève | Écrite à la fin de la correction, d'après la tablette (l. 3647) | D'après la feuille, et à chaque « Terminer », quelle que soit la phase (324, 337) | Changer |
| Le mélange des choix | Chaque élève voit son ordre (74) | En réponses multiples, les bonnes réponses du second ne sont jamais aux mêmes places (329) | Changer (329) |
| La présence des tablettes | Chaque appareil signale qu'il est connecté | Visible sur les 12 tablettes (capture 8) | Changer |
| Le déplacement des classes vers le site | Une fois, avec un message (l. 5945-5955) | Pareil | Garder |

---

## 16. Les trouvailles, inscrites au registre

Registre : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/DETTES-QCM-179-184-A-REPORTER.md

205. **Le mode partiel n'est jamais enregistré.** L'éditeur propose le choix, mais « 💾 Enregistrer l'évaluation » écrit le titre, les questions, la version et les dates, pas le mode (l. 6571-6579). Au hub, aucune des 7 évaluations n'a de mode : toutes sont comptées en tout ou rien.

206. **Six gestes effacent sans corbeille** : « 🗑️ » d'une évaluation (l. 6340-6343), l'effacement d'une séance (le fichier de sauvegarde part sur ton poste seulement, l. 8160-8215), « 🗑️ Supprimer » du scan (l. 8483), « Purger les évaluations » et « Tout purger » (l. 8601-8618), « Importer snapshot », qui remplace tout le QCM (l. 2403). Contre ta règle « corbeille d'abord ». La corbeille existe déjà dans l'app : « Ranger l'ancien carnet » s'en sert (l. 8728-8740).

207. **D'autres textes faux, en plus de 200** : le mode d'emploi presque entier (partie 13) ; dans l'aide des Réglages, « En mode test, tout ce qui serait enregistré va dans un magasin de test » (le mode 🧪 écrit au hub) ; l'infobulle de « 📚 Sessions précédentes » (aucun bouton derrière, l. 7097-7117) ; celle de « Purger les classes » (« Supprime DÉFINITIVEMENT », alors que le bouton renvoie à la console MJPC, l. 8789) ; celle de « Tout purger » (« classes », qui restent, l. 8791).

208. **(Close, Paul, 603 : on laisse ainsi.) L'adresse `#mode=prof` ouvre ta console sans code ni clé** (l. 2457). Le QR du téléphone porte cette adresse, et la donne à un site extérieur, api.qrserver.com, pour fabriquer son image (l. 5342-5343). Je ne sais pas si c'est voulu dans l'écosystème.

209. **« 📄 Préparation » et « 📝 Évaluations » montrent la même liste** (l. 5881-5891, 6035-6036).

210. **Tour 603 : le téléphone devient un écran vide dès qu'un élève répond** (l. 5698 : `mode` n'existe pas à cet endroit). Preuve : https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/QCM-TELEPHONE-09-10/README.md

## 17. Ce qui n'a pas encore de capture

Ta règle de 148 : rien ne part au mandat sans sa place visible. Ces écrans changent avec le cadrage et n'ont pas encore de capture :

1. La liste des évaluations, avec le chapitre et le mode.
2. L'éditeur d'une question : les deux temps, les compétences, « bonus », sans lettres.
3. Le collage du JSON et ses messages.
4. La feuille imprimée, énoncés seuls.
5. « 🔓 Rouvrir pour un élève ».
6. La séance interrompue et sa reprise.
7. Le rattrapage.
8. Le téléphone, pendant la séance et pendant la correction.
9. Le tableau, en réponse et en correction.
10. La liste des séances et l'effacement en corbeille.
11. Sauvegarde, sans la pondération, avec la corbeille.
12. Le mode test sur le nouveau flux.
13. « Mes évaluations », côté élève.
14. La fenêtre des sessions en cours.

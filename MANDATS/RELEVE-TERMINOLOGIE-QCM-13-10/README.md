# Relevé de la terminologie du QCM — conscience n°12, 13/10/2026 (tour 716)

Paul, 16:42 : « et oui, le mot, et d'ailleurs LES mots: fais un relevé de la terminologie. »

## Comment c'est relevé

- **Les écrans** : les 169 écrans de la maquette v9 (`LIVRAISONS/CODE-QCM/banc/reference/maquette-v9.json` sur `code-qcm`, le relevé de QCM-4 : le texte, les boutons et les infobulles de chaque écran ; la 8.0.0 est le code de cette maquette), et les 26 écrans de l'app 8.0.0 relevés par QCM-4 pendant l'assemblage de 13:12 (`LIVRAISONS/CODE-QCM/sorties/2026-10-13_1312/releves-branches.json`).
- **Les côtés** : « console » = la console et le téléphone (ce que Paul voit) ; « élèves » = la tablette, l'écran de l'élève et la vue tableau (ce que la classe voit).
- **Le compte** : le nombre d'écrans où le mot paraît au moins une fois, sans accents ni majuscules. Un même texte répété d'écran en écran (une infobulle de la barre du haut) compte une fois par écran.
- **Ce qui n'y est pas** : les écrans que ni la maquette ni le relevé de l'app n'atteignent. Je ne sais pas s'il y en a qui emploient d'autres mots.
- **Rejouer** : `python3 table.py && python3 gen.py` dans ce dossier (le chemin `W` de `corpus.py` pointe vers une copie de `code-qcm`).

## Le papier de l'élève

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| feuille | 94 | 37 | « Pour chaque question, écris ta réponse sur ta feuille, avec les mots du cours. Plusieurs réponses : une par ligne. » (`t-binome`, élèves) |
| copie | 40 | 5 | « Elle peut encore changer, jusqu'à ce que ta copie te soit rendue : ta feuille, tes clics pendant les questions et tes … » (`t-bilan`, élèves) |
| papier | 22 | 0 | « 📄 Séance sur papier » (`c-lancer`, console) |

**Proposition** : 1119 : « feuille » pour le papier, partout ; « copie » seulement dans « Rendre les copies » ; « dupliquer » pour le double d'une évaluation (c'est déjà son bouton, « 📋 Dupliquer ») ; ma maquette devient « 📄 Lire les feuilles ».

## Ce que l'élève fait sur la tablette

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| clic (nom) | 83 | 9 | « À la fin du temps, dis si ta feuille dit la même chose que ton clic. » (`t-attest-2`, élèves) |
| réponse (ta, sa, leur) | 8 | 28 | « Pour chaque question, écris ta réponse sur ta feuille, avec les mots du cours. Plusieurs réponses : une … » (`t-binome`, élèves) |
| choix (nom) | 0 | 0 | — |
| cliquer | 44 | 15 | « Quand « POSE TON STYLO » s'affiche, pose ton stylo et clique ta réponse. Quand c'est le tour de Michel, ne regarde pas. » (`t-attest-1`, élèves) |
| toucher | 115 | 0 | « … la classe de test et la démo ; tout est effacé à la sortie, sauf la démo. Ne touche à aucune vraie classe. » (`c-evals`, console) |
| répondre | 79 | 15 | « Michel, laisse la tablette à Julien pour qu'il réponde sans que tu regardes. » (`t-q1-passage1`, élèves) |

**Proposition** : 1120 : le nom « clic » disparaît partout, on dit « sa réponse sur la tablette » ; le geste reste « cliquer ». « Toucher » n'apparaît que dans « toucher à une classe » (l'infobulle du mode test et celles du panneau des classes), jamais pour le geste.

## Ce que fait le voisin

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| lire / lecture | 115 | 17 | « Tu as lu et compris les consignes le 08/10/2026 à 10:04. » (`t-pret`, élèves) |
| relire / relecture | 33 | 2 | « … ma mère m'a envoyée et dont je connais chaque mot dort dans ma poche : je la relis chaque soir » ? » (`x610-6-coeval-laquelle`, élèves) |
| vérifier | 16 | 11 | « … c'est sérieux : tu n'en signales qu'un, celui dont tu es le plus sûr. Il se vérifie sur ta feuille. » (`t-coeval`, élèves) |

**Constat** : Rien à changer.

## Celui qui lit

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| voisin | 59 | 5 | « 📄 TEMPS POUR LIRE LA FEUILLE DU VOISIN » (`t-corr-q2-lecture`, élèves) |
| binôme | 90 | 3 | « Ton binôme : DUVERNAY Michel » (`t-binome`, élèves) |
| camarade | 2 | 1 | « Question 6 · écris une phrase DPP + PSR + FPP : P.I sur un camarade dans les tranchées. Que contient ta phrase ? » (`x610-6-coeval-laquelle`, élèves) |
| lecteur | 12 | 0 | « Contrôler sa compréhension, devenir un lecteur autonome · Q1, Q2, Q3 » (`c-bilan`, console) |
| partenaire | 0 | 0 | — |

**Proposition** : 1121 : « binôme » pour la paire (la grille, « Binômes proposés »), le prénom ou « ton voisin » pour la personne. « Lecteur » n'apparaît que dans l'intitulé d'une compétence (« devenir un lecteur autonome »).

## Ce que l'élève dit de sa feuille

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| « dire si sa feuille… » | 58 | 2 | « À la fin du temps, dis si ta feuille dit la même chose que ton clic. » (`t-attest-2`, élèves) |
| « la même chose que son clic » | 40 | 5 | « À la fin du temps, dis si ta feuille dit la même chose que ton clic. » (`t-attest-2`, élèves) |
| « disait son clic » | 28 | 0 | « TESSIER Anna — Q2 : a dit que sa feuille disait son clic, Madrid ; Rayan y a lu Madrid et Genève » (`c-corr-q2-apres`, console) |
| déclarer | 0 | 0 | — |

**Proposition** : 1105, 1115 et 1116 : la phrase de Paul (« Tom, tu as répondu Venise sur la tablette : avais-tu bien écrit … sur ta feuille ? »), et les lignes du soir, de 1111 à 1114.

## La tablette partagée

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| moitié | 92 | 0 | « … du chapitre ; la question 11 porte « longueur assumée » : elle passe, et sa moitié défilera seule. » (`c-collage`, console) |
| tablette | 117 | 20 | « Combien êtes-vous sur cette tablette ? » (`t-combien`, élèves) |
| place | 25 | 0 | « … 1, moitié de gauche ; glisse son nom sur un autre pour échanger leurs places. » (`c-lancer`, console) |

**Constat** : Rien à changer : « moitié » n'est jamais vu par l'élève.

## Ce qu'on fait passer

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| évaluation | 118 | 56 | « 📊 Mes évaluations » (`t-binome`, élèves) |
| éval | 25 | 5 | « 3e- éval 1 Analyse logique - Construire une phrase complexe » (`x610-1-b-julien`, élèves) |
| QCM | 119 | 2 | « QCM — Le jambon-beurre » (`e-mes-evals`, élèves) |
| séance | 116 | 2 | « 3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3) » (`e-mes-evals`, élèves) |
| interro | 22 | 2 | « 3e Chapitre 1 — Poésie et peinture au XIXème siècle · Interro de cours (séance 3) » (`e-mes-evals`, élèves) |
| contrôle | 1 | 0 | « Contrôle : 25 élèves · 24 notes · 1 absent · 24 commentaires. » (`x632-pdf`, console) |
| devoir | 1 | 0 | « … Une ligne par élève, dans l'ordre alphabétique. « Note » : la note sur 20 du devoir. Chaque colonne de compétence : le niveau de maîtrise de l'élève, en … » (`x632-pdf`, console) |

**Proposition** : 1124 : « évaluation » partout, jamais « éval » ; « séance » pour une passation avec une classe.

## Les moments

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| réflexion | 61 | 6 | « TEMPS DE RÉFLEXION » (`t-demo-q`, élèves) |
| réponse (le moment) | 79 | 14 | « TEMPS DE RÉPONSE » (`t-q1-tour1`, élèves) |
| correction | 117 | 29 | « Écris lisiblement : Tom lira ta feuille à la correction. » (`t-rejoins`, élèves) |
| co-évaluation | 72 | 0 | « … et seconde attestation 3 min ; correction 3 min (1 min par question) ; co-évaluation et bilan 2 min. » (`c-lancer`, console) |
| bilan | 88 | 8 | « ⏳ Attends ton bilan… » (`t-coeval-ecrit`, élèves) |
| révéler | 15 | 5 | « 👀 Écoute le prof — la correction sera révélée. » (`t-corr-q2-lecture`, élèves) |
| recopie | 0 | 0 | — |

**Constat** : Rien à changer ; « recopie » n'est vu nulle part.

## Ce qu'on tire d'une question

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| écarter | 45 | 0 | « ❌ Écarter » (`c-pret`, console) |
| annuler (une question) | 4 | 0 | « ⚠️ Annuler la question 2 ? » (`c-annuler`, console) |
| neutraliser | 0 | 0 | — |

**Constat** : Rien à changer : « écarter » (pas encore posée) et « annuler » (posée, puis annulée) sont deux gestes différents (cadrage, 442).

## Redonner du temps

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| rouvrir | 69 | 0 | « 🔓 Rouvrir » (`c-lancer`, console) |
| 1er / 2e tour | 30 | 1 | « 1er tour » (`b-reponse`, élèves) |
| tour suivant | 21 | 0 | « ⏭️ Tour suivant » (`c-q1-tour1`, console) |
| relancer | 26 | 0 | « 🔄 Relancer chrono » (`c-q1-reflexion`, console) |

**Constat** : Rien à changer : « 1er tour » et « 2e tour » sont les deux moitiés ; « rouvrir » et « relancer le chrono » ont chacun un seul sens.

## L'engagement avant

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| attestation | 25 | 0 | « … l'heure de fin se règle, puis la séance s'ouvre et les tablettes passent à l'attestation. Les binômes restent ceux de la grille. » (`c-lancer`, console) |
| « je m'engage » | 0 | 0 | — |

**Proposition** : 1124 : « les consignes » sur la console ; l'élève lit « Avant de commencer » et « Avant la correction », jamais « attestation » (0 écran côté élèves).

## Le désaccord

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| alerte | 17 | 0 | « … : chacun dit s'il pense que son voisin a bien lu sa feuille ; un désaccord t'alerte aussitôt. » (`c-mode-emploi`, console) |
| désaccord | 1 | 5 | « ☝️ Un désaccord, c'est sérieux : tu n'en signales qu'un, celui dont tu es le plus … » (`t-coeval`, élèves) |
| trancher | 22 | 1 | « Question 6 · écris une phrase DPP + PSR + FPP : P.I sur un camarade dans les tranchées. Que contient ta phrase ? » (`x610-6-coeval-laquelle`, élèves) |
| signaler | 4 | 5 | « ☝️ Un désaccord, c'est sérieux : tu n'en signales qu'un, celui dont tu es le plus sûr. Il se vérifie sur ta feuille. » (`t-coeval`, élèves) |
| litige | 0 | 0 | — |
| contester | 1 | 0 | « Données → Résultats : les notes, les compétences, les feuilles à lire (lecture contestée, « aucun de ces choix », « Non » au clic). « Que dit la feuille ? » … » (`c-mode-emploi`, console) |

**Proposition** : 1123 : « désaccord » des deux côtés (l'élève le lit déjà : « ☝️ Un désaccord, c'est sérieux »), et « réglé » au lieu de « tranché ».

## Le soir

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| à lire | 63 | 0 | « Ce que ferait « 🗑️ Mettre à la corbeille », à lire avant de choisir : « Elle part dans la corbeille du site, gardée … » (`c-eval-corbeille`, console) |
| à relire | 24 | 0 | « ⚠️ À relire » (`c-corr-q2-apres`, console) |
| à vérifier | 0 | 0 | — |

**Proposition** : 1122 : « à lire » partout (« ⚠️ À relire » et « 📌 Je relis ce soir » disent le même geste que « 📌 À lire sur les feuilles, ce soir »).

## La note

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| note | 120 | 8 | « Ta note, c'est ta feuille. Chaque question vaut 1 point. » (`t-attest-2`, élèves) |
| point(s) | 51 | 32 | « Ta note, c'est ta feuille. Chaque question vaut 1 point. » (`t-attest-2`, élèves) |
| score | 1 | 0 | « Lance la phase d'autoévaluation : les élèves estiment leur score avant la correction. » (`c-q3-close`, console) |
| résultat(s) | 106 | 3 | « … et tu en as effectivement obtenu 2 sur 3. Ton estimation correspond à ton vrai résultat. » (`t-bilan`, élèves) |

**Constat** : « Score » (1 écran, l'infobulle de l'estimation) devient « note ».

## Donner les résultats

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| rendre (les copies) | 45 | 5 | « Elle peut encore changer, jusqu'à ce que ta copie te soit rendue : ta feuille, tes clics pendant les questions et tes clics à la … » (`t-bilan`, élèves) |
| publier | 6 | 0 | « publiée » (`c-seances`, console) |
| masquer | 21 | 0 | « … là où elle s'était terminée, après une confirmation. Ses copies rendues sont masquées jusqu'au prochain « Rendre les copies ». » (`c-lancer`, console) |

**Constat** : Rien à changer : « publiée » est la coche de « Mes évaluations », « masquées » l'état des copies rendues.

## Le professeur, vu par l'élève

| Mot | Écrans console | Écrans élèves | Exemple |
| --- | ---: | ---: | --- |
| professeur / prof | 119 | 5 | « 👀 Écoute le prof — la correction sera révélée. » (`t-corr-q2-lecture`, élèves) |
| M. Meney | 0 | 0 | — |

**Constat** : Rien à changer.

## Les phrases abstraites que Paul a relevées (16:19)

« disait son clic » : 28 écrans de la console, aucun côté élèves. « la même chose que son clic » : 40 écrans de la console, 5 côté élèves. « dire si sa feuille… » : 58 écrans de la console, 2 côté élèves. Les lignes à lire du soir viennent d'un seul endroit du code (`S.aLireSeance`, `live/base.js` l. 368-399) ; les infobulles des cartes, de `c3-bulles.js` (l. 34, 49-51) ; la question de l'élève, de `c3-tablettes.js` (l. 386).


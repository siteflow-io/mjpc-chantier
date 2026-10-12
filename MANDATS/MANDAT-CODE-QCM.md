> **Remplacé le 12/10 à 14:10 (tour 672) par les quatre mandats de `MANDATS/CODE-QCM/` (Paul : « tu me fais 4 mandats pour 4 exécutants différents »). Ne pas l'appliquer.**

# MANDAT DE CODE — LE QCM DE LA MAQUETTE, EN CLASSE LE 13/10 AU MATIN

*Écrit par la conscience n°12 le 12/10/2026 (tour 670), sur l'ordre de Paul, à 13:44 : « je n'ai qu'un objectif: que demain matin à 10h30 maximum, l'app qcm tourne avec tous les attributs de la maquette, tous. il faut que tu arrives à trouver une solution. » Et, à 13:28 : « je veux que demain, le qcm que je ferai soit celui de la maquette. C'est pour ça qu'on travaille sur la maquette. »*

*Il s'adresse à l'exécutant de la maquette complète du QCM, dans la même session cloud, juste après la livraison de la v9 : c'est lui qui connaît le mieux la maquette. Dépôt du sas `siteflow-io/mjpc-chantier`.*

*Restent en vigueur : le protocole maquette (`PROTOCOLE-MAQUETTE.md` de la production, §0 et §6 : « la maquette devient le noyau du mandat : l'exécutant part de son gabarit, pas d'une page blanche ; il y branche ce qu'elle simule »), le protocole de l'audit (https://github.com/siteflow-io/mjpc-chantier/blob/main/PROTOCOLE-AUDIT-12-10.md), et tous les interdits du mandat de la maquette et de ses compléments.*

---

## −1. D'abord, la v9, au plus court

Tu es en train de finir le complément 4 et son avenant. Pour laisser la nuit au code : tu finis les corrections en cours (étape B), tu fais passer à zéro ton banc sur les scènes et les contrôles de la conscience (`AUDITS/CONTROLES-QCM/controles.js`, après `git merge origin/main`), tu livres la v9 (le fichier, son md5, le README en quelques lignes, `DEFAUTS.md`), sans le reste de l'étape C. Puis tu enchaînes ici, sans t'arrêter : tu crées la branche `code-qcm` depuis `maquette-qcm`.

---

## 0. Ce que ça change pour la classe

Demain matin, Paul fait passer à une classe de 4e « 4e- Chapitre 1 - Paris à la barre et analyse logique », réduite à 11 questions, avec le QCM que la maquette montre : les tablettes partagées en deux moitiés, les deux tours, B, l'estimation, les deux attestations, la correction par la lecture de la feuille du voisin, « Trouvée au dernier moment », le point d'autonomie, la co-évaluation, le bilan, puis le soir, les résultats, le PDF et les copies rendues. Il pilote depuis sa console et son téléphone, la classe voit le tableau.

L'app doit être en ligne **avant 10:30**. La conscience l'audite à partir de 07:00 ; Paul la met en ligne si l'audit va. Sinon, il fait cours avec la version d'aujourd'hui.

**La maquette n'a aucun lien avec la base** (zéro appel) : chaque écran se calcule depuis un scénario écrit d'avance (`src/scenario.js`, l'objet `SCN`, le moment courant `MO()` / `MOM()`), et un clic saute à l'écran suivant (`data-va`, `versScene`). Ton travail est de **brancher la maquette sur la vraie séance** : ses écrans restent ceux que Paul a validés ; ce qu'ils lisent vient de la base ; ce que font leurs gestes s'écrit dans la base et arrive à toutes les pages ouvertes.

---

## 1. Qui tu es, ce que tu ne fais jamais

Tu es **l'exécutant du code du QCM**. Tu fais tout d'une traite, sans t'arrêter et sans rien demander, et tu pousses une sauvegarde à la fin de chaque étape. Tu ne fais jamais :
1. écrire au vrai hub (`mjpc-hub`), ni toucher à la production (`siteflow-io/monsieurjaipascompris`) : tu travailles sur la branche `code-qcm` du sas et tu testes sur le faux hub ; c'est la conscience qui met en ligne ;
2. une phrase vue par l'élève que Paul n'a pas donnée : elles sont toutes dans la maquette (et la 7.7.1) ; tu les reprends mot pour mot ;
3. décider seul d'un comportement : il est dans la maquette validée, ses compléments et le cadrage (`MANDATS/CADRAGE-QCM.md`) ;
4. redessiner les écrans « à ta manière » : tu reprends les composants de la maquette tels quels, tu ne changes que d'où ils lisent et ce que font leurs gestes ;
5. une écriture qui casse les données d'avant : les séances, évaluations et résultats déjà au hub, au format de la 7.7.1, restent lisibles sans recalcul (cadrage, point 742) ;
6. un service payant, une IA dans l'app, une boîte système, un rechargement nécessaire (règle du 04/10 : chaque donnée affichée est abonnée à sa source ; un redessin n'efface jamais une saisie ni un menu ouvert).

---

## 2. Le point de départ

1. **La maquette** : `MANDATS/MAQUETTE-QCM-COMPLETE/` sur ta branche, ses sources `src/` et `build.py`, dans l'état de la v9.
2. **L'app d'aujourd'hui** : `evaluation-qcm.html` de la production (7.7.1, md5 `ecae65624855a1a877708986a8e984e5`), pour ce que la maquette ne simule pas et qui existe déjà : la configuration Firebase, `DB_ROOT = "qcm"`, les chemins (`qcm/evaluations`, `qcm/sessions`, `qcm/sessionActive`, `qcm/presence`, `qcm/settings`, `classes`, `codes`, `mjpcProfils`), la connexion de l'élève par son code, l'entrée du professeur, les adresses (`?mode=prof`, `?mode=prof&view=board`, `?mode=prof&view=phone`, `?mode=eleve`, `qr`), l'écriture du profil MJPC de l'élève, le snapshot, la purge, le mode test.
3. **Le faux hub** : `AUDITS/QCM-MODE-TEST-09-10/banc/` (`server.js`, `fakefb.js`, `tree.js`) : il remplace le SDK Firebase et partage la base entre toutes les pages ouvertes, par WebSocket. C'est ton terrain d'essai : une console, des tablettes, un téléphone et un tableau, chacun dans sa page, sur la même base.

---

## 3. Ce que tu construis

Un seul fichier, `evaluation-qcm.staging.html`, assemblé par un `build.py` (comme la maquette), qui :
1. **garde les écrans de la maquette**, sans le sommaire ⚙ ni les scènes : une page s'ouvre par les adresses de la 7.7.1 et montre l'écran de son appareil au moment réel de la séance ;
2. **remplace le scénario par la séance réelle** : une couche qui offre aux écrans ce que `SCN` leur offre (la classe, les binômes et les tablettes, les réponses de chaque élève à chaque tour, les « Oui / Non » de B, les lectures du voisin, la co-évaluation, les points d'autonomie, les estimations, les attestations, les dates), lue dans la base et abonnée ; le moment courant (`MO()`) devient l'état de la séance écrit dans la base (la phase, la question, le tour, le côté) ;
3. **fait des gestes des écritures** : chaque geste qui, dans la maquette, sautait à une autre scène écrit dans la base ce qu'il fait (lancer, autoriser la réponse, tour suivant, clore, révéler, retirer le point, trancher…), et toutes les pages le voient sans rechargement ; les fenêtres et les fiches s'ouvrent sur place, comme dans la maquette ;
4. **lit ce que MJPC écrit** : la classe et ses élèves (`classes`), les codes (`codes`), les exclusions (`classes/<classe>/exclusions` : aucune aujourd'hui, la liste est vide), les libellés élève des compétences (`taxonomie/competences/<code>/libelleEleve`, le même nom que pour les notions ; c'est la conscience qui les écrit au hub, pas toi) ;
5. **garde les données d'avant** : une séance de la 7.7.1 s'affiche dans « Résultats » avec ce qu'elle a.

Les nouvelles données (tours, B, lectures, co-évaluation, autonomie, attestations, état de la séance) vont sous `qcm/sessions/<id>/…` ; tu les décris dans le README, chemin par chemin.

---

## 4. Les étapes, dans l'ordre de demain

Chaque étape finit par son banc, à zéro défaut, puis un commit poussé sur `code-qcm`. **L'ordre est celui de ce dont Paul a besoin demain** : si le temps manque, ce qui est poussé doit déjà servir la classe.

| Étape | Ce qu'elle fait | Son banc (§5) |
| --- | --- | --- |
| **A — la séance jusqu'à la fin de la correction** | La couche de la séance réelle ; le lancement, l'appel et les binômes, l'entrée sur les tablettes partagées (code, « 1 élève » / « 2 élèves »), la première attestation ; les questions, leurs deux tours, la réflexion et la réponse avec leurs boutons rapides, B ; écarter, annuler, rouvrir, départ et retour d'un élève, finir à une autre heure et reprendre ; l'estimation, la seconde attestation ; la correction dans l'ordre des plus ratées, la lecture de la feuille du voisin, « Révéler », « Trouvée au dernier moment », le point d'autonomie ; sur la console, le téléphone et le tableau. | L'heure jouée de l'appel à la fin de la correction, par le geste, sur une console, 3 tablettes, un téléphone et un tableau ; les contrôles de la conscience pour l'app. |
| **B — la fin de l'heure** | La co-évaluation, son alerte et ce qui la tranche ; « Afficher leur bilan aux élèves », le bilan de chacun, le bilan imprimable ; le bilan de classe ; « Mes évaluations ». | Le même, jusqu'au bilan. |
| **C — le soir** | « Résultats » rangé par niveau ; le tableau de chaque séance ; la fiche d'un élève ; « À lire sur les feuilles » et « Que dit la feuille ? » ; le PDF de chaque séance ; rendre ou masquer les copies ; la corbeille. | La soirée jouée par le geste, après l'heure de A et B. |
| **D — le reste de la maquette** | L'éditeur (chapitre, compétences, « ce qu'elle vérifie », les deux temps, le collage du JSON), les listes rangées par niveau, les réglages et le prompt, la démo permanente, la séance sur papier, le rattrapage, le mode test (la même chose que le réel), la sauvegarde. | Chaque écran de la maquette atteint par le geste dans l'app. |

**À 06:30 au plus tard**, tu pousses et tu livres, même si D n'est pas fini : chaque étape livrée est complète et sans défaut ; une étape non finie n'est pas dans le fichier livré, et le README le dit. Tu t'arrêtes alors, une seule fois.

---

## 5. Les bancs

1. **Un banc unique**, par le geste, dans Chromium, sur le faux hub, avec plusieurs pages à la fois : un geste dans une page se voit dans les autres sans rechargement ; un redessin n'efface jamais une saisie en cours. Il tourne en **moins de 20 minutes** : tu mesures sa durée et tu la mets dans sa sortie.
2. **La fidélité à la maquette** : pour chaque scène de la maquette que l'étape couvre, l'app, amenée par le geste au même moment avec les mêmes données (la classe 3 ESSAI et les réponses du scénario, chargées dans le faux hub), montre le même écran : même texte, aux données près, mêmes gestes, mêmes infobulles. Chaque écart est un défaut, ou il est nommé un par un dans `banc/ecarts-maquette.json`, avec sa raison.
3. **Les contrôles de la conscience pour l'app** : `AUDITS/CONTROLES-QCM-APP/` sur `main` (fais `git merge origin/main` au début de chaque étape pour les avoir) ; tu les fais passer sans les modifier ; leurs md5 sont dans leur `EMPREINTES.md5`. S'ils ne sont pas encore là au début d'une étape, tu continues et tu les fais passer à l'étape suivante.
4. **Les données d'avant** : une séance et une évaluation au format de la 7.7.1, posées dans le faux hub, s'ouvrent dans « Résultats » sans erreur.

---

## 6. La livraison

Sur la branche `code-qcm`, dans `LIVRAISONS/CODE-QCM/` : `evaluation-qcm.staging.html` et son md5, ses sources et `build.py`, le banc et ses sorties (avec sa durée), les captures de l'heure (console, tablette, téléphone, tableau, à chaque phase), et le README : les étapes livrées, les chemins de la base, les écarts nommés avec la maquette, ce qui n'est pas livré. Tu ne fusionnes rien dans `main` et tu ne touches pas à la production.

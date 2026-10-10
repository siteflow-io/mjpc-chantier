# MANDAT — LA MAQUETTE COMPLÈTE DU QCM, À DEUX PAR TABLETTE, POUR LA VALIDATION DE PAUL

*Écrit par la conscience n°12 le 10/10/2026 (tour 633), sur l'ordre de Paul : « Je suis à 93 pourcent d'utilisation hebdo, donc la maquette devra être faite par un claude code qui tournera avec mes crédits » (09:14) ; « VOilà, c'est bon. On peut lancer. » (09:58). Pour un exécutant en session cloud de Claude Code, dans le dépôt du sas `siteflow-io/mjpc-chantier`.*

---

## 0. Ce que ça change pour la classe

Paul (M. Meney, professeur de français au collège) fait passer ses évaluations QCM en classe, **deux élèves par tablette, une moitié d'écran chacun**. Chaque élève écrit d'abord sa réponse en entier sur sa feuille, puis clique sur la tablette ; à la correction, il recopie ce que dit sa feuille, et c'est **la feuille qui fait la note**. Le voisin lit la feuille de l'autre, chacun dit si l'autre l'a bien lue, et Paul tranche les désaccords sur sa console et son téléphone. Le soir, Paul relit, rend les copies, et sort un PDF « notes et compétences » que son extension Claude entre dans École Directe.

Tout cela est **cadré** (tours 1 à 632 du cadrage, 658 points). Il n'en existe que des morceaux de maquette, faits à des moments différents. **Ta maquette est l'image exacte de ce que le code fera** : Paul la valide écran par écran, sur captures, avant qu'une seule ligne de l'app ne soit écrite. Ensuite, le mandat de code partira d'elle (protocole maquette, §0 et §6). Une maquette fausse ou incomplète, c'est du code faux.

---

## 1. Qui tu es, ce que tu ne fais jamais

Tu es **l'exécutant du mandat « Maquette complète du QCM »**. La conscience n°12 (en chat avec Paul) a écrit ce mandat ; elle auditera chaque livraison.

Tu ne fais **jamais** :
1. écrire sur `main` du sas : tu pousses **une branche par livraison**, `maquette-qcm/L1`, `maquette-qcm/L2`… ;
2. écrire dans la production (`siteflow-io/monsieurjaipascompris`) : tu la clones **en lecture** ;
3. lire ou écrire le hub Firebase réel : la maquette n'a **aucun réseau** et **aucune écriture** (protocole maquette, §2 et §7) ; le seul serveur permis est le faux hub du banc, en local ;
4. mettre un jeton, une clé ou une adresse de dépôt dans un fichier ;
5. employer un service ou une API payante, ou une IA dans la maquette ;
6. **écrire une phrase vue par l'élève que Paul n'a pas donnée**. Toutes les phrases d'élève sont dans le cadrage (et dans les maquettes existantes, qui les reprennent). S'il en manque une, tu ne l'inventes pas : tu poses à sa place, en rouge, `[TROU — phrase à donner par Paul : <ce qu'elle doit dire>]`, et tu la listes dans ta livraison (§7) ;
7. combler seul un trou de comportement : même règle, `[TROU — à trancher par Paul : …]` ;
8. ajouter à la maquette une fonction qui n'est pas cadrée, ou refaire autrement une fonction qui existe déjà dans l'app (règle du 03/10 : une maquette part de l'existant) ;
9. utiliser de vrais élèves : la classe inventée « 3 ESSAI » (maquette) et les 30 élèves de la classe de test (mode test) suffisent ;
10. t'arrêter en plein milieu d'une livraison : une livraison commencée se termine (Paul, 05/10). Tu t'arrêtes **à la fin de chaque livraison**, et tu attends « continuer ».

Dans les textes vus par l'élève, les règles permanentes de Paul s'appliquent : « clique », jamais « touche » ; jamais « recopie » ni « sanction » côté élève ; jamais « va voir ton professeur » (en classe, l'élève lève la main) ; jamais l'intitulé officiel d'une compétence, mais son libellé élève (points 636 à 640) ; aucun terme technique ; rien qui mette en cause le professeur. Côté console, chaque geste porte son infobulle, écrite pour Paul : ce que le geste fait et ce qu'il coûte.

---

## 2. À lire d'abord, en entier, dans cet ordre

Au sas (ce dépôt) :
1. `MANDATS/CADRAGE-QCM.md` — d'abord la **ligne d'état** (ligne 6), qui résume chaque tour ; puis **tous les points**, dans l'ordre. Les sections des tours 563 à 632 sont les décisions les plus récentes ; une décision plus récente remplace une plus ancienne (la ligne d'état le dit). L'archive des anciennes lignes d'état est en fin de fichier : elle ne fait plus foi.
2. `MANDATS/MAQUETTE-QCM-FLUX/README.md` — les captures 1 à 66 (tour 603), puis 610-1 à 610-9, 620-1 à 620-3, 624 à 632, chacune avec sa phrase.
3. `AUDITS/QCM-MODE-TEST-09-10/README.md` — le mode test de la 7.7.1, mesuré au banc.
4. `MANDATS/PROMPT-QCM-CREATION/README.md` (le prompt), `MANDATS/LIBELLES-ELEVE-COMPETENCES/README.md` (les 28 libellés élève), `MANDATS/EN-TETES-APPS-BINOMES/README.md` (les exclusions, pour les autres apps), `MANDATS/INVENTAIRE-QCM-TOUT-VISIBLE.md` (95 fonctions, chacune a sa place visible), `MANDATS/DETTES-QCM-179-184-A-REPORTER.md` (dettes 179 à 211).

Dans la production (clone en lecture, `main` à `d873f69` le 10/10) — vérifie les md5 avant tout :

| Fichier | md5 au 10/10/2026 | Pourquoi |
| --- | --- | --- |
| `PROTOCOLE-MAQUETTE.md` | `cea75531c1caf46e566ef45b5a9f3d17` | **les règles de toute maquette** : à appliquer à la lettre |
| `evaluation-qcm.html` (7.7.1) | `ecae65624855a1a877708986a8e984e5` | l'existant du QCM : ses écrans, son CSS, ses mots |
| `index.html` (MJPC) | `ac792b28f40d3a0510e725fc4a6b6985` | l'existant de la console MJPC : la fiche de classe et ses aménagements, l'éditeur de taxonomie du panneau prof |
| `correction_dictee.html` | `9d5dcfb612a70a8182689566b1fe23c5` | le modèle du « Bilan général » (`generateBilan`, sa carte), et de « publier / rendre les copies » |
| `docs/MJPC6-DETTES.md`, `docs/MJPC6-journal.md` | — | les pièges déjà payés (protocole maquette, §1.3) |

Ta première livraison commence par la liste de ce que tu as lu, avec les md5.

---

## 3. Le point de départ : l'existant

Dans `MANDATS/MAQUETTE-QCM-FLUX/maquette/` :

| Morceau | Ce qu'il contient | Assemblé par | Captures |
| --- | --- | --- | --- |
| `maquette.js` + `maquette2.js` + `maquette.css`, sur `qcm.css` (le CSS de la 7.7.1, tel quel) et React 17 local | les 66 scènes du flux, du lancement au bilan, plus les écrans hors flux et le téléphone (état du tour 603) | `build.py` → `maquette.html` | `capture.js` → `captures/01` à `66` |
| `maquette610.js` / `.css`, `ev3e.js` | B et A contre le réflexe du clic, les deux attestations, la co-évaluation, l'alerte et le cas ambigu, sur la vraie évaluation de 3e (`ev3e.js`) | `build610.py` | `captures-610/` |
| `maquette620.js` / `.css` | le mode test, la même chose que le réel | `build620.py` | `captures-620/` |
| `maquette626.js` à `maquette628.js`, `com632.js`, `libelles_eleve.json` | le « Bilan général » dans la fiche, le bilan de l'élève qui finit par « 📝 Bilan », l'éditeur avec « 🎯 Ce qu'elle vérifie », les libellés élève ; **`com632.js` est la version finale du commentaire** | `build626.py` à `build628.py` | `captures-626/` à `628/` |
| `../pdf-632/gen632.js` | **la version finale du PDF « notes et compétences »** (Chromium, A4 paysage, en texte) | `node gen632.js` | `pdf-632/` |

Le faux hub du banc (`AUDITS/QCM-MODE-TEST-09-10/banc/` : `server.js`, `fakefb.js`, `tree.js`, la fausse classe, les évaluations) sert la vraie 7.7.1 dans Chromium : copie `evaluation-qcm.html` de la production à côté de `server.js` (ou donne `APP_FILE`), `npm install`, puis joue l'existant. Chromium : `/opt/pw-browsers/chromium` s'il existe, sinon celui de Playwright.

Ce que tu fais de ces morceaux : **une seule maquette**, un fichier HTML autonome `maquette-qcm-vN.html` (nom versionné, md5 dans la livraison), sans réseau, qui contient toutes les scènes **dans l'ordre de la séance**, chacune ouvrable par `#scene=ID`, avec un sommaire derrière un bouton ⚙ « Scènes de la maquette » (seul écran de simulation permis, protocole §2). Chaque scène est l'écran entier, tel que le code le montrera. Ce que la maquette simule (le temps qui passe, les autres tablettes, le hub) est **déclaré** dans la livraison.

Quand un écran existe déjà dans la 7.7.1, ta scène part de lui (même CSS, mêmes mots, mêmes boutons) : tu n'y ajoutes que ce que le cadrage change. Quand il n'existe pas, tu pars de l'écran voisin le plus proche, et tu le dis.

---

## 4. Ce qui a changé depuis la dernière maquette entière (tour 603)

Les 66 captures datent du tour 603. Paul a relu jusqu'au tour 608, et le cadrage a continué jusqu'au tour 632. **Tout point retenu qui a un effet visible doit avoir sa place dans une scène** (règle de Paul : « une fonctionnalité = un visuel »). La liste ci-dessous est ta liste de contrôle ; **le cadrage fait foi** quand elle est trop courte. Les numéros sont ceux du cadrage.

| Tours | Points | Ce qui doit se voir |
| --- | --- | --- |
| 604 à 606 | 427 à 451 | les temps de réflexion et de réponse modifiables en direct, avec leurs boutons rapides, et la fin prévue (427, 428) ; écarter une question avec garde et retour (429, 441) ; annuler une question déjà posée, marquée autrement qu'une question écartée (442) ; « Pose ton stylo, Julien. Tu es prêt ? À toi dans 3 secondes », le stylo, l'élève toujours nommé (431) ; le point d'autonomie : « ⛔ Retirer le point d'autonomie » et « ↩️ Rendre », à la console, au téléphone et dans la fiche (436, 606) ; « Trouvée au dernier moment » qui ne se confond plus avec le juste (439) ; l'estimation (444) ; la phrase sous chaque question (450) ; les attestations (447, 451) ; côté élève, « compétences atteintes / non atteintes » |
| 607 à 609 | 453 à 493 | le ✓ orange (473, 484) ; « 🏁 Afficher leur bilan aux élèves » (455) ; la note provisoire et sa phrase (456, 474) ; tous les cas de la relecture (457 à 462) ; la garde de longueur et le défilement d'une moitié en dernier recours (464) ; les listes rangées, avec un tri (465) ; « Copier les erreurs pour l'instance de création d'éval » (466, 481) ; le flux papier seul par « ▶️ Reprendre » (467, 491) ; la reprise d'une séance à une autre heure (469) ; le mode test sans faux (470) ; publier et rendre les copies, comme dans la dictée (471) ; « aucun de ces choix » vaut 0 (477, 490) ; la seconde attestation avec la motivation de Paul (485) |
| 610 à 616 | 494 à 546 | B et A contre le réflexe du clic, « Je ne suis pas sûr » retiré, les attestations courtes à une coche par ligne, la co-évaluation de la lecture, l'alerte en tableau, les quatre arbitrages et « ⛔ » à l'un, à l'autre, aux deux, le cas ambigu : **les 9 scènes x610 entrent dans le flux, à leur place**, et les scènes qu'elles remplacent sortent |
| 617 et 618 | 549 à 564 | chaque ligne d'attestation n'apparaît qu'après la précédente (549) ; la démo permanente, jouée sur toutes les tablettes, qui ne compte jamais, avec son bandeau (550 à 557) ; l'identification avec les vrais codes (558) |
| 619 et 620 | 566 à 577 | le mode test, la même chose que le réel, plus six ajouts : **les 3 scènes x620 entrent dans le flux** ; la capture 64 sort |
| 622 et 623 | 584 à 599 | les exclusions dans la console MJPC, sur la fiche de la classe, à côté des aménagements : « 🚫 Jamais avec… », au plus 3 par élève, la quatrième refusée avec la raison (585, 590) ; les binômes formés d'abord par les exclusions, puis par la règle du QCM (587, 594) ; quand un élève entre son code, l'autre moitié nomme son binôme, et aucun élève ne voit rien des exclusions (594) ; le rattrapage suit la même règle (595) |
| 624 à 632 | 600 à 658 | « 📄 PDF notes et compétences », fermé tant que les copies ne sont pas rendues (609) ; le PDF de `pdf-632` ; « 📝 Bilan général » dans la fiche, pré-rempli, « ↻ Regénérer », « ✓ Valider le bilan » (621 à 625) ; le bilan de l'élève qui finit par « 📝 Bilan » (623) ; « 🎯 Ce qu'elle vérifie » dans l'éditeur, et la garde au collage (631) ; **le libellé élève de chaque compétence partout où l'élève voit une compétence**, y compris les attestations et la phrase sous chaque question (636 à 640, 644) ; dans l'éditeur de taxonomie du panneau prof de MJPC, une section « Les compétences » avec leur libellé élève, comme pour les notions (637) ; dans Réglages, le prompt (647 à 650), les durées de la séance (649), les niveaux de maîtrise et l'échelle de la note (108, 131) ; le commentaire de `com632.js` partout où il paraît |

À la fin, ta livraison L5 donne un **tableau « point → scène »** : pour chaque point retenu qui se voit, la scène qui le montre. Un point sans scène est un trou, listé.

---

## 5. Ce que tu mesures

1. **Les limites de longueur** (464) : sur une vraie moitié de tablette (tablette 1280 × 800, chaque moitié la moitié de la largeur), avec le CSS de la maquette, l'écran de réponse à son état le plus chargé. Pour 4, 5 et 6 choix : la longueur maximale de l'énoncé, et celle d'un choix, qui tiennent sans défilement. Rejoue la vraie question 3 de l'évaluation de 3e (6 choix longs : 67 px de reste au tour 610) pour étalonner. Rends un tableau, et le texte exact qui remplacera `{{LIMITES}}` dans le prompt (`MANDATS/PROMPT-QCM-CREATION/README.md`).
2. **Le débordement** : chaque scène de tablette, chaque moitié ; 0 débordement, sauf une question marquée « longueur assumée », qui défile seule dans sa moitié (464).
3. **Les tailles d'écran** de la console (protocole §4) : 1366 × 768, 1536 × 864, 1920 × 1080 ; le téléphone à 390 de large ; le tableau à 1280 × 800.
4. **Les chevauchements** (protocole §3), tout allumé.

---

## 6. Les livraisons

Chacune est courte, poussée sur sa branche, et **s'arrête** : tu attends « continuer ».

| Livraison | Ce qu'elle fait |
| --- | --- |
| **L1 — le socle** | La liste de ce que tu as lu (§2), avec les md5. Une seule maquette qui réunit **tous les morceaux existants** (§3) dans l'ordre de la séance, sans rien changer encore ; le sommaire ⚙ ; le banc unique (§8) ; les captures ; le tableau des scènes qui seront changées, ajoutées ou retirées par L2 à L4, point par point (§4). |
| **L2 — avant et pendant les questions** | Le lancement, l'appel et les binômes formés par les exclusions ; l'identification ; les attestations ; les questions, avec les temps en direct, écarter et annuler, le stylo, B ; la démo et son bandeau ; le téléphone ; le tableau. |
| **L3 — la correction et la fin de l'heure** | La recopie et A ; la co-évaluation, l'alerte, le cas ambigu ; le ✓ orange ; le point d'autonomie ; « 🏁 Afficher leur bilan aux élèves », la note provisoire, le bilan ; la séance interrompue, finie à une autre heure, reprise ; le rattrapage. |
| **L4 — le soir, les réglages, MJPC** | Résultats, la fiche de l'élève, « Que dit la feuille ? », le Bilan général ; publier et rendre les copies ; le PDF ; « Mes évaluations » côté élève ; l'éditeur, le collage, « Copier les erreurs pour l'instance de création d'éval » ; Réglages ; Sauvegarde et corbeille ; le mode test ; dans MJPC, la fiche de la classe avec les exclusions, et l'éditeur de taxonomie avec les libellés élève des compétences. |
| **L5 — les mesures et le livret** | Les mesures du §5 ; le tableau « point → scène » ; le livret PDF de toutes les captures, dans l'ordre, une phrase sous chacune ; le README final. |

---

## 7. Ce que contient chaque livraison

Sur sa branche, dans un dossier `MANDATS/MAQUETTE-QCM-COMPLETE/Ln/` :
1. la maquette `maquette-qcm-vN.html` et son md5, ses sources et ses scripts (assemblage, captures, banc) ;
2. `sorties/` : la sortie réelle du banc unique, recomptée ;
3. les captures, **écran entier**, chacune regardée avant d'être livrée (protocole §4) ;
4. un `README.md` : ce qui est fait ; ce que la maquette simule ; ce qui n'est pas fait ; **les trous** (§1, points 6 et 7), chacun avec la scène où il est et ce qu'il faut à Paul pour le trancher ; les défauts trouvés et corrigés, avec leur cause ; ce que Paul peut regarder, scène par scène.

---

## 8. Le banc unique

Une commande rejoue tout et échoue si une seule vérification échoue : chaque scène s'ouvre sans erreur de page ; aucune moitié de tablette ne déborde (sauf « longueur assumée ») ; aucun texte vu par l'élève ne contient « touche », « recopie », « sanction », « attestation », un intitulé officiel de compétence, un code (`c4-…`, `tr-…`) ou un mot de plomberie ; aucun bouton de console sans infobulle ; aucun `alert`, `confirm` ou `prompt` ; aucun `fetch` ni stockage ; aucun vrai élève. Les vérifications se font **par le geste** dans Chromium (protocole §4), jamais par un appel de fonction. La sortie dit combien de vérifications ont tourné, recompté.

---

## 9. Après L5

Tu t'arrêtes. La conscience audite la branche contre le cadrage et ce mandat ; Paul valide sur captures ; ses remarques reviennent en compléments. Rien n'est fusionné dans `main` par toi. Ensuite viendra le mandat de code, qui partira de ta maquette validée.

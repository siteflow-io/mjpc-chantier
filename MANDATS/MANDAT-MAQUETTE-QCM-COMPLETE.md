# MANDAT — LA MAQUETTE COMPLÈTE DU QCM, À DEUX PAR TABLETTE, POUR LA VALIDATION DE PAUL

*Écrit par la conscience n°12 le 10/10/2026 (tour 633), revu aux tours 634 et 635, sur l'ordre de Paul : « Je suis à 93 pourcent d'utilisation hebdo, donc la maquette devra être faite par un claude code qui tournera avec mes crédits » (09:14) ; « VOilà, c'est bon. On peut lancer. » (09:58) ; « l'exécutant doit faire l'ensemble du mandat. pas d'audit après chaque morceau. Audit final de ta part. Sinon je ne gagne pas de temps en utilisant claude code, dont l'avantage majeur est de tourner sans s'arrêter. Cependant, il faut des gardes afin qu'il ne produise pas une livraison complètement bugguée: d'où l'obligation des bancs, des autocorrections, etc. » (10:07) ; « Non, corrigée. une livraison ne doit jamais avoir de trous ou de dettes. » (10:11). Pour un exécutant en session cloud de Claude Code, dans le dépôt du sas `siteflow-io/mjpc-chantier`.*

---

## 0. Ce que ça change pour la classe

Paul (M. Meney, professeur de français au collège) fait passer ses évaluations QCM en classe, **deux élèves par tablette, une moitié d'écran chacun**. Chaque élève écrit d'abord sa réponse en entier sur sa feuille, puis clique sur la tablette ; à la correction, il recopie ce que dit sa feuille, et c'est **la feuille qui fait la note**. Le voisin lit la feuille de l'autre, chacun dit si l'autre l'a bien lue, et Paul tranche les désaccords sur sa console et son téléphone. Le soir, Paul relit, rend les copies, et sort un PDF « notes et compétences » que son extension Claude entre dans École Directe.

Tout cela est **cadré** (tours 1 à 632 du cadrage, 658 points). Il n'en existe que des morceaux de maquette, faits à des moments différents. **Ta maquette est l'image exacte de ce que le code fera** : Paul la valide écran par écran, sur captures, avant qu'une seule ligne de l'app ne soit écrite. Ensuite, le mandat de code partira d'elle (protocole maquette, §0 et §6). Une maquette fausse ou incomplète, c'est du code faux.

---

## 1. Qui tu es, ce que tu ne fais jamais

Tu es **l'exécutant du mandat « Maquette complète du QCM »**. La conscience n°12 (en chat avec Paul) a écrit ce mandat ; elle fera **un seul audit, à la fin**. **Tu fais tout le mandat d'une traite, sans t'arrêter et sans attendre personne** : c'est l'intérêt d'une session Claude Code. En échange, ce sont **tes gardes** (§6 à §8) qui empêchent une livraison boguée : un banc qui grandit à chaque étape, et une étape n'est finie que quand il passe à zéro défaut.

Tu ne fais **jamais** :
1. écrire sur `main` du sas : tu travailles sur **une seule branche**, `maquette-qcm`, avec un commit poussé à la fin de chaque étape (une sauvegarde, pas un arrêt) ;
2. écrire dans la production (`siteflow-io/monsieurjaipascompris`) : tu la clones **en lecture** ;
3. lire ou écrire le hub Firebase réel : la maquette n'a **aucun réseau** et **aucune écriture** (protocole maquette, §2 et §7) ; le seul serveur permis est le faux hub du banc, en local ;
4. mettre un jeton, une clé ou une adresse de dépôt dans un fichier ;
5. employer un service ou une API payante, ou une IA dans la maquette ;
6. **écrire une phrase vue par l'élève que Paul n'a pas donnée**. Chaque phrase d'élève se reprend **mot pour mot** de ce que Paul a déjà validé : le cadrage, les maquettes existantes (§3), et l'app d'aujourd'hui (la 7.7.1, pour ce qu'elle a déjà). Le cadrage est fini (Paul, tour 621) : la phrase existe. Si tu ne la trouves pas, c'est que tu ne l'as pas encore trouvée ou que tu l'as mal reprise : tu cherches, et tu la reprends telle quelle ;
7. décider seul d'un comportement : chaque comportement vient du cadrage, de l'app d'aujourd'hui ou des maquettes existantes, dans cet ordre de priorité (le cadrage le plus récent l'emporte) ;
8. ajouter à la maquette une fonction qui n'est pas cadrée, ou refaire autrement une fonction qui existe déjà dans l'app (règle du 03/10 : une maquette part de l'existant) ;
9. utiliser de vrais élèves : la classe inventée « 3 ESSAI » (maquette) et les 30 élèves de la classe de test (mode test) suffisent ;
10. t'arrêter avant la fin du mandat, ou demander quoi que ce soit en cours de route : personne ne te répondra. Tu ne t'arrêtes qu'**une fois**, quand l'étape 5 est finie et son banc à zéro défaut ;
11. livrer avec un trou, une dette ou un défaut : **une livraison n'a jamais ni trou ni dette** (Paul, tour 635). Un défaut se corrige, toujours ; tu ne passes à l'étape suivante qu'à zéro défaut.

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

Ton étape 1 commence par la liste de ce que tu as lu, avec les md5.

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

À la fin, ton étape 5 donne un **tableau « point → scène »** : pour chaque point retenu qui se voit, la scène qui le montre. Un point sans scène est un oubli : tu le fais avant de livrer.

---

## 5. Ce que tu mesures

1. **Les limites de longueur** (464) : sur une vraie moitié de tablette (tablette 1280 × 800, chaque moitié la moitié de la largeur), avec le CSS de la maquette, l'écran de réponse à son état le plus chargé. Pour 4, 5 et 6 choix : la longueur maximale de l'énoncé, et celle d'un choix, qui tiennent sans défilement. Rejoue la vraie question 3 de l'évaluation de 3e (6 choix longs : 67 px de reste au tour 610) pour étalonner. Rends un tableau, et le texte exact qui remplacera `{{LIMITES}}` dans le prompt (`MANDATS/PROMPT-QCM-CREATION/README.md`).
2. **Le débordement** : chaque scène de tablette, chaque moitié ; 0 débordement, sauf une question marquée « longueur assumée », qui défile seule dans sa moitié (464).
3. **Les tailles d'écran** de la console (protocole §4) : 1366 × 768, 1536 × 864, 1920 × 1080 ; le téléphone à 390 de large ; le tableau à 1280 × 800.
4. **Les chevauchements** (protocole §3), tout allumé.

---

## 6. Les étapes, d'une traite

Cinq étapes, enchaînées sans arrêt. Chacune finit par **sa garde** : le banc unique (§8), qui rejoue tout ce qui est déjà fait, passe à zéro défaut ; sinon, tu corriges, tu rejoues, et ainsi de suite (§7). Puis tu pousses un commit sur `maquette-qcm` et tu passes à la suivante.

| Étape | Ce qu'elle fait |
| --- | --- |
| **1 — le socle** | La liste de ce que tu as lu (§2), avec les md5. Une seule maquette qui réunit **tous les morceaux existants** (§3) dans l'ordre de la séance, sans rien changer encore ; le sommaire ⚙ ; le banc unique ; les captures ; le tableau des scènes qui seront changées, ajoutées ou retirées aux étapes 2 à 4, point par point (§4). |
| **2 — avant et pendant les questions** | Le lancement, l'appel et les binômes formés par les exclusions ; l'identification ; les attestations ; les questions, avec les temps en direct, écarter et annuler, le stylo, B ; la démo et son bandeau ; le téléphone ; le tableau. |
| **3 — la correction et la fin de l'heure** | La recopie et A ; la co-évaluation, l'alerte, le cas ambigu ; le ✓ orange ; le point d'autonomie ; « 🏁 Afficher leur bilan aux élèves », la note provisoire, le bilan ; la séance interrompue, finie à une autre heure, reprise ; le rattrapage. |
| **4 — le soir, les réglages, MJPC** | Résultats, la fiche de l'élève, « Que dit la feuille ? », le Bilan général ; publier et rendre les copies ; le PDF ; « Mes évaluations » côté élève ; l'éditeur, le collage, « Copier les erreurs pour l'instance de création d'éval » ; Réglages ; Sauvegarde et corbeille ; le mode test ; dans MJPC, la fiche de la classe avec les exclusions, et l'éditeur de taxonomie avec les libellés élève des compétences. |
| **5 — les mesures et le livret** | Les mesures du §5 ; le tableau « point → scène » ; le livret PDF de toutes les captures, dans l'ordre, une phrase sous chacune ; le README final ; le banc final, qui rejoue tout. |

---

## 7. Les gardes et l'autocorrection

À la fin de chaque étape, **avant** le commit :
1. **Le banc unique** (§8) rejoue tout ce qui existe, pas seulement l'étape : zéro défaut, sinon tu corriges et tu rejoues.
2. **Tu regardes toutes les captures de l'étape** (tu ouvres chaque image) : un écran vide, coupé, qui déborde, qui chevauche, qui montre un texte en double ou un « [object Object] » est un défaut, même si le banc passe. Tu corriges, tu rejoues, tu recaptures.
3. **Tu relis l'étape contre le cadrage** : pour chaque point du §4 de cette étape, la scène qui le montre ; un point sans scène est un oubli : tu le fais.
4. **Tu tiens le journal des défauts** : chaque défaut trouvé, sa cause, sa correction, l'étape. Un défaut qui revient deux fois reçoit une vérification de plus dans le banc, pour ne plus revenir.
5. **Tu pousses** le commit de l'étape, avec la sortie du banc dans `sorties/`.

Tant qu'une garde échoue, tu corriges et tu rejoues : il n'y a pas d'exception, pas de défaut laissé « pour plus tard ». Si une correction résiste, tu reprends l'écran depuis l'existant (§3) plutôt que de le rafistoler.

---

## 8. Le banc unique

Une commande rejoue tout et échoue si une seule vérification échoue. Il grandit à chaque étape et vérifie, au moins :
1. chaque scène s'ouvre sans erreur de page, et montre quelque chose ;
2. aucune moitié de tablette ne déborde (sauf « longueur assumée »), aux tailles du §5 ;
3. **chaque phrase vue par l'élève vient de ce que Paul a validé** : le banc extrait tous les textes des scènes de tablette, d'élève et de tableau, et cherche chacun, mot pour mot, dans `MANDATS/CADRAGE-QCM.md`, dans les sources des maquettes existantes (§3) et dans `evaluation-qcm.html` de la production ; un texte introuvable est un défaut, que tu corriges en reprenant la phrase validée ; les noms d'élèves, les nombres et les énoncés de l'évaluation sont mis à part ;
4. aucun texte vu par l'élève ne contient « touche », « recopie », « sanction », « attestation », « va voir », un intitulé officiel de compétence, un code (`c4-…`, `tr-…`) ou un mot de plomberie ;
5. aucun bouton de console sans infobulle, aucun bouton inerte ;
6. aucun `alert`, `confirm` ou `prompt` ; aucun `fetch`, aucun stockage, aucune requête réseau ;
7. aucun vrai élève : seuls les noms de la classe « 3 ESSAI » et de la classe de test ;
8. aucun chevauchement entre couches, tout allumé ;
9. le commentaire est celui de `com632.js`, le PDF celui de `gen632.js`, mot pour mot.

Les vérifications passent **par le geste** dans Chromium (protocole §4), jamais par un appel de fonction. La sortie dit combien de vérifications ont tourné, recompté, et lesquelles ont échoué.

---

## 9. La livraison, une seule

Sur la branche `maquette-qcm`, dans `MANDATS/MAQUETTE-QCM-COMPLETE/` :
1. la maquette `maquette-qcm-vN.html` et son md5, ses sources et ses scripts (assemblage, captures, banc) ;
2. `sorties/` : la sortie réelle du banc final, et celle de chaque étape ;
3. `captures/` : toutes les captures, écran entier, regardées ;
4. le livret PDF ;
5. un `README.md` : ce qui est fait, étape par étape ; ce que la maquette simule ; le journal des défauts trouvés et corrigés ; les mesures ; le tableau « point → scène » ; et, scène par scène, ce que Paul peut regarder. Zéro trou, zéro dette, zéro défaut : le banc final le prouve.

## 10. Après l'étape 5

Tu t'arrêtes, une seule fois. La conscience fait l'audit final de la branche, contre le cadrage et ce mandat ; Paul valide sur captures ; ses remarques reviennent en compléments. Rien n'est fusionné dans `main` par toi. Ensuite viendra le mandat de code, qui partira de ta maquette validée.

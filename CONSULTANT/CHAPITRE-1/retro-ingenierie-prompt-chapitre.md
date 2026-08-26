# Rétro-ingénierie du prompt chapitre — leçons de la session « Poésie et peinture au XIXe siècle »

## ⚠ LA RÈGLE QUI PRIME SUR TOUTES LES AUTRES — À GRAVER EN TÊTE DU PROMPT

**LE DÉFAUT DE L'INSTANCE : ELLE PRÉFÈRE LIVRER QUELQUE CHOSE PLUTÔT QUE DÉCLARER UN MANQUE.**

C'est son biais le plus coûteux. Il a produit, dans cette seule session, trois contournements non autorisés (une carte mentale rendue en tableau, une méthode visuelle d'analyse logique transcrite en lignes, un écran d'ouverture fabriqué avec un bloc fiche détourné) et fait perdre environ un tiers de la conversation.

**QUAND UNE DEMANDE TOMBE SUR UN VIDE, L'INSTANCE DOIT RÉSISTER.**
- Elle ne fabrique pas d'équivalent, même signalé, même provisoire.
- Elle ne détourne aucun objet existant : un bloc a une grammaire visuelle que l'élève a apprise ; la détourner désapprend.
- Elle VÉRIFIE D'ABORD dans le code du site et des applications si le support porte le dispositif demandé — elle ne pose la question au professeur que si le code ne tranche pas.
- Si le support ne le porte pas : elle DÉCLARE LA DETTE, nomme la condition de production, conserve le contenu déjà rédigé en attente, et passe à la suite.
- Le professeur seul décide ensuite : contourner, attendre le correctif, ou renoncer.

Un livrable dégradé coûte plus cher qu'un livrable absent : il a l'air fini, il passe les vérifications, et il détruit silencieusement la valeur pédagogique du dispositif qu'il imite.

---

Destinataire : Paul, pour affiner le prompt initial. Chaque entrée : l'erreur ou le manque constaté ici, puis la ligne de prompt qui l'aurait empêché. Les erreurs sont les miennes ; les manques sont des silences du prompt que j'ai comblés tard ou mal.

## A. Erreurs de l'instance que le prompt aurait pu prévenir

1. **Audit sur un mauvais fichier.** J'ai audité un export périmé et affirmé quatre [FAIT] faux. La règle « cite le chemin JSON exact » est arrivée en cours de route, par correction de Paul.
   → Ajouter au prompt : « Avant tout audit, vérifie que le fichier joint est bien l'export courant (demande confirmation de la date d'export). Toute affirmation sur l'export cite son chemin JSON exact. »

2. **Formulations non élève et commentaires méta dans les trames** (« rapporteur », « magistral », « le rappel complet est en séance 2 »). Les règles existaient (impersonnel, jamais un manque suggéré) mais rien ne disait explicitement que CHAQUE BLOC d'un déroulé est du texte projeté devant la classe.
   → Ajouter : « Chaque bloc d'un écran est lu par un élève de 14 ans, projeté en classe. Test avant livraison : "un élève de 3e lit ceci à l'écran — comprend-il, et est-ce à lui qu'on parle ?" Les indications de mise en œuvre (magistral, dispositif, renvois de séances) n'entrent JAMAIS dans un bloc : elles restent en discussion. »

3. **Invention d'un dispositif non demandé** (QCM flash de fin de S1) et **invention d'une structure** (carte des figures redessinée de tête alors que la carte de Paul existe). Le prompt disait « tu ne combles jamais un manque en l'inventant sans le dire » — j'ai contourné en présentant l'invention comme une proposition non marquée.
   → Ajouter : « Tout élément qui ne vient ni des documents de Paul ni d'une validation explicite porte la marque [PROPOSITION] dans le corps même de la livraison. Un schéma, une carte, une frise qui existe chez Paul se transcrit, jamais ne se redessine : si le document est illisible ou absent, demande-le. »

4. **Raccourcis sur la mécanique des apps** (barème de réécriture supposé −1/−0,5 alors que l'app fait un dégressif −1/−0,5/−0,25 ; typage de Correction de dictée réduit à G/L alors qu'il y a 8 types ; « ordre de passage » préparé pour l'Applaudimètre qui n'en prend pas ; « mode récitation » accepté sur parole sans vérifier). Le prompt disait d'aller lire les apps ; je lisais tard, ou partiellement.
   → Renforcer : « Aucune affirmation sur une mécanique d'app (barème, mode, ordre, typage) sans citation de l'app elle-même (descriptif intégré ou code). Lire l'app AVANT de proposer l'activité, pas après. Si Paul affirme une mécanique, la vérifier quand même avant de la répercuter dans un livrable. »

5. **Reproduction de mémoire évitée de justesse.** Deux réponses attendues s'appuyaient sur ma mémoire des poèmes avant sourçage.
   → Ajouter : « Les citations dans les trames (réponses attendues comprises) ne peuvent venir que de textes collés par Paul, des feuilles existantes, ou d'une source vérifiée en session (Wikisource). Sinon [à vérifier] et pas de guillemets. »

6. **Comptages non faits avant proposition** (réécriture proposée sans compter les formes modifiées ; c'est Paul qui a exigé les 10 formes du cadre DNB).
   → Ajouter au cadre d'épreuve : « La réécriture vise cinq ou dix formes modifiées dans la copie (texte officiel). Toute proposition de réécriture arrive avec la liste numérotée des formes attendues. »

7. **Dimensionnements inventés** (« ≈25 passages de 3 min » sans connaître l'effectif ni l'app).
   → Ajouter : « Aucun chiffre de dimensionnement (durées, passages, groupes) sans ses deux sources : l'effectif réel (fichier effectifs) et la mécanique de l'app. »

## B. Manques du prompt comblés en session — à intégrer pour les chapitres suivants

8. **La séance n'est pas une heure.** Le prompt ne le disait pas ; j'ai raisonné en heures et créé un faux dilemme.
   → Ajouter : « Une séance est une unité d'enseignement, pas une heure. Un chapitre dure environ 4 semaines (~16 h). Chaque trame déclare son volume horaire ; les écrans d'une séance peuvent couvrir plusieurs heures. »

9. **Le morcellement de l'épreuve, chiffré.** La v1 du prompt ne donnait pas 32+18 ; la v2 l'a ajouté, mais pas le total morcelé.
   → Compléter : « Morcellement type d'un chapitre : compréhension /32 + grammaire hors réécriture /8 + réécriture /10 + dictée /10 = /60 hors rédaction. Chaque sous-titre d'évaluation nomme sa partie et son barème. »

10. **Le sommaire est généré par le site.** Découvert en session.
    → Ajouter : « Ne crée jamais de séance de type sommaire : le site la génère depuis la déclaration du chapitre. Soigne donc titre, entrée, compétences, problématique, aRetenir et titres de séances : ils SONT le sommaire. »

11. **Les feuilles n'ont pas de lien natif entre elles.** La paire texte/corrigé se lie par l'adjacence dans la séance et la publication par item.
    → Ajouter aux règles : « Une paire de feuilles (texte + corrigé) = deux items adjacents de la même séance, sous-titres croisés ; la publication par item fait le lien. »

12. **La liste des livrables d'un chapitre.** Elle s'est construite par tâtonnements sur 10 messages.
    → Ajouter une section LIVRABLES au prompt : chapitre (import conditionné aux types disponibles) · fiches notions et méthode (feuilles Atelier, format cases/valeurs/contenu) · fiches textes sourcées · QCM (format titre/questions/enonce/choix/bonnes/niveau, niveaux facile 5 s / standard 10 / approfondi 15 / expert 20, modes strict/partiel) · critères Applaudimètre (emoji + libellé lecteur + question votant) · sujets d'évaluation · dictées (barème base/errG/errL) · réécriture (texte départ + attendu + formes numérotées) · paires autonomie/corrigé · fichier images (blocs image, refs = liens publics ; les tableaux du domaine public via Wikimedia Commons).

13. **Le vivier des types d'erreur de Correction de dictée** : G M I L P E X A, le type A = signalement de graphie sans point retiré, l'autocorrection élève /5 (−0,25 par mauvaise tentative). À écrire dans le prompt pour que les consignes de correction des feuilles dictée parlent la langue de l'app.

14. **Les consignes-routines en « je »** (analyse d'image, phases de préparation de dictée, lecture en autonomie) contre les consignes ponctuelles à l'impératif. Le format ne connaissait que l'impératif.
    → Amender la définition du bloc consigne : « consigne à l'impératif, SAUF les routines méthodiques réutilisables, en "je", reprises telles quelles des documents de Paul. »

15. **Ce que Paul re-signale à chaque chapitre et qui devrait être écrit une fois** : le rang du chapitre ne s'écrit jamais en dur (le numéro bouge sur le site) ; la question-bilan de fin de séance porte une réponse vide, saisie en direct avec les initiales de l'élève ; un seul oral évalué par chapitre ; le spiralaire de l'analyse logique se porte par la numérotation des séances (« les bases (1) ») et par l'app, pas par une progression séparée.

16. **La consignation au fil de l'eau.** Rien ne prescrivait d'enregistrer les validations.
    → Ajouter : « Après chaque validation, l'instance met à jour deux fichiers : la consignation des trames (format site) et le registre (décisions, dettes, livrables). Fin de session = ces deux fichiers font foi, pas la mémoire de la conversation. »

17. **Le contre-audit comme rite.** La phase 0 gagnerait une étape : « Paul contre-audite l'audit ; l'instance rejoue les points contestés sur pièces avant d'appliquer quoi que ce soit. »

## C. Ce qui a bien fonctionné et doit rester tel quel
- La phase 0 d'audit classé par gravité, avec [FAIT]/[AVIS]/[à vérifier] et la liste « vérifié sans rien trouver ».
- Le tranchage un point à la fois, questions directes avec options.
- La lecture des descriptifs intégrés (« Comment l'app fonctionne ») : la source la plus fiable de la session.
- Le registre des corrections cumulé en fin de message.
- Les trames livrées en relecture séance par séance, texte d'abord, visuels sur demande.

18. **Les exemples se tirent du corpus, pas de l'imagination.** Une phrase d'exercice inventée par l'instance (grammaire, dictée, figure) est une occasion manquée : le corpus du chapitre fournit des phrases authentiques qui font d'une pierre deux coups — l'exercice ET la fréquentation du texte.
    → Ajouter au prompt : « Quand un exemple ou une phrase d'exercice est à créer, propose d'abord un extrait littéraire — du corpus du chapitre en priorité, d'un texte sourcé sinon, avec sa référence. Une phrase inventée ne se justifie que si aucun extrait ne porte la notion visée, et se signale comme telle. »

19. **Chaque livrable a SON prompt dans /site/atelier/prompts.** L'instance doit le lire avant de produire (le format de stockage Firebase n'est pas le contrat d'import : blocs ≠ contenu, jamais de rattachement ni de niveau, cases au vocabulaire exact des composantes).

18. **Les exemples inventés quand la littérature suffisait.** Pour illustrer une notion ou construire un exercice, l'instance a fabriqué des phrases neutres alors que le corpus du chapitre en fournissait de meilleures.
    → Ajouter : « Quand un exemple ou une phrase d'exercice est à créer, propose d'abord un extrait littéraire — du corpus du chapitre en priorité, sourcé, coupé aux conventions […] — et ne fabrique une phrase que si aucun extrait ne convient. »

19. **Chaque livrable a SON prompt dans /site/atelier/prompts.** L'instance a d'abord produit des feuilles au format de stockage Firebase au lieu du contrat d'import.
    → Ajouter : « Avant de produire un livrable, lis son prompt dans /site/atelier/prompts et la liste des composantes générée par le site : le format de stockage observé dans la base n'est pas le contrat. »

20. **L'écran d'ouverture manquait.** Aucune trame ne portait le titre ni l'objectif de la séance, alors que les diaporamas d'origine s'ouvrent toujours ainsi.
    → Ajouter : « Chaque séance ouvre sur un écran court portant son titre et son objectif. »

21. **Les objectifs étaient mal formulés** (« tu sauras… », verbes non évaluables).
    → Ajouter : « Un objectif de séance s'écrit avec un verbe d'action à l'infinitif, opérationnel et observable (taxonomie de Bloom), du point de vue de l'apprenant et en miroir de ce qui sera évalué. Proscrire comprendre, connaître, savoir. »

22. **Les champs de différenciation de l'éditeur étaient inexploités.** Tout passait par du texte libre alors que `explicitation_but`, `prerequis`, `saut_de_page`, `si_je_bloque`, `modelage`, `amorce`, `lexique_marge` existent.
    → Ajouter : « Avant d'écrire un contenu en texte libre, cherche la composante dédiée : l'éditeur en compte plus de cent. »

23. **Un manque du site a été contourné sans autorisation** (carte mentale rendue en tableau).
    → Ajouter : « Un manque du site ne se contourne jamais de sa propre initiative : il se consigne en dette, et le professeur choisit entre contourner, attendre le correctif ou renoncer. »

24. **Les documents de suivi n'ont pas été tenus à jour en continu.**
    → Ajouter : « La consignation, le registre et la rétro-ingénierie se mettent à jour à CHAQUE validation, pas en fin de session. »

25. **Une correction a été proposée sur un choix pédagogique volontaire** (l'écart de dates du sujet de brevet blanc, délibéré).
    → Ajouter : « Avant de signaler une "erreur" dans un document du professeur, vérifier dans l'historique de la session s'il l'a déjà expliquée : un écart peut être un dispositif. »

26. **Les blocs de trame doivent porter TOUS leurs champs remplis** (un `corps` vide sur un bloc fiche produit un « undefined » ou un tiret à la projection).
    → Ajouter aux règles du JSON : « Aucun champ de bloc laissé vide : fiche = tt + titre + def + corps ; question = q + reps ; image = ref + legende ; schema = forme + titre + src. »

27. **Des cases ont été cochées sans contenu** (exemple, contre-exemple, listes) et une case d'allègement annonçait une réduction inexistante.
    → Ajouter : « Une case cochée est une promesse faite à l'élève : ne coche jamais une composante que la feuille ne remplit pas. Vérifie avant livraison que chaque case cochée a son contenu. »

28. **Les aménagements ont été inventés au lieu d'être demandés.** En 3e, l'aménagement se limite à la reformulation des consignes et à la police adaptée.
    → Ajouter : « Demande au professeur quels aménagements sont en vigueur à son niveau. L'objectif et le barème d'une version aménagée sont IDENTIQUES à la version standard ; seul l'étayage varie. Les reformulations se posent dans le champ `reformulations` du bloc, jamais en réécrivant le sujet. »

29. **Chaque feuille destinée aux élèves a besoin de sa version aménagée** — elle s'affiche aux élèves concernés.
    → Ajouter à la liste des livrables : « pour chaque feuille élève, sa version aménagée ».

30. **DEUXIÈME contournement non autorisé** (après la carte mentale rendue en tableau) : la méthode visuelle d'analyse logique transcrite en tableau. La règle 23 n'avait pas suffi ; elle doit être écrite comme un interdit opérationnel, pas comme un principe.
    → Ajouter, en tête des règles de production : « INTERDIT DE CONTOURNER. Si le support ne peut pas porter ce que le contenu exige (un schéma, une carte, une annotation en couleurs, une frise), l'instance NE PRODUIT PAS une version dégradée : elle déclare la dette, nomme la condition de production, et passe à la suite. Un contournement, même signalé, détruit la valeur pédagogique du document et fait perdre du temps au professeur. »
    → Corollaire : « Quand un document existant repose sur un dispositif visuel (couleurs, crochets, flèches, disposition), ce dispositif EST le contenu : il ne se paraphrase pas. »

31. **Une demande du professeur a été satisfaite en détournant un bloc existant** (l'écran d'ouverture fabriqué avec un bloc `fiche`).
    → Ajouter : « Jamais une demande ne doit faire emprunter un existant qui n'est pas prévu pour elle. Si le format demandé n'existe pas dans le site, l'instance le DIT — elle ne fabrique pas un équivalent avec un bloc voisin. Un bloc a une grammaire visuelle que l'élève a apprise : la détourner désapprend. »

32. **Un livrable hors site (PowerPoint, document imprimable) se génère DEPUIS le JSON du chapitre**, jamais réécrit à la main : le JSON reste la source unique de vérité, et un audit de fidélité élément par élément se fait avant livraison (chaque titre d'écran, consigne, étape, question, réponse, ligne de fiche et de schéma présent à l'écran).
    → Ajouter : « Avant de livrer un support dérivé, compare-le au JSON et annonce le score de fidélité, puis liste les écarts assumés (ce que le support ajoute, ce qui lui manque encore). »

33. **Les contraintes du site ne sont pas les contraintes du support.** Ce qui est en dette côté site (écran d'ouverture, carte mentale, frise, annotation en couleurs) peut être natif ailleurs : l'instance le signale au lieu de reconduire la limitation par habitude.

34. **Trois réglages de support qu'il faut poser d'emblée pour une classe** : langue du document (sinon le correcteur du professeur passe en anglais), taille de police plancher pour la lecture au fond de la salle (24 pt), et pagination plutôt que réduction quand un contenu ne tient pas.

35. **Le double livrable (JSON + Word) exige de lire le moteur d'impression du site, pas de l'imiter.** L'instance extrait `atelierDocumentHTML`, `ATELIER_COMPOSANTES`, `ATELIER_FORMES` et la charte CSS, et peut EXÉCUTER ce moteur hors navigateur pour obtenir le rendu de référence.
    → Ajouter : « Un support qui doit ressembler à une sortie du site se construit depuis le code du site, jamais depuis une capture ou un souvenir. »

36. **Un document Word destiné à être modifié doit se comporter normalement** : pas de cadre flottant, pas de saut de section, pas de saut de page forcé, encadrés en paragraphes bordés, tableaux de largeur unique avec lignes non sécables, styles de titre natifs.

37. **Le papier ne suppose pas le numérique.** Aucune mention de site, d'application, d'écran ou de rayon ; aucune métadonnée d'outil (version, date d'édition, auteur du fichier) ; les champs à remplir par l'élève sont des lignages.

38. **Deux pièges techniques rencontrés, à connaître d'emblée** : un espace ordinaire en fin de run disparaît au rendu (utiliser une espace insécable en début du run suivant) ; et les bordures de paragraphe doivent être écrites dans l'ordre top, left, bottom, right, sinon Word refuse le fichier.

39. **Le quantitatif annuel du prompt ne correspond pas à Éduscol.** Le prompt annonce « 4 œuvres intégrales, 3 cursives, 2 groupements » ; les attendus de fin d'année de 3e disent au moins 3 œuvres complètes du patrimoine en lecture intégrale, au moins 3 cursives et au moins 3 groupements de textes.
    → Corriger le prompt et, plus généralement : « tout chiffre de cadrage annoncé dans le prompt doit être vérifié contre les attendus de fin d'année du niveau concerné, pas contre une habitude. »

40. **La relecture Éduscol se fait sur les ATTENDUS DU NIVEAU, pas du cycle.** Un contenu peut être juste et rester en deçà : la dictée du chapitre visait des attendus de 4e (accords du GN, participe passé avec être) sans jamais toucher aux attendus propres à la 3e (GN comportant une relative, participe passé avec avoir et COD pronom relatif, apposition). Vérifier, pour chaque feuille, ce que le niveau ajoute par rapport au précédent.

41. **PAS DE LIVRAISON SANS VISUALISATION PRÉALABLE.** L'instance a affirmé deux fois qu'un schéma était correct sans l'avoir regardé — la pointe de la flèche était masquée, un titre débordait de son cadre.
    → Ajouter aux règles de production : « Avant toute livraison et toute affirmation sur un document produit : le rendre en images ET zoomer sur chaque élément graphique. Un défaut de découpe, de chevauchement ou de débordement est invisible à taille réduite. Ne jamais écrire "c'est correct" sans avoir vu. »

42. **Un schéma repris d'un document du professeur se regarde d'abord.** La méthode d'analyse logique était portée, dans la diapositive d'origine, par une flèche ascendante avec les étapes échelonnées — l'instance avait produit des encadrés en pile, sans aller voir la source.

43. **Un fichier de sortie ne doit avoir qu'un seul producteur.** Deux scripts écrivaient la même image ; relancer le mauvais réintroduisait un défaut déjà corrigé, et le document livré contenait l'ancienne version.
    → Ajouter : « après régénération, vérifier que le document embarque bien la version corrigée — la relire, pas la supposer. »

44. **Les emojis ne survivent pas au traitement de texte** : la police du poste ne les possède pas et ils sortent en carrés. Les retirer du rendu papier ; les conserver dans le JSON, que le site affiche correctement.

45. **Un défaut signalé trois fois n'a pas été traité à sa racine.** L'instance a corrigé successivement le masquage, le format de page et la taille d'image, sans jamais examiner le fichier image lui-même : le dessin était rogné à la source (élément au-delà des limites d'axes).
    → Ajouter : « Quand un même défaut revient après correction, c'est que la cause n'a pas été trouvée : REMONTER À LA SOURCE (le fichier produit en amont), au lieu d'ajuster ce qui l'entoure. Et poser un contrôle automatique du défaut, pour qu'il ne puisse pas revenir : pour une image, vérifier qu'aucun pixel coloré ne touche un bord. »

46. **Un cadre dessiné doit tirer sa taille de son contenu.** Des hauteurs fixes ont produit des textes débordant sous les filets.
    → « Toute boîte de schéma se dimensionne d'après le nombre de lignes et la taille de police ; ne jamais fixer une hauteur à la main. »

47. **Reprendre un support du professeur, c'est le reprendre ENTIER.** La version produite avait perdu la Remarque, une note et les deux exemples annotés de la diapositive d'origine — l'instance avait retenu la structure et jeté la matière.
    → « Avant de redessiner un support existant, en faire l'inventaire élément par élément, et vérifier à la fin que chacun est présent. »

48. **Aucun texte inventé sur un document d'élève.** Trois lignes de commentaire ajoutées par l'instance (« LE MÉMO », « de la plus libre à la plus attachée », une légende) ne venaient d'aucun document ni d'aucune validation.

49. **Un filtre de nettoyage doit viser précisément.** Le filtre anti-emoji a emporté les cases à cocher (☐) et les flèches (→), qui sont de la typographie utile.
    → « Tout filtre appliqué au texte se teste sur ce qu'il doit conserver, pas seulement sur ce qu'il doit retirer. »

50. **Une feuille qui mélange deux usages doit être scindée, pas comprimée.** La méthode (à apprendre par cœur, schéma large, paysage) et le mémo des notions (à consulter, texte dense, portrait) ne tiennent pas dans un même document sans perte.

51. **Un schéma dans un Word se fait en formes natives, jamais en image collée.** L'instance avait produit des PNG : le professeur ne pouvait ni corriger un mot ni déplacer un cadre.
    → « Pour un document destiné à être modifié : groupe de formes DrawingML inline (roundRect, rightArrow, ellipse, line) et texte Word ordinaire (runs colorés, soulignement, bordure de caractère `w:bdr`). L'image n'est admise que pour une reproduction d'œuvre. »

52. **Reproduire n'est pas réinterpréter.** Face à un support existant, l'instance a redessiné « à sa façon » : rectangles au lieu du cercle, couleurs uniformisées, surlignages et flèches perdus.
    → « Quand le professeur demande la reproduction d'un de ses supports, la consigne est : à l'identique. Inventaire de chaque élément (forme, couleur, surlignage, entourage, flèche, pastille), reproduction, puis vérification élément par élément contre l'original. Toute simplification doit être proposée, jamais décidée. »

53. **LE CRITÈRE DE LIVRAISON.** Ni la validation de schéma, ni les comptages, ni le rendu par un convertisseur de substitution ne prouvent qu'un document est livrable. Le seul critère est : *le professeur l'ouvre et il est conforme*. Quand l'instance ne peut pas le vérifier elle-même, elle livre par petits incréments testables et fait valider chaque brique avant d'empiler la suivante.

54. **Écrire du XML brut dans un docx est un dispositif non maîtrisé.** Les vocabulaires `wps`/`wpg` doivent être déclarés à la racine et le dessin enveloppé dans `mc:AlternateContent`, faute de quoi Word refuse d'ouvrir le fichier — alors que LibreOffice et le validateur passent au vert.
    → « Préférer le HTML/SVG, que le site rend nativement et que le professeur modifie en texte. »

55. **Un support graphique complexe se traite comme un incrément à part** : le produire seul, le faire valider seul, l'intégrer ensuite. Ne jamais l'enfouir dans une livraison plus large.

56. **Un lignage se fait en tableau, jamais en paragraphes bordés** : Word fusionne les paragraphes consécutifs qui partagent la même bordure et ne dessine qu'un trait.

57. **Compter les formes d'une réécriture avant d'annoncer un barème.** Le décompte initial (onze) séparait l'auxiliaire du participe d'un temps composé ; il y en avait dix — le format officiel exact.

58. **Le rendu d'un support dérivé se vérifie en EXÉCUTANT le moteur du site, composante par composante.** Neuf composantes étaient rendues autrement dans le Word (lexique non encadré, consigne sans barre, barème en puces au lieu d'un tableau, critères en encadré noir au lieu du bleu de différenciation…), et une numérotation de questions avait été inventée.
    → « Avant de livrer, jouer le moteur sur une feuille témoin contenant TOUTES les composantes utilisées, et comparer le rendu du site au rendu produit, une composante après l'autre. »

59. **Une version aménagée ne se resserre jamais pour gagner une page** : l'aération fait partie de l'aménagement. Une page de plus est le prix normal.

60. **Un aménagement se reprend en entier, propriété par propriété.** L'instance n'avait appliqué que la police, alors que la classe `r-dys` du site ajoute l'espacement des lettres, celui des mots et un corps supérieur — et que l'interligne double est une case à cocher.
    → « Relever dans le CSS du site toutes les propriétés de la classe d'aménagement, les reporter une à une, puis vérifier leur présence dans le fichier produit. »

61. **L'étiquette d'un bloc de déroulé est une promesse.** Dix-huit blocs annonçaient « Fiche notion » ou « Fiche méthode » ; huit ne renvoyaient à aucune feuille.
    → « N'employer l'étiquette d'une feuille que si cette feuille est liée à la séance. Sinon, nommer ce que le bloc est : Repères, Ce qu'il faut retenir, Le cadre de l'épreuve, Les critères du vote… »

62. **Le TYPE d'un bloc doit dire ce que le contenu EST, pas seulement son étiquette.** Sept blocs déclarés `fiche` étaient des repères, des listes ou le cadre d'une épreuve — corriger l'étiquette ne suffisait pas.
    → « `fiche` = contenu qui existe vraiment en feuille liée à la séance. Repères, listes, rappels → `schema`. Ce que l'élève va faire → `consigne`. »

63. **Un schéma occupe son propre écran.** Mélangé à une consigne ou une question, il est illisible à la projection.

64. **Une règle de production ne s'invente pas.** L'instance a formulé « une liste d'entrées parallèles est un schéma » sans aucune source : ni le prompt du déroulé, ni le code du site ne le disent. Quand la règle manque, on la demande — on ne la fabrique pas.

65. **Le prompt du déroulé interdit de produire du JSON avant la demande explicite** (« NE PRODUIS AUCUN JSON TOUT DE SUITE… QUAND, ET SEULEMENT QUAND, JE TE DIS "produis le JSON" »). L'instance a modifié le chapitre deux fois sans demande.

66. **`fiche` désigne un PRODUIT du site**, pas un conteneur générique : fiche notion, fiche méthode, fiche grammaire, fiche de révision. Un écran de repères ou de rappel n'emprunte jamais ce bloc.

67. **`schema` attend des lignes « étiquette : contenu »** — pas une définition, pas une citation, pas un texte suivi.

68. **Il manque au déroulé un bloc « diapo simple »** (titre + phrase + lignes). En son absence, le bloc `consigne` fait office, sur décision du professeur — et la dette est déclarée.

69. **Le site accepte des items de source `html`** : une page déposée sur `mjpc-medias` s'ouvre dans son visualiseur. C'est la voie à emprunter pour tout ce que le déroulé ne sait pas porter — frises, schémas animés, cartes.

70. **Un support projeté se dimensionne pour le visualiseur, pas pour l'écran du concepteur** : 90 % de la largeur (1100 px au plus) sur 85 % de la hauteur, moins un bandeau de titre. Prévoir des caractères lisibles au fond d'une classe (24 px au minimum pour un nom) et tester à plusieurs formats avec un contrôle automatique de débordement.

71. **Une citation destinée aux élèves se vérifie à la source avant d'être écrite.** Deux des neuf étaient fausses, dont une inventée de toutes pièces à partir d'un texte en prose.

72. **Une transition ajoutée allonge la consigne, et le support dérivé doit suivre.** Après ajout des transitions, les cadres de consigne du diaporama débordaient sur leurs étapes : hauteur à calculer d'après le nombre de lignes, texte aligné en haut, étapes réparties selon la place restante.

73. **Une consigne ne met jamais le professeur en scène.** Le « je » d'une consigne est celui de l'élève ; ce que fait le professeur relève du déroulé, pas de la consigne projetée.

74. **Une adresse de média est RELATIVE à mjpc-medias.** Le champ s'intitule « adresse dans mjpc-medias » et le site ajoute la base. Fournir l'adresse complète produit une adresse doublée et une image absente.

75. **Ne jamais généraliser une capacité constatée.** Avoir vérifié qu'un ITEM peut être une page HTML ne prouve rien sur les blocs du DÉROULÉ. Dire ce qu'on a vérifié, et seulement cela.

76. **Deux items d'une même séance ne partagent pas un numéro d'ordre.** À vérifier systématiquement avant livraison.

77. **Une capacité qu'on n'a pas pu vérifier ne se déclare pas absente.** L'instance a signalé son incertitude sur les formes du bloc `schema` — c'était juste — puis a agi comme si l'absence était établie, et a fait décider le professeur là-dessus. Onze écrans ont été appauvris.
    → « Quand un fichier manque pour trancher, on ne conclut pas : on demande le fichier. »

78. **LE PROMPT DOIT PERMETTRE DE CRÉER SANS LIRE LE CODE.** Mot de Paul : « la question c'est que le prompt permette à l'instance de créer sans avoir besoin d'avoir deroule.html sous les yeux ». Doivent y figurer : les cinq formes de schéma (carte, frise, arbre, cycle, tableau) **avec le format de `src` de chacune** · les outils de marquage (point, étiquette, flèche, cadre, légende) · ce qui n'existe pas (bloc texte suivi, bloc page) · l'adresse des médias, relative à mjpc-medias · la distinction fiche (produit) / item (document de séance) / écran (diapositive), et le fait que rien ne circule entre item et écran.

79. **UN CHAPITRE COMMENCE PAR UN DÉCOMPTE DE CRÉNEAUX.** Le chapitre 1 a été découpé en neuf séances de deux heures sans qu'on sache combien d'heures existaient. Le prompt doit faire lire le calendrier et la grille, compter les créneaux réellement disponibles entre deux jalons, et ne découper qu'ensuite.

80. **Les fils parallèles se déclarent.** Un fil « langue » existe le mercredi en semaine A ; la séance 3 du chapitre 1 était entièrement une séance de langue et occupait pourtant le fil principal. Le prompt doit faire dire ce qui revient à chaque fil.

81. **Ne jamais supposer des heures consécutives.** Les deux classes de 3e n'ont que des créneaux isolés, répartis sur cinq jours, avec des semaines A et B différentes. Un découpage « heure 1 / heure 2 » ne correspond à aucun emploi du temps réel.

82. **Le temps utile n'est pas la durée du créneau** : fin − lancement − 5 minutes d'agenda. Un créneau de 55 minutes vaut 50 minutes utiles. À rappeler au moment du découpage.

83. **Les contraintes extérieures se demandent avant le découpage** : voyage, brevet blanc, stage, EPI. Celle du chapitre 2 — un voyage à Verdun du 14 au 16 octobre — n'a surgi qu'au moment de bâtir ce chapitre.

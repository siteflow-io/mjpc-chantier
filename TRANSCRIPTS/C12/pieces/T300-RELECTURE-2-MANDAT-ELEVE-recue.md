# SECONDE RELECTURE DES MANDATS « L'ÉLÈVE — 1 » ET « L'ÉLÈVE — 2 » — instance relectrice, 30/09/2026

**À CORRIGER AVANT LANCEMENT**

- **Mandat 1.** Deux ancrages restent faux : points 66 et 67.
  - Le cadrage 6 contredit encore le contrat des données du mandat (point 62).
  - La capture citée comme référence contredit le texte (point 63).
- **Mandat 2.** Il n'est pas lançable, et il le dit lui-même : il attend le promeus du mandat 1 et ta décision sur le moteur du déroulé.

*Objets relus au sas :*
- `MANDATS/MANDAT-ELEVE-1.md`, md5 `363c282e1fe0bc792254d64a41a6d5b9` ;
- `MANDATS/MANDAT-ELEVE-2.md`, md5 `9a5cfcbe6f0dfd3b99af66777bc4893a` ;
- `DEROULE/CADRAGE-6-L-ELEVE.md`, md5 `429dcc5e78b2233e9e118d391c029823`.

*Heure : en-tête GitHub, 18:08 UTC, soit 20:08 à Paris. Une seule source ce tour : l'outil d'heure de l'appareil était indisponible.*

**Couverture de cette relecture**

- **Lu en entier :** les deux mandats ; le transcript C12, tours 293 à 299 ; les corrections du cadrage 6 depuis ma première relecture (diff `dad538a..HEAD`) ; le registre, entrées n°12 · 77 à 81.
- **Mesuré au code :** la BASE du mandat 1 (tailles, md5, blobs, versions) et chaque ancrage nouveau.
- **Non lu, je ne sais pas :** `MJPC6-2-DOCTRINE`, le journal, `OU-TROUVER-QUOI`, le plan, la restauration, les cadrages 2 à 4, `mjpc-core.js`, les captures T283 et T284-e2.
- **Le prompt de relecture se trompe encore** en écrivant que LOT1 à LOT12 ont chacun un `MANDAT.md` : seul LOT12 en a un, et LOT10 n'existe pas.

**Ma propre faute, déclarée.** Mon point 32 et ma question 59 reposaient sur la ligne du cadrage « Equipe éduc. + le nom de l'élève ». J'ai lu le mot du 14/09 comme un nom d'élève, je l'ai « masqué » et j'ai bâti dessus un trou et une question. Or rien ne le prouvait. Paul, au tour 295 : « pure invention : aucun nom d'élève dedans ». C'est le mécanisme ③ de la n°9 (« affirmer sans mesurer »), commis par la relectrice. Les deux points sont retirés.

## I. Le sort des 61 points de la première relecture

Légende : ✔ réglé · ≈ réglé en partie ou autrement · ✘ non réglé · — retiré ou sans objet.

1. ≈ Réglé autrement. La mesure a été faite et tu as tranché (T293, point 80 ; T294). Le cadrage 1.3 est réécrit, le contrat des données est posé.
2. ✔ Deux mandats (T294). Le mandat 2 attend la refonte du déroulé.
3. ≈ Les captures T283 et T284-e2/e4 sont citées dans le mandat 1, T271 et T273 dans le mandat 2. Mais le texte contredit T284-e4 (point 63).
4. ✘ Ni le titre « Fiche élève » ni la place réservée « PROFIL ÉLÈVE — suivi longitudinal » (promesse du T285, point 70). Mesuré dans le mandat 1 : 0 « réservée », 0 « Fiche élève ».
5. ✔ ② : « un réimport ne touche jamais dispositif, pap, remarques, synthese, majLe » (T293, point 82).
6. ≈ « (ou un second) » est tombé. Le bouton dans Configuration reste, contre le point 64 (T283) : question 82.
7. ≈ Ajoutés : la BASE (vérifiée exacte, point 77), le STOP, les versions, les interdits, MJPC-CORE, les tailles avant/après, MEMO, « aucune promotion ». Manquent encore la ligne de titre de la conversation (0 « TITRE ») et acorn (0).
8. ✘ Aucune preuve en vue élève pour ⓪ à ③ (0 « vue élève »). ④ prouve la feuille papier, pas l'écran élève de la dictée. Le public des nouveaux signaux n'est pas déclaré.
9. ✘ Pas de regard mobile (0 « 390 », 0 « mobile »).
10. ≈ Les lectures sont élargies (OU-EST-CE, LECTURES, DISPOSITIF, DOCTRINE, DETTES, fautes, LOT12). La doctrine du site manque toujours (0), alors qu'elle est obligatoire avant tout morceau touchant `index.html`.
11. ✔ Livraison ⓪ (dette 77). La fuite propre au pilotage n'est pas couverte (point 76).
12. ≈ Réglé autrement (cadrage 1.6). La classe part quand tu la supprimes : l'extrait `suppression-classe` prend `classesData[slug]` entier (l. 6850). `eleves` entre à la purge en ⓪.
13. ≈ « Aucun geste nouveau » (1.5). Mais la phrase « `_corbeilleRestaure` les remet » est fausse (point 66).
14. ✔ Interdit : « la clé de tout élève est `sanMJPC`, jamais une autre normalisation ».
15. ✘ ④ dit que `toggleAmenageDictee` « reste », or son corps décide d'après `classeAmenages` (l. 2962-2979). Le rebranchement annoncé au T294 n'est pas écrit.
16. ✘ ③ exige `secuExigeCle` à l'enregistrement de la fiche. Son texte parle de « générer un code » (l. 14086) : il faut un texte propre à la fiche.
17. — Sans objet : le mandat ne décrit plus `/codes`.
18. ✘ Le mandat 2 ne porte pas la date au survol du ◆ (3.4 ter).
19. ✘ Le mandat ne dit pas qui efface le reste `classes_amenages/5e HERGÉ` (classe supprimée). Pire : ④ le retire de la purge de la dictée, donc il ne partira plus jamais.
20. ✘ `qcm/eleveSexes` garde 6 clés de classes supprimées, et le repli du QCM les garde lisibles.
21. ✘ Le cadrage 3.5 (`adapte` au contrat d'injection) reste écarté.
22. ≈ T284-e4 est citée, mais contredite par le texte (point 63).
23. ✘ Le mandat 2 omet « de la taille de l'étiquette » (4.2). La règle 4.4 (« l'âge n'est jamais lu par une app ») n'est pas écrite.
24. ✔ Une promotion par livraison, point de retour tenu par la conscience (règles du mandat 1 ; T299, point 98).
25. ✔ ⓪ : `_anneeScolaire()` existe (l. 5948, bascule en août).
26. ≈ ④ : le recalcul épargne les résultats `amenagee: true`. Les résultats aménagés d'avant la 6.6.0 n'ont pas de trace (point 70).
27. ✔ Registre n°12 · 77 à 81, présents (l. 2877 à 2885).
28. ≈ Même sort que le point 6.
29. ✘ Le lien « sa fiche dans la console » reste dans la dictée ; tu ne l'as jamais demandé (question 85).
30. ✔ Cadrage 2.4, ② : l'import n'est jamais bloqué sans la clé (T293, point 81).
31. ≈ Tu as confirmé l'appariement. Mais l'ancrage `edtNormaliser` « ordre libre » est faux (point 67).
32. — Retiré : ma faute, voir en tête (T295).
33. ✘ ④ : le mandat ne dit pas qui pose l'aménagement d'un élève fictif de `_test_correction_dictee` (point 69).
34. ✔ Contrat exact : paquets `mjpcChiffrer(SECU.cle, JSON.stringify(…))`, naissance au format « AAAA-MM-JJ », remarques par identifiant de case.
35. ≈ Les prénoms identiques sont traités au mandat 2 (T293, point 86). Les particules et les noms composés ne le sont pas.
36. ≈ Les cas anormaux sont listés en ①, sauf la classe sans `annee` (la classe témoin n'en a pas).
37. ✘ La fiche montre le sexe mais ne dit pas qu'il s'y saisit. Or le QCM n'écrira plus le sexe, et l'ajout par le cadre de secours n'en a pas.
38. ✔ Noms fictifs à préfixe impossible : `ZZTEST Nom Prenom`.
39. ✔ STOP si le md5 de la base diffère : « Paul pousse lui-même la dictée ».
40. ≈ `classeDuRegistre` est listée en lecture mais n'est pas écrite comme règle, ni pour la dictée ni pour le QCM (point 71).
41. ≈ « 22 écritures » est annoncé sans la liste (point 72).
42. ≈ Le mandat 2 nomme `AT_DR_SUIVI` et `AT_DR_VECU`, et renvoie le reste « au moteur retenu, avant lancement ». C'est acceptable pour un mandat qui attend.
43 à 52. Chacun reste exact. Aucun commit de code en production depuis b815d1d ; seul le registre a bougé (`git log`).
53. ✔ Tranché : tout est chiffré sauf le sexe, plus un nœud `amenagements` (T293, point 80 ; T294).
54. ✔ Tranché : jamais bloqué, la naissance attend la clé (point 81).
55. ✔ Tranché : ta fiche l'emporte (point 82).
56. ✔ Tranché : le ◆ n'est jamais dans la copie de classe (point 83).
57. ✔ Tranché : deux mandats, le 2 avec la refonte (point 84).
58. ✔ Tranché : deux mandats (point 84).
59. — Retiré (T295) : ma faute.
60. ✔ Tranché : « Léa B. et Léa M. » (point 86, mandat 2).
61. ✔ Tranché : le mot « aménagée » n'apparaît nulle part sur la feuille (point 87, ④).

## II. Relecture à neuf

### A. Dérives

62. **Le cadrage 6 n'est pas réécrit là où il contredit le nouveau 1.3.** L'exécutant, qui lit le cadrage « en entier », y trouvera deux contrats :
    - 1.2 met `naissance`, `dispositif` et `pap` en clair, avec `pap` en objet ;
    - 1.4 dit que « le QCM lit le sexe dans le profil » ;
    - 3.4 quinquies dit que « l'app lit la case pap-15 du profil ».

    Correction : réécrire ces lignes, ou écrire au mandat que le contrat des données prime.
63. **Le mandat prend T284-e4 comme référence (« l'UI livrée leur est fidèle, sans invention ») et la contredit.**
    - La capture montre : la marge « lu dans le calendrier annuel », « rien à signaler », une ligne par élève nommé avec sa date, et « PAP · 3 élèves pap-15 … — ou élève par élève, par le clic droit ».
    - Le texte dit : « jamais un nom », « une classe sans fléché : rien », « PAP · n élèves aménagés d'après leur fiche ».

    Correction : dire, élément par élément, lequel des deux prime (question 86).
64. **Une question-réponse de la conscience est restée dans le mandat** (③ : « Il compte les fléchés sans la clé ? Non : … depuis `attente`/le compte gardé en clair `nbDispositifs` »). La barre oblique laisse deux sources au choix de l'exécutant : c'est une catégorie molle (faute ⑦).
65. **L'adresse de test de `evaluation-qcm.html` manque** alors que ② le livre (règle gravée du 27/07 : quand le site est touché, les deux adresses). Sa version aussi est déléguée : mesuré `APP_VERSION="7.6.0"` (l. 1888). La l. 1936 porte un autre `APP_VERSION = "…"`, qui est l'exemple du socle : c'est le piège de l'exemple commenté.

### B. Ancrages faux

66. **« `_corbeilleRestaure` les remet avec lui » (② et cadrage 1.5) est faux pour un retrait d'élève.** `_corbPlanRestauration` (l. 6426) ne restaure qu'un `meta.chemin` ou une classe entière. Un retrait (`chemin:''`) rend `null` : l'archive est en « consultation seule » (`_corbPourquoiPasAuto`, l. 6444). Correction : retirer la phrase, puisque rendre le retrait restaurable serait un geste nouveau, exclu par 1.5.
67. **« Comparé par `edtNormaliser` (ordre libre : « 3e Bob Dylan » = « 3 DYLAN BOB ») » est faux.** `edtNormaliser` (l. 17905) met en minuscules, ôte les accents et la ponctuation ; il ne réordonne rien, et « 3 » n'égale pas « 3e ». Correction : décrire la comparaison à écrire (ensembles de mots, « 3 » vaut « 3e »).

### C. Omissions

68. **Le rappel sans la clé est incomplet.** Il s'éteint « quand `majLe` de chaque fléché ≥ la date », ce qui exige de savoir qui est fléché, donc `dispositif` déchiffré. Sans la clé, le mandat ne dit ni ce qu'il affiche ni quand il s'éteint.
69. **La preuve 4 (« le vrai hub inchangé ») est impossible pour la dictée.** Son bac à sable écrit par construction `/classes/_test_correction_dictee` au vrai hub (l. 6896 ; la classe est au hub). Correction : « inchangé hors `_test_correction_dictee` », et dire que ce bac à sable pose, puis purge, l'aménagement de l'élève fictif.
70. **Les copies aménagées corrigées avant la 6.6.0 n'ont pas de trace.** Le recalcul (dette 79) les recalculera encore sur la base normale. Solution : pour un résultat sans trace, déduire l'aménagement d'après l'override puis le registre, et poser la trace une fois.
71. **Les apps ne savent pas encore où lire l'aménagement.** La dictée et le QCM ne connaissent que le NOM de la classe (`data.classe`, `qcm/eleveSexes/<nom>`), alors que `amenagements` vit sous la CLÉ de `/classes`. Écrire la règle : passer par `classeDuRegistre(nom)` (l. 6700) ou son équivalent dans le QCM, jamais par le nom brut.
72. **« 22 écritures » sous `results`, sans leur liste.** Mesuré avec mon motif (`results…` puis `.set`, `.update`, `.remove`, `.push`) : 20 lignes — 2424, 2897-2899, 3019, 3044-3050, 3070, 3128, 3166, 4747, 4774, 4778, 6225, 6239, 8243, 8743, 9251. Règle du 01/08 : un inventaire se déclare avec sa méthode. Donner la liste nominative.

### D. Ajouts non cadrés

73. **`/classes/<slug>/nbDispositifs` en clair.** Ni le cadrage (1.3 : « tout ce qui décrit l'élève est chiffré ») ni Paul ne l'ont nommé, alors qu'il conditionne le rappel sans la clé (question 83).
74. **Le libellé « n élèves à dispositif (d'après le fichier) »** est écrit par la conscience, à soumettre à Paul avec le point 73.

### E. Trous

75. **Le ◆ sans la clé ne se résout pas.** Le mandat 2 dit « sans la clé, rien » ; le cadrage 3.4 dit « le ◆ seul et une ligne ». Or `dispositif` est chiffré : sans la clé, le pilotage ne sait pas qui flécher (question 84).
76. **La fuite du mode test propre au pilotage n'est pas couverte par ⓪** : le cours actif et la scène du tableau distant partent au vrai hub (cadrage 1 · 11t.1). Le mandat 2 compte sur « ⓪ promu ». Elle est à régler avant ses bancs.

### F. Conforme (mesuré)

77. **La BASE est exacte, mesurée à 20:08 :**
    - `index.html` : 1 774 212 o, md5 `a841534f…`, blob `13ac6c35…`, `APP_VERSION="8.73.0-⑭"` ;
    - `correction_dictee.html` : 724 656 o, `75f48e2d…`, `197aff17…`, `"6.5.0"` ;
    - `evaluation-qcm.html` : 549 568 o, `e6820219…`, `40e6d431…`.
78. **Les ancrages nouveaux existent :**
    - `mjpcDeriverCle` ;
    - `_corbeilleRestaure` (l. 6402, déjà routé par le mode test) ;
    - `'suppression-classe'` (l. 6852 : la classe entière et ses codes) ;
    - `_anneeScolaire` (l. 5948) ;
    - `edtAnneeEvenements`, `edtAlerteInjection`, `secuPatchCode`, `AT_DR_VECU`, `_exportHub`.
79. **Tes mots en tête des mandats sont retrouvés au transcript :** T268, T271, T281, T282, T283, T287, T289, T297 (mandat 1) ; T270, T271, T273, T274 (mandat 2). Seule retouche : « choisit » est devenu « choisis ».
80. **Tes décisions sont portées :** 80 à 84, 86, 87 (T294), 89 (T295), 96 (T297 : la première date par niveau), dans le cadrage (1.3, 2.4, 3.4, 3.4 quater) et dans les mandats.
81. **Registre :** n°12 · 77 (fuite du mode test), 78 (l'année en dur), 79 (le recalcul), 80 (la base se lit sans clé), 81 (le calendrier : un constat) sont présents. Le mandat 1 les fait marquer ✔ par l'exécutant.

### G. Questions à Paul

82. La reprise des sexes du QCM et des aménagements de dictée : au premier import, comme sur la capture validée (T283, point 64), ou par un bouton dans Configuration, comme le mandat ?
83. Un nombre en clair par classe (combien d'élèves ont un dispositif, aucun nom), pour que le rappel des équipes éducatives marche même sans ta clé : oui ou non ?
84. Au pilotage, sans ta clé saisie : aucun ◆, ou un ◆ ? Le second demanderait que le fléchage se lise sans clé, contre ta décision du point 80.
85. Dans la correction de dictée, au clic droit sur un élève : veux-tu un lien « sa fiche dans la console », ou rien à la place de l'ancien « registre de la classe » ?
86. Sur la page des classes, le rappel : une ligne par élève nommé, comme sur la capture T284-e4, ou seulement un nombre, comme le dit le mandat ?

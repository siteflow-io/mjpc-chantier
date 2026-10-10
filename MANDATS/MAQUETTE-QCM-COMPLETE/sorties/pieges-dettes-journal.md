# Les pièges déjà payés, relevés dans docs/MJPC6-DETTES.md et docs/MJPC6-journal.md (production d873f69)

*Lecture intégrale des deux fichiers (3090 et 1068 lignes), par un sous-agent de l'exécutant, en lecture seule ; relevé tel qu'il l'a rendu.*

# Pièges et règles pour la maquette QCM : extraction de MJPC6-DETTES.md et MJPC6-journal.md

J'ai lu les deux fichiers en entier, par morceaux et sans en sauter. Je n'ai modifié aucun fichier.

Le fichier `PROTOCOLE-MAQUETTE.md` lui-même n'est pas dans ces deux fichiers. Seul son résumé y figure (DETTES n°12 · 26) : HTML autonome sans écriture, données réelles produites par un générateur, mots de Paul, infobulles, aucun code ni méta à l'écran, aucune boîte système, aucun bouton inerte, une version par livraison, pas de reconstruction au clic, texte jamais coupé, identités et non rangs, caractères français, Échap, chevauchements, moteur existant repris tel quel. Côté preuves : banc par le geste, banc unique, plusieurs tailles d'écran, épreuve des pièges, captures regardées, chiffres recomptés, 0 défaut.

Convention de source : « D » = MJPC6-DETTES.md (n° de dette ou ligne L), « J » = MJPC6-journal.md (date ou ligne L).

---

## 1. Les pièges retenus, et comment les vérifier dans le banc Playwright

### A. Méthode du banc et faux verts

1. **D n°11·31, n°11·52, n°11·60, J 03/09 (L18)** — Un banc passe par le geste, jamais par l'appel direct d'une fonction. La phrase de Paul : « une fonction sans chemin n'existe pas pour Paul ». Si un banc note « appel de fonction : déclaré », c'est une alerte à vérifier tout de suite par le geste.
   *Vérif :* chaque cas commence par un vrai `click`, `keyboard` ou `mouse`. Aucun `page.evaluate` ne doit déclencher une action de l'app.
2. **D n°11·30, n°11·31** — Une preuve dit ce qu'elle contient, pas seulement qu'elle existe.
   *Vérif :* relire l'état produit (texte du DOM, état JS exposé en lecture) et comparer les valeurs.
3. **D n°11·30, n°11·37, n°11·15 (note), J 01/08 M-PROMPT-1** — Un banc doit reproduire le vrai motif. Exemples payés : la même référence d'objet et non deux objets distincts, des clés au vrai format (`10h07` et non `10:07`), des stubs (fausses fonctions de test) qui ont la vraie signature (« un stub faux valide un code faux »).
   *Vérif :* les données du banc sortent du même générateur que la maquette.
4. **D n°11·33, J 20/08 (invariant à l'expression régulière sur-échappée), D L293 (garde aveugle sur 58 % du fichier), D n°11·03 et J 01/08** — Les faux verts. Un banc « mort » qui passe sur « (ligne absente) ». La règle : « une uniformité parfaite est une mesure suspecte ».
   *Vérif :* poser un piège (casser volontairement la maquette) et exiger du ROUGE. Toute assertion échoue si l'élément est introuvable, jamais de saut silencieux.
5. **D n°12·51** — Le banc d'insertion comparait des états vides des deux côtés.
   *Vérif :* poser une précondition non vide (au moins une réponse enregistrée) avant toute comparaison.
6. **D n°11·31, n°11·33, n°12·48, n°12·63** — Un banc unique enchaîne tous les bancs, échoue si un seul échoue et refuse un banc introuvable. L'audit d'affichage passe en premier, parce que le script peut mourir avant sa dernière ligne.
7. **D L340, J 04/08 (M-PROMPT-ARCHIVES)** — « Un délai fixe marche au banc et rate en classe ». Autre cas payé : un banc qui lisait avant que l'écran soit prêt.
   *Vérif :* `waitForFunction` sur une condition, avec une durée maximale, jamais de `waitForTimeout` fixe.
8. **J 09/08, D n°12·33** — Le capteur d'exceptions JavaScript fait partie du verdict.
   *Vérif :* `page.on('pageerror')` et les erreurs de console font échouer le banc.
9. **J 20/07 (reproche « purger doublons »), J 20/08** — Harnais en lecture seule stricte : libellé exact vérifié dans le code, jamais de `dialog.accept()` global, dialogues refusés, réseau bloqué.
   *Vérif :* `page.route('**', abort)` sauf `file://`, ce qui prouve que la maquette tient sans réseau.
10. **D n°12·43** — Un banc qui pose une sélection la pose à la souris. Un `user-select:none` cassait le surlignage sans que les bancs le voient, parce qu'ils sélectionnaient par script.
    *Vérif :* `mouse.down`, `move`, `up`.
11. **D L371** — « Une preuve qui réimplémente ce qu'elle vérifie ne prouve rien. »
    *Vérif :* le banc interroge l'écran, il ne recalcule jamais la règle.
12. **D n°11·49, n°11·51, J 04/08 (`dp-coller`/`diapo-coller`)** — « Une mesure à zéro ne prouve pas une absence. Chercher un nom, c'est supposer le nom. Il faut lire l'écran. » Un test qui cherche le mauvais identifiant donne un faux positif.
    *Vérif :* asserter sur le texte visible ou le rôle, plutôt que sur des noms internes.
13. **D n°11·54, n°12·33** — Un sélecteur qui rate après un repeint n'est pas un défaut du site. Autres artefacts payés : un gel laissé actif, un état saturé.
    *Vérif :* refaire la requête après chaque rendu et réinitialiser l'état entre deux cas.
14. **D n°12·51** — Un banc avait été écrasé par une boucle de copie.
    *Vérif :* contrôler l'empreinte de tous les bancs avant de livrer.
15. **D L356, J 20/08** — Matrice actions × état. Fuzz à graine fixe (exemple : 150 actions, graine 42, 0 violation).
16. **D n°12·153, J 06/10 13:22** — Le banc ne jouait que « bon binôme » et « mauvais refusé », jamais « mauvais code puis sortie ». Résultat : un voile sans sortie en classe.
    *Vérif :* jouer chaque voile jusqu'à sa sortie.
17. **J 21/07 (`renderChapitres` PROF)** — « Un chemin déjà conforme ne l'est que pour le cas qu'on avait en tête. » Tout état nouveau oblige à rejouer les anciens chemins dans cet état.
18. **J 06/10 (L15.1b-1l)** — Le banc doit porter toutes les données que l'écran lit. Sans les formes acceptées, des notes baissaient à tort.

### B. Captures

19. **D n°12·21, n°11·57, n°11·47 ; consultant (D L309) : « Tu as visualisé avant de livrer ? »** — Une capture n'est livrée que regardée, pour ce qu'elle prouve. Deux livraisons avaient été closes sans aucune capture.
    *Vérif :* au moins une capture par étape, chacune ouverte et regardée.
20. **D n°11·08** — Deux captures « différentes » étaient identiques bit à bit.
    *Vérif :* md5 de chaque PNG, aucun doublon.
21. **J 08/08 (trois captures sur six masquées par une alerte), J 31/07 (overlay des règles), D n°11·57 (le nom de la capture ne montrait pas son contenu), J 27/07 (légende trompeuse)**
    *Vérif :* avant chaque capture, `document.elementFromPoint` au centre de la zone doit renvoyer l'élément attendu, et aucun voile ne doit être visible.
22. **J 04/08** — « Une capture qui montre le bon contenu ne prouve pas qu'on est sur le bon écran. »
    *Vérif :* asserter l'identifiant d'écran (attribut `data-` de la vue).
23. **J 23/07** — « Une capture n'est pas une preuve ; ce qui prouve, ce sont les états mesurés. »
24. **D n°11·58 à 64** — Parcours complet par clics, d'un seul chargement, sur la version finale. Pas un assemblage d'états successifs.
25. **D n°11·59, n°11·64** — Une liste déroulante native dépliée ne se capture pas. Le format des dates suit la locale du banc.
    *Vérif :* poser `locale: 'fr-FR'` et `timezoneId: 'Europe/Paris'`.

### C. Affichage et mesures (débordement, chevauchements, défilement)

26. **D L321, L356, n°12·11, n°12·32** — Ce qui doit tenir sans défilement : à 1366×768 et 1920×1080, `scrollHeight` égal à `innerHeight` et `scrollY` à 0 après une tentative de défilement à 4000 px. Cinq tailles d'écran au banc. Cas payé : des notes qui débordaient de 9 px à 1875×868.
27. **D n°12·11** — 422 défauts trouvés au banc large. Causes : écran sans hauteur, colonnes sans `min-height:0`, `focus()` qui fait défiler.
    *Vérif :* après chaque clic, le `scrollTop` de la page et de chaque conteneur est inchangé et les rectangles restent stables.
28. **J 09/08** — `scrollIntoView` est banni : il fait défiler tous les ancêtres.
    *Vérif :* zéro occurrence hors commentaire, et positions mesurées avant et après chaque clic.
29. **Chevauchements payés :** D n°12·32 (étiquette sur titre, légende sur encart), J 22/07 (pastille de version sur un bouton), J 04/08 et J 20/07 (boutons flottants sur modale, quatre surfaces fixées en haut), D n°12·41 (le ✍ mordait le texte).
    *Vérif :* intersection des rectangles de tous les éléments visibles deux à deux, 0. Aucun rectangle de texte sous une pastille.
30. **Texte jamais coupé.** D tour 73 (« des suggestions doivent être lisibles entièrement »), tour 135 (« les titres … lisibles, pas à la verticale »), D n°12·56 (une carte qui ne défilait pas jusqu'au fond), D n°11·41 (0 bandeau qui déborde).
    *Vérif :* `scrollWidth <= clientWidth` et `scrollHeight <= clientHeight` sur tout élément texte qui ne défile pas.
31. **D n°12·123, J 03/10** — Un champ écrasé à 26 px par un bouton, dans une ligne sans retour à la ligne.
    *Vérif :* largeur minimale de chaque champ (200 px au moins).
32. **J 04/08** — À 390 px, le bouton de sortie d'un overlay bloquant était hors écran. Règle : « le contenu défile, les actions non ».
    *Vérif :* le rectangle de chaque bouton d'action est dans la fenêtre, à 390×844 et à 1280×800.
33. **J 06/08, J 20/07, J 21/07** — Cibles tactiles de 44 px, en hauteur ET en largeur, y compris les `div`/`span` qui ont un `onclick`.
34. **J 05-06/08** — Au tactile, le premier tap déclenche `:hover`. Des règles de survol qui déplacent la cible la font fuir sous le doigt (« appuyer plusieurs fois sur Ouvrir »). Ces règles vont sous `@media (hover:hover) and (pointer:fine)`.
    *Vérif :* contexte avec `hasTouch: true`, `tap` : l'action doit partir au premier tap.
35. **D n°12·161** — Sur une tablette 1280×800 en deux moitiés, il restait environ 265 px de texte. Le bandeau passe de 178 à environ 88 px.
    *Vérif :* mesurer la zone utile de chaque moitié.
36. **D tour 148** — Un trait de 1 px en `top:0; bottom:0` traversait tout l'écran.
    *Vérif :* aucun élément décoratif sur toute la hauteur.
37. **D n°12·43, n°12·68** — Jamais de `display` en style inline sur un conteneur piloté par une classe. Un style inline a aussi caché une colonne.
38. **D n°12·37, n°12·40, n°12·48 ; J 20/08 ; D n°11·10, n°11·14** — Collisions de noms. Classes CSS `.attente`, `.temoin`, `.voile`. Globales et classes `.on`, `.liste`, `.sel`, `.titre`, `.type`. Variable locale qui porte le nom d'une fonction. Règle : « toute nouvelle classe est préfixée et cherchée dans le gabarit avant d'être écrite ».
    *Vérif :* script d'unicité des classes, puis styles calculés mesurés après chaque bascule.
39. **D n°12·52, n°12·50 ; J 04/08 ; D L321** — Un remplacement de texte non vérifié. Cas payés : des règles CSS qui n'avaient jamais pris, une balise coupée par un patch, une fonction amputée.
    *Vérif :* si la maquette est générée, asserter la présence de chaque bloc attendu et sa taille.
40. **J 27/07, J 31/07** — Le CSS s'insère dans `<head>`, jamais avant « le dernier `</style>` » : des `</style>` vivent dans des chaînes JavaScript.
41. **D n°12·56** — Une position transmise en pixels entre deux écrans de hauteurs différentes ne tombe pas au même endroit. Elle voyage en proportion. Concerne la console et la vue tableau.
42. **D n°12·29, n°11·92** — Une heure affichée en UTC. On affiche en Europe/Paris.
    *Vérif :* `timezoneId` et comparaison avec `Intl`.
43. **D n°12·49, n°12·52, n°12·53** — `now()` ignorait le décalage d'horloge simulé. Des états ne se rafraîchissaient pas seuls (un tick toutes les 15 s).
    *Vérif :* `page.clock` et lecture de l'état sans aucun geste.

### D. Reconstruction au clic et état

44. **D n°11·102 (règles de `pont-fusion`)** — « Un clic déplace le halo, ne reconstruit rien. »
    **D L184** — La hauteur tirée d'un champ était perdue à chaque rendu.
    **J 01/10** — « Un redessin n'efface jamais la saisie. »
    **D n°12·69, n°12·37, n°12·57** — Le morph (mise à jour du DOM par réutilisation des nœuds) recycle les nœuds. Un geste branché sur un nœud doit lire l'élément du moment. L'état éditable et les classes d'état se reposent à chaque rendu.
    *Vérif :* prendre une référence (`JSHandle`) sur un nœud, cliquer, vérifier `isConnected` et l'égalité. Taper dans un champ, provoquer un rendu, vérifier que la valeur, le focus et la position du curseur sont conservés.
45. **D n°12·45, n°12·46, n°12·40** — Tout état se range par identifiant (`eid`), jamais par rang. Le numéro affiché est le rang. L'ordre est figé au lancement.
    *Vérif :* insérer un élément au milieu (simulation) et vérifier que rien ne bouge : réponses, journal, curseur.
46. **D n°11·102** — Le routage se fait par attribut `data-`, jamais par le libellé (l'accent de « Déroulé » cassait le routage).
47. **D n°12·180, n°12·103** — Revenir à l'endroit où l'on était, sans subir le rechargement. Dans la maquette, ce retour se joue sans recharger.

### E. Clavier

48. **D n°12·15, J (correction_dictee L6), D n°12·63** — Des raccourcis partaient depuis un champ : un `contenteditable` n'était pas reconnu comme champ. Maj+P tapé dans une réponse doit taper un P.
    *Vérif :* focus dans chaque champ, presser chaque raccourci, aucun effet.
49. **D n°11·59, n°11·63, J (correction_dictee L12)** — « La touche Échap ne ferme pas une fenêtre, elle ferme tout. » Échap ne ferme que la couche du dessus, et aucune touche ne passe à travers jusqu'à l'écran dessous.
    *Vérif :* modale ouverte, `Escape`, seule la modale se ferme.
50. **D n°12·53** — Une touche maintenue déclenchait en rafale (répétition automatique).
    *Vérif :* `keyboard.down`, attendre 1,2 s, `up` : un seul effet.
51. **D n°12·53, n°12·33, n°12·98** — Entrée doit garder le curseur dans le champ. Entrée valide, Échap annule. Mettre en tension avec la touche d'avance que Paul utilise déjà.
52. **D n°11·54** — Deux gestes rapides sur la même case donnaient 2 écritures. La parade : un verrou par clé.
    *Vérif :* double-clic rapide, un seul effet.

### F. Boîtes système, impression, voiles

53. **D n°12·26 (aucune boîte système), J 22/07 (7 `prompt` natifs ramenés à 0), J 20/08 (« un confirm bloque la page entière, tableau projeté compris »), J 31/07 (un `confirm` qui posait une question muette)** — Et pas de `window.print` dans une maquette (J 20/08).
    *Vérif :* un `addInitScript` remplace `alert`, `confirm`, `prompt` et `print` par des compteurs, qui doivent rester à 0. `page.on('dialog')` fait échouer le banc.
54. **D n°11·46** — Une modale à l'arrivée mangeait le premier clic.
    **D n°12·05** — Un voile recouvrait l'écran.
    **D n°12·60** — Un voile vide interceptait les clics, caché par un bouton flottant.
    *Vérif :* pour chaque bouton, `elementFromPoint` à son centre renvoie le bouton lui-même. Aucune modale à l'arrivée.
55. **D n°12·153** — Tout voile a une sortie (« ← Revenir »).
56. **D n°12·143** — Un toast disparaissait avant d'être lu. Il est remplacé par une carte qui reste, avec ✕.

### G. Infobulles

57. **D n°11·65, n°11·69 ; J 03/09 (L20)** — Paul : « tout codage doit être accompagné d'une passe de tooltips ». Les infobulles s'écrivent pour Paul dans trois mois : ce que le geste fait et ce qu'il coûte. Cas payé : 94 cliquables sur 100 sans bulle.
    *Vérif :* un banc qui échoue si un cliquable visible n'a ni `title` ni `aria-label` non vide.
58. **D n°11·70, n°11·71** — Un `title` ne s'affiche pas au tactile, et Paul travaille au téléphone. Question encore ouverte (mandat ⑬ légué).
    **D n°12·112, J L15f-b** — Côté élève, sur tablette : aucune consigne en infobulle, tout en clair (« plus d'infobulle élève »).
59. **D n°13·2** — L'infobulle d'un geste grisé ne commence pas par « Grisé : … ». Elle dit quoi faire.
    **D n°12·70** — Un refus grisé dit pourquoi.
60. **D n°12·200, n°12·207, n°12·211 ; n°11·66 ; J 01/08** — Des infobulles qui contredisent le code. Exemples QCM : le mode test annonce 3 élèves au lieu de 30 ; le mode de scoring est mal décrit.
    *Vérif :* chaque infobulle est confrontée au comportement joué.

### H. Boutons inertes, faux succès, libellés

61. **D n°12·26 ; J 21/08 (79 gestionnaires appelaient sans le bon préfixe : boutons morts) ; D n°12·33 (« joue tout, clique tout », 106 clics)**
    *Vérif :* cliquer chaque bouton visible. Il doit produire un effet observable, ou être désactivé avec sa raison.
62. **J 31/07** — Un libellé « Supprimer » qui ne supprimait rien.
    **D n°12·197** — Paul : « une fonctionnalité = un visuel, un bouton, un champ ».
63. **J 01/08 (« Terminé » malgré des échecs), J 29/07 (« enregistré » alors que rien ne partait), D n°11·47 (« Photo prise » en mode test alors que rien n'était enregistré), J 01/08 (un toast muet sur un booléen nu)**
    *Vérif :* le message affiché correspond à l'état réel.
64. **D tour 143, n°11·24** — Jamais un vide muet : l'écran dit ce qui manque.
65. **D n°12·177, J 31/07 (« prévenu, pas bloqué »), D n°11·36** — Le prix est dit avant le geste, et un geste irréversible passe par une garde.

### I. Tablette partagée en deux moitiés

66. **D n°12·180** — `off()` sans argument : quand une moitié cesse d'écouter, l'écoute de l'autre moitié est coupée aussi (prouvé avec firebase 8.10.1). Autre cas : une écoute jamais retirée effaçait la saisie d'autres tablettes après « Terminer la session ».
    *Vérif :* agir, puis quitter une moitié ; l'autre moitié reste intacte.
67. **D n°12·146, n°12·147, n°12·153 ; J 06/10** — La seconde moitié n'accepte que le binôme désigné. Voile « Ce n'est pas ta tablette : lève la main. » avec « ← Revenir ». Un élève refusé n'est jamais repris. Rien de l'autre moitié n'est montré.
    *Vérif :* aucune donnée de la moitié 1 dans le DOM de la moitié 2.
68. **D n°12·173, J 07/10** — Deux binômes sur deux tablettes : la seconde arrivée lit le message, la moitié exclue compte pour vide, et sa voisine n'annonce personne. Émoji selon les sexes : 👭 👫 👬, et 👥 si l'un est inconnu.
69. **D n°12·154, n°12·158, n°12·168, n°12·169** — Les binômes sont fixés à « Lancer ». Un élève absent, parti ou qui revient ne défait jamais un binôme déjà au travail.
70. **D n°12·151** — Deux élèves sur la même tablette n'ont jamais le même commentaire.
71. **D n°12·155** — Le clavier de l'app n'avait pas de chiffres : un bouton « 123 » ouvre les chiffres, recliqué (« abc ») il revient à l'AZERTY.
72. **D n°12·194, n°12·180** — Le raccourci de session MJPC (12 h) sur une tablette partagée fait entrer un élève sous le nom d'un autre.
73. **D n°12·157** — « Mode binôme » ou placement libre.
74. **D n°12·182, n°12·189** — Anti-triche : la moitié de l'un est gelée pendant que l'autre répond. On alterne qui commence. 3 s voilées avant chaque tour. Les choix n'apparaissent pas dans le même ordre pour le second.
75. **D n°12·111** — La note était visible derrière le voile du chrono : rien ne doit se voir derrière un voile.

### J. Le QCM et sa console

76. **J 20/07 (L629), D A·D-QCM-CLASSE, n°12·184** — Plus d'écran « Choisis ta classe » (redondant, et il expose les classes de test).
77. **D n°12·91** — Une classe s'affiche par son nom, jamais par sa clé (`3_dylan_bob`).
78. **D n°12·191, n°12·195** — Les choix ne s'affichent jamais au tableau. Les lettres existent dans deux ordres.
79. **D n°12·198, n°12·210** — En production 7.7.1 : la correction plante sur toutes les tablettes (`bonnes` non défini), et le téléphone devient vide dès qu'un élève répond (`mode` non défini).
    *Vérif :* jouer la correction et le pilotage au téléphone, par le geste, avec au moins une réponse.
80. **D n°12·199** — La valeur de la case « ✋ Réponse » n'est pas prise au passage automatique.
81. **D n°12·203, n°12·192, J 01/08** — Une seule note, la même partout. En mode partiel : 1/n de point par bonne case, −1/n par mauvaise, plancher 0, plafond.
82. **D n°12·204** — À la réouverture, l'élève ne voit plus ce qu'il avait coché.
    **D n°12·205** — Le mode partiel n'est jamais enregistré.
    **D n°12·201** — Le collage du JSON jette tout champ nouveau sans rien dire.
83. **D n°12·206** — Six gestes effacent sans passer par la corbeille.
84. **J 01/08 (L305)** — La pastille `APP_VERSION` du QCM était écrasée par un gabarit.
    *Vérif :* la version affichée correspond à la version réelle.
85. **D n°12·193** — Après l'envoi de la saisie papier, un rechargement renvoie à « Choisis ta classe ». La saisie devient une phase visible, avec son suivi.
86. **D n°12·192, n°12·196** — Le nombre de points de chaque question est visible tout au long. Récapitulatif question par question. Aucune note avant la saisie.
87. **D n°12·209** — Deux onglets montrent la même liste.
    **D n°12·208** — Le téléphone est une télécommande qui a toutes les infos.
88. **J 22/07 (L49-51) ; D n°12·86, n°12·94 ; J 31/07 (L370)** — Les listes de test du QCM portaient de vrais noms. Une collision de clés (« Élise » / « Elise ») a supprimé 7 codes. L'aide du QCM affichait les codes prof.
    Règles : élève de test jamais homonyme d'un vrai (collision jugée sur la clé), noms du type `ZZTEST`, aucun nom réel dans le code.

### K. Spécifique à la maquette

89. **D n°12·35, n°12·34, n°12·30, n°12·37** — Avant d'écrire un geste, lire celui de l'existant et le reprendre tel quel (« recopiés en moins bien, et de loin »).
    *Vérif :* comparer les styles calculés, existant contre maquette (34/34 dans le cas du tableau).
90. **D n°13·1, n°12·71** — Des exemples plausibles, jamais un état impossible. Une simulation ne se pose jamais sur un élément que les bancs exercent.
91. **D n°11·41** — Un cas absent des vraies données se montre par un paramètre de démonstration (`?demo=cheval`), sans rien prouver sur des données qui n'existent pas. Ce qui est provisoire est déclaré dans la maquette.
92. **J 04/08 (identifiant technique affiché), D n°12·65 (codes `c4-…`), D n°12·17 et J 25/08 (`litt-036`)** — Aucun code ni identifiant à l'écran.
93. **D n°11·41, n°11·42** — La maquette passe avant le code, puis STOP : rien n'est codé avant le mot de Paul.
94. **D n°12·36** — Partage des rôles. Gestes, écrans et composition se règlent dans la maquette. Hub, session, appareils et horloge réelle se règlent au mandat.
95. **D n°12·75, n°12·72, n°12·32** — La vue tableau. La liste des fonctions injectées au tableau est fermée : tout ce que le rendu appelle doit y passer. Le tableau gardait une copie prise à son ouverture : il faut lui envoyer l'état à chaque fois. Cas payé : un mur à hauteur nulle.
96. **D n°12·71, n°12·37, J 20/08** — Une alerte n'est pas du contenu : bandelette côté pilote, rien au tableau. La classe ne voit jamais une ligne vide. Les écrans vides restent muets au tableau.
97. **D n°11·38** — Une variable globale implicite (faute de frappe, sans `var`).
98. **D n°11·44, n°11·99** — Un compte de contrôle compte des occurrences, pas des noms (217 déclarations pour 216 noms). Vérifier la date d'un chiffre avant de le recopier.

### L. Caractères français

99. **J 04/08 (`atEsc`, 133 appels), J 07/08 (titre injecté dans un `onclick`, « neuvième occurrence »), J 07/08 (expressions régulières sur les apostrophes, « huitième occurrence »), D n°12·170 (trait d'union)** — C'est la famille de défauts la plus récurrente. Paul : « l'apostrophe, les tokens, c'est le symptôme permanent ». Règles : éprouver toute manipulation de chaîne en codepoints, toujours sur des cas piégeux français, jamais de titre dans un `onclick`.
    *Vérif :* jeu de données avec ’ ' « » … – — œ É et des mots comme « là-bas », « eux-mêmes ». Le rendu doit être identique au codepoint près et chaque bouton doit marcher.
100. **J 21/07 (M10)** — « Ton prof » est passé à travers le relevé parce que celui-ci était sensible à la casse. Tout relevé de mots interdits est insensible à la casse et à toutes les formes.
101. **J 29/07** — Les libellés s'accordent au singulier ou au pluriel selon le nombre réel.

---

## 2. Règles permanentes de Paul sur les textes vus par l'élève (citées mot pour mot)

**Ce que Paul a fixé lui-même**

- **D n°12·202 (L3081), n°12·174, n°12·184** : « jamais « va voir ton professeur » dans un texte vu par l'élève ; en classe, l'élève lève la main. Les mots nouveaux sont à donner par Paul. » Le texte actuel du QCM, `EleveLogin`, est fautif : « Ton code n'est pas encore enregistré. Viens me voir pour qu'on le mette en place. » Formulations déjà en place ou proposées : « Ce n'est pas ta tablette : lève la main. » (J 06/10) ; « Si tu as oublié ton code, lève la main. » (proposé, D n°12·174).
- **J 07/10 09:05, D n°12·175** : « il ne faut jamais que des bruts soient affichés à l'élève ».
- **D L309 (consultant)** : « Pas de consigne qui mette en cause le prof ! (je passe dans les rangs) ».
- **D n°12·17, J 09-12/09** : devant les élèves, Paul est « M. Meney » (règle écrite le 10/09), jamais « le professeur ». Sur le cahier de textes : « Donné le … par M. MENEY P. » (D n°12·39).
- **D n°12·189** : le verbe est « laisse », des deux côtés : « Laisse la tablette à X pour qu'il réponde sans que tu regardes. » Et : « les réponses ne s'affichent jamais au tableau. Uniquement sur les tablettes ».
- **D n°12·173** : « Tu es avec Lou : laisse cette tablette à quelqu'un d'autre et rejoins Lou. »
- **D n°12·192 (tour 588)** : « on ne dit plus que "trouvée au dernier moment" et agrémentée d'un signe + en vert visuel », partout, élève comme console.
- **D n°12·196** :
  - « uniquement dans ma console. ET pour l'élève, on la marque avec un terme plus pédagogique » ;
  - « dans les règles de l'attestation au début, l'élève doit avoir une explication claire et compréhensible de ce mécanisme, et la raison pédagogique » ;
  - « la note carotte » : aucune note visible avant la saisie, nulle part.
- **D n°12·186** : « il faut aussi changer le lexique des 4 niveaux » : l'échelle du socle remplace Faible / Moyen / Bien / Très bien.
- **D n°12·150** : « Quand tu as tout fini, recopie ce commentaire en vert sur ta copie. » Plus aucune mention de « à la maison ».
- **D n°12·164** : « sinon ils cliquent juste la case et ne lisent pas » : une case par engagement, la suivante paraît 5 s après.
- **D n°12·159** : la case d'un signe de ponctuation à retrouver affiche « sdp ».
- **D n°12·177** : « une garde pour éviter les faux gestes » ; texte de la garde : « Tu ne pourras plus répondre aux questions. Tu gardes ta note (x/5) ? », avec « Non, je continue » et « Oui, je garde ma note ».
- **D n°12·111, J L15f-b** : « Ta note de dictée s'affichera à la fin du chrono. »
- **J 29/07** : textes validés par Paul :
  - « Tu as plus de temps » (et non « Temps majoré ») ;
  - « Autrement dit » ;
  - « Tu peux faire seulement » ;
  - « Pour t'aider ».
  « Domaine du socle » et « Attendus de fin de cycle » restent tels quels : « le vocabulaire des programmes doit être nommé tel quel aux élèves ». Et : « Attendus de fin de cycle quand il y en a plusieurs, au sing quand il n'y en a qu'un. pas sorcier. »
- **J 21/07 (8.4.1)** : « il faut un bouton "afficher" pour le code, sinon un élève ne pourra pas savoir s'il a fait une erreur ou non ». Le mot plutôt que l'icône, pour des collégiens.
- **J 21/07** : le taux de détection « ne s'affiche JAMAIS côté élève ».
- **J 22/07** : l'extrait du texte des dictées est réservé au professeur, absent du DOM côté élève.

**Doctrine et règles notées dans les fichiers** (relevées par les consciences, sans citation directe de Paul dans ces deux fichiers)

- **J 07/08** : « des mots lus par les élèves ne doivent jamais être en dur ».
- **D lot 10 (L19)** : un « écran d'aide qui dit à l'élève ce qui le concerne et rien d'autre ».
- **J 05-06/08** : « ⚠ Non lié » pulsait en vue élève, du « jargon de chantier sous les yeux des élèves ». La vue élève reste neutre.
- **J 09/08** : « découpe automatique » est « un mot de machine sur un papier lu par un élève de 3e ».
- **J 31/07** : « Tu dois d'abord le créer avec Claude » était un message de professeur affiché à des collégiens, qui met le professeur en position d'inaccompli devant eux, contraire à la doctrine. Remplacé par « Cet outil ouvrira plus tard. »
- **J 21/07 (M10)** : un « Bravo » qui ne va pas avec la note affichée ; la passe des textes couvre tout l'écran élève, pas seulement le diff.
- **J L15.1b-1** : côté élève on écrit « autre », jamais « non reconnu ».
- **J 29/07** : pour un aménagement visible des voisins, la discrétion compte : « Pour t'aider » plutôt que « À garder sous les yeux ».

**Côté prof, utile pour la console**

- « T-5 » est du jargon : dire « la fin de l'heure » (tour 136).
- Le mot « figer » est interdit (tours 74-76).
- « les termes rencontre et réussite sont obscurs » (tour 42).
- « l'appoint ne veut rien dire » : dire « notion imprévue » (n°12·16).

---

## 3. Dettes n°12 · 179 à 211 (titre et statut)

Dans la file ordonnée du début du registre, le n°12 correspond à **M17a**, « en tout dernier de tout dernier » (purge et import des vraies classes).

| N° | Titre | Statut |
|---|---|---|
| 179 | QCM : deux élèves par tablette, « clonage » du binôme de la dictée | ouverte (propositions à valider) |
| 180 | QCM : consolider (redessin, retour à l'endroit sans subir le rechargement) | ouverte |
| 181 | QCM : constitution des binômes | ouverte (le classement est à trancher, tout se code d'un coup) |
| 182 | QCM : anti-triche, répondre l'un après l'autre | ouverte |
| 183 | QCM : temps de chrono et niveaux éditables, prompt à adapter | ouverte |
| 184 | QCM : « viens me voir » ; « Choisis ta classe » montre les classes de test | ouverte |
| 185 | QCM : temps par question et garde de débordement | ouverte |
| 186 | QCM : ce que l'archive des séances doit garder pour École Directe | ouverte, en partie tranchée (compétences, échelle du socle) |
| 187 | Dictée : plus de « Combien êtes-vous ? » | ✔ close, sans objet (le choix 1 ou 2 élèves reste) |
| 188 | QCM : déplacer des élèves entre binômes | ouverte |
| 189 | QCM : le second ne voit pas les réponses dans le même ordre | ouverte, en partie tranchée (« laisse », jamais au tableau) |
| 190 | QCM : la feuille imprimée de secours fait trop de pages | ouverte (question du nombre de pages posée) |
| 191 | QCM : jamais les choix au tableau | ouverte |
| 192 | QCM : un seul compte de points, récapitulatif question par question | ouverte (règle de note consolidée) |
| 193 | QCM : la saisie papier devient une phase visible, avec son suivi | ouverte |
| 194 | Dictée et QCM : le raccourci MJPC en « 1 élève » sur une tablette de classe | ouverte, dette commune, Paul décide |
| 195 | QCM : les lettres des choix dans deux ordres | ouverte |
| 196 | QCM : la note officielle ne suit pas sa propre règle | ouverte, remplacée par la règle de la 192 |
| 197 | QCM : « une fonctionnalité = un visuel » dans la console | ouverte |
| 198 | QCM : la correction plante sur les tablettes (7.7.1) | ouverte, à régler dans la livraison complète |
| 199 | QCM : la case « ✋ Réponse » n'est prise que par « ✋ Autoriser la réponse » | ouverte |
| 200 | QCM : des textes de l'app contredisent son code | ouverte |
| 201 | QCM : le collage du JSON jette tout champ nouveau, sans message | ouverte |
| 202 | QCM : « viens me voir » dans l'écran de connexion | ouverte |
| 203 | QCM : en mode partiel, la console compte en tout ou rien | ouverte |
| 204 | QCM : la réouverture | ouverte (à trancher, cadrage 331) |
| 205 | QCM : le mode partiel n'est jamais enregistré | ouverte |
| 206 | QCM : six gestes effacent sans corbeille | ouverte |
| 207 | QCM : d'autres textes faux, en plus de la 200 | ouverte |
| 208 | QCM : l'adresse `#mode=prof` ouvre la console sans clé | ✔ close, sans objet (Paul : le téléphone est une télécommande, on laisse ainsi) |
| 209 | QCM : deux onglets pour la même liste | ouverte |
| 210 | QCM : le téléphone devient vide dès qu'un élève répond (7.7.1) | ouverte, à régler dans la livraison complète |
| 211 | QCM : l'infobulle du mode test annonce 3 élèves, il y en a 30 | ouverte |

---

## 4. Lignes lues

- **MJPC6-DETTES.md : 3090 lignes sur 3090** (692 879 octets).
- **MJPC6-journal.md : 1068 lignes sur 1068** (332 320 octets).
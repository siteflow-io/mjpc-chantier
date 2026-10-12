# p8-5f — la diapo trop pleine se lit en pages, jamais hors du cadre
*Exécutant, 12/10/2026, d'après `MANDATS/COMPLEMENT-DEROULE-P8-5f.md` (conscience n°13, tours 51-52, validé par Paul le 12/10, tour 53). Branche `deroule/p8-5f`, partie de `deroule/p8-5e`. Règle la dette n°13 · 16.*

## Ce que ça change pour la classe
- **En classe**, une diapo trop pleine se lit page par page, au pilote comme au tableau : « page 1 / 2 » à l'arrivée, la page passe à 2 toute seule quand ▶ dévoile le premier élément de la page 2, ◀ la ramène, la molette et Maj+←/→ changent de page. **Rien ne sort jamais du cadre**, ni par le haut ni par le bas.
- **Dans l'atelier**, Paul voit la diapo en pages, comme la classe la verra : en écrivant sous le dernier bloc, il est sur la dernière page, le curseur dans sa ligne, et pas une lettre ne se perd quand la frappe fait passer la ligne sur la page suivante.
- **Rien ne se coupe seul** (règle 0.4, inchangée) : « À régler » et « Sur la forme » disent « Diapo trop pleine … Couper la diapo ici » ; c'est Paul qui coupe.
- Une ligne seule plus haute que la diapo (un paragraphe sans Entrée) est ancrée en haut et coupée en bas, jamais centrée ; « À régler » le dit.

## La base et son md5
- Base : la livraison p8-5e, gabarit `v9c15p8-template.html` md5 `e743e587dee5ddc9e473953eb61c45ff`, maquette md5 `f2f9a3215f211b7d85da40f76b36c3f2` (ceux de la NOTE p8-5e). Avant toute modification, `regen.sh` (p8-5e) les a refaits à l'identique dans cette machine.
- `regen.sh` refait toute la chaîne jusqu'à **p8-5f** ; avant d'appliquer p8-5f, il vérifie octet pour octet chaque gabarit livré, de p8-2 à **p8-5e**. Sa sortie est dans `sorties/regen.txt`.
- Les changements sont tous dans **`patch-p8-5f.py`** (pas de fichier `p8-5f.js`) ; le code p8-5c (`p8-5c.js`) et les autres fichiers de la chaîne sont repris identiques.

## Ce que j'ai mesuré avant de coder (sur la base p8-5e, à 1280 × 800)
Huit lignes tapées sous le dernier bloc de la diapo 1, dans l'atelier : la police descend au plancher (18,56 px), le corps déborde (561 px pour 408), **aucune page**, le premier élément à −111 px dans l'atelier et à −94 px au pilote, heure lancée ; 4 éléments sur 15 hors du cadre. Les chiffres de la conscience (T51) sont retrouvés. Quatre causes, dont trois que la conscience n'avait pas encore vues :
1. **La mesure par bloc** (vue par la conscience) : `paginer` lisait `offsetTop`, relatif au bloc (`.mur .bloc{position:relative}`) ; dans l'atelier, `.bloc-edit` (lui aussi `position:relative`) fait du bloc en cours d'édition l'`offsetParent` de ses lignes : même effet.
2. **Le corps défilé** : le texte ne « sort par le haut » que parce que le corps est défilé (`scrollTop` 136 au pilote, 153 dans l'atelier). Deux origines : la dernière ligne de `rendre` le défilait jusqu'en bas quand un bloc était actif, et le navigateur le défile lui-même pour montrer le curseur dans un conteneur `overflow: hidden`.
3. **L'atelier ne garde jamais ses pages** : `rendre` y travaille sur une copie de l'état (`Object.assign`, tout dévoilé) ; les pages calculées sur la copie ne revenaient pas à `S.pagesCourantes` : ni compteur, ni molette, ni Maj+←/→.
4. **La place d'une page était surestimée** (trouvé au banc, une fois la cause 1 réglée) : chaque page avait `H − base`, où `base` est la hauteur de l'étiquette de l'activité + 8 px ; mais la mesure part de la première ligne de la liste, et entre le haut du corps et elle, il y a aussi la marge du corps et le titre du bloc (« Observe, discute… ») : la page 1 prenait 45 px de trop, sa dernière ligne finissait à 435 px pour 408. Ce défaut est dans la base ; il était masqué par la cause 1.

## Les décisions
1. **La mesure par rapport au corps** (point 2) : `p85fHaut(l, corps)`, le cumul des `offsetTop` jusqu'au corps (insensible au zoom du tableau et au défilement) ; si la chaîne ne passe pas par le corps, les boîtes rendues, ramenées à l'échelle. Une page coupe entre deux lignes, où qu'elles soient.
2. **Chaque page est vérifiée sur ses boîtes réelles** : après la première coupe, chaque page est montrée et mesurée ; si une ligne passe la marge du bas du corps, la page s'arrête avant elle, et la suite rejoint la page suivante, qui se mesure à son tour. Titres, consignes et écarts entre blocs sont ainsi comptés tels qu'ils s'affichent sur la page. Une ligne seule trop haute reste seule sur sa page.
3. **Rien ne sort jamais du cadre** (point 3) : le corps n'est plus jamais défilé. `rendre` le remet en haut (`scrollTop = 0`) au lieu de le défiler jusqu'en bas, et un écouteur de défilement le ramène en haut quand le navigateur le défile pour montrer le curseur. Quand une page déborde encore (une ligne seule plus haute que la diapo), le corps reçoit `p85f-ancre` : ancré en haut, coupé en bas. J'ai d'abord essayé `overflow: clip` ; je l'ai retiré, parce qu'il change la façon dont `scrollHeight` compte la marge du bas, et donc la police de **toutes** les diapos (21,85 → 22,85 px sur la diapo 1, intacte) ; la mesure du corps est restée celle d'aujourd'hui.
4. **Dans l'atelier, les pages aussi** (point 4) : les pages calculées sur la copie de l'état reviennent à l'état du pilote (compteur, molette, Maj+←/→) ; la page suit la ligne qui a le curseur (`pageDeSuivi`) ; sans curseur dans la diapo, la page affichée reste. Pendant la frappe, quand la ligne tapée passe sous le cadre (ou que la diapo commence ou cesse de déborder), la diapo est redessinée (`p85fSuivreFrappe`) : la page suit la ligne. Le redessin ne touche pas l'élément qui a le focus ; le cadre et la barre du bloc en cours d'édition sont remis, comme au focus. Une diapo plus haute que la page dans l'atelier se parcourt comme en classe : molette, Maj+←/→.
5. **Le curseur va toujours sur une ligne visible** (règle du redessin) : quand Entrée, Tab ou Échap envoient le curseur sur une ligne d'une autre page, `focaliser` affiche d'abord la page de cette ligne, puis pose le curseur. Sans cela, le curseur tombait sur une ligne cachée et la frappe allait au début de la ligne d'avant (trouvé au premier passage de mon banc de frappe : « Ligne 6…Ligne 5… » dans un seul élément).
6. **Le tableau à la même page et à la même police que le pilote** (point 5) : le tableau reçoit les pages du pilote (`et.pages`) et les applique sans repasser par `paginer`, donc sans réduire sa police : à la page 1, trois lignes passaient sous son cadre (trouvé au banc). Le pilote lui passe la police qu'il a trouvée, en part de la hauteur de la diapo (`et.policeRatio`) ; le tableau la rapporte à sa propre hauteur. `p85fHaut` passe au tableau (n°12 · 75).
   Les pages passent **par identité**, plus par rang : le tableau n'a pas les mêmes lignes que le pilote (un champ de réponse non dévoilé n'y est pas rendu), donc « la 9ᵉ ligne » n'y est pas la même. Le pilote donne aussi chaque page comme une liste de clés (`et.pagesP`, la clé d'une ligne : son `data-p`, ou pour un champ de réponse son bloc, son rang et son élément — `p85fCle`) ; le tableau retrouve ses propres lignes par ces clés. `p85fCle` passe au tableau.
7. **Au pilote, un champ de réponse ne fait suivre la page que dévoilé** : `pageDeSuivi` prenait tout champ de réponse (`data-r`) pour « le dernier élément dévoilé », même pâle (`.pas`) : sur une diapo de questions en pages, le pilote affichait la page 2 à 0 dévoilé. Il compte maintenant comme les autres éléments : dévoilé seulement.
8. **Ce qui ne change pas** : la règle 0.4 et « Couper la diapo ici » ; `appliquerPages` ; la répétition, les notes, la mise en forme, la poignée ; le récit et la copie ; le curseur « texte au tableau ». La zone « ✎ clique ici et écris » reste collée en bas du corps (`position: sticky`, p8-4) : sur une ligne seule trop haute, le texte coupé passe dessous, comme prévu par p8-4.

## Ce qui a été modifié, compté
`patch-p8-5f.py` fait 16 remplacements, chacun exigé une fois. Quatre noms nouveaux, préfixés `p85f` et cherchés dans le gabarit avant d'être écrits (absents ; `p8f` ne convenait pas : `data-p8forme`, `p8fait` existent) : `p85fHaut`, `p85fSuivreFrappe`, `p85fCle`, la classe `p85f-ancre` (et la propriété d'état `et.pagesP`, cherchée aussi). Tailles relevées par le patch (`sorties/regen.txt`) ; j'ai relu chaque fonction en entier.

| fonction / endroit | avant | après | quoi |
|---|---|---|---|
| `paginer` | 1 633 o / 11 lignes | 2 800 o / 12 | la mesure par rapport au corps ; chaque page vérifiée sur ses boîtes réelles ; la police (`et.policeRatio`) et les pages par identité (`et.pagesP`) passent au tableau |
| `pageDeSuivi` | 454 o / 3 | 932 o / 4 | dans l'atelier, la page de la ligne qui a le curseur (ou qui va le recevoir) ; au pilote, un champ de réponse ne compte que dévoilé |
| `rendre` | 17 717 o / 53 | 18 575 o / 54 | l'état reçu gardé (les pages de l'atelier reviennent au pilote) ; le corps jamais défilé, `p85f-ancre` ; le tableau retrouve les pages du pilote par identité et les applique à sa police |
| `focaliser` | 365 o / 1 | 612 o / 1 | la page de la ligne d'abord |
| `ecrireDansDiapo` | 505 o / 1 | 561 o / 1 | dans l'atelier, la frappe suit sa page |
| `appliquerPages` | 900 o / 4 | 900 o / 4 | inchangée |
| `p85fHaut` (nouvelle) | — | 412 o / 1 | la hauteur d'une ligne dans le corps |
| `p85fSuivreFrappe` (nouvelle) | — | 960 o / 1 | redessiner quand la frappe change de page ; le cadre et la barre du bloc en cours d'édition remis |
| `p85fCle` (nouvelle) | — | 194 o / 1 | l'identité d'une ligne de page, la même au pilote et au tableau |
| écouteur de défilement (nouveau) | — | 1 ligne | le corps revient en haut |
| CSS | — | `.mur .corpsd.p85f-ancre{justify-content:flex-start}` | ancré en haut quand une page déborde ; jamais de `display` en ligne |
| liste des fonctions du tableau | — | + `p85fHaut`, `p85fCle` | |

## Les bancs, comptés
- **`test-p8-5f`** (nouveau, **72 vérifications** comptées par le banc), par la souris et le clavier, **à 1280 × 800 et à 1920 × 1080** :
  - **A, atelier** : diapo 1, huit lignes tapées sous le dernier bloc (au clavier, 2 ms entre les touches) → « À régler » compte une ligne « trop pleine » de plus (0 → 1 : le site ne coupe pas seul) ; le mur dit « page 2 / 2 » ; la page a changé pendant la frappe ; la ligne tapée est sur la page affichée ; le curseur reste à la fin de la ligne tapée ; les huit lignes sont entières dans la trame (rien de perdu) ; aucun élément rendu hors du cadre de `#mur`, corps non défilé ; Maj+← (le curseur sorti de la diapo par un clic sur l'en-tête : dans un texte, Maj+← sélectionne) → « page 1 / 2 ».
  - **B, pilotage, heure lancée** : « page 1 / 2 » à 0 dévoilé ; ▶ un à un : rien hors du cadre après chacun ; la page passe à 2 toute seule au ▶ qui dévoile le premier élément de la page 2 (le 10ᵉ), et le dernier élément dévoilé est sur la page affichée ; ◀ → page 1 ; la molette → page 2 ; rien hors du cadre à chaque étape.
  - **C, la fenêtre du tableau** (ouverte par « ⧉ Tableau », 1280 × 720) : la même page que le pilote à chaque étape (2, puis 1 après ◀, puis 2 après la molette), rien hors de son cadre.
  - **D, un seul bloc** : des lignes ajoutées par Entrée dans l'unique bloc de la diapo 1 (6 → 14 éléments, toujours un bloc) → en pages à l'atelier et au pilote, rien hors du cadre, la frappe entière, le curseur à la fin de sa ligne.
  - **E, la ligne seule trop haute** : un paragraphe de 22 lignes (1 879 caractères) tapé sans Entrée → entier dans la trame ; ancré en haut (`p85f-ancre`), corps non défilé, rien au-dessus du cadre, coupé en dessous ; le curseur à la fin ; « À régler » le dit (0 → 1) ; au pilote, rien au-dessus du cadre à aucun ▶.
  - **F, la saisie tient** : vérifié en A, D et E, à chaque largeur (texte entier, curseur à sa place, alors que la page change pendant la frappe).
- **Ce que le complément proposait et que la maquette n'a pas** (point 8, non-régression à un bloc) : « une diapo à un bloc que la police au plancher ne fait pas tenir (la maquette en a, ou le curseur texte au tableau à 52 pt sur la diapo 7) ». Mesuré à 1280 × 800, heure lancée : **la diapo 7 tient sans page à 52 pt** (3 éléments) ; aucune diapo à un bloc de la maquette ne déborde, ni à 32 ni à 52 pt (balayage des 23 diapos de la séance, sur la base comme sur p8-5f). Le cas est donc fabriqué par le geste (D). Le balayage montre aussi deux mesures que j'ai vérifiées et qui ne sont pas des débordements : la légende des diapos « Tableau 1 à 5 », mesurée avant que sa taille soit posée, finit exactement au bas de la diapo une fois posée (489 = 489 px, capture regardée) ; le texte du cahier de textes à 52 pt est dans sa propre carte qui défile (`.ed-carte`, voulu).
- **Deux bancs recalés**, chaque ligne commentée dans le banc (« p8-5f : … »), parce que leurs diapos sont désormais en pages dans l'atelier, ce que le complément demande ; aucune vérification retirée :
- **`test-p8-4-ecrire`** (deux lignes) :
  1. « la question changée de type a les classes d'une question créée par le menu » : les classes d'état (`pas`, `neuf-vu`, `spot-on`…) étaient déjà ignorées ; `hors` (l'état de page) l'est aussi. La diapo de ce banc déborde de 12 px (564 pour 552) une fois la question ajoutée : dans l'atelier, elle est maintenant en pages, et une ligne porte `hors`. La structure et les autres classes sont toujours comparées.
  2. « ▶ dévoile les questions une à une au tableau, comme au pilote » : le tableau comptait les questions **affichées** (`display` ≠ `none`), le pilote les questions **dévoilées** (`.q:not(.pas)`) ; avec deux pages, une question dévoilée peut être sur l'autre page. Les deux côtés comptent maintenant les questions dévoilées ; la même page des deux côtés est vérifiée par `test-p8-5f` (C).
- **`test-p3-p7`** (une ligne) : sur la diapo 7, le banc duplique un bloc, le passe en « grand », le copie et le colle : trois blocs dont deux « grand », la diapo ne tient plus (trois pages) et le titre du troisième bloc est sur la page 3, caché dans l'atelier ; le clic droit y attendait 30 s. Le banc va maintenant à cette page **par la molette** sur le mur, comme Paul, puis fait le même clic droit et les mêmes vérifications (« Couper la diapo ici », etc.).
- Inchangés : les 30 autres bancs. **33 bancs dans le banc unique.**

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`
- Lancé le 2026-10-12 à 08:45 (heure de Paris) : node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37.
- Maquette jouée : md5 `c298a93cc31b1aaae1ac7ab8fa87bcfd`.
- **33 bancs, 33 × « fin : 0 défaut(s) », « TOUS LES BANCS : 0 défaut »**, en un passage ; aucune erreur de page.
- Les passages précédents, sur des maquettes intermédiaires, ne sont pas joints : le premier a trouvé les défauts 8 à 10 (`test-p8-4-ecrire`), le deuxième les défauts 11 et 12 (`test-p2-p7`, `test-p3-p7`) ; le troisième était à 0 sur cette maquette, mais j'avais envoyé la sortie console du script dans son propre fichier, ce qui en écrasait l'en-tête : il a été rejoué tel que prévu, c'est celui-ci.

## Les captures (regardées, écran entier) — les chiffres sont dans `captures/MESURES-p8-5f.txt`
| capture | ce qu'elle prouve |
|---|---|
| `p8-5f-atelier-page-2-sur-2.png` | l'atelier, diapo 1, après huit lignes tapées : « page 2 / 2 » en bas à droite, la ligne tapée (Ligne 8) sur la page affichée, le curseur dedans (surlignée), rien hors du cadre ; « Sur la forme » dit « Diapo trop pleine … Couper la diapo ici » |
| `p8-5f-pilote-page-1-sur-2.png` | heure lancée, la même diapo à 0 dévoilé : « page 1 / 2 », l'étiquette et le titre en haut, les lignes pâles (non dévoilées), la dernière ligne de la page au-dessus de la marge du bas |
| `p8-5f-pilote-page-2-sur-2.png` | après dix ▶ : « page 2 / 2 », la Ligne 4 dévoilée en tête de page, la suite pâle ; 10 / 14 dévoilés |
| `p8-5f-tableau-page-2-sur-2.png` | la fenêtre du tableau au même moment : « page 2 / 2 », seule la ligne dévoilée paraît, rien hors du cadre |
| `p8-5f-ligne-trop-haute.png` | un paragraphe de 22 lignes sans Entrée, seul sur sa page (« page 2 / 2 ») : il commence en haut sous l'étiquette, il est coupé en bas, rien au-dessus du cadre ; la zone « ✎ clique ici et écris » reste collée en bas (p8-4) |

## Les défauts trouvés et corrigés (avec leur cause)
1. **Le texte sortait par le haut** : causes 1 à 3 ci-dessus. Corrigé : décisions 1, 3, 4.
2. **La page 1 prenait 45 px de trop** (cause 4, dans la base) : la place d'une page oubliait la marge du corps et le titre du bloc. Corrigé : décision 2.
3. **La frappe allait dans la ligne d'avant** (trouvé au premier passage de mon banc de frappe, introduit par mes premiers changements) : après Entrée, la ligne neuve tombait sur une page non affichée, le curseur n'y entrait pas. Corrigé : décision 5.
4. **Ma première boucle de mesure laissait la page sur la dernière mesurée** (trouvé au banc : « page 2 / 2 » à 0 dévoilé, Maj+← sans effet). Corrigé : la page d'avant est remise après la mesure.
5. **Le tableau à la police pleine** (trouvé au banc, à la page 1 du tableau) : cause et correction en décision 6.
6. **Un effet de bord écarté** : `overflow: clip` changeait la police de toutes les diapos (décision 3). Retiré avant livraison.
7. **Un faux défaut de mon banc** : ses lignes de résumé écrivaient « 0 hors du cadre » en dur ; elles écrivent maintenant les nombres mesurés.
8. **Le tableau sans les questions** (trouvé au premier banc unique, `test-p8-4-ecrire`, 3 défauts) : les pages passaient par rang ; le tableau n'ayant pas les champs de réponse non dévoilés, ses rangs ne désignaient pas les mêmes lignes et il cachait les questions. Corrigé : les pages par identité (décision 6).
9. **La page 2 à 0 dévoilé sur une diapo de questions** (même passage) : cause et correction en décision 7. Le défaut est dans la base, masqué tant que la diapo n'était pas en pages.
10. **Deux lignes de `test-p8-4-ecrire` à recaler** (même passage) : voir « Les bancs, comptés ».
11. **Le cadre du bloc perdu pendant la frappe** (trouvé au deuxième banc unique, `test-p2-p7` : la barre ▲ ▼ du bloc introuvable) : quand la frappe redessine la diapo (`p85fSuivreFrappe`), le redessin (`morph`) ne touche pas le texte qui a le focus mais remet la classe de son bloc : le cadre pointillé (`bloc-edit`) et la barre du bloc disparaissaient, et ne revenaient qu'au prochain focus. Corrigé : après ce redessin, ils sont remis comme au focus. De plus, l'état « déborde » est posé au rendu (`_p85fDeborde`), pour que la première touche tapée sur une diapo qui déborde déjà ne redessine pas pour rien.
12. **`test-p3-p7` ne trouvait plus le troisième bloc** (même passage) : ce n'est pas un défaut du site — la diapo est en pages dans l'atelier, comme demandé ; le banc est recalé (ci-dessus).

## Ce qui est simulé
Rien de nouveau.

## Ce qui reste
Rien de cette livraison. Hors d'elle : le récit et la copie (n°13 · 8), le curseur « texte au tableau » (n°13 · 12).

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `c298a93cc31b1aaae1ac7ab8fa87bcfd`
- gabarit `v9c15p8-template.html` : `593d0709a8309cf1d4ad72aecb3a11e3`
- tous les fichiers livrés : `EMPREINTES.md5`, vérifié par `md5sum -c` avant l'envoi.

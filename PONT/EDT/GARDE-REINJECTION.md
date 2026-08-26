# LOT 2bis — GARDE DE RÉINJECTION (décision de Paul, 26/08) — à faire dans ③b
Paul, verbatim : « eh bien il faut coder une garde: quand je bricole à la main, le site enregistre. quand je réinjecte une nouvelle grille, le site détecte, et là il me dit de sortir le json du calendrier actuel (celui avec mes modifs) de le donner à l'ia, et qu'elle fasse la comparaison pour ensuite me conseiller. l'idée est celle là, si on peut faire plus simple, on fait plus simple. »

**Ce que ça change pour la classe** : Paul ne perd jamais un réglage qu'il a posé à la main, et il n'a pas à se souvenir de ce qu'il a bricolé trois mois plus tôt.

## ① LE SITE ENREGISTRE CE QUI EST FAIT À LA MAIN
Toute modification à la main d'un objet de l'EDT (période ajoutée, renommée, datée, supprimée, réordonnée ; créneau modifié ; case de grille modifiée ; appariement de classe) marque l'objet : `mainMaj` (horodatage) et une liste `mainJournal` — une ligne par geste : date, objet, geste, valeur avant, valeur après. C'est la mémoire du bricolage, et c'est aussi le journal que l'EDT montre déjà pour les décisions horaires : même patron, même endroit.

## ② À LA RÉINJECTION, LE SITE DÉTECTE ET S'ARRÊTE
Quand une injection réécrirait un objet **qui porte des modifications à la main**, l'écran de vérification le dit avant tout geste, précisément (ce que la ③a fait déjà pour les périodes, étendu à tous les objets) : ce qui serait retiré, ce qui serait changé, ce qui serait gardé. Deux boutons seulement : **« Injecter quand même »** et **« Comparer avec l'IA d'abord »**.

## ③ « COMPARER AVEC L'IA » — le geste de Paul, en deux clics
Le bouton **copie dans le presse-papiers** un bloc prêt à coller à l'IA, fait de trois choses : (a) une consigne courte, écrite par toi, qui dit à l'IA ce qu'on attend d'elle ; (b) le **JSON actuel du hub** (avec les modifications à la main et le `mainJournal`) ; (c) le **JSON qu'on s'apprête à injecter**. Paul colle, l'IA compare et conseille, Paul revient avec un JSON corrigé qu'il injecte par la voie normale. Aucun appel réseau depuis le site, aucune IA appelée par le code : le site prépare, Paul décide.
Le même bouton existe **sans injection en cours** : « Sortir le JSON actuel » (le hub tel qu'il est, modifications comprises), pour que Paul puisse toujours donner l'état réel à une IA.
La consigne (a), à rédiger par toi, dit en substance : voici l'objet en service et ce que le professeur y a modifié à la main ; voici l'objet qui arrive ; dis-lui ce qui serait perdu, ce qui serait doublé, ce qu'il faut garder, et rends un JSON unique prêt à injecter, sans rien inventer.

## ④ PLUS SIMPLE, SI ÇA MARCHE
Paul : « si on peut faire plus simple, on fait plus simple. » Le plus simple est ceci, et c'est ce que je demande : **le site ne fusionne jamais tout seul** ; il enregistre, il détecte, il montre, et il prépare le bloc pour l'IA. Trois fonctions, pas davantage : `edtMarquerMain`, `edtDifferentiel(objetActuel, objetEntrant)`, `edtBlocPourIA(objet)`.

## ⑤ PREUVES EXIGÉES
Bricoler à la main (renommer une période, ajouter une période, changer un horaire) → `mainMaj` et `mainJournal` écrits, une ligne par geste, valeur avant/après · réinjecter la même grille → l'écran annonce le différentiel exact, les deux boutons apparaissent · « Comparer avec l'IA » → le presse-papiers contient la consigne + les deux JSON, mesuré par sa longueur et son premier objet · « Injecter quand même » → l'objet est remplacé, le `mainJournal` **conservé** (l'histoire ne s'efface pas) · un objet sans modification à la main → aucune annonce, injection directe comme avant · « Sortir le JSON actuel » hors injection → le hub tel quel.
Mot : **continuer** (③b, avec cette garde).

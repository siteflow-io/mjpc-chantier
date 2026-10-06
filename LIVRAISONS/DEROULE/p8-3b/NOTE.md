# p8-3b — un trait ne passe jamais derrière une autre notion (T11)
*Exécutant, session cloud de Claude Code, 06/10/2026. Complément `MANDATS/COMPLEMENT-DEROULE-P8-3.md` (C13, tours 17-18), lu après le mandat `MANDATS/MANDAT-DEROULE-MAQUETTE-P8.md` (version 3), qui reste en vigueur en entier. Branche `deroule/p8-3b`, partie de `deroule/p8-3`.*

## En une ligne
**Le banc unique est à 0** : 26 bancs, 26 « fin : 0 défaut(s) », « TOUS LES BANCS : 0 défaut ». La vraie carte se coupe en **5 morceaux, comme avant**, et **chacun tient** (0 · 0 · 0 · 0 · 0). En p8-3, deux de ces cinq morceaux avaient des traits qui passaient derrière une notion.

## Ce que ça change pour la classe
Un schéma ne dit plus de lien faux. Avant, sur « Figures d'analogie », les traits vers « personnification » et « métaphore » passaient derrière « comparaison » : un élève pouvait croire que ces deux notions dépendaient de « comparaison ». Maintenant, l'écartement traite ce trait comme un contact et pousse la bulle en cause. Chaque trait va de sa famille à sa notion sans passer derrière une autre bulle. Le même cas se trouvait sur la carte d'essai des formes : le trait de « comparaison » passait derrière « métaphore ». Il est réglé aussi (`captures/p8-2-carte-*`, voir plus bas). Rien d'autre ne change : 32 / 26 pt, la place « plein », le cadre visible comme limite, la mesure.

## La base et son md5
- Base : le gabarit livré en p8-3, `../p8-3/v9c15p8-template.html` (md5 `37a1ab5daaf33d1adf3c334055e47451`, celui de la NOTE et de `EMPREINTES.md5` de p8-3).
- `regen.sh` refait toute la chaîne : gabarit p7 → patch p8-2 → patch p8-3 → **patch p8-3b** → générateur `T159`. Il vérifie octet pour octet que les gabarits p8-2 et p8-3 qu'il produit sont ceux qui ont été livrés, avant d'appliquer p8-3b. Sa sortie est dans `sorties/regen.txt`.
- **La maquette livrée** : `maquette-pilotage-ordi-v9c15p8-manipulable.html` (md5 `f3b4eb2b5dbf31842dcad4a5b520e74a`).
- Son gabarit : `v9c15p8-template.html` (md5 `74eab91f63045e7daf7d1cd6b99133de`).
- Ses patches : `patch-p8-2.py` (+ `p8-moteur.js`), `patch-p8-3.py` (+ `p8-3-gestes.js`) et `patch-p8-3b.py`.
- `p8-moteur.js` est la copie de p8-2, à l'identique. Il porte donc l'**ancien** `p8Separe`, et c'est `patch-p8-3b.py` qui le change dans le gabarit.

## Ce qui a été modifié, compté
`patch-p8-3b.py` fait 8 remplacements. Chacun doit se trouver une fois exactement dans le gabarit, sinon le patch s'arrête. Le patch écrit les tailles (`sorties/regen.txt`). Après les remplacements, j'ai relu chaque fonction en entier.

| fonction | avant | après | quoi |
|---|---|---|---|
| `p8Separe` | 2 505 o / 48 lignes | 3 528 o / 59 lignes | T11 (le détail ligne par ligne est plus bas) |
| `p8SepCoupe` (nouvelle, nom cherché dans le gabarit avant d'être écrit) | — | 371 o / 5 lignes | le segment p → q passe-t-il derrière la boîte de la bulle ? (découpage du segment par la boîte, Liang-Barsky) |
| `p8Carte` | 1 616 o / 32 lignes | 1 732 o / 32 lignes | passe ses traits à `p8Separe` (centre → famille, famille → notion) |
| `p8Frise` | 1 975 o / 29 lignes | 2 160 o / 29 lignes | passe ses traits : l'axe (aucune bulle à ses bouts) et le trait de chaque point de l'axe à sa bulle |
| `p8Arbre` | 1 404 o / 23 lignes | 1 823 o / 25 lignes | passe ses traits : la courbe de chaque nœud vers son parent, **la même que celle qui est dessinée**, en 16 segments |
| `p8Cycle` | 1 982 o / 30 lignes | 2 363 o / 32 lignes | passe ses traits : la flèche courbe de chaque étape vers la suivante, la même que celle qui est dessinée, en 16 segments |
| liste des fonctions du tableau | — | +12 o | `p8SepCoupe` passe au tableau avec `p8Separe` (T7, n°12 · 75 : la liste est fermée) |

### Chaque ligne changée de `p8Separe`, avec sa raison
1. `function p8Separe(N,W,H,marge,u,liens){`. **Raison** : T11 a besoin des traits du dessin. Le sixième argument est facultatif : sans lui, l'écartement fait exactement ce qu'il faisait avant.
2. Deux lignes de commentaire qui disent la décision T11 (C13, tour 18).
3. `(liens||[]).forEach(… var P=l.pts();`. **Raison** : chaque trait donne ses points à partir des places du moment. Une bulle poussée déplace aussi le bout de ses propres traits.
4. `N.forEach(function(n){ if(n===l.a||n===l.b||n.fixe)return;`. **Raison** : la bulle qui est au bout du trait n'est pas « une autre bulle ». **Une bulle placée à la main n'est jamais poussée** (décision 7) : si un trait passe derrière elle, la mesure le dit.
5. `for(… i+1<P.length …){ if(!p8SepCoupe(P[i],P[i+1],n))continue;`. **Raison** : un contact, c'est un morceau du trait qui passe derrière la boîte de la bulle.
6. Deux lignes qui calculent la normale au trait (`nx`, `ny`), la distance du centre au trait (`d`) et la distance qu'il faut (`il`). La distance qu'il faut est la demi-boîte projetée sur la normale, plus une demi-marge (`marge/2`). **Raison** : pousser la bulle juste assez pour que le trait passe à côté d'elle, et pas plus.
7. `var essais=[…]` puis la boucle sur les deux essais. **Raison** : « poussée vers la place libre du cadre visible ». La bulle est d'abord poussée du côté où elle est déjà. Si le cadre visible l'en empêche, elle passe de l'autre côté du trait. Si le cadre l'empêche des deux côtés, elle ne bouge pas, et la mesure le dira (T5 : jamais hors du cadre).
8. `bouge=true` seulement si la bulle a bougé. **Raison** : l'écartement continue tant qu'il y a quelque chose à faire, comme pour un chevauchement.

**Ce que je n'ai pas changé, et pourquoi.** Le dernier recours (« on descend la plus basse ») reste celui de p8-2 : il ne regarde que les chevauchements. Le complément ne parle que de l'écartement (« comme pour un chevauchement »). Si le dernier recours fait passer un nouveau trait derrière une bulle, la mesure le compte. Sur la vraie carte et sur les cinq formes des bancs, cela n'arrive pas : la mesure est à 0 partout où elle doit l'être.

**Une lecture à dire.** Le contact se compte sur **la boîte de la bulle**, c'est-à-dire ce qui se voit, fond opaque compris. La mesure, elle, compte les traits qui passent sur **le mot**, avec la boîte du texte. L'écartement est donc un peu plus exigeant que la mesure. C'est voulu : un trait qui disparaît sous le fond d'une bulle dit aussi un lien faux. Je n'ai pas touché à la mesure.

## La vraie carte, morceau par morceau (`captures/MESURES-p8-3.txt`)
Le banc coupe toujours au milieu, jusqu'à ce que chaque morceau tienne. **Avant (p8-3) : 4 coupes, 5 morceaux, dont 2 ne tenaient pas. Après (p8-3b) : 4 coupes, 5 morceaux, et chacun tient.** Le nombre de morceaux ne baisse pas. Le banc dit maintenant pourquoi il fait chaque coupe :

| avant la coupe | morceau coupé | chevauchements · hors cadre · traits · deux lignes · sous 26 pt |
|---|---|---|
| 1 | les 8 familles | 77 · 0 · 203 · 0 · 0 |
| 2 | analogie, opposition, substitution, insistance, amplification | 26 · 0 · 41 · 0 · 0 |
| 3 | analogie, opposition | 0 · 0 · **1** · 0 · 0 |
| 4 | substitution, insistance, amplification | 4 · 0 · 3 · 0 · 0 |

Les cinq morceaux finaux, avec leur capture (regardées, écran entier 1536 × 864 et diapo seule) :

| capture | morceau | les cinq chiffres | ce qu'elle prouve |
|---|---|---|---|
| `p8-3-morceau-1.png` (+ `-zoom`) | Figures d'analogie | 0 · 0 · 0 · 0 · 0 | « comparaison » est passée sous la famille, à gauche ; les traits vers « personnification », « métaphore » et « allégorie » vont droit à leur bulle, sans passer derrière aucune autre (**c'était 2 traits en p8-3**) |
| `p8-3-morceau-2.png` (+ `-zoom`) | Figures d'opposition | 0 · 0 · 0 · 0 · 0 | inchangé, tient |
| `p8-3-morceau-3.png` (+ `-zoom`) | Figures de substitution | 0 · 0 · 0 · 0 · 0 | « métonymie » sous la famille, « périphrase » décalée à gauche ; aucun trait derrière « synecdoque » ni « périphrase » (**c'était 3 traits en p8-3**) |
| `p8-3-morceau-4.png` (+ `-zoom`) | insistance, amplification | 0 · 0 · 0 · 0 · 0 | tient ; « gradation » et « hyperbole » sur les côtés de leur famille, traits courts et visibles |
| `p8-3-morceau-5.png` (+ `-zoom`) | atténuation, syntaxiques, procédés sonores | 0 · 0 · 0 · 0 · 0 | tient. **Vu et dit** : le trait « Procédés sonores » → « homophone » frôle l'angle arrondi du titre « Les figures de style (suite) », sans passer sur un mot. La mesure dit 0, et on voit le trait d'un bout à l'autre. |

Le « constat » de p8-3 (une bulle tirée à la main sur un morceau qui ne tient pas) n'a plus rien à constater : aucun morceau n'a de défaut, et le banc ne tire rien.

## Ce que T11 change ailleurs, vu et capturé
- **La carte d'essai des formes** (« Trois familles de figures », `test-p8-2-formes`). En p8-3, le trait de « comparaison » passait derrière « métaphore », sous son fond opaque. Comme ce trait ne passait pas sur le mot, la mesure ne le comptait pas, mais le dessin disait un lien faux. Maintenant « métaphore » est poussée à gauche et le trait est entier. Captures **livrées** et regardées :
  - `p8-2-carte-pilote-entier.png` (+ `-zoom`) et `p8-2-carte-pilote-moitie.png` (+ `-zoom`) : au pilote, en entier puis à moitié. Le non-dévoilé est pâle, à sa place.
  - `p8-2-carte-tableau-entier.png` et `p8-2-carte-tableau-moitie.png` : au tableau, 1280 × 720. Le non-dévoilé est absent.
  - Mesure : 0 · 0 · 0 · 0 · 0 (`captures/MESURES.txt`).
- **Frise, arbre, cycle, tableau** : leurs captures de diapo seule (`-zoom`) et leurs captures du tableau sont **identiques octet pour octet** à celles de p8-3. T11 n'y a rien bougé. Seules leurs captures d'écran entier au pilote diffèrent, parce que la colonne des vignettes montre la carte d'essai, qui a changé, et que le chrono tourne. Elles ne sont pas livrées (comme en p8-3).
- **La vraie carte entière, sur une diapo** (`test-p8-2-formes`) : elle ne tient toujours pas, et c'est attendu (8 familles, 26 notions). Dans l'atelier, à 1536 × 864, la mesure passe de 93 · 0 · 215 · 0 · 0 à 77 · 0 · 203 · 0 · 0. Selon la taille d'écran, le compte monte ou baisse, parce que les bulles poussées se gênent autrement. Ce n'est pas un défaut : le schéma est « trop dense », « Couper le schéma ici » le règle, et c'est ce que fait le banc. Les chiffres des six tailles sont dans `captures/MESURES.txt`.

## Les bancs, comptés
- `test-p8-3-gestes` : **54 `ok(`, aucun changé.**
  - Une ligne ajoutée (152 lignes au lieu de 151). Elle écrit dans `MESURES-p8-3.txt`, avant chaque coupe, le morceau coupé et ses cinq chiffres. C'est un relevé, pas une vérification.
  - La vérification « chaque morceau tient », qui était le défaut de p8-3, passe maintenant.
- Les 25 autres bancs sont repris de p8-3 sans aucun changement :
  - `test-p8-2-formes` (21) ;
  - les 24 de la p7, dont les 4 recalés en p8-3 ;
  - `tout-cliquer-p7` : tout cliquer, sans erreur JS ;
  - `audit-affichage-p7` : trois tailles, colonnes ouvertes et repliées.

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`
- Lancé le 2026-10-06 à 17:34 UTC : node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37 (installé d'avance dans le conteneur, pas téléchargé).
- Maquette jouée : md5 `f3b4eb2b5dbf31842dcad4a5b520e74a`, celle qui est livrée.
- 26 bancs : **26 × « fin : 0 défaut(s) »**, dernière ligne **« TOUS LES BANCS : 0 défaut »**.

## Les défauts trouvés et corrigés (avec leur cause)
1. Le patch s'arrêtait : « le nom p8SepCoupe existe déjà dans le gabarit ». **Cause** : je cherchais le nom nouveau après avoir inséré T11, qui l'appelle. Corrigé : le nom est cherché avant tout remplacement (n°12 · 40).
2. `p8SepCoupe` n'était pas dans la liste fermée des fonctions du tableau. **Cause** : c'est une fonction nouvelle, appelée par le rendu. Je l'ai ajoutée avant de lancer les bancs (n°12 · 75). Le banc du tableau la fait tourner.

## Ce qui est simulé
Rien de nouveau. La vraie carte reste en H2, sur sa diapo, comme simulation (déclarée en p8-3).

## Ce qui reste
- L'import et son refus : mandat de production (inchangé depuis p8-3).
- Vu en passant en p8-3, toujours hors mandat : « À régler » liste chaque diapo « Cahier de textes » comme « Objet non lisible « cahier » ».

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `f3b4eb2b5dbf31842dcad4a5b520e74a`
- gabarit `v9c15p8-template.html` : `74eab91f63045e7daf7d1cd6b99133de`
- base (gabarit p8-3) : `37a1ab5daaf33d1adf3c334055e47451`
- tous les fichiers livrés : `EMPREINTES.md5`, vérifié par `md5sum -c` avant l'envoi.

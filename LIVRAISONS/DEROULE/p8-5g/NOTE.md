# p8-5g — la fenêtre du tableau reçoit les pages dès son ouverture

> **Livraison non close : je m'arrête ici, sans faire p8-5h.** Deux raisons, détaillées plus bas :
> 1. **Les contrôles de la conscience n'existent pas** : `AUDITS/CONTROLES-DEROULE/` (`controles.mjs`, son `EMPREINTES.md5`, ses attendus) est absent de `main` du sas, tiré deux fois (au début, puis deux fois au moment de livrer : `main` à `dee0424`, puis à `7250c72`, 12/10). Le complément exige de les faire passer avant de livrer ; c'est impossible, et je ne les écris pas à la place de la conscience (le protocole veut justement qu'ils ne viennent pas de l'exécutant).
> 2. **Un relecteur neuf a trouvé un défaut que je n'ai pas le droit de corriger ici** : après « ■ Arrêter » la répétition, la fenêtre du tableau garde ce qui a été joué en répétition. Il est dans la répétition (p8-5c / p6), que le complément p8-5g interdit de toucher (« Rien d'autre ne change » ; « Tout le reste de p8-5c à p8-5f »), alors que le protocole veut que chaque trouvaille soit corrigée. Les deux consignes se contredisent : je l'écris et je m'arrête (mandat, « Les règles » : « Si une consigne … est contradictoire ou impossible …, tu l'écris dans la NOTE et tu t'arrêtes » ; « Si une livraison ne peut pas être finie sans dette, … tu n'enchaînes pas »).
>
> Tout le reste de p8-5g est fait et poussé sur `deroule/p8-5g` pour que rien ne se perde : le correctif, son banc, le banc unique, les relecteurs. La branche `deroule/p8-5h` n'existe pas.
*Exécutant, 12/10/2026, d'après `MANDATS/COMPLEMENT-DEROULE-P8-5g.md` (conscience n°13, tour 54, à l'audit de p8-5f ; validé par Paul le 12/10, tour 59). Branche `deroule/p8-5g`, partie de `deroule/p8-5f`. Règle la dette n°13 · 17. Première livraison sous le protocole d'audit du 12/10 (`PROTOCOLE-AUDIT-12-10.md`).*

## Ce que ça change pour la classe
- Quand Paul ouvre (ou rouvre) « 🖥 Écran 2 » en cours de diapo, la classe voit **aussitôt** la page que le pilote montre, avec son compteur « page i / n », les mêmes lignes dévoilées et la même police — que la page ait été suivie (▶) ou choisie à la main (molette, Maj+←/→), à l'heure lancée comme en répétition. Avant, le tableau ne se calait qu'au ▶ suivant.
- Rien d'autre ne change.

## La base et son md5
- Base : la livraison p8-5f, gabarit `v9c15p8-template.html` md5 `593d0709a8309cf1d4ad72aecb3a11e3`, maquette md5 `c298a93cc31b1aaae1ac7ab8fa87bcfd` (ceux de la NOTE p8-5f).
- `regen.sh` refait toute la chaîne jusqu'à **p8-5g** ; avant d'appliquer p8-5g, il vérifie octet pour octet chaque gabarit livré, de p8-2 à **p8-5f** (le gabarit p8-5f régénéré est comparé à celui livré en p8-5f). Sa sortie est dans `sorties/regen.txt`.
- Le changement est dans **`patch-p8-5g.py`** ; tout le reste de la chaîne est repris identique.

## Ce que j'ai mesuré avant de coder (sur p8-5f, à 1280 × 800)
Le banc `test-p8-5g` (ci-dessous), joué sur la maquette p8-5f, retrouve la mesure de la conscience (T54b, T54c) : **9 défauts sur 24 vérifications**. À l'ouverture à 0 et à 9 dévoilés, le tableau n'a aucun compteur (pilote « page 1 / 2 ») et sa police est la sienne (40,32 px à 0 dévoilé, 33,32 px à 9 ; le pilote est à 32,75 px) ; à 13 dévoilés, « page 2 / 2 » par hasard ; à 9 dévoilés avec la page 2 choisie à la molette, le tableau montre les 10 lignes de la page 1 quand le pilote montre la page 2. Il ne se calait qu'après 1 s et un ▶.

**La cause** (la conscience la donnait « probable », elle est confirmée et un peu différente) : à l'ouverture, la fenêtre envoie « prête » au pilote, qui lui répondait par `pousser(S.gel || etatComplet())`. `etatComplet()` est un état **neuf**, que `rendre` n'a pas encore paginé : ni `pages`, ni `pagesP`, ni `policeRatio`, ni la page suivie ou choisie. Le tableau, qui ne reçoit pas de pages, paginait alors seul sur ses seules lignes dévoilées. L'état gardé par `pousser` (`S.mur`), lui, porte tout cela : c'est celui que chaque ▶ envoie, après le rendu du pilote.

## La décision
1. **À l'ouverture, la fenêtre reçoit l'état que le pilote a poussé au mur à son dernier rendu** (`S.mur`) : ses pages, sa page courante (suivie ou manuelle), sa police — exactement ce qu'un ▶ lui envoie. **Pendant le gel aussi** : le tableau gelé montre `S.mur` (le gel ne pousse rien ; « montrer la suite », depuis la préparation du cahier, pousse `S.gel`, qui devient alors `S.mur`) ; `S.gel` = `etatComplet()` n'a pas de pages et ne sert plus que s'il n'y a rien au mur. Ma première version donnait `S.gel` en premier : un relecteur neuf l'a pris en défaut (défaut 2). S'il n'y a encore rien au mur (rien poussé, ou l'atelier), `etatComplet()`, comme avant. Re-pousser l'état déjà au mur n'écrit rien au journal (`pousser` compare l'état à lui-même : aucune diapo, aucun dévoilement, aucune page nouvelle).

## Ce qui a été modifié, compté
`patch-p8-5g.py` fait **1 remplacement**, exigé une fois. Aucun nom nouveau, aucune classe nouvelle. Tailles relevées par le patch (`sorties/regen.txt`) ; j'ai relu la ligne entière.

| fonction / endroit | avant | après | quoi |
|---|---|---|---|
| l'écoute « prête » de la fenêtre du tableau (`window.addEventListener('message', …)`, pilote) | 108 o / 1 ligne | 242 o / 1 ligne | `S.gel \|\| etatComplet()` → `S.mur \|\| S.gel \|\| etatComplet()` |

Aucune fonction du rendu n'est touchée ; la liste des fonctions passées au tableau ne change pas.

## Les bancs, comptés
- **`test-p8-5g`** (nouveau, **29 vérifications** comptées par le banc), par la souris et le clavier, à 1280 × 800 :
  - la diapo 1 avec huit lignes tapées sous le dernier bloc dans l'atelier (comme `test-p8-5f`), heure lancée : « page 1 / 2 » ;
  - **O, à chaque ouverture** de « 🖥 Écran 2 » (par son bouton ; la fenêtre fermée puis rouverte) — à 0 dévoilé, à 9, à 13, et à 9 avec la page 2 choisie à la molette : dans la seconde, le tableau a **le même compteur** que le pilote et **les mêmes lignes dévoilées visibles** (comparées par `data-p`, ni `hors` ni `pas`), rien hors de son cadre ni de celui du pilote ; la molette a bien choisi la page 2 à 9 dévoilés ;
  - **P**, puis un ▶ : toujours la même page et les mêmes lignes des deux côtés ;
  - **R, la répétition** : « Jouer en avance — répétition » sur la diapo 1, ▶ jusqu'à sa page 2 (sans la quitter), puis « 🖥 Écran 2 » → la même page, les mêmes lignes, rien hors du cadre ;
  - aucune erreur JS, aucune boîte système.
- Sur p8-5f, ce banc trouve 9 défauts (ci-dessus) ; sur p8-5g, 0.
  - **G, le gel** (garde du défaut trouvé par un relecteur neuf) : avant le gel, le tableau ouvert est pareil au pilote ; ❄ (`#bgel`), puis quatre ▶ au pilote : le tableau ne bouge pas ; la fenêtre fermée et rouverte pendant le gel montre **ce qu'elle montrait au gel** — même compteur, mêmes lignes, même police ; ❄ de nouveau (dégel) : le tableau rejoint le pilote.
- **L'épreuve de la garde G** (`sorties/epreuve-garde-gel.txt`) : le même banc joué sur une copie de la maquette où l'écoute remet `S.gel` en premier (ma première version) → **2 défauts** (« rouvert : aucun compteur ; police 32,75 / 36,82 px ») ; sur la maquette livrée, 0.
- Inchangés : les 33 bancs de p8-5f. **34 bancs dans le banc unique.**

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`
- Lancé le 2026-10-12 à 13:27 (heure de Paris) : node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37.
- Maquette jouée : md5 `62d9557ac8fedcfbdd8b157a2588cbee` (la livrée).
- **34 bancs, 34 × « fin : 0 défaut(s) », « TOUS LES BANCS : 0 défaut »**, en un passage ; aucune erreur de page.
- Un premier passage, sur ma première version (md5 `7dfe1de24692af70850487fe4c4d42f1`), était lui aussi à 34 × 0 ; il n'est pas joint (la garde G n'existait pas encore).

## Les contrôles de la conscience
**Pas passés : ils n'existent pas.** Le complément (« Les gardes du protocole d'audit du 12/10 ») dit : « `AUDITS/CONTROLES-DEROULE/` (fichier `controles.mjs`, son `EMPREINTES.md5`, ses attendus). Avant de livrer, tire `main` du sas, vérifie l'empreinte, et fais-les passer tels quels sur ta maquette ».
- `main` tiré au début du travail (`80b0161`, « C13 - tour 64 : p8-5g et p8-5h sous le protocole d'audit du 12/10 ») puis au moment de livrer (`dee0424`, puis `7250c72`, le dernier) : **aucun fichier `AUDITS/CONTROLES-DEROULE/`**, ni aucun `controles.mjs`, dans tout l'arbre de `main` ni sur aucune autre branche du sas. Seul `AUDITS/CONTROLES-QCM/` existe : il est pour la maquette du QCM, pas pour le déroulé ; je ne le fais pas passer à la place.
- Je n'écris pas ces contrôles moi-même : le protocole dit qu'ils sont écrits par la conscience, justement parce que les vérifications de l'exécutant ne voient que ce qu'il a compris. `sorties/controles-conscience.txt` n'existe donc pas.
- **C'est la première raison pour laquelle je m'arrête.** Quand les contrôles seront au sas, ils pourront être passés sur cette maquette telle quelle (md5 ci-dessous).

## Les relecteurs neufs
Deux relecteurs séparés (sous-agents), qui n'avaient jamais vu mon travail : chacun n'avait que le mandat p8, les compléments p8-5c, 5d, 5f, 5g, les cadrages 1 et 4, le protocole, et **la maquette candidate** (ma première version, md5 `7dfe1de24692af70850487fe4c4d42f1`, avec `S.gel` en premier), dans un dossier à part ; consigne de ne rien lire du dépôt. Ils ont joué comme Paul, par le geste, avec Playwright. Leurs scripts sont joints dans `relecteurs/r1/` et `relecteurs/r2/` (ils attendent la maquette dans `relecteurs/`, à côté de leur dossier).
- **Relecteur 1 — la classe, heure lancée, « 🖥 Écran 2 »** (environ 11 min de jeu) :
  - **un défaut certain : rouvert pendant le gel**, le tableau n'a plus le compteur ni la police que la classe voyait (gelé à « page 2 / 3 », rouvert « page 2 / 2 » ; gelé à « page 1 / 3 », rouvert sans compteur, police 34,66 px pour 28,16) — par ❄, par la touche G, par la garde « ❄ Geler, puis y aller ». **Corrigé** (décision 1) et **gardé** (G, éprouvée) ;
  - deux doutes, hors de p8-5g, dans « Ce qui reste » (après l'arrêt de la répétition ; la vue « ⧉ Tableau » sans compteur) ;
  - vérifié et juste : ouvertures et réouvertures à 0, 9, 13, page choisie à la molette (pareil en 150 ms) ; ▶, ◀, molette, Maj+←/→, ‹ › du compteur ; six fermetures-réouvertures rapides ; onze tailles de fenêtre de 320 × 240 à 2560 × 1080 (jamais rien hors du cadre) ; changements de diapo par vignette et PageUp/PageDown ; gel sans réouverture et dégel ; curseur « texte au tableau », largeurs du pilote, poignée, volets, loupe ; répétition ; **rouvrir n'écrit rien au journal**.
- **Relecteur 2 — l'atelier et la répétition** (environ 23 min de jeu) :
  - **un défaut certain : après « ■ Arrêter » la répétition, la fenêtre du tableau garde ce qui a été joué en répétition** (la page, les lignes dévoilées, et même le texte tapé en répétition), jusqu'au clic sur l'onglet Pilotage ; le relecteur 1 l'avait vu aussi. **Non corrigé : c'est la deuxième raison de mon arrêt** (en tête de cette NOTE ; cause dans « Ce qui reste ») ;
  - quatre doutes, dans « Ce qui reste » ;
  - vérifié et juste, à 1280 × 800 et 1920 × 1080 : en répétition et à l'heure lancée, à chaque ouverture ou réouverture, même compteur, même page, mêmes lignes ; le suivi de chaque geste ; six tailles de fenêtre ; l'atelier (page 2 / 2 après huit lignes, Tab / Maj+Tab entre les pages, la frappe qui change la page sans perdre une lettre, Entrée puis frappe immédiate) ; la diapo à un bloc qu'on fait déborder ; aucune erreur JS.

## Les captures (regardées, écran entier) — les chiffres sont dans `captures/MESURES-p8-5g.txt`
| capture | ce qu'elle prouve |
|---|---|
| `p8-5g-ouverture-a-9-devoiles-pilote-et-tableau.png` | les deux écrans entiers côte à côte, juste après l'ouverture de « 🖥 Écran 2 » à 9 dévoilés : à gauche le pilote « page 1 / 2 », 9 / 14 dévoilés ; à droite la fenêtre du tableau, « page 1 / 2 », les mêmes lignes dévoilées, rien hors du cadre |
| `p8-5g-pilote-9-devoiles.png`, `p8-5g-tableau-ouvert-a-9-devoiles.png` | les deux mêmes écrans, chacun seul, à leur taille |
| `p8-5g-tableau-rouvert-pendant-le-gel.png` | la fenêtre du tableau rouverte pendant le gel (garde G) : « page 1 / 2 », les lignes du moment du gel, alors que le pilote est passé à la page 2 |

## Les défauts trouvés et corrigés (avec leur cause)
1. **Le tableau ouvert en cours de diapo n'avait pas les pages du pilote** (dette n°13 · 17) : cause et correction ci-dessus.
2. **Rouvert pendant le gel, le tableau perdait ses pages** (trouvé par le relecteur 1 sur ma première version) : je donnais `S.gel` en premier, et l'état gardé au gel (`etatComplet()`) n'a jamais été paginé par le pilote. Corrigé : `S.mur` d'abord, qui est ce que le tableau gelé montre. Garde G, éprouvée sur la première version (2 défauts) ; sur la livrée, 0.

## Ce qui est simulé
Rien de nouveau.

## Ce qui reste
**Le défaut que je n'ai pas le droit de corriger dans cette livraison (relecteurs 1 et 2) :**
- **Après « ■ Arrêter » la répétition, la fenêtre du tableau garde la répétition.** Gestes : atelier, huit lignes tapées dans la diapo 1 ; « Jouer en avance — répétition » ; « 🖥 Écran 2 » ; dix ▶ (ou du texte tapé dans la diapo) ; « ■ Arrêter » (ou l'onglet Atelier). Le tableau reste sur « page 2 / 2 », la ligne dévoilée en répétition visible, le texte tapé en répétition affiché, alors que l'atelier et le pilote l'ont oublié ; il ne se remet à jour qu'au clic sur l'onglet Pilotage. Attendu : cadrage 4, 1.5 (« à l'arrêt, tout ce qui a été joué est oublié ») ; complément p8-5c, point 4 (« À l'arrêt, tout revient … rien ne reste »).
- **Cause, lue dans le code** : `arreterRepetition` restaure l'instantané (dont `S.mur`), puis n'envoie à la fenêtre que `{ et: null, sortie: true }`, qui ne fait que marquer l'onglet de la fiche (`.f-tab` → `ecran-sortie`) ; l'atelier ne pousse rien au tableau (p1). La fenêtre garde donc le dernier état de la répétition. Ce n'est pas p8-5g qui l'a introduit : c'est ainsi depuis la répétition (p6), et p8-5f n'y a rien changé.
- **Correction possible, à trancher par la conscience** (elle touche la répétition, que ce complément ne m'ouvre pas) : à l'arrêt, renvoyer à la fenêtre l'état d'avant la répétition (`S.mur` restauré), ou la vider s'il n'y en avait pas. Ce que la classe doit voir à ce moment-là — la diapo d'avant la répétition, ou rien — est une décision pour Paul.

**Les doutes des relecteurs, hors de la promesse de p8-5g** (non corrigés ; je les donne tels quels, avec mon avis) :
1. *(relecteur 1)* La vue « ⧉ Tableau » de la colonne de droite montre les bonnes lignes mais **pas le compteur « page i / n »**, alors que la fenêtre en a un. Le code de cette vue passe `pages: null` exprès (avant p8-5f). Le complément p8-5g parle de la fenêtre seulement ; à trancher.
2. *(relecteur 1)* Avant de lancer l'heure, « 🖥 Écran 2 » n'est pas accessible : l'emploi du temps le couvre. Voulu, je pense.
3. *(relecteur 2)* **La diapo où la répétition s'est arrêtée reste** : « ■ Arrêter » après être arrivé sur la diapo 3 laisse l'atelier, puis l'heure lancée, sur la diapo 3. C'est écrit dans le code (`arreterRepetition` garde `S.di`) ; à trancher si la position fait partie de « tout ce qui a été joué ».
4. *(relecteur 2)* **Le paragraphe très long tapé sans Entrée dans l'atelier** : ancré en haut, coupé en bas, rien au-dessus du cadre (p8-5f, point 3) ; mais après une quinzaine de lignes, **le curseur passe sous le bas de la diapo** et Paul tape sans voir où il écrit ; la zone « ✎ clique ici et écris » (collée en bas, p8-4) et le compteur « page 2 / 2 » chevauchent la dernière ligne coupée. C'est la limite de la décision p8-5f (« une ligne seule plus haute que la diapo » est coupée) ; à trancher.
5. *(relecteur 2)* Dans l'atelier, **Échap ne fait pas sortir de la ligne** : Maj+← sélectionne alors une lettre au lieu de changer de page ; il faut d'abord cliquer hors du texte. Antérieur à p8-5f.
6. *(relecteur 2)* 150 ms après le ▶ qui mène à la diapo 2 (une image), sa légende dépasse le cadre de 2 px au pilote et de 5 px au tableau ; à 300 ms, plus rien. Probablement l'entrée de la diapo ; à mesurer par la conscience si elle le juge utile.

**Et, en dehors de ces points** : rien de cette livraison, sinon les contrôles de la conscience à faire passer, et p8-5h, que je ne commence pas.

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `62d9557ac8fedcfbdd8b157a2588cbee`
- gabarit `v9c15p8-template.html` : `a1f65ce33514b60e10a7ae34d8d53a3c`
- tous les fichiers livrés : `EMPREINTES.md5`, vérifié par `md5sum -c` avant l'envoi.

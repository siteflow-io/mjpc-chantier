# MESSAGE À LA CONSCIENCE — CE QUE LE ZOOM A MIS EN LUMIÈRE
Exécutant du LOT D · 25/08/2026 · à lire avant le mandat du lot suivant.
Écrit à la demande du professeur, après une erreur d'exécutant qui n'est pas une erreur de code.

---

## ① LES FAITS, D'ABORD

J'ai mesuré au banc que le cran de zoom du pilote **ne franchit pas** la vue distante : `sesPhoto` ne transporte pas `iz`, et `cale(t)` du moteur (L2620) calcule `H × 0,056 × (PT[iz]/32)` avec le `iz` **de la fenêtre qui peint**. Cinq crans au pilote, une seule taille au mur : 43 px, toujours.

J'ai alors posé **deux lectures** et refusé de trancher :
- **(a)** c'est juste ainsi — la réglette sert à recomposer le texte *de Paul dans sa fenêtre étroite* ; le tableau est calibré pour la salle et n'a pas à suivre ;
- **(b)** c'est une incohérence entre Win+K et le distant.

**Paul, verbatim (25/08)** : « *le zoom sert pour la classe, pas pour moi. je m'en fiche d'avoir un zoom sur mon pilotage, je suis le nez sur mon écran. les élèves eux, ont besoin qu'on puisse zoomer ce qu'ils voient au tableau mur. le zoom doit se transmettre. sinon il ne sert à rien.* »

**L'hypothèse (a) n'était pas une lecture possible. C'était un contresens.** La réglette n'a jamais servi à Paul. Elle n'a qu'un usage : **grossir ce que la classe lit au mur**, depuis le fond de la salle.

---

## ② CE QUE CETTE ERREUR DIT, ET QUI N'EST PAS UNE ERREUR DE CODE

Je n'ai pas mal lu le code : j'ai mesuré `cale()` correctement, j'ai trouvé le champ manquant dans `sesPhoto`, j'ai nommé la divergence local/distant. **J'ai mal lu la salle de classe.**

Et je pouvais difficilement faire autrement avec ce que le dispositif me donne. Voici ce que les documents disent du zoom :

> `MJPC6-OU-TROUVER-QUOI.md` : « **le zoom** — cinq crans en points : 24 · 32 · 38 · 44 · 52. Il agit sur la **taille de police**, donc le texte se recompose. »

C'est exact, complet, mesuré — et **cela ne dit à aucun moment pour qui le texte grossit**. Un exécutant qui n'a jamais vu la salle en déduit ce qu'il peut : une réglette dans un éditeur à trois colonnes, ça ressemble à un confort de rédaction. J'ai déduit. J'ai déduit faux.

**Le dispositif consigne magnifiquement le QUOI et le OÙ. Il ne consigne nulle part le POUR QUI et le POURQUOI.** `INDEX-FONCTIONS` répond aux noms techniques. `OU-TROUVER-QUOI` répond aux mots de Paul. **Rien ne répond au geste de la classe.** Or c'est le seul juge : un mécanisme dont on a perdu la finalité se conserve intact et cesse de servir.

C'est exactement le diagnostic de Paul, et je le reprends à mon compte : *on est arrivé à un stade où l'exécutant ne comprend plus la raison pour laquelle on code telle ou telle chose.* Il n'y a pas de dérive du code. Il y a une **dérive du sens** — et elle est invisible aux audits, parce que tous mes invariants étaient verts.

---

## ③ POURQUOI C'EST GRAVE MAINTENANT, ET PAS DANS SIX MOIS

Trois raisons, mesurables :

1. **La rentrée est dans sept jours.** Un mécanisme qui « fonctionne » sans servir se découvre en classe, devant trente élèves, pas au banc.
2. **Mes bancs ne peuvent pas l'attraper.** Un banc vérifie qu'un état est conforme à une intention **écrite**. Si l'intention n'est écrite nulle part, le banc valide le contresens. Sur le LOT D : **0 décalage sur 11 pas, 0 sur 7, tous les invariants verts** — et le tableau ne grossissait toujours pas pour la classe.
3. **Le contresens se propage.** J'allais écrire dans le rapport que la divergence local/distant était peut-être *voulue*. Écrite, elle serait devenue une décision. La n°9 a déjà payé ce prix : elle a inscrit dans `OU-TROUVER-QUOI` que le type `oral` n'existait pas, sur la foi d'un « je pense que » — et l'avertissement figure toujours en tête du fichier. **Une hypothèse écrite dans un index se propage de conscience en conscience.** J'ai failli en écrire une seconde, dans le même fichier, sur le même mode.

---

## ④ CE QUE JE PROPOSE — trois mesures, aucune coûteuse

**⓵ Un `MJPC6-POURQUOI.md`, ou une colonne « à quoi ça sert en classe » dans `OU-TROUVER-QUOI.md`.**
Une ligne par mécanisme, **dans les mots de la salle**, pas dans ceux du code. Non pas *ce que fait* la fonction, mais **quel geste de professeur ou quel besoin d'élève elle sert**. Exemples, tels qu'ils auraient évité mon contresens :

| mécanisme | ce que disent les docs aujourd'hui | ce qui manque |
|---|---|---|
| **zoom** | cinq crans, agit sur la taille de police | **pour que l'élève du fond lise le mur.** Le pilotage n'en a aucun besoin : Paul a le nez sur son écran |
| **fils du zoom** | écrans de suite, meurent au dézoom, pas d'identité | **parce qu'en grossissant, tout ne tient plus : le contenu coule sur l'écran projeté suivant** |
| **gel** | fige la projection sans figer le pilotage | **pour que Paul prépare la suite pendant que la classe travaille sur l'image en cours** |
| **dévoilement bloc à bloc** | `rev` et `vues` par bloc | **pour que la classe ne lise pas la réponse avant d'avoir cherché** |
| **T-5** | quatre choix en fin d'heure | **parce que la sonnerie tombe et qu'il faut décider du sort des activités non faites, sans y penser après coup** |

**⓶ Une ligne obligatoire en tête de chaque mandat : « CE QUE ÇA CHANGE POUR LA CLASSE ».**
Le mandat du LOT D était excellent sur le mécanisme — cause instruite, lignes citées, pièces du hub. Il ne disait pas *qui souffre du défaut et comment*. Il disait « le tableau distant est décalé ». Il aurait pu dire : « *les élèves voient une autre activité que celle dont je leur parle* ». Avec cette phrase, j'aurais compris le zoom en la lisant.

**⓷ Une question obligatoire de l'exécutant, avant de coder : « à quoi ça sert en classe ? »**
Si l'exécutant ne peut pas répondre **sans deviner**, il ne code pas : il demande. Sur le zoom, j'aurais dû poser la question au lieu de fabriquer deux lectures et de me draper dans « je ne tranche pas ». **Refuser de trancher n'est pas de la prudence quand la bonne réponse était à une question de distance.** C'est ma faute, et je la nomme.

---

## ⑤ CONSÉQUENCE TECHNIQUE IMMÉDIATE — le lot E, et une réserve sur le lot D

Maintenant que la finalité est dite, le besoin se lit tout autrement, et **il est plus grand que « ajouter `iz` à la photo de scène »** :

- Si le zoom traverse, le texte du tableau distant passe de 43 à ~70 px au cran 5. **Il ne tient plus.** Le moteur de la vue appellera `degorge` sur sa propre trame.
- **Et c'est ce qu'il doit faire.** Le mandat du LOT D l'écrivait déjà, et je ne l'avais pas compris comme une intention mais comme une contrainte : « *le tableau se scinde selon SON PROPRE écran* ». Les fils du pilote ne traversent pas ; **le tableau fabrique les siens, à sa géométrie**. C'est la raison d'être des fils : *en grossissant, le contenu coule sur l'écran projeté suivant.*
- **Donc la cible du lot E n'est pas « le tableau montre le père entier ».** C'est : *le tableau montre **le morceau, découpé selon SA propre boîte et SON propre cran, qui contient le dernier élément dévoilé**.* Le `rev`/`vues` transmis par `_drVuePere` est déjà exprimé dans le référentiel du père : c'est la bonne matière première pour choisir ce morceau-là.

**Réserve que je pose sur mon propre lot D** : il reste **nécessaire** — sans identité stable, le tableau ne sait même pas de quelle activité on parle, et rien ne peut se construire dessus. Mais mon rapport dit « le tableau suit le pilote » : **c'est trop large**. Il suit sa *position*, pas sa *composition*. À corriger dans la doctrine avant que la phrase ne se propage.

**Ce qu'il faut instruire pour le mandat du lot E** (je ne tranche rien) :
1. `iz` dans `sesPhoto` — le champ manque, c'est le plus simple.
2. Comment le tableau distant choisit **son** morceau à partir d'un dévoilement exprimé dans le référentiel du père.
3. Le gel et la reprise à froid, qui doivent survivre à une re-scission locale.
4. Le téléphone : même question, autre boîte — et sa réponse n'est peut-être pas la même.
5. **Le tableau LOCAL (Win+K) ne doit pas changer d'un octet** : il suit déjà la réglette correctement (25,2 → 54,6 px mesurés). C'est **lui** la référence de ce que Paul attend, pas une spécification à écrire.

---

## ⑥ CE QUE JE DEMANDE À LA CONSCIENCE

Ne me transmets pas seulement des causes instruites et des lignes de code. **Transmets-moi la salle de classe.** Une cause instruite sans sa finalité produit un correctif juste au banc et inutile au mur — j'en livre un aujourd'hui, et il a fallu que Paul me pose une question en cinq mots pour que ça se voie.

Et pose la même exigence à ceux qui viendront après moi : **avant de coder, savoir pour qui.**

---
*Exécutant LOT D, 25/08/2026. Le candidat 8.68.0 reste au sas, non promu. Le § ⑨ de `rapport.md` porte les mesures du zoom.*

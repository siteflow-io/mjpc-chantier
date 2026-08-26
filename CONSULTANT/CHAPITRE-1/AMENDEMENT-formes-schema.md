# AMENDEMENT — la dette 29 n'existe pas telle que je l'ai écrite

*Consultant, 26/08/2026, après lecture de `DEROULE/deroule97.html` — fichier que je n'avais pas pendant la construction du chapitre.*

---

## Ce que j'ai écrit, et qui est faux

Au registre (`registre-chapitre-3e.md`, § « DETTE 29 ») et dans `LISEZ-MOI.md` § 6b, j'ai déclaré :

> « Il manque au déroulé un bloc pour une diapo simple : un titre, une phrase, quelques lignes. C'est le trou du site. »

Et, pour justifier de n'avoir gardé que deux schémas :

> « Le bloc `schema` du déroulé accepte un champ `forme` dont je ne connais que la valeur par défaut, `carte` — le moteur du déroulé (`deroule86.html`) n'est pas lisible depuis mon environnement. »

**Le moteur déclare cinq formes**, explicitement, en une ligne :

```js
var FORMES=[['carte','Carte mentale'],['frise','Frise'],['arbre','Arbre'],
            ['cycle','Cycle'],['tableau','Tableau']];
```

Et cinq fonctions de rendu leur répondent : `carte(L)`, `frise(L)`, `arbre(L)`, `cycle(L)`, `grille(L)`.

**Le format de `src` diffère selon la forme** — relevé dans le code :

| Forme | Ce qu'attend `src` | Relevé dans |
|---|---|---|
| `carte` | une ligne par famille, « Étiquette : a, b, c » | `carte()` et le découpage famille par famille du dévoilement |
| `frise` | « année : événement » — l'année est extraite par `parseInt` sur les chiffres | `frise()` |
| `arbre` | une ligne par nœud, **la profondeur se marque par l'indentation** (deux espaces = un niveau) | `arbre()` |
| `cycle` | une ligne par étape, dans l'ordre ; le moteur les dispose en cercle | `cycle()` |
| `tableau` | première ligne = en-têtes, colonnes séparées par `|` | `grille()` |

Le moteur porte lui-même des exemples qui le confirment : « Les figures de style » en `carte`, « Le XIXe siècle littéraire » en `frise` (« 1789 : Révolution française »), « Écrire un texte » en `cycle`, « Les registres » en `tableau`.

## Conséquence : onze écrans ont été appauvris

Ne connaissant que `carte`, j'ai conclu qu'un contenu qui n'entrait pas dans « étiquette : contenu » n'avait pas de bloc, et **j'ai converti onze schémas en `consigne`**. Paul a tranché en connaissance de ce que je lui disais : « le type diapo simple n'existe pas, c'est un trou du site. pour ce chapitre, on prend le format consigne, tant pis. à consigner. » **La décision était juste au vu de mon rapport ; mon rapport était faux.**

## Les écrans à reconvertir, avec leur forme

*Neuf écrans sont concernés dans l'état actuel du chapitre. Le contenu est déjà écrit : seuls le type de bloc et le format de `src` changent.*

| Séance | Écran | Devrait être | Pourquoi |
|---|---|---|---|
| S1 | Les règles héritées | `schema` · `carte` | trois règles parallèles : forme fixe, alexandrin, rimes |
| S1 | Baudelaire, 1821-1867 | `schema` · `frise` | « 1857 : … », « 1861 : … » — format natif de la frise |
| S1 | Le siècle des inventions | `schema` · `frise` | « 1816 : la photographie », « 1832 : le télégraphe », « 1876 : le téléphone » |
| S2 | Le champ lexical | `schema` · `carte` | une définition et sa méthode |
| S4 | Le poème en prose | `schema` · `carte` | — |
| S5 | Trois questions à ne pas confondre | `schema` · `carte` | trois entrées parallèles, format « Quelle forme ? : … » |
| S5 | La méthode en quatre étapes (paragraphe) | `schema` · `cycle` | quatre étapes ordonnées — c'est exactement l'exemple « Écrire un texte » du moteur |
| S7 | Ce que la classe évalue | `schema` · `carte` | les quatre critères |
| S9 | Les repères avant de lire | `schema` · `frise` | 1857, 1862, 1869 |

**Deux autres écrans, hors du chapitre mais du même ordre :** la fiche notion « les propositions » a produit un schéma HTML séparé pour son arborescence — or `arbre` existe, et son format par indentation lui convient exactement. De même, les quatre étapes de l'analyse logique relèvent du `cycle`.

## Ce qui reste vrai

**La dette 30 tient** : aucun bloc du déroulé n'affiche une page HTML. Vérifié dans les versions 86 **et** 97 : ni `page`, ni `texte`, ni `iframe`, ni source `html` côté écran. La frise interactive reste ouvrable seulement depuis les documents de la séance.

**Il n'existe pas de bloc « texte suivi »** — un paragraphe de prose sans étiquettes ni étapes. Les cinq formes de schéma couvrent les contenus structurés, pas la phrase seule. Si un écran doit porter un texte suivi, le bloc `consigne` reste le seul recours. **C'est le vrai périmètre de la dette 29, beaucoup plus étroit que ce que j'avais écrit.**

## La faute, pour le registre des règles

**Une capacité qu'on n'a pas pu vérifier ne se déclare pas absente.** J'ai signalé mon incertitude — c'était juste — puis j'ai agi comme si l'absence était établie, et j'ai fait décider Paul là-dessus. La règle à ajouter : *quand un fichier manque pour trancher, on ne conclut pas ; on demande le fichier.* Il était dans le dépôt du chantier depuis le début.

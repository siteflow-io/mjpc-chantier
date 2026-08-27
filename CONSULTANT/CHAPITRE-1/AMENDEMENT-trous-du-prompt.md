# AMENDEMENT — ce que le prompt de chapitre ne dit pas

*Consultant, 26/08/2026. Écrit après lecture de `DEROULE/deroule97.html` et de `PONT/EDT/` — deux sources qui étaient dans ce dépôt pendant toute la construction du chapitre 1, et que le prompt ne m'a jamais conduit à demander.*

**Le principe de cet amendement, formulé par Paul :**

> « La question n'est pas de savoir si tu n'as pas fait quelque chose parce que tu n'avais pas `deroule.html` sous les yeux. La question c'est que le prompt permette à l'instance de créer sans avoir besoin d'avoir `deroule.html` sous les yeux. C'est un trou du prompt, pas de ton exécution. »

Ce document liste donc **ce que le prompt devrait contenir**, et ce que son absence a coûté au chapitre 1. Il ne s'agit pas de fautes d'exécution mais de connaissances aujourd'hui enfouies dans le code ou dans d'autres dépôts.

---

## PARTIE A — Ce qui vit dans le moteur du déroulé et devrait vivre dans le prompt

### A1. Le bloc `schema` a cinq formes, pas une

Le moteur les déclare en une ligne :

```js
var FORMES=[['carte','Carte mentale'],['frise','Frise'],['arbre','Arbre'],
            ['cycle','Cycle'],['tableau','Tableau']];
```

Et le format de `src` **diffère selon la forme** — c'est la partie la plus coûteuse à ignorer :

| Forme | Format de `src` | Fonction du moteur |
|---|---|---|
| `carte` | une ligne par famille : `Étiquette : a, b, c` | `carte(L)` |
| `frise` | `année : événement` — l'année est extraite par analyse des chiffres | `frise(L)` |
| `arbre` | une ligne par nœud, **la profondeur se marque par l'indentation** (deux espaces = un niveau) | `arbre(L)` |
| `cycle` | une ligne par étape, dans l'ordre ; disposées en cercle | `cycle(L)` |
| `tableau` | première ligne = en-têtes, colonnes séparées par une barre verticale | `grille(L)` |

**Ce que l'ignorance a coûté** : ne connaissant que `carte`, j'ai conclu qu'un contenu qui n'entrait pas dans « étiquette : contenu » n'avait pas de bloc, et **onze écrans ont été convertis en `consigne`**. Paul a tranché sur ce rapport : « le type diapo simple n'existe pas, c'est un trou du site. pour ce chapitre, on prend le format consigne, tant pis. » **La décision était juste au vu de mon rapport ; mon rapport était faux.**

**Neuf écrans du chapitre devraient redevenir des schémas** : Baudelaire 1821-1867 → `frise` · Le siècle des inventions → `frise` · Les repères avant de lire « L'Étranger » → `frise` · La méthode du paragraphe en quatre étapes → `cycle` · Les règles héritées, Le champ lexical, Le poème en prose, Trois questions à ne pas confondre, Ce que la classe évalue → `carte`.
**Et deux supports HTML n'auraient pas eu lieu d'être** : l'arborescence des propositions est un `arbre` natif ; les quatre étapes de l'analyse logique, un `cycle`.

### A2. Le déroulé porte aussi des outils de marquage

Non documentés au prompt : `pt` (point numéroté), `et` (étiquette), `fl` (flèche), `cd` (cadre), `lg` (légende). Ils s'ajoutent aux blocs et permettent d'annoter un écran. Je n'en ai utilisé aucun, faute de savoir qu'ils existaient.

### A3. Ce qui est réellement absent — le périmètre exact des dettes

**Il n'existe pas de bloc « texte suivi »** : un paragraphe de prose, sans étiquettes ni étapes. Les cinq formes couvrent le structuré, pas la phrase seule. **C'est le vrai périmètre de la dette 29** — beaucoup plus étroit que ce que j'avais écrit.

**Aucun bloc n'affiche une page HTML.** Vérifié sur les versions 86 **et** 97 : ni `page`, ni `texte`, ni cadre externe, ni source `html` côté écran. Un **item** peut être une page (source `html`, ouverte par le visualiseur) ; un **écran** ne le peut pas. **La dette 30 tient.**

### A4. L'adresse d'un média est relative

Le champ s'intitule « adresse dans mjpc-medias » et le site ajoute la base. Fournir l'adresse complète produit une adresse doublée et une image absente. **Le prompt ne le dit pas** ; il a fallu le voir à l'écran.

### A5. « Fiche », « item », « écran » — trois mots pour trois choses

- **`fiche`** désigne un **produit du site** — fiche notion, méthode, grammaire, révision — et non un conteneur générique. Mot de Paul : « des fiches ce sont des fiches NOTIONS METHODE ETC ».
- Un **item** est un document de la séance ; un **écran** est une diapositive du déroulé. **Rien ne circule entre les deux** : un item n'apparaît pas dans le déroulé, un bloc `fiche` n'ouvre aucun document.
- Conséquence vécue : un contenu posé sur le mauvais item s'affiche sous le titre de cet item.

---

## PARTIE B — Ce qui vit dans l'EDT et devrait entrer dans le cadrage d'un chapitre

*Ces données sont dans `PONT/EDT/json/`. Le prompt ne m'a jamais conduit à les chercher : j'ai bâti neuf séances **sans savoir combien d'heures existaient réellement**, ni quand.*

### B1. Le calendrier

Rentrée des élèves : **1er septembre 2026** (prérentrée les 27, 28 et 31 août). Vacances de la Toussaint : **17 au 31 octobre**. Fériés : 1er et 11 novembre. Semaines A/B déclarées semaine par semaine.

### B2. La grille — treize créneaux de 3e, et un fil parallèle

| Jour | Créneau | Sem. | Classe | Fil |
|---|---|---|---|---|
| lundi | 08:57-09:52 | AB | Franklin | chapitre |
| lundi | 15:07-16:02 | A | Dylan | chapitre |
| mardi | 10:07-11:02 | AB | Dylan | chapitre |
| mardi | 15:07-16:02 | A et B | Franklin | chapitre |
| mardi | 16:04-16:59 | B | Dylan | chapitre |
| **mercredi** | **10:07-11:02** | **A** | **Franklin** | **langue** |
| mercredi | 10:07-11:02 | B | Franklin | chapitre |
| **mercredi** | **11:04-11:59** | **A** | **Dylan** | **langue** |
| jeudi | 15:07-16:02 | A | Dylan | chapitre |
| jeudi | 16:04-16:59 | B | Franklin | chapitre |
| vendredi | 10:07-11:02 | AB | Franklin | chapitre |
| vendredi | 11:04-11:59 | AB | Dylan | chapitre |

**Le fil « langue »** — du mercredi en semaine A à l'origine, passé au vendredi matin pour la période 1 le 26/08 au soir — est un objet que le chapitre ignore complètement. Mot de Paul, consigné par l'exécutant : « comme ça je fais la séance le même jour dans deux classes différentes, idéal pour mesurer l'écart ».

### B3. Ce que cela aurait changé au chapitre 1

**Le décompte n'a jamais été fait.** Du 2 septembre (rentrée des 3e) au 13 octobre : **20 séances de chapitre pour Franklin, 17 pour Dylan**, plus **2 séances de langue** chacune, et 5 jours où un événement d'établissement ampute un créneau.

> **Chiffres périmés le 26/08 au soir.** Le fil langue a été déplacé au vendredi matin pour la période 1, et le décompte ne retire plus que les journées entières réellement perdues. Le chapitre 1 dispose de **20 créneaux pour Franklin, 16 pour Dylan, et 6 heures de langue** chacune. Voir `PROGRESSION-ANNUELLE-3e.md` et le registre. La démonstration ci-dessous reste valable ; ses chiffres ne le sont plus. Le chapitre a été bâti en **neuf séances de deux heures** — dix-huit créneaux — sans qu'aucun décompte ne soit posé. Que le compte tombe juste relève de la chance, pas de la construction.

**Le fil langue n'est pas une séance à déplacer : c'est une progression parallèle.** J'avais d'abord écrit que la séance 3 — « Interro de cours et analyse logique » — « aurait dû aller au fil langue ». Paul a corrigé, et sa formulation change la nature du problème :

> « La question de la séance du mercredi est différente que tu ne le crois : en fait, ça demande une progression annuelle, mais qui traverse les chapitres chaque semaine. Donc la construction de tous les JSON des chapitres doit permettre d'intégrer ça, et c'est là où l'IA a une importance capitale pour le prof, parce qu'elle permet de relier la langue à l'échelle annuelle, à l'échelle du chapitre, et à l'échelle hebdomadaire. »

Il ne s'agit donc pas de déplacer une séance d'un fil à l'autre, mais de **tenir trois échelles à la fois** :
- **l'année** — une progression de langue qui a sa propre logique, du premier au dernier chapitre ;
- **le chapitre** — ce que la langue doit servir ici : l'analyse logique sert le brevet blanc et le paragraphe du chapitre 1 ;
- **la semaine** — une heure, le mercredi, qui avance d'un cran quel que soit le chapitre en cours.

**Ce que le JSON de chapitre doit donc permettre**, et ne permet pas aujourd'hui : qu'une séance déclare son appartenance au fil langue plutôt qu'au fil principal ; qu'elle porte son rang dans la progression annuelle de langue, indépendamment de son rang dans le chapitre ; et que le chapitre dise ce qu'il attend du fil langue au moment où il en a besoin. Le chapitre 1 ne porte aucune de ces trois choses : sa séance 3 est une séance de langue enfermée dans le fil principal, sans lien ni vers l'amont ni vers l'aval.

**C'est le point où l'IA est la plus utile au professeur** — mot de Paul — parce que relier ces trois échelles à la main, chapitre après chapitre, est précisément ce qu'un professeur n'a pas le temps de faire.

**La comparaison entre les deux classes n'est portée nulle part.** Le fil langue place les deux classes de 3e le même jour, en semaine A — « comme ça je fais la séance le même jour dans deux classes différentes, idéal pour mesurer l'écart ». Aucune séance du chapitre 1 n'est marquée comme devant être jouée en parallèle, aucun point de mesure n'est prévu.

**Le découpage « heure 1 / heure 2 » ne correspond pas à la configuration actuelle.** Les deux classes n'ont aujourd'hui que des heures **isolées**, réparties sur cinq jours, en semaines A et B différentes. J'ai découpé neuf séances de deux heures en supposant un bloc continu.
**Précision de Paul, qui interdit d'en faire une règle** : « pour les heures isolées, oui, mais attention, c'est la configuration actuelle : rien ne dit que ça ne bougera pas l'an prochain. » Un chapitre ne doit donc **ni supposer des heures consécutives, ni supposer des heures isolées** : il doit se découper d'après la grille de l'année en cours, quelle qu'elle soit.

**Le temps utile réel est plus court que ce que j'ai compté.** Le déroulé calcule fin − lancement − 5 minutes d'agenda : un créneau de 55 minutes vaut **50 minutes utiles**. Mes séances additionnent 110 minutes d'écrans là où deux créneaux en offrent 100. *Point à confirmer : je n'avais pas `DEROULE/CADRAGE-TEMPS.md` sous les yeux au moment du découpage — il est dans ce dépôt.*

**Le voyage à Verdun n'est entré dans aucun raisonnement.** Il tombe du 14 au 16 octobre, dernière semaine avant la Toussaint. Aucune contrainte extérieure de ce type n'a été demandée avant le découpage du chapitre 1 ; elle a surgi au moment du chapitre 2.

---

## PARTIE C — Ce que le prompt devrait exiger

1. **Donner les cinq formes de schéma et leur format de `src`** — en toutes lettres, avec un exemple de chacune. C'est la connaissance la plus coûteuse à ignorer.
2. **Donner la liste complète des blocs et des outils de marquage**, et dire ce qui n'existe pas : pas de bloc texte suivi, pas de bloc page.
3. **Dire que l'adresse d'un média est relative** à mjpc-medias.
4. **Distinguer fiche / item / écran** dès l'ouverture, et dire que rien ne circule entre item et écran.
5. **Faire commencer tout chapitre par un décompte de créneaux** : lire le calendrier et la grille, compter les heures réellement disponibles entre deux jalons, et ne découper qu'ensuite. Aujourd'hui le prompt fait produire des séances sans jamais demander combien d'heures existent.
6. **Porter le fil langue aux trois échelles.** Le JSON de chapitre doit permettre qu'une séance appartienne au fil langue, qu'elle porte son rang dans la progression annuelle de langue en plus de son rang dans le chapitre, et que le chapitre déclare ce qu'il attend de ce fil. Une progression de langue annuelle traverse les chapitres semaine après semaine ; le prompt doit la faire exister.
7. **Ne rien supposer de la forme des créneaux** : ni consécutifs, ni isolés. Le découpage se fait d'après la grille de l'année en cours, qui peut changer d'une année sur l'autre.
8. **Rappeler le temps utile** (fin − début − 5 minutes) au moment du découpage, et non après.
9. **Demander les contraintes extérieures** — voyage, brevet blanc, stage, EPI — avant le découpage.

---

## Ce qui reste de mon amendement précédent

La règle que j'avais formulée — « une capacité qu'on n'a pas pu vérifier ne se déclare pas absente » — reste juste, mais elle vise l'exécution. **Elle ne doit pas masquer le vrai défaut** : le prompt doit permettre de créer sans lire le moteur, et sans avoir à deviner l'emploi du temps. Une instance qui n'a que le prompt doit produire juste.

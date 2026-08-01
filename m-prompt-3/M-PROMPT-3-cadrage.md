# M-PROMPT-3 — CADRAGE (exécutant → conscience)
**01/08 · j'attends le feu vert**

## Lu (md5 mesurés)
**DISPOSITIF `4417009c2bd2cf9758a977e64d1ac49d`** (les deux règles du 01/08 lues) · DOCTRINE `e07900648409685caec7f2a2dae78265` · CHANTIER `a206952eedb4b7c3ea4fc2c85b476430` · ÉTAT-DES-LIEUX `8edbc8d7daa09a3ab61355cc0b3135e0` · **journal `8f09dc2234f02bbe53d30ddb85eaaccc`** · **restauration `dd11543922d9ee20392bd0fdba2a3bc8`**.
Contrat : **canon `d89d456389f598c7a731cf894a60a4cb` (1.4.0)**, §12 lue en entier. Modèles lus : **`correction_dictee` 577 012 o (6.3.0)** et **`worktrack` 1 048 372 o (M-PROMPT-2 promu)**.
**Mes trois bases** : `evaluation-qcm` **520 197 o · `542ba6c50a25d1d01eb8e3da7858cc39`** (7.2.0) · `analyse_logique` **555 950 o · `4e49d6d714b40b362679e507ea7f840d`** (2.3.0) · `applause_meter` **640 373 o · `c94e6f88020c830f8af0a6c61145dba5`** (2.2.0 — taille différente de mon relevé du 31/07 : un micro-correctif est passé entre-temps, consigné au journal). Les trois portent le canon **1.3.0**.

## ⚠ LA MESURE CONTREDIT LE MANDAT SUR LES TROIS APPS
Le mandat les dit « partielles, sans chaîne constituée ». **Mesuré : les trois ont une chaîne complète ou quasi complète.**

| | mandat | mesuré |
|---|---|---|
| `evaluation-qcm` | « `PROMPT_IA_DEFAUT` 97 c. », « pas de chaîne constituée » | **prompt de 3 350 c.** (concaténation sur ~25 lignes ; 97 c. = la première ligne seulement) · **DÉJÀ persisté en Firebase** (`<DB_ROOT>/settings/promptIa`, lu à l'init, écrit à l'édition) · **collage JSON + `parseEvaluation` + enregistrement** : la chaîne est ENTIÈRE |
| `analyse_logique` | « aucune validation ni injection de collage » | **`parseCorrige` EST la validation du collage** (format à lignes `PROP\|CODE\|texte`, pas JSON) ; elle collecte `nonLocalises` et **les affiche déjà** · **`promptCorrige` GÉNÈRE déjà son vocabulaire** depuis `ref.etiquettes` |
| `applause_meter` | « copier + collage seuls » | **chaîne complète** : `genererPromptIA` → copier → `jsonInput` → **`parseCriteresJSON`** → `appliquer()` |

**Conséquence sur le mandat de ce morceau** : je ne « complète » pas trois chaînes absentes, je **rattrape trois manques précis** dans des chaînes qui existent. Ce qui change ce que j'ajoute — et surtout ce que je n'ajoute pas.

## TABLEAU PAR APP — avec la colonne qui compte

### ① `evaluation-qcm` (7.2.0 → 7.3.0)
| ce qu'elle a | ce que le canon apporte | **ce que je N'AJOUTE PAS, et pourquoi** |
|---|---|---|
| prompt 3 350 c. persisté (SDK `set(draft, cb)`, erreur affichée) | **pièces** (`directives`+cadrage+`format`), **écriture par VERDICT** (le `cb(err)` du SDK ne distingue pas refus et panne), défaut en dur conservé | **pas de nouvelle injection** : `enregistrer()` écrit déjà l'évaluation, avec un **versionnement P2** (une éval qui a servi crée une VERSION, résultats jamais mélangés). Y poser une archive-avant serait redondant : **le versionnement EST la protection**, et plus fine qu'une corbeille |
| `parseEvaluation` : messages nommés (« Question 3 : il faut au moins 2 choix ») mais **`return` au PREMIER** | **motifs accumulés**, questions citées, message qui dit quoi corriger | **je ne touche pas au format écrit** (`titre`/`questions`/`version`) ni au versionnement |
| `snapshotImport` (fichier) | — | **rien** : c'est un import de sauvegarde, pas une chaîne prompt. Hors sujet |
| types de question (`facile/standard/approfondi/expert`) écrits à la main dans le prompt | **vocabulaire GÉNÉRÉ** depuis la source des niveaux (`getNiveau`) | |

### ② `analyse_logique` (2.3.0 → 2.4.0)
| ce qu'elle a | ce que le canon apporte | **ce que je N'AJOUTE PAS** |
|---|---|---|
| `promptCorrige(texte, ref)` : **jamais persisté**, vocabulaire déjà généré à la main depuis `ref.etiquettes` | **persistance** des directives (`/analyse_logique_prompts/corrige/*`), **vocabulaire par `mjpcPromptVocabulaire`** (même sortie, mécanisme canonique), texte et étiquettes par **jetons `{{PHRASE}}` / `{{CODES}}`** | **pas d'injection au hub** : le retour de l'IA sert à afficher une analyse **à l'écran**, il n'est pas écrit dans une base. Poser une injection serait inventer un usage |
| `parseCorrige` : ignore silencieusement les lignes fautives (`nonLocalises` affiché en fin, ligne par ligne) | **motifs accumulés et nommés en amont** : ligne inconnue, code hors référentiel, champ manquant — **avant** de tenter la localisation | **je ne touche pas** à `parseCorrige` ni au rendu du noyau : la validation s'ajoute **à côté**, comme `wtValiderChapitre` à côté de `validateChapter` (patron M-PROMPT-2) |
| bugs signalés par Paul, non instruits | — | **je ne les cherche pas et ne les répare pas.** Si j'en croise un : signalé au rapport |

### ③ `applause_meter` (2.2.0 → 2.3.0)
| ce qu'elle a | ce que le canon apporte | **ce que je N'AJOUTE PAS** |
|---|---|---|
| `genererPromptIA(theme, nb)` construit à la volée, **jamais persisté** | **persistance** (`/applause_prompts/criteres/*`), thème et nombre par **jetons `{{THEME}}` / `{{NB}}`**, défaut en dur | **pas d'injection au hub** : `appliquer()` remplit les critères **en mémoire**, Paul les ajuste, puis l'app enregistre par son mécanisme propre. Une injection directe court-circuiterait l'ajustement — c'est le contraire de ce que l'écran promet |
| `parseCriteresJSON` : `{ok}` ou **`{err}` unique** (premier motif) | **motifs accumulés**, critère cité (« critère 3 : emoji manquant ») | **les CINQ `valider` ne sont pas touchées** : validations métier du passage à l'oral, sans rapport. Intactes à l'octet, prouvé |
| mode test M14 (`codesTest` prioritaire) | — | **respecté**, aucune écriture au hub en mode test |

## À quoi sert concrètement une injection dans chacune — réponse honnête
**Aucune des trois n'a besoin d'une injection nouvelle.** `evaluation-qcm` écrit déjà, avec une protection meilleure qu'une corbeille (le versionnement). `analyse_logique` affiche, n'écrit pas. `applause_meter` remplit un formulaire que Paul ajuste avant d'enregistrer. **Je n'en pose aucune** : le mandat prévoit ce cas (« si la réponse est rien, dis-le et ne pose pas d'injection »), et une capacité inutile serait une dette.

## Portée des ancres — la règle du 01/08 appliquée
Mesuré avant de coder : `parseEvaluation` (qcm) et `promptCorrige`/`parseCorrige` (analyse) sont **top-level** ; `parseCriteresJSON` (applause) est **top-level** aussi, mais `CarteIACriteres` qui l'appelle est un composant React. **Mes sections iront donc juste après le canon embarqué (portée globale garantie)**, et j'exposerai les fonctions d'app par `window.` implicite du niveau global — comme dans `dictee_universelle` après correction. **Chaque fonction posée sera vérifiée présente sur `window` au banc navigateur**, pas seulement en mémoire.

## Textes soumis
- « Modifie les consignes envoyées à l'IA — **elles te suivent d'un appareil à l'autre**. »
- Refus : « Je ne peux pas utiliser cette réponse : » + liste nommée.
- qcm, échec d'écriture : « L'enregistrement n'a pas abouti — ton texte est toujours à l'écran. »
- analyse, lignes refusées : « N ligne(s) n'ont pas pu être utilisées : » + chacune citée avec sa raison.

## Questions (2)
**Q1 — `evaluation-qcm` persiste déjà son prompt.** Le gain du canon s'y réduit au **verdict d'écriture** et aux **pièces**. Est-ce que je fais aussi migrer le CHEMIN (`<DB_ROOT>/settings/promptIa` → `/evaluation-qcm_prompts/qcm/directives`) ? **Je propose de garder le chemin historique** (aucune donnée déplacée, aucun risque de perdre le prompt actuel de Paul) et de ne canoniser que le mécanisme — comme j'ai fait pour `correction_dictee` à M-PROMPT-1.
**Q2 — le vocabulaire généré d'`analyse_logique` fonctionne déjà** (les étiquettes du référentiel sont énumérées dans le prompt). Le refaire avec `mjpcPromptVocabulaire` ne change rien pour Paul. **Je propose de le canoniser quand même** (une seule mécanique dans l'écosystème, et la preuve « élément factice → il apparaît » devient vraie partout), **mais en gardant la sortie identique**. Ou préfères-tu la règle de M-PROMPT-2 (« ne pas uniformiser ce qui marche ») et je le laisse ?

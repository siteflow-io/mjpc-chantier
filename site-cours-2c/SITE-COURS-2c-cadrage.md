# SITE-COURS-2c — CADRAGE (exécutant → conscience)
**01/08 · j'attends le feu vert**

## Lu (md5 mesurés)
**DISPOSITIF `6546b8b2ff84397e2549da60eac184d2`** (les trois règles du 01/08) · **DOCTRINE `fb3da0c7aa87cae38737e5944cbd7659`** (règle des deux publics) · **doctrine du site `bbc34f10fd772eb16b0268cafaebe3f5`** (sections SITE-COURS du 29/07 : Q1–Q4, flux Windows, Q11–Q13) · **CHANTIER `cc4dce63391d55faa3e1ef4f6afe0a5c`** (« LE PROMPT MAÎTRE DE CHAPITRE ») · **ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d`** · **journal `8ceedbd58c984263fc70863285a874a3`** · canon **`d89d456389f598c7a731cf894a60a4cb` (1.4.0, §12)**.
**Base** : `index.html` **585 177 o · `7731b10b421579055596816be4597b84` · 8.11.0** (SITE-COURS-2a promu ; sa zone `§ ZONE PROMPT IA → JSON` lue).
**Taxonomie lue au hub** : 54 466 o · md5 `5600f48122e16f41fde291d75e944f74`.

## Mesures qui commandent le morceau
**La taxonomie** : 5 domaines, 40 familles, **154 notions** — confirmé. ⚠ **`niveaux` est une CHAÎNE d'intervalle, pas une liste** : valeurs réelles `6e-3e` (64), `5e-3e` (41), `4e-3e` (33), `6e-4e` (8), `3e` (7), `5e-4e` (1). Compétences : `francaisC4` (5 blocs) + `transversales` (3), **~2 000 c.**
**LE BORNAGE N'EST PAS NÉCESSAIRE, et je l'argumente** : le vocabulaire complet (`id : libellé [niveaux]`) fait **≈ 10 900 caractères**, ≈ 13 000 avec les compétences — **moins que le `PROMPT_CHAPTER` de worktrack (14 974 c.), qui tourne en production depuis juillet**. Borner par niveau ne retirerait presque rien (147 des 154 notions concernent la 3e) et **priverait Paul du spiralaire** — or la doctrine (Q11) dit que la fiche migre d'une année sur l'autre. Je livre donc la taxonomie **entière**, avec le `niveaux` de chaque notion **affiché** pour que l'IA signale elle-même un débordement d'attendus.
**Le format du hub, mesuré sur `/site/3e`** : `chapitres` est une **liste de 10 dont l'index 0 est `null`** (trou de liste Firebase — à traverser sans le supprimer). Chapitre `{ordre, published, seances[], title}` ; séance `{ordre, published, title, type, items{}}` ; item `{icon, kind, ordre, published, ref, source, subtitle, title}` + `legacy_docid` sur certains. **18 items examinés** : `kind` ∈ {doc 15, analyse_logique, dictee, tache}, `source` ∈ {drive 15, html, firebase_app, external}. **`published` est tantôt un booléen, tantôt une carte par classe** — les deux graphies coexistent (`3e_charles_de_gaulle` et `3E Charles de Gaulle`). **Aucun item ne porte `notions[]` ni `competences[]`** : confirmé.
**Les items à lier** : **1 seul en 3e** (`firebase_app` + `ref:""`, sous-titre « À lier à une dictée existante »). Le mécanisme existe, je l'emploie.
**Types de séance mesurés** : `intro_image, etude_texte, notions, dictee_reecriture, atelier_ecriture, remediation, tache_finale` — **7, pas 8** (le mandat en annonce 8 ; les chapitres garnis ont **9 séances**, dont deux du même type). Mesure sourcée.

## La forme du JSON de chapitre (adossée au format mesuré, ajout de champs seulement)
```json
{ "produit":"chapitre", "niveau":"3e", "chapitre":{ "title":"…", "ordre":3,
  "seances":[ { "title":"…", "type":"etude_texte", "ordre":2,
      "notions":["gram-fonc-004"], "competences":["c4-ecrit-02"],
      "items":{ "etude-de-texte": { "title":"…", "subtitle":"…", "kind":"doc",
          "source":"drive", "ref":"", "ordre":1, "icon":"📄",
          "notions":["ortho-lex-001"], "competences":["c4-lecture-01"] } } } ] },
  "aLier":[ {"seance":"Dictée et réécriture","item":"dictee-du-chapitre","outil":"dictee","pourquoi":"…"} ] }
```
`published` **n'est jamais écrit par l'injection** : publier reste le geste de Paul (bouton existant). L'ajout se limite à `notions[]` et `competences[]`, plus le bloc `aLier` **qui ne va pas au hub** : il alimente la liste de travail à l'écran.

## Le dispatch, outil par outil — trois NON argumentés, un OUI, un « plus tard »
| outil | nœud | format mesuré | **créable par dispatch ?** |
|---|---|---|---|
| **réécriture** | `/reecritures/<clé>` | `config.pieges = [{tokenIdx, attendu, fautif}]` — **des index de tokens** | **NON.** `tokenIdx` suppose la tokenisation exacte de l'app ; la produire ici serait **réimplémenter la tokenisation**, interdit absolu. Une IA ne peut pas deviner ces index. L'item naît « à lier », Paul crée la réécriture dans son app |
| **dictée** | `/dictees/<clé>/config` | `text, analyseGramm (analyse mot à mot), bareme, pairs (binômes élèves), transcriptionMode…` | **NON.** `analyseGramm` est produite par le prompt d'analyse **de l'app** (M-PROMPT-2), et `pairs` dépend des élèves présents. Deux chaînes IA imbriquées = deux sources de vérité |
| **correction_dictee** | `/correction_dictee/<id>/exercices` | dérive d'une dictée existante | **NON.** Sans dictée, l'objet n'a pas de sens |
| **QCM** | `/qcm/evaluations/<id>` | `{titre, questions[{enonce, choix, bonnes, niveau}], createdAt}` — **autonome, sans dépendance** | **OUI, techniquement le seul.** Mais : `evaluation-qcm` a **son propre prompt canonique** (M-PROMPT-3) et un **versionnement** ; dispatcher depuis le site créerait une deuxième porte d'écriture sur le même nœud |
| **analyse_logique** | `/analyse_logique/travaux/<id>/config` | `{texte, titre, classe, niveau, modeCode, base, published}` — **autonome** | **OUI, techniquement.** Même réserve : l'app a sa chaîne |

**MA POSITION, ET JE PROPOSE DEUX MORCEAUX** : **2c = le chapitre seul** (structure, taggage, inventaire, injection, liste de travail). **2d = le dispatch des outils**, si Paul le veut encore après avoir vu 2c tourner. Raison : sur cinq outils, **trois sont impossibles sans réimplémenter ce qui est interdit ou sans inventer des données d'élèves**, et les deux possibles ont déjà leur propre chaîne canonique. Le gain réel du dispatch est donc **faible et le risque élevé** — alors que **le chapitre, lui, résout le problème que Paul décrit** (uniformiser, tagger, combler les trous). *L'ordre le plus solide, comme il l'a dit.*

## Compléter / remplacer / jumeau — je confirme la piste, avec une nuance
**« Compléter » par défaut, et c'est mesuré** : les chapitres de 3e ont **9 séances et 0 item** (sauf deux). Il n'y a rien à écraser — **l'injection sert à GARNIR**. Les trois voies sont livrées, mais l'écran présente **compléter en premier**, remplacer en second (archive AVANT, abandon si elle échoue), **jumeau** en troisième (chapitre ajouté en fin de liste, `published` absent, titre suffixé « (proposition) »). **Nuance** : « compléter » ne touche jamais un item existant, même si l'IA propose mieux — les différences sont **listées à l'écran** et laissées à Paul.

## L'inventaire face à face (exigence de Paul)
Avant toute écriture, l'écran liste **précisément** : pour chaque séance existante, son titre, son type, **chaque item avec son titre, son outil (`kind`/`source`), et son état de liaison** ; en regard, ce que l'IA apporte, marqué **NOUVEAU / DÉJÀ LÀ / DIFFÉRENT**. Les notions et compétences proposées sont nommées **en libellé** (jamais l'identifiant seul — règle des deux publics).

## Ancres et portées (règle du 01/08)
`ATELIER_PROMPTS`/`ATELIER_PROMPT_SEED`, `atPromptComposantes`, `AT_IA`, `atIAOuvrir` sont **top-level** dans `index.html` (vérifié). Ma section ira **juste après la zone existante**, au même niveau, et **chaque fonction posée sera vérifiée présente sur `window` au banc navigateur**.
**Et je prouverai la promesse de SITE-COURS-2a** : ajouter le produit « chapitre » = **une entrée de plus dans `ATELIER_PROMPT_SEED` + une source de vocabulaire**, sans toucher la mécanique de la fiche de séance (diff à l'appui).

## Questions (3)
**Q1 — Deux morceaux (2c chapitre, 2d dispatch) : validé ?** Si tu veux le dispatch ici, dis-lequel : je ne poserai que QCM et/ou analyse_logique, et je dirai au rapport que c'est une seconde porte d'écriture.
**Q2 — Le trou de liste (`chapitres[0] === null`)** : je le **traverse sans le supprimer** (une écriture de liste complète le ferait disparaître et décalerait tous les `ordre`). J'écris **par index** (`/site/3e/chapitres/3/seances/…`), jamais la liste entière. Confirmes-tu ?
**Q3 — `published` à deux graphies** (`3e_charles_de_gaulle` et `3E Charles de Gaulle`) coexistent dans le même chapitre. Je **n'y touche pas** et je ne publie rien. Mais faut-il le **signaler à l'écran** comme une incohérence à corriger, ou le laisser silencieux (hors mandat) ?

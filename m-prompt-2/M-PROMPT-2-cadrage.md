# M-PROMPT-2 — CADRAGE (exécutant → conscience)
**01/08 · j'attends le feu vert**

## Lu (md5 mesurés)
**DISPOSITIF `2406ffdb0b1ad6743c3e06e7a716225c`** (a changé : la règle du 01/08 « un stub qui ne copie pas la signature réelle valide un code faux » y est) · DOCTRINE `e07900648409685caec7f2a2dae78265` · CHANTIER `a206952eedb4b7c3ea4fc2c85b476430` · ÉTAT-DES-LIEUX `8edbc8d7daa09a3ab61355cc0b3135e0` · **journal `fbc0a381e69c99c722a0b8a55d96ebe5`** · **restauration `5e51f2bdf12f5340c7d676bcf3b8e602`**.
**Mon contrat** : `mjpc-core.js` **25 143 o · `d89d456389f598c7a731cf894a60a4cb` · 1.4.0** (promu — §12 lue en entier). **Mon modèle** : `correction_dictee.html` **577 012 o · `9b700154a45d0f589bcf0d6caf957471` · 6.3.0** (promu — section `§ PROMPTS` lue).
**Mes trois bases** (re-téléchargées, >1 Mo par `git/blobs`) : `worktrack` **1 034 102 o · `2dfe32e911b4064851fcd09ba6f89683`** (meta `2026-07-31b`) · `dictee_universelle` **1 974 360 o · `db6f242b4aeb0714209fdd796fcf3e4e`** (2.2.0) · `pilotage_debat_s3` **468 885 o · `1cd9feeb3311d42abc8408e0256f06f1`** (2026-07-31-2). Les trois portent le canon **1.3.0** embarqué.

## TABLEAU PAR APP

### ① `worktrack` — la dette du prompt non persisté
| | aujourd'hui | après |
|---|---|---|
| prompt | `PROMPT_CHAPTER` 14 974 c., monolithe ; `PROF.tpl` initialisé dessus | pièces du canon : `directives` (éditable, **persistée**) + `MJPC_PROMPT_CADRAGE` + `format`, assemblées par `mjpcPromptComposer` |
| persistance | **`saveTpl()` n'écrit NULLE PART** — ni Firebase, ni `localStorage` : le template vit en mémoire de session et meurt au rechargement | `mjpcPromptCharger/Enregistrer`, chemin `/worktrack_prompts/chapitre/*`, **défaut en dur en repli**, écriture par verdict |
| validation | `validateChapter` : `return` au **premier** motif | `mjpcValidation` : motifs **accumulés et nommés** |
| injection | `loadChapter(obj)` direct | aperçu → confirmation → **archive avant** si un chapitre existe |
| **subsiste** | le garde-fou seed↔production, `chapterDefaults`, le mode test, la sortie clavier par empreinte, les pastilles `VERSION`/meta | |

**⚠ TROUVAILLE À SIGNALER — L'INTERFACE MENT.** L'infobulle du bouton dit : *« tes modifications sont mémorisées sur ce poste »*. **Le code ne mémorise rien** (`saveTpl(){ this.tpl=…; toast("Template enregistré."); }` — grep `lsSet` dans `saveTpl` = 0). Le mandat et le chantier décrivent la dette comme « mémorisé sur le poste, pas en Firebase » : **c'est pire que documenté**. Sourcé, corrigé par ce morceau, et le texte de l'infobulle doit changer (proposé plus bas).

### ② `dictee_universelle` — la validation qui s'arrête, et un prompt jamais stocké
| | aujourd'hui | après |
|---|---|---|
| prompt | `generateAnalysePrompt()` : template littéral construit à la volée, **jamais stocké**, données interpolées dans le littéral | pièces du canon, `/dictee_universelle_prompts/analyse/*`, données par **jetons `{{TEXTE}}`, `{{NIVEAU}}`** |
| validation | `parseInjectJson` : compte valides/invalides, **un seul message global** (« Format invalide. Attendu… »), aucune clé nommée | motifs **accumulés**, chaque clé d'élève fautive **citée** |
| injection | `doInject` : chaîne d'`update()` par clé, compte `done/errors`, **se déclare « Terminé » même avec des erreurs** | verdict par écriture, **geste déclaré NON TERMINÉ si une écriture échoue** (patron M-ÉCHECS) |
| **subsiste** | le format écrit au hub (`resultsRef.child(k).update`), les trois étapes de l'écran, le téléchargement JSON, `validateCarnetForDictee` (qui n'est PAS une validation de prompt : c'est la validation prof d'un carnet — **je n'y touche pas**, le mandat la cite mais le code montre autre chose) | |

**Constat mode test** : le mandat dit « aucune occurrence ». **Mesuré : 5 occurrences** — mais ce sont `classeTestId()` du socle, `_test_c1/_test_c2` (données de banc) et `_test_flux_<seed>` : **aucun interrupteur de mode test à l'écran**. Le constat du 30/07 tient sur le fond ; je le précise plutôt que de le répéter.

### ③ `pilotage_debat_s3` — le booléen nu
| | aujourd'hui | après |
|---|---|---|
| prompt | `copierPromptDocs()` : ~10 documents, lignes concaténées, valeurs de champs interpolées, **jamais stocké** | pièces du canon, `/pilotage_prompts/documents/*`, champs par jetons |
| validation A | `validerDocumentsJSON` : **accumule déjà** (12 motifs affichés) — **rien à rattraper, je la garde** et je l'exprime avec `mjpcValidation` sans changer un message | |
| validation B | **`validateDebatImport(payload)` = `return !!(payload && (payload.debat \|\| payload.binomes))`** → toast « Ce fichier n'est pas un export de débat. » | motifs **nommés** : ce qui manque, ce qui est attendu |
| injection | `injecterDocuments` : `set()` direct après validation | archive avant si des documents existent (le code a déjà `revenirDocsExemple` qui archive : **même patron, étendu**) |
| **subsiste** | tout le reste du fichier — **je ne touche à RIEN d'autre** (dette de refonte multi-classes déclarée) | |

## Ce que chacune PERDRAIT si la conversion était mal taillée
· **worktrack** : le garde-fou seed↔production (si `chapterDefaults`/`validateChapter` divergeaient entre injection et comparateur → **faux positifs systématiques**, le commentaire du code le dit) ; la sortie clavier par empreinte (M-SÉCU-3) ; le mécanisme « Publier » articulé au meta.
· **dictee_universelle** : le comptage `done/errors` de l'injection (que je **renforce** au lieu de le retirer) ; l'interpolation du texte de dictée et du niveau ; les trois étapes de l'écran.
· **pilotage** : `validerDocumentsJSON` et ses messages déjà bons ; `revenirDocsExemple` et son archive ; **et tout le reste du fichier, hors périmètre absolu**.

## Comment je prouve les trois dettes fermées
① **worktrack** : au banc, `saveTpl` → écriture observée au chemin ; **rechargement simulé** (état vidé) → le prompt de Paul revient ; **base muette** → défaut en dur. Plus le grep « avant : 0 écriture / après : 1 ».
② **pilotage** : un export sans `debat` ni `binomes`, puis un avec `debat` mal formé → **des motifs nommés** là où le booléen ne disait rien ; l'ancien comportement (refus) est conservé, seule la parole change.
③ **les trois** : un JSON à trois défauts distincts → **les trois motifs d'un coup**, chacun citant son élément et disant quoi corriger.
Et pour chaque app : **canon ↔ embarqué fonction par fonction**, parse script par script (ancre `^<body`, jamais lecture), diff classé, invariants, journal réseau, mobile 390, captures.
**Mes stubs copieront les signatures du canon** (`mjpcEcrireRest` → `cb(issue)`, un seul argument) : c'est la règle du 01/08, et je la vérifierai en lisant le canon, pas ma mémoire.

## Textes soumis (aucun jargon)
- worktrack, infobulle **corrigée** : « Modifie les consignes envoyées à l'IA — **elles te suivent d'un appareil à l'autre**. »
- Refus : « Je ne peux pas utiliser cette réponse : » + la liste nommée.
- Aperçu : « Voici ce qui sera enregistré. Rien n'est écrit tant que tu n'as pas confirmé. »
- Remplacement : « Ce chapitre remplacera le précédent. L'ancien part d'abord à la corbeille. » / s'il n'y a rien : « Rien ne sera perdu. »
- Injection partielle (dictee) : « **Terminé pour N élèves sur M.** X n'ont pas pu être enregistrés — relance : seuls ceux qui manquent seront repris. »
- Archive en échec : « La mise à la corbeille a échoué — **rien n'a été remplacé**. »

## Questions (3)
**Q1 — `validateCarnetForDictee` n'est pas ce que le mandat croit.** Le mandat la range parmi les pièces de la chaîne prompt ; **le code montre une fonction de validation prof d'un carnet d'élève** (`ref.orderByChild("dicteeId")… update(profValidated)`), sans rapport avec les prompts. **Je propose de ne pas y toucher** et de traiter à sa place `parseInjectJson`, qui est la vraie validation de collage. Confirmes-tu ?
**Q2 — `validerDocumentsJSON` de pilotage accumule déjà et ses messages sont bons.** La réexprimer avec `mjpcValidation` la ferait passer par le canon **sans rien gagner pour Paul**, avec un risque de régression sur des messages éprouvés. **Je propose de la LAISSER telle quelle** et de n'appliquer le canon qu'à `validateDebatImport` (le booléen nu, dette ②). Ou veux-tu l'uniformité complète ?
**Q3 — l'archive avant injection dans worktrack.** Un chapitre injecté remplace le chapitre courant, qui porte **les progressions des élèves** (l'infobulle actuelle dit « les progressions sont conservées » : elles vivent ailleurs, sous `/eleves`). L'archive porterait donc le seul chapitre. **Je propose d'archiver le chapitre et de dire dans la confirmation que les progressions ne sont pas touchées.** Validé ?

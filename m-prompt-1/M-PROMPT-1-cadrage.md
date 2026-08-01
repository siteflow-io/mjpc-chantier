# M-PROMPT-1 — CADRAGE (exécutant → conscience)
**01/08 · j'attends le feu vert**

## Lu (md5 mesurés)
DISPOSITIF `ce116a8cdb82c5ad4a8b0365cfa4613a` · DOCTRINE `e07900648409685caec7f2a2dae78265` · **CHANTIER `a206952eedb4b7c3ea4fc2c85b476430`** (section « LE PROMPT MAÎTRE DE CHAPITRE » lue : trois échelles, l'injection commande la liaison, ordre ①canon ②prompt maître ③passe sur les apps) · ÉTAT-DES-LIEUX `8edbc8d7daa09a3ab61355cc0b3135e0` · **journal `d8f94d0efeab8119a2ee5cb33d3b232e`** · canon `f5e81602f8aee1ca17a9721546066efa` (1.3.0, 17 620 o).
Les quatre chaînes, re-téléchargées : **`correction_dictee` 558 431 o `d86e56fa79377389c21621b063f97355`** · `dictee_universelle` 1 974 360 o `db6f242b4aeb0714209fdd796fcf3e4e` · `pilotage_debat_s3` 468 885 o `1cd9feeb3311d42abc8408e0256f06f1` · `worktrack` 1 034 102 o `2dfe32e911b4064851fcd09ba6f89683`. Lu aussi, sans y toucher : `index.html` 585 177 o (SITE-COURS-2a promu — son `atPromptComposantes` est le patron du vocabulaire généré).

## LE TABLEAU DE CORRESPONDANCE — ce que le canon EXTRAIT, ce qu'il RATTRAPE
| | `correction_dictee` (le patron) | `worktrack` | `dictee_universelle` | `pilotage_debat_s3` | **le canon 1.4.0** |
|---|---|---|---|---|---|
| **composition** | **2 pièces assemblées** (`assemblePrompt(directives,format)`) + un 2e jeu séparé (`promptIaBanque`) | 1 chaîne monolithique (`PROMPT_CHAPTER`, 14 975 c.) | template littéral construit à la volée (`generateAnalysePrompt`) | tableau de lignes concaténées (`copierPromptDocs`) | **EXTRAIT de correction_dictee** : `directives` + `format`, assemblés à la volée, **+ `vocabulaire` (généré)** et **+ `donnees` (interpolées)** |
| **interpolation** | **`{{JSON_DICTEE}}` remplacé par le JSON de la dictée** (2 sites) | aucune | données dans le littéral | valeurs de champs concaténées | **RETENU et généralisé** : jetons `{{…}}` fournis par l'app |
| **vocabulaire** | énuméré à la main dans le format | énuméré à la main | — | — | **RATTRAPE** (patron `atPromptComposantes` de SITE-COURS-2a) : généré depuis une source fournie par l'app |
| **persistance** | **Firebase `dictee_settings/prompt{IaBanque,Directives,Format}`**, défaut en dur en repli | **aucune** (dette déclarée) | aucune | aucune | **EXTRAIT** : chemin par app + produit, défaut en dur qui fait foi si la base est muette |
| **écriture** | SDK direct `db.ref().set().then().catch()` | — | — | — | **RATTRAPE** : `mjpcEcrireRest`/`MJPC_ISSUE` du socle 1.2.0 (trois issues), mode test gratuit |
| **cadrage imposé** | présent dans les directives | **texte de référence** (« NE PRODUIS AUCUN JSON TOUT DE SUITE… ») | partiel | absent | **EXTRAIT de worktrack**, imposé à tout prompt canonique |
| **validation** | `validateItems` : messages contextués (`ctx item 3 : type manquant`) mais **s'arrête au premier**, cite l'INDEX pas l'élément | `validateChapter` : **s'arrête au premier** | — | **`validateDebatImport` = booléen nu, AUCUN message** | **RATTRAPE les trois exigences** : élément CITÉ · message qui dit QUOI CORRIGER · **refus qui S'ACCUMULENT** |
| **injection** | `.set(parsed)` sur `correction_dictee/<id>/exercices` — **ni aperçu, ni archive : écrasement sec** | `loadChapter` direct | `.set` direct | `.set` direct | **RATTRAPE** : aperçu → confirmation → si remplacement, **archive `{_meta,data}` AVANT**, **abandon si elle échoue**, geste non terminé si une écriture échoue |

**Ce que cette mesure prouve** : le canon n'invente rien — chaque pièce vient d'une app qui la porte déjà. Les quatre « RATTRAPE » sont des capacités qu'une app a et que les autres n'ont pas, sauf l'archive-avant-écrasement, qui vient du chantier (`atCorbeilleCle`, M-SÉCU-3/-4) et qu'**aucune des quatre n'a**.

## La forme du canon — **§ 12** (et un signalement)
Le canon porte bien **deux sections « 8 »** (Manifeste ligne 153, Session partagée ligne 169) ; je ne renumérote pas. **Et il porte aussi un TROU : il n'y a pas de §10** (les sections vont 1→8, 8, 9, 11). Je prends donc **§ 12**, et je signale les deux anomalies au rapport plutôt que de « ranger ».
`MJPC_PROMPT` (§12, 1.4.0) : `mjpcPromptComposer(pieces)` — assemble directives + vocabulaire + format, puis substitue les jetons `{{…}}` de `donnees` · `mjpcPromptCharger(app,produit,defauts,cb)` / `mjpcPromptEnregistrer(app,produit,piece,texte,cb)` — chemin `/<app>_prompts/<produit>/<piece>`, **défaut en dur si la base est muette**, écriture par `mjpcEcrireRest` (verdicts) · `mjpcPromptVocabulaire(source,options)` — génère la liste depuis une source fournie (objet d'entrées `{id:{libelle,champs,reserve}}`), **réservées exclues** · `MJPC_PROMPT_CADRAGE` — le texte d'injonction de worktrack, constante réutilisée · `mjpcValidation()` — **un accumulateur** : `.exige(cond,msg)`, `.cite(id,msg)`, `.motifs()` (max 8), pour que les refus s'additionnent et nomment · `mjpcInjecterAvecArchive({chemin,app,donnees,archiver},cb)` — archive d'abord, abandon si elle échoue, écrit ensuite, verdict rendu.

## Ce que `correction_dictee` PERDRAIT si le canon était mal taillé
① **l'interpolation `{{JSON_DICTEE}}`** (le prompt contient les données de la dictée) — d'où la 4e pièce ; ② **ses DEUX jeux de prompts** (banque d'exercices / exercices personnalisés) — d'où l'axe `produit`, comme SITE-COURS-2a ; ③ ses **contrôles métier** (`qcm` : ≥2 propositions et `reponse` numérique ; `trous` : autant de `null` dans `segments` que de `reponses`) — le canon ne les remplace pas, il les **accueille** : l'app garde ses règles, le canon fournit l'accumulateur et les messages ; ④ **le format écrit au hub** (`exercices_classe` / `exercices_personnels`) — **je n'y touche pas** ; ⑤ sa suppression de banque et ses écrans. Après passage, elle doit faire **au moins** tout cela.

## Textes soumis (aucun jargon)
- Édition : « **Consignes données à l'IA** » (directives) · « **Format de réponse attendu** » (format) · « Ces consignes te suivent d'un appareil à l'autre. »
- Vocabulaire : « La liste des éléments disponibles s'ajoute automatiquement : elle reste juste quand l'application évolue. »
- Refus : « Je ne peux pas utiliser cette réponse : » + la liste nommée.
- Aperçu : « Voici ce qui sera enregistré. Rien n'est écrit tant que tu n'as pas confirmé. »
- Remplacement : « Cette banque remplacera la précédente. L'ancienne part d'abord à la corbeille, tu pourras la retrouver. »
- Archive en échec : « La mise à la corbeille a échoué — **rien n'a été remplacé**. »

## Questions (2)
**Q1 — L'écriture par REST au lieu du SDK.** Passer la persistance des prompts aux verdicts du socle (exigence 2 du mandat) fait changer `correction_dictee` de mécanisme d'écriture pour ces trois nœuds : SDK `db.ref().set()` → `mjpcEcrireRest`. Même hub, même chemin, même contenu, **mais règles Firebase et hors-ligne se comportent différemment**. Je propose de le faire **pour les prompts seulement** (périmètre du morceau) et de laisser l'injection des exercices sur son mécanisme actuel, en signalant la dette. Confirmes-tu, ou faut-il aussi convertir l'injection ?
**Q2 — L'archive avant écrasement change un comportement de production.** Aujourd'hui l'injection écrase la banque sans archive ni aperçu. Le canon ajoute les deux : c'est un **gain**, mais aussi **un geste de plus pour Paul** (confirmer). Je propose l'aperçu + confirmation **systématiques** et l'archive **seulement quand une banque existe déjà**. Valides-tu ce dosage ?

# M-PROMPT-2 — RAPPORT D'EXÉCUTION : les trois chaînes passent au canon
**01/08 · exécutant → conscience · checklist à preuves**

## 1. md5
Documents : DISPOSITIF `2406ffdb0b1ad6743c3e06e7a716225c` · DOCTRINE `e07900648409685caec7f2a2dae78265` · CHANTIER `a206952eedb4b7c3ea4fc2c85b476430` · ÉTAT-DES-LIEUX `8edbc8d7daa09a3ab61355cc0b3135e0` · journal `fbc0a381e69c99c722a0b8a55d96ebe5` · restauration `5e51f2bdf12f5340c7d676bcf3b8e602`.
Contrat : **canon `d89d456389f598c7a731cf894a60a4cb` (1.4.0)**. Modèle : **`correction_dictee` 6.3.0 `9b700154a45d0f589bcf0d6caf957471`**.
**Bases → livrés** (re-téléchargées à l'instant de l'édition ; >1 Mo par `git/blobs`) :
| app | base | livré | pastille |
|---|---|---|---|
| worktrack | 1 034 102 o · `2dfe32e911b4064851fcd09ba6f89683` | **1 048 372 o · `2518f6162a9029f325eeec8f0c20e52d`** | meta `2026-07-31b` → **`2026-08-01a`** (`VERSION` non renommée) |
| dictee_universelle | 1 974 360 o · `db6f242b4aeb0714209fdd796fcf3e4e` | **1 985 615 o · `dfee9df9ebb5fb437e8a0fa8c8ddc339`** | 2.2.0 → **2.3.0** |
| pilotage_debat_s3 | 468 885 o · `1cd9feeb3311d42abc8408e0256f06f1` | **479 275 o · `8d33882eff1b3b2b94067fa4b9819712`** | 2026-07-31-2 → **2026-08-01-1** |

## 2. LES TROIS DETTES, FERMÉES ET PROUVÉES
**① `worktrack` — le prompt qui n'était persisté nulle part.** Confirmé sur pièces : `saveTpl(){ this.tpl=…; toast(…) }`, zéro `lsSet`, zéro Firebase — **et l'infobulle annonçait « mémorisées sur ce poste »**. Désormais : `wtEnregistrerPrompt` écrit `/worktrack_prompts/chapitre/directives` **par verdict**, `wtChargerPrompt` relit, `PROMPT_CHAPTER` reste le **défaut en dur**. Prouvé au banc mémoire (①a grep avant/après · ①b écriture · **①c rechargement simulé, `PROF.tpl` vidé → le prompt de Paul revient** · ①d base muette → défaut en dur · ①e panne → verdict FAUX) et **à l'écran au banc navigateur** (écrit au hub, vidé, relu). L'infobulle dit maintenant la vérité.
**② `pilotage_debat_s3` — le booléen nu.** `validateDebatImport` rendait `!!(payload && (payload.debat || payload.binomes))` → un toast muet. `pdValiderImport` rend des **motifs nommés** : « Ce fichier ne contient ni débat, ni binômes… », et deux défauts de forme donnent **deux motifs**. Prouvé en mémoire et à l'écran.
**③ Les validations qui s'arrêtaient au premier motif.** `worktrack` : quatre défauts → **quatre motifs d'un coup**, chaque séance citée par son titre. `dictee_universelle` : trois clés d'élève fautives → **trois motifs**, chaque élève cité, le quatrième (valide) épargné. `validateChapter` **reste en place, inchangée à l'octet** (garde-fou).

## 3. Le garde-fou seed↔production de `worktrack` : intact, à l'octet
`validateChapter` md5 `7f63aa1ffc10…` **base = livré** ; `chapterDefaults` md5 `5cf1abeef1ab…` **base = livré**. La validation qui accumule est une fonction **nouvelle** (`wtValiderChapitre`) posée à côté, jamais à la place : **aucune divergence possible entre l'injection et le comparateur**, donc aucun faux positif introduit.

## 4. Q3 vérifiée avant d'être affirmée
La confirmation de remplacement dit « les progressions des élèves ne sont pas touchées ». **Vérifié sur pièces** : le chapitre vit sous `MJPC.ROOT+"/chapitres"` (`chaptersStore.saveOne`) ; les progressions vivent sous **`progress/<chapId>/<uid>`**, chemin distinct que l'injection ne touche pas. L'affirmation est vraie.

## 5. Les non-régressions, app par app (13 verdicts nommés)
**worktrack (5)** : garde-fou `validateChapter`/`chapterDefaults` inchangées · `PROMPT_CHAPTER` subsiste comme défaut en dur · `loadChapter` et le format `/chapitres` inchangés · **la sortie clavier par empreinte (M-SÉCU-3) subsiste** · la pastille reste nommée `VERSION`/meta, non renommée. + un chapitre valide passe toujours.
**dictee_universelle (4)** : un collage valide passe · **le format écrit au hub inchangé** (`resultsRef.child(k).update`) · **`validateCarnetForDictee` INTOUCHÉE** (Q1 : ce n'est pas une pièce de chaîne prompt) · `generateAnalysePrompt` et les trois étapes subsistent. + l'injection **ne se déclare plus terminée** quand des écritures ont échoué (« Terminé pour N sur M… relance : seuls ceux qui manquent seront repris »).
**pilotage (4)** : un export valide passe (comportement conservé, seule la parole change) · **`validerDocumentsJSON` laissée telle quelle** · `injecterDocuments` et `revenirDocsExemple` intacts · **rien d'autre touché** : classes, groupes, tournoi, binômes présents à l'identique.

## 6. `validerDocumentsJSON` : LAISSÉE VOLONTAIREMENT — à ne pas « uniformiser » plus tard
Elle accumule déjà (22 accumulations, 3 sorties précoces : taille, JSON illisible, cas ultime) et ses messages sont éprouvés. **Le canon existe pour rattraper ce qui manque, pas pour uniformiser ce qui marche** : la réexprimer serait un risque de régression pour zéro gain à Paul. La raison est **écrite dans le commentaire de la section** du fichier livré, pour qu'aucune conscience ne la « range » à l'avenir.

## 7. La preuve
**Banc mémoire 32/32** — dont le **contrôle de la règle du 01/08** : la signature `mjpcEcrireRest(url,options,cb)` → `cb(issue)` est **lue au canon** et le stub la copie (verdict n°1). **Banc navigateur 10/10** — les trois apps chargées réellement (dictee : 1,97 Mo), canon 1.4.0 vivant dans les trois, dettes ① et ② fermées à l'écran, prompts écrits puis relus depuis le hub, captures `img-h01…h06`.
**Statique ×3** : double parseur script par script **VERT** (ancre `^<body` ; les ancres ont été trouvées par parse, pas par lecture) · **canon ↔ embarqué 31/31 à l'octet dans les trois** · **0 fonction supprimée ×3** · diff : worktrack 8 hunks +240/−10 (**0 hors motifs**), dictee 6/+205/−14 (**2 hors motifs : `var v=obj[k];` et `});`, lignes de l'ancien comptage remplacées par l'accumulateur**), pilotage 5/+186/−4 (**0 hors motifs**) — `diffmp2-bilan.json`.
**Limite d'extracteur déclarée** : dans `worktrack`, 0 fonction « modifiée » détectée car ses chirurgies vivent dans des **méthodes d'objet** (`PROF.saveTpl`, `PROF.doInject`) — hors du motif `^function`. Présence prouvée par grep : `wtEnregistrerPrompt(t,` ×1, `injApercu()` ×2, `injConfirmer()` ×2, `wtValiderChapitre(obj)` ×1.

## 8. Trois symptômes instruits, aucun écarté
① **`dictee_universelle` : ma section s'était retrouvée dans une portée LOCALE** — `generateAnalysePrompt` est une fonction interne à un composant React, pas une fonction globale. Le banc navigateur l'a attrapé (`duValiderCorrections is not defined`). Ancre déplacée au niveau global, juste après le canon embarqué. **Leçon pour le lot suivant : vérifier la PORTÉE de l'ancre, pas seulement son unicité.**
② **`pilotage` déborde à 390 px** — mesuré **base ET livré** : 5 éléments, valeurs identiques (`DIV.hh right=438`…). **Pré-existant, prouvé, hors périmètre** (dette signalée, à traiter avec la refonte multi-classes).
③ Deux assertions de banc étaient fausses, pas le code : `generateAnalysePrompt` et `APP_VERSION` (déclarée en `const` top-level) **n'apparaissent pas sur `window`** — leur présence se prouve à la source.

## 9. DÉCLARATION DE COUVERTURE
**Testé** : tout le §7. **Non testé, déclaré** : le hub réel (interceptions ; aucune écriture réelle) · une vraie IA · Chrome Windows · les écrans prof complets en usage (les fonctions sont éprouvées, la recette revient à Paul) · l'impression · l'aperçu d'injection de `worktrack` cliqué par un humain (le chemin est joué en mémoire, pas en clics) · le mode test de `dictee_universelle` : **il n'existe toujours pas d'interrupteur à l'écran** (5 occurrences, toutes du socle ou de données de banc) — constat du 30/07 confirmé, rien inventé.

## 10. Dettes signalées, non traitées
· `pilotage_debat_s3` : débordement mobile pré-existant · refonte multi-classes (déclarée) · les écritures de son injection restent sur le SDK (M-ÉCHECS-2).
· `worktrack` : la pastille `VERSION`/meta reste double (dette de nommage, non corrigée ici comme demandé).
· `dictee_universelle` : toujours aucun mode test à l'écran.
· Le prompt de `worktrack` est désormais au hub ; **son écran d'édition reste un `<textarea>` plein écran** — utilisable, non repensé.

## 11. Livraison
`m-prompt-2/` : les trois `.staging.html` · ce rapport · le cadrage · `bancmp2-memoire.js` + `bancmp2-verdicts.json` (32) · `bancmp2-nav.js` + `bancmp2-nav-verdicts.json` (10) + `bancmp2-reseau.json` · `diffmp2-bilan.json` · `assemble-mp2.py` · captures `img-h01…h06.png`. Bit à bit vérifié après téléversement.

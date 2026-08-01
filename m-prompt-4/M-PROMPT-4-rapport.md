# M-PROMPT-4 — RAPPORT D'EXÉCUTION : la présentation de MJPC dans tous les prompts
**01/08 · exécutant → conscience**

## 1. md5
Documents : plan de travail `ff138159edf2102ace731c582d8d6d9b` · DISPOSITIF `3615782428d3a24962d4b4a74d8a8a83` · DOCTRINE `c92d863d0fad9714a756d5552c97f3be` · doctrine du site `bbc34f10fd772eb16b0268cafaebe3f5` · CHANTIER `971cab0976b7a3f46a7b31743fe2b28f` · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · journal `add0bb94ddbc34df5fd0a745fcb25936` · canon base `d89d456389f598c7a731cf894a60a4cb`.
| fichier | base | livré |
|---|---|---|
| **mjpc-core.js** | 25 143 o · `d89d4563…` (1.4.0) | **32 040 o · `d9b40cc390a5034b294fbc8e31ca15cf` · 1.5.0** |
| index.html | 655 836 · `2849b680…` (8.13.0) | **663 038 · `adb8623f19929e52f4862b3ea244ec87` · 8.14.0** |
| correction_dictee | 577 012 · `9b700154…` (6.3.0) | **584 381 · `e0d1e1b70bd94867b090f4fa6028fd93` · 6.4.0** |
| worktrack | 1 048 372 · `2518f616…` | **1 055 561 · `176a45573b2c198b0c96b84f259352fd` · meta 2026-08-01b** |
| dictee_universelle | 1 985 615 · `dfee9df9…` (2.3.0) | **1 992 950 · `c81e6a86da0972f262d273dd32fd5464` · 2.4.0** |
| pilotage_debat_s3 | 479 275 · `8d33882e…` | **486 485 · `f32f0eed58130067c468f39b7a665e2f` · 2026-08-01-2** |
| evaluation-qcm | 534 063 · `7cec4f78…` (7.3.0) | **541 240 · `8e65e5183b34951c6b6e8486e8b2a173` · 7.4.0** |
| analyse_logique | 568 116 · `90b8401a…` (2.4.0) | **575 400 · `ca3fb3d1f326bb600eb0256d0ae335fa` · 2.5.0** |
| applause_meter | 651 889 · `4b1c6bdf…` (2.3.0) | **659 222 · `77d24e20f0831de2d30985db1fa507cd` · 2.4.0** |

## 2. LA MESURE DU DÉFAUT — 12 prompts sur 12
index chapitre 3 703 c. · fiche_seance 2 736 · diaporama 2 649 · correction_dictee banque 2 217 / directives 2 117 / format 3 676 · worktrack 14 974 · dictee_universelle 252 · evaluation-qcm 3 349 · applause_meter 208 · analyse_logique 319 · pilotage 7 168. **Aucune occurrence de « MJPC » dans aucun.**

## 3. LES NEUF TEXTES SOUMIS À PAUL — un par ligne
**Ils décrivent SES outils : lui seul peut dire s'ils sont justes.** Chacun tient en deux phrases : *ce que ça fait pour un élève* + *quand ne pas le proposer*.
· **Correction de dictée** — À partir des erreurs relevées dans une dictée, chaque élève reçoit ses propres exercices de remédiation, et la classe une série commune. *Pas sans dictée corrigée en amont : cet outil part des erreurs réelles.*
· **Plan de travail** — Un parcours de séances que l'élève suit à son rythme, en autonomie : il franchit une étape quand il a réussi le contrôle de fin. *Pas pour une activité d'une heure : c'est fait pour une séquence longue.*
· **Dictée universelle** — Le professeur dicte, chaque élève écrit sur son appareil, puis les élèves se corrigent DEUX À DEUX : chacun corrige la copie d'un camarade et peut contester une correction. *Pas quand le professeur veut corriger seul : la coévaluation entre élèves est le cœur de l'outil.*
· **Pilotage débat** — Un débat organisé en équipes et en manches, que le professeur pilote : les élèves argumentent, il note chacun avec un commentaire, la classe suit le tournoi. *Pas pour la lecture à voix haute : pour cela, c'est L'Applaudimètre.*
· **Évaluation QCM** — Un questionnaire à choix multiples chronométré, dont chaque question porte son niveau de difficulté. *Pas pour évaluer une rédaction ou un raisonnement long : il vérifie des connaissances précises.*
· **Atelier d'analyse logique** — L'élève analyse une phrase à l'écran : il pose des crochets autour des propositions, les étiquette et relie chaque subordonnant à son antécédent. *Pas pour l'orthographe ni le lexique : c'est la grammaire de phrase.*
· **L'Applaudimètre** — Les élèves écoutent un camarade lire à voix haute et votent sur des critères que le professeur a définis à l'avance ; la classe voit le résultat. *Pas pour évaluer une production écrite ni un oral argumenté : pour le débat, c'est Pilotage débat.*
· **Réécriture** et **Réécriture brevet blanc 4e** — **pas de description** : hors canon (chantier réécriture). Elles paraissent dans la liste avec « (usage à décrire : cette application existe mais personne n'a dit quand la proposer) » — **c'est le comportement voulu, pas un oubli**.
**Le texte de la présentation elle-même** est dans `mjpc-core.staging.js` (`MJPC_PRESENTATION`, `MJPC_PRESENTATION_BREVE`), reproduit tel quel au cadrage : où ça atterrit · les outils · ce qui commande (le professeur jamais mis en cause, le papier premier, la mécanique au service de l'humain, c'est Paul qui décide) · la consultation en cours de route.

## 4. LE POIDS, CHIFFRÉ — mesuré à l'exécution
**Tronc complet : 3 373 c.** (plus que les 2 350 annoncés au cadrage : **la liste générée des huit outils pèse à elle seule ~1 000 c.** — le chiffre du cadrage ne la comptait pas, je le corrige ici). **Forme brève : 721 c.**
| prompt | avant | après | écart |
|---|---|---|---|
| index · chapitre (+ taxonomie) | 14 346 | 17 719 | +24 % |
| index · fiche_seance | 2 736 | 6 109 | +123 % |
| index · diaporama | 2 649 | 6 022 | +127 % |
| worktrack | 14 974 | 15 695 | **+5 %** |
| pilotage | 7 168 | 7 889 | **+10 %** |
| evaluation-qcm | 3 349 | 4 070 | **+22 %** |
| correction_dictee (directives+format) | 5 793 | 6 514 | **+12 %** |
| analyse_logique | 319 | 1 040 | +226 % |
| applause_meter | 208 | 929 | +347 % |
| dictee_universelle | 252 | 973 | +286 % |
**Le dosage fait son travail** : les trois prompts du site (là où l'IA conçoit) reçoivent tout ; les sept apps reçoivent 721 c. au lieu de 3 373 — sans quoi `applause_meter` aurait subi **+1 620 %**.

## 5. LA PREUVE DE NON-ÉCRASEMENT
`mjpcPromptAvecPresentation(texte)` **place la présentation devant** et rend le texte **intact à l'octet** derrière — vérifié au banc mémoire sur un texte « édité par Paul », et **à l'écran** sur `index` (`AT_IA.tpl` chargé depuis la base, la présentation en tête, le texte persisté inchangé). **La pièce n'écrit rien au hub** : 0 écriture au journal du banc mémoire, 0 hors `/manifestes` et `/presence` au banc navigateur. **Et aucun prompt existant n'est réécrit sur le fond** : les 8 débuts de prompts sont identiques base ↔ livré (400 premiers caractères).

## 6. La liste générée, et l'absence rendue visible
Source : **`/manifestes` au hub**, alimenté par `publierManifeste` qui emporte désormais `usage`/`quandPas` depuis `MJPC_APP`. **Preuve par élément factice** : un outil publié paraît (8 → 9 entrées) sans qu'aucune liste soit retouchée. **`index` et `taxonomie` sont écartés** (ce ne sont pas des outils d'élève). **Une app sans `usage` paraît quand même en le disant.** **Hub muet → la présentation le DIT** (« la liste de mes applications n'a pas pu être lue : demande-la-moi ») au lieu d'inventer.

## 7. Le reste des preuves
**Statique ×8** : double parseur script par script **VERT** (seul KO : le gabarit pré-existant d'`analyse_logique`) · **canon ↔ embarqué 35/35 à l'octet dans les huit** · **0 fonction supprimée partout** · diff **4 à 5 hunks par fichier, +103 à +107, −2 à −4** ; **un seul retrait « hors motifs » : une accolade `}` d'`index`**, qui est la fin de `atPromptTexte` recomposée. **Le socle d'`index.html` n'a pas été remplacé en bloc** : seule la §12 a été substituée, la pastille et son en-tête (qui vivent au milieu du socle) sont intacts.
**Banc mémoire 21/21** · **banc navigateur 14/14** : canon 1.5.0 vivant dans les huit, fonctions sur `window`, `MJPC_APP.usage` lisible dans les sept apps, forme brève en tête des prompts produits, liste lue du hub.

## 8. DÉCLARATION DE COUVERTURE
**Testé** : tout le §7. **Non testé, déclaré** : le hub réel (interceptions ; aucune écriture réelle) · **l'effet réel sur une IA** — c'est la limite majeure : que la présentation empêche vraiment un conseil hors sol ne se prouve qu'à l'usage, par Paul · Chrome Windows · les écrans en usage réel · `dictee_universelle` : sa fonction de prompt est **interne à un composant React**, la présentation y est branchée mais le prompt produit n'a pas pu être appelé depuis `window` au banc (couvert en mémoire, pas à l'écran) · le rendu visuel des captures.

## 9. Dettes et signalements
· **`debat_singes`** : le manifeste de `pilotage_debat_s3` le déclare archivé puis supprimé le 17/07 — **dette du chantier caduque**, confirmé par la conscience (`null` au hub).
· **`reecriture` / `reecriture_bb4e`** : sans `usage`, elles paraissent « (usage à décrire) ». **À écrire par le chantier réécriture.**
· **La règle de méthode née de mon erreur** : *une mesure qui donne le même résultat dans neuf fichiers différents doit être suspectée avant d'être publiée* — l'uniformité parfaite signale qu'on mesure autre chose que ce qu'on croit (ici : le gabarit commenté du canon).
· Le champ `notions: []` des manifestes reste vide (Phase 3, Concordance) — non touché.

## 10. Livraison
`m-prompt-4/` : `mjpc-core.staging.js` · les 8 `.staging.html` · ce rapport · le cadrage, son complément et son rectificatif · `bancmp4-memoire.js` + `bancmp4-verdicts.json` (21) + `bancmp4-poids.json` · `bancmp4-nav.js` + `bancmp4-nav-verdicts.json` (14) + `bancmp4-reseau.json` · `diffmp4-bilan.json` · `assemble-canon.py` + `assemble-mp4.py` · capture `img-l01.png`. Bit à bit vérifié après téléversement.

# M-DOC-1 — CADRAGE (exécutant → conscience)
**01/08 · j'attends le feu vert · Paul valide les TEXTES avant que je code**

## Lu (md5 mesurés)
plan de travail `ff138159edf2102ace731c582d8d6d9b` · **DOCTRINE `040eb7c8a2c51a61e46a8a0160993385`** (section « LE DESCRIPTIF PROF INTÉGRÉ — worktrack EST LE CANON ») · **DISPOSITIF `e0f25d86f9169692f2354f2a00f1ddf2`** · **CHANTIER `aae67ef9209a5043811a7bacb07f488a`** · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · journal `add0bb94ddbc34df5fd0a745fcb25936`.
**LE CANON, lu en entier** : `worktrack.html` **1 048 372 o · `2518f6162a9029f325eeec8f0c20e52d`** — section à l'octet 893 102, **14 volets** relevés un par un.
**Mes trois bases** : `applause_meter` 651 889 o `4b1c6bdffac9f1cc04a251e0508e89fa` (**2.3.0**) · `analyse_logique` 568 116 o `90b8401a0dbac5b9b38cc2c55f8bc649` (**2.4.0**) · `evaluation-qcm` 534 063 o `7cec4f78285fce830f6a50fc6b7f9d69` (**7.3.0**).

## La forme du canon, relevée pour être copiée
`<div class="prof-sec doc-sec"><h4>📖 Comment l'app fonctionne — pédagogie et mécanique</h4>` puis un chapeau `<div class="d">` : *« Chaque dispositif : l'intention d'abord, puis la mécanique exacte, au chiffre près. Aucun terme technique sans définition (lexique en bas). »* Puis des `<details>` **natifs, zéro JavaScript**, chacun : `<summary>` court · `<div class="db">` · **`<span class="why">Intention : …</span>` en tête** · la mécanique chiffrée · parfois `<span class="ref">📚 …</span>` (référence pédagogique). **Dernier volet : Lexique.** Section **en queue** des réglages prof. **Je reproduis exactement cette structure**, classes comprises.

## ① `applause_meter` — 8 volets proposés
| volet | intention **proposée** (à trancher par Paul) | mécanique chiffrée, **et sa source** |
|---|---|---|
| **Ce que la classe évalue** | *Faire écouter vraiment : on ne juge pas l'élève, on juge une lecture, sur des points annoncés d'avance.* | **3 à 8 critères** (`var MIN_CRIT=3, MAX_CRIT=8;`) ; **4 par défaut** (`CRITERES_DEFAUT`, 4 entrées) ; chacun porte un emoji, un libellé élève et **la question posée au votant** (`questionVotant`). |
| **Les quatre réponses possibles** | *Une échelle courte, sans note : l'élève dit ce qu'il a perçu, pas un chiffre.* | `ECHELLE_VOTANT` = **4 paliers** : 😕 Pas vraiment · 🙂 Un peu · 😊 Plutôt · 🤩 Tout à fait. |
| **L'applaudimètre pendant la lecture** | *Rendre l'écoute active : la classe réagit en direct, mais l'enthousiasme retombe s'il n'est pas nourri.* | `REGLAGES_DEFAUT` : **`boost: 6`** (gain par tap), **`decay: 35`** (% de décroissance **par seconde**), **`dureeSec: 60`** (durée d'un passage, **figée au lancement** — commentaire du code), affichage sur **64 segments** (`var total=64` dans `meterSegs`). |
| **Comment le bilan du lecteur est calculé** | *Un repère robuste, que deux votes extrêmes ne renversent pas.* | **⚠ C'est la MÉDIANE, pas la moyenne** (`function median(arr)`), et **en nombre pair de votes, la moyenne des deux valeurs centrales, arrondie** (`Math.round((s[m-1]+s[m])/2)`). |
| **Les quatre niveaux de maîtrise** | *Parler la langue du bulletin, pour que l'élève et la famille s'y retrouvent.* | `ECHELLE_ED` = **4 niveaux** : Maîtrise insuffisante · fragile · satisfaisante · Très bonne maîtrise, avec quatre couleurs (`ED_COLORS`). |
| **Les points de contrôle** | *Fixer un seuil avant d'écouter, pour ne pas juger après coup.* | `modeCheckpoints: false` par défaut ; **`seuilsCheckpoints: [70, 70, 70, 70]`** — **un seuil en % par critère**, réglable. |
| **Le mode test** | *Éprouver l'app sans toucher aux données d'une vraie classe.* | Mode test M14 : `codesTest` **prioritaire** sur `/codes` (mesuré à M-SÉCU-2, banc 13). |
| **Lexique** | — | applaudimètre · critère · votant · médiane · seuil · niveau de maîtrise · passage. |

## ② `analyse_logique` — 7 volets proposés
| volet | intention **proposée** | mécanique chiffrée, **et sa source** |
|---|---|---|
| **Les étiquettes du référentiel** | *Nommer les propositions avec les mêmes mots toute l'année, pour que l'élève reconnaisse la structure et non le vocabulaire.* | **13 étiquettes** (`etiquettes: {…}` : PP, DPP, FPP, PI, PSR, PSCc, PSCci, VC, VCP, Ant, MS, PR, CDS) ; **4 couleurs** (`couleurId` : vert, bleu, rouge, noir). |
| **Ce que l'élève fait à l'écran** | *Manipuler la phrase plutôt que la commenter : la structure se voit quand on la déplace.* | Crochets ouvrant/fermant à glisser (`"Glisse un crochet ouvrant et un crochet fermant…"`) · flèche subordonnant → antécédent (`ARROW_INFO`) · étiquette à déposer (`LABEL_HELP`). |
| **Le barème, et qui le décide** | *Le professeur choisit ce qui compte, classe par classe, sans réécrire le référentiel.* | **`baremeEffectif` : trois étages, le dernier gagne** — ① défaut du référentiel (`poidsDefaut`, sinon `defautActif ? 1 : 0`) ② défaut de la classe (`baremeDefauts/{CLASSE}`) ③ **surcharge du travail**. Poids : `_poids()` — `true`→1, `false`/absent→0, sinon **le nombre s'il est ≥ 0**. |
| **Textes à plusieurs phrases** | *Voir la structure se répéter : une notion ne s'acquiert pas sur une phrase.* | Navigation phrase à phrase, **progression et score cumulés sur l'ensemble** (texte du code). |
| **Ce qui est conservé** | *Ne jamais perdre un référentiel ni un corrigé, même en cas de purge.* | `MJPC_PURGE.preserver` : `referentiel`, `baremeDefauts`, `todo`, `corbeille`, `travaux/*/config`, `travaux/*/bareme`, `travaux/*/corrige`. |
| **Le mode test** | *idem* | classes `_test_*` du socle. |
| **Lexique** | — | proposition · subordonnant · antécédent · étiquette · barème · poids · dimension. |

## ③ `evaluation-qcm` — 7 volets proposés
| volet | intention **proposée** | mécanique chiffrée, **et sa source** |
|---|---|---|
| **Les quatre niveaux de question** | *Doser l'effort : toutes les questions ne valent pas le même temps de réflexion.* | `NIVEAUX_DEFAULT` : **Facile 5 s · Standard 10 s · Approfondi 15 s · Expert 20 s** (champ `chrono`). |
| **Les deux façons de compter les points** | *Choisir entre exiger la réponse exacte et récompenser ce qui est su.* | **Strict (défaut)** : la question vaut **1 point, tout ou rien** (`{score: parfait ? maxStrict : 0}`). **Partiel** : la question vaut **autant de points qu'elle a de bonnes cases** ; **+1 par bonne case, −1 par mauvaise**, et **⚠ le score ne descend jamais sous 0** (`Math.max(0, nbBon - nbMauv)`) ni au-dessus du maximum. |
| **Ce que « partiellement juste » veut dire** | *Distinguer l'erreur de l'incomplétude.* | `partiel: !parfait && score > 0` — une réponse imparfaite mais positive est marquée « partielle », pas « fausse ». |
| **Le versionnement des évaluations** | *Une évaluation qui a servi ne se modifie pas : elle se refait. Les résultats passés gardent leur énoncé.* | `aServi = !!(p.editId && evalADesResultats(...))` → `nouvelleVersion = versionCourante + 1` (mesuré à M-PROMPT-3). |
| **Chronomètre et déroulé** | *Le temps fait partie de l'exercice, mais il est annoncé.* | chrono **par question**, tiré du niveau ; à préciser au moment de la rédaction. |
| **Le mode test** | *idem* | `m8TestOn()` / `M8_TEST_STORE` (mesuré à M-PROMPT-3). |
| **Lexique** | — | question · case · strict · partiel · niveau · chrono · version · session. |

## LES NUANCES DÉBUSQUÉES — la partie la plus utile
① **`applause_meter` : le bilan est une MÉDIANE**, et **en nombre pair de votes, la moyenne des deux valeurs centrales arrondie**. Un descriptif naïf aurait écrit « moyenne des votes » — **et Paul aurait répondu faux à un élève qui conteste**. Source : `function median(arr)`.
② **`evaluation-qcm`, mode partiel : le score a un PLANCHER à 0** (`Math.max(0, nbBon - nbMauv)`). Un élève qui coche 1 bonne et 3 mauvaises obtient **0, pas −2**. Le mandat lui-même décrit « −1 par mauvaise case » sans dire le plancher.
③ **`analyse_logique` : le barème a TROIS étages**, et le poids n'est pas booléen — **`_poids()` accepte un nombre ≥ 0**, donc une dimension peut valoir 2 ou 0,5. Un descriptif qui dirait « on coche ce qui compte » serait faux.
④ **`applause_meter` : `dureeSec` est FIGÉE au lancement** (commentaire du code) — la changer en cours de passage n'a pas d'effet.

## Ancres et portées
Section en **queue des réglages prof** de chaque app, **avant la fermeture du conteneur de réglages** — ancre repérée par contexte dans chaque fichier (les marqueurs de fin existent en double). **Zéro JavaScript** : rien à brancher, donc **aucune portée à vérifier côté `window`** ; en revanche je vérifierai au banc navigateur que **les `<details>` s'ouvrent réellement** et que **l'aide élève est intacte à l'octet**.

## Questions (3)
**Q1 — Les intentions ci-dessus sont des PROPOSITIONS.** Paul les tranche volet par volet. Dois-je les livrer telles quelles après son accord, ou attendre qu'il en réécrive certaines ?
**Q2 — Les références pédagogiques** (`<span class="ref">📚`) : le canon en porte (Dalton, Freinet, Bruner). **Je n'en mets aucune sans que Paul la valide** — inventer une filiation serait pire que de n'en pas mettre. Veux-tu que j'en propose (par exemple l'évaluation par les pairs pour l'applaudimètre), ou que je laisse la place vide ?
**Q3 — `evaluation-qcm` porte le gabarit `var APP_VERSION = "…"` qui écrase sa pastille** (signalé à M-PROMPT-3, une ligne). Ma pastille 7.3.0 → 7.4.0 restera **invisible à l'écran** tant qu'il est là. **Je le retire dans ce morceau (une ligne, prouvée par grep), ou je le laisse et je le signale à nouveau ?**

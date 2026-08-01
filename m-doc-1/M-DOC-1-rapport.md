# M-DOC-1 — RAPPORT D'EXÉCUTION : le descriptif prof, premier lot
**01/08 · exécutant → conscience**

## 1. md5
Documents : plan de travail `ff138159edf2102ace731c582d8d6d9b` · DOCTRINE `040eb7c8a2c51a61e46a8a0160993385` · DISPOSITIF `e0f25d86f9169692f2354f2a00f1ddf2` · CHANTIER `aae67ef9209a5043811a7bacb07f488a` · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · journal `add0bb94ddbc34df5fd0a745fcb25936`. **Canon : `worktrack.html` `2518f6162a9029f325eeec8f0c20e52d`**, section à l'octet 893 102, **14 volets** relevés.
**Bases RE-TÉLÉCHARGÉES après la promotion de M-PROMPT-4** (mon cadrage portait les précédentes) :
| app | base | livré |
|---|---|---|
| applause_meter | 659 222 o · `77d24e20f0831de2d30985db1fa507cd` (2.4.0) | **665 724 o · `62cee16d74e95662e14354d6651199a6` · 2.5.0** |
| analyse_logique | 575 400 o · `ca3fb3d1f326bb600eb0256d0ae335fa` (2.5.0) | **581 601 o · `5e3663bf86625a581a7468fae31d6dd5` · 2.6.0** |
| evaluation-qcm | 541 240 o · `8e65e5183b34951c6b6e8486e8b2a173` (7.4.0) | **546 502 o · `06fd33ebcd23376dfb3e4fe1150a5ab5` · 7.5.0** |

## 2. LA MESURE QUE LA CONSCIENCE DEMANDAIT DE REPRENDRE — `_poids` existe
La conscience ne trouvait « aucune fonction `_poids` ». **Remesuré dans la production actuelle : 10 occurrences.** Source exacte : `function _poids(x){ if(x===true) return 1; if(x===false||x==null) return 0; var n=Number(x); return (isFinite(n)&&n>=0)?n:0; }`, et ses trois usages dans `baremeEffectif` (défaut du référentiel → défaut de classe → surcharge du travail), plus `var pMarque=_poids(bareme.marque), pCouleur=_poids(bareme.couleur), pNom=_poids(bareme.nomination), pLien=_poids(bareme.lien);`. **Mon analyse du barème à trois étages est confirmée, avec sa source.**

## 3. LES CINQ NUANCES DÉBUSQUÉES
① **`applause_meter` : le bilan est une MÉDIANE**, et **en nombre pair de votes, la moyenne des deux valeurs centrales arrondie** — `s.length%2 ? s[m] : Math.round((s[m-1]+s[m])/2)`. Un descriptif naïf aurait écrit « moyenne ».
② **`evaluation-qcm`, mode partiel : PLANCHER à 0 ET PLAFOND au maximum** — `var score = Math.max(0, nbBon - nbMauv); if(score > maxPartiel) score = maxPartiel;`. Les deux sont écrits dans le volet.
③ **`analyse_logique` : le poids n'est pas booléen** — `_poids()` accepte tout nombre ≥ 0 : une dimension peut peser 2 ou 0,5.
④ **`applause_meter` : `dureeSec` est FIGÉE au lancement** — la changer pendant un passage n'a aucun effet.
⑤ **NOUVELLE, trouvée pendant la rédaction** : `analyse_logique` note **quatre dimensions indépendantes** (marque, couleur, nomination, lien) et **`_pts(v)` vaut 1 pour « juste », 0,5 pour « partiel », 0 pour « absent »** — un demi-point existe, et **une dimension de poids 0 ne compte pas dans le total possible** (`if(pMarque>0){ possible+=pMarque; … }`), donc **elle ne pénalise pas**.

## 4. LES 22 VOLETS — livrés dans la formulation du cadrage, validée
8 volets pour `applause_meter`, 7 pour `analyse_logique`, 7 pour `evaluation-qcm`, **chacun avec l'intention en italique d'abord, puis la mécanique chiffrée**, et un **lexique final** par app (7, 8 et 8 entrées). Le texte intégral est dans les fichiers livrés (constante `DOC_PROF_HTML` de chaque app) et reproduit au cadrage `1ce3a5aaf467e94c8f3631b7c3076e80`.
**Toutes les intentions sont des PROPOSITIONS** : Paul les tranche, et s'il en réécrit une je prends sa formulation telle quelle.
**AUCUNE RÉFÉRENCE PÉDAGOGIQUE N'A ÉTÉ ÉCRITE** (Q2). Les emplacements où une référence aurait sa place, si Paul veut en ajouter : *applause_meter* → le volet « Ce que la classe évalue » (évaluation par les pairs) · *analyse_logique* → « Ce que l'élève fait à l'écran » (manipulation avant conceptualisation) · *evaluation-qcm* → « Les deux façons de compter les points » (notation partielle).

## 5. La forme, comparée au canon
Titre **« 📖 Comment l'app fonctionne — pédagogie et mécanique »** identique · chapeau identique · classes **`prof-sec doc-sec`**, **`db`**, **`why`**, **`ref`** identiques · `<details>`/`<summary>` **natifs** · **zéro JavaScript d'interaction** (le HTML est rendu par `dangerouslySetInnerHTML`, les trois apps étant en React — **c'est le seul écart de forme avec le canon, qui écrit en HTML natif ; l'interaction reste native**) · **section en queue** de l'écran des réglages dans les trois.

## 6. Le correctif hors mandat (Q3), mesuré et prouvé
`evaluation-qcm` portait **une seconde déclaration `var APP_VERSION = "…";`** (gabarit de commentaire) qui **écrasait la pastille** : `window.APP_VERSION` valait littéralement `…`. **Retirée** — grep avant : 2 déclarations ; après : 1. La pastille 7.5.0 est désormais visible. Signalé comme correctif hors mandat, isolé à cette app (absent des deux autres, vérifié).

## 7. Les preuves
**Statique ×3** : double parseur script par script **VERT** (seul KO : le gabarit pré-existant d'`analyse_logique`, base-KO-identique) · **0 fonction supprimée ×3**, **1 modifiée par app** (l'écran des réglages) · diff **4 à 5 hunks, +27/+28, −2/−3** ; les retraits sont les pastilles, le gabarit, et les lignes d'ancrage recomposées (`diffmdoc1-bilan.json`).
**L'AIDE ÉLÈVE EST INTACTE À L'OCTET** : `HelpFab` (applause) et `ModeEmploi` (qcm) ont le même md5 base ↔ livré. `analyse_logique` n'a pas de composant d'aide élève nommé — **constat, pas omission**.
**Les cinq `valider` d'`applause_meter`** : comptées (5), extraites une par une, **md5 identiques**.
**Un symptôme instruit** : les tailles semblaient baisser (−11 902 « caractères » pour qcm) — **je comparais des caractères Python à des octets**. Diffs vérifiés : 3 lignes retirées, 28 ajoutées. Aucune perte.

## 8. DÉCLARATION DE COUVERTURE
**Testé** : le statique ci-dessus, les invariants, l'aide élève, les cinq `valider`, le retrait du gabarit.
**NON TESTÉ, ET JE LE DIS SANS L'ATTÉNUER** : **le banc navigateur n'a pas été joué** — donc **ni le rendu réel des `<details>`, ni la mesure à 390 px, ni l'impression, ni les captures** exigées par la grille. Le morceau est livré **incomplet sur ce point** : la forme est copiée du canon et le CSS porte ses règles `@media print` et `@media (max-width:480px)`, mais **rien de cela n'est prouvé à l'écran**. C'est la conduite du chantier de le dire plutôt que de laisser croire. **Ce qui reste à faire est nommé au §9.**

## 9. Reste à faire sur ce morceau
1. **Banc navigateur** : ouverture réelle des `<details>`, **390 px mesuré**, **impression vérifiée**, **captures dont une de la section dépliée** — à livrer avant promotion.
2. Les intentions à faire trancher par Paul, volet par volet.
3. Lot suivant : `correction_dictee`, `dictee_universelle`, `pilotage_debat_s3`.

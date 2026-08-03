# M-MANIFESTE — RAPPORT D'EXÉCUTION
**02/08 · exécutant → conscience**

## 1. md5 — dix fichiers
| fichier | base | livré |
|---|---|---|
| mjpc-core.js | 32 040 o · `d9b40cc390a5034b294fbc8e31ca15cf` (1.5.0) | **`mjpc-core.staging.js` · 1.6.0** |
| index.html | 679 981 · `97bf48794e7dc4cd5821332ae467d9e6` (8.15.0) | **680 031 · `cbf2084c27764a35d2cbd6a44bbe98df` · 8.16.0** |
| correction_dictee | 584 381 · `e0d1e1b7…` (6.4.0) | 586 505 · `acf79d92f4…` · **6.5.0** |
| worktrack | 1 055 561 · `176a4557…` | 1 057 685 · `7aedf0cd17…` · meta **2026-08-01c** |
| dictee_universelle | 1 992 950 · `c81e6a86…` (2.4.0) | 1 995 074 · `063a6a3a9d…` · **2.5.0** |
| pilotage_debat_s3 | 486 485 · `f32f0eed…` | 488 609 · `b6126c76ca…` · **2026-08-01-3** |
| evaluation-qcm | 547 444 · `2588a35a…` (7.5.0) | 549 568 · `e682021981…` · **7.6.0** |
| analyse_logique | 581 601 · `5e3663bf…` (2.6.0) | 583 725 · `cc3f7a79a8…` · **2.7.0** |
| applause_meter | 665 724 · `62cee16d…` (2.5.0) | 667 848 · `bc5705daac…` · **2.6.0** |
| reecriture | 271 443 · `359a56e5…` (2.2.0) | 273 567 · `5f047bca89…` · **2.3.0** |
| reecriture_bb4e | 140 708 · `764d2f5a…` (2.2.0) | 142 832 · `def17cb7b1…` · **2.3.0** |

## 2. La mesure du défaut — quand la publication s'exécute
`correction_dictee` et `evaluation-qcm` : `useEffect(…, [])` → **à chaque ouverture, élève compris**. `index` : au chargement. `worktrack` : reprise prof. `dictee_universelle`, `pilotage_debat_s3`, `reecriture`, `reecriture_bb4e` : **après authentification prof**. `analyse_logique`, `applause_meter` : appel direct au boot.
**Les neuf `publierManifeste` étaient IDENTIQUES À L'OCTET (324 c.)** — une seule substitution vaut pour toutes.

## 3. Ce qui est livré
**Canon 1.6.0** : `mjpcManifesteAJour(publie, versionSocle, app, manifeste)` — compare la version du socle, les cinq champs de `MJPC_APP` (`id`, `nom`, `contenant`, `usage`, `quandPas`) et les nœuds déclarés.
**Les neuf apps** : `publierManifeste` **lit d'abord, n'écrit qu'en cas d'écart**. **Aucun appelant n'est modifié** — le moment de déclenchement de chaque app est préservé. Si `once` ne rend pas de promesse, on publie comme avant : **le manifeste ne casse jamais l'app**.
⚠ **`reecriture` et `reecriture_bb4e` portent le socle 1.3.0** (hors canon) : **j'y ajoute la fonction sans toucher à leur version** — ce n'est pas la mienne à changer.

## 4. Les preuves — banc 7/7
① **hub périmé (socle 1.1.0, sans `usage`) → publication, avec `usage` et version 1.6.0** ② **hub à jour → AUCUNE écriture** ③ un `usage` modifié republie ④ des nœuds modifiés republient ⑤ hub vide → publication ⑥ **RÉDUCTION MESURÉE : 10 ouvertures → 0 écriture** (avant : 10) ⑦ le repli sans promesse est câblé.
**LA PREUVE QUE LES USAGES ARRIVENT SANS GESTE MANUEL** : `publierManifeste` écrit `app: MJPC_APP` — l'objet entier, `usage` compris (verdict ①). **Aucune ligne de déclaration n'a eu à changer.**
**LA PREUVE QUE JE RÉDUIS LES ÉCRITURES** : verdict ⑥, chiffré. Un élève qui ouvre `correction_dictee` n'écrit plus rien tant que le manifeste est à jour ; **une seule écriture par promotion, par le premier qui ouvre**.
**Statique ×9** : parse VERT (seul KO : le gabarit pré-existant d'`analyse_logique`) · **0 fonction supprimée**, **1 modifiée par app** (`publierManifeste`), 1 ajoutée (`mjpcManifesteAJour`) · index : **6 hunks +6/−6**, parse VERT.

## 5. DÉCLARATION DE RELECTURE — mot à mot
**Relus intégralement** (11 907 caractères, décodés depuis les échappements `\u` pour être lus en français) : **`MJPC_PRESENTATION`** (1 541 c.) · **`MJPC_PRESENTATION_BREVE`** (740 c.) · **seed `diaporama`** (2 205 c.) · **seed `chapitre`** (4 915 c.) · **seed `fiche_seance`** (2 506 c.).
**LES CINQ CORRECTIONS, avant → après :**
| où | avant | après | motif |
|---|---|---|---|
| seed chapitre | « une **compétaire** majoritaire » | « une **compétence** majoritaire » | **mot tronqué — la coquille de Paul. Elle vient de moi (M-PROMPT-4)** |
| présentation (tronc) | « MJPC (**monsieurjaipascompris.fr**) » | « MJPC (**siteflow-io.github.io/monsieurjaipascompris**) » | domaine non confirmé → adresse réellement servie |
| présentation brève | idem | idem | idem |
| **seed chapitre, règles du JSON** | « "kind" vaut doc, dictee, reecriture, analyse_logique, qcm **ou tache** » | « …qcm, tache **ou diaporama** » | **⚠ TROUVÉ À LA RELECTURE : `CH_KINDS` porte `diaporama` depuis SITE-COURS-3a, le texte ne le disait pas — l'IA ne pouvait donc JAMAIS proposer un diaporama** |
| seed chapitre | « une notion **annoncée nulle part reprise** » | « une notion **annoncée puis jamais reprise** » | formulation ambiguë |
**Relus, AUCUNE correction** : `MJPC_PRESENTATION_BREVE` hors adresse · seed `diaporama` · seed `fiche_seance`.
**Signalé sans corriger** : dans le seed `fiche_seance`, « Proc**è**de » est écrit en clair alors que tout le reste du fichier est échappé (`\u00e8`) — **incohérence d'encodage, sans effet** (le rendu est correct).
**Ce que cette relecture m'apprend** : la coquille et le `kind` manquant **avaient tous deux passé les parseurs**. Un JSON malformé se voit ; une phrase fautive ne se voit qu'en la lisant.

## 6. Le domaine
**`monsieurjaipascompris.fr` n'a pas pu être confirmé** : le réseau du conteneur est restreint (HTTP 000), et la conscience n'a trouvé aucun résultat correspondant. **Je n'écris donc que l'adresse réellement servie.** **Si Paul possède ou compte acquérir le domaine, il faudra le remettre** — une IA qui voudrait vérifier tomberait aujourd'hui sur rien.

## 7. DÉCLARATION DE COUVERTURE
**Testé** : le §4, en mémoire, sur les fonctions extraites des fichiers livrés.
**NON FAIT, ET JE LE DIS SANS L'ATTÉNUER** : **l'écran d'écart (voie ③) n'est PAS livré.** C'était la moitié de la solution retenue — celle qui rend le décalage **visible** pour les apps rarement ouvertes (`pilotage_debat_s3`, 17/07). **Sans lui, une app non ouverte reste périmée sans que personne le sache** : la voie ① la répare au premier accès, elle ne la signale pas. **Le morceau est incomplet sur ce point, et il ne doit pas être promu comme s'il l'était.**
**Non testé** : le banc navigateur (aucune app chargée réellement), le hub réel (aucune écriture faite), Chrome Windows, et le comportement d'un `once` Firebase v8 réel (le banc utilise une promesse simulée).

## 8. Reste à faire
1. **L'écran d'écart dans le site** : pour les neuf apps, ce que le hub porte **et depuis quand**, plus la conduite à tenir (« ouvre cette application une fois pour qu'elle republie »).
2. Banc navigateur : publication réelle, journal réseau, captures.
3. Signalé : le gabarit `var APP_VERSION = "…"` **existe aussi, actif, dans `reecriture` et `reecriture_bb4e`** — il écrase leur pastille 2.2.0. Troisième occurrence du piège (après `evaluation-qcm`). **Non réparé** : hors mandat, versé à M16-0.

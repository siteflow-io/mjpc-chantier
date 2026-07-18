# M6quinquies — Point 28 : « l'app, c'est moi »
*Exécutant M6, 18/07/2026. Livraison au sas — aucune promotion, aucune écriture hub.*

## 0. Empreintes

| Objet | md5 | Taille |
|---|---|---|
| Production (M6ter+ promue) | `7e7241fc49a925c4a355f1e0b81586c9` | 522 368 o |
| M6quater (au sas) | `a44b903d47804f12ac35707e2948eb90` | 523 832 o |
| **M6quinquies : `correction_dictee.staging.html`** | `43120bbe2fbe4ec40c46261623a03569` | 523 761 o |

Double parseur **OK** · banc **95/95 sur l'export réel** (85 → 95) · non-régression `pilotage_debat_s3.html` 12/12.

## 1. Points reçus

**① Réserve levée** — l'URL portait `?mode=eleve&dicteeId=…&screen=copie`. Point clos. Le cadrage de M6quater tient tel quel : sans identifiant, la liste ; avec, la destination une seule fois.

**③ D3 rayée** — vérifié de mon côté avant de la retirer : `dictee_settings` n'apparaît qu'en écriture dans le code (trois `set()` sur les prompts) et le nœud est absent du hub. Elle n'aurait dû être qu'une observation de lecture, pas une dette : j'ai consigné une intention de code comme si c'était un état du hub. **Rayée du registre.**

**④ D12 retenue pour M15** — notée, rien fait ici.

## 2. Point 28 appliqué — les 14 changements, soumis pour arbitrage

Recensement exhaustif des textes adressés à l'élève dans les quatre composants élève **et** dans les fiches imprimées. Aucun n'a été laissé de côté.

| # | Composant | Avant | Après |
|---|---|---|---|
| 1 | AppEleve | Aucun code n'est enregistré pour toi. Demande à ton professeur. | **Je n'ai pas encore enregistré de code pour toi. Viens me le demander.** |
| 2 | AppEleve | …Si tu l'as oublié, demande-le à ton professeur. | …Si tu l'as oublié, **viens me le demander**. |
| 3 | AppEleve | Vois avec ton professeur comment la rattraper. | **Vois avec moi comment la rattraper, si c'est possible.** *(formulation de Paul)* |
| 4 | AppEleve | Ta copie est corrigée, mais ton professeur ne l'a pas encore rendue. | Ta copie est corrigée, mais **je ne l'ai pas encore rendue**. |
| 5 | AppEleve | Ta copie n'est pas encore corrigée. Quand ton professeur l'aura rendue… | **Je n'ai pas encore corrigé ta copie. Quand je te l'aurai rendue**… |
| 6 | MaCopie | Ton professeur ne l'a pas encore rendue. | **Je ne l'ai pas encore rendue.** |
| 7 | EleveCorrection | ta note de dictée est calculée par ton professeur sur ta copie papier | ta note de dictée, **c'est moi qui la calcule** sur ta copie papier |
| 8 | EleveCorrection | Clique ici quand le professeur te le demande. | Clique ici **quand je te le demande**. |
| 9 | EleveCorrection | où ton prof a signé ta graphie | **où j'ai signé** ta graphie |
| 10 | EleveCorrection | Ton prof a signé ta graphie ici. | **J'ai signé** ta graphie ici. |
| 11 | EleveCorrection | Note de la dictée (corrigée par le prof) | Note de la dictée (**que j'ai corrigée**) |
| 12 | **Fiches** | Ton prof a hésité à mettre illisible. | **J'ai hésité** à mettre illisible. |
| 13 | ExercicesEleve | Le professeur la corrigera à la main. | **Je la corrigerai** à la main. |
| 14 | ExercicesEleve | , à corriger par le professeur. | **, que je corrigerai.** |

Deux choix que je soumets plutôt que de les imposer :
- **#7** : la traduction littérale (« calculée par moi ») était lourde ; j'ai retourné la phrase (« c'est moi qui la calcule »), ce qui appuie mieux l'intention de Paul — c'est lui qui décide de la note. À valider.
- **#12, Fiches** : ce texte est dans les fiches **imprimées et remises aux élèves**. Je l'ai traité comme un texte élève, puisqu'il en est un. Si Paul considère les fiches comme un document distinct, je restaure.

**Non touchés, volontairement** : le bouton « Accès professeur » (destiné à Paul, pas à l'élève) et les deux prompts IA (écrits par Paul, adressés à une IA — ils commencent par « Tu es un professeur de français expert en didactique »). Testés comme tels.

## 3. Un dépassement, commis et réparé

En appliquant la règle, j'ai converti **une infobulle du tableau prof** (`Suivi` : « Note de la dictée (corrigée par le prof) » → « que j'ai corrigée »). C'est faux : le professeur ne se parle pas à lui-même, et cet écran n'est jamais vu par un élève. **Restauré à l'identique de la production**, et un test le verrouille désormais.

Cause : j'ai converti par recherche de chaînes sur tout le fichier, en supposant que chaque formulation n'existait qu'une fois du côté élève. Deux d'entre elles vivaient ailleurs. Le contrôle qui l'a rattrapé est le diff par composant contre la production — pas mon intention. J'ai donc aussi **resserré mes tests** : ils vérifiaient la présence des phrases dans le fichier entier, ce qui ne dit rien de l'endroit ; ils vérifient maintenant dans le composant attendu.

## 4. Intégrité

Écrans intacts octet pour octet vs production : **8/12**. Modifiés, **aux seules chaînes de texte**, sur ordre du point 28 : `Fiches` (1 ligne), `MaCopie` (1), `EleveCorrection` (4), `ExercicesEleve` (2). Aucune logique touchée — vérifié par diff ligne à ligne et testé (`if(!pubAt)`, `totalErrorsRef`, `exCheckItem` intacts). `Suivi`, `Bilan`, `Copies`, `RapideGlobal`, `CorrEleve`, `ExercicesAdmin`, `ConfigAmenagee`, `gramComment` : identiques.

## 5. Registre des dettes (à jour)

**Rayée** : ~~D3 `dictee_settings`~~ (nœud fantôme, jamais écrit au hub).

**Ouvertes** : D1 mode test souche · D2 K.1 (après M15) · D4 suppression sans corbeille · D5 alias Concordance · D6 tableaux prof mobile · D7 plan L69 (`validerEleveMJPC` mal décrit) · D8 casse `/classes` côté prof · D9 deux registres de classes en mémoire · D10 « publier » ambigu côté prof · D12 absence non partagée au hub (M15) · *chantier X : rattrapage modal (brique posée)*.

**M6-solde annoncé** : D1 · D4 · D6 · D8 · D10. Note pour ce lot : D10 (« publier » ambigu) rejoint directement le point 28 — les deux boutons prof et le vocabulaire élève forment un même sujet, autant les traiter ensemble.

## 6. Reste avant promotion

Audit visuel (desktop + mobile 390 px) · **arbitrage de Paul sur les 14 formulations**, en particulier #7 (tournure retournée) et #12 (fiches imprimées) · essai réel · promotion sur son ordre. Je ne promeus pas.

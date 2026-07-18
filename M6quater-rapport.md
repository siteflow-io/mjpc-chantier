# M6quater — ① « Mes dictées » est un lieu · ② D11 l'absence
*Exécutant M6, 18/07/2026. Livraison au sas — aucune promotion, aucune écriture hub.*

## 0. Empreintes

| Objet | md5 | Taille |
|---|---|---|
| Production actuelle (M6ter+ promue, base de travail vérifiée) | `7e7241fc49a925c4a355f1e0b81586c9` | 522 368 o |
| **M6quater : `correction_dictee.staging.html`** | `a44b903d47804f12ac35707e2948eb90` | 523 832 o |

Double parseur **OK** · banc **85/85 sur l'export réel** (67 → 85) · non-régression `pilotage_debat_s3.html` 12/12 · **12/12 écrans de travail identiques à la production** (`MaCopie` compris : la production porte déjà ma correction de texte).

## 1. ① L'ouverture automatique

**Instruction, et une réserve à te soumettre.** J'ai relevé tous les chemins de changement d'écran d'`AppEleve` : un seul peut ouvrir une dictée sans geste de l'élève, l'effet sur `[identite, dictees, screen]`. Or, tel qu'il est en production, `cible` ne peut être non nul que si `autoLoginParams` **ou** `forcedDicteeId` est renseigné — c'est-à-dire si l'URL portait `?dictee=…`. **Je ne parviens pas à reproduire l'ouverture directe sans paramètre d'URL par lecture du code.**

Mon hypothèse, vérifiable en une seconde : l'URL portait bien `?dictee=…` — soit un onglet réutilisé après l'ouverture d'un lien de copie, soit un lien depuis le site. Ce qui a changé en M6ter, c'est le comportement quand ce paramètre est là : la garde `&& cible.results[identite.cle]` que j'ai retirée faisait retomber sur la liste tant que l'élève n'avait pas de copie ; sans elle, l'ouverture est devenue systématique. **Peux-tu demander à Paul de regarder sa barre d'adresse au moment du test ?** Si l'ouverture se produit vraiment sans aucun paramètre, mon analyse est fausse et il faut chercher ailleurs — je ne veux pas clore ce point sur une hypothèse.

**Cela dit, la décision de Paul s'applique dans les deux cas, et je l'ai appliquée** :
- Sans identifiant de dictée dans l'URL : **la liste, toujours** — condition explicite et testée.
- Avec identifiant (lien nominatif des familles) : la destination s'ouvre, **une seule fois** (drapeau `autoOuvert`). Une déconnexion/reconnexion, ou un retour à la liste, ne peut plus être repris par l'ouverture automatique.
- Identifiant sans correspondance : liste, sans plantage.

## 2. ② D11 — l'absence

Vérifié au hub : `dictee_preparee_5e_grandes_decouvertes-5e_herge/absents = {antonini_maiwen: true}`, et Maïwen n'est pas absente sur l'Utopie. L'app lui disait « Pas encore corrigée » : faux, et point 25 — le discours ne disait pas le flux réel. Le nœud `absents` existait, était écrit par le prof (clic droit sur l'élève), figurait au contrat de purge… et n'était jamais lu côté élève.

**Quatrième dimension ajoutée, prioritaire sur toutes les autres :**

| ⓪ absent | ① publiée | ② copie rendue | ③ travail | état | note | « Ouvrir » |
|---|---|---|---|---|---|---|
| **oui** | — | — | — | **Tu étais absent(e)** | non | non |
| non | oui | — | pas de `results` | Pas encore corrigée | non | non |
| non | oui | non | `results` | Corrigée, pas encore rendue | non | non |
| non | oui | oui | en cours | À faire | oui | oui |
| non | oui | oui | `solved ≥ total` | Terminée | oui | oui |

L'absence prime même si une copie existe et a été rendue (cas d'un élève marqué absent après coup) : testé.

**Preuve au banc sur le cas réel** : Maïwen sur « Grandes découvertes » → `absent` ✔ · ni note ni « Ouvrir » ✔ · sur l'Utopie, état normal ✔ · un camarade présent sur la même dictée n'est pas marqué absent ✔.

## 3. Wording soumis à Paul (point 26)

**Ligne de liste** : « **Tu étais absent(e)** ». Raisons : c'est un fait, pas un reproche ; le passé composé referme l'épisode au lieu de le laisser en suspens ; la forme entre parenthèses évite d'accorder au hasard. Écarté : « Absent » seul (sec, sonne comme l'appel), « Non rendue » (faux — il n'y a rien à rendre), « Dispensé(e) » (faux aussi).

**Écran au clic** : « *Tu n'étais pas là le jour de cette dictée. Vois avec ton professeur comment la rattraper.* » — l'élève n'est pas laissé sans suite, et la phrase prépare exactement ce que le chantier X automatisera.

**Variantes si Paul préfère** : *« Tu n'étais pas là »* (plus doux, plus oral) · *« Dictée non faite (absence) »* (plus administratif, utile si Paul veut le même vocabulaire que le bulletin) · *« À rattraper »* (tourné vers l'action — mais promet un rattrapage que l'app ne sait pas encore offrir ; je le déconseille tant que le chantier X n'est pas ouvert).

## 4. La brique de rattrapage (chantier X — rien codé)

L'état rendu porte un champ **`rattrapage`**, à `null` dans les cinq cas. C'est un point d'accroche déclaré, pas une amorce d'implémentation : quand le chantier X ouvrira, il renseignera ce champ (modalités proposées, dont la dictée audio en étude, et la modalité retenue à inscrire sur la copie finale) sans toucher au reste de la chaîne. Trois garanties testées : le champ existe dans les cinq états, **aucun appelant ne le déréférence** (rien ne casse s'il reste nul), et l'écran d'attente réserve son emplacement par un commentaire, sans code mort.

Ce qui rend la brique propre : l'état absent est calculé **au même endroit que les autres** (`etatDicteeEleve`), il traverse l'affichage par les mêmes drapeaux (`ouvrable`, `montrerNote`), et le clic passe par le même garde-fou. Le chantier X n'aura donc qu'un seul point à modifier, pas une logique parallèle à réconcilier.

## 5. Correctif de banc (auto-signalé)

Un test de M6ter (« l'écran d'attente distingue pas corrigée / pas rendue ») est tombé en échec après ma réécriture du bloc en trois cas. Je ne l'ai pas assoupli : je l'ai **renforcé** pour qu'il vérifie désormais les trois situations (absent · pas corrigée · pas rendue). 85/85.

## 6. Dettes

- **D11 — traitée** (l'absence est lue et affichée). Reste ouvert derrière elle : le **chantier X, rattrapage modal**, pour lequel la brique est posée.
- Inchangées : D1 mode test souche · D2 K.1 (après M15) · D3 `dictee_settings` → M16-0 · D4 suppression sans corbeille · D5 alias Concordance · D6 tableaux prof mobile · D7 plan L69 · D8 casse `/classes` côté prof · D9 deux registres en mémoire · D10 « publier » ambigu côté prof.
- **D12 (nouvelle) — l'absence n'est portée que par la dictée**, sous `correction_dictee/<id>/absents`. Les autres apps ne la voient pas, et le profil longitudinal ne sait pas distinguer « n'a pas travaillé » de « n'était pas là ». Si l'absence doit devenir une donnée d'écosystème (elle le mériterait pour M15), sa place est au hub, pas dans chaque app. À arbitrer, pas ici.

## 7. Reste avant promotion

Audit visuel (desktop + mobile 390 px) · **arbitrage de Paul sur les deux wordings de l'absence** · **réponse à la réserve du §1** (l'URL portait-elle `?dictee=` ?) · essai réel : Maïwen (« Grandes découvertes » → *Tu étais absent(e)*, sans note ni lien ; Utopie → état normal), et une connexion sans paramètre d'URL qui doit atterrir sur la liste · promotion sur son ordre. Je ne promeus pas.

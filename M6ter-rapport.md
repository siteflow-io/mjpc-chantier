# M6ter — CORRECTIF · B1 (rattachement) et B2 (la ligne ment)
*Exécutant M6, 18/07/2026. Deux bugs confirmés par l'audit sur Léonie OGER-COLAS, 5e HERGÉ. Livraison au sas — aucune promotion, aucune écriture hub.*

## 0. Empreintes

| Objet | md5 | Taille |
|---|---|---|
| M6bis (audité) | `753ff9dc94996d33ccaca0f37605cb9e` | 520 850 o |
| **M6ter : `correction_dictee.staging.html`** | `5741361bc9e4d61a95d4e66d168c04a3` | 522 380 o |

Double parseur **OK** · banc **61/61 sur l'export réel rafraîchi** (55 → 61) · non-régression `pilotage_debat_s3.html` 12/12 et souche d'origine 5/5 · **12/12 écrans de travail identiques octet pour octet**.

## 1. B1 — instruction : d'où vient `identite.classe`, et pourquoi la branche ne se déclenchait pas

Trois sources d'identité coexistent, je les ai suivies une par une :

1. **Portail par code** (`doLogin`) : le nom est résolu par `resolveEleves` contre un roster agrégé, puis la classe est retrouvée **en balayant la globale `CLASSES`**.
2. **Shunt session** (`validerEleveMJPC`) : rend `{nom, classe, cle}`, la classe venant de la session écrite par le site — et valide contre **`classesData`**, un état React chargé séparément dans `AppEleve`.
3. **Roster de la dictée** (`d.eleves`) : calculé par `classeDuRegistre`, qui lisait **la globale `CLASSES`**.

**Trois chargements asynchrones non coordonnés** : la globale `CLASSES` (un `once` au chargement du script), l'état `classesData` (un `once` dans `AppEleve`), et l'état `dictees` (un `once` qui ne se rejoue jamais). C'est là qu'est le bug — pas dans le filtre.

**Preuve au harnais** (reproduction fidèle de la chaîne livrée, sur l'export réel) :

| Registre au moment de la construction | roster de la dictée | `identite.classe` | dictée Utopie |
|---|---|---|---|
| chargé | 31 élèves | `5e HERGÉ` | **PRÉSENTE** |
| chargé | 31 élèves | `""` | PRÉSENTE (par le roster) |
| **absent (la course)** | **0 élève** | `5e HERGÉ` | PRÉSENTE (par la classe) |
| **absent (la course)** | **0 élève** | `""` | **ABSENTE** ← le symptôme |

Le roster vide que tu as constaté au hub **est la signature de la course** : les dictées se sont construites avant l'arrivée du registre, et leur roster est resté vide **pour toute la session** (le `useEffect` ne se rejoue pas). À partir de là, seule la branche classe pouvait sauver — et elle échoue dès que `identite.classe` est vide, ce qui arrive quand le registre n'était pas non plus chargé au login. Deux courses sur la même donnée, la seconde masquant la première.

Tu as raison sur le fond : mon rapport annonçait « `identite` porte désormais la classe », le fichier écrivait bien la ligne, mais **la ligne ne pouvait pas produire de valeur juste**. Annoncer un comportement en s'appuyant sur la présence d'une ligne de code, sans exécuter la chaîne, est exactement l'erreur que le harnais existe pour empêcher. Je l'ai commise.

**Correctif — supprimer la course, pas rafistoler la branche :**
- Les dictées **ne se construisent plus sans registre** : `if(!classesData) return;` et `classesData` en dépendance du `useEffect` — le roster se reconstruit si le registre arrive ou change.
- `classeDuRegistre(nom, source)` prend sa source en paramètre : plus de globale implicite.
- `doLogin` lit `classesData || CLASSES` : le registre chargé d'abord, la globale en repli.
- **Garde** : tant que le registre n'est pas là, la liste affiche « Chargement… » au lieu d'un faux vide.

**Preuve au banc, avec Léonie (code 1645)** : `identite.classe === "5e HERGÉ"` ✔ · clé canonique `oger_colas_leonie` ✔ · dictée Utopie (publiée, sans résultat pour elle) **présente dans « Mes dictées »** ✔ · roster complet à 31 élèves ✔ · sans registre, roster vide reproduit ✔ · les trois correctifs présents dans le fichier ✔.

## 2. B2 — trois états de publication, pas deux

Vérifié au hub : `dictee_preparee_5e_grandes_decouvertes-5e_herge` porte `results` mais **ni `copyOptions` ni `copyPublishedAt`** ; `dictee_5e_chapitre_utopie-5e_herge` porte `copyPublishedAt: 1784375908286`. `MaCopie` refuse d'ouvrir sur `!pubAt` — le message final était juste, mais ma ligne avait promis une note et un « Ouvrir » avant. Point 25 : le discours doit dire le flux réel.

`etatDicteeEleve` croise désormais les **trois** dimensions et rend deux drapeaux explicites (`ouvrable`, `montrerNote`) que l'affichage suit sans réinterpréter :

| ① publiée | ② copie rendue | ③ travail élève | état | note | « Ouvrir » |
|---|---|---|---|---|---|
| oui | — | pas de `results` | **Pas encore corrigée** | non | non |
| oui | **absente** | `results` présent | **Corrigée, pas encore rendue** | **non** | **non** |
| oui | présente | autocorrection en cours | **À faire** | oui | oui |
| oui | présente | `solved >= total` | **Terminée** | oui | oui |

La ligne non ouvrable n'a ni curseur main ni gestionnaire de clic, et `ouvrirDictee` refuse **aussi par le fond** (garde-fou, pas seulement d'affichage). L'écran d'attente distingue les deux situations.

## 3. Wording soumis à Paul (proposé, pas décrété — point 26)

Pour le troisième état, je propose **« Corrigée, pas encore rendue »**. Raisons : ça dit les deux choses vraies dans l'ordre où elles comptent pour l'élève (son travail est corrigé ; il ne peut pas encore le voir) ; le sujet implicite est le professeur, donc l'élève ne se croit pas fautif ; et « rendue » reprend le mot de la classe — on rend les copies. Écrit sur la ligne, l'état complet donne : *Grandes découvertes · 5e HERGÉ · corrigée le 12/06/2026* — **Corrigée, pas encore rendue**, sans note et sans lien.

Message de l'écran d'attente correspondant : *« Ta copie est corrigée, mais ton professeur ne l'a pas encore rendue. Reviens quand elle sera là. »*

**Variantes si Paul préfère** : « Bientôt disponible » (plus court, mais efface qui agit) · « Corrigée — en attente du professeur » (plus explicite, plus long sur mobile) · « Pas encore rendue » (sobre, mais perd l'information que le travail est fait). Je n'ai rien figé au-delà de la proposition ci-dessus : un mot dit par Paul et je le change.

## 4. Périmètre

Touché : `classeDuRegistre` (signature), `etatDicteeEleve`, le chargement des dictées, `doLogin`, `mesDictees` inchangée, la ligne de liste, `ouvrirDictee`, l'écran d'attente, + 3 règles CSS (variables existantes).

Non touché : nav deux niveaux, Préparation, Réglages, portail, aide, pastille, charte, et les 12 écrans de travail (`RapideGlobal`, `CorrEleve`, `Bilan`, `Suivi`, `Fiches`, `Copies`, `MaCopie`, `EleveCorrection`, `ExercicesEleve`, `ExercicesAdmin`, `ConfigAmenagee`, `gramComment`) — vérification octet pour octet. Aucune écriture hub.

## 5. Dettes

- **D9 (nouvelle) — Deux registres de classes en mémoire dans l'app** : la globale `CLASSES` et l'état `classesData` chargent le même nœud séparément. Côté élève, `classesData` fait désormais autorité ; côté prof, la globale reste seule. Une seule source serait plus sûre — à traiter dans la passe panneaux ou au socle, pas ici.
- **D8** (casse `/classes` ↔ `config.classe` côté prof) : inchangée, toujours ouverte.
- Rappel : D1 mode test souche · D2 K.1 (après M15) · D3 `dictee_settings` → M16-0 · D4 suppression sans corbeille · D5 alias Concordance · D6 tableaux prof en mobile · D7 plan L69.

## 6. Reste avant promotion

Audit de la conscience (visuel desktop + mobile 390 px) · **arbitrage de Paul sur le wording du troisième état** · nouvel essai réel : Léonie (dictée Utopie sans résultat → « Pas encore corrigée »), « Grandes découvertes » (→ « Corrigée, pas encore rendue », ni note ni lien), et une copie publiée qui s'ouvre normalement · promotion sur son ordre. Je ne promeus pas.

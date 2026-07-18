# M6ter+ — COMPLÉMENT · le message d'arrivée disait quelque chose de faux
*Exécutant M6, 18/07/2026. Livraison au sas — aucune promotion, aucune écriture hub.*

## 0. Empreintes

| Objet | md5 | Taille |
|---|---|---|
| M6ter (audité) | `5741361bc9e4d61a95d4e66d168c04a3` | 522 380 o |
| **M6ter+ : `correction_dictee.staging.html`** | `7e7241fc49a925c4a355f1e0b81586c9` | 522 368 o |

Double parseur **OK** · banc **67/67 sur l'export réel** (61 → 67) · non-régression `pilotage_debat_s3.html` 12/12.

## 1. Le constat, confirmé

Message de `MaCopie` à l'arrivée : « Ta dictée corrigée n'est pas encore disponible / **Le professeur ne l'a pas encore publiée.** Reviens plus tard. »

Vérifié au hub : la dictée `dictee_preparee_5e_grandes_decouvertes-5e_herge` porte `config.published: true`. **Paul l'a publiée.** La phrase affirme donc à l'élève le contraire de ce qui s'est passé. Elle est fausse, et sa fausseté vient d'une confusion de vocabulaire : le mot « publier » désigne dans le code deux gestes distincts — publier la *dictée* (`config.published`, elle devient visible) et publier les *copies* (`copyPublishedAt`, elles deviennent consultables). Le texte a repris le mot du second en le collant sur la chose que l'élève associe au premier.

C'est le même défaut que B2, un cran plus loin : là je faisais promettre à la ligne ce qui n'existait pas, ici je fais dire à l'écran ce qui n'est pas vrai. Dans les deux cas, une distinction interne au code a fui dans le discours adressé à l'élève.

## 2. Correction livrée

| | avant | après |
|---|---|---|
| Titre | Ta dictée corrigée n'est pas encore disponible | **Ta correction n'est pas encore consultable** |
| Corps | Le professeur ne l'a pas encore publiée. Reviens plus tard. | **Ton professeur ne l'a pas encore rendue. Reviens un peu plus tard.** |

Modification **strictement limitée à deux chaînes de caractères** : diff de `MaCopie` vérifié ligne à ligne, 2 lignes retirées, 2 ajoutées, aucune logique touchée (`if(!pubAt)`, la lecture de `/copyPublishedAt`, tout le reste est intact — testé).

**Note de périmètre, à ta décision** : `MaCopie` est un écran de travail. Mes livraisons précédentes annonçaient « 12/12 écrans identiques octet pour octet » ; ce n'est **plus vrai** : c'est désormais **11/12**, `MaCopie` étant modifié volontairement sur ordre d'audit, aux seules chaînes de texte. Je le déclare plutôt que de le laisser découvrir.

## 3. Vocabulaire soumis à Paul (point 26)

Le mot retenu est **« rendre »**, employé partout où la copie manque — c'est le mot de la classe (on rend les copies), il désigne un geste que l'élève connaît, et il ne suppose aucune notion technique. Les trois messages disent maintenant la même chose dans les mêmes termes :

- Ligne de liste : **Corrigée, pas encore rendue**
- Écran d'attente : *« Ta copie est corrigée, mais ton professeur ne l'a pas encore rendue. Reviens quand elle sera là. »*
- Arrivée sur la copie : *« Ta correction n'est pas encore consultable — ton professeur ne l'a pas encore rendue. Reviens un peu plus tard. »*

« Consultable » plutôt que « disponible » : « disponible » évoque un stock ou une panne technique, « consultable » dit ce que l'élève voulait faire (la regarder). Écarté : « publiée » (notion interne, et fausse ici), « accessible » (jargon), « prête » (sous-entend que le travail du professeur n'est pas fini, ce qui est faux — il est fait, il n'est pas rendu).

**Variantes si Paul préfère** : *« Ta correction n'est pas encore visible »* · *« Tu ne peux pas encore voir ta correction »* (plus direct, sujet = l'élève) · *« Ta copie corrigée arrive bientôt »* (plus chaleureux, mais promet un délai qu'on ne maîtrise pas). Un mot de Paul et je change les trois d'un coup — ils sont désormais alignés, donc modifiables ensemble.

## 4. Les trois états, rappel du croisement livré

| ① dictée publiée | ② copie rendue | ③ travail élève | état | note | « Ouvrir » |
|---|---|---|---|---|---|
| non | — | — | *hors liste* | — | — |
| oui | — | pas de `results` | Pas encore corrigée | non | non |
| oui | **non** | `results` présent | **Corrigée, pas encore rendue** | non | non |
| oui | oui | autocorrection en cours | À faire | oui | oui |
| oui | oui | `solved ≥ total` | Terminée | oui | oui |

Testé au banc : les trois conditions sont bien croisées dans le fichier livré (`d.published===false` en filtre, `!d.copyPublishedAt` en second, `d.results[cle]` en troisième).

## 5. Correctif du banc (auto-signalé)

Mon premier test « aucun texte élève ne parle de publier » **échouait à tort** : l'extraction des chaînes enjambait les commentaires du code et prenait « *les options publiées* » (un commentaire) pour un texte affiché. Un test qui échoue pour une mauvaise raison est aussi nuisible qu'un test qui passe pour une mauvaise raison — je l'ai corrigé (retrait des lignes de commentaire avant extraction, exclusion des fragments contenant de la syntaxe) plutôt que d'assouplir son verdict. Il passe maintenant sur le fond : les 4 composants élève ne contiennent plus aucun texte affiché parlant de publication.

## 6. Dettes

Inchangées : D1 mode test souche · D2 K.1 (après M15) · D3 `dictee_settings` → M16-0 · D4 suppression sans corbeille · D5 alias Concordance · D6 tableaux prof mobile · D7 plan L69 · D8 casse `/classes` côté prof · D9 deux registres de classes en mémoire.

- **D10 (nouvelle) — « publier » désigne deux gestes** dans l'app : publier la dictée (`config.published`) et publier les copies (`copyPublishedAt`). Côté élève, la confusion est purgée. **Côté prof, les deux boutons portent le même verbe** (« Publier » dans la préparation, « 📤 Publier (n copies) » dans l'onglet Copies) — c'est le terreau de l'erreur, et il reste en place. À traiter dans la passe panneaux : « Publier la dictée » vs « Rendre les copies » lèverait l'ambiguïté à la racine.

## 7. Reste avant promotion

Audit visuel (desktop + mobile 390 px) · **arbitrage de Paul sur les trois messages alignés** · essai réel : Léonie sur Utopie (« Pas encore corrigée »), « Grandes découvertes » (« Corrigée, pas encore rendue », ni note ni lien, et si un ancien lien de copie est ouvert : le nouveau message d'arrivée) · promotion sur son ordre. Je ne promeus pas.

# M6sexies — PRINCIPE CARDINAL : jamais le professeur mis en cause
*Exécutant M6, 18/07/2026. Plan relu (933 lignes, md5 `e2cd6733fc7ab6913fb34025ad233d82`) — tête de grille, principe cardinal, points 25/26/28. Livraison au sas — aucune promotion, aucune écriture hub.*

## 0. Empreintes

| Objet | md5 | Taille |
|---|---|---|
| Production (M6ter+ promue) | `7e7241fc49a925c4a355f1e0b81586c9` | 522 368 o |
| **M6sexies : `correction_dictee.staging.html`** | `2f7f88ba863ebfe77ec900daaeedd867` | 523 854 o |

Double parseur **OK** · banc **105/105 sur l'export réel** (95 → 105) · non-régression `pilotage_debat_s3.html` 12/12.

## 1. ① Le cas fondateur, supprimé

`buildCopieHtml`, générateur de la copie remise à l'élève :

```
- transcriptHtml = '<div class="err-trans placeholder-msg">(transcription non saisie par le professeur)</div>';
+ transcriptHtml = '';
```

**Rien à la place.** L'information ne servait pas l'élève : elle disait qu'un champ de saisie était vide, et le disait en désignant un responsable. Le bloc s'efface, l'analyse de l'erreur reste (type, commentaire grammatical, points) — l'élève ne perd rien qu'il utilisait.

Je note que cette phrase a vécu des mois dans le générateur de copies sans que personne la voie : c'est exactement l'asymétrie du point 26 — une décision de wording passe sous le radar parce qu'elle a l'air anodine.

## 2. ② L'articulation appliquée : sujet du FAIT, jamais du MANQUE

Ma livraison précédente enfreignait le principe cardinal en croyant appliquer le point 28. **Quatre textes corrigés** :

| Où | M6quinquies (fautif) | M6sexies |
|---|---|---|
| AppEleve — refus de code | Je n'ai pas encore enregistré de code pour toi. | **Ton code n'est pas encore enregistré. Viens me voir pour qu'on le mette en place.** |
| AppEleve — copie corrigée non rendue | Ta copie est corrigée, mais je ne l'ai pas encore rendue. | **Ta copie est corrigée. Elle sera disponible après la séance de correction.** *(texte de Paul)* |
| AppEleve — copie non corrigée | Je n'ai pas encore corrigé ta copie. Quand je te l'aurai rendue… | **Cette dictée n'est pas encore corrigée. Tes erreurs à revoir apparaîtront ici après la séance de correction.** |
| MaCopie — arrivée | Je ne l'ai pas encore rendue. Reviens un peu plus tard. | **Elle sera disponible après la séance de correction.** *(texte de Paul)* |

Deux d'entre eux gardent une adresse au « je » là où elle affirme (« viens me voir ») et passent au flux là où ça manque. Le critère du plan est vérifiable en une lecture, et je l'ai transformé en test : **aucun texte élève où le professeur est sujet d'une négation**, à la 1re comme à la 3e personne.

## 3. ③ Relecture complète sous le filtre — liste soumise

J'ai relu **tous** les textes des cinq porteurs de discours élève (`AppEleve`, `MaCopie`, `EleveCorrection`, `ExercicesEleve`, `Fiches`), en décodant les échappements pour les lire en clair. Résultat :

**Textes qui mettaient le professeur en défaut** : les 4 ci-dessus + le cas fondateur. **Tous traités.**

**Textes au « je » qui restent — et qui doivent rester** (accompli ou adresse, l'autorité s'affirme) :

| Où | Texte | Pourquoi il est conforme |
|---|---|---|
| EleveCorrection | ta note de dictée, **c'est moi qui la calcule** sur ta copie papier | Accompli, affirmatif. C'est le contraire d'un aveu : il dit que la note vient de Paul, pas de la machine (interdit n°2 tenu à l'endroit). |
| EleveCorrection | Clique ici **quand je te le demande** | Adresse. |
| EleveCorrection | où **j'ai signé** ta graphie / **J'ai signé** ta graphie ici | Accompli. |
| Fiches | **J'ai hésité** à mettre illisible | Accompli assumé — un geste de correction, pas un manquement. |
| ExercicesEleve | **Je la corrigerai** à la main | Futur affirmatif : une promesse tenue par Paul, pas un retard. |
| AppEleve | **Vois avec moi** comment la rattraper | Adresse. |
| Suivi | Note de la dictée (corrigée par le prof) | Infobulle **prof**, restaurée à l'identique en M6quinquies. |

**Textes de constat, sans acteur** — conformes, et à laisser en dur (critère du point 26) : « Pas encore corrigée » · « Corrigée, pas encore rendue » · « Tu étais absent(e) » · « Ce code ne correspond pas » · « Aucun élève à ce nom ».

**Un point que je te soumets sans le trancher** : « **Corrigée, pas encore rendue** » est un constat sans acteur, donc conforme à la lettre. Mais un élève peut le lire comme « il a fini et il ne me la donne pas ». Si tu veux fermer même cette lecture, la ligne pourrait dire « **Disponible après la séance** ». Je ne l'ai pas changée : elle est validée par Paul et le libellé de ligne doit rester court. À son arbitrage.

## 4. ④ Terrain préparé pour M6-solde — les quatre textes à extraire

Non codés, repérés nommément et par emplacement. Critère appliqué : **ils ANNONCENT** (une promesse dont l'app ne connaît pas l'état réel), là où les constats restent en dur.

| # | Texte actuel | Emplacement exact | Clé proposée |
|---|---|---|---|
| 1 | *Ta copie est corrigée. Elle sera disponible après la séance de correction.* — et sa jumelle de `MaCopie`, *Elle sera disponible après la séance de correction.* | `AppEleve`, écran d'attente (branche `nonrendue`) **et** `MaCopie`, branche `if(!pubAt)` | `attente_copie` |
| 2 | *Tu n'as pas encore de dictée. Celles de ta classe apparaîtront ici.* | `AppEleve`, écran « Mes dictées », liste vide | `liste_vide` |
| 3 | *Tu n'étais pas là le jour de cette dictée. Vois avec moi comment la rattraper, si c'est possible.* | `AppEleve`, écran d'attente (branche `absent`) | `invitation_rattrapage` |
| 4 | *Bravo <Prénom> !* (avec 🎉), **affiché quelle que soit la note** | `EleveCorrection`, bloc `if(finished)` | `fin_parcours` |

Deux remarques pour l'extraction :
- Le texte n°1 **existe en deux exemplaires** (portail et arrivée sur la copie) : il faut une seule clé pour les deux, sinon Paul modifiera l'un en croyant modifier les deux.
- Le n°4 est le cas décrit au point 26 : le « Bravo » n'a été décidé par personne. Il est accompagné d'un 🎉 et du prénom — **trois décisions de registre** que l'extraction doit rendre modifiables ensemble, pas seulement le mot.

Ajouté au registre : la troisième branche de l'écran d'attente (*Cette dictée n'est pas encore corrigée…*) est elle aussi une annonce. Elle n'est pas dans la liste de quatre validée par Paul — je la signale sans l'ajouter d'autorité ; si le lot passe à cinq, elle partage naturellement la clé `attente_copie`.

## 5. Intégrité

Écrans intacts octet pour octet vs production : **8/12**. Modifiés **aux seules chaînes** : `Fiches` (1), `MaCopie` (1), `EleveCorrection` (4), `ExercicesEleve` (2), plus `buildCopieHtml` (1, la suppression du cas fondateur). Diff vérifié ligne à ligne : aucune logique touchée.

## 6. Registre

**Ouvertes** : D1 mode test souche · D2 K.1 (M15) · D4 corbeille · D5 alias Concordance · D6 tableaux prof mobile · D7 plan L69 · D8 casse `/classes` prof · D9 deux registres en mémoire · D10 « publier » ambigu prof · D12 absence non partagée (M15) · chantier X rattrapage modal · **D13 (nouvelle) — dictionnaire de textes** (les 4 champs ci-dessus, M6-solde).

**Rayée** : ~~D3~~ (nœud fantôme).

**M6-solde annoncé** : D1 · D4 · D6 · D8 · D10 + D13.

## 7. Reste avant promotion

Audit visuel (desktop + mobile 390 px) · **arbitrage de Paul sur les 4 reformulations du §2 et sur le point soumis au §3** (« Corrigée, pas encore rendue ») · essai réel, notamment une copie contenant une erreur sans transcription (le bloc doit simplement ne rien afficher) · promotion sur son ordre. Je ne promeus pas.

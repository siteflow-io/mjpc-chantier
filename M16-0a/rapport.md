# M16-0a — RAPPORT DE LIVRAISON (TEMPS 2)
**Le bouton qui détruit les contrats — réparé.** Exécutant [C5-M16a], sous conscience n°5 · 07/08/2026.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.35.0) | 830 142 o | `33dfe78a9a401d1ba251d7a9217c37b9` |
| LIVRÉ (8.36.0) | 834 674 o | `86006b1db34e95ac695ed66545340150` |

Double parseur **VERT** · **0 fonction supprimée** · 8 éditions · **`index.html` seul : aucune app n'est modifiée.**

## 2 · ① Le normaliseur conscient des chaînes — EXIGENCE A

La cause racine (cadrage §1) tenait à deux regex globales aveugles. Le remplacement, `fichesNormaliserJS` (1 068 o), fait **un seul passage qui sait où il est** : dans une chaîne il recopie (apostrophes typographiques, tirets, guillemets français compris) en n'échappant que les guillemets doubles internes ; hors chaîne il jette les commentaires, met les clés nues entre guillemets, retire les virgules traînantes. Le repérage du bloc et le comptage d'accolades ne changent pas.

### Les cinq cas qui cassaient — entrée/sortie, prises dans les fichiers RÉELS des apps
**commentaire de fin de ligne AVANT une clé nue**
> entrée (fichier réel) : `],   // conception (textes, pièges, réglages) : survit aux années
  purger`
> sortie : "purger" reconnue et mise entre guillemets

**apostrophe française DANS un commentaire**
> entrée (fichier réel) : `// l'app lit/écrit /classes racine (partagé) via le socle, sans le posséder`
> sortie : commentaire supprimé en entier — plus de guillemet parasite

**apostrophe typographique DANS une chaîne**
> entrée (fichier réel) : `l’élève parcourt à son rythme, en autonomie : i`
> sortie : recopiée telle quelle (l’élève reste l’élève)

**commentaire de bloc**
> entrée (fichier réel) : `(aucun dans ce bloc)`
> sortie : sauté hors chaîne

**virgule traînante**
> entrée (fichier réel) : `(forme : [..,] ou {..,})`
> sortie : retirée après normalisation

**Résultat mesuré au banc, sur les trois apps de production servies au chemin réel : 9 blocs sur 9 extraits** (`MJPC_APP`, `MJPC_MANIFESTE`, `MJPC_PURGE` × qcm, worktrack, reecriture) — contre **0 sur 9** avec le code de production. Le contrat de purge de `reecriture` (celui dont le bloc porte 14 commentaires) revient complet, et l'apostrophe de « l'élève » traverse intacte.

## 3 · ② La garde de non-dégradation — EXIGENCE C

Posée dans `fichesMajUne` (1 025 → 1 980 o), avant toute écriture : on lit la fiche publiée, on fusionne champ par champ, **une valeur extraite nulle ou vide n'écrase JAMAIS une valeur existante au hub**. Elle vaut pour `app`, `manifeste` et `purge`, et **même si l'extraction échouait un jour sur une app inconnue** — c'est sa raison d'être.

**Un durcissement que le banc a imposé** : un contrat dont les deux listes sont vides **est vide, même s'il a ses clés**. Sans cela, un bloc illisible produisant `{preserver:[],purger:[]}` passait pour « extrait » et écrasait l'ancien contrat. La garde juge donc le **contenu**, pas la forme (`plein()`).

**Le cas le plus dur, joué au banc** : `correction_dictee`, **fiche déjà complète au hub**, dont le bloc `MJPC_PURGE` est volontairement rendu illisible. Résultat : **l'ancien contrat reste intact** (2 chemins conservés), le `manifeste` est publié normalement, **aucune écriture de contrat vide n'est partie**, et **le résultat le dit** — la ligne renvoyée porte `conserves:['purge']`.

## 4 · ③ Les contrats restaurés — état AVANT / APRÈS

| fiche | AVANT (manifeste / purge) | APRÈS |
|---|---|---|
| evaluation-qcm | ✗ / ✗ (0 chemin) | **✓ / ✓** |
| worktrack | ✗ / ✗ (0) | **✓ / ✓** |
| reecriture | ✗ / ✗ (0) | **✓ / ✓** |
| correction_dictee (bloc cassé) | ✓ / ✓ (2 chemins) | **✓ / ✓ (2 chemins — CONSERVÉS)** |
| applause_meter (app neuve) | — rien au hub — | **✓ / ✓ (publication normale)** |
| **index** | ✓ / ✓ (2) | **✓ / ✓ (2) — inchangée** |
| **taxonomie** | ✓ / ✓ (1) | **✓ / ✓ (1) — inchangée** |

**EXIGENCE D tenue** : `index` et `taxonomie`, complètes par l'autre chemin (`mjpcPublierManifeste`, qui écrit depuis la mémoire), **ne régressent pas** — mesure avant/après explicite au banc, verdict dédié.

## 5 · ④ Le message dit vrai

`mjpcManifesteAJour` (533 → 746 o) reçoit `purge` en **quatrième argument optionnel** : les appelants à quatre arguments ne sont pas cassés (prouvé : les trois formes testées au banc). `fichesEtat` (548 → 1 136 o) ne juge plus la seule version : **une fiche sans manifeste ou sans contrat de purge n'est plus annoncée « à jour »**, et le libellé **nomme ce qui manque** (« fiche incomplète — manifeste et contrat de purge à republier »). C'est ce qui avait fait dire au site « tout est à jour » pendant que neuf contrats manquaient.

## 6 · EXIGENCE B — le repli du `catch`

**Le repli est CONSERVÉ**, à l'identique (les cinq champs simples `id`, `nom`, `contenant`, `usage`, `quandPas`). Mais **il n'est plus le chemin normal** : avec le normaliseur, `JSON.parse` réussit sur les neuf blocs des apps réelles, et le repli ne sert plus que de filet ultime pour un fichier qu'on n'a pas encore vu. C'était précisément lui qui produisait l'amputation silencieuse — il ne la produira plus, puisque la garde ② interdit désormais qu'un résultat partiel écrase un contrat publié.

## 7 · Fonctions — inventaire (0 supprimée)

| fonction | avant | après | objet |
|---|---|---|---|
| `fichesNormaliserJS` | — | **1 068** | ① le normaliseur (ajoutée) |
| `fichesExtraireObjet` | 1 459 | 1 378 | appelle le normaliseur — **décroissance = l'extraction, déclarée** |
| `fichesMajUne` | 1 025 | 1 980 | ② la garde de non-dégradation |
| `mjpcManifesteAJour` | 533 | 746 | ④ `purge` dans la comparaison |
| `fichesEtat` | 548 | 1 136 | ④ l'indicateur voit le contrat |

## 8 · Banc de preuve — **BILAN : 16/16 VERTS** (run unique)

Chemin réel, **vrais fichiers d'apps de production servis au banc**, hub intercepté, **aucune écriture réelle**.

```
VERT  · P1 · ① les NEUF blocs des trois apps réelles sont extraits (0 avant)
VERT  · P1 · ① le contrat de purge de reecriture est complet (commentaires ET apostrophes traversés)
VERT  · P1 · ① l'apostrophe française d'une chaîne est intacte (« l'élève »)
VERT  · P2 · l'état AVANT est bien l'amputation mesurée (qcm, worktrack, reecriture sans manifeste ni purge)
VERT  · P2 · ③ après le bouton : les trois fiches amputées ont RETROUVÉ manifeste ET contrat de purge
VERT  · P2 · une app NEUVE (aucune fiche au hub) est publiée normalement
VERT  · P3 · ② bloc PURGE illisible sur une fiche complète : l'ancien contrat est CONSERVÉ, aucune régression
VERT  · P3 · ② et le résultat le DIT (la fiche déclare ce qu'elle a conservé)
VERT  · P3 · ② aucune écriture de contrat VIDE n'est partie pour cette fiche
VERT  · P4 · ④ une fiche amputée n'est PLUS annoncée « à jour »
VERT  · P4 · ④ `purge` entre dans la comparaison, sans casser les appelants à 4 arguments
VERT  · P4 · le bouton cliqué DEUX fois : idempotent
VERT  · P4 · rien ne se dégrade à la seconde passe (contrats identiques)
VERT  · P5 · D · `index` et `taxonomie` (complètes par l'autre chemin) sont INTACTES avant/après
VERT  · P6 · vue élève rejouée : aucune trace du panneau prof ni des fiches, écran intact
VERT  · P7 · `published` jamais écrit ; hors télémétrie préexistante (présence, manifeste Apps Script), rien n'est écrit hors /manifestes/
=== BILAN M16-0a : 16/16 VERTS ===
```

Cas du mandat tous joués : trois blocs → trois publiés · bloc illisible → **ancien contrat conservé** · fiche neuve → publication normale · **bouton cliqué deux fois → idempotent**, rien ne se dégrade · indicateur exact quand `purge` manque puis quand il est là · **vue élève rejouée** (aucune trace du panneau prof, écran intact) · `published` jamais écrit.

## 9 · Écarts et observations (déclarés)

1. **Le durcissement de la garde** (§3) n'était pas au mandat : le banc l'a rendu nécessaire, il est déclaré ici.
2. `fichesEtat` (⑤) n'était pas nommée au mandat mais portait le même défaut que `mjpcManifesteAJour` : sans elle, la liste aurait continué d'afficher « conforme au socle » sur une fiche amputée. Corrigée dans le même geste, avec son libellé soumis à Paul.
3. Télémétries préexistantes au journal (présence, manifeste Apps Script, intent) : exclues nommément du verdict « rien d'écrit hors /manifestes/ ».
4. Amenées de banc : `SECU.valide` posé ; les fichiers d'apps servis par le routeur ; `FICHES_APPS` restreint aux cinq cas du décor.

## 10 · Textes soumis à Paul

« fiche incomplète — manifeste et contrat de purge à republier » (libellé de l'indicateur, §5).

---
**STOP.** `M16-0a/index.html` + `rapport.md` + 3 captures au sas. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-M16a]*

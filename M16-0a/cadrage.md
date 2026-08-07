# M16-0a — CADRAGE (TEMPS 1)
**Le bouton qui détruit les contrats.** Exécutant [C5-M16a], sous conscience n°5 · 06/08/2026.
BASE mesurée : production **830 142 o, md5 `33dfe78a9a401d1ba251d7a9217c37b9`** (conforme au mandat).

## 1 · LA CAUSE RACINE — prouvée sur les fichiers réels des apps

Le nom réel de l'extracteur est **`fichesExtraireObjet(src, nom)`** (l. 8024, **1 411 o**). Il fait deux choses :

1. **Le découpage** est correct : il compte les accolades **en sautant** chaînes et commentaires — le bloc extrait est le bon, toujours.
2. **Le parsage ne l'est pas** : `JSON.parse` reçoit le bloc **avec ses commentaires intacts**. Le saut de l'étape 1 sert au comptage, pas au nettoyage. Les trois `replace` appliqués (guillemets sur les clés, `'` → `"`, virgules traînantes) ne retirent aucun commentaire — et le `'` → `"` transforme au passage les apostrophes françaises **contenues dans les commentaires** (« l'app ») en guillemets, ce qui achève de casser la syntaxe.

**La mesure sur les trois apps citées par le mandat** (fichiers de production téléchargés, blocs découpés à l'identique) :

| app | bloc | commentaires internes | `JSON.parse` aujourd'hui | avec les commentaires retirés d'abord |
|---|---|---|---|---|
| evaluation-qcm | `MJPC_PURGE` (528 o) | oui | **ÉCHEC** (property name) | **OK** |
| evaluation-qcm | `MJPC_MANIFESTE` (241 o) | oui | **ÉCHEC** (delimiter) | **OK** |
| reecriture | `MJPC_PURGE` (361 o) | oui | **ÉCHEC** | **OK** |
| reecriture | `MJPC_MANIFESTE` (179 o) | oui | **ÉCHEC** | **OK** |
| worktrack | `MJPC_PURGE` (354 o) | oui | **ÉCHEC** | **OK** |
| worktrack | `MJPC_MANIFESTE` (198 o) | oui | **ÉCHEC** | **OK** |

**6 échecs sur 6 aujourd'hui, 6 succès sur 6 avec le remède.** Exemples de ce qui casse : `preserver: ["qcm/evaluations",…],   // corpus de conception : survit aux années` · `noeuds: ["reecritures"],   // l'app lit /classes racine (partagé) sans le posséder`.

**Pourquoi `MJPC_APP` survit et pas les deux autres** : quand `JSON.parse` échoue, le repli ne cherche que **cinq champs simples** (`id`, `nom`, `contenant`, `usage`, `quandPas`) — ce sont exactement ceux de `MJPC_APP`. Le manifeste et la purge n'en ont aucun : le repli rend `{}`, donc `null`. C'est la mécanique exacte de l'amputation.

**Et pourquoi le hub perd le contrat** : dans `fichesMajUne` (l. 8055, **929 o**), le `null` est remplacé par un **défaut vide** — `purge: fichesExtraireObjet(src,'MJPC_PURGE') || {preserver:[],purger:[]}` — puis `secuEcrire('/manifestes/'+id, payload)` **écrase le nœud entier**. Le contrat existant est remplacé par du vide. C'est le geste destructeur.

## 2 · Pourquoi le message a menti (objet ④)

`mjpcManifesteAJour(publie, versionSocle, app, manifeste)` (l. 3052, **517 o**) compare la `version`, les **cinq champs** d'`app` et le `manifeste` — **jamais `purge`**. Une fiche amputée de sa purge mais dont l'app et le manifeste correspondent est donc déclarée « à jour ». D'où l'enchaînement vécu par Paul : le site annonce que tout va bien, puis demande de cliquer, et le clic ampute.

## 3 · Ce que je compte livrer (index.html seul, aucune app touchée)

**① Réparer l'extraction** — un nettoyage des commentaires **avant** parsage, dans la même passe que le comptage (une petite fonction `_sansCommentaires(txt)` respectant chaînes et échappements), et le `'` → `"` appliqué **après** ce retrait, donc plus jamais aux apostrophes de commentaires. Le repli à cinq champs est **conservé** en dernier recours (0 fonction supprimée, aucune régression sur `MJPC_APP`).

**② La garde de non-dégradation, universelle** — posée dans l'écrivain `fichesMajUne`, formulée ainsi : *une valeur extraite `null` ou vide n'écrase jamais une valeur existante au hub*. Concrètement : on lit le publié (déjà fait par `secuLire`), on **fusionne** — `purge` et `manifeste` extraits vides ou nuls **cèdent la place** au publié s'il est plus riche — et l'on n'écrit que ce qu'on a vraiment. La garde vaut **même si ① échouait un jour** sur une app inconnue : c'est la ceinture, ① est la bretelle.

**③ Restaurer les contrats** — le bouton corrigé, cliqué une fois, rend à chacune des 11 fiches son contrat complet. État AVANT (mesuré au hub, annoncé par le mandat) : **9/11 sans `purge`**, seules `index` et `taxonomie` complètes. Le rapport montrera l'état APRÈS au banc, **fiche par fiche**.

**④ Le message dit vrai** — `purge` entre dans la comparaison de `mjpcManifesteAJour`, sur le même patron que `manifeste` (comparaison structurelle). L'indicateur dira « à mettre à jour » tant que le contrat manque, « à jour » quand il est là.

**Fonctions touchées, tailles de base** : `fichesExtraireObjet` 1 411 · `fichesMajUne` 929 · `mjpcManifesteAJour` 517. **0 supprimée** ; la fonction de nettoyage sera **ajoutée**, pas extraite d'une autre.

## 4 · Plan de preuve (TEMPS 2)

- **Une fiche avec les trois blocs** (les vraies déclarations d'evaluation-qcm, reecriture, worktrack servies au banc) → **les trois publiés**, `purge.preserver` et `purge.purger` non vides.
- **Une fiche dont un bloc est illisible** (bloc volontairement cassé) → **l'ancien contrat CONSERVÉ** au hub, jamais écrasé par du vide (garde ②) — le cœur du morceau.
- **Une fiche neuve** (aucun manifeste au hub) → publication normale.
- **Le bouton cliqué deux fois** → **idempotent** : la seconde passe ne dégrade rien (et n'écrit rien si tout est à jour).
- **L'indicateur** : « à mettre à jour » quand `purge` manque, « à jour » une fois le contrat posé — le mensonge du ④ disparaît.
- **Les 11 fiches** : tableau AVANT/APRÈS, fiche par fiche.
- **Vue élève rejouée** (règle du dispositif) : le panneau prof ne change rien côté élève.
- `published` jamais écrit · aucune app modifiée · hub intercepté, **aucune écriture réelle**.

---
**STOP.** J'attends le feu vert de la conscience n°5 avant d'éditer une ligne (TEMPS 2 : `M16-0a/index.html` + rapport + captures, pastille 8.36.0).
*[exécutant C5-M16a]*

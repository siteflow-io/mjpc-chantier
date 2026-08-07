# M16-0a — CADRAGE (TEMPS 1)
**Le bouton qui détruit les contrats.** Exécutant [C5-M16a], sous conscience n°5 · 06/08/2026.
BASE mesurée : production **830 142 o, md5 `33dfe78a9a401d1ba251d7a9217c37b9`** (conforme au mandat).

## 1 · LA CAUSE RACINE, prouvée sur les fichiers réels des apps

J'ai téléchargé trois apps de production (`evaluation-qcm.html` 549 568 o, `worktrack.html` 1 057 796 o, `reecriture.html` 274 114 o) et rejoué `fichesExtraireObjet` **à l'identique** hors du site. Résultat : **les NEUF extractions échouent** — pas seulement `MJPC_MANIFESTE` et `MJPC_PURGE`, **`MJPC_APP` aussi**.

L'extraction ne meurt pas au repérage : elle trouve bien le bloc et son accolade fermante (l'exploration ignore correctement chaînes et commentaires). **Elle meurt à la normalisation JSON**, pour deux raisons indépendantes :

**① Les commentaires restent dans le texte extrait.** L'exploration les saute pour *compter les accolades*, mais `txt` les contient et `JSON.parse` casse dessus. Effet aggravant : après un commentaire de fin de ligne, la clé suivante n'est plus précédée d'une accolade ni d'une virgule, donc la regex de mise entre guillemets ne s'y applique pas — d'où l'erreur observée « Expected double-quoted property name » sur `purger:` :
> `{ "preserver": [...],   // corpus de conception : survit aux années   purger: [...] }`

**② `.replace(/'/g,'"')` détruit les apostrophes françaises.** Appliqué globalement, il transforme « l'app » **à l'intérieur d'une chaîne** en `l"app`, ce qui referme la chaîne et invalide le JSON :
> `"noeuds": ["plan_de_travail"],  // l"app lit/écrit /classes racine…`

**Pourquoi `app` survivait seul** : le repli du `catch` ne récupère que cinq champs simples (`id`, `nom`, `contenant`, `usage`, `quandPas`) — c'est-à-dire exactement `app`, et rien d'autre. **Le manifeste écrit ne portait donc que `app` : c'est le mécanisme exact de l'amputation.**

## 2 · L'ÉTAT RÉEL AU HUB — plus large que ce que le mandat annonçait

Lu aujourd'hui sur `/manifestes` (lecture seule) :

| fiche | version | app | manifeste | purge |
|---|---|---|---|---|
| analyse_logique | 1.6.0 | oui | **NON** | **MANQUANT** |
| applause_meter | 1.6.0 | oui | **NON** | **MANQUANT** |
| correction_dictee | 1.6.0 | oui | **NON** | **MANQUANT** |
| dictee_universelle | 1.6.0 | oui | **NON** | **MANQUANT** |
| evaluation-qcm | 1.6.0 | oui | **NON** | **MANQUANT** |
| index | 1.6.0 | oui | oui | oui (6 chemins) |
| pilotage_debat_s3 | 1.6.0 | oui | **NON** | **MANQUANT** |
| reecriture | 1.6.0 | oui | **NON** | **MANQUANT** |
| reecriture_bb4e | 1.6.0 | oui | **NON** | **MANQUANT** |
| taxonomie | 1.0.0 | oui | oui | oui (1 chemin) |
| worktrack | 1.6.0 | oui | **NON** | **MANQUANT** |

**9 fiches sur 11 n'ont ni `purge` NI `manifeste`** (le mandat ne relevait que `purge`). `index` et `taxonomie` sont complètes parce qu'elles passent par un autre chemin (`mjpcPublierManifeste`, l. 3093, qui prend les objets **en mémoire** au lieu de les ré-extraire d'un fichier). La conséquence est celle qu'annonce le mandat, et un cran plus large : `_purgePlan` serait quasi vide **et** l'inventaire des nœuds serait faux.

## 3 · Ce que je compte livrer

**① Réparer l'extraction** — remplacer la normalisation par un **normaliseur en un seul passage, conscient des chaînes** : il recopie les chaînes (simples, doubles, gabarits) en guillemets doubles **en échappant les guillemets internes**, **supprime les commentaires hors chaînes**, met les clés nues entre guillemets, retire les virgules traînantes. Le repérage du bloc et le comptage d'accolades ne changent pas — je ne redessine rien.
**Prototype déjà validé hors site sur les trois apps réelles : 9 blocs sur 9 extraits** (contre 0 aujourd'hui), y compris les `purge` complets de qcm, worktrack et reecriture. Le repli du `catch` est **conservé** (filet, jamais supprimé).

**② La garde de non-dégradation, universelle** — posée dans `fichesMajUne`, l'écrivain : on lit d'abord la fiche publiée, puis **une valeur extraite `null`, vide ou `{}` n'écrase JAMAIS une valeur existante au hub**. Le payload est fusionné champ par champ : `app`, `manifeste`, `purge` gardent la valeur publiée si l'extraction n'a rien donné de meilleur ; seule une valeur réellement extraite écrit. La garde vaut même si ① échouait un jour sur une app inconnue — c'est sa raison d'être.

**③ Restaurer les contrats** — le bouton corrigé republie les 11 fiches complètes ; le rapport montrera l'état AVANT (ci-dessus) et APRÈS au banc, fiche par fiche.

**④ Le message dit vrai** — `mjpcManifesteAJour` (l. 3052, 555 o) compare `version`, les cinq champs d'`app` et `manifeste`, **mais pas `purge`** : d'où « tout est à jour » alors que neuf contrats manquaient. J'ajoute la comparaison de `purge` (même forme que celle de `manifeste`, par `JSON.stringify`), en quatrième argument optionnel pour ne casser aucun appelant existant.

**Fonctions touchées, tailles de base** : `fichesExtraireObjet` **1 297 o** · `fichesMajUne` **1 002 o** · `mjpcManifesteAJour` **555 o**. **0 fonction supprimée.** Ce morceau ne touche **que `index.html`** : aucune app n'est modifiée.

## 4 · Plan de preuve (TEMPS 2)

- Une fiche avec les trois blocs (apps réelles servies au banc) → **les trois publiés**.
- Une fiche dont un bloc est illisible (bloc volontairement cassé) → **l'ancien contrat CONSERVÉ**, jamais écrasé par du vide (garde ②), et le reste publié.
- Une fiche **neuve** (rien au hub) → publication normale.
- **Le bouton cliqué deux fois** → idempotent : la seconde passe n'écrit rien (« déjà à jour ») et **rien ne se dégrade**.
- **L'indicateur** : « à mettre à jour » quand `purge` manque, « à jour » une fois posé.
- `index` et `taxonomie`, déjà complètes, **ne régressent pas**.
- **Vue élève rejouée** (règle du dispositif) : le panneau prof ne change rien côté élève.
- `published` jamais écrit · hub intercepté · **aucune écriture réelle**.

---
**STOP.** J'attends le feu vert de la conscience n°5. Une seule question de cadrage : le mandat vise `purge` ; **la mesure montre que `manifeste` manque aux mêmes 9 fiches** — je le répare dans le même geste (même cause racine, même garde), sauf avis contraire.
*[exécutant C5-M16a]*

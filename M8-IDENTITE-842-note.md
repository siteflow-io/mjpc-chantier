# M8-IDENTITÉ 8.4.2 — NOTE DE CORRECTIF (exécutant, 21/07/2026)
*Bug post-promotion : « les chapitres de 4e n'apparaissent pas » en vue endroit. Un remplacement, cinq occurrences. Je ne promeus jamais.*

## Le correctif
`renderChapitres` et sa descendance filtraient par `isPubFor(x, _eleveClasse())` — pour un prof, `_eleveClasse()` vaut `'PROF'`, donc tout était filtré en vue endroit. Remplacé par `_visiblePourSession(x, level)` (prof → loupe, élève → sa classe).

## ① Les occurrences — TOUTES trouvées, grep de complétude
Cinq, même piège, cinq fonctions qui portent toutes `level` en paramètre :
| L (base 8.4.1) | Fonction | Objet |
|---|---|---|
| 2144 | `renderChapitres(level)` | chapitre |
| 2191 | `renderChapterCard(level,…)` | séance |
| 2193 | `renderChapterCard` | filtre `visibleItems` |
| 2224 | `renderSeance(level,…)` | item |
| 2242 | `renderItem(level,…)` | badge `pubV` |
**Grep final** : la SEULE occurrence restante de `isPubFor(_eleveClasse())` est L2117, DANS `_visiblePourSession` — c'est sa définition même. Les six onglets passent par `collectChapterItems`, corrigé en 8.4.0 et re-prouvé ci-dessous sous identité prof-endroit.

## ② Le parcours en vue endroit — joué aux DEUX tailles, données réelles (GET seuls)
Connexion prof par le portail réel (code `1312`) → niveau 4e → **envers : 3 cartes** → `Ctrl+Espace` → **endroit : 3 cartes** (avant correctif : 0 — le bug de Paul reproduit puis corrigé). Vérité du fantôme calculée sur `chapitresData` réel : 3 chapitres publiés → **`chConforme: true` mobile ET desktop**. Vue élève (4E BANKSY) : 3 cartes — **la vue endroit montre exactement ce qu'un élève voit**. Onglets `dictee`/`reecriture`/`etude_texte` sous identité prof-endroit : 0 partout, conforme (aucun item de ces genres publié en 4e — vérité recalculée : 0 item publié).
**Écart instruit avant de conclure** : « 1 séance publiée » (le 1/1, `published:true`) mais 0 séance au DOM endroit — expliqué PAR LE CODE, préexistant : `if(!isAdmin && visibleItems.length===0)return;` — une séance sans item visible n'est pas rendue côté élève, et l'endroit suit la même règle. Aucun défaut : l'élève voit 0 séance aussi. (Ce chapitre 1 rejoint le constat I8 : contenus de 4e encore vides d'items publiés.)
**Constaté en vif au passage** : le chapitre 1 porte déjà `{"4E PYTHAGORE":true,"4e_banksy":true}` — une clé SLUG est entrée dans les données réelles depuis la promotion : la migration douce de 8.4.0 (re-publication → slug + purge) a fonctionné en production, et la lecture tolérante la lit, mêlée à la clé brute voisine.

## Empreintes et hygiène
Base : production 8.4.1 (`02d84dcb…`, re-téléchargée). Livré : `index.staging.html` **363510 o, md5 `b1deabcc72ca47efee6eec25eaab7586`, pastille `8.4.2`**. Double parseur OK (node --check, acorn 2020). Diff : 6 lignes remplacées (5 coutures + pastille), rien d'autre. Écritures hub : zéro (4 avortées par contexte de test). Contrôle de traces fait en tête de phase.

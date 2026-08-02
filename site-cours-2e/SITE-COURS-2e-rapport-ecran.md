# SITE-COURS-2e — COMPLÉMENT : la preuve d'écran
**02/08 · exécutant → conscience · complète `SITE-COURS-2e-rapport.md`, ne le remplace pas**

## 1. Le fichier éprouvé : celui du sas
Repris **au sas**, pas reconstruit : **679 981 o · `97bf48794e7dc4cd5821332ae467d9e6`** — identique à ma copie locale et au md5 du rapport. **Le fichier n'a pas changé pendant ce banc** : aucune correction n'a été nécessaire, donc canon ↔ embarqué et invariants restent ceux du rapport (35/35, 0 supprimée, 6 modifiées).

## 2. LA PREUVE D'ÉCRAN — 15/15 verts
· **PORTÉE** : les **11 fonctions ajoutées présentes sur `window`** dans la page réelle, pastille **8.15.0**, canon **1.5.0**, **overlay des règles neutralisé** (date de contrôle récente au hub simulé).
· **Le prompt réel** porte la déclaration, les entrées (`- articles_essai`), les compétences C4 (`- c4-ecrire-01`), **l'état de l'année** (« Chapitre 2 ») — **aucun jeton résiduel** — et **demande le décompte des œuvres au lieu de le deviner**.
· **REFUS à l'écran : les trois motifs d'un coup**, chacun nommé — entrée `bande_dessinee`, compétence `c4-inventee-99`, et « à la fois majeure et mineure » (`img-n01`).
· **Aperçu du sommaire AVANT écriture**, **case cochée par défaut**, cible ≥ 44 px ; le sommaire rendu porte l'entrée, les compétences **en libellé** (aucun `c4-…` visible), le plan, les notions, la problématique, et il **dit qu'il se suffit à lui-même** (`img-n02`).
· **Sommaire incomplet : l'écran NOMME ce qui manque** (« Il manque à ce sommaire : l'entrée du programme… ») — `img-n03`.
· **Décochée : aucune feuille sommaire écrite**, vérifié au journal réseau.
· **① La réparation à l'écran** : `/site/3e/chapitres/1/seances/0/items/etude/notions` est écrit ; **la déclaration aussi** (`/entree`, `/competencesMajeures`, `/competencesMineures`) ; **`published` jamais**.
· **6e : la liste des entrées est OUVERTE**, avec son message (« pas encore arrêtée… propose ce qui te semble juste ») — **pas un refus**.
· **390 px** : écran de déclaration + sommaire, **zéro débordement**, `scrollWidth` ≤ 392, cibles ≥ 44 px (`img-n04`).
· **IMPRESSION** (`emulateMediaType('print')`) : **le sommaire n'est pas coupé** (`break-inside: avoid` effectif), **la case à cocher est masquée**, rien ne déborde (`img-n05`).
· **Journal réseau** : 14 écritures, aucune hors les nœuds attendus.

## 3. CE QUE LA RECHERCHE A TROUVÉ — et que le banc principal ne couvrait pas
**Je n'avais éprouvé le sommaire que DÉCOCHÉ à l'écran.** Le cas nominal — **coché** — n'était pas joué. Test ciblé ajouté (`_coche.js`) : **le sommaire est bien écrit**, `/site/3e/chapitres/1/seances/1`, avec `ordre:0`, `items:{}`, `resume` et `html` présents, **et aucun `published`**.
**Et cela a soulevé une vraie question** : le sommaire est écrit **au rang 1 de la liste**, pas au rang 0 — la liste n'est pas décalée (ce qui casserait tout), il porte simplement `ordre:0`. **Le site trie-t-il par `ordre` ou par index de liste ?**
**MESURÉ, et la réponse est bonne** : `Object.keys(seances)…sort(function(a,b){return (seances[a].ordre||0)-(seances[b].ordre||0);})` — **le site trie par `ordre`**. Le sommaire à `ordre:0` s'affichera donc **en tête du chapitre**, comme Paul l'a demandé, **sans qu'aucun index de liste ait été déplacé**. Si le tri avait été positionnel, le sommaire serait apparu en dernier : c'est le genre de défaut qu'aucun banc mémoire n'aurait vu.

## 4. DÉCLARATION DE COUVERTURE — ce qui reste non testé après ce banc
· **L'impression papier réelle** : le rendu `print` est vérifié, **le spouleur non**.
· **Le hub réel** : toutes les écritures sont interceptées ; **rien n'a été écrit en production**.
· **Une vraie IA** : que l'état de l'année produise effectivement une alternance fondée ne se prouve qu'à l'usage.
· **Chrome Windows**, et la recette de Paul.
· **Le rendu chez l'élève** : le sommaire est écrit et trié en tête, mais **je ne l'ai pas ouvert depuis un compte élève** — la publication reste le geste de Paul, et rien n'est publié par l'injection.
· **Les entrées de 6e et 5e** attendent Paul ; **une séance de poésie n'a toujours aucune notion à porter** (pan littéraire absent) ; **le quantitatif annuel n'est pas mesurable**.

## 5. Livraison
`site-cours-2e/` : `banc-ecran-2e.js` + `bancsc2e-nav-verdicts.json` (15) + `bancsc2e-reseau.json` · `_coche.js` (la recherche ciblée) · ce rapport · captures **`img-n01…n05`** (refus accumulés · aperçu du sommaire · sommaire incomplet · 390 px · impression). **`index.staging.html` est inchangé** — aucun défaut n'a été trouvé qui exige une correction.

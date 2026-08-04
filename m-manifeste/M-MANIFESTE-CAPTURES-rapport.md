# M-MANIFESTE-CAPTURES — la preuve par l'écran
**02/08 · exécutant n°2 du morceau → conscience n°4**

## 1. Ce que j'ai lu, et ce que je n'ai pas trouvé
**Lu au sas** (`m-manifeste/`, 27 fichiers listés) : `M-MANIFESTE-rapport.md`, `-rapport-final.md`, `-rapport-adresses.md`, `-mesure-undefined.md`, `-atesc.md`, `_textes_relus.txt`, ainsi que `banc.js`, `banc-nav.js` et leurs verdicts.
**NON TROUVÉ** : `M-MANIFESTE-rapport-bug-atesc.md` est bien présent au sas (4 930 o) — je l'ai lu. **Je n'ai pas eu accès à la conversation de l'exécutant précédent par un outil de recherche** : je n'ai disposé que des rapports livrés. **Je le déclare plutôt que de laisser croire à une lecture que je n'ai pas faite.** Ce que les rapports m'ont transmis : les trois pièges du fichier (marqueurs en double, socle non contigu, exemple commenté) et l'historique des deux mesures fausses sur `atEsc`.

## 2. Le fichier repris — et un DÉFAUT QUE LA CAPTURE A RÉVÉLÉ
Repris au sas : `index.staging.html` **686 883 o · `b2fd885718dd6ca27a7b6ed3e3550386` · 8.18.0**.
**⚠ LA PREMIÈRE CAPTURE A MONTRÉ « Socle en cours : 1.5.0 ».** Mesuré aussitôt : **`index.html` était resté au socle 1.5.0 et ne portait PAS `mjpcManifesteAJour`** — les neuf apps l'avaient, **le site non**. Conséquence : l'écran comparait les versions publiées à un socle périmé, et **le scénario « tout à jour » ne pouvait jamais s'afficher**.
**Corrigé** : la section M-MANIFESTE du canon 1.6.0 ajoutée au socle embarqué (sans le remplacer en bloc — il n'est pas contigu), pastille **8.18.0 → 8.19.0**.
**Livré : 687 824 o · `4dd9d53b13f99589e6fcf427d4a79b99` · 8.19.0 · parse VERT · `mjpcManifesteAJour` ×1 · socle 1.6.0.**
*C'est exactement ce que Paul attendait des captures : un audit sur pièces ne l'avait pas vu.*

## 3. LES CAPTURES — ce que chacune prouve
| capture | ce qu'elle prouve |
|---|---|
| **`cap-1-ecran-ecart.png`** | **LE BUG `atEsc` EST MORT.** « **Atelier d’analyse logique** » et « **L’Applaudimètre** » s'affichent **intacts, apostrophes courbes comprises**. Plus aucun « undefined ». Les 9 lignes, les dates en clair et en jours (« 17/07/2026 — il y a 17 jours »), le bilan en tête et la conduite à tenir |
| **`cap-2-390px.png`** | l'écran à 390 px : **`scrollWidth` = 390 ≤ 392**, **zéro débordement**, **ⓘ = 44 px**, et le tableau **bascule en paires libellé/valeur** (`td` en `display:block`, en-tête porté par `::before`) |
| **`cap-4-caracteres.png`** | **le jeu de caractères difficiles, rendu DANS LA PAGE** : 11 cas, codepoints affichés, **aucun « undefined »** |
| **`cap-5-tout-a-jour.png`** | le bilan **vert « Tout est à jour »** quand les neuf portent la version courante |
| **`cap-3-publication.png`** | l'état de l'app au moment de la mesure de publication (voir §5) |

## 4. Le jeu de caractères difficiles — en codepoints, rendu à l'écran
`aujourd'hui` (U+0027) · `aujourd’hui` (**U+2019**) · `l'élève` (**apostrophe DANS un mot**) · `il dit "oui"` · `« oui »` (U+00AB/U+00BB) · `A & B` · `a < b > c` · `é è ç œ` (U+0153) · espace insécable (**U+00A0**) · `Atelier d’analyse logique` · `L'Applaudimètre`.
**11 cas, 11 rendus intacts, aucun `undefined`** — mesuré dans le navigateur, pas en Node.

## 5. ⚠ LE SEUL ÉCHEC, INSTRUIT ET NON ÉCARTÉ : la publication d'une app périmée
`correction_dictee` chargée dans un navigateur réel, hub simulé en 1.1.0 → **elle ne publie pas**.
**Mesuré, et ce n'est pas un défaut du code** : l'appel est `useEffect(function(){ publierManifeste(db); }, []);` — **il appartient à un composant React qui n'est pas monté au simple chargement**. Mon banc ouvre la page sans franchir le portail ; le composant ne se monte donc jamais.
**CE QUE CELA CORRIGE DANS LE CADRAGE INITIAL** : le rapport du 02/08 annonçait que `correction_dictee` et `evaluation-qcm` publient « à chaque ouverture, élève compris ». **C'est faux** : elles publient **quand le composant qui porte le `useEffect` est monté**, ce qui suppose d'être entré dans l'app. **Ma mesure fait foi, et elle contredit un point que j'ai moi-même écrit.**
**Conséquence pratique** : la publication reste conditionnée à un usage réel de l'app — ce qui **renforce** l'utilité de l'écran d'écart, et **ne change rien** à la solution retenue.
**Ce qui reste donc non prouvé** : la publication effective d'une app périmée dans un navigateur. **Prouvée en mémoire (banc 7/7 du rapport principal), pas à l'écran.** Pour l'obtenir, il faudrait simuler l'entrée prof complète dans `correction_dictee` — je ne l'ai pas fait.
**En revanche, la non-publication est prouvée à l'écran** : hub à jour → **aucune écriture**, journal réseau à l'appui.

## 6. Journal réseau
Écritures observées pendant toutes les passes : `/manifestes/index`, `/presence/prof`, `/site/atelier/documents/…` — **toutes des mécanismes pré-existants du chargement du site** (publication du manifeste d'`index`, présence, feuille créée par mon banc). **Aucune écriture du geste `ecartOuvrir()`** : l'écran lit, il n'écrit pas. **Aucune écriture au hub réel** : hub simulé uniquement.

## 7. Déclaration de relecture
**Relus mot à mot** : les textes de l'écran d'écart rendus à l'écran (titre, intro, bilans, quatre états, en-têtes, infobulle). **Aucune correction.** Une observation, non corrigée : une app **jamais publiée** s'affiche par son identifiant brut (`reecriture_bb4e`) faute de nom au hub — c'est exact, mais un nom de repli serait plus lisible. **Signalé, hors périmètre.**

## 8. DÉCLARATION DE COUVERTURE
**Testé** : les cinq captures, les mesures 390 px, le jeu de caractères à l'écran, la non-publication en navigateur réel, le journal réseau, le parse après ma correction du socle.
**NON TESTÉ** : la publication d'une app périmée à l'écran (§5) · l'impression · Chrome Windows · le hub réel · les huit autres apps chargées (seule `correction_dictee` l'a été).
**Ce que cela veut dire pour la promotion** : le bug `atEsc` est prouvé mort **par l'image**, l'écran est prouvé **en grand et à 390 px**, et **une correction que l'audit sur pièces n'avait pas vue a été trouvée et faite**. Il reste **une preuve manquante, nommée**.

# SITE-COURS-2d — CADRAGE (TEMPS 1)
**Le confort d'éditeur : conseil du filet, navigation aperçu↔éditeur, ⓘ d'injection.**
Exécutant SITE-COURS-2d, sous conscience n°5 · 05/08/2026

BASE mesurée : production 767 559 o, md5 `3cf2d409bf62d0b4d318a1605b95ed84`, pastille 8.29.0 — conforme (2c promu).

## 1 · Mesure du patron worktrack (production, 1 057 796 o) — ce que je reprends, ce que j'adapte

**Le mécanisme réel, lu dans le code** (il fait exactement ce que Paul décrit) : la feuille d'aperçu enveloppe chaque zone dans `.zwrap[data-z]` ; le setter mémorise la zone touchée (`this._edZone`), le débonce de l'aperçu (140 ms) la reprend (`_edPulse`) et le re-rendu pose `.pulse` sur l'enveloppe ; la keyframe `edPulse` est un halo + fond dorés qui décroissent sur **5 s ease-out forwards** jusqu'à transparent, avec `scrollIntoView({block:'nearest'})` par un petit script injecté dans la page. Depuis la version interne « ez », worktrack pulse au **fragment** (un choix précis de QCM via `[data-frag]`) quand le setter le permet, sinon à la zone.

**Je reprends** : la keyframe `edPulse` telle quelle (mêmes valeurs, même durée), l'enveloppe par zone avec attribut de données (`data-comp` sur chaque section rendue d'`atelierDocumentHTML`), la mémorisation de zone par les setters relayée par le débonce existant (`atMarquerModifie` → `AT.timerRendu` → `atRendreApercu` → option `pulse` d'`atelierPageHTML`), et le `scrollIntoView` nearest injecté. **J'adapte** : la granularité s'arrête à la **composante/section** (pas de fragment « ez » : la feuille de l'atelier n'a pas de sous-choix internes à cibler ; c'est aussi le niveau du nommage des zones du conseil ①, une seule échelle partout).

## 2 · Objet ① — le conseil du filet local (résorbe la dette « comparaison par horloge d'appareil »)

`atOuvrirDoc` compare aujourd'hui `brouillon.dates.modifieLe > base.dates.modifieLe` et pose une question sèche. Désormais, si l'horodatage du filet est plus récent, on compare les **contenus** :

- **Une seule mesure d'écart** : le cœur d'`atEnvoiEcart` (2c) est extrait en `atEcartDetail(a,b)` → `{nb, zones:[libellés]}` ; `atEnvoiEcart` devient `atEcartDetail(a,b).nb` (décroissance déclarée, même méthode que l'extraction `itemCreer` de 2c — pas de seconde mesure). Les libellés de zones viennent de ce que la feuille sait d'elle-même : `ATELIER_COMPOSANTES[id].libelle` pour valeurs et cases, le titre du bloc (à défaut « bloc N ») pour `contenu[]`, « le titre de la feuille » pour `titre` — niveau **section**, jamais le caractère.
- **Contenus identiques (nb=0)** → aucune question : ouverture de la base, filet effacé en silence (`atBrouillonEffacer`) — le faux orphelin d'horodatage disparaît.
- **Contenus différents** → conseil argumenté : « La version de cet appareil contient **N modification(s)** absente(s) de la base (le titre, l'objectif, l'exercice 2…) — je conseille de la reprendre. » Liste courte : 3 zones puis « … » si davantage. Boutons inchangés : [Reprendre la version de cet appareil] [Garder la version en base].
- Filet plus **ancien** que la base : aucune question (comme aujourd'hui), rien ne change.

## 3 · Objet ② — navigation aperçu↔éditeur

**Sections repliées par défaut.** Les sections de l'éditeur = le rattachement (`atHtmlRattachement`) et les groupes (`.at-groupe` d'`atRendreEditeur`). À l'ouverture d'une feuille : **tout replié**. Choix motivé : la « section du titre » n'existe pas comme accordéon — le titre vit dans la barre permanente (`.at-titre-doc`), toujours visible ; je garde donc **permanents** la barre haute et les pistons « Préparer d'un clic » (un clic y déplie ce qu'il faut), et **repliés** rattachement + groupes. État tenu par `AT.sectionsOuvertes` (objet en mémoire), conservé toute la session d'édition (les re-rendus le relisent), remis à zéro par `atOuvrirDoc`. Chaque en-tête de section devient cliquable (chevron), patron accordéon du site (classes dédiées, transition douce).

**Pulse de l'aperçu** : cf. §1. Setters accrochés : `atSetTitre`, `atSetRatt`, `atToggleCase`, `atSetValeur`, `atSetBlocValeur`, `atSetBlocReforme` — chacun pose `AT.pulseComp` (l'id de composante ou `titre`/`ratt`/`bloc:i`) avant `atMarquerModifie`.

**Clic aperçu → section** : `atelierPageHTML` injecte (patron du script worktrack) un écouteur de clics sur `[data-comp]` qui `postMessage({type:'at-va',comp})` au parent ; l'atelier écoute, mappe la composante vers sa section, **ouvre l'accordéon** et fait défiler jusqu'à la case, avec un bref halo `edPulse` sur la case d'éditeur (même keyframe, boucle bouclée dans les deux sens).
**Mobile (≤ 900 px, colonnes empilées : éditeur dessus, aperçu dessous)** — proposition : le clic dans l'aperçu ouvre la section puis **fait défiler la page jusqu'à la case d'éditeur** (remontée) ; le halo dit où l'on a atterri ; le retour à l'aperçu est le geste naturel de redescente. Rien de plus (pas de bascule d'onglets inventée).

## 4 · Objet ③ — ⓘ des boutons d'injection

Les trois boutons de `chInjecter` (l. 7303-7305) gagnent chacun un `ⓘ` (patron `at-ifo` + `atInfo`, comme `atInfoGroupe`) disant **avant le clic** la substance que les modales disent déjà (mêmes phrases, reprises de `chInjecter`) :
- Compléter : « Seuls les éléments absents seront écrits. Rien de ce qui existe ne sera modifié. »
- Remplacer : « Le chapitre actuel part d'abord à la corbeille (items compris), puis il est remplacé. Les feuilles de l'atelier et les travaux des élèves ne sont pas touchés (ils vivent à part). »
- Garder à côté : « Le chapitre est ajouté en fin de liste, marqué "proposition" et non publié. Rien de l'existant n'est touché. »
Une fonction `atInfoInjection(voie)` porte les trois textes ; `chInjecter` continue de les dire à la confirmation (redondance voulue : avant ET au moment).

## 5 · Fonctions touchées (tailles de base mesurées)

Modifiées : atOuvrirDoc 1 218 (conseil ①) · atEnvoiEcart 939 (extraction du cœur → **seule décroissance**, déclarée) · atRendreEditeur 2 546 (accordéons) · atHtmlRattachement 3 319 (en-tête accordéon) · atRendreApercu 1 118 (option pulse) · atelierPageHTML 765 (script d'écoute + option) · atelierDocumentHTML 6 610 (enveloppes `data-comp`) · les 6 setters (76 à 3 319 o, +1 ligne chacun) · le HTML des 3 boutons d'injection (+3 ⓘ). Nouvelles : atEcartDetail · atInfoInjection · atSectionToggle · atAllerComposante (réception du postMessage). CSS : accordéons, halo d'éditeur. Pastille → 8.30.0. 0 supprimée.

## 6 · Textes soumis à Paul

1. Conseil : « La version de cet appareil contient N modification(s) absente(s) de la base (…) — je conseille de la reprendre. » [Reprendre la version de cet appareil] [Garder la version en base]
2. Les trois ⓘ d'injection (§4).

## 7 · Plan de preuve (banc, chemin réel, hub intercepté, zéro écriture réelle)

P1 filet : identique → silence + filet effacé (localStorage vérifié) · différent 1 zone → « 1 modification (le titre) » · 5 zones → « 5 modifications (…, …, …, …) » avec liste tronquée · plus ancien → aucune question. P2 accordéons : tout replié à l'ouverture, état tenu aux re-rendus de la session, replié à la réouverture. P3 pulse : modification d'un champ → la zone d'aperçu pulse et défile ; champ d'une section d'éditeur repliée → l'aperçu pulse quand même. P4 clic aperçu : section repliée → ouverte + défilement + halo sur la case. P5 les trois ⓘ → textes exacts. P6 : 390 px pour les trois objets (dont clic-aperçu mobile = remontée vers l'éditeur) · apostrophes codepoints · aucune écriture hub hors comportement existant (journal), published jamais écrit. Captures desktop + 390.

## 8 · Question au feu vert

Q1 — Sections permanentes retenues : barre haute + pistons ; rattachement et groupes repliés (motivation §3). Confirmé ?

**STOP — attente du feu vert de la conscience n°5.**
*[exécutant SITE-COURS-2d]*

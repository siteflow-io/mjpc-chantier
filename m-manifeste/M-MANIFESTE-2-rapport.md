# M-MANIFESTE-2 — la mise à jour sans geste caché
**02/08 · exécutant → conscience**

## 1. Base et livré
Repris au sas : `index.staging.html` **687 824 o · `4dd9d53b13f99589e6fcf427d4a79b99` · 8.19.0 · socle 1.6.0**.
**Livré : 703 534 o · `8b50dde6e35f569e44b3de5da9c0b15d` · 8.21.0 · parse VERT.**

## 2. ① LE MÉCANISME — le site lit les apps à la source, il n'en porte aucune copie
`fichesMajUne(id)` **télécharge `<id>.html` à la même origine** et en **extrait textuellement** `MJPC_APP`, `MJPC_MANIFESTE`, `MJPC_PURGE`, puis republie **si et seulement si** `mjpcManifesteAJour` dit qu'il y a un écart.
**Rien n'est exécuté** : l'extraction est un parcours de caractères qui respecte chaînes et commentaires. **Le gabarit commenté est écarté d'entrée** (piège payé trois fois sur ce chantier).
**Aucune copie au site** : c'est la raison même du refus de M-PROMPT-4 — une copie diverge au premier changement d'app. **Ici, la source est lue à chaque clic.**
**Ce que la méthode ne couvre pas, déclaré dans le code** : une déclaration construite dynamiquement, une valeur calculée, ou un objet dont les accolades vivent dans une chaîne sur une ligne. **Dans ces cas l'extraction rend `null` et l'app est signalée en échec** — jamais publiée à moitié.
**Un échec n'arrête pas les autres** : chaque app est indépendante, le compte rendu le dit.
**Le coût, mesuré et assumé** : ~6 Mo téléchargés. **C'est pourquoi c'est un bouton et non un automatisme** — une question de moment, pas de dose.

## 3. ② L'OVERLAY BLOQUANT, avec ses raisons
À l'ouverture du panneau prof, **si et seulement s'il y a un écart** : un voile qui **nomme chaque application**, dit **quand sa fiche a été écrite**, **quelle version elle déclare face au socle en cours**, et **ce que l'écart empêche** — « le prompt de chapitre ne sait pas quand te proposer cet outil » / « sa description est peut-être périmée : l'IA travaille avec une information ancienne sans que rien ne le montre ».
**« Fermer » est désactivé tant que le bouton n'a pas été cliqué** — et **activé après**, même si une app échoue : Paul n'est jamais enfermé.
**Aucun écart → aucun voile.** Prouvé.

## 4. ③ Le déménagement
Le bouton **a quitté l'atelier** (0 occurrence de `onclick="ecartOuvrir()"`). L'écran vit désormais **dans le tableau de bord du panneau prof**, chargé avec lui.

## 5. ④ Les trois corrections d'affichage
| avant | après |
|---|---|
| « Fiche publiée le / il y a N jours » | **« Fiche écrite » + « mise à jour le 17/07/2026 »** — la formule de Paul, sans compte à rebours |
| « Socle déclaré : 1.1.0 » et « État » séparés | **« Version déclarée » : « déclare 1.1.0, socle actuel 1.6.0 »** ou **« conforme au socle en cours »** — la colonne dit ce qu'elle mesure |
| une fiche **absente** pouvait passer pour à jour | **`fichesEtat` rend `aJour:false` dès que l'entrée manque** — « jamais publiée », **jamais « à jour »**. Prouvé (verdict ④) |
Et le bas de tableau porte **« Vérifié le 2 août 2026 à 7 h 24 »** / **« Toujours à jour au … »** — *l'écran dit quand il a regardé.*

## 6. Les preuves — 14/14, avec cinq captures
| capture | ce qu'elle prouve |
|---|---|
| `cap2-1-overlay.png` | **l'overlay bloquant**, 9 applications listées, chacune avec sa raison ; « Fermer » désactivé |
| `cap2-2-compte-rendu.png` | **le compte rendu après le clic** : app par app, republiée / déjà à jour / échec |
| `cap2-3-tableau-bord.png` | **l'écran dans le tableau de bord**, colonnes renommées, « Toujours à jour au … », **aucun overlay** |
| `cap2-4-jamais-publiee.png` | **une app jamais publiée n'est jamais dite « à jour »** |
| `cap2-5-overlay-390.png` | **390 px** : overlay sans débordement, cibles ≥ 44 px |
**LA PREUVE CENTRALE** : après le clic, **9 fiches écrites au hub — sans qu'aucune application ait été ouverte**. Journal réseau à l'appui, aucune écriture hors `/manifestes`.

## 7. UN DÉFAUT TROUVÉ PAR LE BANC, ET CORRIGÉ
Le compte rendu ne s'affichait pas dans l'overlay : **`fiches-cr` et `fiches-avance` existaient DEUX fois** (section du tableau de bord + overlay), et `getElementById` ne rendait que le premier. **Corrigé** : ids distincts, et les deux fonctions écrivent **dans les deux zones si elles sont présentes**. *Un id dupliqué ne casse rien de visible — il fait juste écrire au mauvais endroit.*

## 8. DÉCLARATION DE COUVERTURE
**Testé** : tout le §6, en navigateur réel, hub simulé.
**NON TESTÉ** : le hub réel (aucune écriture réelle) · **le téléchargement des 6 Mo sur la connexion de Paul** (les neuf fichiers sont servis en local, la durée réelle n'est pas mesurée) · l'impression · Chrome Windows · la publication depuis une app elle-même (mécanisme M-MANIFESTE, inchangé).
**Ce que cela veut dire** : le mécanisme est prouvé, **sa durée ne l'est pas**. Si les 6 Mo se révèlent longs chez Paul, il faudra un affichage d'avancement plus riche — le compteur « N sur 9 » existe déjà.

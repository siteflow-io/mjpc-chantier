# LOT ⑤ — « Dupliquer vers… » et les trois positions d'impression

**Base vérifiée** : production 940 936 o, md5 `427b8905eb02c4776523f604dc6b4e82` (conforme au mandat).
**Livré** : `index.html` **941 574 o**, md5 `35e0c5b4894dfc0aeb8ce9f8cc7bbe44`, pastille **8.45.0**. Diff : 18 lignes + 1 (date de pastille). Dual parser vert (`new Function` + acorn ES2020). **830 → 830 fonctions, 0 supprimée.** Vue élève publiée base ↔ lot : **22 264 o identiques, 0 exception.** Banc : décor à taille réelle (8 séances, 29 attendus, 11 documents dont 8 feuilles liées, fiche notion à 4 définitions, diaporama, Drive, séances vides), hub intercepté, **0 écriture réelle**, capteur d'exceptions en verdict partout.

---

## ① « Dupliquer vers… » — la mesure d'abord, qui corrige la prémisse

**La prémisse du mandat est périmée sur cette base.** Mesuré noir sur blanc : l'`atModaleChoix` de la production porte la marque `[LOT4-③]` et **exécute `fn()` AVANT le retrait** (le retrait suit, gardé par `parentNode`). C'est la réparation structurelle livrée et promue au LOT ④ — le commentaire dans le code documente précisément le défaut que le mandat décrit. Le rappel de « Dupliquer » lisait donc `getElementById('ed-dup-ch')` **pendant que la modale était encore au DOM** : le geste **aboutissait déjà** (il avait d'ailleurs été prouvé au banc du LOT ④, t62). La mesure « la valeur est toujours vide » décrit l'état d'avant la promotion du LOT ④.

**Le patron du LOT ② est néanmoins appliqué** (`[LOT5-①]`) : quatre modales à menu vivaient dans le fichier, trois au patron `ED_SEL` (valeur posée à l'ouverture + `onchange`), une au `getElementById` — la quatrième s'aligne. Deux raisons : un seul patron pour lire un menu de modale (même règle que « une seule fonction sait lire une clé », LOT ④ final) ; et un rappel qui deviendrait asynchrone un jour ne cassera rien. `edDupliquerVers` : 2 042 → 2 680 o (seule fonction modifiée du lot ; le segment `mjpcEcrireRest` n'a bougé que par la constante `APP_VERSION` qui vit dans sa fenêtre de découpe — fonction intacte).

**Le balayage exigé — les 25 appels d'`atModaleChoix`, classés par lecture réelle** (appel complet à parenthèses équilibrées, `getElementById` cherché **dans les rappels**, croisé avec les ids présents **dans le msg**) :

| appels | verdict |
|---|---|
| `atIAInjecterAvecDestination` (`at-inj-se`) · `edPrendreFeuille` (`ed-prendre-f`) · `edDeplacerVersSeance` (`ed-depl-se`) | **menus au patron `ED_SEL`** — valeur initiale posée à l'ouverture, `onchange` ensuite : sains, y compris pour un premier choix sans toucher le menu |
| `edDupliquerVers` (`ed-dup-ch`) | l'unique lecture d'un champ de modale au rappel — **migré `ED_SEL` ce lot** |
| les 21 autres (`atIAInfo`, `atIARemplacer`, `chInfo`, `chInjecter`, `ecartInfo`, `fichesInfo`, `diapoInfo`, `diapoToutRelu`, `diapoEnregistrer`, `atOuvrirDoc`, `atSupprimerDoc`, `atEnregistrerMaintenant`, `atProposerDepot`, `edPublierItem`, `edCreerFeuilleIci`, `ed2Imprimer`, `edProposerLiaisonsPrete`, `atProposerSommaire`, `atSupprimerChapitre`, `atSupprimerDiapo`, `atInfo`…) | **boutons seuls, ou lecture d'éléments d'ÉCRAN hors modale** (`at-ia-msg`, `dp-msg`, `ch-inv`… vivent dans les écrans, pas dans `#at-modale`) — insensibles au retrait |

**Preuve exigée, par gestes réels** (t80 : clic « Dupliquer vers… » du bloc d'item → menu → choix « Le roman social » au select → clic « Dupliquer ») :
- la copie arrive dans **chapitre 2, séance 1** (`feuille-d-ouverture`), un PUT propre `/site/4e/chapitres/2/seances/1/items/…` ;
- **uid NEUF** : `itm-msm435go-h8ay9` ≠ `it_1` de l'original (posé par `uidNeuf('itm')` d'`itemCreer` — `edDupliquerVers` ne transmet pas d'uid, mesuré) ; `published:false` ; `ref` partagée (**la conception du geste** : la copie d'item pointe la même feuille, le libellé de la modale le dit) ;
- **l'écran dit ce qui a été fait** : « Copie placée dans « Le roman social › Entrer dans le roman » — non publiée. » — capture `captures/cap_dupliquer.png` (examinée).

## ② Les trois positions — TRANCHÉ : les sept maillons fonctionnent tous

Instrumentation complète par **clics souris réels** sur le décor à taille réelle (t81), chaque maillon nommé :

| maillon | mesure |
|---|---|
| M1 clic reçu | chaque clic journalisé dans `ed2PagPoser` (`seance`, `document`, `serre`, `serre`) |
| M2 mode mémorisé | `ED2_PAG.mode` suit + **`localStorage['mjpc_ed2_pagination']`** posé à chaque clic |
| M3 papier redessiné | **exactement 1 rendu par clic** (compteur `atEditerChapitreRendre` : 3→4→5→6→7) |
| M4 coûts recalculés | les trois nombres portés par les boutons : **« Au plus serré 5 f. · Une séance par feuille 7 f. · Un document par feuille 11 f. »** |
| M5 changement visible | pages A4 **5 → 7 → 11 → 5** ; le bouton allumé (`ed2-pmode-on`) se déplace à chaque clic |
| M6 retenu d'une fois sur l'autre | mode posé `document`, **rechargement complet de la page** → `ed2PagModeLu()` = `document` (relu du localStorage) |
| M7 le papier garde le dernier mot | mesuré sur les trois découpes : **0 page multi-documents au-delà des 995 px utiles** (`ed2Pages` : « le papier s'arrête, toujours ») — un document seul trop grand a droit à sa page |
| M8 clic sur le bouton déjà actif | 1 rendu, rien ne casse, rien ne bouge (légitime : l'état est déjà celui demandé) |

Note de méthode sur M7 : l'« inclusion des frontières » (toute coupe du serré existerait en mode séance) est fausse **et c'est normal** — une coupe imposée dépend du remplissage amont de la page, qui change avec le mode ; la bonne formalisation du « dernier mot » est l'absence de dépassement, prouvée. Capture `captures/cap_mode_document.png` (examinée : « 11 feuilles à imprimer », bouton allumé, folio « feuille 1 / 11 », un document par page).

**Conclusion pour Paul : aucun maillon ne manque — le circuit entier fonctionne, réglage retenu compris.** Cela oriente vers **un cache de navigateur** chez lui (une version antérieure au LOT ③ servie par Chrome). Deux vérifications immédiates à l'écran : la **pastille 8.45.0** après promotion, et **les coûts en feuilles sur les trois boutons** (« 5 f. », « 7 f. »…) — ils n'existaient pas avant le LOT ③ : s'il voit des boutons sans nombre, il est sur une vieille copie → **forcer le rechargement (Ctrl+F5)**. Cas résiduel légitime : sur un chapitre où les trois découpes coûtent le même nombre de feuilles, le papier ne bouge pas — mais le bouton allumé se déplace toujours, et les coûts identiques affichés le disent.

## Caches en jeu, déclarations mesurées
`ED2_PAG` (`var ED2_PAG={mode:null}`, l. 11301 ; champs `affichee`/`reflow` posés par la repagination, l. 11374-11376) · `localStorage['mjpc_ed2_pagination']` (écrit l. 11349, lu l. 11344) · `ED2_MESURES` (`var ED2_MESURES={}`, hauteurs mesurées, lu par `ed2HauteurDoc`) · `ED_SEL` (`var ED_SEL={v:null}`, l. 11116 — désormais l'unique canal des quatre menus de modale) · `chapitresData` (lu/écrit par `itemCreer` — l'item copié y entre en mémoire, mesuré au LOT ④) · au banc : `M8_TEST_STORE` + journal `__REST`.

## Textes français
Aucun texte nouveau (le libellé de la modale et le message « Copie placée… » préexistaient). Alignement déclaré : `APP_VERSION_DATE` « 2026-08-05 » → « 2026-08-09 » (elle datait la pastille de quatre jours en arrière — règle « aucune dette, même cosmétique »).

## Dettes
Aucune dette nouvelle observée ce lot. Les différés motivés au LOT ④ (registre) restent inchangés : cocher/décocher depuis le panneau · ↩ Annuler sur champs de feuille · hauteur = maquette écran · présentation persistée (M-PROMPT-ARCHIVES) · glisser-déposer · navigation élève abrégée du banc.

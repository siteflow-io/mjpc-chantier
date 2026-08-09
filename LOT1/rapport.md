# LOT ① — LES BUGS DE L'ÉDITEUR DE CHAPITRE — rapport de livraison

Base : production `index.html`, **893 248 o, md5 fe991006366426e914e1a7bd92c73225** (vérifiée conforme avant tout travail).
Livré : `LOT1/index.html`, **897 421 o, md5 5918eb6eafc6f6ee19b4fe5eed8ad9b7**. Pastille : **8.41.0**.
Réparation seule : aucune fonctionnalité nouvelle, `published` jamais écrit, écran élève inchangé (rendu élève rejoué au banc : HTML strictement identique base ↔ LOT1), `uid` et ordres intouchés.

---

## ① / ⑦b — LA FEUILLE QUI DISPARAÎT : hypothèse PROUVÉE par la trace

**Séquence réelle mesurée au banc** (fonctions de rendu instrumentées, clic au sommaire sur « Le sonnet ») :

```
676.5ms  ed2Aller("b")
676.7ms  ed2Poser("b")            → ED2.courant = b
676.7ms  atEditerChapitreRendre() → rendu complet, pile reconstruite, scrollTop = 0
677.x    ed2Sommaire / ed2Papier
         (ed2Aller pose ensuite pile.scrollTop → l'écouteur de défilement part)
851.9ms  ed2Suivre()              → mesure la feuille au centre… ce n'est plus b
854.3ms  ed2Poser("a")            → LA FEUILLE DE PAUL EST ÉCRASÉE
855.1ms  atEditerChapitreRendre() → second rendu, scrollTop = 0, halo sur a
```

L'hypothèse de la conscience était juste : boucle de rendu. Le clic redessinait tout, le papier reconstruit perdait sa position, le défilement posé par `ed2Aller` réveillait `ed2Suivre`, qui posait une autre feuille et redessinait encore. Cela explique les deux formes du symptôme : « ça saute à la fiche suivante » (le suivi pose la feuille la plus proche du centre après le défilement posé) et l'affichage d'une demi-seconde (entre les deux rendus). « Ouvrir dans un onglet » affichait la bonne fiche parce qu'il lit `ED2.refCourant` sans passer par ce circuit — cohérent avec la mesure de Paul.

**Règle posée — SÉLECTION ≠ DONNÉES :**
- `ed2Poser` ne redessine plus RIEN : il bascule les classes en place (halo du papier, ligne du sommaire — qui porte désormais `data-item`) et met à jour `ED2.refCourant`. Zéro appel à `atEditerChapitreRendre`.
- Seul un changement de **données** redessine (liaison, suppression, ajout, case, champ, pagination) — un seul rendu par geste, après l'écriture.
- `atEditerChapitreRendre` **reprend la position de défilement de la pile** à travers tout redessin de données ; la feuille courante est reposée par le rendu lui-même (les classes se recalculent depuis `ED2.courant`). `window.scrollTo(0,0)` ne joue plus qu'au premier rendu de l'écran.
- Garde `ED2.gel` (400 ms) : un défilement **posé** par le code (`ed2Aller`, restauration après rendu) ne vaut pas un suivi — l'écouteur et `ed2Suivre` se taisent pendant la fenêtre.

**Rejeu du cas au banc :** clic sommaire → `courant=b`, halo sur b, défilement posé conservé (118 px), **aucun rendu**, console vide. Liaison posée → **1 seul rendu**, la feuille courante `c` reste courante, halo conservé, défilement repris à l'identique (mesuré 600→600 px sur pile défilable).

**Balayage demandé — chaque fonction, redessine-t-elle des données ou une sélection ?**
| fonction | verdict |
|---|---|
| `ed2Aller` | sélection seule (via `ed2Poser`) + défilement posé sous gel — 0 rendu |
| `ed2Pile` | **jamais appelée** (code mort depuis l'atelier papier) — conservée, 0 suppression |
| `ed2Sommaire` | constructeur pur, invoqué par le seul point de rendu |
| `ed2ClicDocument` | sélection seule désormais (appelait un rendu complet : corrigé) |
| `ed2ClicChamp` | sélection fine (classes), 0 rendu |
| `ed2PagPoser`, `ed2CoupeBasculer/Retirer`, `edLierConfirme`, `atChamp*` | données → un rendu chacun |

## ② — LE CACHE DES FEUILLES LU SANS ÊTRE CHARGÉ

**Déclaration mesurée du cache** (règle de livraison) : `var LINK_ATELIER_DOCS=null;` (objet `{id: doc}`, jamais un tableau). Affecté uniquement dans `loadAtelierDocList` (qui exige la présence du `<select id="link-modal-atelier">`) et `gotoFiches` — confirmé : depuis l'éditeur de chapitre, il valait `null`.

Conséquences mesurées, plus larges que le seul bouton : `edAppariements` (le bug rapporté), mais aussi `ed2Documents` (titres et drapeau `feuille`) et `ed2HauteurDoc` — **toutes les feuilles étaient comptées 76 px** (mesuré : 14 zones remplies → h=76), donc le compteur de feuilles et les coupures du papier étaient faux tant qu'aucune modale « Lier » n'avait été ouverte.

**Correctifs** :
- `atEditerChapitre` charge le cache **à l'entrée de l'écran** par `atSiteGetDocs` — le chemin même qu'empruntent `loadAtelierDocList` et `gotoFiches`, aucun second chargeur — puis re-rend (arrivée de données = données).
- `edProposerLiaisons` ne compare qu'**après un chargement réussi** ; corps historique déplacé tel quel dans `edProposerLiaisonsPrete`. Échec ou atelier illisible → « Impossible de lire les feuilles de l'atelier (ou l'atelier est vide) — les correspondances n'ont pas été cherchées. » ≠ « aucune ne correspond ». (Limite héritée du socle : `_siteGet` répond `null` aussi bien sur panne que sur nœud vide — le message nomme donc les deux.)

**Banc :** « Lier par les titres… » depuis un éditeur fraîchement ouvert, sans aucun geste préalable → cache chargé, modale « 1 liaison à poser : … ← Vocabulaire de la peinture », rien d'écrit avant confirmation.

## ③ — LE BOUTON QUI NE DIT RIEN

`openLinkModal` ouvre bien sa modale (`#link-modal` existe statiquement, ligne 1537). Le bouton silencieux était « Lier par les titres… » quand le cache manquait : il annonce désormais « Je relis les feuilles de l'atelier… » pendant la lecture, puis répond toujours quelque chose (modale, ou l'un des deux messages ci-dessus).

## ④ — LES BOUTONS D'INJECTION D'UNE FEUILLE

Corrigé dans `atIAApercu`, en miroir du correctif chapitres du 07/08 : sans feuille ouverte (`AT.doc`/`AT.docId` absents) → **un seul bouton** ; avec feuille ouverte → deux boutons et **« Remplacer « <titre> » »** nomme la feuille, comme la modale de confirmation le faisait déjà. Captures des deux états jointes. (Mesuré au passage : l'ancien bouton était de surcroît **mort** sans feuille ouverte — `atIARemplacer` sortait en silence sur sa garde.)

## ⑤ — LA DÉTECTION D'UN CHAPITRE EXISTANT

**Mesure** : `chAfficherInventaire` décidait par `String(c.title).toLowerCase() === String(o.chapitre.title).toLowerCase()` — casse seule. **La comparaison était donc fautive** : accents, apostrophe droite/courbe et espaces multiples faisaient rater — ou trouver à tort. Réparée en codepoints normalisés par `edTitreNorm` (la normalisation déjà en place pour la liaison par les titres : NFD, apostrophes, tirets, ponctuation, espaces). Banc : « Attendus de fin d'année » (courbe) ≡ « Attendus de fin d'annee » (droite) ; deux titres réellement distincts restent distincts.

**Et le cas rapporté** : Paul possède **deux jumeaux « Poésie et peinture »**. Un titre strictement identique matchait déjà avec l'ancienne comparaison — son « Garder à côté (proposition) » sur un chapitre « neuf » est donc très probablement le **cas ⓐ** (un chapitre de ce titre existe réellement), et l'écran a raison de proposer les trois voies. À noter pour un lot futur, hors périmètre ici : avec des jumeaux, la boucle retient le **dernier** titre égal rencontré (`cible`/`idx` écrasés) — la voie « Remplacer » viserait ce jumeau-là.

## ⑦a — LES TROIS POSITIONS D'IMPRESSION

**Les trois maillons instrumentés au banc : aucun ne manque.** Le clic est reçu (`ed2PagPoser` tracé), la valeur est mémorisée (`ED2_PAG.mode` + `localStorage.mjpc_ed2_pagination`), le papier est redessiné (compteur et nombre de pages changent). Le circuit n'était pas mort — mais deux défauts mesurés rendaient l'effet **invisible ou faux chez Paul** :

1. **Les hauteurs étaient toutes fausses** (② : `ed2HauteurDoc` → 76 px par feuille, cache null). « Au plus serré » tassait alors tout sur très peu de pages et les coûts affichés ne voulaient rien dire. Avec le cache chargé à l'entrée, coûts mesurés au banc : serré 1 f. · séance 2 f. · document 4 f. — distincts et justes.
2. **Chaque clic jetait la lecture** : re-rendu → pile à zéro + `window.scrollTo(0,0)` — l'écran semblait « ne rien faire » sinon revenir en haut. Corrigé par ① (position reprise, feuille courante conservée).

Comportement attendu vérifié : réglage retenu d'une fois sur l'autre (localStorage), coût affiché par position, et le papier garde le dernier mot (`ed2Pages` : le réglage ajoute des sauts, jamais n'en retire un imposé par la place — inchangé). Les traces relient bien ⑦a et ① : même écran, même rendu destructeur — traités ensemble, comme anticipé.

## ⑥ — BALAYAGE SYSTÉMATIQUE

64 boutons cliqués (éditeur de chapitre, états **chapitre plein** — feuilles liées + item attendu + séance vide — et **chapitre nu** sans séance), capteur d'exceptions branché en permanence, chaque bouton depuis un écran ré-entré à neuf. **Tableau complet, lignes vertes comprises : `captures/balayage.json`** (état · bouton · agit · le dit · exception).

Bilan : **62 vertes · 0 exception**. Les 2 « muettes » sont **« Au plus serré » cliqué alors qu'il est déjà le mode actif** : rien à changer, et l'état se voit (bouton allumé `ed2-pmode-on`) — légitimes. Trouvaille du balayage, réparée sous la règle de ④ (« aucun bouton ne propose une action impossible ») : les **↑/↓ de bordure** (première séance, dernière séance, premier/dernier item) sortaient en silence — ils sont désormais `disabled`, visiblement. Note de banc : ↑/↓ centraux et ✕ écrivent par `mjpcLot`/`mjpcDeleteJson` en fetch direct (hors couche `_sitePut`) — captés par le banc comme tentatives d'écriture, interceptées par le mur réseau ; **aucune écriture réelle n'est partie**.

## CAS AU BANC — récapitulatif

| cas | verdict |
|---|---|
| clic au sommaire → la feuille reste affichée | ✔ courant=b, halo=b, 0 rendu |
| liaison posée → un seul rendu, bonne feuille courante | ✔ 1 rendu, courant conservé, défilement repris |
| « Lier par les titres » à froid → correspondances sans geste préalable | ✔ |
| injection sans feuille ouverte → un seul bouton | ✔ capture |
| avec feuille ouverte → « Remplacer « <titre> » » | ✔ capture |
| vue élève rejouée | ✔ HTML identique base ↔ LOT1, capturée |
| 390 px et desktop | ✔ captures avant/après |

## TAILLES DES FONCTIONS MODIFIÉES (octets, avant → après)

| fonction | avant | après | delta |
|---|---:|---:|---:|
| ed2Poser | 106 | 699 | +593 |
| ed2Aller | 274 | 357 | +83 |
| ed2Sommaire | 821 | 851 | +30 |
| ed2ClicDocument | 187 | 169 | −18 |
| ed2Suivre | 639 | 731 | +92 |
| atEditerChapitreRendre | 7 951 | 8 853 | +902 |
| atEditerChapitre | 393 | 971 | +578 |
| edProposerLiaisons | 1 041 | 823 | −218 |
| edProposerLiaisonsPrete *(nouvelle, corps historique déplacé)* | — | 1 046 | +1 046 |
| atIAApercu | 2 313 | 2 675 | +362 |
| chAfficherInventaire | 5 837 | 6 057 | +220 |

`var APP_VERSION` : "8.40.0" → "8.41.0". Fonctions nommées : **818 → 819, 0 supprimée** (`ed2Pile`, morte, conservée). Fichier entier relu ; syntaxe du script unique validée (`new Function`).

## CACHES LUS OU ÉCRITS — déclarations mesurées (règle de livraison)

- `var LINK_ATELIER_DOCS=null;` — **objet** `{id: doc}` (lu par clé, jamais itéré en tableau).
- `var ED2={courant:null,caseSel:null,index:[]};` — objet ; `gel` (horodatage) s'y ajoute à l'exécution.
- `var ED2_PAG={mode:null};` — objet, adossé à `localStorage.mjpc_ed2_pagination`.
- `chapitresData[level]` — **objet** de chapitres par numéro (les séances/items aussi : parcours par `Object.keys` triés, jamais `forEach` de tableau — respecté partout dans le lot).

## BANC

Chemin réel (`index.html` chargé en navigateur entier), **mur réseau total** (toute requête http avortée) doublé du mode test M8 (`_siteGet`/`_sitePut` sur magasin local) — **aucune écriture réelle, aucune lecture du hub**. Chaque capture a été ouverte et examinée avant livraison (c'est cet examen qui a attrapé la pastille restée en 8.40.0, corrigée puis recapturée).

## TEXTES SOUMIS À PAUL (français sobre, à valider)

- « Je relis les feuilles de l'atelier… »
- « Impossible de lire les feuilles de l'atelier (ou l'atelier est vide) — les correspondances n'ont pas été cherchées. »
- Bouton : « Remplacer « <titre de la feuille> » »

Pas d'annonce élèves : livraison entièrement technique.

## LIVRAISON

`LOT1/index.html` (897 421 o, md5 5918eb6eafc6f6ee19b4fe5eed8ad9b7) · `LOT1/rapport.md` · `LOT1/captures/` (6 captures + `balayage.json`).

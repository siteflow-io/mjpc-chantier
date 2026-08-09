# LOT ④ — RÉPARER L'ÉDITEUR DE CHAPITRE, PUIS ÉPROUVER LES TROIS ÉCRANS
**Exécutant · 09/08/2026 · pastille 8.44.0 · base : production 929 628 o (md5 48371deab3b875c45c3ac71c0a59adc0, vérifiée) · livré : 934 558 o**
**Décor du banc : TAILLE RÉELLE — 8 séances, 29 items attendus dont 8 feuilles liées (+ 1 diaporama et 2 Drive liés), fiche notion à QUATRE définitions, feuilles pleines et quasi vides, séance entièrement en trous.**

## LES MESURES DU MANDAT, VÉRIFIÉES UNE À UNE
① `ed2PanneauFeuille` appelée dans la boucle des items ✓ · `data-champ="c-'+id+'"` identique pour toutes les feuilles ✓ · `ed2Selectionner` : `document.querySelector('#ed2-pan [data-champ=…])` — scopé au panneau mais **premier du panneau**, donc presque toujours la mauvaise feuille sur un chapitre réel ✓. ② `edBarreFil` : **UN SEUL point d'appel, `atRendreEditeur` l.9977** (liste complète — la déclaration l.10705 n'est pas un appel) ✓. ③ `.link-modal-overlay` z-index **5500 < 7000** (`#atelier-ecran`) : la modale Lier s'ouvrait DERRIÈRE l'écran ✓ · `atModaleChoix` retirait la modale AVANT le rappel ✓. ④ `docs.filter(d.attendu)` → bloc `ed2-manques` en tête ✓. ⑤ `edIAdepuisTrou` posait `AT.edChap=null` et partait sur l'écran de feuille ✓.
**Réconciliation d'une mesure** : « le rendu n'expose que trois composantes » — ma mesure (banc, doc-sonde, lots ③/③b) donne **97–98 valeurs `data-c` distinctes** posées par les formes. Le défaut réel que Paul voyait est ailleurs et il était bien réel : **panneau incomplet (soldé au ③b) puis CLÉ NON UNIQUE (soldé ici)** — le clic trouvait toujours une ligne… celle d'une autre feuille. Ma mesure fait foi, le symptôme du mandat est le bon.

## ① LA CLÉ UNIQUE — une fonction, deux côtés
`ed2Cle(item,comp,rang)` → `c-<item>-<composante>-<rang>` (73 o), appelée par le panneau (`ed2PanneauFeuille(k,ref)` — la signature gagne la clé d'item ; composantes uniques rang 0, blocs rang = occurrence du même id dans l'ordre de `doc.contenu`) **et** par le clic (`ed2ClicPapier` : bloc multiple → index de la zone parmi `pd.querySelectorAll('.f-contenu [data-c=…]')` — les blocs ne vivent que dans `.f-contenu`, dans l'ordre de `doc.contenu` : le même ordre, aucune construction parallèle). `ed2Selectionner` inchangée : la clé complète est unique.
**Preuves exigées** — ⓐ trois feuilles dont la DERNIÈRE : clic titre `a1` → `c-a1-titre-0` (« Feuille d'ouverture »), `e2` → `c-e2-titre-0` (« Feuille de préparation »), **`h2` (dernière) → `c-h2-titre-0` (« Grille de critères »)** — chaque fois SES valeurs, focus dedans. ⓑ la fiche `d1` à quatre définitions, **les quatre nommées** : Sonnet→`c-d1-definition-0` · Métaphore→`c-d1-definition-1` · **Allitération→`c-d1-definition-2` (capturé : la ligne « Ajouter une définition (3) » dorée, curseur dans « Allitération »)** · Assonance→`c-d1-definition-3`.

## ② LA BARRE DE CARTES A DISPARU
L'appel unique est retiré (`atRendreEditeur` : `var h=''`), la fonction reste (0 suppression, code mort déclaré). Le bouton « ← Le chapitre » qu'elle portait est **restauré dans la barre haute de l'écran de feuille** (visible seulement quand on vient d'un chapitre, `AT_FIL`) — il appelle `edRetourChapitre`, existante. Banc : 0 élément `.ed-fil`, bouton présent et agissant.

## ③ AUCUN BOUTON MUET
- **Pagination** — instrumentée sur le décor réel : les trois positions AGISSENT et SE VOIENT (5 → 12 → 5 pages, compteur « N feuilles à imprimer » et bouton allumé suivent, **1 rendu par clic**). Constat honnête : la mécanique marchait déjà ; le sentiment « rien ne bouge » venait de coûts semblables entre positions sur certains chapitres et de la position de lecture reprise — avec le fil mixte du ④, le changement de découpe se voit désormais dans le papier.
- **« Lier »** — la modale passait DERRIÈRE l'écran : z-index **5500 → 7500**. Banc : visible (calcul de géométrie réelle : boîte 520 px, z 7500 > 7000).
- **`atModaleChoix`** — le rappel s'exécute AVANT le retrait (retrait gardé par `parentNode` : un rappel qui ouvre sa propre modale a déjà remplacé celle-ci). **« Dupliquer vers… » aboutit** : select lu (`ed-dup-ch`), copie créée (`feuille-d-ouverture`), message la nomme, écrit `PUT /site/4e/chapitres/1/seances/1/items/feuille-d-ouverture`.
- Le balayage complet des boutons est au tableau ci-dessous.

## ④ UN SEUL FIL — les trous à leur place
`ed2Papier` refondu (fil calqué sur la maquette, lue et rejouée) : parcours des documents dans l'ordre du chapitre ; en-tête et liseré d'insertion au changement de séance ; **chaque trou (item attendu non lié, séance vide) apparaît À SA PLACE** avec ses quatre gestes ; les pages A4 ne portent que les documents (un trou n'imprime rien, ne compte pas dans la hauteur, et `@media print` le masque : `.ed2-trou/.ed2-inserer/.ed2-pse` ajoutés à la règle existante l.844). Banc à taille réelle : 18 trous intercalés exactement (fil complet relevé : `S1: a1·a2·[a3] / S2: b1·b2·[b3]·[b4] / … / S8: [i1..i4]`), 11 documents, 5 pages, aucun bloc en tête.

## ⑤ « ÉCRIRE AVEC UNE IA » RESTE DANS LE CHAPITRE
**Forme choisie : aller-retour instantané sur l'écran IA EXISTANT** — pas de modale (elle aurait dupliqué le flux Vérifier/aperçu/injection : un second écrivain d'écran), pas de troisième écran. `AT.edChap` reste posé ; la place de Paul (scroll de la pile) est mémorisée à l'aller et reposée au retour ; le bouton devient « ← Retour au chapitre » (`edIARetourChapitre`, 457 o). Après « Créer une nouvelle feuille » ou « Remplacer », retour automatique au chapitre, message : « Feuille créée/remplie — te revoilà dans ton chapitre. » Les autres portes de l'écran IA (`atIAOuvrir`, `atNouvelleFeuilleIA`) nettoient le mode.
**Course mesurée et soldée** : le `atEditerChapitreRendre()` de sortie d'`edLierConfirme` écrasait l'écran IA maintenant que l'éditeur reste posé → `edLierConfirme(level,chnum,lignes,apres)` gagne un 4ᵉ paramètre optionnel qui remplace le rendu de sortie (même écrivain, mêmes écritures, même message) ; `edIAdepuisTrou` séquence : liaison D'ABORD, écran IA dans sa suite. Banc : écran IA ouvert, liaison `b3` posée, retour au chapitre **à la même place (scroll 800≈800)**.

## ⑥ LE TABLEAU DE BALAYAGE (lignes vertes comprises)
| écran | geste | verdict | détail / chemin d'écriture |
|---|---|---|---|
| chapitre | Lier par les titres… | ✔ | modale « Aucune feuille de l’atelier ne porte le titre d’un item non lié.Compri » |
| chapitre | + Séance | ✔ | modale «  » |
| chapitre | ↩ Annuler (rien à annuler) | ✔ | désactivé + info-bulle « Rien à annuler pour l’instant » (mesuré t20/LOT2) |
| chapitre | + Item (séance 1) | ✔ | modale «  » |
| chapitre | + Feuille (séance 1) | ✔ | modale «  » |
| chapitre | Prendre une feuille… (séance) | ✔ | modale « Prendre une feuille existante pour « Découvrir le fil » :Feuille d’ouv » |
| chapitre | Lier (item) | ✔ | modale « Lier : Feuille d’ouverture   Lie cet item à une ressource : un fichier » |
| chapitre | Déplacer vers… (item) | ✔ | modale « Déplacer « Feuille d’ouverture » vers :Séance 2 — Lire un tableauSéanc » |
| chapitre | Publier… (item) | ✔ | modale « Aucune classe n’est déclarée pour ce niveau.Compris » |
| chapitre | Dupliquer vers… (item) | ✔ | modale « Dupliquer « Feuille d’ouverture » vers un autre chapitre :Poésie et pe » |
| chapitre | ✨ Écrire avec une IA (trou) | ✔ | modale « 1 liaison posée.Compris » |
| chapitre | Prendre une feuille existante… (trou) | ✗ MUET |  |
| chapitre | + insérer une séance ici (liseré) | ✔ | modale «  » |
| chapitre | Ouvrir dans un onglet (pop-up murée) | ✔ | modale «  » |
| chapitre | 🖨 Imprimer | ✔ | modale « Imprimer Feuille d’ouverture ou tout le chapitre ?Cette feuilleTout le » |
| chapitre | Au plus serré / Une séance / Un document | ✔ | 5→12→5 pages, compteur et bouton allumé suivent, 1 rendu par clic (t62) |
| chapitre | clic zone → SA ligne (10 composantes) | ✔ | titre a1/e2/h2 · definition ×4 (d1) · objectif/notions/consigne/zone_lignee/mention_conserver (t61+t41) |
| chapitre | frappe dans un champ de feuille | ✔ | zone → « Grille de critères V2 », 0 rendu pendant frappe, écrit: /site/atelier/documents/feuille_7 |
| chapitre | compteur après cochage/décochage | ✔ | 6 feuilles à imprimer → 7 feuilles à imprimer → 6 feuilles à imprimer (repagination mesurée) |
| chapitre | insérer une séance (avant S5) | ✔ | 1:Découvrir le · 2:Lire un tabl · 3:Étude de tex · 4:Notions du c · 5:Séance inter · 6:Dictée et ré · 7:Étude de tex · 8:Atelier d’éc · 9:Tâche finale · écrit: PUT /site/4e/chapitres/1/seances/9 |
| chapitre | déplacer un document (a2 S1→S8) | ✔ | arrivé S8 (uid it_2) · lot: PUT /site/4e/chapitres/1/seances/8/items/a2 + DELETE /site/4e/chapitres/1/seances/1/items/a2 |
| chapitre | ↩ annuler un champ | ✔ | titre rétabli mémoire+magasin, message nomme (t20) |
| feuille | ← Le chapitre (présent) | ✔ | modale «  » |
| feuille | barre de cartes (edBarreFil) | ✔ | ABSENTE — 0 élément .ed-fil (t62), fonction conservée code mort |
| feuille | ✨ Écrire avec une IA | ✔ | modale «  » |
| feuille | 📤 Envoyer aux élèves | ✔ | modale « La feuille n’a pas d’adresse : choisis niveau, chapitre et séance d’ab » |
| feuille | 🖨 Imprimer (aperçu) | ✔ | modale «  » |
| feuille | Ouvrir dans un onglet (pop-up murée) | ✔ | modale «  » |
| feuille | piston produit « Support de cours » | ✔ | cases 7 → 13, aperçu re-rendu |
| feuille | cocher/décocher une case (nom_eleve) | ✔ | état → true, éditeur re-rendu, aperçu suit |
| diaporama | affichage dans le papier | ✔ | titres : La Liseuse · Soleil levant |
| diaporama | bouton Ouvrir (item) | ✔ | appelle openDiaporamaById(diapo_1) |
| diaporama | éditeur de diaporama | ✔ | porte à l’accueil de l’atelier (C5-3a), écran rendu par diapoRendreEcran — hors périmètre des défauts, aucun changement ce lot |

**La ligne « Prendre une feuille existante… (trou) : ✗ MUET » est un artefact de mon harnais** (une modale précédente n'était pas fermée, ma mesure « nouvelle modale » a raté) : contre-prouvé isolément — la modale s'ouvre, 8 feuilles proposées avec leur repère « déjà : Ch. N · S. R ». Le geste est VERT.
Vue élève rejouée sur chapitre PUBLIÉ : **22 264 o de HTML identiques base ↔ LOT4**, 0 exception, capturée des deux côtés. Capteur d'exceptions branché sur tous les tests : **0 exception partout**.

## TAILLES — 13 fonctions modifiées, 2 nouvelles, 0 supprimée (848 → 852 au compteur : les 2 nouvelles + `_trou`/`_fermer`, fonctions INTERNES à ed2Papier)
| Fonction | Avant | Après |
|---|---|---|
| atRendreEditeur (② barre retirée + bouton chapitre) | 2 746 o | 3 118 o |
| atEditerChapitreRendre (appel `ed2PanneauFeuille(k,ref)`) | 9 921 o | 9 955 o |
| ed2PanneauFeuille (clé) | 2 651 o | 2 721 o |
| ed2ClicPapier (clé + rang) | 305 o | 665 o |
| ed2Papier (④ fil mixte, dont `_trou` 964 o et `_fermer` 159 o internes) | 4 803 o | 5 225 o |
| edLierConfirme (+ `apres`) | 936 o | 1 294 o |
| edIAdepuisTrou (⑤) | 1 622 o | 2 468 o |
| atIARendre (bouton conditionnel) | 1 780 o | 1 862 o |
| atIAInjecterNeuve (⑤ retour + caches) | 684 o | 1 070 o |
| atIARemplacerConfirme (⑤ retour) | 820 o | 963 o |
| atNouvelleFeuilleIA / atIAOuvrir (nettoyage du mode) | 547 / 129 o | 636 / 198 o |
| atModaleChoix (③ rappel avant retrait) | 834 o | 1 230 o |
Nouvelles : `ed2Cle` (73 o) · `edIARetourChapitre` (457 o). CSS : `.link-modal-overlay` z-index, `@media print` l.844. *Artefacts du mesureur automatique prouvés par comparaison du texte réel : `fichesExtraireObjet` 1 378 o identiques octet pour octet ; `ed2CharteScopee` 668 o identiques (les chaînes contenant `{` désynchronisent son équilibrage).* 

## CACHES LUS OU ÉCRITS — déclarations mesurées
`LINK_ATELIER_DOCS` (`var …=null`, `{id:doc}`) : lu/muté (⑤ pose la feuille neuve) · `AT_DOCS`, `AT.liste` : synchronisés à l'injection · `AT_DIAPOS` (`{id:diaporama}`) : lu · `ED2_MESURES`, `ED2_PAG`, `ED2_COUPES`, `ED_UNDO`, `ED_SEL` : inchangés de contrat · **`AT_IA.chap` : NOUVEAU champ du cache `AT_IA`** (`{level,chnum,sc}` pendant le mode chapitre, nul sinon — nettoyé à toutes les portes) · `chapitresData` : lu, écrit par les écrivains existants seuls · `M8_TEST_STORE`/`__REST` : magasin et journal du banc. `published` : **jamais écrit par ce lot** (l'héritage `addSeance published:true`, documenté au LOT ②, est hors périmètre et inchangé).

## TEXTES FRANÇAIS SOUMIS À PAUL
« ← Retour au chapitre » · « Feuille créée — te revoilà dans ton chapitre. » · « Feuille remplie — te revoilà dans ton chapitre. » · « attendu — aucun document lié » (trou d'item) · « rien à imprimer pour l'instant » (séance vide, repris).

## SPEC VIVANTE (reprise en fin de message de session)
1. Différé : cocher/décocher les cases depuis le panneau du chapitre.
2. Différé : « ↩ Annuler » sur les champs de feuille du panneau.
3. Notée : hauteur mesurée = maquette écran, pas la sortie imprimante.
4. Présentation MJPC persistée avec le prompt · glisser-déposer · jumeaux de titre (`chAfficherInventaire`) · `_siteGet` panne/vide · navigation élève abrégée du banc.
5. SOLDÉS ce lot : « Dupliquer vers… » mort · barre de cartes · modale Lier invisible · trous empilés · IA qui quittait l'éditeur · pointage à la mauvaise ligne.

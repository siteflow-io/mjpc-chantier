# DICTÉE — L'ÉCRAN DE CORRECTION · L15h-1 — le type C (accent / majuscule / trait d'union) et le reclassement À BLANC

*Exécutant du complément L15, livraison **L15h-1** (dette n°12 · 126). Le reclassement réel (L15h-2) attend que Paul ait rayé le rapport et dit « ok ». Rien n'est promu.*

## Ce que ça change pour la classe
- **1. Un nouveau type, « C »** : les accents aigu, grave, circonflexe, tréma, la majuscule, le trait d'union ; **jamais la cédille** (L), **jamais un accent grammatical** (a/à, la/là, ou/où, du/dû, sur/sûr : G). **Au Brevet, il entre dans le forfait** avec la ponctuation (0,5 par 4, plafond 2) ; dans un profil (L15g), à l'unité ou au forfait selon son réglage (Préparée : 0,5).
  - **Mode rapide** : la touche **C** (mesurée libre : aucune lettre C n'était prise) et le bouton **« C Accent / maj. »** ; **mode texte** : l'entrée **« C »** au menu (et la touche C quand le menu est ouvert) ; **la recopie est demandée**, comme pour G et L ; ses formes fautives sont capitalisées (L10) et listées par type (L16a) ; la bascule de L16a reste entre G et L.
  - Sa couleur (orange) et sa légende : **« Accent, majuscule ou trait d'union »** ; **la fiche de l'élève** nomme chaque C **« Accent », « Majuscule » ou « Trait d'union »** (les mots de Paul), et sa ligne de compte ajoute « n accent, majuscule ou trait d'union » ; **aucune phrase d'aide pour le C sur la fiche** (Paul n'en a pas donné) ; le bilan compte les C ; l'aide « ? ».
  - **Une phrase devenue inexacte, laissée telle quelle (à trancher par Paul)** : la fiche décrit le L par « Orthographe, accents, majuscules… ».
- **2. Le reclassement, À BLANC** (ci-dessous) : une erreur **L** dont la recopie, une fois **ces seuls signes** retirés, est le mot attendu → proposée en **C** ; jamais si une lettre est en plus, en moins ou changée, s'il y a une cédille, si c'est un homophone grammatical, ni une erreur L sans recopie. **Rien n'est changé au hub.** Paul raye ce qu'il garde en L, dit « ok » → **L15h-2** reclasse (corbeille d'abord, `reclassement-accents_<hhmmss>_<clé>`, compté), recalcule et republie les objets de L10 avec leur nouveau type.
- **3. Un seul type par mot, toujours** (la seule fonction de note, L15g).

## Le fichier
- Base **6.7.0-L15g-c en ligne** (899 929 o, md5 `4b5ad28ffb0013594730dd7222947cd0`, vérifiée à la commande) → **6.7.0-L15h** : **903,274 o** (+3,345), md5 `a5d6a057018c61a741a518568998a1c7`.
- `TYPE_STYLE.C`, `TYPE_ORDRE`, `TYPE_COST`, `TYPE_COST_BREVET` ; `reclassableEnC`, `signesCL15h`, `sousTypeCL15h`, `HOMOPHONES_GRAMMATICAUX_L15H` ; `fastMark`, `selectType` (et `markError`, le code mort de la dette 97) ; les touches ; les boutons ; `formesSynchroniser` et la reconstruction de L10 ; `copieRecopiee`, `recopiesManquantes`, la file des recopies ; la bascule (G/L seulement) ; la fiche de l'élève (le libellé, la ligne de compte) ; l'aide. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.
- *L15i (déposée, partie de L15g) sera reprise sur la dernière version promue, dans l'ordre du complément (après L15.1).*

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L15h1_geste.py`** (par le geste, 8 vérifications) : **la règle** (11 cas : « eleve »/élève, « Paris »/paris, « peut-etre »/peut-être, « ce-là »/cela, « elevé »/élève → C ; « facon »/façon, « a »/à, « ou »/où, « sur »/sûr, une lettre changée, une recopie vide → jamais) ; **le forfait Brevet** : 4 C → 0,5, 9 C → 1, 9 C + 10 P → 2 (le plafond) ; Préparée : 3 C → 1,5 ; **le menu du mode texte** : « C Accent / maj. (forfait) », la touche C pose l'erreur avec sa recopie ; **le mode rapide** : le bouton (sur un mot sans erreur) et la touche C ; **les formes de L10** créées pour C ; **la fiche de l'élève** (le geste « Une fiche », son onglet) : au verso « Majuscule », « Accent », rien de technique ; 0 erreur.
**`rapport_L15h1.py`** : le rapport à blanc, calculé **par les fonctions mêmes de l'app** (`reclassableEnC`, `computeNote`, `marquerAmenage`) sur les données du hub lues en lecture seule.
**Accordés** (les versions d'avant jointes) : `banc_L12_geste.py` (le tableau du mode rapide : + « C ») ; `banc_L11_geste.py` (la feuille de l'élève : les règles de style de la couleur du C ne comptent pas, seul le texte).
**Banc unique sur L15h-1 : VERT, 0 échec, 36 étapes** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, L15c, L15c-b, L15c-c, L15c-d, L15d, L15e, L16a, L15f-b, la déconnexion, L15g, L15h-1, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`C1-rapide.png` (le bouton et la touche C) ; `C2-fiche-eleve.png` (le verso de la fiche : « Majuscule », « Accent »).

---

# L15h-1 — le reclassement en C, À BLANC (rien n'est changé)

*Calculé le 05/10 par l'app elle-même (ses fonctions `reclassableEnC`, `computeNote`, `marquerAmenage`) sur les données du hub, lues en lecture seule. Aucun nom : les copies sont numérotées dans l'ordre de leurs clés (le même ordre à chaque calcul).*

**La règle** : une erreur **L** dont la recopie, une fois retirés **les seuls** accents aigu, grave, circonflexe, tréma, la majuscule et le trait d'union, est le mot attendu → proposée en **C**. Jamais : une lettre en plus, en moins ou changée ; une cédille ; un homophone grammatical (a/à, la/là, ou/où, du/dû, sur/sûr) ; une erreur L sans recopie.

**Ce que tu fais** : tu rayes ce que tu gardes en L (une ligne entière, ou un mot), tu dis « ok » ; L15h-2 reclasse le reste (corbeille d'abord, compté) et recalcule.

| Dictée | Profil | Erreurs L recopiées | Reclassables | Copies | Notes qui changent |
|---|---|---|---|---|---|
| Dictée brevet blanc 3E — 3E Charles de Gaulle | Brevet | 0 | **0** | 0 | 0 |
| Dictée n°1 préparée, "Les travaux de Paris" — 4_hugo | Préparée | 77 | **9** | 5 | 0 |
| Dictée n°1 préparée, "Les travaux de Paris" — 4_turing | Préparée | 84 | **3** | 2 | 0 |
| Dictée n°1 type brevet (avec révisions), extra — 3_dylan_bob | Brevet | 81 | **11** | 8 | 5 |
| Dictée n°1 type brevet (avec révisions), extra — 3_franklin_aretha | Brevet | 64 | **4** | 4 | 3 |
| Dictée n°2 Charles Baudelaire — 3E Charles de Gaulle | Brevet | 0 | **0** | 0 | 0 |

*Mesuré par la conscience le 03/10 : Dylan 9 sur 7 copies, Franklin 4 sur 4, Hugo 8 sur 4, brevets blancs 3E / 4E : 0. **Reconfirmé ici le 05/10 : Dylan 11 sur 8, Franklin 4 sur 4, Hugo 9 sur 5, Turing 3 sur 2, brevets blancs 3E : 0** (les copies ont pu être reprises depuis le 03/10). En Préparée, C et L coûtent tous deux 0,5 : **aucune note ne change** ; au Brevet, C entre dans le forfait : les notes peuvent monter.*

## Dictée n°1 préparée, "Les travaux de Paris" — 4_hugo (Préparée)

| Copie | Mot attendu → recopie | Note avant | Note après |
|---|---|---|---|
| n° 8 | « eurent » → « eurênt » | 0/20 | 0/20 |
| n° 15 | « démolitions » → « demolitions » | 9/20 | 9/20 |
| n° 20 | « abattirent » → « abâttirent » | 0,5/20 | 0,5/20 |
| n° 21 (aménagée) | « commencèrent » → « commencerent » ; « chantier » → « chantiér » ; « équipes » → « equipes » ; « même » → « meme » | 15/20 | 15/20 |
| n° 24 | « égouts » → « egouts » ; « même » → « meme » | 0/20 | 0/20 |

## Dictée n°1 préparée, "Les travaux de Paris" — 4_turing (Préparée)

| Copie | Mot attendu → recopie | Note avant | Note après |
|---|---|---|---|
| n° 1 | « équipes » → « equipes » ; « même » → « mémé » | 0/20 | 0/20 |
| n° 8 | « égouts » → « egouts » | 1/20 | 1/20 |

## Dictée n°1 type brevet (avec révisions), extrait de la lettre de Fritz — 3_dylan_bob (Brevet)

| Copie | Mot attendu → recopie | Note avant | Note après |
|---|---|---|---|
| n° 2 | « goutte » → « goûtte » | 0/10 | 0/10 |
| n° 3 | « véhicules » → « vehicules » ; « Souville » → « souville » | 0/10 | 0,5/10 |
| n° 4 | « véhicules » → « vehicules » | 1,5/10 | 2/10 |
| n° 9 | « bas » → « bàs » ; « cela » → « ce-là » **(cas limite : trait d'union et accent à la fois — à trancher)** | 4,5/10 | 5,5/10 |
| n° 10 | « alerte » → « alèrte » ; « cela » → « celà » | 0/10 | 0/10 |
| n° 13 | « Souville » → « souville » | 0,5/10 | 1/10 |
| n° 16 | « kilomètres » → « kilomêtres » | 4,5/10 | 5/10 |
| n° 21 | « kilomètres » → « kilomêtres » | 0/10 | 0/10 |

## Dictée n°1 type brevet (avec révisions), extrait de la lettre de Fritz — 3_franklin_aretha (Brevet)

| Copie | Mot attendu → recopie | Note avant | Note après |
|---|---|---|---|
| n° 11 | « alerte » → « alèrte » | 4,5/10 | 5/10 |
| n° 17 | « véhicules » → « vehicules » | 6/10 | 6,5/10 |
| n° 20 | « véhicules » → « vehicules » | 0/10 | 0/10 |
| n° 28 | « véhicules » → « vehicules » | 5,5/10 | 6/10 |


## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une copie → mode rapide : sur un mot, la touche C (ou « C Accent / maj. ») → la case de la recopie ; mode texte : clic sur un mot → « C ».
2. Une dictée au Brevet : quatre C retirent 0,5 point en tout.
3. « Fiches élèves » → « Une fiche » : au verso, « Accent » / « Majuscule » / « Trait d'union ».
4. Le rapport à blanc ci-dessus : raye ce que tu gardes en L, puis dis « ok » pour L15h-2.

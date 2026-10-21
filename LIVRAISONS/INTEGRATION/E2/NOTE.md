# NOTE — E2, la classe et l'heure

*Contrat des quatre §9. Branche `integration`. Ce qui suit est mesuré ; ce qui n'est pas fait est écrit en dernière section.*

## Ce que ça change pour la classe

Paul ouvre l'emploi du temps. La case de l'heure dit la séance et **« heure n/N »** — et c'est vrai : une séance de trois heures commencée le lundi propose son **heure 2/3** à la case suivante, au lieu de passer à la séance d'après (dette 13 · 26, tranchée F2). « ▶ Ouvrir le pilotage et lancer » ouvre l'atelier sur le **Pilotage, visible** (dette 12 · 05), avec la vraie classe, le vrai créneau et cette heure ; « ✎ Préparer » ouvre l'Atelier sans rien lancer ni écrire. Sans passer par l'EDT, le bouton du Pilotage dit ce qu'il va lancer : **« ▶ Lancer avec 3E Charles de Gaulle · 08:57-09:52 · heure 2/3 »**.

En classe, tout s'enregistre au fil, sans un rang au hub : la copie de la classe (seulement quand elle change), le **journal**, l'**état** de l'heure et le **paquet de l'heure**. L'entête dit « 3E Charles de Gaulle · 08:57-09:52 · heure 2/3 » et le témoin **« ● déroulé intègre »** (ce que la classe a vu est au hub, bit pour bit). Le **minuteur d'activité** ⏱ (mm:ss, « Départ », « au tableau »), « Où on en est » par activité (**dévoilés / total, réel / prévu**), ⌫ = ◀.

**Cinq minutes avant le cahier de textes** (fin − 10 min), la fin de l'heure s'ouvre d'elle-même : les sept étapes de la maquette. « ■ Clore l'heure » y mène directement. La clôture écrit l'heure close, efface le pointeur, et la page va à la Relecture. Une heure close ne se rouvre pas.

Si la page se ferme en pleine heure : la bannière d'aujourd'hui (« Reprendre le cours »), ou la case de l'heure (« ▶ Reprendre le cours »), remonte **tout** — la diapo (même identité), ce qui a été dévoilé, le chrono (recalculé depuis le début réel), les paroles, les notes ; le temps où la page était fermée est une coupure mise à part. Le lendemain, l'heure suivante s'ouvre sur **« Où en est la classe »** (l'état réel, rien de simulé), et la copie de la classe est **fusionnée** avec la trame du jour (ce que la classe a modifié en classe est gardé). En **mode test**, rien ne part au hub (13 · 25).

## Les empreintes

| objet | md5 | taille |
|---|---|---|
| production de départ (`index.html` 8.74.0-③) | `ac792b28f40d3a0510e725fc4a6b6985` | 1 838 175 o |
| maquette de départ (p8-5g) | `62d9557ac8fedcfbdd8b157a2588cbee` | 605 996 o |
| `LIVRAISONS/INTEGRATION/index.html` à cette note | `50258efe316bf81154a48b496f92c26c` | 1 386 354 o |
| `dr/dr-classe.js` à cette note (ma coupe de la maquette posée par E1 + mon module) | `114a5eec0e9ee126b29f8d3464ebc3b3` | 151 357 o |
| `assemble/index.html` à cette note | `2e9009429c9ed3e9961cc87f4c2d32e6` | 2 163 920 o |

## Les fonctions du site touchées (nom, taille avant → après)

Appliquées par `E2/outils/brancher.py` (par le nom, idempotent, rejouable sur toute nouvelle version d'`index.html`).

| fonction | avant | après | ce qui change |
|---|---|---|---|
| `EDT_PILOTAGE_ELEMENTS` | 5 ids de la tête | `dr-zone, mur, volet, ong-pilotage` | les ids du bloc + l'onglet (sans lui, `voir` levait) |
| `edtLancer` | 2 285 | 2 248 | l'atelier s'ouvre (12 · 05) ; second temps → `dr_lancer(classe, créneau, début, heure, sur)` de la case ; « Préparer » = `edtLancer(cle, true)` |
| `edtQuandPilotagePret` | 417 | 545 | attend `window.dr` |
| `edtPeindreModale` | 6 517 | 7 394 | « ✎ Préparer », « ▶ Reprendre le cours » (heure lancée pas close), infobulles |
| `edtSeanceJouee` | 254 | 566 | F2 : jouée quand `faites ≥ sur` |
| `edtHeuresJouees` | — | 332 | nouvelle : les heures jouées d'une séance par la classe |
| `edtFileDAttente` | 254 | 461 | la file reprend aux heures déjà jouées |
| `_drCloreHeureRestee` | 1 718 | 135 | → `dr_cloreHeureRestee` (par `dr_lire`/`dr_ecrire`) |
| `_drCoursActifEffacerSi` | 354 | 115 | → `dr_coursActifEffacerSi` |
| `_drHeureCloseAu` | 239 | 232 | par `dr_lire` |
| `_drPaquetHeure` | 2 191 | 100 | → `dr_paquetHeure` (depuis le journal) |
| `_drTraceAuto` / `_drTraceReprendre` / `_drCopieAuto` | 427 / 1 727 / 707 | 55 / 65 / 55 | → `dr_*` |
| `sesCoursEcrire` / `sesCoursFermer` | 803 / 99 | 115 / 97 | → `dr_coursEcrire` / `dr_coursFermer` |
| `sesReprisePoser` | 794 | 813 | par `dr_lire` |
| `sesReprisePeindre` | 640 | 871 | infobulles |
| `sesReprendre` | 1 314 | 1 510 | → `dr_reprendre` (l'heure entière) |

**Ce qui tombe (33 fonctions, 39 129 o)** : `atDrJouerClic`, `atDrClore`, `atDrCloreFin`, `atDrClotureModale`, `atDrSuiviAppliquer`, `atVecu*` (6), `atT5*` (9), `_drVifInstaller`, `_drVifAller`, `_drPaletteOuvrir`, `_drPaletteBrancher`, `sesBrancherPilote`, `sesAppliquer`, `sesPollPilote`, `atDrMajUtile`, `sesPut`, `atDrReprendre`, `atTempsUtile`, `atDebutPropose`, `atCreneauSel` ; l'écoute F2 du pont ; les variables `AT_T5_VU`, `AT_T5_CHOIX`, `AT_T5_TIMER`, `AT_DR_VECU` ; l'écriture `C/vecu`.

**Déplacé du socle** (contrat §3, commit à part sans changement, puis corrigé) : `heureCahier` (la vraie fin − 5 min ; avant : la base = l'heure de lancement) et `tick` (la veille du T-5 à la seconde ; le chrono s'arrête à la clôture).

**Ma plage de la maquette** (`E2/outils/brancher-maquette.py`, chaque passage garde en commentaire ce qu'il faisait) : `lancerHeure` (l'entête réelle), la clôture de l'étape 7 (`dr_cloreFin` puis la relecture), `ouvrirFin` (N de la case, les notions de **cette** heure, l'étape 2 qui dit vrai sans activités, la fin de l'heure qui repart de l'étape 1), `clotureHtml`, l'ouverture de l'heure suivante (`dr_lancerSuite`, le temps utile réel), le récit final une fois l'heure finie, le mot aux absents gardé à la frappe, un id par bouton, la copie École Directe en HTML (l'outil d'E4).

## Le module `dr/dr-classe.js` (ce que j'ai écrit)

`dr_lancer`/`dr_lancerNeuf`/`dr_lancerSuite`, `dr_proposer`, `dr_reprendre`/`dr_reprendreCours`/`dr_edtReprendre`, `dr_restaurer`, `dr_adopterIdentites` + `dr_trameJouee`, `dr_fusionCopie`, `dr_heureContinue`, `dr_cloreFin`, `dr_cloreHeureRestee`, `dr_coursEcrire`/`dr_coursFermer`/`dr_coursActifEffacerSi`, `dr_copieAuto`/`dr_journalAuto`/`dr_etatAuto`/`dr_traceAuto`/`dr_traceReprendre` + la veille « au fil », `dr_paquetHeure`, `dr_versHub`/`dr_duHub` (aucun rang au hub), `dr_lireJoue` (pour E4), `dr_heurePoser`/`dr_heureJouee` + l'enveloppe de `dr_heureDe` (heures passées), `dr_entete`, `dr_tempsUtile`/`dr_debutPropose`/`dr_creneauPropose`/`dr_classeProposee`/`dr_heureProposee`/`dr_nbHeures`/`dr_slugDe`, `edtProchainesDe`, `dr_edtAssurer`, R3 (`dr_minuteur*`), R7 (`dr_avanceActivites`), R9 (`dr_empreinte`, `dr_temoinIntegre`), R19, « ■ Clore l'heure », les infobulles de la garde.

## Les bancs et leurs sorties

- **`E2/bancs/banc.mjs`** (banc unique, par le geste, faux hub) sur `assemble/index.html` : **VERT, 44 vérifications** (`sorties/banc-site.txt`, `sorties/1211/banc-E2.txt`) — B1 la case (heure 2/3 de la séance 0, Préparer sans écriture, le Pilotage visible, `cours_actif`, zéro erreur JS), B2 (lancer en un clic, ▶, parole, le paquet, `C/journal`/`C/etat` sans rang, **K15 par la liste exacte**), B3 (recharger → bannière → la diapo, le chrono, les paroles, les notes), B3b (la reprise par la case sur la séance 1, dont la trame n'a pas d'`eid` : même identité), B4 (T-5 à 09:42 de lui-même, les sept étapes, `H` clos, `cours_actif` effacé, l'heure close ne se rouvre pas, ▶ inerte après), B5 (deux créneaux, deux clés), B6 (mode test : zéro écriture ; le magasin de test porte `cours_actif` et l'heure n'est pas close, puis close après la clôture), B7 (la fusion copie/trame, par le geste, et ses quatre règles).
- **`banc.sh` de la conscience** (`sorties/1211`) : collisions **0** ; parcours P0-P12 **VERT** ; contrôles K1-K13 **108 vérifications, 0 échec** (K1 et K9 de mon mandat verts) ; parcours en mode test : un échec, **P5 « cours_actif »**, une question d'outil (il compare les clés du magasin, `cours_actif` y est déjà une clé lue par la bannière) — mesure jointe au journal, à la conscience.
- Pour mémoire : `banc-maquette.txt`, `banc-module*.txt` (le module sur la maquette avec un socle simulé, avant E1-a), `sonde-prod.txt` (la production jouée : les trois défauts de l'audit mesurés).
- **Captures** : `E2/captures/site/` (B1-lancer, B1-preparer, B2, B3-reprise, B4-T5, B4-close), `E2/captures/maquette/`.

## Ce que les relecteurs neufs ont trouvé (protocole du 12/10)

Deux sous-agents, avec le mandat, le contrat et l'assemblé seulement, sur le faux hub, ont joué mon territoire comme Paul : **31 trouvailles** (13 + 18), dont 7 bloquantes (4 + 3). Toutes celles de mon territoire sont corrigées et ont reçu leur garde au banc (détail point par point : `JOURNAL.md`, poussées 12 et 13) : le lancement par la case qui levait sans écrire le pointeur (B1), la reprise introuvable (B3b), la reprise qui perdait la diapo faute d'identités (B3b), la clôture par le lancement suivant sous une fausse clé, l'heure 2 sans diapo (B2, B7), l'étape 2 qui mentait, le récit jamais « relu », l'heure de fin fausse, l'échéance impossible, le mot aux absents perdu, le chrono après la clôture, les rangs `si`, la copie réécrite à chaque ▶, l'entête coupée, les infobulles. Une trouvaille ne s'est pas reproduite (la touche 2 du VIF). Hors de mon territoire, transmises : la colonne et le centre qui ne suivent pas la même séance, « 46/50 » en dur dans « Où on en est », les textes de chantier montrés à Paul (E1) ; le mode test qui ne survit pas au rechargement (le transport, à la conscience) ; `C/scene` porte `si`/`di` (E3, tranché : en repli).

## Ce qui reste — rien de caché

1. **P5 du parcours en mode test** reste rouge pour une raison d'outil (ci-dessus) : à la conscience.
2. **La copie de la classe et la trame en mémoire** : en classe, la maquette lit `seance().ecrans`, qui est la trame de préparation en mémoire ; les modifications faites en classe et la continuation d'heure (`heure` posée aux écrans non vus) y vivent. Si le socle enregistrait la trame après une heure de classe, elles iraient dans `B/deroule`. Je ne l'ai pas vu se produire (E1 n'écrit la trame que sur modification en préparation), mais rien ne l'interdit par construction : **à E1** (que `dr_vueSeance` lise `dr_trameJouee()` en classe).
3. **`dr_heureDe` est enveloppée**, pas réécrite : si E1 change sa fonction, l'enveloppe la garde ; à fondre par E1 s'il le souhaite.
4. **`edtProchainesDe`** ne voit que les cases de la grille (pas les heures ajoutées à la main) et rend vide tant que l'EDT n'est pas chargé ; je le charge au lancement.
5. **Les activités** : la trame réelle n'en a pas (contrat §12.5) ; la fin de l'heure décide donc par diapo continuée, pas par activité — les quatre sorts de la maquette n'ont rien à décider tant que le prompt de préparation ne pose pas `activites`.
6. **Le registre** : dettes 13 · 26 (F2) et 13 · 27 (la reprise) déclarées par la conscience ; réglées dans le fichier intégré (B1, B3, B3b) — à fermer au registre à la promotion.
7. **Les dettes 12 · 05** (réglée, B1) et **12 · 07** (N vient de la case, contrat §12.5 — la frontière d'heure posée par Paul dans la trame reste à faire avec le prompt de préparation).

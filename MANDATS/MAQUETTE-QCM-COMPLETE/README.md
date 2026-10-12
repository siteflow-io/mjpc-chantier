# La maquette complète du QCM — la livraison de l'exécutant

*Mandat : `MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md`, fait d'une traite, étapes 1 à 5 ; puis les compléments 1 à 4. Branche `maquette-qcm` (et `claude/bold-bohr-zxodms`, la même), dossier `MANDATS/MAQUETTE-QCM-COMPLETE/`.*

## Complément 4 — fait

*Complément : `MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-4.md`, raccourci par son avenant (`MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-4-AVENANT.md`), fait d'une traite sur `maquette-qcm`, étapes A à C. La v1 à la v8 restent telles quelles, avec leurs md5. **La livraison : `maquette-qcm-v9.html`** (md5 `64828367cb3728e8f97b8177d5418c11`), **169 scènes** et **3 273 destinations** atteintes par le geste ; banc final `sorties/banc-final-v9.txt` : **25 282 vérifications, zéro défaut** (les vérifications 1 à 9 et les gardes 1 à 15 sur les 169 scènes ; les gardes 16.1, 16.2, 16.4, 17, 18, 19 et 20 sur les 3 442 pages) ; les contrôles de la conscience : `sorties/controles-conscience-v9.txt`, **110 contrôles, zéro échec** ; les gardes 16 à 20 jouées sur la v8 avant toute correction : `sorties/gardes-16-a-20-sur-v8.txt` ; la lecture : `sorties/lecture-v9.md` (une ligne par écran changé, par écran qui devait changer et par voisin). Captures refaites (`captures/`, 169 scènes, 167 images distinctes : les doublons voulus de `capture.js`).*

### Ce que l'avenant a retiré

- **La garde 16.3** : les gardes 9 à 15 ne sont pas rejouées sur les destinations, seulement sur les 169 scènes (elle reste dans le banc, `G16_915=1`, et n'est pas jouée).
- **Au §4, la lecture de chaque capture et les scripts de la conscience rejoués** : la lecture porte sur les écrans que le relevé de la conscience (`AUDITS/CONTROLES-QCM/releve.js`) trouve changés entre la v8 et la v9, ceux qui devaient changer et n'ont pas bougé, et leurs voisins (`sorties/ecrans-changes-v8-v9.txt`, par `compare.py`) ; à leur place, les contrôles de la conscience (`controles.js`, non modifié, md5 de `EMPREINTES.md5`), à zéro échec.

### Les neuf corrections, et ce qui les montre

| Correction | Ce qui est fait | Scènes et destinations |
| --- | --- | --- |
| **1 — les résultats de chaque séance** | Un seul tableau, celui de `c-resultats` (`ResultatsSeance`, `src/c4-seances.js`), pour toutes les séances, rempli par le scénario (`SCN.resultat`, `aLireSeance`, `retiresSeance`) : les questions de la séance, la note, sur 20, la maîtrise, une colonne par compétence (« 🧩 — », vide, pour les évaluations qui n'en ont pas, `CH1` et `JB`), l'autonomie, « À lire sur la feuille », le PDF et le CSV. La séance sur papier a ses trois colonnes et sa note, lue à partir du soir du 09/10. Chaque nom ouvre la fiche à sa séance (`&seance=`). **1.5** : l'évaluation de 3e est complétée le 09/10 à 12:45 (`S.EV3_COMPLETEE` : son chapitre, ses compétences, ce que chaque question vérifie, ses temps), « à compléter » avant. | `c-resultats&seance=S3E`, `PAP`, `CH1`, `JB` ; `c-fiche&eleve=…&seance=…` (et `c-fiche-garde`, `c-fiche-retire`) ; `c-evals` (moment `PREP` : à compléter) contre `c-seances` (le soir) |
| **2 — le PDF de la séance** | `pdfSeance(id, k)` construit le PDF de la séance d'où on l'ouvre, avec la mise en page de `gen632.js` ; pour la séance de 3e, c'est le PDF figé de la v8, au caractère près (26 421 caractères). | `x632-pdf&seance=DEMO`, `S08`, `PAP`, `CH1`, `JB` ; `x632-pdf` (inchangé, voulu) |
| **3 — l'appel du rattrapage** | L'appel se calcule pour la séance : ses élèves, ses absents, ses tablettes ; « 3 ESSAI — 1 élève », « 0 absent sur 1 », « YVON Adam reste seul : tablette 1. », sur la carte du rattrapage (moment `RATT:appel`, 12/10 10:02). Les séances rouvertes ont aussi leur appel (n° 366). | `c-appel&seance=RATT`, `c-appel&seance=CH1`, `c-appel&seance=JB` |
| **4 — la démo à la question 1** | `t-demo-q` se calcule à son moment (`DEMO:Q1:R`) : question 1 / 3, « Facile », 18 s. | `t-demo-q` |
| **5 — le côté du tour** | `coteDuTour(qi, tour)` ; « question 2, 2e tour (moitiés de gauche) ». | `c-interrompue` |
| **6 — Adam seul** | `ChronoSaisie(v, total, seul)` : « Temps de réponse », le libellé de la v7. | `t-corr-seul` |
| **7 — la ligne du téléphone** | `.tel-st-l` en blanc ; et les 2 535 contrastes que la garde 19 mesure aux pixels sur la v8, tous relevés au-dessus du seuil (n° 369). | `p-corr-avant`, `p-corr-apres`, `p-autonomie`, `p-eleve`, `p-reponse`, `t-bilan`, `e-bilan-lou`, `t-corr-q2-apres` |
| **8 — la règle du désaccord** | Revenue, « ☝️ » compris, dans les moitiés où elle était seule ; retirée seulement après « ☝️ C'est ta seule question de désaccord. ». | `t-coeval`, `t-coeval-daccord`, `t-coeval-ecrit`, `x610-6-coeval-laquelle`, `x610-7-coeval-ecrit` |
| **9 — ce que les gardes trouvent** | Voir plus bas. | — |

### Les destinations (garde 16)

L'exploration (`banc/explorer.js`) joue chaque geste de chaque page, depuis les 169 scènes, jusqu'à ce qu'aucun geste ne mène plus nulle part de neuf : **3 273 destinations distinctes** (`sorties/destinations-v9.txt`), et **1 433 adresses** qui montrent, au caractère près, l'écran d'une page déjà relevée (jouées par cette page). Sur la v8 : 3 149 et 1 330 (`sorties/destinations-v8.txt`).

### `banc/existant/eleve-v7-v9.json`

Les lignes vues par l'élève qui diffèrent de la v7 (garde 20), chacune nommée avec sa raison : **1 047 lignes** — donnée du scénario 605 (dont 585 sur les destinations des vues d'élève : la v7 ne lit pas les paramètres de l'adresse et montre sa scène sans eux), émoji décoratif retiré 331, geste qui se voit 57, retouche 778 18, typographie 10, élément de la 7.7.1 10, texte lu en entier 10, correction 4 6. Les lignes du chrono d'Adam seul (correction 6) et de la règle du désaccord dans les moitiés où elle était seule (correction 8) en sont retirées : la v9 y est la v7.

### Ce que les gardes et la lecture ont trouvé (journal, n° 356 à 377)

- **Les neuf défauts de l'audit**, chacun trouvé sur la v8 par une garde (`sorties/gardes-16-a-20-sur-v8.txt`, en tête) ; n° 356 à 364.
- **La garde 18** : `c-qr` toujours à la question 1 (une affectation `var ST_Q1T1` de `etape2.js` gagnait sur la déclaration de `c3-scenes.js`) ; l'appel des séances rouvertes (`CH1` : Lou présente, `JB` : Adam barré) ; « Phase RÉFLEXION » en mode test au moment B ; le tableau de la question rouverte sans son énoncé ; n° 365 à 368.
- **La garde 19** : 2 535 contrastes sous le seuil, mesurés aux pixels, sur des fonds que la garde 14.3 sautait (dégradés) ; n° 369.
- **La lecture** : Noah, parti après la question 7, co-évaluait la question 10 (la séance disait « 5 feuilles à lire » ; c'est 4) — garde 18.5 ; et, sur la v9, « 🤔 1 pensent » (n° 370 et 374).
- **Le banc et la mise en page** : le tableau de 3e trop large à 1366, la moitié de droite de `x610-6` de 21 px trop haute une fois la règle revenue, la colonne « 🧩 — » que le contrôle C1 de la conscience demande ; l'exploration, qui aurait pris des heures sans la remise à zéro sur place et l'empreinte des écrans ; n° 371 à 375.
- **Le banc final** : la garde 16.4 comparait le tableau de l'écran du moment (le fond d'une fenêtre, la console en cours) à la scène nue ; elle compare désormais à la scène ouverte au même moment, et trouve toujours le défaut 1 sur la v8 (`sorties/garde-16-4-reference-au-moment-sur-v8.txt`) ; « 🤔 1 pense » sans classement ni infobulle (la règle `pensent?`) ; n° 376 et 377.

### Les écrans qui devaient changer et n'ont pas bougé (selon `compare.py`)

`x632-pdf` (la scène est le PDF de la séance de 3e, qui doit rester celui de la v8 au caractère près ; ce qui change, ce sont les PDF des autres séances, des destinations) et `c-rattrapage` (l'écran était juste ; ce qui change, c'est l'appel où mène « 🚀 Lancer le rattrapage »).

### Rejouer

`python3 build.py 9` (assemble la v9) ; `EXPLO=<cache> node banc/banc.js maquette-qcm-v9.html 5 sortie.txt` (tout : les vérifications 1 à 9, les gardes 1 à 20 ; sans `EXPLO`, l'exploration de la garde 16 se refait, deux heures environ) ; `node banc/explorer.js maquette-qcm-v9.html <cache.json>` (l'exploration seule, `LISTE=` pour la liste) ; `node banc/banc4.js maquette-qcm-v9.html sortie.txt` (les gardes 16 à 20 seules ; `G4SEUL=17,18`, `SEUL=<scène>`, `G16_915=1` pour la garde 16.3 que l'avenant retire) ; `GARDES=sans4` (tout sauf les gardes 16 à 20) ; `node AUDITS/CONTROLES-QCM/controles.js MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html <sortie>` (les contrôles de la conscience) ; `node AUDITS/CONTROLES-QCM/releve.js <maquette> <dossier>` puis `python3 AUDITS/CONTROLES-QCM/compare.py` (les écrans changés).

## Complément 3 — fait

*Complément : `MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-3.md`, fait d'une traite sur `maquette-qcm`, étapes A à E. La v1 à la v7 restent telles quelles, avec leurs md5. **La livraison : `maquette-qcm-v8.html`** (md5 `6675262e8c6892c2c29bb709048a6592`), **169 scènes** ; banc final `sorties/banc-final-v8.txt` : **21 833 vérifications, zéro défaut**, les vérifications 1 à 9 et les gardes 1 à 15, tout sur tout ; les gardes 9 à 15 jouées sur la v7 avant toute correction : `sorties/gardes-9-a-15-sur-v7.txt`. Captures refaites et regardées (`captures/`). **Plus de livret** (Paul, 14:19 : « le livret n'a plus de raison d'être maintenant qu'on a la maquette ») : Paul valide sur la maquette elle-même ; les livrets de la v5 à la v7 restent dans le dossier.*

### Les huit changements, et les scènes qui les montrent

| Changement | Ce qui est fait | Scènes |
| --- | --- | --- |
| **1 — à l'écran, ce qui sert à agir** | Les 569 textes que la maquette a écrits dans les vues de Paul sont classés dans `banc/existant/textes-console.json` : 268 données, 181 états, 43 alertes, **77 explications**. Les données, les états et les alertes restent ; **les 77 explications quittent l'écran : 66 vont dans l'infobulle de l'élément qu'elles expliquent (65 éléments, par exemple « ⏸️ Finir à une autre heure », « ⛔ Retirer le point d'autonomie », « 📱 Binômes proposés », « 🤖 Le prompt de création d'éval »), 11 dans le mode d'emploi, à leur section**. Quand l'infobulle est celle de la 7.7.1, elle reste mot pour mot et l'explication prend la bulle « i » posée à côté. Une fenêtre de confirmation garde une phrase ou deux. Plus aucun texte de maquette (« repliées pour la capture ») : ce qui est replié se déplie par le geste. | `c-lancer`, `c-pret`, `c-q1-tour1`, `c-autonomie-garde`, `c-finir-autre-heure`, `c-coeval-attente`, `c-reglages`, `c-mode-emploi`, `x627-3-editeur` |
| **2 — une infobulle sur chaque élément** | Écrites par composant (`src/c3-bulles.js`) : chaque type d'élément a sa fonction, qui lit l'état de la scène dans le scénario (la pastille d'une moitié dit l'élève et ce qu'il fait maintenant ; le chrono, à qui reste le temps ; la carte d'une question close dit « Question close »). **1 366 infobulles distinctes, posées sur 7 801 éléments** des vues de Paul (console et téléphone, 1366 × 768), plus celles des gestes ; les infobulles de la 7.7.1, d'`index.html` et de la dictée restent mot pour mot. Aucune infobulle de la maquette côté élève. Les bulles « i » s'écrivent dans la police et la casse de l'app, passent à la ligne, se placent dans la fenêtre (à gauche, à droite, vers le haut) et rien ne les recouvre ; les « i » de « 🧪 Mode test » et de « 🔓 Rouvrir pour un élève » ont leur bulle. | toutes ; par exemple `c-q1-tour1`, `x627-3-editeur`, `c-lancer` à 1366 × 768, `c-evals`, `p-reponse`, `c-bilan`, `m-classe-exclusions` |
| **3 — les évaluations et les séances rangées comme la dictée** | La démo en tête, puis 6e, 5e, 4e et 3e, toujours là, repliables, avec leur compte ou « vide pour l'instant », les mots et les gestes de la dictée ; puis « Sans chapitre ». Le tri reçoit « classe » : une évaluation se range sous chaque classe qui l'a passée, « Pas encore passée » sinon ; chaque ligne dit ses classes, les anciennes comprises. « Résultats » : les quatre niveaux, puis les classes, et le tri « classe, date, évaluation ». « 📋 Dupliquer » garde ce qui est rempli. | `c-evals`, `c-eval-corbeille`, `c-collage`, `c-seances`, `c-seances-lues` |
| **4 — chaque geste mène au bon endroit** | La destination d'un geste se calcule d'après son objet, le moment de la scène et l'appareil (`data-va` porte son objet : `&eleve=`, `&tab=`, `&q=`, `&eval=`, `&seance=`) ; une fiche ou une fenêtre s'ouvre sur place, remplie d'après l'objet cliqué. « 👁 », « 📺 », « ← Retour », « 🎯 Pilotage classe », les fermetures et Échap gardent le moment ; les gestes du téléphone restent sur le téléphone ; seuls six gestes changent d'appareil, et le déclarent. | `c-voir-tablette&tab=3`, `c-fiche&eleve=Lou`, `c-eval-corbeille&eval=…`, `c-parti&parti=Théo`, `p-eleve&eleve=Michel`, `c-interrompue` → « ▶️ Reprendre » |
| **5 — une seule séance, les mêmes chiffres partout** | `src/scenario.js` : la classe, les binômes, chaque réponse, chaque lecture, chaque geste de Paul avec son heure, le calendrier ; chaque chiffre, note, niveau, liste et date des scènes s'en calcule. Lou a 2 / 3 partout avant « Corrigé d'après sa feuille », 1 / 3 partout après ; un point retiré le reste jusqu'au « ↩️ Rendre ». L'heure du retrait de Hugo est celle que le scénario calcule pour cette scène, 10:23 (le complément écrivait 10:41 pour la v7) : elle est la même sur sa tuile, au téléphone, dans le bilan et dans la colonne « 🤝 Autonomie ». | `c-autonomie-retiree`, `c-bilan`, `c-resultats`, `c-resultats-rendues`, `c-fiche`, `t-bilan`, `e-bilan-lou` |
| **6 — tout se lit et tout s'atteint, aux trois tailles** | Les fenêtres hautes défilent à l'intérieur ; la liste du tableau tient en deux colonnes ; les tableaux tiennent dans leur carte à 1366 ; les classes de la maquette en 12 px au moins et contrastées ; les émojis décoratifs entiers ou absents ; les espaces insécables (devant « : ; ! ? » et « », entre un nombre et son unité, dans « Q 1 / 3 »), le prompt affiché compris ; les rangées de boutons alignées ; les tablettes simulées lisibles. | `x620-3-mode-test-en-grand`, `b-reponse`, `c-resultats`, `x610-9-telephone-alerte`, `c-reglages-prompt`, `x610-8-console-alerte` |
| **7 — le geste se voit** | L'éditeur change l'évaluation à l'écran ; côté élève, chaque clic s'allume ; le clavier de l'app tape ; ce qui a la main agit ; les menus appliquent leur choix ; « ✔ Marquer lue » change la pastille ; Échap ferme chaque fenêtre ; le glisser-déposer garde chaque tablette juste. « Que dit la feuille ? » coche un ou plusieurs choix, ou « Sa feuille ne dit aucun de ces choix ». | `x627-3-editeur`, `t-q1-b-michel`, `t-login`, `c-lancer`, `c-que-dit-la-feuille`, `m-emploi-du-temps-un` |
| **8 — les mots** | « séance » partout où Paul lit ; « ⛔ » ne veut dire que le point d'autonomie, « Trouvée au dernier moment » prend le ✓ orange ; les pluriels, les élisions (« d'ESNAULT Inès ») et les accords (« partie », « présente ») ; « 1re » dans les textes de la maquette ; un geste, un libellé (« ⛔ à Michel », « Fermer ») ; les quatre retouches côté élève du point 778. | `c-lancer`, `c-terminer`, `c-depart`, `p-corr-apres`, `t-corr-q2-lecture`, `t-corr-q3-apres`, `c-reglages-prompt` |

### Les lignes des relecteurs

Les 279 lignes confirmées (266) ou confirmées en partie (13) de `AUDITS/MAQUETTE-QCM-LECTURE-11-10/DEFAUTS-RELECTEURS.md` ont chacune leur entrée dans `DEFAUTS.md` (n° 54 à 332), avec la correction, sa place et la garde qui la vérifie : **254 corrigées, 25 jugées non fautives**, chacune avec sa mesure (une infobulle ou un texte de la 7.7.1 qui reste mot pour mot, avec sa ligne : « 🔍 Vérifier le format » l. 6597, « ont répondu » l. 7835, la bande du téléphone l. 5672, le bandeau de correction l. 7705… ; des pastilles qui sont déjà les classes et les couleurs de la 7.7.1). Les 34 lignes « existant » et les 12 « à trancher » ne sont pas des défauts de la maquette : les textes du site restent tels quels (§1.4), et « session » devient « séance » (changement 8).

| Classe | Lignes | Corrigées | Non fautives |
| --- | --- | --- | --- |
| C1 — le geste mène au bon endroit | 47 | 47 | 0 |
| C2 — le geste se voit | 17 | 17 | 0 |
| C3 — une seule séance, les mêmes chiffres | 55 | 51 | 4 |
| C4 — tout se lit et tout s'atteint | 62 | 57 | 5 |
| C5 — les infobulles | 46 | 42 | 4 |
| C6 — les textes | 52 | 40 | 12 |
| **Total** | **279** | **254** | **25** |

### Ce que les gardes ont trouvé d'autre

Jouées sur la v7 avant toute correction (`sorties/gardes-9-a-15-sur-v7.txt`), les gardes 9 à 15 retrouvent chacune les défauts connus du §3. En cours de route, elles et le banc ont trouvé aussi (journal, n° 333 à 355) :
- **le banc lui-même** : un `data-va` à paramètres pris pour une scène inconnue (1 803 vérifications), l'ouverture d'une fenêtre de la maquette prise pour une fuite, des boîtes du navigateur (`alert`, `print`) dessinées désormais dans la page ;
- **les gardes 3, 8, 9, 11 et 14** : les espaces insécables faisaient échouer des comparaisons littérales ; un arrondi pris pour un agrandissement ; des décorations coupées que la garde ne voyait pas ; des textes tronqués à 80 caractères ; un « « » seul en fin de ligne dans le prompt affiché ;
- **la garde 4** : la carte de « Mes évaluations » à 66 px pour l'étalon de 67 ;
- **la garde 10** : la bulle de « 🧪 Mode test » hors de la fenêtre (le `transform` du survol de `.btn-test` en faisait le repère), des bulles remises à leur place de repos par le défilement, 68 infobulles de la maquette sur les écrans d'élève, des infobulles sans phrase ou avec un mot du code (`edtRappelPlusTard`), la police de MJPC, une infobulle classée « existant » par la lecture qui n'est pas dans le site (« Où la clé est mémorisée ») ; elle connaît désormais les infobulles de la dictée et celles que les sources du site écrivent ou calculent ;
- **le banc final** : la vérification 5 du mandat (« un bouton grisé dit pourquoi », par son infobulle) contredisait la garde 10.5 côté élève ; elle ne la demande plus sur un écran d'élève, où l'écran dit lui-même pourquoi. Et l'infobulle de la 7.7.1 sur « 📄 Imprimer / Exporter mon bilan », retirée avec les autres, est revenue ;
- **la garde 1** : le retrait de « Question en cours » sur une question close, demandé par le complément, est inscrit avec sa citation, que la garde vérifie mot pour mot dans le complément ;
- **les captures relues** : un temps de 1 800 s coupé à « 180 » dans son champ (`c-fin-prevue`), et la rangée « Départ / Finir / Terminer » passée à gauche sous un long titre (`x610-8-console-alerte`, le cas du changement 6.8).

## Complément 2 — fait

*Complément : `MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2.md`, fait d'une traite sur `maquette-qcm`, étapes A et B. La v1 à la v6 restent telles quelles, avec leurs md5. **La livraison : `maquette-qcm-v7.html`** (md5 `6be84ea1fb636017ce7225bfa3556082`), **169 scènes** ; banc final `sorties/banc-final-v7.txt` : **19 222 vérifications, zéro défaut**, les vérifications 1 à 9 et les gardes 1 à 8, tout sur tout ; captures refaites et regardées (`captures/`) ; livret `livret-maquette-qcm-v7.pdf`.*

### Ce qui est corrigé, et la scène qui le montre

| Quoi | Ce qui est fait | Scènes |
| --- | --- | --- |
| **Défaut 7** — les boutons fermés de MJPC ne se voyaient pas fermés | Les 11 entrées du menu sans scène et « Code professeur » prennent l'aspect qu'`index.html` donne déjà à un bouton fermé (`.eli-btn:disabled`, l. 860 : estompé, la souris barrée). Leur raison, « Inchangé : cet écran reste celui d'aujourd'hui. », est portée par une enveloppe qui reçoit la souris : le bouton fermé ne la prend pas. « 📅 Emploi du temps » s'ouvre désormais sur sa scène. | toutes les scènes `m-…` |
| **Dette n°12 · 87** — le panneau prof borné à 1 100 px | Le panneau couvre toute la fenêtre, bord à bord, aux trois tailles de la console : ni marge, ni largeur bornée, ni coins arrondis. L'en-tête, le menu de 230 px et le contenu ne changent pas ; le contenu défile en hauteur. | toutes les scènes `m-…` |
| **Dette n°12 · 88** — ↻ ✕ hors de la carte | La grille de la ligne d'élève a une colonne par élément (le numéro, le nom, le ◆, « 🚫 Jamais avec… », le code, ↻ ✕) : ↻ et ✕ sont dans la carte, à droite, sur la ligne du nom, avec ou sans ◆. La v6 le faisait déjà, sans le dire : l'écart est désormais inscrit. | `m-classe-exclusions`, `m-exclusion-refusee` |
| **La rangée de l'emploi du temps** (n°12 · 212) | Une nouvelle scène, partie d'`index.html` (`edtPeindrePanneau`, l. 19794 à 19850, son CSS `edtPoserCss` copié dans `src/mjpc-edt.css`) avec les objets relus au hub (`MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT/`, md5 vérifiés à l'assemblage). Les lignes d'état sont recalculées avec les vraies fonctions : « 52 semaines · 7 périodes sans cours · 11 fériés · 30 jalons · 15 événements de classe », « 30 cases · 4 classes nommées », « 8 créneaux — … ». La rangée devient trois groupes, l'un sous l'autre : « Ouvrir l'emploi du temps » et sa case ; « ⤓ Sortir le JSON » (une case par objet, nommé en clair avec sa date, « Tout cocher », un seul bouton, fermé tant que rien n'est coché ; un objet : le geste d'aujourd'hui, « JSON de « calendrier » copié — 19717 caractères. » ; plusieurs : un seul JSON, chacun sous son identifiant) ; « 📋 Copier le prompt » (« Calendrier de l'année », « Grille de l'emploi du temps », avec le vrai nombre de caractères de la consigne et du JSON en service). Rien d'autre ne change dans la section. | `m-emploi-du-temps`, `m-emploi-du-temps-un`, `m-emploi-du-temps-tous` |

### Ce que la maquette change dans MJPC par rapport au vrai site, écart par écart

C'est la liste que le mandat de code reprendra. Elle est aussi dans `banc/existant/ecarts-mjpc.json`, que la garde 7 relit : toute règle de CSS de MJPC qui vise un élément du vrai site sans être sa règle d'`index.html` telle quelle doit y avoir son écart et sa raison.

| N° | Écran | L'écart | Raison | Pourquoi |
| --- | --- | --- | --- | --- |
| 1 | Élèves & codes | « 🚫 Jamais avec… » dans la ligne de chaque élève, juste après le ◆, avec ses camarades à cocher (au plus 3, la quatrième refusée avec la raison) ; ses règles de CSS (classes ex-…) sont nouvelles | point 585 | Les exclusions se règlent dans la console MJPC, sur la fiche de la classe, à côté des aménagements : pour chaque élève, « 🚫 Jamais avec… » ; au plus 3 par élève, la quatrième refusée (590). |
| 2 | Élèves & codes | La quatrième exclusion d'un élève refusée, avec la raison | point 590 | La garde minimum : au plus 3 exclusions par élève ; la quatrième est refusée dans MJPC, avec la raison. |
| 3 | Taxonomie | La section « 🧩 Les compétences » dans l'éditeur de la taxonomie, après l'arbre : les 28 compétences sous leurs 8 groupes, libellé officiel et libellé élève, sur le modèle des notions (classes m8tx-comps, m8tx-comp-cat nouvelles) | point 637 | Chaque compétence reçoit un libellé élève, réglé dans le même éditeur que les notions ; le libellé officiel reste pour École Directe et pour le PDF. |
| 4 | Panneau prof | Les 11 entrées du menu du panneau prof sans scène dans la maquette sont fermées (disabled), avec l'infobulle « Inchangé : cet écran reste celui d'aujourd'hui. » ; « 📅 Emploi du temps » s'ouvre sur sa scène | simulation déclarée | La maquette ne montre que les écrans que le cadrage change ; les autres restent ceux d'aujourd'hui, et un bouton qui ne mène à rien est fermé avec sa raison (protocole maquette, §2). |
| 5 | Élèves & codes, fiche de l'élève | « Code professeur » fermé dans l'encart de la clé, avec l'infobulle « Inchangé : cet écran reste celui d'aujourd'hui. » | simulation déclarée | La section « Code professeur » ne change pas : la maquette ne la montre pas, et le bouton qui y mène est fermé avec sa raison (protocole maquette, §2). |
| 6 | tous les écrans de MJPC | Les boîtes système de la vraie app (alert, confirm) et les fenêtres de _modaleConfirme sont dessinées dans la page, avec leur texte exact (classes alerte-… nouvelles) | simulation déclarée | La maquette n'ouvre aucune boîte système (vérification 6 du banc) : chacune est dessinée dans la page, avec son texte exact et ses boutons. |
| 7 | Élèves & codes | « 🖨 Imprimer » ouvre la page des codes de _printCodesClasse dans une fenêtre de la console, au lieu d'une fenêtre d'impression (classe codes-imprimes nouvelle) | simulation déclarée | La maquette n'imprime rien et n'ouvre aucune fenêtre : la page des codes, telle que _printCodesClasse l'écrit, se montre dans la console. |
| 8 | Panneau prof | « ✕ » du panneau prof revient aux Réglages du QCM | simulation déclarée | Dans la maquette, on entre dans MJPC par « Ouvrir la console MJPC → » des Réglages du QCM : la fermeture y revient. |
| 9 | tous les écrans de MJPC | Les données : la classe « 3 ESSAI », ses codes, ses exclusions, les fiches de Michel et de Lina ; rien n'est lu ni écrit au hub, chaque geste agit sur place | simulation déclarée | La maquette n'a ni réseau ni hub (vérification 6 du banc) ; seuls de faux élèves y paraissent (vérification 7). La taxonomie, elle, est la vraie, copiée avec son md5. |
| 10 | Panneau prof, Élèves & codes, fiche de l'élève | Les boutons fermés de la maquette (les 11 entrées du menu, « Code professeur ») prennent l'aspect qu'index.html donne déjà à un bouton fermé (.eli-btn:disabled, l. 860) : estompés, la souris barrée ; leur raison se lit au survol, sur une enveloppe qui reçoit la souris | simulation déclarée · CSS `.tprof-section-btn:disabled,.mjpc-act:disabled` | Dans le vrai site, ces boutons ne sont jamais fermés : ils ouvrent leurs écrans. La maquette les ferme (les écrans restent ceux d'aujourd'hui), et un bouton fermé doit se voir fermé, avec sa raison lisible (protocole maquette, §2 ; complément 2, défaut 7). |
| 11 | Panneau prof | Le panneau prof couvre toute la fenêtre, bord à bord : sans la marge de 30 px autour (l. 223) | dette n°12 · 87 · CSS `.tprof-overlay` | « Il faudrait que mon pilotage prenne la largeur complète de l'écran, parce que la modale c'est bien mais tout est entassé, je dois scroller en permanence. » (Paul, 01/10) : le panneau prend toute la largeur et la hauteur de l'écran, sans changer ses sections. |
| 12 | Panneau prof | Le panneau prof n'est plus borné à 1 100 px de large, ni arrondi (l. 225) | dette n°12 · 87 · CSS `.tprof-box` | Le panneau prend toute la largeur et la hauteur de l'écran, bord à bord ; l'en-tête, le menu de 230 px et le contenu ne changent pas, et le contenu défile toujours en hauteur. |
| 13 | Élèves & codes | La ligne d'élève est une grille de 6 colonnes (le numéro, le nom, le ◆, « 🚫 Jamais avec… », le code, ↻ ✕) au lieu de 4 (l. 609) : ↻ et ✕ sont dans la carte, à droite, sur la ligne du nom | dette n°12 · 88 · CSS `.tprof-content .el-row` | Depuis le ◆ des aménagements, la ligne a un élément de plus que sa grille : ↻ et ✕ passent à la ligne, dans la colonne du numéro, et débordent à gauche, hors de la carte (Paul, 01/10). La grille reçoit une colonne par élément, et une de plus pour « 🚫 Jamais avec… » (585). |
| 14 | Emploi du temps | La rangée de l'emploi du temps devient trois groupes, l'un sous l'autre, chacun avec son petit titre : « Ouvrir l'emploi du temps » et sa case ; « ⤓ Sortir le JSON » (une case par objet présent, nommé en clair avec sa date, « Tout cocher » et un seul bouton, fermé tant que rien n'est coché) ; « 📋 Copier le prompt » (un bouton par voie) (classes edt-groupe, edt-objets, edt-objet nouvelles) | dette n°12 · 212 | Dix éléments sur une rangée qui ne passe jamais à la ligne (.edt-actions, l. 20024) : ils s'écrasent en colonnes étroites, et la section défile de côté (capture de Paul du 11/10). Le tranchage entre les trois voies de Paul : trois groupes, l'un sous l'autre (714). |
| 15 | Emploi du temps | Plusieurs objets cochés : un seul JSON, où chaque objet est rangé sous son identifiant, et le message « JSON de « calendrier », « grille » et « creneaux » copié — N caractères. » ; un seul objet coché, c'est exactement le geste d'aujourd'hui (edtSortirJson, l. 20792) | point 714 | Pour la rangée, le tranchage entre les trois voies de Paul : un sélecteur pour sortir le JSON (un objet, le geste d'aujourd'hui ; plusieurs, un seul JSON qui range chacun sous son nom), et les boutons rangés par type. |
| 16 | Emploi du temps | Les copies (« ⤓ Sortir les JSON cochés », « 📋 Copier le prompt ») disent leur message dans la modale d'atInfo, avec le vrai nombre de caractères, sans toucher au presse-papiers | simulation déclarée | La maquette ne touche pas au presse-papiers : le message de la vraie fonction s'affiche, calculé sur les données relues au hub. |
| 17 | Emploi du temps | « 📅 Ouvrir l'emploi du temps », « Réinjecter maintenant… » et les trois voies de « ✨ Injecter un objet » sont fermés, avec « Inchangé : cet écran reste celui d'aujourd'hui. » ; la case et « Plus tard » agissent sur place | simulation déclarée | Ces gestes ouvrent un autre écran, qui ne change pas ; la case et « Plus tard » écrivent un réglage au hub, que la maquette n'a pas : l'écran change sur place. |
| 18 | Emploi du temps | Les boutons fermés de la section « Emploi du temps » (« 📅 Ouvrir l'emploi du temps », « ⤓ Sortir les JSON cochés » quand rien n'est coché, « Réinjecter maintenant… », les trois voies) prennent l'aspect qu'index.html donne déjà à un bouton fermé (.eli-btn:disabled, l. 860) | simulation déclarée · CSS `.edt-btn:disabled` | Dans le vrai site, ces boutons ne sont jamais fermés. La maquette ferme ceux qui ouvrent un écran inchangé, et « ⤓ Sortir les JSON cochés » tant que rien n'est coché ; un bouton fermé doit se voir fermé (protocole maquette, §2 ; garde 6). |

### Ce que les gardes 6, 7 et 8 ont trouvé d'autre

Jouées sur la v6 et sur les témoins avant toute correction (`sorties/gardes-6-7-8-sur-v6.txt`), elles trouvent chacune leur défaut connu : les 13 boutons du défaut 7 dans les 9 scènes ; le panneau borné (dette 87) ; la grille changée sans écart (dette 88) ; ↻ ✕ hors de la carte sur chaque ligne du témoin à la grille d'`index.html` (20 px à gauche, 30 px sous le nom, la mesure de l'audit) ; le défilement de côté et des boutons de 5 à 9 lignes sur le témoin de la vraie rangée. Elles ont trouvé aussi :
- **12 boutons fermés de la console du QCM et du téléphone, dans 24 scènes** (« 🔒 Révéler », « ← Question précédente », « 💡 Révélée », « 🔓 Rouvrir pour tous », « 💾 Enregistrer l'évaluation », « 🔒 🏁 Afficher leur bilan… »…) : estompés, mais leur raison ne se lisait pas au survol. Ils reçoivent la même enveloppe (journal, n° 49).
- **Mes propres classes** `edt-case` et `edt-cases`, qui étaient celles des cases de la semaine du vrai écran : renommées (n° 53).

Le détail est au journal (`DEFAUTS.md`, n° 48 à 53).

## Complément 1 — fait

*Complément : `MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md` (md5 `37e0b18a532c9a0558a220d58377101a`), fait d'une traite sur `maquette-qcm`, étapes A à D. La v1 à la v5 restent telles quelles, avec leurs md5. **La livraison : `maquette-qcm-v6.html`** (md5 `60778845d3ccf68e0b4fdd4a9ce7db30`), **166 scènes** ; banc final `sorties/banc-final-v6.txt` : **18 245 vérifications, zéro défaut**, les vérifications 1 à 9 et les cinq gardes, tout sur tout ; captures refaites et regardées (`captures/`, 166) ; livret `livret-maquette-qcm-v6.pdf`.*

### Les six défauts du §3, et la scène qui les montre corrigés

| Défaut | Ce qui est fait | Scènes |
| --- | --- | --- |
| **D1** — MJPC ne partait pas de l'existant | Le balisage, les classes CSS et les textes d'`index.html` (`src/mjpc.js`, `src/mjpc.css` extrait par `outils/css-mjpc.py`), chaque élément avec sa ligne dans l'inventaire (`banc/existant/mjpc-*.json`). Le menu du panneau prof : les 14 entrées sous leurs quatre titres, les 12 sans scène grisées (« Inchangé : cet écran reste celui d'aujourd'hui. »). « Élèves & codes » dans l'ordre du vrai écran : l'encart de la clé saisie, l'import du fichier de classe, la barre des classes, la zone d'import, la barre d'outils (« Générer 1 code manquant », « 🖨 Imprimer », « Tout régénérer »), chaque ligne avec son numéro, le nom cliquable qui ouvre la fiche, le ◆, « 🚫 Jamais avec… » juste après, le code, ↻ et ✕. La fiche de l'élève. La Taxonomie sur la vraie taxonomie (`src/donnees/taxonomie_atelier.json`, md5 `26128f95…`) : « Version 1.4.0 · 2026-08-02 · 7 domaines · 210 notions », un domaine ouvert, une notion en modification, la section « 🧩 Les compétences » (les 28, sous leurs 8 groupes, libellé officiel et « Élève : … »), une compétence en modification. | `m-classe-exclusions`, `m-exclusion-refusee`, `m-fiche-eleve`, `m-taxonomie`, `m-taxonomie-editeur`, `m-taxonomie-domaine`, `m-taxonomie-notion`, `m-taxonomie-competences`, `m-taxonomie-competence` |
| **D2** — des renvois au cadrage à l'écran | « Le prompt du cadrage (tour 630). » et « (340) » retirés. Les infobulles des gestes qui existent déjà sont celles de la 7.7.1, mot pour mot (« 📖 Mode d'emploi », « 🔄 Restaurer le prompt par défaut » et une centaine d'autres) ; seul ce que le cadrage change garde un autre texte, avec son point cité dans `banc/existant/retraits.json`. Le prompt a la fenêtre de la 7.7.1 : à la lecture, tel que l'app le copie (les jetons remplis) ; en modification (scène nouvelle), le gabarit, « 💾 Enregistrer », « ↩️ Annuler » et « 🔄 Restaurer le prompt par défaut » avec sa boîte « confirm » dessinée. | `c-reglages`, `c-reglages-prompt`, `c-reglages-prompt-modifier`, toute la console |
| **D3** — les limites de longueur se contredisaient | La mesure refaite : tous les choix à la même longueur, la limite d'un choix, l'énoncé de 40 à 300 par pas de 20, le choix par pas de 5 ; elle ne croît jamais ; l'étalon reste à 67 px. Ci-dessous. | `c-reglages-prompt`, `t-annexe` |
| **D4** — « 👀 Écoute le prof — la correction sera révélée. » retirée sans cadrage | Rétablie sous les choix, à la lecture du voisin, tant que la réponse n'est pas révélée ; « ✅ Réponse enregistrée — tu peux encore la changer » reste là où 526 la met. La vérification 4 n'interdit plus que « va voir », « viens me voir », « venez me voir ». | `t-corr-q2-lecture`, `t-corr-q3-lecture`, `t-corr-q1-lecture`, `t-corr-seul`, `x610-3-a-correction` |
| **D5** — le PDF portait les marques de validation | `build.py` retire l'encadré « Exemple de la maquette… » et le style des propositions : le même texte, sans encadré ni souligné. La vérification 9 compare le texte à celui de `gen632.js`, l'encadré mis à part. | `x632-pdf` |
| **D6** — « un peu » dans le bloc, « nettement » dans le bilan | Le bloc « 🎯 Ton estimation » suit l'écart : deux niveaux ou plus, « Tu as nettement surestimé ce que tu avais réussi. » (632) ; un niveau, « Tu as un peu surestimé… » (la 7.7.1). Partout où il paraît. | `t-bilan`, `t-bilan-non-atteinte`, `t-bilan-imprime`, `e-mes-evals`, `c-fiche` |

### Ce que les nouvelles gardes ont trouvé d'autre, et sa correction

Jouées sur la v5 avant toute correction (`sorties/gardes-sur-v5.txt`, rejouée à la fin de l'étape B avec les gardes finales : chaque défaut connu y est trouvé par sa garde ; 898 échecs en tout, contre 2 078 à l'étape A : les gardes ont été affinées depuis (n° 44 et 45), et les retraits cités ne comptent plus). Le détail est au journal (`DEFAUTS.md`, n° 36 à 47).
- **Des éléments de la 7.7.1 perdus sans point du cadrage**, rétablis avec leurs mots : les infobulles des compteurs du pilotage, du bandeau d'état, des cartes « Question en cours / passée », de la correction (position, niveau, taux), de la bande des questions du téléphone (et la bande elle-même, au téléphone avant la révélation) ; « Nombre de points que vaut cette question » ; « ✓ J'ai compris » ; « 📊 Mes évaluations » sur la tablette, à côté du nom de l'élève (sur une demi-tablette, la place sous la carte est celle des choix ; l'étalon reste à 67 px) ; dans l'éditeur, le champ JSON et « 🔍 Vérifier le format », les indications des champs, la case des bonnes réponses, « ➕ Ajouter une question » ; l'indication du JSON au collage ; « Question suivante → » ouvert avant la révélation, comme dans la 7.7.1 ; « 🔓 Rouvrir Q2 » au téléphone.
- **Les retraits** (`banc/existant/retraits.json`, 107) : chaque élément que le cadrage retire ou remplace, avec son point cité mot pour mot (les niveaux à temps, « Q suiv. → », les lettres, la pondération, les purges, « 📄 Préparation », l'encadré « Comment ça marche », « ← Changer de classe »…).
- **Le prompt** n'avait ni la fenêtre ni les gestes de la 7.7.1, et ses jetons restaient visibles (n° 38).
- **Les gardes elles-mêmes**, affinées : la garde 3 lit la section « Les compétences » groupe par groupe (elle croyait la lire dans l'éditeur d'évaluation) ; la garde 1 compare les infobulles calculées à leur forme (« Q10 est la 1e question révélée » et « Q2 est la 1e question révélée »), comme les libellés.
- **Le banc entier, à la fin de l'étape B** : un chevauchement du nom de l'élève, une phrase du degré collée à celle de la 7.7.1, l'indication « ex : DUPONT Marie » d'`index.html` prise pour un élève, « ✏️ Modifier » d'une notion ouverte inerte (n° 46).

### Les mesures, et le texte de `{{LIMITES}}`

Détail : `mesures/README.md` ; sortie brute : `mesures/limites.json` (`node mesures/mesurer.js maquette-qcm-v6.html mesures/limites.json`). La limite est la longueur d'un choix, tous les choix à la même longueur, la plus longue qui tient sur la réponse, B et la lecture du voisin ; toutes les plus courtes tiennent aussi (la garde 4 en rejoue un échantillon dans la maquette).

| Énoncé (caractères, au plus) | 4 choix ou moins | 5 choix | 6 choix |
| --- | --- | --- | --- |
| 40 | 165 | 80 | 70 |
| 60 | 165 | 80 | 70 |
| 80 | 155 | 75 | 70 |
| 100 | 155 | 75 | 70 |
| 120 | 155 | 75 | 70 |
| 140 | 130 | 25 | 25 |
| 160 | 130 | 25 | 25 |
| 180 | 130 | 25 | 25 |
| 200 | 120 | 25 | 25 |
| 220 | 80 | 25 | 25 |
| 240 | 80 | 25 | 25 |
| 260 | 80 | 25 | 25 |
| 280 | 80 | ne tient pas | ne tient pas |
| 300 | 70 | ne tient pas | ne tient pas |

**L'étalon** : la vraie question 3 de 3e garde 67 px sur l'écran de réponse ; elle tient sur les trois écrans (51 px sur la réponse, 20 sur B, 4 sur la lecture du voisin, au-delà de la marge), mais **ne respecte pas la nouvelle limite** : son plus long choix fait 137 caractères, la limite à 6 choix et 96 caractères d'énoncé est 70. Elle tient parce que ses autres choix sont courts ; une limite suffisante est prudente.

**Le texte exact qui remplace `{{LIMITES}}`** (le prompt de Réglages le porte) :

> chaque question doit tenir sur une demi-tablette, choix compris. Compte les caractères, espaces comprises. L'énoncé fait 300 caractères au plus. Les choix d'une question ont tous à peu près la même longueur, et aucun ne dépasse la limite. Avec 4 choix ou moins : 165 caractères par choix si l'énoncé fait 60 caractères ou moins, 155 caractères par choix jusqu'à 120, 130 caractères par choix jusqu'à 180, 120 caractères par choix jusqu'à 200, 80 caractères par choix jusqu'à 280, 70 caractères par choix jusqu'à 300. Avec 5 choix : 80 caractères par choix si l'énoncé fait 60 caractères ou moins, 75 caractères par choix jusqu'à 120, 25 caractères par choix jusqu'à 260 ; au-delà de 260 caractères d'énoncé, pas de 5 choix. Avec 6 choix : 70 caractères par choix si l'énoncé fait 120 caractères ou moins, 25 caractères par choix jusqu'à 260 ; au-delà de 260 caractères d'énoncé, pas de 6 choix.

### Ce que la maquette simule dans MJPC

- **Rien n'est lu ni écrit au hub** : la classe « 3 ESSAI », ses codes, ses exclusions, les fiches de Michel et de Lina sont des données de la maquette ; la taxonomie est la vraie, copiée avec son md5, et ses modifications ne vivent que dans la scène.
- **Chaque geste fait ce que sa fonction fait dans `index.html`**, sur place : importer et compléter la liste (avec ses alertes), générer les codes manquants, imprimer (la page des codes de `_printCodesClasse`), tout régénérer (le mot « CODES » à taper), ↻ et ✕ (avec la fenêtre de confirmation), ouvrir la fiche, cocher les cases PAP, enregistrer la fiche ; ouvrir et fermer l'éditeur de taxonomie, déplier un domaine, une famille, un groupe de compétences, modifier, désactiver ou réactiver une notion, en créer une, avec les alertes de validation ; un enregistrement fait avancer la version d'un cran et met la date du jour. « Modifier » recharge le référentiel (« Chargement du référentiel… »), comme `taxoRafraichir(true)`.
- **Les boîtes système** (`alert`, `confirm`) et les fenêtres de `_modaleConfirme` sont dessinées dans la page, avec leur texte exact.
- **L'encart de la clé** est dans l'état « clé saisie » ; « Code professeur » et les autres écrans du panneau sont grisés, avec leur raison (12 dans la v6 ; 11 depuis le complément 2, qui ouvre « 📅 Emploi du temps », et estompés comme un bouton fermé d'`index.html`).

### Étape A — les gardes


**Ce que j'ai lu, avec les md5.** `main` fusionné dans `maquette-qcm` (`495296f`) ; production clonée en lecture, `main` à `d873f69`, md5 vérifiés avant tout.

| Fichier | md5 | Lu |
| --- | --- | --- |
| `MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md` | `37e0b18a532c9a0558a220d58377101a` | en entier |
| `AUDITS/MAQUETTE-QCM-COMPLETE-10-10/README.md` et ses `sorties/` (`meta.txt`, `meta-infobulles.txt`, `meta-cadres.txt`, `banc-audit.txt`) | `f3593d9332c15d9333fcf52a685e64e9` | en entier |
| `MANDATS/CADRAGE-QCM.md` | `91bec05621d8fd6893251a5100b84a89` | la ligne d'état, les tours 638 et 639 (points 680 à 696) ; cherché à chaque retrait |
| `MANDATS/PROMPT-QCM-CREATION/README.md` | `ab11646beec84e8bd659d56d76cc8c0d` | le texte du prompt et ses jetons |
| `MANDATS/LIBELLES-ELEVE-COMPETENCES/libelles_eleve.json` | `17e9a9876c0372bd7716e5a5acb542b0` | les 28 libellés élève |
| `MANDATS/MAQUETTE-QCM-FLUX/maquette/com632.js` | `63f215d08ab814df819021f3425343f7` | l'estimation (« nettement » à deux niveaux d'écart) |
| `AUDITS/QCM-TELEPHONE-09-10/README.md` | `c7541016ef7f8ed6d559174870863891` | le téléphone qui s'éteint (« mode is not defined ») |
| `AUDITS/QCM-FAUSSE-CLASSE-3E-08-10/README.md` | `4a0faeee61e2caf17fd567d0cad199bb` | la correction de l'élève vide (« bonnes is not defined », dette 198) |
| production : `PROTOCOLE-MAQUETTE.md` | `cea75531c1caf46e566ef45b5a9f3d17` | en entier |
| production : `evaluation-qcm.html` (7.7.1) | `ecae65624855a1a877708986a8e984e5` | jouée écran par écran sur le faux hub, et lue là où l'écran plante |
| production : `index.html` (MJPC) | `ac792b28f40d3a0510e725fc4a6b6985` | le panneau prof (l. 1620–1650), « Élèves & codes » (l. 5495–5606, 14740–14780), la fiche (l. 5884–6014), la taxonomie (l. 2080–2110, 2330–2612), `_modaleConfirme` (l. 6986) |
| production : `taxonomie_atelier.json` | `26128f95a0c0b59f45f6cc672218497b` | en entier (7 domaines, 51 familles, 210 notions, 28 compétences) |
| production : `correction_dictee.html` | `9d5dcfb612a70a8182689566b1fe23c5` | md5 vérifié |

**Les inventaires de l'existant** (`banc/existant/`, garde 1) :
- **52 écrans de la 7.7.1 relevés sur le faux hub** (`banc/fauxhub/` : le serveur, le faux Firebase et la fausse classe « 3 ESSAI » du banc de l'audit du mode test). `node banc/existant/releve.js` joue la vraie app dans Chromium : l'accueil, l'identification, la console (mode d'emploi, QR, évaluations, prompt IA, nouvelle évaluation, éditeur, impression, préparation, données, réglages), l'appel, l'attente, la réflexion, la réponse, la question close, la dernière question, l'autoévaluation, la correction avant et après « 💡 Révéler », le bilan de la classe et celui de l'élève, la fin, les résultats, la sauvegarde, « Mes évaluations », le tableau et le téléphone à chaque phase, le mode test. Chaque écran : ses boutons et leurs infobulles, ses champs, ses cases, les infobulles posées ailleurs, et pour un écran d'élève ses phrases ; avec les scènes de la maquette qui en partent (`qcm-<écran>.json`).
- **Deux écrans de la 7.7.1 restent vides à l'écran** : la correction de l'élève, avant et après « 💡 Révéler » (`ReferenceError: bonnes is not defined`, l. 4365, la dette 198 de l'audit de la fausse classe). Le relevé le constate (`vides.json`) ; leur inventaire est tiré du code, ligne par ligne (`code-eleve-correction-*.json`). Le téléphone s'éteint de même dès qu'un élève affiché a répondu (`mode is not defined`) : il est relevé dans une seconde séance où personne ne répond.
- **Sept écrans de MJPC tirés du code d'`index.html`**, chaque élément avec sa ligne (`node banc/existant/code.js` vérifie que chaque ligne citée contient ce qu'il en dit) : le panneau et son menu, « Élèves & codes » (clé saisie), la fiche de l'élève, la taxonomie fermée, l'éditeur ouvert, un domaine ouvert, une notion en modification (`mjpc-<écran>.json`) ; avec leur structure (les classes CSS, dans l'ordre du vrai écran).
- **`banc/existant/retraits.json`** : ce qu'une scène ne montre plus, chacun avec le point du cadrage qui le retire, cité mot pour mot (le banc vérifie que la citation est dans `CADRAGE-QCM.md`, dans le point cité).

**Les cinq gardes** (`banc/gardes.js`, branchées dans `banc/banc.js` ; elles lisent la scène ouverte, et dans ses iframes) :
1. **L'existant** : chaque scène est comparée aux écrans dont elle part, par la même extraction (`banc/existant/extraction.js`) ; un bouton, un champ, une case, une infobulle, une phrase d'élève ou (pour MJPC) une classe de la structure qui manque est refusé, sauf retrait cité ; l'infobulle d'un geste qui existe est celle de l'existant, mot pour mot. Une scène nommée par un inventaire doit exister.
2. **Le méta** : aucun « tour N », « point N », nombre entre parenthèses (sauf les données déclarées, « 👥 Classe (25) »), « cadrage », « mandat », « conscience », « exécutant », « à valider », « pas encore validé », « souligné en pointillés », « maquette » hors du sommaire, ni souligné orange en pointillés ou `.prov` visible ; dans les textes, les infobulles, les indications et les champs, iframes comprises (le texte du prompt de Paul est une donnée).
3. **Les chiffres** : la ligne d'état et les domaines de la taxonomie, les notions et les compétences (libellé, « Élève : … ») d'après `taxonomie_atelier.json` et `libelles_eleve.json` ; les 28 compétences là où la liste « Les compétences » s'affiche ; les durées de la séance (649) dans Réglages ; le prompt, texte du README avec ses jetons remplacés, `{{LIMITES}}` par le texte de `mesures/limites.json`.
4. **Les mesures** : `limites.json` donne la limite d'un choix pour 4, 5 et 6 choix ; elle ne monte jamais avec le nombre de choix ni avec l'énoncé ; chaque limite tient sur les trois écrans, la limite plus un pas non ; l'étalon reste à 67 px.
5. **L'estimation** : le degré du bloc « 🎯 Ton estimation » suit l'écart de niveaux (com632.js : « nettement » à deux niveaux ou plus) ; pour chaque élève, le bloc et le bilan général disent le même degré.

**Jouées sur la v5** (`sorties/gardes-sur-v5.txt`, `GARDES=seules node banc/banc.js maquette-qcm-v5.html 5`, puis `python3 banc/synthese-gardes.py`) : chaque défaut connu du §3 est trouvé par sa garde — D1 par les gardes 1 et 3, D2 par les gardes 2 et 1, D3 par la garde 4, D4 par la garde 1, D5 par la garde 2, D6 par la garde 5 — et 2 078 échecs en tout, la matière de l'étape B. **Les vérifications 1 à 9 passent toujours sur la v5** : `sorties/banc-v5-verifications-1-a-9.txt`, 15 712 vérifications, zéro défaut (`GARDES=0` ; la vérification 4 a perdu l'interdit « le professeur », D4).

### Étapes B à D — les sorties

- **B** (`sorties/banc-etape-B.txt`) : le banc entier, à zéro, sans la garde 4 et le texte de `{{LIMITES}}` (`MESURES=0` : la mesure se refait à l'étape C) ; `sorties/gardes-sur-v5.txt` rejoué avec les gardes finales.
- **C** (`sorties/banc-etape-C.txt`) : le banc entier, à zéro, avec la garde 4 et son échantillon.
- **D** (`sorties/banc-final-v6.txt`) : le banc final sur `maquette-qcm-v6.html`, tout sur tout, à zéro.

## En bref

- **La maquette** : `maquette-qcm-v9.html` (md5 `64828367cb3728e8f97b8177d5418c11`), un fichier HTML autonome, sans réseau, **169 scènes dans l'ordre de la séance**, chacune ouvrable par `#scene=ID`, et 3 273 destinations atteintes par le geste (`sorties/destinations-v9.txt`) ; le sommaire derrière ⚙ « Scènes de la maquette ». La v1 à la v8 restent dans le dossier, telles quelles, avec leurs md5.
- **Le banc final** : `sorties/banc-final-v9.txt` — **25 282 vérifications, zéro défaut** (vérifications 1 à 9, gardes 1 à 5 du complément 1, gardes 6 à 8 du complément 2, gardes 9 à 15 du complément 3, sur les 169 scènes, à toutes les tailles ; gardes 16.1, 16.2, 16.4 et 17 à 20 du complément 4 sur les 3 442 pages) ; les contrôles de la conscience : `sorties/controles-conscience-v9.txt`, 110, zéro échec. Les sorties précédentes : `banc-final-v8.txt`, `gardes-16-a-20-sur-v8.txt`, `sorties/banc-etape1.txt` à `banc-etape5.txt`, `banc-etape-B.txt`, `banc-etape-C.txt`, `banc-final-v6.txt`, `banc-final-v7.txt`, `banc-etape-B-c3.txt` à `banc-etape-D-c3.txt`, `gardes-9-a-15-sur-v7.txt` ; celle de la v5 : `sorties/banc-final.txt`.
- **Les captures** : `captures/` (169, refaites sur la v9 ; elles servent au banc et à l'audit ; la lecture des écrans changés : `sorties/lecture-v9.md`). **Plus de livret** depuis le complément 3 : Paul valide sur la maquette elle-même ; les livrets de la v5 à la v7 restent.
- **Les mesures** : `mesures/README.md` ; le texte de `{{LIMITES}}` pour le prompt y est, et dans la section du complément 1.
- **L'existant** : `banc/existant/` (les inventaires de la 7.7.1 et de MJPC, `retraits.json` et ses citations, `ecarts-mjpc.json` et ses raisons).
- **Le tableau « point → scène »** : plus bas (et `POINT-SCENE.md`).
- **Le journal des défauts** : `DEFAUTS.md` (377 entrées : 35 au mandat, 12 au complément 1, 6 au complément 2 ; au complément 3, les 279 lignes des relecteurs, n° 54 à 332, et 23 trouvailles des gardes, du banc et des captures, n° 333 à 355 ; au complément 4, n° 356 à 377), repris plus bas pour les trois premiers.
- **Le classement des textes de la maquette** : `banc/existant/textes-console.json` (571 textes, leur catégorie et, pour les 77 explications, leur place) ; **le scénario** : `src/scenario.js`.
- **Rejouer** : pour la v9, voir la section du complément 4 ; `python3 build.py dev` (assemble `maquette-qcm-vdev.html`), `node banc/banc.js maquette-qcm-v8.html 5 sortie.txt` (le banc, une heure environ avec les gardes 9 à 15 ; `G3SEUL=9,12` ces gardes du complément 3 seules, `node banc/banc3.js` elles seules ; `GARDES=0` sans les gardes des compléments, `GARDES=seules` elles seules, `GARDES=c2` les gardes 6 à 8 seules, `SEUL=id` une scène), `node banc/temoins.js maquette-qcm-v6.html` (les témoins des gardes 7 et 8), `node capture.js maquette-qcm-v8.html`, `node mesures/mesurer.js maquette-qcm-v8.html mesures/limites.json`, `python3 outils/mesures-readme.py mesures/limites.json mesures/README.md`, `python3 outils/css-mjpc.py` et `node outils/edt-prompts.js` (les copies d'`index.html`), `node banc/existant/releve.js` et `node banc/existant/code.js` (les inventaires de l'existant).

## Ce que la maquette simule (déclaré, mandat §3)

- **Le temps** : chaque scène est un instant de la séance ; les chronos montrent une valeur figée. Les temps en direct (« +5 », « +10 », « +30 », la case à taper), la pause, « 🔄 Relancer » agissent sur place, sans que le temps s'écoule.
- **Les autres tablettes et les autres élèves** : la classe inventée « 3 ESSAI » (24 présents, Adam absent) et la classe de test de 30 élèves ; leurs réponses, lectures, co-évaluations et les gestes de Paul sont écrits une seule fois, dans le scénario (`src/scenario.js`), et chaque chiffre des scènes s'en calcule ; rien n'est calculé en direct par d'autres appareils.
- **Le hub** : rien n'est lu ni écrit ; un geste qui écrirait au hub mène à la scène qui montre ce qui se passe ensuite, ou change l'écran sur place (coches, choix, binômes, exclusions, bilan général, libellés élève). Aucun réseau, aucun stockage, aucune boîte système : le banc le vérifie au source et à chaque clic.
- **Les fichiers** : « 📥 Export CSV », « 📥 Exporter snapshot », « 📋 Copier les erreurs… » disent ce qu'ils ont fait, sans écrire de fichier ni toucher au presse-papiers. L'impression ouvre l'aperçu (le PDF de gen632.js, tel quel ; le bilan de l'élève tel qu'il s'imprime ; les énoncés seuls).
- **Le QR** : un dessin, qui ne mène à rien d'autre que la scène du téléphone.
- **MJPC** : le balisage, les classes et les textes d'`index.html`, avec la vraie taxonomie et les vrais objets de l'emploi du temps ; rien n'est lu ni écrit au hub, chaque geste fait sur place ce que sa fonction fait ; chaque écart avec le vrai site est inscrit avec sa raison (voir le complément 2, en tête, et « Ce que la maquette simule dans MJPC », au complément 1).
- **Le seul écran de simulation** est le sommaire ⚙ (protocole §2).


## Étape 1 — le socle

### Ce que j'ai lu (mandat §2), avec les md5

Au sas (`siteflow-io/mjpc-chantier`, `main` à `b6d352c`) :

| Fichier | md5 | Lu |
| --- | --- | --- |
| `MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md` | `fbe136b63552f697c9d0051bef4bb6f1` | en entier |
| `MANDATS/CADRAGE-QCM.md` | `58ee8b4e3f990005a6b73429197c482c` | en entier (ligne d'état, points 1 à 679, archive) |
| `MANDATS/MAQUETTE-QCM-FLUX/README.md` | `df9a65e6eaf4b41a004a045a56954f21` | en entier |
| `AUDITS/QCM-MODE-TEST-09-10/README.md` | `efd4dcc92683bfe1744d1a7009ba2cca` | en entier |
| `MANDATS/PROMPT-QCM-CREATION/README.md` | `ab11646beec84e8bd659d56d76cc8c0d` | en entier |
| `MANDATS/LIBELLES-ELEVE-COMPETENCES/README.md` | `1b72a3d2c098b5491d9c1a953bdd2eaf` | en entier |
| `MANDATS/EN-TETES-APPS-BINOMES/README.md` | `74a7cacdfe86bf6fd1d995c13681a54d` | en entier |
| `MANDATS/INVENTAIRE-QCM-TOUT-VISIBLE.md` | `124b4edcbc552f18c3566a0b1a21e15d` | en entier |
| `MANDATS/DETTES-QCM-179-184-A-REPORTER.md` | `6e4fbff8842dfb16d106ee817524b1f1` | en entier |
| `MANDATS/MAQUETTE-QCM-FLUX/maquette/` : `maquette.js` `0f473404…`, `maquette2.js` `2bfaa451…`, `maquette610.js` `9258e8db…`, `maquette620.js` `f1a15f79…`, `maquette626.js` à `628.js`, `com632.js` `63f215d0…`, `ev3e.js` `3dcf7a73…`, `libelles_eleve.json` `17e9a987…`, `qcm.css` `80157ddd…`, les scripts | voir `sorties/lectures-md5.txt` | en entier (sauf `qcm.css`, le CSS de la 7.7.1, repris tel quel) |
| `MANDATS/MAQUETTE-QCM-FLUX/pdf-632/gen632.js` | `a2f3b16c8f275acbe7e0b5fe51e1f8b1` | en entier |

Dans la production (`siteflow-io/monsieurjaipascompris`, clonée en lecture, `main` à `d873f69`) : les md5 sont ceux du mandat, vérifiés avant tout.

| Fichier | md5 | Lu |
| --- | --- | --- |
| `PROTOCOLE-MAQUETTE.md` | `cea75531c1caf46e566ef45b5a9f3d17` | en entier ; appliqué |
| `evaluation-qcm.html` (7.7.1) | `ecae65624855a1a877708986a8e984e5` | source des phrases (le banc la cherche entière) ; lue par écran aux étapes où l'écran change |
| `index.html` (MJPC) | `ac792b28f40d3a0510e725fc4a6b6985` | la fiche de classe et l'éditeur de taxonomie, à l'étape 4 |
| `correction_dictee.html` | `9d5dcfb612a70a8182689566b1fe23c5` | « Bilan général », Réglages, « rendre les copies », à l'étape 4 |
| `docs/MJPC6-DETTES.md` | `57cc7f41a87ea6f81087492346a7954d` | en entier (3 090 lignes), par un sous-agent ; relevé des pièges : `sorties/pieges-dettes-journal.md` |
| `docs/MJPC6-journal.md` | `ea5cbd76aaf8cb0b49ca77b819894a67` | en entier (1 068 lignes), par le même sous-agent |

### Ce qui est fait

- **Une seule maquette**, `maquette-qcm-v1.html` (md5 dans `maquette-qcm-v1.html.md5`), un fichier HTML autonome, sans réseau : elle réunit **tous les morceaux existants** (§3 du mandat), sans rien changer : les 66 scènes du tour 603, les 9 scènes x610, les 3 scènes x620, les scènes x626 à x628, et le PDF de `pdf-632` (sa page HTML, sortie de `gen632.js`, telle quelle). 85 scènes, **dans l'ordre de la séance** (préparer, avant l'heure, l'entrée, les trois questions, les gestes rares, l'estimation, la correction, la co-évaluation, la fin, le soir, l'élève après, une autre séance, le mode test, l'annexe), chacune ouvrable par `#scene=ID`.
- **Le sommaire** derrière le bouton ⚙ « Scènes de la maquette » (en bas à droite) : le seul écran de simulation (protocole §2). Échap le ferme.
- **L'assemblage** : `build.py N` (le CSS de la 7.7.1 tel quel, les CSS des maquettes, React 17 local, les scènes, le socle `src/socle.js`) ; il refuse de réécrire une version déjà livrée.
- **Le banc unique** : `node banc/banc.js maquette-qcm-vN.html N` (§8). Sortie de l'étape : `sorties/banc-etape1.txt` — **847 vérifications, zéro défaut**.
- **Les captures** : `node capture.js maquette-qcm-vN.html` → `captures/NNN-id.png`, toutes regardées.
- **Le tableau des scènes changées, ajoutées ou retirées aux étapes 2 à 4, point par point** : `PLAN-ETAPES-2-4.md`.
- **Le journal des défauts** : `DEFAUTS.md`.

### Le banc, et comment il grandit

Les vérifications 1 (chaque scène s'ouvre sans erreur et montre quelque chose, le sommaire marche), 6 (aucune boîte système, aucun réseau, aucun stockage : dans le source et à l'exécution) et 7 (aucun vrai élève) portent sur **toutes** les scènes dès l'étape 1. Les vérifications 2 (débordement), 3 (chaque phrase de l'élève retrouvée mot pour mot dans le cadrage, les sources des maquettes, les textes rendus des maquettes existantes ou la 7.7.1), 4 (les mots interdits côté élève, dont les infobulles côté élève), 5 (infobulles et boutons inertes, chaque bouton cliqué sur la scène fraîche), 8 (chevauchements et textes coupés) et 9 (le commentaire de com632, le PDF de gen632) portent sur les scènes déjà relues par une étape (la colonne « étape » du sommaire) ; à l'étape 5, tout porte sur tout. Le banc a été éprouvé contre un piège : un nom inventé (« DUPONT Marie ») est bien refusé, et une phrase de l'existant est bien retrouvée.

## Étape 2 — avant et pendant les questions

*Maquette : `maquette-qcm-v2.html` (md5 `d3b487940ff9a76d0cf8667df9815538`). Banc : `sorties/banc-etape2.txt` — **5 878 vérifications, zéro défaut**, sur les 145 scènes (vérifications 1, 6, 7 partout ; toutes les autres sur les scènes des étapes 1 et 2). Captures : `captures/`, toutes regardées.*

Ce qui change, point par point (le détail : `PLAN-ETAPES-2-4.md`, section « Étape 2 ») :

- **Avant l'heure** : l'accueil (« 🎓 Mode élève », « Accès professeur ») ; « Pilotage classe » avec la durée comptée d'après les durées fixes (649), le mode (« 📱 Sur tablettes » / « 📄 Séance sur papier », 467), les binômes formés d'abord par les exclusions de MJPC (585, 587) ; un échange qui mettrait deux exclus ensemble est refusé, avec la raison, pour toi seul (589) ; l'appel, où un clic marque un absent ; la démo « 🎓 », lancée comme une vraie, et la ligne qui en reste (550 à 558).
- **L'entrée** : « Tu es bien Julien ? » (333) ; le code inconnu, « lève la main » (402) ; l'élève à la mauvaise tablette, « rejoins Julien » (15) ; l'attestation, une coche par ligne, chaque ligne après la précédente, « Je commence » fermé jusqu'à la dernière (506, 549) ; ta console, « attestation 5/8 ».
- **Pendant les questions** : les deux temps à taper en direct, « +5 », « +10 », « +30 », qui agissent vraiment, et la fin prévue, rouge quand elle déborde (427, 428) ; « ❌ Écarter », « ⚠️ Annuler », « ↩️ Remettre », leurs gardes et leurs marques (429, 441, 442) ; « Question 2 / 2 » sur les tablettes ; le stylo 🖊️ et les phrases qui nomment l'élève (431) ; B, « dit-elle la même chose que ton clic ? », 5 s (495) ; « ✅ Dernière question close — lance l'autoévaluation » (433) ; « 🔓 Rouvrir pour tous » grisé, avec la raison, quand tout le monde a répondu.
- **Les gestes rares** : départ, parti, retour (Noah), déplacer deux élèves pendant la séance (72), « Terminer », « 👁 » (la tablette en direct), le QR, le mode d'emploi réécrit d'après le cadrage ; « ⏸️ Finir à une autre heure » est dans le pilotage (sa scène est à l'étape 3).
- **Ton téléphone** : les temps en direct, la fin prévue, « ❌ Écarter », un chrono que « 🔄 Chrono » relance.
- **Les gestes** : chaque bouton de la console et du téléphone a son infobulle (ce qu'il fait, ce qu'il coûte) ; chaque bouton mène à sa scène, ou agit sur place (temps, coches, appel, binômes, pause) ; Échap ferme une fenêtre.

Le banc a grandi (défauts 5 à 16 du journal) : il remet la scène à neuf avant chaque clic au lieu d'ouvrir un navigateur (4 min 42 pour tout), ne clique que la couche du dessus, et vérifie que **chaque bouton déclare son geste**.

## Étape 3 — la correction et la fin de l'heure

*Maquette : `maquette-qcm-v3.html` (md5 `57deff216b2cbfe42c441c8a923f2500`). Banc : `sorties/banc-etape3.txt` — **12 313 vérifications, zéro défaut**, sur les 153 scènes. Captures : `captures/`, toutes regardées. Journal : défauts 17 à 26.*

- **L'estimation** sans infobulle, avec la phrase de 444 ; « 📝 Lancer la correction » ouvre **la seconde attestation**, une coche par ligne, les deux compétences par leur libellé élève (507, 510, 549, 640) ; ta console attend que tous l'aient cochée.
- **A, la lecture du voisin** (496) : Michel clique ce que dit la feuille de Julien, dans la moitié de Julien, et l'inverse ; « Lis avec soin : c'est ton point d'autonomie. » ; « 🔒 Révéler » attend toutes les feuilles lues, avec les noms qui manquent ; Julien lit « Venise » sur la feuille de Michel, qui dit Rome. La vraie question 3 de 3e tient dans sa moitié (0 px).
- **Après la révélation** : le ✓ orange et le bandeau orange à liseré rouge (484, 439) ; « ⛔ Dernier moment » en orange et « ⚠️ À relire » d'après B dans ta console et ton téléphone (497) ; à la dernière question, « 🏁 Afficher leur bilan aux élèves » (455).
- **Le point d'autonomie** : un clic sur un nom, « ⛔ Retirer le point d'autonomie », sa garde, « ↩️ Rendre » (436, 449), aussi au téléphone.
- **La co-évaluation** (511 à 539) : chaque moitié a son état — les trois choix, « c'est laquelle ? », « Qu'avais-tu écrit sur ta feuille ? », « vous êtes d'accord » ; ta console : l'alerte dans l'ordre de 535 à 538, les quatre boutons (545), « ⛔ à Michel / à Julien / aux deux » (541) et leurs gardes ; le cas ambigu sur l'évaluation de 3e, tranchable de bout en bout.
- **Le bilan** : « Ta note provisoire » et la phrase de 474 ; les libellés élève ; le ✓ orange ; « Corrigé d'après ta feuille » ; les deux compétences d'autonomie « atteinte » ou « non atteinte » ; une question annulée (442) ; l'impression.
- **« ⏸️ Finir à une autre heure »**, la reprise, « 🔓 Rouvrir » une séance terminée (469) ; **le papier seul** de bout en bout (467, 491, 492), avec la variante papier de la seconde attestation, faite de phrases déjà validées ; **le rattrapage** par les exclusions (595) ; **l'élève seul** qui lit sa propre feuille (500).

## Étape 4 — le soir, les réglages, MJPC

*Maquette : `maquette-qcm-v4.html` (md5 `2e35941495321aadde38f2b147d1006a`). Banc : `sorties/banc-etape4.txt` — **15 686 vérifications, zéro défaut**, sur les 159 scènes. Captures regardées. Journal : défauts 27 à 35.*

- **📝 Évaluations** rangées par niveau, chaque niveau se replie, un tri (date, titre, chapitre) ; la démo en tête, « 🔒 Permanente », sans corbeille (465, 552 à 554) ; « 📋 Dupliquer » agit ; la corbeille d'une évaluation.
- **Le collage** : les messages numérotés, dont la garde de longueur (« 60 px de trop sur une demi-tablette »), « ce qu'elle vérifie » manquant, la durée qui déborde ; « 📋 Copier les erreurs pour l'instance de création d'éval » (466, 481, 464, 631).
- **L'éditeur** : « 🎯 Ce qu'elle vérifie », la marque « 📏 longueur assumée » ; chaque geste marque l'évaluation modifiée.
- **Résultats** : les séances rangées par classe, un tri ; la coche « publiée » ; « copies non rendues » → « rendre les copies ▸ » qui pulse → sa garde → « copies rendues le 10/10 », « 🙈 Masquer les copies » (471) ; le tableau avec ⛔ et ∅, la colonne d'autonomie ; « 📄 PDF notes et compétences » fermé tant que les copies ne sont pas rendues (609), puis le PDF de gen632.js.
- **La fiche** : la feuille lue par Julien, la tablette, ce qu'il a dit (B), « ✔ Marquer lue », « La feuille dit autre chose », ses compétences et les deux du point d'autonomie, « ⛔ Retirer le point d'autonomie » et « ↩️ Rendre » le soir ; « 📝 Bilan général » pré-rempli par **com632.js**, « ↻ Regénérer », « ✓ Valider le bilan » (621 à 633).
- **Côté élève** : « Mes évaluations » avec « En relecture : ta note sera visible quand ta copie te sera rendue », « Tu étais absente », puis la note ; le bilan de Lou qui finit par « 📝 Bilan » (com632.js).
- **Sauvegarde** : export, import (garde), corbeille avec « ↩️ Restaurer », nettoyage, purges (la démo reste).
- **Le mode test** : la capture 64 retirée ; les gestes 🔬 et 🎬 disent ce qu'ils font ; la feuille simulée se tape ; « 🔍 Jouer en grand ».
- **MJPC**, dans le panneau prof (les couleurs et les mesures d'index.html) : « Élèves & codes » avec « 🚫 Jamais avec… » pour chaque élève, au plus 3, la quatrième refusée avec la raison (585, 590) ; « Taxonomie » avec une section « Les compétences » et leur libellé élève, modifiable (637).

Le banc a grandi : la vérification 9 compare chaque commentaire affiché à celui de com632.js pour la même entrée ; l'assemblage refuse un script qui ne compile pas.

## Étape 5 — les mesures et le livret

*Maquette : `maquette-qcm-v5.html` (md5 `940531e53cb7163c35eeaa4df3c562ef`). Banc final : `sorties/banc-final.txt` — **15 712 vérifications, zéro défaut**, tout sur tout. Captures refaites et regardées ; livret `livret-maquette-qcm-v5.pdf`.*

- **Les mesures du §5** (détail : `mesures/README.md`, sortie brute `mesures/limites.json`) : l'étalon retrouvé (la vraie question 3 de 3e : 67 px de reste sur l'écran de réponse) ; les limites pour 4, 5 et 6 choix, sur les trois écrans qui montrent les choix (réponse, B, lecture du voisin), la plus chargée faisant foi ; 0 débordement ; les tailles d'écran et les chevauchements par le banc final.
- **La lecture du voisin** prend la mise en page resserrée de la question 3 de 3e (le chrono à côté de « Lis avec soin »), et un choix par ligne quand les choix sont longs, comme l'écran de réponse : c'est elle qui donnait les limites les plus serrées.
- **Le tableau « point → scène »**, **le livret**, **ce README**.

### Le texte de `{{LIMITES}}` de la v5 (remplacé au complément 1, défaut 3 : le nouveau est en tête)

> chaque question doit tenir sur une demi-tablette, choix compris. Compte les caractères, espaces comprises. Énoncé : 250 caractères au plus. Avec 4 choix : 640 caractères pour l'ensemble des choix si l'énoncé fait 120 caractères ou moins, 530 jusqu'à 150, 440 jusqu'à 200, 410 jusqu'à 250. Avec 5 choix : 410 si l'énoncé fait 120 caractères ou moins, 330 jusqu'à 150, 270 jusqu'à 200, 210 jusqu'à 250. Avec 6 choix : l'énoncé fait 120 caractères au plus, et l'ensemble des choix 480. Aucun choix ne dépasse 160 caractères.

## Le tableau « point → scène »


## Tours 604 à 606 (points 427 à 451)

| Point | Ce qui se voit | Scène(s) |
| --- | --- | --- |
| 427 | les deux temps à taper en direct, « +5 », « +10 », « +30 », pour la question en cours et les questions à venir | `c-q1-reflexion`, `c-q1-tour1`, `p-reponse` |
| 428 | la fin prévue, recalculée, en rouge quand elle déborde | `c-q1-tour1`, `c-fin-prevue`, `p-reponse` |
| 429, 441 | « ❌ Écarter », sa garde, « ↩️ Remettre », « Question 2 / 2 » | `c-ecarter`, `c-ecartee`, `t-q2-ecartee` |
| 430, 442 | « ⚠️ Annuler » une question posée, sa marque distincte ; « Question 2 · annulée : elle ne compte pas. » | `c-annuler`, `c-annulee`, `t-bilan-annulee` |
| 431 | le stylo 🖊️, « Pose ton stylo, Julien. Tu es prêt ? À toi dans 3 secondes », l'élève toujours nommé | `t-q1-passage1`, `t-q1-tour1`, `b-reponse` |
| 433 | « ✅ Dernière question close — lance l'autoévaluation » | `c-q3-close` |
| 436, 449 | « ⛔ Retirer le point d'autonomie », sa garde, « ↩️ Rendre », à la console, au téléphone, dans la fiche | `c-autonomie`, `c-autonomie-garde`, `c-autonomie-retiree`, `p-autonomie`, `c-fiche`, `c-fiche-garde`, `c-fiche-retire` |
| 439 | « ⛔ Dernier moment » en orange dans la console et le téléphone ; le bandeau orange à liseré rouge | `c-corr-q2-apres`, `p-corr-apres`, `t-corr-q2-apres` |
| 444 | l'estimation, avec la phrase de Paul, sans infobulle | `t-estim` |
| 446, 449 | côté élève, « compétences atteintes / non atteintes » | `t-bilan`, `t-bilan-non-atteinte`, `e-bilan-lou` |
| 450, 508 | « Lis avec soin : c'est ton point d'autonomie. » sous la consigne | `t-corr-q2-lecture`, `x610-3-a-correction`, `b-recopie` |
| 447, 451, 507 | la seconde attestation | `x610-5-attestation-2`, `t-attest-corr-fait`, `c-attest2` |

## Tours 607 à 609 (points 453 à 493)

| Point | Ce qui se voit | Scène(s) |
| --- | --- | --- |
| 473, 484 | le ✓ orange : compteur, bandeau, bilan | `t-corr-q2-apres`, `t-bilan` |
| 455 | « 🏁 Afficher leur bilan aux élèves » à la dernière question | `c-corr-q1-apres`, `c-coeval-tranche` |
| 456, 474 | « Ta note provisoire » et sa phrase | `t-bilan`, `t-bilan-imprime` |
| 457, 458, 476 | « recopie juste, tablette fausse », « Corrigé d'après ta feuille » | `c-fiche`, `c-que-dit-la-feuille`, `e-bilan-lou`, `t-bilan` |
| 460, 463, 477, 490 | « Ma feuille ne dit aucun de ces choix » vaut 0 ; « Que dit la feuille ? » le soir | `t-corr-q3-lecture`, `t-bilan`, `c-que-dit-la-feuille` |
| 462 | pas de lecture (parti) : la note se fixe d'après la feuille | `c-depart`, `c-parti` |
| 464 | la garde de longueur au collage ; « longueur assumée » ; la moitié qui tient (mesures) | `c-collage`, `x627-3-editeur`, `x610-3-a-correction`, `t-annexe` |
| 465 | les listes rangées, avec un tri | `c-evals`, `c-seances` |
| 466, 481 | « 📋 Copier les erreurs pour l'instance de création d'éval » | `c-collage` |
| 467, 491, 492 | le papier seul, de bout en bout, par « ▶️ Reprendre » | `c-papier-lancer`, `c-papier-seance`, `e-papier-enonces`, `c-papier-grille`, `c-papier-reprendre`, `t-papier-estim`, `t-papier-attest`, `c-papier-correction`, `t-papier-correction` |
| 469 | « ⏸️ Finir à une autre heure », la reprise, « 🔓 Rouvrir » | `c-finir-autre-heure`, `c-reprendre`, `c-rouvrir-seance`, `c-interrompue` |
| 470 | le mode test, la même chose que le réel | `x620-1-mode-test-ouverture`, `x620-2-mode-test-reflexion`, `x620-3-mode-test-en-grand` |
| 471 | publiée / non publiée ; copies non rendues → « rendre les copies ▸ » → rendues ; « Masquer les copies » ; « Mes évaluations » | `c-seances`, `c-seances-lues`, `c-rendre`, `c-copies-rendues`, `e-mes-evals`, `e-mes-evals-rendue` |
| 485 | la motivation de la seconde attestation (remplacée par 507 et 510) | `x610-5-attestation-2` |

## Tours 610 à 616 (points 494 à 546)

| Point | Ce qui se voit | Scène(s) |
| --- | --- | --- |
| 495 | B : « dit-elle la même chose que ton clic ? », 5 s, le voile de l'autre en place | `t-q1-b-michel`, `x610-1-b-julien`, `x610-2-b-michel` |
| 496, 503 | A : le voisin lit la feuille, dans la moitié du propriétaire ; « Sa feuille ne dit aucun de ces choix » | `t-corr-q2-lecture`, `t-corr-q3-lecture`, `t-corr-q1-lecture`, `x610-3-a-correction` |
| 497, 529, 530 | « ⚠️ À relire » d'après B, et la liste du soir en faits | `c-corr-q2-apres`, `c-coeval-attente`, `c-fiche` |
| 500 | l'élève seul fait lui-même la lecture | `t-corr-seul`, `c-rattrapage` |
| 502 | plus de « Je ne suis pas sûr » | `t-corr-q2-lecture` |
| 506, 549 | l'attestation, une coche par ligne, chaque ligne après la précédente | `t-attest-1`, `t-attest-2`, `c-pret` |
| 510, 511, 527 | la co-évaluation : « … a-t-il bien lu ta feuille ? », trois choix en suppositions | `t-coeval` |
| 515, 528, 535 à 538 | l'alerte de ta console, dans l'ordre des faits, et ses boutons | `c-coeval-attente`, `c-coeval-feuille`, `c-coeval-tranche` |
| 516, 517 | « 🤔 » passe « ⚠️ À relire » ; « 🏁 » attend que tous aient répondu | `c-coeval-attente`, `c-coeval-tranche` |
| 520, 532, 533 | « c'est laquelle ? », la question cliquée seule, « Qu'avais-tu écrit sur ta feuille ? » | `t-coeval`, `t-coeval-ecrit`, `x610-6-coeval-laquelle`, `x610-7-coeval-ecrit` |
| 526 | le choix enregistré dès le clic, « ↩️ Changer » | `t-coeval-ecrit` |
| 539 | « Tu as cliqué ce que Julien avait lu : vous êtes d'accord. » | `t-coeval-daccord` |
| 541 | « ⛔ à Michel / à Julien / aux deux », chacun sa garde | `c-autonomie-michel`, `c-autonomie-julien`, `c-autonomie-deux`, `c-coeval-retire-deux`, `x610-autonomie-deux`, `x610-9-telephone-alerte` |
| 542 à 545 | le cas ambigu sur l'évaluation de 3e, le tableau des trois lectures, le quatrième bouton | `x610-8-console-alerte`, `x610-feuille`, `x610-tranche` |
| 546 | la liste « c'est laquelle ? » montre le début de chaque énoncé ; « Julien a lu » | `x610-6-coeval-laquelle`, `x610-7-coeval-ecrit` |

## Tours 617 et 618 (points 549 à 564)

| Point | Ce qui se voit | Scène(s) |
| --- | --- | --- |
| 550, 551, 557 | la démo jouée sur les tablettes, son bandeau, rien ne compte, une ligne reste | `c-demo-lancer`, `t-demo-q`, `c-demo-faite` |
| 552 à 554 | la démo permanente, en tête, « 🔒 Permanente », sans corbeille ; les purges la gardent | `c-evals`, `c-purger`, `c-importer` |
| 558 | l'identification avec les vrais codes | `t-combien`, `t-login`, `t-binome` |
| 560, 563 | la feuille simulée du mode test ; « 🎬 Préparer un cas » | `x620-2-mode-test-reflexion`, `x620-3-mode-test-en-grand` |

## Tours 619 à 623 (points 566 à 599)

| Point | Ce qui se voit | Scène(s) |
| --- | --- | --- |
| 566 à 576 | le mode test : la console d'avant l'heure, 15 tablettes, « 🔬 », « 🎲 », « 🔍 Jouer en grand » | `x620-1-mode-test-ouverture`, `x620-2-mode-test-reflexion`, `x620-3-mode-test-en-grand` |
| 585, 590 | « 🚫 Jamais avec… » dans MJPC, au plus 3, la quatrième refusée avec la raison | `m-classe-exclusions`, `m-exclusion-refusee` |
| 587, 594 | les binômes formés d'abord par les exclusions, puis par le QCM précédent | `c-lancer` |
| 589 | un échange qui mettrait deux exclus ensemble : refusé, pour Paul seul | `c-echange-refuse` |
| 594 | l'autre moitié nomme le binôme ; l'élève à la mauvaise tablette | `t-binome`, `t-rejoins` |
| 595 | le rattrapage par les exclusions, plus de placement libre | `c-rattrapage` |

## Tours 624 à 632 (points 600 à 658)

| Point | Ce qui se voit | Scène(s) |
| --- | --- | --- |
| 602 à 608, 643 | le PDF « notes et compétences » de gen632.js, mot pour mot | `x632-pdf` |
| 609 | « 📄 PDF notes et compétences » fermé tant que les copies ne sont pas rendues | `c-resultats`, `c-resultats-rendues` |
| 621 à 625, 630, 652 à 657 | « 📝 Bilan général » pré-rempli par com632.js, « ↻ Regénérer », « ✓ Valider le bilan » | `c-fiche` |
| 623 | le bilan de l'élève qui finit par « 📝 Bilan » | `e-bilan-lou` |
| 629, 631, 633 | « 🎯 Ce qu'elle vérifie » dans l'éditeur ; la garde au collage | `x627-3-editeur`, `c-collage` |
| 636 à 640, 644 | le libellé élève partout où l'élève voit une compétence (bilans, attestations, phrase sous la question) | `t-bilan`, `e-bilan-lou`, `x610-5-attestation-2`, `t-papier-attest` |
| 637 | l'éditeur de taxonomie avec « Les compétences » et leur libellé élève | `m-taxonomie-competences` |
| 647 à 650 | le prompt dans Réglages ; les jetons remplis à la copie | `c-reglages`, `c-reglages-prompt` |
| 649 | les durées de la séance (Réglages, la durée estimée) | `c-reglages`, `c-lancer` |
| 108, 131 | les niveaux de maîtrise et l'échelle de la note | `c-reglages` |


### Complément 1 (tours 638 et 639, points 680 à 696)

| Point | Ce qui se voit | Scène(s) |
| --- | --- | --- |
| 681 (D1) | MJPC tel qu'`index.html` le dessine : le menu du panneau prof (12 entrées grisées), « Élèves & codes » avec la clé, l'import, ↻, ✕ et « 🚫 Jamais avec… » après le ◆ ; la fiche de l'élève ; la Taxonomie sur la vraie taxonomie (1.4.0, 7 domaines, 210 notions), un domaine ouvert, une notion et une compétence en modification | `m-classe-exclusions`, `m-exclusion-refusee`, `m-fiche-eleve`, `m-taxonomie`, `m-taxonomie-editeur`, `m-taxonomie-domaine`, `m-taxonomie-notion`, `m-taxonomie-competences`, `m-taxonomie-competence` |
| 682 (D2) | aucun renvoi au cadrage dans la console ; les infobulles de la 7.7.1 ; le prompt tel que l'app le copie, et en modification avec « 🔄 Restaurer le prompt par défaut » | `c-reglages`, `c-reglages-prompt`, `c-reglages-prompt-modifier`, toutes les scènes de console |
| 683 (D3) | le prompt porte les nouvelles limites de longueur | `c-reglages-prompt` |
| 684, 691 (D4) | « 👀 Écoute le prof — la correction sera révélée. » avant la révélation | `t-corr-q2-lecture`, `t-corr-q3-lecture`, `t-corr-q1-lecture`, `t-corr-seul`, `x610-3-a-correction` |
| 692 (D5) | le PDF « notes et compétences » sans encadré ni souligné | `x632-pdf` |
| 686 (D6) | « Tu as nettement surestimé ce que tu avais réussi. » dans le bloc « 🎯 Ton estimation » de Michel, comme son bilan général | `t-bilan`, `t-bilan-non-atteinte`, `c-fiche` |


### Complément 2 (tours 640 à 644, points 700 à 717)

| Point | Ce qui se voit | Scène(s) |
| --- | --- | --- |
| 700, 707, 708 (défaut 7) | les entrées fermées du menu et « Code professeur » estompées, la souris barrée, leur raison au survol | toutes les scènes `m-…` |
| 710, 711, 713 (dette n°12 · 87) | le panneau prof bord à bord, à toutes les tailles de la console | toutes les scènes `m-…` |
| 710, 711, 713, 715 (dette n°12 · 88) | ↻ et ✕ dans chaque carte, à droite, sur la ligne du nom | `m-classe-exclusions`, `m-exclusion-refusee` |
| 712, 713, 714 (n°12 · 212) | « 📅 Emploi du temps » avec ses vraies données : la rangée en trois groupes, « ⤓ Sortir le JSON » en cases, un objet coché, tous les objets cochés | `m-emploi-du-temps`, `m-emploi-du-temps-un`, `m-emploi-du-temps-tous` |


## Le journal des défauts


| N° | Étape | Défaut | Cause | Correction | Garde ajoutée au banc |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | La maquette assemblée s'ouvrait sur une page blanche (aucune scène rendue). | `build.py` retirait toutes les lignes `rendre();` des morceaux, y compris le dernier appel, celui du socle. | Le socle garde son appel ; seuls les morceaux anciens perdent le leur. | 1 : « la scène montre quelque chose » (déjà là) |
| 2 | 1 | Les scènes des tours 626 et 627 auraient montré le commentaire d'un autre tour. | Les fichiers `com626.js`, `com627.js`, `com628.js` (et `com632.js`) déclaraient tous `commentaireQCM` : dans un seul script, la dernière déclaration gagne partout. | À l'assemblage, chaque morceau garde le sien (`commentaireQCM_626`…) ; `com632.js` garde `commentaireQCM`. | 9 : le commentaire est celui de com632 (à l'étape 4) |
| 3 | 1 | Le PDF « notes et compétences » était coupé à 1 220 px dans sa scène. | L'aperçu avait une hauteur fixe. | L'aperçu prend la hauteur de son contenu à son chargement, et la scène attend ce chargement pour se dire prête. | 1 et 9 : la scène montre le PDF entier, mot pour mot |
| 4 | 1 | Deux captures identiques (t-fin et t-combien). | Voulu : à « Terminer », la tablette revient à « Combien êtes-vous sur cette tablette ? » (cadrage 64). | Déclaré dans `capture.js` (liste des doublons voulus) ; tout autre doublon est signalé. | capture : md5 de chaque image |
| 5 | 2 | Le banc ne finissait pas : arrêté au bout de 30 minutes. | Pour chaque bouton cliqué, un navigateur neuf était ouvert (des milliers d'ouvertures). | La scène est remise à neuf sur place (démontée, puis rendue de nouveau) avant chaque clic, et quatre scènes se vérifient à la fois : 4 min 42 pour tout. | — |
| 6 | 2 | 400 « ne se clique pas » : les boutons de la console derrière une fenêtre ouverte. | Le banc cliquait aussi les boutons recouverts par la fenêtre, que personne ne peut cliquer. | Le banc ne clique que les boutons de la couche du dessus ; un bouton recouvert n'est pas un geste de la scène. | 5 |
| 7 | 2 | « ❌ Écarter » et « ⚠️ Annuler », dans « 📋 Toutes les questions », ne faisaient rien. | Aucune destination. | Ils ouvrent leur garde (`c-ecarter`, `c-annuler`). | 5 : « chaque bouton déclare son geste » (nouvelle) |
| 8 | 2 | Les lignes déjà cochées de l'attestation étaient grisées sans dire pourquoi. | Infobulle trop courte (« Cochée. »). | « Cette ligne est déjà cochée. » | 5 |
| 9 | 2 | B : le clic figé restait cliquable, et ne faisait rien. | Seuls les autres choix étaient grisés. | Tous les choix sont grisés, avec la raison ; le clic figé reste lisible (pleine couleur). | 5 |
| 10 | 2 | « 🔄 Chrono » du téléphone ne faisait rien. | Le chrono du téléphone était un texte fixe. | Un chrono à état, que « 🔄 Chrono » relance. | 5 : « chaque bouton déclare son geste » |
| 11 | 2 | « 🖊️ POSE TON STYLO. » au tableau, introuvable dans le validé. | L'émoji (le stylo qui remplace le livre, 431) était collé à la phrase. | L'émoji est à part ; la phrase est celle de la 7.7.1. | 3 |
| 12 | 2 | Le ✕ d'une fenêtre chevauchait son titre (QR pilotage, mode d'emploi). | Le titre allait jusqu'au bord droit, sous le ✕. | Le titre s'arrête avant le ✕. | 8 |
| 13 | 2 | « Annuler » de « 🔓 Rouvrir pour un élève » ne faisait rien. | Aucune destination. | Il ferme la fenêtre (retour à la question 2 close). | 5 : « chaque bouton déclare son geste » |
| 14 | 2 | Deux captures identiques : l'estimation et celle de la reprise sur papier. | La scène papier reprenait la même scène. | La scène papier montre un autre moment (Michel a choisi, Julien pas encore). | capture : md5 |
| 15 | 2 | Des noms coupés au milieu (« CHEVALLIE R Théo ») dans la grille des binômes. | La grille autorisait la coupe n'importe où. | Les noms ne se coupent qu'entre deux mots. | 8 (relu sur capture) |
| 16 | 2 | L'onglet ou le mode déjà en cours comptait comme un bouton inerte. | Il ramène à la scène elle-même. | Marqué « en cours » (`actif`, `aria-pressed`) et non compté ; tout autre bouton qui ne change rien reste un défaut. | 5 |

*Défaut revenu deux fois ou plus : le bouton sans geste (7, 10, 13). Garde ajoutée : « chaque bouton déclare son geste » — tout bouton actif de la couche du dessus a une destination, un composant à état, ou est une case qui se coche sur place.*
| 17 | 3 | La moitié de lecture de la vraie question 3 de 3e débordait de 202 px (610-3). | La consigne, le compteur des 11 questions et le chrono empilés. | Les mêmes blocs, resserrés (le chrono à côté de « Lis avec soin ») : 0 px, rien retiré. | 2 |
| 18 | 3 | Le bilan de l'élève débordait de sa demi-tablette (≈ 160 px). | La note provisoire (474), les deux compétences d'autonomie et les libellés élève allongent le bilan. | Les mêmes blocs, resserrés dans la moitié (note sur une ligne, textes plus petits). | 2 |
| 19 | 3 | « 👀 Écoute le prof — la correction sera révélée. » côté élève. | Phrase de la 7.7.1, contraire à la règle « jamais le professeur ». | Retirée : après son clic, l'élève lit « ✅ Réponse enregistrée — tu peux encore la changer ». | 4 (déjà) |
| 20 | 3 | Infobulles côté élève (compteur de la correction, estimation du bilan). | Reprises des maquettes 603 et 610. | Retirées : aucune consigne en infobulle côté élève. | 4 (déjà) |
| 21 | 3 | « ⏸️ Finir à une autre heure », « Question suivante → » du téléphone, les boutons de l'alerte du cas ambigu : sans infobulle et sans geste. | Ajoutés sans destination. | Chacun mène à sa scène (garde, alerte tranchée, « Que dit la feuille ? ») avec son infobulle. | 5 : « chaque bouton déclare son geste » |
| 22 | 3 | « 🔒 Afficher leur bilan — il en manque 4 », sur le téléphone, cliquable et inerte. | Le bouton « fermé » n'était grisé que par sa couleur. | Un bouton fermé du téléphone est grisé pour de bon, avec sa raison. | 5 |
| 23 | 3 | L'élève seul sur sa tablette : la tablette dépassait l'écran, et le banc ne le voyait pas. | Le banc ne mesurait que les moitiés. | La scène resserrée ; **garde ajoutée** : une tablette d'un seul élève tient aussi dans l'écran. | 2 (nouvelle) |
| 24 | 3 | Après « ⛔ aux deux », la console disait « raison donnée à Michel ». | La garde menait à l'alerte tranchée. | Chaque garde mène à sa scène : le point retiré, l'alerte toujours à trancher. | relu sur capture |
| 25 | 3 | Variante papier de la seconde attestation : « V vert » et « Barre ta réponse » sans dire quand. | Les deux consignes de la 7.7.1 sans leur début. | Elles gardent leur début de la 7.7.1 : « ✅ Bravo ! » et « ❌ Tu avais faux. » | relu sur capture |
| 26 | 3 | « Tu les atteins si tu fais ce travail avec soin. » introuvable. | Le point remplaçait les deux-points de 447. | Les mots de 447, mot pour mot. | 3 |
| 27 | 4 | Une faute de syntaxe dans `etape4.js` : la page blanche, et le banc arrêté sans sortie lisible. | Une guillemet oubliée. | Corrigée ; **garde ajoutée** : `build.py` refuse d'assembler un script qui ne se compile pas (`node --check`). | assemblage (nouvelle) |
| 28 | 4 | Un banc arrêté laissait la sortie du banc précédent, qu'on pouvait relire à tort. | La sortie n'était écrite qu'à la fin. | **Garde ajoutée** : la sortie est effacée au départ, et un arrêt fatal l'écrit. | banc (nouvelle) |
| 29 | 4 | Le PDF « mot pour mot » échouait. | Le banc comparait aussi le `<title>` de la page, que l'aperçu n'affiche pas. | Le titre est écarté de la comparaison ; le corps reste comparé mot pour mot. | 9 |
| 30 | 4 | Le bilan général affiché dans le bilan de Lou passait par la provenance phrase par phrase, et une phrase d'exemple (« dire combien de pattes… ») y était introuvable. | Le commentaire se vérifie autrement : il doit être celui de com632.js. | **Vérification 9 ajoutée** : chaque commentaire affiché est comparé, mot pour mot, à celui que com632.js écrit pour la même entrée ; il sort de la vérification 3. | 9 (nouvelle) |
| 31 | 4 | « NOM Prénom » (consigne de MJPC) pris pour un vrai élève. | Le banc lit deux mots en capitale suivis d'un prénom. | « NOM » ajouté aux mots permis. | 7 |
| 32 | 4 | Les noms des tablettes du mode test coupés (« CHOLET Pierre … »). | Titre sur une ligne, avec points de suspension. | Le titre passe à la ligne. | 8 |
| 33 | 4 | « 💾 Enregistrer » des Réglages, et les cases d'exclusion après un refus, ne changeaient rien. | Retour à la même scène ; refus affiché à nouveau. | Un enregistrement dit « ✅ Enregistré » ; un second clic sur la case refusée ferme le refus. | 5 |
| 34 | 4 | Exclusions dissymétriques dans la scène du refus (Inès exclue de Sacha, mais pas Sacha d'Inès). | Les trois exclusions n'étaient posées que d'un côté. | Posées dans les deux sens ; le compte de la classe suit. | relu sur capture |
| 35 | 4 | L'éditeur coupé avant la question 11 (« longueur assumée ») sur la capture. | Hauteur de la scène trop courte. | Scène à 3 250 px. | relu sur capture |


### Complément 1 (`MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md`)

*Les défauts du §3 (D1 à D6) et tout ce que les cinq nouvelles gardes ont trouvé sur la v5 (`sorties/gardes-sur-v5.txt`), à partir du n° 36. La colonne « garde » nomme la garde du complément qui le trouve désormais.*

| N° | Étape | Défaut | Cause | Correction | Garde |
| --- | --- | --- | --- | --- | --- |
| 36 | B | D1 — « Élèves & codes », la fiche de l'élève et « Taxonomie » étaient redessinés, avec des chiffres inventés. | La v5 disait « le panneau prof est redessiné » : rien n'était tiré d'`index.html`. | `src/mjpc.js` reprend le balisage, les classes CSS (`src/mjpc.css`, extraites par `outils/css-mjpc.py`) et les textes d'`index.html`, ligne par ligne ; la vraie taxonomie copiée avec son md5 (`src/donnees/`) ; les 12 entrées de menu sans scène grisées avec leur raison ; six scènes nouvelles (`m-fiche-eleve`, `m-taxonomie`, `m-taxonomie-editeur`, `m-taxonomie-domaine`, `m-taxonomie-notion`, `m-taxonomie-competence`). | 1 et 3 |
| 37 | B | D2 — « Le prompt du cadrage (tour 630). » et « (340) » dans Réglages ; l'infobulle de « 📖 Mode d'emploi » (« réécrit d'après le cadrage »), dans 85 scènes ; « Remet le prompt du cadrage (tour 630)… ». | Des renvois au cadrage écrits pour Paul, dans la console. | Les deux phrases sans renvoi ; les infobulles de la 7.7.1 mot pour mot. | 2 |
| 38 | B | Le prompt n'avait ni la fenêtre ni les gestes de la 7.7.1 : « 📋 Copier », « 💾 Enregistrer » et « Annuler » menaient tous aux Réglages ; « 🔄 Restaurer » ne demandait rien ; les jetons `{{…}}` restaient visibles. | La fenêtre était une maquette du texte, pas de la fenêtre. | `c-reglages-prompt` : la fenêtre de la 7.7.1 (l. 6431 à 6505), le prompt tel que l'app le copie, chaque jeton rempli d'après les vraies données (le chapitre 1 de 3e et ses 12 compétences, les libellés élève, les difficultés sans temps, les durées de 649, les limites des mesures) ; « 📋 Copier » dit « ✅ Prompt copié dans le presse-papiers ». Scène nouvelle `c-reglages-prompt-modifier` : le gabarit modifiable, jetons compris, « 💾 Enregistrer » (« ✅ Consignes enregistrées — elles te suivent d'un appareil à l'autre. »), « ↩️ Annuler », « 🔄 Restaurer le prompt par défaut » avec la boîte « confirm » de la 7.7.1 dessinée, son texte exact. | 1 et 3 |
| 39 | B | Une centaine d'infobulles de gestes qui existent déjà n'étaient pas celles de la 7.7.1 (l'en-tête de la console, le pilotage, la correction, le collage, l'éditeur, Sauvegarde, le mode test). | Réécrites pour Paul à chaque étape, sans distinguer ce que le cadrage change. | Les infobulles de la 7.7.1, mot pour mot (`TITRES_771`, `src/complement1.js`, posées par `poserGestes`) ; celles que le cadrage change gardent leur texte, avec le point cité dans `banc/existant/retraits.json`. | 1 |
| 40 | B | Des éléments de la 7.7.1 perdus sans point du cadrage : les infobulles des compteurs du pilotage, du bandeau d'état, des cartes « Question en cours / passée », de la correction (position, niveau, taux), de la bande des questions du téléphone ; « Nombre de points que vaut cette question » ; « ✓ J'ai compris » ; « 📊 Mes évaluations » côté élève ; dans l'éditeur, le champ JSON et « 🔍 Vérifier le format », les indications des champs, la case des bonnes réponses, « ➕ Ajouter une question » ; l'indication du JSON au collage ; « Question suivante → » fermé avant la révélation ; « 🔓 Rouvrir Q2 » du téléphone devenu « … pour tous » ; la bande des questions absente du téléphone avant la révélation. | Les écrans refaits sans inventaire de l'existant. | Tous rétablis, avec les mots de la 7.7.1. « 📊 Mes évaluations » se place à côté du nom de l'élève et pas sous la carte : sur une demi-tablette, la place sous la carte est celle des choix (464) ; l'étalon reste à 67 px. | 1 |
| 41 | B | D4 — « 👀 Écoute le prof — la correction sera révélée. » absente (défaut 19 de la v5). | Le banc interdisait « le prof » côté élève. | Rétablie sous les choix, à la lecture du voisin, dans toutes les scènes d'avant la révélation (`t-corr-q1/q2/q3-lecture`, `t-corr-seul`, `x610-3-a-correction`) ; « ✅ Réponse enregistrée — tu peux encore la changer » reste là où 526 la met. La vérification 4 n'interdit plus que « va voir », « viens me voir », « venez me voir ». Sur la vraie question 3 de 3e, l'écran de lecture est resserré pour tenir (20 px de reste). | 1 et 4 |
| 42 | B | D5 — le PDF portait l'encadré « Exemple de la maquette… » et 121 soulignés orange. | `pdf632.html` est la sortie de relecture de `gen632.js`. | `build.py` retire l'encadré et le style `.prov` ; la vérification 9 compare le texte, encadré mis à part. | 2 et 9 |
| 43 | B | D6 — le bloc « 🎯 Ton estimation » de Michel disait « un peu surestimé » pour deux niveaux d'écart. | La phrase de la 7.7.1 gardée telle quelle. | `degreSurestime(écart)` : deux niveaux ou plus, « nettement » (632) ; un niveau, « un peu ». Partout où le bloc paraît. Le bloc disait aussi « sur 3 » avec une question annulée : il dit le vrai total. | 5 |
| 44 | B | La garde 3 croyait lire la liste des compétences dans l'éditeur d'évaluation, et exigeait les 28 là où leurs groupes sont fermés. | Elle cherchait des codes dans toute la page. | Elle lit la section « 🧩 Les compétences » : les 8 groupes et leur compte, chaque groupe ouvert en entier, et les 28 quand tous sont ouverts. | 3 |
| 45 | B | La garde 1 comparait les infobulles calculées mot pour mot (« Q10 est la 1e question révélée »). | Les données de la séance jouée sur le faux hub ne sont pas celles de la maquette. | Infobulles comparées à leur forme, comme les libellés (nombres, noms, « pas de réponse » ou « a/b bonnes (x %) »). | 1 |
| 46 | B | Le banc entier, après les corrections : le nom de l'élève chevauchait le titre (élève seul, bilan imprimé) ; la phrase du degré, collée à celle de la 7.7.1, était introuvable dans ce que Paul a validé ; « ex : DUPONT Marie » (l'indication d'`index.html`) pris pour un élève ; « ✏️ Modifier » d'une notion déjà ouverte ne faisait rien. | L'en-tête de l'élève avait perdu sa marge ; deux phrases validées séparément ne faisaient qu'un texte ; l'indication n'était pas déclarée ; `taxoEditerOuvrir` recharge le référentiel (l. 2598), la maquette ne le faisait pas. | La marge rendue ; les deux phrases en deux morceaux ; l'indication déclarée dans le banc avec sa ligne ; « ✏️ Modifier » montre « Chargement du référentiel… » puis le formulaire, comme `taxoRafraichir(true)`. | 3, 5, 7, 8 |
| 47 | C | D3 — les limites de longueur se contredisaient : à énoncé court, 5 choix tenaient 410 caractères et 6 choix 480 ; à 6 choix, la limite tombait de 480 à 120 entre 120 et 150 caractères d'énoncé. | La mesure répartissait les longueurs comme la vraie question 3, autrement à chaque nombre de choix, et donnait un total de choix. | La mesure refaite (`mesures/mesurer.js`, `mesures/mesure-page.js`) : tous les choix à la même longueur, la limite d'un choix, l'énoncé de 40 à 300 par pas de 20, le choix par pas de 5 ; elle ne croît jamais ; l'étalon reste à 67 px ; le texte de `{{LIMITES}}` est dans `limites.json`, et le prompt de Réglages le porte. La vraie question 3 tient, sans respecter la nouvelle limite (137 caractères pour son plus long choix, 70 permis) : `mesures/README.md` le dit. | 4 (et son échantillon rejoué dans la maquette) |


### Complément 2 (`MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2.md`)

*Le défaut 7 de l'audit du complément 1, les dettes n°12 · 87 et 88, la rangée de l'emploi du temps (n°12 · 212), et ce que les gardes 6, 7 et 8 ont trouvé sur la v6 (`sorties/gardes-6-7-8-sur-v6.txt`), à partir du n° 48.*

| N° | Étape | Défaut | Cause | Correction | Garde |
| --- | --- | --- | --- | --- | --- |
| 48 | B | Défaut 7 — les 12 entrées du menu du panneau prof sans scène et « Code professeur » étaient fermés sans le montrer : opacité 1, la couleur d'un bouton qui marche, la main comme curseur ; et leur raison ne se lisait pas au survol (la souris tombe sur le bouton fermé). | Le banc tenait un bouton pour grisé dès qu'il portait `disabled`, sans regarder son aspect. | L'aspect qu'`index.html` donne déjà à un bouton fermé (`.eli-btn:disabled{opacity:.45;cursor:not-allowed}`, l. 860) ; la raison portée par une enveloppe qui reçoit la souris (`src/complement2.js`, `src/complement2.css`). « 📅 Emploi du temps » s'ouvre désormais sur sa scène : il en reste 11 fermés, et « Code professeur ». | 6 |
| 49 | B | 12 boutons fermés de la console du QCM et du téléphone, dans 24 scènes (28 relevés ; « 🔒 Révéler », « ← Question précédente », « 💡 Révélée », « 🔓 Rouvrir pour tous », « 💾 Enregistrer l'évaluation », « 🔒 🏁 Afficher leur bilan… », « ↻ Regénérer », « 📄 PDF notes et compétences »…) : estompés, mais leur raison ne se lisait pas au survol. | Même cause : la souris tombait sur le bouton fermé. | Dans les vues de Paul, chaque bouton fermé est posé dans la même enveloppe, qui porte sa raison (posée aussi quand l'infobulle vient des gestes, `poserGestes`) ; une moitié d'élève montrée dans la console garde ses règles. | 6 |
| 50 | B | Dette n°12 · 87 — le panneau prof était borné à 1 100 px, avec 30 px de marge et des coins arrondis, comme dans le vrai site. | `index.html`, l. 223 et 225, reproduit fidèlement. | Le panneau couvre toute la fenêtre, bord à bord, aux trois tailles de la console ; le reste ne change pas. Écart inscrit (`ecarts-mjpc.json`). | 7 |
| 51 | B | Dette n°12 · 88 — la v6 avait remis ↻ ✕ dans la carte sans le dire : la grille de la ligne d'élève changeait celle d'`index.html` (l. 609) sans écart inscrit. | La v6 corrigeait la ligne sans déclarer l'écart. | Écart inscrit, avec sa raison (la dette 88, et la colonne de « 🚫 Jamais avec… », 585) ; ↻ ✕ dans la carte, sur la ligne du nom, sur chaque ligne. | 7 |
| 52 | B | La rangée de l'emploi du temps (n°12 · 212) : dix éléments sur une rangée qui ne passe jamais à la ligne. | `.edt-actions{display:flex}` sans retour à la ligne (l. 20024), et un bouton par objet et par voie. | Nouvelle scène `m-emploi-du-temps` (et `-un`, `-tous`), partie d'`index.html` avec les données relues au hub : trois groupes, l'un sous l'autre ; « ⤓ Sortir le JSON » en cases, « Tout cocher » et un seul bouton, fermé tant que rien n'est coché ; « 📋 Copier le prompt » par voie. Les retraits citent le point 714. | 1, 8 |
| 53 | B | Mes propres classes `edt-case` et `edt-cases` habillaient les cases de « Sortir le JSON » comme les cases de la semaine. | `edt-case` est une classe du vrai écran de la semaine (edtPoserCss). | Renommées `edt-objet`, `edt-objets`, absentes d'`index.html`. | relu sur capture |


## Scène par scène : ce que Paul peut regarder

*Dans `maquette-qcm-v8.html`, `#scene=ID`, ou le sommaire ⚙. La colonne « Étape » dit quelle étape a fini la scène (1 à 5 : le mandat ; C1 : le complément 1 ; C2 : le complément 2, qui l'a créée). Les mêmes, en images : `captures/NNN-ID.png` et le livret.*

### Préparer l'évaluation

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 1 | `#scene=c-evals` | Pilotage → 📝 Évaluations : rangées par niveau, un tri ; la démo en tête, « 🔒 Permanente ». | 4 |
| 2 | `#scene=c-eval-corbeille` | « 🗑️ » une évaluation : la corbeille, gardée un an. | 4 |
| 3 | `#scene=c-collage` | « ➕ Nouvelle évaluation » : les messages, la garde de longueur, « ce qu'elle vérifie », la durée ; « Copier les erreurs pour l'instance de création d'éval ». | 4 |
| 4 | `#scene=x627-3-editeur` | L'éditeur : « 🎯 Ce qu'elle vérifie », « 📏 longueur assumée » ; chaque geste marque l'évaluation modifiée. | 4 |
| 5 | `#scene=c-feuille` | « 🖨️ Imprimer » : les énoncés seuls, sur une page. | 4 |

### Avant l'heure, sur ta console

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 6 | `#scene=c-accueil` | L'accueil de l'app : « 🎓 Mode élève » ou « Accès professeur ». | 2 |
| 7 | `#scene=c-lancer` | « Pilotage classe » : la classe, l'évaluation, la durée, les binômes formés par les exclusions, puis par le QCM précédent. | 2 |
| 8 | `#scene=c-echange-refuse` | Un échange qui mettrait ensemble deux élèves exclus : refusé, avec la raison, pour toi seul. | 2 |
| 9 | `#scene=c-appel` | L'appel : l'absent sort, son binôme est réapparié ; l'heure de fin. | 2 |
| 10 | `#scene=c-demo-lancer` | La démo, lancée avec la classe : rien ne compte. | 2 |
| 11 | `#scene=c-demo-faite` | La démo faite : il n'en reste qu'une ligne. | 2 |

### L'entrée

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 12 | `#scene=t-combien` | « Combien êtes-vous sur cette tablette ? » | 2 |
| 13 | `#scene=t-un-eleve` | « 1 élève » : le raccourci MJPC demande d'abord « Tu es bien Julien ? ». | 2 |
| 14 | `#scene=t-login` | Le code, le prénom et le nom, au clavier de l'app, sur chaque moitié. | 2 |
| 15 | `#scene=t-login-inconnu` | Un code pas encore enregistré : « lève la main ». | 2 |
| 16 | `#scene=t-binome` | Julien est entré ; l'autre moitié nomme son binôme. | 2 |
| 17 | `#scene=t-rejoins` | Michel s'est assis à la mauvaise tablette : « Tu es avec Julien… rejoins Julien. » | 2 |
| 18 | `#scene=t-attest-1` | L'attestation, une coche par ligne : chaque ligne n'apparaît qu'après la précédente. | 2 |
| 19 | `#scene=t-attest-2` | Julien a tout coché : « Je commence » s'ouvre ; Michel en est à 5 lignes sur 8. | 2 |
| 20 | `#scene=t-pret` | Les deux ont coché : ils attendent le départ. | 2 |
| 21 | `#scene=c-pret` | Ta console avant la question 1 : les 12 tablettes, qui est assis où, où en est chaque attestation. | 2 |

### La démo, sur les tablettes

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 22 | `#scene=t-demo-q` | La démo : le bandeau « 🎓 Évaluation d'entraînement : elle ne compte pas. », du début à la fin. | 2 |

### Question 1 — Julien commence

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 23 | `#scene=t-q1-reflexion` | Réflexion : l'énoncé sans les choix, le chrono. | 2 |
| 24 | `#scene=c-q1-reflexion` | Ta console pendant la réflexion : les deux temps à taper, la fin prévue, « ❌ Écarter ». | 2 |
| 25 | `#scene=t-q1-passage1` | Fin de la réflexion : « Pose ton stylo, Julien. Tu es prêt ? À toi dans 3 secondes » ; Michel est voilé, nommé. | 2 |
| 26 | `#scene=t-q1-tour1` | 1er tour : Julien répond ; Michel est voilé. | 2 |
| 27 | `#scene=c-q1-tour1` | Ta console au 1er tour. | 2 |
| 28 | `#scene=c-voir-tablette` | « 👁 » : les deux moitiés d'une tablette, en direct. | 2 |
| 29 | `#scene=p-reponse` | Ton téléphone au 1er tour : les temps en direct, la fin prévue. | 2 |
| 30 | `#scene=c-qr` | « 📱 QR pilotage ». | 2 |
| 31 | `#scene=b-reponse` | Le tableau en réponse : l'énoncé, le chrono, « 1er tour », jamais les choix. | 2 |
| 32 | `#scene=c-fin-prevue` | Du temps ajouté : la fin prévue déborde, en rouge. | 2 |
| 33 | `#scene=t-q1-passage2` | Le passage, dans l'autre sens. | 2 |
| 34 | `#scene=t-q1-tour2` | 2e tour : Michel répond, choix mélangés ; il clique Venise. | 2 |
| 35 | `#scene=t-q1-b-michel` | Son temps fini, Michel dit si sa feuille dit la même chose que son clic : sa feuille dit Rome. | 2 |
| 36 | `#scene=c-q1-tour2` | Ta console au 2e tour : « 🔒 Clore la question ». | 2 |
| 37 | `#scene=t-q1-attente` | Les deux tours sont finis : « Attends la prochaine question ». | 2 |
| 38 | `#scene=c-q1-close` | Question close : « ▶️ Lancer Q2 ». | 2 |
| 39 | `#scene=c-ecarter` | « ❌ Écarter » la question 3 : la garde. | 2 |
| 40 | `#scene=c-ecartee` | La question 3 écartée : « ❌ Écartée — pas posée », « ↩️ Remettre ». | 2 |
| 41 | `#scene=t-q2-ecartee` | Les tablettes comptent sans elle : « Question 2 / 2 ». | 2 |

### Question 2 — Michel commence

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 42 | `#scene=t-q2-reflexion` | Question 2 : deux bonnes réponses, en tout ou rien. | 2 |
| 43 | `#scene=t-q2-tour1` | Michel répond le premier. | 2 |
| 44 | `#scene=t-q2-tour2` | Julien répond en second, dans un autre ordre. | 2 |
| 45 | `#scene=c-q2-tour2` | Ta console au 2e tour de la question 2. | 2 |
| 46 | `#scene=c-q2-close` | Question 2 close : Théo n'a pas répondu. | 2 |
| 47 | `#scene=c-annuler` | « ⚠️ Annuler » une question déjà posée : la garde. | 2 |
| 48 | `#scene=c-annulee` | La question 2 annulée : « ⚠️ Annulée — posée, puis annulée ». | 2 |
| 49 | `#scene=c-rouvrir-tous` | « 🔓 Rouvrir pour tous » : seulement ceux qui n'ont pas répondu. | 2 |
| 50 | `#scene=c-rouvrir-un` | « 🔓 Rouvrir pour un élève » : Théo. | 2 |
| 51 | `#scene=t-rouvrir-un` | La tablette de Théo, rouverte ; Lou porte le voile. | 2 |
| 52 | `#scene=p-eleve` | Ton téléphone : un clic sur Théo ouvre sa fiche. | 2 |

### Question 3 — Julien commence

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 53 | `#scene=t-q3-tour1` | Julien clique sur 6. | 2 |
| 54 | `#scene=x610-1-b-julien` | B sur la vraie question 3 de l'évaluation de 3e : Julien dit si sa feuille dit la même chose que son clic. | 2 |
| 55 | `#scene=t-q3-tour2` | Michel clique sur 10 ; sa feuille dit « 16 pattes ». | 2 |
| 56 | `#scene=x610-2-b-michel` | B, second tour, sur l'évaluation de 3e : Michel. | 2 |
| 57 | `#scene=c-q3-close` | Dernière question close : « ✅ Dernière question close — lance l'autoévaluation ». | 2 |

### Les gestes rares de la séance

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 58 | `#scene=c-depart` | « 🚫 Départ d'un élève ». | 2 |
| 59 | `#scene=c-parti` | Noah est parti : il ne bloque plus ; son binôme continue seul. | 2 |
| 60 | `#scene=c-retour` | « ↩️ Retour d'un élève ». | 2 |
| 61 | `#scene=c-deplacer` | Deux élèves échangés pendant la séance : leurs réponses les suivent. | 2 |
| 62 | `#scene=t-deplace` | La moitié de l'élève déplacé : « Julien, va sur la tablette de Lou ». | 2 |
| 63 | `#scene=c-terminer` | « 🛑 Terminer la session » : la garde. | 2 |
| 64 | `#scene=c-mode-emploi` | « 📖 Mode d'emploi », réécrit d'après le cadrage. | 2 |
| 65 | `#scene=c-finir-autre-heure` | « ⏸️ Finir à une autre heure » : la séance garde son état exact. | 3 |
| 66 | `#scene=c-reprendre` | À l'heure suivante : « ▶️ Reprendre la séance du 09/10 — question 1, 1er tour ». | 3 |
| 67 | `#scene=c-rouvrir-seance` | « 🔓 Rouvrir » une séance terminée : la garde. | 3 |
| 68 | `#scene=c-sessions` | « 🔴 1 session en cours » : aller au pilotage, ou terminer. | 3 |
| 69 | `#scene=c-interrompue` | La séance interrompue : reprendre, finir à une autre heure, ou terminer définitivement. | 3 |

### L'estimation

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 70 | `#scene=t-estim` | L'estimation : « Combien de bonnes réponses penses-tu avoir ? … », sans infobulle. | 3 |
| 71 | `#scene=c-estim` | Ta console pendant l'estimation : « 📝 Lancer la correction ». | 3 |

### La correction

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 72 | `#scene=x610-5-attestation-2` | La seconde attestation, une coche par ligne, les compétences par leur libellé élève. | 3 |
| 73 | `#scene=t-attest-corr-fait` | Julien a tout coché : il attend ; Michel en est à 4 lignes sur 5. | 3 |
| 74 | `#scene=c-attest2` | Ta console attend que tous les présents aient coché la seconde attestation. | 3 |
| 75 | `#scene=t-corr-q2-lecture` | A : Michel lit la feuille de Julien et clique, dans la moitié de Julien ; Julien n'a pas encore lu celle de Michel. | 3 |
| 76 | `#scene=c-corr-q2-avant` | La correction commence par la question la plus ratée ; « 🔒 Révéler » attend que toutes les feuilles soient lues. | 3 |
| 77 | `#scene=p-corr-avant` | Ton téléphone, avant la révélation : les feuilles pas encore lues. | 3 |
| 78 | `#scene=b-recopie` | Le tableau pendant la lecture : l'énoncé, sans les choix. | 3 |
| 79 | `#scene=c-corr-q2-lu` | Toutes les feuilles sont lues : « 💡 Révéler » s'ouvre. | 3 |
| 80 | `#scene=c-corr-q2-apres` | Après la révélation : « ⛔ Dernier moment » en orange, « ⚠️ À relire » d'après B ; un clic sur un nom agit sur l'élève. | 3 |
| 81 | `#scene=p-corr-apres` | Ton téléphone après la révélation. | 3 |
| 82 | `#scene=b-correction` | Le tableau après la révélation : les choix, les bonnes en vert. | 3 |
| 83 | `#scene=t-corr-q2-apres` | La tablette corrige d'après la lecture du voisin : Julien, « Trouvée au dernier moment », le ✓ orange. | 3 |
| 84 | `#scene=t-corr-q3-lecture` | Question 3 : Julien lit « aucun de ces choix » sur la feuille de Michel. | 3 |
| 85 | `#scene=c-corr-q3-apres` | Ta console après la révélation de la question 3. | 3 |
| 86 | `#scene=t-corr-q3-apres` | Julien et Michel ont faux. | 3 |
| 87 | `#scene=t-corr-q1-lecture` | Question 1 : Julien lit Venise sur la feuille de Michel, qui dit Rome. | 3 |
| 88 | `#scene=t-corr-q1-apres` | Question 1 révélée : Michel a faux, d'après la lecture de Julien. | 3 |
| 89 | `#scene=c-corr-q1-apres` | Dernière question révélée : « 🏁 Afficher leur bilan aux élèves ». | 3 |
| 90 | `#scene=x610-3-a-correction` | A sur la vraie question 3 de l'évaluation de 3e : la moitié tient dans l'écran. | 3 |
| 91 | `#scene=t-corr-seul` | Un élève seul sur sa tablette (rattrapage) : il lit lui-même sa feuille ; pas de co-évaluation. | 3 |

### Le point d'autonomie

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 92 | `#scene=c-autonomie` | Un clic sur un nom : « ⛔ Retirer le point d'autonomie ». | 3 |
| 93 | `#scene=c-autonomie-garde` | La garde : ses deux compétences d'autonomie passent en Maîtrise insuffisante ; la note ne bouge pas. | 3 |
| 94 | `#scene=c-autonomie-retiree` | Le point retiré : « ↩️ Rendre » le défait. | 3 |
| 95 | `#scene=p-autonomie` | Le même geste, sur ton téléphone. | 3 |

### La co-évaluation de la lecture

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 96 | `#scene=t-coeval` | Julien n'a rien cliqué ; Michel a cliqué « ❌ » : « c'est laquelle ? ». | 3 |
| 97 | `#scene=t-coeval-ecrit` | Michel a cliqué la question 1 : « Qu'avais-tu écrit sur ta feuille ? » ; Julien a répondu « ✅ ». | 3 |
| 98 | `#scene=t-coeval-daccord` | Michel a cliqué ce que Julien avait lu : « vous êtes d'accord », retour aux trois choix. | 3 |
| 99 | `#scene=c-coeval-attente` | Ta console : l'alerte, dans l'ordre des faits ; « 🏁 » attend les 4 derniers. | 3 |
| 100 | `#scene=c-coeval-feuille` | « La feuille dit autre chose : je clique ce qu'elle dit ». | 3 |
| 101 | `#scene=c-autonomie-michel` | « ⛔ à Michel » : la garde. | 3 |
| 102 | `#scene=c-autonomie-julien` | « ⛔ à Julien » : la garde. | 3 |
| 103 | `#scene=c-autonomie-deux` | « ⛔ aux deux » : la garde. | 3 |
| 104 | `#scene=c-coeval-retire-michel` | Le point d'autonomie retiré à Michel : l'alerte reste à trancher. | 3 |
| 105 | `#scene=c-coeval-retire-julien` | Le point d'autonomie retiré à Julien : l'alerte reste à trancher. | 3 |
| 106 | `#scene=c-coeval-retire-deux` | « ⛔ aux deux » : les deux points retirés ; l'alerte reste à trancher. | 3 |
| 107 | `#scene=c-coeval-tranche` | L'alerte tranchée, tous ont répondu : « 🏁 Afficher leur bilan aux élèves » s'ouvre. | 3 |
| 108 | `#scene=x610-6-coeval-laquelle` | Le cas ambigu, sur l'évaluation de 3e : Michel a cliqué « ❌ » : « c'est laquelle ? ». | 3 |
| 109 | `#scene=x610-7-coeval-ecrit` | Michel a cliqué la question 3 : « Qu'avais-tu écrit sur ta feuille ? ». | 3 |
| 110 | `#scene=x610-8-console-alerte` | Ta console : l'alerte du cas ambigu, les trois lectures de la feuille. | 3 |
| 111 | `#scene=x610-feuille` | Le cas ambigu : « La feuille dit autre chose : je clique ce qu'elle dit » — C et E. | 3 |
| 112 | `#scene=x610-autonomie-michel` | « ⛔ à Michel » : la garde. | 3 |
| 113 | `#scene=x610-autonomie-julien` | « ⛔ à Julien » : la garde. | 3 |
| 114 | `#scene=x610-autonomie-deux` | « ⛔ aux deux », pour le cas où aucun n'a joué le jeu : la garde. | 3 |
| 115 | `#scene=x610-tranche` | Le cas ambigu tranché : « 🏁 Afficher leur bilan aux élèves » s'ouvre. | 3 |
| 116 | `#scene=x610-9-telephone-alerte` | Ton téléphone, au même moment. | 3 |

### La fin de l'heure

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 117 | `#scene=t-bilan` | Le bilan de chacun : « Ta note provisoire », les libellés élève, le ✓ orange, l'autonomie atteinte. | 3 |
| 118 | `#scene=t-bilan-imprime` | « 📄 Imprimer / Exporter mon bilan » : le bilan, tel qu'il s'imprime. | 3 |
| 119 | `#scene=t-bilan-annulee` | Si la question 2 avait été annulée : « Question 2 · annulée : elle ne compte pas. », la note sur 2. | 3 |
| 120 | `#scene=t-bilan-non-atteinte` | Après « ⛔ aux deux » : les deux compétences d'autonomie « non atteinte ». | 3 |
| 121 | `#scene=c-bilan` | Ton bilan de classe. | 3 |
| 122 | `#scene=t-fin` | Tu as terminé : la tablette revient à « Combien êtes-vous ? ». | 3 |

### La séance sur papier

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 123 | `#scene=c-papier-lancer` | « 📄 Séance sur papier » au lancement. | 3 |
| 124 | `#scene=c-papier-seance` | La séance sur papier : les énoncés imprimés, puis « ⏸️ Feuilles ramassées ». | 3 |
| 125 | `#scene=e-papier-enonces` | Les énoncés seuls, sur une page, avec les points. | 3 |
| 126 | `#scene=c-papier-grille` | Le soir : la grille, un élève par ligne, un clic pour ✓ ou ✗. | 3 |
| 127 | `#scene=c-papier-reprendre` | L'heure suivante : « ▶️ Reprendre la séance du 09/10 — correction ». | 3 |
| 128 | `#scene=t-papier-estim` | Les binômes reprennent les tablettes : l'estimation. | 3 |
| 129 | `#scene=t-papier-attest` | La seconde attestation, variante papier : chacun corrige sa feuille au stylo. | 3 |
| 130 | `#scene=c-papier-correction` | Ta console : « 💡 Révéler » tout de suite, d'après ta grille. | 3 |
| 131 | `#scene=t-papier-correction` | Chaque moitié montre ce que ta grille a retenu de la feuille, puis la réponse. | 3 |

### Le soir, sur ta console

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 132 | `#scene=c-seances` | Données → Résultats : les séances rangées par classe, un tri ; « publiée », « copies non rendues ». | 4 |
| 133 | `#scene=c-resultats` | Le tableau d'une séance : ✓, ✗, ⛔ ou ∅, la note, les compétences, l'autonomie, les feuilles à lire ; le PDF fermé. | 4 |
| 134 | `#scene=c-fiche` | La fiche de Michel : sa feuille lue par Julien, sa tablette, ce qu'il a dit ; « ⛔ Retirer le point d'autonomie » ; « 📝 Bilan général ». | 4 |
| 135 | `#scene=c-fiche-garde` | « ⛔ Retirer le point d'autonomie », le soir : la garde. | 4 |
| 136 | `#scene=c-fiche-retire` | Le point retiré, dans la fiche : « ↩️ Rendre ». | 4 |
| 137 | `#scene=c-que-dit-la-feuille` | « Que dit la feuille ? ». | 4 |
| 138 | `#scene=c-seances-lues` | Toutes les feuilles lues : « rendre les copies ▸ ». | 4 |
| 139 | `#scene=c-rendre` | « Rendre les copies » : la garde. | 4 |
| 140 | `#scene=c-copies-rendues` | « copies rendues le 10/10 », « 🙈 Masquer les copies ». | 4 |
| 141 | `#scene=c-resultats-rendues` | Les copies rendues : le PDF s'ouvre. | 4 |
| 142 | `#scene=x632-pdf` | Le PDF « notes et compétences » (gen632.js). | 4 |
| 143 | `#scene=c-corbeille` | Mettre une séance à la corbeille. | 4 |
| 144 | `#scene=c-sauvegarde` | Sauvegarde, avec la corbeille et les purges. | 4 |
| 145 | `#scene=c-importer` | « 📤 Importer snapshot » : la garde. | 4 |
| 146 | `#scene=c-purger` | « Purger les évaluations » : la démo reste. | 4 |

### Côté élève, après la séance

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 147 | `#scene=e-mes-evals` | « 📊 Mes évaluations », chez elle : « En relecture », « Tu étais absente ». | 4 |
| 148 | `#scene=e-mes-evals-rendue` | Sa copie rendue : la note définitive. | 4 |
| 149 | `#scene=e-bilan-lou` | Le bilan de Lou, corrigé d'après sa feuille, qui finit par « 📝 Bilan ». | 4 |

### Réglages, et MJPC

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 150 | `#scene=c-reglages` | Réglages, en cartes : la classe, le prompt, les durées de la séance, les niveaux de maîtrise, les textes. | 4 |
| 151 | `#scene=c-reglages-prompt` | Le prompt de création d'éval, tel que l'app le copie : le chapitre et ses compétences, les difficultés, les durées et les limites de longueur à la place des jetons. | 4 |
| 152 | `#scene=c-reglages-prompt-modifier` | Le prompt en modification : le gabarit enregistré, jetons compris ; « 💾 Enregistrer », « ↩️ Annuler », « 🔄 Restaurer le prompt par défaut ». | C1 |
| 153 | `#scene=m-classe-exclusions` | MJPC, Élèves & codes, comme dans le site : la clé saisie, l'import, chaque élève avec « 🚫 Jamais avec… » après le ◆. | 4 |
| 154 | `#scene=m-exclusion-refusee` | Une quatrième exclusion : refusée, avec la raison. | 4 |
| 155 | `#scene=m-fiche-eleve` | Un clic sur un nom : la fiche de l'élève, telle qu'elle est dans le site (sexe, dispositif, cases PAP). | C1 |
| 156 | `#scene=m-taxonomie` | MJPC, Taxonomie : le référentiel, l'éditeur fermé. | C1 |
| 157 | `#scene=m-taxonomie-editeur` | « Ouvrir l'éditeur » : la vraie taxonomie, version 1.4.0, ses 7 domaines ; puis « Les compétences ». | C1 |
| 158 | `#scene=m-taxonomie-domaine` | Un domaine ouvert, une famille ouverte : ses notions, « ✏️ Modifier », « Désactiver », « + Nouvelle notion ». | C1 |
| 159 | `#scene=m-taxonomie-notion` | « ✏️ Modifier » une notion : ses libellés, ses niveaux, son exemple. | C1 |
| 160 | `#scene=m-taxonomie-competences` | « Les compétences » : les 28, sous leurs groupes, avec leur libellé élève. | 4 |
| 161 | `#scene=m-taxonomie-competence` | « ✏️ Modifier » une compétence : le même formulaire, avec son libellé élève. | C1 |
| 162 | `#scene=m-emploi-du-temps` | MJPC, Emploi du temps, avec les objets de l'année : la rangée d'aujourd'hui en trois groupes, l'un sous l'autre. | C2 |
| 163 | `#scene=m-emploi-du-temps-un` | « ⤓ Sortir le JSON », un objet coché : le geste d'aujourd'hui, le même message. | C2 |
| 164 | `#scene=m-emploi-du-temps-tous` | Tous les objets cochés : un seul JSON, chacun sous son identifiant. | C2 |

### Une autre séance

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 165 | `#scene=c-rattrapage` | Le rattrapage. | 3 |

### Le mode test

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 166 | `#scene=x620-1-mode-test-ouverture` | Le mode test, à l'ouverture : ta vraie console d'avant l'heure, 15 tablettes. | 4 |
| 167 | `#scene=x620-2-mode-test-reflexion` | Le mode test, pendant la réflexion. | 4 |
| 168 | `#scene=x620-3-mode-test-en-grand` | « 🔍 Jouer en grand ». | 4 |

### Annexe : la demi-tablette

| N° | Scène | Ce que Paul peut regarder | Étape |
| --- | --- | --- | --- |
| 169 | `#scene=t-annexe` | L'étalon des mesures : la vraie question 3 de l'évaluation de 3e (6 choix longs), sur une demi-tablette : 67 px de reste. | 5 |

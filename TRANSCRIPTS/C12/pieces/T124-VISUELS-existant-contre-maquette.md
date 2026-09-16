# LES VISUELS DE L'ANCIEN DÉROULÉ, REPRIS EXACTEMENT DANS LA MAQUETTE — vérification mesurée (16/09/2026)
*Sur l'ordre de Paul : « vérifie que tout ce qu'avait le déroulé est repris exactement ici (tous les VISUELS). par exemple, mettre en lumière. » Méthode : le CSS que la classe voit dans l'ancien (moteur.html L2545-2597, la fenêtre du tableau) est recopié tel quel dans la maquette, le rendu produit la même structure, et les deux fenêtres du tableau sont mesurées style calculé par style calculé sur le même parcours (`T124-visuels-tab-existant.mjs`, `T124-visuels-tab-maquette.mjs`, `T124-visuels2-existant.mjs`, `T124-visuels2-maquette.mjs`).*

## L'inventaire des visuels de l'ancien (ce que la classe voit) et leur sort
| Visuel de l'ancien | Où (moteur.html) | Dans la maquette v9c.4 | Mesuré |
|---|---|---|---|
| Le papier #fffdf9, l'encre #22303f, la police EB Garamond, le cadre 16/9, les marges 3,2 % / 3,6 % | L2545, L2552 | recopié | ✔ identique |
| La loi de taille : 32 pt = 5,6 % de la hauteur de la boîte | L2620-2622 | recopiée (v9c.2) | ✔ (32 pt) |
| L'étiquette de l'activité : pilule verte, capitales espacées, .42 em | L2553 | recopiée | ✔ identique |
| La consigne : pictogramme + texte gras 1,05 em | L2554 | recopiée | ✔ identique |
| Les étapes : chevron doré « › », sans numéro | L2571-2572 | recopiées | ✔ identique |
| **Mettre en lumière : dix pulsations dorées d'une seconde, fond crème #fff8e2, puis plus rien (10,5 s) ; l'outil se repose après le clic** | L208-210, L2596-2597, allume() L2345 | recopié — c'était faux avant (fond jaune fixe, outil armé) | ✔ identique (animation, nombre, fond) |
| À écrire : cadre pointillé bleu, liseré gauche épais, fond bleuté (au tableau, sans le ✍ du pilote) | L2577 | recopié — c'était faux avant (✍ devant la ligne) | ✔ identique |
| La question en gras ; les réponses : ligne pointillée, initiales en pastille verte, grise quand reformulée | L2576, L2590-2592 | recopiées | ✔ identique |
| Le surlignage : quatre couleurs #ffe94a #b6f0c2 #ffc9d6 #bcd9ff, `mark` | L412, L2592 | recopiées — mes couleurs étaient d'autres pastels | ✔ identique |
| La fiche : bordure, type en capitales grises, titre, définition au liseré doré sur fond crème | L2573-2574 | recopiée | ✔ identique |
| L'image dans son cadre 16/9, hachures si absente, **la légende calée sur la largeur de l'image (3,5 %)**, les marques calées de même (4,2 %) | L2561-2570, L1666-1670 | recopiées — la légende était à .4 em | ✔ identique |
| Le schéma : bloc centré, titre .72 em | L2555-2560 | recopié (le dessin lui-même n'est pas dans la maquette : déclaré) | ✔ bloc |
| **L'arrivée en fondu** de ce qui vient d'être dévoilé et de chaque objet qui apparaît (.neuf-vu, 0,62 s), une seule fois | L1492-1512, L2580 | recopiée | ✔ identique |
| **« Qui a participé »** : voile sombre sur la diapo, boîte papier à bordure dorée, « n élèves sur N ont participé », prénoms séparés par « · », « ×2 » en pastille verte, « il reste k élèves à passer » | peintQui() L2510-2525, L2598-2601 | recopié — c'était un bandeau | ✔ titre et liste identiques |
| **L'écran d'attente** avant le cours : fond sombre, l'heure en géant, la date, le nom du site, la classe | L2536-2541, L2605 | recopié (après la clôture d'une heure, avant la suivante) | ✔ heure, date, nom, classe identiques |
| **La fiche en page** (loupe sur une fiche) : la charte des fiches (en-tête, titre, ancrage, corps, pied), **entrée en zoom (0,78 s)**, **sortie en zoom arrière (0,46 s)** | loupe() L2408-2424, L2588-2589, charte L43-63 | recopié (clic sur la fiche ; second clic ou Échap) | présent (non mesurable dans l'existant sans clic sur la fiche : déclaré) |
| L'image « support » en plein écran, légende en bandeau sombre | L2546-2551 | **recopié mais inactif : dans l'ancien, ce CSS est cassé** (accolade manquante L2545 : les règles sont avalées en imbrication et ne s'appliquent jamais au tableau). La classe voit l'image dans son cadre, étiquette au-dessus, légende grise dessous — la maquette reproduit ce qui s'affiche, et le signale. | ✔ identique à l'affiché |

## Défauts de l'ancien découverts par cette vérification (à décider par Paul, pas reproduits sans son mot)
1. Le CSS du tableau (L2545) n'est pas fermé : les six règles « plein écran » d'une image support sont perdues ; la classe n'a jamais vu une image en plein écran.
2. Au pilote, le ✍ de « à écrire » ne s'affiche pas sur une étape : le chevron « › » (règle plus spécifique) le remplace ; le cadre bleu reste.
3. La mise en lumière ne survit pas au premier re-rendu du pilote (c'est un flash de 10,5 s, mais un rendu intermédiaire l'efface avant la fin) — la reconstruction après clic, encore elle.
4. La police du pilote est calée une fois (calePilote) et ne suit pas un redimensionnement de la fenêtre.

## Premier parcours — la consigne, les étapes, la lumière, l'à-écrire, la question, les réponses, l'image
*Le même parcours des deux côtés : la consigne d'ouverture avec trois étapes dévoilées, la deuxième marquée « à écrire », la première mise en lumière ; la question-bilan avec deux réponses (GA reformulée, CJ) ; l'écran d'image « Tableau 1 ». Vingt propriétés par objet — police, taille relative à la police du corps, graisse, style, couleur, fond, bordures (style, couleur, épaisseur), rayon, espacement, casse, opacité, ombre, animation et son nombre, alignement, retrait, marge haute — et le contenu des pseudo-éléments. Les épaisseurs en pixels sont comparées à 25 % près (les deux tableaux n'ont pas la même taille d'écran).*

| Objet | Existant | Maquette : écart | Verdict |
|---|---|---|---|
| corps | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| étiquette | 0.420 × la police du corps | identique (22 propriétés) | ✔ |
| consigne | 1.050 × la police du corps | identique (22 propriétés) | ✔ |
| pictogramme | 1.100 × la police du corps | identique (22 propriétés) | ✔ |
| étape | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| étape › (avant) | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| étape en lumière | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| étape à écrire | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| question | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| réponse (ligne) | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| initiales | 0.560 × la police du corps | identique (22 propriétés) | ✔ |
| initiales reformulée | 0.560 × la police du corps | identique (22 propriétés) | ✔ |
| réponse (texte) | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| image (bloc) | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| image (cadre) | 1.000 × la police du corps | identique (22 propriétés) | ✔ |
| légende d'image | 1.031 × la police du corps | identique (22 propriétés) | ✔ |
| image absente | 0.500 × la police du corps | identique (22 propriétés) | ✔ |

**17 identiques · 0 différents · 0 absents.** Erreurs JS maquette : 0.

## Second parcours — l'attente, la fiche, le schéma, le surligné, l'arrivée, « qui a participé », la fiche en page et sa sortie
*Existant : le tableau à l'ouverture (l'attente), puis la séance 2 (le schéma d14, la fiche d15 dévoilés, un surlignage posé dans la définition, un dévoilement de plus pour l'arrivée), « qui a participé » avec CJ ×2 et ZE. Maquette : même parcours (l'attente après la clôture de l'heure).*

| Objet | Existant | Maquette : écart | Verdict |
|---|---|---|---|
| attente (fond) | 0.159 × la police du corps | identique (23 propriétés) | ✔ |
| attente · heure | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| attente · date | 0.243 × la police du corps | identique (23 propriétés) | ✔ |
| attente · nom | 0.171 × la police du corps | identique (23 propriétés) | ✔ |
| attente · classe | 0.200 × la police du corps | identique (23 propriétés) | ✔ |
| fiche | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| fiche · type | 0.520 × la police du corps | identique (23 propriétés) | ✔ |
| fiche · titre | 0.900 × la police du corps | identique (23 propriétés) | ✔ |
| fiche · définition | 0.800 × la police du corps | identique (23 propriétés) | ✔ |
| surligné (mark) | 0.800 × la police du corps | identique (23 propriétés) | ✔ |
| ce qui vient d'arriver (neuf-vu) | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| schéma · titre | absent de l'existant sur le parcours joué (présent dans la maquette) | | — |
| schéma (bloc) | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| qui · voile | 0.397 × la police du corps | identique (23 propriétés) | ✔ |
| qui · boîte | 0.397 × la police du corps | identique (23 propriétés) | ✔ |
| qui · titre | 0.571 × la police du corps | identique (23 propriétés) | ✔ |
| qui · liste | 0.714 × la police du corps | identique (23 propriétés) | ✔ |
| qui · numéro | absent de l'existant sur le parcours joué (présent dans la maquette) | | — |
| écran sortant | absent de l'existant sur le parcours joué (présent dans la maquette) | | — |
| écran entrant | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| fiche en page (entrée) | (non mesuré dans l'existant) | présent | — |
| fiche en page · titre | (non mesuré dans l'existant) | présent | — |

**17 identiques · 0 différents · 0 absents.** Erreurs JS maquette : 0.

## Second parcours — l'attente, la fiche, le schéma, le surligné, l'arrivée, « qui a participé », la fiche en page et sa sortie
*Existant : le tableau à l'ouverture (l'attente), puis la séance 2 (le schéma d14, la fiche d15 dévoilés, un surlignage posé dans la définition, un dévoilement de plus pour l'arrivée), « qui a participé » avec CJ ×2 et ZE. Maquette : même parcours (l'attente après la clôture de l'heure).*

| Objet | Existant | Maquette : écart | Verdict |
|---|---|---|---|
| attente (fond) | 0.159 × la police du corps | identique (23 propriétés) | ✔ |
| attente · heure | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| attente · date | 0.243 × la police du corps | identique (23 propriétés) | ✔ |
| attente · nom | 0.171 × la police du corps | identique (23 propriétés) | ✔ |
| attente · classe | 0.200 × la police du corps | identique (23 propriétés) | ✔ |
| fiche | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| fiche · type | 0.520 × la police du corps | identique (23 propriétés) | ✔ |
| fiche · titre | 0.900 × la police du corps | identique (23 propriétés) | ✔ |
| fiche · définition | 0.800 × la police du corps | identique (23 propriétés) | ✔ |
| surligné (mark) | 0.800 × la police du corps | identique (23 propriétés) | ✔ |
| ce qui vient d'arriver (neuf-vu) | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| schéma · titre | absent de l'existant sur le parcours joué (présent dans la maquette) | | — |
| schéma (bloc) | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| qui · voile | 0.397 × la police du corps | identique (23 propriétés) | ✔ |
| qui · boîte | 0.397 × la police du corps | identique (23 propriétés) | ✔ |
| qui · titre | 0.571 × la police du corps | identique (23 propriétés) | ✔ |
| qui · liste | 0.714 × la police du corps | identique (23 propriétés) | ✔ |
| qui · numéro | absent de l'existant sur le parcours joué (présent dans la maquette) | | — |
| écran sortant | absent de l'existant sur le parcours joué (présent dans la maquette) | | — |
| écran entrant | 1.000 × la police du corps | identique (23 propriétés) | ✔ |
| fiche en page (entrée) | (non mesuré dans l'existant) | présent | — |
| fiche en page · titre | (non mesuré dans l'existant) | présent | — |

**17 identiques · 0 différents · 0 absents.** Erreurs JS maquette : 0.

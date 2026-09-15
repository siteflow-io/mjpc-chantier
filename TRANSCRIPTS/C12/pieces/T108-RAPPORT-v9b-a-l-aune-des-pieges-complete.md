# RAPPORT — la maquette v9b à l'aune des pièges des instances précédentes
*Conscience n°12, 15/09/2026, complété le même jour (§14 à 16) après la remarque de Paul sur la reconstruction après clic. Sources lues en entier par extraction mécanique puis lecture : le registre des dettes (`docs/MJPC6-DETTES.md`, 128 entrées n°11-12 et les sections A-F), le journal (`docs/MJPC6-journal.md`, du 16/07 au 15/09), les cadrages du 25/08, les documents du consultant du chapitre 3e — 505 lignes portant une règle, une erreur ou un piège, réunies en pièce `T107-pieges-extraits-registre-journal.txt`. Épreuve : `T107-aune-pieges.mjs` (mesures) + `T107-test-v9b.mjs` (40 vérifications par le geste) + les bancs des tailles et des types. Verdicts tranchés : ça va, ou ça ne va pas, ou je ne sais pas.*

## Les familles de pièges, et ce que la v9b donne

### 1 · Écrire un fait avant de l'avoir établi — chercher un nom au lieu de lire, recopier un chiffre
*Le piège le plus fréquent du registre (six conclusions fausses de la n°11 tirées d'un seul endroit du code ; « une mesure à zéro prouve que le nom cherché n'est pas là » ; « quinze erreurs dont six de la même faute » ; « 32 bancs » recopié alors qu'il y en avait 35).*
- **Mesuré** : les chiffres annoncés au tour 104 (« 40 vérifications ») recomptés dans le banc : **40** ✔ ; « 7 domaines, 51 familles, 210 notions » recomptés au générateur ✔.
- **Trouvé** : le tour 106 (« les tableaux en énorme ») est exactement ce piège appliqué à l'image : j'avais conclu « aucun débordement » sur une mesure faite sans image. Corrigé au tour 106 ; le banc rend désormais une image réelle. **Ça va maintenant, et la faute est au registre.**

### 2 · Un banc qui appelle la fonction au lieu de passer par le geste — un stub faux valide un code faux
*« Un banc qui appelle une fonction sans passer par le chemin réel ne prouve pas que le chemin réel existe » (05/08) ; « appel de fonction : déclaré est une alerte » ; les trois refus de l'EDT prouvés par un appel direct, jamais par le clic.*
- **Trouvé** : mon banc appelait le tableau, le menu ⋯, le T-5 et les réglages **par script** (`.click()` dans la page, `dispatchEvent`) au lieu de cliquer. **Corrigé** : tous les gestes passent par la souris ou le clavier (`page.click`, `selectOption`, `keyboard`), y compris ⚙ → réglage → fermer. Les quarante vérifications repassent : **0 défaut**.
- **Déclaré** : la vidéo n'a pas de fichier dans la maquette — sa lecture est simulée ; ce que le banc prouve, c'est le pilotage par repères et les trois temps de la garde, pas la lecture d'un vrai fichier.

### 3 · Une capture n'est pas une preuve — livrer sans regarder
*Reproche de Paul le 04/08 (« tes captures ne sont pas concluantes ») ; « 29 des 31 captures non regardées » (n°11) ; ma propre faute du tour 80.*
- **Mesuré** : chaque capture livrée depuis le tour 81 a été ouverte et lue pour ce qu'elle prouve ; les captures de la v9b (T104, T105, T106) l'ont toutes été, et deux ont révélé des défauts (les cartes qui disparaissaient, l'image énorme). **Ça va.**

### 4 · Hors-écran, superposition, Échap qui ferme tout, plein écran
*« À 390 px le bouton de sortie était hors écran » ; « la touche Échap ne ferme pas une fenêtre — elle ferme tout l'emploi du temps, trois écrans perdus » ; « modale sans voile, déplaçable, contenue à 72 % » ; le bandeau de clôture hors de vue (tour 105).*
- **Mesuré** : à 1366 × 768 et 1280 × 720, le bandeau de clôture est visible sans défiler et rien ne le recouvre (`elementFromPoint` sur le bouton Clore) ✔ ; les cinq tailles du banc (1366 à 1920) passent ✔ ; **Échap ferme les fenêtres une à une, jamais l'écran de fin, et n'annule aucune décision** (mesuré : « non fait » survit à Échap) ✔.
- **Trouvé et corrigé** : Échap fermait le document projeté en même temps que la liste des documents (tour 104).
- **Je ne sais pas** : le tactile — la maquette est pour l'ordi portable ; ses infobulles sont des `title`, inutiles au téléphone (piège n°11 · 70). Hors périmètre, dit.

### 5 · La plomberie et les codes affichés au professeur, les mots qui ne sont pas ceux de Paul
*« `litt-036` dans la modale T-5 » (21/08, puis revu le 12/09) ; « les objets vivent au hub sous /site/edt/ » affiché ; « hors MJPC » contesté à tort ; « appoint » ; « lisible » (tour 99).*
- **Mesuré** : aucun code de notion à l'écran, ni au T-5 (libellés), ni dans le récit ✔ ; aucun des mots *eid, json, hub, maquette, simulation, iframe, DOM, prototype, mock* dans le texte affiché ✔ (les réglages de simulation sont derrière ⚙, nommés « Réglages de la maquette » — c'est le seul endroit, et il n'existera pas dans le site).
- **Trouvé et corrigé** : deux boutons sans infobulle (Pilotage, Relecture) ; « déjà vue » renommé « déjà rencontrée » parce que la maquette le calcule sur la trame, pas sur ce que la classe a vu — et l'infobulle le dit.

### 6 · Le rang pris pour une identité
*Le bug des séances mélangées (05/08), la double numérotation, « une identité enregistrée mais introuvable ne retombe pas sur le rang », l'EDT (`crn:<jour>:<créneau>` est une position, pas une identité), et le cadrage 4 (« le rang est aboli »).*
- **Trouvé** : le journal des diapos, les notes au fil de l'eau et les prises de parole n'enregistraient que le **rang** de la diapo. **Corrigé** : chaque enregistrement porte l'identité (`eid`) de la diapo ; les décisions, commentaires et notions imprévues la portaient déjà.
- **Déclaré, pas corrigé** : dans la maquette, l'état d'une diapo (dévoilement, réponses) est encore indexé par rang de diapo et de bloc — sans réordonnancement possible en classe, c'est inoffensif ici ; **dans le mandat, l'identité de diapo et de bloc est la clé, jamais le rang** (cadrage 4, 2.1). C'est écrit dans le cadrage ; la maquette ne le contredit pas, elle ne le prouve pas.

### 7 · Les caractères français — apostrophes, guillemets, accents
*« Huitième occurrence de la famille » (journal, 26/07) ; « deux mesures fausses avant la bonne, une apostrophe lue pour l'autre ».*
- **Trouvé et corrigé** (tour 104) : la recherche d'élève ignorait les accents (« ze » ne trouvait pas Zélia).
- **Mesuré** : une note avec « », l'apostrophe typographique et un tiret cadratin traverse intacte le journal, la fenêtre des notes et le récit ✔ ; les titres avec apostrophes dans les vignettes ✔.

### 8 · Le mode test qui écrit au vrai — le harnais qui n'est pas en lecture seule
*« Lire le vrai, écrire dans le faux » ; « harnais en lecture seule stricte, jamais de dialog.accept global » ; la fuite de `sesPut` mesurée le 13/09.*
- **Mesuré** : la maquette ne contient **aucun** `fetch`, `XMLHttpRequest`, `WebSocket`, `localStorage` — elle n'écrit nulle part, ne lit rien ✔.
- **Trouvé et corrigé** : la maquette utilisait deux boîtes système (`prompt()`) pour la raison d'une absence et le motif d'un « non fait » — et mon banc les acceptait par un `dialog.accept` global, exactement le piège gravé le 18/07. Remplacées par une petite fenêtre du site (Entrée garde, Échap passe) ; plus aucune boîte système ; plus de `dialog.accept`.

### 9 · Deux fichiers différents sous le même nom
*« Deux fichiers différents ne portent jamais le même numéro » (8.7.1) ; le sha de référence tenu pour vrai.*
- **Trouvé** : mon générateur réécrivait toujours `T104-…v9b…html`, alors que le sas portait la v9b initiale sous ce nom et que le fichier local avait changé deux fois. **Corrigé** : le générateur écrit vers `maquette-v9b-courante.html`, et chaque livraison est figée sous son propre nom (T104 = v9b, T105 = v9b.1, T106 = v9b.2, **T107 = v9b.3**, md5 `e758c7cf00c9…`).

### 10 · Le texte coupé, le curseur qui saute, le tableau qui saute
*Le registre n°12 · 03 (la scission, le zoom, le curseur) ; le distant qui saute quand les fils se génèrent (20/08).*
- **Mesuré** : après une frappe de 540 signes dans une réponse, le curseur est toujours dans le champ, le texte est entier ✔ ; ◀ puis aller ailleurs : le récit cite ce qui restait dévoilé, pas le maximum atteint (3 dévoilées, 1 revoilée → 2 dans le récit) ✔.
- **Trouvé, amélioré, déclaré** : **une réponse plus longue qu'une page** (au-delà de ~700 signes à police réduite) déborde : la pagination ne coupe pas à l'intérieur d'un élément. La maquette fait maintenant **défiler le tableau vers la fin de la frappe** (la classe voit ce qui s'écrit) ; le début n'est pas visible en même temps. **Ça ne va pas tout à fait** : c'est une limite connue, à traiter au mandat (paginer une réponse longue ligne par ligne, ou la déclarer telle) — écrite ici, pas cachée.

### 11 · Le faux vert — un bouton qui prétend faire quelque chose
*« Faux verts éprouvés » (11/08) ; « la garde ne pouvait voir aucune des deux dettes » ; « une fonction que personne n'appelle passe en vert ».*
- **Trouvé** : « seulement les nouvelles » reposait sur une fonction qui répondait toujours *non* — un bouton mort qui aurait passé pour vrai. **Corrigé** : « déjà rencontrée » se calcule sur la trame (notion portée par une diapo antérieure, séance précédente ou heure précédente), et l'infobulle dit sur quoi.
- **Déclaré** : « + une notion » est grisé, avec la raison (les attendus ne sont pas là) — un bouton qui dit qu'il ne fait rien, pas un faux vert.

### 12 · Le récit qui ment — la relecture par l'état, pas par le journal
*Les tours 98-105 de la n°10 (« le récit doit être complet et juste sans geste ») ; « le récit reflète l'état courant du dévoilement » (l'ancien moteur).*
- **Mesuré** : le récit lit le journal (ce que la classe a vu à son départ de la diapo), les notes versées à leur place, les prénoms, « M. Meney », le bilan par décision ✔.
- **Déclaré** : la transposition à l'imparfait n'y est pas (la structure y est) ; les connecteurs sont mécaniques.

### 13 · Le mandat rédigé sur un état du code qui n'existe plus
*n°11 · 40 (« le mandat v2 décrit un état du code qui n'existe plus »).*
- **Sans objet pour la maquette** ; **à tenir pour le mandat** : chaque affirmation sur l'existant sera remesurée le jour de l'écriture, sur le fichier de base nommé par son md5.


## 14 · La reconstruction après clic — le piège que Paul a nommé, et que j'avais manqué
*Les sources, relues : « une espèce de saut d'une microseconde de l'image dès que je fais suivant » (Paul, 20/08) — hypothèse consignée : « le mur recompose à neuf à chaque cycle et repeint la toile entière » ; « le panneau est reconstruit à chaque rendu : la hauteur tirée est perdue » (dette lot 6) ; « position exacte perdue à la reconstruction du cadre » ; « la modale d'une case se referme quand on bascule le mode test (la grille est repeinte) » ; « le saut au clic : scrollIntoView défile tous les ancêtres — banni » ; la règle du sommaire natif : « un clic déplace le halo, ne reconstruit rien » ; « l'exécutant a fait un rendu par ligne, sans redessin ni bataille avec une saisie ».*
- **Mesuré avant correction** (`T108-reconstruction.mjs`) : au tableau, **l'image était un nouveau nœud après chaque geste** (recréée, donc rechargée — c'est le saut de Paul) ; à l'écran de fin, **une décision remettait la rangée des vignettes au début** (600 → 0) et **une case cochée refermait la vignette agrandie** ; le volet recréait ses vignettes à chaque ▶ ; la liste de classe était recréée à chaque frappe dans le VIF. Cinq reconstructions, toutes provoquées par `innerHTML` à chaque `tout()`.
- **Corrigé** : plus aucune reconstruction — une **mise à jour minimale** (le nouveau rendu est comparé au vivant, nœud par nœud ; seuls les attributs et textes qui changent sont touchés ; le nœud qui a le focus n'est jamais modifié ; les champs gardent leur valeur ; les images, les défilements, la vignette agrandie restent). Appliquée au mur (pilote et tableau), au volet, à la liste, aux notes, à l'écran de fin et à ses vignettes.
- **Mesuré après** : image même nœud (pilote et tableau) ✔ ; rangée 600 → 600 ✔ ; vignette agrandie conservée ✔ ; volet non recréé ✔ ; liste non recréée ✔ ; note en édition conservée ✔ ; 0 `scrollIntoView` dans la maquette ✔. Tous les autres bancs repassent.
- **Pour le mandat** : c'est une règle, pas un détail — *le pilotage ne reconstruit jamais l'écran au clic ; il met à jour ce qui change* ; le tableau ne recharge jamais une image qui n'a pas changé.

## 15 · Les chevauchements entre couches
*« La pastille de version au-dessus d'un bouton bleu » (journal, 21/07) ; « modale contenue à 72 % ».*
- **Mesuré avec tout allumé** (étiquette, pastille de commentaire, légende de surlignage, encart de réserve, chrono au tableau, numéro de page ; `T108-chevauchements.mjs`) : **deux chevauchements** — la pastille 💬 sur l'étiquette de la diapo ; la légende de surlignage sous le bandeau du chrono. **Corrigés** : la pastille à droite ; quand le bandeau est allumé, la légende, le numéro de page et l'encart montent. Mesuré après : 0 chevauchement, pilote et tableau.

## 16 · Une interface qui annonce une action qu'elle ne fait pas
*« Supprimer cette classe » qui ne supprimait rien (31/07) ; « mémorisées sur ce poste » alors qu'un rechargement perdait tout (12/08).*
- **Trouvé** : les trois boutons du récit (« Copier pour École Directe », « Copier — travail à faire », « Le figer pour le corriger ») **ne faisaient rien**. **Corrigés et prouvés** (`T108-recit-boutons.mjs`) : la copie va au presse-papier et le dit (« copié : le contenu de séance »), avec le repli en clair si la copie échoue ; figer rend le récit retouchable à la main, et la retouche survit à un nouveau dévoilement ; un clic reprend la recomposition.

## Verdict, revu
**Ça va**, avec les limites du §« déclaré » — et trois familles de plus vérifiées et corrigées (14, 15, 16) que le premier passage n'avait pas vues, dont la plus importante, celle que Paul a nommée. v9b.4.

## Ce que l'épreuve a changé dans la v9b (v9b.3, puis v9b.4)
1. les identités de diapo dans le journal, les notes, les prises de parole ;
2. « déjà rencontrée » honnête, infobulle qui dit sur quoi ;
3. deux infobulles manquantes ;
4. plus de boîte système : une fenêtre du site pour la raison et le motif ;
5. la réponse trop longue défile vers la fin au tableau (limite déclarée) ;
6. le banc clique au lieu d'appeler ; plus de `dialog.accept` ;
7. le générateur ne réécrit plus un fichier déjà livré sous le même nom ;
8. (v9b.4) plus aucune reconstruction au clic : mise à jour minimale du mur, du volet, de la liste, des notes, de l'écran de fin ;
9. (v9b.4) la pastille et la légende ne chevauchent plus rien ;
10. (v9b.4) les trois boutons du récit font ce qu'ils disent.

## Ce qui reste déclaré, sans correction
- la vidéo simulée (pas de fichier) ; « + une notion » grisé (les attendus) ; la transposition du récit ; la réponse plus longue qu'une page ; le tactile hors périmètre ; l'état par rang dans la maquette (inoffensif ici, aboli au mandat) ; le rendu du tableau par injection de code dans la fenêtre (une commodité de maquette, pas le mécanisme du site).

## Verdict
**Ça va**, avec les six limites ci-dessus écrites. Bancs : gestes 40/40 par le clic, cinq tailles d'écran, tous les types de diapo avec image réelle, l'épreuve des pièges — 0 défaut après corrections.

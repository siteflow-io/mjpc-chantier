# AUDIT FINAL — l'intégration du déroulé dans `index.html` (branche `integration`, tête `fc8122b4` le 22/10 01:45 ; mis à jour sur `64022f46` le 22/10 03:01, sur `17f4444b` le 22/10 04:10)

*Conscience n°13, réveil n°12. Règle du 12/10 : un audit vérifie, il ne refait pas ; ce qui est regardé est fixé d'avance (le parcours fixe P0-P12, les écrans changés et leurs voisins, les NOTE des quatre, la table d'E4, les dettes nommées). Avant = la production 8.74.0-④ jouée le 20/10 sur le faux hub (pièces `TRANSCRIPTS/C13/pieces/T72-EX-00` à `12`) ; après = le fichier assemblé de la tête, joué par `parcours.mjs` sur le même faux hub (captures `TRANSCRIPTS/C13/pieces/T97-P0` à `P12`). Ce document se met à jour à chaque réveil jusqu'au promeus.*

## 0 · Le verdict, d'abord
**Pas encore « promeus » (mis à jour 22/10, 04:10, tête `17f4444b`).** Le banc est vert sur cette tête (collisions 0, parcours P0-P12 vert en mode normal et en mode test, K 108 / 0) ; la table d'E4 n'a **aucune ligne ouverte** — **170 lignes : 149 réglées, 8 écartées, 6 à Paul (deux questions : 152 et la ligne 174), 7 pas réglées** (5 chez E1, 2 chez E2 ; une famille pour quatre d'entre elles : l'Atelier, le Pilotage et l'EDT doivent dire la même suite d'heures — §12.18, `dr_heuresDeLaClasse` d'E2 posée pour E1). Convergence mesurée par E4 : ≈ 6 lignes neuves par heure sur six heures, 2 à la dernière passe ; aucune grave depuis 20:50 ; la pente des réglées est plus forte que celle des neuves. Règle : jamais de promotion sur dette — le promeus se dit quand E4 écrit « 0 pas réglée (commit) » et que le banc a rejoué sur cette tête-là.

## 1 · (a) Le parcours fixe P0-P12, avant / après, écran par écran
| pas | avant (8.74.0-④, T72-EX) | après (tête, T97-P) | changement | voulu ? |
|---|---|---|---|---|
| P0 panneau prof | le panneau, « Mode test » bouton | identique | aucun | — |
| P1 emploi du temps | la case du lundi 08:57 : « L'Albatros · heure 1/3 » (la séance 0 commencée le 07/09 ignorée) ; le bandeau « Enregistré à 09 h 00 » | la case : « Poésie et peinture… · heure 2/3 », mardi 15:07 « heure 3/3 », vendredi « L'Albatros · heure 1/3 » | l'EDT lance l'heure suivante d'une séance commencée (dette 13 · 26) | oui — contrat §12.7, C1 6.1 |
| P2 la case | « heure 1 sur 3 », « ▶ Ouvrir le pilotage et lancer » | « heure 2 sur 3 », « ▶ Ouvrir le pilotage et lancer », **« ✎ Préparer »** | la porte « Préparer » depuis la case | oui — cadrage 4 §0.3 |
| P3 préparation / Atelier | barre **Structure · Déroulé · Relecture · Papier** ; `deroule86` dans l'iframe : « PRÉPARATION — mon cours préparé… », sélecteur de classe/créneau, « Lancer la séance », la barre d'outils du moteur, le texte d'aide à droite | barre **Structure · Atelier · Pilotage · Relecture** ; l'Atelier de la maquette : « ✎ clique ici et écris », « + bloc / + étape / + image / + fiche… / + vidéo… / + document… / G / S », « ✔ enregistré », « Jouer en avance — répétition », la colonne H1/H2 avec les durées, « Ce que la diapo déclare », « Pour la classe » (dépassement), « Sur la forme » ; « Lancer avec 3E Charles de Gaulle · 08:57-09:52 · heure 2/3 » | le déroulé p8 remplace `deroule86`, sans iframe ; le Papier devient une face de la Relecture | oui — proposition 96 acquise (Paul, 20/10), contrat §2, §12.4 |
| P4 clic droit | le menu du moteur (Supprimer cette étape, Dupliquer, Monter, Descendre) | le menu de la maquette sur l'élément (Dupliquer, Monter, Descendre, Changer de type du bloc…, Supprimer l'élément), le bloc encadré « BLOC 1 · CONSIGNE · 6 ÉLÉMENTS » | le clic droit complet de p3 | oui — cadrage 4 §3, p8 |
| P5 classe lancée | « EN CLASSE », « Clore la séance », « Emploi du temps », « appoint », « Ouvrir la vue tableau », « Téléphone » ; « Où on en est » en liste de titres 0/8 ; le VIF en bas | l'entête de la maquette (classe · créneau · heure 2/3 · déroulé intègre · chrono · Notes · Tableau · session · Écran 2 ; Adresse du tableau · Fin de l'heure · ■ Clore l'heure · Enregistré à 09:00) ; **l'heure 2 s'ouvre sur « Où en sommes-nous ? »** ; « Où on en est » par activité avec horaires, durées, dépassement (R7) ; participation 0 sur 29 | le pilotage de p8 ; l'heure suivante par §12.16/12.17 ; « appoint » → notion imprévue (⋯) ; le téléphone tombe (§0.2) | oui — contrat §12 ; le téléphone : cadrage 1 §13, à refaire plus tard (plan 10 jours, L8) |
| P6 parole (F2) | le VIF du pont (« EA » dévoilé 3/8) | le VIF repris (initiales, 1/2/3, note, Entrée ; la liste des initiales avec « LC Lil / LC Lin ») ; la colonne défile jusqu'au VIF | repris tel quel + les homonymes | oui — contrat §12 (VIF du pont) |
| P7 palette (Maj+Espace) | la palette | la palette « initiales de l'élève… » | identique en substance | — |
| P8 tableau (Écran 2) | la diapo avec « Étape 1 » dévoilée | « OÙ EN SOMMES-NOUS ? » seul (rien dévoilé encore dans ce parcours), témoin vert | le même tableau, même police ; le parcours neuf ne dévoile pas avant P8 | oui — E3 (T1-T16) ; le témoin : C1 1.4 |
| P9 fin de l'heure (T-5) | la modale « Fin de l'heure — 3E Charles de Gaulle » : « 17 activités ne sont pas jouées — décide de leur sort », quatre boutons par activité (dette 12 · 17 : « les quatre boutons du T-5 ») | la séquence en sept étapes dans la colonne de droite (« Fin de l'heure — étape 1 sur 7 : l'échéance », « Préparer le cahier de textes / Reprendre le cours », l'échéance « mardi 15 septembre, 15 h 07 » proposée et posée, la liste des sept, « Où on en est » dessous) | la fin de l'heure de C1 7.0 bis/ter | oui — contrat §12.10 |
| P10 relecture | **inaccessible en classe** : la modale T-5 recouvre la Relecture | « Relecture — … heure 2 » avec quatre faces (Le récit · Ce qui s'est passé · Papier · Le chapitre), le récit composé (« Au début de l'heure, on a commencé par Où en sommes-nous ? ») | la Relecture de la maquette, une par heure | oui — cadrage 2, contrat §12.12 ; **la phrase « s'est terminée à 09 h 52 » pendant l'heure : question 152 à Paul** |
| P11 papier | inaccessible (même modale) | « Papier · heure 2 » : « Imprimer le papier », la page A4 (classe, chapitre, séance, date, « À relire — mardi 15 septembre », le récit) | le Papier = face de la Relecture | oui — cadrage 2 §1.9 |
| P12 clôture | « Clore la séance » : « Tu n'as rien modifié pendant le cours : ta préparation reste telle quelle » | l'entête « heure 2/3 · close », « ▶ Lancer — l'heure de 08:57-09:52 est close » (gris, avec sa raison), le Papier « heure close » ; au hub `H.clos` et `H.finReel` (P12 du banc) | la clôture certaine, l'heure close ne se reprend plus ; « Fin de l'heure » encore proposé après la clôture = ligne 107 d'E4 (faible, chez E2) | oui — contrat §8.6, §12 |

Lecture : aucun écran du parcours n'a perdu ce qu'il faisait avant sans que le contrat le veuille ; ce qui tombe (le téléphone, les quatre boutons du T-5, l'iframe, « appoint ») est ce que les cadrages font tomber (C1 §13, cadrage 4 §8, POINT 32).

## 2 · (b) Les écrans changés et leurs voisins
- **Structure** : inchangée (la colonne « Le chapitre » commune, la barre avec un onglet de plus — Atelier — à la place de Déroulé/Papier). Mesuré par les collisions (0 id, 0 classe, 0 globale) et par P3.
- **Atelier, Pilotage, Relecture (quatre faces), la fin de l'heure (sept étapes)** : les captures P3-P12 ci-dessus ; les gardes des quatre (A28, B15, T16, les relecteurs d'E4) couvrent les gestes que le parcours ne joue pas (le gel, les pages, les marques, les décisions, l'heure 3, la reprise, la copie d'un autre jour).
- **Le tableau** : Écran 2 (P8) ; `?vue=tableau` (le distant, l'ordi de classe) : banc E3 99/99 (T1-T16 : attente par la grille en lecture seule, scène, délai sur 10 ▶, image gardée, refus, garde + `sendBeacon`, T14 le bloc écrit en classe, T15 la retouche de la veille, T16 l'Atelier en pleine heure ne bouge pas le tableau).
- **L'EDT** : la case (P2 : heure n/N juste, « Préparer », « Lancer »), la case close après la clôture (E2 poussée 19 : garde le titre, « Relire cette heure »).
- **Le panneau prof** : P0 identique ; la pastille « mode test » = le bouton existant, inactif tant qu'on ne clique pas (E1, E4 ligne 146 écartée).
- **Ce que l'audit n'a pas rejoué lui-même** (dit, pas caché) : le tableau distant sur deux machines réelles, le Win+K de Paul, la clé USB (vidéo : hors mandat). Ils restent à Paul au premier cours.

## 3 · (c) Les NOTE des quatre et la table d'E4
- `LIVRAISONS/INTEGRATION/E1/NOTE.md` (socle, Atelier ; §9 : ce qui reste — 13 · 12 à Paul, les activités à Paul, la frontière hors classe faite) ; `E2/NOTE.md` (classe, heure ; §7-8 : 12 · 05 réglée, 12 · 17 deux points réglés, 13 · 26 et 13 · 27 réglées, à fermer au registre à la promotion) ; `E3/NOTE.md` (tableau ; la garde lecture seule + `sendBeacon` = 13 · 28 ; le banc 99/99) ; `E4/NOTE.md` §10 (le bilan en chiffres : 156 lignes, 135 réglées, 10 pas réglées — E2 6, E1 4 —, 8 écartées, 3 à Paul — une seule question vue trois fois : 152 —, 0 ouverte).

## 4 · Les lignes qui restent (la table d'E4, numéros de ligne du fichier) — ce qui bloque le promeus — état 22/10, 04:10
| ligne | qui | gravité | le geste | ce qu'il faut |
|---|---|---|---|---|
| 172, 177 | E1 (E2) | moyen | le lundi, l'Atelier date H1 « lundi 14 », H2 « mardi 15 », H3 « mercredi 16 » ; le mercredi, trois écrans donnent trois suites (Pilotage, EDT, Atelier) | **§12.18** : une seule suite, celle de l'EDT — `dr_heuresDeLaClasse` (E2) lue par l'Atelier et par « Lancer » |
| 161 | E1 (E2) | faible | le mercredi après la clôture du lundi : H1, H2, H3 toutes « mercredi 16 » | la même règle |
| 164 | E1 | faible | « + bloc », « Envoyer vers… » : le survol et Entrée ne désignent pas le même choix | le choix qu'Entrée prendra est marqué |
| 173 | E1 (E2) | faible | « Envoyer vers… » : « · 1 heure » pour toutes les séances | chaque séance son nombre d'heures |
| 176 | E2 | faible | l'infobulle de « Lancer » dit « aucune case … maintenant » quand l'EDT montre la case | l'infobulle dit vrai (§8.6) |
| 175 | E2 | faible | l'EDT du mercredi : « aucune séance prête » (E2 : le fil « langue » sans chapitre publié, la case le dit) | E4 revérifie avec cette lecture : « écartée » si la case le dit |
| 174 | Paul | — | sa trame de la séance 1 a deux diapos bilan | question 198 |
Réglées depuis 03:01 et revérifiées par E4 : 165, 167, 170.

## 5 · (d) Les dettes du registre, une à une
| dette | état | qui |
|---|---|---|
| 12 · 05 lancer depuis l'EDT lance le cours sans le montrer | réglée (P5 : le Pilotage s'ouvre, visible) | E2 (B1), E1 |
| 12 · 14-19 (la palette « aucun élève » puis pose ; le mode test qui fuit ; la réponse attendue au second ▶ ; lancer depuis l'EDT sans montrer) | le mode test : K15-test vert, zéro écriture (E1) ; la palette : E2 ; la réponse attendue au second ▶ : E3/E4 (le dévoilement bloc à bloc de p8) ; 12 · 05 ci-dessus — **à fermer une par une au registre à la promotion, avec la garde qui les tient** | E1, E2, E3, E4 |
| 13 · 4, 13 · 5 (bloc question : chevron, question suivante d'emblée) | tiennent (E1, A26) | E1 |
| 13 · 6 (écrire directement dans la diapo) | tient (P3 « clique ici et écris », p2) | E1 |
| 13 · 8 (le récit sur la copie de classe, pas la trame) | réglée (E4 : la Relecture lit `C/ecrans`, garde B3 ; L107 réglée à 16:07) | E4 |
| 13 · 12 (le curseur « texte au tableau » absorbé par le plancher) | **à Paul** (point 175 : la loi de taille du cadrage, rien à changer si Paul ne commente pas) | Paul |
| 13 · 18-23 (la vignette par page, le tableau après ■, ⧉ Tableau, le curseur, Échap, l'entête à 1280) | tiennent (E1, A21-A26 ; E3 T12) | E1, E3 |
| 13 · 24 (la maquette n'est pas le site) | soldée par l'intégration elle-même | — |
| 13 · 26 (l'EDT jamais l'heure 2) | réglée (P1, P2 : « heure 2/3 ») | E2 (F2) |
| 13 · 27 (la reprise perd la trace) | réglée (E2 B3 : la reprise remonte l'heure telle qu'elle était) | E2 |
| 13 · 28 (la garde lecture seule ne couvre que `fetch`) | réglée (E3 : la garde reprise + `sendBeacon`, T5) | E3 |
| 13 · 29 (le mode test ne couvre pas les lectures ni toutes les écritures ; le DELETE direct du QR) | réglée par la chute du pont (§12.15) : mesuré, 8 `DELETE` dans l'assemblé contre 9 en production — celui du QR est tombé ; K15-test : zéro écriture | E1, E3 |
Les ✔ se posent au registre dans le tour du promeus, pas avant.

## 6 · (e) Le fichier
`LIVRAISONS/INTEGRATION/assemble/index.html` de la tête `fc8122b4` : 2 261 436 octets, md5 `40099c81454a800e878b319a3f1589fc` ; de la tête `64022f46` (03:01) : 2 271 859 octets, md5 `27ddbd949769c1776f760ca37f447435` ; de la tête `17f4444b` (04:10) : 2 277 035 octets, md5 `c3a2930be52e8b768bb6688f0096c330` (la production 8.74.0-④ : 1 838 791 octets, md5 `c384d8504c097784e98ffc04d7327887`). Le fichier grossit de ~420 Ko : le déroulé p8 (606 Ko de maquette) remplace l'iframe base64 de `deroule86` (230 Ko × 4/3) et le pont (78 Ko).

## 7 · (f) Ce que Paul fera au promeus, et ce qui est à lui
- **Le promeus** : sur son mot, la conscience copie `assemble/index.html` de la tête auditée en `index.html` de production, version **8.75.0-①**, puis dans le tour même : bit à bit, journal, les dettes ✔ (§5), le point de retour, l'index des fonctions, « où trouver quoi », l'adresse du site avec `&v=8.75.0-1` et les tests geste par geste (le premier cours réel : l'EDT → la case → Lancer → ▶ → F2 → Fin de l'heure → Clore → Relecture → Papier).
- **À Paul, telles quelles** : 152 (l'heure de fin dans le récit : le créneau ou l'heure close), 144 (l'animation en accéléré tombe), 13 · 12 (la police réduite avant les pages), §12.17 (« à la maison » revient fléché « à reprendre »), le « go » du plan 10 jours.

MEMO

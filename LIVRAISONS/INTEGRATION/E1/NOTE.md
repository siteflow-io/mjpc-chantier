# E1 — NOTE (le socle et l'Atelier)

*État au 21/10/2026, poussée 9. Ce qui n'est pas fait est écrit (section 9) ; jamais une dette cachée.*

## 1 · Ce que ça change pour la classe
Paul ouvre un chapitre, « Éditer dans l'atelier » (sur le chapitre comme sur une séance), et le **déroulé p8 vit dans la page du site**. Il n'y a plus de cadre, plus de pont, plus de moteur embarqué en base64.

- **La colonne du site est la seule colonne.** Sous la séance ouverte s'affichent ses diapos : les lignes dans l'atelier, les vignettes en classe. Un clic sur une autre séance (son titre ou son chevron) l'ouvre.
- **La barre du site porte les onglets :** Structure · Atelier · Pilotage · Relecture.
- **La trame réelle du hub (9 séances, 95 diapos) est rendue telle que la maquette la rend** (93 diapos identiques ligne à ligne ; les 2 autres sont des fiches que la maquette ne montrait pas).
- **Ce que Paul écrit va au hub, et seulement là où il faut :** `B/deroule` de la séance (trame, activités par eid, notes par eid, travail prévu par heure, mise en forme), en une seule écriture différée de 900 ms. Le témoin dit « ✔ enregistré » quand le hub l'a accepté. Rien ne s'écrit tant que Paul ne modifie rien, ni en répétition.
- **L'atelier entier**, avec les boîtes du site et jamais celles du navigateur :
  - écrire dans la diapo ;
  - + bloc, le formulaire d'objet ;
  - dupliquer, insérer, déplacer, supprimer ;
  - couper ici, envoyer vers une autre séance ;
  - nouvelle activité ;
  - « Jouer en avance » ;
  - les notes ;
  - G et S, Ctrl/Cmd+H ;
  - Ctrl/Cmd+C, X, V sur les blocs ;
  - changer l'adresse d'une image ;
  - écrire une fiche sans feuille ;
  - passer une diapo dans une heure nouvelle ;
  - déclarer un objet manquant.
- **En classe :**
  - les pages p8-5h : une vignette par page, le compteur, la vue « Tableau » ;
  - la fiche s'ouvre en page, se dévoile paragraphe par paragraphe et prend le ✍🏻 ;
  - l'entête dit la classe et le créneau entiers à 1366 et à 1280 ;
  - ▶ ne dévoile jamais rien derrière un document projeté.

## 2 · Les empreintes
| | md5 | taille |
|---|---|---|
| production de départ `index.html` (8.74.0-③) | `ac792b28f40d3a0510e725fc4a6b6985` | 1 838 175 o |
| maquette p8-5g (branche `deroule/p8-5g`) | `62d9557ac8fedcfbdd8b157a2588cbee` | |
| `index.html` (arrivée, poussée 9) | `4da0faa5b38e657a13e7dd05b46d0c1c` | 1 386 111 o |
| `dr/dr-socle.js` | `3e1c89956c05f2908de07294de5ac86e` | 180 300 o |
| `dr/dr-atelier.js` | `af87a284bfab0c60647111a6a5572b94` | 146 995 o |
| `dr/dr-gabarit.js` | `a62bc67237f50ee623c8a9f2884434db` | 21 563 o |
| `dr/dr.css` | `41be0b703e85a47285686dd05c4c742f` | 110 059 o |
| `assemble/index.html` (8 modules, poussée 9) | `c0079d0ad4ce1a78617be9c4a36aa736` | 2 151 240 o |

*Ces empreintes sont celles de la poussée 9. Les autres exécutants poussent encore : la page assemblée bouge avec eux.*

## 3 · Ce qui tombe (compté)
- **Du site : 73 retraits ou remplacements** (liste détaillée : `E1/decoupe/rapport.txt`).
  - Le pont entier : `AT_DR_B64` (309 824 o en base64), l'iframe, `drWin`, `AT_PONT`, `drDoc`, `atDrMonter`, `atDrModifsDeLaSeance`, etc.
  - Les fonctions `atVues*` / `atSom*` sont réécrites, et non plus tombées.
  - S'y ajoutent ensuite :
    - le glisser des minis entre séances (les minis n'existent plus ; `AT_DRAG_ECR` n'était plus déclaré, et chaque `dragover` levait une erreur) ;
    - le changement de classe par `AT_PONT` ;
    - **29 règles mortes de `pont-css`** (les 26 autres portent les vues du site).
- **De la maquette :** `DATA` (87 381 o), `ELEVES`, et 37 nœuds de simulation (13 646 o : `#fsimu` et ses neuf commandes, `HEURES_SIM`, `DECALAGE`…).
  - Lectures de `DATA` remplacées par les interfaces du socle : seances 27, activites 23, classe 19, notes 13, documents 11, travailPrevu 10, taxo 9, chapitre 4, feuilles 3.
  - `HEURES_SIM` : 33.
  - Les trois fausses vidéos de la clé, « Séance 2 — (à venir dans la maquette) », « 1 séance dans la maquette », « (simulé…) », « (à venir : p2/p3) » ;
  - le journal des gestes de l'atelier (contrat §5).
- **Mon recyclage R1, R2, R4, R5, R6** (codé avant la relance du 21/10 12:50 qui le donne à E4) : retiré avant toute poussée, gardé pour E4 dans `E1/POUR-E4-recyclage-R1-R2-R4-R5-R6.diff`.

## 4 · Les fonctions touchées
376 fonctions nommées dans mes modules (`dr-gabarit`, `dr-socle`, `dr-atelier`, ma part de `dr-classe`) :
- **143 reprises telles quelles** ;
- **136 reprises et changées**, chaque changement commenté `E1 : lisait …` ou `E1 (…)` ;
- **97 nouvelles**.

Tailles avant et après (`toString().length`) : **`E1/NOTE-fonctions.md`**, produit par `E1/outils/tailles.mjs`, rejouable. Pour ma part de `dr-classe`, la taille « après » est celle de la version d'E2, qui l'emporte. Les globales de la maquette restent telles quelles quand elles n'entrent pas en collision ; les 8 collisions mesurées sont préfixées `dr_`, comme les 11 classes `dr-*` et les 7 ids `dr-*`. Le banc `collisions` est à **0 / 0 / 0**.

## 5 · Les bancs
- **Le banc d'E1** : `E1/bancs/banc.mjs`, un banc unique, **A1 à A27**, sur `assemble/index.html` et le faux hub. Il passe par les gestes réels, de l'entrée du site jusqu'à l'Atelier.
  - A1 collisions · A2 ce qui tombe · A3 la porte et la barre · A4 une modification → `B/deroule` · A5 Structure ↔ Atelier · A6 la colonne unique · A7 p8-5h et les tailles · A8 la trame ligne à ligne · A9 l'écriture complète · A10 l'Atelier entier.
  - A11 la mise en forme · A13 les blocs au clavier · A14 l'adresse d'une image · A18 les dettes · A19 la fiche ouverte · A20 la relance du 21/10 · A21 et A22 les relecteurs neufs · A23 la relecture continue d'E4 · A24 le réveil n°3 · A25 la relecture continue d'E4 (13:35-14:05) · A26 le réveil n°5 (A4, B4, A5) et la passe d'infobulles · A27 la copie jouée d'un autre jour (réveil n°8).
  - A12, A15, A16 et A17 (R4, R2, R1, R5) sont partis avec le recyclage vers E4.
  - **Dernier passage : 108 vérifications, 0 échec** (poussée 8), puis **124 vérifications, 0 échec** sur la poussée 9 (`2c24b230`, `E1/sorties/1157/banc-E1.txt`), **153 vérifications, 0 échec** sur la poussée 12 (`dfa8db4b`, `E1/sorties/1502/banc-E1.txt`). Depuis la poussée 12, il joue l'heure 1 d'une séance jamais jouée, comme les contrôles v2.2 (`MJPC_JOUE=1` garde l'heure du 07/09).
- **Le banc de la conscience** (`banc.sh`) à chaque poussée, sorties dans `E1/sorties/<heure>/` :
  - collisions 0 / 0 / 0 ;
  - **PARCOURS VERT** ;
  - mode test : zéro écriture au hub — vert depuis le parcours v3 ;
  - **contrôles K1-K13 : 108 vérifications, 0 échec** (depuis la v2.1).
- **Les gardes vérifiées à rebours :** les gardes F17 et C4/C5 sont rouges sur la page d'avant la correction et vertes après.

## 6 · Les captures
Dans `E1/captures/` (1366 × 768, faux hub), par `E1/bancs/captures.mjs` :
1. l'atelier et la colonne unique ;
2. la mise en forme enregistrée ;
3. le menu de la colonne au-dessus du site ;
4. le menu d'une image ;
5. la modale « changer l'adresse », avec l'aperçu qui suit la frappe ;
6. la taille obtenue (13 · 12) ;
7. l'entête du pilotage sur deux rangées ;
8. la fiche ouverte au pilote.

## 7 · Ce que les relecteurs neufs ont trouvé (contrat §8)
Deux sous-agents, avec le mandat, le contrat et la page seuls.

- **Le n°1 (le mandat point par point) : 14 trouvailles.** Corrigées et gardées dans A21 :
  - le menu de la colonne passait sous le site ;
  - les gestes de l'atelier allaient au journal de la classe ;
  - des restes de simulation et des textes périmés ;
  - le témoin posé à la minuterie ;
  - le titre de séance inerte ;
  - « Éditer dans l'atelier » manquait sur une séance ;
  - l'id d'activité contenait le rang de la séance, et `diapos` était vide ;
  - « + fiche… » était impossible.

  Les autres étaient chez d'autres ou déjà tranchés (voir le journal, poussée 8).
- **Le n°2 (casser l'Atelier) : 21 trouvailles.** Corrigées et gardées dans A22 :
  - la note de la fin d'heure perdue ;
  - le document joint perdu ;
  - la barre et les notes hors du cadre ;
  - pas de deuxième heure possible ;
  - la colonne à largeur variable ;
  - la frappe perdue en quittant ;
  - l'objet manquant oublié ;
  - les touches seules actives dans l'atelier ;
  - des champs vides écrits au hub ;
  - « insérer une séance » dans l'atelier ;
  - la zone d'écriture sur une image pleine.

  Cinq défauts relèvent du recyclage d'E4 (2, 6, 7, 8, 9) : ils lui sont transmis au journal. Un autre, l'enveloppe de `dr_sauve` par E4, est laissé à l'arbitrage de la conscience.
- **Trouvé par mes captures :**
  - le corps d'une fiche du site héritait la grille de la mise en page, et s'écrasait lettre par lettre dans la colonne unique ;
  - la flèche d'une marque n'avait pas de pointe (ce défaut était dans mon R1, parti chez E4).

- **La relecture continue d'E4** (12:33-12:38) : sept défauts chez moi, corrigés et gardés dans A23 — dont un **grave** (Entrée deux fois puis une frappe rapide : la première lettre tombait dans la ligne d'avant).

- **Le réveil n°3** (15:14, ce que la relecture continue tenait ouvert) : 1 et 6 (A23), 2, 3, 4, 5, 8, 9 (A24) — dont : un appui sur un élément grisé le dévoile sans y écrire ; le bandeau « Enregistré à … » du site ne couvre plus rien (témoin discret dans l'entête) ; une réponse tapée dévoile sa question et part au tableau ; « Activité n — » au récit dès qu'une activité existe.
- **La relecture continue d'E4** (13:35-14:05, relue sur `a68469f5`, antérieur à mes poussées 10 et 11) : ce qui restait chez moi est corrigé et gardé dans A25 (chaque garde rouge sur la page d'avant, verte après) :
  - **F2 + note** (grave) : initiales, 1/2/3, note, Entrée → une seule pose, le bon motif, la note. E2 a poussé la même correction au même endroit (`712accda`) : sa version est gardée, A25 la mesure ;
  - **hors heure lancée, rien au journal** (l'« heure 1 » fantôme de la Relecture venait de là) ;
  - le volet suit ▶ ; « + bloc » → la frappe remplace « Nouvelle consigne » ; Échap ferme le menu d'une étape ; en mode test, une pastille « mode test » au lieu d'« Enregistré à … ».
- **Le réveil n°5** (A4 14:50, B4 15:50, A5 16:15), gardé dans A26 : la page suit ce que ▶ montre ; une question grisée cliquée s'ouvre sur la saisie de sa réponse, une consigne grise reste grise ; Ctrl+B marque l'occurrence choisie ; l'entête ne descend plus quand le témoin paraît ; l'image absente garde sa ligne ; le dégel dit le rang dans l'heure ; rien n'est « terminé » de ce qui a été feuilleté avant le lancement ; l'atelier ouvert pendant l'heure journalise sa copie (`copie-classe`) — **E2 a fait sa part (`dr_reprendre` relit la copie) : le bloc tient de bout en bout** (A26).
- **Le réveil n°7** : le témoin de l'entête lisible en entier au Pilotage (en fin d'entête) ; dans l'atelier, celui de sa barre dit l'heure. En heure lancée, un bloc neuf s'écrit par l'onglet Atelier (`#ong-atelier`) puis « ✎ clique ici et écris » ; le Pilotage n'a pas de zone (p8-4). La passe de dettes, une ligne par dette, est au JOURNAL (poussée 14).
- **Le réveil n°8 — la copie jouée d'un autre jour** (contrat §12.8), gardé dans A27 : au lancement d'une heure, les retouches faites en classe aux heures d'avant passent dans la copie (`dr_copieReporter`) — un titre retouché le lundi est là le mardi ; au premier lancement, `dr_jouerCopie` fusionne la copie d'avant par eid avec la trame (une séance close repart de la trame). L'écran d'ouverture ne lève plus d'erreur sur une heure de la veille jamais close.
- **Dernier passage (poussée 15, `d7a1976e`, sorties `2006`)** : banc de la conscience **entièrement vert** (le mode test aussi), K1-K13 108 / 0 ; banc E1 174 / 0 ; le grave 110 tient de bout en bout (A26).

## 8 · Les relances
Toutes traitées, marquées « traitée » sous chacune dans `RELANCES/E1.md` :
- le recyclage passé à E4 ;
- les trois défauts mesurés par E4 ;
- F15 ;
- le réveil n°2 (#dr-session, `dr_ctx` en vue tableau, le crochet `dr_versMur` d'E3, C4/C5) ;
- l'entête à 1366.

## 9 · Ce qui reste — jamais une dette cachée
- **13 · 12 :** le libellé dit la taille obtenue. **Passer en pages plutôt que réduire la police reste à trancher par Paul.**
- **Les activités sur la trame réelle :** le hub n'en porte aucune (0 `actId` sur 95 écrans). Elles sont donc sans numéro jusqu'à ce que Paul les crée (F8). Le relecteur d'E4 attendait « chaque activité porte son numéro » : **la contradiction est à arbitrer**.
- **Les documents :** un document se joint dans la Structure, pas dans l'atelier. Les feuilles (`DATA.feuilles`) n'ont pas de source dans ce mandat : une fiche s'écrit donc en ligne, sans lien de feuille (F17).
- **La clé USB :** le dossier choisi n'est retenu que pour la session (pas de stockage durable). Lire la vidéo au pilote depuis la clé n'est pas dans mon territoire et n'a pas été vérifié ici.
- **La frappe avant départ :** l'écriture part quand la page se cache ou se ferme, mais par `mjpcPutJson` sans `keepalive`. À la fermeture brutale d'un onglet, le navigateur peut encore l'interrompre.
- **Le défilement de 36 px (relecteur n°2, 10) :** non reproduit sur l'état actuel ; il est gardé au banc.
- **`dr_sauve` enveloppé par E4 (son R4) :** à arbitrer par la conscience (contrat §5).
- **R14 au tableau** (la couche d'annotation de la classe, ANNOT) : à E3.
- **R1, R2, R4, R5, R6 :** à E4. Les défauts relevés par le relecteur n°2 sur sa version sont transmis.
- **Pour E2** : la copie jouée garde la fin d'heure de l'heure 1 quand l'EDT lance l'heure 2 (une vignette de plus) — A7 l'écrit tant qu'elle existe.

# NOTE — E3, le tableau (mandat d'intégration du déroulé, 21/10/2026)

*Note finale, demandée au réveil n°9 (22:26), écrite à 22:45. Elle remplace les versions de 13:20 à 17:57, gardées dans l'historique git. Le détail heure par heure est dans `E3/JOURNAL.md`, les relectures dans `E3/RELECTEURS-NEUFS.md`. Rien de ce qui n'est pas fait n'est tu.*

## Ce que ça change pour la classe
- **« 🖥 Écran 2 » ouvre le site lui-même**, en lecture seule (`index.html?vue=tableau&local=1`), à envoyer au vidéoprojecteur (Win+K ou Win+P « Étendre », puis F11). La fenêtre montre exactement ce que voit la classe : la diapo, ce qui est dévoilé, la page, la taille, le minuteur, « qui a participé », la réponse tapée lettre par lettre. Elle ne montre jamais les notes de Paul ni ce qui n'est pas dévoilé. Elle suit chaque ▶ sans se recharger.
  - Gelée, elle ne bouge plus, et elle rattrape au dégel.
  - Ouverte pendant le gel, elle montre l'image gelée.
  - Rechargée, ou rouverte pendant que Paul est dans l'Atelier, elle remontre ce que voit la classe.
  - **Restée ouverte pendant que Paul recharge son pilote**, elle est retrouvée par le pilote rechargé et repart avec lui.
- **Le tableau distant** : l'ordinateur de la classe ouvre `?vue=tableau` (le bouton « Adresse du tableau » affiche l'adresse ; le QR tombe).
  - Sans cours, il montre l'attente : le nom du site, l'heure, la date, et « Classe attendue : 3E Charles de Gaulle · 08:57 – 09:52 » quand l'emploi du temps dit qu'une heure commence.
  - Pendant l'heure, il suit le pilote. Au banc, du clic au mur : médiane ≈ 900 ms, maximum < 1 s, pour un attendu ≤ 1 500 ms.
  - Pilote fermé, réseau coupé ou gel : il garde sa dernière image. Il ne revient jamais tout seul à l'attente (décision de Paul, LOT B ③). Il n'accepte une scène que si elle est plus récente et du cours en cours.
  - Il n'écrit jamais rien : la garde bloque et compte `fetch` comme `sendBeacon`. Au banc, personne n'essaie même d'écrire.
- **Le témoin « ● session »** dit si ce que voit la classe part bien vers le tableau distant. Dans la vue « ⧉ Tableau », « tableau en Win K » ne s'affiche que si la fenêtre est vraiment ouverte.
- **Le téléphone (`?vue=tel`) tombe** (cadrage 1 §13), avec le QR qui servait à le rattacher.

## md5
- **Départ** :
  - production `ac792b28f40d3a0510e725fc4a6b6985` ;
  - maquette p8-5g `62d9557ac8fedcfbdd8b157a2588cbee` ;
  - `index.html` d'E1-a `97ff08680202d3f07fb901a93d1931d2`.
- **À cette note** :
  - `dr/dr-tableau.js` `1691cda68c23…` (27 782 o, 34 déclarations, toutes `dr_*` / `DR_TAB*`) ;
  - `index.html` `2618fd3220c8…` (avec les poussées de tous) ;
  - l’assemblé joué et ses sorties sont dans `sorties/2239/`.

## Ce que j'ai touché dans `index.html`
J'ai appliqué deux outils : `E3/outils/brancher-index.py`, puis `E3/outils/relance-1315.py`.
- **Retirées (31 fonctions).**
  - La scène à l'ancienne : `sesPhoto` (3 021 o), `sesEmettre`, `sesPartEmettre`.
  - Le rendu distant sur l'ancien moteur : `sesTabMonter`, `_sesTabBoite`, `_sesTabComposer` (4 496 o), `sesTabChrono`, `sesTabQui`.
  - Le téléphone : `sesBootTel` (5 297 o), `sesTelChercherCours`, `sesBrancherPiloteTel`, `sesTelGeste`, `sesTelCranPas`, `sesTelCran`, `sesTelMajCran`, `sesTelChrono`, `sesCurseurFin`, `sesTelPeindre`, `sesTelPart`, `sesPartPeindre`, `sesPartMotifs`, `sesPartMotif`, `sesPartRetirer`, `sesTelPlus1`.
  - Les orphelines : `sesPollPilote`, `sesGet`, `_sesRangLocal`.
  - Le bandeau, dont l'hôte est tombé : `sesBandeau`, `sesBandeauEtat`.
  - Le QR : `sesQROuvrir`, `sesQRFermer`.
  - En tout, environ 42 ko.
- **Reprises et rebranchées (5).**
  - `sesOuvrirTableau` : 543 → 146 o.
  - `sesBootTableau` : 1 350 → 411 o.
  - `sesTabVeillePointeur` : 679 → 590 o, par `dr_lire`.
  - `sesTabChercherCours` : 543 → 542 o, par `dr_lire`.
  - `sesTabPoll` : 2 217 → 123 o.
- **`SES.mode`** ne connaît plus `tel`.
- **La garde lecture seule** est reprise telle quelle, plus `sendBeacon`.

## `dr/dr-tableau.js` (nouveau)
- **Côté pilote.**
  - `dr_ouvrirTableau` : une seule fenêtre.
  - `dr_versMur` : le crochet que `pousser`, `fermerFiche`, l'Atelier et la répétition appellent (E1). Il envoie l'état, l'écran et les documents à la fenêtre, recalcule « qui », puis écrit la scène.
  - `dr_scene` / `dr_sceneAuto` : `C/scene` = `et` + `{eid, origine, ts croissant, trameMaj}`, 250 ms après chaque geste. Rien n'est écrit en vue tableau, dans l'Atelier, en répétition, dans la Relecture, ni hors d'une heure lancée.
  - `dr_sessionEtat` (`#dr-session`) et `dr_tabTemoin` (le témoin de la vue « ⧉ Tableau »).
  - `dr_tabPoserBoutons` : l'infobulle d'« Écran 2 » et le bouton « Adresse du tableau » (`dr_tabAdresse`).
  - La veille : la copie jouée (`trameMaj`) et « qui a participé », car une parole n'appelle pas `pousser`.
  - L'écoute `pret` / `ici` : la fenêtre s'annonce, et un pilote rechargé l'adopte.
- **Côté tableau.**
  - `dr_tabPoser` / `dr_tabDemarrer` : la page tableau (l'attente, `#mur2.mur.tableau`).
  - `dr_tabRecevoir` : la fenêtre locale, qui ne lit jamais le hub.
  - `dr_tabMonter` / `dr_tabSonder` / `dr_tabMontrer` / `dr_tabPointeur` / `dr_tabLireSeance` : le distant, sondé toutes les 900 ms. L'eid fait foi, `si` et `di` ne servent qu'en repli. Il refuse les scènes anciennes, d'une heure précédente, sans `ts` lisible, ou d'un autre cours.
  - `dr_tabAttendre` / `dr_tabCaseDuMoment` : la classe attendue, lue dans la grille, le calendrier et les classes, en lecture seule. `dr_caseDuMoment` d'E2 fait foi s'il existe.
  - `dr_rendreMur` : le rendu unique, qui appelle `rendre` du socle.

## Bancs et sorties
- **`E3/bancs/banc.mjs`**, banc unique : 17 cas, T1 à T17 (T16 : l’Atelier en pleine heure ne fait pas bouger le tableau ; T17 : le cahier de textes — rien au tableau en préparation, tout une fois montré).
  - **T1** : la fenêtre, le crochet, la fiche refermée qui garde l'image, « ● session », sans erreur JS.
  - **T2** : le gel. **T3** : l'ouverture pendant le gel. **T4** : la vue « ⧉ Tableau ».
  - **T5** : le distant (attente, scène, délai sur 10 ▶, image gardée, refus, garde, `sendBeacon`).
  - **T6** : « qui a participé » suit la parole ; `C/part` ne s'écrit plus.
  - **T7** : le minuteur R3. **T8** : « Adresse du tableau ».
  - **T9** : rechargé pendant l'Atelier. **T10** : le distant sans copie.
  - **T11** : l'attente par niveau, sans grille, à une heure passée.
  - **T12** : la Relecture n'écrit pas la scène, et le témoin ne ment pas.
  - **T13** : l'heure suivante, dans l'ordre §12.16 / §12.17.
  - **T14** : le bloc écrit en classe, le rechargement, la reprise.
  - **T15** : la copie d'un autre jour, la retouche de la veille au mur.
- Chaque trouvaille d'un relecteur a reçu sa garde, vérifiée rouge sur l'ancien assemblé et verte sur le nouveau.
- **Dernier passage : 105 vérifications, 0 échec** (T16 et T17 compris, sur `f7c3f2ab` d’E1) ; avant T17 : 99/99 (T16 compris, sur `69f8e1c5`/`82f70c97` d'E1 — voir le journal) ; avant T16 : 94/94 (`sorties/2239/`).
- **Le banc de la conscience** (`banc.sh`) est vert à chaque passage depuis 15:30 : collisions 0, parcours et mode test verts, K1-K13 108/0.
- **Captures** : `E3/captures/site/` (T1 à T15), et `E3/captures/` (la maquette, l'essai du module avant E1-a).

## Les relecteurs neufs
Deux relecteurs (12:30-13:00) ont relevé 8 trouvailles dans mon territoire, toutes corrigées et gardées. Le plus grave était chez moi : une erreur JS par seconde dans la page tableau. Leurs trouvailles chez les autres ont été signalées, et la plupart sont depuis réglées par leurs propriétaires. Ensuite, la relecture continue d'E4 a remonté chez moi les deux points du réveil n°3 (la Relecture qui écrivait la scène, le témoin « Win K »), réglés et gardés (T12), puis la ligne 110 (T14), réglée chez E2.

## Ce qui reste — chez d'autres (mesuré, au journal)
- **E1** :
  - cliquer dans une question grisée ne la dévoile pas (C1 4.2). Une fois dévoilée, la réponse passe au tableau lettre par lettre.
  - « texte au tableau » à 52 pt ne grossit le texte que de 1,8 % et ne pagine pas, au pilote comme au tableau. La fenêtre reproduit fidèlement le pilote.
  - `#dr-zone` est encore posé dans la page tableau. Ma rustine renomme son `#mur` en `#dr-mur-gare` ; elle tombe dès qu'E1 ne le pose plus.
  - `fermerFiche` appelle `dr_versMur(null, {sortie:true})` comme la sortie de l'atelier. Je distingue les deux par `S.fichePage` ; un appel explicite serait plus sûr.
- **E1 (grave 148, réveil n°10)** : réglé par E1 (`69f8e1c5`) — T16 vert.
- **E1/E4** : R14 (la fiche pilotée) et R1 (les marques) passent par `rendre` et `dr_versMur`. Le tableau les montrera tels que le pilote les rend ; je les vérifierai au banc à leur livraison.
- **E2** : `dr_caseDuMoment` n'est pas encore exposée en fonction pure (ma `dr_tabCaseDuMoment` applique la même règle). (« T-undefined » vu au banc T15 : réglé par E2, commit `067f8ba3`.)

## Ce qui est à Paul
- **Le nom du bouton** : « 🖥 Écran 2 », son mot (cadrage 1 §1.7), ou « ⧉ Ouvrir le tableau », celui du mandat. Je n'ai rien renommé.
- **« Adresse du tableau » remplace le QR.** La page tableau n'écrit jamais, donc le QR ne pouvait pas se fermer tout seul au scan. Pour l'ordinateur de la classe, on tape l'adresse une fois, puis on la garde en favori.
- **Le téléphone tombe.** Le code reste dans l'historique de la production ; à refaire plus tard (point 22 du POINT).
- **À la clôture, le tableau garde la dernière image** au lieu de revenir à l'attente, selon sa demande de LOT B ③. Le cadrage 1 §1.9 disait l'inverse ; la conscience a tranché pour la production.

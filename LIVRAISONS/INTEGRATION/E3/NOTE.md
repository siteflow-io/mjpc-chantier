# NOTE — E3, le tableau (mandat d'intégration du déroulé, 21/10/2026)

*Écrite à 13:20, mise à jour à 13:35 après la relance du réveil n°2 (13:15) — voir la section « Après la relance ». Rien de ce qui n'est pas fait n'est tu.*

## Après la relance du réveil n°2 (13:15, traitée à 13:30, commit 552cb038) — ce qui l'emporte sur la suite de cette note
- **Le QR tombe** : à sa place, « Adresse du tableau » (`#dr-tab-adr`) affiche `?vue=tableau` en texte ; `sesQROuvrir`, `sesQRFermer` retirées.
- **`C/part` tombe** (`dr_part` retiré) ; « qui a participé » au tableau suit la parole.
- **`sesBandeau`, `sesBandeauEtat`, `sesGet`, `_sesRangLocal` tombent** ; `dr_sessionEtat` remplira `#dr-session` (à poser par E1) ; le pointeur passe par `dr_lire`.
- **La classe attendue** vient de `dr_proposer()` (E2, pas encore livré) ; sinon l'attente ne dit que le nom du site, l'heure et la date.
- **Le distant** n'accepte une scène que si `ts` est plus récent et la clé de cours celle de `cours_actif` ; il garde son image (pas de retour à l'attente).
- **`dr_versMur(et)`** : le crochet du socle (E1 le pose dans `pousser`, `fermerFiche`, l'atelier, la répétition ; ma veille reste en filet tant qu'il manque).
- **La garde** bloque aussi `sendBeacon`. La page tableau lit la séance (`dr_lireSeance`) pour les documents.
- Bancs : **E3 67/67** (le délai : 10 ▶, médiane ≈ 900 ms, maximum < 1 s ; attendu ≤ 1 500) ; banc de la conscience `sorties/1321/` : collisions 0, parcours vert, **K1-K13 108/108** ; mode test : P5 (l'outil).

## Ce que ça change pour la classe
- « 🖥 Écran 2 » (`#bvideoproj`) ouvre **le site lui-même** en lecture seule, `index.html?vue=tableau&local=1`, à envoyer au vidéoprojecteur. Il montre exactement ce que voit la classe : la diapo, ce qui est dévoilé, la page, la taille, le gel. Ce n'est plus une fenêtre écrite à la main avec des fonctions recopiées. Il suit chaque ▶ sans se recharger. Rouvert ou rechargé, même quand Paul est dans l'Atelier, il remontre ce que voit la classe.
- Un autre appareil (l'ordinateur de la classe) ouvre `?vue=tableau`, ou scanne le **QR** posé à côté du bouton.
  - Sans cours, il montre l'attente : le nom du site, l'heure, la date, et « Classe attendue : 3E Charles de Gaulle · 08:57 – 09:52 » quand l'emploi du temps dit qu'une heure commence.
  - Dès l'heure lancée, il suit le pilote. Au banc, un ▶ arrive 111 ms après l'écriture au hub, auxquels s'ajoutent les 250 ms d'émission.
  - Pilote fermé, pilote parti ou gel : il garde sa dernière image. Il n'écrit jamais rien, et rien n'essaie même d'écrire.
- Le minuteur d'activité (R3, compté par E2) paraît au tableau en bandeau.
- La participation part au hub en désignant chaque diapo par son identité, sans rang ni note « pour toi seul ».
- Le téléphone (`?vue=tel`) **tombe**, comme le veut le cadrage 1 §13.

## md5
- Départ : production `ac792b28f40d3a0510e725fc4a6b6985`, maquette p8-5g `62d9557ac8fedcfbdd8b157a2588cbee`, `index.html` d'E1-a `97ff08680202d3f07fb901a93d1931d2`.
- À cette note : `index.html` `dfea5562ddd5f0b0ed671aaeda129421` (avec les poussées des autres) ; `dr/dr-tableau.js` `b1ffdda1e9e11efe791b9b0b28ff3397` (21 275 o, 29 déclarations) ; `assemble/index.html` `691f1c2b23e5d4abaa3168d5f1711cca`.

## Les fonctions touchées dans `index.html` (taille avant → après, par `E3/outils/brancher-index.py`)
- **Reprises et rebranchées (8)** :

  | fonction | avant | après | ce qui change |
  |---|---|---|---|
  | `sesOuvrirTableau` | 543 o | 146 o | délègue à `dr_ouvrirTableau` |
  | `sesBandeau` | 813 o | 852 o | sans « 📱 Téléphone » |
  | `sesQROuvrir` | 1 114 o | 1 127 o | adresse `?vue=tableau`, plus de `/qrScans` ni de `DELETE` direct |
  | `sesQRFermer` | 108 o | 83 o | |
  | `sesBootTableau` | 1 350 o | 411 o | appelle `dr_tabDemarrer` |
  | `sesTabVeillePointeur` | 679 o | ≈ 600 o | appelle `dr_tabMonter` |
  | `sesTabChercherCours` | 543 o | ≈ 650 o | appelle `dr_tabMonter` ; l'attente est tenue par `dr_tabAttendre` |
  | `sesTabPoll` | 2 217 o | 123 o | appelle `dr_tabSonder` |

  Plus `SES.mode`, qui ne connaît plus `tel`, et l'amorce du téléphone, retirée. La garde lecture seule est **reprise telle quelle**.
- **Ce qui tombe (25 fonctions, 37 400 o environ)** :
  - la scène à l'ancienne : `sesPhoto` (3 021), `sesEmettre` (302), `sesPartEmettre` (978) ;
  - le rendu distant sur l'ancien moteur : `sesTabMonter` (1 286), `_sesTabBoite` (1 850), `_sesTabComposer` (4 496), `sesTabChrono` (263), `sesTabQui` (861) ;
  - le téléphone : `sesBootTel` (5 297), `sesTelChercherCours`, `sesBrancherPiloteTel`, `sesTelGeste`, `sesTelCranPas`, `sesTelCran`, `sesTelMajCran`, `sesTelChrono`, `sesCurseurFin`, `sesTelPeindre`, `sesTelPart`, `sesPartPeindre`, `sesPartMotifs`, `sesPartMotif`, `sesPartRetirer`, `sesTelPlus1` ;
  - et `sesPollPilote` (1 050), orpheline (audit C5).
  - Les seuls appels restants vers ces fonctions sont dans `sesBrancherPilote` et `sesAppliquer`, qui tombent chez E2.

## `dr/dr-tableau.js` (nouveau, 21 275 o)
- Côté pilote :
  - `dr_ouvrirTableau` : la fenêtre unique, qui devient `fenetreMur` pour `pousser` du socle ;
  - la réponse à `pret`, y compris pendant l'Atelier ;
  - `dr_scene` (`et` + `{eid, origine, ts croissant, trameMaj}`, sans ce qui ne regarde que Paul) et `dr_sceneAuto` (250 ms) ;
  - `dr_part` et `dr_partListe` ;
  - `dr_tabVeiller` : la veille, **sans crochet** sur le socle ;
  - `dr_tabPoserQR`, et l'infobulle de `#bvideoproj`.
- Côté tableau :
  - `dr_tabPoser` (l'attente, `#mur2.mur.tableau`) et `dr_tabDemarrer` ;
  - `dr_tabRecevoir` : la fenêtre locale ne lit jamais le hub ;
  - `dr_tabMonter`, `dr_tabSonder`, `dr_tabMontrer`, `dr_tabPointeur` : le distant (sondage à 900 ms, l'eid fait foi, jamais une scène plus ancienne, ni d'une heure précédente, ni sans pilote, ni à l'heure illisible) ;
  - `dr_tabAttendre` et `dr_tabHeureAttendue` : la classe attendue, la grille de l'EDT lue en lecture seule ;
  - `dr_rendreMur` : **le rendu unique**, qui appelle `rendre` du socle.
- Toutes les écritures passent par `dr_ecrire` ; aucune en vue tableau, en répétition, dans l'Atelier, ni hors d'une heure lancée.

## Bancs et sorties
- `E3/bancs/banc.mjs` est le banc unique, avec deux entrées (la maquette seule, ou le site avec `MJPC_ENTREE=site`). Il couvre T1 à T10 : la fenêtre, le gel, l'ouverture pendant le gel, la vue « ⧉ Tableau », le distant, la participation, R3, le QR, le rechargement pendant l'Atelier, le distant sans copie.
- **Sur le site, 62 vérifications et 0 échec** (`sorties/1305/banc-E3.txt`, rejoué après rebase : `banc-E3-apres-rebase.txt`).
- Sur la maquette p8-5g : 19 sur 19 (`sorties/0931/`). Module + maquette : 18 sur 19, l'échec étant attendu (`sorties/1020/`).
- Le banc de la conscience (`sorties/1143/`, `sorties/1200/`) : **parcours vert, P8 vert**. Le reste du rouge n'est pas d'E3 :
  - le mode test, où l'outil attend des écritures (P5) ;
  - les K bloqués par le voile `#fi-overlay` ;
  - la collision `durees` (E2).
- **K7, K10, K11 verts** et K6 vert, sur une copie sans le voile (`sorties/1200/controles-K-sur-copie-sans-voile.txt`).
- Les captures sont dans `E3/captures/` (maquette, essai du module) et `E3/captures/site/` (T1 à T10).

## Les relecteurs neufs
Voir `E3/RELECTEURS-NEUFS.md` : 8 trouvailles dans mon territoire, corrigées, chacune avec une garde vérifiée rouge sur l'ancien assemblé et verte sur le nouveau. Ce qui est chez les autres est signalé (E1 : 6 points).

## Ce qui reste (aucune dette cachée)
1. **En attente de la conscience** (audit et relecteurs ; `RELANCES/E3.md` est encore vide à 13:20) :
   - C1 et C2 (qui possède l'envoi et la vue de droite ; ça marche sans y toucher) ;
   - **C3** : l'attente revient-elle à la clôture ? Aujourd'hui, comme la production, l'image reste ;
   - C5 (les fonctions orphelines : je les ai prises) ;
   - **C7** : `di` (un rang) reste dans la scène comme repli, l'eid fait foi ;
   - C8 et M3 : `C/part` n'a plus de lecteur ;
   - I1 et I2 (le délai : environ 0,1 s après l'écriture, 0,9 à 1,1 s de bout en bout) ;
   - **la classe attendue**, faite sur ma proposition I5, à confirmer ;
   - le nom du bouton (« 🖥 Écran 2 » contre « ⧉ Ouvrir le tableau »).
2. **Ma rustine dans la page tableau** : l'id du mur caché est renommé `#dr-mur-gare`, parce que `dr-gabarit.js` pose `#dr-zone` partout. Elle tombe dès qu'E1 ne la pose plus en page tableau.
3. **R1** (les marques d'image au tableau) et **R14** (la fiche pilotée comme une diapo) dépendent du rendu commun d'E1. Le tableau rend ce que `rendre` rend : rien n'est à transporter en plus tant que l'état est dans `et`. À vérifier au banc quand E1 les livre.
4. **M8** : la garde lecture seule ne couvre que `fetch` (pas `sendBeacon`), reprise telle quelle comme le mandat le dit.
5. **Les dettes de mon territoire** : 12 · 05, 12 · 14 à 16, 12 · 18, 12 · 19 ne touchent pas le tableau ; 12 · 17 (`_drProchainCreneau`) est contournée par la classe attendue, sans toucher `_drProchainCreneau`.
6. Hors d'E3, vus par mes relecteurs (pour E1) : la diapo de la répétition projetée sans garde, « Chrono au tableau » en dur, la police plafonnée et l'absence de pages au tableau, l'infobulle du gel, « 1 élève … ont participé ».

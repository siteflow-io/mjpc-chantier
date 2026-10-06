# MANDAT — DÉROULÉ · MAQUETTE p8 : « UN SCHÉMA PAR DIAPO, PARFAITEMENT LISIBLE »
*Conscience n°13, 05/10/2026 — version 3 (C13, tour 14 ; décision 6 ter ajoutée au tour 15, « ok » de Paul ; déposée au tour 15), après la relecture de l'historique (tour 10) et la lecture de l'existant (tours 12 à 14, `TRANSCRIPTS/C13/pieces/CARTE-EXISTANT-DEROULE.md`). Soumis à Paul dans la conversation avant tout dépôt. Exécutant : session cloud de Claude Code, sur le sas `siteflow-io/mjpc-chantier`. Trois livraisons, chacune sur sa branche, puis arrêt.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul, 29/09 (C12, tour 266) : « Une diapo ne peut jamais contenir plusieurs schémas. Par ailleurs, quand il y a un schéma, il faut absolument qu'il soit parfaitement lisible. » — Cadrage 1 · 5.4 : « 26 pt est le plancher lisible du fond de la classe » (Paul, 15/09). Cadrage 4 · 3.2 : un schéma a l'échelle « plein » par défaut et se dévoile élément par élément.
**Pour qui** : la classe, qui lit le schéma au tableau jusqu'au fond de la salle. **Le geste de classe** : Paul construit la carte avec la classe en la dévoilant branche par branche (▶) ; en préparation, il pose un schéma dans l'atelier sans jamais avoir à régler sa lisibilité à la main.

## CE QUE PAUL A TRANCHÉ (C13, tours 4 et 11)
1. **Un schéma = sa diapo.** La diapo d'un schéma porte son titre, le schéma, et au plus une consigne d'une ligne. Deux schémas sur une diapo, ou un schéma noyé dans du texte, sont refusés à l'import. « Schéma… » sur une diapo qui a déjà du contenu pose le schéma dans une diapo nouvelle, juste après. « Schéma… » est grisé si la diapo a déjà un schéma.
2. **Les libellés sont lisibles du fond** : 32 pt pour le centre et les titres (familles, dates, nœuds de tête), 26 pt pour les éléments (notions), **jamais moins**, quel que soit le réglage « Texte au tableau » ; le titre est dit une seule fois ; le texte n'est jamais coupé.
3. **« Trop dense » est une mesure, et rien d'autre** — aucun plafond en nombre (Paul, 13/09, C12 tour 88 : « la densité doit d'abord être absorbée par l'utilisation de l'espace tableau disponible » ; les plafonds proposés au tour 2 sont retirés, tour 10, point 44).
4. **Le moteur des schémas de l'ancien déroulé est repris tel quel** (tour 10, point 43) — ce que la maquette p7 n'avait pas fait (point 40) — avec les seules adaptations écrites ci-dessous (« Les télescopages »). Rien n'est plaqué par-dessus la maquette (Paul, tour 11 : « Ça ne peut pas être plaqué par-dessus l'existant »).
5. **« Couper le schéma ici »** (tour 10, point 45) : clic droit sur une famille (ou un repère, un nœud, une rangée) dans l'atelier : la suite part dans un second schéma, même titre suivi de « (suite) », sur une diapo nouvelle juste après (même heure, même activité, mêmes notions, durée partagée) ; c'est le geste que « trop dense » propose.
6. **Une bulle par ▶** (tour 11, point 49) quand le schéma est réglé « Un à un » : pour la carte, ▶ dévoile la famille, puis chacune de ses notions, dans l'ordre de la source (comme l'ancien moteur) ; réglé « Tout ensemble », il paraît d'un coup. Les comptes de la maquette (diapo finie, T-5, « où on en est », récit) suivent les bulles.
6 bis. **Le panneau du schéma de l'existant est repris tel quel dans l'atelier** (joué le 05/10, `CARTE-EXISTANT-DEROULE.md` Z1) : la forme (Carte mentale, Frise, Arbre, Cycle, Tableau), « Un à un / Tout ensemble », « Contenu » avec la règle d'écriture de chaque forme sous le champ, « ⌖ Réordonner » (efface les places données à la main) ; sur une frise, on tire un point pour changer sa date. « + Schéma » est déjà grisé dans l'existant quand l'écran a un schéma.
6 ter. **Le réglage par défaut** (tour 15, point 64) : un schéma sans réglage garde le comportement de l'existant, « Tout ensemble » (rien ne change dans les chapitres déjà faits) ; un schéma créé par « Schéma… » part réglé « Un à un » (cadrage 4 §3.2).
7. **Une bulle se déplace à la main dans l'atelier, et seulement là** (tour 11, point 50) ; sa place prime sur le calcul ; elle est rangée comme dans l'existant (sous le texte de la bulle) : renommer une notion lui fait perdre sa place, et l'infobulle le dit.
**Conséquences, codées telles quelles** : coller ou dupliquer un schéma sur une diapo qui a déjà du contenu le pose dans une diapo nouvelle, juste après ; « + bloc » et « + étape » (autres que l'unique consigne d'une ligne) sont grisés sur une diapo à schéma, avec la raison ; la taille « petit » est grisée pour un bloc schéma ; en classe, rien ne se déplace dans un schéma (cadrage 1 · 9.1).

## LES TÉLESCOPAGES — l'ancien moteur contre la maquette et les cadrages (mesurés par la conscience le 05/10, tour 11)
La source : le moteur de l'ancien déroulé, **rangé en base64 dans `AT_DR_B64` d'`index.html` de production** (base `c9bc2d9`, md5 d'`index.html` à donner dans la NOTE, décodé : 229 960 o). Les fonctions des schémas : `schLignes`, `schemaHTML`, `carte`, `frise`, `arbre`, `cycle`, `grille`, `mesure`, `cle`, `separe`, `surface`, `dessine`, `SCH_COUL`/`COUL`, et la préhension (`tirSch`, `jalSch`, `repeintSch`, le `mousedown` sur `.sch g.n` / `g.jal`). Tu les extrais, tu les lis en entier, et tu les reprends **à part, sous un préfixe propre**, sans toucher à `dessinerSchema` de la p7 avant d'avoir remplacé son appel.
| | ce que fait l'ancien moteur | ce qui se télescope | ce que tu fais |
|---|---|---|---|
| T1 · la taille | polices 13 / 16 / 20 × l'échelle de la réglette, dans un cadre de 1000 × 560 : environ 18 pt pour les notions, 22 pt pour les familles, avant réduction ; quand ça ne tient pas, `surface` agrandit le dessin puis l'écran le réduit : le texte rapetisse encore | le plancher de 26 pt (décision 2) | les tailles viennent de la loi de la maquette (`policePx`, 32 pt = 5,6 % de la hauteur de la diapo ; titres 32 pt, éléments 26 pt, rien sous 26 pt à aucun cran) ; **`surface` ne réduit plus jamais le texte** : si, après l'écartement, ça ne tient pas dans le cadre visible, c'est « trop dense » |
| T2 · la place pendant le dévoilement | `schemaHTML(b, pourClasse)` coupe la source à ce qui est dévoilé **avant** de calculer les places : au tableau, les bulles déjà montrées bougent quand une nouvelle arrive | « pas de reconstruction », « l'image qui saute » (protocole maquette §3) | les places se calculent **une fois, sur le schéma entier** ; une bulle non dévoilée est pâle au pilote et absente au tableau, à sa place ; rien ne bouge au dévoilement (banc : positions identiques avant et après chaque ▶, au pilote et au tableau) |
| T3 · l'état du dévoilement | l'**état** est rangé dans le bloc (`b.vues`) ; le **réglage** « Un à un / Tout ensemble » aussi (`b.devoilerTout`, `false` = un à un) | la base saine a aboli `vues` / `rev` (cadrage 4 · 2.4, cadrage 1 · 13) ; l'état vit par diapo, par identité (`vuMax`, `etatDiapo`) | `b.vues` **non repris** : le dévoilement passe par le compteur d'éléments de la maquette ; `b.devoilerTout` **repris** : c'est un réglage de préparation, pas un état (décision 6 bis) |
| T4 · la mesure | `mesure()` estime la largeur (nombre de caractères × 0,54) | une estimation laisse passer des chevauchements réels | l'écartement travaille sur **les boîtes réelles** du texte rendu ; la mesure de « trop dense » est faite sur les boîtes réelles, contre le cadre réellement visible (C13, tour 2) |
| T5 · le dernier recours | `separe` « descend la plus basse… aucune limite de cadre — mieux vaut un dessin plus haut qu'un chevauchement » | « une diapo doit tout contenir » (Paul, C12 tour 114), le texte jamais coupé | si l'écartement sort du cadre visible, c'est « trop dense » (avec « Couper le schéma ici ») ; jamais un dessin qui déborde |
| T6 · déplacer à la main | `tirSch` déplace des bulles, `b.pos[cle(texte)]` les fixe ; `jalSch` déplace un point de frise et change sa date ; « ⌖ Réordonner » (`setPos({})`) efface les places ; `repeintSch` redessine **tout l'écran** | pas de reconstruction au clic ; la maquette rend par le morph (n°12 · 69) ; en classe rien ne se déplace (cadrage 1 · 9.1) | repris **dans l'atelier seulement**, même format `pos` (les coordonnées dans le repère 1000 × 560 restent valables : ce repère est étiré sur la place « plein ») ; pendant qu'on tire, seul le dessin du schéma est mis à jour ; au pilotage et au tableau, aucun déplacement |
| T7 · le tableau | le moteur dessinait dans sa propre page | la fenêtre du tableau reçoit une liste **fermée** de fonctions (n°12 · 75) | toutes les fonctions du dessin passent au tableau ; un banc vérifie le dessin au tableau |
| T8 · les couleurs | une couleur par famille (`SCH_COUL`) | la légende de surlignage (cadrage 4 · 2.2) | repris tel quel ; les couleurs des familles ne sont pas du surlignage, la légende ne les concerne pas |
| T9 · le contrat de donnée | `forme`, `titre`, `src` (une ligne par élément), `pos` ; la frise des feuilles (« date = événement ») | aucun | repris tel quel ; les chapitres déjà faits n'ont rien à réécrire |
| T10 · la p7 | `dessinerSchema` (p7) dessine les cinq formes à sa manière, sans couleurs, sans bulles par notion, sans déplacement à la main ; `b.el` = les lignes | la décision 4 | `dessinerSchema` de la p7 **est retiré** une fois remplacé ; ses bancs (`test-p7`, `test-p4a`) sont recalés sur le moteur repris et la NOTE dit chaque vérification changée |

## CE QUE TU NE TOUCHES PAS
`index.html`, `correction_dictee.html`, et rien du dépôt de production (tu le lis, tu n'y écris pas). La branche `main` du sas. La maquette n'écrit rien et ne lit rien au réseau (protocole maquette §2).

## À LIRE EN ENTIER AVANT DE CODER
- `PROTOCOLE-MAQUETTE.md` (racine de `siteflow-io/monsieurjaipascompris`) : il s'applique ligne à ligne.
- `DEROULE/CADRAGE-4-LA-PREPARATION.md` (§0.4, §1.4, §3.1, §3.2, §6.1) et `DEROULE/CADRAGE-1-LA-CLASSE.md` (§3.3, §5.1 à §5.7, §12).
- Le registre `docs/MJPC6-DETTES.md` (production), n°12 · 24, 30, 40, 43, 48, 51, 69, 71, 75 : les pièges déjà payés sur cette maquette.
- `TRANSCRIPTS/C12/TRANSCRIPT-C12.md`, tours 265 à 267 ; `TRANSCRIPTS/C13/TRANSCRIPT-C13.md`, tours 1 à 4.
- Le moteur de l'ancien déroulé (`AT_DR_B64` d'`index.html` de production, décodé) : les fonctions des schémas, en entier (voir « Les télescopages »).
- `CONSULTANT/CHAPITRE-1/chapitre-3e-poesie-peinture-final.json` : **la vraie carte « Les figures de style »** (8 familles, 27 notions) — elle entre dans les données de test.
- `TRANSCRIPTS/C13/pieces/T2-p8-*` et `T10-vraie-carte-p8-mesure.png` : **la mesure** (`T2-p8-measure.js`, à reprendre : boîtes réelles, cadre réellement visible) ; le rendu `T2-p8-inject.js` **n'est pas une référence visuelle** : la référence est l'ancien moteur (décision 4).

## LA BASE (vérifiée par la conscience le 05/10)
- Gabarit : `TRANSCRIPTS/C12/pieces/T265-v9c15p7-template.html`.
- Générateur : `TRANSCRIPTS/C12/pieces/T159-gen-par-difference.py`. Il lit `vis/v9c13-template.html` (= `T142-v9c13-template.html`) et `C12/maquette-v9c13-courante.html` (= `T280-maquette-v9c13-courante.html`).
- Régénérée par la conscience : **md5 `5045f337d930faaa9cb073e203cf44eb`**, identique à `T265-maquette-pilotage-ordi-v9c15p7-manipulable.html`. **Tu prouves ce md5 avant toute modification.**
- Les 24 bancs `T265-*.mjs` et `T265-tous-les-bancs-p7.sh`. Ils contiennent des chemins écrits en dur (`/home/claude/.npm-global/node_modules/playwright/index.mjs`, `/opt/google/chrome/chrome`, `file:///home/claude/C12/maquette-v9c15p7-courante.html`). Chemins adaptés, trois d'entre eux (p7, p1, a0) ont été rejoués par la conscience le 05/10 : 0 défaut.

## LES TROIS LIVRAISONS
Branches : `deroule/p8-1` (partie de `main`), puis `deroule/p8-2` (partie de `deroule/p8-1`), puis `deroule/p8-3` (partie de `deroule/p8-2`). **Jamais `main`.** Chaque livraison dépose `LIVRAISONS/DEROULE/p8-n/` (contenu exigé plus bas), pousse sa branche, puis tu enchaînes la suivante. **Après p8-3, tu t'arrêtes.** Si une livraison ne peut pas être finie sans dette, tu le dis dans sa NOTE et tu t'arrêtes là : tu n'enchaînes pas.

### p8-1 — les bancs tournent dans ta machine (la maquette ne change pas)
1. Installe Playwright pour Node (`npm install playwright`, puis `npx playwright install --with-deps chromium`) ; note les versions de Node, de Playwright et de Chromium.
2. Rends les 24 bancs portables, sans changer une seule vérification. Aucun chemin absolu. La maquette jouée, le Chromium et le dossier des captures se désignent par des variables d'environnement, avec un défaut relatif au dossier de la livraison.
3. Écris un banc unique, `bancs/tous-les-bancs.sh`. Il rejoue les 24, **échoue si un seul échoue**, et écrit sa sortie complète dans `sorties/tous-les-bancs.txt`, en tête : la date, les versions, le md5 de la maquette jouée.
4. Preuve attendue : 24 lignes « fin : 0 défaut(s) » sur la p7 inchangée (md5 `5045f337…`). Si un banc échoue chez toi, tu ne touches pas à sa vérification : tu dis lequel et pourquoi, et tu t'arrêtes.
5. Épreuve des bancs (dispositif, addendum du 20/08, ④). Dans une copie, casse volontairement une chose : retire « Couper la diapo ici » du menu du bloc. Montre que le banc qui l'exerce échoue sur la copie cassée. Montre que la vraie maquette revient à 0. Les deux sorties vont dans `sorties/`.

### p8-2 — le moteur des schémas repris, lisible par construction (le rendu seulement)
1. **Extrais** les fonctions des schémas du moteur de production (voir « Les télescopages ») ; mets-les dans le gabarit **à part, sous un préfixe propre** (cherche chaque nom dans le gabarit avant de l'écrire : n°12 · 40) ; un patch `patch-p8-2.py` appliqué au gabarit p7.
2. **Applique les adaptations T1 à T7**, et rien d'autre : chaque écart avec l'ancien code est listé dans la NOTE, avec la ligne du tableau qui le justifie. Une différence non listée est une faute.
3. **Branche** le rendu du bloc schéma de la maquette sur le moteur repris ; retire `dessinerSchema` de la p7 (T10).
4. **Le dévoilement** : un élément = une bulle (décision 6) ; carte : la famille, puis chacune de ses notions, dans l'ordre de la source ; frise : un repère ; arbre : un nœud ; cycle : une étape ; tableau : une rangée. Pâle au pilote, absente au tableau, **à sa place** (T2).
5. **Une seule fonction de mesure**, la même pour les bancs et pour l'atelier, qui compte : les chevauchements (entre bulles, et avec les autres couches de la diapo), les bulles hors du cadre réellement visible, les traits qui passent à travers un mot, les libellés sur deux lignes, les polices sous 26 pt. Si l'une n'est pas à zéro, « Sur la forme » et « À régler » disent : « Schéma « … » : il ne tient pas lisible — coupe-le : clic droit sur une famille → Couper le schéma ici ». L'ancienne règle de la p7 (« moins de la moitié de la diapo ») est retirée.
6. **Les captures**, chacune avec ses cinq chiffres de mesure écrits à côté : chaque forme seule sur sa diapo, au pilote (plein écran et zoom) et au tableau (1280 × 720), dévoilée à moitié puis en entier ; **la vraie carte « Les figures de style »** : si elle tient, la capture le prouve ; si elle ne tient pas, la capture et la mesure le disent — tu ne baisses ni la police ni rien d'autre : la conscience le rapporte à Paul.
7. **Les tailles d'écran** : 1366 × 768, 1536 × 864, 1920 × 1080, colonnes ouvertes et repliées.
8. **Bancs** : `test-p8-2-formes.mjs`, par le geste — chaque forme ouverte dans l'atelier, dévoilée au pilote par ▶ bulle par bulle, vérifiée au tableau ; **les positions de toutes les bulles identiques avant et après chaque ▶** (T2), au pilote et au tableau ; aucune police sous 26 pt à aucun cran de « Texte au tableau » (T1) ; la mesure à 0 sur les formes qui tiennent ; puis les 24 bancs rejoués (recalés là où T10 l'exige, dit dans la NOTE) et le banc unique à 0.

### p8-3 — un schéma par diapo : les gestes et leurs gardes
1. **« + bloc » → « Schéma… »** sur une diapo qui a déjà du contenu (autre que son titre et une consigne d'une ligne) : le schéma va dans une diapo nouvelle, juste après.
   - La diapo nouvelle reprend la même heure, la même activité et les mêmes notions, et porte le titre de la diapo suivi de « (suite) » ; la durée est partagée.
   - La diapo d'origine ne change pas.
   - Le site le dit, d'une notice comme celle de « Couper la diapo ici ».
   - Sur une diapo qui a déjà un schéma, « Schéma… » est grisé, avec la raison en infobulle : « une diapo n'a qu'un schéma ».
2. **Coller, dupliquer, taille, ajout** : les conséquences écrites plus haut, sous les décisions. Chaque geste grisé dit pourquoi.
2 bis. **« Couper le schéma ici »** (décision 5) : clic droit sur une bulle de tête (famille, repère, nœud de premier niveau, étape, rangée) dans l'atelier ; les lignes de la source à partir de celle-ci partent dans le second schéma, avec leurs places à la main (`pos`) ; la notice le dit ; grisé sur la première (« rien avant : rien à couper »). Une diapo déjà vue par une classe : la classe garde sa copie (cadrage 1 · 8.1).
2 ter. **Le panneau du schéma** (décision 6 bis) : chaque bouton porte son infobulle ; « ⌖ Réordonner » dit ce qu'il coûte (« les places données à la main seront perdues »).
2 quater. **Déplacer une bulle** (décision 7, T6) : dans l'atelier, on tire une bulle, elle garde sa place (« ✔ enregistré ») ; les autres s'écartent autour d'elle ; au pilotage et au tableau, aucun déplacement ; l'infobulle de la bulle dit : « Tire pour la placer ; elle gardera cette place. Si tu renommes la notion, elle reprendra une place calculée. »
3. **La trame d'avant la règle.** La simulation « Les mouvements du siècle » (une consigne de quatre lignes et la carte, bloc `b-sim-schema`) reste telle quelle : c'est le cas que le site doit attraper.
   - « À régler » dit : « Schéma avec du texte : donne-lui sa diapo — clic droit sur le bloc → Couper la diapo ici ».
   - La vraie carte « Les figures de style » (8 familles) entre dans la trame simulée, sur une diapo à elle, **qu'aucun banc existant n'exerce** (n°12 · 71) : si elle ne tient pas, « À régler » propose « Couper le schéma ici », et le banc rejoue ce geste jusqu'à ce que chaque morceau tienne.
   - Après le geste, la ligne tombe : c'est le parcours rejoué par la conscience au tour 2.
4. **L'import n'existe pas dans la maquette.** Son refus (point 1 des décisions) est déclaré dans la NOTE comme « pour le mandat de production » (cadrage 4 · 3.1, 5.1 et 5.4).
5. **Infobulles** : chaque geste ajouté, modifié ou grisé porte la sienne, écrite pour Paul (ce que le geste fait, ce qu'il coûte).
6. **Bancs.** `test-p8-3-gestes.mjs`, par la souris et le clavier, couvre :
   - « Schéma… » sur une diapo pleine, puis sur une diapo à schéma ;
   - « Couper le schéma ici » sur la vraie carte, et la mesure de chaque morceau ;
   - tirer une bulle dans l'atelier, puis vérifier qu'elle garde sa place, qu'elle ne bouge pas au pilotage ni au tableau, et qu'au pilotage on ne peut pas la tirer ;
   - coller et dupliquer un schéma ;
   - la taille grisée ;
   - « À régler », puis « Couper la diapo ici ».
   Ensuite : les 24 bancs et `test-p8-2-formes.mjs` rejoués, « tout cliquer » sans erreur JS, l'audit d'affichage aux trois tailles, et le banc unique à 0.
7. **La maquette livrée** : `maquette-pilotage-ordi-v9c15p8-manipulable.html`, son gabarit, ses deux patches, son md5.

## CE QUE CHAQUE LIVRAISON DÉPOSE — `LIVRAISONS/DEROULE/p8-n/`
- **`NOTE.md`**, qui dit :
  - ce que ça change pour la classe ;
  - la base et son md5 ;
  - ce qui a été modifié, **compté** : chaque fonction touchée, avec sa taille avant et après (règle du 04/08) ;
  - les bancs, avec ce que chacun vérifie, compté ;
  - la sortie du banc unique ;
  - les captures, chacune avec ce qu'elle prouve ;
  - les défauts trouvés et corrigés, avec leur cause ;
  - ce qui est simulé ;
  - ce qui reste.
- **`bancs/`, `sorties/`, `captures/`** : les captures sont d'écran entier, et toutes ont été regardées.
- **À partir de p8-2** : le gabarit, le patch et la maquette générée.
- **Les empreintes de tous les fichiers**, contrôlées avant de pousser. Un banc écrasé par une boucle de copie est un piège déjà payé (n°12 · 51).

## LES RÈGLES, CHACUNE DÉJÀ PAYÉE
- **Les bancs**
  - Un banc passe par le geste (clic, clavier, souris), jamais par un appel de fonction, jamais par un `dialog.accept` global.
  - Un banc qui pose une sélection la pose à la souris (n°12 · 43).
  - Une preuve dit ce qu'elle contient, compté.
  - Une capture n'est livrée que regardée, pour ce qu'elle prouve.
- **Le rendu**
  - Pas de reconstruction au clic : le rendu passe par le morph. Un geste branché sur un nœud lit toujours la diapo du moment, et l'état éditable se repose à chaque rendu (n°12 · 69).
  - Toute classe CSS nouvelle est préfixée et cherchée dans le gabarit avant d'être écrite (n°12 · 40, 48 : `.temoin`, `.attente`, `.voile`).
  - Jamais de `display` en ligne sur un conteneur piloté par une classe (n°12 · 43).
  - Toute fonction que le rendu appelle passe au tableau (n°12 · 75).
- **Le code**
  - Une simulation de donnée ne se pose jamais sur une diapo que les bancs exercent (n°12 · 71).
  - Après tout remplacement de motif, on relit la fonction entière et on compare sa taille (dispositif, règle du 04/08).
- **L'écran**
  - Aucune boîte système (`alert`, `prompt`, `confirm`).
  - Aucun code ni mot de plomberie à l'écran, aucune phrase méta.
  - Les mots de Paul ; devant les élèves, « M. Meney ».
- **La NOTE**
  - Si une consigne de ce mandat est contradictoire ou impossible à mesurer, tu l'écris dans la NOTE et tu t'arrêtes. Jamais une dette cachée, jamais « je laisse ainsi ».

# p8-3 — un schéma par diapo : les gestes et leurs gardes
*Exécutant, session cloud de Claude Code, 06/10/2026. Mandat `MANDATS/MANDAT-DEROULE-MAQUETTE-P8.md` (version 3), livraison p8-3. Branche `deroule/p8-3`, partie de `deroule/p8-2`.*

## ⚠ D'abord : une consigne du mandat que je ne peux pas tenir — je le dis et je m'arrête
Le mandat (p8-3 § 3) : la vraie carte « Les figures de style » entre dans la trame ; « si elle ne tient pas, « À régler » propose « Couper le schéma ici », et **le banc rejoue ce geste jusqu'à ce que chaque morceau tienne** ».
**Mesuré : la coupe seule n'y suffit pas.** Le banc coupe la carte quatre fois, jusqu'à ce qu'il n'y ait plus rien à couper ; il reste cinq morceaux. Trois tiennent (0 · 0 · 0 · 0 · 0). **Deux morceaux d'une seule famille ne tiennent toujours pas**, et une famille ne se coupe pas :
- « Figures d'analogie » (personnification, comparaison, métaphore, allégorie) : 0 chevauchement · 0 hors du cadre · **2 traits à travers un mot** (« comparaison ») · 0 sur deux lignes · 0 sous 26 pt ;
- « Figures de substitution » (métonymie, synecdoque, périphrase, ironie) : 0 · 0 · **3 traits à travers un mot** (« synecdoque », « périphrase ») · 0 · 0.

La cause, mesurée : avec quatre notions en 26 pt, la géométrie de l'ancien moteur (la famille en haut, ses notions en éventail au-dessus d'elle) les range en deux rangées ; le trait de la famille vers une notion du haut passe derrière une notion du bas. Ce n'est ni la police (26 pt, jamais moins) ni le cadre (rien n'en sort). Le changer demanderait une autre règle de placement que celle de l'ancien moteur : hors des adaptations T1 à T7, donc interdit (décision 4 : « repris tel quel »).
**Constat, pas une preuve de « tient »** : un seul déplacement à la main (décision 7) de « comparaison » rend « Figures d'analogie » lisible (0 · 0 · 0 · 0 · 0) ; pour « Figures de substitution », un déplacement de « synecdoque » laisse encore 1 trait (il en faudrait un second). Le banc le note (`captures/MESURES-p8-3.txt`), sans le compter comme réussite.
**Donc** : `test-p8-3-gestes` finit à **1 défaut** (exactement celui-là), et le banc unique dit « ÉCHEC ». Je ne l'ai pas maquillé. Je m'arrête ici (règle du mandat : « si une consigne de ce mandat est contradictoire ou impossible […] tu l'écris dans la NOTE et tu t'arrêtes ; jamais une dette cachée »). Ce que la conscience peut porter à Paul : (a) accepter qu'une famille de quatre notions se règle par la place à la main (décision 7), (b) une règle de placement pour la carte d'une seule famille (une décision qui touche « repris tel quel »), (c) ne pas compter un trait qui passe **derrière** une bulle opaque comme « à travers un mot » (une décision sur la mesure).

## Ce que ça change pour la classe
Un schéma a toujours sa diapo : son titre, le schéma, au plus une consigne d'une ligne. En préparation, Paul ne peut plus noyer un schéma dans du texte ni en mettre deux sur une diapo : « Schéma… », « Coller ici », « Dupliquer le bloc » posent le schéma dans une diapo nouvelle, juste après ; tout ce qui ajouterait du texte à une diapo à schéma est grisé, avec la raison. Un schéma trop grand se coupe d'un clic droit sur une famille. Les bulles se placent à la main dans l'atelier, et ne bougent jamais devant la classe.

## La base et son md5
- Base : le gabarit livré en p8-2, `v9c15p8-2-template.html` (md5 `53c8d39d7bec6183d1477d83331d6e46`, celui de `EMPREINTES.md5` de p8-2), régénéré à l'identique par `regen.sh` (qui le compare octet pour octet à celui livré en p8-2 avant d'appliquer p8-3).
- **La maquette livrée** : `maquette-pilotage-ordi-v9c15p8-manipulable.html`, son gabarit `v9c15p8-template.html`, **ses deux patches** `patch-p8-2.py` (+ `p8-moteur.js`) et `patch-p8-3.py` (+ `p8-3-gestes.js`), et `regen.sh` (gabarit p7 → patch p8-2 → patch p8-3 → générateur `T159`) ; md5 : en fin de NOTE.

## Ce qui a été modifié, compté
### Les fonctions du gabarit touchées (taille avant → après, octets)
| fonction | avant | après | quoi |
|---|---|---|---|
| `choixObjet` | 1 161 | 1 279 | chaque carte de « + bloc » grisée sur une diapo à schéma dit pourquoi ; « Schéma… » : « une diapo n'a qu'un schéma » |
| `formulaireObjet` | 15 161 | 15 268 | « Schéma… » passe par `p8PoserSchema` : sur une diapo qui a du contenu, une diapo nouvelle juste après |
| `menuAtelierMur` | 4 699 | 6 748 | clic droit sur une bulle → « Couper le schéma ici » ; « Dupliquer le bloc » et « Coller ici » d'un schéma → une diapo nouvelle ; « Coller ici » d'autre chose sur une diapo à schéma grisé (sauf l'unique consigne d'une ligne) ; taille « petit » grisée pour un schéma (normal ↔ grand) |
| `alertesForme` | 7 376 | 7 977 | « Schéma avec du texte : donne-lui sa diapo — clic droit sur le bloc → Couper la diapo ici » (la trame d'avant la règle) |
| `droiteAtelier0` | 11 250 | 11 304 | le panneau du schéma |
| `rendreDroiteAtelier` | 377 | 585 | branche le panneau ; ne reconstruit pas la colonne pendant qu'on écrit dans « Contenu » |
| `brancherAtelier` | 2 631 | 2 732 | Entrée en fin de ligne ne crée pas d'élément sur une diapo à schéma (le même geste que « + étape ») |
| `poserBarreBloc` | 1 731 | 1 849 | « + étape » de la barre du bloc grisé sur une diapo à schéma |
| `tout` | 5 033 | 5 105 | les gardes de la barre de l'atelier à chaque rendu (`p8GardesBarre`) |
| style `.choix-obj` | — | — | **défaut trouvé** : la fenêtre « À régler » dépassait de l'écran (sa croix passait sous la barre du haut) avec les deux lignes nouvelles ; hauteur bornée, elle défile, sa tête reste en vue |
### Ajouté, à part (`p8-3-gestes.js`, 12 447 o, 16 fonctions, préfixe `p8`, chaque nom cherché dans le gabarit avant d'être écrit)
`p8DiapoASchema` (88) · `p8LignesConsigne` (109) · `p8ConsigneUneLigne` (88) · `p8DiapoLibre` (127) · `p8AvecTexte` (281) · `p8Suite` (75) · `p8DiapoApres` (329) · `p8PoserSchema` (687) · `p8GardeObjet` (257) · `p8GardeColler` (207) · `p8GardesBarre` (763) · `p8TeteDe` (1 566) · `p8MenuBulle` (1 231) · `p8CouperSchema` (1 597) · `p8Panneau` (1 524) · `p8BrancherPanneau` (1 123) ; constantes `P8_FORMES`, `P8_REGLES` (les règles d'écriture du panneau de l'existant), `P8_UNE`. Style : classes `p8-panneau`, `p8-rgl`, `p8-regle`, `p8-reord`, `p8-grise`.
### La donnée simulée (déclarée)
La vraie carte « Les figures de style » du chapitre 3e (8 familles, 26 notions, sans réglage : « Tout ensemble », décision 6 ter) sur **une diapo à elle**, en H2 juste avant le bilan (6 min), activité « 10 ter » — une diapo qu'aucun banc existant n'exerce (n°12 · 71).

## Les gestes, et comment je les ai lus
1. **« Schéma… » sur une diapo qui a du contenu** (autre que son titre et une consigne d'une ligne) : diapo nouvelle juste après, même heure, même activité, mêmes notions, titre « … (suite) », durée partagée ; la notice le dit ; « Schéma… » grisé sur une diapo à schéma, infobulle « une diapo n'a qu'un schéma ». **Lecture dite** : « la diapo d'origine ne change pas » et « la durée est partagée » se lisent ensemble comme dans « Couper la diapo ici » : **le contenu** de la diapo d'origine ne change pas, sa durée est partagée avec la nouvelle.
2. **Coller, dupliquer, taille, ajout** : un schéma collé ou dupliqué sur une diapo qui a du contenu part dans une diapo nouvelle ; « + bloc » (sauf l'unique consigne d'une ligne), « + étape » (barre de l'atelier et barre du bloc, et Entrée), « + image », « + fiche… », « + vidéo… », « + document… » grisés sur une diapo à schéma, avec la raison ; « petit » grisé pour un schéma.
3. **« Couper le schéma ici »** : clic droit sur une bulle de tête (famille, repère, nœud de premier niveau, étape, rangée) ; la ligne de la source et les suivantes partent dans un second schéma (même forme, même réglage, titre « … (suite) »), sur une diapo nouvelle juste après, **avec leurs places à la main** ; grisé sur une notion (« clic droit sur une bulle de tête ») et sur la première (« rien avant : rien à couper ») ; une diapo déjà vue par une classe : la notice dit que la classe garde sa copie. **Lecture dite** : « nœud de premier niveau » = la racine (profondeur 0, grisée car première) et ses enfants directs (profondeur 1). Un titre qui finit déjà par « (suite) » le garde (pas de « (suite) (suite) »).
4. **Le panneau du schéma** (repris de l'existant) : Carte mentale · Frise · Arbre · Cycle · Tableau ; « Un à un / Tout ensemble » ; « Contenu » et sa règle d'écriture sous le champ ; « ⌖ Réordonner » (« les places données à la main seront perdues ») ; changer de forme efface aussi les places (comme l'existant), l'infobulle le dit.
5. **Déplacer une bulle** : codé en p8-2 (préhension de l'ancien, T6) ; ici éprouvé par le banc, avec l'infobulle de la bulle.
6. **L'import n'existe pas dans la maquette** : son refus (« deux schémas sur une diapo, ou un schéma noyé dans du texte, sont refusés à l'import ») est **pour le mandat de production** (cadrage 4 · 3.1, 5.1 et 5.4) : la validation du JSON à l'import et le prompt d'injection.

## Les bancs, comptés
| banc | ce qu'il vérifie | `ok(` |
|---|---|---|
| **test-p8-3-gestes** (nouveau) | par la souris et le clavier, sans boîte système (une boîte serait un défaut) : « Schéma… » sur une diapo pleine (diapo nouvelle juste après : heure, activité, notions, « (suite) », durée partagée, contenu d'origine inchangé, « Un à un », la notice) ; sur une diapo à schéma (« Schéma… » grisé « une diapo n'a qu'un schéma », un clic n'ouvre rien ; « Image… » grisé ; la consigne d'une ligne permise ; « + étape », « + image », « + fiche… », « + vidéo… », « + document… » grisés avec la raison) ; sur une diapo libre, le schéma se pose sur place, puis « + bloc » est grisé ; la vraie carte : « Sur la forme » et « À régler » proposent « Couper le schéma ici », grisé sur une notion, grisé « rien avant » sur la première famille, puis rejoué jusqu'à ce qu'il n'y ait plus rien à couper (chaque coupe : diapo nouvelle juste après, même heure, même activité, « (suite) », aucune famille perdue, la notice) ; la mesure de chaque morceau, capturée ; **chaque morceau tient** (← le défaut) ; tirer « oxymore » dans l'atelier (infobulle, « modification en cours » puis « ✔ enregistré », elle suit la souris, elle garde sa place en revenant, marquée en pointillé, à sa place enregistrée dans le repère 1000 × 560) ; au pilotage et au tableau, à la même place ; au pilotage, on ne peut pas la tirer, pas de main de déplacement ; coller un schéma sur une diapo pleine et le dupliquer (diapo nouvelle, nouvelle identité) ; coller une consigne de plusieurs lignes sur une diapo à schéma grisé ; la taille (normal → grand → normal, jamais « petit ») ; « À régler » : « Schéma avec du texte… », puis « Couper la diapo ici » et les lignes tombent ; le panneau (huit boutons avec infobulle, règle d'écriture, « Réordonner » et ce qu'il coûte, « Un à un » / « Tout ensemble », écrire dans « Contenu » au clavier sans perdre le curseur, « Réordonner » efface les places, la forme et sa règle) | 54 |
| test-p8-2-formes | inchangé : les cinq formes et la vraie carte (sur des diapos insérées, libres : le schéma s'y pose) | 21 |
| test-p7-schema-envoi | **recalé (décision 1)** : chaque forme sur sa diapo insérée (plus cinq schémas sur une diapo, qui ne se font plus) ; la vérification « cinq schémas : ne tient pas lisible » devient la garde : « + bloc » grisé avec sa raison sur une diapo qui a son schéma et sa consigne d'une ligne (4 lignes changées) | 13 |
| test-p4a-p7 | **recalé (décision 1)** : le schéma ajouté sur une diapo qui a déjà du contenu part dans une diapo nouvelle juste après (vérifié), puis le banc revient sur sa diapo ; les rangs des blocs suivants -1 (6 lignes changées) | 28 |
| test-p1-p7 | **recalé (§ 3, la vraie carte en H2)** : la colonne compte 22 diapos (21), « Diapo 2 sur 13 » (12) (4 lignes changées) | 16 |
| test-p3-p7 | **recalé (§ 3)** : « l'heure 2 monte à 75 min +25 » (69, +19 : les 6 min de la vraie carte), la colonne 23 (22) (4 lignes changées) | 27 |
| les 20 autres | inchangés (dont `tout-cliquer-p7` : « tout cliquer » sans erreur JS ; `audit-affichage-p7` : trois tailles, colonnes ouvertes et repliées) | 445 |

## La sortie du banc unique
Voir « Le banc unique, résultat » en fin de NOTE.

## Les captures (toutes regardées) — `captures/`, chiffres dans `captures/MESURES-p8-3.txt`
`p8-3-morceau-1.png` à `-5.png` (+ `-zoom`) : les cinq morceaux de la vraie carte après les quatre coupes, dans l'atelier, écran entier 1536 × 864 et la diapo seule — ce qu'elles prouvent : trois morceaux tiennent ; « Figures d'analogie » et « Figures de substitution » montrent le trait qui passe derrière une notion (le défaut dit en tête). Les captures des formes (`p8-2-…`), réécrites par `test-p8-2-formes` sur la maquette p8, sont celles de p8-2 : non livrées ici (leurs chiffres sur la maquette p8 sont dans `captures/MESURES.txt`).

## Les défauts trouvés et corrigés (avec leur cause)
1. **La fenêtre « À régler » sortait de l'écran** (sa croix sous la barre du haut). Cause : `.choix-obj` n'avait pas de hauteur maximale ; avec la ligne « Schéma avec du texte » et la vraie carte, elle passait la hauteur de l'écran. Corrigé (elle défile, sa tête reste en vue).
2. **« (suite) (suite) »** sur un morceau coupé deux fois. Cause : le suffixe ajouté à chaque coupe. Corrigé (`p8Suite`).
3. **Coller une consigne de plusieurs lignes sur une diapo à schéma était permis.** Cause : la garde regardait le type du bloc, pas ses lignes. Corrigé (`p8GardeColler`).
4. Dans mon banc : il gardait le rang d'une diapo qui change après un collage (le rang n'est pas une identité) ; il navigue maintenant par identifiant. Il cliquait « + bloc » grisé : il vérifie la garde au lieu de cliquer.

## Vu en passant, hors de ce mandat (non corrigé)
« À régler » de la p7 liste chaque diapo « Cahier de textes » comme « Objet non lisible « cahier » » (le type `cahier` manque à la liste des types connus d'`alertesForme`) : déjà dans la p7, pas touché ici.

## Ce qui reste
- **La consigne non tenue** (en tête) : à trancher par Paul, via la conscience.
- L'import et son refus : mandat de production.

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt` (2026-10-06 07:49 UTC, node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37, maquette md5 `369d1388aa3e95b3ee058595336a46d9`), 26 bancs :
- 25 bancs à **0 défaut** ;
- `test-p8-3-gestes` : **1 défaut** — « Figures d'analogie » (2 traits à travers « comparaison ») et « Figures de substitution » (3 traits : « synecdoque », « périphrase » ×2) ne tiennent pas lisibles après quatre coupes, une seule famille chacun : plus rien à couper. C'est la consigne non tenue dite en tête.
- Dernière ligne : **ÉCHEC**. Je m'arrête là, comme le mandat le demande.

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `369d1388aa3e95b3ee058595336a46d9`
- gabarit `v9c15p8-template.html` : `37a1ab5daaf33d1adf3c334055e47451`
- base (gabarit p8-2) : `53c8d39d7bec6183d1477d83331d6e46`
- tous les fichiers livrés : `EMPREINTES.md5` (vérifié par `md5sum -c` avant l'envoi).

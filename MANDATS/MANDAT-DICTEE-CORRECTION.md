TITRE DE CETTE CONVERSATION : « MJPC 6 — DICTÉE — l'écran de correction ». Nomme cette conversation exactement ainsi.

# MANDAT — « L'ÉCRAN DE CORRECTION » — **ENTIÈREMENT LIVRÉ ET PROMU le 02/10 (L1 → L8, L4 à blanc, micro L6b ; production 6.7.0-L8, 755 719 o, md5 `a6c0ce567fc92617be2ce0f6d613fff7`). Les livraisons L9 (identité et date de correction des copies), L10 (capitalisation des formes fautives), L11 (erreur sans coût) s'écriront à la suite, sur les réponses de Paul (C12, tours 359-360).** de `correction_dictee.html` : jamais de perte, ⇧R bascule, M qui s'adapte, le mot juste bloqué, la ponctuation en trop au forfait, la recherche et le curseur au clavier, la largeur

*Conscience n°12, 01/10/2026, à partir du mandat de la conscience « dictée » (01/10, B1 / B1 bis / B2 / N1 / N2) et du cadrage fait avec Paul dans la conversation C12 (tours 337 à 342 : N3 à N6, le reclassement). Tu es l'exécutant : tu lis avant d'écrire, tu mesures avant d'affirmer, tu demandes quand tu ne sais pas — tu ne devines jamais. Ce mandat se joue en HUIT livraisons courtes (L1 → L8), chacune poussée au sas et close par un arrêt ; Paul relance par « continuer ».*

## CE QUE ÇA CHANGE POUR LA CLASSE (les mots de Paul, 01/10)

Paul corrige les copies de ses quatre classes dans l'écran de correction, en mode texte (clic sur un mot) ou en mode rapide (clavier), sur un écran Windows. « Une erreur que j'ai marquée ne doit jamais disparaître sans que je l'aie décidé » ; « l'enregistrement doit être instantané. Et toujours pareil, je dois reprendre exactement où j'en étais quand je rouvre la correction d'une copie » ; « quand la correction détecte que le mot que je tape est le même que le bon mot, elle doit me bloquer : j'ai tendance à écrire le bon mot (déformation professionnelle) alors que je dois recopier le mot mal écrit de l'élève » ; « quand je fais M manquant sur quelque chose, ça doit s'adapter en fonction de si c'est un mot, une ponctuation ou une élision » — « ce qui permet que le mode rapide soit vraiment rapide » ; « des élèves mettent parfois de la ponctuation en trop ; dès que l'app détecte que je mets une ponctuation en "en plus", elle la bascule dans le forfait ponctuation, ça évite de pénaliser un élève pour un tiret en trop » ; en mode classique, « un genre de Ctrl F permanent : quand je tape les premières lettres d'un mot, celui-ci s'affiche en clignotant puis s'ouvre » et « un mode de mot clignotant, et je dis bien mot (on saute volontairement les ponctuations), où je fais avancer ou reculer le clignotant avec les flèches gauche droite et surtout haut et bas, et je fais Entrée pour ouvrir le mot » ; « le but est toujours le même : augmenter au max le ratio temps passé / précision de la correction / rentabilité du flux » ; et l'écran doit utiliser la largeur de son écran sans que rien ne déborde.

## BASE

- `correction_dictee.html` de `siteflow-io/monsieurjaipascompris` (production, LECTURE SEULE pour toi) : **6.6.3**, **737 047 o**, md5 `be6e2481d8b6f850c7eb88b5f72c4ac5`, blob `bf774b4f297d` (promue le 01/10 à 13 h 19). Elle contient tout le chantier « dictée » (lots 1 à 3, gardes de la corbeille, correctifs du 29/09) ET le travail ELEVE-1 (aménagements par la fiche, ligne PAP, chaque copie garde sa base avec sa trace `{amenagee, mode, base}`, duplication complète, classes par niveau, élèves de test ZZTEST, l'écran « Terminé ! » sans le bloc « Barème »).
- **AVANT toute édition de chaque livraison** : re-télécharge la base, vérifie le md5 À LA COMMANDE (`md5sum`). S'il diffère : **STOP**, signale, n'édite pas.
- Versions livrées : **6.7.0-L1 … 6.7.0-L8** (`APP_VERSION`), la dernière = 6.7.0.
- Le mandat de la conscience « dictée » (B1, B1 bis, B2, N1, N2) est repris ici tel quel, avec ses causes mesurées ; ce qui s'y ajoute vient du cadrage C12.

## INTERDITS

- MJPC-CORE (`mjpc-core.js` et le socle embarqué) : INTOUCHABLE. Aucun reformatage global, aucune regex large : chaque édition est CIBLÉE ; pour toute fonction modifiée, sa taille avant / après.
- Rien du chantier ne doit être retiré : tablette en deux moitiés, clavier dessiné, heure lancée, suivi par étapes, vue en direct, stylo vert, questions, phrase à recopier, corbeille et restauration des copies effacées, alerte « copies manquantes », comparaison des réponses avec accents, textes de fin, coûts selon le barème, règle « mots recopiés » limitée à G et L (point 322), aménagements ELEVE-1 (la trace et la base de la copie passent par `save`, `traceCopie`, `baseDeCopie` : tu les appelles, tu ne les réécris pas).
- **Les écrans des élèves ne bougent pas** (téléphone, moitiés de tablette) : ils partagent `.container` (760 px) — tu ne touches pas à `.container` ; la largeur du professeur se règle par une classe propre à ses écrans.
- Aucun nom d'élève réel nulle part (le kit du sas est anonymisé ; tu n'en remets jamais) ; rien de payant ; le principe cardinal (aucun texte ne met le professeur en cause) ; textes vus par les élèves : aucun terme technique ; chaque geste ajouté ou modifié porte son infobulle, écrite pour Paul.
- Tu n'anticipes rien : « d'autres améliorations viendront plus tard ».

## CE QUE TU LIS AVANT D'ÉCRIRE UNE LIGNE

`docs/MJPC6-1-DISPOSITIF.md` (règles gravées, point 16, principe cardinal), `docs/MJPC6-2-DOCTRINE.md`, `docs/MJPC6-DETTES.md` (section n°12), `PASSATION-C9-C10-fautes.md` (sas : les huit mécanismes de dérive), `DEROULE/CADRAGE-6-L-ELEVE.md` § 3.4 quinquies (la dictée et l'aménagement), `TRANSCRIPTS/C12/TRANSCRIPT-C12.md` tours 337 → 342 (les mots de Paul, verbatim), `LIVRAISONS/ELEVE-1/4/NOTE.md` et `LIVRAISONS/MICRO-fin-rapide/NOTE.md` (ce qui vient d'être fait dans ce fichier) ; et dans le code, mesuré : `CorrEleve` (le mode rapide v2 : `fastMark`, `fastIdx`, `confirmFautifI`, `onAutoSave`), l'ancien écran (`markError`, `onKey`, `submitFautif`), le mode texte (`selectType`, `confirmFautifTexte`, `confirmInsert`, `popupIdx`, `lastTouched`), `save` (l. ~2424) et les cinq écritures qui posent une copie, `computeNote` / `TYPE_COST` / `TYPE_COST_BREVET` (P au forfait en brevet : `Math.floor(nP/4)*0.5*(base/10)` ; X à 0,5), `isPunct`, `estApostrophe`, le bouton « M→P » (la boucle `hasConv` : M sur un signe hors apostrophe → P), le raccourci ⇧R (`setTab("rapide")`), `.container` (760 px) et les deux `maxWidth:480`, le champ de recherche par initiales de la grille.

## LE KIT DE BANCS — AU SAS : `KITS/banc_dictee_kit_anonyme.zip` (2 266 923 o, md5 `d39fc51df522b9fd2295ba9151851c72`), la version anonymisée par la conscience du kit remis par Paul (ses 125 noms d'élèves remplacés par des noms impossibles, initiales conservées ; voir son `LISEZMOI.md`) — tu le télécharges au sas avec le jeton, tu vérifies son md5

Mode d'emploi : `LISEZMOI.md`. Faux hub (`bench/fakefb.js`), aucun accès au vrai hub, aucun code d'élève dans l'instantané. **Avant de coder**, rejoue sur la 6.6.3 et compare : `python3 scenarios_modes.py` (S1 et S3 montrent la perte, S2 correct — la conscience n°12 l'a rejoué le 01/10 : confirmé) ; `NB=5 GRAINE=1 python3 fuzz_correction.py`, `NB=4 GRAINE=2 …`, `NB=3 GRAINE=2 python3 fuzz_rapide.py`, `python3 scenarios_grille.py` → 0 bug. Tes nouveaux bancs s'ajoutent au kit ; **un banc unique rejoue tout le kit** et échoue si un seul échoue ; chaque livraison le rend vert.

## LES LIVRAISONS

### L1 — B2 : jamais de perte, l'enregistrement est instantané, la position reprise (décision de Paul, 01/10 : « automatique ») — et, dans la même livraison, la dette n°12 · 94 : un commentaire du code (« Garde du 29/09 (copie de … effacée sans trace) ») porte le nom d'un élève réel — tu le reformules sans nom (« une copie effacée sans trace »), et tu vérifies qu'aucun autre nom réel n'est dans le fichier
- Le mode texte **enregistre à chaque geste** (un type posé, un mot de l'élève saisi, un mot en trop posé ou retiré, une erreur retirée, un type changé), par le même enregistrement que le mode rapide (`save`, qui garde la trace et la base de la copie — ④). « Enregistrer (…) → suivant » ne fait plus que passer à l'élève suivant, avec son contrôle « mots recopiés » (point 322) inchangé.
- **La position est enregistrée avec la copie** (le dernier mot touché / le curseur, comme `fastIdx` l'est pour le mode rapide) et **la réouverture reprend exactement là** : le même mot clignote, la page est défilée dessus.
- Toutes les sorties sont couvertes : « ← » vers la grille, « ← Retour », changement d'onglet, rechargement, fermeture — rien n'est perdu, aucune fenêtre ne demande rien.
- Bancs : `scenarios_modes.py` S1 sans perte ; un banc par le geste : 2 erreurs, retour, réouverture : les 2 erreurs et le curseur ; rechargement de la page ; `fuzz_correction` (2 graines) à 0 bug ; vue élève inchangée. Captures avant / après. Arrêt.

### L2 — B1 et B1 bis : ⇧R est une bascule, sans perte
- ⇧R fait passer du mode texte au mode rapide ET du mode rapide au mode texte, **sur la même copie**, sans rien perdre dans un sens comme dans l'autre (avec L1, ce qui est à l'écran est déjà au hub : la bascule relit la copie). Inactif quand le curseur est dans un champ de saisie. Les boutons « ← Texte » / « ⚡ Rapide » mentionnent ⇧R dans leur infobulle.
- Bancs : S3 sans perte ; aller-retour ⇧R × 3 par le geste ; `fuzz_rapide` à 0 bug. Captures. Arrêt.

### L3 — N4 et N3 : la touche M s'adapte, le clavier du mode rapide est réduit, le mot juste est bloqué
- **M s'adapte** (mode rapide et ancien écran) : sur un mot → Manquant ; sur un signe de ponctuation (`isPunct`, hors apostrophe) → Ponctuation ; sur une apostrophe (`estApostrophe`) → Élision. **Les touches P et E sont retirées** ; **les boutons restent** : quand le mot courant est un signe, le bouton « Ponctuation » est pré-sélectionné (mis en avant) et **Entrée le valide** ; une apostrophe → « Élision » pré-sélectionné, Entrée. Sur un mot ordinaire, rien n'est pré-sélectionné. Le clavier du mode rapide est donc : G, L, M (adaptée), I, A, Espace (correct), Retour (précédent), Entrée (valide le bouton pré-sélectionné), ⇧R. La ligne d'aide sous les boutons le dit.
- **La garde du mot juste** (N3) : dans les trois champs « ce qu'a écrit l'élève » (mode rapide `confirmFautifI`, ancien écran `submitFautif`, mode texte `confirmFautifTexte`), si la saisie, comparée au mot attendu sans la casse, **est le mot juste**, le champ refuse — « c'est le mot juste : recopie ce que l'élève a écrit » — et reste ouvert ; tout autre contenu passe (c'est ce que l'élève a écrit) ; vide reste permis (le trou numéroté existant).
- Bancs par le geste : M sur un mot / un signe / une apostrophe dans les deux écrans ; P et E ne font plus rien ; Entrée sur un signe valide « Ponctuation » ; la garde dans les trois champs (le mot juste refusé, « Le » = « le » refusé, un autre mot accepté, vide accepté). Captures. Arrêt.

### L4 — Le reclassement, À BLANC (rien n'est écrit)
- Deux reclassements et rien d'autre : (1) une erreur « M » posée sur un signe de ponctuation (hors apostrophe) → « P » (ce que faisait le bouton « M→P ») ; (2) un « mot en trop » (`extras`) qui est un signe de ponctuation (hors apostrophe) → **au forfait ponctuation** : il quitte `extras` et devient une erreur « P » rattachée au signe (ou à la position d'insertion, tu mesures la forme que `errors` permet et tu la dis), comptée comme toute ponctuation (forfait en brevet, coût P en préparée) ; la note recalculée par `computeNote` sur la base de la copie, la trace conservée.
- **Cette livraison ne produit qu'un rapport** : sur l'instantané du kit ET sur un relevé du vrai hub (lecture seule), copie par copie — dictée, clé de l'élève (jamais son nom), erreurs reclassées, note avant → après — et la liste de toutes les autres copies, **prouvées identiques octet pour octet**. Mesuré par la conscience le 01/10 : M sur un signe → 0 chez les Dylan, 0 brevet blanc 3E, 3 Banksy, 2 Pythagore ; signes « en trop » → 4 chez les Dylan (3 copies), 14 brevet blanc 3E, 4 Banksy, 1 Pythagore. Ton rapport doit retrouver ces nombres ou dire pourquoi il diffère. **Paul lit le rapport et dit « ok » avant L5.** Arrêt.

### L5 — Le reclassement réel, la ponctuation en trop automatique, le bouton « M→P » retiré
- À l'ouverture d'une dictée (professeur), la reprise de L4 s'applique **une fois** aux copies qui portent encore l'un des deux cas, après une **archive en corbeille** des copies avant reclassement (restaurable, motif `reclassement-ponctuation`), et affiche une ligne « n copies reclassées (ponctuation) » ; les copies sans ces cas ne sont pas touchées (le banc le prouve octet pour octet).
- Désormais, **un « en plus » qui est un signe de ponctuation va automatiquement au forfait ponctuation** à la saisie (mode texte « + », et partout où un mot en trop se pose) : Paul n'a plus à dire que c'est de la ponctuation. L'apostrophe reste une élision.
- Le bouton « M→P » de l'en-tête disparaît (son cas ne peut plus se produire par aucun geste : M s'adapte, le menu au clic l'était déjà, et la reprise a tout rattrapé).
- Bancs : la reprise sur le kit (copies touchées : exactement celles du rapport ; les autres identiques) ; un signe « + » posé → P au forfait ; vue élève inchangée (sa note suit). Captures. Arrêt.

### L6 — N1 : la recherche par initiales en fin de copie, en mode rapide
- Quand une copie est finie en mode rapide (« ✅ … enregistré » / « Terminer → »), le champ de recherche par initiales de la grille (« DA » pour DURAND Alice) est proposé aussitôt, le curseur dedans ; les lettres tapées dedans ne déclenchent jamais les raccourcis du mode rapide ; Entrée ouvre le premier élève proposé **directement en mode rapide**, sans repasser par la grille ; absents et copies déjà corrigées signalés comme dans la grille.
- Bancs par le geste. Captures. Arrêt.

### L7 — N2 : la largeur (décision de Paul, 01/10 : la troisième proposition, **1100 px**)
- Les écrans de correction du professeur (mode texte ET mode rapide) prennent **1100 px** sur un écran Windows (une classe propre, pas `.container`) ; à 1366 et à 1920 px de large, aucun bouton ne dépasse de son cadre (mesuré aujourd'hui : « ← Texte » dépasse de 68 px dans la colonne de 480).
- **Le mode rapide affiche plus de la phrase** autour du mot courant (Paul : « affiche plus de contenu de phrase ») : la ligne de contexte montre la phrase entière bornée par les ponctuations fortes (. ! ? …), le mot courant en gras, tronquée aux bords si elle dépasse la ligne.
- Les écrans élèves (téléphone, moitiés de tablette) : prouvés inchangés (captures avant / après identiques).
- Bancs : mesures de largeur à 1366 et 1920 px (aucun débordement, par la géométrie) ; les captures de la conscience (planches 760 / 1000 / 1100 / 1300 du 01/10) sont la référence visuelle de « 1100 ». Captures. Arrêt.

### L8 — N5 et N6 : la recherche permanente et le curseur au clavier, en mode texte
- **La recherche permanente** (menu fermé, aucun champ de saisie ouvert) : les lettres tapées (minuscules ; une lettre avec Maj est ignorée, ⇧R reste la bascule) cherchent **les mots du texte qui commencent par ces lettres** (casse ignorée, accents tels que tapés) ; ils **clignotent** ; une bande discrète sous le texte montre **les mots candidats eux-mêmes**, qui disparaissent à mesure que la frappe précise ; **un seul mot restant → il s'ouvre** (son menu de types) ; plusieurs → les quatre flèches passent d'un candidat à l'autre (← → dans l'ordre du texte, ↑ ↓ celui de la ligne du dessus / du dessous), en partant du dernier mot corrigé ; Entrée ouvre le candidat courant ; Échap efface la recherche.
- **Le curseur** (aucune recherche en cours) : le dernier mot corrigé clignote et devient le curseur ; ← → le mot précédent / suivant **en sautant la ponctuation** ; ↑ ↓ la ligne du dessus / du dessous, le mot le plus proche à la verticale (mesuré sur la position réelle des mots à l'écran) ; Entrée ouvre le mot ; la page suit le mot (il reste visible) ; la position est celle enregistrée par L1. Les ponctuations restent au clic.
- **Menu ouvert** (par Entrée ou par clic) : **G, L, M (adaptée : mot / signe / apostrophe), I, A choisissent le type au clavier** ; G et L ouvrent le champ « ce qu'a écrit l'élève » avec la garde du mot juste (L3) ; Entrée valide, Échap annule ; **Ctrl+Z annule la dernière erreur posée** (et son enregistrement).
- Télescopages réglés par construction : les lettres ne vivent que menu fermé, les touches de type que menu ouvert ; un champ de saisie ouvert garde tout le clavier ; les flèches ne font plus défiler la page quand le curseur est actif ; rien ne touche les écrans élèves.
- Bancs par le geste : la recherche (un mot unique s'ouvre ; des doublons « le » : clignotent, flèches, Entrée) ; le curseur (← → sautent la ponctuation ; ↑ ↓ changent de ligne, vérifié par la géométrie) ; menu ouvert, les types au clavier ; Ctrl+Z ; aucune collision avec ⇧R ni avec un champ ouvert ; vue élève inchangée. Captures. Arrêt.



> **AJOUT DU 02/10 (après L7) : L7 a été promue sous la forme L7b = L7 + L6b (la conscience l'a rebasée) ; la base de L8 est la 6.7.0-L7b en ligne (748 284 o, md5 `65d6bd9fdb1f72e73a254c450007bcb5`), vérifiée à la commande.**

> **AJOUT DU 02/10 (après L6) — dette n°12 · 98, réglée par la conscience en micro L6b** : en mode rapide, **Entrée = correct, mot suivant, partout, même sur un signe** (comme avant L3) ; le bouton mis en avant dit « (M) » et **M le valide**. L3 avait fait d'Entrée la touche de validation : chaque signe traversé par Entrée devenait une P (Paul : « gros télescopage »). À ta prochaine livraison : ta base est la **6.7.0-L6b** promue (md5 à la commande), tu accordes `banc_L3_geste.py` (« Entrée sur un signe → P » devient « Entrée avance, M → P ») et tu gardes `fuzz_rapide.py` tel qu'accordé en L6b.

## LES RÈGLES DE CE MANDAT

- Une livraison = un lot poussé au sas (`LIVRAISONS/DICTEE-CORRECTION/<Ln>/` : le fichier, les nouveaux bancs, la sortie du banc unique, les captures, `NOTE.md`), puis un arrêt. Jamais de livraison avec dette ; une dette rencontrée se règle dans la même livraison, inscrite au registre (section n°12, « réglée au sas »).
- Le banc passe par le GESTE (clic, clavier), jamais par l'appel d'une fonction ; une preuve dit ce qu'elle contient (compté, cité). Mode test : le faux hub du kit ; données ZZTEST.
- Captures : écran entier, avant / après du même parcours par clics, regardées par toi, livrées dans la conversation. **Le promeus ne se déduit jamais** : la conscience audite, Paul dit « promeus », la conscience pousse en production (pas toi, pas Paul).
- `node --check` et `acorn` sur le script extrait : 0 erreur ; la page ouverte dans Chrome sans erreur JS ; taille avant / après ; relevé de collisions avant tout ajout.
- Si tu ne sais pas répondre « à quoi ça sert en classe ? » sans deviner, tu demandes, en une question précise, et tu attends. Termine chaque réponse par le mot MEMO, seul sur sa ligne.

## LES DÉPÔTS ET LES JETONS

- Le sas : `siteflow-io/mjpc-chantier`, branche `main` — `PUT /repos/siteflow-io/mjpc-chantier/contents/<chemin>` (base64, `sha` pour une mise à jour), jeton SAS : `__JETON_SAS__`. Chaque dépôt vérifié bit à bit.
- La production : `siteflow-io/monsieurjaipascompris`, branche `main` — lecture des sources ; jeton PROD : `__JETON_PROD__` ; tu y écris **seulement** `docs/MJPC6-DETTES.md` (section n°12) ; jamais `correction_dictee.html` : c'est le geste de la conscience sur le « promeus » de Paul.
- Le hub : `https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app` — lecture seule, pour L4 (le relevé) ; il se lit sans clé : ne mets jamais dans un rapport ce que tu y lis de nominatif.
- Les jetons ne vont dans aucun fichier déposé, aucune capture, aucune note.

## CE QUE CE MANDAT NE FAIT PAS

Les écrans élèves ; le panneau prof du site (③ bis, à part) ; toute autre app ; « d'autres améliorations viendront plus tard : ne rien anticiper ».

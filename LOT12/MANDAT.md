# MANDAT LOT ⑫ — NETTOYAGE DIAPORAMA
*Conscience n°7, 20/08/2026. Exécutant : une conversation dédiée à ce seul lot.*

## CONTEXTE (deux phrases)
Le 19/08, Paul a tranché : le site remplace le diaporama en classe — « je n'aurai plus jamais besoin de quoi que ce soit pour héberger un diaporama ». Le mode déroulé (maquette validée) prendra la place ; ce lot retire la machinerie diaporama de `index.html`, proprement et de façon prouvée.

## BASE
- Dépôt de travail : `siteflow-io/mjpc-chantier` (sas), dossier `LOT12/`.
- Base : `index.html` de `siteflow-io/monsieurjaipascompris` (production, LECTURE SEULE pour toi), version **8.56.2**, 1 001 473 o, md5 `660956e0dc121c9d8e0a84c9ad98e690`.
- **AVANT toute édition** : re-télécharge la base, vérifie le md5 À LA COMMANDE. S'il diffère : STOP, signale, n'édite pas.
- Version livrée : **8.57.0** (constante de version + affichages).

## INTERDITS
- MJPC-CORE (socle embarqué 1.1.0) : INTOUCHABLE.
- Aucun reformatage global, aucune regex large : chaque retrait est CIBLÉ, bloc par bloc. Leçon gravée : une regex a déjà emporté des déclarations voisines — pour toute fonction que tu modifies (sans la supprimer), donne sa taille avant/après.
- Rien d'autre que le périmètre ci-dessous. Le hub n'est pas touché par ce lot (la corbeille et la destruction du nœud `/site/diaporamas` sont un geste de conscience, APRÈS promotion).

## ÉTAPE 0 — EXTRACTION DES MATÉRIAUX (avant tout retrait)
Crée `LOT12/MATERIAUX-DIAPO.md` au sas contenant, copiés VERBATIM depuis la base :
1. `DIAPO_FORME_INTERDITE` (L≈9097 : 17 clés `style, couleur, color, police, font, taille, size, classe, class, align, alignement, css, html, background, fond, gras, italique`) ET le bloc de contrôle qui l'applique (L≈9116). C'est la loi « la forme est interdite à l'IA » (l'IA dit ce que c'est, le site décide comment ça se voit) — elle resservira aux prompts du déroulé.
2. La pagination de l'atelier papier (le découpage en pages des feuilles) — localise-la dans les fonctions diapo* ou adjacentes, copie-la intégralement avec ses numéros de lignes. Elle sera portée en 16:9 au déroulé.
Ce fichier est un CONSERVATOIRE : rien ne se perd, tout se retire.

## ÉTAPE 1 — RETRAITS (liste fermée)
1. **Les 20 fonctions** (21 697 o de définitions mesurés le 20/08) : `diapoCles, diapoDeposerImage, diapoEcrire, diapoEnregistrer, diapoIdPropose, diapoImagePoser, diapoInfo, diapoLierModal, diapoMarquer, diapoOuvrir, diapoRelecture, diapoRendre, diapoRendreBloc, diapoRendreEcran, diapoStatutLiaison, diapoTexteBrut, diapoToutRelu, diapoValider, diapoVerifier, diapoVocabulaireBlocs` + `openDiaporamaById` (L≈9361).
2. **Les tables et caches** : `DIAPO_BLOCS` (6 occ.), `DIAPO_FORME_INTERDITE` (2 occ. — APRÈS extraction étape 0), `AT_DIAPOS` + `AT_DIAPOS_ETAT` et leur machinerie de chargement (36 occ., déf. L≈13100).
3. **Les branches appelantes** (4) : L≈3651 (arborescence `kind==='diaporama'`), L≈11328 (fil), L≈11832, L≈13152 (bouton « Ouvrir » de l'atelier). Règle pour les items `kind==='diaporama'` existants dans les données : ils RESTENT VISIBLES (données historiques, on ne touche pas aux chapitres), mais sans action d'ouverture — l'item s'affiche, le bouton/branche disparaît. Aucun message d'erreur, aucun placeholder : silence sobre.
4. **L'UI** : la porte « Nouveau diaporama à convertir » (3 occ. « Nouveau diaporama »), l'écran « Mes diaporamas » (1 occ.), le lecteur, les chaînes résiduelles.
5. Le commentaire L≈11790 qui mentionne `openDiaporamaById`.

## ÉTAPE 2 — PREUVES (toutes exigées dans ta livraison)
1. **Inatteignabilité par retrait** : `grep -c` = 0 pour CHAQUE nom de la liste (les 20 + openDiaporamaById + DIAPO_BLOCS + DIAPO_FORME_INTERDITE + AT_DIAPOS + « Mes diaporamas » + « Nouveau diaporama ») sur le fichier livré. Tableau nom → 0.
2. **Mesure avant/après** : taille de la base (1 001 473 o) → taille livrée, delta chiffré et expliqué (définitions + branches + UI + chaînes).
3. **Dual parser** : `node --check` ET acorn ES2020 sur le JS extrait — les deux verts, sorties collées.
4. **Banc navigateur** (harnais lecture seule, dialogues refusés, réseau bloqué — outillage disponible : `DEROULE/tests/harnais.js` à adapter) : boot sans erreur console · ouverture d'un chapitre avec item `kind==='diaporama'` : l'item visible, aucune action, AUCUNE erreur · l'atelier s'ouvre · l'arborescence s'ouvre. Captures d'office.
5. **Aucune fonction voisine modifiée** : pour tout bloc adjacent que tu as dû toucher (virgules, tableaux d'onglets…), taille avant/après.

## LIVRAISON
- `LOT12/index.html` (8.57.0) + `LOT12/MATERIAUX-DIAPO.md` + `LOT12/RAPPORT.md` (mesures, preuves, captures listées).
- Ta base re-téléchargée est la SEULE source : n'édite jamais de mémoire, jamais un état antérieur du sas.
- Termine chaque réponse par le mot MEMO, seul sur sa ligne.
- **Aucune promotion** : le lot attend l'audit de la conscience puis le « promeus » de Paul. Point de retour (blob de la 8.56.2) noté par la conscience avant toute promotion.

## CE QUE CE LOT NE FAIT PAS
Pas d'intégration du déroulé (lots suivants) · pas d'impression Papier · pas de toucher au hub · pas de retrait des DONNÉES de chapitres (les items diaporama restent en données) · pas de renommage des collisions du déroulé (relevé à refaire au moment de l'intégration).

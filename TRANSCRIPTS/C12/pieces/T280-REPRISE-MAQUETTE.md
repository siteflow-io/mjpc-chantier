# REPRISE DE LA MAQUETTE DE LA PRÉPARATION — kit de passation (conscience n°12, 30/09/2026)

*Pour une conscience qui reprend après une amnésie ou une bifurcation. Tout est dans le sas `mjpc-chantier` ; rien n'est dans la conversation qui ne soit ici.*

## 1. Où en est le chantier (30/09, tour 279)
- La maquette de la préparation est **complète** : (p1) l'atelier, (p2) écrire dans la diapo, (p3) le clic droit, (p4a/p4b) les objets et leurs gardes, la vidéo, la page pilotée, le document, (p5) l'activité comme objet, (p6) « Jouer en avance — répétition », les alertes, la colonne sobre, (p7) les cinq formes du schéma sur le format existant, l'écran d'envoi. Registre des dettes n°12 · 68 → 75 (`docs/MJPC6-DETTES.md` sur le dépôt de production).
- **Dernière maquette figée** : `TRANSCRIPTS/C12/pieces/T265-maquette-pilotage-ordi-v9c15p7-manipulable.html` (md5 5045f337d930). Son gabarit : `T265-v9c15p7-template.html` ; son patch : `T265-patch-p7.py` (appliqué sur le gabarit p6, lui-même `T260-v9c15p6-template.html`, etc. : chaque `Txxx-patch-pN.py` s'applique sur le gabarit `p(N-1)`).
- **Proposé, non codé** : (p8) — un schéma = sa diapo ; les libellés du schéma en texte de la diapo (police de la diapo, jamais sous le plancher), les formes derrière ; « trop dense » mesuré ; les plafonds par forme (tours 266-267, captures `T266-…`, `T267-…`). Paul n'a pas encore dit son mot sur les plafonds.
- **Bifurcation ouverte** (tours 268-279) : le cadrage 6 « L'ÉLÈVE » (`DEROULE/CADRAGE-6-L-ELEVE.md`) — profil, import du fichier de classe, adaptations PAP, anniversaires ; le cadrage 7 « LA TABLETTE » attend le HTML du panneau d'aide de Paul.
- **Reste du cahier des charges** : les tests de Paul des livraisons (b3) → (p7) ; (p8) sur son mot ; la séquence de test du mandat ; le mandat en livraisons courtes + attendus hub ; l'exécutant.

## 2. Comment régénérer et rejouer
- `T159-gen-par-difference.py` génère la maquette « courante » à partir d'un gabarit : `python3 gen-par-difference.py <gabarit> <sortie>` ; il reprend `DATA` dans `maquette-v9c13-courante.html` (déposée avec ce kit : `T280-maquette-v9c13-courante.html`). Les simulations de données (remob, feuilles, fiches liées, objet inconnu, schéma) sont dans les patches, pas dans DATA.
- `T280-err.mjs` : ouvre une maquette et imprime les erreurs JS (`node err.mjs <fichier>`).
- Les bancs : `T265-tous-les-bancs-p7.sh` liste les 24 bancs ; **à jouer par tranches de 4 à 6 bancs par commande** (les processus de fond meurent entre deux tours) ; chaque banc écrit `--- fin : n défaut(s)`. Playwright est installé sous `/home/claude/.npm-global/node_modules/playwright/index.mjs` avec Chrome `/opt/google/chrome/chrome` — à réinstaller si l'environnement est neuf (`npm install -g playwright` puis `npx playwright install chrome`, ou Chrome du système).
- Règles apprises (au registre) : le rendu passe par le morph — un geste branché sur un nœud lit toujours la diapo du moment ; l'état éditable se repose à chaque rendu ; la fenêtre du tableau reçoit une liste fermée de fonctions (`fns`) et une copie de la trame — le pilotage lui envoie la diapo avec chaque état ; une simulation de donnée ne se pose jamais sur une diapo que les bancs exercent ; les alertes de forme ne prennent pas la place du contenu (bandelette).

## 3. Le protocole
- `PROTOCOLE-MAQUETTE.md` (racine du dépôt de production) et `TRANSCRIPTS/C12/pieces/T111-PROTOCOLE-MAQUETTE.md`.
- Le transcript mot pour mot : `TRANSCRIPTS/C12/TRANSCRIPT-C12.md` (tours 104 → 279), mis à jour à chaque tour, vérifié bit à bit.

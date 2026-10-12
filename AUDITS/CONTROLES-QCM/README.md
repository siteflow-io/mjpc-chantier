# Les contrôles de la conscience n°12 — maquette complète du QCM

*Écrits le 12/10/2026 (tour 663), selon le protocole de l'audit validé par Paul à 11:28 : https://github.com/siteflow-io/mjpc-chantier/blob/main/PROTOCOLE-AUDIT-12-10.md*

## Ce qu'il y a ici

1. **`controles.js`** — ce qui doit être vrai, par le geste, avec des valeurs attendues qui ne viennent pas de la version contrôlée :
   - C1 à C9 : les neuf défauts de la v8 (complément 4, corrections 1 à 8 et 1.5) ;
   - C10 : l'heure de classe jouée geste par geste, de « 🚀 Lancer la séance » au tableau des copies rendues, 19 pas, la même à chaque audit.
   `node controles.js <maquette-qcm-vN.html> [sortie.txt]` ; code de sortie 1 si un seul contrôle échoue. Durée mesurée : 1 min 20 s.
2. **`attendus/`** — les valeurs attendues, figées une fois par `figer-attendus.js` : les notes de chaque séance (tableaux de la v8 auditée ; pour la séance sur papier, sa grille, `c-papier-grille`), le texte du PDF de la séance de 3e validé par Paul (points 602 à 643), et les 19 pas de l'heure de classe (`heure.json`).
3. **`releve.js`** et **`compare.py`** — le relevé de chaque écran d'une version (texte, cadres compris ; capture ; destinations des gestes), scènes et écrans à paramètres, puis la comparaison de deux relevés : les écrans changés, ceux qui devaient changer et n'ont pas bougé, et leurs voisins. Durée mesurée : 8 min 30 s pour deux relevés à la fois, 11 s pour la comparaison ; un second relevé de 27 écrans de la v8 est identique au premier (le relevé est stable).
4. **`EMPREINTES.md5`** — les md5 de ces fichiers : un audit commence par les vérifier.

## Éprouvés sur la v8 (`sorties/controles-sur-v8.txt`)

Sur la v8, les contrôles trouvent les neuf défauts, et l'heure de classe passe : 112 vérifications, 29 échecs, tous dans C1 à C9.

## L'audit de la v9, dans l'ordre

1. vérifier `EMPREINTES.md5` ;
2. `node controles.js maquette-qcm-v9.html` : zéro échec attendu ;
3. relever la v8 et la v9 (`releve.js`), puis `python3 compare.py rel-v8 rel-v9 sortie.txt` avec les écrans qui devaient changer (ceux des neuf corrections) ; lire tous les écrans changés, tous ceux qui devaient changer et n'ont pas bougé, et tous leurs voisins ;
4. lire les sorties de l'exécutant (`gardes-16-a-20-sur-v8.txt`, `destinations-v9.txt`, `lecture-v9.md`, `banc-final-v9.txt`) et dire ce qu'elles contiennent ;
5. un défaut trouvé devient un contrôle de `controles.js`.

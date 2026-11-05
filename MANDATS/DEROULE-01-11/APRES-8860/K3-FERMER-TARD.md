# MANDAT K3 — FERMER L'ATELIER DANS LES DERNIÈRES SECONDES DU LANCEMENT (C16 721)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`. Branche : `deroule/fermer-lancement` (tu continues `ab1e1c6d2`). **20 minutes au plus.** Mesure d'abord.*

## 0 · CE QUI EST DIT
- Le mandat K (ce dossier) : « Fermer l'atelier » pendant l'attente : aucune heure ne part ; ce que ce lancement a déjà écrit au hub est retiré. Paul : jamais de perte silencieuse.
- L'exécutant K2 (`ab1e1c6d2`) : pendant l'attente, 2 écritures partent (la copie de la classe et `/site/cours_actif`, 4 passages sur 4) ; la variante « fermer-tard » n'a jamais cliqué (sa boucle de surveillance ne s'est pas déclenchée) ; « à l'heure 1, tout paraît se faire dans le même instant ; à l'heure 2 et suivantes, une lecture de 3 s suit les écritures ».

## 1 · CE QUE TU FAIS
1. Répare la variante « fermer-tard » de la sonde (elle doit cliquer « Fermer l'atelier » juste après ces 2 écritures, avant le départ de l'heure), à l'heure 2 d'une classe (la fenêtre de 3 s).
2. Mesure, base `cd88b59f9` → après : ce qui reste au hub de ce lancement (`/site/cours_actif`, la copie de la classe, l'état de l'heure), compté ; et si la copie de la classe existait avant le lancement, qu'elle est restée telle qu'avant (rien de perdu).
3. Si quelque chose reste ou si quelque chose d'avant est perdu : corrige pour que fermer rende le hub tel qu'avant le lancement ; sinon, ne change rien.

## 2 · LA PREUVE
La sonde du réseau lent (`LIVRAISONS/DEROULE-01-11/RESEAU-LENT/sonde-f.mjs`), « fermer-tard » à l'heure 2 : base → après, compté ; « fermer », « normal », « devoiler » inchangés ; le parcours vert si le code change.

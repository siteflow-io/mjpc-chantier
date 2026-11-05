# MANDAT K2 — CE QUE K N'A PAS PROUVÉ (C16 721)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`. Branche : `deroule/fermer-lancement` (tu continues `619f714be`). **15 minutes au plus.** Mesure d'abord ; ne change le code que si la mesure le demande.*

## 0 · CE QUI EST DIT
- Le mandat K (`K-FERMER-PENDANT-LE-LANCEMENT.md`, ce dossier) : « Fermer l'atelier » pendant l'attente : aucune heure ne part ; ce que ce lancement a déjà écrit au hub est retiré ; l'infobulle le dit.
- L'exécutant K (`619f714be`) : « l'infobulle […] n'est pas prouvée par le geste ; la sonde ne ferme qu'à 8 s, quand rien n'est encore écrit au hub, donc le retrait de ce qu'un lancement aurait déjà écrit n'est pas mesuré ; « normal » a fait 9 écritures contre 14 à la base […] je ne sais pas si c'est seulement le moment des enregistrements différés. »
- Paul : jamais de perte silencieuse.

## 1 · CE QUE TU MESURES, PUIS FAIS SI BESOIN
1. L'infobulle de « Fermer l'atelier » pendant l'attente, lue par le geste (survol), et hors attente (inchangée).
2. « Fermer l'atelier » au plus tard possible de l'attente (quand le lancement a déjà commencé à écrire au hub) : ce qui reste au hub de ce lancement, compté ; s'il en reste, le retirer.
3. « normal » : base et après, deux passages chacun, les écritures listées chemin par chemin, une fois l'heure partie et les enregistrements différés passés : chaque écriture de la base existe après (aucune perdue), compté.

## 2 · LA PREUVE
La sonde du réseau lent (`LIVRAISONS/DEROULE-01-11/RESEAU-LENT/sonde-f.mjs`), complétée de 1 à 3 ; base `cd88b59f9` → après ; le parcours vert si le code change.

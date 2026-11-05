# MANDAT K — « FERMER L'ATELIER » PENDANT LE LANCEMENT ANNULE LE LANCEMENT (C16 721)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base : ici, la 8.86.0-⑲ en ligne = sas `nuit/h` `cd88b59f9` (assemblé `3e8a46c9` + la ligne de version). Branche : `deroule/fermer-lancement`. **20 minutes au plus.***

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE, ET CE QUI EST DIT
- Sur un réseau lent, l'heure met jusqu'à 30 s à partir. Si Paul ferme l'atelier pendant ce temps, l'heure part quand même, sans pilote à l'écran (mesuré par le mandat F, avant et après : 1 lancement, 11 écritures).
- C16 721 (proposé à Paul le 04/11 à 23:32 ; non commenté ; Paul, 05/11 06:15 : « On passe à la suite du plan ») : « fermer l'atelier pendant le lancement annule le lancement ; aucune heure ne part sans pilote. »
- Paul : jamais de perte silencieuse ; un bouton dit ce qu'il fait dans son infobulle.

## 1 · CE QUE TU FAIS
1. « Fermer l'atelier » pendant l'attente d'un lancement : aucune heure ne part ; ce que ce lancement a déjà écrit au hub est retiré ; les ▶ gardés pendant l'attente sont oubliés.
2. Pendant l'attente, l'infobulle de « Fermer l'atelier » dit que fermer annule le lancement de l'heure.
Rien d'autre ; une heure déjà partie se ferme comme aujourd'hui.

## 2 · LA SUPPOSITION (À VÉRIFIER)
Le lancement attend la réponse du hub puis pose la session (`cours_actif`, l'état de l'heure) ; la bande « L'heure se lance… » et la file des ▶ du mandat F (sas `nuit/f` `7154ad47c`, dr-classe.js) savent qu'une attente est en cours ; « Fermer l'atelier » ne regarde pas cette attente.

## 3 · LA PREUVE
La sonde du réseau lent (`LIVRAISONS/DEROULE-01-11/RESEAU-LENT/sonde-f.mjs`, variantes `normal`, `devoiler`, `fermer`, réglage `MJPC_Q4`), au faux hub ralenti : base → après, compté (« fermer » : 0 heure partie, 0 trace au hub de ce lancement, aucun ▶ joué ensuite ; « normal » et « devoiler » inchangés) ; le parcours P0-P12 vert ; la sonde du gel et la case des initiales vertes.

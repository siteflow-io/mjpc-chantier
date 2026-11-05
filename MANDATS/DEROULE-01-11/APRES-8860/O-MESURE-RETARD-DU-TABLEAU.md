# MANDAT O — MESURER, SANS RIEN CORRIGER : LE RETARD DU TABLEAU APRÈS CHAQUE GESTE DU PILOTE (⑯, C16 645)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`. Base : sas `deroule/fermer-lancement` `1a60c142b` (la 8.86.0-⑲ en ligne + 721). Branche : `mesure/retard-tableau`. **20 minutes au plus.** Mesure seulement.*

## 0 · CE QUI EST DIT
- ⑯ (registre, 02/11, promotion 8.79.0-⑫ : « ⑯ rouverte (le retard du tableau) ») ; C16 645 : « le tableau suit le pilote avec un peu plus d'une demi-seconde de retard après certains gestes. Rouvert, sur ton mot. »
- Paul, 04/11 19:47 (sur la maquette, sans le hub) : « elle lagguait à fond » ; 19:51 : « ne prends pas trop de temps pour mesurer ça ». La frappe des réponses est déjà mesurée (étape 13 du banc : médiane 13 à 35 ms).

## 1 · CE QUE TU MESURES (par le geste, une vraie heure au faux hub, la fenêtre du tableau ET le tableau distant ; 10 fois chaque geste ; médiane et plus long)
Le temps entre le geste au pilote et son effet visible au tableau, pour : diapo suivante et précédente ; ▶ dévoiler ; geler et dégeler ; écrire un mot au tableau ; surligner ; lancer, glisser et redimensionner le chrono ; une réponse validée ; « au tableau » du chrono. Pour chaque geste au-delà de 500 ms : la ligne de code qui attend (un délai, un enregistrement différé, la relecture toutes les 3 s…).

## 2 · LA SUPPOSITION (À VÉRIFIER)
La fenêtre du tableau reçoit l'état du pilote directement (même navigateur) ; le tableau distant le reçoit par le hub (écriture puis lecture), avec des enregistrements différés pour certains gestes.

## 3 · CE QUE TU LIVRES
`LIVRAISONS/DEROULE-01-11/MESURE-RETARD-TABLEAU/` : la sonde, ses sorties, une NOTE courte : un tableau geste par geste (fenêtre, distant : médiane, plus long) ; pour chaque geste au-delà de 500 ms, la ligne qui attend.

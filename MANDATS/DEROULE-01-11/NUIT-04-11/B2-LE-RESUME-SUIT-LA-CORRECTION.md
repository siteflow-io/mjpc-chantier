# MANDAT B2 — UNE CORRECTION APRÈS L'HEURE RÉÉCRIT AUSSI LE RÉSUMÉ DE L'HEURE (C16 573, 723)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/b2`, depuis `5af519cf6` (le dernier commit de `nuit/c2`). **15 minutes au plus.***

## 0 · CE QUI EST DIT
- Paul, 04/11 13:07 : « après tes correctifs, je veux retrouver ma séance d'aujourd'hui avec son récit normal et que plus jamais ces cas n'arrivent. » ; Paul : jamais de perte silencieuse ; jamais de promotion sur dette.
- Mesuré par l'exécutant C2 (`5af519cf6`) : après les 4 corrections de la Relecture (mandat B), le résumé de l'heure écrit pendant l'heure et à la clôture (`heures/<clé>/parts`, `dr_partsHeure`) garde les élèves saisis en classe (3 sur 3) et aucun élève corrigé (0 sur 4) ; il compte aussi une réponse restée dans la diapo sans être validée ; aujourd'hui, rien ne le lit (0 lecteur) ; une correction ne le réécrit jamais.

## 1 · CE QUE TU FAIS
Une correction faite dans la Relecture (mandat B) réécrit aussi, au même moment et une seule fois, l'entrée correspondante du résumé de l'heure (`heures/<clé>/parts`) : le bon élève, ou l'élève ajouté pour une réponse qui n'y était pas. Rien d'autre n'y change ; ouvrir la Relecture n'écrit toujours rien.

## 2 · LA SUPPOSITION (À VÉRIFIER)
La correction : `dr_corrigerReponse` et son écriture `reponse-corrigee` (dr-recit, mandat B) ; le résumé : `dr_partsHeure` (dr-recit ou dr-classe), les entrées `{bi, eid, heure, m:'reponse', nom, reponse:true, ri}`.

## 3 · LA PREUVE
La sonde de B (`LIVRAISONS/DEROULE-01-11/CORRIGER-APRES/`), reprise : base → après, compté (le résumé de l'heure après les 4 corrections : les 4 bons élèves, aucun ancien ; une écriture de plus par correction, au résumé de cette heure seulement ; rien d'autre écrit) ; les sondes de la case, du gel, de la Relecture, de D, vertes ; le parcours vert.

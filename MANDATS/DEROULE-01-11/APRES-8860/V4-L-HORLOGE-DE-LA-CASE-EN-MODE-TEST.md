# MANDAT V4 — L'HORLOGE DE LA CASE NE REPART PAS À LA SÉANCE ENCHAÎNÉE (mode test, classe d'essai)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base et la durée. Branche : `deroule/enchainer`, tu continues `948d09b50`. **20 minutes au plus.** Lis d'abord le mandat V (§0, §1) et la NOTE-V3 (`LIVRAISONS/DEROULE-01-11/ENCHAINER/NOTE-V3.md`).*

## 0 · CE QUI EST DIT
- Acquis 866 (corrigé par 871) : la séance 2 démarre « sur le même créneau » ; acquis 868 : « pareil en mode test » ; Paul, 22:38 : « si je ne finis pas la séance 2 commencée dans la foulée, à t-5 j'ai bien le flux classique? ».
- NOTE-V3, dette trouvée : « l'horloge de la case (`dr_horlogeCase`, réservée à 3E Charles de Gaulle) repart de 08:57 au lancement de la séance enchaînée, parce qu'elle se cale sur le début réel de CETTE heure. Pour la classe d'essai, le T-5 de la séance 2 tombera donc plus tard que celui de la case. »

## 1 · CE QUE TU FAIS
1. À la séance enchaînée, l'horloge de la case continue là où elle en était à la fin de la séance 1 (elle ne repart pas au début du créneau) ; le T-5 de la séance 2 tombe à 5 minutes de la fin du créneau sur cette horloge, comme pour une heure ordinaire. Rien ne change pour les autres classes ni pour une heure non enchaînée.
2. Par le geste, en mode test (la classe d'essai) : l'horloge de la case juste avant le clic et juste après (écart ≤ 1 min) ; sans « aller à 5 minutes de la fin », l'alerte des 5 minutes arrive à 5 minutes de la fin du créneau sur l'horloge de la case. La sonde de l'enchaînement rejouée en entier (vraie heure, mode test, deux heures, répétition, témoin, T-5) : verte ; le parcours P0-P12 vert.

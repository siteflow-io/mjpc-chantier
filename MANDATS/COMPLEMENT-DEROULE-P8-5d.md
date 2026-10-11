# COMPLÉMENT — MAQUETTE p8 · livraison p8-5d : les notes suivent toujours la diapo, et le premier caractère
*Conscience n°13, 11/10/2026 (C13, tour 46). Se lit après le complément p8-5c. Règle les dettes n°13 · 13 et 14, trouvées à l'audit de p8-5c. Soumis à Paul le 11/10 (tour 46), non commenté : acquis ; déposé au tour 47.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul, 11/10 : « Jamais la classe ne passe à la suivante si ce n'est pas moi qui clique sur suivant. Donc non, une note suit sa diapo, toujours. Sinon c'est un coup à écrire en pensant écrire sur la diapo concernée (alors que c'est la suivante). »
En classe : le panneau des notes montre toujours la diapo que Paul a sous les yeux. Jamais une note d'une autre diapo sous ses doigts.

## CE QUI A ÉTÉ TRANCHÉ
1. **Le panneau suit la diapo courante, toujours.** La décision 8 de la NOTE p8-5c (le panneau attend qu'on sorte du paragraphe) est retirée. Quand Paul change de diapo — ▶ en fin de diapo, ◀, une vignette du volet, ⊞, une garde « Y aller » — le panneau passe à la nouvelle diapo aussitôt, même si un paragraphe avait le focus : ce qui était tapé est déjà enregistré (instantané, règle p8-5c point 8), et le focus quitte la note proprement (`blur` avant le rendu, jamais une saisie perdue).
2. **Ce n'est pas une entorse à la règle du redessin.** « Un redessin n'efface jamais une saisie en cours et ne touche pas l'élément qui a le focus » vaut pour les redessins que Paul n'a pas provoqués (écoute du hub, minuteur, autre poste). Un changement de diapo est son geste. L'animation accélérée (⚙) est une simulation de la maquette, pas un cas de classe : le banc « taper pendant l'animation » de p8-5c est remplacé (point 5).
3. **Le premier caractère après Entrée.** Le paragraphe neuf reçoit le focus avant que la touche suivante arrive (synchrone, dans le même geste), pour Entrée dans une note existante comme pour le premier paragraphe d'une diapo sans note. Aujourd'hui, à 0 ms, le premier caractère se perd (pièce `TRANSCRIPTS/C13/pieces/T45b-entree.mjs`).

## LA LIVRAISON p8-5d
Branche `deroule/p8-5d`, partie de `deroule/p8-5c`. Jamais `main`.
4. Les points 1 et 3 dans `p8-5c.js` (ou `p8-5d.js` si tu préfères séparer), le patch `patch-p8-5d.py`, `regen.sh` étendu ; la NOTE donne chaque fonction touchée, taille avant et après.
5. **Bancs par le geste** (`test-p8-5d.mjs`), chacun compté :
   - **le panneau suit** : heure lancée, diapo 1, clic dans la note ⌂, taper dix caractères, puis ▶ jusqu'à la diapo 2 (par les clics) → le panneau montre les notes de la diapo 2 (la clé rendue est celle de la diapo 2), aucun paragraphe n'a le focus, et la note ⌂ de la diapo 1 contient les dix caractères, entiers ; ◀ → le panneau remontre la diapo 1, le texte est là ;
   - **la même chose par une vignette** du volet (avec la garde « Y aller devant la classe ») et par ◀ depuis le début d'une diapo ;
   - **dans l'atelier**, clic sur une autre diapo du volet pendant la frappe → même résultat ;
   - **le premier caractère** : sur trois diapos, Entrée puis frappe à 0 ms (sans attente), trois fois ; aucun caractère perdu ; même chose pour le premier paragraphe d'une diapo sans note ;
   - **le banc de p8-5c « taper pendant l'animation accélérée »** est retiré de `test-p8-5c.mjs` et remplacé par le premier banc ci-dessus ; la NOTE le dit.
6. Les bancs de p8-5c rejoués (31 bancs), puis le banc unique à 0.
7. `LIVRAISONS/DEROULE/p8-5d/` : la NOTE, les bancs, les sorties, une capture d'écran entier (le panneau sur la diapo 2 juste après ▶, la note de la diapo 1 intacte au retour), le gabarit, le patch, la maquette, `EMPREINTES.md5`. **Puis tu t'arrêtes.**

## CE QUE TU NE TOUCHES PAS
- Le reste de p8-5c (la répétition, les ancres, la mise en forme) ; le récit et la copie (n°13 · 8) ; le curseur « texte au tableau » (n°13 · 12) ; `correction_dictee.html`.

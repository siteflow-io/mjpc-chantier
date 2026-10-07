# COMPLÉMENT — MAQUETTE p8 · livraison p8-5 : écrire en classe, dans la copie de la classe
*Conscience n°13, 07/10/2026 (C13, tour 28). Se lit après le complément p8-4. Règle la dette n°13 · 3 pour la classe.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul, 06/10 : « en flux normal de classe, je suis censé pouvoir toujours modifier des choses au tableau, d'autant plus quand ce sont des réponses élèves que je note, ou alors une modif ». Cadrage 1 §8.4 : ce que Paul modifie en séance vit dans la copie de la classe ; à la clôture, le site compare la copie et la trame par identité et propose le versement, diapo par diapo (oui / non).

## L'AUDIT DE FAISABILITÉ (conscience n°13)
La maquette n'a qu'une séance : rien ne sépare la copie d'une classe de la trame. **C'est faisable**, en préparant la donnée et sa place comme le vrai site la tiendra :
- une copie par classe et par heure, ancrée par identité de diapo et de bloc ;
- pas de second jeu de diapos.

## LA LIVRAISON p8-5
Branche `deroule/p8-5`, partie de `deroule/p8-4`. Jamais `main`.
1. **Heure lancée** : le texte des blocs s'écrit d'un clic. Ce qui est écrit va dans la copie de la classe, jamais dans la trame. Le pilote et le tableau montrent la copie.
2. **« Fin de l'heure »** : si la copie diffère de la trame, la liste des diapos modifiées s'ouvre, chacune avec « verser dans la trame » oui / non, en clair. Sans réponse, la trame ne change pas. Aucune boîte système.
3. **Bancs par le geste** (`test-p8-5-classe.mjs`) :
   - corriger un mot en classe → la copie a changé, la trame non ;
   - « Fin de l'heure » → la liste propose la diapo ; « oui » → la trame a changé ;
   - une seconde correction, puis « non » → la trame n'a pas changé ;
   - la répétition ne laisse aucune copie.
4. Les bancs de p8-4 rejoués, puis le banc unique à 0.
5. `LIVRAISONS/DEROULE/p8-5/` : la NOTE, les bancs, les sorties, des captures d'écran entier, le gabarit, les patches, la maquette, les empreintes. **Puis tu t'arrêtes.**

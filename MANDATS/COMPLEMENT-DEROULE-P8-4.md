# COMPLÉMENT — MAQUETTE p8 · livraison p8-4 : écrire directement dans la diapo (atelier et répétition)
*Conscience n°13, 07/10/2026 — version 2 (C13, tour 28), réécrite après l'audit de faisabilité. Elle remplace la version du tour 24. Se lit après le mandat (version 3) et les compléments p8-3b, p8-3c et p8-3d.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul, 06/10 : « c'est très fastidieux de devoir passer par un menu pour entrer des choses dans la diapo. J'aimerais pouvoir écrire directement dedans. […] c'est en fait ma façon de travailler habituelle. »
Paul, 07/10 : « l'idée est aussi que le contrat visuel de chaque type soit utilisé à chaque fois. ainsi, je n'ai plus de question à me poser sur la disposition ».

## CE QUI A ÉTÉ TRANCHÉ (C13, tours 23 à 25)
1. **Tout texte de la diapo s'écrit d'un clic**, comme dans le site actuel (« Clic dans un texte pour l'écrire »).
2. **Sous le dernier bloc, on clique et on écrit** : c'est un bloc « texte ». Entrée ouvre une nouvelle ligne, c'est-à-dire un nouvel élément, qui se dévoilera à son tour.
3. **« + bloc » ne propose plus que ce qui n'est pas du texte libre.**
4. **Clic droit → « Changer de type »** : le bloc prend en entier le contrat visuel de son type, comme s'il avait été créé par le menu. Une ligne reste un élément, dans tous les types.
5. **Un bloc tapé a son identité dès sa première lettre.**

## L'AUDIT DE FAISABILITÉ (conscience n°13, sur la maquette p8-3c)
- **Faisable tel quel** :
  - l'écriture d'un clic : la maquette sait déjà écrire dans la diapo, pour les champs de réponse (mesuré : 2 champs éditables) ;
  - le bloc tapé et le changement de type : les types et leur rendu existent.
- **Faisable, à compléter : l'instantané de la répétition.** `lancerRepetition` prend déjà un instantané de l'état du jeu (`S`, `vuMax`, `parDiapo`, la longueur du journal), et `arreterRepetition` le restaure. Mais **le contenu des diapos n'y est pas** : tant qu'on ne pouvait rien modifier en répétition, il n'y était pas utile. **Tu étends l'instantané à la séance** (ses diapos et leurs blocs). Cadrage 4 §1.5 : à l'arrêt, tout ce qui a été joué est oublié.
- **Pas dans cette livraison : la copie de la classe.** La maquette n'a qu'une seule séance : rien ne sépare la copie d'une classe de la trame. Le versement proposé à la fin de l'heure (cadrage 1 §8.4) n'existe donc pas. Il fait l'objet de p8-5. **En p8-4, pendant une heure lancée, l'écriture du texte des blocs reste fermée, comme aujourd'hui** ; les réponses s'écrivent comme avant.
- **Pas faisable tel qu'il était écrit : le banc « un autre onglet modifie la trame ».** La maquette ne fait rien circuler entre onglets. Tu le remplaces par un redessin que la maquette provoque vraiment, par exemple un ▶ joué depuis la fenêtre du tableau. La NOTE dit lequel.

## LA LIVRAISON p8-4
Branche `deroule/p8-4`, partie de `deroule/p8-3d`. Jamais `main`.
1. Les décisions 1 à 5 dans l'atelier, et en répétition, avec l'instantané étendu. Le patch `patch-p8-4.py` ; la NOTE donne chaque fonction touchée, avec sa taille avant et après.
2. **Les règles déjà payées** :
   - un redessin n'efface jamais une saisie en cours, ne touche pas à l'élément qui a le focus, et garde le défilement ;
   - l'enregistrement est instantané dans l'atelier (« ✔ enregistré ») ;
   - rien ne se coupe seul : si un bloc tapé ne tient plus, « À régler » le dit ;
   - chaque geste ajouté a son infobulle, écrite pour Paul, sans « Grisé ».
3. **Bancs par le geste** (`test-p8-4-ecrire.mjs`) :
   - **atelier** : sous le dernier bloc, taper deux lignes avec Entrée → un bloc « texte » de deux éléments, enregistré ;
   - **atelier** : corriger un mot dans une consigne existante → enregistré ;
   - **changer de type** : « Changer de type » → question. Le bloc a la même structure et les mêmes classes qu'une question créée par le menu (comparées) ; ses deux lignes sont deux questions ; au pilote, ▶ les dévoile une à une ;
   - **répétition** : corriger un mot, le voir au tableau, puis « ■ Arrêter » → la trame est identique à ce qu'elle était avant la répétition (comparée) ;
   - **la saisie tient** : taper pendant le redessin choisi → rien n'est effacé, le curseur reste ;
   - **heure lancée** : le texte des blocs reste fermé, les réponses s'écrivent.
4. Les 27 bancs rejoués, puis le banc unique à 0.
5. `LIVRAISONS/DEROULE/p8-4/` : la NOTE, les bancs, les sorties, des captures d'écran entier, le gabarit, les patches, la maquette, les empreintes. Puis tu enchaînes p8-5.

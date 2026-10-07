# COMPLÉMENT — MAQUETTE p8 · livraison p8-4 : écrire directement dans la diapo
*Conscience n°13, 07/10/2026 (C13, tour 24). Soumis à Paul avant tout dépôt. Se lit après le mandat (version 3) et les compléments p8-3b et p8-3c, qui restent en vigueur. Règle la dette n°13 · 3 et cadre la dette n°13 · 6.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul, 06/10 (tour 23) : « c'est très fastidieux de devoir passer par un menu pour entrer des choses dans la diapo. J'aimerais pouvoir écrire directement dedans. […] c'est en fait ma façon de travailler habituelle » ; « en flux normal de classe, je suis censé pouvoir toujours modifier des choses au tableau, d'autant plus quand ce sont des réponses élèves que je note, ou alors une modif ».
Paul, 07/10 (tour 24) : « l'idée est aussi que le contrat visuel de chaque type soit utilisé à chaque fois. ainsi, je n'ai plus de question à me poser sur la disposition ».
**Pour qui** : Paul, en préparation et devant la classe. **Le geste** : il clique dans la diapo et il écrit ; la disposition se fait seule, selon le type du bloc.

## CE QUE PAUL A TRANCHÉ (tour 24, « ok » sur la proposition du tour 23, point 90)
1. **Tout texte de la diapo s'écrit d'un clic**, comme dans le site actuel (« Clic dans un texte pour l'écrire », joué le 05/10, carte de l'existant Z1) :
   - dans l'atelier, il va dans la trame ;
   - en classe, il va dans la copie de la classe, et à la clôture le site propose le versement dans la trame, diapo par diapo, oui ou non (cadrage 1 §8.4) ;
   - en répétition, il est oublié à l'arrêt (cadrage 4 §1.5).
2. **Sous le dernier bloc, on clique et on écrit** : c'est un bloc de type « texte », sans menu. **Entrée ouvre une nouvelle ligne**, qui est un nouvel élément et se dévoilera à son tour.
3. **« + bloc » ne propose plus que ce qui n'est pas du texte libre** : question, schéma, image, fiche, vidéo, document (la consigne aussi, si elle a sa propre disposition dans la maquette ; la NOTE le dit).
4. **Clic droit sur un bloc → « Changer de type »**. Le bloc prend **en entier le contrat visuel de son nouveau type** : la disposition, les chevrons, les champs de réponse, la taille, exactement comme un bloc de ce type créé par le menu. Paul n'a aucun réglage de disposition à faire.
   - **Une ligne = un élément**, dans tous les types : chaque ligne garde son texte et devient un élément du nouveau type, à sa place (une ligne devient une question, une étape, une famille de schéma…).
   - Si le nouveau type a une règle d'écriture (le schéma : « famille : notions »), le panneau du type la montre, comme pour un schéma créé par le menu.
   - Les règles déjà tranchées tiennent : un seul schéma par diapo ; une diapo à schéma, c'est son titre, une consigne d'une ligne et le schéma.
5. **La notion d'objet ne se perd pas** : un bloc tapé a son identité dès sa première lettre, comme un bloc créé par le menu.

## LES RÈGLES QUI S'APPLIQUENT (déjà payées)
- **Un redessin n'efface jamais une saisie en cours.** Il ne touche pas à l'élément qui a le focus, attend qu'on l'ait quitté et garde le défilement (règle permanente, 04/10).
- **Jamais de perte silencieuse** : l'enregistrement est instantané à chaque geste dans l'atelier ; en classe, la copie reçoit chaque frappe.
- **Rien ne se coupe seul** (cadrage 4 §0.4) : si un bloc tapé ne tient plus, « À régler » le dit et propose « Couper la diapo ici ».
- **Infobulles écrites pour Paul**, sans « Grisé », sur chaque geste ajouté.

## LA LIVRAISON p8-4
Branche `deroule/p8-4`, partie de `deroule/p8-3c`. Jamais `main`.
1. Le patch `patch-p8-4.py` sur le gabarit de p8-3c. La NOTE donne chaque fonction touchée, avec sa taille avant et après.
2. **Bancs par le geste** (`test-p8-4-ecrire.mjs`) :
   - **atelier** : cliquer sous le dernier bloc, taper deux lignes avec Entrée → un bloc « texte » de deux éléments, enregistré ;
   - **atelier** : clic dans le texte d'une consigne existante, corriger un mot → enregistré dans la trame ;
   - **changer de type** : « Changer de type » → question. Le bloc a la même structure et les mêmes classes qu'une question créée par le menu (comparées) ; ses deux lignes sont deux questions ; au pilote, ▶ les dévoile une à une ;
   - **répétition** : corriger un mot dans une consigne, puis « ■ Arrêter » → la trame n'a pas changé ;
   - **classe** (heure lancée) : corriger un mot → la copie de la classe a changé, la trame non. Si la clôture de la maquette propose déjà le versement, il est joué ; sinon, la NOTE le dit ;
   - **la saisie tient** : taper pendant un redessin provoqué (un autre onglet modifie la trame) → rien n'est effacé, le curseur reste.
3. Les bancs de p8-3c rejoués, puis le banc unique à 0.
4. `LIVRAISONS/DEROULE/p8-4/` : la NOTE, les bancs, les sorties, des captures d'écran entier (un bloc tapé, puis changé en question, au pilote et au tableau), le gabarit, les patches, la maquette, les empreintes. **Puis tu t'arrêtes.**

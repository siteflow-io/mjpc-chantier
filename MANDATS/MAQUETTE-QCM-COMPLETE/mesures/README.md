# Les mesures (mandat §5)

*Script : `node mesures/mesurer.js maquette-qcm-v5.html mesures/limites.json`. Sortie brute : `limites.json`. Sur une vraie demi-tablette (tablette 1280 × 800, chaque moitié 640 px de large), avec le CSS de la maquette (celui de la 7.7.1, plus les ajouts des étapes).*

## 1. Les limites de longueur (464)

**L'étalon.** La vraie question 3 de l'évaluation de 3e (énoncé de 96 caractères, 6 choix de 49 à 137 caractères, 402 en tout), sur l'écran de réponse : **67 px de reste**, la mesure du tour 610, retrouvée au pixel près (`t-annexe`). Le reste se compte du bas de la carte au bas de la moitié ; une moitié tient tant qu'il couvre la marge du bas de la page (16 px).

**Les trois écrans qui montrent les choix**, chacun à son état le plus chargé : la réponse (tous les choix cliqués, « ✅ Réponse enregistrée »), B (« dit-elle la même chose que ton clic ? », le clic figé) et la lecture du voisin à la correction (A). La vraie question 3 y laisse 51 px, 20 px et 3 px au-delà de la marge : elle tient partout. La lecture est l'écran le plus chargé ; les limites valent pour les trois à la fois.

**La mesure.** Pour 4, 5 et 6 choix, et une longueur d'énoncé donnée, la plus grande longueur **totale** des choix qui tient sur les trois écrans, les choix répartis comme dans la vraie question 3 (un choix long, les autres moyens). Balayage par pas de 10 caractères : la mise en page change quand un choix dépasse 40 caractères (un choix par ligne), la limite est donc la plus longue qui tient, toutes les plus courtes tenant aussi.

| Énoncé (caractères) | 4 choix : total des choix | 5 choix : total des choix | 6 choix : total des choix |
| --- | --- | --- | --- |
| 80 | 640 | 410 | 480 |
| 100 | 640 | 410 | 480 |
| 120 | 640 | 410 | 480 |
| 150 | 530 | 330 | 120 |
| 200 | 440 | 270 | 120 |
| 250 | 410 | 210 | 120 |

Ce que le tableau dit : à 6 choix, l'énoncé doit rester à 120 caractères ; au-delà, seuls 6 choix très courts tiennent. 5 choix tiennent moins que 6 à énoncé court : c'est mesuré ainsi, avec la répartition de la vraie question 3 (les 5 premiers de ses choix). Le plus long choix de la répartition vaut un tiers du total : à 480, un choix de 160 caractères tient.

Mesure complémentaire (`limites.json`, « ecrans ») : tous les choix de même longueur, écran par écran.

### Le texte exact qui remplace `{{LIMITES}}` dans le prompt (`MANDATS/PROMPT-QCM-CREATION/README.md`, règle 12, qui continue par « Si une question dépasse et que je te dis que j'assume sa longueur… »)

> chaque question doit tenir sur une demi-tablette, choix compris. Compte les caractères, espaces comprises. Énoncé : 250 caractères au plus. Avec 4 choix : 640 caractères pour l'ensemble des choix si l'énoncé fait 120 caractères ou moins, 530 jusqu'à 150, 440 jusqu'à 200, 410 jusqu'à 250. Avec 5 choix : 410 si l'énoncé fait 120 caractères ou moins, 330 jusqu'à 150, 270 jusqu'à 200, 210 jusqu'à 250. Avec 6 choix : l'énoncé fait 120 caractères au plus, et l'ensemble des choix 480. Aucun choix ne dépasse 160 caractères.

## 2. Le débordement

Chaque scène de tablette, chaque moitié, à 1280 × 800 : **0 débordement** (banc final, vérification 2), y compris la lecture de la vraie question 3 de 3e (`x610-3-a-correction`) et la tablette d'un élève seul (`t-corr-seul`). Aucune question n'est marquée « longueur assumée » dans les scènes de tablette ; la marque se voit dans l'éditeur et au collage (`x627-3-editeur`, `c-collage`).

## 3. Les tailles d'écran

La console à 1366 × 768, 1536 × 864 et 1920 × 1080 ; le téléphone à 390 × 844 ; le tableau à 1280 × 800 ; l'élève hors séance à 1280 × 800 et 390 × 844. À chaque taille : pas de défilement horizontal, aucun chevauchement, aucun texte coupé (banc final, vérifications 2 et 8).

## 4. Les chevauchements

Tout allumé (fenêtres ouvertes, infobulles ouvertes là où la scène les ouvre) : aucun chevauchement entre couches, à toutes les tailles (banc final, vérification 8).

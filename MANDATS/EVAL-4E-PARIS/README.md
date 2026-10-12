# L'évaluation de 4e en ligne, et le prompt pour la corriger (12/10/2026, tour 673)

Demande de Paul (12/10, 14:20) : « donne moi le nouveau prompt ainsi que le json de l'éval actuellement en ligne , ça me permettra de lancer une instance sur sa correction. »

## Les deux fichiers

| Fichier | Ce que c'est |
| --- | --- |
| `eval_1791380799497.json` | L'évaluation telle qu'elle est au hub (`qcm/evaluations/eval_1791380799497`), lue le 12/10 à 14:24, en lecture seule. Titre « 4e- Chapitre 1 - Paris à la barre et analyse logique · », 21 questions, créée le 07/10 à 15:46, jamais modifiée depuis. md5 `26d84a321168f7a405fdcc332eccfb30`. |
| `PROMPT-4E-CH1.txt` | Le nouveau prompt de création, tel que la maquette v9 le remplit (`promptRempli()`, lu dans `maquette-qcm-v9.html` de la branche `maquette-qcm`, 5852823d), avec le chapitre 1 de 4e à la place du chapitre 1 de 3e. md5 `b03c72075a2497656d976531b6ded54c`. |

## Ce qu'il faut savoir avant de lancer l'instance

1. Le chapitre 1 de 4e n'a pas de fiche au hub (`site/4e` ne porte que `published_extras` et `published_tabs`) : il n'a donc ni titre officiel ni compétences. Le titre est pris de l'évaluation ; l'identifiant est `4e-ch1`, sur le modèle de la maquette (`3e-ch1`). Le prompt donne les 28 compétences du hub, avec leur libellé élève, et demande à l'instance de proposer d'abord celles du chapitre et d'attendre l'accord de Paul.
2. Ce que l'évaluation n'a pas, au regard du format du prompt : `chapitre`, `mode`, et pour chaque question `reflexion`, `reponse`, `competences`, `verifie`, `bonus`, `longueurAssumee`. Elle a seulement `enonce`, `choix`, `bonnes`, `niveau`, `explication`.
3. La question 21 est la bonus, mais elle le dit dans son énoncé (« BONUS — … ») et n'a pas `"bonus": true`.
4. Mesurée avec les limites du prompt (règle 12) : seule la question 21 dépasse (157 caractères d'énoncé et 6 choix, donc 25 caractères par choix au plus ; son plus long choix en fait 57). La question 9 est juste : 233 caractères d'énoncé, 5 choix, 25 caractères permis, 20 au plus long.
5. Paul a dit qu'il réduit à 11 questions et qu'il choisira lui-même lesquelles.

# Le prompt de création d'une évaluation QCM — proposition (10/10/2026, tour 630)

Demande de Paul (10/10, 09:14) : « ok pour le prompt ». Cadrage : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/CADRAGE-QCM.md (points 62 et 123 pour la méthode ; les règles viennent de tout le cadrage, voir le tableau en bas).

## Ce que c'est, et où il vit

C'est le texte que Paul colle dans une instance Claude (« l'instance de création d'éval ») pour qu'elle l'aide à écrire une évaluation, puis lui rende le JSON qu'il colle dans l'app. Il remplace `PROMPT_IA_DEFAUT` de la 7.7.1 (l. 2321), qui ne connaît ni les temps par question, ni les compétences, ni le chapitre, ni la règle de note d'aujourd'hui. Il reste modifiable par Paul dans Réglages (124), au même chemin (`qcm/settings/promptIa`, vide au hub le 10/10 : c'est le texte par défaut qui sert).

L'app l'assemble au moment où Paul le copie, avec le canon du socle (`mjpcPromptComposer` : la présentation, les directives, le cadrage imposé « NE PRODUIS AUCUN JSON TOUT DE SUITE… », le format, le vocabulaire). Paul choisit d'abord le chapitre ; l'app remplace alors les jetons :

| Jeton | Ce que l'app y met |
| --- | --- |
| `{{CHAPITRE}}` | le niveau, le numéro et le titre du chapitre choisi, et son identifiant |
| `{{COMPETENCES_CHAPITRE}}` | les compétences du chapitre (majeure, mineures), une par ligne : le code, le libellé officiel, le libellé élève (638) |
| `{{NIVEAUX}}` | les quatre difficultés, générées depuis `NIVEAUX`, **sans** temps (56 : la difficulté ne donne plus le temps) |
| `{{LIMITES}}` | les limites de longueur mesurées sur une vraie demi-tablette (464) : à mesurer par la maquette, pas encore connues |
| `{{DUREES}}` | les durées fixes de la séance, les mêmes que celles de la garde de l'app (58) : voir le point 649 |

## Le texte proposé

```
Tu vas m'aider à écrire une évaluation QCM pour ma classe. Elle se passe dans mon application, en classe, deux élèves par tablette. Voici comment elle se déroule, puis les règles à respecter strictement.

LE CHAPITRE
{{CHAPITRE}}
Ses compétences, les seules que tu peux utiliser :
{{COMPETENCES_CHAPITRE}}

COMMENT SE PASSE UNE QUESTION EN CLASSE
1. Réflexion : l'élève voit l'énoncé seul, sans les choix, et écrit sa réponse en entier, à la main, sur sa feuille.
2. Réponse : les choix apparaissent ; chacun son tour, l'élève pose son stylo, relit sa feuille et clique sur le ou les choix qui disent la même chose que ce qu'il a écrit. C'est sa feuille qui fait foi pour la note.
3. Correction, après toutes les questions : l'élève recopie sur la tablette ce que dit sa feuille, puis je révèle la réponse et je commente.
La tablette ajoute toujours d'elle-même la case « Ma feuille ne dit aucun de ces choix ».

LES DURÉES
{{DUREES}}
La séance tient en 45 minutes utiles, questions et correction comprises.

CE QUE TU FAIS, DANS CET ORDRE
1. Pose-moi d'abord ces questions, numérotées, et attends mes réponses :
   1. Donne-moi le cours sur lequel porte l'évaluation (la leçon, les fiches, les séances) : les bonnes réponses en reprendront les mots exacts.
   2. Combien de questions ?
   3. Combien à réponses multiples ?
   4. Quel équilibre de difficultés (facile, standard, approfondi, expert) ?
   5. Tout ou rien, ou partiel ?
   6. Veux-tu une question bonus ?
2. Propose-moi les questions, par petits groupes. Pour chacune : l'énoncé, les choix, la ou les bonnes réponses, la difficulté réelle, la ou les compétences, ce qu'elle vérifie, et la réponse que l'élève doit écrire sur sa feuille, en quelques mots.
3. Pour les temps, tu ne devines jamais. Pour chaque question, demande-moi le temps de réflexion et le temps de réponse. Appuie-toi sur la vraie difficulté de la question et sur la longueur de la réponse à écrire. Si un temps que je te donne te paraît trop court pour écrire cette réponse, dis-le : « La question 7 ne rentre pas : … ». Si tu ne sais pas, demande-moi.
4. Quand tous les temps sont donnés, calcule la durée de la séance avec les durées ci-dessus. Écris : « Ça rentre dans 45 minutes (total : … min) » ou « Ça ne rentre pas : il manque … minutes ». Si ça ne rentre pas, propose une solution sans l'appliquer (une question à retirer, des choix à raccourcir, la question bonus comme fusible) et attends mon accord.
5. Tout au long de la discussion, tiens un cadrage mémorisé : à chaque étape, redonne en quelques lignes ce qui est décidé (questions validées, temps, compétences). Pose toujours tes questions numérotées. Le JSON est le résultat de notre discussion : je ne dois jamais avoir à le reprendre.
6. Si je te colle un message de mon application qui commence par « Corrige ton JSON », corrige seulement ce qu'il cite et renvoie le JSON complet.

RÈGLES POUR CHAQUE QUESTION
1. L'énoncé est autonome : l'élève doit pouvoir répondre de mémoire, sans voir les choix. Jamais « Laquelle des propositions suivantes… ».
2. L'énoncé dit la forme attendue de la réponse, par exemple « (le nom de la figure) » ou « (en un mot) », mais jamais le nombre de bonnes réponses.
3. On doit pouvoir répondre en quelques mots sur la feuille. Pour une question « Sur ta copie, écris une phrase… », la feuille porte la phrase et, en dessous, la réponse courte : c'est cette réponse courte que l'élève rapproche des choix.
4. Chaque choix est écrit comme l'élève l'écrirait. La bonne réponse reprend les mots exacts du cours. Les autres choix sont plausibles, mais clairement faux pour qui sait son cours. Les choix sont homogènes en longueur et en construction.
5. Jamais de choix « aucune de ces réponses » : la tablette l'ajoute d'elle-même.
6. Il n'y a pas de lettres : ne désigne jamais un choix par une lettre, ni dans l'énoncé, ni dans l'explication. Varie la place de la bonne réponse d'une question à l'autre.
7. Une question vaut au plus 1 point. En tout ou rien, elle vaut 1 si la réponse est exacte, sinon 0. En partiel, chaque bonne case cochée rapporte une part du point (1 divisé par le nombre de bonnes cases), chaque mauvaise case cochée en retire autant, sans descendre sous 0.
8. La difficulté dit la vraie difficulté de la question, rien d'autre : elle ne donne ni les points ni le temps.
9. Une ou deux compétences par question, prises seulement dans la liste du chapitre. Chaque compétence que tu utilises porte sur au moins 3 questions ; si ce n'est pas possible, dis-le-moi.
10. « Ce qu'elle vérifie » : une courte phrase à l'infinitif, dans les mots d'un élève, qui se lit après « À revoir en priorité : » comme après « Bravo, tu sais » ; par exemple « trouver l'antécédent d'un pronom relatif ». Jamais l'intitulé d'une compétence, jamais de jargon.
11. L'explication est pour l'élève, à la correction : 1 à 3 phrases claires, qui justifient la bonne réponse ; tu peux dire pourquoi un autre choix est faux.
12. La longueur : {{LIMITES}} Si une question dépasse et que je te dis que j'assume sa longueur, marque-la "longueurAssumee": true.
13. La question bonus, si je t'en demande une, porte "bonus": true : elle compte dans les points gagnés, pas dans le total.

LE FORMAT
{
  "titre": "Titre de l'évaluation",
  "chapitre": "identifiant du chapitre, celui donné plus haut",
  "mode": "strict",
  "questions": [
    {
      "enonce": "Énoncé autonome (forme attendue de la réponse)",
      "choix": ["…", "…", "…", "…"],
      "bonnes": [0],
      "niveau": "standard",
      "reflexion": 40,
      "reponse": 15,
      "competences": ["code de la compétence"],
      "verifie": "ce qu'elle vérifie, à l'infinitif",
      "explication": "1 à 3 phrases pour l'élève.",
      "bonus": false,
      "longueurAssumee": false
    }
  ]
}
"mode" vaut "strict" (tout ou rien) ou "partiel". "bonnes" donne la place des bonnes réponses, en comptant à partir de 0. "reflexion" et "reponse" sont en secondes, ceux que je t'ai donnés. "niveau" prend l'une de ces valeurs :
{{NIVEAUX}}
```

## D'où vient chaque règle

| Dans le prompt | Cadrage |
| --- | --- |
| Pas de JSON tout de suite ; JSON seul, sans texte ni balises | canon du socle `MJPC_PROMPT_CADRAGE` |
| Questions numérotées, cadrage mémorisé, JSON sans reprise | 123 |
| Le déroulé d'une question, la feuille fait foi | 288 à 293, 360, 393, 394 |
| « Ma feuille ne dit aucun de ces choix » ajoutée par la tablette | 173, 395 |
| Le cours, les mots exacts ; la forme attendue ; jamais le nombre de bonnes réponses | 478 |
| Réponse en quelques mots ; « Sur ta copie, écris une phrase… » | 330 |
| Pas de lettres | 334 |
| 1 point au plus ; le partiel en parts du point | 273, 274, 288 |
| La difficulté seule, sans temps ni points | 56, 304 |
| Les temps donnés par Paul, jamais devinés ; « ça ne rentre pas » | 58, 123, dette 185 |
| 45 minutes utiles, questions et correction | 58, dette 185 |
| Compétences du chapitre, une ou deux, trois questions au moins | 315, 317, 390 |
| Ce qu'elle vérifie, sans intitulé de compétence | 629 à 631, 636 à 638 |
| La longueur et « longueurAssumee » | 464 |
| La question bonus, fusible | 604, 328, capture 47 |
| « Corrige ton JSON » | 466, 481 |
| Le collage garde et vérifie tous ces champs | dette 201 |

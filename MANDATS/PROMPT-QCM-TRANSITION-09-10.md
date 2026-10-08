# Prompt de transition — adapter une évaluation QCM pour l'app d'aujourd'hui (7.7.1)
*Conscience n°12, 08/10/2026, tour 560 (cadrage QCM, points 101 à 103). Pour le QCM du 09/10, avant le nouveau prompt (qui s'écrira en dernier, point 62). Mode d'emploi : coller ce texte dans une IA, puis le JSON de l'évaluation (✏️ Modifier, le texte du haut) ; recoller le JSON rendu au même endroit, « 🔍 Vérifier le format » ; régler les durées données dans « ⚙️ Durées des niveaux » (visible une fois la séance lancée), « 💾 Sauvegarder », et le temps de réponse dans la case « ✋ Réponse ». Les durées des niveaux sont communes à toutes les évaluations.*

```
Tu vas vérifier et ajuster une évaluation QCM existante pour mon application, telle qu'elle fonctionne aujourd'hui. Je te colle son JSON à la fin.

COMMENT SE PASSE UNE SÉANCE (respecte-le dans tous tes calculs)
- Une séance dure 45 minutes utiles en tout : la phase des questions, puis la correction collective dans la foulée.
- Pour chaque question : 1) réflexion : l'élève voit l'énoncé seul (les choix sont cachés) et rédige sa réponse EN ENTIER, à la main, sur sa feuille ; 2) réponse : les choix apparaissent, l'élève pose son stylo, relit sa feuille et touche la ou les lettres.
- Le temps de réflexion dépend UNIQUEMENT du niveau de la question : il est le même pour toutes les questions d'un même niveau, et se règle entre 1 et 120 secondes par niveau.
- Le temps de réponse est le même pour toutes les questions de l'évaluation, entre 3 et 30 secondes.
- Le niveau donne aussi les points : facile 1, standard 2, approfondi 3, expert 4. Changer le niveau d'une question change donc ses points : ne le fais jamais sans me le demander.
- Entre deux questions, compte 15 secondes (je lance la suivante).
- Correction : compte 1 minute par question, sauf si je te donne un autre chiffre.
- Repère réel : dans mes séances de juin, une question a pris en classe entre 1 minute et 1 minute 30 (réflexion, réponse et temps ajoutés compris). Si ton calcul donne beaucoup moins, dis-le.

CE QUE TU FAIS, DANS CET ORDRE
1. Pose-moi d'abord ces questions et attends mes réponses : la classe (4e ou 3e) ; combien de minutes je garde pour l'installation et la consigne (par défaut 5) ; si 1 minute de correction par question me convient.
2. Pour chaque question, estime le temps qu'un élève de cette classe met à lire l'énoncé et à rédiger sa réponse complète à la main (base : 10 mots par minute en rédigeant, plus le temps de lecture). Donne-le dans un tableau : numéro, niveau, réponse attendue en quelques mots, temps estimé.
3. Pour chaque niveau, propose le temps de réflexion à régler : celui de la question la plus longue de ce niveau, arrondi aux 5 secondes au-dessus. Si une question dépasse 120 secondes, écris : « La question n ne rentre pas dans le temps de réflexion maximal », et propose de la scinder ou de la raccourcir.
4. Propose le temps de réponse : le temps de lire tous les choix de la question la plus chargée et de toucher les lettres (base : 2,5 mots par seconde en lecture, plus 2 secondes par lettre à toucher), arrondi aux 5 secondes au-dessus. S'il dépasse 30 secondes, écris : « La question n ne rentre pas dans le temps de réponse maximal », et propose de raccourcir ses choix.
5. Calcule le total : installation + somme des temps de réflexion de toutes les questions + (temps de réponse + 15 s) × nombre de questions + correction. Écris clairement « Ça rentre dans 45 minutes (total : … min) » ou « Ça ne rentre pas : il manque … minutes ».
6. Si ça ne rentre pas, propose une solution SANS l'appliquer : les questions à retirer (d'abord celles qui coûtent le plus de temps pour le moins de points), ou les choix à raccourcir. Attends mon accord.
7. Quand je t'ai répondu, rends-moi le JSON corrigé au même format exact que celui que je t'ai donné (titre, mode, questions avec enonce, choix, bonnes, niveau, explication), sans aucun autre champ, dans un seul bloc ; puis, en dessous, le récapitulatif : « Durées des niveaux : facile … s, standard … s, approfondi … s, expert … s. Temps de réponse : … s. Durée totale : … min. »

RÈGLES
- Ne change jamais un énoncé, un choix, une bonne réponse, un niveau ou une explication sans mon accord.
- Si tu raccourcis des choix (avec mon accord), garde exactement le même sens et la même bonne réponse, au même rang.
- Réponds en français simple.

Voici l'évaluation :
[colle ici le JSON]
```

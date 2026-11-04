# MANDAT B — CORRIGER APRÈS L'HEURE (C16 573, 581, 615, 616)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/b`, depuis le dernier commit de `nuit/c`.*

## 0 · CE QUE PAUL A DIT (ses mots)
- 13:07 : « après tes correctifs, je veux retrouver ma séance d'aujourd'hui avec son récit normal et que plus jamais ces cas n'arrivent. »
- 14:40 : « pourquoi tu dis qu'on ne peut pas changer après? pourquoi j'ai ça alors , dans la relecture? » (le bouton « ⚠ élève non identifié — à corriger »).
- C16 581 (non commenté, acquis) : « le bouton « à corriger » vaut aussi pour une réponse donnée au mauvais élève, et pour les réponses retrouvées dans les diapos. Tu y désignes l'élève avec la même case des initiales qu'en classe (lettres, liste numérotée, chiffre). »

## 1 · CE QUE TU FAIS
1. Dans la Relecture, la fenêtre « Qui a répondu » ne propose que les élèves de la classe relue (le mandat A a donné à la Relecture sa liste) ; on y désigne l'élève avec la case des initiales du mandat C (lettres, liste numérotée, chiffre).
2. Le bouton « à corriger » sert aussi pour une réponse donnée à un élève (changer d'élève) et pour les réponses retrouvées dans les diapos (571), pas seulement celles du journal sans élève.
3. La correction est gardée (comme aujourd'hui, au journal ou dans `C/recit`) ; le récit, « Ce qui s'est passé », le Papier et la participation la suivent ; rien n'est réécrit dans les diapos.

## 2 · LA SUPPOSITION (À VÉRIFIER)
`dr_corrigerReponse(j)` (dr-recit) part d'une entrée du journal `J[j]` (`data-j`), sans élève ; ses corrections `reponse-corrigee` (`quoi: 'eleve'`) sont relues au chargement (`S.recitCorr`) ; les réponses retrouvées dans les diapos (571 : `dr_repsDiapos`, `dr_JH`) ne sont pas dans `J`.

## 3 · LA PREUVE
Au faux hub, une heure close (comme celle des Franklin : une réponse donnée au premier MB, des réponses tapées pendant un gel, une réponse sans élève) : chaque cas corrigé par la case des initiales, compté ; la classe relue seule dans la fenêtre ; le récit, « Ce qui s'est passé », le Papier et la participation suivent ; rechargée, la Relecture garde les corrections ; le parcours vert.

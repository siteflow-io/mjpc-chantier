# QCM-3 · SOIR — le soir, et tout le reste de la maquette

*Conscience n°12, 12/10/2026, tour 672. Lis d'abord en entier `MANDATS/CODE-QCM/COMMUN.md` : il vaut pour toi en entier.*

Tu es **QCM-3 · SOIR**. Tu fais tout d'une traite, sans t'arrêter et sans rien demander, jusqu'à 06:30.

## Pour commencer

`git fetch origin`, `git checkout code-qcm`. Lis `COMMUN.md`, puis tes fichiers (COMMUN §1) et la maquette jouée scène par scène pour tout ce qui n'est pas l'heure. Tu n'attends pas QCM-1 : les noms de `SCN` et `ACT` sont dans le contrat (COMMUN §3.2).

## Ce que tu fais, dans l'ordre

1. **Le soir** : « Résultats » rangé par niveau et trié ; le tableau de chaque séance (y compris celles de la 7.7.1, avec ce qu'elles ont) ; la fiche d'un élève et son « 📝 Bilan » ; « À lire sur les feuilles » et « Que dit la feuille ? » ; le point d'autonomie retiré le soir ; le PDF de chaque séance, construit pour elle ; rendre ou masquer les copies, et « Mes évaluations » qui le suit chez l'élève ; la corbeille ; la sauvegarde, l'import et la purge.
2. **Le reste** : la liste des évaluations par niveau, « À compléter », l'éditeur (le chapitre, les compétences permises par le chapitre, « 🎯 Ce qu'elle vérifie », les deux temps, la difficulté, les choix, l'enregistrement dans `qcm/evaluations`), le collage du JSON et « Copier les erreurs pour l'instance de création d'éval », les réglages et le prompt ; la démo permanente ; la séance sur papier et sa grille ; le rattrapage ; le mode test, la même chose que le réel sur la classe de test.
3. **Les données** : ce que le soir lit vient de ce que l'heure écrit (COMMUN §3.1) ; les fonctions de `SCN` du soir (`resultat`, `aLireSeance`, `rendueAu`, `seancesAvant`, `passees`, `mesEvaluations`…) sont calculées par QCM-1 : si une te manque, tu la demandes dans `DEMANDES.md` et tu continues.
4. **Les mots de l'écran ne changent pas** ; tes retouches de style vont dans `src/qcm3.css`.

## Tes demandes et tes défauts

À chaque `git pull`, tu lis `DEMANDES.md` et `DEFAUTS-OUVERTS.md` (QCM-4) : ce qui porte ton nom passe avant ton travail en cours.

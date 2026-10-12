# QCM-2 · HEURE — les écrans de l'heure, sur tous les appareils

*Conscience n°12, 12/10/2026, tour 672. Lis d'abord en entier `MANDATS/CODE-QCM/COMMUN.md` : il vaut pour toi en entier.*

Tu es **QCM-2 · HEURE**. Tu fais tout d'une traite, sans t'arrêter et sans rien demander, jusqu'à 06:30.

## Pour commencer

`git fetch origin`, `git checkout code-qcm`. Lis `COMMUN.md`, puis tes fichiers (COMMUN §1) et la maquette jouée scène par scène pour l'heure, de « 🚀 Lancer la séance » à « 🏁 Afficher leur bilan aux élèves » : la console, les tablettes, le téléphone, le tableau. Tu n'attends pas QCM-1 : les noms de `SCN`, `ACT` et `ELV` sont dans le contrat (COMMUN §3.2), et il les pousse dans sa première heure.

## Ce que tu fais

1. **Chaque écran de l'heure lit la séance réelle** : partout où la maquette écrit pour son scénario (Julien et Michel, la tablette 1, 3 questions, 24 présents, les tables `RT`, `LU`, `LU_JM`, `TABL`, `ESTIM`, `CO`, `DIT_B`, `ORD`…), tu appelles la fonction de `SCN` qui donne la même chose pour n'importe quel élève, n'importe quelle tablette, n'importe quel nombre de questions. Les scènes propres à un élève (`c-autonomie-michel`, `x610-autonomie-julien`…) deviennent un seul écran, rempli d'après l'élève cliqué.
2. **Chaque geste de l'heure agit** : il appelle l'action de `ACT` ou `ELV` que donne `src/live/gestes.json` (QCM-1) ; s'il en manque une, tu la demandes à QCM-1 dans `DEMANDES.md`, et tu continues sur le reste.
3. **Dans l'ordre** : l'appel et les binômes, l'entrée sur la tablette partagée, la première attestation ; les questions (réflexion, passage, deux tours, B, les temps en direct, écarter, annuler, rouvrir, départ et retour, déplacer) ; l'estimation, la seconde attestation ; la correction (la lecture de la feuille du voisin, « Révéler » fermé tant qu'un présent n'a pas lu, « Trouvée au dernier moment », le point d'autonomie) ; la co-évaluation et son alerte ; le bilan de chacun et le bilan de classe ; finir à une autre heure, reprendre, terminer.
4. **Les mots de l'écran ne changent pas** ; tes retouches de style vont dans `src/qcm2.css`.

## Tes demandes et tes défauts

À chaque `git pull`, tu lis `DEMANDES.md` et `DEFAUTS-OUVERTS.md` (QCM-4) : ce qui porte ton nom passe avant ton travail en cours.

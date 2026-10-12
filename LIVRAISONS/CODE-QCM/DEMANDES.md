# Demandes entre exécutants (la plus récente en tête)

Format : `[QCM-n → QCM-m] ce qu'il faut, pourquoi` — le propriétaire la traite avant son travail en cours, puis écrit `✔` devant.

[Conscience n°12 → tous, 12/10 14:45] L'app en ligne est la 7.7.2 depuis 14:44 (md5 `3aaf749929863d69e30a36f7bc4ad355`) : la 7.7.1 réparée de deux lignes (`EleveCorrection` l. 4365, `VuePhone` l. 5437). Tout ce que les mandats demandent de lire dans la 7.7.1 est inchangé ; la 7.7.1 elle-même reste au commit `2287da6` de la production.

[Conscience n°12 → tous, 12/10 14:31] Le contrat est corrigé sur `main` (`git merge origin/main`) : COMMUN §3.1, les libellés élève des compétences sont le champ `libelleEleve` de chaque item de `taxonomie/competences` (trouvé par son `id`, jamais par sa place), pas `taxonomie/competences/<code>/libelleEleve` ; l'identifiant d'un chapitre est `<niveau>-ch<n>` (demain : `4e-ch1`, un chapitre sans fiche au hub, qui doit pouvoir se lancer). Les contrôles de l'app ont changé en conséquence (nouvelles empreintes).


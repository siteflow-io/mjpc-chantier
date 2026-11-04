# MANDAT D — LA RELECTURE : LA DIAPO EN GRAND ; « COPIER LA RELECTURE POUR ANALYSE IA » (C16 582, 583, 588, 591)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/d`, depuis le dernier commit de `nuit/b`.*

## 0 · CE QUE PAUL A DIT (ses mots)
- 14:40 : « cette relecture: dans la colonne de gauche je vois bien la copie de classe, mais elle ne peut pas s'afficher comme le pilote. je suis obligé d'utiliser la poignée pour zoomer sur les diapos et distinguer ce qui y est écrit. enfin, il me faudrait un bouton en bas pour copier l'ensemble de la relecture. ça me permettrait de pouvoir l'exporter (comme quand on discute par exemple). l'infobulle de ce bouton doit dire explictement ça: "copier la relecture pour analyse IA". »
- 14:54 : « pour ta proposition oui pour les diapos » (C16 582 : « un clic sur une diapo l'affiche en grand, comme au pilotage, lisible sans la poignée »).
- 14:59 : « le bouton doit en fait contenir suffisamment d'informations pour l'IA pour éviter de trop consommer de tokens par une mesure d'exécutants, et afin de pouvoir débugger plus vite. »
- C16 588 et 591 (non commentés, acquis) : le texte des diapos jouées (titre, consigne, questions, ce qui y a été écrit, les réponses avec le prénom), pas leurs images ; une seconde partie pour chercher une panne : la version du site, la classe, l'heure et ses heures réelles, le journal de l'heure geste par geste (les initiales tapées et l'élève trouvé), les réponses rangées dans les diapos avec leur heure, les participations rangées avec l'heure, les initiales de chaque élève de la liste ; les élèves par leur prénom et l'initiale du nom.

## 1 · CE QUE TU FAIS
1. Un clic sur une diapo de la colonne de gauche de la Relecture l'affiche en grand, lisible comme au pilotage ; Échap ou un clic la referme.
2. En bas de la Relecture, un bouton dont l'infobulle dit, mot pour mot : « copier la relecture pour analyse IA » ; il copie dans le presse-papiers, en texte, tout ce que dit C16 588 et 591, pour la classe et l'heure relues (tous les onglets).

## 2 · LA SUPPOSITION (À VÉRIFIER)
La Relecture : `relecture()`, `recitHtml0`, `passeHtml`, `recitSeanceHtml`, `chapitreHtml` (dr-recit) ; la colonne de gauche : la copie de classe en vignettes ; le presse-papiers : `navigator.clipboard.writeText` (avec un repli si refusé, dit à l'écran).

## 3 · LA PREUVE
Par le geste : un clic sur une vignette l'ouvre en grand (taille mesurée), Échap la ferme ; le bouton : son infobulle exacte ; le texte copié lu dans la page (compté : chaque partie de 588 et 591 présente ; aucun nom de famille entier) ; le parcours vert.

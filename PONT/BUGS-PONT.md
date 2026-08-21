# Entrées à reporter au registre des bugs (docs/MJPC6-registre-bugs.md) — conscience n°8, 21/08/2026

1. **Le « neuf » éternel des blocs visuels** (deroule86, corrigé en 87) : schémas/images
   jamais projetables une fois insérés en direct ; le drapeau se gravait dans les trames.
   Découvert depuis la vidéo de Paul (« défauts d'affichage » lors de l'insertion d'un schéma).

2. **Ids fantômes `bgras`/`bsoul`** (deroule86, corrigé en 88) : `outilsDuRegime` masquait
   des ids inexistants → G/S restaient affichés, inertes, sur les écrans visuels
   (« incohérence des boutons » vue par Paul).

3. **Filet « suite vide » : trois faux positifs** (deroule86, corrigé en 89) : `lire()`
   tuait `neuf` par simple existence du champ ; `scinde()` perdait `neuf` au report ;
   la vacuité ignorait `src`/`ref`. La boîte native surgissait au moment d'ajouter un bloc.

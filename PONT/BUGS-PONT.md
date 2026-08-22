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

## Session d essais de Paul — 22/08 après-midi (trois défauts instruits)
5. **Copie de classe jamais mise à jour au fil de l eau** (défaut produit, CORRIGÉ) :
   atDrEnrAuto protège la préparation mais rien n écrivait deroule_joue pendant le
   cours — les réponses des élèves mouraient avec le cadre. Désormais chaque sauve()
   en classe pousse la copie (débounce 900 ms) vers deroule_joue/<classe>/ecrans.
   PROUVÉ : réponse persistée dans la copie après le geste.
6. **Relecture/Papier perdus après la clôture** (EN COURS) : 14e/15e adaptations
   posées — la clôture mémorise la séance jouée (AT_DR_DERNIER), et Relecture/Papier
   rechargent LA COPIE JOUÉE (invalidation du jeton au changement de source, prouvé :
   la préparation revient intacte au retour). CLOS (22/08 soir) : le récit filtre par REV (dévoilement) — les copies d avant
   la copie-au-fil-de-l eau stockaient rev:0, d où le récit vide. Avec la copie
   au fil de l eau, la chaîne entière marche SANS pièce nouvelle. PROUVÉ de bout
   en bout : dévoiler + répondre → clore → Relecture = récit complet (« la
   consigne était… », « ouate » cité).
7. **Écrans dupliqués « Regard » 10:24/10:24** (INSTRUIT, correctif à faire) :
   c est scinde() — la scission au zoom (« rien n est jamais refusé : on coupe »),
   artifice de PROJECTION qui fuit dans la persistance : la copie/les minis/les
   heures montrent les fragments (frag), la refusion n advient qu au dézoom.
   CORRIGÉ (22/08 soir) : refusion à l export, CÔTÉ PONT (dr_exporterTrame de l adaptateur,
   aucun moteur 96 nécessaire). Prouvé sur scission réelle du moteur : la projection
   garde ses 2 morceaux (12+0 min), l export rend 1 écran (dur 12, réponses recombinées,
   résidus grp/suite/frag nettoyés), la colonne MJPC montre UNE mini.

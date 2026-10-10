# En-têtes « À CODER » : la tablette partagée en deux et les binômes (Paul, 10/10/2026)

*Conscience n°12, tour 623 du cadrage QCM (points 593 à 598 de `MANDATS/CADRAGE-QCM.md`).*

**La demande de Paul (10/10, 07:59).** « vu que c'est du prévu et que ça ne va pas être codé dans la foulée ici (sauf pour mjpc et qcm), je ne veux pas que ça se perde dans la masse des données sur github. à inscrire en entête du code de chaque app (à terme, elles partageront toutes leur écran en deux). »

**Ce qui est fait.** Un bloc « À CODER — Fonctionnalités prévues pour des sessions futures », dans la forme de celui qui existait déjà en tête de `reecriture.html`, est écrit juste après `<!DOCTYPE html>` dans 11 apps de la production : Console_ateliers_revisions, analyse_logique, applause_meter, correction_dictee, dictee_universelle, etude_dugain, pilotage_debat_s3, redaction_dugain_v3, reecriture (point 2 ajouté à son bloc), reecriture_bb4e, worktrack. Pas dans deploy-monitor (outil de déploiement), ni dans index.html et evaluation-qcm.html (codés par le mandat). Vérifié dans Chromium : les 11 pages restent en mode standard, avec leur titre ; seul le commentaire de tête change (275 lignes ajoutées, aucune retirée).

**Où.** Le commit est dans la copie locale de la production (`EN-TETES - a coder : la tablette partagee en deux…`), pas encore poussé : l'écriture en production est refusée depuis le 08/10. Le même changement, prêt à appliquer : [en-tetes-11-apps.patch](en-tetes-11-apps.patch) (`git am` sur la production à jour du 08/10, `7063a88`). Il partira en production avec un jeton qui écrit, avant le lancement du mandat.

**Le texte du bloc (version générale).**

```
 1. LA TABLETTE PARTAGÉE EN DEUX, ET LES BINÔMES (Paul, 10/10/2026)
    À terme, toutes les apps MJPC partagent l'écran de la tablette en deux :
    deux élèves par tablette, une moitié chacun.
    À faire dans cette app, exactement comme dans correction_dictee.html et
    evaluation-qcm.html :
    - la console reçoit la vue des tablettes et la connexion à deux
      (« Combien êtes-vous sur cette tablette ? », le code de l'élève, puis
      l'autre moitié nomme son binôme, qui entre son code à son tour) ;
    - la console forme les binômes : d'abord la règle d'exclusion de MJPC
      (deux élèves exclus l'un de l'autre ne sont jamais ensemble, et aucun
      élève ne voit jamais de message à ce sujet), puis les règles d'entraide
      propres à cette app, que Paul définira.
    Les exclusions se règlent dans la console MJPC (fiche de la classe,
    « 🚫 Jamais avec… », au plus 3 exclusions par élève) et se lisent par le
    socle MJPC (MJPC-CORE).
    Règles d'entraide de cette app : à définir par Paul.
    Référence : cadrage du QCM au sas (MANDATS/CADRAGE-QCM.md), points 585 à 597.
```

Correction de dictée et dictée universelle ont une phrase en plus, sur ce qui existe déjà chez elles (voir le patch).

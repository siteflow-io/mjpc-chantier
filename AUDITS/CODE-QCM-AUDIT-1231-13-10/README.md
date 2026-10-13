# Contrôle de la conscience n°12 — 13/10/2026 12:31, sur la reprise 5 du code du QCM

*Tour 699, réveil programmé de 12:31 (pas de Paul). App de QCM-4 : `code-qcm` à `7228ab2` (tout ce qui était poussé à 12:22), md5 `b6b494034114f7b3e6db32920b8d752f`. Verdict de QCM-4 : `503bcc17`, complété par `971cd326`.*

## Verdict : ça ne va pas ; rien n'est mis en ligne, Paul fait cours à 13:00 avec la 7.7.2

La 7.7.2 est vérifiée en ligne à 12:32, md5 `3aaf749929863d69e30a36f7bc4ad355`.

Deux défauts restent ouverts :

1. « ONT RÉPONDU » au 1er tour : la console et le téléphone comptent sur 24, alors que la maquette compte les 12 élèves qui ont la main (`c-q1-tour1`, `p-reponse`). C'est le verdict de QCM-4 de 12:30, `banc-reprise5.js`, 2 échecs sur 8.
2. La garde d'une alerte tranchée annonce une note fausse : « sa note provisoire passe à 1 / 3 » pour un bilan à 3 / 3. QCM-3 l'a trouvé à 12:13 (`8e4bd28f`, `banc/relecteurs/R10/reprise5/trouvee/`). La conscience a vérifié dans le code : `noteTxt` dans `AlerteTrancheeH` (`c3-corr.js`) n'a pas changé entre `8e4bd28f` et `971cd326`. Ce défaut n'est pas dans le VERDICT de 12:30.

Corrigé et rejoué par le geste, selon QCM-4 :
- le téléphone pendant l'appel ;
- « 🚀 Lancer la séance » de la carte ;
- le tableau au 1er tour ;
- « 1 réponse enregistrée » ;
- `banc-reprise2.js` 22/22, rejoué à 12:30.

Selon QCM-2 (`4e7ba4d1`) : « pensent », « d'ABRIAL », « la mieux réussie » seulement si elle diffère.

Les contrôles de la conscience et la sonde B n'ont pas été repassés : le verdict ne pouvait plus changer avant 13:00. QCM-4 donne 32/32 pour les contrôles sur cette app.

# Les contrôles de la conscience n°12 pour l'app QCM codée d'après la maquette

*Écrits le 12/10/2026 (tour 670), pour le mandat de code (https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/MANDAT-CODE-QCM.md, §5.3), selon le protocole de l'audit : https://github.com/siteflow-io/mjpc-chantier/blob/main/PROTOCOLE-AUDIT-12-10.md*

## Ce qu'ils vérifient, par le geste, dans cinq pages à la fois sur le faux hub

- K1 : « 🚀 Lancer la séance » (classe 3 ESSAI, évaluation d'essai complète, `attendus/evaluation-essai.json`) écrit une séance active dans la base.
- K2 : une tablette ouverte après le lancement demande « Combien êtes-vous sur cette tablette ? » ; « 👥 2 élèves » la partage en deux moitiés, chacune « 👋 Identifie-toi ».
- K3 : l'entrée par le vrai code (son empreinte au hub), au clavier de l'app ; chaque élève entré se voit sur la console sans rechargement ; un code faux dit « Ce code ne correspond pas. Vérifie tes 4 chiffres. »
- K4 : la première attestation, une coche par ligne, puis « Je commence » ; la console le montre.
- K5 : « ▶️ Lancer Q1 » met l'énoncé sur les deux moitiés, au tableau et au téléphone, sans rechargement.
- K6 : au 1er tour, une moitié répond ; sa réponse se voit sur la console ; un champ de la console garde sa valeur et le curseur pendant ce temps (règle du 04/10).
- K7 : « ⏭️ Tour suivant », l'autre moitié répond ; « 🔒 Clore la question ».
- K8 : les réponses des deux élèves sont dans la base, sous la séance.
- K10 : les questions 2 et 3, chacune à ses deux tours, avec B, puis closes.
- K11 : l'estimation, la seconde attestation, puis la correction, qui commence par la question la plus ratée (Q2).
- K12 : « 💡 Révéler » fermé tant qu'une feuille n'est pas lue, ouvert quand toutes le sont ; après, la bonne réponse sur les deux moitiés ; « Trouvée au dernier moment » pour la feuille fausse et la tablette juste, et pour elle seule.
- K13 : la co-évaluation, puis « 🏁 Afficher leur bilan aux élèves ».
- K14 : les notes, d'après la règle : Julien 3 / 3, son voisin 1 / 3 ; aucun code de compétence dans le bilan de l'élève.
- K15 : la base garde les lectures, la question trouvée et le bilan affiché (contrat, COMMUN §3.1).
- K9 : aucune erreur de page ni boîte système dans les cinq pages.

Les attendus viennent de la maquette validée (ses libellés, ses règles) et de la base elle-même, jamais de l'app contrôlée.

## Comment les passer

`APP_FILE=<evaluation-qcm.staging.html> BANC=AUDITS/QCM-MODE-TEST-09-10/banc node AUDITS/CONTROLES-QCM-APP/controles-app.js sortie.txt` (après `npm install` dans `BANC`). Code de sortie 1 si un seul contrôle échoue. Durée mesurée de K1 à K9 : 97 s (K10 à K15 ajoutés au tour 672, pas encore mesurables : l'app n'existe pas encore).

## Éprouvés

Sur la version en ligne (7.7.1), servie par le faux hub (`sorties/controles-app-sur-7.7.1.txt`) : les cinq pages s'ouvrent, aucune erreur de page, et les contrôles échouent là où la 7.7.1 n'a pas encore ce que la maquette lui ajoute (le lancement de la maquette, la tablette partagée, les deux tours) : 16 vérifications, 14 échecs.

`EMPREINTES.md5` : les md5 de ces fichiers ; l'exécutant ne les modifie pas.

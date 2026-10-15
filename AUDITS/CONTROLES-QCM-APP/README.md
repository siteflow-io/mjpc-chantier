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
- K11 : l'estimation, la seconde attestation ; la correction ne commence pas seule (Paul, 13/10 07:22) ; « ▶️ Commencer la correction » est ouvert quand les élèves sont prêts ; à son clic, la correction commence par la question la plus ratée (Q2).
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

**Changé le 12/10 à 14:30 (tour 673), avant le premier commit des exécutants sur `code-qcm`** : l'évaluation d'essai porte `"chapitre": "3e-ch1"` (l'identifiant de la maquette ; c'était `3e-1`), et le faux hub reçoit `taxonomie/competences` du vrai hub, avec les 28 libellés élève (`attendus/taxonomie-competences.json`), pour que l'app y trouve les compétences de l'évaluation (COMMUN §3.1, corrigé le même jour).

**Corrigé le 12/10 à 19:05 (tour 677) : deux fautes de la conscience dans K6, et non de l'app.** (1) Le choix était cliqué 0,8 s après « ✋ Autoriser la réponse », alors que la maquette fait d'abord le passage (« POSE TON STYLO », son décompte) : K6 et K7 attendent maintenant, 10 s au plus, qu'une moitié ait ses choix cliquables, comme K10. (2) Le champ était rempli avant le clic de la console sur « ✋ Autoriser la réponse », qui prend lui-même le focus : la vérification ne pouvait jamais passer ; le champ est maintenant pris sur l'écran du 1er tour, puis la tablette répond. Et « la réponse se voit sur ta console » se lit maintenant au compteur « n / N ont répondu » (en capitales ou non), qui doit augmenter : avant, n'importe quel changement de texte, un chrono par exemple, suffisait. Sur l'app assemblée de `code-qcm` à 18:48 (`b18e91e5`) : avant la correction, 30 vérifications, 2 échecs (les deux fautes) ; après, 30 vérifications, 0 échec, 107 s.

**Corrigé le 13/10 à 10:05 (tour 693) : K11, une faute de la conscience, et non de l'app.** Paul, 13/10 à 07:22 : « Non c'est moi qui lance la correction. Jamais de sessions de groupe lancées automatiquement. » K11 attendait encore, comme la maquette, que la correction commence seule ; depuis 08:00, il échouait, et avec lui K12 à K15, sur toutes les livraisons (QCM-4 le disait dans ses verdicts de 08:30, 08:58 et 09:58). La correction n'a été faite qu'à 10:05. K11 vérifie maintenant trois choses : rien ne part seul pendant 3 s une fois les deux élèves prêts ; « ▶️ Commencer la correction » est ouvert ; à son clic, la correction commence par Q2. Sur l'app de la reprise 3 (`f95030b`, md5 `011ae89f…`) : 32 vérifications, 0 échec, 109 s (`sorties/controles-app-sur-f95030b-1005.txt`). Nouveau md5 de `controles-app.js` : `1f1ac0d8ca288d796d98b115bd461484` (`EMPREINTES.md5`).

**Changé le 15/10 à 11:05 (contrôle de la reprise 7) : K2 et K3, pour la nouvelle entrée des élèves, décidée par Paul (15/10, 08:52 et 09:19 : la tablette ne demande jamais la classe, et « Combien êtes-vous sur cette tablette ? » disparaît ; l'élève est identifié une fois, par MJPC ou par son code, et son binôme vient de la grille).** K2 vérifie que la tablette ouvre « 👋 Identifie-toi » sans demander la classe ni « Combien êtes-vous », puis, Julien entré, que l'autre moitié est son binôme (« Ton binôme : … ») ; K3 fait entrer le binôme par son seul code, et vérifie les deux moitiés à « Avant de commencer » ; le code faux reste. Éprouvé sur `code-qcm` à `2f115da9` (md5 `38093c92…`) : 32 / 32, 111 s. Les deux sondes de la conscience (la sonde B, la sonde de l'œil) suivent la même entrée : 17 / 17 et 4 / 4.

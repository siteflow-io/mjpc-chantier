# Lancer le banc complet des scans avec GitHub

## Objet
Solution demandée par Paul à C15 : exécuter le banc malgré l'absence de Chromium et l'échec du téléchargement dans l'atelier local.

Le banc existant reste unique et inchangé. Le fichier .github/workflows/mjpc-banc-scans.yml prépare une machine standard ubuntu-24.04, vérifie les sources, installe les dépendances précises, puis lance tout le banc.

## Référence éprouvée
- Banc : MANDATS/REDACTION-UNIVERSELLE/maquette/banc/banc.mjs, blob 6edec4937325512999c4b5f72c31f142b6271ad0.
- Maquette : T399-maquette-redaction-scans-v14.html, blob c7fb23f32a9280c528f5b1f91229cd945d9f0102.
- PDF d'essai : paquet-essai.pdf, blob 9b4ec27e91a0e6586300945759fb1fa3835a6827.
- PDF à repères : paquet-reperes.pdf, blob 8a33a028ac1147a07334851ea1cbd96861fde264.
- Dépendances : Playwright 1.56.1 et son Chromium, pdfjs-dist 3.11.174.

Ces fichiers sont contrôlés par leur empreinte Git avant le lancement. Une différence interrompt le job.

## Mesures C15 du 30/10/2026
Première exécution 41133185881, commit 7cf72b6a4ff337a822aad6dbf996a69565e4ba02 : succès de toutes les étapes.

Deuxième exécution 41133740714, commit b3f520f48bbf3ddece1f8177ea5c3832dee9922f : jobs terminés avec succès ; nom du job de résultat lu à 22:51 : « BANC : 49 vérifications, 0 défaut - 17 captures ». Les 17 PNG sont produits ; ils ne sont pas encore regardés par C15. Aucun nouveau code fonctionnel ni promotion.

## Relancer et lire
Dans le sas, ouvrir Actions, puis « MJPC - banc complet des scans ». Une fois le fichier de lancement présent sur main, « Run workflow » lance la référence sur la branche choisie. « Re-run all jobs » rejoue une exécution existante sur son commit exact.

Le job scans prépare la machine et joue le banc. Le second job porte dans son nom le verdict réellement écrit par le banc, ainsi que le nombre de captures produites. Une panne avant la fin ne peut pas être présentée comme un banc vert : le job de résultat exige aussi le succès de scans.

Le résumé du job contient la sortie du banc. Les PNG sont archivés dans le journal de la dernière étape, entre les repères MJPC_CAPTURES_ZIP_BEGIN et MJPC_CAPTURES_ZIP_END. Les lignes MJPC_CAPTURES_ZIP_DATA contiennent le ZIP encodé ; le début donne sa taille et son SHA-256. Ce choix évite un stockage d'artefact facturable. Il ne remplace pas la lecture des captures avant toute livraison d'images.

La lecture des journaux par le connecteur a échoué deux fois avec « Transport closed » au premier essai. Le verdict et le nombre de PNG restent lisibles dans les métadonnées des jobs. Leurs noms ne prouvent pas que les captures ont été regardées.

## Nouvelle intervention
Le lancement actuel ne teste que la référence v14 ci-dessus. Son succès ne valide aucune fonction future de recopie ou de bande.

Pour éprouver une nouvelle maquette, l'exécutant doit construire le vrai fichier modifié sur le faux hub, ajouter les épreuves nécessaires au banc unique, puis changer explicitement le nom de la maquette et les empreintes attendues dans le fichier de lancement. Il doit relire ce périmètre avant d'exécuter. Ne jamais garder la v14 comme cible et annoncer que la nouveauté est testée.

L'exécutant relit aussi le mandat complet, le registre et les transcripts jusqu'au dernier tour ; il signale les erreurs de la conscience avant de coder.

## Limites et règles conservées
Ce dispositif ne met aucune app en ligne et n'écrit pas à Firebase. Les copies d'essai sont inventées. Il n'emploie aucun secret, ses droits sur le dépôt sont en lecture seule, il n'utilise ni cache ni stockage d'artefact.

La machine standard de GitHub est gratuite pour un dépôt public, selon sa documentation de facturation vérifiée le 30/10/2026. La durée est bornée à 15 minutes pour scans et une minute pour la restitution.

L'ouverture du site de production n'a atteint que l'entrée professeur dans l'atelier C15. Jouer l'existant et regarder les captures restent nécessaires avant codage ou promotion selon le mandat. Aucun « promeus » n'est acquis par cette solution.

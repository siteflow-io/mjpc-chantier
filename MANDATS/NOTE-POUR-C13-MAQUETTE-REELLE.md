# Note de la conscience n°12 à la conscience n°13 — une maquette est l'existant réel (13/10/2026, 08:53)

*Sur l'ordre de Paul (13/10, 08:52 : « oui rédige lui une note »).*

## 1. La règle de Paul, pour tous les chantiers

Paul, 13/10, 08:47, mot pour mot : « En fait la base de tout c'est la maquette. Une maquette doit TOUJOURS reproduire EXACTEMENT l'existant REEL, JAMAIS JAMAIS être une démo bananière. Inscris ça en règle pour l'ensemble des futurs chantiers. Par exemple, déroulé.html, je ne sais pas s'il n'y a pas une dérive en ce sens justement. »

Elle est inscrite en tête du protocole des maquettes, au §00, qui prime sur tout le reste et remplace les passages contraires (§0 « il y branche ce qu'elle simule », §2 « un fichier HTML autonome, sans réseau », §6 « il porte le gabarit dans le site, branche ce que la maquette simule », et, dans la règle du 03/10, « une reproduction fidèle de l'écran voisin ») : https://github.com/siteflow-io/monsieurjaipascompris/blob/main/PROTOCOLE-MAQUETTE.md

En bref : une maquette est le fichier de production lui-même, servi sur un faux hub (une copie anonymisée de la vraie base) ; la nouveauté s'écrit dans ce code, à l'endroit où elle vivra ; jamais de scénario écrit d'avance, jamais d'écran redessiné à côté ; validée par Paul, elle est le code à promouvoir, que le mandat finit et prouve, sans le rebrancher.

## 2. Pourquoi, ce matin

La maquette complète du QCM (C12) était écrite pour elle-même, sur un scénario figé. Il a fallu la rebrancher sur la vraie séance en une nuit, à quatre exécutants ; tous les défauts trouvés le matin par les relecteurs étaient dans ce qu'elle ne jouait pas (un élève qui n'entre pas, une console rechargée, rouvrir pour un seul élève), et l'app n'a pas pu être mise en ligne à temps. Le compte rendu : https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/CODE-QCM-AUDIT-0630-13-10/README.md

## 3. Ce que C12 a mesuré sur le déroulé (lecture seule, 13/10, 08:48)

La maquette de la livraison p8-5g (`LIVRAISONS/DEROULE/p8-5g/maquette-pilotage-ordi-v9c15p8-manipulable.html`, branche `deroule/p8-5g`, 605 996 o, titre « Maquette v9c — la séance sur deux heures ») est une page à part, et non le site : elle ne contient ni `sesOuvrirTableau`, ni `edtOuvrir`, ni `mjpcEcrireRest`, ni `FIREBASE_BASE`, ni aucun accès à une base ; seul le moteur `AT_DR_B64` du site y est repris. `index.html` de la production en fait 1 838 175 o. C'est la même dérive que la maquette du QCM.

## 4. Ce que Paul attend

Que tu appliques le §00 au déroulé : mesurer ce qui, dans ta maquette, n'est pas le site réel ; proposer à Paul comment la refaire à partir d'`index.html` sur un faux hub ; ne pas lancer de nouvelle maquette du déroulé qui ne parte pas du fichier réel. L'exécutant en cours (p8-5h) finit sa livraison (règle du 05/10 : un exécutant n'arrête jamais en plein mandat) ; la suite se décide avec Paul.

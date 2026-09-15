# PROTOCOLE MAQUETTE
*Écrit le 15/09/2026 par la conscience n°12, sur l'ordre de Paul : « le protocole que tu viens d'énoncer doit être noté noir sur blanc sur GitHub, à la racine du repo. Dès qu'une conscience dit travailler sur une maquette, elle a ainsi le protocole à suivre directement. » Né des maquettes v1 à v9b.6 du chantier « déroulé sur base saine » (transcript C12, tours 7 à 110) et des pièges du registre. Il complète le protocole conscience (préférences de Paul) ; il ne le remplace pas.*

## 0 · À quoi sert une maquette
- Une maquette sert à **cadrer** (Paul voit avant de trancher) et à **valider geste par geste** ce que le site devra faire. Elle est **HTML, manipulable, activable geste par geste** — « sinon c'est juste des png ».
- **Ce qui est codé ensuite est fidèle, geste par geste, à ce que Paul a joué dans la maquette validée** (Paul, 08/09 : « ce n'est pas un piochage au jugé, sinon aucun intérêt »). Les bancs du mandat rejouent les gestes de la maquette.
- **La maquette devient le noyau du mandat** : l'exécutant part de son gabarit, pas d'une page blanche ; il y branche ce qu'elle simule (hub, session, emploi du temps, sécurité, mode test, fichiers réels) et prouve, avec les mêmes bancs, que le site fait ce que la maquette fait. Réécrire « en s'inspirant » est le piège de la traduction.

## 1 · Avant de maquetter
1. **Lire et jouer l'existant** (le site de production, dans un navigateur, sur des données réelles, avec des images réelles) — pas seulement lire le code. Une conscience qui n'a pas visualisé l'existant maquette dans le vide (C12, tour 80).
2. **Lire les cadrages** du chantier ; ne rien maquetter qui n'est pas cadré ; ne rien combler seul (source de télescopage et de dette) — poser la question, une à la fois.
3. **Lire les pièges** : le registre des dettes (`docs/MJPC6-DETTES.md`) et le journal (`docs/MJPC6-journal.md`) — et les lire comme des gestes, pas comme des mots : chaque piège se rejoue contre la maquette.
4. **Avoir la vision de Paul** : dire pour qui le mécanisme existe et quel geste de classe il sert, dans ses mots.

## 2 · Ce qu'est une maquette
- **Un fichier HTML autonome**, sans réseau, **sans aucune écriture** (aucun `fetch`, aucun stockage) : elle ne lit rien ni n'écrit rien au hub. Les données réelles y entrent **par un générateur** (la trame, les élèves, la taxonomie en lecture), pas par la main.
- **Les mots de Paul** partout ; **aucun code** à l'écran (jamais `litt-036`), **aucun mot de plomberie** (eid, json, hub, DOM…), **aucune phrase méta** — la seule exception est un écran de réglages de simulation, nommé comme tel, derrière un bouton ⚙, qui n'existera pas dans le site.
- **Chaque geste porte son infobulle**, écrite pour Paul : ce que le geste fait et ce qu'il coûte.
- **Aucune boîte système** (`alert`, `prompt`, `confirm`) : une fenêtre du site, Entrée garde, Échap passe.
- **Aucun bouton inerte** : un bouton fait ce qu'il dit, ou il est grisé avec la raison. Un bouton mort qui passe pour vrai est un faux vert.
- **Un nom et une version par livraison** (`Txx-maquette-…-vN…html`), le md5 dans le transcript ; deux fichiers différents ne portent jamais le même nom ; le générateur n'écrit jamais sur un fichier déjà livré.
- **Ce qu'elle simule est déclaré** dans la livraison (une vidéo sans fichier, une garde sans ses attendus, un tableau par injection) — jamais présenté comme fait.

## 3 · Les règles techniques apprises (chacune est un piège déjà payé)
- **Pas de reconstruction au clic** : le pilotage met à jour ce qui change, nœud par nœud ; il ne refait jamais l'écran (l'image qui saute, le défilement perdu, la vignette agrandie qui se referme, la poignée qui revient en mini). Le champ où Paul écrit n'est jamais touché par un rendu.
- **Le texte n'est jamais coupé**, la donnée jamais modifiée par l'affichage : la police du bloc se réduit, puis des pages ; jamais de scission de diapo.
- **Le rang n'est pas une identité** : tout ce qui s'enregistre porte l'identité de la diapo et du bloc ; déplacer ne change pas l'identité, dupliquer ou coller en crée une.
- **Les caractères français** : accents dans les recherches (« ze » trouve Zélia), apostrophes typographiques, guillemets « », l'espace avant « : ; ? ! ».
- **Échap ferme une fenêtre à la fois**, jamais un écran de décision, et n'annule aucune décision.
- **Aucun chevauchement entre couches** (étiquette, pastille, légende, encart, bandeau, numéro de page) — mesuré avec tout allumé, sur le pilote et sur le tableau.
- **Le moteur existant est repris tel quel** quand le cadrage le dit (le récit de l'ancien déroulé : extrait du fichier, injecté sans modification, greffes à côté) — pas réécrit « à sa manière ».
- **Le tableau reçoit un état**, jamais des gestes ; ce qui va aux élèves ne porte ni codes ni raisons techniques.
- **`scrollIntoView` est banni** ; `focus()` ne fait pas défiler.

## 4 · Les preuves, avant toute livraison
- **Un banc par le geste** : clic, clavier, souris — jamais un appel de fonction par script (« appel de fonction : déclaré » est une alerte) ; jamais un `dialog.accept` global.
- **Un banc unique** qui rejoue tout d'une commande et échoue si un seul geste échoue ; **les tailles d'écran** (au moins 1366 × 768 et 1920 × 1080, l'écran de décision à 1280 × 720) ; **tous les types d'objets** (consigne, question, image avec une image réelle, fiche, schéma, vidéo, deux blocs) ; **l'épreuve des pièges** (réseau, méta, codes, Échap, chevauchements, reconstruction, faux verts, identités, caractères, chiffres recomptés).
- **Une preuve dit ce qu'elle contient** : « 40 vérifications » est recompté dans le fichier ; une mesure à zéro n'est pas une absence.
- **Une capture n'est livrée que regardée**, pour ce qu'elle prouve — pas pour ce qu'elle montre. Une capture illisible seule est accompagnée de son pendant.
- **0 défaut** aux bancs avant livraison ; **les défauts trouvés et corrigés sont listés** dans la livraison, avec leur cause.

## 5 · La livraison
- Au sas, en pièces du transcript : la maquette (nom versionné), le gabarit, le générateur, les bancs, les captures regardées ; le transcript mis à jour ; les docs de suivi (registre, journal, « Où trouver quoi ») **avant** la livraison.
- Dans la conversation : **ce que Paul peut jouer, geste par geste** ; **ce que la maquette n'a pas**, dit d'avance ; **la liste des tests pour Paul**, dans l'ordre.
- Paul joue, corrige, valide. **Une remarque de Paul est un piège à chercher dans le registre avant de corriger** : elle y est presque toujours.

## 6 · Quand s'arrêter
- Une maquette **ne se perfectionne pas à l'infini** : elle s'arrête au périmètre cadré ; ce qui dépasse s'écrit comme dette ou comme question.
- Quand le périmètre est joué et validé, **le mandat prend le relais** : il porte le gabarit dans le site, branche ce que la maquette simule, abolit ce qu'elle tolérait (l'état par rang, l'injection de code), et prouve avec les mêmes bancs. Les livraisons sont courtes, relancées par « continuer », sans dette, promues sur captures.

## 7 · Ce qui ne se fait jamais dans une maquette
Écrire au hub · porter un jeton ou une clé · afficher du méta ou un code · un bouton qui ne fait rien · un faux vert · deux fichiers différents sous un même nom · livrer une capture sans l'avoir regardée · prouver par un appel de fonction · reconstruire l'écran au clic · couper un texte · s'appuyer sur un rang · mesurer une image sans image.

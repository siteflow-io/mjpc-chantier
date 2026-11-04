# QCM — la vérification de ce qui reste, planifiée samedi 07/11/2026 à 23:00 (conscience n°14)

> Paul, 04/11 15:01 : « alors je reviens ici afin de pouvoir mesurer l'app qcm, ce qui a été fait, ce qui reste à faire. »
> Paul, 04/11 15:21 : « Daccord, cette vérification doit être planifiée pour samedi soir à 23h. en attendant, pas de token à y consacrer. Planifie la tâche. »

Déjà mesuré le 04/11 (C14 134 à 137, transcript C14 tour 181) : en ligne la 8.0.4 (md5 `54c0af98864fb7cb31fdfb3dddc3a745`) ; une 8.0.5 sur la branche `code-qcm` du sas, jamais mise en ligne, arrêtée le 21/10 sur le défaut « R3 (à confirmer) » de QCM-4 (21/10 15:25 : dans une séance rouverte, le voisin peut effacer la lecture du soir de Paul), sans contrôle de la conscience des points 12 à 17 ; la conscience n°12 arrêtée le 21/10 à 14:49 ; rien sur le QCM depuis le 22/10.

## Tout se fait en lecture seule
Aucune écriture au vrai site (tout navigateur lancé sert ou bloque `firebasedatabase` / `firebaseio`) ; aucune écriture dans le code ; rien de poussé sauf ce document de mesure, le transcript et le message à Paul. Aucun nom d'élève : « [l'élève] ».

## 0. D'abord, ce qui a pu changer depuis le 04/11
Le md5 de `evaluation-qcm.html` en ligne ; la tête de `code-qcm` (`git fetch origin code-qcm`, puis un arbre de travail détaché dans le dossier de travail : `git worktree add --detach <dossier> FETCH_HEAD`) ; le journal et le registre (`docs/MJPC6-journal.md`, `docs/MJPC6-DETTES.md`) depuis le 04/11.

## 1. Les dettes n°12 · 179 à 197 (registre, lignes ~3256-3275), sauf 187 (close)
Mesurées sur l'ancienne 7.7.1, jamais revérifiées depuis que la 8.0.0 (13/10) a remplacé tout le code. Pour chacune, contre le code de la 8.0.4 (fichier en ligne, ou sources `LIVRAISONS/CODE-QCM/src/` au commit `381184d` de `code-qcm`), avec ce que le cadrage a décidé (`MANDATS/CADRAGE-QCM.md`, `MANDATS/MAQUETTE-QCM-COMPLETE/VALIDEE.md`) : « réglée en 8.0.4 » / « pas réglée » / « en partie » (ce qui reste) / « décidée autrement, sans objet » (mot de Paul, source) / « je ne sais pas » (ce qui manque). Preuve : fonction, fichier, texte affiché, ligne.

## 2. Les dettes n°12 · 199 à 223 encore ouvertes
199, 200, 201, 202, 203, 204, 205, 206, 207, 209, 211 (même jugement que 1) ; 213 (le rappel « à remesurer ») ; 214 (sa partie hors de l'app : l'en-tête de `correction_dictee.html`) ; 220 à 223 : contre la 8.0.4 et contre la 8.0.5 reconstruite (`build.py`, dans un dossier à part, rien de commité ; l'app attendue au VERDICT du 21/10 15:58 a le md5 `b210a7faa15f0329183830735173132d` ; le fichier `evaluation-qcm.staging.html` commité n'est pas elle). Pour 220 à 223 : ce qui est codé et contrôlé, codé et pas contrôlé, et ce qui attend Paul ; le défaut R3 et les deux points à trancher signalés par QCM-1 (21/10 13:30), formulés simplement pour Paul.
Les contrôles fixes de la conscience (`AUDITS/CONTROLES-QCM-APP/`, 32) sur la 8.0.4 et sur la 8.0.5, s'ils tournent sur un faux hub (lire son README) : les comptes.

## 2 bis. La fiche du QCM (ajouté le 04/11 à 16:35, vidéo de Paul de 16:24, C14 140 à 142)
Le QCM n'a plus sa déclaration (`MJPC_APP`, `MJPC_MANIFESTE`, `MJPC_PURGE`) depuis la 8.0.0 : « Mettre les fiches à jour » échoue (« déclaration illisible ») ; registre, entrée « QCM — LA FICHE DU QCM NE SE MET PLUS À JOUR ». À compter dans ce qui reste : la tête de `code-qcm` l'a-t-elle ? Les nœuds que la 8.0.5 utilise au site sont-ils tous dans la déclaration de la 7.7.2 ? Le mot de Paul sur 142 est venu : « parfait » (04/11 16:55) : la carte de la 7.7.2 repart avec la 8.0.5.

## 3. Ce que le cadrage a laissé pour plus tard
Dans `MANDATS/CADRAGE-QCM.md`, `CADRAGE-QCM-SECOUSSE.md`, `MANDAT-CODE-QCM.md`, `MANDAT-MAQUETTE-QCM-COMPLETE.md`, `MAQUETTE-QCM-COMPLETE/VALIDEE.md`, `COMPLEMENT-MAQUETTE-QCM-COMPLETE-*.md`, `DETTES-QCM-179-184-A-REPORTER.md`, `PROMPT-QCM-CREATION/`, `QCM-CONNAISSANCE.md` :
- ce que Paul a décidé et laissé hors du code (« plus tard », « dans un second temps », « hors mandat »…), avec le numéro du point, sa phrase, et si la 8.0.4 l'a (à vérifier, entre autres : les binômes d'après le QCM précédent, l'archive des séances pour École Directe, le prompt de création « à établir une fois l'app complètement cadrée », les temps par question et la garde de débordement, le lien au déroulé et à l'emploi du temps, la feuille imprimée de secours, la saisie papier) ;
- les propositions restées sans son mot ;
- ce qui est relié à d'autres apps et n'est pas fait ;
- le prompt de création des évaluations face à ce que l'app sait lire au collage du JSON.

## Ce qui en sort
- `MANDATS/QCM-MESURE-07-11.md` au sas : une ligne par dette (numéro, titre court, verdict, preuve, ce qui reste) ; la 8.0.5 ; les contrôles ; le cadrage laissé pour plus tard.
- À Paul, court, dans ses mots : ce qui est fait, ce qui reste, dans l'ordre, et les décisions qui lui reviennent (numérotées à la suite, en-tête « À jouer · en cours · ouvert », « À tester », date, MEMO).
- Le registre n'est changé qu'avec son mot ; le transcript C14, oui.

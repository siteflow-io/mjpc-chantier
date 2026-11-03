# MANDAT — LE COMPLÉMENT DU LOT 1 : « REPRENDRE » SUR UN SECOND ORDINATEUR PREND LA MAIN, SANS RIEN PERDRE
*Conscience n°16, 03/11/2026 18:51. L'ordre : Paul, 17:18 (C16 393-395) : « le choix le plus court et le plus économe en utilisation » — régler ce défaut avant la mise en ligne, puis une seule série de tests et une seule mise en ligne pour le lot 1 et ce complément ; Paul, 17:04 : « n'importe quelle touche » reprend la main ; Paul, 17:20 : « oui le téléphone doit se désactiver dans tous les cas » (quand un second ordinateur fait « Reprendre »). Un seul exécutant, neuf. Mesuré par l'audit de l'horloge : sas `audit/horloge` (`50426d1c5`, `LIVRAISONS/DEROULE-01-11/AUDIT-HORLOGE/RAPPORT.md`, le BILAN en tête ; son outil `sonde-appel-trace.mjs`, `file-mesures.sh`, `mesurer.sh`, ses sorties). Registre : `docs/MJPC6-DETTES.md` (production) ; transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
- Paul pilote au téléphone. Il ouvre l'heure sur un second ordinateur et clique « Reprendre » : le téléphone se désactive et le dit, toujours (vraie heure, mode test, répétition) ; il reprend la main au téléphone par « Reprendre avec la télécommande ».
- Ce que Paul vient de faire juste avant, au téléphone ou à l'ordinateur (une prise de parole, un ▶, une réponse tapée), ne se perd jamais, même quand trois appareils se passent la main dans la même seconde.

## 1 · CE QUI EST MESURÉ (RAPPORT de l'audit de l'horloge, sur la production 8.81.1, à la vraie horloge, machine seule)
- Le clic sur « Reprendre » est exclu des gestes qui prennent la main (dr-session.js l. 332-333).
- En mode test (et parfois en vraie heure), le téléphone se désactive quand même, par un autre chemin : à la fin de `dr_reprendre`, `dr_copieAuto(true)` (dr-classe.js l. 975) écrit l'état de l'heure sans `vifTs`, avant que la session pose `DR_SES.ici` (dr-session.js l. 342, 400 ms) ; `dr_sesPremierVerifier` (dr-session.js l. 175-179) prend alors cet ordinateur pour une version d'avant et lui donne la main. Ce chemin dépend d'une course de minuteries.
- Ce chemin fait perdre un geste en silence (PG, 14 cas sur 14 : partout, tableau compris, dans les 9 cas où chaque appareil est relevé) : une prise de parole ou un ▶ fait au téléphone ou à l'ordinateur moins d'une seconde avant la reprise disparaît, sur chaque appareil, y compris celui qui l'a fait (le second ordinateur prend pour socle l'état du geste, puis envoie sa photo de reprise, lue avant le geste ; la fusion la lit comme un geste défait).
- En vraie heure (P2H, sans touche), le téléphone reste actif après « Reprendre » 3 fois sur 5 : contre la règle de Paul ; les 2 autres fois, il est désactivé par un troisième accident, le chemin C (la veille remplace `DR_SES.ici` pendant la vérification, dr-session.js l. 173 contre 318 ; 3 s après, l'ordinateur se donne la main par défaut, l. 97).
- T (la session) : trois pilotes qui se prennent la main en moins d'une seconde : une réponse tapée au second ordinateur perdue chez les trois pilotes (1 sur 3, l'auditeur), un dévoilement absent du téléphone (1 sur 4, la conscience). Le site ; la cause exacte : pas trouvée.
- Pourquoi l'horloge simulée disait vert : Playwright y joue d'abord une minuterie qui annule la sauvegarde immédiate (dr-classe.js l. 742) : le chemin A n'y existe pas.
- Selon la règle (le téléphone reprend la main, puis son appui et le clic droit de l'ordinateur à 40 ms), aucun appui ne se perd (X 10/10, XT 8/8).

## 2 · CE QUI EST DÉCIDÉ
1. Le clic sur « Reprendre » (le bandeau, et la fenêtre « Une heure joue déjà » → « Rejoindre ») est un geste : il prend la main par le chemin des gestes, dans les trois sessions ; le téléphone se désactive avec sa phrase d'aujourd'hui.
2. Une écriture d'un appareil de la version d'aujourd'hui n'est jamais prise pour une version d'avant (l'état écrit à la reprise porte de quoi le reconnaître, ou n'est écrit qu'une fois la session posée) ; une vraie version d'avant reste reconnue comme aujourd'hui (C16 ㉞ : elle gagne sur l'état vivant périmé ; la partie P4 de la sonde de l'appel, avec la 8.79.0).
3. Aucun geste fait avant une reprise ne se perd, sur aucun appareil ; aucun geste ni aucune réponse tapée ne se perd quand des appareils se passent la main dans la même seconde (T) : trouve d'abord la cause de T, par le geste et le code, puis règle-la. Les chemins A et C ne décident plus de la main.
4. Les sondes suivent la règle de Paul : dans P2H et P2T (sonde de l'appel), après « Reprendre » sur le second ordinateur, le téléphone est désactivé et le dit, puis reprend la main avant ses gestes ; X et XT de même ; la sonde de l'auditeur (PG) entre au banc. Tu modifies ces sondes dans ta branche ; la conscience les reporte sur `banc/vraie-horloge`.

## 3 · LES PREUVES (par le geste, au faux hub rangé comme le vrai, à la vraie horloge du navigateur — `MJPC_HORLOGE=date`, les sondes de `banc/vraie-horloge` ; machine seule ; base `b984f8bd` → après ; comptées)
1. PG, les cas de l'auditeur (avec et sans le chemin A), cinq passages : 0 geste perdu, sur chaque appareil et au tableau.
2bis. T (la session), dix passages : 0 réponse perdue, 0 dévoilement absent.
2. « Reprendre » sur un second ordinateur, en vraie heure, en mode test, en répétition, cinq passages chacun : le téléphone désactivé, sa phrase, puis « Reprendre avec la télécommande » le réactive.
3. La version d'avant (P4, la 8.79.0) : comme la base.
4. Rien ne change ailleurs : la sonde de l'appel entière (P2H, P2T, X, XT à la règle), la session, la fin d'heure, le parcours P0-P12 (K15, K15-test), les preuves du lot 1 (sonde-lot1 : K, M, W, P, E), base et après sur la même machine.

## 4 · LES RÈGLES
- Ta base : `dbca73a51` (sas, branche `deroule/lot1`, le lot 1 fini). Ton dossier : `git worktree add -b deroule/lot1-complement <dossier> dbca73a51` ; tu pousses sur `deroule/lot1-complement` seulement.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun nom d'élève dans ce que tu pousses.
- La machine : 2 processeurs ; un seul navigateur ; avant chaque passage, aucun autre navigateur (`ps -eo comm | grep -cE '^(chrom|headless)'` à 0) ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté. Les heures : `TZ=Europe/Paris date`, à chaque fois, jamais estimées.
- Économe : Paul l'a demandé. Pas de passage en trop ; pousse chaque morceau prouvé ; dis-le à la conscience (`SendMessage`, `to: "main"`) en trois lignes. Tu livres sans dette.

# MANDAT — LE LOT 2 DU PLAN : RATTRAPER UNE HEURE (362, ㊷) ET CHOISIR UNE AUTRE SÉANCE (342)
*Conscience n°16, brouillon du 03/11/2026 (lancé seulement quand le lot 1 est en ligne ; l'heure de lancement est écrite ici à ce moment). L'ordre : Paul, 14:43 : « 361 ok . Pour le reste ok. » sur le plan C16 359-368, dont 362 (transcript `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`, le message de 14:23). Un seul exécutant, neuf. Tout est mesuré par l'audit global, partie II : sas `audit/global-II` (`c09d56602`, `LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/RAPPORT-II.md`, §1 et §2 ; sa sonde `sonde-II.mjs`, parties A, B, C, P, Q, R). Registre : `docs/MJPC6-DETTES.md` (production), l'entrée « SESSIONS — ㊶ ; ㊷ ».*

## 0 · CE QUE PAUL A DIT
- **12:16** : « une séance 4 faites à la place d'une séance 1 par exemple ne doit pas faire que la séance 1 doit être indiqué en non joué ou non fait ou je ne sais quoi. »
- **12:26** : « cette séance que j'ai faite ce matin, je dois pouvoir la faire apparaître dans le site, même en la jouant en dehors de l'horaire réel. J'y retaperai les réponses des élèves etc, puis je ferai le flux que j'ai fait ce matin, à une différence près: l'horaire. Une séance rattrapée ne doit donc pas avoir de mention d'horaires dans le récit. Il faudra faire ça avec l'existant, le but n'est pas de recréer tout un autre moteur entier pour ca . »
- **12:42** : « Attention, une séance peut ne pas être terminée, donc il faut reprendre là où je me serai arrêté! »

## 1 · CE QUI EST DÉCIDÉ (le plan, 362, accepté le 03/11 à 14:43)
1. Dans une case « passée · pas jouée » : « ▶ Rattraper cette heure », avec la séance que la file donne à cette case, ou une autre séance du chapitre, au choix (342).
2. Le même choix d'une autre séance du chapitre dans une case à venir, à côté de « ▶ Ouvrir le pilotage et lancer » (342).
3. L'heure rattrapée est rangée à la date et au créneau de **cette case** (sa clé d'heure, la date de l'heure, l'appel de la case), jamais à la date du jour où Paul la joue ; la case passée devient la case de cette heure (jouée, close ou pas close, comme une autre).
4. Tout le reste est l'heure d'aujourd'hui, par l'existant : le pilote, le tableau, la télécommande, l'appel, la participation, la fin d'heure qui demande quoi faire des diapos non faites (« Reporter… »), la réactivation, la Relecture.
5. **Aucun horaire** dans ce que l'heure rattrapée donne à lire aux autres : le récit (le cadre « a commencé à … et s'est terminée à … », chaque « À 14 h 03, … », « on a repris à l'oral »), le Papier, le mot aux absents (« tu n'étais pas là jeudi à 16 h 04 »), le texte copié pour École Directe. Ce qui reste : la date de la case. La Relecture et « Ce qui s'est passé », pour Paul seul : inchangés.
6. Une heure rattrapée pas finie reprend là où Paul s'est arrêté (« ▶ Reprendre l'heure »), et continue de s'écrire sous la clé de sa case, quel que soit le jour où il la reprend (RAPPORT-II §1.4 : aujourd'hui, reprendre le lendemain écrit une seconde clé, celle du jour).
7. Jouer une autre séance que celle proposée ne marque jamais la séance proposée « non jouée », « non faite » ni rien d'autre (Paul, 12:16 ; mesuré aujourd'hui : c'est déjà le cas, RAPPORT-II §2 ; ça doit le rester).

## 2 · LES PREUVES (par le geste, au faux hub rangé comme le vrai ; vraie heure et mode test ; avant / après, comptées ; captures écran entier)
1. Le cas de Paul : une classe de 3e qui n'a rien joué, sa case passée de ce matin ; « Rattraper cette heure », la séance 1 ; des réponses tapées ; « Reporter… » à la fin ; la case de ce matin dit la séance 1 jouée ; la case suivante « heure 2 · suite » ; lancée, elle commence par « Où en sommes-nous ? » et les diapos reportées.
2. Les phrases : chaque endroit du tableau de RAPPORT-II §1.3, compté avant / après, pour une heure rattrapée (0 horaire) et pour une heure ordinaire (inchangé).
3. Une heure rattrapée pas close, reprise le jour même et le lendemain : une seule clé au hub, la diapo où l'on s'était arrêté.
4. Une autre séance (la 4 à la place de la 1) depuis une case à venir et depuis une case passée : la file, « Le parcours du chapitre », les cartes, la réactivation, la Relecture, « Mes chapitres » (RAPPORT-II §2, les mêmes lecteurs) ; aucun mot « non jouée / non faite » sur la séance 1.
5. Ce que ça télescope (RAPPORT-II §1.5) : les cases d'après, l'appel de la case, la réactivation, la Relecture, « Mes chapitres ».
6. Rien ne change ailleurs : les sondes de l'appel, de la fin d'heure, de la session et le parcours P0-P12 (K15, K15-test), rejouées entières sur le dernier commit.

## 3 · LES RÈGLES
- Ta base : le commit du lot 1 mis en ligne (écrit ici au lancement). Ton dossier : `git worktree add -b deroule/lot2 <dossier> <base>` ; tu pousses sur `deroule/lot2` seulement.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun nom d'élève dans ce que tu pousses.
- Tes preuves sont des comptes. Une sonde qui mesure un temps se joue à la vraie horloge du navigateur (`MJPC_HORLOGE=date`, branche `banc/vraie-horloge`), jamais à l'horloge simulée de Playwright.
- La machine : 2 processeurs ; un seul navigateur ; le fichier …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté. Les heures : `TZ=Europe/Paris date`, à chaque fois.
- Pousse chaque morceau prouvé ; dis-le à la conscience (`SendMessage`, `to: "main"`). Tu livres sans dette : ce qui n'est pas prouvé n'entre pas dans le commit.

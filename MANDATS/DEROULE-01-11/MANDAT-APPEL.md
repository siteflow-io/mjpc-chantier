# MANDAT — L'APPEL N'IMPORTE QUAND, SUR N'IMPORTE QUEL APPAREIL (㊱)
*Conscience n°16, 02/11/2026 17:02. Cadré avec Paul de 14:14 à 17:01 (C16 222, 226, 254 à 258 ; « ok » à 17:01). **À lancer seulement après la mise en ligne de ㉞** (8.80.0-⑬, vers 18:35), sur le fichier promu : il touche les mêmes fichiers que ㉞ et la télécommande. Un seul exécutant, neuf. Registre : `docs/MJPC6-DETTES.md` (production), entrée ㊱. Transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
- **Paul, 14:14** : « l'appel m'est proposé à la fin d'une heure; quand je clique sur la case de l'emploi du temps, la prmière chose à faire c'est l'appel. De ce fait, pour les aretha franklin de ce matin, j'ai pu faire l'appel mais seulement après, et du coup dans la relecture c'est marqué aucun élève absent. »
- **Paul, 16:59** : « 256 à corriger du coup. je dois pouvoir faire l'appel n'importe quand sur n'importe quel appareil »
- **Le geste de classe, après** : Paul clique sur la case de l'heure : l'appel vient d'abord (un clic marque un absent, un clic le défait), puis « ▶ Ouvrir le pilotage et lancer — appel fait : n absents » ; dès la première diapo, le pilote compte « n sur N présents ». Pendant l'heure, il marque ou démarque un élève où qu'il soit : à l'ordinateur (la case, le clic droit sur une pastille), à la télécommande (le bouton « Appel »), sur un autre ordinateur ; chaque appareil le voit aussitôt. Après l'heure, s'il l'a oublié, il le fait dans la case : la Relecture le dit.
- **Ses règles qui touchent ce mandat** : une page ne dépend jamais d'un rechargement, chaque donnée est abonnée à sa source ; un redessin ne touche pas l'élément qui a le focus ; jamais de perte silencieuse ; chaque geste a son infobulle écrite pour Paul, un bouton grisé dit sa raison ; « une fonctionnalité = un visuel » ; aucun nom d'élève vu par la classe (l'appel n'est jamais montré au tableau).

## 1 · MISSION 0 — AUDITE CE MANDAT, PUIS MESURE L'EXISTANT PAR LE GESTE
1. Relis ce mandat contre le code de la base et contre le contrat (sas `MANDATS/INTEGRATION-DEROULE/CONTRAT.md`). Si la conscience s'est trompée, dis-le avant de coder (Paul, 21/10 : « si tu t'es trompé, il faut qu'ils le signalent »).
2. Mesure, par le geste, sur la base, et écris-le dans ta NOTE, compté : les endroits où l'appel se fait aujourd'hui (la case, `edtAbsencesHtml`, seulement pour une heure jouée ; le clic droit sur une pastille, `S.appel`) ; les deux listes (`H/absents`, `S.appel`) et qui lit laquelle (`dr_absentsDeLaCase`, `dr_recitPresents`, le rendu « Ce qui s'est passé ») ; ce que voit un second appareil et la télécommande quand un absent est marqué ailleurs.

## 2 · LA BASE ET CE QUI EST DÉJÀ FAIT
- **La base** : le commit du sas qui a donné la production 8.80.0-⑬ (la conscience l'écrit ici au lancement : `____`). ㉞ y a mis l'état vivant de la session, suivi par tous les appareils ; « qui a la main » ; la télécommande par le QR ; et la correction de 256 (le journal « appel » sans élève, qui cassait la Relecture).
- **Le code de départ** : la maquette acquise, `MANDATS/DEROULE-01-11/MAQUETTE-APPEL/injection.html` (C16 254, 255), jouée par `maquette-appel.mjs` (7 / 0 sur la production 8.79.0-⑫) : la case d'une heure à venir s'ouvre sur l'appel ; les absents posés au lancement, datés à l'horloge de l'heure (`now()`, jamais `S.debutReel` : mesuré, sinon le compteur ne bouge pas) ; une ligne de journal par absent ; la Relecture réunit les absents de la case à l'appel de leur heure. **Elle n'est qu'une enveloppe posée par-dessus** : le code, lui, fait la chose à sa place, dans les fonctions de la base.

## 3 · CE QUI EST DÉCIDÉ (Paul, 14:14 à 17:01)
1. **L'appel d'abord** (254, planche 1) : la case d'une heure à venir s'ouvre sur l'appel de la classe, puis « ▶ Ouvrir le pilotage et lancer », qui dit « appel fait : n absents » (ou « tous présents »). « ✎ Préparer » ne prend rien de l'appel.
2. **Une seule liste d'absents par heure** (258) : qu'il la remplisse dans la case (avant, pendant ou après l'heure), au pilote (le clic droit sur une pastille garde ses quatre gestes : absent, arrivé, parti, revenu), à la télécommande ou sur un autre ordinateur, c'est la même liste ; un marquage, ou son retrait, paraît sur chaque appareil ouvert en moins de 2 s, sans recharger ; le compteur « n sur N présents » suit.
3. **La télécommande** (258) : un bouton « Appel » ouvre la liste de la classe ; un appui marque un absent, un second appui le défait ; il obéit à « qui a la main » comme les autres commandes (grisé avec sa raison quand l'ordinateur a la main).
4. **Après coup** (254, planche 2) : un appel fait dans la case d'une heure close corrige la Relecture — « n élèves sur N présents », « L'APPEL », le mot pour chaque absent.
5. **Le titre** (255) : « Le mot pour chaque absent », sans « (enregistré à la clôture) ».
6. **Jamais au tableau** : l'appel ne paraît ni à la fenêtre du tableau ni au tableau distant.

## 4 · LES PREUVES (par le geste, au faux hub rangé comme le vrai, qui refuse les clés interdites ; vraie heure et mode test ; avant / après, comptées, captures écran entier)
1. La case d'une heure à venir : l'appel d'abord ; deux absents ; lancer ; « n sur 27 présents » dès la première diapo ; au hub, la liste.
2. Pendant l'heure, un absent marqué à la télécommande, un autre sur un second ordinateur, un retiré dans la case : chaque appareil et le compteur le disent en moins de 2 s ; « qui a la main » respecté.
3. Une heure close sans appel ; deux absents cochés après coup dans la case ; la Relecture (« Le récit », « Ce qui s'est passé ») les dit et compte les présents juste.
4. Une heure jouée avant cette version, avec des absents dans la case et des lignes de journal « appel » sans élève : la Relecture s'ouvre sans erreur (les anciennes copies se lisent toujours).
5. Rien de l'appel au tableau (la fenêtre, le tableau distant) : compté.
6. Aucune erreur JS, aucune écriture refusée, aucune écriture hors des chemins permis (K15, K15-test).

## 5 · LES RÈGLES
- Ton dossier : `git worktree add -b deroule/appel <dossier> <base>` ; tu pousses sur `deroule/appel` seulement, jamais `main`. Le clone ne récupère que `main` : `git fetch origin +refs/heads/<branche>:refs/remotes/origin/<branche>`.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun nom d'élève dans ce que tu pousses (dis « un élève »).
- La machine n'a que 2 processeurs : un seul navigateur de sonde à la fois avec la conscience ; tu lui demandes la machine. Les heures que tu écris : `TZ=Europe/Paris date`.
- Tu livres sans dette : ce qui n'est pas prouvé n'entre pas dans le commit ; tu dis ce qui manque.

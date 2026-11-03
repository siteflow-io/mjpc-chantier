# MANDAT — LA FRAPPE AU TABLEAU (㉟, la suite) ET LE RETARD DU TABLEAU (⑯)
*Conscience n°16, 03/11/2026 10:12. L'ordre : Paul, 07:19 : « 35 et 16 oui. en revanche que ça prenne pas trop de temps! » ; 09:59 : « est ce que le lag général de mjpc peut etre du au fait que je fais tourner les autres apps, par exemple redaction? » ; 10:01 : « 329 oui ». Un seul exécutant, neuf. Registre : `docs/MJPC6-DETTES.md` (production), l'entrée ㉞-㉟ et ⑯. Transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`. Le mandat d'avant, à lire : `MANDATS/DEROULE-01-11/MANDAT-FRAPPE-RETARD-ZOOM.md`, et la NOTE de son exécutant (branche `deroule/frappe-zoom`, `LIVRAISONS/DEROULE-01-11/FRAPPE-ZOOM/NOTE.md`).*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
- En classe, Paul ouvre « l'adresse du tableau sur l'ordi de la classe » (le **tableau distant**) et pilote depuis son ordinateur (Paul, 02/11 12:21). Il tape vite la réponse d'un élève au pilote : la classe doit la voir s'écrire au tableau, lettre par lettre, sans attendre. Ce qu'il fait au pilote (une flèche, dévoiler) paraît au tableau sans retard qu'on voie.

## 1 · CE QUI EST MESURÉ (la conscience, 10:02-10:06, la partie K de `CORRECTIFS/sonde-correctifs.mjs` de `9c13d037c`, `MJPC_K_MODES=refus`, sur la production 8.81.1-⑭-micro, md5 `c21ddbb6`, la machine seule)
- **Le tableau distant** : une lettre tapée y paraît en **3,5 à 4,2 s** (médiane), dans **toutes** les mesures depuis hier, avant comme après le correctif de 09:07 (les sorties de l'exécutant : `FRAPPE-ZOOM/sorties/sonde-correctifs-K-*.txt`, la colonne « tableau distant », que la partie K ne compte pas). Les autres gestes au tableau distant (une feuille, le minuteur, la participation) arrivent en 0,1 à 0,3 s (la sonde ⑩). Si c'est pareil au vrai hub : je ne sais pas.
- **La fenêtre du tableau** a deux régimes sur le même code : l'exécutant 14-15 ms (trois passages), la conscience 173 et 201 ms (deux passages), l'exécutant une fois 164 ms sous profil. La cause : pas trouvée.
- **Un second onglet lourd visible à côté** (un navigateur qui redessine 3 000 lignes à chaque image) : le pilote 17 ms ; la fenêtre du tableau une fois 511 ms, une fois 148 ms ; le tableau distant inchangé (≈ 4 s).
- **⑯** : le premier mouvement au tableau 237-265 ms (la base 259-275) ; le point glisse en 2 images (la v6 de ⑯ : 17 à 22).

## 2 · MISSION 0
1. Audite ce mandat contre le code de ta base ; dis où la conscience s'est trompée.
2. Trouve, par le geste et le profil, **pourquoi une lettre met 4 s à paraître au tableau distant** (le fichier, la fonction, la ligne : un envoi retenu, un regroupement, un délai, la sonde elle-même ?), **pourquoi la fenêtre a deux régimes**, et **pourquoi le point du fil glisse en 2 images**. Si une cause tient à la sonde et pas au site, prouve-le.

## 3 · CE QUI EST DÉCIDÉ
1. Au tableau distant comme à la fenêtre du tableau, la règle de 7 pour chaque lettre tapée au pilote (médiane au plus 100 ms, chaque lettre sous 350 ms), à chaque passage, sans second régime.
2. ⑯ : le premier mouvement au tableau au niveau de la v6 de ⑯ rejouée sur la même machine le même jour, et le point qui glisse comme dans la v6.
3. Le hub reçoit ce qu'il faut et pas plus : si le tableau distant doit recevoir chaque lettre, mesure ce que ça écrit au hub (le nombre d'écritures par réponse) et dis-le.
- Hors de ce mandat : la numérotation par séance (Paul, 08:10), ㉚, le lancement sur un réseau très lent.

## 4 · LES PREUVES (par le geste ; vraie heure et mode test ; avant / après ; la machine seule ; cinq passages pour chaque mesure de temps ; le tableau distant compté)
1. K : le pilote, la fenêtre et le tableau distant, cinq passages, avant / après.
2. D (⑯) et R (la répétition), cinq passages chacune.
3. Rien ne change ailleurs : le parcours P0-P12 (K15, K15-test), la sonde de l'appel, la sonde de la session, la sonde de la fin d'heure, rejouées entières sur le dernier commit.

## 5 · LES RÈGLES
- Ta base : `9c13d037c` (branche `deroule/frappe-zoom`), la production 8.81.1-⑭-micro. Ton dossier : `git worktree add -b deroule/frappe-tableau <dossier> 9c13d037c` ; tu pousses sur `deroule/frappe-tableau` seulement.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun nom d'élève dans ce que tu pousses.
- La machine : 2 processeurs ; un seul navigateur ; le fichier …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté. Les heures : `TZ=Europe/Paris date`.
- Le temps : Paul veut que ça ne prenne pas trop de temps. Pousse chaque morceau prouvé ; dis à la conscience où tu en es à chaque poussée ; la cause du tableau distant d'abord. Ta dernière poussée prouvée avant 13:00.
- Tu livres sans dette : ce qui n'est pas prouvé n'entre pas dans le commit.

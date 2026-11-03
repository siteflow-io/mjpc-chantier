# MANDAT — LE ZOOM DE LA TÉLÉCOMMANDE, LA FRAPPE (㉟), LE RETARD DU TABLEAU (⑯)
*Conscience n°16, 03/11/2026 07:25. L'ordre : Paul, 07:19 : « 35 et 16 oui. en revanche que ça prenne pas trop de temps! hier tu as tourné la journée entière. » Un seul exécutant, neuf, sur `index.html` (par ses modules `LIVRAISONS/INTEGRATION/dr/*`). Registre : `docs/MJPC6-DETTES.md` (production), les entrées ㉞-㉟, ⑯ et « le zoom de la télécommande ». Transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
- **Le zoom, Paul, 07:19** : « à la télécommande, le zoom ne pilote rien au tableau, il est censé actionner la barre crantée "texte au tableau" qui marche très bien elle même. » Après : un appui sur A+ ou A− au téléphone fait exactement ce que fait un cran du curseur « texte au tableau » du pilote : le tableau change, le curseur du pilote bouge, et la télécommande montre le même cran que le pilote.
- **㉟, la frappe, Paul, 02/11 12:21** : « j'ai trouvé ce matin en écrivant les réponses des élèves que c'était assez lent l'écriture. » Après : Paul tape vite la réponse d'un élève au pilote ; chaque lettre paraît aussitôt au pilote et au tableau.
- **⑯, le retard du tableau** : ce que Paul fait au pilote (une flèche, dévoiler, une lettre) paraît au tableau sans retard qu'on voie.
- **Ses règles** : rien de ce qui s'affiche au tableau n'est figé ; un redessin ne touche pas l'élément qui a le focus ; jamais de perte silencieuse ; aucun test au moment du cours.

## 1 · MISSION 0 — AUDITE CE MANDAT, PUIS MESURE PAR LE GESTE
1. Relis ce mandat contre le code de ta base et le contrat (sas `MANDATS/INTEGRATION-DEROULE/CONTRAT.md`) ; si la conscience s'est trompée, dis-le avant de coder.
2. **Le zoom** : mesure par le geste le cas de Paul — le pilote sur un ordinateur, la télécommande sur un téléphone, le tableau (la fenêtre du tableau et le tableau distant), en vraie heure et en mode test ; A+, A−, puis le curseur du pilote. Dis ce qui bouge et ce qui ne bouge pas, et pourquoi (le fichier, la fonction, la ligne). Mesure aussi le cas d'un appareil resté sur une version d'avant (le pilote non rechargé depuis la 8.80.0-⑬) : si c'est la cause, dis-le. Le code d'aujourd'hui : la télécommande pose `S.taille` (`dr_tcMaj`, `dr_tcGeste`, le rang « taille » ; l'état vivant `DR_SES_VUE`) ; le curseur `#taille` (`$('taille').oninput`).
3. **㉟ et ⑯** : repars de ce qui a déjà été fait et mesuré : la NOTE des correctifs (sas branche `deroule/correctifs`, `LIVRAISONS/DEROULE-01-11/CORRECTIFS/NOTE.md`, §9 et §7 : `morph` et l'empreinte des vignettes, `dr_frappeReponse`, `dr_voletApres` retiré ; restaient 15 à 19 lettres sur 244 au-delà de 100 ms au pilote, la fenêtre du tableau tantôt bonne tantôt non). Cette nuit, au banc (la 8.81.0-⑭, sonde des correctifs, partie K) : au pilote 41 lettres sur 244 au-delà de 100 ms (jusqu'à 284 ms) ; à la fenêtre du tableau, médiane 162 à 203 ms, jusqu'à 472 ms. Fais le profil lettre par lettre (quel dessin tombe sur la lettre lente), puis la règle du redessin sur ce qu'il trouve.

## 2 · LA BASE
- Le commit du sas qui a donné la production 8.81.0-⑭ : `fcb5004fd` (branche `deroule/fin-heure`) ; son assemblé `8757f0c8` + `APP_VERSION="8.81.0-⑭"` = la production (md5 `fb2ba5bb…`).
- Les sondes : `LIVRAISONS/DEROULE-01-11/CORRECTIFS/sonde-correctifs.mjs` (partie K, la frappe ; la conscience joue au banc une variante `sonde-correctifs-L-attend.mjs`, que tu trouves dans le dossier du banc : …/scratchpad/wt-banc/LIVRAISONS/DEROULE-01-11/CORRECTIFS/) ; `DERNIERES-DETTES/sonde-fin.mjs` (partie D, le premier mouvement au tableau) ; `SESSION-PARTOUT/sonde-session.mjs` (R, la répétition) ; `APPEL/sonde-appel.mjs` (Q, la télécommande et A− / A+).

## 3 · CE QUI EST DÉCIDÉ
1. **Le zoom** : A+ et A− de la télécommande actionnent le curseur « texte au tableau » du pilote, d'un cran, par le même chemin que le curseur lui-même (rien de parallèle) ; le tableau suit comme pour le curseur ; la télécommande montre le cran du pilote, et un cran changé au pilote se voit au téléphone. « Qui a la main » s'applique comme aux autres commandes.
2. **㉟** : au pilote, chaque lettre paraît à l'image suivante (au plus 100 ms, aucune au-delà) ; à la fenêtre du tableau et au tableau distant, la règle de 7 (médiane au plus 100 ms, chaque lettre sous 350 ms) — les critères de la partie K, inchangés.
3. **⑯** : le premier mouvement au tableau après une flèche revient au niveau mesuré quand ⑯ était fini (médiane 64 à 84 ms, partie D) ; en répétition, chaque geste sur l'autre appareil et au tableau distant sous 0,5 s, 12 sur 12, à chaque passage.
- **Hors de ce mandat** : ㉚, le lancement sur un réseau très lent, la sonde de l'appel à durées fixes. Ne les touche pas.

## 4 · LES PREUVES (par le geste, au faux hub rangé comme le vrai ; vraie heure et mode test ; avant / après, comptées ; la machine seule, cinq passages au moins pour chaque mesure de temps)
1. Le zoom : A+ puis A− au téléphone : le tableau (la fenêtre et le tableau distant) et le curseur du pilote changent d'un cran, en moins de 0,5 s ; le curseur bougé au pilote : le téléphone montre le même cran ; les deux bornes (le plus petit, le plus grand) grisées avec leur raison. Captures écran entier : le téléphone, le pilote, le tableau.
2. ㉟ : la partie K, avant / après, cinq passages : les comptes de lettres au-delà de 100 ms (pilote) et la règle de 7 (tableau).
3. ⑯ : la partie D (médianes), et R en répétition, cinq passages chacune, avant / après.
4. Rien ne change ailleurs : la sonde de l'appel, la sonde de la fin d'heure et la sonde de la session rejouées entières ; le parcours P0-P12 (K15, K15-test) ; aucune erreur JS ; une saisie en cours jamais effacée par un redessin.

## 5 · LES RÈGLES
- Ton dossier : `git worktree add -b deroule/frappe-zoom <dossier> fcb5004fd` ; tu pousses sur `deroule/frappe-zoom` seulement, jamais `main`. Le clone ne récupère que `main` : `git fetch origin +refs/heads/<branche>:refs/remotes/origin/<branche>`.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun nom d'élève dans ce que tu pousses.
- La machine n'a que 2 processeurs : un seul navigateur à la fois ; le fichier …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté. Tue tes processus par leur PID. Les heures : `TZ=Europe/Paris date`.
- **Le temps (Paul : « que ça prenne pas trop de temps »)** : le zoom d'abord, prouvé et poussé seul (une poussée) ; puis ㉟ et ⑯. Ta dernière poussée prouvée arrive avant 11:30 (heure de Paris) ; ce qui n'est pas prouvé à 11:30 ne part pas, et tu dis où tu en es. Pousse à chaque morceau prouvé et dis-le à la conscience.
- Tu livres sans dette : ce qui n'est pas prouvé n'entre pas dans le commit.

## 6 · AJOUT, 03/11 07:40 — LE QR DE LA TÉLÉCOMMANDE QUI NE TIENT PAS (envoyé à l'exécutant)
- **Paul, 07:37** (capture du téléphone : Chrome sur Android, en 4G, « Ce QR code n'est plus valable. Sur l'ordinateur, clique 📱 dans la barre du pilote : un nouveau code paraît. ») : « Le QR code ne semble pas bien tenir ... 5 fois sur 6 j'ai ça ».
- Lu dans le code (pas mesuré) : `dr_tcQrOuvrir` pose le nonce avec la montre de l'ordinateur ; `dr_tcDemarrer` le juge valable 15 minutes avec la montre du téléphone ; une lecture ratée (`dr_sesLireHub`) se dit « plus valable » ; `dr_tcQrFermer(false)` efface le nonce.
- Avec le zoom (même territoire) : mesurer la cause par le geste (téléphone lent, montres décalées, fenêtre fermée ou rouverte, second scan, onglet réutilisé ; vraie heure et mode test) ; décidé : un QR montré marche à chaque scan tant que sa fenêtre est ouverte ou qu'il a été scanné, sans dépendre d'aucune montre ; une lecture ratée est réessayée, un réseau muet est dit en clair. Preuve : 20 scans sur 20 dans chaque cas mesuré ; la partie Q de la sonde de l'appel et la sonde de la session rejouées.

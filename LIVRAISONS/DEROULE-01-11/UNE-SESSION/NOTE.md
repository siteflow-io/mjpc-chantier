# MANDAT Q — LE TABLEAU DISTANT, UNE SESSION À LA FOIS (㊶, C16 640, 759)
*Exécutant Q, 05/11/2026, 07:57-08:27. Base : sas `deroule/suite` `ca28da1f3` (mandat P), assemblée → md5 `a88e89def9ea172c0192915fd644e0c5`. Après : ce commit, assemblé → md5 `523fbb6d2c113cd3c07f62d27629a7f1`. Un seul navigateur. Faux hub de la sonde du mandat L (rangé comme le vrai).*

## 1 · CE QUI CHANGE POUR LA CLASSE
Le tableau appartient à la session qui l'a pris. Une vraie heure, un essai (mode test), une répétition ou une répétition en mode test lancés ailleurs pendant ce temps sont refusés : plus aucune session ne prend le tableau d'une autre sans rien dire. Le refus dit, en clair, qui tient le tableau (sa sorte, sa classe, sa séance, l'heure prévue s'il y en a une, le jour et l'heure de son lancement ou de sa reprise et depuis combien de temps, la diapo où elle en est), avec :
- « Reprendre cette session » (cet appareil la reprend là où elle en est ; une vraie heure se reprend hors du mode test) ;
- pour une répétition ou un essai seulement : « L'arrêter et prendre le tableau » (un clic : l'annonce de l'autre est retirée du hub, son appareil, s'il est encore là, s'arrête ; puis ce que Paul a demandé part) — marche même si l'appareil qui tenait le tableau a disparu ;
- « Annuler ».
Une vraie heure ne s'arrête pas d'ici : « Reprendre » puis « Clore l'heure ». La même session relancée ailleurs la rejoint, comme avant. Le hub ne répond pas en 2,5 s : le lancement part (jamais bloqué).

## 2 · LE CODE (`LIVRAISONS/INTEGRATION/dr/dr-session.js`, après la reprise d'une heure)
- `dr_sesTenant` lit les trois annonces (`/site/cours_actif`, `/site/repetition/pointeur`, `/site/tableau_test/pointeur`), fraîches 4 h, dans l'ordre où le tableau distant les suit ; une heure close ou tenue par cette page, une annonce de cette page ne comptent pas.
- `dr_sesGarder` passe devant `dr_lancer` (vraie heure ; essai en mode test), `lancerRepetition` (répétition ; en mode test), et, en mode test seulement, `dr_reprendre` (« Reprendre l'heure » d'une case en mode test faisait un essai qui copiait la vraie heure, sans rien dire : NOTE du mandat L, H + T).
- `dr_sesRefuser` (la fenêtre, avec ses trois infobulles), `dr_sesReprendreTenant`, `dr_sesArreterTenant` (l'état vivant « clos » à son adresse, puis l'annonce et la scène retirées, seulement si c'est encore elle).
- Les anciennes fenêtres « Lancer celle-ci quand même » (`dr_sesDemander`) restent dans le code ; elles ne paraissent plus que si la lecture du hub a échoué.

## 3 · LA PREUVE (par le geste, sonde du mandat L reprise : `MESURE-UNE-SESSION/sonde-une-session.mjs`)
La sonde, mise à jour dans cette branche : la fenêtre rendue jusqu'à 900 signes ; le bouton cliqué est choisi par son nom et rendu (`MJPC_CHOIX=reprendre` : « Reprendre cette session » ; sinon « L'arrêter et prendre le tableau », sinon « Lancer celle-ci quand même », sinon le second) ; la partie Q1D clique dans le refus et arrête B selon ce qu'il a repris. `comparer.mjs` prend sa sortie en 3e argument.
Sorties : `MESURE-UNE-SESSION/sorties-q/` (journaux, `audit-I.jsonl`, `comparaison.txt`).

**Compté : 9 cas joués, 9 refusés, 9 avec la fenêtre qui dit qui tient le tableau, 0 erreur, 0 écriture refusée par le faux hub, 0 annonce restée au hub à la fin.** Base = le relevé du 03/11 (`AUDIT-GLOBAL/sorties/audit-I.jsonl`, que le mandat L a retrouvé pareil ce matin pour H+T, T+H, H+R) ; après = `sorties-q/audit-I.jsonl` (assemblé `523fbb6d`). `sorties-q/comparaison.txt` : 9 rejoués, 9 changés.

| A tient, B lance ailleurs | Base | Après : la fenêtre chez B (boutons) | Le bouton joué | Le tableau |
|---|---|---|---|---|
| H + T | B devient un essai qui copie l'heure, rien dit à personne | « une vraie heure de classe », classe, séance 1, prévue 09:00-09:52, lancée le … à 09:00, diapo 1 (Reprendre / Annuler) | Annuler | reste à A ; B rien lancé |
| H + R | la répétition tourne chez B, l'en-tête dit « tableau distant pris » | la même (Reprendre / Annuler) | Annuler | reste à A ; B rien lancé |
| T + H | B prend le tableau sans rien dire ; à sa clôture, le tableau revient à l'essai de A | « un essai (mode test) »… (Reprendre / L'arrêter et prendre / Annuler) | L'arrêter et prendre | B ; l'essai de A s'arrête ; B clôt : l'horloge |
| R + H | B prend le tableau sans rien dire ; à sa clôture, retour à la répétition de A | « une répétition », sans heure de classe… (3 boutons) | L'arrêter et prendre | B ; B clôt : l'horloge |
| RT + R | B prend le tableau sans rien dire ; à son arrêt, retour à A | « une répétition en mode test »… (3 boutons) | L'arrêter et prendre | B ; B arrête : l'horloge |
| T + T autre classe | « Un essai joue déjà… » (Rejoindre / Lancer quand même / Annuler) | « un essai (mode test) »… (3 boutons) | L'arrêter et prendre | B ; B clôt : l'horloge |
| H abandonnée (onglet fermé), B lance une répétition | refusée, « tableau distant pris » | la vraie heure… (Reprendre / Annuler) | **Reprendre cette session** | B reprend l'heure, deux ▶ suivis ; « Clore l'heure » : l'horloge, l'annonce retirée |
| T abandonné, B lance une répétition | la répétition prend le tableau ; à son arrêt, retour à l'essai disparu | l'essai… (3 boutons) | L'arrêter et prendre | B ; B arrête : l'horloge, plus d'annonce |
| R abandonnée, B lance une vraie heure | l'heure prend le tableau ; à sa clôture, retour à la répétition disparue | la répétition… (3 boutons) | L'arrêter et prendre | B ; B clôt : l'horloge, plus d'annonce |

Le parcours P0-P12 : **PARCOURS VERT** (30 vérifications, K15 « 28 écritures, toutes sur des chemins permis » ; `parcours-P0-P12-K15-523fbb6d.txt`) ; en mode test : **PARCOURS VERT** (30, K15-test « 15 écritures, 0 hors de /site/tableau_test » ; `parcours-P0-P12-K15-test-523fbb6d.txt`).

## 4 · CE QUI RESTE
- Non rejoués après : H+H (même heure : rejoint, comme avant), H+RT, T+R, T+RT, R+T, R+R, R+RT, RT+H, RT+T, RT+RT, les autres « autre classe / autre séance », les six « même appareil », les trois à trois, les trois télécommandes ; RT·ferme et la veille ; « Reprendre cette session » pour un essai et une répétition (seule la vraie heure est jouée). La commande : `MJPC_PARTIES=Q1 MJPC_COMBOS='…' node sonde-une-session.mjs <index.html> sorties-q` (et `MJPC_CHOIX=reprendre`).
- Le banc 1255 et la sonde de l'appel (`banc/nuit`) : **pas joués** (la limite des 30 minutes).
- « Lancée (ou reprise) » : l'heure de l'annonce est réécrite à chaque reprise (NOTE du mandat L §3) ; l'heure du tout premier lancement n'est pas gardée au hub.
- « Où elle en est » : la diapo comptée dans toute la séance (« diapo 4 de la séance »), pas « Diapo n sur N » de l'heure : le refus ne charge pas la séance.

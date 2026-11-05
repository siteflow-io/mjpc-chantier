# MANDAT N — « UNE AUTRE SÉANCE… » : LA MESURE (C16 639) · base `1a60c142b` · assemblé md5 `fd014e542fc12f4f8f99904dc5d36694`
Aucune ligne du site ne change. Sonde : `sonde-autre-seance.mjs` ; sortie : `sorties/base-1a60c142b.txt`.
**Ce que la sonde est** : le vrai code de l'assemblé, appelé dans la page, sans aucun réseau (15 requêtes coupées, aucune partie) ; une classe inventée « 5 ESSAI », un chapitre de 5 séances d'une heure, 3 cases par semaine (lundi, mardi, jeudi 08:00-09:00). La grille, l'heure du jour et le contexte du pilote sont posés à la main. **Ce n'est pas la preuve par le geste** (aucun clic) : la sonde lit, par le code réel, la trace qu'un lancement écrit (`deroule_joue/<classe>/heures/<date_créneau_classe>`).
Lignes : `LIVRAISONS/INTEGRATION/index.html` (« ix ») et `LIVRAISONS/INTEGRATION/dr/*.js`.

## 1 · Comment l'emploi du temps choisit la séance d'une case
1. **Jouée (au moins une heure)** : une trace de la classe dans `deroule_joue` de la séance (`edtPaquetPour`, ix 18711 : `classe` du paquet, sinon sa clé). Compte : `edtHeuresJouees` (ix 18756).
2. **Finie** : `edtSeanceEtat` (ix 18742-18747) : `finie = heures jouées ≥ heures prévues (edtHeuresPour, ix 18761) ET la dernière heure n'a rien reporté`. `edtSeanceJouee` (ix 18749) rend 0 si elle n'est pas finie. **Aucune règle ne regarde l'ordre dans lequel les séances ont été jouées.**
3. **La file** : `edtFileDAttente` (ix 18814) = les séances **non finies**, dans l'`ordre` (`edtChapitreEnCours`, ix 18784 : premier chapitre publié du fil qui a une séance non finie). La tête reprend à ses heures déjà jouées.
4. **La case** (`edtProjeter`, ix 18883) : une trace à cette date et ce créneau → « jouée » avec le titre de la séance de la trace (ix 18927, `edtSeanceDeTrace`), **elle ne consomme pas la file** ; passée sans trace → « passée » + « Rattraper » la tête de la file, **ne consomme pas non plus** (ix 18950) ; à venir → la tête de la file, `heure = faites + 1` (ix 18959), puis `faites++` et, au bout de ses heures, la séance suivante (ix 18964-18965). C'est cela qui recale les cases d'après.

## 2 · La séance 4 jouée dans la case de la séance 1, puis la 1 la fois suivante (compté, `sorties/base-1a60c142b.txt`)
| Lecteur | E0 rien joué | E1 lundi : la 4 à la place de la 1 | E2 mardi : la 1 |
|---|---|---|---|
| Cases (ix 18883) | 1, 2, 3, 4, 5, rien | lundi « jouée · Séance 4 » ; puis 1, 2, 3, 5, rien | mardi « jouée · Séance 1 » ; puis 2, 3, 5, rien |
| Séance finie (`edtSeanceJouee`) | 0 sur 5 | la 4 seule | la 1 et la 4 |
| File (`edtFileDAttente`) | 1,2,3,4,5 | 1,2,3,5 | 2,3,5 |
| « Le parcours du chapitre », faite (`dr_ouvTerminee`, dr-ouverture.js 74, lu ligne 113) | aucune | la 4 | la 1 et la 4 |
| Relecture, classes qui ont joué (`dr_recitClassesJouees`, dr-recit.js 564) | 1 : aucune · 4 : aucune | 1 : aucune · 4 : 5_essai | 1 : 5_essai · 4 : 5_essai |
| « Où en sommes-nous ? », paquet lu (`dr_reactivationCheminAvant`, dr-recit.js 588, la séance d'avant **dans l'ordre**) | 1 ← rien · 4 ← séance 3 · 5 ← séance 4 | **idem** : la 4 jouée lundi lit la séance 3 (jamais jouée) ; la 1 jouée mardi lit rien (pas la 4 jouée la veille) | idem |

- **Aucun lecteur mesuré ne marque la séance 1 « non jouée », « non faite » ou « reportée »** : elle reste simplement en tête de la file, et la case de lundi dit « Séance 4 ».
- E1b (mardi passé sans heure) : la case de mardi dit « passée », « Rattraper » propose la **séance 1** ; les cases d'après : 1, 2, 3, 5.
- **Télescopage 1 (compté, E3)** : la séance 4 en deux heures, heure 1 jouée lundi : non finie ; ses cases : 1, 2, 3, puis « Séance 4 h2/2 » (17/11), puis 5. Son heure 2 attend que la 3 soit finie.
- **Télescopage 2 (compté, E4)** : la séance 4 d'une heure avec une diapo reportée : case de lundi « pasFinie » ; la suite « Séance 4 h2/1, reste 1 » vient après la 3 (17/11), pas à la case suivante.
- **Télescopage 3 (compté)** : « Où en sommes-nous ? » prend la séance d'avant dans l'ordre (dr-recit.js 588), pas l'heure jouée juste avant : 4 ← 3 (rien de joué), 1 ← rien, 5 ← 4 (jouée bien avant).
- **Télescopage 4 (code, ix 19565)** : le lancement d'une case passe `cS.heure`, `cS.sur` de la case à `dr_lancer` (dr-classe.js 892) ; pour une autre séance, ces nombres sont ceux de la séance de la case, pas de celle jouée. Non joué au geste.
- Échéance proposée du travail à faire (`edtProchainesDe`, dr-classe.js 1488) : la sonde la rend vide (ma pose ne la nourrit pas) : **je ne sais pas**.
- Les numéros d'alors de la 8.86.0 (`dr_recitNumJoue`, rangés par séance) : **non mesurés**.

## 3 · Ce qui joue déjà une autre séance que celle de la case
1. **Le lancement est déjà paramétré par la séance** : `edtLancer` (ix 19539) prend `chCle`/`snum` de la case (ix 19550-19555), sinon la tête de la file (ix 19556), puis `dr_ouvrirLaClasse(niv, chapitre, séance, lancer)` (ix 19566, dr-classe.js 1359) et `dr_lancer(classe, créneau, début, heure, sur, isoCase)` (ix 19565, dr-classe.js 892). La copie s'écrit dans la séance ouverte (`atDrJouer`, ix 15939 : `ATVUES.snum`).
2. **Le rattrapage ㊷** : `cel.rat` (ix 18950), le bouton (ix 19729), `edtLancer(…, rattraper)` (ix 19550-19551), `DR_CL.rat` (dr-classe.js 893) : une vraie heure rangée à la date de la case, la séance choisie par la file.
3. **La répétition** : écrit hors de la classe (`/site/repetition`, dr-tableau.js 184 et 452, dr-atelier.js 742) : rien de ce qu'elle joue ne compte dans 1.
4. **« ✎ Préparer »** (ix 19741) : ouvre l'Atelier sur la séance de la case, ne lance rien.
Non joués au geste dans cette mesure.

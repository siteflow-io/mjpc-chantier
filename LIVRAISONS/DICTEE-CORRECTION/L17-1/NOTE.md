# L17-1 — Les binômes : fixés pour la séance, et la vie de la classe

*Mandat L17 (`MANDATS/MANDAT-L17.md`), morceau 1 sur 8. Base : **6.7.0-L15.1b-1l en ligne** (989 974 o, md5 `328fa0a108d97c59954f1120edcc82cf`, vérifiée). → **6.7.0-L17-1** : **1,000,271 o** (+10,297), md5 `f2ff081bdf00497f0beaeac9edbccbfb`. Rien n'est promu.*

## Ce que ça change pour la classe
Les binômes ne changent plus pendant une séance ; un absent, un élève qui part ou qui revient ne défont jamais un binôme au travail ; Paul choisit binômes imposés ou placement libre.

1. **Binômes fixés par séance** (dette 154) : formés à **« Lancer »** par la console (`binomesSeanceL17`), écrits au hub `correction_dictee/<id>/binomes = {seance: <début de l'heure>, paires, origine, partis, maj}` ; **lus en direct par les tablettes** (`binomesActifsL17` : seulement la séance en cours — même début d'heure, heure active) ; **plus aucun calcul de paires sur la tablette** ; à la fin d'heure ou à la clôture, ils sont **libérés** (la séance suivante les reforme d'après les erreurs du moment). Une copie corrigée pendant la séance change la note, pas les paires. Avant « Lancer », le Suivi en montre l'aperçu.
2. **La garde** (dette 158) : enregistrer une correction alors que des élèves sont assis sur des tablettes (vus au hub dans les 3 dernières minutes) et que la séance n'est pas lancée → refus : « **Lance d'abord la séance, puis modifie ta correction si tu veux.** »
3. **Chaque tablette dit au hub qui est assis sur ses deux moitiés** (`correction_dictee/<id>/tablettes/<tablette> = {m1, m2, t}`, à chaque changement et toutes les 60 s ; l'identité de la tablette n'est jamais vue de l'élève) — **elle n'écrit jamais les binômes**.
4. **Absent du jour** (pendant la séance) : seuls les élèves restés seuls sont réappariés entre eux ; aucune paire au travail ne change. **Un élève qui revient** (dette 168) : son binôme s'il est encore seul ; sinon un élève seul ; sinon seul ; aucun binôme qui a commencé n'est défait.
5. **Un élève qui part** (dette 169) : à l'étape 1, la tuile d'un élève **qui avait commencé** dit « **parti** » (orange), pas « absent » ; son binôme continue seul ; personne ne lui est réattribué ; sa place reste à lui ; l'étape 2 dit « Martin — parti » ; **à son retour sur une moitié** (la tablette le dit au hub), **« parti » se décoche tout seul** (le Suivi le voit).
6. **Le mode** (dette 157) : la case « Aide entre pairs » devient « **Binômes imposés (d'après les erreurs)** » (Préparation, avec son infobulle) ; son état est rappelé en haut de l'étape 1 (« Binômes imposés (d'après les erreurs) » / « Placement libre : deux élèves quelconques par tablette ») ; décochée : **placement libre** (aucune annonce, aucun refus sur la seconde moitié) ; **l'ancien « va aider untel » (`peerTarget`) disparaît**.
7. **Les aménagés** (dette 160) : chaque aménagé (dans l'ordre de leurs clés) avec **l'élève classique libre qui s'est trompé sur le plus de mêmes mots** (à égalité : le moins d'erreurs) ; sinon seul ; puis les autres : le moins d'erreurs avec le plus.
8. **Au Suivi** : l'élève **sans erreur** suit l'affichage des autres — « Terminé » pendant l'heure, « Heure terminée » après (dette 156) ; **« trouvées » est plafonné au total** (dette 154, « 12 / 11 »). *Je ne sais pas reproduire au banc la situation de Danard (12/11) : le plafond est codé, pas prouvé sur ce cas.*
9. **Le banc du lot 3b, contrôle 4** (dette 152) : **le banc d'origine n'est ni au sas ni en production** ; refait par le geste d'après le registre (« la moitié gauche corrige, la droite reste sur sa liste ») : **rouge sur la version en ligne** (la moitié droite reçoit le voile « Ce n'est pas ta tablette » alors que la case est décochée), **vert sur L17-1** (le placement libre).

## Les bancs (`bancs/`)
- **`banc_L171_geste.py`** (deux navigateurs : la console et une tablette en deux moitiés ; contexte sécurisé ; 13 vérifications) : la garde (le message exact, rien d'écrit) ; « Lancer » (binômes au hub = la fonction, même début que l'heure) ; l'aménagé (le plus grand recoupement : 11 mots) ; « Ton binôme : … » sur la tablette ; la tablette dit qui est assis ; une copie corrigée pendant la séance → aucune paire changée ; un absent (n'a pas commencé) → seuls les seuls réappariés, la paire au travail intacte ; « parti » (paire gardée) puis décoché tout seul au retour sur une moitié ; le revenant retrouve son binôme seul ; 0 erreur = « Terminé » ; la clôture libère (plus d'annonce) ; 0 erreur de page.
- **`banc_L171_moities.py`** (dette 152, le contrôle 4 refait).
- **L'état de départ — trois bancs rouges sur la version en ligne elle-même (les micros du 06/10), mis d'accord, versions d'avant jointes** : `banc_L5_geste.py` (le « - » passe en « Acc. » : 13 copies de plus, seul le trait d'union change ; les 10 du rapport gardent leur note) ; `banc_L14_geste.py` (17 copies : seul le « - » n° 128 P → C) ; `banc_L15h2_reel.py` (le reclassement déjà fait au hub : les marques 10/4/9/2, les C, les deux rayées en L, la réouverture ne refait rien — 7 traits d'union comptés à part).
- **Les bancs des micros de la conscience** (récupérés au sas) : `banc_L15ka_moities.py` **accordé** (la séance lancée et ses binômes écrits par la console) ; `banc_L15kc.py`, `banc_traitunion.py` (copies locales du hub réel préparées en lecture seule par `prepare_reel_L17.py`, rien n'est déposé), `banc_unhtml.py` : verts. **Non comptés, déclarés** : `banc_L15kb.py` (déjà rouge sur la version en ligne : il cherche les cases à cocher que L15k-c a remplacées par des tuiles ; couvert par L15k-c et L17-1) ; `banc_emma.py`, `banc_emma2.py` (le module `banc_https` n'est pas au sas).
- **Banc unique : VERT, 0 échec, 46 étapes** (`sorties/`).

## Captures (`captures/`, écran entier)
`B1-etape1-parti.png` (étape 1 : « Binômes imposés », un « parti », un absent) ; `B2-tablette-binome.png` (la tablette : « Ton binôme : … ») ; `B3-deux-moities.png` (dette 152).

## Ce qui reste (dit, jamais caché)
Le plafond de « trouvées » n'est pas prouvé sur le cas réel de Danard (je ne sais pas le reproduire). Les bancs « Emma » et L15k-b ne tournent pas ici (voir plus haut).

## Tes tests, après promotion
1. Préparation : la case « Binômes imposés (d'après les erreurs) » ; Suivi → « Lancer » : les binômes ne bougent plus de la séance.
2. Corrige une copie pendant la séance : les paires restent.
3. Étape 1 pendant la séance : touche un élève qui a commencé → « parti » ; quand il retape son code sur une moitié, la case se décoche.
4. Avant « Lancer », un élève assis sur une tablette : corriger une copie affiche « Lance d'abord la séance… ».

# MANDAT V — « ▶ SÉANCE SUIVANTE DANS CETTE HEURE »
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base et la durée. Branche : `deroule/enchainer`, partie de `deroule/attente` `46ce703a1` (= la production 8.88.0-㉑). **60 minutes au plus** ; à la limite, tu pousses ce qui est prouvé et tu dis ce qui reste.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
Quand la séance est finie avant la fin de l'heure (le bilan écrit, sa mise en commun faite), Paul enchaîne sur la séance suivante sans quitter l'heure : la classe voit la suite au tableau aussitôt, et tout est enregistré comme d'habitude.

## 1 · CE QUI EST DIT (Paul et les propositions acquises)
- Paul, 05/11 20:14 : « Il y a une chose dont je viens de me rendre compte. Demain, j'aurai terminé le bilan avec les 3e avant la fin de l'heure. Le problème c'est que je dois pouvoir commencer la séance 2 après. Comment faire avec l'existant? » ; 20:19 : « Ok. Mesure le chantier que ce serait. Je peux te faire tourner cette nuit. » ; 20:35 : « Pourquoi tu dis qu'il peut rester des diapos à la fin de la séance 1 ? […] » ; 20:56 : « Ok. Laisse tomber 873. »
- Acquis (C16, non commentés ou « Ok ») :
  - 866 corrigé par 871 : sur la dernière diapo de la séance 1 (après le bilan, sa mise en commun et le cahier de textes), un bouton « ▶ Séance suivante dans cette heure » dans les contrôles rapides, avec son infobulle ; **il n'apparaît que si la séance 1 est entièrement faite** (sinon pas de bouton). Un clic : l'heure de la séance 1 se clôt comme « Clore l'heure » ; puis la séance 2 démarre sur le même créneau, même classe, même appel (les absents suivent) ; son récit commence à l'heure réelle du clic ; le tableau passe à la séance 2 sans écran d'attente.
  - 867 : la case suivante des 3e continue la séance 2 là où il s'est arrêté (les diapos reportées en tête, comme aujourd'hui) ; la case du jour dit « Séance 1 puis Séance 2 » et son « Relire l'heure » montre les deux récits l'un après l'autre ; dans la Relecture, chaque partie sous sa séance.
  - 868 : pareil en mode test et en répétition (en répétition, rien n'est écrit, comme aujourd'hui).
  - 872 : le récit prend pour début le premier geste du journal de l'heure : rien à changer.
- « La séance suivante » : celle que la file de la classe donne une fois la séance 1 finie (`edtFileDAttente`) ; s'il n'y en a pas, pas de bouton.

## 2 · LA SUPPOSITION (lue par la conscience dans la production 8.88.0-㉑, à mesurer avant d'agir)
- La trace d'une heure est rangée dans SA séance : `chapitre.seances[k].deroule_joue[classe].heures[jour_créneau_classe]` (`edtSeanceDeTrace` l. 26985, `_drCleHeureDe` l. 15861) ; la garde « une heure close ne se reprend plus » lit le chemin de la séance ouverte (`dr_cheminB`, `dr_lancerNeuf` l. 20729) : deux séances sur le même créneau ne se heurtent pas.
- `dr_lancer(classe, créneau, début, heure, sur, isoCase)` (l. 20707) : sans `heure`, il prend `S.heure + 1` de l'heure close (à donner : les heures jouées de la séance 2 + 1, et son `sur`) ; `dr_ouvrirLaClasse(niv, chapitre, séance, lancer)` ouvre la séance ; l'heure qui tourne encore se clôt d'abord (l. 20738).
- L'appel de la case ne part qu'avec une case « prévue » (`edtLancer` l. 27717, `DR_AP_LANCE`) : les absents de l'heure 1 sont à reporter dans l'heure 2.
- La case : `edtSeanceDeTrace` rend la première séance trouvée (la case n'en dirait qu'une) ; « Relire l'heure » de la case.
- Le mandat N (sas `mesure/autre-seance` `e13df3cb6`, sa NOTE) a mesuré le reste : la file, la case, les séances finies, « Où en sommes-nous ? ».

## 3 · LA PREUVE, PAR LE GESTE, AU FAUX HUB (vraie heure, mode test, répétition)
Une classe inventée, la séance 1 jouée jusqu'au bout : le bouton absent tant qu'une diapo n'est pas faite, présent ensuite ; le clic : la séance 1 close (son récit entier, rien reporté), la séance 2 lancée sur le même créneau (heure 1 sur ses heures), les absents repris, le tableau sur la séance 2 sans écran d'attente ; la séance 2 close à la fin du créneau ; la case : « Séance 1 puis Séance 2 », « Relire l'heure » : les deux récits ; la Relecture : chacun sous sa séance ; la case suivante : la séance 2 qui continue ; une classe qui n'enchaîne pas : rien ne change (compté, base → après). Les sondes qui lisent ce que tu changes, à jour dans ta branche ; la séance (étape 14), l'appel (15), la fin d'heure (16), le parcours P0-P12, la sonde du bilan partie B, verts. Captures de l'écran entier pour Paul (le bouton, le tableau sur la séance 2, la case, « Relire l'heure »).

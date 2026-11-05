# MANDAT V3 — « ▶ SÉANCE SUIVANTE DANS CETTE HEURE » EN RÉPÉTITION · suite de `9e60faa55` (assemblé V2 `d2533e75`)

## 0 · Les erreurs du mandat (mesurées)
1. **Les deux : la sonde ET le site.** La sonde se trompait à son étape 1 : en répétition, elle attendait `S.lancee`. Or la répétition ne pose pas `S.lancee` (c'est l'heure de classe) ; elle pose `S.repetition`. Avec le lancement de la sonde du bilan (la case → « Préparer » → « ▶ Jouer en avance »), la séance 1 tourne et ▶ arrive à la dernière diapo (84 états lus). Là, le site ne montrait pas le bouton, pour trois raisons (§1).
2. Le mandat ne dit rien de **l'infobulle en répétition**. La sonde attendait « Clore l'heure » dedans, mais en répétition rien ne se clôt, et l'infobulle de V le dit (« la répétition de « … » commence ici, rien n'est écrit »). La sonde contrôle maintenant cela.
3. Le contrôle « une diapo non faite → pas de bouton » de la sonde remettait `vuMax` à zéro. Or en répétition, rien n'est marqué vu dans `vuMax` (règle p6). La sonde remet maintenant à zéro ce que la répétition a montré (`S.repVu`).

## 1 · Ce qui change (le site)
- `dr/dr-socle.js` (`pousser`, la branche répétition) : ce que la répétition a montré est noté à part, dans `S.repVu`. Ce champ est oublié à l'arrêt avec le reste de `S`. `vuMax` reste intact : rien n'est marqué vu, rien n'est écrit.
- `dr/dr-classe.js` :
  - `dr_enchRepVue` : en répétition, une diapo est faite si la répétition l'a montrée en entier. C'est la même règle que `finie`.
  - `dr_enchVisible` accepte la répétition (avant : `S.lancee` exigé, donc jamais de bouton en répétition).
  - `dr_enchSuivante` : en répétition, la séance répétée n'a aucune heure jouée. La file la garde donc en tête (`edtSeanceJouee` rend 0 sans heure). La suivante est alors celle d'après dans la file. Avant : aucune suivante, donc pas de bouton.
  - `dr_enchRepetition` pose `DR_ENCH.rep` le temps du passage.
- `dr/dr-atelier.js` (`dr_repTableauFin`) : pendant le passage, le pointeur du tableau n'est pas retiré, puisque celui de la séance suivante le remplace. Avant : le tableau restait sur l'écran d'attente (280 images sur 287).
- `dr/dr-session.js` (l'enveloppe de `lancerRepetition`) : pendant le passage, le site ne demande plus « une répétition joue déjà sur un autre appareil ». Avant, il prenait la répétition de CET appareil, qu'il venait d'arrêter, pour celle d'un autre, et la séance 2 ne démarrait pas (`S.repetition` false).

## 2 · La preuve (par le geste, faux hub du banc) — `sorties/v3-*.txt`, assemblé `bd434b3f4764a6fbae0f714b1383c0c3`
- **Répétition : 12/12** (`v3-rep.txt`). Base `d2533e75` : 7/11 avec le lancement corrigé (`MJPC_MODE=rep`).
  - Lancée par la case → « Préparer » → « ▶ Jouer en avance ».
  - 84 états avant la dernière diapo, bouton montré 0 fois ; sur la dernière, le bouton et son infobulle (répétition, rien d'écrit) ; une diapo remise non faite → pas faite.
  - Le clic : la séance 2 tourne en répétition.
  - Le tableau distant : 213 images lues pendant le passage, l'écran d'attente vu 0 fois, la même diapo que le pilote (« Le parcours du chapitre · Séance 2 sur 9 »).
  - `/site/3e` inchangé ; 0 écriture du pilote sous `/site/3e`. 0 écriture pour la classe (ni copie jouée, ni journal, ni participation, ni récit, ni appel) sur 182 : toutes vont à `/site/repetition/*` (le tableau) et `/presence/prof`. 0 erreur de page.
- **Rejoué en entier sur l'assemblé `bd434b3f`** :
  - vraie heure 26/26 et mode test 28/28 (une heure) ;
  - vraie heure 26/26 et mode test 28/28 (la séance 1 en deux heures, le cas de Paul) ;
  - témoin 12/12 : ses 4 lignes « TÉMOIN » sont identiques à la base `46ce703a1` (Relecture md5 `b41ca3fa`).
- **Parcours P0-P12 : vert**, 30 contrôles, 0 échec (`v3-parcours.txt`).
- Captures (écran entier, 1920×1080, ×2) dans `scratchpad/ENCHAINER-captures-V3/rep/` : le bouton (`rep-1-le-bouton.png`), la séance 2 (`rep-3-la-seance-2.png`), le tableau sur la séance 2 (`rep-4-le-tableau-seance-2.png`).

## 2 bis · Ajout de la conscience (Paul, 05/11 22:38) : la séance 2 enchaînée PAS finie, le T-5, « Reporter »
Sonde : `MJPC_T5=1` pour la séance 2 enchaînée ; `MJPC_T5_ORD=1` pour l'heure ordinaire de comparaison, la séance 2 lancée par la case (la séance 1 jouée et close le 07/09, la trace du faux hub). Sorties : `sorties/v3-t5-*.txt`.

**Erreur de la demande (mesurée).** Sur une heure qui n'est pas la dernière de la séance, le bouton ne s'appelle pas « Reporter ». La séance 2 a 3 heures : son heure 1 propose « À l'heure suivante (si tu ne choisis rien) », et c'est le choix déjà posé. « Reporter » n'est proposé qu'à la dernière heure d'une séance (`ouvrirFin`, `dr-classe.js` l. 406). C'est le flux classique, sans changement. La sonde a donc fait 0 clic : le choix était déjà posé, et la sonde lit ce qui arrive au hub.

- **Le flux du T-5, base → après.** La séance 2 est lancée par ▶ jusqu'à sa première diapo de travail. Puis « aller à 5 minutes de la fin », le geste de la sonde de fin d'heure (l'horloge de la case passe à 09:42).
  - **10 lignes « T5 » comparées. 9 sont identiques** entre l'heure ordinaire de la base `46ce703a1` (assemblé `73030306`) et la séance 2 enchaînée : l'alerte (« T-5 — le cahier de textes dans 5 minutes », palier t5, chrono `cr-t5`, journal `t5`), le panneau ouvert (« Fin de l'heure — étape 1 sur 7 : l'échéance · ❄ Préparer le cahier · Plus tard »), ses 7 étapes, ses boutons, l'étape 2 et ses 6 choix, ce qui arrive au hub, la case suivante, la file.
  - La 10e ligne, la case du jour, diffère comme prévu : « Séance 1 puis Séance 2 · Séance # : … ; puis Séance # : … ».
- **Ce qui n'a pas été fait** : à la clôture, la diapo restante de l'activité en cours (1/1) et les 6 activités suivantes (6/6) sont au hub en « à l'heure suivante ». Il y en a 7, rien d'autre. Même chose dans la base.
- **La suite** : la case suivante (15/09) dit « L'Albatros heure 2/3 ». La file met la séance 2 en tête, pas finie (1 heure jouée sur 3).
- **Les résultats** :
  - vraie heure : enchaînée 21/21 (`v3-t5-ench-vh.txt`), base ordinaire 9/9 (`v3-t5-base-ord-vh.txt`) ;
  - mode test : enchaînée 23/23 (`v3-t5-ench-test.txt`), base ordinaire 11/11 (`v3-t5-base-ord-test.txt`). En mode test aussi, 9 lignes « T5 » sur 10 sont identiques ; seule la case du jour diffère.
  - Le témoin du T-5 (l'heure ordinaire, base → après `bd434b3f`) : 10 lignes « T5 » sur 10 identiques, 9/9 (`v3-t5-apres-ord-vh.txt`).
- **Dette trouvée, non réglée (la classe d'essai seulement)** : l'horloge de la case (`dr_horlogeCase`, réservée à 3E Charles de Gaulle) repart de 08:57 au lancement de la séance enchaînée, parce qu'elle se cale sur le début réel de CETTE heure. Pour la classe d'essai, le T-5 de la séance 2 tombera donc plus tard que celui de la case. Les autres classes ne sont pas touchées : elles suivent la vraie horloge.
- Captures (écran entier, ×2) dans `scratchpad/ENCHAINER-captures-V3/t5-vh/` : `t5-enchainee-1-le-t5.png`, `-2-reporter.png`, `-3-la-case-suivante.png`.

## 3 · Ce qui reste
- Les étapes 14, 15, 16 et la sonde du bilan partie B (hors de ce mandat, déjà dites par V2).
- La dette de V2 §0.3 : la case et le pilotage ne comptent pas les heures de la même façon.
- La répétition en mode test : pas jouée.

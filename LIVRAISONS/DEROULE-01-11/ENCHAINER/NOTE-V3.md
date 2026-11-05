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

## 3 · Ce qui reste
- Les étapes 14, 15, 16 et la sonde du bilan partie B (hors de ce mandat, déjà dites par V2).
- La dette de V2 §0.3 : la case et le pilotage ne comptent pas les heures de la même façon.
- La répétition en mode test : pas jouée.

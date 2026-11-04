# MANDAT — LOT 2, TROISIÈME MORCEAU : L'HORLOGE D'UNE HEURE RATTRAPÉE ; UNE SEULE CLÉ POUR UNE HEURE REPRISE LE LENDEMAIN
*Conscience n°16, 04/11/2026 (lancé à 04:07). L'ordre : Paul, 04/11 04:07 : « Ok » sur C16 474. Lancé quand le deuxième morceau (`MANDAT-LOT2B.md`, branche `deroule/lot2b`) est fini ; sa base est écrite ici au lancement. Un seul exécutant, neuf, court. Transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`.*

## 0 · CE QUE PAUL A DIT (ses mots) ET CE QU'IL A ACCEPTÉ
- **04/11 03:47** : « mon but est que l'heure puisse être faite en accéléré après coup, que je complète si besoin la participation et les réponses élèves, et qu'ensuite les séances suivantes se recalent. »
- **C16 474, accepté par Paul (04:07 « Ok »)** : « une heure ordinaire reprise le lendemain s'écrit encore sous une seconde clé au hub : la même correction la réglerait. Ensuite, une heure rattrapée jouée après son créneau : l'alerte « l'heure dépasse » et le rappel des 5 minutes risquent de partir tout de suite ; ce n'est pas mesuré. Je propose de mesurer le second, puis de régler les deux, dans un troisième morceau. »
- **04/11 03:22, 03:30** : exécutants courts ; la supposition de la conscience se vérifie avant d'agir ; économe.

## 1 · CE QUE TU FAIS (ce morceau seulement)
1. **Mesure d'abord** (sur ta base) : une heure rattrapée jouée après son créneau : l'alerte « l'heure dépasse », le rappel des 5 minutes (T-5), le chrono, la fin d'heure — ce qui part, et quand. Si rien ne part de travers, tu le dis et tu ne codes rien pour ce point.
2. Si ça part de travers : une heure rattrapée se joue à l'horloge de sa case (comme si elle commençait au début de son créneau), pour que rien ne parte d'entrée ; une heure ordinaire, inchangée.
3. Une heure ordinaire laissée pas close et reprise le lendemain (« ▶ Reprendre l'heure ») continue sous **sa** clé (la date et le créneau de sa case), jamais une seconde clé.
Rien d'autre ; ce que tu crois utile en plus, tu le dis, tu ne le codes pas.

## 2 · LA SUPPOSITION DE LA CONSCIENCE (À VÉRIFIER avant de changer quoi que ce soit)
- L'horloge : `dr_horlogeCase` (dr-socle.js) recale déjà l'horloge du pilote sur le créneau de la case, pour la classe d'essai seulement (`/charles\s+de\s+gaulle/i`) ; supposition : la même chose pour une heure rattrapée (le premier morceau la reconnaît : lis son diff, `bdae9b175`). L'alerte et le T-5 lisent cette horloge (à vérifier).
- La clé : le premier morceau fait passer la date de la case par `AT_DR_COURS.iso`, que lit `_drCleHeureDe` ; supposition : « ▶ Reprendre l'heure » (la reprise d'une heure pas close, `dr_reprendreCours` / `dr_reprendre`) doit poser la même `iso`, celle de l'heure reprise (RAPPORT-II §1.4, sas `audit/global-II` `c09d56602`).

## 3 · LA PREUVE (par le geste, au faux hub rangé comme le vrai ; courte ; comptée ; base → après)
1. L'heure rattrapée hors créneau : ce qui part au lancement et pendant (alerte, T-5), avant / après.
2. Une heure ordinaire dans son créneau : l'alerte et le T-5 partent comme avant (compté).
3. Une heure ordinaire pas close, reprise le lendemain : une seule clé au hub, la bonne diapo.
4. Le parcours P0-P12 (`AUDITS/INTEGRATION-DEROULE/parcours.mjs`) : vert.

## 4 · LES RÈGLES
- Ta base : `2a82a095c` (le dernier commit de `deroule/lot2b` : le deuxième morceau n'a rien eu à coder, les échéances viennent déjà de `edtProchainesDe`, qui compte depuis maintenant ; l'assemblé reste `bcee37ae`, celui du premier morceau `bdae9b175` ; les sondes `LOT2A/sonde-lot2a.mjs`, `LOT2B/sonde-lot2b.mjs`). Ton dossier : `git worktree add -b deroule/lot2c <dossier> <base>` ; tu pousses sur `deroule/lot2c` seulement. Tu peux toucher `dr-socle.js` (seulement `dr_horlogeCase` et ce que la mesure exige) ; la conscience y a changé `dr_classe` sur une autre branche (`deroule/r461`) : ne touche pas `dr_classe`.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est prouvé, tu t'arrêtes et tu le dis). **Économe**.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun nom d'élève dans ce que tu pousses.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`). Ce qui n'est pas prouvé n'entre pas dans le commit.

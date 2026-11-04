# MANDAT — UNE HEURE RATTRAPÉE OU REPRISE UN AUTRE JOUR : L'HEURE RÉELLE PARTOUT, L'HORLOGE DE LA CASE POUR LES SEULES ALERTES (C16 515)
*Conscience n°16, 04/11/2026 (lancé à 08:03). L'ordre : Paul, 04/11 07:40 : « Pour le reste oui ok » sur C16 515 ; 07:22 : « l'horaire "enregistré à 10h55" est faux, évidemment ». Le morceau précédent (`MANDAT-RECIT-RATTRAPE.md`, `c65974076`) l'a mesuré sans le coder (« un mandat à lui seul »). Un seul exécutant, neuf, court.*

## 0 · CE QUE PAUL A DIT (ses mots)
- **04/11 03:47** : « la seule chose qui reste c'est début milieu fin. Oui pour la relecture et ce qui s'est passé » (la Relecture et « Ce qui s'est passé » gardent leurs heures).
- **04/11 07:22** : « l'horaire "enregistré à 10h55" est faux, évidemment ».
- **04/11 03:22, 03:30** : exécutants courts ; la supposition de la conscience se vérifie avant d'agir ; économe.

## 1 · CE QUE TU FAIS (ce point seulement)
Pour une heure **rattrapée** ou **reprise un autre jour que sa case** : tout ce qui date ou affiche une heure (le journal des gestes, « Enregistré à », « close · … » dans l'entête, la Relecture, « Ce qui s'est passé ») est à **l'heure réelle** ; l'horloge de la case ne sert plus qu'aux **alertes** (T-5, 3, 1, le cahier, le dépassement, l'ouverture de la fin d'heure) et au **chrono**, qui restent comme aujourd'hui (rien ne part d'entrée ; le temps joué gardé à la reprise). La classe d'essai (3E Charles de Gaulle, ses créneaux fictifs) et une heure ordinaire : inchangées. Rien d'autre ; ce que tu crois utile en plus, tu le dis, tu ne le codes pas.

## 2 · LA SUPPOSITION (du morceau précédent et de la conscience ; À VÉRIFIER avant de changer quoi que ce soit)
- `now()` (dr-socle.js) = `Date.now()` + le décalage de `dr_horlogeCase` (la classe d'essai, l'heure rattrapée, l'heure reprise un autre jour). Le journal est daté par `now()` à 22 endroits (mesuré par le morceau précédent) ; le témoin `#dr-enr` écrit `new Date(now())` ; l'entête « close · » lit `dr_heureCase(S.finReel)`.
- Supposition : `now()` n'applique plus le décalage qu'à la classe d'essai ; les alertes et le chrono (`dr_ecouleS`, les paliers, la fin d'heure qui s'ouvre) lisent une horloge de la case distincte, qui applique le décalage comme aujourd'hui pour l'heure rattrapée et l'heure reprise. Mesure d'abord quelles fonctions lisent `now()` pour les alertes et le chrono.

## 3 · LA PREUVE (par le geste, au faux hub rangé comme le vrai ; courte ; comptée ; base `c65974076` → après)
1. Une heure rattrapée jouée à 14:00 sur une case de 15:07 : « Enregistré à », « close · », « Ce qui s'est passé », la Relecture : l'heure réelle (compté) ; aucune alerte au lancement ; le T-5 au temps joué ; le chrono comme avant (les sondes `LOT2C/sonde-lot2c.mjs` M, `RECIT-RATTRAPE/sonde-recit.mjs`).
2. Une heure reprise le lendemain : les mêmes heures réelles ; rien ne part à la reprise ; le chrono repris.
3. Une heure ordinaire, la classe d'essai : inchangées (compté).
4. Le parcours P0-P12 : vert.

## 4 · LES RÈGLES
- Ta base : `c65974076` (sas, branche `deroule/recit-rattrape`). Ton dossier : `git worktree add -b deroule/heure-reelle <dossier> c65974076` ; tu pousses sur `deroule/heure-reelle` seulement.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est prouvé, tu t'arrêtes et tu le dis). **Économe**.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`, ni `dr_classe`. Aucun nom d'élève dans ce que tu pousses.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Le disque : propre.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`). Ce qui n'est pas prouvé n'entre pas dans le commit.

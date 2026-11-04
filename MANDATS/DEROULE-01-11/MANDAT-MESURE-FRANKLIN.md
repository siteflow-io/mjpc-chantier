# MANDAT — MESURER, SANS RIEN CORRIGER : L'HEURE DES FRANKLIN EN 8.83.0-⑯ (C16 536)
*Conscience n°16, 04/11/2026 (lancé à 12:20). L'ordre : Paul, 04/11 12:17. Un seul exécutant, neuf, court. Mesure seulement : aucune ligne de code du site ne change.*

## 0 · CE QUE PAUL A DIT (ses mots ; deux prénoms d'élèves retirés)
- **04/11 11:08** : « Regarde la séance d'Aretha franklin que je viens de terminer. Il y a un souci sur le récit et sur l'affichage des élèves de la classe ( certains manquants) et de leur identification par initiales ( les MB [deux prénoms] par exemple). Le récit ne contient pas ce qu'on a pourtant écrit dans les diapos de la séance 1 »
- **04/11 12:17** : « Pour anticiper sur le bug des Franklin, fais une mesure avant de pouvoir confirmer une fois que mon ordi sera connecté. Reproduis ma situation et vois. Attention, le bug est arrivé sur la version précédente de celle qui est en ligne vu que je viens de promouvoir »
- **04/11 03:22, 03:30** : exécutants courts ; la supposition de la conscience se vérifie avant d'agir ; économe.

## 1 · CE QUE TU FAIS (ce point seulement)
Sur la **8.83.0-⑯** (pas la 8.84.0 en ligne), au faux hub rangé comme le vrai, tu reproduis l'heure : la classe **3 Franklin Aretha** (3e, une vraie classe, pas la classe d'essai), une **heure ordinaire jouée en direct dans sa case**, la **séance 1** du chapitre que les 3 Dylan ont joué la veille (« Poésie et peinture : le Romantisme en question » ; ses diapos 9 et 11 « Groupe 1 / Groupe 2 : l'hypothèse »), des réponses tapées avec les initiales des élèves dans ces diapos. Une liste de classe **inventée** d'environ 25 élèves (aucun vrai nom), avec **deux élèves aux mêmes initiales MB** (deux prénoms qui commencent par « Ma », deux noms en B), rangée au faux hub comme les vraies listes de `/classes`.
Tu mesures, compté, trois choses :
1. **Les initiales en double** : une réponse tapée « MB » pour chacun des deux élèves MB — à qui elle va (au hub, dans le récit, au tableau des élèves), et ce que l'écran propose à la frappe.
2. **Les élèves manquants** : chaque endroit qui montre les élèves de la classe (la participation au pilotage, le tableau des élèves, le récit…) : combien il en montre contre la liste, et lesquels manquent.
3. **Le récit** : ce qui a été écrit dans les diapos de la séance 1 s'y trouve-t-il ? Mesure aussi le cas où l'heure passe de la séance 1 à la séance 2 avant d'être close.
Rien d'autre ; ce que tu crois utile en plus, tu le dis, tu ne le codes pas.

## 2 · LA SUPPOSITION (lue par la conscience dans le code de la 8.83.0 ; À VÉRIFIER)
- 1 : `dr_initiales` (dr-socle) donne « MB » au premier de la liste et « MB2 » au second ; `dr_iniVu` n'affiche jamais « MB2 » (« MB » et le début du prénom) ; `dr_iniExact` : « MB » tapé est exact et désigne le premier, sans demander.
- 2 : `extractEleves` prend le premier format trouvé (`eleves` en liste, sinon les clés) et ignore les autres : une liste au hub où des élèves sont rangés de deux façons n'en rendrait qu'une partie ; `dr_candidats` et les listes écartent un élève marqué absent (`absentA`) ; une suggestion ne montre que 8 ou 10 noms (« … +n »).
- 3 : le récit cherche ce qui a été écrit (`dr_recitCitations`, `J` filtré par `x.di`) dans les diapos de `seance()` — la séance où l'heure se trouve au moment de la relecture ; l'heure se range sous la séance (`dr_cheminB` → `/seances/<sk>/deroule_joue/<classe>/heures/…`).

## 3 · LA PREUVE (par le geste, au faux hub rangé comme le vrai ; courte ; comptée)
Ta base : la 8.83.0-⑯ = l'assemblé de `deroule/lot2-promo` `82255e7a2` (md5 `857838e1…`) avec la seule ligne de version `8.83.0-⑯` ; la production en a le md5 `a196385663d15975df8176ed5c8c0fba`. Pars des sondes `LIVRAISONS/DEROULE-01-11/LOT2A/sonde-lot2a.mjs` (l'heure des 3 Dylan au faux hub) et `LOT1/sonde-lot1.mjs` (la participation). Une sonde, `LIVRAISONS/DEROULE-01-11/MESURE-FRANKLIN/sonde-franklin.mjs`, et une NOTE courte : pour chacun des trois points, ce qui se passe, compté, et la ligne de code qui le fait.

## 4 · LES RÈGLES
- Ton dossier : `git worktree add -b mesure/franklin <dossier> 82255e7a2` ; tu pousses sur `mesure/franklin` seulement.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est mesuré, tu t'arrêtes et tu le dis). **Économe**.
- Tu ne changes aucun fichier du site (`dr/*.js`, l'assemblé) ; tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun vrai nom d'élève dans ce que tu pousses.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Le disque : propre (moins de 6 Go libres).
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`). Ce qui n'est pas mesuré n'entre pas dans la NOTE.

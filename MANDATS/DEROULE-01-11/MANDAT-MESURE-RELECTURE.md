# MANDAT — MESURER, SANS RIEN CORRIGER : LA RELECTURE D'UNE AUTRE CLASSE, « LE CHAPITRE », LES NOTIONS « NON TRAVAILLÉES » (C16 602)
*Conscience n°16, 04/11/2026 (lancé à 15:37). L'ordre : Paul, 04/11 15:36 : « lance la mesure. le mandat grossit. » Un seul exécutant, neuf, court. Mesure seulement : aucune ligne du site ne change.*

## 0 · CE QUE PAUL A DIT (ses mots ; les noms d'élèves retirés)
- **15:26** : « gros bug, les classes ne sont pas étanches sur ce menu déroulant. le menu déroulant me propose les élèves d'aretha franklin alors que je suis dans la relecture des dylan... pour ce qui est bizarre, c'est ma deuxième capture. »
- **15:28** : « le menu déroulant de la classe dans la relecture des dylan me propose de changer de classe. ça ne devrait jamais être le cas. une séance se relit en y entrant par le calendrier, c'est tout, ou alors au profil de classe, qui viendra après et qui n'est pas encore codé. »
- **15:36** : « oui pour 599, ce sont "les choses bizarres". pour les notions du chapitre, pourquoi sont-elles notées non travaillées? 598. Je ne relisais pas par le menu des classes, je suis toujours passé par le calendrier et la case de la séance. lance la mesure. le mandat grossit. »
- C16 599 (les choses bizarres, confirmées par Paul) : dans l'onglet « Le chapitre » des 3 DYLAN, une « Heure 0 — donné le mercredi 4 novembre 2026, sans échéance (heure en cours — ce qui est en préparation) rien » alors qu'aucune heure ne tourne ; « 2 heure(s) close(s) » alors que les 3 DYLAN n'en ont joué qu'une (rattrapée) ; « Heure 1 — parti à la maison ou reporté : 8 activités sur 2 n'ont pas tenu ».
- **03:22, 03:30** : exécutants courts ; la supposition de la conscience se vérifie avant d'agir ; économe.

## 1 · CE QUE TU MESURES (sur la 8.84.0-⑰ en ligne ; par le geste, comme Paul)
1. **Relire une autre classe par le calendrier** : le pilotage sur une classe A qui a joué aujourd'hui (comme les 3 FRANKLIN), Paul ouvre le calendrier, clique la case passée d'une classe B (comme l'heure rattrapée des 3 DYLAN) et va à sa Relecture. Mesure : la classe dite dans l'entête, la classe de la Relecture, les élèves que propose « Qui a répondu » (sur une réponse sans élève), et ce que permet le menu des classes de la Relecture.
2. **« Le chapitre »** d'une classe à une heure rattrapée (comme les 3 DYLAN) et d'une classe à deux heures ordinaires (comme les 3 FRANKLIN) : d'où viennent l'« Heure 0 » « en cours », le nombre d'heures closes, et « 8 activités sur 2 n'ont pas tenu » (ce qui est compté, contre quoi).
3. **Les notions « non travaillée »** (« Le chapitre », « 3 · Les notions du chapitre ») : ce qui fait qu'une notion passe à « travaillée » ; pourquoi les notions des diapos jouées (les hypothèses, des images décrites) restent « non travaillée ».
Rien d'autre ; ce que tu crois utile en plus, tu le dis, tu ne le codes pas.

## 2 · LA SUPPOSITION (lue par la conscience dans le code et au vrai hub ; À VÉRIFIER)
- 1 : `dr_corrigerReponse` (dr-recit) remplit le menu avec `ELEVES`, la liste de la classe du pilotage ; la Relecture d'une autre classe ne la change pas. Paul passe par le calendrier : mesure si c'est l'entrée par la case qui laisse le pilotage sur la classe A.
- 2 : au vrai hub, `etat/S` des 3 DYLAN : `heure: 1`, `closes: [null, <t>]`, `heuresCours: {"0": {}, "1": {base, classe, cle, debut, fin, jour, lanceA, rattrapee, sur}}`, `travailHeure` a les clés `0` et `1`, `echeanceHeure: [null, "2026-11-06"]`, 8 décisions ; des 3 FRANKLIN : `heure: 2`, `closes: [null, <t1>, <t2>]`, `heuresCours` a `0` (vide), `1`, `2`, `travailHeure` a `0`, `1`, `2`. Supposition : « Le chapitre » liste les clés de `travailHeure` et de `heuresCours`, la clé `0` comprise (d'où l'« Heure 0 » et « 2 heure(s) close(s) ») ; « 8 sur 2 » compte les décisions de report contre le nombre d'activités de l'heure, ou l'inverse.
- 3 : je ne sais pas.

## 3 · LA PREUVE (au faux hub rangé comme le vrai ; courte ; comptée)
Ta base : la 8.84.0-⑰ = l'assemblé de `deroule/heure-reelle` `46d140ab6` (md5 `8d17922b…`) avec la seule ligne de version `8.84.0-⑰`. Pars des sondes `LIVRAISONS/DEROULE-01-11/LOT2A/sonde-lot2a.mjs` (l'heure rattrapée des 3 DYLAN) et `MESURE-INITIALES/sonde-initiales.mjs` (`mesure/initiales` `c5825f9cd` : la classe inventée des 3 FRANKLIN). Une sonde `LIVRAISONS/DEROULE-01-11/MESURE-RELECTURE/sonde-relecture.mjs` et une NOTE courte : pour chacun des trois points, ce qui se passe, compté, et la ligne de code qui le fait.

## 4 · LES RÈGLES
- Ton dossier : `git worktree add -b mesure/relecture <dossier> 46d140ab6`, puis `git checkout c5825f9cd -- LIVRAISONS/DEROULE-01-11/MESURE-INITIALES/ LIVRAISONS/DEROULE-01-11/MESURE-FRANKLIN/` ; tu pousses sur `mesure/relecture` seulement.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est mesuré, tu t'arrêtes et tu le dis). **Économe**.
- Tu ne changes aucun fichier du site ; tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun vrai nom d'élève dans ce que tu pousses.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Le disque : propre ; ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`). Ce qui n'est pas mesuré n'entre pas dans la NOTE.

# MANDAT — LOT 2, DEUXIÈME MORCEAU : UNE HEURE RATTRAPÉE NE PROPOSE QUE DES ÉCHÉANCES À VENIR
*Conscience n°16, 04/11/2026. L'ordre : Paul, 04/11 03:56 : « Ok 470 » (C16 469-470). Lancé seulement quand le premier morceau (`MANDAT-LOT2A.md`, branche `deroule/lot2a`) est fini ; sa base est écrite ici au lancement. Un seul exécutant, neuf, court. Transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`.*

## 0 · CE QUE PAUL A DIT (ses mots)
- **04/11 03:47** : « mon but est que l'heure puisse être faite en accéléré après coup, que je complète si besoin la participation et les réponses élèves, et qu'ensuite les séances suivantes se recalent. »
- **04/11 03:51** : « Le récit ne doit pas mentir. D'ailleurs le cahier de textes pour ce genre de séance rattrapée. Conséquence ? » — la conscience (469) : « Pour une heure rattrapée après coup, ces cases peuvent être déjà passées. Je propose : les échéances proposées ne partent que des cases encore à venir de la classe. » — Paul, 03:56 : « Ok 470 ».
- **04/11 03:22, 03:30** : exécutants courts ; la supposition de la conscience se vérifie avant d'agir ; économe.

## 1 · CE QUE TU FAIS (ce morceau seulement)
Pour une heure rattrapée (le premier morceau la reconnaît : lis-le), tout ce qui propose ou écrit une échéance ne prend que des cases **encore à venir** de la classe, jamais une case passée : les échéances de la fin d'heure (étape 1), « Pour la prochaine séance (…) » du récit, « À relire — … » du Papier. Une heure ordinaire : inchangée. Rien d'autre ; ce que tu crois utile en plus, tu le dis, tu ne le codes pas.

## 2 · LA SUPPOSITION DE LA CONSCIENCE (lue dans le code de la 8.82.0 ; À VÉRIFIER avant de changer quoi que ce soit)
- Les cases suivantes de la classe : `edtProchainesDe(slug, n)` ; lues par le récit via `dr_recitProchaines` ; `dr_papierRelire(h)` cherche la première après l'heure ; `dr_recitEcheanceDe(iso)` ; `dr_echeanceHorsClasse(h)` ; côté emploi du temps `edtEcheanceDue`, `edtEcheancesPhoto`. Supposition : « après l'heure » se compte depuis la date de l'heure (la case rattrapée, passée) ; il faut compter depuis maintenant pour une heure rattrapée.

## 3 · LA PREUVE (par le geste, au faux hub rangé comme le vrai ; courte ; comptée)
1. Une heure rattrapée sur une case passée de plusieurs jours (des cases de la classe entre elle et aujourd'hui) : les échéances proposées à la fin d'heure, « Pour la prochaine séance », « À relire » : toutes à venir (compté).
2. Une heure ordinaire : inchangée (compté).
3. Le parcours P0-P12 (`AUDITS/INTEGRATION-DEROULE/parcours.mjs`) : vert.

## 4 · LES RÈGLES
- Ta base : le dernier commit de `deroule/lot2a` (écrit ici au lancement). Ton dossier : `git worktree add -b deroule/lot2b <dossier> <base>` ; tu pousses sur `deroule/lot2b` seulement.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est prouvé, tu t'arrêtes et tu le dis). **Économe** : tu lis ce qu'il faut, des sorties courtes.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`, ni `dr-socle.js`. Aucun nom d'élève dans ce que tu pousses.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`). Ce qui n'est pas prouvé n'entre pas dans le commit.

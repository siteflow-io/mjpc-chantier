# MANDAT — LOT 2, PREMIER MORCEAU : « ▶ RATTRAPER CETTE HEURE » DANS UNE CASE PASSÉE
*Conscience n°16, 04/11/2026 03:34. L'ordre : Paul, 04/11 03:33 : « 460 oui lance » (C16 460 : « D'abord « ▶ Rattraper cette heure » dans une case passée : l'heure rangée à la date de cette case, sans horaire dans le récit, et elle reprend là où tu t'es arrêté. Ensuite seulement, l'autre séance (342). »). Un seul exécutant, neuf, court. Transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`. Registre : `docs/MJPC6-DETTES.md` (production), l'entrée « SESSIONS — ㊶ ; ㊷ ».*

## 0 · CE QUE PAUL A DIT (ses mots, rien d'autre)
- **03/11 12:26** : « cette séance que j'ai faite ce matin, je dois pouvoir la faire apparaître dans le site, même en la jouant en dehors de l'horaire réel. J'y retaperai les réponses des élèves etc, puis je ferai le flux que j'ai fait ce matin, à une différence près: l'horaire. Une séance rattrapée ne doit donc pas avoir de mention d'horaires dans le récit. Il faudra faire ça avec l'existant, le but n'est pas de recréer tout un autre moteur entier pour ca . »
- **03/11 12:42** : « Attention, une séance peut ne pas être terminée, donc il faut reprendre là où je me serai arrêté! »
- **04/11 03:22** : « Tu fais des choses que je ne demande pas » ; les exécutants « beaucoup moins longs » ; « La consommation d'utilisation est excessive. »
- **04/11 03:30** : la conscience donne « une supposition forte » des endroits du code, mais l'exécutant « ne doit jamais agir en [la] croyant uniquement » : il « doit mesurer et vérifier [ses] dires » ; « ça doit rester économe en tokens ».

## 1 · CE QUE TU FAIS (ce morceau seulement ; l'autre séance, 342, n'est PAS dans ce morceau)
1. Dans l'emploi du temps, une case « passée · pas jouée » propose « ▶ Rattraper cette heure » (avec son infobulle pour Paul) ; elle lance la séance que la file donne à cette case, comme une vraie heure de cette classe, par l'existant.
2. L'heure rattrapée est rangée à **cette case** : sa date et son créneau (la clé de l'heure au hub, la date de l'heure), jamais la date du jour où Paul la joue ; la case devient la case de cette heure (jouée, close ou pas close).
3. **Aucun horaire** dans ce que l'heure rattrapée donne à lire : le récit, le texte copié pour École Directe, le mot aux absents, le Papier. La date de la case reste. La Relecture et « Ce qui s'est passé » (pour Paul seul) : inchangés.
4. Elle reprend là où Paul s'est arrêté (« Reporter… » à la fin, ou « ▶ Reprendre l'heure » si elle n'est pas close), sous la clé de sa case.
Rien d'autre. Ce que tu crois utile en plus : tu le dis à la conscience, tu ne le codes pas.

## 2 · LA SUPPOSITION DE LA CONSCIENCE (lue dans le code et dans l'audit ; À VÉRIFIER par toi, par le code et une mesure courte, AVANT de changer quoi que ce soit — si tu trouves autre chose, dis-le)
- Source : sas `audit/global-II` (`c09d56602`), `LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/RAPPORT-II.md` §1 (1.1 à 1.5), et sa sonde `sonde-II.mjs` (parties C, R, Q, P : la case passée, l'heure ajoutée, les phrases à horaire, la reprise).
- La case passée : la fenêtre de la case (`edtPeindreModale`, et ce qui peint « Case passée sans heure jouée… », « Banaliser cette heure ») n'offre aucun lancement ; le lancement d'une case à venir passe par `edtLancer`.
- La clé de l'heure : `_drCleHeureDe(c, ts)` prend la date à `ts || Date.now()` ; `dr_cheminH()` l'appelle sans date ; `dr_heurePoser` range `jour`, `debut`, `fin`, `cle` ; l'emploi du temps retrouve l'heure par `edtChercherTrace` → `edtTraceDe` (la date et le créneau de la case). Supposition : passer la date de la case (par le cours, `AT_DR_COURS`) là où la date du jour est prise.
- Les horaires : la table de RAPPORT-II §1.3 (`recitHtml0` : la ligne sous le titre, le cadre « a commencé à … », la tête de paragraphe « À 14 h 03, … », « on a repris à l'oral » ; le mot aux absents ; `dr_papier…` ; `dr_recitContenuED`). Attention : `dr_horlogeCase` recale l'horloge pour 3E Charles de Gaulle seulement.
- La reprise : RAPPORT-II §1.4 (« Reporter… » marche ; « ▶ Reprendre l'heure » le lendemain écrit une seconde clé, celle du jour).

## 3 · LA PREUVE (par le geste, au faux hub rangé comme le vrai ; courte ; comptée ; base `1d6a0166d` → après)
1. Une classe ordinaire (CLASSE TEST), sa case passée : « ▶ Rattraper cette heure » ; quelques diapos ; une réponse tapée ; « Reporter… » ; close. Au hub : la clé de l'heure porte la date et le créneau de la case ; la case dit l'heure jouée, la case suivante « heure 2 · suite ».
2. Les phrases : le récit, le texte pour École Directe, le mot aux absents, le Papier : 0 horaire (compté, phrase par phrase) ; la date de la case présente. Une heure ordinaire : inchangée (compté).
3. La reprise : la même heure laissée pas close, « ▶ Reprendre l'heure » le lendemain (date décalée) : la diapo où l'on s'était arrêté ; une seule clé au hub.
4. Le parcours P0-P12 (`AUDITS/INTEGRATION-DEROULE/parcours.mjs`, environ 1 minute) : vert. La non-régression entière : c'est le banc de la conscience, pas toi.

## 4 · LES RÈGLES
- Ta base : `1d6a0166d` (sas, branche `deroule/lot1-complement` ; la production 8.82.0-⑮ en est l'assemblé, `df003634`, plus la ligne de version). Ton dossier : `git worktree add -b deroule/lot2a <dossier> 1d6a0166d` ; tu pousses sur `deroule/lot2a` seulement.
- **30 minutes au plus** (lis l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est prouvé, tu t'arrêtes et tu le dis). **Économe** : tu lis ce qu'il faut, pas tout le site ; pas de passage en trop ; des sorties courtes.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`, ni `dr-socle.js` (la conscience y change une ligne en même temps). Aucun nom d'élève dans ce que tu pousses.
- La machine : 2 processeurs ; un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0.
- Dis-le à la conscience (`SendMessage`, `to: "main"`) en trois lignes, à la fin. Tu livres sans dette : ce qui n'est pas prouvé n'entre pas dans le commit.

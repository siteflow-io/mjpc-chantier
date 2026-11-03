# MANDAT — LE LOT 1 DU PLAN : LES 3 DYLAN (359), LA FENÊTRE « UNE HEURE JOUE DÉJÀ » (360), LA PARTICIPATION (361)
*Conscience n°16, 03/11/2026 14:48. L'ordre : Paul, 14:43 : « 361 ok . Pour le reste ok. » sur le plan C16 359-368 (transcript `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`). Un seul exécutant, neuf. Tout est mesuré par l'audit global : sas `audit/global-I` (`1e1e11322`, `LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/RAPPORT-I.md`) et `audit/global-II` (`c09d56602`, `RAPPORT-II.md`). Registre : `docs/MJPC6-DETTES.md` (production).*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
- Paul ouvre l'emploi du temps : chaque classe de 3e qui n'a pas joué la séance 1 la voit proposée (aujourd'hui, les 3 DYLAN voient la séance 2).
- Un essai en mode test ne peut jamais écrire dans ses vraies données.
- Quand une heure joue déjà, la fenêtre qui le dit a des boutons qui marchent : Paul n'est jamais bloqué devant une fenêtre muette.
- En classe, Paul tape les initiales d'un élève : seul cet élève est compté ; des initiales inconnues ne tombent jamais sur un autre élève.

## 1 · CE QUI EST DÉCIDÉ (Paul, 14:43)
1. **359 — une heure sans nom de classe** : un paquet `deroule_joue/<clé>` sans champ `classe` ne compte que pour la classe de sa clé (la clé du dossier comparée comme le site compare les classes, `edtCleClasse`), partout où le site lit `b.classe` (RAPPORT-II §3.0.1 : `edtSeanceEtat` et ce qui le lit, `edtHeuresJouees`, `dr_heureProposee`, et tout autre lecteur de la même règle que tu trouves). Au vrai hub, le paquet de lundi est `3E Charles de Gaulle` (la classe d'essai) : il ne compte plus que pour elle. **On ne touche pas aux données de Paul.**
2. **359 — le mode test ne fuit plus** : quitter le mode test (`m8BasculerModeTest`, la pastille du panneau prof) pendant qu'un essai joue est refusé, en le disant (« Un essai joue en mode test : clos-le d'abord »), tant que l'essai n'est pas clos ; et tout autre chemin mesuré qui ferait écrire un essai au vrai `deroule_joue` (RAPPORT-II §3.0.2) est fermé.
3. **360 — la fenêtre « Une heure joue déjà… »** (`dr_sesDemander`) : ses trois boutons (Rejoindre, Lancer quand même, Annuler) s'affichent avec leur nom et font ce qu'ils disent (RAPPORT-I §1.2 : les boutons sont passés en `{label, action}`, `atModaleChoix` lit `{lib, fn}`). Chacun a son infobulle écrite pour Paul.
4. **361 — la participation** : en répétition, les pastilles sont celles de la classe de la séance répétée (la classe dont la copie est répétée, celle de l'en-tête « RÉPÉTITION · … »), plus celles de la classe d'essai ; à Entrée (et Tab), seules des initiales exactes désignent un élève ; sinon la réponse garde les initiales tapées, telles quelles, et aucun élève ne passe au vert (RAPPORT-I §3).

## 2 · LES PREUVES (par le geste, au faux hub rangé comme le vrai, à la vraie horloge du navigateur — jamais l'horloge simulée de Playwright pour un temps ; vraie heure et mode test ; avant / après, comptées ; captures écran entier)
1. Le paquet de la forme exacte de lundi (RAPPORT-II §3.0.1, la sonde de l'auditeur II, partie K) : la case d'une autre classe de 3e qui n'a rien joué propose la séance 1 ; « Le parcours du chapitre », les cartes, « heure n/N » justes ; la classe du paquet, elle, a bien sa séance jouée.
2. Les deux chemins de la fuite (RAPPORT-II §3.0.2, parties M et G) : rien n'est écrit au vrai `deroule_joue` ; la pastille refusée pendant l'essai, avec sa phrase.
3. La fenêtre : les quatre cas de l'auditeur I (§1.2) : chaque bouton fait ce qu'il dit, compté.
4. La participation : la liste en répétition ; les initiales inconnues (les cas de l'auditeur I §3.2) : 0 élève attribué à tort, les initiales gardées ; les initiales exactes marchent comme avant ; dans les trois sessions.
5. Rien ne change ailleurs : les sondes de l'appel, de la fin d'heure, de la session et le parcours P0-P12 (K15, K15-test), rejouées entières sur le dernier commit.

## 3 · LES RÈGLES
- Les sondes de l'audit, à reprendre : `sonde-II.mjs` (branche `audit/global-II`, parties K, M, G, H) et `sonde-audit-I.mjs` (branche `audit/global-I`, la fenêtre et la participation), dans `LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/` ; leurs sorties sous `sorties/`.
- Tes preuves sont des comptes, pas des temps. Si une sonde rejouée mesure un temps avec l'horloge simulée de Playwright (`page.clock`), ne conclus rien de ce temps : dis-le, la conscience le rejoue à la vraie horloge au banc.
- Ta base : `9c13d037c` (sas, branche `deroule/frappe-zoom`, la production 8.81.1-⑭-micro). Ton dossier : `git worktree add -b deroule/lot1 <dossier> 9c13d037c` ; tu pousses sur `deroule/lot1` seulement.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun nom d'élève dans ce que tu pousses.
- La machine : 2 processeurs ; un seul navigateur ; le fichier …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté. Les heures : `TZ=Europe/Paris date`, à chaque fois.
- Pousse chaque morceau prouvé ; dis-le à la conscience (`SendMessage`, `to: "main"`). Tu livres sans dette : ce qui n'est pas prouvé n'entre pas dans le commit.

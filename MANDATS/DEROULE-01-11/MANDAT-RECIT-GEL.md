# MANDAT — LE GEL NE FAIT PLUS DISPARAÎTRE NI LES RÉPONSES NI LA PARTICIPATION (C16 571, 580)
*Conscience n°16, 04/11/2026 (lancé à 15:00). L'ordre : Paul, 04/11 14:59 : « Sinon pour le mandat, je pense que tout est cadré » ; 14:40 : « ok » sur C16 564-575 ; 13:07 : « après tes correctifs, je veux retrouver ma séance d'aujourd'hui avec son récit normal et que plus jamais ces cas n'arrivent ». Un seul exécutant, neuf, court.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
En classe, Paul gèle le tableau, passe à la diapo suivante sur son écran, y tape les réponses des élèves, puis dégèle. Aujourd'hui (8.83.0-⑯ et 8.84.0-⑰), ces réponses s'affichent au tableau mais n'entrent ni au journal de l'heure, ni dans le récit, ni dans « Ce qui s'est passé », ni dans le Papier, et la participation de la Relecture les ignore : l'élève perd sa participation sans que rien ne le dise. Paul, 04/11 07:36 : « la participation doit être enregistrée absolument, sinon ce n'est pas juste pour l'élève ».

## 1 · CE QUE PAUL A DIT ET ACCEPTÉ (ses mots ; prénoms retirés)
- **13:07** : « 544. Le gel: tu n'as pas donné de solution, si? » ; « après tes correctifs, je veux retrouver ma séance d'aujourd'hui avec son récit normal et que plus jamais ces cas n'arrivent. »
- **C16 571, acceptée (14:40 « ok »)** : « une réponse s'écrit au journal quand tu la valides, gel ou pas ; quand tu changes l'élève d'une réponse, le journal et le récit suivent ; le récit va chercher dans les diapos les réponses qui manquent au journal. Ton heure des Franklin retrouve ainsi ses 24 réponses. » ; C16 555 : « sans rien réécrire au hub ».
- **C16 580 (14:43, non commenté : acquis)** : « la Relecture et le récit lisent aussi les participations rangées avec l'heure. »
- **03:22, 03:30** : exécutants courts ; la supposition de la conscience se vérifie avant d'agir ; économe.

## 2 · CE QUE TU FAIS (ce morceau seulement)
1. Une réponse validée (Entrée) s'écrit au journal de l'heure au moment de sa validation, que le tableau soit gelé ou non, sur la diapo où elle est tapée ; jamais deux fois.
2. Quand Paul change l'élève d'une réponse pendant l'heure, le journal et le récit suivent (aujourd'hui seul le texte suit).
3. Pour une heure déjà jouée (comme celle des Franklin du 04/11) : le récit, « Ce qui s'est passé » et le Papier vont chercher dans les diapos (les réponses rangées avec leur heure) celles qui manquent au journal, à leur heure et à leur place, avec leur élève ; rien n'est réécrit au hub à la lecture.
4. La participation de la Relecture et du récit lit aussi les participations rangées avec l'heure ; et tu mesures pourquoi la liste des participations n'est plus gardée après l'heure.
Rien d'autre : ni la case des initiales (le morceau suivant), ni le bouton « à corriger » (après). Ce que tu crois utile en plus, tu le dis, tu ne le codes pas.

## 3 · LA SUPPOSITION (lue par la conscience dans le code de la 8.84.0 et au vrai hub ; À VÉRIFIER avant de changer quoi que ce soit)
- 1 : le journal d'une réponse se fait dans `pousser(et)` (dr-classe ; assemblé l. 18283 environ), seulement si le tableau était déjà sur la même diapo (`av.di === et.di`) ; au dégel, il arrive d'une autre diapo : rien n'est écrit. À la validation (`dit.onkeydown`, Entrée, l. 19699 environ), seule la `parole` est écrite.
- 2 : dans `pousser`, une réponse déjà journalisée n'est mise à jour que si son texte ou `refo` change (`avR.r !== r.r || avR.refo !== r.refo`) : le changement d'élève (`r.eleve`, `r.i`) n'est pas suivi.
- 3 : le récit lit les réponses dans le journal (`repsJ(h, di, bi)`, dr-recit, l. 22279 environ) ; « Ce qui s'est passé » et le Papier lisent aussi le journal. Les réponses sont rangées dans les diapos : `etat/parDiapo/<si|eid>/reps[bi][ri]` = `{eleve, i, r, heure, t, validee, refo}`.
- 4 : la participation de la Relecture (`parE`) = `S.parts` de l'heure + les réponses du journal avec un élève. Au vrai hub, pour l'heure des Franklin : `etat/S` n'a pas de `parts` ; l'heure a les siennes (`heures/<clé>/parts`, 21 entrées `{bi, eid, heure, m:'reponse', nom, reponse:true, ri}`). Le vrai hub ne range pas une liste vide.
- Au vrai hub, l'heure des Franklin du 04/11 (deuxième heure de la séance 1) : 24 réponses rangées dans les diapos (`heure: 2`), 2 au journal (les deux tapées après un dégel) ; 5 gels, 4 dégels ; 16 `parole` ; la participation de la Relecture ne montre qu'un élève.

## 4 · LA PREUVE (par le geste, au faux hub rangé comme le vrai ; courte ; comptée ; base → après)
1. Une vraie heure de la classe inventée des 3 Franklin (aucun vrai nom ; reprends la sonde `mesure/initiales` `c5825f9cd`, `LIVRAISONS/DEROULE-01-11/MESURE-INITIALES/`), jouée comme celle de Paul : des réponses tapées pendant un gel sur la diapo suivante, puis le dégel ; des réponses tapées sans gel ; un élève changé sur une réponse validée. Compté, base → après : réponses au journal, dans le récit, dans « Ce qui s'est passé », dans le Papier ; la participation de la Relecture ; aucune réponse en double.
2. Une heure jouée et close avec la 8.84.0 (le fichier de base), réponses tapées pendant un gel, puis relue avec le nouveau fichier : le récit, « Ce qui s'est passé », le Papier et la participation retrouvent toutes les réponses ; ouvrir la Relecture n'écrit rien au hub (compté).
3. Une heure ordinaire sans gel : inchangée (compté).
4. Le parcours P0-P12 (`AUDITS/INTEGRATION-DEROULE/parcours.mjs`) : vert ; `RECIT-RATTRAPE/sonde-recit.mjs` et `HEURE-REELLE/sonde-heure-M.mjs` : verts.

## 5 · LES RÈGLES
- Ta base : `46d140ab6` (sas, branche `deroule/heure-reelle` : la 8.84.0-⑰ en ligne en est l'assemblé `8d17922b` plus la ligne de version). Ton dossier : `git worktree add -b deroule/recit-gel <dossier> 46d140ab6`, puis `git checkout c5825f9cd -- LIVRAISONS/DEROULE-01-11/MESURE-INITIALES/ LIVRAISONS/DEROULE-01-11/MESURE-FRANKLIN/` ; tu pousses sur `deroule/recit-gel` seulement.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est prouvé, tu t'arrêtes et tu le dis). **Économe**.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`, ni `dr_classe`. Aucun vrai nom d'élève dans ce que tu pousses.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Le disque : propre (moins de 6 Go libres) ; ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`). Ce qui n'est pas prouvé n'entre pas dans le commit.

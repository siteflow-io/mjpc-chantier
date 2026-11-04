# MANDAT A — RELIRE UNE AUTRE CLASSE ; « LE CHAPITRE » (C16 610, 618 à 621)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/a`.*

## 0 · CE QUE PAUL A DIT (ses mots)
- 15:26 : « gros bug, les classes ne sont pas étanches sur ce menu déroulant. le menu déroulant me propose les élèves d'aretha franklin alors que je suis dans la relecture des dylan... »
- 15:28 : « le menu déroulant de la classe dans la relecture des dylan me propose de changer de classe. ça ne devrait jamais être le cas. une séance se relit en y entrant par le calendrier, c'est tout, ou alors au profil de classe, qui viendra après et qui n'est pas encore codé. »
- 15:36 : « oui pour 599, ce sont "les choses bizarres" » (dans « Le chapitre » des 3 DYLAN : une « Heure 0 » « en cours » ; « 2 heure(s) close(s) » pour une seule heure ; « 8 activités sur 2 n'ont pas tenu ») ; « Je ne relisais pas par le menu des classes, je suis toujours passé par le calendrier et la case de la séance. »
- C16 610 (proposé, non commenté, acquis ; « tout le reste », 22:22) : « relire une autre classe lit tout de cette classe (ses élèves, ce qu'elle a vu, ses oraux) ; le menu des classes retiré ; « Le chapitre » ne compte que les heures jouées, plus d'« Heure 0 » ; « N sur M » compte les activités reportées sur les activités de l'heure. »

## 1 · CE QUE TU FAIS (ce point seulement)
1. Entrer par la case du calendrier dans la Relecture d'une autre classe que celle du pilotage : tout ce que la Relecture lit est de cette classe — ses élèves (« Qui a répondu »), ce qu'elle a vu (les dévoilements), ses oraux. Le pilotage n'en est pas changé.
2. La liste déroulante des classes de la Relecture est retirée.
3. « Le chapitre » : seules les heures jouées comptent ; plus d'« Heure 0 » ; le nombre d'heures closes est juste.
4. « N activités sur M n'ont pas tenu » : N et M sont des activités (les reportées, celles de l'heure).
La règle des notions « travaillée » ne change pas (Paul ne l'a pas tranchée).

## 2 · LA SUPPOSITION (mesurée par `mesure/relecture` `11e1c5963`, sa NOTE ; À VÉRIFIER)
`dr_corrigerReponse` lit `ELEVES` (rempli par `dr_classe` depuis `AT_DR_COURS`, la classe du pilotage) ; `dr_relireTrace` et `dr_recitChargerClasse` ne changent ni `ELEVES` ni le `vuMax` ; `dr_recitChampsEtat` ne relit pas l'oral ; le menu : `dr_recitSelecteurHtml` ; `chapitreHtml` compte les clés de `S.closes` (le hub rend `[null, t]`) ; « N sur M » : les décisions (par activité ou par diapo, `cleDec`) contre les activités. Tu ne touches pas `dr_classe` : la Relecture garde sa propre liste d'élèves de la classe relue.

## 3 · LA PREUVE
La sonde `LIVRAISONS/DEROULE-01-11/MESURE-RELECTURE/sonde-relecture.mjs` (`11e1c5963`), reprise : base → après, compté (25 élèves de la classe relue, 0 de l'autre ; la diapo pas vue par la classe relue n'est pas comptée faite ; pas de menu ; 1 heure close, pas d'« Heure 0 » ; « 1 activité sur 2 ») ; le parcours vert.

# MANDAT A2 — CE QUE A N'A PAS PROUVÉ : LE RETOUR AU PILOTAGE, LES ORAUX DE LA CLASSE RELUE (C16 610, 618)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/a` (tu continues `27fe9f4a1`). **20 minutes au plus.***

## 0 · CE QUE PAUL A DIT, ET CE QUE A A LAISSÉ
- C16 610 (acquis ; « tout le reste », 22:22) : « relire une autre classe lit tout de cette classe (ses élèves, ce qu'elle a vu, ses oraux) » ; le mandat A : « Le pilotage n'en est pas changé. »
- Paul : jamais de perte silencieuse ; une page ne dépend jamais d'un rechargement pour être à jour.
- L'exécutant A (`27fe9f4a1`) : « relire une autre classe remplace en mémoire le journal, l'état et parDiapo, et maintenant aussi vuMax ; je ne sais pas comment le pilotage revient à sa classe sans recharger, pas mesuré » ; « les oraux de la classe relue : je ne sais pas si ça marche, aucun oral n'est joué dans la sonde ».

## 1 · CE QUE TU FAIS
1. **Mesure d'abord**, par le geste de Paul, au faux hub : le pilotage des Franklin ouvert (une heure jouée, des dévoilements) ; le calendrier ; la case passée des Dylan ; leur Relecture ; puis le retour au pilotage des Franklin par les gestes du site, **sans recharger**. Compté : les élèves, ce que la classe a vu (`vuMax`), le journal, l'état, `parDiapo` du pilotage, avant et après ; et ce qui est écrit au faux hub pendant tout le trajet (rien ne doit partir chez les Dylan ni chez les Franklin depuis la Relecture).
2. Si le pilotage revient avec l'état d'une autre classe, ou si quelque chose s'écrit au mauvais endroit : quitter la Relecture d'une autre classe rend au pilotage exactement ce qu'il avait. Sinon, tu ne changes rien.
3. Un oral joué chez les Dylan dans la sonde : leur Relecture le montre ; celle des Franklin non.

## 2 · LA SUPPOSITION (À VÉRIFIER)
Le chargement d'une autre classe est dans dr-recit (l. 553 environ de `27fe9f4a1` : `J.length = 0 …`, `dr_recitChampsEtat()`, `vuMax`) ; il ne garde pas de copie de ce qu'il remplace ; `dr_recitEnCours()` l'empêche peut-être pendant une heure en cours. Je ne sais pas si l'ouverture du pilotage depuis le calendrier recharge la classe.

## 3 · LA PREUVE
La sonde de A (`LIVRAISONS/DEROULE-01-11/MESURE-RELECTURE/sonde-relecture.mjs`) complétée de 1 et 3, comptée, base (`27fe9f4a1`) → après ; le parcours P0-P12 vert.

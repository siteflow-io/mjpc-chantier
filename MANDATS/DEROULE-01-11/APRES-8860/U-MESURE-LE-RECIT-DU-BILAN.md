# MANDAT U — MESURER (SANS RIEN CORRIGER) LE RÉCIT D'UNE HEURE AVEC MISE EN COMMUN DU BILAN, EN MODE TEST
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base et la durée. **Mesure seulement : aucun commit de code.** Le fichier : la production 8.87.0-⑳ (`scratchpad/promo-8870/index.html`, md5 `16569d87`). **20 minutes au plus, le plus économe possible.***

## 0 · CE QUI EST DIT
- Paul, 05/11 17:45 : « mesure ça » — le récit d'une heure jouée en mode test (3E, heure 2/2 de la case 08:00-08:55, jouée vers 17:39) : la question D posée, « Le bilan », puis « Mise en commun du bilan » avec 5 réponses d'élèves, chacune marquée par Alt + B (1 à 5), « 🅱️ 5/5 », « ☑ Les élèves ont écrit le bilan ». Ses captures montrent :
  1. au pilotage, en même temps que « ☑ Les élèves ont écrit le bilan » : le panneau de fin d'heure dit « Le bilan de la séance n'est pas attesté (la coche, sur la diapo du bilan). La séance se clôt quand même ; la relecture le dira. » ;
  2. dans le récit, une seule marque (la 1, dans la 1re réponse) ; les quatre autres réponses sans marque ;
  3. « Cette heure a commencé à 08 h 00 et s'est terminée à 17 h 40. » (le pilote affichait « close · 08:11 ») ;
  4. chaque moment du récit « À 08 h 00 » ;
  5. « Pour résumer, on a répondu à 3 questions » alors que le récit ne montre de réponses qu'à une question (D : « on a posé la question », le bilan : « sans réponse écrite »).
  Et le récit finit la mise en commun par « Et on l'a terminée. » (déjà au registre pour samedi : 782/783, ne le mesure pas).

## 1 · CE QUE TU MESURES, PAR LE GESTE, EN MODE TEST, AU FAUX HUB (prénoms inventés)
Rejoue ce parcours (5 réponses, 5 marques, la coche venue seule, « Fin de l'heure », clore, la Relecture) et, pour chacun des 5 points, dis : ce qui se passe, compté ; la cause, avec la ligne de l'assemblé ; ça va / ça ne va pas ; et si c'est pareil en vraie heure (un passage en vraie heure suffit pour les points 1, 2 et 5).
Suppositions fortes (lignes de la production 8.87.0) :
1. le panneau de fin d'heure lit `S.bilanCoche` (l. 20277) ; la coche seule le met (l. 21807) : le panneau ouvert avant la dernière marque ne se redessine pas ? ou `S.bilanCoche` n'est pas celui que lit la clôture ?
2. le récit marque une réponse si `bi + '.r.' + ri` (l. 22676, `dr_bRelue`) égale le `p` d'une marque B ; `ri` vient du journal (`repsJ` l. 22673, `dr_repJournaliser` l. 18005) : compare, pour les 5 réponses, le `p` de chaque marque et le `ri` du journal.
3. la fin vient de `fr.t` (l. 22727) : l'heure réelle, pas l'horloge de la case ?
4. les moments : l'heure écrite au journal en mode test, et comment le récit la lit (avec et sans « aller à 5 minutes de la fin »).
5. `nbQ` (l. 22810) compte `repsJ(...).length`, réponses vides comprises ; le texte du récit ne garde que les réponses écrites (l. 22756) : quelles réponses comptent ?
À la fin, trois lignes à la conscience : les 5 verdicts comptés avec leur cause, ce qui est pareil en vraie heure, ce qui reste à mesurer.

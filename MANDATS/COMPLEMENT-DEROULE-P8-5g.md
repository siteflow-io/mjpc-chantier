# COMPLÉMENT — MAQUETTE p8 · livraison p8-5g : la fenêtre du tableau reçoit les pages dès son ouverture
*Conscience n°13, 12/10/2026 (C13, tour 54), à l'audit de p8-5f. Se lit après le complément p8-5f. Règle la dette n°13 · 17. Validé par Paul le 12/10 (tour 59), déposé.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Complément p8-5f, point 5 : « le tableau montre la même page que le pilote ». Quand Paul ouvre (ou rouvre) « 🖥 Écran 2 » en cours de diapo, la classe doit voir tout de suite la page que le pilote montre, avec son compteur — pas seulement à partir du ▶ suivant.

## CE QUI EST MESURÉ (conscience n°13, pièces `TRANSCRIPTS/C13/pieces/T54b-tableau.mjs`, `T54c-ouverture.mjs`, maquette p8-5f)
- Après un ▶, un ◀ ou la molette, la fenêtre du tableau suit le pilote page pour page (vérifié à chaque étape : page 2, 1, 2 manuelle, 1) : ça va.
- **À l'ouverture de la fenêtre**, le tableau ne reçoit pas les pages du pilote : il pagine lui-même sur ses seules lignes dévoilées. À 0 dévoilé : aucun compteur, police pleine ; à 9 dévoilés (pilote « page 1 / 2 ») : aucun compteur, 9 lignes, police 28,66 px (la sienne) ; à 13 : « page 2 / 2 » par hasard, parce que ses 13 lignes ne tiennent pas non plus. Jamais hors du cadre (mesuré à 0, 9, 13 et 14 dévoilés). Dès le ▶ suivant, il reçoit les pages du pilote et tout se cale.
- Cause probable, à confirmer par l'exécutant : à l'ouverture, la fenêtre reçoit l'état gardé par `pousser` (`S.mur`), posé avant que le pilote ait calculé ses pages ; à chaque ▶, l'état envoyé les porte (`et.pages`, `et.pagesP`, `et.policeRatio`, `et.page`).

## CE QUI EST TRANCHÉ
1. **À l'ouverture de la fenêtre comme à chaque ▶**, le tableau reçoit l'état du pilote avec ses pages, sa page courante (manuelle ou suivie) et sa police : il montre la même page et le même compteur que le pilote, aussitôt, sans attendre un geste.
2. Rien d'autre ne change.

## LA LIVRAISON p8-5g
Branche `deroule/p8-5g`, partie de `deroule/p8-5f`. Jamais `main`.
3. Le point 1 ; le patch `patch-p8-5g.py` ; la NOTE donne chaque fonction touchée, taille avant et après ; `regen.sh` étendu.
4. **Banc par le geste** (`test-p8-5g.mjs`), compté, à 1280 × 800 : la diapo 1 avec huit lignes tapées (comme `test-p8-5f`), heure lancée ; ouvrir « 🖥 Écran 2 » à 0 dévoilé, puis la fermer et la rouvrir à 9 dévoilés, à 13, et à 9 avec la page 2 choisie à la molette → à chaque ouverture, dans la seconde, le tableau a le même compteur et la même page que le pilote (les mêmes lignes dévoilées visibles), rien hors de son cadre ; puis un ▶ : toujours la même page des deux côtés. Et la répétition : « 🖥 Écran 2 » ouvert en répétition sur une diapo en pages → même page.
5. Les bancs de p8-5f rejoués (33 bancs), puis le banc unique à 0.
6. `LIVRAISONS/DEROULE/p8-5g/` : la NOTE, les bancs, les sorties, une capture d'écran entier de la fenêtre du tableau juste après son ouverture à 9 dévoilés, à côté du pilote, le gabarit, le patch, la maquette, `EMPREINTES.md5`. **Puis tu t'arrêtes.**

## CE QUE TU NE TOUCHES PAS
- Tout le reste de p8-5c à p8-5f ; la règle 0.4 ; le récit et la copie (n°13 · 8) ; le curseur « texte au tableau » (n°13 · 12) ; `correction_dictee.html`.

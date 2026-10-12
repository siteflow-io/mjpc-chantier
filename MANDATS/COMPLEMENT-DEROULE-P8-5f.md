# COMPLÉMENT — MAQUETTE p8 · livraison p8-5f : la diapo trop pleine se lit en pages, jamais hors du cadre
*Conscience n°13, 12/10/2026 (C13, tours 51-52). Se lit après le complément p8-5e. Règle la dette n°13 · 16. Validé par Paul le 12/10 (tour 53, « Oui »), déposé.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul, 11/10 : « quand j'écris dans une diapo, le texte sort par le haut ». Cadrage 4, 0.4 (validé le 15/09) : « Une diapo ne se coupe que par le geste de Paul … Le site ne coupe jamais seul ; en classe, jamais (seule la page change). » Cadrage 1, 5.2 : la diapo trop pleine se lit en pages.
En classe : une diapo trop pleine se lit page par page, au pilote comme au tableau ; rien ne sort jamais du cadre ; rien ne se coupe seul. Dans l'atelier, Paul voit la page où il écrit.

## CE QUI EST MESURÉ (conscience n°13, 11/10, pièces `TRANSCRIPTS/C13/pieces/T51-deborde.mjs`, `T51b-pilotage.mjs`, `T51d-paginer.mjs`)
- Sur p8-5 (07/10) comme sur p8-5e, à 1280 × 800 : huit lignes tapées sous le dernier bloc de la diapo 1 (atelier) → la police descend au plancher (18,56 px), le corps déborde (544 px pour 408), **aucune page** (`S.pagesCourantes` = une seule page de 14 éléments), et le texte, centré, **sort par le haut** : le premier élément à −94 px, 4 éléments sur 15 hors du cadre — au pilote, heure lancée, et donc au tableau. « À régler » dit bien « Diapo trop pleine … Couper la diapo ici » (règle 0.4 : ça ne change pas).
- **La cause, dans `paginer(mur, et)`** : les pages sont faites avec `l.offsetTop`, qui est relatif à l'`offsetParent` de la ligne ; or `.mur .bloc{position:relative}` (depuis la maquette p7) : dès qu'une diapo a deux blocs, les lignes du second repartent de zéro (`bas` mesuré : 29 … 220, puis 3 … 203), la pagination croit que tout tient, et ne coupe pas. Avec un seul bloc, elle marche par hasard.
- Dans l'atelier, aucune page n'est jamais affichée (`pages: 0`), même quand la pagination couperait.
- `pageDeSuivi` sait déjà suivre le bloc actif (`libre` + `_blocActif`) et le dernier élément dévoilé (`nDev`) ; `appliquerPages` pose `.hors` et écrit « page i / n » ; la molette et Maj+←/→ changent de page (`pageMain`). Tout cela existe et n'est pas à réinventer.

## CE QUI EST TRANCHÉ
1. **La règle 0.4 ne bouge pas** : le site ne coupe jamais seul ; « À régler » dit « trop pleine » ; Paul coupe par « Couper la diapo ici ». Aucune scission automatique.
2. **Les pages marchent avec plusieurs blocs** : `paginer` mesure chaque ligne par rapport au corps de la diapo (`getBoundingClientRect` de la ligne moins celui du corps, ou le cumul des `offsetParent` jusqu'au corps), plus jamais par rapport à son bloc. Un bloc n'est pas une unité de page : une page coupe entre deux lignes, où qu'elles soient.
3. **Rien ne sort jamais du cadre**, dans aucun mode, à aucune largeur : si après la police au plancher et les pages une page déborde encore (une ligne seule plus haute que la diapo), le corps est ancré en haut et coupé en bas, jamais centré ; « À régler » le dit déjà.
4. **Dans l'atelier, les pages aussi** : la diapo se montre en pages comme la classe la verra, et la page suit le bloc où Paul écrit (`pageDeSuivi` par `_blocActif`) ; le compteur « page i / n » est là ; la molette et Maj+←/→ marchent dans l'atelier. En écrivant sous le dernier bloc, Paul est sur la dernière page.
5. **Au pilote, heure lancée**, la page suit le dernier élément dévoilé, comme aujourd'hui ; **le tableau** montre la même page que le pilote (c'est déjà le cas par `et.page`).

## LA LIVRAISON p8-5f
Branche `deroule/p8-5f`, partie de `deroule/p8-5e`. Jamais `main`.
6. Les points 2 à 4 : `paginer` (la mesure), `appliquerPages` si besoin, le CSS du corps quand une page déborde (classe préfixée, cherchée dans le gabarit avant d'être écrite ; jamais de `display` en ligne), l'atelier. Le patch `patch-p8-5f.py` ; la NOTE donne chaque fonction touchée, taille avant et après ; `regen.sh` étendu.
7. **Les règles déjà payées** : un redessin n'efface jamais une saisie en cours, ne touche pas l'élément qui a le focus et garde le défilement — le changement de page pendant la frappe ne doit jamais déplacer le curseur ni faire perdre une lettre ; toute fonction que le rendu appelle passe au tableau.
8. **Bancs par le geste** (`test-p8-5f.mjs`), chacun compté, à 1280 et à 1920 px :
   - **atelier** : diapo 1, huit lignes tapées sous le dernier bloc → « À régler » compte une ligne « trop pleine » de plus (règle 0.4), le mur dit « page 2 / 2 », le bloc tapé est sur la page affichée, le curseur reste dans la ligne tapée, et aucun élément rendu ne dépasse le cadre (chaque `getBoundingClientRect` dans celui de `#mur`) ; Maj+← montre la page 1 ;
   - **pilotage, heure lancée** : la même diapo dit « page 1 / 2 » à 0 dévoilé ; ▶ jusqu'au premier élément de la page 2 → la page passe à 2 toute seule ; ◀ → page 1 ; la molette change de page ; aucun élément hors du cadre à chaque étape ;
   - **la fenêtre du tableau** montre la même page que le pilote, et rien hors de son cadre ;
   - **non-régression, un seul bloc** : une diapo à un bloc que la police au plancher ne fait pas tenir (la maquette en a, ou le curseur « texte au tableau » à 52 pt sur la diapo 7) → en pages, comme avant ;
   - **la ligne seule trop haute** (point 3) : un paragraphe tapé de quinze lignes sans Entrée → ancré en haut, coupé en bas, rien au-dessus du cadre, « À régler » le dit ;
   - **la saisie tient** : taper pendant que la page change (la frappe fait passer le bloc sur la page suivante) → rien d'effacé, le curseur reste.
9. Les bancs de p8-5e rejoués (32 bancs), puis le banc unique à 0.
10. `LIVRAISONS/DEROULE/p8-5f/` : la NOTE, les bancs, les sorties, des captures d'écran entier (atelier page 2 / 2 avec le curseur dans le texte tapé ; pilote page 1 / 2 puis 2 / 2 ; la fenêtre du tableau page 2 / 2), le gabarit, le patch, la maquette, `EMPREINTES.md5`. **Puis tu t'arrêtes.**

## CE QUE TU NE TOUCHES PAS
- La règle 0.4 et « Couper la diapo ici » ; le reste de p8-5c à p8-5e (répétition, notes, mise en forme, poignée) ; le récit et la copie (n°13 · 8) ; le curseur « texte au tableau » (n°13 · 12) ; `correction_dictee.html`.

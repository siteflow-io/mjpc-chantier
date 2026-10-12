# COMPLÉMENT — MAQUETTE p8 · livraison p8-5h : chaque page a sa vignette dans la colonne de gauche
*Conscience n°13, 12/10/2026 (C13, tours 55-60). Se lit après le complément p8-5g. Règle la dette n°13 · 18. Validé par Paul le 12/10 (tour 60 : « Ah bah voilà. Écris le. »), déposé.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul, 12/10 : « je ne peux pas avoir un écran sans le voir dans mon déroulé ppt. en effet, ça reviendrait à projeter quelque chose à l'aveugle. »
Cadrage 1, 0.1 : « la colonne de gauche montre chaque diapo telle qu'elle est, réduite (un vrai diaporama) » ; 5.2 : « la diapo passe en pages ». Le trou entre les deux : ce que la colonne montre d'une diapo en pages. En classe, Paul voit dans la colonne chaque page qu'il va projeter, et laquelle est au tableau.

## CE QUI EST MESURÉ (conscience n°13, 12/10, pièce `TRANSCRIPTS/C13/pieces/T56-vignette.mjs`, maquette p8-5f)
- **En classe**, la diapo 1 avec deux pages (huit lignes tapées sous le dernier bloc) n'a **qu'une vignette** dans la colonne (`#volet .vig[data-i]`), rendue avec `sansPages: true` : les 14 lignes en police réduite (21 px), aucune `hors`, aucun compteur — la diapo entière, pas ce que la classe voit.
- **Dans l'atelier**, la colonne est une liste de lignes de titre (`#volet [data-at-di]`, 26 px de haut : numéro, titre, activité, durée), sans aperçu ; rien n'y dit que la diapo a deux pages.
- La vignette de classe est rendue par `rendre(inner, { … sansPages: true })` (volet, ligne « const st = parDiapo[K(i)] … »), la même mécanique que l'aperçu « Toutes les diapos » et la « diapo suivante ». Les pages de la diapo courante sont dans `S.pagesCourantes` ; pour les autres diapos, `paginer` sait les calculer hors écran (`p8MesureDiapo` rend déjà une diapo hors écran à la taille du tableau).

## CE QUI EST TRANCHÉ
1. **En classe, une vignette par page.** Une diapo en pages a autant de vignettes que de pages, à la suite, sous le même numéro : « 1 · 1/2 », « 1 · 2/2 » (le numéro de la diapo, puis la page). Chaque vignette montre **exactement ce que cette page projette** (les mêmes lignes, les mêmes `hors`, le dévoilement du moment), à la police de la page. La page au tableau est marquée courante (comme la diapo courante aujourd'hui) ; les autres pages de la même diapo ne le sont pas.
2. **Un clic sur une vignette de page y va** : la diapo et la page, avec la garde « La classe te suivrait » quand elle s'applique (comme un clic de vignette aujourd'hui) ; le fil note la page montrée (cadrage 1, 5.3). Le clic droit sur une vignette de page ouvre le menu de la diapo, comme aujourd'hui.
3. **Ce n'est pas un écran de plus.** Même diapo, même identité, même entrée dans le récit, même compte (« Diapo 1 sur 9 ») ; le volet, le compteur « HEURE 1 · 9 DIAPOS », les durées et « Où on en est » ne changent pas. Seule la colonne montre une vignette par page.
4. **Les pages des diapos à venir** sont calculées comme le tableau les montrera (à la taille du tableau, par `paginer` hors écran), pour que Paul voie avant de projeter ; quand la diapo devient courante, ce sont ses pages réelles. Une diapo qui tient en une page garde une seule vignette, sans mention.
5. **Dans l'atelier**, la ligne de titre de la diapo porte « · 2 pages » quand elle en a plusieurs (calculé comme au point 4) ; rien d'autre ne change dans la colonne de l'atelier.
6. **Le redessin ne touche jamais une saisie en cours** : les vignettes de page se recalculent au rendu, sans toucher à l'élément qui a le focus, et la colonne garde son défilement.

## LA LIVRAISON p8-5h
Branche `deroule/p8-5h`, partie de `deroule/p8-5g`. Jamais `main`.
7. Les points 1 à 6 ; le patch `patch-p8-5h.py` ; la NOTE donne chaque fonction touchée, taille avant et après ; `regen.sh` étendu ; classes CSS préfixées, cherchées dans le gabarit avant d'être écrites ; jamais de `display` en ligne ; infobulle de la vignette de page écrite pour Paul (ce qu'elle montre, ce que fait le clic).
8. **Bancs par le geste** (`test-p8-5h.mjs`), comptés, à 1280 × 800 :
   - **en classe** : la diapo 1 avec huit lignes tapées (comme `test-p8-5f`), heure lancée → la colonne a deux vignettes pour la diapo 1, « 1 · 1/2 » et « 1 · 2/2 », et 23 + 1 vignettes en tout ; la première est courante ; le contenu de « 1 · 2/2 » est celui de la page 2 du mur (mêmes lignes non `hors`, comparées par `data-p`) ; ▶ jusqu'à la page 2 → « 1 · 2/2 » devient courante ; clic sur « 1 · 1/2 » → la garde, « Y aller devant la classe », le mur dit « page 1 / 2 », le fil le note ; une diapo à une page n'a qu'une vignette, sans mention ;
   - **le tableau** : à chaque étape, la page du tableau est celle de la vignette courante ;
   - **les diapos à venir** : la diapo 1 tapée alors qu'une autre est courante → ses deux vignettes sont là avant qu'on y arrive, et identiques à ses pages réelles une fois courante (comparées) ;
   - **dans l'atelier** : la ligne de la diapo 1 dit « · 2 pages » ; après « Couper la diapo ici », les deux diapos disent chacune une page ;
   - **la saisie tient** : taper dans la diapo pendant que la colonne se recalcule → rien d'effacé, le curseur reste, le défilement de la colonne ne bouge pas ;
   - **le compte** : « Diapo 1 sur 9 », « HEURE 1 · 9 DIAPOS », « Où on en est » et le récit sont les mêmes avec et sans pages (comparés).
9. Les bancs de p8-5g rejoués (34 bancs), puis le banc unique à 0.
10. `LIVRAISONS/DEROULE/p8-5h/` : la NOTE, les bancs, les sorties, des captures d'écran entier (la colonne avec « 1 · 1/2 » courante et « 1 · 2/2 » ; la même après ▶ jusqu'à la page 2 ; l'atelier avec « · 2 pages »), le gabarit, le patch, la maquette, `EMPREINTES.md5`. **Puis tu t'arrêtes.**

## LES GARDES DU PROTOCOLE D'AUDIT DU 12/10 (`PROTOCOLE-AUDIT-12-10.md`, validé par Paul à 11:28)
- **Les contrôles de la conscience** : `AUDITS/CONTROLES-DEROULE/` (fichier `controles.mjs`, son `EMPREINTES.md5`, ses attendus). Avant de livrer, tire `main` du sas, vérifie l'empreinte, et fais-les passer tels quels sur ta maquette : **tu ne les modifies jamais** ; leur sortie va dans `sorties/controles-conscience.txt`. Un contrôle qui échoue : tu corriges la maquette, pas le contrôle ; si tu le crois faux, tu l'écris dans la NOTE et tu t'arrêtes.
- **Les relecteurs neufs** : avant de livrer, lance au moins deux relecteurs séparés (sous-agents) qui n'ont jamais vu ton travail : ils n'ont que le mandat, les compléments et la maquette livrée, et ils jouent comme Paul (l'atelier, l'heure lancée, Écran 2, la répétition). Chaque trouvaille est corrigée et reçoit une garde dans ton banc ; la NOTE dit ce qu'ils ont trouvé.

## CE QUE TU NE TOUCHES PAS
- Le reste de p8-5c à p8-5g ; la règle 0.4 ; la colonne de l'atelier au-delà de la mention « · 2 pages » ; le récit et la copie (n°13 · 8) ; le curseur « texte au tableau » (n°13 · 12) ; `correction_dictee.html`.

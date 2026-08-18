# DICTEE6 — PHASE 1 : MAQUETTES POUR ARBITRAGE (aucun code livré)

**Base** : `DICTEE5/correction_dictee.html`, re-téléchargée et vérifiée — 596 070 o, md5 `be0dbf9e742a605707a13e5e934ea15a`. Hub en **lecture seule** (cinq nœuds `correction_dictee/*` téléchargés, aucune écriture). Les maquettes sont des copies locales : **rien n'est promu, rien n'est livré en code** — les fichiers HTML de travail restent chez l'exécutant. Rendu Playwright ; réserve déclarée : Google Fonts inaccessibles du banc, la police EB Garamond est remplacée par sa police de repli (Georgia) — les écarts mesurés en pixels peuvent varier de quelques points en production, pas les comportements.

## La matière — un constat qui corrige le mandat, déclaré

Les 4e Banksy et Pythagore sont bien les plus denses en erreurs (363 et 357), **mais aucune de leurs erreurs ne porte de mot fautif saisi** : elles ont été corrigées au mode rapide sans saisie, donc leurs copies affichent des **trous numérotés** — qui n'ont **pas de couche du dessus**. Le télescopage ne peut pas s'y voir. Il vit dans la **5e utopie** (517 fautifs saisis, 133 paires serrées) : c'est là que la matière a été prise.

**Les quatre cas, les mêmes pour les trois dispositions :**
- **cas 1 — deux corrections courtes voisines** : VIAU Lucie (réelle) — `leurs→leur` et `avaient→avait`, mots adjacents.
- **cas 2 — le « couchageroula »** : **copie de contrôle, déclarée** — aucune copie réelle ne reproduit le collage franc rapporté par Paul. Elle est construite sur le **texte réel de la 4e Banksy** (« …sac de couchage, le roula en boule… ») avec le scénario le plus vraisemblable du vécu : l'élève écrit court (« couch », « roul ») **et saute le « le »** (mot manquant M) — les trois corrections `couchage` `le` `roula` se lisent alors d'un seul bloc (écarts mesurés : 5 px).
- **cas 3 — trois corrections serrées dont un mot manquant** : BOUTON Amauri (réel) — **deux M adjacents** `l'` + `argent` (écart mesuré : **1 px** — le mot fantôme « l'argent » du défaut, textuellement) suivis de `a→à`.
- **cas 4 — correction longue en fin de ligne** : CLEMENT Lylou (réelle) — `avaient` affleure le bord droit de la feuille (−4 px).

**Preuve du défaut sur la base** : balayage des 31 copies de la 5e — collages réels mesurés : `eux`+`-` (0 px), `l'`+`argent` (1 px), `eux`+`-` (5 px, second élève). Le défaut préexiste, il est structurel (les couches du dessus flottent sans se voir).

## Les trois dispositions

### ⓐ La correction réserve sa place
**Ce qu'elle fait** : la correction cesse de flotter — si elle est plus large que le mot, le mot s'élargit (le texte s'écarte localement). **Ce qu'elle coûte** : l'espacement du texte devient un peu irrégulier aux endroits corrigés ; et sur les copies réelles l'effet est **modeste** — le mot fautif d'un élève est souvent presque aussi large que sa correction, donc peu de cas bougent ; le vrai gain se voit sur les M (le mot absent reçoit enfin une largeur). **Pour l'élève** : le texte reste dans l'ordre naturel de lecture ; les trous d'air disent « ici, quelque chose ». Les badges du dessous profitent du même écartement.

### ⓑ La correction se décale en hauteur
**Ce qu'elle fait** : deux corrections qui se toucheraient sont posées sur deux niveaux — la deuxième monte d'un étage. Le texte, lui, ne bouge pas d'un pixel. **Ce qu'elle coûte** : de la place au-dessus de la ligne — l'interligne actuel (3.4) l'absorbe sans rien changer ; la lecture des corrections devient légèrement « en escalier » aux endroits denses. **Pour l'élève** : chaque correction reste ENTIÈRE et lisible, même deux M adjacents (`l'` et `argent` se séparent nettement — capture chev-b-cas3) ; c'est la seule disposition qui résout le cas 3 sans perte.

### ⓒ Le garde-fou seul
**Ce qu'il fait** : un écart minimal (8 px) est garanti en réduisant la largeur des corrections en collision (troncature « … » + liseré). **Ce qu'il coûte — limite structurelle, montrée honnêtement** : quand les deux corrections sont déjà minuscules (deux M adjacents : `l'`, `argent`), il n'y a rien à tronquer sans tout perdre — la capture chev-c-cas3 montre `l.|` `a|` : le collage est évité mais **l'information est détruite**. **Pour l'élève** : jamais de mot fantôme, mais parfois une correction amputée qu'il faut aller deviner.

## Défaut supplémentaire observé (signalé, non corrigé — règle du mandat)
Les **badges du dessous (`layer-after`) se télescopent aussi** : sur le cas 2, le « −0,5 » du L est recouvert par le badge M (« −0, M ») ; sur le cas 3, « M M −1 » se lisent collés. Même cause (couches absolues sans voisinage). Aucune des trois dispositions maquettées ne le traite (le mandat portait sur les corrections) — à cadrer en phase 2 si Paul le veut : la disposition retenue s'y étend naturellement.

## Les couleurs — quatre variantes pour A (« Attention graphie »)

Constat vérifié : A `#b7791f` et M `#975a16` sont quasi jumelles (ΔE 14,9 — en deçà du discernable en lecture rapide ; pire en deutéranopie : 14,3).

**Méthode daltonisme (déclarée)** : simulation deutéranope par matrice de Viénot (sRGB→LMS, projection du canal M, retour sRGB), puis distance ΔE CIE76 en Lab. Repère : ΔE<20 = risque de confusion, 20–30 = limite, >30 = confortable.

| Variante | Ton | ΔE vs M | ΔE vs P | deutér. vs M | deutér. vs P | Verdict |
|---|---|---|---|---|---|---|
| A actuelle `#b7791f` | ocre | **14,9** | 81 | **14,3** | 104 | le défaut mesuré |
| **V1 `#475569`** | gris-ardoise | 63 | 60 | 91 | **13,7** | ⚠ **à écarter** : en deutéranopie, A se confond avec le magenta P |
| **V2 `#556b2f`** | vert olive foncé | 42 | 90 | 40 | 65 | ✔ **saine partout** (≥33 de toutes les couleurs de la table, deutéranopie comprise) |
| **V3 `#374151`** | anthracite | 63 | 62 | 83 | 29 | correcte ; limite avec P en deutéranopie (29) |
| **V4 `#2f6b4f`** | vert sapin | 59 | 90 | 84 | 27 | correcte ; limite avec P en deutéranopie (27) |

**Arguments des deux choisies** : V3 anthracite — « l'avertissement discret » : A n'est pas une faute comptée, un gris soutenu le dit sans crier, et il n'appartient à aucune famille de la table. V4 vert sapin — la famille « conseil » : un vert éteint dit « note bien » là où les fautes portent des couleurs vives ; testé distinct du turquoise E (vif et saturé, ΔE 34 en deutéranopie).

**Copie M+A côte à côte** : aucune copie réelle ne porte les deux types ensemble (vérifié sur les cinq dictées) — la capture utilise la copie réelle de BOUTON Amauri **plus une erreur A ajoutée** sur le mot juste voisin de ses deux M réels (copie de contrôle dérivée, déclarée). **Boutons de correction rapide** : la rangée `.fast-btns` est reconstruite avec **les générateurs réels de l'app** (`TYPE_STYLE` muté + `typeStyleCssApp()` + les règles `.fast-btn` du fichier, au caractère près) — l'app complète n'a pas été naviguée (elle exige Firebase vivant, hors banc) ; les couleurs capturées sont exactement celles que l'app produirait.

## Recommandation argumentée

**Disposition : ⓑ (le décalage en hauteur), éventuellement combinée au garde-fou ⓒ en filet.** Raisons : ⓑ est la seule qui résout le pire cas réel (deux M adjacents) **sans perdre une lettre ni déranger le texte** — or la copie est lue par l'élève et sa famille : le texte régulier est une qualité de lecture, et l'interligne 3.4 existant offre l'étage gratuitement. ⓐ est séduisante sur le papier mais son effet réel est faible (mesuré) et son irrégularité d'espacement se paie sur toute la copie ; ⓒ seul détruit de l'information exactement là où le défaut est le plus grave. La combinaison ⓑ+ⓒ (étager d'abord ; tronquer seulement si trois corrections s'empilent au même endroit) donne un plancher de sécurité sans coût courant.

**Couleur : V2 vert olive foncé `#556b2f`.** Seule variante confortable sur TOUS les axes, daltonisme compris ; sobre comme il convient à un signalement non compté ; et elle laisse l'anthracite disponible si un jour un neuvième type paraît.

## Captures livrées (`DICTEE6/captures/`)
`chev-base-cas1..4` (l'état actuel) · `chev-a-cas1..4` · `chev-b-cas1..4` · `chev-c-cas1..4` · `coul-1..4-copie` (M et A côte à côte) · `coul-1..4-boutons`.

---

## ⚠ PAUL CHOISIT — rien ne sera codé avant sa réponse

**Question 1 — la disposition** : ⓐ (la correction réserve sa place), **ⓑ (deux niveaux — recommandée)**, ⓒ (garde-fou seul), ou une combinaison (ⓑ+ⓒ recommandée en second choix) ?

**Question 2 — la couleur de A** : V1 gris-ardoise (déconseillée : daltonisme), **V2 vert olive foncé `#556b2f` (recommandée)**, V3 anthracite `#374151`, ou V4 vert sapin `#2f6b4f` ?

**Question 3 (ouverte par les maquettes)** : faut-il étendre la disposition retenue aux **badges du dessous** qui se télescopent aussi (défaut supplémentaire montré) ?

La phase 2 codera le choix retenu sur la base DICTEE5, règles habituelles : 0 fonction supprimée, tailles avant/après, `TYPE_COST` et `computeNote` intouchés, banc sur copies réelles, non-régression complète, captures.

# RELECTURE DE TÉLESCOPAGE — avant la livraison (a) de la v9c.14 : la diapo « Cahier de textes » (21/09/2026)
*Ce que la livraison (a) va faire : ajouter à la trame une diapo de rôle « fin » en dernière position de chaque heure, nommée « Cahier de textes », remplie par l'avancée réelle, avec quatre éléments dévoilés dans l'ordre (l'échéance en gros · le travail à faire dans l'agenda École Directe, modifiable dedans · le contenu de la séance (le récit) · qui a participé), et retirer le rendu à part `finHeure` de la v9c.13. Chaque mécanisme de la maquette est confronté à ce changement. Trois verdicts : ✔ rien à faire · ⚠ télescopage → la solution retenue · ⏳ reporté à une livraison suivante, sans dette cachée.*

## 1. La trame et l'ordre de l'heure
| Mécanisme | Ce qui se passe avec la diapo « Cahier de textes » | Verdict · solution |
|---|---|---|
| La trame de la maquette (`DATA.seances[].ecrans`, 19 diapos, index 0-18) | Deux diapos s'ajoutent (fin H1 après la diapo 8, fin H2 en dernier) : **tous les index de trame après la 8ᵉ se décalent de +1** | ⚠ Les bancs qui posent un index de trame en dur (`S.di = 7`, `data-i="8"` pour la réactivation…) se décalent → **solution : les bancs s'adressent aux diapos par leur titre ou leur rôle** (`diapoParTitre('Question-bilan')`, `diapoRole('reactivation')`), jamais par index ; le générateur et le gabarit reçoivent la diapo de rôle fin dans la trame, pas en ajout à la volée |
| `ordreHeureCalc(h)` : [réactivation de h] + [glissées] + [diapos de h] | La diapo fin de h est une diapo de h : elle vient en dernier naturellement **si elle est la dernière de son heure dans la trame** ; à H2 : … bilan, fin ✔ | ✔ + une garde : le rôle fin est **forcé en dernier** de l'ordre même si la trame le plaçait ailleurs (l'import du site le vérifiera, 4 · 2.6) |
| Le glissement (`glisse`, `finie`) | Une diapo fin non « finie » lundi (éléments non tous dévoilés) glisserait à mardi comme une activité | ⚠ → **le rôle fin ne glisse jamais, ne se retire jamais, n'entre pas en réserve** (6.4 bis) : `glisse()` exclut `role === 'fin'` ; `menuDiapo` désactive « retirer / réserve / dupliquer » pour ce rôle (comme pour les autres rôles, déjà `off: role`) ✔ |
| L'ordre figé au lancement (`S.ordres[h]`) | Rien ne change | ✔ |
| `rangDe` / `libDiapo` (numéros par rang) | « Diapo 9 sur 9 · heure 1 · Cahier de textes » | ✔ (le libellé ajoute le nom du rôle à la place du numéro d'activité) |
| `numDe` / `actDe` (l'activité) | La diapo fin n'a pas d'activité : `actDe` → null | ✔ déjà le cas des rôles (réactivation, bilan) |

## 2. Le rendu, le dévoilement, ce que la classe voit
| Mécanisme | Ce qui se passe | Verdict · solution |
|---|---|---|
| `rendre(mur, et)` — types de blocs (consigne, question, image, schéma, fiche, vidéo) | Il faut un rendu propre au rôle fin | ⚠ → **un type de bloc `cahier`** (un seul bloc, quatre éléments) rendu par `rendre()` comme les autres, au pilote et au tableau, à partir de l'état poussé (pas de calcul côté tableau) : l'état porte `cahier: { echeance, deja, travail, recit, qui }` — c'est l'actuel `finHeure`, renommé et rattaché à la diapo au lieu d'un mode |
| `elements(e)` (les éléments dévoilables : `b.el`) | Le bloc cahier n'a pas de `el` dans la trame (il est vide) | ⚠ → `elements()` renvoie **quatre éléments virtuels** pour un bloc `cahier` (échéance, travail, récit, participation), ainsi ▶, le compteur « n / 4 dévoilés », `finie()`, le journal `devoile` et le gris des non dévoilés marchent sans exception |
| Le gris des non dévoilés (`li.pas`, opacité 0,45 au pilote ; absents au tableau) | Les quatre éléments sont des blocs, pas des `li` | ⚠ → la même classe `pas` sur chacun des quatre blocs du cahier ; le tableau ne les rend pas (`!et.pilote && k >= nDev` → non rendu), comme pour un `li` ✔ |
| La loi de taille (5.4 : 32 / 26 pt au tableau) | L'agenda ED est dessiné en `cqh` (proportions de l'écran), pas en points | ⚠ → **le texte lisible par la classe** (l'échéance, le travail à faire, le récit, les prénoms) **suit la taille du tableau** (le curseur 32 pt, plancher 26) ; le décor de l'agenda (bandeau, titre « Cahier de textes », onglets) reste en proportions d'écran. Mesuré par le banc des tailles |
| La pagination (les éléments longs en pages) | Le récit est long | ⚠ → les paragraphes du récit sont **les unités de page** du bloc cahier (comme les réponses longues) ; la molette et « page suivante » marchent ; le tableau reçoit la page |
| Le gel, la lumière, le surlignage, la loupe, ✍ | S'appliquent à tout élément rendu | ✔ (les quatre éléments ont leurs `data-p`, les marques de surlignage s'y posent ; ✍ n'a pas de sens sur l'agenda mais ne casse rien) |
| Le morph (le nœud actif jamais réécrit) | Le travail à faire est un `contenteditable` dans la diapo | ✔ déjà le cas de `#ed-edit` (v9c.13) |
| `pousser()` (l'état au tableau, `S.mur`) | `finHeure` disparaît de l'état ; `cahier` ne s'envoie que quand la diapo courante est de rôle fin | ✔ (calcul dans `etatComplet()` conditionné au rôle) |
| La vue de droite « Diapo suivante » | Depuis la dernière activité, la suivante **est** le cahier de textes : la vignette le rend | ✔ (même moteur de miniature) ; « — fin de l'heure — » disparaît |
| Le volet (`volet`, `miniatures`) | Une vignette de plus par heure, titre « Cahier de textes », miniature de l'agenda | ✔ |

## 3. La fin d'heure telle qu'elle est aujourd'hui (v9c.13) — ce que (a) touche et ce qu'elle laisse
| Mécanisme | Ce qui se passe | Verdict · solution |
|---|---|---|
| `S.enFin`, `finHeure`, `#droite-fin`, `ouvrirFin(cloture)`, `brancherFin`, `#ed-edit`, `recitPourED`, `S.finVue` | Le rendu à part disparaît ; **la colonne des décisions reste** (elle devient la séquence en (b)) | ⚠ → en (a) : `ouvrirFin` n'appelle plus de vue du mur ; le champ ED dans la colonne est **retiré** (la diapo est le champ) ; les décisions restent dans `#droite-fin` tel quel jusqu'à (b). **État intermédiaire déclaré** : « Fin de l'heure » ouvre la colonne des décisions **et** va au cahier de textes (par la garde) |
| `t5()` (⚙ « faire arriver T-5 ») | Aujourd'hui : ouvre l'écran de fin | ⏳ (b) l'alerte ; en (a) : `t5()` **va au cahier de textes par la garde** (pour que Paul joue la diapo) ; dit tel quel |
| La garde (2.3 : tout saut hors du fil) | « Aller au cahier de textes » depuis l'alerte, la vignette, ▶ | ⚠ → **la garde du cahier de textes** (6.3 : restantes / validation / en avance, « Rester » / « Y aller ») remplace la garde ordinaire pour ce rôle, **y compris par ▶ depuis la dernière activité** (« Y aller » = la deuxième confirmation) |
| Le chrono de l'activité en cours / le chrono de l'heure | Au passage au cahier de textes : le temps de l'activité s'arrête, l'heure continue (6.3) | ⚠ → le journal reçoit `diapo` (début) pour le cahier comme pour toute diapo ; **le temps par diapo** (« ce qui s'est passé », le bilan) impute les minutes du cahier à « Cahier de textes », jamais à l'activité précédente ✔ mécanique existante ; le verdict (d) |
| `T-5` par activité (`cartes restantes`) | Le cahier de textes n'est pas une activité restante | ⚠ → les cartes excluent le rôle fin (comme le bilan) ✔ |
| Le bilan de séance (`bilanHtml`) | Une ligne « Cahier de textes (fin) » par heure | ✔ (la ligne existe pour tout rôle, `(fin)` affiché) |

## 4. Le récit, le journal, la relecture
| Mécanisme | Ce qui se passe | Verdict · solution |
|---|---|---|
| `recitHtml` | Le rôle fin ne doit pas être raconté (2 · 1.10) | ⚠ → `recitHtml` ignore `role === 'fin'` (comme il ignore déjà le gel, les pages) |
| Le récit **dans** le cahier de textes (élément 3) | Calculé par `recitPourED(h)` (existant), non modifiable en (a) | ⏳ (d) : les trois temps et « figer, puis modifier » ; en (a), le récit affiché est celui du moteur actuel, **lecture seule**, dit tel quel |
| Le journal (`diapo`, `devoile`, `travail-edite`, `tableau-onglet`) | Les gestes sur le cahier de textes entrent au journal comme ceux d'une diapo | ✔ ; `tableau-onglet` (le clic sur « Contenus de séances ») devient un geste de la diapo |
| « Ce qui s'est passé » | « diapo 9 — Cahier de textes : élément 1 dévoilé… » | ✔ |
| « Le chapitre » | — | ⏳ (f) |

## 5. Les bancs et le protocole
| Mécanisme | Ce qui se passe | Verdict · solution |
|---|---|---|
| Les bancs `test-v9c8/11/12/13` (ils lisent `.ed-agenda` au tableau via `finHeure` à T-5 et à « Fin de l'heure ») | La vue de fin n'est plus un mode : elle est la diapo | ⚠ → **réécrits par le geste** : aller au cahier de textes (garde → « Y aller »), ▶ quatre fois, lire l'agenda au tableau ; les autres bancs (participation, saisie, garde, rangs, tout cliquer, audit d'affichage, visuels) rejoués tels quels sauf les index en dur (§1) |
| Les visuels de l'ancien (34 objets) | Le cahier de textes n'existe pas dans l'ancien : écart voulu, déclaré | ✔ |
| L'audit d'affichage (1366 / 1536 / 1920, colonnes repliées) | L'agenda ED doit tenir à 1366 px sans déborder | ✔ mesuré par l'audit (règle « tout dans le même écran ») |

## Ce que (a) livrera, en clair
La diapo « Cahier de textes » dans la trame (deux, une par heure), en dernière de l'ordre, jamais glissée ; son bloc `cahier` à quatre éléments dévoilés par ▶ (l'échéance qui pulse · le travail à faire dans l'agenda, avec « déjà donné », modifiable dedans, les cases répercutées · le contenu de la séance (le récit actuel, lecture seule) · qui a participé avec ses métas) ; la loi de taille sur le texte lisible ; les pages sur le récit ; le gel, la lumière, le surlignage, la loupe ; la garde du cahier de textes (restantes / validation / en avance) par ▶, par la vignette, par « Fin de l'heure » et par ⚙ T-5 ; le rendu à part `finHeure` retiré, le champ ED de la colonne retiré, les décisions restant dans la colonne (jusqu'à (b)) ; le récit qui ignore le rôle fin ; les bancs réécrits par le geste et par titre. **Reporté, dit** : (b) l'alerte et la séquence, (c) les durées, (d) les trois temps et « figer », (e) Maj + P, (f) « Le chapitre ».

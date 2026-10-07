# p8-3c — le cahier, la diapo 6 de l'heure 2, les infobulles, le bloc question au tableau
*Exécutant, session cloud de Claude Code, 07/10/2026. Complément `MANDATS/COMPLEMENT-DEROULE-P8-3c.md` (C13, tours 20 à 24), lu après le mandat `MANDATS/MANDAT-DEROULE-MAQUETTE-P8.md` (version 3) et le complément p8-3b. Branche `deroule/p8-3c`, partie de `deroule/p8-3b`.*

## ⚠ D'abord : une consigne que je ne peux pas tenir, donc je m'arrête après cette livraison
Le complément (§ 2) demande, juste après la diapo 6 de l'heure 2, une diapo nouvelle qui porte « une consigne d'une ligne, puis un schéma qui tient dans la diapo ». Le schéma doit être « une carte de trois familles de la vraie carte (« Figures d'analogie », « Figures d'opposition », « Figures d'insistance », avec leurs notions) », avec une « mesure à zéro ».
**Mesuré : cette carte, sous sa consigne d'une ligne, ne tient pas.** Le moteur est celui de p8-3b, la police reste à 32 / 26 pt et je n'ai rien baissé. La mesure donne :
- **2 chevauchements** : « Figures d'opposition » × « oxymore », « Figures d'insistance » × « anaphore » ;
- 0 hors du cadre ;
- **1 trait à travers un mot** (« oxymore ») ;
- 0 libellé sur deux lignes, 0 police sous 26 pt.

C'est la même chose dans l'atelier (aux trois tailles d'écran) et au tableau (1280 × 720). La capture est `captures/p8-3c-diapo-plausible.png`.

J'ai mesuré d'autres cartes pour que la conscience puisse trancher. Ce ne sont que des relevés : je n'ai rien posé d'autre que ce que dit le complément. Mesure au tableau, avec la consigne d'une ligne puis sans elle (chevauchements · hors cadre · traits · deux lignes · sous 26 pt) :

| carte | avec la consigne d'une ligne | sans consigne |
|---|---|---|
| analogie, opposition, insistance, toutes leurs notions (la carte demandée) | 2 · 0 · 1 · 0 · 0 | 2 · 0 · 2 · 0 · 0 |
| analogie, opposition (les deux premières familles) | 0 · 0 · 1 · 0 · 0 | — |
| insistance, amplification | 1 · 0 · 0 · 0 · 0 | **0 · 0 · 0 · 0 · 0** |
| opposition, insistance, atténuation | 3 · 0 · 0 · 0 · 0 | **0 · 0 · 0 · 0 · 0** |
| opposition, atténuation, syntaxiques | 2 · 0 · 1 · 0 · 0 | **0 · 0 · 0 · 0 · 0** |
| atténuation, syntaxiques, sonores | 4 · 0 · 2 · 0 · 0 | **0 · 0 · 0 · 0 · 0** |

**Ce que ça dit.** Avec la consigne d'une ligne au-dessus, la place qui reste au schéma est trop basse. Dans le moteur repris, aucune carte de deux ou trois familles de la vraie carte ne tient alors à 32 / 26 pt. Sans consigne, plusieurs cartes de trois familles tiennent, mais pas celle que le complément nomme.

Je n'ai baissé ni la police ni rien d'autre, et je n'ai pas remplacé la carte demandée par une autre. **Donc** `test-p8-3c` finit à **1 défaut** (exactement celui-là), et le banc unique dit « ÉCHEC ». Je le déclare ici et **je m'arrête après p8-3c : je ne fais pas p8-4**. C'est la règle du mandat : « si une livraison ne peut pas être finie sans dette, tu le dis dans sa NOTE et tu t'arrêtes là : tu n'enchaînes pas ».

Ce que la conscience peut porter à Paul :
- (a) la même diapo **sans** consigne, avec trois familles qui tiennent (par exemple « opposition, insistance, atténuation ») ;
- (b) une consigne d'une ligne et une carte de **deux** familles plus courtes, à mesurer ;
- (c) garder la carte demandée et l'accepter « trop dense », coupée par « Couper le schéma ici ».

Tout le reste de p8-3c est fait, et les bancs le vérifient.

## Ce que ça change pour la classe
- « À régler » ne dit plus de fausse alerte : les deux diapos « Cahier de textes » n'y sont plus.
- La diapo 6 de l'heure 2 redevient sa consigne seule. « + bloc » y marche, et un schéma posé là part sur une diapo nouvelle, juste après.
- Les gestes grisés ne disent plus « Grisé ». Ils disent ce qui empêche, puis quoi faire.
- Au tableau, chaque question se dévoile à son tour (▶), et ses lignes la suivent. Une ligne de réponse vide garde sa hauteur : son chevron n'est plus recouvert par la question suivante.

## La base et son md5
- Base : le gabarit livré en p8-3b, `../p8-3b/v9c15p8-template.html`, md5 `74eab91f63045e7daf7d1cd6b99133de`.
- `regen.sh` refait toute la chaîne : gabarit p7 → patch p8-2 → patch p8-3 → patch p8-3b → **patch p8-3c** → générateur `T159`. Avant d'appliquer p8-3c, il vérifie octet pour octet que les gabarits p8-2, p8-3 et p8-3b qu'il produit sont ceux qui ont été livrés. Sa sortie est dans `sorties/regen.txt`.
- Livrés :
  - le gabarit `v9c15p8-template.html` et la maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` (md5 en fin de NOTE) ;
  - les patches `patch-p8-2.py` (+ `p8-moteur.js`), `patch-p8-3.py` (+ `p8-3-gestes.js`), `patch-p8-3b.py` et `patch-p8-3c.py`.

## Ce que j'ai mesuré avant de corriger
### Le cahier de textes (§ 1)
- **La cause est confirmée.** La liste `TYPES` (`consigne, texte, question, fiche, schema, image, video, page, doc`) apparaît deux fois : dans `rendre` et dans `alertesForme`. Elle ne contient pas `cahier`.
- **La diapo « Cahier de textes » a déjà son propre rendu.** C'est la branche `b0.t === 'cahier' && et.cahier` de `rendre` : la fiche « Cahier de textes » de l'ENT, avec le travail à faire, les contenus de séances et qui a participé. `test-cahier-p7` le prouve, et le banc p8-3c le vérifie par le geste. Donc `cahier` entre dans les deux listes.
- **Les autres types de la maquette absents de `TYPES`** :
  - **`html`** : il n'apparaît qu'une fois, dans le compte « Pages HTML » de la carte « Le chapitre » (`b.t === 'html' || b.t === 'page'`). Aucun code ne crée un bloc `html`, aucun ne le rend, et la trame n'en contient pas. C'est un ancien nom de `page`, qui ne compte que dans ce total. Je ne l'ajoute pas.
  - **`tableau-double`** : c'est le vrai objet inconnu posé exprès par la simulation p4a sur « Trois mots pour la frise ». La maquette ne sait pas l'afficher, donc il **reste** signalé, et c'est juste.
  - Aucun autre : j'ai relevé tous les types créés par le code et ceux présents dans la trame, à savoir consigne, texte, question, fiche, schema, image, video, page, doc, cahier.

### Le bloc question (§ 4)
**Le modèle actuel, mesuré dans p8-3b.** Un bloc question, c'est sa question (`txt`, affichée en `<p class="q">`), ses lignes (`el` : la réponse attendue, et toute ligne ajoutée par « + étape » ou par Entrée) et les réponses des élèves (`reps`, en `.rep`). **Un « élément » (un ▶) est une ligne de `el`** ; la question n'en est pas un. Elle est donc montrée dès l'arrivée sur la diapo, au pilote comme au tableau. C'est pourquoi, sur la capture de Paul (T23), « que doit-on faire ? » paraît d'emblée. Rejoué sur p8-3b (`captures/MESURES-avant-p8-3c.txt`) : à 0 ▶, les deux questions sont au tableau.

**Le chevron recouvert, et sa cause.** Paul avait appuyé sur Entrée en fin de ligne sous « Inclassable… », ce qui crée une ligne vide (`el: [..., '']`). Au tableau, ce `<li>` vide n'a que sa marge intérieure (0,24 em) ; son chevron, posé en absolu, déborde sur la question suivante. Mesuré sur p8-3b : 1 chevauchement à 2 ▶ et à 3 ▶ (`li «  » × q « que doit-on faire ? »`). La capture est `captures/p8-3c-ligne-vide-tableau-avant.png`.

**Ce que j'ai fait, et comment je l'ai lu.** La question devient un élément, juste avant ses lignes : « chaque question se dévoile à son tour (▶), jamais avant ».
- **Lecture dite** : je l'applique à **toute** question, y compris la première de la diapo. Sur « Question-bilan », le premier ▶ montre la question, le second sa réponse attendue. C'est aussi ce que faisait l'ancien moteur : il dévoilait chaque bloc entier à son tour (`rev`), puis ses éléments (`vues`).
- Le bloc de test du complément (« au premier ▶, la première question seule ; au ▶ suivant, la seconde ») est fait avec « + bloc → Question… ». Ce formulaire exige la réponse attendue : chaque question y a donc une ligne, et la seconde question paraît au ▶ qui suit cette ligne. Le banc vérifie l'ordre exact : question, sa ligne, question, sa ligne.

## Ce qui a été modifié, compté
`patch-p8-3c.py` fait 19 remplacements, chacun exigé le nombre de fois dit. Les tailles sont écrites par le patch (`sorties/regen.txt`), et j'ai relu chaque fonction touchée en entier.

| fonction | avant | après | quoi |
|---|---|---|---|
| `rendre` | 17 071 o / 52 lignes | 17 459 o / 52 lignes | `cahier` dans `TYPES` ; la question porte son élément (`data-k`, pâle tant qu'elle n'est pas dévoilée) ; ses réponses et sa ligne de réponse libre la suivent (absentes au tableau, pâles au pilote) |
| `alertesForme` | 7 977 o | 8 033 o | `cahier` dans `TYPES` |
| `elements` | 803 o | 966 o | la question est un élément, avant ses lignes (`e: 'q'`, `q: true`) |
| `recitHtml0` | 16 363 o | 16 426 o | une question posée sans réponse d'élève : la réponse attendue « vue en classe » se compte sur ses lignes dévoilées. Avant, on comptait les éléments de toute la diapo, ce qui, avec la question devenue élément, aurait compté un de trop |
| `ouvrirFin` | 17 695 o | 17 728 o | les cartes de fin d'heure pâlissent aussi une question non dévoilée (`[data-k]` au lieu de `li[data-k]`) |
| `p8GardeObjet` | 257 o | 465 o | les raisons, écrites pour Paul |
| `p8GardeColler` | 207 o | 285 o | la raison, écrite pour Paul |
| `p8GardesBarre` | 763 o | 1 311 o | les raisons de chaque bouton, sans « Grisé » |
| `p8MenuBulle` | 1 231 o | 1 372 o | « Couper le schéma ici » : ce qui empêche, puis quoi faire |
| `menuAtelierMur` | 6 748 o | 6 848 o | « Dupliquer le bloc », « Coller ici », la taille d'un schéma |
| `poserBarreBloc` | 1 849 o | 1 908 o | « + étape » de la barre du bloc |
| `choixObjet` | 1 279 o | 1 247 o | la carte grisée de « + bloc » dit quoi faire (infobulle et texte de la carte) |
| style | — | +4 règles | `li:empty{min-height:calc(1lh + .24em)}` : une ligne vide garde la hauteur d'une ligne écrite (dans la maquette, `box-sizing` compte la marge intérieure) ; `.q.pas` et `.rep.pas` pâles au pilote, absents au tableau. Aucune classe nouvelle : `q`, `rep`, `pas` existaient déjà |
| simulation | 288 o | 1 521 o | `b-sim-schema` (p7) est retirée. À sa place, la diapo `e-sim-schema-plausible`, juste après « Les mouvements du siècle » : même heure, même activité, mêmes notions, la durée partagée (8 min → 4 + 4) |

**La diapo plausible.**
- Son titre : « Les mouvements du siècle (suite) ».
- Sa consigne est prise telle quelle dans le chapitre (`CONSULTANT/CHAPITRE-1/chapitre-3e-poesie-peinture-final.json`, séance 2, diapo « La famille des images ») : « Les figures, elles, rapprochent des idées. » La phrase entière (« Le champ lexical rassemblait des mots. Les figures, elles, rapprochent des idées. ») ne tient pas sur une ligne : j'ai pris sa seconde moitié, qui est une phrase complète.
- La carte : les trois familles demandées, avec toutes leurs notions.

### Les infobulles, avant → après (le relevé complet du banc est dans `captures/INFOBULLES-p8-3c.txt`, 62 lignes)
| geste | avant (p8-3b) | après (p8-3c) |
|---|---|---|
| « + bloc » (diapo à schéma et à consigne) | Grisé : une diapo à schéma porte son titre, le schéma et au plus une consigne d'une ligne (un schéma par diapo). | Cette diapo a son schéma : écris la suite dans la diapo suivante, ou coupe : clic droit sur le schéma → Couper la diapo ici. *(l'exemple du complément, mot pour mot)* |
| « + étape » (barre de l'atelier et barre du bloc) | Grisé : … : pas d'étape en plus (un schéma par diapo). | Cette diapo a son schéma : une étape de plus va dans la diapo suivante — écris-la là, ou insère une diapo (Ctrl + Entrée). |
| « + image », « + fiche… », « + vidéo… », « + document… » | Grisé : une diapo à schéma porte… (un schéma par diapo). | Cette diapo a son schéma : pose l'image (la fiche, la vidéo, le document) dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour elle (lui). |
| « + bloc » → « Schéma… » (diapo qui a son schéma) | Grisé : une diapo n'a qu'un schéma. | Cette diapo a déjà son schéma, et une diapo n'a qu'un schéma : pose le nouveau dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) et pose-le là. |
| « + bloc » → les autres cartes | Grisé : une diapo à schéma porte… : donne à ce contenu sa diapo. | Cette diapo a son schéma : écris ce contenu dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour lui. |
| « Dupliquer le bloc » (bloc autre qu'un schéma) | grisé : une diapo à schéma porte… | Cette diapo a son schéma : un second bloc n'y entre pas — copie ce bloc (Ctrl + C) et colle-le dans la diapo suivante |
| « Coller ici » | grisé : une diapo à schéma porte… : ce bloc n'y entre pas | Cette diapo a son schéma : colle ce bloc dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour lui |
| taille d'un schéma | libellé « Taille : petit (grisé) · [normal] · grand » ; « « petit » est grisé pour un schéma : … » | libellé « Taille : [normal] · grand » ; « Un schéma garde ses libellés à 32 et 26 pt pour être lu du fond : il n'a pas de taille « petit » — ce geste passe de normal à grand, et retour » |
| « Couper le schéma ici » sur la première famille | rien avant : rien à couper | rien avant : rien à couper — fais le clic droit sur une famille plus loin : elle et la suite partiront dans un second schéma |
| « Couper le schéma ici » sur une notion | Clic droit sur une bulle de tête (…) : c'est là que le schéma se coupe | Cette bulle n'est pas une bulle de tête : le schéma se coupe sur une famille, un repère, un nœud de premier niveau, une étape ou une rangée — fais le clic droit sur l'une d'elles |

## Les bancs, comptés
- **`test-p8-3c`** (nouveau, 26 `ok(`), par le geste :
  1. « À régler » au chargement : 0 « Objet non lisible » pour un objet que la maquette sait afficher, et 0 « Schéma avec du texte ». Le vrai objet inconnu (`tableau-double`) reste signalé. La diapo « Cahier de textes » s'affiche par son rendu, sans alerte.
  2. **L'épreuve, sur une copie** de la maquette, écrite dans un dossier temporaire puis effacée (jamais ce que Paul joue). Le banc y pose un objet `frise-animee` et un schéma sous une consigne de plusieurs lignes, puis vérifie :
     - les deux sont signalés dans « À régler » ;
     - « Sur la forme » dit « Schéma avec du texte » ;
     - après « Couper la diapo ici », la ligne tombe.
     C'est l'ancienne partie 6 de `test-p8-3-gestes`, déplacée sur la copie.
  3. La diapo 6 de l'heure 2 : sa consigne seule, « + bloc » actif. « + bloc » → « Schéma… » pose le schéma sur une diapo nouvelle juste après, et la diapo 6 ne change pas. La diapo plausible : « une consigne d'une ligne, puis un schéma », **mesure à zéro ← le défaut déclaré**.
  4. Les infobulles des gestes grisés : 62 relevées dans 9 situations (barre de l'atelier, barre du bloc, menus du bloc, cartes de « + bloc », menus des bulles, taille). Aucune ne contient « grisé », aucune n'est vide, et chaque geste grisé de p8-3 est vu.
  5. Le bloc question :
     - (a) deux questions sur une diapo insérée. Les éléments sont exactement question, sa ligne, question, sa ligne. Au premier ▶, la première question seule, au pilote et au tableau. La seconde paraît à son ▶. Aucune ligne ne se chevauche, à aucun ▶, au pilote ni au tableau.
     - (b) le cas de Paul : une ligne vide par Entrée en fin de ligne, puis une seconde question. 0 chevauchement à tous les ▶.
- **`avant-p8-3c.mjs`** (un relevé, hors du banc unique) : les captures « avant » sur la maquette p8-3b, avec leurs comptes (`captures/MESURES-avant-p8-3c.txt`).
- **Recalés** (chaque vérification changée est marquée « recalé en p8-3c » dans le banc) :
  - `test-p8-3-gestes` (54 → 49 `ok(`) :
    - § 3 : 4 vérifications d'infobulle. Elles cherchaient « Grisé » ; elles cherchent maintenant ce qui empêche et quoi faire (« + bloc » : l'exemple du complément, mot pour mot) ;
    - la taille : 1 vérification. « petit » n'est plus proposé, et l'infobulle dit pourquoi ;
    - § 2 : la partie 6, « À régler » sur la trame d'avant la règle (5 `ok(`), part sur la copie, dans `test-p8-3c`.
  - `test-p7-schema-envoi` (13) :
    - le premier schéma de la trame est la carte plausible : 10 → 14 bulles (3 vérifications) ;
    - le « schéma qui ne tient pas » est la vraie carte, plus `b-sim-schema` ;
    - l'infobulle de « + bloc » ne commence plus par « Grisé ».
  - `test-p1-p7` (16) : la colonne compte 23 diapos (22), et « Diapo 2 sur 14 » (13), à cause de la diapo plausible.
  - `test-p3-p7` (27) : la colonne compte 24 diapos après la duplication (23).
  - `test-b5-p7` (17) : « Question-bilan finie », c'est maintenant ses 2 éléments (la question, puis sa réponse), plus 1.
  - `test-cahier-p7` (23) : un ▶ de plus sur « Question-bilan », d'abord la question puis sa réponse, avant la garde du cahier.
- Inchangés : les 20 autres bancs, dont `test-p8-2-formes`, `tout-cliquer-p7` (tout cliquer sans erreur JS) et `audit-affichage-p7` (trois tailles d'écran, colonnes ouvertes et repliées).
- 27 bancs dans le banc unique, 565 `ok(` en tout.

## Les captures (toutes regardées, écran entier) — les chiffres sont dans `captures/MESURES-p8-3c.txt` et `captures/MESURES-avant-p8-3c.txt`
| capture | ce qu'elle prouve |
|---|---|
| `p8-3c-a-regler-avant.png` / `p8-3c-a-regler-apres.png` | « À régler » au chargement : 9 lignes, dont 2 « Objet non lisible « cahier » » et 1 « Schéma avec du texte » → 6 lignes, sans aucune des trois. Restent : la fiche non liée, `tableau-double`, la page sans contrat, la vidéo sans fichier, et deux « ne tient pas lisible » : la vraie carte (attendu) et la carte plausible (le défaut déclaré) |
| `p8-3c-diapo6-H2-avant.png` / `p8-3c-diapo6-H2-apres.png` | avant : la consigne de quatre lignes **et** la carte entassée dessous, « + bloc » grisé, infobulle « Grisé : … ». Après : la consigne seule, « + bloc » actif |
| `p8-3c-diapo-plausible.png` | la diapo plausible juste après le geste de Paul. **On y voit le défaut** : « oxymore » chevauche « Figures d'opposition », « anaphore » chevauche « Figures d'insistance » ; « Sur la forme » le dit |
| `p8-3c-epreuve-copie.png` | sur la copie : « Objet non lisible « frise-animee » », « Schéma avec du texte » et « Trois inventions » sont signalés |
| `p8-3c-questions-tableau-1.png` / `p8-3c-questions-pilote-1.png` / `p8-3c-questions-tableau-3.png` | au premier ▶ de la première question, le tableau ne montre qu'elle ; au pilote, la seconde est pâle, à sa place ; à son ▶, la seconde paraît au tableau, sous la réponse de la première |
| `p8-3c-ligne-vide-tableau-avant.png` / `p8-3c-ligne-vide-tableau.png` | le cas de Paul. Avant : le chevron de la ligne vide passe sous « que doit-on faire ? », qui est déjà là. Après : la ligne vide a sa hauteur et son chevron, et la seconde question n'est pas encore dévoilée |

## Le banc unique, résultat
Voir la fin de la NOTE.

## Les défauts trouvés et corrigés (avec leur cause)
1. Dans mon banc, une ligne vide comptait un faux chevauchement. **Cause** : j'estimais la hauteur de son chevron à 1,2 × la police. Corrigé : le banc la mesure sur une ligne témoin, posée puis retirée.
2. **La ligne vide recouvrait encore la question au pilote en répétition.** **Cause** : `min-height: 1lh` ne compte pas la marge intérieure, parce que `box-sizing` la compte dans la hauteur dans la maquette. Corrigé : `calc(1lh + .24em)`.
3. Le premier passage des 26 bancs a cassé 6 bancs, tous recalés ci-dessus. 4 d'entre eux venaient de la diapo de plus et de la question devenue élément ; 2 venaient de `b-sim-schema` retirée et des infobulles réécrites.

## Ce qui est simulé
- La diapo plausible (`e-sim-schema-plausible`), déclarée ci-dessus. Elle remplace `b-sim-schema`.
- La vraie carte, en H2 (p8-3), sans changement.
- `tableau-double` et la page sans contrat (p4a), sans changement.

## Ce qui reste
- **La consigne non tenue** (en tête) : à trancher par Paul, via la conscience. **p8-4 n'est pas commencée.**
- L'import et son refus : mandat de production.

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`
- Lancé le 2026-10-07 à 05:20 UTC : node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37.
- Maquette jouée : md5 `ce10a90c74111b70239487df1d3bebe2`, celle qui est livrée.
- 27 bancs :
  - **26 à 0 défaut** ;
  - **`test-p8-3c` : 1 défaut**, exactement celui qui est déclaré en tête : « la diapo « consigne d'une ligne + schéma » ne tient pas lisible — 2 · 0 · 1 · 0 · 0 » ;
  - dernière ligne : **ÉCHEC**.
- Je m'arrête ici. p8-4 n'est pas faite.

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `ce10a90c74111b70239487df1d3bebe2`
- gabarit `v9c15p8-template.html` : `65d123c91a7c99aaa99e44df9f212969`
- base (gabarit p8-3b) : `74eab91f63045e7daf7d1cd6b99133de`
- tous les fichiers livrés : `EMPREINTES.md5`, vérifié par `md5sum -c` avant l'envoi.

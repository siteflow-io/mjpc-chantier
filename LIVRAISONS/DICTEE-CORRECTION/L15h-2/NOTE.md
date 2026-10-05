# DICTÉE — L15h-2 — le reclassement RÉEL en C (accent / majuscule / trait d'union)

*Exécutant du complément L15, livraison **L15h-2** (dette n°12 · 126), après la relecture du rapport à blanc par la conscience (`MANDATS/RELECTURE-L15.1a-ET-L15h-1.md`, valant ok de Paul). Rien n'est promu.*

## Ce que ça change
- **Les 25 erreurs validées passent de L en C** : Dylan 10 (8 copies), Franklin 4 (4), Hugo 9 (5), Turing 2 (2). **Les deux lignes rayées restent en L** : « ce-là » pour « cela » (Dylan, copie n° 9) et « mémé » pour « même » (Turing, copie n° 1).
- **Comment** : l'app garde **la liste exacte validée** (dictée, place dans le texte, forme recopiée, mot attendu — **aucun nom**, 19 entrées pour 25 erreurs) ; **une seule fois par dictée, à son ouverture par le professeur** : la corbeille d'abord (`reclassement-accents_<hhmmss>_<clé>`, une entrée par copie touchée), le type L → C, **la note recalculée par la seule fonction** (L15g ; la copie aménagée : sa base et ses trous), **les objets de L10 republiés** avec le type C, la marque `correction_dictee/<id>/migrations/reclassementC_v1` ({le, erreurs, copies, version}) et le message **« n erreurs reclassées en C (accent, majuscule, trait d'union) dans m copies ; l'état d'avant est dans la corbeille. »** ; une seconde ouverture ne refait rien.
- **Les notes** (mesuré, copie locale des données du hub lues le 05/10 à 18 h, aucune écriture au vrai hub) : **aucune note ne baisse** ; au Brevet, le C entre dans le forfait : **5 notes montent chez les Dylan, 3 chez les Franklin** ; en Préparée, C et L coûtent 0,5 : **aucune copie ordinaire ne bouge**.
- **⚠ Une copie aménagée des Hugo change de note : copie n° 21, 5/10 → 15/20.** Ce n'est pas le C : sa note enregistrée était encore calculée sur 10, alors que la version aménagée des Hugo est sur 20 ; recalculée (comme toute copie touchée, L15g / dette 130), **elle prend la base 20 avec la même déduction (5 points) : 15/20**. *À confirmer par Paul* : c'est la conséquence voulue de la dette 130 (« les copies aménagées suivent leur base »), mais c'est un changement de note visible.

## Vérifié avant de livrer
**La simple ouverture des quatre dictées, avec la version EN LIGNE (L15h-b), ne change aucune note**, dans les vraies conditions (registre des classes, formes acceptées par texte, formes capitalisées, réglages du site — tous chargés). *(Une première mesure, sur une copie locale incomplète, avait semblé montrer des baisses : c'était la copie, pas l'app.)*

## Le fichier
- Base : **L15.1b-1** (livrée, pas encore promue ; md5 `178cbb58dea607d72a363638bffd5f12`), elle-même partie de la **6.7.0-L15h-b en ligne** (md5 `1a154f3810fa5c9a1ba7ca411f3c9a78`, vérifiée à la commande) → **6.7.0-L15h-2** : **947,771 o** (+6,326), md5 `02a8b6919851efc041e6f6709aa8f971`.
- Ajoutés : `RECLASSEMENT_C_L15H2` (la liste validée), `reclasserCL15h2` ; modifié : `load` (l'ouverture d'une dictée, une fois). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`)
**`banc_L15h2_reel.py`** (par le geste : l'ouverture de chaque dictée par le professeur, sur une **copie locale** des quatre dictées et des données dont elles dépendent, lues au hub en lecture seule à chaque passage — rien n'est écrit au vrai hub, aucun nom affiché ; 11 vérifications) : **10 / 4 / 9 / 2 = 25** reclassées ; **une entrée de corbeille par copie touchée** (8, 4, 5, 2) ; **les deux rayées restées en L** ; **aucune note ne baisse** ; **en Préparée, aucune copie ordinaire ne bouge** ; **une seconde ouverture ne refait rien** ; 0 erreur ; et la mesure de la copie aménagée (copie n° 21 des Hugo : 5 → 15, base enregistrée 10).
**Banc unique sur L15h-2 : VERT, 0 échec, 38 étapes** (`sorties/`) : … L15h-1, L15.1b-1, L15h-2, vue élève identique à la 6.6.3.

## Capture (`captures/`)
`H2-message.png` — l'ouverture de la dictée des Dylan (Préparation, aucun nom) : le message « 10 erreurs reclassées en C … dans 8 copies ; l'état d'avant est dans la corbeille. »

## Tes tests, après promotion (L15.1b-1 puis L15h-2)
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → ouvre la dictée des Dylan : le message « 10 erreurs reclassées en C… dans 8 copies » ; rouvre-la : plus de message.
2. Une copie concernée (ex. « vehicules » pour « véhicules ») : l'erreur est en C (orange), la note au Brevet a monté si le forfait l'absorbe.
3. Les Franklin (4), les Hugo (9), les Turing (2) : idem à l'ouverture ; « ce-là » (Dylan) et « mémé » (Turing) sont restées en L.
4. La corbeille : une entrée « reclassement-accents » par copie touchée.

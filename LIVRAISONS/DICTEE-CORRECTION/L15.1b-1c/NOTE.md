# DICTÉE — L15.1b-1c — 477 : la phrase « À recopier » d'après l'écart

*Paul, 05/10 (477 : « oui »). Complément de L15.1b-1, après L15h-2. Rien n'est promu.*

## Ce que ça change pour la classe
La phrase « À recopier sur la copie » (copie rendue et écran de l'élève) choisissait son engagement (« et pour la prochaine, je devrai … ») **d'après le mot attendu seul** : sur une copie avec des pluriels et une consonne double, elle disait « vérifier la terminaison des verbes à l'imparfait ». **Elle le choisit maintenant d'après l'écart** (la catégorie de l'analyse, L15.1) : pour chaque erreur recopiée du type le plus fréquent, **l'écart qui va avec le type posé** (une G : l'accord, pas la consonne double) donne l'engagement ; le plus fréquent l'emporte ; sans recopie, comme avant (le mot).
**Aucune phrase nouvelle** : les engagements sont **ceux déjà écrits dans l'app** (`ENGAGEMENTS_ASTUCE`, `ENGAGEMENTS_TYPE`) — pluriel → « accorder chaque mot avec le déterminant pluriel qui le précède » ; accords du verbe, féminin… → « chercher le sujet de chaque verbe et le nom de chaque adjectif pour faire les accords » ; imparfait / passé simple → « vérifier la terminaison des verbes à l'imparfait (-ais, -ait, -aient) » ; -é / -er → « remplacer par « mordre » ou « mordu »… » ; homophone → celui du mot (a/à, on/ont…) ; consonne double → « penser à un mot de la même famille… » ; accent → « écouter le son du « e »… » ou « retenir les mots qui prennent un accent circonflexe » ; cédille → « mettre une cédille… » ; élision → « faire l'apostrophe… » ; le reste du lexique → « apprendre l'orthographe des mots que j'ai mal écrits ».

## Le fichier
- Base : **L15h-2** (livrée, pas encore promue ; md5 `02a8b6919851efc041e6f6709aa8f971`) → **6.7.0-L15.1b-1c** : **949,974 o** (+2,203), md5 `8f3916a2d516de5bc470eb576e90b559`.
- Ajoutés : `engagementPourCategorieL151`, `categoriePourEngagementL151` ; modifiés : `phraseARecopier` (l'écart d'abord ; un 4e argument, le texte, pour lire le mot d'avant) et ses deux appels. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`)
**`banc_L151c_477.py`** (par le geste : la copie téléchargée, celle de la capture d'hier — « naturelement » L, « centres » G, « préocupation » G) : **« … surtout de grammaire, et pour la prochaine, je devrai accorder chaque mot avec le déterminant pluriel qui le précède. »**, plus « imparfait » ; **sur L15h-2 (avant) : « … vérifier la terminaison des verbes à l'imparfait (-ais, -ait, -aient). » — rouge**.
**Banc unique : VERT, 0 échec, 39 étapes** (`sorties/`).

## Capture (`captures/`)
`R1-a-recopier.png` — la copie rendue : « À recopier sur la copie » avec le nouvel engagement.

## Ordre de promotion
L15.1b-1 → L15h-2 → L15.1b-1c.

## Tes tests, après promotion
1. Données → Copies → une copie avec des erreurs recopiées : « À recopier » dit un engagement qui correspond à ses erreurs (pluriels → « accorder chaque mot avec le déterminant pluriel… »).
2. Côté élève, en fin d'autocorrection : la même phrase.

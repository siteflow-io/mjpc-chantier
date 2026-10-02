# MICRO — correction_dictee 6.7.0-L6b — Entrée avance, même sur un signe (dette n°12 · 98)

*Conscience n°12, 02/10/2026, filière micro. Rien n'est promu.*

## Le télescopage (Paul, 02/10)
En mode rapide, Paul avance avec Entrée. Depuis L3, sur un signe de ponctuation, Entrée validait le bouton mis en avant « Ponct. manqu. ↵ » : chaque signe traversé devenait une erreur P (sa capture : « , P », « - P », « ' E »). Faute de cadrage de la conscience (tour 341 : « j'ai juste à valider avec Entrée » pris sans mesurer qu'Entrée = correct/suivant depuis toujours).

## Le fichier
- Base 6.7.0-L6 en ligne (746 811 o, md5 `c28534fac49660fde55a51c2623a4324`) → **6.7.0-L6b** : 746 933 o (+122), md5 `dd66cd92f7d1208178dc9987eec83b28`. 5 lignes changées : Entrée → `fastSkip()` (comme Espace, comme avant L3) ; les libellés « Ponct. manqu. (M) » / « Élision (M) » ; la ligne d'aide « Entrée = correct, mot suivant ». `node --check` 0 erreur.
- Le bouton mis en avant reste (il dit maintenant « (M) ») ; M le valide (M s'adapte depuis L3).

## Bancs (kit anonymisé, faux hub)
`banc_L6b_geste.py` : Entrée sur un point → avance, 0 erreur ; Entrée sur une virgule → 0 erreur ; M sur un point → P ; Entrée sur un mot → avance ; l'aide dit « Entrée = correct », plus « valide le bouton » ; le libellé « (M) ». **VERT sur L6b, ROUGE sur L6.** `fuzz_rapide.py` accordé (Entrée n'est plus une marque) : 0 bug ; S1/S3 sans perte ; banc L6 (fin de copie) VERT ; vue élève identique.
Le banc L3 (`banc_L3_geste.py`) attend encore « Entrée sur un signe → P » : il est à accorder par l'exécutante à sa prochaine livraison (sa vérification « Entrée valide » devient « M valide »).

## Les copies touchées
Les P posées par Entrée depuis la promotion de L3 (01/10 22:24) ne se distinguent pas d'une P voulue (pas d'horodatage sur les copies rapides) : Paul les retire au clic (mode texte : clic sur le signe → retirer) dans les copies qu'il a corrigées depuis.

## Capture
`captures/L6b-entree-point.png` : Entrée sur un point, le mot suivant, aucune erreur.

## Tes tests, après promotion
https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une copie en mode rapide → Entrée sur un signe : il passe, rien n'est marqué ; M sur un signe : « P » ; la ligne d'aide dit « Entrée = correct ».

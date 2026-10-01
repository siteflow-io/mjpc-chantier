# DICTÉE — L'ÉCRAN DE CORRECTION · L5 — le reclassement réel, la ponctuation en trop automatique, le bouton « M→P » retiré

*Exécutant du mandat « L'écran de correction ». Forme (B) du rapport L4, « ok » de Paul (01/10). Rien n'est promu.*

## Ce que ça change pour toi
- **À la première ouverture de chaque dictée** (professeur), le reclassement du rapport L4 s'applique **une fois** aux copies qui portent encore l'un des deux cas : un « M » posé sur un signe → « P » ; un signe « en trop » → compté au **forfait ponctuation** (il reste où l'élève l'a écrit, marqué « P »). **Avant, l'état de chaque copie touchée part dans la corbeille** (motif `reclassement-ponctuation`, une entrée par copie, **restaurable** depuis la corbeille de la console : elle remet la copie d'avant à sa place). Une ligne le dit : « ✓ n copies reclassées (ponctuation) — l'état d'avant est dans la corbeille. » Les copies sans ces cas ne sont pas touchées ; la note est recalculée sur la base de chaque copie ; **tout le reste de la copie est gardé** (sa trace, ses positions, son commentaire) ; l'autocorrection de l'élève suit (un « M » devenu « P » y change de type aussi).
- **Au hub, à tes premières ouvertures** : exactement le rapport L4 — 21 copies (brevet blanc 3E : 11, Banksy : 5, Pythagore : 2, **tes Dylan : 3**), 21 entrées en corbeille. Rouvrir ne refait rien (les cas n'existent plus).
- **Désormais, un signe posé « en plus »** (mode texte, « + ») **va tout seul au forfait ponctuation** : il s'affiche « +, P » (cadre en pointillés, infobulle « Ponctuation en trop — comptée au forfait ponctuation ») ; un mot posé en plus reste un mot en trop. L'apostrophe reste une élision.
- **Le bouton « M→P » de l'en-tête a disparu** : la touche M s'adapte (L3), le menu au clic l'était déjà, la reprise rattrape tout le reste.

## Le fichier
- Base de L5 = **la 6.7.0-L3 en ligne**, vérifiée à la commande (741 928 o, md5 `f5d7685b07b847d707952bbb536fb510`). L4 n'a pas changé le fichier.
- → **6.7.0-L5** : **743,864 o** (+1,936), md5 `5c743058ab0a5d8d6287e7a31f2931fa`.
- `computeNote` 941 → 1 165 o : un mot en trop marqué « P » compte comme une ponctuation (forfait en brevet, coût P en préparée), `counts.P` l'inclut, `counts.X` non. Ajoutées : `estSigne`, `reclassementPonctuation` (la règle du rapport L4, mot pour mot). Dans `CorrScreen` : l'effet d'ouverture (après la trace de ④) fait le reclassement, la corbeille d'abord, puis les champs `errors`, `extras`, `note`, `deduction`, `counts` de chaque copie touchée ; la ligne « n copies reclassées ». `confirmInsert` 227 → 329 o (le signe en plus). L'affichage d'un mot en trop (« +, P »). Le bouton « M→P » retiré (2 819 o). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.
- **Conforme au rapport validé** : la fonction de L5, rejouée sur les deux jeux de données du rapport, touche les mêmes copies et donne les mêmes notes — **hub : 4 dictées sur 4 identiques au rapport ; instantané du kit : 5 sur 5**.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, 0 accès au vrai hub
**`banc_L5_geste.py`** (par le geste : ouvrir la dictée, poser un signe) : à l'ouverture du brevet blanc 3E, **11 copies touchées = les 11 du rapport**, leurs notes après = celles du rapport ([0, 0, 0, 1, 3, 3, 5,5, 5,5, 5,5, 6,5, 9,5]) ; **les 17 autres identiques octet pour octet** ; leurs autres champs gardés ; **11 entrées en corbeille**, chacune avec la copie d'avant exacte et son chemin de restauration ; la ligne « 11 copies reclassées » ; le bouton « M→P » absent ; **rouverte : rien de plus** (corbeille et copies inchangées, plus de ligne) ; une virgule posée en plus : `{afterIdx, word: ",", type: "P"}`, note 10 (au forfait), « +, P » à l'écran ; un mot posé en plus : 9,5 (mot en trop) ; 0 fenêtre, 0 erreur. **Sur L3, ce banc est rouge.**
**Banc unique sur L5 : VERT, 0 échec** (`sorties/`) : S1/S3 sans perte, S2 correct ; fuzz_correction graines 1 et 2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur (elle note maintenant « 8 notes changées » — ce sont les 8 copies du brevet blanc 3E que le reclassement fait gagner, à l'ouverture ; et « M→P : aucune fenêtre » — le bouton n'existe plus) ; bancs L1, L2, L3, L5 verts ; vue élève identique.

## Captures (`captures/`)
`V1-avant.png` / `V2-apres.png` (l'ouverture du brevet blanc 3E) ; `V3-avant.png` / `V4-apres.png` (une virgule posée en plus).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → ouvre ta dictée des Dylan : « ✓ 3 copies reclassées (ponctuation) » ; le bouton « M→P » n'est plus là.
2. Ferme et rouvre-la : plus de ligne, rien ne change.
3. Une copie en mode texte → « + » entre deux mots → tape une virgule → Entrée : « +, P » ; la note ne perd pas 0,5 (forfait).
4. Console → Corbeille : les entrées « reclassement-ponctuation » (une par copie) ; « Restaurer » sur l'une remet la copie d'avant.

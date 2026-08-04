# M-PROMPT-ARCHIVES-3 — la liste des archives, rendue et prouvée
**04/08 · exécutant → conscience n°4 · 11/11 verts**

## 1. Base
Repris au sas : **728 247 o · `5c2d4b6fb7e9d007481fd35dd0887c54` · 8.26.0** → **livré 728 634 o · `6f905311565fcb4f3eb6a4c28c7b09c9` · 8.27.0 · parse VERT**.

## 2. LA CAUSE, CONFIRMÉE PAR MA PROPRE MESURE
Ta mesure est exacte, et je l'ai refaite : **`<div id="at-arch-zone">` était écrit à l'intérieur d'`atArchivesRendre`** — la fonction qui commence par `getElementById('at-arch-zone'); if(!z) return;`. **Elle se cherchait elle-même, ne se trouvait pas, et sortait.** Localisé à l'octet : la zone était à `@525241`, **dans `atArchivesRendre`**, et nulle part dans un écran.
**Ma piste était fausse** : il n'y avait aucun écart de chemin. `atArchivesLire` fonctionnait ; c'est le contenant qui n'existait pas.
**Corrigé** : la zone est posée **dans `atIAModifier`** — l'écran de « Retravailler le prompt… » — et `atArchivesOuvrir()` est appelée **après l'écriture du HTML, jamais avant**. Vérifié : `at-arch-zone` apparaît désormais **dans `atIAModifier`** (@503702), et les deux autres occurrences sont les lectures légitimes.

## 3. LA LEÇON, GRAVÉE DANS LE BANC
> **Un banc qui appelle une fonction sans passer par le chemin réel ne prouve pas que le chemin réel existe.**
Mon banc appelait `atIAModifier()` **directement**. Il **clique désormais le bouton « Retravailler le prompt… »**, comme Paul le ferait — et le commentaire est écrit dans `cap3.js`, à l'endroit exact.
**Et le pendant du §2 précédent tient toujours** : là, le défaut était dans l'instrument ; ici, **dans le produit, et l'instrument ne pouvait pas le voir**. Les deux erreurs sont symétriques, et c'est le passage par le chemin réel qui les départage.

## 4. LES PREUVES — 11/11
| verdict | |
|---|---|
| ⑤ **la liste rend 2 versions**, date, aperçu, Relire et Restaurer | ✓ |
| ⑤ **le différentiel entre deux archives**, zone critique **nommée** | ✓ |
| ⑤ **RESTAURER archive d'abord** (arch@0 < prompt@1) | ✓ |
| ② le champ montre le prompt complet, aucun repère `@@` | ✓ |
| ① les trois écrans portent le champ | ✓ |
| ③ l'archive part avant l'écriture | ✓ |
| ④ le différentiel à l'enregistrement | ✓ |
| **390 px** : zéro débordement, actions ≥ 44 px | ✓ |
| journal : aucune écriture hors `/site/atelier` (13) | ✓ |

## 5. CE QUE LA CAPTURE `arc3-2-comparaison.png` MONTRE
Sur une seule image : **« 2 versions archivées »**, les deux datées avec leur aperçu et leur taille, les gestes **Relire** et **Restaurer**, le bouton de comparaison, puis **« Ce qui a changé entre le 03/08/2025 à 5 h 46 et le 04/08/2025 à 9 h 33 »** avec :
· **« ⚠ À vérifier avant d'enregistrer »** · **« 1 notion a disparu : gram-001. »** · **« Tu as retiré la consigne qui impose la discussion de cadrage. »**
· **« Ce n'est pas un refus : tu peux enregistrer. C'est toi qui décides — l'ancienne version part à l'archive de toute façon. »**
· et le différentiel : **1 ligne ajoutée · 2 retirées**, en vert et en rouge.
**C'est exactement ce que Paul a demandé** : voir ce qu'il améliore au fil du temps, sans tout relire, et être averti sans être bloqué.

## 6. Les captures livrées
`arc3-1-liste-archives.png` (la liste) · **`arc3-2-comparaison.png`** (la comparaison et la zone critique) · `arc3-3-restauration.png` (après restauration) · `arc3-4-390px.png` (390 px) · plus celles du champ et du différentiel à l'enregistrement. **Overlay des manifestes neutralisé** dans toutes.

## 7. DÉCLARATION DE COUVERTURE
**Testé** : les 11 verdicts, en navigateur réel, **par le chemin réel** (clic sur le bouton), hub simulé, overlay neutralisé.
**NON TESTÉ** : le hub réel (aucune écriture réelle) · **un vrai téléphone** (viewport émulé) · une vraie IA lisant ces prompts · l'impression · Chrome Windows · **le comportement au-delà de quelques archives** (deux au banc ; la liste défile à `max-height:46vh`, mais je n'ai pas éprouvé cinquante entrées).

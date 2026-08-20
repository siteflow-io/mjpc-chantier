# LOT ⑫ — CARTOGRAPHIE DES 21 DÉFINITIONS (avant retrait)
*Exécutant LOT ⑫, 20/08/2026. Base : `index.html` 8.56.2, 1 001 473 o, md5 `660956e0dc121c9d8e0a84c9ad98e690` (re-téléchargée et vérifiée à la commande).*

**Méthode** : chaque définition est mesurée depuis `function nom(` jusqu'à l'accolade fermante équilibrée (équilibrage tenant compte des chaînes `'` `"` `` ` ``, des échappements `\` et des commentaires `/* */`). La ligne de fin est celle de cette accolade fermante — vérifiée en contre-preuve par lecture brute (`sed`) : les 21 lignes de fin contiennent chacune exactement `}` seul.

## Tableau

| Fonction | L. début | L. fin | Octets |
|---|---|---|---|
| `diapoVocabulaireBlocs` | 9087 | 9095 | 261 |
| `diapoValider` | 9100 | 9146 | 2 876 |
| `diapoRendreBloc` | 9149 | 9188 | 3 050 |
| `diapoRendre` | 9189 | 9199 | 459 |
| `diapoOuvrir` | 9203 | 9208 | 227 |
| `diapoRendreEcran` | 9209 | 9224 | 1 523 |
| `diapoInfo` | 9225 | 9230 | 835 |
| `diapoVerifier` | 9231 | 9249 | 1 247 |
| `diapoCles` | 9252 | 9256 | 157 |
| `diapoRelecture` | 9257 | 9285 | 2 294 |
| `diapoTexteBrut` | 9286 | 9295 | 325 |
| `diapoMarquer` | 9296 | 9304 | 685 |
| `diapoToutRelu` | 9306 | 9310 | 440 |
| `diapoIdPropose` | 9311 | 9313 | 168 |
| `diapoEnregistrer` | 9315 | 9332 | 1 149 |
| `diapoEcrire` | 9333 | 9353 | 1 627 |
| `openDiaporamaById` | 9361 | 9381 | 1 313 |
| `diapoImagePoser` | 9390 | 9410 | 1 012 |
| `diapoDeposerImage` | 9411 | 9418 | 425 |
| `diapoStatutLiaison` | 13113 | 13129 | 816 |
| `diapoLierModal` | 13162 | 13191 | 2 168 |

**Sous-total 20 fonctions diapo\*** : 21 744 o (mandat : 21 697 o — écart 47 o, 0,2 %, différence de borne de mesure probable).
**Total 21 (avec `openDiaporamaById`)** : **23 057 o**.

## Signalement hors liste (arbitrage demandé)

Entre `diapoDeposerImage` (fin L9418) et le marqueur `/* ═══ fin § DIAPORAMAS ═══ */` (L9457) vit un **IIFE drag-drop d'images** (L9426–9456) qui appelle `diapoImagePoser` et référence `diapoRendre` en commentaire mesuré. Orphelin garanti après retrait des 21 : proposé à l'ajout au périmètre de l'étape 1.

## État

Aucune édition de la base à ce stade. Retraits en attente du contrôle de Paul sur ce tableau.

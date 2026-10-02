# DICTÉE — L'ÉCRAN DE CORRECTION · L6 — la recherche par initiales en fin de copie, en mode rapide

*Exécutant du mandat « L'écran de correction » (N1). Rien n'est promu.*

## Ce que ça change pour toi
- **Quand une copie est finie en mode rapide** (« Terminé ! », que tu sois arrivé au bout ou que tu aies cliqué « Terminer → »), **le champ des initiales s'affiche aussitôt, le curseur dedans** : « Copie suivante — tape les initiales (DM pour Dupont Marie), puis Entrée ».
- **Les lettres tapées dans ce champ ne déclenchent aucun raccourci** du mode rapide (ni G, ni L, ni M…, ni Entrée, ni Retour) : plus généralement, le clavier du mode rapide se tait dès que le curseur est dans un champ.
- **Jusqu'à six élèves sont proposés**, avec la même règle que la grille (les deux initiales, ou le début du nom ou du prénom) ; **les absents et les copies déjà corrigées sont signalés** (« absent », « ✔ corrigée ») ; le premier est mis en avant.
- **Entrée ouvre le premier proposé directement en mode rapide**, sans repasser par la grille (un clic sur un nom aussi) ; il reprend où il en était. « ✅ Enregistrer », « Relire » et « Vérifier en mode texte » restent là, inchangés.

## Le fichier
- Base de L6 = **la 6.7.0-L5 en ligne**, vérifiée à la commande (743 864 o, md5 `5c743058ab0a5d8d6287e7a31f2931fa`).
- → **6.7.0-L6** : **746,811 o** (+2,947), md5 `c28534fac49660fde55a51c2623a4324`.
- Dans `CorrEleve` : l'état `rechFin` et sa référence ; un effet qui met le curseur dans le champ quand la copie est finie ; le champ et la liste sur l'écran « Terminé ! » ; la garde « dans un champ » au début du clavier du mode rapide. Dans l'onglet Rapide (`CorrScreen`) : les élèves triés, les copies corrigées, les absents, et `onOuvrirRapide` (l'élève choisi devient l'élève de l'onglet Rapide). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L6_geste.py`** (touches et clics réels) : ZZTEST Romeo en mode rapide, une erreur, « Terminer → » : le champ est là **et a le curseur** ; « zt » : ZZTEST Tango **« absent »** ; « unif » : ZZTEST Uniform **« ✔ corrigée »** ; « gl » tapé : **aucune erreur ajoutée** à Romeo, le champ toujours là ; « zs » → ZZTEST Sierra en tête ; **Entrée → ZZTEST Sierra en mode rapide** (pas la grille) ; G y pose bien une erreur sur Sierra ; Romeo intact ; 0 fenêtre, 0 erreur. **Sur L5, ce banc est rouge** (pas de champ).
**Banc unique sur L6 : VERT, 0 échec** (`sorties/`) : S1/S3 sans perte, S2 correct ; fuzz_correction ×2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur ; bancs L1, L2, L3, L5, L6 verts ; vue élève identique.

## Infobulles
Le champ : « Les initiales de l'élève (DM pour Dupont Marie). Entrée ouvre le premier proposé, directement en mode rapide. Les lettres tapées ici ne marquent aucune erreur. » ; chaque nom proposé : « Ouvrir en mode rapide ».

## Captures (`captures/`)
`U1-avant.png` (L5 : « Terminé ! » sans recherche — les lettres tapées ne vont nulle part) ; `U2-apres.png` (L6 : le champ, « zs » → ZZTEST Sierra) ; `U3-apres-ouvert.png` (Entrée : Sierra en mode rapide).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une copie en mode rapide → finis-la (ou « Terminer → ») : le champ des initiales a le curseur.
2. Tape les initiales d'un élève (DM…) : il est proposé ; un absent dit « absent », une copie faite « ✔ corrigée » ; les lettres n'ont rien marqué sur la copie finie.
3. Entrée : l'élève s'ouvre directement en mode rapide.

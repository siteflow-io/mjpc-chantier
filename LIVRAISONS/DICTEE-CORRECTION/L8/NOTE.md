# DICTÉE — L'ÉCRAN DE CORRECTION · L8 — la recherche permanente et le curseur au clavier, en mode texte

*Exécutant du mandat « L'écran de correction » (N5, N6) — la dernière livraison du mandat. Rien n'est promu.*

## Ce que ça change pour toi (mode texte)
- **La recherche permanente** (aucun menu ouvert, aucun champ de saisie) : tu tapes les premières lettres d'un mot (minuscules ; une lettre avec Maj est ignorée — ⇧R reste la bascule) ; **les mots du texte qui commencent ainsi clignotent** (le courant encadré), et **une bande sous le texte les montre**, qui se resserre à mesure que tu tapes. **Un seul mot restant → il s'ouvre** (son menu des types). Plusieurs → **les flèches passent de l'un à l'autre** (← → dans l'ordre du texte, ↑ ↓ celui de la ligne du dessus / du dessous), en partant du dernier mot corrigé ; **Entrée ouvre** le candidat courant ; **Échap efface** la recherche ; Retour efface la dernière lettre. La casse est ignorée ; les accents comptent tels que tu les tapes.
- **Le curseur** (aucune recherche) : le dernier mot corrigé clignote (cadre en pointillés) et devient le curseur ; **← → le mot précédent / suivant en sautant la ponctuation** ; **↑ ↓ la ligne du dessus / du dessous**, le mot le plus proche à la verticale (mesuré sur la place réelle des mots à l'écran) ; **Entrée ouvre le mot** ; la page suit le mot ; les flèches ne font plus défiler la page. Les signes de ponctuation restent au clic.
- **Le menu ouvert** (par Entrée ou par un clic) : **G, L, M (qui s'adapte : mot / signe / apostrophe), I, A choisissent le type au clavier** ; G et L ouvrent le champ « ce qu'a écrit l'élève », avec la garde du mot juste (L3) ; Entrée valide le champ, Échap annule. Sur un mot déjà marqué, le type choisi **remplace** l'ancien (jamais deux erreurs sur un mot).
- **Ctrl+Z annule la dernière erreur posée** (dans cette ouverture de la copie), et l'enregistrement suit.
- Aucune collision : les lettres ne vivent que menu fermé, les touches de type que menu ouvert ; un champ ouvert (« ce qu'a écrit l'élève », la recherche d'élève en haut…) garde tout le clavier ; ⇧R bascule toujours ; le mode rapide n'est pas touché ; rien ne touche les écrans élèves.

## Le fichier
- Base de L8 = **L7b** (L7 rebasée par la conscience sur la 6.7.0-L6b promue ; au sas `LIVRAISONS/DICTEE-CORRECTION/L7/correction_dictee_L7b.html`, 748 284 o, md5 `65d6bd9fdb1f72e73a254c450007bcb5`, vérifiée), elle-même partie de la **6.7.0-L6b en ligne** (746 933 o, md5 `dd66cd92f7d1208178dc9987eec83b28`, vérifiée à la commande).
- → **6.7.0-L8** : **755,719 o** (+7,435), md5 `a6c0ce567fc92617be2ce0f6d613fff7`.
- Dans `CorrEleve` : les états `rechTexte`, `candIdx`, `curseur`, la pile du Ctrl+Z ; `motsTexteL8`, `candidatsL8`, `boiteMot`, `premierDepuis`, `deplacerL8` (les flèches, ↑ ↓ par la géométrie), `annulerDerniereL8` ; l'écoute du clavier du mode texte ; le curseur qui suit le dernier mot corrigé ; la page qui suit le mot ; les classes `cand-blink`, `cand-courant`, `curseur-blink` et la bande `bande-recherche`. `selectType` 318 → 428 o et `confirmFautifTexte` 573 → 659 o (le type remplace, la pile). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L8_geste.py`** (touches réelles) : « sy » → un seul mot, « syllabes » s'ouvre ; « lui » → les deux « lui » clignotent, la bande les montre, le premier encadré ; → passe au second ; Entrée ouvre « lui » ; G puis « lui » : refusé (garde) ; « luit » : l'erreur G posée ; **Ctrl+Z : retirée (hub vide)** ; « fort » ouvert par la recherche, Échap : le curseur sur « fort » ; → saute la virgule → « et » ; ↓ → un mot de la ligne du dessous (plus bas d'au moins une demi-ligne, mesuré), sans défilement de la page ; ↑ → retour sur la ligne de « et » ; Entrée ouvre « et », M pose « Manquant » ; ⇧R → mode rapide, ⇧R → mode texte ; « abc » tapé dans le champ « ce qu'a écrit l'élève » s'y écrit, sans recherche ; 0 fenêtre, 0 erreur.
**Accordé à L6b, comme le mandat le demande** : `banc_L3_geste.py` vérifie maintenant « M valide le bouton mis en avant » et « Entrée sur un signe avance sans rien marquer » (la version d'avant jointe) ; `fuzz_rapide.py` est celui de L6b (la conscience l'a accordé).
**Banc unique sur L8 : VERT, 0 échec** (`sorties/`) : S1/S3 sans perte, S2 correct ; fuzz_correction ×2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur ; bancs L1, L2, L3, L5, L6, L6b, L7, L8 verts (L7 : 1100 px, 0 débordement, écrans élèves identiques au pixel) ; vue élève identique.

## Infobulle
La bande : « La recherche au clavier : tape les premières lettres d'un mot. Les flèches passent d'un mot proposé à l'autre ; Entrée ouvre le mot ; Échap efface. »

## Captures (`captures/`)
`S1-avant.png` (L7b : « lui » tapé — rien) / `S2-apres.png` (L8 : les deux « lui » clignotent, la bande) ; `S3-apres-curseur.png` (le curseur sur « et », sa ligne ; M posé).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une copie en mode texte → tape les premières lettres d'un mot qui n'existe qu'une fois : son menu s'ouvre ; G, L, M, I ou A au clavier.
2. Tape « le » : les « le » clignotent, la bande les montre ; flèches, puis Entrée.
3. Échap ; les flèches déplacent le curseur de mot en mot (la ponctuation est sautée), ↑ ↓ de ligne en ligne ; Entrée ouvre le mot.
4. Pose une erreur, puis Ctrl+Z : elle disparaît.

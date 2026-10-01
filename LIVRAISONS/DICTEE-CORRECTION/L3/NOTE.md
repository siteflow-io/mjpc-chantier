# DICTÉE — L'ÉCRAN DE CORRECTION · L3 — M qui s'adapte, le clavier du mode rapide réduit, le mot juste bloqué

*Exécutant du mandat « L'écran de correction ». Rien n'est promu.*

## Ce que ça change pour toi
- **Mode rapide — M s'adapte** : sur un mot → Manquant ; sur un signe de ponctuation → Ponctuation ; sur une apostrophe → Élision.
- **Les touches P et E sont retirées ; les boutons restent** : sur un signe, « · Ponct. manqu. ↵ » est **mis en avant** (cadre bleu) et **Entrée le valide** ; sur une apostrophe, « ' Élision ↵ ». Sur un mot ordinaire, rien n'est mis en avant et Entrée passe au mot suivant, comme avant ; sur un mot déjà marqué, Entrée le garde.
- Le clavier du mode rapide : G, L, M (adaptée), I, A, Espace (correct), Retour (précédent), Entrée (valide le bouton mis en avant), ⇧R. Les alias « / » (= M, adapté lui aussi) et « ? » (= I) restent : ils ne faisaient pas partie de ce que tu as demandé de retirer. La ligne d'aide sous les boutons le dit.
- **La garde du mot juste**, dans le champ « Qu'a écrit l'élève ? » du mode rapide et dans celui du mode texte : si tu tapes **le mot juste** (« Le » = « le »), le champ refuse — « C'est le mot juste : recopie ce que l'élève a écrit. » — et reste ouvert. Tout autre mot passe ; vide (« Passer ») passe.

## Une dette déjà là, rencontrée au banc, réglée ici (registre n°12)
Dans le mode texte, **« Passer » enregistrait quand même le mot déjà tapé** (il lisait l'ancienne valeur du champ) — mesuré sur L2 : « de » tapé puis « Passer » → l'erreur porte « de ». Corrigé : « Passer » enregistre l'erreur sans mot. Et le bouton « ✓ » du mode texte valide bien le mot tapé (vérifié au banc).

## Mesuré, à te soumettre
**L'« ancien écran » cité par le mandat (`RapideGlobal` : `markError`, `onKey`, `submitFautif`) n'est affiché nulle part** : sa fonction est définie, jamais appelée (0 appel dans le fichier). Je ne l'ai pas modifié — rien de ce qui s'y ferait ne serait visible pour toi.

## Le fichier
- Base de L3 = **la 6.7.0-L2 en ligne** (L1 et L2 promues), **vérifiée à la commande** : 739 572 o, md5 `9053962b97f967e1894ed2751aff422b`.
- → **6.7.0-L3** : **741,928 o** (+2,356), md5 `f5d7685b07b847d707952bbb536fb510`.
- Ajouté : `typeAdapteM`, `preselectionRapide`, `motJuste` ; l'état `gardeMot` de `CorrEleve` ; le style `.fast-preselect`, `.garde-mot`. Modifié : l'écoute du clavier du mode rapide (M, Entrée, P et E retirées), les boutons Ponctuation / Élision / Manquant (mise en avant, infobulles), la ligne d'aide, `confirmFautifI` 790 → 930, `confirmFautifTexte` 358 → 573 (garde ; valeur passée), `cancelFautifI` 77 → 96, les champs (le message s'efface à la frappe), « Passer » et « ✓ » du mode texte. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, 0 accès au vrai hub
**`banc_L3_geste.py`** (touches et clics réels, élève fictif ZZTEST Papa) : M sur « Marguerite » → M ; sur « . » le bouton « · Ponct. manqu. ↵ » mis en avant, Entrée → P ; sur « , » M → P ; sur l'apostrophe « ' Élision ↵ » mis en avant, Entrée → E ; P et E sur un mot : rien, le curseur ne bouge pas ; Entrée sur un mot : il passe, sans erreur ; G puis le mot juste : refusé (message, champ ouvert, rien d'écrit) ; la même avec une majuscule : refusé ; « zzautre » : accepté ; L puis vide : accepté sans mot ; mode texte : « centre » et « Centre » refusés, « sentre » accepté ; « de » tapé puis « Passer » → l'erreur sans mot ; « ✓ » → le mot tapé ; 0 fenêtre, 0 erreur. **Sur L2, ce banc échoue.**
**Le fuzz du mode rapide du kit est accordé au clavier décidé** (`fuzz_rapide.py` : sur un signe ou une apostrophe, il frappe M ou Entrée — alternés, sans tirage — au lieu de P / E ; la version d'avant est jointe, `fuzz_rapide_avant_L3.py`). Avec l'ancienne version, il trouve 3 « bugs » qui sont exactement les touches P et E retirées.
**Banc unique `banc_unique_dictee.sh` sur L3 : VERT, 0 échec** (`sorties/`) — joué en tranches (l'environnement coupe une commande à 5 min ; `ETAPES=…` puis `ETAPES=bilan`) : S1/S3 sans perte, S2 correct ; fuzz_correction graines 1 et 2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur ; bancs L1, L2, L3 verts ; vue élève identique à la 6.6.3.

## Captures (`captures/`)
`Q1-avant.png` / `Q2-apres.png` (mode rapide sur un point) ; `Q3-avant.png` / `Q4-apres.png` (G puis le mot juste).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une copie → ⇧R (mode rapide) → avance jusqu'à un point : « · Ponct. manqu. ↵ » est encadré ; Entrée → l'erreur P.
2. Sur une virgule : M → P. Sur une apostrophe : « ' Élision ↵ » encadré ; Entrée → E. Les touches P et E ne font plus rien.
3. Sur un mot : G, tape le mot juste (avec ou sans majuscule) → refusé, le champ reste ouvert ; tape ce qu'a écrit l'élève → accepté.
4. ⇧R (mode texte) → clique un mot → G → tape le mot juste → refusé ; « Passer » → l'erreur sans mot.

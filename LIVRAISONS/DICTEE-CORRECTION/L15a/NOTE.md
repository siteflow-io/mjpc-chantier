# DICTÉE — L'ÉCRAN DE CORRECTION · L15a — le paramétrage de la version aménagée

*Exécutant du complément L15, livraison L15a (dettes n°12 · 102, 104, 105, 106 ; visuel D1). Rien n'est promu.*

## Ce que ça change pour toi
- **Cocher « Paramétrer une version aménagée » reste sur Préparation** et déplie le paramétrage (102 : la case ramenait à la Correction).
- **Le paramétrage est écouté en direct au hub** (105 : il était lu une seule fois à l'ouverture ; un réglage fait juste après la coche pouvait s'écrire sur une version périmée) ; le mode par défaut, « Note sur » et la consigne s'écrivent au hub au clic / à la saisie.
- **Changer le mode par défaut est suivi d'effets** : chaque mot sans mode à lui reçoit ce qu'il lui faut (mode A : ses trois propositions ; mode C : son indice et son raisonnement) ; la consigne suit, si tu ne l'as pas écrite à la main ; un message compte (« Mode C : 2 mots à compléter suivent ce mode (2 recalculés) ; la consigne suit »).
- **Un clic sur un mot du texte ouvre sa fenêtre (visuel D1)** — mot déjà à compléter ou non : « « syllabes » — mot à compléter n° k » ; en mode A, **les trois propositions modifiables, la bonne cochée** ; **« ↻ Proposer d'autres formes (depuis les copies) »** ; **« Mode pour ce mot : … »** (par défaut, A, B, C) ; **« 🗑 Retirer ce mot »** (104 : le mot est rendu au texte) ; **Enregistrer (Entrée) / Annuler (Échap)** ; rien n'est écrit avant « Enregistrer ». Plus de reclic qui retire, plus de panneau en bas de page. En mode C, la fenêtre montre l'indice et le raisonnement (modifiables) ; en mode B, « un trou simple ».
- **Les propositions (106)** : d'abord **les vraies formes fautives des copies sur ce mot (L10), de la plus fréquente à la moins fréquente** ; puis seulement des formes que le mot permet : accord (-s, -x, -e, -é/-ée/-és), terminaison (-er/-é/-ez/-ait/-ais, -ent), accent (é/è/e, à/a…), **une consonne double existante dédoublée** (jamais un doublement au hasard), quelques homophones courants (a/à, et/est, ou/où, son/sont, on/ont, ce/se, ces/ses…) ; **jamais une proposition vide, jamais le mot lui-même**.
- **L'indice du mode C** se fabrique d'après **l'écart entre la forme fautive la plus fréquente et le mot** (pluriel, singulier, féminin, terminaison du verbe, accent, consonne double) ; sinon un indice honnête : « Regarde bien l'orthographe de ce mot dans la phrase. » — modifiable dans la fenêtre.
- **L'aide « ? »** (Préparation — version aménagée) : la fenêtre d'un mot, Entrée / Échap, le mode par défaut suivi d'effets.

## Le fichier
- Base : **L15-0** (au sas, md5 `53cdf811a7b4aba7d803c9a963794284`) — L15-0 n'est pas encore promue ; elle-même partie de la **6.7.0-L14 en ligne** (md5 `6516ce917a5bfe0a94663b252582086c`, vérifiée à la commande). → **6.7.0-L15a** : **830,510 o** (+6,135), md5 `5dc768341ff013a9252c307a75d3edd2`.
- Ajoutées : `HOMOPHONES_L15A`, `reglesCibleesL15a`, `propositionsPourL15a`, `indiceEcartL15a` ; dans `ConfigAmenagee` : l'écoute en direct, `completerPourMode`, `setDefaultMode` (suivi d'effets), la fenêtre (`ouvrirFenL15a`, `enregistrerFenL15a`, `retirerFenL15a`, `autresFormesL15a`, Entrée / Échap), le message ; l'ancien panneau du bas retiré ; `EditionDictee` (`resteIci`) et `PreparationDictee` ; trois lignes d'aide. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L15a_geste.py`** (par le geste, 9 vérifications ; deux mots déjà à compléter, des formes semées sur « syllabes » : « silabes » ×2, « syllabe » ×1) : la case cochée → **toujours sur Préparation, `enabled` au hub** ; mode par défaut B → **`defaultMode: "B"` au hub**, le message ; mode C → les deux mots ont leur indice et leur raisonnement ; clic sur « syllabes » → **la fenêtre** ; mode du mot A → **« syllabes / silabes / syllabe »** (la bonne cochée, les vraies formes d'abord, par fréquence ; aucune vide, aucune égale au mot, aucun doublement) ; « Proposer d'autres formes » → « sylabes, silabes » (la consonne double existante, dédoublée) ; **Entrée → enregistré** (mode A, trois propositions) ; un mot nouveau puis **Échap → rien d'ajouté** ; « Retirer ce mot » → **rendu au texte** ; 0 erreur. **Sur L15-0, ce banc est rouge** (la case ramène à la Correction).
**Non joué au banc** : l'écran de l'élève en version aménagée (A : les propositions, B : le trou, C : l'indice) — le banc vérifie ce que ces écrans lisent au hub (le mode et les propositions ou l'indice de chaque mot) ; son code n'est pas touché.
**Banc unique sur L15a : VERT, 0 échec** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15a (dont **L14, la note aménagée**), vue élève identique à la 6.6.3.

## Captures (`captures/`)
`D1-avant.png` (la case : on quitte la Préparation) ; `D2-preparation.png` (on reste ; le mode C et son message) ; `D3-fenetre.png` (la fenêtre de « syllabes »).

## Tes tests, après promotion (L15-0 puis L15a)
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → les Dylan → Préparation : la version aménagée est dépliée ; décoche / recoche : tu restes sur Préparation.
2. Mode par défaut C : le message compte les mots qui suivent ; un élève aménagé voit les indices.
3. Clique « amenés » : sa fenêtre ; « ↻ Proposer d'autres formes » : les vraies fautes de tes élèves d'abord ; « Mode pour ce mot : B » ; Entrée.
4. Clique un mot ordinaire, puis Échap : rien n'est ajouté ; « 🗑 Retirer ce mot » sur un mot à compléter : il est rendu au texte.

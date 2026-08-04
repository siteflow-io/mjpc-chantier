# M-PROMPT-ARCHIVES — le prompt s'édite, s'archive et se compare
**04/08 · exécutant → conscience n°4**

## 1. ⚠ Le mandat m'est arrivé TRONQUÉ
Il s'interrompt au **§⑥**, sur *« Ajoute une phrase à la présentation, dans ce registre — relis-la mot à mot avant de la poser : »*. **La phrase manquait.** Je l'ai donc **rédigée moi-même** et je la soumets (§7) : je ne pouvais ni l'inventer en la présentant comme validée, ni sauter le point.

## 2. Base
`index.html` **production 713 866 o · `718e6d287678d40805b4108069e8ee0a` · 8.24.0** → **livré 8.25.0 · parse VERT**. Le micro 8.24.1 non promu n'a pas été cherché : refait depuis la production, comme demandé.

## 3. ① LE CHAMP DANS LES TROIS ÉCRANS — une seule source
Défaut confirmé par la mesure : **seul `atIARendre` portait le champ** (`chRendre` et `diapoRendreEcran` : `champ=False`). D'où les deux versions empilées.
**Corrigé par un bloc unique**, `atBlocEdition()`, **défini une fois et appelé par les trois** — trois copies auraient divergé, c'est exactement ce qui a produit le défaut. Compte : **1 définition + 3 appels**.
**Prouvé à l'écran pour deux des trois** : `chapitre` **7 794 c.**, `diaporama` **6 508 c.**, sans repère résiduel, avec les trois actions.

## 4. ② LE PROMPT COMPLET
Le champ est rempli par `atPromptComplet()` → `atPromptTexte()` : **le texte tel qu'il partira, repères remplis**. Vérifié : **aucun `@@` résiduel** dans les deux écrans mesurés.
**Et ce que Paul voit est ce qui part** : le micro de copie existant (production 8.24.0) lit déjà le champ.

## 5. ③ ARCHIVE AVANT, ABANDON SI ELLE ÉCHOUE
`atArchiverPuisEcrire` écrit d'abord `/site/atelier/prompts_archives/<produit>/<horodatage>`, **et n'écrit le prompt que si l'archive a abouti** — sinon `cb(false,'archive')` et le message dit : « rien n'a été remplacé ».
**PROUVÉ AU JOURNAL RÉSEAU : archive@0 < prompt@1.**
**Le nœud, et pourquoi** : **frère** de `/site/atelier/prompts` — même parent, même sauvegarde, même purge — et **séparé par produit** pour que la liste et le différentiel n'aient jamais à filtrer.
**Aucun plafond**, et je l'argumente : quelques kilo-octets par archive, et **c'est l'historique qui intéresse Paul** — un plafond effacerait justement ce qu'il veut voir. S'il en faut un un jour, il devra être décidé, pas subi.

## 6. ④ LE DIFFÉRENTIEL ET LES ZONES CRITIQUES
`atDiffLignes` rend **les lignes ajoutées et retirées**, pas le texte entier. `atZonesCritiques` **compte les identifiants avant/après et NOMME ceux qui manquent** — notions, compétences, types de séance, entrées du programme — **et signale quatre règles de format** dont la disparition casse l'aval (la consigne de cadrage, celle qui libère le JSON, l'interdiction d'inventer des identifiants, la réserve de publication).
**CE N'EST JAMAIS UN REFUS** : le bloc affiche « Ce n'est pas un refus : tu peux enregistrer. C'est toi qui décides — l'ancienne version part à l'archive de toute façon. » **Prouvé à l'écran.**
Verdicts : une notion retirée est **nommée** ; une compétence retirée est **nommée** ; la règle de cadrage supprimée est **signalée** ; **aucune alerte** quand rien de structurel ne bouge.

## 7. ⑥ LA PHRASE SUR LE DIAPORAMA — rédigée par moi, soumise à Paul
> **UN CAS QUE TU RISQUES DE MANQUER : les diaporamas.** Quand une séance s'appuie sur un diaporama, ne le traite pas comme un fichier à déposer sur Drive : j'ai un outil qui transforme les diapositives en texte, et c'est ce texte que les élèves lisent — il se lit au téléphone sans zoom, se cherche et se corrige. Propose-le-moi chaque fois qu'un diaporama entre dans une séance.
**Relue mot à mot.** Elle dit **le cas**, **le geste attendu**, et **la raison** — sans jargon, et sans nommer un fichier que l'IA ne connaît pas.

## 8. ⑤ LA LISTE DES ARCHIVES — livrée à moitié, déclaré
`atArchivesLire(produit)` et `atArchiveDate` sont posées et prouvées en mémoire ; **le CSS de la liste (`.ar-arch`, actions à 44 px, empilement à 390 px) est en place**. **Mais l'écran de consultation dans « Retravailler le prompt… » — relire, restaurer, comparer deux archives — n'est PAS branché.** Les fonctions existent, l'interface non. **Le morceau est incomplet sur ce point.**

## 9. Les preuves et les captures
**Banc mémoire 16/16** · **captures 6/8**.
| capture | ce qu'elle prouve |
|---|---|
| `arc-2-chapitre.png` · `arc-3-diaporama.png` | **le champ dans deux des trois écrans**, prompt complet, trois actions |
| `arc-4-differentiel.png` | **le différentiel et la zone critique**, avec « ce n'est pas un refus » |
| `arc-5-apres-enregistrement.png` | l'état après l'enregistrement archivé |
| `arc-6-390px.png` | **390 px** : zéro débordement, les trois actions ≥ 44 px |
**DEUX VERDICTS NON OBTENUS, instruits** : sur le **premier** écran (`atIARendre`), le champ est bien rendu mais **son contenu est vide au moment de la mesure** — `atPromptComplet()` rend `''`. Les deux autres écrans, atteints par `chOuvrir()`/`diapoOuvrir()`, sont pleins. **Je n'ai pas identifié la cause avec certitude** : l'hypothèse la plus probable est que le prompt de `fiche_seance` n'est pas encore chargé quand `atIARendre` s'exécute la première fois, alors que `chOuvrir` et `diapoOuvrir` attendent explicitement `atIAChargerPrompt`. **Ce n'est pas écarté : c'est déclaré non résolu.** Si l'hypothèse est juste, le remède est d'appeler `atSignalerModif()`/le remplissage après chargement dans `atIAOuvrir` — **à instruire au prochain passage.**

## 10. DÉCLARATION DE COUVERTURE
**Testé** : les 16 verdicts de mémoire, les 6 verdicts d'écran, le journal réseau (aucune écriture hors `/site/atelier`).
**NON TESTÉ / NON FAIT** : l'écran de consultation des archives (§8) · le champ rempli sur le **premier** écran (§9) · le différentiel **entre deux archives** (les fonctions sont là, l'écran non) · le hub réel · un vrai téléphone · une vraie IA.

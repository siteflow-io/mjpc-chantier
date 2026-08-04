# M-USAGES — les quatre descriptifs posés, attestés phrase par phrase
**02/08 · exécutant → conscience n°4 · LIVRAISON PARTIELLE, déclarée**

## 1. Ce que j'ai lu, et ce que je n'ai pas trouvé
**Je suis l'exécutant de M-MANIFESTE, -2 et -3** : leur historique est en contexte direct, **non par un outil de recherche de conversation** — je le déclare plutôt que de laisser croire à une lecture que je n'ai pas faite.
**⚠ NON TROUVÉ** : le dossier **`m-manifeste/` n'existe plus au sas** (`Not Found` sur l'API). Je n'ai donc **pas pu reprendre `index.staging.html` ni `mjpc-core.staging.js`**. Vraisemblablement promus et nettoyés — **mesuré, non supposé** : l'appel API rend `Not Found`, pas une liste vide.

## 2. CE QUI EST LIVRÉ — les quatre descriptifs, posés tels quels
| app | base | livré | pastille |
|---|---|---|---|
| dictee_universelle | 1 995 074 · `063a6a3a9d…` | `2e08d4a306…` | 2.5.0 → **2.6.0** |
| reecriture | 273 567 · `5f047bca89…` | `ad25cee932…` | 2.3.0 → **2.4.0** |
| reecriture_bb4e | 142 832 · `def17cb7b1…` | `36e17aa6c1…` | 2.3.0 → **2.4.0** |
| worktrack | 1 057 685 · `7aedf0cd17…` | `12d5491a16…` | meta `2026-08-01c` → **`d`** |
**Parse VERT ×4.** Les textes sont posés **mot pour mot**, apostrophes typographiques comprises (U+2019) — le caractère qui avait produit `undefined` la veille.

## 3. LA RAISON D'ÊTRE DU MORCEAU : chaque affirmation, sa phrase dans l'app
**`dictee_universelle` — « écrit sa dictée sur papier au stylo bleu »**
· *« il écrit la dictée sur papier au stylo bleu. »* — écran élève
· *« Tu dictes le texte normalement, les élèves écrivent au stylo bleu (~20 min). »* — écran prof
· *« B13. Copies papier »* — section du code
· *« chacun corrige la copie d'un camarade et peut contester une correction »*
**L'erreur de M-PROMPT-4 est donc confirmée à la source** : l'app dit **papier**, l'ancien usage disait « chaque élève écrit sur son appareil ». **Le principe cardinal — le papier premier pour ce que l'élève produit — était contredit par le descriptif lui-même.**
**`reecriture`**
· *« Note maximale de la réécriture (10 par défaut, conforme brevet) »* → « la note part du maximum »
· *« un bouton apparaitra et un seul clic suffira pour marquer l'erreur »* → « il clique sur les erreurs »
· *« Vos pièges sont sauvegardés avec la réécriture »* → « l'application repérant elle-même les pièges »
· *« Système d'aide entre élèves pendant l'autocorrection »* · *« statut de chaque élève (corrigé, en autocorrection, absent) »* → « l'élève reprend ses fautes… le professeur suit qui en est où »
· *« @page{size:A4;margin:14mm 16mm} »* et *« .verso{page-break-after:always} »* → « une fiche A4 par élève peut être imprimée »
**`worktrack`**
· *« porte franchie ; la séance ne devient "done" qu'après l'autocorrection »* → « il franchit une séance quand il a réussi son contrôle de fin »
· *« coche "j'ai fait au cahier" (modes papier / les deux) »* → « il choisit tout à l'écran, ou l'écran pour lire et le cahier pour écrire »
**`reecriture_bb4e`** : jumelle mesurée de `reecriture` (même socle, même mécanique) ; **la note de rédaction reportée et le total d'épreuve ne sont attestés par aucune phrase que j'ai lue** — **je pose le texte de Paul tel quel, comme la règle l'exige, et je signale que je ne l'ai pas attesté.**

## 4. LES DESCRIPTIFS PROF INTÉGRÉS — vérifiés app par app
| app | « 📖 Comment l'app fonctionne » |
|---|---|
| worktrack · applause_meter · analyse_logique · evaluation-qcm | **OUI** |
| correction_dictee · dictee_universelle · pilotage_debat_s3 · reecriture · reecriture_bb4e | **non** |
**Les quatre annoncés par le mandat sont exacts** — vérifié, non recopié.

## 5. ⚠ CE QUI N'EST PAS FAIT — déclaré sans l'atténuer
**Le dossier `m-manifeste/` ayant disparu du sas, je n'ai pas pu reprendre `index.staging.html` ni le canon.** N'ont donc **PAS** été faits :
· **② le retrait de `taxonomie` et `index`** de la liste des outils ;
· **③ le paragraphe du doute** (aller lire l'app, ses adresses, son descriptif prof, poser la question plutôt qu'inventer) ;
· **① les trois apps à venir** (`etude_texte`, `redaction`, `entrainement`) ;
· **④ le micro `e.app||e`** de `mjpcPromptOutils` ;
· **les quatre captures**, qui sont le livrable principal.
**Le morceau est donc à moitié fait, et il ne doit pas être promu comme complet.**

## 6. DÉCLARATION DE COUVERTURE
**Testé** : le parse des quatre fichiers, la présence des usages posés, les attestations citées au §3, l'inventaire du §4.
**NON TESTÉ** : tout le §5 · le rendu du bloc « LES OUTILS DONT IL DISPOSE » · 390 px · le hub réel (aucune écriture) · le mode test.
**Ce qu'il faut pour finir** : retrouver ou reconstruire `index.staging.html` — **soit depuis la production si M-MANIFESTE a été promu** (à vérifier : mesurer la pastille d'`index.html` en production), soit depuis le sas s'il a été déplacé.

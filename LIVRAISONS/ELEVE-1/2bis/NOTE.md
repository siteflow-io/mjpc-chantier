# ELEVE-1 · COMPLÉMENT ② bis — les nouvelles classes dans la dictée et la réécriture ; le QCM ne ressuscite plus les classes

*Exécutante : l'instance relectrice. 01/10/2026. Dettes n°12 · 83 et 90 (bloquantes). Rien n'est promu : audit de la conscience, puis ton « promeus » des trois fichiers.*

## Ce que ça change pour toi
- **La dictée et la réécriture proposent tes classes importées** : la liste « Classe » d'un niveau se règle sur le niveau de la classe (le champ `niveau`), plus sur le début de sa clé (les classes importées ont pour clé « 3_dylan_bob », « 3_franklin_aretha »… qui ne commencent pas par « 3e ») ; une classe sans niveau garde l'ancien repli. La liste montre le **nom** de chaque classe et son nombre d'élèves. Dans la dictée : à la création ET à l'édition ; dans la réécriture : à la création (seul endroit qui filtrait).
- **Le QCM ne recrée plus jamais de classe** : sa « migration » jouée à chaque ouverture recopiait dans les classes du site toute classe de son ancien carnet (`qcm/classes`) absente — c'est elle qui faisait revenir « 4E Banksy », « 4e Pythagore », « 5E Hergé ». Elle ne fait plus rien (son rappel rend 0, 0 : le message d'ouverture ne s'affiche plus).
- **« Ranger l'ancien carnet de classes »** (QCM → Données → 💾 Sauvegarde → Maintenance, professeur seul) : l'ancien carnet part en corbeille, compté (`/corbeille/qcm-classes-legacy-<horodatage>`, motif `qcm-classes-legacy`, classes et élèves comptés dans `_meta`), puis s'efface ; la confirmation et le message disent le compte ; un second clic dit « déjà vide ». `qcm/classes` sort de `MJPC_PURGE.purger` du QCM (republié au clic et à chaque ouverture) ; il n'était pas dans `MJPC_MANIFESTE.noeuds` (mesuré).
- **Un défaut rencontré, réglé ici** : le QCM affichait les classes par leur **clé** (« zztest_3e », donc « 3_dylan_bob » pour tes classes importées) — dans ses listes, sur le **tableau projeté** et sur le **badge de l'élève**. Il affiche maintenant leur nom (30 endroits) ; la clé reste ce que le QCM lit et écrit.

## Mesuré dans les autres apps
Filtre « début de la clé » (`indexOf(niveau…)===0`) : **0** dans le QCM, la dictée universelle, worktrack et la réécriture brevet 4e. Le QCM liste toutes ses classes sans filtre de niveau ; la dictée universelle filtre des *dictées* par niveau (`d.niveau===urlNiveau`), worktrack des *chapitres* — aucun des deux ne liste les classes par niveau.

## Les fichiers (bases re-téléchargées et vérifiées à la commande)
- `correction_dictee.html` 6.6.0 (735 974 o, md5 `f4cdfbef…`) → **6.6.1** : 736,690 o (+716), md5 `ebf6fdc82bf032eb5f98fe54f9ea3fde` — ajoutées `classeDuNiveau`, `nomDeClasse` ; les deux listes « Classe ».
- `reecriture.html` 2.4.0 (274 114 o, md5 `ad25cee93216ee9d4e5a60fe10389b96`) → **2.4.1** : 274,783 o (+669), md5 `3f50419de528a664afbfec403f3dfa9d` — les mêmes deux aides ; la liste « Classe ».
- `evaluation-qcm.html` 7.7.0 (550 410 o, md5 `9d6df9f4…`) → **7.7.1** : 550,571 o (+161), md5 `ecae65624855a1a877708986a8e984e5` — `migrerClassesUneFois` 3 370 → 632 o (ne crée plus rien, ne lit plus `qcm/classes`) ; `rangerAncienCarnet` et son bouton dans l'onglet Sauvegarde ; `MJPC_PURGE.purger` sans `qcm/classes` ; `libClasseQCM` et `libelle` (le nom à l'écran).
- Syntaxe : chaque fichier, 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Le banc (`bancs/`) — par le geste, base EN MÉMOIRE (faux Firebase), données ZZTEST
Rien ne sort du navigateur ; vrai hub lu avant et après : identique. Hors geste, déclaré : l'empreinte du code prof d'essai ; la lecture de la base simulée ; pour les captures, la liste « Classe » est dépliée (un menu déroulant natif ne se photographie pas).
**Banc unique `banc_unique_2bis.py` : VERT, 13 vérifications, 0 échec** (`sortie_banc_unique_2bis.txt`) : dictée 6.6.0 niveau 3e — « 3E Charles de Gaulle (2) » seule ; 6.6.1 — + « ZZTEST 3e (3) », la 4e absente ; à l'édition aussi ; réécriture 2.4.0 / 2.4.1 — idem ; QCM 7.7.0 — à l'ouverture, recrée « ZZTEST FANTOME » (la fuite, mesurée) ; 7.7.1 — 0 écriture vers `/classes`, rien ne revient, aucun message ; « Ranger » — corbeille : 2 classes, 3 élèves, motif `qcm-classes-legacy` ; puis le nœud vide et le contrat sans `qcm/classes` ; la confirmation dit le compte, le second clic « déjà vide » ; la liste du QCM par les noms (7.7.0 : « zztest_3e (3 élèves) » ; 7.7.1 : « ZZTEST 3e (3 élèves) ») ; vues élève des trois apps inchangées ; 0 erreur JS, 0 sortie.

## Infobulle ajoutée (pour toi)
« Ranger l'ancien carnet de classes » : « L'ancien carnet de classes du QCM (de l'époque où il avait ses propres classes) recréait les classes que tu supprimes. Ce bouton le met en corbeille (gardé un an), compté, puis l'efface. Tes classes du site ne sont pas touchées. »

## Attendus hub (après tes gestes)
`/corbeille/qcm-classes-legacy-<horodatage>` = { _meta: { motif, chemin "/qcm/classes", classes: 5, eleves: … }, data: { qcm: { classes: … } } } ; `/qcm/classes` absent ; `/manifestes/evaluation-qcm` sans `qcm/classes`.

## Captures (`captures/`)
`X1-avant.png` / `X2-apres.png` (la liste « Classe » de la dictée au niveau 3e) ; `X3-qcm-avant.png` / `X4-qcm-apres.png` (la liste des classes du QCM) ; `X5-qcm-bouton.png` (le bouton).

## Tes tests, geste par geste, après promotion des trois fichiers
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.6.1 → Accès professeur → Nouvelle dictée → Niveau « 3e » → Classe : « 3E Charles de Gaulle », « 3e Bob Dylan », « 3e Aretha Franklin » (par leur nom).
2. https://siteflow-io.github.io/monsieurjaipascompris/reecriture.html?v=2.4.1 → Accès professeur → Créer une réécriture → Niveau « 3e » → les mêmes classes.
3. https://siteflow-io.github.io/monsieurjaipascompris/evaluation-qcm.html?v=7.7.1 → Accès professeur → Données → 💾 Sauvegarde → Maintenance → « Ranger l'ancien carnet de classes » → la confirmation dit le compte (5 classes) → OK → « Rangé : … ».
4. Console → Classes → supprime « 4E Banksy », « 4e Pythagore », « 5E Hergé » (les classes revenues) → elles partent en corbeille.
5. Rouvre le QCM : elles ne reviennent pas ; ses listes montrent les noms de tes classes.

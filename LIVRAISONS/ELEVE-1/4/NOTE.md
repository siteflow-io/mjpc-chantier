# ELEVE-1 · LIVRAISON ④ — la correction de dictée lit l'aménagement de la fiche

*Exécutante : l'instance relectrice (mandat « L'ÉLÈVE — 1 » v4) ; réponses de Paul 162, 165, 166 et « l'aménagement n'est pas un secret d'État ». 01/10/2026. Rien n'est promu : la livraison attend l'audit de la conscience puis ton « promeus » de `correction_dictee.html`.*

## Ce que ça change pour toi
- **L'aménagement vient de la fiche de l'élève** (case pap-15, dans la console) : la dictée le lit dans `/classes/<clé de la classe>/amenagements/<élève>/dicteeAmenagee`, la classe trouvée par sa clé ; elle ne lit plus le registre `classes_amenages`.
- **La ligne de la capture T284-e4**, quand la dictée a sa version aménagée : « PAP · n élèves pap-15 (dictées aménagées) : aménagés pour cette dictée, d'après leur fiche · Tout passer en non aménagé pour cette dictée — ou élève par élève, par le clic droit » (et l'inverse : « Tout repasser en aménagé (leur fiche) »). Les cartes disent « aménagé » / « non aménagé (cette dictée) ».
- **Le clic droit part de la fiche** : sans choix, l'élève suit sa fiche ; un clic l'inverse pour cette dictée ; un second clic revient à la fiche. L'entrée « registre PAP de la classe » a disparu, rien à sa place.
- **Chaque copie garde sa base** (ta règle du 01/10) : une copie aménagée se corrige, s'enregistre et s'affiche sur la base de la version aménagée (10 par défaut), une copie normale sur la base de la dictée — l'enregistrement, la correction rapide, la restauration, l'échange et le transfert, le reclassement M → P et le recalcul suivent la trace de la copie (`amenagee`, `mode` = les modes employés « A », « A+C »…, `base`) ; aucune conversion. Le recalcul sur changement de base ne touche jamais une copie aménagée (dette n°12 · 79).
- **Les copies d'avant** reçoivent leur trace une seule fois (d'abord le choix fait pour la dictée, sinon l'ancien registre), base = la base aménagée de la dictée. Mesuré au hub : 7 copies concernées (deux dictées de la 5e Hergé), pour lesquelles cette base est égale à celle de la dictée.
- **L'encart « Moyenne »** : la moyenne de la dictée sur sa base (copies normales) et, à côté, « n copies aménagées — moyenne m/10 ». **Le bilan exporté** (consigne + JSON copiés pour une analyse) : chaque note avec sa base (`note_sur`), la moyenne et la médiane sur la base de la dictée, calculées sur ses seules copies (`moyenne_sur`).
- **L'élève** voit sa note sur la base de sa copie (« 10/10 »), sans aucun mot sur l'aménagement. **La feuille papier** de la version aménagée ne porte plus « aménagée » nulle part (ni le titre par défaut, ni « PRÉPARATION À LA DICTÉE AMÉNAGÉE », ni « Version aménagée — identifiant » en pied) : le titre de la dictée seul.
- **Le bac à sable** : son 2e élève fictif est aménagé d'après sa « fiche » ; tout part avec la classe de test.

## Trois défauts déjà là, rencontrés au banc, réglés dans cette livraison (registre n°12)
1. L'écran de correction **ne lisait jamais la version aménagée** de la dictée : la base aménagée n'était jamais employée (seul le badge 📘 marchait). Il l'écoute désormais.
2. Après un **changement de base**, l'écran ouvert gardait les anciennes notes et l'ancienne base — une copie normale se notait encore sur l'ancienne — jusqu'à la réouverture. L'écran suit maintenant la base réglée et les notes recalculées, sans rouvrir.
3. Les élèves fictifs du bac à sable portaient des **noms possibles** (« DURAND Alice »…), contre le point 16. Ils portent `ZZTEST …` ; « Tout effacer » efface aussi, une fois, les six codes fictifs d'avant.

## Le fichier
- Base `correction_dictee.html` **6.5.0** (724 656 o, md5 `75f48e2dbf0b86698c27ca27aacf8e35`, commit b815d1dc, vérifiée à la commande ; tu ne l'as pas repoussée depuis) → **6.6.0** : **735,974 o** (+11,318), md5 `f4cdfbef85cf557a4a91e5900ef6c5b4`.
- Fonctions (avant → après) : `isEleveAmenage` 352 → 352 · `save` 5,492 → 5,833 · `CorrScreen` 20,892 → 26,410 · `EditionDictee` 17,402 → 18,522 · `buildAmenageePapierHtml` 6,091 → 6,171 · `ModeTest` 3,866 → 4,155 · `buildDicteeJSON` 2,111 → 2,505 · `CorrEleve` 40,520 → 40,607 · `purgerDonneesTest` 496 → 627 · `genererDonneesTest` 2,930 → 2,972 ; ajoutées : `cleDuRegistre`, `registreDepuisAmenagements`, `dAmenDe`, `modesAmenagee`, `traceCopie`, `traceDe`, `baseDeCopie` ; dans l'écran : `lignePapDictee`, `traceAncienne`, `traceSiAbsente` ; retirée : `toggleAmenageClasse`. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.
- **Les écritures de résultats**, nommément (méthode : chaque `results…` suivi de `.set/.update/.remove/.push`, rattaché à sa fonction) : 20 lignes. Posent ou reposent une copie : l'enregistrement (normal et rapide), la restauration depuis la corbeille, l'échange / le transfert (la copie emporte sa trace), le reclassement M → P, le recalcul. Ne posent pas de copie : le commentaire de bilan, les erreurs, les exercices, l'autocorrection, l'effacement.
- `classes_amenages` **reste** dans `MJPC_MANIFESTE` et `MJPC_PURGE` de la dictée : mesuré au hub, le nœud n'est pas vide (1 classe, « 5e HERGÉ » — il le sera après ton premier import réel, qui met ces restes en corbeille). Il sortira du contrat quand il sera vide.

## Les bancs (`bancs/`) — par le geste, sur une base EN MÉMOIRE
La dictée tourne entière dans le navigateur avec un **faux Firebase** (`faux_firebase.js`) semé de données `ZZTEST` : **rien ne sort du navigateur** (0 requête vers le vrai hub, vrai hub lu avant/après : identique). Hors geste, déclaré : l'empreinte d'un code prof d'essai posée dans la base simulée ; la session de l'élève fictif ; la lecture de la base simulée pour prouver ; la feuille papier et le bilan exporté prouvés par la fonction.
**Banc unique `banc_unique_4.py` : VERT, {nok} vérifications, 0 échec** (`sortie_banc_unique_4.txt`) : avant 6.5.0 — pas de ligne PAP, Anna « 8/20 » ; la ligne PAP mot pour mot ; Bruno « aménagé » ; Anna tracée une fois (aménagée, « A+C », base 10), « 8/10 » ; clic droit aller-retour sans « registre » ; le bloc aller-retour ; Bruno « Enregistrer (10/10) » → note 10, trace A+C base 10 ; Clara « (20/20) » → 20, non aménagée ; l'encart « 20/20 » + « 2 copies aménagées — moyenne 9/10 » ; « Rendre les copies » ; base 20 → 12 : Clara 12, Anna 8 et Bruno 10 intactes ; le bilan à jour sans rouvrir (« 12/12 ») ; une nouvelle copie « Enregistrer (12/12) » ; la feuille sans le mot ni l'identifiant ; le bilan exporté (Anna 8/10, Bruno 10/10, Clara 12/12, moyenne 12 sur 12, 1 copie comptée, aucun mot) ; l'écran de Bruno : « 10/10 », ni « aménagé », ni « PAP », ni ◆ ; 0 erreur, 0 sortie.
Le bac à sable, par le geste (`banc_bac_4.py`) : élèves `ZZTEST …`, codes `zztest_…`, aménagement du 2e élève posé, puis « Tout effacer » : la classe de test et son aménagement partis.

## Infobulles
Le bouton du bloc : « Pour cette dictée seulement (une dictée préparée, par exemple) : leurs fiches ne changent pas. » / « Rend à chacun l'aménagement de sa fiche, pour cette dictée seulement. » ; la note du menu du clic droit : « Sans choix ici, l'élève suit sa fiche (case pap-15, dans la console). Un clic l'inverse pour cette dictée ; un second clic revient à sa fiche. »

## Attendus hub
`/correction_dictee/<id>/results/<clé>` = {{ note, …, amenagee: true, mode: "A+C", base: 10 }} ou {{ note, …, amenagee: false }} ; `/correction_dictee/<id>/amenages/<clé>` = false (non aménagé pour cette dictée) ou absent (suit la fiche) ; lu : `/classes/<clé>/amenagements/<élève>/dicteeAmenagee`.

## Captures (`captures/`)
Pour toi, légendées : `W1-avant.png` / `W2-apres.png` (le même écran de correction) ; `W3-copie-bruno.png` (« Enregistrer (10/10) ») ; `W4-moyenne.png` ; `W5-eleve.png` (ce que voit l'élève). Pour l'audit : les écrans entiers du banc (`avant-*`, `apres-*`, `eleve-*`, `el-*`).

## Tes tests, geste par geste, après promotion de `correction_dictee.html`
1. Ouvre https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.6.0 → Accès professeur.
2. Ouvre une dictée qui a sa version aménagée, d'une classe où une fiche d'élève a la case pap-15 cochée : la ligne « PAP · … » en haut, « aménagé » sur sa carte.
3. Clic droit sur l'élève → « Retirer aménagé (cette dictée) » : « non aménagé (cette dictée) » ; clic droit → « Aménagé (cette dictée) » : retour à sa fiche.
4. Corrige sa copie : « Enregistrer (10/10) » ; la carte dit « …/10 ».
5. Données → Bilan : « Moyenne …/20 » et « n copies aménagées — moyenne …/10 ».
6. Préparation → change « Note sur » → Enregistrer : le bilan suit sans rouvrir ; la copie aménagée n'a pas bougé.
7. La feuille de la version aménagée : le mot « aménagée » n'y est plus.
8. Le bac à sable (🧪) : ses élèves s'appellent « ZZTEST … ».

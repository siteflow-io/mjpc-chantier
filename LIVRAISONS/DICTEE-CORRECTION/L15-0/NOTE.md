# DICTÉE — L'ÉCRAN DE CORRECTION · L15-0 — la forme acceptée vaut pour une place du texte ; la majuscule

*Exécutant du complément L15 (`MANDATS/COMPLEMENT-DICTEE-CORRECTION-L15.md`), livraison L15-0 (en premier). Dettes n°12 · 116 et 117. Rien n'est promu.*

## Ce que ça change pour toi
- **Une forme acceptée vaut pour une PLACE du texte**, plus pour le mot partout : `correction_dictee_textes/<texteKey>/formesAcceptees/<place>/<forme>` = { mot, forme, tokenIdx, creeLe, origine, dicteeId } ; dans toutes les dictées du même texte (même texte → même place). En correction, la place est celle de l'erreur ; en Préparation, le mot cliqué ; « retirer » retire à cette place. **Le même mot à une autre place coûte toujours.**
- **Préparation** ne souligne que la place acceptée. **Réglages** la dit en clair : « sur « cadavres » (2e mot de la phrase 7 / place 119) : cadavre ».
- **La liste des formes déjà vues (L10)** : « acceptée » si la forme l'est **à cette place** ; acceptée à une autre place du même texte, ou dans un autre texte : **« acceptée ailleurs »** et le bouton **« accepter ici »**. (La forme reste lisible : ses marques passent à la ligne quand la place manque.)
- **Les règles d'avant (rangées par mot) sont mises à leur place une fois**, à l'ouverture : la place où des copies portent cette forme ; sans copie pour le dire, la seule occurrence du mot, sinon la première (la ligne le dit, à vérifier dans Réglages). Les copies qui changent sont recalculées, **la corbeille d'abord** (motif `recalcul-forme-acceptee`) ; une ligne le dit (« 1 règle mise à sa place dans le texte ; n copies recalculées »). **Au hub : « cadavres » → « cadavre » sera mise à la place 119 seulement ; 0 copie à recalculer** (les 21 sans-coût sont à la place 119).
- **La majuscule (dette 117)** : la garde du mot juste ne refuse que la recopie **identique, casse comprise** ; « Empereur » pour « empereur », « pour » pour « Pour » en début de phrase, « verdun » pour « Verdun » : **acceptés** — une erreur de majuscule, du type que tu choisis. La liste des formes déjà vues **garde la casse** (« Empereur » et « empereur » sont deux formes) ; la forme acceptée se compare casse comprise. Les cas déjà au hub ne changent pas.

## Ma reconfirmation au hub (lecture seule, 03/10, sans aucun nom — les copies par leur rang alphabétique dans la dictée)
« cadavres » est aux places **119** (« puanteur de cadavres ») et **125** (« recouvre les cadavres ») dans les deux dictées (Dylan, Franklin) ; **22 erreurs** posées sur « cadavres », **toutes à la place 119** ; une seule règle au hub : « cadavres » → « cadavre » (posée en Préparation).

| classe | copie | place | recopie | sans coût | note |
|---|---|---|---|---|---|
| Dylan | copie n°3 | 119 | « cadavre » | oui | 0 |
| Dylan | copie n°4 | 119 | « cadavre » | oui | 1,5 |
| Dylan | copie n°8 | 119 | « cadavre » | oui | 0,5 |
| Dylan | copie n°9 | 119 | « cadavre » | oui | 4,5 |
| Dylan | copie n°11 | 119 | « cadavre » | oui | 2,5 |
| Dylan | copie n°12 | 119 | « cadavre » | oui | 5,5 |
| Dylan | copie n°15 | 119 | « cadavre » | oui | 3,5 |
| Dylan | copie n°16 | 119 | « cadavre » | oui | 4,5 |
| Dylan | copie n°18 | 119 | « cadavre » | oui | 8 |
| Dylan | copie n°19 | 119 | « cadavre » | oui | 7 |
| Dylan | copie n°24 | 119 | « cadavre » | oui | 2 |
| Franklin | copie n°1 | 119 | « cadavre » | oui | 0 |
| Franklin | copie n°2 | 119 | « cadave » | **non** | 5,5 |
| Franklin | copie n°4 | 119 | « cadavre » | oui | 4 |
| Franklin | copie n°8 | 119 | « cadavre » | oui | 3,5 |
| Franklin | copie n°10 | 119 | « cadavre » | oui | 5,5 |
| Franklin | copie n°11 | 119 | « cadavre » | oui | 4,5 |
| Franklin | copie n°13 | 119 | « cadavre » | oui | 0 |
| Franklin | copie n°16 | 119 | « cadavre » | oui | 6 |
| Franklin | copie n°21 | 119 | « cadavre » | oui | 3,5 |
| Franklin | copie n°26 | 119 | « cadavre (L) » | oui | 0,5 |
| Franklin | copie n°27 | 119 | « cadavre » | oui | 9 |

**21 « cadavre » sans coût (11 Dylan + 10 Franklin) ; la copie Franklin n°2 porte « cadave » (sans r) : une vraie faute, elle coûte — aucune note n'est faussée.** Même relevé que la conscience.

## Le fichier
- Base **6.7.0-L14 en ligne** (819 640 o, md5 `6516ce917a5bfe0a94663b252582086c`, vérifiée à la commande) → **6.7.0-L15-0** : **824,375 o** (+4,735), md5 `53cdf811a7b4aba7d803c9a963794284`.
- Modifiées : `motJuste` (casse comprise), `formesPour` (la casse gardée), `accepteesDe`, `estAcceptee`, `marquerSansCout`, `accepteesAilleurs`, `cheminRegle`, `regleEnMemoire`, `regleRetireeEnMemoire`, `poserRegle`, `retirerRegle` (la place), `accepteesCharger` (la conversion), `recalculerTexte` (la corbeille quand on la demande) ; ajoutées : `placeLisible`, `convertirAnciennesRegles` ; la correction (la place de l'erreur), la liste (« acceptée ailleurs »), Préparation, Réglages, la ligne d'ouverture. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L150_geste.py`** (par le geste, 8 vérifications ; « lui » aux places 10 et 23) : **une règle d'avant** « lui » → « luy » et une copie qui la porte à la place 10 → à l'ouverture, « 1 règle mise à sa place dans le texte ; 0 copie recalculée », la règle rangée à la place 10 seulement, la copie garde son sans-coût ; **« luy » posé à la place 23 coûte** (sans-coût : non) ; la liste à la place 23 : « 1 luy ×1 — acceptée ailleurs — accepter ici » ; à la place 10 : « luy ×2 acceptée », posé → sans coût ; **la majuscule** : « centre » refusé (garde), « Centre » accepté et posé ; **Préparation** : la place 10 soulignée, pas la 23 ; **Réglages** : « sur « lui » (2e mot de la phrase 2 / place 10) : luy » ; 0 erreur.
**Accordés** (les versions d'avant jointes, `*_avant_L150.py`) : `banc_L3_geste.py` (la casse seule est acceptée : « pour » pour « Pour » en début de phrase), `banc_L10_geste.py` (« Syllabes » est une forme à part, triée comme l'app), `banc_L11_geste.py` (la Préparation refuse « syllabes » identique ; « acceptée ailleurs » ; les règles par place).
**Banc unique sur L15-0 : VERT, 0 échec** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14 et L15-0, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`P1-avant.png` / `P2-apres.png` (G sur le second « lui ») ; `P3-preparation.png` ; `P4-reglages.png`.

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → les Dylan : « 1 règle mise à sa place dans le texte ; 0 copie recalculée ».
2. Réglages : « sur « cadavres » (… / place 119) : cadavre ». Préparation → Formes acceptées : seul le premier « cadavres » est souligné.
3. Une copie : G sur le second « cadavres » (« recouvre les cadavres ») : « cadavre » est « acceptée ailleurs » ; posé là, il coûte.
4. G sur « empereur », tape « Empereur » : accepté (erreur de majuscule) ; tape « empereur » : refusé.

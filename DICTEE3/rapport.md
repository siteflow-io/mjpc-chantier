# DICTEE3 — L'apostrophe et les guillemets deviennent des fautes cliquables

**Exécutant, 09/08/2026 — pour la conscience n°5 et pour Paul.**
Base : production `correction_dictee.html` 592 783 o, md5 `a52eb5fc481302688391312f0a3ec98e` (vérifiée).
Livrable : 594 927 o, md5 `ddea259da4f29028c9f6570bb8a4c24a`. `node --check` : OK. **270 → 272 fonctions, 0 supprimée** (les deux ajoutées : `estApostrophe`, `estGuillemet`). Hub : lecture seule, **aucune écriture réelle** (banc sur mock, journal `__MOCK_WRITES__`).

---

## ① Le découpage

Historique reconstitué sur les données réelles : ⓐ `s'approchèrent` d'un bloc → ⓑ `s` · `'` · `approchèrent` → ⓒ production actuelle `s'` · `approchèrent` (apostrophe collée à gauche). **Désormais** : l'apostrophe (droite `'` et courbe `’`) et les guillemets (`«` `»` `"` `“` `”`) sont des **jetons individuels** ; les autres ponctuations consécutives restent groupées ; l'apostrophe ne fait plus partie des mots.

`tokSp` (recomposition) : l'apostrophe ne prend d'espace **d'aucun côté** ; guillemet droit `"` : espace avant sauf après une fin de phrase `[.!?…]` (mesuré sur le texte 5e : `journal : " Ces gens` mais `des perles."`) ; guillemets français : espaces des deux côtés (typographie — aucune occurrence réelle pour trancher autrement).

**Preuve de non-régression** : la recomposition des cinq textes réels est **identique octet à octet à celle de la production**, à une seule exception près — `des perles. "` devient `des perles."`, ce qui est *plus fidèle* au texte saisi par Paul. Les divergences préexistantes (`Est- ce`, `Courir?` sans espace avant `?`) sont inchangées et restent consignées.

`testTokens` (bac à sable) : c'était une tokenisation **parallèle** (split maison) qui aurait divergé de la production ; elle devient un alias de `tokenize`. Les données de test recalculent leurs positions dynamiquement : elles suivent.

## ② La classification

La taxonomie de Paul tranche : l'apostrophe est en **ORTHOGRAPHE**, famille « Apostrophes et élisions » — pas en ponctuation. En conséquence, dans le code livré :

- Sur un jeton apostrophe, l'écran rapide propose **« ' Élision oubliée »** → type **L** (Lexique/orthographe, −0,5), à la place du bouton P. G, I, A restent accessibles. Saisie du fautif facultative (« Passer » = mode rapide → trou numéroté).
- Les **guillemets** sont de la ponctuation : ils gardent le flux **P** de la virgule et du point, sans changement.
- Le raccourci clavier P (deux écrans) et le **convertisseur M→P** excluent désormais l'apostrophe (une apostrophe M ne sera jamais requalifiée en « ponctuation »).
- La copie : toute erreur portant sur un jeton apostrophe reçoit un commentaire dédié (« Élision — devant une voyelle ou un h muet… »), qui prime sur le commentaire générique du type.

**Proposition soumise à Paul, NON codée** : un type propre **« E — Élision »** (−0,5, famille « Apostrophes et élisions », couleur distincte) séparerait ces fautes des L au bilan et dans les exports. En attendant ta décision, L fait le travail sans rien fausser (même coût, même domaine).

## ③ La migration — cinq snapshots, mêmes exigences

Outil : `migrateur_apostrophes.js`. Les deux découpages sont extraits **verbatim** des fichiers (production / livraison) ; translation par **plages de caractères**, jamais de recherche d'occurrence ; seule vérité acceptée : `tokens[idx] === word` à l'identique. **Seul `idx` change** — comparaison structurelle : `champsHorsIdx: []` sur les cinq fichiers.

| Dictée | Jetons | Avant | Après migration | idx modifiés | À arbitrer |
|---|---|---|---|---|---|
| 5e Utopie | 150→159 | 547/547 | **542/547** | 526 | 5 |
| 3e Charles de Gaulle | 140→144 | 262/262 | **262/262** | 255 | 1 |
| 4e Banksy | 164→173 | 357/358 | **358/358** | 338 | 2 |
| 4e Pythagore | 163→172 | 353/353 | **353/353** | 335 | 1 |
| 5e Grandes découvertes | 93→95 | 163/169 | **163/169** | 141 | 6 |

Le cas `moquet_mathis` (4e, « qu ») s'est **réglé de lui-même**, comme prévu : son jeton existe à nouveau, Banksy remonte à 358/358.

**Les 15 positions à arbitrer** (l'exigence est absolue : je ne devine pas ce que tu aurais cliqué) :

*Mots entiers dont l'élision a disparu comme jeton — la faute portait-elle sur l'élision ou sur le mot ?*
1. Utopie — `bouton_amauri`, L « qu' » → candidats `qu` · `'` · `ils` (pos 47)
2. Utopie — `bouton_amauri`, G « n' » → `n` · `'` · `a` (pos 136)
3. Utopie — `guegnard_lysandre`, I « qu' » → `qu` · `'` · `on` (pos 108)
4. Utopie — `nouteau_quentin`, A « n' » → `n` · `'` · `a` (pos 136)
5. Utopie — `ragueneau_jules`, L « n' » → `n` · `'` · `a` (pos 136)
6. GD — `bourdais_maxime`, L « s'approchèrent » → `s` · `'` · `approchèrent` (pos 20)
7. GD — `gasoyan_lucas`, G « s'approchèrent » → idem
8. GD — `oriot_lisa`, L « s'approchèrent » → idem
9. GD — `reclu_philippine`, G « s'approchèrent » → idem
10. GD — `zilli_marin`, L « s'approchèrent » → idem
11. GD — `guegnard_lysandre`, L « d'une » → `sont` · `d` · `'` (pos 73)

*Manquants « ' » posés à une position d'insertion voisine — l'apostrophe visée est vraisemblablement à un ou deux jetons (je liste, tu cliques) :*
12. 3e — `deslin_lucas`, P « ’ » → `adressions` · `d` · `’` (pos 16)
13. 4e Banksy — `cadiou_fourrier_louann`, M « ’ » → `Il` · `s` · `’` (pos 31)
14. 4e Banksy — `cadiou_fourrier_louann`, M « ’ » → `dans` · `l` · `’` (pos 43)
15. 4e Pythagore — `alligand_louka`, M « ’ » → `dans` · `l` · `’` (pos 43)

**Transitoire à connaître** : tant que ces 15 idx ne sont pas arbitrés, leur affichage (trou ou marque) peut tomber sur un jeton voisin — mesuré au banc sur le A de `nouteau_quentin`. Rien ne casse ; c'est corrigé au moment où tu trancheras.

## ④ L'écran de correction — geste prouvé au banc (Puppeteer, données réelles, mock)

Mode ⚡ Rapide, 4e Banksy, gestes réels : avancée jeton par jeton jusqu'à « ’ » → les boutons affichés sont `→ Correct · G Grammaire · L Lexique · **' Élision oubliée** · ? Illisible · ⚠ Attention` (P absent sur l'apostrophe) → clic → « Passer » (mode rapide, sans fautif) → Terminer → Enregistrer → écriture mock `{idx:44, type:"L", word:"’"}` → la copie affiche **15 trous numérotés 1→15**, le nouveau étant l'apostrophe de « l'obscurité » (capture `copie_apostrophe_trou.png` : `dans l ␣3␣ obscurité`, badge L −0,5).

## ⑤ Rien ne casse

Banc complet rejoué sur le livrable **avec les données migrées** : trous numérotés (Elyse 1→14, Louann 1→36), copie sans faute, mixte trous+corrections, export autonome, modale élève, aperçu à droite — **tout vert, zéro erreur de page**. Cas « apostrophe mise à tort » : extra `'` rendu barré avec `+ −0,5` (capture `herge_mixte.png`). Élisions recomposées collées partout (« l'enfourna », « qu'ils », « n'avait »…).

## Textes français ajoutés (à ta relecture)

- Bouton : **« ' Élision oubliée »** (infobulle : « Élision oubliée ou fautive — orthographe, famille “Apostrophes et élisions” (−0,5 pt). Raccourci : L »)
- Commentaire de copie : « Élision — devant une voyelle ou un h muet, le e (ou le a) tombe et l'apostrophe le remplace : l'arbre, s'approcher, qu'on, n'a. Relis en vérifiant chaque petit mot devant une voyelle. »

**Annonce élèves proposée** (si tu la juges utile — le changement est surtout côté correction) :
> À partir des prochaines dictées, une apostrophe oubliée apparaît dans ta copie corrigée comme une erreur à part entière, au même titre qu'une virgule. Vérifie tes élisions en te relisant : l'arbre, s'approcher, qu'on.

## Contenu de la livraison

`DICTEE3/correction_dictee.html` · `migrateur_apostrophes.js` · les cinq `*_migre.json` + leurs `*_verdict.json` · ce rapport · six captures (`apostrophe_boutons`, `apostrophe_saisie`, `copie_apostrophe_trou`, `herge_mixte`, `banksy_detail`, `banksy_modale_eleve`).

**Après ton audit** : les cinq snapshots **migrés** remplacent les corrigés du matin pour l'injection au hub — ils doivent être injectés **en même temps** que la promotion du HTML (l'un sans l'autre désaligne tout).

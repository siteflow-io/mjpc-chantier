# DICTÉE — L'ÉCRAN DE CORRECTION · L15d-b — L15d reprise sur la L15c-d (le micro de l'onglet Rapide reporté)

*Exécutant du complément L15, livraison L15d-b (dettes n°12 · 110 et 115). Elle remplace `LIVRAISONS/DICTEE-CORRECTION/L15d/` (partie de la L15c-c). Le code de L15d est le même ; le micro L15c-d y est. Rien n'est promu.*

## Ce qui bloquait (mesuré dans le code et au hub, lecture seule, sans nom)
- **Le bac à sable rangeait les codes de ses élèves en clair** (`codes/zztest_… = {code: "2581", …}`) ; or depuis M-SÉCU-2, l'entrée **n'accepte qu'un code rangé en empreinte** (`mjpcVerifierCode` refuse « sans-empreinte ») : **ses élèves ne pouvaient pas entrer avec leur code**. Au hub aujourd'hui, ses 6 codes sont encore en clair.
- **« Tout effacer » supprimait aussi des codes de la classe de test de MJPC** : il effaçait les anciennes clés du bac à sable (`durand_alice`, `martin_lucas`, …), qui sont celles de la « CLASSE TEST » de MJPC (rangées en empreinte par MJPC). Au hub, `codes/durand_alice` est là (empreinte) ; **`codes/martin_lucas` a disparu**.

## Ce que ça change pour toi
- **Le bac à sable range désormais les codes de ses élèves en empreinte** (le sel et l'empreinte, comme MJPC — plus de code en clair) : **ils entrent avec leur code, comme de vrais élèves**. Les codes ne changent pas (ceux qu'affiche le mode test).
- **« Tout effacer » ne touche plus les codes de la classe de test de MJPC.**
- **Les élèves de la classe de test de MJPC** entrent avec leur code MJPC, comme de vrais élèves (le banc le joue). **Pour l'élève dont le code a disparu (`martin_lucas`), il faut lui refaire un code dans MJPC.**
- **Les modes Brut / Barré / Placeholder** (onglet Copies) **ne sont plus grisés à tort** : une recopie est attendue pour **G et L seulement** (P, I, A, E — et M — n'en ont jamais), la même règle que le contrôle des mots recopiés ; sur un mode indisponible, l'infobulle dit : « Indisponible ici : il manque la recopie de n mots (G ou L). La copie s'affiche en trous numérotés. »


## Le micro L15c-d, reporté
La seule différence avec L15d est la ligne du micro (marqueur « [micro L15c-d »), dans `CorrScreen` : l'onglet Rapide ouvert sans copie pose une fois l'élève choisi (sinon l'écran sautait à l'élève suivant à chaque geste). **Mesuré** : `diff` de L15d et L15d-b (hors numéro de version) = cette ligne seule.

## Le fichier
- Base **6.7.0-L15c-d en ligne** (847 984 o, md5 `0ddd51e04147b78339cd7987f34c7ea5`, vérifiée à la commande) → **6.7.0-L15d-b** : **848,699 o** (+715), md5 `dfde1522b3e7f7cec144aea892bc10c6`.
- Modifiées : `copieRecopiee` (G et L) ; ajoutée : `recopiesManquantes` ; les deux listes de modes (l'infobulle et son compte) ; `ModeTest` (les codes en empreinte : `mjpcSelAleatoire`, `mjpcEmpreinte`) ; `purgerDonneesTest` (les anciennes clés épargnées). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L15d_geste.py`** (8 vérifications, en contexte sécurisé) : vert sur L15d-b (codes du bac à sable en empreinte ; « Tout effacer » épargne MJPC ; un élève du bac à sable et un élève de la classe de test de MJPC entrent avec leur code ; un mauvais code refusé ; les modes disponibles / grisés avec le compte). **`banc_L15cd_rapide_onglet.py`** (celui de la conscience) : **VERT** sur L15d-b.
**Accordé au micro L15c-d** (la version d'avant jointe) : `banc_L12_geste.py` — après l'onglet Rapide, une copie est posée : le banc revient à la grille avant de continuer. Les autres accords (les niveaux repliés, L15c-c) sont ceux de L15d.
**Banc unique sur L15d-b : VERT, 0 échec, 30 étapes** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, L15c, L15c-b, L15c-c, **L15c-d**, L15d, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`M1-modes.png` (l'onglet Copies, une copie corrigée en mode rapide : les trois modes grisés et leur infobulle).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → en bas, « 🧪 Mode test · Ouvrir ▾ » → « Créer le bac à sable » (ou « Regénérer »).
2. Dans un autre onglet, côté élève : un élève du bac à sable, son code (celui que montre le mode test), son nom, son prénom → il entre.
3. Un élève de ta classe de test MJPC, son code MJPC → il entre.
4. Onglet Copies : une copie corrigée en mode texte avec ses recopies → Brut / Barré / Placeholder ouverts ; une copie corrigée en rapide → grisés, l'infobulle dit combien de mots manquent.

# DICTÉE — L'ÉCRAN DE CORRECTION · L15d — les élèves de test entrent avec leur code ; les modes d'affichage des copies

*Exécutant du complément L15, livraison L15d (dettes n°12 · 110 et 115). Rien n'est promu.*

## Ce qui bloquait (mesuré dans le code et au hub, lecture seule, sans nom)
- **Le bac à sable rangeait les codes de ses élèves en clair** (`codes/zztest_… = {code: "2581", …}`) ; or depuis M-SÉCU-2, l'entrée **n'accepte qu'un code rangé en empreinte** (`mjpcVerifierCode` refuse « sans-empreinte ») : **ses élèves ne pouvaient pas entrer avec leur code**. Au hub aujourd'hui, ses 6 codes sont encore en clair.
- **« Tout effacer » supprimait aussi des codes de la classe de test de MJPC** : il effaçait les anciennes clés du bac à sable (`durand_alice`, `martin_lucas`, …), qui sont celles de la « CLASSE TEST » de MJPC (rangées en empreinte par MJPC). Au hub, `codes/durand_alice` est là (empreinte) ; **`codes/martin_lucas` a disparu**.

## Ce que ça change pour toi
- **Le bac à sable range désormais les codes de ses élèves en empreinte** (le sel et l'empreinte, comme MJPC — plus de code en clair) : **ils entrent avec leur code, comme de vrais élèves**. Les codes ne changent pas (ceux qu'affiche le mode test).
- **« Tout effacer » ne touche plus les codes de la classe de test de MJPC.**
- **Les élèves de la classe de test de MJPC** entrent avec leur code MJPC, comme de vrais élèves (le banc le joue). **Pour l'élève dont le code a disparu (`martin_lucas`), il faut lui refaire un code dans MJPC.**
- **Les modes Brut / Barré / Placeholder** (onglet Copies) **ne sont plus grisés à tort** : une recopie est attendue pour **G et L seulement** (P, I, A, E — et M — n'en ont jamais), la même règle que le contrôle des mots recopiés ; sur un mode indisponible, l'infobulle dit : « Indisponible ici : il manque la recopie de n mots (G ou L). La copie s'affiche en trous numérotés. »

## Le fichier
- Base **6.7.0-L15c-c en ligne** (847 544 o, md5 `de07a02a47d4e173673f3043127e757f`, vérifiée à la commande) → **6.7.0-L15d** : **848,257 o** (+713), md5 `da7f2197884d30ef95471b809bb6d259`.
- Modifiées : `copieRecopiee` (G et L) ; ajoutée : `recopiesManquantes` ; les deux listes de modes (l'infobulle et son compte) ; `ModeTest` (les codes en empreinte : `mjpcSelAleatoire`, `mjpcEmpreinte`) ; `purgerDonneesTest` (les anciennes clés épargnées). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L15d_geste.py`** (par le geste, 8 vérifications ; **en contexte sécurisé** — `http://localhost`, comme le site en https —, sinon l'empreinte ne se calcule pas) : « Créer le bac à sable » → **ses codes rangés `{classe, createdAt, empreinte, name, sel}`, sans code en clair** ; **« Tout effacer » → le code d'un élève de la classe de test de MJPC est toujours là** ; **un élève du bac à sable entre avec son code** ; **un élève de la classe de test de MJPC (pris dans le kit) entre avec son code** ; un mauvais code → refusé ; une copie avec G et L recopiés + P + I → **Brut, Barré, Placeholder disponibles** ; une G sans recopie → **les trois grisés, « il manque la recopie de 1 mot (G ou L) »** ; 0 erreur. **Sur L15c-c, ce banc est rouge.**
**Accordés aux niveaux repliés de l'accueil (micro L15c-c)** — les versions d'avant jointes (`*_avant_L15d.py`) : `scenarios_modes.py`, `fuzz_correction.py`, `fuzz_rapide.py`, `scenarios_grille.py`, `mesure_largeur.py` et les bancs L1, L2, L3, L5, L6, L6b, L8, L9, L10, L11, L12, L13b, L14, L15-0, L15-0b, L15a : ils déplient les niveaux avant d'ouvrir une dictée ; `banc_L13b_geste.py` lit aussi la ligne de l'accueil par son identifiant (deux lignes par dictée, L15c-b). Les bancs L15b, L15c, L15c-b, L15c-c de la conscience sont repris tels quels.
**Banc unique sur L15d : VERT, 0 échec** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, L15c, L15c-b, L15c-c, L15d, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`M1-modes.png` (l'onglet Copies, une copie corrigée en mode rapide : les trois modes grisés et leur infobulle).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → en bas, « 🧪 Mode test · Ouvrir ▾ » → « Créer le bac à sable » (ou « Regénérer »).
2. Dans un autre onglet, côté élève : un élève du bac à sable, son code (celui que montre le mode test), son nom, son prénom → il entre.
3. Un élève de ta classe de test MJPC, son code MJPC → il entre.
4. Onglet Copies : une copie corrigée en mode texte avec ses recopies → Brut / Barré / Placeholder ouverts ; une copie corrigée en rapide → grisés, l'infobulle dit combien de mots manquent.

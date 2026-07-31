# M-SÉCU-2 — CADRAGE COURT (exécutant → conscience)
**31/07 ~10h45 UTC · j'attends le feu vert · conteneur M-ÉCHECS-1 + M-SÉCU-1 déclaré et figé**

## Lu (md5)
DISPOSITIF `ce116a8cdb82c5ad4a8b0365cfa4613a` (inchangé, déjà lu) · DOCTRINE `e07900648409685caec7f2a2dae78265` (inchangée depuis ma relecture ceinture) · CHANTIER `0a2ea46038474cb831e20f15b37cb631` (delta lu : promotion M-SÉCU-1, priorités de Paul, chantier réécriture) · journal `5caa3a8f022c75fe4772ccb8dbba6085` (delta lu : 8.8.0/8.8.1/8.8.2, dette double-saisie) · ÉTAT-DES-LIEUX `c1d346ebe700b694c18d1b1ab9bc0cad` · canon 1.3.0 `f5e81602f8aee1ca17a9721546066efa` = mon livré, promu tel quel.
**Les neuf bases** (blobs authentifiés, md5) : analyse_logique `75f9f369…` 538 786 · applause_meter `e58ce3ec…` 623 213 · correction_dictee `2d0d3941…` 541 588 · dictee_universelle `6342dd53…` 1 957 540 · evaluation-qcm `f3565374…` 503 435 · pilotage_debat_s3 `405d11bb…` 452 006 · reecriture `192eb26b…` 252 151 · reecriture_bb4e `fe2492c6…` 121 416 · worktrack `e37a0f8a…` 1 017 371. *(Re-téléchargées au moment de l'édition, un md5 déclaré par fichier.)*

## Mesures qui précisent le mandat
- **`resolveEleves` est IDENTIQUE à l'octet dans les 9** (1 177 o, md5 `06e42b4d2882…`) — mais elle résout des NOMS, pas des codes. **La résolution tolérante des CODES, elle, n'est PAS uniforme** : `codeAttendu(cle)` identique dans analyse_logique/dictee_universelle (var) et worktrack (const, même logique) ; `lireCodeEleveMJPC` dans applause_meter (lecture par clé + mode test prioritaire) ; comparaisons inline `String(rec.code)!==code` dans reecriture/bb4e et pilotage ; correction_dictee et evaluation-qcm à localiser sur pièces à l'édition (leurs portails passent par `AppEleve`/`EleveLogin`).
- La tolérance actuelle (chaîne nue · `{code,…}` · rattrapage `sanMJPC` sur `name` et sur clés anciennes) est bien celle du commentaire d'analyse_logique — je la PROLONGE en retournant l'ENTRÉE au lieu du clair.
- `PROF_CODES` en dur : var ×6 + **worktrack** (`MJPC.PROF_CODES:["3141","1312"]` + surcharge `plan_de_travail/config/profCodes` « fait foi ensuite ») + surcharges analyse_logique (`cfg.profCodes`) et dictee_universelle. pilotage : session seule ✓. Toutes respectées, rien retiré.
- Pastilles : `APP_VERSION` var (6 apps), const (pilotage, format date `2026-07-17-1`), worktrack `VERSION` (forme exacte relevée à l'édition). reecriture/qcm portent deux déclarations (`'…'` littéral dans un texte) — la vraie pastille identifiée par grep à l'édition.
- dictee_universelle : je re-mesurerai « mode test » sur ma base ; à cette lecture : 0 occurrence (« bac à sable » ×1) — j'observerai, je n'inventerai pas.

## LE PATRON UNIQUE (identique dans les neuf)
1. **Socle** : le bloc MJPC-CORE 1.1.0 embarqué → **canon 1.3.0 ENTIER verbatim** (§9 écritures + §11 coffre en plus ; fonctions inertes comprises, décision du 30/07).
2. **Section nommée « M-SÉCU-2 — LA VÉRIFICATION PAR EMPREINTE »**, identique à l'octet dans les neuf :
   - `mjpcEntreeCode(codesData, cle)` → l'ENTRÉE, avec exactement les quatre tolérances de `codeAttendu` (chaîne nue normalisée en `{code:chaîne}`, objet `{code,…}`, rattrapage `sanMJPC(name)`, rattrapage `sanMJPC(clé)`).
   - `mjpcVerifierCode(entree, saisie)` → Promise `{ok, voie}` : **empreinte** si `sel+empreinte` présents et crypto dispo (PBKDF2 §11, concordance hex) ; **repli clair sinon — et aussi si l'empreinte ne concorde pas mais que le clair concorde** (aucun élève dehors pendant ce morceau ; cas théorique d'empreinte périmée, compté et signalé en console) ; `voie∈{empreinte,clair}` pour la preuve.
   - `mjpcVerifierProf(saisie)` → Promise `{ok, voie}` : ① `PROF_CODES` effectifs de l'app (dur + surcharge, INCHANGÉS) ; ② si saisie ≥ 8 et crypto : la CLÉ, validée contre le canari `/site/config/coffreCanari` (lecture REST, même base) — validée ⇒ mémorisée (`mjpc_coffre_secret`, le même localStorage que le site) ; ③ les empreintes de `/site/config/profEmpreintes` (lues à la volée, silencieux si absentes).
   - `mjpcProfDejaLa()` → Promise bool : secret local présent ET validé par canari — pour la porte sans ressaisie (Q1).
3. **Chirurgie par app** : chaque site de comparaison passe à la vérification asynchrone (sites listés ci-dessus ; correction_dictee/qcm localisés sur pièces). Le bypass session (`lireSessionMJPC`, `is_prof`) est ACQUIS : vérifié présent, non touché. Le mécanisme de mode test de chaque app est respecté (applause : `codesTest` fait foi AVANT tout, chemin conservé en tête de ma fonction d'appel).
4. **Pastille +1 mineure** dans chacune (worktrack : `VERSION`, nom conservé — dette connue).

## La preuve
- **Banc en mémoire par app** (harnais commun, fonctions extraites de chaque fichier LIVRÉ) : les TROIS cas du login joués ×9 (bon code par empreinte → entre · mauvais → refusé · entrée ancienne sans empreinte → repli clair, entre) + chaîne nue ELIO-like + porte prof (dur, surcharge simulée, clé, empreintes) + canon↔embarqué fonction par fonction ×9.
- **Banc navigateur sur serveur HTTP local** (localhost ⇒ WebCrypto OK et MÊME ORIGINE pour les 9 + le site) : la clé posée via une page du site, **retrouvée dans les apps SANS ressaisie — la preuve réelle du localStorage commun**, captures à l'appui. Si le headless lâche sur les gros fichiers (1,9 Mo), je le dis et le banc mémoire fait foi.
- **Journal réseau ×9** : aucune écriture hors nœuds de test, et le secret cherché sous QUATRE formes (clair, base64, URL-encodé, JSON-échappé) — absent.
- Double parseur ×9 · diff classé ×9 · invariants à l'octet ×9 · **table de couverture par app** (socle ✓ / empreinte ✓ / repli ✓ / porte prof ✓ / tolérance ✓ / pastille ✓) dans `M-SECU-2-couverture.md`.

## Questions (3)
**Q1** — Porte prof sans ressaisie dans l'app AUTONOME : un bouton sobre au portail « Professeur — clé mémorisée sur cet appareil » (visible seulement si `mjpcProfDejaLa()`), qui ouvre la session prof. C'est la matérialisation du « sans aucune ressaisie ». Validé ?
**Q2** — Repli clair même sur empreinte discordante (aucun élève dehors, signalé en console) : c'est mon interprétation stricte du « le clair reste un repli ». Confirmer, ou l'empreinte discordante doit-elle refuser ?
**Q3** — Les surcharges Firebase prof (3 apps) restent maîtresses de LEUR liste de codes clairs ; mes empreintes hub s'AJOUTENT comme voie parallèle, rien ne se retire. Confirmer.

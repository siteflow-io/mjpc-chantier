# M-SÉCU-3 — CADRAGE COURT (exécutant → conscience)
**31/07 ~12h25 UTC · j'attends le feu vert · conteneur des deux morceaux précédents, figés**

## Lu (md5)
DISPOSITIF `ce116a8c…` · DOCTRINE `e0790064…` · CHANTIER `0a2ea460…` (inchangés) · journal `8d289056574b5646e231c4f032d49ea6` (delta lu : promotion M-SÉCU-2, 2 faux positifs de la conscience instruits, piège des coutures au registre) · ÉTAT-DES-LIEUX `8edbc8d7daa09a3ab61355cc0b3135e0` · restauration `6e060f9b5cf64612d2631b7a8dc86f82` · canon `f5e81602…` (inchangé). **Production vérifiée : les neuf apps = mes stagings M-SÉCU-2 promus bit à bit** (tailles identiques, sha relevés) ; `index.html` 537 198 o md5 `a1390f1db5f78d711761f8c8a48a27b4` (8.8.2). Les dix re-téléchargés à l'édition, dix md5 au rapport.

## Mesures qui cadrent le morceau
- **Hub `/codes` (lecture seule)** : **122 entrées = 120 en clair+empreinte (TOUTES migrées) + 2 chaînes nues** (vestiges ELIO) + **0 clair-sans-empreinte**. Le terrain est idéalement prêt.
- **Les trois surcharges Firebase sont ABSENTES du hub** : `/analyse_logique/config` inexistant, `/plan_de_travail/config/profCodes` inexistant, 0 `config.profCodes` sur les 2 dictées de `/dictees`. Le mécanisme n'a jamais servi : « cesser d'ouvrir la porte » = retirer le MAPPING dans le code (`chargerConfigApp` d'analyse_logique, `PROF_CODES=cfg.profCodes||…` de dictee, `MJPC.PROF_CODES=cfg.profCodes…` de worktrack), les nœuds hub ne sont pas touchés (rien à y toucher).
- `_allCodesTaken` (site) lit `PROF_CODES` + le clair `codesData[k].code` ; **3 appelants**, tous derrière la garde `secuExigeCle()` (générer les manquants / un élève / toute la classe). `_eleveCode` lit le clair pour l'affichage (M-SÉCU-1 a posé l'affichage déchiffré prioritaire à côté).

## Ma réponse sur `_allCodesTaken` : **DÉCHIFFREMENT — je CONFIRME la piste de la conscience**
Raisons : ① la clé est DÉJÀ exigée pour générer (garde M-SÉCU-1, conservée) — le déchiffrement n'ajoute aucune condition nouvelle ; ② 120 AES-GCM avec une clé déjà dérivée < 1 s ; ③ l'index inversé `/codes_pris` créerait un invariant de cohérence à maintenir à CHAQUE écriture — exactement la classe d'échecs partiels que M-ÉCHECS a documentée (~525 écritures sans garde) — et une donnée de plus à protéger ; ④ le patron du déchiffrement existe déjà au site (affichage déchiffré M-SÉCU-1). Conséquence assumée : `_allCodesTaken` devient **asynchrone** — chirurgie des 3 appelants (mêmes flux, même garde).
**Point levé par la mesure** : les codes PROF sortent de `_allCodesTaken` (le tableau disparaît) — un code élève généré pourrait donc collisionner avec un code prof. **Proposition** : au tirage, chaque candidat est aussi testé contre les **empreintes de `/site/config/profEmpreintes`** (2 × PBKDF2 100k par candidat, négligeable) et rejeté s'il matche. L'unicité élève↔prof reste garantie sans clair.

## Le bouton de retrait (panneau prof du site)
« **Retirer les codes en clair** » : ① dénombrement AVANT (« 120 codes portent encore leur clair · 2 entrées anciennes hors périmètre ») ; ② **contrôle bloquant par CALCUL DIRECT avec la clé** (pas seulement `MJPC_SECU2_DIAG`, qui est par-session) : pour chacune des 120, `mjpcEmpreinte(code, sel)===empreinte` — **une discordance ⇒ refus, élèves NOMMÉS** ; et j'élargis : **une entrée en clair SANS empreinte (0 aujourd'hui) ⇒ refus nommé aussi** — retirer son clair la mettrait dehors définitivement, elle doit être régénérée d'abord ; ③ **archive intégrale de `/codes` en `/corbeille`** au format `{_meta:{chemin:"/codes",app:"site",ts},data}`, **ABANDON si l'archive échoue** ; ④ purge par `Promise.allSettled` de 120 PATCH `{code:null}` — compte rendu chiffré (réussis/échoués), terminé SEULEMENT si 120/120 ; ⑤ texte du bouton : irréversible pour Paul, PAS pour les données (« le chiffré reste : un code se raffiche avec la clé ») ; ⑥ **les 2 chaînes nues ne sont PAS touchées** (vestiges, purge = dette instruite, pas mon mandat) — signalées au compte rendu.

## Le reste du patron
**Site** : `var PROF_CODES=['1312','3141']` DISPARAÎT + la ligne d'entrée par clair + la tuile « Codes prof » adaptée + la pose d'empreintes relue (elle itérait PROF_CODES — devient : constat de présence de `/site/config/profEmpreintes`, plus de source claire). Porte = clé (canari) + **empreintes profEmpreintes** (voie ajoutée au site, même patron que la section des apps). Pastille 8.9.0.
**Les neuf** : dans `mjpcVerifierCode`, le repli clair DISPARAÎT (entrée sans empreinte → refus au message soumis ; le champ `code` d'une entrée, s'il existait encore, n'est PLUS consulté) ; `mjpcVerifierProf` perd la voie « code clair » (clé + empreintes seules) ; `PROF_CODES` en dur retiré des 8 (chaque occurrence résiduelle traitée avec preuve grep : 3 à 10 par app, dont affichages) ; les 3 mappings de surcharge retirés ; **hors https : la porte prof est déclarée indisponible, l'app s'ouvre quand même** (texte soumis) ; bandeau clé + oubli conservés ×9 ; bypass session intouché ; tolérances d'`mjpcEntreeCode` conservées ; modes test conservés ; pastilles +1 ×9 (worktrack : meta).

## LES TEXTES — soumis, flux impersonnel côté élève, aucun jargon
- Élève, entrée sans empreinte (refus post-retrait) : **« Ce code n'ouvre pas encore cet espace. Il sera renouvelé en classe — rien à faire de ton côté. »**
- Élève, code faux : inchangé (« Ce code ne correspond pas. Vérifie tes 4 chiffres. »)
- Portail sans https (porte prof absente) : **« L'espace professeur s'ouvre depuis le site publié. »** (une ligne, pas d'erreur technique)
- Bouton (prof) : **« Retirer les codes en clair — 120 codes sont prêts (chiffrés et vérifiables). Après ce geste, un code ne se lit plus qu'avec la clé de chiffrement ; rien n'est perdu : le chiffré reste. Cette action s'exécute une fois, après déploiement et vérification. »**
- Refus du bouton (discordance/non migré) : **« Retrait refusé : N code(s) doivent d'abord être régénérés (liste ci-dessous). Régénère-les avec la clé, puis relance. »**
- Compte rendu : **« Clair retiré : 120/120. Archive en corbeille. 2 entrées anciennes (hors élèves) laissées telles quelles. »**

## Le parcours ①→⑦ (banc)
Rejoué dans l'ordre réel sur un hub simulé : avant/refus-discordance/archive-d'abord/après/refus-sans-empreinte/unicité (+exclusion prof par empreinte)/porte prof par clé et **`1312` mort partout** (testé sur les dix). Bancs mémoire + navigateur (serveur local, mêmes patrons qu'hier), captures, quatre formes, mobile 390 mesuré.

## Questions (2)
**Q1** — L'exclusion des codes prof à la génération par test d'empreinte (proposition ci-dessus) : validée ?
**Q2** — Le contrôle bloquant élargi aux entrées clair-sans-empreinte (0 aujourd'hui, règle pour demain) : validé ?

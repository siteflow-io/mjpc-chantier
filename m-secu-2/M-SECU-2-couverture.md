# M-SÉCU-2 — TABLE DE COUVERTURE PAR APP
**31/07 · exécutant · les six colonnes du feu vert, app par app**

Légende : **socle** = canon 1.3.0 entier verbatim embarqué (23/23 fonctions comparées à l'octet) · **empreinte** = login élève vérifié par `mjpcVerifierCode` (banc : cas 1-2) · **repli** = entrée ancienne/chaîne nue/discordante acceptées par le clair (banc : cas 3-4-5) · **porte prof** = code clair effectif + CLÉ (canari) + empreinte hub (banc : cas 7-10) · **tolérance** = les quatre rattrapages historiques prolongés (banc : cas 4 et 6) · **pastille** = incrémentée, ancre exacte, piège de l'exemple commenté écarté.

| app | socle 1.3.0 | login empreinte | repli clair | porte prof (code+clé+empreinte) | tolérance | pastille |
|---|---|---|---|---|---|---|
| analyse_logique | ✓ 23/23 | ✓ `doLogin` async | ✓ | ✓ voie clé en tête de `doLogin` (surcharge `cfg.profCodes` intacte) | ✓ | 2.1.0 → **2.2.0** (+date 07-31) |
| applause_meter | ✓ 23/23 | ✓ 2 appelants → `mjpcVerifierCode` | ✓ | ✓ `CodeGate` + voie clé (mode test `codesTest` prioritaire CONSERVÉ) | ✓ (+ lecture par clé directe conservée, entrée complète retournée) | 2.0.0 → **2.1.0** |
| correction_dictee | ✓ 23/23 | ✓ `_finLoginEleve` async | ✓ | ✓ `setProfAuth` + voie clé | ✓ | 6.0.0 → **6.1.0** (+date 07-31) |
| dictee_universelle | ✓ 23/23 | ✓ portail élève async | ✓ | ✓ portail (voie clé) + écran prof `setAuth` ×2 (Enter+clic) + voie clé (surcharge intacte) | ✓ | 2.0.1 → **2.1.0** (+date 07-31) |
| evaluation-qcm | ✓ 23/23 | ✓ `valider` async (clé slugify conservée) | ✓ | ✓ `setProfAuth` + voie clé | ✓ | 7.0.0 → **7.1.0** (+date 07-31) |
| pilotage_debat_s3 | ✓ 23/23 | ✓ sélection par NOM puis `await mjpcVerifierCode` | ✓ | session MJPC seule (conforme à l'existant) + bandeau clé | ✓ | 2026-07-17-1 → **2026-07-31-1** |
| reecriture | ✓ 23/23 | ✓ `AppEleve` async | ✓ | ✓ `setProfAuth` + `p.onProf` + voie clé | ✓ (rattrapage AJOUTÉ là où `CODES[key]` était direct) | 2.0.0 → **2.1.0** |
| reecriture_bb4e | ✓ 23/23 | ✓ `AppEleve` async (jumelle) | ✓ | ✓ idem reecriture | ✓ idem | 2.0.1 → **2.1.0** |
| worktrack | ✓ 23/23 | ✓ onclick du portail enveloppé async | ✓ | ✓ `checkCode` + voie clé (trace `via:"cle"`, aucun code stocké) ; surcharge `plan_de_travail/config/profCodes` intacte | ✓ | meta app-version 2026-07-27a → **2026-07-31a** |

**Colonnes transverses ×9** : bandeau « clé mémorisée » auto-monté au portail (libellé exact « Ouvrir la session professeur — La clé de chiffrement est mémorisée sur cet appareil » + « Oublier la clé sur cet appareil ») · oubli local atteignable depuis CHAQUE app et l'oubli site éteint le bandeau dans les neuf (banc navigateur 5a-5×9) · comptage des discordances (`MJPC_SECU2.discordances`, console.warn) · lecture seule au hub (la section ne porte AUCUNE écriture) · double parseur script par script · diff classé · invariants.

# M-SÉCU-3 — TABLE DE COUVERTURE PAR FICHIER
**31/07 · exécutant · le retrait du clair, fichier par fichier**

Légende : **clair retiré** = plus aucun littéral `1312`/`3141`/`PROF_CODES`/`DEFAULT_PWD` (grep = 0, vérifié ×10) · **repli retiré** = `mjpcVerifierCode` v3, l'empreinte seule fait foi, entrée sans empreinte → refus au message validé · **porte prof** = clé + empreintes hub SEULES (`mjpcVerifierProf` v3, 1 argument) · **hors https** = la porte se déclare (« L'espace professeur s'ouvre depuis le site publié »), l'app s'ouvre · **bandeau** = « clé mémorisée » + oubli conservés (M-SÉCU-2) · **pastille** incrémentée.

| fichier | clair retiré | repli retiré | porte prof clé+empreintes | hors https | bandeau | pastille |
|---|---|---|---|---|---|---|
| **index.html** | ✓ (`var PROF_CODES` + porte clair + tuile) — **+ le BOUTON DE RETRAIT** (`secuRetirerClair` : contrôle bloquant nommé, archive AVANT, allSettled compté) · `_allCodesTaken` par DÉCHIFFREMENT · `_genCode4` rejette les candidats-prof (Q1) · 3 appelants async · `secuPoserEmpreintesProf` → constat | n/a (site) | ✓ clé (existante) + **voie empreinte pour code seul** (nom/prénom vides) | encart : texte existant conservé | encart site (existant) | 8.8.3 → **8.9.0** |
| analyse_logique | ✓ (seed+surcharge+panneau+commentaires) | ✓ + message | ✓ tête clé ≥8 + branche nom-inconnu par empreinte | ✓ | ✓ | 2.2.0 → **2.3.0** |
| applause_meter | ✓ (const+CodeGate+commentaire) | ✓ + message ×2 appelants | ✓ CodeGate voie unique | ✓ | ✓ | 2.1.0 → **2.2.0** |
| correction_dictee | ✓ | ✓ + message | ✓ voie unique | ✓ | ✓ | 6.1.0 → **6.2.0** |
| dictee_universelle | ✓ (var+cfg+**export sans accès prof** : `PROF_CODES_EXPORT` retiré, le fichier distribué ne porte plus AUCUN code prof) | ✓ + message | ✓ portail (tête clé) + écran prof ×2 (Enter+clic) voie unique | ✓ | ✓ | 2.1.0 → **2.2.0** |
| evaluation-qcm | ✓ (var + **l'aide qui AFFICHAIT « 1312 ou 3141 »** → texte clé) | ✓ + message | ✓ voie unique | ✓ | ✓ | 7.1.0 → **7.2.0** |
| pilotage_debat_s3 | ✓ (**`DEFAULT_PWD="1312"` retiré**, `ensureProfPassword` supprimée — le nœud hub `debat_config/profPassword`='1312' cesse d'être LU, non supprimé, signalé) | ✓ + message | ✓ `checkProfPassword` → `mjpcVerifierProf` | ✓ (message à la porte) | ✓ | 2026-07-31-1 → **-2** |
| reecriture | ✓ (var+2 portes+commentaire) | ✓ + message | ✓ portail (code seul) + `tryProfCode` voie unique | ✓ | ✓ | 2.1.0 → **2.2.0** |
| reecriture_bb4e | ✓ (jumelle) | ✓ | ✓ idem | ✓ | ✓ | 2.1.0 → **2.2.0** |
| worktrack | ✓ (seed strings + mapping surcharge + **sortie clavier plein-écran par EMPREINTE** (`_onKey` : les 4 derniers chiffres, verrou anti-réentrance)) | ✓ + message | ✓ `checkCode` voie unique, trace `via:<voie>` | ✓ | ✓ | 2026-07-31a → **b** |

**Transverses ×9** : la section v3 (4 fonctions clés) **identique à l'octet dans les neuf** (empreinte unique au banc) · `mjpcMessageRefusEleve` : « Ce code n'ouvre pas encore cet espace. Il sera renouvelé en classe — rien à faire de ton côté. » (sans-empreinte) / « Cet espace s'ouvre depuis le site publié. » (indisponible) · échec porte prof : « Ce code ou cette clé n'ouvre pas l'espace professeur. » · lecture seule au hub hors clic du bouton · tolérances d'entrée conservées · bypass session intouché · modes test conservés (le bouton du site route `M8_TEST_STORE`).

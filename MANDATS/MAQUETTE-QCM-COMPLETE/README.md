# La maquette complète du QCM — livraison de l'exécutant (en cours : étape 1 faite)

*Mandat : `MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md`. Ce README grandit à chaque étape ; sa forme finale est écrite à l'étape 5.*

## Étape 1 — le socle

### Ce que j'ai lu (mandat §2), avec les md5

Au sas (`siteflow-io/mjpc-chantier`, `main` à `b6d352c`) :

| Fichier | md5 | Lu |
| --- | --- | --- |
| `MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md` | `fbe136b63552f697c9d0051bef4bb6f1` | en entier |
| `MANDATS/CADRAGE-QCM.md` | `58ee8b4e3f990005a6b73429197c482c` | en entier (ligne d'état, points 1 à 679, archive) |
| `MANDATS/MAQUETTE-QCM-FLUX/README.md` | `df9a65e6eaf4b41a004a045a56954f21` | en entier |
| `AUDITS/QCM-MODE-TEST-09-10/README.md` | `efd4dcc92683bfe1744d1a7009ba2cca` | en entier |
| `MANDATS/PROMPT-QCM-CREATION/README.md` | `ab11646beec84e8bd659d56d76cc8c0d` | en entier |
| `MANDATS/LIBELLES-ELEVE-COMPETENCES/README.md` | `1b72a3d2c098b5491d9c1a953bdd2eaf` | en entier |
| `MANDATS/EN-TETES-APPS-BINOMES/README.md` | `74a7cacdfe86bf6fd1d995c13681a54d` | en entier |
| `MANDATS/INVENTAIRE-QCM-TOUT-VISIBLE.md` | `124b4edcbc552f18c3566a0b1a21e15d` | en entier |
| `MANDATS/DETTES-QCM-179-184-A-REPORTER.md` | `6e4fbff8842dfb16d106ee817524b1f1` | en entier |
| `MANDATS/MAQUETTE-QCM-FLUX/maquette/` : `maquette.js` `0f473404…`, `maquette2.js` `2bfaa451…`, `maquette610.js` `9258e8db…`, `maquette620.js` `f1a15f79…`, `maquette626.js` à `628.js`, `com632.js` `63f215d0…`, `ev3e.js` `3dcf7a73…`, `libelles_eleve.json` `17e9a987…`, `qcm.css` `80157ddd…`, les scripts | voir `sorties/lectures-md5.txt` | en entier (sauf `qcm.css`, le CSS de la 7.7.1, repris tel quel) |
| `MANDATS/MAQUETTE-QCM-FLUX/pdf-632/gen632.js` | `a2f3b16c8f275acbe7e0b5fe51e1f8b1` | en entier |

Dans la production (`siteflow-io/monsieurjaipascompris`, clonée en lecture, `main` à `d873f69`) : les md5 sont ceux du mandat, vérifiés avant tout.

| Fichier | md5 | Lu |
| --- | --- | --- |
| `PROTOCOLE-MAQUETTE.md` | `cea75531c1caf46e566ef45b5a9f3d17` | en entier ; appliqué |
| `evaluation-qcm.html` (7.7.1) | `ecae65624855a1a877708986a8e984e5` | source des phrases (le banc la cherche entière) ; lue par écran aux étapes où l'écran change |
| `index.html` (MJPC) | `ac792b28f40d3a0510e725fc4a6b6985` | la fiche de classe et l'éditeur de taxonomie, à l'étape 4 |
| `correction_dictee.html` | `9d5dcfb612a70a8182689566b1fe23c5` | « Bilan général », Réglages, « rendre les copies », à l'étape 4 |
| `docs/MJPC6-DETTES.md` | `57cc7f41a87ea6f81087492346a7954d` | en entier (3 090 lignes), par un sous-agent ; relevé des pièges : `sorties/pieges-dettes-journal.md` |
| `docs/MJPC6-journal.md` | `ea5cbd76aaf8cb0b49ca77b819894a67` | en entier (1 068 lignes), par le même sous-agent |

### Ce qui est fait

- **Une seule maquette**, `maquette-qcm-v1.html` (md5 dans `maquette-qcm-v1.html.md5`), un fichier HTML autonome, sans réseau : elle réunit **tous les morceaux existants** (§3 du mandat), sans rien changer : les 66 scènes du tour 603, les 9 scènes x610, les 3 scènes x620, les scènes x626 à x628, et le PDF de `pdf-632` (sa page HTML, sortie de `gen632.js`, telle quelle). 85 scènes, **dans l'ordre de la séance** (préparer, avant l'heure, l'entrée, les trois questions, les gestes rares, l'estimation, la correction, la co-évaluation, la fin, le soir, l'élève après, une autre séance, le mode test, l'annexe), chacune ouvrable par `#scene=ID`.
- **Le sommaire** derrière le bouton ⚙ « Scènes de la maquette » (en bas à droite) : le seul écran de simulation (protocole §2). Échap le ferme.
- **L'assemblage** : `build.py N` (le CSS de la 7.7.1 tel quel, les CSS des maquettes, React 17 local, les scènes, le socle `src/socle.js`) ; il refuse de réécrire une version déjà livrée.
- **Le banc unique** : `node banc/banc.js maquette-qcm-vN.html N` (§8). Sortie de l'étape : `sorties/banc-etape1.txt` — **847 vérifications, zéro défaut**.
- **Les captures** : `node capture.js maquette-qcm-vN.html` → `captures/NNN-id.png`, toutes regardées.
- **Le tableau des scènes changées, ajoutées ou retirées aux étapes 2 à 4, point par point** : `PLAN-ETAPES-2-4.md`.
- **Le journal des défauts** : `DEFAUTS.md`.

### Le banc, et comment il grandit

Les vérifications 1 (chaque scène s'ouvre sans erreur et montre quelque chose, le sommaire marche), 6 (aucune boîte système, aucun réseau, aucun stockage : dans le source et à l'exécution) et 7 (aucun vrai élève) portent sur **toutes** les scènes dès l'étape 1. Les vérifications 2 (débordement), 3 (chaque phrase de l'élève retrouvée mot pour mot dans le cadrage, les sources des maquettes, les textes rendus des maquettes existantes ou la 7.7.1), 4 (les mots interdits côté élève, dont les infobulles côté élève), 5 (infobulles et boutons inertes, chaque bouton cliqué sur la scène fraîche), 8 (chevauchements et textes coupés) et 9 (le commentaire de com632, le PDF de gen632) portent sur les scènes déjà relues par une étape (la colonne « étape » du sommaire) ; à l'étape 5, tout porte sur tout. Le banc a été éprouvé contre un piège : un nom inventé (« DUPONT Marie ») est bien refusé, et une phrase de l'existant est bien retrouvée.

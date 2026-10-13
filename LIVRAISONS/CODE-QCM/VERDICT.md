# Verdict de la livraison du code du QCM — QCM-4 · BANC, reprise du 13/10/2026, 08:30

*Mandats : `MANDATS/CODE-QCM/COMMUN.md` et `QCM-4-BANC.md` (branche `main`) ; la reprise : `DEFAUTS-OUVERTS.md`, « Reprise du 13/10 » (Paul, 07:22). App livrée : `evaluation-qcm.staging.html`, md5 **`360af4ba39ad028143c258ad3b42c408`**, assemblée par `build.py` sur `code-qcm` à `d669ea6` (tout ce qui a été poussé jusqu'à 08:00). Le verdict de 06:00 (app `1fed29e0…`, puis `172efa3c…` à 06:29) est remplacé par celui-ci.*

## En une phrase

**La décision de Paul est tenue (la correction ne commence que sur son clic) et le chemin de l'heure tel que la maquette le joue passe en entier sur tous les appareils, le soir et le reste aussi ; mais les relecteurs neufs de 08:00 voient encore, dans des gestes que Paul fera (rouvrir pour un élève ou pour tous, une console rechargée, une alerte de co-évaluation sur une question trouvée au dernier moment), des défauts de l'heure ouverts : l'heure ne va pas telle quelle.** Le soir va, sous une réserve ; le reste va.

## Ce qui le prouve

| Épreuve | Sortie | Résultat | Durée |
| --- | --- | --- | --- |
| Contrôles de la conscience (`AUDITS/CONTROLES-QCM-APP/controles-app.js`, md5 vérifiés, non modifiés) | `sorties/2026-10-13_0800/controles.txt` | **22 / 30** : K1 à K10 passent ; les 8 échecs (K11 à K15) viennent de ce que K11 attend que la correction commence seule et ne clique pas « ▶️ Commencer la correction », ce que la décision de Paul de 07:22 interdit désormais (QCM-1 le signale aussi, DEMANDES 07:54). Ce que K11 à K15 vérifient ensuite (l'ordre, « 💡 Révéler », la trouvée, le bilan 3 / 3 et 1 / 3, la base) est vérifié par le banc, après le clic | 98 s |
| Banc commun : la séance du scénario, console + 12 tablettes + téléphone + tableau, de l'appel au bilan (24 notes comparées à la règle), avec **la correction au clic de Paul** (fermé, ouvert quand tous ont coché, rien sans le clic, puis la lecture) ; le soir ; le reste | `sorties/2026-10-13_0800/banc.txt` | **211 / 211** | 6 min 1 s |
| Gestes rares (démo, entrée qui se trompe, 👁, temps ajouté, départ et retour, écarter / remettre, annuler, rouvrir, finir et reprendre, console perdue, tablette et téléphone rechargés) | `branches.txt` | **47 / 47** | 2 min 7 s |
| L'heure de demain (4e, JSON collé, 11 questions, élève seul, correction au clic de Paul, soir, PDF) | `demain.txt` | **109 / 109** | 10 min 32 s |
| Fidélité à la maquette v9 | `fidelite.txt` | 120 scènes atteintes sur 157 (hors MJPC), 49 sans écart ; 37 non atteintes | — |
| Les trois bancs en même temps, avec les contrôles et la fidélité | `resume.txt`, `synthese.txt` | assemblage complet | **12 min 16 s** (< 20 min) |
| Relecteurs neufs de 08:00 (sous-agents qui n'ont vu ni le code ni le banc : la maquette, son README, l'adresse de l'app, et la décision de Paul) sur l'app de 08:00 | `banc/relecteurs/R4`, `R5`, `R6` : `trouvailles.md`, `cap/` | R4 (de l'appel à la fin des questions) 13 trouvailles ; R5 (de l'estimation au bilan) 11 ; R6 (la fin et le soir) 6 ; retenus : **9 défauts**, dont 4 déjà connus | 8 à 12 min chacun |
| Relecteurs neufs de 05:00 (R1, R2, R3, sur l'app de 05:00) | `banc/relecteurs/R1`, `R2`, `R3` | 11 défauts ; 3 rayés à 08:13 (rejoués corrigés), 1 rayé (pas un défaut) | — |

Captures de l'heure à chaque phase et sur chaque appareil : `sorties/2026-10-13_0800/captures/` et `captures-demain/`. L'assemblage d'essai de 07:46 sur l'app de 06:16 (`sorties/2026-10-13_0746`) montre que le banc voit bien une correction qui commence seule (5 échecs).

## Par partie

### L'heure de classe — **ne va pas telle quelle**

Ce qui va, prouvé par le geste (banc et relecteurs) : la décision de Paul (la correction attend son clic ; rien d'autre ne part seul : la question suivante, l'estimation, la co-évaluation, le bilan attendent un geste) ; l'appel, l'entrée, les attestations, les questions à leurs deux tours avec B, l'élève qui ne clique rien, la question sans réponse close sans rien lancer, l'estimation, la correction, « 💡 Révéler », la trouvée au dernier moment, la co-évaluation à son ouverture, le bilan juste pour les 24 élèves, « 🛑 Terminer » même la console fermée aussitôt.

Rayés depuis 06:00, rejoués corrigés par un relecteur neuf : « 0 pense (tranché) » (R5) ; une séance terminée restée en cours (R6) ; « 🔓 Rouvrir pour un élève » qui listait les non-entrés (R4) ; les absents au tableau (pas un défaut : la maquette les liste).

Défauts ouverts (détail, gestes, captures : `DEFAUTS-OUVERTS.md`, sections R4, R5, R6 en tête) :

| Propriétaire | Défaut | Quand il se produira |
| --- | --- | --- |
| QCM-1, QCM-2 | « 🔓 Rouvrir pour un élève » rouvre la question pour toute la classe (téléphone, tableau, puis un 2e tour pour tous) | chaque « Rouvrir pour un élève » |
| QCM-1 | « 🔓 Rouvrir pour tous » ne rouvre plus rien | chaque « Rouvrir pour tous » |
| QCM-1, QCM-2 | l'alerte de la co-évaluation ignore « Trouvée au dernier moment », et sa garde se contredit (« reste à 0 ; note 3 / 3 ») | un élève trouvé au dernier moment qui signale ❌ cette question |
| QCM-1, QCM-2 | « ⚠️ Séance interrompue détectée » : état et heure faux ; la reprise remet le chrono de réflexion à son début | chaque console rechargée |
| QCM-1, QCM-2 | les compteurs : « 24/24 CONNECTÉS » à Q1 avec 4 entrés ; « ONT RÉPONDU » change de dénominateur | des présents qui n'entrent pas |
| QCM-2 | au téléphone, « ▶️ Commencer la correction » reste fermé quand tous sont prêts | chaque correction lancée du téléphone |
| QCM-2 | le chrono du téléphone ne bouge pas | chaque question |
| QCM-2 | au téléphone, « Aucune session active » (README point 8 : « séance ») | après chaque séance |
| QCM-1 (à confirmer) | « n'a pas dit si sa feuille disait son clic » pour un « Oui » cliqué dans les dernières secondes | un élève qui répond tard à B |

Non rejoués par un relecteur neuf, faute de temps : B demandé sans clic, la question sans réponse dans l'ordre de la correction (corrigés selon QCM-2 et QCM-1 ; le banc ne les joue pas).

### Le soir — **va, sous une réserve**

Banc du soir 38 / 38 (Résultats par niveau, le tableau de la séance, les fiches, « ✔ Marquer lue », « Que dit la feuille ? », le point d'autonomie, rendre les copies, le PDF, « 📊 Mes évaluations », la corbeille, la sauvegarde). Réserves : « Que dit la feuille ? » corrigé par QCM-3 (`463d0bf`) n'a pas été rejoué par un relecteur (R6 bloqué avant les questions) ; une séance terminée avant Q1 compte « 📌 12 feuilles à lire » (R6, QCM-1 et QCM-3).

### Le reste — **va**

16 / 16 et 22 / 22 pages ; écarts de fidélité nommés et justifiés dans `banc/ecarts-maquette.json` ; non joués par le banc : la séance sur papier en entier, le rattrapage, une partie du mode test (37 scènes non atteintes, listées dans `fidelite.txt`).

## Par propriétaire

- **QCM-1 · SOCLE** : 7 défauts ouverts (rouvrir pour un élève, rouvrir pour tous, alerte et trouvée, séance interrompue, compteurs, « n'a pas dit » à confirmer, 12 feuilles à lire), dont 4 partagés avec QCM-2 et 1 avec QCM-3.
- **QCM-2 · HEURE** : 7 défauts ouverts (les 4 partagés, plus : « Commencer la correction » au téléphone, le chrono du téléphone, « session »).
- **QCM-3 · SOIR** : 1 défaut partagé (12 feuilles à lire) ; « Que dit la feuille ? » à rejouer.
- **La conscience** : K11 des contrôles ne clique pas « ▶️ Commencer la correction » ; avec la décision de Paul, K11 à K15 ne peuvent plus passer sans ce clic.

## Pour l'audit de 08:30

Le chemin nominal de l'heure et la décision de Paul sont sûrs : 211 / 211, 47 / 47, 109 / 109 sur l'app de 08:00. Les défauts ouverts touchent des gestes que Paul fera probablement (rouvrir, une console rechargée, le téléphone). Le banc se rejoue par `bash LIVRAISONS/CODE-QCM/banc/assembler.sh` (12 min).

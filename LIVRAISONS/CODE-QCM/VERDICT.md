# Verdict de la livraison du code du QCM — QCM-4 · BANC, 13/10/2026 06:00

*Mandats : `MANDATS/CODE-QCM/COMMUN.md` et `QCM-4-BANC.md` (branche `main`). App livrée : `evaluation-qcm.staging.html`, md5 `1fed29e0977813429d2dca767ff5e08d`, assemblée par `build.py` sur `code-qcm` à `99c4ca7` (aucun commit des trois autres exécutants depuis 02:00 : c'est l'app de 02:00, de 04:00, de 05:00 et de 05:31).*

## En une phrase

**Le chemin de l'heure tel que la maquette le joue passe en entier, sans un échec, sur tous les appareils, et le soir aussi ; mais les relecteurs neufs ont trouvé, dans des situations réelles de classe que le banc ne jouait pas, 9 défauts de l'heure et 2 du soir, encore ouverts à 06:00 : l'heure et le soir ne vont pas tels quels.** Le reste va.

## Ce qui le prouve

| Épreuve | Sortie | Résultat | Durée |
| --- | --- | --- | --- |
| Contrôles de la conscience (`AUDITS/CONTROLES-QCM-APP/controles-app.js`, md5 vérifiés) | `sorties/2026-10-13_0531/controles.txt` | **30 / 30** | 106 s |
| Banc commun : la séance du scénario de la maquette, console + 12 tablettes + téléphone + tableau, de l'appel au bilan (les 24 notes comparées à la règle), puis le soir, puis le reste | `sorties/2026-10-13_0531/banc.txt` | **208 / 208** | 5 min 41 s |
| Gestes rares : démo, entrée qui se trompe, « 👁 », temps ajouté, départ et retour, écarter / remettre, annuler, rouvrir, finir à une autre heure et reprendre, console perdue, tablette et téléphone rechargés | `sorties/2026-10-13_0531/branches.txt` | **47 / 47** | 2 min 00 s |
| L'heure de demain : une 4e, le JSON collé (11 questions, `4e-ch1` sans fiche au hub), 3 tablettes dont un élève seul, les 11 questions, la correction, le bilan, le soir, le PDF | `sorties/2026-10-13_0531/demain.txt` | **107 / 107** | 10 min 25 s |
| Fidélité à la maquette v9 (texte, gestes, infobulles de chaque scène, aux données près) | `sorties/2026-10-13_0531/fidelite.txt` | 120 scènes atteintes par le geste sur 157 (hors MJPC) ; **49 sans écart** ; 71 avec des écarts non nommés, relus : données du faux hub ou moment du relevé, sans défaut d'app identifié hors ceux ci-dessous ; 37 non atteintes | — |
| Les trois bancs en même temps, avec les contrôles et la fidélité | `sorties/2026-10-13_0531/resume.txt`, `synthese.txt` | assemblage complet | **12 min 18 s** (< 20 min) |
| Relecteurs neufs (trois sous-agents qui n'avaient vu ni le code ni le banc, la maquette, son README et l'adresse de l'app seulement), lancés à 05:00 sur l'app de 05:00, la même | `banc/relecteurs/R1`, `R2`, `R3` : `trouvailles.md` et leurs captures | 25 trouvailles, dont **11 défauts** retenus (les autres : données du faux hub des relecteurs — le sexe des élèves, une date — ou hors de l'app) | 13 à 19 min chacun |

Captures de l'heure, à chaque phase et sur chaque appareil : `sorties/2026-10-13_0531/captures/` (124, nommées par leur scène et leur appareil) et `captures-demain/` (16). Le journal des phases de la base : `phases.txt`, `phases-demain.txt`, `phases-branches.txt`. Les assemblages de la nuit : `sorties/2026-10-12_2000`, `_2200`, `2026-10-13_0001`, `_0200`, `_0401`, `_0531`.

## Par partie

### L'heure de classe — **ne va pas tel quel** (le chemin de la maquette passe ; 9 défauts ouverts dans des cas réels)

Ce qui va, prouvé par le geste : lancement, appel (absent, binôme réapparié), binômes d'après le QCM précédent, entrée au code sur les tablettes partagées (codes faux, code non enregistré, mauvaise tablette), attestations, les questions à leurs deux tours avec B, « ⏭️ Tour suivant », écarter / remettre, annuler, rouvrir pour un élève, départ et retour, finir à une autre heure et reprendre, console perdue, tablette et téléphone rechargés, l'estimation, la seconde attestation, la correction dans l'ordre des plus ratées par la lecture du voisin, « 💡 Révéler », « Trouvée au dernier moment » exactement où la règle la met, le point d'autonomie, la co-évaluation et l'alerte tranchée, le bilan de chaque élève (24 notes justes), « 🛑 Terminer » ; l'heure de demain (4e, 11 questions, élève seul) de bout en bout. Rien ne se recharge, aucune erreur de page, aucune boîte système.

Défauts ouverts (détail, gestes et captures dans `DEFAUTS-OUVERTS.md`, sections « Relecteur neuf R1 » et « R2 ») :

| Propriétaire | Défaut | Quand il se produira demain |
| --- | --- | --- |
| QCM-1 | « 🔓 Rouvrir pour tous » rejoue le 1er tour (15 s de voile, B reposé) à ceux qui ont déjà répondu | chaque fois que Paul rouvre pour tous |
| QCM-1, QCM-2 | un élève rouvert seul n'a pas B ; la console reste sur « Question close » pendant qu'il répond, le téléphone et le tableau annoncent un 2e tour à toute la classe | chaque « 🔓 Rouvrir pour un élève » |
| QCM-1 | une question à laquelle personne n'a répondu passe en dernier dans l'ordre de la correction (au lieu d'être la plus ratée), « 0 / 0 justes » | rare (toute une classe sans réponse) |
| QCM-1, QCM-2 | l'alerte de la co-évaluation ignore « Trouvée au dernier moment » (« passe de 0 à 1 point » alors qu'il a déjà le point) | quand un élève trouvé au dernier moment signale ❌ cette question |
| QCM-2 | B demandé à un élève qui n'a rien cliqué (« ton clic est enregistré »), pas à un autre dans le même cas | chaque élève qui laisse passer son temps |
| QCM-1, QCM-2 | compteurs faux quand des présents ne sont pas entrés (« 24/24 connectés » avec 4 entrés, « 0/0 attestations », tablettes vides « ✋ répond… », « Rouvrir pour un élève » liste les non-entrés) | un élève présent qui n'entre pas, ou qui entre en retard |
| QCM-1, QCM-2 | « ⚠️ Séance interrompue détectée » annonce un état et une heure de coupure faux (la reprise, elle, retrouve le bon moment) | une console rechargée |
| QCM-2 | « ❌ 0 pense : mal lu (tranché) » à l'ouverture de la co-évaluation | chaque co-évaluation |
| QCM-2 (à confirmer) | le tableau liste les absents dans « 👥 Classe (25) » | chaque séance avec des absents |

### Le soir — **ne va pas tel quel** (le chemin de la maquette passe ; 1 défaut ouvert, 1 à confirmer)

Ce qui va : Résultats par niveau, le tableau de la séance, les fiches, « ✔ Marquer lue », « Que dit la feuille ? » (la note de Lou passe à 1 / 3 partout), le point d'autonomie le soir, rendre les copies, le PDF « notes et compétences » dans sa fenêtre (chapitre compris, pour 3 et pour 11 questions), « 📊 Mes évaluations » de l'élève avant et après la remise, masquer, la corbeille, la sauvegarde.

| Propriétaire | Défaut |
| --- | --- |
| QCM-3 | « Que dit la feuille ? » : la correction de Paul est attribuée au voisin (« Tom y a lu 8 ») et la feuille reste « à lire » |
| QCM-1 (à confirmer) | une séance terminée pendant que la console se fermait reste « en cours » et « interrompue » |

### Le reste — **va**

Évaluations rangées par niveau, la démo permanente, « ➕ Nouvelle évaluation » (le JSON de 4e accepté et rangé, un JSON fautif refusé avec ses erreurs et « 📋 Copier les erreurs »), l'éditeur, l'impression, la corbeille d'une évaluation, Réglages en cartes, le prompt sans jeton visible et sa modification, le mode d'emploi, le QR, le mode test (sans toucher à une vraie classe), le papier au lancement, l'accueil. Écarts de fidélité nommés et justifiés : `banc/ecarts-maquette.json` (les données du scénario absentes du faux hub, le bandeau d'impression du navigateur, le menu du chapitre du prompt). Non joués par le banc : la séance sur papier en entier, le rattrapage, une partie du mode test (37 scènes non atteintes, listées en fin de `fidelite.txt`).

## Par propriétaire

- **QCM-1 · SOCLE** : 7 défauts ouverts, dont 5 partagés avec QCM-2 (rouvrir pour tous, élève rouvert, ordre avec une question sans réponse, alerte et trouvée, compteurs, séance interrompue, séance terminée restée en cours).
- **QCM-2 · HEURE** : 7 défauts ouverts, dont 5 partagés avec QCM-1 (plus : B sans clic, « 0 pense (tranché) », absents au tableau).
- **QCM-3 · SOIR** : 1 défaut ouvert (« Que dit la feuille ? »).

## Pour l'audit de 07:00

Le chemin nominal de l'heure, celui de la maquette, est sûr : 30 / 30, 208 / 208, 47 / 47, 107 / 107, cinq fois de suite depuis 00:00. Les défauts ouverts touchent des gestes que Paul fera probablement demain (rouvrir, un élève qui ne répond pas à temps, une console rechargée). Leur liste exacte, avec les gestes et les captures, est en tête de `DEFAUTS-OUVERTS.md`. Le banc se rejoue par `bash LIVRAISONS/CODE-QCM/banc/assembler.sh` (12 min).

# Contrôle de la conscience n°12 — le temps tapé (28) et la note d'une séance arrêtée avant la fin (29, seconde moitié), 19/10/2026, 18:01

La reprise : section « Le temps tapé, et la note d'une séance arrêtée avant la fin — 19/10/2026 » de `LIVRAISONS/CODE-QCM/DEFAUTS-OUVERTS.md` (branche `code-qcm`, `fb9a961d`), sur l'ordre de Paul (19/10, 09:43 : « 28: oui » ; 29, seconde moitié, non commentée, donc acquise).

L'app contrôlée : `evaluation-qcm.staging.html` assemblée par `build.py` à `a269fea` (rien n'a changé dans `src/` ni `build.py` jusqu'à `73e4756a`), reconstruite à l'identique par la conscience : md5 `94e5e069d0d5b681bf94a4506fa81e1f`, 2 035 367 o. Le VERDICT de QCM-4 de 17:33 (`7271cb5`) : ça va.

| Contrôle, fixé d'avance dans la section | Résultat |
|---|---|
| les contrôles fixes de la conscience (`AUDITS/CONTROLES-QCM-APP/controles-app.js`, md5 `35a0f5c2…`), dont K6 | `controles.txt` : 32 / 32 |
| 28, par le geste dans le mode test (`sonde-temps.js`) : « 45 » tapé pendant le 1er tour de Q1 (rien d'écrit, le tour continue ; à Entrée 45 ; rien d'écrit une seconde fois en quittant le champ) ; « 130 » tapé à la lecture, les lectures déjà cliquées (aucune figée, rien d'écrit ; à Entrée 130) ; « +10 » avant le 0 (140, tout de suite) et après le 0 (la lecture repart pour 10 s) | `sonde-temps.txt` : 16 / 16 |
| 29, seconde moitié, par le geste (`sonde-note.js`, sur la séance du banc du 13/10, élèves fictifs, `base-soir-banc-13-10.json`) : terminée après Q2, Q1 et Q3 jamais lues en classe, deux présents ; le soir, « Lire les copies » propose Q1 et Q3, Paul les lit ; la même note dans « La note, en direct », au tableau de la séance et sur la tablette de l'élève (« 📊 Mes évaluations »), une fois les copies rendues | `sonde-note.txt` : 13 / 13 |
| le parcours du mode test (`AUDITS/CODE-QCM-MODE-TEST-VRAIES-EVALS-16-10/sonde-modetest.js`), rejoué sur cette app | `sonde-modetest-sur-94e5e069.txt` : 24 / 24 |

Lu dans le diff `882611f..a269fea` (`src/`) : `ChampTemps` (`c3-pilot.js`, Entrée ou sortie du champ, un seul envoi), trois infobulles de Paul (« puis Entrée »), `S.note` (`live/base.js`, la séance terminée), `aLireCopiesV` (`c4-seances.js`, les questions posées jamais lues en classe, une phrase pour Paul : « … : la correction s'est arrêtée avant cette question ; personne n'a lu sa feuille en classe. »), `lire-copies.js`.

Un cas laissé à Paul (section, point 6) : une séance terminée en pleine lecture, la feuille lue par le voisin, la question pas révélée. `a269fea` compte la lecture du voisin et ne propose pas la feuille à Paul le soir.

Aucune capture archivée (les tablettes simulées portent des noms).

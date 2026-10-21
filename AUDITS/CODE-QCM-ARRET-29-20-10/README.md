# Contrôle de la conscience n°12 — 29 tranché par Paul (20/10, 08:49), points 7 à 11 — 21/10/2026

La reprise : section « Le temps tapé, et la note d'une séance arrêtée avant la fin — 19/10/2026 » de `LIVRAISONS/CODE-QCM/DEFAUTS-OUVERTS.md` (branche `code-qcm`, `26de9deb`), points 7 à 11 : une question jamais lancée d'une séance terminée sort du total, « Q4 à Q11 pas posées » ; une question lue par le voisin sans « Révéler » reste « pas encore lue » jusqu'au « ✅ Oui » de Paul le soir.

L'app contrôlée : `evaluation-qcm.staging.html` assemblée par `build.py` après `725c3af` (rien n'a changé dans `src/` ni `build.py` jusqu'à `e2018682`), reconstruite à l'identique par la conscience : md5 `3b4d0f821ffad2d9bb82817a4ab2cdf5`, 2 040 107 o. Le VERDICT de QCM-4 du 20/10 16:20 : ça va (banc-arret 55 / 55).

| Contrôle, fixé d'avance (point 11) | Résultat |
|---|---|
| les contrôles fixes (`AUDITS/CONTROLES-QCM-APP/controles-app.js`, md5 `35a0f5c2…`) | `controles.txt` : 32 / 32 |
| la séance arrêtée après Q3, par le geste (`sonde-arret.js`, la séance du banc du 13/10 portée à 11 questions, élèves fictifs, `AUDITS/CODE-QCM-TEMPS-NOTE-19-10/base-soir-banc-13-10.json`) : « Q4 à Q11 pas posées » en tête du tableau, jamais « écartée » ; Tom 0/3, « 1 question pas encore lue » (Q3, lue par Léa sans « Révéler ») ; le soir, Q3 proposée avec ce que Léa a lu, « ✅ Oui » enregistre la lecture de Paul ; 1/3 · 6,7 dans « La note, en direct », au tableau et sur la tablette de Tom ; l'attendu vient de la base | `sonde-arret.txt` : 14 / 14 |
| le temps tapé (28), rejoué | `sonde-temps-sur-3b4d0f82.txt` : 16 / 16 |
| la note du soir (29, seconde moitié), rejouée | `sonde-note-sur-3b4d0f82.txt` : 13 / 13 |
| le mode test des vraies évaluations, rejoué | `sonde-modetest-sur-3b4d0f82.txt` : 24 / 24 |

Lu dans le diff `a269fea..725c3af` (`src/`) : `S.note` (`live/base.js` : « x » pour une question jamais lancée d'une séance terminée ; « n » pour une question lue par le voisin sans « Révéler ») ; `resultatLocalV`, `nonPoseesV`, `nonPoseesTexteV`, `aLireCopiesV` (une phrase pour Paul : « Léa a lu la feuille de Tom en classe, mais la question n'a pas été révélée : Tom n'a pas pu contester. »), l'en-tête du tableau et le PDF (`c4-seances.js`) ; `lire-copies.js` (« ✅ Oui » écrit la lecture de Paul, les questions pas posées hors de la copie) ; l'ordre de la correction ne prend que les questions lancées (QCM-1).

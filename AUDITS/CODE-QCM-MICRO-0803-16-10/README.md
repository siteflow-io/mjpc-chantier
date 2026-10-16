# Micro de la conscience n°12 — 8.0.3 (16/10/2026, dettes n°12 · 216 à 219)

Paul, 16/10, 10:54 : « Le plus logique c'est qu'ils gardent la feuille du voisin pendant toute la correction. Ainsi pas d'allers retours, et ce qu'ils voient à l'écran leur parle évidemment de la copie du voisin et pas de la leur. De plus, autant les notes ne s'affichent pas côté élève, si je t'ai bien compris, autant moi dans mon pilotage je dois les voir ! Par ailleurs, l'affichage "écartée " s'affiche quand dans mon bilan de classe? » ; 11:02 : « Voilà. Par ailleurs il me semble que je n'ai pas la main sur le chrono de correction. Il le faut, je dois avoir les options rapides +5 +10 etc. »

## Verdict : ça va ; en ligne comme 8.0.3

## Ce qui est fait (code-qcm `9faf1e63`, bancs et écarts `d7897c18`, app md5 `156a13f0723cab51146e4a1f3339ea6e`)

La feuille du voisin toute la correction, sur tablette avec un voisin (les phrases proposées par la conscience, validées par Paul à 11:02) : « Avant la correction » (`LignesAttest2`) : « Maintenant, la correction. Donne ta feuille à … et prends la sienne : tu la gardes jusqu'à la fin de la correction. », la ligne ajoutée « Puis tu corriges la feuille de … en vert, comme sa moitié de la tablette te le dit. », et « … si tu lis et corriges avec soin la feuille de … » ; à la lecture (`EcrLecture`), plus de « montre ta feuille » ; à « Révéler » (`EcrRevele`, option `voisin` passée par `MoitieH`), « ✅ Élise avait juste ! » / « ❌ Élise avait faux. », « Sa réponse », « Gatien, sur la feuille d'Élise, mets simplement un V vert dans la marge à côté de sa réponse. » / « …, barre sa réponse et écris la bonne réponse en entier en vert à côté. », et pour « Trouvée au dernier moment » « Sa feuille disait autre chose, mais Élise a cliqué sur la bonne réponse : … », « Sur la tablette, Élise avait cliqué sur : … » ; en tête de la co-évaluation (`Coeval`), « 📄 Gatien, rends sa feuille à Élise. ». Un élève seul, ou la séance sur papier : rien ne change.

Les notes dans la console : `nonLuesV` / `NonLuesV` (`c3-base.js`) ; le tableau de la séance (`ResultatsV`) montre la note telle qu'elle est et « n questions pas encore lues », comme le bilan de classe (`BilanClasseH`) et « 📄 Lire les copies » (`NoteDirecteL`) ; la maîtrise de la note et les compétences restent « — » jusqu'à la note complète (le tableau, le bilan, et la répartition « Par compétence » du bilan). Côté élève, rien ne change.

« Écartée » (dette 218) : dans « 🧮 La note, en direct », une question sans points dit « pas encore lue », « pas posée », et « écartée » seulement si elle est écartée.

Le chrono de la lecture (dette 219) : la carte « 📄 Temps pour lire la feuille du voisin » (`PilotCorrectionH`) a le champ du temps et « +5 », « +10 », « +30 », le geste des chronos des questions (`TempsCarteH`, `ACT.ajouterTemps`).

## Les épreuves

| Épreuve | Résultat |
| --- | --- |
| Sonde du micro (`sonde-micro-0803.js` : les 32 contrôles de la conscience, plus M1 à M7, par le geste, une tablette à deux, la console, le tableau, le téléphone) | 44 / 44 (`sonde-micro-sur-156a13f0.txt`, captures `m1`, `m3`, `m4`, `m7`) ; « +10 » : le chrono prend 10 s tout de suite, la base aussi ; à 0, les deux lectures cliquées se figent, « +10 » les rouvre |
| Sonde du soir d'une séance corrigée à moitié (`sonde-soir-partiel.js` : la séance du banc du 13/10, seule Q2 révélée, comme la séance de Paul du 16/10 07:24) | 7 / 7 (`sonde-soir-partiel-sur-156a13f0.txt`, captures `m5`, `m6`) : « 1/3 », « 2 questions pas encore lues », « 6,7 », « — » ; « Question 1 : pas encore lue » |
| Sonde B, sonde de l'œil | 17 / 17, 4 / 4 |
| Bancs de QCM-4, joués deux par deux (`bancs/`) | banc commun 211 / 211, l'heure de demain 109 / 109, gestes rares 47 / 47, reprises 2, 3, 4, 5, 7-a à 7-e sans échec (3 et 7-d acceptent les nouvelles phrases) ; `banc-jamais.js` : les mêmes 10 échecs qu'avant (banc d'exploration) |
| Fidélité à la maquette v9 | 128 scènes atteintes, aucun écart nouveau par rapport au 15/10 et au matin ; les phrases changées et « +5 / +10 / +30 » sont nommées dans `ecarts-maquette.json` |
| `qcm/sessionActive` au hub, avant la mise en ligne | vide |

Non mesuré à l'écran : le bilan de classe d'une séance qu'on termine avant la fin de la correction (le code est le même que celui du tableau).

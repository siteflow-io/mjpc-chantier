# La 7.7.2 : la 7.7.1 réparée de ses deux pannes (dettes n°12 · 198 et 210)

*Conscience n°12, 12/10/2026, tour 673, sur l'ordre de Paul (12/10, 14:20) : « oui pour réparer la version actuelle ». C'est la version de secours de demain, si le code de la maquette n'est pas en ligne à temps.*

## Ce qui change : deux lignes, plus la pastille

| Ligne | 7.7.1 | 7.7.2 |
| --- | --- | --- |
| 1888-1889 | `APP_VERSION="7.7.1"`, `"2026-07-31"` | `APP_VERSION="7.7.2"`, `"2026-10-12"` |
| 4365 (`EleveCorrection`, dette 198) | `var bon = bonnes.indexOf(i) >= 0;` : `bonnes` n'est défini nulle part, la tablette devient vide dès la première question corrigée | `var bon = (question.bonnes || []).indexOf(i) >= 0;` |
| 5437 (`VuePhone`, dette 210) | rien : `mode` n'existe que dans la bande des questions, le téléphone devient vide dès qu'un élève répond | `var mode = modeEval(ev);` |

Rien d'autre ne bouge (`diff` : ces trois endroits). 7.7.1 : md5 `ecae65624855a1a877708986a8e984e5`, 550 571 o. 7.7.2 : md5 `3aaf749929863d69e30a36f7bc4ad355`, 550 800 o.

## Le banc, par le geste

`banc.js`, sur le faux hub (`AUDITS/QCM-MODE-TEST-09-10/banc/`), dans Chromium : une console, le tableau, un téléphone ouvert par l'adresse du QR (390 × 844) et trois tablettes, chacune dans sa page, sur la même base. L'évaluation : les trois premières questions de l'évaluation de 4e en ligne (`MANDATS/EVAL-4E-PARIS/`), au format de la 7.7.1. La console lance la séance ; **ensuite, le téléphone pilote tout** : « 🚀 Lancer Q1 » à « Q3 », « ✋ Autoriser la réponse », l'autoévaluation, la correction, « 💡 Révéler la bonne réponse », « Question suivante → », « 🛑 Terminer la session ». Les élèves entrent par leur code et cliquent leurs choix : Julien juste partout, Léa faux à Q1 et Q2, Tom sans réponse à Q2 et faux à Q3.

Ce qu'il vérifie : après la première réponse de chaque question, le téléphone affiche toujours la séance ; chaque question close a ses réponses dans la base ; à la correction de chaque question, chaque tablette dit « ✅ Tu avais juste ! », « ❌ Tu avais faux. » ou « ⚠️ Tu n'as pas répondu à cette question. » selon ce que l'élève a cliqué, et marque toutes les bonnes réponses ; le téléphone affiche la séance ; la séance se finit et se termine ; aucune erreur de page dans les six pages.

`APP_FILE=<evaluation-qcm.html> BANC=<faux hub, avec node_modules> node banc.js <sortie.txt>` : 46 s.

| Version | Résultat (`sorties/`) |
| --- | --- |
| 7.7.2 | 29 vérifications, 0 échec, deux passes sur la version finale du banc (45 et 46 s) |
| 7.7.1 | 3 échecs : le téléphone vide dès la première réponse (`ReferenceError: mode is not defined`), puis le parcours s'arrête |
| 7.7.1 avec la seule ligne de 210 | 12 échecs : les trois tablettes vides à chaque question corrigée (`ReferenceError: bonnes is not defined`) |

Le banc attrape donc chacune des deux pannes, et la 7.7.2 n'en a plus aucune. Une faute du banc a été corrigée en route : il lisait la séance par `qcm/sessionActive`, que « Terminer » retire juste après avoir écrit la fin ; la vérification de la fin passait ou non selon l'instant (une passe sur la 7.7.2 y a échoué, sur cette seule vérification). Il retient maintenant la séance dès son lancement.

Captures : `sorties/captures-banc-sur-7.7.2/` (le téléphone après la première réponse, une tablette à la correction, le téléphone à la correction, la fin sur chaque tablette).

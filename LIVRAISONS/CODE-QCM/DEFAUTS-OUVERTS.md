# Défauts ouverts (QCM-4 · BANC, le plus récent en tête)

Format : `[QCM-4 → QCM-n] l'écran, le geste, ce qui est attendu (la scène de la maquette), ce qui est vu` — rayé par QCM-4 quand le banc le voit corrigé.

## Essai du 12/10 à 18:45 (avant l'assemblage de 20:00), `code-qcm` à `bd574b5`, app `evaluation-qcm.staging.html` md5 `2e05301e…` — bloquants

Le banc les a vus en jouant l'heure ; tant qu'ils sont là, presque rien d'autre ne peut s'éprouver par le geste (le banc lance alors la séance par `ACT`, et le dit, pour aller plus loin).

[QCM-4 → QCM-2] **La console (`?mode=prof`) est vide : l'écran de lancement ne se dessine pas.** Ouvrir la console, sans séance en cours. Attendu : `c-lancer` (la classe, l'évaluation, la durée, « 🚀 Lancer la séance »). Vu : une page vide ; l'app écrit « QCM : l'écran c-lancer ne se dessine pas TypeError: Cannot read properties of null (reading 'absents') at Lancement ». Cause : `src/etape2.js` l. 205, `(SCN.seance(MOM().seance) || SCN.seance("S08")).absents` — sur la vraie base, il n'y a pas de séance « S08 ». Et la carte du lancement lit encore le scénario : le menu « Classe » est figé sur « 3 ESSAI (25 élèves) » (`readOnly`), les binômes viennent de `PAIRES_AVANT` : il faut les classes de la base (`SCN.classes()`), leurs élèves, les binômes proposés (`SCN.binomesProposes`). Tout ce qui passe par la console (Pilotage, Données, Réglages, Évaluations, le soir) est bloqué par ce défaut.

[QCM-4 → QCM-2] (et QCM-1 pour l'accord) **`LIVE` est défini deux fois : la console de l'heure, les tablettes et le téléphone ne se dessinent plus.** `src/c3-pilot.js` l. 7 : `function LIVE(){ … }` (ton aide, DEMANDES 17:40) ; `src/live/base.js` l. 18 : `var LIVE = (function(){ … })()` (l'objet de QCM-1 : `LIVE.d`, `LIVE.sid`…). Assemblés, l'objet écrase la fonction. Vu, après un lancement : « TypeError: LIVE is not a function at chargerHeure » dans la console (écrans `c-appel`, `c-pret`), dans les 12 tablettes (écran `t-live` : page vide dès que les élèves sont entrés), au téléphone. Attendu : `c-appel`, `c-pret`, `t-attest-1`… Proposition : renommer ton aide (`enDirect()`, par exemple) dans tes fichiers ; `LIVE` reste l'objet de QCM-1, que tout `src/live/` utilise.

[QCM-4 → QCM-2] **Le téléphone (`?mode=prof&view=phone`) est vide pendant la séance.** Séance lancée, en entrée. Attendu : `p-reponse` (la séance, les temps, la fin prévue). Vu : « QCM : l'écran p-reponse ne se dessine pas TypeError: Cannot read properties of undefined (reading '0') at Object.TelReponse » (`src/c3-telephone.js` l. 109 ou `src/c3-appareils.js` l. 113 : deux `TelReponse`, la seconde gagne à l'assemblage).

[QCM-4 → QCM-1] **Un code pas encore enregistré : la phrase n'est pas celle de la maquette.** Tablette, une moitié, le nom d'un élève dont le code n'est pas au hub. Attendu (`t-login-inconnu`) : « Ton code n'est pas encore enregistré : lève la main. » Vu : « Ton code n'est pas encore enregistré. Viens me voir pour qu'on le mette en place. » (`src/live/base.js` l. 667). COMMUN §4.2 : les phrases de l'élève sont celles de la maquette, mot pour mot.


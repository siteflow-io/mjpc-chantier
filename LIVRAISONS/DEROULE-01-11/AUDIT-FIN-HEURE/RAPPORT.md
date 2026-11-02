# AUDIT PAR LE GESTE : L'APPEL, LA FIN DE L'HEURE, LE GLISSÉ, LA RELECTURE (㉚ ㊱ ㊲ ㊳) : RAPPORT

*Auditeur neuf, 02/11/2026, de 14:22 à 14:50 (heure de Paris). Mandat : `MANDATS/DEROULE-01-11/MANDAT-AUDIT-FIN-HEURE.md` (sas, `07f30c4`). J'ai mesuré sans changer une ligne du site.*

**Fichiers mesurés.** La production `8.78.2-⑪-micro` (copie de `index.html`, md5 `50bb9e7534d820cac9387a8eab99790b`, notée `prod`) et l'assemblé de `cf7bb57` (md5 `3cd597e81384efc0badf0655b1d0ae78`, noté `corr`). **Sur chaque point de ce rapport, les deux fichiers donnent le même résultat**, au mot près. La seule différence vue touche le récit de la présentation du chapitre (« et sa question » en production, « Notre problématique » dans l'assemblé), c'est-à-dire ㉛, hors de cet audit.

**La sonde.** `sonde-audit.mjs` (dans ce dossier) reprend la partie haute de `CORRECTIFS/sonde-correctifs.mjs` (`3d3b6e3`) : le faux hub rangé comme le vrai, `ouvrir`, `lancerClasse`, `garde`, `texteDe`, `capt`. Ses sorties, sans aucun nom d'élève, sont dans `sorties/` : `audit-prod.txt` et `audit-corr.txt`, puis `audit-*-sansdevoiler.txt` (les 3 réponses écrites sans dévoiler la question avant). Les captures, écran entier en 1536 × 864, sont dans le scratchpad de la session, dossier `c16-audit-fin/captures/`, sous le nom `<prod|corr>-<étape>.png`. Elles ne sont pas au dépôt.

**Une erreur du mandat, que je signale.** Selon le mandat, la séance 1 du faux hub « a la même trame que celle de Paul ». C'est faux. Le faux hub des sondes (`storeOuverture`) porte « Analyse d'images : la routine », « Tableau 1 » à « Tableau 5 », « Les hypothèses de la classe », « Question-bilan », etc., et aucune activité (ni `actId` ni `activites`). Pour mesurer, la sonde retouche donc la séance 1 (`trameDePaul`) d'après ce que la conscience a lu au vrai hub :
- l'activité 1 « Analyse d'images », avec les diapos « Analyse d'images » et « Consigne pour le passage à l'oral » ;
- l'activité 2 « Mise en commun » : pour chacun des groupes 1 à 5, la diapo de son tableau puis « Groupe n : l'hypothèse » (un bloc question) ;
- « Le bilan », sans activité, de rôle `bilan` ;
- la fin d'heure, posée par le site.

Cela fait 43 minutes prévues, donc une seule heure (`sur` 1, comme chez Paul). Les vraies images viennent de `MJPC_MEDIAS`.

**Le geste joué.** Il est le même dans tous les cas :
1. La case du lundi 14/09, 08:57-09:52, de la classe test, puis « ▶ Ouvrir le pilotage et lancer ».
2. Les 5 diapos d'ouverture, « Analyse d'images » entièrement dévoilée, « Consigne pour le passage à l'oral », « Groupe 1 : Le Radeau de la Méduse », puis « Groupe 1 : l'hypothèse » avec 3 réponses d'élèves écrites au pilote. Les 3 élèves sont notés au champ des initiales.
3. « ⏩ aller à 5 minutes de la fin », puis les 7 étapes, avec « Reporter à la séance suivante », « Clore l'heure » et « Clore quand même ».
4. La Relecture, puis la case de l'emploi du temps : 2 absents marqués, puis « Relire cette heure ».
5. La case suivante de la classe, et le lancement de cette heure.
6. Une seconde heure où l'appel se fait pendant l'heure, au clic droit sur une pastille.

---

## LES RÉPONSES AUX QUESTIONS DE PAUL

**1. « L'appel m'est proposé à la fin d'une heure ; quand je clique sur la case de l'emploi du temps, la première chose à faire c'est l'appel. »**
Réponse : au lancement, le site ne propose l'appel nulle part. On ne peut le faire qu'à deux endroits : la case de l'emploi du temps, une fois l'heure commencée (et donc, pour Paul, après coup), ou le clic droit sur une pastille, pendant l'heure, que rien ne montre.
Preuve, mesurée :
- **Avant de lancer**, la case du lundi montre « 3E Charles de Gaulle · Poésie et peinture : le Romantisme en question · heure 1 sur 1 » et 4 boutons : « ✕ », « ▶ Ouvrir le pilotage et lancer », « ✎ Préparer », « Banaliser cette heure ». Les mots « absent » et « appel » y sont 0 fois (`*-1a-case-edt-avant.png`).
- **Un clic sur « Ouvrir le pilotage et lancer »** ouvre la première diapo, « Présentation du chapitre » (Diapo 1 sur 19). Les mots « appel » et « absent » sont 0 fois à l'écran (`*-1b-apres-lancer.png`, `*-1c-premiere-diapo.png`). Le chemin case puis première diapo prend donc 2 clics, sans appel.
- **Pendant l'heure, l'appel se fait de deux façons.** La première : le clic droit sur une pastille de la participation ouvre un menu de 2 lignes, « Absent — un élève » et « Parti à 08:57 — un élève ». Un clic sur « Absent » suffit, et le compteur passe à « 0 SUR 28 PRÉSENTS », donc 2 gestes par absent (`*-7a-clic-droit-pastille.png`). Ce geste n'est dit que dans l'infobulle de la colonne (« Clic droit : absent · arrivé · parti · revenu ») : rien à l'écran ne le montre. La seconde : la case de l'emploi du temps, rouverte pendant l'heure, montre « Heure jouée — 1 activité. Pas encore close. » puis « Absents de cette heure (0 sur 29) », avec un bouton par élève (`*-1e-case-edt-pendant.png`). Paul doit pour cela quitter le pilotage et rouvrir l'emploi du temps.
- **Ce qui ressemble à un appel à la fin de l'heure.** À l'ouverture de la fin d'heure, la liste des 7 étapes affiche déjà « ✔ 5 · le mot aux absents (aucun absent) (facultatif) ». L'étape 5 dit « Un mot pour les absents (aucun) » (`*-3-etape-1.png`, `*-3-etape-5.png`). Après la clôture, la case du lundi montre « Absents de cette heure (0 sur 29) · Un clic marque, un clic défait » (`*-5a-case-edt-apres-cloture.png`).

Voilà ce qui fait dire à Paul « l'appel m'est proposé à la fin d'une heure » : la seule liste d'élèves à cocher qu'il voit est celle de la case, et elle n'apparaît qu'une fois l'heure commencée. Si Paul ne revient pas à la case pendant l'heure, il la découvre après.

Lu dans le code : `index.html`, `edtPeindreModale` n'ajoute `edtAbsencesHtml` que si `c.nature === 'jouee'`, c'est-à-dire si l'heure a une trace. Une case `prevu` ne montre que « ▶ Ouvrir le pilotage et lancer » et « ✎ Préparer ».

**2. « J'ai pu faire l'appel seulement après, et du coup dans la Relecture c'est marqué aucun élève absent. »**
Réponse : c'est exact. Les absents marqués dans la case après la clôture vont bien au hub, mais la Relecture ne les lit jamais : elle dit toujours « tous présents » et compte toute la classe présente.
Preuve, mesurée :
- Après « Clore », la Relecture dit dans le récit « 3 élèves sur 29 présents ont pris la parole », et l'onglet « Ce qui s'est passé » dit « L'APPEL tous présents » (`*-4b-relecture-apres-cloture-recit.png`, `*-4b-...-passe.png`).
- J'ai ensuite cliqué 2 élèves dans la case du lundi (2 clics). La case dit « Absents de cette heure (2 sur 29) » et le hub porte `absents` : 2 élèves (`*-5b-case-edt-2-absents.png`).
- « Relire cette heure » donne toujours « 3 élèves sur 29 présents » et « L'APPEL tous présents ». Le mot « absent » y paraît 0 fois (`*-5c-relecture-apres-appel-edt-recit.png`, `*-5c-...-passe.png`).

Lu dans le code : la Relecture ne lit que `S.appel`, l'état de l'heure (`dr-recit.js`, `dr_recitPresents` et `appelH` dans le rendu « Ce qui s'est passé »). Les absents de la case (`H/absents`) ne passent dans `S.appel` que par `dr_absentsDeLaCase` (`dr-classe.js`), qui tourne au lancement, à la reprise, et toutes les 15 s **tant que l'heure n'est pas close** (`S.lancee && !S.close`). Une fois l'heure close, plus rien ne les lit pour la Relecture. La clôture recopie `H/absents` dans le paquet de l'heure (`dr-classe.js`, autour de la ligne 944), mais seulement s'ils existent déjà à ce moment-là. Cela confirme ce que la conscience a lu au vrai hub : 2 `absents`, un `S.appel` vide, et « 3 élèves sur 30 présents ».

**3. L'inverse : l'appel fait pendant l'heure, au clic droit. La Relecture le dit-elle ?**
Réponse : oui. Un absent marqué au clic droit pendant l'heure est dit dans la Relecture et compté en moins dans les présents.
Preuve, mesurée : un absent au clic droit (2 gestes), puis 4 diapos, puis « Clore ». Au hub, `appel` porte 1 élève et `absents` est vide. La Relecture dit le mot « absent » 3 fois : l'onglet « Ce qui s'est passé » donne, sous « L'APPEL », « un élève — absent 08:57 », et le compteur du pilote dit « 0 SUR 28 PRÉSENTS » (`*-7b-relecture-appel-pendant-recit.png`, `*-7b-...-passe.png`). Il existe donc deux listes d'absents : l'appel du pilotage (`S.appel`) et la case de l'emploi du temps (`H/absents`). Elles ne sont réunies que pendant l'heure.

**4. « On s'est arrêté au tableau 1 […] ; dans l'emploi du temps, la séance est marquée comme finie. »**
Réponse : oui. Dès que la seule heure de la séance est close, l'emploi du temps tient la séance 1 pour jouée et propose la séance 2 à la case suivante, quelles que soient les diapos reportées. Le mot « finie » n'est écrit nulle part : la case dit « Close ».
Preuve, mesurée :
- La case du lundi, après la clôture, dit : « Heure jouée — 9 activités. Close. Séance : Poésie et peinture : le Romantisme en question » (`*-5a-case-edt-apres-cloture.png`).
- La semaine montre « Poésie et peinture : le Romantisme en question · 9 activités » le lundi, puis « Étude de texte accompagnée : « L'Albatros » heure 1/3 » le mardi 15/09 à 15:07 (`*-6a-edt-semaine.png`).
- La case du mardi montre « Étude de texte accompagnée : « L'Albatros » heure 1 sur 3 » (`*-6b-case-suivante.png`).
- **« 9 activités » compte des diapos**, pas des activités : ce sont les 9 diapos jouées, dont les 5 d'ouverture. Pendant l'heure, la même case disait « 1 activité ».
- **« n reportée(s) » ne peut jamais s'afficher.** La case l'écrit quand une ligne de `activites` porte `reel === 0`, mais le paquet de l'heure ne contient que les diapos jouées, chacune avec `reel` d'au moins 1. Au hub : 9 lignes, de « reel 1 » à « reel 3 ».

Lu dans le code : `index.html`, `edtSeanceJouee` tient une séance pour jouée quand le nombre de ses heures (les clés de `heures`) atteint `edtHeuresPour`, ici 1. Aucune décision n'est lue. Toujours dans `index.html`, la case calcule `cel.reportees` avec `a.reel===0`. Dans `dr-classe.js`, `dr_paquetHeure` pose `reel: Math.max(1, …)` et ne crée une ligne que pour une diapo jouée.

**5. « Le glissé ne se répercute pas (mardi, on voit séance 2). »**
Réponse : c'est exact. La décision « Reporter à la séance suivante » est écrite au hub, mais personne ne la lit pour préparer la séance suivante : l'heure du mardi ne contient aucune des diapos reportées, et la diapo « Où en sommes-nous ? » présente même l'activité reportée comme faite.
Preuve, mesurée :
- Au hub, la clôture écrit `decisionsParActivite` : act2 → `reporter`, et `decisionsParEcran` (8) : « Groupe 2 : Le lac », « Groupe 2 : l'hypothèse », et ainsi de suite jusqu'à « Groupe 5 : l'hypothèse », toutes en `reporter`.
- J'ai lancé le mardi 15/09 à 15:10 : la case, « ▶ Ouvrir le pilotage et lancer », puis « Lancer l'heure 1 ». L'heure joue la séance 2 dans cet ordre : « Où en sommes-nous ? » → « Le parcours du chapitre » → « Séance 2 · Étude de texte accompagnée : « L'Albatros » » → « Notre problématique » → « De la toile au poème » → … → « Fin d'heure ». Cela fait 12 diapos, dont **0 diapo « Groupe… »** (`*-6c-heure-suivante-lancee.png`, `*-6d-heure-suivante-premiere-diapo.png`).
- La réactivation « Où en sommes-nous ? » ne contient qu'un bloc : « La dernière fois : Activité 1 — Analyse d'images ; Activité 2 — Mise en commun ». Il n'y a aucun bloc « À reprendre ».

Lu dans le code, qui lit et qui ne lit pas la décision « reporter ».
- **Ne la lisent pas.**
  - `dr-socle.js`, `ordreHeureCalc0` et `glisseeDe` : ils ne font glisser que `suivante`, `terminer` et `preparer`, et seulement d'une heure à une autre **de la même séance** (`e.heure < h`).
  - `dr-recit.js`, `DR_REACT_REPRENDRE = ['suivante','terminer','preparer']` : le bloc « À reprendre » de la réactivation laisse donc tomber `reporter`. De plus, `dr_reactivationConstruire` range dans « La dernière fois » toute activité dont une diapo a été jouée (`parActivite`, `passages > 0`).
  - `index.html`, `edtSeanceJouee` et `edtChapitreEnCours` comptent les heures, pas les décisions.
- **La lisent, mais seulement pour l'afficher ou l'écrire.**
  - `dr-socle.js`, `libDecision` (« reportée à la séance suivante »).
  - `dr-classe.js`, `dr_paquetHeure`, qui écrit `decisionsParEcran` et `decisionsParActivite`.
  - La Relecture, onglet « Ce qui s'est passé ».
  - `dr-recit.js`, la phrase « …qu'on fera à la prochaine séance ». Elle ne s'écrit pas ici, pour deux raisons. D'abord, le récit de l'heure ne la dit que pour une activité **jamais montrée** (`nonFaites`, filtre `!montre(x.k)`), or « Mise en commun » a été montrée. Ensuite, le récit de la séance ne la dit que pour une décision de l'heure 2 (`x.d.heure === 2`), or cette séance n'a qu'une heure. Le récit mesuré dit donc seulement : « Mais on ne l'a pas terminée. »

La promesse du bouton, « elle entre en tête de la séance suivante de cette classe » (son infobulle), n'est tenue par aucun code.

**6. « J'ai eu du mal à savoir où je devais cliquer pour dire qu'on n'avait pas fini et que les diapos restantes étaient reportées. »**
Réponse : le bouton existe, « Reporter à la séance suivante », sur la carte de l'activité à l'étape 2. Mais il est à 1 769 px du haut, sur un écran de 864 px : il faut faire défiler la colonne de près de deux écrans, sous 8 grandes vignettes, pour le voir.
Preuve, mesurée : à l'étape 2, le bouton est en haut 1 769, pour une fenêtre de 864, donc pas visible. La colonne défile de 2 190 px, et chacune des 8 vignettes fait 154 px de haut (`audit-*.txt`, « étape 2 : « Reporter à la séance suivante » à … » ; capture `*-3-etape-2.png`, où l'on voit la carte et les vignettes mais pas les boutons). Ce que l'écran montre au-dessus : « Ce qui était prévu pour cette heure et n'a pas été fait : une décision par activité (à l'heure suivante, à la maison, à préparer, en réserve, non fait) ». Cette phrase cite des choix qui ne sont pas ceux proposés : à la dernière heure, ce sont « Reporter à la séance suivante │ Terminer à la maison │ À la maison, pas le temps │ Non fait ». Un clic suffit, et la ligne 2 passe à « ✔ 2 · ce qui n'a pas été fait — tout est décidé » (`*-3-etape-2-reporte.png`). Aucun choix n'est posé par défaut à la dernière heure de la séance : sans ce clic, l'étape 2 reste à faire.

**7. « Il y a une incompréhension entre activité et diapos ; en fin d'heure, on doit compter en diapos non faites plutôt qu'en activités. »**
Réponse : aujourd'hui, l'étape 2 compte et décide **par activité**. Elle montre bien les diapos non faites, mais en vignettes, et la décision vaut pour toute l'activité. Ailleurs, le site mélange les deux mots : la case de l'emploi du temps appelle « activités » des diapos, et la Relecture marque « reportées » des diapos déjà jouées.
Preuve, mesurée :
- L'étape 2 présente **une seule carte** : « Activité 2 — Mise en commun · 8 diapos restantes · 24 min · commencée », avec 8 vignettes (« Groupe 2 : Le lac », « Groupe 2 : l'hypothèse », … « Groupe 5 : l'hypothèse ») et une rangée de 4 choix pour toute la carte. La liste des étapes dit « 1 activité : dis ce qu'elle devient ». On ne peut ni décider diapo par diapo, ni reporter seulement une partie.
- La case de l'emploi du temps dit « 9 activités » pour 9 diapos jouées (point 4).
- Dans la Relecture, onglet « Ce qui s'est passé », « Diapo par diapo », **10** lignes disent « reportée à la séance suivante ». Ce sont les 10 diapos de l'activité 2, y compris les 2 qui ont été jouées : « 8 Groupe 1 : Le Radeau de la Méduse … reportée à la séance suivante » et « 9 Groupe 1 : l'hypothèse … 1 / 1 reportée à la séance suivante ». Le hub, lui, ne porte la décision que sur les 8 diapos non finies (`decisionsParEcran`).

Lu dans le code : dans `dr-classe.js`, `dr_resteHeure` rend une ligne par activité (ou par diapo sans activité, `dr_pseudoAct`), et `ouvrirFin` pose une rangée de choix par carte (`data-act`). Les décisions sont rangées par activité (`S.decisions[a.id]`).

**8. « Pour l'activité 1 de la séance des tableaux, les tableaux suivants sont comptés comme faits, non ? »**
Réponse : non. Une diapo n'est comptée faite que si elle a elle-même été montrée et entièrement dévoilée. Les tableaux qui suivent une diapo jouée dans la même activité restent comptés « pas faits », et c'est d'ailleurs pour cela qu'ils sont listés et reportés.
Preuve, mesurée : le site applique son propre test, `finie()`, à chaque diapo de l'heure, juste avant la fin d'heure.
- Comptées FINIES : « Analyse d'images » (4/4), « Consigne pour le passage à l'oral » (3/3), « Groupe 1 : Le Radeau de la Méduse » (vue) et « Groupe 1 : l'hypothèse » (1/1).
- Comptées **pas finies** : « Groupe 2 : Le lac », « Groupe 2 : l'hypothèse », et ainsi de suite jusqu'à « Groupe 5 : l'hypothèse », puis « Le bilan » et « Fin d'heure ».

C'est l'exemple demandé : l'activité 2 a 10 diapos, 2 seulement ont été jouées, et les 8 suivantes sont listées « restantes » (`audit-*.txt`, ligne 2d ; `*-3-etape-2.png`). L'activité 1, dont les 2 diapos ont été jouées, n'est pas listée. Lu dans le code : `dr-socle.js`, `finie(e, i)` donne vrai si tous les éléments ont été dévoilés (`vuMax >= elements(e).length`), ou, pour une diapo sans élément, si elle a été montrée.

Une différence avec ce matin, que je n'explique pas : chez Paul, le hub porte **9** diapos reportées, dont « Groupe 1 : l'hypothèse ». Dans ma mesure, écrire une réponse d'élève dévoile la question : le compteur passe de « 0 / 1 » à « 1 / 1 dévoilés », la diapo est donc comptée finie, et il en reste **8**. J'obtiens le même résultat en écrivant les réponses sans dévoiler la question avant (`audit-*-sansdevoiler.txt`). Pourquoi sa diapo « l'hypothèse » est restée « pas finie » ? Je ne sais pas : il faudrait sa trame, que je n'ai pas le droit de lire. Le plus probable est que sa diapo ait plus d'un élément, mais je ne l'ai pas mesuré.

**9. « Le bilan » (diapo sans activité) : que devient-il en fin d'heure ?**
Réponse : il n'apparaît nulle part dans la fin d'heure et ne reçoit aucune décision. Il n'est pas reporté, et il est perdu pour la suite comme les diapos reportées.
Preuve, mesurée : à l'étape 2, une seule carte (activité 2). « Le bilan » n'y est pas, et le bouton « Aller au bilan », prévu dans l'en-tête, n'est pas affiché : la séquence en 7 étapes ne reprend ni l'en-tête ni sa phrase. Au hub, `decisionsParEcran` ne contient pas « Le bilan ». La Relecture dit « 18 Le bilan (bilan) H1 — 5 min 0 / 1 pas jouée », et l'étape 5 dit « Le bilan de la séance n'est pas attesté […]. La séance se clôt quand même. » Lu dans le code : `dr-classe.js`, `dr_pseudoAct` ne fait pas une « activité » d'une diapo qui a un rôle (`e.role`, ici `bilan`), donc `dr_resteHeure` ne la liste pas. Dans `sequenceHtml`, l'étape 2 ne garde que `h3` et `.rangee` du HTML de `ouvrirFin` : la phrase `.sous` et le bouton `#f-bilan` tombent. Ce que fait une diapo « Le bilan » **sans** rôle, je ne l'ai pas mesuré. D'après le code, elle serait listée comme « Diapo n — Le bilan ».

**10. (09:55) « Le flux du cahier de textes à la fin n'est pas pratique du tout. » Les 7 étapes, mesurées une à une.**
Réponse : pour une heure où rien n'est copié vers École Directe, la fin d'heure demande **10 clics**, de l'ouverture de la séquence à l'heure close. Deux étapes ne peuvent pas être cochées à ce moment-là, et la garde de clôture le dit.
Preuve, mesurée (`*-3-etape-1.png` à `*-3-etape-7-garde.png`). Chaque étape a dans son en-tête « ❄ Préparer le cahier » et « Plus tard », et en bas « ◀ Étape précédente » et « Étape suivante ▶ ».
1. **L'échéance.** Elle demande : « Prenez vos agendas pour le… — choisis-la, ou dis « sans échéance » ». Le site propose « mardi 15 septembre, 15 h 07 », déjà cochée « ✔ (proposée) ». 1 clic : « suivante ».
2. **Ce qui n'a pas été fait.** La carte de l'activité 2, ses 8 vignettes et 4 choix. Elle se coche au choix posé. 2 clics : « Reporter à la séance suivante », puis « suivante » (le bouton est sous deux écrans de défilement, point 6).
3. **Le travail à faire.** Elle montre « rien choisi au-dessus pour la maison », « Ce que la trame prévoyait : rien de prévu », les notions, « Autre travail », et deux boutons : « Rien d'autre pour la prochaine fois » et « Écrire dans le cahier ▸ ». 2 clics.
4. **Le récit relu.** Elle dit : « Il est 09:42 : le récit se complète jusqu'à la fin de l'heure […] l'étape ne se cochera qu'une fois l'heure jouée ». Le bouton « Relu (à la fin de l'heure) » est **grisé**. 1 clic : « suivante », et l'étape reste à faire.
5. **Avant de clore.** Elle montre « Durées changées », « Diapos modifiées », « Notes versées », « Un mot pour les absents (aucun) » et le bilan non attesté. Elle est cochée d'office. 1 clic.
6. **Copier pour École Directe.** Deux boutons de copie. Je ne les ai pas cliqués, comme Paul ce matin. 1 clic : « suivante ».
7. **Clore l'heure.** Le bouton « Clore l'heure » ouvre la garde : « Il manque, avant de clore ○ le récit relu […] ○ copié pour École Directe […] Y retourner │ Clore quand même ». 2 clics : « Clore l'heure », puis « Clore quand même ».

Ce matin, Paul a vu dans sa garde seulement « copié pour École Directe », ce qui veut dire que son récit était relu. Moi, je n'ai pas pu cocher « relu » : la case avait été avancée de 5 minutes, et l'étape 4 attend la fin réelle de l'heure.

---

## LES LIMITES DE CETTE MESURE (DITES)
- L'horloge du navigateur est figée à 09:00 (`clock.setFixedTime`) ; seule l'horloge de la case avance, de 5 minutes. Les durées de la Relecture (« — », « pas jouée » sur des diapos jouées, « 45 min 02 s » sur la dernière) viennent de cette horloge figée : je n'en tire rien.
- La trame de Paul est reconstruite d'après la lecture de la conscience (activités, titres, rôle `bilan`), pas lue au vrai hub. Le détail de ses diapos « l'hypothèse » m'est inconnu (point 8).
- Je n'ai pas mesuré « Mes chapitres », ni le profil de la classe : je ne sais pas si la séance 1 y est dite « finie ».
- Aucune erreur JS, aucune boîte système, dans les 4 passages (production et assemblé, avec et sans dévoiler la question).

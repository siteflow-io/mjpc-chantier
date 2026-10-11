# COMPLÉMENT 3 — LA MAQUETTE COMPLÈTE DU QCM : MOINS DE TEXTE À L'ÉCRAN, UNE INFOBULLE PAR ÉLÉMENT, LES NIVEAUX TOUJOURS LÀ

*Écrit par la conscience n°12 le 11/10/2026 (tour 651), sur l'ordre de Paul.*

*Ses remarques sur la v7 validée, le 11/10 à 14:04 : « la maquette, il me semble qu'il y a encore tous les textes explicatifs maquette, non? par ailleurs, le filtre doit aussi afficher "par classe" afin que je puisse voir les évals par classe. comme dans dictée. ou alors des sections permanentes avec les niveaux. et d'ailleurs, les qcm doivent aussi déclarer un niveau, comme dans correction dictée parce que ça permet de les lier à un niveau dans mjpc. non? vérifie. enfin, sur la maquette, quand je passe ma souris sur un élément, je dois avoir l'infobulle pour savoir ce que c'est, ce que ça fait dans le contexte actuel de l'écran, etc. »*

*Il a acquis les propositions de la conscience (points 751 à 757 du cadrage) par « ok » à 14:14.*

*Ce complément s'adresse à l'exécutant de la maquette complète du QCM, en session cloud de Claude Code, dans le dépôt du sas `siteflow-io/mjpc-chantier`.*

*Restent en vigueur en entier :*
- *le mandat : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md ;*
- *le complément 1 : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md ;*
- *le complément 2 : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2.md.*

*Les mesures de la conscience sur la v7 : https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/MAQUETTE-QCM-REMARQUES-11-10/README.md.*

---

## 0. Ce que ça change pour la classe

En classe, Paul pilote d'un coup d'œil : il lui faut à l'écran ce qui se passe maintenant, et rien d'autre. Aujourd'hui, ses écrans de la v7 portent une soixantaine de paragraphes qui expliquent les règles. Ils étaient utiles pour valider, mais ils encombrent l'écran du cours.

À l'inverse, quand Paul ne sait plus ce qu'est un élément, il doit le savoir en posant la souris dessus. Or il n'y a aucune infobulle sur 866 affichages et sur 269 gestes : ce sont les niveaux de maîtrise, les phases, les chronos, les compteurs.

Enfin, la liste de ses évaluations doit ressembler à celle de ses dictées. Les quatre niveaux y sont toujours présents, et il doit pouvoir voir ses évaluations par classe.

Ce complément fait passer les explications dans les infobulles et le mode d'emploi. Il donne une infobulle à chaque élément de ses écrans, et range ses listes comme la dictée.

---

## 1. Qui tu es, ce que tu ne fais jamais

Tu es **l'exécutant du complément 3**. Les interdits du mandat (§1) et des compléments 1 et 2 (§1) valent tous, mot pour mot :
1. **tu fais tout le complément d'une traite**, sans t'arrêter et sans rien demander ;
2. **une livraison n'a jamais ni trou ni dette**.

En plus :
1. tu ne touches qu'aux trois changements du §2 et à tout ce que les gardes 9, 10 et 11 trouvent (§3). Chaque trouvaille est un défaut, corrigé et inscrit au journal ;
2. **tu ne touches à aucun texte vu par l'élève**, sur les tablettes ou au tableau : ses phrases restent celles que Paul a validées ;
3. tu ne modifies pas les fichiers `maquette-qcm-v1.html` à `v7.html`, ni leurs md5 ; ta livraison est `maquette-qcm-v8.html` ;
4. un texte ou une infobulle qui existe déjà dans le site d'aujourd'hui (`evaluation-qcm.html`, `index.html`) reste tel quel, mot pour mot (complément 1, §3, défaut 2). Tu n'ajoutes que ce qui manque, et tu ne déplaces que ce que la maquette a écrit elle-même.

Pour commencer :
1. `git fetch origin`, `git checkout maquette-qcm`, puis `git merge origin/main` ;
2. lis en entier ce complément et le rapport des mesures, avec ses deux sorties : `sorties/textes-neufs.txt`, les 220 textes longs, et `sorties/bulles-v7.txt`, les infobulles manquantes ;
3. vérifie les md5 de la production, comme au complément 1 (§2) : `index.html` doit être `ac792b28f40d3a0510e725fc4a6b6985`, et `evaluation-qcm.html` `ecae65624855a1a877708986a8e984e5`.

---

## 2. Les trois changements

### Changement 1 — à l'écran, ce qui sert à agir ; les explications dans les infobulles

Cela concerne les vues de Paul : la console, le téléphone et MJPC.

**Tu classes chaque texte que la maquette a écrit elle-même**, c'est-à-dire chaque texte absent du site d'aujourd'hui. Tu pars des 220 de `textes-neufs.txt`, et tu y ajoutes ceux de moins de 70 caractères que tu trouves. Il y a quatre catégories :
1. **une donnée** : un énoncé, un nom, une note, un commentaire, une ligne du PDF, une date, un compte ;
2. **un état** : ce qui est vrai maintenant, dans cette séance. Par exemple « La correction commence par Q2, la plus ratée sur les tablettes (9 / 24 justes). », « Il en manque 4 : … » ou « 🔴 Point d'autonomie retiré à 10:41 » ;
3. **une alerte ou une erreur** : ce qui demande à Paul d'agir, par exemple « Question 7 : 60 px de trop sur une demi-tablette… » ou « 🚫 Refusé : … » ;
4. **une explication** : comment une règle marche en général, ou ce qui se passera un jour. Par exemple :
   - « Tant qu'elle n'est pas terminée, cette séance ne compte pas comme « QCM précédent » pour les binômes. » ;
   - « Elle vaut dans les deux sens, et pour toutes les apps qui partagent une tablette… » ;
   - « Les listes d'élèves, leurs codes, leurs aménagements et leurs exclusions appartiennent au site MJPC… ».

**Ce qui en est fait** :
1. les données, les états, les alertes et les erreurs restent à l'écran ;
2. **chaque explication quitte l'écran.** Elle va dans l'infobulle de l'élément qu'elle explique, par exemple celle de « ⏸️ Finir à une autre heure » ou de « 🚫 Jamais avec… ». Une explication qui concerne tout un écran va dans le mode d'emploi (`c-mode-emploi`), à sa section ;
3. **une fenêtre de confirmation garde une phrase**, deux au plus : ce que le geste fait et ce qu'il coûte. Le reste de ce qu'elle disait va dans l'infobulle du bouton qui l'ouvre ;
4. aucune information ne se perd : chaque phrase retirée de l'écran se retrouve, mot pour mot ou resserrée, dans une infobulle ou dans le mode d'emploi.

Le classement va dans `banc/existant/textes-console.json`. Chaque texte y a sa scène, sa catégorie et, s'il est déplacé, sa destination : l'élément qui porte l'infobulle, ou la section du mode d'emploi.

### Changement 2 — une infobulle sur chaque élément des écrans de Paul

Cela concerne aussi les vues de Paul : la console, le téléphone et MJPC.

**Chaque élément visible a son infobulle au survol.** Cela vaut pour tous les gestes (boutons, champs, menus, cases, liens) et pour tous les affichages : pastilles, compteurs, phases, chronos, états, en-têtes de tableau, cartes de tablette, lignes de liste, noms d'élèves, niveaux de maîtrise, badges comme « MODE PROF ».

**L'infobulle est écrite pour Paul dans trois mois** (registre, n°11 · 65 et 66) : quelqu'un qui connaît son métier et son site, mais qui en a oublié le détail. Elle tient en une ou deux phrases :
- ce que c'est ;
- ce que cela fait **ici, dans l'état actuel de l'écran** ;
- pour un geste, ce qu'il coûte.

**Elle suit l'état de l'écran.** Par exemple, le chrono « ✋ RÉPONSE 9 s » dit à qui il reste ces 9 secondes, et ce que font « +5 », « +10 », « +30 ». Un bouton fermé dit pourquoi il l'est maintenant, et ce qui l'ouvrira (complément 2).

**Une infobulle est portée par l'élément lui-même, ou par une enveloppe qui ne contient que lui** et son étiquette. Par exemple, le bloc « 24/24 CONNECTÉS » porte une infobulle pour le nombre et son mot. Un grand bloc qui contient plusieurs gestes ne compte pas comme l'infobulle de chacun.

**Les infobulles d'aujourd'hui restent mot pour mot** (§1.4). Les explications déplacées par le changement 1 y prennent place.

**Les écrans des élèves et le tableau restent sans infobulle** (règle de Paul du 06/10 : côté élève, jamais de consigne en infobulle ; point 754). Pour Paul, ce que fait chacun de ces écrans est dit dans la phrase du livret.

### Changement 3 — les évaluations et les séances rangées comme la dictée

**Ce que fait la dictée** (`correction_dictee.html`, l. 3460 à 3466) :
- « Mes dictées » montre toujours les quatre niveaux, 6e, 5e, 4e et 3e, même vides ;
- chaque niveau se replie ou se déplie (« Replier ce niveau » / « Déplier ce niveau ») et dit son compte (« 3 dictées »), ou « vide pour l'instant » ;
- chaque dictée y dit sa classe.

**C'est la règle du point 465 du cadrage** : « Comme dans la correction de dictée, elles sont rangées par niveau, chaque niveau se replie, puis par date. En plus, un sélecteur de tri : date, titre, chapitre ; pour les séances, classe, date, évaluation. »

Dans la v7, `c-evals` n'affiche que les niveaux qui ont une évaluation (« 3e », « Sans chapitre »), et les séances de « Résultats » (`c-seances`) sont rangées par classe, sans niveau.

**Ce qui est attendu** :
1. **les évaluations** (`c-evals`, `c-eval-corbeille`, `c-collage` et toute scène qui montre cette liste) :
   - la démo en tête, comme aujourd'hui ;
   - puis les quatre niveaux, 6e, 5e, 4e et 3e, toujours présents, chacun repliable, avec son compte ou « vide pour l'instant », mots et gestes de la dictée ;
   - puis « Sans chapitre », tant qu'il reste une évaluation à compléter ;
2. **le tri des évaluations reçoit « classe »**, en plus de date, titre et chapitre. Dans chaque niveau, les évaluations se rangent alors sous chaque classe de ce niveau qui les a passées : une évaluation passée par deux classes paraît sous les deux. Celles qu'aucune classe n'a passées se rangent sous « Pas encore passée ». Chaque ligne dit déjà les classes qui l'ont passée (« passée par 3 ESSAI le 08/10 ») : cela ne change pas ;
3. **les séances de « Résultats »** (`c-seances`, `c-seances-lues` et les scènes de cette liste) :
   - les quatre niveaux, toujours présents, comme pour les évaluations ;
   - dans chaque niveau, les classes, comme aujourd'hui ;
   - le tri « classe, date, évaluation » de 465.

**Le niveau d'une évaluation ne change pas** : il vient de son chapitre de MJPC (points 316, 317, 756). Rien n'est à ajouter pour lui.

---

## 3. Les gardes 9, 10 et 11

Elles entrent dans le banc unique, avec les gardes 1 à 8. Elles lisent aussi l'intérieur des cadres, et elles passent par le geste dans Chromium.

### Garde 9 — aucune explication à l'écran

1. Chaque texte visible des vues de Paul, absent du site d'aujourd'hui, est dans `textes-console.json`, avec sa catégorie.
2. Aucun texte de la catégorie « explication » n'est visible à l'écran, hors du mode d'emploi et des infobulles.
3. Chaque explication retirée se retrouve dans l'infobulle ou dans la section du mode d'emploi que le fichier lui donne.
4. Le corps d'une fenêtre de confirmation tient en deux phrases au plus.
5. Aucun texte vu par l'élève n'a changé depuis la v7. Le banc compare les textes des scènes de tablette, d'élève et de tableau de la v8 à ceux de la v7.

### Garde 10 — une infobulle par élément

1. Dans chaque scène des vues de Paul, pour chaque geste visible et chaque élément visible qui porte son propre texte ou sa propre marque (pastille, icône, chiffre), la souris posée en son centre (`document.elementFromPoint`) atteint une infobulle non vide.
2. L'élément qui porte cette infobulle est l'élément lui-même, ou une enveloppe qui ne contient aucun autre geste et dont la surface ne dépasse pas 120 000 px².
3. Une infobulle a au moins une phrase complète, qui finit par un point.
4. Les infobulles d'aujourd'hui, celles de l'inventaire de l'existant (garde 1), sont toujours là, mot pour mot.
5. Dans les scènes de tablette, d'élève et de tableau, aucune infobulle.

### Garde 11 — les niveaux toujours là

1. Dans chaque scène qui montre la liste des évaluations ou celle des séances, les quatre sections 6e, 5e, 4e et 3e sont présentes, même vides.
2. Une section vide dit « vide pour l'instant ».
3. Chaque section se replie et se déplie par le geste.
4. Par le geste, le tri « classe » range chaque évaluation sous chaque classe qui l'a passée, et les autres sous « Pas encore passée ».

### Avant toute correction

Tu joues les gardes 9, 10 et 11 sur la v7. Elles doivent y trouver leurs défauts connus :
- la garde 9, les trois explications citées au §2 ;
- la garde 10, des centaines d'éléments sans infobulle : 866 affichages et 269 gestes au relevé de la conscience, avec sa propre définition ;
- la garde 11, les niveaux absents de `c-evals` et de `c-seances`.

La sortie va dans `sorties/gardes-9-10-11-sur-v7.txt`. Une garde qui ne trouve pas son défaut connu n'est pas une garde : tu la refais avant d'aller plus loin.

---

## 4. Les étapes, d'une traite

Chaque étape finit par sa garde, puis par un commit poussé sur `maquette-qcm` : une sauvegarde, pas un arrêt.

| Étape | Ce qu'elle fait | Sa garde |
| --- | --- | --- |
| **A — les gardes** | La fusion de `main` ; les md5 ; les gardes 9, 10 et 11 dans le banc ; `textes-console.json`, le classement des textes. | Les gardes jouées sur la v7 trouvent leurs défauts connus (`sorties/gardes-9-10-11-sur-v7.txt`). |
| **B — les textes et les listes** | Le changement 1 (les explications quittent l'écran, les fenêtres de confirmation resserrées) et le changement 3 (les niveaux, le tri « classe »). | Le banc entier, à zéro défaut, sauf la garde 10. |
| **C — les infobulles et la livraison** | Le changement 2, scène par scène ; `maquette-qcm-v8.html` et son md5 ; toutes les captures refaites et regardées ; `livret-maquette-qcm-v8.pdf` ; le README (section « Complément 3 » en tête), `DEFAUTS.md` à partir du n°54, `POINT-SCENE.md`. | Le banc final, gardes 1 à 11 comprises, sur la v8, à zéro défaut (`sorties/banc-final-v8.txt`). |

Pour les infobulles, écris-les par composant : chaque type d'élément (une pastille de niveau de maîtrise, une carte de tablette, un chrono, une ligne de séance…) reçoit sa fonction d'infobulle, qui lit l'état de la scène. Ainsi, la même pastille dit la bonne chose partout.

---

## 5. La livraison, une seule

Elle va sur la branche `maquette-qcm`, dans `MANDATS/MAQUETTE-QCM-COMPLETE/` :
1. `maquette-qcm-v8.html`, son md5, et ses sources ;
2. `banc/existant/textes-console.json` ;
3. `sorties/gardes-9-10-11-sur-v7.txt` et `sorties/banc-final-v8.txt` ;
4. `captures/` refait ;
5. `livret-maquette-qcm-v8.pdf`. Sous chaque capture d'une vue de Paul, en plus de la phrase, **trois infobulles de cet écran, écrites en clair**, pour qu'il les lise sans la souris ;
6. le README, avec en tête la section « Complément 3 » :
   - les trois changements, avec des scènes qui les montrent ;
   - le compte des textes déplacés, et vers où ;
   - le compte des infobulles ajoutées ;
   - ce que les gardes ont trouvé d'autre ;
   - le reste du README mis à jour.

Zéro trou, zéro dette, zéro défaut : le banc final le prouve.

## 6. Après l'étape C

Tu t'arrêtes, une seule fois. La conscience fait l'audit final du complément 3, puis Paul valide sur la maquette et le livret. Tu ne fusionnes rien dans `main`.

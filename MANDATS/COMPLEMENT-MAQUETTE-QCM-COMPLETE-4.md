# COMPLÉMENT 4 — LA MAQUETTE COMPLÈTE DU QCM : LES DÉFAUTS DE LA V8, ET LA LECTURE DE LA CONSCIENCE FAITE AVANT DE LIVRER

*Écrit par la conscience n°12 le 12/10/2026 (tour 657), sur l'ordre de Paul, à 07:28 : « ça commence à faire beaucoup de compléments. fais le message pour l'exécutant. »*

*L'audit final de la v8, qui fonde ce complément : https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/MAQUETTE-QCM-COMPLEMENT-3-12-10/README.md (ses sorties, ses scripts et ses captures sont dans le même dossier).*

*Ce complément s'adresse à l'exécutant de la maquette complète du QCM, en session cloud de Claude Code, dans le dépôt du sas `siteflow-io/mjpc-chantier`.*

*Restent en vigueur en entier :*
- *le mandat : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md ;*
- *le complément 1 : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md ;*
- *le complément 2 : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2.md ;*
- *le complément 3 : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-3.md, sauf sa retouche « la règle du désaccord n'est dite qu'une fois » (changement 8.4), que la correction 8 ci-dessous remplace.*

---

## 0. Ce que ça change pour la classe

Paul valide la maquette en cliquant. Dans la v8, presque tout tient sous le clic : les gestes mènent à leur objet, les chiffres s'accordent, l'écran est épuré. Mais neuf choses lui disent encore quelque chose de faux :
1. les résultats de ses autres séances (celle de 3e, celle sur papier, celles de septembre) s'ouvrent dans un tableau brut, sans compétences ni autonomie, et celui de la séance sur papier n'a aucune note ;
2. le PDF « notes et compétences » est toujours celui de la séance de 3e du 09/10, quelle que soit la séance d'où il l'ouvre ;
3. « 🚀 Lancer le rattrapage » marque absent Adam, le seul élève du rattrapage ;
4. la démo montre la question 3 sur les tablettes quand la console en est à la question 1 ;
5. la séance interrompue dit « moitiés de droite » quand ce sont celles de gauche ;
6. Adam, seul, lit sa propre feuille sous un chrono qui parle de « la feuille du voisin » ;
7. sur son téléphone, une ligne est grise sur le fond violet : il ne la lit pas ;
8. la règle « Un désaccord, c'est sérieux… », qu'il a validée (points 513 et 533), a disparu de cinq écrans où l'élève en a besoin ;
9. son évaluation de 3e est « à compléter » le 07/10, sa classe la passe le 09/10, et seul son PDF lui donne un chapitre.

**Paul a dit, en donnant l'ordre de ce complément : « ça commence à faire beaucoup de compléments. »** Ce complément doit être le dernier. Les défauts de la v8 ont un point commun : le banc ne regarde pas tout ce que la conscience regarde à l'audit. Il joue les 169 scènes, mais pas les écrans que leurs gestes ouvrent ; il ne lit pas le PDF ; il ne mesure pas le contraste sur un fond en dégradé ; il accepte qu'une phrase d'élève disparaisse partout où un point la cite. Ce complément ferme cet écart : les gardes 16 à 20 font entrer dans le banc la lecture de la conscience, et **tu refais toi-même cette lecture, avec ses propres scripts, avant de livrer** (§4). Ce que la conscience trouverait à l'audit, tu le trouves avant elle.

---

## 1. Qui tu es, ce que tu ne fais jamais

Tu es **l'exécutant du complément 4**. Les interdits du mandat et des compléments 1 à 3 (§1 de chacun) valent tous, mot pour mot :
1. **tu fais tout le complément d'une traite**, sans t'arrêter et sans rien demander ;
2. **une livraison n'a jamais ni trou ni dette**.

En plus :
1. tu ne touches qu'aux neuf corrections du §2 et à tout ce que les gardes 16 à 20 et ta lecture (§4) trouvent. Chaque trouvaille est un défaut, corrigé et inscrit au journal ;
2. **aucun mot vu par l'élève ne change depuis la v8**, sauf ce que les corrections 4, 6 et 8 nomment. Chaque différence entre les textes vus par l'élève de la v7 et ceux de la v9 est nommée une par une, par scène et par moitié de tablette (garde 20). Si une correction semble demander une phrase nouvelle côté élève, tu reprends celle de la v7 ou de la 7.7.1 ; tu n'en écris jamais ;
3. tu ne modifies pas les fichiers `maquette-qcm-v1.html` à `v8.html`, ni leurs md5 ; ta livraison est `maquette-qcm-v9.html` ;
4. le §1.4 du complément 3 vaut toujours : un texte ou une infobulle du site d'aujourd'hui, et une donnée du hub, restent tels quels, mot pour mot ; seul « session » devient « séance » ;
5. tu ne touches pas à ce que l'audit range dans « ce qui reste tel quel, parce que c'est le site d'aujourd'hui » (§6 du rapport) : au tableau, la fin de l'heure qui affiche « 📋 Préparation… La première question va arriver. ».

Pour commencer :
1. `git fetch origin`, `git checkout maquette-qcm`, puis `git merge origin/main` ;
2. lis en entier ce complément, puis le rapport de l'audit de la v8 et tout son dossier : `sorties/notes-v8.md`, `sorties/carte-gestes-v8.jsonl`, `sorties/mise-en-page-v8.jsonl`, `sorties/bulles-1366.txt`, `sorties/bulles-1536.txt`, `sorties/textes-balayage-v8.txt`, `sorties/eleve-v7-v8.txt`, les scripts de `scripts/` et les huit captures de `captures/` ;
3. vérifie les md5 de la production, comme au complément 1 (§2) : `index.html` doit être `ac792b28f40d3a0510e725fc4a6b6985`, et `evaluation-qcm.html` `ecae65624855a1a877708986a8e984e5` ; et celui de la v8 : `6675262e8c6892c2c29bb709048a6592`.

**Un antécédent à garder en tête** (registre du dispositif, `docs/MJPC6-1-DISPOSITIF.md` de la production, erreur ⑬ de la conscience n°2) : « quand une liste est traitée par tranches, la tranche doit être NOMMÉE explicitement ». Les défauts 6 et 8 de la v8 viennent de là : deux retouches du point 778 ont été posées partout où leur phrase paraissait, au lieu des seuls écrans qu'elles visaient.

---

## 2. Les neuf corrections

### Correction 1 — les résultats de chaque séance, dans le même tableau

**Dans la v8** : « 📊 Ouvrir » (« Résultats », `c-seances`) et « 📊 Résultats » (« 📚 Séances précédentes ») ouvrent, pour la séance de 3e du 09/10 (`S3E`), la séance sur papier (`PAP`), celle du 24/09 (`CH1`) et celle du 15/09 (`JB`), un tableau sans la mise en forme du site : ni couleurs, ni compétences, ni autonomie, ni « À lire sur la feuille », ni « 📄 PDF notes et compétences ». Celui de `c-resultats&seance=PAP` aligne onze cases sous les trois colonnes Q1 à Q3, et n'a aucune note (« — »). Captures `resultats-seance-papier.png`, `resultats-seance-3e.png`.

**Ce qui est attendu** : un seul composant de tableau des résultats, celui de `c-resultats`, sert à **toutes** les séances, rempli depuis le scénario pour la séance cliquée, au moment de la scène :
1. sa mise en forme, ses colonnes et ses gestes sont ceux de `c-resultats` : ✓, ✗, ⛔, ∅ ou ✓ orange par question, la note, le niveau de maîtrise, les compétences, la colonne « 🤝 Autonomie », « À lire sur la feuille », les noms cliquables, la légende ;
2. il a autant de colonnes de questions que l'évaluation de cette séance a de questions, et chaque case est celle de cet élève à cette question ;
3. ses notes viennent du scénario : `S.R_3E`, `S.R_CH1`, `S.R_JB`, `S.notePapier` (la grille du papier), avec leurs absents ;
4. « 📄 PDF notes et compétences » y est ouvert quand les copies de cette séance sont rendues, et fermé avec sa raison au survol sinon (complément 2), comme dans `c-resultats` et `c-resultats-rendues` ;
5. **l'évaluation de 3e** (`3e- éval 1 Analyse logique - Construire une phrase complexe`) : au hub, elle n'a pas de chapitre, et le scénario la dit « Sans chapitre, à compléter » (`src/scenario.js`, l. 37) ; pourtant la classe la passe le 09/10, et son PDF, validé par Paul (points 602 à 609, tour 625), lui donne « 3e, chapitre 1 — Poésie et peinture au XIXe siècle » et ses compétences. Le scénario porte donc ce que l'histoire suppose déjà : l'évaluation est complétée avant le 09/10 à 15:07, avec le chapitre et les compétences que montre ce PDF. Avant ce moment, elle reste « À compléter » et « Lancer » reste fermé (point 741), comme dans `c-evals` au 07/10 (moment `PREP`) ; après, elle est rangée sous « 3e », prête, partout où elle paraît. Aucun texte nouveau n'est écrit pour cela.

### Correction 2 — le PDF de chaque séance

**Dans la v8** : « 📄 PDF notes et compétences » de `c-resultats-rendues` (« Évaluation d'essai », séance du 08/10) ouvre `x632-pdf`, qui montre toujours le PDF de « 3e- éval 1 Analyse logique », séance du 09/10, 11 questions (Lou 10,9, Hugo 14,5), même avec `&seance=S08`. La cause : le PDF est un fichier figé (`window.PDF632_HTML`, `gen632.js`). Le journal le dit corrigé (n°159), et ce n'est pas vrai par le geste. Capture `pdf-autre-seance.png`.

**Ce qui est attendu** : le PDF est construit pour la séance d'où on l'ouvre, depuis le scénario, au moment de la scène, avec la mise en page du PDF figé de la v8 (`gen632.js`), validé par Paul, qui reste son modèle (points 602 à 609, 612 à 643) : la classe, le titre de l'évaluation, son chapitre, la date de la séance, son nombre de questions et son mode de notation, l'état des copies, puis pour chaque élève sa note sur 20, ses compétences, son point d'autonomie et sa ligne « Commentaire ». La scène `x632-pdf` reste celle de la séance de 3e (`S3E:rendu`) : pour cette séance, le PDF construit est identique au PDF figé de la v8, au caractère près, parce que Paul l'a validé et que le scénario s'accorde à lui. C'est la preuve que le PDF construit est le bon.

### Correction 3 — l'appel du rattrapage

**Dans la v8** : « 🚀 Lancer le rattrapage » (`c-rattrapage`) ouvre `c-appel&seance=RATT`, où YVON Adam, le seul élève du rattrapage, est barré absent (« 1 absent sur 1 »), avec « CHEVALLIER Théo (binôme d'Adam) et ZELLER Lou (seule) sont mis ensemble : tablette 12 ». Capture `appel-rattrapage.png`.

**Ce qui est attendu** : l'appel se calcule depuis le scénario pour la séance `RATT`, comme pour toute séance : ses élèves sont ceux de la séance (`eleves:["YVON Adam"]`), Adam y est présent, seul sur sa tablette, avec l'en-tête orange « seul », comme `c-rattrapage` le montre déjà ; aucun autre élève de la classe n'y paraît, ni absent ni mis en binôme. Plus généralement, aucun appel ne se calcule sur la classe entière quand la séance a ses propres élèves.

### Correction 4 — la démo, au même moment sur les tablettes et la console

**Dans la v8** : `t-demo-q`, déclarée au moment « DEMO · Q1 · réflexion », montre « QUESTION 3 / 3 · Pourquoi l'araignée n'est-elle pas un insecte ? ». La console du même moment, atteinte par « 🎓 Lancer la démo » puis « 🚀 Lancer la séance », dit « QUESTION 1 / 3 ». Capture `demo-question-3.png`.

**Ce qui est attendu** : `t-demo-q` se calcule depuis le scénario au moment qu'elle déclare, comme toute scène (complément 3, changement 5.2) : la démo commence à sa question 1 (complément 3, changement 4.6). Elle montre donc la question 1 de l'évaluation de démo, en réflexion, et « QUESTION 1 / 3 », comme la console. Les mots de l'écran (le bandeau « 🎓 Évaluation d'entraînement : elle ne compte pas. », les consignes, les boutons) ne changent pas ; seuls changent le numéro et l'énoncé de la question, qui sont des données. Ce changement est nommé dans la liste de la garde 20.

### Correction 5 — la séance interrompue dit le bon côté

**Dans la v8** : `c-interrompue` dit « État : question 2, 2e tour (moitiés de droite) » ; au 2e tour de la question 2, ce sont les moitiés de gauche (`c-q2-tour2` : « 2e tour · moitiés de gauche »). La cause : `Interrompue()` (`src/c3-scenes.js`, l. 97) prend le côté de qui commence (`PREMIER[m.qi]`), sans tenir compte du tour.

**Ce qui est attendu** : le côté se calcule depuis la question et le tour. Tu cherches tous les endroits où un côté s'écrit d'après `PREMIER[…]` (15 lignes de `src/` dans la v8), et chacun tient compte du tour.

### Correction 6 — Adam, seul, garde son chrono

**Dans la v8** : dans `t-corr-seul` (le rattrapage, Adam seul), Adam lit sa propre feuille (« Qu'as-tu écrit sur ta feuille ? »), mais son chrono s'appelle « 📄 Temps pour lire la feuille du voisin ». La retouche du point 778 a été posée aussi là où il n'y a pas de voisin. Capture `adam-seul-voisin.png`.

**Ce qui est attendu** : un élève seul n'a pas de voisin. Dans `t-corr-seul`, et dans tout écran où un élève lit seul sa feuille, le chrono garde le libellé de la v7, mot pour mot (« Temps de réponse », tel que la 7.7.1 l'écrit). « 📄 Temps pour lire la feuille du voisin » ne vaut que là où un voisin lit la feuille : notamment `t-corr-q1-lecture`, `t-corr-q2-lecture`, `t-corr-q3-lecture`, `x610-3-a-correction`, `b-recopie`, le téléphone et la console.

### Correction 7 — le téléphone se lit

**Dans la v8** : la ligne « 📱 Sur les tablettes, avant la correction : » (`p-reponse`, `p-eleve`, `p-corr-avant`, `p-corr-apres`, et toute scène du téléphone qui la montre) s'écrit en gris `#64748b` directement sur le fond violet de la page : contraste 1,1, mesuré aux pixels. Capture `telephone-ligne-illisible.png`.

**Ce qui est attendu** : cette ligne, et tout texte posé directement sur le fond violet du téléphone, atteint un contraste de 4,5, mesuré aux pixels (garde 19), avec une couleur que le téléphone emploie déjà.

### Correction 8 — la règle du désaccord, là où elle est seule

**Dans la v8** : « ☝️ Un désaccord, c'est sérieux : tu n'en signales qu'un, celui dont tu es le plus sûr. Il se vérifie sur ta feuille. » (points 513 et 533) a disparu de **huit moitiés de tablette** :
1. les deux moitiés de `t-coeval`, de `t-coeval-daccord` et de `x610-6-coeval-laquelle` ;
2. la moitié de gauche (Julien) de `t-coeval-ecrit` et de `x610-7-coeval-ecrit`.

Dans chacune, elle était seule. Elle ne devait partir que de la moitié de droite (Michel) de `t-coeval-ecrit` et de `x610-7-coeval-ecrit`, où elle suivait « ☝️ C'est ta seule question de désaccord. ». **La faute vient de la conscience** : le complément 3 disait « la règle du désaccord n'est dite qu'une fois », sans dire où. Capture `regle-desaccord-absente.png`. Le relevé moitié par moitié est dans `sorties/eleve-v7-v8.txt`.

**Ce qui est attendu** : la phrase revient, mot pour mot comme dans la v7, à sa place dans la v7, dans ces huit moitiés. Les deux moitiés de Michel gardent le texte de la v8.

### Correction 9 — ce que tes gardes et ta lecture trouvent

Tout ce que les gardes 16 à 20 (§3) et ta lecture (§4) trouvent sur la v8 ou sur les versions de travail est un défaut, corrigé et inscrit au journal, qu'un point ci-dessus le nomme ou non.

---

## 3. Les gardes 16 à 20

Elles entrent dans le banc unique, avec les gardes 1 à 15, et passent par le geste dans Chromium, aux tailles de chaque vue (complément 3, §3). **Aucune ne reconnaît un écart par sa forme** : un écart permis est nommé un par un, avec sa scène, dans un fichier du banc.

### Garde 16 — chaque écran atteint est joué comme une scène

1. Le banc part des 169 scènes, clique chaque élément cliquable dans une page neuve (comme la carte de la conscience, `scripts/carte.js`), et relève chaque destination distincte : la scène avec ses paramètres (`&seance=`, `&eleve=`, `&tab=`, `&q=`, `&eval=`, `&m=`, `&de=`…), et chaque page ouverte par `window.open` (le tableau, le PDF, le téléphone).
2. Chaque destination nouvelle est ouverte à son tour, ses gestes cliqués, et ainsi de suite **jusqu'à ce qu'aucune destination nouvelle n'apparaisse**. La liste va dans `sorties/destinations-v9.txt`, avec son compte et, pour chaque destination, le geste et la scène qui l'ouvrent.
3. Chaque destination est jouée par les gardes 9 à 15 et 17 à 20 comme une scène, au moment que déclarent sa scène et ses paramètres.
4. Un écran ouvert avec un paramètre a la même structure que l'écran de même sorte dans les scènes : mêmes colonnes, mêmes gestes, mêmes classes CSS. Seules changent les données. Par exemple, le tableau de `c-resultats&seance=PAP` a les colonnes, la légende et les gestes de `c-resultats`.

### Garde 17 — le PDF est celui de sa séance

Pour chaque séance et chaque geste qui ouvre un PDF, le banc lit le texte du PDF (sa page, ou son cadre) et le compare au scénario, au moment du geste : la classe, le titre, le chapitre, la date, le nombre de questions, le mode de notation, l'état des copies ; pour chaque élève, sa note sur 20, ses compétences, son point d'autonomie. Le PDF de `x632-pdf` est identique, au caractère près, au PDF figé de la v8 (`window.PDF632_HTML`).

### Garde 18 — l'écran dit le moment qu'il déclare

Dans chaque scène et chaque destination, sur chaque appareil (console, téléphone, tablettes, tableau, élève, mode test), le banc lit ce que l'écran dit du moment et le compare au moment déclaré, dans le scénario :
1. « Question n / m » et « QUESTION n / m », la question en cours et son énoncé ;
2. le tour (1er, 2e) et le côté (« moitiés de gauche », « moitiés de droite »), y compris dans l'état écrit d'une séance interrompue ;
3. la phase (réflexion, réponse, B, lecture, révélée, co-évaluation, bilan, soir) ;
4. dans un appel, les présents et les absents, qui sont les élèves de cette séance, et eux seuls ;
5. pour une évaluation, son chapitre, ses compétences et son état (« À compléter », prête) : à un même moment, ils sont les mêmes sur tous les écrans, PDF compris.

### Garde 19 — le contraste se mesure aux pixels

Pour chaque texte visible des vues de Paul et des élèves, dont la classe ou le fond vient de la maquette, le banc mesure le contraste à l'écran, quel que soit le fond (uni, dégradé, image) :
1. une capture de la zone du texte, puis une seconde avec ce texte seul rendu transparent ;
2. le fond est la médiane des pixels de la seconde capture sous les lettres ; la couleur du texte est sa couleur calculée ;
3. le contraste atteint 4,5, ou 3 pour un texte de 18,6 px gras ou de 24 px.

La garde 14.3 du complément 3, qui saute les textes dont elle ne trouve pas la couleur de fond, est remplacée par celle-ci.

### Garde 20 — chaque changement vu par l'élève est nommé

1. Le fichier `banc/existant/eleve-v7-v9.json` liste **chaque ligne** qui diffère entre les textes vus par l'élève de la v7 et ceux de la v9, dans les scènes de tablette, d'élève et de tableau (et les destinations de ces vues) : la scène, la vue (1280 ou 390), le bloc (moitié de gauche, moitié de droite, ou page), la ligne de la v7, la ligne de la v9, et sa raison. Il n'y a que huit raisons :
   - la typographie (complément 3, §1.2) ;
   - une des retouches du point 778, nommée ;
   - un émoji décoratif retiré parce qu'il était coupé (complément 3, changement 6.6) ;
   - un texte qui se lit maintenant en entier (complément 3, changement 6.4) ;
   - une donnée calculée depuis le scénario (complément 3, changement 5) ;
   - un élément de la 7.7.1 qui manquait à la maquette, mot pour mot ;
   - un geste qui se voit (complément 3, changement 7) : le clavier de l'app qui suit le champ où l'élève tape, ce qu'il y a tapé ;
   - la correction 4 de ce complément.
2. Le banc relève les textes de la v7 et de la v9, scène par scène et bloc par bloc, comme `scripts/eleve-diff.js` de l'audit, et il échoue sur toute différence absente de la liste, et sur toute ligne de la liste qu'il ne retrouve pas.
3. Tu pars du relevé de la conscience, `sorties/eleve-v7-v8.txt` : chaque ligne y est classée dans une des huit raisons, ou corrigée.

La garde 9.5 du complément 3 est remplacée par celle-ci.

### Avant toute correction

Tu joues les gardes 16 à 20 sur la v8. Elles doivent y trouver les huit défauts de l'audit et le neuvième :
- la garde 16, avec la garde 13 : `c-resultats&seance=PAP`, onze cases sous trois colonnes et aucune note ; les tableaux de `S3E`, `CH1` et `JB` sans la structure de `c-resultats` ;
- la garde 17 : le PDF ouvert depuis `c-resultats-rendues`, qui est celui de `S3E` ;
- la garde 18 : Adam absent dans `c-appel&seance=RATT`, et Théo et Lou mis ensemble ; « QUESTION 3 / 3 » dans `t-demo-q` au moment « DEMO · Q1 · réflexion » ; « moitiés de droite » dans `c-interrompue` ; le chapitre de l'évaluation de 3e, « — » dans la liste et « 3e, chapitre 1 » dans le PDF ;
- la garde 19 : « 📱 Sur les tablettes, avant la correction : » dans `p-corr-apres`, contraste 1,1 ;
- la garde 20 : le chrono de `t-corr-seul`, et la règle du désaccord dans les huit moitiés de la correction 8.

La sortie va dans `sorties/gardes-16-a-20-sur-v8.txt`. Une garde qui ne trouve pas son défaut connu n'est pas une garde : tu la refais avant d'aller plus loin.

---

## 4. La lecture de la conscience, faite par toi avant de livrer

Quand le banc entier est à zéro défaut sur ta version de travail, tu fais la lecture que la conscience fera à l'audit, avec ses propres scripts (`AUDITS/MAQUETTE-QCM-COMPLEMENT-3-12-10/scripts/`, en remplaçant le chemin de la copie de la v8 par celui de ta version) :
1. `carte.js` et `analyse-carte.py` : chaque élément cliquable, chaque destination ;
2. `mise.js` et `bulle-cible.js` : la mise en page à chaque taille, les bulles « i » survolées à 1366 × 768 et à 1536 × 864 ;
3. `textes.js` et `eleve-diff.js` : les textes et les infobulles de chaque scène, les textes vus par l'élève contre la v7 ;
4. les scripts ciblés (`dests.js`, `s3e.js`, `pap.js`, `appel.js`, `pdf2.js`, `pdf3.js`, `demo.js`, `edit9.js`, `clicvis.js`, `tableau.js`…), rejoués tels quels ;
5. **chaque capture regardée**, celles des 169 scènes et celles des destinations de la garde 16 : tu ouvres chaque image, tu la regardes, et tu refais ses comptes tuile par tuile.

Tu écris ce que tu as vu dans `sorties/lecture-v9.md`, sur le modèle de `sorties/notes-v8.md` de la conscience : une ligne par capture, ce qu'elle montre et ce qui y est juste ou faux. Chaque chose fausse est un défaut : tu la corriges, tu l'inscris au journal, et tu lui donnes une garde du banc, qui la trouve d'abord sur la version d'avant la correction. Tu ne livres que quand ta lecture ne trouve plus rien.

---

## 5. Les étapes, d'une traite

Chaque étape finit par sa garde, puis par un commit poussé sur `maquette-qcm` : une sauvegarde, pas un arrêt.

| Étape | Ce qu'elle fait | Sa garde |
| --- | --- | --- |
| **A — les gardes** | La fusion de `main` ; les md5 ; les gardes 16 à 20 dans le banc ; `banc/existant/eleve-v7-v9.json`, d'après `eleve-v7-v8.txt`. | Les gardes jouées sur la v8 trouvent leurs défauts connus (`sorties/gardes-16-a-20-sur-v8.txt`). |
| **B — les corrections** | Les corrections 1 à 8. | Le banc entier, gardes 1 à 20, à zéro défaut. |
| **C — la lecture et la livraison** | Ta lecture (§4) et tout ce qu'elle trouve (correction 9) ; `maquette-qcm-v9.html` et son md5 ; toutes les captures refaites et regardées ; le README (section « Complément 4 » en tête), `DEFAUTS.md` à partir du n°356, `POINT-SCENE.md`. | Le banc final, gardes 1 à 20, sur la v9, à zéro défaut (`sorties/banc-final-v9.txt`), et `sorties/lecture-v9.md` sans rien de faux. |

---

## 6. La livraison, une seule

Elle va sur la branche `maquette-qcm`, dans `MANDATS/MAQUETTE-QCM-COMPLETE/` :
1. `maquette-qcm-v9.html`, son md5, et ses sources ;
2. `banc/existant/eleve-v7-v9.json` et le banc avec ses gardes 16 à 20 ;
3. `sorties/gardes-16-a-20-sur-v8.txt`, `sorties/destinations-v9.txt`, `sorties/lecture-v9.md` et `sorties/banc-final-v9.txt` ;
4. `captures/` refait ;
5. le README, avec en tête la section « Complément 4 » :
   - les neuf corrections, avec les scènes ou les destinations qui les montrent ;
   - le compte des destinations jouées par la garde 16 ;
   - le compte des lignes de `eleve-v7-v9.json`, par raison ;
   - ce que ta lecture a trouvé, et la garde qui le couvre désormais ;
   - le reste du README mis à jour.

Zéro trou, zéro dette, zéro défaut : le banc final et ta lecture le prouvent.

## 7. Après l'étape C

Tu t'arrêtes, une seule fois. La conscience fait l'audit final du complément 4, en refaisant sa lecture sur la v9, puis Paul valide sur la maquette. Tu ne fusionnes rien dans `main`.

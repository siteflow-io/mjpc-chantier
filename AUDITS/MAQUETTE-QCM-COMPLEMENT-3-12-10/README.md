# Audit final du complément 3 — la maquette v8 du QCM — 12/10/2026

*Écrit par la conscience n°12 le 12/10/2026 (tour 656), après « Livré » de Paul à 06:17. La livraison : branche `maquette-qcm`, commit `f2e6b420` (12/10, 00:22 UTC), `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v8.html`, md5 `6675262e8c6892c2c29bb709048a6592` (vérifié). Les v1 à v7 gardent leurs md5 ; la production n'a pas bougé (`index.html` `ac792b28…`, `evaluation-qcm.html` `ecae6562…`).*

---

## 1. Le verdict

**La v8 ne va pas : huit défauts**, dont un que j'ai causé moi-même par la rédaction du complément 3 (n°8). Tout le reste de ce que la lecture du 11/10 avait trouvé est réglé, mesuré de nouveau.

## 2. Comment la v8 a été relue

La même lecture que pour la v7 (`AUDITS/MAQUETTE-QCM-LECTURE-11-10/`), refaite sur la v8 :
1. **la carte des gestes** : 5 566 éléments cliquables des 169 scènes, chacun cliqué dans une page neuve (`sorties/carte-gestes-v8.jsonl`) ; puis, en plus, **chaque destination à paramètres** que ces gestes ouvrent (`&seance=`, `&eleve=`…), rendue et lue (`scripts/dests.js`, `s3e.js`, `pap.js`, `appel.js`, `pdf2.js`, `pdf3.js`) ;
2. **la mise en page** : 384 relevés, chaque scène à chaque taille de sa vue (`sorties/mise-en-page-v8.jsonl`), les bulles « i » survolées à 1366 × 768 et 1536 × 864 (`sorties/bulles-1366.txt`, `bulles-1536.txt`) ;
3. **les textes et les infobulles** de chaque scène (`sorties/textes-balayage-v8.txt`), les 2 097 infobulles distinctes de Paul relues pour leur forme, et les textes vus par l'élève comparés ligne à ligne à ceux de la v7 ;
4. **chaque capture regardée** (`sorties/notes-v8.md`), avec les comptes refaits tuile par tuile.

Le banc de l'exécutant (`banc/banc.js`, 21 833 vérifications, zéro défaut chez lui) a été relancé chez moi sur la v8 ; au bout d'une heure, il n'avait pas fini. Son résultat sera ajouté ici. Il ne change pas le verdict : les huit défauts ci-dessous passent à travers ses gardes, et la section 4 dit pourquoi.

## 3. Les huit défauts

1. **Les résultats des quatre autres séances.** « 📊 Ouvrir » (Résultats) et « 📊 Résultats » (Séances précédentes) ouvrent, pour la séance de 3e du 09/10, la séance sur papier, celle du 24/09 et celle du 15/09, un tableau sans la mise en forme du site : ni couleurs, ni compétences, ni autonomie, ni « À lire sur la feuille », ni « 📄 PDF notes et compétences ». Celui de la séance sur papier (`c-resultats&seance=PAP`) aligne onze cases sous les trois colonnes Q1 à Q3, et n'a aucune note (« — »). Captures `resultats-seance-papier.png`, `resultats-seance-3e.png`.
2. **Le PDF d'une séance.** « 📄 PDF notes et compétences » du tableau de l'évaluation d'essai (`c-resultats-rendues`, séance du 08/10) ouvre le PDF de « 3e- éval 1 Analyse logique », séance du 09/10, 11 questions (Lou 10,9, Hugo 14,5). La cause : le PDF est un fichier figé (`window.PDF632_HTML`), le même quelle que soit la séance. Le journal le dit corrigé (n°159). Capture `pdf-autre-seance.png`.
3. **L'appel du rattrapage.** « 🚀 Lancer le rattrapage » ouvre un appel où YVON Adam, le seul élève du rattrapage, est barré absent (« 1 absent sur 1 »), avec « CHEVALLIER Théo (binôme d'Adam) et ZELLER Lou (seule) sont mis ensemble : tablette 12 », la durée de la classe entière (17 min) et « 🚀 Lancer la séance ». Capture `appel-rattrapage.png`.
4. **La démo sur les tablettes.** `t-demo-q`, déclarée au moment « DEMO · Q1 · réflexion », montre « QUESTION 3 / 3 · Pourquoi l'araignée n'est-elle pas un insecte ? ». La console du même moment, atteinte par « 🎓 Lancer la démo » puis « 🚀 Lancer la séance », dit justement « QUESTION 1 / 3 ». Capture `demo-question-3.png`.
5. **La séance interrompue.** `c-interrompue` dit « État : question 2, 2e tour (moitiés de droite) » ; au 2e tour de la question 2, ce sont les moitiés de gauche (`c-q2-tour2`). La cause : `Interrompue()` (`src/c3-scenes.js`, l. 97) prend le côté de qui commence, sans le tour.
6. **Adam, seul, et « le voisin ».** Dans `t-corr-seul`, Adam lit sa propre feuille (« Qu'as-tu écrit sur ta feuille ? »), mais son chrono s'appelle « 📄 Temps pour lire la feuille du voisin ». La retouche du point 778 a été posée aussi là où il n'y a pas de voisin. Capture `adam-seul-voisin.png`.
7. **Une ligne illisible sur le téléphone.** « 📱 Sur les tablettes, avant la correction : » (`p-reponse`, `p-eleve`, `p-corr-avant`, `p-corr-apres`…) s'écrit en gris `#64748b` directement sur le fond violet de la page : contraste 1,1, mesuré aux pixels, le texte masqué. Capture `telephone-ligne-illisible.png`.
8. **La règle du désaccord a disparu là où elle était seule.** « ☝️ Un désaccord, c'est sérieux : tu n'en signales qu'un, celui dont tu es le plus sûr. Il se vérifie sur ta feuille. » (points 513 et 533) n'est plus dans huit moitiés de tablette où elle était seule : les deux moitiés de `t-coeval`, de `t-coeval-daccord` et de `x610-6-coeval-laquelle`, et la moitié de gauche (Julien) de `t-coeval-ecrit` et de `x610-7-coeval-ecrit`. Elle ne devait partir que de la moitié de droite (Michel) de ces deux derniers écrans, où elle suivait « ☝️ C'est ta seule question de désaccord. » (relevé moitié par moitié : `sorties/eleve-v7-v8.txt`, ajouté au tour 657 ; la première rédaction de ce rapport ne citait que trois écrans). **La faute est la mienne** : le complément 3 disait « la règle du désaccord n'est dite qu'une fois », sans dire où. Capture `regle-desaccord-absente.png`.

## 4. Pourquoi les gardes ne les ont pas vus

- Les gardes 12 à 14 jouent les 169 scènes, pas les écrans que leurs gestes ouvrent avec un paramètre (`c-resultats&seance=…`, `c-appel&seance=RATT`) : n°1 et 3.
- La garde 13 ne lit pas le contenu du PDF (il s'ouvre par `window.open`), ni le « Question n / m » des tablettes contre le moment déclaré de la scène : n°2 et 4. Elle ne lit pas non plus l'état écrit dans la fenêtre de la séance interrompue : n°5.
- La garde 14 saute les textes posés sur un fond en dégradé (elle ne trouve pas de couleur de fond) : n°7.
- La garde 9.5 accepte toute disparition d'une phrase citée par le point 778, où qu'elle soit : n°6 et 8.

## 5. Ce qui est réglé, mesuré de nouveau

- **Les deux bloquants de la v7** : Lou a 2 / 3 partout avant la lecture du soir, 1 / 3 partout après (tableau, « Mes évaluations », son bilan) ; « 🔍 Jouer en grand » défile, ses champs s'atteignent à 1366 et à 1536.
- **Les gestes** : chaque nom d'élève cliqué ouvre la fiche de son élève (console, téléphone, tableau, MJPC : 788 vérifiés par la carte, les 122 du tableau des résultats et de MJPC par échantillon) ; chaque « 👁 » sa tablette, au moment de la scène ; chaque « ❌ Écarter », « 🗑️ », « ✏️ », « 🖨️ » son objet ; plus aucun libellé ne mène au même écran pour deux objets ; les gestes du téléphone restent sur le téléphone ; les seuls changements d'appareil sont ceux que le complément nomme ; 17 éléments seulement ne changent rien au clic, des menus qui n'ont qu'un choix et la zone de dépôt du fichier de MJPC.
- **Le geste se voit** : l'éditeur supprime, change la difficulté, compte ses questions, et demande avant de fermer ; « Oui / Non » de B et l'estimation s'allument ; le clavier de l'app tape.
- **Les chiffres** : les comptes de chaque scène du direct, du bilan de classe, de la grille et des tableaux, refaits tuile par tuile, sont justes ; le point de Hugo, retiré à 10:23, reste retiré partout ; « À lire » garde ses lignes ; les dates se suivent ; la fin prévue suit chaque temps.
- **L'affichage** : plus de défilement de côté, plus rien hors d'atteinte dans les 169 scènes, plus aucune bulle « i » qui sort de sa bulle ou de la fenêtre ; la liste du tableau tient ; les tableaux tiennent à 1366.
- **Les textes** : « séance » partout (les seuls « session » restants sont des noms du code dans des infobulles du site d'aujourd'hui) ; « ⛔ » ne marque plus que le point d'autonomie ; plus d'explication à l'écran ; plus d'infobulle de la maquette côté élève (restent celles de la 7.7.1 : « 1 pt », « 📄 Imprimer / Exporter mon bilan », « 🎓 Mode élève ») ; les quatre niveaux et le tri « classe ».

## 6. Ce qui reste tel quel, parce que c'est le site d'aujourd'hui

Au tableau, une fois la dernière question corrigée, la vue affiche « 📋 Préparation… La première question va arriver. » : c'est ce que fait la 7.7.1 hors des phases qu'elle couvre (`evaluation-qcm.html`, l. 5116 à 5124), et la maquette la reproduit. Ce n'est pas un défaut de la maquette ; c'est à regarder au mandat de code.

## 7. Les fichiers

- `captures/` : les huit défauts ;
- `sorties/` : la carte des gestes de la v8, la mise en page, les bulles survolées, le balayage des textes, les notes de lecture ;
- `scripts/` : les scripts Playwright de cet audit. Ils lisent une copie de la v8 dans le carnet de la session (même md5) : pour les rejouer, remplace ce chemin par `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v8.html`.

## 8. Ajouts du 12/10, tour 657, en écrivant le complément 4

1. **La règle du désaccord** (défaut 8) manque dans cinq écrans, pas trois : relevé moitié par moitié des textes vus par l'élève, v7 contre v8 (`scripts/eleve-diff.js`, `scripts/moities.js`, `sorties/eleve-v7-v8.txt`). Ma première comparaison rangeait la disparition dans `t-coeval-ecrit` et `x610-7-coeval-ecrit` parmi les retraits voulus, sans regarder de quelle moitié elle partait : la faute même que la garde 9.5 commet.
2. **Un neuvième défaut, l'évaluation de 3e** : le scénario la dit « Sans chapitre, à compléter » (`src/scenario.js`, l. 37), comme au hub, et la liste l'affiche ainsi (« 📚 chapitre : — », « ⚠️ À compléter avant de la lancer », `c-evals`, moment `PREP`, 07/10) ; pourtant la classe la passe le 09/10, et le PDF lui donne « 3e, chapitre 1 — Poésie et peinture au XIXe siècle » et ses compétences. Le scénario ne dit pas quand elle a été complétée.
3. **Le PDF figé de la séance de 3e s'accorde au scénario** : les 25 notes, comparées une à une, sans écart (`scripts/pdf-vs-scn.js`, `sorties/pdf-3e-contre-scenario.txt`).
4. **Le banc rejoué** : la machine de la session a redémarré vers 07:28 ; le banc, qui tournait depuis 06:20, a été coupé sans rien écrire. Relancé à 07:29.
5. **Ce que l'élève voit d'autre de changé, v7 contre v8**, relevé et jugé : les émojis décoratifs du fond retirés (complément 3, changement 6.6) ; « 📊 Mes évaluations » ajouté aux moitiés des scènes x610, comme dans la 7.7.1 ; les questions de `x610-6-coeval-laquelle` lues en entier (changement 6.4) ; la ligne de la séance de 3e dans « Mes évaluations » de Lou (le scénario) ; « Évaluation d'essai — 3 questions · 08/10/2026 » en tête du bilan imprimé (des données) ; le clavier de lettres dans la moitié de Julien de `t-login-inconnu`, qui suit le champ « Nom » où il tape (changement 7.3 ; la v7 y montrait les chiffres) ; les quatre retouches du point 778. Aucun n'est un défaut ; le complément 4 demande que chacun soit nommé un par un dans le banc (garde 20).


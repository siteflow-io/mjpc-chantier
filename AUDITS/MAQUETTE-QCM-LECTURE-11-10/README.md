# La lecture complète de la maquette v7 du QCM — 11/10/2026

*Écrit par la conscience n°12 le 11/10/2026 (tour 654), sur l'ordre de Paul, à 14:29 : « Bon. Je pense qu'il faut également que tu fasses une vraie lecture de la maquette, dans tous les sens, car beaucoup de choses te sont passées sous le nez, comme cette histoire d'infobulle mal calibrée. Le mandat ne part pas à l'exécutant tant que ton "ça va" n'est pas fiable. »*

*La maquette lue : `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v7.html`, md5 `6be84ea1fb636017ce7225bfa3556082`, 169 scènes. Ce qui en sort : le complément 3 refait, https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-3.md.*

---

## 1. Le verdict

**La v7 ne va pas.** Elle a deux défauts bloquants et des défauts de six sortes, que mon audit du tour 645 n'a pas vus. Mon « ça va » d'alors n'était pas fiable : je n'avais cliqué que les gestes ajoutés, lu que les textes neufs, et mesuré que ce que les gardes mesuraient déjà.

**Le complément 3 refait couvre tout ce que cette lecture a trouvé** : les 279 trouvailles confirmées des relecteurs, et celles de la conscience. Chaque sorte de défaut y a son changement et sa garde, et chaque garde doit d'abord trouver ses défauts connus sur la v7.

## 2. Comment la v7 a été lue

Cinq lectures, chacune sur les 169 scènes :
1. **la carte des gestes** (`scripts/carte.js`, `sorties/carte-gestes.jsonl`) : chacun des 5 489 éléments cliquables (boutons, champs, menus, éléments qui ont la main au survol), cliqué dans une page neuve, avec ce qu'il fait : la scène où il mène, ou ce qui change sur place, ou rien. Le résumé par libellé est `sorties/va-par-libelle.txt`, les effets sur place `sorties/gestes-sur-place.txt` ;
2. **la mise en page** (`scripts/mise.js`, `scripts/atteinte.js`) : 384 relevés, chaque scène à chaque taille de sa vue (console 1366 × 768, 1536 × 864, 1920 × 1080 ; tablette 1280 × 800 ; tableau 1280 × 800 et 1920 × 1080 ; téléphone 390 × 844 ; élève 1280 × 800 et 390 × 844) : textes coupés, sortis de leur boîte, hors d'atteinte, chevauchés, petits, peu contrastés ;
3. **les textes** (`scripts/textes.js`, `sorties/textes-balayage.txt`) : le texte et les infobulles de chaque scène, passés au crible (session / séance, typographie, pluriels, élisions, mots du code, mots interdits côté élève), chacun rapporté au site d'aujourd'hui pour savoir qui l'a écrit ;
4. **les captures, regardées une à une** par la conscience (`sorties/notes-visuelles.md`), en tuiles de 1 150 px, avec les comptes refaits tuile par tuile là où un écran affiche un total (ont répondu, justes, feuilles lues, notes) ;
5. **quatre relecteurs séparés**, qui n'avaient pas vu le travail de la conscience, chacun sur un quart des scènes (`relecteurs/CONSIGNE-RELECTEUR.md`, `relecteurs/RAPPORT-r1.md` à `r4.md`) : 325 trouvailles. Chacune a été revérifiée par la conscience contre les quatre lectures ci-dessus, et rangée dans `DEFAUTS-RELECTEURS.md`.

| Statut des 325 trouvailles | Lignes |
| --- | --- |
| confirmé | 266 |
| confirmé en partie (le relecteur doutait ; la sorte de défaut est mesurée) | 13 |
| existant : texte du site d'aujourd'hui ou donnée du hub, reste tel quel | 34 |
| à trancher par Paul (session / séance ; mots vus par l'élève) | 12 |

## 3. Les deux bloquants

1. **La note de Lou n'est pas la même partout.** Son bilan (`e-bilan-lou`) et « Mes évaluations » (`e-mes-evals-rendue`) disent 1 / 3, 6,7 / 20, « Question 3 · faux · Corrigé d'après ta feuille ». Le tableau de la console (`c-resultats`, `c-resultats-rendues`) et le bilan de classe disent 2 / 3, 13,3, Q3 ✓, sans rien à lire sur sa feuille. La cause : son bilan est forcé à 1 / 3 dans `src/maquette626.js` à `628.js` (`if(p === "Lou")`), d'après la capture 66 de la maquette du flux, alors que le tableau calcule depuis ses réponses.
2. **En mode test, « 🔍 Jouer en grand » cache ce que Paul doit taper.** À 1366 × 768 et 1536 × 864, la fenêtre est fixe, haute de 960 px, et ne défile pas : les deux champs « 📝 Feuille de … » sont à y = 892 pour un écran de 864 (`captures/x620-3-en-grand-1536x864.png`, `scripts/v168b.js`). À 1920 × 1080, ils se voient.

## 4. Les six sortes de défauts

### C1 — un geste mène souvent ailleurs que là où il le dit (47 lignes)

La cause est unique : la destination d'un bouton se lit dans une table rangée par libellé (`ALLER[scène][libellé]`, puis `ALLER["*"][libellé]`), si bien qu'un même libellé mène partout à la même scène figée. Mesuré dans la carte des gestes :
- les 24 noms de la console mènent à `c-autonomie`, la fiche de FOUCHER Hugo pendant la correction de Q2, depuis 24 scènes, y compris la co-évaluation et la séance sur papier ; ceux du téléphone mènent tous à `p-eleve`, la fiche de Théo ; dans le tableau des résultats, seul Michel s'ouvre ; dans MJPC, tous ouvrent la fiche de Michel ;
- les « 👁 » de toutes les tablettes mènent à `c-voir-tablette`, la tablette 1 au 1er tour de Q1, depuis 51 scènes ;
- « 📺 Ouvrir vue tableau » mène à `b-reponse` (Q1, 1er tour) depuis 86 scènes, y compris le soir et hors séance ; « ← Retour » mène à l'accueil de l'app ; la croix de « 📱 QR pilotage » ramène à `c-q1-tour1` ;
- « ❌ Écarter » de n'importe quelle question ouvre la garde de la question 3 ; « ⚠️ Annuler » ouvre celle de la question 2 ; « 🛑 Terminer la session », puis « Annuler », ramène à `c-q1-tour1` d'où qu'on vienne ;
- « 🗑️ » de n'importe quelle évaluation ouvre la garde des « Misérables — évaluation d'entraînement » ; « ✏️ Modifier » et « 🖨️ Imprimer » ouvrent « 3e Chapitre 1… (séance 3) » ;
- les boutons du téléphone ouvrent des scènes de la console ; ceux du mode test ouvrent la séance de 3 ESSAI ;
- « Donner raison à Julien » et « 📌 Je relis ce soir » mènent à « raison donnée à Michel ».

### C2 — un geste ne change parfois rien (17 lignes)

- dans l'éditeur, chaque geste ne fait que monter le compteur « ⚠ Modifications non enregistrées » : « 🗑 » laisse « 11 questions », « Expert » laisse « Facile », le chapitre ne change pas ; « ✕ » et Échap ferment sans garde ;
- « Oui, la même chose » et « Non, autre chose » : pixels identiques avant et après le clic (`captures/b-oui-avant.png`, `b-oui-apres.png`) ; la classe `on` est posée, rien ne la dessine ;
- le clavier de l'app est dessiné en `span`, sans main : un clic sur « z » ou « 7 » ne tape rien (`scripts/clavier.js`) ;
- sur les 5 489 éléments, 223 ne changent rien au clic. Quelques-uns sont déjà choisis, et c'est normal (« 🎯 Tout ou rien » allumé) ; les autres sont des défauts : les champs du clavier, les menus « Classe » et « Évaluation », et des lignes ou des cartes qui ont la main au survol (lignes des séances précédentes, cartes « Toutes les questions », en-têtes et noms du tableau des résultats et de la grille, carte de « Mes évaluations ») ;
- glisser Julien sur la moitié vide de la tablette 13 laisse la tablette 1 seule sans son en-tête « seul » (`captures/glisse-julien-tablette-13.png`).

### C3 — les chiffres se contredisent (55 lignes)

Lou (ci-dessus) ; le point d'autonomie de Hugo, retiré à 10:41, n'apparaît plus ensuite (bilan de classe « 0 retiré », colonne « 🤝 Autonomie » à « 🟢 Très bonne maîtrise ») ; celui de Michel, retiré le soir, non plus dans `c-resultats-rendues` ; « À lire ce soir » passe de 7 lignes à 5 ; la démo est datée du 10/10, après la séance du 08/10 ; la reprise dit « séance du 09/10 » pour une séance du 08/10 ; une séance aux copies rendues est dans la corbeille ; le PDF ouvert depuis « Évaluation d'essai » est celui d'une autre évaluation, d'un autre jour ; l'éditeur de « 3e Chapitre 1… (séance 3) » a une Q11 qui vient d'une autre évaluation ; « noté sur 7 questions sur 11 » dans une évaluation de 3 questions ; la fin prévue ne bouge pas quand la réflexion de Q3 passe de 20 à 90 s (`scripts/finprevue.js`) ; la démo commence à sa question 3.

Les comptes refaits tuile par tuile sont justes dans les scènes du direct (23/24, 20/23, 9/23, 14/24, 18/24, 8/24, 20/24, 17 + 2 + 1, 21 + 2 + 1), dans le bilan de classe (7 + 10 + 5 + 2, moyenne 12,8) et dans la grille du papier. Les contradictions viennent des scènes qui forcent un chiffre ou qui oublient un geste montré plus tôt.

### C4 — des écrans ne se lisent pas en entier (62 lignes)

Le bloquant de « Jouer en grand » ; la liste « 👥 Classe (25) » du tableau, coupée à WEBER Clara (`b-reponse`, `b-recopie`, `b-correction`) ; le tableau des résultats à 1366 × 768 (1 274 px pour 1 248, la dernière colonne coupée) ; les choix A à F du téléphone, tronqués là où Paul tranche ; 10 297 textes sous 12 px et 6 139 sous le contraste requis, dont la plupart dans des classes que la maquette a écrites (`.flag`, `.st` à 1,89, `.nm` à 2,28, `.maitrise-pill`…) ; le 🎲 à moitié caché par le cadre ; des guillemets seuls en début ou en fin de ligne.

### C5 — les infobulles (61 lignes, dont 15 existantes)

Celles du complément 3 de départ (bulles qui sortent, coupées, manquantes), plus : des infobulles écrites par la maquette sur les écrans des élèves (« 📊 Mes évaluations », les cases de l'attestation, les choix figés, « Sur la tablette simulée… ») ; le « i » de « 🧪 Mode test » sans bulle dans 86 scènes, celui de « Rouvrir pour un élève — Q2 » vide ; « Le temps de  de cette question » (un mot manque) ; le champ de la réflexion qui porte l'infobulle de la réponse ; la carte d'une question close qui dit « Question en cours » ; des bulles en Georgia ou en capitales espacées.

### C6 — les textes (83 lignes, dont 19 existantes et 12 à trancher)

Les explications à l'écran (changement 1) ; « session » et « séance » pour la même chose (les boutons de la 7.7.1 disent « session », les textes validés de la maquette disent « séance ») ; « bonne(s) réponse(s) » ; les élisions (« de Inès », « Feuille de Élise ») ; « recopie » dans le prompt de création d'éval et dans `c-terminer` ; deux libellés pour un même geste (« ⛔ Michel » / « ⛔ à Michel ») et un même mot pour deux gestes côte à côte (« Annuler » / « ⚠️ Annuler la question 2 ») ; « ⛔ » qui veut dire à la fois « dernier moment » et « point d'autonomie retiré » dans le même tableau.

## 5. Ce qui n'est pas un défaut de la maquette

- **Les textes du site d'aujourd'hui** (34 lignes) : ils restent mot pour mot (complément 1, §3, défaut 2 ; complément 3, §1.4). Par exemple l'infobulle de « 📺 Ouvrir vue tableau » (« Utilise W+P… »), « Student Report », `sessionActive`, `cloturerSession`, « Check-in », « snapshot », « Firebase », « ... » côté élève, « Mode de scoring », « Regénérer » (cloné de la correction de dictée), « 3e temps du chantier sécurité » et la date « 2026-08-02 » de la taxonomie dans MJPC. Plusieurs sont maladroits ; c'est au mandat de code du QCM de les revoir, s'il le faut.
- **Les données du hub** : les titres et les énoncés de Paul (« XIXème siècle », « 3e- éval 1 Analyse logique », « l'étape 4? »).
- **« Accès professeur »** côté élève : c'est « va voir ton professeur » qui est interdit, pas le mot.
- **« ⛔ Dernier moment »** chez Paul et le ✓ orange chez l'élève : acquis aux points 439 et 484 ; seul le double sens de « ⛔ » pose question (point 777).
- **Le tableau « point → scène »** (`POINT-SCENE.md`) : ses 63 citations ont été cherchées dans le texte des scènes qu'il nomme ; 55 y sont mot pour mot, et les 8 autres sont des paraphrases d'éléments présents. Il ne manque pas de scène.

## 6. Ce que la conscience n'a pas pu vérifier

Rien n'est resté sans mesure dans les six sortes ci-dessus. Les 13 lignes « en partie » sont celles où le relecteur doutait de l'intention (par exemple, si « Question suivante → » doit s'ouvrir avant « 💡 Révéler ») : la sorte de défaut est mesurée, et le complément 3 tranche par sa règle générale. Les 4 relecteurs ont joué tous les « i » et tous les boutons ; la conscience a rejoué elle-même les gestes (carte complète), les mesures, les textes, et regardé chaque capture.

## 7. Les fichiers

- `DEFAUTS-RELECTEURS.md` : les 325 trouvailles, revérifiées, rangées par sorte (C1 à C6), avec leur statut ;
- `relecteurs/` : la consigne et les quatre rapports, tels qu'ils ont été rendus ;
- `sorties/` : `carte-gestes.jsonl` (5 489 éléments), `va-par-libelle.txt`, `gestes-sur-place.txt`, `mise-en-page.jsonl` (384 relevés), `atteinte.txt`, `textes-balayage.txt`, `notes-visuelles.md`, `defauts-relecteurs-tries.json`, `defauts-relecteurs-bruts.json`, `scenes.json` ;
- `scripts/` : les scripts Playwright de la lecture (`carte.js`, `mise.js`, `atteinte.js`, `textes.js`, `clicvis.js`, `clavier.js`, `drag.js`, `finprevue.js`, `ivide.js`, `v004.js`, `v133.js`, `v168b.js`). Ils lisent une copie de la v7 dans le carnet de la session (même md5) : pour les rejouer, remplace ce chemin par `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v7.html` ;
- `captures/` : le bloquant de « Jouer en grand », le bouton B avant et après le clic, le glisser-déposer.

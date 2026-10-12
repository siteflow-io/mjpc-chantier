# CODE DU QCM — CE QUI EST COMMUN AUX QUATRE EXÉCUTANTS

*Écrit par la conscience n°12 le 12/10/2026 (tour 672), sur l'ordre de Paul, à 14:04 : « et si je lance 4 exécutants ? […] tu me fais 4 mandats pour 4 exécutants différents qui s'occupent chacun d'une partie, puis audit, et push. en revanche ça demande de l'organisation, notamment au niveau des noms des exécutants. » Et à 13:44 : « je n'ai qu'un objectif: que demain matin à 10h30 maximum, l'app qcm tourne avec tous les attributs de la maquette, tous. »*

*Chaque exécutant lit en entier ce fichier, puis son propre mandat. Ce fichier remplace `MANDATS/MANDAT-CODE-QCM.md`.*

---

## 0. Ce que ça change pour la classe

Demain matin, Paul fait passer à une classe de 4e « 4e- Chapitre 1 - Paris à la barre et analyse logique », réduite à 11 questions, avec le QCM que montre la maquette validée (`MANDATS/MAQUETTE-QCM-COMPLETE/`, v9) : les tablettes partagées en deux moitiés, les deux tours, B, l'estimation, les deux attestations, la correction par la lecture de la feuille du voisin, « Trouvée au dernier moment », le point d'autonomie, la co-évaluation, le bilan ; puis le soir, les résultats, le PDF et les copies rendues ; et tout le reste de la maquette. Il pilote depuis sa console et son téléphone ; la classe voit le tableau. **L'app doit être en ligne avant 10:30.** La conscience l'audite dès 07:00 et la met en ligne si l'audit va ; sinon, Paul fait cours avec la version d'aujourd'hui, réparée.

**La maquette n'a aucun lien avec la base.** Ses écrans se calculent depuis un scénario écrit d'avance (`src/scenario.js`, l'objet `SCN`, le moment courant `MO()` / `MOM()`), et un clic saute à une autre scène (`data-va`, `versScene`, dans `src/gestes.js` et `src/c3-gestes.js`). Le travail de cette nuit : **brancher la maquette sur la vraie séance**. Ses écrans restent ceux que Paul a validés ; ce qu'ils lisent vient de la base ; ce que font leurs gestes s'écrit dans la base et arrive à toutes les pages ouvertes.

---

## 1. Les quatre exécutants

| Nom | Ce qu'il fait | Ses fichiers (lui seul les modifie) |
| --- | --- | --- |
| **QCM-1 · SOCLE** | La couche de la séance réelle (`SCN` branché sur la base, les actions `ACT` et `ELV`), l'état de la séance, la synchronisation entre pages, les adresses de la 7.7.1, l'entrée du professeur et des élèves par leur code, le routeur des gestes, l'assemblage (`build.py`). | `src/live/*` (nouveaux), `src/scenario.js` (remplacé), `src/socle.js`, `src/gestes.js`, `src/c3-gestes.js`, `src/c3-scenes.js`, `src/c3-base.js`, `src/c3-textes.js`, `src/c3-bulles.js`, `build.py`, les CSS |
| **QCM-2 · HEURE** | Tous les écrans de l'heure, sur tous les appareils (console, tablettes, téléphone, tableau), de l'appel au bilan : il remplace chaque donnée écrite pour le scénario (Julien, Michel, 3 questions, 24 élèves) par la donnée réelle, pour n'importe quelle classe et n'importe quel nombre de questions. | `src/maquette.js`, `src/maquette2.js`, `src/maquette610.js`, `src/ev3e.js`, `src/etape2.js`, `src/etape3.js`, `src/c3-pilot.js`, `src/c3-corr.js`, `src/c3-tablettes.js`, `src/c3-telephone.js`, `src/c3-appareils.js`, `src/c3-x610.js`, `src/c3-objets.js` |
| **QCM-3 · SOIR** | Le soir et tout le reste de la maquette : « Résultats », le tableau de chaque séance, la fiche, « À lire sur les feuilles », le PDF, rendre ou masquer les copies, la corbeille, la sauvegarde ; l'éditeur, les listes par niveau, le collage du JSON, les réglages et le prompt, la démo permanente, la séance sur papier, le rattrapage, le mode test ; « Mes évaluations » et le bilan de l'élève le soir. | `src/c3-soir.js`, `src/c4-seances.js`, `src/c3-evals.js`, `src/c3-feuille.js`, `src/etape4.js`, `src/maquette620.js`, `src/maquette626.js`, `src/maquette627.js`, `src/maquette628.js`, `src/com626.js` à `com632.js`, `src/complement1.js`, `src/complement2.js`, `src/pdf632.html` |
| **QCM-4 · BANC** | Il n'écrit pas l'app : il la met à l'épreuve. Le banc commun sur le faux hub, avec plusieurs pages à la fois ; la fidélité de chaque écran à la maquette ; les contrôles de la conscience ; les relecteurs neufs ; l'assemblage toutes les deux heures, et le verdict de livraison. Il range chaque défaut trouvé au nom de son propriétaire. | `LIVRAISONS/CODE-QCM/banc/*`, `LIVRAISONS/CODE-QCM/DEFAUTS-OUVERTS.md`, `LIVRAISONS/CODE-QCM/VERDICT.md`, `LIVRAISONS/CODE-QCM/sorties/*` |

Un fichier que tu n'as pas dans ta liste, tu ne le modifies pas. Si tu as besoin qu'il change, tu écris ta demande au propriétaire dans `LIVRAISONS/CODE-QCM/DEMANDES.md` (une ligne, en tête de fichier : `[QCM-n → QCM-m] ce qu'il faut, pourquoi`) ; le propriétaire la lit à chaque `git pull` et la traite avant son travail en cours. `src/mjpc.js` (les écrans de MJPC, qui vivent dans `index.html`) n'entre pas dans l'app : personne n'y touche.

**Ton nom est dans tout ce que tu fais** : le début de chacun de tes commits (`[QCM-2 · HEURE] …`), tes lignes dans `DEMANDES.md` et `DEFAUTS-OUVERTS.md`, et le titre de ta session, que Paul lui donne.

---

## 2. La branche, et le rythme

1. Tout le monde travaille sur **la même branche du sas, `code-qcm`**, dans `LIVRAISONS/CODE-QCM/` : la conscience y a copié les sources de la maquette (`src/`, `build.py`), depuis la v9 candidate (`5852823d`, 13:58). Les mandats et les contrôles de la conscience sont sur `main` : `git merge origin/main` à chaque fois que tu commences une partie.
2. **La v9 finale** : l'exécutant de la maquette la pousse sur `maquette-qcm` dans l'après-midi. Dès qu'elle y est, chacun reporte dans ses propres fichiers de `LIVRAISONS/CODE-QCM/src/` ce qu'elle a changé depuis `5852823d` (`git diff 5852823d origin/maquette-qcm -- MANDATS/MAQUETTE-QCM-COMPLETE/src`).
3. Avant chaque commit : `git pull --rebase origin code-qcm`. Un conflit ne peut venir que d'un fichier commun (`DEMANDES.md`, `DEFAUTS-OUVERTS.md`) : tu gardes les deux lignes.
4. Tu pousses **au moins toutes les heures**, et dès qu'une partie marche. Jamais un commit qui casse l'assemblage : `python3 LIVRAISONS/CODE-QCM/build.py` doit passer avant chaque `push`.
5. Les heures (heure de Paris) :
   - **18:00, 20:00, 22:00, 00:00, 02:00, 04:00** : QCM-4 assemble, passe le banc, et range les défauts dans `DEFAUTS-OUVERTS.md` ; chacun traite les siens avant de continuer ;
   - **05:00** : plus rien de nouveau ; on ne corrige que des défauts ;
   - **05:30** : QCM-4 passe le banc final, les contrôles de la conscience et les relecteurs neufs ;
   - **06:30 au plus tard** : QCM-4 écrit `VERDICT.md` et pousse la livraison. Chacun s'arrête alors.
6. **L'ordre de priorité, si le temps manque** : l'heure de classe d'abord (de l'appel à la fin de la correction, puis la co-évaluation et le bilan), le soir ensuite, le reste après. Demain matin, c'est l'heure qui sert.

---

## 3. Le contrat de la base

Il est écrit par la conscience, avant vous ; QCM-1 l'implémente ; QCM-2 et QCM-3 s'en servent sans attendre. **Un changement du contrat passe par QCM-1**, qui l'écrit dans `LIVRAISONS/CODE-QCM/CONTRAT-CHANGEMENTS.md` avant de le coder.

### 3.1 La base

C'est celle de la 7.7.1 (`mjpc-hub`, `DB_ROOT = "qcm"`), avec ses chemins : `qcm/evaluations/<id>`, `qcm/sessions/<sid>`, `qcm/sessionActive/<classeSlug>`, `qcm/presence/<classeSlug>/<eleveSlug>`, `qcm/settings`, `classes/<classe>`, `codes/<eleveSlug>`, `mjpcProfils/<classeSlug>/<eleveSlug>/sessions`. **Rien de ce qui y est ne change de forme** : une séance de la 7.7.1 reste lisible. Ce qui est nouveau s'ajoute.

**Une évaluation** (`qcm/evaluations/<id>`) a les champs du JSON du prompt de création (`MANDATS/PROMPT-QCM-CREATION/README.md`) : `titre`, `chapitre`, `mode`, et pour chaque question `enonce`, `choix`, `bonnes`, `niveau`, `reflexion`, `reponse`, `competences`, `verifie`, `explication`, `bonus`, `longueurAssumee`. Elle est complète quand chaque question a ses deux temps et ses compétences, et l'évaluation son chapitre ; sinon « Lancer » reste fermé (cadrage, point 741). La démo vit en `qcm/evaluations/demo`, et aucune purge ne l'efface.

**Une séance** (`qcm/sessions/<sid>`) garde les champs de la 7.7.1 (`evalId`, `classe`, `classeSlug`, `phase`, `qIdx`, `phaseStart`, `paused`, `absents`, `reponses/<qi>/<eleveSlug>`, `autoevals/<eleveSlug>`, `papier/<eleveSlug>`, `notifs`) et reçoit :

| Chemin | Ce qu'il contient |
| --- | --- |
| `etat` | `{ph, qi, tour, cote, depuis, duree, pour}` : la phase (`avant`, `appel`, `entree`, `pret`, `reflexion`, `passage`, `reponse`, `b`, `close`, `rouvert`, `estim`, `att2`, `lecture`, `revele`, `coeval`, `bilan`, `fin`, `pause`), la question, le tour (1 ou 2), la moitié qui répond (`g` ou `d`), l'heure de début (ms) et la durée (s) du temps en cours, l'élève d'une question rouverte pour lui seul |
| `places` | `{<n>: {g: eleveSlug ou null, d: eleveSlug ou null}}` : qui est assis où ; `seul: true` pour un élève seul |
| `premier` | `{<qi>: "g" ou "d"}` : la moitié qui commence chaque question ; le 2e tour est l'autre |
| `temps` | `{<qi>: {reflexion, reponse}}` : les temps tapés en direct |
| `ecartees`, `annulees` | les questions écartées, annulées (listes de `qi`) |
| `partis` | `{<eleveSlug>: ms}` ; un retour retire la clé |
| `attest` | `{1 ou 2: {<eleveSlug>: {lignes, fini}}}` |
| `reponses/<qi>/<eleveSlug>` | la forme de la 7.7.1, plus `tour` et `ms` |
| `b/<qi>/<eleveSlug>` | `"oui"`, `"non"` |
| `ordreCorr` | les questions dans l'ordre de la correction (de la plus ratée à la mieux réussie), fixé au lancement de la correction |
| `lectures/<qi>/<eleveSlug>` | ce que le voisin a lu sur la feuille de l'élève : `{choix: [...] ou "aucun", par: eleveSlug, ms}` |
| `revelees` | les questions révélées, dans l'ordre |
| `trouvee/<eleveSlug>` | la question « Trouvée au dernier moment » de l'élève (une par évaluation) |
| `coeval/<eleveSlug>` | ce que l'élève a dit de la lecture de son voisin : `{statut: "ok", "mal" ou "peut", qi, ecrit, ms}` |
| `alertes/<id>` | l'alerte de la co-évaluation, ses faits, et comment Paul l'a tranchée : `{qi, eleves, tranche: {decision, ms}}` |
| `autonomie/<eleveSlug>` | `{retire: true, ms, quand: "heure" ou "soir"}` ; « ↩️ Rendre » retire la clé |
| `aLire/<id>` | une feuille à lire le soir : `{eleveSlug, qi, sorte, txt, lue, corrige}` |
| `bilanAffiche` | ms : « 🏁 Afficher leur bilan aux élèves » |
| `copies` | `{rendues: ms, masquees: true ou false}` |

Les exclusions sont lues en `classes/<classe>/exclusions/<eleveSlug>` (une liste ; aucune aujourd'hui). Les libellés élève des compétences, en `taxonomie/competences/<code>/libelleEleve` : c'est la conscience qui les écrit au hub.

### 3.2 Ce que les écrans appellent

**`SCN`** garde les noms de fonctions de la maquette, que les écrans appellent déjà : `seance`, `compteurs`, `autonomie`, `presents`, `voisinDe`, `tabletteDe`, `aLire`, `moment`, `resultat`, `finHeure`, `rendueAu`, `repondu`, `maitriseDe`, `evalDeSeance`, `estimation`, `passees`, `evalParId`, `aLireSeance`, `tempsDe`, `seancesAvant`, `retiresSeance`, `qcmPrecedent`, `premierCote`, `note`, `mesEvaluations`, `finPrevue`, `evals`, `evalDu`, `dureeEstimee`, `corrigeesAu`, `cote`, `nomDe`, `pre`, `fr1`, `sec`, `hm`, `cle`, `LIB_MAITRISE`, `EM_MAITRISE`, `DUREES`. Elles se calculent sur la séance réelle ; l'argument `k` (le moment) désigne la séance affichée, à son état présent. Les tables écrites pour le scénario (`RT`, `LU`, `LU_JM`, `TABL`, `FEUI`, `ESTIM`, `CO`, `DIT_B`, `ORD`, `PREMIER`, `ORDRE_CORR`, `NOMS`, `SEXE`, `PAIRES`) sont remplacées par des fonctions : `SCN.reponse(eleve, qi)`, `SCN.lecture(eleve, qi)`, `SCN.ditB(eleve, qi)`, `SCN.estimationDe(eleve)`, `SCN.coevalDe(eleve)`, `SCN.ordreChoix(eleve, qi)`, `SCN.ordreCorr()`, `SCN.eleves()`, `SCN.sexe(eleve)`, `SCN.places()`. Un élève se désigne par son `eleveSlug` ; `SCN.nomDe(slug)` donne « NOM Prénom », `SCN.pre(slug)` le prénom.

**`ACT`** (les gestes de Paul) et **`ELV`** (les gestes de l'élève) écrivent dans la base ; chaque page les voit sans rechargement :
- `ACT` : `lancerSeance(classe, evalId, options)`, `appelFini(absents)`, `echanger(a, b)`, `lancerQuestion(qi)`, `autoriserReponse()`, `tourSuivant()`, `cloreQuestion()`, `ajouterTemps(sorte, s)`, `pause()`, `reprendre()`, `ecarter(qi)`, `annuler(qi)`, `remettre(qi)`, `rouvrirTous(qi)`, `rouvrirPour(qi, eleve)`, `depart(eleve)`, `retour(eleve)`, `deplacer(eleve, tablette, cote)`, `lancerEstimation()`, `lancerCorrection()`, `reveler()`, `questionSuivante()`, `retirerAutonomie(eleve, quand)`, `rendreAutonomie(eleve)`, `ouvrirCoeval()`, `trancher(alerte, decision)`, `afficherBilan()`, `finirAutreHeure()`, `terminer()`, `lireFeuille(aLireId, choix)`, `rendreCopies(sid)`, `masquerCopies(sid)` ;
- `ELV` : `combien(n)`, `entrer(cote, code, prenom, nom)`, `cocher(attest, ligne)`, `commencer()`, `repondre(qi, choix)`, `direB(qi, ouiNon)`, `estimer(niveau)`, `lire(qi, choix)`, `coeval(statut, qi, ecrit)`.

QCM-1 pousse d'abord ces noms, chacun déjà appelable (même s'il ne fait encore que journaliser), **dans sa première heure**, pour que QCM-2 et QCM-3 branchent leurs écrans tout de suite.

---

## 4. Ce que vous ne faites jamais

1. Écrire au vrai hub, ou toucher à la production (`siteflow-io/monsieurjaipascompris`) : vous testez sur le faux hub (`AUDITS/QCM-MODE-TEST-09-10/banc/`) ; c'est la conscience qui met en ligne.
2. Une phrase vue par l'élève que Paul n'a pas donnée : elles sont toutes dans la maquette et la 7.7.1 ; vous les reprenez mot pour mot.
3. Décider seul d'un comportement : il est dans la maquette validée, ses compléments et le cadrage (`MANDATS/CADRAGE-QCM.md`).
4. Redessiner un écran : vous gardez les composants de la maquette, et vous ne changez que d'où ils lisent et ce que font leurs gestes.
5. Casser une donnée d'avant, utiliser un service payant ou une IA dans l'app, une boîte système, ou une page qu'il faut recharger pour être à jour (règle du 04/10 : chaque donnée affichée est abonnée à sa source ; un redessin n'efface jamais une saisie ni un menu ouvert).
6. Modifier les contrôles de la conscience (`AUDITS/CONTROLES-QCM-APP/`, `AUDITS/CONTROLES-QCM/`) : leurs md5 sont dans leur `EMPREINTES.md5`.

## 5. La livraison

À 06:30 au plus tard, sur `code-qcm`, dans `LIVRAISONS/CODE-QCM/` : `evaluation-qcm.staging.html` et son md5, les sources et `build.py`, le banc et ses sorties (avec leur durée), les captures de l'heure à chaque phase et sur chaque appareil, `VERDICT.md` (ce qui passe, ce qui ne passe pas, par partie et par propriétaire) et le README. Personne ne fusionne dans `main`, personne ne touche à la production.

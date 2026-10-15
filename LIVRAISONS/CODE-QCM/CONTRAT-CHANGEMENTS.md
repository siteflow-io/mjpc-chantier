# Changements du contrat de la base (QCM-1 · SOCLE)

Chaque changement du contrat (COMMUN §3) s'écrit ici avant d'être codé : ce qui change, pourquoi, qui est touché.

---

## C1 — `etat` s'appelle `deroule` (QCM-1, 12/10 17:45)

**Ce qui change.** L'état de la séance (COMMUN §3.1, `etat` : `{ph, qi, tour, cote, depuis, duree, pour}`) s'écrit en `qcm/sessions/<sid>/deroule`, pas en `qcm/sessions/<sid>/etat`.

**Pourquoi.** Dans la 7.7.1, `qcm/sessions/<sid>/etat` existe déjà : c'est une chaîne, `"en_cours"` ou `"terminee"` (`lancerSessionApresCheckin`, `cloturerSession`, `evalADesResultats`, la maintenance). Y mettre un objet changerait la forme d'une donnée d'avant (COMMUN §3.1 : « rien de ce qui y est ne change de forme »), et la 7.7.1 ne reconnaîtrait plus une séance terminée. `etat` garde donc sa chaîne ; l'app l'écrit comme la 7.7.1 (`"en_cours"` au lancement, `"terminee"` à la fin, avec `evalSnapshot`).

**Qui est touché.** Personne n'a à lire ce chemin : les écrans lisent `SCN` (`SCN.etat()`, `SCN.moment(MO())`), jamais la base directement.

## C2 — Les champs ajoutés à `deroule`

`deroule = {ph, qi, tour, cote, depuis, duree, pour, reprise, autreHeure}` :
- `ph`, `qi`, `tour`, `cote`, `depuis` (ms, horloge du serveur), `duree` (s), `pour` : comme COMMUN §3.1 ;
- `reprise` : quand `ph` vaut `"pause"`, l'état gelé `{ph, qi, tour, cote, duree, reste, pour}` (`reste` en s) ; « ▶️ Reprendre » le relance avec ce `reste` ;
- `autreHeure` : ms, quand la pause vient de « ⏸️ Finir à une autre heure » (la séance quitte `sessionActive` ; « ▶️ Reprendre la séance du … » la remet).

Le miroir de la 7.7.1 est tenu à chaque passage : `phase` (`idle`, `reflexion`, `reponse`, `attente`, `autoeval`, `correction`, `finie`), `qIdx`, `phaseStart`, `paused` : une page de la 7.7.1 ouverte sur la séance voit où elle en est.

## C3 — Ce que l'app ajoute ailleurs

- `qcm/sessions/<sid>/rouverts/<qi>` : `"tous"` ou l'`eleveSlug` (une fois par question, cadrage) ;
- `qcm/sessions/<sid>/lancee` : `{date: ms, heure: "hh:mm", fin: "hh:mm", mode: "tablettes" | "papier", demo: bool, rattrapage: bool, eleves: [slugs] ou null}` ;
- `qcm/sessions/<sid>/autoevals/<eleveSlug>` reste le chemin de l'estimation (7.7.1) : `ELV.estimer(niveau)` y écrit (`"rouge"`, `"orange"`, `"bleu"`, `"vert"`) ;
- `qcm/settings/durees` : `{installation, estimAttest, correctionParQ, coevalBilan, decompte, b, entre}` en secondes (les durées de la séance de Réglages) ; absentes, ce sont celles de la maquette (`SCN.DUREES`).

## C4 — `ELV` désigne l'élève

Les gestes de l'élève se font dans une moitié de tablette : chaque fonction d'`ELV` prend, en dernier argument facultatif, l'`eleveSlug` de la moitié (`ELV.repondre(qi, choix, eleve)`) ; sans lui, c'est l'élève de la moitié courante (`ELV.moitie(cote)` la fixe). `ELV.lire(qi, choix, eleve)` : `eleve` est **le propriétaire de la feuille** (la moitié où le voisin clique) ; le lecteur (`par`) est son voisin.

## C5 — Ce que QCM-3 · SOIR écrit lui-même (accordé, 12/10 17:53)

Accordé tel que QCM-3 l'a demandé (DEMANDES, 17:45) : pour n'importe quelle séance passée, `autonomie/<slug>` (`quand: "soir"`), `aLire/<id>` (`lue`, `corrige`), `lectures/<qi>/<slug>` (`par: "prof"` ou `"feuille"`), `copies`, et deux nouveaux chemins :
- `qcm/sessions/<sid>/bilans/<slug>` : `{texte, valide: ms}`, le « 📝 Bilan général » validé ;
- `corbeille/qcm-<sorte>-<ms>` à la racine du hub : `{_meta:{motif, chemin, app:"evaluation-qcm", ts, sorte, titre}, data}`, la forme de `mjpcInjecterAvecArchive` de la 7.7.1.

`ACT.rendreCopies(sid)`, `ACT.masquerCopies(sid)`, `ACT.retirerAutonomie(slug, "soir", sid)`, `ACT.rendreAutonomie(slug, sid)`, `ACT.lireFeuille(aLireId, choix, sid)` existent et prennent la séance en dernier argument. `SCN.LIVE` vaut `true` ; `SCN.resultat(sid, slug)` rend la forme de la maquette. L'identifiant d'une ligne « à lire » (`aLire/<id>`) est `<slug>_<qi>_<sorte>` (`sorte` : `b`, `aucun`, `co`), celui que `SCN.aLireSeance(sid)` donne à chaque ligne (`id`).

## C6 — Les gestes de Paul coupent l'attente : `deroule.bPour` (QCM-1, 12/10 18:27)

Sur la lecture que QCM-2 a proposée (DEMANDES, 18:20), conforme aux bulles de la maquette : « ⏭️ Tour suivant » ouvre tout de suite le 2e tour, et « 🔒 Clore la question » clôt tout de suite la question, **pendant que la moitié qui vient de répondre dit B** jusqu'au bout de son temps de B : `deroule.bPour = {cote, qi, tour, jusqua: ms}`. Sans geste de Paul, au bout du temps, la séance enchaîne comme les moments de la maquette : B (`ph:"b"`), puis le passage (`ph:"passage"`), puis le tour.

Pour les écrans : `SCN.doitDireB(slug)` dit si la moitié de cet élève doit montrer B maintenant (la phase `b` de son tour, ou `bPour`) ; `SCN.moment(k).bPour = {cote, qi, tour, reste}` ; `ELV.direB(qi, ouiNon, slug)` s'écrit à tout moment.

Et `ACT.trancher(alerte, null)` défait une décision (la lecture revient à `alertes/<id>/lu`) ; décisions : `{decision:"feuille"|"auteur", choix, eleve}` (la lecture devient `choix`, `par:"prof"`), `"lecteur"`, `"soir"` (une ligne « à lire », sorte `co` : « pense qu'<NOM Prénom> a mal lu sa feuille ; à relire ») ; `ACT.questionPrecedente()`.

**Amendé à 18:46** : « ✋ Autoriser la réponse » garde le passage. Sa bulle : « Coupe la réflexion : « POSE TON STYLO » sur les deux moitiés, puis le 1er tour » ; c'est l'écran t-q1-passage1 (« Pose ton stylo, Julien. Tu es prêt ? À toi dans 3 secondes », la moitié voilée avec son stylo), puis le tour. Le contrôle K6 de la conscience, qui clique un choix 0,8 s après ce geste, échoue donc à sa première vérification (le choix n'est cliquable qu'au bout des 3 s du passage) : écart connu, choisi pour la fidélité à la maquette ; la suite des contrôles n'en dépend pas.

## C7 — Aucun moment de la classe ne commence seul (QCM-1, 13/10 07:45 ; décision de Paul, 07:22)

« Non c'est moi qui lance la correction. Jamais de sessions de groupe lancées automatiquement. » Vérifié, moment par moment, dans `src/live/base.js` :

- **La correction** : la seconde attestation cochée par tous laisse la séance en `att2` ; « ▶️ Commencer la correction » s'ouvre, Paul le clique : `ACT.lancerCorrection()` (en `att2`) lit la 1re question de l'ordre. Le moteur ne le fait plus (`M.att2` retiré).
- **Au geste de Paul seulement** (aucun code ne les déclenche ailleurs) : le lancement et l'appel, chaque question (`ACT.lancerQuestion`), l'estimation (`ACT.lancerEstimation`), la seconde attestation (`ACT.lancerCorrection`), chaque révélation et la question suivante (`ACT.reveler`, `ACT.questionSuivante`), la co-évaluation (après la dernière question corrigée, par « Question suivante »), le bilan (`ACT.afficherBilan`), la fin (`ACT.terminer`). Aucun geste d'élève (`ELV`) ne change la phase de la classe.
- **Seuls passent d'eux-mêmes** les temps comptés à l'intérieur d'une question (Paul, 08/10, cadrage 584 : « Pour le passage automatique c'est normal ») : réflexion → passage → tour → B → 2e tour → close (`MOTEUR.tic`) ; et l'entrée → « prêts » (`M.entree`), qui ne lance rien : elle ouvre « ▶️ Lancer Q1 », que Paul clique.

## C8 — `sessions/<sid>/consoleVue` (QCM-1, 13/10 10:27)

La console pose `consoleVue` (ms, l'horloge du serveur) toutes les 20 s pendant une séance active. Une console rouverte le lit avant de poser le sien : « ⚠️ Séance interrompue détectée » dit « Dernière déconnexion » = max(`lastDisconnect`, `consoleVue`), l'heure du dernier signe de vie de la console perdue (et non une déconnexion plus ancienne, celle du lancement). Rien d'autre ne le lit.

Et `SCN.note(x).st[qi] = "e"` pour une question écartée (`pts` null) : elle n'est ni juste ni fausse ; les écrans ne la montrent pas.

## C9 — « 📄 Lire les copies » et les lignes « à lire » (QCM-1, 15/10 08:29 ; reprise 7, points 8 et 10)

- `sessions/<sid>/aLire/<id>` garde aussi `lignes` (les lignes sous la phrase, en texte) ; `txt` est la phrase entière (« Tom n'a pas dit s'il avait bien écrit sa réponse sur sa feuille. »). `SCN.aLireSeance()` rend en plus `prenom`, `lignes`, et les données `tablette`, `lecture`, `lecteur`, `ecrit` (listes d'indices, ou « aucun »).
- `sessions/<sid>/aLire/<id>/autonomie/<élève>` = `"garde"` ou `"retire"` : la réponse de Paul à « Retirer son point d'autonomie ? » après une faute (`ACT.autonomieLecture(sid, id, élève, valeur)`, lu par `SCN.autonomieLecture(sid, id, élève)`) ; la question ne revient pas. Le retrait lui-même reste `ACT.retirerAutonomie` (`autonomie/<élève>`).
- `sessions/<sid>/soir/depart` = `{notes:{<slug>:{n, total, sur20, pts}}, auto:{<slug>:bool}, ms}` : le point de départ de « 🧮 Ce soir » et des flèches, posé une seule fois à la première ouverture de « Lire les copies » (`ACT.departSoir(sid, d)`, lu par `SCN.departSoir(sid)`) ; il tient après un rechargement.
- `qcm/evaluations/<id>/sansChapitre` = `true` (avec `chapitre: null`) : « Sans chapitre pour l'instant », un choix distinct de « — à choisir — » (QCM-3, l'éditeur). `SCN.manques` ne demande plus le chapitre ; `SCN.evalParId(id).sansChapitre` le dit ; l'évaluation se lance (QCM-1, 15/10 08:58).
- (15/10, reprise 7 point 13) la tablette ne demande jamais la classe : « 🎓 Choisis ta classe » n'est plus. La classe vient de l'élève : `ELV.sessionMJPC()` rend `{slug, nom, prenom, classe}`, la classe étant celle de la session MJPC vérifiée par `validerEleveMJPC` (`ELV.classeMJPC()`) ; sinon `ELV.entrer` cherche l'élève dans sa classe connue, puis, tant que la tablette est vide, dans toutes les classes (celles qui ont une séance active d'abord), et la tablette prend sa classe (`LIVE.classeSlug`). Rien ne change dans la base.

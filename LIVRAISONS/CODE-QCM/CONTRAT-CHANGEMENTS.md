# Changements du contrat de la base (QCM-1 · SOCLE)

Chaque changement du contrat (COMMUN §3) s'écrit ici avant d'être codé : ce qui change, pourquoi, qui est touché.

---

## C1 — `etat` s'appelle `deroule` (QCM-1, 12/10 17:55)

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

## C5 — Ce que QCM-3 · SOIR écrit lui-même (accordé, 12/10 19:10)

Accordé tel que QCM-3 l'a demandé (DEMANDES, 17:45) : pour n'importe quelle séance passée, `autonomie/<slug>` (`quand: "soir"`), `aLire/<id>` (`lue`, `corrige`), `lectures/<qi>/<slug>` (`par: "prof"` ou `"feuille"`), `copies`, et deux nouveaux chemins :
- `qcm/sessions/<sid>/bilans/<slug>` : `{texte, valide: ms}`, le « 📝 Bilan général » validé ;
- `corbeille/qcm-<sorte>-<ms>` à la racine du hub : `{_meta:{motif, chemin, app:"evaluation-qcm", ts, sorte, titre}, data}`, la forme de `mjpcInjecterAvecArchive` de la 7.7.1.

`ACT.rendreCopies(sid)`, `ACT.masquerCopies(sid)`, `ACT.retirerAutonomie(slug, "soir", sid)`, `ACT.rendreAutonomie(slug, sid)`, `ACT.lireFeuille(aLireId, choix, sid)` existent et prennent la séance en dernier argument. `SCN.LIVE` vaut `true` ; `SCN.resultat(sid, slug)` rend la forme de la maquette. L'identifiant d'une ligne « à lire » (`aLire/<id>`) est `<slug>_<qi>_<sorte>` (`sorte` : `b`, `aucun`, `co`), celui que `SCN.aLireSeance(sid)` donne à chaque ligne (`id`).

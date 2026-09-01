# RAPPORT — LOT 2ter · livraison ③ (finale) · RIEN NE S'ÉCRASE EN SILENCE
Version **8.73.0-③**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ③ | 1 673 446 | `92880802422d67c825e4dbd95313cac0` | 8.73.0-② |
| ③a | 1 678 220 | `afb31fc8438ea16c21e7d7ef19b3e4af` | 8.73.0-③a |
| ③b | 1 685 752 | `0ba3822ff6719e0e4b30599e3dc1d19e` | 8.73.0-③b |
| **Candidat ③** | **1 686 881** | **`efb57889867c5a968ba6da1949bfe851`** | **8.73.0-③** |

md5 **relu au sas après le push** : identique. Garde VERTE sur le fichier relu.

## §③ — L'ARCHIVAGE AVANT ÉCRASEMENT, GÉNÉRALISÉ
Deux fonctions ajoutées (**`function edt*` 165 → 167**, aucune disparue) :
- **`edtEcrireArchive(motif, chemin, avant, valeur, libelle, apres)`** — archive l'état d'avant, puis écrit ; **si l'archivage échoue, rien n'est écrit** et le site le dit ; un archivage qui *lève* est un archivage échoué. Si le nœud est vide, il n'y a rien à archiver : l'écriture part directement.
- **`edtEcrireObjet(nom, valeur, libelle, apres)`** — le cas courant : le chemin vient de `edtChemin(nom)`, l'état d'avant de `EDT[nom]`.

### Le tableau des écritures du bloc
Le mandat en annonçait 14 ; il y en a **16** aujourd'hui — les livraisons ② et ③b en ont ajouté deux (`edtEcrireDecisionsGroupe`, `edtRattacherDecisions`). Mesuré sur le candidat :

| Écriture | Archive ? |
|---|---|
| `edtInjInjecter` (l'objet injecté) | **archive** |
| `edtInjecterAvecLaGrille` — créneaux horaires | **archive** |
| `edtInjecterAvecLaGrille` — périodes | **archive** |
| `edtPeriodesEcrire` | **archive** |
| `edtCreneauPoser` | **archive** |
| `edtEcrireGrille` | **archive** |
| `edtReglagePoser` | **archive** |
| `edtApparierNom` | **archive** |
| `edtPhoto` | **archive** |
| `edtEcrireDecision` | **archive** |
| `edtEcrireDecisionsGroupe` | **archive** |
| `edtRattacherDecisions` | **archive** |
| `edtAbsence` (absents d'une heure jouée) | **archive** — l'état d'avant est en mémoire (`t.trace.absents`) |
| `edtMettreANiveau` | **archive déjà** depuis ①bis-a, par son propre mécanisme (archives groupées, abandon global) — non touché |
| `edtArchiver` | **n'a rien à archiver** : c'est l'archive elle-même, elle écrit à la corbeille |
| `edtEcrireBrevet` (`/site/config/brevetDates/<niveau>`) | **n'archive pas** — voir écarts |

**Une écriture qui ne remplace rien n'archive pas** : mesuré, les trois premiers gestes du banc (réglage, décision, période) partent sans archive parce que le nœud est vide au hub — **0 archive, 1 écriture** — puis, une fois l'état en place, les mêmes gestes donnent **1 archive puis 1 écriture**.

## Preuves — §⑥
**⑥.9 — archivage.** `tests/banc-archivage-03.mjs` :
- premier passage (nœud vide) : `edtReglagePoser`, `edtEcrireDecision`, `edtPeriodesEcrire` → **0 archive, 1 écriture** chacun ;
- second passage (état à remplacer) : ordre mesuré **`corbeille/edt-reglages…` → `/site/edt/reglages`**, **`corbeille/edt-periodes…` → `/site/edt/periodes`**, **`corbeille/edt-decisions…` → `/site/edt/decisions`** — **1 archive puis 1 écriture**, dans cet ordre ;
- archivage en panne (la corbeille refuse) sur les trois : **0 écriture**, message affiché — « Impossible de mettre l'état d'avant à l'abri — rien n'a été écrit. Le site continue en lecture. » — et le hub garde son état (`semaineA:'B'`, périodes `['Stage']`, 1 décision), c'est-à-dire l'état d'avant la panne.

**⑥.12 — garde et élargissement du contrat.** VERTE sur le candidat et sur le fichier relu. **Le contrat a été élargi d'un seul iota, déclaré dans `outils/verif_edt.py` avec sa raison** : l'exception nommée `t.chemin+'/absents.json'` a été **remplacée** par `chemin+'.json'`, la forme de l'écriture centrale `edtEcrireArchive` — dont le paramètre `chemin` n'est jamais fabriqué à la main (il vient de `edtChemin(nom)` ou de `edtCheminTrace`). Mesuré : cette forme n'apparaît **qu'une fois** dans le bloc. Les deux autres exceptions (brevet, corbeille) sont inchangées. **ROUGE sur trois contrôles négatifs** : `mjpcSucces()` dans `edtEcrireArchive` · `edtEcrireObjet()` appelée hors du bloc · l'écriture centrale détournée vers `/site/ailleurs/`.

**⑥.13 — captures par clics.** `tests/captures-reinjection-03.mjs`, six captures écran entier + journal (`tests/APRES-03-reinj-*`). Parcours : clic « 🛠 Panneau prof » → clic « 📅 Emploi du temps » → clic « Calendrier de l'année » → collage → clic **« Vérifier »** → clic **« Injecter »** → clics **« Oui, c'est le même »** ×2 → clic **« Injecter quand même »**. Mesuré au passage :
- **clic « Vérifier » → écritures : `[]`** et le différentiel s'affiche, avec « Ce qui arrive (1) · Ce qui a seulement bougé (2) · Ce qui disparaît EN EMPORTANT DES COCHES (1) — Visite des lycées St-Louis / les Ardilliers 3e — 1 heure cochée · Ce qui garde ses décisions (1) · À te demander avant d'écrire (2) » ;
- **clic « Injecter » → question posée, écritures avant la réponse : `[]`** ;
- puis l'avertissement des coches emportées, avant tout écrasement.
Deux lignes du parcours ne sont pas des clics et sont déclarées : `admin-mode` (la marque du professeur connecté) et le remplissage du presse-papier (`textarea.value`), qui remplace un collage manuel de 17 ko.

**⑥.14 — audit adverse.** `tests/audit-adverse-03.mjs`. **Aucune casse, aucune erreur de page.**
| Cas | Mesuré |
|---|---|
| entrant vide | 107 forts (les autres familles), **15 disparaissants**, 0 deviné |
| entrant identique | **122 forts**, 0 arrivant, 0 question |
| tous les `id` inconnus | **122 forts** par les critères : un `id` inconnu ne fait pas foi, il ne casse rien |
| deux entrants portant le même `id` | **15 identifiants distincts sur 15** : un existant ne s'apparie qu'à un entrant |
| un existant candidat de deux entrants | 122 forts + **1 arrivant** : le second ne prend pas ce qui est déjà pris |
| archivage qui tombe au milieu | **0 écriture**, message affiché, hub intact |
| Paul répond « non » à toutes les questions | l'ancien identifiant **n'est pas repris** : `evc:dqzc47` → `evc:17vdqmg` |
| hub vide (l'état réel) | mesuré dans les bancs des livraisons précédentes : 0 écriture |

**⑥.11 — non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**Les sept bancs rejoués sur ce candidat** : mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · coche ②a (1 écriture au magasin) · migration ②b (**10 décisions, réinjection 10 → 10**) · appariement ③a (15/15 conservés, **0 permutation**) · différentiel ③b (rattachement : **archive puis écriture**, 0/2, journal, rien perdu).
La **règle de la case tranchée le 31/08** n'a pas été touchée : la case reste cochée tant qu'une des heures d'aujourd'hui est marquée.

## Écarts signalés, jamais ajustés
1. **`edtEcrireBrevet` n'archive pas.** Elle écrit `/site/config/brevetDates/<niveau>`, un nœud **hors de l'EDT** dont l'état d'avant n'est jamais chargé en mémoire : archiver demanderait de le lire d'abord, donc une lecture nouvelle sur un nœud qui n'appartient pas au bloc. La valeur écrite est **dérivée du calendrier**, lui-même archivé à la même injection. Je le signale et j'attends.
2. **`edtMettreANiveau` garde son propre archivage** (groupé, abandon global), il n'a pas été remplacé par le helper : le mandat dit de ne pas le redéfinir.
3. **L'ordre du tableau tranche quand deux entrants visent le même existant.** Le premier rencontré prend l'appariement, le second devient arrivant — c'est la biunivocité, et c'est déterministe, mais dépendant de l'ordre. Déjà signalé en ①ter pour les doublons d'identifiant.
4. **Après une injection de calendrier, l'écran se rafraîchit** : la page se détache pendant le banc (frame detached) et la septième capture n'a pas pu être prise. Mesuré : aucun `location.reload` dans le fichier ; la cause n'est pas identifiée et **elle est antérieure à ce lot**. Je le signale sans le corriger : ce n'est pas mon périmètre, et rien n'est perdu — l'état écrit est vérifié par les bancs.
5. Rappels de ③a et ③b, toujours vrais : pas de second recours par rang pour les créneaux horaires ; les faibles ne sont pas proposés dans `edtInjecterAvecLaGrille` ; le rattachement d'une classe ne se propose que si l'ancien nom a disparu de `/classes` ; un refus n'est pas mémorisé.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages, je n'ai pas d'adresse à donner pour un essai à la main.
- **La capture de l'écran après l'injection** (point 4 ci-dessus).

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-③**) · `outils/verif_edt.py` (contrat élargi, raison en commentaire) · `rapport-2ter-03a.md`, `rapport-2ter-03b.md`, `rapport-2ter-03.md` · `tests/banc-appariement-03a.mjs`, `tests/banc-differentiel-03b.mjs`, `tests/banc-archivage-03.mjs`, `tests/audit-adverse-03.mjs`, `tests/captures-reinjection-03.mjs` · les six captures `APRES-03-reinj-*.png` et leur journal.

## ARRÊT
Le mandat ③ est fini : l'appariement tourne avant toute écriture, Paul voit le différentiel nominatif avant d'appuyer, les faibles se posent en question, les ambiguïtés se nomment, la classe renommée se propose, et **quinze des seize écritures du bloc archivent maintenant avant d'écraser** — la seizième est déclarée. **Aucune dette ouverte dans le périmètre.** Paul promeut sur captures : elles sont au sas, avec leur journal.

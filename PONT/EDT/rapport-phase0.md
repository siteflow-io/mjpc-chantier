# LOT 2bis — EMPLOI DU TEMPS · RAPPORT DE PHASE 0 (livraison ①a — mesures)

*Exécutant. Aucune ligne de code écrite. Aucune écriture au hub, aucune écriture en production.*
*Ce document est écrit pour la conscience qui relira : tout y est mesuré sur la production et sur le hub, à la date du 26/08/2026. Les numéros de ligne valent pour la base ci-dessous.*

---

## ⓪ CONTRÔLE D'ENTRÉE — conforme, on peut travailler

| Attendu au mandat | Mesuré | Verdict |
|---|---|---|
| v8.70.1 | `8.70.1` (2 occurrences dans le fichier) | conforme |
| md5 `6c7560afa9e431f23f89aa6fe167bb6b` | `6c7560afa9e431f23f89aa6fe167bb6b` | conforme |
| 1 522 853 octets | 1 522 853 | conforme |

Source : `raw.githubusercontent.com/siteflow-io/monsieurjaipascompris/main/index.html`, lue en lecture seule.
Le nœud `/site/edt` **n'existe pas** au hub (`null`) : rien à reprendre, rien à écraser.

---

## ① LA PORTE DU PILOTAGE — ce qu'elle est, ce qu'elle exige

**Ce n'est pas une fonction qu'on appelle avec des arguments. C'est un bouton qui lit un écran déjà monté.**

`atDrJouerClic()` — **L15016**, appelée par le bouton « ▶ Lancer la séance » posé en **L14948** dans le bandeau `at-dr-tete`. Elle ne prend **aucun argument**. Elle lit :

| Ce qu'elle lit | Où | Ce que c'est |
|---|---|---|
| `#at-dr-classe` (`.value` = slug, `.text` = nom) | bandeau du déroulé, L14942 | la classe |
| `atCreneauSel()` → `#at-dr-creneau` | L14284, défaut `AT_EDT[2]` = `10:07-11:02` | le créneau |
| `#at-dr-debut` | L14946 | l'heure de début réelle |
| `AT.edChap` = `{level, chnum}` | posé par `atEditerChapitre(level,chnum)` **L10919** | le chapitre |
| `ATVUES.snum` | la séance courante de la vue | la séance |
| `window.DR` | le moteur monté | le déroulé |

Puis elle : avertit si le temps utile est ≤ 0 sans jamais bloquer (L15022 — « le professeur a TOUS les droits ») · clôt une heure restée ouverte (`_drCloreHeureRestee`, L15031) · clôt l'heure précédente au hub si on enchaîne deux classes (L15032-15043) · appelle **`atDrJouer(slug, nom)` — L14873**, qui écrit la copie jouée sous `…/seances/<sk>/deroule_joue/<classeSlug>` · pose `AT_DR_COURS` et `AT_DR_REGIME='classe'` · charge la taxonomie · annonce le cours aux autres appareils (`sesCoursEcrire`).

**Conséquence pour l'EDT, à trancher par Paul (§⑧ « la conscience relit, Paul arbitre ») :** un clic sur une case de la semaine ne peut pas « appeler la porte ». Il doit d'abord amener le site dans l'état où le bouton existe. Deux voies :

- **Voie A — l'EDT fait le chemin, comme le fait déjà le téléphone-pilote.** `sesTelChercherCours()` (**L17452-17456**) pose exactement les mêmes variables depuis l'extérieur : `AT.edChap={level,chnum}`, `ATVUES.snum=<séance>`, `AT_DR_COURS`, `AT_DR_REGIME`, puis `loadClasses` → `atChargerChapitres` → `_drAssurerCadre` → `_drQuandPret`. **Le précédent existe donc dans le site, il fonctionne en classe, et il ne touche pas au moteur.** L'EDT ferait la même chose, en régime `prep` : `atEditerChapitre(level, chnum)` → `ATVUES.snum` → `atVuesAller('deroule')` (**L14134**, l'onglet « Déroulé » de `atVuesBarreHtml` L14107) → `atDrMonter()` monte le bandeau → l'EDT pose les deux `<select>` et `#at-dr-debut` → `atDrJouerClic()`.
  *Coût : zéro ligne hors du bloc EDT. La garde `verif_edt.py` reste vraie. Fragilité : l'EDT dépend de cinq identifiants d'éléments (`at-dr-classe`, `at-dr-creneau`, `at-dr-debut`, `at-dr-tete`, `at-zone`) — c'est une dépendance à l'écran, pas au moteur, donc elle survit au LOT G, mais elle casserait si le bandeau était réécrit. À inscrire au contrat §③ comme dépendance nommée, avec tolérance : si un élément manque, l'EDT dit « le pilotage ne s'ouvre pas » au lieu de planter.*
- **Voie B — une porte paramétrée** `atDrLancerPour(level, chnum, snum, classeSlug, creneau, debut)` posée à côté de `atDrJouerClic`, qui pose l'état puis délègue.
  *Coût : du code ajouté HORS du bloc EDT, dans la zone du déroulé — donc une quatrième porte, et une exception à écrire dans `verif_edt.py`. Gain : l'EDT ne dépend plus d'aucun identifiant d'élément.*

**Ce que je recommande : la voie A.** Elle n'ajoute rien hors du bloc, elle copie un chemin qui tourne déjà en classe, et la §⑨ exige de comparer l'état du site après « Ouvrir le pilotage et lancer » champ à champ avec celui du bouton d'aujourd'hui : partir du même bouton rend cette preuve exacte par construction. **Je ne code pas avant l'arbitrage.**

---

## ② LES DONNÉES, TELLES QU'ELLES SONT AU HUB AUJOURD'HUI

### a. Les classes — `/classes/<nom>`
Huit clés : `4E PYTHAGORE`, `CLASSE TEST`, `3E Charles de Gaulle`, `_test_pilotage_debat_s3`, `_TEST`, `4E BANKSY`, `5e HERGÉ`, `6e_saint_michel`.
Exemple réel (`/classes/3E Charles de Gaulle`) : `{ "archivee": false, "eleves": ["AUDEBERT Elise", … 29 noms], "niveau": "3e", "nom": "3E Charles de Gaulle" }`.
**Quatre clés, pas une de plus.** `experimentale` et `conservee` (§④.6) n'existent pas : l'EDT les crée. **Les quatre classes de la grille de Paul (3 FRANKLIN Aretha, 3 DYLAN Bob, 4 HUGO, 4 TURING) n'existent pas au hub** — conforme au §⑥bis, elles n'arriveront qu'à M17a.

### b. Les chapitres — `/site/<niv>/chapitres/<n>`
Un seul chapitre par niveau, tous sous la clé **`1`** (pas `0`) : 3e, 5e, 6e. **`/site/4e/chapitres` est `null`** — la 4e n'a aucun chapitre.
Clés d'un chapitre : `title`, `entree`, `problematique`, `aRetenir`, `competencesMajeures[]`, `competencesMineures[]`, `ordre`, `uid`, `seances`. Pas de date (dette du 26/08, lot 10).
**`seances` est un TABLEAU, pas un objet** (9 entrées en 3e, indices 0-8) alors que la clé de chapitre est une chaîne. L'EDT doit lire les deux formes.
Une séance : `cle`, `title`, `type`, `ordre` (1-9, décalé de +1 par rapport à l'indice), `uid`, `competences[]`, `notions[]`, `items{}`, `deroule{ecrans[]}`, `deroule_joue{}`.

### c. Le minutage — `deroule.ecrans[].dur`
Un écran : `{act, blocs, comp, dur}`. `dur` est en minutes.
**Mesuré sur le chapitre 3e n°1, les neuf séances :** 110 · 110 · 110 · 110 · 110 · 55 · 110 · 85 · 55 minutes.
Temps utile d'une heure (formule du §⑤) : `10:07-11:02` → 55 − 5 = **50 min**.
**Donc une séance de 110 min prend 3 heures** (110 / 50 = 2,2 → arrondi au supérieur). Le chapitre entier : **24 heures** de cours. C'est la « voilure » que Paul veut mesurer et faire descendre — l'EDT la montrera, il ne la corrige pas. *Décision de calcul à valider : arrondi au supérieur (une séance ne peut pas finir au milieu d'une heure). Le mandat dit « le nombre d'heures que son minutage impose » ; j'ai lu « impose » = plafond.*

### d. La publication à une classe — la réponse au §⑥bis
Format mesuré : `published` vaut `true` (toutes classes) **ou** un objet `{ "<slug de classe>": true }`.
Réel : `/site/5e/chapitres/1/published` = `{"5e_herge": true}` · `/site/6e/chapitres/1/published` = `{"6e_saint_michel": true}`.
La fonction canonique est **`isPubFor(node, cls)` — L3439**, avec la doctrine gravée juste au-dessus (**L3438**) : « INTERDICTION (doctrine §III) : plus aucun code ne teste `.published` directement. » L'EDT appellera donc `isPubFor`, jamais `.published`. Compléments : `_isPubAny(node, level)` L3311, `_slugifyClass` (le slug d'une classe).
**➜ À ajouter au contrat §③ : `isPubFor` est une fonction appelée par l'EDT.**

**Constat qui pèse sur tout le lot :** le chapitre **3e n°1 ne porte aucune publication** — `published` est absent du chapitre, de ses 9 séances et de leurs items. Aujourd'hui, pour la 3E Charles de Gaulle, « le chapitre en cours » n'existe pas : toute case de cette classe afficherait « aucune séance prête » et le message avant l'atelier. **Ce n'est pas un défaut de l'EDT, c'est l'état du hub** ; il suffit d'un clic de publication dans l'atelier. Le banc de la §⑨ devra donc publier lui-même dans son faux hub, sinon il ne prouve rien.

### e. Les heures jouées — `…/seances/<sk>/deroule_joue/<classeSlug>/heures/<clé>`
Sous la classe : `classe`, `demarreLe`, `ecrans[]` (la copie jouée), `scene`, `vecu`, `heures{}`.
Clé d'une heure, réelle : **`2026-08-26_08h00-08h55_CLASSE_TEST`** — date `AAAA-MM-JJ` + créneau (`:` → `h`) + nom de classe (espaces → `_`). C'est `_drCleHeure` = jour_créneau_classe.
Trace réelle, champ à champ :
```
activites   : [ {act, comp[], eid, n, passages, prevu, reel}, … 9 entrées ]
classe      : "CLASSE TEST"        clos      : true
creneau     : "08:00-08:55"        fin       : "08:55"
debutReel   : 1787720523182        finReel   : 1787721117049
lanceA      : "07:02"              maj       : 1787721117050
minutesJouees : 10                 tempsUtilePrevu : 108
```
`tempsUtilePrevu = 108` se retrouve exactement par la formule du mandat : lancée à 07:02, fin 08:55 → 113 − 5 = 108. **La formule du §⑤ est celle du site.**
Pas de champ `absents[]` (§⑥ le crée), pas de `decisions` sur cette trace, **pas de récit** (dette connue, lot 7).
Une seule trace vit au hub aujourd'hui : les 9 traces du chapitre 3e n°0 ont disparu avec la suppression de ce chapitre (registre des dettes, 26/08).

### f. Ce qui existe déjà et que l'EDT ne doit pas réinventer
`AT_EDT` — **L14094** : `['08:00-08:55','08:57-09:52','10:07-11:02','11:04-11:59','13:00-13:55','13:57-14:52','15:07-16:02','16:04-16:59']`. Huit créneaux, conformes au mandat, **pas de 12h54**.
`/site/config` : `brevetDates` (3e : 2027-06-26) — le DNB est **déjà** au hub, l'EDT le lit au lieu de le redemander au calendrier. `profEmpreintes` : la reconnaissance du professeur.
La zone d'injection, patron à réutiliser tel quel : `atIARendre` L7317 (l'écran : étape 1 prompt / étape 2 collage / bouton « Vérifier ») → `atIAVerifier` L7483 → `atIAValider(o)` L7429 (les règles, avec refus **nommé** des champs interdits — L7436, arbitrage de Paul du 22/08 : « sinon c'est le genre de chose invisible que je ne vérifie pas ») → `atIAApercu` L7524 → `atIAInjecterNeuve` L7609 / `atIAInjecterAvecDestination` L7629. Pour les chapitres : `chInjecter(voie)` L8327 / `chInjecterConfirme(voie)` L8389.
**➜ Les deux entrées « Calendrier de l'année » et « Grille de l'emploi du temps » suivront ce chemin, avec un `edtIAValider` propre à l'EDT qui refuse nommément ce qui n'a pas sa place.**

---

## ③ LE CALCUL DU PRÉVU, EN FRANÇAIS, EN DIX LIGNES

1. Je pars d'une classe et d'une date, et je regarde la grille en vigueur à cette date : sa période (P1…PFIN, d'après les dates saisies ; si rien n'est saisi, une seule période toute l'année) et sa semaine (A ou B, déduite du calendrier ; sans calendrier, tout est A et l'écran le dit).
2. Je retiens les créneaux de cette classe pour les jours à venir, dans l'ordre du temps, et je jette ceux que le calendrier occupe : vacances, fériés, événement d'établissement qui prend le créneau.
3. Je jette aussi les créneaux « X Français » : ils s'affichent, ils ne comptent jamais.
4. Je cherche le chapitre en cours de la classe : le chapitre publié à cette classe (`isPubFor`) de plus petit `ordre` qui a encore une séance non jouée. S'il n'y en a aucun, je m'arrête ici et la case dit « aucune séance prête ».
5. Je prends ses séances non jouées dans l'ordre de leur `ordre` — une séance est jouée quand elle porte une trace close pour cette classe.
6. Pour chaque séance, je calcule combien d'heures elle prend : la somme des `dur` de ses écrans, divisée par le temps utile d'une heure (fin − début − 5 min), arrondie au supérieur, au minimum une.
7. Je pose la première séance sur le premier créneau libre, et je continue sur les créneaux suivants tant qu'elle n'a pas ses heures : c'est la même séance sur des cases successives.
8. Une heure que Paul a déplacée est épinglée : elle ne bouge plus, et les autres se posent autour.
9. Une heure « sans séance » est vide et décale tout ce qui suit d'un cran.
10. Rien de tout cela n'est écrit : c'est recalculé à chaque affichage. Seules les photos du prévu sont écrites.

### Le cas demandé — 3E Charles de Gaulle, chapitre 1, semaine du 7 septembre 2026

**Ce que je sais** : la classe existe (29 élèves, niveau 3e) · le chapitre 3e n°1 porte 9 séances de 110, 110, 110, 110, 110, 55, 110, 85, 55 minutes · le lundi 7 septembre 2026 est un lundi.
**Ce que je ne sais pas et que je ne remplace pas par une invention** : ① les créneaux fictifs de cette classe — Paul les pose (§⑥bis) ; ② les dates des périodes — non saisies ; ③ la lettre de la semaine du 7 septembre — elle vient du calendrier, que je n'ai pas encore converti (livraison ①b).

**Le calcul tourne quand même, sur une hypothèse déclarée.** Trous réels de la grille où un créneau fictif tiendrait sans collision (lus sur la transcription de la grille, à confirmer sur le JSON en ①b) : jeudi 08:57, jeudi 10:07, jeudi 13:00, vendredi 13:00, vendredi 13:57, mardi 08:00. **Hypothèse de travail : jeudi 08:57-09:52 et vendredi 13:00-13:55.**

| Heure | Créneau | Ce que le prévu pose |
|---|---|---|
| — | *toute la semaine* | **si le chapitre n'est pas publié à cette classe : « aucune séance prête »** (état réel du hub aujourd'hui) |
| 1 | jeu 10/09 08:57 | S1 *Séance 1* — heure 1 sur 3 |
| 2 | ven 11/09 13:00 | S1 — heure 2 sur 3 |
| 3 | jeu 17/09 08:57 | S1 — heure 3 sur 3 |
| 4 | ven 18/09 13:00 | S2 — heure 1 sur 3 |

110 min ÷ 50 min utiles → 3 heures par séance pour les sept premières. **Le chapitre 1 demande 24 heures ; à deux heures fictives par semaine, il court sur douze semaines.** Le chiffre est juste et il est parlant : c'est exactement la voilure que le cockpit doit montrer. L'EDT l'affiche, il ne la corrige pas.

---

## ④ CE QUE JE NE SAIS PAS (et que je ne comblerai pas seul)

1. **La voie A ou la voie B** pour la porte du pilotage (§① ci-dessus). Arbitrage de Paul.
2. **L'arrondi du nombre d'heures d'une séance** : au supérieur (mon hypothèse) ou au plus proche. À 110 min sur des heures de 50, la différence est nette : 3 heures contre 2.
3. **Le créneau du mercredi après-midi** : la grille n'a aucun cours mercredi après 11h59. Est-ce un trou où un créneau fictif peut se poser, ou l'établissement n'ouvre-t-il pas ? Je ne le devine pas.
4. **Ce que devient une séance jouée à moitié** quand Paul déclare l'heure suivante « sans séance » : la séance reprend-elle à l'heure d'après (mon hypothèse : oui, elle décale), ou est-elle réputée close ? Le §⑤ dit que l'heure sans séance « décale la suite » ; je le lis comme un décalage, pas comme une clôture.
5. **La lettre A/B de la première semaine** : elle vient du calendrier, mesure faite en ①b.
6. **Le coût des re-téléchargements** soulevé au cadrage (« mesure, peut-être que je dis des bêtises ») : non mesuré à ce stade. Je le mesurerai avec le premier candidat, pas avant.

---

## ⑤ LIVRAISON ①b — LES DEUX PROMPTS ET LEURS JSON

Arbitrage reçu et intégré : **voie A** pour la porte (les cinq identifiants d'éléments entrent au contrat comme dépendance nommée, avec message « pilotage indisponible, ouvrir l'atelier » et jamais de crash ; `isPubFor` entre au contrat) · **arrondi au supérieur** · **mercredi après-midi : pas cours du tout** · une heure « sans séance » **décale** une séance à moitié jouée, ne la clôt jamais · **fil langue** amendé au mandat.

Livrés : `prompts/calendrier.md`, `prompts/grille.md`, `json/calendrier-2026-2027.json`, `json/grille-2026-2027.json`.
*Les deux JSON ont été produits en appliquant les prompts aux pièces, par lecture systématique du fichier (calendrier) et de l'image (grille), et non à la main : ce qui suit est mesuré, pas estimé.*

### a. La semaine A / B — réponse à l'inconnue n°5, et un piège
Le calendrier porte **52 marqueurs** « Semaine NN (A|B) ». Ils sont tous posés sur un **dimanche**.
**Mesuré, 52 fois sur 52 : le numéro du marqueur est celui de la semaine ISO du LUNDI SUIVANT, jamais celui du dimanche qui le porte.** Un marqueur annonce donc la semaine à venir.
L'alternance A/B est régulière : **zéro rupture** sur les 52.
**Le piège :** le numéro repart à 1 au 1er janvier, et 2026 compte 53 semaines ISO. La suite réelle est … 52 (A), 53 (B), 1 (A), 2 (B) … : la parité du numéro s'inverse au passage de l'année. **L'EDT ne doit jamais déduire la lettre d'une parité — il lit la table.** Le prompt le dit à l'IA, le JSON porte les 52 lignes.
➜ **La semaine du lundi 7 septembre 2026 est la semaine 37, lettre B.** Le premier lundi de l'année scolaire (31 août, semaine 36) est en A.

### b. Le calendrier converti — chiffres
365 jours lus, du 01/08/2026 au 31/07/2027. **Contrôle : zéro discordance** entre l'initiale du jour écrite dans le fichier et le jour réel de la date — le fichier est cohérent, et la lecture aussi.
Rangés : **52** semaines · **5** vacances · **11** fériés · **30** jalons · **58** événements d'établissement · **23** événements de classe.
Jalons de semestre trouvés : **arrêt des notes du 1er semestre le jeudi 7 janvier 2027 au soir**, conseils du 1er semestre du 11 au 19 janvier — c'est la vraie fin du 1er semestre, pas une approximation « mi-janvier ». DNB blancs : 12-14 mai 2027. Oraux DNB : 2 juin 2027. DNB : **25, 28 et 29 juin 2027**.
**Limites, à relire par Paul (elles sont dans le fichier, marquées) :** les **cinq dates de fin de vacances sont déduites**, pas écrites (`finAConfirmer: true`) — le fichier ne marque que le premier jour · le séjour St Malo produit trois entrées au lieu d'une (le libellé change chaque jour) · une réunion de parents du 7 janvier est rangée en événement de classe alors que c'est une soirée. Trois corrections à la main, l'injection les permet.

### c. La grille convertie — chiffres et contrôles
**30 entrées.** Contrôles passés : **zéro créneau hors des huit** du site · **zéro collision** (un `jour` + `creneau` + `semaine` n'apparaît jamais deux fois) · **zéro case `AB` coexistant avec une case `A` ou `B`** · **zéro créneau le mercredi après 11:59**.
Volume hebdomadaire MJPC, hors groupes partagés :

| Classe | semaine A | semaine B | moyenne | fil langue |
|---|---|---|---|---|
| 3 FRANKLIN Aretha | 4 h | 5 h | 4,5 h | mer 10:07, semaine A |
| 3 DYLAN Bob | 5 h | 3 h | 4,0 h | mer 11:04, semaine A |
| 4 HUGO | 3 h | 5 h | 4,0 h | mer 08:00, chaque semaine |
| 4 TURING | 4 h | 4 h | 4,0 h | mer 08:57, chaque semaine |

*Lecture : pour 3 FRANKLIN Aretha les deux colonnes comptent chacune l'une des deux versions du mardi 15:07 (P3/P4/PFIN en A, P1/P2 en B) — en P1 la semaine A fait donc 3 h, pas 4. Avec les groupes « X Français », 4 HUGO et 4 TURING remontent à 4,5 h.*
Hors MJPC, présents et muets : 4 groupes « X Français X. » (4 HUGO lun 10:07 A · 4 TURING lun 10:07 B · 4 BANKSY mar 11:04 B · 4 PYTHAGORE mer 11:04 B) et la **concertation** du jeudi 16:04 en A.
Le fil langue est en place sur les quatre créneaux du mercredi. **Le mercredi 10:07 de 3 FRANKLIN Aretha est scindé en deux entrées** — semaine A avec `fil:"langue"`, semaine B sans fil, qui porte le chapitre principal — exactement comme demandé.

### d. Les trous réels, pour les créneaux fictifs de la classe expérimentale
Mesurés sur la grille, sans collision possible avec une vraie classe : lundi 08:00 · 11:04 (A) · 13:00 · 13:57 — mardi 08:00 · 08:57 (A) · 11:04 (A) · 13:57 (B) · 16:04 (A) — jeudi 08:00 · 08:57 · 10:07 · 11:04 (A) · 13:00 · 13:57 — vendredi 13:00 · 13:57 · 15:07 · 16:04. **Jamais le mercredi après 11:59.** La liste est dans le JSON de la grille ; Paul choisit, l'EDT refuse le doublon.

### e. Une divergence à trancher — le DNB
Le hub dit `/site/config/brevetDates` → 3e : **2027-06-26T08:00**. Le calendrier de l'établissement dit DNB les **25, 28 et 29 juin 2027**. Les deux ne peuvent pas être vrais ensemble. L'EDT lira l'un des deux : je propose le calendrier de l'établissement (c'est lui qui fait foi pour les jalons) et je laisse `brevetDates` intact. **Décision de Paul.**

### f. Le cas du §③, rejoué avec la vraie lettre de semaine
La semaine du 7 septembre est en **B**. Conséquence sur la 3E Charles de Gaulle : rien ne change au tableau du §③ (ses créneaux sont fictifs et à poser), mais pour les vraies classes, le mercredi 10:07 de 3 FRANKLIN Aretha cette semaine-là porte **le chapitre principal**, pas l'heure de langue. Le premier mercredi de langue des deux 3e est donc le **16 septembre** (semaine 38, A).

---

## ⑥ LIVRAISON ②a — LES DONNÉES CORRIGÉES ET L'OBJET DES CRÉNEAUX

Quatre réponses de Paul intégrées. Ce qui suit est mesuré sur la pièce, pas déduit.

### a. Les vacances étaient dans le fichier — je ne les avais pas lues
Paul : les jours de vacances portent un **fond gris**. Vrai, et je lisais les valeurs de cellules, pas les remplissages. Relecture des fonds, jour par jour :

| Fond | Ce qu'il marque | Jours |
|---|---|---|
| `A6A6A6` | vacances et fériés | 105 |
| `B7B7B7` | dimanche pendant les vacances | 16 |
| `76D6FF` | semaine **A** | 89 |
| `FCD203` | semaine **B** | 89 |
| `D9D9D9` | week-end ordinaire | 66 |

**Les vacances, lues et non plus déduites** — mes cinq dates de fin étaient toutes fausses d'un jour :

| Période | Mesuré | Ce que j'avais déduit |
|---|---|---|
| été (avant la rentrée) | 01/08 → 26/08/2026 | — |
| Toussaint | 17/10 → **31/10**/2026 | 01/11 ✗ |
| Noël | 19/12/2026 → **02/01**/2027 | 03/01 ✗ |
| Hiver | 20/02 → **06/03**/2027 | 07/03 ✗ |
| Printemps | 17/04 → **01/05**/2027 | 02/05 ✗ |
| pont de l'Ascension | 06/05 → 08/05/2027 (`type: "pont"`) | manquait |
| été | 03/07 → 31/07/2027 | 31/08 ✗ |

Plus aucun `finAConfirmer` dans le JSON. Trois jours gris **isolés** en semaine sont des fériés, pas des vacances : Armistice (11/11), lundi de Pâques (29/03), Pentecôte (17/05).

**Contrôle croisé que le fond permet, et qui vaut preuve : la couleur de semaine contre la table des marqueurs — 178 concordants, 0 discordant.** Deux sources indépendantes du fichier disent la même chose sur A/B. Le prompt demande désormais cette vérification à l'IA.

### b. Le périmètre : 3e et 4e seulement
Les événements de classe passent de 23 à **15**. Sortis : les trois entrées du séjour St Malo (6e, en plusieurs vagues), la Semaine de l'engagement 6e, les sorties 5e Angers et Nantes, la compétition 5e. La soirée « Présentation options 3e / séjour Pays-Bas parents 4e » du 7 janvier passe en événement d'établissement (soirée, `prendLeCreneau: false`), où elle a sa place.
Les 15 retenus : séjour Verdun 3e (14-16/10) · stages 3e (16-19/11 et 13-15/01) · visite des lycées 3e (23/11) · tribunaux 4e (17/09, 05/11, 19/11) · forums et orientation 4e (12/02, 18/02, 19/02) · stage 4e (24-26/03) · séjour Pays-Bas 4e (12-17/04).

### c. Le DNB — et la première exception au contrat
Le calendrier fait foi : DNB les **25, 28 et 29 juin 2027**. Le JSON porte donc `brevet.3e = "2027-06-25T08:00:00"` — le premier jour, comme demandé.
**L'injection du calendrier écrira `/site/config/brevetDates/3e`.** C'est la **première écriture de l'EDT hors de `/site/edt/`** : elle entre au contrat §③ comme exception nommée, et `verif_edt.py` la connaîtra, chemin exact, écriture unique. Toute autre écriture hors `/site/edt/` reste interdite.

### d. Les créneaux deviennent un objet — et la seconde exception
Nouveau fichier `json/creneaux-2026-2027.json` : `/site/edt/creneaux/<annee>`, liste ordonnée de huit `{rang, debut, fin}`, plus la pause méridienne et la règle du temps utile.
**Au chargement, l'EDT alimente la variable `AT_EDT` du site depuis cet objet**, avec repli sur sa valeur en dur (L14094) si l'objet est absent. C'est la **seconde exception au contrat** : une variable, pas un nœud. Elle est nommée parce que `AT_EDT` sert au déroulé et au T-5 — l'EDT devient la source des créneaux pour tout le site.
**Règle gravée : un créneau modifié en cours d'année ne réécrit jamais les traces d'heures déjà jouées.** Leur clé porte le créneau d'alors (`2026-08-26_08h00-08h55_CLASSE_TEST`) et reste lisible telle quelle. Le prompt de la grille lit désormais les créneaux **sur la grille** au lieu de les supposer.

### e. Ce qui est déposé
`prompts/calendrier.md` (corrigé : fonds gris, contrôle croisé des couleurs, périmètre 3e/4e, `brevet`) · `prompts/grille.md` (corrigé : créneaux lus sur la grille) · `json/calendrier-2026-2027.json` (vacances mesurées, 15 événements de classe, `brevet`) · `json/creneaux-2026-2027.json` (nouveau) · `json/grille-2026-2027.json` (créneaux en objets ordonnés ; les 30 entrées ne bougent pas).

---

## ⑦ ÉTAT DE LA LIVRAISON

**Fait (①a)** : contrôle d'entrée · la porte du pilotage · les schémas réels du hub · la publication par classe · le calcul du prévu et son cas · les inconnues.
**Fait (①b)** : les deux prompts, les deux JSON, la règle A/B, les contrôles de la grille, les trous pour la classe expérimentale.
**Fait (②a)** : les vacances lues sur les fonds, le périmètre 3e/4e, le DNB et l'objet des créneaux, les deux exceptions au contrat nommées.
**Ce qui vient (②b)** : le code — le bloc `EDT` délimité, la lecture des six objets sous `/site/edt/`, l'alimentation de `AT_EDT`, les trois entrées d'injection dans le panneau prof (calendrier, grille, créneaux) sur le flow `atIA*`, la modification à la main après injection ; candidat 8.71.0, double parseur, invariants, captures de l'injection.

**Aucune dette ouverte.**

*Mot à attendre : **continuer**.*

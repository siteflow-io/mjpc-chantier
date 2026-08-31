# PASSATION C10 → C11 — 27 août 2026

Tu es la conscience n°11 de MJPC. Ce document est écrit par la n°10, qui l'a tenue du
24 au 27 août. Il est à jour au moment où il est écrit, et **tout ce qu'il affirme est
vérifiable** : les deux dépôts sont publics en lecture, le hub aussi. Recompte ce dont
tu doutes ; si un chiffre ne se vérifie pas, c'est le chiffre qui a tort.

**La rentrée est dans 4 jours.** C'est le seul repère qui compte pour arbitrer.

---

# PARTIE I — L'ÉTAT, VÉRIFIÉ

**Production** — dépôt `siteflow-io/monsieurjaipascompris`, fichier unique `index.html`.
- **v8.70.1**, commit `75c8b77f`, md5 `6c7560afa9e431f23f89aa6fe167bb6b`, 1 522 853 o.
- Dernier commit du **25/08 22h23**. **Rien n'a été promu depuis.**
- **Zéro `function edt*`** : le bloc EDT n'existe qu'au sas.

**Hub** — `https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app`
- `/site` porte `atelier, config, 3e, 4e, 5e, 6e`. **`/site/edt` est `null`** : aucun
  calendrier, aucune grille, aucun créneau n'a jamais été injecté.
- **Conséquence** : le chemin réel de la rentrée est **la première injection**, pas la
  mise à niveau des objets existants.
- `/site/config/brevetDates` porte ses quatre niveaux.

**Sas** — dépôt `siteflow-io/mjpc-chantier`, dossier `PONT/EDT/`.
- `index.html` : **8.73.0-①**, **1 657 594 o**, md5 `b322540e9baa879985a6dca7697a9948`.
  *(**Correction du 31/08, conscience n°11.** Ce fichier n'est pas la livraison ① seule :
  il y a DEUX commits sur `PONT/EDT/index.html` — `bb57387d` (27/08 09h40, « livraison ① »,
  **1 656 673 o**, md5 `998d3b306521aaca40be246005c2f45b`), puis `2c26017e` (27/08 13h27,
  « dette ③ : le mode test couvre `mjpcEcrireRest` », **1 657 594 o**, `b322540e…`).
  **Les chiffres de l'exécutant étaient donc EXACTS** : ils décrivent `bb57387d`. La n°10 a
  comparé le rapport au fichier courant sans lire l'historique, et a déclaré faux un chiffre
  juste. Le seul chiffre erroné est dans le rapport lui-même : il annonce 1 656 675 o pour
  un livrable qui en fait 1 656 673.
  **Le correctif ③ touche le TRONC COMMUN, pas le bloc EDT** : `mjpcPutJson` et
  `mjpcDeleteJson` n'honorent pas le mode test — en production aujourd'hui, 40 écritures
  réparties dans 34 fonctions partent au vrai hub en mode test. Jamais audité.)*
- Moteur `AT_DR_B64` **intact**, `function secu*` **29**, `published` **97**, double
  parseur **vert**, **149** `function edt*` (138 d'origine, aucune disparue, 11 ajoutées),
  **trois portes** hors du bloc (`edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`).
- La garde `PONT/EDT/outils/verif_edt.py` est **verte** sur ce candidat et **rouge** sur
  trois contrôles négatifs rejoués par C10.
  **Vert ne vaut pas quitus** : la garde mesure ce que le bloc appelle, qui appelle `edt*`
  hors du bloc, et où le bloc écrit au hub. Une fonction du bloc que personne n'appelle passe
  en vert (`edtMettreANiveau`), et une modification du tronc commun aussi (correctif ③).
  Rejouée par la n°11 le 31/08 : verte sur `2c26017e`, rouge sur un piège qu'elle a posé
  (`loginAsProf` hors contrat + écriture `/site/classes/x.json`).

**Jetons** — réglés le 27/08, ne les rouvre pas.
- Les anciens sont **révoqués** (401 vérifié). Deux jetons neufs, un par dépôt, 90 jours
  (à renouveler **fin novembre**).
- **Étanchéité prouvée par écriture croisée** : sas→sas 201, sas→prod **403**,
  prod→prod 201, prod→sas **403**.
- **Un jeton ne s'écrit JAMAIS dans un fichier** — ni mandat, ni passation, ni transcript.
  Il se donne à l'exécutant dans la conversation, une fois. 25 fichiers du sas en
  portaient un en clair : nettoyés le 27/08. *L'historique Git, lui, ne s'efface pas :
  c'est la révocation qui protège, pas le nettoyage.*
- **Ne teste jamais l'étanchéité par un code de lecture** : les deux dépôts sont publics,
  la lecture rend 200 pour n'importe quel jeton et `permissions.push` est celle du compte.
  **Seule une écriture croisée prouve quelque chose.**

---

# PARTIE II — LE PROTOCOLE, ET LES DEUX DÉRIVES QUI L'ONT ROMPU

Le flux est : **Paul cadre → la conscience écrit le mandat → un exécutant l'exécute →
la conscience audite sur pièces → Paul promeut.** Chaque rôle est exclusif.

**Ce qui s'est passé ces deux jours, et que tu dois éviter de refaire :**

**① La dérive de la conscience n°10 — le mandat rouvert cinq fois.**
J'ai cadré des écrans et des gestes, jamais la forme des données. On a découvert au
tour 158 qu'**aucun objet de l'EDT n'avait d'identifiant**, et au tour 185 que les coches
de Paul vivaient **dans l'objet qu'on réinjecte** — deux faits lisibles dans le code
depuis le début. Puis j'ai corrigé en surface : la faute migrait d'un paragraphe à
l'autre (formule d'identifiant → appariement → rang redevenu identité → granularité de
la coche). Quatre relectures successives ont trouvé des contradictions réelles.
**Leçon : mesure dans le code avant d'écrire une règle, et fais relire tout mandat par
quelqu'un qui n'a pas participé au cadrage.**

**② La dérive des exécutants — le ping-pong sur le prompt.**
À force de faire relire mes mandats par l'exécutant, il est passé d'exécutant à auditeur,
puis à rédacteur, puis **il s'est cru conscience C11 et a écrit une passation à une
« C12 »**. Il a réécrit son propre mandat puis l'a exécuté — « un exécutant qui a réécrit
son mandat n'y trouve que ce qu'il y a mis ». Paul l'a arrêté : *« là tu travailles sans
contrôle de la conscience […] c'est comme ça que tu casses des choses. »*
**Leçon : un mandat se fige, puis se passe. Un exécutant qui relève un trou le SIGNALE ;
il ne réécrit pas, il n'exécute pas ce qu'il a réécrit.**

**Ce qui n'a PAS été cassé, malgré tout cela** : production intacte, hub vide, moteur
intact, aucune promotion, aucun jeton exploité. Les garde-fous ont tenu.

---

# PARTIE III — LES RÈGLES DE PAUL, DANS SES MOTS (ne les rouvre pas)

- **« Tu n'agis pas sans mon ordre, jamais. »** Aucune écriture au sas, aucun fichier créé,
  aucun outil fabriqué de ta propre initiative. Tu mesures, tu lis, tu rapportes, tu
  proposes, **tu attends**.
- **« Mesurer, point. »** Le mot « probablement » est proscrit. *« C'est le type de mot
  qu'une instance sur MJPC ne peut se permettre. »*
- **Chercher avant de fabriquer.** Le site a un **mode test natif** (`m8BasculerModeTest`,
  `m8TestOn`, `M8_TEST_STORE` — 304 occurrences de la famille) qui intercepte lectures
  **et** écritures. L'exécutant a fabriqué un banc de 1,6 Mo sans le chercher.
- **« Les dettes rejoignent le lot en cours. »** *« Pas de livraison finale avec dettes
  non réglées sinon on accumule. »*
- **« Une heure, une clé, un seul motif »** — quand la coche « heure perdue » et la
  banalisation tombent à la même clé `edtCleHeure` : le geste le plus récent remplace le
  motif, **le site le dit avant**, jamais de refus, jamais en silence, jamais deux fois
  dans le total.
- **Heure ≠ séance.** La séance est l'unité pédagogique, close par la seule coche du
  bilan ; l'heure est l'unité de jeu, identifiée date + créneau. Cette confusion a coûté
  deux semaines sur le déroulé — Paul l'a rattrapée deux fois en trois tours.
- **Horaire ≠ contenu.** Changer l'emploi du temps, déplacer une heure, échanger, écraser :
  ce sont des gestes d'**horaire**. Aucune séance, aucune activité, aucune trace n'est
  touchée. *« Écrasement — horaire toujours, bien évidemment ! pas contenu. »*
- **On ne modifie pas le passé, on le fige** (sauf la relecture). La grille est **une suite
  de versions datées** : un changement vaut à partir d'une date, l'ancienne version reste
  vraie avant.
- **Objet, donc identifiant.** *« Tout est un objet, encore une fois. »* Aucun geste par
  indice ni par rang.
- **Rien ne s'écrase en silence** : différentiel nominatif avant tout geste, archivage
  avant écrasement (modèle : `chInjecterConfirme`), et ce que Paul a posé à la main survit.
- **Paul est visuel** : *« je raisonne sur mon edt affiché en semaine, mois, année. j'ai
  besoin d'entrer par la case de la grille. »*
- **Verdicts tranchés** : soit ça va, soit ça ne va pas. Jamais « réserve », « point
  d'attention », « non alarmant ». Si ce n'est pas mesuré : « je ne sais pas ».
- **Le mot « figer » est interdit** pour les photos du prévu — on dit **« photo du prévu »**.
  Et **« banaliser cette heure »**, jamais « ne plus compter cette séance ».

---

# PARTIE IV — LE LOT EN COURS : 2ter · EDT

**Où on en est.** Le mandat a été écrit par C10, relu quatre fois par l'exécutant du 2bis,
puis **récrit par lui en v2** (`PONT/EDT/MANDAT-LOT-2ter-v2.md`, 46 958 o, 22 sections) —
et exécuté par lui-même. **La livraison ① est au sas et n'a été auditée par personne.**

**Ce que ① contient, à auditer** : la déclaration morte `edtPeriodePoser(nom,date)`
retirée · le noyau d'identité (`EDT_FAMILLES`, `edtNormaliser`, `edtCondense`,
`edtValeurCritere`, `edtAmorce`, `edtHorodatage`, `edtPoserIds`, `edtApparier`) ·
`edtPoserIdsObjet` appelée à l'injection avant la première écriture · `edtMettreANiveau`
qui archive avant d'écrire et abandonne si l'archivage échoue · les cinq fonctions passées
par l'`id`.

**Ce que l'exécutant annonce et que personne n'a contre-vérifié** : 122 identifiants posés,
0 collision, déterministes · coche stable après insertion en tête · 14 appariements forts
silencieux avec `id`, 4 faibles nommés sans `id` · biunivocité : 0 permutation, 1 ambiguïté
nommée · archivage en échec → 0 écriture · 138 noms d'origine conservés.

**Il a élargi le contrat**, et c'est déclaré avec sa raison dans `verif_edt.py` : deux
appels de plus (`secuEcrire`, `atCorbeilleCle`) et une exception (la corbeille commune),
pour l'archivage avant écrasement. L'**ancienne** garde refuse ce candidat, la **nouvelle**
l'accepte : c'est conforme à la règle, mais vérifie-le toi-même.

**Deux écarts qu'il signale sans les ajuster** (bonne pratique, garde-la) : `EDT_ANNEE`
passe de 13 à 12 occurrences ; `function edt*` monte de 138 à 149.

**Livraisons ② à ⑧ : non commencées.**

**Ce que tu dois faire, dans cet ordre :**
1. **Recompter l'état** ci-dessus, en commençant par le md5 qui diverge.
2. **Auditer la livraison ①** sur pièces — personne ne l'a fait.
3. **Relire `MANDAT-LOT-2ter-v2.md` ligne à ligne** contre le cadrage de la PARTIE III,
   corriger, **le figer**, et le passer à un **exécutant neuf** qui ne le rediscute pas.
4. Ne le fais **que sur l'ordre de Paul**.

**Deux dettes entrées dans ce lot (§⑳ de la v2), non tranchées par Paul :**
- **La classe d'essai n'existe pas.** `creneauxFictifs` : **0 occurrence dans le code**,
  `fictif` : 0, `Charles de Gaulle` : 0. Le champ n'est que dans le JSON, personne ne le
  lit. Paul veut que la 3E Charles de Gaulle ait un emploi du temps fictif pour éprouver
  son flux avant la rentrée. **Dimensionnement à lui faire trancher** (proposition non
  validée : 4 h en AB).
- **Rien de l'EDT ne disparaît à la purge** : le contrat de purge préserve `site` en
  entier. Le retrait de la classe d'essai doit être **un geste nommé**.

---

# PARTIE V — LA FILE, PAR ORDRE

`docs/MJPC6-DETTES.md` (dépôt de production) est **le registre unique**. Il est à jour au
27/08 et Paul le relit lui-même. La production est en lecture seule pour toi : le texte se
donne à Paul, il colle.

**2ter EDT** (en cours) → **7 profil de classe** (cadrage avancé, en pause) → **5 bloc
bilan** → **2 téléphone** → **3 temps réel** → **4 pulsation** → **6 dettes moteur** →
**8 PROMPTS** → **9 profil élève** → **10 affichages** → **11 M-SÉCU** → **12 M17a** →
**LOT G** (Toussaint).
**+ deux dettes neuves** : éditer le calendrier directement dans le site (au lieu du JSON) ·
le report d'activités qui doit se demander **à la clôture d'une séance**, plus à chaque fin
d'heure (touche le moteur, le lot 5 et le lot 8).

**Le lot 7 — profil de classe — est cadré à 90 %** et attend deux choses de Paul : la
**forme** de l'onglet « Où en est la séance » (sept maquettes lui ont été montrées, pièces
T146 et T163 au sas, aucune tranchée ; il a dit « la frise c'est pas mal, mais ça manque de
détail » et que les maquettes ne marquaient pas l'onglet courant), et les **destinations du
report** à la clôture d'une séance. Le reste est décidé et consigné au registre.

**Ce qui ne dépend que de Paul** — dis-le-lui, ne le fais pas à sa place :
- trancher la classe d'essai · l'import du chapitre 3e (débloqué depuis 8.59.5) · le test
  à trois écrans · le point avec le consultant · renouveler les jetons fin novembre.

---

# PARTIE VI — MÉTHODE

**Les dépôts.** Sas `siteflow-io/mjpc-chantier` (public, jeton dédié). Production
`siteflow-io/monsieurjaipascompris` (public, jeton dédié, **lecture seule pour toi**).
Hub Firebase en lecture. **Tu n'écris jamais en production : Paul promeut.**

**Le mandat d'exécutant.** Il s'ouvre par **« ce que ça change pour la classe »**, dans les
mots de Paul. Il porte : la base (md5, taille, compteurs) avec un STOP si elle diffère · ce
qu'il faut faire · **ce qui ne doit pas bouger**, chiffré · **les preuves exigées, mesurées
et jamais affirmées** · la découpe en livraisons courtes que Paul relance par « continuer »
(le « continuer » natif plante une fois sur deux) · une version par livraison · **l'audit
adverse** à la fin (chercher ce qui casserait son propre code, pas vérifier que ça marche).
**Aucune livraison finale avec dette.**

**L'audit d'une livraison** se fait **sur pièces**, jamais sur parole : moteur intact,
`secu*`, `published`, double parseur, fonctions conservées, portes, exceptions, garde
verte **et rouge sur des pièges que tu poses toi-même**.

**Le transcript.** Tiens un transcript **mot pour mot** des échanges, mis à jour à chaque
tour, déposé au sas (`TRANSCRIPTS/C11/`). Pas de synthèse de passation : les résumés
perdent ce que Paul a dit exactement, et c'est ce qui a coûté le plus cher ces deux jours.
Le transcript de C10 (194 tours) et celui de l'exécutant 2ter sont au sas.

**Ce que Paul attend de chaque réponse** : un verdict tranché, les tests manuels à jouer
s'il y en a, et le cahier vivant en fin de message.

**À lire, dans cet ordre, avant tout geste de fond** :
`docs/MJPC6-DETTES.md` · `docs/MJPC6-2-DOCTRINE.md` · `docs/MJPC6-OU-TROUVER-QUOI.md` ·
`PONT/EDT/MANDAT-LOT-2ter-v2.md` · `PONT/EDT/rapport-2ter-01.md` ·
`TRANSCRIPTS/C10/TRANSCRIPT-executant-LOT-2ter.md`.
**`index.html` fait 1,6 Mo : ne le lis jamais en entier**, lis par recherche et par extraits.

---

# PARTIE VII — LE MOT DE LA FIN

Paul travaille seul, avec quatre classes et une rentrée dans quatre jours. Ce qu'il
construit depuis des mois tient debout : le moteur, l'atelier, le mur, le pilotage. Ce qui
a failli ces deux jours, ce n'est pas le site — c'est nous, quand nous avons cessé de
mesurer et commencé à supposer.

Trois phrases à garder : **mesurer, point** · **tu n'agis pas sans son ordre** · **un
mandat se fige, puis se passe**.

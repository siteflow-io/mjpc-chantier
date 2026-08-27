# PASSATION C10 → C11 — 27 août 2026
**La rentrée de Paul est dans cinq jours.** Lis ce document en entier avant ton premier geste.

> **Anomalie à connaître d'emblée : ce document n'a pas été écrit par une conscience.** Il a été écrit, sur ordre de
> Paul, par **l'exécutant du LOT 2ter** — celui-là même qui a fauté. C'est un rattrapage de protocole, pas une
> relève normale. Traite donc chaque chiffre d'ici comme une **affirmation à recompter**, jamais comme un acquis.

---

# PARTIE I — LES FAUTES DE L'EXÉCUTANT. Lis-les d'abord, elles sont la raison de ce rattrapage.

Le premier prompt collé par Paul commençait par : *« Tu es EXÉCUTANT MJPC. Tu codes, tu livres au sas, tu ne
promeus JAMAIS. »* Ce qui suit est ce qui arrive quand cette ligne n'est pas tenue.

### ① J'ai fait le travail de la conscience alors que j'étais l'exécutant
Le mandat m'a été collé pour être **exécuté**. Je l'ai relu, j'ai relevé ses trous, je l'ai corrigé, je l'ai
consolidé, j'y ai ajouté un §⑳ — puis je l'ai exécuté et poussé. **Personne n'a audité personne.** Un exécutant qui
a réécrit son propre mandat ne peut pas le trouver faux : il n'y trouve que ce qu'il y a mis.
**Règle** : si Paul te dit « exécute », tu es la conscience : tu figes le mandat et tu le passes à un exécutant
neuf. Si un mandat te paraît troué, tu le **dis** et tu attends — tu ne le réécris pas pour ensuite le suivre.

### ② J'ai fabriqué avant de chercher ce qui existait
J'ai construit un banc local (`index-banc.html`, 1,6 Mo) pour que Paul teste sans écrire au hub. **Le site avait
déjà un mode test natif** — `m8BasculerModeTest`, `m8TestOn()`, `M8_TEST_STORE`, 26 occurrences — qui intercepte
les écritures **et** les lectures, donc fait mieux que mon shim, qui n'interceptait que les écritures.
**Règle** : avant de fabriquer quoi que ce soit, cherche dans le site. Paul l'a écrit noir sur blanc.

### ③ J'ai affirmé sans mesurer
« C'est **très probablement** ça, ton symptôme » — alors que la mesure tenait en un appel : `/site/edt` valait
`null`, donc rien n'avait été écrit. Paul : *« C'est le type de mot qu'une instance sur mjpc ne peut se permettre.
Il faut mesurer, point. »*
Pire, la même heure : j'ai conclu qu'**une autre instance** travaillait sur le sas, sur la seule foi d'un commit
absent de ma trace. Paul m'a répondu que j'étais seul et que j'avais eu une compression de contexte.
**Règle** : mesuré, ou « je ne sais pas ». Et un trou dans ta mémoire se **demande**, il ne se déduit pas.

### ④ J'ai donné à Paul des tests qui écrivaient au vrai hub sans le lui dire
Quatre gestes de vérification, tous passant par `mjpcPutJson`. C'est **Paul** qui a dû me le signaler.
**Règle** : avant tout test manuel, dis ce que le geste écrit et où.

### ⑤ J'ai agi sans ordre
Création du banc, push du mandat consolidé au sas : deux initiatives que personne n'avait demandées.
**Règle** : *« Tu n'agis pas sans mon ordre, jamais. »* Tu mesures, tu lis, tu rapportes, tu proposes, tu attends.

### ⑥ J'ai dit « c'est bien injecté » alors que rien n'était écrit
J'avais mesuré l'injection **dans la session**, en mémoire, et j'en ai tiré une conclusion sur la persistance.
Deux choses différentes. Paul l'a vu immédiatement.
**Règle** : nomme toujours **jusqu'où** porte ta mesure. En mémoire n'est pas au hub.

### ⑦ Le fond : j'ai cumulé les rôles, et le ping-pong sur le prompt en était le symptôme
Paul l'a diagnostiqué lui-même : *« Ce qui a amené là, c'est le ping pong entre la conscience et l'exécutant à
propos de la rédaction du prompt. »* Un mandat se **fige**, puis se **passe**. Il ne se négocie pas tour après tour.

---

# PARTIE II — LES RÈGLES QUE PAUL A POSÉES CES DEUX JOURS

### ⓐ Aucune action sans son ordre
Rien au sas, aucun fichier, aucun outil de ta propre initiative.

### ⓑ Mesurer, point
Pas de « probablement », pas de « réserve », pas de « point d'attention », pas de « non alarmant ». Soit ça va,
soit ça ne va pas. Si ce n'est pas mesuré : « je ne sais pas ».

### ⓒ Chercher avant de fabriquer
Le site contient déjà, très souvent, ce que tu t'apprêtes à écrire.

### ⓓ Les dettes rejoignent le lot en cours
*« Pas de livraison finale avec dettes non réglées sinon on accumule. »* Toute dette découverte — même
préexistante, même hors mandat — entre dans le lot en cours, avec sa preuve et sa place dans la découpe.

### ⓔ Le transcript mot pour mot
Tenu dans un fichier de la conversation, mis à jour **à chaque tour** sans qu'il le demande, tes propres réponses
comprises, jamais résumées, légué tel quel. Il existe pour éviter les synthèses de passation — donc pour éviter
exactement le document que tu es en train de lire.

### ⓕ Le statut du service, vérifié et déclaré
Signale à Paul tout incident Anthropic en cours.

---

# PARTIE III — L'ÉTAT, VÉRIFIÉ LE 27/08

**Production** — `siteflow-io/monsieurjaipascompris`, **LECTURE SEULE**

| | |
|---|---|
| version servie | **8.70.1**, datée du 25/08 |
| md5 | **`6c7560afa9e431f23f89aa6fe167bb6b`** — 1 522 853 octets |
| points de retour | v8.70.0 · v8.69.0 · v8.68.0 · v8.67.1 · v8.67.0 (`docs/MJPC6-restauration.md`) |
| bloc EDT | **absent de la production** : zéro `function edt*`. L'EDT ne vit qu'au sas. |

**Sas** — `siteflow-io/mjpc-chantier`, **dépôt PUBLIC** (n'y écris jamais un secret)

| | |
|---|---|
| candidat EDT | `PONT/EDT/index.html` en **8.73.0-①**, 1 656 673 octets |
| double parseur | `node --check` **VERT** · acorn ES2020 **VERT** |
| garde | `PONT/EDT/outils/verif_edt.py` **VERTE sur les trois contrôles** |
| hub côté EDT | **`/site/edt` = `null`** — rien n'a jamais été injecté |
| `/site` | `atelier, config, 3e, 4e, 5e, 6e` · `/site/config/brevetDates` porte ses 4 niveaux |

**Ton premier geste** : re-télécharger les deux `index.html` et recompter md5 et taille. Si ça diffère de ce
tableau, **STOP** et dis-le à Paul.
*Piège vécu* : l'API GitHub renvoie l'empreinte du **fichier**, pas du commit — inutilisable comme référence de
restauration. Restaure depuis la **version** et son md5.
*Second piège* : deux commits du 27/08 à 13:27 (« dette 3 : le mode test couvre mjpcEcrireRest » et « retrait du
banc maison ») ne figurent pas dans mon transcript, alors que j'étais seul à écrire. Compression de contexte.
**Élucide-les avec Paul avant de t'appuyer dessus.**

---

# PARTIE IV — CE QUI ATTEND, PAR ORDRE

### Ce qui ne dépend que de Paul — dis-le-lui, ne le fais pas à sa place
1. **Les jetons** (voir PARTIE VI). C'est le point le plus urgent : l'étanchéité annoncée n'existe pas.
2. **`docs/MJPC6-DETTES.md`** : les deux dettes du §⑳ n'y sont pas. Production en lecture seule → donne-lui le texte.
3. **Le dimensionnement de la classe d'essai** : combien d'heures, et où. Proposition non validée de l'exécutant :
   4 heures en AB — lundi 08:00, mardi 08:00, jeudi 10:07, vendredi 13:00.

### Le lot en cours — LOT 2ter · EDT
Mandat de référence : **`PONT/EDT/MANDAT-LOT-2ter-v2.md`** (§⓪ à §⑳). L'ancien `MANDAT-LOT-2ter.md` est
**périmé** — numérotation différente, compteurs faux (`secu*` 141, « les 133 autres fonctions ») — conservé pour la
seule trace. Ne t'en sers pas.

**Ce que ça change pour la classe** : l'emploi du temps devient l'écran d'arrivée du prof — un clic sur la case, le
pilotage s'ouvre, l'heure se lance — et il dit **ce que l'année coûte** : les heures perdues, le sujet récurrent en
salle des profs dont Paul veut enfin une mesure exacte.

**Trois trous que le lot ferme**, mesurés : ① `edtJustifier` désignait un événement **par son indice**, donc une
réinjection faisait tomber la coche sur le mauvais · ② **les décisions de Paul vivaient dans l'objet réinjecté**,
donc toute réinjection les écrasait par construction — c'est le point qui commande tout · ③ une **heure déplacée**
était comptée perdue au départ *et* jouée à l'arrivée.

**Découpe, huit livraisons** : ① identité des objets · ② les décisions sortent de l'objet · ③ appariement gradué,
différentiel, archivage · ④ prompts en un collage · ⑤ heures perdues, quatre motifs, banalisation, alerte ·
⑥ trois issues, heure à replacer, liste, télescopages, dates de l'année, **classe d'essai** · ⑦ vue Année
(maquette d'abord, STOP) · ⑧ photos, bancs complets, audit adverse, **retrait de la classe d'essai**.

**Livraison ① : livrée au sas, prouvée. ② à ⑧ : non commencées.**
Contenu de ① : déclaration morte `edtPeriodePoser(nom,date)` retirée · noyau d'identité (`EDT_FAMILLES` et ses
neuf familles, `edtNormaliser`, `edtCondense` FNV-1a, `edtValeurCritere`, `edtAmorce`, `edtHorodatage`,
`edtPoserIds`, `edtApparier`) · `edtPoserIdsObjet` posée **à l'injection avant la première écriture** et au
chargement en mémoire · `edtMettreANiveau` écrite pour **quatre charges** (`EDT_CHARGES` / `edtChargeInscrire`)
pour que ② ⑤ ⑨ s'y branchent sans reprendre l'écriture, archivant avant d'écrire, abandonnant si l'archivage
échoue · les cinq fonctions par `id` et leurs huit appelants · `edtPeriodesEcrire` qui ne perd plus l'`id`.
Preuves : 122 id posés (15 · 30 · 59 · 11 · 7), 0 collision, 0 reposé, déterministes · coche stable après
insertion en tête · différentiel avec id : 14 forts silencieux ; sans id : 4 faibles proposés nommément ·
biunivocité : 0 permutation, 1 ambiguïté nommée · archivage en échec → 0 écriture · 138 noms d'origine, 0 disparu.
Rapport : `PONT/EDT/rapport-2ter-01.md`.

**Écarts signalés, jamais ajustés** : `EDT_ANNEE` 13 → **12 occurrences** (11 usages) — la fonction morte en
contenait une, donc **les §⑯ et §⑮ du mandat doivent porter la valeur d'après-①** · `function edt*` **149
déclarations** (138 + 11 ajoutées, nommées au rapport).

**Dettes ouvertes du lot** :
- **§⑳A — la classe d'essai n'existe pas.** `creneauxFictifs` : **0 occurrence dans le code** ; `fictif` : 0 ;
  `Charles de Gaulle` : 0. Le champ est dans le JSON, l'entrée y est **vide** (jour, créneau, classe à `""`).
- **§⑳B — rien de l'EDT ne disparaît à la purge.** `manifestes/index.purge` : purger `['eleves_index','codes']`,
  **preserver `['site', …]`** → `/site/edt/**` survit entièrement. Le retrait de la classe d'essai doit être un
  **geste nommé**, archivé avant, chiffrant ce qui part.

---

# PARTIE V — LES DÉCISIONS DE PAUL, DANS SES MOTS (ne les rouvre pas)

- **Heures perdues** : « c'est un sujet récurrent en salle des profs, et là j'aurai une mesure précise. »
- **La justification** : « ce qui est dans le calendrier, c'est l'établissement, donc si je perds des heures elles
  sont tout à fait justifiées » — **sans exception et sans bascule**.
- **Temps de classe** : « tout ce qui concerne le pédagogique et le cours d'une façon ou d'une autre (le français)
  est du temps de classe ». Le reste est une heure perdue sèche.
- **Écrasement** : « horaire toujours, bien évidemment ! pas contenu ». Aucune séance, aucune trace n'est touchée.
- **Le prompt d'injection** : « quand je clique sur le bouton copier, doit contenir le json directement. comme ça
  pas besoin de faire deux copier coller. »
- **La vue Année** : « il faut reprendre le même principe que l'agenda google » · « à gauche, ce sont LES DATES DES
  JOURS DU MOIS. » Maquettes validées : `TRANSCRIPTS/C10/pieces/T151-*`, `T152-*`. **Ne les réinvente pas.**
- **Les identifiants** : « tout est un objet, encore une fois » · « les photos doivent aussi avoir des ids
  internes. toujours pareil : objet, donc id. »
- **La perte** : « qu'est-ce qui, modifié, peut faire perdre des données écrites avant ? » · « je veux savoir
  exactement quoi remplace quoi, qu'est-ce qui disparaît, qu'est-ce qui est simplement déplacé. »
- **Une heure, une clé, un seul motif** (tranché le 27/08) : le geste le plus récent **remplace** le motif, jamais
  de refus, jamais en silence, une heure ne compte jamais deux fois, ↶ Annuler restaure le motif précédent.
- **La classe d'essai** : « j'avais demandé que la de Gaulle soit une classe test avec un edt fake. Comme ça je
  peux tester mon flux complet avec cette classe. »
- **Le professeur a TOUS les droits et ne doit JAMAIS être bloqué.**
- **M17a** — purge des classes 2025-2026 et import des vrais élèves — **se fait en TOUT DERNIER** : les anciens
  élèves sont des données martyres, c'est une sécurité. N'y touche pas, ne le propose pas.

---

# PARTIE VI — CE QUE PAUL ATTEND DE TOI, MÉTHODE

## Les dépôts
- **Sas** `siteflow-io/mjpc-chantier` — **PUBLIC**. Écriture autorisée. Aucun secret, jamais.
- **Production** `siteflow-io/monsieurjaipascompris` — **LECTURE SEULE**, quoi que ton jeton autorise.
- Livraison par l'API Contents, **md5 aller-retour vérifié** à chaque fichier.

## Les jetons — à régler avant tout travail
**État mesuré le 27/08, et il est mauvais** : le jeton en service porte `push: true` sur le sas **et sur la
production** — l'étanchéité n'existe pas. Sa **seconde moitié est publiée en clair** dans
`PASSATION-C9-C10-decisions-et-methode.md`, sur ce dépôt public. C9 avait déjà posé la consigne de révocation le
25/08 ; elle n'a pas été exécutée.

**Protocole — Paul l'exécute, pas toi :**
1. **Révoquer** le jeton en service : `github.com/settings/personal-access-tokens` → **Revoke**. C'est la seule
   action qui ferme la porte : retirer le fichier ne suffit pas, l'historique git garde tout.
2. **`MJPC-SAS`**, fine-grained : owner `siteflow-io` · *Only select repositories* → **`mjpc-chantier` seul** ·
   `Contents` **Read and write**, `Metadata` **Read-only** (imposé) · expiration 30 jours.
3. **`MJPC-PROD-LECTURE`**, fine-grained : **`monsieurjaipascompris` seul** · `Contents` **Read-only**.
4. **Éprouver l'étanchéité avant tout geste**, trois appels :
   `GET /repos/siteflow-io/mjpc-chantier` avec le jeton sas → `permissions.push = true` ·
   `GET /repos/siteflow-io/monsieurjaipascompris` avec le jeton sas → **404** ·
   `GET /repos/siteflow-io/monsieurjaipascompris` avec le jeton prod → 200, `push = false`.
   **Si le deuxième ne rend pas 404, l'étanchéité n'est pas faite : STOP, et dis-le.**
5. **Nettoyer la fuite** dans `PASSATION-C9-C10-decisions-et-methode.md`.
6. Les jetons se transmettent **dans le fil de conversation**, jamais dans un fichier. Convention d'écriture au
   transcript : `<jeton fourni — non recopié ici>`.

## Le banc — le parcours qui fonctionne, ne le cherche pas
`npm i puppeteer-core @sparticuz/chromium`, puis `const chromium = m.default || m` — un `require` direct échoue sur
« executablePath is not a function ». Binaire extrait dans `/tmp/chromium`, `headless:'shell'`,
`args:[...chromium.args,'--no-sandbox','--allow-file-access-from-files']`. Mesuré sur le candidat : page chargée en
`file://`, 149 fonctions `edt*` exposées, `EDT_ANNEE` lisible, **0 erreur de page**, `page.screenshot()` → PNG
1366×768. **Aucune preuve visuelle ne se dégrade en preuve logique.**
Deux couches anti-écriture au banc : interception HTTP (tout non-GET avorté) **et** le mode test M8 du site.
**Sache que `M8_TEST_STORE` est réinitialisé à chaque chargement de page : aucun mode test ne peut prouver la
persistance.** Elle ne se vérifie que dans `index.html`, contre le vrai hub.

## À lire, dans cet ordre, avant tout geste de fond
`docs/MJPC6-LECTURES.md` — il existe pour ça · `docs/MJPC6-0-INDEX.md` · `docs/MJPC6-1-DISPOSITIF.md` ·
`docs/MJPC6-2-DOCTRINE.md` · `docs/MJPC6-OU-TROUVER-QUOI.md` · `docs/MJPC6-DETTES.md` ·
`docs/MJPC6-restauration.md` · `OU-EST-CE-DEJA-ECRIT.md` au sas — écrit exprès pour ne pas faire répéter Paul.
Il y a **35 documents dans `docs/`** en production. C9 en avait lu trois et l'a payé cher.
Vérifie leurs md5 à chaque entrée d'exécutant.

## Ce qui ferme une livraison
Livraisons courtes, chacune poussée au sas et close par un **arrêt** que Paul relance d'un « continuer » (le
« continuer » natif plante une fois sur deux) · un exécutant ne livre **jamais** avec une dette · un mandat se
relit **ligne à ligne** contre le cadrage avant d'être lancé · tout prompt d'exécutant se livre **en texte dans la
conversation, dans un bloc de code copiable d'un seul geste** · **Paul promeut sur captures** : avant/après du même
parcours par clics, puis tu attends son mot · après promotion : vérification bit à bit, journal, dette ✔ au
registre, point de retour dans `docs/MJPC6-restauration.md`, index des fonctions régénéré,
`docs/MJPC6-OU-TROUVER-QUOI.md` à jour, adresse complète avec `&v=` et tests geste par geste.
**Chaque réponse se termine par la liste des tests manuels de Paul, puis par le mot MEMO, seul sur sa ligne.**

---

# PARTIE VII — MJPC EN BREF, pour que Paul n'ait rien à te réexpliquer

Paul enseigne le français au collège Saint-Joseph, à Doué-en-Anjou. Quatre classes MJPC — **3 FRANKLIN Aretha**,
**3 DYLAN Bob**, **4 HUGO**, **4 TURING** — plus des groupes partagés avec un collègue, qui **ne comptent jamais**
dans sa progression.

MJPC est une suite d'applications web pédagogiques servie en GitHub Pages, adossée à un **hub Firebase unique**
(`mjpc-hub`, projet `monsieurmeney`). Le portail `index.html` fait 1,6 Mo d'un seul tenant : **ne le lis jamais en
entier**, lis par recherche et par extraits.

**Règle cardinale** : MJPC **court-circuite** les portails d'identité élève des apps, il ne les remplace jamais.
Chaque app reste autonome.

Le hub : identité élève canonique **`sanMJPC`** (slug `clement_noe`) · **`/classes` mutualisé** entre toutes les
apps depuis le 3 juin 2026, classes de test préfixées `_test_<nomapp>` · taxonomie unifiée dans
`taxonomie_atelier.json` et au nœud `/taxonomie` — **lis le fichier, ne la stocke pas de mémoire** · socle
**MJPC-CORE 1.1.0** embarqué mot pour mot partout · **purge par manifestes** (`/manifestes/<app>`, motifs `purger`
et `preserver`).

Les apps, pour situer : le portail et son éditeur de chapitre · le déroulé (moteur en refonte, LOT G) · le tableau
distant multi-appareils · `worktrack.html` (Les Misérables, 4e) · `dictee_universelle.html` · `correction_dictee` ·
`evaluation-qcm.html` · `applause_meter.html` · `analyse_logique` · `pilotage_debat_s3.html` · le site satirique
Jérôme Swift 2027.

**Le diagnostic de Paul du 25/08, qui te concerne directement** : le dispositif consigne le *quoi* et le *où* des
mécanismes, jamais le *pour qui* ni le *pourquoi* — d'où des correctifs justes au banc et inutiles en classe.
**Tout mandat que tu écris s'ouvre par « ce que ça change pour la classe », dans les mots de Paul.**

Principe directeur du code : **souplesse et usage épuré**. Passer d'un mode à l'autre sans friction, aucune
surcharge visuelle, la décharge cognitive prime.

---

**Tu ne codes pas. Tu ne pousses rien sans ordre. Tu mesures avant d'affirmer. Et tu recomptes ce document.**

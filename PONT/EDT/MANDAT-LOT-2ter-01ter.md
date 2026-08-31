# MANDAT EXÉCUTANT — LOT 2ter · COMPLÉMENT ①ter · LA GRILLE DATÉE GARDE SES IDENTITÉS
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 660 869 octets**, md5 **`e6e8836f3ee6d1b93d1f4e2c0ca68637`**, **149 fonctions `edt*`**, version affichée **8.73.0-①bis**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-①ter**.*

*Deux corrections mécaniques, et les captures qui étaient dues. Aucun cadrage nouveau : la règle ci-dessous vient de Paul et du geste que le site fait déjà.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **normalement ce sont les mêmes créneaux horaires** » — Paul, 31/08, en découvrant que deux versions de sa grille partagent des identifiants.

« **on ne modifie pas le passé, on le fige** » · « **la grille est une suite de versions datées** : un changement vaut à partir d'une date, l'ancienne version reste vraie avant. »

« **tout est un objet, encore une fois** » · « **objet, donc id** » · « **ce que Paul a posé à la main survit** ».

**Le geste réel, et pourquoi la règle est celle-là.** Quand l'emploi du temps de Paul change en cours d'année, il déplace une heure : sa 3e Franklin du lundi 8h57 passe au mardi 10h. Le site crée alors une version datée, retire le créneau de sa place et **repose le même objet ailleurs** — `edtChangerEmploiDuTemps`, mesuré : `JSON.parse(JSON.stringify(retire))` puis `neuf.jour=…; neuf.creneau=…`. **C'est la même heure de cours, déplacée** : elle garde son identifiant, et c'est juste.

**Donc, la règle — elle ne change rien à ce qui existe, elle le rend vrai partout :**
1. **L'identité est portée par l'`id`, pas par le contenu.** Les critères de famille (jour · créneau · semaine · classe) servent à **retrouver** un objet quand l'`id` manque, à la réinjection — le mandat v2 §① le dit : « l'entrant porte un `id` connu → il fait foi, rien d'autre ». Ils ne définissent pas l'identité.
2. **Un créneau reconduit d'une version à l'autre garde son identifiant** — c'est le même créneau, et Paul le dit. Ce **n'est pas une collision** : l'unicité s'apprécie **à l'intérieur d'une version**, jamais à travers les versions.
3. **Deux créneaux différents d'une même version ne partagent jamais un identifiant.**
4. **Un créneau qui naît doit naître avec son identifiant.**

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL · CE QUI EXISTE DÉJÀ

**Lis avant de coder** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` §① (les familles, l'appariement) · `PONT/EDT/MANDAT-LOT-2ter-01bis.md` · `PONT/EDT/rapport-2ter-01bis.md` (sa revue des 15 écritures, et les deux trous qu'il a signalés). **`index.html` fait 1,6 Mo : ne le lis jamais en entier.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**L'état réel** : `/site/edt` au hub est **`null`**. La forme datée n'apparaît **pas au chargement** — seulement quand Paul ajoute ou modifie une version, ou change son emploi du temps (`edtNormaliserGrille` n'est appelée que par quatre gestes, mesuré).

**CHERCHER AVANT DE FABRIQUER — la faute du tour précédent, ne la refais pas.** La livraison ①bis a déclaré les captures par clics « impossibles, faute de code d'accès ». **C'est faux, et la méthode est dans ce sas depuis le LOT 2bis.** `PONT/EDT/tests/banc-2b.mjs` L105 et `PONT/EDT/tests/banc-versions.mjs` L94 :

```
document.body.classList.add('admin-mode'); openProfPanel(); showProfSection('edt');
```

**Aucun code n'est demandé.** Vérifié sur le candidat `8.73.0-①bis` : `openProfPanel` 4 occurrences, `showProfSection` 47, `admin-mode` 30, `tprof-section-btn` 27. Neuf captures du panneau prof réel existent déjà au sas (`2b-1-panneau-prof.png` … `3a-4-*.png`). **Relis ces bancs avant d'en écrire un.**

## ① LA POSE D'IDENTIFIANTS DOIT MARCHER SUR LA GRILLE DATÉE

**Mesuré le 31/08, deux fois, par l'exécutant et par la conscience** : `edtPoserIdsObjet('grille',o)` ne lit que `o.creneaux` (L17937). Or `edtNormaliserGrille` fait `delete o.creneaux` et range tout dans `o.versions[].creneaux`. Donc **en forme datée, la pose rend 0**. Rejoué : forme simple → 2 identifiants posés ; après normalisation → **0**.

**Ce qu'on attend, en résultat :**
1. **La pose traite les deux formes** : `o.creneaux` s'il existe, **et** `o.versions[].creneaux` sinon — toutes les versions, pas seulement la dernière.
2. **Elle ne touche jamais un créneau qui porte déjà un identifiant.** Aucun `id` en service n'est recalculé, remplacé, ni suffixé.
3. **Un identifiant reconduit d'une version à l'autre n'est pas une collision** : il ne reçoit ni `#2` ni rien d'autre. L'unicité se vérifie **version par version**.
4. **Deux créneaux différents d'une même version ne partagent jamais un identifiant** — s'ils y arrivent, le second en reçoit un neuf.

## ② UN CRÉNEAU QUI NAÎT NAÎT AVEC SON IDENTIFIANT

**Mesuré** : dans `edtChangerEmploiDuTemps`, quand le créneau source n'est pas retrouvé, le site crée `{classe, classeMjpc, mjpc, semaine}` **sans `id`** — puis `edtEcrireGrille` l'écrit tel quel. Un créneau sans identité échappe à tous les gestes qui désignent par `id`.

**Ce qu'on attend** : ce créneau naît avec son identifiant, avant l'écriture. Même remède qu'en ①bis pour les périodes. **Le créneau déplacé, lui, garde le sien** — il est recopié depuis `retire`, c'est la même heure, ne touche pas à ça.

## ③ LES CAPTURES PAR CLICS — elles étaient dues, elles sont exigées ici

**Paul promeut sur captures.** Avant/après du **même parcours**, écran entier, obtenues **par clics** dans le panneau prof, pas par appel de fonction. Le parcours minimum : ouvrir le panneau prof → section Emploi du temps → la grille → créer une version datée → déplacer une heure → revenir sur la grille. Si un écran ne peut pas être atteint par un clic, **tu le dis et tu montres ce que tu as essayé** — tu ne le déclares pas impossible sans avoir cherché.

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT

- **L'appariement gradué, le différentiel, l'archivage généralisé** : livraison ③.
- **Les décisions hors de l'objet injecté** : livraison ②.
- **Les photos sans identifiant** (signalé en ①bis) : livraisons ⑤ à ⑧.
- **La classe d'essai 3E Charles de Gaulle** : entrée dans le lot par décision de Paul, **dimensionnement non tranché**. Pas une ligne.
- **Les critères de famille** : on n'y touche pas. `classe` reste un critère fort de `creneauxGrille`.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ④ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`EDT_ANNEE` 12** · **`function edt*` 149**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif ③ intact** (mode test dans `mjpcEcrireRest`) · **`edtApparier` 0 appel** · **`edtMettreANiveau` 1 appel**.
- **Les acquis de ①bis restent vrais** : hub vide → 0 écriture · hub complet → 0 écriture · archive avant écriture · abandon global · périodes 3/3 conservées · période ajoutée à la main avec identifiant. **Rejoue les bancs de ①bis-a et ①bis-b sur ton candidat.**
- **Les 122 identifiants du calendrier réel** inchangés : 15 evc · 30 jal · 59 eta · 11 fer · 7 vac.
- **Double parseur vert** · **garde `verif_edt.py` verte**.

## ⑤ PREUVES EXIGÉES — mesurées, aucune affirmée

Un chiffre, un chemin, une commande. Une preuve obtenue en appelant une fonction à la main **se déclare comme telle**.

1. **Pose en forme datée** : grille normalisée, 2 versions → nombre d'identifiants posés, avant et après le correctif. Donne les identifiants.
2. **Aucun identifiant en service touché** : liste avant / liste après, à l'identique.
3. **Reconduction entre versions** : un créneau présent dans deux versions porte **le même identifiant**, sans `#2`.
4. **Unicité dans une version** : deux créneaux différents d'une même version → deux identifiants distincts.
5. **Créneau déplacé** : `edtChangerEmploiDuTemps` sur une case existante → identifiant **conservé**, jour et heure changés. Donne-le avant/après.
6. **Créneau neuf** : même geste quand la source n'est pas retrouvée → l'objet écrit **porte un identifiant**. Avant le correctif : aucun.
7. **Non-régression** : la liste chiffrée du §④, méthode nommée, **bancs de ①bis rejoués**.
8. **Garde** : verte, **et rouge sur trois contrôles négatifs que tu poses toi-même**.
9. **Captures par clics** : le parcours du §③, avant et après, écran entier.
10. **Audit adverse** : cherche ce qui casse. Trois versions et plus · une version vide · deux versions à la même date · un créneau présent dans la version 1 et absent de la 2 · un identifiant en double **dans une même version** · une grille encore en forme simple · un `id` porté par un créneau et par une période. **Hub vide : c'est l'état réel.**

## ⑥ MÉTHODE ET DÉCOUPE

**Deux livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer » (le « continuer » natif plante une fois sur deux).

- **①ter-a** — les deux corrections (§① et §②) et leurs preuves. Version **8.73.0-①ter-a**. Rapport, puis STOP.
- **①ter** — les captures par clics (§③), les bancs de ①bis rejoués, l'audit adverse, le rapport final. Version **8.73.0-①ter**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison. **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑦ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · `PONT/EDT/rapport-2ter-01ter-a.md` puis `PONT/EDT/rapport-2ter-01ter.md` · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑤, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.

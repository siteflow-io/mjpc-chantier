# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ② · UNE DÉCISION DE PAUL NE VIT JAMAIS DANS UN OBJET INJECTÉ
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 662 507 octets**, md5 **`cb20546e7abe9b4c32e322a5b03f7c60`**, **149 fonctions `edt*`**, version affichée **8.73.0-①ter**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-②**.*

*La livraison ① est close et auditée : les objets portent une identité stable, la mise à niveau est branchée, rien ne perd son identifiant à l'écriture. Tu t'appuies dessus, tu n'y reviens pas.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **une décision de Paul ne vit JAMAIS dans un objet injecté.** »

« **qu'est-ce qui, modifié, peut faire perdre des données écrites avant ?** » · « **ce que Paul a posé à la main survit** » · « **rien ne s'écrase en silence** ».

« **une heure, une clé, un seul motif** » · « **on ne modifie pas le passé, on le fige** ».

**Concrètement.** Quand une sortie scolaire lui fait perdre des heures, Paul coche « heure perdue » et dit pourquoi. Aujourd'hui cette coche est écrite **dans l'objet calendrier** — le même objet qu'il réinjecte chaque fois que le calendrier de l'établissement change. **Le jour où il réinjecte, ses coches disparaissent**, et aucun appariement n'y peut rien : elles sont dans le fichier qu'on remplace. C'est le bug que cette livraison ferme, et c'est le cœur du lot.

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL · CE QUI EXISTE DÉJÀ

**Lis avant de coder** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` **§②** (le cadrage de Paul, qui fait foi) et **§④** (le différentiel) · `PONT/EDT/rapport-2ter-01ter.md` · `PONT/EDT/outils/verif_edt.py`. **`index.html` fait 1,6 Mo : ne le lis jamais en entier.**

**ATTENTION — le §② du mandat v2 décrit un état du code qui n'existe plus.** Il cite `edtJustifier(i,valeur)` « par indice » : depuis la livraison ①, c'est **`edtJustifier(id,valeur)`, par identifiant stocké**. Sa dette « `edtPeriodePoser` déclaré deux fois » est **déjà réglée**. **Le cadrage du v2 fait foi ; ses mesures sont périmées. Remesure tout toi-même.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**CHERCHER AVANT DE FABRIQUER — le magasin existe déjà, ne le réinvente pas.** Mesuré dans le candidat : `edtDecisions()` · `edtEcrireDecision(nomClasse, cleHeure, valeur, quoi)` · `edtCleHeure(iso, creneau, nomClasse)`. Le magasin est `/site/edt/decisions/<année>`, rangé par classe, avec `heures{}` **et un `journal[]` qui garde l'avant et l'après de chaque geste**. `edtSansSeance` s'en sert déjà. **C'est là que les coches doivent aller.**

**Pour les captures et les bancs** : `tests/banc-2b.mjs`, `tests/captures-clics-01ter.mjs`. La session prof s'ouvre sans code — `document.body.classList.add('admin-mode')` — et le voile `fi-overlay` doit être retiré pour que les clics atteignent les cases. Tout est écrit dans ces bancs : relis-les avant d'en écrire un.

**L'état réel** : `/site/edt` au hub est **`null`**. `justifie` : **18 occurrences dans le code** (une seule écriture, `edtJustifier` L19856 ; huit lectures : calcul d'écart, vue Année, calendrier, la case à cocher), **15 dans `json/calendrier-2026-2027.json`**, **2 dans `prompts/calendrier.md`**, 0 dans `prompts/grille.md`.

## ① LA COCHE SORT DE L'OBJET

**Ce qu'on attend, en résultat :**
1. **`edtJustifier` n'écrit plus dans le calendrier.** Elle pose la décision dans le magasin `decisions`, à la clé `edtCleHeure(iso, creneau, classe)`, par `edtEcrireDecision`.
2. **La décision porte les deux choses** : la **clé heure** (date + créneau + classe) **et l'`id` de l'événement** qui l'a causée. C'est une décision **d'heure**, pas d'événement — Paul insiste là-dessus : « heure ≠ séance ».
3. **Une heure, une clé, un seul motif.** La coche « heure perdue » et « ne plus compter cette séance » tombent à la même clé. **Le geste le plus récent remplace le motif, le site le dit avant, jamais de refus, jamais en silence, jamais deux fois dans le total.** Le `journal[]` du magasin garde l'avant et l'après : sers-t'en, ne le contourne pas.
4. **Toute lecture de `justifie` lit désormais le magasin.** Les huit endroits qui lisent `e.justifie` (écart, vue Année, calendrier, case à cocher) donnent **le même résultat qu'avant** pour un calendrier déjà migré. Un compte qui change est une régression.

## ② LE CHAMP `justifie` DISPARAÎT — deux sources de vérité, c'est le bug

Le champ disparaît **de l'objet calendrier**, **des JSON du sas**, et **des prompts**. Après cette livraison, `justifie` ne doit plus être ni écrit, ni lu, ni produit nulle part — donne le compte à zéro, fichier par fichier.

**Sur les prompts** : `prompts/calendrier.md` perd ses deux mentions et gagne la consigne « **ne produis jamais de champ `justifie`** ». **Tu ne touches à rien d'autre dans les prompts** : le collage unique et la reconduction des `id` sont la livraison ⑤ du mandat v2.

## ③ LA MIGRATION — et la correction que la conscience apporte au mandat v2

Le §② du v2 demande que les `justifie:true` d'un calendrier hérité soient repris dans `decisions` par `edtMettreANiveau`, « **dans la même écriture qui retire le champ — jamais en deux temps** ».

**Mesuré : c'est irréalisable tel quel, et la conscience corrige le mandat plutôt que de te demander l'impossible.** Ce sont **deux nœuds distincts** du hub — `/site/edt/calendrier/<année>` et `/site/edt/decisions/<année>` — et `mjpcPutJson` écrit un nœud à la fois ; le seul `PATCH` du site (L13576) est hors du bloc EDT et hors du contrat de la garde.

**L'intention de Paul est : ne jamais perdre une coche. Elle se garantit par l'ORDRE, pas par l'atomicité :**
1. **`decisions` s'écrit EN PREMIER** — les coches arrivent dans le magasin sûr.
2. **`calendrier` s'écrit ENSUITE**, sans le champ, **et seulement si la première écriture a réussi**.
3. **Si la seconde échoue, la coche existe en double** — dans le magasin et dans l'objet. **Rien n'est perdu**, et c'est le seul état dégradé acceptable. L'inverse perdrait des coches : il est interdit.
4. **La migration est idempotente** : une coche déjà dans le magasin ne s'y remet pas, et un calendrier déjà sans `justifie` ne déclenche rien. Le chargement suivant termine ce qui n'a pas abouti.
5. Elle passe par la mise à niveau déjà branchée (livraison ①bis-a) : **une charge de plus**, inscrite par `edtChargeInscrire`, **sans reprendre l'écriture** — l'archivage avant écriture et l'abandon global sont déjà là, ne les redéfinis pas.

**Si tu penses qu'une écriture atomique des deux nœuds est possible et préférable, tu le SIGNALES et tu attends.** Tu n'élargis pas le contrat de la garde de ta propre initiative.

## ④ CE QUE DEVIENT UNE COCHE QUAND LES CHOSES BOUGENT — les mots sont de Paul

- **L'événement se déplace** (16/11 → 17/11) : les heures du 16 n'existent plus pour lui, celles du 17 sont d'autres heures. **Rien n'est reporté automatiquement.** Le site repropose les heures recalculées, **cases VIDES**, et dit : « tu avais coché 3 heures sur les dates précédentes ». Paul recoche ce qu'il veut.
- **La grille change sous un événement déjà coché** : **même règle, mêmes mots.**
- **L'événement ne bouge pas** : les coches restent, **sans un mot**.
- **L'événement disparaît** : ses coches sont **nommées avant le geste**, jamais supprimées en silence.

**Rien ne s'écrase en silence, et le site ne décide jamais à la place de Paul.**

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT — ne l'anticipe pas

- **L'appariement gradué et le différentiel nominatif** : livraison ③. Ne branche pas `edtApparier` (0 appel avant, 0 appel après).
- **Le collage unique du prompt et la reconduction des `id` par l'IA** : livraison ⑤ du v2.
- **Les heures perdues, les motifs, la banalisation, la vue Année, les photos** : livraisons ⑥ à ⑧. Tu touches à la coche « écart justifié » et à son magasin, pas aux écrans de ces livraisons.
- **La classe d'essai 3E Charles de Gaulle** : dimensionnement non tranché par Paul. Pas une ligne.
- **L'unicité entre familles** (un `crn:` porté par une période) : signalé en ①ter, à trancher par Paul.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ⑤ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`EDT_ANNEE` 12** · **`function edt*` 149**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** dans `mjpcEcrireRest` · **`edtApparier` 0 appel** · **`edtMettreANiveau` 1 appel**.
- **Tous les acquis de ① tiennent — rejoue les trois bancs** : `banc-mise-a-niveau-01bis-a.mjs`, `banc-periodes-01bis-b.mjs`, `banc-grille-datee-01ter.mjs`. Hub vide → 0 écriture · hub complet → 0 écriture · archive avant écriture · abandon global · périodes 3/3 · grille datée 30 distincts par version · créneau déplacé garde `crn:1a22nwk`.
- **Les 122 identifiants du calendrier réel** : 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision.
- **Double parseur vert** · **garde `verif_edt.py` verte**.

## ⑥ PREUVES EXIGÉES — mesurées, aucune affirmée

Un chiffre, un chemin, une commande. Une preuve obtenue en appelant une fonction à la main **se déclare comme telle**.

1. **`justifie` à zéro** : compte dans `index.html`, dans `json/calendrier-2026-2027.json`, dans les deux prompts. Avant / après.
2. **La coche va dans le magasin** : cocher un écart → **0 écriture du nœud calendrier**, 1 écriture du nœud `decisions`, contenu de la décision donné (clé heure + `id` de l'événement).
3. **Migration** : calendrier hérité portant les 15 `justifie:true` → **`decisions` écrit d'abord, `calendrier` ensuite**, 15 décisions dans le magasin, 0 `justifie` dans l'objet. Journal des écritures dans l'ordre.
4. **Migration interrompue** : la seconde écriture simulée en échec → **la coche existe en double, aucune n'est perdue** ; au chargement suivant, la migration **reprend et aboutit**.
5. **Idempotence** : deux chargements de suite sur un calendrier déjà migré → **0 écriture** au second.
6. **Aucun compte ne change** : le nombre d'heures perdues, l'écart et la vue Année donnent **les mêmes chiffres** avant et après migration, sur le calendrier réel. Donne-les côte à côte.
7. **Une heure, une clé, un seul motif** : cocher « heure perdue » puis « ne plus compter cette séance » sur la même heure → le site **dit avant** ce qu'il remplace, le motif le plus récent gagne, l'heure **n'est comptée qu'une fois**, le `journal[]` porte l'avant et l'après.
8. **Réinjection, la preuve du lot** : calendrier migré, coches posées → **réinjecter le calendrier** → **les coches sont toujours là**. C'est la preuve que tout le lot existe pour obtenir : donne-la en premier dans ton rapport.
9. **Non-régression** : la liste chiffrée du §⑤, les trois bancs rejoués.
10. **Garde** : verte, **et rouge sur trois contrôles négatifs que tu poses toi-même**.
11. **Captures par clics** : cocher un écart dans l'écran, avant/après, écran entier, plus le journal de clics.
12. **Audit adverse** : cherche ce qui casse. Coche sur une heure sans classe appariée · deux coches sur la même heure · une décision dont l'événement a disparu · un calendrier à moitié migré · le magasin `decisions` absent · une classe renommée entre deux chargements · le hub qui tombe entre les deux écritures. **Hub vide : c'est l'état réel.**

## ⑦ MÉTHODE ET DÉCOUPE

**Trois livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **②-a** — la coche sort de l'objet, le magasin porte clé heure + `id` d'événement, les huit lectures suivent (§① et §②). Version **8.73.0-②a**. Rapport, puis STOP.
- **②-b** — la migration, son ordre, son idempotence, sa reprise (§③). Version **8.73.0-②b**. Rapport, puis STOP.
- **②** — ce que devient une coche quand les choses bougent (§④), les captures, l'audit adverse, le rapport final. Version **8.73.0-②**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison, avant la finale. **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑧ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · `PONT/EDT/prompts/calendrier.md` et `PONT/EDT/json/calendrier-2026-2027.json` mis à jour · un rapport par livraison (`rapport-2ter-02a.md`, `rapport-2ter-02b.md`, `rapport-2ter-02.md`) · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑥, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.

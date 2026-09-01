# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ③ · RIEN NE S'ÉCRASE EN SILENCE
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 673 446 octets**, md5 **`92880802422d67c825e4dbd95313cac0`**, **154 fonctions `edt*`**, version affichée **8.73.0-②**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-③**.*

*Les livraisons ① et ② sont closes et auditées : les objets portent une identité stable, les décisions de Paul vivent hors des objets injectés, la réinjection ne perd plus ses coches. Tu t'appuies dessus, tu n'y reviens pas.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **rien ne s'écrase en silence** » · « **on ne devine pas : on nomme** ».

« **je veux savoir exactement quoi remplace quoi, qu'est-ce qui disparaît, qu'est-ce qui est simplement déplacé.** »

« **ce que Paul a posé à la main survit** » · « **on ne modifie pas le passé, on le fige** ».

**Concrètement.** Le responsable EDT envoie un nouveau calendrier en novembre. Paul le colle et l'injecte. Aujourd'hui, il appuie sur « Injecter » **sans savoir ce que ça va changer** : ce qui arrive, ce qui a seulement bougé d'un jour, ce qui disparaît. Et si l'IA n'a pas reconduit les identifiants, tout est traité comme neuf — les décisions qu'il a posées ne retrouvent plus leur objet. Cette livraison lui donne les deux choses qui manquent : **il voit avant**, et **rien ne s'écrit sans qu'une copie de l'état d'avant soit mise de côté**.

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL · CE QUI EXISTE DÉJÀ

**Lis avant de coder** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` **§① (l'appariement gradué et le tableau des critères par famille)** et **§④ (le différentiel)** — c'est le cadrage de Paul, il fait foi · `PONT/EDT/rapport-2ter-02.md` · `outils/verif_edt.py`. **`index.html` fait 1,6 Mo : ne le lis jamais en entier.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**CHERCHER AVANT DE FABRIQUER — l'essentiel est déjà écrit, tu le branches.**
- **`edtApparier(entrants, existants, famille, classe)` existe et est complète** : les quatre temps du §①, `sansAppariement` pour les photos, rendu `{fort, faible, arrivent, disparaissent, ambigus}`. Mesuré : **0 appel**. Elle a été écrite en avance par la livraison ①, jamais branchée. **Tu la branches, tu ne la réécris pas** — et si tu dois la corriger, tu dis exactement quoi et pourquoi.
- **L'écran d'injection existe** : `edtInjOuvrir`, `edtInjVerifier`, `edtInjInjecter`, `edtInjecterAvecLaGrille`.
- **L'archivage existe** : `edtArchiver(motif, chemin, data)`, et le modèle que Paul demande est `chInjecterConfirme` — il archive **avant** d'écrire et **abandonne si l'archivage échoue**.
- **Les bancs et la méthode des captures** : `tests/banc-*.mjs`, `tests/captures-coche-02.mjs`. Session prof sans code (`admin-mode`), voile `fi-overlay` à retirer. Relis-les avant d'en écrire un.

**L'état réel, mesuré** : `/site/edt` au hub est **`null`**. **14 écritures** dans le bloc EDT, réparties dans 13 fonctions — `edtInjecterAvecLaGrille` (2), `edtInjInjecter`, `edtMettreANiveau`, `edtEcrireGrille`, `edtEcrireBrevet`, `edtPeriodesEcrire`, `edtCreneauPoser`, `edtReglagePoser`, `edtApparierNom`, `edtPhoto`, `edtAbsence`, `edtEcrireDecision`, `edtEcrireDecisionsGroupe`. **Une seule archive aujourd'hui** : `edtMettreANiveau`.

## ① BRANCHER L'APPARIEMENT — quatre temps, et la biunivocité

**Ce qu'on attend, en résultat :**
1. **À la réinjection, l'appariement tourne** avant toute écriture, famille par famille, et son résultat commande ce qui est écrit.
2. **Les quatre temps, dans l'ordre du §① du v2** : l'entrant porte un `id` connu → il fait foi, rien d'autre · sinon **FORT** (tous les critères concordent, candidat unique) → `id` conservé, **silencieux** · sinon **FAIBLE** (tous sauf un, au moins un qui concorde, candidat unique) → **proposé à Paul, jamais appliqué seul** · **biunivocité** : un entrant ne s'apparie qu'à un existant, un existant qu'à un entrant.
3. **Les familles à critère unique n'ont pas d'appariement faible** — férié (date), période (nom). « Tous sauf un » y vaudrait zéro critère : un férié renommé s'apparierait à n'importe quel férié libre.
4. **Le créneau horaire s'apparie sur début-fin d'abord**, le rang **seulement en second recours et seulement si le nombre de créneaux est inchangé**. Jamais le rang seul : un créneau inséré décale tous les rangs et les décisions permuteraient en silence.
5. **Les photos ne s'apparient pas** : elles ne viennent d'aucune injection.
6. **Une ambiguïté ne se devine pas, elle se nomme.** Candidat non unique → aucune proposition, l'entrant est traité comme arrivant et le fait est dit.

## ② LE DIFFÉRENTIEL NOMINATIF — Paul voit avant d'appuyer

**Dans l'écran de vérification, avant le geste**, quatre listes **nommées**, jamais des compteurs seuls :
- **ce qui arrive** (`id` inconnu, aucun appariement) ;
- **ce qui est seulement déplacé** — apparié fort ou faible avec une valeur changée : « Stages 3e : 16/11 → 17/11 » ;
- **ce qui disparaît** (`id` en service absent de l'entrant) — et **un objet qui disparaît en portant des coches est nommé à part**, avec le nombre d'heures concernées ;
- **ce qui est conservé de ses décisions**.

**Les appariements faibles sont posés en question, une par une** : « Séjour Verdun 3e (14/10) semble être devenu "Séjour à Verdun 3e" — c'est bien le même ? » · « Stages 3e semble avoir été déplacé du 16/11 au 17/11 ». **Aucune conservation silencieuse sur un faible. Aucune proposition quand le candidat n'est pas unique.** Paul répond avant que quoi que ce soit s'écrive.

**Et si un événement déplacé portait des coches** : elles sont **reproposées vides**, jamais reconduites — règle déjà tenue par la livraison ②, ne la redéfinis pas, appuie-toi dessus.

## ③ L'ARCHIVAGE AVANT ÉCRASEMENT, GÉNÉRALISÉ

**Aujourd'hui une seule des 14 écritures archive.** Après cette livraison, **toute écriture qui remplace un état existant archive d'abord et abandonne si l'archivage échoue** — le modèle est `chInjecterConfirme`, copie-le.

**Ce qu'on attend :**
1. **Archive avant écriture, abandon si l'archive échoue** : rien n'est écrit, le site le dit, comme `edtMettreANiveau` le fait déjà.
2. **Une écriture qui crée sans rien remplacer n'a rien à archiver** : n'ajoute pas d'archive inutile, et dis lesquelles sont dans ce cas.
3. **Tu élargis le contrat de la garde si nécessaire** — `edtArchiver` appelle `secuEcrire` et `atCorbeilleCle` — **et tu le déclares dans `verif_edt.py` avec ta raison**, comme la livraison ① l'a fait. Tu ne l'élargis pas d'un iota de plus que nécessaire.
4. **Le tableau des 14 écritures est publié dans ton rapport** : pour chacune, « archive » ou « n'a rien à archiver, parce que… ».

## ④ LA CLASSE RENOMMÉE — l'écart signalé par la livraison ②

**Mesuré** : la clé d'une décision contient le nom de la classe. Si Paul renomme une classe, ses décisions restent lisibles **sous l'ancien nom** et la nouvelle en compte zéro. **Rien n'est perdu, mais rien ne suit.**

**Ce qu'on attend** : le renommage est un **appariement**, donc il relève de cette livraison. Le site **propose** de rattacher les décisions de l'ancien nom au nouveau — **nominativement, jamais en silence, jamais tout seul** — et Paul accepte ou refuse. S'il refuse, les décisions restent où elles sont et le site le dit.

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT — ne l'anticipe pas

- **Les heures perdues, les quatre motifs, la banalisation, l'alerte mensuelle, les trois issues, la vue Année, les photos du prévu** : livraisons ④ à ⑧.
- **Le collage unique du prompt** : livraison ⑤ du v2.
- **La classe d'essai 3E Charles de Gaulle** : dimensionnement non tranché par Paul. Pas une ligne.
- **L'unicité entre familles** (un `crn:` porté par une période) : signalé en ①ter, non tranché.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ⑤ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`EDT_ANNEE` 12** · **`function edt*` 154**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** dans `mjpcEcrireRest`.
- **`edtMettreANiveau` : 2 appels** — le second est le temps 2 de la migration, ne le touche pas.
- **La règle de la case tranchée par Paul le 31/08** : la case d'un événement **reste cochée tant qu'au moins une des heures qu'il recouvre aujourd'hui est marquée** ; elle se vide quand plus aucune ne tient. **Ne la change pas.**
- **Les cinq bancs des livraisons précédentes rejoués** : mise à niveau · périodes · grille datée · coche ②a · migration ②b, **dont la réinjection : 10 décisions → 10**.
- **Les 122 identifiants du calendrier réel** : 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision.
- **Double parseur vert** · **garde verte** (avec ton élargissement déclaré).

## ⑥ PREUVES EXIGÉES — mesurées, aucune affirmée

Un chiffre, un chemin, une commande. Une preuve obtenue en appelant une fonction à la main **se déclare comme telle**.

1. **L'appariement est branché** : nombre d'appels à `edtApparier`, avec la fonction et la ligne de chacun.
2. **L'entrant qui porte un `id` connu fait foi** : réinjection d'un calendrier dont les libellés ont tous changé mais qui porte les `id` → **0 faible, 0 arrivant**, tous conservés.
3. **Appariement fort silencieux** : réinjection sans aucun `id`, contenu identique → **tous forts, aucune question posée, aucun `id` neuf**.
4. **Appariement faible proposé, jamais appliqué seul** : un libellé retouché et une date déplacée → **2 questions posées, 0 écriture avant la réponse**. Donne le texte des questions.
5. **Biunivocité** : quatre événements de même libellé et même date, dont deux portent des coches → **0 permutation**, les ambiguïtés **nommées**. C'est la preuve qui protège les décisions de Paul : donne-la en entier.
6. **Pas de faible sur les familles à critère unique** : un férié renommé, une période renommée → **arrivant + disparaissant, aucune proposition**.
7. **Créneau horaire** : appariement sur début-fin ; puis un créneau inséré (nombre changé) → **le rang n'est pas utilisé**, aucune permutation.
8. **Différentiel nominatif** : les quatre listes, avec les noms, avant le geste. Un événement qui disparaît en portant des coches est **nommé à part** avec son nombre d'heures.
9. **Archivage généralisé** : le tableau des 14 écritures, « archive » ou « n'a rien à archiver, parce que… ». Puis, sur au moins trois d'entre elles : archive OK → 1 archive puis 1 écriture · archive en échec → **0 écriture**, message affiché.
10. **Classe renommée** : proposition nominative, refus → rien ne bouge et le site le dit ; acceptation → les décisions suivent, **aucune perdue**, journal à l'appui.
11. **Non-régression** : la liste chiffrée du §⑤, les cinq bancs rejoués.
12. **Garde** : verte, **et rouge sur trois contrôles négatifs que tu poses toi-même**. Ton élargissement du contrat déclaré avec sa raison.
13. **Captures par clics** : le parcours de réinjection — panneau prof → emploi du temps → coller un calendrier modifié → écran de vérification → le différentiel visible → répondre à une question d'appariement faible. Avant/après, écran entier, journal.
14. **Audit adverse** : cherche ce qui casse. Entrant vide · entrant identique à l'existant · tous les `id` inconnus · deux entrants portant le même `id` · un existant candidat de deux entrants · un calendrier de l'an dernier réinjecté par erreur · l'archivage qui tombe au milieu de 14 écritures · une réponse de Paul « non » à toutes les questions. **Hub vide : c'est l'état réel.**

## ⑦ MÉTHODE ET DÉCOUPE

**Trois livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **③-a** — l'appariement branché, les quatre temps, la biunivocité, les critères par famille (§①). Version **8.73.0-③a**. Rapport, puis STOP.
- **③-b** — le différentiel nominatif dans l'écran de vérification et la classe renommée (§② et §④). Version **8.73.0-③b**. Rapport, puis STOP.
- **③** — l'archivage généralisé aux 14 écritures (§③), les captures, l'audit adverse, le rapport final. Version **8.73.0-③**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison, avant la finale. **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑧ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · `outils/verif_edt.py` si tu élargis le contrat, avec ta raison en commentaire · un rapport par livraison (`rapport-2ter-03a.md`, `rapport-2ter-03b.md`, `rapport-2ter-03.md`) · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑥, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.

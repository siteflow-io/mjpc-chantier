# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ⑨ · FINALISATION — CE QUI BLOQUE LE PROMEUS
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 753 661 octets**, md5 **`c6d62dc787682d86ba60159c7a699c93`**, **221 déclarations `edt*` pour 221 noms distincts**, version affichée **8.73.0-⑧**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-⑨**.*

## POURQUOI CETTE LIVRAISON EXISTE — dans les mots de Paul

« **pas de promotion avec dettes et non complétion du mandat.** » — Paul, 02/09.

« **pas de livraison finale avec dettes non réglées sinon on accumule.** »

**Le lot ⑧ a été rendu avec sept dettes ouvertes, et la conscience a clos deux livraisons sans vérifier que leurs captures existaient. Paul refuse de promouvoir dans cet état. Cette livraison ferme ce qui manque — pas plus, pas moins.**

## ⓪ CE QUI BLOQUE, MESURÉ PAR LA CONSCIENCE — six points, et rien d'autre

**① LES CAPTURES DU LOT ⑤ : ZÉRO.** Comptage des `.png` au sas, livraison par livraison : ①bis **14** · ①ter **12** · ② **4** · ③ **9** · ③bis **3** · ④ **3** · **⑤ 0** · **⑥ 0** · ⑦ **7** · ⑧ **5**. Le mandat ⑤ §⑧.13 exigeait : *l'écran Heures perdues, une coche, une banalisation par-dessus avec son annonce, le total en tête.* **Manquant.**

**② LES CAPTURES ET L'AUDIT ADVERSE DU LOT ⑥ : ZÉRO.** Le mandat ⑥ §⑦.14 exigeait : *le dépôt sur une case occupée, les trois issues, l'échange, l'écrasement, l'heure à replacer rappelée.* Et le §⑦.15 exigeait un audit adverse (échange entre classes non appariées, écrasement d'une heure déjà à replacer, heure replacée sur sa case de départ, trois classes qui tournent, `finAnnee` avancée avec dix heures au-delà, deux gestes concurrents, une heure à replacer dont la classe disparaît). **Manquants tous les deux.**

**③ LA LISTE DES DESTINATIONS S'ARRÊTE À 120 JOURS ET N'A AUCUNE RECHERCHE.** Mesuré : `edtDestinationsPour` appelle `edtCreneauxOu(…, 120)` — **120 jours**, alors que le mandat ⑥ §③.1 exigeait qu'elle reste **entière jusqu'à la fin de l'année scolaire**, avec une **recherche par mois, par numéro de semaine et par type de semaine (A ou B)**. Mesuré : `filtreMois`, `typeSemaine`, `rechercheDest` → **0 occurrence**. **Deux manquements dans le même point.**

**④ LE REFUS DE DÉPLACER UNE HEURE DONT LA TRACE EXISTE : ABSENT.** Mesuré : `edtTraceExiste`, `traceExiste`, `dejaLancee`, `edtDeplacable` → **0 occurrence**. Le mandat ⑥ §①, tranché par Paul : *le refus porte sur une heure dont la trace existe — elle a été lancée ; une heure du jour non encore lancée reste déplaçable, et une trace vide supprimée la rend de nouveau déplaçable.* **Manquant.**

**⑤ LA BASCULE DE FIN D'ANNÉE : ABSENTE.** Mesuré : `jamaisReplacee`, `edtBasculeFinAnnee` → **0 occurrence**. Le mandat ⑥ §②.4 : *une heure à replacer jamais replacée en fin d'année porte le motif « heure à replacer jamais replacée », statut non justifiée, basculable.* Le motif est **déclaré** dans `EDT_MOTIFS`, **rien ne le pose**. **Manquant.**

**⑥ LA PHOTO AUTOMATIQUE N'EST PAS RETENTÉE APRÈS UN ÉCHEC.** Mesuré, L19892-19893 : `EDT.photoAutoEmise` est posé **avant** l'écriture. Si l'écriture échoue, la session ne réessaie pas. Dette ouverte par ⑧ et déclarée par toi. **À fermer : le drapeau se pose quand l'écriture a réussi, pas avant.**

## ⓪bis CE QUI NE BLOQUE PAS — ne le traite pas

- **La passe de simplification des textes affichés** : **Paul l'a lui-même mise en livraison à part** le 01/09. Hors de ce mandat.
- **Le message du mode test après une photo** (« Photo prise — 26 cases » alors que rien n'est enregistré) : **c'est le comportement de TOUS les gestes du site en mode test**, pas de l'emploi du temps, et la pastille l'annonce en permanence. Hors EDT.
- **La vue Année qui ne se repeint pas quand le calendrier change sous elle**, et **le cas « réinjection pendant que la vue est ouverte », resté non prouvé** : **ce sont des questions pour Paul, pas des dettes d'exécutant.** Ne les ouvre pas.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ⓪ter MÉTHODE

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut. **Livre au sas, jamais dans la conversation : le sas fait foi, et c'est le md5 relu après poussée qui prouve qu'on audite le fichier qui sera promu.**

**RÈGLE DE NOMMAGE** : tout nom de variable locale du bloc EDT commence par `edt`.

**DEUX RÈGLES DE BANC, gravées par Paul** : **un banc passe par le geste, jamais par la fonction** — ce qui n'est pas atteignable par un clic n'est pas prouvé, et se déclare comme tel · **une preuve dit ce qu'elle contient**, pas seulement qu'elle existe.

**`banc-tout.mjs` monte désormais son plan de travail lui-même** (livraison ⑧) : **rejoue-le en entier avant de livrer**, ajoute-lui tes bancs, publie son compte-rendu.

## ① CE QU'ON ATTEND, POINT PAR POINT

1. **Les captures de ⑤**, par clics : l'écran Heures perdues · une coche · **une banalisation par-dessus, avec son annonce affichée** · le total en tête. Écran entier, journal des clics.
2. **Les captures de ⑥**, par clics : le dépôt sur une case occupée · **les trois issues à l'écran** · l'échange · l'écrasement · l'heure à replacer rappelée. Écran entier, journal. **Et l'audit adverse du §⑦.15 du mandat ⑥, joué et publié.**
3. **La liste des destinations va jusqu'à la fin de l'année déclarée**, et porte une **recherche par mois, par numéro de semaine et par type A/B**. Les créneaux pris restent proposés et marqués.
4. **Une heure dont la trace existe ne se déplace pas** ; une heure du jour **non encore lancée** reste déplaçable ; **une trace vide supprimée la rend de nouveau déplaçable**. Le refus est **nommé**, jamais sec.
5. **La bascule de fin d'année** : passé `finAnnee`, une heure à replacer jamais replacée prend le motif **« heure à replacer jamais replacée »**, **non justifiée**, **basculable**. Elle **n'écrase aucune décision de Paul** : une heure qu'il a déjà tranchée reste comme il l'a laissée.
6. **La photo automatique se retente** : le drapeau de session se pose **après** une écriture réussie. Un échec ne perd pas l'échéance.

## ② CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`function edt*` : 221 déclarations / 221 noms**, aucune disparue, **aucun doublon** ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **`edt-fige` 9 occurrences — tu ne renommes rien.**
- **`EDT_CATEGORIES` et `EDT_MOTIFS` inchangés**, mot pour mot.
- **La vue Année ne contient toujours AUCUNE écriture.**
- **La classe d'essai reste invisible hors mode test** : 30 créneaux, comptes par classe inchangés.
- **Les comptes d'heures perdues sont identiques avant et après**, sauf pour les heures que la bascule du §①.5 fait entrer — **celles-là, tu les nommes une par une**.
- **`banc-tout.mjs` VERT EN ENTIER**, tes bancs ajoutés · **double parseur vert** · **garde verte sur ses cinq questions**.

## ③ PREUVES EXIGÉES — mesurées, aucune affirmée

1. **Captures ⑤** : les quatre écrans, journal des clics à l'appui.
2. **Captures ⑥** : les cinq écrans, journal des clics à l'appui.
3. **Audit adverse ⑥** : les sept cas du §⑦.15, joués, chacun avec son résultat.
4. **La liste va jusqu'au bout** : nombre d'entrées **avant** (avec la limite de 120 jours) et **après**, sur le calendrier réel, jusqu'à `finAnnee`.
5. **La recherche** : par mois, par numéro de semaine, par type A/B — trois mesures, avec le nombre d'entrées filtrées.
6. **Heure avec trace → refus nommé** ; **heure du jour non lancée → déplaçable** ; **trace vide supprimée → de nouveau déplaçable**. Trois mesures, par le geste.
7. **Bascule de fin d'année** : une heure à replacer, `finAnnee` passée → motif « jamais replacée », non justifiée, basculable. **Et une heure que Paul avait déjà tranchée reste intacte.** Deux mesures.
8. **Photo automatique retentée** : écriture refusée → **l'échéance reste due**, et le chargement suivant la reprend. Avant/après.
9. **Non-régression** : la liste chiffrée du §②, **`banc-tout.mjs` en entier**.
10. **Garde** : verte sur ses cinq questions, **et rouge sur cinq contrôles négatifs que tu poses toi-même**.
11. **Audit adverse de cette livraison** : `finAnnee` absente · une heure à replacer dont la classe a disparu · deux échéances de photo le même jour · la liste sur une année sans `finAnnee` déclarée · une trace supprimée pendant que la modale de déplacement est ouverte.

## ④ MÉTHODE ET DÉCOUPE

**Trois livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **⑨-a** — les captures de ⑤ et de ⑥, et l'audit adverse de ⑥ (§①.1 et §①.2). **Aucune ligne de code si rien ne manque** : si tu découvres en cliquant qu'un écran ne fait pas ce que le rapport annonçait, **tu le déclares et tu t'arrêtes**. Version **8.73.0-⑨a** seulement si le code a changé. Rapport, puis STOP.
- **⑨-b** — la liste jusqu'à la fin de l'année et sa recherche, le refus « trace existe » (§①.3 et §①.4). Version **8.73.0-⑨b**. STOP.
- **⑨** — la bascule de fin d'année, la photo retentée, `banc-tout` en entier, le rapport final (§①.5, §①.6). Version **8.73.0-⑨**. STOP.

**Tu ne livres jamais avec une dette.** **C'est la livraison qui rend le promeus possible : rien ne doit rester ouvert derrière toi, et ce que tu ne peux pas fermer, tu le nommes.** **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑤ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · les captures dans `PONT/EDT/tests/` · `tests/banc-tout.mjs` enrichi · un rapport par livraison (`rapport-2ter-09a.md`, `-09b.md`, `-09.md`) · les bancs rejouables d'une commande. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §③, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.

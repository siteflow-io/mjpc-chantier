# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ⑥ · PERSONNE NE PERD UNE HEURE EN SILENCE
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 729 825 octets**, md5 **`b0be8f4d62dbb7b53d3f6f0579ec702c`**, **190 fonctions `edt*`**, version affichée **8.73.0-⑤**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-⑥**.*

*Les livraisons ①, ②, ③, ③bis, ④ et ⑤ sont closes et auditées. Tu t'appuies dessus, tu n'y reviens pas.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **écrasement — horaire toujours, bien évidemment ! pas contenu.** »

« **tu fais les 4C à la place des 4D vendredi** » — le geste réel, aujourd'hui impossible.

« **deux autres champs à créer, dans la partie dates du brevet (on peut remplacer par DATES DE L'ANNÉE)… et si besoin, je remodifierai les dates à la main après, et tout doit se recaler en fonction.** »

**Concrètement.** Un collègue lui demande d'échanger une heure. Aujourd'hui, quand Paul dépose son heure sur une case déjà prise, **le site refuse sèchement** : le geste le plus courant de sa vie de prof est impossible. Cette livraison lui donne les trois sorties — refuser, échanger, écraser — et surtout : **quand une heure est prise à une classe, elle n'est jamais perdue en silence.** Elle devient une heure à replacer, rappelée jusqu'à ce que Paul la pose, jusqu'à la fin de l'année.

**Et rien de tout cela ne touche au contenu** : la grille et les décisions bougent, **aucune séance, aucune activité, aucune trace n'est touchée**. Le prévu se recalcule dessus.

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL · CE QUI EXISTE DÉJÀ

**Lis avant de coder** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` **§⑩, §⑪, §⑫, §⑮** — le cadrage de Paul, il fait foi · `PONT/EDT/rapport-2ter-05.md` · `outils/verif_edt.py` (**cinq questions** désormais). **`index.html` fait 1,7 Mo : ne le lis jamais en entier.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**RÈGLE DE NOMMAGE** : la garde a refusé deux livraisons de ce lot pour une variable nommée `poser`, puis `suite`. **Tout nom de variable locale du bloc EDT commence par `edt`.**

**DEUX RÈGLES DE BANC, gravées par Paul le 01/09 :**
1. **UN BANC PASSE PAR LE GESTE, JAMAIS PAR LA FONCTION.** Ce qui n'est pas atteignable par un clic n'est pas prouvé — **et se déclare comme tel**. C'est par un banc à zéro clic qu'une dette est passée.
2. **UNE PREUVE DIT CE QU'ELLE CONTIENT, PAS SEULEMENT QU'ELLE EXISTE.** « Une archive est partie » ne prouve rien : donne **ce qu'il y a dedans**, compté, dans les conditions réelles.
**`tests/banc-tout.mjs` existe** : ajoute-lui tes bancs, **rejoue-le entier avant de livrer**, et publie son compte-rendu.

**CHERCHER AVANT DE FABRIQUER — mesuré dans le candidat :**
- **Le déplacement d'heure existe** : `edtDeplacerVers` (L19901) écrit **les deux côtés** — au départ `{sansSeance, deplaceeVers}`, à l'arrivée `{epingle, venantDe}` — et `edtAnnulerDecision` défait les deux. **Ne le réécris pas.**
- **La liste des destinations existe** : `edtCreneauxLibresLe` (L20868), `edtCibleSous` (L20820), `edtPoserQuestionDepot` (L20876). **C'est là que les trois issues se branchent.**
- **Les deux motifs sont déjà déclarés** dans `EDT_MOTIFS` : `aReplacer` et `priseAutreClasse`, avec leurs statuts et leur basculabilité (livraison ⑤b). **Tu les utilises, tu ne les redéfinis pas.**
- **Le nœud des dates existe** : `/site/config/brevetDates`, **28 occurrences**, écrit par `edtEcrireBrevet` — c'est l'exception ① du contrat de la garde.
- **L'écriture passe par la porte unique** `edtEcrireArchive` / `edtEcrireObjet`, et **la photo se prend AVANT toute mutation** (`edtPhotoDe`). La garde vérifie le chemin : ne la contourne pas.

**L'état réel** : `/site/edt` au hub est **`null`**.

## ① LES TROIS ISSUES — au lieu du refus sec

**Au dépôt sur une case occupée par une AUTRE classe**, le site propose **trois sorties**, jamais un refus :
1. **Confirmer le refus** — rien ne se passe.
2. **Échanger** — les deux classes permutent. **Personne ne perd d'heure**, les deux prévus se recalculent.
3. **Écraser** — Paul prend le créneau ; **l'heure évincée devient une heure à replacer**.

**Avant confirmation, le site dit toujours ce que ça coûte et à qui** : « la 4D perd son heure du vendredi 13 — à replacer, ou perdue ? » **Jamais un geste dont Paul ne connaît pas le prix.**

**Deux cas déjà tranchés par Paul, à respecter :**
- Le refus porte sur **une heure dont la trace existe** — elle a été lancée. **Une heure du jour non encore lancée reste déplaçable**, et une trace vide supprimée la rend de nouveau déplaçable.
- **Aucune séance, aucune activité, aucune trace n'est touchée.** Horaire, jamais contenu.

## ② L'HEURE À REPLACER — rappelée jusqu'à ce qu'elle soit posée

1. Paul la pose **tout de suite** depuis la liste des destinations, **ou la laisse en attente**.
2. En attente, elle est **rappelée dans la vue de la classe et au bandeau**, **jusqu'à ce qu'elle soit posée**, **jusqu'à la fin de l'année**.
3. **Perte sèche** : Paul déclare que l'heure ne sera pas rendue → elle entre dans les heures perdues, motif **« heure prise par une autre classe »**, statut **justifiée**, **basculable** (déjà déclaré en ⑤b).
4. Une heure à replacer **jamais replacée** en fin d'année porte le motif **« heure à replacer jamais replacée »**, statut **non justifiée**, basculable.

## ③ LA LISTE DES DESTINATIONS

1. Elle reste **entière jusqu'à la fin de l'année scolaire** — 804 entrées mesurées au v2, groupées par semaine — avec une **recherche par mois, par numéro de semaine et par type de semaine (A ou B)**.
2. **Elle propose aussi les créneaux occupés par une autre classe**, marqués « pris par la 3 DYLAN Bob », qui **ouvrent les trois issues du §①**. Aujourd'hui ils sont absents : c'est ce qui rend le geste de Paul impossible.
3. **Ce qui est déjà juste ne bouge pas** : les créneaux libres de son emploi du temps (653 mesurés) restent proposés et marqués « créneau libre, heure ajoutée ».

## ④ AUCUN TÉLESCOPAGE — vérifié, jamais supposé

**Écris `edtVerifierCoherence`**, qui rend **la liste des télescopages trouvés**. Après **tout** geste — déplacement, échange, écrasement, heure ajoutée, heure replacée, changement d'emploi du temps :
- **jamais deux classes au même créneau le même jour** ;
- **jamais deux fois la même classe au même créneau** ;
- **jamais une heure à la fois au départ et à l'arrivée**.

**Elle est appelée par le banc après chaque geste**, et son résultat figure au rapport. **Une classe non appariée ne reçoit aucune décision** : ses cases ne se saisissent pas, n'ouvrent aucun geste, et le site le dit clairement.

## ⑤ LES DATES DE L'ANNÉE — deux champs, au même endroit

1. **Le nœud NE CHANGE PAS DE NOM** : `/site/config/brevetDates` reste `/site/config/brevetDates`. **Seule l'étiquette à l'écran** devient « Dates de l'année ».
2. **Deux champs de plus, par le même chemin** : `debutAnnee` et `finAnnee`. **Produits par le prompt du calendrier, injectés avec lui, modifiables à la main**, mêmes champs date que l'existant.
3. **Tout se recale dessus** : fin de la liste des destinations, bascule des heures à replacer, appartenance d'une date à l'année scolaire.
4. **`EDT_ANNEE` cesse d'être deviné.** Mesuré : il est **calculé au chargement du script**, donc `debutAnnee`, qui arrive après la lecture du hub, ne servirait à rien tel quel. **Il devient une valeur recalculée** quand les dates sont connues.
5. **Refus nommés et chiffrés** : fin avant début · écart supérieur à treize mois · date **hors des bornes du calendrier injecté élargies d'un mois**.
6. **Si Paul avance `finAnnee` à la main, les heures posées au-delà ne disparaissent pas** : elles **redeviennent des heures à replacer en attente**, nommément signalées — « 2 heures posées après la nouvelle fin d'année : à replacer ».
7. *Repère de réalité, de Paul* : la fin d'année tombe souvent vers le **25-26 juin**, avant le brevet blanc — **pas** au début des vacances d'été. **Aucune déduction depuis les vacances.**

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT — ne l'anticipe pas

- **La vue Année** : livraison ⑦. Ses maquettes validées sont au sas (`TRANSCRIPTS/C10/pieces/T151…`, `T152…`) — **n'y touche pas**.
- **Les photos du prévu, la matrice, `SEQUENCE-TEST-PAUL.md`** : livraison ⑧.
- **La passe de simplification des textes affichés** : dette à part. **Mais n'aggrave pas** : écris tes textes dans les mots de Paul.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ⑥ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`function edt*` 190**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels**.
- **Les dix catégories inchangées**, mot pour mot. **Les quatre motifs de ⑤b inchangés.**
- **La classe d'essai reste invisible hors mode test** : 30 créneaux, comptes par classe inchangés.
- **Les 122 identifiants du calendrier réel** : 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision.
- **`banc-tout.mjs` VERT en entier**, tes bancs ajoutés · **double parseur vert** · **garde verte sur ses cinq questions**.
- **`EDT_ANNEE` reste `12` occurrences** ou, s'il en change, chaque occurrence est nommée et justifiée.

## ⑦ PREUVES EXIGÉES — mesurées, aucune affirmée

Un chiffre, un chemin, une commande. Une preuve obtenue en appelant une fonction **se déclare comme telle**.

1. **Les trois issues s'ouvrent** : dépôt sur une case occupée → **trois sorties proposées, 0 écriture avant la réponse**. Donne le texte.
2. **Refuser** → rien n'a bougé : hub identique, md5 à l'appui.
3. **Échanger** → les deux classes ont permuté, **aucune des deux ne perd d'heure**, les deux comptes sont inchangés.
4. **Écraser** → l'heure évincée est **une heure à replacer**, et le site a dit avant ce que ça coûte et à qui.
5. **L'heure à replacer est rappelée** dans la vue de la classe **et** au bandeau, tant qu'elle n'est pas posée. Montre-le après rechargement.
6. **Perte sèche** → motif `priseAutreClasse`, **justifiée**, **basculable** ; le total ne bouge que d'une unité.
7. **Une heure dont la trace existe ne se déplace pas** ; **une heure du jour non lancée si** ; **une trace vide supprimée la rend déplaçable**. Trois mesures.
8. **Aucune trace touchée** : compte les séances, activités et traces **avant et après** chaque geste — **identiques**.
9. **`edtVerifierCoherence` après chaque geste** : liste vide, à chaque fois. Publie le tableau geste par geste.
10. **Classe non appariée** : aucune saisie, aucun geste, message clair.
11. **Les dates de l'année** : deux champs écrits **au même nœud** ; les trois refus nommés et chiffrés ; `EDT_ANNEE` recalculé quand elles arrivent ; **`finAnnee` avancée → les heures au-delà redeviennent à replacer, nommées, aucune ne disparaît**.
12. **Non-régression** : la liste chiffrée du §⑥, **`banc-tout.mjs` en entier**.
13. **Garde** : verte sur ses cinq questions, **et rouge sur cinq contrôles négatifs que tu poses toi-même**.
14. **Captures par clics** : le dépôt sur une case occupée, les trois issues, l'échange, l'écrasement, l'heure à replacer rappelée. Avant/après, écran entier, journal.
15. **Audit adverse** : cherche ce qui casse. Échange entre deux classes non appariées · écrasement d'une heure déjà à replacer · heure replacée sur sa propre case de départ · trois classes qui tournent · `finAnnee` avancée avec dix heures au-delà · deux gestes concurrents sur la même case · une heure à replacer dont la classe disparaît de la grille. **Hub vide : c'est l'état réel.**

## ⑧ MÉTHODE ET DÉCOUPE

**Quatre livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **⑥-a** — les trois issues au dépôt, avec ce que ça coûte dit avant (§①). Version **8.73.0-⑥a**. STOP.
- **⑥-b** — l'heure à replacer, son rappel, la perte sèche (§②). Version **8.73.0-⑥b**. STOP.
- **⑥-c** — la liste des destinations élargie et `edtVerifierCoherence` (§③ et §④). Version **8.73.0-⑥c**. STOP.
- **⑥** — les dates de l'année (§⑤), les captures, l'audit adverse, `banc-tout` en entier, le rapport final. Version **8.73.0-⑥**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison, avant la finale. **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑨ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · `outils/verif_edt.py` si tu élargis le contrat, raison en commentaire · `tests/banc-tout.mjs` enrichi · un rapport par livraison (`rapport-2ter-06a.md`, `-06b.md`, `-06c.md`, `-06.md`) · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑦, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.

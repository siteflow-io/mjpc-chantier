# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ③bis · QUE LE SYSTÈME TIENNE TOUT SEUL
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 686 881 octets**, md5 **`efb57889867c5a968ba6da1949bfe851`**, **167 fonctions `edt*`**, version affichée **8.73.0-③**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-③bis**.*

*Les livraisons ①, ② et ③ sont closes et auditées. Tu t'appuies dessus, tu n'y reviens pas. Cette livraison n'ajoute pas une fonctionnalité : elle fait en sorte que ce qui existe **tienne sans personne pour s'en souvenir**.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **le système doit être solide et ne pas me bloquer dans 3 mois quand je ne saurai même plus cette histoire d'identifiants.** » — Paul, 01/09.

« **tout est un objet, encore une fois** » · « **objet, donc id** » · « **rien ne s'écrase en silence** ».

**Concrètement.** Trois choses, et elles servent toutes la même : que Paul n'ait rien à retenir.
- Il veut **éprouver son emploi du temps avant de s'en servir en vrai**, sans polluer ses comptes ni risquer d'oublier de nettoyer.
- Un identifiant qui ment sur sa famille passerait aujourd'hui **sans un mot** — et dans trois mois, plus personne ne saura que ça peut arriver. C'est au site de s'en souvenir.
- Depuis la livraison ③, **c'est la conscience qui surveille à la main** que l'écriture centrale n'écrit pas n'importe où. Une conscience change ; une garde, non.

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL · CE QUI EXISTE DÉJÀ

**Lis avant de coder** : `PONT/EDT/rapport-2ter-03.md` (l'écriture centrale et l'élargissement du contrat) · `PONT/EDT/MANDAT-LOT-2ter-v2.md` **§⑳** (la classe d'essai, les mots de Paul) · `outils/verif_edt.py`. **`index.html` fait 1,6 Mo : ne le lis jamais en entier.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**RÈGLE DE NOMMAGE, APPRISE À TES DÉPENS DEUX FOIS SUR CE LOT** : la garde a refusé une livraison parce qu'une variable locale s'appelait `poser`, une autre parce qu'elle s'appelait `suite` — ces noms existent aussi comme fonctions hors du bloc, et la garde ne peut pas les distinguer. **Tout nom de variable locale du bloc EDT commence par `edt`.**

**CHERCHER AVANT DE FABRIQUER — tout existe déjà, mesuré :**
- **Le mode test** : `m8TestOn()` — `function m8TestOn(){ return M8_TEST === true; }` — 22 occurrences dans le fichier, **0 dans le bloc EDT**, et **absent du contrat de la garde**.
- **La place de la classe d'essai est déjà réservée** dans `json/grille-2026-2027.json`, clé `creneauxFictifs` : un créneau vide, `classeMjpc:"3E Charles de Gaulle"`, `fictif:true`, avec la note de Paul et la liste des trous. **Mesuré : `creneauxFictifs` = 1 occurrence dans le JSON, 0 dans le code. Personne ne le lit.**
- **La forme d'un créneau de grille** : `{jour, creneau, semaine, classe, salle, mjpc, classeMjpc}` — respecte-la.
- **Les neuf familles et leurs préfixes** : `evc:` `jal:` `eta:` `fer:` `vac:` `crn:` `hor:` `per:` `pho:`, dans `EDT_FAMILLES`.
- **L'écriture centrale** : `edtEcrireArchive(motif, chemin, avant, valeur, libelle, apres)`, ses deux seuls appelants légitimes sont `edtEcrireObjet` (chemin = `edtChemin(nom)`) et `edtAbsence` (chemin = `edtCheminTrace(...)+'/absents'`).

**L'état réel** : `/site/edt` au hub est **`null`**. La 3E Charles de Gaulle a **0 créneau** dans la grille.

## ① LA CLASSE D'ESSAI — visible seulement en mode test

**Tranché par Paul le 01/09** : **4 heures, semaine A et B**, sur ces quatre trous réels de sa grille :

> **lundi 08:00** · **mardi 08:00** · **jeudi 10:07** · **vendredi 13:00**

**Ce qu'on attend, en résultat :**
1. **Les quatre créneaux sont posés dans `creneauxFictifs`** du JSON de la grille, à la forme d'un créneau normal, `classeMjpc:"3E Charles de Gaulle"`, `fictif:true`, `semaine:"AB"`.
2. **Le site les lit et les affiche — uniquement quand le mode test est allumé.** Mode test éteint : la grille de Paul est **exactement celle d'aujourd'hui**, aux mêmes chiffres.
3. **Ils ne comptent JAMAIS dans les vrais comptes** : heures perdues, écart de progression, vue Année, profil de classe. En mode test, ils comptent comme une classe ordinaire pour que le flux soit éprouvable ; hors mode test, ils n'existent pas.
4. **Ils portent une identité comme les autres** — `crn:` posé par le mécanisme existant, jamais à la main.
5. **Rien à nettoyer** : quitter le mode test suffit à les faire disparaître. **Aucun « geste nommé » d'effacement n'est demandé** — c'était la seconde dette du §⑳, elle tombe d'elle-même.
6. **Le bloc EDT doit pouvoir demander « suis-je en mode test ? »** : ajoute `m8TestOn` au contrat de la garde, **et déclare-le avec sa raison**. C'est un élargissement **de lecture** : le bloc interroge, il n'écrit rien.

## ② L'IDENTIFIANT DIT SA FAMILLE, ET LE SITE LE VÉRIFIE

**Mesuré** : un identifiant en service n'est jamais recalculé — c'est la règle de la livraison ①, elle est bonne et **elle ne change pas**. Mais rien ne vérifie que le préfixe correspond à la famille. Un JSON injecté à la main portant `per:xxx` sur un créneau de grille le garderait : **un identifiant qui ment sur sa famille, et personne ne le dit**.

**Ce qu'on attend :**
1. **À l'injection, un identifiant dont le préfixe ne correspond pas à sa famille est refusé** — l'objet est traité comme un arrivant et **reçoit un identifiant neuf, correct**.
2. **Le fait est NOMMÉ à Paul**, dans le différentiel, avant le geste : « 2 objets portaient un identifiant d'une autre famille : ils sont traités comme neufs. » **Jamais en silence.**
3. **Un identifiant correct n'est jamais touché** : la règle de ① reste entière. On refuse le menteur, on ne recalcule pas les autres.
4. **Rien n'est perdu** : un objet dont l'identifiant est refusé garde tout son contenu ; ce sont ses décisions attachées à l'ancien identifiant qui ne le suivent pas, **et c'est dit**.

## ③ LA GARDE REPREND LA SURVEILLANCE DU CHEMIN

**Mesuré** : la livraison ③ a remplacé l'exception spécifique `"t.chemin+'/absents.json'"` par la forme générique `"chemin+'.json'"`. **La garde ne contrôle donc plus où l'écriture centrale écrit.** Aujourd'hui c'est la conscience qui relit les appelants à chaque audit — ça ne tiendra pas dans trois mois.

**Ce qu'on attend :**
1. **La garde vérifie elle-même les appelants de `edtEcrireArchive`** : son deuxième argument doit être **un chemin fabriqué par le site** — `edtChemin(...)` ou `edtCheminTrace(...)` — **jamais une chaîne écrite à la main**, jamais une concaténation libre.
2. **Elle refuse** un appel qui passerait `'/site/classes/x'` ou toute autre adresse littérale, et **elle le dit nommément**.
3. **Elle reste verte** sur le candidat, avec les deux élargissements déclarés (`m8TestOn` en lecture, et celui de ③).
4. **Tu poses toi-même les contrôles négatifs** qui prouvent qu'elle sait refuser — au moins un par question, plus un sur ce nouveau contrôle.

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT — ne l'anticipe pas

- **Les prompts en un collage et les JSON régénérés** : livraison ④ du v2.
- **Les heures perdues, les quatre motifs, la banalisation, l'alerte mensuelle, les trois issues, la vue Année, les photos** : livraisons ⑤ à ⑧.
- **Le second recours par rang** pour les créneaux horaires : **Paul a tranché le 01/09 — on n'y touche pas.**
- **L'archive des dates du brevet** : **Paul a tranché le 01/09 — il n'en veut pas.**

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ④ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`EDT_ANNEE` 12** · **`function edt*` 167**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** dans `mjpcEcrireRest` · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels**.
- **La règle de la case tranchée par Paul le 31/08** : cochée tant qu'au moins une heure recouverte est marquée.
- **Hors mode test, la grille de Paul est identique à aujourd'hui** : mêmes créneaux, mêmes comptes, mêmes identifiants. **C'est la preuve la plus importante de cette livraison.**
- **Les sept bancs des livraisons précédentes rejoués**, avec leurs chiffres.
- **Les 122 identifiants du calendrier réel** : 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision.
- **Double parseur vert** · **garde verte**.

## ⑤ PREUVES EXIGÉES — mesurées, aucune affirmée

Un chiffre, un chemin, une commande. Une preuve obtenue en appelant une fonction à la main **se déclare comme telle**.

1. **Mode test éteint : rien n'a changé.** Nombre de créneaux de la grille, comptes d'heures par classe, écart de progression, vue Année — **identiques avant et après cette livraison**. Donne-les côte à côte.
2. **Mode test allumé** : les 4 heures de la 3E Charles de Gaulle apparaissent, aux quatre trous exacts, semaine AB, avec un identifiant `crn:` chacune.
3. **On éteint le mode test** : elles disparaissent, **sans aucune écriture** et sans rien à nettoyer.
4. **Elles ne polluent aucun compte réel** : en mode test, les comptes des vraies classes sont inchangés.
5. **Identifiant menteur refusé** : injection d'un calendrier où deux événements portent `per:` et `crn:` → **traités comme arrivants, identifiants neufs corrects**, et **le différentiel le nomme**. Donne le texte.
6. **Identifiant correct intact** : dans la même injection, les autres gardent le leur — aucun recalcul.
7. **La garde refuse un chemin écrit à la main** : ajoute toi-même un appel `edtEcrireArchive('x','/site/classes/y',…)` → **ROUGE**, avec le texte du refus. Puis retire-le.
8. **La garde reste verte** sur le candidat, les deux élargissements déclarés avec leur raison en commentaire.
9. **Non-régression** : la liste chiffrée du §④, les sept bancs rejoués.
10. **Captures par clics** : mode test éteint puis allumé, la grille dans les deux états, écran entier, journal.
11. **Audit adverse** : cherche ce qui casse. Mode test allumé pendant une injection · un trou fictif qui devient occupé par une vraie classe · deux créneaux fictifs sur le même trou · le mode test basculé pendant qu'une modale est ouverte · un identifiant menteur **qui est aussi un identifiant en service dans sa vraie famille** · la grille en forme datée avec des fictifs. **Hub vide : c'est l'état réel.**

## ⑥ MÉTHODE ET DÉCOUPE

**Trois livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **③bis-a** — la classe d'essai en mode test (§①). Version **8.73.0-③bis-a**. Rapport, puis STOP.
- **③bis-b** — l'identifiant qui dit sa famille (§②). Version **8.73.0-③bis-b**. Rapport, puis STOP.
- **③bis** — la garde qui reprend la surveillance (§③), les captures, l'audit adverse, le rapport final. Version **8.73.0-③bis**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison, avant la finale. **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑦ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · `PONT/EDT/json/grille-2026-2027.json` avec les quatre créneaux fictifs · `outils/verif_edt.py` (les deux élargissements et le nouveau contrôle, raisons en commentaire) · un rapport par livraison (`rapport-2ter-03bis-a.md`, `rapport-2ter-03bis-b.md`, `rapport-2ter-03bis.md`) · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑤, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.

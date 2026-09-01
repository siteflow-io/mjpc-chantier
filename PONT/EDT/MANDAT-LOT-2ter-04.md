# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ④ · UN SEUL COLLAGE, ET L'IA NE CASSE PLUS LES IDENTITÉS
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 690 354 octets**, md5 **`a04a8e5855172efd2f4fddb0a186237f`**, **169 fonctions `edt*`**, version affichée **8.73.0-③bis**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-④**.*

*Les livraisons ①, ②, ③ et ③bis sont closes et auditées. Tu t'appuies dessus, tu n'y reviens pas.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **le prompt, quand je clique sur le bouton copier, doit contenir le json directement. comme ça pas besoin de faire deux copier coller.** »

« **tout est un objet, encore une fois** » · « **objet, donc id** » · « **ce que Paul a posé à la main survit** ».

**Concrètement.** En novembre, le responsable EDT envoie un nouveau calendrier. Paul doit le faire mettre en forme par une IA, puis le réinjecter. Aujourd'hui il fait **deux** copier-coller — la consigne d'un côté, le JSON en service de l'autre — et s'il en oublie un, l'IA travaille à l'aveugle : elle rend un fichier **sans les identifiants**, tout est traité comme neuf, et l'appariement doit rattraper ce qui pouvait l'être. **Un seul bouton, un seul collage, et l'IA reçoit l'existant : c'est là que les identités se sauvent, avant même que le site ait à les défendre.**

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL · CE QUI EXISTE DÉJÀ

**Lis avant de coder** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` **§⑤** (le cadrage de Paul, il fait foi) et **§①** (les familles et leurs préfixes) · `PONT/EDT/rapport-2ter-03bis.md` · `outils/verif_edt.py`. **`index.html` fait 1,6 Mo : ne le lis jamais en entier.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**RÈGLE DE NOMMAGE, apprise deux fois à tes dépens sur ce lot** : la garde a refusé des livraisons parce qu'une variable locale s'appelait `poser`, puis `suite` — des noms qui existent aussi hors du bloc. **Tout nom de variable locale du bloc EDT commence par `edt`.**

**CHERCHER AVANT DE FABRIQUER — le patron existe, mesuré :**
- **Le modèle de prompt du site** : `ATELIER_PROMPT_SEED` (L7275) et la famille `atIA*` — `atIAChargerPrompt` (L7321), `atIACopier` (L7391), `atIAApercu`, `atIAAppliquer`. **Reprends ce patron, ne l'invente pas.**
- **La copie dans le presse-papier** : une seule occurrence de `navigator.clipboard` dans tout le fichier (L4615). **Va voir comment elle est appelée et ce qu'elle fait quand elle échoue** avant d'en écrire une deuxième.
- **Les prompts** : `PONT/EDT/prompts/calendrier.md` (6 573 o, 55 lignes) et `prompts/grille.md` (7 494 o, 87 lignes). **Mesuré : ni l'un ni l'autre ne parle d'identifiants.** `calendrier.md` porte encore une mention de `justifie` — c'est l'interdit posé en ②a, vérifie-le et garde-le.
- **Mesuré : il n'existe AUCUNE fonction de prompt dans le bloc EDT.** Tout est à brancher, rien n'est à défaire.

**L'état réel** : `/site/edt` au hub est **`null`**. **C'est le cas courant, pas un cas limite** : le prompt doit donc dire proprement « aucun calendrier en service — c'est une première injection », **jamais un vide muet**.

**LE CONTRAT DE LA GARDE** ne contient aujourd'hui aucune fonction de copie. Si tu as besoin d'en appeler une, **tu élargis en le déclarant avec ta raison** — comme les livraisons ① et ③bis l'ont fait — **et pas d'un iota de plus**. Rappelle-toi que la garde vérifie désormais **quatre** choses, dont le chemin de l'écriture centrale : ne la contourne pas, fais-la passer.

## ① UN SEUL BOUTON, UN SEUL COLLAGE

**Ce qu'on attend, en résultat :**
1. **« Copier le prompt » copie UN SEUL bloc** : la consigne **plus** le JSON actuellement en service au hub, inséré tel quel. Paul colle une fois, et l'IA a tout.
2. **Si l'objet n'existe pas au hub — l'état d'aujourd'hui — le bloc le dit** : « aucun calendrier en service — c'est une première injection ». **Jamais un vide, jamais un `null` muet.**
3. **Le JSON inséré est celui du hub, tel quel** : ni retouché, ni réordonné, ni allégé. Ce que l'IA reçoit doit être ce que le site a.
4. **Le bouton « Sortir le JSON » reste** ce qu'il est : copier le JSON seul, sans consigne. Deux boutons, deux usages, aucun ne disparaît.
5. **Si la copie échoue** (navigateur qui refuse, page non sécurisée), **le site le dit et propose le texte à sélectionner** — jamais un bouton qui ne fait rien en silence.

## ② LES DEUX PROMPTS RÉÉCRITS — l'IA reconduit, elle ne réinvente pas

`prompts/calendrier.md` et `prompts/grille.md` sont réécrits pour que l'IA reçoive l'existant et le respecte.

**Ce que le prompt doit imposer à l'IA, en toutes lettres :**
1. **Reconduire l'`id` de tout élément qu'elle reconnaît** — même si le libellé a été retouché, même si la date a bougé. L'identifiant est la mémoire de Paul : il ne se jette pas.
2. **N'en créer aucun** : un vrai nouvel élément **sort sans `id`**, et c'est le site qui lui en donnera un. **L'IA n'invente jamais d'identifiant.**
3. **Ne jamais reformuler un libellé** : Paul reconnaît ses sorties à leur nom. Une reformulation, c'est un objet perdu.
4. **Ne rien renuméroter** : ni rangs, ni ordres, ni périodes.
5. **Ne produire aucun champ `justifie`** — il n'existe plus (livraison ②).
6. **Déclarer en fin de sortie ce qu'elle a fait** : ce qu'elle a ajouté, ce qu'elle a déplacé, ce qu'elle a supprimé, et ce dont elle n'était pas sûre. **Paul lit cette déclaration avant d'injecter.**
7. **Les préfixes de famille sont expliqués** — `evc:` un événement de classe, `crn:` une heure de la grille, `per:` une période, `hor:` un horaire, `fer:` un férié, `vac:` des vacances, `jal:` un jalon, `eta:` l'établissement — **et l'IA a interdiction de mettre un préfixe sur un objet qui n'est pas de cette famille** (le site refuse depuis ③bis-b, autant qu'elle ne le fasse pas).

**Les prompts sont écrits pour une IA, mais Paul les relit.** Pas de jargon inutile : il vient de demander une passe de simplification des textes, ne lui en fabrique pas de nouveaux.

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT — ne l'anticipe pas

- **Les heures perdues, les quatre motifs, la banalisation, l'alerte mensuelle** : livraison ⑤.
- **Les trois issues, l'heure à replacer, les dates de l'année** : livraison ⑥.
- **La vue Année** : livraison ⑦. **Les photos** : livraison ⑧.
- **La passe de simplification des textes affichés** : dette déclarée par Paul le 01/09, **livraison à part, pas ici**.
- **La confrontation des dettes au code** : dette à statut propre, ce n'est pas un travail d'exécutant.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ③ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`EDT_ANNEE` 12** · **`function edt*` 169**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels**.
- **La classe d'essai reste invisible hors mode test** : 30 créneaux, comptes par classe inchangés.
- **Les huit bancs des livraisons précédentes rejoués**, avec leurs chiffres.
- **Les 122 identifiants du calendrier réel** : 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision.
- **Double parseur vert** · **garde verte sur ses quatre questions**.

## ④ PREUVES EXIGÉES — mesurées, aucune affirmée

Un chiffre, un chemin, une commande. Une preuve obtenue en appelant une fonction à la main **se déclare comme telle**.

1. **Un seul collage** : le contenu copié, mesuré — il contient la consigne **et** le JSON. Donne sa taille et ses premières lignes.
2. **Hub vide** (l'état réel) : le bloc dit « aucun calendrier en service — c'est une première injection ». Donne le texte exact.
3. **Hub garni** : le JSON copié est **identique bit à bit** à celui du hub. Compare les md5.
4. **Le bouton « Sortir le JSON » n'a pas changé** : ce qu'il copie, avant et après.
5. **La copie qui échoue** : le site le dit et propose le texte. Donne le message.
6. **Les prompts portent les sept consignes du §②** : cite-les, une par une, avec leur ligne.
7. **`justifie` reste à zéro** dans les deux prompts, hors l'interdit lui-même.
8. **Épreuve de bout en bout, celle qui compte** : prends le calendrier réel du hub, fais-le passer par le prompt (à la main si besoin, **déclare-le**), réinjecte le résultat → **tous les identifiants sont reconduits, 0 arrivant, 0 faible**. C'est la preuve que le prompt fait son travail : donne-la en premier.
9. **Non-régression** : la liste chiffrée du §③, les huit bancs rejoués.
10. **Garde** : verte sur ses quatre questions, **et rouge sur quatre contrôles négatifs que tu poses toi-même**, un par question. Tout élargissement déclaré avec sa raison.
11. **Captures par clics** : le bouton cliqué, le contenu copié visible, avant/après, écran entier, journal.
12. **Audit adverse** : cherche ce qui casse. Hub vide · JSON énorme · JSON qui contient déjà la consigne · presse-papier refusé · un objet sans `id` mêlé à des objets qui en ont · une IA qui rendrait des identifiants inventés · un prompt copié deux fois de suite. **Hub vide : c'est l'état réel.**

## ⑤ MÉTHODE ET DÉCOUPE

**Deux livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **④-a** — le bouton, le collage unique, le cas du hub vide (§①). Version **8.73.0-④a**. Rapport, puis STOP.
- **④** — les deux prompts réécrits (§②), l'épreuve de bout en bout, les captures, l'audit adverse, le rapport final. Version **8.73.0-④**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison, avant la finale. **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑥ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · `PONT/EDT/prompts/calendrier.md` et `prompts/grille.md` réécrits · `outils/verif_edt.py` si tu élargis le contrat, raison en commentaire · un rapport par livraison (`rapport-2ter-04a.md`, `rapport-2ter-04.md`) · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §④, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.

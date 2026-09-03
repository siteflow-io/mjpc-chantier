# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ⑪ · DE BOUT EN BOUT
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 762 154 octets**, md5 **`45337e4f5722d6fb118e918bcd792be2`**, **226 déclarations `edt*` pour 226 noms distincts**, version affichée **8.73.0-⑨**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-⑪**.*

## POURQUOI — dans les mots de Paul

« **il faut que mes demandes initiales soient exécutées de bout en bout.** »

« **Pour la classe test il faut simplement qu'elle soit en couleur.** »

« **Et pour le mode test qui vide tout à la sortie, il faut régler le problème.** »

**Le parcours complet de la livraison ⑩ a montré trois choses que Paul ne peut pas faire ou ne peut pas voir. Elles étaient dans ses demandes initiales. Cette livraison les termine.**

## ① LES DATES DE L'ANNÉE, SAISISSABLES — c'est ce qui bloque le promeus

**Mesuré par la conscience** : `edtPoserDateAnnee` — la fonction qui pose `debutAnnee` et `finAnnee`, **et qui porte déjà les trois refus** — **a UNE SEULE occurrence dans le fichier : sa propre déclaration. Aucun appelant.**
**Et regardé sur la capture `p24`** : l'écran « 🎓 Dates de l'année » ne porte que **quatre champs, un par niveau** — 3e, 4e, 5e, 6e — et « Revenir aux dates par défaut ». **Ce sont les dates du brevet. Ni début, ni fin d'année scolaire.**

**Le mandat ⑥ §⑤.2 exigeait : « produits par le prompt du calendrier, injectés avec lui, MODIFIABLES À LA MAIN ».** Les deux premiers sont faits. **Le troisième n'existe pas.**

**Ce qu'on attend :**
1. **Deux champs de plus sur cet écran** — « début de l'année » et « fin de l'année » — **au même endroit que les dates du brevet**, mêmes champs date, **et qui appellent `edtPoserDateAnnee`**. Elle existe, elle valide, elle écrit : **tu la branches, tu ne la réécris pas.**
2. **Les trois refus s'affichent à l'écran, par le geste** : fin avant début · plus de treize mois · hors des bornes du calendrier injecté élargies d'un mois. Ce sont ceux de `edtValiderDatesAnnee`, **déjà écrits**.
3. **Le nœud ne change pas de nom** : `/site/config/brevetDates`, comme depuis ⑥.
4. **Si Paul avance `finAnnee`, les heures posées au-delà redeviennent des heures à replacer**, nommément — `edtHeuresApres` existe et `edtPoserDateAnnee` l'appelle déjà. **Prouve-le par le clic.**

## ② LA CLASSE D'ESSAI EN COULEUR — tranché par Paul

**Regardé sur `p28`** : la classe d'essai **apparaît bien** aux quatre créneaux (lundi 08:00, mardi 08:00, jeudi 10:07, vendredi 13:00), **mais elle est affichée comme une classe ordinaire**. Le libellé « classe d'essai » est **dans la donnée, pas à l'écran**.

**Paul a tranché : « il faut simplement qu'elle soit en couleur. »**

**Ce qu'on attend :** ses cases portent **une couleur qui les distingue au premier coup d'œil**, dans **toutes** les vues où elles apparaissent — semaine, mois, année. **Une couleur, pas un texte de plus** : c'est ce qu'il a demandé. Rien d'autre ne change : ni le nom, ni le comportement, ni les comptes.

## ③ LE MODE TEST NE VIDE PLUS L'ÉCRAN — et le remède existe déjà dans le site

**Mesuré par la conscience, L1789 :**
`_siteGet` en mode test fait `cb(M8_TEST_STORE[chemin] !== undefined ? M8_TEST_STORE[chemin] : null)` — **il rend `null` dès que la clé n'est pas dans le magasin de test**. Comme le magasin part vide, **tout est nul au premier chargement** : plus de chapitres, plus de séances. C'est ce que montre `p28` — toutes les cases à « aucune séance prête ».

**LE PATRON DE LA SOLUTION EST DÉJÀ DANS TON SITE, L2153-2157** : `taxoCharger`, en mode test, **va chercher la valeur au vrai hub quand elle n'est pas au magasin, et la met en cache** :
`.then(function(v){ M8_TEST_STORE['/taxonomie'] = v; cb(v); })`
**Lire le vrai, écrire dans le faux.** C'est exactement ce qu'il faut.

**Ce qu'on attend :**
1. **En mode test, une lecture qui ne trouve rien au magasin va chercher au vrai hub et met en cache.** Paul retrouve son emploi du temps garni, avec ses chapitres et ses séances.
2. **AUCUNE écriture ne part au vrai hub. C'est intangible.** Le correctif du 27/08 dans `mjpcEcrireRest` **ne bouge pas**, et tu le remesures : md5 des 1 600 premiers octets de `mjpcEcrireRest` = **`668cda2757a5`**.
3. **En sortant du mode test, l'écran retrouve les vraies données sans rechargement** — `m8BasculerModeTest` vide déjà `M8_TEST_STORE` ; assure-toi que ce qui est en mémoire est **relu**, pas laissé nul.
4. **⚠ CE POINT EST HORS DU BLOC EDT.** `_siteGet` appartient au socle. La garde ne le couvre pas, **et tu ne dois pas l'y faire entrer**. Fais la modification **hors du bloc**, **déclare-la nommément**, et **remesure que la garde reste verte sur ses cinq questions**.

## ⓪ MÉTHODE

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. **Livre au sas, relis le md5 après poussée et publie-le.**

**RÈGLE DE NOMMAGE** : tout nom de variable locale du bloc EDT commence par `edt`.

**LES DEUX RÈGLES DE BANC, gravées par Paul** : **un banc passe par le geste, jamais par la fonction** — ce qui n'est pas atteignable par un clic n'est pas prouvé, **et se déclare comme tel** · **une preuve dit ce qu'elle contient**, pas seulement qu'elle existe.

**ET LA LEÇON DES DEUX TROUS DE CE LOT — lis-la, elle te vise :** la banalisation par-dessus une coche et les dates de l'année **existaient toutes deux dans le code, prouvées par des bancs qui appelaient la fonction — et n'étaient atteignables par aucun clic.** **Une fonction sans chemin n'existe pas pour Paul.** Pour chaque point de ce mandat : **le geste d'abord, la fonction ensuite.**

## ④ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**.
- **Correctif du mode test dans `mjpcEcrireRest` : `668cda2757a5`** — **c'est le plus important de cette livraison.**
- **`function secu*` 29** · **`published` 97** · **`edt*` 226 déclarations / 226 noms**, aucune disparue, **aucun doublon** ; toute fonction ajoutée est nommée.
- **Trois portes** · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **`edt-fige` 9** — tu ne renommes rien.
- **`EDT_CATEGORIES` et `EDT_MOTIFS` inchangés**, mot pour mot.
- **La vue Année ne contient toujours AUCUNE écriture.**
- **Hors mode test, la grille de Paul est identique** : 30 créneaux, comptes par classe inchangés.
- **`banc-tout.mjs` VERT EN ENTIER** · **double parseur vert** · **garde verte sur ses cinq questions**.

## ⑤ PREUVES EXIGÉES — par le geste, jamais par la fonction

1. **Les deux champs existent et se saisissent AU CLAVIER** : capture de l'écran avec « début » et « fin » remplis, et la valeur relue au hub.
2. **Les trois refus, à l'écran, par le geste** : trois captures, trois messages.
3. **`finAnnee` avancée par le clic** → les heures au-delà redeviennent à replacer, **nommées**. Capture.
4. **La classe d'essai en couleur** : capture en semaine, en mois, en année. **Et hors mode test : elle n'est nulle part.**
5. **Le mode test ne vide plus** : capture de la grille **en mode test**, avec ses séances et ses chapitres. Comparée à `p28`.
6. **Aucune écriture au vrai hub en mode test** : le journal du réseau, **et** le contenu du hub avant/après une session de test — **identique**.
7. **En sortant du mode test, l'écran retrouve les vraies données sans rechargement.** Capture avant/après la bascule.
8. **Non-régression** : la liste chiffrée du §④, **`banc-tout` en entier**.
9. **Garde** : verte sur ses cinq questions, **et rouge sur cinq contrôles négatifs que tu poses toi-même**. **La modification de `_siteGet` est déclarée nommément.**
10. **Audit adverse** : mode test allumé pendant une injection · une date d'année saisie puis effacée · `finAnnee` saisie avant `debutAnnee` · le vrai hub injoignable pendant le mode test · la classe d'essai un jour férié.

## ⑥ MÉTHODE ET DÉCOUPE

**Trois livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **⑪-a** — les deux champs de dates et leurs trois refus (§①). Version **8.73.0-⑪a**. STOP.
- **⑪-b** — la classe d'essai en couleur (§②). Version **8.73.0-⑪b**. STOP.
- **⑪** — le mode test qui ne vide plus (§③), les captures, l'audit adverse, `banc-tout` en entier, le rapport final. Version **8.73.0-⑪**. STOP.

**Tu ne livres jamais avec une dette.** **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑦ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · les captures dans `PONT/EDT/tests/` · `tests/banc-tout.mjs` enrichi · un rapport par livraison (`rapport-2ter-11a.md`, `-11b.md`, `-11.md`). Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑤, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.

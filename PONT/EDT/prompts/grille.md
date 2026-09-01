# PROMPT IA — « GRILLE DE L'EMPLOI DU TEMPS » (à coller dans une IA avec l'image ou l'export de ma grille)

*Ce prompt produit le JSON que la zone d'injection du panneau prof attend pour `/site/edt/grille/<année>`. Il est écrit pour être collé tel quel. Le JSON obtenu se relit et se corrige à la main dans l'EDT après injection.*

---

Tu vas convertir en JSON ma grille d'emploi du temps, que je te joins. C'est le tableau papier de mon établissement : les jours en colonnes, les heures en lignes, une case par cours.

Tu lis ce qui est écrit. Tu n'inventes aucun créneau, aucune classe, aucune salle. Si une case est illisible ou ambiguë, tu la mets quand même avec les champs que tu as pu lire, et tu la signales à la fin.

## Ce que tu dois savoir pour lire la grille

1. **Les créneaux se lisent sur la grille elle-même**, dans la colonne des heures, à gauche. Ils peuvent changer d'une année sur l'autre : ne les suppose jamais, recopie-les. Relève-les dans l'ordre et donne-les-moi dans un tableau `creneaux` séparé (voir plus bas), puis **n'utilise que ceux-là** dans les cases, écrits `HH:MM-HH:MM`. Sur ma grille de 2026-2027 ce sont : `08:00-08:55` · `08:57-09:52` · `10:07-11:02` · `11:04-11:59` · `13:00-13:55` · `13:57-14:52` · `15:07-16:02` · `16:04-16:59`, et il n'y a rien entre 11:59 et 13:00.
2. **La lettre dans un petit carré, en bas à droite d'une case, est la semaine** : `A` ou `B`. Une case **qui occupe toute la largeur du jour et ne porte pas de lettre a lieu chaque semaine** : écris `"semaine":"AB"`. Une case étroite avec sa lettre n'a lieu qu'en A ou qu'en B.
3. **Deux cases côte à côte sur la même ligne, le même jour**, ce sont deux semaines différentes : la gauche en A, la droite en B. Ce ne sont jamais deux cours simultanés.
4. **Les créneaux « X Français X. »** sont des groupes partagés avec un collègue. Ils vont dans le JSON — je veux les voir sur ma semaine — mais avec `"mjpc": false` : **ils ne comptent jamais dans ma progression**, ils ne portent jamais de séance.
5. **Une case qui n'est pas un cours** (une concertation, une liste de noms d'enseignants) va elle aussi dans le JSON avec `"mjpc": false` et un `motif`.
6. **Les étiquettes de période** — de petits libellés du genre « EDT P1 EDT P2 » ou « EDT P3 EDT P4 EDT PFIN » collés à une case — disent que ce créneau ne vaut que pendant ces périodes. Recopie-les dans `periodes`, sous la forme `["P1","P2"]`. **Une case sans étiquette vaut en toutes périodes : laisse `periodes` absent.** Ne cherche aucune date : les dates des périodes sont saisies ailleurs, à la rentrée.
7. **Le découpage de l'année se déclare, il ne se devine pas.** Relève **tous** les noms de période que tu vois sur la feuille, dans leur ordre d'apparition, et donne-les-moi dans un tableau `periodes` séparé, avec des dates **vides**. Ne complète jamais la liste, n'en retire aucune, n'invente aucun nom : si ma feuille en cite cinq, tu m'en rends cinq.

## Le fil « langue » — ce que tu ne peux pas lire sur la grille et que je te dis

J'ai une heure de langue ritualisée : une notion, une séance, des exercices. Elle ne suit pas la progression du chapitre en cours, c'est une progression décrochée. Elle est **toujours le mercredi**. Sur les créneaux que je te liste ci-dessous, ajoute `"fil":"langue"` et la `cadence` :

- 4 HUGO, mercredi 08:00-08:55 — `"cadence":"chaque semaine"`
- 4 TURING, mercredi 08:57-09:52 — `"cadence":"chaque semaine"`
- 3 FRANKLIN Aretha, mercredi 10:07-11:02 — **semaine A seulement**, `"cadence":"semaine A"`
- 3 DYLAN Bob, mercredi 11:04-11:59 — **semaine A seulement**, `"cadence":"semaine A"`

Attention au troisième : sur la grille, le mercredi 10:07 de 3 FRANKLIN Aretha occupe toute la largeur (chaque semaine). Tu dois donc en faire **deux entrées** : une en semaine A avec le fil langue, une en semaine B **sans fil** — celle-là porte le chapitre principal. Les autres créneaux du mercredi n'ont pas ce cas.

Tout créneau sans `fil` porte le chapitre principal de la classe.

## Le nom de la classe

Recopie le nom de la classe **exactement comme il est écrit sur la grille** dans `classe`. Laisse `classeMjpc` vide (`""`) : c'est le nom de la classe dans mon site, et je ferai l'appariement moi-même, plus tard.

## La forme exacte de ta réponse

Un seul objet JSON, rien avant, rien après, pas de commentaires, pas de balises de code. **Il porte trois choses d'un coup** : mes cases, les horaires de l'année (`creneauxDuSite`), et le découpage en périodes (`periodes`).

**Mes cases vivent dans `versions`**, une liste de versions datées de l'emploi du temps. Un emploi du temps change parfois en cours d'année ; chaque version a sa date d'effet, et une semaine affichée lit la version de sa date. **Tu ne m'en donnes qu'UNE SEULE**, celle de la feuille que je te joins, avec `debut` au jour de la rentrée et un `libelle` court. Je créerai les suivantes moi-même, dans le site, quand l'emploi du temps changera. Ajoute aussi `jours`, la liste des jours ouvrés, et `sansApresMidi`, les demi-journées où l'établissement n'a pas cours.

```
{
 "annee": "2026-2027",
 "source": "<le nom du fichier que je t'ai joint>",
 "creneauxDuSite": [
  {"rang":1,"debut":"08:00","fin":"08:55"},
  {"rang":2,"debut":"08:57","fin":"09:52"}
 ],
 "periodes": [
  {"rang":1,"nom":"P1","debut":"","fin":""},
  {"rang":2,"nom":"P2","debut":"","fin":""}
 ],
 "jours": ["lundi","mardi","mercredi","jeudi","vendredi"],
 "sansApresMidi": {"mercredi":"12:00"},
 "versions": [
  {
   "debut": "2026-09-01",
   "libelle": "grille de la rentrée",
   "creneaux": [
    {"jour":"lundi","creneau":"08:57-09:52","semaine":"AB","classe":"3 FRANKLIN Aretha","salle":"9","mjpc":true,"classeMjpc":""},
  {"jour":"mardi","creneau":"15:07-16:02","semaine":"B","classe":"3 FRANKLIN Aretha","salle":"9","mjpc":true,"classeMjpc":"","periodes":["P1","P2"]},
  {"jour":"mercredi","creneau":"08:00-08:55","semaine":"AB","classe":"4 HUGO","salle":"9","mjpc":true,"classeMjpc":"","fil":"langue","cadence":"chaque semaine"},
    {"jour":"lundi","creneau":"10:07-11:02","semaine":"A","classe":"X Français X. — 4 HUGO","salle":"20 / 9","mjpc":false,"motif":"groupe partagé — hors français, ne compte jamais dans la progression"}
   ]
  }
 ]
}
```

Les jours s'écrivent en toutes lettres et en minuscules : `lundi`, `mardi`, `mercredi`, `jeudi`, `vendredi`.

## LES IDENTIFIANTS — c'est ma mémoire, ne la casse pas

Avec ce prompt, je te donne **ce qui est déjà en service dans mon site** : tu le trouveras plus bas, sous « CE QUI EST EN SERVICE AUJOURD'HUI ». Chaque élément y porte un `id`. Cet `id` est ce qui relie l'élément à tout ce que j'ai posé à la main dessus — mes coches, mes décisions, mes heures marquées. Si tu le perds, je perds mon travail.

1. **Reconduis l'`id` de tout ce que tu reconnais.** Même si le libellé a été retouché, même si la date a bougé d'un jour : c'est le même événement, il garde son `id`. Recopie-le tel quel dans ta sortie.
2. **N'en invente aucun.** Un élément vraiment nouveau sort **sans `id`** — pas de champ `id` du tout. C'est mon site qui lui en donnera un.
3. **Ne reformule jamais un libellé.** Je reconnais mes sorties à leur nom. Une reformulation, pour moi, c'est un objet perdu. Recopie ce qui est écrit, même maladroit.
4. **Ne renumérote rien** : ni les rangs, ni l'ordre des éléments, ni les périodes.
5. **Ne produis aucun champ `justifie`.** Il n'existe plus dans mon site.
6. **Les préfixes disent la famille**, et tu n'en changes jamais : `evc:` un événement de classe · `jal:` un jalon · `eta:` un événement d'établissement · `fer:` un férié · `vac:` des vacances · `crn:` une heure de ma grille · `hor:` un horaire · `per:` une période. **Ne mets jamais un préfixe sur un objet d'une autre famille** — mon site refuse ces `id` et l'objet repart à zéro.
7. **Dis-moi ce que tu as fait.** À la fin, en dehors du JSON, une liste courte : ce que tu as **ajouté**, ce que tu as **déplacé** (avec l'ancien et le nouveau), ce que tu as **supprimé**, et ce dont tu **n'étais pas sûr**. C'est ce que je lis avant d'injecter.

Si rien ne t'est donné sous « CE QUI EST EN SERVICE AUJOURD'HUI », c'est ma première injection : aucun élément n'a d'`id`, et tu n'en mets aucun.

## Avant de me répondre, vérifie toi-même

- `versions` contient exactement une entrée, avec une date `debut` et une liste `creneaux` non vide.
- Chaque `creneau` d'une case correspond à une ligne de `creneauxDuSite`, au caractère près.
- Aucune case n'a deux cours à la même `semaine` : un `jour` + `creneau` + `semaine` n'apparaît qu'une fois. Si tu trouves un doublon, ne choisis pas — signale-le.
- Aucune case `AB` ne coexiste avec une case `A` ou `B` sur le même jour et le même créneau.
- Aucune case ne tombe dans une demi-journée que tu as déclarée dans `sansApresMidi`.
- Chaque nom cité dans le `periodes` d'une case existe dans le tableau `periodes`.
- Compte le nombre d'heures par classe en semaine A et en semaine B, et donne-moi ces deux chiffres. C'est comme ça que je vois d'un coup d'œil si tu as mal lu une case.

## Après le JSON

Écris, en dehors du JSON, la liste des cases que tu as lues avec un doute, les deux comptes d'heures par classe, et les noms de période que tu as relevés.

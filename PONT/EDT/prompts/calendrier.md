# PROMPT IA — « CALENDRIER DE L'ANNÉE » (à coller dans une IA avec le fichier du calendrier en pièce jointe)

*Ce prompt produit le JSON que la zone d'injection du panneau prof attend pour `/site/edt/calendrier/<année>`. Il est écrit pour être collé tel quel. Le JSON obtenu se relit et se corrige à la main dans l'EDT après injection.*

---

Tu vas convertir en JSON le calendrier scolaire de mon établissement, que je te joins. C'est un tableau : douze colonnes de mois, et pour chaque mois trois colonnes — le numéro du jour, l'initiale du jour de la semaine (L, M, Me, J, V, S, D), et une case de texte libre où tout est écrit.

Tu ne réorganises rien, tu ne complètes rien, tu ne devines aucune date. Tu lis ce qui est écrit et tu le ranges. Si une information manque, tu laisses le champ vide et tu la signales à la fin.

## Ce que tu dois savoir pour lire le fichier

1. **Les semaines A / B.** Une case porte parfois « Semaine 37 (B) ». Ce marqueur est posé sur un **dimanche** et il annonce la semaine qui commence **le lendemain**. Le numéro est celui de la semaine ISO du lundi suivant. L'alternance A/B est régulière, mais **le numéro repart à 1 au 1er janvier** : ne déduis jamais la lettre d'une parité, recopie la lettre écrite, semaine par semaine.
2. **Une case peut contenir plusieurs événements**, séparés par de grands espaces. Mais un même événement peut aussi être coupé en deux par la mise en page : quand la seconde partie n'est qu'un complément (des noms de classes, une heure, une précision), recolle-la au premier. « Séjour St Malo · · · 6es Brocéliande et Armor » est **un** événement, pas deux.
3. **Un même séjour ou stage court sur plusieurs jours**, avec un libellé qui varie d'un jour à l'autre. Regroupe-les en un seul événement `debut` → `fin`.
4. **Les heures** sont écrites « 17h », « 18h30 », « 13h30/15h ». Extrais la première en `heure`, au format `HH:MM`.
5. **Les vacances se lisent sur la COULEUR DE FOND, pas sur le texte.** Le nom (« Vac de la Toussaint ») n'est écrit que sur le premier jour, mais **chaque jour de vacances porte un fond gris** (`A6A6A6`, et `B7B7B7` pour les dimanches). Ouvre le fichier en lisant les remplissages de cellules, jour par jour : une période de vacances va du **premier au dernier jour gris consécutif**. Ne déduis jamais une date de fin, ne suppose jamais « deux semaines » : lis les fonds. Un jour gris **isolé** au milieu d'une semaine n'est pas des vacances, c'est un jour férié.
6. **Les autres fonds disent la semaine A ou B** : bleu clair (`76D6FF`) = semaine A, jaune (`FCD203`) = semaine B, gris clair (`D9D9D9`) = week-end. **Sers-t'en pour vérifier ta table des semaines** : la couleur et le marqueur « Semaine NN (A|B) » doivent toujours dire la même chose. Si tu trouves une discordance, signale-la, ne choisis pas.

## Les six familles, et la règle qui les sépare

- **`semaines`** — la table complète A/B. Un objet par marqueur : `lundi` (la date du lundi, `AAAA-MM-JJ`), `num`, `lettre`.
- **`vacances`** — `nom`, `type` (`vacances` ou `pont`), `debut`, `fin`, lues sur les fonds gris. Un bloc gris de deux ou trois jours accolé à un férié est un **pont**, pas des vacances : donne-lui `"type":"pont"`.
- **`feries`** — les jours fériés et les ponts : `date`, `libelle`. Assomption, Toussaint, Armistice, Noël, Jour de l'An, Pâques, Fête du Travail, Ascension, pont de l'Ascension, Victoire 1945, Pentecôte.
- **`jalons`** — ce qui fait échéance pour tout le monde et sert à mesurer si une classe est en retard : les conseils de classe (intermédiaires, de semestre, d'orientation), l'arrêt des notes, les journées pédagogiques, le DNB, les DNB blancs, les oraux. Champs : `date`, `libelle`, `heure` si elle est écrite.
- **`etablissement`** — tout le reste : réunions, rencontres de parents, portes ouvertes, alertes, célébrations, spectacles. Champs : `date`, `libelle`, `heure`, et **`prendLeCreneau`** : `true` si l'événement occupe une heure de cours (journée pédagogique, devoirs communs, cross, photo des classes, célébration en journée), `false` si c'est une réunion du soir ou un événement qui ne prend aucune heure de classe. Dans le doute, mets `false` et signale-le à la fin : c'est moi qui tranche.
- **`evenementsClasse`** — les événements qui ne touchent qu'un niveau ou une classe et qui expliquent qu'elle prenne du retard : séjours, stages, sorties, voyages, forums d'orientation. Champs : `debut`, `fin`, `libelle`, `niveau`, `classes` (laisse `[]` : c'est moi qui nomme mes classes). **Ne produis JAMAIS de champ `justifie`** : ce que je coche moi-même ne vit pas dans le fichier que tu écris — il serait effacé à la prochaine injection.
  **Je n'enseigne qu'en 3e et en 4e : ne garde que les événements de ces deux niveaux.** Tout ce qui ne concerne que les 5e ou les 6e sort du fichier — pas dans `etablissement`, pas ailleurs : il disparaît.
  Une **réunion de parents en soirée** n'est pas un événement de classe, même si elle nomme un niveau : c'est un événement d'établissement.

## La forme exacte de ta réponse

Un seul objet JSON, rien avant, rien après, pas de commentaires, pas de balises de code.

```
{
 "annee": "2026-2027",
 "source": "<le nom du fichier que je t'ai joint>",
 "semaines": [ {"lundi":"2026-09-07","num":37,"lettre":"B"} ],
 "vacances": [ {"nom":"de la Toussaint","type":"vacances","debut":"2026-10-17","fin":"2026-10-31"} ],
 "feries": [ {"date":"2026-11-11","libelle":"Armistice"} ],
 "jalons": [ {"date":"2027-01-07","libelle":"Soir arrêt des notes","heure":"18:30"} ],
 "etablissement": [ {"date":"2026-09-28","libelle":"Cross","prendLeCreneau":true} ],
 "evenementsClasse": [ {"debut":"2026-10-14","fin":"2026-10-16","libelle":"Séjour Verdun","niveau":"3e","classes":[]} ],
 "brevet": {"3e":"2027-06-25T08:00:00"}
}
```

Les dates sont toujours `AAAA-MM-JJ`. Les heures toujours `HH:MM`. Aucun champ inventé, aucun champ en plus.

**`brevet`** : le DNB dure plusieurs jours. Mets dans `brevet.3e` le **premier jour** du DNB écrit au calendrier, au format `AAAA-MM-JJTHH:MM:SS` avec l'heure `08:00:00`. C'est cette date que mon site retiendra comme jour du DNB.

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

## Après le JSON

Écris, en dehors du JSON, une courte liste : ce que tu n'as pas su classer, les libellés ambigus, les cases que tu as lues avec un doute, et le résultat de ta vérification croisée entre les couleurs de fond et les marqueurs de semaine. C'est cette liste que je relis en premier.

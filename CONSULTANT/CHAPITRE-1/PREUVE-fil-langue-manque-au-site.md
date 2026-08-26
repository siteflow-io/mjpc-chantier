# PREUVE — le fil langue n'existe pas dans le modèle du site

*Consultant, 26/08/2026. Relevés dans `index.html` (production 8.57.1, lecture seule), `DEROULE/deroule97.html`, `PONT/EDT/json/grille-2026-2027.json`. Aucune écriture.*

**Ce que Paul demande de vérifier :**

> « Je pense que c'est non seulement un manque du prompt, mais aussi un manque du site. Va vérifier, et prouve. »

**Verdict : confirmé.** Le fil langue existe dans l'EDT et nulle part ailleurs. Cinq relevés.

---

## Relevé 1 — Le fil existe dans la grille de l'EDT

`PONT/EDT/json/grille-2026-2027.json` porte, sur quatre créneaux, un champ `fil` :

```json
{"jour":"mercredi","creneau":"10:07-11:02","semaine":"A",
 "classe":"3 FRANKLIN Aretha","salle":"9","fil":"langue"}
```

et la note du même fichier : « Un créneau sans `fil` porte le chapitre principal de la classe. »
**Le fil est donc déclaré au niveau du créneau.**

## Relevé 2 — Rien ne lit ce champ, ni dans le site, ni dans le déroulé

- `index.html` : le mot `fil` n'y apparaît que comme métaphore d'interface — « le fil des feuilles du chapitre », `AT_FIL` (mémoire du dernier chapitre travaillé), « au fil qu'il déroule ». **Aucune occurrence ne désigne un fil disciplinaire.**
- `deroule97.html` : une seule occurrence du mot, sans rapport.
- **`AT_EDT` est une liste de créneaux horaires en dur** dans `index.html` :
  ```js
  var AT_EDT=['08:00-08:55','08:57-09:52','10:07-11:02', … ];
  ```
  Huit chaînes, sans jour, sans semaine, sans classe, sans fil. Le site ne connaît de l'emploi du temps que les heures.

**Conséquence** : un créneau peut porter `fil:"langue"` dans le JSON de l'EDT ; **aucun écran du site ne s'en sert.**

## Relevé 3 — Une séance ne peut pas déclarer son fil

Le validateur de chapitre (`atP2ValiderDeroule`) ne lit d'une séance que : `title`, `type`, `cle`, `items`, `deroule`. **Il n'existe aucun champ de fil ni de rang dans une progression.**

Les sept types de séance possibles, en dur dans `CH_TYPES_SEANCE` :

```
intro_image · etude_texte · notions · dictee_reecriture
atelier_ecriture · remediation · tache_finale
```

`notions` est le plus proche — c'est celui de la séance 3 du chapitre 1 — mais il dit **la nature** de la séance, pas son **appartenance à un fil parallèle**, et il ne porte aucun rang.

## Relevé 4 — La « progression annuelle » n'existe que comme ligne imprimée

Une seule occurrence dans tout le site, et c'est une composante de **feuille** :

```js
place_progression: AC('B','structure','ancrage',
  "Afficher la place dans la progression annuelle",
  {forme:'ancrage_ligne', champs:[CH('texte','Place dans la progression')]})
```

C'est **un champ de texte libre, imprimé sur une feuille**. Le professeur peut y écrire « 3ᵉ séance de langue de l'année » ; le site ne le calcule pas, ne le vérifie pas, ne le chaîne pas d'un chapitre au suivant. **Il n'y a pas d'objet progression.**

## Relevé 5 — Le rayon « langue » est une étagère, pas une progression

Les feuilles transversales portent un `rayon` : `'langue' | 'brevet' | 'analyse'`, avec ce commentaire du site :

> « `rayon` dit où la feuille atterrit dans l'onglet des transversales […] ABSENT = produit ANCRÉ (il vit dans la séance, il ne remonte pas). »

C'est **un classement de rangement**. Une feuille de langue se retrouve dans le bon onglet ; rien ne dit dans quel ordre les feuilles s'enchaînent, ni quelle semaine, ni quel chapitre les appelle.

---

## Ce qui manque, précisément

Trois objets, et aucun n'existe :

**① Le fil sur la séance.** Une séance doit pouvoir déclarer qu'elle appartient au fil langue et non au chapitre principal — aujourd'hui, une séance appartient à son chapitre, point.

**② Le rang dans la progression annuelle**, distinct du rang dans le chapitre. La séance 3 du chapitre 1 est la 3ᵉ séance du chapitre **et** — mettons — la 5ᵉ séance de langue de l'année. Le second nombre n'a nulle part où s'écrire.

**③ Le lien du chapitre vers le fil.** Un chapitre doit pouvoir dire ce qu'il attend de la langue et quand : « le brevet blanc de la séance 6 suppose l'analyse logique acquise ». Aujourd'hui, aucun champ ne relie un chapitre à une progression parallèle.

## Pourquoi cela compte, dans les mots de Paul

> « Ça demande une progression annuelle, mais qui traverse les chapitres chaque semaine. Donc la construction de tous les JSON des chapitres doit permettre d'intégrer ça, et c'est là où l'IA a une importance capitale pour le prof, parce qu'elle permet de relier la langue à l'échelle annuelle, à l'échelle du chapitre, et à l'échelle hebdomadaire. »

Le site sait tenir **une** échelle : le chapitre. L'EDT sait désormais tenir la **semaine**, mais son fil ne remonte à personne. L'**année** n'existe que comme une ligne de texte à imprimer.

## Ce que cela a coûté au chapitre 1

La séance 3 — propositions, subordonnées, cinq entraînements — est une séance de langue enfermée dans le fil principal, sans lien vers l'amont ni vers l'aval. Elle occupe deux créneaux du chapitre alors qu'un fil hebdomadaire existe. Et rien, dans le JSON produit, ne permettrait à une instance suivante de savoir où elle se situe dans une progression de langue : **l'information n'a pas de place où être écrite.**

## Un point que je ne peux pas vérifier

Le nœud `/3e` du hub n'est pas lisible sans authentification depuis mon environnement (`null` en lecture anonyme). Je n'ai donc pas pu vérifier si un chapitre **déjà publié** porte des champs absents du code de l'éditeur. Les relevés ci-dessus portent sur le code, pas sur les données. *À confirmer par la conscience, qui a l'accès.*

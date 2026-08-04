# M-MANIFESTE — `atEsc` : la mesure en codepoints, et un écart de base à signaler
**02/08 · exécutant → conscience**

## 1. TA MESURE ÉTAIT JUSTE, LA MIENNE ÉTAIT FAUSSE — et voici pourquoi
**En production, mesuré caractère par caractère** : la table de `atEsc` déclare sa cinquième clé **`"’"` — U+2019, à l'octet 133 du corps de la fonction** — alors que la regex cherche **`[&<>"']` avec U+0027**. Et **il n'y a PAS de `||c`**.
Donc : `'` (U+0027) est **trouvé par la regex**, **absent de la table**, et la fonction rend **`undefined`**. D'où « Atelier d**undefined**analyse logique ».
**Ma première mesure lisait l'apostrophe à l'œil** — `'` et `’` sont indiscernables dans la police du terminal. **C'est exactement le défaut que le bug lui-même illustre**, et j'y suis tombé en le cherchant.

## 2. ⚠ UN FAIT PLUS GRAVE QUE LE BUG : MA BASE DE STAGING S'ÉTAIT ÉCARTÉE
En mesurant les deux fichiers, j'ai trouvé **deux `atEsc` différentes** :
| fichier | table | `\|\|c` | md5 du corps |
|---|---|---|---|
| `index.html` **production** | clé **U+2019** | **absent** | `86cdc89c1e7f` |
| `index.staging.html` **le mien** | clé U+0027 | présent | `58850bc423b4` |
**Mon staging portait déjà une `atEsc` saine que la production n'a pas.** Je ne peux pas dire d'où elle vient — elle n'a été introduite par aucune de mes substitutions de ce morceau. **Cela veut dire que ma base de staging n'était plus la production**, et qu'en la livrant j'aurais pu emporter des différences que personne n'a auditées.
**Ce que j'en fais** : je le **signale** plutôt que de le taire, et **la correction que je livre est écrite explicitement**, pas héritée d'un écart. **Avant promotion, il faut comparer mon staging à la production en entier** — pas seulement sur mes diffs. *Une base qui dérive est un défaut de méthode plus dangereux qu'un bug de caractère : il passe tous les contrôles, puisque chaque diff est chirurgical.*

## 3. La correction — écrite, pas héritée
```js
function atEsc(s){return String(s==null?'':s).replace(/[&<>"'\u2019]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','\u2019':'&#8217;'}[c]||c;});}
```
**Les deux formes sont couvertes** (U+0027 → `&#39;`, U+2019 → `&#8217;`), **le garde-fou `||c` est posé**, et **le comportement des quatre autres caractères est inchangé**. `atEsc` reste **unique** dans le fichier ; parse **VERT**.

## 4. LE JEU DE CARACTÈRES DIFFICILES — déclaré, avec son résultat
**11 cas, 11 verts, aucun `undefined`** :
| cas | entrée | sortie |
|---|---|---|
| apostrophe droite U+0027 | `aujourd'hui` | `aujourd&#39;hui` |
| **apostrophe courbe U+2019** | `aujourd’hui` | `aujourd&#8217;hui` |
| guillemets droits | `il dit "oui"` | `il dit &quot;oui&quot;` |
| guillemets français | `« oui »` | inchangé |
| esperluette | `A & B` | `A &amp; B` |
| chevrons | `a < b > c` | `a &lt; b &gt; c` |
| accents | `é è ç œ` | inchangé |
| espace insécable U+00A0 | `mot mot` | inchangé |
| **apostrophe DANS un mot** | `l'élève` | `l&#39;élève` |
| **nom réel courbe** | `Atelier d’analyse logique` | `Atelier d&#8217;analyse logique` |
| **nom réel droit** | `L'Applaudimètre` | `L&#39;Applaudimètre` |

## 5. Le recensement des autres fonctions d'échappement — mesuré en codepoints
| fichier | fonction | codepoints > 126 dans le corps | `\|\|c` | verdict |
|---|---|---|---|---|
| `correction_dictee` | `escapeHtml` | **aucun** | absent | **sain** — remplacements en chaîne, pas de table |
| `worktrack` | `esc` | **aucun** | absent | **sain** — même forme |
| `analyse_logique` | `esc` | **aucun** | absent | **sain** |
| `index.html` | `escapeHtml` | **aucun** | absent | **sain** — ne traite pas l'apostrophe (voulu) |
**Aucune autre fonction ne porte de clé U+2019.** Le défaut était **isolé à `atEsc`**.

## 6. DÉCLARATION DE COUVERTURE
**Testé** : la table en codepoints (avant/après), le jeu de 11 cas **en Node**, le parse, l'unicité d'`atEsc`, le recensement des quatre autres fonctions.
**NON TESTÉ, ET JE LE DIS** : **le rendu réel à l'écran** que tu demandes — je n'ai pas pu jouer ce banc dans le contexte restant. **La preuve est en Node, pas au navigateur.** Restent aussi non prouvés : la publication d'une app périmée au navigateur, et le 390 px de l'écran d'écart.
**Ce que cela veut dire** : la correction est mesurée et son effet est démontré sur les onze cas, **mais tu l'auditeras sans capture d'écran**. Et **le §2 doit être traité avant toute promotion.**

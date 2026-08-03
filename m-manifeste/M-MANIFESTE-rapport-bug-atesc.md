# M-MANIFESTE — COMPLÉMENT : un bug de production trouvé par une capture
**02/08 · complète les trois rapports précédents**

## 1. 🔴 LE BUG, MESURÉ PAR MOI À LA SOURCE
La capture de mon écran d'écart affichait « **Atelier dundefinedanalyse logique** ». Mesuré dans `index.html` :
```js
function atEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"’":'&#39;'}[c];});}
```
**La classe capture l'apostrophe DROITE `'` (U+0027). La table définit l'apostrophe TYPOGRAPHIQUE `’` (U+2019).** Vérifié par les codes : clés `0x26, 0x3c, 0x3e, 0x22, **0x2019**` ; caractère capturé : **U+0027**.
**Conséquence** : `table['\'']` vaut **`undefined`**, et `String.replace` écrit littéralement « undefined ». **Toute apostrophe droite disparaissait au profit de « undefined ».** Et symétriquement, `’` n'était **jamais échappée** — sans danger, mais l'intention était inverse.
**Étendue mesurée : 133 appels à `atEsc` dans `index.html`** — l'écran de chapitre, le sommaire, les diaporamas, l'inventaire, l'écran d'écart. **Tout texte contenant une apostrophe droite était touché.**

## 2. LA CORRECTION, et pourquoi elle est double
```js
return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c;
```
· **la clé devient l'apostrophe droite** — celle que la classe capture ;
· **`|| c` est ajouté** : si un caractère capturé n'a pas d'entrée dans la table, **il est rendu tel quel** au lieu de devenir « undefined ». **La première correction répare le cas connu ; la seconde empêche la classe entière de bugs.** C'est ce garde-fou qui manquait : une table incomplète ne devrait jamais produire du texte faux, seulement du texte non échappé.
**Prouvé, 5/5** : `"Atelier d'analyse logique"` → `Atelier d&#39;analyse logique` · `"L’Applaudimètre"` → intact · `<script>` → `&lt;script&gt;` · `a & b` → `a &amp; b` · `"guillemets"` → `&quot;…&quot;`. **L'échappement HTML reste entier : rien n'est affaibli.**
`index.html` **8.17.0 → 8.18.0** · **686 858 o · `c2f4dc16622ff8f30f8acfe13d69040a`** · parse **VERT**.

## 3. Ce que ce bug apprend, et qui dépasse la correction
**Aucun parseur ne pouvait le voir** : le JavaScript est valide, la fonction rend une chaîne. **Aucun banc mémoire ne l'a vu** : mes stubs d'`atEsc` étaient `x=>String(x)`, donc plus corrects que la vraie fonction. **Seule une CAPTURE l'a montré** — c'est-à-dire un texte lu par un œil.
C'est la règle entrée dans la grille avec ce morceau, vérifiée une fois de plus : **un JSON malformé se voit au parseur, une phrase fautive ne se voit qu'en la lisant.** Et j'ajoute ce que ce cas apporte : **un stub plus simple que la fonction réelle masque les bugs de la fonction réelle** — c'est la règle du 01/08 sur les signatures, appliquée au comportement.

## 4. Le banc navigateur — 7/9
**VERTS** : les 5 fonctions sur `window` · les 9 lignes avec dates réelles · le compte des retards et la conduite à tenir · une app jamais publiée nommée · **l'écran n'écrit rien** · **AUCUN « undefined » dans les noms rendus** (le bug est corrigé à l'écran) · **390 px mesuré : zéro débordement, tableau en paires libellé/valeur, ⓘ ≥ 44 px** · **NON-PUBLICATION prouvée en `once` Firebase v8 réel**.
**ÉCHEC RESTANT, non écarté** : **la publication réelle d'une app périmée n'est toujours pas prouvée au navigateur.** `correction_dictee` chargée avec un hub à 1.1.0 ne publie pas dans mon banc. **Je n'ai pas trouvé la cause** — et je refuse d'écrire « probablement mon environnement ». Ce qui est prouvé : la logique au banc mémoire (7/7, verdict ①) et **la non-publication en navigateur réel**. Ce qui ne l'est pas : **la publication elle-même, en navigateur**. C'est la mesure qui manque à ce morceau.

## 5. UN SIGNALEMENT : `index.html` embarque encore le socle 1.5.0
Mesuré au banc : `window.MJPC_CORE_VERSION` vaut **1.5.0** dans `index`, alors que **les neuf apps sont passées en 1.6.0**. C'est **cohérent avec le périmètre** — `index` publie par `publierManifesteREST`, hors de la publication conditionnelle — **mais l'écosystème porte désormais deux versions de socle**, et l'écran d'écart compare les apps à `MJPC_CORE_VERSION` **du site**, donc à 1.5.0. **Conséquence à connaître : après promotion, les neuf apps déclareront 1.6.0 et le site les jugera « en retard » alors qu'elles seront en avance.** **Je ne le corrige pas ici** (le socle d'`index` n'est pas contigu et sa mise à jour dépasse ce morceau) : **je le signale comme bloquant pour la promotion conjointe.**

## 6. DÉCLARATION DE COUVERTURE
**Testé** : §2 (5/5), §4 (7/9 avec les deux échecs nommés).
**NON TESTÉ** : la publication d'une app périmée en navigateur · le hub réel · Chrome Windows · l'affichage chez Paul.

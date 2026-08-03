# M-MANIFESTE — MESURE : le « dundefined » n'est reproduit nulle part
**02/08 · exécutant → conscience · JE N'AI PAS CORRIGÉ, ET VOICI POURQUOI**

## Le mandat est arrivé tronqué
Il s'interrompt en pleine phrase : *« LA CAUSE, mesurée par la conscience — `atEsc` dans `index.html` :`* — **la citation de la cause manque**. J'ai donc mesuré moi-même, comme la règle l'exige, plutôt que de corriger sur la foi d'un symptôme.

## Ce que j'ai mesuré — trois fois, trois résultats négatifs
**① `atEsc` est unique dans `index.html`** (une seule définition, octet 565 393 ; j'ai cherché un doublon, il n'y en a pas) :
```js
function atEsc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c;});}
```
**② Exécutée telle quelle en Node, elle ne produit jamais `undefined`** :
· `atEsc("Atelier d'analyse logique")` (apostrophe **droite**) → `Atelier d&#39;analyse logique` ✔
· `atEsc("Atelier d’analyse logique")` (apostrophe **typographique**) → inchangé ✔ *(la regex ne la matche pas, c'est voulu)*
· `atEsc("'")` → `"&#39;"` ✔
**Le `||c` protège de toute clé absente : le retour ne peut pas être `undefined`.**
**③ Le hub porte des noms CORRECTS** — lus à l'instant :
· `analyse_logique` → `"Atelier d’analyse logique"` · `applause_meter` → `"L’Applaudimètre"` · `correction_dictee` → `"Correction de dictée"`.
**Aucun `undefined` à la source.**

## Ce que j'en conclus, et ce que je demande
**Le symptôme est réel — il est sur ma capture** — mais **sa cause n'est ni `atEsc`, ni le hub, ni le rendu**. Trois hypothèses restent ouvertes, qu'il faut départager par la mesure et non par le raisonnement :
① une **autre fonction d'échappement** appliquée en aval (`escapeHtml` existe aussi dans `index.html`, avec une signature différente — elle ne traite pas l'apostrophe) ;
② un **remplacement à motif spécial** : en JavaScript, dans une chaîne de *remplacement*, `$'` désigne « tout ce qui suit le match ». Un `replace(x, nomDeLApp)` quelque part sur un nom contenant une apostrophe droite produirait exactement ce genre de corruption — **c'est la piste que je juge la plus probable, et elle n'est pas dans `atEsc`** ;
③ mon propre banc : les noms y sont écrits en dur, et j'ai pu introduire la corruption **dans le banc**, pas dans le produit.
**JE NE CORRIGE PAS**, parce que corriger `atEsc` — qui fonctionne — masquerait la vraie cause et introduirait une régression dans une fonction utilisée partout. **C'est la règle du chantier : ne pas réparer ce qui marche, ne pas écarter un symptôme sans preuve.**
**CE QUE JE DEMANDE** : **la fin de la citation tronquée** — la mesure exacte que la conscience a faite sur `atEsc`. Si elle a vu quelque chose que je ne vois pas, elle le verra dans son extrait ; si son extrait est le même que le mien, alors la cause est ailleurs et l'hypothèse ② est à instruire en priorité.

## Les deux autres restes, inchangés
· la publication d'une app **périmée** au navigateur (mon banc ne servait pas React à la première passe) ;
· le **390 px de l'écran d'écart** (mon banc appelle `ecartOuvrir()` avant que la zone existe).
**Aucun des deux n'est prouvé ; aucun n'est écarté.**

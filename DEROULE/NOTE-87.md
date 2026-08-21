# deroule87 — promotion du 21/08/2026 (ordre de Paul : « promeus 87 »)

**Correctif unique** (1 ligne insérée dans `majB`, +200 caractères, rien d'autre) :
éditer un bloc visuel par le panneau (contenu, forme, position, référence, légende)
lève son drapeau `neuf` — le bloc devient montrable.

**Bug corrigé** : `neuf` (« jamais montré à la classe ») ne tombait que sur l'édition
des champs TEXTE (`txt/titre/def/q`, dans `lire()`). Un schéma ou une image, édités
par le panneau (`setSrc/setForme/setPos/setRef/setLeg` → `majB`), restaient « neufs »
à vie : grisés au pilote, JAMAIS envoyés au tableau, et le drapeau se gravait dans la
trame enregistrée. Prouvé au banc sur le moteur nu (86 : schéma jamais projeté ;
87 : projeté dès l'édition). Reproduit depuis la vidéo de Paul du 21/08.

**Sémantique conservée** : un bloc visuel inséré puis jamais touché reste non
montrable (le filet anti-brouillon d'origine).

md5 deroule87.html : 98a216b842ffa53cabcf06921bf195ff
md5 deroule86.html (conservé pour histoire/témoin) : 2ffada12d20d30ab719d20238cd1eef8

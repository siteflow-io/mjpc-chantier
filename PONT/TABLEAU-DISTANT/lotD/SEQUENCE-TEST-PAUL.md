# LOT D — SÉQUENCE DE TEST MANUELLE DU PROFESSEUR, GESTE PAR GESTE
Deux machines réelles · URL de production · **après promotion seulement**.
Ajoute `&v=8680` (ou `?v=8680` s'il n'y a pas déjà un `?`) à chaque adresse pour être certain de ne pas lire une page en cache. Vérifie la pastille de version : elle doit dire **8.68.0**.

**PC FIXE** = la machine où tu pilotes.
**PORTABLE** = la machine branchée au vidéoprojecteur, en `?vue=tableau`.

---

### Préparation (une fois)
1. **PC FIXE** — ouvre `https://siteflow-io.github.io/monsieurjaipascompris/index.html?v=8680`. **Attendu** : pastille **8.68.0** en bas.
2. **PORTABLE** — ouvre `https://siteflow-io.github.io/monsieurjaipascompris/index.html?vue=tableau&v=8680`, plein écran (F11). **Attendu** : fond sombre, horloge, « Aucun cours en cours ».

### Le test qui décide — le zoom et les fils
3. **PC FIXE** — Panneau prof → **Atelier** → **Mes chapitres** → **Modifier** (Poésie et peinture) → onglet **Déroulé** → choisis **3E Charles de Gaulle** → **▶ Lancer la séance**.
   **Attendu** : bandeau vert **EN CLASSE**, pastille « ● session ».
   ⚠ **Ce lancement est ce qui pose les identités.** Une séance lancée avant la promotion n'en a pas : si tu reprends une heure en cours, **clos-la et relance-la**, sinon le décalage reviendra — c'est normal et c'est borné à ce cas.
4. **PORTABLE** — en ≤ 2 s, l'attente laisse place au tableau, **écran 1, rien de dévoilé**.
5. **PC FIXE** — pousse la **réglette de zoom à fond à droite** (52 pt) sur l'écran 1.
   **Attendu au PC FIXE** : un ou plusieurs écrans « suite 1 », « suite 2 » apparaissent dans la colonne de gauche, groupés en pointillés sous « Analyse d'images ».
   **Attendu au PORTABLE** : **rien ne bouge**. Toujours l'écran 1, toujours au même dévoilement.
6. **PC FIXE** — appuie sur **▶ dévoiler**, lentement, une dizaine de fois, jusqu'à passer **sur la suite 1**, puis **la suite 2**.
   **C'EST LE POINT DU LOT. Attendu au PORTABLE, à chaque appui** :
   - le bandeau d'activité reste « **HEURE 1 · ANALYSE D'IMAGES : LA ROUTINE** » — il ne saute **jamais** à « Tableau 1 », « Tableau 2 », « Tableau 3 » ;
   - le texte **s'allonge** à chaque appui : la consigne, puis les étapes 1, 2, 3… une à une ;
   - **rien n'apparaît que tu n'aies dévoilé** — pas la suite du texte, pas la question à venir.
   *(Avant ce lot, le portable sautait à l'activité suivante dès le premier fil. Si tu revois ce saut, le lot a échoué : dis-le tel quel.)*
7. **PC FIXE** — appuie sur **◀ replier**, trois ou quatre fois.
   **Attendu au PORTABLE** : le texte **raccourcit** dans le même ordre, à l'envers. Toujours la même activité.

### Les épreuves de bordure
8. **PC FIXE** — ramène la **réglette de zoom au cran 2**. **Attendu** : les suites disparaissent au PC FIXE ; **le PORTABLE ne bouge pas d'un signe**.
9. **PC FIXE** — rezoome à fond, dévoile jusque dans un fils, puis **❄ Gel**. Navigue de deux écrans.
   **Attendu au PORTABLE** : **l'image ne bouge pas du tout**. Dégèle : il rattrape **le bon écran**, au bon dévoilement.
10. **PC FIXE** — ouvre une **fiche** pendant que tu es sur un fils. **Attendu au PORTABLE** : la fiche s'affiche, **la bonne**, au bon endroit.
11. **PORTABLE** — **actualise la page en pleine séance** (F5).
    **Attendu** : après 3 à 5 s, elle revient **sur l'écran où tu es**, au bon dévoilement — pas au début, pas sur l'activité suivante.

### Fin
12. **PC FIXE** — **■ Clore la séance**. **Attendu** : le bilan de fin d'heure n'annonce que **les vraies** modifications.

---

## Ce que je te demande de me rapporter, même si tout va
Pour chaque pas 6 à 11 : **ce que montrait le portable**, en tes mots. Si un seul pas montre autre chose que l'attendu, note **le numéro du pas et ce que tu as vu** — c'est ce qui me permettra d'instruire, pas une impression générale.

## Un point à part
Le jeton du sas a circulé en clair dans la conversation qui a produit ce lot. **Révoque-le et regénères-en un** une fois la promotion faite.

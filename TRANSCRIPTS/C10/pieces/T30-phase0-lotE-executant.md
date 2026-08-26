[Document collé par Paul au tour 30 : « LOT E — PHASE 0 close. Aucun code écrit. Trois mesures changent la donne. » — exécutant, 25/08/2026 ; texte intégral au document 13 de la conversation, recopié ci-dessous]
Mandat LOT E reçu. Phase 0 : instruire, mesurer, rapporter — aucune ligne de correctif.Trois découvertes qui changent l'arbitrage. Je pousse la mesure là où elle décide.Le point qui décide est mesuré. Une dernière vérification fonde la voie que je vais proposer.# LOT E — PHASE 0 close. Aucun code écrit. Trois mesures changent la donne.

Sceau vérifié : prod **8.68.0**, md5 `868477343d…`, 1 491 450 o — mon candidat D promu tel quel.

## ⓵ Je retire ce que j'avais avancé en fin de lot D

J'avais dit : *si le zoom traverse, le mur va se scinder et projeter des fils à la classe.* **C'est faux.** Le cadre moteur de la vue distante est en `display:none` — **mesuré : 0 px de haut**. `deborde()` mesure dans le cadre ; sans hauteur, il ne détecte jamais rien. **La vue ne peut pas scinder, quoi qu'on lui envoie.** Mon argument ne valait rien.

## ⓶ Mais la voie (i) toute seule ampute le cours

Écran 1, consigne + six étapes, tout dévoilé. On pose le cran, rien d'autre :

| cran | police au mur | contenu | boîte 768 px |
|---|---|---|---|
| 2 — 32 pt | 43,0 px | 601 px | ✔ tient |
| 3 — 38 pt | 51,1 px | 778 px | **rogné de 10 px** |
| 4 — 44 pt | 59,1 px | 1 171 px | **rogné de 403 px** |
| 5 — 52 pt | 69,9 px | 1 434 px | **rogné de 666 px** |

**Capture regardée** : au cran 5, le mur coupe **l'étape 3 en plein milieu** et **les étapes 4, 5, 6 n'existent plus**. `overflow:hidden` les mange sans un mot. Ton écran de contrôle, lui, les a toutes — **tu ne le saurais pas**. Aujourd'hui le mur est petit mais complet ; en voie (i) nue il serait grand et amputé.

## ⓷ Le téléphone tranche entre les deux voies

**Le cadre moteur du téléphone fait aussi 0 × 0 px.** Il ne scinde jamais. Quand tu pilotes du fond de la classe, la scène qu'il émet porte **toujours `morceau: 0`**. La voie (ii) — « le mur recopie le morceau du pilote » — n'a alors **rien à recopier** : elle marcherait au PC et casserait au téléphone, c'est-à-dire **exactement quand tu dépends le plus du mur**.

## ⓸ La mesure qui ouvre la sortie

J'ai donné au cadre de la vue une boîte réelle 16/9 et posé le cran. Même contenu, même dévoilement :

| cran | PILOTE (632×356) | VUE (700×394) | découpe |
|---|---|---|---|
| 1 | 1 morceau [6 étapes] | 1 morceau [6 étapes] | **identique** |
| 3 | 2 morceaux [3 \| 3] | 2 morceaux [3 \| 3] | **identique** |
| 4 | 3 morceaux [2 \| 1 \| 3] | 3 morceaux [2 \| 1 \| 3] | **identique** |
| 5 | 3 morceaux [2 \| 1 \| 3] | 3 morceaux [2 \| 1 \| 3] | **identique** |

Quatre sur quatre. La raison est mesurée : rapport police/hauteur identique à 10⁻⁴ près, boîtes en 16/9, **tout le gabarit en % et en em** — homothétie pure.

## Ce que je propose à l'arbitrage : une voie (iii)

Le mur reçoit ce qu'il reçoit déjà — l'identité du **père** et le dévoilement **dans le référentiel du père** — **plus le cran**. Et il **se découpe lui-même**, avec son propre moteur, dans une boîte 16/9. Il obtient la même découpe que ton PC, et **la bonne image quel que soit l'appareil qui pilote**.

Ta règle — *« ce que je vois dans mon écran de contrôle est ce qui est au tableau, tel quel »* — est alors tenue non par recopie mais **par identité de loi**. Et la scène ne devient jamais « la donnée » : elle reste une position et un état, jamais un fragment.

## Six points que je ne tranche pas

Le choix de la boîte du cadre (et la preuve qu'il ne devient jamais visible ni cliquable) · **comment le mur choisit son morceau quand l'émetteur n'en a pas** — le sens « dévoilement cumulé → morceau » n'existe pas encore, c'est le vrai travail du lot · le gel (un changement de cran sous gel ne doit pas repeindre) · la reprise à froid (le cran doit être dans la scène persistée) · **la télécommande du téléphone** : sa palette compte déjà 9 boutons, et le geste ne doit surtout pas passer par `W.zoom()` qui toucherait son affichage · et le fait que **la voie du lot B ⑤ n'est plus en vigueur** (`degorge` n'est plus suspendue en classe, il y a une garde de position) : toute phase 1 doit partir de là, pas du rapport B.

**Un artefact déclaré** : ma fenêtre locale de banc s'ouvre en 4/3 et la boîte cesse d'être 16/9. Chez toi le vidéoprojecteur est en 16/9 — mais **la voie (iii) suppose un mur 16/9**, et je ne l'ai pas mesuré chez toi.

## TESTS MANUELS POUR TOI

Rien à installer : aucun candidat n'existe. Deux choses te sont demandées, et elles décident du lot :

1. **La question à laquelle je ne peux pas répondre depuis un banc** : ton vidéoprojecteur affiche-t-il en **16/9** ? Si c'est du 4/3 ou du 16/10, dis-le — la découpe du mur divergerait de la tienne et la voie (iii) demanderait un correctif de plus.
2. **Deux boutons ＋/− ou cinq crans** pour la télécommande de zoom au téléphone ? Sa palette est déjà pleine à 9 boutons.

Et si tu veux voir de tes yeux ce que la voie (i) ferait au mur, ouvre `PONT/TABLEAU-DISTANT/lotE/tests/E2-mur-cran5.png` : c'est ton étape 3 coupée en deux.

MEMO

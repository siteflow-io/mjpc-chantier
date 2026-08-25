# LOT E — RAPPORT DE PHASE 0 : LE ZOOM, LES DEUX VOIES, ET CE QUE LE TÉLÉPHONE IMPOSE
Exécutant MJPC · 25/08/2026 · **écrit AVANT toute ligne de correctif.** Aucun candidat livré. La conscience et Paul arbitrent avant la phase 1.

## ⓪ SCEAU D'ENTRÉE
| | |
|---|---|
| production retéléchargée | md5 **`868477343d4375d7be4d820ab8eb2630`**, **1 491 450 o**, `APP_VERSION` **8.68.0** = attendu |
| lectures faites | `MJPC6-DETTES.md` (§1bis, le mandat de ce lot) · `MJPC6-1-DISPOSITIF.md` **addendum du 25/08** (« la vision du commandeur avant tout prompt ») et addendum du 20/08 · `MJPC6-2-DOCTRINE.md` · `MJPC6-OU-TROUVER-QUOI.md` · `INDEX-FONCTIONS` par recherche · sas : `lotD/rapport-phase0.md`, `lotD/rapport.md` §⑨, `lotB-rapport.md` ⑤, `LOTC/c3a-rapport.md`, `PASSATION §⑦` |
| hub | **lecture seule** ; faux hub en mémoire, **0 écriture sortie** sur les trois bancs · `pageerror` **0** partout |

**À QUOI ÇA SERT EN CLASSE, dans mes mots, avant de coder** : l'élève assis au fond doit pouvoir lire le mur. La réglette est le seul moyen d'y arriver. Elle ne sert pas à Paul, qui a le nez sur son écran. Quand Paul pilote au téléphone, il est **au fond de la classe** : il voit le mur comme les élèves, et il lui faut une télécommande de zoom — pas un second écran de contrôle dans la main.

---

## ① CE QUE J'AI TROUVÉ ET QUI CHANGE L'ARBITRAGE

### ⓵ Le moteur de la vue distante NE PEUT PAS scinder. Jamais.
`_drAssurerCadre` pose le cadre en `display:none`. **Mesuré : `at-dr-iframe` de la vue distante = 0 px de haut.** Or `deborde()` mesure `#contenu` **dans le cadre**, et `degorge()` s'ensuit. Sans hauteur, aucun débordement n'est jamais détecté.

Ce qui peint le mur, c'est `envoie()` → `t.innerHTML = html(n,true)` dans **la toile**, puis `cale(t)`. **La scission est un mécanisme du cadre ; la projection est un mécanisme de la toile. Les deux ne se rencontrent pas.**

**Conséquence : la crainte que j'avais exprimée en fin de LOT D — « le mur se scinderait et projetterait des fils à la classe » — est FAUSSE. Je la retire.** Elle m'a servi d'argument, elle ne valait rien : mesurée, la vue ne scinde pas, quoi qu'on lui envoie.

### ⓶ Mais alors, la voie (i) toute seule ROGNE — et silencieusement
Décor : l'écran 1 (« Analyse d'images »), consigne + **six étapes**, tout dévoilé (523 signes). On pose le cran dans le moteur de la vue, rien d'autre.

| cran | police au mur | contenu | boîte | verdict |
|---|---|---|---|---|
| 2 — 32 pt | 43,0 px | 601 px | 768 px | ✔ tient |
| 3 — 38 pt | 51,1 px | 778 px | 768 px | **⚠ rogné de 10 px** |
| 4 — 44 pt | 59,1 px | 1 171 px | 768 px | **⚠ rogné de 403 px** |
| 5 — 52 pt | 69,9 px | **1 434 px** | 768 px | **⚠ rogné de 666 px** |

**Capture regardée** (`E2-mur-cran5.png`) : au cran 5, le mur coupe **l'étape 3 en plein milieu**, et **les étapes 4, 5 et 6 n'existent plus**. `overflow:hidden` les mange sans un mot. **La classe ne les verra jamais, et Paul ne le saura pas** — son écran de contrôle, lui, les a toutes.

C'est pire que le défaut d'aujourd'hui : aujourd'hui le mur est petit mais complet ; en voie (i) nue, il serait grand et **amputé**.

### ⓷ Le téléphone ne scinde pas non plus — et cela ferme la voie (ii)
**Mesuré : le cadre moteur du téléphone fait lui aussi 0 × 0 px, `display:none`.** Donc quand Paul pilote au téléphone, `W.ECRANS` du téléphone n'est **jamais** scindé : la scène qu'il émet porte **toujours `morceau: 0`** et le `rev` du père entier.

La voie (ii) — « le mur reçoit le morceau courant du pilote, comme `envoie()` le fait localement » — suppose que l'émetteur ait découpé. **Le téléphone n'a rien à envoyer.** Une voie (ii) donnerait donc : mur juste quand Paul pilote au PC, mur non découpé (donc rogné au cran 5) quand il pilote au téléphone — c'est-à-dire **précisément quand il est au fond de la classe et le plus dépendant du mur.** La voie (ii) est écartée par le seul cas d'usage qui la mettait à l'épreuve.

### ⓸ LA MESURE QUI OUVRE LA SORTIE : à boîte homothétique et cran égal, la vue découpe EXACTEMENT comme le pilote
J'ai donné au cadre de la vue une boîte réelle 16/9 (1200 × 675, soit ~2× celle du pilote), posé le cran, et laissé son propre moteur travailler. Même contenu, même dévoilement.

| cran | PILOTE (632×356, r 1,778) | VUE (700×394, r 1,778) | découpe |
|---|---|---|---|
| 1 — 24 pt | 14,9 px · **1 morceau** · [6 étapes] | 16,5 px · **1 morceau** · [6 étapes] | **IDENTIQUE** |
| 3 — 38 pt | 23,6 px · **2 morceaux** · [3 \| 3] | 26,2 px · **2 morceaux** · [3 \| 3] | **IDENTIQUE** |
| 4 — 44 pt | 27,4 px · **3 morceaux** · [2 \| 1 \| 3] | 30,3 px · **3 morceaux** · [2 \| 1 \| 3] | **IDENTIQUE** |
| 5 — 52 pt | 32,4 px · **3 morceaux** · [2 \| 1 \| 3] | 35,8 px · **3 morceaux** · [2 \| 1 \| 3] | **IDENTIQUE** |

**Quatre crans sur quatre, découpe identique.** La raison est mesurée, pas supposée : le rapport police/hauteur de boîte est le même à 10⁻⁴ près (0,0419 / 0,0420 · 0,0664 / 0,0665 · 0,0769 / 0,0770 · 0,0909 / 0,0909), la boîte est en 16/9 des deux côtés, et **tout le gabarit de l'écran est en % ou en em** (`padding:3.2% 3.6%`, `gap:1.2%`, tailles en `em`) — donc **homothétique**. Le nombre de signes par ligne est invariant, le point de coupe aussi.

**C'est ce fait qui permet au mur de se composer tout seul, sans jamais dépendre de l'appareil qui pilote.**

---

## ② LES DEUX VOIES DU MANDAT, ET UNE TROISIÈME

| | **(i)** le mur reçoit le cran et se compose | **(ii)** le mur reçoit le morceau du pilote | **(iii)** le mur reçoit position + dévoilement + cran, ET SE DÉCOUPE |
|---|---|---|---|
| image au cran 5 | **rognée de 666 px** (mesuré) | juste | juste |
| Paul pilote au téléphone | rognée pareil | **cassée** (le téléphone n'a pas de morceau) | **juste** |
| ce qui traverse | `iz` | `iz` + la composition d'un écran | `iz` seul (+ ce qui traverse déjà) |
| la scène devient-elle « la donnée » ? | non | **oui, de fait** : elle transporterait un fragment, contre la doctrine « les fils ne vont jamais dans la donnée » | non : elle reste position + état |
| identité des écrans (LOT C2/D) | conservée | brouillée : le mur afficherait un objet sans identité propre | conservée |
| coût | 1 champ | canal lourd, un fragment par photo | 1 champ + **donner une boîte réelle au cadre de la vue** + choisir le morceau |

**Ce que je recommande à l'arbitrage : la voie (iii).** Le mur reçoit ce qu'il reçoit déjà — l'identité du **père**, le dévoilement **dans le référentiel du père** (que `_drVuePere` calcule déjà, LOT C3a ④) — **plus le cran**. Et il se compose lui-même, avec le moteur qu'il embarque déjà, dans une boîte homothétique. Il obtient alors **la même découpe que le PC** (mesuré, ⓸) et **la bonne image quel que soit l'appareil qui pilote** (le téléphone n'a rien à découper : le mur découpe pour lui).

**La règle de Paul — « ce que je vois dans mon écran de contrôle est ce qui est au tableau, tel quel » — est alors tenue non par recopie, mais par identité de loi** : même contenu, même cran, boîtes homothétiques ⇒ même découpe, même morceau, même image à l'échelle près.

**Sur `morceau` dans la scène** : il reste utile comme **repli** (émetteur d'une version antérieure) et comme **contrôle** (le mur peut vérifier qu'il tombe sur le même). Il ne doit pas devenir la source de vérité — c'est la leçon du téléphone.

---

## ③ CE QUI RESTE À INSTRUIRE, ET QUE JE NE TRANCHE PAS

1. **Quelle boîte donner au cadre de la vue.** Elle doit être 16/9 et réelle. Faut-il la caler sur la toile (donc sur le vidéoprojecteur) ou sur une taille fixe ? Mesuré : **la découpe ne dépend pas de la taille, seulement du ratio** — donc n'importe quelle boîte 16/9 convient. Mais le cadre cesse d'être `display:none` : **il faut prouver qu'il ne devient jamais visible ni cliquable** (hors champ, `pointer-events:none`, jamais focusable).
2. **Comment le mur choisit son morceau quand l'émetteur n'en a pas** (téléphone) : à partir du `rev`/`vues` du père, aller au **dernier morceau non vide** au sens du dévoilement. La fonction de recollement `_drRefusionner` et `_drVuePere` donnent la matière ; **le sens inverse — du dévoilement cumulé vers le morceau — n'existe pas encore.** C'est le vrai travail du lot.
3. **Le gel** : sous gel, la photo n'est plus renouvelée (drapeau seul). Si le cran arrive dans la photo, **un changement de zoom sous gel ne doit pas repeindre** — le contrat d'`envoie()` (« on ne repeint rien ») doit tenir. À vérifier au banc, pas à supposer.
4. **La reprise à froid** : la vue rouverte doit retrouver écran, dévoilement **et cran**. Le cran doit donc être dans la scène persistée, pas seulement dans un événement.
5. **La télécommande du téléphone** : sa palette compte **9 boutons mesurés** (`◀ replier · ▶ dévoiler · ⏮ écran préc. · ⏭ écran suiv. · ❄ gel · ✍️ à écrire · ⏱ chrono · 📺 au tableau · 🙋 qui a participé`), servis par `sesTelGeste` qui appelle le moteur local puis `sesTelPeindre`. **Un geste « zoom tableau » ne doit PAS passer par `W.zoom()`** : cela toucherait l'affichage du téléphone, ce que Paul refuse. Il doit poser le cran **dans la scène seulement**. Reste à trancher : deux boutons (＋/−) ou cinq crans ? et où, la palette étant déjà à 9 ?
6. **Le tableau LOCAL (Win+K)** ne change pas d'un octet : il suit déjà la réglette (25,2 → 54,6 px). **C'est lui la référence**, pas une spécification à écrire.
7. **La voie du LOT B ⑤ n'est plus en vigueur** : `degorge`/`reabsorbe` ne sont plus suspendues en régime classe ; il y a désormais une **garde de position** (`W.__scissionGarde` restaure `W.i`). Mesuré au LOT D et reconfirmé ici : le pilote scinde bel et bien en classe (14 → 15 → 16 écrans selon le cran). Toute phase 1 doit partir de cet état-là, pas du rapport du LOT B.

---

## ④ UN ARTEFACT DE BANC, DÉCLARÉ
Ma fenêtre tableau **locale** s'ouvre à 800 × 600 (Puppeteer), soit un ratio 4/3 : avec `height:100vh; width:auto; max-width:100vw; aspect-ratio:16/9`, `max-width` mord et la boîte cesse d'être 16/9. **Chez Paul, le vidéoprojecteur est en 16/9 et le cas ne se pose pas** — mais il se poserait sur un écran 4/3 ou une fenêtre étroite, et la découpe divergerait alors. À signaler comme condition de la voie (iii) : **elle suppose une boîte 16/9 au mur.** Non mesuré chez Paul : à confirmer par lui.

## ⑤ CE QU'AUCUN BANC NE PROUVERA
Le hub réel · le réseau de l'établissement · **le vidéoprojecteur et sa définition réelle** · deux machines physiques · le tactile du téléphone · **et surtout : si un élève du fond lit vraiment.** Le seul juge est Paul, debout au fond de sa salle.

---
*Phase 0 close. Aucun code écrit. J'attends l'arbitrage sur la voie (iii) et sur les six points du §③.*

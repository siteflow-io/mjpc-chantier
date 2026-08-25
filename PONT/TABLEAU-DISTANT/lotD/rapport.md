# LOT D — LE TABLEAU DISTANT SUIT LE PILOTE QUAND LE PILOTE EST SCINDÉ
Exécutant MJPC · 25/08/2026 · candidat `PONT/TABLEAU-DISTANT/lotD/index.html`. **STOP après livraison. Je ne promeus pas.**
Phase 0 close et rapportée dans `rapport-phase0.md` : **le défaut a été reproduit avant qu'une ligne ne soit écrite.**

## ⓪ SCEAU
| | |
|---|---|
| base retéléchargée | md5 **`d93207f7d49fbd673955a9567a010bfe`**, **1 490 438 o** = attendu (v8.67.1) |
| candidat | **1 491 450 o**, md5 **`868477343d4375d7be4d820ab8eb2630`** |
| `APP_VERSION` | **8.68.0** · `APP_VERSION_DATE` 2026-08-25 |
| double parseur | `node --check` + **acorn ES2020** sur les 2 blocs `<script>` (1 317 882 signes) : **VERTS** |
| moteur `AT_DR_B64` | **identique à l'octet** — 309 812 signes, md5 interne `2ba70f9ef8aa…` · `AT_DR_SHA256` inchangé (`dd338b0e2646a078…`) |
| `secu*` | **29 → 29, corps tous identiques** |
| `published` | **97 → 97**, jamais écrit |
| fonctions | **1 modifiée · 0 neuve · 0 supprimée · 0 renommée · 0 rétrécie** |
| zones de diff | **3** (le correctif, `APP_VERSION`, `APP_VERSION_DATE`) |
| écritures **sorties** vers le hub, sur tous les bancs | **0** |

## ① LE CORRECTIF — une seule fonction, une fonction existante appelée
`atDrJouer` — **2 069 → 3 081 o** (+1 012, dont ~950 de commentaire doctrinal ; **une seule ligne exécutable**), au point de passage L14870 :

```js
var _ecrans=JSON.parse(JSON.stringify((tr&&tr.ecrans)||[]));
/* [LOT D ①] LA COPIE JOUÉE NAÎT IDENTIFIÉE. … */
try{ _drIdentifierEcrans(_ecrans); }catch(e){}
```

**Rien n'a été créé** : `_drIdentifierEcrans` existe depuis le LOT C2, c'est la fonction que `MJPC6-OU-TROUVER-QUOI.md` désigne pour « l'identité des écrans ». Elle est appelée **avant** l'écriture au hub.

**Pourquoi cela suffit, et pourquoi cela ne peut pas laisser deux états coexister.** `atDrJouerClic` passe **le même tableau** au moteur (`DR.dr_ouvrir(..., copie.ecrans, ...)`), et `dr_ouvrir` normalise par `_drNormaliserTrame` → `_drIdentifierEcrans`, qui **n'ajoute une identité qu'à l'écran qui n'en a pas** (`if(!e.eid)`). Le pilote hérite donc **exactement** des identités écrites au hub. Il n'existe aucun chemin où la copie du hub et la trame du pilote divergent : elles sont **le même objet au même instant**, pas deux copies qu'il faudrait tenir synchrones. La vue distante, qui normalise elle aussi, **conserve** les identités qu'elle trouve et n'en fabrique plus.

**Intouchés, corps comparés à l'octet** : `_drIdentifierEcrans` · `_drNormaliserTrame` · `_drEidDuRang` · `_drRangDeLEid` · `_drRangPere` · `_drVuePere` · `_drRefusionner` · `_drCopieAuto` · `sesEmettre` · `sesPhoto` · `_sesRangLocal` · `sesAppliquer` · `sesTabPoll` · `sesTabMonter` · `sesCoursEcrire` · `atDrJouerClic` · tout le T-5 · les 29 `secu*`.

## ② LA QUESTION DOCTRINALE — instruite, tranchée, et pourquoi
> *les `eid` vivent-ils dans la préparation ou seulement dans le joué ?*

**Ils vivent dans les deux, mais ce lot ne touche QUE le joué — et c'est la bonne couche.** Sur pièces :
- `_ecrans` est une **copie profonde** de `tr.ecrans` : la trame de préparation du hub n'est pas modifiée d'un octet par ce correctif. Mesuré au banc.
- La préparation *peut* déjà en porter par un autre chemin : `dr_exporterTrame` (L15528) **conserve** les `eid` et `_drRefusionner` les préserve sur le père (il ne les efface que sur les fils, L16063). Donc dès que Paul ouvre le déroulé en préparation et enregistre, les `eid` sont persistés. **Celle de Paul n'en a pas** parce que ce chapitre vient de l'injection JSON et n'a jamais été réenregistré depuis le déroulé.
- **C'est précisément pourquoi le correctif ne doit pas s'appuyer sur la préparation** : une trame injectée, importée ou fraîchement créée n'en aura jamais. Identifier **au lancement** garantit l'identité *quelle que soit la provenance de la trame* — par construction, pas par une habitude d'usage. C3a ⑤ dit la même chose dans l'autre sens : l'identité est posée **à la naissance**, et pour une séance jouée, la naissance, c'est le lancement.

## ③ LE BANC REJOUÉ À L'IDENTIQUE — base contre candidat
Même script, même décor, même parcours de clics (`tests/banc-phase0.mjs`).

| mesure | base 8.67.1 | candidat 8.68.0 |
|---|---|---|
| `eid` dans la copie jouée écrite au hub | **AUCUN** ×14 | **14 identités** |
| identités **communes** pilote / vue distante | **0 / 14** | **14 / 14** |
| pas en décalage | **6 / 11** | **0 / 11** |
| pilote sur le morceau 1 | tableau → « Tableau 1 » | tableau → **le PÈRE** |
| pilote sur le morceau 2 | tableau → « Tableau 2 » | tableau → **le PÈRE** |
| pilote sur le morceau 3 | tableau → « Tableau 3 » | tableau → **le PÈRE** |
| dévoilement projeté, morceaux 1→3 | 205 · 181 · 164 signes (contenus **étrangers**) | **293 → 403 → 463 → 573** signes (le père, **cumulé, croissant**) |
| `pageerror` | 0 | 0 |
| écritures sorties | 0 | 0 |

**Captures entières des deux pages côte à côte** : `D-avant-8.67.1.png` et `D-apres-8.68.0.png`.

## ④ LES ÉPREUVES EXIGÉES EN PLUS (`tests/banc-D2.mjs`)
| épreuve | base 8.67.1 | candidat 8.68.0 |
|---|---|---|
| **dévoiler** jusqu'au 2ᵉ morceau | « Tableau 2 » — **décalage** | **le père**, 463 signes ✔ |
| **replier** ×3 (sens inverse) | « Tableau 1 » — **décalage** | **le père**, 463 → **293** signes ✔ |
| **replier** ×6 | père, 186 signes | père, **186** signes ✔ |
| **dézoom** (les fils meurent) | tableau inchangé, 186 ✔ | tableau **inchangé**, 186 ✔ |
| **gel**, pilote avancé | figé à 181 — **mauvais écran** | **figé** à 463 — **bon écran** ✔ |
| **dégel** — rattrapage | « **Tableau 4** » — décalage | **le père**, 615 signes ✔ |
| **reprise à froid** de la page tableau en pleine séance | rouverte sur « **Tableau 4** » — **mauvais écran** | **rouverte sur le bon écran**, 615 signes ✔ |
| **total** | **4 pas en décalage / 7** | **0 / 7** |

## ⑤ LA QUESTION OUVERTE DU MANDAT — répondue à l'image, dans les deux sens
> *quand le pilote est sur le morceau 2 d'un père scindé, le `rev` transmis suffit-il pour que le tableau non scindé dévoile exactement ce que la classe doit voir ?*

**Oui, et c'est prouvé dans les deux sens.** `sesPhoto` (L16544) appelle `_drVuePere` dès que l'écran courant est une suite : le groupe est **refusionné jusqu'au morceau courant** par `_drRefusionner`, et le `rev`/`vues` transmis est celui du **père entier**, morceaux suivants exclus. Le tableau, qui n'a pas scindé, applique ce référentiel à son unique écran.

- **Sens dévoiler** : 293 → 403 → 463 → 573 → 615 signes, strictement croissant à mesure que Paul avance dans les morceaux.
- **Sens replier** : 463 → 293 → 186 signes, strictement décroissant.
- **À l'image** (`D-apres-8.68.0.png`) : pilote sur le 5ᵉ morceau, le tableau projette « HEURE 1 · ANALYSE D'IMAGES : LA ROUTINE » avec la consigne et **ses six étapes** — ni moins, ni la suite du texte.

**La mécanique de C3a ④ était donc juste ; il lui manquait seulement que l'identité du père soit trouvable.** Ce lot la lui donne.

## ⑥ UNE OBSERVATION QUE JE NE TRANCHE PAS
`_drNormaliserTrame` **fabrique** des identités à toute trame qui entre, y compris dans la vue distante en lecture seule (L16824, L16864). Sur une trame nue, elle invente donc des identités qui ne sont celles de personne — c'est ce qui rendait le repli inévitable. Après ce lot, le cas ne se produit plus pour une séance lancée depuis 8.68.0 ; il subsiste pour **une séance déjà en cours lancée sous 8.67.1** (le pointeur `cours_actif` de Paul, aujourd'hui). **Effet borné et connu : relancer la séance suffit.** Faut-il en outre interdire à la vue de fabriquer des identités ? Cela ne change rien au comportement (le repli sur le rang joue de toute façon), cela retire une source de confusion, et cela touche une fonction partagée par six portes. **Je ne le fais pas seul** : la conscience arbitre.

## ⑦ MATRICE ACTIONS × ÉTAT (`PASSATION §⑦`) — reprise ligne à ligne, avec l'effet sur l'`eid`
| ligne | effet sur l'`eid` dans ce lot | état mesuré |
|---|---|---|
| **copier / dupliquer** | `neuf_` et l'enveloppe `ctxDup` de C3a **intouchées** — identifiant neuf, dévoilement à zéro | inchangé |
| **couper / coller** | intouché — identifiant neuf au collage | inchangé |
| **déplacer** | intouché — **tout conservé**, c'est le même objet ; l'`eid` voyage avec lui, et c'est tout l'intérêt | inchangé |
| **supprimer** | `purgeMarques` intouchée ; l'`eid` disparaît avec son écran | inchangé |
| **ajouter** | neuf à zéro ; l'identité vient du point de passage de C2, **inchangé** | inchangé |
| **zoom / dézoom** | **la ligne que ce lot répare.** Les fils n'ont **aucune** identité (`_drIdentifierEcrans` fait `delete e.eid` sur `e.suite`) ; le père garde la sienne, désormais **connue du hub** ; le dévoilement est transmis au morceau et **recollé au retour** — et le tableau distant le voit enfin. Mesuré : dévoiler 293→573, replier 463→186, dézoom sans effet sur le tableau | **réparé** |
| **ouvrir / fermer une fiche** | dévoilement interne conservé ; la fiche se pose sur le rang **local** du récepteur (C3a ④, intouché) — et ce rang est maintenant le bon | inchangé, désormais juste |

## ⑧ CE QU'AUCUN BANC NE PROUVERA
Le hub réel (latence, règles Firebase, coupure en cours d'écriture) · le réseau de l'établissement · le vidéoprojecteur · **deux machines physiques distinctes** · le redimensionnement à la souris par paliers · une vraie heure de 55 minutes. **Le test de Paul sur son PC fixe et son portable reste le juge.**

---
*Livré au sas, non promu. Le point de retour est la production 8.67.1, md5 `d93207f7d49fbd673955a9567a010bfe`.*

---

## ⑨ AJOUT DU 25/08 — LA QUESTION DE PAUL : « le zoom zoome-t-il sur l'écran distant ? »
**Non. Je ne l'avais pas vérifié, et le rapport ci-dessus ne le disait pas. Mesuré depuis :**
`tests/banc-zoom.mjs` et `tests/banc-zoom-local.mjs`, candidat 8.68.0, cran par cran.

| cran de la réglette | pilote | tableau **LOCAL** (Win+K) | tableau **DISTANT** (`?vue=tableau`) |
|---|---|---|---|
| 1 — 24 pt | 14,9 px | **25,2 px** | 43,0 px |
| 2 — 32 pt | 19,9 px | **33,6 px** | 43,0 px |
| 3 — 38 pt | 23,6 px | **39,9 px** | 43,0 px |
| 4 — 44 pt | 27,4 px | **46,2 px** | 43,0 px |
| 5 — 52 pt | 32,4 px | **54,6 px** | 43,0 px |

**Le tableau local suit la réglette (5 tailles distinctes). Le tableau distant ne bouge pas d'un pixel : `iz` y reste à 1 (32 pt) aux cinq crans.**

**La cause, lue puis mesurée** : `cale(t)` du moteur (L2620) calcule `H*0.056*(PT[iz]/32)` avec **le `iz` de la fenêtre qui peint**. En Win+K, c'est le moteur du pilote : le `iz` de Paul. En distant, c'est le moteur embarqué de la vue, dont le `iz` n'a jamais changé — et **la photo de scène ne transporte pas `iz`** (`sesPhoto`, L16545 : `ecran, eid, morceau, rev, vues, gele, fiche, ficheEid, chrono, quiOn, qui, trameMaj, origine, ts` — pas de cran de zoom).

**Ce lot ne change rien à cela** : le correctif ne touche que `atDrJouer`. Le tableau distant reste calibré sur **sa propre** boîte (32 pt = 5,6 % de sa hauteur), ce qui donne 43 px sur un écran de 768 px — lisible du fond de la classe. **Ce que ce lot garantit, c'est le BON ÉCRAN au BON DÉVOILEMENT ; pas la taille du texte.**

### CE QUE JE N'AI PAS TRANCHÉ, ET POURQUOI
Deux lectures s'opposent, et **elles n'ont pas la même conséquence** :
- **(a) c'est le comportement juste** — la réglette sert à *recomposer le texte de Paul dans sa fenêtre étroite* ; le tableau projeté, lui, est calibré pour la salle et n'a aucune raison de rétrécir parce que Paul a dézoomé son éditeur. Les deux scénarios divergent alors *à dessein*.
- **(b) c'est une incohérence** — en Win+K la classe voit la police changer, en distant non : **le même geste ne produit pas le même effet selon la machine branchée au vidéoprojecteur**, ce que la dette du 22/08 voulait précisément faire disparaître.

**Le risque, si l'on transmettait `iz` :** au cran 5, le texte du tableau distant passerait de 43 à ~70 px ; son propre moteur déborderait et **appellerait `degorge` sur SA trame** — la vue distante se scinderait à son tour et **projetterait des fils à la classe**, ce que la doctrine interdit (`OU-TROUVER-QUOI` : *les fils meurent au dézoom et n'ont jamais d'identité*). Transmettre le zoom exigerait donc **en même temps** de suspendre la scission côté vue. Ce n'est pas une ligne, et cela sort du périmètre de ce lot.

### TRANCHÉ PAR PAUL, 25/08 — ET L'HYPOTHÈSE (a) ÉTAIT UN CONTRESENS
**Verbatim** : « *le zoom sert pour la classe, pas pour moi. je m'en fiche d'avoir un zoom sur mon pilotage, je suis le nez sur mon écran. les élèves eux, ont besoin qu'on puisse zoomer ce qu'ils voient au tableau mur. le zoom doit se transmettre. sinon il ne sert à rien.* »

**La réglette n'a jamais servi au pilotage. Elle n'a qu'un usage : grossir ce que la classe lit au mur.** L'hypothèse (a) ci-dessus n'était pas une lecture recevable ; je l'ai fabriquée faute de connaître la finalité du mécanisme, et je la retire.

**Conséquence sur la cible, qui n'est PAS « ajouter `iz` à la photo »** : si le zoom traverse, le texte du tableau distant ne tient plus dans sa boîte, et **son moteur doit alors scinder** — ce que le mandat du LOT D écrivait déjà sans que je l'entende comme une intention : « *le tableau se scinde selon SON PROPRE écran* ». Les fils du pilote ne traversent pas ; le tableau fabrique **les siens**, à sa géométrie. C'est la raison d'être des fils : en grossissant, le contenu coule sur l'écran projeté suivant.

**Réserve que je pose sur mon propre lot** : il reste **nécessaire** (sans identité stable, le tableau ne sait pas de quelle activité on parle), mais la phrase « le tableau suit le pilote » est **trop large** : il suit sa *position*, pas sa *composition*. À corriger avant qu'elle ne se propage.

**Suite** : le message à la conscience sur ce que cette erreur dit du dispositif — et les cinq points à instruire pour le lot E — a été **remis à Paul en texte**, à sa demande. Il n'est pas au sas.

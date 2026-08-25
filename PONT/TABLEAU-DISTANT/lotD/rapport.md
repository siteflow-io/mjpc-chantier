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

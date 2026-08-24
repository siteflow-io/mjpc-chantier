# LOT B — LE TÉLÉPHONE, LE TABLEAU, L'INJECTION
Exécutant · 24/08/2026 · candidat `PONT/TABLEAU-DISTANT/lotB-index.html`. **STOP après livraison.**
Les quatre documents ont été lus avant de coder (`MJPC6-3-CHANTIER.md`, `MJPC6-journal.md`, `PASSATION-C6-C7.md`, `OU-EST-CE-DEJA-ECRIT.md`). Les points ➤ DÉJÀ DÉCIDÉ ont été appliqués, non rediscutés.

## ⓪ SCEAU
| | |
|---|---|
| base re-téléchargée | md5 **`a7def8d18988dcfc03f1869830be8d2b`**, **1 436 968 o** = attendu (v8.61.0) |
| candidat | **1 457 219 o**, md5 **`a02a60d10a40fcd81979991d1aaa1879`** |
| `APP_VERSION` | **8.62.0** (le point bloquant du LOT A est corrigé) |
| double parseur | `node --check` + acorn ES2020 : **verts** |
| moteur `AT_DR_B64` | **identique** (chaîne base64 comparée) |
| `secu*` | **29, corps identiques** |
| `published` | 97 → 97 |
| fonctions | **14 modifiées, 12 neuves, 0 supprimée, 0 rétrécie** |
| zones de diff | 39, toutes marquées `[LOT B ①…⑤]` |

## ① LE TÉLÉPHONE — banc comparatif 390×844 (`tests/banc_lotB_tel.js`), base → candidat
| défaut | mesure sur 8.61.0 | mesure sur le candidat |
|---|---|---|
| **A-0** `.ses-saisie` collée après une frappe | **`true`** — **3 boutons visibles sur 9** | **`false`** — **10 sur 10** |
| **A-3** focus au tap sur une réponse vide | sur la **réponse** ; résultat `{"i":"", "r":"ZORéponse au doigt"}` (initiales avalées par le texte) | sur les **initiales** ; résultat `{"i":"", "r":"Réponse au doigt"}` |
| **A-4** chrono | compte tourne (`run` vrai, moteur 06:58) · afficheur du téléphone **vide** | **`⏱ 06:58`**, puis **`📺 06:58`** au second geste ; `auTableau` **true** |
| **A-5** stylo | bouton « ✏️ stylo » · `ecrire` **`[]` → `[]`** (mode sans surface cliquable) | bouton « ✍️ à écrire » · `ecrire` **`[]` → `[0]`** |
| **A-6** participation à 30 élèves | 30 cartes de **56 px**, **994 px** à défiler, aucun motif | 30 lignes de **44 px**, **793 px**, **tient sans défiler**, motifs disponibles |
**A-0, la cause** : le gestionnaire `blur` d'un champ repeint le prompteur ; l'élément qui perdait le focus était détruit dans le même tour, `focusout` ne remontait jamais. L'état ne dépend plus que d'un champ réellement focalisé, vérifié à l'instant, avec un battement de sûreté — aucune commande ne peut plus rester masquée.
**A-5, ce que le « stylo » fait réellement** (moteur L2044) : il n'écrit rien, il **arme un mode** où un clic sur un bloc l'ajoute à `e.ecrire` — « ce que les élèves doivent écrire », le trait doré. Au téléphone ce mode était **structurellement inopérant** : sa surface cliquable est `#ecran`, dans le cadre invisible. Le geste est devenu **direct** (le bloc dont on parle est marqué) et le bouton porte enfin son nom. Retrait non retenu : la fonction est utile, c'était son accès qui manquait.
**A-6, le modèle est celui qui était DÉJÀ DÉCIDÉ** (PASSATION §participation) : les **trois motifs** du moteur (`MOTIFS_PART` : *a participé · a proposé une piste · on y reviendra avec lui*), la **note privée**, l'**historique par élève** avec retrait, les **compteurs pour tous** — vert = réponses retenues (`histoire()`), bleu = prises sans réponse. Un appui = +1 (« a participé ») ; un **appui long** ouvre les motifs : le professeur n'est jamais bloqué, et rien n'exige de regarder. Cibles ≥ 44 px.
**Capture regardée** : `tests/lotB-tel-apres.png` (palette : le neuvième bouton prend la largeur), `lotB-tel-apres-part.png` (la liste dense), et leurs jumelles `-avant`.

## ② L'ADRESSAGE DU TABLEAU — au patron du QCM
Bouton **« 📺 Ouvrir la vue tableau »** dans la tête du pilotage : `window.open` **nouvelle fenêtre** dimensionnée `min(1280,screen.width) × min(800,screen.height)`, `toolbar=no,menubar=no,location=no,status=no` — à glisser sur l'écran qui projette, avec l'infobulle du QCM (W+P « Étendre », F11). **La page autonome `?vue=tableau` ne change pas** : c'est son accès qui cesse d'être une URL à mettre en favori, et **l'ancienne adresse continue de fonctionner** (aucun favori cassé). Fenêtre bloquée → message qui donne le repli, jamais un échec muet.

## ③ LE TABLEAU SURVIT — et ne revient JAMAIS à l'attente
**Contresens rectifié** : aucun retour automatique à l'attente n'a été codé, et il n'en existe aucun dans le candidat (`ses-tab-att` n'est jamais remis à `block` — vérifié). Ce qui a été ajouté : une **veille du pointeur** (3 s) qui ne fait **rien** quand `cours_actif` disparaît — l'image tient — et qui **rattache** le tableau quand le pilote revient **sur un autre cours** (autre séance ou autre classe), sans quoi il resterait figé sur l'ancien et Paul devrait actualiser. La bannière dit désormais : « Pilotage interrompu à HH:MM — le tableau tient, il reprendra tout seul. »
**Hors périmètre, non inventé** : ce que le tableau montre entre deux sessions (récapitulatif, bouton « reprendre ») reste au morceau ② CLÔTURE du TEMPS DU COURS — LOT C.

## ④ L'INJECTION — banc à deux passes (`tests/banc_lotB_inj.js`), base → candidat
Décor : le hub simulé contient **le cas réel de Paul** — un unique chapitre 3e intitulé « Poésie et peinture au XIXe siècle **(proposition)** ». Le même JSON est injecté **deux fois**.
| | 8.61.0 | candidat |
|---|---|---|
| détection (passe 1) | `chapIdx: null` · « **aucun chapitre à ce titre** » | `chapIdx: "0"` · « **« Poésie et peinture au XIXe siècle (proposition) »** » |
| voies offertes | **un seul bouton** « Créer ce chapitre » | **« Compléter » · « Remplacer » · « Créer un double »** |
| modale déclenchée par ce bouton | « **Garder à côté ?** Ajouté en position 2, marqué « proposition »… » — **texte incohérent avec le clic** | « **Créer un double ?** Un double est ajouté en position 2, titre suffixé « (proposition) », non publié. **L'original reste intact.** » |
| message après écriture | « Chapitre ajouté à côté… » | « **Double créé — non publié. Il apparaît dans la liste.** » |
| **détection à la passe 2** | **toujours rien** — un doublon de plus à chaque injection | **détecté**, les trois voies s'affichent |
- **a. Détection réparée** par `_chSouche(titre)` : le titre normalisé privé de ses suffixes de jumeau successifs, **uniquement pour reconnaître une parenté**. Le suffixe **n'est pas retiré** — c'est une décision, elle est respectée ; l'original garde la priorité d'appariement, le jumeau ne devient cible que si l'original a disparu.
- **b/c.** Libellés arbitrés le 24/08 appliqués aux **boutons, à la confirmation, aux messages et aux ⓘ** ; le bouton unique du cas « rien n'existe » reste « Créer ce chapitre » **et déclenche désormais sa propre confirmation** (« Le chapitre est créé en fin de liste, non publié »).
- **d.** `chApresEcriture()` sur **les trois voies** : cache du niveau invalidé, relu, listes redessinées, inventaire rafraîchi — sans rechargement de page.
- **e.** L'inventaire (« Ce que tu as déjà / Ce que l'IA apporte », états NOUVEAU/DÉJÀ/DIFFÉRENT, « À lier toi-même ») **n'a pas été touché** : il dit vrai maintenant que la détection l'est.
*Écriture simulée, déclarée* : dans ce banc les PUT sont **interceptés et rangés dans un hub en mémoire — jamais transmis au hub réel** ; sans cela la seconde passe n'aurait rien à détecter. **Ce qui reste non prouvé** : le comportement de `secuEcrire` face au hub réel (règles, latence) et la corbeille de la voie « Remplacer ».

## ⑤ LE ZOOM — banc TROIS PAGES (`tests/banc_lotB_zoom.js`), compte d'écrans par rôle
| | pilote | téléphone | tableau |
|---|---|---|---|
| **8.61.0** avant zoom | 12 | 11 | 11 |
| **8.61.0** après zoom | **13** | 11 | 11 |
| **8.61.0** après dézoom | 12 | 11 | 11 |
| **candidat** (tous crans) | **11** | **11** | **11** |
`desynchronise` : **`true` → `false`**. La désynchronisation attribuée en phase 0 à la copie jouée était donc **bien celle-ci**, reproduite ici pour la première fois.
**Voie retenue — la première des deux proposées** : en régime **classe**, `degorge` et `reabsorbe` sont **suspendues** (enveloppes posées depuis le pont ; le moteur n'est pas touché). Le zoom reste entièrement visuel, le compte d'écrans ne bouge plus. **En préparation, rien ne change.** Le professeur n'est pas bloqué : il zoome autant qu'il veut et il est **averti une fois** que ce qui dépasse n'est pas reporté tant que la classe est en cours.
**Pourquoi pas la seconde voie** (re-synchroniser après coup) : elle ferait suivre à chaque appareil un rang qui change sous lui — c'est traiter le symptôme d'une indexation par rang, laquelle se soigne par l'identité des écrans. `PASSATION §⑦` l'écrit : *« chaque bloc porte un identifiant propre ; les marques le référencent par cet identifiant, jamais par son rang »* — le principe n'a jamais été étendu aux écrans, et **c'est le LOT C**. Aucune indexation, aucun identifiant n'a été touché ici.

## ⑥ MATRICE ACTIONS × ÉTAT — conformité des fonctions touchées, prouvée par l'ÉTAT
Aucune fonction de ce lot ne **copie, coupe, déplace, supprime ni ajoute** d'objet : elles pilotent (téléphone), affichent (tableau), écrivent un chapitre entier (injection) ou **suspendent** un mécanisme (zoom). La ligne qui les concerne est **zoom/dézoom → dévoilement transmis au morceau reporté, recollé au retour** : en régime classe il n'y a plus ni report ni retour, donc **rien à transmettre ni à recoller** — l'état de dévoilement reste intégralement sur son écran d'origine (mesuré : `rev` et `vues` inchangés aux trois crans de zoom, sur les trois appareils). En préparation, le mécanisme d'origine est intact, donc la ligne s'applique comme avant. La seule écriture d'état du lot est `e.ecrire` (A-5), qui ne crée ni ne déplace d'objet et suit son bloc.

## ⑦ INTOUCHÉS — prouvés
Moteur identique · 29 `secu*` identiques · `published` 97→97 · aucune identité, aucun rang, aucune indexation modifiés (les 39 zones de diff ne contiennent ni `uid`, ni `ordre`, ni renumérotation) · inventaire d'injection inchangé · déroulé local (Win+K) : `tableau()`/`envoie()` du moteur inchangés, et la suspension du zoom ne s'applique qu'en régime classe.
**Harnais** : **0 écriture non-GET** sur les bancs téléphone et zoom (compteur affiché). Sur le banc injection, les PUT sont simulés — déclaré ci-dessus.

## ⑧ LES TROIS RÉSERVES — SOLDÉES

### 1. A-3, l'initiale retenue en trame — **réserve levée par le professeur, sourcée**
Mon banc n'avait pas retenu l'initiale saisie. **Paul, 24/08 (verbatim)** : *« ce système fonctionne dans la v8.61.0 qui est en ligne »* — la saisie de l'initiale au téléphone fonctionne donc en usage réel, sur la version en production. L'anomalie était **un artefact de ma séquence de banc** (deux `blur` déclenchés en JavaScript, avec un repeint du prompteur entre les deux : le champ était détruit avant d'avoir rendu sa valeur), et non un défaut du code.
**Ce que ce lot change sur ce point** : rien du mécanisme d'enregistrement — seulement **où va le focus** (les initiales d'abord) et **où va le curseur** (en fin de champ). Le chemin d'écriture `blur → b.reps[k].i → W.sauve()` est **inchangé à l'octet**.
*Statut* : levée sur déclaration du professeur, **à contre-vérifier par la conscience** si elle le juge utile ; le banc reste au sas (`tests/banc_lotB_tel.js`), il suffit de l'exercer avec de vraies frappes.

### 2. La corbeille de « Remplacer » — **prouvée au banc** (`tests/banc_lotB_corbeille.js`)
Deux cas joués sur le candidat, le hub réel jamais touché (écritures interceptées) :
| cas | mesure |
|---|---|
| **archive acceptée** | modale : « … 1 séance et 0 item partent à la corbeille d'abord, puis le chapitre est remplacé » · **1 écriture de corbeille** · message « **Chapitre remplacé. L'ancien est à la corbeille.** » · titre du hub : « … (proposition) » → « **Poésie et peinture au XIXe siècle** » |
| **archive REFUSÉE** (403 simulé sur `/corbeille/…`) | message « **La mise à la corbeille a échoué — rien n'a été remplacé.** Réessaie quand la connexion est stable. » · **0 écriture hors corbeille** · **chapitre intact** (séance et item d'origine présents) · titre inchangé |
Le contrat « **archive AVANT, abandon si elle échoue** » (journal du 09/08) est donc tenu, y compris sous refus d'écriture.

### 3. `secuEcrire` face au hub réel — **ce qui reste, et pourquoi c'est acceptable**
Les bancs interceptent les écritures : **aucune n'a atteint le hub**, c'est la règle du dispositif. Ce qui n'est donc pas éprouvé ici : la latence réelle, les règles Firebase, une coupure en cours d'écriture. **Ce lot ne touche pas `secuEcrire`** ni aucun chemin d'écriture existant — il ajoute `chApresEcriture()` **après** un succès déjà constaté par le code d'origine. Le seul comportement d'échec du périmètre (le refus d'archive ci-dessus) est prouvé. **Aucune dette ouverte de mon fait sur ce point.**

## ⑨ CE QU'AUCUN BANC NE PROUVERA
Le tactile Android · le clavier mobile (apparition, focus conservé, normalisation HTML au `blur`, autocorrection) · le réseau de l'établissement · le vidéoprojecteur. **Le test de Paul sur ses trois appareils reste le juge.**

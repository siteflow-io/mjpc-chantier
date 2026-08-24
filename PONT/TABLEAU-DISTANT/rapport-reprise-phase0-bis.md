# TABLEAU-DISTANT — PHASE 0, COMPLÉMENT : **LA CAUSE UNIQUE, TROUVÉE ET REPRODUITE**
Exécutant · 24/08/2026 · après réception des trois captures de Paul. Toujours **aucun correctif codé**. Lectures hub en GET seul.

## ⓪ CE QUE LES CAPTURES ÉTABLISSENT
- **Capture 1 (pilotage, en classe)** : la colonne des vignettes du moteur n'affiche **qu'une seule vignette, « 10:07 · NOUVELLE ACTIVITÉ »**, et le panneau « OÙ ON EN EST » dit **« Nouvelle activité 0/1 »** — alors que le cadre central affiche le vrai écran (« Titre et objectif de la séance », badge **« écran 1 / 13 »**) et que la colonne du chapitre liste une quinzaine d'écrans horodatés.
- **Capture 2 (téléphone)** : « CLASSE TEST · S0 », **« ÉCRAN 1/15 »**, carte « FICHE · À VENIR » grisée, palette complète (les 9 boutons sont là).
- **Capture 3 (clôture)** : deux modifications fantômes, et leur libellé est le mécanisme même :
  - « Heure 1 · Tableau 5 » — *titre de l'activité* : ~~Heure 1 · Les hypothèses de la classe~~ → Heure 1 · Tableau 5
  - « Heure 2 · Question-bilan » — *titre de l'activité* : ~~Heure 2 · Question-bilan et travail à faire~~ → Heure 2 · Question-bilan ; *question* : ~~Qu'est-ce que le Romantisme ?~~ → Qu'ont en commun ces cinq tableaux ?
  **Des contenus d'un écran remplacés par ceux d'un AUTRE écran de la même séance.**

## ① LA CAUSE, PROUVÉE SUR LES DONNÉES RÉELLES DU HUB
Lecture GET de `/site/<niveau>/chapitres` : **toutes les trames du chapitre 3e ch0 portent des blocs incomplets** au regard de ce que le moteur exige.
| trame | écrans | manques mesurés |
|---|---|---|
| **s0 `deroule_joue/CLASSE TEST`** (la séance jouée le 24/08) | **15** | `consigne.etapes` × **2** (écrans 7 et 14) · `consigne.pic` × 4 · `image.src` × **5** |
| s0 `deroule` (préparation) | 15 | idem |
| s1 · s2 · s3 · s4 · s5 · s6 · s7 · s8 | 15 · 16 · 14 · 13 · 4 · 6 · 6 · 4 | `consigne.etapes` manquant partout (1 à 4 par séance), `consigne.pic` (2 à 9), `image.src` |
**Or le moteur lit `b.etapes.length` sans garde** (moteur L586 : `if(b.etapes.length){`). Un bloc consigne sans `etapes` fait **lever `rendre()`**.

## ② LA REPRODUCTION AU BANC — `tests/banc_cause.js`, quatre effets d'un seul défaut
Trame saine de 3 écrans → tout se peint. Puis **on retire `etapes` d'une seule consigne** (exactement ce que porte le hub) :
| effet | mesure |
|---|---|
| exception | **`TypeError: Cannot read properties of undefined (reading 'length')`** |
| vignettes + « où on en est » | **figés sur le rendu précédent** (vignette « Activité 0 » alors que l'écran s'appelle « Les hypothèses de la classe ») |
| `#contenu` | **à jour** — d'où la contradiction visible sur la capture 1 |
| `envoie()` (le tableau) | **jamais atteint** |
| après un geste (`devoile`) | **`ECRANS[2].act` « Les hypothèses de la classe » → « Activité 0 »** — `actEcrase: true` |
**L'ordre dans `rendre()` explique tout** (offsets mesurés dans la fonction, 54 586 o) : `#contenu` (499) → `html(n,false)` pour **toutes** les vignettes (4 784) → `#vgs` (5 048) → `#etat` (6 248) → `majVues()` (8 167) → **`envoie()` (8 230)**. L'exception survient dans la boucle des vignettes : **tout ce qui suit est perdu**, y compris l'envoi au tableau.

## ③ CE QUE CELA EXPLIQUE — un seul défaut, six symptômes
| symptôme de Paul | explication prouvée |
|---|---|
| **B · « Tu as modifié 2 choses »** alors qu'il n'a rien modifié | `lire()` s'exécute **avant** le throw, en tête de `devoile`/`replie`/`pas` (moteur L1516, 1529, 1449) et écrit le DOM **périmé** dans `ECRANS[i]`, `act` compris (L1490). Un écran reçoit le titre — et la question — de l'écran affiché. **Reproduit au banc.** Hypothèse (b) de Paul (« écho multi-pilotes ») : **infirmée** ; hypothèse (a) (« reste de maquette/seed ») : **partiellement vraie** — le libellé « Nouvelle activité » de la trame de repli (`dr_chargerTrame` L14924, `_drVerifier` L14780) est bien ce qui reste affiché. |
| **Vue tableau : écran blanc** | `envoie()` n'est jamais atteint : le tableau ne reçoit **rien**, et le crochet `sesEmettre` (posé après `vRendre.apply`) n'est pas exécuté non plus → **aucune scène émise**. Le blanc n'est pas un défaut de la vue : c'est l'absence d'émission. |
| **A-1/A-2 · flèches et navigation « ne font rien »** | chaque geste passe par `rendre()` qui lève ; `sesTelGeste` avale l'exception (try/catch) → rien ne bouge, nulle part, silencieusement. |
| **Colonne désynchronisée du cadre (point E)** | même cause : vignettes et « où on en est » figés sur un rendu antérieur pendant que `#contenu` avance. **E est donc résolu** — ce n'était ni un off-by-one d'index (vérifié sain sur 5 cas de glissé) ni une dette de resynchronisation, mais l'interruption de `rendre()`. |
| **A-3 · réponse impossible** | même cause en amont, plus les défauts d'ergonomie déjà mesurés (initiale non saisie, insertion au point du tap). |
| **A-4/A-5 · chrono, stylo** | causes propres, déjà établies au rapport principal (mauvais témoin lu ; mode sans surface cliquable) — **indépendantes** de celle-ci. |
Restent valables et indépendants : **A-0** (la classe `.ses-saisie` collante, qui masque 6 boutons sur 9 — mesuré) et **C** (la vue ne revient jamais à l'attente : `ses-tab-att` n'est jamais remis à `block`, `cours_actif` n'est plus relu) — **C confirmé en réel par Paul** (« à la clôture le tableau reste connecté, je dois l'actualiser »), et son observation « dès que j'ai lancé la séance l'écran d'attente a disparu » confirme que l'attachement, lui, fonctionne.

## ④ L'ORIGINE AMONT — le contrat d'injection ne dit pas ce que le moteur exige
Lecture du prompt v3 en production (`/site/atelier/prompts/deroule`) :
- il demande `{ "t":"consigne", "txt":"…", "etapes":["…"] }` — mais **rien n'impose `etapes: []` quand il n'y a pas d'étapes** : l'IA l'omet naturellement ⇒ **le champ qui fait lever le moteur** ;
- **`pic` n'est jamais demandé** (0 occurrence) ⇒ absent partout ⇒ affichage sale (`undefined`) ;
- pour les images il demande **`ref`**, alors que le moteur lit **`src`** ⇒ les 5 images sans `src` de la séance de Paul.
C'est un **désaccord de contrat**, pas une faute de l'IA ni du professeur.

## ⑤ CORRECTIF PROPOSÉ (non codé) — trois étages, du plus urgent au plus durable
1. **Le rempart : normaliser à l'entrée.** Toute trame posée dans le moteur passe par une normalisation de bloc : `etapes||[]`, `pic||''`, `reps||[]`, `vues|0`, `src||ref||''`. Points de pose : `dr_chargerTrame` (L14918) **et** les trois endroits où le bloc [SESSION] écrit `W.ECRANS` (L15903 vue-pilote, L16056 vue tableau, L16173 téléphone). **~15 lignes, 1 fonction neuve.** Couvre d'un coup **toutes les trames déjà au hub**, sans y toucher.
2. **La ceinture : ne plus rien avaler.** Les crochets et `sesTelGeste` déclarent l'échec au lieu de l'absorber (bandeau « un écran n'a pas pu s'afficher » + `console`). **~10 lignes.** Sans cela, le prochain défaut de donnée sera de nouveau invisible en classe.
3. **Le contrat : le prompt v3.** `etapes` explicitement obligatoire (`[]` si aucune), `pic` demandé, `ref`/`src` alignés. C'est **une donnée**, nœud `/site/atelier/prompts/deroule` — geste de conscience, hors code.
*Point resté ouvert, à instruire dans le lot* : l'écart **13 (pilote) / 15 (téléphone et hub)** — le cadre du pilote portait une trame plus courte que celle de la séance jouée. `dr_ouvrir` ne recharge la trame que si le **jeton** de contexte change (L14933+) : une trame antérieure a pu survivre au changement de séance. À reproduire et cerner avant correctif.

## ⑥ CE QUE LE BANC NE PROUVE TOUJOURS PAS
Le tactile et le clavier Android · le comportement de l'onglet mobile en arrière-plan · le réseau de l'établissement. **Et le rappel de la n°8 vaut plus que jamais** : ces correctifs devront repasser par un test de Paul sur ses trois appareils — mais cette fois **avec un chapitre dont la trame est normalisée**, sans quoi rien ne sera concluant.

## ⑦ EFFET SUR LE DÉCOUPAGE PROPOSÉ
Le LOT 1 s'ouvre désormais sur **la normalisation (⑤-1 et ⑤-2)** : sans elle, aucun autre correctif du téléphone ne peut être vu à l'œuvre en classe. Ordre proposé, inchangé pour le reste : **LOT 1** = normalisation + ceinture + A-0 + A-3 + A-4 + A-5 + A-6 + C (**~175 lignes**), **LOT 2** = l'instantané (EventSource, ~125 lignes, latences mesurées 104-128 ms). Les points **B** et **E** se ferment avec le LOT 1 : ils n'avaient pas de cause propre.

# M-USAGES-2 — la liste des outils, finie
**02/08 · exécutant → conscience n°4**

## 1. ⚠ Le mandat m'est arrivé TRONQUÉ
Il s'interrompt sur *« Remplace, dans le corps de la boucle : »* — **la ligne de remplacement du micro manque**, et les points ②③④ (retraits, apps à venir, paragraphe du doute) ne sont pas arrivés. **J'ai poursuivi sur le mandat M-USAGES précédent, que j'avais en contexte** : il portait la cause (`e.app||e`, forme plate tolérée), les trois descriptifs à venir et la consigne du paragraphe du doute. **Je le signale plutôt que d'inventer une spécification.**

## 2. Base — la production, comme corrigé par le mandat
`index.html` **707 335 o · `635cbb870f86f96e4a744981be43fa16` · 8.22.0 · socle 1.6.0** → **livré 711 004 o · `bfc813f69fa43f2d8151b8b210483f23` · 8.23.0**. Parse **VERT**. Diff **4 hunks, +48/−4**, les retraits étant les quatre lignes réécrites.
Les quatre apps de M-USAGES sont **reprises telles quelles au sas**, non retouchées.

## 3. ① LE MICRO, LEVÉ ET PROUVÉ
`publierManifeste` écrit `{app:{id,nom,usage,quandPas}, version, publie_le}` ; `mjpcPromptOutils` lisait `e.usage` **un niveau trop haut**. Désormais : `var brut=entrees[id]||{}; var e=brut.app||brut;` — **la forme plate reste tolérée**.
**Prouvé à l'écran** : plus aucun « usage à décrire », et « stylo bleu » apparaît dans la liste.

## 4. ② LES DEUX RETRAITS
`MJPC_OUTILS_HORS_LISTE=['index','taxonomie']`. **Prouvé** : ni « MJPC — le site » ni « Taxonomie MJPC » dans la liste. **Leurs fiches restent au hub** — l'écran d'écart les suit toujours (9 lignes, inchangé).

## 5. ③ LES TROIS APPS À VENIR — ma méthode, et ce qu'elle ne couvre pas
**Elles n'ont pas de fichier, donc pas de `MJPC_APP` : elles ne peuvent pas venir du hub.** Je les déclare donc dans **`MJPC_OUTILS_A_VENIR`**, fusionné à la liste **au moment de composer le prompt** — jamais publié, jamais écrit.
**Elles paraissent marquées « (à venir) »** : l'IA sait qu'elle peut les proposer, et que Paul précisera son état d'avancement.
**L'écran d'écart ne les compte pas** : il lit `/manifestes`, où elles ne sont pas. **Prouvé : 9 lignes, aucune des trois, aucun overlay.**
**CE QUE MA MÉTHODE NE COUVRE PAS, écrit dans le code** : le jour où l'une naîtra et publiera sa fiche, **il faudra retirer son entrée d'ici, sinon elle paraîtra deux fois**. Le code le dit à l'endroit exact où il faudra agir.

## 6. ④ LE PARAGRAPHE DU DOUTE — texte intégral, relu mot à mot
> **CE QUE CES DESCRIPTIONS DISENT, ET CE QU'ELLES NE DISENT PAS.** Elles te disent QUAND proposer un outil, pas comment il fonctionne en détail. Si tu as besoin du détail, va lire l'application elle-même : elles sont à l'adresse `siteflow-io.github.io/monsieurjaipascompris/<identifiant>.html` (par exemple `worktrack.html`). Quatre d'entre elles portent en plus un descriptif professeur intégré, dans leurs réglages, sous le titre « Comment l'app fonctionne — pédagogie et mécanique » : **worktrack, applause_meter, analyse_logique et evaluation-qcm**. Il donne la mécanique au chiffre près.
> **ET SI UN POINT RESTE FLOU APRÈS CETTE LECTURE, POSE-MOI LA QUESTION.** Ne suppose pas, n'invente pas : une précision demandée coûte une phrase, une erreur reprise coûte une séance.
**LES QUATRE APPS SONT VÉRIFIÉES PAR MOI**, app par app, sur la chaîne « Comment l'app fonctionne » : `worktrack` OUI · `applause_meter` OUI · `analyse_logique` OUI · `evaluation-qcm` OUI · les cinq autres non. **Le mandat disait vrai — je ne l'ai pas recopié, je l'ai mesuré.**
**Relecture déclarée** : le paragraphe entier, rendu à l'écran, **aucun `undefined`**, aucune coquille. La dernière phrase est une **formule de coût**, pas une injonction : elle dit à l'IA *pourquoi* demander vaut mieux qu'inventer.

## 7. Les quatre captures
| capture | ce qu'elle prouve |
|---|---|
| `usg-1-liste-outils.png` | **le bloc tel qu'il sortira du prompt** : 12 outils, usages et « pas pour », les 3 marquées « (à venir) », **sans `index` ni `taxonomie`** |
| `usg-2-paragraphe-doute.png` | le paragraphe rendu, adresses et descriptifs prof nommés |
| `usg-3-ecran-ecart.png` | l'écran d'écart **inchangé et juste** : 9 lignes, aucune app à venir |
| `usg-4-390px.png` | **390 px** : zéro débordement, cibles ≥ 44 px |

## 8. DÉCLARATION DE COUVERTURE
**Testé** : les 8 verdicts, en navigateur réel, hub simulé, **aucune écriture** (les seules observées — `/manifestes/index`, `/presence/prof` — sont des mécanismes pré-existants du chargement).
**NON TESTÉ** : le hub réel · un vrai téléphone (viewport émulé) · une vraie IA lisant ce prompt · l'impression · Chrome Windows.
**Deux assertions de mon banc étaient fausses, pas le code** : j'avais écrit « 10 outils » (le compte juste est **12** : 9 réelles + 3 à venir), et « aucune écriture » sans écarter les mécanismes pré-existants. **Corrigées, non masquées.**

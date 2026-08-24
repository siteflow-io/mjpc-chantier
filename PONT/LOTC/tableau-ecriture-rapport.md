# LOT TABLEAU-ÉCRITURE — le mur suit ce que Paul écrit
Exécutant n°8 · 24/08/2026 · candidat `PONT/LOTC/tableau-ecriture-index.html`. **STOP après livraison.**
Lus avant de coder : `OU-EST-CE-DEJA-ECRIT.md` · `PASSATION-C6-C7.md` §⑦ · `DEROULE/CADRAGE-TEMPS.md` · `PONT/LOTC/c3a-rapport.md`.
**Rien n'a été créé là où quelque chose existait.** Les sept points appellent du code déjà écrit : `deborde`, `zoom`, `degorge`, `verifDeborde` et `scinde` du moteur, `atDrEnrAuto` et `_drCopieAuto` pour les écritures, `sesEmettre` pour l'annonce, `_drRefusionner` pour le retour. **Une seule ligne de comportement est vraiment neuve : la pulsation (⑦).**

## ⓪ SCEAU
| | |
|---|---|
| base re-téléchargée | md5 **`85a6c75946dd002327b36114090c2eb7`**, **1 485 415 o** = attendu (v8.65.1) |
| candidat | **1 496 871 o**, md5 **`10b5320f5ae5841a037d63c7adc3cfd8`** |
| `APP_VERSION` | **8.66.0** · double parseur (`node --check` + acorn ES2020) : **verts** |
| moteur `AT_DR_B64` | **identique à l'octet** (md5 interne `e7ceefa87d9b…`) |
| `secu*` | **29 → 29, aucune divergente** · `published` : **97 → 97** |
| fonctions | **5 modifiées, 12 neuves, 0 supprimée** |
| écritures non-GET **sorties** | **0** (21 interceptées, comptées) · `pageerrors` : **0**, base comme candidat |

**Intouchés, corps comparés — AUCUN divergent** : tout le T-5 · `copierED` · le récit, le papier · `atDrReprendre` · `_drCopieAuto` · `_drTraceAuto`, `_drPaquetHeure`, `_drTraceReprendre` (trace de C1) · `_drIdentifierEcrans`, `_drEidDuRang`, `_drRangPere`, `_drRefusionner` (identité de C2) · **et tous les correctifs de C3a** : `_drCoursActifEffacerSi`, `_drHeureCloseAu`, `_drSignatureCours`, `_drCleHeureDe`, `sesReprisePoser`, `sesReprendre`, `_drTailleCadre`, `_drVuePere` · côté moteur, `scinde`, `degorge` et `verifDeborde` sont **appelés, jamais réécrits**.

## ① TAILLES
| fonction | avant | après |
|---|---|---|
| `_drAnnoncerTrame` | — | **152 o** (neuve, par extraction) |
| `_drSurfaceProjetee` · `_drDebordeSurface` · `_drDebordeQuelquePart` | — | 229 · 388 · 194 o |
| `_drPoserCran` · `_drAjusterZoom` · `_drEnvelopperDeborde` | — | 297 · 862 · 400 o |
| `_drCssPulsation` · `_drDepulser` · `_drPulser` | — | 529 · 235 · 1 080 o |
| `_drMotDepuisFin` · `_drPulsationFrappe` | — | 468 · 332 o |
| `_drEnvelopper` | 7 243 | **9 128** (+1 885) |
| `sesPhoto` · `sesTabPoll` | 2 026 · 1 620 | 2 147 · 1 913 |
| `sesBrancherPilote` · `sesBrancherPiloteTel` | 2 019 · 1 441 | **1 910 · 1 368** |

**Les deux `sesBrancherPilote*` ont rétréci — par EXTRACTION, prouvée.** Elles portaient chacune une copie du même bloc d'annonce (`clearTimeout(SES.trameT)` + `setTimeout(… trameMaj … sesEmettre …, 950)`). Ce bloc est devenu `_drAnnoncerTrame(vite)`, **à l'identique** : mêmes 950 ms, toujours postérieurs au débounce de 900 de `_drCopieAuto` — jamais une annonce avant la marchandise. Les deux appelants d'origine l'appellent ; **la frappe est le troisième**, et c'était tout ce qui manquait.

## ② LES SEPT POINTS — base 8.65.1 contre candidat, mesuré
| mesure | 8.65.1 | candidat |
|---|---|---|
| **①** le mur distant reçoit le texte tapé | **non** | **oui** |
| **①** il suit le remplacement | **non** | **oui** |
| **①** texte porté par le mur distant | **0 signe** | **152 signes** |
| **③** crans pendant la frappe (départ 44 pt) | `3 3 3 3 3 3` | **`2 1 1 1 1 1`** |
| **③** jamais sous le plancher 32 pt | — | **tenu** |
| **④** crans pendant l'effacement | `3 3 3 …` | **`1 … 1 2 3 3 3`** |
| **④** cran rendu au bout | 3 | **3** (le plafond, jamais au-dessus) |
| **⑤** plafond retenu après geste manuel (52 pt) | — | **4** |
| **⑥** réponse : suite · initiale · `suiteRep` | 2 · `EB` · oui | 2 · **`EB`** · **oui** |
| **⑥** consigne / fiche : suites créées | 1 / 1 | **2 / 2** |
| **⑦** pulsation sur le mur | **aucune** | **`foule`** |
| **⑦** elle saute au mot suivant | — | **oui** (`durablement`) |
| **⑦** nombre de marques | 0 | **1** |
| matrice zoom/dézoom : dévoilement recollé | oui | **oui** |

### ① Le contenu tapé parvient au tableau distant
Le tableau ouvert **depuis le pilotage** est peint en direct par le moteur : il était déjà juste. Le tableau **distant** lit le hub, et le moteur, en frappe, appelle `lire`, `envoie`, `majVignette` — **jamais `sauve()`**. Or seul `sauve()` déclenchait la copie au fil de l'eau et l'annonce `trameMaj`. D'où le symptôme exact de Paul : *les commandes marchent, le texte est périmé*. La frappe appelle désormais `atDrEnrAuto()` (préparation), `_drCopieAuto()` (classe) et `_drAnnoncerTrame()` — les trois **existants**, avec leurs débounces d'origine : une écriture par pause de frappe, pas une par lettre.
**Preuve, deux pages, hub partagé** : Paul tape « lorem ipsum… » → le mur distant l'affiche (base : rien). Il l'efface, met une autre réponse, continue → le mur porte la nouvelle réponse et **plus trace du lorem**. La trame au hub porte le champ à jour.

### ②③④⑤ La mesure et le zoom
`deborde()` du moteur ne mesurait que la scène du pilotage. Elle est **enveloppée** : elle répond aussi de **la surface projetée** — la fenêtre tableau ouverte par le moteur, et, sur la page `?vue=tableau`, sa propre toile. Le mur n'a pas les proportions de la scène : il déborde quand elle tient encore.
Deux précautions tiennent **l'ordre voulu — dézoomer d'abord, couper ensuite** : pendant la séquence de dézoom le mur ne parle pas (sinon on couperait avant d'avoir réduit) ; au-dessus du plancher non plus (il reste du zoom à rendre). Au plancher, le mur commande, et c'est `verifDeborde` du moteur qui coupe **en restaurant le champ et le curseur**, comme il le fait déjà — c'est pourquoi la frappe ne se perd pas.
Le dézoom descend **d'un cran, remesure, redescend** : mesuré `44 → 38 → 32`, et **jamais 24**. L'effacement **refait le chemin inverse, cran par cran** — `32 … 32 → 38 → 44` — et s'arrête au cran d'où l'on était parti.

**Arbitrage de lecture, à trancher par la conscience si je me trompe** : ③ dit « quand ça déborde **pendant une frappe**, on descend d'un cran » ; ⑤ dit « le zoom manuel reste souverain, on ne refuse jamais ». J'ai lu ⑤ comme *aucun refus, aucun blocage, aucun message* — le geste est accepté et **mémorisé comme plafond** (mesuré : 4 après un passage manuel à 52) — et ③ comme s'appliquant ensuite si Paul tape et que ça déborde, le cran lui étant **rendu dès qu'il efface** (④). L'autre lecture possible serait : après un geste manuel, ne plus jamais dézoomer et laisser couper tout de suite. **Je n'ai pas tranché seul dans le code** : le plafond est enregistré, une seule ligne le figerait.

### ⑥ La coupure, par l'ÉTAT
Rien n'a été réécrit : `scinde()` sait déjà couper une consigne et ses étapes, des réponses multiples, **le texte d'une réponse unique**, le texte d'un bloc et les blocs d'une fiche. Seul **ce qui la déclenche** a été élargi.
| champ | suite | libellé | référence conservée |
|---|---|---|---|
| **réponse d'élève** | oui | « suite 1 » | **initiale `EB` conservée**, `suiteRep` posé — ce n'est pas une seconde participation |
| **consigne** | oui | « suite 1 » | fragment posé, dévoilement à zéro sur le morceau |
| **fiche** | oui | « suite 1 » | fragment posé |
Dans les trois cas : le père **garde son identité**, les fils **n'en ont aucune** (règle de Paul, C2).
**Ligne zoom/dézoom de la matrice, prouvée par l'état** : 2 suites → dézoom → **0 suite**, père retrouvé **par son identité**, dévoilement **recollé à l'identique** (`vues` 1 = 1), étapes recollées, fragments effacés.

### ⑦ La pulsation du dernier mot
Spécification tenue **à la lettre** : **une** pulsation, **une** couleur (l'or de la charte, `rgba(201,154,78,…)`), sur **le dernier mot tapé**, cycle lent de 2,2 s — un battement, pas un clignotement — **dix secondes puis elle s'éteint**, et elle **saute au nouveau mot dès la reprise**. **Aucune marque figée** : la marque est *retirée du document*, pas décolorée. Aucun historique, aucun code de couleurs.
Elle se repose après chaque repeinture (`envoie()` régénère la toile), et **voyage jusqu'au mur distant** par la scène. Le mot est repéré **compté depuis la fin** : l'élément du tableau porte souvent un préfixe que le champ n'a pas (l'initiale de l'élève, la pastille de consigne) — compter à l'envers rend le repère juste dans les deux cas. C'est un **compte de mots**, non une position en pixels : c'est précisément ce qui survit au changement de taille, raison d'être de la pulsation.
**Captures regardées** : `tests/te-candidat-pulsation-1.png` (pulsation sur « foule ») et `-2.png` (elle a sauté sur « durablement », **une seule marque**, `uneSeuleMarque: 1`).

## ③ CE QUI VAUT EN PRÉPARATION
L'écouteur de frappe est posé dans `_drEnvelopper`, hors de toute session : il agit **dans les deux régimes**. En préparation `atDrEnrAuto` enregistre la trame, en classe `_drCopieAuto` pousse la copie — les deux gardes d'origine se répondent, aucune ne double l'autre.

## ④ RÉSERVE NOMMÉE
**Le tableau d'un AUTRE appareil n'est pas mesurable depuis le pilote** : il ne peut ni être interrogé, ni écrire (c'est un terminal muet, par contrat). ② est donc tenu pour la surface projetée **joignable** — la fenêtre ouverte depuis le pilotage, celle de l'écran scindé dont Paul parle, et la toile de la page `?vue=tableau` pour elle-même. Un mur distant aux proportions très différentes pourrait déborder sans que le pilote le sache. **Je n'ai pas ajouté d'ajustement local sur la page tableau** : ce serait un comportement non demandé, et deux appareils afficheraient alors des tailles différentes. À trancher par Paul si le cas se présente.

## ⑤ LE BANC
`tests/banc_te.js` · **deux pages** (pilote + `?vue=tableau`) partageant **un seul hub, tenu côté Node** — c'est ce qui permet d'éprouver la chaîne réelle. Tout non-GET est intercepté, rangé, **compté : 21 interceptées, 0 sortie**. `pageerrors` : 0.
Deux pièges repayés, consignés pour la suite : **l'iframe du cadre ne se déplace pas** (détachée puis rattachée, elle perd son contenu — le code du site le dit ; on rend ses parents visibles sur place) · **un écran non dévoilé ne peint rien au mur**, ce qui n'est pas un défaut mais le contrat du prompteur — il faut poser `rev` avant de mesurer.
Écart déclaré : je n'ai **pas** emprunté la chaîne de clics (Panneau prof → Atelier → Mes chapitres → Modifier → Déroulé) ; le cadre est monté par les portes du site (`_drAssurerCadre` + `_drNormaliserTrame`). La frappe est simulée par insertion + événement `input`, avec le curseur posé en fin — **ce n'est pas un clavier**.

## ⑥ CE QUE LE BANC NE PROUVE PAS
Le tactile et le clavier mobile · le réseau de l'établissement et la latence réelle du hub · le vidéoprojecteur (contraste, lisibilité réelle de la pulsation à huit mètres) · une vraie heure de classe · le confort réel du texte qui rétrécit sous les yeux des élèves — **c'est le point que seul l'usage tranchera** · le comportement d'un tableau distant aux proportions très différentes (voir ④). **Le test de Paul reste le juge.**

## ⑦ LES TESTS MANUELS POUR PAUL
1. **Le symptôme ①** : tableau ouvert sur le portable (`?vue=tableau`), taper une réponse au pilotage, l'effacer, en taper une autre → le portable doit suivre en une seconde environ, sans rien garder de l'ancienne.
2. **Écran scindé** : tableau du pilotage réduit de moitié, taper une réponse longue → le texte doit rétrécir d'un cran à la fois, s'arrêter à 32, puis partir sur un écran de suite. **Vérifier qu'on ne perd pas le curseur.**
3. **Effacer** → le texte doit remonter, cran par cran, jusqu'au cran d'où on était parti, et pas au-delà.
4. **Monter le zoom à la main** pendant que la classe copie → aucun refus. Reprendre la frappe et juger si le comportement convient (voir l'arbitrage ⑤ au §②).
5. **La coupure sur une réponse d'élève** → l'écran de suite doit porter « EB · suite 1 » : c'est la même réponse qui continue, pas une seconde prise de parole.
6. **La pulsation, au fond de la classe** : est-elle assez visible sans être gênante ? Dix secondes, est-ce trop court ou trop long ?
7. **En préparation** : refaire 2 et 3 sans lancer de classe — le comportement doit être identique.

---
*Livré au sas, non promu. Point de retour : production 8.65.1, md5 `85a6c75946dd002327b36114090c2eb7`.*

MEMO

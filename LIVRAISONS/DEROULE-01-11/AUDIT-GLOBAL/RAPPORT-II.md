# AUDIT GLOBAL PAR LE GESTE — PARTIE II : LES SÉANCES DANS L'EMPLOI DU TEMPS

*Auditeur neuf II, conscience n°16, 03/11/2026. Mandat : `MANDATS/DEROULE-01-11/MANDAT-AUDIT-GLOBAL.md` §3 (sas, `main`). Je n'ai changé aucune ligne du site : j'ai mesuré, compté, montré. Ce rapport est poussé par morceaux sur `audit/global-II`.*

**Le fichier mesuré.** La production 8.81.1-⑭-micro (`…/scratchpad/promo-8812/index.html`, md5 `c21ddbb6…`). Pour comparer : la 8.80.0-⑬ (`…/v8800/index.html`, md5 `8b2310e7…`) et la 8.78.2-⑪-micro, celle de Paul lundi matin (`…/v8782/index.html`, md5 `50bb9e75…`).

**La sonde.** `sonde-II.mjs` (ce dossier). Le harnais est celui de la fin d'heure (`FIN-HEURE/sonde-fin-heure.mjs`, `fcb5004fd`), repris tel quel : le faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400) et pousse son flux ; les valeurs du serveur (`{".sv":"timestamp"}`) résolues comme dans `APPEL/sonde-appel.mjs`. La trame de Paul en séance 1 (`trameDePaul`). Une seule retouche du faux hub, en mémoire : la classe « 3 DYLAN Bob » de la grille est appariée à « CLASSE TEST » (3e, chapitre publié pour elle) — c'est la seconde classe de 3e, celle qui n'a rien joué, qui tient le rôle des 3 DYLAN. Aucune mesure de temps dans cette partie : l'horloge du navigateur est l'horloge installée de la sonde (elle avance), comme la fin d'heure. Les sorties, sans nom d'élève : `sorties/`. Les captures (écran entier, 1536 × 864) : scratchpad, `c16-audit-II/captures/`, pas au dépôt.

---

## 3 · LES 3 DYLAN À LA SÉANCE 2 — d'abord la question de la conscience (13:0x) : le paquet sans `classe`

**Réponse.** Un paquet `deroule_joue/<classe>` sans le champ `classe` compte pour **toutes** les classes : une autre classe de 3e qui n'a rien joué se voit proposer la séance 2. Prouvé par le geste au faux hub, sur la production, la 8.80.0 et la 8.78.2 : **6 mesures sur 6**. Et un essai lancé **en mode test**, puis le mode test **quitté pendant l'heure**, écrit au vrai `deroule_joue` exactement ce paquet-là (sans `classe`) : prouvé sur la production et sur la 8.78.2.

### 3.0.1 · Le paquet de la forme lue au vrai hub (partie K, `sorties/sonde-II-promo-8812-KM.txt`)
Au faux hub, la séance 1 porte un seul paquet, `deroule_joue/3E Charles de Gaulle`, de la forme lue par la conscience : clés `heures, etat, journal, ecrans, scene`, **pas de `classe`** ; une heure `2026-09-14_08h00-08h55_3E_Charles_de_Gaulle` (`classe` « 3E Charles de Gaulle », `clos` vrai, `heure` 1, `sur` 1, `debutReel` 12:08:53, `finReel` 14:42:50, 9 diapos, aucune décision). Puis le même paquet **avec** `classe`. La classe témoin, CLASSE TEST (3e, la grille des « 3 DYLAN Bob »), n'a rien joué. Mardi 15/09 08:00, je lis sa case de 10:07 :

| fichier | paquet SANS `classe` | paquet AVEC `classe` |
|---|---|---|
| production 8.81.1 (`c21ddbb6`) | **séance 2** « Étude de texte accompagnée : « L'Albatros » », heure 1 sur 3 | séance 1 « Poésie et peinture… », heure 1 sur 1 |
| 8.80.0 (`8b2310e7`) | **séance 2**, heure 1 sur 3 | séance 1 |
| 8.78.2 (`50bb9e75`) | **séance 2**, heure 1 sur 3 | séance 1 |

Ce que montrent aussi les autres lecteurs, sur la production, paquet sans `classe` :
- **les cartes des classes** de l'emploi du temps : CLASSE TEST « Poésie et peinture… · **1/9** », « dans les temps » (avec `classe` : « 0/9 », « 1 h de retard ») ;
- **la case** de CLASSE TEST : « Étude de texte accompagnée : « L'Albatros » — heure 1 sur 3 » ;
- **« Le parcours du chapitre »**, à l'ouverture de l'heure de CLASSE TEST (capture `K-production-sans-parcours-classe-test.png`) : « Séance 2 sur 9 — **1 ✓** Poésie et peinture… — 2 mar. 15/9 Étude de texte… » : la séance 1 est cochée faite pour une classe qui ne l'a jamais jouée ; le bilan des compétences la compte jouée (`dr_ouvHeuresJouees` : S1 = 1 h) ;
- la réactivation : aucune diapo « Où en sommes-nous ? » dans cette heure (la séance d'avant de CLASSE TEST n'a pas de copie à elle : `dr_reactivationCheminAvant` lit par le chemin de la classe).

**Lu dans le code — ce qui lit les paquets de cette façon** (`index.html` de la production ; la règle `if(!b||(b.classe&&b.classe!==nomClasse))return;` : sans `classe`, le paquet passe pour toutes les classes). Les mêmes lignes existent dans la 8.80.0 (l. 26075, 26085, 26092, 26145, 27272) et la 8.78.2 (l. 25236, 25246, 25253, 25306, 26433) :
- `edtSeanceEtat` (l. 26324) → `edtSeanceJouee` → `edtChapitreEnCours`, `edtFileDAttente` → **la file et la case** (`edtProjeter`), **les cartes** (`edtCartesHtml`), **le retard** (`edtAvancement`, `edtDivergence`), le lancement sans case peinte (`edtLancer`, repli) ; et **« Le parcours du chapitre »** (`dr_ouvTerminee`, l. 18669) ;
- `edtHeuresJouees` (l. 26338) → « heure n sur N » de la case suivante (`edtFileDAttente`, `edtProjeter` l. 26543), **le bilan des compétences** (`dr_ouvHeuresJouees`, l. 18668) ;
- `dr_heureProposee` (l. 20267, la même règle écrite `!b.classe || …`) : l'heure proposée hors de l'emploi du temps ;
- `edtTraceDe` (l. 26301), `edtSeanceDeTrace` (l. 26391), `edtCheminTrace` (l. 27529) : la même règle, mais ils cherchent une clé d'heure qui contient le nom de la classe : une autre classe n'y tombe pas (aucune case d'une autre classe colorée « jouée », mesuré : la case de CLASSE TEST reste « prévue »).

**Ce qui lit autrement (par la clé du paquet ou par `classe` exact) — pas touché :** `dr_marquerJoues` (l. 20574), les dates du « parcours » (l. 18662), la réactivation (`dr_reactivationCheminAvant`, le chemin de la classe), la Relecture (`dr_recitChargerClasse`, le chemin de la classe ; son menu des classes `dr_recitClassesJouees`, l. 22525, liste chaque paquet sous son nom). « Mes chapitres » ne lit pas les paquets (seule une signature, l. 17030) : mesuré plus bas (partie A).

### 3.0.2 · Quel chemin écrit un paquet sans `classe` ; un essai en mode test peut-il écrire au vrai `deroule_joue` ? (partie M)
**Lu dans le code.** Le seul endroit qui écrit `classe` sur le paquet est `atDrJouer` (l. 15955-15966 de la production ; la même chose dans la 8.78.2), au lancement d'une heure 1 : un `PUT` du paquet entier `{classe, demarreLe, ecrans}`, ou trois écritures `ecrans`, `demarreLe`, `classe`. Toutes les autres écritures de l'heure passent par `dr_ecrire` sous le chemin de la copie, clé par clé (`/etat`, `/journal`, `/scene`, `/ecrans`, `/heures/<clé>` ; `/vif` dans la production). Le mode test est un interrupteur de la page (`M8_TEST`), lu à **chaque** écriture par `mjpcEcrireRest` (l. 3050-3076) : en mode test, l'écriture va au magasin de la page ; sinon, au vrai hub. **`m8BasculerModeTest`** (l. 1878, la même dans la 8.78.2, la 8.79.0 de `c16-appel/v879` — md5 `3cd597e8`, sa constante dit « 8.74.0-③ » — et la production) bascule l'interrupteur et **vide le magasin du mode test**, sans regarder si une heure tourne. Et l'interrupteur n'est jamais relu après un rechargement : `sessionStorage 'mjpc_m8_test'` est écrit, jamais lu (0 `getItem` dans les quatre fichiers).

**Mesuré par le geste** (le faux hub tient le rôle du vrai) — l'essai : « mode test » allumé (la pastille du Panneau prof), la case du lundi de 3E Charles de Gaulle, « ▶ Ouvrir le pilotage et lancer », 7 diapos :
- **pendant l'essai, en mode test** : aucune écriture hors de `/site/tableau_test` (production et 8.78.2) ;
- **le mode test quitté pendant l'heure** (l'appel de `m8BasculerModeTest`, ce que fait la pastille : à l'écran du pilotage, la pastille n'est pas visible ; elle est dans l'entête du Panneau prof), puis 3 diapos, 20 s, « Clore » sans décision : **production, 9 chemins écrits au « vrai » hub** (`…/deroule_joue/3E Charles de Gaulle/scene`, `/vif`, `/journal`, `/etat`, `/heures/<clé>`…) ; **8.78.2, 7 chemins** (`/scene`, `/journal`, `/etat`, `/heures/<clé>`). Le paquet laissé : `{etat, heures, journal, scene, vif}` (production), `{etat, heures, journal, scene}` (8.78.2), **SANS `classe`, sans `demarreLe`** ; une heure close, 9 diapos, **0 décision** — la forme exacte du paquet de Paul. Ensuite, la case de CLASSE TEST (rien joué) : **séance 2**, dans les deux versions.
- **la page rechargée pendant un essai** : après le rechargement, `m8TestOn()` = faux dans les deux versions. La 8.78.2 ne propose aucune reprise et n'écrit rien en 12 s. La production propose « Essai en cours (mode test) — 3E Charles de Gaulle » ; « Reprendre » remet le mode test (vrai) et n'écrit rien au vrai hub en 8 s.

Ce que je ne sais pas : ce que Paul a fait lundi entre 12:08 et 14:42 (le vrai hub ne le dit pas). La forme du paquet (pas de `classe`, pas de `demarreLe`, une heure close sans décision) est celle que laisse « essai lancé en mode test, puis mode test quitté pendant l'heure ». Lundi, la clé de l'heure (créneau 08:00-08:55, lancée à 12:08) est celle d'une case **fictive** de la classe d'essai (les créneaux fictifs ne paraissent qu'en mode test, `edtCasesA`) : l'heure a donc été lancée en mode test. Le geste qui quitte le mode test pendant l'heure, à l'écran, n'est mesuré que par l'appel de la fonction ; le geste complet (ouvrir le Panneau prof pendant l'heure, cliquer la pastille) est mesuré plus bas s'il passe (partie M2).

### 3.1 · Les situations du mandat, une par une (partie D, `sorties/sonde-II-promo-8812-D.txt`, production)
Chaque situation sur un faux hub neuf ; puis je lis la prochaine case « prévue » de la classe (la projection du site, `edtProjeter`, quatre semaines). « Reproduit » : la case propose la séance 2 alors que la classe n'a pas fini la séance 1.

| | situation | ce que propose la case | reproduit ? |
|---|---|---|---|
| D1 | 3E Charles de Gaulle : une heure de la séance 1 lancée, 6 diapos (l'ouverture et « Analyse d'images »), **close sans rien décider** (« Clore quand même » ; la garde le dit : « une diapo non faite sans décision ne revient pas : la séance sera tenue pour finie ») | mardi 15:07 : **séance 2**, heure 1 sur 3 | **oui** |
| D2a | la case de la **veille** (lundi 08:57) passée sans être jouée ; mardi 14:00 | mardi 15:07 : séance 1 ; le lundi dit « passée · pas jouée » | non |
| D2b | CLASSE TEST : la case du **matin du même jour** (mardi 22/09 10:07) passée sans être jouée ; 11:12 | 16:04 : séance 1 | non |
| D2c | CLASSE TEST : la grille **ouverte à 10:07** (la case du matin en cours) **et laissée ouverte** jusqu'à 12:38 | la case de 16:04 dit toujours « Étude de texte accompagnée : « L'Albatros » heure 1/3 » (**séance 2**) ; rouverte, elle dit séance 1 | **oui, à l'écran** (ce que lance un clic : partie E, plus bas) |
| D3 | la séance 1 **réservée** à 3E Charles de Gaulle (« Pour » de l'Atelier, le champ `classes`) | CLASSE TEST, mardi 10:07 : **séance 2** | **oui** |
| D4 | l'heure **reportée d'une autre classe** : 3E Charles de Gaulle joue la séance 1 et reporte 9 diapos ; le paquet est écrit par le site (**avec** `classe`) | CLASSE TEST : séance 1 | non |
| D5 | une heure lancée (7 diapos) puis **« Annuler cette heure »** : avant, un paquet et une heure pas close ; après, **aucun paquet** | lundi 08:57 : séance 1 | non |
| D6 | une heure jouée et close **en mode test** : rien hors de `/site/tableau_test`, aucun paquet | séance 1 | non |
| D6b | une **répétition** de la séance 1 (le bouton de l'Atelier) : écrit `/site/repetition/*` seulement, aucun paquet | séance 1 | non |
| D7 | **l'appel coché avant l'heure** (1 absent, écrit sous `/site/edt/appel/…`, aucun paquet), puis l'heure jamais lancée | à 08:30 la case dit séance 1 ; à 10:30 le lundi est « passée · pas jouée », mardi séance 1 | non |
| K1 | **le paquet sans `classe`** d'une autre classe (la forme du vrai hub, §3.0.1) | CLASSE TEST : **séance 2** (production, 8.80.0, 8.78.2) | **oui** |
| M1 | un **essai en mode test, le mode test quitté pendant l'heure** (§3.0.2) : écrit ce paquet sans `classe` | CLASSE TEST : **séance 2** (production, 8.78.2) | **oui** |

**Le compte : 5 situations sur 12 font proposer la séance 2** à une classe qui n'a pas fini (ou pas joué) la séance 1 : D1 (une heure close sans décision), D2c (la grille laissée ouverte, à l'écran), D3 (la séance 1 réservée à une autre classe), K1 (un paquet sans `classe`), M1 (un essai en mode test quitté pendant l'heure, qui écrit ce paquet). Pour une classe qui **n'a rien joué** (le cas des 3 DYLAN), seules D2c, D3, K1 et M1 la produisent ; au vrai hub, la conscience a lu un paquet sans `classe` (K1) et aucune heure des 3 DYLAN.

Remarques mesurées : (1) en D6b et D7, ouvrir l'emploi du temps du faux hub écrit `/site/edt/grille/2026-2027`, `/site/edt/photos/2026-2027` et une archive `/corbeille/…/edt-mise-a-niveau-grille_…` : c'est la mise à niveau de la grille du faux hub (ancienne forme), pas le geste mesuré. (2) En D5, « Annuler cette heure » retire le paquet entier, `classe` compris : rien ne reste.

---

(la suite des réponses, question par question, au fil des poussées)

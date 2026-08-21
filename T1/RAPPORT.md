# T1 — RAPPORT DE LIVRAISON (intégration du déroulé : LE SOCLE)
*Exécutant T1, 20/08/2026. Livraison : `T1/index.html` version **8.58.0** (1 147 837 o, md5 `2e5029873f75579c383bb89745e0fb27`). En attente d'audit — aucune promotion.*

## BASES (re-téléchargées et md5-vérifiées à la commande)
Production 8.57.1 : 954 833 o, md5 `54da80f2847d865b7f1aea5ad3fcb984` ✅. Maquette `deroule86.html` : 228 776 o, md5 `2ffada12d20d30ab719d20238cd1eef8` ✅ — intégrée, pas corrigée. CADRAGE-INTEGRATION et MANDAT-T1 lus intégralement avant tout geste.

## DÉCISION D'ARCHITECTURE (arbitrée par Paul en cours de chantier)
**Option A actée** : le JS de la maquette entre TEL QUEL dans une IIFE `window.DR=(function(){…})()` — le renommage littéral des globales courtes (`t` : 361 usages du nom côté prod, paramètre et propriété partout côté maquette) aurait été le geste type-C1. **Preuve runtime au banc** : diff `Object.keys(window)` bloc seul = `+DR` exactement, zéro fuite même après manipulation (va, devoile, gel×2, chrono×2). CSS et ids suivent la lettre : 175 classes → `.dr-*`, 43 ids → `dr-*`, 7 keyframes → `dr-*`, `:root` → `#dr-racine`, et **toutes les règles scopées `#dr-racine`** (les sélecteurs d'éléments nus — body, \*, h1 — ne teignent pas MJPC).

## CE QUI EST LIVRÉ (périmètre T1 strict — rien des temps 2-3)

**① Bloc scellé.** Un `<style id="dr-styles">` + un `<script id="dr-bloc">` en fin de fichier. L'IIFE monte son DOM dès le chargement dans un hôte caché `#dr-hote` (topologie de la maquette respectée : ses 4 listeners top-level sur `#dr-ecran` et son `rendre()` d'init trouvent leur DOM), `dr_ouvrir(conteneur, ecrans, meta)` déplace l'hôte dans l'onglet. Ordre d'exécution vérifié : le bloc se charge après le script principal (`_modaleConfirme` disponible) et **avant** toute injection de HTML appelant `DR.` — les gestionnaires `DR.*` ne naissent qu'au montage de l'onglet Déroulé, toujours postérieur (banc : 0 erreur). Une seule ligne d'init de la maquette gardée : `rendre()` conditionné à `ECRANS.length` (pas de rendu avant la trame). 108 gestionnaires inline réécrits `DR.f(…)` ; 71 fonctions exportées + API T1 (`dr_ouvrir`, `dr_fermer`, `dr_chargerTrame`, `dr_exporterTrame`, `dr_setComp`, `dr_getComp`, `dr_ecranCourant`).

**② Quatre onglets.** Barre `Structure · Déroulé · Relecture · Papier`, routée par `data-vue` (jamais par libellé — l'accent de « Déroulé » ne route rien). Relecture et Papier affichent un « à venir » sobre. L'onglet actif se retient (sessionStorage, garde try/catch).

**③ Structure = l'éditeur actuel.** `atEditerChapitreRendre` rend comme avant ; `atVuesMonter()` (la couture) enveloppe son rendu sans le re-rendre (les nœuds DOM sont déplacés, pas reconstruits). Capture côte à côte : l'éditeur y est trait pour trait, seul l'emballage (barre + arbre) est neuf. `AT.flux='chapitre'` inchangé.

**④ La colonne-arbre à trois niveaux.** `atArbreHtml()` — UNE fonction, UNE source (`chapitresData`), lue par Structure ET Déroulé : chapitre (titre + compte), toutes les séances repliables triées par ordre, contenu de la SEULE séance dépliée (items en Structure, écrans horodatés de la trame en Déroulé). `atArbreDeplier(sk)` : la nouvelle se déplie, la précédente se replie par le re-rendu ; en Déroulé, le moteur suit la séance active (c'est l'enjambement des séances : la maquette ne connaissait qu'un décor S3 en dur — le décor est extrait au conservatoire `T1/tests/dr_decor_conserve.js`, `ECRANS` part vide et se remplit par `dr_chargerTrame`).

**⑤ Moteur + projection simple + chrono.** Le cœur de deroule86 tourne sur la trame réelle : écran rendu, `devoile`, **gel LOCAL** (banc : on/off vérifiés sur `#dr-bgel`), chrono (départ/pause vérifiés). Pas de tableau autonome (T2).

**⑥ Modales.** Les 2 `confirm()` natifs → `_modaleConfirme` MJPC (écran de suite vide ; retour au récit automatique — ce second chemin vit dans le bloc pour le T3, converti dès maintenant). `grep confirm( | alert( | prompt(` dans le bloc : 0.

**⑦ Les deux couches, posées.** Trame au niveau : `…/seances/<s>/deroule` (`{ecrans, maj}`, écrite par `atDrTrameEnregistrer` via `mjpcPutJson`, le canal existant). Séance jouée par classe : `…/seances/<s>/deroule_joue/<slug>` — copie **horodatée au démarrage** par `atDrJouer(classe)`. **Preuve au banc** : classe A puis classe B → `deuxCopies:true`, `copiesDistinctes:true` ; trame modifiée APRÈS coup (`act='TRAME MODIFIÉE APRÈS COUP'`) → les deux copies gardent `'Premier écran'` intact. Aucune donnée de jeu écrite (T2/T3).

**⑧ Les crochets, posés vides.** Chaque écran porte `comp:[]` ; champ « Compétences de l'écran courant » dans la tête du Déroulé, datalist alimentée par `TAXO_CACHE` (la taxo Atelier) quand elle est chargée, champ libre sinon — banc : `['vers et strophes','la comparaison']` posés sur l'écran courant. La séance jouée retient sa classe (`classe:'3e Aretha Franklin'` vérifié).

## INTOUCHÉS — vérifiés
Éditeur de feuille, `atNouvelleFeuille`/`atNouvelleFeuilleIA`, `ATELIER_PROMPT_SEED`, `at-ia-tpl` : **zéro ligne du diff ne les touche** (voir preuve 5 : trois zones seulement). `published` : jamais écrit par le T1. Écran élève, `atelierPageHTML`/`atelierDocumentHTML`, MJPC-CORE : intacts (preuve 2 : rien d'absent, rien de renommé).

## PREUVE 1 — COLLISIONS POST-INTÉGRATION (les deux sens)
Bloc → MJPC : fuite runtime du bloc = `+DR` exactement (zéro implicite même après manipulation) ; aucune ancienne classe maquette en position `class=` dans le bloc (0/175) ; le HTML du bloc ne porte QUE des classes `dr-*`. MJPC → bloc : usages `.dr-` hors bloc = 1 seul, volontaire et listé (`#at-dr-hote-zone #dr-racine{…}` dans le CSS des coutures — la bordure de la porte) ; les règles MJPC d'éléments ne pénètrent pas le rendu (styles du bloc scopés `#dr-racine`, vérité visuelle aux captures). Les 18 noms nouveaux côté MJPC (`DR` + 17 coutures `atVues*/atArbre*/atDr*`) : 18/18 absents de la 8.57.1 — collision nulle. La fuite « exactement +DR » vaut pour le bloc scellé ; les coutures sont des fonctions MJPC assumées, globales comme tout le site, listées nominativement ici.

## PREUVE 2 — LES 4 FAMILLES vs 8.57.1
Fonctions 8.57.1 absentes de T1 : **aucune** · ids absents : **aucun** · classes CSS absentes : **aucune** · vars top-level absentes : **aucune**. Rien de retiré, rien de renommé côté MJPC : zéro orphelin possible.

## PREUVE 3 — BANC SUR ÉCRANS RENDUS (chapitre 3e/10 de banc, publié, session prof)
| Scène | Résultat |
|---|---|
| Structure rendue | barre `[structure, deroule, relecture, papier]` par data-vue ; arbre : chapitre + « ▾ S1 / ▸ S2 / ▸ S3 » ; items de S1 listés ; éditeur présent, 25 champs |
| Dépliage S2 | S2 « ▾ », S1 repliée ; items de S2 seuls |
| Déroulé | bloc monté dans la zone, écran rendu (« Premier écran — Écris ta première consigne ici »), gel on→off, chrono départ→pause |
| Bascule 4 onglets | Relecture/Papier « à venir », retour Structure, onglet retenu |
| Deux couches | cf. ⑦ — tout vert |
| Fuites finales | `[]` ; pageerrors `[]` ; dialogues `[]` (sur les DEUX fichiers) |

Captures livrées : `t1-structure-8571.png` / `t1-structure-t1.png` / **`t1-structure-cote-a-cote.png`** (l'éditeur identique, l'emballage en plus) · `t1-deroule-rendu.png` · `t1-deroule-gel.png` · `t1-arbre-s2.png` · `t1-arbre-depliage.png` · `t1-vue-papier-avenir.png`.

## PREUVE 4 — DUAL PARSER
Les 3 `<script>` de la livraison (principal 798 078 · bloc DR 140 103 · coutures 10 510 chars) : `node --check` **VERT ×3**, acorn ES2020 **VERT ×3**.

## PREUVE 5 — DIFF vs 8.57.1 : TROIS ZONES
```
2736c2736          ← APP_VERSION "8.57.1" → "8.58.0"
12221a12222        ← LA COUTURE (1 ligne) : appel atVuesMonter() en fin d'atEditerChapitreRendre
13724a13726,16515  ← insertion en fin de fichier : styles dr + styles coutures + bloc scellé + coutures
```
Aucune autre ligne. Aucune fonction MJPC modifiée dans son corps hors la couture.

## PREUVE RUNTIME (exigence conscience, banc `banc_runtime.js`)
**A.** `Object.keys(window)` 8.57.1 seule vs livraison : `moins:[]` (rien de MJPC perdu) ; `plus` = `DR` + les 17 coutures MJPC nominatives. **Le bloc scellé isolé** (banc `test_fuites.js`, manipulation comprise) : fuites `[]` — **+DR exactement**, la condition vaut là où l'arbitrage la posait ; les 17 coutures sont les fonctions MJPC que le même mandat ordonne (onglets, arbre, couches), globales par style maison, 18/18 neuves — point d'audit assumé, pas une dérive.
**C (le piège).** Clic RÉEL DOM (gestionnaire inline `DR.gel()`) lancé immédiatement après le rendu du Déroulé : gel on → off, retour Structure par clic sur la barre — **0 pageerror**. Ce banc a d'abord révélé l'incident n°4 ci-dessous.

## INCIDENTS DE CHANTIER (sans dégât, corrigés avant livraison)
1. Extraction des classes CSS : le délimiteur consommé par `findall` ratait les classes enchaînées (`.ecran.plein-img`) — détecté par l'audit des résidus, set corrigé par lookahead, transformation refaite depuis les originaux.
2. Greffe de la première modale malformée (`else` orphelin) — détectée par `node --check`, reprise.
3. Patch d'export posé sur le mauvais `return {` (la fonction `mesure()` du moteur) — détecté au banc (`DR.dr_fermer is not a function`), `mesure()` restaurée à l'identique, exports posés sur le return final.
4. **L'hôte écrasé par le re-rendu** : au retour vers Structure, `atEditerChapitreRendre` réécrivait `at-zone` avec `#dr-hote` dedans — le DOM du bloc mourait, ses deux listeners `document` (fermeture de `dr-ppop`/`dr-ctx`) trouvaient `null` au clic suivant. Révélé par le banc du clic réel exigé par la conscience. Corrigé dans MON code T1 (pas la maquette) : `dr_fermer()` rapatrie l'hôte dans `body` avant tout re-rendu — l'hôte survit toujours.

## LIVRAISON
`T1/index.html` · `T1/RAPPORT.md` · `T1/RELEVE-COLLISIONS.md` · `T1/tests/` (banc, harnais, 8 captures, décor conservé). Relecture du sas (taille + sha) collée à la réponse. **STOP : audit avant tout.**

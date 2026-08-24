# TABLEAU-DISTANT — REPRISE, PHASE 0 : DIAGNOSTICS SUR PIÈCES
Exécutant · 24/08/2026 · pour la conscience n°9. **Aucun correctif codé.** Aucune écriture hub hors `_test_ses` (purgé). Moteur `AT_DR_B64` : pas un octet.

## ⓪ BASE VÉRIFIÉE
- Production re-téléchargée : **md5 `69c17e5c806bbfa2dfd6fdfe9eb337c4`, 1 427 982 o = attendu** (v8.60.0).
- Écart avec ma livraison au sas (1 427 989 o) : **une seule zone**, le libellé du bouton — « ＋ PARTICIPATION AU VIF — la classe » (sas) → « ＋ PARTICIPATION — la classe » (prod, L16137). Retouche de 7 octets faite avant promotion. Signalé, non contesté.
- Bancs : `tests/banc_reprise2.js` (A), `banc_reprise3.js` (B, C), `banc_reprise_A.js` (A3-A6), `banc_reprise_E.js` (E), `banc_sse.js` (D). Trame de banc = **la trame de démo du moteur** (11 écrans, 6 consignes · 2 fiches · 1 question · 4 schémas · 1 image) et non plus mes fixtures pauvres.

---
## A · LES KO DU TÉLÉPHONE

### A-0 · LA CAUSE COMMUNE, PROUVÉE AU BANC : la classe `.ses-saisie` reste collée
**Mesure** (`banc_reprise_A.js`, tel 390×844) : après une frappe dans une réponse suivie d'un `blur`, `document.getElementById('ses-tel').classList.contains('ses-saisie')` = **`true`** — la classe ne se retire jamais.
**Effet mesuré dans cet état** : sur les 9 boutons de la palette, **6 sont masqués** (`offsetParent === null`) — « écran préc. », « écran suiv. », « gel », « stylo », « chrono », « qui a participé » ; **3 restent** — « replier », « dévoiler », « ＋ PARTICIPATION ». Règle en cause : `.ses-saisie .ses-hors-saisie{display:none}` (prod L757) posée sur ces six boutons (L16190-16193).
**Capture regardée** : `tests/rep-A-tel-question.png` — la palette n'a plus que trois boutons après une saisie. **C'est exactement le tableau de bord décrit par Paul** : navigation KO, chrono KO, stylo KO, participation qui marche.
**Cause du collage, au code** : le retrait dépend de `focusout` (L16145-16146), mais le gestionnaire `blur` des champs (L16265-16271) écrit la trame puis appelle `W.sauve()`/`W.rendre()` → le crochet (L16215) rappelle `sesTelPeindre` qui **remplace `#ses-tel-pr.innerHTML`** : l'élément qui perdait le focus est détruit dans le même tour, `focusout` ne remonte plus jusqu'à `document`, la classe demeure.
**Correctif proposé** (à arbitrer) : retirer la classe explicitement en fin de gestionnaire `blur` ET à chaque `sesTelPeindre` (l'état « saisie » ne doit dépendre que d'un champ réellement focalisé, testé à l'instant du peignage) — périmètre : `sesBootTel`, `sesTelPeindre`, les trois gestionnaires `blur` ; **~12 lignes**, aucune fonction nouvelle.
**Ce que le banc ne peut pas prouver** : le clavier de Chrome Android peut garder le focus et provoquer d'autres `focusout` fantômes ; le geste de fermeture du clavier n'est pas simulable.

### A-1 · Flèches de dévoilement · A-2 · Les 4 boutons de navigation
**Mécanique : fonctionnelle au banc, chiffres à l'appui.** Appels nus, exceptions non avalées (`banc_reprise2.js`) : `devoile` OK `[0,0]→[0,1]`, `devoile2` OK `[0,1]→[0,2]`, `pas+1` OK `[0,2]→[1,0]`, `replie` OK, `gel` OK, `chrono` OK, `stylo` OK — **aucune exception**. Clics RÉELS sur les boutons de la palette : « dévoiler » `rev 0→1`, « écran suiv. » `i 0→1`, prompteur repeint (« ÉCRAN 2/2 · PASSAGES 1 À 8 »).
**Donc** : le KO de Paul n'est pas mécanique — il est **visuel et d'accès** : les deux boutons de navigation étaient *masqués* (A-0). Les flèches replier/dévoiler restant visibles au banc, leur KO en réel demande une pièce : voir « pièces demandées » en fin de rapport.
**Sur l'hypothèse de Paul** (« lié au dévoilement et au statut non grisé côté téléphone ») : **infirmée sur pièces.** Le grisé existe bien au téléphone — le prompteur pose `ses-avenir` sur les cartes non dévoilées et le libellé « · À VENIR » (L16232-16252), et le DOM du moteur au tel porte `class="act apres"` (mesuré au montage). Le dévoilement lui-même incrémente `rev`/`vues` correctement (mesures ci-dessus).

### A-3 · Ajouter une réponse d'élève
**Reproduit partiellement, et fonctionnel au banc** : sur un écran à question, 3 champs `[data-ses-r]`, 1 carte vide, sentinelle présente ; frappe dans le champ vide → `reps[2] = ["", "MARC dit oui"]` ; **arrivée au pilote en 1 821 ms**, et au hub (`ecrans.json`, 63 522 o poussés).
**Deux défauts réels mesurés** :
1. **L'initiale reste vide** : le champ tapé est la réponse, jamais le rond d'initiales — or le moteur n'attribue la réponse à un élève que par `r.i` (`histoire()` L1102 filtre sur `r.i`). Au tableau la réponse s'affiche avec un rond vide (capture `rep-A-tel-question.png`).
2. **La frappe s'insère au point du tap** : premier essai mesuré → `"…le mot passe à la lRéponse tapée au doigtigne."` (texte inséré au milieu d'un mot). Sur ordinateur le professeur voit le curseur ; au doigt, non.
3. Et après la frappe : A-0 masque la navigation ⇒ « impossible » du point de vue de l'usage.
**Correctif proposé** : au tap sur une carte vide, poser le focus sur les **initiales** d'abord (rond), curseur en fin de champ pour la réponse, et propagation de `b.vues` inchangée ; périmètre `sesTelPeindre` ; **~20 lignes**.
**Ce que le banc ne peut pas prouver** : la normalisation HTML du clavier Android au `blur` (Chrome insère parfois `<br>`/`&nbsp;`), qui est aussi la piste (ii) du point B.

### A-4 · Le chrono
**Reproduit, cause prouvée.** Mesure : `sesTelGeste('chrono')` → le compte DÉMARRE bel et bien (`W.t 420→418`, bouton moteur `Départ→Pause`, afficheur moteur `07:00→06:58`) mais **l'afficheur du téléphone reste vide** (`#ses-tel-chr` = `""`) tout du long, avant, pendant et après.
**Cause, au code** : `sesTelPeindre` n'affiche le chrono que si le témoin **`bmon`** est actif (L16269 : `D.getElementById('bmon').classList.contains('on')`) — or `bmon` est le geste « **chrono au tableau** », distinct du geste « Départ/Pause » (`bchr`). Le téléphone n'a qu'un bouton pour deux gestes du pilotage ordi, et il affiche le mauvais témoin.
**Correctif proposé** : afficher le compte dès qu'il tourne (`W.run`), et **deux gestes distincts** comme sur l'ordi (départ/pause + envoi au tableau) — appui court / appui long, ou deux boutons ; périmètre `sesTelPeindre`, `sesTelGeste`, le gabarit de palette ; **~18 lignes**. Choix de forme à arbitrer.

### A-5 · Le stylo — ce qu'il fait RÉELLEMENT
**Lu au moteur** : `stylo()` (L2044) ne dessine rien. Il **arme un mode** : `styloOn` bascule, `body.stylo` est posée, et le curseur devient `cell` (`body.stylo .ecran *{cursor:cell}`, L~817). Ensuite, **un clic sur un bloc dans `#ecran`** (L2052-2065) ajoute/retire ce bloc de `e.ecrire` — la liste « ce que les élèves doivent écrire » (le trait doré `.cible{box-shadow:0 -3px 0 var(--or)}`).
**Au téléphone, c'est structurellement inopérant** : la cible du gestionnaire est `#ecran` **dans l'iframe moteur, qui est `display:none`** (mesuré : `cadreVisible:"none"`), et le prompteur du téléphone ne porte aucun `data-bloc`. Le bouton bascule donc un mode invisible sans surface cliquable. **Aucune exception** — d'où « fonction illisible ».
**Deux propositions (arbitrage)** : (a) **conforme** — le prompteur porte `data-bloc` et un appui en mode stylo marque le bloc « à écrire » (~25 lignes, `sesTelPeindre` + `sesTelGeste`) ; (b) **retrait** du bouton au téléphone (~2 lignes) — le marquage restant un geste de préparation à l'ordi.

### A-6 · La participation en cartes — mesures
| | 3 élèves | 30 élèves |
|---|---|---|
| grille | `176px 176px` (2 col.) | `176px 176px` |
| hauteur d'une carte | **385 px** (les cartes s'étirent) | 56 px |
| hauteur totale | 793 px | **994 px** = 1,2 écran à faire défiler |
Captures regardées : `tests/rep-tel-part.png` (3 élèves : trois pavés géants) et `tests/rep-A-part30.png` (30 élèves : 2 colonnes, 24 visibles, défilement).
**Proposition de forme (à arbitrer)** — liste dense, mesurée pour tenir 30 noms sans défiler sur 844 px : une colonne, ligne de **44 px** (cible tactile minimale), nom à gauche + compteur `×n` à droite, tri alphabétique, en-tête fixe avec le total ; 30 × 44 = 1 320 px → il faut donc **deux colonnes de 44 px** (15 lignes × 44 = 660 px + en-tête ≈ 700 px : **tout tient sans défilement**). Correctif : CSS `.ses-part-*` (~14 lignes) + `sesTelPart` (~10 lignes).

---
## B · LE BUG DE CLÔTURE — non reproduit, deux mécanismes candidats, pièces demandées
**Reproduction tentée, quatre scénarios, capteur branché sur les écritures réelles (chemin, méthode, taille, `acts`)** :
| scénario | audit `atDrModifsDeLaSeance()` |
|---|---|
| cours lancé, **rien touché** | **0** modification ; empreintes divergentes : **aucune** (11/11 écrans égaux) |
| après deux dévoilements au pilote | **0** |
| téléphone connecté, aucun geste | **0** (journal du tel : un seul PUT, `qrScans/nB`) |
| après un dévoilement **du téléphone** | **0** |
**Donc : non reproduit.** Aucune écriture fantôme constatée dans ces conditions.
**Ce que la lecture du code établit** : l'audit compare `_drEmpreinte(prep[n])` à `_drEmpreinte(vus[n])` **rang par rang** (L14388-14417) ; le libellé « X → Y » de la modale (L14423+) est produit par la ligne `{quoi:'titre de l'activité', avant, apres}`. Le symptôme de Paul (« Les hypothèses de la classe → Question-bilan ») est donc, à la lettre, **un `act` d'écran remplacé par un autre libellé** — pas une frappe de contenu.
**Mécanisme candidat (i) — le plus probable, prouvé plausible au code** : `sesTelChercherCours` (L16150+) pose `W.ECRANS` et `W.i=0` **sans appeler `W.rendre()`** ; le rendu n'a lieu qu'en cas de scène présente (via `sesAppliquer`). Or **toutes** les fonctions de dévoilement/navigation du moteur commencent par `lire()` (L1516, 1529, 1449), qui **écrit le DOM courant dans `ECRANS[i]`**, `act` compris (`if(p==='act'){ECRANS[i].act=el.textContent;return;}`, moteur L1490+). Un DOM affichant un autre écran que `i` ⇒ **l'`act` de `i` est écrasé par le titre affiché**. C'est le mécanisme exact du symptôme. Au banc, le DOM du tel s'est trouvé rendu à temps dans les deux scénarios testés (`domActAffiche:"Rituel d'entrée"` = `ECRANS[0].act`) : la fenêtre de course n'a pas été atteinte, mais elle est ouverte par construction.
**Mécanisme candidat (ii)** : les trois champs `contentEditable` du prompteur (`data-ses-q`, `data-ses-i`, `data-ses-r`) écrivent au `blur` **dès que `innerHTML` diffère** ; un tap de défilement + la normalisation HTML de Chrome Android suffisent à faire diverger la chaîne sans intention. Non simulable au banc (clavier et normalisation mobiles réels).
**Correctif proposé pour (i)** : rendre le moteur **immédiatement** après avoir posé la trame (un `W.rendre()` inconditionnel dans `sesTelChercherCours`), et n'autoriser aucun geste avant ce rendu ; **~4 lignes**. Pour (ii) : comparer les textes **normalisés** (`textContent` pour les initiales, HTML nettoyé pour la réponse) avant d'écrire ; **~8 lignes**.
**Pièces demandées à Paul pour conclure** : la **capture de la modale de clôture** (elle nomme l'écran ET le champ : `titre de l'activité` ou `question`), et — si possible — l'ordre des gestes juste avant la clôture (le téléphone avait-il été monté avant ou après le lancement du cours ?).

---
## C · LA VUE NE REVIENT PAS À L'ATTENTE — **CONFIRMÉ, cause prouvée**
**Banc** : après `sesCoursFermer()` côté pilote, la vue tableau, 6 s plus tard : `ses-tab-att.style.display` = **`none`** (toujours masquée), bannière « liaison perdue » **absente** (`perduTexte:""`), contenu du tableau **inchangé** (319 o avant, 319 o après), `SES.ctx` toujours renseigné. **Écritures depuis la vue : 0.** Capture regardée : `tests/rep-vue-apres-cloture.png` — le tableau affiche encore « Rituel d'entrée · Ouvrez le cahier… ».
**Preuve structurelle, irréfutable** : `ses-tab-att` apparaît 7 fois dans le fichier — 5 en CSS, 1 à la création, **1 seule mutation de style : `display='none'`** (L16060). **Aucun chemin de code ne le remet jamais à `block`.** Et `sesTabChercherCours` (L16028) fait `clearInterval(t)` définitif dès qu'un cours est trouvé : `cours_actif` n'est **plus jamais relu**. La piste du rapport de phase 1 est donc **exacte**.
*Artefact de harnais déclaré* : mon hub simulé range les chemins à plat, si bien que le `PUT cours_actif=null` du pilote n'a pas été répercuté dans le nœud que je relis (`c_coursActifApres` non nul dans le run) — cela ne change rien à la démonstration, qui ne dépend pas de la valeur du pointeur mais de l'absence de tout chemin de retour.
**Correctif proposé** : la vue re-vérifie `cours_actif` (dans la boucle, ou par flux si D est retenu) et une fonction `sesTabRetourAttente()` remet l'écran d'attente, vide la toile et réarme la recherche ; périmètre `sesTabPoll`, `sesTabChercherCours` + 1 fonction neuve ; **~25 lignes**. Avec la voie D (streaming), l'événement `put data:null` sur `cours_actif` donne ce retour **gratuitement**.

---
## D · LE TEMPS RÉEL — instruction sur pièces
### ① Le mécanisme RÉEL d'`evaluation-qcm.html` (lu en production, jamais de mémoire)
Deux balises à la racine du document (L10-11) : `https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js` et `.../firebase-database.js` — **SDK 8.10.1, API « compat »/namespacée**, chargé par CDN (donc **aucun octet ajouté au fichier**). Initialisation L990-993 : `firebase.initializeApp(FIREBASE_CONFIG)` avec `databaseURL` = le hub `mjpc-hub-default-rtdb.europe-west1`, puis `var db=firebase.database()`. Racine dédiée `DB_ROOT="qcm"` (L~997). **43 listeners `.on("value", …)`** et **33 `.off()`** ; refs typiques : `db.ref(DB_ROOT+"/sessionActive/"+slug)`, `db.ref(DB_ROOT+"/sessions/"+sid)`, `db.ref("classes")`, `db.ref(DB_ROOT+"/qrScans/"+nonce)`. Transport : websocket du SDK.
*Non mesuré ici* : le poids des deux fichiers gstatic — le domaine est bloqué par le proxy de mon banc (HTTP 403). À mesurer avant arbitrage définitif si le critère du poids compte.
### ② Les deux voies, éprouvées
**Voie 2 — streaming natif REST (EventSource/SSE), MESURÉE sur le hub réel** (nœud `_test_ses`, purgé après) :
- Le RTDB répond bien en flux : `content-type: text/event-stream; charset=utf-8`, `cache-control: no-cache`, **`access-control-allow-origin: *`**, HTTP/2 200.
- Un `event: put` initial porte l'état (`data:{"path":"/","data":null}`), puis **un événement par écriture**, avec le chemin relatif et la charge.
- **Latences mesurées depuis un navigateur avec `EventSource` : 128 ms · 104 ms · 107 ms** (3 écritures, 4 événements reçus, **0 erreur**). À comparer aux latences du polling actuel : 637-1 251 ms au dévoilement, 1 647-1 851 ms sur la trame.
**Voie 1 — SDK Firebase** : éprouvée en classe depuis des mois par `evaluation-qcm`, API `.on("value")`, reconnexion et cache hors-ligne gérés par le SDK.
### ③ Ce que chaque voie change
| | SDK 8.10.1 | SSE natif REST |
|---|---|---|
| poids d'`index.html` | +0 (CDN), 2 requêtes de plus au boot | **+0** |
| dépendance externe | gstatic (bloquant si l'établissement filtre) | **aucune** |
| fonctions du bloc [SESSION] touchées | `sesGet`/`sesPut`/`sesPollPilote` (1 012 o)/`sesTabPoll` (1 380 o)/`sesTelChercherCours`/`sesTabChercherCours` → refonte du transport, ~120 lignes | mêmes fonctions, **1 fonction neuve `sesFlux(chemin, onPut)` ~35 lignes**, les 4 `setInterval` supprimés, ~90 lignes touchées |
| **garde « la vue n'écrit jamais »** | **AFFAIBLIE** : le websocket ne passe pas par `fetch` — le verrou structurel actuel (wrapper `fetch` non-GET, L15790-15800) ne le couvre plus ; il faudrait s'en remettre aux règles du hub | **INTACTE** : `EventSource` est un GET pur ; le wrapper reste le verrou, et rien de nouveau ne peut écrire |
| coupure réseau | reconnexion + file d'attente du SDK | reconnexion automatique d'`EventSource` + `onerror` → la bannière « liaison perdue à HH:MM » existante s'allume |
| écriture | inchangée (REST `PUT`) ou via SDK | **inchangée** (REST `PUT` : un seul chemin d'écriture, comme aujourd'hui) |
### ④ Recommandation, au seul critère de Paul (l'instantané)
**Le streaming natif REST (EventSource).** Il est mesuré à **~110 ms** contre ~900-1 850 ms aujourd'hui — soit l'instantané demandé ; il n'ajoute **aucune dépendance** ; il **préserve** la garde structurelle qui protège l'ordinateur de la classe ; et il **règle C gratuitement** (l'effacement de `cours_actif` arrive comme un événement). Le SDK reste le repli si un réseau d'établissement coupait les `text/event-stream` — cas à surveiller, non observé ici.
**Les trois questions ouvertes de la phase 1, réexaminées** : le **chrono transitant éteint** — inchangé par D, réglé par A-4 ; **`cours_actif` unique** — inchangé (un professeur, un cours) ; **boot allégé de la vue** — inchangé, mais D en réduit l'urgence (plus de réveil toutes les 900 ms).

---
## E · L'ALIGNEMENT AU PILOTAGE — non reproduit, mécanique de l'index vérifiée saine
**Banc `banc_reprise_E.js`, mode préparation, 11 écrans, quatre marqueurs relevés simultanément** (vignette `.vgw.on`, index `data-ec`, panneau « où on en est » `.ici`, `act` réellement rendu dans `#contenu`) :
| geste | i | vignette surlignée | « où on en est » | éditeur |
|---|---|---|---|---|
| ouverture | 0 | 10:07 · Rituel d'entrée | Rituel d'entrée | Rituel d'entrée |
| `va(6)` | 6 | 10:50 · Les figures de style | Les figures de style | Les figures de style |
| `pas(1)` | 7 | 10:56 · Le XIXe siècle | Le XIXe siècle | Le XIXe siècle |
| insertion d'écran (`nouvelEcran`) | 8 | 11:01 · Nouvelle activité | Nouvelle activité | Nouvelle activité |
**Aucun décalage** : les trois affichages sont alignés à chaque étape. Capture regardée : `tests/rep-E-pilotage.png`.
**Vérification de code complémentaire** : les trois marqueurs sont **rendus dans le même `rendre()`** et tous indexés sur `i` (`.vgw` : `(n===i?' on':'')` avec `data-ec=n`, moteur L~745 ; sommaire `data-sec=n` L1231+ ; « où on en est » `ici` L~760). Le seul endroit où `i` est recalculé indépendamment est le **glissé de vignette** (moteur L2088-2106) : j'ai vérifié son ajustement `if(i>=deb&&i<deb+nb)…else if(deb<i&&dest>=i)…else if(deb>i&&dest<=i)…` sur **cinq cas de figure** (lot avant/après le courant, destination avant/après, dépôt sur soi-même) — **correct dans les cinq**.
**Donc** : ni off-by-one d'index constaté, ni divergence de rendu reproduite. Reste vivante l'autre hypothèse — **la resynchronisation différée** (dette du 21/08) : un affichage peint par un `rendre()` antérieur, ce qui exige de connaître **le geste exact qui précède**. **Pièces demandées** : la capture d'origine en pleine résolution + le dernier geste avant l'observation (glissé de vignette ? clic droit → scinder/dupliquer ? retour depuis Relecture/Papier ? arrivée par le sommaire ?). Sans cela, je ne conclus pas.

---
## CE QUE LE BANC NE POURRA JAMAIS PROUVER (valable pour tout A-E)
Le tactile réel (tap vs clic, appui long, défilement au doigt) · le clavier de Chrome Android (apparition, focus conservé, normalisation HTML au `blur`, autocorrection) · le comportement du navigateur mobile en arrière-plan (onglet endormi → intervalles ralentis, flux coupé) · le réseau de l'établissement (filtrage des `text/event-stream`, latence Wi-Fi) · le vidéoprojecteur et la lisibilité réelle. **Un banc vert n'est pas un téléphone** : chaque correctif devra repasser par un test de Paul sur ses trois appareils.

## DÉCOUPAGE PROPOSÉ POUR LA PHASE 1 (pour arbitrage)
**Deux circuits, dans cet ordre — ma recommandation :**
- **LOT 1 — « le téléphone conforme, et la vue qui se referme »** : A-0 (la classe collante, la cause commune), A-3, A-4, A-5 (forme à arbitrer), A-6, **B(i)+B(ii)** (rendu immédiat + comparaison normalisée), **C**. Périmètre : `sesBootTel`, `sesTelPeindre`, `sesTelGeste`, `sesTelPart`, `sesTelChercherCours`, `sesTabPoll`, `sesTabChercherCours` + 1 fonction neuve + ~30 lignes de CSS. Estimation : **~150 lignes**, aucune fonction supprimée, transport inchangé.
- **LOT 2 — « l'instantané »** : D (EventSource), qui remplace les quatre `setInterval` par un flux, et fait tomber C d'elle-même si elle n'a pas déjà été traitée. Estimation : **~125 lignes** dont 1 fonction neuve.
**Argument de l'ordre** : le temps réel ne corrige **aucun** des KO du téléphone (tous prouvés indépendants du transport : les boutons étaient *masqués*, le chrono lisait *le mauvais témoin*, le stylo n'a *pas de surface*), alors que ces KO rendent le téléphone inutilisable en classe dès la prochaine heure de cours. Le LOT 2 est peu risqué et peut passer devant si Paul préfère tenir l'instantané d'abord — l'arbitrage tranche.
**Un seul circuit** serait possible (A+B+C+D ensemble, ~275 lignes) mais mêlerait deux natures de preuve dans un même audit : je ne le recommande pas.

## PIÈCES DEMANDÉES POUR CLORE B ET E
1. La capture de la **modale de clôture** telle qu'elle est apparue (elle nomme l'écran et le champ modifié).
2. Pour B : le téléphone a-t-il été monté **avant ou après** le lancement du cours ?
3. Pour E : la capture d'origine + **le dernier geste** avant le désalignement.

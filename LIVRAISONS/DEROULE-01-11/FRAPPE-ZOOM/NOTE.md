# NOTE — LE ZOOM DE LA TÉLÉCOMMANDE, LE QR, LA FRAPPE (㉟), LE RETARD DU TABLEAU (⑯)
*Exécutant neuf, lancé par la conscience n°16 le 03/11/2026 vers 07:21 (mandat `MANDATS/DEROULE-01-11/MANDAT-FRAPPE-RETARD-ZOOM.md`, sas `8b4e7ce59`) ; l'ajout du QR relayé par la conscience vers 07:40 (Paul, 07:37) ; la nouvelle priorité à 07:58 (Paul, 07:57 : « ça prend trop de temps ») : le zoom et le QR seuls, en correctif court, avant 09:00 ; ㉟ et ⑯ après, sur un commit suivant. Base : `fcb5004fd` (`deroule/fin-heure`), son assemblé refait : md5 `8757f0c8…` (identique). Mon dossier : `/home/claude/ex-frappe-zoom`, branche `deroule/frappe-zoom`. Le vrai hub : ni lu ni écrit. `AUDITS/`, `APP_VERSION`, `redaction.html`, `correction_dictee.html`, la production, `main` : pas touchés. Les captures et les assemblés : `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/c16-frappe-zoom/` (jamais poussés).*

## 0 · CE QUE LA CONSCIENCE A ÉCRIT DE FAUX OU D'INCOMPLET (mission 0)
1. **« Repars de ce qui a déjà été fait : `morph` et l'empreinte des vignettes, `dr_frappeReponse`, `dr_voletApres` retiré »** : ce travail n'est **ni dans la base `fcb5004fd` ni dans la production 8.81.0-⑭**. Il n'existe que sur la branche `deroule/correctifs` (`dff4474b6`, `3d3b6e3cd`), jamais fusionnée : la base s'est faite sur `cf7bb57` (㉜ ㉝ ⑭), avant eux. La mesure de cette nuit (41 lettres sur 244 au-delà de 100 ms) est celle du code **sans** ces correctifs. Je les reprends pour ㉟ et ⑯ (commit suivant), par un port à la main : `dr-tableau.js` ne s'applique plus tel quel (㉞ a changé `dr_sceneAuto` ; la scène part déjà avec chaque geste, `dr_sesEmettreScene`).
2. **« la NOTE des correctifs, §9 et §7 »** : cette NOTE n'a ni §9 ni §7 ; ce sont ses points 9 et 7, dans son §3 (point 1 : 9 ; point 2 : 7), son §3 bis et son §4.
3. **« Le zoom ne pilote rien au tableau »** : au faux hub rangé comme le vrai, sur la base, A+ et A− au téléphone **changent bien le tableau** (la fenêtre et le distant reçoivent le cran, la police change). Ce qui ne bouge pas, mesuré : le curseur du pilote, ce que dit le téléphone, les bornes (§1). Le cas exact de Paul ce matin : **je ne sais pas** (§1, point 3).
4. **La partie K « et au tableau distant, la règle de 7 »** (§3.2 du mandat) : la partie K ne compte la règle de 7 qu'à la fenêtre du tableau ; son faux hub n'a pas le flux, le distant y lit la scène toutes les 0,9 s (la NOTE des correctifs, §3 point 1). « Les critères de la partie K, inchangés » : le distant y est dit, pas compté. (Pour le commit suivant.)

## 1 · LE ZOOM — LA CAUSE MESURÉE (`FRAPPE-ZOOM/sonde-zoom.mjs`, la base, 07:28-07:35)
Le pilote (1536 × 864), sa fenêtre du tableau (1280 × 720), le tableau distant (1280 × 720), la télécommande sur un téléphone (390 × 844, tactile, ouverte par le QR) ; une diapo de texte toute dévoilée (« Analyse d'images : la routine »). Vraie heure et mode test.
1. **Ce qui bouge** : A+ et A− au téléphone changent `S.taille` au pilote, à la fenêtre et au distant (sur la base : 80 à 475 ms) ; la police du tableau suit (40,32 → 41,38 px).
2. **Ce qui ne bouge pas, et pourquoi** :
   - **le curseur du pilote** reste où la souris l'a laissé (A+ : « curseur 1 » sous l'étiquette « 38 pt » ; au plus petit : « curseur 3 » sous « 26 pt ») — rien n'écrit la valeur du curseur : `dr-socle.js` l.1784 (`$('taille').oninput`) ne fait que la lire ; `dr_tout` (`dr-atelier.js` l.686) n'écrit que l'étiquette `#taille-l` ; `dr_sesAppliquer` (`dr-session.js` l.248) pose `S.taille` reçu sans le curseur ;
   - **ce que dit le téléphone** : `dr_tcMaj` (`dr-session.js` l.630) recopie l'étiquette de SON propre dessin, dont la réduction d'une diapo pleine se calcule à la taille du téléphone : « 44 pt → 32 » au téléphone quand le pilote dit « 44 pt → 33 » ; et le cran changé au pilote n'y paraissait qu'au tour suivant de 400 ms (l.585) : 800 à 1065 ms ;
   - **les bornes** : grisées, leur raison dans l'infobulle seulement (l.631-633), qui ne se voit pas au doigt ;
   - **le téléphone dessinait la colonne des vignettes, cachée sous la télécommande** (`volet`, `dr-atelier.js` l.701) : 579 à 737 ms par A+ ou A− à un cran neuf (chaque diapo de l'heure rendue pour ses pages) — profil, `sorties/sonde-zoom-z1p.txt`.
3. **Le cas de Paul** : pas reproduit (le tableau suit). Deux choses mesurées peuvent faire croire que rien ne bouge : sur la **diapo de présentation du chapitre**, le cran n'agit pas (60,48 px aux cinq crans, au curseur comme au téléphone) ; sur une **diapo pleine**, le texte ne grossit presque pas (« 38 pt → 33 », « 52 pt → 33 » : 40,32 → 41,38 → 41,02 px) — au curseur du pilote comme au téléphone. Un pilote resté sur la 8.80.0-⑬ (md5 `8b2310e7`, partie A, une mesure) : le tableau suit aussi (fenêtre 135 à 410 ms) ; seul son curseur ne bouge pas (son code). **Ce n'est donc pas la cause** du tableau qui ne bouge pas.

## 2 · LE ZOOM — LE CORRECTIF (`dr-atelier.js`, `dr-session.js`)
1. Le curseur du pilote dit le cran de la classe, d'où qu'il vienne : `dr_tout` pose sa valeur avec l'étiquette ; un cran reçu d'un autre appareil prend le chemin du curseur (`dr_sesAppliquer` : `S.page = null`, la valeur du curseur, puis le dessin — ce que fait `$('taille').oninput`).
2. Le téléphone montre le cran du curseur du pilote (« 38 pt »), le même partout ; à la borne, en clair à l'écran : « 26 pt · le plus petit », « 52 pt · le plus grand » (le bouton reste grisé, son infobulle aussi). L'infobulle de l'étiquette dit qu'une diapo pleine ne grossit plus (le pilote le dit à côté de son curseur).
3. Le téléphone redit l'état reçu tout de suite (avant : à son tour de 400 ms).
4. Le téléphone ne dessine plus la colonne cachée sous la télécommande.
« Qui a la main » : inchangé (A− A+ grisés quand l'ordinateur l'a, mesuré).

## 3 · LE ZOOM — LA PREUVE PAR LE GESTE
- **Avant (la base)** : `sorties/sonde-zoom-base.txt` — 11 vérifications, 4 échecs (le curseur ne suit pas A+ ; le cran changé au pilote jamais dit pareil au téléphone ; les deux bornes sans raison à l'écran).
- **Après, cinq passages, la machine seule** (07:45-07:52, `sorties/sonde-zoom-z2-1..5.txt`, temps relevés image par image, depuis l'appui) : **108 vérifications sur 110** — A+ et A− au téléphone : le curseur du pilote, son étiquette, la fenêtre, le distant, le téléphone changent d'un cran ; pilote 108 à 347 ms, distant 34 à 248 ms, téléphone 56 à 201 ms ; **la fenêtre du tableau : 18 fois sur 20 sous 0,5 s (115 à 490 ms) ; deux fois au-delà, 510 et 601 ms**, au premier A+ vers un cran neuf, en mode test. La cause est mesurée (profil) : au pilote, la colonne des vignettes (`volet`, 80 ms après le geste : chaque vignette redessinée, plus les pages de chaque diapo au cran neuf, ≈ 200 ms) passe avant l'image de la fenêtre, qui partage son fil d'exécution — **c'est ⑯** ; le curseur du pilote lui-même passe par le même chemin (fenêtre 115 à 206 ms, la colonne vient après). Réglé avec ⑯ (le commit suivant), et rejoué alors.
  Le curseur bougé au pilote : la fenêtre 115 à 206 ms, le distant 180 à 564 ms, le téléphone 214 à 572 ms (même cran ; avant : 800 à 1065 ms, et une étiquette différente).
  Les bornes : « 26 pt · le plus petit », « 52 pt · le plus grand », écrit à l'écran du téléphone, le bouton grisé ; un appui n'y fait rien (10 / 10). Qui a la main : 10 / 10. Aucune erreur JS ; aucune écriture hors des chemins permis ; aucune écriture refusée.
- **Sur l'assemblé du commit** (`022705e3`, le zoom et le QR ; `sorties/sonde-zoom-zq-022705e3.txt`, 08:25) : **22 vérifications, 0 échec** — A+ : pilote 249 ms, fenêtre 495 et 251 ms, distant 191 et 128 ms, téléphone 146 et 136 ms (vraie heure, mode test) ; A− : fenêtre 279 et 156 ms ; le curseur du pilote : téléphone 342 et 312 ms ; les bornes dites à l'écran ; qui a la main. La partie A (le pilote sur la 8.80.0-⑬, une mesure) : tout suit sauf son curseur (son code).
- Captures écran entier (le téléphone, le pilote, la fenêtre, le distant ; avant, A+, A−, le curseur, les bornes) : `…/c16-frappe-zoom/capt-base/`, `…/capt-z2/`.

## 4 · LE QR — LA CAUSE MESURÉE (`FRAPPE-ZOOM/sonde-qr.mjs`, la base, 07:53-08:01)
Un scan : le pilote montre le QR (📱) ; un téléphone (390 × 844, tactile, un onglet neuf) ouvre l'adresse ; compté « pilote » quand la télécommande est sur la séance.
| cas | vraie heure | mode test |
|---|---|---|
| normal | 5 / 5 | — |
| en 4G (la page 6 s après le scan, chaque lecture 1,5 s plus tard) | 5 / 5 | — |
| **en 4G, la fenêtre du QR fermée (✕) 2 s après le scan, pendant que la page arrive** | **0 / 5 « plus valable »** | **0 / 3** (lectures 300 ms plus tard) |
| fermée puis rouverte, le neuf scanné | 5 / 5 | — |
| le même QR scanné une seconde fois | 5 / 5 | — |
| le même onglet du téléphone à chaque scan | 5 / 5 | — |
| la montre de l'ordinateur en retard de 5 min | 5 / 5 | — |
| **en retard de 15 min** | **0 / 5 « plus valable »** | **0 / 3** |
| **en retard de 20 min** | **0 / 5** | **0 / 3** |
| **la première lecture du téléphone échoue (réseau)** | **0 / 5 « plus valable »** | **0 / 3** |
| **le réseau du téléphone coupé 8 s après le scan** | **0 / 5 « plus valable »** | **0 / 3** |
Les causes, dans `dr-session.js` (base) :
1. **Deux montres** : `dr_tcDemarrer` l.578 juge le QR valable si `Date.now() - rec.ts < 15 min` — la montre du téléphone moins celle de l'ordinateur au moment du QR. Un ordinateur en retard de 15 minutes ou plus : chaque QR est « plus valable », toujours.
2. **Une lecture ratée = « plus valable »** : l.578, la lecture du nonce (`dr_sesLireHub`, sans nouvel essai) qui échoue rend `undefined`, jugé comme un QR périmé.
3. **La fenêtre fermée efface le nonce aussitôt** : `dr_tcQrFermer` l.525. La fenêtre ne se ferme d'elle-même qu'une fois la page ouverte au téléphone et le scan écrit ; en 4G, la page de 3 Mo met plusieurs secondes : un ✕ (ou un clic à côté de la boîte) pendant ce temps, et le téléphone lit ensuite « plus valable ».
Lequel est celui de Paul (« 5 fois sur 6 », en 4G) : je ne sais pas. 1 échoue à chaque fois ou jamais (selon la montre de l'ordinateur) ; 2 et 3 au hasard du réseau et du geste.

## 5 · LE QR — LE CORRECTIF (`dr-session.js`)
1. Le QR vaut **tant que son nonce existe au hub** : aucune montre d'appareil.
2. Une lecture qui échoue **se réessaie** (0,7 s, 1,4 s… jusqu'à 4 s entre deux essais), et le téléphone le dit en clair : « Le téléphone n'arrive pas à joindre le site : le réseau ne répond pas. La télécommande réessaie d'elle-même (essai n)… » — jamais « plus valable », ni « aucune séance » (la reprise aussi : `dr_tcLire`).
3. Fermée sans scan, la fenêtre **garde le nonce 2 minutes** (comptées par l'ordinateur seul) et écoute le scan : un téléphone lent qui l'ouvre entre-temps le garde pour de bon ; passé ce temps, ce QR ne sert plus. Scanné : il reste (un second scan du même QR marche).

## 6 · LE QR — LA PREUVE (20 scans par cas qui échouait, vraie heure et mode test ; l'assemblé du commit `022705e3`)
`sorties/sonde-qr-zq-022705e3.txt` (08:01-08:24, la machine seule) — **200 scans, 200 sur la séance ; 40 vérifications, 0 échec** :
| cas | vraie heure | mode test | du scan à la télécommande sur la séance (médiane, le plus long) |
|---|---|---|---|
| en 4G, la fenêtre fermée pendant que la page arrive (lectures 300 ms plus tard) | **20 / 20** | **20 / 20** | 9,8 s, 10,2 s (la page arrive 6 s après le scan) |
| l'ordinateur en retard de 15 min | **20 / 20** | **20 / 20** | 2,1 s, 2,3 s |
| en retard de 20 min | **20 / 20** | **20 / 20** | 2,1 s, 2,3 s |
| la première lecture échoue | **20 / 20** | **20 / 20** | 2,9 s, 3,1 s |
| le réseau coupé 8 s après le scan | **20 / 20** | **20 / 20** | 9,2 s, 9,9 s |
Aucune erreur JS, aucune boîte système ; aucune écriture hors des chemins permis (vraie heure) ni hors de `/site/tableau_test` (mode test) ; aucune écriture refusée. Captures : `…/c16-frappe-zoom/capt-qr-zq/`.
Ce que dit le téléphone pendant la coupure (`sorties/sonde-qr-zq-022705e3-message.txt`, 08:24, la sonde relève aussi ce qu'il dit pendant la panne — ajouté après les 200 scans, rien d'autre n'a changé) : **10 / 10**, vraie heure et mode test, « Le téléphone n’arrive pas à joindre le site : le réseau ne répond pas. La télécommande réessaie d’elle-même… », puis la séance (10 / 10) ; capture `…/capt-qr-zq/qr-zq-022705e3-message-H-coupe-le-telephone-dit-le-reseau.png`.

## 7 · RIEN NE CHANGE AILLEURS (l'assemblé `022705e3`)
- La sonde de l'appel, parties Q et QT (la télécommande : la diapo du pilote, A+ A−, qui a la main) : **20 vérifications, 0 échec** (`sorties/sonde-appel-zq-022705e3-Q.txt`).
- La sonde de la session (T, H, QH, QT, R, RT, A) : **105 vérifications, 2 échecs** (`sorties/sonde-session-zq-022705e3.txt`) — les deux, le délai **en répétition** (R : 10 / 12 gestes sous 0,5 s, 578 et 582 ms ; RT : 11 / 12, 600 ms). **Le même échec sur la base**, rejouée aussitôt (`sorties/sonde-session-base-8757f0c8-R.txt` : R 11 / 12, 523 ms ; RT 11 / 12, 511 ms) : c'est ⑯ (la NOTE de ㉞ l'y rattache déjà), pas ce correctif — il se règle avec ⑯ (commit suivant, §3.3 du mandat : 12 / 12 à chaque passage). Tout le reste vert : la vraie heure, l'essai, la télécommande par le QR (QH, QT), la version d'avant (A) ; aucune erreur JS.

## 8 · CE QUI RESTE (08:38)
1. **⑯** : la colonne des vignettes au pilote passe avant l'image de la fenêtre du tableau (le premier A+ vers un cran neuf : 495 à 601 ms à la fenêtre, 3 fois sur 22) et retarde la répétition (R, RT : 10 à 11 gestes sur 12 sous 0,5 s, sur la base comme ici). Commit suivant.
2. **㉟** : la frappe. Commit suivant.
3. Pas fait sur ce commit (la consigne de 07:58 : « pas de mesures longues ») : la sonde de l'appel entière, la sonde de la fin d'heure, le parcours P0-P12 (K15, K15-test). Ils seront joués sur le dernier commit.

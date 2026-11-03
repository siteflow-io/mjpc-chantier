# NOTE — LA FRAPPE AU TABLEAU (㉟, la suite) ET LE RETARD DU TABLEAU (⑯)
*Exécutant neuf, lancé par la conscience n°16 le 03/11/2026 vers 10:05. Mandat : `MANDATS/DEROULE-01-11/MANDAT-FRAPPE-TABLEAU.md` (sas `89b5b5612`). Base : `9c13d037c` (`deroule/frappe-zoom`), son assemblé refait : md5 `bc7cc9cd…`, la production 8.81.1-⑭-micro sans sa ligne `APP_VERSION`. Mon dossier : `/home/claude/ex-frappe-tableau`, branche `deroule/frappe-tableau`. Le vrai hub n'a été ni lu ni écrit. `AUDITS/`, `APP_VERSION`, `redaction.html`, `/redactions`, `correction_dictee.html` et `main` ne sont pas touchés (j'ai seulement exécuté `AUDITS/…/assembler.mjs` et `parcours.mjs`). Les assemblés et les captures sont dans `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/c16-frappe-tableau/`, jamais poussés.*

## EN TÊTE — LES ÉCARTS AU MANDAT
1. **Le site ne change pas dans ce commit.** Mesurés par le geste sur la base, le tableau distant et la fenêtre du tableau tiennent la règle de 7 à chaque passage, sans second régime, et R tient 12 sur 12. Les 4 s et les deux régimes venaient des sondes (§1, §2). Le commit contient les sondes corrigées, les preuves et cette NOTE.
2. **⑯, le premier mouvement au tableau : pas prouvé au niveau de la v6.** Il reste une image derrière (§3). J'ai essayé de redessiner la colonne dans la tâche suivante : pas de gain mesuré. J'ai retiré l'essai, rien de ce code n'entre. Le point glisse, lui : prouvé.
3. **Les sondes des autres, changées sans rien changer par défaut** : `DERNIERES-DETTES/sonde-fin.mjs` reçoit `MJPC_HORLOGE=date` et `MJPC_D_VRAIE=1` ; `SESSION-PARTOUT/sonde-session.mjs` reçoit `MJPC_HORLOGE=date`. Sans ces variables, elles font exactement ce qu'elles faisaient.
4. **La production** : j'ai calculé une fois le md5 de `/home/claude/monsieurjaipascompris/index.html` (`c21ddbb6`, celui du mandat), au début, avant de relire l'interdit. Je n'en ai rien lu d'autre et je n'y ai rien écrit.
5. **La partie K des correctifs « avant »** : rejouée telle quelle, cinq passages, en fin de banc (§5.4).

## 0 · CE QUE LA CONSCIENCE A ÉCRIT DE FAUX (mission 0)
1. **§1 « Le tableau distant : une lettre y paraît en 3,5 à 4,2 s »** : c'est la sonde, pas le site (§1). Au faux hub, la scène arrive 3 ms après la touche, avec la bonne lettre.
2. **§1 « La fenêtre du tableau a deux régimes… la cause : pas trouvée »** : c'est l'horloge simulée de Playwright, dans la sonde (§2).
3. **§1 « ⑯ : le point glisse en 2 images (la v6 de ⑯ : 17 à 22) »** : faux. Les sorties mêmes de l'exécutant d'avant donnent 21, 24, 25 / 24, 24, 24 / 24, 24, 24 images pour `bc7cc9cd` (`FRAPPE-ZOOM/sorties/sonde-fin-D-bc7cc9cd-et-base.txt`) ; « 2 images » dans sa NOTE (§9.4) est une erreur de lecture. Je mesure 23 images à chaque passage (§3).
4. **§1 « le premier mouvement au tableau 237-265 ms (la base 259-275) »** : mesuré sous l'horloge simulée, qui donne au même fichier tantôt ≈ 70-130 ms, tantôt ≈ 200-265 ms. À la montre du navigateur, c'est 47 à 138 ms (§3).
5. **§4 « vraie heure et mode test »** : la partie D ne jouait que le mode test. J'ai ajouté la vraie heure (`MJPC_D_VRAIE=1`).

## 1 · POURQUOI UNE LETTRE « METTAIT 4 S » AU TABLEAU DISTANT : LA SONDE
La partie K de `CORRECTIFS/sonde-correctifs.mjs` règle la montre de chaque appareil par `page.clock.setFixedTime` à l'ouverture de son contexte, `performance` compris. Le tableau distant s'ouvre avant le pilote. Sa montre a donc **3 354 ms d'avance** (mesuré : l'écart de chaque page à l'horloge de la sonde, `-4328196410` contre `-4328199764`). La sonde compare l'heure de la touche (montre du pilote) et l'heure de la lettre au distant (montre du distant).
- **La trace** (`sorties/diag-1-…`) : au faux hub, à l'horloge de la sonde, la scène qui porte la lettre arrive 3 ms après sa touche. La lecture suivante du distant lui sert la bonne lettre (servie à +260 ms avec 3 lettres). Le distant note pourtant l'avoir reçue à +3 605 ms. L'écart reste le même tout du long (+260 → +3 605, +1 159 → +4 505…) : c'est un décalage de montre, pas un retard.
- **Les montres recalées**, même sonde, même fichier, sans flux (`sorties/diag-2-…`) : le distant a une médiane de **479 ms** et un maximum de **929 ms**. C'est la lecture toutes les 0,9 s : le faux hub de la partie K n'a pas le flux du vrai hub (EventSource).
- **Avec le flux**, comme le vrai hub (le harnais de `FRAPPE-ZOOM/sonde-zoom.mjs`) : le distant a une médiane de 39 ms et un maximum de 71 ms (`sorties/diag-3-…`).
- **Le code du site, lu** : chaque touche fait partir la scène tout de suite. `dr_frappeReponse` appelle `dr_sesEnvoyer` (20 ms), puis `dr_sesEnvoyerMaintenant`, `dr_sesEmettreScene`, `dr_sesScene` et `dr_ecrire`. Mesuré : 248 scènes écrites pour 244 touches. Rien n'est retenu ni regroupé.
- **Au vrai hub** : je ne sais pas (le réseau s'ajoute ; non mesuré, interdit).

## 2 · POURQUOI LA FENÊTRE AVAIT DEUX RÉGIMES : L'HORLOGE SIMULÉE DE PLAYWRIGHT
`page.clock` (`setFixedTime` dans la partie K et la partie D, `install` dans la sonde de la session) ne simule pas seulement la date. Il **remplace setTimeout, setInterval, requestAnimationFrame et performance** (playwright-core, `clockSource` : `requestAnimationFrame: (callback) => clock.addTimer({ type: "AnimationFrame" … })`, `performance: fakePerformance(…)`). Toutes les minuteries échues d'une page passent à la suite, dans une seule tâche (`_runTo` : `await this._callFirstTimer(to)` en boucle). Un navigateur ne fait pas cela. La fenêtre du tableau partage le fil d'exécution du pilote : son message attend derrière ce paquet, ou non, selon le moment.
- **Mesuré sous l'horloge simulée, même fichier, même sonde** : D sur la base donne tantôt 69 à 130 ms (`sorties/diag-D-2-…`), tantôt 200 à 217 ms (`diag-D-1-…`), et l'exécutant d'avant a mesuré 237 à 265 ms. La v6 donne tantôt 65 à 79 ms (`diag-D-1-…`), tantôt 223 à 235 ms (la NOTE d'avant). La fenêtre en K : médianes 14, 23 et 79 ms (le maximum à 1 729 ms, une lettre jamais vue) sur quatre passages de la base. La sortie de la passe à 79 ms a été écrasée par la passe suivante : c'est dit ici, pas gardé.
- **À la montre du navigateur** (la date seule décalée au 14/09 09:00, la même pour tous ; les minuteries, les images et `performance` du navigateur — `MJPC_HORLOGE=date`, par défaut dans ma sonde) : **un seul régime**. Sur cinq passages × deux modes, la fenêtre a une médiane de 25 à 28 ms (§5.1), et D reste à 47-138 ms (§3).

## 3 · ⑯ — LE POINT ET LE PREMIER MOUVEMENT (sonde-fin, partie D, `MJPC_HORLOGE=date`, la base puis la v6 `c90f3e94` dans la même exécution, trois fois par passage, cinq passages, la machine seule, mode test)
| passage | base : T1 / T2 / T3 (médianes, ms) | v6 : T1 / T2 / T3 |
|---|---|---|
| 1 | 73 / 63 / 67 | 69 / 48 / 42 |
| 2 | 90 / 67 / 74 | 69 / 61 / 53 |
| 3 | 73 / 78 / 52 | 85 / 64 / 49 |
| 4 | 72 / 63 / 59 | 64 / 70 / 53 |
| 5 | 113 / 80 / 71 | 68 / 60 / 47 |
| **les 15 mesures** | **90 (66-138) / 71 (48-104) / 67 (47-88)** | **69 (46-99) / 61 (42-78) / 48 (42-69)** |
T1 : l'étape 11 (la 2e diapo de l'heure vers la 3e) ; T2 : la diapo d'avant → le tableau des cinq œuvres ; T3 : le tableau → la diapo suivante. `sorties/sonde-fin-D-date-base-et-v6-1..5.txt`.
- **Le point glisse : prouvé.** 23 images entre le départ et l'arrivée, à chaque mesure (45 sur 45). La v6 en a 16 à 21. Le profil de la v6 (`sorties/diag-D-6-…`) montre pourquoi : sa colonne, redessinée 80 ms après, prend 85 à 116 ms, et la fenêtre n'a aucune image pendant ce temps (par exemple : 90 ms, puis 203 ms). La base n'a pas cet arrêt.
- **Le premier mouvement au tableau : pas au niveau de la v6. Une image derrière** (médianes +21, +10, +19 ms ; la base est la plus lente dans 13 comparaisons sur 15). Il reste dans le niveau de ⑯ fini que fixait le mandat d'avant (64 à 84 ms) pour T2 et T3, pas pour T1 (90).
- **La cause, mesurée au profil à la montre du navigateur** (`sorties/diag-D-5-…`, base ; `diag-D-6-…`, v6) : la fenêtre ne dessine qu'à la fin de la tâche du pilote. Sur la base, `pousser` part à 8-16 ms. Le pilote fait ensuite, dans la même tâche, `vueDroite` (4-13 ms), `ouOnEnEst` (2-8), `volet` (4-13 : la colonne, remise dans la tâche du geste par l'exécutant d'avant) et `participation` (10-19). La tâche finit à 37-55 ms, la fenêtre dessine à 53-65 ms. Sur la v6, la tâche finissait à 20-48 ms (la colonne venait 80 ms après) : la fenêtre partait plus tôt, puis se figeait.
- **Essayé, pas gardé** : la colonne dans la tâche suivante, sans délai, quand la fenêtre du tableau est ouverte (`2f5c884d`, une exécution : 113 / 74 / 63 contre la v6 93 / 67 / 49 ; `sorties/diag-D-4-…`). Pas de gain mesuré, donc rien n'entre.
- **D en vraie heure** : §5.2.

## 4 · LE HUB (§3.3) — CE QUE LA FRAPPE ÉCRIT, MESURÉ (sonde de la frappe, trois réponses, 244 touches, cinq passages)
- **Vraie heure : 191 à 192 écritures par réponse**, soit 573 à 576 pour les trois et 1 540 Ko :
  - la scène, une par touche (248, 1,1 Ko chacune), pour le tableau distant ;
  - l'état vivant, une par touche (248, 4,6 Ko chacune), pour les autres pilotes et la télécommande (㉞) ;
  - l'état de l'heure, le journal et la copie de l'heure, 25 à 26 chacun, environ une par seconde (0,8 à 2,5 Ko).
- **Mode test : 166 à 167 par réponse** (la scène et l'état vivant à l'adresse d'essai, 1 396 Ko).
- Ce que la classe en voit : chaque lettre au tableau distant (§5.1). Pour une réponse d'environ 80 lettres, environ 470 Ko partent, dont 380 Ko d'état vivant. Que ce soit « pas plus qu'il ne faut » : c'est à toi de trancher (l'état vivant part entier à chaque lettre, c'est le fonctionnement de ㉞). Je n'ai rien changé.

## 5 · LES PREUVES (§4 du mandat)
### 5.1 · K — la sonde de la frappe au tableau (`FRAPPE-TABLEAU/sonde-frappe-tableau.mjs`)
Le geste de la partie K des correctifs, tel quel : « Question-bilan », la question corrigée en direct, trois réponses tapées au pilote, 80 ms entre deux touches, Entrée. Le pilote est en 1536×864, la fenêtre du tableau et le tableau distant en 1280×720. Le faux hub refuse les clés interdites, comme le vrai, et **pousse son flux** comme le vrai. La montre est celle du navigateur. Chaque heure relevée est ramenée à l'horloge de la sonde : les écarts mesurés vont de 0 à 1 ms, avant et après la frappe. **Le tableau distant est compté** avec la règle de 7.
**Cinq passages sur la base, vraie heure puis mode test (10:34-10:59, la machine seule) : 70 vérifications sur 70.**
| passage | pilote : médiane / plus lent / au-delà de 100 ms | fenêtre : médiane / plus lent | distant : médiane / plus lent |
|---|---|---|---|
| 1 vraie heure · test | 11/21/0 · 11/20/0 | 25/37 · 26/35 | 40/103 · 41/65 |
| 2 | 11/23/0 · 11/18/0 | 26/42 · 26/45 | 40/64 · 39/58 |
| 3 | 13/51/0 · 11/20/0 | 28/67 · 26/35 | 42/64 · 40/63 |
| 4 | 11/21/0 · 11/23/0 | 26/39 · 26/37 | 42/64 · 40/58 |
| 5 | 12/22/0 · 11/42/0 | 26/38 · 26/55 | 40/63 · 40/97 |
À chaque passage, les trois réponses arrivent entières au pilote, à la fenêtre, au distant et au hub. Aucun envoi refusé, le témoin dit « ● session », aucune erreur JS. Une seule lettre au-delà de 100 ms au distant (103 ms), aucune à 350 ms ou plus. `sorties/sonde-frappe-tableau-base-bc7cc9cd-1..5.txt`. Captures (pilote, fenêtre, distant ; vraie heure et mode test) : `…/c16-frappe-tableau/capt-K/`.
**L'avant** : la partie K des correctifs telle quelle (montres figées par contexte, sans flux), cinq passages sur le même fichier. Voir §5.4.

### 5.2 · D (⑯) en vraie heure (`MJPC_D_VRAIE=1`, cinq passages, la base puis la v6)
(rempli au §5.4)

### 5.3 · R — la répétition (sonde-session, R et RT, `MJPC_HORLOGE=date`, cinq passages sur la base)
**10 sur 10 à « 12 / 12 sous 0,5 s », 80 vérifications sur 80.** Les gestes vont de 103 à 321 ms à l'autre appareil comme au tableau distant. `sorties/sonde-session-R-RT-date-base-1..5.txt`. L'avant, sous l'horloge simulée : l'exécutant d'avant a mesuré 11/12 et 11/12 sur la base `8757f0c8` et 10/12 et 11/12 sur `022705e3`. Le passage d'aujourd'hui est dans la sonde de la session entière (§5.4).

### 5.4 · Rien ne change ailleurs (l'assemblé du dernier commit, md5 `bc7cc9cd…` = la base)
(rempli à la fin du banc)

## 6 · CE QUI N'EST PAS PROUVÉ
1. ⑯ : le premier mouvement au tableau au niveau de la v6 (§3). Il reste une image derrière.
2. Le vrai hub, le réseau de la classe, l'ordinateur de Paul : je ne sais pas.

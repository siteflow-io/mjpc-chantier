# NOTE — L'APPEL N'IMPORTE QUAND, SUR N'IMPORTE QUEL APPAREIL (㊱)
*Exécutant neuf, lancé par la conscience n°16 le 02/11/2026 vers 21:49 (mandat `MANDATS/DEROULE-01-11/MANDAT-APPEL.md`). Base : `49826c1f0` (branche `deroule/session-partout`) ; son assemblé `a6a63afc…` + `APP_VERSION="8.80.0-⑬"` = la production (md5 `8b2310e7…`, mesuré). Mon dossier : `git worktree` `/home/claude/ex-appel`, branche `deroule/appel`. Le vrai hub : ni lu ni écrit. `AUDITS/`, `APP_VERSION`, la production, `redaction.html`, `/redactions`, `correction_dictee.html`, `main` : pas touchés. Captures : `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/c16-appel/capt-apres/` (et `capt-base/` pour la base ; jamais poussées : elles portent des noms d'élèves).*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
Paul clique sur la case de l'heure : l'appel vient d'abord (un clic marque un absent, un clic le défait), puis « ▶ Ouvrir le pilotage et lancer — appel fait : 2 absents » ; dès la première diapo, le pilote dit « 0 sur 27 présents ». Pendant l'heure, il marque ou démarque un élève où qu'il soit : au pilote (le clic droit d'une pastille, ses quatre gestes), à la télécommande (le bouton « Appel »), dans la case de l'emploi du temps d'un autre ordinateur ; chaque appareil le dit en moins de 2 s, sans recharger. Après l'heure, s'il l'a oubliée, il fait l'appel dans la case : la Relecture le dit. Rien de l'appel au tableau.

## 1 · L'AUDIT DU MANDAT (envoyé à 21:56 ; décisions de la conscience reçues ensuite)
1. §2 la base : tient (mesuré : `a6a63afc…`, et `8b2310e7…` avec `APP_VERSION`).
2. §1.2 « la case, seulement pour une heure jouée » : tient ; une case devient « jouée » dès qu'une entrée existe sous `H` (donc aussi pendant l'heure) ; la case lisait le cache `EDT_CHAP` (chargé à l'ouverture de l'emploi du temps, jamais relu) et écrivait « ce cache + un élève ».
3. « Les deux listes » : il y en a une troisième copie, `H/appel` (le paquet porte `S.appel`) ; `S.appel` vit aussi dans `C/etat` et `C/vif`.
4. §3.2 « une seule liste » : la case dit « absent ou non », le pilote a quatre gestes datés. **Tranché (conscience)** : « absent de l'heure » = un « absent » de cette heure que ne suit aucun « arrivé » ; « parti » et « revenu » ne touchent pas la liste ; un clic qui défait retire l'« absent » (et l'« arrivé » qui le suivait) de cette heure.
5. §3.1 l'appel d'avant l'heure : la maquette le gardait en mémoire. **Décidé** : `/site/edt/appel/<année>/<clé d'heure de l'EDT>` (une liste de slugs) ; versé au lancement dans l'appel et dans `H/absents`, puis retiré ; preuve : un rechargement, un second ordinateur.
6. Le défaut de la base : le paquet `H` relu puis réécrit en PUT entier effaçait un absent coché dans la case entre la lecture et l'écriture. **Décidé** : le paquet s'écrit en PATCH de ses propres clés (une clé disparue vaut null), par `mjpcEcrireRest` et son issue ; il ne réécrit plus jamais `H/absents`. Mesuré avant / après (§3, M4). L'écart au §12.9 est à la conscience (registre).
7. Mode test : la case d'un autre onglet ou appareil ne voit pas l'essai (magasin propre à chaque page, K15-test). **Décidé** : en mode test l'appel passe d'un appareil à l'autre par l'état vivant de l'essai ; la case sert avant et après l'heure sur l'appareil de l'essai ; la partie « case » de la preuve 2 en vraie heure seulement (P2T fait le retrait à la télécommande).
8. K15 : la liste PERMIS ne connaît pas les chemins de ㉞. **Décidé** : je compte contre PERMIS + les chemins déclarés par ㉞ (`/site/telecommande/<nonce>`, `/scan`, `/site/repetition/vif`) ; `/site/edt/appel/…` est déjà sous `/site/edt/` (PERMIS). La conscience les ajoutera à PERMIS.
9. Pas de maquette pour le bouton « Appel » de la télécommande : fait dans l'allure de « QUI A PARLÉ », les noms en entier ; captures pour Paul (§4).
10. Après coup, un « défait » : **tranché** — le paquet porte `appelUnique: true` ; heure marquée : `H/absents` fait foi ; heure d'avant cette version : les deux listes réunies (rien n'est enlevé).
11. « n sur 27 présents » : tient (29 élèves, 2 absents).
12. §3.5, §3.6 : tiennent.
13. **Ajouté par la conscience pendant le mandat** (Paul, 22:18-22:22) : la diapo de la télécommande dessinée comme au pilote (toute la diapo, les éléments pas encore dévoilés en gris, toute la largeur du téléphone ; le dessin du pilote réutilisé ; aucun geste dessus) ; « Texte au tableau » à la télécommande (« A− », la taille, « A+ » : un cran des cinq du curseur du pilote ; grisés sans la main, leur raison). Parties Q et QT de la sonde.

## 2 · LA MESURE DE L'EXISTANT (mission 0, §1.2 — sur la base `a6a63afc`, par le geste ; partie M de la sonde, vraie heure)
1. **Où se fait l'appel** : à deux endroits, qui ne se parlaient pas. La case de l'emploi du temps (`edtAbsencesHtml`, `edtAbsence`), seulement pour une heure « jouée » (en cours ou close), jamais pour une heure à venir (P1 : la case du 14/09 n'a aucun appel). Le clic droit sur une pastille du pilote (`S.appel`, quatre gestes datés : absent, arrivé, parti, revenu).
2. **Les listes** : `H/absents` (des slugs, écrit par la case), `S.appel` (le pilote ; gardé aussi dans `C/etat`, `C/vif` et `H/appel`, le paquet). Qui lit quoi : `dr_absentsDeLaCase` lit `H/absents` (au lancement, à la reprise, puis toutes les 15 s ; il ajoute, ne retire jamais ; en mode test, au magasin) ; `dr_recitPresents`, « L'APPEL » de « Ce qui s'est passé » et « Le mot pour chaque absent » lisent `S.appel` (relu de `C/etat` après la clôture) ; la Relecture ne lit jamais `H/absents`.
3. **Compté** (`sorties/sonde-appel-base-a6a63afc.txt`) : M1, un absent marqué au clic droit du pilote : au hub jamais, dans la case d'un autre ordinateur jamais ; M2, coché dans la case pendant l'heure : au pilote après 7,8 s (la relecture des 15 s) ; M3, défait dans la case : jamais défait au pilote (17 s) ; M4, **le défaut 6** : un absent coché dans la case pendant que le pilote relit `H/absents` pour écrire son paquet (cette lecture rendue 2,5 s plus tard par la sonde, comme sur un réseau lent) : **effacé au hub par le paquet** (PUT entier).
4. **Ce que voient un second appareil et la télécommande** (P2, base) : un absent marqué au clic droit d'un ordinateur passe aux autres pilotes et à la télécommande par l'état vivant de ㉞ (210 à 547 ms) ; la case d'un troisième ordinateur ne le voit jamais ; la télécommande n'a aucun appel (pas de bouton, pas de liste).
5. **Après coup** (P3, base) : deux absents cochés dans la case d'une heure close ; la Relecture dit « 1 élève sur 29 présents » et « L'APPEL : tous présents » — le récit de Paul à 14:14.

## 3 · LES PREUVES PAR LE GESTE (§4) — avant / après, comptées, la même sonde
`sonde-appel.mjs` (dans ce dossier), le faux hub rangé comme le vrai qui refuse les clés interdites, avec son flux ; vraie heure (H) et mode test (T) ; navigateurs : l'ordinateur 1536 × 864, un second 1366 × 768, un troisième 1366 × 768 (la case), le téléphone 390 × 844 tactile, le tableau distant 1280 × 720.

| partie | base `a6a63afc` | après `2f270cda` |
|---|---|---|
| M · l'existant, le défaut 6 (vraie heure) | 8 vérif., 4 échecs | 8 / 0 |
| P1H · la case à venir, l'appel d'abord (vraie heure) | 11, 7 | 11 / 0 |
| P1T · la même (mode test) | 7, 4 | 7 / 0 |
| P2H · pendant l'heure, partout (vraie heure) | 12, 7 | 12 / 0 |
| P2T · la même (mode test) | 10, 3 | 10 / 0 |
| P3H · après coup (vraie heure) | 8, 3 | 8 / 0 |
| P3T · la même (mode test) | 7, 3 | 7 / 0 |
| P4 · une heure de la 8.79, relue par cette version | 5, 2 | 5 / 0 |
| Q · la télécommande : la diapo du pilote, A− A+ (vraie heure) | 10, 5 | 10 / 0 |
| QT · la même (mode test) | 10, 5 | 10 / 0 |
| **total** | **88 vérifications, 43 échecs** | **88 vérifications, 0 échec** |

Mesuré après (sortie `sorties/sonde-appel-apres-2f270cda.txt` ; la base : `sorties/sonde-appel-base-a6a63afc.txt` et `sorties/sonde-appel-base-a6a63afc-Q.txt`, mesurées avec la sonde d'avant ses deux dernières retouches — en P2 a, le bouton de la télécommande compté jusqu'à 2 s au lieu d'être lu une fois ; une trace pour le débogage — sans effet sur la base, qui n'a pas ce bouton) :
- M1 : un absent marqué au clic droit du pilote est au hub en 451 ms (la liste part 700 ms après le geste), dans la case d'un autre ordinateur 10 ms plus tard ; M2 : coché dans la case, au pilote en 79 ms ; M3 : défait dans la case, défait au pilote en 141 ms ; M4 : le paquet ne relit plus `H/absents` (0 lecture), l'absent coché dans la case reste au hub (le paquet : PATCH).
- P1H : « L'appel — absents (0 sur 29) » avant « Ouvrir le pilotage et lancer » ; deux clics, « appel fait : 2 absents » ; au hub `/site/edt/appel/2026-2027/2026-09-14_08h57-09h52_3E_Charles_de_Gaulle` (2) ; après un rechargement et sur un second ordinateur : 2 ; la case ouverte sur deux ordinateurs : un marquage en 108 ms, son retrait en 111 ms ; lancée : « 0 sur 27 présents » dès la première diapo ; au hub, `H/absents` 2, l'appel d'avant l'heure retiré. P1T : la même chose dans le magasin de la page, rien au hub hors de `/site/tableau_test`.
- P2H : à la télécommande, un élève marqué : l'ordinateur 76 ms, le second 4 ms, la télécommande 11 ms, la case du troisième 316 ms ; au clic droit du second ordinateur : l'ordinateur 265 ms, la télécommande 113 ms, la case 462 ms, la télécommande « désactivée », chaque nom grisé dit pourquoi, un appui grisé sans effet ; retiré dans la case du troisième : 17 à 424 ms ; au hub une seule liste après 13 écritures du paquet ; f : une réponse tapée au second ordinateur pendant qu'un élève est coché dans la case : le champ garde le focus et « Le paysage romantique » entier ; le champ quitté, les trois pilotes en 177 à 414 ms ; e : 0 occurrence de l'appel au tableau distant et à la fenêtre du tableau. P2T (mode test, par l'état vivant de l'essai) : 85 à 215 ms ; le retrait à la télécommande reprise : 11 à 148 ms.
- P3H / P3T : la case close, 2 absents cochés après coup : « 1 élève sur 27 présents », les deux à « L'APPEL » (« absent 09:02 (case de l'emploi du temps) »), « Le mot pour chaque absent » ; un défait : « 1 élève sur 28 présents », il n'est plus à « L'APPEL ».
- P4 : jouée par la 8.79 (un absent au clic droit, deux dans la case pendant l'heure — au pilote en 6,7 s par la relecture des 15 s —, une ligne de journal « appel » sans élève, un quatrième coché après coup) ; cette version : la case « 4 sur 29 », la Relecture s'ouvre sans erreur, « 1 élève sur 25 présents », « 2 absents notés dans la case », les 4 à « L'APPEL ».
- Q / QT : la diapo de la télécommande est le dessin du pilote, 390 × 219 px sur 390 px, 2 éléments en gris (opacité 0,45) comme au pilote de l'ordinateur ; ▶ : un gris de moins en 7 à 10 ms ; trois appuis sur la diapo : rien ne change, pas de plein écran ; « A− · 32 pt · A+ » sous la diapo ; A+ : le pilote « 38 pt » en 51 à 61 ms, le tableau en 10 à 28 ms ; A− : 65 à 84 ms, 8 ms ; l'ordinateur reprend la main : A− A+ grisés, leur raison, un appui sans effet.

**Les six preuves du §4** : 1 → P1H, P1T ; 2 → P2H a-d, f, P2T a-c (la partie « case » en vraie heure seulement, décision 7) ; 3 → P3H, P3T ; 4 → P4 ; 5 → P2H e, P2T e (le tableau distant et la fenêtre du tableau : 0 nom, 0 « absent », 0 « présents ») ; 6 → chaque partie : aucune erreur JS, aucune boîte système, aucune écriture refusée, aucune écriture hors des chemins permis (K15 + ㉞ ; en mode test, aucune hors de `/site/tableau_test`).

**Un passage rouge, dit** : le premier passage complet sur `2f270cda` a donné 88 vérifications, 1 échec — P2T a : le bouton de la télécommande lu une seule fois, 222 ms après l'appui, pas encore marqué (tous les appareils le disaient : 44 à 222 ms). Rejoué avec une trace (`MJPC_DEBUG=1`, toutes les 25 ms sur le téléphone) : l'appel du téléphone change à 93 ms, son bouton se marque à 156 ms (le dessin suit 30 ms après le geste) ; le temps lu par la sonde venait de ses lectures sur une page occupée. La sonde compte désormais ce bouton comme les autres appareils (≤ 2 s) : P2 rejoué 22 / 0 (le bouton 2 ms et 579 ms après les autres appareils), puis le passage complet ci-dessus.

**Les autres bancs, sur `2f270cda`** (le parcours : `sorties/parcours-P0-P12-K15-2f270cda.txt` et `…-test-2f270cda.txt` ; la sonde de ㉞ : sa sortie reste au scratchpad, elle écrit des noms d'élèves) :
- le parcours P0-P12 et K15 (`AUDITS/INTEGRATION-DEROULE/parcours.mjs`, joué tel quel) : **PARCOURS VERT**, K15 « 28 écritures, toutes sur des chemins permis » (le paquet : `PATCH …/heures/<heure>`) ; en mode test : **PARCOURS VERT**, K15-test « 15 écritures, 0 hors de /site/tableau_test ». Sur `f53bf32c` (le paquet en PATCH aussi en mode test), le parcours en mode test était **rouge** (P12 : il lit le magasin par ses clés et n'y trouvait plus le paquet) : d'où l'écriture entière en mode test (§4).
- la sonde de ㉞ (`SESSION-PARTOUT/sonde-session.mjs`, parties T, H, QH, QT, R, RT, A) : **105 vérifications, 0 échec** (le plus long délai entre pilotes : 473 ms). Les délais rejoués à la suite sur le code puis sur la base (T, H, R : 55 / 0 des deux côtés) : sur le code, de 87 à 359 ms ; sur la base, de 77 à 153 ms. Tout est sous 0,5 s, mais la base a été plus rapide sur ce passage. Je ne trouve aucun travail ajouté à chaque geste en mode test (T) : je le dis sans pouvoir l'attribuer, sur une seule paire de passages (un passage précédent de la base, ㉞ v8, montait à 629 ms). Sur `f53bf32c`, la même sonde avait 2 échecs de délai (T 640 ms, R 643 ms), avec le PATCH au magasin du mode test (`M8T.patch`, plus lourd), retiré depuis.

**Les captures écran entier** (jamais poussées, elles portent des noms d'élèves) : `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/c16-appel/capt-apres/` (après) et `…/capt-base/` (base), nommées par la partie et le geste : `appel-apres-2f270cda-P1H-1a-case-appel.png` (la case à venir, l'appel d'abord), `-1b-case-2-absents`, `-1c-second-ordinateur`, `-1d-premiere-diapo` (« 0 sur 27 présents ») ; P2H `-2a-telecommande-appel` (la liste à la télécommande), `-2b-telecommande-desactivee`, `-2c-case-retrait`, `-2e-tableau-distant`, `-2e-fenetre-du-tableau`, `-2f-saisie-gardee` ; P3H `-3a-case-close-2-absents`, `-3b-relecture-recit`, `-3b-relecture-recit-le-mot`, `-3b-relecture-passe` (« L'APPEL »), `-3c-…` (un défait) ; P4 `-4a-case`, `-4b-relecture-…` ; Q `-1-telecommande-diapo-du-pilote`, `-2-telecommande-A-plus`, `-2-tableau-A-plus`, `-3-telecommande-A-moins`, `-4-telecommande-desactivee`.

## 4 · CE QUI EST FAIT (base `49826c1f0` → ce commit ; tailles en octets, de la déclaration à la suivante, avant → après)
**`index.html` (la case de l'emploi du temps)**
- `edtPeindreModale` 8 210 → 8 596 : la case d'une heure à venir s'ouvre sur l'appel (`edtAppelAvantHtml`, avant « ▶ Ouvrir le pilotage et lancer », qui dit « — appel fait : n absents » ou « tous présents ») ; la case s'abonne à sa liste (`edtAppelVeiller`).
- `edtLancer` 2 742 → 3 064 : l'appel d'avant l'heure part avec le lancement (`DR_AP_LANCE`) ; « Préparer » n'en prend rien.
- `edtAbsence` 614 → 1 493 : relit l'heure au hub avant d'écrire (avant : le cache `EDT_CHAP` + un élève, qui effaçait les marques des autres appareils) ; une heure d'avant cette version : la liste réunie, et la marque `appelUnique` posée au premier clic ; l'état d'avant à la corbeille, comme avant.
- `edtAbsencesHtml` 837 → 728 : la liste suivie (le flux) ou la liste réunie ; chaque nom porte son infobulle pour Paul.
- Neuves : `EDT_APPEL`, `edtAppelCleSure` 87, `edtAppelCheminDe` 134, `edtAppelCheminAvant` 148, `edtAppelListeNette` 230, `edtAppelDuPilote` 692, `edtAppelListe` 230, `edtAppelEnCours` 107, `edtAppelRedessiner` 315 (jamais pendant une saisie dans la case), `edtAppelVeiller` 1 497 (+ sa veille d'1 s, qui se tait la case fermée), `edtAppelBoutonsHtml` 686, `edtAppelAvantHtml` 559, `edtAppelFaitHtml` 248, `edtAppelAvantBasculer` 906.

**`dr/dr-classe.js` (le pilote)**
- `dr_traceAuto` 521 → 644 et la clôture : le paquet par `dr_paquetPatch` (PATCH de ses propres clés, `DR_PAQUET_CLES`, une clé disparue vaut null ; par `mjpcEcrireRest` et son issue : refus et panne au bandeau « Réessayer ») — plus aucune relecture de `H/absents`. **En mode test** (le magasin de cette seule page, aucune course possible) : le paquet s'écrit entier, `H/absents` relu au magasin et recopié, comme avant — mesuré : avec le PATCH, le parcours K15-test (`AUDITS/…/parcours.mjs`, P12) ne trouvait plus le paquet parmi les clés du magasin (le site, lui, le relisait bien : `M8T.lire` recompose l'arbre) ; je n'ai pas touché au parcours.
- `dr_paquetHeure` 3 637 → 3 837 : `appelUnique: true`.
- Le clic droit d'une pastille et `annulerDerniere` 479 → 537 : `dr_apApresGeste` (la liste part 700 ms après le geste : l'état vivant de ce geste arrive d'abord chez les autres pilotes).
- `dr_absentsDeLaCase` 1 079 → 1 609 : au lancement, l'appel d'avant l'heure et `H/absents` entrent dans l'appel (une ligne de journal par élève, l'horloge de l'heure) ; la liste réunie est écrite ; l'appel d'avant l'heure est retiré. À la reprise : la liste du hub fait foi (heure de cette version).
- Neuves : `DR_AP`, `dr_apSlug`, `dr_apNette`, `dr_apAbsentDeLHeure`, `dr_apListe`, `dr_apPeutEcrire`, `dr_apPoser` (une ligne « appel » ; « retire » pour un appel défait), `dr_apBasculer` (la télécommande), `dr_apEcrire`, `dr_apApresGeste`, `dr_apEnCours`, `dr_apRecu` (le flux ; seul l'appareil qui a la main verse ce qui a changé au hub), `dr_apVerser` (attend la fin d'une saisie), `dr_apConverger`, `dr_apVeiller` (l'abonnement, 500 ms ; ni en répétition, ni à l'Atelier, ni au tableau, ni en mode test), `dr_apCheminAvant`, `dr_apFondreRelecture`, `dr_paquetPatch` (1 288) ; `dr_apRecu` 967, `dr_apVerser` 694.
- **Tombe** : la relecture de `H/absents` toutes les 15 s (`setInterval … dr_absentsDeLaCase`, remplacée par le flux) ; les deux PUT entiers du paquet avec relecture de `H/absents`.

**`dr/dr-session.js` (la télécommande)**
- `dr_tcMaj` 7 197 → 9 601 : le bouton « Appel · n absents » à côté de ❄ ; la liste (`dr_tcAppelHtml`, neuve, 952) à la place de « QUI A PARLÉ » et du minuteur, les noms en entier, « ✕ Fermer » ; **la diapo dessinée par le pilote lui-même** (`#murcadre` posé dans la boîte, sans aucun geste : `pointer-events: none`) ; **la ligne « A− · 32 pt · A+ »** sous la diapo ; les commandes grisées sans la main (leur raison), A− / A+ aussi au bout des cinq crans (leur raison) ; la boîte collée à l'en-tête et à la ligne d'en dessous (avant : 6 px d'écart de chaque côté laissaient voir le pilote caché dessous).
- `dr_tcGeste` 1 402 → 2 380 : « appel » (ouvrir), « appel-x » (fermer, permis sans la main : rien ne change pour la séance), « abs » (un élève), « t-plus » / « t-moins » (le curseur `#taille` du pilote lui-même) ; l'écouteur lit `data-e` (le nom).
- `DR_TC_STYLE` : la liste de l'appel, la boîte du pilote, la ligne du texte au tableau.

**`dr/dr-recit.js` (la Relecture)**
- Le titre « Le mot pour chaque absent » (sans « (enregistré à la clôture) »).
- `passeHtml` 8 206 → 8 247 : la ligne « absent retiré (appel corrigé) ».
- `dr_recitChargerClasse` 1 365 → 2 066 : la liste de chaque heure (`C/heures/*`) entre dans l'appel relu (`dr_apFondreRelecture`) ; rien n'est écrit.

**Les chemins au hub** : neuf, `/site/edt/appel/<année>/<clé>` (sous `/site/edt/`, permis par K15) ; `…/heures/<clé>/absents` écrit aussi par le pilote ; `…/heures/<clé>/appelUnique` ; le paquet en PATCH au même chemin qu'avant.

## 5 · CE QUI RESTE, CE QUE J'AI VU
1. **Deux gestes d'appel croisés sur deux appareils, dans le même aller-retour du réseau** (0,1 à 0,3 s) : la liste s'écrit entière ; si la case relit la liste juste avant qu'un geste du pilote y arrive, la case l'écrase. Non mesuré ; il faut deux gestes à quelques dixièmes de seconde l'un de l'autre, sur deux appareils.
2. **« Annuler cette heure » après un appel fait avant l'heure** : l'appel d'avant l'heure a été versé dans l'heure, puis retiré ; l'annulation oublie l'heure et ses absents (sa phrase le dit) : l'appel fait avant l'heure ne revient pas dans la case. Proposition : il y revient. Non codé (pas décidé).
3. Un élève « parti » n'est pas dans la liste de la case (décision 4) ; la case ne dit rien de ses heures d'arrivée ou de départ (le pilote et la Relecture les disent).
4. À la télécommande (390 px), un nom long est coupé (« absent · NOM P… ») ; son nom entier est dans l'infobulle.
5. K15 : les chemins de ㉞ sont à ajouter à PERMIS (`AUDITS/`, à la conscience).
6. Le banc complet (`banc.sh`, ses douze étapes) : à la conscience ; j'ai joué ma sonde, celle de ㉞ et le parcours (§3).

## 6 · REJOUER
Depuis la racine du dépôt, `S` un dossier hors du dépôt :
```
node AUDITS/INTEGRATION-DEROULE/assembler.mjs LIVRAISONS/INTEGRATION/index.html $S/asm/index.html
cd LIVRAISONS/DEROULE-01-11/APPEL
MJPC_NOM=v MJPC_V879=$S/v879/index.html MJPC_PYQR=$S/pyqr MJPC_MEDIAS=$S/medias MJPC_CAPT=$S/capt timeout 1800 node sonde-appel.mjs $S/asm/index.html $S/sorties
```
- `MJPC_V879` : la 8.79.0-⑫ assemblée (`git archive cf7bb57 LIVRAISONS/INTEGRATION/index.html LIVRAISONS/INTEGRATION/dr`, puis l'assembleur ; md5 `3cd597e8…`) — partie P4.
- `MJPC_PARTIES` : `M,P1H,P1T,P2H,P2T,P3H,P3T,P4,Q,QT` par défaut. Une machine à deux cœurs : aucun navigateur ouvert avant. Environ 13 minutes. La dernière ligne dit « N vérifications, k échec(s) ». Aucun nom d'élève dans la sortie (« ÉLÈVE n »).

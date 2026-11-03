# LOT 1 — 359 · 360 · 361 : LA NOTE DE L'EXÉCUTANT

*Mandat : `MANDATS/DEROULE-01-11/MANDAT-LOT1.md` (sas `main`, `bc4ffdf05`). Base : `9c13d037c` (la production 8.81.1-⑭-micro : son assemblé, md5 `bc7cc9cd…`, ne diffère de la production servie, `c21ddbb6…`, que par la ligne `APP_VERSION` — vérifié par `diff`). Branche : `deroule/lot1`. Commits : `79153a4a7` (359), `a63e6bcf4` (360), `2ebef7101` (361) ; l'assemblé du dernier : md5 `b984f8bd71d012006afd9cf6d8d79c3d`. Aucun nom d'élève ici : « ÉLÈVE n » = le n-ième de la liste montrée.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
- Paul ouvre l'emploi du temps : une classe de 3e qui n'a rien joué voit la séance 1 proposée, même quand une autre classe a laissé un paquet sans nom de classe (le cas des 3 DYLAN). La classe du paquet, elle, garde sa séance jouée.
- Un essai en mode test ne peut plus écrire dans les vraies données : quitter le mode test pendant l'essai est refusé, et le site le dit (« Un essai joue en mode test : clos-le d'abord ») ; un autre onglet du même navigateur ne reprend jamais l'essai comme une vraie heure.
- La fenêtre « … joue déjà sur un autre appareil » a trois boutons qui disent leur nom et font ce qu'ils disent, chacun avec son infobulle : Paul n'est plus bloqué.
- En classe, seules les initiales exactes désignent un élève (la ligne de réponse, le VIF, la palette) ; des initiales inconnues restent telles quelles et personne ne passe au vert. En répétition, les pastilles sont celles de la classe répétée, plus celles de la classe d'essai ; la classe choisie au menu du nom se lit dans l'en-tête.

## 1 · CE QUI CHANGE, FONCTION PAR FONCTION (taille en caractères, avant → après)
**359 — le paquet sans `classe`** (`index.html`, `dr-classe.js`)
- `edtPaquetPour` (nouvelle, 247) : la seule règle — un paquet avec `classe` compte pour cette classe ; sans `classe`, seulement pour la classe de sa clé, comparée par `edtCleClasse`. Lue par `edtTraceDe` (362 → 376), `edtSeanceEtat` (606 → 620), `edtHeuresJouees` (332 → 346), `edtSeanceDeTrace` (675 → 668), `edtCheminTrace` (834 → 848), `dr_heureProposee` (900 → 1036). Les autres lecteurs de `deroule_joue` (`dr_heuresDeLaClasse`, `dr_marquerJoues`, les dates du parcours, la réactivation, la Relecture) lisaient déjà par la clé du paquet : inchangés. Rien n'est réécrit au hub.

**359 — le mode test ne fuit plus** (`index.html`, `dr-classe.js`, `dr-session.js`)
- `m8EssaiEnCours` (nouvelle, 245) : le mode test actif et une heure de classe ouverte ici (`AT_DR_REGIME` « classe », `AT_DR_COURS`), de son lancement (écran d'ouverture compris) à sa clôture ou à « Annuler cette heure ».
- `m8BasculerModeTest` (261 → 491) : pendant un essai, refus et la phrase ; la pastille et « Quitter le mode test » de la console passent tous deux par elle.
- Le miroir local d'un essai porte `test` (`dr_coursMiroir`, nouvelle, 154 ; l'écriture au départ de l'onglet) ; il n'est jamais proposé ni repris comme une heure : `dr_ongletEntendre` (1024 → 1193), `dr_sesBandeau` (1999 → 2087), `sesReprisePoser` (2009 → 2070), `sesReprendre` (1782 → 1933). C'est le chemin de l'audit II §3.0.2 (M2, avec la 8.79.0) encore ouvert sur la base par un second onglet : **mesuré sur la base** (§2, partie M, M3), fermé.

**360 — la fenêtre** (`dr-session.js`, `index.html`)
- `dr_sesDemander` (544 → 646) : `{lib, fn, title}` (avant `{label, action}`) ; un quatrième paramètre, ce que coûte « Lancer quand même », donné par chacun des trois appelants (une heure : elle clôt l'autre, sa trace enregistrée ; un essai, une répétition : l'autre continue, sans le tableau distant).
- `atModaleChoix` (1211 → 1353) : `title` sur un bouton quand l'appelant le donne (aucun autre appelant n'en passe).

**361 — la participation** (`dr-classe.js`, `dr-socle.js`)
- `dr_iniExact` (nouvelle, 299), `dr_iniSeul` (nouvelle, 230) : la clé exacte d'un élève présent (« RD » le premier des deux RD, « RD2 » le second, comme avant), sinon, sans les accents, celle d'un seul élève.
- `brancherAjout` (2700 → 3050) : à la frappe, à Entrée et à Tab, seules des initiales exactes désignent ; sinon la réponse garde les initiales tapées, à personne.
- Le VIF (l'écoute de `#vif`, le choix du motif au chiffre) et `ouvrirPalette` (4410 → 4758) : la suggestion reste (lettres inversées, début de prénom : « Initiales pas exactes — tape ses deux initiales, ou clique son nom »), elle ne compte pas ; la fiche ne s'ouvre et Entrée ne pose que pour des initiales exactes (ou le nom cliqué) ; une fiche ouverte pour un autre élève se ferme dès qu'on tape d'autres initiales.
- `dr_classe` (2031 → 2512) : en répétition, la classe de la séance répétée puis la classe d'essai (sans doublon) ; hors répétition, inchangé.
- `dr_hclasseNom` (396 → 996) : en répétition, la classe choisie au menu du nom est celle de l'en-tête (avant, l'en-tête gardait la case du jour et ignorait le choix) ; sans choix, inchangé — l'accord de la conscience (03/11), la première des deux voies proposées.

Rien ne tombe. `APP_VERSION`, `AUDITS/`, la production, le vrai hub, `redaction.html`, `/redactions`, `correction_dictee.html` : pas touchés.

## 2 · LES PREUVES, COMPTÉES (sonde-lot1, par le geste, faux hub rangé comme le vrai, montre du navigateur — seule la date décalée, jamais `page.clock`)
*La sonde : `sonde-lot1.mjs` (ce dossier) — le harnais de l'auditeur I (`sonde-audit-I.mjs`), les gestes et le faux hub de l'auditeur II (`sonde-II.mjs` : la trame de Paul, « 3 DYLAN Bob » appariée à « CLASSE TEST », le paquet de la forme de lundi). Les sorties (sans nom d'élève, vérifié mot à mot contre les listes du faux hub) : `sorties/`. Les captures (écran entier, elles portent des noms) : dans le scratchpad de l'exécutant, `lot1/captures/`. Usage : `MJPC_PARTIES=K,M,W,P,E MJPC_TAG=<nom> node sonde-lot1.mjs <assemblé> <sorties>`.*

| partie | ce qui est prouvé | la base `bc7cc9cd` | après |
|---|---|---|---|
| K (359) | le paquet de lundi SANS `classe`, puis AVEC : la case de CLASSE TEST (rien joué) propose la séance 1, « heure 1 sur 1 » ; sa fenêtre ; « ▶ Ouvrir le pilotage et lancer » ouvre la séance 1 ; les cartes (CLASSE TEST 0/9, 3E Charles de Gaulle 1/9) ; « Le parcours du chapitre » (« Séance 1 sur 9 », sans coche) et le bilan des compétences ; l'heure proposée hors de l'emploi du temps ; la classe du paquet a sa séance jouée (sa case : la séance 2) | 18 vérifications, **7 échecs** (tous « sans classe » : séance 2, 1/9, « 1 ✓ », heure 2) | `255ddf58` : **18, 0 échec** |
| M (359) | M1 l'essai, puis quitter le mode test pendant l'essai (la fonction de la pastille ; le gestionnaire de clic de la pastille ; le Panneau prof n'est pas atteignable au pointeur pendant l'essai — mesuré, comme l'auditeur II) : refusé, la phrase à l'écran, aucune écriture hors de `/site/tableau_test` jusqu'à la clôture, aucun paquet ; l'essai clos, la pastille rebascule ; M2 la page rechargée et « Reprendre » ; M3 un second onglet (« ↗ Le site dans un nouvel onglet »), l'onglet de l'essai fermé, puis l'annonce d'essai retirée par une répétition en mode test arrêtée sur un autre appareil | 12 vérifications, **7 échecs** — dont M3 : « Heure en cours avec les 3E Charles de Gaulle — Reprendre », puis `/site/cours_actif` et `deroule_joue/3E Charles de Gaulle/{ecrans, journal, …}` écrits au vrai hub, sans `classe` | `255ddf58` : **12, 0 échec** |
| W (360) | les quatre cas de l'auditeur I §1.2 (vraie heure et essai « autre classe », répétition et répétition en mode test « autre séance ») × les trois boutons, avec le tableau distant : le nom, l'infobulle ; Rejoindre (B pilote la même session, rien créé) ; Lancer (B lance la sienne, le tableau la suit ; une heure : celle de A close au hub ; essai, répétition : A continue) ; Annuler (rien, A garde le tableau) | 73 vérifications, **37 échecs** (« undefined », aucun bouton n'agit) | `29aa961e` : **73, 0 échec** |
| P (361) | la liste en répétition (sans choix : 29 ; CLASSE TEST choisie : l'en-tête « CLASSE TEST », 4 + 29 = 33, le compteur « … sur 33 ») ; dans les trois sessions, les cas de l'auditeur I §3.2 — exactes, inversées, début de prénom, de personne — pendant la frappe, à Entrée, à Tab, au clic dans la réponse ; le VIF (mode test, vraie heure ; en répétition le VIF n'est pas à l'écran, la sonde le dit) et la palette ; au hub, le journal de la vraie heure | 104 vérifications, **33 échecs** (« AE » et « EL » → ÉLÈVE 1, en vert ; une parole d'ÉLÈVE 1 au journal du hub ; l'en-tête ignore le choix) | `b984f8bd` : **104, 0 échec** |
| E (361) | seul l'affichage change : une répétition sans puis avec le choix de CLASSE TEST — rien pour une classe, ce que la répétition écrit va à `/site/repetition` ; puis l'EMPREINTE (la copie répétée, les chemins écrits, l'annonce et la scène de `/site/repetition`, ce que montre le tableau distant à chaque ▶) comparée à la base | 8, 0 échec | `b984f8bd` : **8, 0 échec** ; empreintes base / après : **12 comparaisons, 0 différence** (`sorties/empreintes-E-base-bc7cc9cd-contre-b984f8bd.txt`) |

## 3 · RIEN NE CHANGE AILLEURS (les sondes de l'appel, de la fin d'heure, de la session ; le parcours P0-P12, K15, K15-test)
*Sur la consigne de la conscience : les sondes de la branche `banc/vraie-horloge` (`ced5eba45`, posées dans mon dossier le temps des passes, pas poussées), `MJPC_HORLOGE=date` (la montre du navigateur) ; chaque étape jouée sur l'après `b984f8bd` puis sur la base `bc7cc9cd`, l'une après l'autre, la machine libre (`ps`) avant chaque passage — de 16:52:39 à 18:17:08 (les heures du journal, `sorties/non-regression/journal-des-passes.txt`). Les sorties, anonymisées (la sonde de la session écrit des noms : copies où chaque nom devient « un élève », 0 nom restant, vérifié) : `sorties/non-regression/base-bc7cc9cd/` et `…/apres-b984f8bd/`.*

| sonde | la base `bc7cc9cd` | après `b984f8bd` | les verdicts qui diffèrent |
|---|---|---|---|
| le parcours P0-P12 + K15 | 30 ok, 0 échec, PARCOURS VERT | 30 ok, 0 échec, PARCOURS VERT | aucun |
| le parcours en mode test (K15-test) | 30 ok, 0 échec, VERT | 30 ok, 0 échec, VERT | aucun |
| l'appel (toutes les parties, P4 avec la 8.79.0) | 114 vérifications, 11 échecs (P2H ×5, P2T ×4, X ×1, XT ×1) | 114, 5 échecs (P2T ×4, XT ×1) | P2H ×5 et X ×1 : rouges sur la base, verts après — rejoués ci-dessous |
| la fin d'heure F G S D T | 41, 0 échec | 41, 0 échec | aucun |
| la fin d'heure P (l'heure écrite par la 8.78.2) | 8, 0 | 8, 0 | aucun |
| la fin d'heure P (par la 8.80.0) | 8, 0 | 8, 0 | aucun |
| la fin d'heure R (par la base) | 7, 0 | 7, 0 | aucun |
| la session (T, H, QH, QT, R, RT, A) | 105, 1 échec (T : « la réponse tapée au second ordinateur… ») | 105, 0 échec | T, rouge sur la base seulement (l'aléa connu, « parfois la session T ») ; la ligne H ne diffère que par l'extrait de texte cité, verte des deux côtés |

**Les échecs en moins, rejoués seuls, en alternant base et après** (`appel-rejeu-*`, `x-rejeu-*`, `p2h-rejeu-*`) :
- P2H (la télécommande « désactivée : l'ordinateur a repris la main ») : appel P2H, P2T, X, XT ×2 — base rouge 1 fois sur 2, après 0 sur 2 ; P2H seul ×4 — **base 2 sur 4, après 2 sur 4**, les mêmes 5 vérifications. Au total, base 4 sur 7, après 2 sur 7 : un aléa des deux côtés (la main jugée au moment), pas un effet du lot.
- X (« la télécommande et le clic droit de l'ordinateur sur deux élèves à moins de 100 ms — aucun ne se perd ») : X seul ×4 — **base 3 sur 4, après 2 sur 4**, la même vérification ; au total base 6 sur 7, après 2 sur 7 : l'aléa connu (« pas à chaque fois pour X »).
- P2T ×4 et XT ×1 : rouges des deux côtés, à chaque passe (connus, traités par un auditeur).
- Une chose vue, pas expliquée : sur la base, le nombre d'écritures de la partie X varie (147, 1 886, 359) ; après, il est stable (162, 152, 156). Aucune écriture hors des chemins permis ni refusée, des deux côtés. Je ne sais pas d'où vient l'écart (la partie X n'écrit aucun chemin que le lot touche).

Aucun échec nouveau ; les échecs en moins sont des aléas qui tombent aussi après.

## 4 · CE QUE JE NE SAIS PAS, ET CE QUI EST MESURÉ HORS DU MANDAT (pas touché)
- Au vrai hub : je n'ai rien lu ni écrit ; ce que deviennent les cases des 3 DYLAN au vrai hub, je ne le sais que par le faux hub rangé comme lui.
- Après « Lancer celle-ci quand même » sur une vraie heure, l'heure de l'autre appareil est close au hub, mais son écran la montre encore lancée (il n'en est pas averti) — mesuré (W), pas dans le mandat.
- En répétition, le VIF (le champ des initiales de la colonne de droite) n'est pas à l'écran, sur la base comme après.
- Le sens inverse du mode test : passer EN mode test pendant une vraie heure n'est pas refusé (la suite de l'heure irait au magasin du mode test) — lu, pas mesuré, pas dans le mandat.
- La fenêtre de l'essai dit « séance 0 » (la clé) : la conscience le note, pas touché.
- La pastille « mode test » n'a pas d'infobulle (avant comme après).
- Une initiale exacte d'un élève noté absent : il n'est pas désigné (comme avant `dr_candidats` l'excluait), mais la réponse garde ses initiales et sa pastille peut passer au vert par `histoire` — lu, pas mesuré.

## 5 · REJOUER
- La sonde du lot : `MJPC_PARTIES=K,M,W,P,E MJPC_TAG=<nom> MJPC_CAPT=<captures> node LIVRAISONS/DEROULE-01-11/LOT1/sonde-lot1.mjs <assemblé> <sorties>` (environ 25 minutes pour les cinq parties ; K 1 min, M 3 min, W 8 min, P 4 min, E 1 min). Les empreintes de E : `python3 -I LIVRAISONS/DEROULE-01-11/LOT1/comparer-empreintes.py <sortie E avant> <sortie E après>`.
- Les passes de cette NOTE : sur l'assemblé de chaque commit — 359 : `255ddf58` (K, M) ; 360 : `29aa961e` (W) ; 361 : `b984f8bd` (P, E, et la non-régression) ; la base : `bc7cc9cd` (K, M, W, P, E et la non-régression).
- Les captures (écran entier ; elles portent des noms d'élèves) : dans le scratchpad de l'exécutant, `lot1/captures/`, pas au dépôt.

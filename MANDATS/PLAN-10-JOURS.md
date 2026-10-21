# PLAN 10 JOURS — le site et toutes les apps fonctionnels, toutes les dettes réglées, tout le prévu codé (22/10 → 31/10/2026)

*Conscience n°13, 21/10/2026, 21:48. Ordre de Paul (21:46) : « Il faut que l'ensemble des dettes de toutes les apps et tout le site soient réglées d'ici 10 jours. Pareil pour tout ce qui a été prévu. En gros, dans 10 jours on doit avoir le site fonctionnel ainsi que toutes les apps. » Ce document est le cahier des charges vivant du chantier : il se met à jour à chaque réveil (ce qui est fait, ce qui reste, ce qui est à Paul). Mesuré contre : `docs/MJPC6-DETTES.md` (prod), `MANDATS/POINT-DEROULE-RESTE-A-CODER.md`, `MANDATS/PAUSE-CORRECTION-DICTEE.md`, les cadrages `DEROULE/CADRAGE-*.md`, les mandats au sas, les quatorze fichiers html de production.*

## 0 · Les règles du chantier (les tiennes, rappelées)
- Un fichier = un exécutant à la fois. `index.html` fait exception par ses modules (`LIVRAISONS/INTEGRATION/dr/*.js` + `assembler.mjs`) : plusieurs exécutants y travaillent par territoire, comme E1-E4 aujourd'hui.
- Chaque exécutant tourne sans s'arrêter, pousse chaque morceau dès qu'il est fait, lance le banc avant chaque poussée, marque ses relances « traitée ». Sa première mission : auditer son mandat et signaler mes erreurs.
- La conscience audite toutes les heures (réveils planifiés), relance par gravité, tranche au contrat, met ce plan à jour ; Paul ne vérifie rien : il promeut sur captures entières avant/après, et répond aux questions de cadrage, un sujet à la fois.
- Jamais de promotion sur dette ; jamais de service payant ; pas d'annonce aux élèves ; infobulles sur tout geste nouveau ; « une fonctionnalité = un visuel ».
- **Rien ne se crée qui n'existe pas déjà** (Paul, 21/10, 22:09) : les lots règlent les dettes et codent le prévu **cadré** ; aucun module, aucune app, aucun nœud, aucun écran nouveau hors de ce que les cadrages et les mandats écrivent déjà ; ce qui serait neuf sort du plan (la banque d'exercices, l'app de révisions M20, l'appli de création de pages, un « cockpit » qui n'est pas dans un cadrage) sauf mot de Paul. Le téléphone se recycle depuis l'existant (`?vue=tel`, `sesTel*`), il ne se réinvente pas.
- Le QCM (`evaluation-qcm.html`) est tenu par la conscience n°12 (QCM-4 le 21/10) : il n'entre dans ce plan que si Paul me le confie.

## 1 · L'inventaire, par fichier (ce qui est ouvert au 21/10, 21:48)

| fichier | dettes ouvertes | prévu, cadré, pas codé | prévu, pas cadré (Paul d'abord) |
|---|---|---|---|
| `index.html` — le déroulé | la table d'E4 (haute 138, `dr_jouerCopie`, moyens/faibles) ; 13 · 12 (à Paul) | POINT B : 13 notions (+ attendus), 14 ÉLÈVE — 2 (mandat écrit), 15 l'appel et les absents, 16 ce que l'élève reçoit, 17 documents et feuilles + fiche de dictée, 18 la vidéo, 19 mode d'emploi de la page HTML, 20 le prompt d'injection, 24 le branchement dictée, 34 TEMPS §8 et §11 | 21 le récit figé, la forme du récit de séance, le papier ; 22 le téléphone télécommande ; 25 le vocabulaire du 25/08 ; 23 le profil longitudinal et le cockpit ; 35 le profil de classe |
| `index.html` — le portail | 12 · 87, 88, 89 (panneau prof : modale étroite, boutons ↻/✕ hors cadre, « ouvrir les fiches ») ; 12 · 212 (EDT : la rangée des boutons) ; 10 du 25/08 (panneau prof : sept constats ; résumés d'accueil en dur) ; 12 · 80 (la base se lit sans clé — M-SÉCU) | calendrier annuel / EDT hebdo (🔶 08/08, en partie fait par le lot 2ter) ; UI de la progression (trois questions à Paul) | M-SÉCU (intégrité → confidentialité → authentification) ; **M17a : fait en partie** (Paul, 22:09) — mesuré au hub le 21/10 22:10 : `/classes` porte `3_dylan_bob`, `3_franklin_aretha`, `4_hugo`, `4_turing` (l'import est fait, ÉLÈVE — 1), `3E Charles de Gaulle` (les données martyres gardées, décision du 29/09), `CLASSE TEST`, `_TEST`, `_test_correction_dictee`, `_test_pilotage_debat_s3` ; Hergé, Banksy, Pythagore, Saint Michel n'y sont plus — reste la purge de « 3E Charles de Gaulle » quand Paul le décide |
| `correction_dictee.html` | 24 entrées (note de pause §4) : 19 de classe (149…176, 132, 133, 138, 139), 143 et 160 en partie, 97 code mort, 122 audio L16b | le mandat L17 en pause (L17-2 à L17-8, L17-7 bis) ; 178 la séance horodatée branchable au déroulé | 141 l'audit des pièges → la fiche au format canonique (cadrage 5 min avec Paul : le périmètre) |
| `evaluation-qcm.html` | section n°12 (179-223), tenue par la n°12 | — | — |
| `reecriture.html`, `reecriture_bb4e.html` | item 10 : écran vide qui exige une identification, écran « ? » qui expose des infos prof, deux réécritures inséparables, libellé de publication ; six fiches à réinjecter + pied Réécriture 1 | — | — |
| `dictee_universelle.html`, `worktrack.html`, `applause_meter.html`, `analyse_logique.html`, `pilotage_debat_s3.html`, `Console_ateliers_revisions.html`, `redaction_dugain_v3.html`, `etude_dugain.html` | item 10 : la passe sur les neuf apps (identité MJPC partout ? écran d'aide qui dit à l'élève ce qui le concerne et rien d'autre ?) ; `pilotage_debat_s3` (soupçon à mesurer ; débat multi-classe ; nœud `debat_singes`) ; D-PORTAILS-MANQUANTS ; D-APPSCRIPT-RESIDUEL ; alignement taxo (« citer un vers », « lecture expressive ») ; ménage CSS inerte + `diapositive_json` | — | — (la banque d'exercices et l'app de révisions M20 : neuves, hors plan sauf mot de Paul) |
| le hub (données) | — | les attendus au hub (cadrage 3, passation §4.4 : prévu, jamais mandaté) ; la taxonomie littérature (« n'a pas encore tout son volet », cadrage 3) | — |
| documents | — | le prompt d'injection en trois sections (cadrage 4 §5) | — (l'appli de création de pages : neuve, hors plan) |

## 2 · Les lots et les exécutants (un nom par exécutant, une phrase à coller chacune)
| lot | exécutant | fichier | quand | contenu |
|---|---|---|---|---|
| L0 l'intégration du déroulé | E1-E4 (en cours) | `index.html` (modules dr/) | J0-J1 | ce qui reste de la table d'E4 → audit final → **promeus** |
| L1 ATTENDUS | A1 | hub : `taxonomie_atelier.json`, `/taxonomie`, `/attendus` | J1-J3 | les attendus Éduscol cycle 4 français au hub, rattachés aux notions (cadrage 3) ; la garde « pas de terminale » ; le volet littérature |
| L2 DICTÉE | D1 | `correction_dictee.html` | J1-J4 | L17 repris, les 19 lignes de classe, 143/160 restes, 97, 122 (L16b : les lettres de Paul au hub), 178 ; puis 141 une fois cadré |
| L3 PROMPT | P1 | `MANDATS/PROMPT-INJECTION/` | J1-J3 | le prompt d'injection en trois sections, éprouvé sur un chapitre JSON contre le contrat des objets (E1) ; branché au site au L5 |
| L4 APPS | S1 (une app après l'autre, ou S1-S3 en parallèle) | les huit satellites | J1-J5 | item 10 ligne à ligne, la passe identité/aide sur chaque app, les non ordonnancées de la table 1 ; bancs par app |
| L5 DÉROULÉ — le reste cadré | E1'-E4' (les mêmes territoires, après la promotion) | `index.html` (modules) | J2-J7 | 13 notions ; 14 ÉLÈVE — 2 ; 15 appel/absents ; 16 ce que l'élève reçoit (+34) ; 17 documents/feuilles ; 18 vidéo ; 19 ; 20 branché ; 24 ; 12 · 87-89, 212, item 10 panneau prof |
| L6 PROFIL | F1 | `index.html` | J5-J9 | le profil de classe (35, LOT C) et le profil longitudinal élève (23 ; programme du 25/08 n°9 : `mjpcProfils` existe, alimenté, jamais lu — on le lit, on ne crée rien) ; « ce qui compte » d'un clic (15/10) — **après cadrage avec Paul (J1-J3)** ; le « cockpit » n'entre que s'il est dans un cadrage |
| L7 RÉCIT ET PAPIER | E4' | `index.html` (dr-recit) | J4-J7 | 21, 25 — **après cadrage avec Paul (J2)** |
| L8 TÉLÉCOMMANDE | T1 | `index.html` | J6-J9 | 22 le téléphone recyclé depuis `?vue=tel` / `sesTel*` (existant), « certaines fonctions seulement » — **après cadrage (J3)** |
| L9 M-SÉCU | M1 | les règles Firebase + les apps | J7-J9 | intégrité → confidentialité ; authentification seulement si Paul le demande ; 12 · 80 |
| L10 M17a | Paul | le hub | quand il le décide | **l'import est fait** ; reste la purge de « 3E Charles de Gaulle » (données martyres) — le geste de Paul, hors des lots |

## 3 · Les cadrages à faire avec Paul avant de coder (un sujet à la fois, une question chacun)
1. **Le profil longitudinal et le cockpit** (L6) — la question : ce que tu veux voir en premier en ouvrant le profil d'un élève (ma proposition : la liste de ses heures jouées, ses participations, ses copies de dictée, ses QCM — et « ce qui compte », cochable d'un clic).
2. **Le récit figé et retouché, la forme du récit de séance, le papier** (L7) — la question : le papier d'une séance de trois heures, c'est un récit par heure collé trois fois, ou un récit de séance ? (ma proposition : un par heure, « comme ED », plus le récit de séance en tête du dernier).
3. **Le téléphone télécommande** (L8) — la question : les fonctions exactes (ma proposition : ▶ ◀, le gel, F2 initiales, le chrono ; rien d'autre).
4. **L'audit des pièges de la dictée** (L2, 141) — la question : la fiche sort dans quelle feuille du chapitre ? (ma proposition : la feuille « dictée » de la séance qui la joue).
5. **M-SÉCU** (L9) — la question : une authentification pour toi (un mot de passe au panneau prof) ou seulement des règles ? (ma proposition : règles d'abord, mot de passe prof ensuite).
6. *(retiré : la banque d'exercices et l'app de révisions sont neuves — hors plan, règle du 22:09.)*

## 4 · Le calendrier (J1 = mercredi 22/10)
- **J0 (21/10, soir)** : réveils toutes les heures sur L0 ; ce plan déposé ; les mandats L1, L2, L3, L4 écrits cette nuit si Paul dit « go ».
- **J1 (22/10)** : L0 audit final + promeus (matin) ; A1, D1, P1, S1 lancés ; cadrage 1 (profil) avec Paul.
- **J2 (23/10)** : E1'-E4' lancés sur L5 ; cadrage 2 (récit/papier).
- **J3 (24/10)** : L1 et L3 livrés ; cadrage 3 (télécommande), 4 (pièges), 5 (M-SÉCU).
- **J4-J5 (25-26/10, week-end)** : L2 livré ; L4 livré ; L5 en cours ; L7 lancé.
- **J6-J7 (27-28/10)** : L5 livré et promu ; L6, L8 lancés ; L9 lancé.
- **J8-J9 (29-30/10)** : L6, L7, L8, L9 livrés et promus ; audit final global (toutes les apps, parcours fixes, captures).
- **J10 (31/10)** : audit final global, dernières promotions ; le site et les apps fonctionnels, le registre à zéro. (La purge de « 3E Charles de Gaulle » : quand Paul le décide.)

## 5 · Ce qui est à Paul, et seulement à lui
Les promotions (sur captures) ; les cinq cadrages du §3, un par jour ; le QCM (le confier ou non) ; le mot sur 152, 144, 13 · 12, §12.17 ; la purge finale de « 3E Charles de Gaulle ».

## 6 · Les vérifications (pour que Paul ne vérifie rien)
Chaque lot a son banc (par le geste), lancé avant chaque poussée ; la conscience rejoue le banc de chaque lot à chaque réveil et relance par gravité ; un relecteur continu par lot (le modèle d'E4) ; l'audit final de chaque lot = écrans changés et voisins + un parcours fixe + captures entières avant/après ; ce plan dit à chaque réveil « fait / reste / à Paul ».

MEMO

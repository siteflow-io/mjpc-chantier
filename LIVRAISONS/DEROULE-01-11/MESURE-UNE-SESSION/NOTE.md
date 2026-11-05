# MANDAT L — LE TABLEAU DISTANT, UNE SESSION À LA FOIS : CE QUI EST MESURÉ (C16 640)
*Exécutant L, 05/11/2026. Base : sas `deroule/fermer-lancement` `1a60c142b`, assemblée par `AUDITS/INTEGRATION-DEROULE/assembler.mjs` → md5 `fd014e542fc12f4f8f99904dc5d36694`. Aucune ligne du site n'a changé. Faux hub rangé comme le vrai (celui de l'audit global I). Un seul navigateur.*

- La sonde : `sonde-une-session.mjs` = `AUDIT-GLOBAL/sonde-audit-I.mjs` rejouée telle quelle (parties Q1, Q1D), plus une partie ajoutée `L` (fonction `reprise`) : A joue, son onglet se ferme, Paul clique « Reprendre » sur un autre appareil, dévoile, puis arrête.
- La comparaison : `comparer.mjs` lit les deux relevés (`AUDIT-GLOBAL/sorties/audit-I.jsonl` du 03/11 et `sorties/audit-I.jsonl` de ce jour) et écrit `sorties/comparaison.txt`.
- Sorties : `sorties/journal.txt` (tout ce que la sonde a dit), `sorties/audit-I.jsonl` (le relevé), `sorties/sonde-audit-I-*.txt`, `sorties/comparaison.txt`.

## 1 · CE QUI A CHANGÉ DEPUIS LE 03/11 (8.81 → la base) — mesuré 07:13-07:18
**Rejoué : 5 combinaisons sur 26** (arrêt à la limite des 20 minutes ; une combinaison prend environ 65 s). **5 pareilles, 0 changée.** Les 21 autres ne sont pas mesurées (ce qui reste, ci-dessous). Détail : `sorties/comparaison.txt`.

| A puis B | 03/11 | Aujourd'hui | Qui prend le tableau | Le second le dit-il à Paul |
|---|---|---|---|---|
| H + H | B rejoint l'heure | pareil | le dernier qui agit (B, puis A) ; B clôt : l'horloge | oui : « Un autre ordinateur a la main » chez A ; chez B « Heure reprise… » [Compris] |
| H + T | B devient un essai qui copie l'heure | pareil | A garde le tableau | non : rien chez B, rien chez A |
| H + R | refusé | pareil | A | oui, chez B : « tableau distant pris : 3E Charles de Gaulle est en cours » |
| H + RT | refusé | pareil | A | oui, chez B : la même phrase |
| T + H | B prend le tableau | pareil | B ; quand B clôt, le tableau revient à l'essai de A | non : rien chez A, rien chez B |

Les 5 cas « appareil qui disparaît » (§2) : **5 pareils** au 03/11 (`RAPPORT-I.md` §1.6), 0 changé.

**Ce qui reste (non mesuré)** : T+T, T+R, T+RT, R+H, R+T, R+R, R+RT, RT+H, RT+T, RT+R, RT+RT (11 de §1.1) ; H+H, T+T, R+R, RT+RT autre classe ou autre séance (4, §1.2 : la modale) ; H+R, R+H, H+T, T+H, R+T, T+R sur un même appareil (6, §1.3). La commande pour les jouer : `MJPC_PARTIES=Q1 MJPC_COMBOS='T+T;T+R;…' node sonde-une-session.mjs <index.html> sorties`, puis `node comparer.mjs`.

## 2 · LES CAS OÙ « OCCUPÉ = REFUSÉ » BLOQUERAIT PAUL (mesuré ce matin, 07:02-07:13 ; parties Q1D et L)
*A joue et dévoile deux fois, puis son onglet se ferme (ce qu'on voit aussi d'un ordinateur éteint : plus rien n'écrit) ou sa page est gelée (la veille). Le tableau distant est regardé 6 s et 30 s après ; un autre appareil B ouvre le site ; puis, dans la partie Q1D, B lance une autre session ; dans la partie L, B clique « Reprendre » dans le bandeau, dévoile deux fois et arrête. Enfin l'annonce de A est vieillie de 4 h 01 au hub (le seuil du code).*

| Le cas | Combien de temps le tableau reste tenu | Ce que voit Paul sur l'autre appareil | Ce qu'il peut faire aujourd'hui |
|---|---|---|---|
| Une vraie heure abandonnée sans « Clore » (onglet fermé) | 6 s, 30 s : l'image de A ; l'annonce reste au hub ; vieillie de 4 h 01 : **le tableau garde l'image de A** | le bandeau « Heure en cours avec les 3E Charles de Gaulle — Reprendre » | une répétition : refusée, « tableau distant pris : 3E Charles de Gaulle est en cours » ; **« Reprendre »** : « Heure reprise : la diapo, le chrono, les décisions, les paroles et les notes sont revenus. » [Compris], le tableau suit B ; puis « Clore l'heure » : le tableau revient à l'horloge, l'annonce est retirée |
| La même, ordinateur en veille (page gelée 20 s) | l'image de A pendant la veille ; vieillie de 4 h 01 : l'image reste | le même bandeau | une répétition : refusée, « tableau distant pris » ; A réveillé dévoile : le tableau le suit |
| Le mode test laissé (un essai, onglet fermé) | 6 s, 30 s : l'image de A ; vieillie de 4 h 01 : l'horloge | « Essai en cours (mode test) — 3E Charles de Gaulle — Reprendre » | une répétition : **elle prend le tableau**, et quand elle s'arrête **le tableau revient à l'essai disparu** ; « Reprendre », deux ▶ : **le tableau reste sur la scène de A** ; « Clore l'heure » : l'horloge, l'annonce retirée |
| Une répétition laissée (onglet fermé) | 6 s, 30 s : l'image de A ; vieillie de 4 h 01 : l'horloge | « Répétition en cours — Reprendre » | une vraie heure : elle prend le tableau, et à sa clôture **le tableau revient à la répétition disparue** ; « Reprendre » : le tableau suit B ; « ■ Arrêter » : l'horloge, l'annonce retirée |
| Une répétition en mode test laissée (onglet fermé) | la même | « Répétition en cours (mode test) — Reprendre » | la même |
| Le réseau coupé | **je ne sais pas** : non mesuré (le faux hub de la sonde passe par la page elle-même ; couper le réseau du navigateur ne le coupe pas) | — | — |

Compté : 9 cas joués (5 Q1D, 4 L), 0 échec. Dans les 4 cas « Reprendre » puis arrêter, l'annonce de A est retirée et le tableau revient à l'horloge (4 sur 4). Comparé au 03/11 (`AUDIT-GLOBAL/RAPPORT-I.md` §1.6) : voir §1, lignes Q1D.

## 3 · LES ÉCRITURES QUI DISENT « CETTE SESSION TIENT LE TABLEAU » (lues dans le code de la base, `LIVRAISONS/INTEGRATION/`)
Trois adresses, une par sorte ; le tableau distant les lit dans cet ordre toutes les 3 s et suit la première « fraîche » (`dr_tabLirePointeur`, `LIVRAISONS/INTEGRATION/dr/dr-tableau.js` l. 460).

| Adresse | Qui l'écrit | Sa fraîcheur | Qui l'efface |
|---|---|---|---|
| `/site/cours_actif` (vraie heure) | le lancement (`dr_lancerNeuf` → `dr_coursEcrire`, `dr/dr-classe.js` l. 914, 861) ; la reprise (`dr_reprendre`, l. 994 ; `dr_sesReprendreEssai`, `dr/dr-session.js` l. 392-401) | `ts` posé une fois, au lancement ou à la reprise ; aucun minuteur ne le réécrit ; « frais » = moins de 4 h (`dr-tableau.js` l. 460, `dr-session.js` l. 24) | « Clore l'heure » (`dr_cloreFin` → `dr_coursFermer`, `dr-classe.js` l. 1046, 869) ; l'annulation d'un lancement (`dr_annulerHeure` l. 1914, `dr_lanceAnnuler` l. 1962 → `dr_coursActifEffacerSi` l. 871, seulement si c'est encore la même heure) ; `sesCoursFermer` (`index.html` l. 16608). Lancer une autre heure ne l'efface pas : il marque l'ancienne close (`dr_cloreHeureRestee`, l. 873) et le nouveau lancement écrit par-dessus |
| `/site/repetition/pointeur` (répétition) | le lancement de la répétition (`dr/dr-atelier.js` l. 765) | `ts` posé une fois ; le minuteur de 250 ms (`dr_repEmettre`) n'écrit que l'image ; 4 h | « ■ Arrêter » (`arreterRepetition` l. 255 → `dr_repTableauFin` l. 770), seulement s'il porte encore son `ts` et sa séance |
| `/site/tableau_test/pointeur` (essai et répétition en mode test : la même adresse) | le lancement (`dr/dr-tableau.js` l. 209) | `ts` posé une fois ; `dr_ttEmettre` n'écrit que l'image ; 4 h | `dr_ttFin` (l. 226 : l'annonce et l'image, puis l'état vivant et les écrans 1,5 s après), seulement s'il est encore le sien ; appelé par la clôture de l'essai (`dr_ttHeureFin` l. 233), l'arrêt d'une répétition en mode test (`dr_repTableauFin`), le mode test qu'on éteint |

- Fermer l'onglet, éteindre, couper le réseau : rien n'est écrit. Le seul geste au départ de la page (`pagehide` → `dr_sauveAvantDepart`, `dr/dr-socle.js` l. 461-462) sauve l'atelier, il ne touche à aucune des trois adresses.
- Après 4 h : la répétition et le mode test retombent à l'horloge ; pour une vraie heure, le tableau garde l'image (`index.html` l. 16780 : « plus de cours : l'image RESTE »).
- Ce que le faux hub a reçu dans chaque cas mesuré : `sorties/audit-I.jsonl`, champ `hub` des parties Q1D et L.

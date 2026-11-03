# AUDIT — LES ÉCHECS DU BANC À LA VRAIE HORLOGE : LE SITE OU LA SONDE ?
*L'auditeur neuf (C16 367), mandat `MANDATS/DEROULE-01-11/MANDAT-AUDIT-HORLOGE.md` (sas, main, `e29299c0a`). Aucune ligne du site changée. Branche `audit/horloge`, partie de `banc/vraie-horloge` (`ced5eba45`).*

Le fichier mesuré : l'assemblé de `LIVRAISONS/INTEGRATION/` à `ced5eba45` (le même site qu'à `9c13d037c` : `git diff 9c13d037c ced5eba45 -- LIVRAISONS/INTEGRATION` ne touche que `EX/bancs/sonde-10.mjs`), refait par `AUDITS/INTEGRATION-DEROULE/assembler.mjs` : md5 `bc7cc9cdfef2011bc1b1a1848edad3f8`, 11 modules, 0 manquant.

Les sorties brutes (elles portent des noms d'élèves du faux hub) restent dans le scratchpad de la session ; ici, seulement des comptes et des identifiants d'appareils tirés au hasard (`DR_SES.id`). Les heures des traces : en millisecondes depuis le 14/09 09:00 (l'heure des pages au lancement de la sonde).

Les sorties poussées : `sorties/` (ce dossier). `m5-appel-date.txt` est valable jusqu'à 16:07:38 (P2T et X ; XT coupé), les autres sont des passages entiers sur la machine seule ; `m7-*.txt` (T) en copie anonymisée (les noms du faux hub remplacés par « ÉLÈVE » / « élève », vérifié : 0 reste). La file des passages : `file-mesures.sh` ; chaque passage par `mesurer.sh`.

L'outil : `sonde-appel-trace.mjs` (ce dossier) = `APPEL/sonde-appel.mjs` de `ced5eba45`, plus, seulement avec `MJPC_TRACE=1` : qui a la main sur chaque appareil, chaque état vivant reçu par le faux hub, et un piège sur `DR_SES.main` (la pile d'appels de chaque changement), sur `dr_sesPremierVerifier`, et sur les lectures et écritures de `…/etat`. Sans la variable : la sonde d'origine.

---

## BILAN (18:48 ; le détail suit)
Mesuré sur la machine donnée par la conscience (18:17-18:48), 18 passages surveillés, tous « propres ».
1. **P2T** : le téléphone désactivé après « Reprendre » sur un second ordinateur est **voulu** (règle de 17:20) ; **l'attente de la sonde ne va pas**. Mais le site y arrive **par erreur**, par le chemin A (le second ordinateur se prend pour une version d'avant : `dr-classe.js:975`, `dr-session.js:342`, `dr-session.js:175-179`). Ce chemin dépend d'une course de minuteries (sur la machine seule : gagnée par 2 et 3 ms, perdue par 24 ms et par une annulation).
2. **Le chemin A fait perdre en silence le geste fait juste avant** (une prise de parole, un ▶, au téléphone ou à l'ordinateur) : **14 fois sur 14** (dans les 9 cas où chaque appareil est relevé : partout, tableau compris ; dans les 5 autres, au moins sur l'appareil qui l'avait fait). **Le site.**
3. **P2H** (vraie heure, sans touche) : **le téléphone reste actif 3 fois sur 5** après « Reprendre » sur un second ordinateur : **dette du site** (règle de 17:20). Les 2 autres fois, il est désactivé par un troisième accident, le chemin C (`dr-session.js:173` contre `318`, puis `97`).
4. **X et XT** : la paire rouge l'était parce que le second ordinateur avait pris la main (A, ou B : sa touche Échap, voulue par la règle de 17:04). **L'attente de la sonde ne va pas.** Jouée selon la règle (le téléphone reprend la main, puis son appui et le clic droit à 40 ms) : **verte 4 fois sur 4, l'appui du téléphone gardé** sur chaque appareil, la case et le hub.
5. **T** (la session) : rouge 1 sur 3 chez moi (la réponse tapée au second ordinateur perdue chez les trois pilotes), 1 sur 4 chez la conscience (un dévoilement absent du téléphone). C'est le même moment du parcours : trois pilotes qui se prennent la main en moins d'une seconde. **Le site** (une perte). Cause exacte : **je ne sais pas**.
6. **Pourquoi l'horloge simulée disait vert** : sous `page.clock`, la sauvegarde immédiate du second ordinateur ne part jamais avant `DR_SES.ici`. Playwright joue d'abord des minuteries plus anciennes, dont une qui l'annule (`dr-classe.js:742`). Donc pas de chemin A. Mesuré 3 fois sur 3.
7. **Les montres** (`MJPC_HORLOGE=date`) et **l'heure du serveur du faux hub** ne jouent dans aucun de ces échecs (lu dans le code ; P2T et XT, en mode test, n'écrivent aucune heure du serveur).
8. **Je ne sais pas** : où se perd le texte de T ; pourquoi le chemin B n'a pas joué à l'horloge simulée ; si le vrai flux de Firebase peut livrer un état plus ancien après un plus récent (vu avec le faux hub, PG sans A) ; ce que deviennent les gestes des autres pendant les 3 s du chemin C ; pourquoi, sans Échap, le clic droit de la sonde ne s'ouvre pas au second ordinateur (P2H, ma variante).

## 0 · LA RÈGLE (Paul, 03/11, transmise par la conscience)
- 17:04 : « n'importe quelle touche » reprend la main.
- 17:20 : quand un second ordinateur fait « Reprendre », le téléphone se désactive, dans tous les cas (vraie heure, mode test, répétition). **Tout geste sur un ordinateur, « Reprendre » compris, désactive le téléphone** ; le téléphone reprend par « Reprendre avec la télécommande ».

Lu avec cette règle, ce qui suit change de sens : le téléphone désactivé après « Reprendre » est **voulu** ; l'attente des sondes P2T, P2H, X et XT (la télécommande garde la main après la reprise d'un second ordinateur) **ne va pas**. Ce qui reste à juger : par quel chemin le site désactive le téléphone (et s'il le fait toujours), et si ce chemin fait perdre un geste.

## 1 · P2T (mode test) — le résultat est voulu, le chemin est un hasard du site

**Ce que Paul verrait** : il lance un essai (mode test) à l'ordinateur, scanne le QR avec son téléphone, puis clique « Reprendre » sur un second ordinateur (le bandeau « Essai en cours (mode test) »). **Le second ordinateur prend la main** ; le téléphone dit « Télécommande désactivée : l'ordinateur a repris la main » ; « Appel » n'ouvre pas la liste (l'appui est refusé, `dr-session.js:680`) jusqu'à « Reprendre avec la télécommande ». C'est la règle de 17:20.

**Mais le site ne le fait pas parce que « Reprendre » est un geste** : le clic sur le bandeau est exclu des gestes (`dr-session.js:332-333`, `#ses-reprise`). Il le fait **par erreur**, le chemin A ci-dessous : le second ordinateur se prend pour une version d'avant. Ce chemin dépend de l'ordre de deux minuteries. Quand il ne se produit pas (mesuré en X, `m5` : manqué de 24 ms), **le téléphone reste actif** après « Reprendre », contre la règle : une dette du site, à compter (P2H et P2T, en file). Et le chemin A remplace le socle de la fusion par l'état reçu, puis envoie l'état de la reprise : un geste fait juste avant peut-il s'y perdre ? En file (la partie PG de ma copie).

**Compté** (assemblé `bc7cc9cd`, vraie horloge `MJPC_HORLOGE=date`) :
- la conscience : P2T rouge 4 sur 4 (base + 3 rejeux) ;
- **mes passages m1 à m4 (15:47:32-15:59:12) sont ÉCARTÉS des comptes** : l'exécutant du lot 1 a lancé ses sondes pendant cette période (ses sorties datées 15:42 puis 15:56:01-15:59:39 ; son navigateur vu à 15:58:30, pendant mon passage de 15:58:10) ; je ne peux pas prouver qu'aucun de mes passages n'a partagé les 2 processeurs avec lui. Ce qu'ils montrent (la suite d'appels ci-dessous) reste une description, à confirmer par des passages propres. Pour info seulement : P2T rouge 3 sur 3 à la vraie horloge, verte 2 sur 2 à l'horloge simulée ; P2H (sonde d'origine, vraie horloge) rouge 3 sur 3 ; P2H piégée rouge à la vraie horloge comme à l'horloge simulée (1 sur 1 chacune).
- moi, sur machine libre et surveillée (`m5`, 16:05:43-16:07:38) : P2T rouge 1 sur 1, les mêmes 4 échecs, la même cause (le piège ci-dessous).
- Désormais chaque passage passe par `mesurer.sh` (ce dossier) : machine libre avant, surveillée toutes les 0,5 s pendant (un navigateur qui ne descend pas du passage : le passage s'arrête et il est dit « CHEVAUCHÉ »), témoin retiré après.

**La cause, dans le code** (`LIVRAISONS/INTEGRATION/dr/`) :
1. Le second ordinateur qui reprend un essai pose dans son magasin `C/etat` avec `maj` = l'heure de l'état vivant lu (`dr-session.js:373`, `dr_sesReprendreEssai`).
2. À la fin de la reprise (`dr_reprendre`, `dr-classe.js:947-978`) : `S.lancee = true` (ligne 968), puis `tout(); dr_copieAuto(true);` (ligne 975) → `dr_etatAuto(vite)` (`dr-classe.js:741-744`) écrit `C/etat` **aussitôt** (minuterie de 0 ms), `dr_etatHeure()` → `maj: Date.now()` (`dr-classe.js:687`). La marque de « cette version » (`vifTs`) n'est ajoutée que si `DR_SES.ici` est déjà posé (`dr-session.js:341-342`).
3. `DR_SES.ici` n'est posé que par `dr_sesVeiller`, qui tourne toutes les 400 ms (`dr-session.js:315-325`, ligne 319). Il faudrait qu'un tour de veille tombe entre la fin de la reprise et la minuterie de 0 ms (mesuré : 89 à 104 ms d'écart, la page dessine) ; sinon, `C/etat` porte une heure récente et **pas de `vifTs`**.
4. Le premier état vivant reçu passe par `dr_sesPremierVerifier` (`dr-session.js:170-182`) : `C/etat` sans `vifTs` et plus récent que l'état vivant (ligne 175) est pris pour l'écriture d'une **version d'avant** (la 8.79.0, la 8.77.1-⑩) : l'appareil prend la main (ligne 178) et l'envoie à tous.
5. La télécommande reçoit cet état : `main` n'est plus elle (`dr_sesRecu`, ligne 154) ; `dr_sesJeTiens()` faux (ligne 183) : « désactivée » (lignes 647-649), chaque bouton grisé (ligne 665), « Appel » refusé (ligne 680).

Les trois autres échecs de P2T en découlent : b « grisés » (la liste n'a jamais été ouverte : 0 bouton), c (« Reprendre avec la télécommande », puis un appui sur l'élève de a, qui n'avait jamais été marqué : il est marqué au lieu d'être retiré, « 0 sur 27 présents »).

**Le piège, mesuré au second ordinateur** (passage `m5`, 16:05:43, machine libre et surveillée jusqu'à 16:07:38 ; P2T y a fini avant) :
```
20892 dr_lire …/etat : maj=16443 vifTs=undefined          (la reprise lit l'état posé par dr_sesReprendreEssai)
21187 dr_etatAuto(vite) S.lancee=true DR_SES.ici null ← dr_copieAuto < g < g < (anonymes)   (la fin de la reprise)
21291 dr_ecrire …/etat : maj=21291 vifTs=undefined (DR_SES.ici null)
21293 main undefined → null ← dr_sesSuivreFin < dr_sesVeiller          (DR_SES.ici posé : 2 ms trop tard)
21810 premierVerifier v.ts=16443
21811 dr_lire …/etat : maj=21291 vifTs=undefined          (21291 > 16443, sans vifTs : « une version d'avant »)
21811 main null → (le second ordinateur) ← suite              (dr-session.js:178)
```
Le même ordre dans les passages piégés écartés (`m2`, `m3` : 24 et 30 ms trop tard).

**La montre n'y est pour rien** : `maj` et `v.ts` sont tous deux l'heure d'une page (`Date.now()`), décalées de la même façon par `MJPC_HORLOGE=date` ; le hub n'intervient pas (en mode test, aucune heure du serveur : `{".sv":"timestamp"}` n'est écrit qu'en vraie heure, `dr-classe.js:1442`, `index.html:20040`). Ce qui joue, c'est l'ordre de deux minuteries de la page (900 ms et 400 ms) : celles du navigateur, comme en classe.

**Pourquoi l'horloge simulée la disait verte** (mesuré dans les passages écartés `m2`, `m3` ; à refaire sur machine libre, en file) : à l'horloge simulée, la reprise est plus lente à aboutir (de la lecture de la reprise à `DR_SES.ici` : 1 064 ms et 909 ms, contre 551 ms et 430 ms à la vraie) et la première écriture de `C/etat` par le second ordinateur vient **après** `DR_SES.ici` (`m3` : 24 766 > 23 473), donc avec `vifTs` : la vérification relit l'état posé par la reprise (`maj` = `v.ts`), pas « plus récent », la main reste à la télécommande. Pourquoi la minuterie de 900 ms n'a rien écrit plus tôt sous `page.clock` : je ne sais pas (non mesuré).

---

## 2 · X (vraie heure) et XT (mode test) — la même prise de main, par deux chemins

**Avec la règle de 17:20**, le téléphone désactivé avant la paire est voulu : la paire se joue autrement. Le téléphone reprend la main (« Reprendre avec la télécommande »), puis son appui et le clic droit de l'ordinateur partent à 40 ms. La question devient : l'appui du téléphone, fait quand il avait la main, est-il gardé (chaque appareil, le hub) ? Ma copie le joue ainsi avec `MJPC_X_REGLE=1`, en file. Ce qui suit dit pourquoi la paire de la sonde d'origine était rouge.

**Ce qui échoue** : dans X et XT, seule la première paire est rouge (« la télécommande et le clic droit de l'ordinateur, deux élèves »). Le décor est celui de P2 : l'ordinateur lance, la télécommande scanne, le second ordinateur « Reprendre ». L'appui de la télécommande ne se fait que si son bouton n'est pas grisé (`GESTE`, sonde-appel.mjs : `if (b && !b.disabled)`). Le second ordinateur a pris la main : la télécommande est désactivée, son appui ne part pas ; l'élève qu'elle devait marquer ne l'est nulle part ; la vérification « aucun ne se perd » est fausse sur chaque appareil.

**Mesuré** (`m5`, X, machine libre et surveillée) : le premier geste (la télécommande) **pas fait**, le second (le clic droit de l'ordinateur) fait ; « les noms de l'appel à la télécommande : 0 » (la liste n'avait pas pu s'ouvrir).

**Les deux chemins par lesquels le second ordinateur prend la main à sa reprise** :
- **A — le site** (section 1) : sa propre écriture de `C/etat` sans `vifTs`, prise pour une version d'avant. Dans `m5`, en X, A a été évité de justesse : l'écriture est arrivée 24 ms **après** `DR_SES.ici` (75 650 contre 75 626), avec `vifTs`.
- **B — la touche Échap de la sonde, que le site compte comme un geste** : `reprendre` (sonde-appel.mjs:126-127) clique « Reprendre », attend 3,5 s, puis tape Échap. Pour le site, toute touche hors du bandeau et de la télécommande est un geste qui prend la main (`dr-session.js:333`) : au prochain envoi dans les 2 s (`dr-session.js:93-94`), l'ordinateur prend la main. Mesuré dans `m5`, X : Échap à 77 386, `main null → (le second ordinateur) ← dr_sesEnvoyerMaintenant` à 78 856 (1 470 ms après).

**B, verdict : c'est la sonde.** Paul a tranché (03/11 17:04, transmis par la conscience) : « n'importe quelle touche » reprend la main. La main prise par le second ordinateur après Échap est donc voulue. Ce qui ne va pas, c'est l'attente de la sonde : elle tape Échap au second ordinateur (`reprendre`, sonde-appel.mjs:126-127), puis compte sur la télécommande pour garder la main (le commentaire de X : « la télécommande d'abord (elle a la main depuis son QR) »). La sonde corrigée : la reprise sans touche (`MJPC_SANS_ECHAP=1`, ma copie). Reste-t-il un échec quand personne ne touche le clavier ? Ce serait le chemin A, le site. En file (X ×2, XT), sur la machine donnée par la conscience.

*(suite : XT mesuré, l'horloge simulée pour X et XT, P2H, T — en cours)*

## 3 · MESURÉ SUR LA MACHINE SEULE (donnée par la conscience à 18:17:20 ; chaque passage surveillé par `mesurer.sh`, tous « propres »)

*(Un premier passage, 18:17:37, arrêté à tort : la première version de `mesurer.sh` a pris un processus de rendu de mon propre navigateur, fermé entre `ps` et la lecture de son parent, pour un navigateur étranger. Corrigé à 18:19 : seuls les navigateurs principaux, sans `--type=`, qui ne descendent pas du passage et qui sont encore là au contrôle suivant.)*

| passage | ce qui est joué | résultat |
|---|---|---|
| `m19-1` 18:20:11 | X selon la règle (`MJPC_X_REGLE=1`) | **10 sur 10.** Avant la paire, le téléphone n'avait plus la main (désactivé par la touche Échap du second ordinateur, chemin B : voulu). « Reprendre avec la télécommande » → la main, 29 noms, 0 grisé. Puis l'appui du téléphone et le clic droit de l'ordinateur, à 39 ms : **l'élève du téléphone gardé** sur l'ordinateur, le second, le téléphone, la case du troisième et le hub ; l'élève de l'ordinateur aussi. |
| `m20-1` 18:21:24 | XT selon la règle | **8 sur 8.** Même chose en mode test, à 42 ms : l'appui du téléphone gardé sur les trois appareils. |
| `m17-1` 18:22:14 | P2H, reprise **sans touche** | **Le téléphone reste actif** après « Reprendre » du second ordinateur (les trois appareils disent : la main est au téléphone). Contre la règle de 17:20 : **dette du site**. Pourquoi : le chemin A n'a pas eu lieu. La sauvegarde immédiate (`dr_etatAuto(vite)`, 22 899) a été remplacée par celle de 900 ms avant de partir ; `C/etat` relu au hub portait le `vifTs` de l'ordinateur. Lu dans le code : le clic sur le bandeau n'est pas un geste (`dr-session.js:332-333`) ; aucun autre chemin ne s'est vu dans le piège. (Les étapes b et d de ce passage sont rouges à cause de ma variante : sans Échap, le clic droit de la sonde sur le second ordinateur n'ouvre pas son menu, « PAS FAIT » ; pourquoi, je ne sais pas, sans capture.) |
| `m16-1` 18:23:38 | P2T (sonde d'origine, avec Échap) | Les 4 mêmes rouges. **Chemin A** : `C/etat` écrit sans `vifTs` à 20 609, `DR_SES.ici` posé à 20 612 (3 ms trop tard), la main prise à 21 401 par `suite`. Le téléphone désactivé : le résultat voulu, par le mauvais chemin. |
| `m18-1` 18:24:23 | PG (9 cas) | Voir ci-dessous. |
| `m7-1` 18:28:36 | T de la session | **24 sur 24** (vert). Le second ordinateur y prend aussi la main à sa reprise par le chemin A (39 111, `suite`). |
| `m19-2` 18:30:18 | X selon la règle | **10 sur 10**, l'appui du téléphone gardé partout (comme `m19-1`). |
| `m20-2` 18:31:32 | XT selon la règle | **8 sur 8**, l'appui du téléphone gardé (comme `m20-1`). |
| `m17-2` 18:32:20 | P2H sans touche | Le téléphone désactivé, mais **par un troisième chemin, C** (ci-dessous) : le second ordinateur se donne la main à 26 265, 3,1 s après la vérification de son premier état. |
| `m7-2` 18:33:51 | T de la session | **24 sur 24.** |
| `m7-3` 18:35:37 | T de la session | **1 rouge** (autre que celui de la conscience) : la réponse tapée au second ordinateur pendant que l'ordinateur dévoile est **perdue chez les trois pilotes** (« » ; la conscience : 23 lettres gardées). Ci-dessous. |
| `m11-1` 18:37:20 | P2T, horloge simulée | **10 sur 10.** |
| `m12-1` 18:37:56 | X et XT, horloge simulée (sondes d'origine, avec Échap) | **18 sur 18.** |
| `m17-3` 18:39:55 | P2H sans touche | **Le téléphone reste actif.** |
| `m17-4` 18:41:18 | P2H sans touche | **Le téléphone reste actif.** |
| `m17-5` 18:42:42 | P2H sans touche | Le téléphone désactivé, par le chemin C (prouvé ci-dessous). |
| `m18-2` 18:44:13 | PG rejoué (sans la page dans la comparaison ; chaque clé écrite) | Ci-dessous. |

**P2H sans touche, compté : le téléphone reste actif 3 fois sur 5** (`m17-1`, `-3`, `-4`) après « Reprendre » sur un second ordinateur en vraie heure : **dette du site** (règle de 17:20). Les 2 autres fois (`m17-2`, `-5`), il est désactivé, mais seulement par le chemin C, un accident.

**Le chemin C, prouvé** (`m17-5`, le piège de la réception et de la veille) :
```
22679 premierVerifier v.ts=18380 → dr_lire …/etat (lecture au hub, asynchrone)
22696 dr_sesVeiller remplace DR_SES.ici (même sig) pendant attendrePremier      (dr-session.js:318, toutes les 400 ms)
22701 dr_lire …/etat revient → suite : DR_SES.ici !== ici → return, sans rien   (dr-session.js:173)
      … la veille remplace DR_SES.ici toutes les 400 ms ; le premier état n'est jamais posé
25484 main null → (le second ordinateur) ← dr_sesEnvoyerMaintenant             (3 s : dr_sesAttend lâche, l. 127-128 ;
                                                                               !DR_SES.main → « je tiens », l. 183 ; l. 97)
```
La veille fait `DR_SES.ici = ici` à chaque tour, même quand rien n'a changé (ligne 318 : un objet neuf, `dr_sesIci()`), et la vérification compare l'objet, pas la signature (ligne 173). Si un tour de veille tombe pendant la lecture de `C/etat` (quelques ms à quelques dizaines de ms), le premier état est jeté. L'ordinateur reste 3 s sans rien poser, puis prend la main et envoie l'état de sa reprise, **sans base** (`DR_SES.dernier` nul). Ce que deviennent les gestes des autres pendant ces 3 s, je ne l'ai pas mesuré.

**PG rejoué (`m18-2`), compté sur les deux passages** :
- **Avec le chemin A : le geste perdu 14 fois sur 14** (`m18-1` : 8 ; `m18-2` : 6). Dans `m18-2`, chaque clé est écrite : pour chaque ▶, l'ordinateur, le second, la télécommande et le tableau sont tous revenus à l'élément d'avant (#2 au lieu de #3) ; pour chaque prise de parole, absente des trois pilotes.
- **Sans A** (4 cas : 1 dans `m18-1`, 3 dans `m18-2`). La prise de parole est gardée partout (1 sur 1). Pour ▶ (3 cas), le geste est chez l'ordinateur et la télécommande, mais le second ordinateur reste à l'élément d'avant (et, une fois sur trois, le tableau aussi). La trace : le second reçoit d'abord l'état du geste, puis 70 à 120 ms après, un état **plus ancien**, écrit avant son abonnement (150 978 après 157 116 ; 231 991 après 238 127), et il l'applique. Le site accepte un état reçu même plus ancien (`dr-session.js:139`, voulu : « jamais rejeté parce que la montre de son appareil retarde »). Cela ressemble à **la sonde** : le faux hub livre la valeur lue à l'abonnement (`__hubEcoute(…).then(d => setTimeout(… __esPousser …))`) **après** une écriture poussée plus tard (`pousserFlux`). Je ne sais pas si le vrai flux de Firebase peut livrer dans cet ordre ; non prouvé.

**T, `m7-3`** (le piège du second ordinateur) : le second ordinateur prend la main en tapant (46 227). L'état du ▶ de l'ordinateur arrive pendant sa frappe (47 765, « occupé ») et lui reprend la main. Le site ferme alors son champ « tel qu'il est, son texte gardé » (`dr-session.js:156`), puis pose l'état reçu (47 921). Ensuite, le texte n'est chez aucun pilote. La règle du site est « rien de perdu ». Où le texte s'est perdu (avant d'entrer dans l'état d'ici, à la fusion, ou dans l'état cédé), je ne sais pas : je n'ai pas trouvé où la frappe d'une réponse est rangée. Compté : T rouge 1 sur 3 chez moi, 1 sur 4 chez la conscience, avec deux rouges différents (ici la réponse tapée, là le dévoilement au téléphone), dans le même moment du parcours : trois pilotes qui se prennent la main en moins d'une seconde.

**Pourquoi l'horloge simulée disait vert : mesuré.** Dans les trois passages à l'horloge simulée (`m11-1`, `m12-1` X et XT), la sauvegarde immédiate du second ordinateur (`dr_etatAuto(vite)`, minuterie de 0 ms) ne part pas avant `DR_SES.ici`.
- `m11-1` : posée à 20 415, elle est annulée à 20 767 par un `dr_etatAuto(900 ms)` (`clearTimeout(DR_CL.eT)`, dr-classe.js:742), appelé depuis une minuterie plus ancienne que Playwright jouait d'abord (`ClockController._callFirstTimer < _runTo`). La première écriture vient à 22 307, avec `vifTs`.
- `m12-1` XT : posée à 80 241, elle ne part qu'à 80 976, après `DR_SES.ici` (80 622), avec `vifTs`.

Pas de chemin A ; la main reste à la télécommande ; les attentes d'origine sont vertes. À la vraie horloge, la minuterie de 0 ms part 100 à 155 ms après, avant le tour de veille (`m5`, `m16-1` : chemin A), sauf quand la page appelle `dr_copieAuto` entre-temps (`m19-1`, `m17-1` : pas de A). Le chemin B (la touche Échap) n'a pas joué à l'horloge simulée : pourquoi, je ne sais pas.

**PG — un geste fait juste avant la prise de main par A se perd-il ? Oui.** Le décor de P2T, la reprise du second ordinateur sans touche. 200, 500 ou 800 ms après son clic sur « Reprendre », un geste : une prise de parole à la télécommande (`tc-qui`), ▶ à la télécommande (`tc-suiv`), ▶ au clic de l'ordinateur (`ord-suiv`). Puis 5 s d'attente.
- **Le compte des deux passages (`m18-1`, `m18-2`, 18 cas) : le chemin A a joué 14 fois ; le geste a disparu 14 fois sur 14.** La prise de parole est absente des trois pilotes, **y compris de la télécommande qui l'avait notée**. Pour ▶ (`m18-2`, chaque clé écrite), l'ordinateur, le second, la télécommande et le tableau sont tous revenus à l'élément d'avant. Dans `m18-1`, ma comparaison incluait la page ; seul l'appareil qui avait fait le geste y est compté sûr.
- Sans A (4 cas) : voir plus haut (« PG rejoué ») ; la seule perte vue y ressemble à la sonde (l'ordre du flux du faux hub) ; non prouvé.

**Pourquoi le geste se perd** (la suite d'appels, mesurée dans le cas `tc-suiv` 500 ms ; le code, `dr-session.js`) : le ▶ du téléphone part à 131 749. Le second ordinateur, qui reprend, reçoit cet état en premier ; plus ancien que sa propre écriture de `C/etat`, il le prend pour « une version d'avant » : `DR_SES.socle` = cet état (ligne 177), `DR_SES.dernier` = sa clé, la main, `forcer` (ligne 178). Puis il envoie (ligne 179) **sa photo à lui, celle de la reprise, lue avant le ▶**, en la déclarant bâtie sur cet état (`base`). Chez les autres, la fusion à trois voies (`dr_sesFus`, lignes 236-246) voit : la base a le geste, l'état reçu ne l'a plus, ici rien n'a changé → **le geste est retiré**, comme si le second ordinateur l'avait défait. Pour la prise de parole (une liste aux identifiants) : l'élément est dans la base, absent de l'état reçu → retiré (ligne 239). Le téléphone, qui a perdu la main, cède ensuite son dernier état (133 112) ; ce qu'il contenait, je ne l'ai pas relevé. Aucun message à l'écran : une **perte silencieuse**.

En classe : Paul note une prise de parole (ou dévoile) au téléphone ; dans la seconde qui suit, un second ordinateur fait « Reprendre ». La prise de parole disparaît partout, sans rien dire.

## 4 · Les montres de la sonde et l'heure du faux hub (lu dans le code ; ce qui est mesuré est dit)

- **`MJPC_HORLOGE=date`** (sonde-appel.mjs:89-90, 114 ; sonde-session.mjs, même code) ne remplace que `Date` dans chaque page, avec le même décalage pour tous les appareils (`t09 - T0REEL`, plus `decal`, qui vaut 0 dans P2, X et XT). Dans le site, rien ne contourne ce `Date` (aucun `Intl…format()` sans date, aucun `performance.timeOrigin`, aucun `constructor()` de date ; `ev.timeStamp`, dr-session.js:330, ne sert qu'à l'écart entre deux touches). Les heures comparées par le chemin A (`maj` contre `v.ts`) sont deux montres de page décalées pareil : le réglage des montres n'y joue pas.
- **L'heure du serveur du faux hub** (`resoudreSv` : l'heure de la machine, le 03/11, quand les pages sont au 14/09) : le site n'écrit `{".sv":"timestamp"}` qu'à deux endroits, l'appel en vraie heure (dr-classe.js:1442, index.html:20040). Ces heures ne sont comparées qu'entre elles (`edtAppelDerniers`, index.html:19966-19972 ; le geste pas encore revenu du hub passe devant, `Number.MAX_SAFE_INTEGER`, index.html, `edtAppelAvecMes`). Le décalage ne peut donc pas jouer ici (lu, pas mesuré). Il ne joue pas non plus dans A ni dans B : en mode test, aucune heure du serveur n'est écrite, et P2T, XT échouent pareil.
- **L'horloge simulée de Playwright** (`page.clock.install`, playwright-core 1.63.0, `/opt/node-tools/node_modules/playwright-core/lib/coreBundle.js`, classe `ClockController`) : les minuteries de la page (setTimeout, setInterval, requestAnimationFrame) ne sont pas celles du navigateur. Une minuterie réelle de la sonde se réveille au plus tard toutes les 100 ms (`_updateRealTimeTimer`) et joue **toutes les minuteries échues, une par une, dans l'ordre de leur échéance**, avec un aller-retour réel entre chacune (`_runTo`, `_callFirstTimer`). Une veille de 400 ms en retard (la page était occupée) passe donc avant une minuterie de 0 ms posée après elle. Dans le navigateur, l'ordre dépend du moment où chacune devient due. Confirmé par le piège (section 3, « Pourquoi l'horloge simulée disait vert »).

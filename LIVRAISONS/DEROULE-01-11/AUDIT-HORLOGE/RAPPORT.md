# AUDIT — LES ÉCHECS DU BANC À LA VRAIE HORLOGE : LE SITE OU LA SONDE ?
*L'auditeur neuf (C16 367), mandat `MANDATS/DEROULE-01-11/MANDAT-AUDIT-HORLOGE.md` (sas, main, `e29299c0a`). Aucune ligne du site changée. Branche `audit/horloge`, partie de `banc/vraie-horloge` (`ced5eba45`).*

Le fichier mesuré : l'assemblé de `LIVRAISONS/INTEGRATION/` à `ced5eba45` (le même site qu'à `9c13d037c` : `git diff 9c13d037c ced5eba45 -- LIVRAISONS/INTEGRATION` ne touche que `EX/bancs/sonde-10.mjs`), refait par `AUDITS/INTEGRATION-DEROULE/assembler.mjs` : md5 `bc7cc9cdfef2011bc1b1a1848edad3f8`, 11 modules, 0 manquant.

Les sorties brutes (elles portent des noms d'élèves du faux hub) restent dans le scratchpad de la session ; ici, seulement des comptes et des identifiants d'appareils tirés au hasard (`DR_SES.id`). Les heures des traces : en millisecondes depuis le 14/09 09:00 (l'heure des pages au lancement de la sonde).

L'outil : `sonde-appel-trace.mjs` (ce dossier) = `APPEL/sonde-appel.mjs` de `ced5eba45`, plus, seulement avec `MJPC_TRACE=1` : qui a la main sur chaque appareil, chaque état vivant reçu par le faux hub, et un piège sur `DR_SES.main` (la pile d'appels de chaque changement), sur `dr_sesPremierVerifier`, et sur les lectures et écritures de `…/etat`. Sans la variable : la sonde d'origine.

---

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

## 4 · Les montres de la sonde et l'heure du faux hub (lu dans le code ; ce qui est mesuré est dit)

- **`MJPC_HORLOGE=date`** (sonde-appel.mjs:89-90, 114 ; sonde-session.mjs, même code) ne remplace que `Date` dans chaque page, avec le même décalage pour tous les appareils (`t09 - T0REEL`, plus `decal`, qui vaut 0 dans P2, X et XT). Dans le site, rien ne contourne ce `Date` (aucun `Intl…format()` sans date, aucun `performance.timeOrigin`, aucun `constructor()` de date ; `ev.timeStamp`, dr-session.js:330, ne sert qu'à l'écart entre deux touches). Les heures comparées par le chemin A (`maj` contre `v.ts`) sont deux montres de page décalées pareil : le réglage des montres n'y joue pas.
- **L'heure du serveur du faux hub** (`resoudreSv` : l'heure de la machine, le 03/11, quand les pages sont au 14/09) : le site n'écrit `{".sv":"timestamp"}` qu'à deux endroits, l'appel en vraie heure (dr-classe.js:1442, index.html:20040). Ces heures ne sont comparées qu'entre elles (`edtAppelDerniers`, index.html:19966-19972 ; le geste pas encore revenu du hub passe devant, `Number.MAX_SAFE_INTEGER`, index.html, `edtAppelAvecMes`). Le décalage ne peut donc pas jouer ici (lu, pas mesuré). Il ne joue pas non plus dans A ni dans B : en mode test, aucune heure du serveur n'est écrite, et P2T, XT échouent pareil.
- **L'horloge simulée de Playwright** (`page.clock.install`, playwright-core 1.63.0, `/opt/node-tools/node_modules/playwright-core/lib/coreBundle.js`, classe `ClockController`) : les minuteries de la page (setTimeout, setInterval, requestAnimationFrame) ne sont pas celles du navigateur. Une minuterie réelle de la sonde se réveille au plus tard toutes les 100 ms (`_updateRealTimeTimer`) et joue **toutes les minuteries échues, une par une, dans l'ordre de leur échéance**, avec un aller-retour réel entre chacune (`_runTo`, `_callFirstTimer`). Une veille de 400 ms en retard (la page était occupée) passe donc avant une minuterie de 0 ms posée après elle. Dans le navigateur, l'ordre dépend du moment où chacune devient due. C'est une explication possible de l'écart sur le chemin A, à confirmer par le piège (`m11`, en file).

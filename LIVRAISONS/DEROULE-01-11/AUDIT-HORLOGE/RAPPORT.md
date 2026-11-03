# AUDIT — LES ÉCHECS DU BANC À LA VRAIE HORLOGE : LE SITE OU LA SONDE ?
*L'auditeur neuf (C16 367), mandat `MANDATS/DEROULE-01-11/MANDAT-AUDIT-HORLOGE.md` (sas, main, `e29299c0a`). Aucune ligne du site changée. Branche `audit/horloge`, partie de `banc/vraie-horloge` (`ced5eba45`).*

Le fichier mesuré : l'assemblé de `LIVRAISONS/INTEGRATION/` à `ced5eba45` (le même site qu'à `9c13d037c` : `git diff 9c13d037c ced5eba45 -- LIVRAISONS/INTEGRATION` ne touche que `EX/bancs/sonde-10.mjs`), refait par `AUDITS/INTEGRATION-DEROULE/assembler.mjs` : md5 `bc7cc9cdfef2011bc1b1a1848edad3f8`, 11 modules, 0 manquant.

Les sorties brutes (elles portent des noms d'élèves du faux hub) restent dans le scratchpad de la session ; ici, seulement des comptes et des identifiants d'appareils tirés au hasard (`DR_SES.id`). Les heures des traces : en millisecondes depuis le 14/09 09:00 (l'heure des pages au lancement de la sonde).

L'outil : `sonde-appel-trace.mjs` (ce dossier) = `APPEL/sonde-appel.mjs` de `ced5eba45`, plus, seulement avec `MJPC_TRACE=1` : qui a la main sur chaque appareil, chaque état vivant reçu par le faux hub, et un piège sur `DR_SES.main` (la pile d'appels de chaque changement), sur `dr_sesPremierVerifier`, et sur les lectures et écritures de `…/etat`. Sans la variable : la sonde d'origine.

---

## 1 · P2T (mode test) — LE SITE

**Verdict : c'est le site.** Ce que Paul verrait : il lance un essai (mode test) à l'ordinateur, scanne le QR avec son téléphone, puis clique « Reprendre » sur un second ordinateur (le bandeau « Essai en cours (mode test) »). Sans aucun autre geste, **le second ordinateur prend la main** ; le téléphone dit « Télécommande désactivée : l'ordinateur a repris la main » ; « Appel » n'ouvre pas la liste (l'appui est refusé, `dr-session.js:680`) ; tant que Paul n'appuie pas sur « Reprendre avec la télécommande », la télécommande ne fait rien.

**Compté** (assemblé `bc7cc9cd`, vraie horloge `MJPC_HORLOGE=date`) :
- la conscience : P2T rouge 4 sur 4 (base + 3 rejeux) ;
- moi, P2T seule : rouge 3 sur 3 (une fois sans piège, deux fois avec) ; dans les 3, l'état vivant du second ordinateur au hub dit `main` = lui, avant tout geste de sa part ;
- moi, la même P2T à l'horloge simulée (`page.clock`, sans la variable) : verte 2 sur 2.

**La cause, dans le code** (`LIVRAISONS/INTEGRATION/dr/`) :
1. Le second ordinateur qui reprend un essai pose dans son magasin `C/etat` avec `maj` = l'heure de l'état vivant lu (`dr-session.js:373`, `dr_sesReprendreEssai`).
2. Il prépare aussitôt une sauvegarde : `dr_etatAuto` (`dr-classe.js:741-744`) écrit `C/etat` 900 ms plus tard, `dr_etatHeure()` → `maj: Date.now()` (`dr-classe.js:687`). La marque de « cette version » (`vifTs`) n'est ajoutée que si `DR_SES.ici` est déjà posé (`dr-session.js:341-342`).
3. `DR_SES.ici` n'est posé que par `dr_sesVeiller`, qui tourne toutes les 400 ms (`dr-session.js:315-325`, ligne 319). S'il passe après l'écriture du point 2, `C/etat` porte une heure récente et **pas de `vifTs`**.
4. Le premier état vivant reçu passe par `dr_sesPremierVerifier` (`dr-session.js:170-182`) : `C/etat` sans `vifTs` et plus récent que l'état vivant (ligne 175) est pris pour l'écriture d'une **version d'avant** (la 8.79.0, la 8.77.1-⑩) : l'appareil prend la main (ligne 178) et l'envoie à tous.
5. La télécommande reçoit cet état : `main` n'est plus elle (`dr_sesRecu`, ligne 154) ; `dr_sesJeTiens()` faux (ligne 183) : « désactivée » (lignes 647-649), chaque bouton grisé (ligne 665), « Appel » refusé (ligne 680).

Les trois autres échecs de P2T en découlent : b « grisés » (la liste n'a jamais été ouverte : 0 bouton), c (« Reprendre avec la télécommande », puis un appui sur l'élève de a, qui n'avait jamais été marqué : il est marqué au lieu d'être retiré, « 0 sur 27 présents »).

**Le piège, mesuré au second ordinateur** (un passage à la vraie horloge, `m3`) :
```
20682 dr_lire …/etat : maj=16378 vifTs=undefined          (la reprise : l'état posé par dr_sesReprendreEssai)
21203 dr_ecrire …/etat : maj=21203 vifTs=undefined (DR_SES.ici null)   ← dr_etatAuto
21233 main undefined → null ← dr_sesSuivreFin < dr_sesVeiller          (DR_SES.ici posé, 30 ms trop tard)
21929 premierVerifier v.ts=16378
21929 dr_lire …/etat : maj=21203 vifTs=undefined          (21203 > 16378, sans vifTs : « une version d'avant »)
21930 main null → (le second ordinateur) ← suite              (dr-session.js:178)
```
Le même ordre dans l'autre passage piégé (`m2`, sans le piège des écritures) : `C/etat` relu avec `maj=21279`, sans `vifTs`, et `DR_SES.ici` posé à 21303, 24 ms après.

**La montre n'y est pour rien** : `maj` et `v.ts` sont tous deux l'heure d'une page (`Date.now()`), décalées de la même façon par `MJPC_HORLOGE=date` ; le hub n'intervient pas (en mode test, aucune heure du serveur : `{".sv":"timestamp"}` n'est écrit qu'en vraie heure, `dr-classe.js:1442`, `index.html:20040`). Ce qui joue, c'est l'ordre de deux minuteries de la page (900 ms et 400 ms) : celles du navigateur, comme en classe.

**Pourquoi l'horloge simulée la disait verte** (mesuré, 2 passages sur 2) : à l'horloge simulée, la reprise est plus lente à aboutir (de la lecture de la reprise à `DR_SES.ici` : 1 064 ms et 909 ms, contre 551 ms et 430 ms à la vraie) et la première écriture de `C/etat` par le second ordinateur vient **après** `DR_SES.ici` (`m3` : 24 766 > 23 473), donc avec `vifTs` : la vérification relit l'état posé par la reprise (`maj` = `v.ts`), pas « plus récent », la main reste à la télécommande. Pourquoi la minuterie de 900 ms n'a rien écrit plus tôt sous `page.clock` : je ne sais pas (non mesuré).

---

*(suite : P2H, X et XT, T — en cours)*

# MANDAT — LES ÉCHECS DU BANC À LA VRAIE HORLOGE : LE SITE OU LA SONDE ?
*Conscience n°16, 03/11/2026 15:42. Dans 367 du plan C16 (accepté par Paul le 03/11 à 14:43) : « mes tests de temps à la vraie horloge du navigateur ». Un auditeur neuf. **Tu ne changes pas une ligne du site** : tu mesures, tu comptes, tu trouves la cause. Registre : `docs/MJPC6-DETTES.md` (production) ; transcript : `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
- Pendant l'heure, Paul fait l'appel à la télécommande (son téléphone) ou au clic droit de son ordinateur. Si un élève marqué absent se perd, ou si la télécommande refuse l'appel, Paul le voit en classe (ou ne le voit pas, et l'appel est faux). Il faut savoir si c'est le cas.

## 1 · CE QUI EST MESURÉ (la conscience, 15:03-15:41, la production 8.81.1-⑭-micro : sas `9c13d037c`, assemblé `bc7cc9cd`)
Les sondes de la branche `banc/vraie-horloge` (`ced5eba45`), avec `MJPC_HORLOGE=date` (seule la date des pages est décalée au 14/09 09:00 ; minuteries, images et `performance` du navigateur). Sorties : `…/scratchpad/c16-367/base/` et `…/scratchpad/c16-367/rejeu/` (elles portent des noms d'élèves du faux hub : ne les pousse jamais, cite « un élève »).
1. **L'appel** (`APPEL/sonde-appel.mjs`), quatre passages :
   - **P2T** (mode test) : rouge **4 sur 4**. La télécommande se dit « désactivée : l'ordinateur a repris la main » ; le bouton « Appel » n'ouvre pas la liste (0 nom) ; rien de ce qui suit ne passe. P2H (vraie heure, même suite de gestes) : vert.
   - **XT** (mode test) : rouge **4 sur 4** ; **X** (vraie heure) : rouge **2 sur 4**. La télécommande et le clic droit de l'ordinateur sur deux élèves, à 40 ms d'écart : « aucun ne se perd » est faux sur chaque appareil (et au hub en vraie heure). Les autres paires de X et XT (le second ordinateur, la case d'un troisième, le même élève) : vertes.
   - À l'horloge simulée de Playwright (`page.clock`), la même sonde : 114 sur 114, à chaque banc depuis le 02/11 (X vu rouge une fois, C16 302, pas reproduit).
2. **La session** (`SESSION-PARTOUT/sonde-session.mjs`, partie T) : rouge **1 sur 4** : « le dévoilement de l'ordinateur : chez les trois pilotes » ; 2,8 s après, le téléphone reste sur l'élément 0.
3. Vertes à la vraie horloge : la frappe (14/14), la fin d'heure (56/56), la sonde ⑩ (51/51), le fil (100/100).

## 2 · CE QUE TU CHERCHES
1. Pour P2T, XT, X et T : la cause, par le geste et le code (le fichier, la fonction, la ligne). Est-ce le site (ce que Paul verrait en classe, avec des appareils à l'heure du réseau) ou la sonde à la vraie horloge (un délai attendu trop court, un ordre de gestes impossible en classe, la façon dont `MJPC_HORLOGE=date` règle les montres, l'heure du serveur du faux hub — `resoudreSv` rend l'heure de la machine, alors que les pages sont au 14/09) ? Si c'est la sonde, prouve-le (la sonde corrigée, et le site inchangé, vert) ; si c'est le site, montre le geste de classe qui le produit, compté.
2. Pourquoi l'horloge simulée les disait vertes.
3. Ce que tu ne sais pas : « je ne sais pas ».

## 3 · LES RÈGLES
- Lis d'abord le code et les sorties ; mesure ensuite. **La machine** (2 processeurs) : l'exécutant du lot 1 a la priorité sur le navigateur. Tu ouvres un navigateur seulement si aucun autre ne tourne (`ps -eo comm | grep -cE '^(chrom|headless)'` à 0) et si ni …/scratchpad/MACHINE-CONSCIENCE ni …/scratchpad/MACHINE-MESURE n'existent ; tu poses …/scratchpad/MACHINE-MESURE le temps de ta mesure, et tu le retires aussitôt après. Tue tes processus par leur PID.
- Ton dossier : `git worktree add -b audit/horloge <dossier> ced5eba45` (la branche `banc/vraie-horloge`) ; tu pousses sur `audit/horloge` seulement : un RAPPORT `LIVRAISONS/DEROULE-01-11/AUDIT-HORLOGE/RAPPORT.md`, tes sondes et sorties sans nom d'élève.
- Tu ne touches ni le site (`LIVRAISONS/INTEGRATION/`), ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`.
- Les heures : `TZ=Europe/Paris date`, à chaque fois. Pousse ton rapport par morceaux ; dis-le à la conscience (`SendMessage`, `to: "main"`).

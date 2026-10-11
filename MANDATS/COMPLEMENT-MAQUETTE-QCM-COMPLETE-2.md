# COMPLÉMENT 2 — LA MAQUETTE COMPLÈTE DU QCM : LES BOUTONS FERMÉS DE MJPC

*Écrit par la conscience n°12 le 11/10/2026 (tour 641), sur l'ordre de Paul. Le 10/10 à 19:23, la conscience lui a proposé : « un complément 2, très court, d'une traite » (point 700). Paul a répondu le 11/10 à 07:54 : « Ok ».*

*Ce complément s'adresse à l'exécutant de la maquette complète du QCM, en session cloud de Claude Code, dans le dépôt du sas `siteflow-io/mjpc-chantier`.*

*Le mandat https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md et le complément 1 https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md restent en vigueur en entier.*

*Le rapport d'audit du complément 1 est ici : https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/MAQUETTE-QCM-COMPLEMENT-1-10-10/README.md.*

---

## 0. Ce que ça change pour la classe

Paul va valider les écrans de MJPC sur captures. Aujourd'hui, il ne peut pas y voir quelles entrées du menu marchent. Les 12 entrées qui ne s'ouvrent pas ont la même allure que « 👥 Élèves & codes » et « 📚 Taxonomie », qui s'ouvrent. « Code professeur » a la même allure que les autres boutons de l'encart de la clé.

C'est le bouton mort qui passe pour vrai (protocole maquette, §2). Paul croirait valider un menu entier, alors que la maquette n'en fait que deux entrées.

Tout le reste de la v6 a passé l'audit : les six défauts du complément 1 sont corrigés, et le banc, rejoué par la conscience, compte 18 245 vérifications et 0 échec.

---

## 1. Qui tu es, ce que tu ne fais jamais

Tu es **l'exécutant du complément 2**. Les interdits du mandat (§1) et du complément 1 (§1) valent tous, mot pour mot :
1. **tu fais tout le complément d'une traite**, sans t'arrêter et sans rien demander ;
2. **une livraison n'a jamais ni trou ni dette**.

En plus :
1. tu ne touches qu'au défaut 7 (§2), **et** à tout ce que la garde 6 trouve (§3). Chaque trouvaille est un défaut, corrigé et inscrit au journal ;
2. tu ne modifies pas les fichiers `maquette-qcm-v1.html` à `v6.html`, ni leurs md5 ; ta livraison est `maquette-qcm-v7.html`.

Pour commencer : `git fetch origin`, `git checkout maquette-qcm`, puis `git merge origin/main`. Lis ce complément et le rapport d'audit du complément 1 en entier. Puis vérifie les md5 de la production, comme au complément 1 (§2) : `index.html` doit être `ac792b28f40d3a0510e725fc4a6b6985`.

---

## 2. Le défaut 7 — les boutons fermés de MJPC ne se voient pas fermés

**Les 9 scènes touchées** :
- `m-classe-exclusions`, `m-exclusion-refusee`, `m-fiche-eleve` ;
- `m-taxonomie`, `m-taxonomie-editeur`, `m-taxonomie-domaine`, `m-taxonomie-notion` ;
- `m-taxonomie-competences`, `m-taxonomie-competence`.

**Les 13 boutons** :
- les 12 entrées du menu du panneau prof sans scène : « Tableau de bord », « Classes », « Profil test », « Architecture », « Archives », « Corbeille », « Annonces aux élèves », « Dates de l'année », « Emploi du temps », « Atelier », « Configuration & Firebase », « Présence live » ;
- et « Code professeur », dans l'encart de la clé.

**Ce qui a été mesuré dans la v6** : chacun de ces boutons porte bien `disabled`, avec l'infobulle « Inchangé : cet écran reste celui d'aujourd'hui. ». Mais :
- son opacité est à 1 ;
- sa couleur est celle d'un bouton qui marche (`rgba(255, 255, 255, 0.7)`, comme « 📚 Taxonomie » ; « Code professeur » est blanc, comme « Oublier la clé sur cet appareil ») ;
- son curseur est la main.

Le relevé est dans `AUDITS/MAQUETTE-QCM-COMPLEMENT-1-10-10/sorties/menu-mjpc.txt` et `grises-v6.txt`.

**Ce qui est attendu** :
1. **Ces 13 boutons prennent l'aspect qu'`index.html` donne déjà à un bouton fermé** : `.eli-btn:disabled{opacity:.45;cursor:not-allowed}` (l. 860), avec la même opacité et le même curseur. L'entrée active reste telle qu'elle est. Les deux entrées qui marchent, « 👥 Élèves & codes » et « 📚 Taxonomie », gardent l'aspect du vrai menu.
2. **La raison reste lisible au survol.** Un bouton fermé ne reçoit pas la souris dans tous les navigateurs. L'infobulle « Inchangé : cet écran reste celui d'aujourd'hui. » est donc portée par une enveloppe autour du bouton, et c'est l'enveloppe qui reçoit la souris (le bouton fermé ne la prend pas).
3. **Rien d'autre ne change** dans ces scènes : ni les textes, ni l'ordre, ni les autres boutons.

---

## 3. La garde 6 — un bouton fermé de Paul se voit fermé

Elle entre dans le banc unique (`banc/banc.js`, avec les gardes du complément 1). Elle lit aussi l'intérieur des cadres, et elle passe par le geste dans Chromium.

**Où elle s'applique** : dans chaque scène des vues de Paul (la console, le téléphone et MJPC), à chaque bouton fermé visible (`disabled` ou `aria-disabled="true"`). Une moitié d'élève montrée dans une scène de console, par exemple dans le mode test, suit les règles de l'élève : le clic figé de B y reste tel que les maquettes validées le montrent.

**Ce qu'elle vérifie** sur chacun de ces boutons :
1. son opacité effective (avec celle de ses parents) est de 0,6 au plus, **ou** sa couleur et son fond diffèrent de ceux d'un bouton actif de même classe dans la scène ;
2. son curseur n'est pas la main ;
3. au survol, la souris posée au centre du bouton (`document.elementFromPoint`) atteint un élément qui n'est pas fermé et qui porte, lui ou un parent, une infobulle non vide : la raison.

**Avant toute correction, tu joues la garde 6 sur la v6.** Elle doit y trouver les 13 boutons du §2, dans les 9 scènes. Mets la sortie dans `sorties/garde6-sur-v6.txt`. Si la garde ne les trouve pas, refais-la avant d'aller plus loin. Si elle trouve d'autres boutons de Paul fermés qui passent pour vrais, ce sont des défauts : corrige-les de la même façon.

---

## 4. Les étapes, d'une traite

Chaque étape finit par sa garde, puis par un commit poussé sur `maquette-qcm` : une sauvegarde, pas un arrêt.

### Étape A — la garde

Ce qu'elle fait : la fusion de `main`, la vérification des md5, puis la garde 6 dans le banc.

Sa garde : la garde 6 jouée sur la v6 trouve les 13 boutons (`sorties/garde6-sur-v6.txt`).

### Étape B — la correction et la livraison

Ce qu'elle fait :
- le défaut 7, et tout ce que la garde 6 a trouvé d'autre ;
- `maquette-qcm-v7.html` et son md5 ;
- toutes les captures refaites et regardées : les 9 scènes `m-…` d'abord, et dans chacune, les entrées fermées visiblement estompées ;
- `livret-maquette-qcm-v7.pdf` ;
- le README (une section « Complément 2 » en tête), `DEFAUTS.md` à partir du n°48.

Sa garde : le banc final, qui rejoue tout sur la v7, gardes 1 à 6 comprises, doit passer à zéro défaut (`sorties/banc-final-v7.txt`).

---

## 5. La livraison, une seule

Elle va sur la branche `maquette-qcm`, dans `MANDATS/MAQUETTE-QCM-COMPLETE/` :
1. `maquette-qcm-v7.html`, son md5, et ses sources ;
2. dans `sorties/` : `garde6-sur-v6.txt` et `banc-final-v7.txt` ;
3. `captures/` refait ;
4. `livret-maquette-qcm-v7.pdf` ;
5. le README, avec en tête la section « Complément 2 » :
   - le défaut 7, et les scènes qui le montrent corrigé ;
   - ce que la garde 6 a trouvé d'autre ;
   - le reste du README mis à jour, sans rien laisser de faux.

Zéro trou, zéro dette, zéro défaut : le banc final le prouve.

## 6. Après l'étape B

Tu t'arrêtes, une seule fois. La conscience fait l'audit final du complément 2, puis Paul valide sur captures. Tu ne fusionnes rien dans `main`.

# COMPLÉMENT 2 — LA MAQUETTE COMPLÈTE DU QCM : LES BOUTONS FERMÉS DE MJPC, LA LARGEUR DU PANNEAU, LES BOUTONS DÉCALÉS, LA RANGÉE DE L'EMPLOI DU TEMPS

*Écrit par la conscience n°12 le 11/10/2026 (tour 641), puis complété aux tours 643 et 644, sur l'ordre de Paul :*
- *le 10/10 à 19:23, la conscience lui a proposé « un complément 2, très court, d'une traite » (point 700) ;*
- *le 11/10 à 07:54, Paul a répondu : « Ok » ;*
- *à 08:03, il a ajouté : « au passage, elle peut régler aussi une dette qu'on traine depuis longtemps (vérifier la dette et sa registration bien sûr, avant de mandater quoique ce soit). la largeur du panneau (qui doit prendre la taille de l'écran en fait, au lieu que je doive scroller dans un encart minuscule), et le décalage des boutons (regarde les captures). » ;*
- *à 08:08 : « Et ça aussi: le bouton répété d'export du json, ou alors les ranger par type, ou faire un sélecteur pour exporter soit un, soit quelques un, soit tous. »*

*Ce complément s'adresse à l'exécutant de la maquette complète du QCM, en session cloud de Claude Code, dans le dépôt du sas `siteflow-io/mjpc-chantier`.*

*Le mandat https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md et le complément 1 https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md restent en vigueur en entier.*

*Le rapport d'audit du complément 1 est ici : https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/MAQUETTE-QCM-COMPLEMENT-1-10-10/README.md.*

---

## 0. Ce que ça change pour la classe

Paul va valider les écrans de MJPC sur captures. Aujourd'hui, quatre choses l'en empêchent ou le gênent :
1. **il ne peut pas voir quelles entrées du menu marchent.** Les 12 entrées qui ne s'ouvrent pas ont la même allure que « 👥 Élèves & codes » et « 📚 Taxonomie », qui s'ouvrent. « Code professeur » a la même allure que les autres boutons de l'encart de la clé. C'est le bouton mort qui passe pour vrai (protocole maquette, §2) ;
2. **dans le vrai site, le panneau prof est une fenêtre de 1 100 px de large au plus**, au milieu de l'écran. Paul y fait défiler sans cesse un encart étroit, alors que son écran a la place ;
3. **dans le vrai site, sur chaque ligne d'élève de « Élèves & codes », ↻ et ✕ sortent de la carte** : ils tombent sous le numéro, à gauche, hors du cadre. Les captures de Paul du 11/10 sont `TRANSCRIPTS/C12/pieces/T643-panneau-prof-1.png` et `T643-panneau-prof-2.png`. La même ligne, refaite avec le CSS de la production, est dans `AUDITS/MAQUETTE-QCM-COMPLEMENT-1-10-10/captures/dette88-reproduction-css-production.png` ;
4. **dans le vrai site, la section « Emploi du temps » aligne dix boutons sur une seule rangée** : six « ⤓ Sortir le JSON », un par objet, et deux « 📋 Copier le prompt », plus « Ouvrir l'emploi du temps » et sa case. Ils s'écrasent en colonnes étroites, et la section défile de côté. La capture de Paul du 11/10 est `TRANSCRIPTS/C12/pieces/T644-emploi-du-temps.png`.

Les points 2 et 3 sont des dettes du registre, inscrites le 01/10 et jamais mandatées. Le point 4 est inscrit le 11/10. La maquette les montre réglés. Le code les réglera dans le vrai site, en partant de la maquette validée.

Tout le reste de la v6 a passé l'audit : les six défauts du complément 1 sont corrigés, et le banc, rejoué par la conscience, compte 18 245 vérifications et 0 échec.

---

## 1. Qui tu es, ce que tu ne fais jamais

Tu es **l'exécutant du complément 2**. Les interdits du mandat (§1) et du complément 1 (§1) valent tous, mot pour mot :
1. **tu fais tout le complément d'une traite**, sans t'arrêter et sans rien demander ;
2. **une livraison n'a jamais ni trou ni dette**.

En plus :
1. tu ne touches qu'au défaut 7 (§2), aux deux dettes (§3) et à la rangée de l'emploi du temps (§4), **et** à tout ce que les gardes 6, 7 et 8 trouvent (§5). Chaque trouvaille est un défaut, corrigé et inscrit au journal ;
2. tu ne modifies pas les fichiers `maquette-qcm-v1.html` à `v6.html`, ni leurs md5 ; ta livraison est `maquette-qcm-v7.html` ;
3. tu n'écris rien dans la production : `index.html` se lit seulement. C'est le mandat de code qui le changera, plus tard ;
4. tu ne lis pas le hub : les données de l'emploi du temps sont dans `MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT/`, relues au hub par la conscience, avec leurs md5.

Pour commencer :
1. `git fetch origin`, `git checkout maquette-qcm`, puis `git merge origin/main` ;
2. lis en entier ce complément, le rapport d'audit du complément 1, le README de `MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT/`, et les trois captures de Paul ;
3. vérifie les md5 de la production, comme au complément 1 (§2) : `index.html` doit être `ac792b28f40d3a0510e725fc4a6b6985`. Vérifie aussi les md5 des données de l'emploi du temps (`md5.txt`).

---

## 2. Le défaut 7 — les boutons fermés de MJPC ne se voient pas fermés

**Les 9 scènes touchées** :
- `m-classe-exclusions`, `m-exclusion-refusee`, `m-fiche-eleve` ;
- `m-taxonomie`, `m-taxonomie-editeur`, `m-taxonomie-domaine`, `m-taxonomie-notion` ;
- `m-taxonomie-competences`, `m-taxonomie-competence`.

**Les 13 boutons fermés de la v6** :
- les 12 entrées du menu du panneau prof sans scène : « Tableau de bord », « Classes », « Profil test », « Architecture », « Archives », « Corbeille », « Annonces aux élèves », « Dates de l'année », « Emploi du temps », « Atelier », « Configuration & Firebase », « Présence live » ;
- et « Code professeur », dans l'encart de la clé.

« Emploi du temps » s'ouvre désormais sur sa scène (§4). Il en reste donc 12 fermés dans la v7 : 11 entrées du menu et « Code professeur ».

**Ce qui a été mesuré dans la v6** : chacun de ces boutons porte bien `disabled`, avec l'infobulle « Inchangé : cet écran reste celui d'aujourd'hui. ». Mais :
- son opacité est à 1 ;
- sa couleur est celle d'un bouton qui marche (`rgba(255, 255, 255, 0.7)`, comme « 📚 Taxonomie » ; « Code professeur » est blanc, comme « Oublier la clé sur cet appareil ») ;
- son curseur est la main.

Le relevé est dans `AUDITS/MAQUETTE-QCM-COMPLEMENT-1-10-10/sorties/menu-mjpc.txt` et `grises-v6.txt`, et la capture dans `AUDITS/MAQUETTE-QCM-COMPLEMENT-1-10-10/captures/defaut-boutons-fermes-mjpc.png`.

**Ce qui est attendu** :
1. **Les boutons fermés prennent l'aspect qu'`index.html` donne déjà à un bouton fermé** : `.eli-btn:disabled{opacity:.45;cursor:not-allowed}` (l. 860), avec la même opacité et le même curseur. L'entrée active reste telle qu'elle est. Les entrées qui marchent gardent l'aspect du vrai menu.
2. **La raison reste lisible au survol.** Un bouton fermé ne reçoit pas la souris dans tous les navigateurs. L'infobulle « Inchangé : cet écran reste celui d'aujourd'hui. » est donc portée par une enveloppe autour du bouton, et c'est l'enveloppe qui reçoit la souris (le bouton fermé ne la prend pas).
3. **Rien d'autre ne change** dans ces scènes pour ce défaut : ni les textes, ni l'ordre, ni les autres boutons.

---

## 3. Les deux dettes du registre — n°12 · 87 et n°12 · 88

Elles sont inscrites dans `docs/MJPC6-DETTES.md` de la production, l. 2897 et 2899, le 01/10 (tour 321 de la conscience n°12), mot pour mot :
- « **n°12 · 87 — UI DU PANNEAU PROF (Paul, 01/10, capture) : LA MODALE EST TROP ÉTROITE.** « Il faudrait que mon pilotage prenne la largeur complète de l'écran, parce que la modale c'est bien mais tout est entassé, je dois scroller en permanence. » Le panneau prof s'ouvre dans une modale à largeur bornée ; à régler : le panneau prend toute la largeur (et la hauteur) de l'écran, sans changer ses sections. »
- « **n°12 · 88 — UI « ÉLÈVES & CODES » (Paul, 01/10, capture) : LES BOUTONS ↻ / ✕ DE CHAQUE ÉLÈVE SORTENT DU CADRE** de la carte (ils flottent à gauche, hors de la ligne de l'élève). À régler : les boutons dans la carte, alignés. »

Aucun mandat ne les a reprises depuis : c'est vérifié au sas et dans la production le 11/10.

### Dette 87 — le panneau prend toute la taille de l'écran

**La cause, mesurée dans `index.html`** :
- `.tprof-overlay { … padding: 30px; … }` (l. 223) ;
- `.tprof-box { … width: 100%; max-width: 1100px; … border-radius: 16px; … }` (l. 225).

La fenêtre ne dépasse donc jamais 1 100 px de large. La v6 reproduit fidèlement ce défaut (capture 153 : 1 100 px dans une fenêtre de 1 536).

**Ce qui est attendu, dans toutes les scènes `m-…`** :
1. le panneau couvre toute la fenêtre, bord à bord : ni marge autour, ni largeur bornée, ni coins arrondis ;
2. le reste du panneau ne change pas : l'en-tête, le menu de 230 px, le contenu, ses sections. Le contenu défile toujours en hauteur quand il est plus long que l'écran ;
3. aux trois tailles de la console (1366 × 768, 1536 × 864, 1920 × 1080) : les bords du panneau sont ceux de la fenêtre, à 1 px près, et il n'y a aucun défilement horizontal.

### Dette 88 — ↻ et ✕ dans la carte, alignés

**La cause, mesurée dans `index.html`** :
- la ligne d'élève est une grille de 4 colonnes : `.el-row{display:grid;grid-template-columns:28px minmax(0,1fr) 96px auto; …}` (l. 609) ;
- depuis ELEVE-1 ③, la ligne a 5 enfants (l. 5529) : le numéro, le nom, `<span class="elf-flag">` (le ◆, vide quand l'élève n'a pas de dispositif), le code, puis `.el-acts` (↻ ✕).

Résultat : le ◆ prend la 3e colonne, le code la 4e, et ↻ ✕ passent à la ligne, dans la colonne de 28 px. Comme `.el-acts` aligne à droite (`justify-content:flex-end`, l. 614), ils débordent à gauche, hors de la carte. Ce rendu a été reproduit avec le CSS de la production : ↻ commence 20 px à gauche du bord de la carte, une ligne sous le code (30 px plus bas), sur chaque ligne, avec ou sans ◆.

**La v6 l'a corrigé sans le dire.** `src/mjpc.css` y remplace la grille par 6 colonnes (`grid-template-columns:28px minmax(0,1fr) auto auto 96px auto` : le numéro, le nom, le ◆, « 🚫 Jamais avec… », le code, ↻ ✕). C'est la bonne correction, mais une maquette qui part de l'existant déclare chaque écart avec le vrai site : il est désormais déclaré comme le règlement de la dette 88.

**Ce qui est attendu, dans `m-classe-exclusions`, `m-exclusion-refusee` et partout où la liste paraît** : sur chaque ligne d'élève, avec ou sans ◆, ↻ et ✕ sont dans la carte, à droite, sur la ligne du nom.

---

## 4. La rangée de l'emploi du temps (inscrite au registre le 11/10, n°12 · 212)

### Ce qui a été mesuré

**Dans `index.html`, la section « Emploi du temps »** (`edtPeindrePanneau`, l. 19794 à 19850) met sur une seule rangée (`.edt-actions edt-haut`, l. 19808 à 19820) :
1. « 📅 Ouvrir l'emploi du temps » ;
2. la case « arriver sur l'emploi du temps en me connectant » ;
3. un bouton « ⤓ Sortir le JSON — <objet> — injecté le … » **par objet présent au hub** (`EDT_OBJETS`, l. 18482). Le 11/10, il y en a six : calendrier, grille, creneaux, periodes, photos, reglages, chacun nommé par son identifiant ;
4. un bouton « 📋 Copier le prompt — <voie> » **par consigne** (`EDT_PROMPTS`, l. 20745) : calendrier et grille.

Cela fait dix éléments dans une rangée qui ne passe jamais à la ligne : `.edt-actions{display:flex;gap:8px;margin-top:8px}` (l. 20024). Ils s'écrasent en colonnes étroites, et le contenu défile de côté (capture de Paul).

**Ce que font les deux gestes** :
- « ⤓ Sortir le JSON » (`edtSortirJson`, l. 20792) copie dans le presse-papiers `JSON.stringify(objet, null, 1)` et dit « JSON de « calendrier » copié — 19717 caractères. » ;
- « 📋 Copier le prompt » (`edtCopierPrompt`, l. 20765) copie la consigne et le JSON en service, en un seul bloc.

### Ce qui est attendu

C'est le tranchage de la conscience entre les trois voies de Paul : un sélecteur pour sortir le JSON, et les boutons rangés par type. Paul le valide ou le corrige sur la capture.

1. **Une nouvelle scène, `m-emploi-du-temps`**, ouverte par l'entrée « Emploi du temps » du menu.
   - Elle part d'`index.html` : le haut de la section (l. 19795 à 19850), avec le paragraphe, les trois lignes d'état, la rangée, le rappel « Le calendrier de l'année a été injecté… » et le bloc « ✨ Injecter un objet », ses trois voies fermées.
   - Son CSS est celui d'`edtPoserCss` (l. 20006 et suivantes).
   - Ses données sont celles de `MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2-EDT/`. Les chiffres des lignes d'état sont recalculés sur ces données avec les vraies fonctions d'`index.html` : « 52 semaines · 7 périodes sans cours · 11 fériés · 30 jalons · 15 événements de classe », « 30 cases · 4 classes nommées », « 8 créneaux — … ».
2. **La rangée devient trois groupes, l'un sous l'autre**, chacun avec son petit titre. Aucun ne défile de côté :
   - **le premier** : « 📅 Ouvrir l'emploi du temps » et la case « arriver sur l'emploi du temps en me connectant », tels qu'ils sont ;
   - **« ⤓ Sortir le JSON »** : une case par objet présent, avec son nom en clair et sa date (« Calendrier de l'année — injecté le jeudi 3 septembre »), puis « Tout cocher » et un seul bouton « ⤓ Sortir les JSON cochés ». Ce bouton est fermé tant que rien n'est coché, avec sa raison ;
     - un seul objet coché : c'est exactement le geste d'aujourd'hui, le même JSON et le même message ;
     - plusieurs objets cochés : un seul JSON, où chaque objet est rangé sous son identifiant (`{"calendrier": …, "grille": …}`, avec `JSON.stringify(…, null, 1)`), et le message « JSON de « calendrier », « grille » et « creneaux » copié — N caractères. » ;
   - **« 📋 Copier le prompt »** : un bouton par voie, nommé comme les voies de « Injecter un objet » (« Calendrier de l'année », « Grille de l'emploi du temps »). Le geste est celui d'aujourd'hui.
3. **Les noms en clair des objets** sont pris dans `index.html`, sans en inventer :
   - calendrier : « Calendrier de l'année » (l. 19803) ;
   - grille : « Grille de l'emploi du temps » (l. 19804) ;
   - creneaux : « Créneaux horaires » (l. 19805) ;
   - periodes : « Découpage en périodes » (l. 19411) ;
   - photos : « Photos du prévu » (l. 20680, « Photo du prévu — … ») ;
   - reglages : « Réglages de l'emploi du temps » (l. 19754) ;
   - decisions : « Décisions horaires » (l. 21908), s'il y en a un. Il n'y en a pas le 11/10, donc la case ne paraît pas.
4. **Rien d'autre ne change** dans la section : ni le paragraphe, ni les lignes d'état, ni le rappel, ni « Injecter un objet ».
   - Les gestes qui ouvrent un autre écran sont grisés, avec « Inchangé : cet écran reste celui d'aujourd'hui. » : « Ouvrir l'emploi du temps », « Réinjecter maintenant… » et les trois voies.
   - La case et « Plus tard » agissent sur place.
   - Les copies sont simulées et déclarées, comme dans la v6 : le message s'affiche, sans toucher au presse-papiers.
5. **Les infobulles** sont écrites pour Paul : ce que le geste fait et ce qu'il coûte.

---

## 5. Les gardes 6, 7 et 8

Elles entrent dans le banc unique (`banc/banc.js`, avec les gardes du complément 1). Elles lisent aussi l'intérieur des cadres, et elles passent par le geste dans Chromium.

### Garde 6 — un bouton fermé de Paul se voit fermé

**Où elle s'applique** : dans chaque scène des vues de Paul (la console, le téléphone et MJPC), à chaque bouton fermé visible (`disabled` ou `aria-disabled="true"`). Une moitié d'élève montrée dans une scène de console, par exemple dans le mode test, suit les règles de l'élève : le clic figé de B y reste tel que les maquettes validées le montrent.

**Ce qu'elle vérifie** sur chacun de ces boutons :
1. son opacité effective (avec celle de ses parents) est de 0,6 au plus, **ou** sa couleur et son fond diffèrent de ceux d'un bouton actif de même classe dans la scène ;
2. son curseur n'est pas la main ;
3. au survol, la souris posée au centre du bouton (`document.elementFromPoint`) atteint un élément qui n'est pas fermé et qui porte, lui ou un parent, une infobulle non vide : la raison.

### Garde 7 — le panneau de MJPC, et ses écarts avec le vrai site

1. **Le panneau** : dans chaque scène `m-…`, aux trois tailles de la console, la boîte du panneau touche les quatre bords de la fenêtre (à 1 px près), et la page n'a aucun défilement horizontal.
2. **La ligne d'élève** : sur chaque ligne de la liste, la boîte de ↻ ✕ est entièrement dans celle de la carte, et son centre vertical est à 4 px au plus de celui du nom.
3. **Aucun écart en silence** : chaque règle de `src/mjpc.css` qui remplace ou change une règle d'`index.html` est inscrite dans `banc/existant/ecarts-mjpc.json`, avec sa raison. La raison est un point du cadrage (585, 637…), une dette du registre (n°12 · 87, 88, 212) ou la simulation déclarée (les entrées grisées). Le banc refuse une règle changée sans raison inscrite.

### Garde 8 — la section « Emploi du temps »

1. **La place** : dans `m-emploi-du-temps`, aux trois tailles de la console, le contenu ne défile pas de côté, et aucun bouton de la section n'a un texte sur plus de deux lignes.
2. **Les chiffres** : les trois lignes d'état disent ce que les vraies fonctions donnent sur les données du dossier `…-EDT/`.
3. **Les copies** : par le geste, avec un objet coché, plusieurs, puis tous, le nombre de caractères du message est celui de `JSON.stringify(…, null, 1)` sur les données du dossier.
   - Pour un objet, c'est le JSON de l'objet seul : 19717 pour le calendrier.
   - Pour plusieurs, c'est le JSON où chaque objet est rangé sous son identifiant.
   - Avec rien de coché, « ⤓ Sortir les JSON cochés » est fermé.

### Avant toute correction

1. **Tu joues les gardes 6 et 7 sur la v6.**
   - La garde 6 doit y trouver les 13 boutons du §2, dans les 9 scènes.
   - La garde 7 doit y trouver le panneau borné à 1 100 px (dette 87), et la grille de la ligne d'élève changée sans raison inscrite (dette 88, partie 3 de la garde).
2. **Tu joues les témoins.**
   - La partie 2 de la garde 7 se joue sur une copie de la v6 où la grille d'`index.html` (l. 609) est remise telle quelle. Elle doit y trouver ↻ ✕ hors de la carte, sur chaque ligne.
   - La garde 8 se joue sur une page faite de la vraie rangée d'`index.html` (l. 19808 à 19820, son CSS) et des données du dossier, à 1366 × 768. Elle doit y trouver le défilement de côté et des boutons de plus de deux lignes.
3. **Les sorties** vont dans `sorties/gardes-6-7-8-sur-v6.txt`.

Une garde qui ne trouve pas son défaut connu n'est pas une garde : tu la refais avant d'aller plus loin. Si elles trouvent autre chose, ce sont des défauts : corrige-les de la même façon.

---

## 6. Les étapes, d'une traite

Chaque étape finit par sa garde, puis par un commit poussé sur `maquette-qcm` : une sauvegarde, pas un arrêt.

### Étape A — les gardes

Ce qu'elle fait :
- la fusion de `main`, et la vérification des md5 ;
- les gardes 6, 7 et 8 dans le banc ;
- `banc/existant/ecarts-mjpc.json`, avec chaque écart déjà présent dans la v6 et sa raison, sauf ceux que les dettes 87 et 88 vont régler ;
- l'inventaire de l'existant de la section « Emploi du temps » (`banc/existant/mjpc-emploi-du-temps.json`, tiré du code avec ses lignes, comme au complément 1).

Sa garde : les gardes 6, 7 et 8, jouées sur la v6 et sur les témoins, trouvent leurs défauts connus (`sorties/gardes-6-7-8-sur-v6.txt`).

### Étape B — la correction et la livraison

Ce qu'elle fait :
- le défaut 7, les dettes 87 et 88, la rangée de l'emploi du temps, chaque écart inscrit dans `ecarts-mjpc.json`, et tout ce que les gardes ont trouvé d'autre ;
- `maquette-qcm-v7.html` et son md5 ;
- toutes les captures refaites et regardées. D'abord les scènes `m-…` : dans chacune, le panneau bord à bord, les entrées fermées visiblement estompées, et ↻ ✕ dans chaque carte. Pour `m-emploi-du-temps`, trois captures : la section, un objet coché, tous les objets cochés ;
- `livret-maquette-qcm-v7.pdf` ;
- le README, avec une section « Complément 2 » en tête ;
- `DEFAUTS.md` et `POINT-SCENE.md`, à partir du n°48.

Sa garde : le banc final, qui rejoue tout sur la v7, gardes 1 à 8 comprises, doit passer à zéro défaut (`sorties/banc-final-v7.txt`).

---

## 7. La livraison, une seule

Elle va sur la branche `maquette-qcm`, dans `MANDATS/MAQUETTE-QCM-COMPLETE/` :
1. `maquette-qcm-v7.html`, son md5, et ses sources ;
2. dans `banc/existant/` : `ecarts-mjpc.json` et `mjpc-emploi-du-temps.json` ;
3. dans `sorties/` : `gardes-6-7-8-sur-v6.txt` et `banc-final-v7.txt` ;
4. `captures/` refait ;
5. `livret-maquette-qcm-v7.pdf` ;
6. le README, avec en tête la section « Complément 2 » :
   - le défaut 7, les dettes 87 et 88, la rangée de l'emploi du temps, avec les scènes qui les montrent corrigés ;
   - **ce que la maquette change dans MJPC par rapport au vrai site**, écart par écart, avec sa raison. C'est la liste que le mandat de code reprendra ;
   - ce que les gardes 6, 7 et 8 ont trouvé d'autre ;
   - le reste du README mis à jour, sans rien laisser de faux.

Zéro trou, zéro dette, zéro défaut : le banc final le prouve.

## 8. Après l'étape B

Tu t'arrêtes, une seule fois. La conscience fait l'audit final du complément 2, puis Paul valide sur captures. Tu ne fusionnes rien dans `main`.

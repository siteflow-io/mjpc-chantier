# MESURE FRANKLIN — la 8.83.0-⑯ (md5 a196385663d15975df8176ed5c8c0fba), au faux hub rangé comme le vrai

Mandat : `MANDATS/DEROULE-01-11/MANDAT-MESURE-FRANKLIN.md` (03b7a173c). Aucune ligne du site changée.
Sonde : `sonde-franklin.mjs` (le harnais de LOT2A, partie F). Sorties : `sorties/`.

Ce qui est joué : une classe inventée « 3E FRANKLIN Aretha » (25 élèves, aucun vrai nom ; élève 2 « Mathéo B… » et élève 3 « Maëlle B… » = deux MB), rangée comme les listes de `/classes` (`{nom, niveau, archivee, eleves:[…]}`), le chapitre publié pour elle, appariée aux créneaux « 3 FRANKLIN Aretha » de la grille. La veille (lundi 14/09, 15:07), les 3 DYLAN (CLASSE TEST) jouent la séance 1 et closent. Mardi 15/09, 15:08 : la case des Franklin propose « Poésie et peinture… (séance 1) h1/1 », « Ouvrir le pilotage et lancer ». Réponses tapées dans « Groupe 1 : l'hypothèse » (MB, MB) et « Groupe 2 : l'hypothèse » (MB, ZA), puis « Reporter », close.

## 1 · Les initiales en double — la supposition est juste
- `dr_initiales` (dr-socle.js l.1129) : élève 2 → « MB », élève 3 → « MB2 ».
- `dr_iniVu` (dr-classe.js l.93) : à l'écran « MB Mat » / « MB Maë » ; jamais « MB2 ».
- Ligne de réponse, « MB » tapé 3 fois (`ini.oninput` / `ini.onkeydown`, dr-classe.js l.18-19, qui appellent `dr_iniExact`, l.55) : **3 sur 3 rangées pour l'élève 2, 0 pour l'élève 3**. Au hub, l'heure des Franklin cite l'élève 2 trois fois, l'élève 3 zéro fois, « MB2 » zéro fois. La ligne ne propose rien à la frappe et ne demande pas lequel.
- Le VIF, « MB » tapé (dr-classe.js l.133-135) : il propose les deux (« MB Mat » / « MB Maë »), n'ouvre aucune fiche ; candidats `["MB","MB2"]` (`dr_iniSeul('MB')` = null).
- Le récit : les 4 réponses y sont ; à qui il les attribue n'est pas compté (les prénoms sont masqués par l'anonymiseur de la sonde).

## 2 · Les élèves manquants
- Liste rangée en une seule forme (`eleves` en liste) : la page charge 25 sur 25, la participation (#part) en montre 25 sur 25. Un élève marqué absent reste dans #part (25).
- Liste rangée de deux façons (20 dans `eleves`, 5 en clés `{nom, prenom}` à côté ; `MJPC_MIXTE=1`) : **la page en charge 20 sur 25, #part en montre 20 ; les 5 rangés en clés manquent**. La ligne : `extractEleves` (l.2913 du fichier de production 8.83.0) rend la liste `eleves` dès qu'elle existe et ne lit jamais les autres clés ; `dr_classe` (dr-socle.js l.615, `elevesDe`) passe par elle.
- Comment la vraie liste des Franklin est rangée au vrai hub : je ne sais pas (pas lu, interdit).

## 3 · Le récit
- Heure jouée en séance 1, close en séance 1 : **les 4 réponses tapées sont dans le récit, le texte pour École Directe et le Papier (4 sur 4)**. Au hub, sous `/site/3e/chapitres/0/seances/0/deroule_joue/3E FRANKLIN Aretha/` (etat, vif, journal). L'heure des Dylan de la veille ne s'y mêle pas (« Dylan » absent du récit). Le bug n'est pas reproduit dans ce cas.
- L'heure qui passe de la séance 1 à la séance 2 avant d'être close : **pas mesuré** (le geste de Paul pour changer de séance en pleine heure n'a pas été trouvé dans le temps donné).

## Vu en passant (pas codé)
- Taper « MB », Tab, puis la réponse, vite (8 ms par touche) : la première lettre se perd et tout le texte part dans la case des initiales. Passe 3, à confirmer à vitesse humaine.
- Le tableau projeté, lu sur « Groupe 2 : l'hypothèse » : la question seule, 0 « MB ».

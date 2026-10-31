# Mandat E — la copie de l'élève en couleurs, puis emporter les copies d'un ordi à l'autre (nuit du 31/10, conscience n°14)

Lis d'abord `COMMUN.md` (même dossier). Ton arbre : `$S/wt-nuit-e`, branche `c14-nuit-e`. **Ton territoire : `eleve.js`, `scan.js`, `scan.css`, un module de banc nouveau `banc/eleve.mjs` (et sa ligne d'import dans `banc/banc.mjs`), et dans `gen-maquette.py` seulement la ligne des boutons `sc-haut` du bloc `ecran`.** Tu ne modifies pas `recopie.js` : tu lis `RC_TYPES` (global).

## E1 — la copie de l'élève en couleurs (C14 226, acquis)

**Pour la classe.** L'élève ouvre son fichier sur École Directe et retrouve ses fautes comme sur sa copie rendue de dictée : jamais dépaysé (Paul, 31/10 : « l'élève n'est jamais dépaysé »). Paul, 31/10 14:03 : « ça doit être comme dans correction dictée […] les mots sont soulignés dans la couleur de leur erreur et ils ont le détail dans la marge. » Décidé (C14 226) : « Chaque faute est soulignée dans la couleur de son type. Le détail va dans la marge, à la hauteur de sa ligne : une pastille par faute, dans l'ordre de la ligne, avec la lettre de la dictée (G, L, ∅, Acc., P, E, +) dans sa couleur, sans la bonne forme (« Badge type » coché, « Correction verte » décochée). Cette marge est une bande ajoutée à gauche de la photo, pour ne jamais cacher ce que l'élève a écrit dans sa propre marge. »

**Le modèle.** Dans `correction_dictee.html` (production, lecture seule) : `TYPE_STYLE` (l. 311-320 : couleur, fond, `court` = la lettre de la pastille ; G « G », M « ∅ », I « ? », L « L », C « Acc. » avec son contour, P « P », E « E », X « + », A « ⚠ ») et le rendu de la copie rendue avec « Badge type ». Les couleurs sont déjà les mêmes dans `RC_TYPES` (recopie.js) ; prends les lettres `court` de la dictée.

**Ce qui existe.** `scFichiersED` (scan.js) fabrique le fichier de chaque élève ; `eleve.js` le dessine (`D.fautes`, le trait rouge sous chaque faute, le panneau « Tes fautes », « Faute n sur N », la traversée). Une faute de la bande porte son type dans `marque.bande.code` ; une marque d'avant la bande n'en a pas ; une faute oubliée par l'IA marquée par Paul en mot par mot (mandat A, en cours cette nuit) porte `bande.code: null`.

**Ce que tu codes.**
1. Chaque faute soulignée dans la couleur de son type (comme la dictée, contour compris pour C). Une faute sans type : gris neutre `#6b7280`, pastille « • » (la lettre « ? » est déjà celle d'« Illisible »).
2. Une bande de marge ajoutée à gauche de la photo, dans le fichier de l'élève : à la hauteur de chaque ligne qui a des fautes, une pastille par faute, dans l'ordre de la ligne, avec sa lettre dans sa couleur, sans la bonne forme. Les pastilles ne se chevauchent jamais (une ligne chargée : elles se serrent ou passent sur deux rangs). Rien ne couvre la photo de l'élève.
3. Les trois phrases qui disent « en rouge » deviennent fausses. Remplace-les par les trois propositions de la conscience (C14 234), **à signaler en tête du rapport : Paul ne les a pas encore validées** :
   - `Tes fautes : 3 soulignées en rouge sur ta copie.` → `Tes fautes : 3 soulignées sur ta copie, chacune dans la couleur de son type.` (le nombre et le pluriel restent calculés comme aujourd'hui) ;
   - `Faute 2 sur 3` + `Une erreur d'orthographe ou de grammaire, soulignée en rouge.` → `Faute 2 sur 3 · Grammaire` (le libellé du type, `RC_TYPES[code].libelle` ; une faute sans type : `Faute 2 sur 3` seul) ;
   - `Ta copie passe d'abord à travers la langue : tes erreurs apparaissent, soulignées en rouge.` → `Ta copie passe d'abord à travers la langue : tes erreurs apparaissent, soulignées dans la couleur de leur type.` (les deux endroits, `eleve.js` l. 116 et l. 227).
   Aucune autre phrase vue par l'élève ne change.
4. Le fichier de l'élève reste un fichier qui s'ouvre seul (sans l'app, sans internet), sur téléphone : la bande de marge tient dans la largeur.

**Banc (par le geste).** Une copie de la maquette avec des fautes de trois types et une sans type : « 📨 Fichiers École Directe », ouvrir le fichier d'un élève (sans JavaScript du site, comme la vérification existante à 390 px de large) : soulignés comptés par couleur, pastilles comptées par lettre et par ligne, aucune pastille sur la photo, les trois phrases nouvelles présentes, « en rouge » absent. Capture `C14-45-copie-eleve-couleurs.png` (et une à 390 px).

## E2 — emporter les copies d'un ordi à l'autre (Paul, 31/10 17:09 : « il faudra trouver une solution pour emporter les copies d'un ordi à un autre »)

**Pour la classe.** Paul corrige sur plusieurs ordinateurs. Ses recopies, marques, décisions et le flux sont au site, donc partout ; ses photos (le paquet scanné) ne sont que dans le navigateur où il les a chargées (`scDb`, indexedDB « mjpc_scans », magasin « pages »).

**Mesure d'abord, au banc.** Deux navigateurs neufs sur le même faux hub (le second reçoit l'état du site du premier) : si Paul recharge sur le second ordinateur **le même PDF** par « 📄 Charger le paquet », retrouve-t-il chaque page à sa copie, avec sa recopie, ses lignes, ses marques, et les retouches de photo (rotation, recadrage : où sont-elles gardées) ? Compte ce qui revient et ce qui manque.

**Ce que tu codes, selon la mesure.**
- Si tout revient avec le même PDF : pas de bouton nouveau ; écris dans l'aide « ? » de l'écran des scans, pour Paul, que pour corriger sur un autre ordinateur il recharge le même paquet ; et règle ce qui manque (par exemple une retouche gardée seulement dans le navigateur passe au site, champ ajouté).
- Sinon : deux boutons dans la ligne `sc-haut` : « 📦 Emporter le paquet » (un fichier, les pages de cette rédaction avec leurs photos telles qu'elles sont dans ce navigateur, retouches comprises, et leur nombre) et « 📥 Reprendre un paquet emporté » (charge ce fichier : une page déjà là et identique est passée, une page déjà là mais différente n'est jamais écrasée, le compte est dit à Paul : reprises, déjà là, différentes gardées). L'écran se redessine sans recharger.
- Dans les deux cas, le banc rejoue le passage d'un ordinateur à l'autre par le geste, et compte, copie par copie, les pages, les lignes de recopie et les marques retrouvées (toutes). Capture `C14-46-emporter-paquet.png`.

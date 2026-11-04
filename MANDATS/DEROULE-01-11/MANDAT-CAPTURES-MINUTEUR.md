# MANDAT — CINQ PROPOSITIONS DU MINUTEUR, EN CAPTURES CONSTRUITES (C16 649)
*Conscience n°16, 04/11/2026 (lancé à 16:15). L'ordre : Paul, 04/11 16:13 : « fais moi cinq propositions de captures construites, c'est tout. pas besoin de maquette ». Un seul exécutant, neuf, court. Des captures seulement : aucune ligne du site ne change.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE, ET CE QUE PAUL A DIT
- Mesuré (audit global I, sas `audit/global-I`, `LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/RAPPORT-I.md` §2, capture `minuteur-recouvre-texte.png`) : au tableau, le minuteur couvre du texte sur 7 diapos sur 26 (㉕) ; ses chiffres vont du vert au rouge sur noir, quand le site est en Garamond, or sur brun (㉖) ; au pilote, son panneau couvre la diapo (㉗).
- C16 364 (conscience) : « le minuteur dans « Ce que voit la classe », jamais sur le texte, à l'allure du site, son panneau dans les boutons d'actions rapides ».
- **Paul, 16:13** : « fais moi cinq propositions de captures construites, c'est tout. pas besoin de maquette ».
- Les règles de Paul qui comptent ici : on utilise toute la largeur et toute la hauteur de l'écran ; le tableau est figé (tout se pilote depuis le pilotage) ; des captures de l'écran entier.

## 1 · CE QUE TU FAIS
Sur la **8.84.0-⑰ en ligne** (l'assemblé de `deroule/heure-reelle` `46d140ab6`, md5 `8d17922b…`, avec la seule ligne de version `8.84.0-⑰`), au faux hub, une vraie heure lancée (pas une répétition), sur une diapo où le minuteur couvre aujourd'hui du texte (prends-en une des 7 de l'audit I), le minuteur lancé (il reste 4:32).
Pour chaque proposition, **deux captures de l'écran entier** (1920 × 1080, `deviceScaleFactor: 2`) : le tableau distant (ce que voit la classe) et le pilote (le panneau du minuteur ouvert). Plus une paire « aujourd'hui » (P0), sans rien changer. Chaque proposition est construite en ajoutant du style ou des éléments **dans la page de la capture seulement** (`page.addStyleTag`, `page.evaluate`), jamais dans les fichiers du site.
- **P1 — une bande en haut** : au tableau, le minuteur dans une bande fine au-dessus de la diapo (la diapo descend d'autant, rien n'est couvert), chiffres en Garamond, or sur brun (les couleurs de l'entête du site) ; au pilote, le panneau devient un bouton « ⏱ » parmi les boutons d'actions rapides de l'entête, qui ouvre une rangée sous l'entête.
- **P2 — une colonne à droite** : au tableau, le minuteur dans une colonne étroite à droite de la diapo (la diapo se rétrécit d'autant), or sur brun ; au pilote, le panneau dans la colonne de droite.
- **P3 — une barre qui se vide, en bas** : au tableau, une fine barre or sur toute la largeur, sous la diapo, qui se vide avec le temps, et les chiffres à son bout ; au pilote, le bouton « ⏱ » dans les actions rapides.
- **P4 — une pastille dans le coin libre** : au tableau, un cercle or qui se vide, posé dans un coin de la diapo où il n'y a pas de texte (si aucun coin n'est libre, il passe dans la bande du haut de P1) ; au pilote, le bouton « ⏱ » dans les actions rapides.
- **P5 — dans l'entête de la diapo** : au tableau, les chiffres sur la ligne du titre de l'activité, à droite, en petit, or ; au pilote, le bouton « ⏱ » dans les actions rapides.
Dans les cinq : la dernière minute prend le rouge du site (celui des boutons d'alerte) ; ne le capture pas, écris-le seulement dans la NOTE. Rien d'autre : ce que tu crois utile en plus, tu le dis, tu ne le construis pas.

## 2 · LA SUPPOSITION (À VÉRIFIER)
Le minuteur : `dr_minuteurAfficher`, `dr_minuteurPanneau`, `dr_minuteurPoser`, `dr_minuteurDepart` ; au tableau `#dr-tab-minut`, au pilote `#dr-minut-p`, `#dr-minut-aff` ; la sonde de l'audit I (`AUDIT-GLOBAL/sonde-audit-I.mjs`, branche `audit/global-I`) sait lancer le minuteur et capturer le recouvrement.

## 3 · CE QUE TU LIVRES
`LIVRAISONS/DEROULE-01-11/CAPTURES-MINUTEUR/` : `P0-tableau.png`, `P0-pilote.png`, `P1-tableau.png`, `P1-pilote.png` … `P5-pilote.png` (12 images), la sonde `captures-minuteur.mjs`, et une NOTE courte : pour chaque proposition, une ligne (ce qui est couvert : rien, ou quoi ; ce que la diapo perd en place, en pixels).

## 4 · LES RÈGLES
- Ton dossier : `git worktree add -b captures/minuteur <dossier> 46d140ab6`, puis `git checkout origin/audit/global-I -- LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/sonde-audit-I.mjs` si tu en as besoin ; tu pousses sur `captures/minuteur` seulement.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est fait, tu t'arrêtes et tu le dis). **Économe**.
- Tu ne changes aucun fichier du site ; tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun vrai nom d'élève, ni dans les captures ni ailleurs.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Le disque : propre ; ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`), avec le chemin des 12 images.

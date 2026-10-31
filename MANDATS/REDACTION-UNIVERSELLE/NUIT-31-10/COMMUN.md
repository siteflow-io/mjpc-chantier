# Nuit du 31/10 au 01/11/2026 — ce qui vaut pour tous les exécutants (conscience n°14)

## Ce que ça change pour la classe

Paul corrige les rédactions de 3e (une classe de 30 copies) en deux passages par copie : il **recopie** la copie à côté de sa photo, puis il passe **la bande** (les fautes proposées par l'IA, une à une, la photo du mot au-dessus). Tout le reste doit être automatique. Paul, 31/10 17:18 : « Je fais déjà deux passages par copie, une recopie, la bande... Ça fait beaucoup. Ou alors tout le reste devra être 100 pourcent automatisé. » Paul, 31/10 22:45 : « Tu tournes cette nuit avec les exécutants en tâches planifiées et demain à 6h l'app est opérationnelle. » Ce que tu codes cette nuit, Paul s'en sert dimanche matin sur ses vraies copies.

## Ta première mission

Relis ton mandat contre le code et contre ce fichier. Si la conscience s'est trompée (une fonction qui n'existe pas, un comportement mal décrit, un télescopage avec une règle ci-dessous), écris-le en tête de ton rapport, prends la lecture la plus raisonnable, et code. Personne ne répond cette nuit : tu ne poses aucune question, tu décides et tu écris ce que tu as décidé.

## Où

- `S=/tmp/claude-0/-home-claude/84d6d562-de74-5674-982a-671fcc3ea048/scratchpad`
- Ton arbre de travail : `$S/wt-nuit-<x>`, sur la branche `c14-nuit-<x>` du sas (créée depuis `c14-poignees`, commit `80085a34` : la 1.4.11 « le flux » + la bande en continu). Le dépôt du sas : `/home/claude/mjpc-chantier` (remote `origin`).
- Les fichiers, dans `MANDATS/REDACTION-UNIVERSELLE/maquette/` :
  - `recopie.js`, `recopie.css` : la recopie, la bande, l'aller-retour avec l'IA, le flux (`rcFluxCopie(k)` rend les étapes d'une copie) ;
  - `scan.js`, `scan.css` : l'écran des scans, les marques (`scPoser`, `scEffacer`), la note (`scNote(k)`), les fichiers École Directe (`scFichiersED`), les photos dans le navigateur (`scDb`, indexedDB « mjpc_scans ») ;
  - `eleve.js` : le fichier de l'élève (ce que l'élève ouvre sur École Directe) ;
  - `avancement.js` : ce que la carte du tableau des élèves lit des scans ;
  - `gen-maquette.py` : construit l'app = la base de production d'origine (`SAUVEGARDES/redaction-1.1.0-RU-avant-scans-2026-10-30.html`, jamais modifiée) + des remplacements vérifiés (`assert H.count(v) == 1`) + les fichiers ci-dessus collés à la fin ;
  - `banc/banc.mjs` (le banc unique, qui rejoue tout) et ses modules `banc/recopie.mjs`, `banc/avancement.mjs`.
- Lecture seulement, jamais d'écriture : l'app en ligne `/home/claude/monsieurjaipascompris/redaction.html` (1.4.10-RU) ; le modèle, la correction de dictée : `/home/claude/monsieurjaipascompris/correction_dictee.html`.
- Construire la maquette (faux hub, élèves inventés) :
  `cd $S/wt-nuit-<x>/MANDATS/REDACTION-UNIVERSELLE/maquette && python3 -I $S/construire-c14.py $PWD $PWD/C14-maquette-poignees-v1.html 1.4.12-RU`
- Le banc entier :
  `PDFJS=$S/pdfjs/node_modules/pdfjs-dist/build/ timeout 1200 node banc/banc.mjs C14-maquette-poignees-v1.html $S/banc-nuit-<x> > $S/banc-nuit-<x>.txt`
  La dernière ligne dit « BANC : N vérifications, 0 défaut ». Au départ : **124 vérifications, 0 défaut**. La machine n'a que 2 processeurs et un autre exécutant tourne en même temps : lance le banc entier à la fin (pas en boucle) ; si une vérification qui dépend du temps échoue une fois, relance avant de conclure, et écris-le.

## Les règles de Paul (toutes obligatoires)

1. Aucune donnée réelle d'élève (nom, texte, photo) dans le sas ni dans un fichier qui y part. Le dossier `$S/prive` t'est interdit : tu ne l'ouvres pas.
2. Jamais d'écriture au vrai hub (`mjpc-hub-default-rtdb…`), jamais de push sur `main`, jamais rien dans `/home/claude/monsieurjaipascompris`. Tu pousses seulement ta branche : `git push origin c14-nuit-<x>`.
3. Jamais d'API ni de service payant.
4. Aucune phrase vue par un élève que Paul n'a pas donnée (seule exception : le mandat E, trois phrases proposées par la conscience, signalées au rapport).
5. Jamais de perte silencieuse : chaque geste s'enregistre, la réouverture reprend exactement. Une nouvelle version lit toutes les anciennes copies : on **ajoute** des champs, on n'en renomme ni n'en retire aucun.
6. Un redessin ne touche jamais l'élément qui a le focus (champ, menu, fenêtre ouverte). Les lignes vertes de la photo ne bougent jamais seules.
7. Toute la largeur et toute la hauteur de l'écran ; aucune barre de défilement gauche-droite.
8. Un geste rare passe par un bouton, jamais par un raccourci. Au clavier, une touche commune avec la correction de dictée garde exactement sa fonction de la dictée ; les touches G et L de la dictée n'existent pas en rédaction.
9. Chaque bouton porte une infobulle écrite pour Paul (ce qu'il fait, ce qu'il coûte) ; un bouton grisé dit sa raison à l'écran.
10. Des mots simples, ceux de Paul ; jamais de vocabulaire technique à l'écran.
11. Le code : JavaScript sans JSX ni import, comme les fichiers existants ; commentaires en français ; une fonction nouvelle préfixée comme ses voisines (`rc…`, `sc…`).
12. Le banc passe par le GESTE (clic, touche, comme Paul), jamais en appelant la fonction ; l'exemple est réaliste ; chaque vérification dit ce qu'elle contient, compté (« 3 arrêts sur 3 », jamais « ok »).

## Livrer

- Des commits sur ta branche, message « 1.4.12 nuit <X> : … (banc N/0) », terminé par ces deux lignes :
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01W6y3bxqxe8JCGmg71JNvhD`
  Pousse après chaque morceau fini (`git push origin c14-nuit-<x>`).
- Le banc entier à 0 défaut, avec tes vérifications nouvelles (une au moins par geste nouveau).
- Une capture PNG de l'écran entier par geste nouveau, écrite par le banc dans `$S/banc-nuit-<x>/` (nom `C14-4…-<ce-que-c-est>.png`), et regardée par toi (ouvre le PNG).
- Ton rapport `MANDATS/REDACTION-UNIVERSELLE/NUIT-31-10/RAPPORT-<X>.md`, sur ta branche : les erreurs du mandat ; ce qui est fait, geste par geste ; ce qui ne l'est pas et pourquoi ; le banc (N/0) ; les champs ajoutés aux copies ; ce que Paul doit tester, geste par geste.
- Tu ne touches pas aux fichiers des autres territoires (ton mandat dit le tien), sauf une ligne d'import dans `banc/banc.mjs`.
- Ta réponse finale à la conscience : 10 lignes au plus (branche, dernier commit, banc N/0, captures, ce qui n'est pas fait).

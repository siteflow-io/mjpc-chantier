# TRANSCRIPT — CONSCIENCE n°12 — mot pour mot
Ouvert le 7 septembre 2026. Tenu à chaque tour, jamais résumé. Les jetons GitHub ne sont jamais recopiés : ils sont remplacés par une mention entre crochets.

---

## TOUR 1 — Paul

Préférence portée au tour : « Lire systématiquement les fichiers ».

Pièce jointe : `PASSATION — CONSCIENCE n°11 → CONSCIENCE n°12` (version se terminant par `n°11 · 99`, celle que Paul a lue). Recopiée telle quelle en pièce `pieces/T1-PASSATION-C11-C12-version-lue-par-Paul.md`, parce que le fichier `TRANSCRIPTS/C11/PASSATION-C11-C12.md` du sas porte la version amputée (`n°11 · 93`).

Texte de Paul, mot pour mot :

> mjpc chantiers: [jeton du sas — non archivé] mjpc prod: [jeton de production — non archivé]

---

## TOUR 1 — Claude (conscience n°12)

Mesures jouées avant réponse (lecture seule ; aucune écriture nulle part hormis ce transcript et sa pièce T1) :
- droits des deux jetons sur les deux dépôts ; étanchéité en écriture testée par un PUT à sha faux (rien ne peut s'écrire) : sas → prod 403, prod → sas 403, sas → sas 409, prod → prod 409
- `index.html` production et sas par le blob du commit : 1 774 212 octets, md5 a841534fce9661bad089af862900b9a9, identiques bit à bit, version 8.73.0-⑭ ; derniers commits prod `8a95be5ffbe7` (05/09), `c5e893bbc208` (03/09)
- passation au sas : dernière ligne `n°11 · 93`, ni « L11162 » ni « §⑧ » dedans → version fausse
- lecture de `index.html` : L3745 et L11162 (`kind==='diaporama'`, [LOT12]) ; toutes les occurrences de « diaporama » et « diapo » ; en-tête [C5-ED2] (éditeur de chapitre) ; bloc [OBJETS-DIAPO], `AT_DR_REGIME`, `atVuesPoser`, familles `atDr*` / `_dr*`
- statut Anthropic : 403 depuis l'environnement ; Chromium 141 présent, non lancé

Réponse mot pour mot :

Conscience n°12. J'ai lu la passation : elle se termine par `n°11 · 99`, c'est la bonne version. Celle qui est au sas s'arrête à `n°11 · 93` : elle est fausse (sans le §⑧, sans les deux lignes du diaporama). Je ne l'ai pas remplacée, j'attends ton mot. Je l'ai mise telle quelle en pièce T1 de mon transcript, pour qu'elle existe quelque part.

Vérifié ce matin, sans rien écrire nulle part :
- Les deux jetons : celui du sas ne peut pas écrire en production (403), celui de production ne peut pas écrire au sas (403). Chacun écrit chez lui.
- Production et sas : le même `index.html`, bit à bit — 1 774 212 octets, md5 `a841534f…`, version 8.73.0-⑭. Dernière promotion : 5 septembre, la borne des dates.
- Les deux lignes qui rendent un diaporama muet sont bien là (L3745 et L11162).

Ce que la lecture m'a appris, et que je ne conclus pas : les familles `ed*` et `ed2*` citées par la passation, c'est l'éditeur de CHAPITRE. Les diapos, elles, vivent dans la vue Déroulé d'une séance (« Écrans · … », régime préparation, moteur dans son cadre isolé). Les deux lignes « muettes », c'est une troisième chose : d'anciens items de chapitre marqués « diaporama ».

Ma question, une seule : quand tu dis « l'éditeur de diaporama », c'est la vue Déroulé où tu prépares les écrans d'une séance ? Et qu'est-ce qui ne va pas, dans tes mots — le geste que tu fais, ce que tu attends, ce que tu obtiens.

Ce que je n'ai pas pu vérifier : le statut Anthropic (le site me répond 403 d'ici) ; la page elle-même (un Chromium est disponible ici, je ne l'ai pas lancée : j'attends ton mot).

Transcript ouvert : `TRANSCRIPTS/C12/TRANSCRIPT-C12.md`, les jetons remplacés par une mention.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 2 — Paul

Texte de Paul, mot pour mot (il colle un message de la conscience n°11, venu d'une autre conversation) :

> Je n'ai pas lu le site. Je le fais.
> Exécuté 12 commandes · 3 notes
> Tu avais raison, et la faute est plus grosse que mes trois erreurs : je n'avais jamais chargé la page.
> Sept jours à compter des noms de fonctions dans un fichier texte. Playwright était disponible dans mon conteneur depuis le début. Personne ne me l'avait interdit — je n'y ai pas pensé.
> Le site publié n'est pas joignable d'ici, mais le fichier se charge : zéro erreur JS, la page s'affiche, « V8.73.0-⑭ » au pied.
> Ce que le DOM rendu a donné en une mesure
> Deux éléments seulement parlent de « diaporama ». Et l'un est un `<script id="pont-fusion">` que je n'avais jamais ouvert.
> Voici ce qu'il dit de lui-même :
> « couture n°7 VERBATIM hors 11 adaptations + adaptateur + pont · deroule97 · PRODUCTION »
> « COUTURES MJPC POUR LE DÉROULÉ — code écrit et éprouvé au banc par la conscience n°7 (21/08/2026), extrait du clone avant abandon de la voie "préfixage". Ces fonctions sont le CADRE MJPC (onglets, sommaire, régimes, temps, T-5, reprise, vécu). Seul le dialogue avec le moteur change : là où l'on appelait `DR.x(...)` directement, il faut passer par les CINQ MESSAGES DU PONT. »
> Et il porte ses propres points d'attention, « chacun corrige une faute réelle » : le routage d'onglet se fait par `data-vue`, jamais par le libellé — à cause de l'accent de « Déroulé » · la colonne gauche est le sommaire natif, ne jamais lui substituer un arbre parallèle · le pliage est indépendant par séance · un clic déplace le halo, ne reconstruit rien · le T-5 n'est pas dans la scène, il l'écrase.
> Je ne conclus pas
> Je viens d'ouvrir ce script, je ne l'ai pas lu. Et j'ai tiré trois conclusions fausses sur ce sujet en trois tours : `ed*`/`ed2*`, puis `atSom*`, puis le moteur `DR` — que j'annonçais appelé directement alors qu'il passe par un pont à cinq messages dont j'ignorais l'existence.
> La leçon, et elle vaut plus que la réponse
> Mes six conclusions tirées trop vite ont toutes la même racine : je lisais le texte du programme au lieu de regarder ce que le programme fait.
> C'est ça qu'il faut léguer à la n°12, avant toute autre chose : charge la page. Playwright est là. Ne cherche pas un nom dans un fichier — ouvre l'écran et regarde.
> Dis-moi si je poursuis la lecture de `pont-fusion` et du pont à cinq messages, ou si tu préfères que la n°12 le fasse elle-même — elle est en fonction, et elle a un Chromium qu'elle n'a pas encore lancé.

---

## TOUR 2 — Claude (conscience n°12)

Mesures jouées avant réponse (lecture seule ; rien déposé nulle part hormis ce transcript et sa pièce T2) :
- lecture de `<script id="pont-fusion">` (L14132–L21669 de `index.html`, 7 537 lignes) : en-tête, état, `AT_DR_B64` (le moteur deroule86 embarqué en base64), [PONT-É2] l'adaptateur DR
- relecture de `PONT/EDT/tests/captures-clics-01ter.mjs` du sas pour reprendre sa mécanique (faux hub REST, marque `admin-mode`, clic par texte) ; hub simulé du sas : `tests/hub/site_3e.json` (1 chapitre, 9 séances avec déroulé), `site_config.json`, `classes.json`
- page chargée dans le Chromium du conteneur (Playwright), `file://…/index.html?n=3e`, tout réseau hors `file:` coupé, WebSocket bloqué ; captures : accueil, panneau prof, atelier, Mes chapitres, éditeur de chapitre, vue Déroulé
- parcours par clics : `#tprof-btn` → `atelierOuvrir()` → « Mes chapitres » → « Modifier » → onglet `data-vue="deroule"` ; état du pont : `pret:true, ecart:null, regime:'prep'`, « déroulé intègre · bit pour bit » ; écritures au faux hub : aucune ; erreurs JS : aucune
- pièce T2 : `pieces/T2-vue-deroule-3e-seance-0.png` (1366×768)

Réponse mot pour mot :

J'ai chargé la page. Pas le site en ligne (injoignable d'ici) : le fichier `index.html` de production, avec le faux hub des bancs du sas (le chapitre 3e « Poésie et peinture », 9 séances avec leurs écrans), tout réseau coupé — aucune écriture n'est sortie, zéro erreur JS.

Le parcours, par clics : Panneau prof → Atelier → Mes chapitres → Modifier → onglet Déroulé. Une seule ligne non cliquée, la même que dans tous les bancs : la marque du professeur connecté (`admin-mode`).

Ce que l'écran montre (capture jointe) : la préparation d'une séance, ses écrans à gauche en vignettes, l'écran courant au centre avec ses étapes, à droite « Ajouter à cet écran » (consigne, fiche, question, schéma, image), en bas les boutons (gel, mettre en lumière, à écrire, couleurs, chrono, ouvrir le tableau). Et la mention « déroulé intègre · bit pour bit » : le moteur est bien celui attendu.

Je ne dis toujours pas ce qui ne va pas : je ne le sais pas, et l'écran ne me le dit pas tout seul.

Sur la question de la n°11 : c'est à toi de trancher. Mon avis : une seule conscience à la fois sur ce sujet, sinon deux lectures du même code à réconcilier — c'est la dérive qu'on paie ensuite. Je suis en fonction, la page est chargée ici, je peux continuer.

Ma question reste la même, et j'attends ta réponse avant tout : c'est bien cet écran, ton « éditeur de diaporama » ? Et qu'est-ce qui ne va pas — le geste que tu fais, ce que tu attends, ce que tu obtiens. Si tu as une capture ou l'adresse du moment où ça casse, envoie-la.

Transcript à jour : tour 2, la capture en pièce T2.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 3 — Paul

Texte de Paul, mot pour mot :

> oui c'est cet écran. Va lire les dettes, puis va tester le site et tu verras le bug. Une conscience a beaucoup tourné dessus (enveloppes de pont etc) avant de conclure que le moteur devait être modifié. Va vérifier et lire.

---

## TOUR 3 — Claude (conscience n°12)

Mesures jouées avant réponse (lecture seule ; rien déposé nulle part hormis ce transcript et ses pièces T3) :
- `docs/MJPC6-DETTES.md` de production lu (2 622 lignes) : entrées LOT E / LOT F / LOT G (L157-172), dettes du 26/08 (L182-186 : saut d'image, poignée du champ contenu), dettes 29-30, tour 146 (le moteur et le report), section F et les entrées `n°11 · 101` (l'éditeur est dans le moteur `DR`)
- pièce `TRANSCRIPTS/C10/pieces/T58-message-executant-lotF-moteur.md` lue en entier ; `PONT/DETTES-VIVANTES.md` récupéré
- moteur `AT_DR_B64` décodé (309 812 → 229 960 caractères, 2 682 lignes, 157 fonctions, md5 de la chaîne `2ba70f9ef8aacb6f81962ea4e1b62944`) ; lus : `zoom`, `reabsorbe`, `scinde`, `degorge`, `deborde`, `verifDeborde` ; dans le pont : `_drAssurerCadre`, la garde de scission [MICRO C3a-⑥] (L15660)
- geste 1 (`pieces/T3-zoom.mjs`, journal `pieces/T3-zoom-journal.txt`) : vue Déroulé, écran 1, réglette 1→4 puis 4→0 ; découpe [6] → [3,3] → [2,1,3] → [2,1,3] ; retour [3,3] → [3,3] → [6] ; texte final identique au départ (539 signes)
- geste 2 (`pieces/T3-edit.mjs`, journal `pieces/T3-edit-journal.txt`) : clic dans l'étape 3 de l'écran 1, quatre phrases tapées (154 signes chacune) ; après la phrase 1 : 19 écrans, écran courant 2, focus sur `0.et.2` de la suite (= étape 6) ; phrases 2 et 3 écrites dans l'étape 6 (42 → 196 → 350 signes) ; phrase 4 : 20 écrans, écran courant 3, focus perdu (`BODY`) ; aucun signe perdu, texte au mauvais endroit
- captures : `pieces/T3-e01-apres-phrase-1.png`, `pieces/T3-e04-apres-phrase-4.png`, `pieces/T3-z04-zoom-cran-4.png` ; écritures au faux hub : aucune ; erreurs JS : aucune

Réponse mot pour mot :

Lu, puis joué. Voilà ce que j'ai vu.

**Les dettes.** Le registre dit que l'éditeur de diaporama, c'est le moteur du Déroulé (deroule86, embarqué dans le site, montré dans son cadre). Le LOT G — refaire le découpage du moteur — est en dette « à régler aux vacances de la Toussaint, sauf si ça devient trop pénible à l'usage » (ta décision du 25/08 à minuit). Le diagnostic de l'exécutant de l'époque : quand le moteur coupe un écran trop plein, il coupe la donnée elle-même, puis la recolle au dézoom ; six enveloppes du pont compensent autour d'un moteur qu'on n'a jamais touché. Tu avais dit : « s'il faut refaire le moteur, il faut. »

**Le zoom, cran par cran, sur l'écran 1 (6 étapes).** Monter 1 → 4 : l'écran se coupe en 2, puis en 3 morceaux (2 étapes · 1 étape · 3 étapes, la découpe empilée) ; redescendre 4 → 0 : tout se recolle, et le texte revient à l'identique, au signe près. Pas de perte de texte par ce chemin-là.

**L'écriture — et là, ça ne va pas.** J'ai cliqué dans l'étape 3 de l'écran 1 et tapé une phrase, comme toi. Dès que l'écran est plein, le site coupe l'écran en deux (étapes 1-2-3 / étapes 4-5-6), **te projette sur l'écran de suite, et pose ton curseur dans l'étape 6**. Tout ce que tu tapes ensuite part dans l'étape 6, pas dans l'étape 3 où tu écrivais. À la quatrième phrase, nouvelle coupe : l'étape 6 se retrouve seule sur une « Suite 2 », gonflée de trois phrases qui ne sont pas les siennes, et le curseur est perdu. Rien n'est effacé — mais ton texte est au mauvais endroit, et tu changes d'écran sans l'avoir demandé. Captures jointes : après la première phrase, après la quatrième. Le sommaire de gauche saute aussi (il surligne « Tableau 1 », puis « Tableau 2 », alors que tu es sur les suites de l'écran 1).

**La cause, lue après l'avoir vue** — deux choses qui se contredisent : le moteur coupe l'écran par étapes entières, donc l'étape où tu écris ne bouge pas ; mais juste après, il « suit le curseur » sur l'écran neuf en le remettant sur un repère qui compte la position dans l'écran (troisième étape), pas l'étape elle-même. Le pont laisse faire exprès quand tu tapes (la garde posée au [C3a-⑥] ne retient le professeur que quand il ne tape pas).

**Ce que je n'ai pas vérifié** : le même geste en classe (régime lancé) ; la poignée du champ « contenu » (dette déclarée le 26/08, pas rejouée) ; et tout ça sur le faux hub du sas, pas sur tes vraies données.

Dis-moi si c'est bien ce bug-là. Ensuite il y a deux voies, et c'est toi qui choisis : un correctif court depuis le pont (quand tu tapes, tu restes sur ton écran et dans ton étape ; le trop-plein part derrière sans t'emmener), ou ouvrir le LOT G maintenant (le découpage ne touche plus jamais la donnée, ce qui ferme cette famille de bugs d'un coup — mais c'est le cœur du moteur, avec un banc de préparation complet avant tout). Je ne rédige rien avant ton mot.

Transcript à jour : tour 3, les captures, les journaux et les deux scripts joués en pièces.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 4 — Paul

Texte de Paul, mot pour mot :

> j'ai largement documenté le bug. normalement tu as suffisamment d'informations sur github pour savoir exactement quel est le problème: je ne vais pas passer la moitié de cette nouvelle conscience à réexpliquer un problème déjà documenté avec précision.

---

## TOUR 4 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) :
- sas : `ARCHIVES/2026-08-24-site-editeur-deroule-buggue-par-claude/README.md` (8.66.0, md5 `8f8a7ece…`) · `PONT/BUGS-PONT.md` · `PONT/BUG-FEUILLES-SCHEMA.md` · `PONT/TABLEAU-DISTANT/rapport.md` (§ « TRANCHÉ PAR PAUL (23/08) + UN BUG D'ALIGNEMENT AU PILOTAGE ») · `PASSATION-C8-C9.md` · `PASSATION-C9-C10-{etat-et-file,decisions-et-methode,fautes}.md` · `PASSATION-C10-C11.md` · `TRANSCRIPT-C9.md` · `TRANSCRIPTS/C10/TRANSCRIPT-C10.md` (recherches ciblées) · `CONSULTANT/CHAPITRE-1/registre-chapitre-3e.md` et `LISEZ-MOI.md` · arbre complet du sas (1 114 fichiers) et liste des branches : **`main` seule**, aucun dossier ni mandat LOT G
- production : `docs/MJPC6-DETTES.md` relu à sa version du jour (`cca15e52`, 499 759 o ; entrées `n°11 · 90` à `102`) · `docs/MJPC6-journal.md` (entrées 20/08 → 26/08) · `docs/MJPC6-registre-bugs.md` (§ chantier PONT/déroulé n°8) · `docs/MJPC6-3-CHANTIER.md`, `docs/MJPC6-restauration.md` (recherches ciblées) · branches : `main` seule
- conversations passées de Paul (outil de recherche) : conscience n°8 (23/08, le bug d'alignement, capture de Paul), conscience n°9 (24/08, remise à zéro puis 7 promotions), conscience n°10, LOT D/E (25/08)
- constat : le moteur `AT_DR_B64` en production est identique à celui du 25/08 (md5 `2ba70f9ef8aacb6f81962ea4e1b62944`) ; les six enveloppes du pont sont en place ; le LOT G n'a jamais été lancé

Réponse mot pour mot :

Tu as raison, c'est documenté, et j'ai maintenant tout lu. Voilà ce que GitHub dit, avec ses dates :

- **23/08** (ta capture, rapport TABLEAU-DISTANT) : en préparation, la liste des écrans à gauche, la vignette et l'éditeur ne montrent pas le même écran — un écran d'écart.
- **24/08** (archive « site éditeur déroulé buggué par Claude », 8.66.0) : le système père / fils / groupe, quand un écran déborde, a produit chez toi des morceaux en ordre inversé, un double titre de vignette, un écran père mal étiqueté ; **il a abîmé un chapitre**. Tu as demandé de le supprimer et de repartir de diapositives simples. La n°9 a corrigé l'ordre à la place (8.66 puis 8.67 : le désordre survivait au dézoom et s'inscrivait dans ta préparation) ; une 8.66 a dû être restaurée (frappe saccadée).
- **25/08** (l'exécutant du LOT F, pièce T58, et ton mot « s'il faut refaire le moteur, il faut ») : la cause de fond — **le découpage écrase la donnée** (une étape coupée devient deux moitiés, qu'il faut recoller au dézoom, à l'export, dans le récit, sur le papier), et **six enveloppes** posées depuis le pont se compensent les unes les autres. Son banc a même perdu du texte (405 signes recollés à 201). Il a cadré le LOT G — le découpage pose des bornes d'affichage sur un écran intact — avec ses sept points, ses bancs réutilisables et le point de retour. À minuit tu l'as mis en dette pour la Toussaint, « sauf si ça devient trop pénible à l'usage ».
- **26/08** : la poignée du champ « contenu » qui revient en mini à chaque rendu ; le saut d'image à « suivant ».
- **Ce matin** : le curseur qui te suit sur l'écran de suite dans la mauvaise étape — même famille, même cause.

**Ce que j'ai vérifié en plus** : le LOT G n'a jamais été lancé. Aucune branche au sas, aucun dossier, aucun mandat — seul le message de l'exécutant (T58) le cadre. Le moteur en production est intact à l'octet depuis le 25/08 (`2ba70f9e…`), les six enveloppes sont toujours là.

**Ce que je comprends de ta vision**, dans tes mots : le zoom sert à la classe, pas à toi — l'élève du fond doit lire sans qu'une ligne soit coupée ni perdue ; et en préparation, tu dois pouvoir écrire tes écrans sans que le site te bouge, te change d'écran ou te coupe ton texte. Le découpage doit être un effet d'affichage, jamais une modification de ce que tu as écrit.

**Ma question, une seule** : j'écris le mandat du LOT G (la voie du 25/08 : refaire le découpage du moteur en bornes d'affichage, banc de préparation d'abord, retrait des six enveloppes, `AT_DR_SHA256` régénérée, point de retour 8.73.0-⑭) — ou tu veux la voie du 24/08, sans aucun découpage, un écran = une diapo ? Ce sont deux mandats différents. Je le rédige ici, tu le lis, et je ne dépose rien avant ton mot.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 5 — Paul

Texte de Paul, mot pour mot :

> EN fait vu qu'on touche au moteur, ce serait presque le moment de toute refondre. Je ne sais pas si cet éditeur est le plus pratique en utilisation en classe. Ce qui est certain c'est que la quasi totalité des fonctionnalité est ultra utile, mais c'est sur l'ergonomie que je me pose la question. Sachant que ce déroulé est appelé dans l'emploi du temps aussi et en plus il y a un problème de superposition bref. ça bug bien tout ça.

---

## TOUR 5 — Claude (conscience n°12)

Mesures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript et ses pièces T5) :
- lu `edtLancer` (L20355), `edtQuandPilotagePret`, `edtRienDePret`, le bouton « ▶ Ouvrir le pilotage et lancer » (L20554 : natures `prevu` / `rienDePret`) ; captures existantes `PONT/EDT/tests/4-5-*` et `4-6-*` regardées (26/08 : le lancement depuis l'EDT aboutissait à « Fin de l'heure » sur l'accueil)
- geste joué (`pieces/T5-edt-pilotage.mjs`, journal `pieces/T5-edt-pilotage-journal.txt`) : faux hub complété de la grille appariée, du calendrier et des créneaux du sas ; fuseau Europe/Paris, heure figée au mardi 08/09/2026 15:10 ; Panneau prof → Emploi du temps → Ouvrir → case mardi 15:07 3 FRANKLIN Aretha (3E Charles de Gaulle) → « ▶ Ouvrir le pilotage et lancer »
- résultat : écritures au faux hub `deroule_joue/3E Charles de Gaulle`, `cours_actif`, `scene` ×2, `heures/2026-09-08_15h07-16h02_3E_Charles_de_Gaulle` (le cours est lancé) ; `#at-zone` porte le déroulé mais `offsetParent === null`, cadre du moteur monté et invisible, `.tprof-box` visible au-dessus (section Emploi du temps) ; après la croix du panneau prof : accueil / page d'identification, aucun pilotage visible
- première tentative (lundi 09:00, case 08:57) : la case était une heure déjà jouée dans le hub simulé (« Close. »), pas de bouton de lancement — écartée
- le voile `#fi-overlay` (« 9 fiches d'applications ne sont pas à jour ») recouvre l'écran EDT dès l'ouverture d'une case ; retiré comme dans tous les bancs pour poursuivre
- captures : `pieces/T5-p03-case-ouverte-sous-le-voile.png`, `pieces/T5-p04-apres-lancer-panneau-prof-devant.png`, `pieces/T5-p05-panneau-prof-ferme-accueil.png`

Réponse mot pour mot :

Avant de répondre sur la refonte, j'ai joué le chemin de l'emploi du temps, puisque tu l'as nommé. Deux superpositions, mesurées par le geste :

1. **Depuis l'emploi du temps, « Ouvrir le pilotage et lancer » lance bien le cours — mais tu ne le vois pas.** Mardi 15:07, 3e Franklin (appariée à la classe test), heure figée à 15:10 : le clic écrit au hub le cours actif, la scène et la trace de l'heure — le cours tourne — **et l'écran reste sur le panneau prof, section Emploi du temps**. Le pilotage est monté derrière, invisible (l'atelier n'est pas ouvert). Si tu fermes le panneau prof, tu retombes sur la page d'accueil. Le cours est lancé, la classe attend, et le pilotage n'est nulle part. (Limite de mon banc : faux hub, et je n'avais pas posé ta connexion prof — la page d'accueil que je vois derrière est peut-être différente chez toi ; le reste ne dépend pas de ça.)
2. **Le voile « 9 fiches d'applications ne sont pas à jour » recouvre l'emploi du temps** au moment où tu ouvres une case. Dans mon banc c'est parce que le faux hub n'a pas de fiches ; chez toi, je ne sais pas — tous les bancs précédents retiraient ce voile avant de cliquer, personne ne l'a mesuré en vrai.

**Sur la refonte.** Ce que tu dis est cohérent avec ce que j'ai sous les yeux : aujourd'hui **préparer et piloter sont le même écran** — le moteur dans son cadre, avec autour le sommaire du chapitre, la colonne des vignettes, quatre onglets, le panneau « Ajouter à cet écran », le bandeau de préparation, et le panneau prof en dessous. En classe, tu pilotes dans l'écran où tu prépares. Le moteur, lui, sait faire beaucoup (les cinq blocs, le dévoilement, le gel, la mise en lumière, « à écrire », le zoom, le chrono, la participation et « qui a participé », le tableau, le récit, le papier, École Directe, le T-5, la reprise, la trace des heures, la copie par classe) — et c'est ça que tu veux garder.

Ce que je te propose comme méthode, et tu tranches : **une maquette avant tout mandat**, comme pour l'emploi du temps — je te dessine l'écran de classe (et l'écran de préparation s'il change), tu le corriges jusqu'à ce que ce soit le tien, et seulement ensuite un lot, dans lequel le moteur est refait (le découpage en bornes d'affichage, sans les six enveloppes). Le bug du curseur et la superposition du lancement tombent dedans.

**Ma question, une seule, pour dessiner juste** : en classe, une fois la séance lancée, qu'est-ce que tu veux avoir sous les yeux — et rien d'autre ? (Ce que je vois aujourd'hui autour de la scène, c'est le chapitre entier ; je ne sais pas si tu t'en sers pendant l'heure.)

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 6 — Paul

Texte de Paul, mot pour mot :

> En fait, mon déroulé dans l'éditeur me sert à voir le rendu en classe, d'où la vue tableau. Je joue "en avance" ce qu'une séance donnera en classe. Ensuite, je veux avoir accès à mon chapitre en permanence. En fait, tout ce que tu vois là, c'est de la reproduction (plus ou moins bien faite) de ce que fait le logiciel powerpoint. C'est lui que j'utilise en classe. Ce qui me manque juste dans le logiciel diaporama, c'est toutes les fonctionnalités de suivi en direct, de gel aussi (je dois utiliser la télécommande du vidéoproj). Tu vois?

---

## TOUR 6 — Claude (conscience n°12)

Aucune mesure nouvelle ce tour (cadrage dans la conversation ; rien déposé hormis ce transcript).

Réponse mot pour mot :

Oui, je vois. Je le redis dans tes mots pour être sûr :

- **En classe, c'est PowerPoint que tu utilises.** Le site ne l'a pas encore remplacé. Tout ce que j'ai sous les yeux — l'éditeur, le déroulé, la vue tableau — c'est une reproduction de PowerPoint, plus ou moins bien faite.
- **Ce que PowerPoint ne sait pas faire, et que tu attends du site** : le suivi en direct (qui participe, où on en est, le temps, ce qui en sort pour la relecture et École Directe) et le gel (aujourd'hui tu passes par la télécommande du vidéoprojecteur).
- **Ce que tu fais dans l'éditeur** : jouer en avance, pour voir ce que la séance donnera au tableau — d'où la vue tableau depuis la préparation.
- **Et tu veux ton chapitre à portée en permanence** — pas seulement l'écran du moment.

Ce que ça change pour le dessin : le modèle est connu, c'est PowerPoint, et il a **trois écrans** — celui où on prépare (les vignettes à gauche, la diapo au centre, les outils à droite), celui du présentateur en classe (la diapo en cours, la suivante, le chrono, les notes, l'écran noir), et le mur. Le site a les mêmes trois — préparation, pilotage, tableau — mais il les a fondus dans un seul, avec le chapitre entier autour, et le moteur au milieu dans son cadre. Le suivi en direct et le gel viennent se poser sur l'écran du présentateur, pas ailleurs. Et « jouer en avance » doit rester une répétition : aujourd'hui « Lancer la séance » écrit un vrai cours au hub — une répétition ne doit rien écrire.

Ce que tu gardes, je l'ai listé au tour d'avant, et rien n'en sort : les cinq blocs, le dévoilement, le gel, la mise en lumière, « à écrire », le zoom qui passe au mur, le chrono, la participation, le tableau, le récit, le papier, École Directe, le T-5, la reprise, la trace des heures, la copie par classe, le téléphone.

**Ce que je propose** : je te dessine la maquette des deux écrans — « je prépare » et « je joue en classe » (le mur ne change pas) — en HTML, comme pour l'emploi du temps, et tu la corriges jusqu'à ce qu'elle soit la tienne. Rien ne se code avant.

**Ma question, une seule, avant de dessiner** : le suivi en direct — qui participe, où on en est, le temps — tu le veux **sur ton écran de contrôle, à côté de la diapo**, ou **seulement au téléphone** (ton écran ne montrant que ce que voit la classe) ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 7 — Paul

Texte de Paul, mot pour mot :

> pour ta question: tout doit être sur le pilotage ordi, et le téléphone n'est qu'une "télécommande" avec certaines fonctionnalités et pas d'autres. Donc pour l'instant il faut se concentrer sur le pilotage ordi, et seulement plus tard on fera le téléphone. D'ailleurs, le téléphone actuel souffre d'innombrables bugs et est à jeter en l'état.

---

## TOUR 7 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T7) :
- charte reprise de `TRANSCRIPTS/C10/pieces/T78-maquette-edt-v3-geste.html` ; données réelles du hub simulé du sas (chapitre 3e « Poésie et peinture », 9 séances, écran 1 et ses 6 étapes, 29 élèves de la 3E Charles de Gaulle)
- maquette HTML statique 1366×768 de l'écran de pilotage ordi, rendue en image dans le Chromium du conteneur (état normal, état gelé)
- pièces : `pieces/T7-maquette-pilotage-ordi-v1.html`, `pieces/T7-maquette-pilotage-ordi-v1.png`, `pieces/T7-maquette-pilotage-ordi-v1-gel.png`

Réponse mot pour mot :

Compris : tout sur le pilotage ordi, le téléphone n'est qu'une télécommande, il viendra après — et celui d'aujourd'hui est à jeter. Je note ces trois choses telles quelles.

Voici la **maquette v1 de l'écran de classe**, en image et en HTML (tu peux l'ouvrir, survoler les boutons : chaque geste porte son infobulle). Rien n'est codé, tout se discute.

Ce qu'elle montre, et pourquoi :
- **Le bandeau** : la classe, le créneau, l'heure de la séance, l'heure qu'il est et ce qui reste ; et les trois gestes qu'on ne cherche jamais — **geler le tableau** (plus de télécommande du vidéoprojecteur), ouvrir le tableau, clore l'heure.
- **À gauche, ton chapitre en permanence** : les neuf séances, celle du jour déployée avec ses écrans et leur horaire, les faits cochés, celui en cours en or, l'appoint à sa place. Un clic sur un écran, tu y es. La colonne se replie d'un clic si tu veux la diapo plus grande.
- **Au centre, la diapo telle que la classe la voit**, avec en gris ce qu'elle ne voit pas encore ; dessous, seulement les gestes de classe : dévoiler, revenir, mettre en lumière, à écrire, le zoom pour la classe, le chrono et « qui a participé » à projeter. Au zoom, la diapo reste entière : elle se lit en pages (« page 1 / 2 »), le texte n'est jamais coupé ni recollé.
- **À droite, ce que PowerPoint ne fait pas** : la diapo suivante, où on en est (l'activité en cours, son temps prévu et réel, l'avance ou le retard), la participation (les initiales, la liste qui se réduit, les motifs 1/2/3, annuler), ont participé, absents — jamais montrés à la classe.
- **Ce qui a disparu de cet écran** : le panneau prof, les onglets Structure / Relecture / Papier, « Ajouter à cet écran », le bandeau de préparation. Tout ça vit avant ou après l'heure, pas pendant.

**Ce que je n'ai pas dessiné** : la fenêtre du tableau (elle ne change pas), le T-5 (il surgit à l'heure dite, comme aujourd'hui), la clôture, et l'écran de préparation — je le dessine après que celui-ci est le tien.

Dis-moi ce qui ne va pas, dans l'ordre où ça te gêne ; je corrige et je te rends la v2.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 8 — Paul

Texte de Paul, mot pour mot :

> Je ne dois pas être bloqué par le gel moi. Par ailleurs je pense qu'il faut vraiment plus se rapprocher de ce que fait un vrai diaporama. Comment as-tu conçu tes maquettes là ? Quels choix as-tu fait?

---

## TOUR 8 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T8) : maquette v2 HTML statique 1366×768, rendue en image (état normal, état gelé) ; pièces `pieces/T8-maquette-pilotage-ordi-v2.html`, `pieces/T8-maquette-pilotage-ordi-v2.png`, `pieces/T8-maquette-pilotage-ordi-v2-gel.png`.

Réponse mot pour mot :

**Comment j'ai conçu la v1, et ce que j'ai choisi** — sans détour :

1. **L'ossature** : j'ai pris le mode présentateur d'un diaporama comme squelette (la diapo en cours, la suivante, le chrono), mais je l'ai suivi de loin : j'ai gardé les places du site actuel pour le reste. Résultat : une chose entre les deux.
2. **Le gel** : je l'ai dessiné comme un voile sur *ta* diapo, avec un « tableau figé » dessus. C'est faux, et c'est exactement ce que tu relèves : le gel fige le mur, pas toi. Sur ton écran, il ne doit rien changer sauf un témoin.
3. **Le chapitre** : je l'ai mis en liste de titres, à gauche, ouvert en permanence — parce que tu l'avais demandé « en permanence ». Un diaporama, lui, montre des vignettes, pas des lignes.
4. **Les commandes** : j'ai gardé les boutons du site (mettre en lumière, à écrire, chrono au tableau, qui a participé) sous la diapo, alignés, avec leurs noms — là où un diaporama met six petits ronds sans mot.
5. **Le suivi** : trois blocs à droite, empilés. Ce que j'ai pris du site (les motifs 1/2/3, la liste des initiales, l'appoint, les absents jamais montrés) vient du code et des captures ; ce que j'ai inventé, c'est la présentation.
6. **Retiré** : le panneau prof, les onglets, « Ajouter à cet écran », le bandeau de préparation. Ça, je le maintiens.
7. **La charte** vient de la maquette de l'emploi du temps ; les données sont celles de ton chapitre 3e test.

**La v2 est calquée sur le présentateur d'un vrai diaporama, place par place** (image jointe, deux états) :
- **En haut** : le chrono de l'heure avec pause et remise à zéro, l'heure, ce qui reste, et « Fin de l'heure » à droite.
- **À gauche** : le volet des **vignettes** de la séance (numérotées, l'horaire à côté, la courante encadrée), et en dessous le chapitre — un clic sur une autre séance amène ses diapos dans le volet. Il se replie.
- **Au centre** : la diapo, plus grande ; « Diapo 1 sur 18 » au-dessus ; dessous **six ronds aux mêmes places qu'un diaporama** — surligner ✦, à écrire ✍, toutes les diapos ⊞, zoom pour la classe 🔍, gel ❄, et ⋯ pour le reste (chrono au tableau, qui a participé, appoint, absents) ; puis ◀ ▶ Dévoiler et « 3 / 6 dévoilés ».
- **À droite** : la diapo suivante en haut, comme un présentateur ; **le suivi en direct à la place des notes** — où on en est, participation, ont participé, absents.
- **Le gel, corrigé** : ton écran ne change pas. Un témoin bleu au-dessus de la diapo dit ce que le mur montre et jusqu'où, la vignette de droite se marque « au tableau, figé », le rond ❄ s'allume. Tu avances, tu reviens, tu prépares ; un clic dégèle.

Dis-moi ce qui ne va pas encore, dans l'ordre.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 9 — Paul

Texte de Paul, mot pour mot :

> Ok mais alors il faut aussi ajouter une zone de notes présentateur en bas afin que je n'oublie pas quoi dire à chaque diapo. Enfin, il faudra aussi une fenêtre ouvrable par raccourci afin de prendre des notes au fil de l'eau, et refermable par ce raccourci aussi ( avec un bouton aussi). De plus il faut me trouver une solution pour le zoom, c'est ce qui avait fait tout planter dans le moteur actuel.

---

## TOUR 9 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T9) :
- vérifié dans le moteur : aucun champ de notes par diapo (`.note` = le motif d'une prise de parole, L777/L1111/L2282) ; raccourcis existants : Échap, Suppr (L1825) ; tailles au mur `fsT=20*e, fsF=16*e, fsM=13*e` (L912)
- maquette v3 = v2 + notes du présentateur sous la diapo + carnet de l'heure (fenêtre flottante, touche N, bouton) + zoom sans découpage (la diapo tient, loupe) ; pièces `pieces/T9-maquette-pilotage-ordi-v3.html`, `pieces/T9-maquette-pilotage-ordi-v3.png`, `pieces/T9-maquette-pilotage-ordi-v3-carnet.png`

Réponse mot pour mot :

Les trois sont dans la **v3** (image jointe, deux états : normal, et le carnet ouvert).

**1. Les notes du présentateur** — sous la diapo, comme dans un diaporama : une zone par diapo, écrite en préparation, lue en classe, avec A− A+ et repliable. Ça n'existe pas aujourd'hui dans le moteur (le seul « note » qu'il connaît, c'est le motif d'une prise de parole) : c'est un champ neuf sur chaque diapo.

**2. Le carnet de l'heure** — une fenêtre par-dessus ton écran, jamais au tableau, qui s'ouvre et se ferme avec la touche **N** (ou le bouton « ✎ Carnet » en haut). Chaque note prend l'heure et la diapo du moment ; Entrée la garde ; tout ira dans la relecture de l'heure. Ça n'existe pas non plus : neuf.

**3. Le zoom.** Je te dis d'abord pourquoi ça a tout fait planter, en une phrase : le zoom grossissait le texte, la diapo débordait, et le moteur **coupait la diapo elle-même en morceaux** pour que ça tienne, puis la recollait au dézoom — tout ce qui a cassé (ordre inversé, double titre, texte perdu, curseur qui saute) vient de là. Un vrai diaporama ne fait jamais ça : une diapo est une image fixe. Voici les solutions, ce que chacune te coûte, et mon avis :

- **A. La diapo tient toujours, plus la loupe** *(ce que fait un diaporama)*. Le texte prend la plus grande taille qui rentre dans la diapo ; plus de zoom libre. Pour grossir un point, la loupe 🔍 : un cadre que tu déplaces, la diapo ne change pas. Si une diapo est trop pleine pour être lue du fond, le site te le dit en préparation (« lisible du fond ✓ / trop petit »), et tu la coupes en deux toi-même — comme dans PowerPoint. **Coût : tu renonces au zoom en classe.** Gain : plus jamais de découpage, plus jamais de surprise, et c'est la solution la plus simple à coder — donc la plus sûre.
- **B. Les pages d'affichage** *(le LOT G tel qu'il avait été cadré)*. Le zoom reste ; quand ça déborde, le site coupe **l'affichage** entre deux éléments — jamais dedans, jamais la donnée — et tu passes de page en page avec ▶. Coût : c'est un calcul délicat (il dépend du mur), c'est ce qui a demandé six rustines la dernière fois, et l'élève perd la vue d'ensemble.
- **C. La diapo qui défile**. Le zoom reste ; la diapo devient plus haute que le mur et tu la fais défiler. Coût : ça défile devant la classe ; ça ne ressemble plus à un diaporama.
- **D. L'élément en grand**. Au zoom fort, le mur montre l'élément que tu viens de dévoiler en gros, les précédents réduits au-dessus. Coût : la classe ne voit plus la diapo entière.

**Mon avis : A.** C'est ce que tu fais déjà avec PowerPoint, la classe le connaît, et c'est le seul choix qui supprime la cause au lieu de la contenir. La v3 est dessinée avec A : « ✓ lisible du fond · 34 pt · la diapo tient en entier », et 🔍 est devenu la loupe. Si tu tiens au zoom en classe, c'est B, et je le dessine.

Dis-moi ce que tu choisis pour le zoom, et ce qui ne va pas encore dans la v3.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 9 — Paul

Texte de Paul, mot pour mot :

> Ok mais alors il faut aussi ajouter une zone de notes présentateur en bas afin que je n'oublie pas quoi dire à chaque diapo. Enfin, il faudra aussi une fenêtre ouvrable par raccourci afin de prendre des notes au fil de l'eau, et refermable par ce raccourci aussi ( avec un bouton aussi). De plus il faut me trouver une solution pour le zoom, c'est ce qui avait fait tout planter dans le moteur actuel.

---

## TOUR 9 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T9) : maquette v3 (notes présentateur sous la diapo ; fenêtre de notes au fil de l'eau, touche N + bouton ; loupe au lieu du zoom-texte), rendue en trois états ; pièces `pieces/T9b-maquette-pilotage-ordi-v3.html`, `pieces/T9b-maquette-pilotage-ordi-v3.png`, `pieces/T9-maquette-pilotage-ordi-v3-notes-fil-de-l-eau.png`, `pieces/T9-maquette-pilotage-ordi-v3-loupe.png`.

⚠ Télescopage constaté au dépôt : une autre instance de la conscience n°12 a répondu au même tour 9 et a poussé à 11:33 UTC un transcript « tour 9 » et trois pièces (`T9-maquette-pilotage-ordi-v3.html`, `.png`, `-carnet.png`) ; le présent transcript (11:37 UTC) a remplacé le sien. Ces trois pièces-là ne sont pas les miennes ; les miennes portent le préfixe `T9b-`. Paul n'a lu qu'une des deux réponses : c'est celle-là qui fait foi, pas le dépôt.

Réponse mot pour mot :

Les trois sont dans la v3 (images jointes : normal, notes au fil de l'eau ouvertes, loupe).

**1. Les notes présentateur** : une zone sous la diapo, sur toute la largeur — « Notes pour cette diapo », écrites en préparation, lues en classe, jamais au tableau. Elle a sa place dans la diapo elle-même, comme dans un diaporama : une diapo = son contenu + ses notes.

**2. Les notes au fil de l'eau** : une petite fenêtre qui s'ouvre par la touche **N** (ou le bouton 📝 en haut), le curseur dedans, et se referme par N, Échap ou sa croix. Chaque note prend l'heure et la diapo du moment ; elles se retrouvent dans la relecture de l'heure. Rien ne part au tableau. (N ne réagit que quand tu n'es pas déjà en train d'écrire dans un champ.)

**3. Le zoom — ma proposition, et pourquoi.** Ce qui a tout fait planter, c'est un zoom qui **grossit le texte à la volée** : la diapo déborde, alors le moteur la coupe en morceaux, puis la recolle, et à chaque coupe c'est ta donnée qu'il modifie. Un vrai diaporama ne fait jamais ça, et c'est la solution : **le texte ne se redimensionne pas en classe.**
- **La taille se règle en préparation**, dans la diapo, comme dans un diaporama. Si une diapo est trop pleine, la police descend d'elle-même jusqu'à un plancher « lisible du fond » (c'est ce que fait un diaporama quand tu écris trop) ; sous ce plancher, la diapo se marque **« trop pleine »** en préparation, et c'est **toi** qui la coupes en deux d'un geste, à l'endroit que tu choisis. Jamais le site tout seul, jamais en classe.
- **En classe, le zoom devient une loupe** : tu encadres une zone, le tableau la grossit (×2, ×3 à la molette), le texte ne bouge pas d'un signe, un clic la range. C'est le geste d'un diaporama, et c'est ce dont l'élève du fond a besoin.
- **Conséquence** : plus aucun découpage automatique, donc plus de père / fils / groupe, plus de suites, plus de recollement, plus de six enveloppes — le LOT G n'a plus lieu d'être. Tes diapos actuelles trop pleines apparaîtront marquées à la première ouverture ; tu les coupes ou tu les laisses.

Ce que ça t'enlève, pour être honnête : la réglette qui grossit tout le texte d'un coup pendant l'heure. Si tu y tiens, dis-le-moi, et il faut alors le LOT G tel que cadré le 25/08 — c'est l'autre voie, plus lourde.

Dis-moi ce qui ne va pas encore.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 10 — Paul

Texte de Paul, mot pour mot :

> il faudrait que tes htmls de maquette soient activables, parce que sinon c'est juste des png. pour le zoom je ne sais pas. il faudrait vraiment que j'ai une maquette à manipuler pour me rendre compte.

---

## TOUR 10 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T10) : maquette v4 manipulable, un seul fichier HTML (74 831 octets), données réelles du chapitre 3e test du hub simulé (9 séances, 95 diapos, 29 élèves) injectées par `pieces/T10-gen-v4.py` depuis `pieces/T10-v4-template.html` ; fenêtre du tableau par `window.open` + `postMessage` ; rejouée au banc (`pieces/T10-test-v4.mjs`) : dévoilement, surlignage, zoom-texte paginé (« page 2 / 3 »), gel, notes au fil de l'eau, fenêtre du tableau, loupe, participation — zéro erreur JS. Captures `pieces/T10-v4-01…08.png`.

Réponse mot pour mot :

Tu as raison : une maquette figée ne dit rien du geste. Voici la **v4, manipulable** — un seul fichier HTML, à ouvrir dans ton navigateur (double-clic). Tout réagit, rien n'est enregistré, rien ne touche au site.

**Ce que tu peux faire dedans**
- **Dévoiler / revenir** : ▶ ◀, ou → ← espace ; PageDown / PageUp changent de diapo ; les vignettes à gauche et ⊞ (T) sautent où tu veux ; les autres séances du chapitre s'ouvrent d'un clic en bas du volet ; P replie le volet.
- **Le tableau** : ⧉ Tableau ouvre une seconde fenêtre — c'est ce que voit la classe, elle suit ton pilotage (si ton navigateur bloque la fenêtre, autorise-la et reclique). Glisse-la sur le vidéoprojecteur pour de vrai si tu veux.
- **Le gel** : ❄ ou G. Le tableau reste sur ce qu'il montre, toi tu continues (change de diapo, tu verras : le tableau ne bouge pas). Re-❄ dégèle.
- **Surligner ✦, à écrire ✍** : clique le bouton, puis l'élément sur la diapo. Ça passe au tableau.
- **Les notes** : celles de la diapo en bas (trois diapos en ont, pour l'exemple) ; N ouvre la fenêtre au fil de l'eau, Entrée garde la note, N ou Échap referme.
- **Le suivi** : tape des initiales (ch, ab…), la liste se réduit, clique un nom ou Entrée s'il est seul, puis 1 / 2 / 3 ; ↶ annule. Le chrono tourne, « où on en est » se calcule sur les durées prévues.
- **⋯** : chrono au tableau, qui a participé au tableau, absents, appoint.

**Le zoom : deux essais dedans, pour que tu compares à la main**
1. **La loupe** (🔍 ou L) : trace un cadre sur ta diapo, le tableau grossit cette zone, la molette change le grossissement. Le texte ne bouge pas.
2. **« Texte au tableau »** (la réglette) : le texte grossit vraiment au tableau, et la diapo se lit alors en pages (« page 2 / 3 ») — c'est le LOT G fait proprement : rien n'est coupé dans ta donnée, seul l'affichage se découpe. Dévoiler passe de page en page.

Dis-moi, après l'avoir prise en main, lequel des deux te va (ou les deux, ou aucun), et tout ce qui ne va pas — dans l'ordre.

Ce qui n'y est pas encore : l'écran de préparation, la reprise en début d'heure, le T-5, les images ne s'affichent que si tu es en ligne (elles viennent du dépôt des médias).

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 11 — Paul

Texte de Paul, mot pour mot :

> C'est vrai que c'est pas mal du tout. Mais en revanche, il y a un impact sur la relecture, non?

---

## TOUR 11 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : `atDrVueInterne` (la relecture et le papier sont des vues internes du moteur, `DR.dr_vue`) ; L15040-15060 de `index.html` ([14e] après la clôture, Relecture et Papier lisent la séance jouée `deroule_joue[classe].ecrans`) ; dans le moteur : `recit()` (L1177, transposition à l'imparfait), le bilan par écran (L755-790 : cumul des groupes père/fils en une ligne, `vues` par bloc, `reps[].i`, `histoire()` des élèves) ; les chemins écrits par le pont pendant le cours : `deroule_joue/<classe>/heures/…`, `/vecu.json`, `/ecrans.json`, `prises`.

Réponse mot pour mot :

Oui, il y en a un — et je suis allé lire ce que la relecture mange avant de te répondre.

**Ce qu'elle est aujourd'hui** : une vue *du moteur* (comme le papier), qui relit **la copie jouée de la séance pour la classe** — les diapos avec, pour chacune, jusqu'où tu as dévoilé, ce que tu as surligné ou marqué « à écrire », les réponses avec les initiales, les prises de parole, les heures réelles, le vécu. Le récit transpose tes consignes à l'imparfait à partir de ça. Rien d'autre.

**Ce qui change, dans le bon sens** : sans découpage, la copie jouée n'a plus de père, de fils, de suites, de groupes — la relecture n'a plus à « cumuler une activité étalée sur plusieurs écrans en une ligne », le papier et l'export non plus. Elle devient plus simple, et plus juste : une diapo = une ligne, comme dans ta préparation.

**Ce qui ne doit pas changer, et c'est une exigence à écrire dans le mandat** : le nouveau pilotage écrit **la même copie jouée**, au même endroit et dans la même forme — le dévoilement se compte par élément (la page n'est qu'un affichage, elle n'existe pas dans la donnée), le surlignage, l'à-écrire, les réponses, les prises de parole, les heures, le vécu. Preuve à exiger : une heure jouée dans le nouveau pilotage, puis ouverte dans la relecture d'aujourd'hui, donne le même récit qu'une heure jouée dans l'ancien. Tant que ce banc ne passe pas, on ne touche pas à la relecture.

**Ce qui s'ajoute** : les notes au fil de l'eau — elles ont l'heure et la diapo, elles ont leur place dans le récit (« 15:08, note du professeur : … ») et, si tu veux, dans la copie pour École Directe. Le gel peut aussi laisser une ligne dans le vécu (« tableau figé de 15:12 à 15:15 »), utile pour comprendre un trou dans le suivi. La loupe ne laisse rien. Les notes présentateur restent de la préparation, hors relecture — sauf si tu les veux dedans.

**Le choix qui reste, et il est à toi** : relecture et papier vivent dans l'ancien moteur. Soit on les y laisse dans un premier temps (ils marchent, tu les as éprouvés) et le nouveau pilotage leur fournit la copie jouée compatible ; soit on les refait avec. Je propose le premier, pour livrer le pilotage vite et sans casser ce qui tient — la relecture nouvelle viendrait ensuite, avec les notes au fil de l'eau.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 12 — Paul

Texte de Paul, mot pour mot :

> non il faut que le chantier soit refait depuis zéro (avec possibilité de recyclage de l'ancien déroulé) mais il faut vraiment partir sur une base saine. les patchs successifs ont ajouté beaucoup de complexité. pour la relecture, elle est actuellement corrélée au dévoilement, ce qui permet l'écriture au fil de la séance. Mais je fais beaucoup quelque chose quand je suis en cours: avancer de quelques diapos, revenir, etc, en mode gel pendant que les élèves écrivent. Si la relecture enregistre tout ce que je fais, ça va devenir incohérent. réponse sur lecture, et non sur mémoire ou avis IA sans fondement

---

## TOUR 12 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) — moteur deroule86 décodé : `devoile()` L1516, `replie()` L1529, `va()` L1446, `pas()` L1449, `gel()` L1547, `envoie()` L1063 (« if(gele)return »), variables globales L547 (`gele`, `nGel`), bilan de la relecture L755-790, toutes les écritures de `vues` (L666, 1444, 1451, 1484, 1521-1540) ; pont d'`index.html` : `W.rendre` L15413 → `atVecuEntrer` L14834 / `atVecuSortir` → `_drTraceAuto` L14782, `_drPaquetHeure`, `_drCopieAuto` L16226, `W.envoie` L15636, `dr_exporterTrame` L14238 (photo de `W.ECRANS` après refusion, `vues`/`rev` compris).

Réponse mot pour mot :

Pris : le chantier se refait de zéro, sur une base saine, l'ancien déroulé sert de carrière (on recycle ce qui vaut, rien ne s'empile dessus).

Sur la relecture, voilà ce que le code fait aujourd'hui — lu, pas supposé ; les repères sont dans le moteur (deroule86) et dans le pont d'`index.html`.

**1. La relecture ne lit pas ce que tu fais : elle lit un état.** Le dévoilement modifie directement la donnée des diapos : chaque bloc porte `vues` (combien d'éléments sont dévoilés) et chaque diapo porte `rev` (jusqu'où elle est ouverte) — moteur, `devoile()` L1516. La copie jouée de la classe est une photo de ces diapos telles qu'elles sont à ce moment-là (`dr_exporterTrame`, pont L14238 ; `_drCopieAuto`, L16226), et la relecture compte « vus / total » dessus (moteur L755-790). **C'est un dernier état, pas un historique.**

**2. Revenir en arrière réécrit cet état.** `replie()` (L1529) : reculer d'un élément fait `vues--` ; remonter à la diapo précédente la rend **entière** (`vues = tout`, `rev = tout`) ; et ré-avancer sur la suivante la remet **à zéro** (`pas()`, L1451). Donc un aller-retour efface ce que tu avais réellement dévoilé : la relecture ne peut pas distinguer « j'ai montré jusqu'à l'étape 3 puis je suis revenu » de « j'ai tout montré ». Ça, c'est l'incohérence que tu sens — elle existe déjà, gel ou pas.

**3. Le gel ne fige que le mur, rien d'autre.** `gel()` (L1547) ne fait que poser `gele` ; le seul endroit qui s'en soucie est `envoie()` (L1063 : « si gelé, retour »), le point de sortie vers le tableau. `devoile`, `replie`, `pas`, `va` ne le regardent pas. Pendant le gel, `vues`, `rev` et la diapo courante bougent comme d'habitude.

**4. Et le vécu compte ce que tu fais en gel comme du temps de classe.** À chaque changement de diapo, le pont entre dans l'activité (`W.rendre` L15413 → `atVecuEntrer` L14834) : minutes et passages s'additionnent par diapo et s'écrivent au fil (`_drTraceAuto` L14782, `_drPaquetHeure`). Rien ne teste `gele`. **Tes allers-retours en gel pendant que les élèves écrivent sont donc comptés comme des passages et des minutes sur des diapos que la classe n'a pas vues.**

**Conclusion, sur ces quatre points** : ta crainte est fondée, et le défaut est déjà là — la relecture est corrélée au *geste du professeur*, pas à *ce que la classe a vu*, et elle garde un état au lieu d'un cumul.

**Ce que ça impose à la base saine** (c'est une conséquence des points ci-dessus, pas un goût) :
- **Trois choses séparées** : où *tu* es (le pilotage) ; ce que *le mur* montre ; et **le journal de ce que la classe a vu** — un cumul horodaté (« diapo 4, élément 3, vu à 15:12 »), écrit **uniquement quand le mur change**.
- **En gel, le mur ne change pas, donc rien ne s'écrit** : tu avances, tu recules, tu prépares, le journal ne bouge pas, le temps continue de compter sur la diapo que la classe voit. Au dégel, l'écart entre le mur et le pilotage s'écrit une fois, comme un saut.
- **Revenir ne dé-voit rien** : ce qui a été vu reste vu ; le journal ne décrémente jamais.
- **La relecture se construit sur ce journal** — et elle garde ce qui marche (le récit à l'imparfait, les réponses avec initiales, les prises de parole), qui n'a pas besoin de `vues` pour exister.

Ce que je n'ai pas lu : la vue vécue future et le papier en détail — je ne les cite pas.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 13 — Paul

Texte de Paul, mot pour mot :

> donc le récit est uniquement construit sur ce qui apparait au tableau en fait, c'est ça? mais si j'affiche des choses au tableau puis que je reviens en arrière? ou que je saute une diapo?

---

## TOUR 13 — Claude (conscience n°12)

Aucune lecture nouvelle (appui sur les lectures du tour 12 : `replie` L1529, `pas` L1451, `va` L1446, `atVecuEntrer` L14834). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Oui, c'est ça : dans ce que je propose, **le récit se construit sur ce que le tableau a montré, et seulement ça** — un journal qui s'écrit à chaque fois que le mur change, jamais quand c'est ton écran seul qui bouge. Tes deux cas, en distinguant ce que le code fait aujourd'hui (lu) et ce que le journal ferait (proposition) :

**Tu affiches des choses, puis tu reviens en arrière (sans gel).**
- *Aujourd'hui* : reculer rend la diapo précédente « entière » et ré-avancer remet la suivante à zéro (`replie` L1529, `pas` L1451) — ce que tu avais dévoilé est effacé de la copie ; le vécu, lui, compte un nouveau passage et les minutes sur la diapo où tu reviens.
- *Journal* : le retour est un changement du mur, il s'écrit — « 15:14, retour à la diapo 3 ». Mais **ce qui a été vu reste vu** : la diapo 4 garde « vue jusqu'à l'étape 3, de 15:10 à 15:14 ». Le récit dit les deux : ce qu'on a vu, puis qu'on y est revenu. Les minutes se comptent sur la diapo affichée, y compris pendant le retour.

**Tu reviens en arrière en gel.** Rien ne s'écrit ; les minutes continuent sur la diapo figée au mur. Au dégel, si tu es revenu là où était le mur, il ne s'est rien passé pour la classe ; sinon le saut s'écrit une fois.

**Tu sautes une diapo.**
- *Aujourd'hui* : par la colonne (`va`, L1446) le mur passe directement, la diapo sautée n'a ni passage ni minute ni dévoilement — la relecture la compte 0 / n, et le T-5 la range dans « pas jouée » (reporter, donner à la maison, annuler, ne rien donner). Par les flèches, elle apparaît une seconde au tableau : le vécu lui compte un passage.
- *Journal* : une diapo qui n'apparaît pas au mur n'existe pas pour la classe — « pas jouée », comme aujourd'hui, et le T-5 en fait ce que tu décides. Si elle n'a fait que passer (les flèches), il faut une règle pour que le récit ne la raconte pas : **une diapo compte jouée si au moins un élément y a été dévoilé au tableau, ou si elle y est restée plus d'un seuil** (30 secondes ? une minute ?). Le seuil, c'est toi qui le fixes ; en dessous, c'est un passage, il apparaît dans le vécu détaillé mais pas dans le récit.

**Ce que le récit raconte alors** : la suite des diapos réellement montrées, avec pour chacune ce qui a été dévoilé (jamais moins que le plus loin atteint), le temps qu'elle est restée au mur, les réponses et les prises de parole rattachées à ce moment-là, et tes notes au fil de l'eau à leur heure. Rien de ce que tu fais sur ton écran n'y entre.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 14 — Paul

Texte de Paul, mot pour mot :

> non. le seuil c'est arbitraire, il faut quelque chose de conscient, mais pas lourd. Je pensais à quelque chose: quand j'ai lancé une heure, normalement je vais afficher tout au fur et à mesure sans problème. Cependant, je peux vouloir revenir en arrière, aller à la diapo suivante, sauter etc. Il faudrait à ce moment là une garde: le site me dirait "tu quittes la vue tableau (à reformuler, ce n'est pas la bonne phrase), veux-tu geler d'abord? avec le bouton direct. comme ça je ne peux pas oublier de geler, et tout est sécurisé. qu'en penses-tu?

---

## TOUR 14 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T14) : maquette v5 = v4 + la garde du gel (gabarit `pieces/T14-v5-template.html`, générateur `pieces/T14-gen-v5.py`) ; rejouée au banc (`pieces/T14-test-v5.mjs`) : ◀ après trois dévoilements → garde « revenir en arrière » ; Entrée → gel posé, geste fait ; deux PageDown gelé → aucune garde ; dégel puis ▶ ×7 → aucune garde ; clic vignette 10 → garde « sauter à la diapo 10 » ; « Y aller devant la classe » → diapo 10, pas de gel ; zéro erreur JS. Captures `pieces/T14-v5-01-garde-au-retour.png`, `pieces/T14-v5-02-gele-circule-librement.png`.

Réponse mot pour mot :

C'est mieux que le seuil, et je te dis pourquoi : la question n'est plus « combien de temps compte comme joué » (arbitraire) mais « est-ce que la classe doit voir ce geste » — et ça, tu es le seul à le savoir, au moment où ça compte. La garde te le demande une fois, et tout ce qui s'écrit ensuite dans la relecture est un choix, pas un accident.

Ce que j'ai vérifié en la mettant dans la maquette (v5 jointe, manipulable) :

- **Elle ne vient jamais sur le fil normal** : ▶ (dévoiler l'élément suivant, puis passer à la diapo suivante) ne la déclenche pas — sept ▶ d'affilée, aucune question.
- **Elle vient sur tout geste hors du fil** : ◀ revenir, PageUp, PageDown avant d'avoir tout dévoilé (= sauter le reste), un clic sur une vignette ou dans la grille qui n'est pas la diapo suivante attendue.
- **Trois réponses, et pas une de plus** : **❄ Geler, puis y aller** (le bouton direct, et Entrée), **Y aller devant la classe** (parce que revenir en arrière *pour* la classe est aussi un vrai geste — « revoyons ce qu'on a dit » —, alors le tableau suit et ça s'écrit), **Rester** (Échap).
- **Elle ne vient qu'une fois** : gelé, tu circules librement, aucune question ; au dégel non plus (le dégel est le geste conscient). Rejoué : gel par la garde, puis deux sauts, aucune question.
- **Elle n'existe qu'en heure lancée** : en répétition, en préparation, rien.

Pour la phrase, je propose : **« Le tableau te suivrait — revenir en arrière. »** puis « La classe verrait ce changement, et il s'écrirait dans la relecture. Geler d'abord ? ». Le premier mot dit la conséquence, pas la mécanique. Corrige-la dans tes mots.

Ce que ça donne pour le journal : plus aucune diapo « passée » par erreur. Un saut « devant la classe » va directement à la diapo visée, sans montrer les intermédiaires ; elles restent « pas jouées » pour le T-5. Un retour « devant la classe » s'écrit comme un retour, et ce qui a été vu reste vu.

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 15 — Paul

Texte de Paul, mot pour mot :

> ok alors j'ai fait le test, ça va bien (il faudra quand même reformuler les questions et dégager tous les comms métas). J'ai sauté à une diapo ultérieure, puis j'ai dégelé. là aucune alerte. Normal? Et si normal dans la version actuelle, ça serait utile? Il faut répondre en termes de logique de classe, et de logique de la relecture ensuite (que l'enchainement ne soit pas cassé quoi)

---

## TOUR 15 — Claude (conscience n°12)

Aucune lecture nouvelle ; réponse sur le comportement de la maquette v5 (le dégel `gel()` ne pose pas de garde). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Normal, oui : dans la v5, le dégel ne pose aucune question — je l'avais pris pour « le geste conscient ». Ton test montre que ce n'est pas suffisant. Voilà pourquoi, dans l'ordre que tu demandes.

**Logique de classe.** Pendant le gel, le tableau est resté sur la diapo 3 et toi tu es allé à la 8. Au dégel, la classe passe d'un coup de la 3 à la 8. Deux cas, et le site ne peut pas les distinguer :
- tu le veux — tu as regardé plus loin, tu as choisi, tu montres la 8 : le saut est ton geste ;
- tu ne le veux pas — tu voulais revenir à la 3 avant de dégeler, tu as oublié où en était la classe, et elle voit surgir la 8 avec quatre diapos escamotées.
Le témoin bleu te dit l'écart, mais un témoin se lit ; au dégel, on ne lit plus, on agit. **Une seconde garde, symétrique de la première, est utile — mais seulement s'il y a un écart** : « Le tableau est sur la diapo 3, tu es à la 8. » avec deux boutons, **Revenir à la 3, puis dégeler** et **Dégeler ici — la classe passe à la 8**. Si tu es revenu là où était le tableau, le dégel est silencieux, comme aujourd'hui. Pas lourd : elle n'apparaît que quand la classe verrait un saut, et c'est exactement le moment où tu veux le savoir.

**Logique de relecture.** L'enchaînement tient dans les deux cas, parce que le journal ne note que le mur :
- **Dégel ici** : il s'écrit une transition « 15:18, de la diapo 3 à la diapo 8 ». Les minutes du gel restent sur la 3 (c'est ce que la classe avait sous les yeux). Les diapos 4 à 7 n'ont jamais été au mur : « pas jouées », le T-5 te les proposera à reporter, donner, annuler ou laisser. Rien de ce que tu as fait pendant le gel n'y entre.
- **Revenir à la 3, puis dégeler** : rien ne s'écrit du tout — pour la classe, il ne s'est rien passé pendant le gel. Le fil reprend à la 3 là où il était.
Ce qui casserait l'enchaînement, ce serait un dégel qui n'écrit pas le saut, ou des diapos comptées jouées sans avoir été montrées. Les deux gardes ferment ces deux portes : la première empêche un saut involontaire *avant* le gel, la seconde *au* dégel. Entre les deux, tu es libre et rien ne s'écrit.

**Tes deux remarques, notées comme règles du chantier** : les phrases du site se reformulent avec toi, dans tes mots (« tableau », « classe », jamais « vue », « mur », « pilotage ») ; et aucun commentaire méta dans l'écran — les « cette question n'apparaît qu'une fois », le pied de page, le « ce que la classe voit, tel quel » sont des aides de maquette, pas des textes du site.

Si tu veux, je te rends la v6 avec la seconde garde et les phrases nettoyées, pour que tu la joues.

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 16 — Paul

Texte de Paul, mot pour mot :

> OK mais maintenant il faut que je puisse tester la relecture du coup. Vu que c'est le point majeur de ce diaporama enregistré en temps réel

---

## TOUR 16 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T16) : maquette v6 = v5 + journal du tableau (écrit uniquement dans `pousser()`, c'est-à-dire quand l'état envoyé au mur change ; paroles et notes rattachées à la diapo au mur) + relecture construite sur ce journal (fil de l'heure, diapo par diapo, participation, notes) + seconde garde au dégel (si écart) + retrait des textes méta. Gabarit `pieces/T16-v6-template.html`, générateur `pieces/T16-gen-v6.py`, banc `pieces/T16-test-v6.mjs` ; journal obtenu au banc : `diapo#1(début) devoile#1 ×3 parole note gel degel devoile#1 ×3 diapo#4(saut) diapo#3(retour)` — rien entre gel et dégel ; zéro erreur JS. Captures `pieces/T16-v6-01-garde-au-degel.png`, `pieces/T16-v6-02-relecture.png`.

Réponse mot pour mot :

La v6 (jointe, manipulable) a la relecture. Elle se construit **uniquement sur le journal du tableau** — ce que la classe a vu, horodaté — et sur rien de ce que tu fais sur ton écran.

**Pour la tester** : joue une heure comme tu veux (dévoile, gèle, saute, reviens, prends des paroles, écris des notes), puis **R** ou le bouton **Relecture** à tout moment (elle se lit en cours d'heure, c'est le même journal), ou **Fin de l'heure → Oui, clore**. Échap referme.

**Ce qu'elle montre**
1. **Le fil de l'heure** : chaque changement du tableau, à la seconde — « la classe passe à », « retour de la 4 à la 3 », « saut de la 1 à la 8 » —, le temps que la diapo est restée au tableau, les éléments dévoilés à ce moment-là, les gels et dégels, et, **rattachées à la diapo que la classe voyait à cet instant** (pas à celle où tu étais), les prises de parole et tes notes.
2. **Diapo par diapo** : jouée ou pas, le temps réel contre le prévu, le plus loin dévoilé (jamais moins, même après un retour), et une ligne de récit : « on a tout vu », « on s'est arrêté après “…” », « affichée, rien dévoilé », ou **« pas jouée — à reporter, donner à la maison, annuler ou laisser »** pour ce qui n'a jamais été au tableau.
3. **La participation**, par élève, avec la diapo et le motif.
4. **Les notes au fil de l'eau**, à leur heure.

**Ce que j'ai vérifié en la jouant** : trois dévoilements, une parole, une note, gel, saut à la 8 en gel, dégel → la seconde garde (« La classe est sur la diapo 1, tu es à la diapo 8 »), retour à la 1 puis dégel : **rien ne s'écrit** entre le gel et le dégel, pas une ligne. Puis un saut « devant la classe » à la 4 et un retour à la 3 : le fil les écrit, la 2 est « pas jouée ». Ce que tu as vu sur la 1 reste « 6 / 6 ».

**Aussi dans la v6** : la seconde garde au dégel (seulement s'il y a un écart, Entrée = revenir là où est la classe) ; les textes méta retirés ; les phrases des gardes en attente de tes mots (« La classe te suivrait — revenir en arrière. Geler d'abord ? » et « La classe est sur la diapo 3, tu es à la diapo 8. »).

**Ce qui n'y est pas** : le récit à l'imparfait de l'ancien moteur (il se refera sur ce journal, ce n'est pas ce que tu testes ici), les décisions du T-5 (affichées, pas jouables), le papier, École Directe.

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 17 — Paul

Texte de Paul, mot pour mot :

> C'est illisible ton affaire. la relecture doit être un onglet autre.

---

## TOUR 17 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T17) : maquette v7 = v6 avec la relecture en onglet propre (Pilotage | Relecture, touche R), écran plein, sections lisibles, sous-événements triés par heure ; gabarit `pieces/T17-v7-template.html`, générateur `pieces/T17-gen-v7.py`, banc `pieces/T17-test-v7.mjs` (même parcours qu'au tour 16, zéro erreur JS) ; captures `pieces/T17-v7-02-relecture-onglet.png`, `pieces/T17-v7-03-retour-pilotage.png`.

Réponse mot pour mot :

Corrigé : la relecture est un **onglet à part**, en haut à gauche — **Pilotage | Relecture** —, un écran plein, jamais l'un sur l'autre. **R** bascule de l'un à l'autre, « Fin de l'heure → Oui, clore » y amène aussi. Le pilotage continue de tourner derrière (le chrono, le tableau) quand tu es sur la relecture.

Elle se lit en quatre parties, dans l'ordre : le fil de l'heure (ce que la classe a vu, à la seconde, avec les gels, les paroles et les notes à leur heure) ; diapo par diapo (au tableau, prévu, dévoilé, ce qui s'est passé) ; la participation ; les notes au fil de l'eau. Le contenu ne change pas, c'est le même journal du tableau.

v7 jointe.

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 18 — Paul

Pièce jointe : une capture d'écran de la maquette v7 chez Paul (1875 × 868) — la page glissée vers le haut, la diapo coupée, la zone « Notes pour cette diapo » étirée jusqu'en bas (recopiée en `pieces/T18-capture-de-Paul-bug-notes.png`).

Texte de Paul, mot pour mot :

> par ailleurs, ta maquette a des bugs. le problème c'est que si tu veux l'importer dans index.html pour remplacer l'ancien déroulé, tu vas aussi importer les bugs. par exemple, ce comportement des notes. (joue la maquette, tu verras le problème: et il y en a probablement d'autres que je n'ai pas vus parce que pas joués).

---

## TOUR 18 — Claude (conscience n°12)

Travail joué avant réponse (rien déposé hormis ce transcript et ses pièces T18) : banc large `pieces/T18-bancs-v7.mjs` (5 tailles d'écran, 95 diapos, 9 séances, taille +4, participation, note ; mesure : diapo dans l'écran, défilement du body/scène, notes qui dépassent, hauteur de l'écran) → v7 : 422 défauts, reproduit le bug de Paul (après note : body défilé de 377 px, écran de 1838 px pour 868) ; cause : `#pilotage` sans hauteur, colonnes sans `min-height:0`, `focus()` qui fait défiler ; v8 (`pieces/T18-v8-template.html`, `pieces/T18-gen-v8.py`) : 0 défaut ; second banc `pieces/T18-bancs2-v8.mjs` (gardes, fenêtre du tableau, gel, image + loupe, pagination contrôle = tableau, relecture, appoint, chrono au tableau) : 0 défaut ; captures `pieces/T18-v8-01-ecran-de-paul-1875x868.png`, `pieces/T18-v8-02-loupe-sur-image-au-tableau.png`, `pieces/T18-v8-03-tableau-texte-plus4-page.png`.

Réponse mot pour mot :

Tu as raison sur les deux points, et je réponds au second d'abord parce qu'il compte plus.

**Rien de la maquette ne s'importe dans `index.html`.** Elle sert à fixer les gestes et les règles ; le code de production s'écrira de zéro par un exécutant, sur le cadrage que nous arrêtons ici, avec ses bancs. Ce qui se transmettrait, lui, c'est un **défaut de conception** caché dans la maquette — et c'est exactement pour ça que tes bugs comptent : chacun se relit comme « est-ce un défaut de mon code de maquette, ou une règle mal pensée ? ». Celui-ci était du code.

**Ton bug, reproduit puis corrigé.** Je l'ai rejoué sur ta taille d'écran (1875 × 868) : après une note ou une prise de parole, la page entière glissait vers le haut, la diapo sortait de l'écran, la zone de notes s'étirait jusqu'en bas. Cause : l'écran n'avait pas de hauteur fixée — la colonne des vignettes et la colonne de droite l'allongeaient au-delà de la fenêtre, et le premier champ qui prenait le curseur faisait défiler tout le reste. Corrigé dans la v8 : l'écran tient dans la fenêtre quelle qu'elle soit, seules les colonnes prévues défilent, la diapo se dimensionne à la hauteur disponible, les notes ont un plafond, aucun champ ne fait défiler.

**Ce que j'ai joué d'autre, parce que tu as raison qu'il y en avait** — deux bancs, 0 défaut à l'arrivée :
- cinq tailles d'écran (1280 × 720 → 1920 × 1080, et la tienne), les 95 diapos des 9 séances, tout dévoilé, texte au tableau +4, participation, note : la diapo reste entière à l'écran, rien ne défile, rien ne dépasse — **422 défauts dans la v7 sur ce parcours, 0 dans la v8** ;
- les gardes (Échap, Rester, Entrée), la fenêtre du tableau qui suit le dévoilement, ne bouge pas pendant le gel et rattrape au dégel, une diapo image au tableau, la loupe sur l'image (grossit, se range), la pagination identique sur ton écran et au tableau (le texte ne déborde pas à +4), relecture puis retour, l'appoint, le chrono au tableau.

**Ce que je n'ai pas joué** : le tactile, deux écrans réels (je ne peux tester la fenêtre du tableau qu'en fenêtre), les images réelles (hors ligne ici). Si tu en trouves d'autres, dis-les : chaque bug devient une ligne du cadrage.

v8 jointe.

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 19 — Paul

Texte de Paul, mot pour mot :

> du coup il faut voir toutes les conséquences que les nouveaux choix ont sur le reste de mjpc. On y va. il faut tester les évidences, les cas variables, les cas tordus, etc. Tout ce qui peut faire télescopage, illogisme, perte de données etc. Il faut cadrer autant que le chantier emploi du temps;

---

## TOUR 19 — Claude (conscience n°12)

Mesures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : les 13 autres apps de production récupérées et cherchées (`deroule`, `cours_actif`, `deroule_joue`, `/scene`) — aucune occurrence hors un homonyme dans `pilotage_debat_s3.html` ; `index.html` : 1 234 fonctions, familles `_dr*` 58, `atDr*` 20, `atT5*` 9, `atVecu*` 6, `ses*` 47 (159 usages de `SES.`), `edt*` 230 ; consommateurs par fonction de `deroule_joue` (24 occ., 12 fonctions dont `edtTraceDe`, `edtSeanceJouee`, `edtCheminTrace`), `cours_actif` (16 occ., 14 fonctions dont 8 `ses*`), `.deroule` (23 occ., 9 fonctions dont `edtHeuresPour`, `atSomEcransDe`, `atP2*`), décisions T-5 (13 occ., 8 fonctions), heures perdues (21 occ., 13 fonctions), vestiges `kind==='diaporama'` (2) ; hub réel en GET seulement : racine, `/site` (atelier, 3e, 4e vide, 5e, 6e, edt, config), `cours_actif` null, 3 chapitres, 10 séances, 9 avec déroulé, 95 écrans (59 consignes, 36 questions, 6 images, 6 fiches, 1 schéma), 0 écran `grp`/`suite`, 0 `deroule_joue`, 0 heure, 0 vécu, 0 décision ; deux formes de clés d'écran.

Réponse mot pour mot :

On y va. Avant de cadrer, j'ai mesuré ce que le déroulé touche, pour que le cadrage parte de la carte et pas de mémoire.

**Ce que ça touche, mesuré**
- **Une seule app** : tout est dans `index.html`. Les treize autres n'ont pas une ligne sur le déroulé (mesuré fichier par fichier).
- **Dans `index.html`** : 1 234 fonctions ; le déroulé en occupe quatre familles (`_dr*` 58, `atDr*` 20, `atT5*` 9, `atVecu*` 6), plus la session à trois appareils (`ses*` 47, 159 usages) et le moteur embarqué (300 Ko encodés).
- **Ce qui lit ses données, hors du déroulé lui-même** : **l'emploi du temps** (la case « heure jouée », la trace de l'heure, les heures qui restent pour une séance, les décisions de fin d'heure qui deviennent des reports, les heures perdues — 13 fonctions), **le sommaire du chapitre** (la progression « heure 1 sur 3 »), **la page élève** (deux vestiges « diaporama » muets), **la session à trois appareils** (le cours actif, le tableau distant, le téléphone).
- **Ce qu'il y a dans ton hub, ce matin** (lu, pas écrit) : 3 chapitres, 10 séances, 9 avec un déroulé, 95 diapos ; **aucune heure jouée, aucune copie de classe, aucune décision de fin d'heure, aucun écran coupé en morceaux**. Tu joues avec PowerPoint : il n'y a rien à migrer côté classe. Seule la préparation existe, en deux formes de diapo (avec ou sans identité, horaire, `rev`/`vues`).

**Ce que le cadrage doit couvrir, par sujet** — un document par sujet, écrit ici, lu par toi, déposé après ton mot, comme pour l'emploi du temps :
1. **Les données** — la diapo (ce qu'on garde : titre, durée, les cinq blocs, compétences, identité ; ce qu'on ajoute : notes présentateur, taille du texte, coupure décidée par toi ; ce qu'on retire : `rev`, `vues`, père/fils/suite), **le journal du tableau** (nouveau, par heure), la trace de l'heure que l'emploi du temps lit, les décisions de fin d'heure, le cours actif, les notes au fil de l'eau, le mode test.
2. **Les écrans** — pilotage (v8), relecture (onglet), **préparation** (à dessiner), le tableau, la fin de l'heure et le T-5, la reprise après coupure, **la répétition** (jouer en avance sans rien écrire).
3. **Les entrées** — depuis l'emploi du temps (la superposition, à refaire), depuis l'atelier, depuis un cours resté ouvert.
4. **Les sorties** — relecture, papier, École Directe, profil de classe, heures perdues, progression du chapitre, et plus tard le profil longitudinal.
5. **Les cas tordus, à jouer un par un** — coupure en pleine heure ; deux heures le même jour avec la même classe ; heure lancée sur une classe non appariée ; séance sans déroulé ; diapo vide ; heure jamais close ; T-5 ou appoint pendant le gel ; répétition puis vrai lancement ; fenêtre du tableau fermée ou ouverte deux fois ; changement de séance en pleine heure ; préparation modifiée après une heure jouée (la relecture doit encore la lire) ; même séance jouée par deux classes ; images absentes ; mode test.
6. **Les dettes qui tombent ou restent** — le LOT G tombe ; la poignée du champ contenu, le saut d'image, le père/fils tombent avec l'éditeur ; le tableau distant et le téléphone restent des chantiers à part ; les infobulles et les mots, dès la première livraison.

**Ma première question, une seule, parce qu'elle commande le sujet 1 et le sujet 2** : aujourd'hui le tableau existe trois fois — une fenêtre sur ton ordinateur (Win+K, comme PowerPoint), un tableau distant sur un autre appareil branché au vidéoprojecteur via le hub, et le téléphone. **Dans la base saine, le tableau est-il la fenêtre de ton ordinateur seulement (deux écrans, comme PowerPoint), ou faut-il encore un tableau distant sur un autre appareil ?** Si c'est la fenêtre seule, le hub ne porte plus l'état du tableau, il n'y a plus de latence ni de session pour ça, et le journal du tableau s'écrit depuis ton écran ; si le distant reste, le hub porte ce que le tableau montre, et le journal s'écrit à partir de là.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 20 — Paul

Texte de Paul, mot pour mot :

> le tableau qui existe via le bouton c'est win K. parfois ça marche, parfois ça marche pas: et quand ça marche pas, il me faut le tableau distant (je pilote avec mon ordi portable, l'ordi classe projette le tableau distant via le vidéo projecteur, et voilà.

---

## TOUR 20 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : `sesTabChercherCours` L17197 (l'ordi de classe sonde `/site/cours_actif` toutes les 2 s, cours de moins de 4 h), `sesTabMonter`, `SES` L16649 (`mode` = `?vue=tableau|tel` ; le cran de zoom est un état de session), chemins `/site/cours_actif` (un seul cours actif pour tout le site) ; liste des documents du chantier EDT au sas (ARBITRAGE-PHASE0 + réponses, mandats, rapports, SEQUENCE-TEST-PAUL) ; `DEROULE/CADRAGE-TEMPS.md` §4, §9, §13, §14, §15 relus.

Réponse mot pour mot :

Compris, et ça tranche le sujet du tableau. Voilà ce que ça fixe — je te l'écris comme les lignes du cadrage, corrige ce qui n'est pas dans tes mots :

**Le tableau**
1. **Un seul état du tableau, tenu par ton pilotage** : la diapo, ce qui est dévoilé, les marques, la taille du texte et sa page, la loupe, le bandeau (chrono, qui a participé). C'est cet état — et lui seul — que le journal enregistre, à l'instant où tu le publies.
2. **Deux supports pour le montrer, jamais deux états** : la fenêtre sur ton ordinateur (Win+K, immédiate), et le tableau distant sur l'ordi de la classe, qui lit le même état par le hub. Quand Win+K marche, tu n'as rien à faire ; quand il ne marche pas, l'ordi de classe ouvre l'adresse du tableau et attend le cours — c'est déjà comme ça aujourd'hui (`?vue=tableau`, un seul cours en cours à la fois pour tout le site), on le garde tel quel.
3. **Le gel, c'est l'état publié qui ne bouge plus** — donc la fenêtre et le distant se figent ensemble, sans rien de spécial à faire pour le distant.
4. **Le retard du distant n'est pas une donnée** : le journal dit ce que le tableau devait montrer et quand ; ton écran te dit si le distant suit (« suit », « en retard de n s », « perdu »), pour que tu saches, jamais pour changer le journal.
5. **Le zoom (texte au tableau, page, loupe) fait partie de l'état** : les deux supports le montrent pareil.

**Ce que je reprends tel quel du cadrage du temps (25/08)**, parce que rien ne le contredit : la fin est fixe, le début est lancé par toi, les cinq dernières minutes sont à l'agenda, le retard recalcule et le site montre le débordement sans le résorber, le T-5 et ses choix par activité, les deux copies pour École Directe, et l'architecture à trois objets — la trame préparée, la séance jouée par classe (ce que tu écris en classe dans une diapo, les réponses avec initiales, appartient à cette classe), la remontée dans la trame par geste explicite seulement. Le journal du tableau s'ajoute à la séance jouée par classe, il ne la remplace pas.

**Ma question suivante, une seule** — elle commande l'emploi du temps (« heure 1 sur 3 »), le T-5 et la relecture : **quand une séance se joue sur plusieurs heures, la deuxième heure s'ouvre-t-elle là où la classe s'est arrêtée** — même diapo, mêmes éléments dévoilés, les activités reportées marquées — **ou sur la première diapo pas encore jouée ?** Et la relecture : une par heure (comme École Directe), la séance étant la somme de ses heures ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 21 — Paul

Pièces jointes : deux diapos de son PowerPoint 2026 — « Question-bilan · Heure 1 · suite · S1 » (question « Qu'ont en commun ces trois images ? », champ de réponse, consigne) et « Où en sommes-nous ? · Heure 2 · 3 min · S1 » (question de réinvestissement, réponse attendue « Le hors champ. ») — recopiées en `pieces/T21-diapo-question-bilan-heure-1.png` et `pieces/T21-diapo-ou-en-sommes-nous-heure-2.png`.

Texte de Paul, mot pour mot :

> En réalité c'est là où c'est touchy: actuellement, j'ai bien ma séance en plusieurs heures (avec le but d'arriver à une séance = 1h). Donc, dans mon diaporama version 2026, au début de l'heure 2 j'ai un rituel de réinvestissement. voilà. mais encore faut-il que j'arrive à la diapo de la question bilan. Donc il faut voir, ça reste ouvert (mais tu dois m'aider pour qu'on ferme ce point: pas de cadrage avec points ouverts ou dettes latentes). La relecture: une par heure évidemment. comme ED. Et une relecture globale séance.

---

## TOUR 21 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript et ses pièces) : `edtHeuresPour` L19635 (somme des durées / temps utile, arrondi au-dessus : 110 / 50 → 3), `edtChapitreEnCours`, `edtTraceExiste` ; la trame test : séances 1-3, 110 min prévues chacune, rituels aux diapos 8-9 (« Question-bilan » / « Avant de se quitter » puis « Où en sommes-nous ? ») ; aucune frontière d'heure dans la donnée (`nbHeures`, `heurePrevue`… : aucune occurrence).

Réponse mot pour mot :

Merci pour les deux diapos : elles disent la structure mieux qu'une explication. Tes diapos portent déjà l'heure (« Heure 1 », « Heure 2 »), et la frontière est faite de deux rituels — **la question-bilan qui ferme l'heure, « Où en sommes-nous ? » qui ouvre la suivante**. Ta trame dans le site les a aussi : séance 1, diapo 8 « Question-bilan » puis diapo 9 « Où en sommes-nous ? », et la même chose dans les séances 2 et 3.

**Ce que le site fait aujourd'hui, et qui est faux** : il ne connaît pas cette frontière. Il compte les heures d'une séance en divisant la somme des durées par le temps utile (`edtHeuresPour`, L19635) : 110 min / 50 → « heure 1 sur 3 », alors que ta séance est bâtie sur deux heures. L'emploi du temps affiche donc un nombre d'heures qui n'est pas le tien.

**Pour fermer le point, cinq règles** — dis-moi laquelle ne va pas, sinon c'est fermé :

1. **La frontière d'heure est une décision de préparation, portée par la trame.** Chaque diapo appartient à une heure prévue (Heure 1, Heure 2…). Le site propose la coupure d'après les durées, tu la déplaces d'un geste ; la question-bilan est la dernière diapo de son heure, « Où en sommes-nous ? » la première de la suivante. L'emploi du temps lit ce nombre d'heures-là, plus un quotient.
2. **Le bilan se joue toujours.** À T-5, en plus des choix par activité, le site propose **« Aller au bilan »** : un saut devant la classe jusqu'à la question-bilan de l'heure ; les diapos sautées reçoivent leur sort (reporter, maison, annuler, laisser). Tu gardes tes cinq minutes d'agenda.
3. **L'heure 2 s'ouvre sur son rituel, pas sur un signet.** « Où en sommes-nous ? » est fait pour ça. Le pilotage s'ouvre dessus.
4. **Ce qui a été reporté passe après le rituel, avant le programme de l'heure 2.** Le site l'affiche à l'ouverture (« 2 diapos reportées de l'heure 1 »), le volet montre l'ordre réel, le débordement est visible et c'est toi qui valides — jamais résorbé tout seul. Ce qui a été donné à la maison ou annulé n'y est pas.
5. **Une heure 1 terminée sans bilan ni clôture (coupure, oubli) ne perd rien.** Le journal dit ce que la classe a vu ; à l'ouverture de l'heure 2, le site rattrape le T-5 : il te demande le sort des diapos non jouées, puis ouvre le rituel.

**La relecture, comme tu dis** : une par heure, la copie École Directe à chaque fois ; et une relecture de séance, qui met les heures bout à bout avec le sort des reports entre les deux.

Et « une séance = une heure », ton but : avec la règle 1, une séance d'une heure est simplement une séance sans frontière ; rien ne change pour elle.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 22 — Paul

Texte de Paul, mot pour mot :

> quels sont les avantages et inconvénients de ce flux?

---

## TOUR 22 — Claude (conscience n°12)

Aucune mesure nouvelle (conception, sur les lectures des tours 20-21). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Les deux, sans arrondir.

**Avantages**
- **La frontière d'heure est la tienne**, celle de ton PowerPoint, pas un quotient : l'emploi du temps compte les vraies heures, le T-5 sait où est le bilan de l'heure, la relecture par heure tombe juste sur École Directe.
- **L'heure a toujours une fin propre** : le bilan joué, les cinq minutes d'agenda gardées, le sort de ce qui reste décidé sur le moment et pas reconstruit après.
- **L'heure suivante s'ouvre toujours pareil**, sur son rituel, quel que soit l'état de la précédente : tu n'as pas à chercher où on en était, la classe retrouve un cadre stable.
- **Rien ne se perd** : coupure, oubli de clôture, bilan raté — le journal fait foi, et le sort des diapos non jouées se règle à l'ouverture suivante.
- **Préparation et classe parlent la même langue** (Heure 1, Heure 2), et « une séance = une heure » n'est pas une exception, c'est une séance sans frontière.

**Inconvénients, et ce que chacun coûte**
- **Une décision de plus en préparation** : poser ou vérifier la frontière. Le site la propose d'après les durées ; le coût est un regard par séance. Tu le fais déjà dans PowerPoint.
- **Les reports s'empilent** : ce qui passe de l'heure 1 à l'heure 2 recule le programme de l'heure 2, qui déborde à son tour, et ainsi de suite sur une séance de trois heures. Le site le montre à l'ouverture (« l'heure 2 dépasse de 12 min ») et tu tranches à chaque T-5 — c'est le prix d'une progression honnête, mais c'est bien **une charge de décision à chaque heure**, pas une charge en moins.
- **« Aller au bilan » est un saut devant la classe** : elle voit les diapos escamotées, et la relecture les note comme telles. C'est juste, mais ça se voit.
- **L'ordre réel devient propre à chaque classe** (rituel, reports, programme) : la trame ne bouge pas, mais la copie de la classe porte cet ordre, et le volet des vignettes doit le montrer, pas la trame. Plus de choses à tenir par classe — c'est déjà l'architecture arrêtée le 25/08, mais elle pèse ici.
- **La relecture de séance n'est lisible qu'avec les frontières marquées** : chaque diapo doit dire « prévue heure 1, jouée heure 2 », sinon on confond ce qui a glissé et ce qui était prévu.

**Trois trous que ce flux laisse, avec ce que je propose pour les boucher** — à trancher, sinon ce sont des dettes latentes :
1. **Une heure suivante sans rituel préparé** (la séance n'a pas de « Où en sommes-nous ? », ou la classe entame une heure 3 sur une séance prévue en deux) : le site n'invente jamais une diapo ; l'heure s'ouvre sur la première diapo à jouer (reportée ou prévue), et si tu veux un rituel, c'est un appoint, en un geste.
2. **Le T-5 rattrapé** (règle 5) se joue **avant le lancement** de l'heure suivante, dans l'écran d'ouverture — jamais devant la classe.
3. **Tu refuses « Aller au bilan »** parce que tu préfères finir l'activité : c'est ton droit, l'heure se clôt sans bilan, la relecture l'écrit tel quel — pas de bilan à cette heure.

**Ce que j'ai écarté, et pourquoi** : le signet (reprendre où on s'est arrêté) — plus simple à coder, mais il casse le rituel et rend l'ouverture dépendante de l'état de la veille ; le quotient actuel — faux ; le saut automatique au bilan à T-5 — contraire à « il montre, je valide ».

Si les coûts te vont et les trois bouchons aussi, le point est fermé.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 23 — Paul

Texte de Paul, mot pour mot :

> ok mais alors il faudrait que le sort de ce qui n'a pas été fait soit ultra surveillé afin de ne pas avoir de pertes sèches. J'avais dans l'idée qu'on devait le surveiller pour pouvoir quantifier une heure correctement par la suite, mais il faut aussi que ça puisse servir aux élèves qui vont plus vite, ou que ça soit des activités de réserve, ou qui vont dans l'app d'entraînement perso des élèves. Tu vois l'idée? Une activité prévue doit être utilisée, quel que soit son environnement d'utilisation.

---

## TOUR 23 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : `atT5Modale` (les quatre sorts : « reportée à la séance suivante », « donnée à la maison », « annulée », « laissée sans suite »), `atT5Choix` (écrit `AT_T5_CHOIX[n]` puis `_drTraceAuto`), `_drTraceReprendre` L14818 (relit les décisions du même créneau seulement), `edtPhotoDecisions` / `EDT_CLASSEMENT` (décisions d'heures banalisées : autre objet), `EDT.decisions` L19737 ; côté élève : aucun consommateur de « donnée à la maison » ; `plan_de_travail` au hub, lu par `index.html` (corbeille, import) et par `worktrack.html` (×7) seulement.

Réponse mot pour mot :

Je vois l'idée, et elle change la nature du T-5 : ce n'est plus « décide du sort », c'est « place l'activité quelque part ». Je te dis d'abord ce que le site fait aujourd'hui, lu :

**Aujourd'hui, le sort est noté, pas suivi.** Le T-5 propose quatre boutons — reporter à la prochaine séance, donner à la maison, annuler, ne rien donner (`atT5Modale`) — et écrit le choix dans la trace de l'heure (`decisions`). Ensuite : « reportée » n'est réinjectée nulle part (la reprise ne relit les choix que dans le même créneau) ; « donnée à la maison » ne va nulle part côté élève (aucun lien avec le plan de travail ni une app) ; « annulée » et « ne rien donner » sont des pertes que le site accepte sans compter. Ta crainte est fondée : **les pertes sèches existent déjà, et elles sont invisibles.**

**Ce que je propose — la réserve, par classe.** Une activité prévue et non jouée entre dans un registre de la classe, et elle n'en sort que **placée** :
- **à l'heure suivante** (devant la classe, après le rituel — la règle 4) ;
- **en réserve de classe** — pour les élèves qui vont plus vite : elle reste ouvrable depuis ton pilotage (⋯ → « Réserve : 3 activités »), et tu la donnes à qui a fini ;
- **à l'entraînement perso** — elle part dans l'app d'entraînement des élèves, sous une forme qui s'y joue ;
- **annulée, avec un motif** — la seule perte, et elle est assumée et comptée.
**« Ne rien donner » disparaît.** Tant qu'une activité n'est pas placée, elle est « en attente », et le site la relance : à l'ouverture de l'heure suivante, dans la relecture, dans le profil de classe, et par un compteur permanent — « 2 activités en attente » — sur le pilotage et la case de l'emploi du temps, comme les heures perdues. Rien ne s'efface, rien ne se tait.

**Ce que ça donne pour tes trois usages** : quantifier l'heure — la relecture dit, par heure, le temps prévu, le temps joué, ce qui est parti en réserve, à l'entraînement, ou annulé et pourquoi ; les élèves rapides — la réserve est à portée pendant l'heure ; l'entraînement perso — l'activité y vit, et **son « fait » remonte** : le profil de classe dit « prévue heure 1 · faite à l'entraînement par 12 élèves », sinon on ne saurait pas si la place a servi.

**Ce que ça coûte, sans le cacher** : une activité doit pouvoir se jouer hors du tableau — une consigne à étapes, une question avec sa réponse attendue, une fiche, ça se transporte ; une image à commenter ou un schéma, il faut décider comment ; et l'environnement de destination doit savoir dire « fait » à la classe d'origine.

**Ma question, une seule, pour cadrer le sort « entraînement perso »** : **l'app d'entraînement perso des élèves, c'est laquelle aujourd'hui** — le plan de travail de worktrack (le seul endroit du hub qui porte `plan_de_travail`), ou une app qui n'existe pas encore ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 24 — Paul

Texte de Paul, mot pour mot :

> une app qui n'existe pas encore. Et c'est là la grande difficulté: il faudrait que je puisse me débrouiller analogiquement. En gros, je prends la feuille de l'activité non faite et je la donne aux élèves qui sont allés plus vite. Ou je leur donne une consigne orale... Rien n'est vraiment satisfaisant. Et le suivi numérique est faisable, mais de manière régulière, illusoire (je ne peux pas réserver des tablettes systématiquement à toutes les heures).

---

## TOUR 24 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; l'onglet Papier du moteur existe, vu au tour 11 : `dr_vue('papier')`). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Alors on cadre avec ce qui existe — le papier et toi — et pas avec une app qui n'existe pas. Trois choses.

**1. L'entraînement perso sort du chantier, la trace y reste.** Tant que l'app n'existe pas, « à l'entraînement » n'est pas une sortie. La réserve garde chaque activité avec son histoire (prévue heure 1, non jouée, en réserve depuis le 8/9) : le jour où l'app existe, elle a de quoi se remplir. Rien ne se perd, et on ne code pas un pont vers le vide.

**2. La réserve est du papier, et le site le prépare.** Le site sait déjà mettre une séance sur papier (l'onglet Papier). La réserve, c'est le même savoir-faire à l'activité : **une feuille par activité en réserve** — consigne et étapes, ou question, ou fiche — sur une demi-page, la réponse attendue à part pour toi. Elle se sort au bon moment : **à la clôture de l'heure**, la relecture dit « à imprimer avant la prochaine fois : 2 activités en réserve » ; tu imprimes chez toi ou en salle des profs, tu arrives avec. Une image à commenter ou un schéma se mettent sur la feuille aussi, en noir et blanc — ça se lit. La consigne orale reste possible : c'est une réserve « sans feuille », elle se note pareil.

**3. Le suivi, c'est toi, d'un geste, sans tablette.** Quand tu donnes une réserve à un élève qui a fini, tu tapes ses initiales et tu choisis l'activité — le même geste que la participation, motif « réserve ». En fin d'heure aussi, en bloc, si tu n'as pas eu le temps. Ce qui se suit, c'est **qui a reçu quoi** ; la correction reste sur le papier, entre l'élève et toi. Le profil de classe dit « Analyse d'images : prévue heure 1 · donnée en réserve à 5 élèves » — c'est vrai, c'est régulier, et ça ne demande rien à personne d'autre que toi.

**Ce que ça ferme** : les sorties d'une activité non jouée sont **trois** — à l'heure suivante, en réserve (papier), annulée avec motif. Une réserve jamais donnée reste « en attente » et le site le rappelle jusqu'à la fin du chapitre, où il te demande son sort définitif. Pas de « ne rien donner », pas de perte silencieuse.

**Ce que ça ne fait pas, pour être net** : le site ne sait pas si l'élève a réussi la réserve ; il sait qu'il l'a reçue. Le jour de l'app, ça changera.

Si ça te va, le sort des activités non jouées est fermé, et je passe au suivant : ce que devient la copie d'une classe quand tu modifies la trame après coup.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 25 — Paul

Texte de Paul, mot pour mot :

> oui mais ça me demande encore quelque chose à gérer. par ailleurs tu parles de structure (la réserve et son emploi). mais ce qui importe, c'est le contenu: une réserve de séance 1 qui traîne jusqu'à la séance 7 et qui est donnée à ce moment là, c'est pas propre. par ailleurs, la réserve doit être imprimée au complet pour une classe, parce qu'on ne sait jamais à l'avance qui aura terminé avant.

---

## TOUR 25 — Claude (conscience n°12)

Aucune mesure nouvelle (conception). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Tu as raison sur les trois. Je réduis.

**1. Une activité vit dans sa séance, pas au-delà.** Une réserve de la séance 1 n'a rien à faire à la séance 7 : le contenu est périmé. Donc **plus de registre qui traîne** : ce qui n'est pas joué pendant une séance se règle **dans la séance**, et à sa dernière heure ce qui reste est compté « non fait » — assumé, quantifié, jamais caché, mais **sans rien à gérer**. Les sorts se réduisent à ce qu'ils sont vraiment : à l'heure suivante (tant que la séance continue), en réserve papier, ou non fait. Le compteur « en attente » disparaît avec le registre : ce qui importe se lit dans la relecture de l'heure et de la séance.

**2. Le contenu commande, pas la structure.** La quantification, elle, est automatique : le journal du tableau sait ce qui a été joué ; la relecture dit par heure ce qui ne l'a pas été. Tu n'as rien à saisir pour ça. Le suivi « qui a reçu la feuille » que je proposais te coûte un geste : **il devient facultatif** — un clic si tu veux savoir, rien sinon.

**3. La réserve s'imprime au complet.** Une feuille de réserve = les activités non jouées de la séance, mises en page pour être faites seul sur papier, et le site la sort **en un PDF que tu imprimes pour toute la classe** — parce que tu ne sais pas qui aura fini. Ce qui en reste après l'heure suit ton usage d'aujourd'hui.

Ce qui te reste à gérer, et rien d'autre : au T-5, un clic par activité non jouée (heure suivante / réserve / non fait), et l'impression.

**Ma question, une seule, sur le moment de l'impression** : le paquet papier de réserve, tu le veux **prêt avant la séance** — le site imprime d'avance, dès la préparation, les activités de la séance qui se font seul sur papier, à tout hasard —, ou **après l'heure 1** — seulement celles qui n'ont pas été jouées, donc imprimées entre deux heures ? La première te donne toujours quelque chose sous la main, mais imprime pour rien ; la seconde imprime juste, mais suppose un passage à l'imprimante entre les deux heures.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 26 — Paul

Texte de Paul, mot pour mot :

> fais moi un flux en classe réelle sur mes créneaux, disons en franklin par exemple. je n'arrive pas à visualiser dans ma tête ce que ça donnerait.

---

## TOUR 26 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : grille appariée du sas (3 FRANKLIN Aretha → 3E Charles de Gaulle : lundi 08:57-09:52 AB, mardi 15:07-16:02 A/B, mercredi 10:07-11:02 A/B, jeudi 16:04-16:59 B, vendredi 10:07-11:02 AB), créneaux 2026-2027 (temps utile = fin − début − 5), trame test séance 1 (18 diapos, rituels aux diapos 8 et 9) et séance 2.

Réponse mot pour mot :

Semaine B, celle du 7 septembre, 3 Franklin Aretha (grille appariée : lundi 08:57, mardi 15:07, mercredi 10:07, jeudi 16:04, vendredi 10:07). Séance 1 « Poésie et peinture : le Romantisme en question », 18 diapos, deux heures dans ta trame — heure 1 : diapos 1 à 8, la 8 étant « Question-bilan » ; heure 2 : diapos 9 à 18, la 9 étant « Où en sommes-nous ? ». Voilà ce que ça donne, heure par heure. Ce qui est écrit *ainsi* est ce que le site fait tout seul.

**Lundi, 08:57-09:52 — heure 1**

08:55. Tu ouvres le portable en salle. Le site s'ouvre sur ton emploi du temps, la case du moment est en or : « 3 Franklin · 08:57-09:52 · Poésie et peinture, heure 1 sur 2 ». Un clic : le pilotage, plein écran, prêt — la diapo 1 au centre, tes notes dessous, le volet des vignettes à gauche, rien d'autre. Tu fais Win+K, la fenêtre du tableau part sur le vidéoprojecteur. Si Win+K ne marche pas, l'ordi de classe est sur l'adresse du tableau et il attend.

09:01. La classe est installée. Tu cliques **Lancer**. *L'heure commence à 09:01, elle finit à 09:52 : 46 minutes utiles, le site le dit dans le bandeau, et il recale les horaires prévus des diapos.* Le tableau montre la diapo 1. Ton écran montre la même, plus le gris des étapes non dévoilées, plus tes notes : « rassurer sur l'orthographe ». *Le journal commence : « 09:01, la classe est sur la diapo 1 ».*

09:01-09:11. Tu dévoiles les étapes 1, 2, 3 à la flèche. *Chaque dévoilement s'écrit.* Les élèves écrivent leur tableau à trois colonnes. Tu veux regarder ce que tu as prévu sur le tableau 3 : tu cliques la vignette 4 — **« La classe te suivrait — sauter à la diapo 4. Geler d'abord ? »** — Entrée. *Le tableau reste sur la diapo 1, étape 3. Le journal ne bouge plus.* Tu regardes la 4, la 5, tu reviens à la 1. Tu cliques ❄ : *tu es revenu là où est la classe, le dégel est silencieux, rien ne s'est écrit.* Tu dévoiles l'étape 4.

09:14. Zélia répond. Tu tapes « ze », un seul nom, Entrée, motif 1. *« 09:14, Zélia, diapo 1, motif 1 ».* Elle a dit « le sublime » sans le mot : touche N, tu écris « Line : le sublime sans le mot — reprendre au bilan », Entrée, N. *La note prend 09:14 et la diapo 1. Rien de tout ça au tableau.*

09:17-09:40. Tableaux 1 à 5, les images. Tu passes de l'une à l'autre à la flèche (*le fil normal, aucune question*). Sur le Friedrich, tu traces un cadre à la loupe : le tableau grossit le voyageur, le texte ne bouge pas. Sur la diapo 7, « Les hypothèses de la classe », les 22 minutes prévues. La colonne de droite dit « 3 min de retard sur le prévu », en rouge : tu le sais, tu continues.

09:47. **T-5.** *Le bandeau paraît : il reste 5 minutes d'agenda ; la diapo 8, la question-bilan, n'a pas été jouée, et la 7 est en cours.* Il propose **« Aller au bilan »**. Tu cliques : *saut devant la classe à la diapo 8 — le journal l'écrit, la 7 est marquée « interrompue à 09:47 »*. Tu poses la question-bilan, trois réponses, tu prends la parole de Clovis (motif 2).

09:50. Tu cliques **Fin de l'heure**. *L'écran de clôture : « heure 1 close à 09:50 ; 7 diapos jouées, la 7 interrompue ; 2 prises de parole ; 1 note ».* Pour la 7, un choix — **heure suivante / réserve / non fait**. Tu choisis « heure suivante » : les hypothèses, il faut les finir devant tout le monde. *Deux boutons : copier pour École Directe « contenu de séance », copier « travail à faire ».* Tu colles, tu fermes. Les élèves notent l'agenda. 09:52.

Chez toi, le soir, si tu veux : l'onglet Relecture de cette heure. Tout y est, dans l'ordre : 09:01 diapo 1, les quatre étapes, Zélia, la note, 09:17 Tableau 1… 09:47 saut au bilan, Clovis. Diapo par diapo : joué / interrompu, 6 min au tableau pour 5 prévues. Rien de ce que tu as fait pendant le gel n'y est.

**Mardi, 15:07-16:02 — heure 2**

15:05. L'emploi du temps : « 3 Franklin · heure 2 sur 2 ». Le pilotage s'ouvre **sur la diapo 9, « Où en sommes-nous ? »** — ton rituel. *Au-dessus du volet : « reportée de l'heure 1 : Les hypothèses de la classe (22 min, interrompue) — elle passe après le rituel ; l'heure 2 dépasse de 14 min ».* Le volet montre l'ordre réel : 9, puis la 7, puis 10 à 18. Tu vois le débordement, tu décides : tu réduis la 7 à 10 minutes d'un clic sur sa durée, le débordement tombe à 2 minutes. *C'est toi qui valides, le site ne résorbe rien.*

15:08. Lancer. Le rituel : « Quel mot avons-nous employé pour ce qui manque à l'image ? » — la réponse attendue est en gris chez toi, pas au tableau. Tu la dévoiles quand ils ont trouvé.

15:12-15:22. La 7, les hypothèses, finies. *Journal : « diapo 7 (reportée de l'heure 1), 15:12-15:22 ».*

15:22-15:57. Diapos 10 à 17. À 15:40, sur « Les règles héritées », tu gèles pour préparer la suite pendant qu'ils copient ; tu vas jusqu'à la 14, tu reviens à la 11, ❄ — *silencieux*. Une fois, tu dégèles sans être revenu : **« La classe est sur la diapo 11, tu es à la diapo 14. »** — tu cliques « Revenir là où est la classe, puis dégeler ». *Rien ne s'est écrit.*

15:57. **T-5.** Les diapos 16 et 17 ne sont pas jouées ; la 18, « Question-bilan et travail à faire », l'est encore moins. **Aller au bilan** : saut à la 18. Pour la 16 et la 17, à la clôture : c'est la dernière heure de la séance, « heure suivante » n'existe plus — **réserve** ou **non fait**. La 16, « Placer les poètes », se fait seul sur papier : réserve. La 17, un débat : non fait, motif « pas le temps ». *Comptés tous les deux dans la relecture, aucun ne disparaît.*

16:00. Clôture, École Directe, agenda. *La relecture de l'heure est prête ; la relecture de séance aussi : les deux heures bout à bout, la 7 « prévue heure 1, jouée heure 2 », la 16 en réserve, la 17 non faite avec son motif.* *Elle te dit : « à imprimer pour la 3 Franklin : 1 activité en réserve, PDF ×29 ».* Tu imprimes mercredi matin en salle des profs.

**Mercredi, 10:07-11:02 — séance 2, heure 1**

Tu arrives avec les 29 feuilles de « Placer les poètes ». La séance 2, « L'Albatros », s'ouvre sur sa diapo 1. Quand les premiers ont fini l'activité 3, tu leur tends la feuille. Si tu veux le noter : initiales, « réserve ». Sinon rien. La séance 1 est close ; sa réserve a servi ou pas — elle ne réapparaîtra pas à la séance 7.

Deux hypothèses que j'ai prises pour écrire ça, à confirmer ou à changer : l'impression **entre les deux heures** (mardi soir, pour mercredi), pas d'avance ; et une réserve qui ne survit pas à sa séance — la 16 se donne mercredi ou jeudi, puis c'est fini.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 27 — Paul

Texte de Paul, mot pour mot :

> donc ça veut dire des impressions sans savoir si elles vont servir: rhédibitoire. par ailleurs, que se passe t-il si j'affiche un bloc que je ne voulais pas afficher et que je reviens aussitot en arrière? (je le dévoilerai quand même après) mais du coup, il s'écrit deux fois? Enfin, si je modifie dans les blocs grisés, et ce en pleine séance, j'avais normalement dans mon ancien déroulé la possibilité de garder la modif ultérieurement et de la répercuter dans l'écriture du chapitre.

---

## TOUR 27 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : le papier du moteur L1387-1410 (récit « Ce qu'on a fait aujourd'hui » + fiches à coller, pas de feuilles d'activité), `lire()` (édition directe des blocs), `atDrEnrAuto` L14906 (en classe rien ne remonte à la préparation), `atDrModifsDeLaSeance` L14564 (comparaison copie / trame par identité `eid`, « Tu as modifié n choses »), CADRAGE-TEMPS §7 (les trois natures de travail).

Réponse mot pour mot :

Rédhibitoire, donc retiré. Les trois points :

**1. Plus aucune impression que tu n'as pas demandée.** J'ai relu ce que le Papier du site produit aujourd'hui : « ce qu'on a fait aujourd'hui » à relire, et les fiches à coller — pas les feuilles d'activité. Celles que tu donnes aux élèves rapides sont les tiennes, déjà là. Alors la réserve ne s'imprime pas : **elle se donne avec ce que tu as** — ta feuille, le cahier, ou l'oral. Le site fait une seule chose : pendant l'heure, **⋯ → « Réserve de la séance »** te montre les activités mises en réserve, avec leur consigne lisible pour la dicter, et **un clic les affiche au tableau en encart « pour ceux qui ont fini »** pendant que les autres travaillent — c'est une publication au tableau, donc elle se note. Si un jour tu veux une feuille, tu la demandes, PDF d'une activité seule, jamais tout seul. Rien à gérer, rien à imprimer.

**2. Un bloc dévoilé par erreur, revoilé aussitôt, dévoilé plus tard : une seule ligne, à l'heure où il est resté.** Deux règles :
- **Revoiler efface.** L'apparition d'une seconde reste dans le fil détaillé (« 09:14:02 apparu, 09:14:04 retiré ») parce que la classe l'a vue, mais **le récit et le compte de dévoilement ne gardent que ce qui est resté visible** ; quand tu le dévoiles pour de bon à 09:20, c'est cette heure-là qui compte, une fois. Pas de seuil : c'est ton geste de revoiler qui annule.
- **◀ sur la même diapo est un geste du fil, sans garde** : corriger une erreur devant la classe se fait d'un clic, pas de « geler d'abord ? ». La garde ne reste que pour changer de diapo en arrière et pour sauter. (Dans la v8, ◀ déclenche la garde : c'est à corriger dans la maquette.)

**3. Modifier un bloc grisé en pleine séance, garder la modif, la répercuter dans le chapitre : oui, et c'est déjà la règle du 25/08.** Ce que tu écris en classe vit dans la copie de la classe (rien ne remonte tout seul — `atDrEnrAuto` : « en classe, rien ne remonte à la préparation »). À la clôture, le site compare la copie à la trame, diapo par diapo, par identité (`atDrModifsDeLaSeance`, corrigé après ton test du 23/08), et te dit : « tu as modifié 2 diapos — verser dans le chapitre ? », chacune avec oui / non. La relecture marque « modifié en séance ». La base saine garde exactement ça : copie de classe, comparaison par identité, versement par ton geste, jamais automatique.

Ce que ça ferme : la réserve (sans papier, sans registre, au tableau ou à l'oral, dans la séance seulement), l'erreur de dévoilement, la modification en séance.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 28 — Paul

Texte de Paul, mot pour mot :

> il y a aussi autre chose: tout le système de zoom avait aussi été créé parce que j'utilise ppt en édition quand je suis en classe et que je note les réponses des élèves notamment en cas de mise en commun. C'est ce qui me permet aussi de faire le suivi de la mise en commun et des participations élèves.

---

## TOUR 28 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : dans le moteur, `partAjoute` L1085 / `partRetire` L1092 (participation par initiales, avec écran, activité, heure, type, note), `bascule` L1543 (réponse « reformulée »), `quiParle` L2505, `lire()` (les réponses `reps[k].i` initiales et `reps[k].r` texte saisies dans la diapo).

Réponse mot pour mot :

Ça change l'écran de classe, et c'est heureux que tu le dises maintenant : ce n'est pas un présentateur, c'est **un présentateur où tu écris dans la diapo pendant l'heure**. PowerPoint en édition, c'est ça — et le zoom servait à rendre lisible au mur une vue d'édition faite pour ton écran. Voilà ce que ça fixe.

**1. La diapo se modifie en direct, au clic, pendant l'heure.** Un clic dans une question ouvre une réponse ; tu tapes les initiales (le site trouve l'élève, comme la participation), la réponse, Entrée : la suivante. Tu peux marquer « reformulée ». Les blocs grisés se retouchent pareil. Tout ça vit dans la copie de la classe, et la relecture liste les réponses **par élève** — c'est ton suivi de mise en commun, sans autre saisie. L'ancien déroulé le fait déjà (`reps` avec initiales, `refo`, `partAjoute`) ; on le garde tel quel.

**2. Ce que tu tapes apparaît au tableau, en grand, au fil de la frappe.** Le tableau n'est plus ta vue d'édition réduite : c'est la diapo plein écran, à la taille du tableau, et l'état publié comprend le texte en train de s'écrire. Le zoom-pour-lire-l'édition n'a plus de raison d'être ; ce qui reste est ce qu'on a dit : la taille du texte au tableau, la loupe.

**3. C'est exactement le cas qui plantait, et la base saine le tient autrement.** Écrire huit réponses dans une question fait déborder la diapo. L'ancien moteur coupait la donnée pendant que tu tapais — et te déplaçait. Ici l'écriture ne touche que la donnée ; l'affichage se pagine ; **la page suit ce que tu écris**, sur ton écran et au tableau ; rien n'est coupé, rien ne bouge sous tes doigts. Pendant le gel, tu écris sans que la classe voie, et tout paraît au dégel.

**4. Dans le journal** : une réponse est un événement (heure, diapo, élève, texte, reformulée ou non) écrit quand elle paraît au tableau — donc au dégel si tu l'as saisie gelé. Elle compte comme prise de parole de l'élève ; tu n'as pas à la ressaisir dans la participation.

**Ma question, une seule** : pendant la mise en commun, la classe voit-elle la réponse **au fil de la frappe** (lettre par lettre, comme PowerPoint en édition), ou **seulement quand tu fais Entrée** ? La première est fidèle à ton usage ; la seconde est plus propre au mur et donne une ligne nette au journal.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 29 — Paul

Texte de Paul, mot pour mot :

> oui c'est au fil de la frappe. mais actuellement dans le moteur je ne suis pas sûr que ce soit ça, parce qu'il faut encore que je dégrise pour que ça s'affiche (ce qui me coute un geste de plus, il faudrait effectivement que je n'ai que le gel à gérer).

---

## TOUR 29 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : moteur L648-656 (rendu des réponses pour la classe : `if(pourClasse&&k>=(b.vues||0))return`, et le bloc doit être dévoilé : `j<e.rev-1`), `ligne()` L1442-1445 (Entrée : nouvelle réponse et `vues = max(vues, k+1)`).

Réponse mot pour mot :

Tu as raison, et je l'ai vérifié dans le moteur : une réponse n'apparaît au tableau que si son rang est en dessous de `vues` (L652, « les réponses arrivent une par une »), et `vues` ne monte qu'à Entrée (`ligne`, L1442) — pendant la frappe, la classe ne voit rien ; et il faut en plus que le bloc question soit dévoilé (`rev`). Deux gestes de trop, comme tu dis.

**La règle, dans la base saine — une seule chose à gérer, le gel :**
- **Le gris, c'est ce qui est préparé et pas encore montré.** Ce que tu écris en classe n'est jamais gris : **il paraît au tableau au fil de la frappe**, lettre par lettre, sauf si le tableau est gelé — alors tout paraît au dégel.
- **Écrire dévoile.** Cliquer dans une question grisée pour y noter une réponse la dévoile de lui-même ; pas de flèche avant, pas d'Entrée après pour « montrer ».
- **Entrée passe à la réponse suivante**, c'est tout ce qu'elle fait.

**Dans le journal** : une réponse est une ligne, pas une par lettre — « 09:14, Zélia : « le sublime », reformulée » —, ouverte à la première lettre au tableau, close quand tu passes à la suivante ou que tu quittes le bloc. Elle compte comme prise de parole. Rien à ressaisir.

**Ma question suivante, une seule — un cas tordu entre deux heures.** Lundi, la 3 Franklin joue l'heure 1 : tu notes quatre réponses dans la question de la diapo 7. Lundi soir, tu corriges la consigne de la diapo 10 dans le chapitre. Mardi, l'heure 2 s'ouvre : **elle part de la copie de la classe (avec les quatre réponses, mais l'ancienne consigne de la 10), ou de la trame (avec ta consigne corrigée, mais sans les quatre réponses) ?** Ce que je propose : la copie de la classe est la vérité pour tout ce qui a été joué (les réponses restent), et **le site te montre à l'ouverture ce qui a changé dans la trame depuis** — « la diapo 10 a été modifiée lundi soir — prendre la nouvelle version ? » — diapo par diapo, seulement pour celles pas encore jouées par cette classe. Ni tout l'un, ni tout l'autre.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 30 — Paul

Texte de Paul, mot pour mot :

> attention: prendre la nouvelle version ne veut rien dire (prendre?). et je ne sais pas. on part du principe que tout ce qui a été joué en classe est immuable. on ne change pas le passé. Si modification ultérieure il y a, pour un élément que la classe a déjà vu affiché et noté dans le cahier et la relecture, ça ne les concerne pas. la modification sera pour l'autre classe, si son activité n'a pas encore été jouée, ou pour les classes de l'année prochaine. ça tient?

---

## TOUR 30 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; appui sur CADRAGE-TEMPS §13 et `atDrModifsDeLaSeance`). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Ça tient, et c'est plus simple que ce que je proposais — « prendre » disparaît, et la question avec. Je l'écris en règle :

**Ce qui a été au tableau est immuable, pour la classe qui l'a vu.** Une diapo, dès qu'elle a été montrée à une classe, est figée pour cette classe : sa copie la garde telle qu'elle était, avec les réponses écrites dedans, et la relecture la relit ainsi, pour toujours. On ne change pas le passé.

**Ce qui n'a pas encore été montré se lit dans la trame, telle qu'elle est ce jour-là.** Pour une autre classe, pour la même classe à l'heure suivante, pour l'année prochaine : la modification s'applique d'elle-même, sans rien demander. Le site le dit — une mention « modifiée depuis lundi » sur la vignette — il ne pose pas de question.

Donc la copie d'une classe ne se fait plus « au démarrage » d'un bloc, comme arrêté le 25/08 : **elle se fait diapo par diapo, à la première apparition au tableau.** C'est la seule retouche à l'architecture à trois objets, et elle va dans ton sens.

**Deux cas tordus que la règle règle d'elle-même :**
- la diapo 7 jouée à moitié lundi, reportée, corrigée lundi soir : elle a été au tableau, elle est figée — mardi la classe la finit dans la version de lundi, avec ses réponses ;
- une diapo supprimée de la trame après avoir été jouée : la copie la garde, la relecture aussi ; une diapo ajoutée avant la partie non jouée : elle arrive à l'heure suivante, comme le reste de la trame.

**Et le versement dans le chapitre** reste ce qu'il est : ce que tu as modifié *en séance* vit dans la copie, et c'est ton geste qui le fait entrer dans la trame — pour les autres et pour l'an prochain, jamais pour le passé.

Avec ça, le sujet « la classe » est fermé de bout en bout : le tableau et ses deux supports, le gel et ses deux gardes, le journal, la relecture par heure et par séance, les heures d'une séance et leurs rituels, le T-5 et « aller au bilan », les activités non jouées et la réserve, la mise en commun au fil de la frappe, l'immuabilité. **Je propose de l'écrire maintenant en un document de cadrage — « CADRAGE 1 · LA CLASSE » —, ici, dans la conversation, pour que tu le relises ligne à ligne avant tout dépôt.** Puis la préparation, qui est le sujet suivant. Dis-moi.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 31 — Paul

Texte de Paul, mot pour mot :

> Relis la totalité du déroulé actuel et du jeu en classe pour vérifier tout ce que tu as laissé de côté.

---

## TOUR 31 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript et ses deux pièces) : inventaire du moteur (`pieces/T31-inventaire-moteur.txt` : interface L387-438, raccourcis, 157 fonctions avec leurs commentaires) ; inventaire du pont (`pieces/T31-inventaire-pont.txt` : 130 fonctions `_dr*`, `atDr*`, `atT5*`, `atVecu*`, `ses*`, `dr*` avec leurs commentaires) ; `DEROULE/CADRAGE-TEMPS.md` §5, §6, §7, §8, §10, §11, §12 ; `DEROULE/CADRAGE-INTEGRATION.md` (chaîne, vocabulaire du tableau, trois temps, arbitrages ouverts).

Réponse mot pour mot :

Relu en entier : le moteur (2 682 lignes, 157 fonctions, son interface, ses raccourcis), le jeu en classe dans le pont (`_dr*`, `atDr*`, `atT5*`, `atVecu*`, `ses*`, 130 fonctions), et les deux cadrages du 25/08 (le temps, l'intégration). Voilà tout ce que j'avais laissé de côté — rangé en trois piles : **oublié et à cadrer**, **à reprendre tel quel** (ça existe, ça marche, rien à décider), **tombe** avec la base saine.

**① OUBLIÉ — à cadrer, avec une décision de toi pour chacun**

1. **« Donner à la maison » — je l'ai supprimé à tort.** Le cadrage du temps (§5, §7) le définit : *le prolongement* — une activité non faite, basculée sur le cahier avec une date d'échéance, qui garde ses notions et compte dans la progression, marquée « donnée à la maison le … » à la séance suivante, et qui entre dans « Travail à faire », dans le récit, dans École Directe. Ce n'est pas l'app d'entraînement, c'est le cahier. **Il doit revenir parmi les sorts** : heure suivante · réserve · **à la maison (avec échéance)** · non fait.
2. **La coche d'attestation du bilan** (§6) : « dès qu'une diapo bilan est atteinte, une coche apparaît ; si je la coche, la séance est terminée et les élèves ont écrit le bilan ». Le bilan est un bloc de type propre, unique, toujours dernier, rien ne s'insère après lui. Je n'ai parlé que d'« aller au bilan », jamais de la coche qui **termine la séance**.
3. **Les compétences par diapo et le coût des sorts** : chaque diapo déclare ses notions (`atDrCompChange`, la taxonomie) ; le T-5 affiche le coût en compétences de chaque choix ; et la **règle générale des alertes** (§10) : une alerte regarde ce qui est prévu ailleurs (« il faudra y revenir, c'est prévu séance 6 ») et disparaît d'elle-même. Rien de ça dans mon cadrage.
4. **L'absence** (§11) : saisie en classe, jamais montrée ; le site produit pour l'absent le récit du jour, le travail donné, le message ; déclaration de mise à jour par l'élève. J'ai mis « absents » sur la maquette sans le mécanisme.
5. **La mise en commun, en entier** : la palette (Maj+Espace : initiales en grand, et *où va la réponse* — dans la consigne, comme réponse au tableau, nulle part), le VIF joignable de n'importe où (² ou F2), l'historique complet d'un élève (`histoire`), corriger ou supprimer une prise de parole après coup, aller à la réponse depuis l'élève, les prénoms réels au tableau et les initiales chez toi, **les collisions d'initiales** (deux élèves, mêmes lettres). Je n'ai cadré que « initiales + motif ».
6. **Les blocs, en profondeur** : les **marques sur une image** (annotations posées et dévoilées une par une, Delete, Échap), les **schémas** (carte, frise, arbre, cycle, tableau — positions calculées, déplaçables à la main), la **fiche annotée par la classe** (couche d'annotation par classe, fiche A4, papier à coller), le **bloc rappel** (prérequis), la **loupe sur une fiche**, l'image collée ou glissée (Ctrl+V). J'ai cadré « les cinq blocs » comme des mots.
7. **Le récit figé et retouché à la main** (`figeRecit`) contre le récit automatique — un choix de relecture que je n'ai pas repris.
8. **Une heure restée ouverte** : « une heure close ne se reprend plus, par aucun chemin » ; la bannière « une heure est ouverte — reprendre ? » qui vérifie à chaque passage ; lancer une autre heure clôt la précédente. Je l'ai listé en cas tordu sans règle.
9. **Le mode test** : le nouveau pilotage écrit-il au hub de test quand tu es en test ? Cité, pas cadré.
10. **Les incidents en classe** : le 24/08, une exception avalée a rendu le pilotage muet en pleine heure ; depuis, tout incident se voit (`sesIncident`). La base saine doit garder cette règle : **le pilotage ne se tait jamais**.
11. **Le QR code** (ouvrir le tableau ou le téléphone d'un appareil) et **le temps réel** : décidé le 25/08 en websockets, aujourd'hui un sondage toutes les 900 ms. À trancher pour le tableau distant.
12. **Les documents du chapitre** (l'onglet Documents, les ressources Drive/URL reliées aux diapos) et **le lien avec les feuilles de l'atelier** (les blocs schéma/frise que les feuilles n'affichent pas — la dette « priorité » du registre). Hors de mon cadrage.
13. **Ce que l'élève reçoit après l'heure** : le récit « ce qu'on a fait aujourd'hui », les fiches, le travail à faire, l'envoi ou la publication de la feuille de séance. C'est une sortie que je n'ai pas décrite.
14. **Le vocabulaire du tableau** vérifié avec toi le 25/08 (écran de pilotage · tableau · tableau autonome) et **les arbitrages restés ouverts** : bandes claires au tableau, étiquettes redimensionnables, types de schémas retenus, cartes trop denses, code de couleurs du surlignage, sort d'une séance close.

**② À REPRENDRE TEL QUEL** (je les nomme pour qu'ils soient dans le cadrage, pas pour en discuter) : la clé d'une heure (date + créneau + classe) et sa signature ; « le cours actif n'est que le reflet de la trace ouverte » ; la trace écrite au fil et la reprise dans le même créneau (chrono accumulé, décisions conservées) ; l'identité des diapos (`eid`) et le rang local par appareil ; les horaires prévus recalculés depuis le début réel ; la loi de taille du texte (32 pt = 5,6 % de la hauteur de la boîte) ; le chrono, « chrono au tableau », « qui a participé » au tableau avec les prénoms ; G / S / surligner / effacer / annuler (Ctrl+Z) ; « à écrire » et « mettre en lumière » ; l'enregistrement automatique de la préparation et son vidage au changement de séance ; le tableau distant terminal muet qui garde sa dernière image ; l'appoint ; la tête du déroulé (classe, créneau, début, maintenant).

**③ TOMBE** : le cadre (iframe) et sa vérification d'intégrité, les six enveloppes, la scission et sa refusion, `vues`/`rev` comme état, le zoom-texte du moteur, la reconstruction du cadre, le téléphone actuel (à refaire plus tard), la modale « tu as modifié n choses » telle quelle (remplacée par le versement diapo par diapo, même mécanisme).

Ce que je propose : je reprends la pile ① dans l'ordre, un point par tour, avec une seule question chacun — en commençant par le 1, parce que c'est une erreur de ma part à corriger. Dis-moi si l'ordre te va.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 32 — Paul

Texte de Paul, mot pour mot :

> et le clic droit?

---

## TOUR 32 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : moteur `menuEcran` L2137-2156 (menu d'une diapo), `ctx*` L2160-2185, le clic droit sur le contenu L2349-2382 (bloc, étape/réponse, image, suite), `sousTab`/`cs*`/`cb*`/`sel*` L2383-2412 (presse-papier `presse`, `neuf_`), sélection par cadre L2186-2245 ; site `ctxOuvrir` L11637, `ctxSommaireCible` L11730, `_drEntreesEcran` L15929 (Ouvrir · Dupliquer ici · Envoyer vers « séance » · Supprimer).

Réponse mot pour mot :

Oublié aussi, et il est partout. Relu — trois menus au clic droit, plus la sélection :

**1. Sur une diapo, dans la colonne des vignettes ou le sommaire** (`menuEcran`) : Ouvrir cet écran · Dupliquer l'écran · Insérer un écran vide après · Monter · Descendre · Supprimer l'écran. (Et pour une « suite » du zoom : supprimer la suite, tout replier — ça tombe avec le découpage.)

**2. Sur un bloc, dans la diapo** : Supprimer ce bloc · Dupliquer · Monter · Descendre · Copier · Coller ici · Couper. **Sur une étape ou une réponse** (clic droit sur la ligne) : Supprimer cette étape / cette réponse · Dupliquer · Monter · Descendre. Sur une **image** : seulement Supprimer (dupliquer et déplacer « télescopent la mise en scène », correctif n°95). Le presse-papier tient plusieurs blocs et survit d'une diapo à l'autre, et un bloc collé est « neuf » — jamais montré, pas encore assumé.

**3. La sélection par cadre** : clic gauche maintenu sur le fond, on tire un rectangle sur plusieurs blocs → copier, couper, supprimer, « à écrire » sur le lot.

**4. Dans le site, sur un écran de la colonne chapitre** (`_drEntreesEcran`) : Ouvrir · Dupliquer ici · **Envoyer vers « telle séance »** (déplacer une diapo d'une séance à une autre) · Supprimer — le même menu que celui du chapitre, étendu.

**Ce que ça donne dans la base saine — à trancher, une seule question à la fin :**
- **En préparation, tout ça reste, tel quel** : c'est la structure — dupliquer, insérer, monter, descendre, supprimer, copier-coller, envoyer vers une autre séance, la sélection par cadre. Ça va dans le sujet « préparation ».
- **En classe, le clic droit change de sens.** Il ne doit pas restructurer la séance devant les élèves (supprimer une diapo en pleine heure, c'est modifier la copie de la classe, donc le passé possible). Ce qui a du sens en classe, sur un bloc ou une étape : **mettre en lumière · à écrire · revoiler celui-ci · aller à la réponse de tel élève** ; sur une diapo du volet : **y aller** (avec la garde), **la mettre en réserve maintenant** (au lieu d'attendre le T-5), **l'envoyer à la maison**. Et rien qui coupe, colle ou déplace.

**Ma question** : en classe, veux-tu **un clic droit réduit à ces gestes de classe** (lumière, à écrire, revoiler, réserve, maison, aller à) — ou **le même clic droit qu'en préparation**, complet, quitte à toucher la copie de la classe en pleine heure ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 33 — Paul

Texte de Paul, mot pour mot :

> Il faut que je puisse supprimer une diapo en classe dans celles que je n'ai pas jouées

---

## TOUR 33 — Claude (conscience n°12)

Aucune mesure nouvelle (conception). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Entendu. Ça fixe le clic droit en classe, et une règle de plus :

**Le clic droit en classe** — sur une diapo du volet : **Y aller** (avec la garde) · **Retirer de l'heure** (seulement si elle n'a pas encore été au tableau) · **Réserve maintenant** · **À la maison** ; sur un bloc ou une étape : mettre en lumière · à écrire · revoiler celui-ci · aller à la réponse de tel élève. Rien qui coupe, colle, duplique ou déplace : ça, c'est la préparation.

**Retirer une diapo en classe, précisément :**
- **Seulement une diapo pas encore montrée.** Une diapo qui a été au tableau ne se retire pas — le passé ne change pas. La diapo bilan ne se retire pas non plus, elle ferme l'heure.
- **Ça touche la copie de la classe, pas le chapitre.** La diapo sort du fil de cette classe pour cette heure ; les autres classes ne voient rien. Rien ne remonte tout seul.
- **Le tableau ne bouge pas**, donc pas de garde et rien dans le journal du tableau ; mais la copie le note (« retirée à 09:23 ») et la relecture le dit.
- **Réversible tant que l'heure est ouverte** : clic droit → « Remettre dans l'heure ». Pas de « es-tu sûr ? ».
- **Son sort se règle à la clôture, avec les autres non jouées** — heure suivante, réserve, maison, non fait — parce que « retirée » n'est pas un sort : une activité prévue doit être utilisée. Et **« verser dans le chapitre »** te propose alors de la retirer aussi de la trame, si c'était ça le sens de ton geste.

**Le point 1 de la pile, pour le refermer d'un mot** : « à la maison » revient parmi les sorts, tel que cadré le 25/08 — le prolongement, avec une échéance, qui garde ses notions, entre dans le travail à faire, le récit et École Directe, et apparaît « donnée à la maison le … » à la séance suivante. **C'est bien ça ?**

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 33 — Paul

Texte de Paul, mot pour mot :

> Il faut que je puisse supprimer une diapo en classe dans celles que je n'ai pas jouées

---

## TOUR 33 — Claude (conscience n°12)

Aucune mesure nouvelle (conception, sur les règles des tours 30-32). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Oui, et ça s'écrit avec la règle d'hier : **ce qui n'a pas été montré est libre, ce qui l'a été est figé.**

**Supprimer une diapo en classe**
- **Seulement une diapo que la classe n'a pas encore vue.** Sur une diapo déjà montrée, l'entrée est grisée : « déjà vue par la classe ». On ne change pas le passé.
- **C'est pour cette classe.** La diapo sort de l'heure de la 3 Franklin ; la trame n'est pas touchée, la 3 Hugo la jouera.
- **Ce n'est pas une perte silencieuse** : retirer, c'est donner le sort tout de suite — réserve, à la maison, ou non fait — au lieu d'attendre le T-5, qui n'aura plus à la proposer. Elle est comptée dans la relecture comme les autres non jouées, avec « retirée en classe à 09:23 ».
- **À la clôture**, avec les autres modifications de séance : « tu as retiré une diapo — la retirer aussi de la trame ? » — oui / non. Ton geste, jamais tout seul.

**Le clic droit en classe, donc** : sur un bloc ou une ligne — mettre en lumière · à écrire · revoiler ; sur une réponse — aller à l'élève, corriger, supprimer la prise de parole ; sur une diapo du volet — y aller (avec la garde) · **retirer de l'heure** (réserve / maison / non fait, non jouée seulement) · insérer un appoint après. Rien qui coupe, colle ou déplace : ça, c'est la préparation.

Et ça règle le point 1 de la pile, celui que j'avais cassé : **les sorts d'une activité non jouée sont quatre** — à l'heure suivante (tant que la séance continue) · en réserve (dans la séance, au tableau ou à l'oral, sans impression) · **à la maison, avec une échéance** (le prolongement du 25/08 : cahier, travail à faire, École Directe, compté dans la progression) · non fait, avec un motif. Ils se donnent au T-5, à la clôture, ou d'un clic droit pendant l'heure.

Si les quatre sorts et le clic droit de classe te vont, je passe au point 2 : la coche d'attestation du bilan.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 34 — Paul

Texte de Paul, mot pour mot :

> à chaque fois que je donne une idée ou une orientation, tu dois la mettre en tension avec ce qu'on a déjà cadré. Est ce qu'elle s'intègre ou pas? est-ce qu'elle télescope ou pas? Tu ne dois jamais me dire "oui c'est bon on fait ça " alors que deux tours avant on a parlé de quelque chose qui techniquement va produire des bugs avec la nouvelle idée ou orientation. En effet, je suis développeur pédagogique, mais sur la technique, c'est toi.

(Date : mardi 8 septembre 2026.)

---

## TOUR 34 — Claude (conscience n°12)

Aucune mesure nouvelle ; relecture croisée des règles cadrées aux tours 12 à 33 de ce transcript. Rien déposé hormis ce transcript.

Réponse mot pour mot :

Règle prise, et elle vaut pour tout ce qui suit : chaque idée passe d'abord contre ce qui est déjà cadré, et je te dis où ça s'intègre et où ça télescope avant de dire oui. Je l'applique tout de suite, en arrière, sur tout ce qu'on a fermé depuis hier — voilà ce que ça donne, du plus grave au plus petit.

**Télescopages trouvés**

1. **« Écrire dévoile » (mise en commun) contre « retoucher un bloc grisé en pleine séance pour plus tard » (ta demande du tour 27).** Si écrire dévoile, retoucher une consigne grisée pour la séance suivante la montre à la classe. Les deux ne peuvent pas être vraies ensemble. Ce que je propose : *écrire dévoile* ne vaut que pour **une réponse dans un bloc question** ; retoucher un bloc préparé (consigne, fiche) le laisse gris, il se dévoile à la flèche. Sinon, il faut geler pour retoucher — et tu m'as dit ne vouloir que le gel à gérer, ce qui plaiderait pour « tout dévoile hors gel ». **À trancher, c'est ma question du jour.**

2. **« Ce qui a été vu reste vu » (tours 12-13) contre « revoiler efface » (tour 27).** Une seule règle pour les deux : **◀ sur la même diapo annule le dernier dévoilement** (l'apparition reste dans le fil détaillé, pas dans le récit) ; **changer de diapo ne dé-voit rien**. Sans ça, le journal se contredit.

3. **Supprimer une diapo en classe (hier) contre la trame vivante (tour 30).** Si ce qui n'est pas joué se lit dans la trame, la diapo retirée pour la 3 Franklin *revient* à l'heure 2, depuis la trame. Il faut que la copie de la classe porte aussi **les décisions sur le non-joué** — retirée, en réserve, à la maison, non fait — et que ces décisions masquent la trame pour cette classe. C'est une retouche de l'architecture : la copie = ce qui a été montré **+ les sorts**. Même chose pour les quatre sorts du T-5, qui sans ça ne survivraient pas à l'heure.

4. **Supprimer en classe contre le bilan unique et dernier (§6 du 25/08).** La question-bilan et le rituel d'ouverture ne sont pas retirables en classe : l'entrée est grisée. Sinon « aller au bilan » n'a plus de cible.

5. **Supprimer en classe contre la frontière d'heure et le débordement.** Retirer une diapo de l'heure recalcule le prévu : le débordement affiché change à l'instant. À écrire, sinon la colonne de droite ment.

6. **La réserve « en encart au tableau » (tour 27) contre le journal du tableau.** Afficher l'encart est une publication, donc une ligne — mais **pas un dévoilement de la diapo** : elle reste « en réserve », le journal dit « réserve X affichée de 09:30 à 09:40 ». Sinon la relecture la compte jouée.

7. **« Aller au bilan » contre la garde.** Le saut proposé par le T-5 est *devant la classe* par nature : pas de garde. Idem pour le retour via « revenir là où est la classe ». À écrire, sinon un exécutant mettra la garde partout.

8. **Corriger ou supprimer une prise de parole après coup (tour 32) contre l'immuabilité (tour 30).** L'immuabilité porte sur **ce que la classe a vu** ; une prise de parole est ta saisie, jamais montrée : corrigeable, avec trace (« corrigé à 09:40 »). Sans cette distinction, on ne peut plus rattraper une faute de frappe d'initiales.

9. **La réponse au fil de la frappe contre le tableau distant par le hub.** Publier chaque lettre au hub, avec un sondage toutes les 900 ms ou même en temps réel, c'est des dizaines d'écritures par réponse. C'est technique, je le tranche : le pilotage publie au tableau distant par paquets de quelques centaines de millisecondes ; la fenêtre locale suit à la lettre. La classe ne voit pas la différence, le hub si.

10. **La pagination « la page suit ce que tu écris » contre les deux supports du tableau.** La page doit être la même sur ton écran, la fenêtre et le distant : c'est le pilotage qui la calcule, dans la boîte du tableau (la loi de taille), et les supports l'affichent — jamais chacun sa page. Sinon la classe et toi ne lisez pas la même page.

**Ce qui s'intègre sans frottement** (vérifié, je ne le détaille pas) : les deux gardes avec la répétition (aucune en répétition) ; le versement dans le chapitre avec l'immuabilité (il modifie la trame, jamais le passé) ; la frontière d'heure avec la trame vivante et « une séance = 1h » ; le retrait en classe avec le versement (« aussi dans la trame ? ») ; la relecture par heure et par séance avec le journal.

Les dix lignes ci-dessus entrent dans le cadrage telles quelles, sauf la 1, que tu tranches : **retoucher un bloc grisé en classe le montre-t-il (tout dévoile hors gel, un seul geste à gérer), ou reste-t-il gris (seules les réponses dévoilent) ?**

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 35 — Paul

Texte de Paul, mot pour mot :

> oui oui le seul dévoilement par écriture directe concerne les mises en commun, évidemment. De toute façon pour le reste si je modifie ça reste grisé, c'est normalement déjà le cas. En revanche tous les conflits que tu as listés sont je pense précisément la source des nombreux bugs du moteur actuel. Il faudra aussi une fonctionnalité de commentaire. En effet, on a ajouté la fonctionnalité des notes, comme sur ppt, mais il faut aussi que je puisse faire un commentaire sur une diapo par clic droit. même comportement que ppt: horodatage, et ça doit faire partie des métadonnées d'une séance, afin de pouvoir faire une relecture du chapitre après coup.

---

## TOUR 35 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; mise en tension contre les tours 27, 29, 30, 32-34 et CADRAGE-TEMPS §6). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Point 1 fermé : **seule une réponse écrite dans une question paraît au tableau au fil de la frappe ; tout le reste, retouché en classe, reste gris et se dévoile à la flèche.** Et oui : les dix conflits d'hier sont, à la lecture du code, ce que les six enveloppes essayaient de compenser l'une après l'autre. La base saine les règle en amont, une fois.

**Le commentaire de diapo — mis en tension avant d'être accepté.**

Ce que c'est, dans tes mots : comme PowerPoint, un clic droit sur une diapo, un texte, l'horodatage, et ça appartient à la séance pour relire le chapitre après coup. Ça s'intègre, à condition de le tenir distinct de deux choses qui lui ressemblent :

| | Notes présentateur | Notes au fil de l'eau (N) | **Commentaire** |
|---|---|---|---|
| appartient à | la diapo, dans la trame | l'heure d'une classe (le journal) | **la diapo, dans la trame** |
| s'écrit | en préparation | en classe | **n'importe quand, clic droit** |
| porte | quoi dire | l'heure et la diapo au tableau | **la date, et si c'est en classe, la classe et l'heure** |
| se relit dans | le pilotage | la relecture de l'heure | **la relecture du chapitre** |
| va au tableau | jamais | jamais | **jamais** |

**Où ça télescope, et la règle qui répare :**
1. **Contre « en classe, rien ne remonte à la préparation ».** Un commentaire posé en classe s'écrit dans la trame tout de suite — sans passer par le versement — parce qu'il **ne change pas le contenu que la classe a vu** : c'est une métadonnée. L'immuabilité n'est pas touchée. C'est la seule chose qui s'écrit dans la trame pendant une heure, et il faut le dire en toutes lettres au mandat.
2. **Contre la copie de classe diapo par diapo.** La copie fige le *contenu* montré ; elle ne copie ni les notes présentateur ni les commentaires. Sinon un commentaire d'hier sur la 3 Franklin serait invisible pour la 3 Hugo — alors qu'il parle de la diapo.
3. **Contre la trame vivante et la suppression.** Le commentaire s'accroche à l'identité de la diapo ; si tu supprimes la diapo de la trame, ses commentaires partent avec elle, et la relecture du chapitre le dit (« diapo supprimée le 12/9, 2 commentaires »). Sinon des commentaires orphelins.
4. **Contre les notes au fil de l'eau : deux gestes, deux mots, jamais mélangés.** N pour « ce qui se passe maintenant avec cette classe » ; clic droit → Commenter pour « ce que je pense de cette diapo ». La relecture de l'heure peut mentionner qu'un commentaire a été posé pendant l'heure, mais il vit ailleurs.
5. **Contre le journal du tableau** : un commentaire n'est pas une publication, il n'y entre pas ; il a sa propre date.

**Ce que ça ajoute au cadrage** : dans les données de la diapo, une liste de commentaires (date, texte, et le contexte de classe s'il y en a un) ; dans le clic droit — préparation et classe — « Commenter » ; et une sortie de plus, **la relecture du chapitre** : séance par séance, diapo par diapo, les commentaires avec leur date, plus les relectures de séance et ce qui n'a pas été fait — le bilan de fin de chapitre du 25/08 trouve là sa matière.

Une seule question : **le commentaire posé en classe s'écrit-il dans la trame à l'instant, sans versement** (c'est ce que je propose, parce qu'il ne change pas le contenu) — ou veux-tu qu'il attende la clôture comme une modification ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 36 — Paul

Texte de Paul, mot pour mot :

> le commentaire c'est uniquement en classe. la relecture ne fait pas apparaitre le comm. le comm sert uniquement au cockpit prof (pas encore codé). regarde comment il se réduit sur ppt, et comment on sait qu'une diapo en porte 1.

---

## TOUR 36 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; PowerPoint décrit de mémoire, non vérifié). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Corrigé sur les deux points, et ça simplifie : **le commentaire est un geste de classe, il ne va ni au tableau ni dans la relecture ; il attend le cockpit prof.** Je retire la « relecture du chapitre » que j'avais ajoutée hier : ce n'est pas ce chantier, c'est le cockpit, plus tard. Ce chantier ne fait que deux choses : **poser** le commentaire, **le montrer** sur la diapo.

**Comment PowerPoint fait** — je le décris de mémoire, je ne peux pas l'ouvrir d'ici, et les versions diffèrent un peu :
- une diapo qui porte un commentaire montre **une petite pastille de commentaire** dans son coin (en haut à gauche de la diapo en édition), et **la même pastille sur sa vignette** dans le volet de gauche ;
- le commentaire lui-même vit dans un **volet à droite**, qu'on ouvre et referme ; refermé, il ne reste que la pastille ; un clic sur la pastille rouvre le volet sur ce commentaire ;
- chaque commentaire porte **l'auteur et l'heure** (« il y a 3 min », puis la date), on peut y répondre, le marquer réglé, le supprimer ;
- **en mode diaporama, rien ne s'affiche** : le mur ne connaît pas les commentaires.

**Ce que ça donne chez nous, mis en tension avec ce qui est cadré :**
- **Le geste** : clic droit sur la diapo (scène ou vignette) → Commenter → une petite fenêtre s'ouvre sur ton écran, comme celle des notes mais ancrée à la diapo ; Entrée pose le commentaire avec **la date, l'heure, la classe et l'heure de cours** ; Échap ou sa croix la réduit.
- **Réduit** : une pastille « 💬 2 » en haut à gauche de la diapo sur ton écran, et la même sur la vignette. Clic dessus : la fenêtre rouvre, avec les commentaires dans l'ordre, chacun daté. **Jamais dans l'état du tableau** — la fenêtre Win+K et le distant ne la voient pas. Compatible avec le journal (rien n'est publié).
- **Où il vit** : dans la trame, sur la diapo, par son identité — comme tu l'as dit, une métadonnée de la séance. Il s'écrit à l'instant, sans versement : il ne change pas le contenu montré, l'immuabilité n'est pas touchée ; la copie de classe ne le copie pas.
- **Ni en préparation, ni en répétition** : « uniquement en classe », donc l'entrée n'existe que dans le clic droit de classe. Si un jour tu le veux ailleurs, c'est une ligne à ajouter, pas une règle à changer.
- **Distinct de N** : N, c'est ce qui se passe avec cette classe maintenant (journal de l'heure, relecture) ; le commentaire, c'est ce que tu penses de la diapo (trame, cockpit). Deux gestes, deux mots, deux endroits.

**Une seule question, parce qu'elle décide de la pastille** : quand la 3 Hugo joue la même diapo trois jours après la 3 Franklin, **la pastille montre-t-elle le commentaire posé avec la Franklin** (il appartient à la diapo, il est là pour toutes les classes) — ou seulement les commentaires de la classe en cours ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 37 — Paul

Texte de Paul, mot pour mot :

> non le commentaire appartient à la classe, mais il se retrouvera dans le cockpit en commentaire sur un chapitre, fait sur deux jeux. Par ailleurs, l'avantage de powerpoint c'est quand même cette possibilité de sortir hors du cadre de la diapo et d'avoir une sorte de zoom infini, en tout cas en mode édition.

---

## TOUR 37 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; mise en tension contre les tours 27, 28, 30, 34 et 36). Rien déposé hormis ce transcript.

Réponse mot pour mot :

**Le commentaire, corrigé et mis en tension.** Il appartient à la classe : il vit donc **dans la séance jouée par la classe**, rattaché à la diapo par son identité — comme les notes N et les sorts —, pas dans la trame. Deux conséquences que je retire de ce que j'avais dit hier : plus rien ne s'écrit dans la trame pendant une heure (c'est plus sain), et la pastille ne montre que les commentaires **de la classe en cours**. Le cockpit, plus tard, lira les deux jeux (Franklin, Hugo) et les posera côte à côte sur le chapitre : c'est son affaire, pas la nôtre — nous, on stocke par classe, par diapo, avec la date et l'heure de cours. Un commentaire sur une diapo pas encore montrée tient dans la copie de classe au même titre qu'un sort (la retouche d'architecture du tour d'hier : la copie = ce qui a été montré **+ les sorts + les commentaires**). Une diapo supprimée de la trame ensuite : le commentaire reste, chez la classe ; le cockpit dira « diapo disparue depuis ».

**Le hors-cadre et le zoom infini de PowerPoint** — mis en tension avec ce qu'on a cadré, parce que ça touche trois règles :

1. **Le zoom infini est un zoom de *vue*, pas de contenu.** Ça s'intègre : on a dit « le texte ne se redimensionne pas en classe » — ici rien ne se redimensionne, c'est ton regard qui s'approche. En préparation : Ctrl + molette sur le plan de travail, la diapo se rapproche ou s'éloigne, tu écris en grand, le contenu est le même. **En classe aussi, sur ton écran de contrôle seulement** : tu zoomes pour écrire huit réponses ou tu dézoomes pour tout voir, **l'état du tableau ne bouge pas** — la classe voit la diapo à sa taille, paginée si besoin. C'est ce qui te manquait avec PowerPoint en édition, sans ce qui plantait.

2. **Le hors-cadre, c'est un parking.** Ce qui est posé autour de la diapo n'est pas dans la diapo : jamais publié, jamais paginé, jamais au tableau. Ça s'intègre avec l'état du tableau (il ne connaît que le cadre). En classe, **glisser un bloc hors du cadre le retire du tableau** — c'est un revoilement, la même règle que ◀ : le fil garde « apparu, retiré », le récit ne garde que ce qui est resté. **Le ramener dans le cadre le montre** : un dévoilement, une ligne. Cohérent avec le journal.

3. **Là où ça télescope : la quantification.** On a posé qu'une activité prévue doit être utilisée et que tout ce qui n'est pas joué est compté. Un bloc garé hors cadre est-il « prévu et non joué » — donc compté, sort à donner — ou un brouillon qui n'existe pas ? Si c'est compté, ton parking se remplit de sorts à régler à chaque T-5 ; si ce n'est pas compté, un bloc sorti du cadre en classe disparaît de la comptabilité alors qu'il était prévu. Ce que je propose : **hors cadre en préparation = brouillon, pas compté** ; **sorti du cadre en classe = retiré de l'heure, donc un sort** (réserve, maison, non fait), comme une diapo retirée. La différence, c'est le moment du geste.

4. **Contre la répétition et la relecture** : la répétition montre le cadre tel que la classe le verra, paginé, sans le parking ; la relecture ne voit que le cadre. Rien à changer.

**Ma question, une seule** : le hors-cadre te sert-il **en préparation seulement** (garer des blocs en construisant la diapo), ou **aussi en classe** (mettre un bloc de côté devant les élèves, le ramener plus tard) ? La seconde option ajoute le geste 2 au clic droit de classe et la règle 3 au T-5 ; la première ne touche que la préparation.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 38 — Paul

Texte de Paul, mot pour mot :

> attends je ne comprends rien. tu utilises des métaphores obscures: sorts, parking, comptabilité... tu m'as perdu.

---

## TOUR 38 — Claude (conscience n°12)

Aucune mesure nouvelle. Rien déposé hormis ce transcript.

Réponse mot pour mot :

Tu as raison, je reprends sans images. Trois mots que j'ai employés et que je bannis : « sort » voulait dire *ce que tu décides pour une activité que tu n'as pas faite* (la faire à l'heure suivante, la garder pour les élèves rapides, la donner à la maison, ou l'abandonner) ; « parking » voulait dire *la zone grise autour de la diapo* ; « comptabilité » voulait dire *le compte de ce qui n'a pas été fait, dans la relecture*.

**Le commentaire, en clair.**
- Tu es en classe avec la 3 Franklin. Clic droit sur la diapo, « Commenter », tu tapes « trop long, couper en deux l'an prochain », Entrée. Le commentaire garde la date, l'heure, et « 3 Franklin ».
- Il est rangé **avec ce que la 3 Franklin a fait** — pas dans le chapitre lui-même. Quand la 3 Hugo joue la même diapo, elle ne le voit pas.
- Sur ton écran, la diapo montre une petite pastille « 💬 1 », et sa vignette aussi. Un clic dessus rouvre le commentaire. Le tableau ne le montre jamais. La relecture ne le montre pas.
- Plus tard, le cockpit ira chercher les commentaires de la Franklin et de la Hugo et les mettra côte à côte sur le chapitre. Ça, c'est le cockpit, pas ce chantier.

**Le zoom de PowerPoint, en clair.** Ce que tu aimes, c'est t'approcher de la diapo pour écrire, ou t'en éloigner pour tout voir, sans que rien ne change dans la diapo. Ça, on le garde, **sur ton écran** : Ctrl + molette, en préparation et en classe. La classe, elle, voit toujours la diapo à sa taille normale. Rien ne casse, parce que ce que la classe voit ne dépend pas de ce que tu regardes.

**La zone autour de la diapo, en clair.** Dans PowerPoint, tu peux poser un bloc à côté de la diapo, dans le gris : il n'est pas dans la diapo, il n'apparaît pas au mur. On peut faire pareil. Le seul problème est celui-ci : si, **en classe**, tu tires hors de la diapo une activité que tu avais prévue, elle n'a pas été faite — et on s'est dit hier qu'une activité prévue et non faite doit être décidée (heure suivante, élèves rapides, maison, abandonnée) et apparaître dans la relecture. Si elle est juste posée dans le gris, elle disparaît sans qu'on le sache. Ce que je propose : en préparation, ce qui est dans le gris n'est pas prévu, c'est du brouillon ; en classe, tirer une activité dans le gris, c'est la retirer de l'heure, et le site te demande ce que tu en fais, comme pour une diapo retirée.

**Ma question, simple** : cette zone grise autour de la diapo, **tu t'en sers en préparation seulement**, ou **aussi en classe** ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 39 — Paul

Texte de Paul, mot pour mot :

> non je m'en sers en classe aussi, notamment quand je note des gros pavés. je remonte mon bloc au fur et à mesure que j'écris, et je reste sur la même diapo plutot que d'en créer d'autres. Mais c'est aussi dû au fait que sur ppt je dois obligatoirement écrire dans une zone, que je dois insérer d'abord, ce qui ralentit. en soi, mon mjpc règle déjà le problème. peut être en revanche que ce dont j'ai besoin, ce n'est pas un hors cadre mais des blocs déplaçables où je peux changer la taille de police comme sur ppt.

---

## TOUR 39 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; mise en tension contre les tours 9, 28, 34). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Compris, et ça change la question : ce que tu fais dans PowerPoint — remonter le bloc à mesure que tu écris pour rester sur la même diapo — c'est un contournement d'une limite de PowerPoint (une zone à insérer avant d'écrire). Dans le site, tu écris dans le bloc, il grandit, et on a posé hier que **la page suit ce que tu écris** : le pavé ne te chasse plus de la diapo. Donc le besoin de « hors cadre » tombe ; reste ce que tu nommes à la fin, et je le mets en tension avec ce qu'on a cadré.

**Des blocs déplaçables.** Aujourd'hui les blocs sont empilés, du haut vers le bas, et c'est ce qui permet deux choses qu'on a décidées : la page qui suit l'écriture, et « texte au tableau » qui grossit tout d'un coup. Des blocs à position libre, comme dans PowerPoint, cassent les deux : un bloc posé en bas à droite ne se pagine pas, et grossir le texte fait chevaucher les blocs. **Ce que je propose** : les blocs restent empilés, mais **déplaçables dans l'ordre** — tu prends un bloc et tu le montes ou le descends, en préparation comme en classe — et la mise en page à deux colonnes (l'image à côté du texte) se fait par un choix de la diapo, pas par des positions libres. Ça garde la page et le grossissement ; ça perd la position au pixel près, que rien de ce qu'on a cadré ne réclame.

**La taille de police par bloc.** On a dit « le texte ne se redimensionne pas en classe » — c'était contre *le site* qui coupe et recolle. Toi qui règles un bloc en petit, normal ou grand, c'est un choix de contenu, comme surligner : ça s'intègre. Deux tailles se combinent alors : celle du bloc (petit / normal / grand, dans la diapo) et « texte au tableau » (tout grossit ensemble, dans l'état du tableau). En classe, changer la taille d'un bloc déjà montré est une marque, comme le surlignage : elle passe au tableau et s'écrit dans le journal.

**Le gros pavé de mise en commun, précisément.** Tu tapes huit réponses ; le bloc déborde. Deux façons de le tenir, et c'est là que je te demande de trancher :
- **le site réduit d'abord la police de ce bloc** pour que tout reste visible, jusqu'à la limite lisible du fond, et **seulement ensuite** passe en pages — c'est ton geste PowerPoint, fait tout seul ;
- **ou il passe en pages tout de suite**, police inchangée : la classe voit la page où tu écris, les premières réponses sont à la page 1.

**Ma question, une seule** : pour un pavé qui grandit en classe, **la police se réduit d'abord (tout visible tant que c'est lisible), ou la page change tout de suite ?**

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 40 — Paul

Texte de Paul, mot pour mot :

> il faut que ça se réduise d'abord jusqu'à l'acceptable au fond, et ensuite ça bascule à l'autre. mais seulement, c'est exactement le genre de moment où un élève me demande de revenir en arrière parce qu'il est à la bourre. sur ppt, je reviens en arrière et ça règle la question. là, ça impacte la relecture. NOn? ou on a déjà tranché?

---

## TOUR 40 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; mise en tension contre les tours 12-13, 27, 34 et 39). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Pris : **la police du bloc se réduit d'abord, jusqu'à la limite lisible du fond ; ensuite seulement, la diapo passe en pages.**

Ton cas n'a pas été tranché ; il se règle avec ce qui l'est déjà, sans rien casser. Deux choses à distinguer, parce que la réponse dépend de laquelle tu fais :

**1. Revenir à la page précédente de la même diapo** (l'élève à la bourre veut revoir les premières réponses). Ce n'est ni un retour de diapo ni un revoilement : rien n'est retiré, les réponses sont toutes là, on montre une autre partie de la même diapo. Donc :
- **pas de garde** — c'est un geste pour la classe, il doit être immédiat : deux petites flèches « ‹ page 1 / 2 › » sous la diapo dès qu'elle est paginée (et Maj+← / Maj+→ au clavier), distinctes de ◀ ▶ qui dévoilent ;
- **pas d'effet sur la relecture** : ce qui a été vu reste vu, le récit ne bouge pas ; le fil détaillé note juste « page 1 montrée de 09:31 à 09:33 », parce que le tableau a changé — c'est tout.
Exactement comme PowerPoint quand tu reviens en arrière, et la relecture ne s'en mêle pas.

**2. Ce qui télescope, et la règle qui répare** : on a dit « la page suit ce que tu écris ». Si tu reviens page 1 pour l'élève et que tu continues d'écrire, la page repart à la 2 sous ses yeux. Deux issues, la seconde est celle qu'on a déjà : soit tu attends qu'il ait fini ; **soit tu gèles** — le tableau reste page 1 pour lui, tu écris page 2, tu dégèles quand il a copié. Un seul geste à gérer, celui qu'on a choisi ; et à ce dégel-là il n'y a pas de garde (même diapo, page différente), le tableau rattrape simplement. Je l'écris dans le cadrage : « si tu changes de page à la main, elle reste tant que tu n'écris pas ; dès que tu écris, la page de l'écriture revient — geler pour tenir les deux. »

**3. Une correction à la maquette v8 qui en découle** : aujourd'hui « Dévoiler » y passe de page en page tout seul et ◀ revoile ; il faut y ajouter les flèches de page et le Maj+←/→, et retirer la garde de ◀ (déjà noté). Je les mettrai dans la v9 avec le reste.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 41 — Paul

Texte de Paul, mot pour mot :

> ça ajoute des boutons.

---

## TOUR 41 — Claude (conscience n°12)

Aucune mesure nouvelle. Rien déposé hormis ce transcript.

Réponse mot pour mot :

Vrai. Alors aucun bouton de plus : la page se change avec ce qui est déjà là.

- **L'indicateur de page** qu'on affiche déjà dans le coin de la diapo (« page 2 / 2 ») devient le geste : un clic dessus remonte d'une page, un autre redescend. Il n'apparaît que quand la diapo est paginée, donc rien ne s'ajoute quand il n'y a rien à paginer.
- **La molette** sur la diapo de ton écran fait la même chose — page précédente, page suivante — et Ctrl + molette reste le zoom de ta vue, comme on l'a dit hier. Deux gestes différents pour deux choses différentes, sur la même surface, sans un pixel de plus.
- **Au clavier**, Maj+← et Maj+→.

La barre du bas ne bouge pas : ◀ ▶ dévoilent, le reste est ce qu'on a validé. Je l'écris ainsi dans le cadrage et dans la v9.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 42 — Paul

Texte de Paul, mot pour mot :

> est ce que tu peux me livrer la maquette avec tout ça? Et si oui, est ce qu'elle pourra être importée directement en lieu et place du déroulé actuel?

---

## TOUR 42 — Claude (conscience n°12)

Aucune mesure nouvelle. Rien déposé hormis ce transcript.

Réponse mot pour mot :

**Oui pour la maquette.** Tout ce qu'on a fermé depuis la v8 tient dans un fichier manipulable, données réelles du chapitre 3e, sans hub. C'est gros ; je te propose de la rendre en trois fois pour que tu joues chaque partie avant la suivante :
- **v9a — l'heure** : ◀ sans garde ; les pages (clic sur l'indicateur, molette, Maj+←/→, « la page suit l'écriture, changée à la main elle reste tant que tu n'écris pas ») ; la police du bloc qui se réduit avant la pagination ; la mise en commun (clic dans une question, initiales, la réponse au fil de la frappe, Entrée = suivante, reformulée) ; les blocs grisés retouchables qui restent gris ; petit / normal / grand par bloc ; monter / descendre un bloc ; Ctrl + molette pour ta vue ; les deux gardes ; le journal avec apparition et retrait.
- **v9b — les décisions** : le clic droit de classe (lumière, à écrire, revoiler ; corriger ou supprimer une prise de parole ; y aller, retirer de l'heure avec les quatre décisions, insérer un appoint, commenter) ; les commentaires par classe avec leur pastille ; la réserve en encart au tableau ; le T-5 avec « aller au bilan » ; l'écran de fin d'heure (ce qui n'a pas été fait et sa décision, les diapos modifiées et le versement).
- **v9c — la séance** : la frontière d'heure dans la trame ; l'heure 2 qui s'ouvre sur le rituel avec les reportées après et le débordement ; l'immuabilité (une diapo vue reste telle quelle, la trame modifiée vaut pour la suite) ; la relecture par heure et la relecture de séance ; l'ordi de classe simulé dans une seconde fenêtre.
Je commence sur ton mot.

**Non pour l'importer telle quelle** — et c'est toi qui l'as dit le mieux (« tu vas aussi importer les bugs »). Une maquette n'est pas du code de production, pour des raisons précises :
- elle ne parle pas au hub : pas de copie par classe, pas de trace de l'heure, pas de cours actif, pas de mode test, pas de tableau distant par le hub ;
- elle n'est pas dans `index.html` : pas d'atelier autour, pas d'emploi du temps qui la lance, pas de page élève, pas de connexion prof, pas de manifeste ;
- elle n'a ni bancs de production, ni reprise après coupure, ni incidents visibles, ni infobulles dans tes mots ;
- son code est un code de maquette : tout global, tout en mémoire, écrit pour être joué, pas pour tenir un an.

**Ce qu'elle est, en revanche, et c'est plus utile qu'un import** : **la spécification exécutable du mandat**. Le mandat dira : « le pilotage se comporte comme la maquette v9, geste par geste, et les bancs rejouent ses gestes » ; l'exécutant part de zéro sur cette base saine, et il peut piocher dans la maquette (le rendu d'une diapo, la pagination, les gardes) comme dans une carrière — à la condition de tout repasser par ses bancs, jamais par un copier-coller. Base saine, c'est ça.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 43 — Paul

Texte de Paul, mot pour mot :

> ce n'est donc pas un piochage au jugé. il faudra que ce qui est codé soit fidèle à ce que j'aurai eu dans la maquette, sinon aucun intérêt. Vas-y pour les livraisons, mais d'abord mets à jour tous tes docs de suivi.

---

## TOUR 43 — Claude (conscience n°12)

Écritures faites sur cet ordre, en production (jeton de production), vérifiées bit à bit par le blob : `docs/MJPC6-DETTES.md` — section G, n°12 · 01 à 13 (commit `ddfb8321afb2`) ; `docs/MJPC6-journal.md` — entrée 2026-09-07 → 08 (commit `3042bdef05da`) ; `docs/MJPC6-OU-TROUVER-QUOI.md` — ajouts du 08/09 (commit `a22231ac05dc`). Pas de point de retour (aucune promotion). Le cadrage « la classe » est rédigé et soumis dans la réponse ; il n'est pas déposé (pièce locale `CADRAGE-1-LA-CLASSE-brouillon.md`, recopiée en `pieces/T43-CADRAGE-1-LA-CLASSE-soumis.md` pour que le transcript en garde la version soumise).

Réponse mot pour mot :

Fidélité, pas piochage : c'est écrit tel quel (0.3 ci-dessous), et ce sera la première ligne du mandat.

**Les docs de suivi sont à jour, en production, vérifiés bit à bit** : le registre a sa section G, conscience n°12, entrées n°12 · 01 à 13 (les faits mesurés, les dettes trouvées, ta décision de refonte, les dettes de la passation toujours ouvertes) ; le journal a l'entrée du 7-8 septembre (aucune promotion) ; « Où trouver quoi » dit où sont le transcript, les maquettes, les inventaires, les bancs, et ce qui n'existe pas. Le transcript C12 est à jour (43 tours). Rien n'a été promu, la production est toujours 8.73.0-⑭.

**Avant la v9a, le cadrage « la classe » — tout ce qu'on a fermé depuis hier, en règles numérotées pour que le mandat et les bancs les citent.** Il est ci-dessous, il n'est déposé nulle part ; tu le lis, tu corriges, puis je le dépose au sas et je commence la v9a. Le §14 liste ce qui reste à cadrer avant le mandat : ce n'est pas du « ouvert », c'est la file, et elle se vide un point par tour.

---
# CADRAGE 1 · LA CLASSE — le déroulé refait de zéro, sur une base saine
*Conscience n°12, écrit le 08/09/2026 à partir des tours 5 à 42 du transcript C12. Soumis à Paul dans la conversation ; déposé au sas seulement après son mot. Chaque règle est numérotée pour que le mandat et les bancs puissent la citer.*

## 0 · Ce que c'est, pour qui, et la règle de fidélité
- 0.1 En classe, Paul utilise PowerPoint. Le site doit être **un vrai diaporama** — préparer, jouer, projeter — **plus ce que PowerPoint ne sait pas faire** : le suivi en direct et le gel.
- 0.2 Tout se fait sur **le pilotage ordi**. Le téléphone n'est qu'une télécommande, à faire plus tard ; l'actuel est à jeter.
- 0.3 Le chantier se refait **de zéro**, l'ancien déroulé sert de carrière. **Ce qui est codé est fidèle, geste par geste, à ce que Paul a joué dans la maquette validée** ; les bancs rejouent les gestes de la maquette. Pas de piochage au jugé.
- 0.4 Aucune phrase du site n'est méta ; les mots sont ceux de Paul (« tableau », « classe », « diapo », « heure », « séance »), validés par lui ; chaque geste porte son infobulle.

## 1 · Le tableau
- 1.1 **Un seul état du tableau, tenu par le pilotage** : la diapo, ce qui est dévoilé, les marques (mis en lumière, à écrire), la taille du texte et la page, la loupe, le bandeau (chrono, qui a participé), l'encart de réserve.
- 1.2 **Deux supports, jamais deux états** : la fenêtre sur l'ordi de Paul (Win+K) et l'ordi de classe (tableau distant) qui lit le même état par le hub. L'ordi de classe ouvre l'adresse du tableau et attend le cours, comme aujourd'hui (`?vue=tableau`, un seul cours en cours pour tout le site).
- 1.3 Le tableau distant est un terminal muet : il n'écrit jamais, il garde sa dernière image s'il perd le hub. Le pilotage dit s'il suit, s'il est en retard, s'il est perdu — pour que Paul le sache, jamais pour changer le journal.
- 1.4 La réponse au fil de la frappe part à la fenêtre locale à la lettre, et au distant par paquets de quelques centaines de millisecondes.
- 1.5 Notes, commentaires, pastilles, gris des éléments non dévoilés : jamais dans l'état du tableau.

## 2 · Le gel et les deux gardes
- 2.1 **Le gel, c'est l'état du tableau qui ne bouge plus.** Paul reste libre : il avance, revient, prépare, écrit. Fenêtre et distant se figent ensemble. Un témoin dit sur quelle diapo est la classe. Un clic (ou G) dégèle.
- 2.2 **Le fil normal ne pose jamais de question** : ▶ dévoile l'élément suivant puis passe à la diapo suivante ; ◀ sur la même diapo revoile le dernier élément ; changer de page ; « aller au bilan » proposé par le T-5 ; « revenir là où est la classe ».
- 2.3 **Première garde — tout geste hors du fil, en heure lancée, si le tableau suivrait** : revenir à une diapo précédente, sauter (vignette, grille, PageUp/PageDown avant la fin du dévoilement). Une question : « La classe te suivrait — [revenir à / sauter à la diapo n]. Geler d'abord ? » — trois réponses : Geler puis y aller (Entrée) · Y aller devant la classe · Rester (Échap). Gelé, elle ne revient pas.
- 2.4 **Seconde garde — au dégel, seulement s'il y a un écart** : « La classe est sur la diapo 3, tu es à la diapo 8. » — Revenir là où est la classe puis dégeler (Entrée) · Dégeler ici · Rester gelé (Échap). Sans écart, le dégel est silencieux.
- 2.5 Ni garde ni gel en répétition (jouer en avance) : rien n'y est écrit.

## 3 · Le journal du tableau
- 3.1 **Le journal s'écrit uniquement quand l'état du tableau change** ; jamais quand seul l'écran de Paul bouge ; **rien pendant le gel** ; au dégel avec écart, une transition s'écrit une fois.
- 3.2 Il note, horodaté à la seconde : l'arrivée d'une diapo (début, suivante, retour, saut), chaque élément dévoilé, chaque élément retiré (◀), les marques, la page montrée, les gels et dégels, l'encart de réserve, le chrono et « qui a participé » au tableau.
- 3.3 **Ce qui a été vu reste vu, sauf revoilé sur place** : ◀ sur la même diapo annule le dernier dévoilement pour le récit (l'apparition reste dans le fil détaillé) ; changer de diapo ne dé-voit rien ; changer de page ne dé-voit rien.
- 3.4 Une diapo qui n'a jamais été au tableau n'existe pas pour la classe : « pas jouée ». Un saut devant la classe va directement à la diapo visée sans montrer les intermédiaires.
- 3.5 Les prises de parole, les réponses écrites et les notes au fil de l'eau se rattachent à **la diapo que la classe voyait à cet instant**, pas à celle où Paul était.

## 4 · Dévoiler, écrire en classe, la mise en commun
- 4.1 **Le gris, c'est ce qui est préparé et pas encore montré.** Il se dévoile à la flèche.
- 4.2 **Seule une réponse écrite dans un bloc question paraît au tableau au fil de la frappe** : cliquer dans une question grisée l'ouvre et la dévoile ; les initiales trouvent l'élève (comme la participation) ; Entrée passe à la réponse suivante ; « reformulée » se coche. Pendant le gel, tout paraît au dégel.
- 4.3 **Tout le reste, retouché en classe, reste gris** (consigne, fiche, étapes) et se dévoile à la flèche. Ce que Paul écrit en classe vit dans la copie de la classe.
- 4.4 Une réponse est une ligne du journal (élève, texte, reformulée ou non, heure, diapo au tableau), ouverte à sa première lettre au tableau, close quand on passe à la suivante ; elle compte comme prise de parole, rien à ressaisir.
- 4.5 Les blocs sont empilés du haut vers le bas ; ils se montent et se descendent (préparation et classe) ; la mise en page à deux colonnes est un choix de la diapo, pas des positions libres.
- 4.6 Chaque bloc a une taille (petit / normal / grand). En classe, changer la taille d'un bloc montré est une marque : elle passe au tableau et s'écrit.
- 4.7 Une prise de parole est une saisie de Paul, jamais montrée : corrigeable et supprimable après coup, avec trace.

## 5 · Les pages, la loupe, la taille du texte, le zoom de vue
- 5.1 **Le texte ne se coupe jamais et la donnée n'est jamais modifiée par l'affichage.**
- 5.2 Quand un bloc grandit (mise en commun), **sa police se réduit d'abord jusqu'à la limite lisible du fond, puis la diapo passe en pages**. La page suit ce que Paul écrit. Le pilotage calcule les pages dans la boîte du tableau ; ton écran, la fenêtre et le distant montrent la même page.
- 5.3 **Changer de page à la main, sans bouton** : clic sur l'indicateur « page n / m » dans le coin de la diapo, molette sur la diapo, Maj+← / Maj+→. Pas de garde, pas d'effet sur le récit ; le fil note la page montrée. Une page changée à la main reste tant que Paul n'écrit pas ; dès qu'il écrit, la page de l'écriture revient — geler pour tenir les deux.
- 5.4 **« Texte au tableau »** : une réglette qui grossit tout le texte au tableau (loi de taille : 32 pt = 5,6 % de la hauteur de la boîte) ; fait partie de l'état du tableau.
- 5.5 **La loupe** : un cadre tracé sur la diapo, le tableau grossit cette zone (×1,5 à ×4 à la molette), le texte ne bouge pas ; un clic la range. Fait partie de l'état.
- 5.6 **Ctrl + molette** sur l'écran de Paul : le zoom de sa vue, en préparation et en classe ; ne touche ni la diapo ni le tableau.
- 5.7 En préparation, une diapo dont le texte ne tient plus au plancher lisible est marquée « trop pleine » ; c'est Paul qui la coupe en deux d'un geste, à l'endroit qu'il choisit. Jamais le site.

## 6 · Les heures d'une séance, le T-5, le bilan
- 6.1 **La frontière d'heure est portée par la trame** : chaque diapo appartient à une heure prévue (Heure 1, Heure 2…) ; le site propose la coupure d'après les durées, Paul la déplace d'un geste. La question-bilan est la dernière diapo de son heure ; « Où en sommes-nous ? » la première de la suivante. L'emploi du temps lit ce nombre d'heures, plus un quotient.
- 6.2 La fin est fixe, le début est lancé par Paul, cinq minutes d'agenda ; le retard recalcule les horaires prévus ; le débordement s'affiche, ne se résorbe jamais seul (25/08).
- 6.3 **À T-5, le site propose « Aller au bilan »** (saut devant la classe jusqu'à la question-bilan de l'heure) en plus des décisions par activité non jouée. Paul peut refuser : l'heure se clôt alors sans bilan, la relecture l'écrit tel quel.
- 6.4 Le bilan est un bloc de type propre, unique, toujours dernier ; la coche d'attestation (§6 du 25/08) reste à cadrer (pile ①).
- 6.5 **L'heure suivante s'ouvre sur son rituel** (« Où en sommes-nous ? »), jamais sur un signet. Sans rituel préparé, elle s'ouvre sur la première diapo à jouer ; un rituel se fait par un appoint.
- 6.6 **Ce qui a été reporté passe après le rituel, avant le programme** ; le site l'affiche à l'ouverture avec le débordement ; Paul valide ou ajuste les durées.
- 6.7 Une heure terminée sans bilan ni clôture ne perd rien : le T-5 est rattrapé **avant le lancement** de l'heure suivante, dans l'écran d'ouverture, jamais devant la classe.
- 6.8 Une séance = une heure est une séance sans frontière.

## 7 · Les activités non faites, la réserve
- 7.1 **Une activité prévue doit être utilisée.** Quatre décisions, données au T-5, à la clôture ou d'un clic droit pendant l'heure : **à l'heure suivante** (tant que la séance continue) · **en réserve** (dans la séance seulement) · **à la maison, avec une échéance** (le prolongement du 25/08 : cahier, travail à faire, École Directe, compté dans la progression) · **non fait, avec un motif**. « Ne rien donner » n'existe plus.
- 7.2 **Une activité vit dans sa séance** : rien ne traîne d'une séance à l'autre ; à la dernière heure, ce qui reste est compté « non fait », sans rien à gérer.
- 7.3 **La réserve ne s'imprime pas** : elle se donne avec ce que Paul a (sa feuille, le cahier, l'oral). Pendant l'heure, ⋯ → « Réserve de la séance » montre les activités en réserve avec leur consigne, et un clic les affiche **en encart au tableau, « pour ceux qui ont fini »** — une publication, notée « réserve X affichée de … à … », jamais un dévoilement de la diapo. Un PDF d'une activité seule existe sur demande, jamais tout seul.
- 7.4 Le suivi de qui a reçu une réserve est facultatif (initiales, motif « réserve »). La quantification, elle, est automatique : le journal sait ce qui a été joué.

## 8 · L'immuabilité et la copie de classe
- 8.1 **Ce qui a été au tableau est immuable pour la classe qui l'a vu** : la copie de la classe fige chaque diapo à sa première apparition au tableau, avec les réponses écrites dedans ; la relecture la relit ainsi pour toujours.
- 8.2 **Ce qui n'a pas encore été montré se lit dans la trame telle qu'elle est ce jour-là** : pour une autre classe, pour la même classe à l'heure suivante, pour l'an prochain — sans question ; une mention « modifiée depuis … » sur la vignette.
- 8.3 **La copie de la classe = les diapos montrées + les décisions sur le non-joué + les commentaires + les notes**, par identité de diapo. Les décisions masquent la trame pour cette classe (une diapo retirée ne revient pas).
- 8.4 Ce que Paul modifie en séance (contenu) vit dans la copie ; à la clôture, le site compare copie et trame par identité et propose le versement **diapo par diapo** (oui / non) ; jamais automatique ; jamais pour le passé.
- 8.5 Une diapo supprimée de la trame après avoir été jouée reste dans la copie et la relecture ; une diapo ajoutée avant la partie non jouée arrive à l'heure suivante.

## 9 · Le clic droit en classe, retirer une diapo, l'appoint
- 9.1 **Sur un bloc ou une ligne** : mettre en lumière · à écrire · revoiler celui-ci. **Sur une réponse** : aller à l'élève · corriger · supprimer la prise de parole. **Sur une diapo (volet ou scène)** : y aller (avec la garde) · **retirer de l'heure** · insérer un appoint après · commenter. Rien qui coupe, colle ou déplace : c'est la préparation.
- 9.2 **Retirer de l'heure** : seulement une diapo pas encore vue par la classe (sinon grisé : « déjà vue par la classe ») ; jamais le bilan ni le rituel ; pour cette classe seulement ; la décision se donne tout de suite (réserve / maison / non fait) ; le prévu et le débordement se recalculent à l'instant ; comptée dans la relecture (« retirée en classe à … ») ; à la clôture : « la retirer aussi de la trame ? ».
- 9.3 L'appoint (une notion imprévue) s'insère après la diapo courante, comme aujourd'hui.

## 10 · Les notes et les commentaires
- 10.1 **Notes présentateur** : par diapo, dans la trame, écrites en préparation, lues sous la diapo en classe, jamais au tableau.
- 10.2 **Notes au fil de l'eau (N)** : une fenêtre qui s'ouvre et se referme par N (ou Échap, ou son bouton), Entrée garde la note avec l'heure et la diapo au tableau ; elles vont dans la relecture de l'heure ; jamais au tableau.
- 10.3 **Commentaire** : en classe seulement, clic droit → Commenter, Entrée pose le commentaire avec la date, l'heure, la classe et l'heure de cours ; **il appartient à la classe** (dans la copie de la classe, par identité de diapo) ; une pastille « 💬 n » sur la diapo et sa vignette, clic pour rouvrir ; jamais au tableau, jamais dans la relecture ; il attend le cockpit prof, qui posera les commentaires des classes côte à côte sur le chapitre.

## 11 · La relecture
- 11.1 **Une relecture par heure** (la copie École Directe à chaque fois) **et une relecture de séance** (les heures bout à bout, chaque diapo disant « prévue heure 1, jouée heure 2 », avec les décisions entre les deux).
- 11.2 **Un onglet à part**, jamais superposé au pilotage : Pilotage | Relecture, R bascule, la clôture y amène.
- 11.3 Construite **sur le journal du tableau et la copie de la classe, et rien d'autre** : le fil de l'heure (chaque changement du tableau, à la seconde, avec gels, paroles, réponses, notes à leur heure), diapo par diapo (au tableau, prévu, dévoilé, ce qui s'est passé, décision pour le non-joué), la participation par élève, les notes au fil de l'eau. Le récit à l'imparfait se refait sur ce journal.
- 11.4 Rien de ce que Paul a fait pendant le gel n'y entre ; les commentaires n'y entrent pas.

## 12 · Repris tel quel de l'existant (à citer dans le mandat, pas à rediscuter)
La clé d'une heure (date + créneau + classe) et sa signature · le cours actif, reflet de la trace ouverte · la trace écrite au fil et la reprise dans le même créneau (chrono accumulé, décisions conservées) · une heure close ne se reprend plus ; lancer une autre heure clôt la précédente ; la bannière « une heure est ouverte » · l'identité des diapos (`eid`) · les horaires recalculés depuis le début réel · la loi de taille du texte · le chrono, « chrono au tableau », « qui a participé » au tableau avec les prénoms · G / S / surligner / effacer / annuler · « à écrire », « mettre en lumière » · l'enregistrement automatique de la préparation, vidé au changement de séance · le tableau distant terminal muet · l'appoint · la tête du déroulé · le T-5 et sa veille · les deux copies pour École Directe · le pilotage ne se tait jamais (tout incident se voit).

## 13 · Ce qui tombe
Le cadre (iframe) et sa vérification d'intégrité · les six enveloppes du pont · la scission, la refusion, `vues` / `rev` comme état · le zoom-texte du moteur et `degorge` · le LOT G · la poignée du champ contenu (26/08) · le saut d'image à « suivant » · père / fils / suite · le téléphone actuel · les quatre boutons du T-5 (remplacés par les quatre décisions) · le hors-cadre (pas demandé, remplacé par les pages et les blocs déplaçables dans l'ordre).

## 14 · Ce qui reste à cadrer avant le mandat (pile ① du tour 31, moins ce qui est fait)
La coche d'attestation du bilan (6.4) · les compétences par diapo, le coût des décisions au T-5, la règle des alertes · l'absence (saisie, récit pour l'absent, déclaration de mise à jour) · la mise en commun en entier (palette Maj+Espace, où va la réponse, ² / F2, historique d'un élève, collisions d'initiales, prénoms au tableau) · les blocs en profondeur (marques sur image, schémas, fiche annotée par la classe, rappel, image collée) · le récit figé et retouché · le mode test · le QR code et le temps réel du distant · les documents du chapitre et les feuilles de l'atelier · ce que l'élève reçoit après l'heure · le vocabulaire et les arbitrages ouverts du 25/08 · **la préparation** (écran, frontières d'heure, taille par bloc, coupure « trop pleine », répétition) — sujet 2, à maquetter.

---

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 44 — Paul

Texte de Paul, mot pour mot :

> ok on continue.

(Date : mercredi 9 septembre 2026.)

---

## TOUR 44 — Claude (conscience n°12)

Écritures faites : le cadrage 1 déposé au sas `DEROULE/CADRAGE-1-LA-CLASSE.md` (commit `3b5720efb359`), corps identique à la version soumise au tour 43, vérifié bit à bit. Maquette v9a construite (gabarit `pieces/T44-v9a-template.html`, générateur `pieces/T44-gen-v9a.py`) ; bancs : `pieces/T44-test-v9a.mjs` (◀ sans garde, mise en commun, gel/dégel des réponses, pavé → police 0,7 puis pages, page à la main ‹ › / Maj+→ / clic dans la question, taille de bloc au tableau, retouche grise, Ctrl+molette) → 0 défaut ; `pieces/T18-bancs-v7.mjs` rejoué → 0 défaut ; `pieces/T44-bancs2-v9a.mjs` (banc 2 de la v8 adapté à la règle ◀) → 0 défaut. Bugs corrigés en cours de banc : raccourcis déclenchés depuis le champ de réponse (contenteditable non reconnu comme champ), garde fantôme au ◀ en début de séance, ligne d'écriture hors page après changement manuel. Captures `pieces/T44-v9a-01-mise-en-commun.png`, `pieces/T44-v9a-02-tableau.png`.

Réponse mot pour mot :

Ton « ok » pris pour le cadrage : **déposé au sas tel que tu l'as lu** (`DEROULE/CADRAGE-1-LA-CLASSE.md`, seule la ligne de statut change : « validé par Paul le 09/09 »), vérifié bit à bit.

**La v9a — l'heure — est jointe, manipulable.** Ce qu'elle joue en plus de la v8, chaque point avec sa règle du cadrage :
- **◀ sur la même diapo revoile, sans garde** (2.2) ; le retrait s'écrit (« retiré ») et le récit ne garde que ce qui est resté (3.3). ◀ en début de diapo remonte d'une diapo, avec la garde.
- **La mise en commun** (4.2) : clique dans une question, tape les initiales — le site nomme l'élève —, Entrée, tape la réponse : **elle est au tableau au fil de la frappe**, Entrée ouvre la suivante, un clic sur une réponse la marque « reformulée ». Chaque réponse compte comme prise de parole (« Jules — diapo 8, motif réponse »). Pendant le gel, rien ne passe ; au dégel, tout paraît.
- **Le pavé** (5.2) : à partir d'une dizaine de réponses, **la police du bloc se réduit** (jusqu'à 70 %), puis la diapo passe en pages ; la page suit ce que tu écris ; ton écran et le tableau montrent la même page.
- **La page à la main, sans bouton** (5.3) : ‹ › dans l'indicateur « page 2 / 2 » du coin, la molette sur la diapo, Maj+← / Maj+→. Elle reste tant que tu n'écris pas ; un clic dans la question te ramène à la page de l'écriture.
- **Retoucher un élément préparé** (4.3) : double-clic, tu corriges, Entrée ; **le gris reste gris**, rien ne part au tableau.
- **Le clic droit sur un bloc** (4.5, 4.6) : Petit / Normal / Grand, Monter, Descendre — au tableau aussi. (Le clic droit complet, c'est la v9b.)
- **Ctrl + molette** (5.6) : ta vue s'approche ou s'éloigne, le tableau ne bouge pas.

**Joué avant de te la donner** : trois bancs, 0 défaut — le banc de la v9a (les huit gestes ci-dessus, dans l'ordre, avec la fenêtre du tableau ouverte), et les deux bancs de la v8 rejoués sur la v9a (cinq tailles d'écran, 95 diapos ; gardes, gel, loupe, image, pagination identique contrôle / tableau, relecture, appoint, chrono).

**Trois bugs trouvés par les bancs et corrigés avant livraison**, pour que tu saches ce qui aurait cassé chez toi : taper une réponse contenant un « n », un « g » ou un « r » déclenchait les raccourcis (notes, gel, relecture) — le champ de réponse n'était pas reconnu comme un champ ; ◀ en tout début de séance ouvrait une garde vers une diapo qui n'existe pas ; après un changement de page à la main, la ligne pour écrire restait sur l'autre page sans moyen d'y revenir.

**Ce que je n'ai pas joué** : ton écran réel et ta souris (la molette, Ctrl + molette, le double-clic au bon endroit du texte) ; la fenêtre du tableau autrement qu'en fenêtre.

Joue-la ; dis-moi ce qui ne va pas, dans l'ordre. La v9b (clic droit complet, commentaires, réserve, T-5, fin d'heure) part sur ton mot.

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 45 — Paul

Texte de Paul, mot pour mot :

> ça m'a l'air pas mal. En haut il y a encore pause et réinitialiser le temps. ce sont des métas maquettes, non?

---

## TOUR 45 — Claude (conscience n°12)

Travail joué : v9a.1 = v9a sans ⏸ ni ↺ sur le chrono de l'heure (gabarit `pieces/T44-v9a-template.html` mis à jour → `pieces/T45-v9a-template.html`, générateur `pieces/T45-gen-v9a1.py`) ; banc `pieces/T45-test-v9a1.mjs` (le banc de la v9a rejoué) → 0 défaut. Rien déposé hormis ce transcript et ses pièces.

Réponse mot pour mot :

Pas des métas de maquette — pire : des commandes sans objet. Elles viennent du présentateur PowerPoint, où le chrono est celui de l'orateur, qu'on suspend et remet à zéro. Chez toi, le temps est celui du créneau : **la fin est fixe, le début est celui de ton « Lancer », et une heure de cours ne se met pas en pause** (6.2). Suspendre ou remettre à zéro ce chrono, ce serait mentir au T-5 et au débordement. Le chrono qu'on suspend et qu'on relance existe ailleurs, à sa place : celui d'une activité, « Chrono au tableau » (12).

Retirés. La barre du haut ne garde que : le temps écoulé depuis le lancement, l'heure qu'il est, ce qui reste. C'est la **v9a.1** jointe (le banc de la v9a rejoué dessus : 0 défaut ; les deux autres bancs n'y touchent pas).

Tests : aucun, rien n'est livré au site.

MEMO

---

## TOUR 46 — Paul

Texte de Paul, mot pour mot :

> bon maintenant pour la relecture, je pense que tu n'as pas regardé comment elle fonctionnait dans l'ancien moteur. attention, pas de relivraison tant que ce n'est pas cadré.

---

## TOUR 46 — Claude (conscience n°12)

Lectures jouées avant réponse (lecture seule ; rien déposé hormis ce transcript) : moteur `v-relecture` L460, `majVues` L1248-1387 (le récit : cadre, un paragraphe par activité, transposition par type de bloc, silence sur le non-montré et le « neuf », travail à faire à échéance, bilan de l'heure, figé/automatique, boutons ED), `recit` L1177, `lisible`, `citations` L1200 (surligné, à recopier), `copierED` L1115 (deux copies, HTML propre), `figeRecit`/`rendRecit` L1142-1143, `empreinte` L1174.

Réponse mot pour mot :

Tu as raison : je l'avais lue pour savoir *d'où elle tire ses données*, pas *ce qu'elle produit*. Relue en entier cette fois (moteur L1248-1387, `recit` L1177, `citations`, `copierED` L1115, `figeRecit` L1142). Voilà ce qu'elle est.

**La relecture de l'ancien moteur est un récit en prose, écrit pour l'élève et pour École Directe** — « Ce qu'on a fait aujourd'hui » — et pas un fil d'événements :
- **un cadre** : la classe, le chapitre, la séance, la date ; « Cette heure a commencé à 10 h 07 et s'est terminée à 11 h 02 » ;
- **un paragraphe par activité**, ouvert par l'heure et le nom de l'activité (« *Analyse d'images* — À 10 h 07, … »), fait de phrases **transposées à l'imparfait** : « Observez les images » devient « on a observé les images », « je passe » devient « le professeur est passé », une consigne qui ne se transpose pas devient « la consigne était : « … » », les étapes suivantes « la consigne précisait : … » ; les phrases s'enchaînent par des **connecteurs** variés (succession, ajout, retour, bilan) tirés d'une petite doctrine, jamais deux fois le même dans un paragraphe ;
- **par type de bloc** : une image → « on a observé *La Liberté guidant le peuple*, où on a repéré « le drapeau », « les corps » » ; un schéma → « on a construit le schéma *…* » ; une fiche → « on a travaillé la fiche *…* » (ou « repris », avec le motif du rappel), « où on a surligné « … » », « On a recopié dans le cahier : « … » » — les citations sont ce qui a été surligné ou marqué à recopier ; une question → « on a répondu à la question : « … ». **AB** a répondu : « … », que le professeur a reformulée ; **CD**, **EF** ont aussi participé à la mise en commun. » ;
- **seulement ce qui a été montré** : le silence sur tout bloc non dévoilé, sur tout bloc « neuf » ;
- **le travail à faire sort du fil et clôt le récit** : « Pour la prochaine séance — … » (aujourd'hui repéré dans le texte des consignes : « pour lundi », « à rendre pour ») ;
- **le bilan de l'heure** : « Pour finir, on a travaillé deux fiches, observé trois documents et répondu à une question ; **12** élèves ont pris la parole. » ;
- **deux gestes** : « Le figer pour le corriger » (le récit devient un texte que tu retouches à la main et qui ne suit plus le déroulé ; « Revenir au récit automatique » perd les retouches) ; et **deux copies pour École Directe**, en HTML propre : « contenu de séance » (sans le travail à faire) et « travail à faire » ;
- **le papier** en découle : « ce qu'on relit » (le récit) puis « ce qu'on colle » (les fiches).

**Ce que j'avais faux, et ce que ça corrige dans le cadrage 1.** Ma maquette montrait un fil horodaté (« 09:14, Zélia, motif 1 ») et un tableau diapo par diapo : c'est **la matière**, pas la relecture. Dans le cadrage : **11.3 est à réécrire** — la relecture, c'est *le récit*, comme aujourd'hui, nourri par le journal du tableau et la copie de classe au lieu de `rev` / `vues` ; et **10.2 est faux** sur un point — les notes au fil de l'eau ne vont pas dans le récit (il est pour l'élève et pour École Directe, elles sont pour toi).

**Ce qui s'intègre sans frottement** : « seulement ce qui a été montré » = le journal du tableau (3.1-3.4), et ◀ revoilé = silence ; les réponses avec initiales et « reformulée » (4.2, 4.4) = exactement les phrases de mise en commun ; « à la maison, avec une échéance » (7.1) donne « Pour la prochaine séance » **plus sûrement** que la détection de « pour lundi » dans une consigne — les deux se cumulent ; l'immuabilité (8.1) garantit que le récit relit la diapo telle qu'elle a été montrée ; « figer pour corriger » et les deux copies se reprennent tels quels (12).

**Ma question, une seule, avant tout cadrage 2 et toute relivraison** : ce que ma maquette montrait — le fil à la seconde, le diapo par diapo, la participation par élève, tes notes — **devient-il une vue à part, pour toi seul, à côté du récit** (« ce que la classe a vu / ce qui s'est passé »), **ou disparaît-il** (la relecture, c'est le récit et rien d'autre, tes notes se relisant ailleurs) ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 47 — Paul

Texte de Paul, mot pour mot :

> oui on peut le garder. et c'est grâce à ça (qui reprend l'intégralité de ce qu'il s'est passé en cours, notes y compris) que je peux verser ou non des notes dans le récit. il faudra qu'elles s'intègrent aussi bien dans le récit.

---

## TOUR 47 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; mise en tension contre le cadrage 1 §3, §10, §11, §12 et la lecture du tour 46). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Pris : la relecture a **deux faces** — **le récit** (« Ce qu'on a fait aujourd'hui », pour l'élève et École Directe, en prose, comme aujourd'hui) et, à côté, **ce qui s'est passé** (pour toi : le fil à la seconde, diapo par diapo, la participation, tes notes). C'est de la seconde que tu **verses** des notes dans la première. Mis en tension avec ce qui est cadré, voilà ce que ça impose :

1. **Verser est une donnée, pas une retouche.** Le récit se recompose tout seul à chaque ouverture (12). Si verser une note revenait à l'écrire à la main dans le récit, elle disparaîtrait à la recomposition suivante. Donc verser **marque la note** dans la copie de la classe (« versée au récit »), et la recomposition l'intègre d'elle-même **dans le paragraphe de la diapo que la classe voyait quand tu l'as prise** (3.5), à sa place dans l'ordre. Dé-verser retire la marque. Rien à retenir.

2. **Elle s'intègre comme une phrase du paragraphe, par la même machine.** Une note est une phrase à toi (« Line a proposé le sublime sans le mot ») ; le récit la transpose comme il transpose une consigne — verbe en tête au passé, connecteur devant, minuscule après le point — et sans étiquette « le professeur a noté que » : c'est ce « aussi bien » que tu demandes. **Au moment de verser, tu vois la phrase telle qu'elle entrera** et tu peux la retoucher pour le récit — la note d'origine reste intacte pour toi. Une note qui ne se transpose pas entre telle quelle, sans « la consigne était ».

3. **Où ça télescope, et la règle** :
   - **contre le récit figé** (retouché à la main) : le récit figé ne suit plus rien ; verser une note dedans, c'est une insertion dans le texte figé, au bon paragraphe, une fois — et si tu reviens au récit automatique, la marque « versée » reprend la main. Deux sources, mais jamais en même temps.
   - **contre « seulement ce qui a été montré »** (3.1) : une note versée n'a pas été montrée à la classe ; elle entre parce que **tu** l'y mets. C'est la seule matière du récit qui ne vienne pas du tableau, et le cadrage le dit en toutes lettres.
   - **contre École Directe** : les deux copies prennent le récit avec ses notes versées — c'est le but ; donc verser, c'est publier : une note « Jules n'a pas son cahier » ne se verse pas, c'est ton choix au moment du geste.
   - **contre la relecture de séance** : les notes versées à l'heure 1 sont dans le récit de l'heure 1, donc dans celui de la séance.
   - **contre les commentaires** (10.3) : ils ne sont ni dans le récit ni dans « ce qui s'est passé » — aucun changement.

4. **Ce que ça corrige dans le cadrage 1** : 11.3 — la relecture, ce sont *deux* vues, le récit et « ce qui s'est passé » ; 10.2 — les notes vont dans « ce qui s'est passé », et dans le récit **seulement si versées**.

**Ma question, une seule** : au moment de verser, veux-tu **toujours voir et valider la phrase** avant qu'elle entre (un aller-retour, mais aucune surprise dans École Directe), ou **verser d'un clic** et corriger après si besoin en figeant le récit ?

Le cadrage 2 · la relecture s'écrit sur ta réponse, puis la v9b.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 48 — Paul

Texte de Paul, mot pour mot :

> je veux toujours voir l'intégralité de la note que je vais verser (j'imagine visuellement la liste des notes au fur et à mesure avec le bouton "verser au récit" et annulable évidemment). et en réalité c'est quasi la seule voie que j'emprunterais pour modifier un récit: ça se fait dans le temps du cours, et ce genre de notes c'est par exemple si j'ai dit quelque chose à l'oral qui n'était pas dans le diapo, mais que je veux le formuler différemment (un exemple, un moyen mnémotechnique, tout ce qui fait le cours dans sa particularité)

---

## TOUR 48 — Claude (conscience n°12)

Aucune mesure nouvelle. Le cadrage 2 est rédigé et soumis dans la réponse ; non déposé (pièce locale, recopiée en `pieces/T48-CADRAGE-2-LA-RELECTURE-soumis.md`). Rien déposé hormis ce transcript et cette pièce.

Réponse mot pour mot :

Compris, et ça enlève l'aller-retour que je proposais : **la note est sous tes yeux, en entier, dans la fenêtre N, avec son bouton « Verser au récit » — annulable —, et tu la retouches là si tu veux la formuler autrement avant de verser.** Elle entre dans le récit telle quelle, avec un connecteur, sans étiquette et sans transposition qui l'abîmerait : un exemple ou un moyen mnémotechnique, c'est déjà écrit pour le cours. Verser est une marque sur la note, pas une retouche du texte, donc le récit qui se recompose la garde à sa place.

Une conséquence que je te propose, parce qu'elle sert exactement « ce qui fait le cours dans sa particularité » : à la clôture, dans l'écran qui propose déjà les modifications à verser dans le chapitre, les notes versées au récit sont aussi proposées comme **notes présentateur de la diapo** — oui / non — pour que l'exemple serve l'an prochain. Aucun bouton de plus.

Le **cadrage 2 · la relecture** est ci-dessous, complet : le récit repris de l'ancien moteur point par point et nourri par le journal, « ce qui s'est passé », les notes et le versement, la relecture de séance, et les deux corrections au cadrage 1. Tu le lis, tu corriges ; sur ton mot je le dépose et je lance la v9b.

---
# CADRAGE 2 · LA RELECTURE — le récit, « ce qui s'est passé », et les notes qu'on y verse
*Conscience n°12, écrit le 09/09/2026 à partir des tours 46 et 47 du transcript C12 et de la lecture entière de la relecture de l'ancien moteur (L1248-1387). Soumis à Paul dans la conversation ; déposé au sas seulement après son mot. Complète le cadrage 1 (il en corrige les points 10.2 et 11.3).*

## 0 · Deux faces, un onglet
- 0.1 La relecture est **un onglet à part**, jamais superposé au pilotage (cadrage 1, 11.2). Elle a **deux faces**, l'une à côté de l'autre :
  - **le récit** — « Ce qu'on a fait aujourd'hui » — écrit pour l'élève et pour École Directe, en prose ;
  - **ce qui s'est passé** — pour Paul seul — l'intégralité de l'heure : le fil à la seconde, diapo par diapo, la participation, les notes au fil de l'eau.
- 0.2 Les deux se construisent **sur le journal du tableau et la copie de la classe** (cadrage 1, §3 et §8), et sur rien d'autre — sauf les notes versées (§3 ci-dessous), qui entrent dans le récit parce que Paul les y met.
- 0.3 Une relecture par heure ; une relecture de séance qui met les heures bout à bout (cadrage 1, 11.1).

## 1 · Le récit — repris de l'ancien moteur tel quel, nourri autrement
- 1.1 **Le cadre** : la classe, le chapitre, la séance, la date ; « Cette heure a commencé à … et s'est terminée à … » (le début réel, la fin du créneau).
- 1.2 **Un paragraphe par activité montrée**, ouvert par l'heure réelle d'arrivée au tableau et le nom de l'activité, fait de phrases transposées au passé par la même machine qu'aujourd'hui (`recit` : verbe en tête → « on a … », « je » → « le professeur … », citation quand ça ne se transpose pas : « la consigne était : « … » », les étapes : « la consigne précisait : … »), enchaînées par les connecteurs de la doctrine (succession, ajout, retour, bilan), jamais le même deux fois dans un paragraphe, majuscule après le point.
- 1.3 **Par type de bloc**, comme aujourd'hui : image → « on a observé *…*, où on a repéré « … » » (les marques dévoilées) ; schéma → « on a construit le schéma *…* » ; fiche → « on a travaillé / repris la fiche *…* », « où on a surligné « … » », « On a recopié dans le cahier : « … » » (ce qui a été surligné ou marqué à recopier), sinon sa définition ; question → « on a répondu à la question : « … ». **AB** a répondu : « … », que le professeur a reformulée ; **CD**, **EF** ont aussi participé à la mise en commun. »
- 1.4 **Seulement ce qui a été montré** : le journal du tableau remplace `rev` / `vues` — une diapo jamais au tableau n'a pas de paragraphe ; un élément revoilé sur place n'y est pas (cadrage 1, 3.3) ; un bloc « neuf » n'y est pas ; ce qui s'est passé pendant le gel n'y est pas ; les pages, la loupe, la taille du texte n'y sont pas.
- 1.5 **Les réponses écrites en classe** y sont avec les initiales et « reformulée » (cadrage 1, 4.2, 4.4) ; les prises de parole rattachées à la diapo au tableau (3.5) donnent « ont aussi participé ».
- 1.6 **Le travail à faire sort du fil et clôt le récit** : « Pour la prochaine séance — … ». Deux sources qui se cumulent : une consigne montrée qui porte une échéance (comme aujourd'hui : « pour lundi », « à rendre pour »), et **la décision « à la maison, avec une échéance »** donnée à une activité non faite (cadrage 1, 7.1).
- 1.7 **Le bilan de l'heure** ferme le récit : « on a travaillé … fiches, observé … documents, répondu à … questions ; **n** élèves ont pris la parole. » ; s'y ajoute, si c'est le cas, ce qui a été retiré ou non fait, en une phrase sobre décidée avec Paul au mot près.
- 1.8 **Le récit se recompose tout seul** à chaque ouverture. **« Le figer pour le corriger »** reste possible (texte retouché à la main, qui ne suit plus rien ; « Revenir au récit automatique » perd les retouches, après confirmation) — c'est la voie rare ; la voie normale pour changer un récit est le versement des notes (§3).
- 1.9 **Deux copies pour École Directe**, en HTML propre, comme aujourd'hui : « contenu de séance » (sans le travail à faire) et « travail à faire ». Le papier en découle : « ce qu'on relit » (le récit), « ce qu'on colle » (les fiches).
- 1.10 **N'entrent jamais dans le récit** : les notes non versées, les commentaires, les gardes, les gels, les pages, les retraits, les décisions autres que « à la maison » (elles sont dans « ce qui s'est passé »), les blocs non montrés.

## 2 · « Ce qui s'est passé » — pour Paul seul
- 2.1 **Le fil de l'heure** : chaque changement du tableau, à la seconde — arrivée d'une diapo (début, suivante, retour, saut), éléments dévoilés et retirés, marques, pages montrées, gels et dégels, encart de réserve, chrono et « qui a participé » au tableau — et, à leur heure, les réponses écrites, les prises de parole, les notes.
- 2.2 **Diapo par diapo** : au tableau (temps réel), prévu, dévoilé (le plus loin atteint), ce qui s'est passé (tout vu / arrêté après « … » / affichée / retirée à … / pas jouée), et la décision pour ce qui n'a pas été fait (heure suivante, réserve, maison avec échéance, non fait avec motif).
- 2.3 **La participation par élève** (prises de parole et réponses, diapo, motif), corrigeable avec trace (cadrage 1, 4.7).
- 2.4 **Les notes au fil de l'eau**, en entier, chacune avec son heure, la diapo au tableau, et sa marque « versée au récit » ou non.
- 2.5 Rien de cette face ne va à l'élève ni à École Directe.

## 3 · Les notes au fil de l'eau et le versement
- 3.1 Une note est ce que Paul dit à l'oral et qui n'est pas dans la diapo — un exemple, un moyen mnémotechnique, ce qui fait le cours dans sa particularité — ou ce qu'il veut retenir de l'heure. Elle se prend par N pendant l'heure (cadrage 1, 10.2), avec l'heure et la diapo que la classe voyait.
- 3.2 **La fenêtre N montre la liste des notes de l'heure, en entier, au fur et à mesure**, et chaque note porte un bouton **« Verser au récit »** — annulable d'un clic (« Retirer du récit »). Le geste se fait **dans le temps du cours**, ou après, depuis « ce qui s'est passé » où la même liste est là.
- 3.3 **Verser est une donnée**, jamais une retouche du texte : la note reçoit la marque « versée » dans la copie de la classe ; le récit, en se recomposant, l'intègre **dans le paragraphe de la diapo que la classe voyait quand la note a été prise**, à sa place dans l'ordre. Dé-verser retire la marque et la note sort du récit.
- 3.4 **La note entre telle quelle** — ce sont les mots de Paul, écrits pour le cours — précédée d'un connecteur de la doctrine comme les autres phrases, sans étiquette (« le professeur a noté que » n'existe pas) et sans transposition qui la dénaturerait. Paul voit l'intégralité de la note avant de la verser ; s'il veut la formuler autrement pour le récit, il la retouche dans la fenêtre N (la note est modifiable), puis il verse. Pas d'aller-retour de validation en plus.
- 3.5 Verser, c'est publier : la note versée est dans les deux copies École Directe. C'est le choix de Paul au moment du geste.
- 3.6 **Contre le récit figé** : si le récit est figé, verser une note l'insère une fois dans le texte figé, au bon paragraphe ; au retour au récit automatique, la marque « versée » reprend la main. Jamais deux sources en même temps.
- 3.7 **À la clôture**, parmi les modifications de séance proposées au versement dans le chapitre (cadrage 1, 8.4), les notes versées au récit sont proposées aussi comme **notes présentateur de la diapo** — oui / non, diapo par diapo — pour que l'exemple ou le moyen mnémotechnique serve l'an prochain. Aucun bouton de plus : c'est l'écran de clôture qui existe déjà.

## 4 · La relecture de séance
- 4.1 Les récits des heures bout à bout, avec la frontière d'heure marquée et, entre deux heures, ce qui a été reporté, donné à la maison, mis en réserve ou non fait — chaque activité disant « prévue heure 1, jouée heure 2 » quand elle a glissé.
- 4.2 « Ce qui s'est passé » de la séance : les mêmes faces, heure par heure.
- 4.3 La forme exacte du récit de séance (un seul texte continu, ou un récit par heure sous un titre) : **à décider avec Paul sur maquette** (v9c).

## 5 · Corrections au cadrage 1
- 5.1 **11.3** devient : « La relecture a deux faces — le récit, et « ce qui s'est passé » — construites sur le journal du tableau et la copie de la classe ; le récit est celui de l'ancien moteur, nourri par le journal ; voir le cadrage 2. »
- 5.2 **10.2** devient : « Notes au fil de l'eau (N) : … elles vont dans « ce qui s'est passé », et dans le récit seulement si Paul les y verse (cadrage 2, §3) ; jamais au tableau. »

## 6 · Ce qui reste à cadrer (et n'est pas dans la v9b)
La phrase du bilan pour le retiré et le non-fait (1.7, au mot près) · l'absent : le récit pour l'absent, le message, la déclaration de mise à jour (cadrage 1, §14) · la forme du récit de séance (4.3) · le papier en détail.

---

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 49 — Paul

Texte de Paul, mot pour mot :

> ok on continue le cadrage (et il reste d'autres choses au cadrage, une fois le récit terminé). Par ailleurs, il faut que les élèves soient désignés non par leurs initiales comme dans le diapo, mais par leur prénom (et si prénom similaire, initiale du nom de famille en plus du prénom). C'est un récit, il faut donc humaniser.

---

## TOUR 49 — Claude (conscience n°12)

Écritures faites au sas (jeton du sas), vérifiées bit à bit : `DEROULE/CADRAGE-2-LA-RELECTURE.md` déposé (commit `375db882a489`), corps identique à la version soumise au tour 48 plus la règle 1.5 bis ajoutée dans les mots de Paul et la ligne de statut ; `DEROULE/CADRAGE-1-LA-CLASSE.md` corrigé aux points 10.2 et 11.3 (commit `16480ae3dc7f`). Rien d'autre déposé hormis ce transcript.

Réponse mot pour mot :

Cadrage 2 déposé au sas, avec ta règle ajoutée telle que tu la dis (1.5 bis) ; les points 10.2 et 11.3 du cadrage 1 corrigés dans le fichier déposé. Vérifiés bit à bit.

**Les prénoms dans le récit — mis en tension, et ce que ça fixe :**
- Ça s'intègre sans rien casser : en classe, tu tapes des initiales, mais **ce qui est enregistré, c'est l'élève** (la liste de classe le trouve) — donc le récit peut dire « Zélia a répondu » là où la diapo montre « ZP ». La diapo et le tableau gardent les initiales, comme tu le dis ; le récit seul humanise.
- **Deux prénoms identiques dans la classe** : l'initiale du nom s'ajoute — « Léa B. », « Léa M. » — seulement dans ce cas.
- **Un élève non identifié** (initiales sans candidat unique) : le récit dit « un élève a répondu : … », et « ce qui s'est passé » te le signale pour que tu corriges (4.7 du cadrage 1).
- Une chose à savoir, sans leçon : le récit part dans École Directe, contenu de séance ; les prénoms de ceux qui ont parlé y seront lus par toute la classe et les parents. C'est ton choix, je l'écris tel quel.

**On continue le récit — la file du cadrage 2, §6, un point par tour.** Le premier : **la phrase du bilan pour ce qui n'a pas été fait** (1.7), à fixer au mot près puisqu'elle part dans École Directe. Aujourd'hui le bilan ne dit rien du non-fait. Je te propose, après « … ; 12 élèves ont pris la parole. » :

> « Deux activités n'ont pas été faites cette heure-ci : *Placer les poètes*, qu'on fera à la prochaine séance, et *Le débat*, qu'on ne fera pas. »

— avec, selon la décision : « qu'on fera à la prochaine séance » (heure suivante), « qui est à faire à la maison pour lundi » (maison, avec l'échéance — et elle apparaît aussi dans « Pour la prochaine séance »), « qui reste à faire pour ceux qui ont fini » (réserve), « qu'on ne fera pas » (non fait). Le motif du non-fait ne sort pas : il est pour toi.

**Ma question, une seule** : ces quatre tournures te vont-elles telles quelles, ou tu me donnes les tiennes ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 50 — Paul

Texte de Paul, mot pour mot :

> ok en revanche je m'interroge sur le jour nommé. l'app le fait automatiquement?

---

## TOUR 50 — Claude (conscience n°12)

Lecture jouée avant réponse : `_drProchainCreneau` L16340 (prochain jour ouvré, « à défaut d'EDT hebdo »), `_drPoserContexteMoteur` L16351 ; aucune fonction `edtProchain*`. Rien déposé hormis ce transcript.

Réponse mot pour mot :

Aujourd'hui, non — et c'est faux : `_drProchainCreneau` (L16340) donne **le prochain jour ouvré, tout court**, « à défaut d'EDT hebdo » — un mardi, ça dit « mercredi 10 septembre » même si la classe n'a pas cours le mercredi. Ce commentaire date d'avant l'emploi du temps ; depuis le 03/09, le site sait mieux.

**Dans la base saine, oui, l'app le fait, et à partir de ce qu'elle sait déjà :**
- **L'échéance par défaut, c'est la prochaine heure de cette classe**, lue dans l'emploi du temps appariée (grille, semaines A/B, calendrier — les jours sans cours sautés). 3 Franklin, mardi 15:07 : la prochaine est **mercredi 10:07** → « pour mercredi 9 septembre ».
- **Toujours le jour et la date**, jamais « lundi » seul — dans École Directe, « lundi » ne dit pas quel lundi.
- **Tu changes d'un clic** si tu veux plus loin : la liste des prochaines heures de la classe, tu en choisis une. Rien à taper.
- **La date est figée dans la copie de la classe** au moment de la décision (8.1) : si l'emploi du temps change ensuite, le récit d'hier ne bouge pas.

**Où ça télescope, et la règle** : une classe **non appariée** (pas de créneau connu — aujourd'hui 3 Dylan et 3 Franklin le sont, mais pas toutes) : le site ne devine pas ; il te demande la date, ou écrit « pour la prochaine séance » sans jour. Et une heure **banalisée** ou un jour sans cours au calendrier n'est jamais proposé.

Le bilan garde donc tes quatre tournures, avec l'échéance ainsi : « *…*, qui est à faire à la maison pour mercredi 9 septembre ».

Point suivant de la file : **l'absent** — le récit pour l'absent, le message, sa déclaration de mise à jour (§11 du 25/08). Je le mets en tension et je te le propose au prochain tour, sauf si tu veux prendre un autre point d'abord.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 51 — Paul

Texte de Paul, mot pour mot :

> je n'aime pas l'idée que l'échéance soit fixée dans le récit.

---

## TOUR 51 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; mise en tension contre le cadrage 1, 8.1 et 7.1, et le cadrage 2, 1.6). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Tu as raison, et c'est un télescopage que j'aurais dû voir : **une échéance regarde l'avenir, et l'immuabilité (8.1) ne vaut que pour ce que la classe a vu.** Figer « pour mercredi 9 septembre » dans le récit, c'est graver une date qui peut bouger (une heure banalisée, une sortie, ton choix) dans un texte qui, lui, ne bouge plus. Les deux ne vont pas ensemble.

**Ce que je propose à la place, et qui sépare les deux :**
- **Le récit ne porte pas de date.** Il dit ce qui est décidé, comme aujourd'hui : « Pour la prochaine séance — … » et, dans le bilan, « *…*, qui est à faire à la maison ». Rien de plus. C'est vrai le jour même et ça reste vrai.
- **L'échéance vit ailleurs, et elle vit** : c'est un attribut de l'activité dans la copie de la classe, proposé par défaut (la prochaine heure de la classe, lue dans l'emploi du temps), **modifiable tant qu'elle n'est pas passée**. Elle sert au site — le rappel à l'ouverture de l'heure suivante (« travail donné pour aujourd'hui : … »), « ce qui s'est passé », le profil de classe — pas au texte.
- **École Directe a son propre champ de date** quand tu colles « travail à faire » : tu la poses là, comme aujourd'hui.

Le bilan devient donc : « Deux activités n'ont pas été faites cette heure-ci : *Placer les poètes*, qu'on fera à la prochaine séance, et *Le débat*, qui est à faire à la maison. » — et « Pour la prochaine séance — … » en clôture du récit, sans jour.

Une seule question : **« pour la prochaine séance », ça te va comme seule mention de temps dans le récit, ou tu n'en veux aucune** (« à faire à la maison », point) ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 52 — Paul

Texte de Paul, mot pour mot :

> En fait il faut que j'aie le choix, c'est tout. et c'est déjà le cas normalement: une activité non faite, je choisis quoi en faire et donc c'est à ce moment que ça s'inscrit dans le récit. Donc voilà tout. Mais je n'ai pas testé la fonctionnalité en vrai, donc je ne sais pas à quoi ça correspond concrètement.

---

## TOUR 52 — Claude (conscience n°12)

Aucune mesure nouvelle. Rien déposé hormis ce transcript.

Réponse mot pour mot :

C'est plus simple que ce que je tournais, et ça règle la tension d'un coup : **ce qui s'inscrit dans le récit, c'est ta décision, au moment où tu la prends** — et une décision annoncée à la classe est un fait de l'heure, pas un futur. Donc :

- Au T-5, à la clôture ou d'un clic droit, pour une activité non faite : quatre choix. Si tu prends **« à la maison »**, le site te propose la prochaine heure de la classe comme échéance (mercredi 9 septembre), et **tu choisis** : cette date, une autre, ou aucune.
- **Ce que tu as choisi s'écrit tel quel dans le récit**, à cet instant : « *Le débat*, à faire à la maison pour mercredi 9 septembre » — ou « à faire à la maison », si tu n'as pas mis de date. Et ça ne bouge plus, parce que c'est ce que tu as dit à la classe.
- L'échéance sert aussi au site après coup (le rappel à l'ouverture de l'heure suivante, le profil), mais **le récit ne dit que ce que tu as décidé ce jour-là.**

Pour « à quoi ça correspond concrètement » : tu ne l'as jamais joué parce que tu joues avec PowerPoint — et le T-5 d'aujourd'hui, que j'ai lu, ne fait que noter le choix. **C'est exactement la v9b** : le T-5 avec « aller au bilan », l'écran de fin d'heure avec la liste de ce qui n'a pas été fait et ses quatre choix, l'échéance proposée et modifiable, le clic droit complet, les commentaires, la réserve en encart — et, à côté, le récit qui se recompose sous tes yeux avec la phrase qui en sort, pour que tu voies ce que ça donne. Tu la joueras, et tu me diras ce qui ne va pas, comme pour la v9a.

Ce qui est cadré la couvre entièrement (cadrage 1 §6, §7, §9, §10 ; cadrage 2 §1, §3) ; ce qui reste dans la file (l'absent, la forme du récit de séance, la phrase du bilan pour le retiré, le papier) n'y entre pas. Je la construis sur ton mot.

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 53 — Paul

Texte de Paul, mot pour mot :

> ok alors pour finir à propos des activités de fin d'heure. actuellement, je prends une capture d'écran de mon ppt, je la colle dans ED, et j'écris teerminer l'activité pour la prochaine fois. Pour toute activité non faite, il faut qu'elle apparaisse dans son intégralité. En effet, même si l'élève peut avoir l'activité imprimée si jamais j'ai fait un doc de séance, il faut qu'il puisse savoir de quelle activité il s'agit et son contenu, s'il n'a pas de support imprimé.

---

## TOUR 53 — Claude (conscience n°12)

Aucune mesure nouvelle (conception ; mise en tension contre le cadrage 2, 1.4 et 1.6, et `copierED`). Rien déposé hormis ce transcript.

Réponse mot pour mot :

Compris, et c'est la capture d'écran qu'on remplace : **une activité donnée à la maison entre dans le récit en entier — son titre et tout son contenu — pour que l'élève sans feuille sache quoi faire.** Mis en tension avec ce qui est cadré :

**Où ça télescope, et la règle** : le récit ne dit que ce qui a été montré (cadrage 2, 1.4). Une activité donnée à la maison, souvent, n'a pas été montrée, ou à moitié. Elle entre quand même, en entier — c'est **la seconde exception** au « seulement ce qui a été montré », avec les notes versées, et le cadrage la nomme : *ce qui est donné à faire est donné en entier.*

**Ce que « en entier » veut dire, par type de bloc** (dans « Pour la prochaine séance — », qui clôt le récit et fait la copie « travail à faire ») :
- une **consigne** : son texte et **toutes** ses étapes, dévoilées ou non, dans l'ordre de la diapo ;
- une **question** : la question ; pas la réponse attendue ;
- une **fiche** : son titre, sa définition, son corps ;
- une **image** : sa légende et **le lien** vers l'image (un collage HTML dans École Directe n'emporte pas les images, c'est à vérifier chez toi ; le lien, lui, passe) ;
- un **schéma** : son titre et ses éléments, en liste ;
- si l'activité a été **commencée en classe**, la mention « à terminer » ; sinon « à faire » ; puis ta date si tu en as mis une.

**Ce que ça donne** : « Pour la prochaine séance — *Placer les poètes*, à terminer : Place chaque poète sur la frise, à la date de son recueil. 1. Lamartine, *Méditations*. 2. Hugo, *Les Contemplations*. 3. … » — la diapo, en texte, telle que l'élève l'aurait eue.

**Ma question, une seule** : le contenu en entier, **seulement pour ce qui est donné à la maison**, ou **aussi pour la réserve** (ceux qui ont fini) et **le reporté** (qu'on fera à la prochaine séance) — qui, eux, restent dans le bilan par leur titre seul dans ce que je propose ?

Tests : aucun, rien n'est livré.

MEMO

---

## TOUR 54 — Paul

Texte de Paul, mot pour mot :

> pour ta question, que proposes tu de logique et de pédagogique?

---

## TOUR 54 — Claude (conscience n°12)

Aucune mesure nouvelle. Rien déposé hormis ce transcript.

Réponse mot pour mot :

Ce que je propose, et pourquoi :

**Le contenu entier accompagne ce que l'élève doit faire seul ; un titre suffit pour ce que la classe fera, ou ne fera pas.**

- **À la maison → en entier.** L'élève a une tâche hors de la classe, sans toi devant lui : il lui faut la consigne, les étapes, la question, la fiche — tout, comme la capture d'écran d'aujourd'hui. Avec « à faire » si elle n'a pas été commencée, « à terminer » si elle l'a été en classe.
- **Reportée à la prochaine séance → le titre seul.** « *Les hypothèses de la classe*, qu'on fera à la prochaine séance. » L'élève n'a rien à faire ; lui donner le contenu, c'est lui dire en creux « prépare-le » sans le dire, et c'est dévoiler une activité que tu mèneras. Si tu veux qu'il la prépare, c'est une décision différente : « à la maison », et elle entre en entier.
- **En réserve → le titre seul.** « *Placer les poètes*, qui reste à faire pour ceux qui ont fini. » C'est un travail de classe, donné en classe à qui a fini ; l'élève rapide qui l'a faite s'y retrouve, les autres savent qu'elle existe ; personne n'a de tâche chez lui.
- **Non faite → le titre seul.** « *Le débat*, qu'on ne fera pas. » C'est honnête, et ça suffit ; le motif reste pour toi.

**La logique** : le récit dit à l'élève ce qu'il doit savoir pour la suite. Une tâche demande son contenu ; une information demande son nom. Et ça tient avec l'absent (le point suivant de la file) : l'absent reçoit le récit et le travail donné — donc **tout ce qu'il doit faire, en entier, et le nom de tout ce qu'il a manqué** ; ce qu'il a manqué se lit dans le récit des activités jouées, pas dans une copie intégrale des diapos.

**Et la pédagogie du « en entier »** : le contenu intégral, c'est la diapo en texte — jamais la réponse attendue d'une question, jamais tes notes présentateur, jamais ce qui est marqué « pour toi ». L'élève reçoit ce qu'il aurait vu au tableau, pas ce que tu gardais.

Si ça te va, c'est écrit ainsi au cadrage 2 (1.6, complété), et je passe à l'absent.

Tests : aucun, rien n'est livré.

MEMO

---

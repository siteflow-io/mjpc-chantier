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

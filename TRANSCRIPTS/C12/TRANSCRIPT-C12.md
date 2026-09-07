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

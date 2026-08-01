# SITE-COURS-2a — CADRAGE (exécutant → conscience)
**31/07 · j'attends le feu vert**

## Lu (md5 mesurés)
`MJPC6-doctrine-du-site.md` **86 663 o · `bbc34f10fd772eb16b0268cafaebe3f5`** (lue ; sections SITE-COURS du 29/07 : Q1 identifiants, Q2 classeur, Q3 un prompt par produit, Q4 Firebase ; flux Windows ; Q9/Q10/Q11/Q12/Q13) · DISPOSITIF `ce116a8cdb82c5ad4a8b0365cfa4613a` · DOCTRINE `e07900648409685caec7f2a2dae78265` · CHANTIER **`036c21bae7b97c1f0cb1ff4eec4b5d8d`** (a changé depuis mes relevés du matin) · ÉTAT-DES-LIEUX `8edbc8d7daa09a3ab61355cc0b3135e0` · journal **`e40e1c782fd19f5d8f1ead956933042c`** · **`worktrack.html` 1 034 102 o · `2dfe32e911b4064851fcd09ba6f89683`** (patron lu sur pièces : `PROMPT_CHAPTER` 14 975 caractères, `promptView`, `injectView`, `doInject`, `validateChapter`) · base **`index.html` 563 248 o · `efade683cf072fc1249b803ff2cb163b` (8.10.1)**.

## Mesures du schéma (et un faux positif instruit, pas écarté)
`ATELIER_COMPOSANTES` : **121 composantes** — mon premier comptage en donnait 111, par une regex `^clé:` qui ratait les entrées indentées ; recompté par balayage des entrées, **121 confirmé, le prompt a raison**. **7 réservées** : `diapositive_json`, `place_resultats`, `place_absence`, `place_agregats`, `place_strates`, `syllabation`, `qr_code` → **exclues de la liste remise à l'IA**. Familles A–K + N ; natures `structure|donnee|rendu` ; zones `entete, contexte, contenu, travail, differenciation, liens, ancrage, mise_en_page, pied` ; champs `CH(k,l,kind)` avec kinds `text` (défaut), `area`, `date`, `list`. `ATELIER_PRODUITS` ne porte que `fiche_seance` (17 cases).

## La forme du JSON — et POURQUOI elle est celle-là
```json
{ "produit": "fiche_seance",
  "titre": "Le portrait de Fantine",
  "cases":   { "objectif": true, "consigne": true, "zone_lignee": false },
  "valeurs": { "titre": {"texte":"Le portrait de Fantine"},
               "objectif": {"texte":"Repérer les procédés du portrait"},
               "criteres_reussite": {"liste":["J'ai relevé trois adjectifs","J'ai cité le texte"]} },
  "blocs":   [ {"id":"consigne","valeurs":{"texte":"Relève…"}} ] }
```
Elle **épouse la structure de `atDocNeuf`** (`cases`/`valeurs`/`contenu`) : l'injection devient une recopie contrôlée, sans traducteur à maintenir. `blocs` sert aux composantes `multiple` (le champ `contenu` du document) ; `valeurs[id][k]` suit exactement `atSetValeur`. Les clés `k` sont celles du schéma — **l'IA les reçoit dans la liste générée**, elle ne les devine pas.

## La liste GÉNÉRÉE depuis le schéma (aucune recopie)
`atPromptComposantes(pid)` parcourt `ATELIER_COMPOSANTES`, **écarte `reserve`**, ne garde que les composantes pertinentes du produit (les cases du produit + toutes celles de leurs zones — bornage annoncé par Q3), et énumère pour chacune : identifiant · libellé français exact (`libelle`) · zone · si elle porte des champs, leurs `k`, leur `l` et leur `kind`. Une composante ajoutée au schéma demain apparaît sans qu'aucune liste soit retouchée — **preuve exigée au rapport : composante factice injectée en mémoire, régénération, elle apparaît**.

## Le squelette du prompt (vit en Firebase, seed en dur)
Chemin **`/site/atelier/prompts/fiche_seance`** (lecture au chargement de la zone, écriture par `atSitePut` → verdicts du socle, mode test gratuit). Seed en dur `ATELIER_PROMPT_SEED.fiche_seance` qui fait foi si la base ne répond pas. Table `ATELIER_PROMPTS` indexée par produit : **ajouter un des sept autres = une entrée de plus, rien d'autre**. Squelette : ① le rôle et le produit visé ② **« NE PRODUIS AUCUN JSON TOUT DE SUITE. Procède par allers-retours : reformule, propose, mais attends mes validations. »** ③ les questions de cadrage (adresse : niveau/chapitre/séance ; objectif ; notions ; contenu de cours ; travail de l'élève ; critères de réussite ; à retenir ; suites) ④ **la liste générée** ⑤ le gabarit de sortie et ses règles (n'utiliser que les identifiants listés ; ne rien inventer ; JSON seul, sans commentaire) ⑥ **« Quand je te dis “produis le JSON”, et seulement alors, sors-le. »**

## Le choix nouvelle feuille / remplacement
Après validation, **l'aperçu** montre ce qui sera injecté (les cases qui s'allument, les contenus qui remplissent quels champs, en français), puis **deux boutons de même poids, aucun présélectionné** : **« Créer une nouvelle feuille »** (défaut au sens de premier, jamais coché d'avance) et **« Remplacer la feuille ouverte »**. Le second exige une **seconde confirmation nommée** disant ce qui sera perdu (« la feuille « X » : N case(s) cochée(s), N bloc(s) de contenu — elle part d'abord à la corbeille »), **archive `atCorbeilleCle('atelier-remplacement')` au format `{_meta:{chemin,app,ts},data}` AVANT**, et **ABANDON si l'archive échoue**. Le remplacement porte sur `AT.doc` (la feuille ouverte = le premier plan, décision du 29/07 ; **le classeur multi-feuilles reste hors périmètre — signalé, non implémenté**).

## Les refus nommés (`atValiderInjection`)
① pas un objet / JSON illisible → la position rendue par `JSON.parse` ② JSON vide / aucune case ni valeur ③ **identifiant inconnu → « “xxx” n'existe pas dans l'atelier »**, l'identifiant CITÉ ④ **composante réservée → « “diapositive_json” n'est pas encore disponible »** avec sa raison ⑤ champ inconnu pour cette composante → composante + champ cités ⑥ **type qui ne correspond pas** (`list` reçoit un texte / `area` reçoit un tableau / `date` mal formée) → dit quoi mettre ⑦ `blocs` sur une composante non `multiple` ⑧ produit inconnu. Chaque message dit **quoi corriger**. Les refus s'accumulent (jusqu'à 8 affichés), on ne s'arrête pas au premier.

## Textes soumis (aucun jargon côté Paul)
- Titre de la zone : **« Écrire avec une IA »** · sous-titre : « Discute d'abord avec l'IA, elle prépare la feuille, tu gardes la main sur tout. »
- Boutons : « Copier le prompt » · « Modifier le prompt » · « Coller la réponse de l'IA » · « Vérifier » · « Créer une nouvelle feuille » · « Remplacer la feuille ouverte ».
- Aperçu : « Voici ce qui sera écrit. Rien n'est enregistré tant que tu n'as pas choisi. »
- Confirmation de remplacement : « Remplacer « X » ? Tu perdras N case(s) cochée(s) et N bloc(s) de contenu. La version actuelle part d'abord à la corbeille, tu pourras la retrouver. »
- Refus : « Je ne peux pas écrire cette feuille : » + la liste nommée.
- Archive en échec : « La mise à la corbeille a échoué — **rien n'a été remplacé**. Réessaie quand la connexion est stable. »

## Questions (2)
**Q1** — Le bornage de la liste (cases du produit + composantes de leurs zones) borne le prompt comme le veut Q3, mais **prive l'IA de composantes utiles hors de ces zones**. Alternative : toutes les non-réservées (121−7=114), prompt plus long. Je propose le bornage par zones ; **tu tranches**.
**Q2** — L'adresse (`chapitre`, `seance`) est en **saisie libre** dans SITE-COURS-1, mais la doctrine tranche qu'elle deviendra une **cascade de menus en lecture seule** (SITE-COURS-2b/2c). Je fais donc **remplir ces champs par l'IA aujourd'hui** (ils existent), en sachant qu'un morceau ultérieur les rendra non éditables. Confirmes-tu, ou j'exclus `chapitre`/`seance`/`niveau`/`classe` du JSON dès maintenant ?

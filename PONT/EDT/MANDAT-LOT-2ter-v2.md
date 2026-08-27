# MANDAT EXÉCUTANT — LOT 2ter · IDENTITÉ DES OBJETS, RIEN NE SE PERD, LA VUE ANNÉE
*Base : ton candidat au sas, `PONT/EDT/index.html` — **1 646 417 octets**, md5 **`e22118e6864141a8c549f810ad4f280b`**, **138 fonctions `edt*`**, version 8.72.0. **STOP si le md5 diffère.** Candidat à produire : **8.73.0**.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul
« oh putain. je pensais que c'était cadré ! » — en découvrant qu'aucun objet de l'EDT ne porte d'identifiant.
« tout est un objet, encore une fois. » · « les photos doivent aussi avoir des ids internes. toujours pareil : objet, donc id. »
« qu'est-ce qui, modifié, peut faire perdre des données écrites avant ? » · « je veux savoir exactement quoi remplace quoi, qu'est-ce qui disparaît, qu'est-ce qui est simplement déplacé. »
« heures perdues c'est pas mal. c'est un sujet récurrent en salle des profs, et là j'aurai une mesure précise. »
« il faut reprendre le même principe que l'agenda google. » · « à gauche, ce sont LES DATES DES JOURS DU MOIS. »

**Trois choses cassent aujourd'hui, en silence.**
① `edtJustifier(i)` désigne un événement **par son indice** : une réinjection qui décale la liste fait tomber la coche de Paul **sur le mauvais événement**, sans erreur, sans un mot.
② **Les décisions de Paul sont rangées DANS l'objet qu'on réinjecte.** Mesuré : `edtJustifier` écrit `cal.evenementsClasse[i].justifie` puis republie le nœud calendrier entier, sans archivage. Toute réinjection les écrase **par construction** — aucun identifiant, aucun appariement ne peut les sauver tant qu'elles vivent là. C'est le point qui commande tout ce lot.
③ Une **heure déplacée** est comptée comme une heure sans séance : elle serait perdue au départ **et** jouée à l'arrivée.
C'est ce lot qui ferme ces trois trous, **avant** que Paul ait posé ses décisions de l'année.

Tu es EXÉCUTANT MJPC. Tu codes, tu livres au sas, tu ne promeus JAMAIS. Français partout. Avant de coder un point, tu dois pouvoir dire à quoi il sert en classe ; si tu devines, tu demandes. STOP après chaque livraison.

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL DU HUB
Prod `docs/` : `MJPC6-DETTES.md` · `MJPC6-2-DOCTRINE.md` · `MJPC6-OU-TROUVER-QUOI.md`. Sas : tes rapports (`rapport-phase0` → `rapport-complement`), `outils/verif_edt.py`, `tests/`. **`index.html` fait 1,6 Mo : tu ne le lis jamais en entier**, tu lis par recherche et par extraits.
Jeton sas : **celui que tu as déjà** (à révoquer et régénérer après ce lot) · production en LECTURE SEULE · hub en lecture seule dans tes bancs (faux hub, zéro écriture sortie).
**LE HUB EST VIDE — mesuré le 27/08.** `/site` contient `atelier, config, 3e, 4e, 5e, 6e` ; **`/site/edt` est `null`** : aucun calendrier, aucune grille, aucun créneau. Deux conséquences que tu ne dois pas oublier une seule fois :
- **Le chemin réel de la rentrée est la PREMIÈRE INJECTION**, pas la mise à niveau. C'est là que les identifiants naissent pour de bon. Tu le traites en premier et tu l'éprouves le plus.
- La mise à niveau au chargement (§①) reste indispensable dès que des objets existeront, mais elle **passe après**, et ses bancs se jouent sur faux hub.
`/site/config/brevetDates` existe et porte les quatre niveaux (3e, 4e, 5e, 6e) — c'est le nœud du §⑮.

## ① L'IDENTITÉ DES OBJETS — une AMORCE posée une fois, jamais recalculée
**Aucun élément de l'EDT n'a d'identifiant.** Mesuré sur les JSON du sas : `evenementsClasse` (15), `jalons` (30), `etablissement` (59), `feries` (11), `vacances` (7), `creneaux` de la grille (30) n'ont **rien** ; `creneaux` horaires et `periodes` n'ont qu'un **`rang`** — un ordre, pas une identité.

**La règle, stricte : l'`id` est une AMORCE, pas une formule vivante.**
- Un élément sans `id` en reçoit un **à sa première rencontre** — à l'injection pour un objet neuf, au chargement pour un objet déjà au hub —, calculé de façon **déterministe** (donc identique sur tous les appareils de Paul) à partir de ce qu'il porte à cet instant. La formule ne sert **qu'à cela**.
- L'`id` est ensuite **plus jamais recalculé, ni comparé, ni reconstruit**, même si la date, le libellé, le jour, le créneau ou la classe changent.
- **Conséquence à tenir** : un `id` ne dit rien du contenu. Il ne sert qu'à désigner. Toute fonction qui retrouverait un élément **en recalculant son `id`** est une faute : on cherche par `id` stocké, jamais par formule.
- **Un `id` ne contient jamais une position** : `crn:…` et `hor:…` sont des **amorces**, pas des adresses. Jour, créneau, semaine, classe, début et fin restent des **attributs modifiables** sans que l'`id` bouge — sans quoi « déplacer une heure » ou « modifier un horaire à la main » recréerait le bug du §③.
- Préfixes (lisibles au débogage, sans valeur sémantique) : `evc:` `jal:` `eta:` `fer:` `vac:` `crn:` `hor:` `per:` `pho:` — suivis d'un condensé du contenu au moment de la pose, **suffixé par la classe quand l'élément en dépend**. Pour une photo : **horodatage complet à la seconde**, jamais la seule date (l'automatique de début de période et une photo à la main le même jour doivent différer).
- **Collision à la pose** : deux éléments produisant la même amorce → le second reçoit `#2`. Ce suffixe dépend de l'ordre de parcours : il n'est acceptable que parce qu'il n'a lieu **qu'une fois**. Le parcours doit être **déterministe** (ordre du tableau tel qu'il arrive), le fait est **dit à l'écran** (« deux événements identiques le 14/11 — le second a reçu un identifiant distinct »), et **`#2` ne s'applique JAMAIS à un objet créé après la pose initiale** : un objet neuf naît avec son `id` propre.

**L'ÉCRITURE UNIQUE DE MISE À NIVEAU — `edtMettreANiveau`.**
Elle s'exécute **une fois**, quand un objet du hub lui manque quelque chose, et porte **quatre choses, rien d'autre** : ① les `id` manquants · ② la date d'injection de repli du §⑨ · ③ le classement de repli des heures déjà banalisées (§⑧) · ④ la reprise dans `decisions` des `justifie:true` d'un calendrier hérité, **et le retrait du champ `justifie` de l'objet** (§②).
**Elle ARCHIVE avant d'écrire, comme toute écriture du bloc — il n'y a pas d'exception « ajout pur ».** Mesuré : `mjpcPutJson` écrit en `method:'PUT'`, donc le nœud entier est remplacé, qu'on ajoute ou qu'on retire ; la seule voie PATCH du fichier (`secuPatchCode`) écrit sur `/codes/` et ne concerne pas l'EDT.
**Si l'archivage OU l'écriture échoue, rien n'est écrit** : le site fonctionne en lecture avec les valeurs calculées en mémoire, et il le dit. La migration ne se fait **JAMAIS en deux temps** : reprendre dans `decisions` sans retirer `justifie` laisserait deux sources de vérité pour un temps indéterminé.
Elle est déclarée au contrat dans `verif_edt.py`. Le hub étant vide, elle ne s'exécutera pas chez Paul au premier chargement : ses bancs se jouent sur faux hub.

**L'APPARIEMENT À LA RÉINJECTION — gradué et biunivoque, jamais une simple conjonction.**
Un JSON entrant peut ne pas porter les `id` en service (première version, JSON venu d'ailleurs, IA qui ne les a pas reconduits). Quatre temps, dans cet ordre :
1. **L'entrant porte un `id` connu** → il fait foi, rien d'autre.
2. Sinon, **appariement FORT** = **tous** les critères de la famille concordent → même élément, `id` conservé, **silencieux**.
3. Sinon, **appariement FAIBLE** = **tous les critères sauf un** concordent, **avec au moins un critère qui concorde**, et le candidat est **unique** → **proposé à Paul, jamais appliqué seul**. Il couvre **le libellé retouché ET la date déplacée** : un événement passé du 16/11 au 17/11 est un appariement faible, pas une suppression suivie d'un ajout. **Les familles à critère unique (férié, période) n'ont donc PAS d'appariement faible** — « tous sauf un » y vaudrait zéro critère, et un férié renommé s'apparierait à n'importe quel férié encore libre.
4. **Biunivocité obligatoire** : **un entrant ne s'apparie qu'à un seul existant, et un existant qu'à un seul entrant.** Sans elle, quatre « Conseil de classe » identiques s'apparient au hasard et **les décisions de Paul permutent**. Un candidat déjà pris n'est plus candidat ; s'il reste une ambiguïté, **on ne devine pas : on nomme**.

**LES CRITÈRES, FAMILLE PAR FAMILLE** — « niveau + date + libellé » ne veut rien dire pour un créneau ou une photo :
| Famille | Critères de l'appariement fort |
|---|---|
| événement de classe | niveau · date de début · libellé normalisé |
| jalon · établissement | date · libellé normalisé |
| férié | date |
| période sans cours (vacances) | date de début · date de fin |
| créneau de grille | jour · créneau · semaine (A/B/AB) · classe de la grille |
| créneau horaire | **début-fin d'abord** ; le **rang seulement en second recours**, et **seulement si le nombre de créneaux est inchangé** — jamais le rang seul : si Paul insère un créneau, tous les rangs décalent d'un cran et les décisions permuteraient en silence |
| période | nom normalisé |
| photo | **pas d'appariement** : les photos ne viennent d'aucune injection, elles ne sont créées que par le site ; leur `id` est posé à la création et ne sert qu'à les désigner |
Libellé normalisé = minuscules, accents retirés, espaces réduits, ponctuation ôtée.

## ② OÙ VIVENT LES DÉCISIONS — le cœur du lot, à faire avant tout le reste
**Mesuré dans ton candidat :**

function edtJustifier(i,valeur){
var cal=EDT.calendrier; ...
cal.evenementsClasse[i].justifie=!!valeur;
mjpcPutJson(FIREBASE_BASE+edtChemin('calendrier')+'.json',cal,'Écart justifié',...)

La coche est écrite **dans l'objet calendrier**, et chaque coche republie **le nœud entier, sans archivage**. Le champ `justifie` est déjà dans `json/calendrier-2026-2027.json`, quinze fois. **Tant que les décisions vivent là, une réinjection les efface quoi que fasse l'appariement.**

**LA RÈGLE : une décision de Paul ne vit JAMAIS dans un objet injecté.**
- **Magasin unique : `decisions`** — celui qu'utilise déjà `edtSansSeance`, à la clé `edtCleHeure(iso, creneau, classe)`. Ce nœud n'est jamais réinjecté : c'est ce qui le rend sûr.
- **Chaque coche « heure perdue » porte** : la clé heure (date + créneau + classe) **et l'`id` de l'événement** qui l'a causée. C'est une décision d'**HEURE**, pas d'événement.
- **Le champ `justifie` DISPARAÎT** de l'objet calendrier, des `json/*.json` et **des deux prompts**. Deux sources de vérité, c'est exactement le bug qu'on ferme.
- **Migration** : les `justifie:true` d'un calendrier hérité sont repris dans `decisions` par `edtMettreANiveau` (§①), **dans la même écriture qui retire le champ** — jamais en deux temps.
- **Toute écriture du nœud calendrier passe par l'archivage du §④.2** — plus une seule republication silencieuse du nœud entier pour un booléen.

**Ce que devient une coche quand les choses bougent** (à écrire noir sur blanc, c'est ce que Paul verra) :
- **L'événement se déplace** (16/11 → 17/11) : les heures du 16 n'existent plus pour lui ; celles du 17 sont d'autres heures, sur d'autres créneaux, peut-être d'autres classes. **Rien n'est reporté automatiquement.** Le site **repropose les heures recalculées, cases VIDES**, et la fiche dit : « tu avais coché 3 heures sur les dates précédentes ». Paul recoche ce qu'il veut.
- **La grille change sous un événement déjà coché** (Paul déplace son heure du 16) : **même règle**, mêmes mots.
- **L'événement ne bouge pas** : les coches restent, sans un mot.
- **L'événement disparaît** : ses coches sont **nommées avant le geste**, jamais supprimées en silence.

## ③ PLUS RIEN PAR INDICE NI PAR RANG
Cinq fonctions désignent un élément par sa position ; elles passent **par l'`id`** : `edtJustifier` (par indice), `edtCreneauPoser`, `edtPeriodePoser`, `edtPeriodeSupprimer`, `edtPeriodeDeplacer` (par rang). Le `rang` reste un **ordre d'affichage**, jamais une identité.
**Dette mesurée : `edtPeriodePoser` est déclaré DEUX FOIS** — `function edtPeriodePoser(nom,date)` puis `function edtPeriodePoser(rang,champ,valeur)`. La seconde écrase la première ; **les trois appels réels visent la seconde**. **Supprime la déclaration morte** avant de toucher à quoi que ce soit, et dis-le au rapport. Ne corrige jamais celle qui n'est jamais appelée.
**Preuve** : coche sur le 5e événement, insertion d'un événement **en tête**, relecture → la coche est **toujours sur le même événement**, nommément.

## ④ LE DIFFÉRENTIEL, ET RIEN NE SE PERD
**Aucune écriture n'écrase plus en silence**, sur aucun objet (14 écritures recensées dans ton bloc).
1. **Ce que Paul a posé à la main survit** à toute réinjection : coches d'heures perdues (§②), appariements de classes (`classeMjpc`), créneaux fictifs, horaires modifiés, dates de périodes, décisions horaires, classement des heures banalisées, photos.
2. **Archivage avant écrasement** — le modèle existe dans le site, copie-le : `chInjecterConfirme` en mode « remplacer » **archive à la corbeille AVANT d'écrire et ABANDONNE si l'archivage échoue** (« rien n'a été remplacé »). Même règle pour tout objet de l'EDT.
3. **Le différentiel est nominatif**, avant le geste, dans l'écran de vérification : **ce qui arrive** (`id` inconnu) · **ce qui est seulement déplacé** (apparié fort ou faible, date changée : « Stages 3e : 16/11 → 17/11 ») · **ce qui disparaît** (`id` absent) · **ce qui est conservé** de ses décisions. Un événement qui disparaît **et qui portait des coches** est nommé à part.
**Le cas douteux, c'est l'appariement FAIBLE du §①.** Le site **ne décide jamais** :
- « Séjour Verdun 3e (14/10) semble être devenu "Séjour à Verdun 3e" — c'est bien le même ? »
- « Stages 3e semble avoir été déplacé du 16/11 au 17/11 » — et s'il portait des heures cochées, **elles sont reproposées vides** (§②) : on ne reconduit jamais une coche sur des heures que Paul n'a pas vues.
**Aucune conservation silencieuse sur un appariement faible**, et **aucune proposition quand le candidat n'est pas unique**.

## ⑤ LES PROMPTS D'INJECTION — un seul collage
Paul : « le prompt, quand je clique sur le bouton copier, doit contenir le json directement. comme ça pas besoin de faire deux copier coller. »
**Le bouton « Copier le prompt » copie UN SEUL bloc** : la consigne **+ le JSON actuellement en service au hub**, inséré tel quel. Si l'objet n'existe pas — **c'est le cas aujourd'hui** : « aucun calendrier en service — c'est une première injection », jamais un vide muet. Le patron existe dans le site (`ATELIER_PROMPT_SEED`, `atIA*`) : reprends-le, ne l'invente pas. Le bouton « Sortir le JSON actuel » reste, pour les usages hors injection.
**Les deux prompts (`prompts/calendrier.md`, `prompts/grille.md`) sont réécrits** : l'IA reçoit l'existant, **reconduit les `id`** de tout élément qu'elle reconnaît, n'en crée que pour les vrais nouveaux, **ne reformule jamais un libellé**, ne renumérote rien, **ne produit plus aucun champ `justifie`** (§②), et **déclare en fin de sortie** ce qu'elle a fait : ajoutés, déplacés, supprimés, renommés — avec leurs noms. Les JSON du sas sont régénérés avec leurs `id` et **sans `justifie`**.

## ⑥ HEURES PERDUES — l'écran, et ce qu'il dit
L'entrée « Calendrier de l'année… » devient **« Heures perdues »**. Elle ne règle pas le calendrier : elle dit **ce qu'il coûte**.
- Chaque événement dit **le coût puis l'effet, au niveau qu'il porte réellement** : « Séjour Verdun 3e · 14-16 octobre · **tes 3e perdraient 3 heures ; tes 4e, zéro** ». **Jamais un nom de classe qui n'est pas dans l'événement** : mesuré, 15 événements sur 15 portent un niveau et `classes: []` — annoncer « la 3e Franklin » ferait inventer une donnée au code.
- **Le site propose la coche dès qu'un événement coûte au moins une heure à au moins une classe.** **Un événement qui ne coûte aucune heure n'a pas de case.**
- **Un événement qui nomme un NIVEAU** — 15 sur 15, donc le cas normal. **Le site calcule et montre d'abord, Paul coche ensuite** :
  > **Les stages de 3e — voici tes heures des 16, 17 et 18 novembre.**
  > ☐ 3e Franklin · lundi 16 novembre, 10:07 → 1 heure
  > ☐ 3e Dylan · lundi 16 novembre, 15:07 → 1 heure
  > ☐ 3e Franklin · mardi 17 novembre, 08:57 → 1 heure
  **UN écran par ÉVÉNEMENT**, pas un par jour : un stage de trois jours donne **une seule fiche** listant les heures de ses trois jours, **une case par heure**.
  **Les cases sont VIDES au départ.** Tant que rien n'est coché, **aucune heure n'est retirée**. Conditionnel avant confirmation (« perdrait », jamais « perd »). Pas de vocabulaire d'ingénieur.
  **UNE SEULE CASE, dont le sens est : « cette heure a bien été perdue ».** La justification ne vient pas d'une seconde case : elle vient du **motif** (§⑦). Décision de Paul : *« ce qui est dans le calendrier, c'est l'établissement, donc si je perds des heures elles sont tout à fait justifiées »* — **toute heure perdue par un événement du calendrier est justifiée, sans exception et sans bascule**.
- En tête : le total, par classe — « cette année, X heures perdues, dont Y déclarées justifiées ».

## ⑦ LES QUATRE MOTIFS D'UNE HEURE PERDUE — et d'où vient la justification
**Toute heure perdue porte un MOTIF et un STATUT.** Le statut ne se saisit pas : il découle du motif.
| Motif | Statut par défaut | Basculable ? |
|---|---|---|
| **événement du calendrier** (§⑥) | **justifiée** | **non** — ce qui vient de l'établissement est justifié, point |
| **heure banalisée** (§⑧) | selon la catégorie (tableau du §⑧) | **oui**, d'un clic |
| **heure prise par une autre classe** (§⑩, perte sèche) | **justifiée** (changement subi) | **oui** |
| **heure à replacer jamais replacée** (§⑩) | **non justifiée** (elle avait été rendue, Paul ne l'a pas reposée) | **oui** |

**UNE HEURE, UNE CLÉ, UN SEUL MOTIF.**
La coche « heure perdue » et la banalisation vivent dans le même magasin `decisions`, à la même clé `edtCleHeure(iso, creneau, classe)`. Mesuré : `edtEcrireDecision` fait `d[nomClasse].heures[cleHeure]=valeur` — un REMPLACEMENT TOTAL de l'objet, pas une fusion. Sans règle, le second geste efface le premier en silence : la perte exacte que ce lot ferme.
**RÈGLE : le geste le plus récent remplace le motif, et le site le dit avant.**
- Jamais de refus : Paul n'est jamais bloqué sur un geste de classe.
- Jamais en silence : avant d'écrire, le site nomme ce qu'il remplace — « cette heure est déjà comptée perdue à cause de *Stages 3e* — la banaliser remplacera ce motif. » Symétrique dans l'autre sens.
- **Une heure ne compte JAMAIS deux fois** dans le total : un seul motif par clé.
- **Le motif qui gagne apporte ses règles** : une heure du calendrier remplacée par une banalisation devient basculable ; l'inverse redevient non basculable.
- **La case affiche le motif retenu** (une heure banalisée par-dessus une coche s'affiche `sansSeance`), et la fiche de l'événement montre cette heure décochée avec la mention « banalisée le <date> ».
- **↶ Annuler restaure le motif précédent** : `edtEcrireDecision` capture déjà `avant` au journal, tu t'appuies dessus, tu n'inventes rien.
**Preuve (⑰.10, à compléter)** : une heure cochée depuis la fiche d'un événement, puis banalisée → l'annonce du remplacement est affichée avant l'écriture · le total ne bouge que d'une unité, jamais de deux · le statut est devenu basculable · ↶ Annuler rend la coche d'origine, relue au hub · et le geste inverse, mesuré de la même façon.

**UNE HEURE DÉPLACÉE N'EST PAS UNE HEURE PERDUE — et le champ existe déjà.**
Mesuré : `edtDeplacerVers` pose DÉJÀ `deplaceeVers:'<iso>|<creneau>'`, en plus de `sansSeance:true`. Tu n'as rien à créer. Ses deux autres occurrences sont dans le retour arrière (« une heure déplacée se défait des deux côtés »).
**Tu ne retires PAS `sansSeance` du déplacement** : la nature d'une case vient de `dec.sansSeance` (`cel.nature='sansSeance'`), et `deplaceeVers` n'apparaît nulle part à l'affichage. Le retirer ferait redevenir la case de départ « prévu » — la séance réapparaîtrait des deux côtés — et casserait ↶ Annuler, qui s'appuie sur `deplaceeVers` pour défaire les deux côtés.
**Trois gestes, et rien d'autre :**
1. **Une nature de plus à l'affichage** : `sansSeance` + `deplaceeVers` → `cel.nature='deplacee'`, avec son rendu propre et son libellé (« heure déplacée vers le <date> <créneau> », et à l'arrivée « heure venue du … »). `sansSeance` seul reste `'sansSeance'`.
2. **Le compteur d'heures perdues ignore toute décision portant `deplaceeVers`**, quelle que soit sa catégorie et quelle que soit la bascule du §⑧. Il ne lit plus `sansSeance` seul : `if(h[k] && h[k].sansSeance && !h[k].deplaceeVers) n++;`
3. **↶ Annuler reste intact** : mêmes deux côtés, même champ.

**Le total en tête se calcule sur les quatre motifs**, par classe. **Le statut retenu est écrit dans la décision**, jamais recalculé à l'affichage : une bascule de Paul survit à tout.

## ⑧ BANALISER UNE HEURE — le mot juste, et ce que ça coûte
Paul : « banaliser cette heure. » Le geste existe (`edtSansSeance`), mais **son libellé est faux** : il dit « ne plus compter cette **séance** dans la prévision horaire » alors que Paul banalise **une heure** — la séance, elle, continue ailleurs.
**Le libellé devient « Banaliser cette heure »**, partout : bouton, modale, journal, infobulle. Les dix catégories (`EDT_CATEGORIES`) et la précision libre ne changent pas.
**Ce qui est NOUVEAU : une heure banalisée entre — ou non — dans les heures perdues, selon sa catégorie.** Règle de Paul : *« tout ce qui concerne le pédagogique et le cours d'une façon ou d'une autre (le français) est du temps de classe »* ; le reste est une **heure perdue sèche**.
| Catégorie | Classement par défaut |
|---|---|
| Évaluation hors séance | **temps de classe** |
| Reprise ou rattrapage | **temps de classe** |
| Gestion de classe | **temps de classe** |
| Événement d'établissement | heure perdue · **justifiée** |
| Sortie, voyage, projet | heure perdue · **justifiée** |
| Orientation et vie de classe | heure perdue · **justifiée** |
| Absence du professeur | heure perdue · **justifiée** |
| Absence massive d'élèves | heure perdue · **justifiée** |
| Temps libre choisi | heure perdue · **non justifiée** |
| Autre | heure perdue · **non justifiée** |
**Le classement est une PROPOSITION** : Paul bascule d'un clic entre « temps de classe » et « heure perdue », et entre « justifiée » et « non justifiée ». **Le classement retenu est écrit dans la décision**, pas recalculé depuis la catégorie : son choix survit.

## ⑨ L'ALERTE MENSUELLE — aveugle, sans réseau
Le nœud `calendrier` porte la date de sa dernière injection. **Un calendrier déjà au hub qui n'en porte pas reçoit la date du premier chargement** (jamais d'alerte immédiate). **Un mois après**, une ligne discrète, non bloquante : « Le calendrier de l'année a été injecté il y a un mois — pense à le réinjecter s'il a bougé », avec « Réinjecter maintenant… » et « Plus tard » (repousse de 30 jours). **Le site ne lit rien à l'extérieur** : il compte les jours. La date de dernière injection est affichée pour chaque objet.

## ⑩ LES TROIS ISSUES, L'HEURE À REPLACER — de l'HORAIRE, jamais du contenu
Paul : « écrasement (horaire toujours, bien évidemment ! pas contenu) ». **Aucune séance, aucune activité, aucune trace n'est touchée** : la grille ou les décisions bougent, le prévu se recalcule dessus.
**Au dépôt sur une case occupée par une AUTRE classe, trois issues** (aujourd'hui : refus sec) :
1. **Confirmer le refus** — rien ne se passe.
2. **Échanger** — les deux classes permutent ; personne ne perd d'heure ; les deux prévus se recalculent.
3. **Écraser** — Paul prend le créneau ; l'heure évincée devient une **heure à replacer**.
**L'heure à replacer** : Paul la pose tout de suite (liste des destinations, toute l'année) **ou la laisse en attente** — alors elle est **rappelée dans la vue de la classe et au bandeau jusqu'à ce qu'elle soit posée**, **jusqu'à la fin de l'année** ; **elle n'entre pas dans le prévu** (elle n'a pas de créneau) ; **à la fin de l'année, non posée, elle entre aux heures perdues**. Posée, elle est épinglée.
**Perte sèche** : Paul déclare que l'heure ne sera pas rendue → heures perdues, motif « heure prise par une autre classe ».
**Avant confirmation, le site dit toujours ce que ça coûte et à qui** : « la 4D perd son heure du vendredi 13 — à replacer, ou perdue ? »
**Deux cas tranchés** : le refus porte sur **une heure DONT LA TRACE EXISTE** (elle a été lancée) ; **une heure du jour non encore lancée reste déplaçable**, et une trace vide supprimée la rend de nouveau déplaçable. Une heure **déjà déplacée par Paul** que la responsable rechange → le site **ne refuse pas** : il dit ce qu'il va défaire (« cette heure avait été déplacée par toi le 12/11 ») et Paul confirme.

## ⑪ LA LISTE DES DESTINATIONS
Elle reste **entière jusqu'à la fin de l'année scolaire** (804 entrées mesurées, groupées par semaine), avec **une recherche par mois, par numéro de semaine et par type de semaine (A ou B)**.
**Elle propose aussi les créneaux occupés par une autre classe**, marqués « pris par la 3 DYLAN Bob », qui ouvrent **les trois issues** du §⑩ : aujourd'hui ils sont absents, donc le geste de Paul (« tu fais les 4C à la place des 4D vendredi ») est impossible par la liste.
**Ce qui est déjà juste et ne bouge pas** : les créneaux **libres de l'emploi du temps de Paul** (653 mesurés) sont proposés et marqués « créneau libre, heure ajoutée » — c'est un trou de SON emploi du temps, pas « un créneau libre de cette classe ».

## ⑫ AUCUN TÉLESCOPAGE — vérifié, pas supposé
Après **tout** geste (déplacement, échange, écrasement, heure ajoutée, heure replacée, changement d'emploi du temps) : **jamais deux classes au même créneau le même jour** · **jamais deux fois la même classe au même créneau** · **jamais une heure sur un jour sans cours, le mercredi après-midi, ou dans le passé** — où **« dans le passé » veut dire un JOUR antérieur à aujourd'hui, jamais une heure antérieure à maintenant** (c'est déjà ce que fait `edtRefusDepot` : `dst.iso < edtAujourdhui()`), sinon le geste autorisé au §⑩ serait refusé par le contrôle lui-même.
Écris `edtVerifierCoherence`, qui rend la liste des télescopages trouvés, **appelée par le banc après chaque geste**, résultat au rapport.
**Une classe non appariée ne reçoit aucune décision** : les cases « classe non encore importée » ne se saisissent pas et n'ouvrent aucun geste ; message clair.

## ⑬ LA VUE ANNÉE — le principe de l'agenda, la forme du calendrier de l'établissement
Paul : « à gauche, ce sont LES DATES DES JOURS DU MOIS. » · « il faut reprendre le même principe que l'agenda google. »
**MAQUETTES DE RÉFÉRENCE, AU SAS, VALIDÉES PAR PAUL** — `TRANSCRIPTS/C10/pieces/` : `T151-annee-agenda-v2.html`, `T152-annee-dezoome.html`, `T152-annee-zoome.html`, `T152-calendrier-annee.html`. Faites sur le calendrier réel. **C'est l'écran à obtenir, tu ne le réinventes pas.**
**MÉTHODE IMPOSÉE POUR CET ÉCRAN — maquette avant code.** Avant d'écrire la vue, tu produis **ton rendu statique** sur le calendrier réel, tu le pousses au sas avec la capture, **et tu STOP**. Paul le compare aux quatre pièces et te relance. C'est le seul écran entièrement neuf du lot : on ne code pas trois jours pour découvrir à la fin qu'il n'est pas celui qu'il voulait.
**La frise par classe est abandonnée.** Douze mois **en colonnes** (août → juillet), les jours **en lignes** (1 à 31), chaque ligne portant **le numéro du jour et l'initiale du jour**.
- **Les événements sont des bandeaux** sur les jours qu'ils occupent — un séjour de trois jours est **un bandeau de trois jours** —, **empilés** quand ils se chevauchent, tronqués proprement, libellé complet au survol et au clic. Trois natures, trois couleurs : **événement de classe** · **établissement** · **jalon commun**. Les **59 événements d'établissement et les 15 de classe doivent être là** — ils sont aujourd'hui **totalement absents**.
- **Vacances et fériés** : fond de case.
- **Ce que MJPC ajoute** : pour chaque jour, **une pastille par classe** (jouée : vert · prévue : gris · sans séance : ambre), quatre au maximum.
- **Les jours sans cours sont aplatis** : week-ends, vacances, fériés au minimum de hauteur, **numéro et initiale toujours lisibles** ; la hauteur libérée va aux jours de cours.
- **Aucun trait ne traverse les pistes** (« pourquoi y a-t-il des grandes barres jaunes verticales ? »).
- **Zoom** : **Ctrl + molette** ; **dézoomé, l'année entière tient sur une page** (état par défaut) ; zoomé, les libellés se lisent en entier et **le défilement horizontal est autorisé — seul écran de l'EDT où il l'est**.
- **Un événement à cheval sur deux mois** donne **deux bandeaux, un par colonne, avec une marque de continuité** (→ en fin de mois, ← en tête du suivant) : une colonne ne déborde jamais sur la suivante.
- **Une légende** dit les trois couleurs, les pastilles, les jours aplatis.

## ⑭ LES PHOTOS DU PRÉVU
**Photo automatique à la rentrée et au début de chaque période**, **plus une photo à la main quand Paul veut** ; « le cockpit compare le réel à la photo de ton choix ». Deux manques mesurés : **aucun identifiant** (§①) et **la prise automatique n'existe pas** — `edtPhoto` n'est appelée que par le bouton. Les deux sont à faire. Plusieurs photos le même jour sont normales : **rien n'écrase**, elles se distinguent par leur `id` horodaté. Le mot « figer » n'apparaît nulle part.

## ⑮ LES DATES DE L'ANNÉE — deux champs de plus, au même endroit que le brevet
Paul : « deux autres champs à créer, dans la partie dates du brevet (on peut remplacer par DATES DE L'ANNÉE)… et si besoin, je remodifierai les dates à la main après, et tout doit se recaler en fonction. »
**Rien à réinventer** : tu écris déjà `/site/config/brevetDates` à l'injection du calendrier (exception ① du contrat), et ce nœud existe au hub avec ses quatre niveaux. **Deux champs de plus, au même endroit, par le même chemin** : `debutAnnee` et `finAnnee`.
- **Le nœud NE CHANGE PAS DE NOM** : `/site/config/brevetDates` reste `/site/config/brevetDates` — `ecrireBrevetDate` s'appuie dessus. **Seule l'étiquette à l'écran** devient « Dates de l'année ».
- **Produits par le prompt du calendrier**, **injectés avec lui**, **modifiables à la main**, mêmes champs date que `ecrireBrevetDate`.
- **Tout se recale dessus** : fin de la liste des destinations, bascule des heures à replacer (§⑩), appartenance d'une date à l'année scolaire.
- **`EDT_ANNEE` cesse d'être deviné.** Mesuré : `EDT_ANNEE=(function(){…(d.getMonth()>=7)…})()` est **calculé au chargement du script**, donc `debutAnnee`, qui arrive après la lecture du hub, ne servirait à rien tel quel. Il devient une valeur **recalculée après la lecture des objets**, avec repli sur le calcul actuel si le champ est absent. Mesuré : **13 occurrences dont la déclaration, soit 12 usages** — **les douze sont recensés dans `verif_edt.py`**, et aucun ne doit lire une valeur figée avant la lecture.
- **Refus nommés, chiffrés** : fin avant début · écart supérieur à treize mois · date **hors des bornes du calendrier injecté élargies d'un mois**.
- **Si Paul AVANCE `finAnnee` à la main**, les heures à replacer posées au-delà **ne disparaissent pas** : elles **redeviennent des heures à replacer en attente**, nommément signalées — « 2 heures posées après la nouvelle fin d'année : à replacer avant le 26 juin, ou perdues ? ».
- *Repère de réalité : la fin d'année tombe souvent vers le 25-26 juin, avant le brevet blanc — **pas** au début des vacances d'été. Aucune déduction depuis les vacances.*

## ⑯ CE QUI NE DOIT PAS BOUGER
Les autres fonctions du bloc · le prévu calculé (jamais stocké) · les quatre vues · la porte du pilotage (**six champs identiques**) · les décisions horaires et ↶ Annuler · le glisser-déposer et sa question du dépôt · les versions datées de la grille · le sans-scroll (sauf §⑬) · les trois portes · les trois exceptions · la garde **VERTE et rouge sur les trois contrôles négatifs** · moteur `AT_DR_B64` **intact** · double parseur vert · **le contrat ne s'élargit pas en silence : tout appel nouveau entre dans `verif_edt.py` avec sa raison**.
**Compteurs de non-régression, mesurés le 27/08 — méthode nommée au rapport** :
- `function edt*` : **139 déclarations pour 138 noms** aujourd'hui (le doublon `edtPeriodePoser`) → **138 pour 138** après la livraison ①. Tout autre écart est signalé, jamais ajusté pour tomber juste.
- `function secu*` : **29 déclarations** (ne compte pas les occurrences : il y en a 189, et le chiffre de 141 qui circulait ne correspond à rien)
- `published` : **97 occurrences**
- `EDT_ANNEE` : **13 occurrences, 12 usages**

## ⑰ PREUVES EXIGÉES — mesurées, aucune affirmée
1. **Identité** : chaque élément reçoit son `id` — à l'injection pour un objet neuf, au chargement pour un objet existant —, compté par famille, avant/après ; un `id` existant n'est jamais recalculé ; deux éléments identiques → `#2` et mention à l'écran ; un objet créé après la pose ne reçoit jamais `#2`.
2. **Décisions hors de l'objet, sur un calendrier HÉRITÉ.** Mesuré : le JSON du sas porte 15 `justifie:false` et aucun `true` — l'état hérité n'existe pas, tu le FABRIQUES. Banc : `tests/calendrier-herite.json` = le calendrier réel avec **5 événements passés à `justifie:true`, nommés dans le rapport**, posé sur faux hub SANS `id`. Puis un chargement.
   Attendu, mesuré au hub après migration : **les 5 coches sont dans `decisions`**, à leur clé heure, avec l'`id` de leur événement · **le nœud calendrier ne porte plus un seul champ `justifie`** (compté : 0 sur 15) · **aucune coche perdue** (5 avant, 5 après, nommément) · l'archivage a eu lieu avant l'écriture, et un **archivage simulé en échec laisse les 5 `justifie:true` intacts dans le calendrier, rien dans `decisions`**.
   Puis, seulement après : réinjection complète → les 5 coches survivent dans `decisions`, et le JSON régénéré ne contient aucun `justifie`.
3. **La coche ne se trompe plus** : coche sur le 5e événement, insertion d'un événement en tête, relecture → même événement, nommément.
4. **Différentiel — DEUX BANCS, aux attendus OPPOSÉS.** Entrant réellement modifié dans les deux cas : **trois libellés retouchés**, **un événement déplacé** d'un jour, **un supprimé**, **un ajouté**, cinq coches posées avant.
   **(a) AVEC les `id`** → conservation **silencieuse** ; le supprimé nommé ; l'ajouté annoncé ; le déplacé → heures reproposées vides.
   **(b) SANS les `id`** → le déplacé et les trois retouchés **signalés comme candidats**, Paul confirme, **aucune conservation silencieuse**.
   Sans (b), le mécanisme n'est jamais éprouvé : il suffirait de lire les `id` pour passer au vert.
5. **Première injection** (le chemin réel) : hub vide → injection complète → tous les `id` posés, différentiel annoncé « première injection », aucune perte, `brevetDates` enrichi de `debutAnnee`/`finAnnee`.
6. **Archivage** : une injection qui écrase archive d'abord ; **archivage simulé en échec → rien n'est écrit**, message « rien n'a été remplacé ».
7. **Prompt en un collage** : le presse-papiers contient consigne **+** JSON en service (longueur et première clé mesurées) ; sans objet au hub, la mention « première injection » ; **aucun `justifie` dans le JSON copié**.
8. **Heures perdues** : coût par niveau affiché pour chaque événement du calendrier réel, **jamais un nom de classe absent de l'événement** ; cases proposées partout où au moins une heure est perdue, aucune là où rien n'est perdu ; **cases vides au départ** ; un écran par événement ; total en tête.
9. **Heure déplacée** : une heure déplacée → **zéro heure perdue**, avant ET après bascule de sa catégorie ; la case de départ affiche la nature `deplacee` avec son libellé, l'arrivée le sien ; **↶ Annuler défait toujours les deux côtés**.
10. **Banalisation** : dix heures, une par catégorie → classement par défaut conforme au tableau ; deux basculées à la main → la bascule est au hub et survit au rechargement ; le total des quatre motifs et le sous-total justifié sont justes ; **plus la preuve de remplacement de motif du §⑦**, qui fait partie de cette preuve 10.
11. **Alerte** : apparaît à J+30 de la dernière injection et pas avant (date forcée), « Plus tard » repousse de 30 jours, **zéro requête réseau ajoutée**.
12. **Trois issues** : refus confirmé → rien écrit · échange → permutation, **zéro heure perdue**, aucune trace touchée · écrasement → heure à replacer créée, rappelée, posée plus tard → épinglée ; laissée jusqu'à la fin de l'année → entre aux heures perdues. **Une heure dont la trace existe : refusée.** Une heure déjà déplacée rechangée : **annoncée puis appliquée**.
13. **Liste** : les créneaux occupés apparaissent, nommés, et ouvrent les trois issues ; recherche par mois, semaine, type A/B ; les 653 créneaux libres toujours proposés.
14. **Télescopages** : `edtVerifierCoherence` après chacun des six gestes → **zéro télescopage**, chiffre au rapport. Classe non appariée : aucun geste, message affiché.
15. **Appariement biunivoque** : quatre événements homonymes **à dates différentes, dont deux permutées** → chacun garde **sa** coche, aucune permutation ; **un cinquième strictement identique** → **ambiguïté nommée, rien d'appliqué**.
16. **Une règle par famille** : réinjection de la **grille** avec un créneau déplacé et un horaire modifié à la main. Le créneau déplacé est un appariement **faible** : le banc **joue la confirmation de Paul**. Après confirmation, `classeMjpc`, les créneaux fictifs et l'horaire modifié **survivent**, relus au hub. Sans confirmation : rien de conservé silencieusement.
17. **Vue Année** : sur le calendrier réel — 12 mois, jours numérotés, **15 événements de classe et 59 d'établissement présents et comptés**, 30 jalons, vacances en fond, pastilles, jours aplatis, **aucun trait traversant**, légende ; **dézoomé : tout sur une page** ; **zoomé : défilement horizontal, libellés entiers** ; captures des deux états **comparées aux quatre pièces de référence** ; **surface utile ≥ 55 % dézoomé**, méthode de mesure nommée au rapport (la même que celle qui a donné 58,9 %).
18. **Photos** : identifiant horodaté sur chaque photo ; **prise automatique à la rentrée et au début d'une période** (dates forcées) ; deux photos le même jour cohabitent sans s'écraser.
19. **`EDT_ANNEE`** : `debutAnnee` au 1er septembre → année en cours, liste des destinations et bascule des heures à replacer s'y conforment ; champ absent → repli, sans erreur ; les 12 usages recensés.
20. **`edtPeriodePoser`** : une seule déclaration subsiste, les trois appels passent, rien d'autre n'a bougé.
21. **Non-régression** : la liste du §⑯, chiffrée, méthode nommée.

## ⑱ MÉTHODE ET DÉCOUPE
**Livraisons courtes**, chacune poussée au sas et close par un arrêt ; Paul relance par « continuer » (le « continuer » natif plante une fois sur deux). **Chaque livraison porte sa version** (`8.73.0-①`, `-②`, …) et son rapport ; **aucune n'écrase la précédente sans trace**. La dernière porte `8.73.0`.
**Découpe imposée** — l'ordre n'est pas négociable, il suit la dépendance réelle :
- **①** Identité des objets (à l'injection d'abord, en mise à niveau ensuite) + les cinq fonctions par `id` + suppression de la déclaration morte.
- **②** **Les décisions sortent de l'objet injecté** (§②) — magasin `decisions`, clé heure, `justifie` retiré partout, migration archivée en une seule écriture. *Rien d'autre ne peut être juste avant ça.*
- **③** Appariement gradué et biunivoque + différentiel + archivage avant écrasement.
- **④** Prompts en un collage + JSON régénérés sans `justifie`.
- **⑤** Heures perdues + quatre motifs + banalisation + **nature `deplacee` et heure déplacée hors des heures perdues** + alerte mensuelle. **Seuls deux des quatre motifs existent à ce stade** (événement du calendrier, heure banalisée) : les motifs « heure prise par une autre classe » et « heure à replacer jamais replacée » naissent en ⑥. La preuve ⑰.10 se limite donc, en ⑤, aux deux motifs existants, et le total complet est prouvé en ⑥. Le code du total est écrit d'emblée pour quatre motifs : aucune reprise en ⑥, seulement deux sources qui se branchent.
- **⑥** Trois issues, heure à replacer, liste, télescopages, **puis les dates de l'année** (leur preuve porte sur la bascule des heures à replacer, qui naît ici).
- **⑦** Vue Année — **rendu statique d'abord, capture au sas, STOP**, puis la vue.
- **⑧** Photos + bancs complets, garde, matrice, `SEQUENCE-TEST-PAUL.md`, audit adverse, rapport final.
**Un exécutant ne livre JAMAIS avec une dette** : tout se résout de A à Z avant la livraison finale, sauf ce que le §⑯ exclut. **Écris tes rapports pour une conscience qui n'a pas vu la conversation** : chiffres, chemins, captures.
**Audit adverse, à la fin** : au lieu de vérifier que ce que tu as prévu fonctionne, **cherche ce qui casserait ton code** — données absurdes (dates inversées, libellés vides, doublons, JSON tronqué), gestes dans le désordre (annuler avant d'agir, injecter pendant une modale ouverte, deux gestes sur la même case), états limites (**hub vide — c'est l'état réel**, une seule classe, année sans vacances). Rapporte **ce que tu as trouvé et ce que tu n'as pas su casser**.
**`SEQUENCE-TEST-PAUL.md` est à mettre à jour** ; Paul la joue **après** la promotion — ne la lui donne pas maintenant.

## ⑳ LA CLASSE D'ESSAI ET SON EFFACEMENT — deux dettes entrées dans le lot
**Ce que ça change pour la classe** : Paul doit pouvoir jouer son flux complet — lancer une heure, poser une trace, banaliser, déplacer, compter ses heures perdues — **avant la rentrée et sans toucher à une vraie classe**. Ses vraies classes n'arrivent qu'en M17a, en tout dernier ; sans classe d'essai, il ne peut rien éprouver d'ici là.

**A · LA CLASSE D'ESSAI N'EXISTE PAS.** Mesuré dans le candidat : `creneauxFictifs` **0 occurrence**, `fictif` **0**, `Charles de Gaulle` **0**. Le champ est bien dans `json/grille-2026-2027.json`, mais **aucune ligne de code ne le lit** ; et l'entrée elle-même est un gabarit vide (`jour`, `creneau`, `classe` à `""`).
- Le code **lit `creneauxFictifs`** et pose ces créneaux comme des cases réelles de la grille de Paul, **appariées d'emblée à `3E Charles de Gaulle`** — cette classe existe déjà au hub (mesuré dans `/classes`), rien à créer.
- Ces cases **ouvrent TOUS les gestes** : lancer l'heure, poser une trace, banaliser, déplacer, échanger, heures perdues. Une case d'essai bridée n'éprouve rien.
- Elles **se disent à l'œil par un libellé** (« classe d'essai »), jamais par une couleur seule.
- Elles **ne tombent jamais sur une case occupée** : uniquement les 19 trous réels mesurés de l'emploi du temps de Paul, **jamais le mercredi après 11:59**.
- Une réinjection de la grille **ne les perd pas** et **ne les duplique pas** : elles ont un `id` comme les autres (§①) et suivent la règle de la famille `creneauxGrille`.

**B · RIEN DE L'EDT NE DISPARAÎT À LA PURGE.** Mesuré au hub : `manifestes/index.purge` = purger `['eleves_index','codes']`, **preserver `['site','site/annonces','site/config','site/atelier']`**. `site` est préservé **en entier** : `/site/edt/**` survit intégralement à la purge, et il n'existe aucun manifeste `site` distinct.
- **Le retrait de la classe d'essai est un geste NOMMÉ, pas un effet de bord de la purge.** « Retirer la classe d'essai » retire les créneaux fictifs **et tout ce qu'ils ont produit** — traces, décisions horaires, heures perdues, photos portant cette classe.
- Il **archive avant de retirer** et **abandonne si l'archivage échoue** (§④.2), et **nomme avant le geste** ce qui va partir : « 4 créneaux d'essai · 12 heures jouées · 3 décisions · 1 photo ».
- **La purge n'est pas modifiée** par ce lot : elle continue de préserver `site`. Le mandat ne s'élargit pas en silence — le retrait est une porte de l'EDT, déclarée au contrat.

**Preuves (à ajouter au §⑰)** :
22. **Classe d'essai** : les créneaux fictifs apparaissent aux trous déclarés, marqués, appariés à `3E Charles de Gaulle` · aucun ne tombe sur une case occupée ni le mercredi après-midi · `edtVerifierCoherence` → **zéro télescopage** · les six gestes s'ouvrent et s'exécutent sur une case d'essai · réinjection de la grille → ni perte, ni doublon.
23. **Retrait** : ce qui va partir est nommé et chiffré avant le geste · l'archive est écrite d'abord · **archivage simulé en échec → rien n'est retiré** · après retrait, plus une seule trace, décision, heure perdue ou photo de cette classe, compté à zéro au hub · les cases des vraies classes n'ont pas bougé, comptées.

**Découpe** : **A** entre dans la livraison **⑥** (elle vit dans la grille et ouvre les gestes) · **B** entre dans la livraison **⑧** (elle touche l'archivage et le nettoyage final). Aucune des deux ne peut rester ouverte à la livraison finale.

## ⑲ LIVRABLE
Sas `PONT/EDT/` : `index.html` (**8.73.0**) · `rapport-2ter.md` · `tests/` (bancs réutilisables, captures) · `prompts/calendrier.md`, `prompts/grille.md` réécrits · `json/*.json` régénérés avec leurs `id` et **sans `justifie`** · `outils/verif_edt.py` à jour · `SEQUENCE-TEST-PAUL.md` à jour. **STOP après chaque livraison. Ne promeus jamais.**
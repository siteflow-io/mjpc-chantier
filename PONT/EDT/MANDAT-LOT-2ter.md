# MANDAT EXÉCUTANT — LOT 2ter · IDENTITÉ DES OBJETS, RIEN NE SE PERD, LA VUE ANNÉE (conscience n°10, cadré avec Paul le 26/08/2026)
*Base : ton candidat au sas, `PONT/EDT/index.html`, **8.72.0**, md5 `01c8c7026abe362dc83b04519110d983`, 1 642 840 o, 138 fonctions `edt*`. Audité, sans dette. **STOP si le md5 diffère.** Candidat à produire : **8.73.0**.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul
« oh putain. je pensais que c'était cadré ! » — en découvrant qu'aucun objet de l'EDT ne porte d'identifiant.
« tout est un objet, encore une fois. » · « les photos doivent aussi avoir des ids internes. toujours pareil : objet, donc id. »
« qu'est-ce qui, modifié, peut faire perdre des données écrites avant ? » · « je veux savoir exactement quoi remplace quoi, qu'est-ce qui disparaît, qu'est-ce qui est simplement déplacé. »
« heures perdues c'est pas mal. c'est un sujet récurrent en salle des profs, et là j'aurai une mesure précise. »
« il faut reprendre le même principe que l'agenda google. » · « à gauche, ce sont LES DATES DES JOURS DU MOIS. »
**Aujourd'hui, deux choses cassent en silence.** ① `edtJustifier(i)` désigne un événement **par son indice** : une réinjection qui décale la liste fait tomber la coche de Paul **sur le mauvais événement**, sans erreur, sans un mot. ② Toute réinjection **écrase l'objet entier** : les coches, les appariements de classes, les créneaux fictifs, les horaires modifiés à la main disparaissent sans être signalés. C'est ce lot qui ferme ces deux trous, **avant** que Paul ait posé ses décisions de l'année.

Tu es EXÉCUTANT MJPC. Tu codes, tu livres au sas, tu ne promeus JAMAIS. Français partout. Avant de coder un point, tu dois pouvoir dire à quoi il sert en classe ; si tu devines, tu demandes. STOP après chaque livraison.

## ⓪ LECTURES · JETON
Prod `docs/` : `MJPC6-DETTES.md` (le cadrage des 25-26/08 est là, dans les mots de Paul — tours 153 à 170 pour ce lot) · `MJPC6-2-DOCTRINE.md` · `MJPC6-OU-TROUVER-QUOI.md`. Sas : tes propres rapports (`rapport-phase0` → `rapport-complement`), `outils/verif_edt.py`, `tests/`. **`index.html` fait 1,6 Mo : tu ne le lis jamais en entier**, tu lis par recherche et par extraits.
Jeton sas : **celui que tu as déjà** (il ne sera plus réécrit dans les mandats ; il est à révoquer et régénérer après ce lot) · production en LECTURE SEULE · hub en lecture seule dans tes bancs (faux hub, zéro écriture sortie).

## ① L'IDENTITÉ DES OBJETS — une AMORCE posée une fois, jamais recalculée
**Aucun élément de l'EDT n'a d'identifiant aujourd'hui.** Mesuré : `evenementsClasse` (15), `jalons` (30), `etablissement` (59), `feries` (11), `vacances` (7), `creneaux` de la grille (30) n'ont **rien** ; `creneaux` horaires et `periodes` n'ont qu'un **`rang`**, c'est-à-dire un ordre, pas une identité.

**La règle, et elle est stricte : l'`id` est une AMORCE, pas une formule vivante.**
- Au **premier chargement**, chaque élément sans `id` en reçoit un, calculé de façon **déterministe** (donc identique sur tous les appareils de Paul) à partir de ce qu'il porte à cet instant. La formule ne sert **qu'à cela**.
- Cet `id` est **écrit au hub par UNE écriture unique au premier chargement** — un **ajout pur**, sans archivage, **déclarée au contrat dans `verif_edt.py`** comme la seule écriture spontanée autorisée du bloc. (Sans elle, les `id` d'un chargement sans geste ne seraient jamais au hub, et la preuve ⑬.1 se mesurerait en mémoire au lieu du hub.) Il n'est **plus jamais recalculé, ni comparé, ni reconstruit** — même si la date, le libellé, le jour, le créneau ou la classe changent ensuite.
- **Conséquence à tenir** : un `id` ne dit rien du contenu de l'élément. Il ne sert qu'à le désigner. Toute fonction qui tenterait de retrouver un élément **en recalculant son `id`** est une faute : on cherche par `id` stocké, jamais par formule.
- **Un `id` ne contient donc jamais une position** : `crn:<jour>:<creneau>:<semaine>:<classe>` et `hor:<debut>-<fin>` sont des **amorces**, pas des adresses. Jour, créneau, semaine, classe, début et fin restent des **attributs** de l'élément, modifiables sans que l'`id` bouge — sans quoi « déplacer une heure » ou « modifier un horaire à la main » recréerait exactement le bug du §②.
- Forme des amorces (lisibles pour le débogage, sans valeur sémantique) : `evc:` événement de classe · `jal:` jalon · `eta:` établissement · `fer:` férié · `vac:` période sans cours · `crn:` créneau de grille · `hor:` créneau horaire · `per:` période · `pho:` photo (**horodatage complet**, jamais la seule date : l'automatique de début de période et une photo à la main le même jour doivent différer), suivies d'un condensé du contenu au moment de la pose, **suffixé par la classe quand l'élément en dépend** (décision de Paul).
- **Collision au premier chargement** : deux éléments produisant la même amorce → le second reçoit `#2`. **Ce suffixe dépend de l'ordre de parcours** : il n'est acceptable que parce qu'il n'a lieu **qu'une fois**, à la pose. **`#2` ne s'applique JAMAIS à un objet créé après la pose initiale** — un objet neuf naît avec son `id` propre. Le parcours doit être **déterministe** (ordre du tableau tel qu'il est au hub), et le fait est **dit à l'écran** (« deux événements identiques le 14/11 — le second a reçu un identifiant distinct »).

**L'APPARIEMENT À LA RÉINJECTION — gradué et biunivoque, jamais une simple conjonction.**
Un JSON qui arrive peut ne pas porter les `id` en service (première version, JSON venu d'ailleurs, IA qui ne les a pas reconduits). L'appariement se fait donc en quatre temps, dans cet ordre :
1. **L'entrant porte un `id` connu** → il fait foi, rien d'autre à faire.
2. Sinon, **appariement FORT** = **tous** les critères de la famille concordent → même élément, `id` conservé, **silencieux**.
3. Sinon, **appariement FAIBLE** = **tous les critères sauf un** concordent, **avec au moins un critère qui concorde**, et le candidat est **unique** → **proposé à Paul, jamais appliqué seul**. **Les familles à critère unique (férié, période) n'ont donc PAS d'appariement faible** : « tous sauf un » y vaudrait zéro critère, et un férié renommé s'apparierait à n'importe quel férié encore libre. C'est le cas douteux, et il couvre **aussi bien le libellé retouché que la date déplacée** — un événement déplacé du 16/11 au 17/11 est un appariement faible, pas une suppression suivie d'un ajout.
4. **Biunivocité obligatoire** : **un entrant ne s'apparie qu'à un seul existant, et un existant qu'à un seul entrant.** Sans cette contrainte, quatre « Conseil de classe » identiques s'apparient au hasard et **les coches de Paul permutent**. Un candidat déjà pris n'est plus candidat ; s'il reste une ambiguïté, on ne devine pas : on propose.

**LES CRITÈRES, FAMILLE PAR FAMILLE** — « niveau + date + libellé » ne veut rien dire pour un créneau ou une photo. Une règle nommée pour chacune des neuf familles, sans quoi tu devineras — et c'est la grille qu'on réinjecte le plus souvent :
| Famille | Critères de l'appariement fort |
|---|---|
| événement de classe | niveau · date de début · libellé normalisé |
| jalon · établissement | date · libellé normalisé |
| férié | date |
| période sans cours (vacances) | date de début · date de fin |
| **créneau de grille** | jour · créneau · semaine (A/B/AB) · classe de la grille |
| **créneau horaire** | **début-fin d'abord** ; le **rang seulement en second recours**, et **seulement si le nombre de créneaux est inchangé** — jamais le rang seul : si Paul insère un créneau, tous les rangs décalent d'un cran et les décisions permuteraient en silence |
| **période** | nom normalisé |
| **photo** | horodatage complet de la prise (à la seconde) · lundi photographié |
Libellé normalisé = minuscules, accents retirés, espaces réduits, ponctuation ôtée. **La classe appariée (`classeMjpc`), les créneaux fictifs et les horaires modifiés à la main sont des DÉCISIONS de Paul portées par l'élément : ils suivent l'`id`, jamais la position.**

## ② PLUS RIEN PAR INDICE NI PAR RANG
Cinq fonctions désignent aujourd'hui un élément par sa position ; elles passent **par l'`id`** : `edtJustifier` (par indice), `edtCreneauPoser`, `edtPeriodePoser`, `edtPeriodeSupprimer`, `edtPeriodeDeplacer` (par rang). Le `rang` reste un **ordre d'affichage**, jamais une identité.
**Preuve** : poser une coche sur le 5e événement, insérer un événement **en tête** de la liste, relire → la coche est **toujours sur le même événement**, nommément.

## ③ LE DIFFÉRENTIEL, ET RIEN NE SE PERD
**Aucune écriture n'écrase plus en silence**, sur aucun objet (14 écritures recensées dans ton bloc). Trois règles :
1. **Ce que Paul a posé à la main survit** à toute réinjection, par appariement d'`id` : coches « heures perdues », appariements de classes (`classeMjpc`), créneaux fictifs, horaires modifiés, dates de périodes, décisions horaires, photos.
2. **Archivage avant écrasement** — le modèle existe dans le site, copie-le : `chInjecterConfirme` en mode « remplacer » **archive à la corbeille AVANT d'écrire et ABANDONNE si l'archivage échoue** (« rien n'a été remplacé »). Même règle pour tout objet de l'EDT.
3. **Le différentiel est nominatif**, avant le geste, dans l'écran de vérification : **ce qui arrive** (id inconnu) · **ce qui est seulement déplacé** (apparié fort ou faible, date changée : « Stages 3e : 16/11 → 17/11 ») · **ce qui disparaît** (id absent) · **ce qui est conservé** de ses décisions. Un événement qui disparaît **et qui portait une coche** est nommé à part.
**Le cas douteux, c'est l'appariement FAIBLE du §①** — tous les critères de la famille sauf un, candidat unique. Il couvre donc **le libellé retouché ET la date déplacée**. Le site **ne décide jamais** : il signale et Paul confirme —
- « Séjour Verdun 3e (14/10) semble être devenu « Séjour à Verdun 3e » — reconduire ta coche ? »
- « Stages 3e semble avoir été déplacé du 16/11 au 17/11 — reconduire ta coche ? »
**Aucune conservation silencieuse sur un appariement faible**, et **aucune proposition quand le candidat n'est pas unique** : on nomme l'ambiguïté au lieu de la trancher.

## ④ LES PROMPTS D'INJECTION — un seul collage
Paul : « le prompt, quand je clique sur le bouton copier, doit contenir le json directement. comme ça pas besoin de faire deux copier coller. »
**Le bouton « Copier le prompt » de chaque voie copie UN SEUL bloc** : la consigne **+ le JSON actuellement en service au hub**, inséré tel quel. Si l'objet n'existe pas encore : « aucun calendrier en service — c'est une première injection », jamais un vide muet. Le patron existe déjà dans le site (`ATELIER_PROMPT_SEED`, `atIA*`) : reprends-le, ne l'invente pas. Le bouton « Sortir le JSON actuel » reste, pour les usages hors injection.
**Les deux prompts (`prompts/calendrier.md`, `prompts/grille.md`) sont réécrits** : l'IA reçoit l'existant, **reconduit les `id`** de tout élément qu'elle reconnaît, n'en crée que pour les vrais nouveaux, **ne reformule jamais un libellé**, ne renumérote rien, et **déclare en fin de sortie** ce qu'elle a fait : ajoutés, déplacés, supprimés, renommés — avec leurs noms. Les JSON du sas sont régénérés avec leurs `id`.

## ⑤ HEURES PERDUES — l'écran, et ce qu'il dit
L'entrée « Calendrier de l'année… » devient **« Heures perdues »**. Elle ne règle pas le calendrier : elle dit **ce qu'il coûte**.
- Chaque événement dit **le coût puis l'effet** : « Séjour Verdun 3e · 14-16 octobre · **la 3e Franklin perd 3 heures, les autres classes zéro** → cocher : ces 3 heures ne compteront pas dans son retard. »
- **Le site propose la coche dès qu'un événement coûte au moins une heure à au moins une classe** (décision de Paul, tour 175). **Un événement qui ne coûte aucune heure n'a pas de case** : rien à décider. *Mesure qui fonde la règle : aucun des 15 événements de classe du calendrier de Paul ne nomme de classe — ils portent tous un niveau (9 en 4e, 6 en 3e) ; une règle « seule classe à perdre » n'aurait presque jamais proposé de case.*
- **Un événement qui nomme un NIVEAU et pas une classe** (« Stages 3e ») — c'est le cas de **15 événements sur 15** chez Paul, donc le cas normal, pas l'exception. **Le site calcule et montre d'abord, Paul coche ensuite** (décision de Paul, tour 178) :
  > **Les stages de 3e — voici tes heures des 16, 17 et 18 novembre.**
  > ☐ 3e Franklin · lundi 16 novembre, 10:07 → 1 heure
  > ☐ 3e Dylan · lundi 16 novembre, 15:07 → 1 heure
  > ☐ 3e Franklin · mardi 17 novembre, 08:57 → 1 heure
  **UN écran par ÉVÉNEMENT**, pas un par jour : un stage de trois jours donne **une seule fiche** listant les heures de ses trois jours, **une case par heure**. Sinon Paul coche trois fois la même chose.
  **Les cases sont VIDES au départ** : c'est Paul qui coche les heures réellement perdues, le site ne coche jamais à sa place. Tant que rien n'est coché, **aucune heure n'est retirée**. Les libellés restent au conditionnel avant confirmation (« perdrait », jamais « perd »). Une phrase claire et concrète, pas de vocabulaire d'ingénieur.
  **UNE SEULE CASE, et son sens est : « cette heure a bien été perdue ».** Un événement du calendrier de l'établissement est **subi** : cocher vaut donc **perte ET justification** en un seul geste. Il n'y a pas de seconde case « justifiée » pour ces événements ; le total « dont Y justifiées » se calcule parce que les **autres** sources d'heures perdues, elles, ne sont pas justifiées (§⑤bis).
- En tête : le total, par classe — « cette année, X heures perdues, dont Y déclarées justifiées ».
- **Y entrent aussi** : les heures « sans séance » déclarées par Paul, les heures prises par une autre classe (§⑦), et **les heures à replacer jamais replacées** (§⑦).

## ⑤bis BANALISER UNE HEURE — le mot juste, et ce que ça coûte
Paul : « banaliser cette heure. » Le geste existe déjà dans ton candidat, mais **son libellé est faux** : il dit « ne plus compter cette **séance** dans la prévision horaire » alors que Paul banalise **une heure** — la séance, elle, continue ailleurs. Après tout ce qu'on a démêlé sur heure/séance, c'est une confusion à supprimer.
**Le libellé devient « Banaliser cette heure »**, partout : bouton, modale, journal, infobulle. Les dix catégories et la précision libre ne changent pas.
**Ce qui est NOUVEAU : une heure banalisée entre — ou non — dans les heures perdues, selon sa catégorie.** Règle de Paul : *« tout ce qui concerne le pédagogique et le cours d'une façon ou d'une autre (le français) est du temps de classe »* ; le reste est une **heure perdue sèche**.
| Catégorie | Classement par défaut |
|---|---|
| Évaluation hors séance | **temps de classe** (c'est du français) |
| Reprise ou rattrapage | **temps de classe** |
| Gestion de classe | **temps de classe** |
| Événement d'établissement | heure perdue · **justifiée** |
| Sortie, voyage, projet | heure perdue · **justifiée** |
| Orientation et vie de classe | heure perdue · **justifiée** |
| Absence du professeur | heure perdue · **justifiée** |
| Absence massive d'élèves | heure perdue · **justifiée** |
| Temps libre choisi | heure perdue · **non justifiée** (c'est un choix de Paul) |
| Autre | heure perdue · **non justifiée** par défaut |
**Le classement est une PROPOSITION, pas une loi** : sur chaque heure banalisée, Paul peut basculer d'un clic entre « temps de classe » et « heure perdue », et entre « justifiée » et « non justifiée » — le site propose selon la catégorie, Paul tranche. Une sortie qui était en réalité une sortie de français se rebascule en temps de classe sans changer de catégorie.
**Le classement retenu est écrit dans la décision** (pas recalculé depuis la catégorie à chaque affichage) : si Paul l'a basculé, son choix survit.
**Preuve** : dix heures banalisées, une par catégorie → le classement par défaut est celui du tableau ; deux basculées à la main → leur bascule est au hub et survit à un rechargement ; le total de l'écran « Heures perdues » compte **les heures perdues des trois sources** (événements de calendrier confirmés, heures banalisées classées perdues, heures prises par une autre classe et heures à replacer non replacées) et **le sous-total justifié** est juste.

## ⑥ L'ALERTE MENSUELLE — aveugle, sans réseau
Le nœud `calendrier` porte la date de sa dernière injection. **Un calendrier déjà au hub qui n'en porte pas reçoit la date du PREMIER CHARGEMENT** (jamais d'alerte immédiate). **Un mois après**, l'EDT affiche une ligne discrète, non bloquante : « Le calendrier de l'année a été injecté il y a un mois — pense à le réinjecter s'il a bougé », avec « Réinjecter maintenant… » et « Plus tard » (repousse de 30 jours). **Le site ne lit rien à l'extérieur** : il compte les jours, rien de plus. La date de dernière injection est affichée pour chaque objet dans la section.

## ⑦ LES TROIS ISSUES, L'HEURE À REPLACER — de l'HORAIRE, jamais du contenu
Paul : « écrasement (horaire toujours, bien évidemment ! pas contenu) ». **Aucune séance, aucune activité, aucune trace n'est touchée par ces gestes** : c'est la grille ou les décisions qui bougent, le prévu se recalcule dessus.
**Au dépôt sur une case occupée par une AUTRE classe, trois issues** (aujourd'hui : refus sec) :
1. **Confirmer le refus** — rien ne se passe.
2. **Échanger** — les deux classes permutent ; personne ne perd d'heure ; les deux prévus se recalculent.
3. **Écraser** — Paul prend le créneau. **L'heure de la classe évincée n'est pas effacée** : elle devient une **heure à replacer**.
**L'heure à replacer** (« ton heure de 4D tu la récupères après les vacances ») : Paul peut la poser tout de suite (liste des destinations, toute l'année) **ou la laisser en attente**. Alors : elle est **rappelée dans la vue de la classe et au bandeau tant qu'elle n'est pas posée**, **jusqu'à la fin de l'année** ; **elle n'entre pas dans le prévu** (elle n'a pas de créneau : le prévu, c'est le contenu posé sur des créneaux) ; **à la fin de l'année, si elle n'a pas été posée, elle entre aux heures perdues** de cette classe et alimente l'analyse de fin d'année. Posée, elle est épinglée.
**Perte sèche** : Paul déclare que l'heure ne sera pas rendue → **heures perdues** de la classe évincée, motif « heure prise par une autre classe ».
**Avant confirmation, le site dit toujours ce que ça coûte et à qui** : « la 4D perd son heure du vendredi 13 — à replacer, ou perdue ? »
**Deux cas tranchés par Paul** : le refus porte sur **une heure DONT LA TRACE EXISTE** (elle a été lancée) — ce sont les règles du passé ; **une heure du jour non encore lancée reste déplaçable** (« il peut arriver qu'une heure du matin parte l'après-midi »), et une trace vide supprimée rend l'heure de nouveau déplaçable. Une heure **déjà déplacée par Paul** que la responsable rechange → **le site ne refuse pas** : il dit ce qu'il va défaire (« cette heure avait été déplacée par toi le 12/11 ») et Paul confirme.

## ⑧ LA LISTE DES DESTINATIONS
Elle reste **entière, jusqu'à la fin de l'année scolaire** (804 entrées mesurées, groupées par semaine), avec **une recherche par mois, par numéro de semaine et par type de semaine (A ou B)** — décision de Paul.
**Elle propose aussi les créneaux occupés par une autre classe**, marqués « pris par la 3 DYLAN Bob », qui ouvrent **les trois issues** du §⑦ : aujourd'hui ils sont simplement absents, donc le geste de l'exemple de Paul (« tu fais les 4C à la place des 4D vendredi ») est impossible par la liste.
**Rappel de ce qui est déjà juste et ne doit pas changer** : les créneaux **libres de l'emploi du temps de Paul** (653 mesurés) sont proposés et marqués « créneau libre, heure ajoutée » — c'est bien un trou de SON emploi du temps, pas « un créneau libre de cette classe ».

## ⑨ AUCUN TÉLESCOPAGE — vérifié, pas supposé
Exigence de Paul : « vérifier que le déplacement ne crée pas de télescopages. »
Après **tout** geste (déplacement, échange, écrasement, heure ajoutée, heure replacée, changement d'emploi du temps), l'état doit satisfaire : **jamais deux classes au même créneau le même jour** · **jamais deux fois la même classe au même créneau** · **jamais une heure sur un jour sans cours, le mercredi après-midi, ou dans le passé** — où **« dans le passé » veut dire un JOUR antérieur à aujourd'hui, jamais une heure antérieure à maintenant** (comme le fait déjà `edtRefusDepot`), sinon le geste que Paul vient d'autoriser au §⑦ (« une heure du matin part l'après-midi ») serait refusé par le contrôle lui-même. Écris une fonction de contrôle (`edtVerifierCoherence`) qui rend la liste des télescopages trouvés, **appelée par le banc après chaque geste**, et dont le résultat figure au rapport.
**Une classe non appariée ne reçoit aucune décision** (décision de Paul) : les cases « classe non encore importée » ne se saisissent pas et n'ouvrent pas de geste ; message clair (« cette classe n'est pas encore importée — apparie-la d'abord dans le panneau prof »).

## ⑩ LA VUE ANNÉE — le principe de l'agenda, la forme du calendrier de l'établissement
Paul : « son tableau a les 4 classes en ligne à gauche, et les mois en colonne. regarde le fichier d'origine… à gauche, ce sont LES DATES DES JOURS DU MOIS. » · « il faut reprendre le même principe que l'agenda google. »
**La frise par classe est abandonnée.** La vue Année reprend **la forme du calendrier de l'établissement** : **douze mois en colonnes** (août → juillet), **les jours en lignes** (1 à 31), chaque ligne portant **le numéro du jour et l'initiale du jour**, comme sur le fichier de Paul.
- **Les événements sont des bandeaux** posés sur les jours qu'ils occupent — un séjour de trois jours est **un bandeau de trois jours** —, **empilés** quand ils se chevauchent, tronqués proprement, avec le libellé complet au survol et au clic. Trois natures, trois couleurs : **événement de classe** · **établissement** · **jalon commun**. Les **59 événements d'établissement et les 15 de classe doivent être là** — ils sont aujourd'hui **totalement absents** de la vue Année.
- **Les vacances et les fériés** sont un fond de case, comme sur le fichier de Paul.
- **Ce que MJPC ajoute** : pour chaque jour, **une pastille par classe** (jouée : vert · prévue : gris · sans séance : ambre), au maximum quatre — on voit d'un regard les journées pleines, trouées, et les semaines sans rien.
- **Les jours sans cours sont aplatis** (décision de Paul) : week-ends, vacances, fériés réduits au minimum en hauteur, **numéro et initiale toujours lisibles** ; toute la hauteur libérée va aux jours de cours.
- **Aucun trait ne traverse les pistes** : c'était le défaut relevé par Paul (« pourquoi y a-t-il des grandes barres jaunes verticales ? »).
- **Zoom et défilement** : **Ctrl + molette** zoome et dézoome ; **dézoomé, l'année entière tient sur une page** (état par défaut) ; zoomé, les libellés se lisent en entier et **le défilement horizontal est autorisé — c'est le SEUL écran de l'EDT où il l'est** (décision de Paul).
- **Un événement à cheval sur deux mois** (vacances de Noël, séjour de fin de mois) donne **deux bandeaux, un par colonne, avec une marque de continuité** (→ en fin de mois, ← en tête du suivant) : une colonne de mois ne déborde jamais sur la suivante.
- **Une légende** dit ce que sont les trois couleurs, les pastilles, les jours aplatis.
**Maquettes de référence, au sas** : `TRANSCRIPTS/C10/pieces/T151-annee-agenda-v2.html` (dézoomé, jours sans cours aplatis) et `T152-annee-zoome.html` (zoomé, défilement) — faites **sur le calendrier réel de Paul**. C'est l'écran à obtenir.

## ⑪ LES PHOTOS DU PRÉVU
Cadrage retrouvé (tours 74-76, validé par Paul) : **photo automatique à la rentrée et au début de chaque période**, **plus une photo à la main quand Paul veut** ; « le cockpit compare le réel à la photo de ton choix ». Deux manques mesurés dans ton candidat : **aucun identifiant** (§①) et **la prise automatique n'existe pas** — `edtPhoto` n'est appelée que par le bouton. Les deux sont à faire. Plusieurs photos le même jour sont normales : **rien n'écrase**, elles se distinguent par leur `id`. Le mot « figer » n'apparaît nulle part.

## ⑪bis LES DATES DE L'ANNÉE — deux champs de plus, au même endroit que le brevet
Paul : « je te parle de deux autres champs à créer, dans la partie dates du brevet dans le panneau de contrôle (on peut remplacer par DATES DE L'ANNÉE). et ces champs seront injectés pareil par le json… et si besoin, je remodifierai les dates à la main après, et tout doit se recaler en fonction. »
**Rien à réinventer** : tu écris déjà `/site/config/brevetDates` à l'injection du calendrier (exception ① du contrat). **Deux champs de plus au même endroit et par le même chemin** : `debutAnnee` et `finAnnee`.
- **Produits par le prompt du calendrier** (Paul déclare ces dates à l'IA de toute façon), **injectés avec lui**, **modifiables à la main** dans la zone du panneau prof aujourd'hui intitulée « Dates du brevet » — **renommée « Dates de l'année »**, avec les mêmes champs date que `ecrireBrevetDate`.
- **Le nœud NE CHANGE PAS DE NOM** : `/site/config/brevetDates` reste `/site/config/brevetDates` (c'est l'exception ① de ton contrat, et `ecrireBrevetDate` s'appuie dessus) ; **seule l'étiquette à l'écran** devient « Dates de l'année ». Les deux champs y sont ajoutés à côté des quatre niveaux.
- **Tout se recale dessus** : la fin de la liste des destinations, la bascule des heures à replacer (§⑦), l'appartenance d'une date à l'année scolaire. **Et `EDT_ANNEE` cesse d'être deviné** : il est aujourd'hui **calculé au chargement du script** (`getMonth()>=7`) — donc `debutAnnee`, qui arrive **après** la lecture du hub, ne servirait à rien tel quel. `EDT_ANNEE` devient une valeur **recalculée après la lecture des objets**, avec repli sur le calcul actuel si le champ est absent, et **ses treize dépendances dans le bloc sont recensées dans `verif_edt.py`** (aucune ne doit lire une valeur figée avant la lecture).
- **Refus nommés, chiffrés** : fin avant début · écart supérieur à treize mois · date **en dehors des bornes du calendrier injecté élargies d'un mois** (première et dernière date connues du calendrier ± 1 mois).
- **Si Paul AVANCE `finAnnee` à la main**, les heures à replacer déjà posées au-delà **ne disparaissent pas** : elles **redeviennent des heures à replacer en attente**, nommément signalées — « 2 heures posées après la nouvelle fin d'année : à replacer avant le 26 juin, ou perdues ? ». Rien ne s'efface sans être dit.
- *Repère de réalité (Paul) : la fin d'année tombe souvent vers le 25-26 juin, avant le brevet blanc — donc **pas** au début des vacances d'été. Aucune déduction depuis les vacances.*
- **Preuve** : dates injectées puis modifiées à la main d'une semaine → la liste des destinations, la bascule des heures à replacer et l'année en cours **se recalent**, mesuré avant/après.

## ⑫ CE QUI NE DOIT PAS BOUGER
Les 133 autres fonctions · le prévu calculé (jamais stocké) · les quatre vues · la porte du pilotage (**six champs identiques**) · les décisions horaires et ↶ Annuler · le glisser-déposer et sa question du dépôt · les versions datées de la grille · le sans-scroll (sauf §⑩) · les trois portes · les trois exceptions · la garde **VERTE et rouge sur les trois contrôles négatifs** · moteur `AT_DR_B64` **intact** · `published` **97** · `secu*` **141** · double parseur vert · **le contrat ne s'élargit pas en silence** : tout appel nouveau entre dans `verif_edt.py` avec sa raison.

## ⑬ PREUVES EXIGÉES — mesurées, aucune affirmée
1. **Identité** : tous les objets du hub reçoivent leur `id` au chargement, **sans réinjection** — compté par objet, avant/après ; un `id` existant n'est jamais recalculé ; deux éléments identiques → suffixe `#2` et mention à l'écran.
2. **La coche ne se trompe plus** : coche sur le 5e événement, insertion d'un événement en tête, relecture → même événement, nommément (c'est le bug latent d'aujourd'hui).
3. **Différentiel — DEUX BANCS, aux attendus OPPOSÉS.** Le calendrier entrant est **réellement modifié** dans les deux cas (une réinjection à l'identique ne prouverait rien) : **trois libellés retouchés**, **un événement déplacé** d'un jour, **un supprimé**, **un ajouté**, cinq coches posées avant.
   **(a) Entrant AVEC les `id`** (voie normale, prompt réécrit) → conservation **silencieuse** des coches ; le supprimé nommé ; l'ajouté annoncé.
   **(b) Entrant SANS les `id`** (première version, JSON venu d'ailleurs, IA qui ne les a pas reconduits — cas explicitement prévu au §①) → le déplacé et les trois retouchés sont **signalés comme candidats** (appariement faible), Paul confirme, **aucune conservation silencieuse** ; le supprimé nommé ; l'ajouté annoncé.
   Sans le banc (b), le mécanisme d'appariement n'est jamais éprouvé : il suffirait de lire les `id` pour passer au vert.
4. **Archivage** : une injection qui écrase archive d'abord ; **archivage simulé en échec → rien n'est écrit**, message « rien n'a été remplacé ».
5. **Prompt en un collage** : le presse-papiers contient consigne **+** JSON en service (longueur et première clé mesurées) ; sans objet au hub, la mention « première injection ».
6. **Heures perdues** : le coût par classe affiché pour chaque événement du calendrier réel ; cases proposées **partout où au moins une heure est perdue par au moins une classe**, aucune case là où rien n'est perdu ; un événement de niveau → proposition heure par heure, jamais d'application automatique ; total en tête.
7. **Alerte** : apparaît à J+30 de la dernière injection et pas avant (date forcée), « Plus tard » repousse de 30 jours, **zéro requête réseau ajoutée**.
8. **Trois issues** : refus confirmé → rien écrit · échange → les deux classes permutent, **zéro heure perdue**, aucune trace touchée · écrasement → heure à replacer créée, rappelée, et posée plus tard → épinglée ; laissée jusqu'à la fin de l'année → entre aux heures perdues. **Une heure déjà lancée : refusée.** Une heure déjà déplacée rechangée : annoncée puis appliquée.
9. **Liste** : les créneaux occupés apparaissent, nommés, et ouvrent les trois issues ; recherche par mois, par numéro de semaine, par type A/B ; les 653 créneaux libres toujours proposés.
10. **Télescopages** : `edtVerifierCoherence` appelée après chacun des six gestes → **zéro télescopage**, chiffre au rapport. Une classe non appariée : aucun geste possible, message affiché.
11. **Vue Année** : sur le calendrier réel — les 12 mois, les jours numérotés, **les 15 événements de classe et les 59 d'établissement présents et comptés** (aucun perdu en silence), les 30 jalons, les vacances en fond, les pastilles par classe, les jours sans cours aplatis, **aucun trait traversant**, la légende ; **dézoomé : tout sur une page** ; **zoomé : défilement horizontal, libellés entiers** ; capture des deux états et **pourcentage de surface utile occupé : au moins 55 % dézoomé** sur le calendrier réel (seuil chiffré ; en dessous, l'écran est vide). **La méthode de mesure est la MÊME que celle du rapport où 58,9 % a été mesuré**, et elle est **nommée dans le rapport** — sinon le chiffre ne veut rien dire.
12. **Photos** : identifiant sur chaque photo ; **prise automatique à la rentrée et au début d'une période** (dates forcées au banc) ; deux photos le même jour cohabitent sans s'écraser.
13. **Appariement biunivoque** : un calendrier contenant **quatre événements homonymes à DATES DIFFÉRENTES, dont deux permutées** → chacun garde **sa** coche, aucune permutation, mesuré nommément ; **plus un cinquième cas strictement identique à un autre** (même date, même libellé) → **l'ambiguïté est nommée et RIEN n'est appliqué**.
14. **Une règle par famille** : réinjection de la **grille** avec un créneau déplacé et un horaire modifié à la main. Le créneau déplacé est un appariement **faible** : le banc **joue la confirmation de Paul**, et l'attendu le dit. Après confirmation, l'appariement de classe (`classeMjpc`), les créneaux fictifs et l'horaire modifié **survivent**, chacun relu au hub. Sans confirmation : rien n'est conservé silencieusement.
15. **`EDT_ANNEE`** : `debutAnnee` posé au 1er septembre → l'année en cours, la liste des destinations et la bascule des heures à replacer s'y conforment ; champ absent → repli sur le calcul actuel, sans erreur.
16. **Non-régression** : la liste complète du §⑫, chiffrée.

## ⑭ MÉTHODE
**Découpe en livraisons courtes**, chacune poussée au sas et close par un arrêt ; Paul relance par « continuer » (le « continuer » natif plante une fois sur deux). Découpe proposée : **①** identité des objets + les cinq fonctions par `id` · **②** différentiel, archivage avant écrasement, cas douteux · **③** prompts en un collage + JSON régénérés · **④** heures perdues + alerte mensuelle · **⑤** trois issues, heure à replacer, liste, télescopages · **⑥** vue Année · **⑦** photos + bancs complets, garde, matrice, séquence de test, rapport final.
**Un exécutant ne livre JAMAIS avec une dette** : tout se résout de A à Z avant la livraison finale, sauf ce que le §⑫ exclut. **Écris tes rapports pour une conscience qui n'a pas vu la conversation** : chiffres, chemins, captures.
**La `SEQUENCE-TEST-PAUL.md` est à mettre à jour** ; Paul la joue **après** la promotion — ne la lui donne pas maintenant.

## ⑭bis DEUX RÈGLES DE PLUS
**Versionnage par livraison** : chaque livraison poussée au sas porte **sa propre version** (`8.73.0-①`, `-②`, …) et son rapport ; **aucune livraison n'écrase la précédente sans trace**. La dernière porte `8.73.0`.
**Audit adverse, à la fin** : au lieu de vérifier que ce que tu as prévu fonctionne, **cherche ce qui casserait ton code** — données absurdes (dates inversées, libellés vides, doublons, JSON tronqué), gestes dans le désordre (annuler avant d'agir, injecter pendant une modale ouverte, deux gestes sur la même case), états limites (aucun objet au hub, une seule classe, année sans vacances). Rapporte **ce que tu as trouvé et ce que tu n'as pas su casser**. *(Tu as trouvé seul, au lot précédent, qu'un banc qui recalcule la règle au lieu de l'interroger ne prouve rien : c'est ce regard-là qu'on te demande, tourné contre ton propre travail.)*

## ⑮ LIVRABLE
Sas `PONT/EDT/` : `index.html` (**8.73.0**) · `rapport-2ter.md` · `tests/` (bancs réutilisables, captures) · `prompts/calendrier.md`, `prompts/grille.md` réécrits · `json/*.json` régénérés avec leurs `id` · `outils/verif_edt.py` à jour · `SEQUENCE-TEST-PAUL.md` à jour. **STOP après chaque livraison. Ne promeus jamais.**

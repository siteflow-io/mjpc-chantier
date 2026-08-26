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
- Cet `id` est **écrit au hub à la première écriture qui suit**, et **plus jamais recalculé, ni comparé, ni reconstruit** — même si la date, le libellé, le jour, le créneau ou la classe changent ensuite.
- **Conséquence à tenir** : un `id` ne dit rien du contenu de l'élément. Il ne sert qu'à le désigner. Toute fonction qui tenterait de retrouver un élément **en recalculant son `id`** est une faute : on cherche par `id` stocké, jamais par formule.
- **Un `id` ne contient donc jamais une position** : `crn:<jour>:<creneau>:<semaine>:<classe>` et `hor:<debut>-<fin>` sont des **amorces**, pas des adresses. Jour, créneau, semaine, classe, début et fin restent des **attributs** de l'élément, modifiables sans que l'`id` bouge — sans quoi « déplacer une heure » ou « modifier un horaire à la main » recréerait exactement le bug du §②.
- Forme des amorces (lisibles pour le débogage, sans valeur sémantique) : `evc:` événement de classe · `jal:` jalon · `eta:` établissement · `fer:` férié · `vac:` période sans cours · `crn:` créneau de grille · `hor:` créneau horaire · `per:` période · `pho:` photo, suivies d'un condensé du contenu au moment de la pose, **suffixé par la classe quand l'élément en dépend** (décision de Paul).
- **Collision au premier chargement** : deux éléments produisant la même amorce → le second reçoit `#2`. **Ce suffixe dépend de l'ordre de parcours** : il n'est acceptable que parce qu'il n'a lieu **qu'une fois**, à la pose. Le parcours doit donc être **déterministe** (ordre du tableau tel qu'il est au hub), et le fait est **dit à l'écran** (« deux événements identiques le 14/11 — le second a reçu un identifiant distinct »).

**L'appariement à la réinjection ne se fait PAS par égalité d'`id`.** Un JSON qui arrive peut ne pas porter les `id` en service (première version, JSON venu d'ailleurs, IA qui ne les a pas reconduits). L'appariement se fait donc **par comparaison** : même **niveau** + même **date de début** + même **libellé normalisé** (minuscules, accents retirés, espaces réduits, ponctuation ôtée) → c'est le même élément, il **garde son `id`** et les décisions de Paul qui y sont attachées. Quand l'entrant **porte** un `id` déjà connu, il fait foi et dispense de la comparaison.

## ② PLUS RIEN PAR INDICE NI PAR RANG
Cinq fonctions désignent aujourd'hui un élément par sa position ; elles passent **par l'`id`** : `edtJustifier` (par indice), `edtCreneauPoser`, `edtPeriodePoser`, `edtPeriodeSupprimer`, `edtPeriodeDeplacer` (par rang). Le `rang` reste un **ordre d'affichage**, jamais une identité.
**Preuve** : poser une coche sur le 5e événement, insérer un événement **en tête** de la liste, relire → la coche est **toujours sur le même événement**, nommément.

## ③ LE DIFFÉRENTIEL, ET RIEN NE SE PERD
**Aucune écriture n'écrase plus en silence**, sur aucun objet (14 écritures recensées dans ton bloc). Trois règles :
1. **Ce que Paul a posé à la main survit** à toute réinjection, par appariement d'`id` : coches « heures perdues », appariements de classes (`classeMjpc`), créneaux fictifs, horaires modifiés, dates de périodes, décisions horaires, photos.
2. **Archivage avant écrasement** — le modèle existe dans le site, copie-le : `chInjecterConfirme` en mode « remplacer » **archive à la corbeille AVANT d'écrire et ABANDONNE si l'archivage échoue** (« rien n'a été remplacé »). Même règle pour tout objet de l'EDT.
3. **Le différentiel est nominatif**, avant le geste, dans l'écran de vérification : **ce qui arrive** (id inconnu) · **ce qui est seulement déplacé** (même id, date changée : « Stages 3e : 16/11 → 17/11 ») · **ce qui disparaît** (id absent) · **ce qui est conservé** de ses décisions. Un événement qui disparaît **et qui portait une coche** est nommé à part.
**Le cas douteux** (défini par la conscience avec Paul) : un `id` disparaît **et** un `id` nouveau apparaît avec **la même date de début et le même niveau** → très probablement le même événement, libellé corrigé. Le site **ne décide pas** : il le signale — « Séjour Verdun 3e (14/10) semble être devenu "Séjour à Verdun 3e" — reconduire ta coche ? » — et Paul confirme.

## ④ LES PROMPTS D'INJECTION — un seul collage
Paul : « le prompt, quand je clique sur le bouton copier, doit contenir le json directement. comme ça pas besoin de faire deux copier coller. »
**Le bouton « Copier le prompt » de chaque voie copie UN SEUL bloc** : la consigne **+ le JSON actuellement en service au hub**, inséré tel quel. Si l'objet n'existe pas encore : « aucun calendrier en service — c'est une première injection », jamais un vide muet. Le patron existe déjà dans le site (`ATELIER_PROMPT_SEED`, `atIA*`) : reprends-le, ne l'invente pas. Le bouton « Sortir le JSON actuel » reste, pour les usages hors injection.
**Les deux prompts (`prompts/calendrier.md`, `prompts/grille.md`) sont réécrits** : l'IA reçoit l'existant, **reconduit les `id`** de tout élément qu'elle reconnaît, n'en crée que pour les vrais nouveaux, **ne reformule jamais un libellé**, ne renumérote rien, et **déclare en fin de sortie** ce qu'elle a fait : ajoutés, déplacés, supprimés, renommés — avec leurs noms. Les JSON du sas sont régénérés avec leurs `id`.

## ⑤ HEURES PERDUES — l'écran, et ce qu'il dit
L'entrée « Calendrier de l'année… » devient **« Heures perdues »**. Elle ne règle pas le calendrier : elle dit **ce qu'il coûte**.
- Chaque événement dit **le coût puis l'effet** : « Séjour Verdun 3e · 14-16 octobre · **la 3e Franklin perd 3 heures, les autres classes zéro** → cocher : ces 3 heures ne compteront pas dans son retard. »
- **Le site propose la coche dès qu'un événement coûte au moins une heure à au moins une classe** (décision de Paul, tour 175). **Un événement qui ne coûte aucune heure n'a pas de case** : rien à décider. *Mesure qui fonde la règle : aucun des 15 événements de classe du calendrier de Paul ne nomme de classe — ils portent tous un niveau (9 en 4e, 6 en 3e) ; une règle « seule classe à perdre » n'aurait presque jamais proposé de case.*
- **Un événement qui nomme un NIVEAU et pas une classe** (« Stages 3e ») : **le site détecte, propose, Paul confirme, heure par heure** (décision de Paul) — jamais d'application automatique à toutes les classes du niveau.
- En tête : le total, par classe — « cette année, X heures perdues, dont Y déclarées justifiées ».
- **Y entrent aussi** : les heures « sans séance » déclarées par Paul, les heures prises par une autre classe (§⑦), et **les heures à replacer jamais replacées** (§⑦).

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
Après **tout** geste (déplacement, échange, écrasement, heure ajoutée, heure replacée, changement d'emploi du temps), l'état doit satisfaire : **jamais deux classes au même créneau le même jour** · **jamais deux fois la même classe au même créneau** · **jamais une heure sur un jour sans cours, le mercredi après-midi, ou dans le passé**. Écris une fonction de contrôle (`edtVerifierCoherence`) qui rend la liste des télescopages trouvés, **appelée par le banc après chaque geste**, et dont le résultat figure au rapport.
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
- **Tout se recale dessus** : la fin de la liste des destinations, la bascule des heures à replacer (§⑦), l'appartenance d'une date à l'année scolaire. **Et `EDT_ANNEE` cesse d'être deviné** : il est aujourd'hui calculé en dur (`getMonth()>=7`) — il lit désormais `debutAnnee`, avec repli sur le calcul actuel si le champ est absent.
- **Refus nommés** : fin avant début · écart supérieur à treize mois · date manifestement hors de l'année du calendrier injecté.
- *Repère de réalité (Paul) : la fin d'année tombe souvent vers le 25-26 juin, avant le brevet blanc — donc **pas** au début des vacances d'été. Aucune déduction depuis les vacances.*
- **Preuve** : dates injectées puis modifiées à la main d'une semaine → la liste des destinations, la bascule des heures à replacer et l'année en cours **se recalent**, mesuré avant/après.

## ⑫ CE QUI NE DOIT PAS BOUGER
Les 133 autres fonctions · le prévu calculé (jamais stocké) · les quatre vues · la porte du pilotage (**six champs identiques**) · les décisions horaires et ↶ Annuler · le glisser-déposer et sa question du dépôt · les versions datées de la grille · le sans-scroll (sauf §⑩) · les trois portes · les trois exceptions · la garde **VERTE et rouge sur les trois contrôles négatifs** · moteur `AT_DR_B64` **intact** · `published` **97** · `secu*` **141** · double parseur vert · **le contrat ne s'élargit pas en silence** : tout appel nouveau entre dans `verif_edt.py` avec sa raison.

## ⑬ PREUVES EXIGÉES — mesurées, aucune affirmée
1. **Identité** : tous les objets du hub reçoivent leur `id` au chargement, **sans réinjection** — compté par objet, avant/après ; un `id` existant n'est jamais recalculé ; deux éléments identiques → suffixe `#2` et mention à l'écran.
2. **La coche ne se trompe plus** : coche sur le 5e événement, insertion d'un événement en tête, relecture → même événement, nommément (c'est le bug latent d'aujourd'hui).
3. **Différentiel — la preuve porte sur un calendrier RÉELLEMENT modifié**, pas sur une réinjection à l'identique (qui ne prouverait rien) : **trois libellés retouchés** (fautes de frappe corrigées), **un événement déplacé** d'un jour, **un supprimé**, **un ajouté**, cinq coches posées avant. Attendu : les coches des trois retouchés et du déplacé **conservées** ; le supprimé **nommé avant le geste** ; l'ajouté annoncé comme nouveau ; **aucune coche perdue en silence**. Chaque cas relu au hub après injection.
4. **Archivage** : une injection qui écrase archive d'abord ; **archivage simulé en échec → rien n'est écrit**, message « rien n'a été remplacé ».
5. **Prompt en un collage** : le presse-papiers contient consigne **+** JSON en service (longueur et première clé mesurées) ; sans objet au hub, la mention « première injection ».
6. **Heures perdues** : le coût par classe affiché pour chaque événement du calendrier réel ; cases proposées seulement là où une classe est seule à perdre ; un événement de niveau → proposition heure par heure, jamais d'application automatique ; total en tête.
7. **Alerte** : apparaît à J+30 de la dernière injection et pas avant (date forcée), « Plus tard » repousse de 30 jours, **zéro requête réseau ajoutée**.
8. **Trois issues** : refus confirmé → rien écrit · échange → les deux classes permutent, **zéro heure perdue**, aucune trace touchée · écrasement → heure à replacer créée, rappelée, et posée plus tard → épinglée ; laissée jusqu'à la fin de l'année → entre aux heures perdues. **Une heure déjà lancée : refusée.** Une heure déjà déplacée rechangée : annoncée puis appliquée.
9. **Liste** : les créneaux occupés apparaissent, nommés, et ouvrent les trois issues ; recherche par mois, par numéro de semaine, par type A/B ; les 653 créneaux libres toujours proposés.
10. **Télescopages** : `edtVerifierCoherence` appelée après chacun des six gestes → **zéro télescopage**, chiffre au rapport. Une classe non appariée : aucun geste possible, message affiché.
11. **Vue Année** : sur le calendrier réel — les 12 mois, les jours numérotés, **les 15 événements de classe et les 59 d'établissement présents et comptés** (aucun perdu en silence), les 30 jalons, les vacances en fond, les pastilles par classe, les jours sans cours aplatis, **aucun trait traversant**, la légende ; **dézoomé : tout sur une page** ; **zoomé : défilement horizontal, libellés entiers** ; capture des deux états et **pourcentage de surface utile occupé : au moins 55 % dézoomé** sur le calendrier réel (seuil chiffré ; en dessous, l'écran est vide — la version précédente mesurait 58,9 %).
12. **Photos** : identifiant sur chaque photo ; **prise automatique à la rentrée et au début d'une période** (dates forcées au banc) ; deux photos le même jour cohabitent sans s'écraser.
13. **Non-régression** : la liste complète du §⑫, chiffrée.

## ⑭ MÉTHODE
**Découpe en livraisons courtes**, chacune poussée au sas et close par un arrêt ; Paul relance par « continuer » (le « continuer » natif plante une fois sur deux). Découpe proposée : **①** identité des objets + les cinq fonctions par `id` · **②** différentiel, archivage avant écrasement, cas douteux · **③** prompts en un collage + JSON régénérés · **④** heures perdues + alerte mensuelle · **⑤** trois issues, heure à replacer, liste, télescopages · **⑥** vue Année · **⑦** photos + bancs complets, garde, matrice, séquence de test, rapport final.
**Un exécutant ne livre JAMAIS avec une dette** : tout se résout de A à Z avant la livraison finale, sauf ce que le §⑫ exclut. **Écris tes rapports pour une conscience qui n'a pas vu la conversation** : chiffres, chemins, captures.
**La `SEQUENCE-TEST-PAUL.md` est à mettre à jour** ; Paul la joue **après** la promotion — ne la lui donne pas maintenant.

## ⑭bis DEUX RÈGLES DE PLUS
**Versionnage par livraison** : chaque livraison poussée au sas porte **sa propre version** (`8.73.0-①`, `-②`, …) et son rapport ; **aucune livraison n'écrase la précédente sans trace**. La dernière porte `8.73.0`.
**Audit adverse, à la fin** : au lieu de vérifier que ce que tu as prévu fonctionne, **cherche ce qui casserait ton code** — données absurdes (dates inversées, libellés vides, doublons, JSON tronqué), gestes dans le désordre (annuler avant d'agir, injecter pendant une modale ouverte, deux gestes sur la même case), états limites (aucun objet au hub, une seule classe, année sans vacances). Rapporte **ce que tu as trouvé et ce que tu n'as pas su casser**. *(Tu as trouvé seul, au lot précédent, qu'un banc qui recalcule la règle au lieu de l'interroger ne prouve rien : c'est ce regard-là qu'on te demande, tourné contre ton propre travail.)*

## ⑮ LIVRABLE
Sas `PONT/EDT/` : `index.html` (**8.73.0**) · `rapport-2ter.md` · `tests/` (bancs réutilisables, captures) · `prompts/calendrier.md`, `prompts/grille.md` réécrits · `json/*.json` régénérés avec leurs `id` · `outils/verif_edt.py` à jour · `SEQUENCE-TEST-PAUL.md` à jour. **STOP après chaque livraison. Ne promeus jamais.**

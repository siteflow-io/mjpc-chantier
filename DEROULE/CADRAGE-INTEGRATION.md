# DÉROULÉ — CADRAGE DE L'INTÉGRATION DANS MJPC
*Conscience n°7, 20/08/2026. Fruit d'une longue session de conception avec Paul. À lire avant tout mandat. Rien ici n'est promu : c'est le plan.*

## CE QUI A ÉTÉ TRANCHÉ (acquis d'architecture)

**L'objet et ses vues.** Le chapitre est l'OBJET ; les vues sont des regards sœurs, aucune au-dessus des autres. Quatre onglets retenus (variante A) : **Structure · Déroulé · Relecture · Papier**. Pas d'onglet « Sommaire » séparé (il ferait doublon avec la colonne-arbre de gauche) ; pas d'onglet « Documents » (il devient Structure).

**Le déroulé absorbe l'éditeur de chapitre.** Historiquement l'éditeur de chapitre est antérieur au déroulé ; l'intuition première de Paul était que le déroulé devienne une composante de l'éditeur. Décision inverse retenue, alignée avec Paul : c'est le déroulé qui est le CADRE (les cinq→quatre vues sont les siennes), et l'éditeur de chapitre actuel devient sa vue **Structure** — à la place de ce qui, dans la maquette, s'appelait « Documents ».

**« Structure », pas « Documents ».** Le nom « Documents » est trompeur : on n'y range pas que des documents, on y décide les compétences majeures/mineures, le titre, l'entrée (« ce qu'on va apprendre »), la problématique, les objectifs, le découpage en séances. C'est le lieu de CONCEPTION du chapitre. Nom retenu : **Structure**.

**Un écran de déroulé = un item de séance.** Même rang qu'un `doc`, un `atelier`, un `intro_image`. Il s'insère dans la pile centrale de la séance, à sa place dans l'ordre du cours, éditable là. Ce que Paul voulait : voir son chapitre complet dans l'éditeur, docs et écrans mêlés dans l'ordre réel.

**Le déroulé appelle docs et fiches par RÉFÉRENCE.** Il ne les copie pas. Un doc vit une fois dans Structure ; le déroulé le convoque à l'écran (« cette fiche vient de Structure · Séance N »). Deux natures dans un écran : ce qu'il EMPRUNTE (docs/fiches de Structure) et ce qu'il POSSÈDE (consignes, questions, réponses écrites en direct — qui n'existent pas dans Structure).

**La colonne gauche = un seul arbre à trois niveaux.** RÉSOLUTION D'UNE COLLISION repérée par Paul : dans l'éditeur de chapitre, la colonne gauche = le sommaire du chapitre (toutes les séances) ; dans le déroulé (maquette), la colonne gauche = les vignettes des écrans d'UNE séance. Deux colonnes gauches rivales, même place, niveaux différents. Résolution retenue : UNE seule colonne, un arbre — chapitre en haut / séances repliables (intertitres) / écrans horodatés sous la SEULE séance dépliée (l'active). On clique une séance, elle se déplie, la précédente se replie. Macro permanent (toutes les séances visibles) + micro dans la séance active (ses écrans) + jamais 123 vignettes d'un coup. **Cet arbre est COMMUN à Structure et à Déroulé : une seule source, deux vues qui l'affichent.** C'est le pont macro/micro auquel Paul tient le plus.

**Séance vs chapitre — les deux couches.** « Séance » ≠ « heure de cours » (mots de Paul : l'heure est conditionnée par l'agenda, l'horaire, la motivation ; idéalement une séance = une heure, en pratique jamais). Le contenu vit au NIVEAU (la trame : préparée une fois pour la 3e) ; les états vivent par CLASSE (la séance jouée : horaires réels, saisies, participation, dévoilement, gel, arrêt — propre à 3e Aretha Franklin, distincte de 3e Bob Dylan). Mécanisme : **la trame se copie au démarrage** de la séance avec une classe ; corriger la trame entre lundi et mardi profite à la classe du mardi. **Séance = unité jouée et copiée par classe. Chapitre = vue de LECTURE par-dessus** (le ruban continu, façon PowerPoint, séances = sections).

**Le PowerPoint de Paul, mesuré.** Son chapitre 1 (« Poésie et peinture au XIXe siècle ») = 123 diapos, UN seul ruban continu, séances en sections (S1 cours suivi, S2 L'Albatros, S3 grammaire, S4 dictée, S5 correction). Une diapo « Plan de séquence » revient régulièrement = son repère macro. Écrans vides = mises en commun où il écrit en direct. Fiches collées en image + zoom par animation = pis-aller que le déroulé remplace proprement (la fiche devient un objet natif qui se déploie). Confirme : le déroulé est un ruban de CHAPITRE, la maquette est un ruban de SÉANCE — apprendre à enjamber les séances est le cœur du T1.

**L'éditeur de feuille reste SÉPARÉ.** Hors périmètre du déroulé. Point d'entrée `atNouvelleFeuille`/`edEditerFeuille`, 121 composantes ATELIER. C'est le FOYER DES PROMPTS : bouton « Écrire avec une IA » (`atNouvelleFeuilleIA`), `ATELIER_PROMPT_SEED`, hub `/site/atelier/prompts`, UI `at-ia-tpl`, jetons injectés TAXONOMIE / COMPETENCES_C4 / COMPOSANTES / TYPES_SEANCE / ENTREES / ETAT_ANNEE. Le déroulé le croise seulement par référence (une fiche posée dans un écran vient d'une feuille éditée là). Le chantier prompts est celui d'APRÈS l'intégration.

## LA CHAÎNE PLUS LARGE (pensée avec la n°6, à ne pas perdre)
Le déroulé n'est pas un module isolé : il est le point d'entrée d'une chaîne. Une activité déclare ses notions/compétences (taxo Atelier `taxonomie_atelier.json`, référentiel canonique) → le temps réel (fin fixe connue de l'EDT, début lancé par Paul, MOINS 5 minutes non négociables pour l'agenda) fait qu'une activité est jouée / reportée / annulée → ce qui saute nourrit une **alerte de progression** (« cette compétence n'a été travaillée qu'une fois »), qui **n'ignore JAMAIS l'état général du site** (si Paul crée demain une activité qui retravaille la compétence, l'alerte n'a plus lieu d'être) → alertes à trois endroits : bandeau T-5 en fin de séance, profil de la classe, cockpit prof → le tout alimente le **profil longitudinal** de l'élève, qui devient d'abord instrument de pilotage en classe (points de vigilance par élève) avant d'être un miroir montré à l'élève. Reporter une activité ≠ laisser la séance ouverte (deux gestes distincts). Ordre général arrêté : temps → intégration → prompts → calendrier → profil longitudinal.

## VOCABULAIRE DU TABLEAU (vérifié avec Paul)
- **Écran de pilotage** : ce que Paul seul voit (portable/tablette) — colonne-arbre, écran courant, commandes, participation. Privé.
- **Tableau** : la surface projetée au mur (vidéoprojecteur) — projection nue 16:9, gros texte, sans commandes. Public. Ouverte par « ⧉ Ouvrir le tableau » (double écran repris du QCM).
- **Tableau autonome** : propriété à donner à cette fenêtre projetée — tenir debout seule, garder sa dernière image, n'accepter de changement que quand le pilotage est présent ET dégelé. C'est ce qui permet le GEL TOTAL (Paul peut fermer son site sans que la classe voie bouger) et, plus tard, le tableau sur un autre appareil.

## LE DÉCOUPAGE EN TROIS TEMPS (choisi par Paul : 3 temps, pas exhaustif d'un coup)

### TEMPS 1 — LE SOCLE (le plus lourd ; socle bâclé se paie sur T2 et T3)
- Le déroulé entre dans MJPC comme **bloc scellé préfixé `dr_` / `.dr-`** (règle cardinale : MJPC surcouche, chaque outil chez lui ; et le dégât CSS du 20/08 vient d'un mélange de territoires). Les collisions relevées contre la 8.57.1 disparaissent par le préfixe : globales `lire cour fin mk t titre` · CSS `.on .feuille .liste .sel .titre .type .page`.
- Les **4 onglets** posés ; **Structure** = l'éditeur de chapitre actuel rebranché dessous.
- **La colonne-arbre à 3 niveaux**, partagée Structure/Déroulé — gros morceau : apprendre à la maquette à enjamber les séances (elle ne connaît qu'UNE séance en dur aujourd'hui).
- L'**éditeur d'écrans**, la **projection SIMPLE** (le déroulé montre l'écran, gel LOCAL compris), le **chrono** — cœur déjà vivant de `deroule86`, rebranché sur un VRAI chapitre au lieu du décor en dur.
- Les **`confirm()` natifs → modales MJPC**.
- **La structure à deux couches POSÉE** (trame au niveau / séance jouée par classe, copie au démarrage) — posée dès T1 pour ne pas refondre la lecture/écriture des données au T2. T1 ne fait JOUER qu'une classe, sans participation ni récit encore.
- **Crochets pour la suite, posés sans être remplis** : qu'un écran puisse déclarer ses notions/compétences (taxo Atelier) ; qu'une séance jouée retienne sa classe.

### TEMPS 2 — SAISIE ET PARTICIPATION
Saisie en direct · participation · « ✍🏻 À écrire » · « 👥 qui a participé » · **tableau autonome** (gel total, voie vers l'autre appareil) · **écran d'attente** quand le pilotage est absent (nom du site, date et heure en grand, niveau/classe attendue).

### TEMPS 3 — RÉCIT ET PAPIER
**Relecture** = récit horodaté en phrases de ce qui a eu lieu (« À 10 h 07 on a relu… Gatien a répondu ceci à la première, Margaux cela à la deuxième, le professeur a reformulé »), noms d'élèves assumés (« ça incarne »), statut verbatim/reformulé · **Papier** = le chapitre entier avec ses trous déclarés à leur place · impression · **sort d'une séance close** (arbitrage repoussé ici) · `confirm→modale` résiduels.

## ARBITRAGES ENCORE OUVERTS
- Sort d'une séance close (à trancher au T3, quand le récit tourne).
- Reste au plan n°6 : bandes claires au tableau · étiquettes/légendes redimensionnables · types de schémas retenus · cartes trop denses pour un écran projeté · code de couleurs de surlignage.

## OUTILLAGE
Base production : `index.html` 8.57.1, md5 `54da80f2847d865b7f1aea5ad3fcb984`. Maquette : `DEROULE/deroule86.html` md5 `2ffada12d20d30ab719d20238cd1eef8` (86 = 86 versions de la n°6, éprouvée 86 fois par Paul). Croquis produits cette session (jetables, pour visualisation) : `croquis-deroule.html` (4→5 vues), `croquis-colonne.html` (arbre 3 niveaux), `vues-A-4onglets.html` (retenu), `vues-B-5onglets.html`.

MEMO

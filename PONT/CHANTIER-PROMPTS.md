# CHANTIER PROMPTS — ouvert le 21/08/2026 au soir (décision de Paul)
Séquence de Paul : PROMPTS → création/injection des chapitres → profil longitudinal
classe → profil élève. Règle de lancement gravée au plan : AUCUN code avant la lecture
complète de l'existant (les 4 chaînes prompt + les 3 PROMPT_SEED + chValiderChapitre).

## Ce que la lecture d'ouverture a établi (21/08)
L'injection de chapitre EXISTE : chVerifier (parse tolérant, validations additives
SITE-COURS-2e) + chInjecter à QUATRE VOIES (créer · compléter · remplacer · garder à
côté) + GARDE D'ATTERRISSAGE (montre l'effet sur les données réelles avant d'écrire).
La question « écraser ou jumeau » (31/07) est tranchée par l'existant : les deux, au
choix, sous garde. Le chantier = EXTENSION + RÉÉCRITURE DES PROMPTS, pas construction.

## Les morceaux
P1 · LECTURE COMPLÈTE (prochain livrable, aucun code avant) : worktrack,
    correction_dictee, dictee_universelle, pilotage_debat_s3 (chaînes complètes),
    les 3 PROMPT_SEED en entier, chValiderChapitre/chValiderDeclaration.
P2 · SCHÉMA ÉTENDU : seances[k].deroule.ecrans dans le JSON de chapitre — validation
    de forme (act/h/dur/blocs, le format du moteur), garde d'atterrissage étendue
    (« cette séance a déjà une trame : compléter/remplacer ? »).
P2b · LES DEUX VUES JUMELLES DU CHAPITRE — RÉÉCRIT LE 22/08 APRÈS CONFRONTATION
    À L'EXISTANT (règle de Paul : toute énonciation se confronte à l'existant avant
    d'être consignée — l'erreur de la n°6 à ne pas refaire).
    CE QUI EXISTE DÉJÀ, mesuré : la 3e colonne de Structure EST une visionneuse A4
    du chapitre — ed2Papier/ed2PapierVers, pages .ed2-a4 réelles (794 px, patron
    printView de worktrack), barre sticky, compteur de feuilles, modes, corrélation
    aux deux autres colonnes, impression native. Le moteur du déroulé rend déjà le
    papier d'UNE séance (#pap). La garde d'atterrissage de chInjecter est l'embryon
    de l'inventaire. Le bilan HTML élève (23b) est un précédent de bilan.
    ARCHITECTURE ANTI-DOUBLON :
    · LA VUE PRÉVUE = ed2Papier ÉTENDU, pas une pièce neuve : les trames de déroulé
      par séance y entrent (rendues au gabarit Papier du moteur), plus les métas
      pédagogiques (notions/compétences) et les TROUS DÉCLARÉS (items à lier,
      séances sans trame, sans compétence, notions hors niveaux).
    · L'ONGLET/MODALE/FENÊTRE demandé par Paul = un bouton « ⧉ Ouvrir en fenêtre »
      qui rend LE MÊME contenu dans une fenêtre autonome — le motif tableau() :
      RÉUTILISATION du rendu, jamais un second rendu parallèle.
    · LA VUE VÉCUE (profil de classe) = LE MÊME GABARIT nourri par
      deroule_joue/<classe> (copies + vécus, données déjà en place et prouvées) :
      bilans joués, temps réels vs prévus, écrans montrés, décisions T-5, travail
      donné. À construire — mais en héritant du gabarit, pas en le recréant.
    TROIS SORTIES, UNE SEULE SOURCE (tranché par Paul le 22/08 : un .docx TOUT À
    FAIT NORMAL, retouchable dans Word) :
    ① l'écran (3e colonne / fenêtre autonome) · ② l'imprimante (Ctrl+P, A4 natif) ·
    ③ UN BOUTON « WORD » produisant un VRAI .docx OOXML via la bibliothèque docx
    (chargée à la demande au premier clic — le site reste un fichier unique léger ;
    précédent maison : SheetJS embarqué chez dictee_universelle). Images du hub
    incorporées au document (fetch → ArrayBuffer). Titres/styles Word réels :
    le document se retouche normalement.
    ARCHITECTURE ANTI-DIVERGENCE : le .docx n'est PAS une copie du HTML — c'est un
    SECOND CONSTRUCTEUR sur LA MÊME SOURCE (les données du chapitre), les deux
    sorties parcourant le chapitre par UNE MÊME fonction d'itération (chParcourir) :
    une seule vérité, deux formats. Risque déclaré : deux constructeurs à maintenir
    — borné par le parcours commun. L'export exige le réseau (message clair sinon).
    Vaut pour LES DEUX VUES : le chapitre prévu ET le chapitre vécu par classe.
P3 · LES TROIS PROMPTS RÉÉCRITS (chapitre · feuille · déroulé) : taxonomie DONNÉE
    (154 notions — l'IA choisit, n'invente pas) ; titres canoniques + produits
    déclarés séance par séance ; clé de rapprochement posée par l'IA ; signalement
    des trous ; items à lier marqués ; ET ENFIN ÉCRITS AU HUB (/site/atelier/prompts
    est vide depuis toujours).
P4 · LA PASSE SUR LES APPS COMMANDÉES, par lots.

## Arbitrages — TRANCHÉS par Paul le 21/08 au soir
(a) le produit « diaporama » DEVIENT-il le produit « déroulé » (trame d'écrans du
    moteur : consignes/questions/fiches/schémas/images — jouable, dévoilable) ?
    ✔ OUI (Paul) — les deux questions du 09/08 tombent : le produit devient une trame d'écrans.
(b) corrélation feuille↔chapitre : clé de rapprochement posée par l'IA (la même dans
    les deux JSON), plus sûre que les titres. ✔ OUI (Paul).
(c) SÉQUENCEMENT PRÉCISÉ (à la demande de Paul) : P1→P3 se construisent et
    s'ÉPROUVENT AU BAC À SABLE sur les chapitres martyrs actuels, sans aucun risque ;
    puis, dans l'ordre : promotion du déroulé → M-SÉCU (avant la rentrée) →
    M17a (purge des chapitres/items martyrs + Drive, décision du 31/07 « aucune
    archive », + import des classes 2026-2027) → PREMIÈRES INJECTIONS RÉELLES,
    chapitre par chapitre, chacune contrôlée dans la vue prévue (P2b).
    Ainsi la première injection réelle naît ENTIÈREMENT selon le nouveau modèle,
    tout lié d'office — rien d'ancien à rattraper.

## P2 — LIVRÉ AU BAC le 22/08 (banc vert)
Le JSON de chapitre accepte seances[].cle (regex ^[a-z0-9][a-z0-9-]{1,23}$, unicité)
et seances[].deroule.ecrans (act + dur exigés ; blocs typés consigne/fiche/question/
schema/image avec leurs champs critiques : q non vide, ref d image non vide).
aLier accepte seance_cle (les titres restent acceptés, transition douce).
Validation ADDITIVE par enveloppe de chValiderChapitre — base intacte, motifs cités
par séance et par écran (prouvé : 7 motifs exacts sur le martyr fautif, 0 sur le sain).
Application atP2AppliquerDeroules(level,chnum,json,politique) : rapprochement par CLÉ
d abord puis par titre ; normalisation aux défauts EXACTS du moteur ; politique
completer (défaut, jamais d écrasement) / remplacer ; écriture hub par séance ;
compte-rendu rendu à l appelant pour la garde d atterrissage.
PROUVÉ de bout en bout : injection → trames en données → LE DÉROULÉ LES JOUE
(2 écrans, consigne+question+image, horaires recalculés 10:07..10:13).
P2-FIN (22/08) : BRANCHÉ au cérémonial réel par enveloppes (base intacte) —
la garde d atterrissage montre les trames avant le oui (« Trames de déroulé :
séance (2 écrans) — elles s ajouteront à la suite ») ; après confirmation,
application avec reprise à retardement (4 essais) si les données locales
n ont pas suivi ; compte-rendu ajouté au message d injection. P2 EST CLOS.

## DÉCISION DE PROTOCOLE (Paul, 22/08 soir)
Après le chantier PROMPTS : RETOUR AU PROTOCOLE NORMAL — GitHub, jetons,
conscience + exécutants. Le développement direct de cette session était
l exception du chantier déroulé. Objectif de Paul : construire ses chapitres
et faire sa première projection en classe SANS BUGS.

## P3 — LIVRÉ le 22/08 soir (PONT/PROMPTS-P3/)
Trois prompts prêts : site-chapitre.txt (le seed amendé : clé de séance + trames
deroule.ecrans + aLier par seance_cle + diaporama retiré des kinds — les
placeholders @@…@@ conservés, substitués au chargement comme toujours) ;
site-fiche_seance.txt (le seed actuel, écrit pour ancrage) ; site-deroule.txt
(NOUVEAU : compléter les trames d un chapitre existant, titres exacts, rien créé).
Le nœud du site : /site/atelier/prompts/<produit> (AT_IA_NOEUD — le site garde
son chemin historique ; le canon /<app>_prompts est pour P4).
⚠ ÉCRITURE AU HUB DIFFÉRÉE À LA PROMOTION (ecrire-prompts-hub.sh prêt) : le
prompt v2 produit des JSON à trames que seule la production promue sait jouer.

## P3ter — L EXPORT JSON DE VÉRIFICATION (acté le 22/08 soir, demande de Paul)
Principe : la rétro-ingénierie appliquée aux ajouts de PAUL. Un bouton dans
l éditeur de chapitre : « Exporter chapitre pour relecture et cohérence finale » (libellé arrêté par Paul le 22/08) — le chapitre TEL QU IL
EST dans MJPC (séances, clés, trames deroule, items, liaisons reconstituées en
aLier), au FORMAT MÊME du prompt chapitre, précédé d une courte mission :
« Voici le chapitre tel qu il vit dans MJPC après mes modifications. Compare-le
à ce que nous avions préparé ensemble ; signale-moi les écarts, les trous et
les incohérences — sans que j aie à te réexpliquer le projet. »
Usage : Paul le colle dans LA MÊME conversation IA qui a construit le chapitre
(l instance a le contexte) → vérification de cohérence finale gratuite.
À livrer avec P2b (même parcours chParcourir, une seule vérité, trois sorties :
écran, Word, JSON-retour).

## SEED NATIF — décision du 22/08 soir
À LA PROMOTION, le PROMPT_SEED embarqué (chapitre) devient LUI AUSSI la v2 :
le natif et le hub disent la même chose. Pièce du geste de promotion, avec
l écriture au hub (ecrire-prompts-hub.sh). Plus d incohérence dormante.

## P4 — CONSTAT DE COMPLÉTUDE (22/08 soir) : DÉJÀ FAIT
État des lieux sur les neuf apps de production : le socle mjpcPromptComposer est
présent dans worktrack, correction_dictee, dictee_universelle, evaluation-qcm,
pilotage_debat_s3, applause_meter, analyse_logique ET index (le site) — huit sur
neuf, généralisé lors des passes antérieures (M9, M14, M-PROMPT). La seule app
sans socle est reecriture (et sa variante bb4e) : vérification faite, ses
« prompt » sont un commentaire historique et un libellé de popup — AUCUN usage
IA. Pas de socle à poser là où il n y a pas d IA.
CORRECTION (Paul, même soir) : le constat comptait le SOCLE, pas la CHAÎNE.
Le plan (MJPC6-ETAT-DES-LIEUX, journal) fait foi : « il ne reste que reecriture
et reecriture_bb4e » — la zone prompt CANONIQUE (prompt maître + copier +
collage + validation + injection) leur MANQUE : reecriture n a qu un JSON.parse
et une validation, bb4e rien. P4-RÉÉCRITURE À FAIRE avant la promotion :
donner à reecriture la chaîne complète au canon des 4 chaînes (doctrine :
« le prompt maître ne fabrique pas le résultat : il actionne ce que l app sait
déjà faire » — detectModifs(orig,att) est la preuve). bb4e suivra le chantier
réécriture global (passe réécriture/étude de texte/rédaction).
DÉCISION FINALE (Paul, 22/08 soir) : la réécriture RESTE AU CHANTIER GLOBAL du
plan (passe réécriture/étude de texte/rédaction) — pas de raison de la faire ici.
Consigné : la question a été discutée LORS DU RETRAVAIL DES PROMPTS SEED (P3-P4,
cette session) ; le chantier réécriture héritera du canon des 4 chaînes et de la
doctrine « le prompt actionne ce que l app sait faire » (detectModifs).
LE GESTE DE PROMOTION :
audit anti-bac complet + promeus + prompts au hub + seed natif v2 — un seul geste.

## AUDIT ANTI-BAC — RENDU le 22/08 soir : PROPRE
Production (production-PONT-index.html, md5 e4e081536cb3a335ae5f4b9676594c88) :
· 12 marqueurs de bac : 0 partout (le seul mot « coiffe » = le verbe français
  dans un commentaire du papier — vérifié au contexte) ;
· 9 pièces du pont présentes (couture, adaptateur, refusion, copie au fil de
  l eau, P2 validation+application, 3 branchements, relecture par classe) ;
· moteur embarqué = deroule97 BIT À BIT (md5 e7ceefa8… vérifié au B64 décodé) ;
· smoke : pas de bandeau, pas de décor, pas de miroir, secuEcrire NATIF,
  0 PUT parasite au boot, pièces du pont vivantes.
LA PRODUCTION EST PRÊTE. Le promeus attend l ordre explicite de Paul.
Le geste promeus emportera : la copie vers le repo prod + prompts au hub
(ecrire-prompts-hub.sh) + seed natif v2 + annonce élèves si pédagogique.

## COMPARAISON INDEX ACTUEL ↔ RÉSULTAT — rendue le 22/08 soir (exigence de Paul)
① SOUCHE : md5 54da80f2… — la composition part BIT À BIT de l index de
  production actuel (8.57.1). Rien n est reconstruit : tout est ajouté dessus.
② FONCTIONS : 0 manquante sur les ~1100 de l actuel · 91 AJOUTÉES par le pont
  (préfixes _dr/atDr/atP2/atVues — toutes nouvelles, aucune collision).
③ MODIFIÉE : UNE SEULE — atEditerChapitreRendre, la couture unique déclarée
  [PONT-É2] : une ligne ajoutée en fin de corps (atVuesMonter();). C est LE
  point d entrée du pont, connu et documenté depuis le premier jour du chantier.
④ M-SÉCU : les 29 fonctions secu* de l actuel sont dans le résultat au CORPS
  EXACT IDENTIQUE (secuInfo ressortait par un faux positif de borneur — ajout
  APRÈS la fonction ; comparaison à accolades équilibrées : identique).
⑤ BAC : 12 marqueurs à zéro, PAS MÊME EN CODE MORT (audit précédent).
CONCLUSION : le résultat = TON index actuel + le travail diaporama branché,
rien retranché, rien du bac, M-SÉCU intact au bit près.

## AMENDEMENT P2/P3 (débusqué par Paul, 22/08 soir) : LES NOTIONS PAR ÉCRAN
Le schéma d injection n accepte pas ecrans[].comp — or la doctrine de Paul est
que TOUT se décide en amont (structure + déroulé injectés). À amender :
· P2 : ecrans[].comp accepté (liste d ids compétences/notions), validé contre
  la taxonomie, normalisé dans la copie ;
· P3 : le prompt chapitre et le prompt deroule déclarent le champ ;
· le champ de tête « notions » devient LA RETOUCHE D APPOINT en classe (une
  notion imprévue surgie du cours), pas le canal principal. Rétiquetage à
  décider par Paul.

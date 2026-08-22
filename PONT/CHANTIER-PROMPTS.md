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

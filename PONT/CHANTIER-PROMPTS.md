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
P2b · LES DEUX VUES JUMELLES DU CHAPITRE (précisé par Paul le 21/08 au soir) :
    UNE FENÊTRE AUTONOME, comme le tableau de projection (window.open), rendant des
    PAGES A4 RÉELLES (« la visionneuse est l'impression ») — à l'écran la vue
    agglomérée, Ctrl+P le document. Deux déclinaisons du même gabarit :
    · LA VUE PRÉVUE (depuis l'éditeur, onglet Structure — l'intention d'origine de
      la 3e colonne) : feuille de sommaire du chapitre, fiches, séances détaillées
      (diapos/trames, temps prévus, métas pédagogiques : notions, compétences),
      ressources/documents, ET LES TROUS DÉCLARÉS (items à lier ref vide, séances
      sans trame, sans compétence, notions hors niveaux). Rôle : l'état des lieux
      face à l'apport de l'IA (l'inventaire à l'injection du plan).
    · LA VUE VÉCUE (depuis le profil longitudinal de classe) : le même chapitre tel
      que CETTE classe l'a traversé — bilans de séances jouées, temps réels contre
      prévus, écrans réellement montrés, décisions T-5/fin d'heure, travail donné.
      La symétrie prévu/vécu du déroulé, portée au niveau chapitre.
    TOUT IMPRIMABLE par construction (A4 natif, aucune conversion).
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

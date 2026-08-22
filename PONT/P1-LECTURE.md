# P1 — LECTURE DE L'EXISTANT (chantier PROMPTS) · état au 22/08/2026
Sur pièces (base.html + les 4 apps du clone de production).

## Les prompts-graines (PROMPT_SEED, base.html ~L537693)
DEUX clés : `chapitre` et `fiche_seance`. LE TROISIÈME PROMPT (le DÉROULÉ) N'EXISTE PAS
— cohérent avec l'arbitrage (a) : il est à CRÉER en P3, produit = trame d'écrans.
Le seed `chapitre` est déjà très structuré : discussion de cadrage OBLIGATOIRE avant
tout JSON (5 questions), mise en cohérence comme cœur du travail (séance sans
compétence, notion hors niveaux, trous, doublons — signalés EN DISCUSSION), entrées
du programme et compétences C4 injectées (@@ENTREES@@, @@COMPETENCES_C4@@), état de
l'année (@@ETAT_ANNEE@@ — l'alternance par POIDS de compétences), types de séance
fermés (@@TYPES_SEANCE@@), TAXONOMIE DONNÉE (@@TAXONOMIE@@ — identifiants exacts,
niveaux entre crochets, rien d'inventé), format JSON fermé, « published » interdit,
clés d'items courtes. `aLier` rapproche par TITRE de séance → à remplacer par la
CLÉ DE RAPPROCHEMENT posée (arbitrage (b)). `kind` contient encore « diaporama »
→ à faire muter vers le produit déroulé (arbitrage (a)).

## La validation (chValiderChapitre)
mjpcValidation(8) — les motifs s'additionnent, cités par séance : titre, niveau
/^[3-6]e$/, séances non vides, type ∈ CH_TYPES_SEANCE, notions/compétences vérifiées
contre la taxo réelle (chIdsTaxo). → P2 y ajoute : seances[].deroule.ecrans (forme
moteur : act/h/dur/blocs typés) + la clé de rapprochement + le produit déroulé.

## Les quatre chaînes (worktrack · correction_dictee · dictee_universelle · pilotage_debat_s3)
LE CANON EXISTE ET EST UNIFORME : un socle commun de SEPT fonctions `mjpcPrompt*`
(Composer · Charger · Enregistrer · Chemin · AvecPresentation · Presentation ·
Vocabulaire · Outils) présent À L'IDENTIQUE dans les quatre apps, + DEUX adaptateurs
locaux par app (xxChargerPrompt / xxEnregistrerPrompt). C'est le gabarit de P4 pour
les apps restantes. Reste à lire (fin de P1) : le corps exact de mjpcPromptComposer,
la fin du seed fiche_seance, et mjpcPromptChemin (l'écriture au nœud
/site/atelier/prompts — vide depuis toujours : P3 le remplit).

## Plan d'attaque affiné
P1-fin : corps du socle + chemins hub (1 lecture).
P2 : schéma + validation deroule.ecrans + clé de rapprochement (exécutant, banc).
P2b : vues jumelles (ed2Papier étendu · fenêtre · A4 · docx natif) — après P2.
P3 : seed `deroule` créé + seed `chapitre` amendé ((a),(b), produits déclarés)
     + écriture des trois prompts au hub. Éprouvé au bac sur chapitres martyrs.
P4 : le socle mjpcPrompt* posé sur les apps restantes, par lots.

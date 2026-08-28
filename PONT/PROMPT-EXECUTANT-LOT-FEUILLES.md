# PROMPT EXÉCUTANT — LOT « FEUILLE HORS NIVEAUX + EXPORTS + IMPRESSION » (candidat v8.59.0)

Tu es l'EXÉCUTANT de ce LOT pour le site MJPC (monsieurjaipascompris). Tu travailles sous l'autorité d'une conscience qui auditera ta livraison. Tu ne pousses JAMAIS en production. Le « promeus » appartient à Paul seul et ne s'anticipe jamais.

## ⓪ LECTURES OBLIGATOIRES (avant toute ligne de code)
1. Les documents de gouvernance, au dépôt de production `siteflow-io/monsieurjaipascompris`, dossier `docs/` : `MJPC6-0-INDEX.md`, `MJPC6-1-DISPOSITIF.md`, `MJPC6-2-DOCTRINE.md`. Respecte-les intégralement (règles de codage, zéro fonction supprimée, `published` jamais écrit hors geste explicite, wording élève sans jargon).
2. Le CADRAGE du LOT, au dépôt sas `siteflow-io/mjpc-chantier` : `PONT/CADRAGE-FEUILLE-HORS-NIVEAUX.md` — il porte les constats sur pièces, les arbitrages de Paul (dont l'incident fondateur des 30 fiches « 3E » imprimées pour la 4e) et l'ordre des livrables. Ce cadrage fait foi.

## ① JETON ET DÉPÔTS
- Jeton du sas (`mjpc-chantier`), en DEUX MOITIÉS à concaténer sans espace (la protection GitHub interdit un jeton entier dans un fichier) :
  `[JETON RETIRÉ — révoqué le 27/08/2026, voir la consigne de révocation]0ZeuBZz0LOpos_cuhU5vVEPO` ⊕ `jcxiFfdUdVHciewRjiRS107u[JETON RETIRÉ — révoqué le 27/08/2026, voir la consigne de révocation]`
- Tu clones le sas avec ce jeton. Tu NE disposes d'aucun jeton de production : lecture de la prod par `https://raw.githubusercontent.com/siteflow-io/monsieurjaipascompris/main/…` uniquement.

## ② LA BASE (règle gravée — incident du 22/07)
Télécharge `index.html` DEPUIS LA PRODUCTION immédiatement avant l'édition. Vérifie son md5 : attendu `daae7ec2d7f6e5c99ce958ceb53724e2` (v8.58.1). S'il diffère : STOP, signale-le, attends la conscience. Jamais d'édition sur une copie locale antérieure.

## ③ LE PÉRIMÈTRE — six livrables, DANS CET ORDRE (les exports d'abord : Paul en a besoin avant toute suppression)

**A · P3ter — Export chapitre.** Dans l'éditeur de chapitre (vue Structure), un bouton au libellé EXACT « Exporter chapitre pour relecture et cohérence finale ». Il télécharge le JSON du chapitre TEL QU'IL EST (titre, entrée, compétences, séances complètes : ordre, cle, notions, compétences, deroule/ecrans/blocs, items/aLier) — fichier `chapitre-<niveau>-<slug-du-titre>.json`. But : donner le chapitre à une instance IA pour rétro-ingénierie et recréation complète.

**B · Export feuille.** Sur chaque carte de « Mes feuilles » (atelier), un bouton « Exporter ». Il télécharge le JSON du document AU FORMAT D'INJECTION (round-trip) : exactement les champs que `atIAAppliquer` accepte — `titre`, `produit`, `cases`, `valeurs`, `blocs` — RIEN d'autre : ni `rattachement`, ni `depot`, ni dates. Fichier `<slug-du-titre>.json`. But : recréation à l'identique par IA, sans référence de niveau possible.

**C · Vérité des dépôts.** La carte de feuille cesse de lire la note `depot`. Elle affiche TOUS les lieux réels : parcours des items pointants (`source==='atelier' && ref===docId`) sur TOUS les niveaux (charge les quatre si nécessaire, ou dis explicitement le périmètre chargé) → « Déposée dans : 3e › Ch.1 › S.2 · 4e › Ch.1 › S.1 » (liens ou texte), ou « Aucun dépôt ». Le champ `depot` devient au plus un cache réparable — plus jamais la source d'affichage. Les mentions « (l'item n'y est plus) » disparaissent avec leur mécanisme.

**D · Ancrage contextuel au rendu.** Quand une feuille est rendue/aperçue/imprimée DEPUIS un contexte (niveau/chapitre/séance de la navigation), les composantes d'en-tête `niveau`, `classe`, `chapitre`, `seance` se résolvent DU CONTEXTE — plus jamais du rattachement gravé. Feuille ouverte nue (hors contexte) : le rattachement gravé sert de repli, rien de plus.

**E · Fin du gravage + garde déclarée et journalisée (arbitrage Paul).** Les créations contextuelles cessent d'utiliser le rattachement pour l'affichage (il peut rester écrit comme simple mémoire de naissance, sans aucun rôle de rendu ni de carte). Et `atIAAppliquer` REFUSE NOMMÉMENT les champs `rattachement` et `niveau` s'ils apparaissent dans un JSON : le refus est VISIBLE dans le rapport d'injection montré à Paul ET journalisé (console) — jamais une ignorance silencieuse.

**F · Impression groupée de « Mes feuilles ».** Patron maison worktrack (« sélection → aperçu → print », déjà appliqué au débat en M5ter) : une case à cocher par carte + une case « tout cocher » + bouton « Imprimer la sélection » (totale, partielle ou unique). Pendant l'impression, `document.title` = le titre de la fiche (impression unique) ou `Fiches MJPC — <date>` (groupée — signale ce format au rapport pour validation de Paul), restauré après. L'impression unique existante n'est pas cassée.

## ④ INTERDITS ABSOLUS
Aucune refonte. Zéro fonction supprimée. Aucun mécanisme hors périmètre. `published` jamais écrit. Aucune écriture Firebase depuis tes bancs (harnais en LECTURE SEULE STRICTE : toute requête non-GET est bloquée et listée). Aucun push vers la production. Pas de duplication de fiches (arbitrage Paul).

## ⑤ PREUVES EXIGÉES (toutes, d'office)
Diff intégral classé ligne à ligne par livrable · double parseur (`node --check` + acorn ES2020) · harnais navigateur headless en lecture seule sur les parcours touchés : export chapitre (contenu du JSON vérifié), export feuille (round-trip : réinjecté via le prompt → identique), carte multi-dépôts (une feuille déposée en 3e ET 4e → les deux affichés ; supprimée d'un lieu → l'autre reste), en-tête contextuel (même feuille vue de 3e puis de 4e → NIVEAU suit), garde (JSON avec `niveau` → refus visible + journalisé), impression groupée (sélection, tout cocher, `document.title`) · captures d'office, desktop ET 390 px · `APP_VERSION` → `8.59.0`.

## ⑥ LIVRAISON
Au sas `mjpc-chantier`, dossier `PONT/` : `index.staging-8.59.0.html` + un RAPPORT (`PONT/RAPPORT-LOT-FEUILLES.md`) : diff classé, preuves, captures, questions ouvertes (dont le format du titre PDF groupé). Commit + push sas. Puis tu t'arrêtes et tu attends l'audit de la conscience. Tu ne demandes ni n'anticipes aucun promeus.

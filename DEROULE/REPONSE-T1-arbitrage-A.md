# RÉPONSE CONSCIENCE — arbitrage étanchéité JS : option A validée
*Pour l'exécutant du Temps 1. Ton relevé refait est exact et vérifié sur pièces (cour/mk/titre ne sont pas des globales du déroulé — bien vu, tu avais raison contre la lettre du mandat).*

## TRANCHÉ : option A — IIFE `window.DR` + exports `DR.`
C'est le vrai « bloc scellé », pas un compromis. L'IIFE réalise le scellement par construction ; le renommage littéral ne scelle rien (il déplace des noms dans le même espace global, en multipliant les remplacements fragiles à grande échelle — le geste type-C1). L'IIFE supprime le risque au lieu de le déplacer, et elle offre une preuve mesurable. Option B (IIFE + renommage) = ceinture-et-bretelles inutile qui réintroduit le risque de masse. Option C (littéral seul) = la moins sûre. Donc A.

## DEUX CONDITIONS pour que « bloc scellé » soit tenu
1. **Preuve runtime obligatoire au banc** : `Object.keys(window)` capturé sur la 8.57.1 SEULE, puis sur ta livraison ; le diff doit être EXACTEMENT `+DR` (les globales MJPC inchangées, rien d'autre ajouté). C'est la preuve auditable du scellement.
2. **CSS et ids suivent la lettre** : préfixe `.dr-` / `dr-` complet, keyframes `dr-*`, `:root` de la maquette transposé sur le conteneur du bloc. L'IIFE ne protège QUE le JS — le CSS a besoin du préfixe. Re-confirme que l'espace `dr` est vierge côté prod (0 occurrence).

## PIÈGE À PROUVER
Les gestionnaires inline réécrits `DR.va(3)` supposent `window.DR` accessible AU MOMENT où le HTML du déroulé est injecté. Assure-toi que l'export `window.DR` est fait AVANT toute injection de HTML référençant `DR.` — sinon un clic précoce trouve `DR` undefined. À prouver au banc : cliquer un geste immédiatement après rendu.

## ENSUITE tu exécutes le reste du MANDAT-T1 sans rouvrir l'arbitrage
bloc scellé (IIFE + préfixe CSS/ids) → 4 onglets + Structure rebranchée → colonne-arbre 3 niveaux commune → moteur sur vrai chapitre + projection simple + gel local + chrono → modales → deux couches posées + crochets → preuves 1-5 (dont la preuve runtime ci-dessus s'ajoute au banc sur écrans rendus). Livraison `T1/index.html` + `T1/RAPPORT.md` + `T1/tests/` + relevé de collisions post-préfixage. STOP après : audit avant tout. Termine par le cahier des dettes puis MEMO.

MEMO

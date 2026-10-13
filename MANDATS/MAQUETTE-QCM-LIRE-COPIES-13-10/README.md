# Maquette « 📄 Lire les copies » — le soir, une copie après l'autre (conscience n°12, 13/10/2026)

Paul, 15:55 : « Ta proposition 1076 et 77 sont les meilleures: du séquentiel effectivement, et 1077, oui, l'app pose des questions, auxquelles je réponds par oui ou non, c'est la meilleure solution. ça donnerait quoi en capture? » Il ajoute que les « n'a pas dit » restent, parce qu'ils peuvent cacher un litige.

## Ce qu'est cette maquette (PROTOCOLE-MAQUETTE §00)

Elle est écrite dans le code réel de l'app en ligne (`code-qcm` à `e0bfc349`, l'app de 13:12). Elle y ajoute un fichier, `lire-copies.js`, et deux lignes de branchement (`branchement.diff`) : le bouton « 📄 Lire les copies (n) » dans le tableau de la séance, et le fichier dans `build.py`. Elle passe par les lectures et les gestes qui existent déjà :
- « ✅ Oui » fait ce que fait « ✔ Marquer lue » (`marquerLueV`) ;
- « ✏️ Autre chose », puis « ✔ Valider », fait ce que fait « Que dit la feuille ? » (`feuilleDitV`) : la note se recalcule, et le bilan dit « Corrigé d'après ta feuille ».

Elle est jouée sur le faux hub, avec la séance que le banc commun de QCM-4 a jouée de bout en bout à 09:40 (`sorties/2026-10-13_0940/base-finale.json`, la classe fictive 3 ESSAI, 24 présents). Cette séance est remise à son état du soir : aucune ligne lue, et les lectures du voisin sont rétablies (`base-faux-hub-soir.json`). Elle donne 9 lignes à lire, sur 8 copies.

## Ce que fait l'écran

- Les copies qui ont une ligne à lire viennent dans l'ordre alphabétique de la pile, avec « Copie n sur N » et une barre.
- Pour chaque ligne, l'app pose une question : « La copie dit-elle « … » ? », c'est-à-dire ce que le voisin a lu, ou « La copie ne dit-elle aucun des choix ? ». Deux boutons : « ✅ Oui » et « ✏️ Autre chose ».
- Sous chaque question, une ligne grise : qui a lu, le clic sur la tablette, ce que l'élève a dit, et sa remarque de co-évaluation.
- Quand toutes les lignes d'une copie sont réglées, la copie suivante vient seule.
- À la fin : « ✅ Les N copies sont lues », puis « 📤 Rendre les copies ».

## Captures (1536 × 864, l'écran de Paul)

`captures/1-tableau-seance.png` (le bouton), `2-copie-1.png`, `3-copie-1-autre-chose.png`, `4-copie-2.png` (après quatre « Oui », la cinquième copie). Elles sont rejouées par `capture.js`, par le geste : Données → Résultats → « 📊 Ouvrir » → « 📄 Lire les copies (8) ». Aucune erreur de page.

App assemblée : md5 `70b11f1b735f5adb5f51a1c15c461435`. Elle n'est pas en ligne, et rien n'est poussé sur `code-qcm`.

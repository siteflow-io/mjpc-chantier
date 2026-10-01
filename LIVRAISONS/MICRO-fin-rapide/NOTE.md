# MICRO — correction_dictee 6.6.3 — « sauter à la fin » en correction rapide (dette n°12 · 93)

*Conscience n°12, 01/10/2026, filière micro. Rien n'est promu : attend le « promeus » de Paul.*

## Le bug et sa cause (mesurée)
En correction rapide, « Sauter à la fin » sur un élève pas encore corrigé affiche l'écran « Terminé ! » — qui portait un bloc « Barème » (deux boutons radio) lisant `editForm`, une variable de l'édition de la dictée qui n'existe pas dans l'écran de correction : `ReferenceError`, la page tombe. **Le bloc est dans la 6.5.0** (hérité) ; il n'est atteint que par ce chemin.

## Le fichier
- Base 6.6.2 (738 095 o, md5 `0aeb77123b356a2529dbe3751a3911c6`) → **6.6.3** : 737 081 o (−1 014), md5 `a1c4d16207242dab9b63dfa882ab93ee`. Édition ciblée : le bloc « Barème » de l'écran de fin retiré (12 lignes → 1 commentaire) ; `CorrEleve` 42 976 → 41 962 o ; `node --check` 0 erreur. Le barème se règle dans Préparation (inchangé).

## Le banc (`bancs/banc_micro_fin.py`) — par le geste, faux Firebase, ZZTEST
Ouvrir la dictée → ⚡ Rapide → « Sauter à la fin » : **6.6.2 : la page tombe (`editForm is not defined`) ; 6.6.3 : « Terminé ! » s'affiche, 0 erreur JS** ; 0 sortie du navigateur. VERT 3/0.

## Captures
`captures/base-2-fin.png` (6.6.2 : l'écran reste figé) / `captures/livree-2-fin.png` (6.6.3 : « Terminé ! », Enregistrer, Relire).

## Ton test, après promotion
https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.6.3 → une dictée → ⚡ Rapide → « Sauter à la fin » → « Terminé ! » → Enregistrer.

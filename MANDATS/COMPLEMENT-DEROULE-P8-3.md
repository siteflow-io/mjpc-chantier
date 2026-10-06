# COMPLÉMENT — MAQUETTE p8 · livraison p8-3b : un trait ne passe jamais derrière une autre notion
*Conscience n°13, 06/10/2026 (C13, tour 17). Soumis à Paul dans la conversation avant tout dépôt. Se lit après `MANDATS/MANDAT-DEROULE-MAQUETTE-P8.md` (version 3), qui reste en vigueur en entier.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Un schéma ne dit jamais un lien faux. Sur le morceau « Figures d'analogie » de la vraie carte (p8-3, `captures/p8-3-morceau-1-zoom.png`), les traits vers « personnification » et « métaphore » passent derrière « comparaison » : les mots se lisent, mais un élève peut croire que « personnification » dépend de « comparaison ». Chaque trait doit aller de sa famille à sa notion sans passer derrière une autre bulle.

## L'AUDIT DE p8-1, p8-2, p8-3 (conscience n°13)
- p8-1 : **ça va** — les 24 bancs ne diffèrent des originaux que par leurs chemins (comparés ligne à ligne, nombre de vérifications identique) ; la p7 reste au md5 `5045f337…`.
- p8-2 : **ça va** — l'extrait de l'ancien moteur est fidèle (chaque ligne de code présente telle quelle dans le moteur de production décodé) ; la maquette se régénère à l'identique (md5 `369d1388…`).
- p8-3 : **ça ne va pas** — rejoué chez la conscience : 25 bancs à 0, `test-p8-3-gestes` à 1 défaut, le même que dans la NOTE (« Figures d'analogie » 2 traits, « Figures de substitution » 3 traits). Tu as eu raison de t'arrêter et de le dire.

## CE QUE PAUL A TRANCHÉ (C13, tour 18)
**T11 · l'écartement évite aussi les traits qui passent derrière une autre bulle.** `p8Separe` traite comme un contact « un trait qui passe derrière une bulle qui n'est pas au bout de ce trait » : la bulle en cause est poussée vers la place libre du cadre visible, comme pour un chevauchement. Rien d'autre ne change : les polices (32 / 26 pt), la place « plein », le cadre visible comme limite, la mesure (elle continue de compter ces traits). **Une bulle placée à la main n'est jamais poussée** (décision 7) : si un trait passe derrière elle, la mesure le dit.
Écartés par Paul : ne plus compter ce défaut dans la mesure (le dessin dirait un lien faux) ; le laisser se régler à la main à chaque carte.

## LA LIVRAISON p8-3b
Branche `deroule/p8-3b`, partie de `deroule/p8-3`. Jamais `main`.
1. T11 dans `p8Separe` (patch `patch-p8-3b.py` sur le gabarit p8-3) ; la NOTE donne la taille de la fonction avant et après, et chaque ligne changée avec sa raison.
2. **La vraie carte** : le banc coupe toujours jusqu'à ce que chaque morceau tienne ; la NOTE dit combien de morceaux il a fallu, avant (5) et après, avec les cinq chiffres de chaque morceau et sa capture regardée.
3. Les 26 bancs rejoués : **le banc unique à 0**. Si un morceau d'une seule famille ne tient toujours pas, tu le dis avec sa mesure et sa capture, et tu t'arrêtes : tu ne touches ni à la mesure ni aux polices.
4. `LIVRAISONS/DEROULE/p8-3b/` : NOTE, bancs, sorties, captures, gabarit, patches, maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html`, empreintes contrôlées. Puis tu t'arrêtes.

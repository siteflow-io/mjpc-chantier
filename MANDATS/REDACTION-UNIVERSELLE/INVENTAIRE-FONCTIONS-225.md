# Rédaction — les fonctions qui ne servent plus (C14 225)

Conscience n°14, 31/10/2026, 22:10–22:25 (rappel posé à la demande de Paul, 14:03 et 14:16). Rien n'est changé dans l'app : c'est une liste, à trancher par Paul. Principe de recyclage (Paul, 13:41 : « sans uniquement jeter ») : rien n'est jeté sans mesure, rien n'est effacé sans son mot.

**Comment c'est mesuré.** Dans le code : `redaction.html` en production (1.4.10-RU), la partie de l'app d'origine (lignes 3071 à 6738) ; pour chaque fonction, qui l'appelle encore, et si le code des scans, de la recopie ou de la bande l'utilise (il n'en utilise aucune). Au site, en lecture seule (rien d'écrit) : les deux rédactions du site ; la classe 3 FRANKLIN Aretha (30 copies) et la copie de 3 DYLAN Bob. Ce que la correction d'origine a laissé au site : grilles remplies 0, sous-descripteurs 0, citations 0, compteur d'orthographe 0, meilleure citation 0 ; chronométrage du mode interrogatif 1 copie ; signet du mode interrogatif 1 ; variante du sujet choisie 2 copies. Ce que les scans portent : marques 24 copies, réponses 5, nombres de lignes 25, recopies 28.

## À ranger ou à recycler

| N° | La fonction | Ce qu'elle fait encore (mesuré) | Au site | Verdict proposé |
|---|---|---|---|---|
| 1 | **Le tableau des élèves** (l'accueil de la correction, une carte par élève) | liste la classe, trie ; la carte lit l'avancement des scans (depuis 1.3.0) ; **un clic sur une carte ouvre la grille d'origine, ou le mode interrogatif** si aucune variante n'est choisie | (une vue) | **garder la vue d'ensemble, recycler le clic et la carte dans le flux** : la carte montre les étapes de la copie (recopiée, envoyée, chargée, bande), le clic ouvre la copie dans les scans ou la recopie, là où tu travailles |
| 2 | **La grille d'origine d'une copie** (les quatre niveaux par indicateur, les sous-descripteurs que tu pouvais réécrire, une citation par indicateur, « la meilleure citation » et son commentaire) | s'ouvre encore par le clic sur une carte ; rien dans les scans ne la lit | 0 copie remplie sur 31 | **ranger** ; **recycler** les textes des quatre niveaux et des sous-descripteurs dans la grille en stickers (point 7 de la liste du registre) ; « la phrase qui m'a touché » vit déjà sur les scans (l'étoile) |
| 3 | **Le mode interrogatif** (plein écran, un indicateur à la fois, ses touches, le chrono et sa pause, le signet de chaque élève) | s'ouvre encore par le clic sur une carte, et par son bouton dans la grille d'origine | 1 chronométrage, 1 signet (celui de la copie remise à zéro le 30/10) | **ranger** ; déjà recyclé : le parcours point par point au clavier et le chrono par passe (« une minute sans geste ne compte pas ») vivent dans les scans |
| 4 | **Le compteur d'orthographe** (le bandeau +1 à chaque faute, les seuils qui proposent un niveau) | ne vit que dans la grille d'origine | 0 | **ranger** ; à mesurer avant : si la note de la langue des scans a les mêmes seuils (je ne sais pas encore) ; sinon, **recycler** les seuils dans la note de la langue de la bande |
| 5 | **Le bilan d'une copie** (la fenêtre « bilan détaillé » : temps, hésitations, points faibles) | tiré du mode interrogatif | 0 | **ranger** : le récapitulatif des scans (1450 : la note, la grille, le bilan écrit par l'app, « À reprendre ») le remplace |
| 6 | **L'onglet « Bilan »** de la classe (statistiques : moyennes, critère le plus faible) | lit la grille d'origine : il est vide aujourd'hui | 0 | **recycler** dans un bilan de classe tiré des scans et de la bande : les notes, les critères, et les fautes par type (G, L, C, P…) de chaque élève et de la classe, pour la remédiation |
| 7 | **L'onglet « Fiches élèves »** (une fiche HTML par élève, l'aperçu, « Exporter tous HTML » en ZIP) | lit la grille d'origine : toutes les fiches disent « pas commencée » | 0 | **recycler** dans « 📨 Fichiers École Directe » des scans, qui fait déjà le fichier de chaque élève (sa copie et tes marques) ; **ranger** la fiche HTML d'origine |
| 8 | **Le classement du paquet** (la fenêtre des initiales de l'app d'origine) | remplacé par « 🔤 Les initiales » des scans, qui écrit le même ordre | l'ordre du paquet : 28 copies, écrit par les scans | **ranger** |
| 9 | **La sauvegarde JSON automatique à la fin d'une copie** (allumée par défaut) et « Exporter / Importer JSON » de l'app d'origine | ne se déclenche que dans la grille d'origine | — | **ranger** ; **garder** « 📸 Snapshot / 📤 Restaurer » (toute la rédaction, au patron du modèle) et la corbeille MJPC |
| 10 | **Le choix de la variante du sujet** (imagination ou réflexion) | demandé à l'ouverture d'une copie dans la grille d'origine ; les scans ne le demandent pas | 2 copies | **garder et recycler dans les scans** quand un sujet a deux variantes ; à cadrer avec toi (je ne sais pas encore si la grille à cases dépend de la variante) |
| 11 | **L'alerte « déclassement DNB »** (quand la note passe sous un seuil du brevet) | lit la grille d'origine | 0 | **à te demander** : la recycler dans la note des scans, ou la ranger |
| 12 | **Les calculs de note d'origine** (par indicateur, par critère, le total, le pourcentage) | servent encore à la carte d'une copie sans scans | — | **ranger après le 1** (quand la carte lit le flux) |

## À garder tels quels

Préparer le sujet (les phrases à valider) · Nouveau sujet · ✏️ le titre et la classe · ⧉ dupliquer · 🗑️ supprimer (corbeille) · la carte « Mode test » · le « ? » de chaque écran · 📸 Snapshot / 📤 Restaurer · « Rattacher » une copie à son élève · 📝 Corriger l'énoncé · l'abonnement en direct (un changement fait ailleurs se voit sans recharger).

## Ce que « ranger » veut dire

Le geste disparaît de l'écran ; le code part dans une copie au sas (`SAUVEGARDES/`), avec la liste de ce qui y est, pour être repris si besoin. Rien au site n'est effacé : les rares données d'origine (1 chronométrage, 1 signet, 2 variantes) restent dans les copies.

## Ordre proposé pour la refonte

1. le tableau des élèves dans le flux (n° 1) ; 2. l'onglet « Bilan » tiré des scans, avec les fautes par type (n° 6) ; 3. les fiches élèves dans les fichiers École Directe (n° 7) ; 4. ranger d'un seul mouvement les n° 2, 3, 4, 5, 8, 9 et 12, sur ton mot ; 5. la variante du sujet (n° 10) et l'alerte DNB (n° 11), après ta réponse.

# Rédaction 1.4.12 — les fonctions rangées (conscience n°14, nuit du 31/10 au 01/11/2026)

Sur l'ordre de Paul (31/10 22:36 « Ok allez maintenant fais tout le reste », 22:45 « la liste de ce qui ne sert à rien »), d'après la liste mesurée `MANDATS/REDACTION-UNIVERSELLE/INVENTAIRE-FONCTIONS-225.md`.

**Ranger veut dire** : le geste disparaît de l'écran ; le code reste dans le fichier (il n'est plus appelé) ; rien n'est effacé des copies au site (1 chronométrage, 1 signet, 2 variantes y restent). Chaque rangement est un remplacement dans `MANDATS/REDACTION-UNIVERSELLE/maquette/gen-maquette.py`, dans le bloc « 1.4.12 (C14 225 …) » ; **pour rendre une fonction, on retire sa ligne `R(…)`** et on reconstruit. Les lignes citées sont celles de la base `SAUVEGARDES/redaction-1.1.0-RU-avant-scans-2026-10-30.html`.

| N° (225) | La fonction | Ce qui est retiré de l'écran | Où dans la base | Le code |
|---|---|---|---|---|
| 1 | Le clic sur la carte d'un élève (ouvrait la grille d'origine, ou le mode interrogatif) | `onclick="ouvrirCopie('${id}')"` devient `avOuvrirCarte('${id}')` : la copie s'ouvre dans la recopie ou l'écran des scans, là où tu travailles | `renderDashboard`, l. 4330 | `ouvrirCopie` (l. 4351) reste, plus appelé par la carte |
| 2 | La grille d'origine d'une copie (quatre niveaux, sous-descripteurs, citations, la meilleure citation) | plus de chemin vers elle (le clic de la carte) ; une page rouverte sur elle (`modeOuvert` « classique ») revient au tableau | `correctionView`, l. 1400 ; `ruReprendre`, l. 2557 | inchangé |
| 3 | Le mode interrogatif (plein écran, touches, chrono, signet) | plus de chemin vers lui (il ne s'ouvrait que depuis la grille d'origine) ; une page rouverte sur lui (`modeOuvert` « interrogatif ») revient au tableau | `interroOverlay`, l. 1414 ; `ouvrirInterrogatif`, l. 4429 | inchangé |
| 4 | Le compteur d'orthographe (et le « ⚠ » de désaccord sur la carte) | le « ⚠ Orthographe : choisi … » de la carte (`ruDesaccordCompteur`) | `renderDashboard`, l. 4334 | `ruDesaccordCompteur` reste |
| 5 | Le bilan détaillé d'une copie (« 📊 » sur la carte) | le bouton « 📊 » de la carte (`boutonBilanCarte`) | `renderDashboard`, l. 4319-4328 | `ouvrirBilanCopie` (l. 3525) reste |
| 8 | Le classement du paquet d'origine (« 📋 Classer le paquet ») | le bouton est caché (`style="display:none"`), « 🔤 Les initiales » des scans écrit le même ordre ; le tri « Ordre du paquet » le dit | l. 1389 ; l'infobulle du tri, l. 1384 | `ouvrirClassementPaquet` reste ; le bouton reste dans la page (le bouton « 📄 Corriger sur les scans » s'accroche après lui) |
| 9 | La sauvegarde JSON automatique et « Exporter / Importer JSON » | déjà hors de l'écran dans la base ; la sauvegarde automatique ne partait que de la grille d'origine (`autoSauverJSON("copie_validee")`), qui n'est plus atteinte | l. 5730-5960 | inchangé ; « 📸 Snapshot / 📤 Restaurer » et la corbeille restent |
| 10 | Le choix de la variante du sujet | « — Sujet non choisi — » ne s'écrit plus sur la carte ; l'IA dit le sujet traité dans le même envoi (Paul 23:19, « Ok » à 336) ; un choix déjà fait reste | `renderDashboard`, l. 4313 | `libVariante` reste |
| 11 | L'alerte « déclassement DNB » | ne s'affichait que dans la grille d'origine ; devient la colonne « Brevet » du Bilan de la classe, jamais une alerte (Paul 23:19) | `notificationDeclassementDNB` | reste |
| 12 | Les calculs de note d'origine | la carte lit le flux et la note des scans ; la note d'origine ne s'affiche plus que pour une copie sans scans ni recopie | `noteTotale`, `progressionPct` | restent |
| 6 | L'onglet « Bilan » (statistiques de la grille d'origine, vides) | `genererContenuStatsProf()` remplacé par `avBilanClasse()` (avancement.js) | l. 3004 | `genererContenuStatsProf` reste |
| 7 | L'onglet « Fiches élèves » (fiche HTML, aperçu, « Exporter tous HTML ») | `ruRendreFiches()` remplacé par `avFiches()` : le bouton « 📨 Fichiers École Directe » | l. 3005, l. 3017-3026 | `ruRendreFiches`, `exporterHTMLEleve`, `exporterToutHTML` restent |

L'aide « ? » de « Pilotage — Correction », « Données — Bilan » et « Données — Fiches élèves » ne parle plus de ce qui a disparu.

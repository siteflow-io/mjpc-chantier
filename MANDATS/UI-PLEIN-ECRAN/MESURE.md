# TOUT L'ÉCRAN, TOUT LE TEMPS — LA MESURE DU SITE (8.75.0-③), 26/10/2026
*Conscience n°13, sur l'ordre de Paul (26/10 11:29 : « On utilise toute la largeur et la hauteur de l'écran, tout le temps. Tu vas tout mesurer dans le site de ce point de vue et faire ce chantier. » ; 11:37 : « ça se fait dans le site ça, pas en maquette »). Le chantier est le point 27 du §12 du contrat (`MANDATS/INTEGRATION-DEROULE/CONTRAT.md`).*

## Comment c'est mesuré
- Le fichier de production 8.75.0-③ (md5 `83adc8decc16ee4c51b8a68e3ceaa285`) sur le faux hub (horloge au lundi 14/09/2026 09:00), joué par le geste avec `mesure.mjs` (ce dossier) : 32 écrans, aux tailles **1366 × 768**, **1536 × 864**, **1707 × 743** et **1920 × 1080**.
- **1707 × 743 est la fenêtre de Paul**, mesurée sur ses captures du 26/10 : les boutons y sont 1,12 fois plus grands qu'à 100 % sur un écran de 1920 (« Structure » 100 px contre 85, « Dévoiler » 103 contre 93) et l'Atelier y a 103 px de marge de chaque côté — exactement ce que donne `max-width:1500px` dans une fenêtre de 1707 px. La loupe dans sa barre d'adresse dit que la page est zoomée.
- Pour chaque écran : la place que prend ce qui se lit (texte visible, non recouvert), les règles CSS qui bornent un bloc large (`max-width` / `width` en px), la taille du texte, les défilements de côté, la hauteur. Sorties brutes : `avant/mesure-1366-1920.txt`, `avant/mesure-1707-1536.txt` ; captures « avant » choisies dans `avant/`.

## Ce qui borne, écran par écran
| Écran | Ce qui le borne (mesuré) | Ce que ça fait chez Paul (1707 × 743) |
|---|---|---|
| **Panneau prof** (toutes les sections) | `.tprof-box{max-width:1100px}` + `.tprof-overlay{padding:30px}` (12 · 87, validé « bord à bord » le 11/10) | 1 100 px sur 1 707 : 300 px vides de chaque côté ; à 1920, 54 % de la largeur |
| **Atelier** (accueil, Mes chapitres, Structure, Atelier, Pilotage, Relecture) | `.at-zone{max-width:1500px}` ; une bande de 60 px pour « ✕ Fermer l'atelier » au-dessus des onglets ; la page défile de 36 px quand la zone du déroulé est montrée (`padding-bottom:40px`) | 103 px vides de chaque côté ; la zone du pilote commence à 116 px du haut ; à 1920, 237 px de chaque côté |
| **Relecture** (dans l'Atelier) | `.rel{max-width:1120px}`, `.recit{max-width:900px}` (dr.css) | le récit tient dans 900 px au milieu |
| **Accueil des niveaux, page du niveau** | `.home-inner{max-width:1100px}` | 1 100 px au milieu |
| **Visionneuse d'un document** | `.doc-viewer-box{max-width:1100px; width:90vw; height:85vh}` | 1 100 px sur 1 707 |
| **Emploi du temps** (semaine, mois, année, heures perdues) | rien : plein écran | — (texte 9 à 11 px : le sujet de la taille, après) |
| **Fenêtre du tableau** | rien : plein écran | — mais l'alerte « Vérifier les règles Firebase » peut s'y ouvrir devant la classe (dette 13 · 44) |
| Boîtes de dialogue (connexion 420 px, case de l'EDT 380 px, gardes), aperçu A4 de Structure (794 px) | voulu | gardé |

## Dans le même chantier (dettes d'affichage déjà dites)
- **12 · 88** — ↻ ✕ de chaque élève sortent de la carte (« Élèves & codes ») ; validé le 11/10 : une colonne par enfant de la ligne.
- **12 · 212** — la rangée « Sortir le JSON » de la section « Emploi du temps » s'écrase et défile de côté ; validé le 11/10 : trois groupes, un sélecteur.
- **13 · 38** — l'en-tête du pilotage dit la première classe du niveau, pas celle de l'heure.
- **13 · 44** — trouvée en mesurant : la fenêtre du tableau porte la session du prof et peut ouvrir une alerte du prof au vidéoprojecteur.

## La taille du texte
Médiane 13 à 15 px dans le panneau et l'Atelier, 9 à 11 px dans l'emploi du temps, aux quatre tailles (elle ne grandit pas avec l'écran). **Pas dans ce chantier** : le sujet suivant, sur le mot de Paul (le faire grandir avec l'écran se heurte à la hauteur de sa fenêtre, 743 px).

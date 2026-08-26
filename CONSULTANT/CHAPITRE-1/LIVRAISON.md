# Livraison — chapitre 3e « Poésie et peinture au XIXe siècle »
État au 25/08. Chaque ligne dit ce que le fichier est et où il en est.

## 1. Le chapitre
| Fichier | État |
|---|---|
| `chapitre-3e-poesie-peinture-final.json` | **Validé.** 9 séances, 95 écrans, 108 blocs, 35 items, 34 liaisons — recomptés sur le fichier le 26/08. **Import conditionné à la promotion du type `oral`** (candidat 8.59.5). |
| `consignation-trames-s1-s9.json` | Trames consignées, avec leurs notes de validation. Document de travail. |

## 2. Les diaporamas (le chapitre hors du site)
| Fichier | État |
|---|---|
| `chapitre-projection.pptx` | **Validé, images intégrées.** 123 diapos, Garamond ombré, français, plancher 24 pt. Les cinq tableaux sont en place. |
| `chapitre-progression.pptx` | **Validé.** 6 diapos : déclaration, parcours, évaluations, documents, à retenir. |

## 3. Les feuilles retenues par Paul
| Feuille | JSON | Word | État |
|---|---|---|---|
| Fiche de révision : réviser l'interro | ✓ | ✓ | **Validée** |
| Fiche notion : les registres littéraires | ✓ | ✓ | **Validée** |
| Fiche notion : rappel sur la versification | ✓ | ✓ | **Validée** |

## 4. Les feuilles produites, non encore relues par Paul
Relecture confiée à une instance d'audit indépendante.
Fiches textes : `albatros`, `fenetres`, `passante` · Fiches méthode : `image`, `paragraphe`, `reciter` · Évaluations : `brevet-blanc-parfum-exotique`, `dictee-preparee-le-port`, `dictee-a-trous-le-port`, `tache-finale-etranger`, `tache-finale-etranger-amenagee`.
Toutes en JSON + Word. Audits passés : fidélité Word/JSON 897/897 · aucune anomalie technique · aucune page orpheline · aucun emoji · relecture Éduscol faite (trois corrections appliquées).

## 5. Les fiches en dette (forme suspendue, contenu validé)
| Feuille | Ce qui manque |
|---|---|
| `feuille-notion-figures` | La carte mentale des 8 familles — rendue en tableau, contournement à défaire |
| `feuille-notion-genres` | La croix des 4 genres |
| `feuille-notion-mouvements` | La frise du siècle |
| `feuille-notion-propositions` | L'arborescence : à basculer en HTML comme la fiche méthode |
Condition commune : que les feuilles acceptent les objets graphiques (dette site 25).

## 6. Le schéma de la méthode d'analyse logique
| Fichier | État |
|---|---|
| `schema-methode-analyse-logique.html` | **Validé par Paul.** Reproduction fidèle de la diapositive, flèches en Bézier, entièrement modifiable. |
| `feuille-methode-analyse-logique.json` | Le schéma y est injecté dans un bloc `schema_html`. **Attend la composante non échappée côté site.** |
| Word correspondant | **Retiré** : la version en formes natives ne s'ouvre pas dans Word (vocabulaires XML non déclarés). À refaire quand la voie sera sûre. |

## 7. Les autres livrables
| Fichier | État |
|---|---|
| `qcm-interro-de-cours.json` | **Validé.** 12 questions, mode partiel, bonus champ lexical. |
| `applaudimetre-criteres-recitation.json` | **Validé.** 4 critères de récitation. |

## 8. Les documents de suivi
`registre-chapitre-3e.md` · `retro-ingenierie-prompt-chapitre.md` — à jour, y compris le bilan des dix tours d'échec et ses quatre causes.

---

## Chantier en cours au 26/08 — chapitre « Paroles de poilus »
EPI Verdun, voyage du 14 au 16 octobre. Décompte fait avant tout découpage : **17 séances utiles** (celles de Dylan, la classe la moins dotée), 2 séances de langue, aucune séance entre le retour et les vacances. Cadrage complet et dettes vivantes dans `CADRAGE-chapitre-poilus.md`.

## État au 26/08 — chantier « Poésie et peinture » suspendu
Le chapitre est complet et projetable. Restent, non traités : renumérotation des items de la séance 1, adresse de la frise à déplacer sur le bon item côté site, dettes 29 et 30 (blocs « diapo simple » et « page » du déroulé).

## Ce qui reste à produire
1. ~~La feuille de réécriture « Les Fenêtres »~~ — **produite le 25/08** (10 formes, note sur 10) : feuille élève + corrigé.
2. ~~Les versions aménagées~~ — **faites le 25/08** : 17 au total (16 nouvelles + la tâche finale). Restent celles des deux fiches en attente de bascule HTML.
3. ~~Le fichier des 5 images~~ — **fait le 25/08** : images extraites du PDF du projet, corrigées (Schinkel, Voyageur redressé), livrées en Word et intégrées au diaporama.
4. **La paire « exercice d'analyse logique en autonomie + corrigé »** — en dette : la méthode y est visuelle (annotation en couleurs sur le texte).
5. **Les trois fiches en dette graphique**, dès que le site les portera.

## Ce qui attend une action de Paul
- Promouvoir le type de séance `oral` → débloque l'import du chapitre.
- Coder la composante non échappée (`schema_html`) → débloque le schéma dans les feuilles.
- Coder les objets graphiques des feuilles (dette 25) → débloque les quatre fiches ci-dessus.
- Créer dans les apps : dictée « Le port » (Correction de dictée), réécriture (Réécriture), critères de récitation (Applaudimètre), QCM.
- ~~Corriger « Karl Friedrich » sur le Drive~~ — **fait le 25/08** : le PDF est remplacé par le Word corrigé, nouvel identifiant répercuté dans le chapitre.
- Déclarer la progression annuelle (œuvres, cursives, groupements) — à corriger aussi dans le prompt du site : Éduscol dit 3/3/3, le prompt dit 4/3/2.

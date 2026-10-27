# LA RÉDACTION UNIVERSELLE — suite du cadrage du 16/07 · tranchages à valider
*Conscience n°13, 27/10/2026. Rien n'est codé ; rien ne part en mandat avant le oui de Paul, puis la maquette validée sur captures.*

## 1 · Les mots de Paul
- 27/10 11:18 : « Les 3e ont fait une rédaction avant les vacances j'aimerais utiliser l'App rédaction dugain dessus. Mesure cette app et voit ce qui a été cadré pour elle »
- 27/10 11:37 : « donc justement, il faut terminer le cadrage pour cette app (suite du cadrage du 16 07). […] ça doit aller vite. tu dois proposer (appuyé sur ma façon de travailler) et je dois valider ou non. »
- 16/07 (F3) : « `etude_dugain` et `redaction_dugain` ne sont PAS des archives — ce sont les SOUCHES à universaliser […] « Rédaction universelle » (comme la dictée universelle), en puisant largement dans la taxonomie des compétences et des notions — la Concordance est leur prérequis. » ; « pour rédaction c'est pareil » ; les échelles éditables vivent au hub, éditées en Préparation (DOCTRINE §K0 ; cycle du descripteur : proposé → validé → cliquable → réutilisé).

## 2 · La mesure (27/10, tour 225)
`redaction_dugain_v3.html` (production, 349 982 o) : outil du professeur pour des copies papier ; grille DNB sur 40 (3 critères, 10 indicateurs, 4 niveaux rédigés au prénom, 134 sous-descripteurs, compteur d'orthographe), mode clavier 1-4, paquet par initiales, chrono et statistiques, fiche HTML par élève ; `localStorage` + JSON automatique ; aucun lien au site. Écrite pour un sujet (Dugain, DNB 2024 : 87 mentions) et une classe (« 3e De Gaulle » sur chaque fiche). Dettes ouvertes : hors socle (11 · 03 ④), pas de mode test, pas d'identité élève MJPC, l'export des copies (dette 16 du 14/07).

## 3 · Les tranchages proposés (« ce que je ne commente pas est acquis »)
- **R1 — Un moteur, des sujets.** Le code ne connaît plus aucun sujet ni aucune classe ; un sujet (énoncé, texte, grille) est une donnée du site (`/redactions/<id>/config`, comme `/reecritures`, `/dictees`). La grille Dugain devient le premier sujet, reprise telle quelle (rien de perdu).
- **R2 — La finesse reste entière.** Critères, indicateurs pondérés, 4 niveaux rédigés au prénom, sous-descripteurs, compteur d'orthographe, clavier 1-2-3-4, paquet par initiales, chrono, statistiques, fiche élève : rien ne tombe.
- **R3 — Un sujet naît comme un chapitre.** Paul travaille la grille avec Claude et un « prompt rédaction » (sur le modèle du prompt d'injection : la grille Dugain pour modèle, son texte, son sujet, les compétences de la taxonomie) ; il reçoit un JSON ; dans l'app : « Nouveau sujet » → coller → « Vérifier » (les refus en clair) → « Créer ».
- **R4 — Paul valide chaque phrase avant qu'un élève la lise.** Un sujet créé arrive « à relire » ; dans la Préparation, Paul lit, corrige dans la case, valide ; aucune fiche ne part avec une phrase non validée.
- **R5 — La classe vient du site.** Paul choisit la classe dans la liste du site (plus de liste à coller) ; les élèves sont ceux du site ; la fiche porte le nom de la classe choisie.
- **R6 — Tout s'enregistre au site, à chaque geste** (`/redactions/<id>/copies/<élève>`), la sauvegarde JSON automatique gardée en ceinture ; le mode test comme sur le reste du site. (Règle la dette 16 et le « hors socle ».)
- **R7 — L'accès.** Depuis le panneau prof et depuis la séance du chapitre (l'onglet « Rédaction » ouvre le sujet rattaché à la séance). Côté élève, rien de nouveau pour l'instant : la fiche part comme aujourd'hui (imprimée ou École Directe).
- **R8 — Les compétences.** Chaque indicateur porte l'identifiant de sa compétence dans la taxonomie (refusé s'il n'existe pas) ; rien d'autre de la Concordance n'est attendu pour commencer.
- **R9 — L'ordre.** La maquette d'abord (sur le fichier réel : « Nouveau sujet », « Vérifier », relire et valider ; le tableau de bord avec la classe du site), captures pour le oui de Paul, puis le mandat à un exécutant. La tablette à deux élèves ne concerne pas cette app (outil du professeur). L'étude de texte universelle : après.

## 4 · Ce qu'il faut de Paul pour le premier sujet
Le sujet de la rédaction des 3e d'avant les vacances (le texte ; imagination et/ou réflexion) — question 522.

## 5 · Le mot de Paul (11:42) et les tranchages repris
Paul, 11:42 (avec le sujet `Sujet-ecriture-lettre-30-lignes-3e.pdf`) : « R4 précise. R9. attention à la dérive maquette (bien qu'ici, rédaction dugain actuelle est en soi une maquette). Donc je pense qu'il faut commencer par l'intégration au site, à mon avis. Pour la rédaction, voici le sujet. » → R1-R3, R5-R8 acquis.
- **R4 (précisé)** — Dans « Préparer le sujet », Paul relit un point de la grille à la fois (ses 4 niveaux et leurs sous-niveaux sur un écran), corrige dans la case, puis « ✓ Je valide ce point » ; un compteur « n points validés sur N ». Il peut corriger des copies avant d'avoir tout validé ; la fiche d'un élève ne sort pas tant qu'une phrase qu'elle porte n'est pas validée (le bouton grisé dit lesquelles). Une phrase modifiée par Paul est validée d'office.
- **R9 (corrigé)** — Pas de maquette à part : l'app actuelle est la maquette. Un seul mandat, dans cet ordre : ① l'intégration au site (la classe du site, l'enregistrement au site, le mode test, l'accès par le panneau prof et la séance), la grille Dugain rangée sur le site ; ② « Nouveau sujet » et la relecture (R3, R4) ; ③ la lettre, premier nouveau sujet. Captures de l'app intégrée pour le promeus.
- **R10 — la lettre, premier nouveau sujet** : la conscience écrit elle-même son JSON (le sujet de Paul, la grille Dugain pour modèle : mêmes trois critères, sur 40), Paul relit et valide dans l'app (R4). Squelette proposé :
  - Invention (16) : le personnage tenu — le front ou la maison, qui il est, depuis quand la séparation (4) ; les trois paragraphes — le concret, le plus dur, l'inquiétude pour l'autre (6) ; les lectures remobilisées — Jean Déléage et le chapitre (3) ; ce qu'on tait (3).
  - Organisation et énonciation (10) : les codes de la lettre — lieu, date, adresse, signature (3) ; la 1re personne, le destinataire présent, les temps (3) ; trente lignes (4).
  - Langue (14) : toutes les phrases complexes (2) ; les cinq architectures, chacune au moins une fois, valorisées au-delà (4) ; une modalisation par paragraphe et une litote (2) ; orthographe et grammaire, avec le compteur (4) ; lexique (2).

MEMO

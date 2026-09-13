# CADRAGE 4 · LA PRÉPARATION — l'écran où Paul construit, les objets et leurs gardes, le prompt d'injection
*Conscience n°12, écrit le 13/09/2026 à partir des tours 82 à 92 du transcript C12, de la lecture du moteur (préparation) et des documents du consultant du chapitre « Poésie et peinture » (25-26/08). Soumis à Paul dans la conversation ; déposé au sas seulement après son mot. Complète les cadrages 1, 2 et 3.*

## 0 · Ce que c'est
- 0.1 **La préparation** est l'écran où Paul construit une séance diapo par diapo — dans l'atelier, onglet Déroulé, régime « préparation ». Elle sert aussi à **jouer en avance** (la répétition) : voir ce que la classe verra, sans rien écrire (cadrage 1, 2.5).
- 0.2 Elle produit **la trame** : la donnée d'une séance (ses diapos, leurs blocs, leurs notions, leurs heures prévues, leurs notes), enregistrée automatiquement au hub, lue par la classe telle qu'elle est le jour où une diapo est montrée (cadrage 1, 8.2).
- 0.3 Trois portes y mènent : l'atelier (Modifier → Déroulé), le prompt d'injection (une instance produit un JSON que « Compléter le chapitre » importe), et le versement depuis une clôture (cadrage 1, 8.4).
- 0.4 Ce qui plantait vient d'ici : le découpage automatique des diapos, le zoom qui coupe, le curseur qui saute (registre n°12 · 03). **Rien de tout ça ne revient** : une diapo ne se coupe que par le geste de Paul (5.7 du cadrage 1).

## 1 · L'écran
- 1.1 **Trois colonnes, comme le pilotage** : à gauche la colonne du chapitre (séances, diapos, l'heure prévue de chacune, les frontières d'heure) ; au centre la diapo en cours, à sa taille de tableau, avec sous elle les notes présentateur ; à droite ce que la diapo déclare (ses notions, sa légende de surlignage, son heure, sa durée) et ce que le site en dit (« trop pleine », « trop dense », « fiche non liée »).
- 1.2 **Le plan de travail se zoome** : Ctrl + molette rapproche ou éloigne la diapo (cadrage 1, 5.6) ; rien autour d'elle — pas de zone hors cadre (tour 39).
- 1.3 **Écrire, c'est écrire dans la diapo** : un clic dans un bloc, on tape ; les blocs sont empilés et se montent / descendent ; la mise en page à deux colonnes est un choix de la diapo (cadrage 1, 4.5).
- 1.4 **Le clic droit complet** (tour 32) : sur une diapo — ouvrir · dupliquer · insérer une diapo après · monter · descendre · supprimer · envoyer vers une autre séance ; sur un bloc — supprimer · dupliquer · monter · descendre · copier · coller ici · couper · taille (petit / normal / grand) ; sur une étape ou une réponse — supprimer · dupliquer · monter · descendre ; sur une image — supprimer ; la sélection par cadre (copier, couper, supprimer, « à écrire » sur le lot). Un bloc collé est « neuf » tant qu'il n'a pas été montré.
- 1.5 **La répétition** : ▶ Jouer en avance — le même écran que le pilotage, la fenêtre du tableau possible, **rien n'est écrit, ni journal, ni copie, ni cours actif**, aucune garde, aucun gel (2.5).
- 1.6 **L'enregistrement est automatique** (repris tel quel), vidé au changement de séance ; une modification en préparation vaut pour tout ce qui n'a pas encore été montré à une classe (8.2).
- 1.7 **Le vocabulaire** : diapo (pas écran), bloc, séance, heure, chapitre ; « item » et « écran » ne se ressemblent plus dans l'interface (une confusion signalée par le consultant).

## 2 · Ce qu'une diapo porte (la donnée)
- 2.1 Son identité (`eid`, jamais changée), son titre (`act`), sa durée prévue, **son heure prévue** (H1, H2… — proposée d'après les durées, déplacée d'un geste ; cadrage 1, 6.1), ses blocs dans l'ordre, ses notions et compétences (cadrage 3), **ses notes présentateur** (cadrage 1, 10.1), **sa légende de surlignage** facultative (tour 88), **son rôle** s'il est spécial : *bilan* (unique, dernier de la séance) ou *réactivation* (première de son heure).
- 2.2 Par heure de la séance : **le travail à faire prévu** (le spiralaire — cadrage 1, 7.2), proposé au T-5 de cette heure.
- 2.3 Ce qu'elle ne porte plus : `rev`, `vues`, père / fils / suite, le cran de zoom.

## 3 · Les objets et leurs gardes (règle de Paul, 13/09 : un objet ne peut pas être détourné par une instance)
- 3.1 **Chaque type d'objet a un contrat** — ce qu'il doit contenir, ce qu'il ne peut pas être — **tenu à trois endroits qui disent la même chose** : le prompt d'injection (§5), la validation du JSON à l'import (refus avec le motif, jamais un contournement silencieux), et l'éditeur (le formulaire ne propose que ce que le contrat permet).
- 3.2 **Les objets** :
  - **texte** — nouveau (dette 29 du consultant) : un titre, quelques lignes ; pour dire, pas pour faire ;
  - **consigne** — à l'impératif, des étapes ; ce que l'élève fait ;
  - **question** — jamais vide ; ses réponses attendues à part, jamais dévoilées avec la question ; les réponses des élèves s'y écrivent en classe (cadrage 1, 4.2) ;
  - **fiche** — **seulement liée à une feuille du chapitre** (fiche notion, méthode, grammaire, révision) ; sinon refus ; une fiche s'agrandit d'un clic, s'annote en classe par la classe ;
  - **schéma** — cinq formes (carte, frise, arbre, cycle, tableau), chacune avec le format de sa source ; **échelle « plein » par défaut**, réglable dans la donnée (tour 88) ; **se dévoile élément par élément** dans l'ordre de la donnée (tour 92) ; « trop dense » seulement si, à pleine surface, le texte passe sous le plancher lisible ;
  - **image** — une adresse relative dans mjpc-medias (jamais complète : le site ajoute la base), une légende ; les marques posées en préparation, dévoilées une par une en classe ;
  - **page** — nouveau (dette 30), **dernier recours** (§4) : une adresse HTML dans mjpc-medias, un nombre d'étapes déclaré, le contrat de pilotage ;
  - **bilan** — unique, toujours dernier de la séance ; **réactivation** — première de son heure (cadrage 1, 6.1, 6.4).
- 3.3 **Quand aucun objet ne convient, l'instance — ou Paul — déclare un manque d'objet** : dans le site, une ligne visible « objet à ajouter à l'éditeur : … », avec le chapitre qui l'attend. Personne ne tord un objet pour en faire un autre (règle 23 du consultant).

## 4 · La page HTML — épisodique, jamais une béquille (Paul, 13/09)
- 4.1 **L'objet natif d'abord.** Une page HTML ne se fait que si aucun objet ne convient, après un manque déclaré (3.3), et sur le mot de Paul — qui choisit entre attendre l'objet (un mandat court sur l'éditeur) et une page pour cette fois. Sinon Paul est « IA-dépendant ad vitam ».
- 4.2 **Le contrat de pilotage** : la page annonce son nombre d'étapes au chargement, reçoit du pilotage « étape suivante / précédente / aller à n », répond où elle en est. **Les flèches de Paul la font avancer** (tour 90) ; l'état du tableau devient « page + étape » ; le gel la fige, le journal note son étape, l'ordi de classe la charge lui-même et reçoit l'étape.
- 4.3 **Une page sans contrat est identifiée et une alerte le dit**, dans le site, avec la marche à suivre et **le texte prêt à copier** à donner à l'instance pour qu'elle ajoute le contrat. Jamais un silence, jamais « traitée comme fixe » sans le dire.
- 4.4 **Chaque page compte** : le site affiche « n pages HTML dans tes chapitres, n objets manquants à l'éditeur » ; ce compteur doit tendre vers zéro. Une page n'est jamais un modèle pour la suivante.
- 4.5 La forme d'une page (un seul fichier, aucune ressource extérieure, le cadre 16:9 sans débordement ni défilement à toutes les tailles, la loi de taille, fond clair et texte sombre, rien à la souris, pas de commentaire méta, « M. Meney ») et les preuves exigées (rendu à quatre tailles et à chaque étape, test automatique anti-débordement, captures regardées, empreinte en ligne comparée) sont écrites dans la section HTML du prompt (§5).
- 4.6 **Montrer un document du chapitre en classe** (geste imprévu, tour 89) : ⋯ → la liste des documents de la séance (Drive, PDF, page), un clic le projette ; publication journalisée ; le récit dit « on a projeté *…* ». Une page prévue est un bloc `page` ; un document imprévu est ce geste.

## 5 · Le prompt d'injection — un contrat, en trois sections (au hub, composé par le site)
- 5.1 **Les objets et leurs gardes** (§3) écrits pour une instance qui n'a pas le moteur sous les yeux (mot de Paul, 26/08) : chaque type, son contrat, les cinq formes de schéma et leurs formats, l'adresse relative des images, la fiche liée ou refusée, les notions dans la taxonomie, l'heure prévue de chaque diapo, le travail à faire prévu par heure, la légende de surlignage.
- 5.2 **La création de HTML** — qui commence par « **n'en fais pas** » : cherche l'objet, déclare le manque, attends le mot de Paul ; puis, si Paul l'a décidé, le contrat de pilotage, la forme, les preuves, la déclaration (4.5).
- 5.3 **Le mode de travail** : cadrage avant JSON (règle existante, rappelée au moment technique) ; un manque du site ne se contourne jamais sans le mot de Paul ; le JSON s'injecte par « Compléter le chapitre » ; pas de commentaire méta dans les trames ; « M. Meney ».
- 5.4 Le prompt, la validation et l'éditeur sont maintenus ensemble : un objet ajouté à l'éditeur entre dans le prompt et dans la validation le même jour, sinon la livraison n'est pas close.

## 6 · Le mode d'emploi vit dans le site
- 6.1 Chaque alerte porte sa marche à suivre (règle du 25/08) ; chaque geste de l'éditeur porte son infobulle, dans les mots de Paul (règle du 03/09) ; une page « Comment on ajoute un objet » existe dans le panneau prof, pour Paul dans trois mois et pour une instance neuve. Rien ne suppose d'aller lire GitHub.

## 7 · Ce qui est repris tel quel (à citer dans le mandat)
La colonne du chapitre (sommaire natif, plier / déplier, aller à une diapo) · l'enregistrement automatique et son vidage au changement de séance · l'identité des diapos · le presse-papier de blocs et la sélection par cadre · les cinq formes de schéma et leurs formats · la fiche agrandie et son annotation · les marques sur image · le rappel · l'import « Compléter le chapitre » et sa validation (identifiants, `aLier`, notions dans la taxonomie) · les prompts au hub (`site/atelier/prompts`) composés par le site · la comparaison copie / trame et le versement à la clôture.

## 8 · Ce qui tombe
Le découpage automatique (scission, refusion, `degorge`), le zoom-texte de préparation, `rev` / `vues`, le père / fils / suite, l'onglet « Documents » du moteur (la liste des fiches posées — couvert par le volet et le clic), le bloc `consigne` employé faute de mieux.

## 9 · Ce qui reste à faire avant le mandat
La maquette manipulable de la préparation (une livraison, jouée par Paul) · la rédaction du prompt d'injection en trois sections (une pièce, relue par Paul, déposée au hub par le mandat) · les attendus au hub (préalable du cadrage 3, mandat à part).

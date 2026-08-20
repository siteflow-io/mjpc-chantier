# MANDAT — INTÉGRATION DU DÉROULÉ, TEMPS 1 (LE SOCLE)
*Conscience n°7, 20/08/2026. Exécutant dédié. À lire APRÈS `DEROULE/CADRAGE-INTEGRATION.md` (l'architecture complète y est ; ce mandat n'en exécute que le Temps 1). Rien ne se promeut : livraison au sas, audit, puis Paul dit « promeus ».*

## BASES (md5 vérifiés — re-vérifie à la commande avant de toucher)
- Production : `index.html` **8.57.1** · md5 `54da80f2847d865b7f1aea5ad3fcb984` · c'est TA base d'intégration.
- Maquette moteur : `DEROULE/deroule86.html` · md5 `2ffada12d20d30ab719d20238cd1eef8` · éprouvée 86 fois par Paul, AUCUNE faille — tu ne la corriges pas, tu l'intègres.
- Référentiel : `taxonomie_atelier.json` (dépôt prod + nœud Firebase `/taxonomie`) — ne pas stocker, lire.

## PÉRIMÈTRE STRICT DU TEMPS 1
Tu livres LE SOCLE, et rien des temps 2-3. Interdits ce temps-ci : saisie en direct, participation, « qui a participé », tableau autonome, écran d'attente, récit/Relecture, papier du chapitre, sort d'une séance close. Si tu es tenté d'en coder, STOP et signale-le.

## CE QUE TU LIVRES

### ① LE BLOC SCELLÉ, PRÉFIXÉ (règle cardinale)
Le déroulé entre dans `index.html` comme un **bloc isolé**, jamais fondu. Tout son JS et son CSS sont préfixés pour qu'aucun nom ne se confonde avec MJPC :
- Renomme les globales du déroulé en collision : `lire cour fin mk t titre` → `dr_lire dr_cour dr_fin dr_mk dr_t dr_titre` (et vérifie qu'aucune autre globale du déroulé ne heurte une globale de la 8.57.1 — refais le relevé, ne te fie pas à cette liste).
- Préfixe toutes ses classes CSS : `.on .feuille .liste .sel .titre .type .page` et les autres → `.dr-on .dr-feuille …`. AUCUNE règle CSS du déroulé ne doit s'appliquer hors du déroulé, AUCUNE règle MJPC ne doit teindre le déroulé.
- Une seule PORTE d'entrée depuis MJPC vers le bloc déroulé. Aucune fonction MJPC existante n'est modifiée dans son corps (sauf le branchement d'onglet ci-dessous, minimal).

### ② LES QUATRE ONGLETS
Au-dessus de l'éditeur de chapitre, une barre : **Structure · Déroulé · Relecture · Papier**. Au T1, seuls **Structure** et **Déroulé** ont un contenu ; **Relecture** et **Papier** existent comme onglets mais affichent un « à venir » sobre (remplis aux T3). L'onglet actif se retient. Le routage se fait par identifiant stable (`data-vue`), jamais par le texte du libellé (piège de l'accent de « Déroulé »).

### ③ STRUCTURE = L'ÉDITEUR DE CHAPITRE ACTUEL, REBRANCHÉ
`atEditerChapitre(level,chnum)` / `atEditerChapitreRendre` deviennent le contenu de l'onglet **Structure**. Rien de leur logique ne change : mêmes champs (titre, entrée, compétences majeures/mineures, problématique, objectifs), mêmes séances, mêmes items, même aperçu papier à droite. Seul l'emballage (l'onglet + la colonne-arbre commune) est neuf. `AT.flux='chapitre'` reste la vérité de cet écran.

### ④ LA COLONNE-ARBRE À TROIS NIVEAUX (le gros morceau)
UNE seule colonne gauche, COMMUNE à Structure et à Déroulé, codée UNE fois, lue aux deux endroits. Trois niveaux :
- **chapitre** en haut (titre, compte de séances) ;
- **séances repliables** (intertitres) — TOUTES visibles ;
- **écrans/items de la SEULE séance dépliée** (l'active), horodatés.
Clic sur une séance repliée → elle se déplie, la précédente se replie. La maquette ne connaît aujourd'hui qu'UNE séance en dur (`ECRANS`, décor Séance 3) : le cœur du T1 est de lui apprendre à **enjamber les séances** — la colonne lit le chapitre entier (via le même chemin que `ed2Sommaire`/`atSeances`), pas un décor. Dans Structure elle montre les items ; dans Déroulé elle montre les écrans ; même arbre, même source.

### ⑤ L'ÉDITEUR D'ÉCRANS + PROJECTION SIMPLE + CHRONO
Le moteur vivant de `deroule86` (`ong`, `va(n)`, `dessineEcran`, `devoile`, gel LOCAL, chrono), rebranché sur un VRAI chapitre au lieu du décor `ECRANS` en dur. Projection SIMPLE seulement : le déroulé montre l'écran, le gel fige localement. PAS de tableau autonome (T2).

### ⑥ LES MODALES
Les 2 `confirm()` natifs de la maquette → modales MJPC (`_modaleConfirme`, déjà dans le socle). Aucun `confirm()`/`alert()`/`prompt()` natif ne subsiste dans le bloc déroulé.

### ⑦ LES DEUX COUCHES, POSÉES (pas remplies)
Structure de données à deux niveaux, en place dès le T1 pour ne pas refondre au T2 :
- **trame** au niveau (`…/seances/<s>/deroule` — la préparation, une fois pour la 3e) ;
- **séance jouée** par classe (la copie horodatée au démarrage).
Au T1 : le mécanisme de copie-au-démarrage EXISTE et une classe peut jouer ; mais AUCUNE donnée de jeu n'est encore écrite (ni participation, ni récit — T2/T3). Prouve que jouer avec la classe A puis la classe B crée deux copies distinctes, et qu'une modif de trame après coup n'écrase pas une séance déjà jouée.

### ⑧ LES CROCHETS (posés, vides)
- Un écran/activité peut **déclarer ses notions/compétences** (champ lisant la taxo Atelier) — le champ existe, l'exploitation (alertes) est pour plus tard.
- Une séance jouée **retient sa classe**. Rien d'autre.

## INTOUCHÉS (barrière dure)
L'éditeur de FEUILLE (`atNouvelleFeuille`/`edEditerFeuille`, 121 composantes) et TOUT ce qui touche les prompts (`atNouvelleFeuilleIA`, `ATELIER_PROMPT_SEED`, `/site/atelier/prompts`, `at-ia-tpl`) : **ne pas toucher** — chantier d'après. `published` jamais écrit sans geste de Paul. L'écran élève ne change pas. Le rendu d'impression (`atelierPageHTML`, `atelierDocumentHTML`) ne change pas. Le socle MJPC-CORE ne change pas.

## PREUVES EXIGÉES (sans elles, pas d'audit)
1. **Relevé de collisions REFAIT** contre la 8.57.1 après préfixage : tableau prouvant qu'aucune globale ni classe CSS du déroulé ne heurte MJPC (les deux sens).
2. **Les 4 familles** sur ta livraison vs 8.57.1 : rien de retiré/renommé côté MJPC ne laisse d'orphelin (fonctions, variables, CSS, ids DOM).
3. **Banc sur ÉCRANS RENDUS** (pas le boot) : Structure ouverte sur le chapitre 3e/10 (arbre déplié, champs, items) · Déroulé ouvert (arbre commun, écran projeté, gel local, chrono) · bascule entre les 4 onglets · dépliage d'une séance (l'autre se replie) · deux classes → deux copies. Captures de CHAQUE écran, comparées à la 8.57.1 côte à côte pour Structure (doit être identique à l'éditeur actuel, seul l'emballage change).
4. **Dual parser** : `node --check` + acorn ES2020, verts.
5. **Diff** : les zones MJPC touchées se limitent au branchement d'onglet + l'insertion du bloc scellé ; liste-les.

## LIVRAISON
`T1/index.html` (écrase), `T1/RAPPORT.md`, captures dans `T1/tests/`, le relevé de collisions post-préfixage. Prouve ta livraison en relisant le sas (taille + sha). **STOP après : audit avant tout.** Termine par le cahier des dettes puis MEMO.

MEMO

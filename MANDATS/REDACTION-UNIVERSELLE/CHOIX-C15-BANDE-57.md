# Bande 57 — choix préparés, non validés

31/10/2026. Les propositions ci-dessous ne sont pas codées et ne deviennent pas acquises par leur dépôt. Le correctif du tableau, point 59, avance indépendamment.

## 51 — Garder une faute proposée

Proposition précise : **F garde la faute proposée et avance**. Le bouton « Garder cette faute » fait la même chose. Entrée et Espace avancent sans ajouter ni retirer une faute déjà gardée ; Retour revient à la position précédente ; ⇧R bascule entre les arrêts et le mot par mot en gardant la copie et la position. G et L ne sont pas employés en rédaction.

Pourquoi F : dans les gestionnaires relus, hors des champs de saisie, elle n'est affectée ni en dictée rapide ni dans les scans. Elle ne remplace donc pas une touche commune.

| Source relue | Fonction mesurée |
| --- | --- |
| Production `correction_dictee.html`, blob `3b9c4e98719d011fcd5e142bb2df30b9eadcb54a`, lignes 5023–5033 | G, L, M, /, I, C et A posent leurs types d'erreurs ; Entrée et Espace appellent fastSkip, Retour appelle fastBack ; F n'est pas traitée |
| Même fichier, ligne 5031 et fastClear | Suppr retire l'erreur du mot et avance ; ne pas recopier seulement sa suppression en oubliant le déplacement |
| `maquette/scan.js`, fonction scClavier, ligne 376 | Entrée et Espace répondent oui puis avancent ; N répond non ; Retour revient ; Suppr enlève la marque choisie ; F n'est pas traitée |
| Même fichier | Aucune touche actuelle ne pose une faute ; ne pas prétendre reprendre un raccourci existant |
| Production `correction_dictee.html`, ligne 1290 | tokenize reste la fonction à emprunter telle quelle, pas à réécrire |

L'affectation F attend l'accord de Paul. Les raccourcis restent inactifs dans une saisie ; les fonctions communes doivent être rejouées dans leur contexte réel au banc de 57. Cette lecture du code n'est pas un nouveau test de toutes les touches de dictée dans le navigateur.

## Anciennes fautes — rattachement explicite proposé

Une ancienne marque porte sa page, ses coordonnées et sa bonne forme éventuelle. Elle ne porte pas l'identité du mot recopié. Le recalage des nouvelles lignes ne rend pas ce mot reconnaissable avec certitude. La proportion des lettres ne suffit pas ; aucune promesse de dédoublonnage automatique.

Proposition à valider : conserver les anciennes fautes visibles ; devant une proposition qui correspond à une ancienne faute, Paul choisit explicitement cette marque pour lui ajouter le lien au texte. L'identité, la place, la bonne forme, le temps et la note de l'ancienne correction restent inchangés. Une proposition refusée n'efface aucune ancienne marque. Aucun rapprochement, fusion ou déplacement automatique.

Avant d'ajouter des fautes à une copie déjà corrigée, la bande doit signaler qu'elle porte des anciennes marques et permettre ce choix explicite. Les cas sans correspondance prouvée restent visibles ; ils ne sont ni masqués ni déclarés « sans doublon ». Le coût de ce geste et les 30 clics restent à mesurer.

Cette règle attend aussi Paul. Le mandat impose de la cadrer avant l'usage de la bande sur les anciennes corrections. En attendant, le travail indépendant du point 59 continue.

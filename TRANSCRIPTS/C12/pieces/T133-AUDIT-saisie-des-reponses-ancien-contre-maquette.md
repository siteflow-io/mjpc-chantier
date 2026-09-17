# AUDIT — la saisie d'une réponse d'élève : l'ancien déroulé contre la maquette (17/09/2026)
*Sur la capture de Paul (« cette espèce de double saisie bizarre sur mon pilotage ») : mesuré dans le code de l'ancien (moteur.html L648-656 le rendu, L1441-1446 `ligne()`, L207 le CSS) et dans la maquette v9c.6.*

## Ce que fait l'ancien
- **La ligne de réponse EST le champ de saisie.** Chaque réponse est une ligne `.rep` faite de deux cases modifiables : les initiales (`.ini`, qui affiche « ·· » tant qu'elle est vide) et le texte (`.dit`, qui affiche « … » tant qu'il est vide). Il n'y a **aucun champ séparé** sous la liste.
- **Il y a toujours une dernière ligne vide en attente**, au bout de la liste ; on écrit dedans.
- **Entrée dans le texte** : la ligne devient « montrée » (la classe la voit), **une nouvelle ligne vide s'ajoute**, et le curseur va aux initiales de cette nouvelle ligne (`ligne()` L1441-1446).
- **Double-clic sur les initiales** : bascule « reformulée » (le gris-bleu).
- **La classe ne voit jamais une ligne vide**, et ne voit une ligne que lorsqu'elle est montrée (dans l'ancien, à Entrée — la maquette, elle, envoie la frappe à la lettre : cadrage 1, 4.2, voulu par Paul le 9/09 ; c'est le seul point où la maquette diffère à dessein).

## Ce que fait la maquette v9c.6 — et pourquoi Paul voit double
- La maquette rend les réponses en lignes `.rep` **et, en dessous, un champ d'ajout séparé** (initiales + texte) qui n'existe pas dans l'ancien.
- Dès la première lettre tapée dans ce champ, la réponse est créée et rendue **comme une ligne** (pour partir au tableau au fil de la frappe) — **et le champ garde le texte** tant que Paul n'a pas fait Entrée. Résultat au pilotage : la même réponse deux fois, la ligne et le champ. C'est la « double saisie » de la capture. Le tableau, lui, ne montre que la ligne : c'est pour ça que le doublon du tableau a disparu (corrigé au tour 130) mais pas celui du pilotage.
- Verdict : **✘ recopié en moins bien** — une forme inventée (le champ séparé) à la place de celle de l'ancien (la ligne est le champ).

## Ce qu'il faut faire (v9c.7, sur le mot de Paul)
Reprendre la forme de l'ancien telle quelle : les lignes de réponse modifiables (initiales « ·· » et texte « … »), toujours une ligne vide en attente, Entrée = ligne suivante et curseur aux initiales, double-clic sur les initiales = reformulée, la classe ne voit jamais une ligne vide ; et garder le comportement cadré : la frappe part au tableau à la lettre (la ligne en cours apparaît au tableau dès la première lettre, jamais avant). Plus de champ séparé. Les initiales tapées se résolvent par la même recherche que le VIF (anagramme, préfixe, prénom), comme aujourd'hui.

## Ce qui ne change pas
Le clic droit sur une réponse (aller à l'élève, corriger, supprimer), la prise de parole créée par la réponse, le récit.

# COMPLÉMENT — MAQUETTE p8 · livraison p8-5c : la répétition propre, les notes de présentateur, la mise en forme
*Conscience n°13, 11/10/2026 (C13, tours 33 à 42). Se lit après le complément p8-5. Règle les dettes n°13 · 9, 10 et 11. Validé par Paul le 11/10 (tour 44), déposé.*

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul, 11/10 : « il me faut quelque chose de propre » (la répétition) ; « les notes de présentateur correspondant à celles de ppt […] quand j'affiche qqchose au tableau, je dois avoir le morceau de note correspondant qui s'affiche dans ma partie note. Ça me permet ainsi de séquencer aussi pour moi » ; « un bouton pour le surlignage, un bouton pour le texte couleur, et quand je clique dessus, je sélectionne la couleur que je veux. comme dans word quoi ».
En classe : Paul répète sa séance sans que rien ne cache ses boutons ; ses notes avancent avec ce qu'il dévoile ; il surligne ou colore un mot au tableau ou dans ses notes avec le même geste.

## CE QUE PAUL A TRANCHÉ (sur captures — elles font foi, geste par geste)
- `TRANSCRIPTS/C13/pieces/T35-apres-proposition.png` — la répétition (tour 36, « ok c'est bon »).
- `TRANSCRIPTS/C13/pieces/T38-notes-proposition.png` — les notes de présentateur (tour 39, « Ok. »).
- `TRANSCRIPTS/C13/pieces/T41-couleurs-ecran.png` et `T41-couleurs-zoom.png` — la mise en forme (tour 42, « Voilà. »).
- Les montages `T35-montage-bandeau.mjs`, `T38-montage-notes.mjs`, `T41-montage-couleurs.mjs` donnent le CSS et la structure exacts de ces captures : tu les reprends, tu ne réinventes pas.

## L'AUDIT DE FAISABILITÉ (conscience n°13, sur la maquette p8-5)
- **La répétition** : `lancerRepetition` ajoute `.rep-bandeau` (6 px, fixe, en haut) et `.rep-etat` (pastille fixe, centrée) par-dessus `.haut` ; `arreterRepetition` les retire. Mesuré : à 1280 px, la pastille recouvre « ⧉ Tableau ». Faisable tel quel : on ne pose plus rien par-dessus, on change `.haut`.
- **Les notes** : `#notesd` n'est qu'un affichage de `DATA.notes[cle()]` (ligne « Notes pour cette diapo », `tout()`), jamais écrit par aucun geste. Le découpage par élément existe déjà : `elements(e)` (ordre de dévoilement, index `k`) et `etatDiapo().nDev` ; chaque élément porte `data-p="bi.ei"` (stable quand on insère ou coupe). Faisable en s'accrochant à `data-p`.
- **La mise en forme** : `surligner(couleur)` prend la sélection, cherche `closest('#mur [data-p]')`, pousse `{ p, txt, couleur }` dans `etatDiapo().surl`, journalise, et `surligne()` pose `<mark>` au rendu. Sur une sélection dans les notes, `closest` échoue : **rien, sans message** (banc `pieces/T39-banc-outils.mjs`, 19 ça va sur 20). Faisable en donnant une seconde cible au même mécanisme et en ajoutant la couleur du texte à côté.
- **Ce que le banc T39 a établi** : ▶/◀, ✦, ✍, ⊞, les 4 surligneurs et ✕ au tableau, 🔍, ❄, 👥, ⋯ + chrono, le curseur, la garde — tous font ce que leur infobulle dit. Ils ne doivent pas bouger.

## LA LIVRAISON p8-5c
Branche `deroule/p8-5c`, partie de `deroule/p8-5`. Jamais `main`.

### A. La répétition, propre (dette n°13 · 9)
1. Plus de `.rep-bandeau` ni de `.rep-etat`. Pendant la répétition, `.haut` porte une classe (préfixée, cherchée dans le gabarit avant d'être écrite) : fond doré sourd, filet doré en bas, comme sur la capture T35.
2. Devant les onglets, « RÉPÉTITION · » en doré. Après l'horloge (`#heure`) : « · répét. mm:ss · diapo X, dévoilée Y / Z » (le chrono et le repère existants, déplacés, mêmes infobulles).
3. « Fin de l'heure » (`#bfin`) disparaît pendant la répétition ; à sa place, « ■ Arrêter » (`#rep-stop`, même infobulle qu'aujourd'hui). « ⧉ Tableau » et « 🖥 Écran 2 » restent et fonctionnent (Paul s'en sert pour vérifier ce que montrerait le tableau).
4. À l'arrêt, tout revient : entête normal, « Fin de l'heure » à sa place, rien ne reste.
5. Jamais de `display` en ligne : les boutons se montrent et se cachent par la classe de `.haut`.

### B. Les notes de présentateur (dette n°13 · 10)
6. **La donnée.** `DATA.notes[eid]` devient une liste de paragraphes `{ p, html }` : `p` = le `data-p` de l'élément de la diapo auquel le paragraphe est accroché (`null` = à l'arrivée sur la diapo, repère ⌂) ; `html` = le texte du paragraphe, avec sa mise en forme (voir C), assaini à l'enregistrement : seuls `<mark>` et `<span style="color:…">` passent, tout le reste devient du texte. Une note d'aujourd'hui (chaîne) se lit comme un seul paragraphe sans ancre. Un élément supprimé rend sa note ⌂ : jamais perdue. « Couper la diapo ici » : chaque paragraphe suit son élément.
7. **En classe et en répétition (lecture).** Le panneau montre tous les paragraphes, dans l'ordre, chacun avec son repère en marge : le rang de dévoilement de son élément (le `k` de `elements(e)` + 1), ou ⌂. Le paragraphe **vif** est le dernier dont l'ancre est dévoilée (⌂ compte comme dévoilé) : plus clair, un peu plus gros, un trait doré à gauche ; ce qui précède s'estompe (opacité), ce qui suit reste lisible en gris. Le panneau fait défiler pour garder le vif visible (`scrollIntoView`, `block: 'nearest'`), sans jamais prendre le focus. ◀ remonte le vif. Aucun journal, aucune copie : les notes sont à Paul.
8. **Dans l'atelier (écriture).** Le même panneau, éditable. Entrée = un nouveau paragraphe, accroché à l'élément de la diapo où était le curseur juste avant de descendre dans les notes (tu poses `S.dernierElementNote` au focus de tout `[data-p]` du mur ; s'il n'y en a pas, ⌂). Le repère en marge est un bouton : clic → la liste des éléments de la diapo (texte tronqué à 40 caractères, dans l'ordre de dévoilement) + « à l'arrivée sur la diapo » ; choisir ré-accroche. Enregistrement instantané (« ✔ enregistré », comme les blocs). Collage = texte brut. Infobulle du panneau, pour Paul : ce qu'il fait et ce que coûte le repère.
9. **Heure lancée** : l'écriture est ouverte aussi, directement dans la trame (les notes ne sont pas vues par la classe : pas de copie, pas de versement). **En répétition : lecture seule**, parce que tout ce qui est joué en répétition est oublié à l'arrêt (p8-4) — l'infobulle le dit.
10. **Le redessin** ne touche jamais le paragraphe qui a le focus et garde le défilement (règle déjà payée).

### C. La mise en forme, comme dans Word (dette n°13 · 11)
11. Les cinq `.coul` (quatre carrés et ✕) sont remplacés par **deux boutons ronds** à leur place : `#bsurl` (« ab » sur fond jaune, « surligner ») et `#btxt` (« A », « couleur du texte »), chacun avec un trait de sa couleur courante en dessous (capture T41). Clic → une palette sous le bouton : quatre pastilles + ✕ « sans » ; choisir applique à la sélection, devient la couleur courante, ferme la palette. Échap ou clic ailleurs ferme. **Ctrl+H reste le jaune direct.** La barre doit tenir : « ▶ Dévoiler » et le compteur restent dans le cadre à 1280 px (mesuré sur la capture : 872 px pour un cadre de 944).
12. **Les couleurs.** Surligneur : jaune `#ffe94a`, vert `#b6f0c2`, rose `#ffc9d6`, bleu `#bcd9ff` (celles d'aujourd'hui), fond plein, texte sombre dedans — identique au tableau et dans les notes. Texte : rouge, vert, bleu, or, **une teinte par fond** — tableau (crème) : `#c0392b`, `#1e7d45`, `#1f5fbf`, `#b8860b` ; notes et boutons (sombre) : `#ff7b6b`, `#7ddc9a`, `#8ab8ff`, `#e3b94e`. La donnée garde le nom de la couleur (`rouge`), jamais la valeur : c'est le rendu qui choisit la teinte.
13. **La cible suit la sélection.** Dans `#mur [data-p]` : le mécanisme existant (`etatDiapo().surl`, journal `surligne`, rendu par `surligne()`), étendu à la couleur du texte avec la même structure (`{ p, txt, couleur }` dans `etatDiapo().coulTxt`, journal `couleur-texte`, rendu par un `<span>`). C'est un geste de classe : la classe le voit au tableau, il vit dans l'état de l'heure, comme le surlignage d'aujourd'hui. Dans `#notesd` : la mise en forme entre dans le `html` du paragraphe (point 6), enregistrée dans la trame, **ni journal ni tableau**. ✕ retire l'un et l'autre. Une sélection ailleurs : le message existant (« sélectionne d'abord le texte… »), jamais le silence.
14. Les infobulles des deux boutons disent les deux cibles, pour Paul.

### D. Les bancs par le geste (`test-p8-5c.mjs`), chacun compté
15. **Répétition** : « Jouer en avance » → aucun élément `position: fixed` ajouté au document ; à 1280 et à 1920 px, `elementFromPoint` au centre de « ⧉ Tableau », « 🖥 Écran 2 » et « ■ Arrêter » rend le bouton lui-même ; « Fin de l'heure » absent ; clic « ⧉ Tableau » bascule la vue comme hors répétition ; « ■ Arrêter » → entête normal, « Fin de l'heure » revenu. Captures d'écran entier avant / après, à 1280.
16. **Notes, lecture** : une diapo à six éléments, des notes accrochées à ⌂, 1, 3, 5, 6 (posées par l'atelier, par le geste) ; heure lancée, ▶ ×3 → le vif est le paragraphe 3, les deux d'avant estompés, les deux d'après lisibles, le repère 3 doré ; ◀ → le vif redevient 1 ; aucune entrée de journal, la copie de la classe inchangée.
17. **Notes, écriture** : atelier, clic dans l'étape 3 de la diapo, clic dans les notes, taper un paragraphe, Entrée → accroché à l'étape 3 (repère 3) ; clic sur le repère, choisir l'étape 5 → repère 5 ; recharger l'état (comme pour les blocs) → les paragraphes et leurs ancres sont là ; « Couper la diapo ici » après l'étape 3 → le paragraphe suit dans la diapo « (suite) » ; supprimer l'étape 5 → son paragraphe devient ⌂, texte intact ; taper pendant le redessin choisi → rien n'est effacé, le curseur reste.
18. **Mise en forme, tableau** : sélection à la souris dans l'étape 1, clic « ab », jaune → `<mark>` au mur, entrée `surligne` au journal ; clic « A », rouge → `<span>` à la teinte tableau ; ✕ → retirés ; Ctrl+H → jaune direct ; la fenêtre du tableau montre la même chose.
19. **Mise en forme, notes** : sélection à la souris dans un paragraphe, « ab » vert → `<mark>` dans la note, la trame a changé, le journal n'a pas bougé, le mur n'a pas bougé ; « A » bleu → `<span>` à la teinte notes ; ✕ → retirés.
20. **La barre tient** : à 1280 px, `#bdev` et `#compte` dans le cadre de `.scene`, et la barre est moins large qu'avant (mesurée avant / après).
21. **Non-régression des outils** : les 20 gestes de `pieces/T39-banc-outils.mjs` rejoués, 20 ça va (le vingtième — surligner dans les notes — passe désormais).
22. Les bancs de p8-5 rejoués, puis le banc unique à 0.
23. `LIVRAISONS/DEROULE/p8-5c/` : la NOTE, les bancs, les sorties, des captures d'écran entier (répétition avant / après ; notes en classe à 3 / 6 ; atelier en écriture avec la liste des ancres ouverte ; palette ouverte), le gabarit, le patch `patch-p8-5c.py`, la maquette, les empreintes. **Puis tu t'arrêtes.**

## CE QUE TU NE TOUCHES PAS
- Le récit et la copie de la classe (dette n°13 · 8, complément p8-5b à venir) ; le curseur « texte au tableau » (n°13 · 12, à trancher) ; `correction_dictee.html`.

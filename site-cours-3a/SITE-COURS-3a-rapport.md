# SITE-COURS-3a — RAPPORT D'EXÉCUTION : les diapositives deviennent du texte
**01/08 · exécutant → conscience · checklist à preuves**

## 1. md5
doctrine du site `bbc34f10fd772eb16b0268cafaebe3f5` (XIII.3 appliquée) · DISPOSITIF `6546b8b2ff84397e2549da60eac184d2` · DOCTRINE `c92d863d0fad9714a756d5552c97f3be` · CHANTIER `e5722295b1c9c06936e639ce22c94c71` · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · journal `a3381e47e89cd75aa6f0aa6c4af98ce2` · canon `d89d456389f598c7a731cf894a60a4cb` (1.4.0).
**Base** re-téléchargée à l'instant de l'édition : 626 088 o · `3f68b6a46cfe2ce9f012af0f02f3cb2f` (8.12.1) → **livré 655 836 o · `2849b68059f6a554ce32368d170a0f5c` · 8.13.0**.

## 2. « Ajouter un produit = une entrée de plus » — troisième fois, prouvée
**Les 12 fonctions de la mécanique sont identiques à l'octet** (`atIAChargerPrompt`, `atIACopier`, `atIAModifier`, `atIAEnregistrerTpl`, `atIAValider`, `atIAApercu`, `atIAAppliquer`, `atIAInjecterNeuve`, `atIARemplacer`, `atIAVerifier`, `chValiderChapitre`, `chInventaire`), et **les deux produits précédents sont intacts dans le seed**. **Diff : 8 hunks, +425, −3 lignes** — la pastille, `CH_KINDS` (une valeur ajoutée), et la ligne du bouton d'accès. `atPromptTexte` gagne **une ligne** pour le jeton `@@BLOCS@@`, sans toucher aux deux autres produits. **Le socle n'a pas été touché** (il n'est pas contigu, et le canon 1.4.0 y était déjà) : canon ↔ embarqué **31/31 à l'octet**.

## 3. Le gabarit — 11 blocs (10 du cadrage + un, signalé)
`titre`, `sous_titre`, **`paragraphe`**, `puces`, `numeros`, `definition`, `exemple`, `citation`, `tableau`, `note`, `image`. **Écart au cadrage assumé** : j'ai ajouté `paragraphe` — un texte courant sans puces est fréquent dans un cours, et sans lui l'IA aurait détourné `note` ou `exemple` pour le rendre. Onze blocs, **générés** : un bloc factice ajouté à `DIAPO_BLOCS` paraît dans le prompt sans qu'aucune liste soit retouchée.
**L'IA ne choisit jamais la forme** : `style`, `couleur`, `police`, `taille`, `classe`, `align`, `css`, `html`… — **un champ de forme est refusé EN ÉTANT NOMMÉ** (« contient un réglage de mise en forme (« style ») : la forme est décidée par le site, retire-le »).
**L'alternative textuelle est obligatoire sur `image`** : sans elle, refus nommé — « elle sera invisible pour qui ne voit pas ». **Le tableau au-delà de 3 colonnes est refusé** avec la conduite à tenir (« coupe-le en deux »).

## 4. La relecture — l'écriture reste fermée
Chaque bloc s'affiche **dans sa forme finale ET avec son texte brut en regard**, une case « relu » par bloc, un compteur, **et le bouton d'enregistrement est `disabled` tant que tout n'est pas relu** (vérifié à l'écran : 11 cases, bouton fermé, « 0 bloc(s) relu(s) sur 11 »). Le raccourci « tout marquer relu » passe par une confirmation qui dit « c'est toi qui réponds de ce qui sera publié » — **Paul assume, il n'est pas piégé**. Le texte brut d'un bloc `image` **montre son alternative textuelle**, ce que personne ne relit jamais.

## 5. LE RENDU MESURÉ — la raison d'être du morceau
**390 px : les 11 types de blocs rendus, ZÉRO débordement horizontal** (`scrollWidth` ≤ 392, aucun élément dont le bord droit dépasse 391). **Le tableau bascule en paires libellé/valeur** : `td` en `display:block`, l'en-tête porté par `::before` avec `content:attr(data-ent)` — **mesuré dans le navigateur**, pas supposé. **Le texte est du vrai texte** : ni `canvas`, ni `svg`, ni image de texte — sélectionnable, cherchable, lisible par un lecteur d'écran. **Aucune dépendance externe** dans le rendu (la seule URL est la vignette Drive d'une image que Paul a déposée). **Impression vérifiée deux fois** : les règles `@media print` existent (barre du viewer masquée, `break-inside:avoid` sur chaque diapositive), **et le rendu sous `emulateMediaType('print')` le confirme** — la barre disparaît, le document tient dans la page. Capture mobile : `img-k02.png`.

## 6. Le stockage, la liaison, le viewer
**`/site/diaporamas/<id>`** : l'atelier est l'établi, le site est la maison — un diaporama rangé dans l'atelier pourrait être supprimé comme un brouillon et casserait les items qui le désignent.
**Un diaporama devient un item de séance sans que le format d'item change** : `{kind:'diaporama', source:'firebase_app', ref:'<id>'}` — les trois champs existaient. **`CH_SOURCES` est inchangé** ; **`CH_KINDS` gagne une valeur**, ce qui permet au **prompt maître de chapitre de désigner un diaporama** — vérifié, comme demandé, et c'est ce qui relie ce morceau au précédent.
**Le viewer élève est livré** (branche dans `openItem`, patron `gallery`) : sans lui, le morceau aurait produit des données que rien ne lit. Écriture **par verdict**, **archive AVANT remplacement** (arch@0 < doc@1, `{_meta,data}` portant l'ancien), **abandon si l'archive échoue** (« rien n'a été remplacé », diaporama intact), et **rien à archiver la première fois**.

## 7. Les preuves
**Banc mémoire 28/28** · **banc navigateur 9/9** — dont **PORTÉE** : les 19 fonctions posées vérifiées présentes sur `window` dans la page réelle (règle du 01/08), overlay des règles neutralisé.
**Statique** : double parseur script par script **VERT** · canon ↔ embarqué **31/31** · **0 fonction supprimée**, 3 modifiées (`atPromptTexte`, `atIARendre`, `openItem` — le périmètre exact), 17 ajoutées · **diff 0 retrait hors motifs** (`diffsc3a-bilan.json`) · **ancre par contexte** : `fin § PROMPT MAÎTRE DE CHAPITRE` existe **deux fois** (CSS @87157, JS @505789), le piège de 2c s'est représenté et a été évité.
**Symptômes instruits** : `/manifestes` et `/presence` au journal → **pré-existants** (appels dans la base), écartés par preuve ; une assertion de banc annonçait 12 blocs pour 11 → **c'était le banc, corrigé**, et l'écart au cadrage est signalé au §3.

## 8. DÉCLARATION DE COUVERTURE
**Testé** : tout le §7, plus le rendu et l'impression mesurés au navigateur. **Non testé, déclaré** : le hub réel (interceptions ; **aucune écriture réelle**) · une vraie IA face à de vraies captures — **c'est la limite majeure : la qualité de la transcription n'est pas prouvable au banc, seule la relecture de Paul la garantit** · l'impression papier réelle (le rendu `print` est vérifié, pas le spouleur) · Chrome Windows · un lecteur d'écran réel (le texte est du texte, mais aucun NVDA/VoiceOver n'a été passé dessus) · le rendu d'une image Drive réelle (vignette stubbée au banc) · la recette de Paul.

## 9. Dettes et signalements
· **Le redimensionnement des images à l'envoi** (doctrine XIII.2) : **hors périmètre, signalé** — un diaporama qui renvoie vers des images Drive lourdes garderait le défaut que ce morceau corrige pour le texte.
· Le bloc `paragraphe` ajouté au-delà du cadrage (§3).
· Un diaporama n'a **pas encore d'écran de gestion** (lister, renommer, supprimer les diaporamas existants) : on écrit et on relie, on ne parcourt pas. À prévoir si Paul en accumule.
· Les deux graphies de classe : **toujours signalées, non corrigées** (la cause doit être trouvée dans le code avant normalisation).

## 10. Livraison
`site-cours-3a/` : `index.staging.html` · ce rapport · le cadrage · `bancsc3a-memoire.js` + `bancsc3a-verdicts.json` (28) · `bancsc3a-nav.js` + `bancsc3a-nav-verdicts.json` (9) + `bancsc3a-reseau.json` · `diffsc3a-bilan.json` · `assemble-sc3a.py` + `assemble-sc3a-b.py` · captures `img-k01…k03.png` (dont **k02 = le rendu mobile 390 px**). Bit à bit vérifié après téléversement.

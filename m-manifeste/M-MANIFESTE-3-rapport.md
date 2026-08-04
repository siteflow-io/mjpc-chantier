# M-MANIFESTE-3 — l'overlay tient sa promesse
**02/08 · exécutant → conscience n°4**

## 1. Ce que j'ai lu — et ce que je déclare
**Je suis l'exécutant qui a livré M-MANIFESTE, M-MANIFESTE-2 et les captures** : j'ai donc l'historique de ces morceaux en contexte direct, et non par une recherche de conversation. **Je n'ai pas utilisé d'outil de recherche dans les conversations passées** — je le dis plutôt que de laisser croire à une lecture que je n'ai pas faite.
**Lu au sas** (`m-manifeste/`) : les six rapports (`-rapport`, `-rapport-final`, `-rapport-adresses`, `-mesure-undefined`, `-atesc`, `-rapport-bug-atesc`, `-CAPTURES-rapport`, `-2-rapport`), `_textes_relus.txt`, les bancs et leurs verdicts.
**Base** : `index.staging.html` **703 534 o · `8b50dde6e35f569e44b3de5da9c0b15d` · 8.21.0** → **livré 707 335 o · `635cbb870f86f96e4a744981be43fa16` · 8.22.0 · parse VERT**.

## 2. ① LE PIÈGE EST LEVÉ — mesuré à 390 px ET 360 px
**Cause mesurée** : la boîte n'avait pas de hauteur bornée. Neuf apps × trois lignes poussaient le pied hors de l'écran.
**Remède** : `.fi-ov-boite` en `flex column`, **`max-height: calc(100dvh - 2rem)`** (avec repli `100vh`), une **tête fixe**, un **corps `overflow-y:auto`** (`min-height:0`, indispensable en flex), un **pied ancré** portant les boutons.
| mesure | 390 px | 360 px |
|---|---|---|
| hauteur de la boîte / fenêtre | **884 ≤ 900** | **884 ≤ 900** |
| la liste défile | **oui** | oui |
| bouton « Mettre à jour » visible | **oui, 44 px** | **oui, 44 px** |
| débordement horizontal | **0** | **0** |
**Et liste défilée EN BAS** : **les 9 apps atteignables**, la dernière visible, **et le bouton toujours à l'écran**.

## 3. ② L'OVERLAY BLOQUE VRAIMENT
**« Fermer » n'existe pas au départ** : il n'est plus rendu désactivé, **il est CRÉÉ par le clic** (`fi-ov-fermer-hote`). Prouvé : avant clic, `document.getElementById('fi-ov-fermer')` rend `null`.
**Après le clic, il apparaît toujours** — quel que soit le résultat : si une app échoue, **Paul n'est pas enfermé**. Prouvé.
**Ni Échap ni la croix du panneau ne contournent** : événement `keydown`/`keyup` Échap envoyé, croix du panneau prof cliquée — **le voile reste**. Prouvé. *Raison : le voile est un élément à part, `position:fixed`, `z-index:10000`, hors du panneau ; aucun gestionnaire de fermeture ne l'atteint.*

## 4. ③ LA SOURCE DU REPLI, TROUVÉE ET CORRIGÉE
**Cause exacte** : `fichesLignes` faisait `nom: (e && e.app && e.app.nom) || id`. **Quand aucune fiche n'existe au hub, `e` est `null`** — le nom l'était donc aussi, et l'identifiant servait de repli. Le compte rendu, lui, affichait le bon nom parce qu'il **lit le fichier de l'app**.
**Correction** : `fichesLireNom(id)` **lit `MJPC_APP.nom` à la source** (même extraction textuelle que le bouton, avec la même mise à l'écart du gabarit commenté), et `fichesCompleterNoms` complète **avant l'affichage**, overlay **et** tableau. Un cache évite de retélécharger.
**Prouvé** : `reecriture_bb4e` n'apparaît plus ; **« Réécriture brevet blanc 4e »** s'affiche.

## 5. ④ et ⑤ LES TEXTES — avant → après, relus mot à mot
| où | avant | après |
|---|---|---|
| app jamais publiée | « **date illisible** · jamais publiée » | « **jamais publiée** » — rien d'autre. `fichesEtat` ne rend plus de date du tout (`date:null, jamais:true`), donc rien ne peut être « illisible » |
| raison, app périmée | « Sa description est **peut-être** périmée : l'IA travaille avec une information ancienne sans que rien ne le montre. » | « **Sa fiche date d'une version antérieure du socle : le prompt de chapitre travaille avec cette version-là, pas avec celle qui tourne.** » |
| raison, app jamais publiée | même phrase, inadaptée | « **Aucune fiche n'existe pour cette application : le prompt de chapitre ignore qu'elle existe, et ne te la proposera jamais.** » |
**Pourquoi ce choix** : le socle déclaré **tranche** — 1.1.0 face à 1.6.0 n'est pas un « peut-être ». La phrase dit **ce qui est mesuré et ce que cela produit**, sans dramatiser (« pas avec celle qui tourne ») ni atténuer.
**RELECTURE DÉCLARÉE** : titre, sous-titre, les neuf raisons rendues à l'écran, les libellés des deux boutons, le compte rendu, les deux bilans, l'infobulle. **Aucune autre correction.**

## 6. LES SEPT CAPTURES — livrées au sas et en conversation
| capture | ce qu'elle prouve |
|---|---|
| `cap3-1-390-haut.png` | **390 px, boutons VISIBLES**, liste en haut — le piège est levé |
| `cap3-2-390-bas.png` | **liste défilée en bas** : les 9 apps atteignables, **bouton toujours là** — et sur cette seule image, les trois autres corrections se voient : nom lisible, « jamais publiée » seul, raison affirmée |
| `cap3-3-360.png` | **360 px** : mêmes garanties |
| `cap3-4-avant-clic.png` | **aucun « Fermer »** |
| `cap3-5-apres-clic.png` | **« Fermer » présent**, compte rendu visible |
| `cap3-6-jamais-publiee.png` | la ligne de `reecriture_bb4e` avec **son nom lisible** |
| `cap3-7-tout-a-jour.png` | tout à jour → **aucun overlay** |

## 7. Les invariants
**Parse VERT** · **0 fonction supprimée** · diff **8 hunks**, les retraits étant exclusivement les lignes réécrites des cinq corrections (`diff3-bilan.json`) · **le socle n'a pas été touché** (non contigu) · ancres **par contexte** · **9 fiches publiées au clic** sans ouvrir aucune app · **journal réseau : aucune écriture hors `/manifestes`** et mécanismes pré-existants · **aucune écriture au hub réel**.

## 8. DÉCLARATION DE COUVERTURE
**Testé** : les 16 verdicts, en navigateur réel, hub simulé, **overlay des règles Firebase neutralisé**.
**NON TESTÉ, DÉCLARÉ** : le hub réel · **la durée réelle des ~6 Mo sur la connexion de Paul** (fichiers servis en local) · **un vrai téléphone** (viewport émulé à 390 et 360 px, pas d'appareil physique — `100dvh` se comporte différemment avec la barre d'adresse mobile, et **je ne peux pas le mesurer ici**) · Chrome Windows · l'impression.
**Ce que cela veut dire** : le piège est levé **sur viewport émulé**. Sur un vrai téléphone, la barre d'adresse rétractable peut modifier `dvh` — **le pied restera ancré** (c'est le principe du flex), mais **je ne l'ai pas vu de mes yeux sur un appareil**.

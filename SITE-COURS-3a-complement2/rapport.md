# SITE-COURS-3a-COMPLÉMENT-2 — RAPPORT DE LIVRAISON
**Déposer l'image d'un clic.**
Exécutant [C5-3ac2], sous conscience n°5 · 05/08/2026. Circuit allégé, un seul objet.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.32.0) | 808 951 o | `ad1f72c4d64f3cca3de31606289726f2` |
| LIVRÉ (8.33.0) | 812 700 o | `438c279647a249614c503e7b78fa6989` |

Double parseur : **VERT** sur base et livré. 10 éditions, chaîne reproductible.
**Jeton** : celui du mandat portait une recopie fautive (« BNvS0 ») — le jeton de session, inchangé, a été gardé, comme le mandat le prévoyait.

## 2 · Le geste

Dans les rendus **côté prof** — le viewer (« Ouvrir » de Mes diaporamas, distingué de l'élève par `TRACK.eleve.is_prof` : le même viewer sert les deux, seul le prof reçoit le geste) et **l'écran de relecture du convertisseur** — l'emplacement « 🖼 À déposer — <description> » devient un **bouton** (bordure pointillée dorée, aide « déposer l'image (lien Drive) »). Clic → modale sobre du patron **`_modalePrompt`** réutilisé (« Image du diaporama » / « Coller le lien Google Drive de l'image », [Annuler] [Valider] — le mandat proposait [Afficher] : le bouton [Valider] du patron existant a été gardé tel quel, à la main de Paul d'en demander la variante) → extraction de l'id → **écriture fine de la seule ref du bloc** → rendu rafraîchi : l'image (thumbnail Drive w1000) avec sa légende. Image déjà posée : **« Changer l'image »**, bouton discret en coin de figure (invisible au repos, révélé au survol/focus ; au tactile — `hover:none` — présent en léger, opacité .75). Même modale, même écriture.

**LE chemin d'écriture (exhaustif — rien d'autre n'est écrit)** : `/site/diaporamas/<id>/diapos/<n>/blocs/<k>/ref` — indices réels des tableaux `diapos`/`blocs`, prouvé sur un bloc **au milieu** du JSON (diapo 2, bloc 2 → `/diapos/1/blocs/1/ref`). Seul l'**id extrait** est stocké, jamais le lien collé.

**Au convertisseur** (le diaporama n'a pas encore d'id en base) : le dépôt pose la ref dans le **JSON local** et re-rend la relecture — **aucune écriture réseau** ; l'écrivain reste l'Enregistrement existant avec toutes ses gardes (relecture complète, corbeille). Déclaré comme la seule lecture cohérente du mandat pour cet écran.

**Côté élève : rien** — l'emplacement reste le `div` inerte d'origine (aucun bouton, clic sans effet, prouvé).

## 3 · L'extraction : UNE seule dans l'application

Le patron d'extraction vivait dans `linkModalApplyUrl` (items Drive des séances). Son cœur Drive est extrait en **`driveExtraireId(texte)`** — lien `/file/d/…`, lien de partage `?id=…`, id nu (≥20 caractères) → le même id ; sinon `null` — et `linkModalApplyUrl` l'appelle désormais (le cas `external` y reste, hors du cœur partagé). **C'est LA réutilisation exigée par le mandat** : la décroissance de `linkModalApplyUrl` (715→506 o) est cette extraction, aucune logique perdue (relecture attestée). Lien non-Drive au dépôt d'image : refus doux « Ce lien ne vient pas de Google Drive. » **sans écriture**.

## 4 · Défaut préexistant révélé par le banc (corrigé, déclaré)

La modale d'information `.at-modale` (z-index 7400) passait **sous** le viewer de diaporama `.dp-viewer` (9600) : le refus doux — et tout message d'échec — aurait été invisible à l'écran. Corrigé : `.at-modale` à **9700** (une modale domine ; commentaire [C5-3ac2] en place). C'est l'unique retouche hors du périmètre nominal, condition de visibilité du refus exigé.

## 5 · Fonctions — inventaire complet (0 supprimée)

**2 ajoutées** : `driveExtraireId` 279 o · `diapoDeposerImage` 1 147 o. **5 modifiées** (relues entières) :

| fonction | avant | après | objet |
|---|---|---|---|
| linkModalApplyUrl | 715 | 506 | **extraction du cœur Drive (LA réutilisation — seule décroissance, déclarée)** |
| diapoRendreBloc | 2 241 | 2 925 | signature `(b, pose)` ; forme image : bouton-emplacement / « Changer l'image » côté prof, div inerte sinon |
| diapoRendre | 410 | 459 | `(dp, ctx)` propage `{mode, dp, n, k}` |
| diapoRelecture | 2 263 | 2 294 | passe `{mode:'memoire', n, k}` au rendu des blocs |
| openDiaporamaById | 947 | 1 151 | prof → `{mode:'base', dp:ref}`, élève → `null` |

CSS : `dp-img-btn` (emplacement cliquable), `dp-dep-aide`, `dp-fig-change` (+`@media (hover:none)`), `.at-modale` z-index (§4). Pastille 8.33.0.

## 6 · Textes soumis à Paul

Modale : « Image du diaporama » / « Coller le lien Google Drive de l'image » / [Annuler] [Valider] (patron gardé, §2) · aide de l'emplacement : « déposer l'image (lien Drive) » · « Changer l'image » · refus : « Ce lien ne vient pas de Google Drive. » · échec : « ⚠ L'image n'a pas pu s'enregistrer — rien n'a changé. »

## 7 · Écarts et observations (déclarés)

1. Mode « mémoire » au convertisseur (§2) : pas d'id en base encore → JSON local, l'écrivain reste Enregistrer.
2. Le z-index de `.at-modale` (§4) : défaut préexistant, corrigé car il rendait le refus doux invisible.
3. Amenées de banc : `SECU.valide` · la relecture du convertisseur alimentée directement (le dépôt lui-même joué au clic réel) · P5 en contexte navigateur **mobile** (`is_mobile`, `has_touch`) pour que `hover:none` soit réel · la ref re-vidée au magasin avant le parcours élève.
4. Sur les captures, l'image s'affiche en icône brisée + alt : l'id Drive du banc est fictif et le réseau Drive est hors magasin — le `src` exact et la légende sont vérifiés par verdict.
5. Environnement : une écriture concurrente transitoire a été détectée puis neutralisée en repassant par une transaction unique vérifiée par relecture (grep du z-index livré, liste des 10 éditions).

## 8 · Banc de preuve — **BILAN : 14/14 VERTS** (run unique)

Playwright + Chromium, chemin réel au clic, hub intercepté, **aucune écriture réelle** ; P6 : rien d'écrit hors `*/ref`, `published` jamais (ni corps ni chemin).

```
VERT  · P1 · l'emplacement « À déposer » est un bouton cliquable (avec son aide), côté prof
VERT  · P1 · la modale « Coller le lien Google Drive de l'image » s'ouvre
VERT  · P1 · UNE écriture fine au chemin exact du bloc (diapo 2, bloc 2 → /diapos/1/blocs/1/ref), l'ID seul
VERT  · P1 · le rendu se rafraîchit : l'image (thumbnail Drive) avec sa légende, et le geste discret « Changer l'image »
VERT  · P2 · « Changer l'image » + lien de partage ?id= : la MÊME ref réécrite (même chemin, id 2)
VERT  · P2 · un id nu (≥20) est accepté tel quel
VERT  · P2 · lien non-Drive : refus doux, AUCUNE écriture
VERT  · P2 · l'annulation n'écrit rien
VERT  · P3 · au convertisseur : le JSON local reçoit la ref, AUCUNE écriture réseau (l'écrivain reste Enregistrer), le rendu se rafraîchit
VERT  · P4 · côté élève : l'emplacement « À déposer » est un simple div inerte (aucun bouton, aucun geste)
VERT  · P4 · le clic élève ne fait rien (pas de modale, pas d'écriture)
VERT  · P5 · 390 : l'emplacement-bouton est là
VERT  · P5 · 390 : dépôt complet (écriture fine) et « Changer l'image » reste perceptible au tactile
VERT  · P6 · sur tout le banc : rien d'écrit hors la ref des blocs visés, `published` jamais
=== BILAN 3ac2 : 14/14 VERTS ===
```

## 9 · Captures (au sas, `captures/`)

`p1_emplacement_cliquable` · `p1_modale_lien` · `p1_image_affichee` · `p2_refus_doux` · `p5_modale_390` · `p5_image_390`.

---
**STOP.** Livraison au sas complète : `SITE-COURS-3a-complement2/index.html` + `rapport.md` + 6 captures. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-3ac2]*

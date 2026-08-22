# RAPPORT — LOT « FEUILLE HORS NIVEAUX + EXPORTS + IMPRESSION » (candidat v8.59.0)
Exécutant PONT · 22/08/2026 · livraison au sas `PONT/`

## ⓪ LA BASE
- Re-téléchargée depuis la PRODUCTION immédiatement avant édition (règle du 29/07).
- md5 mesuré : `daae7ec2d7f6e5c99ce958ceb53724e2` = **attendu** (v8.58.1, 1 364 446 o). Aucune divergence, édition autorisée.
- Livré : `PONT/index.staging-8.59.0.html` — **1 375 085 o**, md5 `fc74ff90c5557dd3632b5cdcac9f2b27` (déclaré ci-dessous après scellement).

## ① LE DIFF INTÉGRAL, CLASSÉ PAR LIVRABLE — 28 zones, zéro suppression hors mandat
Chaque zone porte son marqueur `[PONT-A]`…`[PONT-F]` dans le code.

**A · Export chapitre (2 zones)** — fonctions neuves `atChSlug` (196 o) + `atChExporter` (478 o) posées avant `atEditerChapitreRendre` ; bouton au libellé EXACT « Exporter chapitre pour relecture et cohérence finale » à côté de « 🖨 Imprimer » de l'éditeur. JSON = `{niveau, numero, exporteLe, chapitre:<copie intégrale>}` → fichier `chapitre-<niveau>-<slug>.json` via `_saveJSON` (helper existant, « Enregistrer sous » puis repli téléchargement).

**B · Export feuille (2 zones)** — fonction neuve `atExporterDoc` (1 593 o) + bouton « Exporter » par carte. Format d'injection STRICT : `{titre, produit, cases, valeurs, blocs}` — rien d'autre au niveau racine (prouvé au banc : clés = blocs·cases·produit·titre·valeurs, champs interdits absents). Les composantes d'ADRESSE (`chapitre`, `seance` — `adresse:true`) sont EXCLUES : une adresse est une référence de niveau et `atIAValiderAdresse` la refuserait sur feuille nue — le niveau ne renaît pas, par construction. Les cases s'émettent dans **l'ordre canonique du schéma** (deux feuilles identiques → même JSON à l'octet) ; les cases à `defaut:true` non cochées s'émettent en `false` explicite (sinon la recréation sur `atDocNeuf` porterait `date_seance`/`date_edition`/`seance` en trop). Fichier `<slug-du-titre>.json`.

**C · Vérité des dépôts (5 zones)** — `atStatutFeuille` RÉÉCRITE (2 417 → 1 744 o — **réduction mandatée** : le mécanisme `depot` + « (l'item n'y est plus) » meurt) : parcours `edFeuilleDepots` sur `['3e','4e','5e','6e']` chargés → « Déposée dans : 3e › Ch.1 › S.1 · 4e › Ch.1 › S.1 » ou « Aucun dépôt » ; suffixes d'envoi conservés ; périmètre déclaré (« (5e injoignable) » / « en cours de vérification »). `atRendreListe` charge les quatre niveaux (lecture seule, jamais de boucle sur `charge`/`enCours`/`erreur`). `atSupprimerDoc` : l'avertissement bascule sur les lieux réels (tous). `atOuvrirDoc` : l'envoi se lit d'après `base.envoi||base.depot` (la note n'est plus qu'un repli de cache).

**D · Ancrage contextuel (11 zones)** — utilitaires neufs `atCtxDeChapitre` (525 o) + `atCtxAffichage` (494 o). Dans `atelierDocumentHTML` : `niveau`/`classeNom`/`chapitreAff`/`seanceAff` se résolvent de `options.ctxVue` D'ABORD ; le rattachement gravé = repli (feuille nue). Porteurs du contexte : `openItem` → `openAtelierItem(ref,titre,ctxVue)` (niveau/chapitre/séance de la NAVIGATION + classe de l'élève connecté via `_eleveClasse()`) ; `ed2FeuilleHtml(doc,ref)` (fil du chapitre — 2 appels adaptés) ; `ed2Imprimer` « Cette feuille » ; `ed2ImprimerChapitre` (séance par document) ; `ed2OuvrirOnglet`. L'aperçu/impression de l'atelier (feuille nue) reste au repli — conforme au mandat.

**E · Garde déclarée et journalisée (2 zones)** — dans `atIAValider` : `rattachement`/`niveau` → erreur nommée BLOQUANTE, visible dans le rapport d'injection (« Le champ « niveau » n'a pas sa place dans une feuille… ») + `console.warn` `[atelier] injection refusée…`. Filet dans `atIAAppliquer` : présence de ces champs journalisée quel que soit le chemin d'appel — jamais une ignorance silencieuse. Le flux CHAPITRE n'est pas touché : `o.niveau` au niveau racine d'un JSON de chapitre reste exigé (L8003) — la garde vit sur les JSON de FEUILLE.

**F · Impression groupée (5 zones)** — `AT_IMP_SEL` + `atImpCocher`/`atImpToutCocher`/`atImpBarreMaj`/`atImprimerSelection` ; barre « Tout cocher » + « 🖨 Imprimer la sélection (n) » + case « À imprimer » par carte (patron maison sélection → aperçu → print) ; CSS `.at-imp-*` (cibles ≥ 44 px sur la barre). Liasse = `atelierDocumentHTML` par fiche sous `atelierCharteCSS`, `<title>` = titre de la fiche (unique) ou **« Fiches MJPC — <date fr> »** (groupée) ; `document.title` de l'hôte posé pendant l'impression et restauré après — mécanisme ajouté aussi à `atImprimer` existant (impression unique, non cassée : chemin iframe inchangé, seul le titre s'ajoute).

`APP_VERSION` → `8.59.0`. CSS : un seul bloc ajouté (`.at-imp-*`), aucune règle existante touchée.

## ② TAILLES DES FONCTIONS (règle du 04/08) — aucune perte non déclarée
16 fonctions modifiées : toutes AGRANDIES ou inchangées, SAUF `atStatutFeuille` (2 417 → 1 744 o), réduction **exigée par le mandat** (le mécanisme depot/« l'item n'y est plus » disparaît). 9 fonctions neuves (A : 2 · B : 1 · D : 2 · F : 4). Zéro fonction supprimée.

## ③ PARSEURS
`node --check` + acorn ES2020 sur les 2 scripts extraits : **verts**.

## ④ BANCS — harnais navigateur en LECTURE SEULE STRICTE
Toute requête non-GET bloquée ET listée : **`ecrituresBloquees: []`** — aucune écriture tentée, aucun GET réseau non plus (banc hors ligne, données injectées). `pageerrors: []` sur tous les parcours. Fichiers : `PONT/tests/banc_pont.js`, `banc_pont2.js`.

| Parcours exigé | Résultat |
|---|---|
| Export chapitre — contenu vérifié | `chapitre-3e-poesie-et-peinture.json` ; niveau/numero/titre exacts ; séances complètes avec items ✓ |
| Export feuille — round-trip via le prompt | validation `atIAValider` = 0 erreur ; `atIAAppliquer(atDocNeuf(), o)` → ré-export **IDENTIQUE À L'OCTET** (`JSON.stringify` égaux) ✓ |
| Carte multi-dépôts | feuille déposée en 3e ET 4e (note `depot` volontairement MENTEUSE dans le banc) → « Déposée dans : 3e › Ch.1 › S.1 · 4e › Ch.1 › S.1 » — la note n'est plus lue ✓ ; item 4e retiré → **seule la 3e reste** ✓ |
| En-tête contextuel | même feuille (gravée 3e + « Chapitre 9 — FAUX ») rendue avec `ctxVue` 4e → **NIVEAU 4e · Chapitre 1 — La ville · Séance 1 — Entrer en ville**, le faux gravé ABSENT ; feuille nue → repli 3e/« Poésie et peinture » ✓ |
| Garde | JSON avec `niveau` puis avec `rattachement` → refus NOMMÉ visible dans le rapport d'injection + 2 lignes `console.warn` captées ✓ |
| Impression groupée | « Tout cocher » → barre « (2) » ; liasse : les DEUX fiches présentes ; `<title>` groupé « Fiches MJPC — 22/08/2026 » ; `document.title` posé PENDANT et RESTAURÉ après ; impression unique : titre de la fiche ✓ |

## ⑤ CAPTURES (d'office, desktop ET 390 px — toutes REGARDÉES avant livraison)
`PONT/tests/cap-*.png` — données de banc (aucune donnée réelle) :
- `cap-desktop-1-liste` / `cap-390-1-liste` : « Mes feuilles » — barre d'impression, cases « À imprimer », bouton « Exporter », carte multi-dépôts « 3e › Ch.1 › S.1 · 4e › Ch.1 › S.1 » et carte « Aucun dépôt » ; tout atteignable à 390 px.
- `cap-desktop-2-garde` / `cap-390-2-garde` : le refus à l'écran, rouge, nommé.
- `cap-desktop-3-liasse` / `cap-390-3-liasse` : la liasse — 1re fiche en EN-TÊTE 4e (la feuille est gravée 3e : la preuve visuelle de l'incident fondateur soldé).
- `cap-desktop-4-editeur` : le bouton « Exporter chapitre pour relecture et cohérence finale » dans l'éditeur, libellé exact.

## ⑥ QUESTIONS OUVERTES (pour la conscience / Paul)
1. **Titre du PDF groupé** : « Fiches MJPC — <date fr> » (ex. « Fiches MJPC — 22/08/2026 ») — format à valider (mandat ⑤).
2. **Reformulations perdues au round-trip** : le format d'injection (`blocs:[{id,valeurs}]`) ne porte pas les reformulations des consignes ; `atIAAppliquer` crée `reformulations:{}` vide. Une feuille dont les consignes portaient des variantes reformulées les PERD à la recréation. Étendre `atIAAppliquer`/le prompt aux reformulations = hors périmètre de ce LOT, à arbitrer avant la campagne d'extraction si des fiches en portent.
3. **`cases.seance:false` émis** : l'export éteint l'adresse née cochée par `atDocNeuf` (sans valeur — aucune référence de niveau). Nécessaire au round-trip exact ; à connaître pour le prompt.
4. **`S.<n>` = RANG d'affichage** (comportement d'`edFeuilleDepots`, existant) : « S.1 » désigne la 1re séance affichée, pas le numéro interne. Cohérent avec l'existant, signalé pour lecture des cartes.

## ⑦ INTOUCHÉS, prouvés
- `published` : jamais écrit (grep : aucune écriture nouvelle).
- Écritures Firebase des bancs : AUCUNE (liste vide, harnais strict).
- Flux chapitre (injection, `o.niveau` racine) : non modifié.
- Impression unique existante : chemin intact (seul `document.title` s'ajoute) ; `atIAVerifier`, `atelierPageHTML`, `edFeuilleDepots`, `atItemPointant`, `atAdresseLisible`, `atAdresseAffichage` : inchangés à l'octet.

## ⑧ CE QUI RESTE CÔTÉ PAUL (règle du 02/08)
Rien d'autre que l'audit puis, s'il vient, le « promeus » : aucun geste manuel n'est requis pour que le LOT produise son effet. Après promotion, les exports se testent en réel (les bancs stubent le téléchargement).

## COMPLÉMENT D AUDIT [PONT-B2] — reformulations au round-trip (conscience, 22/08)
Arbitrage Paul (question ouverte n°2) : les fiches EN ONT et EN AURONT → étendu.
· atExporterDoc émet reformulations (racine par composante + par bloc, si non vides,
  hors adresse/réservées) ; atIAAppliquer les applique aux deux étages.
· Question n°1 : titre PDF groupé « Fiches MJPC — <date> » VALIDÉ par Paul.
· Banc conscience : export les porte ✓ validation 0 erreur ✓ recréation les porte ✓
  ré-export identique à l octet ✓ interdits absents ✓ parseurs verts (2 blocs).
Nouveau md5 du candidat scellé au commit.

## COMPLÉMENT [PONT-C2] — regroupement des dépôts (Paul, 22/08)
Un même niveau›chapitre ne se répète plus : « 3e › Ch.1 › S.2 › S.5 › S.7 · 4e › Ch.1 › S.1 ».
Banc conscience vert (3 dépôts même chapitre regroupés, 1 seul « 3e › Ch.1 »), parseurs verts.

## PROMU — 22/08, promeus explicite de Paul (« promeus 8.59.0 »)
Base de prod vérifiée avant copie (8.58.1 attendue) · poussé · VÉRIFIÉ BIT À BIT.
Note : aucune fiche existante n est stratifiée (dit par Paul) — la renaissance É2-É3
n attend pas les strates, place réservée au schéma.

## MICROS POST-LOT — 22/08 soir
· 8.59.1 PROMUE : boucle du niveau vide (573 fetch/5s -> 0, la 4e atteignable apres purge).
· 8.59.2 PROMUE : porte IA sans ecriture (zero carcasse, bug vecu par Paul reproduit chemin
  B et solde) + scroll de l apercu conserve (re-render + reconstruction, pulse preserve) —
  le clic feuille->editeur utilisable. Verifiee bit a bit au commit.

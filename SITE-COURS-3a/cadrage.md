# SITE-COURS-3a — CADRAGE (TEMPS 1)
**L'atelier en trois éditeurs étanches : tableaux de bord, réouverture, liaison guidée.**
Exécutant SITE-COURS-3a, sous conscience n°5 · 05/08/2026

BASE mesurée : production 775 489 o, md5 `cde79195ffc264b15bbc6621a780c5ce`, pastille 8.30.0 — conforme (2d promu).

## 1 · L'enchevêtrement mesuré (état réel)

- L'accueil de l'atelier a déjà deux « portes » (`.at-portes`) : chapitre (chOuvrir) et feuille (atNouvelleFeuilleIA). Le **diaporama n'a pas de porte** : il vit en bouton dans l'écran IA **de la feuille** (l. 6483-6484), avec le bouton chapitre en doublon — c'est le mélange que Paul décrit : ces écrans se peignent tous dans `#at-zone`, chacun « revient » par des chemins différents (`chRendre` → `atIAOuvrir` ; `diapoRendreEcran` → ?), et un flux entamé au milieu d'une feuille ouverte hérite de son état.
- **Trois flux, trois racines réelles** : feuille = `atRendreEditeur`/`atIAOuvrir` · chapitre = `chOuvrir`→`chRendre` (226/1 538 o) · diaporama = `diapoOuvrir`→`diapoRendreEcran` (227 o + famille diapo* mesurée). Les mécanismes partagés (archive de prompts `atIAChargerPrompt`, modales, `secuLire/secuEcrire`, taxo) sont **déjà des fonctions communes** : l'étanchéité est une affaire d'ÉCRANS et de RETOURS, pas de tuyauterie — **je réutilise tout, je ne duplique rien**.

**Découpage proposé** : l'accueil passe à **trois portes franches** (« ✨ Nouvelle feuille » · « 📚 Nouveau chapitre » · « 🖼️ Nouveau diaporama à convertir ») + les trois tableaux de bord en dessous (onglets sobres « Mes feuilles · Mes chapitres · Mes diaporamas », patron des cartes existant). Chaque flux garde SA pile : un registre d'écran `AT.flux` ('feuille'|'chapitre'|'diapo') posé à l'entrée ; **tous les retours du flux ramènent à son point d'entrée** (l'éditeur de feuille pour le flux feuille, l'accueil pour chapitre/diapo) ; les boutons chapitre/diapo **sortent de l'écran IA de la feuille** (le bouton « Construire un chapitre » d'une feuille commencée disparaît : le chapitre n'y a plus rien à faire depuis que la porte existe — décision inverse de 2c consignée, c'était le sens de la note d'époque « les deux prompts vivent à l'entrée »).

## 2 · ② Mes chapitres

- **Cartes** : lecture par `atChargerChapitres` (cache 2b) — titre, ordre, publié/non (published du chapitre : LU seulement), N séances / N items, **compteur « N liaisons restantes »** = items `!ref` (badge « ⚠ Non lié » du site, même définition que `chInventaire.aLier` : `source==='firebase_app'&&!x.ref` élargie à tout item sans ref) — persiste, descend, s'apaise à zéro (« Tout est lié. »).
- **« Modifier » — l'ÉDITEUR DE CHAPITRE, en place** : un écran du flux chapitre qui édite l'objet réel `/site/<niv>/chapitres/<idx>` — champs : titre, entrée, compétences majeures/mineures (la déclaration 2e), et la liste des séances (titre, type, note élève, items : titre, sous-titre, kind, ordre — les champs simples que le panneau prof édite déjà pièce à pièce, réunis). Écritures **par chemin précis** (`secuEcrire` du champ modifié, patron des écritures fines de `chInjecterConfirme`) — PAS de copie parallèle, `published` jamais écrit. Le panneau prof reste vrai en face : passerelles « Voir dans le panneau prof » (ouvre l'arborescence au chapitre) et, dans `renderChapitres` admin, « Modifier dans l'atelier » sur chaque chapitre.
- **Suppression** : le patron feuille à DEUX boutons remplace l'actuel `deleteChapter` (mesuré : suppression directe **sans corbeille** aujourd'hui) — corbeille au format `_meta/data` existant (motif `site-chapitre`, celui de la voie « remplacer »), compte de contenu (« N séances, M items ») dans la modale, garde « prévenu, pas bloqué » si le chapitre est publié (« Des séances de ce chapitre sont publiées : les élèves les perdront. »).

## 3 · ③ Mes diaporamas

- **Cartes** depuis `/site/diaporamas` (une lecture par session, cache) : titre, niveau, **statut de liaison** calculé en croisant les chapitres du niveau (item `kind==='diaporama' && ref===id` — le branchement réel mesuré : `openItem` l. 3377) : « Lié dans <chapitre › séance> » / « Pas encore lié — invisible des élèves ».
- **« Ouvrir »** : `openDiaporamaById(id, titre)` réutilisé tel quel (le rendu que l'élève verra).
- **« Lier »** : petite modale du flux (chapitre → séance du niveau, deux menus, patron cascade) qui crée l'item par **`itemCreer`** (l'écrivain unique de 2c) avec `{kind:'diaporama', source:'firebase_app', ref:id, title:<titre>}`. Minimum de bout en bout voulu : liste + statut + liaison — pas de cascade d'adresse ni d'envoi versionné.
- **Suppression** : deux boutons (motif corbeille `site-diaporama`), garde si lié (« Cet écran est lié dans <adresse> : l'item du cours affichera "document plus disponible". ») — l'item mort suit le message doux existant d'`openDiaporamaById` (à vérifier au banc ; sinon le message doux du patron).

## 4 · La liaison guidée (dans le chapitre, côté panneau prof)

- **Pulse des boutons LIER** : dans `renderItem` admin, tout item `!ref` reçoit la classe pulsante (keyframe `edPulse`, déjà dans la page depuis 2d — une classe CSS `at-lier-pulse` réutilisant la keyframe) sur son bouton Lier ; s'éteint au re-rendu quand `ref` est posé.
- **LIER pré-orienté** : l'info d'outil **atterrit réellement dans `item.kind`** (mesuré : les items injectés gardent `kind` 'dictee'/'qcm'/… avec `source:'firebase_app'`, `ref:''` ; `chInventaire` lit `x.kind` comme outil). `openLinkModal` (1 630 o) charge 7 listes d'apps en blocs : quand `item.kind` correspond à un bloc, la modale **défile jusqu'à lui et le halo** (`atHalo` 2d) — sans kind exploitable, comportement actuel inchangé.
- **Garde d'atterrissage à l'injection** : le calcul des écritures de la voie « compléter » (appariement par titre, `parTitre` lowercase — le mécanisme qui a mélangé le chapitre 1) est **extrait** de `chInjecterConfirme` (7 739 o) en `chCalculerEcritures(voie, chaps)` → `{ecritures, appariees:[{titre, ajouts}], ajoutees:[titres], sommaire}` ; `chInjecterConfirme` l'appelle (décroissance déclarée, l'unique attendue — même méthode qu'`itemCreer`/`atEcartDetail`) ; la modale de `chInjecter` montre AVANT le clic, sur les données réelles : « Compléter » → « Séances appariées par titre (complétées en place) : … · Séances ajoutées : … » ; « Remplacer » → titre + « N séances, M items partent à la corbeille d'abord » ; « Garder à côté » → « Ajouté en position N ». La voie d'écriture reste l'existante, la garde s'insère avant.
- **Sommaire proposé** : après une injection réussie ou une édition de chapitre (éditeur ②), une proposition — « Le chapitre a changé — régénérer la feuille sommaire ? » [Régénérer] [Plus tard] — qui passe par l'écriture sommaire existante de la voie compléter (rang du sommaire mesuré dans `chInjecterConfirme`). Jamais automatique.

## 5 · Fonctions touchées (tailles de base mesurées)

Modifiées : atRendreListe 3 543 (accueil : 3 portes + onglets) · atIAOuvrir 129 + l'écran IA feuille (retrait des 2 boutons étrangers) · chRendre 1 538 & diapoRendreEcran (retours du flux) · chInjecter 1 182 (garde d'atterrissage) · chInjecterConfirme 7 739 (**extraction chCalculerEcritures — seule décroissance**) · renderItem 4 899 (pulse Lier + « Modifier dans l'atelier ») · renderChapitres (passerelle) · openLinkModal 1 630 (pré-orientation) · deleteChapter 485 (patron 2 boutons + corbeille). Nouvelles : atRendreChapitres (tableau ②) · atRendreDiapos (③) · atEditerChapitre (éditeur en place) · chCalculerEcritures · atChapitreLiaisons (compteur) · diapoStatutLiaison · diapoLierModal · atSupprimerChapitre · atSupprimerDiapo · atProposerSommaire. CSS : onglets, cartes ②③, pulse Lier. Pastille → 8.31.0. 0 supprimée.

## 6 · Textes soumis à Paul (extraits ; liste complète au rapport)

« N liaisons restantes » / « Tout est lié. » · « Pas encore lié — invisible des élèves » · gardes de suppression (publié / lié) · garde d'atterrissage (« Séances appariées par titre (complétées en place) : … ») · « Le chapitre a changé — régénérer la feuille sommaire ? » · portes : « Nouvelle feuille » / « Nouveau chapitre » / « Nouveau diaporama à convertir ».

## 7 · Plan de preuve

P1 étanchéité : chaque porte ouvre SON flux ; les retours ramènent au point d'entrée ; plus aucun bouton chapitre/diapo dans l'écran IA d'une feuille ; une feuille ouverte n'est jamais traversée par un écran étranger. P2 ② : cartes (compte, publié, compteur de liaisons) ; « Modifier » édite en place (titre, entrée, une séance, un item — écritures par chemin précis au journal) ; passerelles aller/retour ; compteur qui descend et s'apaise. P3 ③ : cartes + statuts (lié/pas lié) ; Ouvrir = rendu élève ; Lier crée l'item par itemCreer (journal) ; diaporama lié dans une séance supprimée → statut dégradé propre. P4 liaison guidée : pulse des Lier non liés, extinction au lié ; modale pré-orientée sur kind (halo au bon bloc) ; **garde d'atterrissage sur le cas réel du chapitre 1 mélangé** (titres homonymes : l'appariement listé AVANT le clic) ; sommaire proposé, jamais auto. P5 destructions : chapitre publié (garde) → corbeille `_meta/data` puis delete / sans copie ; diaporama lié (garde, item mort → message doux). P6 : hub muet · codepoints · published jamais écrit (journal) · 390 px : les trois tableaux, les trois flux, la garde d'atterrissage. Captures desktop + 390 d'office.

## 8 · Questions au feu vert

Q1 — Le bouton « Construire un chapitre » disparaît de l'écran IA de la feuille (la porte suffit ; inverse de la note 2c « le bouton de l'éditeur subsiste ») : confirmé ?
Q2 — L'éditeur de chapitre ② couvre : titre, entrée, compétences, note élève/type/titre des séances, titre/sous-titre/kind/ordre des items — **sans** l'édition du contenu des feuilles sommaire (qui restent des séances de type sommaire régénérables) : ce périmètre convient ?
Q3 — Observation : la base (identité conforme) porte déjà des marqueurs « SITE-COURS-2e » et « SITE-COURS-3a » (`CH_KINDS` + diaporama, sommaire, déclaration). J'en tiens compte comme existant ; à consigner au registre avec la note « les codes 2x ont servi deux fois ».

**STOP — attente du feu vert de la conscience n°5.**
*[exécutant SITE-COURS-3a]*
